# 设计语言与文案规则 — 李文苑 Alnt Med 个人站（2026-07-06 wenxin 式改版）

照老师站 wenxin.design 复刻的**纯静态多页站**：无框架无构建，`config/projects.json` 单一事实源。
旧 React 单页站（「理性的艺术」钴蓝三色版）已整体退役，完整保留在 git 历史（快照 `ba7ebcd`）。

## 色板（灰阶体系 · 钴蓝已退役，全站不再使用 #0047AB）

- 背景：暖白径向渐变 `radial-gradient(ellipse, #FFFBF0 0%, #EAEAEA 53%, #FFFFFF 100%)`（body::before 固定层）
- 灰阶：`#E0E0E0` 边框 › `#D7D7D7` 页脚 › `#BEBEBE` 次要 › `#999` 关键词 › `#6F6F6F` 正文 › `#5F5F5F` header › `#333` 次强调 › `#181818` 标题 › `#000` 仅强调词与方点
- **跳色只落在「点」上，由旧站的色相跳改为明度跳**（灰条黑点）；标题字母永不跳色
- **全站唯一色相跳例外：`--c-accent: #C0392B`**（2026-07-07 英雄区改版引入），只允许落在英雄立方体顶面那枚红方点上（参考图「石上红花」语义），其他任何地方不得使用
- 全部颜色引用 `css/tokens.css` 令牌；插图（SVG 字卡等）同口径

## 品牌编舞（「.IAM. 数据条」语言的延续）

- **Logo**：header 左上角 8 条天际线（IAM_BARS=[.97,.58,1,.66,.9,.52,.74,1]）+ 双黑方点，`js/barmorph.js`；Logo 即回首页按钮
- **Header 布局（2026-07-06 定稿）**：左＝Logo + PROJECTS + AROUND；右＝「李文苑 · ALNT MED」名字 + EN 语言切换 + GitHub 图标（→ github.com/leemenuong-prog）。浮动侧钮只剩右侧 ABOUTME。站名统一「Alnt_med」（`<title>` 口径）
- **启动页**（仅 index，每会话一次 sessionStorage.loaderPlayed）：「I am」→「I alnt med」展开 → 字母冻结成条（I→1 a→3 m→4）→ 飞入左上角 Logo。暖纸底。`js/loader.js`
- **页脚 finale**（index）：「I am ___」五词轮换（Alnt Med / an AIPM / an Architect / a Builder / anything.）→ 灰阶波点带（双层半调+mask 渐隐）→ Logo 从 header 下坠落入 fband-slot（smoothstep 插值，`js/index-fx.js`）
- **中轴进度指示**（用户原创，替代老师站波浪线+圆珠）：竖向数据条轨道 + 随滚动生长的墨色填充（IAM 节奏微调制）+ 作品节点水平分支、标题提亮。**分支必须吸附在某根短横线行上**（看起来是那根短横线在延伸，不能凭空生线），从中轴向左划到**大标题左缘正下方**收在方点。**走过的横线保持伸展态不回缩**（波只在进度头前方做预备）；轨道**头尾都不许压到文字**——尾端止于「尾声」标题上方。**无圆珠**，效果克制
- **页脚 Logo 落底**：下坠进度以「滚动到页面最底」为终点归一化（勿用固定 span——页底永远到不了 1，Logo 会悬在半空）
- **品牌条尺寸走 `--bb-*` 令牌**（barmorph.css：`--bb-h/--bb-bar/--bb-gap/--bb-dot`，默认=header 档 69×22）。**放大场景一律换令牌原生渲染，禁 transform scale 放大**（合成层按原生栅格化再放大必糊）。页脚落槽档 `.brandband--footer`：桌面 96px 高 / 总宽 360（3.75:1，比 header 档更横长），平板 72、手机 56；fly-band 飞行全程只缩小、落底 scale=1 像素完美。极窄屏（≤374）header 条切 18px 小档
- **页脚站内导航 `.foot-nav`**（PROJECTS / AROUND / ABOUTME）：<1024 无侧钮时的 ABOUTME 唯一入口，桌面同显为站点地图；注意选择器用 `.site-footer .foot-nav a`（同权重会被后文 `.site-footer a` 按顺序压掉）
- BarWord（词从条中解码）保留在 about 页标题；方块句点 `.psq` 永远直角

## 版式基准（老师站实证规格）

