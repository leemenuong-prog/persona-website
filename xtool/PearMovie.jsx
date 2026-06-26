// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// animations.jsx
// Reusable animation starter: Stage, Timeline, Sprite, easing helpers.
// Exports (to window): Stage, Sprite, PlaybackBar, TextSprite, ImageSprite, RectSprite,
//   useTime, useTimeline, useSprite, Easing, interpolate, animate, clamp.
//
// Usage (in an HTML file that loads React + Babel):
//
//   <Stage width={1280} height={720} duration={10} background="#f6f4ef">
//     <MyScene />
//   </Stage>
//
// <Stage> auto-scales to the viewport and provides the scrubber, play/pause,
// ←/→ seek, space, and 0-to-reset controls, and persists the playhead.
// Inside <Stage>, any child can call useTime() to read the current
// playhead (seconds). Or wrap content in <Sprite start={1} end={4}>...</Sprite>
// to only render during that window -- children receive a `localTime` and
// `progress` via the useSprite() hook. Use Easing + interpolate()/animate()
// for tweens; TextSprite / ImageSprite / RectSprite have built-in entry/exit.
// Build YOUR scenes by composing Sprites inside a Stage.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

// ── Easing functions (hand-rolled, Popmotion-style) ─────────────────────────
// All easings take t ∈ [0,1] and return eased t ∈ [0,1] (may overshoot for back/elastic).
const Easing = {
  linear: (t) => t,

  // Quad
  easeInQuad:    (t) => t * t,
  easeOutQuad:   (t) => t * (2 - t),
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),

  // Cubic
  easeInCubic:    (t) => t * t * t,
  easeOutCubic:   (t) => (--t) * t * t + 1,
  easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),

  // Quart
  easeInQuart:    (t) => t * t * t * t,
  easeOutQuart:   (t) => 1 - (--t) * t * t * t,
  easeInOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t),

  // Expo
  easeInExpo:  (t) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
  easeOutExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: (t) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) return 0.5 * Math.pow(2, 20 * t - 10);
    return 1 - 0.5 * Math.pow(2, -20 * t + 10);
  },

  // Sine
  easeInSine:    (t) => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine:   (t) => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,

  // Back (overshoot)
  easeOutBack: (t) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeInBack: (t) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },
  easeInOutBack: (t) => {
    const c1 = 1.70158, c2 = c1 * 1.525;
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  },

  // Elastic
  easeOutElastic: (t) => {
    const c4 = (2 * Math.PI) / 3;
    if (t === 0) return 0;
    if (t === 1) return 1;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
};

// ── Core interpolation helpers ──────────────────────────────────────────────

// Clamp a value to [min, max]
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// interpolate([0, 0.5, 1], [0, 100, 50], ease?) -> fn(t)
// Popmotion-style: linearly maps t across input keyframes to output values,
// with optional easing per segment (single fn or array of fns).
function interpolate(input, output, ease = Easing.linear) {
  return (t) => {
    if (t <= input[0]) return output[0];
    if (t >= input[input.length - 1]) return output[output.length - 1];
    for (let i = 0; i < input.length - 1; i++) {
      if (t >= input[i] && t <= input[i + 1]) {
        const span = input[i + 1] - input[i];
        const local = span === 0 ? 0 : (t - input[i]) / span;
        const easeFn = Array.isArray(ease) ? (ease[i] || Easing.linear) : ease;
        const eased = easeFn(local);
        return output[i] + (output[i + 1] - output[i]) * eased;
      }
    }
    return output[output.length - 1];
  };
}

// animate({from, to, start, end, ease})(t) — simpler single-segment tween.
// Returns `from` before `start`, `to` after `end`.
function animate({ from = 0, to = 1, start = 0, end = 1, ease = Easing.easeInOutCubic }) {
  return (t) => {
    if (t <= start) return from;
    if (t >= end) return to;
    const local = (t - start) / (end - start);
    return from + (to - from) * ease(local);
  };
}

// ── Timeline context ────────────────────────────────────────────────────────

const TimelineContext = React.createContext({ time: 0, duration: 10, playing: false });

const useTime = () => React.useContext(TimelineContext).time;
const useTimeline = () => React.useContext(TimelineContext);

// ── Sprite ──────────────────────────────────────────────────────────────────
// Renders children only when the playhead is inside [start, end]. Provides
// a sub-context with `localTime` (seconds since start) and `progress` (0..1).
//
//   <Sprite start={2} end={5}>
//     {({ localTime, progress }) => <Thing x={progress * 100} />}
//   </Sprite>
//
// Or as a plain wrapper — children can call useSprite() themselves.

const SpriteContext = React.createContext({ localTime: 0, progress: 0, duration: 0 });
const useSprite = () => React.useContext(SpriteContext);

function Sprite({ start = 0, end = Infinity, children, keepMounted = false }) {
  const { time } = useTimeline();
  const visible = time >= start && time <= end;
  if (!visible && !keepMounted) return null;

  const duration = end - start;
  const localTime = Math.max(0, time - start);
  const progress = duration > 0 && isFinite(duration)
    ? clamp(localTime / duration, 0, 1)
    : 0;

  const value = { localTime, progress, duration, visible };

  return (
    <SpriteContext.Provider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </SpriteContext.Provider>
  );
}

// ── Sample sprite components ────────────────────────────────────────────────

// TextSprite: fades/slides text in on entry, holds, then fades out on exit.
// Props: text, x, y, size, color, font, entryDur, exitDur, align
function TextSprite({
  text,
  x = 0, y = 0,
  size = 48,
  color = '#111',
  font = 'Inter, system-ui, sans-serif',
  weight = 600,
  entryDur = 0.45,
  exitDur = 0.35,
  entryEase = Easing.easeOutBack,
  exitEase = Easing.easeInCubic,
  align = 'left',
  letterSpacing = '-0.01em',
}) {
  const { localTime, duration } = useSprite();
  const exitStart = Math.max(0, duration - exitDur);

  let opacity = 1;
  let ty = 0;

  if (localTime < entryDur) {
    const t = entryEase(clamp(localTime / entryDur, 0, 1));
    opacity = t;
    ty = (1 - t) * 16;
  } else if (localTime > exitStart) {
    const t = exitEase(clamp((localTime - exitStart) / exitDur, 0, 1));
    opacity = 1 - t;
    ty = -t * 8;
  }

  const translateX = align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0';

  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      transform: `translate(${translateX}, ${ty}px)`,
      opacity,
      fontFamily: font,
      fontSize: size,
      fontWeight: weight,
      color,
      letterSpacing,
      whiteSpace: 'pre',
      lineHeight: 1.1,
      willChange: 'transform, opacity',
    }}>
      {text}
    </div>
  );
}

// ImageSprite: scales + fades in; optional Ken Burns drift during hold.
function ImageSprite({
  src,
  x = 0, y = 0,
  width = 400, height = 300,
  entryDur = 0.6,
  exitDur = 0.4,
  kenBurns = false,
  kenBurnsScale = 1.08,
  radius = 12,
  fit = 'cover',
  placeholder = null, // {label: string} for striped placeholder
}) {
  const { localTime, duration } = useSprite();
  const exitStart = Math.max(0, duration - exitDur);

  let opacity = 1;
  let scale = 1;

  if (localTime < entryDur) {
    const t = Easing.easeOutCubic(clamp(localTime / entryDur, 0, 1));
    opacity = t;
    scale = 0.96 + 0.04 * t;
  } else if (localTime > exitStart) {
    const t = Easing.easeInCubic(clamp((localTime - exitStart) / exitDur, 0, 1));
    opacity = 1 - t;
    scale = (kenBurns ? kenBurnsScale : 1) + 0.02 * t;
  } else if (kenBurns) {
    const holdSpan = exitStart - entryDur;
    const holdT = holdSpan > 0 ? (localTime - entryDur) / holdSpan : 0;
    scale = 1 + (kenBurnsScale - 1) * holdT;
  }

  const content = placeholder ? (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'repeating-linear-gradient(135deg, #e9e6df 0 10px, #dcd8cf 10px 20px)',
      color: '#6b6458',
      fontFamily: 'JetBrains Mono, ui-monospace, monospace',
      fontSize: 13,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
    }}>
      {placeholder.label || 'image'}
    </div>
  ) : (
    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: fit, display: 'block' }} />
  );

  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      width, height,
      opacity,
      transform: `scale(${scale})`,
      transformOrigin: 'center',
      borderRadius: radius,
      overflow: 'hidden',
      willChange: 'transform, opacity',
    }}>
      {content}
    </div>
  );
}

// RectSprite: simple rectangle that animates position/size/color via props.
// Useful demo primitive — takes a `render` fn for per-frame customization.
function RectSprite({
  x = 0, y = 0,
  width = 100, height = 100,
  color = '#111',
  radius = 8,
  entryDur = 0.4,
  exitDur = 0.3,
  render, // optional: (ctx) => style overrides
}) {
  const spriteCtx = useSprite();
  const { localTime, duration } = spriteCtx;
  const exitStart = Math.max(0, duration - exitDur);

  let opacity = 1;
  let scale = 1;

  if (localTime < entryDur) {
    const t = Easing.easeOutBack(clamp(localTime / entryDur, 0, 1));
    opacity = clamp(localTime / entryDur, 0, 1);
    scale = 0.4 + 0.6 * t;
  } else if (localTime > exitStart) {
    const t = Easing.easeInQuad(clamp((localTime - exitStart) / exitDur, 0, 1));
    opacity = 1 - t;
    scale = 1 - 0.15 * t;
  }

  const overrides = render ? render(spriteCtx) : {};

  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      width, height,
      background: color,
      borderRadius: radius,
      opacity,
      transform: `scale(${scale})`,
      transformOrigin: 'center',
      willChange: 'transform, opacity',
      ...overrides,
    }} />
  );
}


