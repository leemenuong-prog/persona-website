/* ══════════════════════════════════════════════════════════════
   art.jsx — the three generative proofs of rationality.
   01 OrderField  · chaos → grid          (An AIPM   · blue)
   02 CommitTree  · a disciplined DAG     (A Developer · paper)
   03 WireTerrain · forces → form         (An Architect · ink)
   Each canvas reads window.__progress[id] (0–1, written by the
   scroll engine in app.jsx) — no layout reads in any rAF loop.
   ══════════════════════════════════════════════════════════════ */

const { useEffect: useArtEffect, useRef: useArtRef } = React;

const aClamp = (v, a, b) => Math.max(a, Math.min(b, v));
const aSeg = (x, a, b) => aClamp((x - a) / (b - a || 1), 0, 1);
const aEase = (t) => t * t * (3 - 2 * t);
const aLerp = (a, b, t) => a + (b - a) * t;

/* ── master clock — rAF with a continuous watchdog ──────────
   Some embeds throttle rAF (sometimes intermittently); every
   loop in the site registers here instead of calling rAF
   directly. A permanent 250ms watchdog notices any stall and
   drives ticks itself until rAF resumes. */
const LOOP = { fns: new Set(), lastRaf: 0, itv: null };
function masterTick(now) {
  LOOP.fns.forEach((f) => { try { f(now); } catch (e) { console.error("loop error", e); } });
}
(function rafDriver(now) {
  if (now != null) {
    LOOP.lastRaf = performance.now();
    if (LOOP.itv) { clearInterval(LOOP.itv); LOOP.itv = null; }
    masterTick(now);
  }
  requestAnimationFrame(rafDriver);
})();
/* watchdog: if rAF hasn't ticked for 300ms, drive a 33ms interval
   until it comes back. Never disarms itself. */
setInterval(() => {
  const stalled = performance.now() - LOOP.lastRaf > 300;
  if (stalled && !LOOP.itv) {
    LOOP.itv = setInterval(() => {
      /* rAF recovered? hand back control */
      if (performance.now() - LOOP.lastRaf < 100) { clearInterval(LOOP.itv); LOOP.itv = null; return; }
      masterTick(performance.now());
    }, 33);
  }
}, 250);
/* intensive timer throttling can clamp even the watchdog — scroll
   events are never throttled, and they're exactly when the
   scroll-driven UI needs an update. Also tick on resize/visibility. */
const stallTick = () => {
  if (performance.now() - LOOP.lastRaf > 100) { window.__snapScroll = true; masterTick(performance.now()); }
};
addEventListener("scroll", stallTick, { passive: true });
addEventListener("pointermove", stallTick, { passive: true });
addEventListener("visibilitychange", stallTick);
window.__addLoop = (f) => { LOOP.fns.add(f); return () => LOOP.fns.delete(f); };
/* debug/capture hook — force a synchronous repaint of every loop */
window.__tick = (t) => masterTick(t != null ? t : performance.now());

/* mulberry32 — deterministic random so the artwork is stable */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s |= 0; s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function useCanvas(drawFn, deps) {
  const ref = useArtRef(null);
  useArtEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    const resize = () => {
      const r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = Math.max(1, W * dpr); cv.height = Math.max(1, H * dpr);
    };
    resize();
    window.addEventListener("resize", resize);
    const stop = window.__addLoop((now) => {
      if (!W) resize();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFn(ctx, W, H, now);
    });
    return () => { stop(); window.removeEventListener("resize", resize); };
  }, deps || []);
  return ref;
}

/* ── ring of rotating mono text around an artwork ─────────── */
function RingText({ text }) {
  return (
    <svg className="ring" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <path id={"rg" + text.length} d="M 50,50 m -41,0 a 41,41 0 1,1 82,0 a 41,41 0 1,1 -82,0"></path>
      </defs>
      <text><textPath href={"#rg" + text.length}>{text}</textPath></text>
    </svg>
  );
}

