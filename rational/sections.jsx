/* ══════════════════════════════════════════════════════════════
   sections.jsx — Hero · Whoami · Dex · Chapter · Works · Contact
   English-led, Chinese annotations. Tone per section drives the
   full-page background (handled by the engine in app.jsx).
   ══════════════════════════════════════════════════════════════ */

const { useState: useSecState, useEffect: useSecEffect, useRef: useSecRef } = React;

/* ── HERO ─────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="hero sec" id="hero" data-tone="blue" data-screen-label="HERO" style={{ position: "relative", padding: 0 }}>
      <div className="band-slot" aria-hidden="true"></div>
      <div className="hrule"></div>
      <div className="hbar mono">
        <span>ALNT MED'S SPACE</span>
        <span>WHOAMI &nbsp;/&nbsp; WORK &nbsp;/&nbsp; CONTACT</span>
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
            <span className="zh">理性的艺术 · FROM SPACE TO AGENTS</span>
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
  { y: "2020", h: 0.3,  tag: "ARCHITECTURE",     t: "GZHU — B.Arch begins",                       zh: "广州大学建筑学学士 · 「把约束变成形」训练的起点" },
  { y: "2023", h: 0.46, tag: "ARCHITECTURE",     t: "Upper-Via 上桥 — 活力杯一等奖",             zh: "大湾区高校设计大赛 · 把公共空间「上桥」外置水面" },
  { y: "2024", h: 0.56, tag: "ARCHITECTURE",     t: "Ring-World 环·世界 — 华灿奖一等奖",          zh: "两岸新锐设计竞赛 · 车辆段上盖 · 动态隔音幕墙" },
  { y: "2025", h: 0.84, tag: "ARCHITECTURE",     t: "挑战杯 Grand Prize 特等奖 — Top 1%",          zh: "蒋巷文脉·科链智谷 2.0 · 产村双向赋能 · 项目组长" },
  { y: "2025", h: 0.68, tag: "RESEARCH",         t: "《建筑学报》 T1 — 2nd Author",                  zh: "国内建筑领域 T1 核心期刊 · AIGC 三维空间优化" },
  { y: "2025", h: 0.6,  tag: "ARCH × AI",        t: "UABB AIGC Pipeline — 30d → 5d",               zh: "深港双年展 · 50+ 展品自动转译 · 板块唯一代表" },
  { y: "2025", h: 0.5,  tag: "THE PIVOT",        t: "SZU M.Arch · 转向 AI 产品",                    zh: "建筑学（AI 方向）硕士 · 垂直 Agent AIPM · Peear MVP" },
  { y: "2026", h: 0.88, tag: "AI PRODUCT",       t: "Pears — Agent Factory · 黑客松二等奖",        zh: "「观察 → 生成 → 强化」 · 现场企业对接意向最多项目之一" },
  { y: "2026", h: 1,    tag: "AI PRODUCT · NOW", t: "XTOOL Agent Platform — 0→1",                  zh: "9 个生产工具 · 22 万行 · 48 人部门过半采用 · ROI 0.39 H/$" },
];

function Whoami() {
  const { BarWord, BarChrono } = window;
  return (
    <section className="whoami sec" id="whoami" data-tone="blue" data-ob data-screen-label="WHOAMI">
      <div className="who-top">
        <div className="kick lm"><span>01 · WHOAMI / 我是谁</span></div>
        <div className="who-tag mono" data-rv style={{ "--rd": ".1s" }}>AIPM · DEVELOPER · ARCHITECT</div>
      </div>
      <h2 className="who-q">
        <BarWord text="WHOAMI" />
      </h2>
      <div className="rule who-rule" style={{ "--rd": "1.3s" }}></div>

      <div className="who-grid">
        <div className="who-text">
          <div className="who-a lm" style={{ "--rd": "1.45s" }}>
            <span><span className="dim">I am&nbsp;</span>Alnt Med<i className="psq" aria-hidden="true"></i></span>
          </div>
          <p className="who-lead" data-rv style={{ "--rd": "1.6s" }}>
            Trained as an architect; now I build AI products with the same instinct — turning constraints into form.
          </p>
          <p className="who-sub" data-rv style={{ "--rd": "1.72s" }}>
            I led an enterprise agent platform from zero to <span className="em">nine production tools</span>, alone —
            220K lines of TypeScript, adopted by over half of a 48-person department.
            Different mediums, one discipline: <span className="em">the art of rationality</span><i className="psq" aria-hidden="true"></i>
          </p>
          <p className="who-zh zh" data-rv style={{ "--rd": "1.82s" }}>深圳大学建筑学（人工智能方向）硕士在读。单人主导企业内部 Agent 平台 0→1：9 个生产工具、22 万行 TypeScript，部门 48 人中超半数纳入日常工作流。建筑训练给了我「把约束变成形」的本能——如今用同一种理性做 AI 产品。</p>
        </div>

        <dl className="who-card" data-rv style={{ "--rd": "1.7s" }}>
          <div className="who-row">
            <dt className="k mono">BASE<span>坐标</span></dt>
            <dd className="v">Shenzhen<span className="sub mono">22.54°N · 114.05°E</span></dd>
          </div>
          <div className="who-row">
            <dt className="k mono">ROLE<span>角色</span></dt>
            <dd className="v">Vertical-Agent AIPM<span className="sub">产品 × 工程 × 设计</span></dd>
          </div>
          <div className="who-row">
            <dt className="k mono">EDU<span>训练</span></dt>
            <dd className="v">M.Arch · AI direction<span className="sub">SZU 在读 · GZHU B.Arch</span></dd>
          </div>
          <div className="who-row">
            <dt className="k mono">NOW<span>当前</span></dt>
            <dd className="v">XTOOL Agent Platform<span className="sub">9 tools · 220K LOC · ROI 0.39 H/$</span></dd>
          </div>
        </dl>
      </div>

      <div className="who-chrono">
        <div className="kick" data-rv style={{ "--rd": "1.95s" }}><span>CHRONO / 成就时间柱 — HOVER TO SCRUB · 悬停回看</span></div>
        <BarChrono items={WHO_CHRONO} />
      </div>
    </section>
  );
}

/* ── DEX — three identities · the index table ─────────────────
   Each row: number · BarWord title with a 跳色 letter (the one
   glyph that stays in the bar color — the logo's grammar) · the
   identity's own skyline signature · motto + proof. Click jumps
   into its chapter; hover focuses the row, the rest recede. */
