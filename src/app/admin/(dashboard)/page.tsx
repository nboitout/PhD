import { fetchAllSheets } from '@/lib/sheets';
import Scorecard from '@/components/admin/Scorecard';
import AdminStackedCountryChart, { StackedTimePoint } from '@/components/admin/AdminStackedCountryChart';
import AdminPieChart, { PieDataPoint } from '@/components/admin/AdminPieChart';
import DaySelect from '@/components/admin/DaySelect';
import { CHART_OTHER, CHART_PALETTE } from '@/components/admin/chartPalette';
import { fmtRo, roDate, roHour, fmtDuration } from '@/lib/adminFormat';
import { perVisitSeconds, type LeaveLike } from '@/lib/dwell';
import { deriveVisits } from '@/lib/visitAnalytics';

export const dynamic = 'force-dynamic';

function formatPct(n: number) {
  return `${n.toFixed(1)}%`;
}

function avgDuration(rows: LeaveLike[]): number {
  const visits = perVisitSeconds(rows);
  if (visits.length === 0) return 0;
  return visits.reduce((a, b) => a + b, 0) / visits.length;
}

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
function countryLabel(code: string): string {
  if (!/^[A-Za-z]{2}$/.test(code)) return code || 'Unknown';
  try {
    return regionNames.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

export default async function AdminOverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ day?: string }>;
}) {
  const { day } = await searchParams;
  let visits, events, leads, errors;
  try {
    ({ visits, events, leads, errors } = await fetchAllSheets());
  } catch (err) {
    return (
      <main className="adm-page">
        <div className="adm-error-box">
          <p>Dashboard error</p>
          <pre>{String(err)}</pre>
        </div>
        <p className="adm-page-sub">
          Check that GOOGLE_SHEETS_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL and
          GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_BASE64 are set, and that the sheet is shared with
          the service account as a Viewer. docs/admin-analytics-setup.md walks through it.
        </p>
      </main>
    );
  }

  const errorEntries = Object.entries(errors ?? {});

  // --- Human-qualified visits ------------------------------------------
  // A visit groups a visitor's activity until a 30-minute inactivity gap. It
  // qualifies with 8s+ of active dwell, a second page view, or an interaction
  // (a tracked event or a form submission). Everything below counts qualified
  // visits only; raw rows stay available in the Visits inspector.
  const leadInteractions = leads.map((l) => ({ timestamp: l.timestamp, readerId: l.readerId, event: 'lead_submit' }));
  const observedVisits = deriveVisits(visits, [...events, ...leadInteractions]);
  const qualifiedVisits = observedVisits.filter((v) => v.qualified);
  const filteredShortVisits = observedVisits.length - qualifiedVisits.length;
  const pageVisits = qualifiedVisits.map((v) => ({ timestamp: v.startedAt, readerId: v.readerId, country: v.country }));
  const utmByReader = new Map<string, string>();
  visits.forEach((v) => {
    const key = v.readerId.toLowerCase();
    if (v.event === 'page_visit' && v.utm_source && !utmByReader.has(key)) utmByReader.set(key, v.utm_source);
  });

  const uniqueVisitors = new Set(qualifiedVisits.map((v) => v.readerId)).size;
  const totalVisits = qualifiedVisits.length;

  // --- Leads: distinct people who left an address ---
  const totalLeads = new Set(leads.map((l) => l.email.toLowerCase()).filter(Boolean)).size;
  const convRate = uniqueVisitors > 0 ? (totalLeads / uniqueVisitors) * 100 : 0;

  // --- Return visitor rate: distinct visitors seen on more than one distinct date ---
  const visitorDates = new Map<string, Set<string>>();
  pageVisits.forEach((v) => {
    if (!visitorDates.has(v.readerId)) visitorDates.set(v.readerId, new Set());
    visitorDates.get(v.readerId)!.add(roDate(v.timestamp));
  });
  const totalVisitors = visitorDates.size;
  const returningVisitors = [...visitorDates.values()].filter((dates) => dates.size > 1).length;
  const returnRate = totalVisitors > 0 ? (returningVisitors / totalVisitors) * 100 : 0;

  // --- Avg homepage dwell time ---
  const avgHome = avgDuration(
    visits.filter((v) => {
      if (v.event !== 'page_leave') return false;
      const p = v.page.replace(/^https?:\/\/[^/]+/, '');
      return p === '/' || p === '';
    })
  );

  // --- Stacked bar: unique visitors per day, stacked by country (top 10 + Other) ---
  const countryVisitors = new Map<string, Set<string>>();
  pageVisits.forEach((v) => {
    const c = countryLabel(v.country || 'Unknown');
    if (!countryVisitors.has(c)) countryVisitors.set(c, new Set());
    if (v.readerId) countryVisitors.get(c)!.add(v.readerId);
  });
  const topCountries = [...countryVisitors.entries()]
    .sort((a, b) => b[1].size - a[1].size)
    .slice(0, 10)
    .map(([c]) => c);
  const topCountrySet = new Set(topCountries);
  const stackedCountries = [...topCountries, 'Other'];

  const perDate = new Map<string, Map<string, Set<string>>>();
  pageVisits.forEach((v) => {
    const date = roDate(v.timestamp);
    const c = countryLabel(v.country || 'Unknown');
    const key = topCountrySet.has(c) ? c : 'Other';
    if (!perDate.has(date)) perDate.set(date, new Map());
    const m = perDate.get(date)!;
    if (!m.has(key)) m.set(key, new Set());
    if (v.readerId) m.get(key)!.add(v.readerId);
  });

  const earliestVisit = pageVisits.reduce<string | null>((min, v) => {
    const d = roDate(v.timestamp);
    if (!d) return min;
    return !min || d < min ? d : min;
  }, null);
  const todayRo = roDate(new Date());
  const rangeStart = earliestVisit ?? todayRo;
  const stackedData: StackedTimePoint[] = [];
  for (let d = new Date(rangeStart + 'T12:00:00Z'); d.toISOString().slice(0, 10) <= todayRo; d.setUTCDate(d.getUTCDate() + 1)) {
    const entry: StackedTimePoint = { date: d.toISOString().slice(0, 10) };
    stackedCountries.forEach((c) => { entry[c] = 0; });
    stackedData.push(entry);
  }
  const dateMap = new Map(stackedData.map((d) => [d.date as string, d]));
  for (const [date, m] of perDate) {
    const entry = dateMap.get(date);
    if (!entry) continue;
    for (const [key, set] of m) entry[key] = set.size;
  }

  // --- Pie chart: visits by traffic source (UTM source, else 'Direct / Referral') ---
  const sourceCount = new Map<string, number>();
  qualifiedVisits.forEach((v) => {
    const s = utmByReader.get(v.readerId) || 'Direct / Referral';
    sourceCount.set(s, (sourceCount.get(s) ?? 0) + 1);
  });
  const sourceData: PieDataPoint[] = [...sourceCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  // --- All-time unique visitors by country ---
  const allTimeCountry = new Map<string, Set<string>>();
  pageVisits.forEach((v) => {
    const c = countryLabel(v.country || 'Unknown');
    if (!allTimeCountry.has(c)) allTimeCountry.set(c, new Set());
    if (v.readerId) allTimeCountry.get(c)!.add(v.readerId);
  });
  const countryRows = [...allTimeCountry.entries()]
    .map(([country, set]) => ({ country, count: set.size }))
    .sort((a, b) => b.count - a.count);
  const allTimeVisitsTotal = countryRows.reduce((sum, r) => sum + r.count, 0);

  // --- Intraday: visits per hour for a selected day (Romania time), by country ---
  const selectedDay = day && /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : todayRo;
  const dayOptions = [...new Set([todayRo, ...pageVisits.map((v) => roDate(v.timestamp))])]
    .sort((a, b) => (a < b ? 1 : -1));
  const dayVisits = pageVisits.filter((v) => roDate(v.timestamp) === selectedDay);
  const dayVisitorCount = new Set(dayVisits.map((v) => v.readerId).filter(Boolean)).size;
  const dayCountryVisitors = new Map<string, Set<string>>();
  dayVisits.forEach((v) => {
    const c = countryLabel(v.country || 'Unknown');
    if (!dayCountryVisitors.has(c)) dayCountryVisitors.set(c, new Set());
    if (v.readerId) dayCountryVisitors.get(c)!.add(v.readerId);
  });
  const dayTopCountries = [...dayCountryVisitors.entries()]
    .sort((a, b) => b[1].size - a[1].size)
    .slice(0, 10)
    .map(([c]) => c);
  const dayTopSet = new Set(dayTopCountries);
  const intradayCountries = [...dayTopCountries, 'Other'];
  const hourSets: Map<string, Set<string>>[] = Array.from({ length: 24 }, () => new Map());
  dayVisits.forEach((v) => {
    const hour = roHour(v.timestamp);
    if (isNaN(hour) || hour < 0 || hour > 23) return;
    const c = countryLabel(v.country || 'Unknown');
    const key = dayTopSet.has(c) ? c : 'Other';
    const m = hourSets[hour];
    if (!m.has(key)) m.set(key, new Set());
    if (v.readerId) m.get(key)!.add(v.readerId);
  });
  const intradayData: StackedTimePoint[] = [];
  for (let h = 0; h < 24; h++) {
    const entry: StackedTimePoint = { date: `${String(h).padStart(2, '0')}:00` };
    intradayCountries.forEach((c) => { entry[c] = hourSets[h].get(c)?.size ?? 0; });
    intradayData.push(entry);
  }

  // One colour per country, shared by both bar charts.
  const countryColors: Record<string, string> = { Other: CHART_OTHER };
  [...new Set([...stackedCountries, ...intradayCountries])]
    .filter((c) => c !== 'Other')
    .sort()
    .forEach((c, i) => { countryColors[c] = CHART_PALETTE[i % CHART_PALETTE.length]; });

  return (
    <main className="adm-page">
      <div className="adm-page-header">
        <div>
          <p className="adm-page-eyebrow">Dashboard</p>
          <h1 className="adm-page-title">Overview</h1>
          <p className="adm-page-sub">Updated {fmtRo(new Date(), { withSeconds: true })} (Romania)</p>
        </div>
      </div>

      {errorEntries.length > 0 && (
        <div className="adm-error-box">
          <p>Sheet loading errors</p>
          {errorEntries.map(([sheet, msg]) => (
            <pre key={sheet}>{sheet}: {msg}</pre>
          ))}
        </div>
      )}

      <div className="adm-scorecards">
        <Scorecard label="Unique Visitors" value={uniqueVisitors.toLocaleString()} />
        <Scorecard label="Total Visits" value={totalVisits.toLocaleString()} subtitle="30-minute inactivity window" />
        <Scorecard label="Filtered Visits" value={filteredShortVisits.toLocaleString()} subtitle="&lt;8s, one page, no interaction" />
        <Scorecard label="Total Leads" value={totalLeads.toLocaleString()} subtitle="distinct people who left an address" />
        <Scorecard label="Conversion Rate" value={formatPct(convRate)} subtitle="visitors → leads" />
        <Scorecard label="Return Visitor Rate" value={formatPct(returnRate)} subtitle="came back on a later day" />
        <Scorecard label="Avg Time — Homepage" value={fmtDuration(avgHome)} subtitle="active dwell, page_leave events" />
      </div>

      <p className="adm-section-title">Visitors by day and country</p>
      <div className="adm-chart-card" style={{ marginBottom: 24 }}>
        <p className="adm-chart-title">Daily unique visitors by country (top 10)</p>
        <AdminStackedCountryChart data={stackedData} countries={stackedCountries} colorMap={countryColors} />
      </div>

      <div className="adm-chart-card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <p className="adm-chart-title" style={{ marginBottom: 0 }}>
            By hour ({selectedDay}{selectedDay === todayRo ? ', today' : ''}, Romania time) — {dayVisitorCount.toLocaleString()} visitors
          </p>
          <DaySelect days={dayOptions} selected={selectedDay} today={todayRo} />
        </div>
        <AdminStackedCountryChart
          data={intradayData}
          countries={intradayCountries}
          labelMode="raw"
          interval={2}
          colorMap={countryColors}
        />
      </div>

      <div className="adm-charts-grid">
        <div className="adm-chart-card">
          <p className="adm-chart-title">All-time unique visitors by country</p>
          <p className="adm-page-sub" style={{ marginTop: -12, marginBottom: 16 }}>
            All dates · {allTimeVisitsTotal.toLocaleString()} visitors
          </p>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Country</th>
                  <th>Visitors</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {countryRows.map((row) => (
                  <tr key={row.country}>
                    <td>{row.country}</td>
                    <td>{row.count.toLocaleString()}</td>
                    <td className="muted">
                      {allTimeVisitsTotal > 0 ? formatPct((row.count / allTimeVisitsTotal) * 100) : '—'}
                    </td>
                  </tr>
                ))}
                {countryRows.length === 0 && (
                  <tr>
                    <td colSpan={3} className="muted">No data yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="adm-chart-card">
          <p className="adm-chart-title">Traffic sources</p>
          <AdminPieChart data={sourceData} />
        </div>
      </div>
    </main>
  );
}
