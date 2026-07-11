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
  - **合成器铁律（2026-07-07 三迭代，修卡顿）**：加载页动画只准用 transform/opacity/clip-path，**禁 max-width/top/left/width/height 等布局属性**——开屏时主线程正忙于建丝带/画廊/字体回流，布局动画会被抢帧卡壳。名字展开=ins 用 `clip-path inset` 从右揭示 + `.tail` 用 translateX 让位 + reveal translateX 回中，三者 .7s 同曲线锁相（loader.js 量 ins 宽写初始位移）；morph 条：rise 用 `scaleY`（origin 底中）、fly 用 `translate+scale`（同底中原点映射源盒→header 条位，两段过渡连续）
- **页脚 finale**（index，2026-07-07 用户裁定简化）：「I am ___」五词轮换（Alnt Med / an AIPM / an Architect / a Builder / anything.）后**直接接 site-footer**——波点带与「Logo 从 header 下坠落槽」编舞已整体删除（fdots / fband-slot / fly-band / tickFinale 均不复存在，勿恢复）
- **中轴进度指示**（用户原创，替代老师站波浪线+圆珠）：竖向数据条轨道 + 随滚动生长的墨色填充（IAM 节奏微调制）+ 作品节点水平分支、标题提亮。**分支必须吸附在某根短横线行上**（看起来是那根短横线在延伸，不能凭空生线），从中轴向左划到**大标题左缘正下方**收在方点。**走过的横线保持伸展态不回缩**（波只在进度头前方做预备）；轨道**头尾都不许压到文字**——尾端止于「尾声」标题上方。**无圆珠**，效果克制
- **品牌条尺寸走 `--bb-*` 令牌**（barmorph.css：`--bb-h/--bb-bar/--bb-gap/--bb-dot`，默认=header 档 69×22）。**放大场景一律换令牌原生渲染，禁 transform scale 放大**（合成层按原生栅格化再放大必糊）。`.brandband--footer` 大档令牌保留在 barmorph.css 备查（页脚落槽已删，现无使用场景）。极窄屏（≤374）header 条切 18px 小档
- **页脚站内导航 `.foot-nav`**（PROJECTS / AROUND / ABOUTME）：<1024 无侧钮时的 ABOUTME 唯一入口，桌面同显为站点地图；注意选择器用 `.site-footer .foot-nav a`（同权重会被后文 `.site-footer a` 按顺序压掉）
- BarWord（词从条中解码）保留在 about 页标题；方块句点 `.psq` 永远直角

## 版式基准（老师站实证规格）

