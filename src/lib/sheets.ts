import { createPrivateKey, createSign } from 'node:crypto';

// ---- Types ----

export interface VisitRow {
  timestamp: string;
  event: string;
  readerId: string;
  sessionId: string;
  isReturning: string;
  page: string;
  country: string;
  duration_seconds: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  userAgent: string;
  referer: string;
}

export interface EventRow {
  timestamp: string;
  readerId: string;
  sessionId: string;
  context: string;
  event: string;
  data: string;
  country: string;
  userAgent: string;
  referer: string;
}

export interface LeadRow {
  timestamp: string;
  readerId: string;
  sessionId: string;
  status: string;
  firstName: string;
  familyName: string;
  email: string;
  consent: string;
  source: string;
  country: string;
  pageUrl: string;
  userAgent: string;
  referer: string;
  company: string;
  jobTitle: string;
}

// ---- In-memory cache ----

interface CacheEntry {
  data: string[][];
  ts: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 1000;

// ---- JWT / OAuth ----

function base64url(input: string | Buffer): string {
  const b = typeof input === 'string' ? Buffer.from(input) : input;
  return b.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function loadServiceAccountKey() {
  let pem: string | null = null;

  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_BASE64;
  if (b64?.trim()) {
    const decoded = Buffer.from(b64.trim(), 'base64').toString('utf8');
    if (decoded.includes('PRIVATE KEY')) pem = decoded;
  }

  if (!pem) {
    const raw = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
    if (!raw) throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY(_BASE64) environment variable.');
    pem = raw
      .trim()
      .replace(/^["']|["']$/g, '')
      .replace(/\\r/g, '')
      .replace(/\\+n/g, '\n')
      .replace(/\r/g, '');
  }

  const body = pem
    .replace(/-----BEGIN [^-]+-----/g, '')
    .replace(/-----END [^-]+-----/g, '')
    .replace(/[^A-Za-z0-9+/=]/g, '');

  if (body.length < 1000) {
    throw new Error(`Private key base64 is too short (${body.length} chars) — likely truncated.`);
  }

  const wrapped = body.match(/.{1,64}/g)!.join('\n');
  const canonical = `-----BEGIN PRIVATE KEY-----\n${wrapped}\n-----END PRIVATE KEY-----\n`;
  try {
    return createPrivateKey({ key: canonical, format: 'pem' });
  } catch {
    return createPrivateKey({ key: Buffer.from(body, 'base64'), format: 'der', type: 'pkcs8' });
  }
}

async function getAccessToken(): Promise<string> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  if (!email) throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_EMAIL environment variable.');
  const privateKey = loadServiceAccountKey();

  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    iss: email,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }));

  const signingInput = `${header}.${payload}`;
  const sign = createSign('RSA-SHA256');
  sign.update(signingInput);
  const jwt = `${signingInput}.${base64url(sign.sign(privateKey))}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!res.ok) throw new Error(`Failed to get Google access token: ${await res.text()}`);
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

function extractSpreadsheetId(raw: string): string {
  return raw.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1] ?? raw.trim();
}

// ---- Fetch sheet data ----

async function fetchSheetData(spreadsheetId: string, sheetName: string): Promise<string[][]> {
  const cacheKey = `${spreadsheetId}:${sheetName}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) return cached.data;

  const accessToken = await getAccessToken();
  const range = encodeURIComponent(`${sheetName}!A:ZZ`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    const err = await res.text();
    // A not-yet-created tab returns 400 "Unable to parse range" — treat as empty.
    if (res.status === 400 && /Unable to parse range/i.test(err)) {
      cache.set(cacheKey, { data: [], ts: Date.now() });
      return [];
    }
    throw new Error(`Failed to fetch "${sheetName}": ${err}`);
  }

  const json = (await res.json()) as { values?: string[][] };
  const rows = json.values ?? [];
  cache.set(cacheKey, { data: rows, ts: Date.now() });
  return rows;
}

// ---- Map rows to typed objects (column order is authoritative — never reorder) ----

