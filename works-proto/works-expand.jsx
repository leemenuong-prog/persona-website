/* ══════════════════════════════════════════════════════════════
   works-expand.jsx — WORKS, wired model.
   The flip-card deck stays. The card IN FOCUS stretches horizontally
   to reveal its name + honors (top); the area below is the WORK
   SHOWCASE (bottom). Browse by hovering / ←→.

   Media is now data-driven by `media.kind`:
     · link      — poster still, click opens the live project (new tab)
     · video     — inline <video> served from the repo
     · iframe    — poster still, click loads the interactive piece in-frame
     · portfolio — a dossier frame whose CTA opens the 作品集 PDF
   Every real slot also carries `portfolio` → the compressed 作品集 PDF,
   so users can always open the matching portfolio.
   ══════════════════════════════════════════════════════════════ */
const { useState, useRef, useEffect, useLayoutEffect } = React;

/* the compressed 作品集 (8.6MB) — small file, opens instantly in-browser */
const PORTFOLIO = "../uploads/portfolio.pdf";

const sm = (e0, e1, x) => { const u = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return u * u * (3 - 2 * u); };
const lp = (a, b, u) => a + (b - a) * u;
const clp = (v, a, b) => (v < a ? a : v > b ? b : v);

const SLOTS = [
  /* W·01 — Pears · 路演视频 lives on the live site (459MB, not in repo) */
  {
    real: true, ix: "W·01", tag: "AI PRODUCT", year: "2026", h: 0.97,
    display: "Pears", sub: "AGENT FACTORY · 智能体工厂",
    award: ["ADVENTURE-X HACKATHON · 2ND PRIZE", "OBSERVE → GENERATE → REINFORCE"],
    metrics: [["2nd", "HACKATHON PRIZE"], ["3", "ENDS SHIPPED SOLO"], ["PRD", "AS THE CONTRACT"]],
    media: { kind: "link", poster: "../works/pears-roadshow-cover.jpg", href: "https://pear-work-web.vercel.app/", label: "访问项目 ↗" },
    caption: "PEERSWORK · 路演视频 · 详见线上站",
    portfolio: PORTFOLIO,
  },
  /* W·02 — Pear Agent 动态影片 (the xtool platform film, interactive) */
  {
    real: true, ix: "W·02", tag: "PRODUCT FILM", year: "2026", h: 0.58,
    display: "Pear Agent", sub: "xTOOL 平台 · 动态影片",
    award: ["SCRIPT → RESEARCH → REVIEW", "FIVE-ACT MOTION FILM"],
    metrics: [["FILM", "MOTION PIECE"], ["5", "ACT STRUCTURE"], ["LIVE", "IN-BROWSER"]],
    media: { kind: "iframe", poster: "../xtool/screenshots/demo_review.png", href: "../xtool/", label: "▶ 播放影片" },
    caption: "PEAR AGENT · 平台动态影片 · MOTION FILM",
    portfolio: PORTFOLIO,
  },
  /* W·03 — in portfolio */
  {
    real: true, ix: "W·03", tag: "PORTFOLIO", year: "—", h: 1.0,
    display: "作品集收录", sub: "详见作品集 · IN PORTFOLIO",
    media: { kind: "portfolio", href: PORTFOLIO, label: "打开作品集 ↗" },
    caption: "作品集【李文苑】· FULL PORTFOLIO",
    portfolio: PORTFOLIO,
  },
  /* W·04 — UABB · Aftersilence (inline film, 16MB) */
  {
    real: true, ix: "W·04", tag: "INSTALLATION", year: "2024", h: 0.66,
    display: "Aftersilence", sub: "UABB · 城市\\建筑双年展",
    award: ["UABB · 深港城市\\建筑双年展", "SOUND × SILENCE × SPACE"],
    metrics: [["UABB", "BIENNALE"], ["16MB", "INLINE FILM"]],
    media: { kind: "video", src: "../works/aftersilence.mp4", poster: "" },
    caption: "UABB · AFTERSILENCE · 影像作品",
    portfolio: PORTFOLIO,
  },
  /* W·05–W·08 — in portfolio */
  { real: true, ink: true, ix: "W·05", tag: "PORTFOLIO", year: "—", h: 0.9, display: "作品集收录", sub: "详见作品集 · IN PORTFOLIO", media: { kind: "portfolio", href: PORTFOLIO, label: "打开作品集 ↗" }, caption: "作品集【李文苑】· FULL PORTFOLIO", portfolio: PORTFOLIO },
  { real: true, ink: true, ix: "W·06", tag: "PORTFOLIO", year: "—", h: 0.52, display: "作品集收录", sub: "详见作品集 · IN PORTFOLIO", media: { kind: "portfolio", href: PORTFOLIO, label: "打开作品集 ↗" }, caption: "作品集【李文苑】· FULL PORTFOLIO", portfolio: PORTFOLIO },
  { real: true, ink: true, ix: "W·07", tag: "PORTFOLIO", year: "—", h: 0.74, display: "作品集收录", sub: "详见作品集 · IN PORTFOLIO", media: { kind: "portfolio", href: PORTFOLIO, label: "打开作品集 ↗" }, caption: "作品集【李文苑】· FULL PORTFOLIO", portfolio: PORTFOLIO },
  { real: true, ink: true, ix: "W·08", tag: "PORTFOLIO", year: "—", h: 1.0, display: "作品集收录", sub: "详见作品集 · IN PORTFOLIO", media: { kind: "portfolio", href: PORTFOLIO, label: "打开作品集 ↗" }, caption: "作品集【李文苑】· FULL PORTFOLIO", portfolio: PORTFOLIO },
];