- **大标题字体铁律（用户裁定 2026-07-07）**：所有页级大标题一律 Monterey（`var(--font-display)`）——首页英雄标题、projects 页标题、**详情页 `.detail-title`**、主线卡标题；中文按栈回退宋体。章节 h2 与正文保持衬线，不得把详情页大标题改回 Georgia。
- hero（英雄区，2026-07-11 丝带改版：作品丝带飞入 → 绕大字自转环，取代 3D 立方体）：近全视口舞台五层 z 阶梯——`.ribbon-back` z1（环后弧，pointer-events:none）→ 巨大 `LI WENYUAN` z2 → `.ribbon-hit` z3（拖拽命中带）→ `.ribbon-front` z4（环前弧，卡可点击）→ 贴底行 z5（左 intro；右精选面板 <1024 隐藏）。`.polygon-container` 只剩**流内占位**职责（撑 hero 中段高度纯 CSS `calc(--ribbon-card-w × 1.02)` + `margin-top: clamp(32px,11vh,110px)`，buildSpine 锚它的下缘，波点场 ::before 仍挂它）。大字规格（2026-07-11 四迭代定稿）：文案 = **`Li-Wenyuan`**；**Monterey 400 常规体**——用户裁定 Bold 字重形态「不像我的字体」，**勿再改 700**；h1 `top: clamp(12px,6vh,56px)` **偏上方**；内层 `.hero-name-text` `calc(clamp(64px,13vw,264px) × --hero-fit)`（`fitHeroName()` JS 拟合到 ≈92vw，挂 refresh/resize/fonts.ready/RO 防抖四处）、全断点一行 nowrap；**颜色=标准标题色 `var(--c-title)` 纯色**（四迭代用户裁定：距离渐变已废除，勿恢复 background-clip 渐变）；**环「套住」标题**——前弧压字下段 ~35%、后弧从字后绕过并露出字上方（COVER 锚+header 守卫见丝带段）；**不加下划线**；**英雄区全英文**（四迭代裁定：intro/aside 不挂 data-zh/en、语言切换不影响本区，中文身份仅 aria-label 承载）。贴底行排版两级（2026-07-11 用户裁定左下角简化，`intro-sub` 已删勿恢复）：kick 10px/.42em/#999 最轻 → `.intro-title`「你好，我是 李文苑。」clamp(20px,1.9vw,27px)/#181818/名字 700 黑最重；**intro 不再用下划线**。入场编舞挂 `html.loading` 冻结第 0 帧、条落 Logo 后梯次起跑（大字 → 波点场/丝带层 +.35s → intro +.55s → aside +.7s；丝带 JS 时间轴另听 `loaderdone` 事件 +350ms 对齐，见 ribbon.js）；**transform 分层铁律**：入场动画在 h1/.polygon-container/.ribbon-layer（丝带层只准 opacity 淡入——双容器投影必须逐像素一致）、视差与自转折进 .ribbon-world 的 world 变换、卡片姿态在 .rcard，互不抢
  - **手机档三段式（≤767，四迭代用户裁定「大字在上·环在中·贴底行沉底」）**：`.hero { justify-content: center }` 让丝带占位（唯一流内元素）垂直居中；`.polygon-container { margin-top: 0 }`（否则 base 的 11vh margin 叠加会推离正中）；大字保持 base `top:clamp` 在顶部（**勿**把大字也居中）；`.hero-foot` 改 `position:absolute; bottom:0`（脱流沉底，替掉 margin-top:auto）。手机档**环心不对大字中线**，改对 hero 视口中心（ribbon.js 的 MOBILE 分支）。桌面档不动（margin-auto 沉底 + polygon margin-top:clamp 已定稿）
