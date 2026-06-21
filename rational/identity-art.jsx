/* ══════════════════════════════════════════════════════════════
   identity-art.jsx — the two reworked identity canvases, in ONE
   language: a rectangle is the only primitive, the blue square is
   "the self / the period".

   · OrderPlane2D  — AN AIPM     · 平面 (flat 2D, top-down)
       ink data-tiles fall from chaos into an ordered lattice.

   · SiteForm3D    — AN ARCHITECT · 场 (logo → 3D temple)
       a Doric OCTASTYLE temple whose eight columns are BORN FROM THE
       LOGO: the mark's eight ink bars (its skyline rhythm) align in
       height, spread onto the column axes and rise into a colonnade; then
       the plan rotates and the camera lifts into a top-down
       AXONOMETRIC (parallel) view as the line drawing EXTRUDES into a
       full three-dimensional temple that fills and shades. Built entirely from boxes
       (every step, column, beam is a rectangle); the pediment is
       the one triangle; the cobalt square is the self at the
       threshold. Reads window.__progress.architect (0–1).

   Both read window.__progress[id] (0–1, scroll-driven). Pure draw,
   no layout reads in the loop. aSeg/aEase/rng/useCanvas are global
   (declared in art.jsx; classic scripts share global scope).
   ══════════════════════════════════════════════════════════════ */

const { useRef: useIaRef, useEffect: useIaEffect } = React;

/* ════════════════════════════════════════════════════════════
   02 · AN AIPM — CINEMATIC ASCENT · 点 → 线 → Logo → 体
   On cobalt: a paper self-line among ink data-lines (the .IAM. mark).
   A moving PERSPECTIVE camera: see the point · dolly into the line ·
   pull back to the logo · orbit into the body.
   ════════════════════════════════════════════════════════════ */
/* the logo's skyline rhythm — the eight bars of the .IAM. mark. Reused
   verbatim as the bar heights (线), and as the city's massing (体). */
const PLANE_RHY = [0.97, 0.58, 1.0, 0.66, 0.9, 0.52, 0.74, 1.0];

/* ── the field of data-bars, precomputed once (stable) ──────────
   Each cell knows three destinies it cycles between:
     · POINT    — collapsed at the origin (the self / the period)
     · CHAOS    — a scattered, floating, jittering position + random height
     · ORDERED  — a clean lattice cell, height = the .IAM skyline rhythm
   The animation loops POINT → CHAOS → (wave) → ORDERED → POINT … */
const A_COLS = 7, A_ROWS = 7, A_S = 0.94, A_HB = 2.7;
const A_DEPTHC = (A_ROWS - 1) * A_S / 2;     /* depth centre — the camera target */
const PLANE_CELLS = (function () {
  const cells = [];
  const rnd = rng(0x51A1);
  for (let row = 0; row < A_ROWS; row++) {
    for (let col = 0; col < A_COLS; col++) {
      const gx = (col - (A_COLS - 1) / 2) * A_S;       /* ordered x (centred) */
      const gy = row * A_S;                            /* ordered depth 0..+ */
      const ordH = A_HB * (0.34 + 0.66 * PLANE_RHY[col % 8]) * (0.6 + 0.4 * PLANE_RHY[(col * 2 + row * 3) % 8]);
      const ang = rnd() * Math.PI * 2, rad = 0.7 + rnd() * 1.5;
      cells.push({
        gx, gy, ordH,
        ox: Math.cos(ang) * rad * A_S * 1.5,            /* chaos lateral offset */
        oy: (rnd() - 0.5) * A_S * 3.4,                  /* chaos depth offset   */
        cz: 0.3 + rnd() * 2.5,                          /* chaos float height   */
        chH: A_HB * (0.12 + rnd() * 1.25),              /* chaos random height  */
        ph: rnd() * Math.PI * 2,                        /* per-cell churn phase */
        nx: A_COLS < 2 ? 0 : col / (A_COLS - 1),        /* 0..1 along the wave  */
      });
    }
  }
  return cells;
})();

/* camera keyframes through one cycle — first == last for a seamless loop.
   az/el orbit around [0, A_DEPTHC, tz]; rho is the dolly distance.
   The big rho swings (close→far→close) are what make the viewpoint HIT. */
const A_KF = [
  { t: 0.00, az: -1.28, el: 0.10, rho: 4.2,  tz: 0.30 },  /* on the point   */
  { t: 0.30, az: -2.45, el: 0.46, rho: 13.5, tz: 1.25 },  /* high & back — the whole scattered cloud floats in frame */
  { t: 0.55, az: -1.50, el: 0.27, rho: 13.0, tz: 1.35 },  /* side 3/4 — watch the wave sweep */
  { t: 0.70, az: -0.92, el: 0.55, rho: 11.6, tz: 1.10 },  /* high — the ordered lattice */
  { t: 0.88, az: -1.22, el: 0.16, rho: 3.6,  tz: 0.42 },  /* pushing IN to the point */
  { t: 1.00, az: -1.28, el: 0.10, rho: 4.2,  tz: 0.30 },
];

