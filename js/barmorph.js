/* ════════════════════════════════════════════════════════════
   barmorph.js — 「字⇄条」设计语言的 vanilla 移植。
   mountBrandBand(el) — header 的 .IAM. 品牌带（8 根节奏条 + 双方块句点）
   barWord(el, text)  — 词从条中解码升起（about 页标题用）
   样式见 css/barmorph.css；出生动画由祖先 .in 触发（main.js reveal）。
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* Logo 的天际线节奏 — 设计语言遗产，勿改 */
  var IAM_BARS = [0.97, 0.58, 1.0, 0.66, 0.9, 0.52, 0.74, 1.0];

  var REDUCE = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 品牌带 ── */
  function mountBrandBand(el) {
    var frag = document.createDocumentFragment();
    var band = document.createElement('span');
    band.className = 'brandband';
    band.setAttribute('aria-hidden', 'true');

    var sq = document.createElement('span');
    sq.className = 'bsq';
    band.appendChild(sq);

    IAM_BARS.forEach(function (h, i) {
      var bar = document.createElement('i');
      bar.style.setProperty('--h', h);
      bar.style.setProperty('--d', (0.15 + i * 0.07).toFixed(2) + 's');
      band.appendChild(bar);
    });

    var dot = document.createElement('span');
    dot.className = 'bdot';
    band.appendChild(dot);

    frag.appendChild(band);
    el.appendChild(frag);

    /* 挂载后下一拍触发升起（setTimeout 兜底后台标签页 rAF 不执行的情况） */
    setTimeout(function () { band.classList.add('in'); }, 40);
    return band;
  }

  /* ── BarWord ── */
  /* 笔画宽：i/l 细 · m/w 宽 —— 条宽呼应字的笔画重量 */
  var BM_STROKES = { i: 1, j: 1, l: 1, t: 1, f: 1, r: 1, a: 3, e: 3, s: 2, m: 4, w: 4 };
  function bmW(ch) {
    var n = BM_STROKES[ch.toLowerCase()] != null ? BM_STROKES[ch.toLowerCase()] : 2;
    return (0.12 + n * 0.1).toFixed(2) + 'em';
  }
  /* 条区高：大写/升部取 cap height，矮 x-height 字母取小值 */
  function bmZone(ch) {
    return (/[a-z]/.test(ch) && !/[bdfhklt]/.test(ch)) ? '.52em' : '.72em';
  }

  function barWord(el, text, opts) {
    opts = opts || {};
    var period = opts.period !== false;
    var delay = opts.delay || 0;
    var glyphs = Array.from(text);
    var runMs = (glyphs.length * 0.09 + 2.5) * 1000;

    var host = document.createElement('span');
    host.className = 'bmw';
    host.setAttribute('aria-label', text);

    var inner = document.createElement('span');
    inner.className = 'bmw-in';
    inner.setAttribute('aria-hidden', 'true');

    glyphs.forEach(function (ch, gi) {
      if (ch === ' ') {
        var sp = document.createElement('span');
        sp.className = 'bsp';
        inner.appendChild(sp);
        return;
      }
      var bg = document.createElement('span');
      bg.className = 'bg';
      bg.style.setProperty('--gd', (delay + gi * 0.09).toFixed(2) + 's');
      bg.style.setProperty('--bz', bmZone(ch));

      var glc = document.createElement('span');
      glc.className = 'glc';
      var gl = document.createElement('span');
      gl.className = 'gl';
      gl.textContent = ch;
      glc.appendChild(gl);

      var bars = document.createElement('span');
      bars.className = 'bars';
      var bar = document.createElement('i');
      bar.style.setProperty('--h', IAM_BARS[gi % IAM_BARS.length]);
      bar.style.setProperty('--bw', bmW(ch));
      bars.appendChild(bar);

      bg.appendChild(glc);
      bg.appendChild(bars);
      inner.appendChild(bg);
    });

    if (period) {
      var p = document.createElement('span');
      p.className = 'bmp';
      p.style.setProperty('--gd', (delay + (glyphs.length - 1) * 0.09).toFixed(2) + 's');
      inner.appendChild(p);
    }

    host.appendChild(inner);
    el.appendChild(host);

    /* 出生播一次即定格为永久可读的词 */
    if (REDUCE) { host.classList.add('set'); return host; }
    var timer = null;
    host.addEventListener('animationstart', function onStart() {
      if (timer) return;
      timer = setTimeout(function () { host.classList.add('set'); }, runMs);
    });
    return host;
  }

  window.Barmorph = { mountBrandBand: mountBrandBand, barWord: barWord, IAM_BARS: IAM_BARS };
})();
