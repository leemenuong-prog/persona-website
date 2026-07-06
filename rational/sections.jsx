/* ══════════════════════════════════════════════════════════════
   sections.jsx — Hero · Whoami · Chapter · Works · Contact
   English-led, Chinese annotations. Tone per section drives the
   full-page background (handled by the engine in app.jsx).
   ══════════════════════════════════════════════════════════════ */

const { useState: useSecState, useEffect: useSecEffect, useRef: useSecRef } = React;

/* ── HERO ─────────────────────────────────────────────────── */
function Hero({ jump }) {
  return (
    <section className="hero sec" id="hero" data-tone="ink" data-screen-label="HERO" style={{ position: "relative", padding: 0 }}>
      <div className="band-slot" aria-hidden="true"></div>
      <div className="hrule"></div>
      <div className="hbar mono">
        <span>ALNT MED'S SPACE</span>
        <span className="hbar-nav">
          <a href="#whoami" data-hov onClick={(e) => { e.preventDefault(); jump("whoami"); }}>WHOAMI</a>
          &nbsp;/&nbsp;
          <a href="#works" data-hov onClick={(e) => { e.preventDefault(); jump("works"); }}>WORK</a>
          &nbsp;/&nbsp;
          <a href="#contact" data-hov onClick={(e) => { e.preventDefault(); jump("contact"); }}>CONTACT</a>
        </span>
        <span>SHENZHEN · 22.54°N 114.05°E</span>
      </div>
      <div className="hlow">
        <div className="hl-left">
          <div className="roles">
            <span style={{ "--i": 0 }}>AIPM<i className="psq" aria-hidden="true"></i></span>
            <span style={{ "--i": 1 }}>Developer<i className="psq" aria-hidden="true"></i></span>
            <span style={{ "--i": 2 }}>Architect<i className="psq" aria-hidden="true"></i></span>
            <span style={{ "--i": 3 }} className="dim">— anything.</span>
          </div>
        </div>
        <div className="hl-right">
          <div className="hl-ghost" data-ghostrows aria-hidden="true">
            <div>AIPM Developer Architect AIPM Developer Architect</div>
            <div>Developer Architect AIPM Developer Architect AIPM</div>
            <div>Architect AIPM Developer Architect AIPM Developer</div>
            <div>AIPM Developer Architect AIPM Developer Architect</div>
          </div>
          <div className="hl-brand">
            <div className="of">Alnt Med — The Art of</div>
            <div className="big">RATIONALITY</div>
            <span className="zh">理性的艺术 · AI 产品 × 开发 × 建筑</span>
            {/* HR 快速通道 — 两枚安静的 chip，直达证据与联系方式 */}
            <div className="hero-chips">
              <a href="#works" data-hov onClick={(e) => { e.preventDefault(); jump("works"); }}>
                <i className="sq" aria-hidden="true"></i>看作品 · WORK<span className="arr" aria-hidden="true">↓</span>
              </a>
              <a href="#contact" data-hov onClick={(e) => { e.preventDefault(); jump("contact"); }}>
                <i className="sq" aria-hidden="true"></i>联系我 · CONTACT<span className="arr" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-cue mono"><span>SCROLL</span><span className="ln"><i></i></span></div>
    </section>
  );
}

/* ── WHOAMI — rebuilt in the 字⇄条 language: the question is
   born from bars (the loader's grammar, in reverse), the answer
   ends in the blue period. Hover the word to replay the morph. ─ */
/* the time skyline — ten real periods, verified against the résumé.
   The pivot year dips on purpose: a reset before the peak. */
const WHO_CHRONO = [
  { y: "2020", h: 0.3,  tag: "ARCHITECTURE",     t: "GZHU — B.Arch 入学",                          zh: "广州大学建筑学学士" },
  { y: "2024", h: 0.56, tag: "ARCHITECTURE",     t: "Ring-World 环·世界 — NCDA 一等奖",            zh: "「NCDA」未来设计师全国数字设计大赛 一等奖 · 车辆段上盖 · 动态隔音幕墙" },
  { y: "2025", h: 0.84, tag: "ARCHITECTURE",     t: "挑战杯 — 特等奖 · Top 1%",                    zh: "蒋巷文脉·科链智谷 2.0 · 产村双向赋能 · 项目组长" },
  { y: "2025", h: 0.68, tag: "RESEARCH",         t: "《建筑学报》T1 — 第二作者",                   zh: "国内建筑领域 T1 核心期刊 · AIGC 三维空间优化" },
  { y: "2025", h: 0.6,  tag: "ARCH × AI",        t: "UABB AIGC Pipeline · 板块唯一学生代表",        zh: "深港双年展 · 多模态 AIGC 负责人" },
  { y: "2025", h: 0.5,  tag: "THE PIVOT",        t: "SZU M.Arch · 转向 AI 产品",                    zh: "建筑学（复合 AI 方向）硕士 · 垂直 Agent AIPM" },
  { y: "2025", h: 0.72, tag: "AI PRODUCT",       t: "菩苇科技 — AI 产品实习",                       zh: "清华系初创 · 垂直领域 RAG Agent" },
  { y: "2026", h: 0.92, tag: "AI PRODUCT",       t: "议见 Yijian — 企业 Agent 黑客松亚军",          zh: "香港中文大学 · 决策共识 Agent · 四层共识 · 七角色审议" },
  { y: "2026", h: 0.88, tag: "AI PRODUCT",       t: "Pears — Agent Factory · 黑客松季军",          zh: "「观察 → 生成 → 强化」 · 现场企业对接意向最多项目之一" },
  { y: "2026", h: 1,    tag: "AI PRODUCT · NOW", t: "Co-work Agent Platform — 0→1",                zh: "覆盖 4 部门 · 65 人 · 完成率 80%+ · 每投入 $1 省 0.39 工时（高于 2026 企业均值 0.2–0.3）" },
];