function Dex({ jump }) {
  const { BarWord, BarBand } = window;
  const items = [
    { id: "aipm", ix: "01", tx: "An AIPM", d: 0.2,
      mt: "Order is the Product", zh: "秩序即产品",
      meta: "9 TOOLS · 220K LINES · ROI 0.39 H/$",
      band: [0.85, 0.6, 1, 0.55] },
    { id: "developer", ix: "02", tx: "A Developer", d: 0.55,
      mt: "Discipline is Leverage", zh: "纪律即杠杆",
      meta: "3 ENDS SOLO · 0 RECURRENCE",
      band: [0.6, 1, 0.7, 0.9] },
    { id: "architect", ix: "03", tx: "An Architect", d: 0.9,
      mt: "Form is Function", zh: "形式即功能",
      meta: "T1 PAPER · TOP 1% · 30D→5D",
      band: [1, 0.66, 0.5, 0.9] },
  ];
  return (
    <section className="dex sec" id="dex" data-tone="blue" data-ob data-screen-label="IDENTITIES">
      <div className="dex-ghost" data-parallax="0.12" aria-hidden="true">WHOAMI</div>
      <div className="dex-head kick">
        <span data-rv style={{ "--rd": ".05s" }}>INDEX / 三个身份 — I AM …</span>
        <span data-rv style={{ "--rd": ".18s" }}>CLICK TO ENTER · 点击进入章节</span>
      </div>
      <div className="dex-list">
        {items.map((it, i) => (
          <div key={it.id} className="dex-it" data-hov style={{ "--rd": (0.1 + i * 0.18) + "s" }} onClick={() => jump(it.id)}>
            <span className="ix mono" data-rv style={{ "--rd": (0.25 + i * 0.35) + "s" }}>{it.ix}</span>
            <BarWord className="tx" text={it.tx} delay={it.d} />
            <div className="side" data-rv style={{ "--rd": (0.5 + i * 0.35) + "s" }}>
              <BarBand h={it.band} />
              <div className="mt">{it.mt}</div>
              <div className="zh">{it.zh} · {it.meta}</div>
            </div>
            <span className="arr" aria-hidden="true">→</span>
          </div>
        ))}
      </div>
      <div className="dex-note kick" data-rv style={{ "--rd": "1.7s" }}>ONE DISCIPLINE · THREE PROOFS — 一种理性，三个证明</div>
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
   Act I  (cobalt)  AI products & agents · 2025–26
   Act II (ink)     architecture — the root system · 2020–25   */
const WORKS = [
  {
    ix: "W·01", t: "Pears — Agent Factory", display: "Pears", tag: "AI PRODUCT", year: "2026", dark: false,
    award: "ADVENTURE-X HACKATHON · 2ND PRIZE — OBSERVE → GENERATE → REINFORCE",
    link: "https://pearwork.netlify.app/",
    poster: "works/pears-roadshow-cover.jpg", video: "works/pears-roadshow.mp4", videoReady: true,
    mediaLabel: "PRODUCT FILM · 路演视频",
    caption: "PEERSWORK · 路演视频 · PRODUCT FILM", siteLabel: "pearwork.netlify.app",
    band: [0.5, 0.9, 0.65, 1, 0.7], role: ["Independent builder", "0 → launch"],
    body: "A browser extension watches you do the job once — inside a session you explicitly start — then distills the trace into an editable PRD, which an AI coding agent turns into your own workflow agent. The thesis came from a real observation at XTOOL: one dev team can never fill a whole company's agent demand, so lower the bar from \"describe AI\" to \"do it once\".",
    zh: "「观察 → 生成 → 强化」的 Agent 工厂：插件捕捉行为轨迹 → 蒸馏为可编辑 PRD → AI 编码 Agent 生成专属 Workflow Agent。可编辑 PRD 是观察层与执行层之间的契约。现场获企业对接意向最多的项目之一。",
    metrics: [["2nd", "HACKATHON PRIZE"], ["3", "ENDS SHIPPED SOLO"], ["PRD", "AS THE CONTRACT"]],
  },
  {
    ix: "W·02", t: "XTOOL Agent Platform", tag: "AI PLATFORM", year: "2026", dark: false,
    award: "0→1 SOLO · 9 TOOLS — ADOPTED BY 25+ OF A 48-PERSON DEPT",
    poster: "xtool/screenshots/demo_review.png", embed: "xtool/", link: "https://pearagent.netlify.app/",
    mediaLabel: "MOTION FILM · 互动影片", caption: "PEAR AGENT · 平台动态影片 · MOTION FILM",
    band: [0.85, 0.6, 1, 0.55, 0.8], role: ["AIPM / platform owner", "intern, dept. of 48"],
    body: "An internal agent tool matrix covering the whole content-production chain — scripting, research, cross-platform monitoring, AI review. Telemetry found a 52% drop at the Hook stage; judgment said high-creativity content can't be one-shot by an LLM; the prescription — merge generation stages, 3 candidates to pick from — drove three product generations. A self-built ROI board (0.39 h/$) keeps the platform honest.",
    zh: "单人主导部门 Agent 平台 0→1：9 个生产工具、22 万行 TypeScript、291 commits，48 人部门超半数纳入日常工作流。埋点 → 判断 → ship → 复测的闭环；自建 ROI 看板让中台的存在合理性可量化。首位受邀实习生在全公司公开课主讲。",
    metrics: [["9", "PRODUCTION TOOLS"], ["220K", "LINES TYPESCRIPT"], ["0.39", "ROI · H/$"]],
  },
  {
    ix: "W·03", t: "议见 Yijian — Consensus Engine", display: "议见 Yijian", tag: "AI PRODUCT", year: "2026", dark: false,
    award: "企业 AGENT 黑客松 · 2ND PRIZE 二等奖 — DECISION CONSENSUS FOR TEAMS",
    link: "https://yijian-demo4.netlify.app",
    poster: "works/yijian-cover.jpg", embed: "https://yijian-demo4.netlify.app",
    mediaLabel: "LIVE DEMO · 在线体验", caption: "议见 YIJIAN · 决策共识 AGENT · 在线 DEMO",
    band: [0.7, 0.9, 0.6, 1, 0.65], role: ["Product & build", "Enterprise hackathon · 2nd"],
    body: "A decision-consensus agent for enterprise teams. Name the call to make — a product pick, a budget add, a regional launch — and Yijian convenes a panel of role perspectives, then resolves them across four layers: strategic goal, factual evidence, stakeholder interest, weighted accountability. What it returns is not one opinion but an auditable verdict — a consensus score, the conditions a decision must clear, and the disagreements still worth solving.",
    zh: "面向企业团队的「决策共识」Agent：输入一项待决策事项，议见组织多角色视角，并在四层共识——战略目标 / 事实证据 / 利益角色 / 权重权责——上收敛分歧。产出的不是单一意见，而是可追溯的结论：共识度评分、决策需满足的附加条件、以及仍需解决的分歧点。企业 Agent 黑客松二等奖。",
    metrics: [["2nd", "ENTERPRISE HACKATHON"], ["4-LAYER", "CONSENSUS MODEL"], ["7-ROLE", "DELIBERATION"]],
  },
  {
    ix: "W·04", t: "UABB · AIGC Pipeline", tag: "AIGC PIPELINE", year: "2025", dark: false,
    award: "深港双年展 UABB 2025 · 50+ EXHIBITS — 30 DAYS → 5 DAYS",
    poster: "works/aftersilence-cover.jpg", video: "works/aftersilence.mp4", videoReady: true,
    mediaLabel: "AIGC FILM · 影像", caption: "UABB · AIGC PIPELINE · 影像",
    band: [0.7, 0.5, 0.85, 0.6, 1], role: ["AIGC pipeline assistant", "2025 UABB curatorial team"],
    body: "A ComfyUI pipeline wired to external APIs (Gemini / Tripo) that translates non-standard exhibits into standardized 3D assets. Processing time for 50+ exhibits fell from 30 days to 5; 120+ sketch-and-model iterations later, the result was selected as its section's sole representative (top 3%).",
    zh: "ComfyUI 外接 API 的自动化转译工作流 + 标准化 3D 资产 SOP：50+ 非标展品处理周期 30 天 → 5 天，成果作为板块唯一代表入选展会分享。",
    metrics: [["50+", "EXHIBITS PIPED"], ["6×", "FASTER CYCLE"], ["TOP 3%", "OF SECTION"]],
  },
  {
    ix: "W·05", t: "After_Silence", display: "After_Silence", tag: "ARCHITECTURE", year: "2025", dark: true,
    award: "深港双年展 UABB · 地外人居板块 SECTION REPRESENTATIVE — 火箭利用 × 地外人居",
    doc: "uploads/portfolio.pdf#page=4", mediaLabel: "PORTFOLIO · 作品集",
    pages: ["works/portfolio/aftersilence-1.jpg", "works/portfolio/aftersilence-2.jpg"],
    caption: "PORTFOLIO · 作品集 · 地外人居",
    band: [0.95, 0.55, 0.78, 0.62, 1], role: ["Design lead", "UABB off-world section"],
    body: "When the engines fall silent, life begins. Taking the first Mars base's pioneer cluster as prototype, the design turns technical modules into scenes of living — a closed Martian habitat loop where dwelling, energy and research sustain each other. Exhibited in mixed reality (N'Space, naked-eye 3D) at the UABB main hall as the section's representative work.",
    zh: "「当震耳欲聋的引擎彻底沉寂，真正的生活才刚刚开始。」以首座火星基地「首航组团」为原型，把功能模块转化为生活场景，提出居住、能源、科研相互依存的「火星人居闭环」。作为板块代表展品，以混合现实形式在深港双年展主展厅虚拟上线。",
    metrics: [["TOP 3%", "SECTION REPRESENTATIVE"], ["MR", "N'SPACE · NAKED-EYE 3D"], ["1", "CLOSED HABITAT LOOP"]],
  },
  {
    ix: "W·06", t: "上桥 Upper-Via", display: "上桥", tag: "ARCHITECTURE", year: "2023", dark: true,
    award: "「活力杯」大湾区高校设计大赛 · 1ST PRIZE 一等奖 — TOP 3%",
    doc: "uploads/portfolio.pdf#page=6", mediaLabel: "PORTFOLIO · 作品集",
    pages: ["works/portfolio/shangqiao-1.jpg", "works/portfolio/shangqiao-2.jpg", "works/portfolio/shangqiao-3.jpg", "works/portfolio/shangqiao-4.jpg"],
    caption: "PORTFOLIO · 作品集 · 桥上书屋",
    band: [1, 0.66, 0.5, 0.9, 0.72], role: ["Project lead", "活力杯 2023"],
    body: "Lychee Bay's water once gathered people; now it divides them. With no land left in the dense old quarter, the public space goes onto the water — a bridge-library stitching the two banks. Movable bookshelves let one span be a reading room by day, a waiting area at school run, an event hall on holidays. Needle-point urban renewal, now aligned with a real implementation project.",
    zh: "荔枝湾水系曾聚人，如今却隔开两岸。高密度老城无地可用，便把公共空间「上桥」外置水面：移动书柜让同一座桥在书屋、放学等候、社区活动三种模式间切换。绣花针式的城市更新，并与拟落地项目对接实施。",
    metrics: [["TOP 3%", "FIRST PRIZE 一等奖"], ["3", "MODES, ONE SPAN"], ["2", "BANKS RECONNECTED"]],
  },
  {
    ix: "W·07", t: "风贯·立方 Air Cube", display: "风贯·立方", tag: "ARCHITECTURE", year: "2025", dark: true,
    award: "2025 优秀毕业设计展 · 卓越奖 — 产城融合 · 工业上楼",
    doc: "uploads/portfolio.pdf#page=10", mediaLabel: "PORTFOLIO · 作品集",
    pages: ["works/portfolio/aircube-1.jpg", "works/portfolio/aircube-2.jpg", "works/portfolio/aircube-3.jpg"],
    caption: "PORTFOLIO · 作品集 · 产城融合",
    band: [0.7, 1, 0.6, 0.85, 0.55], role: ["Design lead", "毕业设计 2025"],
    body: "A \"factory-upstairs\" industry–city fusion for an IDC R&D centre in Guangzhou's Knowledge City. Production floors lift to level three and above; the entire second floor opens into a public void that doubles as a convective wind corridor, stack ventilation cooling the block without machines. Irregular perforated-aluminium façades and vertical greening modulate shade and heat, while a cold-lane ground level tunes the microclimate through planting and water evaporation. Prefab steel, rooftop PV and a rainwater loop close the energy gap.",
    zh: "以「工业上楼」为核心的产城融合：生产空间抬升至三层及以上，二层整体架空为通透公共空间，兼作对流通风廊道，结合热压通风实现自然降温。东西向不规则穿孔铝板幕墙 + 垂直绿化动态遮阳隔热；架空层引入冷巷原理，以植被与水体蒸发优化微气候。装配式钢结构 + 屋顶光伏 + 雨水循环系统进一步降低能耗。科力新能源 IDC · 大湾区研发中心，2025 优秀毕业设计展卓越奖。",
    metrics: [["卓越奖", "GRAD SHOW · 2025"], ["L2", "PUBLIC WIND VOID"], ["PV", "+ RAINWATER LOOP"]],
  },
  {
    ix: "W·08", t: "环·世界 The Ring-World", display: "环·世界", tag: "ARCHITECTURE", year: "2024", dark: true,
    award: "「华灿奖」两岸新锐设计竞赛 · 1ST PRIZE 一等奖 — TOP 5%",
    doc: "uploads/portfolio.pdf#page=19", mediaLabel: "PORTFOLIO · 作品集",
    pages: ["works/portfolio/ringworld-1.jpg", "works/portfolio/ringworld-2.jpg", "works/portfolio/ringworld-3.jpg"],
    caption: "PORTFOLIO · 作品集 · 声景社区",
    band: [0.78, 0.6, 0.95, 0.55, 0.84], role: ["Project lead", "华灿奖 2024"],
    body: "A rental community above a metro depot: 72 dB of traffic noise, public space squeezed to 35% of normal. The answer flips the public realm vertically — a double-deck roaming loop strings roof gardens and shared living rooms together, while a parametric acoustic façade opens and closes against the simulated noise map, trading view against silence in real time. 5,000 m² of shared ground reclaimed.",
    zh: "车辆段上盖、昼间 72 分贝、公共空间仅为商品住宅 35% 的租赁社区。把公共空间垂直翻转：双层立体漫游环串联屋顶花园与共享客厅；临声面以参数化动态隔音幕墙围合，依据 SoundPlan 噪声模拟实时权衡视野与隔音。释放 5000 ㎡ 共享场域，课题 96 分。",
    metrics: [["72dB", "SITE NOISE, ANSWERED"], ["5000㎡", "SHARED FIELD FREED"], ["96/100", "STUDIO SCORE"]],
  },
];

/* the logo's skyline rhythm — the same eight bars as the .IAM. mark.
   THIS is the thesis of the WORKS section: the mark is not decoration,
   it is an index. Eight bars, eight works — bar[i] IS work[i]. The
   section decodes the mark, one bar at a time, the blue square (the
   self · the period) walking the skyline as the reader. 条 → 字. */
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

/* ── the portfolio flip-book — for the architecture works whose body
   lives as作品集 spreads. The same .sc-media 16:9 frame, but the A3 page
   sits object-fit:contain (whole spread visible) and ‹ › flip through
   THIS work's pages only (After_Silence = 2, 上桥 = 4, …). Square pips =
   the period motif, doubling as the page index. 条 → 页. ── */
function WorkGallery({ wk }) {
  const [idx, setIdx] = useSecState(0);
  const n = wk.pages.length;
  const go = (d, ev) => { if (ev) { ev.preventDefault(); ev.stopPropagation(); } setIdx((i) => (i + d + n) % n); };
  return (
    <div className="sc-media gallery"
         tabIndex={0}
         onKeyDown={(e) => { if (e.key === "ArrowLeft") go(-1, e); else if (e.key === "ArrowRight") go(1, e); }}>
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
               preload="metadata" playsInline controls={playing}
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
          ? <img className="sc-still" src={wk.poster} alt={wkShort(wk)} draggable="false" />
          : <span className="sc-still"></span>}
        <span className="sc-play" aria-hidden="true"><span className="tri"></span></span>
      </button>
    );
  }
  if (wk.poster) {
    return (
      <a className="sc-media" href={wk.link} target="_blank" rel="noopener" data-hov>
        <img className="sc-still" src={wk.poster} alt={wkShort(wk)} draggable="false" />
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
  const [open, setOpen] = useSecState(null);

  /* the whole stage is driven by scroll progress — one rAF, only
     style writes, mirroring useChProg in chapters.jsx. */
  useSecEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const cards = [...stage.querySelectorAll(".wk-card")];
    const bodies = cards.map((c) => c.querySelector(".wc-body"));
    const fulls = cards.map((c) => c.querySelector(".wc-full"));
    const works = [...stage.querySelectorAll(".wk-show-item")];
    const intro = stage.querySelector(".wk-intro");
    const foot = stage.querySelector(".wk-foot");
    const cur = stage.querySelector(".wk-cur");
    const N = cards.length;
    let lastActive = -1, disp = 0;

    /* TRUE MORPH — not a crossfade. The cards ARE the logo's bars, grown.
       We read the live <.brandmorph .band i> rectangles every frame so each
       card starts as a pixel-exact replica of its bar (same place, width and
       ink colour); then it physically stretches + recolours into a poster.
       The logo hands off by simply fading from ON TOP of identical cards —
       so the bar columns never change, only the periods melt away. 条 → 卡. */
    const bmBars = [...document.querySelectorAll(".brandmorph .band i")];
    const toRGB = (s) => { const m = (s || "").match(/-?\d+(\.\d+)?/g); return m ? m.slice(0, 3).map(Number) : [11, 11, 14]; };
    const srcRGB = bmBars[0] ? toRGB(getComputedStyle(bmBars[0]).backgroundColor) : [11, 11, 14];
    const tgtRGB = cards.map((c) => toRGB(getComputedStyle(c).backgroundColor));
    const mix = (a, b, t) => "rgb(" + a.map((v, k) => Math.round(v + (b[k] - v) * t)).join(",") + ")";
    let barRects = null, colored = false;

    const tick = () => {
      const p = clp((window.__progress && window.__progress.works) || 0, 0, 1);
      const r = stage.getBoundingClientRect();
      const W = r.width, H = r.height;

      /* the fan opens, then browsing flows straight out of the opening with
         no dead beat: the open phase finishes around p=0.40 and the focus
         emphasis RAMPS in across that same boundary so nothing pops.
         条 → 卡 → 字. */
      /* open → reconverge: the mark UNFOLDS into the deck (openRaw), then near
         the end the deck collapses BACK into the mark (close). eS is the live
         "openness" — the brandmorph logo reads it (window.__wkOpen) to know when
         to hand off the closed mark and when to take it back. 条 ⇄ 卡 ⇄ 条. */
      const openRaw = eOut(smooth(0.05, 0.40, p));     /* closed mark → open fan */
      const close = eOut(smooth(0.82, 0.96, p));       /* fan → reconverged mark */
      const eS = openRaw * (1 - close);
      window.__wkOpen = eS;
      /* GEOMETRY GATE — the cards must sit PIXEL-EXACT on the logo bars while the
         logo fades off the top of them (eS 0→~0.12). If the bar→card unfold were
         driven by eS directly, the cards would already be growing + sliding while
         the logo is still visible — the two bar sets diverge and you see a ghost.
         So the unfold (eGeo) is held at 0 until the handoff window is past, THEN
         ramps. Below FHAND the cards are frozen on the bars; the logo dissolves
         into identical, motionless rectangles. 条 → 卡, nothing to dissolve. */
      const FHAND = 0.12;
      const eGeo = clp((eS - FHAND) / (1 - FHAND), 0, 1);
      const pB = clp((p - 0.40) / 0.42, 0, 1);         /* scrub across the deck (browse window) */
      /* emphasis is fully in by the time the FIRST card is active (p≈0.40) so
         W·01/W·02 decode their names; the ramp still starts AFTER the bar→card
         morph is done (eGeo≈1 by p≈0.30) so no card pops wide mid-handoff. */
      const focus = smooth(0.26, 0.40, p) * (1 - close); /* emphasis eases in, fades on reconverge */
      /* DWELL — instead of a linear scrub (where the next work surfaces while
         the last is still arriving), each work HOLDS in focus, then the scrub
         moves briskly to the next. The plateau at each integer is the dwell. */
      const raw = pB * (N - 1);
      const k = Math.min(Math.floor(raw), N - 2);
      const seg = k + smooth(0.34, 0.66, raw - k);
      /* HOVER SCRUB — once the deck is open, sweeping the mouse across the cards
         pulls focus to whichever card is under the pointer, no scrolling needed. */
      const hv = hoverRef.current;
      const target = (hv != null && eS > 0.55) ? hv : seg;
      /* silky inertia — the focus glides toward target rather than snapping. */
      disp += (target - disp) * 0.14;
      if (Math.abs(target - disp) < 0.002) disp = target;
      const active = Math.round(disp);

      /* intro caption blooms as the logo lands at centre, then lifts away as
         the mark unfolds */
      const introOp = smooth(0, 0.028, p) * (1 - smooth(0.075, 0.17, p));
      intro.style.opacity = introOp.toFixed(3);
      intro.style.transform = "translate(-50%," + (-40 * eS).toFixed(1) + "px)";

      /* CLOSED state — the logo skyline. Fallback footprint (≈42vw wide,
         baseline 46vh, max bar ≈15vh) used only if the real logo isn't found. */
      const cTot = clp(W * 0.42, 320, 900);
      const cw = cTot / (N * 1.62 - 0.62), cgap = cw * 0.62;
      const cx0 = W * 0.5 - cTot / 2, cBase = H * 0.46, cMax = H * 0.15;

      /* read the live logo bars (relative to the stage) — the cards' closed
         state. Re-measured through the morph zone; cached during browse where
         the logo is parked dead-still at centre. This guarantees each card
         BEGINS exactly on its bar, so the handoff has nothing to dissolve. */
      if (bmBars.length === N && (eS < 0.55 || !barRects)) {
        barRects = bmBars.map((b) => {
          const br = b.getBoundingClientRect();
          return { x: br.left - r.left, y: br.top - r.top, w: br.width, h: br.height };
        });
      }

      /* recolour ink-bar → poster colour, but only through the morph — once
         open, hand styling back to CSS so focus/hover stay authoritative. */
      const colorT = smooth(0.0, 0.45, eGeo);
      if (eGeo < 0.52) {
        cards.forEach((c, i) => { c.style.backgroundColor = mix(srcRGB, tgtRGB[i], colorT); });
        colored = true;
      } else if (colored) {
        cards.forEach((c) => { c.style.backgroundColor = ""; });
        colored = false;
      }

      /* OPEN state — a fanned spread of poster cards. The FOCUSED card
         stretches HORIZONTALLY into a wide poster (name + honors); the
         rest stay slim skyline bars behind it. 卡 → 宽卡. */
      const cardW = clp(W * 0.15, 132, 212);
      const cardH = clp(H * 0.30, 188, 286);
      const fanCx = W * 0.5;
      /* airy but always within frame: ~8% overlap on wide screens, a touch
         more on narrow, never wider than 94% of the stage. */
      const step = Math.min(cardW * 0.92, (W * 0.94 - cardW) / (N - 1));
      const fanTop = H * 0.105;
      const angStep = 1.45;
      const focusW = clp(W * 0.56, 420, 860);   /* the stretched banner width — wider so the short banner stays legible */
      const focusH = clp(H * 0.19, 132, 188);   /* shorter banner — frees vertical room for the media below */
      const marginX = W * 0.06;

      cards.forEach((card, i) => {
        const off = i - (N - 1) / 2;

        /* closed (bar) geometry — straight off the live logo (fallback formula
           only if it wasn't measured). */
        const bc = barRects && barRects[i];
        const barX = bc ? bc.x : (cx0 + i * (cw + cgap));
        const barW = bc ? bc.w : cw;
        const barH = bc ? bc.h : (OVR_BARS[i] * cMax);
        const barTop = bc ? bc.y : (cBase - barH);

        /* open (card) geometry + active emphasis.
           `e` (emphasis) = bell focus × the smooth ramp, so it grows in
           continuously from the open fan — never a hard on/off. */
        const dd = i - disp;
        const bell = Math.exp(-(dd * dd) / 0.42);        /* tighter focus — one card at a time */
        const e = bell * focus;                          /* emphasis grows in with the ramp */
        const rec = (1 - bell) * focus;                  /* the inverse — how "backgrounded" a card is */

        /* the focused card STRETCHES horizontally, in place over its own slot,
           clamped to stay on screen; neighbours stay narrow behind it. */
        const wOpen = lerp(cardW, focusW, e);
        const hOpen = lerp(cardH, focusH, e);
        /* the focused card glides to screen centre so it sits directly above the
           centred showcase below — aligned, not drifting left/right; neighbours
           keep their fan slots. */
        const slotCx = lerp(fanCx + off * step, fanCx, e);
        const cCx = clp(slotCx, marginX + wOpen / 2, W - marginX - wOpen / 2);
        const cardX = cCx - wOpen / 2;
        /* the focused work rises clear of the deck; the rest sink + recede,
           so the active poster and the still-encoded ones never blur together */
        const cardTop = fanTop + Math.abs(off) * 6 - 34 * e + 16 * rec;
        const ang = (off * angStep) * (1 - 0.96 * e);
        const sclRec = 1 - 0.14 * rec;                   /* backgrounded ≈-14%; focus grows via width */

        /* stretch the bar into the card — same element, continuous geometry */
        const x = lerp(barX, cardX, eGeo);
        const w = lerp(barW, wOpen, eGeo);
        const h = lerp(barH, hOpen, eGeo);
        const top = lerp(barTop, cardTop, eGeo);
        const rot = ang * eGeo;
        const scale = lerp(1, sclRec, eGeo);

        card.style.width = w.toFixed(1) + "px";
        card.style.height = h.toFixed(1) + "px";
        card.style.transform = "translate(" + x.toFixed(1) + "px," + top.toFixed(1) +
          "px) rotate(" + rot.toFixed(2) + "deg) scale(" + scale.toFixed(3) + ")";
        /* the slim skyline body (bars + number) fades out as the wide face
           (name + honors) decodes in. 条/号 → 名/荣誉. */
        const fullOp = (smooth(0.42, 0.95, e) * eGeo);
        bodies[i].style.opacity = (smooth(0.46, 0.92, eS) * (1 - fullOp)).toFixed(3);
        if (fulls[i]) fulls[i].style.opacity = fullOp.toFixed(3);
        /* border + drop-shadow are the only things that read "card not bar" —
           toggled once (CSS eases them) so a bar never carries a shadow. */
        card.classList.toggle("solid", eS > 0.34);
        /* visibility hierarchy: the active poster stays full-strength; the
           not-yet-decoded works recede to ~0.42 so they read as a quiet index,
           clearly separated from the one in focus. */
        const dim = 1 - rec * 0.58;
        /* the card is OPAQUE the instant it leaves the bar (no fade-in): it is
           identical to the bar it covers, so the logo can fade off the top of
           it with nothing to dissolve. Reverses cleanly on reconverge. */
        const appear = smooth(0.0, 0.05, eS);
        card.style.opacity = (appear * dim).toFixed(3);
        card.style.zIndex = String(100 - Math.round(Math.abs(dd) * 6) - Math.abs(Math.round(off)));
      });

      /* the work showcase below — the active work, crossfaded */
      works.forEach((wEl, i) => {
        const d = disp - i;
        const op = clp(1 - Math.abs(d) / 0.62, 0, 1) * smooth(0.05, 0.35, focus) * (1 - close);
        wEl.style.opacity = op.toFixed(3);
        wEl.style.transform = "translateY(" + (-d * 26).toFixed(1) + "px)";
        wEl.style.pointerEvents = op > 0.6 ? "auto" : "none";
      });

      if (active !== lastActive) {
        if (cur) cur.textContent = String(active + 1).padStart(2, "0");
        lastActive = active;
      }
      foot.style.opacity = (smooth(0.05, 0.35, focus) * (1 - close)).toFixed(3);
    };

    if (!window.__addLoop) { tick(); return; }
    const stop = window.__addLoop(tick);
    return () => stop();
  }, []);

  useSecEffect(() => {
    const esc = (ev) => { if (ev.key === "Escape") setOpen(null); };
    /* the hover selection STICKS — it won't fly back to the scrubbed card when the
       pointer leaves. Scrolling is what hands control back to the scroll-scrub. */
    const onScroll = () => { hoverRef.current = null; };
    window.addEventListener("keydown", esc);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("keydown", esc); window.removeEventListener("scroll", onScroll); };
  }, []);

  const od = open != null ? WORKS[open] : null;

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

          <div className="wk-fan" aria-hidden="false"
               onPointerMove={(ev) => {
                 /* hover-scrub, movement-driven: focus whichever card is actually
                    under the pointer. Using pointermove (not pointerenter) means a
                    card sliding under a STILL cursor never re-triggers — no float. */
                 if ((window.__wkOpen || 0) <= 0.55) return;
                 const card = ev.target.closest(".wk-card");
                 if (card && card.dataset.i != null) hoverRef.current = +card.dataset.i;
               }}>
            {WORKS.map((wk, i) => (
              <button key={i} type="button" data-i={i}
                      className={"wk-card" + (wk.dark ? " ink" : "")} data-hov
                      onClick={() => setOpen(i)} aria-label={wk.ix + " " + wk.t}>
                <span className="wc-body">
                  <span className="wc-top mono"><span>{wk.tag}</span><span>{wk.year}</span></span>
                  <span className="wc-band" aria-hidden="true">
                    {wk.band.map((h, j) => <i key={j} style={{ "--h": h }}></i>)}
                    <i className="sq"></i>
                  </span>
                  <span className="wc-spacer"></span>
                  <span className="wc-no">{String(i + 1).padStart(2, "0")}</span>
                </span>
                <span className="wc-full">
                  <span className="wc-l">
                    <span className="wc-fmeta mono"><span className="ix">{wk.ix}</span><span>{wk.tag} · {wk.year}</span></span>
                    <span className="wc-name">{wkShort(wk)}<i className="psq" aria-hidden="true"></i></span>
                    <span className="wc-fsub mono">{wk.role[0]} · {wk.role[1]}</span>
                  </span>
                  <span className="wc-r">
                    <span className="wc-faw mono">{wk.award}</span>
                    <span className="wc-fmx">
                      {wk.metrics.map(([b, l], j) => (<span className="m" key={j}><b>{b}</b><span>{l}</span></span>))}
                    </span>
                  </span>
                </span>
              </button>
            ))}
          </div>

          <div className="wk-show">
            {WORKS.map((wk, i) => (
              <div key={i} className={"wk-show-item" + (wk.dark ? " ink" : "")}>
                <div className="sc-top mono">
                  <span className="l"><span className="dot"></span><span>{wk.ix}</span><b>{wk.tag} · {wk.year}</b></span>
                  <span className="r">{wk.mediaLabel || (wk.poster ? "PRODUCT FILM · 路演视频" : wk.doc ? "PORTFOLIO · 作品集 PDF" : "ARCHIVE · 作品本体待上线 / TBD")}</span>
                </div>
                <div className="sc-frame">
                  <span className="sc-rail l mono" aria-hidden="true">
                    <span className="rl-t">{wk.ix}</span>
                    <span className="rl-tick"></span>
                    <span className="rl-b">{wk.mediaLabel || "ARCHIVE"}</span>
                  </span>
                  <WorkMedia wk={wk} />
                  <span className="sc-rail r mono" aria-hidden="true">
                    <span className="rl-t">{wk.role[0]}</span>
                    <span className="rl-tick"></span>
                    <span className="rl-b">{wk.tag} · {wk.year}</span>
                  </span>
                </div>
                <div className="sc-foot">
                  {wk.link ? (
                    <a className="sc-name" href={wk.link} target="_blank" rel="noopener" data-hov>
                      {wkShort(wk)}<i className="psq" aria-hidden="true"></i><span className="go mono">访问项目 ↗</span>
                    </a>
                  ) : wk.doc ? (
                    <a className="sc-name" href={wk.doc} target="_blank" rel="noopener" data-hov>
                      {wkShort(wk)}<i className="psq" aria-hidden="true"></i><span className="go mono">查看作品集 ↗</span>
                    </a>
                  ) : (
                    <span className="sc-name">{wkShort(wk)}<i className="psq" aria-hidden="true"></i></span>
                  )}
                  <span className="sc-cap">{wk.caption || (wk.ix + " · 待补充 / TBD")}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="wk-foot mono">
            <span className="wf-l"><span className="wk-cur">01</span> / 0{WORKS.length} · 解码中</span>
            <span className="wf-r">SCROLL OR HOVER TO BROWSE · CLICK FOR DOSSIER · 滑动或悬停浏览，点击查看档案</span>
          </div>
        </div>
      </div>

      <div className={"dossier" + (open != null ? " on" : "")} aria-hidden={open == null}>
        <div className="scrim" onClick={() => setOpen(null)}></div>
        {od && (
          <div className="sheet">
            <button className="x" data-hov onClick={() => setOpen(null)}>✕</button>
            <div className="dk">{od.ix} · {od.tag} · {od.year} — DOSSIER / 档案</div>
            <h2>{od.t}</h2>
            <div className="drule"></div>
            <div className="role">{od.role[0]} — <i>{od.role[1]}</i></div>
            <div className="daward">{od.award}</div>
            <p>{od.body}</p>
            <div className="dmetrics">
              {od.metrics.map(([b, l], i) => <div className="m" key={i}><b>{b}</b><span>{l}</span></div>)}
            </div>
            <div className="dzh">{od.zh}</div>
            {od.link && <a className="dlink" data-hov href={od.link} target="_blank" rel="noopener">VISIT LIVE · 访问项目 ↗</a>}
            {od.doc && <a className="dlink" data-hov href={od.doc} target="_blank" rel="noopener">查看作品集 · PORTFOLIO ↗</a>}
          </div>
        )}
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
function Contact() {
  return (
    <section className="contact sec" id="contact" data-tone="paper" data-ob data-screen-label="CONTACT" style={{ paddingLeft: 0, paddingRight: 0 }}>
      <div style={{ padding: "0 40px" }}>
        <div className="kick lm"><span>06 · CONTACT / 联系 — OPEN TO AI PRODUCT ROLES · 深圳</span></div>
        <div style={{ marginTop: "3vh" }}>
          <IamFinale />
        </div>
        <div className="c-grid">
          <div className="c-left" data-rv style={{ "--rd": ".3s" }}>
            <div className="cm">CONTACT ME<span className="psq" aria-hidden="true"></span></div>
            <div className="rule crule in"></div>
            <div className="c-note mono">OPEN TO AI PRODUCT ROLES<br />深圳 · SHENZHEN · 远程亦可</div>
          </div>
          <div className="c-list" data-rv style={{ "--rd": ".42s" }}>
            <a className="crow" href="tel:18948953396" data-hov>
              <span className="cl">Phone</span><span className="cv">+86 189-4895-3396</span>
            </a>
            <a className="crow" href="mailto:1308577030@qq.com" data-hov>
              <span className="cl">E-mail</span><span className="cv">1308577030@qq.com</span>
            </a>
            <div className="crow">
              <span className="cl">WeChat</span><span className="cv">ID_0912</span>
            </div>
            <a className="crow" href="https://github.com/leemenuong" target="_blank" rel="noopener" data-hov>
              <span className="cl">GitHub</span><span className="cv">@leemenuong&nbsp;↗</span>
            </a>
            <a className="crow" href="https://pearwork.netlify.app/" target="_blank" rel="noopener" data-hov>
              <span className="cl">Pear · Web</span><span className="cv">pearwork.netlify.app&nbsp;↗</span>
            </a>
            <a className="crow" href="https://pearagent.netlify.app/" target="_blank" rel="noopener" data-hov>
              <span className="cl">Pear · Agent</span><span className="cv">pearagent.netlify.app&nbsp;↗</span>
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

Object.assign(window, { Hero, Whoami, Dex, Chapter, CodePanel, Works, IamFinale, Contact, WORKS });
