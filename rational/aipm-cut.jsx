/* ══════════════════════════════════════════════════════════════
   aipm-cut.jsx — AN AIPM · THE CUT / 一刀 (flat, 滚动驱动)

   产品判断 = 一次果断的切割。一千八百个微弱的信号点散落在纸面上，
   一条墨线斜扫而过，把几乎所有点都「删掉」——留下来的少数收束成一
   条优先级脊柱，最高的那个点最后点亮成钴蓝的句点。奢侈在于「删去」：
   画面从满到几乎空。

   纯 2D，没有立方体，没有天际线，没有任何东西「长高」——刻意与
   Developer 章节的轴测体块完全区分。全程是 window.__progress.aipm
   (0–1) 的纯函数；冻结在任意 p 都成立。复用 art.jsx 的全局工具。
   ══════════════════════════════════════════════════════════════ */

const CUT_PAPER = "#efece6";
const cutInk = (a) => `rgba(11,11,14,${a})`;
const cutBlue = (a) => `rgba(0,71,171,${a})`;

/* deterministic field — rebuilt only when the canvas size changes */
function buildCut(W, H) {
  const rnd = rng(0x51A7);
  const N = Math.min(2000, Math.max(700, Math.round((W * H) / 150)));
  const minWH = Math.min(W, H);
  const cl = [];
  for (let i = 0; i < 7; i++) cl.push({ x: rnd() * W, y: rnd() * H, r: minWH * (0.07 + rnd() * 0.16) });
  const dots = [];
  for (let i = 0; i < N; i++) {
    let x, y;
    if (rnd() < 0.62) { const c = cl[(rnd() * cl.length) | 0]; x = c.x + (rnd() - 0.5) * c.r * 2; y = c.y + (rnd() - 0.5) * c.r * 2; }
    else { x = rnd() * W; y = rnd() * H; }
    x = aClamp(x, 2, W - 2); y = aClamp(y, 2, H - 2);
    const ex = x - W / 2, ey = y - H / 2, m = Math.hypot(ex, ey) || 1;
    dots.push({ hx: x, hy: y, ph: rnd() * 6.2832, r2: rnd(), ex: ex / m, ey: ey / m, keep: false, slot: -1, uu: 0, un: 0 });
  }
  /* the cut's diagonal — sweep coordinate = projection onto its normal */
  const nx = Math.cos(0.7), ny = Math.sin(0.7);
  let uMin = 1e9, uMax = -1e9;
  for (const d of dots) { d.uu = d.hx * nx + d.hy * ny; if (d.uu < uMin) uMin = d.uu; if (d.uu > uMax) uMax = d.uu; }
  const span = (uMax - uMin) || 1;
  for (const d of dots) d.un = (d.uu - uMin) / span;
  /* the survivors — the few kept signals, ordered top→bottom into a spine */
  const K = aClamp(Math.round(H / 56), 9, 13) | 0;
  const keepers = dots.slice().sort((a, b) => b.r2 - a.r2).slice(0, K);
  keepers.sort((a, b) => a.hy - b.hy);
  const sy = [];
  for (let i = 0; i < keepers.length; i++) {
    keepers[i].keep = true; keepers[i].slot = i;
    sy.push(aLerp(H * 0.2, H * 0.82, keepers.length > 1 ? i / (keepers.length - 1) : 0.5));
  }
  return { W, H, dots, nx, ny, uMin, uMax, sy };
}