function Stage({
  width = 1280,
  height = 720,
  duration = 10,
  background = '#f6f4ef',
  fps = 60,
  loop = true,
  autoplay = true,
  persistKey = 'animstage',
  children,
}) {
  /* embed flag — when the persona site loads us as `xtool/?fresh=1` (the platform
     chapter does this only once the viewer scrolls onto the video page), ignore the
     persisted playhead and always begin at 0, so the film "just starts" right then
     rather than resuming mid-way from a prior visit / a background pre-roll. */
  const __fresh = (() => { try { return new URLSearchParams(location.search).has('fresh'); } catch { return false; } })();
  /* embedded as the AIPM platform film (?fresh=1) → play 1.2× for a brisker
     keynote pace; the standalone film stays 1×. */
  const RATE = __fresh ? 1.2 : 1;
  const [time, setTime] = React.useState(() => {
    if (__fresh) return 0;
    try {
      const v = parseFloat(localStorage.getItem(persistKey + ':t') || '0');
      return isFinite(v) ? clamp(v, 0, duration) : 0;
    } catch { return 0; }
  });
  const [playing, setPlaying] = React.useState(autoplay);
  const [hoverTime, setHoverTime] = React.useState(null);
  const [scale, setScale] = React.useState(1);

  const stageRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const lastTsRef = React.useRef(null);

  // Persist playhead (skip in fresh/embed mode — neither resume nor clobber the standalone position)
  React.useEffect(() => {
    if (__fresh) return;
    try { localStorage.setItem(persistKey + ':t', String(time)); } catch {}
  }, [time, persistKey]);

  // Auto-scale to fit viewport
  React.useEffect(() => {
    if (!stageRef.current) return;
    const el = stageRef.current;
    const measure = () => {
      const barH = 44; // playback bar height
      const s = Math.min(
        el.clientWidth / width,
        (el.clientHeight - barH) / height
      );
      setScale(Math.max(0.05, s));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [width, height]);

  // Animation loop
  React.useEffect(() => {
    if (!playing) {
      lastTsRef.current = null;
      return;
    }
    const step = (ts) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      setTime((t) => {
        let next = t + dt * RATE;
        if (next >= duration) {
          if (loop) next = next % duration;
          else { next = duration; setPlaying(false); }
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [playing, duration, loop]);

  // Keyboard: space = play/pause, ← → = seek
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setPlaying(p => !p);
      } else if (e.code === 'ArrowLeft') {
        setTime(t => clamp(t - (e.shiftKey ? 1 : 0.1), 0, duration));
      } else if (e.code === 'ArrowRight') {
        setTime(t => clamp(t + (e.shiftKey ? 1 : 0.1), 0, duration));
      } else if (e.key === '0' || e.code === 'Home') {
        setTime(0);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [duration]);

  const displayTime = hoverTime != null ? hoverTime : time;

  const ctxValue = React.useMemo(
    () => ({ time: displayTime, duration, playing, setTime, setPlaying }),
    [displayTime, duration, playing]
  );

  return (
    <div
      ref={stageRef}
      style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        background: '#0a0a0a',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Canvas area — vertically centered in remaining space */}
      <div style={{
        flex: 1,
        width: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        minHeight: 0,
      }}>
        <div
          ref={canvasRef}
          style={{
            width, height,
            background,
            position: 'relative',
            transform: `scale(${scale})`,
            transformOrigin: 'center',
            flexShrink: 0,
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            overflow: 'hidden',
          }}
        >
          <TimelineContext.Provider value={ctxValue}>
            {children}
          </TimelineContext.Provider>
        </div>
      </div>

      {/* Playback bar — stacked below canvas, never overlapping */}
      <PlaybackBar
        time={displayTime}
        actualTime={time}
        duration={duration}
        playing={playing}
        onPlayPause={() => setPlaying(p => !p)}
        onReset={() => { setTime(0); }}
        onSeek={(t) => setTime(t)}
        onHover={(t) => setHoverTime(t)}
      />
    </div>
  );
}

// ── Playback bar ────────────────────────────────────────────────────────────
// Play/pause, return-to-begin, scrub track, time display.
// Uses fixed-width time fields so layout doesn't thrash.

function PlaybackBar({ time, duration, playing, onPlayPause, onReset, onSeek, onHover }) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);

  const timeFromEvent = React.useCallback((e) => {
    const rect = trackRef.current.getBoundingClientRect();
    const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    return x * duration;
  }, [duration]);

  const onTrackMove = (e) => {
    if (!trackRef.current) return;
    const t = timeFromEvent(e);
    if (dragging) {
      onSeek(t);
    } else {
      onHover(t);
    }
  };

  const onTrackLeave = () => {
    if (!dragging) onHover(null);
  };

  const onTrackDown = (e) => {
    setDragging(true);
    const t = timeFromEvent(e);
    onSeek(t);
    onHover(null);
  };

  React.useEffect(() => {
    if (!dragging) return;
    const onUp = () => setDragging(false);
    const onMove = (e) => {
      if (!trackRef.current) return;
      const t = timeFromEvent(e);
      onSeek(t);
    };
    /* pointer events, not mouse — so the scrub bar can be DRAGGED on a touchscreen
       (mouse* events never fire from a finger, which is why it was un-draggable). */
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    window.addEventListener('pointermove', onMove);
    return () => {
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('pointermove', onMove);
    };
  }, [dragging, timeFromEvent, onSeek]);

  const pct = duration > 0 ? (time / duration) * 100 : 0;
  const fmt = (t) => {
    const total = Math.max(0, t);
    const m = Math.floor(total / 60);
    const s = Math.floor(total % 60);
    return `${m}:${String(s).padStart(2, '0')}`;   // m:ss — cleaner than centiseconds
  };

  const mono = 'JetBrains Mono, ui-monospace, SFMono-Regular, monospace';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 11,
      padding: '7px 14px',
      background: 'rgba(16,16,16,0.94)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      width: '100%',
      maxWidth: 680,
      alignSelf: 'center',
      borderRadius: 8,
      color: '#f6f4ef',
      fontFamily: 'Inter, system-ui, sans-serif',
      userSelect: 'none',
      flexShrink: 0,
    }}>
      {/* play/pause only — reset + the second time field were clutter on the small
          embed; the scrub track now owns the width and is the single clear control */}
      <IconButton onClick={onPlayPause} title="Play/pause (space)">
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="3" y="2" width="3" height="10" fill="currentColor"/>
            <rect x="8" y="2" width="3" height="10" fill="currentColor"/>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 2l9 5-9 5V2z" fill="currentColor"/>
          </svg>
        )}
      </IconButton>

      {/* Scrub track — POINTER events (drags on touch), tall hit area + larger thumb */}
      <div
        ref={trackRef}
        onPointerMove={onTrackMove}
        onPointerLeave={onTrackLeave}
        onPointerDown={(e) => { try { e.currentTarget.setPointerCapture(e.pointerId); } catch {} onTrackDown(e); }}
        onPointerUp={() => setDragging(false)}
        style={{
          flex: 1,
          height: 32,
          position: 'relative',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center',
          touchAction: 'none',
        }}
      >
        <div style={{
          position: 'absolute',
          left: 0, right: 0, height: 4,
          background: 'rgba(255,255,255,0.14)',
          borderRadius: 2,
        }}/>
        <div style={{
          position: 'absolute',
          left: 0, width: `${pct}%`, height: 4,
          background: 'oklch(72% 0.12 250)',
          borderRadius: 2,
        }}/>
        <div style={{
          position: 'absolute',
          left: `${pct}%`, top: '50%',
          width: 16, height: 16,
          marginLeft: -8, marginTop: -8,
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
        }}/>
      </div>

      {/* one compact readout instead of two fixed-width fields */}
      <div style={{
        fontFamily: mono,
        fontSize: 11.5,
        fontVariantNumeric: 'tabular-nums',
        whiteSpace: 'nowrap',
        color: 'rgba(246,244,239,0.82)',
      }}>
        {fmt(time)} / {fmt(duration)}
      </div>
    </div>
  );
}

function IconButton({ children, onClick, title }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 28, height: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hover ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 6,
        color: '#f6f4ef',
        cursor: 'pointer',
        padding: 0,
        transition: 'background 120ms',
      }}
    >
      {children}
    </button>
  );
}


Object.assign(window, {
  Easing, interpolate, animate, clamp,
  TimelineContext, useTime, useTimeline,
  Sprite, SpriteContext, useSprite,
  TextSprite, ImageSprite, RectSprite,
  Stage, PlaybackBar,
});



// ═══════════ PEAR AGENT SCENES — refactored: motion-graphics + charts + 🍐 ═══════════
// Concatenated AFTER animations.jsx, so Stage / Sprite / useTime / useSprite /
// interpolate / animate / Easing / clamp are in scope. Exposes window.PearMovie.

const W = 1920, H = 1080, DUR = 72.7;

const PEAR='#65a30d', PEAR_LT='#84cc16', PEAR_BRIGHT='#a3e635', PEAR_DK='#4d7c0f', PEAR_SOFT='#ecfccb';
const INK='#0E0D0A', NIGHT='#0A0A0A', CREAM='#FAFAF9', PAPER='#F3F2EE';
const GRAY='#6B7280', GRAY_LT='#9CA3AF', LINE='#E7E6E2', CARD_BG='#FFFFFF';
const SHADOW='0 1px 2px rgba(14,13,10,0.04), 0 22px 48px -26px rgba(14,13,10,0.22)';
const SANS="'Inter','Noto Sans SC',system-ui,sans-serif";
const R16=16;

