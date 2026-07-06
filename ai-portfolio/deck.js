/* AI 作品集 · 竖向流式驱动
   缩放只写 CSS 变量 --s(print 侧零污染);页码由 IntersectionObserver 驱动;
   reveal 由 JS 自动标注(.rv 隐藏态只存在于 @media screen + body.anim,print 天然旁路) */
(function () {
  "use strict";
  var pages = Array.prototype.slice.call(document.querySelectorAll(".page"));
  var N = pages.length;
  var cur = 0;
  var root = document.documentElement;
  var counter = document.getElementById("hud-counter");
  var toc = document.getElementById("toc");

  function pad2(n) { return String(n).padStart(2, "0"); }

  /* ── 缩放:只依赖宽度;桌面最大显示宽 1520(画廊留白),clientWidth 排除滚动条。
     同时把 stage 高度钉在末页视觉底边——末页布局盒的未缩放余量((1-s)*1080px)
     不裁掉会在文档尾部留出幽灵滚动区 ── */
  var stage = document.getElementById("stage");
  function fit() {
    var pad = root.clientWidth < 760 ? 32 : 96;
    var w = Math.min(root.clientWidth - pad, 1520);
    var s = Math.min(w / 1920, 1);
    root.style.setProperty("--s", s);
    var last = pages[N - 1];
    if (last && stage) stage.style.height = Math.round(last.offsetTop + 1080 * s + 100 * s) + "px";
  }

  /* ── 跳页:平滑滚动;hash 只在主动跳转时写(滚动不污染 history) ── */
  function go(i, smooth) {
    i = Math.max(0, Math.min(N - 1, i));
    pages[i].scrollIntoView({ behavior: smooth === false ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", "#p/" + (i + 1));
    closeToc();
  }
  function parseHash() {
    var m = location.hash.match(/#p\/(\d+)/);
    return m ? Math.max(0, Math.min(N - 1, +m[1] - 1)) : -1;
  }

  /* ── 页码:屏幕中央 10% 判定带,一页过中线即计数 ── */
  function setCur(i) {
    cur = i;
    if (counter) counter.textContent = pad2(cur + 1) + " / " + N;
  }
  var pageIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) setCur(pages.indexOf(e.target));
    });
  }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
  pages.forEach(function (p) { pageIO.observe(p); });
  /* 高视口 × 矮页面时首末页够不到中线判定带 —— 近全可见即计数(滚动方向回正由中线 IO 接管) */
  new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) setCur(N - 1); });
  }, { threshold: 0.95 }).observe(pages[N - 1]);
  new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) setCur(0); });
  }, { threshold: 0.95 }).observe(pages[0]);

  /* ── reveal:自动标注(eyebrow → 标题 → 内容块,错峰 70ms) ── */
  pages.forEach(function (p) {
    var d = 0;
    var eb = p.querySelector(".eyebrow");
    if (eb) { eb.classList.add("rv"); eb.style.setProperty("--rvd", d++); }
    var h = p.querySelector(".h-display, .h1");
    if (h) { h.classList.add("rv"); h.style.setProperty("--rvd", d++); }
    Array.prototype.slice.call(
      p.querySelectorAll(".lead, .flow, .duo, .layers, .statband, .browser, .dex, .chrono, .cover-meta, .chain, .fig-ph")
    ).slice(0, 3).forEach(function (el) {
      if (el.closest(".rv") || el.classList.contains("rv")) return;
      el.classList.add("rv"); el.style.setProperty("--rvd", Math.min(d++, 3));
    });
  });
  var rvs = Array.prototype.slice.call(document.querySelectorAll(".rv"));
  /* 装载时已在视口内的元素直接终态 —— 不做「无触发的开场动画」 */
  rvs.forEach(function (el) {
    var r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) el.classList.add("in");
  });
  document.body.classList.add("anim");
  var rvIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); rvIO.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  rvs.forEach(function (el) { if (!el.classList.contains("in")) rvIO.observe(el); });

  /* ── 键盘:←→/PgUp/PgDn/Home/End 跳页;↑↓/空格保留原生滚动 ── */
  addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); go(cur + 1); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); go(cur - 1); }
    else if (e.key === "Home") { e.preventDefault(); go(0); }
    else if (e.key === "End") { e.preventDefault(); go(N - 1); }
    else if (e.key === "Escape") closeToc();
  });

  addEventListener("hashchange", function () {
    var i = parseHash(); if (i >= 0) go(i);
  });

  /* ── HUD 与目录 ── */
  function openToc() { if (toc) toc.classList.add("open"); }
  function closeToc() { if (toc) toc.classList.remove("open"); }
  function btn(id, fn) { var el = document.getElementById(id); if (el) el.addEventListener("click", fn); }
  btn("hud-prev", function () { go(cur - 1); });
  btn("hud-next", function () { go(cur + 1); });
  btn("hud-toc", openToc);
  btn("hud-print", function () { window.print(); });
  btn("toc-close", closeToc);
  if (toc) toc.addEventListener("click", function (e) { if (e.target === toc) closeToc(); });
  Array.prototype.forEach.call(document.querySelectorAll("#toc a[href^='#p/']"), function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      go(+a.getAttribute("href").slice(3) - 1);
    });
  });

  addEventListener("resize", fit);
  fit();
  /* 深链定位:load 后 instant 滚动(字体为本地 woff2,偏移窗口极小) */
  var h0 = parseHash();
  if (h0 > 0) addEventListener("load", function () { go(h0, false); });
})();
