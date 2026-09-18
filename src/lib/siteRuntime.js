/* ============================================================
   Exchange Rate Dynamics — dissertation hub
   Theme switch, the photographs, and the opening panel.

   The panel is deliberately small. It is a reduced illustration
   of the two chapters' shared mechanism — a cascade setting the
   rate at which information arrives, and a price that moves only
   on an arrival — written from the same equations but with a
   short window, so that it costs nothing to run on a landing
   page. It is not a published figure and no number read off it
   means anything. That is stated on the page.

   It does, however, take input: the two dials beneath it are the
   chapter's own lambda-squared and the base arrival rate. Being
   able to move them is the difference between a picture of a
   model and the model, and that difference is the reason the
   panel opens the page instead of sitting in a sidebar.

   No dependencies, no network, one animation frame loop.

   This was site/main.js, a deferred <script> on a static page. It
   is now started by <SiteRuntime> after hydration and returns a
   teardown, because a client navigation to /admin unmounts the
   page and the frame loop, the observers and the listeners would
   otherwise outlive the DOM they were pointed at.
   ============================================================ */

export function initSite() {
  'use strict';

  const disposers = [];
  /** addEventListener that remembers how to undo itself. */
  const on = (target, type, fn, opts) => {
    if (!target) return;
    target.addEventListener(type, fn, opts);
    disposers.push(() => target.removeEventListener(type, fn, opts));
  };
  const observe = (observer, node) => {
    observer.observe(node);
    disposers.push(() => observer.disconnect());
  };

  /* ── theme ─────────────────────────────────────────────── */

  const root = document.documentElement;
  const toggle = document.getElementById('theme');

  const stored = (() => {
    try { return localStorage.getItem('phd-theme'); } catch { return null; }
  })();
  if (stored === 'dark' || stored === 'light') root.dataset.theme = stored;

  const isDark = () =>
    root.dataset.theme === 'dark' ||
    (!root.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);

  const syncToggle = () => {
    if (!toggle) return;
    const next = isDark() ? 'light' : 'dark';
    toggle.setAttribute('aria-label', `Switch to ${next} theme`);
    toggle.title = `Switch to ${next} theme`;
  };

  on(toggle, 'click', () => {
    root.dataset.theme = isDark() ? 'light' : 'dark';
    try { localStorage.setItem('phd-theme', root.dataset.theme); } catch { /* private mode */ }
    palette.stale = true;
    syncToggle();
  });

  on(matchMedia('(prefers-color-scheme: dark)'), 'change', () => {
    palette.stale = true;
    syncToggle();
  });
  syncToggle();

  /* ── the printed cover ─────────────────────────────────────

     The page shows the photograph of the printed title page. Should that file
     ever go missing, the request 404s, .png is tried once, and the typeset
     facsimile then takes its place, so the cover never renders as a broken
     image and the caption stops claiming to be the printed copy.
     ────────────────────────────────────────────────────────── */

  (() => {
    const img = document.getElementById('cover-photo');
    const link = document.getElementById('cover-link');
    const fallback = document.getElementById('cover-fallback');
    const caption = document.getElementById('cover-caption');
    if (!img || !fallback) return;

    let triedPng = false;

    const failed = () => {
      if (!triedPng) {                       // one alternative extension, then give up
        triedPng = true;
        img.src = '/assets/cover.png';
        if (link) link.href = '/assets/cover.png';
        return;
      }
      (link || img).remove();
      fallback.hidden = false;
      if (caption) caption.textContent = 'The title page · defended 29 November 2004';
    };

    on(img, 'error', failed);
    // React has already committed the <img>, so it may have settled by now.
    if (img.complete && img.naturalWidth === 0) failed();
  })();

  /* ── the photographs ───────────────────────────────────────

     Three photographs from the econophysics years, shown one at a time.

     The files are dropped in rather than committed with the markup, so every
     slide is treated as optional: each image is tried as .jpg, then .jpeg,
     then .png, and a slide whose file is missing removes itself. The figure
     is revealed only once the survivors are known, so a photograph that was
     never added leaves no gap and never renders as a broken image. If none of
     the three are there, the carousel is removed from the page entirely.

     The images are deliberately NOT lazy-loaded: the figure starts hidden, a
     hidden element never enters the viewport, and a lazy image inside one
     would therefore wait forever for a scroll that cannot happen.
     ────────────────────────────────────────────────────────── */

  (() => {
    const fig = document.getElementById('photos');
    const track = document.getElementById('carousel-track');
    if (!fig || !track) return;

    const dotsBox = document.getElementById('carousel-dots');
    const capBox = document.getElementById('carousel-caption');
    const prev = document.getElementById('carousel-prev');
    const next = document.getElementById('carousel-next');

    const EXT = ['.jpg', '.jpeg', '.png'];
    const slides = Array.from(track.querySelectorAll('.slide'));
    let pending = slides.length;
    let live = [];
    let at = 0;

    if (!pending) { fig.remove(); return; }

    /* ── the carousel proper, built once the survivors are known ── */

    function show(n) {
      at = (n + live.length) % live.length;
      track.style.transform = `translateX(${-at * 100}%)`;
      const img = live[at].querySelector('img');
      if (capBox) capBox.textContent = img?.dataset.caption || '';
      for (const [k, dot] of dots.entries()) {
        dot.setAttribute('aria-current', k === at ? 'true' : 'false');
        dot.tabIndex = k === at ? 0 : -1;
      }
      // Only the visible photograph is reachable by tab or read out in order.
      for (const [k, s] of live.entries()) s.setAttribute('aria-hidden', k === at ? 'false' : 'true');
    }

    const dots = [];

    function build() {
      if (live.length === 1) fig.classList.add('solo');

      if (dotsBox && live.length > 1) {
        for (let k = 0; k < live.length; k++) {
          const dot = document.createElement('button');
          dot.type = 'button';
          dot.setAttribute('aria-current', 'false');
          dot.setAttribute('aria-label', `Photograph ${k + 1} of ${live.length}`);
          on(dot, 'click', () => show(k));
          dotsBox.append(dot);
          dots.push(dot);
        }
        // The dots are built here, not in the markup, so they are cleared on
        // teardown rather than doubled up if the page is mounted again.
        disposers.push(() => { dotsBox.replaceChildren(); });
      }

      on(prev, 'click', () => show(at - 1));
      on(next, 'click', () => show(at + 1));

      on(fig, 'keydown', e => {
        if (live.length < 2) return;
        if (e.key === 'ArrowLeft') { show(at - 1); e.preventDefault(); }
        if (e.key === 'ArrowRight') { show(at + 1); e.preventDefault(); }
      });

      // Swipe. Pointer events cover touch, pen and a dragged mouse alike.
      let x0 = null;
      on(track, 'pointerdown', e => { x0 = e.clientX; });
      on(track, 'pointerup', e => {
        if (x0 === null || live.length < 2) return;
        const dx = e.clientX - x0;
        x0 = null;
        if (Math.abs(dx) > 40) show(at + (dx < 0 ? 1 : -1));
      });
      on(track, 'pointercancel', () => { x0 = null; });

      show(0);
    }

    /* ── settling each slide ── */

    function settle() {
      if (--pending > 0) return;
      live = Array.from(track.querySelectorAll('.slide'));
      if (!live.length) { fig.remove(); return; }
      build();
      fig.hidden = false;
    }

    for (const slide of slides) {
      const img = slide.querySelector('img');
      if (!img) { slide.remove(); settle(); continue; }

      const base = img.getAttribute('src').replace(/\.[a-z0-9]+$/i, '');
      let tried = 0;
      let done = false;

      const ok = () => { if (done) return; done = true; settle(); };
      const fail = () => {
        if (done) return;
        if (++tried < EXT.length) { img.src = base + EXT[tried]; return; }
        done = true;
        slide.remove();
        settle();
      };

      on(img, 'load', ok);
      on(img, 'error', fail);
      // React has already committed the <img>, so it may have settled by now.
      if (img.complete) (img.naturalWidth ? ok : fail)();
    }
  })();

  /* ── colours, read from the stylesheet so the panels follow the theme ── */

  const palette = { stale: true, v: {} };
  const NAMES = ['--ink', '--ink-mute', '--rule', '--accent', '--gold',
                 '--optimist', '--pessimist', '--fundamentalist', '--bg-sunk', '--bg-raise'];

  function colours() {
    if (palette.stale) {
      const cs = getComputedStyle(root);
      for (const n of NAMES) palette.v[n] = cs.getPropertyValue(n).trim();
      palette.stale = false;
    }
    return palette.v;
  }

  /* ── randomness: seeded, so every visitor sees the same opening ── */

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function gauss(rng) {
    let u = 0, v = 0;
    while (u === 0) u = rng();
    while (v === 0) v = rng();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  /* A finite dyadic lognormal cascade, the Chapter 1 construction.
     Multipliers have E[W] = 1, so the mean intensity does not drift
     with depth; lambda2 sets how uneven the tree is. */
  function cascade(rng, depth, lambda2) {
    const s = Math.sqrt(lambda2 * Math.LN2);
    const m = -0.5 * s * s;
    let a = new Float64Array([1]);
    for (let j = 0; j < depth; j++) {
      const b = new Float64Array(a.length * 2);
      for (let i = 0; i < a.length; i++) {
        b[2 * i]     = a[i] * Math.exp(m + s * gauss(rng));
        b[2 * i + 1] = a[i] * Math.exp(m + s * gauss(rng));
      }
      a = b;
    }
    return a;
  }

  /* ── canvas plumbing ───────────────────────────────────── */

  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const panels = [];

  function mount(canvas, model) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const panel = { canvas, ctx, model, w: 0, h: 0, visible: false };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      panel.w = r.width;
      panel.h = r.height;
      model.resize?.(panel);
      model.draw(panel, colours());
    };

    observe(new ResizeObserver(resize), canvas);

    if (REDUCED) {
      // One still frame, pre-rolled far enough to be worth looking at.
      for (let i = 0; i < model.preroll; i++) model.step();
      resize();
      return panel;
    }

    for (let i = 0; i < model.preroll; i++) model.step();
    resize();

    observe(
      new IntersectionObserver(
        ([e]) => { panel.visible = e.isIntersecting; },
        { rootMargin: '80px' }
      ),
      canvas
    );

    panels.push(panel);
    return panel;
  }

  /* A control changed. Under prefers-reduced-motion nothing is animating, so
     the panel would keep showing the state before the change until something
     else forced a repaint: advance it by hand and draw one new still. */
  function nudge(panel, steps) {
    if (!panel || !panel.w) return;
    if (!REDUCED) return;                     // the frame loop will pick it up
    for (let i = 0; i < steps; i++) panel.model.step();
    panel.model.draw(panel, colours());
  }

  if (!REDUCED) {
    let last = 0;
    let stopped = false;
    const FRAME = 1000 / 30;          // 30fps is plenty, and halves the battery cost
    requestAnimationFrame(function loop(t) {
      if (stopped) return;
      requestAnimationFrame(loop);
      if (t - last < FRAME) return;
      last = t;
      if (document.hidden) return;
      const c = colours();
      for (const p of panels) {
        if (!p.visible || !p.w) continue;
        p.model.step();
        p.model.draw(p, c);
      }
    });
    disposers.push(() => { stopped = true; });
  }

  const px = v => Math.round(v) + 0.5;   // hairlines that stay hairlines
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  /* ============================================================
     HERO — information arrivals and price

     Trading time is random (Chapter 2) and the rate at which it
     runs is set by a multiplicative cascade (Chapter 1). The
     price moves only when an arrival lands. Everything the two
     chapters share is in that one sentence.
     ============================================================ */

  const heroModel = (() => {
    const DEPTH = 13, COLW = 2.4;
    /* Both of these are under the visitor's hand. lambda2 is the chapter's
       intermittency; flow is the base arrival rate K̄ that the cascade then
       modulates. Everything else stays where the chapters put it. */
    let lambda2 = 0.075;
    let flow = 2.4;
    let cols = 260;                     // replaced by resize() with the real width
    let seed = 20041129;
    let rng = mulberry32(seed);
    let sig = cascade(rng, DEPTH, lambda2);
    let k = 0;

    const col = [];          // { s: intensity, p: price, n: arrivals }
    let price = 1;

    function step() {
      if (k >= sig.length) {                       // a fresh tree, same construction
        seed = (seed + 7919) | 0;
        rng = mulberry32(seed);
        sig = cascade(rng, DEPTH, lambda2);
        k = 0;
      }
      const s = sig[k++];
      // Arrivals follow the intensity K = sigma^2. The cap matters: without it a
      // deep cascade spike drives exp(-rate) to zero and Knuth's sampler below
      // never terminates.
      const rate = Math.min(12, flow * s * s);
      let n = 0;
      let L = Math.exp(-rate), q = rng();
      while (q > L && n < 40) { q *= rng(); n++; }
      for (let i = 0; i < n; i++) price *= Math.exp(0.0042 * Math.sqrt(s) * gauss(rng));
      col.push({ s, p: price, n });
      while (col.length > cols) col.shift();
    }

    // The buffer has to be as wide as the canvas, or the series stops short of
    // the left edge on a wide screen.
    function resize(panel) {
      const want = Math.ceil(panel.w / COLW) + 2;
      if (want === cols) return;
      cols = want;
      while (col.length > cols) col.shift();
      while (col.length < cols) step();
    }

    function draw(panel, c) {
      const { ctx, w, h } = panel;
      ctx.fillStyle = c['--bg-raise'];
      ctx.fillRect(0, 0, w, h);
      if (col.length < 2) return;

      /* The panel stretches to whatever height the column beside it needs, so
         the three bands are proportions with limits rather than one fixed
         split. Giving the intensity band the leftover height instead made it
         grow faster than the price chart and take over the taller panel. */
      const rasterH = 14;
      const bandH = clamp(h * 0.20, 48, 120);
      const priceH = h - bandH - rasterH - 64;      // 18 + 34 + 12 of gaps
      const rasterY = priceH + 18;
      const bandY = rasterY + rasterH + 34;
      const n = col.length;
      const x = i => w - (n - 1 - i) * COLW;

      let lo = Infinity, hi = -Infinity, smax = 0;
      for (const d of col) {
        if (d.p < lo) lo = d.p;
        if (d.p > hi) hi = d.p;
        if (d.s > smax) smax = d.s;
      }
      smax = smax || 1;
      const pad = (hi - lo) * 0.16 || 0.001;
      lo -= pad; hi += pad;
      const py = p => 12 + (priceH - 24) * (1 - (p - lo) / (hi - lo));

      // the price: a step function, flat wherever nothing arrived
      ctx.beginPath();
      ctx.moveTo(x(0), py(col[0].p));
      for (let i = 1; i < n; i++) {
        ctx.lineTo(x(i), py(col[i - 1].p));
        ctx.lineTo(x(i), py(col[i].p));
      }
      ctx.strokeStyle = c['--accent'];
      ctx.lineWidth = 1.6;
      ctx.lineJoin = 'round';
      ctx.stroke();

      // the arrivals themselves, one mark each
      ctx.fillStyle = c['--gold'];
      for (let i = 0; i < n; i++) {
        const d = col[i];
        if (!d.n) continue;
        const hgt = Math.min(rasterH, 3 + d.n * 3);
        ctx.globalAlpha = Math.min(1, 0.42 + d.n * 0.2);
        ctx.fillRect(px(x(i)) - 0.5, rasterY + (rasterH - hgt), 1.4, hgt);
      }
      ctx.globalAlpha = 1;

      // The intensity that produced them. Plotted as sigma under a mild power,
      // not as sigma^2: squaring lets one spike flatten the whole window.
      ctx.beginPath();
      ctx.moveTo(x(0), bandY + bandH);
      for (let i = 0; i < n; i++) {
        ctx.lineTo(x(i), bandY + bandH * (1 - Math.pow(col[i].s / smax, 0.75)));
      }
      ctx.lineTo(x(n - 1), bandY + bandH);
      ctx.closePath();
      ctx.fillStyle = c['--optimist'];
      ctx.globalAlpha = 0.17;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c['--optimist'];
      ctx.lineWidth = 1;
      ctx.stroke();

      // hairline rules and labels
      ctx.strokeStyle = c['--rule'];
      ctx.lineWidth = 1;
      for (const y of [rasterY + rasterH + 6, bandY + bandH + 6]) {
        ctx.beginPath(); ctx.moveTo(0, px(y)); ctx.lineTo(w, px(y)); ctx.stroke();
      }
      ctx.fillStyle = c['--ink-mute'];
      ctx.font = '600 9px ui-sans-serif, system-ui, sans-serif';
      ctx.globalAlpha = 0.8;
      ctx.fillText('PRICE', 9, 15);
      ctx.fillText('ARRIVALS', 9, rasterY - 5);
      ctx.fillText('INFORMATION INTENSITY  K = σ²', 9, bandY - 7);
      ctx.globalAlpha = 1;
    }

    /* Changing lambda2 has to rebuild the tree, or nothing happens until the
       current one is exhausted — up to a couple of thousand columns away. The
       rebuild keeps the seed, so the same dial position always gives the same
       draw, and the columns already on screen scroll off normally: the change
       arrives as the series evolving rather than as a cut. */
    function rebuild() {
      rng = mulberry32(seed);
      sig = cascade(rng, DEPTH, lambda2);
      k = 0;
    }

    return {
      step, draw, resize, preroll: 190,
      setLambda2(v) { lambda2 = v; rebuild(); },
      setFlow(v)    { flow = v; },
      reseed()      { seed = (seed + 104729) | 0; rebuild(); return seed >>> 0; }
    };
  })();

  const heroPanel = mount(document.getElementById('hero-canvas'), heroModel);

  /* ── the two dials ─────────────────────────────────────────

     The opening panel takes input. The sliders carry integers because a
     range input's value is a string and hundredths are easier to reason
     about as whole numbers: lambda2 is thousandths, flow is hundredths.

     If the canvas never mounted — no 2d context, or the element is gone —
     the controls would be a row of dials wired to nothing, so they are
     removed rather than left there inert.
     ────────────────────────────────────────────────────────── */

  (() => {
    const box = document.getElementById('bench-panel');
    const lam = document.getElementById('hero-lambda');
    const flow = document.getElementById('hero-flow');
    const reseed = document.getElementById('hero-reseed');
    const lamOut = document.getElementById('hero-lambda-out');
    const flowOut = document.getElementById('hero-flow-out');
    const seedOut = document.getElementById('hero-seed');
    const controls = box?.querySelector('.panel-controls');
    if (!controls) return;

    if (!heroPanel) { controls.remove(); return; }

    const applyLambda = () => {
      const v = Number(lam.value) / 1000;
      if (lamOut) lamOut.textContent = v.toFixed(3);
      heroModel.setLambda2(v);
      nudge(heroPanel, 90);
    };

    const applyFlow = () => {
      const v = Number(flow.value) / 100;
      if (flowOut) flowOut.textContent = v.toFixed(2);
      heroModel.setFlow(v);
      nudge(heroPanel, 90);
    };

    on(lam, 'input', applyLambda);
    on(flow, 'input', applyFlow);

    on(reseed, 'click', () => {
      const s = heroModel.reseed();
      if (seedOut) seedOut.textContent = `seed ${s}`;
      nudge(heroPanel, 190);
    });

    // The markup's defaults and the model's defaults have to agree, and the
    // browser may also have restored a slider position across a reload.
    applyLambda();
    applyFlow();
  })();

  return () => {
    for (const dispose of disposers.splice(0)) {
      try { dispose(); } catch { /* the node may already be gone */ }
    }
    panels.length = 0;
  };
}
