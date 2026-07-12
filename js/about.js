/* ════════════════════════════════════════════════════════════
   about.js — 关于页：BarWord 标题 + 简历/目录渲染（2026-07-12 重构）。
   数据 = config/portfolio.json profile/products/architecture（join projects.json），
   与作品集 P2/P3 单一事实源——改简历/目录只改 JSON，两处自动同步。
   双语：动态节点烙 data-zh/data-en（bi()，只挂纯文本叶子——applyDom 写
   textContent，含子元素的节点如 hello+psq 一律不挂），language-toggle 的
   applyDom 切换时全文档查询即接管，零重渲染 → 揭示动画态不重置。
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function h(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function locale() {
    return document.documentElement.getAttribute('data-locale') === 'en' ? 'en' : 'zh';
  }

  /* 双语叶子：烙属性 + 写当前语言初始文案（此后切换归 language-toggle） */
  function bi(el, zh, en) {
    el.setAttribute('data-zh', zh);
    el.setAttribute('data-en', en != null ? en : zh);
    el.textContent = locale() === 'zh' ? zh : (en != null ? en : zh);
    return el;
  }

  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  function psq() { return h('span', 'psq'); }

  /* ── ② 身份簇（P2 左栏）：hello + role 插到格言前，intro 接在格言后 ── */
  function renderId(profile) {
    var host = document.querySelector('.about-id');
    if (!host) return;
    var lede = host.querySelector('.about-lede');

    var hello = h('h2', 'about-hello', profile.hello);   /* 拉丁定字，不挂 bi（含 psq 子元素） */
    hello.appendChild(psq());
    var role = bi(h('p', 'about-role'), profile.role_zh, profile.role_en);
    host.insertBefore(hello, lede);
    host.insertBefore(role, lede);
    host.appendChild(bi(h('p', 'about-intro'), profile.intro_zh, profile.intro_en));
  }

  /* ── ② CV 四节（P2 右栏）：教育/经历/奖项/技能 ── */
  function cvRow(item) {
    var li = h('li', 'cv-row');
    if (item.period) {
      li.appendChild(bi(h('span', 'cv-period'), item.period, item.period_en || item.period));
    }
    li.appendChild(bi(h('span', 'cv-text'), item.text_zh, item.text_en));
    if (item.note) li.appendChild(h('span', 'cv-note', item.note));   /* TOP n% 拉丁定字 */
    return li;
  }

  function skillRow(item) {
    var li = h('li', 'cv-row skill-row');
    li.appendChild(bi(h('span', 'skill-name'), item.group_zh, item.group_en));
    li.appendChild(bi(h('span', 'skill-items'), item.items_zh, item.items_en));
    return li;
  }

  function cvSec(zh, en, items, rowFn) {
    var sec = h('section', 'cv-sec');
    sec.setAttribute('data-reveal', '');
    sec.appendChild(bi(h('h2', 'cv-h'), zh, en));
    var ul = h('ul', 'cv-list');
    items.forEach(function (it) { ul.appendChild(rowFn(it)); });
    sec.appendChild(ul);
    return sec;
  }

  function renderCV(profile) {
    var host = document.getElementById('about-cv');
    if (!host) return;
    host.appendChild(cvSec('教育背景', 'EDUCATION', profile.education, cvRow));
    host.appendChild(cvSec('实习与经历', 'EXPERIENCE', profile.experience, cvRow));
    host.appendChild(cvSec('奖项', 'AWARDS', profile.awards, cvRow));
    host.appendChild(cvSec('技能', 'SKILLS', profile.skills, skillRow));
  }

  /* ── ③ 目录六卡（P3 INDEX 的网页化）：01-05 → 详情页，06 → 建筑阅读器 ── */
  function card(href, name, num, metaZh, metaEn, thumbSrc, alt) {
    var a = h('a', 'idx-card');
    a.href = href;
    var top = h('div', 'idx-top');
    top.appendChild(h('span', 'idx-name', name));       /* display 拉丁字面，不翻译 */
    top.appendChild(h('span', 'idx-num', num));
    a.appendChild(top);
    a.appendChild(bi(h('p', 'idx-meta'), metaZh, metaEn));
    if (thumbSrc) {
      var fig = h('div', 'idx-thumb');
      var img = document.createElement('img');
      img.alt = alt || name;
      window.ImgU.attach(img, thumbSrc, 400);   /* 变体回退先挂，缺图兜底在后 */
      img.addEventListener('error', function () { fig.remove(); });
      fig.appendChild(img);
      a.appendChild(fig);
    }
    return a;
  }

  function renderIndex(pf, byId) {
    var host = document.getElementById('about-index');
    if (!host) return;

    var head = h('div', 'idx-head');
    head.setAttribute('data-reveal', '');
    var title = h('h2', 'idx-title', 'INDEX');
    title.appendChild(psq());
    head.appendChild(title);
    head.appendChild(bi(h('p', 'idx-sub'), 'AI 产品 × 建筑设计', 'AI PRODUCT × ARCHITECTURE'));
    host.appendChild(head);

    var grid = h('div', 'idx-grid');
    grid.setAttribute('data-reveal', '');

    (pf.products || []).forEach(function (prod, i) {
      var joined = byId.get(prod.ref);
      if (!joined) return;
      /* 小字：有荣誉的作品写荣誉，无荣誉的写产品介绍（与首页主线卡同口径） */
      var metaZh = joined.award_zh || joined.desc_zh || '';
      var metaEn = joined.award_en || joined.desc_en || joined.desc_zh || '';
      grid.appendChild(card(
        'project.html?id=' + encodeURIComponent(prod.ref),
        prod.display, pad2(i + 1), metaZh, metaEn,
        joined.thumb, joined.title_en || prod.display
      ));
    });

    var arch = pf.architecture;
    if (arch) {
      var years = (arch.items || []).map(function (id) {
        var p = byId.get(id); return p ? parseInt(p.year, 10) : NaN;
      }).filter(function (y) { return !isNaN(y); });
      var range = years.length ? Math.min.apply(null, years) + '–' + Math.max.apply(null, years) : '';
      var mZh = (arch.index_meta_zh || '') + (range ? ' · ' + range : '');
      var mEn = (arch.index_meta_en || '') + (range ? ' · ' + range : '');
      grid.appendChild(card('architecture.html', arch.display, pad2(6), mZh, mEn,
        arch.index_cover, arch.display));
    }
    host.appendChild(grid);
  }

  /* ── boot ── */
  function barTitle() {
    var host = document.getElementById('about-title');
    if (host && window.Barmorph) {
      window.Barmorph.barWord(host, 'WHOAMI', { period: true });
    }
  }

  function boot() {
    barTitle();
    var loadProjects = (window.Site && window.Site.loadProjects)
      ? window.Site.loadProjects()
      : fetch('config/projects.json').then(function (r) { return r.json(); });
    Promise.all([
      loadProjects,
      fetch('config/portfolio.json').then(function (r) { return r.json(); })
    ]).then(function (res) {
      var projects = (res[0] && res[0].projects) || [];
      var pf = res[1] || {};
      var byId = new Map(projects.map(function (p) { return [p.id, p]; }));
      if (pf.profile) { renderId(pf.profile); renderCV(pf.profile); }
      renderIndex(pf, byId);
      if (window.I18N && window.I18N.apply) window.I18N.apply();       /* 兜底把当前语言写齐 */
      if (window.Site && window.Site.initReveal) window.Site.initReveal(); /* 给动态 [data-reveal] 挂观察 */
    }).catch(function (err) {
      console.error('[about] 数据加载失败（退化为静态骨架）', err);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