/* the index — two identities, as a jump table. Left: number · BarWord
   title (跳色 period) · motto + proof. Right (desktop): a life photo, matted
   like a print with a drop shadow (用户: 左边索引，右边生活照，阴影卡一下).
   Click a row jumps into its chapter; hover focuses the row, the rest recede. */
const WHO_INDEX = [
  { id: "aipm", ix: "01", tx: "An AIPM", d: 0,
    mt: "From idea to shipped AI", zh: "让 AI 贴合真实场景，从想法到落地",
    band: [0.85, 0.6, 1, 0.55] },
  { id: "architect", ix: "02", tx: "An Architect", d: 0,
    mt: "Scattered needs into a system", zh: "把零散的需求搭成稳定的体系",
    band: [1, 0.66, 0.5, 0.9] },
];

function Whoami({ jump }) {
  const { BarWord, BarBand, BarChrono } = window;
  return (
    <section className="whoami sec" id="whoami" data-tone="ink" data-ob data-screen-label="WHOAMI">
      <div className="who-top">
        <div className="kick lm"><span>01 · WHOAMI / 我是谁</span></div>
        <div className="who-tag mono" data-rv style={{ "--rd": ".1s" }}>AIPM · ARCHITECT</div>
      </div>
      <h2 className="who-q rv-soft" style={{ "--rd": ".2s" }}>
        <BarWord text="WHOAMI" static />
      </h2>
      {/* 他唯一允许的自述格言 — 中文为主，英文平实直译作点缀 */}
      {/* 编排链从 3.1s 压到 ≤1.6s——触发点在滚入 28vh 处，旧链快滚到场时
          还在演中段、慢滚到场时早已演完；短链让节奏跟得上手 */}
      <p className="who-lede" data-rv style={{ "--rd": ".5s" }}>
        我不追更快的马，想知道这趟路是不是该换种走法。
        <span className="en">I'm not chasing a faster horse — I'm asking whether this road needs a different way of walking.</span>
      </p>
      <div className="rule who-rule" style={{ "--rd": ".65s" }}></div>

      <div className="who-index">
        <div className="who-index-list">
          <div className="dex-head kick">
            <span data-rv style={{ "--rd": ".8s" }}>INDEX / 两个身份 — I AM …</span>
            <span data-rv style={{ "--rd": ".9s" }}>点击进入章节 · CLICK TO ENTER</span>
          </div>
          <div className="dex-list">
            {WHO_INDEX.map((it, i) => (
              <div key={it.id} className="dex-it" data-hov role="button" tabIndex={0}
                   style={{ "--rd": (0.95 + i * 0.15) + "s" }} onClick={() => jump(it.id)}
                   onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); jump(it.id); } }}>
                <span className="ix mono" data-rv style={{ "--rd": (1.0 + i * 0.18) + "s" }}>{it.ix}</span>
                <BarWord className="tx rv-soft" text={it.tx} static />
                <div className="side" data-rv style={{ "--rd": (1.1 + i * 0.18) + "s" }}>
                  <BarBand h={it.band} />
                  {/* 中文为主：他的中文一句话是正文，英文 motto 缩为点缀 */}
                  <div className="mt">{it.zh}</div>
                  <div className="zh">{it.mt}</div>
                </div>
                <span className="arr" aria-hidden="true">→</span>
              </div>
            ))}
          </div>
          <div className="dex-note kick" data-rv style={{ "--rd": "1.6s" }}>ONE DISCIPLINE · TWO PROOFS — 一种理性，两个证明</div>
        </div>
        <div className="who-index-photo" data-rv style={{ "--rd": "1.0s" }}>
          <figure className="who-photo-card">
            <img src="uploads/whoami-portrait.jpg" alt="李文苑 · Lee Wenyuan" loading="lazy" />
            <figcaption className="mono">李文苑 · LEE WENYUAN — 深圳</figcaption>
          </figure>
        </div>
      </div>

      <div className="who-chrono">
        <div className="kick" data-rv style={{ "--rd": ".5s" }}><span>CHRONO / 成就时间柱 — 点选回看 · TAP A YEAR</span></div>
        <BarChrono items={WHO_CHRONO} />
      </div>
    </section>
  );
}

/* (死代码 Chapter/RingText 已删 — 2026-07-06 改版:身份章改由 chapters.jsx
   的 ChAipmOpen/ChArch + intro 系列承担,此通用 Chapter 模板不再使用。) */

