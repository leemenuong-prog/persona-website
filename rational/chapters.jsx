/* ══════════════════════════════════════════════════════════════
   chapters.jsx — the three identities · three expressions.
   One language (bars ⇄ glyphs · the blue period), three dimensions:

   04 · An AIPM      — THE THREAD 一线穿点 · FLAT 2D
       Prioritisation as one line stringing through a few signal
       points; the one it lands on ignites cobalt as the period,
       the rest recede on the line. A single horizontal line —
       lays out the same on phone and desktop. (See aipm-cut.jsx.)

   03 · A Developer  — AXON 体 · 3D
       The .IAM. band extruded into an axonometric structure.
       Commits rain through three gates (rule / static test /
       merge gate); what passes lands and the skyline assembles.
       Drag to orbit.

   05 · An Architect — FIELD 场 · ABSTRACT
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
   04 · AN AIPM — FLAT SHEET · 平面 (tone: paper)
   ════════════════════════════════════════════════════════════ */
/* the thread stage driver — writes --p and --pay onto the stage.
   (Pure style writes; the payoff copy only resolves after the thread lands.) */
function useCutStage(id, ref) {
  useChE(() => {
    const el = ref.current; if (!el) return;
    let last = -2;
    const stop = window.__addLoop(() => {
      const praw = (window.__progress && window.__progress[id]) || 0;
      const p = aClamp(praw, 0, 1);
      if (Math.abs(praw - last) < 0.0006) return;
      last = praw;
      el.style.setProperty("--p", p.toFixed(4));
      /* payoff (title "An AIPM" + copy) rises IN SYNC with the thread's ignite
         (canvas coils+releases ~0.58–0.88), so the words arrive as the mark
         resolves — then HOLDS. It stays lit as the sticky stage slides away
         (no dissolve at praw>1), matching the held canvas frame, so the
         resolved mark carries intact into the next chapter. */
      const payIn = aEase(aSeg(p, 0.58, 0.86));
      el.style.setProperty("--pay", payIn.toFixed(3));
    });
    return () => stop();
  }, []);
}