function rowsToVisits(rows: string[][]): VisitRow[] {
  if (rows.length < 2) return [];
  return rows.slice(1).map((r) => ({
    timestamp: r[0] ?? '',
    event: r[1] ?? '',
    readerId: r[2] ?? '',
    sessionId: r[3] ?? '',
    isReturning: r[4] ?? '',
    page: r[5] ?? '',
    country: r[6] ?? '',
    duration_seconds: r[7] ?? '',
    utm_source: r[8] ?? '',
    utm_medium: r[9] ?? '',
    utm_campaign: r[10] ?? '',
    utm_content: r[11] ?? '',
    utm_term: r[12] ?? '',
    userAgent: r[13] ?? '',
    referer: r[14] ?? '',
  }));
}

function rowsToEvents(rows: string[][]): EventRow[] {
  if (rows.length < 2) return [];
  return rows.slice(1).map((r) => ({
    timestamp: r[0] ?? '',
    readerId: r[1] ?? '',
    sessionId: r[2] ?? '',
    context: r[3] ?? '',
    event: r[4] ?? '',
    data: r[5] ?? '',
    country: r[6] ?? '',
    userAgent: r[7] ?? '',
    referer: r[8] ?? '',
  }));
}

function rowsToLeads(rows: string[][]): LeadRow[] {
  if (rows.length < 2) return [];
  return rows.slice(1).map((r) => ({
    timestamp: r[0] ?? '',
    readerId: r[1] ?? '',
    sessionId: r[2] ?? '',
    status: r[3] ?? '',
    firstName: r[4] ?? '',
    familyName: r[5] ?? '',
    email: r[6] ?? '',
    consent: r[7] ?? '',
    source: r[8] ?? '',
    country: r[9] ?? '',
    pageUrl: r[10] ?? '',
    userAgent: r[11] ?? '',
    referer: r[12] ?? '',
    company: r[13] ?? '',
    jobTitle: r[14] ?? '',
  }));
}

// ---- Exclusions ----

function excludedSet(envVar: string | undefined): Set<string> {
  return new Set((envVar ?? '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean));
}

// ---- Fetch all sheets ----

async function fetchSheetSafe(spreadsheetId: string, sheetName: string): Promise<{ rows: string[][]; error: string | null }> {
  try {
    return { rows: await fetchSheetData(spreadsheetId, sheetName), error: null };
  } catch (err) {
    console.warn(`[sheets] Could not load sheet "${sheetName}":`, err);
    return { rows: [], error: String(err) };
  }
}

export async function fetchAllSheets(): Promise<{
  visits: VisitRow[];
  events: EventRow[];
  leads: LeadRow[];
  errors: Record<string, string>;
}> {
  const spreadsheetId = extractSpreadsheetId(process.env.GOOGLE_SHEETS_ID ?? '');
  if (!spreadsheetId) throw new Error('Missing GOOGLE_SHEETS_ID environment variable.');

  const [visitsResult, eventsResult, leadsResult] = await Promise.all([
    fetchSheetSafe(spreadsheetId, 'Visits'),
    fetchSheetSafe(spreadsheetId, 'Events'),
    fetchSheetSafe(spreadsheetId, 'Leads'),
  ]);

  const errors: Record<string, string> = {};
  if (visitsResult.error) errors['Visits'] = visitsResult.error;
  if (eventsResult.error) errors['Events'] = eventsResult.error;
  if (leadsResult.error) errors['Leads'] = leadsResult.error;

  const excludedReaderIds = excludedSet(process.env.EXCLUDED_READER_IDS);

  const allVisits = rowsToVisits(visitsResult.rows).filter((v) => !v.page.includes('/admin'));
  const allEvents = rowsToEvents(eventsResult.rows);
  const allLeads = rowsToLeads(leadsResult.rows);

  const BOT_UA = /bot|crawl|spider|slurp|mediapartners|bingpreview|headless|phantomjs|python-requests|curl|wget|httpclient|go-http-client|java\/|okhttp|axios|node-fetch|libwww|scrapy/i;

  const visits = allVisits.filter(
    (v) => !excludedReaderIds.has(v.readerId.toLowerCase()) && !BOT_UA.test(v.userAgent ?? '')
  );
  const events = allEvents.filter((e) => !excludedReaderIds.has(e.readerId.toLowerCase()));
  const leads = allLeads.filter((l) => !excludedReaderIds.has(l.readerId.toLowerCase()));

  return { visits, events, leads, errors };
}
