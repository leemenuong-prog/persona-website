/* ══════════════════════════════════════════════════════════════
   aipm-genesis.jsx — AN AIPM · THE ORIGIN MYTH (cinematic, 滚动驱动)

   一束亮白点如流星般往前飞 → 拖尾收束成一条直线 → 直线缓缓展开成面 →
   面立成正方体（理性的单元）→ 深空中混沌的方块顺流而来、汇聚成序，
   砌出 .IAM. 天际线 → 蓝色句点最后落定。

   Rules of the motion: the camera stays LOCKED on the hero unit
   (the blue square that becomes the period) the whole way, then
   pulls back ONCE at the very end to reveal the full .IAM. mark.
   The meteor's tail collapses into ONE solid continuous line — not
   a blur that pops a line into being — and that same line lights
   cobalt and stretches into the square, then the cube. The eight
   marble bars are the .IAM. rhythm, the blue square is the self /
   the period — and it is our protagonist from the first frame.
   All keyed to window.__progress.aipm (0–1). Pure draw — no layout
   reads in the loop. Reuses art.jsx globals.
   ══════════════════════════════════════════════════════════════ */

/* the .IAM. mark — its eight bars, verbatim */
const GEN_RHY  = [0.97, 0.58, 1.0, 0.66, 0.9, 0.52, 0.74, 1.0];
const GEN_COLS = 8;
const GEN_SX   = 1.0;          /* column pitch          */
const GEN_HB   = 2.45;         /* base bar height       */
const GEN_S    = 0.62;         /* the founding cube half-size */
const GEN_BH   = 0.46;         /* unit-block height (the brick) */
const GEN_PX   = (GEN_COLS - 1) / 2 * GEN_SX + 1.15;   /* the period, right of the mark */

/* self-contained vec3 */
const gsub   = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const gcross = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
const gnorm  = (a) => { const m = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0]/m, a[1]/m, a[2]/m]; };
const GEN_LIGHT = gnorm([-0.42, -0.46, 0.78]);
const GEN_COBALT = [0, 71, 171];     /* the page body color the film blends to */

/* ── the city, pre-computed: every bar is a stack of unit bricks,
   each brick knowing its ordered home AND a deep, scattered origin
   it streams forward from. Deterministic — the film is stable. ── */
const GEN_BLOCKS = (function () {
  const blocks = [];
  const rnd = rng(0x51A7);
  const gap = 0.05, hw = 0.30;
  for (let c = 0; c < GEN_COLS; c++) {
    const x = (c - (GEN_COLS - 1) / 2) * GEN_SX;
    const H = GEN_HB * GEN_RHY[c];
    const n = Math.max(2, Math.round(H / GEN_BH));
    for (let j = 0; j < n; j++) {
      const z0 = j * GEN_BH, z1 = z0 + GEN_BH - gap;
      const ang = rnd() * 6.283, rad = 2.6 + rnd() * 7.5;
      blocks.push({
        x, hw, z0, z1,
        ox: Math.cos(ang) * rad,          /* chaos lateral offset from home */
        oy: 5 + rnd() * 17,               /* chaos depth — streams FORWARD   */
        oz: (rnd() - 0.32) * 6.5,         /* chaos height offset             */
        st: rnd(),                        /* random timing stagger (not positional → no scan) */
        seed: rnd(),
      });
    }
  }
  return blocks;
})();

/* deep-space dust — a parallax starfield the camera flies through */
const GEN_DUST = (function () {
  const d = []; const rnd = rng(0x9E37);
  for (let i = 0; i < 90; i++) {
    d.push({ x: (rnd() - 0.5) * 30, y: 1 + rnd() * 24, z: -3 + rnd() * 13, s: 0.4 + rnd() * 1.1, b: rnd() });
  }
  return d;
})();

