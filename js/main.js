/* ════════════════════════════════════════════════════════════
   main.js — 全站公共壳：header / footer / 侧钮注入 ·
   品牌带挂载 · reveal observer · 模态与 lightbox 工具。
   依赖：barmorph.js · language-toggle.js（先加载）。
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var PAGE = document.body.getAttribute('data-page') || '';

  /* ── chrome 注入（四页共用，不重复维护） ── */
  function injectChrome() {
    var header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML =
      '<div class="header-left">' +
        '<a class="wordmark" href="index.html" aria-label=".IAM. — Alnt_med · 回首页">' +
          '<span class="logoslot"></span>' +
        '</a>' +
        '<a class="nav-btn" href="around.html"' +
          (PAGE === 'around' ? ' aria-current="page"' : '') +
          ' data-zh="AROUND" data-en="AROUND">AROUND</a>' +
        '<a class="nav-btn" href="portfolio/" data-zh="PORTFOLIO" data-en="PORTFOLIO">PORTFOLIO</a>' +
      '</div>' +
      '<div class="header-right">' +
        '<span class="header-name">李文苑<i class="sep">·</i><span class="name-en">ALNT MED</span></span>' +
        '<button class="lang-toggle" type="button">EN</button>' +
        '<a class="gh-link" href="https://github.com/leemenuong-prog" target="_blank" rel="noopener" aria-label="GitHub">' +
          '<svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>' +
        '</a>' +
      '</div>';
    document.body.prepend(header);

    var footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML =
      '<div class="foot-left">' +
        '<div class="foot-name">李<span class="sep">·</span>LI &nbsp;文苑<span class="sep">·</span>MENUONG</div>' +
        '<div data-zh="AI 产品 × 建筑 — 作品集" data-en="AI Product × Architecture — Portfolio">AI 产品 × 建筑 — 作品集</div>' +
      '</div>' +
      /* 站内导航：页脚是 finale 编舞的终点，也是 <1024（无侧钮）时的 ABOUTME 入口 */
      '<nav class="foot-nav" aria-label="站内导航 · Site">' +
        '<a href="around.html"' + (PAGE === 'around' ? ' aria-current="page"' : '') + '>AROUND</a>' +
        '<a href="portfolio/">PORTFOLIO</a>' +
        '<a href="about.html"' + (PAGE === 'about' ? ' aria-current="page"' : '') + '>ABOUTME</a>' +
      '</nav>' +
      '<div class="foot-contact">' +
        '<div><a href="mailto:lee.menuong@gmail.com">lee.menuong@gmail.com</a></div>' +
        '<div><a href="https://github.com/leemenuong-prog" target="_blank" rel="noopener">github.com/leemenuong-prog</a></div>' +
      '</div>';
    document.body.appendChild(footer);

    /* 浮动侧钮：右 ABOUTME（AROUND 已并入 header 顶栏） */
    var right = document.createElement('a');
    right.className = 'side-btn right';
    right.href = 'about.html';
    right.textContent = 'ABOUTME';
    document.body.appendChild(right);

    /* 品牌带 */
    var slot = header.querySelector('.logoslot');
    if (window.Barmorph && slot) window.Barmorph.mountBrandBand(slot);

    /* 语言切换 */
    header.querySelector('.lang-toggle').addEventListener('click', function () {
      window.I18N.toggle();
    });
    window.I18N.apply();
  }

  /* ── reveal：[data-reveal] → .in（一次性） ── */
  function initReveal() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (ent) {
        if (ent.isIntersecting) {
          ent.target.classList.add('in');
          io.unobserve(ent.target);
        }
      });
    }, { threshold: 0.25, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ── 模态壳（文字球图注 / lightbox 共用） ── */
  function openModal(contentEl, cls) {
    closeModal();
    var ov = document.createElement('div');
    ov.className = 'modal-overlay' + (cls ? ' ' + cls : '');
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    var box = document.createElement('div');
    box.className = 'modal-box';
    var close = document.createElement('button');
    close.className = 'modal-close';
    close.setAttribute('aria-label', '关闭 · Close');
    close.innerHTML = '&times;';
    box.appendChild(close);
    box.appendChild(contentEl);
    ov.appendChild(box);
    document.body.appendChild(ov);
    document.body.style.overflow = 'hidden';

    close.addEventListener('click', closeModal);
    ov.addEventListener('click', function (e) { if (e.target === ov) closeModal(); });
    document.addEventListener('keydown', escClose);
    close.focus();
    return ov;
  }
  function escClose(e) { if (e.key === 'Escape') closeModal(); }
  function closeModal() {
    var ov = document.querySelector('.modal-overlay');
    if (!ov) return;
    ov.remove();
    document.body.style.overflow = '';
    document.removeEventListener('keydown', escClose);
  }
  function openLightbox(src, alt) {
    var img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    openModal(img, 'lightbox');
  }

  /* ── 数据加载（config/projects.json，一次拉取全站数据） ── */
  var dataPromise = null;
  function loadProjects() {
    if (!dataPromise) {
      dataPromise = fetch('config/projects.json')
        .then(function (r) {
          if (!r.ok) throw new Error('projects.json ' + r.status);
          return r.json();
        });
    }
    return dataPromise;
  }

  window.Site = {
    openModal: openModal,
    closeModal: closeModal,
    openLightbox: openLightbox,
    loadProjects: loadProjects,
    initReveal: initReveal
  };

  function boot() {
    injectChrome();
    initReveal();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
