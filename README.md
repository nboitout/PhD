# Exchange Rate Dynamics — dissertation hub

The central page for Nicolas Boitout's doctoral dissertation, *Modélisation de la
dynamique des taux de change avec application aux marchés émergents* (Université
d'Orléans, Sciences Économiques, defended 29 November 2004). It introduces the
four chapters and links each one to its own interactive laboratory. The three
that are live are shown as the applications they are, not described.

A Next.js app on Vercel. The design is **instrument dark**: a near-black ground,
so the three running models read as instruments rather than as illustrations of
a manuscript. The work is from 2004; the page is not, and nothing on it is
antiqued. The server runtime also carries `/admin` — the visitor analytics and
the dashboard that reads them (see `docs/admin-analytics-setup.md`). The page
fetches nothing at runtime beyond its own analytics beacon.

**Colour means quantity.** Signal gold is an arrival or an action, price cyan is
a price, intensity teal is an intensity. Nothing is coloured decoratively, so a
coloured line on this site always means something — the same rule the opening
panel paints by. One display serif (Instrument Serif) carries the period against
IBM Plex Sans and Mono for body and data, self-hosted by `next/font` because the
deployed CSP allows `font-src 'self'` only.

```
src/app/page.tsx          the page
src/app/bibliography/     the 353 references, searchable, at /bibliography
src/lib/bibliography.ts   those references as data: authors, year, container, DOI
src/app/globals.css       the instrument-dark system: tokens, then section by section
src/lib/siteRuntime.js    the photographs, the opening panel and its dials
src/app/admin/            the password-gated dashboard: Overview and Visits
src/app/api/              visit / track beacons and the admin password check
src/lib/                  Sheets read path, visit derivation, dwell, formatting
public/assets/            the printed cover, three prints, three laboratory screenshots
scripts/apps-script/      the Apps Script that writes rows into the Google Sheet
vercel.json               framework nextjs, with a CSP
```

## The admin dashboard

`/admin` is password-gated (`ADMIN_PASSWORD`) and has two tabs — an **Overview**
of qualified visits, countries, hours and traffic sources, and a **Visits**
inspector with one row per visitor per day. The data is self-hosted in a Google
Sheet you own; nothing is sent to a third-party analytics service. Signing into
the admin marks your own browser as internal traffic, so your own browsing never
lands in the sheet.

Everything it needs is in **`docs/admin-analytics-setup.md`** — the Apps Script,
the service account, the sheet share, the environment variables, and the
mistakes that cost us an afternoon each.

## The bibliography

`/bibliography` is the manuscript's own reference list — 353 entries, alphabetical
by first author — restandardized to APA 7th and repaired where the printed copy
was damaged. Working papers that were later published carry their final journal
and volume; 290 of the entries resolve to a DOI, and the 63 that do not are
working papers, conference papers and unpublished manuscripts, cited as the
manuscript cited them. Nothing absent from the 2004 list was added.

The entries live in `src/lib/bibliography.ts` as data, not markup: `r` is
everything after the year, and a pair of asterisks in it marks italics —
`renderSegments` is the only thing that reads them, so no markup is injected into
the page. The whole list renders on the server, so it is readable and indexable
with JavaScript off; the search box narrows markup that is already there.
Numbering is stable, and each entry is its own anchor (`/bibliography#ref-41`).

## The chapters

| | Chapter | Laboratory | Source |
|---|---|---|---|
| 1 | Towards a multifractal paradigm of stochastic volatility | [multifractal-volatility.vercel.app](https://multifractal-volatility.vercel.app/) | [`Multifractal_Volatility`](https://github.com/nboitout/Multifractal_Volatility) |
| 2 | Agent-based financial market simulation | [phd-microsimulation.vercel.app](https://phd-microsimulation.vercel.app/) | [`PhD_Microsimulation`](https://github.com/nboitout/PhD_Microsimulation) |
| 3 | Empirical Study | [ph-d-empirical-study.vercel.app](https://ph-d-empirical-study.vercel.app/) | [`PhD_Empirical_Study`](https://github.com/nboitout/PhD_Empirical_Study) |
| 4 | Speculative Attacks on a Fixed Exchange Rate Market: a Microsimulation | in preparation | |

## The page's shape

The laboratories are the page. It opens on **the bench**: the dissertation's
title and claim beside the through-line panel — Chapter 1's cascade driving
Chapter 2's random trading time — with two of the model's own parameters under
the visitor's hand, and under the claim the two artefacts, the photograph of
the printed copy and the carousel of prints from the thesis years. Both are
things to click, and they are in the opening because a visitor who knows the
author reaches for them before anything else. Then **Three laboratories you can
operate**, the three
chapter cards, each showing a screenshot of the application it links to and a
list of what can be done in it. Chapter Four follows as a slim "in preparation"
strip rather than a fourth, empty card.

Below the laboratories, **A personal note, 23 years later** — the note written in
September 2026 on returning to the manuscript — beside the carousel of prints
from the thesis years and the one-minute-against-one-year pair. Then **Why I
approached currency crises this way**, which carries the intuition in the first
person. **Provenance** places the printed copy with the degree, the defence and
the publication, and **Defence and jury** closes the page.

The order is deliberate. The page opens on an instrument rather than a title
block: a visitor who works in markets has their hands on the model before the
first paragraph ends. The 2004 material — the note, the intuition, the printed
copy, the jury — follows the laboratories rather than framing them.

**The spine** is the one section with no equivalent in the printed work. The
through-line used to live in a `figcaption` under the opening panel; it is the
dissertation's actual argument, so it is drawn, and it is what gives Chapter
Four a reason to be on the page rather than an apology for being missing.

The carousel does not reserve layout space before it loads — `siteRuntime.js`
reveals it only once a photograph has actually decoded, so a missing file leaves
no gap rather than an empty box. The same goes for the printed cover, which
falls back to a typeset facsimile of the title page.

The page is **dark only**. There is no theme switch: the design is built on one
ground, and a light variant would need its own data colours rather than a
token swap.

## Where the cards point

Each live chapter card carries three links to its deployed laboratory — the
screenshot, the heading and the "Run the …" link — and one `Source` link to its
repository. If a laboratory moves, the three `href` values per chapter in
`src/app/page.tsx`, plus the `.shot-url` label that names the host, are the whole
change.

## The screenshots

Each card shows the laboratory it links to. `public/assets/lab-ch1.jpg`,
`lab-ch2.jpg` and `lab-ch3.jpg` are 1240×620 captures of the three applications,
framed on the part of each one worth advertising: Chapter 1's controls beside the
cascade tree, Chapter 2's four dials with the price and population panels, and
Chapter 3's measured d̂(q) against the reported Alcatel table. Copies are kept at
`source/shots/`.

They are captures of the applications themselves, not mock-ups, and they are
shown whole — the CSS never re-crops them, because a crop applied at card width
would silently re-frame each one onto whatever happened to be at its top.

To refresh one after a laboratory changes, serve that laboratory locally and
capture a 1240×620 viewport scrolled to the same place. The three applications
are light-themed only, so there is one capture each; the page takes them down
with a `brightness` filter so they do not glare against the near-black ground,
and restores them on hover, rather than pretending a dark variant exists.

## The printed cover

`public/assets/cover.jpg` is the photograph of the author's own printed copy. It is
the supplied photograph, cropped only to remove the dark strip down the left edge
of the original frame and scaled to a 1600px long edge — 1136×1600, 357 KB. The
paper, the shadow and the angle it was shot at are left as they were. The
full-resolution original is kept at `source/cover-original.jpeg`, outside the
deployed tree.

The photograph links to itself at full size, where the jury at the foot of the page
is legible.

Should the file ever go missing, `src/lib/siteRuntime.js` tries `cover.png` once and then
reveals a **typeset facsimile** of the title page in its place, retitling the
caption from “The printed copy” to “The title page” so a stand-in is never passed
off as the real object. That swap lives in `src/lib/siteRuntime.js` rather than
an inline `onerror`, because the deployed Content-Security-Policy forbids inline
handlers.

## Still to supply

- The `VOICE` comment in `src/app/page.tsx` marks the intuition section. It is written
  in the first person, drawn from the introduction of Chapter 2, and is meant to
  be edited until it sounds like you rather than like a summary of you.
- A caption for the first photograph, and a third photograph. `public/assets/README.md`
  says where both go.
- The `CONTACT` comment in the sidebar of the intuition section, where the email and
  LinkedIn links go. The markup is written out in the comment and needs only the
  addresses; until they are supplied the page offers no route to the author
  except GitHub, which is the one thing a reader who is convinced by the
  laboratories cannot do anything with.

## Run locally

```sh
npm install
npm run dev
```

Then open <http://localhost:3000>. Use `localhost`, not `127.0.0.1`: Next's dev
server blocks its own scripts on the bare IP, and the page will not hydrate —
the opening panel and the login form look dead. `npm run build && npm start`
serves the production build instead, on the same port.

For anything under `/admin`, copy `.env.example` to `.env.local` first and set at
least `ADMIN_PASSWORD`. Without the Google variables the dashboard still renders;
it shows the configuration error in place of the data.

## Deploy on Vercel

The repository is the Vercel project `ph-d` (<https://www.nicolas-boitout.phd>).
`vercel.json` sets `"framework": "nextjs"` and a Content-Security-Policy that
allows no external scripts, styles, fonts or connections — `connect-src 'self'`
covers the analytics beacon, and `'unsafe-inline'` is there for the framework's
own hydration and theme scripts. The environment variables the dashboard needs
are listed in `docs/admin-analytics-setup.md`; changing one requires a redeploy.

The project's **Output Directory** must be left unset. It was pinned to `site`
while this was a static deployment, and `vercel.json` no longer says anything
about it, so the first deployment after the migration built `next build`
correctly and then failed with `NEXT_OUTPUT_DIR_MISSING` looking for a `site/`
that no longer exists. The override has been cleared in the project settings,
and the project's framework is now `nextjs` there as well as in `vercel.json`.

## The opening panel

The page animates one small model on a `<canvas>`, seeded so that every visitor
sees the same opening, and it fetches nothing.

A finite dyadic lognormal cascade sets the intensity of information arrival;
arrivals are drawn as a Poisson count against that intensity, and the price moves
only on an arrival. It is Chapter 1's cascade driving Chapter 2's random trading
time, which is the through-line of the dissertation.

The panel stretches to the height of the column beside it, and its canvas takes
whatever height is left over, so the artefacts row costs the page far less than
a band of its own would. Its three bands are proportions with limits rather than
one fixed split: giving the intensity band the remainder instead made it grow
faster than the price chart and take over the taller panel.

Two of its parameters are exposed as sliders — the intermittency λ² and the base
arrival rate K̄ — with a button that draws a new tree. Moving λ² rebuilds the
cascade from the current seed, so the same dial position always gives the same
draw and the change arrives as the series evolving rather than as a cut. That the
panel takes input is the point of it: a visitor who works in markets can act on
the model before they have finished reading the sentence beside it.

This is an illustration, not a result. It uses a short window and no number can
be read off it. The chapters' own figures come from their full models, in their
own repositories, where every figure is regenerated from one run at one fixed
seed. The page says so in its footer.

Under `prefers-reduced-motion` the panel renders a single pre-rolled still
instead of animating, and a control change advances it by hand and draws one new
still rather than leaving it showing the state before the change. The panel also
stops when it scrolls out of view or the tab is hidden.

Two further panels — a Chapter 1 volatility series and a Chapter 2 population
band — used to sit inside the chapter cards. The cards now carry screenshots of
the laboratories instead, which say far more about them, so those two models were
removed from the script (then `site/main.js`, now `src/lib/siteRuntime.js`); they are in the history if they are ever wanted back.
