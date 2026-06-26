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

/* the period is a SQUARE everywhere on the site (.psq / .bmp / .bsq); the
   apex resolves into one. A rounded square whose corner radius lerps to 0
   reads as a dot FOCUSING into the mark. half = half-extent (≈ radius). */
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
  const sref = React.useRef(null);
  const ref = useCanvas((ctx, W, H, now) => {
    if (!W || !H) return;
    let p = window.__progress && window.__progress.aipm;
    p = (p == null) ? 0 : p;

    /* edge envelope — the MARKS rise from nothing across the section's first
       sliver of scroll (so nothing pops in), then HOLD at full strength. The
       resolved frame (cobalt period · spine · survivors) must persist as the
       sticky stage slides away into the next chapter — no sink-to-nothing, or
       the climax dissolves mid-handoff and the page reads as blank between
       sections. (pc clamps to 1 below, so p>1 keeps redrawing the final frame.)
       Clear only once fully off the top — the 600vh stage exits the viewport at
       p≈1.2, so cut the ~2000-dot redraw past p>1.3 to spare the rest of the page. */
    const edge = aSeg(p, -0.08, 0.06);
    if (edge <= 0.001 || p > 1.3) { ctx.clearRect(0, 0, W, H); return; }
    const eAlpha = aEase(aClamp(edge, 0, 1));

    const rW = Math.round(W), rH = Math.round(H);
    let S = sref.current;
    if (!S || S.W !== rW || S.H !== rH) { S = buildCut(rW, rH); sref.current = S; }

    const pc = aClamp(p, 0, 1);
    const minWH = Math.min(W, H);
    /* on a narrow PORTRAIT phone frame minWH is the ~375px width, so the desktop
       formula clamps every dot to the 1.4px floor and the field reads empty.
       Lift the floor (and grow it with the narrow side) so the 1800-signal
       scatter is actually visible before "the cut". 条 still ink, just legible. */
    const baseR = minWH < 480 ? Math.max(1.9, minWH / 200) : Math.max(1.4, Math.min(2.4, minWH / 480));
    const K = S.sy.length;
    /* phases (over the 600vh stage):
       .02–.14 field materialises (渐显) + slow drift · .22–.52 sweep ·
       .54–.82 snap + spine telescopes out · .80–.86 anticipation · .86–1 ignite */
    const sweep = aEase(aSeg(pc, 0.22, 0.52));   /* the diagonal cut sweeps         */
    const finA  = aSeg(pc, 0.80, 0.86);          /* the apex coils (anticipation)   */
    const finR  = aSeg(pc, 0.86, 1.0);           /* the apex ignites (release)      */
    /* the field FADES IN then drifts slowly; flow keeps a living wander going
       until the cut reaches each dot — fades smoothly INTO the sweep, so there
       is no global freeze/lurch right before the incision */
    const fieldIn = aEase(aSeg(pc, 0.02, 0.14));
    const settle  = 1 - aEase(aSeg(pc, 0.02, 0.14));          /* converge from a scatter as they appear */
    const flow    = (window.__calm ? 0 : 1) * (1 - aEase(aSeg(pc, 0.20, 0.34)));
    const t = now / 1000;
    const drift = baseR * 2.8;                   /* larger, gentler wander = slow "flow" */
    const fly = minWH * 0.13;

    /* every mark fades with the section edges AND the opening field reveal */
    const A = (a) => { ctx.globalAlpha = a * eAlpha * fieldIn; };

    /* transparent — the paper is the BODY background (paper tone), which
       app.jsx crossfades blue→paper as ONE piece on entry. Painting our own
       opaque sheet here was the hard white block that dropped in over the
       still-blue Dex; letting the body show through makes the colour
       transition seamless. */
    ctx.clearRect(0, 0, W, H);

    for (const d of S.dots) {
      const res = d.un < sweep;
      if (d.keep) {
        const i = d.slot, f = K > 1 ? i / (K - 1) : 0;
        /* per-slot staggered snap, top→bottom, with a bounded settle */
        const sLocal = aSeg(pc, 0.52 + f * 0.06, 0.74 + f * 0.06);
        const snapE = aEase(sLocal) + Math.sin(sLocal * Math.PI) * (1 - sLocal) * 0.12;
        let x = d.hx, y = d.hy;
        if (sLocal < 1) {
          x += d.ex * minWH * 0.05 * settle;
          y += d.ey * minWH * 0.05 * settle;
          if (!res && flow > 0) {
            const amp = drift * (0.5 + 0.7 * (1 - d.r2)) * flow;
            const fr = 0.4 + 0.3 * d.r2;
            x += Math.sin(t * fr + d.ph) * amp;
            y += Math.cos(t * fr * 0.85 + d.ph) * amp * 0.85;
          }
        }
        x = aLerp(x, W * 0.5, snapE); y = aLerp(y, S.sy[i], snapE);

        const apex = i === 0;
        /* arrival "tick": a brief radius pop as the dot lands in the spine */
        const land = aClamp((sLocal - 0.85) / 0.15, 0, 1);
        let rad = baseR * (1 + Math.sin(land * Math.PI) * 0.5);
        let al = res ? 1 : 0.5, col = cutInk(1);
        /* the cut CATCHES the chosen — at the instant the blade crosses a
           survivor it pops and a cobalt square-ring pings outward and fades:
           clear feedback that THIS signal was kept. The dot itself stays ink;
           only the apex sustains cobalt into the period (色只在「点」上). */
        if (res) {
          const bump = 1 - aClamp((sweep - d.un) / 0.10, 0, 1);
          if (bump > 0.001) {
            rad = Math.max(rad, baseR * (1 + 1.5 * bump));
            const ringHalf = baseR * (1.9 + 5.2 * (1 - bump));
            A(bump * 0.85);
            ctx.strokeStyle = cutBlue(1); ctx.lineWidth = Math.max(1.2, minWH * 0.0015);
            strokeRoundSq(ctx, x, y, ringHalf, 0);
            ctx.globalAlpha = 1;
          }
        }

        if (apex && (finA > 0 || finR > 0)) {
          const coil = aEase(finA) * (1 - finR);                       /* shrink ~18% before release */
          const rRel = aLerp(baseR, baseR * 3.0, aEase(finR));
          const settleR = Math.sin(finR * Math.PI) * (1 - finR) * 0.10;/* elastic catch on release    */
          const side = rRel * (1 + settleR) * (1 - 0.18 * coil);
          const ignite = aEase(aSeg(pc, 0.86, 0.92));                  /* ink → cobalt, timed to release */
          const cr = Math.round(aLerp(11, 0, ignite)), cg = Math.round(aLerp(11, 71, ignite)), cb = Math.round(aLerp(14, 171, ignite));
          const corner = aLerp(side, 0, aEase(aSeg(pc, 0.86, 0.98)));  /* circle → hard square, late  */
          A(1); cutRoundSq(ctx, x, y, side, corner, `rgba(${cr},${cg},${cb},1)`);
          /* two thin square rings — an ignition bloom, not one fat circle */
          const lw = Math.max(1.2, minWH * 0.0016);
          ctx.strokeStyle = cutBlue(1); ctx.lineWidth = lw;
          const r1 = aEase(aSeg(pc, 0.86, 0.94));
          A((1 - aSeg(pc, 0.86, 0.96)) * 0.9);
          strokeRoundSq(ctx, x, y, aLerp(side * 1.4, minWH * 0.16, r1), aLerp(side, 0, r1));
          const r2 = aEase(aSeg(pc, 0.88, 1.0));
          A((1 - aSeg(pc, 0.88, 1.0)) * 0.4);
          strokeRoundSq(ctx, x, y, aLerp(side * 1.4, minWH * 0.24, r2), 0);
          ctx.globalAlpha = 1;
          continue;
        }
        if (finA > 0 || finR > 0) {
          /* non-apex survivors recede, staggered outward from the period */
          const dimT = aEase(aSeg(pc, 0.80 + f * 0.08, 0.96));
          al = aLerp(al, 0.18, dimT);
          rad = aLerp(rad, baseR * 0.7, dimT);
        }
        A(al); ctx.fillStyle = col;
        ctx.beginPath(); ctx.arc(x, y, rad, 0, 6.2832); ctx.fill();
      } else if (!res) {
        /* weak signals still on the sheet — sized & inked by strength (r2) */
        let x = d.hx, y = d.hy;
        x += d.ex * minWH * 0.05 * settle;
        y += d.ey * minWH * 0.05 * settle;
        if (flow > 0) {
          const amp = drift * (0.5 + 0.7 * (1 - d.r2)) * flow;
          const fr = 0.4 + 0.3 * d.r2;
          x += Math.sin(t * fr + d.ph) * amp;
          y += Math.cos(t * fr * 0.85 + d.ph) * amp * 0.85;
        }
        A(aLerp(0.22, 0.6, d.r2)); ctx.fillStyle = cutInk(1);
        ctx.beginPath(); ctx.arc(x, y, baseR * (0.6 + 0.5 * d.r2), 0, 6.2832); ctx.fill();
      } else {
        /* deleted — torn out along the radial, faster for stronger dots */
        const tt = aClamp((sweep - d.un) / 0.16, 0, 1), k = aEase(tt), a = (1 - tt) * 0.6;
        if (a > 0.001) {
          const flyK = fly * k * (0.7 + 0.6 * d.r2);
          const px = d.hx + d.ex * flyK, py = d.hy + d.ey * flyK;
          A(a); ctx.fillStyle = cutInk(1);
          ctx.beginPath(); ctx.arc(px, py, baseR * (0.6 + 0.5 * d.r2) * (1 - 0.5 * tt), 0, 6.2832); ctx.fill();
          if (tt < 0.3) {   /* velocity streak at the moment of the cut */
            A(a * 0.5 * (1 - tt / 0.3)); ctx.strokeStyle = cutInk(1); ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(d.hx + d.ex * flyK * 0.4, d.hy + d.ey * flyK * 0.4);
            ctx.lineTo(px, py); ctx.stroke();
          }
        }
      }
    }
    ctx.globalAlpha = 1;

    /* (the visible diagonal cut LINE was removed by request — felt like a
       redundant element. The dots still clear along the same diagonal wavefront
       via `d.un < sweep`, so the subtractive "cut" reads without drawing a blade.) */

    /* the priority spine — after the cut, a vertical line TELESCOPES out from
       the lower-middle of the sheet, threading the survivors top→bottom, then
       persists faintly as the axis they hang off. (It grows — it never rotates
       in, and it never just vanishes.) */
    const grow = aEase(aSeg(pc, 0.54, 0.82));
    if (grow > 0.001) {
      const cx = W * 0.5;
      const yTop = S.sy[0] - baseR * 3, yBot = S.sy[K - 1] + baseR * 2;
      const seed = aLerp(yTop, yBot, 0.72);            /* the lower-middle anchor it grows from */
      const fade = aLerp(1, 0.5, aSeg(pc, 0.9, 1.0));
      A(grow * 0.55 * fade); ctx.strokeStyle = cutInk(1); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx, aLerp(seed, yTop, grow)); ctx.lineTo(cx, aLerp(seed, yBot, grow)); ctx.stroke();
      ctx.globalAlpha = 1;
    }

    /* the live decision counter — counts down to the TRUE survivor count,
       then clears before the period lights */
    const capA = 0.62 * (1 - aEase(aSeg(pc, 0.80, 0.88)));
    if (capA > 0.01) {
      const kept = Math.max(1, Math.round(aLerp(1800, K, aEase(aSeg(pc, 0.22, 0.52)))));
      const fs = Math.max(10, Math.min(13, W * 0.0105));
      A(capA); ctx.fillStyle = cutInk(1);
      ctx.font = fs + 'px ui-monospace, "SF Mono", Menlo, monospace';
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.fillText("SIGNALS 1800 · KEPT " + (kept < 10 ? "0" + kept : kept), 40, H - 40);
      ctx.globalAlpha = 1;
    }
  });
  return <canvas ref={ref}></canvas>;
}

Object.assign(window, { AipmCut });
