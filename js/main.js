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
      '<a class="nav-btn" href="projects.html"' +
        (PAGE === 'projects' ? ' aria-current="page"' : '') +
        ' data-zh="PROJECTS" data-en="PROJECTS">PROJECTS</a>' +
      '<div class="header-right">' +
        '<a class="wordmark" href="index.html" aria-label=".IAM. — Alnt Med · 回首页">' +
          '<span class="logoslot"></span><small>ALNT MED</small>' +
        '</a>' +
        '<button class="lang-toggle" type="button">EN</button>' +
      '</div>';
    document.body.prepend(header);

    var footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML =
      '<div class="foot-left">' +
        '<div class="foot-name">李<span class="sep">·</span>LI &nbsp;文苑<span class="sep">·</span>MENUONG</div>' +
        '<div data-zh="AI 产品 × 建筑 — 作品集" data-en="AI Product × Architecture — Portfolio">AI 产品 × 建筑 — 作品集</div>' +
      '</div>' +
      '<div class="foot-contact">' +
        '<div><a href="mailto:lee.menuong@gmail.com">lee.menuong@gmail.com</a></div>' +
        '<div><a href="https://github.com/leemenuong-prog" target="_blank" rel="noopener">github.com/leemenuong-prog</a></div>' +
      '</div>';
    document.body.appendChild(footer);

    /* 浮动侧钮：左 AROUND（M5 前暂指作品集 PDF）· 右 ABOUT */
    var left = document.createElement('a');
    left.className = 'side-btn left';
    left.href = 'uploads/portfolio.pdf';
    left.target = '_blank';
    left.rel = 'noopener';
    left.textContent = 'AROUND';
    var right = document.createElement('a');
    right.className = 'side-btn right';
    right.href = 'about.html';
    right.textContent = 'ABOUT';
    document.body.appendChild(left);
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
