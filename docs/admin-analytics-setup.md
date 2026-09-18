# /admin dashboard + visitor analytics — setup

A password-gated `/admin` dashboard for nicolas-boitout.phd, backed by a single
self-hosted Google Sheet. No third-party analytics: the data is yours and it
lives in a spreadsheet you own. There are two independent connections to
Google, and they are set up separately.

- **Write path:** browser → `/api/visit` and `/api/track` → Google Apps Script
  web app → Google Sheet (`Visits` / `Events` / `Leads` tabs).
- **Read path:** the `/admin` server pages → Sheets API v4, authenticated with
  a service-account JWT → the same Google Sheet.

The admin has two tabs: **Overview** (scorecards, visitors by day and country,
a by-hour chart with a day picker, an all-time country table and a traffic
sources pie) and **Visits** (one row per visitor per day, newest first).
All dates, times and day/hour bucketing are in **Europe/Bucharest**, labelled
"(Romania)".

> This needs a Node server runtime — API routes, cookies, `after()` and the
> `/admin` proxy. The site is on Vercel (project `ph-d`), which provides it.
> The site used to be deployed as a plain static directory (`outputDirectory:
> "site"`); it is now a Next.js app, and `vercel.json` says `"framework":
> "nextjs"`. Nothing else about the hosting changed.

## What you have to do

Four things, in this order. Steps 1–3 are one-time Google setup; step 4 is
pasting five values into Vercel.

### 1. The Google Sheet

Create a spreadsheet — anything, an empty one is fine. The `Visits`, `Events`
and `Leads` tabs are created with their headers on the first write, so you do
not need to make them yourself.

From its URL —
`https://docs.google.com/spreadsheets/d/<THIS PART>/edit` — take the long id
and keep it for `GOOGLE_SHEETS_ID`. (A full URL also works; the code extracts
the id.)

### 2. The Apps Script (the write path)

**The script must be bound to this new sheet.** In the sheet: Extensions →
Apps Script. Delete whatever is in the editor and paste in the whole of
`scripts/apps-script/Code.gs` from this repository. Save.

Then Deploy → New deployment → Web app:

- Execute as: **Me**
- Who has access: **Anyone** — *not* "Anyone with a Google account", which
  breaks it

Copy the resulting `/exec` URL: that is `APPS_SCRIPT_URL`.

**Now open that `/exec` URL in a browser.** It must answer
`{"ok":true,"service":"nicolas-boitout.phd visitor analytics"}`. If instead it
shows a "this app needs your permission / Review permissions" page, the script
has never been authorized and **every write will fail silently** — the site
will look fine and the sheet will stay empty. Fix it here: Review permissions
→ pick your account → Advanced → "Go to … (unsafe)" → Allow. Then reload the
`/exec` URL and confirm you get the JSON.

To change the script later *without* changing the URL: Manage deployments →
edit the existing deployment (pencil) → Version: New version → Deploy. A fresh
"New deployment" mints a different URL and you would have to update
`APPS_SCRIPT_URL`.

### 3. The service account (the read path)

In a Google Cloud project:

1. Enable the **Google Sheets API**.
2. Create a service account, then create a **JSON key** for it and download it.
3. From that JSON:
   - `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key`, base64-encoded → `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_BASE64`

   ```
   node -e "console.log(Buffer.from(require('./key.json').private_key).toString('base64'))"
   ```

You can reuse the service account from another project of yours — nothing
about it is per-site. What is per-site is the share in the next step.

4. **Share the sheet with that service account as a Viewer.** Open the sheet →
   Share → paste the *full* `...@<project>.iam.gserviceaccount.com` address.
   Google's autocomplete likes to show it truncated with an ellipsis; make sure
   the whole address goes in. Role: **Viewer**. Without this share, `/admin`
   answers with a 403 from the Sheets API.

### 4. Environment variables on Vercel

Set these in the `ph-d` project → Settings → Environment Variables, for
**Production and Preview** both:

