/* ════════════════════════════════════════════════════════════
   ribbon.js — 英雄区 3D 作品丝带（2026-07-11 三迭代：strip 切片真弯曲版）。

   带体（用户核心裁定「这是一条丝带，不是一个个卡片」）：
   等高混宽——带高 H 恒定，卡宽 = H×各自原始宽高比（方/竖/横原比例，无白边 pad）；
   每卡切 N 条竖直窄条（相邻折角 ≤4°），每条 strip 是传送带上的独立链节，
   带体在路径任意曲率处连续弯曲。共 ~93 条，DOM 只建一次（strip 数尺度不变）。

   模型（镜像传送带，无状态混合）：路径 pos(u)=(−r·sin u, lift, r·cos u + pull)，
   u≥0 段=环本身（lift=pull=0），u<0 段（q=−u）=入场螺线：
   pull 恒负（远景小，「从小丝滑到大」）、lift 正（掠屏幕底部）、
   x=r·sin q 自然完成「左下远景 → 掠底向右 → 右侧卷起 → 前弧右→左成环」。
   头部弧长 S(t)=S0+ΔS·easeOutSine+ω·R·t 终端斜率恰=巡航弧速，u=0 处 C¹ 融进环态；
   sEnd = L = 2πR（混宽环精确闭合，合拢缝=卡间缝、自然落正前）。环自转 ω 为负
   （前弧右→左，与入场方向连续）。

   深度遮挡（双容器 z-split）：.ribbon-back(z1)/.ribbon-front(z4) 夹大字(z2)，
   strip 按世界深度 z_w = −Zoff + R·cos(θ+φ)·cosτ 正负迁移 DOM（±90° 侧棱 + 迟滞）。
   ⚠️ 禁给两容器套共用 transform wrapper。铁律：逐帧只写 transform/opacity；
   投影 scale 恒 ≤1（防合成层放大糊）；strip 零 CSS transition（DOM 迁移会重置）。
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
  var TILT = -26;                /* 环倾斜 rotateX（deg）：五迭代 −22→−26——椭圆更扁，前弧
                                    只从字下缘掠过（用户批 −22 时前弧「拦腰截断」标题） */
  var BANK = -4;                 /* 环斜置 rotateZ（deg）：微斜，不把后弧压回标题（−7→−4） */
  var COVER = 0.30;              /* 前弧带顶边锚在标题 (1−COVER) 高度线（名义值）；实际构图通常由
                                    header 守卫接管：后弧顶贴 hero 顶 → 大倾角自然把前弧压到字下缘。
                                    环「套住」标题（前弧字前/后弧字后），勿再让环与标题分离 */
  var MARGIN_Z = 40;             /* 世界深度上限 −40px：投影 scale 恒 <1 */
  var H_DIV = 2.15;              /* 带高 H = token 宽 ÷ H_DIV（旋钮：前弧偏大则加大） */
  var X_FRAC = 0.30;             /* 环投影半宽 = X_FRAC×vw（旋钮） */
  var BASE = 0.05;               /* 巡航速率量值 3°/s；环向 = 负（前弧右→左） */
  var FRICTION = 0.95;           /* 松手惯性摩擦/帧 */
  var VEL_MAX = 0.8;             /* 惯性上限 °/帧 */
  var PSI_MAX = 35;              /* 飞入扭转峰值（deg，绕路径切线） */
  var HYST = Math.sin(1.5 * D2R);/* 迁移迟滞 ±1.5° */
  var INTRO_DUR = 4600;          /* 飞入幕时长（ms）：easeOutSine 终点导数 0 → C¹ 融进巡航 */
  var SEAM = 0.08;               /* 卡间缝 = 0.08H（参与环闭合） */
  var MAX_FOLD = 4 * D2R;        /* 相邻 strip 折角上限（弯曲顺滑度） */
  var OVERLAP = 0.75;            /* strip 重叠 px：防投影取整白缝 */
  var Q_REF = 3.9;               /* 定标锚：远端参考弧角（rad） */
  var SCALE_FAR = 0.42;          /* 定标锚：远端投影 scale（入场「小」的程度） */
  var BOT_FRAC = 0.55;           /* 定标锚：掠底点投影 y = 0.55×半层高（层下半） */

  var strips = [];               /* {el, img, shade, id, s, w, side, phi, _o} */
  var cardsMeta = [];            /* {id, src, thumb, aspect, w, start, n} */
  var geo = null;
  var mode = 'idle';             /* idle → intro → ring；REDUCE → static */
  var theta = 0, vel = -BASE;    /* 环态自转（deg / deg每帧，负=前弧右→左） */
  var tIntro = 0, S0 = 0, sEnd = 0, omegaArc = 0;
  var raf = null, visible = true, lastT = 0;
  var dragging = false, px = 0, lastDx = 0, downX = 0, downY = 0, downT = 0, downCard = null;
  var par = { tx: 0, ty: 0, x: 0, y: 0 };
  var els = null;

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ── 镜像路径（环局部坐标，y 向下为正；tilt/bank 由 world 统一施加） ── */
  function pathPos(u, g) {
    var q = Math.max(0, -u);
    var r = g.R * (1 + 0.22 * Math.pow(q, 1.7));
    var lift = g.ky * Math.pow(q, 1.4);                /* 正=向下：掠屏幕底部 */
    var pull = -g.kz * Math.pow(q, 1.6);               /* 恒负：入场远景小（从小到大） */
    return [-r * Math.sin(u), lift, r * Math.cos(u) + pull];
  }
  function pathPsi(u) {          /* 绕切线扭转：u=0 处零值零导（C¹ 融进环态） */
    var q = Math.max(0, -u);
    var f = Math.min(1, q / 1.2);
    var sm = f * f * (3 - 2 * f);
    return PSI_MAX * sm * sm;
  }
  /* 相机空间 z / 投影 scale / 屏幕坐标（CSS rotateX：z' = y·sinT + z·cosT；bank 定标时忽略） */
  function camZ(p, g) { return -g.Zoff + p[1] * g.sinT + p[2] * g.cosT; }
  function projScale(p, g) { return PERSP / (PERSP - camZ(p, g)); }
  function screenY(p, g) {       /* 相对层中心（含 yc） */
    return (g.yc + p[1] * g.cosT - p[2] * g.sinT) * projScale(p, g);
  }

  /* ── 几何解算：带高 H 从 probe 量（--ribbon-card-w = 3:2 等效卡宽），全部像素 JS 算 ── */
  function solveGeometry() {
    var tokenW = els.probe.offsetWidth || 420;
    var H = tokenW / H_DIV;
    var vw = window.innerWidth;
    var layer = els.frontLayer.getBoundingClientRect();

    /* 等高混宽带：卡宽 = H×aspect；L 含 11 条卡间缝；R = L/2π 精确闭合 */
    var L = 0;
    cardsMeta.forEach(function (c) { c.w = H * c.aspect; c.start = L; L += c.w + SEAM * H; });
    var R = L / (2 * Math.PI);
    var Zoff = Math.max(PERSP * (R / (X_FRAC * vw) - 1),
      R * Math.cos(TILT * D2R) + MARGIN_Z);

    var g = {
      H: H, R: R, L: L, Zoff: Zoff,
      cosT: Math.cos(TILT * D2R), sinT: Math.sin(TILT * D2R),
      yc: 0,
      sf: PERSP / (PERSP + Zoff - R * Math.cos(TILT * D2R)),   /* 前弧投影 scale */
      ky: 0.07 * R, kz: 0,
      gain: 0, arcU: null, arcS: null, uEntry: 0, sEntry: 0
    };
    g.gain = R2D / (R * g.sf);                         /* 拖拽：前弧带贴手指（°/px） */

    /* 环心纵向：桌面由「前弧带顶边 = 标题 (1−COVER) 高度线」反解世界 y——前弧压字前、
       后弧从字后/字上方绕过，环「套住」标题；守卫：后弧顶不得越出 hero 顶压 header。
       手机档对 hero 中心（三段式布局） */
    var sinAbsT = Math.sin(-TILT * D2R);
    var sb = PERSP / (PERSP + Zoff + R * g.cosT);      /* 后弧投影 scale */
    if (!MOBILE.matches && els.nameText) {
      var nameTop = 0, e = els.nameText;
      while (e && e !== els.hero) { nameTop += e.offsetTop; e = e.offsetParent; }
      var nameH = els.nameText.offsetHeight;
      var frontTop = nameTop + nameH * (1 - COVER) - layer.height / 2;
      g.yc = (frontTop + (H / 2) * g.sf) / g.sf - R * sinAbsT;
      var backTopMin = 8 - layer.height / 2;           /* 后弧顶最高到 hero 顶 +8px */
      var backTop = (g.yc - R * sinAbsT) * sb - (H / 2) * sb;
      if (backTop < backTopMin) {
        g.yc = (backTopMin + (H / 2) * sb) / sb + R * sinAbsT;
      }
    }
    g.sb = sb;

    /* 定标二元二轮：kz=远端(Q_REF)投影 scale=SCALE_FAR；ky=掠底点(q=π)投影 y=BOT_FRAC×半层高。
       kz 允许负（螺线 r 外扩本身已把远端推小，基线可能低于目标；负 kz=微拉近，
       近端 q→0 处 pull→0 保 C¹，最近点仍是环前弧、MARGIN 守卫不破） */
    var round, target = BOT_FRAC * layer.height / 2;
    for (round = 0; round < 2; round++) {
      g.kz = bisect(-30, 60, function (kz) {           /* scale 随 kz 单调递减（更远更小） */
        g.kz = kz; return SCALE_FAR - projScale(pathPos(-Q_REF, g), g);
      });
      g.ky = bisect(0, 4 * g.R / Math.pow(Math.PI, 1.4), function (ky) {
        g.ky = ky; return screenY(pathPos(-Math.PI, g), g) - target;  /* y 随 ky 单调增 */
      });
    }

    /* 入场扫描：u 从 −π 向下，直到带体在左侧完全出画 */
    var u = -Math.PI - 0.05;
    while (u > -2.6 * Math.PI) {
      var p = pathPos(u, g);
      var s = projScale(p, g);
      if (p[0] * s < -(vw / 2 + 1.5 * H * s)) break;
      u -= 0.08;
    }
    g.uEntry = u;

    /* 弧长表（u<0 段重参数化；u≥0 解析 = R·u）：向下积到覆盖 |入场弧长| + 全带长 L */
    var us = [0], ss = [0], acc = 0, prev = pathPos(0, g), du = 0.008, need = 0;
    for (u = -du; u > -30; u -= du) {
      var pt = pathPos(u, g);
      acc -= Math.hypot(pt[0] - prev[0], pt[1] - prev[1], pt[2] - prev[2]);
      prev = pt;
      us.push(u); ss.push(acc);
      if (u <= g.uEntry && !need) need = acc;
      if (need && acc < need - L - 60) break;
    }
    g.arcU = us; g.arcS = ss; g.sEntry = need || ss[ss.length - 1];
    return g;
  }
  function bisect(lo, hi, f) {   /* f 在 [lo,hi] 上单调变号；返回零点（30 轮足够） */
    var flo = f(lo);
    for (var i = 0; i < 30; i++) {
      var m = (lo + hi) / 2;
      if ((f(m) < 0) === (flo < 0)) { lo = m; } else { hi = m; }
    }
    return (lo + hi) / 2;
  }
  function uAtArc(s, g) {
    if (s >= 0) return s / g.R;
    var ss = g.arcS, lo = 0, hi = ss.length - 1;
    if (s <= ss[hi]) return g.arcU[hi];
    while (hi - lo > 1) {                              /* ss 单调递减（负向） */
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
  function stripIntroTransform(st, S) {
    var u = uAtArc(S - st.s, geo);
    var p = pathPos(u, geo);
    st.el.style.transform =
      'translate3d(' + p[0].toFixed(1) + 'px,' + p[1].toFixed(1) + 'px,' + p[2].toFixed(1) + 'px)' +
      ' rotateY(' + (-u * R2D).toFixed(3) + 'deg) rotateX(' + pathPsi(u).toFixed(2) + 'deg)';
    return u;
  }
  /* 迁移 + 深度/背面遮罩（strip 粒度；只写 opacity，Δ>0.004 才写） */
  function sideAndShade(st, effRad) {
    var c = Math.cos(effRad);
    var side = st.side;
    if (c > HYST) side = 1; else if (c < -HYST) side = -1;
    if (side !== st.side) {
      st.side = side;
      (side === 1 ? els.frontW : els.backW).appendChild(st.el);
    }
    /* 白纱淡出（五迭代用户裁定：带到名字「后面」要变得很淡，分清前后无截断感）：
       shade=白色罩，越靠后越浓 → 带体向暖白底淡去；前弧近乎全彩 */
    var o = c >= 0 ? 0.06 * (1 - c) : Math.min(0.82, 0.06 + 0.72 * (-c));
    if (Math.abs(o - st._o) > 0.004) {
      st.shade.style.opacity = o.toFixed(3);
      st._o = o;
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
  function freezeToRing(S) {                           /* 冻结槽位切环态（φ=−u，环向为负） */
    for (var i = 0; i < strips.length; i++) {
      strips[i].phi = -uAtArc(S - strips[i].s, geo) * R2D;
      strips[i].el.style.transform = slotTransform(strips[i].phi);
    }
    theta = 0; vel = -BASE; mode = 'ring';
  }

  function render(now) {
    raf = null;
    if (!lastT) lastT = now;
    var dtMs = now - lastT;
    if (dtMs > 1000) dtMs = 16.7;                      /* 后台/离屏归来：整体重基，不追帧 */
    var dt = Math.min(dtMs / 16.7, 3);
    lastT = now;

    /* 视差只在环态生效（五迭代：飞入是纯编舞——途中视差起步会造成「临近标题的小抖动」，
       世界层与标题反向错动 ~20px；环成后从 0 lerp 进入，天然平滑） */
    if (HOVERFINE.matches && mode === 'ring') {
      var k = 1 - Math.pow(0.94, dt);
      par.x += (par.tx - par.x) * k;
      par.y += (par.ty - par.y) * k;
      writeNameParallax();
    }

    if (mode === 'intro') {
      tIntro += dtMs;
      var x = Math.min(1, tIntro / INTRO_DUR);
      var ease = Math.sin(x * Math.PI / 2);            /* easeOutSine：近匀速出发、渐歇 */
      var S = S0 + (sEnd - S0) * ease + omegaArc * tIntro / 1000;
      writeWorlds(worldString(null));
      for (var i = 0; i < strips.length; i++) {
        var u = stripIntroTransform(strips[i], S);
        sideAndShade(strips[i], -u);                   /* eff = θ+φ = −u（θ=0） */
      }
      if (x >= 1) freezeToRing(S);
    } else if (mode === 'ring') {
      if (dragging) {
        lastDx *= Math.pow(0.8, dt);
      } else {
        vel = -BASE + (vel + BASE) * Math.pow(FRICTION, dt);   /* 收敛到 −BASE（右→左巡航） */
        theta += vel * dt;
      }
      writeWorlds(worldString(theta));
      for (var j = 0; j < strips.length; j++) {
        sideAndShade(strips[j], (theta + strips[j].phi) * D2R);
      }
    }

    if (visible && mode !== 'idle') raf = requestAnimationFrame(render);
  }
  function ensure() { if (!raf && visible && mode !== 'idle') { lastT = 0; raf = requestAnimationFrame(render); } }

  /* ── REDUCE 静态定格：θ=0 环态（合拢缝自然在正前），零 rAF；点击仍可用 ── */
  function staticPose() {
    writeWorlds(worldString(0));
    for (var i = 0; i < strips.length; i++) {
      strips[i].phi = -((geo.L - strips[i].s) / geo.R) * R2D;
      strips[i].el.style.transform = slotTransform(strips[i].phi);
      sideAndShade(strips[i], strips[i].phi * D2R);
    }
    mode = 'static';
  }

  /* ── 点击 vs 拖拽（down 绑 .ribbon-hit + .ribbon-front 冒泡；move/up 走 window） ── */
  function onDown(e) {
    if (mode !== 'ring' && mode !== 'static') return;
    dragging = mode === 'ring';
    px = e.clientX; lastDx = 0;
    downX = e.clientX; downY = e.clientY; downT = performance.now();
    downCard = e.target && e.target.closest ? e.target.closest('.rstrip') : null;
  }
  function onMove(e) {
    if (HOVERFINE.matches && !dragging && mode === 'ring') {   /* 视差目标仅环态更新 */
      par.tx = e.clientX / window.innerWidth * 2 - 1;
      par.ty = e.clientY / window.innerHeight * 2 - 1;
    }
    if (!dragging) return;
    var dx = e.clientX - px;
    theta += dx * geo.gain;
    lastDx = dx;
    px = e.clientX;
  }
  function onUp(e) {
    var wasDown = downT > 0;
    if (dragging) {
      dragging = false;
      vel = clamp(-BASE + lastDx * geo.gain, -VEL_MAX, VEL_MAX);
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
    target.scrollIntoView({ block: 'start' });         /* 不传 smooth：吃全局 scroll-behavior，RM 自动瞬跳 */
    target.classList.add('jump-hit');
    setTimeout(function () { target.classList.remove('jump-hit'); }, 950);
  }

  /* ── 建带（decode 门后：读 naturalW/H 得原始比例 → 切 strip → 解几何 → 摆画外首帧） ──
     strip 数按折角上限定（尺度不变量），resize 只重解几何不重建 DOM */
  function buildStrips() {
    if (strips.length) return;
    var sumA = 0;
    cardsMeta.forEach(function (c) {
      c.aspect = (c.pre.naturalWidth && c.pre.naturalHeight)
        ? c.pre.naturalWidth / c.pre.naturalHeight : 1.5;
      sumA += c.aspect;
    });
    var R_H = (sumA + cardsMeta.length * SEAM) / (2 * Math.PI);   /* 以 H 为单位的环半径 */
    var frag = document.createDocumentFragment();
    cardsMeta.forEach(function (c) {
      c.n = Math.max(3, Math.ceil((c.aspect / R_H) / MAX_FOLD));
      for (var j = 0; j < c.n; j++) {
        var d = document.createElement('div');
        d.className = 'rstrip' + (j === 0 ? ' rstrip--head' : '') +
          (j === c.n - 1 ? ' rstrip--tail' : '');
        d.dataset.id = c.id;
        var img = document.createElement('img');
        img.src = c.src;
        img.alt = '';
        img.decoding = 'async';
        img.draggable = false;
        img.addEventListener('error', function () {
          if (c.thumb && img.src.indexOf(c.thumb) < 0) img.src = c.thumb;
        });
        var sh = document.createElement('i');
        sh.className = 'rstrip-shade';
        d.appendChild(img);
        d.appendChild(sh);
        frag.appendChild(d);
        strips.push({ el: d, img: img, shade: sh, id: c.id, card: c, j: j, s: 0, w: 0, side: 1, phi: 0, _o: 0 });
      }
    });
    els.frontW.appendChild(frag);
    relayout();                                        /* 解几何 + 写布局 + 摆 idle 首帧 */
  }
  /* 环的地面阴影：椭圆压在前弧下缘（重量感，静态透明度不呼吸）；仅 relayout 写 */
  function layoutFloor() {
    if (!els.floor) return;
    var layerH = els.frontLayer.getBoundingClientRect().height;
    var layerW = els.frontLayer.getBoundingClientRect().width;
    var frontBottom = layerH / 2 +
      (geo.yc + geo.R * Math.sin(-TILT * D2R)) * geo.sf + (geo.H / 2) * geo.sf;
    var halfW = geo.R * PERSP / (PERSP + geo.Zoff);    /* 环投影半宽（侧棱深度处） */
    var w = halfW * 2 * 1.06;
    var h = Math.max(46, halfW * 0.3);
    els.floor.style.width = w.toFixed(0) + 'px';
    els.floor.style.height = h.toFixed(0) + 'px';
    els.floor.style.left = ((layerW - w) / 2).toFixed(0) + 'px';
    els.floor.style.top = (frontBottom - h * 0.35).toFixed(0) + 'px';
  }
  /* 布局尺寸写 px（仅 init/relayout；宽随卡变）+ 弧长偏移 s */
  function layoutStrips() {
    strips.forEach(function (st) {
      var c = st.card;
      var sw = c.w / c.n;
      st.w = sw;
      st.s = c.start + (st.j + 0.5) * sw;
      st.el.style.width = (sw + OVERLAP).toFixed(2) + 'px';
      st.el.style.height = geo.H.toFixed(2) + 'px';
      st.el.style.marginLeft = (-(sw + OVERLAP) / 2).toFixed(2) + 'px';
      st.el.style.marginTop = (-geo.H / 2).toFixed(2) + 'px';
      st.img.style.width = c.w.toFixed(2) + 'px';
      st.img.style.height = geo.H.toFixed(2) + 'px';
      st.img.style.left = (OVERLAP / 2 - st.j * sw).toFixed(2) + 'px';
    });
  }

  function armStart(prepared) {
    var go = function () {
      setTimeout(function () {
        prepared.then(function () {
          if (mode !== 'idle' || REDUCE) return;
          tIntro = 0; mode = 'intro';
          ensure();                                    /* t0 = 首个 rAF：后台/离屏等可见才开演 */
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

    var probe = document.createElement('div');         /* 量 --ribbon-card-w 落地值（带高 H=÷1.5） */
    probe.style.cssText = 'position:absolute;visibility:hidden;width:var(--ribbon-card-w);height:0;';
    hero.appendChild(probe);

    els = {
      hero: hero,
      probe: probe,
      frontLayer: frontLayer,
      frontW: frontLayer.querySelector('.ribbon-world'),
      backW: document.querySelector('.ribbon-back .ribbon-world'),
      hit: document.querySelector('.ribbon-hit'),
      floor: document.querySelector('.ribbon-floor'),
      nameText: document.querySelector('.hero-name-text')
    };

    /* 预载 11 张卡图（原比例派生版），decode 门后才知带形（naturalW/H） */
    cardsMeta = items.map(function (p, i) {
      var pre = new Image();
      if (i < 3) pre.fetchPriority = 'high';
      pre.src = 'assets/ribbon/' + p.id + '.jpg';
      return { id: p.id, src: pre.src, thumb: p.thumb, pre: pre, aspect: 1.5, w: 0, start: 0, n: 0 };
    });
    var decodeGate = Promise.race([
      Promise.all(cardsMeta.map(function (c) {
        return c.pre.decode ? c.pre.decode().catch(function () {}) : Promise.resolve();
      })),
      new Promise(function (res) { setTimeout(res, 1800); })
    ]);
    var prepared = decodeGate.then(buildStrips);

    els.hit.addEventListener('pointerdown', onDown);   /* 卡事件冒泡到容器，不逐条绑（防闪总则第 4 条） */
    frontLayer.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', function () { dragging = false; downT = 0; downCard = null; });

    if ('IntersectionObserver' in window) {            /* 离屏停 rAF */
      new IntersectionObserver(function (ents) {
        visible = ents[0].isIntersecting;
        ensure();
      }, { threshold: 0 }).observe(frontLayer);
    }

    if (REDUCE) { prepared.then(staticPose); return; }
    armStart(prepared);
  }

  /* resize/断点：重解几何+重写布局（DOM 不重建）。飞入途中遭遇 → 直接跳剪到环态 */
  function relayout() {
    if (!strips.length) return;
    geo = solveGeometry();
    S0 = geo.sEntry;
    sEnd = geo.L;                                      /* = 2πR：头尾精确合拢 */
    omegaArc = BASE * 60 * D2R * geo.R;
    layoutStrips();
    layoutFloor();
    if (mode === 'intro') { freezeToRing(sEnd + omegaArc * tIntro / 1000); return; }
    if (mode === 'ring' || mode === 'static') {
      for (var j = 0; j < strips.length; j++) {
        strips[j].phi = -((geo.L - strips[j].s) / geo.R) * R2D;
        strips[j].el.style.transform = slotTransform(strips[j].phi);
      }
      writeWorlds(worldString(mode === 'ring' ? theta : 0));
    } else {                                           /* idle：摆 t=0 画外姿态（层淡入不见空白） */
      writeWorlds(worldString(null));
      for (var i = 0; i < strips.length; i++) {
        var u = stripIntroTransform(strips[i], S0);
        sideAndShade(strips[i], -u);
      }
    }
    ensure();
  }

  window.Ribbon = {
    init: init, relayout: relayout,
    /* 手动泵一帧 + 重启时间轴（调试/隐藏标签页环境确定性验证用，沿 IndexFx.tick 先例）：
       传伪造时间戳逐帧驱动 render，配合替换 requestAnimationFrame 可离线扫描动画 */
    _pump: function (ts) { raf = null; render(ts); },
    _restart: function () {
      if (!strips.length) return false;
      tIntro = 0; theta = 0; vel = -BASE; lastT = 0; mode = 'intro';
      return true;
    }
  };
})();