/* ── 01 · OrderField — chaos becomes a grid ───────────────── */
function OrderField() {
  const ref = useCanvas((ctx, W, H, now) => {
    const p = (window.__progress && window.__progress.aipm) || 0;
    if (p <= 0 || p >= 1.05) { ctx.clearRect(0, 0, W, H); return; }
    ctx.clearRect(0, 0, W, H);

    const order = aEase(aSeg(p, 0.12, 0.72));          // chaos → grid
    const t = now / 1000;
    const COLS = 14, ROWS = 11;
    const gw = W / (COLS + 1), gh = H / (ROWS + 1);
    const r = rng(7);

    /* faint gridlines fade in with order */
    if (order > 0.5) {
      const ga = (order - 0.5) * 2 * 0.16;
      ctx.strokeStyle = `rgba(239,236,230,${ga.toFixed(3)})`;
      ctx.lineWidth = 1;
      for (let i = 1; i <= COLS; i++) { ctx.beginPath(); ctx.moveTo(i * gw, gh * 0.6); ctx.lineTo(i * gw, H - gh * 0.6); ctx.stroke(); }
    }

    for (let i = 0; i < COLS * ROWS; i++) {
      const cx = (i % COLS) + 1, cy = Math.floor(i / COLS) + 1;
      /* chaotic home */
      const ox = r() * W, oy = r() * H;
      const wob = (1 - order);
      const jx = Math.sin(t * (0.6 + r() * 0.9) + i) * 26 * wob;
      const jy = Math.cos(t * (0.5 + r() * 0.8) + i * 1.7) * 26 * wob;
      const x = aLerp(ox + jx, cx * gw, order);
      const y = aLerp(oy + jy, cy * gh, order);
      const blue = r() < 0.085;
      const s = blue ? 7 : aLerp(2.4, 5, r());
      const alpha = aLerp(0.35, 0.9, order * 0.7 + r() * 0.3);
      ctx.fillStyle = blue ? "rgba(120,160,255,.95)" : `rgba(239,236,230,${alpha.toFixed(3)})`;
      ctx.fillRect(x - s / 2, y - s / 2, s, s);
    }

    /* the scan — one sweeping line once order is near complete */
    const sw = aSeg(p, 0.74, 0.96);
    if (sw > 0 && sw < 1) {
      const sx = sw * W;
      ctx.fillStyle = "rgba(239,236,230,.9)";
      ctx.fillRect(sx, 0, 1.5, H);
      ctx.fillStyle = "rgba(239,236,230,.08)";
      ctx.fillRect(sx - 60, 0, 60, H);
    }
  });
  return <canvas ref={ref}></canvas>;
}

/* ── 02 · GateField — incident → rule → test → gate ───────────
   A live CI gauntlet. Commits rain toward the page's discipline
   axis; three gates (RULE / STATIC TEST / MERGE GATE) tighten the
   stream in turn. Incidents are absorbed by the first gate, flaky
   work dies at the second, and whatever passes the third lands as
   a perfectly ordered build — the brand's bar-band, assembled one
   merged commit at a time. Zero recurrence. */
