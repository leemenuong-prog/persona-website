/* ════════════════════════════════════════════════════════════
   architecture.js — 建筑作品集阅读器（连续滚动图册）。
   照 AI 作品集（portfolio/）的设计语言，但为网页连续流重排：
   英雄封面 → 目录（六卡）→ 逐作品（页头 + 自述七段 + 跨页图版内嵌）→ 尾声。
   文案单一事实源 = config/projects.json（七段式）；建筑合集元信息
   （合集简介 / PDF / 排序）取 config/portfolio.json 的 architecture 块。
   站点 chrome（header/footer/lightbox/reveal）由 js/main.js 注入复用。
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var deck = document.getElementById('arch-deck');
  var byId = null, arch = null, meta = null;
  var booted = false;

  /* 自述段落顺序（与 project-detail.js / 文案规则一致） */
  var SECTION_ORDER = ['tldr', 'why_built', 'key_contributions', 'how_it_works', 'why_it_matters'];

  /* ── 工具 ── */
  function t(obj, base) { return window.I18N ? I18N.t(obj, base) : (obj && obj[base + '_zh']) || ''; }
  function locale() { return window.I18N ? I18N.locale : 'zh'; }
  function L(zh, en) { return locale() === 'zh' ? zh : en; }
  function pad2(n) { return String(n).padStart(2, '0'); }
  function host(url) { try { return new URL(url).hostname; } catch (e) { return ''; } }

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

  /* body 按 \n 拆「—」列表；行首「标签：」（≤10 字）加粗，
     否则加粗首个逗号前的短语（先说结论四条的 STAR 头）——与 portfolio.js 同口径 */
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

  /* 章节 h3：英文大标 + 中文小注（EN 版 CSS 隐藏 .zh-note）——照 portfolio.js secH */
  function secH(section) {
    var el = h('h3', 'sec-h');
    el.appendChild(document.createTextNode(section.title_en || section.title_zh || ''));
    if (section.title_zh) el.appendChild(h('span', 'zh-note', section.title_zh));
    return el;
  }

  /* 跨页图版：全宽横构图 + 图注 + 点击 lightbox（复用 main.js 的 Site.openLightbox） */
  function plate(src, alt, cap, lead) {
    var fig = h('figure', 'arch-plate' + (lead ? ' arch-plate--lead' : ''));
    var im = h('img');
    im.src = src; im.alt = alt || '';
    im.loading = 'lazy'; im.decoding = 'async';
    im.addEventListener('click', function () {
      if (window.Site && Site.openLightbox) Site.openLightbox(src, alt);
    });
    fig.appendChild(im);
    if (cap) fig.appendChild(h('figcaption', null, cap));
    return fig;
  }

  function yearRange() {
    var years = arch.items.map(function (id) {
      var p = byId.get(id);
      return p ? parseInt(p.year, 10) : NaN;
    }).filter(function (n) { return !isNaN(n); });
    if (!years.length) return '';
    var lo = Math.min.apply(null, years), hi = Math.max.apply(null, years);
    return lo === hi ? '' + lo : lo + '–' + hi;
  }

  /* ════════ 英雄封面（回响 AI 作品集封面：kicker + 大标题 + 名 + 品牌带） ════════ */
  function heroSection() {
    var sec = h('section', 'arch-hero');

    sec.appendChild(h('div', 'kicker ah-kicker', L('建筑作品 · ARCHITECTURE', 'ARCHITECTURE')));
    var title = h('h1', 'ah-title');
    title.appendChild(document.createTextNode('PORTFOLIO'));
    title.appendChild(psq());
    sec.appendChild(title);
    sec.appendChild(h('p', 'ah-name', L('李文苑 · 建筑设计', 'LI WENYUAN · ARCHITECTURE')));

    var range = yearRange();
    sec.appendChild(h('p', 'ah-meta',
      L('六个作品', 'SIX WORKS') + (range ? ' · ' + range : '')));

    var lede = t(arch, 'lede');
    if (lede) sec.appendChild(h('p', 'ah-lede', lede));

    /* .IAM. 品牌带（封面居中一道，与 AI 作品集封面同编舞） */
    var band = h('div', 'ah-band');
    var mount = h('span');
    band.appendChild(mount);
    sec.appendChild(band);
    if (window.Barmorph) Barmorph.mountBrandBand(mount).classList.add('brandband--hero');

    var actions = h('div', 'ah-actions');
    var go = h('a', 'ah-go');
    go.href = '#arch-index';
    go.textContent = L('浏览六个作品', 'Browse the six works') + ' ↓';
    actions.appendChild(go);
    var alt = h('a', 'ah-alt');
    alt.href = 'portfolio/';
    alt.textContent = L('AI 产品作品集', 'AI product portfolio') + ' →';
    actions.appendChild(alt);
    sec.appendChild(actions);

    return sec;
  }

  /* ════════ 目录（六卡矩阵，锚点跳到各作品） ════════ */
  function indexSection() {
    var sec = h('section', 'arch-index');
    sec.id = 'arch-index';
    var head = h('div', 'ai-head');
    var title = h('h2', 'ai-title');
    title.appendChild(document.createTextNode('INDEX'));
    title.appendChild(psq());
    head.appendChild(title);
    var range = yearRange();
    head.appendChild(h('p', 'ai-sub',
      L('六个建筑作品', 'SIX WORKS OF ARCHITECTURE') + (range ? ' · ' + range : '')));
    sec.appendChild(head);

    var grid = h('div', 'ai-grid');
    arch.items.forEach(function (id, i) {
      var p = byId.get(id);
      if (!p) return;
      var card = h('a', 'ai-card');
      card.href = '#work-' + id;
      var top = h('div', 'aic-top');
      top.appendChild(h('span', 'aic-name', t(p, 'title')));
      top.appendChild(h('span', 'aic-num', pad2(i + 1)));
      card.appendChild(top);
      card.appendChild(h('div', 'aic-meta',
        t(p, 'category') + (p.year ? ' · ' + p.year : '')));
      var th = h('div', 'aic-thumb');
      var im = h('img');
      im.src = p.thumb; im.alt = t(p, 'title');
      im.loading = 'lazy'; im.decoding = 'async';
      th.appendChild(im);
      card.appendChild(th);
      grid.appendChild(card);
    });
    sec.appendChild(grid);
    return sec;
  }

  /* ════════ 逐作品页（页头 + 自述七段，跨页图版内嵌其间） ════════ */
  function workSection(id, idx) {
    var p = byId.get(id);
    if (!p) { console.warn('[architecture] id 不在 projects.json:', id); return null; }
    var sec = h('section', 'arch-work');
    sec.id = 'work-' + id;

    /* 页头 */
    var head = h('div', 'aw-head');
    head.appendChild(h('div', 'kicker',
      'PROJECT ' + pad2(idx + 1) + ' · ARCHITECTURE' + (p.year ? ' · ' + p.year : '')));
    var row = h('div', 'aw-title-row');
    var title = h('h2', 'aw-title');
    title.appendChild(document.createTextNode(t(p, 'title')));
    title.appendChild(psq());
    row.appendChild(title);
    var ext = h('a', 'aw-ext', '↗');
    ext.href = 'project.html?id=' + id;
    ext.setAttribute('aria-label', t(p, 'title') + ' — ' + L('完整案例', 'full case'));
    row.appendChild(ext);
    head.appendChild(row);

    var kw = t(p, 'keywords');
    if (kw) head.appendChild(h('p', 'aw-kw', kw.split(/\s*\|\s*/).join('　·　')));

    var metaBits = [];
    if (p.location) metaBits.push(p.location);
    var role = t(p, 'role');
    if (role) metaBits.push(role);
    if (metaBits.length) head.appendChild(h('p', 'aw-meta', metaBits.join(L('　·　', ' · '))));
    sec.appendChild(head);

    var award = t(p, 'award');
    if (award) {
      var ab = h('p', 'aw-award');
      ab.appendChild(psq());
      ab.appendChild(document.createTextNode(' ' + award));
      sec.appendChild(ab);
    }

    var one = t(p, 'one_liner');
    if (one) sec.appendChild(h('p', 'oneliner aw-oneliner', one));

    /* 图版 + 自述交错：先以首图领衔（建筑先给视觉），
       其后每一段自述后补一张图版，图用尽则纯文字收尾 */
    var imgs = (p.contentImages || []).slice();
    var altBase = t(p, 'title');
    var plateNo = 0;
    function nextPlate(lead) {
      if (!imgs.length) return null;
      plateNo += 1;
      var src = imgs.shift();
      return plate(src, altBase + ' — ' + L('图版', 'plate') + ' ' + pad2(plateNo),
        L('图版 ', 'PLATE ') + pad2(plateNo), lead);
    }

    var lead = nextPlate(true);
    if (lead) sec.appendChild(lead);

    var body = h('div', 'aw-body');
    var secs = SECTION_ORDER.map(function (k) { return p.sections && p.sections[k]; })
      .filter(function (s) { return s && t(s, 'body'); });
    secs.forEach(function (s, si) {
      var block = h('div', 'aw-sec');
      block.appendChild(secH(s));
      block.appendChild(plist(t(s, 'body')));
      body.appendChild(block);
      /* 首段（先说结论）已由领衔图承接，从第二段起补图；均匀铺开 */
      if (si >= 1) {
        var pl = nextPlate(false);
        if (pl) body.appendChild(pl);
      }
    });
    sec.appendChild(body);

    /* 图版有余（图多于可插点）则收尾成组 */
    while (imgs.length) {
      var extra = nextPlate(false);
      if (extra) sec.appendChild(extra);
    }

    var stack = t(p, 'tech_stack');
    if (stack) {
      var sl = h('p', 'stack-line');
      sl.appendChild(h('span', 'stack-label', 'STACK'));
      sl.appendChild(document.createTextNode(stack));
      sec.appendChild(sl);
    }

    var more = h('p', 'aw-more');
    var ma = h('a', null, L('查看完整案例', 'View the full case') + ' ↗');
    ma.href = 'project.html?id=' + id;
    more.appendChild(ma);
    sec.appendChild(more);

    return sec;
  }

  /* ════════ 尾声（合集简介 + PDF 下载 + 交叉链接） ════════ */
  function outroSection() {
    var sec = h('section', 'arch-outro');
    var band = h('div', 'ao-band');
    var mount = h('span');
    band.appendChild(mount);
    sec.appendChild(band);
    if (window.Barmorph) Barmorph.mountBrandBand(mount);

    sec.appendChild(h('p', 'ao-line',
      L('六个建筑作品——体系化训练的来处。',
        'Six works of architecture — where the systems training comes from.')));

    var actions = h('div', 'ao-actions');
    var alt = h('a', 'ao-alt');
    alt.href = 'portfolio/';
    alt.textContent = L('AI 产品作品集', 'AI product portfolio') + ' →';
    actions.appendChild(alt);
    var top = h('a', 'ao-top');
    top.href = '#'; top.textContent = L('回到顶部', 'Back to top') + ' ↑';
    top.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    actions.appendChild(top);
    sec.appendChild(actions);
    return sec;
  }

  /* ════════ 组册 ════════ */
  function render() {
    deck.textContent = '';
    var parts = [heroSection(), indexSection()];
    arch.items.forEach(function (id, i) {
      var w = workSection(id, i);
      if (w) parts.push(w);
    });
    parts.push(outroSection());
    deck.appendChild(frag.apply(null, parts));

    document.title = L('建筑作品集', 'Architecture Portfolio') + ' · Alnt_med';
    revealInit(parts);
    booted = true;
  }

  /* ── 屏显入场（仅首次；重渲染/打印直接终态）——合成器安全：只动 opacity/transform ── */
  function revealInit(els) {
    if (booted || matchMedia('print').matches || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -4% 0px' });
    els.forEach(function (el) { el.classList.add('arch-reveal'); io.observe(el); });
  }

  /* ── 启动 ── */
  function loadProjects() {
    if (window.Site && Site.loadProjects) return Site.loadProjects();
    return fetch('config/projects.json').then(function (r) { return r.json(); });
  }

  Promise.all([
    loadProjects(),
    fetch('config/portfolio.json').then(function (r) { return r.json(); })
  ]).then(function (res) {
    byId = new Map((res[0].projects || []).map(function (p) { return [p.id, p]; }));
    meta = res[1].meta;
    arch = res[1].architecture;
    if (!arch || !arch.items) throw new Error('portfolio.json 缺 architecture.items');
    render();
    if (window.I18N) I18N.apply();
    document.addEventListener('localechange', function () { render(); });
  }).catch(function (err) {
    console.error('[architecture] 加载失败', err);
    deck.appendChild(h('p', 'arch-error',
      'Failed to load — serve over HTTP (file:// blocks fetch).'));
  });
})();
