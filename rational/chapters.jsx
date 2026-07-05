/* ══════════════════════════════════════════════════════════════
   chapters.jsx — the three identities · three expressions.
   One language (bars ⇄ glyphs · the blue period), three dimensions:

   03 · An AIPM      — THE THREAD 一线穿点 · FLAT 2D
       Prioritisation as one line stringing through a few signal
       points; the one it lands on ignites cobalt as the period,
       the rest recede on the line. A single horizontal line —
       lays out the same on phone and desktop. (See aipm-cut.jsx.)

   02 · A Developer  — AXON 体 · 3D
       The .IAM. band extruded into an axonometric structure.
       Commits rain through three gates (rule / static test /
       merge gate); what passes lands and the skyline assembles.
       Drag to orbit.

   04 · An Architect — FIELD 场 · ABSTRACT
       Forces as a particle field. Scroll condenses the flow
       into contour rings, and a plan figure — with the blue
       period at its threshold — emerges from the noise.

   Titles stay in the 字⇄条 grammar (BarWord + the period).
   ══════════════════════════════════════════════════════════════ */

const { useEffect: useChE, useRef: useChR } = React;

/* progress → stage: writes --p and toggles .on on [data-th] nodes */
function useChProg(id, ref) {
  useChE(() => {
    const el = ref.current; if (!el) return;
    const ths = [...el.querySelectorAll("[data-th]")].map((n) => [n, parseFloat(n.dataset.th)]);
    let last = -2;
    const stop = window.__addLoop(() => {
      const p = (window.__progress && window.__progress[id]) || 0;
      if (Math.abs(p - last) < 0.0008) return;
      last = p;
      el.style.setProperty("--p", Math.max(0, Math.min(1, p)).toFixed(4));
      ths.forEach(([n, t]) => n.classList.toggle("on", p >= t));
    });
    return () => stop();
  }, []);
}

/* (03 的「一线穿点」过场动画页已删 — 用户 2026-07-03: 02 An AIPM 直达平台页，
   中间不留白。aipm-cut.jsx 留在磁盘但不再被 index.html 加载。) */

/* ════════════════════════════════════════════════════════════
   03 · AN AIPM — CO-WORK AGENT PLATFORM · 平台即章节
   Two quiet Chinese pages explain the platform thesis — 01 能力（人效 →
   Agent 工作流）→ 02 定义（不仅是工具，是一套闭环系统）— each followed by
   its own diagram board; only then does the product film appear.
   ════════════════════════════════════════════════════════════ */
/* 三个对页的文案（杂志编辑式 · 变体 B，2026-07 用户选定）——正文比旧版
   略厚一拍：每页把示意图的语义在文里接住，读文即懂图。 */
const APX_INTRO_PAGES = [
  {
    ix: "01",
    tag: "平台能力",
    title: "把人效工作变成 Agent 工作流。",
    body: "把大家的需求收集起来，就成了 Agent。调研、脚本、审核、复测——这些每天被重复做的事，现在排成一条自动跑完的工作流。",
  },
  {
    ix: "02",
    tag: "平台定义",
    title: "不仅是工具，更是一套系统。",
    body: "同事在飞书发起需求，Agent 调用外部数据和 RAG 知识库生成内容，飞书再把结果送回他手里，完成闭环。七个工具共用同一套记忆、规则和数据。",
  },
  {
    ix: "03",
    tag: "平台影片",
    title: "看它怎么跑。",
    body: "上面那套系统，下面实机走一遍。",
  },
];

/* 刊末条 — 已确认事实（与 WHOAMI 时间线一致）；数字墨色（跳色只落点上） */
const APX_STATS = [
  { n: "7", unit: " 个", label: "生产工具" },
  { n: "4", unit: " 部门 · 65 人", label: "覆盖范围" },
  { n: "80%+", unit: "", label: "任务完成率" },
  { n: "0.39", unit: " 工时", label: "每投入 $1 节省" },
];

/* reduce 偏好在模块级判一次 — SMIL 巡回点按此决定渲染动画还是静置 */
const APX_REDUCE = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/* the film plumbing — all that survives of the old keynote hook. The page is
   normal flow now (every block statically visible, fading in via [data-rv]);
   this only manages the film iframe:
   · loading poster — shown the instant the iframe is pointed at the film,
     hidden when the embedded film posts 'pearmovie:ready' (its first painted
     frame — the iframe's own 'load' event fires too early, 用户: 视频先黑屏),
     with a 3.2s post-load safety net so it can never get stuck.
   · DESKTOP: the film loads ONCE when the film block scrolls into view
     (IntersectionObserver, same precedent as the Reel film) and is never
     re-pointed — re-setting src would restart the movie + re-show the loader.
     xtool/?fresh=1 → starts at 0:00 on arrival (播放偏好约定).
   · PHONE/TABLET: the explicit tap poster loads it instead (button below). */
function useApxFilm(ref, frameRef) {
  useChE(() => {
    const el = ref.current; if (!el) return;
    const frame = frameRef.current;
    const vid = el.querySelector(".apx-video");
    const loading = el.querySelector(".apx-video-loading");
    const showLoad = () => { if (loading) loading.style.display = "flex"; };
    const hideLoad = () => { if (loading) loading.style.display = "none"; };
    const onFilmMsg = (e) => { if (e && e.data === "pearmovie:ready") hideLoad(); };
    addEventListener("message", onFilmMsg);
    let safetyT = 0;
    const onFrameLoad = () => { clearTimeout(safetyT); safetyT = setTimeout(hideLoad, 3200); };
    if (frame) frame.addEventListener("load", onFrameLoad);
    let filmLoaded = false, io = null;
    const phone = window.matchMedia && window.matchMedia("(max-width: 900px)").matches;
    if (frame && vid && !phone && "IntersectionObserver" in window) {
      io = new IntersectionObserver((es) => {
        es.forEach((en) => {
          if (!filmLoaded && en.isIntersecting && en.intersectionRatio >= 0.35) {
            filmLoaded = true; showLoad(); frame.src = "xtool/?fresh=1";
            if (io) io.disconnect();
          }
        });
      }, { threshold: [0, 0.35, 0.6] });
      io.observe(vid);
    }
    return () => {
      removeEventListener("message", onFilmMsg); clearTimeout(safetyT);
      if (frame) frame.removeEventListener("load", onFrameLoad);
      if (io) io.disconnect();
    };
  }, []);
}

