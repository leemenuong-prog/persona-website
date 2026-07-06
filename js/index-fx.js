/* ════════════════════════════════════════════════════════════
   index-fx.js — 首页动效层：
   1) 3D 立方体：rAF 自转 + Pointer 拖拽，离屏暂停
   2) 中轴数据条进度指示（用户原创，取代老师站的波浪线+圆珠）：
      竖向轨道 + 随滚动生长的墨色填充；到达作品节点时
      延伸一根指向标题列的水平分支，同侧标题提亮。克制。
   3) clip-path 鼠标揭示
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

  /* ── 1. 立方体 ── */
  var CUBE_FACES = [
    'assets/project/pears/thumbnails/1.jpg',
    'assets/project/cowork/thumbnails/1.jpg',
    'assets/project/yijian/thumbnails/1.jpg',
    'assets/project/uabb/thumbnails/1.jpg',
    'assets/project/air-cube/thumbnails/1.jpg',
    'assets/cube/brand.svg'
  ];

  function initCube() {
    var cube = document.getElementById('cube');
    if (!cube || cube.dataset.ready) return;
    cube.dataset.ready = '1';

    var half = (parseInt(getComputedStyle(cube).width, 10) || 320) / 2;
    var T = [
      'rotateY(0deg) translateZ(' + half + 'px)',
      'rotateY(90deg) translateZ(' + half + 'px)',
      'rotateY(180deg) translateZ(' + half + 'px)',
      'rotateY(270deg) translateZ(' + half + 'px)',
      'rotateX(90deg) translateZ(' + half + 'px)',
      'rotateX(-90deg) translateZ(' + half + 'px)'
    ];
    CUBE_FACES.forEach(function (src, i) {
      var f = document.createElement('div');
      f.className = 'face';
      f.style.transform = T[i];
      var img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.draggable = false;
      f.appendChild(img);
      cube.appendChild(f);
    });

    var rx = -20, ry = 35;
    cube.style.transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
    if (REDUCE) return;

    var dragging = false, px = 0, py = 0, visible = true, raf = null;
    function frame() {
      raf = null;
      if (!dragging) ry += 0.15;
      cube.style.transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
      if (visible) raf = requestAnimationFrame(frame);
    }
    function ensure() { if (!raf && visible) raf = requestAnimationFrame(frame); }

    var vp = cube.parentElement;
    vp.addEventListener('pointerdown', function (e) {
      dragging = true; px = e.clientX; py = e.clientY;
      vp.setPointerCapture(e.pointerId);
    });
    vp.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      ry += (e.clientX - px) * 0.4;
      rx = clamp(rx - (e.clientY - py) * 0.4, -70, 70);
      px = e.clientX; py = e.clientY;
    });
    ['pointerup', 'pointercancel'].forEach(function (ev) {
      vp.addEventListener(ev, function () { dragging = false; });
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (ents) {
        visible = ents[0].isIntersecting;
        ensure();
      }, { threshold: 0 }).observe(vp);
    }
    ensure();
  }

  /* ── 2. 中轴数据条进度指示 ── */
  var spine = { host: null, fill: null, branches: [], ok: false, topAbs: 0, h: 0 };

  function buildSpine() {
    var host = document.getElementById('line-container');
    var gallery = document.getElementById('gallery');
    var polygon = document.querySelector('.polygon-container');
    var main = document.querySelector('main');
    if (!host || !gallery || !polygon || !main) return;

    host.innerHTML = '';
    var track = document.createElement('div');
    track.className = 'spine-track';
    var fill = document.createElement('div');
    fill.className = 'spine-fill';
    track.appendChild(fill);
    host.appendChild(track);

    /* 相对 main 定位：从立方体台下缘垂到尾声网格上缘 */
    var mainTop = main.getBoundingClientRect().top;
    var top = polygon.getBoundingClientRect().bottom - mainTop + 32;
    var end = gallery.getBoundingClientRect().top - mainTop - 48;
    var h = Math.max(200, end - top);
    host.style.top = top + 'px';
    host.style.height = h + 'px';

    spine.host = host;
    spine.fill = fill;
    spine.h = h;
    spine.topAbs = top + mainTop + window.scrollY;

    /* 每个主线作品：节点分支（指向左侧标题列） */
    spine.branches = [];
    document.querySelectorAll('#mainline .project-item').forEach(function (item, i) {
      var r = item.getBoundingClientRect();
      var cy = r.top + r.height / 2 - mainTop - top;   /* 相对 line-container */
      if (cy < 0 || cy > h) return;
      var br = document.createElement('div');
      br.className = 'spine-branch';
      br.style.top = cy.toFixed(0) + 'px';
      br.style.transitionDelay = (i * 0.04).toFixed(2) + 's';
      host.appendChild(br);
      spine.branches.push({ el: br, item: item });
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
    var rect = spine.host.getBoundingClientRect();
    var p = clamp((window.innerHeight * 0.5 - rect.top) / rect.height, 0, 1);
    /* 进度生长；端头位置按 IAM 节奏做 ±3px 微调制，避免死直 */
    var mod = (IAM_BARS[Math.floor(p * 16) % IAM_BARS.length] - 0.75) * 12;
    spine.fill.style.height = clamp(p * rect.height + mod, 0, rect.height).toFixed(1) + 'px';

    var mid = window.innerHeight / 2;
    spine.branches.forEach(function (b) {
      var r = b.item.getBoundingClientRect();
      var on = Math.abs(r.top + r.height / 2 - mid) < r.height * 0.55;
      b.el.classList.toggle('on', on);
      b.item.classList.toggle('spine-on', on);
    });
  }

  /* ── 3. clip-path 鼠标揭示 ── */
  function bindReveal() {
    if (!window.matchMedia('(hover: hover)').matches) return;
    document.querySelectorAll('.image-container').forEach(function (box) {
      if (box.dataset.fx) return;
      box.dataset.fx = '1';
      var reveal = box.querySelector('.layer-reveal');
      if (!reveal) return;
      box.addEventListener('pointermove', function (e) {
        var r = box.getBoundingClientRect();
        var x = e.clientX - r.left, y = e.clientY - r.top;
        box.classList.remove('off');
        var v = 'circle(var(--reveal-r) at ' + x + 'px ' + y + 'px)';
        reveal.style.clipPath = v;
        reveal.style.webkitClipPath = v;
      });
      box.addEventListener('pointerleave', function (e) {
        var r = box.getBoundingClientRect();
        var x = e.clientX - r.left, y = e.clientY - r.top;
        box.classList.add('off');
        var v = 'circle(0px at ' + x + 'px ' + y + 'px)';
        reveal.style.clipPath = v;
        reveal.style.webkitClipPath = v;
      });
    });
  }

  /* ── 4. 页脚 finale ── */
  var IDS = ['Alnt Med', 'an AIPM', 'an Architect', 'a Builder', 'anything.'];
  var finale = { flyband: null, headerBand: null, slot: null, started: false };

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
      /* 静态落底：槽内直接放一条放大的品牌带 */
      var stat = document.createElement('div');
      stat.className = 'fband-static';
      window.Barmorph.mountBrandBand(stat);
      slot.appendChild(stat);
      return;
    }

    /* 下坠飞行体：fixed 单元素，每帧在 header 槽位与 footer 槽位间插值 */
    var fb = document.createElement('div');
    fb.className = 'fly-band';
    window.Barmorph.mountBrandBand(fb);
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
    /* 进入 finale 区一屏内开始下坠，到 finale 底部完成 */
    var span = Math.max(fr.height + vh * 0.4, 1);
    var q = clamp((vh * 0.85 - fr.top) / span, 0, 1);
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

    /* 目标：槽内居中，高约槽高 55%（保持带宽高比 69:22） */
    var natW = 69, natH = 22;
    var sB = Math.min((b.height * 0.55) / natH, (b.width * 0.5) / natW);
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
    initCube();
    buildSpine();
    bindReveal();
    initFinale();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { buildSpine(); });
  if ('ResizeObserver' in window) {
    var t = null;
    new ResizeObserver(function () {
      if (t) clearTimeout(t);
      t = setTimeout(buildSpine, 120);   /* 防抖：图片陆续加载会移动网格 */
    }).observe(document.documentElement);
  }

  window.IndexFx = {
    refresh: refresh,
    /* 手动驱动一帧（调试/隐藏标签页环境验证用） */
    tick: function () { tickSpine(); tickFinale(); }
  };
})();
