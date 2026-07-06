#!/usr/bin/env bash
# AI 作品集 · PDF 导出管线
# headless Chrome 打印 ai-portfolio/ → 母版归档 源文件/AI作品集/ → 直接拷贝入库 uploads/portfolio-ai.pdf
#
# ⚠️ 不要用 ghostscript 压缩:gs pdfwrite 会把 CSS 渐变/阴影的透明度(soft mask)拍扁,
#    半透明条纹变成满强度色块(2026-07 打样实证,PDF 1.5/1.7 均复现)。
#    体积控制靠「素材 JPEG 入库前压到 ≤300KB」;Chrome 嵌入 JPEG 不再转码。
set -euo pipefail

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MASTER_DIR="$ROOT/../源文件/AI作品集"
MASTER="$MASTER_DIR/portfolio-ai-master.pdf"
OUT="$ROOT/uploads/portfolio-ai.pdf"
PORT=8140

mkdir -p "$MASTER_DIR"

python3 -m http.server "$PORT" --directory "$ROOT" >/dev/null 2>&1 &
SRV=$!
trap 'kill $SRV 2>/dev/null || true' EXIT
sleep 1

"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --no-pdf-header-footer \
  --virtual-time-budget=20000 \
  --force-color-profile=srgb \
  --print-to-pdf="$MASTER" \
  "http://localhost:$PORT/ai-portfolio/index.html" 2>/dev/null

cp "$MASTER" "$OUT"

# 页数统计:路径含中文/emoji 会破坏 PostScript 字符串,cd 后用相对文件名
PAGES=$(cd "$(dirname "$OUT")" && gs -q -dNODISPLAY -dNOSAFER -c "(portfolio-ai.pdf) (r) file runpdfbegin pdfpagecount = quit" 2>/dev/null || echo "?")
SIZE_MB=$(du -m "$OUT" | cut -f1)
echo "pages: $PAGES"
du -h "$MASTER" "$OUT" | awk '{print $2": "$1}'
if [ "$SIZE_MB" -gt 15 ]; then
  echo "⚠️  超出 15MB 预算——去压 ai-portfolio/assets/img/ 的源 JPEG(质量/尺寸),不要用 gs 压 PDF"
fi
