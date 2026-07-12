# 设计语言与文案规则 — 李文苑 Alnt Med 个人站（2026-07-06 wenxin 式改版）

照老师站 wenxin.design 复刻的**纯静态多页站**：无框架无构建，`config/projects.json` 单一事实源。
旧 React 单页站（「理性的艺术」钴蓝三色版）已整体退役，完整保留在 git 历史（快照 `ba7ebcd`）。
**首访默认中文（2026-07-13 用户裁定）**：语言兜底一律 `'zh'`、不跟浏览器语言（六页 head 内联 + language-toggle.js detect() 共 7 处同口径）；已存 preferredLocale 与 portfolio `?lang=` 显式覆盖（PDF 导出）优先级不变。

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
- **页脚站内导航 `.foot-nav`**（PORTFOLIO / ARCH / AROUND / ABOUT ME）：<1024 无侧钮时的 ABOUT ME 唯一入口，桌面同显为站点地图；注意选择器用 `.site-footer .foot-nav a`（同权重会被后文 `.site-footer a` 按顺序压掉）。**标签口径 2026-07-11 用户裁定：写 `ABOUT ME`（带空格），侧钮同**
- BarWord（词从条中解码）保留在 about 页标题；方块句点 `.psq` 永远直角

## 版式基准（老师站实证规格）

- **大标题字体铁律（用户裁定 2026-07-07）**：所有页级大标题一律 Monterey（`var(--font-display)`）——首页英雄标题、projects 页标题、**详情页 `.detail-title`**、主线卡标题；中文按栈回退宋体。章节 h2 与正文保持衬线，不得把详情页大标题改回 Georgia。
- hero（英雄区，2026-07-11 丝带改版：作品丝带飞入 → 绕大字自转环，取代 3D 立方体）：近全视口舞台五层 z 阶梯——`.ribbon-back` z1（环后弧，pointer-events:none）→ 巨大 `LI WENYUAN` z2 → `.ribbon-hit` z3（拖拽命中带）→ `.ribbon-front` z4（环前弧，卡可点击）→ 贴底行 z5（左 intro；右精选面板 <1024 隐藏）。`.polygon-container` 只剩**流内占位**职责（撑 hero 中段高度纯 CSS `calc(--ribbon-card-w × 1.02)` + `margin-top: clamp(32px,11vh,110px)`，buildSpine 锚它的下缘，波点场 ::before 仍挂它）。大字规格（2026-07-11 四迭代定稿）：文案 = **`Li-Wenyuan`**；**Monterey 400 常规体**——用户裁定 Bold 字重形态「不像我的字体」，**勿再改 700**；h1 top 桌面 `clamp(64px,18vh,180px)`（2026-07-12 重心下移）/ 手机覆写 `clamp(12px,6vh,56px)` 贴顶；内层 `.hero-name-text` `calc(clamp(64px,13vw,264px) × --hero-fit)`（`fitHeroName()` JS 拟合到 ≈92vw，挂 refresh/resize/fonts.ready/RO 防抖四处）、全断点一行 nowrap；**颜色=标准标题色 `var(--c-title)` 纯色**（四迭代用户裁定：距离渐变已废除，勿恢复 background-clip 渐变）；**环「套住」标题（桌面/平板；手机三段式见下条）**——前弧压字下段 ~35%、后弧从字后绕过并露出字上方（COVER 锚+header 守卫见丝带段）；**不加下划线**；**英雄区全英文**（四迭代裁定：intro/aside 不挂 data-zh/en、语言切换不影响本区，中文身份仅 aria-label 承载）。贴底行排版两级（2026-07-11 用户裁定左下角简化，`intro-sub` 已删勿恢复）：kick 10px/.42em/#999 最轻 → `.intro-title`「HI, THIS IS MY **PERSONAL WEBSITE**.」clamp(20px,1.9vw,27px)/#181818/强调词 700 黑最重（七迭代定稿文案）；**intro 不再用下划线**。入场编舞挂 `html.loading` 冻结第 0 帧、条落 Logo 后梯次起跑（大字/丝带层/地影 **0s 同拍**（2026-07-12 用户裁定「标题一出丝带立即开演」，勿再加延迟）→ 波点场 +.35s → intro +.55s → aside +.7s；丝带 JS 听 `loaderdone` **即武装**，零延迟零解码门——几何从 projects.json `ribbon:{w,h}` 同步解、图未到 atlas 灰占位顶上 decode 到一张贴一张）；**transform 分层铁律**：入场动画在 h1/.polygon-container/.ribbon-layer（丝带层只准 opacity 淡入）、丝带姿态全部在 canvas 像素内（JS 投影，不占 CSS transform）、视差只写 .hero-name-text，互不抢
  - **手机档三段式（≤767，2026-07-12 晚用户裁定恢复——推翻同日早些「环套标题，同桌面」；当日两次反转，以本条为准）**：大字贴顶（h1 手机覆写 `top: clamp(12px,6vh,56px)`，桌面 18vh 下沉不进手机档）· **环对 hero 垂直正中**（solveGeometry 锚定分支 **MOBILE 例外跳过标题锚，yc=0**）· 贴底行 `position:absolute; bottom:0` 沉底。环保持放大 ~84% 屏宽（xf 手机档 0.42，**勿超 0.44**——MARGIN_Z 守卫天花板在 414px+ 宽机型钳住名义值；`--ribbon-card-w` ≤767 `min(250px,66vw)`、≤479 200px 不变，环几何对 token 一阶不敏感）；`.hero { justify-content: center }` + `.polygon-container { margin-top: 0 }`（margin 勿整行删——会回落 base clamp 推离正中）；`.ribbon-hit` 无手机覆写回 base（`top:8%; bottom:30%` 完整覆盖居中环带）。桌面/平板环套标题不动。390×844 验收基准：环带 heroY 360→572、环心偏移 +1.2%、距标题 173px/距贴底行 184px