- **丝带运动体系（js/ribbon.js，2026-07-11 三迭代 strip 切片真弯曲版；单 render 循环，dt 归一保 60/120Hz 同速）**：
  - **strip 切片=真弯曲（三迭代用户核心裁定「这是一条丝带，不是一个个卡片」，勿退回整卡刚性平面）**：等高混宽带——带高 H=token÷H_DIV 恒定，卡宽=H×**原始宽高比**（decode 门后读 naturalW/H、fallback 1.5，不硬编码；方四作 1:1、cowork 4:5、建筑 3:2，**不做白边 pad**）；每卡切 N 条竖直窄条（折角上限 MAX_FOLD=2.6° → 共 ~138 条；六迭代由 4°/93 条加密——连同卡间缝 0.08H→0.025H 把带内/卡间折角拉平到 2.56°/3.2°，根除环前侧「切痕」），每条 strip 是传送带独立链节 → 带体在任意曲率处连续弯曲；strip 数尺度不变、**DOM 只建一次**，resize 只重解几何重写布局 px；
  - **镜像传送带路径（无状态混合）**：`pos(u)=(−r·sin u, lift, r·cos u+pull)`，u≥0=环本身、u<0（q=−u）=入场螺线：pull 恒负（远景小、「从小丝滑到大」，定标锚 SCALE_FAR；**kz 二分区间允许负**——螺线外扩本身已把远端推小）、lift 正（掠屏幕底部，定标锚 BOT_FRAC）、x=r·sin q 自然走「左下远景 → 掠底向右 → 右侧卷起 → 前弧右→左成环」；头部弧长 `S(t)=S0+ΔS·easeOutSine+ω·R·t`（sine 终点导数 0=C¹ 融巡航，初速仅 1.57×均速保逐卡节奏），INTRO_DUR 4.6s；**sEnd=L=2πR 头尾精确合拢**（合拢缝=卡间缝 SEAM=0.025H、自然落正前）——勿改回「路径态→环态 blend」（欧拉角插值有跳变坑）；
  - **深度遮挡（双容器 z-split）**：back/front 两个逐像素相同的透视容器（共享 `.ribbon-layer` 类，perspective:1500px）夹住大字，**strip 粒度**按世界深度 `z_w=−Zoff+R·cos(θ+φ)·cosτ` 正负迁移 DOM（±90° 侧棱 + ±1.5° 迟滞，与样式写入同帧）。**禁给两容器套共用 transform wrapper**（合成组会挡掉大字 z-index 夹层）；**背面不可点**=back 容器 pointer-events:none 架构自带；
  - **几何**：混宽环 **R=L/2π 精确闭合**；Zoff 由环投影半宽 X_FRAC(0.32)×vw 反解（投影 scale 恒 ≤1 防合成层放大糊，全环 z≤−40 守卫）；环姿态 rotateX(**−26°**)+rotateZ(**−4°**)（五迭代：−22 时前弧「拦腰截断」标题被批——大倾角+守卫让前弧只从字底缘掠过）；**纵向锚定（环必须「套住」标题，勿再分离）=「前弧带顶边钉在标题 (1−COVER) 高度线」反解世界 y（COVER=0.30 名义）+ header 越界守卫（后弧顶 < hero 顶 +8px 时把环整体下压，大倾角下通常守卫接管）**——凡「A 压 B 某比例」的布局**锚被压量本身**，标题换字号/文案免重调；尺寸旋钮=H_DIV(2.15)/X_FRAC(0.30)；侧棱细条沿标题两侧上扬是环的立体轮廓（量测时勿被其包围盒虚胖误导）；**地面阴影 `.ribbon-floor`**（椭圆径向渐变静态一次成型、透明度恒定不呼吸，位置/尺寸由 layoutFloor() 随几何写、仅 relayout 非逐帧，z0 波点场层）；
  - **交互**：巡航 **ω=−3°/s（前弧右→左，与入场方向连续；实测 −2.99）**、惯性收敛到 −BASE · 拖拽增益 `°/px=R2D/(R·s_f)`（前弧贴手指，**符号不变**）· 惯性 clamp ±0.8°/帧、摩擦 .95/帧 · down 绑 `.ribbon-hit`+front 容器冒泡（**不逐条绑**，防闪总则第 4 条）、move/up 走 window · 点击=位移<6px（触屏 10px）且 <400ms → `closest('.rstrip')` 滚 `#work-{id}` 锚点（scrollIntoView 不传 smooth——吃全局 scroll-behavior，RM 自动瞬跳）+ `.jump-hit` .95s · **悬浮不停转铁律沿用** · 鼠标视差（hover+fine：world ±14/10px、大字反向 ±8/5px、拖拽时冻结目标；**仅环态生效**——五迭代：飞入是纯编舞，途中视差起步=「临近标题的小抖动」，勿放开）；
  - **strip 材质**：无整卡边框/inset 阴影（弯带上逐条断裂，弃用），外角圆角只在各卡首末条；条间重叠 OVERLAP=0.75px 防白缝 + **img opacity 恒 1**（半透明重叠区会反出暗缝），调色 `saturate(.85) contrast(1.03) brightness(1.02)`；**⚠️ `.rstrip img { max-width:none }` 必须保留**（main.css 全局 `img{max-width:100%}` 会把条内全卡宽 img 压扁）；`.rstrip-shade` **=白纱 var(--c-white)**（五迭代用户裁定：带到名字「后面」要变得很淡——白罩向暖白底淡去分清前后，后弧最淡 0.82、前弧全彩；**勿改回压暗**）+ 静态 translateZ(0) 提层（93 条/帧 opacity 走合成器）；strip **零 CSS transition**（DOM 迁移会重置）；背面 backface visible 显镜像由白纱吸收，勿加第二背面元素（共面 z-fighting）；
  - **卫生**：decode 门（1800ms 兜底）后建带+起跑；t0=首个 rAF（后台/离屏等可见才开演，**reload 恢复滚动位≠冻住**）；`now−lastT>1s` 整帧重基不追帧；IO 离屏停 rAF；**飞入途中遭遇 resize 直接跳剪到环态**；尺寸档 `--ribbon-card-w`（语义=**3:2 等效卡宽**，带高 H=÷H_DIV）：桌面 `min(620px,42vw,74vh)`（**勿用 svh**——自定义属性无双写回退，旧 Safari 整条失效塌丝带）、平板 `min(480px,50vw)`、≤767 `min(230px,60vw)`、≤479 180px（挂 `.hero`，默认档在 tokens.css）；reduced-motion 静态定格环态（θ=0，合拢缝正前），零 rAF，点击仍可用
