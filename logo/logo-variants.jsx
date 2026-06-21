// I.AM logo variants — bar/stripe explorations
const INK = '#0B0A08';
const BLUE = '#1748C4';

function bars(list, fill) {
  return list.map((b, i) =>
    <rect key={i} x={b[0]} y={b[1]} width={b[2]} height={b[3]} fill={b[4] || fill} />
  );
}

// V1 — Refined rhythm (faithful cleanup of the sketch)
function LogoRhythm({ color = INK, blue = BLUE }) {
  const hs = [152, 108, 162, 98, 140, 76, 118, 128, 158, 104, 134];
  const rects = hs.map((h, i) => [78 + i * 43, 180 - h, 30, h]);
  return (
    <svg viewBox="0 0 580 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="122" width="58" height="58" fill={blue} />
      {bars(rects, color)}
      <rect x="552" y="162" width="18" height="18" fill={blue} />
    </svg>
  );
}

// V2 — Stencil letterforms: bars literally spell I.AM
function LogoStencil({ color = INK, blue = BLUE }) {
  const W = 26, R = 32;
  const seg = (x, r0, span) => [x, r0 * R, W, span * R];
  const rects = [
    seg(0, 0, 5),                       // I
    seg(96, 1, 4), seg(132, 0, 1), seg(132, 2, 1), seg(168, 1, 4),  // A
    seg(216, 0, 5), seg(252, 1, 1), seg(288, 2, 1), seg(324, 1, 1), seg(360, 0, 5), // M
  ];
  return (
    <svg viewBox="0 0 386 162" xmlns="http://www.w3.org/2000/svg">
      {bars(rects, color)}
      <rect x="48" y="134" width="26" height="26" fill={blue} />
    </svg>
  );
}

// V3 — Morse code: I = ·· A = ·− M = −− (hidden meaning)
function LogoMorse({ color = INK, blue = BLUE }) {
  const s = 64, t = 152, B = 150;
  const seq = [[0, s], [42, s], [170, s], [212, t], [276, t], [318, t]];
  const rects = seq.map(([x, h]) => [x, B - h, 30, h]);
  return (
    <svg viewBox="0 0 350 160" xmlns="http://www.w3.org/2000/svg">
      {bars(rects, color)}
      <rect x="106" y="120" width="30" height="30" fill={blue} />
    </svg>
  );
}

// V4 — Voiceprint: saying "I am", mirrored about the center line
function LogoVoice({ color = INK, blue = BLUE }) {
  const hs = [36, 76, 120, 150, 96, 132, 64, 144, 108, 52];
  const rects = hs.map((h, i) => [i * 29, 80 - h / 2, 18, h]);
  return (
    <svg viewBox="0 0 330 160" xmlns="http://www.w3.org/2000/svg">
      {bars(rects, color)}
      <rect x="301" y="71" width="18" height="18" fill={blue} />
    </svg>
  );
}

// V5 — App-icon tile: inverse stripes in a black square
function LogoTile({ color = INK, blue = BLUE, light = '#F4F1EA' }) {
  const hs = [88, 56, 100, 40, 72];
  const rects = hs.map((h, i) => [36 + i * 23, 156 - h, 14, h]);
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="200" height="200" rx="44" fill={color} />
      {bars(rects, light)}
      <rect x="151" y="142" width="14" height="14" fill={blue} />
    </svg>
  );
}

// V6 — Skyline: I · then A-peak and M-peaks read as silhouettes
function LogoSkyline({ color = INK, blue = BLUE }) {
  const seq = [[0, 160], [92, 112], [138, 168], [184, 112], [242, 168], [288, 118], [334, 118], [380, 168]];
  const rects = seq.map(([x, h]) => [x, 170 - h, 34, h]);
  return (
    <svg viewBox="0 0 414 180" xmlns="http://www.w3.org/2000/svg">
      {bars(rects, color)}
      <rect x="48" y="150" width="20" height="20" fill={blue} />
    </svg>
  );
}

Object.assign(window, { LogoRhythm, LogoStencil, LogoMorse, LogoVoice, LogoTile, LogoSkyline });
