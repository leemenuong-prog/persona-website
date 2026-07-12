#!/usr/bin/env bash
# 图片 WebP 变体生成管线（2026-07-13 大陆手机端提速）
# JPEG 源 → 同尺寸 {base}.webp + 限宽 {base}.w{480,800,1200}.webp；丝带另出 {id}.m.webp（限高 256）。
#   · 源文件一律不动（tests 守卫 assets/ribbon/*.jpg 存在性；运行时 onerror 也回退原 JPEG）
#   · 限宽档对每个源无条件产出——源不够宽就同尺寸编码，绝不放大（保证 js/img-util.js 阶梯选档零 404）
#   · 幂等：目标比源新则跳过；换图重跑只补该图变体
#   · 不碰 .webp/.svg/.png 源（pears/meco 透明 WebP 缩略图保 alpha）；唯一 PNG 例外见文末
# 依赖：cwebp（brew install webp）、sips（macOS 自带）
set -euo pipefail

CWEBP="$(command -v cwebp || echo /opt/homebrew/bin/cwebp)"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

made=0; skipped=0; warned=0

width_of() { sips -g pixelWidth "$1" 2>/dev/null | awk '/pixelWidth/{print $2}'; }

# gen <src> <dst> <resize-args...>（空=同尺寸）
gen() {
  local src=$1 dst=$2; shift 2
  if [ -f "$dst" ] && [ "$dst" -nt "$src" ]; then skipped=$((skipped+1)); return 0; fi
  "$CWEBP" -quiet -m 6 -metadata none "$@" "$src" -o "$dst"
  made=$((made+1))
  if [ "$(stat -f%z "$dst")" -ge "$(stat -f%z "$src")" ]; then
    echo "⚠️  变体比源大（保留但值得复查）: $dst"
    warned=$((warned+1))
  fi
}

# 一个 JPEG 源的整套变体：同尺寸 + 三档限宽（源不够宽的档=同尺寸编码，防 404）
# ⚠️ macOS bash 3.2：local 多变量同行声明时后面的展开拿不到前面刚赋的值——必须拆行
suite() { # suite <src.jpg> <q_full> <q_capped>
  local src=$1 qf=$2 qc=$3
  local base="${src%.*}"
  local w
  w="$(width_of "$src")"
  gen "$src" "$base.webp" -q "$qf"
  for N in 480 800 1200; do
    if [ "$w" -gt "$N" ]; then
      gen "$src" "$base.w$N.webp" -q "$qc" -resize "$N" 0
    else
      gen "$src" "$base.w$N.webp" -q "$qc"
    fi
  done
}

echo "== 丝带封面（桌面 .webp q82 + 手机 .m.webp 限高256 q80）=="
for f in assets/ribbon/*.jpg; do
  gen "$f" "${f%.jpg}.webp" -q 82
  gen "$f" "${f%.jpg}.m.webp" -q 80 -resize 0 256
done

echo "== 卡片缩略图 =="
for f in assets/project/*/thumbnails/*.jpg; do suite "$f" 80 80; done

echo "== 详情/建筑内容图版（2200px 大图）=="
for f in assets/project/*/content/*.jpg; do suite "$f" 80 78; done

echo "== 悬浮揭示层 =="
for f in assets/project/*/float/*.jpg; do suite "$f" 80 80; done

echo "== 作品集截图 =="
find assets/portfolio -name '*.jpg' | while read -r f; do suite "$f" 80 80; done

echo "== works 视频海报 =="
for f in works/*.jpg; do suite "$f" 80 80; done

echo "== uploads 人像（about 静态 img + portfolio 个人页共用）=="
for f in uploads/*.jpg; do suite "$f" 80 80; done

echo "== xtool 门面海报（唯一 PNG 例外：摄影内容误存 PNG）=="
gen xtool/screenshots/poster-team-time.png xtool/screenshots/poster-team-time.webp -q 80

# while 子 shell 吞计数，清单直接以文件系统为准
total_n=$(find assets works uploads xtool/screenshots -name '*.webp' | wc -l | tr -d ' ')
total_kb=$(find assets works uploads xtool/screenshots -name '*.webp' -exec du -k {} + | awk '{s+=$1} END {print s}')
echo ""
echo "✅ 变体总计: ${total_n} 个 .webp / ${total_kb}KB（本次新生成 ${made}+，跳过 ${skipped}+，警告 ${warned}+；find 计数含子 shell 内产出）"
