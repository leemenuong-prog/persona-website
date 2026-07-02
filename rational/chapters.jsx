/* ══════════════════════════════════════════════════════════════
   chapters.jsx — the three identities · three expressions.
   One language (bars ⇄ glyphs · the blue period), three dimensions:

   03 · An AIPM      — THE THREAD 一线穿点 · FLAT 2D
       Prioritisation as one line stringing through a few signal
       points; the one it lands on ignites cobalt as the period,
       the rest recede on the line. A single horizontal line —
       lays out the same on phone and desktop. (See aipm-cut.jsx.)

   02 · A Developer  — AXON 体 · 3D
       The .IAM. band extruded into an axonometric structure.
       Commits rain through three gates (rule / static test /
       merge gate); what passes lands and the skyline assembles.
       Drag to orbit.

   04 · An Architect — FIELD 场 · ABSTRACT
       Forces as a particle field. Scroll condenses the flow
       into contour rings, and a plan figure — with the blue
       period at its threshold — emerges from the noise.

   Titles stay in the 字⇄条 grammar (BarWord + the period).
   ══════════════════════════════════════════════════════════════ */

const { useEffect: useChE, useRef: useChR } = React;

/* progress → stage: writes --p and toggles .on on [data-th] nodes */
function useChProg(id, ref) {
  useChE(() => {
    const el = ref.current; if (!el) return;
    const ths = [...el.querySelectorAll("[data-th]")].map((n) => [n, parseFloat(n.dataset.th)]);
    let last = -2;
    const stop = window.__addLoop(() => {
      const p = (window.__progress && window.__progress[id]) || 0;
      if (Math.abs(p - last) < 0.0008) return;
      last = p;
      el.style.setProperty("--p", Math.max(0, Math.min(1, p)).toFixed(4));
      ths.forEach(([n, t]) => n.classList.toggle("on", p >= t));
    });
    return () => stop();
  }, []);
}

/* ════════════════════════════════════════════════════════════
   03 · AN AIPM — FLAT SHEET · 平面 (tone: paper) · 到达即播
   ════════════════════════════════════════════════════════════ */
/* the thread driver — a ONE-SHOT ~2.8s timeline, no scroll-scrub. Armed by
   the engine's reveal system (the [data-ob] block gains `.in` as the section
   crosses the 72%-viewport line); it then writes window.__progress.aipm 0→1
   (the canvas in aipm-cut.jsx reads that global directly — zero changes
   there), plus --p / --pay and the [data-th] point-label toggles. Ends
   clamped at 1 and goes quiet: the chapter HOLDS its final frame (站内约定，
   回滚不消失). prefers-reduced-motion / __calm snap straight to the held frame. */
function useCutStage(id, ref) {
  useChE(() => {
    const el = ref.current; if (!el) return;
    const ths = [...el.querySelectorAll("[data-th]")].map((n) => [n, parseFloat(n.dataset.th)]);
    const calm = (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) || window.__calm;
    const DUR = 2800;
    let t0 = 0, done = false;
    const write = (p) => {
      window.__progress = window.__progress || {};
      window.__progress[id] = p;   /* the canvas's single source of truth */
      el.style.setProperty("--p", p.toFixed(4));
      /* payoff (title "An AIPM" + copy) rises IN SYNC with the thread's ignite
         (canvas coils+releases ~0.58–0.88), then HOLDS. */
      const payIn = aEase(aSeg(p, 0.58, 0.86));
      el.style.setProperty("--pay", payIn.toFixed(3));
      ths.forEach(([n, t]) => n.classList.toggle("on", p >= t));
    };
    write(0);
    const stop = window.__addLoop(() => {
      if (done) return;
      if (!el.classList.contains("in")) return;   /* not arrived yet */
      if (calm) { write(1); done = true; return; }
      const now = performance.now();
      if (!t0) t0 = now;
      const t = aClamp((now - t0) / DUR, 0, 1);
      /* ease-out: the thread draws briskly, the ignite + payoff linger */
      write(1 - Math.pow(1 - t, 1.65));
      if (t >= 1) done = true;
    });
    return () => stop();
  }, []);
}

/* the six signals the thread strings through — five questions considered and
   put down, and THE question it lands on. x mirrors THREAD_X in aipm-cut.jsx;
   data-th = the timeline p at which the tip reaches that point (the landing
   label waits for the ignite instead). 动画在问，文案在答. */
const CUT_LABELS = [
  { x: 0.08, th: 0.20, t: "更快一点？" },
  { x: 0.22, th: 0.29, t: "更省一点？" },
  { x: 0.37, th: 0.35, t: "加个 AI？" },
  { x: 0.52, th: 0.41, t: "流程再顺一点？" },
  { x: 0.66, th: 0.46, t: "提效几个点？" },
  { x: 0.78, th: 0.68, t: "这事还该不该人来做？", land: true },
];