function ChAipm({ jump }) {
  const { AipmCut } = window;
  const ref = useChR(null);
  useCutStage("aipm", ref);
  /* NOTE: the "VISIT XTOOL PLATFORM" CTA deliberately lives only on the platform
     showcase chapter (ChAipmPlatform · 介绍页), NOT here on the identity/animation
     page — having it on both read as a duplicate (用户: 动画页不要按钮). */
  return (
    <section className="chapter ch2x" id="aipm" data-tone="paper" data-prog="aipm" data-screen-label="04 · An AIPM — THE THREAD">
      <div className="ch-wrap c2x-wrap">
        <div className="ch-stage c2x-stage" data-ob ref={ref}>
          <div className="c2x-art" aria-hidden="true"><AipmCut /></div>

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
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   04·B · XTOOL AGENT PLATFORM — KEYNOTE REVEAL · 平台介绍
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

function useApxStage(id, ref) {
  useChE(() => {
    const el = ref.current; if (!el) return;
    const sec = el.closest("section");
    const pages = [...el.querySelectorAll(".apx-page")];
    const visuals = [...el.querySelectorAll(".apx-visual")];
    const video = el.querySelector(".apx-video");
    const frame = el.querySelector(".apx-video iframe");
    /* loading poster — shown the instant we point the iframe at the film, hidden the
       moment the embedded film signals it has painted its first frame ('pearmovie:ready').
       The iframe's own 'load' event fires too early — before the in-iframe React/Babel app
       compiles + renders — so hiding on it left a black gap (用户: 视频先黑屏). Driven
       imperatively (not React state) so it never fights the className/opacity the loop
       writes onto .apx-video. */
    const loading = el.querySelector(".apx-video-loading");
    const showLoad = () => { if (loading) loading.style.display = "flex"; };
    const hideLoad = () => { if (loading) loading.style.display = "none"; };
    const onFilmMsg = (e) => { if (e && e.data === "pearmovie:ready") hideLoad(); };
    addEventListener("message", onFilmMsg);
    /* safety net — if that signal never arrives (e.g. a stale cached film), hide the
       poster a few seconds after the iframe document loads so it can't get stuck. */
    let safetyT = 0;
    const onFrameLoad = () => { clearTimeout(safetyT); safetyT = setTimeout(hideLoad, 3200); };
    if (frame) frame.addEventListener("load", onFrameLoad);
    let last = -2, lastStep = -1, filmLoaded = false, mobileReset = false;
    const stop = window.__addLoop(() => {
      /* PHONE/TABLET: the section is a vertical stack that pairs each explanation with
         its diagram/film (CSS). The keynote step-toggling must NOT run here — it sets
         opacity:0 inline on the non-active visuals, so the diagrams "disappear" as you
         scroll (the bug). Clear anything it set, force everything visible, and bail.
         Re-checked every frame so a resize back to desktop restores the keynote. */
      if (window.matchMedia && window.matchMedia("(max-width: 900px)").matches) {
        if (!mobileReset) {
          mobileReset = true;
          visuals.forEach((n) => { n.style.removeProperty("opacity"); n.style.removeProperty("transform"); n.classList.add("on"); });
          if (video) { video.style.removeProperty("opacity"); video.style.removeProperty("transform"); }
          pages.forEach((n) => n.classList.add("on"));
        }
        return;
      }
      mobileReset = false;
      const top = sec ? sec.getBoundingClientRect().top + window.scrollY : el.getBoundingClientRect().top + window.scrollY;
      const span = Math.max((sec ? sec.offsetHeight : el.offsetHeight) - innerHeight, 1);
      const praw = (window.scrollY - top) / span;
      const p = aClamp(praw, 0, 1);

      /* video iframe — load the film ONCE, the moment the viewer scrolls onto the video
         page (≈ last third of the pinned stage), then KEEP it loaded. It is NOT unloaded
         on further scrolling, so scrubbing up/down around the video page never reloads it
         (用户: 不管怎么动，滑到视频页就开始加载→播放，别重新加载). The film is silent, so leaving it
         mounted while scrolled away is harmless. It ships src="about:blank" so it never
         pre-rolls before arrival; xtool/?fresh=1 → starts at 0:00 and posts 'pearmovie:ready'
         when it paints (→ hides the loading poster). */
      /* DESKTOP only — on phone/tablet the stage is a vertical stack (height:auto) so this
         praw window is unreliable; there the film loads on an explicit TAP instead (see the
         .apx-video-play poster button), which also shows the loader. */
      if (frame && !(window.matchMedia && window.matchMedia("(max-width: 900px)").matches)) {
        if (!filmLoaded && praw >= 0.42) {
          filmLoaded = true;
          showLoad();
          frame.src = "xtool/?fresh=1";
        }
      }

      if (Math.abs(praw - last) < 0.0006) return;
      last = praw;
      el.style.setProperty("--p", p.toFixed(4));
      /* two-phase keynote now (only one text/diagram page left after removing
         "专属 Agent" — 用户: 只留不是单个工具是生产系统): 0 = text + diagram, 1 = video. */
      const step = p < 0.5 ? 0 : 1;
      if (step === lastStep) return;
      lastStep = step;
      el.dataset.step = String(step);
      pages.forEach((n, i) => n.classList.toggle("on", i === Math.min(step, pages.length - 1)));
      visuals.forEach((n, i) => {
        const on = step === i;
        n.classList.toggle("on", on);
        n.style.setProperty("opacity", on ? "1" : "0", "important");
        n.style.setProperty("transform", on ? "none" : "translateY(18px)", "important");
      });
      if (video) {
        video.classList.toggle("on", step === 1);
        video.style.setProperty("opacity", step === 1 ? "1" : "0", "important");
        video.style.setProperty("transform", step === 1 ? "none" : "translateX(28px) scale(.992)", "important");
      }
    });
    return () => { stop(); removeEventListener("message", onFilmMsg); clearTimeout(safetyT); if (frame) frame.removeEventListener("load", onFrameLoad); };
  }, []);
}

function ChAipmPlatform({ jump }) {
  const ref = useChR(null);
  const frameRef = useChR(null);
  const [filmOn, setFilmOn] = React.useState(false);
  useApxStage("aipmPlatform", ref);
  /* closing CTA — after the platform film, the same live-site link as the AIPM
     identity chapter (XTOOL Agent Platform). Resolved from WORKS. */
  const aipmWk = (window.WORKS || []).find((w) => w.tag === "AI PLATFORM");
  const aipmUrl = (aipmWk && aipmWk.link) || "https://peersagent.netlify.app/";
  return (
    <section className="chapter apx" id="aipm-platform" data-tone="paper" data-prog="aipmPlatform" data-screen-label="04·B · XTOOL Agent Platform">
      <div className="ch-wrap">
        <div className="ch-stage apx-stage" data-ob ref={ref} data-step="0">
          <div className="apx-kicker mono">
            <span>04·B / AFTER THE CUT</span><span>PLATFORM REVEAL · 平台登场</span>
          </div>

          <div className="apx-hero">
            <div className="apx-copy">
              <div className="apx-cap mono">XTOOL / 内容生产 Agent OS</div>
              <h2 className="apx-title">XTOOL<br />Agent Platform<i className="psq" aria-hidden="true"></i></h2>

              <div className="apx-intro">
                {APX_INTRO_PAGES.map((page, i) => (
                  <article key={page.ix} className={"apx-page apx-page-" + i + (i === 0 ? " on" : "")}>
                    <div className="apx-page-k mono"><span>{page.ix}</span><b>{page.tag}</b></div>
                    <h3>{page.title}</h3>
                    <p>{page.body}</p>
                  </article>
                ))}
                <article className="apx-page apx-page-video">
                  <div className="apx-page-k mono"><span>03</span><b>视频演示</b></div>
                  <h3>现在看它如何工作。</h3>
                  <p>前两面说明平台逻辑；这一面只保留产品本身，让视频成为主角。</p>
                </article>
              </div>
            </div>

            <div className="apx-media">
              <div className="apx-visuals" aria-hidden="true">
                <div className="apx-visual apx-visual-system on">
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

              <div className="apx-video" aria-label="XTOOL Agent Platform video">
                {/* DESKTOP: src stays blank until the viewer reaches the video page, then
                    useApxStage points it at xtool/?fresh=1 ONCE and leaves it (never reverts
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
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   03 · A DEVELOPER — AXONOMETRIC STRUCTURE · 体 (tone: paper)
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
    const cx = W * 0.54, cy = H * 0.66, tilt = 0.46, ZF = SC * 0.82;
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
    <section className="chapter ch3" id="developer" data-tone="paper" data-prog="developer" data-screen-label="03 · A Developer — 3D">
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
   05 · AN ARCHITECT — SITE FORM · 场 (tone: ink)
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
    <section className="chapter ch4" id="architect" data-tone="ink" data-prog="architect" data-screen-label="05 · An Architect — FIELD">
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
   03·B · THE EVIDENCE — THE REEL · 一帧一帧 (tone: paper)
   The payoff of the Developer thesis: 9 Pears product slides — the
   flagship the governed agent actually built — cross-dissolve
   through ONE pinned 16:9 frame. The chrome is pure site language:
   a hairline progress spine, passed/ahead ticks (the .bc-col read
   vertically), the cobalt self-square (period · self) riding the
   spine, and a mono NN/09 index. The cream slides sit on a var(--bg)
   matte = the page paper, so the only foreign note is the deck's own
   green — quarantined to the framed rectangle and forced to opacity 0
   BEFORE the ink lerp, so green and ink never co-occupy the frame.
   Exit: the closing roadshow frame holds, and the engine's standard
   snow→paper midline lerp carries the page into the AIPM chapter
   (the reel now sits Developer → AIPM). No custom recolor code.
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

/* the Pears roadshow video is the reel's 10th (closing) frame — the pitch
   deck culminating in the actual W·01 demo. Click-to-play (sound + native
   controls), pauses + resets when scrolled off. preload="none" so the 73MB
   file only downloads on play; the poster shows meanwhile. */
const REEL_VIDEO = { src: "works/pears-roadshow.mp4", poster: "works/pears-roadshow-cover.jpg", zh: "路演", g: "Pears 产品路演 · Demo Day" };
const REEL_N = REEL.length + 1;   /* 8 提案帧 + 1 路演视频帧 = 9 cells */

/* the deck is CLICK-DRIVEN now (was an 8-screen scroll scrub): one pinned
   frame, useState(idx) flips the slides — click / ‹ › / ← → / swipe. Discrete
   class-toggle transitions (.reel-cell.on) are fine here; the "CSS transitions
   stall" caveat only applies to continuous scrub-driven animation. The chrome
   vars the old rAF loop wrote are now declarative: --chrome ← the stage's
   data-ob .in class, --self ← an inline style off idx, --kill ← data-end. */
const reelClamp = (v) => Math.max(0, Math.min(REEL_N - 1, v));

function ChReel({ jump }) {
  const ref = useChR(null);
  const vidRef = useChR(null);
  const [idx, setIdx] = React.useState(0);
  const [muted, setMuted] = React.useState(true);   /* roadshow film auto-plays muted; the BGM button unmutes */
  const vidStarted = useChR(false);
  const touchX = useChR(0);
  const go = (d) => setIdx((v) => reelClamp(v + d));
  const phone = () => window.matchMedia && window.matchMedia("(max-width: 600px)").matches;

  /* the closing frame — AUTO-PLAY the film muted the FIRST time the viewer flips
     onto it, from 0:00 (never on page load — 用户: 滚动到达才播). Flipping BACK off
     the video pauses it (in-deck retreat ≠ scrolling past, which keeps playing);
     it never resets, so returning resumes where it left. */
  useChE(() => {
    const v = vidRef.current; if (!v) return;
    const onVideo = idx >= REEL.length;
    if (onVideo && !vidStarted.current) {
      vidStarted.current = true;
      const lo = v.parentElement && v.parentElement.querySelector(".reel-video-loading");
      if (lo) { lo.style.display = "flex"; setTimeout(() => { lo.style.display = "none"; }, 8000); }
      v.muted = true;
      try { v.currentTime = 0; } catch (e) {}
      const pr = v.play(); if (pr && pr.catch) pr.catch(() => {});
    } else if (!onVideo && !v.paused && !phone()) {
      v.pause();
    }
  }, [idx]);

  /* ← → flip the deck, but ONLY while the stage is actually pinned full-screen —
     never hijack the keys elsewhere on the page (and never Up/Down/Space: those
     stay native scroll). The native <video> keeps its own key handling. */
  useChE(() => {
    const onKey = (e) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      if (phone()) return;
      if (e.target && e.target.closest && e.target.closest("video, input, textarea")) return;
      const st = ref.current; if (!st) return;
      const r = st.getBoundingClientRect();
      if (!(r.top <= 1 && r.bottom >= innerHeight - 1)) return;
      e.preventDefault();
      setIdx((v) => reelClamp(v + (e.key === "ArrowRight" ? 1 : -1)));
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);
  /* PHONE: the reel is a plain vertical stack (useReelStage no-ops ≤600px), so the
     desktop loop can't drive auto-play. Observe the film and auto-play it muted once
     it scrolls into view; like desktop it is never paused on exit. */
  useChE(() => {
    if (!(window.matchMedia && window.matchMedia("(max-width: 600px)").matches)) return;
    const v = vidRef.current; if (!v || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => {
        if (en.isIntersecting && en.intersectionRatio > 0.6 && v.paused) {
          const lo = v.parentElement && v.parentElement.querySelector(".reel-video-loading");
          if (lo) { lo.style.display = "flex"; setTimeout(() => { lo.style.display = "none"; }, 8000); }
          v.muted = true; const pr = v.play(); if (pr && pr.catch) pr.catch(() => {});
        }
      });
    }, { threshold: [0, 0.6, 1] });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  /* closing CTA — the reel is the Developer's evidence (Pears); link straight to
     the live product, same as the Developer identity chapter (WORKS[0]). */
  const devWk = (window.WORKS || [])[0];
  const devUrl = (devWk && devWk.link) || "https://and-pear.netlify.app/login";
  const isVideo = idx >= REEL.length;
  const s = isVideo ? REEL_VIDEO : REEL[idx];
  return (
    <section className="chapter reel" id="reel" data-tone="snow" data-prog="reel"
             data-screen-label="03·B · The Evidence — REEL">
      {/* tone is "snow" (cool near-white) — the engine crossfades paper(ChDev)→snow as
         you arrive at the Pears deck so the slides sit on a MATCHING ground, then
         snow→paper into the AIPM chapter. The slides' own base is rgb(245,245,247). */}
      <div className="ch-wrap reel-wrap">
        <div className="ch-stage reel-stage" data-ob ref={ref}
             data-end={isVideo ? "1" : "0"}
             style={{ "--self": (idx / (REEL_N - 1)).toFixed(4) }}>
          <div className="reel-spine" aria-hidden="true">
            {Array.from({ length: REEL_N }, (_, n) => (
              <i key={n} className={"reel-tick" + (n <= idx ? " passed" : "")} style={{ "--n": n }}
                 onClick={() => setIdx(n)}></i>
            ))}
            <span className="reel-self"></span>
          </div>
          <div className="reel-frame"
               onClick={(e) => {
                 /* the whole frame advances — except real controls (links, buttons,
                    the film's native UI). Phone is a plain vertical stack: no-op. */
                 if (phone()) return;
                 if (e.target.closest("a, button, video, iframe")) return;
                 go(1);
               }}
               onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
               onTouchEnd={(e) => {
                 if (phone()) return;
                 const dx = e.changedTouches[0].clientX - touchX.current;
                 if (Math.abs(dx) > 42) go(dx < 0 ? 1 : -1);
               }}>
            {REEL.map((slide, n) => (
              <img key={n} className={"reel-cell reel-img" + (n === idx ? " on" : "")}
                   src={"works/pears-deck/" + slide.ix + "." + (slide.ext || "jpg")}
                   alt={"Pears " + slide.ix + " " + slide.zh} decoding="async"
                   loading="eager" draggable="false" />
            ))}
            {idx > 0 && !isVideo && (
              <button className="reel-nav prev" type="button" data-hov aria-label="上一页"
                      onClick={() => go(-1)}><span>‹</span></button>
            )}
            {!isVideo && (
              <button className="reel-nav next" type="button" data-hov aria-label="下一页"
                      onClick={() => go(1)}><span>›</span></button>
            )}
            {isVideo && (
              <button className="reel-nav prev on-video" type="button" data-hov aria-label="回看提案"
                      onClick={() => go(-1)}><span>‹</span></button>
            )}
            <div className={"reel-cell reel-video" + (isVideo ? " on" : "")}>
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
              {/* loading poster — same bars-and-caption language as the AIPM platform
                  film's .apx-video-loading, recoloured for this chapter's light ground.
                  Shown the instant autoplay is triggered; hidden on 'playing' (real
                  playback started) or 'error', with an 8s safety timeout either way. */}
              <div className="reel-video-loading mono" aria-hidden="true">
                <span className="reel-load-bars"><i></i><i></i><i></i><i></i><i></i></span>
                <span className="reel-load-cap">影片加载中 · LOADING FILM</span>
              </div>
              {/* default muted; a SMALL top-right hint turns the sound on (用户: 右上角提示
                  一下就行，不要那么显眼，字也别多). Once unmuted it hides — the native controls
                  handle volume + the draggable progress bar. Off-centre so it never covers
                  the video or the native scrubber. */}
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
          </div>
          <div className="reel-ix mono" aria-hidden="true">
            <div key={idx} className="reel-ixc">
              <span className="ix">{isVideo ? "▶" : String(idx + 1).padStart(2, "0")}</span>{!isVideo && <span className="tot"> / {String(REEL.length).padStart(2, "0")}</span>}
              <span className="ln"></span><span className="lab">{s.zh}</span>
              <span className="gloss zh">{s.g}</span>
            </div>
          </div>
          <div className="reel-hint mono" aria-hidden="true">点击翻页 · CLICK / ‹ › / ←→</div>
          <div className="reel-out mono" aria-hidden="true">证物完毕 — 一线穿点 <span className="arr">↘</span></div>
          <a className="reel-cta ch-cta" href={devUrl} target="_blank" rel="noopener" data-hov>
            <span className="sq" aria-hidden="true"></span>VISIT PEARS · 访问应用<span className="arr" aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { ChAipm, ChAipmPlatform, ChDev, ChArch, ChReel, Structure3D });