function AipmCut() {
  const sref = React.useRef(null);
  const ref = useCanvas((ctx, W, H, now) => {
    if (!W || !H) return;
    let p = window.__progress && window.__progress.aipm;
    p = (p == null) ? 0 : p;
    if (p <= -0.06 || p >= 1.12) { ctx.clearRect(0, 0, W, H); return; }

    const rW = Math.round(W), rH = Math.round(H);
    let S = sref.current;
    if (!S || S.W !== rW || S.H !== rH) { S = buildCut(rW, rH); sref.current = S; }

    const pc = aClamp(p, 0, 1);
    const minWH = Math.min(W, H);
    const baseR = Math.max(1.4, Math.min(2.4, minWH / 480));
    const sweep = aEase(aSeg(pc, 0.22, 0.5));   /* the diagonal cut sweeps   */
    const snap  = aEase(aSeg(pc, 0.5, 0.78));   /* survivors snap to a spine */
    const fin   = aSeg(pc, 0.78, 1.0);          /* the apex ignites          */
    const idle  = (window.__calm ? 0 : 1) * (1 - aClamp(pc / 0.22, 0, 1));
    const t = now / 1000;
    const drift = baseR * 0.85;
    const fly = minWH * 0.13;

    ctx.fillStyle = CUT_PAPER; ctx.fillRect(0, 0, W, H);

    for (const d of S.dots) {
      const res = d.un < sweep;
      if (d.keep) {
        let x = d.hx, y = d.hy;
        if (!res && idle > 0) { x += Math.sin(t * 0.8 + d.ph) * drift * idle; y += Math.cos(t * 0.7 + d.ph) * drift * idle; }
        const sx = W * 0.5, sly = S.sy[d.slot];
        x = aLerp(x, sx, snap); y = aLerp(y, sly, snap);
        const apex = d.slot === 0;
        let rad = baseR, al = res ? 1 : 0.5, col = cutInk(1);
        if (res) { const bump = 1 - aClamp((sweep - d.un) / 0.05, 0, 1); rad = baseR * (1 + 1.4 * bump); }
        if (fin > 0) {
          if (apex) { rad = aLerp(baseR * 1.15, baseR * 3.0, aEase(fin)); col = cutBlue(1); al = 1; }
          else { al = aLerp(1, 0.16, fin); rad = aLerp(baseR, baseR * 0.7, fin); }
        }
        ctx.globalAlpha = al; ctx.fillStyle = col;
        ctx.beginPath(); ctx.arc(x, y, rad, 0, 6.2832); ctx.fill();
        if (apex && fin > 0) {
          ctx.globalAlpha = (1 - fin) * 0.9; ctx.strokeStyle = cutBlue(1); ctx.lineWidth = Math.max(1.2, minWH * 0.0016);
          ctx.beginPath(); ctx.arc(x, y, aEase(fin) * minWH * 0.34, 0, 6.2832); ctx.stroke();
        }
      } else if (!res) {
        let x = d.hx, y = d.hy;
        if (idle > 0) { x += Math.sin(t * 0.8 + d.ph) * drift * idle; y += Math.cos(t * 0.7 + d.ph) * drift * idle; }
        ctx.globalAlpha = 0.46; ctx.fillStyle = cutInk(1);
        ctx.beginPath(); ctx.arc(x, y, baseR * 0.78, 0, 6.2832); ctx.fill();
      } else {
        const tt = aClamp((sweep - d.un) / 0.12, 0, 1), k = aEase(tt), a = (1 - tt) * 0.6;
        if (a > 0.01) {
          ctx.globalAlpha = a; ctx.fillStyle = cutInk(1);
          ctx.beginPath(); ctx.arc(d.hx + d.ex * fly * k, d.hy + d.ey * fly * k, baseR * 0.78 * (1 - 0.5 * tt), 0, 6.2832); ctx.fill();
        }
      }
    }
    ctx.globalAlpha = 1;

    /* the cut — a hairline that sweeps, then rotates into the spine's axis */
    if (sweep > 0) {
      const axis = aEase(aSeg(pc, 0.5, 0.74));
      const lineA = 1 - aSeg(pc, 0.76, 0.9);
      if (lineA > 0.01) {
        let nx = aLerp(S.nx, 1, axis), ny = aLerp(S.ny, 0, axis);
        const nn = Math.hypot(nx, ny) || 1; nx /= nn; ny /= nn;
        const val = aLerp(aLerp(S.uMin, S.uMax, sweep), W * 0.5, axis);
        const px = nx * val, py = ny * val, dx = -ny, dy = nx;
        ctx.globalAlpha = lineA;
        ctx.strokeStyle = axis > 0.5 ? cutInk(0.4) : cutInk(0.85);
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(px - dx * 3000, py - dy * 3000); ctx.lineTo(px + dx * 3000, py + dy * 3000); ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    /* the live decision counter — fades out as the payoff arrives */
    const capA = 0.62 * (1 - aEase(aSeg(pc, 0.8, 0.92)));
    if (capA > 0.01) {
      const kept = Math.max(1, Math.round(aLerp(1800, 1, aEase(aSeg(pc, 0.22, 0.94)))));
      const fs = Math.max(10, Math.min(13, W * 0.0105));
      ctx.globalAlpha = capA; ctx.fillStyle = cutInk(1);
      ctx.font = fs + 'px ui-monospace, "SF Mono", Menlo, monospace';
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.fillText("SIGNALS 1800 · KEPT " + (kept < 10 ? "0" + kept : kept), 40, H - 40);
      ctx.globalAlpha = 1;
    }
  });
  return <canvas ref={ref}></canvas>;
}

Object.assign(window, { AipmCut });
