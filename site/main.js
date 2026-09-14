/* ============================================================
   Exchange Rate Dynamics — dissertation hub
   Theme switch and the three live panels.

   The panels are deliberately small. They are reduced
   illustrations of the two chapters' mechanisms, written from
   the same equations but with tiny populations and short
   windows, so that they cost nothing to run on a landing page.
   They are not the chapters' published figures and no number
   read off them means anything. That is stated on the page.

   No dependencies, no network, one animation frame loop.
   ============================================================ */

(() => {
  'use strict';

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

  toggle?.addEventListener('click', () => {
    root.dataset.theme = isDark() ? 'light' : 'dark';
    try { localStorage.setItem('phd-theme', root.dataset.theme); } catch { /* private mode */ }
    palette.stale = true;
    syncToggle();
  });

  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
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
        img.src = './assets/cover.png';
        if (link) link.href = './assets/cover.png';
        return;
      }
      (link || img).remove();
      fallback.hidden = false;
      if (caption) caption.textContent = 'The title page \u00b7 defended 29 November 2004';
    };

    img.addEventListener('error', failed);
    // The script is deferred, so the image may already have settled by now.
    if (img.complete && img.naturalWidth === 0) failed();
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

    new ResizeObserver(resize).observe(canvas);

    if (REDUCED) {
      // One still frame, pre-rolled far enough to be worth looking at.
      for (let i = 0; i < model.preroll; i++) model.step();
      resize();
      return;
    }

    for (let i = 0; i < model.preroll; i++) model.step();
    resize();

    new IntersectionObserver(
      ([e]) => { panel.visible = e.isIntersecting; },
      { rootMargin: '80px' }
    ).observe(canvas);

    panels.push(panel);
  }

  if (!REDUCED) {
    let last = 0;
    const FRAME = 1000 / 30;          // 30fps is plenty, and halves the battery cost
    requestAnimationFrame(function loop(t) {
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
    const DEPTH = 13, LAMBDA2 = 0.075, COLW = 2.4;
    let cols = 260;                     // replaced by resize() with the real width
    let seed = 20041129;
    let rng = mulberry32(seed);
    let sig = cascade(rng, DEPTH, LAMBDA2);
    let k = 0;

    const col = [];          // { s: intensity, p: price, n: arrivals }
    let price = 1;

    function step() {
      if (k >= sig.length) {                       // a fresh tree, same construction
        seed = (seed + 7919) | 0;
        rng = mulberry32(seed);
        sig = cascade(rng, DEPTH, LAMBDA2);
        k = 0;
      }
      const s = sig[k++];
      // Arrivals follow the intensity K = sigma^2. The cap matters: without it a
      // deep cascade spike drives exp(-rate) to zero and Knuth's sampler below
      // never terminates.
      const rate = Math.min(12, 2.4 * s * s);
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

      const priceH = h * 0.50, rasterY = priceH + 18, rasterH = 14;
      const bandY = rasterY + rasterH + 34, bandH = h - bandY - 12;
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

    return { step, draw, resize, preroll: 190 };
  })();

  /* ============================================================
     CHAPTER 1 — quiet periods, active periods

     The same cascade, shown the way the chapter shows it: as the
     size of returns through time. Clustering is not imposed; it
     is what a multiplicative tree looks like.
     ============================================================ */

  const ch1Model = (() => {
    const DEPTH = 12, LAMBDA2 = 0.09, COLW = 2.2;
    let cols = 190;
    let seed = 2004;
    let rng = mulberry32(seed);
    let sig = cascade(rng, DEPTH, LAMBDA2);
    let k = 0;
    const bar = [];

    function step() {
      if (k >= sig.length) {
        seed = (seed + 104729) | 0;
        rng = mulberry32(seed);
        sig = cascade(rng, DEPTH, LAMBDA2);
        k = 0;
      }
      bar.push(Math.abs(sig[k++] * gauss(rng)));
      while (bar.length > cols) bar.shift();
    }

    function resize(panel) {
      const want = Math.ceil(panel.w / COLW) + 2;
      if (want === cols) return;
      cols = want;
      while (bar.length > cols) bar.shift();
      while (bar.length < cols) step();
    }

    function draw(panel, c) {
      const { ctx, w, h } = panel;
      ctx.fillStyle = c['--bg-sunk'];
      ctx.fillRect(0, 0, w, h);
      const n = bar.length;
      if (!n) return;

      let max = 0;
      for (const b of bar) if (b > max) max = b;
      max = max || 1;

      const mid = h - 10;
      ctx.fillStyle = c['--accent'];
      for (let i = 0; i < n; i++) {
        const x = w - (n - 1 - i) * COLW;
        const hgt = (bar[i] / max) * (h - 24);
        ctx.globalAlpha = 0.35 + 0.65 * (bar[i] / max);
        ctx.fillRect(px(x) - 0.5, mid - hgt, 1.3, hgt);
      }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c['--rule'];
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, px(mid)); ctx.lineTo(w, px(mid)); ctx.stroke();
    }

    return { step, draw, resize, preroll: 190 };
  })();

  /* ============================================================
     CHAPTER 2 — a population that keeps changing its mind

     A reduced form of the chapter's switching dynamics: two
     chartist camps and a fundamentalist camp, with transition
     rates exponential in the opinion index and in the momentum
     each camp is currently earning, and a floor under every
     share so the population cannot absorb into one strategy.
     Small population, short window, illustrative only.
     ============================================================ */

  const ch2Model = (() => {
    const COLW = 2.2;
    let cols = 190;
    // Tuned so the chartist camps actually swing and the price stays bounded.
    // Left to itself the feedback optimists → excess demand → rising price →
    // stronger momentum → more optimists absorbs the whole population; the
    // signals are therefore bounded and the fundamentalists' pull grows with
    // the distance from fundamental value, which is what stops it.
    const P = {
      dt: 0.10, v1: 0.55, v2: 0.30,   // switching speeds
      a1: 0.6,  a2: 0.7,              // opinion index and momentum, inside U1
      a3: 1.0,  a4: 0.9,              // chartist vs fundamentalist attractiveness
      momScale: 0.006, gapScale: 0.05,
      floor: 0.10,                    // the chapter's floor under every share
      tc: 1.0, tf: 2.4, beta: 1.0,    // excess demand and the market maker
      noise: 0.0035, fdrift: 0.0012
    };
    const rng = mulberry32(20030601);

    let no = 0.34, np = 0.30, nf = 0.36;   // optimists, pessimists, fundamentalists
    let p = 100, F = 100, trend = 0;
    const hist = [];

    function step() {
      const nc = no + np;
      const x = nc > 1e-6 ? (no - np) / nc : 0;        // the opinion index
      const gap = (F - p) / p;
      const mom = Math.tanh(trend / P.momScale);       // bounded momentum signal
      const dist = Math.tanh(Math.abs(gap) / P.gapScale);

      // chartist ↔ chartist
      const U1 = P.a1 * x + P.a2 * mom;
      const rOP = P.v1 * nc * Math.exp(clamp(-U1, -2, 2));
      const rPO = P.v1 * nc * Math.exp(clamp(U1, -2, 2));
      // chartists ↔ fundamentalists: fundamentals win when price is far from F
      const U2 = P.a3 * Math.abs(mom) - P.a4 * dist;
      const rCF = P.v2 * Math.exp(clamp(-U2, -2, 2));
      const rFC = P.v2 * Math.exp(clamp(U2, -2, 2));

      const dOP = P.dt * (np * rPO - no * rOP);
      const share = nc > 1e-6 ? no / nc : 0.5;
      const cf = P.dt * (nc * rCF - nf * rFC);

      no += dOP - cf * share;
      np += -dOP - cf * (1 - share);
      nf += cf;

      if (!(isFinite(no) && isFinite(np) && isFinite(nf) && isFinite(p))) {
        no = 0.34; np = 0.30; nf = 0.36; p = 100; F = 100; trend = 0;
        return;
      }

      no = Math.max(P.floor, no); np = Math.max(P.floor, np); nf = Math.max(P.floor, nf);
      const tot = no + np + nf;
      no /= tot; np /= tot; nf /= tot;

      // excess demand moves the price, exactly as the market maker does
      const ed = P.tc * (no - np) + P.tf * nf * gap;
      const dp = clamp(P.beta * ed * P.dt + P.noise * gauss(rng), -0.05, 0.05);
      p *= Math.exp(dp);
      trend = 0.85 * trend + 0.15 * dp;
      F *= Math.exp(P.fdrift * gauss(rng));

      hist.push([no, np, nf]);
      while (hist.length > cols) hist.shift();
    }

    function resize(panel) {
      const want = Math.ceil(panel.w / COLW) + 2;
      if (want === cols) return;
      cols = want;
      while (hist.length > cols) hist.shift();
      while (hist.length < cols) step();
    }

    function draw(panel, c) {
      const { ctx, w, h } = panel;
      ctx.fillStyle = c['--bg-sunk'];
      ctx.fillRect(0, 0, w, h);
      const n = hist.length;
      if (n < 2) return;

      // Full bleed: the three shares sum to one, so the stack is the panel.
      const top = 0, band = h;
      const x = i => w - (n - 1 - i) * COLW;

      // stacked shares: optimists, pessimists, fundamentalists
      const layers = [
        [0, c['--optimist']],
        [1, c['--pessimist']],
        [2, c['--fundamentalist']]
      ];
      let base = new Float64Array(n);       // cumulative share below the current layer
      for (const [idx, colour] of layers) {
        ctx.beginPath();
        for (let i = 0; i < n; i++) ctx.lineTo(x(i), top + band * base[i]);
        for (let i = n - 1; i >= 0; i--) ctx.lineTo(x(i), top + band * (base[i] + hist[i][idx]));
        ctx.closePath();
        ctx.fillStyle = colour;
        ctx.globalAlpha = 0.68;
        ctx.fill();
        ctx.globalAlpha = 1;
        for (let i = 0; i < n; i++) base[i] += hist[i][idx];
      }

    }

    return { step, draw, resize, preroll: 310 };
  })();

  mount(document.getElementById('hero-canvas'), heroModel);
  mount(document.getElementById('ch1-canvas'), ch1Model);
  mount(document.getElementById('ch2-canvas'), ch2Model);
})();
