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
  "motion": "full"
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
    /* 落色 = 各元素在 hero（ink 调）下的静息色：条走 --hard（ink 调翻纸色）、
       句点走 --blue-up（ink 调的跳色） */
    clones.forEach((d, i) => fly(d, tBars[i] || tBars[tBars.length - 1], i * 0.035, "var(--hard)"));
    fly(sq, tSq, 0.05, "var(--blue-up)");
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
               onClick={(e) => { e.preventDefault(); jump(id === "work" ? "works" : id); }}>{lb}</a>
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

  /* accent */
  useAppEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--blue", tweaks.accent);
    const up = { "#0047AB": "#2b5fde", "#2b5fde": "#6f93ff", "#0b0b0e": "#444" }[tweaks.accent] || tweaks.accent;
    root.style.setProperty("--blue-up", up);
    const dn = { "#0047AB": "#002a66", "#2b5fde": "#163a96", "#0b0b0e": "#000000" }[tweaks.accent] || tweaks.accent;
    root.style.setProperty("--blue-dn", dn);
    window.__toneDirty = true;   /* invalidate the engine's per-tone snapshots */
  }, [tweaks.accent]);
  useAppEffect(() => { window.__calm = tweaks.motion === "calm"; }, [tweaks.motion]);

  /* cinematic jump */
  const jump = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const from = window.scrollY;
    /* land mid-way through sticky chapters so the stage is composed */
    const wrap = el.querySelector(".ch-wrap");
    /* cap the landing at 0.8×span so compressed chapters land composed, not resolved */
    const to = wrap ? el.offsetTop + Math.min(wrap.offsetHeight * 0.45, (wrap.offsetHeight - innerHeight) * 0.8) : el.offsetTop;
    const t0 = performance.now(), DUR = Math.min(1500, 500 + Math.abs(to - from) * 0.12);
    const ezio = (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2);
    const stop = window.__addLoop((now) => {
      const t = Math.min((now - t0) / DUR, 1);
      window.scrollTo(0, from + (to - from) * ezio(t));
      if (t >= 1) stop();
    });
  };

  /* (自定义方块光标已移除 — 2026-07-05 用户决定；hover 反馈由元素自身样式承担) */

  /* ── the engine ── */
  useAppEffect(() => {
    if (loading) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* tone recolor crossfade — the WHOLE page recolors as ONE piece (bg +
       inherited text + lines + accents), interpolated in JS. We can't lean
       on CSS transitions: var()-driven transitions on the tone tokens stall
       in this engine, and flipping data-tone alone SNAPS --fg/--line/--acc
       instantly while only the background fades — that mismatch is the
       "闪屏" flicker (worst on the blue→paper entry into AIPM). So setTone
       keeps flipping data-tone (for non-color selectors like .bsq / .cur),
       but every tone-derived COLOR var is interpolated per-frame as a
       literal rgb()/rgba() inline on <body>, which outranks the
       body[data-tone] rule. Same idiom as the per-frame card colour lerp in
       sections.jsx (Works).
       ⚠ Tone colours now live in TWO places: the body[data-tone] rules in
       base.css (seed / fallback) AND this TONE_VARS table (runtime). Change
       a tone → edit both. */
    const TONE_VARS = {
      blue:  { bg: [0, 71, 171, 1],    fg: [239, 236, 230, 1], fgDim: [239, 236, 230, 0.62], line: [239, 236, 230, 0.18], ghost: [8, 10, 26, 0.20],     hard: [11, 11, 14, 1],    accKey: "--blue-dn" },
      paper: { bg: [239, 236, 230, 1], fg: [11, 11, 14, 1],    fgDim: [11, 11, 14, 0.55],    line: [11, 11, 14, 0.15],    ghost: [11, 11, 14, 0.06],    hard: [11, 11, 14, 1],    accKey: "--blue" },
      /* snow — a cool near-white that MATCHES the Pears deck slides (rgb 245,245,247);
         the Reel uses it so the engine crossfades paper→snow as you arrive at the
         deck and snow→ink as you leave, instead of the slides clashing on warm paper. */
      snow:  { bg: [245, 245, 247, 1], fg: [11, 11, 14, 1],    fgDim: [11, 11, 14, 0.55],    line: [11, 11, 14, 0.12],    ghost: [11, 11, 14, 0.05],    hard: [11, 11, 14, 1],    accKey: "--blue" },
      ink:   { bg: [11, 11, 14, 1],    fg: [239, 236, 230, 1], fgDim: [239, 236, 230, 0.55], line: [239, 236, 230, 0.13], ghost: [239, 236, 230, 0.05], hard: [239, 236, 230, 1], accKey: "--blue-up" },
    };
    const VK = ["bg", "fg", "fgDim", "line", "ghost", "hard", "acc"];
    const CSSVAR = { bg: "--bg", fg: "--fg", fgDim: "--fg-dim", line: "--line", ghost: "--ghost", hard: "--hard", acc: "--acc" };
    const parseColor = (v) => {
      v = (v || "").trim();
      if (v[0] === "#") { const n = parseInt(v.slice(1), 16); return v.length >= 7 ? [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1] : [0, 71, 171, 1]; }
      const m = (v.match(/-?\d+(\.\d+)?/g) || []).map(Number);
      return m.length >= 3 ? [m[0], m[1], m[2], m.length >= 4 ? m[3] : 1] : [0, 71, 171, 1];
    };
    const toneSnapshot = (tone) => {
      const t = TONE_VARS[tone] || TONE_VARS.blue;
      /* --acc is tweakable (--blue / --blue-up / --blue-dn live on :root) → resolve live */
      const acc = parseColor(getComputedStyle(document.documentElement).getPropertyValue(t.accKey));
      return { bg: t.bg, fg: t.fg, fgDim: t.fgDim, line: t.line, ghost: t.ghost, hard: t.hard, acc };
    };
    const emit = (vals) => {
      const c = vals.bg;
      document.body.style.backgroundColor = `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;
      for (const k of VK) {
        const v = vals[k], a = v[3] == null ? 1 : v[3];
        document.body.style.setProperty(CSSVAR[k],
          a >= 1 ? `rgb(${v[0] | 0},${v[1] | 0},${v[2] | 0})`
                 : `rgba(${v[0] | 0},${v[1] | 0},${v[2] | 0},${a.toFixed(3)})`);
      }
    };
    /* snapshots cached per tone — resolving --acc via getComputedStyle every
       frame would be a style read in the hot loop; the accent tweak flags the
       cache dirty instead (window.__toneDirty, set in the accent effect). */
    let snapCache = {};
    const snap = (tone) => snapCache[tone] || (snapCache[tone] = toneSnapshot(tone));
    let cur = snap(document.body.dataset.tone || "ink");
    let lastToneKey = "";
    emit(cur);   /* seed frame 0 — inline literals consistent from the start (no FOUC mismatch) */

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
          /* data-ob="self" anchors the reveal to the ELEMENT's own top — deep
             blocks in long sections (reel part 2, the aipm boards) reveal on
             arrival instead of burning their entrance when the section top
             scrolls past. Default keeps the section anchor. */
          const sec = el.dataset.ob === "self" ? null : el.closest("section");
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
          /* fit the docked mark inside the nav by BOTH axes — width alone
             leaves a near-square phone band ~3x too tall (it hung over the
             page on mobile). min() keeps the logo's aspect and guarantees it
             never exceeds the nav-slot height. */
          s: Math.min(lr.width / Math.max(sr.width, 1), lr.height / Math.max(sr.height, 1)),
          M: Math.max(sr.top + window.scrollY + sr.height, 1),
          fslotL: fr ? fr.left : 0, fslotT: fr ? fr.top + window.scrollY : 0,
          maxScroll,
          wkTop: wkEl ? absTop(wkEl) : maxScroll,
          wkSpan: wkWrap ? Math.max(wkWrap.offsetHeight - vh, 1) : 1,
          ctTop: (() => { const c = document.getElementById("contact"); return c ? absTop(c) : maxScroll; })(),
        };
      }
    };
    measure();
    /* On phones the URL bar shows/hides while scrolling, firing 'resize' with a
       changed innerHeight but the SAME width. A full measure() mid-scroll snaps
       every section top + the brandmorph phase math → a visible jump. So gate the
       remeasure on a real WIDTH change (orientation / rotate) and debounce it;
       height-only changes just refresh vh for the progress denominator. */
    let lastW = innerWidth, rzT = null;
    const onResize = () => {
      if (innerWidth === lastW) { vh = innerHeight; return; }
      lastW = innerWidth;
      clearTimeout(rzT); rzT = setTimeout(measure, 150);
    };
    addEventListener("resize", onResize);
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
        /* floor widened to -0.6 so stages can choreograph an entrance PRELUDE
           during the glide-in (canvases that gate on p<=0 are unaffected) */
        window.__progress[c.id] = window.__forceProg != null ? window.__forceProg
          : aClamp((ss - c.top) / Math.max(c.h - vh, 1), -0.6, 1.1);
      });

      /* reveals — no IntersectionObserver, pure geometry */
      obs.forEach((o) => {
        if (o.done) return;
        if (ss + vh * 0.72 > o.top) { o.done = true; o.el.classList.add("in"); runCounters(o.el); }
      });

      /* ── tone — scroll-DRIVEN crossfade (was a 700ms timer). Each boundary
         between two DIFFERENT tones owns a ±22vh mixing band; the viewport
         midline's position inside the band IS the blend. Pure function of the
         damped scroll: slow scrolling melts the tones together, reverse
         scrolling rewinds, and resting at a boundary holds a stable mix — the
         timer used to re-trigger a full-page fade on every wiggle, and its
         fixed 700ms could never stay in step with the content's own scroll-
         driven entrances. ── */
      if (window.__toneDirty) { snapCache = {}; window.__toneDirty = false; }
      if (tones.length) {
        const mid = ss + vh * 0.5;
        const BAND = reduce ? vh * 0.02 : vh * 0.22;
        let ti = 0;
        for (let k = 0; k < tones.length; k++) {
          if (mid >= tones[k].top) ti = k; else break;
        }
        /* nearest different-tone boundary and the blend across its band */
        let A = tones[ti].tone, B = A, e = 0;
        const prevT = tones[ti - 1], nextT = tones[ti + 1];
        if (prevT && prevT.tone !== A && mid < tones[ti].top + BAND) {
          B = A; A = prevT.tone;
          e = (mid - (tones[ti].top - BAND)) / (BAND * 2);
        } else if (nextT && nextT.tone !== A && mid > nextT.top - BAND) {
          B = nextT.tone;
          e = (mid - (nextT.top - BAND)) / (BAND * 2);
        }
        e = aClamp(e, 0, 1);
        /* double smoothstep — steepen the middle so the low-contrast
           mid-blend moment stays brief */
        e = e * e * (3 - 2 * e);
        e = e * e * (3 - 2 * e);
        /* the TEXT family gets two more passes: fg and bg cross each other at
           the band centre (both hit the same grey — text vanishes for an
           instant), so the text's own grey zone is compressed to a sliver
           (~4vh of scroll) it snaps across while the ground melts slowly */
        let ef = e * e * (3 - 2 * e);
        ef = ef * ef * (3 - 2 * ef);
        /* discrete data-tone flip at band centre, with hysteresis so hovering
           at the midpoint can't flicker the non-color selectors */
        let want = lastTone;
        if (e > 0.55) want = B; else if (e < 0.45) want = A;
        if (!TONE_VARS[want]) want = A;
        if (want !== lastTone) { lastTone = want; document.body.dataset.tone = want; }
        /* interpolate + emit only when the blend actually moved */
        const key = A + B + ((e * 255) | 0);
        if (key !== lastToneKey) {
          lastToneKey = key;
          if (e <= 0) cur = snap(A);
          else if (e >= 1) cur = snap(B);
          else {
            const sa = snap(A), sb = snap(B), next = {};
            for (const k of VK) {
              const a = sa[k], b = sb[k];
              const t2 = (k === "fg" || k === "fgDim" || k === "hard") ? ef : e;
              const aa = a[3] == null ? 1 : a[3], ba = b[3] == null ? 1 : b[3];
              next[k] = [a[0] + (b[0] - a[0]) * t2, a[1] + (b[1] - a[1]) * t2, a[2] + (b[2] - a[2]) * t2, aa + (ba - aa) * t2];
            }
            cur = next;
          }
          emit(cur);
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
        /* floor -0.2 (was 0): einW's lift-off reads pW<0 during the glide-in —
           a 0-floor pinned pW at 0 everywhere above Works, which evaluated
           einW≈0.82 and parked the mark mid-screen on every chapter. */
        const pW = aClamp((ss - brand.wkTop) / brand.wkSpan, -0.2, 1.2);
        const wsScale = Math.min(0.46, (W * 0.42) / Math.max(W - 80, 1));
        const bandW = (W - 80) * wsScale;
        const bandH = (H * 0.34) * wsScale;
        const wcX = W * 0.5 - bandW * 0.5;
        const wcY = H * 0.46 - bandH;
        /* lift-off begins during the glide-in (pW<0) so the mark is already
           travelling as the works stage rises — no parked-then-jump beat */
        const einW = sm(-0.12, 0.05, pW);
        x += (wcX - x) * einW;
        y += (wcY - y) * einW;
        sc += (wsScale - sc) * einW;

        /* phase F — the deck reconverges into the mark at stage centre, then
           the mark rides ONE arc straight DOWN to the footer band slot —
           用户 2026-07-05: 看完作品不用回左上角，变回 logo 直接往下到底。
           (The old W-out dock-return phase is gone; scrolling back UP past
           works still re-opens the deck via einW/phase W as before.) */
        const fStart = Math.max(brand.ctTop - H, brand.wkTop + brand.wkSpan);
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
        const grp = (ss + vh * 0.5) < (progs[0] ? progs[0].top : 1e9) ? "whoami"
          : lastToneIsContact() ? "contact" : "work";
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
      removeEventListener("resize", onResize); clearTimeout(rzT);
      clearTimeout(t1); clearTimeout(t2);
      document.body.style.removeProperty("background-color");
      Object.values(CSSVAR).forEach((v) => document.body.style.removeProperty(v));
    };
  }, [loading]);

  useAppEffect(() => { document.body.style.overflow = loading ? "hidden" : ""; }, [loading]);

  const { Hero, Whoami, Works, Contact, ChAipmPlatform, ChDev, ChReel, ChArch } = window;

  return (
    <>
      {loading && <Loader onDone={() => setLoading(false)} />}
      <Nav jump={jump} navRef={navRef} />
      <BrandBand jump={jump} />
      <main>
        <Hero jump={jump} />
        <Whoami jump={jump} />
        <ChDev jump={jump} />
        <ChReel jump={jump} />
        <ChAipmPlatform jump={jump} />
        <ChArch jump={jump} />
        <Works jump={jump} />
        <Contact jump={jump} />
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
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
