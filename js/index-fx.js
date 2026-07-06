/* ════════════════════════════════════════════════════════════
   index-fx.js — 首页三大交互：
   1) 3D 立方体：rAF 自转 0.15°/帧 + Pointer 拖拽，离屏暂停
   2) 中轴滚动线 + 珠：SVG path + getPointAtLength（直线也走
      path，日后可弯），滚动进度取点
   3) clip-path 鼠标揭示：circle(60px at 光标)，每帧直写无过渡
   IndexFx.refresh() 由 index.js 渲染完成后调用（含语言切换重渲染）。
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var REDUCE = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DESKTOP = window.matchMedia('(min-width: 1024px)');

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
    if (REDUCE) return;   /* 静止在 3/4 视角 */

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
      rx = Math.max(-70, Math.min(70, rx - (e.clientY - py) * 0.4));
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

  /* ── 2. 中轴滚动线 + 珠 ── */
  var spine = { svg: null, path: null, bead: null, ok: false };

  function buildSpine() {
    var host = document.getElementById('line-container');
    if (!host) return;
    if (!spine.svg) {
      host.innerHTML = '';
      var NS = 'http://www.w3.org/2000/svg';
      spine.svg = document.createElementNS(NS, 'svg');
      spine.path = document.createElementNS(NS, 'path');
      spine.path.setAttribute('class', 'spine-path');
      spine.svg.appendChild(spine.path);
      host.appendChild(spine.svg);
      spine.bead = document.createElement('div');
      spine.bead.className = 'scroll-bead';
      spine.bead.style.opacity = '0';
      document.body.appendChild(spine.bead);
    }
    measureSpine();
  }

  function measureSpine() {
    if (!spine.svg) return;
    var host = document.getElementById('line-container');
    var gallery = document.getElementById('gallery');
    var polygon = document.querySelector('.polygon-container');
    var main = document.querySelector('main');
    if (!host || !gallery || !polygon || !main) return;
    /* 相对 main 计算：线从立方体台下缘垂到尾声网格上缘（绝对定位，不回馈文档高度） */
    var mainTop = main.getBoundingClientRect().top;
    var top = polygon.getBoundingClientRect().bottom - mainTop + 24;
    var end = gallery.getBoundingClientRect().top - mainTop - 40;
    var h = Math.max(200, end - top);
    host.style.top = top + 'px';
    spine.svg.setAttribute('width', '24');
    spine.svg.setAttribute('height', String(h));
    spine.path.setAttribute('d', 'M 12 0 L 12 ' + h);
    spine.ok = true;
    onScroll();
  }

  var scrollRaf = null;
  function onScroll() {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(function () {
      scrollRaf = null;
      if (!spine.ok || !DESKTOP.matches) return;
      var rect = spine.svg.getBoundingClientRect();
      var total = spine.path.getTotalLength();
      var progress = (window.innerHeight * 0.5 - rect.top) / rect.height;
      progress = Math.max(0, Math.min(1, progress));
      var pt = spine.path.getPointAtLength(progress * total);
      var x = rect.left + pt.x;
      var y = rect.top + pt.y;
      var onScreen = y > -30 && y < window.innerHeight + 30 && progress > 0 && progress < 1;
      spine.bead.style.opacity = onScreen ? '1' : '0';
      spine.bead.style.left = x + 'px';
      spine.bead.style.top = y + 'px';

      /* 滚到主线项附近时点亮 */
      var glow = false;
      document.querySelectorAll('.project-item').forEach(function (item) {
        var r = item.getBoundingClientRect();
        var c = r.top + r.height / 2;
        if (Math.abs(c - window.innerHeight / 2) < r.height / 2) glow = true;
      });
      spine.bead.classList.toggle('glow', glow);
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

  function refresh() {
    initCube();
    buildSpine();
    bindReveal();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', measureSpine);
  if ('ResizeObserver' in window) {
    /* 图片陆续加载会改变 gallery 位置 — 随 body 高度变化重新丈量 */
    new ResizeObserver(function () { measureSpine(); }).observe(document.documentElement);
  }

  window.IndexFx = { refresh: refresh };
})();