- **🚫 揭示/hover 动效防闪总则（六迭代定死，凡做 hover 显图/揭示一律遵守，别再逐个踩坑）**：
  1. **只动 `opacity` / `transform`**（合成器线程，任何浏览器含微信 webview 都不闪）；
  2. **mask/clip-path 必须静态**——绝不用 JS 逐帧改 `mask-image`/`clip-path` 的**半径或圆心**（每帧改=主线程连续重绘，移动端/微信 webview 必闪。这是反复被报"还闪"的总根源）；
  3. **不在 hover 时动态挂 `will-change`**（提层那帧漏 mask 整图闪一下）；
  4. **旋转/3D 物体绝不逐面/逐子元素绑 `pointerenter/leave`**（投影重叠时命中面高频切换=振荡闪）——改绑稳定不旋转的容器级 hover。
- **落地（两条路径均遵上则）**：
  - **卡片（画廊 + 主线，平面 2D）`.layer-reveal`**：**纯 CSS** `:hover` 交叉淡入——`opacity 0→1` + `transform: scale(.9)→scale(1)`（从小长大），边缘柔和由**静态** `radial-gradient(ellipse 78% 78% …)` mask 一次成型。**无 JS、无 rAF、无光标跟随**（`attachReveal`/`bindReveal` 已删）。
  - ~~立方体面 `.face-reveal`~~ 已随立方体退役（2026-07-11 丝带改版）；总则第 4 条对丝带卡**依然生效**——丝带的 pointer 事件全部绑稳定容器（`.ribbon-hit` + `.ribbon-front` 冒泡），卡上不绑 enter/leave、无 hover 视觉。
  - 触屏 `(hover:none)` 揭示层隐藏。
- 主线卡**不左右交替**：文字恒左（列内居中）、图恒右；封面 360 方图、无边框、圆角 4px；文字列**居中收拢**（justify-content:center + 30px 簇间距，禁 space-between 把标题/正文撑到两端）；作品间距 `--mainline-gap: 320px`（老师页实证的呼吸感）
- 揭示层：`assets/project/{id}/float/1.jpg`，软边 mask 随鼠标显影（规格见上方「软边揭示 UX」，禁硬边 clip-path 圆）——**素描版封面（thumbnails/2 位）由用户 ComfyUI 管线后续产出替换**；尾声（建筑）揭示层是横构图版面 → `object-fit: contain` 白底整页收进框，**禁 cover 拦腰裁半**
- **尾声建筑卡 = 3:2 横构图**（建筑渲染都是横图，方图裁到看不见内容——用户裁定）：封面 = 母版首页主渲染 3:2 满幅裁（960×640，无白边无页面装饰）；主线 AI 卡保持 360 方图
- **丝带卡图 = `assets/ribbon/{id}.jpg` 派生版**（2026-07-11 三迭代：**原始比例、不做白边 pad**——用户裁定「加白边效果很差，要适应区分」）：卡面用封面不用落地页截图（「落地页太杂」）；方四作（pears/yijian/meco/uabb）512×512、cowork 480×600（4:5）、建筑六作 640×427（3:2），JPEG q85 ≤110KB（sips -z 高 宽；pears/meco 透明 PNG 转 JPEG 自动白底压平）。全部 11 作上环、无品牌卡（用户裁定）；tests 有存在性守卫，加作品须同步 sips 派生（比例运行时从 naturalW/H 自适应，任意比例均可）
- 建筑翻页图（content/）一律取**母版完整版面（带页边白）**，不做去白边裁切——上桥曾因裁掉顶部白边与其他五作不一致（2026-07-06 已重导）
- 详情页两种形态（2026-07-10 起）：
  - **作品集映射模式**（`portfolio.json products[].mapped=true`，现 Pears/Co-work/议见/Meco/UABB 五作全开）：详情页与作品集页**同一事实源同一排版**——kicker+Monterey 标题+↗+keywords → 顶部视频门面（Pears/Co-work 保持视频在开头，与结尾影片块构成同一入口的两次出现，用户裁定没关系）→ 封面块（tldr 双栏+封面方图+奖项+指标带+落地页说明头+落地页大图）→ 线稿块 → 场景行模块（复用 portfolio.json scenes/rows 语法）→ 影片块（点击就地播放）+STACK。连续网页流照 architecture.html（非 A4），浮出动效照首页（IO + opacity/transform）；**作品集没放的内容（meta 行/tags/旧内容长图/文字球）画廊也不放**，此后两页共同管理，改场景/截图只改 portfolio.json、改文案只改 projects.json。样式在 project-detail.css 的 `.pd-mapped` 段。
  - **经典模式**（建筑作品）：Monterey 大标题+↗ → 斜体开场段（左对齐引线）→ 章节 h2（衬线）+通栏细线 → 「—」列表（行首「标签：」≤10 字自动加粗）→ 小型大写技术栈 → 白卡图版容器+图注+文字球