function ChAipmPlatform({ jump }) {
  const ref = useChR(null);
  const frameRef = useChR(null);
  const [filmOn, setFilmOn] = React.useState(false);
  useApxFilm(ref, frameRef);
  /* closing CTA — after the platform film, the same live-site link as the AIPM
     identity chapter (XTOOL Agent Platform). Resolved from WORKS. */
  const aipmWk = (window.WORKS || []).find((w) => w.tag === "AI PLATFORM");
  const aipmUrl = (aipmWk && aipmWk.link) || "https://peersagent.netlify.app/";
  /* 杂志对页（变体 B）：三个 spread 顺滚——P1 左文右图（右出血）、P2 镜像
     拉页、P3 压轴影片 + 刊末条 + CTA。每个 spread 一个 data-ob="self" 锚点，
     内部节拍全走 CSS（.apx-spread.in 级联，见 chapters.css）。示意图为圆头
     线 SVG 信息图：线逐笔画出、节点后弹、蓝点到站减速。影片管线
     （useApxFilm 的 .apx-video/.apx-video-loading 选择器 + tap-to-play）原封保留。 */
  /* P2 旅程 — 到场自动播一次（IO ≥0.5），点选图版重播；reduce 不启动 */
  useChE(() => {
    if (APX_REDUCE) return;
    const ride = document.getElementById("apxRide");
    const board = document.querySelector(".apx-p2 .apx-chipart");
    if (!ride || !board || !("IntersectionObserver" in window)) return;
    let played = false;
    const io = new IntersectionObserver((es) => {
      es.forEach((en) => {
        if (en.isIntersecting && en.intersectionRatio >= 0.5 && !played) {
          played = true; try { ride.beginElement(); } catch (e) {}
          io.disconnect();
        }
      });
    }, { threshold: [0, 0.5] });
    io.observe(board);
    const replay = () => { try { ride.beginElement(); } catch (e) {} };
    board.addEventListener("click", replay);
    return () => { io.disconnect(); board.removeEventListener("click", replay); };
  }, []);
  const [p1, p2, p3] = APX_INTRO_PAGES;
  return (
    <section className="chapter apx" id="aipm" data-tone="paper" data-screen-label="03 · An AIPM — Co-work Agent Platform">
      <div className="apx-stage" ref={ref}>
        <div className="apx-kicker mono" data-rv data-ob="self">
          <span>03 · AN AIPM</span><span>CO-WORK AGENT PLATFORM · 平台</span>
        </div>
        <div className="apx-cap mono" data-rv data-ob="self" style={{ "--rd": ".04s" }}>Co-work / 内容生产 Agent OS</div>
        <h2 className="apx-title" data-rv data-ob="self" style={{ "--rd": ".1s" }}>Co-work<br />Agent Platform<i className="psq" aria-hidden="true"></i></h2>

        {/* ── P1 · 平台能力 — 左文右图，图版右出血 ── */}
        <div className="apx-spread apx-p1" data-ob="self">
          <div className="apx-ghost" aria-hidden="true">01</div>
          <div className="apx-copy2">
            <div className="apx-kick2">{p1.ix} · {p1.tag}</div>
            <h3>{p1.title.slice(0, -1)}<i className="psq" aria-hidden="true"></i></h3>
            <p>{p1.body}</p>
          </div>
          <div className="apx-chipart apx-art" aria-hidden="true">
            <svg viewBox="0 0 960 430">
              <defs>
                <marker id="apxChev" viewBox="0 0 12 12" refX="7" refY="6" markerWidth="8" markerHeight="8" orient="auto">
                  <path d="M2,1.5 L8,6 L2,10.5" fill="none" stroke="#0b0b0e" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                </marker>
              </defs>
              {/* 左：人效四行 — 圆头短线，刻意参差 */}
              <g fontFamily="Helvetica Neue, sans-serif" fontWeight="800" fontSize="17" fill="#0b0b0e">
                <text className="pop" x="40" y="88" style={{ "--d": ".5s" }}>调研</text>
                <text className="pop" x="68" y="152" style={{ "--d": ".55s" }}>脚本</text>
                <text className="pop" x="52" y="216" style={{ "--d": ".6s" }}>审核</text>
                <text className="pop" x="80" y="280" style={{ "--d": ".65s" }}>复测</text>
              </g>
              <g stroke="#0b0b0e" strokeWidth="7" strokeLinecap="round" opacity=".72">
                <g style={{ "--d": ".55s" }}>{[[106,136,82],[146,174,84],[184,216,81],[226,252,83],[262,290,82]].map(([a,b,y],k) => <line key={k} className="draw" pathLength="1" x1={a} y1={y} x2={b} y2={y} />)}</g>
                <g style={{ "--d": ".62s" }}>{[[134,166,146],[176,204,148],[214,244,145]].map(([a,b,y],k) => <line key={k} className="draw" pathLength="1" x1={a} y1={y} x2={b} y2={y} />)}</g>
                <g style={{ "--d": ".69s" }}>{[[118,146,210],[156,188,212],[198,224,209],[234,262,211],[272,300,210],[310,336,212]].map(([a,b,y],k) => <line key={k} className="draw" pathLength="1" x1={a} y1={y} x2={b} y2={y} />)}</g>
                <g style={{ "--d": ".76s" }}>{[[146,178,274],[188,214,276],[224,254,273],[264,290,275]].map(([a,b,y],k) => <line key={k} className="draw" pathLength="1" x1={a} y1={y} x2={b} y2={y} />)}</g>
              </g>
              {/* callout 注释 — 引线 + 小圆点收尾 */}
              <path className="draw" pathLength="1" d="M300,352 Q330,332 336,232" fill="none" stroke="rgba(11,11,14,.35)" strokeWidth="1.5" strokeLinecap="round" style={{ "--d": ".9s" }} />
              <circle className="pop" cx="336" cy="228" r="2" fill="rgba(11,11,14,.35)" style={{ "--d": ".95s" }} />
              <text className="pop" x="176" y="372" fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="1.8" fill="rgba(11,11,14,.55)" style={{ "--d": ".92s" }}>同样的事，每天重复地做</text>
              {/* 中：S 曲线手递 + pill */}
              <path className="draw" pathLength="1" d="M340,220 C420,220 430,150 500,142" fill="none" stroke="#0b0b0e" strokeWidth="2.25" strokeLinecap="round" markerEnd="url(#apxChev)" style={{ "--d": ".8s" }} />
              <g className="pop" style={{ "--d": ".9s" }}>
                <rect x="382" y="168" rx="12" width="112" height="26" fill="rgba(11,11,14,.05)" />
                <text x="438" y="185" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="2" fill="#0b0b0e">交给 AGENT</text>
              </g>
              {/* 右：轨道 + 圆环站点 + 直角钴蓝终点（全图唯一直角 = 蓝色句点） */}
              <path id="apxRail" className="draw" pathLength="1" d="M500,142 H906" fill="none" stroke="#0b0b0e" strokeWidth="2.25" strokeLinecap="round" style={{ "--d": "1s" }} />
              <g fill="#efece6" stroke="#0b0b0e" strokeWidth="2.25">
                {[556, 646, 736, 826].map((cx, k) => <circle key={k} className="pop" cx={cx} cy="142" r="6" style={{ "--d": (1.1 + k * 0.06) + "s" }} />)}
              </g>
              <g className="pop" style={{ "--d": "1.34s" }}><rect x="894" y="130" width="12" height="12" fill="#0047AB" /></g>
              <g fontFamily="Helvetica Neue, sans-serif" fontWeight="700" fontSize="13" fill="#0b0b0e">
                {[["调研",556],["脚本",646],["审核",736],["复测",826],["交付",900]].map(([w,x],k) => <text key={w} className="pop" x={x} y="172" textAnchor="middle" style={{ "--d": (1.12 + k * 0.06) + "s" }}>{w}</text>)}
              </g>
              {!APX_REDUCE && (
                <g>
                  <circle className="pop" r="7" fill="rgba(0,71,171,.22)" style={{ "--d": "1.5s" }}>
                    <animateMotion dur="4.2s" repeatCount="indefinite" calcMode="spline" keyPoints="0;.3;.34;.64;.68;1" keyTimes="0;.26;.36;.6;.7;1" keySplines=".45 0 .2 1;.45 0 .2 1;.45 0 .2 1;.45 0 .2 1;.45 0 .2 1"><mpath href="#apxRail" /></animateMotion>
                  </circle>
                  <circle className="pop" r="4" fill="#0047AB" style={{ "--d": "1.5s" }}>
                    <animateMotion dur="4.2s" repeatCount="indefinite" calcMode="spline" keyPoints="0;.3;.34;.64;.68;1" keyTimes="0;.26;.36;.6;.7;1" keySplines=".45 0 .2 1;.45 0 .2 1;.45 0 .2 1;.45 0 .2 1;.45 0 .2 1"><mpath href="#apxRail" /></animateMotion>
                  </circle>
                </g>
              )}
              {APX_REDUCE && <circle className="pop" cx="864" cy="142" r="4" fill="#0047AB" style={{ "--d": "1.5s" }} />}
            </svg>
          </div>
        </div>

        {/* ── P2 · 平台定义 — 镜像拉页，图版左出血 ── */}
        <div className="apx-spread apx-p2" data-ob="self">
          <div className="apx-ghost" aria-hidden="true">02</div>
          <div className="apx-copy2">
            <div className="apx-kick2">{p2.ix} · {p2.tag}</div>
            <h3>{p2.title.slice(0, -1)}<i className="psq" aria-hidden="true"></i></h3>
            <p>{p2.body}</p>
          </div>
          <div className="apx-chipart apx-art" aria-hidden="true">
            <svg viewBox="0 0 960 480">
              <defs>
                <marker id="apxChev2" viewBox="0 0 12 12" refX="7" refY="6" markerWidth="8" markerHeight="8" orient="auto">
                  <path d="M2,1.5 L8,6 L2,10.5" fill="none" stroke="#0b0b0e" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                </marker>
              </defs>
              {/* 来源 — 圆点虚线下落 */}
              <path className="draw" pathLength="1" d="M355,96 Q392,130 438,158" fill="none" stroke="rgba(11,11,14,.45)" strokeWidth="2.25" strokeLinecap="round" strokeDasharray="0 10" style={{ "--d": ".7s" }} />
              <path className="draw" pathLength="1" d="M615,96 Q578,130 532,158" fill="none" stroke="rgba(11,11,14,.45)" strokeWidth="2.25" strokeLinecap="round" strokeDasharray="0 10" style={{ "--d": ".78s" }} />
              {/* 主轴微垂弧 */}
              <path className="draw" pathLength="1" d="M215,236 Q320,242 400,238" fill="none" stroke="#0b0b0e" strokeWidth="2.25" strokeLinecap="round" markerEnd="url(#apxChev2)" style={{ "--d": ".86s" }} />
              <path className="draw" pathLength="1" d="M562,238 Q650,242 748,236" fill="none" stroke="#0b0b0e" strokeWidth="2.25" strokeLinecap="round" markerEnd="url(#apxChev2)" style={{ "--d": ".94s" }} />
              {/* U 形回路 — 大圆角转角 */}
              <path className="draw" pathLength="1" d="M 812 282 V 388 A 28 28 0 0 1 784 416 H 176 A 28 28 0 0 1 148 388 V 282" fill="none" stroke="#0b0b0e" strokeWidth="2.25" strokeLinecap="round" markerEnd="url(#apxChev2)" style={{ "--d": "1.05s" }} />
              {/* 节点卡 */}
              <g className="pop" style={{ "--d": ".3s" }}>
                <rect x="90" y="192" rx="18" width="122" height="90" fill="#efece6" stroke="rgba(11,11,14,.28)" strokeWidth="1.5" />
                <circle cx="151" cy="222" r="10" fill="rgba(11,11,14,.1)" />
                <text x="151" y="256" textAnchor="middle" fontFamily="Helvetica Neue, sans-serif" fontWeight="800" fontSize="15" fill="#0b0b0e">用户</text>
              </g>
              <g className="pop" style={{ "--d": ".4s" }}>
                <rect x="404" y="176" rx="22" width="154" height="122" fill="#0b0b0e" />
                <text x="481" y="230" textAnchor="middle" fontFamily="Helvetica Neue, sans-serif" fontWeight="800" fontSize="22" fill="#efece6">Agent</text>
                <text x="481" y="256" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="8.4" letterSpacing="1" fill="rgba(239,236,230,.66)">统一记忆·统一规则·统一数据</text>
              </g>
              <g className="pop" style={{ "--d": ".5s" }}>
                <rect x="748" y="192" rx="18" width="122" height="90" fill="#efece6" stroke="rgba(11,11,14,.28)" strokeWidth="1.5" />
                <rect x="797" y="212" rx="5" width="20" height="20" fill="rgba(11,11,14,.1)" />
                <text x="809" y="256" textAnchor="middle" fontFamily="Helvetica Neue, sans-serif" fontWeight="800" fontSize="15" fill="#0b0b0e">飞书</text>
              </g>
              <g className="pop" style={{ "--d": ".58s" }}>
                <rect x="272" y="66" rx="10" width="96" height="30" fill="rgba(11,11,14,.05)" />
                <text x="320" y="85" textAnchor="middle" fontFamily="Helvetica Neue, sans-serif" fontWeight="700" fontSize="12.5" fill="#0b0b0e">外部数据</text>
                <rect x="606" y="66" rx="10" width="110" height="30" fill="rgba(11,11,14,.05)" />
                <text x="661" y="85" textAnchor="middle" fontFamily="Helvetica Neue, sans-serif" fontWeight="700" fontSize="12.5" fill="#0b0b0e">RAG 知识库</text>
              </g>
              {/* 线上 pill 标签 */}
              <g className="pop" fontFamily="JetBrains Mono, monospace" fontSize="9.6" letterSpacing="1.6" fill="rgba(11,11,14,.55)" style={{ "--d": "1.1s" }}>
                <rect x="264" y="212" rx="10" width="86" height="22" fill="#efece6" /><text x="307" y="227" textAnchor="middle">发起需求</text>
                <rect x="612" y="212" rx="10" width="86" height="22" fill="#efece6" /><text x="655" y="227" textAnchor="middle">生成内容</text>
                <rect x="386" y="404" rx="10" width="188" height="24" fill="#efece6" /><text x="480" y="420" textAnchor="middle">发送给用户 · 完成闭环</text>
              </g>
              {/* 旅程路径（不可见）— 旅行的消息卡与余脉蓝点共用 */}
              <path id="apxLoopPath" d="M 215 236 H 745 A 24 24 0 0 1 769 260 V 388 A 26 26 0 0 1 743 414 H 177 A 26 26 0 0 1 151 388 V 260 A 24 24 0 0 1 175 236 H 215" fill="none" stroke="none" />
              {/* C 式旅程：一张「旅行的消息卡」到场自动走一遍（停 Agent、停飞书、
                  沿底边回到用户，fill=freeze 定格 = 结果回到人手里），点选图版重播 */}
              {!APX_REDUCE && (
                <g className="apx-parcel">
                  <rect x="-28" y="-17" rx="8" width="56" height="34" fill="#efece6" stroke="#0b0b0e" strokeWidth="1.4" />
                  <line x1="-16" y1="-6" x2="14" y2="-6" stroke="rgba(11,11,14,.5)" strokeWidth="3" strokeLinecap="round" />
                  <line x1="-16" y1="1" x2="8" y2="1" stroke="rgba(11,11,14,.5)" strokeWidth="3" strokeLinecap="round" />
                  <line x1="-16" y1="8" x2="11" y2="8" stroke="rgba(11,11,14,.5)" strokeWidth="3" strokeLinecap="round" />
                  <rect x="18" y="-15" width="7" height="7" fill="#0047AB" />
                  <animateMotion id="apxRide" dur="7s" begin="indefinite" fill="freeze" calcMode="linear"
                    keyPoints="0;0.176;0.176;0.35;0.35;0.66;0.66;1" keyTimes="0;0.2;0.28;0.45;0.53;0.75;0.8;1">
                    <mpath href="#apxLoopPath" />
                  </animateMotion>
                </g>
              )}
              {APX_REDUCE && (
                <g transform="translate(215,236)">
                  <rect x="-28" y="-17" rx="8" width="56" height="34" fill="#efece6" stroke="#0b0b0e" strokeWidth="1.4" />
                  <line x1="-16" y1="-6" x2="14" y2="-6" stroke="rgba(11,11,14,.5)" strokeWidth="3" strokeLinecap="round" />
                  <line x1="-16" y1="1" x2="8" y2="1" stroke="rgba(11,11,14,.5)" strokeWidth="3" strokeLinecap="round" />
                  <line x1="-16" y1="8" x2="11" y2="8" stroke="rgba(11,11,14,.5)" strokeWidth="3" strokeLinecap="round" />
                  <rect x="18" y="-15" width="7" height="7" fill="#0047AB" />
                </g>
              )}
              {!APX_REDUCE && (
                <circle className="pop" r="4.5" fill="#0047AB" style={{ "--d": "1.4s" }}>
                  <animateMotion dur="9s" repeatCount="indefinite"><mpath href="#apxLoopPath" /></animateMotion>
                </circle>
              )}
            </svg>
            <div className="apx-replay mono" aria-hidden="true">点选重看 · REPLAY</div>
          </div>
        </div>

        {/* ── P3 · 平台影片 — 压轴：影片 + 刊末条 + CTA ── */}
        <div className="apx-spread apx-p3" data-ob="self">
          <div className="apx-ghost" aria-hidden="true">03</div>
          <div className="apx-copy2">
            <div className="apx-kick2">{p3.ix} · {p3.tag}</div>
            <h3>{p3.title.slice(0, -1)}<i className="psq" aria-hidden="true"></i></h3>
            <p>{p3.body}</p>
          </div>
          <div className="apx-video" aria-label="Co-work Agent Platform video">
            {/* DESKTOP: src stays blank until the film block scrolls into view, then
                useApxFilm points it at xtool/?fresh=1 ONCE and leaves it. PHONE/TABLET:
                the poster button loads it on a tap.（结构与类名为 useApxFilm 的
                querySelector 依赖，勿动） */}
            <iframe ref={frameRef} src="about:blank" title="Co-work Agent Platform film" allow="autoplay; fullscreen"></iframe>
            <div className="apx-video-loading mono" aria-hidden="true">
              <span className="apx-load-bars"><i></i><i></i><i></i><i></i><i></i></span>
              <span className="apx-load-cap">影片加载中 · LOADING FILM</span>
            </div>
            {!filmOn && (
              <button className="apx-video-play" type="button" data-hov aria-label="播放 Co-work 平台影片"
                      onClick={() => {
                        setFilmOn(true);
                        const f = frameRef.current; if (!f) return;
                        const lo = f.parentElement && f.parentElement.querySelector(".apx-video-loading");
                        if (lo) lo.style.display = "flex";
                        f.src = "xtool/?fresh=1";
                      }}>
                <img src="xtool/screenshots/demo_review.png" alt="Co-work Agent Platform" loading="lazy" draggable="false" />
                <span className="apx-play-ico" aria-hidden="true"></span>
                <span className="apx-play-cap mono">点击播放 · CO-WORK 平台影片 ▶</span>
              </button>
            )}
          </div>
          <div className="apx-strip2" aria-hidden="true">
            {APX_STATS.map((s, i) => (
              <div className="apx-stat" key={s.label} style={{ transitionDelay: (0.3 + i * 0.08) + "s" }}>
                <b>{s.n}{s.unit}</b><span>{s.label}</span>
              </div>
            ))}
          </div>
          <div className="apx-ctarow">
            <a className="apx-cta ch-cta" href={aipmUrl} target="_blank" rel="noopener" data-hov>
              <span className="sq" aria-hidden="true"></span>访问平台 · CO-WORK PLATFORM<span className="arr" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   02 · A DEVELOPER — AXONOMETRIC STRUCTURE · 体 (tone: paper)
   ════════════════════════════════════════════════════════════ */
const C3_BARS = [0.97, 0.58, 1.0, 0.66, 0.9, 0.52, 0.74, 1.0];
const c3X = (i) => -3.4 + i * 0.97;

function Structure3D() {
  const simR = useChR(null);
  if (!simR.current) simR.current = {
    rot: -0.82, trot: -0.82, drag: false, x0: 0, last: 0,
  };

  const ref = useCanvas((ctx, W, H, now) => {
    const S = simR.current;
    let p = (window.__progress && window.__progress.developer) || 0;
    /* PRELUDE — the glide-in used to be a blank stage (grid only arrived
       after the pin). Negative p now draws the ground grid + the nine
       foundation stubs fading in: 地基先落，塔楼后起. */
    if (p <= -0.45) {
      ctx.clearRect(0, 0, W, H);
      S.last = now; return;
    }
    if (p > 1) p = 1;   /* scrolled past — hold the assembled skyline */
    const ent = aEase(aClamp((p + 0.45) / 0.35, 0, 1));   /* prelude envelope, 1 by the pin */
    const dt = Math.min(Math.max((now - S.last) / 1000, 0), 0.05); S.last = now;
    ctx.clearRect(0, 0, W, H);

    ctx.globalAlpha = ent;
    if (!S.drag) S.trot += dt * 0.06;
    S.rot += (S.trot - S.rot) * Math.min(1, dt * 5);
    const rot = S.rot + Math.sin(now / 4600) * 0.025;
    const cosR = Math.cos(rot), sinR = Math.sin(rot);
    const SC = Math.min(W * 0.082, H * 0.108);
    /* composition sits right-and-up of centre so the motto (bottom-left) and
       the title keep clear ground — the skyline is a backdrop, not an obstacle */
    const cx = W * 0.58, cy = H * 0.62, tilt = 0.46, ZF = SC * 0.82;
    const proj = (x, y, z) => {
      const rx = x * cosR - y * sinR, ry = x * sinR + y * cosR;
      return [cx + rx * SC, cy + ry * SC * tilt - z * ZF];
    };
    const ink = (a) => `rgba(11,11,14,${a.toFixed(3)})`;
    const blu = (a) => `rgba(0,71,171,${a.toFixed(3)})`;

    /* ground grid — the discipline plane; starts DURING the glide-in */
    const gv = aSeg(p, -0.42, 0.08);
    if (gv > 0.01) {
      ctx.strokeStyle = ink(0.13 * gv); ctx.lineWidth = 1;
      for (let gx = -6; gx <= 6.01; gx += 1.5) {
        const [x1, y1] = proj(gx, -4, 0), [x2, y2] = proj(gx, 4, 0);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
      for (let gy = -4; gy <= 4.01; gy += 1.5) {
        const [x1, y1] = proj(-6, gy, 0), [x2, y2] = proj(6, gy, 0);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
    }

    /* bar heights this frame — the skyline assembles as you scroll */
    const bh = C3_BARS.map((b, i) => 3.3 * b * aEase(aSeg(p, 0.12 + i * 0.05, 0.46 + i * 0.05)));

    /* assemble the draw list — painter sort along view depth */
    const items = [];
    items.push({ x: -5.15, y: 0, hx: 0.6, hy: 0.6, zb: 0, h: Math.max(0.55 * aEase(aSeg(p, 0.07, 0.24)), 0.02), col: "ink", top: 0.32 });
    C3_BARS.forEach((b, i) => items.push({
      x: c3X(i), y: 0, hx: 0.345, hy: 0.345, zb: 0,
      h: Math.max(bh[i], 0.02), col: "ink", top: 0.4,
    }));
    const dq = aEase(aSeg(p, 0.78, 0.93));
    if (dq > 0.01) items.push({ x: 4.55, y: 0, hx: 0.22, hy: 0.22, zb: (1 - dq) * 2.9, h: 0.44, col: "blue", top: 0.82 });
    items.sort((u, v) => (u.x * sinR) - (v.x * sinR));

    const CS = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    const NA = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];
    const LIGHT = -2.3;
    items.forEach((b) => {
      const zt = b.zb + b.h;
      const corner = (k, z) => proj(b.x + CS[k][0] * b.hx, b.y + CS[k][1] * b.hy, z);
      const base = b.col === "blue" ? blu : ink;
      const faces = [0, 1, 2, 3].map((k) => {
        const k2 = (k + 1) % 4;
        const mx = b.x + ((CS[k][0] + CS[k2][0]) / 2) * b.hx;
        const my = b.y + ((CS[k][1] + CS[k2][1]) / 2) * b.hy;
        return { k, depth: mx * sinR + my * cosR };
      }).sort((u, v) => u.depth - v.depth);
      ctx.lineWidth = 1;
      faces.forEach(({ k }) => {
        const k2 = (k + 1) % 4;
        const lum = Math.max(0, Math.cos(NA[k] + rot - LIGHT));
        const [x1, y1] = corner(k, b.zb), [x2, y2] = corner(k2, b.zb);
        const [x3, y3] = corner(k2, zt), [x4, y4] = corner(k, zt);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.lineTo(x4, y4); ctx.closePath();
        ctx.fillStyle = base(0.52 + lum * 0.43);
        ctx.fill();
        ctx.strokeStyle = "#efece6"; ctx.stroke();
      });
      ctx.beginPath();
      for (let k = 0; k < 4; k++) { const [px, py] = corner(k, zt); k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
      ctx.closePath();
      ctx.fillStyle = base(b.top);
      ctx.fill(); ctx.strokeStyle = "#efece6"; ctx.stroke();
    });
  });

  /* drag to orbit */
  useChE(() => {
    const cv = ref.current; if (!cv) return;
    const S = simR.current;
    const down = (e) => { S.drag = true; S.x0 = e.clientX; };
    const move = (e) => { if (!S.drag) return; S.trot += (e.clientX - S.x0) * 0.0055; S.x0 = e.clientX; };
    const up = () => { S.drag = false; };
    cv.addEventListener("pointerdown", down);
    addEventListener("pointermove", move, { passive: true });
    addEventListener("pointerup", up);
    return () => {
      cv.removeEventListener("pointerdown", down);
      removeEventListener("pointermove", move);
      removeEventListener("pointerup", up);
    };
  }, []);

  return <canvas ref={ref}></canvas>;
}

function ChDev({ jump }) {
  const { BarWord, CodePanel } = window;
  const ref = useChR(null);
  useChProg("developer", ref);
  /* NOTE: the "VISIT PEARS" CTA deliberately lives only on the Reel showcase
     chapter (ChReel · 介绍页), NOT here on the identity/animation page — it was
     a duplicate otherwise (用户: 动画页不要按钮，介绍页出现). */
  return (
    <section className="chapter ch3" id="developer" data-tone="paper" data-prog="developer" data-screen-label="02 · A Developer — 3D">
      <div className="ch-wrap">
        <div className="ch-stage sec c3" data-ob ref={ref}>
          <div className="ch-ghost" data-parallax="0.2" aria-hidden="true">STACK</div>
          <div className="c3-art" aria-hidden="true"><Structure3D /></div>
          <div className="ch-head c3-head">
            <h2 className="ch-title c3-title"><BarWord text="A Developer" delay={0.15} /></h2>
            <div className="rule ch-rule" style={{ "--rd": ".22s" }}></div>
          </div>
          <CodePanel />
          <div className="ch-motto">
            <div className="mt lm" style={{ "--rd": ".3s" }}><span>保持从想法到落地的能力<i className="psq" aria-hidden="true"></i></span></div>
            <div className="st" data-rv style={{ "--rd": ".45s" }}>
              我自己写代码，也指挥 agent 写代码。想验证一个想法，最快的路常常是先做出来。
              <span className="en">From idea to shipped — I write code myself, and I also direct agents that write it. The fastest way to test an idea is usually just to build it.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   04 · AN ARCHITECT — SITE FORM · 场 (tone: ink)
   The canvas (SiteForm3D) lives in identity-art.jsx — the same
   axonometric skeleton as the Developer's skyline, inverted in
   tone: a luminous paper massing assembles from a site grid as
   four force-vectors push inward and quiet down. One language,
   no circle, no contour ring — the rectangle + the blue self.
   ════════════════════════════════════════════════════════════ */

function ChArch({ jump }) {
  const { BarWord, SiteForm3D } = window;
  const ref = useChR(null);
  useChProg("architect", ref);
  return (
    <section className="chapter ch4" id="architect" data-tone="paper" data-prog="architect" data-screen-label="04 · An Architect — FIELD">
      <div className="ch-wrap">
        <div className="ch-stage sec c4" data-ob ref={ref}>
          <div className="c4-art" aria-hidden="true"><SiteForm3D /></div>
          <div className="ch-ghost c4-ghost" data-parallax="0.16" aria-hidden="true">FORM</div>
          <div className="ch-head c4-head">
            <h2 className="c4-title">
              <span className="c4-an"><BarWord text="An" period={false} /></span>
              <span className="c4-big"><BarWord text="Architect" delay={0.3} /></span>
            </h2>
            <div className="rule ch-rule c4-rule" style={{ "--rd": ".22s" }}></div>{/* 线先于正文（与 Dev 章同序） */}
          </div>
          <div className="ch-motto">
            <div className="mt lm" style={{ "--rd": ".3s" }}><span>把零散的需求搭成稳定的体系<i className="psq" aria-hidden="true"></i></span></div>
            <div className="st" data-rv style={{ "--rd": ".45s" }}>
              建筑，就是把一堆互相影响的限制——光线、动线、尺度——变成一个让人想待下去的东西。
              <span className="en">Scattered needs into a system — architecture takes constraints that push against each other (light, circulation, scale) and turns them into something people want to stay in.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   02·B · THE EVIDENCE — PEARS · 两段式 (tone: paper)
   The payoff of the Developer thesis, in NORMAL FLOW — no pinning,
   no scrub (用户: deck 自动轮播 + 可手动，滚动照常走；页面上不写这类机制说明):
   · Part 1 — the proposal deck: 8 paper-tinted SVG slides in one
     16:9 frame that AUTO-TURNS every few seconds; click / ‹ › /
     square pips take over (a manual action holds the auto-turn).
   · Part 2 — the roadshow film under its own headline (「现在看它
     如何工作」— the same beat as the XTOOL keynote), auto-plays
     muted on arrival; the small BGM chip unmutes.
   The slides' own background is re-tinted to the site paper
   (#efece6), so the chapter stays on the page tone — no snow tone,
   no recolor choreography.
   ════════════════════════════════════════════════════════════ */
const REEL = [
  /* the cover (01.jpg) is intentionally gone — it opened the reel on an empty
     frame that slowly faded into a redundant Pears title card (too slow a beat),
     and the Pears identity already returns on the closing roadshow frame. Start
     straight on the substance. `ix` doubles as the image filename, so the kept
     slides keep their 02–09 names; the displayed index is renumbered 01–08 in
     the render. */
  { ix: "02", zh: "看你做一遍", g: "把重复工作交给 Pears", ext: "svg" },  /* vector recreation — crisp text (orig 02.jpg kept as backup) */
  { ix: "03", zh: "产品洞察",   g: "软件越来越容易生成，难的是把工作说清楚", ext: "svg" },  /* vector recreation (orig 03.jpg kept as backup) */
  { ix: "04", zh: "产品差异",   g: "Vibe Coding 从你说的开始，Pears 从你做的开始", ext: "svg" },  /* zh matches the slide's own section tag (用户: Dev 内容不协调) */
  { ix: "05", zh: "示范与学习", g: "每一次点击与切换，都在告诉它什么值得自动化", ext: "svg" },  /* zh matches the slide's own section tag */
  { ix: "06", zh: "工作流拍板", g: "自动化到哪一步，由你拍板", ext: "svg" },  /* vector recreation — crisp UI dashboard (orig 06.jpg kept as backup) */
  { ix: "07", zh: "隐私设计",   g: "只在你开口时才记，停止任务记录立即结束", ext: "svg" },  /* vector recreation — crisp at any size (orig 07.jpg kept as backup) */
  { ix: "08", zh: "Agent 构建", g: "拍板之后，工作流开始成为 Agent", ext: "svg" },  /* vector recreation (orig 08.jpg kept as backup) */
  { ix: "09", zh: "产品生态",   g: "你的做法，不只为你工作 · Agent App 生态", ext: "svg" },  /* vector recreation (orig 09.jpg kept as backup) */
];

/* the Pears roadshow video — Part 2 of the chapter now (no longer a deck
   cell). preload="none" so the 69MB file only downloads when the film part
   scrolls into view; the poster shows meanwhile. */
const REEL_VIDEO = { src: "works/pears-roadshow.mp4", poster: "works/pears-roadshow-cover.jpg", zh: "路演", g: "Pears 产品路演 · Demo Day" };
const REEL_N = REEL.length;   /* 8 提案帧 — 影片是第二段，不再占 cell */

function ChReel({ jump }) {
  const deckRef = useChR(null);
  const vidRef = useChR(null);
  const [idx, setIdx] = React.useState(0);
  const [muted, setMuted] = React.useState(true);   /* roadshow film auto-plays muted; the BGM button unmutes */
  const vidStarted = useChR(false);
  const holdUntil = useChR(0);   /* a manual action holds the auto-turn for a while */
  const touchX = useChR(0);
  const go = (d) => { holdUntil.current = Date.now() + 9000; setIdx((v) => (v + d + REEL_N) % REEL_N); };
  const jumpTo = (n) => { holdUntil.current = Date.now() + 9000; setIdx(n); };

  /* auto-turn — 用户: 自动左右翻页，用户也可手动。Loops the 8 slides; skips
     while the tab is hidden, the deck is off-screen, or a manual hold runs. */
  useChE(() => {
    const t = setInterval(() => {
      if (document.hidden || Date.now() < holdUntil.current) return;
      const el = deckRef.current; if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < 120 || r.top > innerHeight - 120) return;
      setIdx((v) => (v + 1) % REEL_N);
    }, 4200);
    return () => clearInterval(t);
  }, []);

  /* the film — auto-play muted from 0:00 the FIRST time it scrolls into view
     (never on page load — 用户: 滚动到达才播). Same behaviour at every
     viewport; never auto-paused after, so a manual pause via the native
     controls sticks and the BGM rides along if unmuted. */
  useChE(() => {
    const v = vidRef.current; if (!v || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => {
        if (en.isIntersecting && en.intersectionRatio > 0.5 && !vidStarted.current) {
          vidStarted.current = true;
          const lo = v.parentElement && v.parentElement.querySelector(".reel-video-loading");
          if (lo) { lo.style.display = "flex"; setTimeout(() => { lo.style.display = "none"; }, 8000); }
          v.muted = true;
          try { v.currentTime = 0; } catch (e) {}
          const pr = v.play(); if (pr && pr.catch) pr.catch(() => {});
        }
      });
    }, { threshold: [0, 0.5, 1] });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  /* closing CTA — the reel is the Developer's evidence (Pears); link straight to
     the live product. Looked up by name, NOT by index — the deck's order is
     curatorial (建筑在前) and must be free to change without re-aiming this link. */
  const devWk = (window.WORKS || []).find((w) => w.t && w.t.indexOf("Pears") === 0);
  const devUrl = (devWk && devWk.link) || "https://and-pear.netlify.app/login";
  const s = REEL[idx];
  /* 杂志对页模板（与 AIPM 章同一套 .apx-spread 体系）· 两页：
     P1 对页 = 轮播 deck（auto-turn/手动/pips/触摸全保留），
     P2 压轴 = 路演视频（到场静音自动播/BGM chip/CTA 全保留）。 */
  return (
    <section className="chapter reel" id="reel" data-tone="paper"
             data-screen-label="02·B · The Evidence — PEARS">
      <div className="reel-stage">
        <div className="apx-kicker mono" data-rv data-ob="self">
          <span>02·B · THE EVIDENCE</span><span>PEARS · 路演现场</span>
        </div>

        {/* ── P1 · 路演提案 — 左文右 deck，图版右出血 ── */}
        <div className="apx-spread apx-p1" data-ob="self">
          <div className="apx-ghost" aria-hidden="true">01</div>
          <div className="apx-copy2">
            <div className="apx-kick2">01 · 路演提案</div>
            <h3>Pears — AI Agent<i className="psq" aria-hidden="true"></i></h3>
            <p className="reel-award2 mono">ADVENTURE-X 高校联盟黑客松 · 季军</p>
            <p>八页提案讲清一件事：软件越来越容易生成，难的是把工作说清楚。Pears 不从你说的开始，从你做的开始。</p>
          </div>
          <div className="apx-chipart apx-chipart-live">
            <div className="reel-deck" ref={deckRef}
                 onClick={(e) => { if (e.target.closest("a, button")) return; go(1); }}
                 onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
                 onTouchEnd={(e) => {
                   const dx = e.changedTouches[0].clientX - touchX.current;
                   if (Math.abs(dx) > 42) go(dx < 0 ? 1 : -1);
                 }}>
              <div className="reel-frame">
                {REEL.map((slide, n) => (
                  <img key={n} className={"reel-cell reel-img" + (n === idx ? " on" : "")}
                       src={"works/pears-deck/" + slide.ix + "." + (slide.ext || "jpg")}
                       alt={"Pears " + slide.ix + " " + slide.zh} decoding="async"
                       loading="eager" draggable="false" />
                ))}
                <button className="reel-nav prev" type="button" data-hov aria-label="上一页"
                        onClick={() => go(-1)}><span>‹</span></button>
                <button className="reel-nav next" type="button" data-hov aria-label="下一页"
                        onClick={() => go(1)}><span>›</span></button>
              </div>
              {/* deck bar — mono index + per-slide caption + square pips (period motif) */}
              <div className="reel-deckbar mono">
                <span className="reel-ix2" aria-live="polite"><b>{String(idx + 1).padStart(2, "0")}</b> / {String(REEL_N).padStart(2, "0")} · {s.zh} — {s.g}</span>
                <span className="reel-pips" aria-hidden="true">
                  {REEL.map((_, n) => (
                    <i key={n} className={n === idx ? "on" : ""}
                       onClick={(e) => { e.stopPropagation(); jumpTo(n); }}></i>
                  ))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── P2 · 路演视频 — 压轴（字幕只报内容，不解说播放机制） ── */}
        <div className="apx-spread apx-p3 reel-p2" data-ob="self">
          <div className="apx-ghost" aria-hidden="true">02</div>
          <div className="apx-copy2">
            <div className="apx-kick2">02 · 路演视频</div>
            <h3>现在看它如何工作<i className="psq" aria-hidden="true"></i></h3>
            <p>路演现场的完整实机——从看你做一遍，到替你做下去。</p>
          </div>
          <div className="reel-video">
            <video ref={vidRef} src={REEL_VIDEO.src} poster={REEL_VIDEO.poster}
                   preload="none" playsInline muted controls
                   onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
                   onPlaying={(e) => {
                     const lo = e.currentTarget.parentElement.querySelector(".reel-video-loading");
                     if (lo) lo.style.display = "none";
                   }}
                   onError={(e) => {
                     const lo = e.currentTarget.parentElement.querySelector(".reel-video-loading");
                     if (lo) lo.style.display = "none";
                   }}></video>
            {/* loading poster — same bars-and-caption language as the AIPM platform film */}
            <div className="reel-video-loading mono" aria-hidden="true">
              <span className="reel-load-bars"><i></i><i></i><i></i><i></i><i></i></span>
              <span className="reel-load-cap">影片加载中 · LOADING FILM</span>
            </div>
            {/* default muted; a SMALL top-right chip turns the sound on. Once
                unmuted it hides — the native controls take over. */}
            {muted && <button className="reel-sound mono" type="button" aria-label="开启声音 · BGM"
              onClick={() => { const v = vidRef.current; if (!v) return; v.muted = false; if (v.paused) v.play(); }}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 9.4v5.2h3.3L12 18.4V5.6L7.3 9.4H4z" fill="currentColor" stroke="none"/>
                <path d="M15.4 9.2a4 4 0 0 1 0 5.6"/>
                <path d="M17.9 6.7a7.5 7.5 0 0 1 0 10.6"/>
              </svg>
              <span>声音</span>
            </button>}
          </div>
          <div className="apx-ctarow">
            <a className="reel-cta ch-cta apx-cta" href={devUrl} target="_blank" rel="noopener" data-hov>
              <span className="sq" aria-hidden="true"></span>访问应用 · PEARS<span className="arr" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { ChAipmPlatform, ChDev, ChArch, ChReel, Structure3D });
