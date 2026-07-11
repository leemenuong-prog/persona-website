/* ════════════════════════════════════════════════════════════
   ribbon.js — 英雄区 3D 作品丝带（2026-07-11 改版，取代 3D 立方体）。

   模型（传送带，无状态混合）：一条以环角 u 为参数的路径——u≥0 段就是环本身，
   u<0 段是从环前端向镜头外扩的螺线；11 张卡以恒定弧长间距（sLink=R·Δφ）在同一条
   路径上前进，头部弧长 S(t) 指数收敛进匀速巡航（终端斜率=ω·R），飞入幕在 u=0 处
   C¹ 连续地融进环态：无跳变、无欧拉角插值。

   深度遮挡（双容器 z-split）：.ribbon-back(z1) 与 .ribbon-front(z4) 两个逐像素相同
   的透视容器夹住大字(z2)，卡片按世界深度 z_w = −Zoff + R·cos(θ+φ)·cosτ 的正负在
   两容器间迁移 DOM（迁移点在侧棱对镜 ±90°，屏上 1–2px 宽 + ±1.5° 迟滞，不可辨）。
   ⚠️ 禁给两容器套共用 transform wrapper（合成组会挡掉大字的 z-index 夹层）。

   铁律：只写 transform/opacity；卡片布局尺寸=近掠最大显示尺寸，投影 scale 恒 ≤1
   （全环 z ≤ −MARGIN，防合成层放大糊）；卡片零 CSS transition（DOM 迁移会重置）。
   Ribbon.init(list) 由 index-fx.refresh(list) 调用；resize 走 Ribbon.relayout()。
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var REDUCE = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var HOVERFINE = window.matchMedia('(hover: hover) and (pointer: fine)');
  var MOBILE = window.matchMedia('(max-width: 767px)');
  var COARSE = window.matchMedia('(pointer: coarse)');

  var D2R = Math.PI / 180, R2D = 180 / Math.PI;
  var PERSP = 1500;              /* 与 css .ribbon-layer 的 perspective 同值 */
  var TILT = -14;                /* 环倾斜 rotateX（deg）：前弧沉、后弧抬 */
  var BANK = -7;                 /* 环斜置 rotateZ（deg）：带子斜穿标题（不改 z，迁移公式不变） */
  var DROP = 0.32;               /* 环心下沉：标题中线 + DROP×标题高（前弧只遮字下段） */
  var COVERAGE = 0.82;           /* 弦覆盖率：卡宽 ≈ 82% 弦长 → 胶片首尾相接 */
  var MARGIN_Z = 40;             /* 世界深度上限 −40px：投影 scale 恒 <1 */
  var BASE = 0.05;               /* 巡航 3°/s（0.05°/60fps 帧，与立方体同钟表感） */
  var FRICTION = 0.95;           /* 松手惯性摩擦/帧 */
  var VEL_MAX = 0.8;             /* 惯性上限 °/帧（前弧线速与立方体 ±3 等感换算） */
  var PSI_MAX = 35;              /* 飞入扭转峰值（deg，绕路径切线） */
  var HYST = Math.sin(1.5 * D2R);/* 迁移迟滞 ±1.5° */
  var INTRO_DUR = 4200;          /* 飞入幕时长（ms）：S = S0 + ΔS·easeOutSine + ω·R·t，
                                    sine 终点导数为 0 → 终端斜率恰=ω·R，C¹ 融进巡航；
                                    初速仅 1.57×均速 → 逐卡掠镜节奏均匀（quint 太前载，0.5s 冲完） */
  var U_END = 335 * D2R;         /* 头卡终点环角：11 卡全部入环（min slot ≈ 7.7°） */

  var N = 0, cards = [];         /* {el, img, shade, id, side, phi} */
  var geo = null;                /* 几何解算结果 */
  var mode = 'idle';             /* idle → intro → ring（REDUCE 直接 static） */
  var theta = 0, vel = BASE;     /* 环态自转（deg / deg每帧） */
  var tIntro = 0, S0 = 0, sEnd = 0, omegaArc = 0;
  var raf = null, visible = true, lastT = 0;
  var dragging = false, px = 0, py = 0, lastDx = 0, downX = 0, downY = 0, downT = 0, downCard = null;
  var par = { tx: 0, ty: 0, x: 0, y: 0 };
  var els = null;                /* {backW, frontW, frontLayer, backLayer, hit, hero, nameText} */

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ── 路径（环局部坐标，y 向下为正；tilt 由 world 统一施加） ──
     q=|u|（u<0 段）：r 半径外扩、lift 抬离环面（负=向上）、pull 向镜头拉近（先增后收） */
  function pathPos(u, g) {
    var q = Math.max(0, -u);
    var r = g.R * (1 + 0.22 * Math.pow(q, 1.7));
    var lift = -g.ky * Math.pow(q, 1.4);
    var pull = g.kz * Math.pow(q, 1.2) * Math.exp(-q / 0.9);
    return [r * Math.sin(u), lift, r * Math.cos(u) + pull];
  }
  function pathPsi(u) {          /* 绕切线扭转：u=0 处零值零导（C¹ 融进环态） */
    var q = Math.max(0, -u);
    var f = Math.min(1, q / 1.2);
    var sm = f * f * (3 - 2 * f);
    return PSI_MAX * sm * sm;
  }
  /* 世界深度（相机空间 z，负=远离）：p 环局部坐标 → rotateX(tilt) → −Zoff */
  function camZ(p, g) {
    return -g.Zoff + p[2] * g.cosT - p[1] * g.sinT;
  }

  /* ── 几何解算：全部像素在 JS 算（令牌零 svh）；卡宽量 offsetWidth（CSS 断点变量落地值） ── */
  function solveGeometry() {
    var W0 = cards[0].el.offsetWidth || 420;
    var dphi = 2 * Math.PI / N;
    var R = W0 / (COVERAGE * dphi);
    var vw = window.innerWidth;
    var X = 0.40 * vw;                                   /* 环投影半宽目标（略窄于 92vw 大字） */
    var Zoff = Math.max(PERSP * (R / X - 1), R * Math.cos(TILT * D2R) + MARGIN_Z);
    var layer = els.frontLayer.getBoundingClientRect();

    /* 环心纵向：桌面对准大字中线（offsetTop 链，不受入场/视差 transform 影响）；
       手机档大字小且贴顶，环心改对 hero 视口中心（三段式布局） */
    var ycScreen = 0;
    if (!MOBILE.matches && els.nameText) {
      var nameTop = 0, e = els.nameText;
      while (e && e !== els.hero) { nameTop += e.offsetTop; e = e.offsetParent; }
      var nameH = els.nameText.offsetHeight;
      ycScreen = nameTop + nameH / 2 + DROP * nameH - layer.height / 2;
    }
    var g = {
      W0: W0, dphi: dphi, R: R, Zoff: Zoff,
      cosT: Math.cos(TILT * D2R), sinT: Math.sin(TILT * D2R),
      yc: ycScreen * (PERSP + Zoff) / PERSP,             /* 反投影回环心深度平面 */
      sf: PERSP / (PERSP + Zoff - R * Math.cos(TILT * D2R)),   /* 前弧投影 scale */
      ky: 0.07 * R, kz: 1,
      gain: 0, sLink: R * dphi, arcU: null, arcS: null
    };
    g.gain = R2D / (R * g.sf);                           /* 拖拽：前弧卡贴手指（°/px） */

    /* kz 定标：采样螺线，缩放 pull 使 max z_w = −MARGIN_Z（近掠贴脸、scale 恒 <1） */
    var kzBound = Infinity, u;
    for (u = -0.02; u > -4; u -= 0.02) {
      var q = -u;
      var base = camZ([0, -g.ky * Math.pow(q, 1.4),
        g.R * (1 + 0.22 * Math.pow(q, 1.7)) * Math.cos(u)], g);
      var B = Math.pow(q, 1.2) * Math.exp(-q / 0.9) * g.cosT;
      if (B > 1e-4) kzBound = Math.min(kzBound, (-MARGIN_Z - base) / B);
    }
    g.kz = Math.max(0, kzBound === Infinity ? 0 : kzBound);

    /* 入场点：头卡起点 u_entry —— 投影完全出画（|x_screen| > vw/2 + 卡投影宽） */
    var uEntry = -1.1;
    while (uEntry > -3.6) {
      var p = pathPos(uEntry, g);
      var z = camZ(p, g);
      var s = PERSP / (PERSP - z);
      if (Math.abs(p[0] * s) > vw / 2 + W0 * s) break;
      uEntry -= 0.08;
    }

    /* 弧长表（u<0 螺线段重参数化；u≥0 解析 = R·u）：
       从 0 向下积到覆盖「头卡入场弧长 + 整条链长」 */
    var need = 0, us = [0], ss = [0], acc = 0, prev = pathPos(0, g), du = 0.008;
    var chain = (N - 1) * g.sLink;
    for (u = -du; u > -30; u -= du) {
      var pt = pathPos(u, g);
      acc -= Math.hypot(pt[0] - prev[0], pt[1] - prev[1], pt[2] - prev[2]);
      prev = pt;
      us.push(u); ss.push(acc);
      if (u <= uEntry && !need) need = acc;              /* 头卡入场处的（负）弧长 */
      if (need && acc < need - chain - 40) break;
    }
    g.arcU = us; g.arcS = ss; g.uEntry = uEntry; g.sEntry = need || ss[ss.length - 1];
    return g;
  }
  function uAtArc(s, g) {
    if (s >= 0) return s / g.R;
    var ss = g.arcS, lo = 0, hi = ss.length - 1;
    if (s <= ss[hi]) return g.arcU[hi];
    while (hi - lo > 1) {                                /* ss 单调递减（负向） */
      var m = (lo + hi) >> 1;
      if (ss[m] >= s) lo = m; else hi = m;
    }
    var t = (s - ss[lo]) / (ss[hi] - ss[lo] || 1);
    return g.arcU[lo] + (g.arcU[hi] - g.arcU[lo]) * t;
  }

  /* ── 每帧写入 ── */
  function worldString(extraRotY) {
    var pxo = 0, pyo = 0;
    if (HOVERFINE.matches) { pxo = par.x * 14; pyo = par.y * 10; }
    return 'translate3d(' + pxo.toFixed(1) + 'px,' + (geo.yc + pyo).toFixed(1) + 'px,' +
      (-geo.Zoff).toFixed(1) + 'px) rotateZ(' + BANK + 'deg) rotateX(' + TILT + 'deg)' +
      (extraRotY != null ? ' rotateY(' + extraRotY.toFixed(3) + 'deg)' : '');
  }
  function writeWorlds(str) {
    els.backW.style.transform = str;
    els.frontW.style.transform = str;
  }
  /* 迁移 + 深度/背面遮罩（沿 face-shade 先例：只写 opacity，Δ>0.004 才写） */
  function sideAndShade(card, effRad) {
    var c = Math.cos(effRad);
    var side = card.side;
    if (c > HYST) side = 1; else if (c < -HYST) side = -1;
    if (side !== card.side) {
      card.side = side;
      (side === 1 ? els.frontW : els.backW).appendChild(card.el);
    }
    var o = c >= 0 ? 0.12 * (1 - c) : Math.min(0.5, 0.12 + 0.34 * (-c));
    if (Math.abs(o - card._o) > 0.004) {
      card.shade.style.opacity = o.toFixed(3);
      card._o = o;
    }
  }
  function writeNameParallax() {
    if (HOVERFINE.matches && els.nameText) {
      els.nameText.style.transform =
        'translate3d(' + (par.x * -8).toFixed(1) + 'px,' + (par.y * -5).toFixed(1) + 'px,0)';
    }
  }
  function slotTransform(phiDeg) {
    return 'rotateY(' + phiDeg.toFixed(3) + 'deg) translateZ(' + geo.R.toFixed(1) + 'px)';
  }

  function render(now) {
    raf = null;
    if (!lastT) lastT = now;
    var dtMs = now - lastT;
    if (dtMs > 1000) dtMs = 16.7;                        /* 后台/离屏归来：整体重基，不追帧 */
    var dt = Math.min(dtMs / 16.7, 3);                   /* 归一到 60fps 帧：120Hz 手感一致 */
    lastT = now;

    if (HOVERFINE.matches) {                             /* 视差 lerp 滞后跟随（拖拽时冻结目标） */
      var k = 1 - Math.pow(0.94, dt);
      par.x += (par.tx - par.x) * k;
      par.y += (par.ty - par.y) * k;
      writeNameParallax();
    }

    if (mode === 'intro') {
      tIntro += dtMs;
      var x = Math.min(1, tIntro / INTRO_DUR);
      var ease = Math.sin(x * Math.PI / 2);              /* easeOutSine：近匀速出发、渐歇 */
      var S = S0 + (sEnd - S0) * ease + omegaArc * tIntro / 1000;
      writeWorlds(worldString(null));
      for (var i = 0; i < N; i++) {
        var u = uAtArc(S - i * geo.sLink, geo);
        var p = pathPos(u, geo);
        cards[i].el.style.transform =
          'translate3d(' + p[0].toFixed(1) + 'px,' + p[1].toFixed(1) + 'px,' + p[2].toFixed(1) + 'px)' +
          ' rotateY(' + (u * R2D).toFixed(3) + 'deg) rotateX(' + pathPsi(u).toFixed(2) + 'deg)';
        sideAndShade(cards[i], u);
      }
      if (x >= 1) {                                      /* C¹ 融合完成 → 冻结槽位切环态 */
        for (i = 0; i < N; i++) {
          cards[i].phi = uAtArc(S - i * geo.sLink, geo) * R2D;
          cards[i].el.style.transform = slotTransform(cards[i].phi);
        }
        theta = 0; vel = BASE; mode = 'ring';
      }
    } else if (mode === 'ring') {
      if (dragging) {
        lastDx *= Math.pow(0.8, dt);                     /* 按住不动 → 松手速度衰到 0 */
      } else {
        vel = BASE + (vel - BASE) * Math.pow(FRICTION, dt);
        theta += vel * dt;
      }
      writeWorlds(worldString(theta));
      for (var j = 0; j < N; j++) {
        sideAndShade(cards[j], (theta + cards[j].phi) * D2R);
      }
    }

    if (visible && mode !== 'idle') raf = requestAnimationFrame(render);
  }
  function ensure() { if (!raf && visible && mode !== 'idle') { lastT = 0; raf = requestAnimationFrame(render); } }

  /* ── REDUCE 静态定格：环态 θ=半槽偏移（正前是卡缝、两卡对称分列大字中缝），零 rAF ── */
  function staticPose() {
    writeWorlds(worldString(0));
    for (var i = 0; i < N; i++) {
      cards[i].phi = (i + 0.5) * geo.dphi * R2D;
      cards[i].el.style.transform = slotTransform(cards[i].phi);
      sideAndShade(cards[i], (i + 0.5) * geo.dphi);
    }
    mode = 'static';
  }

  /* ── 点击 vs 拖拽（down 绑 .ribbon-hit + .ribbon-front 冒泡；move/up 走 window，免 capture） ── */
  function onDown(e) {
    if (mode !== 'ring' && mode !== 'static') return;
    dragging = mode === 'ring';
    px = e.clientX; py = e.clientY; lastDx = 0;
    downX = e.clientX; downY = e.clientY; downT = performance.now();
    downCard = e.target && e.target.closest ? e.target.closest('.rcard') : null;
  }
  function onMove(e) {
    if (HOVERFINE.matches && !dragging) {                /* 视差目标（拖拽时冻结） */
      par.tx = e.clientX / window.innerWidth * 2 - 1;
      par.ty = e.clientY / window.innerHeight * 2 - 1;
    }
    if (!dragging) return;
    var dx = e.clientX - px;
    theta += dx * geo.gain;
    lastDx = dx;
    px = e.clientX; py = e.clientY;
  }
  function onUp(e) {
    var wasDown = downT > 0;
    if (dragging) {
      dragging = false;
      vel = clamp(BASE + lastDx * geo.gain, -VEL_MAX, VEL_MAX);
    }
    if (!wasDown) return;
    var slop = COARSE.matches ? 10 : 6;
    var isTap = Math.hypot(e.clientX - downX, e.clientY - downY) < slop &&
      performance.now() - downT < 400 && downCard;
    downT = 0;
    if (!isTap) { downCard = null; return; }
    var target = document.getElementById('work-' + downCard.dataset.id);
    downCard = null;
    if (!target) return;
    target.scrollIntoView({ block: 'start' });           /* 不传 smooth：吃全局 scroll-behavior，RM 自动瞬跳 */
    target.classList.add('jump-hit');
    setTimeout(function () { target.classList.remove('jump-hit'); }, 950);
  }

  /* ── 起跑门：loaderdone（或 loading 已摘）+350ms 对齐 ribbonFade 时序槽 + 图片解码门 ── */
  function armStart(decodeGate) {
    var go = function () {
      setTimeout(function () {
        decodeGate.then(function () {
          if (mode !== 'idle') return;
          tIntro = 0; mode = 'intro';
          ensure();                                      /* t0 = 首个 rAF：后台标签页等可见才开演 */
        });
      }, 350);
    };
    if (!document.documentElement.classList.contains('loading')) go();
    else document.addEventListener('loaderdone', go, { once: true });
  }

  function init(list) {
    var hero = document.querySelector('.hero');
    var frontLayer = document.querySelector('.ribbon-front');
    if (!hero || !frontLayer || frontLayer.dataset.ready) return;   /* 幂等：locale 切换免重建 */
    var items = (list || []).filter(function (p) { return p && p.id; });
    if (!items.length) return;
    frontLayer.dataset.ready = '1';

    els = {
      hero: hero,
      frontLayer: frontLayer,
      backLayer: document.querySelector('.ribbon-back'),
      frontW: frontLayer.querySelector('.ribbon-world'),
      backW: document.querySelector('.ribbon-back .ribbon-world'),
      hit: document.querySelector('.ribbon-hit'),
      nameText: document.querySelector('.hero-name-text')
    };

    N = items.length;
    cards = items.map(function (p, i) {
      var d = document.createElement('div');
      d.className = 'rcard';
      d.dataset.id = p.id;
      var img = document.createElement('img');
      img.src = 'assets/ribbon/' + p.id + '.jpg';        /* 约定路径派生卡图（640×427 · 3:2） */
      img.alt = '';
      img.loading = 'eager';
      img.decoding = 'async';
      img.draggable = false;
      if (i < 3) img.setAttribute('fetchpriority', 'high');
      img.addEventListener('error', function () {        /* 兜底：回退站内封面缩略图 */
        if (p.thumb && img.src.indexOf(p.thumb) < 0) img.src = p.thumb;
      });
      var sh = document.createElement('i');
      sh.className = 'rcard-shade';
      d.appendChild(img);
      d.appendChild(sh);
      els.frontW.appendChild(d);
      return { el: d, img: img, shade: sh, id: p.id, side: 1, phi: 0, _o: 0 };
    });

    geo = solveGeometry();
    S0 = geo.sEntry;                                     /* 头卡从画外起步 */
    sEnd = geo.R * U_END;
    omegaArc = BASE * 60 * D2R * geo.R;                  /* 巡航弧速 px/s（3°/s） */

    /* 先摆一帧 t=0 位（全部画外/远景），层淡入时不见空白 */
    writeWorlds(worldString(null));
    for (var i = 0; i < N; i++) {
      var u = uAtArc(S0 - i * geo.sLink, geo);
      var p = pathPos(u, geo);
      cards[i].el.style.transform =
        'translate3d(' + p[0].toFixed(1) + 'px,' + p[1].toFixed(1) + 'px,' + p[2].toFixed(1) + 'px)' +
        ' rotateY(' + (u * R2D).toFixed(3) + 'deg) rotateX(' + pathPsi(u).toFixed(2) + 'deg)';
      sideAndShade(cards[i], u);
    }

    /* 命中/点击：down 绑 hit 带 + front 容器（卡事件冒泡到容器，不逐卡绑——防闪总则第 4 条） */
    els.hit.addEventListener('pointerdown', onDown);
    frontLayer.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', function () { dragging = false; downT = 0; downCard = null; });

    if (REDUCE) { staticPose(); return; }                /* 静态降级：点击仍可用，零 rAF */

    if ('IntersectionObserver' in window) {              /* 离屏停 rAF */
      new IntersectionObserver(function (ents) {
        visible = ents[0].isIntersecting;
        ensure();
      }, { threshold: 0 }).observe(frontLayer);
    }

    var decodeGate = Promise.race([
      Promise.all(cards.map(function (c) {
        return c.img.decode ? c.img.decode().catch(function () {}) : Promise.resolve();
      })),
      new Promise(function (res) { setTimeout(res, 1800); })
    ]);
    armStart(decodeGate);
  }

  /* resize/断点切换：重解几何。飞入途中遭遇 → 直接跳剪到环态（半途重校准不值得） */
  function relayout() {
    if (!geo || !cards.length) return;
    geo = solveGeometry();
    S0 = geo.sEntry;
    sEnd = geo.R * U_END;
    omegaArc = BASE * 60 * D2R * geo.R;
    if (mode === 'intro') {
      for (var i = 0; i < N; i++) cards[i].phi = (U_END * R2D) - i * geo.dphi * R2D;
      theta = 0; vel = BASE; mode = 'ring';
    }
    if (mode === 'ring' || mode === 'static') {
      for (var j = 0; j < N; j++) cards[j].el.style.transform = slotTransform(cards[j].phi);
      writeWorlds(worldString(mode === 'ring' ? theta : 0));
    } else if (mode === 'idle') {                        /* loader 期间 resize：重摆 t=0 画外姿态 */
      writeWorlds(worldString(null));
      for (var k = 0; k < N; k++) {
        var u = uAtArc(S0 - k * geo.sLink, geo);
        var p = pathPos(u, geo);
        cards[k].el.style.transform =
          'translate3d(' + p[0].toFixed(1) + 'px,' + p[1].toFixed(1) + 'px,' + p[2].toFixed(1) + 'px)' +
          ' rotateY(' + (u * R2D).toFixed(3) + 'deg) rotateX(' + pathPsi(u).toFixed(2) + 'deg)';
      }
    }
    ensure();
  }

  window.Ribbon = { init: init, relayout: relayout };
})();