function GateField() {
  const simRef = useArtRef(null);
  if (!simRef.current) {
    simRef.current = { parts: [], cols: [0, 0, 0, 0, 0], r: rng(33), acc: 0, last: 0,
                       fl: [0, 0, 0], merged: 0, absorbed: 0 };
  }
  const COLT = [0.55, 0.95, 0.72, 1, 0.62];          /* band silhouette */

  const ref = useCanvas((ctx, W, H, now) => {
    const S = simRef.current;
    const p = (window.__progress && window.__progress.developer) || 0;
    if (p <= 0 || p >= 1.05) {
      ctx.clearRect(0, 0, W, H);
      if (S.parts.length || S.merged || S.absorbed) {       /* reset → replays clean */
        S.parts.length = 0; S.cols = [0, 0, 0, 0, 0]; S.r = rng(33);
        S.merged = 0; S.absorbed = 0; S.acc = 0; S.fl = [0, 0, 0];
      }
      S.last = now;
      return;
    }
    const dt = Math.min(Math.max((now - S.last) / 1000, 0), 0.05); S.last = now;
    ctx.clearRect(0, 0, W, H);

    const px = W * 0.5;
    const GY = [H * 0.30, H * 0.52, H * 0.74];
    const PW = [W * 0.10, W * 0.055, W * 0.026];     /* port half-width narrows */
    const X0 = W * 0.03, X1 = W * 0.97;
    const baseY = H * 0.965;
    const maxStack = H * 0.215, UNIT = 5;
    const ink = (a) => `rgba(11,11,14,${a.toFixed(3)})`;
    const blu = (a) => `rgba(0,71,171,${a.toFixed(3)})`;
    const MONO = "600 9.5px 'JetBrains Mono', ui-monospace, monospace";

    /* baseline */
    const blv = aEase(aSeg(p, 0.08, 0.2));
    if (blv > 0) { ctx.fillStyle = ink(0.85); ctx.fillRect(X0, baseY, (X1 - X0) * blv, 2); }

    /* discipline axis — dashed center guide */
    const gd = aSeg(p, 0.26, 0.46);
    if (gd > 0.01) {
      ctx.strokeStyle = ink(0.15 * gd); ctx.lineWidth = 1;
      ctx.setLineDash([2, 7]);
      ctx.beginPath(); ctx.moveTo(px, GY[0]); ctx.lineTo(px, baseY - 4); ctx.stroke();
      ctx.setLineDash([]);
    }

    /* the three gates */
    const LB = ["01 · RULE", "02 · STATIC TEST", "03 · MERGE GATE"];
    for (let i = 0; i < 3; i++) {
      const g = aEase(aSeg(p, 0.10 + i * 0.07, 0.26 + i * 0.07));
      if (g <= 0) continue;
      S.fl[i] = Math.max(0, S.fl[i] - dt * 2.4);
      const reach = X0 + (X1 - X0) * g;
      ctx.lineWidth = 1.5;
      [[X0, px - PW[i]], [px + PW[i], X1]].forEach(([a, b]) => {
        const e = Math.min(b, reach); if (e <= a) return;
        ctx.strokeStyle = ink(0.55);
        ctx.beginPath(); ctx.moveTo(a, GY[i]); ctx.lineTo(e, GY[i]); ctx.stroke();
      });
      /* blue surge around the port when something crosses */
      if (S.fl[i] > 0.01) {
        ctx.strokeStyle = blu(0.7 * S.fl[i]); ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(px - PW[i] - 44, GY[i]); ctx.lineTo(px - PW[i], GY[i]);
        ctx.moveTo(px + PW[i], GY[i]); ctx.lineTo(px + PW[i] + 44, GY[i]);
        ctx.stroke();
      }
      /* port jambs */
      if (g > 0.55) {
        ctx.fillStyle = blu(0.95);
        ctx.fillRect(px - PW[i] - 1.5, GY[i] - 5, 3, 10);
        ctx.fillRect(px + PW[i] - 1.5, GY[i] - 5, 3, 10);
      }
      if (g >= 1) { ctx.fillStyle = ink(0.9); ctx.fillRect(X1 - 4, GY[i] - 4, 8, 8); }
      /* tracked-out mono label */
      if (g > 0.4) {
        ctx.font = MONO; ctx.fillStyle = ink(0.45); ctx.textAlign = "left";
        let lx = X0 + 1;
        for (const ch of LB[i]) { ctx.fillText(ch, lx, GY[i] - 9); lx += ctx.measureText(ch).width + 2.4; }
      }
    }

    /* spawn commits */
    const flow = aSeg(p, 0.13, 0.2) * (1 - aSeg(p, 0.96, 1.01));
    if (flow > 0.05 && S.parts.length < 90) {
      S.acc += dt;
      while (S.acc > 0.1) {
        S.acc -= 0.1;
        const rr = S.r;
        const roll = rr();
        S.parts.push({
          x: W * (0.12 + 0.76 * rr()), y: -10,
          h: rr() * 2 - 1, ph: rr() * 6.283, sp: 0.85 + rr() * 0.35,
          type: roll < 0.15 ? "inc" : roll < 0.24 ? "flaky" : "ok",
          zone: 0, st: "run", life: 1, vx: 0, col: -1,
        });
      }
    }

    /* update + draw particles */
    const AMP = [W * 0.30, W * 0.075, W * 0.028, 0];   /* spread narrows per zone */
    const vy = H * 0.20;
    for (let i = S.parts.length - 1; i >= 0; i--) {
      const q = S.parts[i];
      if (q.st === "rej") {                            /* deflected — fading out */
        q.life -= dt * 1.8;
        q.x += q.vx * dt; q.vx *= 1 - Math.min(dt * 1.4, 1); q.y += vy * 0.22 * dt;
        if (q.life <= 0) { S.parts.splice(i, 1); continue; }
        ctx.strokeStyle = ink(0.8 * q.life); ctx.lineWidth = 1.6;
        ctx.strokeRect(q.x - 4.5, q.y - 4.5, 9, 9);
        continue;
      }
      const amp = AMP[q.zone];
      const tx = q.zone === 3
        ? px + (q.col - 2) * W * 0.052
        : px + q.h * amp + Math.sin((now / 900) * q.sp + q.ph) * amp * 0.22;
      q.x += (tx - q.x) * Math.min(1, dt * (q.zone === 0 ? 1.4 : 5.5));
      q.y += vy * q.sp * dt;

      /* gate crossing */
      if (q.zone < 3 && q.y >= GY[q.zone]) {
        const z = q.zone;
        if ((q.type === "inc" && z === 0) || (q.type === "flaky" && z === 1)) {
          q.st = "rej"; q.y = GY[z] - 6;               /* absorbed into the rule layer */
          q.vx = (q.x < px ? -1 : 1) * W * (0.45 + 0.4 * S.r());
          S.fl[z] = 1; S.absorbed++;
          continue;
        }
        q.zone = z + 1; q.x = px + (q.x - px) * 0.35;
        S.fl[z] = Math.max(S.fl[z], 0.45);
        if (q.zone === 3) {                            /* assign a landing column */
          let best = 0, bestR = 1e9;
          for (let c = 0; c < 5; c++) {
            const ratio = S.cols[c] / (COLT[c] * maxStack);
            if (ratio < bestR) { bestR = ratio; best = c; }
          }
          q.col = best;
        }
      }

      /* landing — one more unit of the build */
      if (q.zone === 3 && q.y >= baseY - 2 - S.cols[q.col]) {
        S.cols[q.col] = Math.min(S.cols[q.col] + UNIT, COLT[q.col] * maxStack);
        S.merged++;
        S.parts.splice(i, 1);
        continue;
      }

      const passed = q.zone === 3;
      const s = passed ? 8 : 7;
      /* short motion trail */
      ctx.fillStyle = passed ? blu(0.15) : ink(0.09);
      ctx.fillRect(q.x - s / 2, q.y - s / 2 - 13, s, s);
      ctx.fillStyle = passed ? blu(0.33) : ink(0.2);
      ctx.fillRect(q.x - s / 2, q.y - s / 2 - 6.5, s, s);
      if (q.type === "inc" && q.zone === 0) {          /* incidents are hollow */
        ctx.strokeStyle = ink(0.85); ctx.lineWidth = 1.6;
        ctx.strokeRect(q.x - s / 2, q.y - s / 2, s, s);
      } else {
        ctx.fillStyle = passed ? blu(0.95) : ink(0.82);
        ctx.fillRect(q.x - s / 2, q.y - s / 2, s, s);
      }
    }

    /* the build — brand band assembling from merged commits */
    const colW = W * 0.034;
    for (let c = 0; c < 5; c++) {
      if (S.cols[c] <= 0) continue;
      const cx = px + (c - 2) * W * 0.052;
      ctx.fillStyle = ink(0.92);
      ctx.fillRect(cx - colW / 2, baseY - S.cols[c], colW, S.cols[c]);
    }
    if (S.merged > 0) {                                /* the band's blue dot */
      ctx.fillStyle = blu(0.95);
      ctx.fillRect(px + 3 * W * 0.052 - 4.5, baseY - 9, 9, 9);
    }

    /* captions */
    ctx.font = MONO;
    if (p > 0.3) {
      ctx.textAlign = "right"; ctx.fillStyle = ink(0.42 * aSeg(p, 0.3, 0.42));
      ctx.fillText("INCIDENTS ABSORBED " + String(S.absorbed).padStart(2, "0"), X1, GY[0] - 9);
    }
    if (p > 0.5) {
      ctx.textAlign = "right"; ctx.fillStyle = ink(0.5 * aSeg(p, 0.5, 0.62));
      ctx.fillText("MERGED " + String(S.merged).padStart(2, "0") + " · RECURRENCE 00", X1, baseY - 10);
    }
    ctx.textAlign = "left";
  });
  return <canvas ref={ref}></canvas>;
}