- **丝带运动体系（js/ribbon.js 数学+状态机 · js/ribbon-render.js 渲染端，2026-07-12 Canvas 连续化改版；单 render 循环，dt 归一保 60/120Hz 同速）**：
  - **连续带面=微切片进同一张栅格（改版核心）**：旧 DOM strip 方案（~138 平面各自栅格化再合成）的锯齿真凶是**逐平面独立栅格化**（交界纹理采样错位/边缘各自 AA/叠印），加密切片治标不治本（六/七迭代实证）；现带面 B(s,v)=C(u(s))+v·ŷ(u(s)) 按屏幕空间自适应细分（SLICE_W ≤1.25 CSS px 且片内高差 SLICE_DH ≤0.5px，侧棱自动加密到亚像素；离屏段 OFF_RELAX×24 放粗），相邻切片**共享精确投影角点**（误差不累积）+ 向两侧外扩 0.4 设备 px 防 AA 发丝缝，整条带在同一张 canvas 以连续覆盖率成像。环态 ~1600 切片/帧、实测 <1ms（采样+排序+绘制）；**验收口径：合成双画布全幅「裂缝像素」扫描**（透明点且左右或上下 ±2px 皆不透明、排除缝迹线）——侧棱切点两处 ~3px 针孔为已知极限，肉眼不可辨；
  - **镜像传送带路径（无状态混合，数学与 DOM 版一字未动）**：`pos(u)=(−r·sin u, lift, r·cos u+pull)`，u≥0=环本身、u<0（q=−u）=入场螺线：pull 恒负（远景小、「从小丝滑到大」，定标锚 SCALE_FAR；**kz 二分区间允许负**）、lift 正（掠屏幕底部，定标锚 BOT_FRAC）；**⚠️ 曲率连续铁律：三个形状函数指数一律 ≥2.2**（指数 <2 → 二阶导在接环点发散=曲率尖峰必折）+ 扭转斜坡 1.8 rad；头部弧长 `S(t)=S0+ΔS·easeInOutSine+ω·R·t`（钟形速度曲线：起步=巡航速缓起 → 中段峰值 1.57×均速 → 终点导数 0 恰接 ω·R），INTRO_DUR 6s；**sEnd=L=2πR 头尾精确合拢**（合拢缝=卡间缝 SEAM=0.025H、自然落正前）；**环态相位由 ringS 吸收**（intro 冻结含 ω 过冲、relayout 重置为 L），环态坐标 = RotY(θ−(ringS−s)/R)·(·,v,R)——勿改回「路径态→环态 blend」（欧拉角插值有跳变坑）；
  - **等高混宽带**：带高 H=token÷H_DIV 恒定，卡宽=H×原始宽高比（**从 projects.json `ribbon:{w,h}` 同步读**——入场即时化的前提，不等图片解码；decode 后用实测比例自愈漂移 >1% 时重解几何；tests 用 sips 守 JSON 与实际文件一致），**不做白边 pad**；
  - **深度遮挡（双画布 z-split）**：back/front 两张 canvas（`.ribbon-back` z1/`.ribbon-front` z4）夹住大字，切片按 `cos(θ+φ)` 符号分派前/后画布（每帧整幅重画，无 DOM 迁移无迟滞；跨界切片+其相邻切片两边补画焊交界）。**禁给两容器套共用 transform wrapper**（合成组会挡掉大字 z-index 夹层）；旧 preserve-3d/perspective 及 Safari 扁平化地雷（禁 overflow/filter/opacity<1/圆角裁切）**全族退役**——canvas 层无 3D 子树；
  - **几何**：混宽环 **R=L/2π 精确闭合**；Zoff 由环投影半宽 X_FRAC×vw 反解（桌面 0.30/手机 0.42；投影 scale 恒 ≤1，全环 z≤−40 守卫）；**视口宽一律 `document.documentElement.clientWidth`**（innerWidth 含滚动条、个别环境报设备像素，曾致几何崩坏——fitHeroName 同改）；环姿态 rotateX(**−26°**)+rotateZ(**−4°**)；**纵向锚定（桌面/平板，环「套住」标题）=「前弧带顶边钉在标题 (1−COVER) 高度线」反解世界 y（COVER=0.30 名义）+ header 越界守卫（后弧顶 < hero 顶 +8px 时把环整体下压，通常守卫接管）；手机档（≤767）三段式跳过标题锚、yc=0 对层中心（2026-07-12 晚裁定）**——凡「A 压 B 某比例」的布局**锚被压量本身**；尺寸旋钮=H_DIV(2.15)/X_FRAC；侧棱细条沿标题两侧上扬是环的立体轮廓；**地面阴影 `.ribbon-floor`**（静态径向渐变，layoutFloor() 仅 relayout 写）；
  - **交互**：巡航 **ω=−3°/s（前弧右→左）**、惯性收敛到 −BASE · 拖拽增益 `°/px=R2D/(R·s_f)`（前弧贴手指）· 惯性 clamp ±0.8°/帧、摩擦 .95/帧 · down 绑 `.ribbon-hit`+front canvas 冒泡（事件绑稳定容器，防闪总则第 4 条）、move/up 走 window；**front canvas pointer-events:auto 全层接事件，语义域在 onDown 复刻**（=命中带 ∪ 前弧卡面，域外按下不响应）；点击=位移<6px（触屏 10px）且 <400ms → **数学拾取**（上帧前弧切片快照点-在-四边形 → 卡 id）滚 `#work-{id}` 锚点 + `.jump-hit` .95s；悬停光标 pointer/grab 由 JS 按拾取写（80ms 节流）· 鼠标视差（hover+fine：带 ±14/10px 并入投影、大字反向 ±8/5px；**仅环态生效**）· **环↔进度轴互动**：轴头锚地影中心（relayout 派发 `ribbonlayout`）；环态轴头涟漪 `spineRipple()`（基准按 IAM 公式独立算勿读 transform；scrollY>40 让位滚动波）；
  - **材质（全部烧进渲染端）**：atlas=11 卡横排图集（卡间缝为透明列不出切片；宽 `min(L×dpr, 8192)` 守 iOS canvas 单边上限——桌面已贴线必须保留守卫；带高变超 10% 自动重建）；调色 `saturate(.85) contrast(1.03) brightness(1.02)` init 一次性烧入（**ctx.filter 必须画点读回做特性检测**——Safari <18 静默忽略，fallback ImageData 线性矩阵）；卡外角圆角 3px 裁进 atlas；白纱=每切片 globalAlpha 白 fillRect（后弧最淡 0.82、前弧近全彩，粒度=切片级近连续；**勿改回压暗**）；未解码的卡=灰圆角占位（--c-border）decode 到一张贴一张；
  - **卫生**：**入场即时**（loaderdone 即武装，无 350ms 无解码门——2026-07-12 用户裁定）；**手机档（≤767）跳过整段飞入编舞、armStart 直接 freezeToRing(geo.L) 成环巡航（2026-07-13 用户裁定「一开始就是那个环」——省 6s 满帧动画的加载期 CPU；桌面飞入不动，勿给手机恢复 intro）**；t0=首个 rAF（后台/离屏等可见才开演，**reload 恢复滚动位≠冻住**）；`now−lastT>1s` 整帧重基不追帧；IO 离屏停 rAF；**飞入途中遭遇 resize 直接跳剪到环态**；canvas 像素尺寸只在 relayout 写（重设即清屏，禁逐帧）、DPR cap 2；尺寸档 `--ribbon-card-w`（语义=**3:2 等效卡宽**，带高 H=÷H_DIV）：桌面 `min(620px,42vw,74vh)`（**勿用 svh**——自定义属性无双写回退，旧 Safari 整条失效塌丝带）、平板 `min(480px,50vw)`、≤767 `min(250px,66vw)`、≤479 200px（挂 `.hero`，默认档在 tokens.css）；reduced-motion 静态定格环态（θ=0，合拢缝正前），零 rAF 单帧成像，点击仍可用（拾取吃该帧快照）；canvas 不可用=优雅无丝带；**手机性能档（2026-07-12）**：① 环态巡航 30fps 节流（render() 头部，|vel+BASE|<0.005 且非拖拽时 31ms 内跳帧不重画、**不写 lastT**——dt 归一自动补角度转速不变；intro/拖拽/惯性满帧，桌面零改动）② 切片预算 `SLICE_W_M=2.0 / SLICE_DH_M=0.8`（sampleFrame 按 MOBILE 选用，切片 697→480；>2.2 卡面直线现分段折痕勿再放粗）——⚠️ `_pump` 步长 <31ms 在手机视口会被节流按设计吞帧，验收脚本一律 34ms 步长；**验收一律 `_pump` 伪时戳驱动 + `_probe`/`_readback` 量测**（截图管道吐旧帧；注意逐列 alpha 扫描会被斜置卡缝假阳性——先按 `_probe` 缝迹线做掩膜）