const Full = ({children, style}) => <div style={{position:'absolute', inset:0, ...style}}>{children}</div>;
const Hi = ({children, c=PEAR}) => <span style={{color:c}}>{children}</span>;

// ── 🍐 emoji mascot — replaces the hand-drawn SVG everywhere ──────────────────
function Pear({size=100, bob=6, hz=2.1, style}){
  const t = useTime();
  const dy = Math.sin(t*hz)*bob;
  const rot = Math.sin(t*hz*0.5)*4;
  return <div style={{fontSize:size, lineHeight:1, filter:'drop-shadow(0 10px 18px rgba(14,13,10,0.20))', transform:'translateY('+dy+'px) rotate('+rot+'deg)', willChange:'transform', ...style}}>🍐</div>;
}

// ── motion wrappers ───────────────────────────────────────────────────────────
function FadeUp({children, rise=24, ein=0.55, eout=0.4, style}){
  const {localTime, duration} = useSprite();
  const exitStart = Math.max(0, duration-eout);
  let op=1, ty=0;
  if(localTime<ein){ const p=Easing.easeOutCubic(clamp(localTime/ein,0,1)); op=p; ty=(1-p)*rise; }
  else if(localTime>exitStart){ const p=Easing.easeInCubic(clamp((localTime-exitStart)/eout,0,1)); op=1-p; ty=-p*(rise*0.6); }
  return <div style={{opacity:op, transform:'translateY('+ty+'px)', willChange:'transform,opacity', ...style}}>{children}</div>;
}

function Pop({children, dur=0.5, from=0.62, eout=0.35, style}){
  const {localTime, duration} = useSprite();
  const exitStart = Math.max(0, duration-eout);
  let op=1, sc=1;
  if(localTime<dur){ const p=Easing.easeOutBack(clamp(localTime/dur,0,1)); op=clamp(localTime/dur,0,1); sc=from+(1-from)*p; }
  else if(localTime>exitStart){ const p=Easing.easeInCubic(clamp((localTime-exitStart)/eout,0,1)); op=1-p; sc=1-0.06*p; }
  return <div style={{opacity:op, transform:'scale('+sc+')', willChange:'transform,opacity', ...style}}>{children}</div>;
}

// ── chart primitives ──────────────────────────────────────────────────────────
function Counter({to, decimals=0, dur=1.2, delay=0, prefix='', suffix='', ease=Easing.easeOutCubic, style}){
  const {localTime} = useSprite();
  const p = ease(clamp((localTime-delay)/dur,0,1));
  return <span style={{fontVariantNumeric:'tabular-nums', ...style}}>{prefix}{(to*p).toFixed(decimals)}{suffix}</span>;
}