- 字体：MontereyFLF woff2×3（拉丁 unicode-range，中文落系统栈）+ Garamond/Georgia 衬线

## 移动端与触屏（2026-07-07 定稿）

- **断点体系**：`1023 / 767 / 479 / 374` 四档递进（374 只管 header 极窄收纳）。中轴进度条与侧钮 <1024 隐藏是设计决定，勿做移动替代。
- **safe-area**：六页 viewport meta 带 `viewport-fit=cover`；tokens 层 `--safe-*` 四令牌 + `--header-h: calc(70px + var(--safe-top))` 一次性兜底，header/footer/modal/侧钮全部 env() 补偿。桌面预览 env()=0，刘海效果需真机复核。
- **触屏热区 pattern**：`@media (pointer:coarse),(max-width:1023px)` 下用 `::after` 伪元素 `max(100%,44px)` 扩热区（不可见/不占布局/不改设计稿）；落点 `.text-ball`、`.media-cta a`、`.modal-close`、`.about-bio li a`。可见块级目标（返回钮/门面钮/列表行）直接真实达标 ≥44。
- **丝带触屏**：`.ribbon-hit` 带 `touch-action: pan-y`（竖划归页面滚动，横向起手归拨环）；几何在 resize 走 `Ribbon.relayout()` 重解（否则横竖屏切换会散架）；点击判定触屏放宽到 10px 位移。
- **⚠️ 横向溢出防线在 body**（`overflow-x: hidden; overflow-x: clip`）——**绝不能放 html**：html 上的 clip 会把整页竖向滚动一起钳死（Chrome 实测）。装饰层禁止横向负 inset 出血。
- **vh 一律双写 svh**（`height: Xvh; height: Xsvh;` 回退行在前），防 iOS 地址栏收放抖动。
- 尾声网格：767 两列（gap 28/20）→ 479 单列满幅；详情页 479 档白卡 `margin-inline:-12px` 回收页边（与 `.container` 的 `100%-48px` 强耦合）。

## 数据与素材约定

- 加作品 = projects.json 加一条 + `assets/project/{id}/{thumbnails,float,content}/` 放图 + `assets/ribbon/{id}.jpg` sips 派生（英雄区丝带卡，tests 守卫），其余零代码
- 媒体：`video-local` / `iframe-lazy` 一律门面点击才加载；视频 ffmpeg H.264 crf26 `+faststart` <30MB，原片留 `../源文件/`
- 资产文件名全小写（GH Pages 大小写敏感）；`annotations` 图注内联 JSON（图右下 12px 文字球）

## AI 产品作品集 `portfolio/`（2026-07-07 新增 + 当日二迭代，A4 定版信息流 + 双语 PDF）