/* ── 03 · WireTerrain — site forces become form ───────────── */
function WireTerrain() {
  const ref = useCanvas((ctx, W, H, now) => {
    const p = (window.__progress && window.__progress.architect) || 0;
    if (p <= 0 || p >= 1.05) { ctx.clearRect(0, 0, W, H); return; }
    ctx.clearRect(0, 0, W, H);
    const t = now / 1000;
    const rise = aEase(aSeg(p, 0.12, 0.7));            /* terrain → building */
    const rot = -0.55 + p * 0.5 + Math.sin(t * 0.12) * 0.04;
    const cosR = Math.cos(rot), sinR = Math.sin(rot);
    const tilt = 0.42;
    const SC = Math.min(W, H) * 0.066;
    const cx = W / 2, cy = H * 0.56;

    const proj = (x, y, z) => {
      const rx = x * cosR - y * sinR, ry = x * sinR + y * cosR;
      return [cx + rx * SC, cy + ry * SC * tilt - z * SC * 0.9];
    };
    const zOf = (x, y) =>
      (Math.sin(x * 0.55 + t * 0.25) * Math.cos(y * 0.5) * 0.55 +
       Math.sin((x + y) * 0.3 + t * 0.18) * 0.35);

    /* terrain mesh 13×13 */
    const N = 12, EX = 5.4;
    ctx.lineWidth = 1;
    for (let i = 0; i <= N; i++) {
      ctx.strokeStyle = "rgba(239,236,230,.28)";
      ctx.beginPath();
      for (let j = 0; j <= N; j++) {
        const x = -EX + (2 * EX * i) / N, y = -EX + (2 * EX * j) / N;
        const [px, py] = proj(x, y, zOf(x, y) * (1 - rise * 0.35));
        j ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.stroke();
      ctx.beginPath();
      for (let j = 0; j <= N; j++) {
        const x = -EX + (2 * EX * j) / N, y = -EX + (2 * EX * i) / N;
        const [px, py] = proj(x, y, zOf(x, y) * (1 - rise * 0.35));
        j ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.stroke();
    }

    /* the pavilion — a rational frame extruded from the site */
    if (rise > 0.02) {
      const hgt = 3.1 * rise;
      const bx = 2.0;                                   /* half-width */
      const cols = [[-bx, -bx], [bx, -bx], [bx, bx], [-bx, bx]];
      ctx.strokeStyle = "rgba(239,236,230,.85)";
      ctx.lineWidth = 1.5;
      /* columns */
      cols.forEach(([x, y]) => {
        const z0 = zOf(x, y) * (1 - rise * 0.35);
        const [x1, y1] = proj(x, y, z0), [x2, y2] = proj(x, y, hgt);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      });
      /* roof plane + mid slab — blue edges */
      const lvls = [[hgt, "rgba(43,95,222,.95)", 2], [hgt * 0.55, "rgba(239,236,230,.5)", 1]];
      lvls.forEach(([z, col, lw]) => {
        ctx.strokeStyle = col; ctx.lineWidth = lw;
        ctx.beginPath();
        cols.forEach(([x, y], i) => {
          const [px, py] = proj(x, y, z);
          i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
        });
        ctx.closePath(); ctx.stroke();
      });
      /* roof diagonals */
      ctx.strokeStyle = "rgba(43,95,222,.5)"; ctx.lineWidth = 1;
      const [d1x, d1y] = proj(-bx, -bx, hgt), [d2x, d2y] = proj(bx, bx, hgt);
      const [d3x, d3y] = proj(bx, -bx, hgt), [d4x, d4y] = proj(-bx, bx, hgt);
      ctx.beginPath(); ctx.moveTo(d1x, d1y); ctx.lineTo(d2x, d2y); ctx.moveTo(d3x, d3y); ctx.lineTo(d4x, d4y); ctx.stroke();
    }

    /* force arrows — the site speaks: water / noise / wind */
    const fa = (1 - aSeg(p, 0.5, 0.75)) * aSeg(p, 0.06, 0.2);
    if (fa > 0.01) {
      ctx.strokeStyle = `rgba(43,95,222,${(fa * 0.9).toFixed(2)})`;
      ctx.lineWidth = 1.2;
      for (let k = 0; k < 4; k++) {
        const ang = t * 0.3 + (k * Math.PI) / 2;
        const fx = Math.cos(ang) * 7.6, fy = Math.sin(ang) * 7.6;
        const [x1, y1] = proj(fx, fy, 0.4);
        const [x2, y2] = proj(fx * 0.72, fy * 0.72, 0.4);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        const angO = Math.atan2(y2 - y1, x2 - x1);
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - Math.cos(angO - 0.4) * 7, y2 - Math.sin(angO - 0.4) * 7);
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - Math.cos(angO + 0.4) * 7, y2 - Math.sin(angO + 0.4) * 7);
        ctx.stroke();
      }
    }
  });
  return <canvas ref={ref}></canvas>;
}

Object.assign(window, { RingText, OrderField, GateField, WireTerrain, useCanvas, rng,
  aClamp, aSeg, aEase, aLerp });
