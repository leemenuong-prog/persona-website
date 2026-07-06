/* ════════════════════════════════════════════════════════════
   project-detail.js — 作品详情页渲染器。
   URL: project.html?id={projectId}
   渲染顺序：头部（标题/keywords/奖项/Meta/tags）→ 媒体块
   （video-local / iframe-lazy 门面）→ 正文（四段式，缺段回退
   full_description）→ Tech Stack → 内容长图（显式 contentImages
   列表 + 文字球图注 + 点击 lightbox）。
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var t = function (obj, base) { return window.I18N.t(obj, base); };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function getId() {
    try { return new URLSearchParams(location.search).get('id') || ''; } catch (e) { return ''; }
  }

  /* ── 头部 ── */
  function renderHeader(p) {
    var host = document.getElementById('project-header');
    host.textContent = '';

    var title = t(p, 'title');
    var h1 = el('h1', 'detail-title');
    if (p.url) {
      h1.innerHTML = '<a href="' + esc(p.url) + '" target="_blank" rel="noopener">' +
        esc(title) + ' <span class="ext" aria-hidden="true">↗</span></a>';
    } else {
      h1.textContent = title;
    }
    host.appendChild(h1);

    var kw = t(p, 'keywords');
    if (kw) host.appendChild(el('p', 'detail-keywords', esc(kw)));
    var award = t(p, 'award');
    if (award) host.appendChild(el('p', 'detail-award', esc(award)));

    var meta = el('div', 'detail-meta');
    var metaDefs = [
      ['category', { zh: '类别', en: 'Category' }],
      ['location', { zh: '地点', en: 'Location' }],
      ['year', { zh: '年份', en: 'Year' }],
      ['team_size', { zh: '团队', en: 'Team' }],
      ['role', { zh: '角色', en: 'Role' }]
    ];
    metaDefs.forEach(function (def) {
      var key = def[0];
      var val = (key === 'role' || key === 'category') ? t(p, key) : p[key];
      if (!val) return;
      var item = el('div', 'meta-item');
      item.appendChild(el('span', 'meta-label',
        esc(window.I18N.locale === 'zh' ? def[1].zh : def[1].en)));
      item.appendChild(document.createTextNode(val));
      meta.appendChild(item);
    });
    if (meta.children.length) host.appendChild(meta);

    if (p.tags && p.tags.length) {
      var tags = el('div', 'detail-tags');
      p.tags.forEach(function (tag) { tags.appendChild(el('span', 'tag-pill', esc(tag))); });
      host.appendChild(tags);
    }

    document.title = title + ' · 李文苑 Alnt Med';
  }

  /* ── 媒体块 ── */
  function mediaVideoLocal(m) {
    var block = el('div', 'media-block');
    var frame = el('div', 'media-frame media-facade');
    frame.innerHTML =
      (m.poster ? '<img class="facade-cover" src="' + esc(m.poster) + '" alt="" loading="lazy">' : '') +
      '<button class="facade-btn" type="button" aria-label="播放视频 · Play">▶</button>' +
      '<div class="facade-label">' + esc(window.I18N.locale === 'zh' ? (m.label_zh || '点击播放 · PLAY') : (m.label_en || 'PLAY')) + '</div>';
    frame.addEventListener('click', function play() {
      frame.removeEventListener('click', play);
      frame.classList.remove('media-facade');
      frame.innerHTML = '';
      var v = document.createElement('video');
      v.src = m.src;
      v.controls = true;
      v.playsInline = true;
      v.preload = 'auto';
      if (m.poster) v.poster = m.poster;
      frame.appendChild(v);
      v.play().catch(function () { /* 需要手势的环境下留给 controls */ });
    });
    block.appendChild(frame);
    return block;
  }

  function mediaIframeLazy(m) {
    var block = el('div', 'media-block');
    var frame = el('div', 'media-frame media-facade');
    frame.innerHTML =
      (m.poster ? '<img class="facade-cover" src="' + esc(m.poster) + '" alt="" loading="lazy">' : '') +
      '<button class="facade-btn" type="button" aria-label="加载交互演示 · Load demo">▶</button>' +
      '<div class="facade-label">' + esc(window.I18N.locale === 'zh' ? (m.label_zh || '点击加载交互演示') : (m.label_en || 'Load interactive demo')) + '</div>';
    frame.addEventListener('click', function load() {
      frame.removeEventListener('click', load);
      frame.classList.remove('media-facade');
      frame.innerHTML = '';
      var f = document.createElement('iframe');
      f.src = m.src;
      f.loading = 'lazy';
      f.allow = 'fullscreen';
      f.title = m.label_zh || 'demo';
      frame.appendChild(f);
    });
    block.appendChild(frame);
    if (m.cta_url) {
      block.appendChild(el('p', 'media-cta',
        '<a href="' + esc(m.cta_url) + '" target="_blank" rel="noopener">' +
        esc(window.I18N.locale === 'zh' ? (m.cta_zh || '打开线上版 ↗') : (m.cta_en || 'Open live site ↗')) + '</a>'));
    }
    return block;
  }

  function renderMedia(p) {
    var host = document.getElementById('media-container');
    host.textContent = '';
    (p.media || []).forEach(function (m) {
      if (m.type === 'video-local') host.appendChild(mediaVideoLocal(m));
      else if (m.type === 'iframe-lazy') host.appendChild(mediaIframeLazy(m));
    });
  }

  /* ── 正文：四段式（缺任一段回退 full_description） ── */
  var SECTION_ORDER = ['tldr', 'key_contributions', 'how_it_works', 'why_it_matters'];

  function sectionBody(text) {
    /* 以换行拆列表；单段落直接 p */
    var lines = String(text).split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
    if (lines.length > 1) {
      return '<ul>' + lines.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul>';
    }
    return '<p>' + esc(lines[0] || '') + '</p>';
  }

  function renderContent(p) {
    var host = document.getElementById('content-column');
    host.textContent = '';

    var oneliner = t(p, 'one_liner');
    if (oneliner) host.appendChild(el('p', 'detail-oneliner', esc(oneliner)));

    var sections = p.sections || {};
    var complete = SECTION_ORDER.every(function (k) { return t(sections[k] || {}, 'body'); });

    if (complete) {
      SECTION_ORDER.forEach(function (k) {
        var s = sections[k];
        var sec = el('section', 'detail-section');
        sec.appendChild(el('h2', null, esc(t(s, 'title'))));
        sec.insertAdjacentHTML('beforeend', sectionBody(t(s, 'body')));
        host.appendChild(sec);
      });
    } else {
      var full = t(p, 'full_description');
      if (full) {
        var sec = el('section', 'detail-section');
        String(full).split('\n\n').forEach(function (para) {
          if (para.trim()) sec.appendChild(el('p', null, esc(para.trim())));
        });
        host.appendChild(sec);
      }
    }

    var tech = t(p, 'tech_stack');
    if (tech) {
      host.appendChild(el('p', 'detail-tech',
        '<span class="label">' + (window.I18N.locale === 'zh' ? '技术与工具' : 'TECH & TOOLS') + '</span>' + esc(tech)));
    }
  }

  /* ── 内容长图 + 文字球 + lightbox ── */
  function renderImages(p) {
    var host = document.getElementById('content-images');
    host.textContent = '';
    var anns = p.annotations || {};
    (p.contentImages || []).forEach(function (src, i) {
      var fig = el('figure', 'content-figure');
      var img = document.createElement('img');
      img.src = src;
      img.alt = t(p, 'title') + ' — ' + (i + 1);
      img.loading = 'lazy';
      img.decoding = 'async';
      img.addEventListener('click', function () { window.Site.openLightbox(src, img.alt); });
      fig.appendChild(img);

      var ann = anns[String(i + 1)];
      if (ann) {
        var ball = el('button', 'text-ball');
        ball.type = 'button';
        ball.setAttribute('aria-label', window.I18N.locale === 'zh' ? '查看图注' : 'View note');
        ball.addEventListener('click', function (e) {
          e.stopPropagation();
          var body = el('div', 'annotation-body');
          var kick = t(ann, 'kick');
          body.innerHTML = (kick ? '<span class="annotation-kick">' + esc(kick) + '</span>' : '') +
            esc(t(ann, 'body'));
          window.Site.openModal(body);
        });
        fig.appendChild(ball);
      }
      host.appendChild(fig);
    });
  }

  function renderNotFound(id) {
    var host = document.getElementById('project-header');
    host.innerHTML = '<div class="detail-notfound">' +
      '<p>没有找到这个作品（id: ' + esc(id) + '）。</p>' +
      '<p><a href="projects.html">回到全部作品 →</a></p></div>';
  }

  function render(p) {
    renderHeader(p);
    renderMedia(p);
    renderContent(p);
    renderImages(p);
  }

  function boot() {
    /* Back 按钮：有站内来路则 history.back，保滚动位置 */
    var back = document.getElementById('back-button');
    if (back && document.referrer && document.referrer.indexOf(location.host) !== -1) {
      back.addEventListener('click', function (e) { e.preventDefault(); history.back(); });
    }

    var id = getId();
    window.Site.loadProjects().then(function (data) {
      var p = (data.projects || []).find(function (x) { return x.id === id; });
      if (!p) { renderNotFound(id); return; }
      render(p);
      document.addEventListener('localechange', function () { render(p); });
    }).catch(function (err) {
      console.error('[detail] projects.json 加载失败', err);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