function Donut({pct, size=150, stroke=16, color=PEAR, track='#ECEBE6', delay=0, dur=1.1, children}){
  const {localTime} = useSprite();
  const p = Easing.easeOutCubic(clamp((localTime-delay)/dur,0,1));
  const r=(size-stroke)/2, C=2*Math.PI*r;
  return <div style={{position:'relative', width:size, height:size, flex:'0 0 auto'}}>
    <svg width={size} height={size} style={{transform:'rotate(-90deg)'}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C*(1-(pct/100)*p)}/>
    </svg>
    <div style={{position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>{children}</div>
  </div>;
}

// ── brand bits ────────────────────────────────────────────────────────────────
function Lockup({scale=1, dark=false}){
  return <div style={{display:'flex', alignItems:'center', gap:12*scale, fontFamily:SANS}}>
    <Pear size={40*scale} bob={2.5}/>
    <span style={{fontSize:34*scale, fontWeight:700, letterSpacing:'-0.01em', color:dark?CREAM:INK}}>Pear <span style={{color:PEAR}}>Agent</span></span>
  </div>;
}

function SectionTag({index, label, color=PEAR}){
  return <div style={{position:'absolute', left:96, top:80, display:'flex', alignItems:'baseline', gap:16, fontFamily:SANS, zIndex:5}}>
    <span style={{fontSize:26, fontWeight:700, color:color, letterSpacing:'0.04em'}}>{index}</span>
    <span style={{width:36, height:2, background:LINE, transform:'translateY(-7px)'}}/>
    <span style={{fontSize:26, fontWeight:600, color:GRAY, letterSpacing:'0.02em'}}>{label}</span>
  </div>;
}

// ── ambient floating pears (always on, subtle) ─────────────────────────────────
function FloatingPears(){
  const t = useTime();
  const specs=[{x:7,y:16,s:56,hz:0.5,amp:30,ph:0},{x:87,y:11,s:42,hz:0.42,amp:26,ph:1.5},{x:82,y:72,s:66,hz:0.36,amp:34,ph:3},{x:12,y:76,s:46,hz:0.46,amp:24,ph:2},{x:49,y:6,s:34,hz:0.5,amp:20,ph:4},{x:34,y:88,s:40,hz:0.4,amp:22,ph:5}];
  return <Full style={{pointerEvents:'none', overflow:'hidden', zIndex:0}}>
    {specs.map((p,i)=>(
      <div key={i} style={{position:'absolute', left:p.x+'%', top:p.y+'%', fontSize:p.s, opacity:0.06, transform:'translateY('+(Math.sin(t*p.hz+p.ph)*p.amp)+'px) rotate('+(Math.sin(t*p.hz*0.7+p.ph)*12)+'deg)', willChange:'transform'}}>🍐</div>
    ))}
  </Full>;
}

function Background(){
  const t = useTime();
  const darkOp = interpolate([0,8.0,9.5,70.2,71.7],[1,1,0,0,1],Easing.easeInOutQuad)(t);
  return <React.Fragment>
    <div style={{position:'absolute', inset:0, background:CREAM}}/>
    <div style={{position:'absolute', inset:0, background:'radial-gradient(120% 90% at 50% 0%, #11110e 0%, '+NIGHT+' 70%)', opacity:darkOp}}/>
  </React.Fragment>;
}

// ════════════════ ACT 1 — hook (0–10.5) ════════════════
// 重复 = the same overseas-DTC chores, scattered and duplicated into a wall
const CHORES = ['审说明书','追播放数据','领物料','改尺寸图','扒竞品热点','填周报','导选题','对术语','切片段','改文案'];
// deterministic scatter so the wall is identical across the cut (build → absorb)
const SWARM = (()=>{
  let s=20240607; const rnd=()=>{ s=(s*1103515245+12345)&0x7fffffff; return s/0x7fffffff; };
  const arr=[];
  for(let i=0;i<42;i++){ arr.push({label:CHORES[i%CHORES.length], x:8+rnd()*84, y:14+rnd()*70, rot:(rnd()-0.5)*12, d:rnd()}); }
  return arr;
})();
const chipMuted = {fontFamily:SANS, fontSize:21, fontWeight:500, color:'rgba(236,236,233,0.66)', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:11, padding:'9px 16px', whiteSpace:'nowrap', willChange:'transform,opacity'};
// 释放 = creative outputs that float up, in colour
const RELEASE = ['灵感','选题','脚本','分镜','爆款','大片'];
const RELEASE_C = ['#a3e635','#bef264','#84cc16','#d9f99d','#a3e635','#bef264'];

// punch-in keyword: scales 1.5→1 with overshoot
function KeyWord({children, at=0, dur=0.5, size=150, color=PEAR_BRIGHT}){
  const {localTime}=useSprite();
  const p=clamp((localTime-at)/dur,0,1);
  const e=Easing.easeOutBack(p);
  return <span style={{display:'inline-block', fontSize:size, fontWeight:800, color, letterSpacing:'-0.02em', opacity:p, transform:'scale('+(1.5-0.5*e)+')', textShadow:'0 6px 40px rgba(0,0,0,0.6)'}}>{children}</span>;
}

// Beat 1 — chores pop in, scatter and accumulate into a dense wall
function ChoreWall(){
  const {localTime:lt}=useSprite();
  const exit=1-clamp((lt-2.25)/0.35,0,1);
  return <Full style={{zIndex:1, overflow:'hidden'}}>
    {SWARM.map((c,i)=>{
      const ap=clamp((lt-0.1-c.d*1.5)/0.42,0,1);
      const e=Easing.easeOutBack(ap);
      return <div key={i} style={{position:'absolute', left:c.x+'%', top:c.y+'%', transform:'translate(-50%,-50%) scale('+(0.55+0.45*e)+') rotate('+c.rot+'deg)', opacity:ap*0.62*exit, ...chipMuted}}>{c.label}</div>;
    })}
  </Full>;
}

// Beat 2 — 🍐 absorbs the grey chore wall (接管), then colour bursts upward (释放)
function AbsorbRelease(){
  const {localTime:lt}=useSprite();
  const exit=1-clamp((lt-2.05)/0.25,0,1);
  // pear swells while it eats, then settles
  const eat=clamp((lt-0.25)/1.0,0,1);
  const pearScale=1+0.2*Math.sin(eat*Math.PI);
  return <Full style={{overflow:'hidden'}}>
    {/* grey chores flying into centre */}
    <div style={{position:'absolute', inset:0, zIndex:2}}>
      {SWARM.map((c,i)=>{
        const a=Easing.easeInCubic(clamp((lt-0.3-c.d*0.5)/0.7,0,1));
        const x=c.x+(50-c.x)*a, y=c.y+(50-c.y)*a;
        return <div key={i} style={{position:'absolute', left:x+'%', top:y+'%', transform:'translate(-50%,-50%) scale('+(1-a)+') rotate('+c.rot*(1-a)+'deg)', opacity:(1-a)*0.62*exit, ...chipMuted}}>{c.label}</div>;
      })}
    </div>
    {/* colourful creative outputs floating up */}
    <div style={{position:'absolute', inset:0, zIndex:3}}>
      {RELEASE.map((r,i)=>{
        const rp=Easing.easeOutCubic(clamp((lt-1.1-i*0.07)/1.05,0,1));
        const ang=-Math.PI/2 + (i-(RELEASE.length-1)/2)*0.46;
        const dist=rp*(30+(i%3)*6);
        const x=50+Math.cos(ang)*dist, y=50+Math.sin(ang)*dist;
        const fade=rp<0.82?1:(1-(rp-0.82)/0.18);
        return <div key={i} style={{position:'absolute', left:x+'%', top:y+'%', transform:'translate(-50%,-50%) scale('+(0.6+0.4*Easing.easeOutBack(rp))+')', opacity:(rp>0.02?1:0)*fade*exit, fontFamily:SANS, fontSize:23, fontWeight:600, color:'#1a2e05', background:RELEASE_C[i%RELEASE_C.length], borderRadius:11, padding:'9px 17px', whiteSpace:'nowrap', boxShadow:'0 8px 30px -8px rgba(163,230,53,0.5)', willChange:'transform,opacity'}}>{r}</div>;
      })}
    </div>
    {/* the pear, front and centre */}
    <Full style={{display:'flex', alignItems:'center', justifyContent:'center', zIndex:4}}>
      <div style={{transform:'scale('+pearScale+')', opacity:exit}}><Pear size={150} bob={6}/></div>
    </Full>
  </Full>;
}

function Act1(){
  return <React.Fragment>
    <Sprite start={0.3} end={2.9}>
      <ChoreWall/>
      <Full style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', zIndex:3}}>
        <FadeUp ein={0.5} rise={20} style={{textAlign:'center', fontFamily:SANS, fontSize:46, fontWeight:500, color:'rgba(250,250,249,0.82)', letterSpacing:'-0.01em', textShadow:'0 4px 30px rgba(0,0,0,0.7)'}}>
          转型最重的，不是创意——
        </FadeUp>
        <div style={{marginTop:8}}><span style={{fontSize:90, fontWeight:700, color:CREAM, textShadow:'0 6px 40px rgba(0,0,0,0.6)'}}>是 </span><KeyWord at={1.0} dur={0.55} size={130}>重复</KeyWord></div>
      </Full>
    </Sprite>

    <Sprite start={3.0} end={5.3}>
      <AbsorbRelease/>
      <Full style={{zIndex:5}}>
        <Sprite start={3.15} end={4.35}>
          <FadeUp ein={0.4} rise={16} style={{position:'absolute', left:0, right:0, top:'17%', textAlign:'center', fontFamily:SANS, fontSize:52, fontWeight:600, color:CREAM, letterSpacing:'-0.01em', textShadow:'0 4px 30px rgba(0,0,0,0.6)'}}>
            重复，被<Hi c={PEAR_BRIGHT}>接管</Hi>
          </FadeUp>
        </Sprite>
        <Sprite start={4.2} end={5.3}>
          <FadeUp ein={0.4} rise={18} style={{position:'absolute', left:0, right:0, top:'74%', textAlign:'center', fontFamily:SANS, fontSize:52, fontWeight:600, color:CREAM, letterSpacing:'-0.01em', textShadow:'0 4px 30px rgba(0,0,0,0.6)'}}>
            创意，被<KeyWord at={0.2} dur={0.5} size={52}>释放</KeyWord>
          </FadeUp>
        </Sprite>
      </Full>
    </Sprite>

    <Sprite start={5.4} end={8.6}>
      <Full style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
        <Pop dur={0.7}><Pear size={168} bob={6}/></Pop>
        <FadeUp ein={0.8} rise={30} style={{marginTop:26, textAlign:'center', fontFamily:SANS, fontSize:118, fontWeight:700, color:CREAM, letterSpacing:'-0.03em', lineHeight:1.08}}>
          把团队的时间，<br/>还给<Hi c={PEAR_BRIGHT}>团队</Hi>。
        </FadeUp>
        <FadeUp ein={1.0} rise={18} style={{marginTop:34, fontFamily:SANS, fontStyle:'italic', fontSize:30, fontWeight:400, color:GRAY_LT}}>
          the AI workbench for overseas DTC content teams
        </FadeUp>
      </Full>
    </Sprite>
  </React.Fragment>;
}

// ════════════════ ACT 2 — 是什么 · 聊天气泡 (10.8–20.8) ════════════════
function PearAvatar({size=64}){
  return <div style={{width:size, height:size, borderRadius:size/2, background:'#fff', boxShadow:SHADOW, border:'1px solid '+LINE, display:'flex', alignItems:'center', justifyContent:'center', flex:'0 0 auto'}}>
    <Pear size={size*0.6} bob={3}/>
  </div>;
}

function Bubble({side='left', accent=false, children, sub, start, end}){
  const me = side==='right';
  return <Sprite start={start} end={end}>
    <Pop dur={0.4} from={0.84} eout={0.28} style={{display:'flex', justifyContent: me?'flex-end':'flex-start', gap:16, alignItems:'flex-end'}}>
      {!me && <PearAvatar/>}
      <div style={{maxWidth:780, background: me?'#fff':(accent?PEAR:CARD_BG), color: accent?'#fff':INK, border: accent?'none':'1px solid '+LINE, boxShadow:SHADOW, borderRadius:26, borderBottomLeftRadius: me?26:8, borderBottomRightRadius: me?8:26, padding:'20px 28px', fontFamily:SANS}}>
        <div style={{fontSize:34, fontWeight:600, lineHeight:1.34, letterSpacing:'-0.01em'}}>{children}</div>
        {sub && <div style={{fontSize:20, marginTop:6, color: accent?'rgba(255,255,255,0.82)':GRAY_LT}}>{sub}</div>}
      </div>
    </Pop>
  </Sprite>;
}

function TypingDots({start, end, x, y}){
  const t = useTime();
  return <Sprite start={start} end={end}>
    <Pop dur={0.3} from={0.7} style={{position:'absolute', left:x, top:y, display:'flex', alignItems:'center', gap:7, background:CARD_BG, border:'1px solid '+LINE, boxShadow:SHADOW, borderRadius:20, borderBottomLeftRadius:8, padding:'18px 22px'}}>
      {[0,1,2].map(i=>{ const b=Math.sin(t*6 - i*0.7); return <span key={i} style={{width:11, height:11, borderRadius:6, background:GRAY_LT, transform:'translateY('+(b>0?-b*5:0)+'px)', opacity:0.55+0.45*Math.max(0,b)}}/>; })}
    </Pop>
  </Sprite>;
}

function Act2(){
  const end=16.0;
  return <React.Fragment>
    <Sprite start={8.9} end={end}><SectionTag index="01" label="是什么"/></Sprite>
    <div style={{position:'absolute', left:0, right:0, top:178, bottom:60, display:'flex', flexDirection:'column', justifyContent:'flex-start', gap:18, padding:'0 330px'}}>
      <Bubble side="right" start={9.0} end={end} sub="—— 每个内容团队的日常">重复繁杂的活，正在吃掉团队的<Hi>产能</Hi>。</Bubble>
      <TypingDots start={9.6} end={9.9} x={330} y={372}/>
      <Bubble side="left" accent start={9.9} end={end}>交给我。团队那些<b>重复繁杂</b>的活，我来接管。</Bubble>
      <Bubble side="left" start={10.6} end={end} sub="调研、审核、追踪、领料……一站接住">1 私域 Agent ＋ 7 生产工具。</Bubble>
      <Bubble side="right" start={11.4} end={end}>能接到什么程度？</Bubble>
      <Bubble side="left" accent start={12.2} end={end}>从琐事到全流程，<b>整段接走</b>。</Bubble>
    </div>
    <Sprite start={13.6} end={end}>
      <Full style={{display:'flex', alignItems:'flex-end', justifyContent:'center', paddingBottom:72}}>
        <FadeUp rise={24} style={{display:'flex', alignItems:'center', gap:22, fontFamily:SANS}}>
          <Pear size={78} bob={5}/>
          <div style={{fontSize:54, fontWeight:700, color:INK, letterSpacing:'-0.02em'}}>说一句目标，它就把活<Hi>接走</Hi>。</div>
        </FadeUp>
      </Full>
    </Sprite>
  </React.Fragment>;
}

// ════════════════ ACT 3a — workspace mock (21.2–29) ════════════════
function Chip({children, active}){
  return <span style={{fontFamily:SANS, fontSize:21, fontWeight:500, color:active?'#fff':INK, background:active?PEAR:PAPER, border:active?'none':'1px solid '+LINE, borderRadius:999, padding:'11px 20px', whiteSpace:'nowrap'}}>{children}</span>;
}

function Typer({full, dur, delay=0}){
  const {localTime} = useSprite();
  const t = useTime();
  const n = Math.floor(clamp((localTime-delay)/dur,0,1)*full.length);
  const done = n>=full.length;
  const caretOn = done ? (Math.floor(t*1.6)%2===0) : true;
  return <span>{full.slice(0,n)}<span style={{display:'inline-block', width:2, height:'1em', background:PEAR, marginLeft:2, verticalAlign:'-2px', opacity:caretOn?1:0}}/></span>;
}

function WorkspaceMock(){
  const t=useTime();
  const kb=1+clamp((t-16.3)/5,0,1)*0.03;
  return <Sprite start={16.3} end={21.4}>
    <SectionTag index="02" label="工作台"/>
    <Full style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
      <FadeUp rise={26}>
        <div style={{transform:'scale('+kb+')', transformOrigin:'center 46%'}}>
          <div style={{width:1180, height:720, background:CARD_BG, borderRadius:22, boxShadow:'0 1px 2px rgba(14,13,10,0.05), 0 50px 90px -40px rgba(14,13,10,0.30)', overflow:'hidden', fontFamily:SANS, position:'relative', border:'1px solid '+LINE}}>
            <div style={{height:56, borderBottom:'1px solid '+LINE, display:'flex', alignItems:'center', gap:10, padding:'0 22px'}}>
              <span style={{width:12, height:12, borderRadius:6, background:'#e5e5e2'}}/>
              <span style={{width:12, height:12, borderRadius:6, background:'#e5e5e2'}}/>
              <span style={{width:12, height:12, borderRadius:6, background:'#e5e5e2'}}/>
              <div style={{marginLeft:16}}><Lockup scale={0.62}/></div>
              <span style={{marginLeft:'auto', fontSize:18, color:GRAY_LT}}>示意界面 · placeholder</span>
            </div>
            <div style={{display:'flex', height:'calc(100% - 56px)'}}>
              <div style={{width:230, borderRight:'1px solid '+LINE, background:'#FCFCFB', padding:'24px 18px', display:'flex', flexDirection:'column', gap:6}}>
                {['对话首页','选题调研','爆款脚本','竞品寻源','说明书审核','数据追踪','图片工坊','物料领用'].map((s,i)=>(
                  <div key={s} style={{fontSize:19, fontWeight:i===0?600:500, color:i===0?INK:GRAY, background:i===0?PAPER:'transparent', borderRadius:10, padding:'11px 14px', display:'flex', alignItems:'center', gap:10}}>
                    {i===0 && <span style={{width:7, height:7, borderRadius:4, background:PEAR}}/>}{s}
                  </div>
                ))}
              </div>
              <div style={{flex:1, padding:'54px 60px', display:'flex', flexDirection:'column'}}>
                <div style={{display:'flex', alignItems:'center', gap:18}}>
                  <Pear size={64} bob={3}/>
                  <div>
                    <div style={{fontSize:40, fontWeight:700, color:INK, letterSpacing:'-0.01em'}}>🍐 Hi，今天想推进什么？</div>
                    <div style={{fontSize:23, color:GRAY, marginTop:8}}>和 Pear 聊聊，或者直接说一句目标…</div>
                  </div>
                </div>
                <div style={{marginTop:34, minHeight:64, border:'1.5px solid '+PEAR_LT, borderRadius:16, display:'flex', alignItems:'center', padding:'0 22px', color:INK, fontSize:22, boxShadow:'inset 0 1px 2px rgba(14,13,10,0.03)'}}>
                  <Typer full="帮我调研露营杯刻字的爆款选题" dur={2.2} delay={0.6}/>
                  <span style={{marginLeft:'auto', width:40, height:40, borderRadius:12, background:PEAR, display:'inline-flex', alignItems:'center', justifyContent:'center', flex:'0 0 auto'}}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12h13M12 5l7 7-7 7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                </div>
                <div style={{marginTop:26, fontSize:18, color:GRAY_LT, letterSpacing:'0.02em'}}>按场景进入工作流</div>
                <div style={{marginTop:14, display:'flex', flexWrap:'wrap', gap:12}}>
                  <Chip active>选题调研</Chip><Chip>爆款脚本</Chip><Chip>竞品寻源</Chip><Chip>说明书审核</Chip><Chip>数据追踪</Chip><Chip>图片工坊</Chip>
                </div>
                <div style={{marginTop:'auto', fontSize:20, color:GRAY, fontStyle:'italic'}}>打开就有一个会陪你跑全程的私域助手 🍐</div>
              </div>
            </div>
            <div style={{position:'absolute', right:28, bottom:28, width:76, height:76, borderRadius:38, background:'#fff', boxShadow:'0 10px 30px -8px rgba(101,163,13,0.45), 0 1px 2px rgba(14,13,10,0.1)', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid '+LINE}}>
              <Pear size={46} bob={3.5}/>
            </div>
          </div>
        </div>
      </FadeUp>
    </Full>
  </Sprite>;
}

// ════════════════ ACT 3b — 1+7 grid (29.3–41.8) ════════════════
function ToolIcon({kind}){
  const c=INK, sw=1.8;
  const common={width:30, height:30, viewBox:'0 0 24 24', fill:'none'};
  const P=(d)=><path d={d} stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>;
  switch(kind){
    case 'script':   return <svg {...common}><rect x="3" y="6" width="18" height="14" rx="2" stroke={c} strokeWidth={sw}/><path d="M3 6l3-3h3l-3 3M9 6l3-3h3l-3 3M15 6l3-3h3l-3 3" stroke={c} strokeWidth={sw} strokeLinejoin="round"/></svg>;
    case 'research': return <svg {...common}><rect x="3" y="4" width="18" height="17" rx="2" stroke={c} strokeWidth={sw}/><path d="M3 9h18M8 2v4M16 2v4" stroke={c} strokeWidth={sw} strokeLinecap="round"/>{P('M11 15.5l1.5 1.5')}<circle cx="13" cy="13" r="2.4" stroke={c} strokeWidth={sw}/></svg>;
    case 'sourcing': return <svg {...common}><circle cx="11" cy="11" r="6.5" stroke={c} strokeWidth={sw}/>{P('M16 16l4 4')}{P('M11 8.5v5M8.5 11h5')}</svg>;
    case 'review':   return <svg {...common}><path d="M6 3h8l4 4v14H6z" stroke={c} strokeWidth={sw} strokeLinejoin="round"/><path d="M14 3v4h4" stroke={c} strokeWidth={sw} strokeLinejoin="round"/>{P('M9 14.5l2 2 4-4.5')}</svg>;
    case 'video':    return <svg {...common}><rect x="2.5" y="4" width="19" height="13" rx="2" stroke={c} strokeWidth={sw}/>{P('M8 21h8M12 17v4')}{P('M10 8v5M13 10v3M16 9v4')}</svg>;
    case 'image':    return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2" stroke={c} strokeWidth={sw}/><circle cx="8.5" cy="9.5" r="1.8" stroke={c} strokeWidth={sw}/>{P('M21 16l-5-5L5 20')}</svg>;
    case 'd2v':      return <svg {...common}><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" stroke={c} strokeWidth={sw} strokeLinejoin="round"/>{P('M4 7.5l8 4.5 8-4.5M12 12v9')}</svg>;
    default:         return null;
  }
}

const TOOLS = [
  { kind:'agent',    name:'私域 Agent', en:'Pear 梨子助手', line:'会记事、懂部门、随叫随到的内容副驾。', agent:true },
  { kind:'script',   name:'Pear 脚本', en:'Pear Script', line:'抓趋势、写 Hook、出分镜，一条龙。' },
  { kind:'research', name:'Pear 调研', en:'Research', line:'用节日和热点反推选题，调研一页成稿。' },
  { kind:'sourcing', name:'Pear 竞品', en:'Pear Sourcing', line:'一个关键词，换回一份竞品 + 选品报告。' },
  { kind:'review',   name:'Pear 审查', en:'Pear Review', line:'说明书审校、互译、落档，术语越用越准。' },
  { kind:'video',    name:'视频管家', en:'Video Butler', line:'多平台播放数据自动追，归档到飞书。' },
  { kind:'image',    name:'图片工坊', en:'Image Studio', line:'一张图，洗出提示词、标题和热门 Tag。' },
  { kind:'d2v',      name:'D2V 管家', en:'D2V Butler', line:'领料申请，从填表变成报个 SKU。' },
];

// ── radial capability map (hub + 7 spokes + live readout) ────────────────────
const MAP_HUB = {x:642, y:648};
const MAP_RING = 300;
const MAP_T0 = 22.6, MAP_STEP = 0.22, MAP_SCAN = 24.8, MAP_SLOT = 0.78;
function ringPos(i, n){
  const a = (-90 + i*(360/n)) * Math.PI/180;
  return {x: MAP_HUB.x + MAP_RING*Math.cos(a), y: MAP_HUB.y + MAP_RING*Math.sin(a)};
}
function scanIndex(t, n){
  return t>=MAP_SCAN ? Math.floor((t-MAP_SCAN)/MAP_SLOT)%n : -1;
}

function ConstellationLines({n}){
  const t = useTime();
  const active = scanIndex(t, n);
  return <svg width={W} height={H} style={{position:'absolute', inset:0, pointerEvents:'none', zIndex:1}}>
    {Array.from({length:n}).map((_,i)=>{
      const p = ringPos(i,n);
      const draw = Easing.easeOutCubic(clamp((t-(MAP_T0+i*MAP_STEP))/0.5,0,1));
      const len = Math.hypot(p.x-MAP_HUB.x, p.y-MAP_HUB.y);
      const on = active===i;
      return <line key={i} x1={MAP_HUB.x} y1={MAP_HUB.y} x2={p.x} y2={p.y}
        stroke={on?PEAR:'#dde3d2'} strokeWidth={on?3:1.6}
        strokeDasharray={len} strokeDashoffset={len*(1-draw)} strokeLinecap="round"/>;
    })}
    {active>=0 && (()=>{ const p=ringPos(active,n); const f=((t-MAP_SCAN)/MAP_SLOT)%1; const px=MAP_HUB.x+(p.x-MAP_HUB.x)*f, py=MAP_HUB.y+(p.y-MAP_HUB.y)*f; return <circle cx={px} cy={py} r={6} fill={PEAR}/>; })()}
  </svg>;
}

function HubNode(){
  const t = useTime();
  const pulse = Math.sin(t*1.7)*0.5+0.5;
  const D = 214;
  return <Pop dur={0.6} from={0.45} style={{position:'absolute', left:MAP_HUB.x-D/2, top:MAP_HUB.y-D/2, width:D, height:D, zIndex:3}}>
    <div style={{position:'absolute', inset:-20, borderRadius:'50%', border:'2px solid '+PEAR_LT, opacity:0.2+pulse*0.28, transform:'scale('+(1+pulse*0.07)+')'}}/>
    <div style={{width:D, height:D, borderRadius:'50%', background:'radial-gradient(140% 140% at 32% 26%, '+PEAR_LT+' 0%, '+PEAR+' 56%, '+PEAR_DK+' 100%)', boxShadow:'0 30px 64px -24px rgba(101,163,13,0.7)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:SANS}}>
      <Pear size={84} bob={5}/>
      <div style={{marginTop:2, fontSize:27, fontWeight:700, color:'#fff', letterSpacing:'-0.01em'}}>Pear Agent</div>
      <div style={{fontSize:16, color:'rgba(255,255,255,0.86)', marginTop:1}}>私域中枢</div>
    </div>
  </Pop>;
}

function RingNode({tool, i, n}){
  const t = useTime();
  const active = scanIndex(t,n)===i;
  const p = ringPos(i,n);
  const Wd=198, Ht=104;
  return <Pop dur={0.42} from={0.55} style={{position:'absolute', left:p.x-Wd/2, top:p.y-Ht/2, width:Wd, zIndex:3}}>
    <div style={{height:Ht, background:CARD_BG, borderRadius:16, border:'1px solid '+(active?PEAR:LINE), boxShadow:active?'0 1px 2px rgba(14,13,10,0.05), 0 22px 46px -22px rgba(101,163,13,0.55)':SHADOW, padding:'0 18px', display:'flex', alignItems:'center', gap:14, transform:'scale('+(active?1.07:1)+')', transition:'transform 200ms ease, border-color 200ms', fontFamily:SANS}}>
      <div style={{width:46, height:46, borderRadius:12, background:active?PEAR_SOFT:PAPER, display:'flex', alignItems:'center', justifyContent:'center', flex:'0 0 auto', transition:'background 200ms'}}><ToolIcon kind={tool.kind}/></div>
      <div style={{minWidth:0}}>
        <div style={{fontSize:23, fontWeight:700, color:INK, letterSpacing:'-0.01em', whiteSpace:'nowrap'}}>{tool.name}</div>
        <div style={{fontSize:14, fontStyle:'italic', color:GRAY_LT, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{tool.en}</div>
      </div>
    </div>
  </Pop>;
}

function DetailPanel({ring}){
  const t = useTime();
  const n = ring.length;
  const slot = Math.max(0,(t-MAP_SCAN)/MAP_SLOT);
  const idx = Math.floor(slot)%n;
  const f = slot%1;
  const cardOp = clamp((t-24.4)/0.5,0,1);
  const inOp = clamp(f/0.16,0,1);
  const ty = (1-Easing.easeOutCubic(clamp(f/0.24,0,1)))*16;
  const tool = ring[idx];
  return <div style={{position:'absolute', left:1168, top:392, width:616, fontFamily:SANS, zIndex:4, opacity:cardOp}}>
    <div style={{fontSize:20, fontWeight:600, color:GRAY_LT, letterSpacing:'0.05em', marginBottom:16}}>正在点亮 · {String(idx+1).padStart(2,'0')} / 07</div>
    <div style={{background:CARD_BG, borderRadius:R16, border:'1px solid '+LINE, boxShadow:SHADOW, padding:'34px 38px', minHeight:236}}>
      <div style={{opacity:inOp, transform:'translateY('+ty+'px)'}}>
        <div style={{display:'flex', alignItems:'center', gap:20}}>
          <div style={{width:66, height:66, borderRadius:16, background:PEAR_SOFT, display:'flex', alignItems:'center', justifyContent:'center', flex:'0 0 auto'}}><div style={{transform:'scale(1.45)'}}><ToolIcon kind={tool.kind}/></div></div>
          <div>
            <div style={{fontSize:40, fontWeight:700, color:INK, letterSpacing:'-0.01em'}}>{tool.name}</div>
            <div style={{fontSize:20, fontStyle:'italic', color:GRAY_LT}}>{tool.en}</div>
          </div>
        </div>
        <div style={{marginTop:24, fontSize:28, lineHeight:1.5, color:GRAY, textWrap:'pretty'}}>{tool.line}</div>
      </div>
    </div>
  </div>;
}

const PIPELINE = ['选题调研','脚本生成','内容产出','跨平台追踪','审核翻译','竞品寻源','物料领用','知识沉淀'];

function PipelineRibbon(){
  const t=useTime();
  const {localTime}=useSprite();
  const appear=Easing.easeOutCubic(clamp(localTime/0.6,0,1));
  const scan=Math.floor((t*1.3)%(PIPELINE.length+1));
  return <div style={{display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', opacity:appear}}>
    {PIPELINE.map((p,i)=>{ const on=scan===i; return <React.Fragment key={p}>
      <span style={{fontSize:19, fontWeight:on?700:500, color:on?PEAR_DK:GRAY, background:on?PEAR_SOFT:PAPER, borderRadius:999, padding:'7px 15px', transition:'background 140ms, color 140ms'}}>{p}</span>
      {i<PIPELINE.length-1 && <span style={{color:PEAR, fontSize:17}}>→</span>}
    </React.Fragment>; })}
  </div>;
}

function Act3Map(){
  const end=30.6;
  const ring = TOOLS.slice(1); // 7 production tools
  const n = ring.length;
  return <React.Fragment>
    <Sprite start={21.7} end={end}><SectionTag index="02" label="能力地图"/></Sprite>
    <Sprite start={21.9} end={end}>
      <div style={{position:'absolute', top:150, left:96, fontFamily:SANS}}>
        <FadeUp rise={18}>
          <div style={{fontSize:50, fontWeight:700, color:INK, letterSpacing:'-0.02em'}}>
            <Hi><Counter to={1} dur={0.5}/></Hi> 私域 Agent <span style={{color:GRAY_LT, fontWeight:500}}>＋</span> <Hi><Counter to={7} dur={0.9} delay={0.2}/></Hi> 生产工具，连成一张<Hi>网</Hi>
          </div>
        </FadeUp>
      </div>
    </Sprite>
    <Sprite start={22.2} end={end}>
      <div style={{position:'absolute', top:230, left:96, right:96, fontFamily:SANS}}><PipelineRibbon/></div>
    </Sprite>

    <Sprite start={22.4} end={end}><ConstellationLines n={n}/></Sprite>
    <Sprite start={22.5} end={end}><HubNode/></Sprite>
    {ring.map((tool,i)=>(
      <Sprite key={tool.name} start={MAP_T0+i*MAP_STEP} end={end}><RingNode tool={tool} i={i} n={n}/></Sprite>
    ))}
    <Sprite start={24.6} end={end}><DetailPanel ring={ring}/></Sprite>
  </React.Fragment>;
}

// ════════════════ ACT — 真实演示 · real product GIFs (30.9–44.4) ════════════════
function BrowserFrame({src, w, h, url}){
  return <div style={{width:w, background:CARD_BG, borderRadius:16, boxShadow:'0 1px 2px rgba(14,13,10,0.05), 0 50px 90px -40px rgba(14,13,10,0.30)', overflow:'hidden', border:'1px solid '+LINE, fontFamily:SANS}}>
    <div style={{height:46, borderBottom:'1px solid '+LINE, display:'flex', alignItems:'center', gap:9, padding:'0 18px', background:'#FCFCFB'}}>
      <span style={{width:11, height:11, borderRadius:6, background:'#e5e5e2'}}/>
      <span style={{width:11, height:11, borderRadius:6, background:'#e5e5e2'}}/>
      <span style={{width:11, height:11, borderRadius:6, background:'#e5e5e2'}}/>
      <div style={{marginLeft:14, flex:1, height:26, borderRadius:8, background:PAPER, display:'flex', alignItems:'center', padding:'0 14px', fontSize:15, color:GRAY}}>{url}</div>
    </div>
    <img src={src} alt="" width={w} height={h} style={{display:'block', width:w, height:h, objectFit:'cover'}}/>
  </div>;
}

const DEMOS = [
  { n:'01', kind:'script',   name:'Pear 脚本', en:'Pear Script', line:'输入一句目标，自动抓趋势、定时长、出脚本。', src:'uploads/gif_script.gif',   url:'pear.app · 爆款脚本',        w:723, h:480, start:31.4, end:38.4 },
  { n:'02', kind:'research', name:'Pear 调研', en:'Research',    line:'一句核心主题，自动跑日历选题、趋势调研与报告。', src:'uploads/gif_research.gif', url:'pear.app · 选题调研',        w:943, h:600, start:38.5, end:45.5 },
  { n:'03', kind:'review',   name:'Pear 审查', en:'Pear Review', line:'说明书自动审校、中英互译，直接落档飞书。',     src:'uploads/gif_review.gif',   url:'xtool.feishu.cn · 审查模板', w:823, h:600, start:45.6, end:52.6 },
];

function RealDemo(){
  const end=52.6;
  return <React.Fragment>
    <Sprite start={30.9} end={end}><SectionTag index="03" label="真实演示"/></Sprite>
    <Sprite start={31.0} end={end}>
      <div style={{position:'absolute', top:150, left:96, fontFamily:SANS}}>
        <FadeUp rise={18}>
          <div style={{fontSize:50, fontWeight:700, color:INK, letterSpacing:'-0.02em'}}>不是示意图——<Hi>看它真的在跑</Hi></div>
        </FadeUp>
      </div>
    </Sprite>
    {DEMOS.map(d=>(
      <Sprite key={d.kind} start={d.start} end={d.end}>
        <FadeUp rise={26} style={{position:'absolute', inset:0}}>
          <div style={{position:'absolute', left:96, top:352, width:540, fontFamily:SANS}}>
            <div style={{fontSize:24, fontWeight:700, color:PEAR, letterSpacing:'0.08em'}}>{d.n} / 03</div>
            <div style={{marginTop:18, display:'flex', alignItems:'center', gap:18}}>
              <div style={{width:66, height:66, borderRadius:16, background:PEAR_SOFT, display:'flex', alignItems:'center', justifyContent:'center', flex:'0 0 auto'}}><div style={{transform:'scale(1.45)'}}><ToolIcon kind={d.kind}/></div></div>
              <div>
                <div style={{fontSize:46, fontWeight:700, color:INK, letterSpacing:'-0.01em'}}>{d.name}</div>
                <div style={{fontSize:22, fontStyle:'italic', color:GRAY_LT}}>{d.en}</div>
              </div>
            </div>
            <div style={{marginTop:26, fontSize:30, lineHeight:1.5, color:GRAY, textWrap:'pretty'}}>{d.line}</div>
            <div style={{marginTop:30, display:'inline-flex', alignItems:'center', gap:10, background:PEAR_SOFT, border:'1px solid '+PEAR_LT, borderRadius:999, padding:'10px 18px'}}>
              <span style={{width:9, height:9, borderRadius:5, background:PEAR}}/>
              <span style={{fontSize:19, fontWeight:600, color:PEAR_DK}}>真实产品录屏 · live screen recording</span>
            </div>
          </div>
          <div style={{position:'absolute', right:96, top:288, width:1010, height:640, display:'flex', alignItems:'center', justifyContent:'flex-end'}}>
            <BrowserFrame src={d.src} w={d.w} h={d.h} url={d.url}/>
          </div>
        </FadeUp>
      </Sprite>
    ))}
  </React.Fragment>;
}

// ════════════════ ACT 4 — data dashboard w/ charts (44.7–53.9) ════════════════
function DataCard({start, end, children}){
  return <Sprite start={start} end={end}>
    <Pop dur={0.5}>
      <div style={{height:296, borderRadius:R16, background:CARD_BG, boxShadow:SHADOW, border:'1px solid '+LINE, padding:'30px 34px', display:'flex', flexDirection:'column', fontFamily:SANS, position:'relative', overflow:'hidden'}}>
        {children}
      </div>
    </Pop>
  </Sprite>;
}
function CardLabel({children}){ return <div style={{marginTop:'auto', fontSize:21, color:GRAY, lineHeight:1.4, textWrap:'pretty'}}>{children}</div>; }

function CodeBars(){
  const {localTime}=useSprite();
  const ws=[1,0.7,0.86,0.55,0.78,0.62];
  return <div style={{display:'flex', flexDirection:'column', gap:9, marginTop:8}}>
    {ws.map((w,i)=>{ const p=Easing.easeOutCubic(clamp((localTime-0.35-i*0.07)/0.6,0,1)); return <div key={i} style={{height:9, borderRadius:5, background:i%2?'#dbe7c4':PEAR_SOFT, width:(w*100*p)+'%'}}/>; })}
  </div>;
}
function HubDots(){
  const {localTime}=useSprite();
  return <div style={{display:'flex', alignItems:'center', gap:9, marginTop:16}}>
    {Array.from({length:7}).map((_,i)=>{ const p=clamp(Easing.easeOutBack(clamp((localTime-0.5-i*0.08)/0.4,0,1)),0,1); return <div key={i} style={{width:26, height:26, borderRadius:8, background:PEAR_SOFT, border:'1.5px solid '+PEAR_LT, opacity:clamp((localTime-0.5-i*0.08)/0.2,0,1), transform:'scale('+p+')'}}/>; })}
  </div>;
}
function RoiBars(){
  const {localTime}=useSprite();
  const items=[{l:'行业低',v:0.2,c:'#d9d6ce'},{l:'行业高',v:0.3,c:GRAY_LT},{l:'Pear',v:0.39,c:PEAR}];
  const maxV=0.46, hMax=104;
  return <div style={{display:'flex', alignItems:'flex-end', gap:24, marginTop:10}}>
    {items.map((it,i)=>{ const p=Easing.easeOutCubic(clamp((localTime-0.4-i*0.12)/0.7,0,1)); return <div key={i} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:8}}>
      <div style={{width:56, height:(it.v/maxV)*hMax*p, borderRadius:'7px 7px 0 0', background:it.c}}/>
      <span style={{fontSize:16, color:GRAY}}>{it.l}</span>
    </div>; })}
  </div>;
}
function PearRow(){
  const {localTime}=useSprite();
  return <div style={{display:'flex', gap:3, marginTop:14, flexWrap:'wrap'}}>
    {Array.from({length:12}).map((_,i)=>{ const p=clamp((localTime-0.5-i*0.05)/0.3,0,1); return <span key={i} style={{fontSize:26, opacity:p, transform:'scale('+Easing.easeOutBack(p)+')'}}>🍐</span>; })}
  </div>;
}

function Act4(){
  const end=62.1;
  return <React.Fragment>
    <Sprite start={52.9} end={end}><SectionTag index="04" label="数字背书"/></Sprite>
    <Sprite start={53.1} end={end}>
      <div style={{position:'absolute', top:150, left:96, fontFamily:SANS}}>
        <FadeUp rise={18}><div style={{fontSize:56, fontWeight:700, color:INK, letterSpacing:'-0.02em'}}>用<Hi>数字</Hi>说话</div></FadeUp>
      </div>
    </Sprite>

    <div style={{position:'absolute', left:96, right:96, top:248, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gridAutoRows:'296px', gap:26}}>
      <DataCard start={53.2} end={end}>
        <div style={{display:'flex', alignItems:'baseline', gap:8}}>
          <span style={{fontSize:84, fontWeight:800, color:PEAR, letterSpacing:'-0.03em', lineHeight:0.95}}><Counter to={22} dur={1.3}/></span>
          <span style={{fontSize:30, fontWeight:600, color:PEAR_DK}}>万行</span>
        </div>
        <CodeBars/>
        <CardLabel>TypeScript · 单人从 0 搭建并运维</CardLabel>
      </DataCard>

      <DataCard start={53.5} end={end}>
        <div style={{display:'flex', alignItems:'baseline', gap:10}}>
          <span style={{fontSize:84, fontWeight:800, color:PEAR, lineHeight:0.95}}><Counter to={1} dur={0.6}/></span>
          <span style={{fontSize:24, color:GRAY, fontWeight:600}}>Agent</span>
          <span style={{fontSize:46, color:GRAY_LT, fontWeight:300, margin:'0 4px'}}>+</span>
          <span style={{fontSize:84, fontWeight:800, color:PEAR, lineHeight:0.95}}><Counter to={7} dur={1.0} delay={0.3}/></span>
          <span style={{fontSize:24, color:GRAY, fontWeight:600}}>工具</span>
        </div>
        <HubDots/>
        <CardLabel>1 私域 Agent + 7 生产工具 · 覆盖全链路</CardLabel>
      </DataCard>

      <DataCard start={53.8} end={end}>
        <div style={{display:'flex', alignItems:'center', gap:28}}>
          <Donut pct={56} size={138} stroke={15} delay={0.2}>
            <span style={{fontSize:30, fontWeight:800, color:PEAR}}><Counter to={56} dur={1.1} delay={0.2} suffix="%"/></span>
            <span style={{fontSize:14, color:GRAY}}>纳入率</span>
          </Donut>
          <div>
            <div style={{display:'flex', alignItems:'baseline', gap:6}}><span style={{fontSize:62, fontWeight:800, color:INK, lineHeight:0.95}}><Counter to={48} dur={1.2}/></span><span style={{fontSize:26, color:GRAY}}>人</span></div>
            <div style={{fontSize:20, color:GRAY_LT, marginTop:6}}>部门内部规模</div>
          </div>
        </div>
        <CardLabel>超半数纳入日常工作流</CardLabel>
      </DataCard>

      <DataCard start={54.1} end={end}>
        <div style={{display:'flex', alignItems:'center', gap:28}}>
          <Donut pct={80} size={138} stroke={15} delay={0.2}>
            <span style={{fontSize:30, fontWeight:800, color:PEAR}}><Counter to={80} dur={1.1} delay={0.2} suffix="%"/></span>
            <span style={{fontSize:14, color:GRAY}}>复用率</span>
          </Donut>
          <div>
            <div style={{display:'flex', alignItems:'baseline', gap:6}}><span style={{fontSize:62, fontWeight:800, color:INK, lineHeight:0.95}}><Counter to={4} dur={1.0}/></span><span style={{fontSize:26, color:GRAY}}>部门</span></div>
            <div style={{fontSize:20, color:GRAY_LT, marginTop:6}}>能力外溢 · 65 人在用</div>
          </div>
        </div>
        <CardLabel>工具复用率 80%+，跨部门复制</CardLabel>
      </DataCard>

      <DataCard start={54.4} end={end}>
        <div style={{display:'flex', alignItems:'baseline', gap:8}}>
          <span style={{fontSize:74, fontWeight:800, color:PEAR, lineHeight:0.95}}><Counter to={0.39} decimals={2} dur={1.3}/></span>
          <span style={{fontSize:26, fontWeight:600, color:PEAR_DK}}>h/$</span>
        </div>
        <RoiBars/>
        <CardLabel>ROI · 优于 2026 企业 AI 均值 0.2–0.3</CardLabel>
      </DataCard>

      <DataCard start={54.7} end={end}>
        <div style={{display:'flex', alignItems:'baseline', gap:4}}>
          <span style={{fontSize:84, fontWeight:800, color:PEAR, lineHeight:0.95}}><Counter to={200} dur={1.3}/></span>
          <span style={{fontSize:60, fontWeight:800, color:PEAR}}>+</span>
          <span style={{fontSize:26, color:GRAY, marginLeft:6}}>人</span>
        </div>
        <PearRow/>
        <CardLabel>全公司公开课现场 · 会后多部门主动洽谈</CardLabel>
      </DataCard>
    </div>

    <Sprite start={59.0} end={end}>
      <div style={{position:'absolute', left:96, right:96, bottom:54, fontFamily:SANS}}>
        <FadeUp rise={22}>
          <div style={{display:'flex', alignItems:'center', gap:22}}>
            <span style={{width:6, height:54, background:PEAR, borderRadius:3, flex:'0 0 auto'}}/>
            <div style={{fontSize:46, fontWeight:700, color:INK, letterSpacing:'-0.02em'}}>一个人，<Hi>22 万行代码</Hi>，从 0 到<Hi>全公司在用</Hi>。</div>
          </div>
        </FadeUp>
      </div>
    </Sprite>
  </React.Fragment>;
}

// ════════════════ ACT 5 — methodology + live quadrant (56.1–66.3) ════════════════
function Quadrant(){
  const {localTime}=useSprite();
  const p=Easing.easeOutCubic(clamp(localTime/0.9,0,1));
  const flow=Easing.easeInOutCubic(clamp((localTime-0.9)/1.6,0,1));
  const cell=(bg, border, c1, t1, c2, t2)=>({borderRadius:16, background:bg, border:border, padding:24, display:'flex', flexDirection:'column', justifyContent:'space-between'});
  const dots=[{tx:60,ty:54},{tx:120,ty:92},{tx:92,ty:140},{tx:158,ty:60},{tx:54,ty:108},{tx:140,ty:132},{tx:100,ty:96}];
  const cx=262, cy=232;
  return <div style={{width:524, height:444, position:'relative', fontFamily:SANS, opacity:p, transform:'translateY('+((1-p)*24)+'px)'}}>
    <div style={{position:'absolute', inset:0, display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr', gap:16}}>
      <div style={{borderRadius:16, background:PEAR, color:'#fff', padding:24, display:'flex', flexDirection:'column', justifyContent:'space-between', boxShadow:'0 18px 40px -22px rgba(101,163,13,0.6)'}}>
        <span style={{fontSize:20, opacity:0.85}}>高重复 · 低创意</span>
        <span style={{fontSize:34, fontWeight:700}}>交给 Agent</span>
      </div>
      <div style={{borderRadius:16, background:CARD_BG, border:'1.5px dashed '+LINE, padding:24, display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
        <span style={{fontSize:20, color:GRAY_LT}}>高重复 · 高创意</span>
        <span style={{fontSize:26, fontWeight:600, color:GRAY}}>辅助 + 模板</span>
      </div>
      <div style={{borderRadius:16, background:CARD_BG, border:'1.5px dashed '+LINE, padding:24, display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
        <span style={{fontSize:20, color:GRAY_LT}}>低重复 · 低创意</span>
        <span style={{fontSize:26, fontWeight:600, color:GRAY}}>按需自动化</span>
      </div>
      <div style={{borderRadius:16, background:INK, color:'#fff', padding:24, display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
        <span style={{fontSize:20, opacity:0.7}}>低重复 · 高创意</span>
        <span style={{fontSize:34, fontWeight:700}}>人在回路</span>
      </div>
    </div>
    {dots.map((d,i)=>{ const x=cx+(d.tx-cx)*flow; const y=cy+(d.ty-cy)*flow; return <div key={i} style={{position:'absolute', left:x, top:y, fontSize:20, opacity:clamp(flow*1.4-0.1,0,1), transform:'rotate('+(flow*30)+'deg)', willChange:'transform'}}>🍐</div>; })}
    <div style={{position:'absolute', left:-46, top:0, bottom:0, display:'flex', alignItems:'center'}}><span style={{transform:'rotate(-90deg)', whiteSpace:'nowrap', fontSize:18, fontWeight:600, color:GRAY_LT, letterSpacing:'0.04em'}}>创意度 →</span></div>
    <div style={{position:'absolute', left:0, right:0, bottom:-38, textAlign:'center', fontSize:18, fontWeight:600, color:GRAY_LT, letterSpacing:'0.04em'}}>重复度 →</div>
  </div>;
}

function Act5(){
  const end=70.6;
  return <React.Fragment>
    <Sprite start={62.4} end={end}><SectionTag index="05" label="方法论"/></Sprite>
    <Sprite start={62.6} end={end}>
      <div style={{position:'absolute', top:150, left:96, right:96, fontFamily:SANS}}>
        <FadeUp rise={18}><div style={{fontSize:56, fontWeight:700, color:INK, letterSpacing:'-0.02em'}}>这不止是工具，是一套<Hi>方法</Hi>。</div></FadeUp>
      </div>
    </Sprite>

    <Sprite start={63.2} end={end}>
      <div style={{position:'absolute', left:150, top:286, fontFamily:SANS, fontSize:22, fontWeight:600, color:GRAY}}>Agent 适用性象限 · 重复度 × 创意度</div>
      <div style={{position:'absolute', left:150, top:330}}><Quadrant/></div>
    </Sprite>

    <div style={{position:'absolute', left:820, right:120, top:300, display:'flex', flexDirection:'column', gap:26}}>
      <Sprite start={64.0} end={end}>
        <FadeUp rise={24}>
          <div style={{borderRadius:R16, background:CARD_BG, boxShadow:SHADOW, border:'1px solid '+LINE, padding:'30px 34px', fontFamily:SANS}}>
            <div style={{fontSize:22, fontWeight:600, color:PEAR, marginBottom:8}}>用户观测 → 处方</div>
            <div style={{fontSize:32, fontWeight:700, color:INK, lineHeight:1.35}}>Hook 阶段 <Hi>52% 流失</Hi> → 候选改「3 选 1」</div>
            <div style={{marginTop:16, height:12, borderRadius:6, background:PAPER, overflow:'hidden'}}>
              <FlowBar/>
            </div>
            <div style={{fontSize:21, color:GRAY, marginTop:14, lineHeight:1.45}}>高创意的 Hook 不让 AI 直接替写，合并生成阶段、减少等待。</div>
          </div>
        </FadeUp>
      </Sprite>
      <Sprite start={65.2} end={end}>
        <FadeUp rise={24}>
          <div style={{borderRadius:R16, background:CARD_BG, boxShadow:SHADOW, border:'1px solid '+LINE, padding:'30px 34px', fontFamily:SANS}}>
            <div style={{fontSize:22, fontWeight:600, color:PEAR, marginBottom:14}}>治理制度</div>
            <div style={{display:'flex', alignItems:'center', gap:12, flexWrap:'wrap'}}>
              {['事故','规则','测试','门禁'].map((s,i)=>(
                <React.Fragment key={s}>
                  <span style={{fontSize:26, fontWeight:700, color:INK, background:PAPER, borderRadius:12, padding:'10px 20px'}}>{s}</span>
                  {i<3 && <span style={{color:PEAR, fontSize:22}}>→</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </FadeUp>
      </Sprite>
    </div>

    <Sprite start={67.8} end={end}>
      <div style={{position:'absolute', left:96, right:96, bottom:64, fontFamily:SANS}}>
        <FadeUp rise={20}>
          <div style={{display:'flex', alignItems:'center', gap:22}}>
            <span style={{width:6, height:52, background:PEAR, borderRadius:3}}/>
            <div style={{fontSize:44, fontWeight:700, color:INK, letterSpacing:'-0.02em'}}>把踩过的坑，变成<Hi>不会再踩的规则</Hi>。</div>
          </div>
        </FadeUp>
      </div>
    </Sprite>
  </React.Fragment>;
}

// animated fill for the insight bar (width tween 0 → 52%)
function FlowBar(){
  const {localTime}=useSprite();
  const p=Easing.easeOutCubic(clamp((localTime-0.3)/0.9,0,1));
  return <div style={{height:'100%', width:(p*100)+'%', background:PEAR, borderRadius:6}}/>;
}

// ════════════════ CLOSING (66.5–68) ════════════════
function Closing(){
  return <Sprite start={70.8} end={72.7}>
    <Full style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
      <FadeUp rise={20} eout={0.2}>
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:28, fontFamily:SANS}}>
          <Pop dur={0.6}><Pear size={160} bob={7}/></Pop>
          <div style={{fontSize:64, fontWeight:800, letterSpacing:'-0.02em', color:CREAM}}>Pear <span style={{color:PEAR_BRIGHT}}>Agent</span></div>
          <div style={{fontSize:50, fontWeight:600, color:CREAM, letterSpacing:'-0.01em'}}>把团队的时间，还给团队。</div>
          <div style={{fontSize:26, fontStyle:'italic', color:GRAY_LT}}>From idea to post, in one workspace.</div>
        </div>
      </FadeUp>
    </Full>
  </Sprite>;
}

function PearMovie(){
  return <Stage width={W} height={H} duration={DUR} background={NIGHT} persistKey="pearmovie">
    <Background/>
    <FloatingPears/>
    <Act1/>
    <Act2/>
    <WorkspaceMock/>
    <Act3Map/>
    <RealDemo/>
    <Act4/>
    <Act5/>
    <Closing/>
  </Stage>;
}

window.PearMovie = PearMovie;
