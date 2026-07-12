/* ════════════════════════════════════════════════════════════
   project-detail.js — 作品详情页渲染器。
   URL: project.html?id={projectId}

   两种形态：
   ① 作品集映射模式（config/portfolio.json products[].mapped=true 的
     AI 作品）：与作品集页（portfolio/）同一事实源、同一排版——
     头部（kicker+Monterey 标题+keywords）→ 顶部视频门面（Pears/Co-work，
     视频入口因此出现两次，用户裁定没关系）→ 封面块（tldr 双栏+奖项+
     指标带+落地页说明头+落地页大图）→ 线稿块 → 场景行模块 →
     影片块+STACK。连续网页流（照 architecture.html 阅读器），非 A4；
     作品集没放的内容（meta 行/tags/旧内容长图/图注球）画廊也不放。
   ② 经典模式（建筑作品）：头部（标题/keywords/
     奖项/Meta/tags）→ 媒体块 → 正文（缺段回退 full_description）→
     Tech Stack → 内容长图 + 文字球。
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

  /* ↗ 用内嵌 SVG：U+2197 不在 Monterey 的 unicode-range 内，iOS 回退会落
     Apple Color Emoji；文本文案里的 ↗ 则统一补 FE0E 文本变体选择符（fe）。 */
  var ARROW_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path d="M7 17 17 7M7 7h10v10" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
  function extArrow(cls) {
    var s = document.createElement('span');
    s.className = cls;
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML = ARROW_SVG;
    return s;
  }
  function fe(s) { return s ? String(s).replace(/↗(?!︎)/g, '↗︎') : s; }
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
        esc(title) + ' <span class="ext" aria-hidden="true">' + ARROW_SVG + '</span></a>';
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

    document.title = title + ' · Alnt_med';
  }

  /* ── 媒体块 ── */
  function mediaVideoLocal(m) {
    var block = el('div', 'media-block');
    var frame = el('div', 'media-frame media-facade');
    frame.innerHTML =
      (m.poster ? '<img class="facade-cover" src="' + esc(m.poster) + '" alt="" loading="lazy">' : '') +
      '<button class="facade-btn" type="button" aria-label="播放视频 · Play">▶</button>' +
      '<div class="facade-label">' + esc(fe(window.I18N.locale === 'zh' ? (m.label_zh || '点击播放 · PLAY') : (m.label_en || 'PLAY'))) + '</div>';
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

  function mediaImage(m) {
    var block = el('div', 'media-block');
    var frame = el('div', 'media-frame media-image');
    var img = document.createElement('img');
    img.src = m.src;
    img.alt = window.I18N.locale === 'zh' ? (m.alt_zh || '') : (m.alt_en || m.alt_zh || '');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.addEventListener('click', function () { window.Site.openLightbox(m.src, img.alt); });
    frame.appendChild(img);
    block.appendChild(frame);
    var label = window.I18N.locale === 'zh' ? m.label_zh : (m.label_en || m.label_zh);
    if (label) block.appendChild(el('p', 'media-caption', esc(label)));
    return block;
  }

  function mediaIframeLazy(m) {
    var block = el('div', 'media-block');
    var frame = el('div', 'media-frame media-facade');
    frame.innerHTML =
      (m.poster ? '<img class="facade-cover" src="' + esc(m.poster) + '" alt="" loading="lazy">' : '') +
      '<button class="facade-btn" type="button" aria-label="加载交互演示 · Load demo">▶</button>' +
      '<div class="facade-label">' + esc(fe(window.I18N.locale === 'zh' ? (m.label_zh || '点击加载交互演示') : (m.label_en || 'Load interactive demo'))) + '</div>';
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
        esc(fe(window.I18N.locale === 'zh' ? (m.cta_zh || '打开线上版 ↗') : (m.cta_en || 'Open live site ↗'))) + '</a>'));
    }
    return block;
  }

  function renderMedia(p) {
    var host = document.getElementById('media-container');
    host.textContent = '';
    (p.media || []).forEach(function (m) {
      if (m.type === 'video-local') host.appendChild(mediaVideoLocal(m));
      else if (m.type === 'iframe-lazy') host.appendChild(mediaIframeLazy(m));
      else if (m.type === 'image') host.appendChild(mediaImage(m));
    });
  }

  /* ── 正文：四段式（缺任一核心段回退 full_description）。
     why_built 是可选第五段，有则按 SECTION_ORDER 的位置插入，
     不参与 complete 判定（老项目无此段不受影响）。 ── */
  var SECTION_ORDER = ['tldr', 'why_built', 'key_contributions', 'how_it_works', 'why_it_matters'];
  var CORE_SECTIONS = ['tldr', 'key_contributions', 'how_it_works', 'why_it_matters'];

  function sectionBody(text) {
    /* 以换行拆列表；单段落直接 p。
       行首「标签：内容」→ 标签加粗（照老师 How It Works 条目式，全半角冒号都认，
       标签限 12 字内防止误伤含冒号的普通句子）。 */
    function line(l) {
      var m = l.match(/^([^：:]{1,10})([：:])\s*(.+)$/);
      if (m) return '<strong>' + esc(m[1]) + m[2] + '</strong> ' + esc(m[3]);
      return esc(l);
    }
    var lines = String(text).split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
    if (lines.length > 1) {
      return '<ul>' + lines.map(function (l) { return '<li>' + line(l) + '</li>'; }).join('') + '</ul>';
    }
    return '<p>' + line(lines[0] || '') + '</p>';
  }

  /* 段落配图：s.figure = { src, caption_zh, caption_en }，无则返回 null */
  function sectionFigure(s, p) {
    var f = s && s.figure;
    if (!f || !f.src) return null;
    var fig = el('figure', 'section-figure');
    var img = document.createElement('img');
    img.src = f.src;
    img.alt = t(f, 'caption') || t(p, 'title');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.addEventListener('click', function () { window.Site.openLightbox(f.src, img.alt); });
    fig.appendChild(img);
    var cap = t(f, 'caption');
    if (cap) fig.appendChild(el('figcaption', null, esc(cap)));
    return fig;
  }

  function renderContent(p) {
    var host = document.getElementById('content-column');
    host.textContent = '';

    var oneliner = t(p, 'one_liner');
    if (oneliner) host.appendChild(el('p', 'detail-oneliner', esc(oneliner)));

    var sections = p.sections || {};
    var complete = CORE_SECTIONS.every(function (k) { return t(sections[k] || {}, 'body'); });

    if (complete) {
      SECTION_ORDER.forEach(function (k) {
        var s = sections[k];
        if (!s || !t(s, 'body')) return;
        var sec = el('section', 'detail-section');
        sec.setAttribute('data-skey', k);
        sec.appendChild(el('h2', null, esc(t(s, 'title'))));
        sec.insertAdjacentHTML('beforeend', sectionBody(t(s, 'body')));
        var fg = sectionFigure(s, p);
        if (fg) sec.appendChild(fg);
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

  /* ════════════════════════════════════════════════════════════
     作品集映射模式 —— 与 portfolio/portfolio.js 同一套排版语法
     （plist / secH / 窗框 / 场景行模块 / 线稿块 / 影片块），
     尺度换网页阅读档（css/project-detail.css 的 .pd-mapped 段）。
     ════════════════════════════════════════════════════════════ */

  function h(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function psq() { return h('span', 'psq'); }
  function pad2(n) { return String(n).padStart(2, '0'); }
  function hostOf(url) { try { return new URL(url).hostname; } catch (e) { return ''; } }
  function zoomable(im, src, alt) {
    im.addEventListener('click', function () {
      if (window.Site && Site.openLightbox) Site.openLightbox(src, alt || '');
    });
  }

  /* body 按 \n 拆「—」列表；行首「标签：」加粗，否则加粗首个逗号前的
     短语（先说结论四条的 STAR 头）——与 portfolio.js plist 同口径 */
  function plist(body) {
    var ul = h('ul', 'plist');
    String(body || '').split('\n').forEach(function (line) {
      line = line.trim();
      if (!line) return;
      var li = h('li');
      var m = line.match(/^(.{1,10}[：:])\s*(.*)$/);
      if (!m) {
        var c = line.match(/^([^，,]{2,24}[，,]\s*)([\s\S]*)$/);
        if (c) m = [null, c[1], c[2]];
      }
      if (m) {
        li.appendChild(h('b', null, m[1]));
        var sep = /[:,]$/.test(m[1].trim()) ? ' ' : '';
        li.appendChild(document.createTextNode(sep + m[2]));
      } else {
        li.textContent = line;
      }
      ul.appendChild(li);
    });
    return ul;
  }

  /* 章节 h2：英文大标 + 中文小注（EN 版 CSS 隐藏 .zh-note） */
  function secH(section) {
    var elh = h('h2', 'sec-h');
    elh.appendChild(document.createTextNode(section.title_en || section.title_zh || ''));
    if (section.title_zh) elh.appendChild(h('span', 'zh-note', section.title_zh));
    return elh;
  }

  /* Mac/浏览器/手机窗框（三灯 = macOS 原色，灰阶体系的色彩例外） */
  function winEl(src, ratio, opts) {
    opts = opts || {};
    var alt = opts.alt || '';
    function shotBox() {
      var scr = h('div', 'win-shot');
      scr.style.setProperty('--r', ratio);
      var im = h('img');
      im.src = src; im.alt = alt; im.loading = 'lazy'; im.decoding = 'async';
      zoomable(im, src, alt);
      scr.appendChild(im);
      return scr;
    }
    if (opts.frame === 'phone') {
      var ph = h('div', 'phone-shell' + (opts.small ? ' win-sm' : ''));
      ph.appendChild(shotBox());
      return ph;
    }
    if (opts.frame === 'none') {
      var pl = h('div', 'shot-plain' + (opts.small ? ' win-sm' : ''));
      pl.style.setProperty('--r', ratio);
      var im2 = h('img');
      im2.src = src; im2.alt = alt; im2.loading = 'lazy'; im2.decoding = 'async';
      zoomable(im2, src, alt);
      pl.appendChild(im2);
      return pl;
    }
    var w = h('div', 'win' + (opts.small ? ' win-sm' : ''));
    var bar = h('div', 'win-bar');
    bar.appendChild(h('span', 'win-dot'));
    bar.appendChild(h('span', 'win-dot'));
    bar.appendChild(h('span', 'win-dot'));
    if (opts.frame === 'browser' && opts.url && !opts.small) {
      bar.appendChild(h('span', 'win-url', hostOf(opts.url)));
      bar.appendChild(h('span', 'win-spacer'));
    }
    w.appendChild(bar);
    w.appendChild(shotBox());
    return w;
  }

  /* 图格：窗框 + 图注 */
  function cellEl(im, prodUrl, alt, small) {
    var c = h('div', 'cell');
    c.style.setProperty('--r', im.ratio);
    c.appendChild(winEl(im.src, im.ratio, { frame: im.frame, url: prodUrl, small: small !== false, alt: alt }));
    var cap = t(im, 'caption');
    if (cap) c.appendChild(h('div', 'cell-cap', cap));
    return c;
  }

  /* 头部：kicker（PROJECT 0n · 类别 · 年份）+ Monterey 标题 + ↗ + keywords */
  function mappedHead(p, prod, idx) {
    var host = document.getElementById('project-header');
    host.textContent = '';
    host.appendChild(h('div', 'pd-kicker',
      'PROJECT ' + pad2(idx + 1) + ' · ' + (p.category || '').toUpperCase() + ' · ' + (p.year || '')));
    var row = h('div', 'pd-title-row');
    var h1 = h('h1', 'detail-title');
    if (p.url) {
      var a = h('a');
      a.href = p.url; a.target = '_blank'; a.rel = 'noopener';
      a.setAttribute('aria-label', (prod.display || p.id) + ' — live');
      a.appendChild(document.createTextNode(prod.display || p.id));
      a.appendChild(psq());
      a.appendChild(extArrow('pd-ext'));
      h1.appendChild(a);
    } else {
      h1.appendChild(document.createTextNode(prod.display || p.id));
      h1.appendChild(psq());
    }
    row.appendChild(h1);
    host.appendChild(row);
    var kw = t(p, 'keywords');
    if (kw) host.appendChild(h('p', 'detail-keywords', kw.split(/\s*\|\s*/).join(' · ')));
    document.title = t(p, 'title') + ' · Alnt_med';
  }

  /* 封面块：tldr 双栏（列表｜封面方图+奖项）→ 指标带 → 落地页说明头 + 大图 */
  function mappedCover(p, prod) {
    var block = h('section', 'pd-block pd-cover');

    var cols = h('div', 'pd-cover-cols');
    /* 标题独占左列首行（grid head）；列表与右图同处第二行 → 右图顶部对齐首行短横线 */
    cols.appendChild(secH(p.sections.tldr));
    var lc = h('section', 'pd-cc-left detail-section');
    lc.setAttribute('data-skey', 'tldr');
    lc.appendChild(plist(t(p.sections.tldr, 'body')));
    cols.appendChild(lc);

    var art = h('figure', 'pd-cover-art');
    var th = h('div', 'ca-thumb');
    var im = h('img');
    im.src = p.thumb; im.alt = t(p, 'title'); im.loading = 'lazy'; im.decoding = 'async';
    zoomable(im, p.thumb, t(p, 'title'));
    th.appendChild(im);
    art.appendChild(th);
    var award = t(p, 'award');
    if (award) {
      var ac = h('figcaption', 'pd-award');
      ac.appendChild(psq());
      ac.appendChild(document.createTextNode(' ' + award));
      art.appendChild(ac);
    }
    cols.appendChild(art);
    block.appendChild(cols);

    if (prod.metrics) {
      var mb = h('div', 'pd-metrics');
      prod.metrics.forEach(function (m) {
        var c = h('div');
        c.appendChild(h('div', 'm-val', m.value));
        c.appendChild(h('div', 'm-label', t(m, 'label')));
        mb.appendChild(c);
      });
      block.appendChild(mb);
    }

    if (prod.cover) {
      var shot = h('div', 'pd-cover-shot');
      /* 小标签行（「落地页 · THE LANDING PAGE」）2026-07-11 用户裁定统一去掉——
         label 字段缺省即不渲染，说明头只剩 lede 英文大标 + 中文小注 */
      if (prod.cover.label_en || prod.cover.lede_en) {
        var head = h('div', 'pd-shot-head');
        if (prod.cover.label_en || prod.cover.label_zh) {
          var label = h('div', 'pd-shot-label');
          label.appendChild(psq());
          if (prod.cover.label_zh) label.appendChild(h('span', 'zh-note', prod.cover.label_zh));
          label.appendChild(h('span', 'sl-en', prod.cover.label_en || ''));
          head.appendChild(label);
        }
        if (prod.cover.lede_en) {
          var lede = h('p', 'pd-shot-lede');
          lede.appendChild(document.createTextNode(prod.cover.lede_en));
          if (prod.cover.lede_zh) lede.appendChild(h('span', 'zh-note shot-lede-zh', prod.cover.lede_zh));
          head.appendChild(lede);
        }
        shot.appendChild(head);
      }
      shot.appendChild(winEl(prod.cover.shot, prod.cover.ratio,
        { frame: prod.cover.frame, url: p.url, small: false, alt: prod.display }));
      var cap = t(prod.cover, 'caption');
      if (cap) shot.appendChild(h('div', 'cell-cap', cap));
      block.appendChild(shot);
    }
    return block;
  }

  /* 线稿块定式：核心语句大标题 + 中文小注 + 斜体 one_liner ｜ 线稿图 */
  function mappedLineart(p, prod, idx) {
    var block = h('section', 'pd-block pd-lineart');
    block.appendChild(h('div', 'pd-kicker',
      'PROJECT ' + pad2(idx + 1) + ' · ' + (prod.display || '').toUpperCase() + ' · SYSTEM LINEART'));
    var grid = h('div', 'pd-la-grid');
    var side = h('div', 'pd-la-side');
    var motto = h('h2', 'la-motto');
    motto.appendChild(document.createTextNode(prod.lineart.motto || (prod.display || p.id)));
    motto.appendChild(psq());
    if (prod.lineart.motto_zh) motto.appendChild(h('span', 'zh-note', prod.lineart.motto_zh));
    side.appendChild(motto);
    var one = t(p, 'one_liner');
    if (one) side.appendChild(h('p', 'detail-oneliner', one));
    grid.appendChild(side);
    var fig = h('figure', 'pd-la-fig');
    var im = h('img');
    im.src = prod.lineart.src; im.alt = (prod.display || p.id) + ' — system lineart';
    im.loading = 'lazy'; im.decoding = 'async';
    zoomable(im, prod.lineart.src, im.alt);
    fig.appendChild(im);
    grid.appendChild(fig);
    block.appendChild(grid);
    return block;
  }

  /* 场景块：kicker（SCENE 0n · 场景名）+ 章节 h2 + 横向行模块 */
  function mappedScene(p, prod, sc, sceneNo) {
    var block = h('section', 'pd-block pd-scene');
    var kick = h('div', 'pd-kicker');
    kick.appendChild(document.createTextNode('SCENE ' + pad2(sceneNo) + ' · ' + (sc.name_en || sc.id)));
    if (sc.name_zh) kick.appendChild(h('span', 'zh-note', '　' + sc.name_zh));
    block.appendChild(kick);

    /* copy_ref 可省（2026-07-11）：纯图场景（如 UABB 成品页）不渲染章节头，
       也不自动补正文行——与作品集页同构 */
    var section = sc.copy_ref ? p.sections[sc.copy_ref] : null;
    var body = h('section', 'pd-scene-body detail-section');
    if (sc.copy_ref) body.setAttribute('data-skey', sc.copy_ref);
    if (section) body.appendChild(secH(section));

    var alt = (prod.display || p.id) + ' — ' + (sc.name_en || sc.id);
    var imgs = sc.images || [];
    var rows = sc.rows || [{ text: true }, { imgs: imgs.map(function (_, i) { return i; }) }];
    if (!rows.some(function (r) { return r.text; }) && section) rows = [{ text: true }].concat(rows);

    rows.forEach(function (r) {
      if (r.text && !section) { console.warn('[detail] text 行需要 copy_ref:', sc.id); return; }
      if (r.text && r.img != null) {
        /* 一文一图：文左 + 定宽小图右。img_mm 按作品集主区 167mm 折算成百分比 */
        var ti = h('div', 'row-ti');
        var txt = h('div', 'row-ti-text');
        txt.appendChild(plist(t(section, 'body')));
        ti.appendChild(txt);
        var c = cellEl(imgs[r.img], p.url, alt);
        if (r.img_mm) c.style.setProperty('--w', (r.img_mm / 167 * 100).toFixed(1) + '%');
        ti.appendChild(c);
        body.appendChild(ti);
      } else if (r.text) {
        var rt = h('div', 'row-text');
        rt.appendChild(plist(t(section, 'body')));
        body.appendChild(rt);
      } else if (r.sec) {
        /* 独立文字节模块：引用另一节文案，自带节标题，间隔拉大 */
        var sec2 = p.sections[r.sec];
        if (!sec2) { console.warn('[detail] rows.sec 未命中:', sc.id, r.sec); return; }
        var rs = h('section', 'row-text row-sec detail-section');
        rs.setAttribute('data-skey', r.sec);
        rs.appendChild(secH(sec2));
        rs.appendChild(plist(t(sec2, 'body')));
        body.appendChild(rs);
      } else if (r.imgs && r.imgs.length) {
        var row = h('div', 'scene-row');
        /* w_mm 定宽行：按作品集主区 167mm 折算成百分比（img_mm 同一先例） */
        if (r.w_mm) { row.classList.add('scene-row--capped'); row.style.setProperty('--rw', (r.w_mm / 167 * 100).toFixed(1) + '%'); }
        r.imgs.forEach(function (i) {
          var im = imgs[i];
          if (!im) { console.warn('[detail] rows 引用越界:', sc.id, i); return; }
          row.appendChild(cellEl(im, p.url, alt, r.imgs.length > 1));
        });
        body.appendChild(row);
      }
    });
    block.appendChild(body);
    return block;
  }

  /* 影片块（线稿标题版式）：motto｜海报——点击就地播放（video-local 换
     <video>，iframe-lazy 换 <iframe>），与顶部门面是同一入口的第二次出现 */
  function mappedFilm(p, prod) {
    var video = prod.video;
    var block = h('section', 'pd-block pd-film');
    var grid = h('div', 'pd-film-grid');

    var side = h('div', 'pd-film-side');
    var motto = h('h2', 'la-motto');
    motto.appendChild(document.createTextNode(video.motto || t(video, 'label')));
    motto.appendChild(psq());
    if (video.motto_zh) motto.appendChild(h('span', 'zh-note', video.motto_zh));
    side.appendChild(motto);
    var cta = h('p', 'pd-film-cta');
    if (video.label_zh) cta.appendChild(h('span', 'zh-note', video.label_zh + ' ·'));
    cta.appendChild(h('span', 'cta-link', (video.label_en || '').toUpperCase()));
    side.appendChild(cta);
    grid.appendChild(side);

    var poster = h('div', 'pd-film-poster');
    poster.style.setProperty('--r', video.poster_ratio || 1.7778);
    var pi = h('img', 'pd-film-cover');
    pi.src = video.poster; pi.alt = t(video, 'label'); pi.loading = 'lazy'; pi.decoding = 'async';
    poster.appendChild(pi);
    poster.appendChild(h('span', 'pd-film-btn'));

    var playable = (p.media || []).filter(function (m) {
      return m.type === 'video-local' || m.type === 'iframe-lazy';
    })[0];
    poster.addEventListener('click', function play() {
      if (!playable) return;
      poster.removeEventListener('click', play);
      poster.classList.add('playing');
      poster.textContent = '';
      if (playable.type === 'video-local') {
        var v = document.createElement('video');
        v.src = playable.src; v.controls = true; v.playsInline = true; v.preload = 'auto';
        if (playable.poster) v.poster = playable.poster;
        poster.appendChild(v);
        v.play().catch(function () { /* 需手势的环境交给 controls */ });
      } else {
        var f = document.createElement('iframe');
        f.src = playable.src; f.loading = 'lazy'; f.allow = 'fullscreen';
        f.title = playable.label_zh || 'demo';
        poster.appendChild(f);
      }
    });
    grid.appendChild(poster);
    block.appendChild(grid);
    return block;
  }

  /* 浮出动效（照首页/建筑阅读器：只动 opacity/transform，IO 逐块入场；
     重渲染直接终态） */
  var pdBooted = false;
  function pdReveal(blocks) {
    if (pdBooted || !('IntersectionObserver' in window)) {
      blocks.forEach(function (b) { b.classList.add('pd-reveal', 'in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -4% 0px' });
    blocks.forEach(function (b) { b.classList.add('pd-reveal'); io.observe(b); });
  }

  function renderMapped(p, prod, pf) {
    document.body.classList.add('pd-mapped');
    var idx = pf.products.indexOf(prod);
    mappedHead(p, prod, idx);

    /* 顶部媒体：只保留视频/交互影片门面（Pears/Co-work 视频在开头；
       作品集没放的媒体——如 Meco 的看板截图——一律不放） */
    var mediaHost = document.getElementById('media-container');
    mediaHost.textContent = '';
    (p.media || []).forEach(function (m) {
      if (m.type === 'video-local') mediaHost.appendChild(mediaVideoLocal(m));
      else if (m.type === 'iframe-lazy') mediaHost.appendChild(mediaIframeLazy(m));
    });

    var host = document.getElementById('content-column');
    host.textContent = '';
    document.getElementById('content-images').textContent = '';

    host.appendChild(mappedCover(p, prod));
    var scenes = prod.scenes || [];
    if (prod.lineart) host.appendChild(mappedLineart(p, prod, idx));
    scenes.forEach(function (sc, si) {
      host.appendChild(mappedScene(p, prod, sc, si + 1));
    });
    if (prod.video) host.appendChild(mappedFilm(p, prod));
    var stack = t(p, 'tech_stack');
    if (stack) {
      var line = h('p', 'pd-block pd-stack stack-line');
      line.appendChild(h('span', 'stack-label', 'STACK'));
      line.appendChild(document.createTextNode(stack));
      host.appendChild(line);
    }

    var blocks = [document.getElementById('project-header')]
      .concat(Array.prototype.slice.call(mediaHost.children))
      .concat(Array.prototype.slice.call(host.children));
    pdReveal(blocks);
    pdBooted = true;

    document.dispatchEvent(new CustomEvent('detailrendered', { detail: { project: p } }));
  }

  function renderNotFound(id) {
    var host = document.getElementById('project-header');
    host.innerHTML = '<div class="detail-notfound">' +
      '<p>没有找到这个作品（id: ' + esc(id) + '）。</p>' +
      '<p><a href="around.html">回到全部作品 →</a></p></div>';
  }

  function render(p) {
    renderHeader(p);
    renderMedia(p);
    renderContent(p);
    renderImages(p);
    /* 编辑者模式（js/editor.js）监听此事件重挂可编辑区 */
    document.dispatchEvent(new CustomEvent('detailrendered', { detail: { project: p } }));
  }

  function boot() {
    /* Back 按钮：有站内来路则 history.back，保滚动位置 */
    var back = document.getElementById('back-button');
    if (back && document.referrer && document.referrer.indexOf(location.host) !== -1) {
      back.addEventListener('click', function (e) { e.preventDefault(); history.back(); });
    }

    var id = getId();
    Promise.all([
      window.Site.loadProjects(),
      /* 作品集配置：映射模式的场景/指标/线稿来源；拿不到则回落经典模式 */
      fetch('config/portfolio.json').then(function (r) { return r.json(); }).catch(function () { return null; })
    ]).then(function (res) {
      var data = res[0], pf = res[1];
      var p = (data.projects || []).find(function (x) { return x.id === id; });
      if (!p) { renderNotFound(id); return; }
      /* 编辑者模式的本机草稿：有则整体覆盖该项目（仅本浏览器可见） */
      try {
        var ov = JSON.parse(localStorage.getItem('siteEditorOverlay') || '{}');
        if (ov[id]) {
          var i = data.projects.indexOf(p);
          p = ov[id];
          data.projects[i] = p;
        }
      } catch (e) { /* 草稿损坏则忽略 */ }
      var prod = pf && (pf.products || []).find(function (x) { return x.ref === id && x.mapped; });
      var paint = prod
        ? function () { renderMapped(p, prod, pf); }
        : function () { render(p); };
      window.__detail = { project: p, data: data, render: paint };
      paint();
      document.addEventListener('localechange', paint);
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
