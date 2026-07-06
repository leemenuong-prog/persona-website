/* ════════════════════════════════════════════════════════════
   about.js — 关于页：BarWord 标题（字⇄条出生一次后定格）。
   正文内容为静态 HTML（M4 填充）。
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function boot() {
    var host = document.getElementById('about-title');
    if (host && window.Barmorph) {
      window.Barmorph.barWord(host, 'WHOAMI', { period: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
