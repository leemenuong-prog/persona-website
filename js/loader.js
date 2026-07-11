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
    document.dispatchEvent(new CustomEvent('loaderdone'));   /* 丝带等此信号起跑（ribbon.js） */
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

    /* 名字展开：量 ins 自然宽（clip 不改布局，getBoundingClientRect 得终态宽），
       把 tail 向左预移让位（视觉压紧成「I a m ⬛」），reveal 整体右移半量回中。
       t480 一并归零 + .show 触发 ins clip 揭示——三者 .7s 同曲线锁相。 */
    var t1 = reveal.querySelector('.t1'), t2 = reveal.querySelector('.t2');
    var ins1 = reveal.querySelector('.ins1'), ins2 = reveal.querySelector('.ins2');
    var w1 = ins1 ? ins1.getBoundingClientRect().width : 0;
    var w2 = ins2 ? ins2.getBoundingClientRect().width : 0;
    if (t1) t1.style.transform = 'translateX(' + (-w1).toFixed(2) + 'px)';
    if (t2) t2.style.transform = 'translateX(' + (-w2).toFixed(2) + 'px)';
    reveal.style.transform = 'translateX(' + ((w1 + w2) / 2).toFixed(2) + 'px)';
    void reveal.offsetHeight;   /* 提交初始态，下一拍才起过渡 */

    /* t480 · 展开「lnt med」（clip 揭示 + tail/reveal 归零，锁相） */
    setTimeout(function () {
      reveal.classList.add('show');
      if (t1) t1.style.transform = 'translateX(0)';
      if (t2) t2.style.transform = 'translateX(0)';
      reveal.style.transform = 'translateX(0)';
    }, 480);

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

    /* ── clone：条从基线下方升起（Phase I 260ms，scaleY 从底、走合成器不卡） ──
       条落在【终态盒】(left/top/w/h)，transform-origin 底中，scaleY 0→1 长起来；
       Phase II 的 fly 沿用同一底中原点做 translate+scale 映射，两段过渡连续无跳。 */
    var clones = srcs.map(function (s, i) {
      var d = document.createElement('div');
      d.className = 'mbar';
      d.style.left = s.x + 'px';
      d.style.top = s.y + 'px';
      d.style.width = s.w + 'px';
      d.style.height = s.h + 'px';
      d.style.transformOrigin = '50% 100%';
      d.style.transform = 'scaleY(0)';
      ov.appendChild(d);
      void d.offsetHeight;   /* 提交初始态，下一拍起飞（后台标签页 rAF 兜底） */
      setTimeout(function () {
        d.style.transition = 'transform .26s ' + EZ + ' ' + (i * 0.03).toFixed(2) + 's';
        d.style.transform = 'scaleY(1)';
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
      sq.style.transformOrigin = '50% 100%';
      ov.appendChild(sq);
    }
    reveal.classList.add('gone');

    /* ── Phase II：飞向 header 真身条位（400ms 后启动，1050ms 飞行，纯 transform） ── */
    setTimeout(function () {
      node.classList.add('off');                     /* loader 上滑 */
      document.body.style.overflow = '';

      var tBars = band ? Array.prototype.slice.call(band.querySelectorAll('i')).map(function (el) { return el.getBoundingClientRect(); }) : [];
      var tSq = band ? band.querySelector('.bsq').getBoundingClientRect() : null;

      /* 以底中为原点，把源盒 s 映射到目标盒 t：translate 让底中点对齐 + scale 缩放 */
      function fly(d, s, t, delay) {
        if (!t) {
          d.style.transition = 'opacity .4s ease ' + delay + 's';
          d.style.opacity = '0';
          return;
        }
        var oX = s.x + s.w / 2, oY = s.y + s.h;        /* 源底中（= transform-origin 所在） */
        var tX = t.left + t.width / 2, tY = t.top + t.height;
        d.style.transition =
          'transform 1.05s ' + EZ + ' ' + delay + 's,' +
          'background-color .9s cubic-bezier(.65,.05,.36,1) ' + delay + 's';
        d.style.transform =
          'translate(' + (tX - oX).toFixed(2) + 'px,' + (tY - oY).toFixed(2) + 'px)' +
          ' scale(' + (t.width / s.w).toFixed(4) + ',' + (t.height / s.h).toFixed(4) + ')';
      }
      clones.forEach(function (d, i) {
        var t = tBars[i] || tBars[tBars.length - 1];
        fly(d, srcs[i], t, i * 0.035);
        d.style.backgroundColor = 'var(--bm-bar)';    /* 条：墨→Logo 灰（方块保持 acc 不变） */
      });
      if (sq) { fly(sq, { x: sqR.left, y: sqR.top, w: sqR.width, h: sqR.height }, tSq, 0.05); }

      /* ── Phase III：卸 clone、真身揭幕 ── */
      setTimeout(function () {
        if (band) band.classList.remove('veil');
        ov.remove();
        setTimeout(function () { if (band) band.classList.remove('preset'); }, 80);
        node.remove();
        document.documentElement.classList.remove('loading');
        document.dispatchEvent(new CustomEvent('loaderdone'));   /* 丝带等此信号起跑（ribbon.js） */
      }, 400 + 1350);
    }, 400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
