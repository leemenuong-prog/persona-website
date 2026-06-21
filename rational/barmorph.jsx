/* ══════════════════════════════════════════════════════════════
   barmorph.jsx — the 字⇄条 design language (see barmorph.css).

   <BarWord text="WHOAMI" />
     A word born from bars. Each glyph decodes from as many bars
     as it has vertical strokes (I→1, A→3, M→4 — the loader's
     grammar). Needs an ancestor with .in (data-ob reveal system).
     Births ONCE. After it settles, hover toggles it back to the
     encoded skyline — a smooth, reversible 字⇄条 glimpse of the
     bars the word is made of — never a replay of the birth jump.
     props: period=true · delay=0 (word offset, s)
            rhythm=[heights] · className

   <BarBand h={[0.6, 1, 0.7, 0.5]} />
     The mini skyline + blue period, for labels and meta cells.

   <BarChrono items={[{ y, h, t, zh, tag }]} />
     The time skyline — bars become a chronology. Height = the
     period's magnitude; the square (the self) rides the active
     bar. On reveal it scrubs once through history and settles
     at now; hover any bar to scrub back.
   ══════════════════════════════════════════════════════════════ */

const BM_RHYTHM = [0.97, 0.58, 1.0, 0.66, 0.9, 0.52, 0.74, 1.0];

/* vertical-stroke count per glyph — how many bars a letter freezes into */
const BM_STROKES = { i: 1, j: 1, l: 1, t: 1, f: 1, r: 1, a: 3, e: 3, s: 2, m: 4, w: 4 };
const bmCount = (ch) => BM_STROKES[ch.toLowerCase()] != null ? BM_STROKES[ch.toLowerCase()] : 2;
/* bar zone — caps/ascenders get cap height, low x-height glyphs less */
const bmZone = (ch) => (/[a-z]/.test(ch) && !/[bdfhklt]/.test(ch)) ? ".52em" : ".72em";

function BarWord({ text, period = true, delay = 0, rhythm = BM_RHYTHM, accent = [], className = "" }) {
  const ref = React.useRef(null);
  const [set, setSet] = React.useState(false);
  const glyphs = [...text];
  /* full birth length, measured from the first bar's animationstart */
  const runMs = (glyphs.length * 0.09 + 2.5) * 1000;

  /* the birth plays once (when the ancestor gains .in). The moment the
     last bar/letter/period has animated in, mark it settled — that swaps
     the one-shot keyframes for hover-driven transitions, so hovering
     toggles 字⇄条 instead of re-triggering the birth. */
  React.useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setSet(true); return; }
    const host = ref.current;
    if (!host) return;
    let t = null;
    const onStart = () => { if (t) return; t = setTimeout(() => setSet(true), runMs); };
    host.addEventListener("animationstart", onStart);
    return () => { host.removeEventListener("animationstart", onStart); if (t) clearTimeout(t); };
  }, []);

  let bi = 0;
  return (
    <span ref={ref} className={("bmw " + (set ? "set " : "") + className).trim()} aria-label={text}>
      <span className="bmw-in" aria-hidden="true">
        {glyphs.map((ch, gi) => {
          if (ch === " ") return <span key={gi} className="bsp"></span>;
          const n = bmCount(ch);
          const bars = [];
          for (let b = 0; b < n; b++, bi++) {
            bars.push(<i key={b} style={{ "--h": rhythm[bi % rhythm.length], "--bd": (b * 0.05).toFixed(2) + "s" }}></i>);
          }
          return (
            <span key={gi} className={"bg" + (accent.indexOf(gi) >= 0 ? " acc" : "")} style={{ "--gd": (delay + gi * 0.09).toFixed(2) + "s", "--bz": bmZone(ch) }}>
              <span className="glc"><span className="gl">{ch}</span></span>
              <span className="bars">{bars}</span>
            </span>
          );
        })}
        {period && <span className="bmp" style={{ "--gd": (delay + (glyphs.length - 1) * 0.09).toFixed(2) + "s" }}></span>}
      </span>
    </span>
  );
}

function BarBand({ h = [0.9, 0.55, 1, 0.65], className = "" }) {
  return (
    <span className={("bband " + className).trim()} aria-hidden="true">
      {h.map((v, i) => <i key={i} style={{ "--h": v, "--bi": (i * 0.06).toFixed(2) + "s" }}></i>)}
      <span className="sq"></span>
    </span>
  );
}

function BarChrono({ items, intro = true, className = "" }) {
  const [act, setAct] = React.useState(intro ? 0 : items.length - 1);
  const user = React.useRef(false);
  const ref = React.useRef(null);

  /* intro scrub — once the section reveals, the self walks
     through history and settles at now */
  React.useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!intro || reduce) { setAct(items.length - 1); return; }
    const sec = ref.current && ref.current.closest("[data-ob]");
    let timers = [], mo = null;
    const start = () => items.forEach((_, i) =>
      timers.push(setTimeout(() => { if (!user.current) setAct(i); }, 1150 + i * 380)));
    if (!sec || sec.classList.contains("in")) start();
    else {
      mo = new MutationObserver(() => {
        if (sec.classList.contains("in")) { start(); if (mo) { mo.disconnect(); mo = null; } }
      });
      mo.observe(sec, { attributes: true, attributeFilter: ["class"] });
    }
    return () => { timers.forEach(clearTimeout); if (mo) mo.disconnect(); };
  }, []);

  const pick = (i) => { user.current = true; setAct(i); };
  const it = items[act];
  const n = items.length;
  return (
    <div className={("bchrono " + className).trim()} ref={ref}>
      <div className="bc-read" key={act} aria-live="polite">
        <span className="bc-y mono">{it.y}</span>
        <span className="bc-body">
          <span className="bc-t">{it.t}</span>
          {it.zh && <span className="zh">{it.zh}</span>}
        </span>
        {it.tag && <span className="bc-tag mono">{it.tag}</span>}
      </div>
      <div className="bc-chart">
        <span className="bc-self" aria-hidden="true"
              style={{ left: (((act + 0.5) / n) * 100).toFixed(2) + "%", bottom: "calc(" + (it.h * 100).toFixed(1) + "% + 9px)" }}></span>
        {items.map((d, i) => (
          <span key={i} className={"bc-col" + (i === act ? " on" : "")} data-hov
                onPointerEnter={() => pick(i)} onClick={() => pick(i)}>
            <i style={{ "--h": d.h, "--bi": (i * 0.07).toFixed(2) + "s" }}></i>
            <b className="mono">{d.y}</b>
          </span>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { BarWord, BarBand, BarChrono });
