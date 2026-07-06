/* ════════════════════════════════════════════════════════════
   projects.js — 全部作品索引页：主线组 + 尾声组扁平列表。
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
        ? '<img class="li-thumb" src="' + esc(p.thumb) + '" alt="" loading="lazy" decoding="async">'
        : '<span class="li-thumb" aria-hidden="true"></span>') +
      '<span class="li-text">' +
        '<span class="li-title">' + esc(t(p, 'title')) + '</span>' +
        '<p class="li-kw">' + esc(t(p, 'keywords')) + '</p>' +
      '</span>' +
      '<span class="li-meta"><span class="year">' + esc(p.year || '') + '</span>' + esc(p.category || '') + '</span>';
    return a;
  }

  function groupLabel(zh, en) {
    var h = document.createElement('h2');
    h.className = 'projects-group-label';
    h.setAttribute('data-zh', zh);
    h.setAttribute('data-en', en);
    h.textContent = window.I18N.locale === 'zh' ? zh : en;
    return h;
  }

  function render(data) {
    var host = document.getElementById('projects-list');
    host.textContent = '';
    var all = (data.projects || []).slice().sort(function (a, b) {
      return (a.sort_order || 99) - (b.sort_order || 99);
    });
    host.appendChild(groupLabel('主线 — AI 产品与 AIGC 工作流', 'MAIN — AI PRODUCTS & AIGC WORKFLOWS'));
    all.filter(function (p) { return p.main === true; }).forEach(function (p) { host.appendChild(item(p)); });
    host.appendChild(groupLabel('尾声 — 建筑作品', 'EPILOGUE — ARCHITECTURE'));
    all.filter(function (p) { return p.main !== true; }).forEach(function (p) { host.appendChild(item(p)); });
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
