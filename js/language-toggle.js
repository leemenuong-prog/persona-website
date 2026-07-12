/* ════════════════════════════════════════════════════════════
   language-toggle.js — 全站双语（zh 主 / en）。
   青出于蓝项：切换是「即时就地替换」，不整页 reload——
   · 静态 chrome 文案：元素带 data-zh / data-en 属性，walker 就地换
   · JSON 驱动内容：页面脚本监听 'localechange' 事件自行重渲染
   持久化 localStorage.preferredLocale；<head> 内联脚本已提前写
   html[data-locale] 防闪烁（见各页 head）。
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var KEY = 'preferredLocale';

  function detect() {
    try {
      var saved = localStorage.getItem(KEY);
      if (saved === 'zh' || saved === 'en') return saved;
    } catch (e) { /* 隐私模式无 localStorage */ }
    return 'zh';   /* 首访默认中文（2026-07-13 用户裁定，不再跟浏览器语言；手动切 EN 后仍持久化） */
  }

  var locale = document.documentElement.getAttribute('data-locale') || detect();

  function applyDom(root) {
    document.documentElement.setAttribute('data-locale', locale);
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
    var nodes = (root || document).querySelectorAll('[data-zh]');
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var txt = locale === 'zh' ? n.getAttribute('data-zh') : (n.getAttribute('data-en') || n.getAttribute('data-zh'));
      if (txt != null && n.textContent !== txt) n.textContent = txt;
    }
    var toggles = document.querySelectorAll('.lang-toggle');
    for (var j = 0; j < toggles.length; j++) {
      toggles[j].textContent = locale === 'zh' ? 'EN' : '中';
      toggles[j].setAttribute('aria-label', locale === 'zh' ? 'Switch to English' : '切换到中文');
    }
  }

  function setLocale(next) {
    if (next !== 'zh' && next !== 'en') return;
    locale = next;
    try { localStorage.setItem(KEY, next); } catch (e) { /* noop */ }
    applyDom();
    document.dispatchEvent(new CustomEvent('localechange', { detail: { locale: next } }));
  }

  window.I18N = {
    get locale() { return locale; },
    setLocale: setLocale,
    toggle: function () { setLocale(locale === 'zh' ? 'en' : 'zh'); },
    /* JSON 双字段取值：t(obj, 'title') → obj.title_zh | obj.title_en（缺则回退另一语言） */
    t: function (obj, base) {
      if (!obj) return '';
      var want = obj[base + '_' + locale];
      var other = obj[base + '_' + (locale === 'zh' ? 'en' : 'zh')];
      return want != null && want !== '' ? want : (other || obj[base] || '');
    },
    apply: applyDom
  };

  /* DOM 就绪后先跑一遍（chrome 注入由 main.js 完成后也会再调 apply） */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { applyDom(); });
  } else {
    applyDom();
  }
})();
