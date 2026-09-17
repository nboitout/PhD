# Exchange Rate Dynamics — dissertation hub

The central page for Nicolas Boitout's doctoral dissertation, *Modélisation de la
dynamique des taux de change avec application aux marchés émergents* (Université
d'Orléans, Sciences Économiques, defended 29 November 2004). It introduces the
four chapters and links each one to its own interactive laboratory. The three
that are live are shown as the applications they are, not described.

Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies, no
network requests at runtime — the same constraints the chapter sites are
built under.

```
site/index.html   the page
site/styles.css   warm-paper palette, light and dark
site/main.js      the theme switch, the photographs, the opening panel and its dials
site/assets/      the printed cover, three prints, three laboratory screenshots
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

The laboratories are the page. It opens on **the bench**: the dissertation's
title and claim beside the through-line panel — Chapter 1's cascade driving
Chapter 2's random trading time — with two of the model's own parameters under
the visitor's hand. Then **Three laboratories you can operate**, the three
chapter cards, each showing a screenshot of the application it links to and a
list of what can be done in it. Chapter Four follows as a slim "in preparation"
strip rather than a fourth, empty card.

Below the laboratories, **A personal note, 23 years later** — the note written in
September 2026 on returning to the manuscript — with a carousel of three prints
from the thesis years. Then **Why I approached currency crises this way**, which
carries the intuition in the first person, with the photograph of the printed
copy and the publication details alongside. **Defence and jury** closes the page.

The order is deliberate and it was changed on purpose. The page used to open on
the title block and the printed cover, then run 530 words of prose before the
first chapter card; the first link into a laboratory sat 2,857px down on a
desktop screen and 4,157px down on a phone — three and five screens
respectively. It is now 1,175px and 2,133px, and the opening screen carries a
working model rather than a picture of one. The page is taller than it was,
because three screenshots were added to it.

## Where the cards point

Each live chapter card carries three links to its deployed laboratory — the
screenshot, the heading and the "Run the …" link — and one `Source` link to its
repository. If a laboratory moves, the three `href` values per chapter in
`site/index.html`, plus the `.shot-url` label that names the host, are the whole
change.

## The screenshots

Each card shows the laboratory it links to. `site/assets/lab-ch1.jpg`,
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
are light-themed only, so there is one capture each; in the dark theme the page
takes them down with a `brightness` filter rather than pretending a dark variant
exists.

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

- `<!-- VOICE -->` in `site/index.html` marks the intuition section. It is written
  in the first person, drawn from the introduction of Chapter 2, and is meant to
  be edited until it sounds like you rather than like a summary of you.
- A caption for the first photograph, and a third photograph. `site/assets/README.md`
  says where both go.
- `<!-- CONTACT -->` in the sidebar of the intuition section, where the email and
  LinkedIn links go. The markup is written out in the comment and needs only the
  addresses; until they are supplied the page offers no route to the author
  except GitHub, which is the one thing a reader who is convinced by the
  laboratories cannot do anything with.

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

## The opening panel

The page animates one small model on a `<canvas>`, seeded so that every visitor
sees the same opening, and it fetches nothing.

A finite dyadic lognormal cascade sets the intensity of information arrival;
arrivals are drawn as a Poisson count against that intensity, and the price moves
only on an arrival. It is Chapter 1's cascade driving Chapter 2's random trading
time, which is the through-line of the dissertation.

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
removed from `site/main.js`; they are in the history if they are ever wanted back.