- **🚫 揭示/hover 动效防闪总则（六迭代定死，凡做 hover 显图/揭示一律遵守，别再逐个踩坑）**：
  1. **只动 `opacity` / `transform`**（合成器线程，任何浏览器含微信 webview 都不闪）；
  2. **mask/clip-path 必须静态**——绝不用 JS 逐帧改 `mask-image`/`clip-path` 的**半径或圆心**（每帧改=主线程连续重绘，移动端/微信 webview 必闪。这是反复被报"还闪"的总根源）；
  3. **不在 hover 时动态挂 `will-change`**（提层那帧漏 mask 整图闪一下）；
  4. **旋转/3D 物体绝不逐面/逐子元素绑 `pointerenter/leave`**（投影重叠时命中面高频切换=振荡闪）——改绑稳定不旋转的容器级 hover。
- **落地（两条路径均遵上则）**：
  - **卡片（画廊 + 主线，平面 2D）`.layer-reveal`**：**纯 CSS** `:hover` 交叉淡入——`opacity 0→1` + `transform: scale(.9)→scale(1)`（从小长大），边缘柔和由**静态** `radial-gradient(ellipse 78% 78% …)` mask 一次成型。**无 JS、无 rAF、无光标跟随**（`attachReveal`/`bindReveal` 已删）。
  - ~~立方体面 `.face-reveal`~~ 已随立方体退役（2026-07-11 丝带改版）；总则第 4 条对丝带**依然生效**——pointer 事件全部绑稳定容器（`.ribbon-hit` + front canvas 冒泡，数学拾取定卡），卡上无独立元素可绑、无 hover 视觉。
  - 触屏 `(hover:none)` 揭示层隐藏。
