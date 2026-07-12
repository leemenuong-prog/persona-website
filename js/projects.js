/* ════════════════════════════════════════════════════════════
   projects.js — 作品清单（渲染进 #projects-list，现挂在 AROUND 页）：
   全部作品按 sort_order 扁平排列，不分组。
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var t = function (obj, base) { return window.I18N.t(obj, base); };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function item(p) {
    var a = document.createElement('a');
    a.className = 'list-item';
    a.href = 'project.html?id=' + encodeURIComponent(p.id);
    a.innerHTML =
      (p.thumb
        ? '<img class="li-thumb" src="' + esc(window.ImgU.variant(p.thumb, 120)) + '" alt="" loading="lazy" decoding="async">'
        : '<span class="li-thumb" aria-hidden="true"></span>') +
      '<span class="li-text">' +
        '<span class="li-title">' + esc(t(p, 'title')) + '</span>' +
        '<p class="li-kw">' + esc(t(p, 'keywords')) + '</p>' +
      '</span>' +
      '<span class="li-meta"><span class="year">' + esc(p.year || '') + '</span>' + esc(p.category || '') + '</span>';
    return a;
  }

  function render(data) {
    var host = document.getElementById('projects-list');
    if (!host) return;
    host.textContent = '';
    (data.projects || []).slice().sort(function (a, b) {
      return (a.sort_order || 99) - (b.sort_order || 99);
    }).forEach(function (p) { host.appendChild(item(p)); });
  }

  function boot() {
    window.Site.loadProjects().then(function (data) {
      render(data);
      document.addEventListener('localechange', function () { render(data); });
    }).catch(function (err) {
      console.error('[projects] projects.json 加载失败', err);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