/* typed governance config — the AIPM chapter's right panel */
const CODE_TEXT = [
  ["c", "// governance.config.ts — AI builds, I govern\n"],
  ["k", "const"], ["p", " pipeline = {\n"],
  ["p", "  observe: "], ["k", "\"incident\""], ["p", ",\n"],
  ["p", "  distill: "], ["k", "\"rule\""], ["p", ",\n"],
  ["p", "  verify:  "], ["k", "\"static-test\""], ["p", ",\n"],
  ["p", "  enforce: "], ["k", "\"merge-gate\""], ["p", ",\n"],
  ["p", "};\n"],
  ["c", "// 事故 → 规则 → 测试 → 门禁\n"],
  ["c", "// zero recurrence since.\n"],
  ["k", "export default"], ["p", " pipeline;"],
];

function CodePanel() {
  const ref = useSecRef(null);
  useSecEffect(() => {
    const el = ref.current; if (!el) return;
    const flat = [];
    CODE_TEXT.forEach(([cls, txt]) => { for (const ch of txt) flat.push([cls, ch]); });
    let shown = -1;
    const stop = window.__addLoop(() => {
      const p = (window.__progress && window.__progress.aipm) || 0;
      const want = Math.floor(aSeg(p, 0.18, 0.7) * flat.length);
      if (want === shown) return;
      shown = want;
      let html = "";
      let cur = null;
      for (let i = 0; i < want; i++) {
        const [cls, ch] = flat[i];
        if (cls !== cur) { if (cur) html += "</span>"; html += `<span class="${cls === "p" ? "" : cls}">`; cur = cls; }
        html += ch === "\n" ? "\n" : ch.replace("<", "&lt;");
      }
      if (cur) html += "</span>";
      el.innerHTML = html + '<span class="caret"></span>';
    });
    return () => stop();
  }, []);
  return <div className="code-panel" ref={ref} aria-hidden="true"></div>;
}

/* ── 建筑四作 — 降级为子数据,供 IntroArchfolio 合并翻书 ──
   pages[]/doc/zh/award/role 一字不动;整组从 WORKS 搬到这里(2026-07-06 改版:
   六卡画廊里建筑四作合并成「建筑作品集」一张卡)。 */
const ARCH_WORKS = [
  {
    ix: "W·01", t: "After_Silence", display: "After_Silence", tag: "ARCHITECTURE", year: "2025", identity: "Architect",
    award: "深港双年展 UABB · 板块代表作品",
    doc: "uploads/portfolio.pdf#page=3",
    pages: ["works/portfolio/aftersilence-1.jpg", "works/portfolio/aftersilence-2.jpg"],    role: ["设计主创", "Design lead"],
    body: "When the engines fall silent, life begins — a closed habitat loop for the first Mars base.",
    zh: "「当震耳欲聋的引擎彻底沉寂，真正的生活才刚刚开始。」以首座火星基地「首航组团」为原型，把功能模块转化为生活场景，提出居住、能源、科研相互依存的「火星人居闭环」。作为板块代表展品，以混合现实形式在深港双年展主展厅虚拟上线。",
  },
  {
    ix: "W·02", t: "上桥 Upper-Via", display: "上桥", tag: "ARCHITECTURE", year: "2023", identity: "Architect",
    award: "「活力杯」大湾区高校设计大赛 · 一等奖",
    doc: "uploads/portfolio.pdf#page=5",
    pages: ["works/portfolio/shangqiao-1.jpg", "works/portfolio/shangqiao-2.jpg", "works/portfolio/shangqiao-3.jpg", "works/portfolio/shangqiao-4.jpg"],    role: ["项目组长", "Project lead"],
    body: "A bridge-library stitching Lychee Bay's two banks back together.",
    zh: "荔枝湾水系曾聚人，如今却隔开两岸。高密度老城无地可用，便把公共空间「上桥」外置水面：移动书柜让同一座桥在书屋、放学等候、社区活动三种模式间切换。绣花针式的城市更新，并与拟落地项目对接实施。",
  },
  {
    ix: "W·03", t: "风贯·立方 Air Cube", display: "风贯·立方", tag: "ARCHITECTURE", year: "2025", identity: "Architect",
    award: "2025 优秀毕业设计展 · 卓越奖",
    doc: "uploads/portfolio.pdf#page=9",
    pages: ["works/portfolio/aircube-1.jpg", "works/portfolio/aircube-2.jpg", "works/portfolio/aircube-3.jpg"],    role: ["设计主创 · 毕业设计", "Design lead"],
    body: "A factory-upstairs block whose public void doubles as its cooling wind corridor.",
    zh: "为科力新能源大湾区 IDC 研发中心做的「工业上楼」产城融合：生产抬升至三层及以上，二层整体架空为公共空间、兼作通风廊道，热压通风自然降温；穿孔铝板幕墙与垂直绿化动态遮阳，冷巷架空层调节微气候，装配式钢结构、光伏与雨水循环压低能耗。",
  },
  {
    ix: "W·04", t: "环·世界 The Ring-World", display: "环·世界", tag: "ARCHITECTURE", year: "2024", identity: "Architect",
    award: "「NCDA」未来设计师全国数字设计大赛 · 一等奖",
    doc: "uploads/portfolio.pdf#page=18",
    pages: ["works/portfolio/ringworld-1.jpg", "works/portfolio/ringworld-2.jpg", "works/portfolio/ringworld-3.jpg"],    role: ["项目组长", "Project lead"],
    body: "The public realm flipped vertical — a roaming loop and an acoustic façade trading view against silence.",
    zh: "车辆段上盖、昼间 72 分贝、公共空间仅为商品住宅 35% 的租赁社区。把公共空间垂直翻转：双层立体漫游环串联屋顶花园与共享客厅；临声面以参数化动态隔音幕墙围合，依据 SoundPlan 噪声模拟实时权衡视野与隔音，释放出 5000 ㎡ 的共享场域。",
  },
];