- 主线卡**不左右交替**：文字恒左（列内居中）、图恒右；封面 360 方图、无边框、圆角 4px；文字列**居中收拢**（justify-content:center + 30px 簇间距，禁 space-between 把标题/正文撑到两端）；作品间距 `--mainline-gap: 320px`（老师页实证的呼吸感）
- 揭示层：`assets/project/{id}/float/1.jpg`，软边 mask 随鼠标显影（规格见上方「软边揭示 UX」，禁硬边 clip-path 圆）——**素描版封面（thumbnails/2 位）由用户 ComfyUI 管线后续产出替换**；尾声（建筑）揭示层是横构图版面 → `object-fit: contain` 白底整页收进框，**禁 cover 拦腰裁半**
- **尾声建筑卡 = 3:2 横构图**（建筑渲染都是横图，方图裁到看不见内容——用户裁定）：封面 = 母版首页主渲染 3:2 满幅裁（960×640，无白边无页面装饰）；主线 AI 卡保持 360 方图
- **丝带卡图 = `assets/ribbon/{id}.jpg` 派生版**（2026-07-11 三迭代：**原始比例、不做白边 pad**——用户裁定「加白边效果很差，要适应区分」）：卡面用封面不用落地页截图（「落地页太杂」）；方四作（pears/yijian/meco/uabb）512×512、cowork 480×600（4:5）、建筑六作 640×427（3:2），JPEG q85 ≤110KB（sips -z 高 宽；pears/meco 透明 PNG 转 JPEG 自动白底压平）。全部 11 作上环、无品牌卡（用户裁定）；tests 有存在性守卫，加作品须同步 sips 派生 + **projects.json 写 `ribbon:{w,h}` 实际尺寸**（2026-07-12 起几何同步解算靠它，tests 用 sips 核对防漂移；任意比例均可）
- 建筑翻页图（content/）一律取**母版完整版面（带页边白）**，不做去白边裁切——上桥曾因裁掉顶部白边与其他五作不一致（2026-07-06 已重导）
- 详情页两种形态（2026-07-10 起）：
  - **作品集映射模式**（`portfolio.json products[].mapped=true`，现 Pears/Co-work/Yi-Jian/Meco/UABB 五作全开）：详情页与作品集页**同一事实源同一排版**——kicker+Monterey 标题+↗+keywords → 顶部视频门面（Pears/Co-work 保持视频在开头，与结尾影片块构成同一入口的两次出现，用户裁定没关系）→ 封面块（tldr 双栏+封面方图+奖项+指标带+落地页说明头+落地页大图）→ 线稿块 → 场景行模块（复用 portfolio.json scenes/rows 语法）→ 影片块（点击就地播放）+STACK。连续网页流照 architecture.html（非 A4），浮出动效照首页（IO + opacity/transform）；**作品集没放的内容（meta 行/tags/旧内容长图/文字球）画廊也不放**，此后两页共同管理，改场景/截图只改 portfolio.json、改文案只改 projects.json。样式在 project-detail.css 的 `.pd-mapped` 段。
  - **经典模式**（建筑作品）：Monterey 大标题+↗ → 斜体开场段（左对齐引线）→ 章节 h2（衬线）+通栏细线 → 「—」列表（行首「标签：」≤10 字自动加粗）→ 小型大写技术栈 → 白卡图版容器+图注+文字球
