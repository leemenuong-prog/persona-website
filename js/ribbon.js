/* ════════════════════════════════════════════════════════════
   ribbon.js — 英雄区 3D 作品丝带（2026-07-12 Canvas 连续化改版）。

   带体 = 连续曲面 B(s,v) = C(u(s)) + v·ŷ(u(s))（用户核心裁定「这是一条丝带，
   不是一个个卡片」的连续极限）：等高混宽——带高 H 恒定，卡宽 = H×各自原始
   宽高比（比例从 projects.json ribbon:{w,h} 来，几何同步可解、不等图片解码）。
   渲染 = 屏幕空间自适应微切片进双 canvas（js/ribbon-render.js）：切片宽
   ≤1.25 CSS px、片内高差 ≤0.5px（侧棱自动加密），整条带在同一张栅格以连续
   覆盖率成像——旧 DOM strip 方案（~138 平面各自栅格化）的切片锯齿从机理上根除。

   模型（镜像传送带，无状态混合）：路径 pos(u)=(−r·sin u, lift, r·cos u + pull)，
   u≥0 段=环本身（lift=pull=0），u<0 段（q=−u）=入场螺线：
   pull 恒负（远景小，「从小丝滑到大」）、lift 正（掠屏幕底部）、
   x=r·sin q 自然完成「左下远景 → 掠底向右 → 右侧卷起 → 前弧右→左成环」。
   头部弧长 S(t)=S0+ΔS·easeInOutSine+ω·R·t 终端斜率恰=巡航弧速，u=0 处 C¹ 融进环态；
   sEnd = L = 2πR（混宽环精确闭合，合拢缝=卡间缝、自然落正前）。环自转 ω 为负
   （前弧右→左，与入场方向连续）。环态相位由 ringS 吸收（intro 冻结含 ω 过冲，
   relayout 重置为 L）。

   深度遮挡（双画布 z-split）：.ribbon-back(z1)/.ribbon-front(z4) 两张 canvas
   夹大字(z2)，切片按 cos(θ+φ) 符号分派前/后画布（跨界切片+相邻切片两边补画，
   焊死交界针孔）；每帧整幅重画，无 DOM 迁移。⚠️ 禁给两容器套共用 transform
   wrapper（会挡掉大字的 z-index 夹层）。白纱深度淡出与调色烧在渲染端。
   入场即时（2026-07-12 用户裁定）：loaderdone 即开演、零延迟零解码门，
   未就绪的卡由 atlas 灰占位顶上、decode 到一张贴一张。
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
  var PERSP = 1500;              /* 透视深度（原 CSS perspective 同值，现由采样器投影） */
  var TILT = -26;                /* 环倾斜 rotateX（deg）：五迭代 −22→−26——椭圆更扁，前弧
                                    只从字下缘掠过（用户批 −22 时前弧「拦腰截断」标题） */
  var BANK = -4;                 /* 环斜置 rotateZ（deg）：微斜，不把后弧压回标题（−7→−4） */
  var COVER = 0.30;              /* 前弧带顶边锚在标题 (1−COVER) 高度线（名义值）；实际构图通常由
                                    header 守卫接管：后弧顶贴 hero 顶 → 大倾角自然把前弧压到字下缘。
                                    环「套住」标题（前弧字前/后弧字后），勿再让环与标题分离 */
  var MARGIN_Z = 40;             /* 世界深度上限 −40px：投影 scale 恒 <1 */
  var H_DIV = 2.15;              /* 带高 H = token 宽 ÷ H_DIV（旋钮：前弧偏大则加大） */
  var X_FRAC = 0.30;             /* 环投影半宽 = X_FRAC×vw（桌面/平板；手机档见 solveGeometry） */
  var BASE = 0.05;               /* 巡航速率量值 3°/s；环向 = 负（前弧右→左） */
  var FRICTION = 0.95;           /* 松手惯性摩擦/帧 */
  var VEL_MAX = 0.8;             /* 惯性上限 °/帧 */
  var PSI_MAX = 35;              /* 飞入扭转峰值（deg，绕路径切线） */
  var INTRO_DUR = 6000;          /* 飞入幕时长（ms）。七迭代速度曲线重设计（用户「按速度曲线设计」）：
                                    easeInOutSine 钟形——起步=巡航速（缓起，带子徐徐探入）→ 中段峰值
                                    1.57×均速（掠底冲刺）→ 终点导数 0（缓落，终端斜率恰=ω·R，
                                    C¹ 融进巡航）；两端皆柔，总时长 4.6→6s 整体放缓 */
  var SEAM = 0.025;              /* 卡间缝 = 0.025H（参与环闭合；atlas 中为透明列，不出切片） */
  var Q_REF = 3.9;               /* 定标锚：远端参考弧角（rad） */
  var SCALE_FAR = 0.36;          /* 定标锚：远端投影 scale。六迭代 0.42→0.36（入场更远更小，
                                    ——用户「飞远一些」） */
  var BOT_FRAC = 0.55;           /* 定标锚：掠底点投影 y = 0.55×半层高（层下半） */
  var SLICE_W = 1.25;            /* 切片屏幕宽上限（CSS px）——细到 AA 下呈连续 */
  var SLICE_DH = 0.5;            /* 切片内投影高差上限（CSS px）：侧棱自动加密 */
  var OFF_RELAX = 24;            /* 离屏段的细分预算放宽倍数（少画看不见的） */
  var RUNG_MAX = 4000;

  var DESKTOP = window.matchMedia('(min-width: 1024px)');
  var spineTicks = null, spineBase = null, spineCk = 0;   /* 中轴轴头涟漪缓存（环↔进度轴互动） */
  var cardsMeta = [];            /* {id, src, thumb, pre, aspect, w, start} */
  var geo = null;
  var renderer = null;           /* RibbonRender 实例（js/ribbon-render.js） */
  var mode = 'idle';             /* idle → intro → ring；REDUCE → static */
  var theta = 0, vel = -BASE;    /* 环态自转（deg / deg每帧，负=前弧右→左） */
  var tIntro = 0, S0 = 0, sEnd = 0, omegaArc = 0;
  var ringS = 0;                 /* 环态弧长基准（intro 冻结时的 S；relayout 重置为 L） */
  var lastS = 0;                 /* intro 当前弧长头（idle = S0；供单帧重绘） */
  var raf = null, visible = true, lastT = 0;
  var dragging = false, px = 0, lastDx = 0, downX = 0, downY = 0, downT = 0, downCard = null;
  var par = { tx: 0, ty: 0, x: 0, y: 0 };
  var els = null;
  var lastCursor = '';
  var activePointer = null;      /* 起手那根指的 pointerId；防多指交替污染拖拽基准 */
  var lastGeoKey = '';           /* 上次解几何的尺寸指纹；相同则 relayout 跳过（iOS 地址栏收放 resize 空转+跳剪防线） */
  var rungBuf = new Float32Array(8 * RUNG_MAX);
  var rungTmp = new Float32Array(8);
  var mRot = {                   /* 预计算 Rz(BANK)·Rx(TILT) 系数（世界旋转，常量） */
    cB: Math.cos(BANK * D2R), sB: Math.sin(BANK * D2R),
    cT: Math.cos(TILT * D2R), sT: Math.sin(TILT * D2R)
  };

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ── 镜像路径（环局部坐标，y 向下为正；tilt/bank 由世界旋转统一施加） ── */
  /* ⚠️ 七迭代曲率连续铁律：三个形状函数的指数一律 ≥2.2——指数 <2 时二阶导在 q→0
     发散 = 路径曲率在「螺线并入环」处有无穷尖峰，带子过接环点必折一下；
     ≥2.2 时附加曲率在接环点归零，κ 连续、切线丝滑 */
  function pathPos(u, g) {
    var q = Math.max(0, -u);
    var r = g.R * (1 + 0.08 * Math.pow(q, 2.2));       /* 外扩（π 处 ≈2R，与旧版同 reach） */
    var lift = g.ky * Math.pow(q, 2.4);                /* 正=向下：掠屏幕底部 */
    var pull = -g.kz * Math.pow(q, 2.4);               /* 恒负：入场远景小（从小到大） */
    return [-r * Math.sin(u), lift, r * Math.cos(u) + pull];
  }
  function pathPsi(u) {          /* 绕切线扭转：u=0 处零值零导（C¹ 融进环态）。
                                    七迭代斜坡 1.8 rad：扭转梯度削峰 */
    var q = Math.max(0, -u);
    var f = Math.min(1, q / 1.8);
    var sm = f * f * (3 - 2 * f);
    return PSI_MAX * sm * sm;
  }
  /* 相机空间 z / 投影 scale / 屏幕坐标（CSS rotateX 同式：z' = y·sinT + z·cosT；bank 定标时忽略） */
  function camZ(p, g) { return -g.Zoff + p[1] * g.sinT + p[2] * g.cosT; }
  function projScale(p, g) { return PERSP / (PERSP - camZ(p, g)); }
  function screenY(p, g) {       /* 相对层中心（含 yc） */
    return (g.yc + p[1] * g.cosT - p[2] * g.sinT) * projScale(p, g);
  }

  /* ── 几何解算：带高 H 从 probe 量（--ribbon-card-w = 3:2 等效卡宽），全部像素 JS 算 ── */
  function solveGeometry() {
    var tokenW = els.probe.offsetWidth || 420;
    var H = tokenW / H_DIV;
    /* 视口宽用 clientWidth（布局视口）：innerWidth 含滚动条、且个别环境会报设备像素，
       曾致几何解算整体崩坏（2026-07-12 实测） */
    var vw = document.documentElement.clientWidth || window.innerWidth;
    var layer = els.frontLayer.getBoundingClientRect();

    /* 等高混宽带：卡宽 = H×aspect；L 含 11 条卡间缝；R = L/2π 精确闭合 */
    var L = 0;
    cardsMeta.forEach(function (c) { c.w = H * c.aspect; c.start = L; L += c.w + SEAM * H; });
    var R = L / (2 * Math.PI);
    /* 手机档环放大（2026-07-12 用户裁定「环套标题」后环成主角）：投影半宽占比上调 */
    var xf = MOBILE.matches ? 0.42 : X_FRAC;
    var Zoff = Math.max(PERSP * (R / (xf * vw) - 1),
      R * Math.cos(TILT * D2R) + MARGIN_Z);

    var g = {
      H: H, R: R, L: L, Zoff: Zoff,
      layerW: layer.width, layerH: layer.height,
      cosT: Math.cos(TILT * D2R), sinT: Math.sin(TILT * D2R),
      yc: 0,
      sf: PERSP / (PERSP + Zoff - R * Math.cos(TILT * D2R)),   /* 前弧投影 scale */
      ky: 0.07 * R, kz: 0,
      gain: 0, arcU: null, arcS: null, uEntry: 0, sEntry: 0
    };
    g.gain = R2D / (R * g.sf);                         /* 拖拽：前弧带贴手指（°/px） */

    /* 环心纵向：由「前弧带顶边 = 标题 (1−COVER) 高度线」反解世界 y——前弧压字前、
       后弧从字后/字上方绕过，环「套住」标题；守卫：后弧顶不得越出 hero 顶压 header。
       2026-07-12 用户裁定：手机档同样环套标题（07-11 三段式「环对 hero 中心」废除） */
    var sinAbsT = Math.sin(-TILT * D2R);
    var sb = PERSP / (PERSP + Zoff + R * g.cosT);      /* 后弧投影 scale */
    if (els.nameText) {
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
      g.ky = bisect(0, 6 * g.R / Math.pow(Math.PI, 2.4), function (ky) {
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

  /* ── 采样器：连续带面 → 屏幕空间自适应 rung 序列（渲染由 ribbon-render 消费）。
     世界旋转 Rz(BANK)·Rx(TILT)、平移 (pxo, yc+pyo, −Zoff)、透视 PERSP 与旧 CSS
     transform 链逐像素同式（P0 对拍验证过）。rung 打包 stride 8：
     s, topX, topY, botX, botY, camZ, veil, flag（bit0=与前一 rung 间是缝不出切片，
     bit1=前侧）；坐标相对层中心 CSS px。 ── */
  function rungAt(s, fr, out) {
    var cx, cy0, cz, yx, yy, yz, eff;
    if (fr.ring) {
      var a = fr.thr - (ringS - s) / geo.R;          /* = (θ+φ) rad；ringS 吸收 intro 冻结相位 */
      cx = geo.R * Math.sin(a); cy0 = 0; cz = geo.R * Math.cos(a);
      yx = 0; yy = 1; yz = 0; eff = a;
    } else {
      var u = uAtArc(fr.S - s, geo);
      var p = pathPos(u, geo);
      cx = p[0]; cy0 = p[1]; cz = p[2];
      var psi = pathPsi(u) * D2R;                    /* ŷ = RotY(−u)·RotX(ψ)·(0,1,0) */
      var sp = Math.sin(psi), cp = Math.cos(psi), su = Math.sin(u), cu = Math.cos(u);
      yx = -sp * su; yy = cp; yz = sp * cu;
      eff = -u;
    }
    var hh = geo.H / 2, zsum = 0, i;
    for (i = 0; i < 2; i++) {
      var sg = i === 0 ? -1 : 1;
      var x = cx + sg * hh * yx, y = cy0 + sg * hh * yy, z = cz + sg * hh * yz;
      var y1 = y * mRot.cT - z * mRot.sT, z1 = y * mRot.sT + z * mRot.cT;
      var X = x * mRot.cB - y1 * mRot.sB + fr.pxo;
      var Y = x * mRot.sB + y1 * mRot.cB + fr.pyo;
      var Z = z1 - geo.Zoff;
      var w = PERSP / (PERSP - Z);
      out[1 + i * 2] = X * w;
      out[2 + i * 2] = Y * w;
      zsum += Z;
    }
    out[0] = s;
    out[5] = zsum / 2;
    var c = Math.cos(eff);                           /* 白纱与前后分派沿旧 sideAndShade 公式：
                                                        后弧最淡 0.82 白罩、前弧近全彩（勿改回压暗） */
    out[6] = c >= 0 ? 0.06 * (1 - c) : Math.min(0.82, 0.06 + 0.72 * (-c));
    out[7] = c >= 0 ? 2 : 0;
    return out;
  }
  function offEdge(r, lw2, lh2) {                    /* 两角同侧出画（含余量）→ 1..4，否则 0 */
    if (r[1] < -lw2 && r[3] < -lw2) return 1;
    if (r[1] > lw2 && r[3] > lw2) return 2;
    if (r[2] < -lh2 && r[4] < -lh2) return 3;
    if (r[2] > lh2 && r[4] > lh2) return 4;
    return 0;
  }
  function pushRung(n, seam) {
    var o = n * 8;
    for (var i = 0; i < 8; i++) rungBuf[o + i] = rungTmp[i];
    if (seam) rungBuf[o + 7] += 1;
    return n + 1;
  }
  function sampleFrame(fr) {
    var lw2 = geo.layerW / 2 + 80, lh2 = geo.layerH / 2 + 80;
    var n = 0, ci, c;
    for (ci = 0; ci < cardsMeta.length; ci++) {
      if (n >= RUNG_MAX - 1) break;                  /* 边界：连卡首 rung 也不越 rungBuf（否则返回计数超容量→越界 NaN 切片） */
      c = cardsMeta[ci];
      var send = c.start + c.w;
      var minDs = Math.max(c.w / 400, 0.05);
      rungAt(c.start, fr, rungTmp);
      n = pushRung(n, 1);                            /* 卡首：与上一卡之间是缝 */
      var pmx = (rungTmp[1] + rungTmp[3]) / 2, pmy = (rungTmp[2] + rungTmp[4]) / 2;
      var ph = Math.hypot(rungTmp[3] - rungTmp[1], rungTmp[4] - rungTmp[2]);
      var pOff = offEdge(rungTmp, lw2, lh2);
      var s = c.start, ds = 2 / geo.sf;
      while (s < send - 1e-4 && n < RUNG_MAX - 1) {
        var s2 = Math.min(s + ds, send);
        rungAt(s2, fr, rungTmp);
        var mx = (rungTmp[1] + rungTmp[3]) / 2, my = (rungTmp[2] + rungTmp[4]) / 2;
        var h2 = Math.hypot(rungTmp[3] - rungTmp[1], rungTmp[4] - rungTmp[2]);
        var off2 = offEdge(rungTmp, lw2, lh2);
        var relax = (pOff && off2 && pOff === off2) ? OFF_RELAX : 1;   /* 离屏段放宽预算 */
        var dx = Math.hypot(mx - pmx, my - pmy);     /* 中点位移（不只 x：侧棱竖直段也受控） */
        var dh = Math.abs(h2 - ph);
        if ((dx > SLICE_W * 1.35 * relax || dh > SLICE_DH * 1.5 * relax) && (s2 - s) > minDs) {
          ds = (s2 - s) / 2;
          continue;
        }
        n = pushRung(n, 0);
        if (dx < SLICE_W * 0.55 * relax && dh < SLICE_DH * 0.4 * relax) ds = Math.min(ds * 1.7, c.w);
        s = s2; pmx = mx; pmy = my; ph = h2; pOff = off2;
      }
    }
    return n;
  }
  function poseNow() {
    var pxo = 0, pyo = 0;
    if (HOVERFINE.matches) { pxo = par.x * 14; pyo = par.y * 10; }
    if (mode === 'ring' || mode === 'static') {
      return { ring: true, thr: (mode === 'ring' ? theta : 0) * D2R, pxo: pxo, pyo: geo.yc + pyo };
    }
    return { ring: false, S: mode === 'intro' ? lastS : S0, pxo: pxo, pyo: geo.yc + pyo };
  }
  function paintPose() {
    if (!renderer || !geo) return;
    renderer.frame(rungBuf, sampleFrame(poseNow()));
  }

  function writeNameParallax() {
    if (HOVERFINE.matches && els.nameText) {
      els.nameText.style.transform =
        'translate3d(' + (par.x * -8).toFixed(1) + 'px,' + (par.y * -5).toFixed(1) + 'px,0)';
    }
  }
  function freezeToRing(S) {                           /* 冻结相位切环态（含 ω 过冲，由 ringS 吸收） */
    ringS = S;
    theta = 0; vel = -BASE; mode = 'ring';
  }

  /* ── 环↔进度轴互动（七迭代）：环态下轴头 6 根短横线泛一道随 θ 行进的涟漪——
     环匀速转 → 轴头缓缓律动；拖拽拨环 → 涟漪随之加速。只动 transform、幅度克制；
     仅桌面（<1024 轴隐藏）且页面在顶部（滚动后让位给 tickSpine 的滚动波，两写不冲突） ── */
  function spineRipple() {
    if (!DESKTOP.matches || window.scrollY > 40) return;
    if (!spineTicks || !spineTicks.length || (++spineCk % 120 === 0 && !spineTicks[0].isConnected)) {
      var els2 = document.querySelectorAll('.line-container .spine-tick');
      if (!els2.length) { spineTicks = null; return; }
      /* 基准长按 IAM 节奏公式独立算（与 index-fx buildSpine 同式）——
         勿从当前 transform 读：滚动波/走过态（×2.1）会污染基准 */
      var bars = (window.Barmorph && window.Barmorph.IAM_BARS) ||
        [0.97, 0.58, 1, 0.66, 0.9, 0.52, 0.74, 1];
      spineTicks = []; spineBase = [];
      for (var i = 0; i < Math.min(6, els2.length); i++) {
        spineTicks.push(els2[i]);
        spineBase.push(0.55 + bars[i % bars.length] * 0.6);
      }
    }
    for (var k = 0; k < spineTicks.length; k++) {
      var wgt = 1 + 0.30 * Math.max(0, Math.sin(theta * 3 * D2R - k * 0.85)) * (1 - k / 7);
      spineTicks[k].style.transform =
        'translateX(-50%) scaleX(' + (spineBase[k] * wgt).toFixed(3) + ')';
    }
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
      var ease = (1 - Math.cos(Math.PI * x)) / 2;      /* easeInOutSine：缓起→峰值→缓落（钟形速度曲线） */
      lastS = S0 + (sEnd - S0) * ease + omegaArc * tIntro / 1000;
      paintPose();
      if (x >= 1) { freezeToRing(lastS); paintPose(); }
    } else if (mode === 'ring') {
      if (dragging) {
        lastDx *= Math.pow(0.8, dt);
      } else {
        vel = -BASE + (vel + BASE) * Math.pow(FRICTION, dt);   /* 收敛到 −BASE（右→左巡航） */
        theta += vel * dt;
      }
      paintPose();
      spineRipple();                                   /* 环↔进度轴互动：轴头随环转动泛涟漪 */
    }

    /* 只有活动态（飞入/自转）续订 rAF——static/idle 单帧成像后归 idle 队列
       （REDUCE=static 若按 mode!=='idle' 续订会被 IO 初始回调拉起永久空转，违「零 rAF」） */
    if (visible && (mode === 'intro' || mode === 'ring')) raf = requestAnimationFrame(render);
  }
  function ensure() {
    if (!raf && visible && (mode === 'intro' || mode === 'ring')) { lastT = 0; raf = requestAnimationFrame(render); }
  }

  /* ── REDUCE 静态定格：θ=0 环态（合拢缝自然在正前），零 rAF；点击仍可用（拾取吃本帧快照） ── */
  function staticPose() {
    mode = 'static';
    ringS = geo ? geo.L : 0;
    paintPose();
  }

  /* ── 点击 vs 拖拽（down 绑 .ribbon-hit + front canvas 冒泡；move/up 走 window）。
     front canvas 全层接事件，语义域=命中带 ∪ 前弧卡面（数学拾取，与旧「hit 带 +
     strip 可点」一致）；域外按下不响应。 ── */
  function layerPoint(e) {
    var r = els.frontLayer.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function inHitBand(e) {
    if (!els.hit) return false;
    var r = els.hit.getBoundingClientRect();
    return e.clientX >= r.left && e.clientX <= r.right &&
      e.clientY >= r.top && e.clientY <= r.bottom;
  }
  function setCursor(cur) {
    if (!renderer || cur === lastCursor) return;
    lastCursor = cur;
    els.frontCanvas.style.cursor = cur;
  }
  function onDown(e) {
    if (mode !== 'ring' && mode !== 'static') return;
    if (activePointer !== null) return;                /* 已有活跃指针 → 忽略第二指（防双指交替喂 onMove 抽搐乱转） */
    var pt = layerPoint(e);
    var ci = renderer.pick(pt.x, pt.y);
    if (ci < 0 && !inHitBand(e)) return;
    activePointer = e.pointerId;
    downCard = ci >= 0 ? cardsMeta[ci].id : null;
    dragging = mode === 'ring';
    if (dragging) setCursor('grabbing');
    px = e.clientX; lastDx = 0;
    downX = e.clientX; downY = e.clientY; downT = performance.now();
  }
  function endDrag() {                                 /* 松手/丢 up/取消统一收尾 */
    if (dragging) { dragging = false; setCursor(''); vel = clamp(-BASE + lastDx * geo.gain, -VEL_MAX, VEL_MAX); }
  }
  var hoverT = 0;
  function onMove(e) {
    if (HOVERFINE.matches && !dragging && mode === 'ring') {   /* 视差目标仅环态更新 */
      par.tx = e.clientX / window.innerWidth * 2 - 1;
      par.ty = e.clientY / window.innerHeight * 2 - 1;
    }
    if (!dragging) {
      /* 悬停指针（80ms 节流拾取）：卡面 pointer / 命中带 grab / 其余默认 */
      if (renderer && HOVERFINE.matches && e.target === els.frontCanvas &&
        (mode === 'ring' || mode === 'static')) {
        var now = performance.now();
        if (now - hoverT > 80) {
          hoverT = now;
          var pt = layerPoint(e);
          setCursor(renderer.pick(pt.x, pt.y) >= 0 ? 'pointer' : (inHitBand(e) ? 'grab' : ''));
        }
      }
      return;
    }
    if (e.pointerId !== activePointer) return;         /* 只认起手那根指 */
    if (e.pointerType === 'mouse' && !e.buttons) { endDrag(); activePointer = null; downT = 0; return; }   /* 丢 up 兜底：无按键不粘手 */
    var dx = e.clientX - px;
    theta += dx * geo.gain;
    lastDx = dx;
    px = e.clientX;
  }
  function onUp(e) {
    if (activePointer !== null && e.pointerId !== activePointer) return;
    activePointer = null;
    var wasDown = downT > 0;
    endDrag();
    if (!wasDown) return;
    var slop = COARSE.matches ? 10 : 6;
    var isTap = Math.hypot(e.clientX - downX, e.clientY - downY) < slop &&
      performance.now() - downT < 400 && downCard;
    downT = 0;
    if (!isTap) { downCard = null; return; }
    var target = document.getElementById('work-' + downCard);
    downCard = null;
    if (!target) return;
    target.scrollIntoView({ block: 'start' });         /* 不传 smooth：吃全局 scroll-behavior，RM 自动瞬跳 */
    target.classList.add('jump-hit');
    setTimeout(function () { target.classList.remove('jump-hit'); }, 950);
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

  /* 入场即时（2026-07-12 用户裁定「标题一出丝带立即开演」）：loaderdone 即武装，
     零延迟、零解码门（几何从 projects.json 尺寸同步解，图未到先灰占位） */
  function armStart() {
    var go = function () {
      if (mode !== 'idle' || REDUCE) return;
      tIntro = 0; mode = 'intro';
      ensure();                                        /* t0 = 首个 rAF：后台/离屏等可见才开演 */
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

    var probe = document.createElement('div');         /* 量 --ribbon-card-w 落地值 */
    probe.style.cssText = 'position:absolute;visibility:hidden;width:var(--ribbon-card-w);height:0;';
    hero.appendChild(probe);

    els = {
      hero: hero,
      probe: probe,
      frontLayer: frontLayer,
      backCanvas: document.querySelector('.ribbon-back .ribbon-canvas'),
      frontCanvas: frontLayer.querySelector('.ribbon-canvas'),
      hit: document.querySelector('.ribbon-hit'),
      floor: document.querySelector('.ribbon-floor'),
      nameText: document.querySelector('.hero-name-text')
    };

    if (window.RibbonRender && els.backCanvas && els.frontCanvas) {
      var tok = getComputedStyle(document.documentElement);
      renderer = window.RibbonRender.create({
        backCanvas: els.backCanvas,
        frontCanvas: els.frontCanvas,
        white: (tok.getPropertyValue('--c-white') || '#FFFFFF').trim(),
        border: (tok.getPropertyValue('--c-border') || '#E0E0E0').trim()
      });
    }
    if (!renderer) return;                             /* canvas 不可用：优雅无丝带（标题/波点不受影响） */
    els.frontCanvas.style.pointerEvents = 'auto';      /* 事件全层接收，语义域在 onDown 复刻 */
    els.frontCanvas.style.touchAction = 'pan-y pinch-zoom';   /* 竖划归页面滚动、捏合交还浏览器（会发 pointercancel，清态已兜）；横向起手归拨环 */

    /* 预载 11 张卡图（原比例派生版）：宽高比从 projects.json ribbon:{w,h} 来，
       几何同步可解、不等图；decode 到一张贴一张（灰占位渐进升级） */
    cardsMeta = items.map(function (p, i) {
      var pre = new Image();
      if (i < 3) pre.fetchPriority = 'high';
      pre.src = 'assets/ribbon/' + p.id + '.jpg';
      var ar = (p.ribbon && p.ribbon.w > 0 && p.ribbon.h > 0) ? p.ribbon.w / p.ribbon.h : 0;
      return { id: p.id, src: pre.src, thumb: p.thumb, pre: pre, aspect: ar || 1.5, w: 0, start: 0 };
    });

    els.hit.addEventListener('pointerdown', onDown);   /* 事件绑稳定容器，不逐卡绑（防闪总则第 4 条） */
    frontLayer.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', function () { endDrag(); activePointer = null; downT = 0; downCard = null; });

    if ('IntersectionObserver' in window) {            /* 离屏停 rAF */
      new IntersectionObserver(function (ents) {
        visible = ents[ents.length - 1].isIntersecting;   /* 取批次最新一条（同批出画又入画时勿用最旧 ents[0]） */
        ensure();
      }, { threshold: 0 }).observe(frontLayer);
    }

    cardsMeta.forEach(hookDecode);                     /* 渐进贴图：decode 到一张贴一张 */
    relayout();                                        /* 几何+atlas（灰占位）+idle 首帧就位 */
    if (REDUCE) { staticPose(); return; }
    armStart();
  }
  /* 逐图解码钩子：成功→调色入 atlas（顺带用实测比例自愈 JSON 漂移）；失败→退 thumb 一次 */
  function hookDecode(c, i) {
    var ok = function () {
      if (!renderer || !c.pre.naturalWidth) return;
      renderer.setCardImage(i, c.pre);
      var real = c.pre.naturalHeight ? c.pre.naturalWidth / c.pre.naturalHeight : 0;
      if (real && Math.abs(real - c.aspect) > 0.01) { c.aspect = real; relayout(); return; }
      if (mode === 'idle' || mode === 'static') paintPose();   /* 静止态补一帧显新图 */
    };
    var err = function () {
      /* iOS Safari 内存压力下 decode() 有著名的假拒绝（图其实已好）——naturalWidth>0 即当成功，勿错退 thumb */
      if (c.pre.naturalWidth) { ok(); return; }
      if (c.thumb && !c.triedThumb) {                  /* 布尔标记，勿用 src 子串（编码后可能永不含原路径→无限重试） */
        c.triedThumb = true;
        var im2 = new Image();
        im2.src = c.thumb;
        c.pre = im2;
        hookDecode(c, i);
      }
    };
    if (c.pre.decode) c.pre.decode().then(ok, err);
    else { c.pre.onload = ok; c.pre.onerror = err; }
  }

  /* resize/断点：重解几何+重设画布（atlas 带高变超 10% 自动重建）。飞入途中遭遇 → 直接跳剪到环态 */
  function relayout() {
    if (!renderer || !cardsMeta.length) return;
    /* 尺寸指纹未变则跳过：iOS 地址栏收放只改 innerHeight（clientWidth/svh 布局视口不变），
       否则会把 intro 跳剪、把 ring 相位重置成 ~18° 瞬跳。飞入途中真改窗仍按下方跳剪。 */
    var lr = els.frontLayer.getBoundingClientRect();
    var key = (document.documentElement.clientWidth || 0) + 'x' +
      Math.round(lr.width) + 'x' + Math.round(lr.height) + 'x' + (els.probe.offsetWidth || 0);
    if (key === lastGeoKey && mode !== 'idle') return;
    lastGeoKey = key;
    geo = solveGeometry();
    S0 = geo.sEntry;
    sEnd = geo.L;                                      /* = 2πR：头尾精确合拢 */
    omegaArc = BASE * 60 * D2R * geo.R;
    renderer.setBand(cardsMeta, geo.H);
    renderer.layout(geo.layerW, geo.layerH);
    layoutFloor();
    spineTicks = null;                                 /* 轴可能重建，涟漪缓存失效 */
    /* 地影/几何就位 → 通知 index-fx 重锚进度轴（轴头钉地影中心，与环相接） */
    document.dispatchEvent(new CustomEvent('ribbonlayout'));
    if (mode === 'intro') {
      freezeToRing(sEnd + omegaArc * tIntro / 1000);
      paintPose();
      return;
    }
    if (mode === 'ring' || mode === 'static') {
      ringS = geo.L;                                   /* 重解几何后回到标准相位 */
      paintPose();
    } else {                                           /* idle：摆 t=0 画外姿态（层淡入不见空白） */
      lastS = S0;
      paintPose();
    }
    ensure();
  }

  window.Ribbon = {
    init: init, relayout: relayout,
    /* 手动泵一帧 + 重启时间轴（调试/隐藏标签页环境确定性验证用，沿 IndexFx.tick 先例）：
       传伪造时间戳逐帧驱动 render，配合替换 requestAnimationFrame 可离线扫描动画 */
    _pump: function (ts) { if (raf) cancelAnimationFrame(raf); raf = null; render(ts); },   /* 先取消待决回调，勿在活页面叠加并行循环 */
    _restart: function () {
      if (!cardsMeta.length) return false;
      tIntro = 0; theta = 0; vel = -BASE; lastT = 0; mode = 'intro';
      return true;
    },
    /* canvas 验收探针：当前姿态的 rung 序列（Float32Array 视图）与渲染统计 */
    _probe: function () {
      if (!renderer || !geo) return null;
      var n = sampleFrame(poseNow());
      return { n: n, rungs: rungBuf.subarray(0, n * 8), stats: renderer._stats, geo: geo };
    },
    _renderer: function () { return renderer; }
  };
})();
