/* ════════════════════════════════════════════════════════════
   ribbon-render.js — 丝带 Canvas 2D 渲染后端（2026-07-12 连续化改版）。

   为什么是 canvas：旧 DOM strip 方案（~138 个平面各自栅格化再合成）在切片交界
   有纹理采样错位/边缘独立 AA/叠印三类伪影，加密切片治标不治本；整条带画进
   同一张栅格后以连续覆盖率成像，锯齿从机理上根除。运动数学仍在 ribbon.js，
   本文件只负责「rung 序列 → 像素」：
   - atlas：11 卡横排成带图集（含卡间缝透明列），调色 saturate(.85)
     contrast(1.03) brightness(1.02) 一次性烧入（ctx.filter 特性检测，
     Safari <18 走 ImageData 线性矩阵 fallback）；未解码的卡先以灰圆角占位，
     decode 到一张升级一张（入场不等图）。
   - 每帧：相邻 rung 成切片（共享精确角点，误差不累积），平行四边形
     setTransform + drawImage(atlas 竖条)，向两侧多画 ~0.4 设备 px 防 AA
     发丝缝；白纱 = globalAlpha 白 fillRect（向暖白底淡去，勿改回压暗）；
     切片按 camZ 远→近排序（画家算法接管自遮挡）。
   - 双 canvas z-split：前/后弧各画一张 canvas，夹住大字（back z1 / front z4），
     跨侧切片两边都画（0.4° 级重叠，防两画布交界透缝）。
   - 拾取：留存上帧前弧切片四角，点-在-四边形测试 → 卡 id（供点击滚锚点）。
   ⚠️ iOS canvas 单边上限 8192：atlas 宽 L×dpr 桌面已贴线，必须走 kScale 守卫。
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var MAX_TEX = 8192;            /* iOS Safari canvas 单边硬上限（保守值） */
  var CORNER = 3;                /* 卡外角圆角（带坐标 px，对齐旧 .rstrip--head/tail） */
  var OVERLAP = 0.4;             /* 切片向两侧外扩的设备 px：防相邻切片各自 AA 留发丝缝 */
  var VEIL_MIN = 0.012;          /* 白纱低于此不画（前弧近全彩，省一半 fillRect） */

  /* ctx.filter 特性检测：Safari <18 静默忽略（不报错、无效果），
     必须画一像素读回验证，不能只查属性存在 */
  var filterOK = (function () {
    try {
      var c = document.createElement('canvas');
      c.width = c.height = 1;
      var x = c.getContext('2d');
      x.filter = 'grayscale(1)';
      x.fillStyle = '#f00';
      x.fillRect(0, 0, 1, 1);
      var d = x.getImageData(0, 0, 1, 1).data;
      return d[0] === d[1] && d[1] === d[2];
    } catch (e) { return false; }
  })();

  /* 调色（与旧 .rstrip img 的 CSS filter 同参）：sRGB 逐通道线性运算，
     顺序 saturate → contrast → brightness 与声明序一致 */
  function gradeInto(ctx2, img, w, h) {
    if (filterOK) {
      ctx2.filter = 'saturate(0.85) contrast(1.03) brightness(1.02)';
      ctx2.drawImage(img, 0, 0, w, h);
      ctx2.filter = 'none';
      return;
    }
    ctx2.drawImage(img, 0, 0, w, h);
    var id = ctx2.getImageData(0, 0, w, h), d = id.data, i, r, g, b, lum;
    for (i = 0; i < d.length; i += 4) {
      r = d[i]; g = d[i + 1]; b = d[i + 2];
      lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      r = lum + (r - lum) * 0.85; g = lum + (g - lum) * 0.85; b = lum + (b - lum) * 0.85;
      r = (r - 127.5) * 1.03 + 127.5; g = (g - 127.5) * 1.03 + 127.5; b = (b - 127.5) * 1.03 + 127.5;
      d[i] = Math.max(0, Math.min(255, r * 1.02));
      d[i + 1] = Math.max(0, Math.min(255, g * 1.02));
      d[i + 2] = Math.max(0, Math.min(255, b * 1.02));
    }
    ctx2.putImageData(id, 0, 0);
  }

  function roundedPath(ctx2, x, y, w, h, r) {
    if (ctx2.roundRect) { ctx2.beginPath(); ctx2.roundRect(x, y, w, h, r); return; }
    ctx2.beginPath();
    ctx2.moveTo(x + r, y);
    ctx2.arcTo(x + w, y, x + w, y + h, r);
    ctx2.arcTo(x + w, y + h, x, y + h, r);
    ctx2.arcTo(x, y + h, x, y, r);
    ctx2.arcTo(x, y, x + w, y, r);
    ctx2.closePath();
  }

  function create(opts) {
    var backC = opts.backCanvas, frontC = opts.frontCanvas;
    if (!backC || !frontC || !backC.getContext) return null;
    var bctx = backC.getContext('2d');
    var fctx = frontC.getContext('2d');
    if (!bctx || !fctx) return null;

    var dpr = 1;                 /* layout() 时定（cap 2） */
    var W = 0, Hpx = 0;          /* 层 CSS 尺寸 */
    var cards = null;            /* [{id, start, w, aspect}]（带坐标，来自 ribbon.js） */
    var bandH = 0;               /* 带高（带坐标 px） */
    var atlas = null, atlasK = 0, atlasH = 0;   /* 图集 + 带px→图集px 比例 */
    var graded = [];             /* 调色后的源位图缓存（atlas 重建直接取用） */
    var white = opts.white || '#FFFFFF';
    var border = opts.border || '#E0E0E0';

    /* 上帧前弧切片快照（拾取用）：[ax,ay,bx,by,cx2,cy2,dx2,dy2,sMid] × n，层内 CSS 坐标 */
    var pickBuf = new Float32Array(9 * 4096), pickN = 0;
    var stats = { slices: 0, ms: 0 };

    /* ── atlas ── */
    function rebuildAtlas() {
      if (!cards || !bandH) return;
      var L = cards[cards.length - 1].start + cards[cards.length - 1].w;
      atlasK = Math.min(dpr, MAX_TEX / (L + 4), MAX_TEX / (bandH + 4));
      atlas = document.createElement('canvas');
      atlas.width = Math.max(2, Math.ceil(L * atlasK));
      atlas.height = atlasH = Math.max(2, Math.ceil(bandH * atlasK));
      for (var i = 0; i < cards.length; i++) blitCard(i);
    }
    function blitCard(i) {
      var c = cards[i], x = atlas.getContext('2d');
      var x0 = c.start * atlasK, w = c.w * atlasK, h = bandH * atlasK;
      x.clearRect(Math.floor(x0) - 1, 0, Math.ceil(w) + 2, atlas.height);
      x.save();
      roundedPath(x, x0, 0, w, h, Math.min(CORNER * atlasK, w / 4, h / 4));
      x.clip();
      if (graded[i]) {
        x.imageSmoothingQuality = 'high';
        x.drawImage(graded[i], x0, 0, w, h);
      } else {
        x.fillStyle = border;                    /* 灰占位（同旧 strip 灰底语言） */
        x.fillRect(x0, 0, w, h);
      }
      x.restore();
    }

    /* ── 逐帧绘制 ──
       rungs 打包（stride 8）：s, topX, topY, botX, botY, camZ, veil, flag
       （屏幕坐标相对层中心 CSS px；flag bit0 = 卡首（与前一 rung 之间是缝，不出切片），
        flag bit1 = 前侧）。切片索引/排序键数组持久复用，避免逐帧 GC。 */
    var fIdx = [], bIdx = [], mixedAt = [];
    function frame(rungs, n) {
      var t0 = performance.now();
      var cx = W / 2, cy = Hpx / 2;
      fIdx.length = 0; bIdx.length = 0; mixedAt.length = 0;
      pickN = 0;
      var k, o, po, flag, sideA, sideB;
      for (k = 1; k < n; k++) {
        o = k * 8;
        flag = rungs[o + 7];
        if (flag & 1) continue;                  /* 卡间缝 / 离屏跳段：不出切片 */
        po = o - 8;
        sideA = rungs[po + 7] & 2; sideB = flag & 2;
        if (sideA || sideB) fIdx.push(k);
        if (!sideA || !sideB) bIdx.push(k);      /* 跨侧切片两边都画（防双画布交界透缝） */
        if (!!sideA !== !!sideB) mixedAt.push(k);
      }
      /* 跨界光环：跨侧切片的相邻切片也两边补画（折角处 2-4px 针孔的焊缝） */
      for (k = 0; k < mixedAt.length; k++) {
        for (var dn = -1; dn <= 1; dn += 2) {
          var kn = mixedAt[k] + dn;
          if (kn < 1 || kn >= n) continue;
          if (rungs[kn * 8 + 7] & 1) continue;
          var sA = rungs[kn * 8 - 8 + 7] & 2, sB = rungs[kn * 8 + 7] & 2;
          if (sA && sB) bIdx.push(kn);           /* 纯前 → 后画布补画 */
          else if (!sA && !sB) fIdx.push(kn);    /* 纯后 → 前画布补画 */
        }
      }
      var byZ = function (a, b) {
        return Math.max(rungs[a * 8 - 3], rungs[a * 8 + 5]) - Math.max(rungs[b * 8 - 3], rungs[b * 8 + 5]);
      };
      fIdx.sort(byZ); bIdx.sort(byZ);
      drawList(bctx, backC, bIdx, rungs, cx, cy, false);
      drawList(fctx, frontC, fIdx, rungs, cx, cy, true);
      stats.slices = fIdx.length + bIdx.length;
      stats.ms = performance.now() - t0;
    }
    function drawList(ctx2, cv, idx, rungs, cx, cy, isFront) {
      ctx2.setTransform(1, 0, 0, 1, 0, 0);
      ctx2.clearRect(0, 0, cv.width, cv.height);
      if (!atlas) return;
      var i, k, o, po;
      for (i = 0; i < idx.length; i++) {
        k = idx[i]; o = k * 8; po = o - 8;
        var ax = (rungs[po + 1] + cx) * dpr, ay = (rungs[po + 2] + cy) * dpr;
        var bx = (rungs[o + 1] + cx) * dpr, by = (rungs[o + 2] + cy) * dpr;
        var e1x = bx - ax, e1y = by - ay;
        /* 竖边取两端平均：把梯形残差对半分给左右缘，交界错位减半 */
        var e2x = ((rungs[po + 3] - rungs[po + 1]) + (rungs[o + 3] - rungs[o + 1])) * 0.5 * dpr;
        var e2y = ((rungs[po + 4] - rungs[po + 2]) + (rungs[o + 4] - rungs[o + 2])) * 0.5 * dpr;
        var len1 = Math.sqrt(e1x * e1x + e1y * e1y);
        if (len1 < 0.001) continue;
        var ovf = Math.min(0.45, OVERLAP / len1);
        var s0 = rungs[po], s1 = rungs[o];
        var sx = s0 * atlasK, sw = (s1 - s0) * atlasK;
        if (sw <= 0) continue;
        ctx2.setTransform(e1x, e1y, e2x, e2y, ax, ay);
        ctx2.drawImage(atlas, sx - sw * ovf, 0, sw * (1 + 2 * ovf), atlasH,
          -ovf, 0, 1 + 2 * ovf, 1);
        var veil = (rungs[po + 6] + rungs[o + 6]) * 0.5;
        if (veil > VEIL_MIN) {
          ctx2.globalAlpha = Math.min(1, veil);
          ctx2.fillStyle = white;
          ctx2.fillRect(-ovf, 0, 1 + 2 * ovf, 1);
          ctx2.globalAlpha = 1;
        }
        if (isFront && pickN < 4096) {           /* 拾取快照（层内 CSS 坐标，含四角+弧长中点） */
          var p = pickN * 9;
          pickBuf[p] = rungs[po + 1] + cx; pickBuf[p + 1] = rungs[po + 2] + cy;
          pickBuf[p + 2] = rungs[o + 1] + cx; pickBuf[p + 3] = rungs[o + 2] + cy;
          pickBuf[p + 4] = rungs[o + 3] + cx; pickBuf[p + 5] = rungs[o + 4] + cy;
          pickBuf[p + 6] = rungs[po + 3] + cx; pickBuf[p + 7] = rungs[po + 4] + cy;
          pickBuf[p + 8] = (s0 + s1) * 0.5;
          pickN++;
        }
      }
      ctx2.setTransform(1, 0, 0, 1, 0, 0);
      ctx2.globalAlpha = 1;
    }

    /* 点-在-凸四边形（四叉积同号，容许两种绕向）；近的画在后 → 从尾向头找首个命中 */
    function pick(lx, ly) {
      var i, p, s = -1;
      for (i = pickN - 1; i >= 0; i--) {
        p = i * 9;
        if (inQuad(lx, ly, pickBuf, p)) { s = pickBuf[p + 8]; break; }
      }
      if (s < 0 || !cards) return -1;
      for (i = 0; i < cards.length; i++) {
        if (s >= cards[i].start && s <= cards[i].start + cards[i].w) return i;
      }
      return -1;
    }
    function inQuad(x, y, b, p) {
      var pos = 0, neg = 0, j, x1, y1, x2, y2, cr;
      for (j = 0; j < 4; j++) {
        x1 = b[p + j * 2]; y1 = b[p + j * 2 + 1];
        x2 = b[p + ((j + 1) % 4) * 2]; y2 = b[p + ((j + 1) % 4) * 2 + 1];
        cr = (x2 - x1) * (y - y1) - (y2 - y1) * (x - x1);
        if (cr > 0) pos++; else if (cr < 0) neg++;
      }
      return pos === 0 || neg === 0;
    }

    return {
      ok: true,
      /* 卡表就位（几何解算后调；bandH 变超 10% 时自动重建 atlas） */
      setBand: function (cardList, H) {
        cards = cardList;
        var changed = !atlas || Math.abs(H - bandH) > bandH * 0.1;
        bandH = H;
        if (changed) rebuildAtlas();
      },
      /* 图片 decode 后逐张升级（调色一次并缓存；atlas 重建直接复用缓存） */
      setCardImage: function (i, img) {
        if (!img || !img.naturalWidth) return;
        var c = document.createElement('canvas');
        c.width = img.naturalWidth; c.height = img.naturalHeight;
        gradeInto(c.getContext('2d', { willReadFrequently: !filterOK }), img, c.width, c.height);
        graded[i] = c;
        if (atlas && cards && cards[i]) blitCard(i);
      },
      hasImage: function (i) { return !!graded[i]; },
      /* 层尺寸/DPR（只在 relayout 调——canvas 重设即清屏，禁逐帧） */
      layout: function (w, h) {
        var d = Math.min(window.devicePixelRatio || 1, 2);
        var dprChanged = d !== dpr;
        dpr = d;
        W = w; Hpx = h;
        var pw = Math.max(2, Math.round(w * dpr)), ph = Math.max(2, Math.round(h * dpr));
        if (backC.width !== pw || backC.height !== ph) { backC.width = pw; backC.height = ph; }
        if (frontC.width !== pw || frontC.height !== ph) { frontC.width = pw; frontC.height = ph; }
        if (atlas && dprChanged) rebuildAtlas();
      },
      frame: frame,
      pick: pick,
      _stats: stats,
      /* 验收辅助：读回一块前/后画布像素（设备 px 坐标） */
      _readback: function (x, y, w, h, which) {
        var ctx2 = which === 'back' ? bctx : fctx;
        return ctx2.getImageData(x, y, w, h);
      },
      _atlas: function () { return { canvas: atlas, k: atlasK, h: atlasH }; }
    };
  }

  window.RibbonRender = { create: create, _filterOK: filterOK };
})();
