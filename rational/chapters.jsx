/* ══════════════════════════════════════════════════════════════
   chapters.jsx — the three identities · three expressions.
   One language (bars ⇄ glyphs · the blue period), three dimensions:

   02 · An AIPM      — THE CUT 一刀 · FLAT 2D
       Prioritisation as one decisive incision: ~1800 weak
       signal-dots, a hairline cut deletes almost all of them,
       the few survivors snap to a priority spine, the apex
       ignites cobalt as the period. Luxury = subtraction.
       Flat — nothing rises. (See aipm-cut.jsx.)

   03 · A Developer  — AXON 体 · 3D
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
   02 · AN AIPM — FLAT SHEET · 平面 (tone: blue)
   ════════════════════════════════════════════════════════════ */
const C2_STEPS = [
  { ix: "01", en: "TELEMETRY", zh: "埋点 — 数据找到漏点", th: 0.18,
    note: "HOOK STAGE −52% — 埋点把漏点钉在坐标上" },
  { ix: "02", en: "JUDGMENT", zh: "判断 — 高创意内容无法一次成型", th: 0.40,
    note: "MERGE STAGES · 3 CANDIDATES — 合并生成阶段，三候选并出" },
  { ix: "03", en: "SHIP", zh: "交付 — 三代产品迭代", th: 0.62,
    note: "291 COMMITS · 80% SOLO — 9 个工具铺满生产链" },
  { ix: "04", en: "RE-TEST", zh: "复测 — 看板让秩序可量化", th: 0.82,
    note: "ROI BOARD 0.39 H/$ — 中台合理性可被验证" },
];

