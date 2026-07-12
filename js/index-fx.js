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
    /* clientWidth（布局视口）：innerWidth 含滚动条/个别环境报设备像素（2026-07-12 加固） */
    var vw = document.documentElement.clientWidth || window.innerWidth;
    var next = clamp(cur * (vw * 0.92) / w, 0.6, 1.4);
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

    /* <1024 轴 display:none（设计决定）——跳过重建（2026-07-12 性能档：RO 每次图片加载
       都防抖触发本函数，手机端反复建几百个 <i> 纯浪费）。穿越回桌面：resize →
       Ribbon.relayout →（geoKey 必变）→ ribbonlayout 事件 → 本函数重建 */
    if (!DESKTOP.matches) {
      if (spine.ok) { host.innerHTML = ''; spine.ticks = []; spine.branches = []; }
      spine.ok = false;
      return;
    }

    host.innerHTML = '';

    /* 相对 main 定位：轴头优先钉在丝带环的地影中心（.ribbon-floor，七迭代「进度轴上移、
       与环相接」——环 → 地影 → 轴一条视觉链，环前弧从轴头上方扫过）；地影未就位时回退
       丝带占位下缘 +48。一律 offsetTop 链量布局值——rect 会把 heroRise 入场位移量进去 */
    var mainRect = main.getBoundingClientRect();
    var top;
    var floor = document.querySelector('.ribbon-floor');
    if (floor && floor.style.top) {
      var heroOy = 0, hEl = floor.offsetParent;        /* floor 定位于 .hero */
      while (hEl && hEl !== main) { heroOy += hEl.offsetTop; hEl = hEl.offsetParent; }
      top = heroOy + parseFloat(floor.style.top) + floor.offsetHeight * 0.5;
    } else {
      var polyOy = 0, pEl = polygon;
      while (pEl && pEl !== main) { polyOy += pEl.offsetTop; pEl = pEl.offsetParent; }
      top = polyOy + polygon.offsetHeight + 48;
    }
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

    /* I am ___ 轮换（2.2s，whoIn 动画靠换 key 重放）。
       IO 门控（2026-07-12 性能档）：finale 不可见时停表——此前 2.2s 定时器+blur 关键帧
       永动，读英雄区时也在页底空烧主线程/合成器 */
    var i = 0, timer = null;
    function step() {
      i = (i + 1) % IDS.length;
      var next = who.cloneNode(false);
      next.textContent = IDS[i];
      who.parentNode.replaceChild(next, who);
      who = next;
    }
    function start() { if (!timer) timer = setInterval(step, 2200); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    var fin = document.getElementById('finale');
    if (fin && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        if (entries[entries.length - 1].isIntersecting) start(); else stop();
      }).observe(fin);
    } else {
      start();                                         /* 无 IO 环境回退旧行为 */
    }
  }

  function refresh(list) {
    fitHeroName();
    if (window.Ribbon) window.Ribbon.init(list);   /* 丝带在 buildSpine 前就位（锚点量 polygon 下缘） */
    buildSpine();
    initFinale();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  /* 丝带几何就位/变更 → 轴头重锚到地影中心（ribbon.js relayout 派发） */
  document.addEventListener('ribbonlayout', function () { buildSpine(); });
  /* resize：大字拟合即时（单次量测，便宜），丝带几何解算+双 canvas 重分配尾沿防抖 120ms
     （连续拖拽窗口不再每事件全量重解+反复申请十几 MB 背衬）。buildSpine 不在此直呼——
     relayout 尾部派发的 ribbonlayout 会触发一次（消除每 resize 跑两遍）；无丝带时才直接重建轴。 */
  var resizeT = null;
  window.addEventListener('resize', function () {
    fitHeroName();
    if (resizeT) clearTimeout(resizeT);
    resizeT = setTimeout(function () {
      if (window.Ribbon) window.Ribbon.relayout();
      else buildSpine();
    }, 120);
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