- 字体：MontereyFLF woff2×3（拉丁 unicode-range，中文落系统栈）+ Garamond/Georgia 衬线

## 移动端与触屏（2026-07-07 定稿）

- **断点体系**：`1023 / 767 / 479 / 374` 四档递进（374 只管 header 极窄收纳）。中轴进度条与侧钮 <1024 隐藏是设计决定，勿做移动替代。
- **safe-area**：六页 viewport meta 带 `viewport-fit=cover`；tokens 层 `--safe-*` 四令牌 + `--header-h: calc(70px + var(--safe-top))` 一次性兜底，header/footer/modal/侧钮全部 env() 补偿。桌面预览 env()=0，刘海效果需真机复核。
- **触屏热区 pattern**：`@media (pointer:coarse),(max-width:1023px)` 下用 `::after` 伪元素 `max(100%,44px)` 扩热区（不可见/不占布局/不改设计稿）；落点 `.text-ball`、`.media-cta a`、`.modal-close`、`.about-bio li a`。可见块级目标（返回钮/门面钮/列表行）直接真实达标 ≥44。
- **丝带触屏**：`.ribbon-hit` 带 `touch-action: pan-y`（竖划归页面滚动，横向起手归拨环）；几何在 resize 走 `Ribbon.relayout()` 重解（否则横竖屏切换会散架）；点击判定触屏放宽到 10px 位移。
- **⚠️ 横向溢出防线在 body**（`overflow-x: hidden; overflow-x: clip`）——**绝不能放 html**：html 上的 clip 会把整页竖向滚动一起钳死（Chrome 实测）。装饰层禁止横向负 inset 出血。
- **vh 一律双写 svh**（`height: Xvh; height: Xsvh;` 回退行在前），防 iOS 地址栏收放抖动。
- 尾声网格：767 两列（gap 28/20）→ **479 仍两列**（gap 24/14、题字 12.5px；2026-07-12 晚用户裁定「详略」：建筑=密排缩略勿再塌单列满幅——单列时 6 条满宽横幅与 AI 大卡等重共占 ~2.5 屏）；详情页 479 档白卡 `margin-inline:-12px` 回收页边（与 `.container` 的 `100%-48px` 强耦合）。
- **手机性能页面档（2026-07-12，与丝带性能档配套）**：① header ≤767 去 `backdrop-filter`（fixed 元素滚动逐帧重模糊=移动端 jank 大头），底色补实 `rgba(255,255,255,.97)`，桌面毛玻璃不动；② 六页 head `<link rel="preload" as="fetch" crossorigin>` 预取 projects.json（about/architecture/project/portfolio 连 portfolio.json）——**crossorigin 必带**（匹配默认 fetch 的 cors+same-origin，缺了凭据模式不匹配→双下载）；③ finale「I am ___」轮换 IO 门控（不可见停 setInterval）；④ buildSpine `<1024` 直接跳过（轴 display:none 时 RO 反复重建纯浪费）；⑤ 封面缩略图**照片型内容禁 PNG**——meco/pears 已转 WebP 带 alpha（cwebp q82，透明悬浮插画融底色不变；-707KB），新增素材同口径。
- 详情页手机档大标题：`.detail-title` ≤767 `clamp(34px,9vw,42px)`（2026-07-12 详略档——原 1.9/1.6rem 与章节 h2 几乎平级，页级层级消失；长题折行是预期形态，勿再降回）。