function genAtmosphere(ctx, W, H, pc) {
  const lift = aEase(aSeg(pc, 0.10, 0.66));
  const embed = Math.max(1 - aSeg(pc, 0.0, 0.05), aSeg(pc, 0.80, 0.90));
  const mix = (a, b, t) => [Math.round(a[0]+(b[0]-a[0])*t), Math.round(a[1]+(b[1]-a[1])*t), Math.round(a[2]+(b[2]-a[2])*t)];
  const rgb = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
  const top = mix(mix([0, 14, 44],  [0, 44, 116], lift), GEN_COBALT, embed);
  const mid = mix(mix([0, 34, 96],  [0, 71, 171], lift), GEN_COBALT, embed);
  const bot = mix(mix([0, 8,  34],  [0, 30, 88],  lift), GEN_COBALT, embed);
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, rgb(top, 1)); g.addColorStop(0.52, rgb(mid, 1)); g.addColorStop(1, rgb(bot, 1));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  const gh = aSeg(pc, 0.42, 0.66) * (1 - aSeg(pc, 0.92, 1.0)) * (1 - embed);
  if (gh > 0.01) {
    const rg = ctx.createRadialGradient(W*0.5, H*0.78, 0, W*0.5, H*0.78, Math.max(W, H)*0.6);
    rg.addColorStop(0, `rgba(70,130,235,${(0.20*gh).toFixed(3)})`);
    rg.addColorStop(1, 'rgba(70,130,235,0)');
    ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
  }
  const vgA = (0.44 + 0.16*(1-lift)) * (1 - embed);
  if (vgA > 0.005) {
    const vg = ctx.createRadialGradient(W*0.5, H*0.5, Math.min(W, H)*0.26, W*0.5, H*0.5, Math.max(W, H)*0.72);
    vg.addColorStop(0, 'rgba(0,6,24,0)');
    vg.addColorStop(1, `rgba(0,5,20,${vgA.toFixed(3)})`);
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  }
}

