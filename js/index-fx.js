/* ════════════════════════════════════════════════════════════
   index-fx.js — 首页动效层：
   1) 大字拟合 fitHeroName（LI WENYUAN ≈92vw）
   2) 中轴数据条进度指示（用户原创，取代老师站的波浪线+圆珠）：
      竖向轨道 + 随滚动生长的墨色填充；到达作品节点时
      延伸一根指向标题列的水平分支，同侧标题提亮。克制。
   3) 页脚 finale：「I am ___」轮换
   （英雄区 3D 作品丝带在 js/ribbon.js；旧 3D 立方体已退役，git 历史可查）
   IndexFx.refresh(list) 由 index.js 渲染完成后调用。
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var REDUCE = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DESKTOP = window.matchMedia('(min-width: 1024px)');
  var IAM_BARS = (window.Barmorph && window.Barmorph.IAM_BARS) || [0.97, 0.58, 1, 0.66, 0.9, 0.52, 0.74, 1];

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ── 大字拟合：Liwenyuan's Website 恰好 ≈92vw（Monterey 就绪后校准一次，resize 复用；
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

    /* 相对 main 定位：从丝带舞台占位（.polygon-container）下缘垂到「尾声」标题上方（勿压到标题文字）。
       占位下缘用 offsetTop 链量（布局值）——rect 会把 heroRise 入场动画的 22px 位移量进去导致起点偏低 */
    var mainRect = main.getBoundingClientRect();
    var polyOy = 0, pEl = polygon;
    while (pEl && pEl !== main) { polyOy += pEl.offsetTop; pEl = pEl.offsetParent; }
    var top = polyOy + polygon.offsetHeight + 48;
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
    var run = function () { scrollRaf = null; tickSpine(); };
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

  /* ── 3. 卡片揭示已移到纯 CSS（.layer-reveal 的 opacity/transform :hover 交叉淡入，
        见 index.css）——不再需要 JS：逐帧动画 mask 会在移动端 webview 连续重绘而闪。 ── */

  /* ── 4. 页脚 finale：I am ___ 轮换（波点带/Logo 下坠已删，直接接页脚） ── */
  var IDS = ['Alnt Med', 'an AIPM', 'an Architect', 'a Builder', 'anything.'];
  var finaleStarted = false;

  function initFinale() {
    if (finaleStarted) return;
    var who = document.getElementById('iamf-who');
    if (!who) return;
    finaleStarted = true;

    /* I am ___ 轮换（2.2s，whoIn 动画靠换 key 重放） */
    var i = 0;
    setInterval(function () {
      i = (i + 1) % IDS.length;
      var next = who.cloneNode(false);
      next.textContent = IDS[i];
      who.parentNode.replaceChild(next, who);
      who = next;
    }, 2200);
  }

  function refresh(list) {
    fitHeroName();
    if (window.Ribbon) window.Ribbon.init(list);   /* 丝带在 buildSpine 前就位（锚点量 polygon 下缘） */
    buildSpine();
    initFinale();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () {
    fitHeroName(); buildSpine();
    if (window.Ribbon) window.Ribbon.relayout();
  });
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
    tick: function () { tickSpine(); }
  };
})();