## 数据与素材约定

- 加作品 = projects.json 加一条（含 `ribbon:{w,h}`=丝带卡图实际尺寸） + `assets/project/{id}/{thumbnails,float,content}/` 放图 + `assets/ribbon/{id}.jpg` sips 派生（英雄区丝带卡，tests 守卫尺寸一致） + **跑 `bash tools/build-images.sh` 出 WebP 变体**，其余零代码
- **图片 WebP 变体（2026-07-13 大陆手机端提速）**：全站 `<img>` 经 `js/img-util.js` 阶梯选档——`{base}.w{480,800,1200}.webp`（限宽）/`{base}.webp`（同尺寸）/丝带 `{id}.m.webp`（限高 256），变体是 `tools/build-images.sh`（cwebp 幂等）预生成的仓库物理文件，**源 JPEG 一律保留不动**。新增/替换任何 JPEG 后必须重跑该脚本（tests 守卫缺档即红）；手机端由 variant() 视口钳制自动落 w800。**灯箱与 PDF 导出（?print=1）永远吃原图**；变体缺失线上一次性 onerror 回退原 JPEG。⚠️ macOS bash 3.2：`local a=$1 b="${a%.*}"` 同行声明 b 拿不到 a——写 shell 工具时拆行
- 媒体：`video-local` / `iframe-lazy` 一律门面点击才加载；视频 ffmpeg H.264 crf26 `+faststart` <30MB，原片留 `../源文件/`
- 资产文件名全小写（GH Pages 大小写敏感）；`annotations` 图注内联 JSON（图右下 12px 文字球）
- **↗ 箭头铁律（2026-07-12）**：裸 U+2197 在 iOS 渲染成 emoji（Monterey unicode-range 只到 U+2122，回退落 Apple Color Emoji）——标题旁独立箭头一律用 `extArrow()` 内嵌 SVG（project-detail/architecture/portfolio 三份同源 helper，stroke currentColor）；文本文案里的 ↗ 一律写「↗︎」（带 FE0E 文本变体选择符；数据侧文案经 `fe()` 归一化）。新增文案勿再写裸 ↗
- **分享卡**：六页 og:image = `assets/brand/share-card.jpg`（1200×630 灰阶品牌卡，要素收在中央 630 方形安全区适配微信裁方；og/twitter/canonical 一律 alnt-med.netlify.app 绝对 URL）。重新生成：headless Chrome 截 `tools/share-card.html` → sips 压 JPEG（命令在该文件头注释）

## AI 产品作品集 `portfolio/`（2026-07-07 新增 + 当日二迭代，A4 定版信息流 + 双语 PDF）

