# Exchange Rate Dynamics — dissertation hub

The central page for Nicolas Boitout's doctoral dissertation, *Modélisation de la
dynamique des taux de change avec application aux marchés émergents* (Université
d'Orléans, Sciences Économiques, defended 29 November 2004). It introduces the
four chapters and links each one to its own interactive laboratory.

Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies, no
network requests at runtime — the same constraints the two chapter sites are
built under.

```
site/index.html   the page
site/styles.css   warm-paper palette, light and dark
site/main.js      the theme switch and the three live panels
vercel.json       static hosting, no build, with a strict CSP
```

## The chapters

| | Chapter | Repository |
|---|---|---|
| 1 | Towards a multifractal paradigm of stochastic volatility | [`Multifractal_Volatility`](https://github.com/nboitout/Multifractal_Volatility) |
| 2 | Agent-based financial market simulation | [`PhD_Microsimulation`](https://github.com/nboitout/PhD_Microsimulation) |
| 3 | Empirical Study | in preparation |
| 4 | Speculative Attacks on a Fixed Exchange Rate Market: a Microsimulation | in preparation |

## Pointing the cards at the deployed laboratories

The Chapter 1 and Chapter 2 cards currently link to their repositories, because
neither laboratory is deployed yet. Each link to replace is marked in
`site/index.html` with

```html
<!-- LIVE URL — replace this href when the lab is deployed -->
```

There are two per chapter: the heading link and the “Open the …” link. Replacing
the four `href` values is the whole change. Leave the `Source` links pointing at
GitHub.

Two other marked places expect your own words: `<!-- BIO -->` in the About
section, and `<!-- CONTACT -->` in the sidebar, where an email, LinkedIn or ORCID
link would go if you want them public.

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

These are illustrations, not results. They use tiny populations and short
windows, and no number can be read off them. The chapters' own figures come from
their full models, in their own repositories, where every figure is regenerated
from one run at one fixed seed. The page says so in its footer.

Under `prefers-reduced-motion` every panel renders a single pre-rolled still
instead of animating. Each panel also stops when it scrolls out of view or the
tab is hidden.
