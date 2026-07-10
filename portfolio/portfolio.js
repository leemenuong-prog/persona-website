/* ════════════════════════════════════════════════════════════
   portfolio.js — AI 产品作品集渲染器（二迭代 2026-07-07）。
   同步规则：产品文案一律 join ../config/projects.json（单一事实源），
   ../config/portfolio.json 只提供页序/场景/截图清单/个人页/建筑矩阵。
   六作体系：products 5 项 + architecture 合成第 06 项（rail/INDEX）。
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
  function pad2(n) { return String(n).padStart(2, '0'); }

  /* 六作索引条目：五个 AI 产品 + 建筑合集（第 06 项由 architecture 合成） */
  function railEntries() {
    var items = pf.products.map(function (prod) {
      return { key: prod.ref, name: prod.display || prod.ref };
    });
    items.push({ key: 'architecture', name: pf.architecture.display || 'Architecture' });
    return items;
  }

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

  /* Mac 窗框（三灯 = macOS 原色，2026-07-07 二轮用户裁定的色彩例外） */
  function win(src, ratio, opts) {
    opts = opts || {};
    var w = h('div', 'win' + (opts.small ? ' win-sm' : ''));
    if (opts.frame === 'phone') {
      /* 手机壳：竖屏移动端截图专用（如飞书随身端）——上下窄边框
         承担设备感，两侧贴边；听筒/指示条只落边框带内，不遮内容 */
      w.className = 'phone-shell' + (opts.small ? ' win-sm' : '');
      var scr = h('div', 'win-shot');
      scr.style.setProperty('--r', ratio);
      scr.appendChild(img(src, opts.alt));
      w.appendChild(scr);
      return w;
    }
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

  /* 图格（窗框 + 可选图注） */
  function cell(im, prodUrl, alt, small) {
    var c = h('div', 'cell');
    c.style.setProperty('--r', im.ratio);
    c.appendChild(win(im.src, im.ratio, { frame: im.frame, url: prodUrl, small: small !== false, alt: alt }));
    var cap = t(im, 'caption');
    if (cap) c.appendChild(h('div', 'cell-cap', cap));
    return c;
  }

  /* 视频门面（2026-07-08 六轮：套用线稿标题版式做与正文的分隔）：
     左 = 核心语句大标题（motto 拉丁 Monterey + 中文小注）+ 观看外链；
     右 = 海报 + 播放钮。整块 <a>，web/PDF 同 DOM，链接即注记。 */
  function film(video) {
    var a = h('a', 'film');
    a.href = video.url; a.target = '_blank'; a.rel = 'noopener';
    var grid = h('span', 'film-grid');

    var side = h('span', 'film-side');
    var motto = h('span', 'la-motto');
    motto.appendChild(document.createTextNode(video.motto || t(video, 'label')));
    motto.appendChild(psq());
    if (video.motto_zh) motto.appendChild(h('span', 'zh-note', video.motto_zh));
    side.appendChild(motto);
    var cta = h('span', 'film-cta');
    if (video.label_zh) cta.appendChild(h('span', 'zh-note', video.label_zh + ' ·'));
    cta.appendChild(h('span', 'cta-link', (video.label_en || '').toUpperCase() + ' ↗'));
    side.appendChild(cta);
    grid.appendChild(side);

    var poster = h('span', 'film-poster');
    poster.style.setProperty('--r', video.poster_ratio || 1.7778);
    poster.appendChild(img(video.poster, t(video, 'label')));
    poster.appendChild(h('span', 'film-btn'));
    grid.appendChild(poster);

    a.appendChild(grid);
    return a;
  }

  function qrBlock(qr) {
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

  /* 索引 rail 双档：mini=false 完整档（仅产品封面页）；mini=true 极简档 */
  function rail(activeKey, mini) {
    var nav = h('nav', 'rail' + (mini ? ' rail--mini' : ''));
    nav.appendChild(h('div', 'rail-cap', 'Project'));
    var ol = h('ol');
    railEntries().forEach(function (entry, i) {
      var li = h('li', entry.key === activeKey ? 'active' : '');
      li.appendChild(document.createTextNode(pad2(i + 1)));
      li.appendChild(h('span', 'rail-name', entry.name));
      if (entry.key === activeKey) li.appendChild(psq());
      ol.appendChild(li);
    });
    nav.appendChild(ol);
    return nav;
  }

  function foot(num) {
    var f = h('footer', 'sheet-foot');
    f.appendChild(h('span', 'f-runner', 'LI WENYUAN — AI PRODUCT PORTFOLIO'));
    var n = h('span', 'f-num', pad2(num));
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

  /* ════════ P3 目录（六卡 3×2） ════════ */
  function sheetIndex(num) {
    var s = sheet('p-index', 'p3');
    var inner = h('div', 'index-inner');
    var title = h('h1', 'index-title');
    title.appendChild(document.createTextNode('INDEX'));
    title.appendChild(psq());
    inner.appendChild(title);
    inner.appendChild(h('p', 'index-sub', L('AI 产品 × 建筑 · 六个作品', 'SIX WORKS · AI PRODUCT × ARCHITECTURE')));

    var grid = h('div', 'matrix');
    function card(href, name, numStr, meta, thumbSrc, alt) {
      var el = h('a', 'matrix-card');
      el.href = href;
      var top = h('div', 'mc-top');
      top.appendChild(h('span', 'mc-name', name));
      top.appendChild(h('span', 'mc-num', numStr));
      el.appendChild(top);
      el.appendChild(h('div', 'mc-meta', meta));
      var th = h('div', 'mc-thumb');
      th.appendChild(img(thumbSrc, alt));
      el.appendChild(th);
      return el;
    }
    pf.products.forEach(function (prod, i) {
      var joined = byId.get(prod.ref);
      grid.appendChild(card('#work-' + prod.ref, prod.display || prod.ref, pad2(i + 1),
        t(joined, 'category') + ' · ' + (joined.year || ''), joined.thumb, t(joined, 'title')));
    });
    var arch = pf.architecture;
    var years = arch.items.map(function (id) { return parseInt(byId.get(id).year, 10); }).filter(Boolean);
    var range = years.length ? Math.min.apply(null, years) + '–' + Math.max.apply(null, years) : '';
    grid.appendChild(card('#p-arch', arch.display || 'Architecture', pad2(pf.products.length + 1),
      t(arch, 'index_meta') + (range ? ' · ' + range : ''), arch.index_cover, arch.display));
    inner.appendChild(grid);

    s.sheet.appendChild(inner);
    s.sheet.appendChild(foot(num));
    return s.holder;
  }

  /* ════════ 作品页公共头（kicker + 标题 + 关键词） ════════ */
  function workHead(prod, joined, idx) {
    var head = h('div', 'work-head');
    head.appendChild(h('div', 'kicker',
      'PROJECT ' + pad2(idx + 1) + ' · ' + (joined.category || '').toUpperCase() + ' · ' + (joined.year || '')));
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

  /* ════════ 作品封面页（统一紧凑模板：占位与做透同构，字段有则显） ════════ */
  function sheetWorkCover(prod, joined, idx, num) {
    var s = sheet('p-work', 'work-' + prod.ref);
    s.sheet.appendChild(rail(prod.ref, false));
    var main = h('div', 'work-main');
    main.appendChild(workHead(prod, joined, idx));

    /* 去重规则（2026-07-08 用户裁定：每段文字全册只出现一次）：
       one_liner 归线稿页；只有无线稿页的作品才在封面开场 */
    if (!prod.lineart) {
      var one = t(joined, 'one_liner');
      if (one) main.appendChild(h('p', 'oneliner work-oneliner', one));
    }

    /* 双栏带：左 = 先说结论列表；右 = 封面艺术方图 + 奖项注 */
    var cols = h('div', 'cover-cols' + (prod.placeholder ? ' ph' : ''));
    var lc = h('section', 'cc-left');
    lc.appendChild(secH(joined.sections.tldr));
    lc.appendChild(plist(t(joined.sections.tldr, 'body')));
    cols.appendChild(lc);
    var art = h('figure', 'cover-art');
    var th = h('div', 'ca-thumb');
    th.appendChild(img(joined.thumb, t(joined, 'title')));
    art.appendChild(th);
    var award = t(joined, 'award');
    if (award) {
      var ac = h('figcaption', 'work-award');
      ac.appendChild(psq());
      ac.appendChild(document.createTextNode(' ' + award));
      art.appendChild(ac);
    }
    cols.appendChild(art);
    main.appendChild(cols);

    if (prod.metrics) {
      var mb = h('div', 'metrics');
      prod.metrics.forEach(function (m) {
        var c = h('div');
        c.appendChild(h('div', 'm-val', m.value));
        c.appendChild(h('div', 'm-label', t(m, 'label')));
        mb.appendChild(c);
      });
      main.appendChild(mb);
    }

    if (prod.cover) {
      var shot = h('div', 'work-cover-shot');
      /* 落地页说明头（定式，六轮修正）：小标签点明「这是落地页」+
         英文大标题（lede_en 拉丁 Monterey）+ 中文解释小注（lede_zh，EN 版隐藏）
         ——英文大标+中文正文的全站口径；话术用户可随时改词 */
      if (prod.cover.label_en || prod.cover.lede_en) {
        var head = h('div', 'shot-head');
        var label = h('div', 'shot-label');
        label.appendChild(psq());
        if (prod.cover.label_zh) label.appendChild(h('span', 'zh-note', prod.cover.label_zh));
        label.appendChild(h('span', 'sl-en', prod.cover.label_en || ''));
        head.appendChild(label);
        if (prod.cover.lede_en) {
          var lede = h('p', 'shot-lede');
          lede.appendChild(document.createTextNode(prod.cover.lede_en));
          if (prod.cover.lede_zh) lede.appendChild(h('span', 'zh-note shot-lede-zh', prod.cover.lede_zh));
          head.appendChild(lede);
        }
        shot.appendChild(head);
      }
      shot.appendChild(win(prod.cover.shot, prod.cover.ratio, { frame: prod.cover.frame, url: joined.url, alt: prod.display }));
      var shotCap = t(prod.cover, 'caption');
      if (shotCap) shot.appendChild(h('div', 'cell-cap', shotCap));
      main.appendChild(shot);
    } else {
      var more = h('p', 'ph-more');
      var a = h('a', null, L('完整案例在主站', 'FULL CASE ON THE SITE') + ' ↗');
      a.href = pf.meta.site_url + 'project.html?id=' + prod.ref;
      a.target = '_blank'; a.rel = 'noopener';
      more.appendChild(a);
      main.appendChild(more);
    }

    s.sheet.appendChild(main);
    s.sheet.appendChild(foot(num));
    return s.holder;
  }

  /* ════════ 线稿块定式（2026-07-08 用户裁定，后续所有线稿照此） ════════
     一侧文字（大标题 = 线稿核心语句 lineart.motto，拉丁 Monterey + 中文小注；
     斜体 = one_liner，全册唯一一处——封面不再重复）｜一侧线稿图。
     keywords/STACK 不上线稿块（各归封面/尾页，文字零重复）。 */
  function lineartBlock(prod, joined) {
    var frag2 = document.createDocumentFragment();
    frag2.appendChild(h('div', 'kicker',
      'PROJECT ' + pad2(prodIndex(prod) + 1) + ' · ' + (prod.display || '').toUpperCase() + ' · SYSTEM LINEART'));
    var grid = h('div', 'la-grid');
    var side = h('div', 'la-side');
    var motto = h('h2', 'la-motto');
    motto.appendChild(document.createTextNode(prod.lineart.motto || (prod.display || prod.ref)));
    motto.appendChild(psq());
    if (prod.lineart.motto_zh) motto.appendChild(h('span', 'zh-note', prod.lineart.motto_zh));
    side.appendChild(motto);
    var one = t(joined, 'one_liner');
    if (one) side.appendChild(h('p', 'oneliner', one));
    grid.appendChild(side);
    var fig = h('figure', 'la-fig');
    fig.appendChild(img(prod.lineart.src, prod.display + ' — system lineart'));
    grid.appendChild(fig);
    frag2.appendChild(grid);
    return frag2;
  }
  function prodIndex(prod) {
    return pf.products.indexOf(prod);
  }

  /* 独立线稿页（作品有线稿但无场景页时的后备形态；有场景页时线稿块
     并入首场景页——正文排满规则，2026-07-08 用户裁定） */
  function sheetLineart(prod, joined, idx, num) {
    var s = sheet('p-work p-la');
    s.sheet.appendChild(rail(prod.ref, true));
    var main = h('div', 'work-main work-main--wide');
    main.appendChild(lineartBlock(prod, joined));
    s.sheet.appendChild(main);
    s.sheet.appendChild(foot(num));
    return s.holder;
  }

  /* ════════ 场景页（极简 rail + 横向行模块语法，2026-07-08 用户裁定） ════════
     每一行 = 横向满宽模块，纵向依次码放，正文禁左右双栏。行只有五种：
     {text:true}=一文 ｜ {text:true,img:i}=一文一图 ｜ {imgs:[...]}=一图/两图/三图等高行 */
  function sheetWorkScene(prod, joined, sc, idx, sceneNo, num, isLast, prepend) {
    var s = sheet('p-work');
    s.sheet.appendChild(rail(prod.ref, true));
    var main = h('div', 'work-main work-main--wide');

    /* 正文排满规则：线稿块并入首场景页顶部（prepend） */
    if (prepend) main.appendChild(prepend);

    /* 页头：场景 kicker（场景名并入）+ 章节 h2 */
    var kick = h('div', 'kicker');
    kick.appendChild(document.createTextNode('SCENE ' + pad2(sceneNo) + ' · ' + (sc.name_en || sc.id)));
    if (sc.name_zh) kick.appendChild(h('span', 'zh-note', '　' + sc.name_zh));
    main.appendChild(kick);

    var section = joined.sections[sc.copy_ref];
    main.appendChild(secH(section));

    var alt = (prod.display || prod.ref) + ' — ' + (sc.name_en || sc.id);
    var imgs = sc.images || [];
    var rows = sc.rows || [{ text: true }, { imgs: imgs.map(function (_, i) { return i; }) }];

    /* rows 里没有 text 行时自动前置一行满宽正文 */
    var hasText = rows.some(function (r) { return r.text; });
    if (!hasText) rows = [{ text: true }].concat(rows);

    var wrap = h('section', 'scene');
    rows.forEach(function (r) {
      if (r.text && r.img != null) {
        /* 一文一图：文左 + 定宽小图右（少数行） */
        var ti = h('div', 'row-ti');
        var txt = h('div', 'row-ti-text');
        txt.appendChild(plist(t(section, 'body')));
        ti.appendChild(txt);
        var c = cell(imgs[r.img], joined.url, alt);
        if (r.img_mm) c.style.setProperty('--w', r.img_mm + 'mm');
        ti.appendChild(c);
        wrap.appendChild(ti);
      } else if (r.text) {
        /* 一文：满宽正文行 */
        var rt = h('div', 'row-text');
        rt.appendChild(plist(t(section, 'body')));
        wrap.appendChild(rt);
      } else if (r.sec) {
        /* 独立文字节模块：引用另一节文案（自带节标题的满宽文字行）——
           画廊详情里写了的节，作品集必须都有（2026-07-10 用户裁定）；
           与场景主节异质，上间距拉大（.row-sec） */
        var sec2 = joined.sections[r.sec];
        if (!sec2) { console.warn('[portfolio] rows.sec 未命中:', sc.id, r.sec); return; }
        var rs = h('div', 'row-text row-sec');
        rs.appendChild(secH(sec2));
        rs.appendChild(plist(t(sec2, 'body')));
        wrap.appendChild(rs);
      } else if (r.imgs && r.imgs.length) {
        /* 一图/两图/三图：等高对齐行（单图=满宽） */
        var row = h('div', 'scene-row');
        r.imgs.forEach(function (i) {
          var im = imgs[i];
          if (!im) { console.warn('[portfolio] rows 引用越界:', sc.id, i); return; }
          row.appendChild(cell(im, joined.url, alt, r.imgs.length > 1));
        });
        wrap.appendChild(row);
      }
    });
    main.appendChild(wrap);

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

  /* ════════ 建筑压轴 = PROJECT 06 内容页 ════════ */
  function sheetArch(num) {
    var arch = pf.architecture;
    var s = sheet('p-arch', 'p-arch');
    s.sheet.appendChild(rail('architecture', true));
    var inner = h('div', 'arch-inner');

    var years = arch.items.map(function (id) { return parseInt(byId.get(id).year, 10); }).filter(Boolean);
    var range = years.length ? Math.min.apply(null, years) + '–' + Math.max.apply(null, years) : '';
    inner.appendChild(h('div', 'kicker', 'PROJECT ' + pad2(pf.products.length + 1) + ' · ARCHITECTURE' + (range ? ' · ' + range : '')));

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
      sheets.push(sheetWorkCover(prod, joined, idx, num++));
      var scenes = prod.scenes || [];
      /* 正文排满规则（2026-07-08 用户裁定）：有场景页时线稿块并入首场景页，
         不再单独成页；仅无场景页的作品保留独立线稿页 */
      if (prod.lineart && !scenes.length) sheets.push(sheetLineart(prod, joined, idx, num++));
      scenes.forEach(function (sc, si) {
        var pre = (si === 0 && prod.lineart) ? lineartBlock(prod, joined) : null;
        sheets.push(sheetWorkScene(prod, joined, sc, idx, si + 1, num++, si === scenes.length - 1, pre));
      });
    });

    sheets.push(sheetArch(num++));
    sheets.push(sheetBack());
    deck.appendChild(frag.apply(null, sheets));

    document.title = 'Portfolio · Alnt_med';
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