/* ── the collapsed (bar) face of a card ────────────────────── */
function DkMin({ sl, n }) {
  return (
    <div className="dk-min">
      <div className="dk-no">{String(n + 1).padStart(2, "0")}</div>
    </div>
  );
}

/* ── the expanded (focused) face — name + honors, horizontal ── */
function DkFull({ sl }) {
  const hasAward = Array.isArray(sl.award) && sl.award.length;
  const metrics = Array.isArray(sl.metrics) && sl.metrics.length
    ? sl.metrics : [["—", "待补充"], ["—", "TBD"]];
  return (
    <div className="dk-full">
      <div className="dk-l">
        <div className="dk-meta"><span className="ix">{sl.ix}</span><span>{sl.real ? sl.tag : "—"} · {sl.year || "----"}</span></div>
        {sl.real ? (
          <div className="dk-name">{sl.display}<i className="psq" aria-hidden="true"></i></div>
        ) : (
          <div className="dk-name dim">—</div>
        )}
        <div className="dk-sub">{sl.real ? sl.sub : "作品 · 待补充 / TBD"}</div>
      </div>
      <div className="dk-r">
        <div className="dk-award">
          {hasAward ? <React.Fragment><b>{sl.award[0]}</b><br />{sl.award[1]}</React.Fragment> : (sl.real ? sl.caption : "荣誉 · 待补充 / TBD")}
        </div>
        <div className="dk-metrics">
          {(sl.real ? metrics : [["—", "待补充"], ["—", "TBD"], ["—", "TBD"]]).map(([b, l], j) => (
            <div className="m" key={j}><b>{b}</b><span>{l}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── the showcase annotation bar (version C) ───────────────── */
function ScTop({ sl, version }) {
  if (version !== "C") return null;
  const right = !sl.real ? "ARCHIVE · 待补充 / TBD"
    : sl.media && sl.media.kind === "video" ? "PRODUCT FILM · 影像 · 16MB"
    : sl.media && sl.media.kind === "iframe" ? "MOTION FILM · 互动影片"
    : sl.media && sl.media.kind === "portfolio" ? "PORTFOLIO · 作品集 PDF"
    : "PRODUCT · 线上项目 ↗";
  return (
    <div className="sc-top">
      <span className="l"><span className="dot"></span><span>{sl.ix}</span><span>{sl.real ? sl.tag : "—"} · {sl.year || "----"}</span></span>
      <span className="r">{right}</span>
    </div>
  );
}

/* ── the media body, by kind ───────────────────────────────── */
function ScMedia({ sl }) {
  const [playing, setPlaying] = useState(false);
  const m = sl.media || {};

  if (m.kind === "video") {
    return (
      <div className="sc-media is-video">
        <video className="sc-video" src={m.src} poster={m.poster || undefined}
               controls playsInline preload="metadata" />
      </div>
    );
  }

  if (m.kind === "iframe") {
    if (playing) {
      return (
        <div className="sc-media is-frame">
          <iframe className="sc-iframe" src={m.href} title={sl.display}
                  loading="lazy" allow="autoplay; fullscreen"></iframe>
        </div>
      );
    }
    return (
      <button type="button" className="sc-media" onClick={() => setPlaying(true)} data-hov aria-label={"播放 " + sl.display}>
        {m.poster ? <img className="sc-still" src={m.poster} alt={sl.display} draggable="false" /> : <span className="sc-still sc-blank" />}
        <span className="sc-play" aria-hidden="true"><span className="tri"></span></span>
        <span className="sc-scrim" aria-hidden="true"></span>
      </button>
    );
  }

  if (m.kind === "portfolio") {
    return (
      <a className="sc-media is-pf" href={m.href} target="_blank" rel="noopener" data-hov>
        <span className="sc-pf">
          <span className="bars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
          <b>作品集 / PORTFOLIO</b>
          <span>{m.label || "打开作品集 ↗"}</span>
        </span>
        <span className="sc-scrim" aria-hidden="true"></span>
      </a>
    );
  }

  /* default — link to live project */
  return (
    <a className="sc-media" href={m.href || "#"} target="_blank" rel="noopener" data-hov>
      {m.poster ? <img className="sc-still" src={m.poster} alt={sl.display} draggable="false" /> : <span className="sc-still sc-blank" />}
      <span className="sc-play" aria-hidden="true"><span className="tri"></span></span>
      <span className="sc-scrim" aria-hidden="true"></span>
    </a>
  );
}

function Showcase({ sl, version }) {
  if (!sl.real) {
    return (
      <div className="sc-frame">
        <ScTop sl={sl} version={version} />
        <div className="sc-ph"><div className="n"><b>WORK SHOWCASE</b>作品展示 · 待补充 / TBD</div></div>
      </div>
    );
  }
  const m = sl.media || {};
  const foot = m.kind === "video" ? (m.label || "影像作品")
    : m.kind === "iframe" ? (m.label || "▶ 播放影片")
    : m.kind === "portfolio" ? (m.label || "打开作品集 ↗")
    : (m.label || "访问项目 ↗");
  const footHref = m.href || m.src;
  /* a portfolio slot's whole frame IS the portfolio link; for the others
     surface the 作品集 as a secondary action so users always reach it. */
  const showPfLink = m.kind !== "portfolio" && sl.portfolio;
  return (
    <div className="sc-frame">
      <ScTop sl={sl} version={version} />
      <ScMedia sl={sl} />
      <div className="sc-foot">
        {footHref && m.kind !== "video" ? (
          <a className="sc-name" href={footHref} target={m.kind === "iframe" ? "_self" : "_blank"} rel="noopener" data-hov>
            {sl.display}<i className="psq" aria-hidden="true"></i><span className="go">{foot}</span>
          </a>
        ) : (
          <span className="sc-name">{sl.display}<i className="psq" aria-hidden="true"></i></span>
        )}
        <div className="sc-cap">
          {sl.caption}
          {showPfLink ? <a className="sc-pf-link" href={sl.portfolio} target="_blank" rel="noopener" data-hov> · 作品集 PDF ↗</a> : null}
        </div>
      </div>
    </div>
  );
}

/* ── main ──────────────────────────────────────────────────── */
function WorksProto() {
  const [version, setVersion] = useState("C");
  const [focus, setFocus] = useState(0);
  const [intro, setIntro] = useState(true);
  const overlayRef = useRef(null);
  const N = SLOTS.length;

  useEffect(() => {
    const key = (e) => {
      if (e.key === "ArrowRight") setFocus((f) => Math.min(f + 1, N - 1));
      else if (e.key === "ArrowLeft") setFocus((f) => Math.max(f - 1, 0));
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  /* keep-alive rAF — this preview throttles the compositor when idle,
     freezing CSS transitions mid-flight. A continuous tick keeps the
     card-stretch and crossfades running. */
  useEffect(() => {
    let id; const loop = () => { id = requestAnimationFrame(loop); }; loop();
    return () => cancelAnimationFrame(id);
  }, []);

  /* ── THE ENTRANCE — the .IAM. skyline mark UNFOLDS into a fanned hand
     of poster cards, then the fan settles onto the live deck. One rAF
     timeline drives an absolute overlay; the fan→deck handoff lands
     pixel-exact for a seamless cut. 条 → 卡(扇) → deck. */
  useLayoutEffect(() => {
    if (!intro) return;
    const deck = document.querySelector(".wxp-deck");
    const stage = document.querySelector(".wxp");
    const overlay = overlayRef.current;
    if (!deck || !overlay || !stage) { setIntro(false); return; }
    const shells = [...overlay.children];

    const targets = [...deck.querySelectorAll(".dk-card")].map((c) => {
      const r = c.getBoundingClientRect();
      return { l: r.left, t: r.top, w: r.width, h: r.height };
    });
    if (targets.length !== N) { setIntro(false); return; }

    const sr = stage.getBoundingClientRect();
    const W = sr.width, H = sr.height, ox = sr.left, oy = sr.top;

    const cTot = clp(W * 0.42, 320, 900);
    const cw = cTot / (N * 1.62 - 0.62), cgap = cw * 0.62;
    const cx0 = W * 0.5 - cTot / 2, cBase = H * 0.46, cMax = H * 0.15;
    const logo = SLOTS.map((s, i) => {
      const h = s.h * cMax;
      return { l: ox + cx0 + i * (cw + cgap), w: cw, h, t: oy + cBase - h, rot: 0 };
    });

    const cardW = clp(W * 0.15, 132, 212);
    const cardH = clp(H * 0.32, 200, 300);
    const fanCx = W * 0.5;
    const step = Math.min(cardW * 0.92, (W * 0.94 - cardW) / (N - 1));
    const fanTop = H * 0.18, angStep = 1.45;
    const fan = SLOTS.map((s, i) => {
      const off = i - (N - 1) / 2;
      return { l: ox + fanCx + off * step - cardW / 2, w: cardW, h: cardH,
               t: oy + fanTop + Math.abs(off) * 6, rot: off * angStep };
    });

    const tgt = SLOTS.map((s) => (s.real ? [0, 71, 171] : [233, 229, 222]));
    const ink = [11, 11, 14];

    const eOut = (t) => 1 - Math.pow(1 - t, 3);
    const D = 2700; let start = null, raf = 0;
    const frame = (ts) => {
      if (start == null) start = ts;
      const t = Math.min(1, (ts - start) / D);
      const p1 = eOut(sm(0.06, 0.46, t));
      const p2 = eOut(sm(0.5, 1.0, t));
      shells.forEach((el, i) => {
        const L = logo[i], F = fan[i], T = targets[i];
        let l = lp(L.l, F.l, p1), w = lp(L.w, F.w, p1), h = lp(L.h, F.h, p1), top = lp(L.t, F.t, p1), rot = F.rot * p1;
        l = lp(l, T.l, p2); w = lp(w, T.w, p2); h = lp(h, T.h, p2); top = lp(top, T.t, p2); rot = lp(rot, 0, p2);
        el.style.width = w + "px"; el.style.height = h + "px";
        el.style.transform = "translate(" + l + "px," + top + "px) rotate(" + rot.toFixed(2) + "deg)";
        const c = ink.map((v, k) => Math.round(v + (tgt[i][k] - v) * eOut(p2)));
        el.style.backgroundColor = "rgb(" + c.join(",") + ")";
        el.style.color = (p2 > 0.5 && !SLOTS[i].real) ? "rgba(11,11,14,.5)" : "var(--paper)";
        el.classList.toggle("solid", p1 > 0.34);
      });
      if (t < 1) raf = requestAnimationFrame(frame);
      else setIntro(false);
    };
    raf = requestAnimationFrame(frame);
    /* safety net: rAF is paused in hidden/background tabs (and by reduced-
       motion), which would freeze the intro and leave the deck at opacity 0.
       setTimeout still fires there, so force the reveal after the timeline. */
    const safety = setTimeout(() => setIntro(false), D + 1500);
    return () => { cancelAnimationFrame(raf); clearTimeout(safety); };
  }, [intro]);

  const replay = () => { setFocus(0); setIntro(true); };

  const sl = SLOTS[focus];

  return (
    <div className={"wxp v" + version + (intro ? " intro" : "")}>
      <div className="wxp-head">
        <div>
          <div className="wxp-kick">05 · SELECTED WORK / 作品</div>
          <h2 className="wxp-title">每一份数据，支撑着一个作品<i className="psq" aria-hidden="true"></i></h2>
          <p className="wxp-sub">标志如扇面展开为卡片，卡片再逐张解码 — 悬停 / ←→ 翻动，聚焦卡横向拉伸给出名字与荣誉，下方展示作品本体
            <button className="wxp-replay" type="button" onClick={replay} data-hov>▷ 重播展开</button>
          </p>
        </div>
        <div className="wxp-actions">
          <a className="wxp-pf" href={PORTFOLIO} target="_blank" rel="noopener" data-hov>完整作品集 PDF ↗</a>
          <div className="wxp-seg" role="tablist" aria-label="展示区版本">
            {[["A", "画廊", "影像 + 题注条"], ["B", "影院", "题注叠映像上"], ["C", "档案窗", "带注释的取景框"]].map(([k, t, d]) => (
              <button key={k} className={version === k ? "on" : ""} onClick={() => setVersion(k)} role="tab" aria-selected={version === k}>
                <span className="vn">版本 {k} · {t}</span>{d}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="wxp-deck">
        {SLOTS.map((s, i) => (
          <button key={i} type="button"
                  className={"dk-card " + (s.real ? "real" : "ph") + (i === focus ? " on" : "")}
                  style={{ flexBasis: i === focus ? "58%" : (42 / (N - 1)).toFixed(2) + "%",
                           height: i === focus ? "100%" : (s.h * 100).toFixed(1) + "%" }}
                  onMouseEnter={() => setFocus(i)} onFocus={() => setFocus(i)}
                  onClick={() => setFocus(i)} data-hov aria-label={s.ix}>
            <DkMin sl={s} n={i} />
            <DkFull sl={s} />
          </button>
        ))}
        <span className="dk-period" aria-hidden="true"></span>
      </div>

      <div className="wxp-show">
        <Showcase key={version + "-" + focus} sl={sl} version={version} />
      </div>

      {intro && (
        <div className="intro-overlay" ref={overlayRef} aria-hidden="true">
          {SLOTS.map((s, i) => (
            <div className={"intro-card" + (i === focus ? " lead" : "")} key={i}>
              <span className="n">{String(i + 1).padStart(2, "0")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<WorksProto />);