| Variable | Value |
| --- | --- |
| `ADMIN_PASSWORD` | whatever should unlock `/admin` |
| `APPS_SCRIPT_URL` | the `/exec` URL from step 2 |
| `GOOGLE_SHEETS_ID` | the sheet id from step 1 |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `client_email` from step 3 |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_BASE64` | base64 private key from step 3 |
| `EXCLUDED_READER_IDS` | optional, comma-separated `reader_id` values to hide |

**Then redeploy.** Environment variable changes do not reach a build that has
already run — Deployments → ⋯ → Redeploy on the latest production deployment.

For local work, copy `.env.example` to `.env.local` and fill in the same
values. `.env*.local` is gitignored; never commit it.

## Verification

1. `npm run build` compiles with no type errors.
2. **In an incognito window**, open the site and read for ten seconds, then
   close the tab. A `page_visit` row and a `page_leave` row appear in the
   `Visits` tab within a second or two. Incognito matters — see below.
3. Open `/admin` while signed out → redirected to `/admin/login`.
4. A wrong password shows "Invalid password"; the right one lands on Overview.
5. Both tabs render; the visit from step 2 shows up in **Visits** with its
   country, device, pages and dwell.

## Gotchas — all of these have bitten us

- **Your own test rows go missing on purpose.** Signing into `/admin` stamps a
  long-lived `internal_traffic` cookie, and `/api/visit` and `/api/track` drop
  anything from a browser carrying it. That is the point of the feature, and
  it means your normal browser will never appear in the sheet again. Test
  tracking in an **incognito window**.
- **An unauthorized Apps Script fails silently.** Covered in step 2: if the
  `/exec` URL shows a permissions page rather than `{"ok":true,...}`, nothing
  is ever written. This is the single most common cause of "the dashboard is
  empty".
- **"Anyone with a Google account"** as the deployment's access setting breaks
  the write path. It must be **Anyone**.
- **A new deployment changes the URL.** Edit the existing deployment and add a
  new version instead, or update `APPS_SCRIPT_URL` afterwards.
- **The service-account share needs the full address**, ending in
  `.iam.gserviceaccount.com`, with **Viewer** access. Truncated, or not shared
  at all, and the admin gets a 403.
- **Use the base64 private key.** A raw PEM in an environment variable gets its
  newlines mangled and fails with `asn1 … header too long`. (`src/lib/sheets.ts`
  does normalize a raw PEM aggressively as a fallback, but do not rely on it.)
- **Env var changes need a redeploy**, and Vercel scopes them per environment —
  set them for Production *and* Preview.
- **A tab that does not exist yet** returns a 400 "Unable to parse range" from
  the Sheets API; `src/lib/sheets.ts` treats that as empty data rather than an
  error, so an untouched sheet renders a zeroed dashboard instead of a crash.
- **`next dev` blocks scripts on `127.0.0.1`**, so the page will not hydrate
  there and the opening panel and the login form will look dead. Use
  `http://localhost:3000`, or `npm run build && npm start`.

## How a visit is counted

The raw sheet holds one row per `page_visit` and one per `page_leave` (with
active dwell in seconds — time the tab was actually visible, not wall clock).
The Overview does not count those rows directly. `src/lib/visitAnalytics.ts`
groups each visitor's activity into **visits**, cutting a new one after 30
minutes of inactivity, and counts a visit as *qualified* when it has at least
8 seconds of active dwell, **or** two page views, **or** an interaction. Every
Overview number is qualified visits only; the ones that did not qualify are
reported as "Filtered Visits" so the filtering is visible rather than silent.

The **Visits** tab is the unfiltered inspector: it shows one row per visitor
per calendar day, from the raw `page_visit` rows, newest first, capped at 250.

Bots are dropped by user-agent in `src/lib/sheets.ts`, and anything whose page
path contains `/admin` is dropped too.

## Where things live

| Path | What it does |
| --- | --- |
| `src/proxy.ts` | Redirects `/admin/*` to the login page without a session cookie; stamps `internal_traffic` |
| `src/app/api/visit/route.ts` | `page_visit` / `page_leave` beacons → Apps Script; sets `reader_id` |
| `src/app/api/track/route.ts` | Arbitrary interaction events → Apps Script |
| `src/app/api/admin/auth/route.ts` | Password check; sets/clears `admin_session` |
| `src/components/VisitTracker.tsx` | Sends the beacons; measures active dwell; captures UTM |
| `src/lib/sheets.ts` | Sheets API v4 read path, service-account JWT, 60s cache |
| `src/lib/visitAnalytics.ts` | Visit derivation and the qualified/filtered rule |
| `src/lib/adminFormat.ts` | Europe/Bucharest formatting and day/hour bucketing |
| `src/app/admin/…` | Login, dashboard layout, Overview, Visits |
| `scripts/apps-script/Code.gs` | The Apps Script to paste into the sheet |
