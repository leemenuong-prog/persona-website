# 设计语言与文案规则 — 李文苑 Alnt Med 个人站（2026-07-06 wenxin 式改版）

照老师站 wenxin.design 复刻的**纯静态多页站**：无框架无构建，`config/projects.json` 单一事实源。
旧 React 单页站（「理性的艺术」钴蓝三色版）已整体退役，完整保留在 git 历史（快照 `ba7ebcd`）。

## 色板（灰阶体系 · 钴蓝已退役，全站不再使用 #0047AB）

- 背景：暖白径向渐变 `radial-gradient(ellipse, #FFFBF0 0%, #EAEAEA 53%, #FFFFFF 100%)`（body::before 固定层）
- 灰阶：`#E0E0E0` 边框 › `#D7D7D7` 页脚 › `#BEBEBE` 次要 › `#999` 关键词 › `#6F6F6F` 正文 › `#5F5F5F` header › `#333` 次强调 › `#181818` 标题 › `#000` 仅强调词与方点
- **跳色只落在「点」上，由旧站的色相跳改为明度跳**（灰条黑点）；标题字母永不跳色
- ~~红方点点缀~~已废（2026-07-07 当日用户裁定去掉，效果不好）：全站回到纯灰阶，**不再有任何色相跳**，`--c-accent` 令牌已删除
- 全部颜色引用 `css/tokens.css` 令牌；插图（SVG 字卡等）同口径

## 品牌编舞（「.IAM. 数据条」语言的延续）

- **Logo**：header 左上角 8 条天际线（IAM_BARS=[.97,.58,1,.66,.9,.52,.74,1]）+ 双黑方点，`js/barmorph.js`；Logo 即回首页按钮
- **Header 布局（2026-07-06 定稿）**：左＝Logo + PROJECTS + AROUND；右＝「李文苑 · ALNT MED」名字 + EN 语言切换 + GitHub 图标（→ github.com/leemenuong-prog）。浮动侧钮只剩右侧 ABOUTME。站名统一「Alnt_med」（`<title>` 口径）
- **启动页**（仅 index，每会话一次 sessionStorage.loaderPlayed）：「I am」→「I alnt med」展开 → 字母冻结成条（I→1 a→3 m→4）→ 飞入左上角 Logo。暖纸底。`js/loader.js`
  - **合成器铁律（2026-07-07 三迭代，修卡顿）**：加载页动画只准用 transform/opacity/clip-path，**禁 max-width/top/left/width/height 等布局属性**——开屏时主线程正忙于建立方体/画廊/字体回流，布局动画会被抢帧卡壳。名字展开=ins 用 `clip-path inset` 从右揭示 + `.tail` 用 translateX 让位 + reveal translateX 回中，三者 .7s 同曲线锁相（loader.js 量 ins 宽写初始位移）；morph 条：rise 用 `scaleY`（origin 底中）、fly 用 `translate+scale`（同底中原点映射源盒→header 条位，两段过渡连续）
- **页脚 finale**（index，2026-07-07 用户裁定简化）：「I am ___」五词轮换（Alnt Med / an AIPM / an Architect / a Builder / anything.）后**直接接 site-footer**——波点带与「Logo 从 header 下坠落槽」编舞已整体删除（fdots / fband-slot / fly-band / tickFinale 均不复存在，勿恢复）
- **中轴进度指示**（用户原创，替代老师站波浪线+圆珠）：竖向数据条轨道 + 随滚动生长的墨色填充（IAM 节奏微调制）+ 作品节点水平分支、标题提亮。**分支必须吸附在某根短横线行上**（看起来是那根短横线在延伸，不能凭空生线），从中轴向左划到**大标题左缘正下方**收在方点。**走过的横线保持伸展态不回缩**（波只在进度头前方做预备）；轨道**头尾都不许压到文字**——尾端止于「尾声」标题上方。**无圆珠**，效果克制
- **品牌条尺寸走 `--bb-*` 令牌**（barmorph.css：`--bb-h/--bb-bar/--bb-gap/--bb-dot`，默认=header 档 69×22）。**放大场景一律换令牌原生渲染，禁 transform scale 放大**（合成层按原生栅格化再放大必糊）。`.brandband--footer` 大档令牌保留在 barmorph.css 备查（页脚落槽已删，现无使用场景）。极窄屏（≤374）header 条切 18px 小档
- **页脚站内导航 `.foot-nav`**（PROJECTS / AROUND / ABOUTME）：<1024 无侧钮时的 ABOUTME 唯一入口，桌面同显为站点地图；注意选择器用 `.site-footer .foot-nav a`（同权重会被后文 `.site-footer a` 按顺序压掉）
- BarWord（词从条中解码）保留在 about 页标题；方块句点 `.psq` 永远直角

