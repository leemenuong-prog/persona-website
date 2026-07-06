/* ════════════════════════════════════════════════════════════
   loader.js — 启动页编舞（仅 index.html）。
   时序（照旧站规格，落点改为右上角 header .logoslot）：
   t0      进度条起跑 ·「I am」+ 句点已在场
   t480    .show →「lnt med」展开成「I alnt med」
   t1380   morph：Phase I 260ms 字母冻结成条（I→1 a→3 m→4，梯次 30ms）
           Phase II 1350ms 条飞入 header Logo 槽（梯次 35ms）+ loader 上滑
           Phase III 卸 clone、真身揭幕
   跳过条件：sessionStorage.loaderPlayed / prefers-reduced-motion。
   依赖：main.js 已注入 header 并挂好 .logoslot 里的 .brandband。
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var EZ = 'cubic-bezier(.16,1,.3,1)';
  /* 整个名字逐字母冻结成条：I·a·l·n·t·m·e·d 八个字母 → 八根 Logo 条 */

  function skip(node) {
    if (node) node.remove();
    document.documentElement.classList.remove('loading');
  }

  function boot() {
    var node = document.getElementById('loader');
    if (!node) return;

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var played = false;
    try { played = sessionStorage.getItem('loaderPlayed') === '1'; } catch (e) {}
    if (reduce || played) { skip(node); return; }
    try { sessionStorage.setItem('loaderPlayed', '1'); } catch (e) {}

    document.documentElement.classList.add('loading');
    document.body.style.overflow = 'hidden';

    var band = document.querySelector('.site-header .brandband');
    if (band) {
      /* 真身预置：条全高但隐身、免动画，等 clone 落位再揭幕 */
      band.classList.add('preset', 'veil', 'in');
    }

    var reveal = node.querySelector('.lreveal');
    node.classList.add('run');

    /* t480 · 展开「lnt med」 */
    setTimeout(function () { reveal.classList.add('show'); }, 480);

    /* t1380 · morph */
    setTimeout(function () { morph(node, reveal, band); }, 1380);
  }

  function morph(node, reveal, band) {
    var ov = document.createElement('div');
    ov.className = 'morph-ov';
    document.body.appendChild(ov);

    /* ── 源：每个字母一根条（八字母对八根 Logo 条） ── */
    var srcs = [];
    reveal.querySelectorAll('.lt').forEach(function (el) {
      var r = el.getBoundingClientRect();
      srcs.push({ x: r.left + r.width * 0.15, y: r.top, w: r.width * 0.7, h: r.height });
    });
    var sqEl = reveal.querySelector('.lsq');
    var sqR = sqEl ? sqEl.getBoundingClientRect() : null;

    /* ── clone：条从基线下方升起（Phase I 260ms） ── */
    var clones = srcs.map(function (s, i) {
      var d = document.createElement('div');
      d.className = 'mbar';
      d.style.left = s.x + 'px';
      d.style.top = (s.y + s.h) + 'px';
      d.style.width = s.w + 'px';
      d.style.height = '0px';
      ov.appendChild(d);
      /* 强制一次重排提交初始态，再下一拍起飞（后台标签页 rAF 兜底） */
      void d.offsetHeight;
      setTimeout(function () {
        d.style.transition = 'top .26s ' + EZ + ' ' + (i * 0.03).toFixed(2) + 's, height .26s ' + EZ + ' ' + (i * 0.03).toFixed(2) + 's';
        d.style.top = s.y + 'px';
        d.style.height = s.h + 'px';
      }, 30);
      return d;
    });
    var sq = null;
    if (sqR) {
      sq = document.createElement('div');
      sq.className = 'mbar msq';
      sq.style.left = sqR.left + 'px';
      sq.style.top = sqR.top + 'px';
      sq.style.width = sqR.width + 'px';
      sq.style.height = sqR.height + 'px';
      ov.appendChild(sq);
    }
    reveal.classList.add('gone');

    /* ── Phase II：飞向 header 真身条位（400ms 后启动，1050ms 飞行） ── */
    setTimeout(function () {
      node.classList.add('off');                     /* loader 上滑 */
      document.body.style.overflow = '';

      var tBars = band ? Array.prototype.slice.call(band.querySelectorAll('i')).map(function (el) { return el.getBoundingClientRect(); }) : [];
      var tSq = band ? band.querySelector('.bsq').getBoundingClientRect() : null;

      function fly(d, t, delay) {
        if (!t) { d.style.opacity = '0'; return; }
        d.style.transition =
          'left 1.05s ' + EZ + ' ' + delay + 's, top 1.05s ' + EZ + ' ' + delay + 's,' +
          'width 1.05s ' + EZ + ' ' + delay + 's, height 1.05s ' + EZ + ' ' + delay + 's,' +
          'background-color .9s cubic-bezier(.65,.05,.36,1) ' + delay + 's';
        d.style.left = t.left + 'px';
        d.style.top = t.top + 'px';
        d.style.width = t.width + 'px';
        d.style.height = t.height + 'px';
      }
      clones.forEach(function (d, i) {
        var t = tBars[i] || tBars[tBars.length - 1];
        fly(d, t, i * 0.035);
        d.style.backgroundColor = 'var(--bm-bar)';
      });
      if (sq) { fly(sq, tSq, 0.05); }

      /* ── Phase III：卸 clone、真身揭幕 ── */
      setTimeout(function () {
        if (band) band.classList.remove('veil');
        ov.remove();
        setTimeout(function () { if (band) band.classList.remove('preset'); }, 80);
        node.remove();
        document.documentElement.classList.remove('loading');
      }, 400 + 1350);
    }, 400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
