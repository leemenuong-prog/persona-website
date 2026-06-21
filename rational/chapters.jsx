/* ══════════════════════════════════════════════════════════════
   chapters.jsx — the three identities · three expressions.
   One language (bars ⇄ glyphs · the blue period), three dimensions:

   02 · An AIPM      — FLAT 平面 · 2D
       The sheet itself becomes ordered: a process column
       (telemetry → judgment → ship → re-test), a 3×3 tool
       matrix that stamps in, a disorder→order meter.
       Pure DOM. No depth — only order.

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

/* the six acts of the origin myth — a single forward gesture: a
   meteor decoded into the rational unit, then chaos resolved into
   the mark. boundaries shared with the canvas. */
const C2_ACTS = [
  { no: "0",   en: "THE METEOR", zh: "流星", a: 0.00, b: 0.14 },
  { no: "I",   en: "THE LINE",   zh: "成线", a: 0.14, b: 0.26 },
  { no: "II",  en: "THE PLANE",  zh: "成面", a: 0.26, b: 0.42 },
  { no: "III", en: "THE CUBE",   zh: "立方", a: 0.42, b: 0.52 },
  { no: "IV",  en: "CHAOS → ORDER", zh: "混沌成序", a: 0.52, b: 0.82 },
  { no: "V",   en: "THE MARK",   zh: "落定", a: 0.82, b: 1.01 },
];

/* the genesis stage driver — writes --p / --film / --pay onto the
   stage and toggles the active act caption. (Pure style writes; the
   payoff text only exists after the film resolves.) */
function useGenesisStage(id, ref) {
  useChE(() => {
    const el = ref.current; if (!el) return;
    const acts = [...el.querySelectorAll(".c2x-act")];
    let last = -2, lastAct = -1;
    const stop = window.__addLoop(() => {
      const p = aClamp((window.__progress && window.__progress.aipm) || 0, 0, 1);
      if (Math.abs(p - last) < 0.0006) return;
      last = p;
      el.style.setProperty("--p", p.toFixed(4));
      /* letterbox + HUD live during the film, retract at the payoff */
      const film = aClamp(aSeg(p, 0.015, 0.085) - aSeg(p, 0.82, 0.90), 0, 1);
      el.style.setProperty("--film", film.toFixed(3));
      el.style.setProperty("--pay", aEase(aSeg(p, 0.85, 0.95)).toFixed(3));
      const ai = Math.max(0, C2_ACTS.findIndex((x) => p < x.b));
      const idx = ai < 0 ? C2_ACTS.length - 1 : ai;
      if (idx !== lastAct) {
        lastAct = idx;
        acts.forEach((n, i) => n.classList.toggle("show", i === idx));
      }
    });
    return () => stop();
  }, []);
}

function ChAipm({ jump }) {
  const { AipmGenesis } = window;
  const ref = useChR(null);
  useGenesisStage("aipm", ref);
  return (
    <section className="chapter ch2x" id="aipm" data-tone="blue" data-prog="aipm" data-screen-label="02 · An AIPM — GENESIS">
      <div className="ch-wrap c2x-wrap">
        <div className="ch-stage c2x-stage" data-ob ref={ref}>
          <div className="c2x-art" aria-hidden="true"><AipmGenesis /></div>

          {/* cinematic letterbox */}
          <div className="c2x-letter top" aria-hidden="true"></div>
          <div className="c2x-letter bot" aria-hidden="true"></div>

          {/* film HUD — slug · act cards · timecode (fade out at the payoff) */}
          <div className="c2x-hud" aria-hidden="true">
            <div className="c2x-slug mono"><span className="ix">02</span><span className="ln"></span><span>AN AIPM · GENESIS</span></div>
            <div className="c2x-acts">
              {C2_ACTS.map((a, i) => (
                <div key={i} className={"c2x-act" + (i === 0 ? " show" : "")}>
                  <span className="n mono">ACT {a.no}</span>
                  <span className="t">{a.en}<i className="zh">{a.zh}</i></span>
                </div>
              ))}
            </div>
          </div>

          {/* the payoff — appears only after the film resolves into the mark */}
          <div className="c2x-pay">
            <div className="c2x-left">
              <div className="c2x-kick mono">02 · PRIMARY AXIS / 主轴</div>
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
            <div className="kick lm"><span>03 · THE LEVERAGE / 杠杆 — DIM · 3D AXONOMETRIC 体</span></div>
            <h2 className="ch-title c3-title"><BarWord text="A Developer" delay={0.15} /></h2>
            <div className="rule ch-rule" style={{ "--rd": ".22s" }}></div>
            <div className="ch-sub" data-rv style={{ "--rd": ".34s" }}>
              <span>DRAG TO ORBIT · 拖拽旋转</span>
              <span className="arr">⟲</span>
            </div>
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

const C4_FORCES = [
  { en: "WATER", zh: "水", st: { left: "36%", top: "17%" } },
  { en: "NOISE", zh: "噪声", st: { right: "5%", top: "36%" } },
  { en: "ENERGY", zh: "能量", st: { left: "47%", bottom: "10%" } },
  { en: "WIND", zh: "风", st: { right: "9%", bottom: "20%" } },
];
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
            <div className="kick lm"><span>04 · THE ROOT / 根 — DIM · SITE FORM 场</span></div>
            <h2 className="c4-title">
              <span className="c4-an"><BarWord text="An" period={false} /></span>
              <span className="c4-big"><BarWord text="Architect" delay={0.3} /></span>
            </h2>
            <div className="rule ch-rule c4-rule" style={{ "--rd": ".4s" }}></div>
            <div className="ch-sub c4-sub" data-rv style={{ "--rd": ".5s" }}>
              <span>FORCES RESOLVE INTO FORM · 力 → 形</span>
              <span className="arr">↘</span>
            </div>
          </div>
          <div className="c4-vzh" aria-hidden="true">把场地的力——水 · 噪声 · 能量 · 风——化成理性、可住的形</div>
          {C4_FORCES.map((f) => (
            <div key={f.en} className="c4-f mono" data-th="0.5" style={f.st}>
              <span className="ln"></span><span>{f.en} {f.zh}</span>
            </div>
          ))}
          {C4_ANNS.map((a) => (
            <div key={a.b} className="c4-ann" data-th={a.th} style={a.st}>
              <span className="sq"></span><b>{a.b}</b><span className="l">{a.l}</span>
            </div>
          ))}
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

Object.assign(window, { ChAipm, ChDev, ChArch, Structure3D });
