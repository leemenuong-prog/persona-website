/* ══════════════════════════════════════════════════════════════
   app.jsx — loader · nav · cursor · scroll engine · assembly.
   First principles: native scroll + sticky stages. The engine is
   one rAF that ONLY writes styles — geometry is measured once
   (and on resize), tones/progress/parallax all derive from a
   damped scroll value. No scroll-jacking.
   ══════════════════════════════════════════════════════════════ */

const { useState: useAppState, useEffect: useAppEffect, useRef: useAppRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#0047AB",
  "motion": "full",
  "cursor": true
}/*EDITMODE-END*/;

window.__progress = {};

/* ── loader — "I am" opens into "I alnt med" (the name lives
   inside the sentence), then the curtain lifts ─────────────── */
/* loader → logo morph: the letters of "I am" freeze into bars —
   I → 1 bar, a → 3 bars, m → 4 bars (the logo's 8) — then the
   bars + blue period fly apart into the hero band as the curtain
   lifts. The viewer literally watches the words become the mark. */
function morphToLogo(rootEl, onLift, onSettled) {
  const bm = document.querySelector(".brandmorph");
  const rev = rootEl && rootEl.querySelector(".lreveal");
  if (!bm || !rev) { onLift(); onSettled(); return; }
  bm.classList.add("preset", "veil");
  const tBars = [...bm.querySelectorAll(".band i")].map((el) => el.getBoundingClientRect());
  const tSq = bm.querySelector(".band .bsq").getBoundingClientRect();
  /* sources: split each glyph's box into its bar count */
  const srcs = [];
  [[".gi", 1], [".ga", 3], [".gm", 4]].forEach(([sel, n]) => {
    const g = rev.querySelector(sel); if (!g) return;
    const r = g.getBoundingClientRect(), cw = r.width / n;
    for (let i = 0; i < n; i++)
      srcs.push({ x: r.left + i * cw + cw * 0.15, y: r.top, w: cw * 0.7, h: r.height });
  });
  const lsq = rev.querySelector(".lsq");
  const sqr = lsq ? lsq.getBoundingClientRect() : tSq;
  const ov = document.createElement("div");
  ov.className = "morph-ov";
  const put = (el, r) => { el.style.left = r.x + "px"; el.style.top = r.y + "px"; el.style.width = r.w + "px"; el.style.height = r.h + "px"; };
  const clones = srcs.map((s) => {
    const d = document.createElement("div"); d.className = "mbar";
    put(d, { x: s.x, y: s.y + s.h, w: s.w, h: 0 });  /* collapsed at baseline */
    ov.appendChild(d); return d;
  });
  const sq = document.createElement("div"); sq.className = "mbar msq";
  put(sq, { x: sqr.left, y: sqr.top, w: sqr.width, h: sqr.height });
  ov.appendChild(sq);
  document.body.appendChild(ov);
  if (lsq) lsq.style.visibility = "hidden";
  /* phase i — bars rise over the letters, letters fade */
  requestAnimationFrame(() => requestAnimationFrame(() => {
    rev.classList.add("gone");
    clones.forEach((d, i) => {
      d.style.transition = `top .26s var(--ez) ${(i * 0.03).toFixed(2)}s, height .26s var(--ez) ${(i * 0.03).toFixed(2)}s`;
      put(d, srcs[i]);
    });
  }));
  /* phase ii — bars fly apart into the band; curtain lifts */
  setTimeout(() => {
    onLift();
    const fly = (d, t, delay, bg) => {
      d.style.transition = `left 1.05s var(--ez) ${delay}s, top 1.05s var(--ez) ${delay}s, width 1.05s var(--ez) ${delay}s, height 1.05s var(--ez) ${delay}s, background-color .9s var(--ez-io) ${delay}s`;
      put(d, { x: t.left, y: t.top, w: t.width, h: t.height });
      d.style.backgroundColor = bg;
    };
    clones.forEach((d, i) => fly(d, tBars[i] || tBars[tBars.length - 1], i * 0.035, "var(--ink)"));
    fly(sq, tSq, 0.05, "var(--paper)");
  }, 400);
  /* swap — clones land exactly on the real band; reveal it, drop them */
  setTimeout(() => {
    bm.classList.remove("veil");
    ov.remove();
    setTimeout(() => bm.classList.remove("preset"), 80);
    onSettled();
  }, 400 + 1350);
}