- **同步铁律**：产品文案（title/one_liner/七段 sections/tech_stack/keywords/award/url）一律运行时 join `config/projects.json`；`config/portfolio.json` 只放作品集特有信息（页序=products 数组序、场景 rows、截图清单+ratio、窗框 frame、指标带 metrics、lineart、个人页 profile、建筑矩阵）。**改产品文案永远改 projects.json**，两边自动同步；`tests/portfolio.test.mjs` 守卫禁文案漂移。
- **正文页横向行模块铁律（2026-07-08 三轮用户裁定，勿再做左右双栏正文）**：场景页 = 页头（kicker+sec-h）+ 行模块纵向依次码放，每行横向满宽，行只有六种——`{text:true}` 一文 / `{text:true,img:i,img_mm}` 一文一图（少数）/ `{imgs:[i]}` 一图 / 两图 / 三图（等高对齐 flex-grow=ratio）/ `{sec:"节名"}` 独立文字节模块（自带 sec-h 标题引用另一节文案，2026-07-10：画廊详情里写了的节，作品集必须都有）。图行可选 **`w_mm`（2026-07-12 新增）：行按定宽居中、行高等比降**（`.scene-row--capped`——portfolio.js 直写 mm、project-detail.js 按主区 167mm 折百分比、mapped ≤600 断点释放满宽），竖长图两图行的降压阀。配置在 `scenes[].rows`（下标引用 images，每图恰好引用一次；sec 必须命中五节之一，tests 守卫）。二迭代的 split/split-band 双栏被用户整体推翻，勿恢复。
- **版式**：A4 定版 `.sheet`（mm 页盒 + overflow:hidden + break-after:page），共 **23 页**（2026-07-12：Meco 对话日程+一屏看板两页合一——用户裁定「排不上就分开两面、两页都空，效果很差」；此前 07-11 V2 Yi-Jian 两页合一同理）；文案改长会触发溢出探测（屏显红描边 + console.warn），别让它默默裁切。**六作体系**：rail/INDEX 01-06，第 06 项=建筑合集（JS 由 architecture 合成，products 保持 5 项）。**索引双档**：产品封面页=完整 26mm rail；场景/线稿/建筑页=极简 rail（`.rail--mini`，主区加宽到 167mm）。
- **作品封面统一紧凑模板**：kicker→标题→keywords→双栏（左 tldr｜右封面方图+奖项）→指标带（**TOP n% 一律放第一列**，2026-07-11 V2 用户裁定）→**落地页说明头**（**英文大标题 lede_en（拉丁 Monterey）+ 中文解释 lede_zh 小注**——「英文大标+中文解释」全站口径，话术有人味如「Click once — the agents do the rest. / 点击，然后让 Agent 替你干活。」，用户会自己调词。**小标签行「落地页 · THE LANDING PAGE」2026-07-11 V2 用户裁定统一去掉**——cover 不再写 label_zh/label_en，渲染器对缺省 label 不出标签行，勿再加回）→底部主要落地页大图+图注；metrics/cover **有字段才渲染**——占位作品日后补字段即自动升级，零代码。（one_liner 不在封面：见线稿块的文字零重复铁律；UABB 无线稿页且 2026-07-11 V2 起 one_liner 置空=全册不出现，勿补写。）
- **图注铁律（2026-07-08 六轮用户裁定）**：**真实场景截图一律带图注**（caption_zh/en，9.5px 居中灰），包括封面落地页大图；线稿不算真实场景（注释烧在 SVG 内）。
- **模块间隔铁律（同上）**：**不同内容的模块之间间隔拉大**（如线稿块 ↔ 场景正文 = 13mm、影片块上间距 11mm）；同一模块内的行保持 4-5mm。
- **线稿标题版式 = 通用分隔模块定式（同上）**：「拉丁 Monterey 核心语句大标题 + 中文小注 + 辅文」左、图右——线稿块与**影片门面**（motto「Watch it work. / 看它跑起来」+ 观看外链 + 海报右）均用此定式；后续需要与正文分隔的异质模块优先套用。
- **正文排满规则（2026-07-08 用户裁定）**：正文页尽量排满——内容不足半页的模块并入相邻页。落地实现：有场景页的作品，线稿块并入首场景页顶部（不单独成页）；仅无场景页的作品保留独立线稿页。共 **23 页**（3 前页 + Pears 4 / Co-work 4 / Yi-Jian 3 / Meco 3 / UABB 4 + 建筑 1 + 封底；Pears/Yi-Jian/Meco 各带「brief」文字页=线稿块+Why+核心贡献；Yi-Jian 第三页（2026-07-12 重排）=HIW 满宽一文 + **功能模块+立场 `w_mm:120` 两图行 + 热力图+报告 `w_mm:132` 两图行** + Impact 节——**0.39 竖长图进两图行满宽必炸页（实测 zh 307mm），一律配 w_mm 定宽**（实测 cap-vs-foot zh −14.3 / en −6.3mm）；Meco 第三页（同日合页）=HIW 满宽一文 + 飞书+知识库 `w_mm:118` + Impact 节 + 学习+工作板块 `w_mm:134`（zh −13.5 / en −5.3mm）；UABB 无线稿、首场景页=Why+一文一图+核心贡献混排、尾场景页=**纯图页（scene 省 copy_ref=不渲染节头不补正文，tests 已放行）**——UABB 的 Impact 节 2026-07-11 V2 用户删除，全册与画廊都不再渲染，勿加回）。
- **Mac 窗框三灯 = macOS 原色**（#FF5F57/#FEBC2E/#28C840，2026-07-07 二轮用户裁定）：三灯与截图/封面素材是灰阶体系仅有的色彩例外；个人页人像也保持彩色（勿加黑白滤镜）。
- **⚠️ 体积铁律：打印态禁 CSS filter**——filter 迫使 Chrome 把 JPEG 重栅格成无损位图（实测建筑页 6 图 150KB/张→1MB/张，全册 16MB）。屏显 saturate 调色保留，`@media print` 一律 `filter:none`（portfolio.css 打印块）。
- **视频/交互影片**：作品集页绝不内嵌 video/iframe（与门面点击约定互斥、打印会空框）——一律 poster + 播放角标 + 外链 `<a>`（PDF 里自动成可点注记）。
- **PDF 导出**：`bash tools/export-portfolio-pdf.sh`（必须本机 macOS 跑，中文落宋体；URL 自带 `&print=1`——portfolio.js 的打印门，图保持 eager+sync+原 JPEG，屏显 lazy+WebP 不影响导出）→ `uploads/portfolio-ai.pdf`（中）+ `portfolio-ai-en.pdf`（英），母版归档 `../源文件/AI作品集/`。页数应=**23**；**绝不 gs 压缩**（soft-mask 拍扁）；体积靠素材 ≤300KB（`assets/portfolio/`，源图在 `../产品-详情图/`）。**册尾 PDF 入口（2026-07-11 用户要求 · 07-12 扩到两处）**：portfolio/ 封底后渲染 `.deck-pdf`（screen-only，print 隐藏，随语言指向 zh/en 版；描边盒按钮样式=对齐 .lang-toggle 方角 idiom，hover 反白）+ architecture.html 尾声 `.ao-pdf`（ao-alt 同款 pill，消费 portfolio.json `architecture.pdf` 相对路径 → uploads/portfolio.pdf）——用户自导出通道就这两处 UI 入口，**其余访客侧入口仍一律指网页阅读器**（07-10 铁律不变）。
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
- 老铁律沿用：页面永不解说系统机制；奖项「奖名 · 中文等级」两段式；产品名 Pears / Co-work / **Yi-Jian**（2026-07-11 用户裁定统一改名，勿写 议见 Yijian/Yijian；中文正文里的产品自称「议见」保留）。
- **禁填充与元叙事（2026-07-10 用户裁定）**：① 不写计数填充语（「六个作品 / 六件 / SIX WORKS」）；② 不写把建筑说成 AI 铺垫的元叙事 / 来处（「体系化训练的来处 / 是我的来处 / 来时路 / 训练场」——首页英雄区亦已按此改为「建筑设计出身 · ARCHITECTURE by training」）；③ 不写册子指引（「完整版另册」，PDF 现仅作用户导出、不在访客 UI）。封面 / 目录 / 尾声只放作品本身，不解说意义、不拔高。**建筑阅读器（architecture.html）每作只渲染三段**：先说结论 + 为什么做这个 + 系统如何运作——其余段落多为补写、显牵强；完整七段仍存 `config/projects.json`，详情页 `project.html` 照旧完整显示。

## 部署（不变）

改完 commit + `git push origin main` → GitHub Actions 自动部署 Netlify `alnt-med`。**不要**脱离仓库手动 `netlify deploy`。
本地预览必须 HTTP：`python3 -m http.server 8080`（Claude Code 用预览配置 persona-site:8099）。
- **缓存头（2026-07-13）**：`_headers` 给 `/assets|works|xtool` 配了 30 天 + SWR——**原地替换同名图片可能被缓存 30 天，改图优先换文件名**；`edgeone.json` 是 EdgeOne Pages 镜像的跳转配置（它不读 `_redirects`/`_headers`）。