- **同步铁律**：产品文案（title/one_liner/七段 sections/tech_stack/keywords/award/url）一律运行时 join `config/projects.json`；`config/portfolio.json` 只放作品集特有信息（页序=products 数组序、场景 rows、截图清单+ratio、窗框 frame、指标带 metrics、lineart、个人页 profile、建筑矩阵）。**改产品文案永远改 projects.json**，两边自动同步；`tests/portfolio.test.mjs` 守卫禁文案漂移。
- **正文页横向行模块铁律（2026-07-08 三轮用户裁定，勿再做左右双栏正文）**：场景页 = 页头（kicker+sec-h）+ 行模块纵向依次码放，每行横向满宽，行只有六种——`{text:true}` 一文 / `{text:true,img:i,img_mm}` 一文一图（少数）/ `{imgs:[i]}` 一图 / 两图 / 三图（等高对齐 flex-grow=ratio）/ `{sec:"节名"}` 独立文字节模块（自带 sec-h 标题引用另一节文案，2026-07-10：画廊详情里写了的节，作品集必须都有）。配置在 `scenes[].rows`（下标引用 images，每图恰好引用一次；sec 必须命中五节之一，tests 守卫）。二迭代的 split/split-band 双栏被用户整体推翻，勿恢复。
- **版式**：A4 定版 `.sheet`（mm 页盒 + overflow:hidden + break-after:page），共 **25 页**（2026-07-11 UABB 产品截图入库、拆 3 场景页后）；文案改长会触发溢出探测（屏显红描边 + console.warn），别让它默默裁切。**六作体系**：rail/INDEX 01-06，第 06 项=建筑合集（JS 由 architecture 合成，products 保持 5 项）。**索引双档**：产品封面页=完整 26mm rail；场景/线稿/建筑页=极简 rail（`.rail--mini`，主区加宽到 167mm）。
- **作品封面统一紧凑模板**：kicker→标题→keywords→双栏（左 tldr｜右封面方图+奖项）→指标带→**落地页说明头**（小标签「落地页 · THE LANDING PAGE」+ **英文大标题 lede_en（拉丁 Monterey）+ 中文解释 lede_zh 小注**——六轮修正：必须走「英文大标+中文解释」全站口径，话术有人味如「Click once — the agents do the rest. / 点击，然后让 Agent 替你干活。」，用户会自己调词）→底部主要落地页大图+图注；metrics/cover **有字段才渲染**——占位作品日后补字段即自动升级，零代码。（one_liner 不在封面：见线稿块的文字零重复铁律。）
- **图注铁律（2026-07-08 六轮用户裁定）**：**真实场景截图一律带图注**（caption_zh/en，9.5px 居中灰），包括封面落地页大图；线稿不算真实场景（注释烧在 SVG 内）。
- **模块间隔铁律（同上）**：**不同内容的模块之间间隔拉大**（如线稿块 ↔ 场景正文 = 13mm、影片块上间距 11mm）；同一模块内的行保持 4-5mm。
- **线稿标题版式 = 通用分隔模块定式（同上）**：「拉丁 Monterey 核心语句大标题 + 中文小注 + 辅文」左、图右——线稿块与**影片门面**（motto「Watch it work. / 看它跑起来」+ 观看外链 + 海报右）均用此定式；后续需要与正文分隔的异质模块优先套用。
- **正文排满规则（2026-07-08 用户裁定）**：正文页尽量排满——内容不足半页的模块并入相邻页。落地实现：有场景页的作品，线稿块并入首场景页顶部（不单独成页）；仅无场景页的作品保留独立线稿页。共 **25 页**（3 前页 + Pears 4 / Co-work 4 / 议见 4 / Meco 4 / UABB 4 + 建筑 1 + 封底；Pears/议见/Meco 各带「brief」文字页=线稿块+Why+核心贡献，UABB 无线稿、首场景页=Why+一文一图+核心贡献混排）。
- **Mac 窗框三灯 = macOS 原色**（#FF5F57/#FEBC2E/#28C840，2026-07-07 二轮用户裁定）：三灯与截图/封面素材是灰阶体系仅有的色彩例外；个人页人像也保持彩色（勿加黑白滤镜）。
- **⚠️ 体积铁律：打印态禁 CSS filter**——filter 迫使 Chrome 把 JPEG 重栅格成无损位图（实测建筑页 6 图 150KB/张→1MB/张，全册 16MB）。屏显 saturate 调色保留，`@media print` 一律 `filter:none`（portfolio.css 打印块）。
- **视频/交互影片**：作品集页绝不内嵌 video/iframe（与门面点击约定互斥、打印会空框）——一律 poster + 播放角标 + 外链 `<a>`（PDF 里自动成可点注记）。
- **PDF 导出**：`bash tools/export-portfolio-pdf.sh`（必须本机 macOS 跑，中文落宋体）→ `uploads/portfolio-ai.pdf`（中）+ `portfolio-ai-en.pdf`（英），母版归档 `../源文件/AI作品集/`。页数应=**25**；**绝不 gs 压缩**（soft-mask 拍扁）；体积靠素材 ≤300KB（`assets/portfolio/`，源图在 `../产品-详情图/`）。
- **双语**：`?lang=zh|en` 显式覆盖（无头打印必带）；中文版=英文大标题+中文正文（`.zh-note` 在 EN 版 CSS 隐藏）。
- **线稿页定式（2026-07-08 用户裁定，后续所有作品的线稿页照此）**：一侧文字｜一侧线稿图，文字侧 = 大标题（**线稿核心语句** `lineart.motto`，拉丁 Monterey + `motto_zh` 中文小注）+ 斜体 one_liner。**文字零重复铁律**：每段文案全册只出现一次——one_liner 归线稿页（有线稿页的作品封面不再渲染 one_liner），keywords 归封面，STACK 归尾场景页；线稿图注烧在 SVG 内不重复排版。Co-work 线稿引用站内 `assets/project/cowork/content/plate-core.svg`（不复制文件=天然同步）。
- 主站入口：header/foot-nav 的 PORTFOLIO（main.js 注入，≤1023/≤479 断点已为三钮收纳）+ about 作品集区。
- 旧 `/ai-portfolio/*` 302 兜底保留在 `_redirects`，新页面路径是 `/portfolio/`，勿混用。

