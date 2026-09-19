import SiteRuntime from '@/components/SiteRuntime';
import { references } from '@/lib/bibliography';

/**
 * The dissertation hub.
 *
 * The page opens on a running model rather than a description of one, then
 * names the mechanism that runs through all four chapters, then the three
 * laboratories as full-width rows. The 2004 material — the note, the
 * intuition, the printed copy, the jury — follows it rather than framing it.
 */
const refCount = references.length;
const doiCount = references.filter((ref) => ref.doi).length;
const refYears = references.map((ref) => Number(ref.y.slice(0, 4)));
const refSpan = `${Math.min(...refYears)} → ${Math.max(...refYears)}`;

export default function Home() {
  return (
    <>
      <a className="skip" href="#labs">Skip to the laboratories</a>

      <header className="masthead">
        <a className="brand" href="#top">
          <svg viewBox="0 0 32 32" aria-hidden="true" width="22" height="22">
            <path d="M3 23h3.5v-5h5v8h4.5V13h4v7h6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          </svg>
          <b>Nicolas Boitout</b>
          <span className="brand-sep" />
          <span className="brand-tail">Doctoral dissertation</span>
        </a>
        <nav aria-label="Sections">
          <a href="#labs">Laboratories</a>
          <a href="#spine">Mechanism</a>
          <a href="#note">Note</a>
          <a href="#defence">Defence</a>
          <a href="/bibliography">Bibliography</a>
          <span className="era">2004 → 2026</span>
        </nav>
      </header>

      <main id="top">

        {/* ════════════════════════ THE BENCH ════════════════════════
            The first screen is an instrument, not a description. A visitor
            who works in markets has their hands on the model before they
            have finished reading the sentence next to it: the two dials
            here are the dissertation's own two parameters.
            ─────────────────────────────────────────────────────────── */}
        <section id="bench" className="bench" aria-labelledby="bench-h">
          <div className="bench-layout">
            <div className="bench-copy">
              <p className="eyebrow">Université d&apos;Orléans · Sciences Économiques · 29 Nov 2004</p>
              <h1 id="bench-h">
                Four chapters on how a currency price is made.
                <em>Three of them run in your browser.</em>
              </h1>
              <p className="lede">
                A dissertation on exchange rate dynamics and currency crises, rebuilt in 2026 as
                laboratories you can operate — the cascade simulator, the agent-based market, the
                estimators on today&apos;s series. From the original manuscript. No new research,
                no rework.
              </p>
              <p className="cta-row">
                <a className="cta" href="#labs">
                  Open the laboratories
                  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
                <a className="cta ghost" href="#note">How this got rebuilt</a>
              </p>
            </div>

            {/* The through-line panel. It is the most persuasive object on the
                page, so it opens the page — and it takes input. */}
            <figure className="hero-panel" id="bench-panel">
              <div className="panel-head">
                <span className="panel-title"><span className="dot" />The through-line · live</span>
                <span className="panel-seed" id="hero-seed">seed 20041129</span>
              </div>
              <canvas id="hero-canvas" aria-label="An animated simulation: a price that moves only when a trade arrives, above a raster of individual arrival times, above a band showing the intensity of information flow." />

              <div className="panel-controls">
                <div className="ctrl">
                  <label htmlFor="hero-lambda">
                    <span>Intermittency λ²</span>
                    <output id="hero-lambda-out" htmlFor="hero-lambda">0.075</output>
                  </label>
                  <input type="range" id="hero-lambda" min="10" max="300" defaultValue="75" step="5" aria-describedby="hero-lambda-out" />
                </div>
                <div className="ctrl">
                  <label htmlFor="hero-flow">
                    <span>Information flow K̄</span>
                    <output id="hero-flow-out" htmlFor="hero-flow">2.40</output>
                  </label>
                  <input type="range" id="hero-flow" min="40" max="600" defaultValue="240" step="10" aria-describedby="hero-flow-out" />
                </div>
                <button type="button" className="reseed" id="hero-reseed">New draw</button>
              </div>

              <figcaption>
                A cascade sets how intensely information is arriving; arrivals are drawn against
                that intensity, and the price moves <em>only</em> when one lands. Raise λ² and the
                quiet stretches get quieter while the bursts get sharper — that is the whole
                argument of the dissertation, in two dials.
              </figcaption>
            </figure>
          </div>

          <div className="metrics">
            <div><b>3</b><span>laboratories live, 1 in preparation</span></div>
            <div><b>4,096</b><span>observations, one fixed seed</span></div>
            <div><b>200</b><span>traders switching strategy, live</span></div>
            <div><b>2016–26</b><span>modern series under the 2004 estimators</span></div>
          </div>
        </section>

        {/* ═══════════════════════ THE SPINE ═══════════════════════
            The through-line used to live in a figcaption. It is the
            dissertation's actual argument, so it gets a diagram — and it
            is what gives Chapter Four a reason to be on the page.
            ───────────────────────────────────────────────────────── */}
        <section id="spine" className="spine" aria-labelledby="spine-h">
          <div className="section-head">
            <p className="eyebrow cool">The spine</p>
            <h2 id="spine-h">One mechanism, running through four chapters</h2>
            <p>
              Information does not arrive evenly. Everything else in the dissertation follows from
              that — including the moment a fixed parity breaks.
            </p>
          </div>

          <div className="spine-flow">
            <div className="stage">
              <span className="step-label">Chapter 1</span>
              <svg viewBox="0 0 120 44" width="120" height="44" aria-hidden="true">
                <path d="M60 3v9M60 12H24M60 12h36M24 12v9M96 12v9M24 21H8M24 21h16M96 21H80M96 21h16M8 21v9M40 21v9M80 21v9M112 21v9" fill="none" stroke="var(--data-intensity)" strokeWidth="1.3" strokeLinecap="round" />
                <rect x="4" y="32" width="8" height="9" fill="var(--data-intensity)" opacity="0.85" />
                <rect x="36" y="35" width="8" height="6" fill="var(--data-intensity)" opacity="0.5" />
                <rect x="76" y="30" width="8" height="11" fill="var(--data-intensity)" />
                <rect x="108" y="36" width="8" height="5" fill="var(--data-intensity)" opacity="0.4" />
              </svg>
              <h3>A multiplicative cascade</h3>
              <p>The construction physicists built for turbulence, splitting intensity unevenly all the way down.</p>
            </div>

            <div className="flow-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 12" width="24" height="12"><path d="M1 6h20M17 2l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>

            <div className="stage">
              <span className="step-label">K = σ²</span>
              <svg viewBox="0 0 120 44" width="120" height="44" aria-hidden="true">
                <path d="M2 41 L8 33 L14 37 L20 20 L26 34 L32 30 L38 39 L44 24 L50 36 L56 12 L62 32 L68 37 L74 27 L80 38 L86 18 L92 34 L98 36 L104 22 L110 35 L118 40 L118 43 L2 43 Z" fill="var(--data-intensity)" opacity="0.14" />
                <path d="M2 41 L8 33 L14 37 L20 20 L26 34 L32 30 L38 39 L44 24 L50 36 L56 12 L62 32 L68 37 L74 27 L80 38 L86 18 L92 34 L98 36 L104 22 L110 35 L118 40" fill="none" stroke="var(--data-intensity)" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
              <h3>Information intensity</h3>
              <p>Bursts and lulls in how fast news actually reaches a decentralised market.</p>
            </div>

            <div className="flow-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 12" width="24" height="12"><path d="M1 6h20M17 2l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>

            <div className="stage">
              <span className="step-label">Chapter 2</span>
              <svg viewBox="0 0 120 44" width="120" height="44" aria-hidden="true">
                <path d="M4 40v-9M9 40v-5M11 40v-14M20 40v-6M31 40v-4M33 40v-17M36 40v-8M38 40v-5M49 40v-4M58 40v-11M60 40v-20M63 40v-7M65 40v-4M74 40v-5M83 40v-4M91 40v-13M93 40v-8M96 40v-4M105 40v-6M113 40v-16M116 40v-6" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M2 43h116" stroke="var(--rule-hard)" strokeWidth="1" />
              </svg>
              <h3>Random trading time</h3>
              <p>Trades arrive against that intensity, not on a calendar grid — the chapter&apos;s core departure.</p>
            </div>

            <div className="flow-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 12" width="24" height="12"><path d="M1 6h20M17 2l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>

            <div className="stage terminal">
              <span className="step-label">Chapter 4 · to come</span>
              <svg viewBox="0 0 120 44" width="120" height="44" aria-hidden="true">
                <path d="M2 14h58" fill="none" stroke="var(--data-price)" strokeWidth="1.5" strokeDasharray="3 3" />
                <path d="M2 14h30l2 1h6l3-2h5l4 2h8" fill="none" stroke="var(--data-price)" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M60 13l3 3 4-1 3 6 5 4 4 7 6 5 5 4 6 2 5 1" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinejoin="round" />
                <circle cx="60" cy="14" r="2.6" fill="var(--accent)" />
              </svg>
              <h3>The parity breaks</h3>
              <p>Not when a fundamental crosses a threshold — when enough people revise at once.</p>
            </div>
          </div>

          <p className="machinery">
            <span>Multiplicative cascades</span>
            <span>Poisson arrivals in business time</span>
            <span>Lux–Marchesi switching under random trading time</span>
            <span>GPH &amp; local Whittle d̂(q)</span>
            <span>Structure functions ζ(q)</span>
          </p>
        </section>

        {/* ══════════════════ THE LABORATORIES ══════════════════ */}
        <section id="labs" className="labs" aria-labelledby="labs-h">
          <div className="labs-head">
            <div className="section-head">
              <p className="eyebrow">The work, as instruments</p>
              <h2 id="labs-h">Three laboratories you can operate</h2>
              <p>
                Every one of them takes your input and re-runs in front of you. Nothing is
                precomputed and nothing phones home.
              </p>
            </div>
            <span className="chip live"><span className="dot" />3 live · 1 in preparation</span>
          </div>

          <ol className="cards" id="cards">

            {/* CHAPTER 1 */}
            <li className="card">
              <a className="shot" href="https://multifractal-volatility.vercel.app/" tabIndex={-1} aria-hidden="true">
                <span className="shot-bar">
                  <span className="shot-dots" aria-hidden="true"><i /><i /><i /></span>
                  <span className="shot-url">multifractal-volatility.vercel.app</span>
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/lab-ch1.jpg" width="1240" height="620" loading="lazy" decoding="async" alt="" />
              </a>
              <div className="card-body">
                <p className="card-num">Chapter One <span className="pill">Live</span></p>
                <h3><a href="https://multifractal-volatility.vercel.app/">Towards a multifractal paradigm of stochastic volatility</a></h3>
                <p className="card-text">
                  Fat tails, volatility that clusters, memory that changes with the power you
                  measure — almost every familiar feature of returns follows from one assumption
                  about how information arrives.
                </p>
                <ul className="do">
                  <li>Drag intermittency <b>λ²</b> and watch excess kurtosis climb on the live tiles</li>
                  <li>Stop the cascade partway down, and see which horizons were carrying the volatility</li>
                  <li>Switch between <b>six views</b> — cascade, information flow, returns, memory, scaling</li>
                  <li>Read the original chapter beside the simulator: forty equations, four tables</li>
                </ul>
                <p className="spec">9 controls · 6 views · 4,096 observations · seeded · Alcatel 1991–2001, as reported</p>
                <p className="card-links">
                  <a className="go" href="https://multifractal-volatility.vercel.app/">
                    Run the cascade simulator
                    <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M3 8h9M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </a>
                  <a className="src" href="https://github.com/nboitout/Multifractal_Volatility">Source</a>
                </p>
              </div>
            </li>

            {/* CHAPTER 2 */}
            <li className="card flip">
              <a className="shot" href="https://phd-microsimulation.vercel.app/" tabIndex={-1} aria-hidden="true">
                <span className="shot-bar">
                  <span className="shot-dots" aria-hidden="true"><i /><i /><i /></span>
                  <span className="shot-url">phd-microsimulation.vercel.app</span>
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/lab-ch2.jpg" width="1240" height="620" loading="lazy" decoding="async" alt="" />
              </a>
              <div className="card-body">
                <p className="card-num">Chapter Two <span className="pill">Live</span></p>
                <h3><a href="https://phd-microsimulation.vercel.app/">Agent-based financial market simulation</a></h3>
                <p className="card-text">
                  A market made of people who disagree. Two chartist camps and a fundamentalist
                  camp, each agent switching when someone else&apos;s strategy is doing better — and,
                  unlike almost every simulation of its day, trading time is random rather than a grid.
                </p>
                <ul className="do">
                  <li>Push the herding dial <b>α₁</b> up and watch the price detach from the fundamental</li>
                  <li>Send good or bad news into the crowd and watch the three camps change size</li>
                  <li>Race ten random clocks against the calendar grid — the chapter&apos;s core departure</li>
                  <li>Step the market maker one tick at a time, through ten events written out in full</li>
                </ul>
                <p className="spec">4 dials · 4 presets · 200 traders live · 2,500 simulated days at seed 20030601</p>
                <p className="card-links">
                  <a className="go" href="https://phd-microsimulation.vercel.app/">
                    Run the market simulation
                    <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M3 8h9M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </a>
                  <a className="src" href="https://github.com/nboitout/PhD_Microsimulation">Source</a>
                </p>
              </div>
            </li>

            {/* CHAPTER 3 */}
            <li className="card">
              <a className="shot" href="https://ph-d-empirical-study.vercel.app/" tabIndex={-1} aria-hidden="true">
                <span className="shot-bar">
                  <span className="shot-dots" aria-hidden="true"><i /><i /><i /></span>
                  <span className="shot-url">ph-d-empirical-study.vercel.app</span>
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/lab-ch3.jpg" width="1240" height="620" loading="lazy" decoding="async" alt="" />
              </a>
              <div className="card-body">
                <p className="card-num">Chapter Three <span className="pill">Live</span></p>
                <h3><a href="https://ph-d-empirical-study.vercel.app/">The same estimators, on today&apos;s markets</a></h3>
                <p className="card-text">
                  Chapter One found persistence in volatility that falls away as the power measured
                  rises, while persistence in trading volume barely moves. This runs the same
                  estimators over ten years of markets that did not exist in that sample, and draws
                  both curves on one axis.
                </p>
                <ul className="do">
                  <li>Switch between five daily series, 2016–2026: <b>MSFT, BTC, EUR/USD, US 10y, Brent</b></li>
                  <li>Read measured <b>d̂(q)</b> against Chapter One&apos;s Alcatel table, with a ±2 s.e. band</li>
                  <li>Change the definition of volatility — |r|, r², rolling σ — and watch the curve move</li>
                  <li>Compare GPH with local Whittle, and ζ(q) past the simulator&apos;s k = 64 ceiling</li>
                </ul>
                <p className="spec">5 series · 2016–2026 · GPH + local Whittle · q = 0.25…4 on the chapter&apos;s own grid</p>
                <p className="card-links">
                  <a className="go" href="https://ph-d-empirical-study.vercel.app/">
                    Run the empirical study
                    <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M3 8h9M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </a>
                  <a className="src" href="https://github.com/nboitout/PhD_Empirical_Study">Source</a>
                </p>
              </div>
            </li>
          </ol>

          <div className="pending-strip">
            <div>
              <p className="card-num">Chapter Four <span className="pill quiet">In preparation</span></p>
              <h3>Speculative attacks on a fixed exchange rate market</h3>
              <p>
                The case the other three chapters were built for: a fixed parity, a central bank
                defending it, and a population of speculators who revise together. Being rebuilt
                from the manuscript on the same terms as the rest.
              </p>
            </div>
            <span className="status">being rebuilt</span>
          </div>
        </section>

        {/* ═══════════════ A PERSONAL NOTE, 23 YEARS LATER ═══════════════ */}
        {/* VOICE — Nicolas Boitout's own note, written in September 2026 on
            returning to the manuscript. It is the one section on the page that
            speaks in the present tense. Edit it freely. */}
        <section id="note" className="note" aria-labelledby="note-h">
          <div className="note-shell">
            <div>
              <figure className="carousel" id="photos" hidden>
                <div className="carousel-frame">
                  <ul className="carousel-track" id="carousel-track">
                    <li className="slide">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/assets/note-1.jpg" width="1200" height="1600" decoding="async"
                        data-caption="At work on the thesis"
                        alt="A print from the thesis years: Nicolas Boitout, in glasses and a striped jumper, sitting on a red sofa and reading a sheet of paper on his lap." />
                    </li>
                    <li className="slide">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/assets/note-2.jpg" width="1600" height="1095" decoding="async"
                        data-caption="With Thierry Delahaut · Porquerolles, 2001 · CNRS, Groupe Économie et Physique"
                        alt="A print from the thesis years: Nicolas Boitout and Thierry Delahaut side by side on a quayside, the sea behind them and a moored line at the right." />
                    </li>
                    <li className="slide">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/assets/note-3.jpg" width="1600" height="1200" decoding="async"
                        data-caption="At work on the thesis, among the printouts"
                        alt="A print from the thesis years: Nicolas Boitout reading a sheet of paper at a glass table in front of a brick fireplace, with books, notes and loose pages spread over the table and across the floor around him." />
                    </li>
                  </ul>

                  <button type="button" className="carousel-nav prev" id="carousel-prev" aria-label="Previous photograph">
                    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M12.5 4 6.5 10l6 6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                  <button type="button" className="carousel-nav next" id="carousel-next" aria-label="Next photograph">
                    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M7.5 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                </div>

                <div className="carousel-dots" id="carousel-dots" role="group" aria-label="Choose a photograph" />
                <figcaption id="carousel-caption" />
              </figure>

              <dl className="compare">
                <div>
                  <dt>Frontier AI</dt>
                  <dd><b>1 minute</b><span>to analyse the chapter</span></dd>
                </div>
                <div>
                  <dt>Me</dt>
                  <dd><b>1 year</b><span>to master and write it</span></dd>
                </div>
              </dl>
            </div>

            <div className="prose">
              <p className="eyebrow">2003 · 2026</p>
              <h2 id="note-h">A personal note, 23 years later</h2>
              <p>
                In September 2026, OpenAI announced a resolution to the Navier–Stokes Millennium
                Problem. The news immediately took me back to my PhD.
              </p>
              <p>
                More than twenty years ago, while doing my PhD in finance, I was working with a
                research group in France, composed mainly of physicists (CNRS Econophysique). They
                were exploring how ideas developed to understand turbulence in fluid, earthquakes or
                avalanches could also be applied to financial market crashes and volatility. This
                was completely new territory for me. And it was fascinating.
              </p>
              <p>
                I took two of their instruments into my PhD. Volatility I modelled with multifractal
                processes — the multiplicative cascade built to describe turbulence, carried across
                to the uneven way information arrives in a market. I also built 2 agent-based
                simulations <em>(yes, like the AI agents of 2026, although they were
                “deterministic” at that time)</em>:
              </p>
              <ul>
                <li>a market of traders who keep changing their minds;</li>
                <li>a speculative attack on a fixed exchange rate.</li>
              </ul>
              <p>
                That is the other standard instrument physicists use on complex systems — you do not
                write the aggregate behaviour into the equations, you let it emerge from a
                population of “agents” interacting within a simulation.
              </p>
              <p>
                When I returned to the thesis last week, I knew the digital files were lost. The PDF
                was gone. The code was gone. All I had was the printed copy. I took pictures of
                every page and digitized the full document. I then gave the first chapter to GPT. In
                less than 1 minute, it analysed the research that took me 1 year to master and
                write. It was a shock! But its conclusion was reassuring: for some work written more
                than two decades ago, it was not bad. Some passages had aged surprisingly well.
              </p>
              <p>
                So I decided to put the old work online. With few coding agents, I rebuilt the
                models, tests and simulations as interactive laboratories. A few hours later, this
                website is now live.
              </p>

              <p className="beat">The interface is new. The research is not.</p>

              <p>
                What I found fascinating: rebuilding this work in no time gave me a concrete example
                of the acceleration now taking place in research. Powerful AI systems radically
                compress the time needed between an idea and a working experiment. Work that once
                required months or years can now be reconstructed, tested and shared in hours.
              </p>

              <p className="aside">
                Each lab here remains deliberately faithful to the original work. No rework. Nothing
                is quietly corrected to make my younger self look smarter.
              </p>

              <p className="signoff">Bucharest, 15 September 2026</p>
            </div>
          </div>
        </section>

        {/* ═══════════════════ WHY CRISES, THIS WAY ═══════════════════ */}
        {/* VOICE — this section is written in the first person, drawn from the
            introduction of your own Chapter 2. Edit it until it sounds like you. */}
        <section id="why" className="why" aria-labelledby="why-h">
          <div className="section-head">
            <p className="eyebrow cool">The intuition</p>
            <h2 id="why-h">Why I approached currency crises this way</h2>
          </div>

          <div className="why-layout">
            <div className="prose">
              <p>
                I started this research effort on currency crises with a first Dissertation done
                during my Master. Macroeconomics. Focus on the fundamentals behind these crises.
                Interesting, but I couldn&apos;t understand the timing of these crises. I quickly
                felt I was in a deadend. I realized I needed to give up my focus on macroeconomics
                to understand what — concretely — was happening in the FX markets. I needed to
                understand how a financial market works, and why/how it can create some crashes.
                Market Efficiency: if prices move because news arrives, and news reaches everyone at
                once and is read in much the same way, then the volatility we actually observe in
                currency markets is far too large. You can find the intraday spikes around
                macro-announcements — but they are a small part of the total. Most of the volatility
                was being produced by something else than public information.
              </p>
              <p>
                The FX market is decentralised by construction: there is no aggregate order flow
                everyone can observe. So what a trader learns about everyone else, they learn from
                price and volume themselves. Other participants are not noise around the fundamental
                — they <em>are</em> part of what you are trading on. That is also why technical
                analysis dominates short-horizon forecasting there, whatever one thinks of it.
              </p>
              <p>
                So I stopped treating the representative investor on a regular clock as the starting
                point (once again, the main flaws of the Efficient Market Hypothesis). Take it away
                and you need to say what replaces it, which is the whole dissertation: information
                that arrives in bursts, agents who revise their convictions by watching what is
                working for other people, and a trading time that runs fast and slow instead of
                ticking constantly.
              </p>
              <p>
                A fixed exchange rate does not break because a fundamental crossed a threshold on a
                particular Tuesday. It breaks because enough participants revise at once, each
                partly because the others are revising — a herd that is individually rational and
                collectively catastrophic. A representative agent cannot even state that problem. A
                population that switches strategy, in a market where the only signal about everyone
                else is the price, can.
              </p>
              <p>
                That is why the emerging-market application at the end is not an afterthought bolted
                onto the theory. It is the case the theory was built for.
              </p>
              <p className="aside">
                <b>A note on the rebuilds.</b> Each laboratory is written from its chapter&apos;s own
                equations, not from its published figures. Where the manuscript is ambiguous,
                silent, or missing pages, the implementation says so on the page and names the
                reading it took. Nothing is quietly corrected and nothing is modernised.
              </p>
            </div>

            <aside className="facts">
              <h3>At a glance</h3>
              <dl>
                <div><dt>Degree</dt><dd>Docteur de l&apos;Université d&apos;Orléans</dd></div>
                <div><dt>Discipline</dt><dd>Sciences Économiques</dd></div>
                <div><dt>Defended</dt><dd>29 November 2004</dd></div>
                <div><dt>Director</dt><dd>Prof. Cyrille Piatecki</dd></div>
              </dl>
              <h3 className="pub-h">Elsewhere</h3>
              <p className="pub">
                <a href="https://github.com/nboitout">github.com/nboitout</a>
                {/* CONTACT — the email and LinkedIn go here, one <a> each, once the
                    addresses are supplied. The markup is ready:

                    <br /><a href="mailto:EMAIL">EMAIL</a>
                    <br /><a href="https://www.linkedin.com/in/HANDLE">linkedin.com/in/HANDLE</a>
                */}
              </p>
            </aside>
          </div>
        </section>

        {/* ═══════════════════════ PROVENANCE ═══════════════════════ */}
        <section id="provenance" className="provenance" aria-labelledby="prov-h">
          <figure className="cover">
            <a href="/assets/cover.jpg" id="cover-link" title="Open the title page at full size">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img id="cover-photo" src="/assets/cover.jpg" width="1136" height="1600"
                alt="The printed title page of the dissertation: Thèse présentée à l'Université d'Orléans pour obtenir le grade de Docteur, discipline Sciences Économiques, par Nicolas Boitout — Modélisation de la dynamique des taux de change avec application aux marchés émergents, soutenue publiquement le 29 novembre 2004." />
            </a>

            <div className="titlepage" id="cover-fallback" hidden aria-label="The dissertation's title page, 2004">
              <p className="tp-univ">Université d&apos;Orléans</p>
              <p className="tp-head">Thèse<br />présentée<br />à l&apos;Université d&apos;Orléans<br />pour obtenir le grade de<br />Docteur de l&apos;Université d&apos;Orléans</p>
              <p className="tp-disc">Discipline : <i>Sciences Économiques</i></p>
              <p className="tp-par">par</p>
              <p className="tp-name">Nicolas <b>Boitout</b></p>
              <p className="tp-title">Modélisation de la dynamique des taux de change avec application aux marchés émergents</p>
              <p className="tp-date">Soutenue publiquement le 29 novembre 2004</p>
            </div>

            <figcaption id="cover-caption">The printed copy · defended 29 November 2004</figcaption>
          </figure>

          <div>
            <div className="section-head">
              <p className="eyebrow cool">Provenance</p>
              <h2 id="prov-h">From one printed copy</h2>
              <p>
                The digital files were lost — no PDF, no code. Every page of the surviving printed
                copy was photographed and digitised, and every laboratory here is written from its
                chapter&apos;s own equations rather than from its published figures.
              </p>
            </div>

            <dl className="prov-grid">
              <div><dt>Degree</dt><dd>Docteur de l&apos;Université d&apos;Orléans</dd></div>
              <div><dt>Discipline</dt><dd>Sciences Économiques</dd></div>
              <div><dt>Defended</dt><dd>29 November 2004</dd></div>
              <div><dt>Director</dt><dd>Prof. Cyrille Piatecki</dd></div>
            </dl>

            <div className="prov-pub">
              <p>
                N. Boitout &amp; L. Ureche-Rangau, “Towards a Multifractal Paradigm of Stochastic
                Volatility?”, <cite>International Journal of Theoretical and Applied Finance</cite>
                {' '}<b>7</b>(7), 823–851, 2004 ·{' '}
                <a href="https://doi.org/10.1142/S0219024904002736">10.1142/S0219024904002736</a>
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════ THE LIBRARY ═══════════════════════
            The reference list is not decoration on a hub about running
            models: it is what the models were derived from. It gets a door
            here and a room of its own at /bibliography.
            ──────────────────────────────────────────────────────────── */}
        <section id="library" className="library" aria-labelledby="library-h">
          <div className="section-head">
            <p className="eyebrow">Bibliography</p>
            <h2 id="library-h">What it was built on</h2>
            <p>
              The manuscript&apos;s own reference list, restandardized to APA 7th and repaired
              where the printed copy was damaged. Working papers that were later published carry
              their final journal; every DOI that exists resolves. Nothing has been added to it.
            </p>
          </div>

          <div className="library-row">
            <dl className="library-facts">
              <div><dt>References</dt><dd>{refCount}</dd></div>
              <div><dt>DOIs resolved</dt><dd>{doiCount}</dd></div>
              <div><dt>Span</dt><dd>{refSpan}</dd></div>
            </dl>
            <a className="cta" href="/bibliography">
              Search the bibliography
              <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16">
                <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </section>

        {/* ═══════════════════════ DEFENCE ═══════════════════════ */}
        <section id="defence" className="defence" aria-labelledby="defence-h">
          <div className="defence-head">
            <h2 id="defence-h">Defence and jury</h2>
            <p>Université d&apos;Orléans · 29 November 2004</p>
          </div>
          <ul className="jury">
            <li><b>Emmanuel Acar</b><span>Head of Foreign Exchange Risk Management, Bank of America House, London</span></li>
            <li><b>Gilbert Colletaz</b><span>Professor, Université d&apos;Orléans</span></li>
            <li><b>Thomas Lux</b><span>Professor, University of Kiel · <i>rapporteur</i></span></li>
            <li><b>Valérie Mignon</b><span>Professor, Université Paris X Nanterre · <i>rapporteur</i></span></li>
            <li><b>Cyrille Piatecki</b><span>Professor, Université d&apos;Orléans · <i>research director</i></span></li>
            <li><b>Gilles Teyssière</b><span>Scientific Director, NBG Banque, Paris</span></li>
          </ul>
        </section>

      </main>

      <footer>
        <div>
          <p>
            The simulation at the top of this page is a reduced illustration, generated in your
            browser from a fixed seed; no number read off it means anything. The screenshots below
            it are of the laboratories themselves. The chapters&apos; own figures come from their
            full models, in their own repositories, where every number is reproducible.
          </p>
          <p className="colophon">
            <span>© Nicolas Boitout</span>
            <a href="https://github.com/nboitout/PhD">Source of this page</a>
          </p>
        </div>
      </footer>

      <SiteRuntime />
    </>
  );
}