/* Part B — 判断的三步：the working method behind the question, each step with
   a real receipt from the XTOOL platform work (素材即正文，不造新口号). */
const CUT_METHOD = [
  { k: "01 · 看见 SEE", zh: "埋点里看到 Hook 段流失 52%——不是流程慢，是高创意内容没法一次成型。",
    en: "Telemetry first: the 52% drop at the Hook stage wasn't a speed problem." },
  { k: "02 · 开方 PRESCRIBE", zh: "开出的方子不是「再快一点」：合并生成阶段、三候选并出，推动了三代产品迭代。",
    en: "The prescription wasn't \"faster\" — merge the stages, offer three candidates." },
  { k: "03 · 对账 MEASURE", zh: "自建 ROI 看板对自己诚实：每投入 $1，省下 0.39 工时。",
    en: "A self-built ROI board keeps it honest: $1 in, 0.39 hours back." },
];

function ChAipm({ jump }) {
  const { AipmCut } = window;
  const ref = useChR(null);
  useCutStage("aipm", ref);
  /* NOTE: the "VISIT XTOOL PLATFORM" CTA deliberately lives only on the platform
     showcase chapter (ChAipmPlatform · 介绍页), NOT here on the identity/animation
     page — having it on both read as a duplicate (用户: 动画页不要按钮). */
  return (
    <section className="chapter ch2x" id="aipm" data-tone="paper" data-screen-label="03 · An AIPM — THE THREAD">
      {/* ── Part A · the thread — one viewport in NORMAL FLOW; scrolling to it
          starts the timeline (data-ob → .in → useCutStage), nothing to scrub. */}
      <div className="c2x-flow" data-ob ref={ref}>
        <div className="c2x-art" aria-hidden="true"><AipmCut /></div>

        {/* the point labels — each question lights as the thread strings through
            it; the landing one turns cobalt with the ignite. */}
        <div className="c2x-labs" aria-hidden="true">
          {CUT_LABELS.map((lb, i) => (
            <span key={i} className={"c2x-lab mono" + (lb.land ? " land" : "")}
                  data-th={lb.th} style={{ left: (lb.x * 100) + "%" }}>{lb.t}</span>
          ))}
        </div>

        {/* the payoff — appears only after the thread resolves into the mark.
            中文为主：他的中文一句话是正文，英文缩为点缀 */}
        <div className="c2x-pay">
          <div className="c2x-left">
            <h2 className="c2x-title">An AIPM<i className="psq" aria-hidden="true"></i></h2>
            <div className="c2x-motto">让 AI 能力贴合真实场景<i className="psq" aria-hidden="true"></i></div>
            <p className="c2x-st">我很少问「怎么把现在的流程做得更快」，更爱问「这事还该不该人来做」。
              <span className="en">Making AI fit real situations — I rarely ask how to make the current process faster; I'd rather ask whether a person should be doing it at all.</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Part B · 判断的三步 — the method, revealed on arrival (no scrub). */}
      <div className="c2x-method" data-ob>
        <div className="c2x-mk mono" data-rv style={{ "--rd": ".05s" }}>
          <span>HOW I JUDGE</span><b>判断的三步 · 来自 XTOOL 平台的一次真实判断</b>
        </div>
        {CUT_METHOD.map((m, i) => (
          <div key={i} className="c2x-mrow" data-rv style={{ "--rd": (0.16 + i * 0.13).toFixed(2) + "s" }}>
            <span className="c2x-mnum mono">{m.k}</span>
            <div className="c2x-mtx">
              <p className="zh">{m.zh}</p>
              <p className="en">{m.en}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   03·B · XTOOL AGENT PLATFORM — KEYNOTE REVEAL · 平台介绍
   Two quiet Chinese pages explain the platform thesis; only then does the
   product film appear beside the title.
   ════════════════════════════════════════════════════════════ */
const APX_INTRO_PAGES = [
  {
    ix: "01",
    tag: "平台定义",
    title: "不是单个工具，是生产系统。",
    body: "把大家的需求收集起来，就变了 Agent。",
  },
];

const APX_VISUALS = [
  { key: "system", label: "生产链汇入一个系统" },
];

/* 已确认事实（与 WHOAMI 时间线一致）— 不再堆代码行数 */
const APX_STRIP = [
  "7 个生产工具",
  "覆盖 4 部门 · 65 人",
  "任务完成率 80%+",
  "每投入 $1 省 0.39 工时",
];

/* the film plumbing — all that survives of the old keynote hook. The page is
   normal flow now (every block statically visible, fading in via [data-rv]);
   this only manages the film iframe:
   · loading poster — shown the instant the iframe is pointed at the film,
     hidden when the embedded film posts 'pearmovie:ready' (its first painted
     frame — the iframe's own 'load' event fires too early, 用户: 视频先黑屏),
     with a 3.2s post-load safety net so it can never get stuck.
   · DESKTOP: the film loads ONCE when the film block scrolls into view
     (IntersectionObserver, same precedent as the Reel film) and is never
     re-pointed — re-setting src would restart the movie + re-show the loader.
     xtool/?fresh=1 → starts at 0:00 on arrival (播放偏好约定).
   · PHONE/TABLET: the explicit tap poster loads it instead (button below). */
function useApxFilm(ref, frameRef) {
  useChE(() => {
    const el = ref.current; if (!el) return;
    const frame = frameRef.current;
    const vid = el.querySelector(".apx-video");
    const loading = el.querySelector(".apx-video-loading");
    const showLoad = () => { if (loading) loading.style.display = "flex"; };
    const hideLoad = () => { if (loading) loading.style.display = "none"; };
    const onFilmMsg = (e) => { if (e && e.data === "pearmovie:ready") hideLoad(); };
    addEventListener("message", onFilmMsg);
    let safetyT = 0;
    const onFrameLoad = () => { clearTimeout(safetyT); safetyT = setTimeout(hideLoad, 3200); };
    if (frame) frame.addEventListener("load", onFrameLoad);
    let filmLoaded = false, io = null;
    const phone = window.matchMedia && window.matchMedia("(max-width: 900px)").matches;
    if (frame && vid && !phone && "IntersectionObserver" in window) {
      io = new IntersectionObserver((es) => {
        es.forEach((en) => {
          if (!filmLoaded && en.isIntersecting && en.intersectionRatio >= 0.35) {
            filmLoaded = true; showLoad(); frame.src = "xtool/?fresh=1";
            if (io) io.disconnect();
          }
        });
      }, { threshold: [0, 0.35, 0.6] });
      io.observe(vid);
    }
    return () => {
      removeEventListener("message", onFilmMsg); clearTimeout(safetyT);
      if (frame) frame.removeEventListener("load", onFrameLoad);
      if (io) io.disconnect();
    };
  }, []);
}

function ChAipmPlatform({ jump }) {
  const ref = useChR(null);
  const frameRef = useChR(null);
  const [filmOn, setFilmOn] = React.useState(false);
  useApxFilm(ref, frameRef);
  /* closing CTA — after the platform film, the same live-site link as the AIPM
     identity chapter (XTOOL Agent Platform). Resolved from WORKS. */
  const aipmWk = (window.WORKS || []).find((w) => w.tag === "AI PLATFORM");
  const aipmUrl = (aipmWk && aipmWk.link) || "https://peersagent.netlify.app/";
  /* NORMAL FLOW on every size (无 keynote、无钉住)：标题 → 定义 → 系统图 →
     影片引言 → 影片 → 数据条 → CTA，顺着页面往下走，到达即显（data-rv）。
     The one-column pairing the phone layout already proved is now the layout,
     period — desktop just gives the boards more width. */
  return (
    <section className="chapter apx" id="aipm-platform" data-tone="paper" data-screen-label="03·B · XTOOL Agent Platform">
      <div className="apx-stage" data-ob ref={ref}>
        <div className="apx-kicker mono">
          <span>03·B / AFTER THE CUT</span><span>PLATFORM REVEAL · 平台登场</span>
        </div>

        <div className="apx-hero">
          <div className="apx-copy">
            <div className="apx-cap mono" data-rv style={{ "--rd": ".04s" }}>XTOOL / 内容生产 Agent OS</div>
            <h2 className="apx-title" data-rv style={{ "--rd": ".1s" }}>XTOOL<br />Agent Platform<i className="psq" aria-hidden="true"></i></h2>

            <div className="apx-intro">
              {APX_INTRO_PAGES.map((page, i) => (
                <article key={page.ix} className={"apx-page apx-page-" + i + " on"} data-rv style={{ "--rd": ".2s" }}>
                  <div className="apx-page-k mono"><span>{page.ix}</span><b>{page.tag}</b></div>
                  <h3>{page.title}</h3>
                  <p>{page.body}</p>
                </article>
              ))}
              <article className="apx-page apx-page-video on">
                <div className="apx-page-k mono"><span>02</span><b>视频演示</b></div>
                <h3>现在看它如何工作。</h3>
                <p>上面说清了平台逻辑；这里只保留产品本身，让视频成为主角。</p>
              </article>
            </div>
          </div>

          <div className="apx-media">
            <div className="apx-visuals" aria-hidden="true">
              <div className="apx-visual apx-visual-system on" data-rv style={{ "--rd": ".3s" }}>
                <div className="apx-visual-cap mono">{APX_VISUALS[0].label}</div>
                <div className="apx-system-diagram">
                  <div className="apx-toolstack">
                    {["调研", "脚本", "审核", "复测"].map((item) => (
                      <div className="apx-tool" key={item}><i></i><span>{item}</span></div>
                    ))}
                  </div>
                  <div className="apx-join" aria-hidden="true"></div>
                  <div className="apx-system-core">
                    <span>内容生产系统</span>
                    <b>统一记忆<br />统一规则<br />统一数据</b>
                  </div>
                </div>
              </div>
            </div>

            <div className="apx-video on" aria-label="XTOOL Agent Platform video">
              {/* DESKTOP: src stays blank until the film block scrolls into view, then
                  useApxFilm points it at xtool/?fresh=1 ONCE and leaves it (never reverts
                  — the film is silent, so it just keeps playing; scrolling around never
                  reloads it). PHONE/TABLET: the poster button below loads it on a tap. */}
              <iframe ref={frameRef} src="about:blank" title="XTOOL Agent Platform film" allow="autoplay; fullscreen"></iframe>
              {/* loading poster — animated data-bars (条) + label; sits above the iframe
                  while the embedded film compiles/mounts. Shown when the film starts
                  loading; hidden when the film posts 'pearmovie:ready' (its first painted
                  frame), with a timeout safety net. */}
              <div className="apx-video-loading mono" aria-hidden="true">
                <span className="apx-load-bars"><i></i><i></i><i></i><i></i><i></i></span>
                <span className="apx-load-cap">影片加载中 · LOADING FILM</span>
              </div>
              {!filmOn && (
                <button className="apx-video-play" type="button" data-hov aria-label="播放 XTOOL 平台影片"
                        onClick={() => {
                          setFilmOn(true);
                          const f = frameRef.current; if (!f) return;
                          const lo = f.parentElement && f.parentElement.querySelector(".apx-video-loading");
                          if (lo) lo.style.display = "flex";
                          f.src = "xtool/?fresh=1";
                        }}>
                  <img src="xtool/screenshots/demo_review.png" alt="XTOOL Agent Platform" loading="lazy" draggable="false" />
                  <span className="apx-play-ico" aria-hidden="true"></span>
                  <span className="apx-play-cap mono">点击播放 · XTOOL 平台影片 ▶</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="apx-strip mono" aria-hidden="true">
          {APX_STRIP.map((item) => <span key={item}>{item}</span>)}
        </div>
        <a className="apx-cta ch-cta" href={aipmUrl} target="_blank" rel="noopener" data-hov>
          <span className="sq" aria-hidden="true"></span>VISIT XTOOL PLATFORM · 访问平台<span className="arr" aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   02 · A DEVELOPER — AXONOMETRIC STRUCTURE · 体 (tone: paper)
   ════════════════════════════════════════════════════════════ */
const C3_BARS = [0.97, 0.58, 1.0, 0.66, 0.9, 0.52, 0.74, 1.0];
const c3X = (i) => -3.4 + i * 0.97;

function Structure3D() {
  const simR = useChR(null);
  if (!simR.current) simR.current = {
    rot: -0.82, trot: -0.82, drag: false, x0: 0, last: 0,
  };

  const ref = useCanvas((ctx, W, H, now) => {
    const S = simR.current;
    let p = (window.__progress && window.__progress.developer) || 0;
    if (p <= 0) {
      ctx.clearRect(0, 0, W, H);
      S.last = now; return;
    }
    if (p > 1) p = 1;   /* scrolled past — hold the assembled skyline */
    const dt = Math.min(Math.max((now - S.last) / 1000, 0), 0.05); S.last = now;
    ctx.clearRect(0, 0, W, H);

    if (!S.drag) S.trot += dt * 0.06;
    S.rot += (S.trot - S.rot) * Math.min(1, dt * 5);
    const rot = S.rot + Math.sin(now / 4600) * 0.025;
    const cosR = Math.cos(rot), sinR = Math.sin(rot);
    const SC = Math.min(W * 0.082, H * 0.108);
    /* composition sits right-and-up of centre so the motto (bottom-left) and
       the title keep clear ground — the skyline is a backdrop, not an obstacle */
    const cx = W * 0.58, cy = H * 0.62, tilt = 0.46, ZF = SC * 0.82;
    const proj = (x, y, z) => {
      const rx = x * cosR - y * sinR, ry = x * sinR + y * cosR;
      return [cx + rx * SC, cy + ry * SC * tilt - z * ZF];
    };
    const ink = (a) => `rgba(11,11,14,${a.toFixed(3)})`;
    const blu = (a) => `rgba(0,71,171,${a.toFixed(3)})`;

    /* ground grid — the discipline plane */
    const gv = aSeg(p, 0.04, 0.18);
    if (gv > 0.01) {
      ctx.strokeStyle = ink(0.13 * gv); ctx.lineWidth = 1;
      for (let gx = -6; gx <= 6.01; gx += 1.5) {
        const [x1, y1] = proj(gx, -4, 0), [x2, y2] = proj(gx, 4, 0);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
      for (let gy = -4; gy <= 4.01; gy += 1.5) {
        const [x1, y1] = proj(-6, gy, 0), [x2, y2] = proj(6, gy, 0);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
    }

    /* bar heights this frame — the skyline assembles as you scroll */
    const bh = C3_BARS.map((b, i) => 3.3 * b * aEase(aSeg(p, 0.12 + i * 0.05, 0.46 + i * 0.05)));

    /* assemble the draw list — painter sort along view depth */
    const items = [];
    items.push({ x: -5.15, y: 0, hx: 0.6, hy: 0.6, zb: 0, h: Math.max(0.55 * aEase(aSeg(p, 0.07, 0.24)), 0.02), col: "ink", top: 0.32 });
    C3_BARS.forEach((b, i) => items.push({
      x: c3X(i), y: 0, hx: 0.345, hy: 0.345, zb: 0,
      h: Math.max(bh[i], 0.02), col: "ink", top: 0.4,
    }));
    const dq = aEase(aSeg(p, 0.78, 0.93));
    if (dq > 0.01) items.push({ x: 4.55, y: 0, hx: 0.22, hy: 0.22, zb: (1 - dq) * 2.9, h: 0.44, col: "blue", top: 0.82 });
    items.sort((u, v) => (u.x * sinR) - (v.x * sinR));

    const CS = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    const NA = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];
    const LIGHT = -2.3;
    items.forEach((b) => {
      const zt = b.zb + b.h;
      const corner = (k, z) => proj(b.x + CS[k][0] * b.hx, b.y + CS[k][1] * b.hy, z);
      const base = b.col === "blue" ? blu : ink;
      const faces = [0, 1, 2, 3].map((k) => {
        const k2 = (k + 1) % 4;
        const mx = b.x + ((CS[k][0] + CS[k2][0]) / 2) * b.hx;
        const my = b.y + ((CS[k][1] + CS[k2][1]) / 2) * b.hy;
        return { k, depth: mx * sinR + my * cosR };
      }).sort((u, v) => u.depth - v.depth);
      ctx.lineWidth = 1;
      faces.forEach(({ k }) => {
        const k2 = (k + 1) % 4;
        const lum = Math.max(0, Math.cos(NA[k] + rot - LIGHT));
        const [x1, y1] = corner(k, b.zb), [x2, y2] = corner(k2, b.zb);
        const [x3, y3] = corner(k2, zt), [x4, y4] = corner(k, zt);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.lineTo(x4, y4); ctx.closePath();
        ctx.fillStyle = base(0.52 + lum * 0.43);
        ctx.fill();
        ctx.strokeStyle = "#efece6"; ctx.stroke();
      });
      ctx.beginPath();
      for (let k = 0; k < 4; k++) { const [px, py] = corner(k, zt); k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
      ctx.closePath();
      ctx.fillStyle = base(b.top);
      ctx.fill(); ctx.strokeStyle = "#efece6"; ctx.stroke();
    });
  });

  /* drag to orbit */
  useChE(() => {
    const cv = ref.current; if (!cv) return;
    const S = simR.current;
    const down = (e) => { S.drag = true; S.x0 = e.clientX; };
    const move = (e) => { if (!S.drag) return; S.trot += (e.clientX - S.x0) * 0.0055; S.x0 = e.clientX; };
    const up = () => { S.drag = false; };
    cv.addEventListener("pointerdown", down);
    addEventListener("pointermove", move, { passive: true });
    addEventListener("pointerup", up);
    return () => {
      cv.removeEventListener("pointerdown", down);
      removeEventListener("pointermove", move);
      removeEventListener("pointerup", up);
    };
  }, []);

  return <canvas ref={ref}></canvas>;
}

function ChDev({ jump }) {
  const { BarWord, CodePanel } = window;
  const ref = useChR(null);
  useChProg("developer", ref);
  /* NOTE: the "VISIT PEARS" CTA deliberately lives only on the Reel showcase
     chapter (ChReel · 介绍页), NOT here on the identity/animation page — it was
     a duplicate otherwise (用户: 动画页不要按钮，介绍页出现). */
  return (
    <section className="chapter ch3" id="developer" data-tone="paper" data-prog="developer" data-screen-label="02 · A Developer — 3D">
      <div className="ch-wrap">
        <div className="ch-stage sec c3" data-ob ref={ref}>
          <div className="ch-ghost" data-parallax="0.2" aria-hidden="true">STACK</div>
          <div className="c3-art" aria-hidden="true"><Structure3D /></div>
          <div className="ch-head c3-head">
            <h2 className="ch-title c3-title"><BarWord text="A Developer" delay={0.15} /></h2>
            <div className="rule ch-rule" style={{ "--rd": ".22s" }}></div>
          </div>
          <CodePanel />
          <div className="ch-motto">
            <div className="mt lm" style={{ "--rd": ".3s" }}><span>保持从想法到落地的能力<i className="psq" aria-hidden="true"></i></span></div>
            <div className="st" data-rv style={{ "--rd": ".45s" }}>
              我自己写代码，也指挥 agent 写代码。想验证一个想法，最快的路常常是先做出来。
              <span className="en">From idea to shipped — I write code myself, and I also direct agents that write it. The fastest way to test an idea is usually just to build it.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   04 · AN ARCHITECT — SITE FORM · 场 (tone: ink)
   The canvas (SiteForm3D) lives in identity-art.jsx — the same
   axonometric skeleton as the Developer's skyline, inverted in
   tone: a luminous paper massing assembles from a site grid as
   four force-vectors push inward and quiet down. One language,
   no circle, no contour ring — the rectangle + the blue self.
   ════════════════════════════════════════════════════════════ */

function ChArch({ jump }) {
  const { BarWord, SiteForm3D } = window;
  const ref = useChR(null);
  useChProg("architect", ref);
  return (
    <section className="chapter ch4" id="architect" data-tone="ink" data-prog="architect" data-screen-label="04 · An Architect — FIELD">
      <div className="ch-wrap">
        <div className="ch-stage sec c4" data-ob ref={ref}>
          <div className="c4-art" aria-hidden="true"><SiteForm3D /></div>
          <div className="ch-ghost c4-ghost" data-parallax="0.16" aria-hidden="true">FORM</div>
          <div className="ch-head c4-head">
            <h2 className="c4-title">
              <span className="c4-an"><BarWord text="An" period={false} /></span>
              <span className="c4-big"><BarWord text="Architect" delay={0.3} /></span>
            </h2>
            <div className="rule ch-rule c4-rule" style={{ "--rd": ".4s" }}></div>
          </div>
          <div className="ch-motto">
            <div className="mt lm" style={{ "--rd": ".3s" }}><span>把零散的需求搭成稳定的体系<i className="psq" aria-hidden="true"></i></span></div>
            <div className="st" data-rv style={{ "--rd": ".45s" }}>
              建筑，就是把一堆互相影响的限制——光线、动线、尺度——变成一个让人想待下去的东西。
              <span className="en">Scattered needs into a system — architecture takes constraints that push against each other (light, circulation, scale) and turns them into something people want to stay in.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   02·B · THE EVIDENCE — PEARS · 两段式 (tone: paper)
   The payoff of the Developer thesis, in NORMAL FLOW — no pinning,
   no scrub (用户: deck 自动翻页 + 可手动，滚动照常走):
   · Part 1 — the proposal deck: 8 paper-tinted SVG slides in one
     16:9 frame that AUTO-TURNS every few seconds; click / ‹ › /
     square pips take over (a manual action holds the auto-turn).
   · Part 2 — the roadshow film under its own headline (「现在看它
     如何工作」— the same beat as the XTOOL keynote), auto-plays
     muted on arrival; the small BGM chip unmutes.
   The slides' own background is re-tinted to the site paper
   (#efece6), so the chapter stays on the page tone — no snow tone,
   no recolor choreography.
   ════════════════════════════════════════════════════════════ */
const REEL = [
  /* the cover (01.jpg) is intentionally gone — it opened the reel on an empty
     frame that slowly faded into a redundant Pears title card (too slow a beat),
     and the Pears identity already returns on the closing roadshow frame. Start
     straight on the substance. `ix` doubles as the image filename, so the kept
     slides keep their 02–09 names; the displayed index is renumbered 01–08 in
     the render. */
  { ix: "02", zh: "看你做一遍", g: "把重复工作交给 Pears", ext: "svg" },  /* vector recreation — crisp text (orig 02.jpg kept as backup) */
  { ix: "03", zh: "产品洞察",   g: "软件越来越容易生成，难的是把工作说清楚", ext: "svg" },  /* vector recreation (orig 03.jpg kept as backup) */
  { ix: "04", zh: "产品差异",   g: "Vibe Coding 从你说的开始，Pears 从你做的开始", ext: "svg" },  /* zh matches the slide's own section tag (用户: Dev 内容不协调) */
  { ix: "05", zh: "示范与学习", g: "每一次点击与切换，都在告诉它什么值得自动化", ext: "svg" },  /* zh matches the slide's own section tag */
  { ix: "06", zh: "工作流拍板", g: "自动化到哪一步，由你拍板", ext: "svg" },  /* vector recreation — crisp UI dashboard (orig 06.jpg kept as backup) */
  { ix: "07", zh: "隐私设计",   g: "只在你开口时才记，停止任务记录立即结束", ext: "svg" },  /* vector recreation — crisp at any size (orig 07.jpg kept as backup) */
  { ix: "08", zh: "Agent 构建", g: "拍板之后，工作流开始成为 Agent", ext: "svg" },  /* vector recreation (orig 08.jpg kept as backup) */
  { ix: "09", zh: "产品生态",   g: "你的做法，不只为你工作 · Agent App 生态", ext: "svg" },  /* vector recreation (orig 09.jpg kept as backup) */
];

/* the Pears roadshow video — Part 2 of the chapter now (no longer a deck
   cell). preload="none" so the 69MB file only downloads when the film part
   scrolls into view; the poster shows meanwhile. */
const REEL_VIDEO = { src: "works/pears-roadshow.mp4", poster: "works/pears-roadshow-cover.jpg", zh: "路演", g: "Pears 产品路演 · Demo Day" };
const REEL_N = REEL.length;   /* 8 提案帧 — 影片是第二段，不再占 cell */

function ChReel({ jump }) {
  const deckRef = useChR(null);
  const vidRef = useChR(null);
  const [idx, setIdx] = React.useState(0);
  const [muted, setMuted] = React.useState(true);   /* roadshow film auto-plays muted; the BGM button unmutes */
  const vidStarted = useChR(false);
  const holdUntil = useChR(0);   /* a manual action holds the auto-turn for a while */
  const touchX = useChR(0);
  const go = (d) => { holdUntil.current = Date.now() + 9000; setIdx((v) => (v + d + REEL_N) % REEL_N); };
  const jumpTo = (n) => { holdUntil.current = Date.now() + 9000; setIdx(n); };

  /* auto-turn — 用户: 自动左右翻页，用户也可手动。Loops the 8 slides; skips
     while the tab is hidden, the deck is off-screen, or a manual hold runs. */
  useChE(() => {
    const t = setInterval(() => {
      if (document.hidden || Date.now() < holdUntil.current) return;
      const el = deckRef.current; if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < 120 || r.top > innerHeight - 120) return;
      setIdx((v) => (v + 1) % REEL_N);
    }, 4200);
    return () => clearInterval(t);
  }, []);

  /* the film — auto-play muted from 0:00 the FIRST time it scrolls into view
     (never on page load — 用户: 滚动到达才播). Same behaviour at every
     viewport; never auto-paused after, so a manual pause via the native
     controls sticks and the BGM rides along if unmuted. */
  useChE(() => {
    const v = vidRef.current; if (!v || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => {
        if (en.isIntersecting && en.intersectionRatio > 0.5 && !vidStarted.current) {
          vidStarted.current = true;
          const lo = v.parentElement && v.parentElement.querySelector(".reel-video-loading");
          if (lo) { lo.style.display = "flex"; setTimeout(() => { lo.style.display = "none"; }, 8000); }
          v.muted = true;
          try { v.currentTime = 0; } catch (e) {}
          const pr = v.play(); if (pr && pr.catch) pr.catch(() => {});
        }
      });
    }, { threshold: [0, 0.5, 1] });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  /* closing CTA — the reel is the Developer's evidence (Pears); link straight to
     the live product. Looked up by name, NOT by index — the deck's order is
     curatorial (建筑在前) and must be free to change without re-aiming this link. */
  const devWk = (window.WORKS || []).find((w) => w.t && w.t.indexOf("Pears") === 0);
  const devUrl = (devWk && devWk.link) || "https://and-pear.netlify.app/login";
  const s = REEL[idx];
  return (
    <section className="chapter reel" id="reel" data-tone="paper"
             data-screen-label="02·B · The Evidence — PEARS">
      {/* ── PART 1 · 路演提案 deck — 大标题 = 作品信息 ── */}
      <div className="reel-part sec" data-ob>
        <div className="apx-kicker mono">
          <span>02·B / THE EVIDENCE</span><span>PEARS DECK · 路演提案</span>
        </div>
        <header className="reel-head2">
          <h2 className="reel-title lm" data-rv style={{ "--rd": ".1s" }}>
            <span>Pears — AI Agent<i className="psq" aria-hidden="true"></i></span>
          </h2>
          <p className="reel-award" data-rv style={{ "--rd": ".26s" }}>ADVENTURE-X 黑客松 · 季军 3RD PLACE
            <span className="en">The deck below turns by itself — click it to browse at your own pace.</span>
          </p>
        </header>
        <div className="reel-deck" data-rv style={{ "--rd": ".4s" }} ref={deckRef}
             onClick={(e) => { if (e.target.closest("a, button")) return; go(1); }}
             onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
             onTouchEnd={(e) => {
               const dx = e.changedTouches[0].clientX - touchX.current;
               if (Math.abs(dx) > 42) go(dx < 0 ? 1 : -1);
             }}>
          <div className="reel-frame">
            {REEL.map((slide, n) => (
              <img key={n} className={"reel-cell reel-img" + (n === idx ? " on" : "")}
                   src={"works/pears-deck/" + slide.ix + "." + (slide.ext || "jpg")}
                   alt={"Pears " + slide.ix + " " + slide.zh} decoding="async"
                   loading="eager" draggable="false" />
            ))}
            <button className="reel-nav prev" type="button" data-hov aria-label="上一页"
                    onClick={() => go(-1)}><span>‹</span></button>
            <button className="reel-nav next" type="button" data-hov aria-label="下一页"
                    onClick={() => go(1)}><span>›</span></button>
          </div>
          {/* deck bar — mono index + per-slide caption + square pips (period motif) */}
          <div className="reel-deckbar mono">
            <span className="reel-ix2" aria-live="polite"><b>{String(idx + 1).padStart(2, "0")}</b> / {String(REEL_N).padStart(2, "0")} · {s.zh} — {s.g}</span>
            <span className="reel-pips" aria-hidden="true">
              {REEL.map((_, n) => (
                <i key={n} className={n === idx ? "on" : ""}
                   onClick={(e) => { e.stopPropagation(); jumpTo(n); }}></i>
              ))}
            </span>
            <span className="reel-autohint">自动翻页 · 点击可控</span>
          </div>
        </div>
      </div>

      {/* ── PART 2 · 路演影片 — 大标题与 XTOOL keynote 同拍 ── */}
      <div className="reel-part reel-filmpart sec" data-ob>
        <header className="reel-head2">
          <h2 className="reel-title2 lm" data-rv style={{ "--rd": ".1s" }}>
            <span>现在看它如何工作<i className="psq" aria-hidden="true"></i></span>
          </h2>
          <p className="reel-award" data-rv style={{ "--rd": ".26s" }}>PRODUCT FILM · 路演视频 — 到达自动播放，默认静音
            <span className="en">Now, watch it work — the film starts muted as it scrolls into view.</span>
          </p>
        </header>
        <div className="reel-filmcol" data-rv style={{ "--rd": ".4s" }}>
          <div className="reel-video">
            <video ref={vidRef} src={REEL_VIDEO.src} poster={REEL_VIDEO.poster}
                   preload="none" playsInline muted controls
                   onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
                   onPlaying={(e) => {
                     const lo = e.currentTarget.parentElement.querySelector(".reel-video-loading");
                     if (lo) lo.style.display = "none";
                   }}
                   onError={(e) => {
                     const lo = e.currentTarget.parentElement.querySelector(".reel-video-loading");
                     if (lo) lo.style.display = "none";
                   }}></video>
            {/* loading poster — same bars-and-caption language as the AIPM platform film */}
            <div className="reel-video-loading mono" aria-hidden="true">
              <span className="reel-load-bars"><i></i><i></i><i></i><i></i><i></i></span>
              <span className="reel-load-cap">影片加载中 · LOADING FILM</span>
            </div>
            {/* default muted; a SMALL top-right chip turns the sound on (用户: 右上角提示
                一下就行). Once unmuted it hides — the native controls take over. */}
            {muted && <button className="reel-sound mono" type="button" aria-label="开启声音 · BGM"
              onClick={() => { const v = vidRef.current; if (!v) return; v.muted = false; if (v.paused) v.play(); }}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 9.4v5.2h3.3L12 18.4V5.6L7.3 9.4H4z" fill="currentColor" stroke="none"/>
                <path d="M15.4 9.2a4 4 0 0 1 0 5.6"/>
                <path d="M17.9 6.7a7.5 7.5 0 0 1 0 10.6"/>
              </svg>
              <span>声音</span>
            </button>}
          </div>
          <a className="reel-cta ch-cta" href={devUrl} target="_blank" rel="noopener" data-hov>
            <span className="sq" aria-hidden="true"></span>VISIT PEARS · 访问应用<span className="arr" aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { ChAipm, ChAipmPlatform, ChDev, ChArch, ChReel, Structure3D });
