# 设计语言规则 — Alnt Med · The Art of Rationality

确定稿设计语言：**跳动的数据条**（`rational/barmorph.*` 的「字⇄条」体系）。
条 = 编码态（Logo 的天际线节奏），字 = 解码态，蓝色方块 = 句点（自我）。
所有新增视觉必须沿用此语言，不得引入新的图形母题。

## 跳色点缀规则（重要）
点缀色**只放在「点」上，永远不要给标题字母跳色**。

1. 所有大标题以方块句点收尾：BarWord 自带 `.bmp`；纯文本标题用行内 `.psq`。
2. 句点颜色统一取 `var(--acc)`，随章节底色（body[data-tone]）翻转，
   原则是「与字色形成跳色」：
   - `paper` 纸色底（字为墨色）→ 钴蓝 `--blue`
   - `blue` 钴蓝底（字为纸色）→ 深蓝 `--blue-dn`（`#002a66`）。跳色始终是「更深的同色系」而非黑：
     白字在蓝底上，点用更深的蓝，不用墨色。
   - `ink` 墨色底（字为纸色）→ 亮蓝 `--blue-up`
3. 例外——「条上的点」：Logo 带（`.brandmorph` 的 `.bsq/.bdot`）、迷你数据条
   （`.bband .sq`）、时间柱自我方块（`.bc-self`）以墨色条为底，
   故在钴蓝底上翻转为 paper，其余同上。它们是 Logo 的延伸，保持现状。

## 色板与字
- 仅 cobalt `#0047AB` / ink `#0b0b0e` / paper `#efece6`（+ 亮蓝 `--blue-up`、深蓝 `--blue-dn`），不引入新色。
- 大标题 weight 800、紧 letter-spacing，词从条中「解码」升起（BarWord）。
- 价格/编号/注释用 JetBrains Mono；中文为辅注（.zh）。
