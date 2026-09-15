# Exchange Rate Dynamics — dissertation hub

The central page for Nicolas Boitout's doctoral dissertation, *Modélisation de la
dynamique des taux de change avec application aux marchés émergents* (Université
d'Orléans, Sciences Économiques, defended 29 November 2004). It introduces the
four chapters and links each one to its own interactive laboratory.

Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies, no
network requests at runtime — the same constraints the chapter sites are
built under.

```
site/index.html   the page
site/styles.css   warm-paper palette, light and dark
site/main.js      the theme switch and the three live panels
vercel.json       static hosting, no build, with a strict CSP
```

## The chapters

| | Chapter | Laboratory | Source |
|---|---|---|---|
| 1 | Towards a multifractal paradigm of stochastic volatility | [multifractal-volatility.vercel.app](https://multifractal-volatility.vercel.app/) | [`Multifractal_Volatility`](https://github.com/nboitout/Multifractal_Volatility) |
| 2 | Agent-based financial market simulation | [phd-microsimulation.vercel.app](https://phd-microsimulation.vercel.app/) | [`PhD_Microsimulation`](https://github.com/nboitout/PhD_Microsimulation) |
| 3 | Empirical Study | [ph-d-empirical-study.vercel.app](https://ph-d-empirical-study.vercel.app/) | [`PhD_Empirical_Study`](https://github.com/nboitout/PhD_Empirical_Study) |
| 4 | Speculative Attacks on a Fixed Exchange Rate Market: a Microsimulation | in preparation | |

## The page's shape

The four chapters *are* the hero: the page opens on a short title block beside
the dissertation's title page, and the chapter cards begin within the first
screen. Below them, **A personal note, 23 years later** is the note written in
September 2026 on returning to the manuscript, with a carousel of three
photographs from the econophysics years, the live through-line panel and the
publication details alongside. **Defence and jury** closes the page.

## Where the cards point

Each live chapter card carries two links to its deployed laboratory — the heading
and the “Open the …” link — and one `Source` link to its repository. If a
laboratory moves, the two `href` values per chapter in `site/index.html` are the
whole change.

Chapters 1 and 2 have an animated panel above the card body; Chapter 3 does not,
and is a body-only card.

## The printed cover

`site/assets/cover.jpg` is the photograph of the author's own printed copy. It is
the supplied photograph, cropped only to remove the dark strip down the left edge
of the original frame and scaled to a 1600px long edge — 1136×1600, 357 KB. The
paper, the shadow and the angle it was shot at are left as they were. The
full-resolution original is kept at `source/cover-original.jpeg`, outside the
deployed directory.

The photograph links to itself at full size, where the jury at the foot of the page
is legible.

Should the file ever go missing, `site/main.js` tries `cover.png` once and then
reveals a **typeset facsimile** of the title page in its place, retitling the
caption from “The printed copy” to “The title page” so a stand-in is never passed
off as the real object. That swap lives in `main.js` rather than an inline
`onerror`, because the deployed Content-Security-Policy forbids inline handlers.

## Still to supply

- `<!-- VOICE -->` in `site/index.html` marks the personal note. It is the one
  section on the page that speaks in the present tense, and is meant to be edited
  freely.
- The three photographs themselves. `site/assets/README.md` says where they go and
  which two captions are still blank; until the files are dropped in, the carousel
  removes itself from the page.
- `<!-- CONTACT -->` in the sidebar, where an email, LinkedIn or ORCID link would
  go if you want them public.

## Run locally

```sh
python -m http.server 8000 --bind 127.0.0.1 --directory site
```

Then open <http://localhost:8000>. There is nothing to install and nothing to
compile.

## Deploy on Vercel

Import the repository and accept `vercel.json`: framework none, no build command,
no install command, output directory `site`. The configuration also sets a
Content-Security-Policy that allows no external scripts, styles, fonts or network
connections, which the page does not need.

## The three live panels

The page animates three small models on `<canvas>`, all seeded so that every
visitor sees the same opening and none of them fetch anything.

- **Hero** — a finite dyadic lognormal cascade sets the intensity of information
  arrival; arrivals are drawn as a Poisson count against that intensity, and the
  price moves only on an arrival. It is Chapter 1's cascade driving Chapter 2's
  random trading time, which is the through-line of the dissertation.
- **Chapter 1 card** — the same cascade, shown as the size of returns through
  time, so that the clustering is visible rather than asserted.
- **Chapter 2 card** — a reduced form of the chapter's switching dynamics: two
  chartist camps and a fundamentalist camp, transition rates exponential in the
  opinion index and in momentum, a floor under every share, and a market maker
  moving the price with excess demand.

Chapter 3's card carries no panel: its subject is measured data, and a seeded
illustration next to it would be the one place on this page where a drawing could
be mistaken for a measurement.

These are illustrations, not results. They use tiny populations and short
windows, and no number can be read off them. The chapters' own figures come from
their full models, in their own repositories, where every figure is regenerated
from one run at one fixed seed. The page says so in its footer.

Under `prefers-reduced-motion` every panel renders a single pre-rolled still
instead of animating. Each panel also stops when it scrolls out of view or the
tab is hidden.