/* the cut stage driver — writes --p and --pay onto the stage.
   (Pure style writes; the payoff copy only resolves after the cut.) */
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
      /* payoff (title "An AIPM" + copy) rises IN SYNC with the spine line
         telescoping out (canvas grows it ~0.54–0.82), so the words arrive as
         the structure resolves — then HOLDS. It stays lit as the sticky stage
         slides away (no dissolve at praw>1), matching the held canvas frame, so
         the resolved mark carries intact into the next chapter. */
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
  return (
    <section className="chapter ch2x" id="aipm" data-tone="paper" data-prog="aipm" data-screen-label="02 · An AIPM — THE CUT">
      <div className="ch-wrap c2x-wrap">
        <div className="ch-stage c2x-stage" data-ob ref={ref}>
          <div className="c2x-art" aria-hidden="true"><AipmCut /></div>

          {/* the payoff — appears only after the film resolves into the mark */}
          <div className="c2x-pay">
            <div className="c2x-left">
              <h2 className="c2x-title">An AIPM<i className="psq" aria-hidden="true"></i></h2>
              <div className="c2x-motto">Order is the Product<i className="psq" aria-hidden="true"></i></div>
              <p className="c2x-st">Telemetry finds the leak, judgment writes the prescription, shipping proves it. Requirements aren't gathered — structure forces them out.
                <span className="zh">秩序即产品。埋点找到漏点，产品判断开出处方，ship 去验证。需求不是收集来的，是被结构逼出来的。</span>
              </p>
            </div>
            <div className="c2x-right">
              <div className="c2x-loop mono">
                <div className="lh"><span>THE LOOP / 闭环</span><span>9 / 9 SHIPPED</span></div>
                {C2_STEPS.map((s) => (
                  <div key={s.ix} className="lr"><span className="sq"></span><b>{s.ix}</b><span className="en">{s.en}</span><span className="zh">{s.zh}</span></div>
                ))}
              </div>
              <div className="c2x-stats">
                <div className="st"><div className="n">9</div><div className="l">PRODUCTION TOOLS</div></div>
                <div className="st"><div className="n">220K</div><div className="l">LINES SHIPPED</div></div>
                <div className="st"><div className="n">0.39</div><div className="l">ROI · H/$</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   02·B · XTOOL AGENT PLATFORM — KEYNOTE REVEAL · 平台介绍
   Two quiet Chinese pages explain the platform thesis; only then does the
   product film appear beside the title.
   ════════════════════════════════════════════════════════════ */
const APX_INTRO_PAGES = [
  {
    ix: "01",
    tag: "平台定义",
    title: "不是单个工具，是生产系统。",
    body: "XTOOL 把调研、脚本、审核、复测放进同一个闭环。每个动作不再分散，都会回到统一的结构里。",
  },
  {
    ix: "02",
    tag: "专属 Agent",
    title: "一个 Agent 记住你的判断。",
    body: "它记住你的选题口味、审核规则、失败原因和复测结果。下一次生成，不是重新开始，而是在已有判断上继续推进。",
  },
];

const APX_VISUALS = [
  { key: "system", label: "生产链汇入一个系统" },
  { key: "memory", label: "Agent 记住你的判断" },
];

const APX_STRIP = [
  "1 个专属 Agent",
  "9 个生产工具",
  "220K 行代码交付",
  "ROI 0.39 H/$",
];

function useApxStage(id, ref) {
  useChE(() => {
    const el = ref.current; if (!el) return;
    const sec = el.closest("section");
    const pages = [...el.querySelectorAll(".apx-page")];
    const visuals = [...el.querySelectorAll(".apx-visual")];
    const video = el.querySelector(".apx-video");
    const frame = el.querySelector(".apx-video iframe");
    let last = -2, lastStep = -1, vidOn = false, mobileReset = false;
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

      /* video iframe — load + autoplay the film FRESH (xtool/?fresh=1 → starts at 0:00)
         only while the video page is actually on screen (last third of the pinned
         stage); unload to about:blank before it (no background pre-roll) and after it
         (stop once scrolled past). Keyed to RAW progress + its own flag so it still
         fires when praw>1 freezes the step at 2; re-entering reloads → always from 0. */
      /* DESKTOP only: the pinned keynote auto-loads + auto-unloads the film as it
         scrolls through its page. On a phone/tablet the stage is a vertical stack
         (height:auto) so this praw window is unreliable — the film sits at the
         bottom and praw is already >1.04 by the time it's on screen, so it never
         loaded (the "看不到内容" bug). There the film loads on an explicit TAP
         instead (see the .apx-video-play poster button) — leave src alone. */
      if (frame && !(window.matchMedia && window.matchMedia("(max-width: 900px)").matches)) {
        const want = praw >= 0.66 && praw <= 1.04;
        if (want !== vidOn) { vidOn = want; frame.src = want ? "xtool/?fresh=1" : "about:blank"; }
      }

      if (Math.abs(praw - last) < 0.0006) return;
      last = praw;
      el.style.setProperty("--p", p.toFixed(4));
      const step = p < 0.34 ? 0 : p < 0.68 ? 1 : 2;
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
        video.classList.toggle("on", step === 2);
        video.style.setProperty("opacity", step === 2 ? "1" : "0", "important");
        video.style.setProperty("transform", step === 2 ? "none" : "translateX(28px) scale(.992)", "important");
      }
    });
    return () => stop();
  }, []);
}