/* ── WORKS — 六卡画廊数据（2026-07-06 改版：作品前置、身份合并两组）─────
   AIPM 组：Pears · Co-work · 议见 · Meco(进行中)  ·  Architect 组：多模态 · 建筑作品集
   字段：key(稳定查询键) · introId(点击卡片滚动锚点) · group(aipm/architect,画廊分区)
   · status(live/in-progress) · heroCover(正式竖封面,留空则用 CoverArt 程序化占位)
   · 其余(t/display/tag/year/identity/award/link/links/poster/video/embed/role/body/zh)沿用。
   两处章内 lookup(IntroPears/IntroCowork)改为按 key 查询,与此处一致。 */
const WORKS = [
  {
    key: "pears", ix: "W·01", introId: "intro-pears", group: "aipm", status: "live",
    t: "Pears — Agent Factory", display: "Pears", tag: "AI PRODUCT", year: "2026", identity: "AIPM",
    award: "ADVENTURE-X 高校联盟黑客松 · 季军",
    link: "https://and-pear.netlify.app/login",
    links: [
      { label: "访问应用 · PEARS APP ↗", url: "https://and-pear.netlify.app/login" },
      { label: "产品官网 · OFFICIAL SITE ↗", url: "https://pear-web-leemenuong.netlify.app/" },
    ],
    poster: "works/pears-roadshow-cover.jpg", video: "works/pears-roadshow.mp4", videoReady: true, role: ["独立构建 0 → 上线", "Solo build"],
    body: "Do it once — Pears watches, distills a PRD, and builds your own workflow agent.",
    zh: "想法来自我在 XTOOL 的观察：一个开发团队，永远填不满全公司的 Agent 需求——那就把门槛从「描述 AI」降到「做一遍」。我做的浏览器插件看你把工作做一遍，把轨迹蒸馏成可编辑的 PRD，再由 AI 编码 Agent 生成你专属的 Workflow Agent。现场企业对接意向最多的项目之一。",
  },
  {
    key: "cowork", ix: "W·02", introId: "intro-cowork", group: "aipm", status: "live",
    t: "Co-work Agent Platform", display: "Co-work", tag: "AI PLATFORM", year: "2026", identity: "AIPM",
    poster: "xtool/screenshots/demo_review.png", embed: "xtool/", link: "https://peersagent.netlify.app/",
    links: [{ label: "访问平台 · CO-WORK PLATFORM ↗", url: "https://peersagent.netlify.app/" }], role: ["AIPM · 平台负责人", "Intern · platform owner"],
    body: "A one-person build of the department's agent OS — seven tools, four departments.",
    zh: "我在 XTOOL 单人把部门 Agent 平台从 0 做到 1：7 个生产工具铺满内容生产链。埋点告诉我 Hook 段流失 52%，判断是高创意内容无法一次成型，于是合并生成阶段、三候选并出，推动三代迭代。现覆盖 4 部门 65 人，完成率 80%+；自建 ROI 看板——每投入 $1 省 0.39 工时。",
  },
  {
    key: "yijian", ix: "W·03", introId: "intro-yijian", group: "aipm", status: "live",
    t: "议见 Yijian — Consensus Engine", display: "议见 Yijian", tag: "AI PRODUCT", year: "2026", identity: "AIPM",
    award: "香港中文大学企业 Agent 黑客松 · 亚军",
    link: "https://yijian-demo4.netlify.app",
    links: [{ label: "在线体验 · LIVE DEMO ↗", url: "https://yijian-demo4.netlify.app" }],
    poster: "works/yijian-cover.jpg", embed: "https://yijian-demo4.netlify.app", role: ["产品与开发", "Product & build"],
    body: "A consensus engine for enterprise decisions — four layers, one auditable verdict.",
    zh: "给企业团队做的「决策共识」Agent。把一项待决策的事交给它——选方案、加预算、进不进一个市场——它组织多角色视角，在战略目标、事实证据、利益角色、权重权责四层收敛分歧，最后给出可追溯的结论：共识度评分、决策要满足的条件、仍待解决的分歧点。",
  },
  {
    key: "meco", ix: "W·04", introId: "intro-meco", group: "aipm", status: "in-progress",
    t: "Meco", display: "Meco", tag: "AI PRODUCT", year: "2026", identity: "AIPM",
    role: ["独立构建", "Solo build"],
    body: "In progress — a new AI product taking shape.",
    zh: "一个正在做的 AI 产品。等它成形，我会把完整的故事放上来。",
  },
  {
    key: "uabb", ix: "W·05", introId: "intro-uabb", group: "architect", status: "live",
    t: "UABB · AIGC Pipeline", display: "多模态工具", tag: "AIGC PIPELINE", year: "2025", identity: "Architect",
    award: "深港双年展 UABB 2025 · 板块唯一学生代表",
    poster: "works/aftersilence-cover.jpg", video: "works/aftersilence.mp4", videoReady: true, role: ["多模态 AIGC 负责人", "UABB 2025 curatorial team"],
    body: "A ComfyUI + API pipeline that cut 50+ exhibits' processing from 30 days to 5.",
    zh: "我给双年展搭了一条 ComfyUI 外接 API（Gemini / Tripo）的自动化转译工作流，加一套标准化 3D 资产 SOP：50+ 非标展品的处理周期从 30 天缩到 5 天。背后是 120+ 次草图与模型迭代，最后我带着这套管线在展会现场做了分享。",
  },
  {
    key: "archfolio", ix: "W·06", introId: "intro-archfolio", group: "architect", status: "live",
    t: "建筑作品集 Architecture Portfolio", display: "建筑作品集", tag: "ARCHITECTURE", year: "2023–25", identity: "Architect",
    award: "一等奖 ×2 · 卓越奖 · UABB 代表作品",
    doc: "uploads/portfolio.pdf", role: ["设计主创 / 项目组长", "Design lead"],
    body: "Four architecture projects — constraints turned into places worth staying in.",
    zh: "四件建筑作品：从火星人居到旧城更新，把互相冲突的限制收敛成能让人待下去的体系。",
    works: ARCH_WORKS,
  },
];

