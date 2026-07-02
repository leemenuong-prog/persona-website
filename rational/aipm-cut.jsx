/* ══════════════════════════════════════════════════════════════
   aipm-cut.jsx — AN AIPM · THE THREAD / 一线穿点 (flat · 到达即播)

   产品判断 = 一根线，穿起几个信号点，落在其中一个上——那一点点亮成
   钴蓝的句点，其余的留在线上，退到暗处。全程只有一条横线 + 一排点：
   横向布局天然等比，手机端和桌面端用同一套坐标就能排好（用户反馈：
   之前 1800 点散射 + 对角扫略 + 竖脊柱太复杂，改成一根线穿点）。

   纯 2D。全程是 window.__progress.aipm (0–1) 的纯函数；冻结在任意 p
   都成立。p 的来源如今是 useCutStage（chapters.jsx）里的一次性 ~2.8s
   到达时间线（data-ob 触发），不再是滚动刷——本文件零改动地换了驱动。
   复用 art.jsx 的全局工具（aClamp/aLerp/aEase/aSeg/useCanvas）。
   ══════════════════════════════════════════════════════════════ */

const cutInk = (a) => `rgba(11,11,14,${a})`;
const cutBlue = (a) => `rgba(0,71,171,${a})`;

/* the points the thread strings together, as a fraction of width —
   the LAST one is where it lands and ignites. Few + fixed: no per-
   device tuning needed, they just scale with the canvas. */
const THREAD_X = [0.08, 0.22, 0.37, 0.52, 0.66, 0.78];

/* the period is a SQUARE everywhere on the site (.psq / .bmp / .bsq);
   a rounded square whose corner radius lerps to 0 reads as a dot
   FOCUSING into the mark. half = half-extent (≈ radius). */
function cutRoundSq(ctx, cx, cy, half, r, fill) {
  const s = half * 2, x = cx - half, y = cy - half;
  r = Math.max(0, Math.min(r, half));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + s, y, x + s, y + s, r);
  ctx.arcTo(x + s, y + s, x, y + s, r);
  ctx.arcTo(x, y + s, x, y, r);
  ctx.arcTo(x, y, x + s, y, r);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
}
function strokeRoundSq(ctx, cx, cy, half, r) { cutRoundSq(ctx, cx, cy, half, r, null); ctx.stroke(); }

function AipmCut() {
  const ref = useCanvas((ctx, W, H, now) => {
    if (!W || !H) return;
    let p = window.__progress && window.__progress.aipm;
    p = (p == null) ? 0 : p;

    /* edge envelope — the mark rises across the section's first sliver of
       scroll, then HOLDS at full strength as the sticky stage slides away
       into the next chapter — no dissolve, or the payoff drops mid-handoff.
       Clear only once fully off the top (p>1.3 spares the rest of the page
       the redraw once the stage has scrolled well past). */
    const edge = aSeg(p, -0.08, 0.06);
    if (edge <= 0.001 || p > 1.3) { ctx.clearRect(0, 0, W, H); return; }
    const eAlpha = aEase(aClamp(edge, 0, 1));
    const pc = aClamp(p, 0, 1);
    const minWH = Math.min(W, H);
    const baseR = minWH < 480 ? Math.max(2.1, minWH / 170) : Math.max(1.6, Math.min(2.6, minWH / 420));
    const y = H * 0.42;
    const xs = THREAD_X.map((f) => W * f);
    const last = xs.length - 1;

    const A = (a) => { ctx.globalAlpha = a * eAlpha; };
    ctx.clearRect(0, 0, W, H);

    /* phases over the pinned stage: .02–.16 the points settle in ·
       .18–.58 the thread draws left→right, stringing through them ·
       .58–.66 anticipation (coil) on the landing point ·
       .66–.88 ignite (release into the cobalt period) */
    const fieldIn = aEase(aSeg(pc, 0.02, 0.16));
    if (fieldIn <= 0.001) return;
    const draw = aEase(aSeg(pc, 0.18, 0.58));
    const finA = aSeg(pc, 0.58, 0.66);
    const finR = aSeg(pc, 0.66, 0.88);

    /* the thread — a single horizontal line, drawn once through every
       point, overshooting the landing point a touch so it reads as
       arriving and settling rather than stopping short. */
    const tipX = aLerp(xs[0], xs[last] + minWH * 0.04, draw);
    A(fieldIn * 0.7); ctx.strokeStyle = cutInk(1); ctx.lineWidth = Math.max(1, minWH * 0.0014);
    ctx.beginPath(); ctx.moveTo(xs[0], y); ctx.lineTo(tipX, y); ctx.stroke();

    for (let i = 0; i < xs.length; i++) {
      const x = xs[i], isLast = i === last;
      const passed = tipX >= x;
      /* arrival "tick" — a brief radius pop as the thread strings through */
      const bump = passed ? aClamp(1 - (tipX - x) / (minWH * 0.05), 0, 1) : 0;
      let rad = baseR * (1 + bump * 0.9);
      let al = passed ? (isLast ? 1 : 0.85) : 0.4;
      /* strung, then recedes — considered, not the one kept */
      if (passed && !isLast) al = aLerp(al, 0.3, aClamp((tipX - x) / (minWH * 0.16), 0, 1));

      if (isLast && (finA > 0 || finR > 0)) {
        const coil = aEase(finA) * (1 - finR);                       /* shrink slightly before release */
        const rRel = aLerp(baseR, baseR * 3.0, aEase(finR));
        const settleR = Math.sin(finR * Math.PI) * (1 - finR) * 0.1; /* elastic catch on release       */
        const side = rRel * (1 + settleR) * (1 - 0.18 * coil);
        const ignite = aEase(aSeg(pc, 0.66, 0.74));                  /* ink → cobalt, timed to release */
        const cr = Math.round(aLerp(11, 0, ignite)), cg = Math.round(aLerp(11, 71, ignite)), cb = Math.round(aLerp(14, 171, ignite));
        const corner = aLerp(side, 0, aEase(aSeg(pc, 0.66, 0.82)));  /* circle → hard square, late     */
        A(fieldIn); cutRoundSq(ctx, x, y, side, corner, `rgba(${cr},${cg},${cb},1)`);
        /* two thin square rings — an ignition bloom, not one fat circle */
        const lw = Math.max(1.2, minWH * 0.0016);
        ctx.strokeStyle = cutBlue(1); ctx.lineWidth = lw;
        const r1 = aEase(aSeg(pc, 0.66, 0.76));
        A(fieldIn * (1 - aSeg(pc, 0.66, 0.8)) * 0.9);
        strokeRoundSq(ctx, x, y, aLerp(side * 1.4, minWH * 0.13, r1), aLerp(side, 0, r1));
        const r2 = aEase(aSeg(pc, 0.7, 0.88));
        A(fieldIn * (1 - aSeg(pc, 0.7, 0.88)) * 0.4);
        strokeRoundSq(ctx, x, y, aLerp(side * 1.4, minWH * 0.19, r2), 0);
        ctx.globalAlpha = 1;
        continue;
      }

      A(al * fieldIn); ctx.fillStyle = cutInk(1);
      ctx.beginPath(); ctx.arc(x, y, rad, 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;
  });
  return <canvas ref={ref}></canvas>;
}

Object.assign(window, { AipmCut });