function ChAipmPlatform({ jump }) {
  const ref = useChR(null);
  const frameRef = useChR(null);
  const [filmOn, setFilmOn] = React.useState(false);
  useApxStage("aipmPlatform", ref);
  return (
    <section className="chapter apx" id="aipm-platform" data-tone="paper" data-prog="aipmPlatform" data-screen-label="02·B · XTOOL Agent Platform">
      <div className="ch-wrap">
        <div className="ch-stage apx-stage" data-ob ref={ref} data-step="0">
          <div className="apx-kicker mono">
            <span>02·B / AFTER THE CUT</span><span>PLATFORM REVEAL · 平台登场</span>
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

                <div className="apx-visual apx-visual-memory">
                  <div className="apx-visual-cap mono">{APX_VISUALS[1].label}</div>
                  <div className="apx-memory-diagram">
                    <div className="apx-memory-core">
                      <i></i>
                      <span>你的专属 Agent</span>
                    </div>
                    {["选题口味", "审核规则", "失败原因", "复测结果"].map((item, i) => (
                      <div className={"apx-memory-node n" + (i + 1)} key={item}>
                        <b>{String(i + 1).padStart(2, "0")}</b><span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="apx-video" aria-label="XTOOL Agent Platform video">
                {/* DESKTOP: src stays blank until the viewer reaches the video page —
                    useApxStage swaps it to xtool/?fresh=1 on arrival and back to
                    about:blank on leave, so it never pre-rolls in the background.
                    PHONE/TABLET: the poster button below loads it on an explicit tap. */}
                <iframe ref={frameRef} src="about:blank" title="XTOOL Agent Platform film" allow="autoplay; fullscreen"></iframe>
                {!filmOn && (
                  <button className="apx-video-play" type="button" data-hov aria-label="播放 XTOOL 平台影片"
                          onClick={() => { setFilmOn(true); const f = frameRef.current; if (f) f.src = "xtool/?fresh=1"; }}>
                    <img src="xtool/screenshots/demo_review.png" alt="XTOOL Agent Platform" draggable="false" />
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
            <div className="mt lm" style={{ "--rd": ".3s" }}><span>Discipline is Leverage<i className="psq" aria-hidden="true"></i></span></div>
            <div className="st" data-rv style={{ "--rd": ".45s" }}>
              I don't type the code — I govern the agent that does. Incident becomes rule, rule becomes test, test becomes gate. One builder, three ends shipped, zero recurrence.
              <span className="zh">纪律即杠杆。我不敲代码——我治理那个敲代码的 Agent。事故沉淀为规则，规则固化为测试，测试落为门禁。单人交付 Web + 插件 + 后端三端。</span>
            </div>
          </div>
          <div className="ch-stats">
            <div className="st" data-rv style={{ "--rd": ".5s" }}><div className="n" data-cnt="220" data-fmt="K">0</div><div className="l">LOC WITH AI AGENTS</div></div>
            <div className="st" data-rv style={{ "--rd": ".62s" }}><div className="n" data-cnt="3">0</div><div className="l">ENDS SHIPPED SOLO</div></div>
            <div className="st" data-rv style={{ "--rd": ".74s" }}><div className="n" data-cnt="0">0</div><div className="l">INCIDENT RECURRENCE</div></div>
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

const C4_ANNS = [
  { b: "T1", l: "《建筑学报》 2ND AUTHOR — AIGC 三维空间优化", st: { right: "5%", top: "11%" }, th: 0.48 },
  { b: "TOP 1%", l: "挑战杯 GRAND PRIZE 特等奖 — 蒋巷文脉 · 科链智谷 2.0", st: { right: "5%", bottom: "22%" }, th: 0.6 },
  { b: "30D→5D", l: "UABB AIGC PIPELINE — 50+ EXHIBITS · TOP 3%", st: { right: "5%", bottom: "6%" }, th: 0.72 },
];

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
          <div className="c4-anns">
            {C4_ANNS.map((a, i) => (
              <div key={a.b} className={"c4-ann ann-" + i} data-th={a.th} style={a.st}>
                <span className="sq"></span><b>{a.b}</b><span className="l">{a.l}</span>
              </div>
            ))}
          </div>
          <div className="ch-motto">
            <div className="mt lm" style={{ "--rd": ".3s" }}><span>Form is Function<i className="psq" aria-hidden="true"></i></span></div>
            <div className="st" data-rv style={{ "--rd": ".45s" }}>
              Architecture taught me to read a site's forces — water, noise, energy, wind — and resolve them into rational, livable form. It is the root system under everything I ship.
              <span className="zh">形式即功能。建筑教我读懂场地的力——水、噪声、能量、风——并把它们化成理性、可住的形。这是根，不是主角。</span>
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
   Exit: slide 9 (生态) widens out, the frame deconstructs to the bare
   bar-column, and the engine's standard paper→ink midline lerp carries
   the page into the Architect (场). No custom recolor code.
   ════════════════════════════════════════════════════════════ */
const REEL = [
  /* the cover (01.jpg) is intentionally gone — it opened the reel on an empty
     frame that slowly faded into a redundant Pears title card (too slow a beat),
     and the Pears identity already returns on the closing roadshow frame. Start
     straight on the substance. `ix` doubles as the image filename, so the kept
     slides keep their 02–09 names; the displayed index is renumbered 01–08 in
     the render. */
  { ix: "02", zh: "看你做一遍", g: "把重复工作交给 Pears" },
  { ix: "03", zh: "产品洞察",   g: "软件越来越容易生成，难的是把工作说清楚" },
  { ix: "04", zh: "产品展示",   g: "Vibe Coding 从你说的开始，Pears 从你做的开始" },
  { ix: "05", zh: "乐观与学习", g: "每一次点击与切换，都在告诉它什么值得自动化", ext: "svg" },  /* vector recreation — crisp at any size (orig 05.jpg kept as backup) */
  { ix: "06", zh: "工作流拍板", g: "自动化到哪一步，由你拍板", ext: "svg" },  /* vector recreation — crisp UI dashboard (orig 06.jpg kept as backup) */
  { ix: "07", zh: "隐私设计",   g: "只在你开口时才记，停止任务记录立即结束", ext: "svg" },  /* vector recreation — crisp at any size (orig 07.jpg kept as backup) */
  { ix: "08", zh: "Agent 构建", g: "拍板之后，工作流开始成为 Agent" },
  { ix: "09", zh: "产品生态",   g: "你的做法，不只为你工作 · Agent App 生态" },
];

/* the Pears roadshow video is the reel's 10th (closing) frame — the pitch
   deck culminating in the actual W·01 demo. Click-to-play (sound + native
   controls), pauses + resets when scrolled off. preload="none" so the 73MB
   file only downloads on play; the poster shows meanwhile. */
const REEL_VIDEO = { src: "works/pears-roadshow.mp4", poster: "works/pears-roadshow-cover.jpg", zh: "路演", g: "Pears 产品路演 · Demo Day" };
const REEL_N = REEL.length + 1;   /* 8 提案帧 + 1 路演视频帧 = 9 cells */

/* the reel driver — a clone of useCutStage; pure style writes off
   window.__progress.reel. onIndex fires only when the integer frame
   changes. Cell opacity defaults to 0 in CSS (not inline) so a setState
   re-render never resets what this loop is imperatively driving. */
function useReelStage(id, ref, onIndex, onVideoExit) {
  useChE(() => {
    const el = ref.current; if (!el) return;
    const cells = [...el.querySelectorAll(".reel-cell")];
    const ticks = [...el.querySelectorAll(".reel-tick")];
    const vid = el.querySelector(".reel-video video");
    const LAST = REEL_N - 1;
    let lastP = -2, lastI = -1;
    const stop = window.__addLoop(() => {
      /* PHONE: the reel is a plain full-bleed VERTICAL stack (CSS) — the pinned
         cross-dissolve scrub is off. Skip every per-frame write so nothing fights
         the stacked layout or pauses the film mid-scroll. Checked each frame, so a
         resize back to desktop recovers the scrub automatically. */
      if (window.matchMedia && window.matchMedia("(max-width: 600px)").matches) return;
      const praw = (window.__progress && window.__progress[id]) || 0;
      if (Math.abs(praw - lastP) < 0.0006) return;
      lastP = praw;
      const p = aClamp(praw, 0, 1);
      const calm = window.__calm;
      const raw = aSeg(p, 0.10, 0.93) * REEL_N;     /* 0…N across the 9 frames + video */
      const k = Math.min(Math.floor(raw), LAST);
      const frac = raw - k;
      /* enter — keyed to the RAW (unclamped) progress so the first slide + chrome
         fade up DURING the reel's scroll-in and are already full the instant it
         pins. No more empty bordered frame sitting on screen waiting for a slide
         to appear (that opening beat read as dead/slow). */
      const enter = aEase(aSeg(praw, -0.06, 0.0));
      const kill = aSeg(p, 0.93, 0.97);             /* end-of-reel marker (drives the exit caption + index) */
      let incoming = k < LAST ? aEase(aSeg(frac, 0.78, 1)) : 0;   /* last 22% of a band dissolves */
      if (calm) incoming = (k < LAST && frac >= 0.5) ? 1 : 0;     /* reduced-motion → hard cut */
      /* HOLD the last frame — cells no longer deconstruct to empty at the end
         (was enter * (1 - kill)). The closing frame (the Pears roadshow video)
         stays lit and rides up intact as the sticky stage slides into the
         Architect, instead of dissolving to a bare rectangle mid-handoff. */
      const vis = enter;
      cells.forEach((c, i) => {
        let o = 0;
        if (i === k) o = 1 - incoming * 0.70;       /* current dwells, dips to .30 in the dissolve */
        else if (i === k + 1) o = incoming;         /* next locks in */
        c.style.opacity = (o * vis).toFixed(3);
        c.style.transform = (!calm && i === k + 1) ? "scale(" + (1.012 - 0.012 * incoming).toFixed(4) + ")" : "scale(1)";
      });
      /* the video cell is clickable + playing only while it's the centred frame
         and the stage hasn't begun to release. Keyed to progress (NOT to cell
         opacity — that now holds at 1), so the roadshow film still pauses + resets
         the instant you scroll off it, in either direction: no audio bleeding on
         into the Architect, and a generous ~0.15 dwell band so a small touch scrub
         mid-playback doesn't stop it. */
      const vcell = cells[LAST];
      if (vcell) {
        const live = k >= LAST && praw < 1.0;
        vcell.style.pointerEvents = live ? "auto" : "none";
        if (vid && !live && !vid.paused) { vid.pause(); onVideoExit && onVideoExit(); }
      }
      el.style.setProperty("--chrome", enter.toFixed(3));
      el.style.setProperty("--self", aClamp(raw / LAST, 0, 1).toFixed(4));
      el.style.setProperty("--kill", aEase(aSeg(p, 0.93, 0.98)).toFixed(3));
      ticks.forEach((t, n) => t.classList.toggle("passed", n <= k));
      const i = kill > 0.5 ? LAST : k;
      if (i !== lastI) { lastI = i; onIndex(i); }
    });
    return () => stop();
  }, []);
}

function ChReel({ jump }) {
  const ref = useChR(null);
  const vidRef = useChR(null);
  const [i, setI] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  useReelStage("reel", ref, setI, () => setPlaying(false));
  const isVideo = i >= REEL.length;
  const s = isVideo ? REEL_VIDEO : REEL[i];
  return (
    <section className="chapter reel" id="reel" data-tone="snow" data-prog="reel"
             data-screen-label="03·B · The Evidence — REEL">
      {/* tone is "snow" (cool near-white) — the engine crossfades paper(ChDev)→snow as
         you arrive at the Pears deck so the slides sit on a MATCHING ground, then
         snow→ink into the Architect. The slides' own base is rgb(245,245,247). */}
      <div className="ch-wrap reel-wrap">
        <div className="ch-stage reel-stage" data-ob ref={ref}>
          <div className="reel-spine" aria-hidden="true">
            {Array.from({ length: REEL_N }, (_, n) => <i key={n} className="reel-tick" style={{ "--n": n }}></i>)}
            <span className="reel-self"></span>
          </div>
          <div className="reel-frame">
            {REEL.map((slide, n) => (
              <img key={n} className="reel-cell reel-img" src={"works/pears-deck/" + slide.ix + "." + (slide.ext || "jpg")}
                   alt={"Pears " + slide.ix + " " + slide.zh} decoding="async"
                   loading={n < 2 ? "eager" : "lazy"} draggable="false" />
            ))}
            <div className="reel-cell reel-video">
              <video ref={vidRef} src={REEL_VIDEO.src} poster={REEL_VIDEO.poster}
                     preload="none" playsInline controls={playing}
                     onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}></video>
              {!playing && <button className="reel-play" aria-label="播放 Pears 路演视频"
                onClick={() => { const v = vidRef.current; if (v) v.play(); }}>
                <span className="reel-play-ico" aria-hidden="true"></span>
                <span className="reel-play-cap mono">点击播放 · PEARS 路演 DEMO DAY</span>
              </button>}
            </div>
          </div>
          <div className="reel-ix mono" aria-hidden="true">
            <div key={i} className="reel-ixc">
              <span className="ix">{isVideo ? "▶" : String(i + 1).padStart(2, "0")}</span>{!isVideo && <span className="tot"> / {String(REEL.length).padStart(2, "0")}</span>}
              <span className="ln"></span><span className="lab">{s.zh}</span>
              <span className="gloss zh">{s.g}</span>
            </div>
          </div>
          <div className="reel-out mono" aria-hidden="true">证物完毕 — 力造出形 <span className="arr">↘</span></div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { ChAipm, ChAipmPlatform, ChDev, ChArch, ChReel, Structure3D });