/* 作品短名 — 画廊卡 / 翻书组件用(去掉英文副标题与破折号后缀)。 */
const wkShort = (wk) => wk.display || wk.t.split(/\s+—\s+|\s+·\s+/)[0];
/* (旧 scroll-scrub 卡组的 OVR_BARS / clp / lerp / smooth / eOut 已随卡组退役 —
   2026-07-06 改版:作品改由 WorksGallery 网格墙 + data-ob 一次性进场承担。) */

/* ── the portfolio flip-book — for the architecture works whose body
   lives as作品集 spreads. The same .sc-media 16:9 frame, but the A3 page
   sits object-fit:contain (whole spread visible) and ‹ › flip through
   THIS work's pages only (After_Silence = 2, 上桥 = 4, …). Square pips =
   the period motif, doubling as the page index. 条 → 页. ── */
function WorkGallery({ wk }) {
  const [idx, setIdx] = useSecState(0);
  const tsx = useSecRef(null);
  const n = wk.pages.length;
  const go = (d, ev) => { if (ev) { ev.preventDefault(); ev.stopPropagation(); } setIdx((i) => (i + d + n) % n); };
  return (
    <div className="sc-media gallery"
         tabIndex={0}
         onKeyDown={(e) => { if (e.key === "ArrowLeft") go(-1, e); else if (e.key === "ArrowRight") go(1, e); }}
         onTouchStart={(e) => { tsx.current = e.touches[0].clientX; }}
         onTouchEnd={(e) => {
           /* horizontal swipe flips the spread; the deck's vertical scroll-scrub
              is untouched. stopPropagation so a flip doesn't also nudge the scrub. */
           if (tsx.current == null) return;
           const dx = e.changedTouches[0].clientX - tsx.current; tsx.current = null;
           if (Math.abs(dx) > 40) { e.stopPropagation(); go(dx < 0 ? 1 : -1); }
         }}>
      {wk.pages.map((src, i) => (
        <img key={i} className={"sc-still gl-page" + (i === idx ? " on" : "")}
             src={src} alt={wkShort(wk) + " · 作品集 " + (i + 1) + "/" + n}
             draggable="false" loading={i === 0 ? "eager" : "lazy"} aria-hidden={i !== idx} />
      ))}
      {n > 1 && (
        <React.Fragment>
          <button className="gl-nav prev" type="button" data-hov aria-label="上一页"
                  onClick={(e) => go(-1, e)}><span aria-hidden="true">‹</span></button>
          <button className="gl-nav next" type="button" data-hov aria-label="下一页"
                  onClick={(e) => go(1, e)}><span aria-hidden="true">›</span></button>
          <span className="gl-pips" role="tablist" aria-label="作品集翻页">
            {wk.pages.map((_, i) => (
              <i key={i} className={i === idx ? "on" : ""} role="tab" aria-selected={i === idx}
                 onClick={(e) => { e.stopPropagation(); setIdx(i); }}></i>
            ))}
            <b className="gl-count mono">{String(idx + 1).padStart(2, "0")}/{String(n).padStart(2, "0")}</b>
          </span>
        </React.Fragment>
      )}
    </div>
  );
}

/* ── the showcase media — a real inline film when the work has one,
   a portfolio flip-book when it ships spreads, else the poster (links
   out), else the TBD placeholder. Every branch reuses the SAME .sc-media
   frame so all eight read identically. ── */