function Loader({ onDone }) {
  const [pct, setPct] = useAppState(0);
  const [rev, setRev] = useAppState(false);
  const [off, setOff] = useAppState(false);
  useAppEffect(() => {
    const t0 = performance.now();
    const DUR = 1900;
    let fin = false;
    const rt = setTimeout(() => setRev(true), 480);
    const stop = window.__addLoop((now) => {
      const t = Math.min((now - t0) / DUR, 1);
      setPct(Math.round(aEase(t) * 100));
      if (t >= 1 && !fin) {
        fin = true; stop();
        /* condense "I alnt med" back to "I am"… */
        setTimeout(() => setRev(false), 260);
        /* …then the letters freeze into bars and fly apart into the logo */
        setTimeout(() => {
          morphToLogo(
            document.querySelector(".loader"),
            () => {
              setOff(true);
              document.body.classList.add("ready");
              setTimeout(onDone, 1050);
            },
            () => {}
          );
        }, 1380);
      }
    });
    return () => { stop(); clearTimeout(rt); };
  }, []);
  return (
    <div className={"loader" + (off ? " off" : "")}>
      <div className="box">
        <div className="lkick"><span className="sq"></span>理性的艺术 · The Art of Rationality</div>
        <div className={"lreveal" + (rev ? " show" : "")} aria-label="I am — I alnt med">
          <span className="g gi">I</span><span>&nbsp;</span><span className="g ga">a</span><span className="ins">lnt&nbsp;</span><span className="g gm">m</span><span className="ins">ed</span><i className="lsq" aria-hidden="true"></i>
        </div>
        <div className="lbar"><i style={{ width: pct + "%" }}></i></div>
        <div className="lrow"><span>LOADING</span><span>{String(pct).padStart(3, "0")} %</span></div>
      </div>
    </div>
  );
}

/* ── nav ──────────────────────────────────────────────────── */
function Nav({ jump, navRef }) {
  const items = [["whoami", "WHOAMI"], ["work", "WORK"], ["contact", "CONTACT"]];
  return (
    <header className="nav" ref={navRef}>
      <a className="wordmark" data-hov href="#hero" onClick={(e) => { e.preventDefault(); jump("hero"); }}>
        <span className="logoslot" aria-label=".IAM."></span><small>ALNT MED</small>
      </a>
      <nav className="menu">
        {items.map(([id, lb], i) => (
          <React.Fragment key={id}>
            {i > 0 && <span className="sl">/</span>}
            <a data-nav={id} data-hov href={"#" + id}
               onClick={(e) => { e.preventDefault(); jump(id === "work" ? "aipm" : id === "whoami" ? "whoami" : "contact"); }}>{lb}</a>
          </React.Fragment>
        ))}
      </nav>
      <span className="handle">@alntmed</span>
    </header>
  );
}

/* ── chapter configs ──────────────────────────────────────── */
/* ── brand band — .IAM. · rhythm bars + twin periods.
   Lives fixed at hero top; the engine glides it into the nav. ─ */
const IAM_BARS = [0.97, 0.58, 1.0, 0.66, 0.9, 0.52, 0.74, 1.0];
function BrandBand({ jump }) {
  return (
    <a className="brandmorph" href="#hero" data-hov aria-label=".IAM. — Alnt Med"
       onClick={(e) => { e.preventDefault(); jump("hero"); }}>
      <div className="band">
        <span className="bsq"></span>
        {IAM_BARS.map((h, i) => (
          <i key={i} style={{ "--h": h, "--d": (0.15 + i * 0.07) + "s" }}></i>
        ))}
        <span className="bdot"></span>
      </div>
    </a>
  );
}

/* chapter sections (02–04) now live in chapters.jsx —
   three identities, three dimensions: FLAT 平面 · AXON 体 · FIELD 场 */

