/* ══════════════════════════════════════════════════════════════
   sections.jsx — Hero · Whoami · Chapter · Works · Contact
   English-led, Chinese annotations. Tone per section drives the
   full-page background (handled by the engine in app.jsx).
   ══════════════════════════════════════════════════════════════ */

const { useState: useSecState, useEffect: useSecEffect, useRef: useSecRef } = React;

/* ── HERO ─────────────────────────────────────────────────── */
function Hero({ jump }) {
  return (
    <section className="hero sec" id="hero" data-tone="blue" data-screen-label="HERO" style={{ position: "relative", padding: 0 }}>
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
/* the time skyline — nine real periods, verified against the résumé.
   The pivot year dips on purpose: a reset before the peak. */
const WHO_CHRONO = [
  { y: "2020", h: 0.3,  tag: "ARCHITECTURE",     t: "GZHU — B.Arch begins",                       zh: "广州大学建筑学学士" },
  { y: "2024", h: 0.56, tag: "ARCHITECTURE",     t: "Ring-World 环·世界 — NCDA 一等奖",            zh: "「NCDA」未来设计师全国数字设计大赛 一等奖 · 车辆段上盖 · 动态隔音幕墙" },
  { y: "2025", h: 0.84, tag: "ARCHITECTURE",     t: "挑战杯 Grand Prize 特等奖 — Top 1%",          zh: "蒋巷文脉·科链智谷 2.0 · 产村双向赋能 · 项目组长" },
  { y: "2025", h: 0.68, tag: "RESEARCH",         t: "《建筑学报》 T1 — 2nd Author",                  zh: "国内建筑领域 T1 核心期刊 · AIGC 三维空间优化" },
  { y: "2025", h: 0.6,  tag: "ARCH × AI",        t: "UABB AIGC Pipeline · 板块唯一学生代表",        zh: "深港双年展 · 多模态 AIGC 负责人" },
  { y: "2025", h: 0.5,  tag: "THE PIVOT",        t: "SZU M.Arch · 转向 AI 产品",                    zh: "建筑学（复合 AI 方向）硕士 · 垂直 Agent AIPM" },
  { y: "2026", h: 0.92, tag: "AI PRODUCT",       t: "议见 Yijian — 企业 Agent 黑客松亚军",          zh: "香港中文大学 · 决策共识 Agent · 四层共识 · 七角色审议" },
  { y: "2026", h: 0.88, tag: "AI PRODUCT",       t: "Pears — Agent Factory · 黑客松季军",          zh: "「观察 → 生成 → 强化」 · 现场企业对接意向最多项目之一" },
  /* TODO(用户确认): 菩苇科技一行的时间与角色措辞 —— 先按已知事实占位 */
  { y: "2026", h: 0.72, tag: "AI PRODUCT",       t: "菩苇科技 — AI 产品实习",                       zh: "清华系初创 · 垂直领域 RAG Agent" },
  { y: "2026", h: 1,    tag: "AI PRODUCT · NOW", t: "XTOOL Agent Platform — 0→1",                  zh: "覆盖至 4 部门 · 完成率 80%+ · 每投入 $1 省 0.39 工时（高于 2026 企业均值 0.2–0.3）" },
];

/* the index — three identities, as a jump table. Left: number · BarWord
   title (跳色 period) · motto + proof. Right (desktop): a life photo, matted
   like a print with a drop shadow (用户: 左边索引，右边生活照，阴影卡一下).
   Click a row jumps into its chapter; hover focuses the row, the rest recede. */
const WHO_INDEX = [
  { id: "developer", ix: "01", tx: "A Developer", d: 1.6,
    mt: "From idea to shipped", zh: "保持从想法到落地的能力",
    band: [0.6, 1, 0.7, 0.9] },
  { id: "aipm", ix: "02", tx: "An AIPM", d: 1.95,
    mt: "Making AI fit real situations", zh: "让 AI 能力贴合真实场景",
    band: [0.85, 0.6, 1, 0.55] },
  { id: "architect", ix: "03", tx: "An Architect", d: 2.3,
    mt: "Scattered needs into a system", zh: "把零散的需求搭成稳定的体系",
    band: [1, 0.66, 0.5, 0.9] },
];

function Whoami({ jump }) {
  const { BarWord, BarBand, BarChrono } = window;
  return (
    <section className="whoami sec" id="whoami" data-tone="blue" data-ob data-screen-label="WHOAMI">
      <div className="who-top">
        <div className="kick lm"><span>01 · WHOAMI / 我是谁</span></div>
        <div className="who-tag mono" data-rv style={{ "--rd": ".1s" }}>AIPM · DEVELOPER · ARCHITECT</div>
      </div>
      <h2 className="who-q">
        <BarWord text="WHOAMI" />
      </h2>
      {/* 他唯一允许的自述格言 — 中文为主，英文平实直译作点缀 */}
      <p className="who-lede" data-rv style={{ "--rd": "1.15s" }}>
        我不追更快的马，想知道这趟路是不是该换种走法。
        <span className="en">I'm not chasing a faster horse — I'm asking whether this road needs a different way of walking.</span>
      </p>
      <div className="rule who-rule" style={{ "--rd": "1.3s" }}></div>

      <div className="who-index">
        <div className="who-index-list">
          <div className="dex-head kick">
            <span data-rv style={{ "--rd": "1.45s" }}>INDEX / 三个身份 — I AM …</span>
            <span data-rv style={{ "--rd": "1.58s" }}>CLICK TO ENTER · 点击进入章节</span>
          </div>
          <div className="dex-list">
            {WHO_INDEX.map((it, i) => (
              <div key={it.id} className="dex-it" data-hov style={{ "--rd": (1.5 + i * 0.18) + "s" }} onClick={() => jump(it.id)}>
                <span className="ix mono" data-rv style={{ "--rd": (1.65 + i * 0.35) + "s" }}>{it.ix}</span>
                <BarWord className="tx" text={it.tx} delay={it.d} />
                <div className="side" data-rv style={{ "--rd": (1.9 + i * 0.35) + "s" }}>
                  <BarBand h={it.band} />
                  {/* 中文为主：他的中文一句话是正文，英文 motto 缩为点缀 */}
                  <div className="mt">{it.zh}</div>
                  <div className="zh">{it.mt}</div>
                </div>
                <span className="arr" aria-hidden="true">→</span>
              </div>
            ))}
          </div>
          <div className="dex-note kick" data-rv style={{ "--rd": "3.1s" }}>ONE DISCIPLINE · THREE PROOFS — 一种理性，三个证明</div>
        </div>
        <div className="who-index-photo" data-rv style={{ "--rd": "1.5s" }}>
          <figure className="who-photo-card">
            <img src="uploads/whoami-portrait.jpg" alt="李文苑 · Lee Wenyuan" loading="lazy" />
            <figcaption className="mono">李文苑 · LEE WENYUAN — 深圳</figcaption>
          </figure>
        </div>
      </div>

      <div className="who-chrono">
        <div className="kick" data-rv style={{ "--rd": "1.95s" }}><span>CHRONO / 成就时间柱 — TAP A YEAR · 点选回看</span></div>
        <BarChrono items={WHO_CHRONO} />
      </div>
    </section>
  );
}

/* ── CHAPTER ──────────────────────────────────────────────── */
function Chapter({ id, tone, ghost, kick, title, motto, mottoZh, statement, statementZh, ring, stats, art, extra, jump }) {
  return (
    <section className="chapter" id={id} data-tone={tone} data-prog={id} data-screen-label={title}>
      <div className="ch-wrap">
        <div className="ch-stage sec" data-ob>
          <div className="ch-ghost" data-parallax="0.2" aria-hidden="true">{ghost}</div>
          <div className="ch-head">
            <div className="kick lm"><span>{kick}</span></div>
            <h2 className="ch-title lm" style={{ "--rd": ".1s", marginTop: "12px" }}><span>{title}<i className="psq" aria-hidden="true"></i></span></h2>
            <div className="rule ch-rule" style={{ "--rd": ".22s" }}></div>
            <div className="ch-sub" data-rv style={{ "--rd": ".34s" }}>
              <span data-hov onClick={() => jump("works")} style={{ cursor: "pointer" }}>TO MY WORK</span>
              <span className="arr">→</span>
            </div>
          </div>
          <div className="ch-art">
            {art}
            <RingText text={ring} />
          </div>
          <div className="ch-motto">
            <div className="mt lm" style={{ "--rd": ".3s" }}><span>{motto}</span></div>
            <div className="st" data-rv style={{ "--rd": ".45s" }}>{statement}
              <span className="zh">{statementZh}</span>
            </div>
          </div>
          <div className="ch-stats">
            {stats.map((s, i) => (
              <div className="st" key={i} data-rv style={{ "--rd": (0.5 + i * 0.12) + "s" }}>
                <div className="n" data-cnt={s.cnt != null ? s.cnt : undefined} data-fmt={s.fmt || ""}>{s.cnt != null ? "0" : s.n}</div>
                <div className="l">{s.l}</div>
              </div>
            ))}
          </div>
          {extra || null}
        </div>
      </div>
    </section>
  );
}

/* typed governance config — the Developer chapter's right panel */
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
      const p = (window.__progress && window.__progress.developer) || 0;
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

/* ── WORKS data — eight real proofs, two acts ─────────────────
   Act I   architecture — the root system · 2023–25
   Act II  AI products & agents · 2025–26
   (建筑在前、AI 在后 — 根系先立，再到当下。award 只留「奖名 · 中文
   等级」，题材词/百分比/英文等级都不进卡片：它只是右下角一行小字。) */
const WORKS = [
  {
    ix: "W·01", t: "After_Silence", display: "After_Silence", tag: "ARCHITECTURE", year: "2025", identity: "Architect",
    award: "深港双年展 UABB · 板块代表作品",
    doc: "uploads/portfolio.pdf#page=3", mediaLabel: "PORTFOLIO · 作品集",
    pages: ["works/portfolio/aftersilence-1.jpg", "works/portfolio/aftersilence-2.jpg"],
    caption: "PORTFOLIO · 作品集 · 地外人居",
    role: ["设计主创", "Design lead"],
    body: "When the engines fall silent, life begins. Taking the first Mars base's pioneer cluster as prototype, the design turns technical modules into scenes of living — a closed Martian habitat loop where dwelling, energy and research sustain each other. Exhibited in mixed reality (N'Space, naked-eye 3D) at the UABB main hall as the section's representative work.",
    zh: "「当震耳欲聋的引擎彻底沉寂，真正的生活才刚刚开始。」以首座火星基地「首航组团」为原型，把功能模块转化为生活场景，提出居住、能源、科研相互依存的「火星人居闭环」。作为板块代表展品，以混合现实形式在深港双年展主展厅虚拟上线。",
  },
  {
    ix: "W·02", t: "上桥 Upper-Via", display: "上桥", tag: "ARCHITECTURE", year: "2023", identity: "Architect",
    award: "「活力杯」大湾区高校设计大赛 · 一等奖",
    doc: "uploads/portfolio.pdf#page=5", mediaLabel: "PORTFOLIO · 作品集",
    pages: ["works/portfolio/shangqiao-1.jpg", "works/portfolio/shangqiao-2.jpg", "works/portfolio/shangqiao-3.jpg", "works/portfolio/shangqiao-4.jpg"],
    caption: "PORTFOLIO · 作品集 · 桥上书屋",
    role: ["项目组长", "Project lead"],
    body: "Lychee Bay's water once gathered people; now it divides them. With no land left in the dense old quarter, the public space goes onto the water — a bridge-library stitching the two banks. Movable bookshelves let one span be a reading room by day, a waiting area at school run, an event hall on holidays. Needle-point urban renewal, now aligned with a real implementation project.",
    zh: "荔枝湾水系曾聚人，如今却隔开两岸。高密度老城无地可用，便把公共空间「上桥」外置水面：移动书柜让同一座桥在书屋、放学等候、社区活动三种模式间切换。绣花针式的城市更新，并与拟落地项目对接实施。",
  },
  {
    ix: "W·03", t: "风贯·立方 Air Cube", display: "风贯·立方", tag: "ARCHITECTURE", year: "2025", identity: "Architect",
    award: "2025 优秀毕业设计展 · 卓越奖",
    doc: "uploads/portfolio.pdf#page=9", mediaLabel: "PORTFOLIO · 作品集",
    pages: ["works/portfolio/aircube-1.jpg", "works/portfolio/aircube-2.jpg", "works/portfolio/aircube-3.jpg"],
    caption: "PORTFOLIO · 作品集 · 产城融合",
    role: ["设计主创 · 毕业设计", "Design lead"],
    body: "A \"factory-upstairs\" industry–city fusion for an IDC R&D centre in Guangzhou's Knowledge City. Production floors lift to level three and above; the entire second floor opens into a public void that doubles as a convective wind corridor, stack ventilation cooling the block without machines. Irregular perforated-aluminium façades and vertical greening modulate shade and heat, while a cold-lane ground level tunes the microclimate through planting and water evaporation. Prefab steel, rooftop PV and a rainwater loop close the energy gap.",
    zh: "以「工业上楼」为核心的产城融合：生产空间抬升至三层及以上，二层整体架空为通透公共空间，兼作对流通风廊道，结合热压通风实现自然降温。东西向不规则穿孔铝板幕墙 + 垂直绿化动态遮阳隔热；架空层引入冷巷原理，以植被与水体蒸发优化微气候。装配式钢结构 + 屋顶光伏 + 雨水循环系统进一步降低能耗。科力新能源 IDC · 大湾区研发中心。",
  },
  {
    ix: "W·04", t: "环·世界 The Ring-World", display: "环·世界", tag: "ARCHITECTURE", year: "2024", identity: "Architect",
    award: "「NCDA」未来设计师全国数字设计大赛 · 一等奖",
    doc: "uploads/portfolio.pdf#page=18", mediaLabel: "PORTFOLIO · 作品集",
    pages: ["works/portfolio/ringworld-1.jpg", "works/portfolio/ringworld-2.jpg", "works/portfolio/ringworld-3.jpg"],
    caption: "PORTFOLIO · 作品集 · 声景社区",
    role: ["项目组长", "Project lead"],
    body: "A rental community above a metro depot: 72 dB of traffic noise, public space squeezed to 35% of normal. The answer flips the public realm vertically — a double-deck roaming loop strings roof gardens and shared living rooms together, while a parametric acoustic façade opens and closes against the simulated noise map, trading view against silence in real time. 5,000 m² of shared ground reclaimed.",
    zh: "车辆段上盖、昼间 72 分贝、公共空间仅为商品住宅 35% 的租赁社区。把公共空间垂直翻转：双层立体漫游环串联屋顶花园与共享客厅；临声面以参数化动态隔音幕墙围合，依据 SoundPlan 噪声模拟实时权衡视野与隔音，释放出 5000 ㎡ 的共享场域。",
  },
  {
    ix: "W·05", t: "Pears — Agent Factory", display: "Pears", tag: "AI PRODUCT", year: "2026", identity: "AIPM",
    award: "ADVENTURE-X 高校联盟黑客松 · 季军",
    link: "https://and-pear.netlify.app/login",
    links: [
      { label: "访问应用 · PEARS APP ↗", url: "https://and-pear.netlify.app/login" },
      { label: "产品官网 · OFFICIAL SITE ↗", url: "https://pear-web-leemenuong.netlify.app/" },
    ],
    poster: "works/pears-roadshow-cover.jpg", video: "works/pears-roadshow.mp4", videoReady: true,
    mediaLabel: "PRODUCT FILM · 路演视频",
    caption: "PEERSWORK · 路演视频 · PRODUCT FILM", siteLabel: "and-pear.netlify.app",
    role: ["独立构建 0 → 上线", "Solo build"],
    body: "A browser extension watches you do the job once — inside a session you explicitly start — then distills the trace into an editable PRD, which an AI coding agent turns into your own workflow agent. The thesis came from a real observation at XTOOL: one dev team can never fill a whole company's agent demand, so lower the bar from \"describe AI\" to \"do it once\".",
    zh: "「观察 → 生成 → 强化」的 Agent 工厂：插件看你把工作做一遍，把行为轨迹蒸馏成可编辑的 PRD，再由 AI 编码 Agent 生成你专属的 Workflow Agent。想法来自 XTOOL 的真实观察：一个开发团队永远填不满全公司的 Agent 需求，那就把门槛从「描述 AI」降到「做一遍」。现场获企业对接意向最多的项目之一。",
  },
  {
    ix: "W·06", t: "XTOOL Agent Platform", display: "XTOOL", tag: "AI PLATFORM", year: "2026", identity: "AIPM",
    poster: "xtool/screenshots/demo_review.png", embed: "xtool/", link: "https://peersagent.netlify.app/",
    mediaLabel: "MOTION FILM · 互动影片", caption: "PEAR AGENT · 平台动态影片 · MOTION FILM",
    role: ["AIPM · 平台负责人", "Intern · platform owner"],
    body: "An internal agent tool matrix covering the whole content-production chain — scripting, research, cross-platform monitoring, AI review. Telemetry found a 52% drop at the Hook stage; judgment said high-creativity content can't be one-shot by an LLM; the prescription — merge generation stages, three candidates to pick from — drove three product generations. Seven tools now run across four departments (65 people); a self-built ROI board — every $1 invested saves 0.39 working hours — keeps the platform honest.",
    zh: "单人主导部门 Agent 平台 0→1：7 个生产工具铺满内容生产链（脚本、调研、跨平台监测、AI 审核）。埋点发现 Hook 段流失 52%；判断是「高创意内容无法一次成型」；开出的方子——合并生成阶段、三候选并出——推动了三代产品迭代。现覆盖 4 个部门 65 人，任务完成率 80%+；自建 ROI 看板：每投入 $1 省 0.39 工时。首位受邀实习生在全公司公开课主讲。",
  },
  {
    ix: "W·07", t: "议见 Yijian — Consensus Engine", display: "议见 Yijian", tag: "AI PRODUCT", year: "2026", identity: "AIPM",
    award: "香港中文大学 · 企业 Agent 黑客松 · 亚军",
    link: "https://yijian-demo4.netlify.app",
    poster: "works/yijian-cover.jpg", embed: "https://yijian-demo4.netlify.app",
    mediaLabel: "LIVE DEMO · 在线体验", caption: "议见 YIJIAN · 决策共识 AGENT · 在线 DEMO",
    role: ["产品与开发", "Product & build"],
    body: "A decision-consensus agent for enterprise teams. Name the call to make — a product pick, a budget add, a regional launch — and Yijian convenes a panel of role perspectives, then resolves them across four layers: strategic goal, factual evidence, stakeholder interest, weighted accountability. What it returns is not one opinion but an auditable verdict — a consensus score, the conditions a decision must clear, and the disagreements still worth solving.",
    zh: "面向企业团队的「决策共识」Agent：输入一项待决策事项，议见组织多角色视角，并在四层共识——战略目标 / 事实证据 / 利益角色 / 权重权责——上收敛分歧。产出的不是单一意见，而是可追溯的结论：共识度评分、决策需满足的附加条件、以及仍需解决的分歧点。香港中文大学企业 Agent 黑客松亚军。",
  },
  {
    ix: "W·08", t: "UABB · AIGC Pipeline", tag: "AIGC PIPELINE", year: "2025", identity: "Developer",
    award: "深港双年展 UABB 2025 · 板块唯一学生代表",
    poster: "works/aftersilence-cover.jpg", video: "works/aftersilence.mp4", videoReady: true,
    mediaLabel: "AIGC FILM · 影像", caption: "UABB · AIGC PIPELINE · 影像",
    role: ["多模态 AIGC 负责人", "UABB 2025 curatorial team"],
    body: "A ComfyUI pipeline wired to external APIs (Gemini / Tripo) that translates non-standard exhibits into standardized 3D assets. Processing time for 50+ exhibits fell from 30 days to 5; 120+ sketch-and-model iterations later, the result made me the section's only student representative.",
    zh: "ComfyUI 外接 API（Gemini / Tripo）的自动化转译工作流 + 标准化 3D 资产 SOP：50+ 非标展品的处理周期从 30 天缩到 5 天。120+ 次草图与模型迭代之后，成果让我成为板块唯一的学生代表，在展会分享。",
  },
];

/* the logo's skyline rhythm — the same eight bars as the .IAM. mark.
   THIS is the thesis of the WORKS section: the mark is not decoration,
   it is an index. Eight bars, eight works — bar[i] indexes work[i]
   (heights are the mark's fixed rhythm, positional, not per-work data).
   The blue square (the self · the period) walks the skyline as the
   reader's cursor. 条 → 字. */
const OVR_BARS = [0.97, 0.58, 1.0, 0.66, 0.9, 0.52, 0.74, 1.0];

/* ── WORKS — the mark UNFOLDS into the works (scroll-scrubbed) ─
   Back to the logo-expand idea, rebuilt on the engine's __progress
   system instead of CSS transitions (which stall under this
   preview's idle compositor throttling — the chapter canvases all
   JS-drive for the same reason). The .IAM. skyline mark sits
   centered like the loader logo; scroll UNFOLDS it into a full-
   width index, then DECODES the eight bars into eight works, one
   in focus at a time. Every property is written per frame off
   window.__progress.works, so it always renders. 条 → 字. */
const clp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (e0, e1, x) => { const t = clp((x - e0) / (e1 - e0 || 1e-6), 0, 1); return t * t * (3 - 2 * t); };
const eOut = (t) => 1 - Math.pow(1 - t, 3);
const wkShort = (wk) => wk.display || wk.t.split(/\s+—\s+|\s+·\s+/)[0];
/* each work answers to one of the three identities — carried on the work
   itself (wk.identity) so reordering the deck never re-labels anyone. 字⇄身份. */

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
          <button className="sc-play" type="button" data-hov aria-label="播放 路演视频"
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

function Works({ jump }) {
  const stageRef = useSecRef(null);
  const hoverRef = useSecRef(null);
  const readRef = useSecRef(null);
  const headRef = useSecRef(null);
  const selfRef = useSecRef(null);
  const deckRef = useSecRef(null);

  /* click / Enter on a TOC bar or label — scroll to that work's browse
     position so it works whether the deck is open or still closed. */
  const jumpToWork = (i) => {
    const sec = document.getElementById("works");
    const wrap = sec && sec.querySelector(".wk-wrap");
    if (wrap) {
      const top = wrap.getBoundingClientRect().top + window.scrollY;
      const span = Math.max(wrap.offsetHeight - window.innerHeight, 1);
      const pp = 0.24 + (i / (WORKS.length - 1)) * 0.58;   /* mirrors pB */
      window.scrollTo(0, Math.round(top + pp * span));
    }
    hoverRef.current = i;
  };
  /* hover preview — sweeping the pointer across the skyline TOC pulls focus
     to the bar/label under it (a soft crossfade now, not a balloon). */
  const onTocMove = (ev) => {
    if ((window.__wkOpen || 0) <= 0.55) return;
    const it = ev.target.closest("[data-i]");
    if (it && it.dataset.i != null) hoverRef.current = +it.dataset.i;
  };

  /* the whole stage is driven by scroll progress — one rAF, only
     style writes, mirroring useChProg in chapters.jsx. */
  useSecEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const cards = [...stage.querySelectorAll(".wk-card")];
    const spines = cards.map((c) => c.querySelector(".wc-spine"));
    const deck = deckRef.current;
    const fulls = deck ? [...deck.querySelectorAll(".wc-full")] : [];
    const tocs = [...stage.querySelectorAll(".wt-item")];
    const intro = stage.querySelector(".wk-intro");
    const readEl = readRef.current;
    const headEl = headRef.current;
    const selfEl = selfRef.current;
    const N = cards.length;
    /* touch has no hover; scrolling is the ONLY way to browse, so a film must
       not pause the instant the scrub drifts — only when its card is truly gone */
    const coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    let disp = 0, lastActive = -1;

    /* BARS ⇄ SKYLINE — the eight .wk-card elements ARE the logo's bars, and
       now stay bars for good: they unfold from the logo into a permanent
       skyline TOC along the bottom and fly home on reconverge. The works
       themselves live in ONE fixed card frame above (.wk-cardstage) whose
       eight content panes crossfade — so browsing no longer stretches
       geometry between the rail and the card. 条 → 目录 · 卡 → 淡入淡出. */
    const bmBars = [...document.querySelectorAll(".brandmorph .band i")];
    const toRGB = (s) => { const m = (s || "").match(/-?\d+(\.\d+)?/g); return m ? m.slice(0, 3).map(Number) : [11, 11, 14]; };
    const srcRGB = bmBars[0] ? toRGB(getComputedStyle(bmBars[0]).backgroundColor) : [11, 11, 14];
    const tgtRGB = cards.map((c) => toRGB(getComputedStyle(c).backgroundColor));
    const COBALT = [0, 71, 171];
    const mix = (a, b, t) => "rgb(" + a.map((v, k) => Math.round(v + (b[k] - v) * t)).join(",") + ")";
    let barRects = null;

    const tick = () => {
      const p = clp((window.__progress && window.__progress.works) || 0, 0, 1);
      const r = stage.getBoundingClientRect();
      const W = r.width, H = r.height;

      /* open → reconverge: the mark UNFOLDS into the skyline (openRaw), then near
         the end the skyline collapses BACK into the mark (close). eS is the live
         "openness" — the brandmorph logo reads it (window.__wkOpen) to know when
         to hand off the closed mark and when to take it back. 条 ⇄ 目录 ⇄ 条. */
      const openRaw = eOut(smooth(0.04, 0.24, p));     /* closed mark → open skyline */
      const close = eOut(smooth(0.82, 0.96, p));       /* skyline → reconverged mark */
      const eS = openRaw * (1 - close);
      window.__wkOpen = eS;
      /* GEOMETRY GATE — the bars must sit PIXEL-EXACT on the logo bars while the
         logo fades off the top of them (eS 0→~0.12). Below FHAND the bars are
         frozen; the logo dissolves into identical, motionless rectangles. */
      const FHAND = 0.12;
      const eGeo = clp((eS - FHAND) / (1 - FHAND), 0, 1);
      const pB = clp((p - 0.24) / 0.58, 0, 1);         /* scrub across the deck (browse window — 必须与 jumpToWork 点击映射镜像) */
      /* DWELL — instead of a linear scrub (where the next work surfaces while
         the last is still arriving), each work HOLDS in focus, then the scrub
         moves briskly to the next. The plateau at each integer is the dwell. */
      const raw = pB * (N - 1);
      const k = Math.min(Math.floor(raw), N - 2);
      const seg = k + smooth(0.34, 0.66, raw - k);
      const hv = hoverRef.current;
      const target = (hv != null && eS > 0.55) ? hv : seg;
      /* silky inertia — the focus glides toward target rather than snapping. */
      disp += (target - disp) * 0.12;
      if (Math.abs(target - disp) < 0.002) disp = target;
      /* while the deck is closed, snap focus home so a fast scroll-out-and-back
         never flashes a stale work on re-entry */
      if (eS < 0.08) { disp = seg; hoverRef.current = null; }

      /* intro caption blooms as the logo lands at centre, then lifts away as
         the mark unfolds */
      const introOp = smooth(0, 0.028, p) * (1 - smooth(0.05, 0.12, p));
      intro.style.opacity = introOp.toFixed(3);
      intro.style.transform = "translate(-50%," + (-40 * eS).toFixed(1) + "px)";

      /* read the live logo bars (relative to the stage) — the bars' closed
         state. Re-measured through the morph zone; cached during browse where
         the logo is parked dead-still at centre. This guarantees each bar
         BEGINS exactly on its logo twin, so the handoff has nothing to dissolve. */
      if (bmBars.length === N && (eS < 0.55 || !barRects)) {
        barRects = bmBars.map((b) => {
          const br = b.getBoundingClientRect();
          return { x: br.left - r.left, y: br.top - r.top, w: br.width, h: br.height };
        });
      }
      const colorT = smooth(0.0, 0.45, eGeo);

      /* the fixed card frame + the skyline TOC geometry. 大卡一次定位，条列底部. */
      const narrow = W < 900;
      const bigW = Math.min(W * (narrow ? 0.95 : 0.86), 1160);
      const bigTop = H * (narrow ? 0.165 : 0.155);   /* phone: drop the card enough to fit the floating title BELOW the fixed nav */
      const bigBot = H * (narrow ? 0.80 : 0.68);
      const bigH = bigBot - bigTop;
      const bigCx = W * 0.5;
      /* the skyline index rail — slim bars along the bottom edge */
      const railBaseY = H * 0.965;
      const railMaxH = clp(H * 0.072, 32, 60);
      const railTotW = Math.min(W * (narrow ? 0.88 : 0.58), 920);
      const railLeft = W * 0.5 - railTotW * 0.5;
      const railStep = railTotW / (N - 1);
      const spineW = clp(railTotW / (N * 2.4), 8, 22);
      const labY = railBaseY - railMaxH - (narrow ? 20 : 26);   /* TOC label row, above the tallest bar */

      const ai = Math.round(clp(disp, 0, N - 1));
      window.__wkActive = ai;
      if (ai !== lastActive) {
        lastActive = ai; const wk = WORKS[ai];
        /* phone readout — ≤600px hides the TOC names, so the active work's name
           reads here instead (desktop hides this line via CSS) */
        if (readEl) readEl.innerHTML = '<b>' + String(ai + 1).padStart(2, "0") + '</b>&nbsp;&nbsp;' + wkShort(wk);
        /* the floating headline — the work's title + serial, OUTSIDE the card */
        if (headEl) headEl.innerHTML =
          '<span class="wh-kick">' + wk.ix + ' · ' + wk.tag + ' · ' + wk.year + '</span>' +
          '<span class="wh-name">' + wkShort(wk) + '<i class="wh-sq"></i></span>';
        tocs.forEach((t, j) => t.classList.toggle("on", j === ai));
      }
      const railFadeN = smooth(0.45, 0.95, eS) * (1 - close);
      const railFade = railFadeN.toFixed(3);
      if (readEl) readEl.style.opacity = railFade;
      /* park the headline at the card frame's top-left corner, just above it */
      if (headEl) {
        const hx = bigCx - bigW / 2;
        const hy = Math.max(bigTop - (narrow ? 70 : 96), narrow ? 70 : 10);
        headEl.style.transform = "translate(" + Math.round(hx) + "px," + Math.round(hy) + "px)";
        headEl.style.opacity = railFade;
      }
      /* the self-square (the period · 自我) rides the skyline at the live scrub
         position — the reading cursor of the TOC */
      if (selfEl) {
        const di = clp(disp, 0, N - 1);
        const lo = Math.floor(di), hi = Math.min(lo + 1, N - 1);
        const hAt = lerp(OVR_BARS[lo], OVR_BARS[hi], di - lo);
        const selfH = railMaxH * (0.40 + 0.60 * hAt);
        const sx = railLeft + di * railStep - 4.5;
        const sy = railBaseY - selfH - 11;
        selfEl.style.transform = "translate(" + Math.round(sx) + "px," + Math.round(sy) + "px)";
        selfEl.style.opacity = (smooth(0.5, 0.95, eS) * (1 - close)).toFixed(3);
      }

      /* ── the ONE card frame — appears as the unfold completes, retires as the
         skyline flies home. Its geometry never tracks the scrub: only the panes
         inside crossfade, so a work swap is a dissolve, not a stretch. ── */
      const stOp = smooth(0.86, 1, eGeo);
      if (deck) {
        const rise = (1 - stOp) * 22;
        deck.style.width = Math.round(bigW) + "px";
        deck.style.height = Math.round(bigH) + "px";
        deck.style.transform = "translate(" + Math.round(bigCx - bigW / 2) + "px," + Math.round(bigTop + rise) + "px)";
        deck.style.opacity = stOp.toFixed(3);
        deck.style.visibility = stOp > 0.01 ? "visible" : "hidden";
      }

      /* ── the eight bars — a permanent skyline TOC. The reader sweep (disp)
         pulls the active bar to cobalt; labels ride their slots below. ── */
      const appear = smooth(0.0, 0.05, eS);
      cards.forEach((card, i) => {
        /* closed (bar) geometry — straight off the live logo. */
        const bc = barRects && barRects[i];
        const barX = bc ? bc.x : (W * 0.3 + i * 30);
        const barW = bc ? bc.w : 14;
        const barH = bc ? bc.h : (OVR_BARS[i] * H * 0.15);
        const barTop = bc ? bc.y : (H * 0.46 - barH);

        /* this work's home in the skyline index (slim bar, height = logo rhythm) */
        const hSig = OVR_BARS[i % OVR_BARS.length];
        const spineH = railMaxH * (0.40 + 0.60 * hSig);
        const spineCx = railLeft + i * railStep;
        const spineTop = railBaseY - spineH;

        /* unfold the logo bar into its rail slot — same element, continuous geometry */
        const x = lerp(barX, spineCx - spineW / 2, eGeo);
        const w = lerp(barW, spineW, eGeo);
        const h = lerp(barH, spineH, eGeo);
        const top = lerp(barTop, spineTop, eGeo);
        card.style.width = Math.round(w) + "px";
        card.style.height = Math.round(h) + "px";
        card.style.transform = "translate(" + Math.round(x) + "px," + Math.round(top) + "px)";

        /* reader sweep — how close the focus is to THIS bar. The active bar
           turns cobalt (跳色在「当前」上) and lifts to full ink-strength. */
        const prox = 1 - Math.min(Math.abs(i - disp), 1);
        const barHot = smooth(0.55, 0.95, prox);
        card.style.backgroundColor = eGeo < 0.52
          ? mix(srcRGB, tgtRGB[i], colorT)
          : mix(tgtRGB[i], COBALT, barHot);
        card.style.opacity = (appear * lerp(0.5, 1, barHot)).toFixed(3);
        if (spines[i]) spines[i].style.pointerEvents = eS > 0.5 ? "auto" : "none";

        /* the TOC label under this slot */
        const tc = tocs[i];
        if (tc) {
          tc.style.transform = "translate(" + Math.round(spineCx) + "px," + Math.round(labY) + "px) translateX(-50%)";
          tc.style.opacity = railFade;
          tc.style.pointerEvents = (eS > 0.5 && railFadeN > 0.4) ? "auto" : "none";
        }
      });

      /* ── the eight content panes — a gentle crossfade around the damped focus.
         The frame behind them is opaque ink, so mid-swap the two panes dissolve
         through the card's own ground — never through to the page. ── */
      fulls.forEach((f, i) => {
        const dd = i - disp;
        const prox = 1 - Math.min(Math.abs(dd), 1);
        const op = smooth(0.18, 0.82, prox);
        const eff = op * stOp;
        f.style.opacity = op.toFixed(3);
        f.style.transform = "translateY(" + (clp(dd, -1, 1) * 18).toFixed(1) + "px)";
        f.style.zIndex = String(10 + Math.round(op * 20));
        const live = eff > 0.02;
        f.style.pointerEvents = eff > 0.6 ? "auto" : "none";
        /* drop the 7 inactive dossiers out of the a11y tree + tab order —
           opacity:0 alone leaves their links/media keyboard-reachable behind
           an invisible layer (inert neutralises the nested controls too) */
        f.style.visibility = live ? "visible" : "hidden";
        f.toggleAttribute("inert", !live);
        /* pause a film once its pane leaves focus — an opacity:0 video keeps
           playing. on touch, hold until the pane is essentially gone so a small
           scrub doesn't stop playback; on desktop keep the tighter 0.4 cutoff. */
        if (eff < 0.02 || (eff < 0.4 && !coarse)) { const v = f.querySelector("video"); if (v && !v.paused) v.pause(); }
      });
    };

    if (!window.__addLoop) { tick(); return; }
    const stop = window.__addLoop(tick);
    return () => stop();
  }, []);

  useSecEffect(() => {
    /* the hover selection STICKS — it won't fly back to the scrubbed card when the
       pointer leaves. Scrolling is what hands control back to the scroll-scrub. */
    const onScroll = () => { hoverRef.current = null; };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="works3 chapter" id="works" data-tone="paper" data-prog="works" data-screen-label="WORKS">
      <div className="ch-wrap wk-wrap">
        <div className="ch-stage wk-stage" ref={stageRef}>
          <div className="wk-ghost" data-parallax="0.12" aria-hidden="true">WORKS</div>

          <div className="wk-intro">
            <div className="kick mono">05 · SELECTED WORK / 作品</div>
            <h2 className="wk-zh">每一份数据，支撑着一个作品<i className="psq" aria-hidden="true"></i></h2>
            <p className="wk-lead mono">SCROLL — THE MARK UNFOLDS INTO THE WORK · 滚动，标记展开为作品</p>
          </div>

          {/* ── the skyline TOC — eight permanent bars along the bottom (the logo's
              own bars, unfolded). Pointer-only hit targets; the labelled TOC row
              below carries keyboard access. 条 = 目录. */}
          <div className="wk-fan" aria-hidden="true" onPointerMove={onTocMove}>
            {WORKS.map((wk, i) => (
              <div key={i} data-i={i} className="wk-card ink">
                <button className="wc-spine" type="button" data-hov tabIndex={-1} aria-hidden="true"
                        onClick={() => jumpToWork(i)}></button>
              </div>
            ))}
          </div>
          {/* the TOC labels — serial + short name under each bar's slot; the
              active one flips cobalt. These are the keyboard path to the deck. */}
          <div className="wk-toc" onPointerMove={onTocMove}>
            {WORKS.map((wk, i) => (
              <button key={i} data-i={i} type="button" data-hov
                      className={"wt-item mono" + (i === 0 ? " on" : "")}
                      aria-label={"View " + wk.ix + " · " + wk.t}
                      onClick={() => jumpToWork(i)}>
                <b>{String(i + 1).padStart(2, "0")}</b><span>{wkShort(wk)}</span>
              </button>
            ))}
          </div>

          {/* ── the ONE card frame — fixed geometry; the eight works are stacked
              content panes that crossfade inside it. 卡不再从条里长出来. */}
          <div className="wk-cardstage" ref={deckRef}>
            {WORKS.map((wk, i) => (
              <div key={i} data-i={i} className="wc-full">
                <div className="wf-media"><WorkMedia wk={wk} /></div>
                <div className="wf-text">
                  <div className="wf-ident">{wk.identity}<i className="psq" aria-hidden="true"></i></div>
                  <div className="wf-role mono">{wk.role[0]} · {wk.role[1]}</div>
                  {/* 中文叙事为主，英文缩为点缀；三格 metrics 计分板已删（纯叙事） */}
                  <p className="wf-zh">{wk.zh}</p>
                  <p className="wf-body">{wk.body}</p>
                  {wk.links ? (
                    <div className="wf-ctas">
                      {wk.links.map((ln, j) => (
                        <a key={j} className="wf-cta mono" href={ln.url} target="_blank" rel="noopener" data-hov>{ln.label}</a>
                      ))}
                    </div>
                  ) : wk.link ? (
                    <a className="wf-cta mono" href={wk.link} target="_blank" rel="noopener" data-hov>访问项目 · VISIT LIVE ↗</a>
                  ) : wk.doc ? (
                    <a className="wf-cta mono" href={wk.doc} target="_blank" rel="noopener" data-hov>查看作品集 · PORTFOLIO ↗</a>
                  ) : null}
                  {/* 获奖角标 — 卡片右下角一行小字：只有「奖名 · 中文等级」，行尾方块
                      句点收束（同标题的 .psq 语义）。角落停靠、非徽章补丁；无奖不渲染。 */}
                  {wk.award ? (
                    <div className="wf-award mono">{wk.award}<i className="sq" aria-hidden="true"></i></div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="wk-headline" ref={headRef} aria-hidden="true"></div>
          <div className="wk-railread mono" ref={readRef} role="status" aria-live="polite"></div>
          <i className="wk-railself" ref={selfRef} aria-hidden="true"></i>
        </div>
      </div>
    </section>
  );
}


/* ── the finale thread — "I am ___" keeps filling the blank ── */
function IamFinale() {
  const ids = ["Alnt Med", "an AIPM", "a Developer", "an Architect", "a Builder", "anything."];
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
        <div className="kick lm"><span>06 · 联系 / CONTACT — 求职方向：AI 产品 · 深圳</span></div>
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
              <span className="cl">AI 作品集 · Portfolio</span><span className="cv">站内浏览 8 个作品&nbsp;→</span>
            </a>
            <a className="crow" href="https://github.com/leemenuong-prog" target="_blank" rel="noopener" data-hov>
              <span className="cl">GitHub</span><span className="cv">@leemenuong-prog&nbsp;↗</span>
            </a>
            <a className="crow" href="https://and-pear.netlify.app/login" target="_blank" rel="noopener" data-hov>
              <span className="cl">Pear · Web</span><span className="cv">and-pear.netlify.app&nbsp;↗</span>
            </a>
            <a className="crow" href="https://peersagent.netlify.app/" target="_blank" rel="noopener" data-hov>
              <span className="cl">Pear · Agent</span><span className="cv">peersagent.netlify.app&nbsp;↗</span>
            </a>
          </div>
        </div>
      </div>
      <div className="fband-slot" aria-hidden="true"></div>
      <div className="foot">
        <span>© 2026 ALNT MED</span>
        <span>THE ART OF RATIONALITY · 理性的艺术</span>
        <span>BUILT WITH REASON</span>
      </div>
    </section>
  );
}

Object.assign(window, { Hero, Whoami, Chapter, CodePanel, Works, IamFinale, Contact, WORKS });
