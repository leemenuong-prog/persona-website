# 设计语言与文案规则 — 李文苑 Alnt Med 个人站（2026-07-06 wenxin 式改版）

照老师站 wenxin.design 复刻的**纯静态多页站**：无框架无构建，`config/projects.json` 单一事实源。
旧 React 单页站（「理性的艺术」钴蓝三色版）已整体退役，完整保留在 git 历史（快照 `ba7ebcd`）。

## 色板（灰阶体系 · 钴蓝已退役，全站不再使用 #0047AB）

- 背景：暖白径向渐变 `radial-gradient(ellipse, #FFFBF0 0%, #EAEAEA 53%, #FFFFFF 100%)`（body::before 固定层）
- 灰阶：`#E0E0E0` 边框 › `#D7D7D7` 页脚 › `#BEBEBE` 次要 › `#999` 关键词 › `#6F6F6F` 正文 › `#5F5F5F` header › `#333` 次强调 › `#181818` 标题 › `#000` 仅强调词与方点
- **跳色只落在「点」上，由旧站的色相跳改为明度跳**（灰条黑点）；标题字母永不跳色
- 全部颜色引用 `css/tokens.css` 令牌；插图（SVG 字卡等）同口径

## 品牌编舞（「.IAM. 数据条」语言的延续）

- **Logo**：header 右上角 8 条天际线（IAM_BARS=[.97,.58,1,.66,.9,.52,.74,1]）+ 双黑方点，`js/barmorph.js`
- **启动页**（仅 index，每会话一次 sessionStorage.loaderPlayed）：「I am」→「I alnt med」展开 → 字母冻结成条（I→1 a→3 m→4）→ 飞入右上角 Logo。暖纸底。`js/loader.js`
- **页脚 finale**（index）：「I am ___」五词轮换（Alnt Med / an AIPM / an Architect / a Builder / anything.）→ 灰阶波点带（双层半调+mask 渐隐）→ Logo 从 header 下坠落入 fband-slot（smoothstep 插值，`js/index-fx.js`）
- **中轴进度指示**（用户原创，替代老师站波浪线+圆珠）：竖向数据条轨道 + 随滚动生长的墨色填充（IAM 节奏微调制）+ 作品节点水平分支指向标题、标题提亮。**无圆珠**，效果克制
- BarWord（词从条中解码）保留在 about 页标题；方块句点 `.psq` 永远直角

## 版式基准（老师站实证规格）

- intro：Monterey 24px/500 + `text-decoration: underline`，三档分词色（#6F6F6F / #000 / #BBB）
- 主线卡**不左右交替**：文字恒左（列内居中）、图恒右；封面 360 方图、无边框、圆角 4px
- 揭示层：`assets/project/{id}/float/1.jpg`，clip-path 圆随鼠标显影——**素描版封面（thumbnails/2 位）由用户 ComfyUI 管线后续产出替换**
- 详情页：大衬线标题+↗ → 斜体开场段（左对齐引线）→ 章节 h2+通栏细线 → 「—」列表（行首「标签：」≤10 字自动加粗）→ 小型大写技术栈 → 白卡图版容器+图注+文字球
- 字体：MontereyFLF woff2×3（拉丁 unicode-range，中文落系统栈）+ Garamond/Georgia 衬线

## 数据与素材约定

- 加作品 = projects.json 加一条 + `assets/project/{id}/{thumbnails,float,content}/` 放图，零代码
- 媒体：`video-local` / `iframe-lazy` 一律门面点击才加载；视频 ffmpeg H.264 crf26 `+faststart` <30MB，原片留 `../源文件/`
- 资产文件名全小写（GH Pages 大小写敏感）；`annotations` 图注内联 JSON（图右下 12px 文字球）

## 作品集文案规则（用户定稿 2026-07-06，中英通用，写任何项目介绍必须遵守）

**结构（固定章节，顺序不变）**：产品自我介绍（一句话）→ 先说结论 · The Short Version → 为什么做这个 · Why → 核心贡献 · Key Contributions → 系统如何运作 · How It Works → 影响与意义 · Impact → 技术栈 · Stack。

- **开场 = 产品自我介绍**：只有一句话，以作品第一人称开口（「你好，我是 Meco 🍄‍🟫……」）。这是全文唯一一处产品视角，其余章节全部是文苑第一人称（文苑是男性，用「他」）。
- **STAR 藏在结构里，不外露**：「先说结论」四条 = 完整 STAR（处境→要解决什么→做了什么→结果），只看这段也能懂全貌；Why=S+T，核心贡献+系统如何运作=A，影响与意义=R。**禁止出现 S/T/A/R 字样或标签**。
- **标题口径**：用「系统如何运作 / How It Works」这个清晰度级别——一眼知道这段讲什么。不用说明书腔黑话（「可行性路径」），也不用过于口语的模糊标题（「当时卡在哪」）。
- **语气基线**：第一人称，平视，不张扬也不自卑。一个人做的就写「一个人做的」；不用「业界领先/颠覆」，也不贬成「小玩具」。技术词降噪成人话（「乐观锁」→「防止重复投票」），但保留能体现判断力的关键决策（「只读白名单」「单进程」「SSOT 只读」）。
- 字段映射：one_liner=产品自我介绍 · tldr=先说结论 · why_built=为什么做这个 · key_contributions · how_it_works · why_it_matters=影响与意义 · tech_stack。
- 老铁律沿用：页面永不解说系统机制；奖项「奖名 · 中文等级」两段式；产品名 Pears / Co-work（勿写 Pear/PeersWork/XTOOL Agent Platform）。

## 部署（不变）

改完 commit + `git push origin main` → GitHub Actions 自动部署 Netlify `alnt-med`。**不要**脱离仓库手动 `netlify deploy`。
本地预览必须 HTTP：`python3 -m http.server 8080`（Claude Code 用预览配置 persona-site:8099）。