function WorkMedia({ wk }) {
  const vidRef = useSecRef(null);
  const [playing, setPlaying] = useSecState(false);
  const [framed, setFramed] = useSecState(false);
  if (wk.pages && wk.pages.length) return <WorkGallery wk={wk} />;
  if (wk.video && wk.videoReady) {
    return (
      <div className={"sc-media" + (playing ? " playing" : "")}>
        <video ref={vidRef} className="sc-still" src={wk.video} poster={wk.poster}
               preload="none" playsInline controls={playing}
               onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
               onEnded={() => setPlaying(false)}></video>
        {!playing && (
          <button className="sc-play" type="button" data-hov aria-label={"播放 · " + wkShort(wk)}
                  onClick={() => { const v = vidRef.current; if (v) v.play(); }}>
            <span className="tri"></span>
          </button>
        )}
      </div>
    );
  }
  if (wk.embed) {
    if (framed) {
      return (
        <div className="sc-media playing">
          <iframe className="sc-still" src={wk.embed} title={wkShort(wk)}
                  loading="lazy" allow="autoplay; fullscreen"></iframe>
        </div>
      );
    }
    return (
      <button className="sc-media" type="button" data-hov aria-label={"播放 " + wkShort(wk)}
              onClick={() => setFramed(true)}>
        {wk.poster
          ? <img className="sc-still" src={wk.poster} alt={wkShort(wk)} loading="lazy" draggable="false" />
          : <span className="sc-still"></span>}
        <span className="sc-play" aria-hidden="true"><span className="tri"></span></span>
      </button>
    );
  }
  if (wk.poster) {
    return (
      <a className="sc-media" href={wk.link} target="_blank" rel="noopener" data-hov>
        <img className="sc-still" src={wk.poster} alt={wkShort(wk)} loading="lazy" draggable="false" />
        <span className="sc-play" aria-hidden="true"><span className="tri"></span></span>
      </a>
    );
  }
  if (wk.doc) {
    return (
      <a className="sc-ph as-link" href={wk.doc} target="_blank" rel="noopener" data-hov>
        <div className="n"><b>查看作品集 ↗</b>PORTFOLIO · 作品集 PDF</div>
      </a>
    );
  }
  return <div className="sc-ph"><div className="n"><b>WORK SHOWCASE</b>作品展示 · 待上线 / TBD</div></div>;
}

/* ── 占位封面 — 六作各一个可识别抽象母题(设计语言三色 + 条/点)。线用
   var(--cardfg)(随卡底自动翻色),句点方块用 var(--cardacc)。正式封面上线后:
   给该卡加 heroCover 图片路径,GalleryCard 改渲 <img>。viewBox 600×600 · slice。 ── */
