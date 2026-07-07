/* ════════════════════════════════════════════════════════════
   portfolio.js — AI 产品作品集渲染器。
   同步规则：产品文案一律 join ../config/projects.json（单一事实源），
   ../config/portfolio.json 只提供页序/场景/截图清单/个人页/建筑矩阵。
   打印：无头 Chrome 带 ?lang=zh|en 打两版（head 内联已预设 data-locale）。
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var MM = 96 / 25.4; /* px per mm @96dpi */
  var deck = document.getElementById('deck');
  var pf = null, byId = null;

  /* ── 工具 ── */
  function t(obj, base) { return window.I18N ? I18N.t(obj, base) : (obj && obj[base + '_zh']) || ''; }
  function locale() { return window.I18N ? I18N.locale : 'zh'; }
  function L(zh, en) { return locale() === 'zh' ? zh : en; }

  function h(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function frag() {
    var f = document.createDocumentFragment();
    for (var i = 0; i < arguments.length; i++) if (arguments[i]) f.appendChild(arguments[i]);
    return f;
  }
  function psq() { return h('span', 'psq'); }
  function img(src, alt) {
    var im = h('img');
    im.src = '../' + src; im.alt = alt || '';
    im.loading = 'eager'; im.decoding = 'sync';
    return im;
  }
  function ext(url) { return /^https?:/.test(url || ''); }
  function host(url) { try { return new URL(url).hostname; } catch (e) { return ''; } }

  /* body 按 \n 拆「—」列表；行首「标签：」（≤10 字）加粗，
     否则加粗首个逗号前的短语（先说结论四条的 STAR 头） */
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
        /* 半角冒号/逗号后补空格（拉丁排版）；全角标点自带间距 */
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
    var el = h('h2', 'sec-h');
    el.appendChild(document.createTextNode(section.title_en || section.title_zh || ''));
    if (section.title_zh) el.appendChild(h('span', 'zh-note', section.title_zh));
    return el;
  }

  /* Mac 窗框（三灯灰阶明度跳——设计决定，勿改回红黄绿） */
  function win(src, ratio, opts) {
    opts = opts || {};
    var w = h('div', 'win' + (opts.small ? ' win-sm' : ''));
    if (opts.frame !== 'none') {
      var bar = h('div', 'win-bar');
      bar.appendChild(h('span', 'win-dot'));
      bar.appendChild(h('span', 'win-dot'));
      bar.appendChild(h('span', 'win-dot'));
      if (opts.frame === 'browser' && opts.url && !opts.small) {
        bar.appendChild(h('span', 'win-url', host(opts.url)));
        bar.appendChild(h('span', 'win-spacer'));
      }
      w.appendChild(bar);
    } else {
      w.className = 'shot-plain' + (opts.small ? ' win-sm' : '');
      w.style.setProperty('--r', ratio);
      w.appendChild(img(src, opts.alt));
      return w;
    }
    var shot = h('div', 'win-shot');
    shot.style.setProperty('--r', ratio);
    shot.appendChild(img(src, opts.alt));
    w.appendChild(shot);
    return w;
  }

  /* 场景组块：≥3 图 = 首图通栏 hero + 其余等高行；≤2 图 = 单等高行 */
  function scene(sc, prodUrl, prodTitle) {
    var wrap = h('section', 'scene' + (sc.density === 'compact' ? ' compact' : ''));
    var label = h('div', 'scene-label');
    label.appendChild(psq());
    if (sc.name_zh) label.appendChild(h('span', 'sl-zh zh-note', sc.name_zh));
    label.appendChild(h('span', 'sl-en', sc.name_en || ''));
    wrap.appendChild(label);

    function cell(im, small) {
      var c = h('div', 'cell');
      c.style.setProperty('--r', im.ratio);
      c.appendChild(win(im.src, im.ratio, { frame: im.frame, url: prodUrl, small: small, alt: prodTitle + ' — ' + (sc.name_en || sc.id) }));
      var cap = t(im, 'caption');
      if (cap) c.appendChild(h('div', 'cell-cap', cap));
      return c;
    }

    var imgs = sc.images || [];
    var rowImgs = imgs;
    if (imgs.length >= 3) {
      var hero = h('div', 'scene-hero');
      hero.appendChild(win(imgs[0].src, imgs[0].ratio, { frame: imgs[0].frame, url: prodUrl, alt: prodTitle + ' — ' + (sc.name_en || sc.id) }));
      var hcap = t(imgs[0], 'caption');
      if (hcap) hero.appendChild(h('div', 'cell-cap', hcap));
      wrap.appendChild(hero);
      rowImgs = imgs.slice(1);
    }
    if (rowImgs.length) {
      var row = h('div', 'scene-row');
      rowImgs.forEach(function (im) { row.appendChild(cell(im, true)); });
      wrap.appendChild(row);
    }
    return wrap;
  }

  /* 视频门面：poster + 播放钮 + 外链（web/PDF 同 DOM，链接即注记） */
  function film(video) {
    var a = h('a', 'film');
    a.href = video.url; a.target = '_blank'; a.rel = 'noopener';
    var poster = h('span', 'film-poster');
    poster.style.setProperty('--r', video.poster_ratio || 1.7778);
    poster.appendChild(img(video.poster, t(video, 'label')));
    poster.appendChild(h('span', 'film-btn'));
    a.appendChild(poster);
    var cta = h('span', 'film-cta');
    if (video.label_zh) cta.appendChild(h('span', 'zh-note', video.label_zh + ' ·'));
    cta.appendChild(h('span', 'cta-link', (video.label_en || '').toUpperCase() + ' ↗'));
    a.appendChild(cta);
    return a;
  }

  function qrBlock(qr, big) {
    var a = h('a', 'qr');
    a.href = qr.url; a.target = '_blank'; a.rel = 'noopener';
    var box = h('span', 'qr-img');
    box.appendChild(img(qr.svg, 'QR — ' + qr.url));
    a.appendChild(box);
    var txt = h('span', 'qr-txt');
    txt.appendChild(h('span', 'qr-link', host(qr.url)));
    txt.appendChild(h('span', 'qr-cap', t(qr, 'caption') + ' ↗'));
    a.appendChild(txt);
    return a;
  }

  /* 左侧项目索引 rail */
  function rail(activeRef) {
    var nav = h('nav', 'rail');
    nav.appendChild(h('div', 'rail-cap', 'Project'));
    var ol = h('ol');
    pf.products.forEach(function (prod, i) {
      var li = h('li', prod.ref === activeRef ? 'active' : '');
      li.appendChild(document.createTextNode(String(i + 1).padStart(2, '0')));
      li.appendChild(h('span', 'rail-name', prod.display || prod.ref));
      if (prod.ref === activeRef) li.appendChild(psq());
      ol.appendChild(li);
    });
    nav.appendChild(ol);
    return nav;
  }

  function foot(num) {
    var f = h('footer', 'sheet-foot');
    f.appendChild(h('span', 'f-runner', 'LI WENYUAN — AI PRODUCT PORTFOLIO'));
    var n = h('span', 'f-num', String(num).padStart(2, '0'));
    n.appendChild(psq());
    f.appendChild(n);
    return f;
  }

  function sheet(cls, id) {
    var holder = h('div', 'sheet-holder');
    var s = h('section', 'sheet ' + cls);
    if (id) s.id = id;
    holder.appendChild(s);
    return { holder: holder, sheet: s };
  }

  /* ════════ P1 封面 ════════ */
  function sheetCover() {
    var s = sheet('p-cover', 'p1');
    var top = h('div', 'cover-top');
    top.appendChild(h('span', null, 'LI WENYUAN · ALNT MED'));
    top.appendChild(h('span', null, pf.meta.edition));
    s.sheet.appendChild(top);

    var core = h('div', 'cover-core');
    core.appendChild(h('div', 'kicker cover-kicker', 'AI PRODUCT'));
    var title = h('h1', 'cover-title');
    title.appendChild(document.createTextNode('PORTFOLIO'));
    title.appendChild(psq());
    core.appendChild(title);
    core.appendChild(h('div', 'cover-name', L('李文苑 · ' + t(pf.profile, 'role'), t(pf.profile, 'role'))));
    s.sheet.appendChild(core);

    var band = h('div', 'cover-band');
    var mount = h('span');
    band.appendChild(mount);
    s.sheet.appendChild(band);
    if (window.Barmorph) {
      Barmorph.mountBrandBand(mount).classList.add('brandband--cover');
    }

    var site = h('div', 'cover-site');
    var a = h('a', null, host(pf.meta.site_url).toUpperCase());
    a.href = pf.meta.site_url; a.target = '_blank'; a.rel = 'noopener';
    site.appendChild(a);
    s.sheet.appendChild(site);
    return s.holder;
  }

  /* ════════ P2 个人信息页 ════════ */
  function sheetProfile(num) {
    var p = pf.profile;
    var s = sheet('p-profile', 'p2');
    var grid = h('div', 'profile-grid');

    var left = h('div', 'profile-left');
    var fig = h('figure', 'portrait');
    fig.appendChild(img(p.portrait, p.display_name));
    left.appendChild(fig);
    var hello = h('h1', 'hello');
    hello.appendChild(document.createTextNode(p.hello));
    hello.appendChild(psq());
    left.appendChild(hello);
    left.appendChild(h('p', 'role', t(p, 'role')));
    left.appendChild(h('p', 'intro', t(p, 'intro')));
    var ul = h('ul', 'contacts');
    p.contacts.forEach(function (c) {
      var li = h('li');
      li.appendChild(h('span', 'c-label', c.label));
      var a = h('a', null, c.text);
      a.href = c.url; if (ext(c.url)) { a.target = '_blank'; a.rel = 'noopener'; }
      li.appendChild(a);
      ul.appendChild(li);
    });
    left.appendChild(ul);
    var qr = h('div', 'profile-qr');
    qr.appendChild(qrBlock(p.qr));
    left.appendChild(qr);
    grid.appendChild(left);

    var cv = h('div', 'cv');
    function cvSec(en, zh, listEl) {
      var sec = h('section', 'cv-sec');
      sec.appendChild(secH({ title_en: en, title_zh: zh }));
      sec.appendChild(listEl);
      return sec;
    }
    function cvList(items) {
      var ol = h('ul', 'cv-list');
      items.forEach(function (it) {
        var li = h('li');
        if (it.period) li.appendChild(h('span', 'cv-period', it.period));
        li.appendChild(h('span', 'cv-text', t(it, 'text')));
        if (it.note) li.appendChild(h('span', 'cv-note', it.note));
        ol.appendChild(li);
      });
      return ol;
    }
    cv.appendChild(cvSec('EDUCATION', '教育背景', cvList(p.education)));
    cv.appendChild(cvSec('EXPERIENCE', '实习与经历', cvList(p.experience)));
    cv.appendChild(cvSec('AWARDS', '奖项', cvList(p.awards)));
    var skills = h('div');
    p.skills.forEach(function (sk) {
      var row = h('div', 'skill-group');
      row.appendChild(h('span', 'skill-name', locale() === 'zh' ? sk.group_zh : sk.group_en));
      row.appendChild(h('span', 'skill-items', t(sk, 'items')));
      skills.appendChild(row);
    });
    cv.appendChild(cvSec('SKILLS', '技能', skills));
    grid.appendChild(cv);

    s.sheet.appendChild(grid);
    s.sheet.appendChild(foot(num));
    return s.holder;
  }

  /* ════════ P3 目录 ════════ */
  function sheetIndex(num) {
    var s = sheet('p-index', 'p3');
    var inner = h('div', 'index-inner');
    var title = h('h1', 'index-title');
    title.appendChild(document.createTextNode('INDEX'));
    title.appendChild(psq());
    inner.appendChild(title);
    inner.appendChild(h('p', 'index-sub', L('AI 产品 · 五个作品', 'FIVE AI PRODUCT WORKS')));

    var grid = h('div', 'matrix');
    pf.products.forEach(function (prod, i) {
      var joined = byId.get(prod.ref);
      var card = h('a', 'matrix-card');
      card.href = '#work-' + prod.ref;
      var top = h('div', 'mc-top');
      top.appendChild(h('span', 'mc-name', prod.display || prod.ref));
      top.appendChild(h('span', 'mc-num', String(i + 1).padStart(2, '0')));
      card.appendChild(top);
      card.appendChild(h('div', 'mc-meta', t(joined, 'category') + ' · ' + (joined.year || '')));
      var th = h('div', 'mc-thumb');
      th.appendChild(img(joined.thumb, t(joined, 'title')));
      card.appendChild(th);
      grid.appendChild(card);
    });
    inner.appendChild(grid);

    inner.appendChild(h('p', 'index-coda',
      L('尾声 · 建筑作品（六件）见卷末', 'CODA · SIX WORKS OF ARCHITECTURE AT THE END OF THE VOLUME')));
    s.sheet.appendChild(inner);
    s.sheet.appendChild(foot(num));
    return s.holder;
  }

  /* ════════ 作品页公共头（kicker + 标题 + 关键词） ════════ */
  function workHead(prod, joined, idx) {
    var head = h('div', 'work-head');
    head.appendChild(h('div', 'kicker',
      'PROJECT ' + String(idx + 1).padStart(2, '0') + ' · ' + (joined.category || '').toUpperCase() + ' · ' + (joined.year || '')));
    var row = h('div', 'work-title-row');
    var title = h('h1', 'work-title');
    title.appendChild(document.createTextNode(prod.display || prod.ref));
    title.appendChild(psq());
    row.appendChild(title);
    if (ext(joined.url)) {
      var a = h('a', 'work-ext', '↗');
      a.href = joined.url; a.target = '_blank'; a.rel = 'noopener';
      a.setAttribute('aria-label', prod.display + ' — live');
      row.appendChild(a);
    }
    head.appendChild(row);
    var kw = t(joined, 'keywords');
    if (kw) head.appendChild(h('p', 'work-kw', kw.split(/\s*\|\s*/).join(' · ')));
    return head;
  }

  /* ════════ 作品封面页（Co-work 做透版） ════════ */
  function sheetWorkCover(prod, joined, idx, num) {
    var s = sheet('p-work', 'work-' + prod.ref);
    s.sheet.appendChild(rail(prod.ref));
    var main = h('div', 'work-main');
    main.appendChild(workHead(prod, joined, idx));

    var one = t(joined, 'one_liner');
    if (one) main.appendChild(h('p', 'oneliner work-oneliner', one));

    var sec = h('section', 'work-sec');
    sec.appendChild(secH(joined.sections.tldr));
    var body = h('div', 'sec-body');
    body.appendChild(plist(t(joined.sections.tldr, 'body')));
    sec.appendChild(body);
    main.appendChild(sec);

    if (prod.metrics) {
      var mb = h('div', 'metrics');
      prod.metrics.forEach(function (m) {
        var cell = h('div');
        cell.appendChild(h('div', 'm-val', m.value));
        cell.appendChild(h('div', 'm-label', t(m, 'label')));
        mb.appendChild(cell);
      });
      main.appendChild(mb);
    }

    if (prod.cover) {
      var shot = h('div', 'work-cover-shot');
      shot.appendChild(win(prod.cover.shot, prod.cover.ratio, { frame: prod.cover.frame, url: joined.url, alt: prod.display }));
      main.appendChild(shot);
    }

    s.sheet.appendChild(main);
    s.sheet.appendChild(foot(num));
    return s.holder;
  }

  /* ════════ 作品正文页（一页一场景；末场景页附影片+技术栈） ════════ */
  function sheetWorkScene(prod, joined, sc, idx, num, isLast) {
    var s = sheet('p-work');
    s.sheet.appendChild(rail(prod.ref));
    var main = h('div', 'work-main');

    var section = joined.sections[sc.copy_ref];
    var sec = h('section', 'work-sec');
    sec.appendChild(secH(section));
    var body = h('div', 'sec-body');
    body.appendChild(plist(t(section, 'body')));
    sec.appendChild(body);
    main.appendChild(sec);

    main.appendChild(scene(sc, joined.url, prod.display || prod.ref));

    if (isLast) {
      if (prod.video) main.appendChild(film(prod.video));
      var stack = t(joined, 'tech_stack');
      if (stack) {
        var line = h('p', 'stack-line');
        line.style.marginTop = '5mm';
        line.appendChild(h('span', 'stack-label', 'STACK'));
        line.appendChild(document.createTextNode(stack));
        main.appendChild(line);
      }
    }

    s.sheet.appendChild(main);
    s.sheet.appendChild(foot(num));
    return s.holder;
  }

  /* ════════ 占位作品页（简封面：标题 + 先说结论 + 站内封面图） ════════ */
  function sheetWorkPlaceholder(prod, joined, idx, num) {
    var s = sheet('p-work', 'work-' + prod.ref);
    s.sheet.appendChild(rail(prod.ref));
    var main = h('div', 'work-main');
    main.appendChild(workHead(prod, joined, idx));

    var fig = h('figure', 'ph-figure');
    var th = h('div', 'ph-thumb');
    th.appendChild(img(joined.thumb, t(joined, 'title')));
    fig.appendChild(th);
    var award = t(joined, 'award');
    if (award) {
      var ac = h('figcaption', 'work-award');
      ac.appendChild(psq());
      ac.appendChild(document.createTextNode(' ' + award));
      fig.appendChild(ac);
    }

    var one = t(joined, 'one_liner');
    if (one) main.appendChild(h('p', 'oneliner work-oneliner', one));

    var sec = h('section', 'work-sec');
    sec.appendChild(secH(joined.sections.tldr));
    var body = h('div', 'sec-body');
    body.appendChild(fig); /* 浮动图与列表同流 */
    body.appendChild(plist(t(joined.sections.tldr, 'body')));
    sec.appendChild(body);
    main.appendChild(sec);

    var more = h('p', 'ph-more');
    var a = h('a', null, L('完整案例在主站', 'FULL CASE ON THE SITE') + ' ↗');
    a.href = pf.meta.site_url + 'project.html?id=' + prod.ref;
    a.target = '_blank'; a.rel = 'noopener';
    more.appendChild(a);
    main.appendChild(more);

    s.sheet.appendChild(main);
    s.sheet.appendChild(foot(num));
    return s.holder;
  }

  /* ════════ 建筑压轴 ════════ */
  function sheetArch(num) {
    var arch = pf.architecture;
    var s = sheet('p-arch', 'p-arch');
    var inner = h('div', 'arch-inner');
    var title = h('h1', 'arch-title');
    title.appendChild(document.createTextNode(arch.title_en));
    title.appendChild(h('span', 'zh-note', arch.title_zh));
    inner.appendChild(title);
    inner.appendChild(h('p', 'arch-lede', t(arch, 'lede')));

    var grid = h('div', 'arch-grid');
    arch.items.forEach(function (id) {
      var p = byId.get(id);
      var item = h('a', 'arch-item');
      item.href = pf.meta.site_url + 'project.html?id=' + id;
      item.target = '_blank'; item.rel = 'noopener';
      var fig = h('figure');
      var shot = h('div', 'arch-shot');
      shot.appendChild(img(p.thumb, t(p, 'title')));
      fig.appendChild(shot);
      var cap = h('figcaption');
      cap.appendChild(h('span', null, t(p, 'title')));
      cap.appendChild(h('span', 'a-year', p.year || ''));
      fig.appendChild(cap);
      var award = t(p, 'award');
      if (award) fig.appendChild(h('div', 'a-award', award));
      item.appendChild(fig);
      grid.appendChild(item);
    });
    inner.appendChild(grid);

    var pdf = h('p', 'arch-pdf');
    var a = h('a', null, t(arch, 'pdf_label') + ' ↗');
    a.href = arch.pdf; a.target = '_blank'; a.rel = 'noopener';
    pdf.appendChild(a);
    inner.appendChild(pdf);

    s.sheet.appendChild(inner);
    s.sheet.appendChild(foot(num));
    return s.holder;
  }

  /* ════════ 封底 ════════ */
  function sheetBack() {
    var p = pf.profile;
    var s = sheet('p-back', 'p-back');
    var core = h('div', 'back-core');

    var band = h('div', 'back-band');
    var mount = h('span');
    band.appendChild(mount);
    core.appendChild(band);
    if (window.Barmorph) Barmorph.mountBrandBand(mount);

    core.appendChild(h('div', 'back-name', p.display_name));
    core.appendChild(h('div', 'back-role', t(p, 'role')));

    var ul = h('ul', 'back-contacts');
    p.contacts.forEach(function (c) {
      var li = h('li');
      var a = h('a', null, c.text);
      a.href = c.url; if (ext(c.url)) { a.target = '_blank'; a.rel = 'noopener'; }
      li.appendChild(a);
      ul.appendChild(li);
    });
    core.appendChild(ul);

    var qr = h('div', 'back-qr');
    var a = h('a');
    a.href = p.qr.url; a.target = '_blank'; a.rel = 'noopener';
    var box = h('span', 'qr-img');
    box.appendChild(img(p.qr.svg, 'QR — ' + p.qr.url));
    a.appendChild(box);
    qr.appendChild(a);
    qr.appendChild(h('div', 'qr-cap', t(p.qr, 'caption') + ' · ' + host(p.qr.url).toUpperCase()));
    core.appendChild(qr);
    s.sheet.appendChild(core);

    s.sheet.appendChild(h('div', 'back-edition', pf.meta.edition + ' — ' + t(pf.meta, 'doc_title')));
    return s.holder;
  }

  /* ════════ 组册 ════════ */
  var booted = false;
  function renderDoc() {
    deck.textContent = '';
    var sheets = [];
    sheets.push(sheetCover());
    sheets.push(sheetProfile(2));
    sheets.push(sheetIndex(3));

    var num = 4;
    pf.products.forEach(function (prod, idx) {
      var joined = byId.get(prod.ref);
      if (!joined) { console.warn('[portfolio] ref not found in projects.json:', prod.ref); return; }
      if (prod.placeholder) {
        sheets.push(sheetWorkPlaceholder(prod, joined, idx, num++));
      } else {
        sheets.push(sheetWorkCover(prod, joined, idx, num++));
        (prod.scenes || []).forEach(function (sc, si) {
          sheets.push(sheetWorkScene(prod, joined, sc, idx, num++, si === prod.scenes.length - 1));
        });
      }
    });

    sheets.push(sheetArch(num++));
    sheets.push(sheetBack());
    deck.appendChild(frag.apply(null, sheets));

    document.title = (locale() === 'zh' ? 'Portfolio · Alnt_med' : 'Portfolio · Alnt_med');
    var pdfLink = document.querySelector('.pf-pdf');
    if (pdfLink && pf.meta.pdf) pdfLink.href = '../' + (pf.meta.pdf[locale()] || pf.meta.pdf.zh);

    if (booted || matchMedia('print').matches) {
      sheets.forEach(function (holder) { holder.classList.add('in'); });
    } else {
      observeReveal(sheets);
    }
    booted = true;
    scheduleOverflowCheck();
  }

  /* ── 屏显入场（仅首次；打印/重渲染直接终态） ── */
  function observeReveal(sheets) {
    if (!('IntersectionObserver' in window)) {
      sheets.forEach(function (s) { s.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08 });
    sheets.forEach(function (s) { io.observe(s); });
  }

  /* ── 窄屏整页等比缩放（print 态 CSS 已 transform:none 覆盖） ── */
  function fit() {
    var scale = Math.min(1, (document.documentElement.clientWidth - 24) / (210 * MM));
    document.documentElement.style.setProperty('--sheet-scale', scale.toFixed(4));
  }

  /* ── 溢出探测：定版页铁律的告警器（文案改长立刻可见） ── */
  var overflowTimer = null;
  function scheduleOverflowCheck() {
    clearTimeout(overflowTimer);
    var run = function () {
      overflowTimer = setTimeout(function () {
        document.querySelectorAll('.sheet').forEach(function (s, i) {
          var over = s.scrollHeight > s.clientHeight + 1 || s.scrollWidth > s.clientWidth + 1;
          s.classList.toggle('overflow', over);
          if (over) console.warn('[portfolio] sheet ' + (i + 1) + ' overflows by ' + (s.scrollHeight - s.clientHeight) + 'px — 文案/图版超出定版页，导出 PDF 会被裁切');
        });
      }, 80);
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(run); else run();
  }

  /* ── 启动 ── */
  Promise.all([
    fetch('../config/projects.json').then(function (r) { return r.json(); }),
    fetch('../config/portfolio.json').then(function (r) { return r.json(); })
  ]).then(function (res) {
    byId = new Map(res[0].projects.map(function (p) { return [p.id, p]; }));
    pf = res[1];
    fit();
    renderDoc();
    if (window.I18N) I18N.apply();
  }).catch(function (err) {
    console.error('[portfolio] load failed', err);
    deck.appendChild(h('p', null, 'Failed to load portfolio data — serve over HTTP (file:// blocks fetch).'));
  });

  addEventListener('resize', fit, { passive: true });
  document.addEventListener('localechange', function () { if (pf) renderDoc(); });
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.lang-toggle');
    if (btn && window.I18N) I18N.toggle();
  });

  /* 图片全部就位后再补一次溢出探测（打印前的最后防线） */
  addEventListener('load', scheduleOverflowCheck);
})();