function AipmGenesis() {
  const ref = useCanvas((ctx, W, H, now) => {
    let p = window.__progress && window.__progress.aipm;
    p = (p == null) ? 0 : p;
    if (p <= -0.06 || p >= 1.1) { ctx.clearRect(0, 0, W, H); return; }
    const pc = aClamp(p, 0, 1);
    const E = aEase;

    genAtmosphere(ctx, W, H, pc);

    /* ── camera — locked on the hero (the blue unit at the period),
       then ONE pull-back at the end to reveal the whole .IAM. mark.
       Until the reveal the target sits on the hero so it always
       leads frame; the reveal eases the target toward the mark's
       balance point and opens the distance. ── */
    const reveal = E(aSeg(pc, 0.76, 1.0));      /* the final pull-back   */
    const az  = -1.5708 - 0.64 * reveal;
    const el  = aLerp(0.06, 0.30, E(aSeg(pc, 0.34, 1.0)));
    const rho = aLerp(6.4, 14.6, reveal);
    const tgt = [aLerp(GEN_PX, 1.7, reveal), 0, aLerp(GEN_S, 1.05, reveal)];
    const eye = [
      tgt[0] + rho * Math.cos(el) * Math.cos(az),
      tgt[1] + rho * Math.cos(el) * Math.sin(az),
      tgt[2] + rho * Math.sin(el),
    ];
    const f = gnorm(gsub(tgt, eye));
    const rax = gnorm(gcross(f, [0, 0, 1]));
    const uax = gcross(rax, f);
    const focal = Math.min(W * 0.92, H * 1.46);
    const cx = W * 0.5, cy = H * 0.6, near = 0.1;
    const project = (P) => {
      const dx = P[0]-eye[0], dy = P[1]-eye[1], dz = P[2]-eye[2];
      const vz = dx*f[0] + dy*f[1] + dz*f[2];
      if (vz <= near) return null;
      const vx = dx*rax[0] + dy*rax[1] + dz*rax[2];
      const vy = dx*uax[0] + dy*uax[1] + dz*uax[2];
      const sc = focal / vz;
      return [cx + vx*sc, cy - vy*sc, vz];
    };

    /* ── deep-space dust — flown through as scroll advances (parallax,
       not a time loop) ── */
    const dustA = aSeg(pc, 0.0, 0.05) * (1 - aSeg(pc, 0.60, 0.82));
    if (dustA > 0.01) {
      const flow = pc * 13, span = 25;
      for (const d of GEN_DUST) {
        let yy = d.y - flow; yy = ((yy - 1) % span + span) % span + 1;
        const pr = project([d.x, yy, d.z]); if (!pr) continue;
        const sz = aClamp(focal / pr[2] * 0.012 * d.s, 0.4, 3.4);
        const near = aClamp(1 - (pr[2] - 2) / 22, 0.15, 1);
        ctx.globalAlpha = dustA * near * (0.3 + 0.5 * d.b);
        ctx.fillStyle = d.b > 0.6 ? 'rgba(210,228,255,1)' : 'rgba(120,165,240,1)';
        ctx.beginPath(); ctx.arc(pr[0], pr[1], sz, 0, Math.PI*2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    /* ── act amounts (all forward-running) ── */
    /* the protagonist is ONE object: a meteor flies in along the line's
       axis and DRAWS the solid line behind it (the bright tip is always
       the bar's leading edge), then the same bar stands into the square
       and extrudes into the cube. No second system, no gap. */
    const ZC = GEN_S, XL = GEN_PX - GEN_S, XR = GEN_PX + GEN_S;
    const inA   = aSeg(pc, 0.0,  0.11);        /* streak flies to the line's left end   */
    const layA  = aSeg(pc, 0.10, 0.22);        /* then draws the bar, left → right       */
    const headX = layA > 0 ? aLerp(XL, XR, E(layA)) : aLerp(XL - 7.0, XL, E(inA));
    const lineR = aClamp(headX, XL, XR);       /* the solid bar's right edge = the head  */
    const sqA     = E(aSeg(pc, 0.26, 0.44));   /* line → square (grows up, lights blue) */
    const cubeA   = E(aSeg(pc, 0.44, 0.56));   /* square → cube (depth extrudes)        */
    const cityA   = aSeg(pc, 0.50, 0.62);      /* the city bricks fade in               */
    const settleA = E(aSeg(pc, 0.86, 1.0));    /* the period settles, one clean flash   */

    /* ── collect every box face ── */
    const faces = [];
    const pushBox = (bx, by, z0, z1, hx, hy, alpha, tint) => {
      const X0 = bx-hx, X1 = bx+hx, Y0 = by-hy, Y1 = by+hy;
      const quads = [
        { p: [[X0,Y0,z1],[X1,Y0,z1],[X1,Y1,z1],[X0,Y1,z1]], n: [0,0,1] },
        { p: [[X0,Y0,z0],[X1,Y0,z0],[X1,Y0,z1],[X0,Y0,z1]], n: [0,-1,0] },
        { p: [[X1,Y0,z0],[X1,Y1,z0],[X1,Y1,z1],[X1,Y0,z1]], n: [1,0,0] },
        { p: [[X0,Y1,z0],[X0,Y0,z0],[X0,Y0,z1],[X0,Y1,z1]], n: [-1,0,0] },
        { p: [[X1,Y1,z0],[X0,Y1,z0],[X0,Y1,z1],[X1,Y1,z1]], n: [0,1,0] },
      ];
      for (const q of quads) {
        const ccx = (q.p[0][0]+q.p[1][0]+q.p[2][0]+q.p[3][0])/4;
        const ccy = (q.p[0][1]+q.p[1][1]+q.p[2][1]+q.p[3][1])/4;
        const ccz = (q.p[0][2]+q.p[1][2]+q.p[2][2]+q.p[3][2])/4;
        if (q.n[0]*(eye[0]-ccx) + q.n[1]*(eye[1]-ccy) + q.n[2]*(eye[2]-ccz) <= 0) continue;
        const pr = q.p.map(project);
        if (!pr[0] || !pr[1] || !pr[2] || !pr[3]) continue;
        const dep = (pr[0][2]+pr[1][2]+pr[2][2]+pr[3][2]) / 4;
        const lum = aClamp((q.n[0]*GEN_LIGHT[0] + q.n[1]*GEN_LIGHT[1] + q.n[2]*GEN_LIGHT[2]) * 0.5 + 0.5, 0, 1);
        faces.push({ pr, dep, lum, alpha, tint });
      }
    };

    /* the hero — literally the meteor's deposited trail. The bar grows
       from the line's left end out to the head, then stands into the
       blue square and extrudes into the cube. */
    if (lineR > XL + 0.015) {
      const bx = (XL + lineR) / 2;
      const hx = (lineR - XL) / 2;               /* grows with the head            */
      const hz = aLerp(0.05, GEN_S, sqA);        /* line → square (stretches up)   */
      const hy = aLerp(0.05, GEN_S, cubeA);      /* square → cube (extrudes depth) */
      pushBox(bx, 0, ZC - hz, ZC + hz, hx, hy, 1, aClamp(sqA, 0, 1));
    }

    /* the city — bricks stream forward from chaos into the .IAM. skyline */
    if (cityA > 0.002) {
      for (const b of GEN_BLOCKS) {
        const bA = E(aSeg(pc, 0.50 + b.st * 0.16, 0.74 + b.st * 0.16));
        const bx = aLerp(b.x + b.ox, b.x, bA);
        const by = aLerp(b.oy, 0, bA);
        const z0 = aLerp(b.z0 + b.oz, b.z0, bA);
        const z1 = aLerp(b.z1 + b.oz, b.z1, bA);
        pushBox(bx, by, z0, Math.max(z1, z0 + 0.02), b.hw, b.hw, aClamp(cityA, 0, 1), 0);
      }
    }

    /* ── paint, far → near, with aerial fog into the atmosphere. tint 0 =
       marble white, tint 1 = cobalt — the hero blends white→blue as the
       square forms, so there is no colour pop. ── */
    faces.sort((a, b) => b.dep - a.dep);
    for (const fc of faces) {
      ctx.globalAlpha = fc.alpha;
      ctx.beginPath();
      fc.pr.forEach((pp, i) => (i ? ctx.lineTo(pp[0], pp[1]) : ctx.moveTo(pp[0], pp[1])));
      ctx.closePath();
      const fog = aClamp((fc.dep - 6) / 28, 0, 0.85);
      const t = fc.tint || 0;
      const mv = aLerp(150, 244, fc.lum);          /* marble lit value */
      const cv = aLerp(50, 150, fc.lum);           /* cobalt lit value */
      const br = aLerp(mv,     cv * 0.22,      t);
      const bg = aLerp(mv - 3, cv * 0.85,      t);
      const bb = aLerp(mv - 9, 168 + cv * 0.5, t);
      ctx.fillStyle = `rgb(${Math.round(aLerp(br, aLerp(8,18,t), fog))},${Math.round(aLerp(bg, aLerp(56,70,t), fog))},${Math.round(aLerp(bb, aLerp(132,175,t), fog))})`;
      ctx.fill();
      ctx.lineWidth = aLerp(1, 1.4, t);
      const sa = aLerp(0.22, 0.85, t) * fc.alpha * (1 - fog);
      ctx.strokeStyle = `rgba(${Math.round(aLerp(235,150,t))},${Math.round(aLerp(238,190,t))},${Math.round(aLerp(245,255,t))},${sa.toFixed(3)})`;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    /* ── the meteor — the bright tip that DRAWS the line. It rides the
       line's own axis; its hot streak trails back over the bar it has
       just laid, and the head dissolves into the bar's leading edge.
       Head and line are the same motion — never two objects. ── */
    const headFade = 1 - aSeg(pc, 0.185, 0.235);
    if (headFade > 0.01 && inA > 0) {
      const SP = Math.min(W, H) / 900;
      const hp = project([headX, 0, ZC]);
      if (hp) {
        /* hot streak trailing the head, tapering to nothing — it lies
           exactly over the bar the head has drawn, so they read as one */
        const span = aLerp(4.6, 1.4, E(Math.max(inA, layA)));
        const N = 9;
        for (let k = N; k >= 1; k--) {
          const f0 = k / N, f1 = (k - 1) / N;
          const a = project([headX - span * f0, 0, ZC]);
          const b = project([headX - span * f1, 0, ZC]);
          if (!a || !b) continue;
          ctx.strokeStyle = `rgba(232,242,255,${((1 - f0) * 0.85 * headFade).toFixed(3)})`;
          ctx.lineWidth = aLerp(0.8, 5.0 * SP, 1 - f0);
          ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
        }
        /* head glow */
        const R = (9 + 22 * (1 - E(layA))) * SP;
        const rg = ctx.createRadialGradient(hp[0], hp[1], 0, hp[0], hp[1], R * 3.2);
        rg.addColorStop(0,   `rgba(255,255,255,${(0.95 * headFade).toFixed(3)})`);
        rg.addColorStop(0.3, `rgba(205,226,255,${(0.5 * headFade).toFixed(3)})`);
        rg.addColorStop(1,   'rgba(120,170,255,0)');
        ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(hp[0], hp[1], R * 3.2, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${(0.95 * headFade).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(hp[0], hp[1], 2.4 * SP + 1, 0, Math.PI*2); ctx.fill();
      }
    }

    /* ── the landing — the period settles, one clean flash ── */
    if (settleA > 0.01 && settleA < 1) {
      const lc = project([GEN_PX, 0, GEN_S]);
      if (lc) {
        const rad = E(settleA) * Math.min(W, H) * 0.30;
        ctx.globalAlpha = (1 - settleA) * 0.8;
        ctx.strokeStyle = 'rgba(150,195,255,0.95)'; ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.arc(lc[0], lc[1], rad, 0, Math.PI*2); ctx.stroke();
        ctx.globalAlpha = 1;
        const hg = ctx.createRadialGradient(lc[0], lc[1], 0, lc[0], lc[1], 90 * (Math.min(W,H)/900));
        hg.addColorStop(0, `rgba(90,150,255,${(0.4*settleA).toFixed(3)})`);
        hg.addColorStop(1, 'rgba(60,120,240,0)');
        ctx.fillStyle = hg; ctx.fillRect(0, 0, W, H);
      }
    }
  });
  return <canvas ref={ref}></canvas>;
}

Object.assign(window, { AipmGenesis });
