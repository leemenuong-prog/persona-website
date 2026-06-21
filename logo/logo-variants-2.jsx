// I.AM logo variants — round 2: unconstrained explorations
const INK2 = '#0B0A08';
const BLUE2 = '#1748C4';

function rs(list, fill) {
  return list.map((b, i) =>
    <rect key={i} x={b[0]} y={b[1]} width={b[2]} height={b[3]} fill={b[4] || fill} />
  );
}

// V7 — Block wordmark: stencil-cut I.AM letterforms
function LogoBlockword({ color = INK2, blue = BLUE2 }) {
  const r = [
    [0, 0, 30, 120],                                            // I
    [92, 0, 26, 120], [162, 0, 26, 120], [118, 0, 44, 26], [118, 56, 44, 26], // A
    [208, 0, 26, 120], [302, 0, 26, 120], [234, 0, 68, 26], [251, 26, 26, 46], // M
  ];
  return (
    <svg viewBox="0 0 328 122" xmlns="http://www.w3.org/2000/svg">
      {rs(r, color)}
      <rect x="46" y="94" width="26" height="26" fill={blue} />
    </svg>
  );
}

// V8 — The Self: one black field, one blue self
function LogoField({ color = INK2, blue = BLUE2, light = '#F2EFE8' }) {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="200" height="200" fill={color} />
      <rect x="24" y="124" width="52" height="52" fill={light} />
      <rect x="32" y="132" width="36" height="36" fill={blue} />
    </svg>
  );
}

// V9 — Pixel "i." monogram: blue dot, black stem, black period
function LogoPixelI({ color = INK2, blue = BLUE2 }) {
  return (
    <svg viewBox="0 0 96 182" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="44" height="44" fill={blue} />
      <rect x="0" y="60" width="44" height="120" fill={color} />
      <rect x="64" y="152" width="28" height="28" fill={color} />
    </svg>
  );
}

// V10 — Sun of bars: stripes bounded by a circle, blue self at center
function LogoSun({ color = INK2, blue = BLUE2 }) {
  const ds = [-88, -66, -44, -22, 0, 22, 44, 66, 88];
  const r = ds.map((d) => {
    const h = Math.round(2 * Math.sqrt(8100 - d * d));
    return [95 + d - 7, 95 - h / 2, 14, h, d === 0 ? blue : color];
  });
  return (
    <svg viewBox="0 0 190 190" xmlns="http://www.w3.org/2000/svg">{rs(r, color)}</svg>
  );
}

// V11 — Forward lean: the rhythm bars, italicized
function LogoLean({ color = INK2, blue = BLUE2 }) {
  const hs = [152, 108, 162, 98, 140, 76, 118, 128, 158, 104, 134];
  const r = hs.map((h, i) => [78 + i * 43, 180 - h, 30, h]);
  return (
    <svg viewBox="0 0 610 200" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(26,0) skewX(-8)">
        <rect x="0" y="122" width="58" height="58" fill={blue} />
        {rs(r, color)}
        <rect x="552" y="162" width="18" height="18" fill={blue} />
      </g>
    </svg>
  );
}

// V12 — Badge: bars inside a square frame
function LogoBadge({ color = INK2, blue = BLUE2 }) {
  const r = [[46, 70, 20, 70], [78, 96, 20, 44], [110, 52, 20, 88]];
  return (
    <svg viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
      <rect x="9" y="9" width="162" height="162" fill="none" stroke={color} strokeWidth="18" />
      {rs(r, color)}
      <rect x="140" y="126" width="14" height="14" fill={blue} />
    </svg>
  );
}

// V13 — Pulse: a square heartbeat — proof of being alive
function LogoPulse({ color = INK2, blue = BLUE2 }) {
  return (
    <svg viewBox="0 0 322 170" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 120 H50 V36 H92 V120 H150 V78 H192 V120 H258"
        fill="none" stroke={color} strokeWidth="18" strokeLinecap="square" />
      <rect x="284" y="109" width="22" height="22" fill={blue} />
    </svg>
  );
}

// V14 — .IAM. — 01 × 06 combined: twin blue periods + skyline letters
function LogoIAM({ color = INK2, blue = BLUE2 }) {
  const seq = [[78, 164], [142, 112], [185, 168], [228, 112], [292, 168], [335, 118], [378, 118], [421, 168]];
  const r = seq.map(([x, h]) => [x, 180 - h, 30, h]);
  return (
    <svg viewBox="0 0 490 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="122" width="58" height="58" fill={blue} />
      {rs(r, color)}
      <rect x="467" y="162" width="18" height="18" fill={blue} />
    </svg>
  );
}

Object.assign(window, { LogoBlockword, LogoField, LogoPixelI, LogoSun, LogoLean, LogoBadge, LogoPulse, LogoIAM });