function CoverArt({ kind }) {
  const fg = "var(--cardfg)", ac = "var(--cardacc)";
  const ln = { fill: "none", stroke: fg, strokeLinecap: "round", strokeLinejoin: "round" };
  const box = () => ({ viewBox: "0 0 600 600", preserveAspectRatio: "xMidYMid slice", className: "gw-cover-svg" });
  if (kind === "pears") {   /* 漏斗:轨迹 → 收敛 → 蒸馏出的 Agent → 方块句点 */
    return (
      <svg {...box()}>
        <g {...ln} strokeWidth="7" opacity=".5">
          {[130, 175, 220, 265].map((y) => [150, 236, 322].map((x) => <line key={x + "_" + y} x1={x} y1={y} x2={x + 50} y2={y} />))}
        </g>
        <path {...ln} strokeWidth="7" d="M150,322 L292,452" />
        <path {...ln} strokeWidth="7" d="M450,322 L308,452" />
        <rect x="284" y="452" width="32" height="84" fill={fg} />
        <rect x="287" y="546" width="26" height="26" fill={ac} />
      </svg>
    );
  }
  if (kind === "cowork") {   /* 闭环七站 + 环心三条 + 交付方块 */
    return (
      <svg {...box()}>
        <rect {...ln} strokeWidth="7" x="90" y="150" width="420" height="320" rx="44" />
        <g fill="none" stroke={fg} strokeWidth="4">
          {[160, 250, 340, 430].map((x) => <circle key={"t" + x} cx={x} cy="150" r="12" />)}
          {[200, 300, 400].map((x) => <circle key={"b" + x} cx={x} cy="470" r="12" />)}
        </g>
        <g {...ln} strokeWidth="7" opacity=".5">
          <line x1="240" y1="290" x2="360" y2="290" />
          <line x1="255" y1="315" x2="345" y2="315" />
          <line x1="248" y1="340" x2="352" y2="340" />
        </g>
        <rect x="497" y="457" width="26" height="26" fill={ac} />
      </svg>
    );
  }
  if (kind === "yijian") {   /* 四层收敛 → 共识贯通条 + 方块 */
    const rows = [[190, 410], [225, 375], [255, 345], [280, 320]];
    return (
      <svg {...box()}>
        <g {...ln} strokeWidth="14">
          {rows.map(([l, r], i) => (
            <g key={i}>
              <line x1="90" y1={150 + i * 80} x2={l} y2={150 + i * 80} />
              <line x1={r} y1={150 + i * 80} x2="510" y2={150 + i * 80} />
            </g>
          ))}
          <line x1="90" y1="470" x2="510" y2="470" />
        </g>
        <rect x="516" y="458" width="24" height="24" fill={ac} />
      </svg>
    );
  }
  if (kind === "meco") {   /* 未落笔的天际线:前 3 实心,后 5 虚线;句点空心 */
    const H = [0.97, 0.58, 1.0, 0.66, 0.9, 0.52, 0.74, 1.0];
    return (
      <svg {...box()}>
        {H.map((h, i) => {
          const x = 56 + i * 64, top = 470 - h * 300;
          return i < 3
            ? <rect key={i} x={x} y={top} width="40" height={470 - top} fill={fg} />
            : <rect key={i} x={x} y={top} width="40" height={470 - top} fill="none" stroke={fg} strokeWidth="2.5" strokeDasharray="6 8" />;
        })}
        <line {...ln} strokeWidth="3" x1="56" y1="474" x2="544" y2="474" />
        <rect x="552" y="446" width="24" height="24" fill="none" stroke={ac} strokeWidth="3" />
      </svg>
    );
  }
  if (kind === "uabb") {   /* 多源 → 门 → 点阵(其中一粒 = 蓝方块) */
    const cols = [120, 180, 240, 300, 360, 420], rows = [430, 480, 530, 580];
    return (
      <svg {...box()}>
        <g {...ln} strokeWidth="4">
          <line x1="150" y1="96" x2="292" y2="236" />
          <line x1="300" y1="76" x2="300" y2="236" />
          <line x1="450" y1="96" x2="308" y2="236" />
        </g>
        <rect x="268" y="240" width="16" height="110" fill={fg} />
        <rect x="316" y="240" width="16" height="110" fill={fg} />
        {rows.map((y) => cols.map((x) => (
          (x === 300 && y === 480)
            ? <rect key={x + "_" + y} x={x - 7} y={y - 7} width="14" height="14" fill={ac} />
            : <circle key={x + "_" + y} cx={x} cy={y} r="6" fill={fg} />
        )))}
      </svg>
    );
  }
  /* archfolio — 等高线台地 + 门槛句点 */
  return (
    <svg {...box()}>
      <rect {...ln} strokeWidth="7" x="120" y="150" width="360" height="330" rx="40" />
      <rect {...ln} strokeWidth="4" x="172" y="196" width="256" height="238" rx="28" />
      <rect {...ln} strokeWidth="2.5" x="224" y="242" width="152" height="146" rx="18" />
      <rect x="456" y="456" width="24" height="24" fill={ac} />
    </svg>
  );
}

/* 卡底色对角排布:cobalt · ink · paper / paper · ink · cobalt(钴蓝坐两角)。
   句点色随卡底翻转(paper→--blue · ink→--blue-up · cobalt→--blue-dn)由 CSS 定。 */
const GW_TONES = ["cobalt", "ink", "paper", "paper", "ink", "cobalt"];

function GalleryCard({ wk, tone, ix, jump }) {
  const inProg = wk.status === "in-progress";
  return (
    <button className={"gw-card gw-t-" + tone + (inProg ? " gw-wip" : "")} type="button" data-hov
            onClick={() => jump(wk.introId)} aria-label={(wk.display || wk.t) + " — 查看介绍"}>
      <div className="gw-cover" aria-hidden="true">
        {wk.heroCover ? <img className="gw-cover-img" src={wk.heroCover} alt="" loading="lazy" draggable="false" /> : <CoverArt kind={wk.key} />}
      </div>
      {inProg && <span className="gw-flag mono">IN PROGRESS · 进行中<i className="gw-flag-sq" aria-hidden="true"></i></span>}
      <div className="gw-info">
        <div className="gw-row1 mono">
          <span className="gw-ix">{"G·" + String(ix + 1).padStart(2, "0")}</span>
          <span className="gw-tagyr">{wk.tag} · {wk.year}</span>
        </div>
        <div className="gw-name">{wk.display || wkShort(wk)}<i className="psq" aria-hidden="true"></i>
          <span className="gw-arr" aria-hidden="true">→</span></div>
        {wk.zh && <div className="gw-line">{wk.zh}</div>}
        {wk.award && <div className="gw-award mono">{wk.award}<i className="gw-award-sq" aria-hidden="true"></i></div>}
      </div>
    </button>
  );
}

/* ── WORKS 画廊 — 六竖卡网格墙,进场「聚拢→散开」(data-ob 一次性,零引擎
   代码);点卡片平滑滚到对应介绍锚点。作品前置到 Whoami 之后,成为全站主角。 ── */
function WorksGallery({ jump }) {
  return (
    <section className="gwall sec" id="works" data-tone="paper" data-ob data-screen-label="WORKS">
      <div className="gw-head">
        <div className="kick lm"><span>02 · WORKS / 作品</span></div>
        <h2 className="gw-title rv-soft" data-ob="self" style={{ "--rd": ".08s" }}>六个作品<i className="psq" aria-hidden="true"></i></h2>
        <p className="gw-sub" data-rv data-ob="self" style={{ "--rd": ".18s" }}>
          两种身份，一种理性。点开任一张看完整介绍。
          <span className="en">Six works, two identities — click any card for the full story.</span>
        </p>
      </div>
      <div className="gw-grid" data-ob="self">
        {WORKS.map((wk, i) => (
          <GalleryCard key={wk.key} wk={wk} tone={GW_TONES[i % GW_TONES.length]} ix={i} jump={jump} />
        ))}
      </div>
    </section>
  );
}