## 版式基准（老师站实证规格）

- **大标题字体铁律（用户裁定 2026-07-07）**：所有页级大标题一律 Monterey（`var(--font-display)`）——首页英雄标题、projects 页标题、**详情页 `.detail-title`**、主线卡标题；中文按栈回退宋体。章节 h2 与正文保持衬线，不得把详情页大标题改回 Georgia。
- hero（英雄区，2026-07-07 motionsites eco-intelligence 式改版 + 当日二迭代）：近全视口舞台三层——巨大 `LI WENYUAN` 垫底 z1 → 立方体台 z2 压字 → 贴底行 z3（左 intro；右精选面板 <1024 隐藏）。大字规格：h1 `top: clamp(12px,6vh,56px)` **偏上方**；内层 `.hero-name-text` Monterey 400、`calc(clamp(64px,13vw,264px) × --hero-fit)`（`fitHeroName()` JS 拟合到 ≈92vw，挂 refresh/resize/fonts.ready/RO 防抖四处）、全断点一行 nowrap；**颜色=距离渐变**（用户裁定：离立方体越远越清晰）——`background-clip:text` 横向渐变 `#6F6F6F 0% → #999 26% → #BEBEBE 42% → #D7D7D7 50%（中心最淡）→ 镜像`，全取灰阶令牌梯勿引编外灰；**立方体只遮大字下段 ≈40%**（`polygon-container margin-top: clamp(32px,11vh,110px)` 控制，字上半必须清晰可读）；**不加下划线**；**双语均拉丁**不参与翻译，中文身份由 aria-label + intro 承载。贴底行排版三级（用户裁定「该轻的轻该重的重」）：kick 10px/.42em/#999 最轻 → `.intro-title` clamp(20px,1.9vw,27px)/#181818/强调词 700 黑最重 → `.intro-sub` clamp(13px,1.05vw,15px)/#999 轻（关键词 `.k` #333/500）；**intro 不再用下划线**。入场编舞挂 `html.loading` 冻结第 0 帧、条落 Logo 后梯次起跑（大字 → 立方体 +.35s → intro +.55s → aside +.7s）；**transform 分层铁律**：入场动画在 h1/.polygon-container、视差在 .hero-name-text/.cube-rig、bob 在 .cube-bob、拖拽在 #cube，互不抢
  - **手机档三段式（≤767，四迭代用户裁定「大字在上·立方体在中·贴底行沉底」）**：`.hero { justify-content: center }` 让立方体（唯一流内元素）垂直居中；`.polygon-container { margin-top: 0 }`（否则 base 的 11vh margin 叠加会把立方体推离正中）；大字保持 base `top:clamp` 在顶部（**勿**把大字也居中，会变成大字压立方体）；`.hero-foot` 改 `position:absolute; bottom:0`（脱流沉底，替掉 margin-top:auto，否则空白全堆到立方体下方把它顶到顶部）。桌面档不动（margin-auto 沉底 + polygon margin-top:clamp 已定稿）
