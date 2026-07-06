/* ════════════════════════════════════════════════════════════
   index.js — 首页：主线大卡 + 尾声网格渲染（数据来自
   config/projects.json）· M2 再接立方体/滚动线珠/揭示交互。
   依赖：main.js（Site.loadProjects / initReveal）· language-toggle.js。
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var t = function (obj, base) { return window.I18N.t(obj, base); };

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* 图块：三层（底图 + 揭示层 + 缺图兜底） */
  function imageBlock(p, sizeHint) {
    var box = el('div', 'image-container');
    if (p.thumb) {
      var base = document.createElement('img');
      base.className = 'layer-base';
      base.src = p.thumb;
      base.alt = t(p, 'title');
      base.loading = 'lazy';
      base.decoding = 'async';
      base.width = sizeHint || 720; base.height = sizeHint || 720;
      base.addEventListener('error', function () {
        base.remove();
        box.appendChild(el('div', 'thumb-fallback', esc(p.title_en || p.id)));
      });
      box.appendChild(base);
      if (p.float && p.float.reveal) {
        var rev = document.createElement('img');
        rev.className = 'layer-reveal';
        rev.src = p.float.reveal;
        rev.alt = '';
        rev.loading = 'lazy';
        rev.decoding = 'async';
        rev.addEventListener('error', function () { rev.remove(); });
        box.appendChild(rev);
      }
    } else {
      box.appendChild(el('div', 'thumb-fallback', esc(p.title_en || p.id)));
    }
    return box;
  }

  function renderMainline(list) {
    var host = document.getElementById('mainline');
    host.textContent = '';
    list.forEach(function (p) {
      var item = el('article', 'project-item');
      item.setAttribute('data-reveal', '');

      var txt = el('div', 'text-container');
      var top = el('div', 'title-section');
      top.appendChild(el('h3', 'project-title',
        '<a href="project.html?id=' + encodeURIComponent(p.id) + '">' + esc(t(p, 'title')) + '</a>'));
      top.appendChild(el('p', 'project-keywords', esc(t(p, 'keywords'))));
      if (p.award_zh) top.appendChild(el('p', 'project-award', esc(t(p, 'award'))));
      var bottom = el('div', 'content-section');
      bottom.appendChild(el('p', 'project-desc', esc(t(p, 'desc'))));
      txt.appendChild(top);
      txt.appendChild(bottom);

      var rail = el('div', 'rail-gap');

      var imgLink = el('a', 'image-link');
      imgLink.href = 'project.html?id=' + encodeURIComponent(p.id);
      imgLink.setAttribute('aria-label', t(p, 'title'));
      imgLink.appendChild(imageBlock(p, 720));

      item.appendChild(txt);
      item.appendChild(rail);
      item.appendChild(imgLink);
      host.appendChild(item);
    });
  }

  function renderGallery(list) {
    var host = document.getElementById('gallery');
    host.textContent = '';
    list.forEach(function (p) {
      var a = el('a', 'gallery-item');
      a.href = 'project.html?id=' + encodeURIComponent(p.id);
      a.setAttribute('data-reveal', '');
      a.appendChild(imageBlock(p, 480));
      a.appendChild(el('div', 'gallery-title', esc(t(p, 'title'))));
      host.appendChild(a);
    });
  }

  function render(data) {
    var all = (data.projects || []).slice().sort(function (a, b) {
      return (a.sort_order || 99) - (b.sort_order || 99);
    });
    renderMainline(all.filter(function (p) { return p.main === true; }));
    renderGallery(all.filter(function (p) { return p.main !== true; }));
    window.Site.initReveal();
    if (window.IndexFx) window.IndexFx.refresh();   /* M2 交互层重新丈量 */
  }

  function boot() {
    window.Site.loadProjects()
      .then(function (data) {
        render(data);
        document.addEventListener('localechange', function () { render(data); });
      })
      .catch(function (err) {
        console.error('[index] projects.json 加载失败', err);
        var host = document.getElementById('mainline');
        host.appendChild(el('p', 'project-desc',
          '作品数据加载失败——请通过 HTTP 服务访问（file:// 下 fetch 会被拦）。'));
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