/* ── App ──────────────────────────────────────────────────── */
function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [loading, setLoading] = useAppState(true);
  const navRef = useAppRef(null);
  const curRef = useAppRef(null);

  /* accent */
  useAppEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--blue", tweaks.accent);
    const up = { "#0047AB": "#2b5fde", "#2b5fde": "#6f93ff", "#0b0b0e": "#444" }[tweaks.accent] || tweaks.accent;
    root.style.setProperty("--blue-up", up);
    const dn = { "#0047AB": "#002a66", "#2b5fde": "#163a96", "#0b0b0e": "#000000" }[tweaks.accent] || tweaks.accent;
    root.style.setProperty("--blue-dn", dn);
  }, [tweaks.accent]);
  useAppEffect(() => { window.__calm = tweaks.motion === "calm"; }, [tweaks.motion]);

  /* cinematic jump */
  const jump = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const from = window.scrollY;
    /* land mid-way through sticky chapters so the stage is composed */
    const wrap = el.querySelector(".ch-wrap");
    const to = wrap ? el.offsetTop + Math.min(wrap.offsetHeight * 0.45, wrap.offsetHeight - innerHeight) : el.offsetTop;
    const t0 = performance.now(), DUR = Math.min(1500, 500 + Math.abs(to - from) * 0.12);
    const ezio = (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2);
    const stop = window.__addLoop((now) => {
      const t = Math.min((now - t0) / DUR, 1);
      window.scrollTo(0, from + (to - from) * ezio(t));
      if (t >= 1) stop();
    });
  };

  /* cursor */
  useAppEffect(() => {
    const cur = curRef.current; if (!cur) return;
    if (!tweaks.cursor) { cur.style.display = "none"; return; }
    cur.style.display = "";
    let x = -100, y = -100, tx = -100, ty = -100;
    const mv = (e) => { tx = e.clientX; ty = e.clientY; };
    const over = (e) => { if (e.target.closest("[data-hov], a, button")) cur.classList.add("big"); else cur.classList.remove("big"); };
    window.addEventListener("pointermove", mv, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    let lastT = performance.now();
    const stop = window.__addLoop((now) => {
      const dt = Math.min((now - lastT) / 1000, 0.05); lastT = now;
      const a = 1 - Math.exp(-dt * 26);
      x += (tx - x) * a; y += (ty - y) * a;
      cur.style.transform = `translate(${(x - 6).toFixed(1)}px, ${(y - 6).toFixed(1)}px)`;
    });
    return () => { stop(); window.removeEventListener("pointermove", mv); window.removeEventListener("pointerover", over); };
  }, [tweaks.cursor, loading]);

  /* ── the engine ── */
  useAppEffect(() => {
    if (loading) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* tone background crossfade — interpolated in JS because the body's
       CSS background-color transition stalls in this engine. setTone
       flips data-tone (which switches --fg / --line / --acc instantly)
       and kicks off an rAF fade of the page background-color. */
    const TONE_RGB = { blue: [0, 71, 171], paper: [239, 236, 230], ink: [11, 11, 14] };
    let bgFrom = TONE_RGB[document.body.dataset.tone] || TONE_RGB.blue;
    let bgTo = bgFrom, bgStart = 0, bgFade = false;
    const BG_DUR = reduce ? 0 : 640;
    document.body.style.backgroundColor = `rgb(${bgFrom.join(",")})`;
    const setTone = (tone) => {
      document.body.dataset.tone = tone;
      const next = TONE_RGB[tone]; if (!next) return;
      const cs = (getComputedStyle(document.body).backgroundColor.match(/\d+/g) || []).map(Number);
      bgFrom = cs.length >= 3 ? cs : bgTo;
      bgTo = next; bgStart = performance.now(); bgFade = true;
    };

    /* counters — run when a stage reveals */
    const runCounters = (root) => {
      root.querySelectorAll("[data-cnt]").forEach((el) => {
        const target = parseFloat(el.dataset.cnt), fmt = el.dataset.fmt;
        const t0 = performance.now(), DUR = 1500;
        const stopC = window.__addLoop((now) => {
          const t = Math.min((now - t0) / DUR, 1);
          const v = target * aEase(t);
          el.textContent = (target % 1 !== 0) ? v.toFixed(2) : Math.round(v) + (fmt || "");
          if (t >= 1) stopC();
        });
      });
    };

    /* geometry — measured once + on resize */
    let vh = innerHeight;
    let tones = [], progs = [], paras = [], ghostRows = [], obs = [], brand = null;
    const absTop = (el) => el.getBoundingClientRect().top + window.scrollY;
    const measure = () => {
      vh = innerHeight;
      tones = [...document.querySelectorAll("[data-tone]")]
        .filter((el) => el.tagName === "SECTION")
        .map((el) => ({ tone: el.dataset.tone, top: absTop(el), h: el.offsetHeight }));
      progs = [...document.querySelectorAll("[data-prog]")]
        .map((el) => ({ id: el.dataset.prog, top: absTop(el), h: el.offsetHeight }));
      paras = [...document.querySelectorAll("[data-parallax]")]
        .map((el) => {
          const sec = el.closest("section");
          return { el, f: parseFloat(el.dataset.parallax), top: sec ? absTop(sec) : 0, h: sec ? sec.offsetHeight : 1 };
        });
      obs = [...document.querySelectorAll("[data-ob]")]
        .map((el) => {
          const sec = el.closest("section");
          return { el, top: sec ? absTop(sec) : absTop(el), done: el.classList.contains("in") };
        });
      const gr = document.querySelector("[data-ghostrows]");
      ghostRows = gr ? [...gr.children] : [];
      /* brand band — slot (hero) + dock (nav logoslot) geometry */
      const bm = document.querySelector(".brandmorph");
      const bslot = document.querySelector(".band-slot");
      const lslot = navRef.current && navRef.current.querySelector(".logoslot");
      brand = null;
      if (bm && bslot && lslot) {
        const sr = bslot.getBoundingClientRect();
        const nr = navRef.current.getBoundingClientRect();
        const lr = lslot.getBoundingClientRect();
        /* measure the morph element's untransformed base position —
           don't assume it equals the slot */
        const tf = bm.style.transform;
        bm.style.transform = "none";
        const br = bm.getBoundingClientRect();
        bm.style.transform = tf;
        const fslot = document.querySelector(".fband-slot");
        const fr = fslot ? fslot.getBoundingClientRect() : null;
        const maxScroll = Math.max(document.documentElement.scrollHeight - vh, 1);
        const wkEl = document.getElementById("works");
        const wkWrap = wkEl ? wkEl.querySelector(".wk-wrap") : null;
        brand = {
          el: bm,
          baseL: br.left, baseT: br.top,
          slotL: sr.left, slotT: sr.top + window.scrollY,
          dockL: lr.left - nr.left, dockT: lr.top - nr.top,
          s: lr.width / Math.max(sr.width, 1),
          M: Math.max(sr.top + window.scrollY + sr.height, 1),
          fslotL: fr ? fr.left : 0, fslotT: fr ? fr.top + window.scrollY : 0,
          maxScroll,
          wkTop: wkEl ? absTop(wkEl) : maxScroll,
          wkSpan: wkWrap ? Math.max(wkWrap.offsetHeight - vh, 1) : 1,
        };
      }
    };
    measure();
    addEventListener("resize", measure);
    const t1 = setTimeout(measure, 700), t2 = setTimeout(measure, 2200);

    let ss = scrollY, lastT = performance.now(), lastTone = "";
    const stopE = window.__addLoop((now) => {
      const dt = Math.min((now - lastT) / 1000, 0.05); lastT = now;
      const a = 1 - Math.exp(-dt * (reduce ? 60 : 11));
      ss += (scrollY - ss) * a;
      if (window.__snapScroll) { ss = scrollY; window.__snapScroll = false; }
      if (Math.abs(scrollY - ss) < 0.1) ss = scrollY;
      const calm = window.__calm ? 0.35 : 1;

      /* per-chapter progress */
      progs.forEach((c) => {
        window.__progress[c.id] = window.__forceProg != null ? window.__forceProg
          : aClamp((ss - c.top) / Math.max(c.h - vh, 1), -0.1, 1.1);
      });

      /* reveals — no IntersectionObserver, pure geometry */
      obs.forEach((o) => {
        if (o.done) return;
        if (ss + vh * 0.72 > o.top) { o.done = true; o.el.classList.add("in"); runCounters(o.el); }
      });

      /* drive the tone background crossfade */
      if (bgFade) {
        const t = BG_DUR ? Math.min((now - bgStart) / BG_DUR, 1) : 1;
        const e = t * t * (3 - 2 * t);
        const ch = (k) => Math.round(bgFrom[k] + (bgTo[k] - bgFrom[k]) * e);
        document.body.style.backgroundColor = `rgb(${ch(0)},${ch(1)},${ch(2)})`;
        if (t >= 1) bgFade = false;
      }

      /* tone — section under the viewport's midline */
      const mid = ss + vh * 0.5;
      for (const tn of tones) {
        if (mid >= tn.top && mid < tn.top + tn.h) {
          if (tn.tone !== lastTone) { lastTone = tn.tone; setTone(tn.tone); }
          break;
        }
      }

      /* parallax ghosts */
      paras.forEach((g) => {
        const rel = (ss - g.top + vh) / (g.h + vh);          /* 0…1 through section */
        const py = (rel - 0.5) * vh * g.f * 2 * calm;
        g.el.style.setProperty("--py", py.toFixed(1) + "px");
      });

      /* hero ghost rows pan */
      ghostRows.forEach((row, i) => {
        const dir = i % 2 ? 1 : -1;
        row.style.transform = `translateX(${(dir * ss * 0.22 * calm - 60).toFixed(1)}px)`;
      });

      /* brand band — hero top → nav corner → WORKS centre (the mark the
         section unfolds from) → footer band. One fixed element does the whole
         narrative; opacity hands the closed mark off to the works deck. */
      if (brand) {
        const W = innerWidth, H = vh;
        const sm = (a, b, v) => { const t = aClamp((v - a) / ((b - a) || 1e-6), 0, 1); return t * t * (3 - 2 * t); };
        /* phase A — hero slot → nav dock */
        const p = aClamp(ss / brand.M, 0, 1);
        const e2 = p * p * (3 - 2 * p);
        let x = brand.slotL + (brand.dockL - brand.slotL) * e2;
        let y = (brand.slotT - ss) * (1 - e2) + brand.dockT * e2;
        let sc = 1 + (brand.s - 1) * e2;

        /* phase W — WORKS arrives: the nav mark flies to the stage centre and
           grows into the enlarged closed logo. It vanishes (opacity) while the
           deck is open and re-forms at the end. */
        const pW = aClamp((ss - brand.wkTop) / brand.wkSpan, 0, 1.2);
        const wsScale = Math.min(0.46, (W * 0.42) / Math.max(W - 80, 1));
        const bandW = (W - 80) * wsScale;
        const bandH = (H * 0.34) * wsScale;
        const wcX = W * 0.5 - bandW * 0.5;
        const wcY = H * 0.46 - bandH;
        const einW = sm(0, 0.05, pW);
        x += (wcX - x) * einW;
        y += (wcY - y) * einW;
        sc += (wsScale - sc) * einW;

        /* phase F — works done: grow large and settle onto the footer band slot */
        const fStart = brand.wkTop + brand.wkSpan;
        const q = aClamp((ss - fStart) / Math.max(brand.maxScroll - fStart, 1), 0, 1);
        const e3 = q * q * (3 - 2 * q);
        x += (brand.fslotL - x) * e3;
        y += (brand.fslotT - ss - y) * e3;
        sc += (1 - sc) * e3;

        brand.el.style.transform = `translate3d(${(x - brand.baseL).toFixed(2)}px, ${(y - brand.baseT).toFixed(2)}px, 0) scale(${sc.toFixed(4)})`;
        /* opacity — the logo fades OFF THE TOP of cards that already exactly
           replicate its bars (same place, width, ink), so the bar columns show
           no change at all — only the two blue periods softly melt. A true
           handoff, not a crossfade. The works tick publishes openness as
           window.__wkOpen; we hold full until the cards are present (eS≈0.05). */
        const op = 1 - sm(0.02, 0.12, window.__wkOpen || 0);
        brand.el.style.opacity = op.toFixed(3);
        brand.el.style.pointerEvents = op < 0.5 ? "none" : "";
      }

      /* nav active group */
      if (navRef.current) {
        const ids = window.__progress;
        const grp = (ss + vh * 0.5) < (progs[0] ? progs[0].top : 1e9) ? "whoami"
          : (ids.works != null && ids.works > 1.02 || lastToneIsContact()) ? "contact" : "work";
        navRef.current.querySelectorAll("a[data-nav]").forEach((el) =>
          el.classList.toggle("active", el.dataset.nav === grp));
      }
      function lastToneIsContact() {
        const c = document.getElementById("contact");
        return c && ss + vh * 0.6 > c.offsetTop;  /* cheap, contact is last */
      }
    });
    return () => {
      stopE();
      removeEventListener("resize", measure);
      clearTimeout(t1); clearTimeout(t2);
    };
  }, [loading]);

  useAppEffect(() => { document.body.style.overflow = loading ? "hidden" : ""; }, [loading]);

  const { Hero, Whoami, Dex, Works, Contact, ChAipm, ChDev, ChArch } = window;

  return (
    <>
      <div className="cur" ref={curRef} aria-hidden="true"></div>
      {loading && <Loader onDone={() => setLoading(false)} />}
      <Nav jump={jump} navRef={navRef} />
      <BrandBand jump={jump} />
      <main>
        <Hero />
        <Whoami />
        <Dex jump={jump} />
        <ChAipm jump={jump} />
        <ChDev jump={jump} />
        <ChArch jump={jump} />
        <Works jump={jump} />
        <Contact />
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Accent · 钴蓝" />
        <TweakColor label="Blue" value={tweaks.accent}
          options={["#0047AB", "#2b5fde", "#0b0b0e"]}
          onChange={(v) => setTweak("accent", v)} />
        <TweakSection label="Motion · 动效" />
        <TweakRadio label="Intensity" value={tweaks.motion}
          options={[{ value: "full", label: "电影感 Full" }, { value: "calm", label: "克制 Calm" }]}
          onChange={(v) => setTweak("motion", v)} />
        <TweakToggle label="Custom cursor" value={tweaks.cursor} onChange={(v) => setTweak("cursor", v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