- 立方体重量感体系（index-fx.js 单一 render 循环，dt 归一保 60/120Hz 同速）：自转 3°/s（一圈≈2min）· 拖拽增益 .22 + 松手惯性（vel≤3°/帧、摩擦 .95/帧 ≈1.2s 归稳）· bob 7s/7px（手机 8s/3px）与接触影**同相呼吸**（升→影淡+散、降→影浓+紧，JS 同驱勿改 CSS 动画）· 六面 Lambert 光照遮罩 `.face-shade`（光源左上前 norm(-.35,-.75,.55)、上限 .16、顶面恒最亮）· 面棱线 `rgba(24,24,24,.22)` + inset 上高光/下暗角 · 缩略图统一 `saturate(.85) contrast(1.03)` · 鼠标视差（hover+fine 才启用：rig ±14/10px、大字反向 ±8/5px、仅**拖拽**时冻结目标）· **悬浮不影响立方体运动铁律（五迭代用户裁定）**：指针悬在 cube-vp 上时自转/bob/视差**照常跑**，**勿**再加"悬浮停转"（曾为压制揭示闪加过，用户明确不要）；尺寸：桌面 `--cube-size: min(460px,34vw,50vh)`（**勿用 svh**——自定义属性无双写回退，旧 Safari 整条失效塌立方体）、平板 `min(360px,44vw)`、≤767 260px、≤479 230px，台高一律 `calc(--cube-size × 1.35)`；reduced-motion 保静态光照/定格影/材质，砍全部运动
- **🚫 揭示/hover 动效防闪总则（六迭代定死，凡做 hover 显图/揭示一律遵守，别再逐个踩坑）**：
  1. **只动 `opacity` / `transform`**（合成器线程，任何浏览器含微信 webview 都不闪）；
  2. **mask/clip-path 必须静态**——绝不用 JS 逐帧改 `mask-image`/`clip-path` 的**半径或圆心**（每帧改=主线程连续重绘，移动端/微信 webview 必闪。这是反复被报"还闪"的总根源）；
  3. **不在 hover 时动态挂 `will-change`**（提层那帧漏 mask 整图闪一下）；
  4. **旋转/3D 物体绝不逐面/逐子元素绑 `pointerenter/leave`**（投影重叠时命中面高频切换=振荡闪）——改绑稳定不旋转的容器级 hover。
- **落地（两条路径均遵上则）**：
  - **卡片（画廊 + 主线，平面 2D）`.layer-reveal`**：**纯 CSS** `:hover` 交叉淡入——`opacity 0→1` + `transform: scale(.9)→scale(1)`（从小长大），边缘柔和由**静态** `radial-gradient(ellipse 78% 78% …)` mask 一次成型。**无 JS、无 rAF、无光标跟随**（`attachReveal`/`bindReveal` 已删）。
  - **立方体面（旋转 3D）`.face-reveal`**：**cube 级**居中绽放。只绑不旋转的 `.cube-vp`（一次 enter/leave）→ 驱动单一 `--rv-r` 写 `#cube` 继承给各面（mask `at 50% 50%` 居中），半径在 render 循环**单调**缓动（0↔cubeHalf×0.92，到位即停写=静态），无振荡。face-reveal **禁 translateZ(0)**（3D 面引背面剔除闪）。
  - 触屏 `(hover:none)` 两者皆隐藏。
- 主线卡**不左右交替**：文字恒左（列内居中）、图恒右；封面 360 方图、无边框、圆角 4px；文字列**居中收拢**（justify-content:center + 30px 簇间距，禁 space-between 把标题/正文撑到两端）；作品间距 `--mainline-gap: 320px`（老师页实证的呼吸感）
- 揭示层：`assets/project/{id}/float/1.jpg`，软边 mask 随鼠标显影（规格见上方「软边揭示 UX」，禁硬边 clip-path 圆）——**素描版封面（thumbnails/2 位）由用户 ComfyUI 管线后续产出替换**；尾声（建筑）揭示层是横构图版面 → `object-fit: contain` 白底整页收进框，**禁 cover 拦腰裁半**
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