## 作品集文案规则（用户定稿 2026-07-06，中英通用，写任何项目介绍必须遵守）

**结构（固定章节，顺序不变）**：产品自我介绍（一句话）→ 先说结论 · The Short Version → 为什么做这个 · Why → 核心贡献 · Key Contributions → 系统如何运作 · How It Works → 影响与意义 · Impact → 技术栈 · Stack。

- **开场 = 产品自我介绍**：只有一句话，以作品第一人称开口（「你好，我是 Meco 🍄‍🟫……」）。这是全文唯一一处产品视角，其余章节全部是文苑第一人称（文苑是男性，用「他」）。
- **STAR 藏在结构里，不外露**：「先说结论」四条 = 完整 STAR（处境→要解决什么→做了什么→结果），只看这段也能懂全貌；Why=S+T，核心贡献+系统如何运作=A，影响与意义=R。**禁止出现 S/T/A/R 字样或标签**。
- **标题口径**：用「系统如何运作 / How It Works」这个清晰度级别——一眼知道这段讲什么。不用说明书腔黑话（「可行性路径」），也不用过于口语的模糊标题（「当时卡在哪」）。
- **语气基线**：第一人称，平视，不张扬也不自卑。一个人做的就写「一个人做的」；不用「业界领先/颠覆」，也不贬成「小玩具」。技术词降噪成人话（「乐观锁」→「防止重复投票」），但保留能体现判断力的关键决策（「只读白名单」「单进程」「SSOT 只读」）。
- 字段映射：one_liner=产品自我介绍 · tldr=先说结论 · why_built=为什么做这个 · key_contributions · how_it_works · why_it_matters=影响与意义 · tech_stack。
- 老铁律沿用：页面永不解说系统机制；奖项「奖名 · 中文等级」两段式；产品名 Pears / Co-work（勿写 Pear/PeersWork/XTOOL Agent Platform）。
- **禁填充与元叙事（2026-07-10 用户裁定）**：① 不写计数填充语（「六个作品 / 六件 / SIX WORKS」）；② 不写把建筑说成 AI 铺垫的元叙事 / 来处（「体系化训练的来处 / 是我的来处 / 来时路 / 训练场」——首页英雄区亦已按此改为「建筑设计出身 · ARCHITECTURE by training」）；③ 不写册子指引（「完整版另册」，PDF 现仅作用户导出、不在访客 UI）。封面 / 目录 / 尾声只放作品本身，不解说意义、不拔高。**建筑阅读器（architecture.html）每作只渲染三段**：先说结论 + 为什么做这个 + 系统如何运作——其余段落多为补写、显牵强；完整七段仍存 `config/projects.json`，详情页 `project.html` 照旧完整显示。

## 部署（不变）

改完 commit + `git push origin main` → GitHub Actions 自动部署 Netlify `alnt-med`。**不要**脱离仓库手动 `netlify deploy`。
本地预览必须 HTTP：`python3 -m http.server 8080`（Claude Code 用预览配置 persona-site:8099）。