- **大标题字体铁律（用户裁定 2026-07-07）**：所有页级大标题一律 Monterey（`var(--font-display)`）——首页英雄标题、projects 页标题、**详情页 `.detail-title`**、主线卡标题；中文按栈回退宋体。章节 h2 与正文保持衬线，不得把详情页大标题改回 Georgia。
- hero（英雄区，2026-07-07 motionsites eco-intelligence 式改版）：近全视口舞台三层——巨大 `LI WENYUAN` 垫底 z1 → 立方体台 z2 压字 → 贴底行 z3（左 intro 两行小字+kick 11px；右精选面板 <1024 隐藏）。大字规格：h1 内层 `.hero-name-text` Monterey 400、`calc(clamp(64px,13vw,264px) × --hero-fit)`（`fitHeroName()` JS 拟合到 ≈92vw，挂 refresh/resize/fonts.ready/RO 防抖四处）、#D7D7D7、全断点一行 nowrap；**不加下划线**（Monterey 下划线规则只管行级标题，不适用品牌图形层）；**双语均拉丁**不参与翻译（同 loader/header 先例），中文身份由 aria-label + intro 首行承载。入场编舞挂 `html.loading` 冻结第 0 帧、条落 Logo 后梯次起跑（大字 heroNameIn → 立方体 +.35s → intro +.55s → aside +.7s）；**transform 分层铁律**：入场动画在 h1/.polygon-container、视差在 .hero-name-text/.cube-rig、bob 在 .cube-bob、拖拽在 #cube，互不抢
- 立方体重量感体系（index-fx.js 单一 render 循环，dt 归一保 60/120Hz 同速）：自转 3°/s（一圈≈2min）· 拖拽增益 .22 + 松手惯性（vel≤3°/帧、摩擦 .95/帧 ≈1.2s 归稳）· bob 7s/7px（手机 8s/3px）与接触影**同相呼吸**（升→影淡+散、降→影浓+紧，JS 同驱勿改 CSS 动画）· 六面 Lambert 光照遮罩 `.face-shade`（光源左上前 norm(-.35,-.75,.55)、上限 .16、顶面恒最亮）· 面棱线 `rgba(24,24,24,.22)` + inset 上高光/下暗角 · 缩略图统一 `saturate(.85) contrast(1.03)` · 鼠标视差（hover+fine 才启用：rig ±14/10px、大字反向 ±8/5px、拖拽期间冻结目标）；尺寸：桌面 `--cube-size: min(500px,36vw,52svh)`、平板 `min(360px,44vw)`、≤767 260px、≤479 230px，台高一律 `calc(--cube-size × 1.35)`；红方点 `.cube-dot` 贴顶面随体转（3D 定位在本体由 layoutFaces 重算防飘位，生长动画只动 ::before）；reduced-motion 保静态光照/定格影/红点/材质，砍全部运动
- 主线卡**不左右交替**：文字恒左（列内居中）、图恒右；封面 360 方图、无边框、圆角 4px；文字列**居中收拢**（justify-content:center + 30px 簇间距，禁 space-between 把标题/正文撑到两端）；作品间距 `--mainline-gap: 320px`（老师页实证的呼吸感）
- 揭示层：`assets/project/{id}/float/1.jpg`，clip-path 圆随鼠标显影——**素描版封面（thumbnails/2 位）由用户 ComfyUI 管线后续产出替换**；尾声（建筑）揭示层是横构图版面 → `object-fit: contain` 白底整页收进框，**禁 cover 拦腰裁半**
- **尾声建筑卡 = 3:2 横构图**（建筑渲染都是横图，方图裁到看不见内容——用户裁定）：封面 = 母版首页主渲染 3:2 满幅裁（960×640，无白边无页面装饰）；主线 AI 卡保持 360 方图
- **立方体面必须实底白**（var(--c-white)）——透明 PNG 封面（梨/拼图）会透出对面；六面=Pears/Co-work/议见/环世界/风贯立方/品牌 SVG（UABB 魔方图不上立方体，用户裁定）
- 建筑翻页图（content/）一律取**母版完整版面（带页边白）**，不做去白边裁切——上桥曾因裁掉顶部白边与其他五作不一致（2026-07-06 已重导）
- 详情页：Monterey 大标题+↗ → 斜体开场段（左对齐引线）→ 章节 h2（衬线）+通栏细线 → 「—」列表（行首「标签：」≤10 字自动加粗）→ 小型大写技术栈 → 白卡图版容器+图注+文字球
- 字体：MontereyFLF woff2×3（拉丁 unicode-range，中文落系统栈）+ Garamond/Georgia 衬线

## 移动端与触屏（2026-07-07 定稿）

- **断点体系**：`1023 / 767 / 479 / 374` 四档递进（374 只管 header 极窄收纳）。中轴进度条与侧钮 <1024 隐藏是设计决定，勿做移动替代。
- **safe-area**：六页 viewport meta 带 `viewport-fit=cover`；tokens 层 `--safe-*` 四令牌 + `--header-h: calc(70px + var(--safe-top))` 一次性兜底，header/footer/modal/侧钮全部 env() 补偿。桌面预览 env()=0，刘海效果需真机复核。
- **触屏热区 pattern**：`@media (pointer:coarse),(max-width:1023px)` 下用 `::after` 伪元素 `max(100%,44px)` 扩热区（不可见/不占布局/不改设计稿）；落点 `.text-ball`、`.media-cta a`、`.modal-close`、`.about-bio li a`。可见块级目标（返回钮/门面钮/列表行）直接真实达标 ≥44。
- **立方体触屏**：`touch-action: pan-y`（竖划归页面滚动，横向起手归拖拽）；面变换 `layoutFaces()` 在 resize 重算（否则横竖屏切换会散架）。
- **⚠️ 横向溢出防线在 body**（`overflow-x: hidden; overflow-x: clip`）——**绝不能放 html**：html 上的 clip 会把整页竖向滚动一起钳死（Chrome 实测）。装饰层禁止横向负 inset 出血。
- **vh 一律双写 svh**（`height: Xvh; height: Xsvh;` 回退行在前），防 iOS 地址栏收放抖动。
- 尾声网格：767 两列（gap 28/20）→ 479 单列满幅；详情页 479 档白卡 `margin-inline:-12px` 回收页边（与 `.container` 的 `100%-48px` 强耦合）。

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
