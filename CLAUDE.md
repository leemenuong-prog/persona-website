# 设计语言规则 — Alnt Med · The Art of Rationality

确定稿设计语言：**跳动的数据条**（`rational/barmorph.*` 的「字⇄条」体系）。
条 = 编码态（Logo 的天际线节奏），字 = 解码态，蓝色方块 = 句点（自我）。
所有新增视觉必须沿用此语言，不得引入新的图形母题。

## 章节流与作品画廊（2026-07-06「作品为主角」改版 · 现行结构）
- **章节流**：Hero → Whoami（两身份 01 AIPM / 02 Architect）→ **WorksGallery（作品前置，全站主角）** → AIPM 章（`ChAipmOpen` 开场 + `IntroPears`/`IntroCowork`/`IntroYijian`/`IntroMeco` 四段介绍）→ Architect 章（`ChArch` 开场 + `IntroUabb` 多模态 / `IntroArchfolio` 作品集）→ Contact。渲染队列在 `app.jsx`。
- **身份合并两组**：原 Developer 章并入 AIPM；`WHO_INDEX` 两项、`who-tag`、Contact finale ids 都是两身份口径。改身份数须同步这几处 + `app.jsx` 渲染队列。
- **作品画廊**（`.gw-*`，`WorksGallery`/`GalleryCard`/`CoverArt`）：六竖卡 3:4 网格墙（桌面 3×2，≤900/≤600 均 2 列）；卡自带三色底 **cobalt·ink·paper / paper·ink·cobalt 对角排布**；进场「聚拢→散开」用 `data-ob="self"` 一次性 reveal（零引擎代码，CSS transition + nth-child 位移）；点整卡 `jump(wk.introId)` 滚到介绍锚点。正式封面未上传前用 `CoverArt` 程序化 SVG 占位（线用 `var(--cardfg)` 随卡底翻色、句点用 `var(--cardacc)`）；上线正式封面 = 给该卡加 `heroCover` 图片路径。
- **数据**：`WORKS` 六卡（`key`/`introId`/`group`/`status`/`heroCover` + 原字段）；建筑四作整组存 `ARCH_WORKS` 供翻书；章内 CTA lookup 一律按 `w.key`。
- **品牌带三拍**：hero 槽 → nav dock → contact 页脚。旧 phase W（8 条⇄8 作品天际线交接、`__wkOpen`）已随 crossfade 卡组退役，勿加回。
- **建筑作品集收尾**：`IntroArchfolio` 末尾「logo 天际线展开成四作排列」（`.af-*`：四条 = 四作 + 蓝方块句点）——设计语言的收束，勿改成别的母题。
- **章节大标题静态化**：BarWord 传 `static`（直显不再字⇄条解码），外层套 `.rv-soft`（极轻 14px 淡入）；保留方块句点。**唯一例外 = Hero 的 `I am` loader 飞条动画，不动**。品牌带 / `BarBand` / `BarChrono` 的字⇄条不受影响。
- **圆角坡道**（`base.css` 令牌）：出血软纸片 24 › 媒体对象/画廊卡 20 › 按钮 `--r-btn:12` › 小件 `--r-btn-sm:10` › **方块句点 0（永远直角）**。按钮圆角化后方点（`.psq`/`.sq`/pips）仍直角。`.reel-nav` ‹ › 透明字形不加底色不加圆角（历史教训）。
- **底部波点** `.fdots`（Contact 内）：半调渐隐钴蓝点（跳色只落点），顶部 mask 渐隐、底部最浓接住 Logo 收尾；一次性淡入不响应滚动。
- **介绍页密度 v2**：`.apx-*` 全面收紧（标题 clamp(46,5.6vw,92)、正文行高 1.75/max-width 30em 等）；`.apx-compact` 给 Pears/Co-work 多对页再收一档；新介绍章用 `IntroShell` 轻模板（kicker→标题→`.apx-meta`→导语→`.intro-media`→数据条+CTA）。

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

## 介绍层软语法（作品介绍「三大页」· 杂志对页模板，2026-07 用户选定）
作品介绍章（现 AIPM/Co-work，后续多作品复用）走**杂志对页**子语言，Logo/导航/方点仍硬朗直角：
- 三个 spread：P1 左文右图（图版右出血）· P2 镜像拉页（左出血）· P3 压轴影片 + 刊末条 + CTA
- 超大衬底页码（`--ghost` 6% 墨 · clamp(300px,34vw,520px)）出血咬合标题；`overflow-x: clip` 收边
- 「软纸片」图版：`--ghost` 底 + 24px 大圆角 + 出血侧圆角归零 + 无描边无投影（印刷色版，非浮卡）
- 示意图 = 圆头线 SVG 信息图：`stroke-linecap:round`、粗细对比（7/2.25）、圆环站点、圆头 chevron、
  线逐笔画出（`.draw` + pathLength=1 + `--d` 延迟）、节点后弹（`.pop`）、蓝点 spline 到站减速
- 示意图**每板两个版本**：桌面横版 `.apx-dk` + 手机竖版 `.apx-ph`（≤600 由 CSS 切换）——
  横版 960 宽缩到手机后文字只剩 ~6px，竖版按 375px 宽重排字号；元素要对齐成网格，
  不做「刻意参差」；图内不放系统提示文字（点选重看类），巡回只用小蓝点（带停顿节拍）
- 跳色仍只落「点」：句点方块、「交付」直角蓝块（全图唯一直角=蓝色句点）、巡回蓝点、CTA；数字墨色
- 影片管线不可动：`.apx-video`/`.apx-video-loading` 类名与层级（useApxFilm 依赖）、≤900 tap-to-play
- 复用：换 APX_INTRO_PAGES 文案 + 两张 SVG 内容 + APX_STATS 即可套到新作品

## 语言规范（全站文案口径）
- **分层制**：操作类标签（CTA / 按钮 / 播放 / 复制 / 翻页提示）一律 `中文 · ENGLISH`；
  结构注释类（章节 kick、取景框标签、图注）一律 `ENGLISH · 中文` 或 `NN · ENGLISH / 中文`。两层内部各自严格统一。
- **口吻**：中文是唯一正文层——Whoami / 身份章 / AI 四作（W·05–08）第一人称叙事；
  建筑四作（W·01–04）图录式。英文一律一句话点缀（身份章 `.en` / 作品卡 `wf-body`），不写长段。
- **奖项**：卡片右下角「奖名 · 中文等级」两段式；不写英文等级、百分比、题材词。
- **术语**：产品名 **Pears**（勿写 Pear / PeersWork）；平台名 **Co-work**（勿写 Pear Agent / XTOOL Agent Platform）。
- 页面永不解说系统机制（自动播放 / 默认静音 / 自动翻页等）；操作可供性标签（点击播放、点选回看）保留。
