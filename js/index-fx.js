/* ════════════════════════════════════════════════════════════
   index-fx.js — 首页动效层：
   1) 3D 立方体：rAF 自转 + Pointer 拖拽，离屏暂停
   2) 中轴数据条进度指示（用户原创，取代老师站的波浪线+圆珠）：
      竖向轨道 + 随滚动生长的墨色填充；到达作品节点时
      延伸一根指向标题列的水平分支，同侧标题提亮。克制。
   3) 软边 mask 鼠标揭示（卡片 + 立方体面）
   4) 页脚 finale：「I am ___」轮换 + Logo 从 header 下坠落底
   IndexFx.refresh() 由 index.js 渲染完成后调用。
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var REDUCE = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DESKTOP = window.matchMedia('(min-width: 1024px)');
  var IAM_BARS = (window.Barmorph && window.Barmorph.IAM_BARS) || [0.97, 0.58, 1, 0.66, 0.9, 0.52, 0.74, 1];

  function smoothstep(t) { return t * t * (3 - 2 * t); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ── 1. 立方体（重量感体系：dt 归一 + 惯性 + Lambert 光照 + 接触影呼吸 + bob + 视差） ── */
  var CUBE_FACES = [
    'assets/project/pears/thumbnails/1.png',
    'assets/project/cowork/thumbnails/1.jpg',
    'assets/project/yijian/thumbnails/1.jpg',
    'assets/project/ring-world/thumbnails/1.jpg',
    'assets/project/air-cube/thumbnails/1.jpg',
    'assets/cube/brand.svg'
  ];

  var D2R = Math.PI / 180;
  /* 左上前方主光位；六面局部法线按 layoutFaces 的 T 顺序（CSS 坐标 y 向下 → 顶面法线 -y） */
  var LIGHT = (function () {
    var x = -0.35, y = -0.75, z = 0.55, m = Math.sqrt(x * x + y * y + z * z);
    return [x / m, y / m, z / m];
  })();
  var NORMALS = [[0, 0, 1], [1, 0, 0], [0, 0, -1], [-1, 0, 0], [0, -1, 0], [0, 1, 0]];
  var SHADE_MAX = 0.16;
  var shades = [];

  /* 各面悬浮揭示的"另一张图"（= projects.json 的 float.reveal 口径）；品牌面无 */
  var REVEAL_FACES = [
    'assets/project/pears/float/1.jpg',
    'assets/project/cowork/float/1.jpg',
    'assets/project/yijian/float/1.jpg',
    'assets/project/ring-world/content/2.jpg',
    'assets/project/air-cube/content/2.jpg',
    null
  ];

  /* 软边揭示共用驱动（卡片 + 立方体面）：进入时半径 rAF 从小缓动扩散（easeOutCubic），
     移动更新 mask 圆心（跟手不缓动），离开收拢回 0。
     useOffset=true 用 offsetX/Y（3D 变换面需要逆映射后的局部坐标）；
     getR 返回目标半径 px。REDUCE 下瞬时显隐（不动画）。 */
  var REVEAL_DUR = 450;
  function attachReveal(box, reveal, useOffset, getR) {
    var r = 0, from = 0, target = 0, t0 = 0, raf = null;
    function tick(now) {
      raf = null;
      var p = Math.min((now - t0) / REVEAL_DUR, 1);
      var e = 1 - Math.pow(1 - p, 3);
      r = from + (target - from) * e;
      reveal.style.setProperty('--rv-r', r.toFixed(1) + 'px');
      if (p < 1) raf = requestAnimationFrame(tick);
    }
    function go(t) {
      target = t;
      if (REDUCE) {
        r = t;
        reveal.style.setProperty('--rv-r', t + 'px');
        return;
      }
      from = r; t0 = performance.now();
      if (!raf) raf = requestAnimationFrame(tick);
    }
    var setXY = function (e) {
      var x, y;
      if (useOffset) { x = e.offsetX; y = e.offsetY; }
      else { var b = box.getBoundingClientRect(); x = e.clientX - b.left; y = e.clientY - b.top; }
      reveal.style.setProperty('--rv-x', x.toFixed(1) + 'px');
      reveal.style.setProperty('--rv-y', y.toFixed(1) + 'px');
    };
    box.addEventListener('pointerenter', function (e) { setXY(e); go(getR()); });
    box.addEventListener('pointermove', setXY);
    box.addEventListener('pointerleave', function () { go(0); });
  }

  /* 每帧按面法线 n' = Rx(rx)·Ry(ry)·n 的 Lambert 受光量写遮罩 opacity；值未变跳过写入 */
  function applyLighting(rx, ry) {
    if (!shades.length) return;
    var cx = Math.cos(rx * D2R), sx = Math.sin(rx * D2R);
    var cy = Math.cos(ry * D2R), sy = Math.sin(ry * D2R);
    for (var i = 0; i < 6; i++) {
      var n = NORMALS[i];
      var x1 = n[0] * cy + n[2] * sy, z1 = -n[0] * sy + n[2] * cy;   /* Ry */
      var y2 = n[1] * cx - z1 * sx, z2 = n[1] * sx + z1 * cx;        /* Rx */
      var lambert = Math.max(0, x1 * LIGHT[0] + y2 * LIGHT[1] + z2 * LIGHT[2]);
      var o = SHADE_MAX * (1 - lambert);
      var s = shades[i];
      if (Math.abs(o - s._o) > 0.002) { s.style.opacity = o.toFixed(3); s._o = o; }
    }
  }

  /* 面变换按当前 --cube-size 摆放；横竖屏/断点切换后重算（否则面会散架） */
  var cubeHalf = 0;
  function layoutFaces() {
    var cube = document.getElementById('cube');
    if (!cube) return;
    var faces = cube.querySelectorAll('.face');
    if (!faces.length) return;
    var half = (parseInt(getComputedStyle(cube).width, 10) || 320) / 2;
    if (half === cubeHalf) return;
    cubeHalf = half;
    var T = [
      'rotateY(0deg) translateZ(' + half + 'px)',
      'rotateY(90deg) translateZ(' + half + 'px)',
      'rotateY(180deg) translateZ(' + half + 'px)',
      'rotateY(270deg) translateZ(' + half + 'px)',
      'rotateX(90deg) translateZ(' + half + 'px)',
      'rotateX(-90deg) translateZ(' + half + 'px)'
    ];
    Array.prototype.forEach.call(faces, function (f, i) {
      f.style.transform = T[i];
    });
  }

  function initCube() {
    var cube = document.getElementById('cube');
    if (!cube || cube.dataset.ready) return;
    cube.dataset.ready = '1';

    var canHover = window.matchMedia('(hover: hover)').matches;
    shades = [];
    CUBE_FACES.forEach(function (src, i) {
      var f = document.createElement('div');
      f.className = 'face';
      var img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.draggable = false;
      f.appendChild(img);
      var sh = document.createElement('i');
      sh.className = 'face-shade';
      sh._o = 0;
      f.appendChild(sh);
      shades.push(sh);
      /* 悬浮揭示另一张图（放在 face-shade 之上=光斑感）；拖拽时 vp 捕获指针，面收到
         pointerleave 自动收拢，无需专门处理 */
      if (canHover && REVEAL_FACES[i]) {
        var rev = document.createElement('img');
        rev.src = REVEAL_FACES[i];
        rev.alt = '';
        rev.loading = 'lazy';
        rev.decoding = 'async';
        rev.draggable = false;
        rev.className = 'face-reveal';
        f.appendChild(rev);
        attachReveal(f, rev, true, function () { return cubeHalf * 0.72; });   /* 0.36×面宽 */
      }
      cube.appendChild(f);
    });
    layoutFaces();

    var rx = -20, ry = 35;
    cube.style.transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
    applyLighting(rx, ry);   /* 静帧也要有明暗（REDUCE 场景仅此一帧） */

    var rig = document.querySelector('.cube-rig');
    var bob = document.querySelector('.cube-bob');
    var shadow = document.querySelector('.cube-shadow');
    var nameText = document.querySelector('.hero-name-text');

    if (REDUCE) {
      /* 静态重量证据全保：定格中间态接触影，砍全部运动 */
      if (shadow) shadow.style.opacity = '0.92';
      return;
    }

    var dragging = false, px = 0, py = 0, visible = true, raf = null;
    var BASE = 0.05, FRICTION = 0.95, GAIN = 0.22;   /* 重物：低基速 · 高阻尼 · 缓释惯性 */
    var vel = BASE, lastDx = 0, lastT = 0;
    var BOB_T = DESKTOP.matches ? 7000 : 8000;
    var BOB_A = DESKTOP.matches ? 7 : 3;
    var HOVERFINE = window.matchMedia('(hover: hover) and (pointer: fine)');
    var par = { tx: 0, ty: 0, x: 0, y: 0 };

    function render(now) {
      raf = null;
      if (!lastT) lastT = now;
      var dt = Math.min((now - lastT) / 16.7, 3); /* 归一到 60fps 帧：120Hz 屏手感一致 */
      lastT = now;

      if (dragging) {
        lastDx *= Math.pow(0.8, dt);              /* 按住不动 → 松手速度衰到 0，不误甩 */
      } else {
        vel = BASE + (vel - BASE) * Math.pow(FRICTION, dt);
        ry += vel * dt;
        rx += (-20 - rx) * (1 - Math.pow(0.994, dt));   /* 极慢回沉平衡位 */
      }
      cube.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
      applyLighting(rx, ry);

      /* bob 与接触影同相呼吸（JS 同驱不脱相）：升→影淡+散，降→影浓+紧 */
      var lift = 0.5 + 0.5 * Math.sin(now / BOB_T * 2 * Math.PI);
      if (bob) bob.style.transform = 'translate3d(0,' + (-BOB_A * lift).toFixed(2) + 'px,0)';
      if (shadow) {
        var footprint = (Math.abs(Math.cos(ry * D2R)) + Math.abs(Math.sin(ry * D2R)) - 1) / 0.414;
        var sxS = (1 + 0.06 * lift) * (1 + 0.06 * footprint);   /* 转到对角投影脚印略宽 */
        shadow.style.opacity = (1 - 0.28 * lift).toFixed(3);
        shadow.style.transform = 'translateX(-50%) scale(' + sxS.toFixed(3) + ',' + (1 + 0.05 * lift).toFixed(3) + ')';
      }

      /* 视差：lerp 滞后跟随（重物跟不上鼠标）；大字反向低速 → 三层纵深（波点场静止） */
      if (HOVERFINE.matches) {
        var k = 1 - Math.pow(0.94, dt);
        par.x += (par.tx - par.x) * k;
        par.y += (par.ty - par.y) * k;
        if (rig) rig.style.transform = 'translate3d(' + (par.x * 14).toFixed(1) + 'px,' + (par.y * 10).toFixed(1) + 'px,0)';
        if (nameText) nameText.style.transform = 'translate3d(' + (par.x * -8).toFixed(1) + 'px,' + (par.y * -5).toFixed(1) + 'px,0)';
      }

      if (visible) raf = requestAnimationFrame(render);
    }
    function ensure() { if (!raf && visible) { lastT = 0; raf = requestAnimationFrame(render); } }

    var vp = cube.parentElement;
    vp.addEventListener('pointerdown', function (e) {
      dragging = true; px = e.clientX; py = e.clientY; lastDx = 0;
      try { vp.setPointerCapture(e.pointerId); } catch (err) { /* 指针已释放/合成事件 */ }
    });
    vp.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - px, dy = e.clientY - py;
      ry += dx * GAIN;
      rx = clamp(rx - dy * GAIN, -70, 70);
      lastDx = dx;
      px = e.clientX; py = e.clientY;
    });
    ['pointerup', 'pointercancel'].forEach(function (ev) {
      vp.addEventListener(ev, function () {
        dragging = false;
        vel = clamp(lastDx * GAIN, -3, 3);   /* 松手惯性：重物甩不出高转速 */
      });
    });

    /* 视差目标：拖拽期间冻结（lerp 自然停驻），松手后缓缓恢复 */
    if (HOVERFINE.matches) {
      window.addEventListener('pointermove', function (e) {
        if (dragging) return;
        par.tx = e.clientX / window.innerWidth * 2 - 1;
        par.ty = e.clientY / window.innerHeight * 2 - 1;
      }, { passive: true });
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (ents) {
        visible = ents[0].isIntersecting;
        ensure();
      }, { threshold: 0 }).observe(vp);
    }
    ensure();
  }

  /* ── 大字拟合：LI WENYUAN 恰好 ≈92vw（Monterey 就绪后校准一次，resize 复用；
        量 offsetWidth（布局宽，不受入场/视差 transform 影响），线性关系一步收敛 ── */
  function fitHeroName() {
    var el = document.querySelector('.hero-name-text');
    if (!el) return;
    var cur = parseFloat(getComputedStyle(el).getPropertyValue('--hero-fit')) || 1;
    var w = el.offsetWidth;
    if (!w) return;
    var next = clamp(cur * (window.innerWidth * 0.92) / w, 0.6, 1.4);
    el.style.setProperty('--hero-fit', next.toFixed(4));
  }

  /* ── 2. 中轴数据条进度指示 ──
     一串小短横线（呼应 Logo 的节奏条，基础长度按 IAM_BARS 循环），
     滚动时进度头附近的横线起波浪式放大；已滚过的染墨色。
     每个作品在【标题高度】伸出一根到标题边的分支。 */
  var TICK_GAP = 16;      /* 横线间距 */
  var WAVE_R = 96;        /* 波浪影响半径 */
  var spine = {
    host: null, ticks: [], branches: [], ok: false,
    prevLo: 0, prevHi: -1, prevHeadIdx: -1
  };

  function buildSpine() {
    var host = document.getElementById('line-container');
    var gallery = document.getElementById('gallery');
    var polygon = document.querySelector('.polygon-container');
    var main = document.querySelector('main');
    if (!host || !gallery || !polygon || !main) return;

    host.innerHTML = '';

    /* 相对 main 定位：从立方体台下缘垂到「尾声」标题上方（勿压到标题文字） */
    var mainRect = main.getBoundingClientRect();
    var top = polygon.getBoundingClientRect().bottom - mainRect.top + 48;
    var epi = document.querySelector('.epilogue-title');
    var endEl = epi || gallery;
    var end = endEl.getBoundingClientRect().top - mainRect.top - 56;
    var h = Math.max(200, end - top);
    host.style.top = top + 'px';
    host.style.height = h + 'px';

    /* 横线阵列 */
    spine.ticks = [];
    var n = Math.floor(h / TICK_GAP);
    var frag = document.createDocumentFragment();
    for (var i = 0; i <= n; i++) {
      var t = document.createElement('i');
      t.className = 'spine-tick';
      t.style.top = (i * TICK_GAP) + 'px';
      var base = 0.55 + IAM_BARS[i % IAM_BARS.length] * 0.6;
      t.style.transform = 'translateX(-50%) scaleX(' + base.toFixed(2) + ')';
      frag.appendChild(t);
      spine.ticks.push({ el: t, y: i * TICK_GAP, base: base, on: false });
    }
    host.appendChild(frag);
    spine.prevLo = 0; spine.prevHi = -1; spine.prevHeadIdx = -1;

    /* 分支：吸附到最近的短横线行（看起来是那根短横线在延伸，而不是凭空多一条线），
       从中轴向左一直伸到标题左缘——划过整个大标题的下方 */
    spine.branches = [];
    var hostRect = { top: mainRect.top + top, centerX: host.getBoundingClientRect().left + host.offsetWidth / 2 };
    document.querySelectorAll('#mainline .project-item').forEach(function (item) {
      var title = item.querySelector('.project-title');
      if (!title) return;
      var tr = title.getBoundingClientRect();
      /* 纵向用 offsetTop 链（不受 data-reveal 入场位移影响），横向用 rect */
      var oy = 0, el = title;
      while (el && el !== main) { oy += el.offsetTop; el = el.offsetParent; }
      var cy = Math.round((oy + title.offsetHeight + 8 - top) / TICK_GAP) * TICK_GAP;
      if (cy < 0 || cy > h) return;
      var w = Math.max(24, hostRect.centerX - tr.left);
      var br = document.createElement('div');
      br.className = 'spine-branch';
      br.style.top = cy.toFixed(0) + 'px';
      br.style.width = w.toFixed(0) + 'px';
      host.appendChild(br);
      spine.branches.push({ el: br, item: item, title: title });
    });
    spine.ok = true;
    onScroll();
  }

  var scrollRaf = null;
  function onScroll() {
    if (scrollRaf) return;
    var run = function () { scrollRaf = null; tickSpine(); tickFinale(); };
    /* 后台标签页 rAF 不执行 — 退 setTimeout，回前台时状态已就位 */
    if (document.hidden) { scrollRaf = 1; setTimeout(run, 0); }
    else scrollRaf = requestAnimationFrame(run);
  }

  function tickSpine() {
    if (!spine.ok || !DESKTOP.matches) return;
    var host = document.getElementById('line-container');
    if (!host) return;
    var rect = host.getBoundingClientRect();
    var p = clamp((window.innerHeight * 0.5 - rect.top) / rect.height, 0, 1);
    var head = p * rect.height;
    var headIdx = Math.round(head / TICK_GAP);

    /* 只更新受影响区间：本帧波浪范围 ∪ 上帧波浪范围 ∪ 进度头扫过的区间 */
    var lo = Math.max(0, Math.floor((head - WAVE_R) / TICK_GAP));
    var hi = Math.min(spine.ticks.length - 1, Math.ceil((head + WAVE_R) / TICK_GAP));
    var from = Math.min(lo, spine.prevLo, spine.prevHeadIdx < 0 ? lo : spine.prevHeadIdx);
    var to = Math.max(hi, spine.prevHi, spine.prevHeadIdx < 0 ? hi : spine.prevHeadIdx);

    for (var i = from; i <= to; i++) {
      var t = spine.ticks[i];
      if (!t) continue;
      var on = t.y <= head;
      var s;
      if (on) {
        /* 走过的横线保持伸展态，不再缩回去 */
        s = t.base * 2.1;
      } else {
        s = t.base;
        var dist = t.y - head;
        if (dist < WAVE_R) {
          var k = Math.cos((dist / WAVE_R) * Math.PI / 2);   /* 进度头前方的预备波，向下衰减 */
          s = t.base * (1 + 1.1 * k * k);
        }
      }
      t.el.style.transform = 'translateX(-50%) scaleX(' + s.toFixed(2) + ')';
      if (on !== t.on) { t.on = on; t.el.classList.toggle('on', on); }
    }
    spine.prevLo = lo; spine.prevHi = hi; spine.prevHeadIdx = headIdx;

    var mid = window.innerHeight / 2;
    spine.branches.forEach(function (b) {
      var r = b.item.getBoundingClientRect();
      var on = Math.abs(r.top + r.height / 2 - mid) < r.height * 0.55;
      b.el.classList.toggle('on', on);
      b.item.classList.toggle('spine-on', on);
    });
  }

  /* ── 3. 卡片鼠标揭示（软边 mask，与立方体面共用 attachReveal；半径走 --reveal-r 令牌） ── */
  function bindReveal() {
    if (!window.matchMedia('(hover: hover)').matches) return;
    var cardR = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--reveal-r')) || 110;
    document.querySelectorAll('.image-container').forEach(function (box) {
      if (box.dataset.fx) return;
      box.dataset.fx = '1';
      var reveal = box.querySelector('.layer-reveal');
      if (!reveal) return;
      attachReveal(box, reveal, false, function () { return cardR; });
    });
  }

  /* ── 4. 页脚 finale ── */
  var IDS = ['Alnt Med', 'an AIPM', 'an Architect', 'a Builder', 'anything.'];
  var finale = { flyband: null, band: null, headerBand: null, slot: null, started: false };

  function initFinale() {
    if (finale.started) return;
    var who = document.getElementById('iamf-who');
    var slot = document.getElementById('fband-slot');
    if (!who || !slot) return;
    finale.started = true;
    finale.slot = slot;
    finale.headerBand = document.querySelector('.site-header .brandband');

    /* I am ___ 轮换（2.2s，whoIn 动画靠换 key 重放） */
    var i = 0;
    setInterval(function () {
      i = (i + 1) % IDS.length;
      var next = who.cloneNode(false);
      next.textContent = IDS[i];
      who.parentNode.replaceChild(next, who);
      who = next;
    }, 2200);

    if (REDUCE || !DESKTOP.matches) {
      /* 静态落底：footer 档原生大尺寸渲染（勿 transform scale 放大——会糊） */
      var stat = document.createElement('div');
      stat.className = 'fband-static';
      window.Barmorph.mountBrandBand(stat).classList.add('brandband--footer');
      slot.appendChild(stat);
      return;
    }

    /* 下坠飞行体：footer 档原生大条，飞行全程只缩小（header 端）→ 落底 scale=1 像素完美 */
    var fb = document.createElement('div');
    fb.className = 'fly-band';
    finale.band = window.Barmorph.mountBrandBand(fb);
    finale.band.classList.add('brandband--footer');
    fb.style.display = 'none';
    document.body.appendChild(fb);
    finale.flyband = fb;
  }

  function tickFinale() {
    if (!finale.flyband || !DESKTOP.matches) return;
    var fin = document.getElementById('finale');
    if (!fin) return;
    var fr = fin.getBoundingClientRect();
    var vh = window.innerHeight;
    /* 进入 finale 即开始下坠，滚到页面底部时恰好完成落槽
       （旧算法用固定 span，页底永远到不了 1，Logo 悬在半空） */
    var sy = window.scrollY || window.pageYOffset || 0;
    var fTopAbs = fr.top + sy;
    var doc = document.documentElement;
    var maxScroll = Math.max(doc.scrollHeight - vh, 1);
    var start = Math.max(fTopAbs - vh, 0);           /* finale 顶进入视口那一刻 */
    var q = clamp((sy - start) / Math.max(maxScroll - start, 1), 0, 1);
    var e3 = smoothstep(q);

    var headerSlot = document.querySelector('.site-header .logoslot');
    if (!headerSlot || !finale.slot) return;
    var a = headerSlot.getBoundingClientRect();
    var b = finale.slot.getBoundingClientRect();

    if (e3 <= 0.001) {
      finale.flyband.style.display = 'none';
      if (finale.headerBand) finale.headerBand.style.opacity = '';
      return;
    }
    finale.flyband.style.display = '';
    if (finale.headerBand) finale.headerBand.style.opacity = '0';

    /* 原生尺寸实测（offsetWidth/Height 不受 transform 影响，媒体查询换档自动跟随）；
       落底 scale=1 原生渲染，槽装不下才等比缩小 */
    var natW = finale.band.offsetWidth || 360, natH = finale.band.offsetHeight || 96;
    var sB = Math.min(1, (b.height * 0.8) / natH, (b.width * 0.9) / natW);
    var bx = b.left + (b.width - natW * sB) / 2;
    var by = b.top + (b.height - natH * sB) / 2;
    var sA = a.height / natH;
    var ax = a.left, ay = a.top;

    var x = ax + (bx - ax) * e3;
    var y = ay + (by - ay) * e3;
    var s = sA + (sB - sA) * e3;
    finale.flyband.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) scale(' + s.toFixed(3) + ')';
  }

  function refresh() {
    fitHeroName();
    initCube();
    buildSpine();
    bindReveal();
    initFinale();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { fitHeroName(); buildSpine(); layoutFaces(); });
  /* Monterey 晚到会移动标题基线 — 字体就绪后重测大字拟合与分支位置 */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { fitHeroName(); buildSpine(); });
  }
  if ('ResizeObserver' in window) {
    var t = null;
    new ResizeObserver(function () {
      if (t) clearTimeout(t);
      /* 防抖：图片陆续加载会移动网格；fit 二次校准兜 resize 竞态（量到过渡中宽度） */
      t = setTimeout(function () { fitHeroName(); buildSpine(); }, 120);
    }).observe(document.documentElement);
  }

  window.IndexFx = {
    refresh: refresh,
    /* 手动驱动一帧（调试/隐藏标签页环境验证用） */
    tick: function () { tickSpine(); tickFinale(); }
  };
})();