function OrderPlane2D() {
  const ref = useCanvas((ctx, W, H, now) => {
    let p = (window.__progress && window.__progress.aipm) || 0;
    if (p <= 0 || p >= 1.08) { ctx.clearRect(0, 0, W, H); return; }
    ctx.clearRect(0, 0, W, H);
    const E = aEase, calm = window.__calm ? 0.5 : 1;
    const vis = aSeg(p, 0.0, 0.05) * (1 - aSeg(p, 0.97, 1.06));   /* fade with the chapter */
    const lerp3 = (a, b, t) => [aLerp(a[0], b[0], t), aLerp(a[1], b[1], t), aLerp(a[2], b[2], t)];

    /* ── the cycle clock — POINT → 无规则的体 → 强波 → 整齐 → 一个点 → …
       runs on its own time so the whole arc reads as a LOOP (循环). */
    const PERIOD = window.__calm ? 17000 : 11500;
    const u = window.__aipmU != null ? window.__aipmU : ((now % PERIOD) + PERIOD) % PERIOD / PERIOD;

    const bloom    = E(aSeg(u, 0.05, 0.34));   /* point → scattered chaotic volume */
    const waveF    = aSeg(u, 0.45, 0.66);      /* the strong wave's leading front  */
    const gridV    = E(aSeg(u, 0.50, 0.68)) * (1 - E(aSeg(u, 0.78, 0.92)));
    const collapse = E(aSeg(u, 0.74, 0.93));   /* ordered body → one point         */
    const ringP    = aSeg(u, 0.88, 1.0);       /* the point pulses — the loop turns */

    /* ── moving PERSPECTIVE camera — keyframe-blended, big dolly swings ── */
    let kf = A_KF[0], kn = A_KF[1];
    for (let k = 0; k < A_KF.length - 1; k++) {
      if (u >= A_KF[k].t && u <= A_KF[k + 1].t) { kf = A_KF[k]; kn = A_KF[k + 1]; break; }
    }
    const kt = E(aSeg(u, kf.t, kn.t));
    const az  = aLerp(kf.az, kn.az, kt) + Math.sin(now / 7000) * 0.05 * calm;
    const el  = aLerp(kf.el, kn.el, kt) + Math.sin(now / 9000) * 0.025 * calm;
    const rho = aLerp(kf.rho, kn.rho, kt);
    const tz  = aLerp(kf.tz, kn.tz, kt);
    const tgt = [0, A_DEPTHC, tz];
    const eye = [
      tgt[0] + rho * Math.cos(el) * Math.cos(az),
      tgt[1] + rho * Math.cos(el) * Math.sin(az),
      tgt[2] + rho * Math.sin(el),
    ];

    /* ── perspective basis (the eye genuinely moves) ── */
    const f = v3norm(v3sub(tgt, eye));
    const r = v3norm(v3cross(f, [0, 0, 1]));
    const uax = v3cross(r, f);
    const focal = Math.min(W * 0.96, H * 1.52);
    const cx = W * 0.5, cy = H * 0.58, near = 0.12;
    const project = (P) => {
      const dx = P[0] - eye[0], dy = P[1] - eye[1], dz = P[2] - eye[2];
      const vz = dx * f[0] + dy * f[1] + dz * f[2];
      if (vz <= near) return null;
      const vx = dx * r[0] + dy * r[1] + dz * r[2];
      const vy = dx * uax[0] + dy * uax[1] + dz * uax[2];
      const sc = focal / vz;
      return [cx + vx * sc, cy - vy * sc, vz];
    };
    const paper = (a) => 'rgba(239,236,230,' + (a * vis).toFixed(3) + ')';
    const LIGHT = v3norm([-0.42, -0.5, 0.74]);

    /* ── faint lattice floor — appears as the wave brings order ── */
    if (gridV > 0.01) {
      ctx.lineWidth = 1; ctx.strokeStyle = paper(0.06 * gridV);
      const x0 = -(A_COLS / 2) * A_S, x1 = (A_COLS / 2) * A_S;
      const y0 = -A_S, y1 = (A_ROWS - 1) * A_S + A_S;
      for (let gi = 0; gi <= A_COLS; gi++) {
        const gx = x0 + gi * A_S;
        const a = project([gx, y0, 0]), b = project([gx, y1, 0]);
        if (a && b) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
      }
      for (let gj = 0; gj <= A_ROWS; gj++) {
        const gy = -A_S / 2 + gj * A_S;
        const a = project([x0, gy, 0]), b = project([x1, gy, 0]);
        if (a && b) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
      }
    }

    /* ── box collector (5 faces, bottom skipped; back-face culled) ── */
    const faces = [];
    const pushBox = (bx, by, z0, z1, hw, kind, alpha) => {
      const X0 = bx - hw, X1 = bx + hw, Y0 = by - hw, Y1 = by + hw;
      const quads = [
        { p: [[X0, Y0, z1], [X1, Y0, z1], [X1, Y1, z1], [X0, Y1, z1]], n: [0, 0, 1] },
        { p: [[X0, Y0, z0], [X1, Y0, z0], [X1, Y0, z1], [X0, Y0, z1]], n: [0, -1, 0] },
        { p: [[X1, Y0, z0], [X1, Y1, z0], [X1, Y1, z1], [X1, Y0, z1]], n: [1, 0, 0] },
        { p: [[X0, Y1, z0], [X0, Y0, z0], [X0, Y0, z1], [X0, Y1, z1]], n: [-1, 0, 0] },
        { p: [[X1, Y1, z0], [X0, Y1, z0], [X0, Y1, z1], [X1, Y1, z1]], n: [0, 1, 0] },
      ];
      for (const q of quads) {
        const ccx = (q.p[0][0] + q.p[1][0] + q.p[2][0] + q.p[3][0]) / 4;
        const ccy = (q.p[0][1] + q.p[1][1] + q.p[2][1] + q.p[3][1]) / 4;
        const ccz = (q.p[0][2] + q.p[1][2] + q.p[2][2] + q.p[3][2]) / 4;
        const tex = eye[0] - ccx, tey = eye[1] - ccy, tez = eye[2] - ccz;
        if (q.n[0] * tex + q.n[1] * tey + q.n[2] * tez <= 0) continue;   /* cull back faces */
        const pr = q.p.map(project);
        if (!pr[0] || !pr[1] || !pr[2] || !pr[3]) continue;
        const dep = (pr[0][2] + pr[1][2] + pr[2][2] + pr[3][2]) / 4;
        const lum = aClamp((q.n[0] * LIGHT[0] + q.n[1] * LIGHT[1] + q.n[2] * LIGHT[2]) * 0.5 + 0.5, 0, 1);
        faces.push({ pr, dep, lum, kind, alpha });
      }
    };

    /* ── the field — every bar cycles point → chaos → order → point ── */
    const band = 0.26;
    const front = waveF * (1 + band);          /* sweeps past nx = 0 → 1 */
    for (const c of PLANE_CELLS) {
      /* per-bar order amount — the wave snaps each bar as the front passes it */
      const order = E(aClamp((front - c.nx) / band, 0, 1));
      const churn = bloom * (1 - order) * (1 - collapse);

      /* point → chaos */
      let x  = aLerp(0, c.gx + c.ox, bloom);
      let y  = aLerp(A_DEPTHC, c.gy + c.oy, bloom);
      let z0 = aLerp(0, c.cz, bloom);
      let h  = aLerp(0.02, c.chH, bloom);
      let hw = aLerp(0.05, 0.30, bloom);
      /* chaos → ordered (the wave) */
      x  = aLerp(x, c.gx, order);
      y  = aLerp(y, c.gy, order);
      z0 = aLerp(z0, 0, order);
      h  = aLerp(h, c.ordH, order);
      hw = aLerp(hw, 0.30, order);
      h += Math.sin(order * Math.PI) * A_HB * 0.5;     /* wave overshoot — bars snap to attention */
      /* ordered → point */
      x  = aLerp(x, 0, collapse);
      y  = aLerp(y, A_DEPTHC, collapse);
      z0 = aLerp(z0, 0, collapse);
      h  = aLerp(h, 0.02, collapse);
      hw = aLerp(hw, 0.05, collapse);
      /* chaotic churn — only while the volume is disordered */
      if (churn > 0.01) {
        x  += Math.sin(now / 900 + c.ph) * 0.12 * churn * calm;
        y  += Math.cos(now / 1080 + c.ph * 1.7) * 0.12 * churn * calm;
        z0 += Math.sin(now / 1280 + c.ph) * 0.16 * churn * calm;
        h  *= 1 + Math.sin(now / 700 + c.ph) * 0.12 * churn * calm;
      }
      const alpha = aSeg(bloom, 0, 0.22) * (1 - aSeg(collapse, 0.55, 1));
      if (alpha <= 0.01) continue;
      pushBox(x, y, z0, z0 + Math.max(h, 0.02), hw, 'data', alpha);
    }

    /* paint — painter's sort, far → near */
    faces.sort((a, b) => b.dep - a.dep);
    for (const fc of faces) {
      ctx.globalAlpha = fc.alpha * vis;
      ctx.beginPath();
      fc.pr.forEach((pp, i) => (i ? ctx.lineTo(pp[0], pp[1]) : ctx.moveTo(pp[0], pp[1])));
      ctx.closePath();
      const v = Math.round(aLerp(150, 239, fc.lum));   /* paper bars, shaded */
      ctx.fillStyle = 'rgb(' + v + ',' + (v - 3) + ',' + (v - 9) + ')';
      ctx.fill();
      ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(239,236,230,' + (0.22 * fc.alpha * vis).toFixed(3) + ')'; ctx.stroke();
    }
    ctx.globalAlpha = 1;

    /* ── 强波 · the wave plane — a bright sheet sweeping across the field ── */
    const waveVis = Math.sin(aClamp(waveF, 0, 1) * Math.PI);
    if (waveVis > 0.02) {
      const fx = aLerp(-(A_COLS / 2 + 0.6) * A_S, (A_COLS / 2 + 0.6) * A_S, waveF);
      const yA = -A_S * 1.4, yB = (A_ROWS - 1) * A_S + A_S * 1.4, zTop = A_HB * 1.7;
      const q = [[fx, yA, 0], [fx, yB, 0], [fx, yB, zTop], [fx, yA, zTop]].map(project);
      if (q[0] && q[1] && q[2] && q[3]) {
        const g = ctx.createLinearGradient(q[0][0], q[0][1], q[2][0], q[2][1]);
        g.addColorStop(0, 'rgba(239,236,230,' + (0.30 * waveVis * vis).toFixed(3) + ')');
        g.addColorStop(1, 'rgba(122,158,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); q.forEach((pp, i) => (i ? ctx.lineTo(pp[0], pp[1]) : ctx.moveTo(pp[0], pp[1]))); ctx.closePath(); ctx.fill();
        /* the luminous leading edge */
        ctx.strokeStyle = 'rgba(239,236,230,' + (0.85 * waveVis * vis).toFixed(3) + ')';
        ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(q[0][0], q[0][1]); ctx.lineTo(q[3][0], q[3][1]); ctx.stroke();
      }
    }

    /* ── the blue period — the self · the point the body resolves into ── */
    const pointPres = Math.max(1 - aSeg(bloom, 0, 0.3), collapse);
    if (pointPres > 0.01) {
      const hs = 0.16 + 0.10 * pointPres;
      const sq = [[-hs, A_DEPTHC - hs, 0.02], [hs, A_DEPTHC - hs, 0.02], [hs, A_DEPTHC + hs, 0.02], [-hs, A_DEPTHC + hs, 0.02]].map(project);
      if (sq[0] && sq[1] && sq[2] && sq[3]) {
        ctx.globalAlpha = pointPres * vis;
        ctx.beginPath(); sq.forEach((pp, i) => (i ? ctx.lineTo(pp[0], pp[1]) : ctx.moveTo(pp[0], pp[1]))); ctx.closePath();
        ctx.fillStyle = 'rgb(0,42,102)'; ctx.fill();
        ctx.lineWidth = 1.4; ctx.strokeStyle = paper(0.7 / vis); ctx.stroke();
        ctx.globalAlpha = 1;
        /* the loop turns — a ring pulses out from the point, seeding the next bloom */
        if (ringP > 0.01) {
          const ctr = project([0, A_DEPTHC, 0.02]);
          if (ctr) {
            const rad = aLerp(4, 130, ringP);
            ctx.globalAlpha = (1 - ringP) * vis;
            ctx.strokeStyle = 'rgba(122,158,255,0.9)'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(ctr[0], ctr[1], rad, 0, Math.PI * 2); ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
    }
  });
  return <canvas ref={ref}></canvas>;
}

/* ════════════════════════════════════════════════════════════
   04 · AN ARCHITECT — THE TEMPLE · 场 (front elevation → 3D)
   ════════════════════════════════════════════════════════════ */

/* ── vector helpers ─────────────────────────────────────────── */
const v3sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const v3cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const v3dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const v3norm = (a) => { const m = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / m, a[1] / m, a[2] / m]; };

/* ── temple geometry — built ONCE into a flat face list ──────
   model space: x = width (across the facade), y = depth (into the
   scene), z = up. The camera sits on +y looking toward −y, so at
   azimuth 0 we read the x-z plane: a pure front elevation. Every
   stone is a box (5 visible faces, bottom skipped); the two gables
   are single triangles; the roof is two quads. */
const TPL = (function buildTemple() {
  const F = [];
  const COLS = 8, ROWS = 13, SX = 1.0, SY = 1.0;
  const HX = (COLS - 1) * SX / 2;     /* 3.5  — half front width  */
  const HY = (ROWS - 1) * SY / 2;     /* 6.0  — half depth (peripteral 8×13) */

  const zS1 = 0.24, zS2 = 0.47, zStylo = 0.70;   /* three steps */
  const colH = 3.05, capH = 0.22;
  const colTop = zStylo + colH;       /* 3.75 */
  const abTop = colTop + capH;        /* 3.97 — top of abacus */
  const archH = 0.44, friezeH = 0.54, cornH = 0.26;
  const archTop = abTop + archH;      /* 4.41 */
  const friezeTop = archTop + friezeH;/* 4.95 */
  const eaveZ = friezeTop + cornH;    /* 5.21 */
  const pedH = 1.05;
  const apexZ = eaveZ + pedH;         /* 6.26 */

  const CENTER = [0, 0, (zStylo + eaveZ) / 2];

  const mkFace = (pts, kind, opts) => {
    let n = v3cross(v3sub(pts[1], pts[0]), v3sub(pts[2], pts[0]));
    const c = pts.reduce((a, q) => [a[0] + q[0], a[1] + q[1], a[2] + q[2]], [0, 0, 0]).map((v) => v / pts.length);
    if (v3dot(n, v3sub(c, CENTER)) < 0) n = [-n[0], -n[1], -n[2]];
    return { pts, n: v3norm(n), c, kind, ...(opts || {}) };
  };
  /* a box → 5 faces (bottom skipped); corners always [bl, br, tr, tl] */
  const box = (cx, cy, z0, z1, hx, hy, kind, opts) => {
    const x0 = cx - hx, x1 = cx + hx, y0 = cy - hy, y1 = cy + hy;
    const P = (x, y, z) => [x, y, z];
    const faces = [
      [P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)], // +y front
      [P(x1, y0, z0), P(x0, y0, z0), P(x0, y0, z1), P(x1, y0, z1)], // -y back
      [P(x1, y1, z0), P(x1, y0, z0), P(x1, y0, z1), P(x1, y1, z1)], // +x right
      [P(x0, y0, z0), P(x0, y1, z0), P(x0, y1, z1), P(x0, y0, z1)], // -x left
    ];
    /* +z top — skipped for pieces whose top is flush under the piece above
       (entablature under the roof); a single big slab's top face would have
       high-depth front cells that paint over the roof/cornice that covers it. */
    if (!(opts && opts.noTop)) faces.push([P(x0, y1, z1), P(x1, y1, z1), P(x1, y0, z1), P(x0, y0, z1)]);
    faces.forEach((pts) => F.push(mkFace(pts, kind, opts)));
  };
  /* a long horizontal slab split into per-bay slices along the depth (y)
     axis. one big slab has a single centroid the painter's sort places in
     the MIDDLE of the colonnade, so it mis-occludes the far columns; per-bay
     slices interleave correctly (and the faint seam edges read as coursing). */
  const boxSeg = (z0, z1, hx, hy, kind, makeOpts) => {
    const seg = Math.max(1, Math.round((hy * 2) / SY));
    const sHY = hy / seg;
    for (let s = 0; s < seg; s++) {
      const cy = -hy + sHY * (2 * s + 1);
      box(0, cy, z0, z1, hx, sHY, kind, makeOpts ? makeOpts(sHY, cy) : null);
    }
  };

  /* a closed solid split into a grid of cells (both x and y) so every
     visible face has a LOCAL centroid — a single big box has one centroid
     that beats the perimeter columns in the depth sort and paints over
     them. used for the cella, which sits behind the colonnade. */
  const boxGrid = (z0, z1, hx, hy, kind) => {
    const nx = Math.max(1, Math.round((hx * 2) / 1.6));
    const ny = Math.max(1, Math.round((hy * 2) / 1.6));
    const sx = hx / nx, sy = hy / ny;
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
      box(-hx + sx * (2 * i + 1), -hy + sy * (2 * j + 1), z0, z1, sx, sy, kind);
    }
  };

  /* crepidoma — three receding steps (sliced per bay for correct depth order) */
  boxSeg(0.00, zS1, HX + 1.15, HY + 1.15, "step");
  boxSeg(zS1, zS2, HX + 0.85, HY + 0.85, "step");
  boxSeg(zS2, zStylo, HX + 0.55, HY + 0.55, "stylo");

  /* cella — the inner naos wall, glimpsed through the colonnade. drawn in
     its own EARLY layer (see the render's layered sort) so the colonnade and
     roof always occlude it; grid-sliced only for masonry coursing. */
  boxGrid(zStylo, colTop, HX - 0.62, HY - 0.85, "cella");

  /* peripteral colonnade — perimeter ring only */
  const ring = [];
  for (let i = 0; i < COLS; i++) { const x = -HX + i * SX; ring.push([x, HY]); ring.push([x, -HY]); }
  for (let j = 1; j < ROWS - 1; j++) { const y = -HY + j * SY; ring.push([-HX, y]); ring.push([HX, y]); }
  ring.forEach(([x, y], idx) => {
    box(x, y, zStylo, colTop, 0.16, 0.16, "col", { col: idx });
    box(x, y, colTop, abTop, 0.235, 0.235, "cap", { col: idx });  /* abacus */
  });

  /* entablature — architrave + Doric frieze (triglyphs drawn in paint),
     sliced per bay like the steps so they sort against the colonnade. tops
     are skipped — each course is capped by the wider one above (and the
     cornice by the roof), so their top faces are never seen and must not
     win the depth sort over the roof that covers them. */
  boxSeg(abTop, archTop, HX + 0.30, HY + 0.30, "arch", () => ({ noTop: true }));
  boxSeg(archTop, friezeTop, HX + 0.30, HY + 0.30, "frieze", (sHY) => ({ fw: HX + 0.30, fd: sHY, noTop: true }));
  boxSeg(friezeTop, eaveZ, HX + 0.56, HY + 0.56, "corn", () => ({ noTop: true }));  /* oversailing cornice */

  /* the pediments + roof — the one classical triangle. two single roof
     quads (NOT sliced): the painter sort draws the far −x slope, then the
     near +x slope on top, which is exactly right; slicing them along the
     depth let near segments of one slope paint over far segments of the
     other near the ridge. */
  const PW = HX + 0.56, PY = HY + 0.56, cz = eaveZ;
  F.push(mkFace([[-PW, PY, cz], [PW, PY, cz], [0, PY, apexZ]], "ped"));     // front gable
  F.push(mkFace([[PW, -PY, cz], [-PW, -PY, cz], [0, -PY, apexZ]], "ped"));  // back gable
  F.push(mkFace([[0, PY, apexZ], [0, -PY, apexZ], [PW, -PY, cz], [PW, PY, cz]], "roof")); // +x slope
  F.push(mkFace([[0, PY, apexZ], [-PW, PY, cz], [-PW, -PY, cz], [0, -PY, apexZ]], "roof")); // -x slope

  /* unique edge list — for the "drawn by hand" line animation. ordered
     bottom → top (then left → right) so the elevation builds up from the
     ground: steps, then columns rising, then entablature, then the gable. */
  const edges = [];
  const seen = new Set();
  const rnd = (v) => Math.round(v * 100) / 100;
  const ek = (a, b) => {
    const ka = `${rnd(a[0])},${rnd(a[1])},${rnd(a[2])}`;
    const kb = `${rnd(b[0])},${rnd(b[1])},${rnd(b[2])}`;
    return ka < kb ? ka + "|" + kb : kb + "|" + ka;
  };
  for (const f of F) {
    const n = f.pts.length;
    for (let i = 0; i < n; i++) {
      const a = f.pts[i], b = f.pts[(i + 1) % n];
      const k = ek(a, b);
      if (seen.has(k)) continue;
      seen.add(k);
      edges.push({ a, b, zmid: (a[2] + b[2]) / 2, xmid: (a[0] + b[0]) / 2 });
    }
  }
  edges.sort((e1, e2) => (e1.zmid - e2.zmid) || (e1.xmid - e2.xmid));

  /* structure-only edge list — everything that is NOT a column shaft or
     capital (steps · cella · entablature · gable). The opening morph
     sketches these in behind the rising colonnade, same bottom-up order. */
  const structEdges = [];
  const seenS = new Set();
  for (const f of F) {
    if (f.kind === "col" || f.kind === "cap") continue;
    const n = f.pts.length;
    for (let i = 0; i < n; i++) {
      const a = f.pts[i], b = f.pts[(i + 1) % n];
      const k = ek(a, b);
      if (seenS.has(k)) continue;
      seenS.add(k);
      structEdges.push({ a, b, zmid: (a[2] + b[2]) / 2, xmid: (a[0] + b[0]) / 2 });
    }
  }
  structEdges.sort((e1, e2) => (e1.zmid - e2.zmid) || (e1.xmid - e2.xmid));

  return { F, edges, structEdges, HX, HY, SX, COLS, zStylo, colTop, abTop, eaveZ, apexZ, archTop, friezeTop, CENTER };
})();

const T_LIGHT = v3norm([-0.42, 0.58, 0.70]);   /* upper-front-left */
/* the logo's skyline rhythm — the eight bars of the .IAM. mark, used
   verbatim as the uneven starting heights of the eight columns. */
const ARC_RHYTHM = [0.97, 0.58, 1.0, 0.66, 0.9, 0.52, 0.74, 1.0];

function SiteForm3D() {
  const simR = useIaRef(null);
  if (!simR.current) simR.current = { mx: 0, my: 0, tmx: 0, tmy: 0, last: 0 };

  /* pointer parallax — a gentle live camera nudge once it's 3D */
  useIaEffect(() => {
    const S = simR.current;
    const mv = (e) => { S.tmx = e.clientX / innerWidth - 0.5; S.tmy = e.clientY / innerHeight - 0.5; };
    addEventListener("pointermove", mv, { passive: true });
    return () => removeEventListener("pointermove", mv);
  }, []);

  const ref = useCanvas((ctx, W, H, now) => {
    const S = simR.current;
    let p = (window.__progress && window.__progress.architect) || 0;
    if (p <= 0) { ctx.clearRect(0, 0, W, H); S.last = now; return; }
    if (p > 1) p = 1;
    const dt = Math.min(Math.max((now - S.last) / 1000, 0), 0.05); S.last = now;
    ctx.clearRect(0, 0, W, H);
    const calm = window.__calm ? 0.35 : 1;

    const paper = (a) => `rgba(239,236,230,${a.toFixed(3)})`;
    const blu = (a) => `rgba(43,95,222,${a.toFixed(3)})`;
    const bluep = (a) => `rgba(120,158,255,${a.toFixed(3)})`;

    /* ── morph phases ──────────────────────────────────────────
       (logo) : the mark's eight bars align in height + rise into columns
       turn   : the plan rotates and the camera lifts to a top-down
                AXONOMETRIC (parallel, no perspective) — looking down
       solid  : the line drawing fills into shaded stone
       self   : the cobalt block arrives at the threshold        */
    const turn = aEase(aSeg(p, 0.32, 0.70));
    const lift = aEase(aSeg(p, 0.32, 0.70));
    const solid = aEase(aSeg(p, 0.44, 0.78));
    const groundV = aEase(aSeg(p, 0.46, 0.80));
    const selfV = aEase(aSeg(p, 0.82, 0.97));

    /* live drift + pointer parallax, only once the form is 3D */
    const live = aSeg(p, 0.62, 0.82);
    S.mx += (S.tmx - S.mx) * Math.min(1, dt * 3);
    S.my += (S.tmy - S.my) * Math.min(1, dt * 3);
    const idle = Math.sin(now / 6800) * 0.014 * calm * live;
    /* target axonometric: ~36° azimuth, ~30° looking-down elevation */
    const az = turn * 0.63 + (S.mx * 0.10 + idle) * calm * live;
    const el = lift * 0.52 + (S.my * 0.05) * calm * live;
    const cosAz = Math.cos(az), sinAz = Math.sin(az);
    const cosEl = Math.cos(el), sinEl = Math.sin(el);

    /* ── axonometric (parallel) camera ──────────────────────────
       The eye orbits to azimuth az and rises to elevation el ABOVE the
       horizon, looking down at the temple. PARALLEL projection (no
       perspective) — a true architectural axonometric. At az=el=0 the
       basis collapses to a flat front elevation (screen-x = x, up = z). */
    const D = [cosEl * sinAz, cosEl * cosAz, sinEl];      /* toward the eye */
    const F = [-D[0], -D[1], -D[2]];                      /* view forward   */
    const R = v3norm(v3cross([0, 0, 1], F));              /* screen right   */
    const U = v3cross(F, R);                              /* screen up      */
    const C = TPL.CENTER, cR = v3dot(C, R), cU = v3dot(C, U);
    const SC = Math.min(W * 0.039, H * 0.066);
    const shift = aEase(aSeg(p, 0.32, 0.80));
    const cx = W * (0.50 + 0.030 * shift);
    const cy = H * (0.50 + 0.045 * shift);
    const project = (x, y, z) => {
      const pr = x * R[0] + y * R[1] + z * R[2];
      const pu = x * U[0] + y * U[1] + z * U[2];
      const dep = x * D[0] + y * D[1] + z * D[2];          /* larger = nearer */
      return [cx + (pr - cR) * SC, cy - (pu - cU) * SC, dep];
    };
    const facingOf = (n) => v3dot(n, D);                  /* >0 → toward eye */

    /* ── PHASE 0 · THE MARK BECOMES THE COLONNADE ───────────────
       The logo's eight ink bars — its skyline rhythm — stand tight and
       UNEVEN at centre, then their heights ALIGN to one level course,
       then they spread onto the temple's eight column axes and rise into
       the Doric colonnade, hollowing from solid mark into line drawing.
       Steps · entablature · gable are sketched in behind them. Hands off
       to the 3-D build the instant the columns stand full height. */
    if (p < 0.32) {
      const align  = aEase(aSeg(p, 0.05, 0.16));   /* uneven → level tops */
      const spread = aEase(aSeg(p, 0.12, 0.30));   /* centre cluster → column axes */
      const grow   = aEase(aSeg(p, 0.14, 0.32));   /* level course → full shaft */
      const capV   = aEase(aSeg(p, 0.22, 0.32));   /* abacus settles on top */
      const wire   = aEase(aSeg(p, 0.20, 0.32));   /* solid mark → hollow line */
      const build  = aSeg(p, 0.16, 0.32);          /* structure sketches in */
      const y = TPL.HY;

      /* structure (steps · cella · entablature · gable) drawn ground-up */
      if (build > 0) {
        const SE = TPL.structEdges, Ns = SE.length, SP = 16;
        const head = build * (Ns + SP);
        ctx.lineWidth = 1.15; ctx.strokeStyle = paper(0.5);
        for (let i = 0; i < Ns; i++) {
          const frac = aClamp((head - i) / SP, 0, 1);
          if (frac <= 0) break;
          const e = SE[i];
          const a = project(e.a[0], e.a[1], e.a[2]);
          const b = project(e.b[0], e.b[1], e.b[2]);
          ctx.beginPath(); ctx.moveTo(a[0], a[1]);
          ctx.lineTo(aLerp(a[0], b[0], frac), aLerp(a[1], b[1], frac)); ctx.stroke();
        }
      }

      /* the eight bars → the eight columns */
      const N = TPL.COLS, cz = TPL.zStylo;
      const levelZ = cz + 1.35;                  /* the aligned course height */
      const capThk = TPL.abTop - TPL.colTop;
      const fillA = aLerp(0.9, 0, wire);         /* solid mark → hollow outline */
      const rect = (xa, xb, z0, z1) => {
        const bl = project(xa, y, z0), br = project(xb, y, z0);
        const tr = project(xb, y, z1), tl = project(xa, y, z1);
        ctx.beginPath();
        ctx.moveTo(bl[0], bl[1]); ctx.lineTo(br[0], br[1]);
        ctx.lineTo(tr[0], tr[1]); ctx.lineTo(tl[0], tl[1]); ctx.closePath();
      };
      for (let i = 0; i < N; i++) {
        const r = ARC_RHYTHM[i % ARC_RHYTHM.length];
        const skyZ = cz + 0.5 + r * 1.7;         /* the uneven skyline top */
        let topZ = aLerp(skyZ, levelZ, align);   /* heights ALIGN */
        topZ = aLerp(topZ, TPL.colTop, grow);    /* then rise to full shaft */
        const startX = (i - (N - 1) / 2) * 0.42;
        const colX = -TPL.HX + i * TPL.SX;
        const x = aLerp(startX, colX, spread);
        const hw = aLerp(0.13, 0.16, spread);
        /* shaft */
        rect(x - hw, x + hw, cz, topZ);
        if (fillA > 0.01) { ctx.fillStyle = paper(fillA); ctx.fill(); }
        ctx.lineWidth = 1.1; ctx.strokeStyle = paper(0.55); ctx.stroke();
        /* abacus capital — settles onto the shaft top as it tops out */
        if (capV > 0.01) {
          const chw = aLerp(0.16, 0.235, spread);
          rect(x - chw, x + chw, topZ, topZ + capThk * capV);
          if (fillA > 0.01) { ctx.fillStyle = paper(fillA * capV); ctx.fill(); }
          ctx.strokeStyle = paper(0.55 * capV); ctx.lineWidth = 1; ctx.stroke();
        }
      }

      /* the blue period — the self — nested in the mark, dissolving as the
         colonnade rises (it returns as the cobalt block at the threshold). */
      const perV = aClamp(1 - grow * 1.2, 0, 1);
      if (perV > 0.01) {
        const hs = 0.16, pz = cz + 0.42;
        rect(-hs, hs, pz - hs, pz + hs);
        ctx.fillStyle = blu(0.9 * perV); ctx.fill();
        ctx.strokeStyle = bluep(0.9 * perV); ctx.lineWidth = 1.2; ctx.stroke();
      }

      /* left ink scrim — fades IN with the chapter; a soft, low veil only at
         the far edge, just enough to seat the title; never a hard dark band */
      const sv0 = aSeg(p, 0.04, 0.18) * 0.32;
      if (sv0 > 0.005) {
        const g0 = ctx.createLinearGradient(0, 0, W * 0.30, 0);
        g0.addColorStop(0, `rgba(11,11,14,${sv0.toFixed(3)})`); g0.addColorStop(1, "rgba(11,11,14,0)");
        ctx.fillStyle = g0; ctx.fillRect(0, 0, W * 0.30, H);
      }
      return;
    }

    /* faint site grid — fades in as the form lifts into 3D */
    if (groundV > 0.01) {
      ctx.lineWidth = 1; ctx.strokeStyle = paper(0.06 * groundV);
      for (let gx = -8; gx <= 8.01; gx += 1.0) {
        const a = project(gx, -9, 0), b = project(gx, 9, 0);
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      }
      for (let gy = -9; gy <= 9.01; gy += 1.0) {
        const a = project(-8, gy, 0), b = project(8, gy, 0);
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      }
    }

    /* ── PHASE 2 · project + cull back-faces + depth-sort ──
       Pure centroid depth can't resolve the temple's nested parts (a low
       inner cella in FRONT has a higher centroid depth than the roof ABOVE
       it, so it would paint through). So faces carry a structural LAYER that
       sorts before depth: 0 = base/steps, 1 = cella, 2 = the shell
       (colonnade · entablature · roof). Within a layer it's far→near depth.
       Result: steps under the cella, cella behind the colonnade, roof on top
       — always, regardless of centroid. */
    /* layer 3 (roof · pediment) sits ABOVE the shell: a single big roof quad
       carries one averaged depth, so the nearer eave/cornice bays in front of
       it would otherwise win the far→near sort and punch through it. Nothing
       but the roof and gable lives above the eave line, so forcing them last
       is always correct. */
    const layerOf = (k) => (k === "step" || k === "stylo") ? 0 : k === "cella" ? 1 : (k === "roof" || k === "ped") ? 3 : 2;
    const draw = [];
    for (const f of TPL.F) {
      if (facingOf(f.n) <= 0.0001) continue;          /* cull back faces */
      const proj = f.pts.map((q) => project(q[0], q[1], q[2]));
      let depth = 0;
      for (const q of proj) depth += q[2];
      depth /= proj.length;
      const lum = aClamp(v3dot(f.n, T_LIGHT) * 0.5 + 0.5, 0, 1);
      draw.push({ f, proj, depth, lum, layer: layerOf(f.kind) });
    }
    draw.sort((a, b) => (a.layer - b.layer) || (a.depth - b.depth)); /* layer, then far → near */

    const baseTone = (kind) =>
      kind === "roof" ? 0.30 : kind === "cella" ? 0.22 :
      kind === "ped" ? 0.46 : kind === "step" || kind === "stylo" ? 0.36 : 0.48;
    /* OPAQUE stone fill — brightness encoded in RGB (not alpha), so faces
       properly occlude one another. During the solid fade the brightness
       lerps up from the ink ground, so solid=0 fills are invisible (a clean
       wireframe) and solid=1 fills are full marble. */
    const INK = 0.043;
    const stone = (t) => {
      const b = aClamp(t, 0, 1);
      return `rgb(${Math.round(239 * b)},${Math.round(236 * b)},${Math.round(230 * b)})`;
    };

    for (const d of draw) {
      const { f, proj, lum } = d;
      ctx.beginPath();
      proj.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath();

      /* fill — opaque; up-facing surfaces held back so the roof and
         stylobate don't blow out. fades up from the ink ground. */
      const up = f.n[2] > 0.7 ? 0.74 : 1;
      const target = Math.min(0.82, (baseTone(f.kind) + lum * 0.34) * up);
      ctx.fillStyle = stone(aLerp(INK, target, solid));
      ctx.fill();

      /* edges — the line drawing. crisp while a drawing, nearly gone once
         it is solid stone, so the columns read as mass, not glass. */
      const edgeA = 0.10 + 0.46 * (1 - solid);
      ctx.strokeStyle = paper(edgeA);
      ctx.lineWidth = f.kind === "col" || f.kind === "cap" ? 1 : 1.15;
      ctx.stroke();

      /* Doric triglyph grooves across visible frieze faces */
      if (f.kind === "frieze") {
        const span = f.fw && Math.abs(f.n[0]) < 0.5 ? f.fw * 2 : f.fd * 2; /* width along the face */
        const N = Math.max(4, Math.round(span / 0.5));
        const [bl, br, tr, tl] = proj;
        ctx.lineWidth = 1; ctx.strokeStyle = paper(0.18 + 0.20 * (1 - solid));
        for (let i = 1; i < N; i++) {
          const t = i / N;
          const bx = aLerp(bl[0], br[0], t), by = aLerp(bl[1], br[1], t);
          const tx = aLerp(tl[0], tr[0], t), ty = aLerp(tl[1], tr[1], t);
          ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(tx, ty); ctx.stroke();
        }
      }
    }

    /* ── the self — a cobalt block at the front threshold ── */
    if (selfV > 0.01) {
      const sy = TPL.HY + 1.35;
      const verts = [];
      const x0 = -0.22, x1 = 0.22, y0 = sy - 0.22, y1 = sy + 0.22, z1 = 0.42 * selfV;
      const P = (x, y, z) => project(x, y, z);
      const sf = [
        [[x0, y1, 0], [x1, y1, 0], [x1, y1, z1], [x0, y1, z1]],
        [[x1, y1, 0], [x1, y0, 0], [x1, y0, z1], [x1, y1, z1]],
        [[x0, y0, 0], [x0, y1, 0], [x0, y1, z1], [x0, y0, z1]],
        [[x0, y1, z1], [x1, y1, z1], [x1, y0, z1], [x0, y0, z1]],
      ].map((pts) => {
        const proj = pts.map((q) => P(q[0], q[1], q[2]));
        let depth = 0; for (const q of proj) depth += q[2]; depth /= proj.length;
        const nrm = v3norm(v3cross(v3sub(pts[1], pts[0]), v3sub(pts[2], pts[0])));
        const lum = aClamp(v3dot(nrm, T_LIGHT) * 0.5 + 0.5, 0, 1);
        return { proj, depth, lum };
      }).sort((a, b) => a.depth - b.depth);
      for (const d of sf) {
        ctx.beginPath();
        d.proj.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        ctx.closePath();
        ctx.fillStyle = blu((0.55 + d.lum * 0.40) * selfV); ctx.fill();
        ctx.strokeStyle = bluep(0.9 * selfV); ctx.lineWidth = 1.2; ctx.stroke();
      }
      /* a dashed threshold line drawn toward the temple */
      const a = project(0, sy, 0.02), b = project(0, TPL.HY + 0.4, 0.02);
      ctx.strokeStyle = paper(0.32 * selfV); ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 5]);
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      ctx.setLineDash([]);
    }

    /* left ink scrim — a soft, low veil beneath the DOM title, but FADED OUT
       as the chapter exits (p→1) so it never lingers as a grey band once the
       page tone turns to paper below. kept light otherwise. */
    const sv = (1 - aSeg(p, 0.86, 1.0)) * 0.32;
    if (sv > 0.005) {
      const g = ctx.createLinearGradient(0, 0, W * 0.30, 0);
      g.addColorStop(0, `rgba(11,11,14,${sv.toFixed(3)})`);
      g.addColorStop(1, "rgba(11,11,14,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W * 0.30, H);
    }
  });
  return <canvas ref={ref}></canvas>;
}

Object.assign(window, { OrderPlane2D, SiteForm3D });
