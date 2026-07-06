/* ════════════════════════════════════════════════════════════
   editor.js — 站长编辑者模式（仅作品详情页）。
   入口（隐藏）：① 2.5 秒内连点页脚姓名 5 次；② URL 带 #atelier。
   口令校验走 SHA-256 摘要比对，明文不出现在任何源码里。
   编辑落点：直接改渲染出来的字（contenteditable），失焦写回
   内存中的项目对象；「保存本机」写 localStorage 草稿（只有这台
   浏览器可见），「下载 projects.json」导出全量数据文件，替换
   仓库里的 config/projects.json 后提交即为正式发布。
   依赖：language-toggle.js（I18N）· project-detail.js（window.__detail
   + 'detailrendered' 事件）。
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* 全站都可解锁（页脚入口）；实际的就地编辑只发生在作品详情页 */
  var PAGE = document.body.getAttribute('data-page') || '';

  /* 口令摘要（SHA-256）。改口令：shasum -a 256 算新摘要替换。 */
  var GATE = '294e5da2a8497d218e41cd2426c3132064c7a3748d8a1a3ba70db838898889a5';
  var OVERLAY_KEY = 'siteEditorOverlay';
  var SESSION_KEY = 'editorOn';
  var on = false;

  function sha256(text) {
    var buf = new TextEncoder().encode(text);
    return crypto.subtle.digest('SHA-256', buf).then(function (h) {
      return Array.prototype.map.call(new Uint8Array(h), function (b) {
        return ('0' + b.toString(16)).slice(-2);
      }).join('');
    });
  }

  /* ── 样式 ── */
  function injectStyle() {
    var css =
      'body.editing .ed-field{outline:1px dashed #BEBEBE;outline-offset:4px;cursor:text}' +
      'body.editing .ed-field:hover{outline-color:#999}' +
      'body.editing .ed-field:focus{outline:1px solid #333;background:rgba(255,255,255,.6)}' +
      '.ed-bar{position:fixed;right:18px;bottom:18px;z-index:120;display:flex;gap:8px;' +
        'background:rgba(255,255,255,.96);border:1px solid #E0E0E0;border-radius:6px;' +
        'padding:8px 10px;box-shadow:0 6px 24px rgba(0,0,0,.08);' +
        'font-family:-apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif}' +
      '.ed-bar button{font-size:12px;padding:5px 10px;cursor:pointer;border:1px solid #E0E0E0;' +
        'background:#fff;color:#333;border-radius:4px}' +
      '.ed-bar button:hover{border-color:#999}' +
      '.ed-bar .ed-tag{align-self:center;font-size:11px;letter-spacing:.1em;color:#BEBEBE;margin-right:2px}' +
      '.ed-toast{position:fixed;right:18px;bottom:74px;z-index:120;font-size:12px;color:#333;' +
        'background:rgba(255,255,255,.96);border:1px solid #E0E0E0;border-radius:4px;' +
        'padding:6px 12px;opacity:0;transition:opacity .25s}' +
      '.ed-toast.show{opacity:1}';
    var s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  }

  var toastEl, toastTimer;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'ed-toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 1800);
  }

  /* ── 可编辑绑定 ── */
  function editable(el, write) {
    if (!el || el.__edBound) return;
    el.__edBound = true;
    try { el.contentEditable = 'plaintext-only'; } catch (e) { /* Firefox */ }
    if (el.contentEditable !== 'plaintext-only') el.contentEditable = 'true';
    el.classList.add('ed-field');
    el.addEventListener('blur', function () { write(el); });
  }

  function lines(el) {
    return el.innerText.split('\n').map(function (s) { return s.trim(); })
      .filter(Boolean).join('\n');
  }

  function rebind() {
    if (!on || !window.__detail) return;
    var p = window.__detail.project;
    var loc = window.I18N.locale;

    editable(document.querySelector('.detail-keywords'), function (el) {
      p['keywords_' + loc] = el.innerText.trim();
    });
    editable(document.querySelector('.detail-oneliner'), function (el) {
      p['one_liner_' + loc] = el.innerText.trim();
    });
    var secs = document.querySelectorAll('.detail-section[data-skey]');
    Array.prototype.forEach.call(secs, function (sec) {
      var s = p.sections && p.sections[sec.getAttribute('data-skey')];
      if (!s) return;
      editable(sec.querySelector('h2'), function (el) { s['title_' + loc] = el.innerText.trim(); });
      editable(sec.querySelector('ul, p'), function (el) { s['body_' + loc] = lines(el); });
      var cap = sec.querySelector('figcaption');
      if (cap && s.figure) editable(cap, function (el) { s.figure['caption_' + loc] = el.innerText.trim(); });
    });
    var mcaps = document.querySelectorAll('.media-caption');
    Array.prototype.forEach.call(mcaps, function (el, i) {
      if (p.media && p.media[i]) editable(el, function (e2) { p.media[i]['label_' + loc] = e2.innerText.trim(); });
    });
  }

  /* ── 工具条 ── */
  function buildBar() {
    var bar = document.createElement('div');
    bar.className = 'ed-bar';
    bar.innerHTML =
      '<span class="ed-tag">EDIT</span>' +
      '<button type="button" data-act="save">保存本机</button>' +
      '<button type="button" data-act="download">下载 projects.json</button>' +
      '<button type="button" data-act="revert">还原</button>' +
      '<button type="button" data-act="exit">退出</button>';
    bar.addEventListener('click', function (e) {
      var act = e.target.getAttribute('data-act');
      if (!act || !window.__detail) return;
      var d = window.__detail, p = d.project;
      if (act === 'save') {
        var ov = {};
        try { ov = JSON.parse(localStorage.getItem(OVERLAY_KEY) || '{}'); } catch (err) { /* noop */ }
        ov[p.id] = p;
        localStorage.setItem(OVERLAY_KEY, JSON.stringify(ov));
        toast('已保存到本机草稿（仅这台浏览器可见）');
      } else if (act === 'download') {
        var blob = new Blob([JSON.stringify(d.data, null, 2) + '\n'], { type: 'application/json' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'projects.json';
        a.click();
        URL.revokeObjectURL(a.href);
        toast('已导出——替换 config/projects.json 后提交即发布');
      } else if (act === 'revert') {
        try {
          var ov2 = JSON.parse(localStorage.getItem(OVERLAY_KEY) || '{}');
          delete ov2[p.id];
          localStorage.setItem(OVERLAY_KEY, JSON.stringify(ov2));
        } catch (err) { /* noop */ }
        location.reload();
      } else if (act === 'exit') {
        try { sessionStorage.removeItem(SESSION_KEY); } catch (err) { /* noop */ }
        location.href = location.pathname + location.search;
      }
    });
    document.body.appendChild(bar);
  }

  function enable() {
    if (on) return;
    on = true;
    injectStyle();
    document.body.classList.add('editing');
    buildBar();
    rebind();
    toast('编辑者模式已开启——直接点字修改，失焦生效');
  }

  /* ── 门卫 ── */
  function gate() {
    if (on) return;
    var input = window.prompt('口令');
    if (input == null || input === '') return;
    sha256(input).then(function (hex) {
      if (hex === GATE) {
        try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (e) { /* noop */ }
        enable();
      }
    });
  }

  /* 入口 ①：连点页脚姓名 5 次（2.5s 内） */
  function armFooter() {
    var name = document.querySelector('.site-footer .foot-name');
    if (!name) { setTimeout(armFooter, 300); return; }
    var count = 0, timer = null;
    name.addEventListener('click', function () {
      count += 1;
      clearTimeout(timer);
      timer = setTimeout(function () { count = 0; }, 2500);
      if (count >= 5) { count = 0; gate(); }
    });
  }

  document.addEventListener('detailrendered', rebind);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    armFooter();
    var resume = false;
    try { resume = sessionStorage.getItem(SESSION_KEY) === '1'; } catch (e) { /* noop */ }
    if (resume) {
      enable();                                     /* 本会话已验证过，直接恢复 */
    } else if (location.hash === '#atelier') {
      /* 入口 ②：URL 带 #atelier。等 chrome 注入完再弹口令 */
      setTimeout(gate, 400);
    }
  }
})();