/* ── the finale thread — "I am ___" keeps filling the blank ── */
function IamFinale() {
  const ids = ["Alnt Med", "an AIPM", "an Architect", "a Builder", "anything."];
  const [i, setI] = useSecState(0);
  useSecEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % ids.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="big-name iamf" aria-live="polite">
      <div className="echo" aria-hidden="true">I am {ids[i]}</div>
      <div className="real lm" style={{ "--rd": ".1s" }}>
        <span>I am&nbsp;<span className="who" key={i}>{ids[i]}</span><i className="caret" aria-hidden="true"></i></span>
      </div>
    </div>
  );
}

/* ── CONTACT ──────────────────────────────────────────────── */
function Contact({ jump }) {
  /* WeChat is the #1 channel for a domestic HR — one tap copies the ID */
  const [copied, setCopied] = useSecState(false);
  const copyWeChat = () => {
    const id = "ID_0912";
    const done = () => { setCopied(true); setTimeout(() => setCopied(false), 1600); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(id).then(done, done);
    else done();
  };
  return (
    <section className="contact sec" id="contact" data-tone="paper" data-ob data-screen-label="CONTACT" style={{ paddingLeft: 0, paddingRight: 0 }}>
      <div style={{ padding: "0 clamp(20px, 5vw, 40px)" }}>
        <div className="kick lm"><span>05 · CONTACT / 联系 — 求职方向：AI 产品 · 深圳</span></div>
        <div style={{ marginTop: "3vh" }}>
          <IamFinale />
        </div>
        <div className="c-grid">
          <div className="c-left" data-rv style={{ "--rd": ".3s" }}>
            <div className="cm">CONTACT ME<span className="psq" aria-hidden="true"></span></div>
            <div className="rule crule in"></div>
            <div className="c-note">求职方向：AI 产品经理 · Agent 方向<br />深圳 · 远程亦可
              <span className="en mono">OPEN TO AI PRODUCT ROLES · SHENZHEN / REMOTE</span>
            </div>
          </div>
          <div className="c-list" data-rv style={{ "--rd": ".42s" }}>
            <a className="crow" href="tel:18948953396" data-hov>
              <span className="cl">电话 · Phone</span><span className="cv">+86 189-4895-3396</span>
            </a>
            <a className="crow" href="mailto:1308577030@qq.com" data-hov>
              <span className="cl">邮箱 · E-mail</span><span className="cv">1308577030@qq.com</span>
            </a>
            <a className="crow crow-copy" href="#contact" data-hov role="button"
               onClick={(e) => { e.preventDefault(); copyWeChat(); }}
               aria-label="复制微信号 ID_0912">
              <span className="cl">微信 · WeChat</span>
              <span className="cv">{copied ? "已复制 ✓" : "ID_0912 · 点击复制"}</span>
            </a>
            {/* AI 作品集入口 — 先指向站内作品卡组；静态 AI 作品集页做好后换 href
                TODO: 换成独立静态 AI 作品集页（用户后续单独任务） */}
            <a className="crow" href="#works" data-hov
               onClick={(e) => { e.preventDefault(); jump && jump("works"); }}>
              <span className="cl">AI 作品集 · Portfolio</span><span className="cv">站内浏览 6 个作品&nbsp;→</span>
            </a>
            <a className="crow" href="https://github.com/leemenuong-prog" target="_blank" rel="noopener" data-hov>
              <span className="cl">GitHub</span><span className="cv">@leemenuong-prog&nbsp;↗</span>
            </a>
            <a className="crow" href="https://and-pear.netlify.app/login" target="_blank" rel="noopener" data-hov>
              <span className="cl">Pears · 应用</span><span className="cv">and-pear.netlify.app&nbsp;↗</span>
            </a>
            <a className="crow" href="https://peersagent.netlify.app/" target="_blank" rel="noopener" data-hov>
              <span className="cl">Co-work · 平台</span><span className="cv">peersagent.netlify.app&nbsp;↗</span>
            </a>
          </div>
        </div>
      </div>
      {/* 底部波点带 — 半调渐隐(2026-07-06 用户):页面在化成点,点落成 Logo。
          钴蓝点(跳色只落点),不响应滚动,一次性淡入。 */}
      <div className="fdots" aria-hidden="true"></div>
      <div className="fband-slot" aria-hidden="true"></div>
      <div className="foot">
        <span>© 2026 ALNT MED</span>
        <span>THE ART OF RATIONALITY · 理性的艺术</span>
        <span>BUILT WITH REASON</span>
      </div>
    </section>
  );
}

Object.assign(window, { Hero, Whoami, CodePanel, WorksGallery, WorkGallery, WorkMedia, IamFinale, Contact, WORKS, ARCH_WORKS });
