/* ════════════════════════════════════════════════════════════
   img-util.js — WebP 变体选档（2026-07-13 大陆手机端提速）
   变体由 tools/build-images.sh 预生成为仓库物理文件：
     {base}.webp（同尺寸转格）· {base}.w{480,800,1200}.webp（限宽，
     源不够宽的档=同尺寸编码，阶梯选档不会 404）。
   选型裁定：直接换 .webp URL 不用 <picture>/srcset——全站图片都是
   JS 构造、支持地板 iOS14+/微信 X5 都解 WebP、srcset 会被 portfolio
   的 --sheet-scale transform 骗尺寸。
   必须在各页其余 defer 脚本之前引入（defer 按文档序执行）。
   ════════════════════════════════════════════════════════════ */
window.ImgU = (function () {
  'use strict';

  var LADDER = [480, 800, 1200];
  var DPR = Math.min(window.devicePixelRatio || 1, 2);   /* 3x 屏按 2x 取档：肉眼无差、字节减半 */

  /* 按「显示 CSS 宽 × DPR」在阶梯里选最小够用档；非 JPEG（webp/svg/png）原样通过。
     cssW 先与视口宽取小——全站图都 max-width:100%，不会显示得比视口宽，
     手机端（~390px）一切大图自动落 w800 档，调用点不用写双份提示 */
  function variant(src, cssW) {
    if (!/\.jpe?g$/i.test(src || '')) return src;
    var vw = (document.documentElement && document.documentElement.clientWidth) || 1024;
    var need = Math.min(cssW || 900, vw) * DPR;
    var base = src.replace(/\.jpe?g$/i, '');
    for (var i = 0; i < LADDER.length; i++) {
      if (LADDER[i] >= need) return base + '.w' + LADDER[i] + '.webp';
    }
    return base + '.webp';
  }

  /* 一次替换 src/loading/decoding 三件套。
     变体缺失（如新作品没跑 build-images.sh）→ 一次性 onerror 回退原 JPEG；
     stopImmediatePropagation 挡住调用方的 error 监听（如 index.js 的
     thumb-fallback 移除），原图也挂了才轮到它——attach 必须先于调用方挂 error。
     opts.print：打印/PDF 导出走原样（eager+sync+原 JPEG，Chrome 嵌入不转码）。 */
  function attach(im, src, cssW, opts) {
    opts = opts || {};
    if (opts.print) {
      im.loading = 'eager'; im.decoding = 'sync';
      im.src = src;
      return im;
    }
    var v = variant(src, cssW);
    if (v !== src) {
      im.dataset.orig = src;
      im.addEventListener('error', function (e) {
        e.stopImmediatePropagation();
        im.src = src;
      }, { once: true });
    }
    im.loading = 'lazy'; im.decoding = 'async';   /* loading 先于 src：属性后置可能拦不住已起跑的 fetch */
    im.src = v;
    return im;
  }

  return { variant: variant, attach: attach };
})();
