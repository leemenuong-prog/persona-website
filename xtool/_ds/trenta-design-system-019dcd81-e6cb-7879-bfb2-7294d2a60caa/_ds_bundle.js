/* @ds-bundle: {"format":3,"namespace":"TrentaDesignSystem_019dcd","components":[],"sourceHashes":{"ui_kits/app/components.jsx":"a8e44ac431ad","ui_kits/app/ios-frame.jsx":"d67eb3ffe562","ui_kits/kiosk/components.jsx":"3247fb1967bc","ui_kits/website/components.jsx":"2c045a084e38"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.TrentaDesignSystem_019dcd = window.TrentaDesignSystem_019dcd || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/app/components.jsx
try { (() => {
// Trenta app components
const APP_FEATURED = [{
  zh: '奶酪黑椒意面',
  en: 'Cacio e Pepe',
  price: 38,
  img: '../../assets/imagery/placeholder-pasta.svg'
}, {
  zh: '青酱手擀',
  en: 'Trofie al Pesto',
  price: 42,
  img: '../../assets/imagery/placeholder-herbs.svg'
}, {
  zh: '番茄罗勒',
  en: 'Pomodoro e Basilico',
  price: 36,
  img: '../../assets/imagery/placeholder-ingredients.svg'
}, {
  zh: '海鲜意面',
  en: 'Frutti di Mare',
  price: 58,
  img: '../../assets/imagery/placeholder-hero-dark.svg'
}];
function AppBar() {
  return /*#__PURE__*/React.createElement("div", {
    className: "app-bar"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "greet"
  }, "buonasera"), /*#__PURE__*/React.createElement("div", {
    className: "name"
  }, "\u6797\u5B89\uFF0C\u665A\u4E0A\u597D")), /*#__PURE__*/React.createElement("div", {
    className: "avatar"
  }, "\u6797"));
}
function AppHero() {
  return /*#__PURE__*/React.createElement("div", {
    className: "app-hero"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/imagery/placeholder-pasta.svg",
    alt: ""
  }), /*#__PURE__*/React.createElement("div", {
    className: "protect"
  }), /*#__PURE__*/React.createElement("div", {
    className: "copy"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "\u4ECA\u65E5\u65B0\u9C9C \xB7 TODAY"), /*#__PURE__*/React.createElement("div", {
    className: "h"
  }, "\u624B\u64C0\u86E4\u870A\u9762"), /*#__PURE__*/React.createElement("div", {
    className: "it"
  }, "Linguine alle Vongole \u2014 until 21:30")));
}
function LoyaltyCard() {
  return /*#__PURE__*/React.createElement("div", {
    className: "loyalty"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "loyalty-stamps"
  }, [1, 2, 3, 4, 5, 6, 7, 8].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: 'stamp' + (i <= 5 ? ' filled' : '')
  }))), /*#__PURE__*/React.createElement("div", {
    className: "loyalty-text",
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("strong", null, "\u518D 3 \u4EFD\u610F\u9762\uFF0C\u514D\u8D39\u9001\u4E00\u4EFD"), "3 more pasta to a free dish")));
}
function SectionHeader({
  zh,
  en
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sec-h"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "t"
  }, zh), en && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 13,
      color: 'var(--fg-3)',
      marginTop: 2
    }
  }, en)), /*#__PURE__*/React.createElement("div", {
    className: "more"
  }, "\u67E5\u770B\u5168\u90E8 \u2192"));
}
function FeaturedRow({
  onOpen
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "h-row"
  }, APP_FEATURED.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "h-card",
    onClick: () => onOpen(it)
  }, /*#__PURE__*/React.createElement("div", {
    className: "hi-img"
  }, /*#__PURE__*/React.createElement("img", {
    src: it.img,
    alt: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "hi-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "zh"
  }, it.zh), /*#__PURE__*/React.createElement("div", {
    className: "en"
  }, it.en), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "price"
  }, "\xA5", it.price), /*#__PURE__*/React.createElement("button", {
    className: "add",
    onClick: e => {
      e.stopPropagation();
      onOpen(it);
    }
  }, "+"))))));
}
function TabBar({
  active,
  onChange
}) {
  const tabs = [{
    id: 'home',
    label: '首页',
    icon: 'M3 12L12 3l9 9 M5 10v10h14V10'
  }, {
    id: 'menu',
    label: '菜单',
    icon: 'M4 6h16 M4 12h16 M4 18h10'
  }, {
    id: 'orders',
    label: '订单',
    icon: 'M9 4h6l1 4H8z M5 8h14l-1 12H6z'
  }, {
    id: 'me',
    label: '我的',
    icon: 'M12 12a4 4 0 100-8 4 4 0 000 8z M4 20c0-4 4-6 8-6s8 2 8 6'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "tab-bar"
  }, tabs.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: 'tab' + (active === t.id ? ' active' : ''),
    onClick: () => onChange(t.id)
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: t.icon
  })), t.label)));
}
function CartPill({
  count,
  total
}) {
  if (count === 0) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "cart-pill"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, count), /*#__PURE__*/React.createElement("span", null, "\u67E5\u770B\u8BA2\u5355"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)'
    }
  }, "\xA5", total));
}
function DetailScreen({
  item,
  onBack,
  onAdd
}) {
  const [shape, setShape] = React.useState('Tonnarelli');
  const [spice, setSpice] = React.useState('原味');
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "detail-img"
  }, /*#__PURE__*/React.createElement("img", {
    src: item.img,
    alt: ""
  }), /*#__PURE__*/React.createElement("div", {
    className: "detail-back",
    onClick: onBack
  }, "\u2190")), /*#__PURE__*/React.createElement("div", {
    className: "detail-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "detail-zh"
  }, item.zh), /*#__PURE__*/React.createElement("div", {
    className: "detail-en"
  }, item.en), /*#__PURE__*/React.createElement("div", {
    className: "detail-tags"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tg"
  }, "\u542B\u9EB8\u8D28"), /*#__PURE__*/React.createElement("span", {
    className: "tg"
  }, "\u542B\u4E73\u5236\u54C1"), /*#__PURE__*/React.createElement("span", {
    className: "tg"
  }, "~ 18 \u5206\u949F")), /*#__PURE__*/React.createElement("div", {
    className: "detail-desc"
  }, "\u7F57\u9A6C\u7ECF\u5178\u505A\u6CD5\u3002\u4F69\u79D1\u91CC\u8BFA\u7F8A\u4E73\u916A + \u73B0\u78E8\u9ED1\u80E1\u6912 + \u624B\u64C0 tonnarelli \u7C97\u9762\u3002\u7B80\u5355\uFF0C\u4F46\u9700\u8981\u8010\u5FC3\u3002"), /*#__PURE__*/React.createElement("div", {
    className: "detail-h"
  }, "\u9762\u578B \xB7 Shape"), /*#__PURE__*/React.createElement("div", {
    className: "detail-opts"
  }, ['Tonnarelli', 'Rigatoni', 'Fusilli'].map(s => /*#__PURE__*/React.createElement("span", {
    key: s,
    className: 'detail-opt' + (shape === s ? ' active' : ''),
    onClick: () => setShape(s)
  }, s))), /*#__PURE__*/React.createElement("div", {
    className: "detail-h"
  }, "\u8FA3\u5EA6 \xB7 Spice"), /*#__PURE__*/React.createElement("div", {
    className: "detail-opts"
  }, ['原味', '微辣', '特辣'].map(s => /*#__PURE__*/React.createElement("span", {
    key: s,
    className: 'detail-opt' + (spice === s ? ' active' : ''),
    onClick: () => setSpice(s)
  }, s)))), /*#__PURE__*/React.createElement("button", {
    className: "detail-cta",
    onClick: () => onAdd(item)
  }, "\u52A0\u5165\u8BA2\u5355 \xB7 \xA5", item.price));
}
Object.assign(window, {
  APP_FEATURED,
  AppBar,
  AppHero,
  LoyaltyCard,
  SectionHeader,
  FeaturedRow,
  TabBar,
  CartPill,
  DetailScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/components.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/ios-frame.jsx
try { (() => {
// iOS.jsx — Simplified iOS 26 (Liquid Glass) device frame
// Based on the iOS 26 UI Kit + Figma status bar spec. No assets, no deps.
// Exports: IOSDevice, IOSStatusBar, IOSNavBar, IOSGlassPill, IOSList, IOSListRow, IOSKeyboard

// ─────────────────────────────────────────────────────────────
// Status bar
// ─────────────────────────────────────────────────────────────
function IOSStatusBar({
  dark = false,
  time = '9:41'
}) {
  const c = dark ? '#fff' : '#000';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 154,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '21px 24px 19px',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 20,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 1.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '-apple-system, "SF Pro", system-ui',
      fontWeight: 590,
      fontSize: 17,
      lineHeight: '22px',
      color: c
    }
  }, time)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      paddingTop: 1,
      paddingRight: 1
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "12",
    viewBox: "0 0 19 12"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "7.5",
    width: "3.2",
    height: "4.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4.8",
    y: "5",
    width: "3.2",
    height: "7",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "9.6",
    y: "2.5",
    width: "3.2",
    height: "9.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14.4",
    y: "0",
    width: "3.2",
    height: "12",
    rx: "0.7",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "12",
    viewBox: "0 0 17 12"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z",
    fill: c
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8.5",
    cy: "10.5",
    r: "1.5",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "27",
    height: "13",
    viewBox: "0 0 27 13"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0.5",
    y: "0.5",
    width: "23",
    height: "12",
    rx: "3.5",
    stroke: c,
    strokeOpacity: "0.35",
    fill: "none"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "20",
    height: "9",
    rx: "2",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z",
    fill: c,
    fillOpacity: "0.4"
  }))));
}

// ─────────────────────────────────────────────────────────────
// Liquid glass pill — blur + tint + shine
// ─────────────────────────────────────────────────────────────
function IOSGlassPill({
  children,
  dark = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      minWidth: 44,
      borderRadius: 9999,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: dark ? '0 2px 6px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.07), 0 3px 10px rgba(0,0,0,0.06)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.28)' : 'rgba(255,255,255,0.5)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15), inset -1px -1px 1px rgba(255,255,255,0.08)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      padding: '0 4px'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Navigation bar — glass pills + large title
// ─────────────────────────────────────────────────────────────
function IOSNavBar({
  title = 'Title',
  dark = false,
  trailingIcon = true
}) {
  const muted = dark ? 'rgba(255,255,255,0.6)' : '#404040';
  const text = dark ? '#fff' : '#000';
  const pillIcon = content => /*#__PURE__*/React.createElement(IOSGlassPill, {
    dark: dark
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, content));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      paddingTop: 62,
      paddingBottom: 10,
      position: 'relative',
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px'
    }
  }, pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "20",
    viewBox: "0 0 12 20",
    fill: "none",
    style: {
      marginLeft: -1
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 2L2 10l8 8",
    stroke: muted,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), trailingIcon && pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "6",
    viewBox: "0 0 22 6"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "3",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "19",
    cy: "3",
    r: "2.5",
    fill: muted
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      fontFamily: '-apple-system, system-ui',
      fontSize: 34,
      fontWeight: 700,
      lineHeight: '41px',
      color: text,
      letterSpacing: 0.4
    }
  }, title));
}

// ─────────────────────────────────────────────────────────────
// Grouped list (inset card, r:26) + row (52px)
// ─────────────────────────────────────────────────────────────
function IOSListRow({
  title,
  detail,
  icon,
  chevron = true,
  isLast = false,
  dark = false
}) {
  const text = dark ? '#fff' : '#000';
  const sec = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const ter = dark ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)';
  const sep = dark ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.12)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      minHeight: 52,
      padding: '0 16px',
      position: 'relative',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      letterSpacing: -0.43
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 7,
      background: icon,
      marginRight: 12,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      color: text
    }
  }, title), detail && /*#__PURE__*/React.createElement("span", {
    style: {
      color: sec,
      marginRight: 6
    }
  }, detail), chevron && /*#__PURE__*/React.createElement("svg", {
    width: "8",
    height: "14",
    viewBox: "0 0 8 14",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1l6 6-6 6",
    stroke: ter,
    strokeWidth: "2",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), !isLast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: icon ? 58 : 16,
      height: 0.5,
      background: sep
    }
  }));
}
function IOSList({
  header,
  children,
  dark = false
}) {
  const hc = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const bg = dark ? '#1C1C1E' : '#fff';
  return /*#__PURE__*/React.createElement("div", null, header && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '-apple-system, system-ui',
      fontSize: 13,
      color: hc,
      textTransform: 'uppercase',
      padding: '8px 36px 6px',
      letterSpacing: -0.08
    }
  }, header), /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      borderRadius: 26,
      margin: '0 16px',
      overflow: 'hidden'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Device frame
// ─────────────────────────────────────────────────────────────
function IOSDevice({
  children,
  width = 402,
  height = 874,
  dark = false,
  title,
  keyboard = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      borderRadius: 48,
      overflow: 'hidden',
      position: 'relative',
      background: dark ? '#000' : '#F2F2F7',
      boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
      fontFamily: '-apple-system, system-ui, sans-serif',
      WebkitFontSmoothing: 'antialiased'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 11,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 126,
      height: 37,
      borderRadius: 24,
      background: '#000',
      zIndex: 50
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement(IOSStatusBar, {
    dark: dark
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, title !== undefined && /*#__PURE__*/React.createElement(IOSNavBar, {
    title: title,
    dark: dark
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto'
    }
  }, children), keyboard && /*#__PURE__*/React.createElement(IOSKeyboard, {
    dark: dark
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 60,
      height: 34,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingBottom: 8,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 139,
      height: 5,
      borderRadius: 100,
      background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)'
    }
  })));
}

// ─────────────────────────────────────────────────────────────
// Keyboard — iOS 26 liquid glass
// ─────────────────────────────────────────────────────────────
function IOSKeyboard({
  dark = false
}) {
  const glyph = dark ? 'rgba(255,255,255,0.7)' : '#595959';
  const sugg = dark ? 'rgba(255,255,255,0.6)' : '#333';
  const keyBg = dark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.85)';

  // special-key icons
  const icons = {
    shift: /*#__PURE__*/React.createElement("svg", {
      width: "19",
      height: "17",
      viewBox: "0 0 19 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9.5 1L1 9.5h4.5V16h8V9.5H18L9.5 1z",
      fill: glyph
    })),
    del: /*#__PURE__*/React.createElement("svg", {
      width: "23",
      height: "17",
      viewBox: "0 0 23 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M7 1h13a2 2 0 012 2v11a2 2 0 01-2 2H7l-6-7.5L7 1z",
      fill: "none",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 5l7 7M17 5l-7 7",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinecap: "round"
    })),
    ret: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "14",
      viewBox: "0 0 20 14"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18 1v6H4m0 0l4-4M4 7l4 4",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }))
  };
  const key = (content, {
    w,
    flex,
    ret,
    fs = 25,
    k
  } = {}) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      height: 42,
      borderRadius: 8.5,
      flex: flex ? 1 : undefined,
      width: w,
      minWidth: 0,
      background: ret ? '#08f' : keyBg,
      boxShadow: '0 1px 0 rgba(0,0,0,0.075)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, "SF Compact", system-ui',
      fontSize: fs,
      fontWeight: 458,
      color: ret ? '#fff' : glyph
    }
  }, content);
  const row = (keys, pad = 0) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      justifyContent: 'center',
      padding: `0 ${pad}px`
    }
  }, keys.map(l => key(l, {
    flex: true,
    k: l
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 15,
      borderRadius: 27,
      overflow: 'hidden',
      padding: '11px 0 2px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: dark ? '0 -2px 20px rgba(0,0,0,0.09)' : '0 -1px 6px rgba(0,0,0,0.018), 0 -3px 20px rgba(0,0,0,0.012)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.14)' : 'rgba(255,255,255,0.25)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      padding: '8px 22px 13px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, ['"The"', 'the', 'to'].map((w, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 25,
      background: '#ccc',
      opacity: 0.3
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      color: sugg,
      letterSpacing: -0.43,
      lineHeight: '22px'
    }
  }, w)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 13,
      padding: '0 6.5px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, row(['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']), row(['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], 20), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14.25,
      alignItems: 'center'
    }
  }, key(icons.shift, {
    w: 45,
    k: 'shift'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      flex: 1
    }
  }, ['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(l => key(l, {
    flex: true,
    k: l
  }))), key(icons.del, {
    w: 45,
    k: 'del'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, key('ABC', {
    w: 92.25,
    fs: 18,
    k: 'abc'
  }), key('', {
    flex: true,
    k: 'space'
  }), key(icons.ret, {
    w: 92.25,
    ret: true,
    k: 'ret'
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 56,
      width: '100%',
      position: 'relative'
    }
  }));
}
Object.assign(window, {
  IOSDevice,
  IOSStatusBar,
  IOSNavBar,
  IOSGlassPill,
  IOSList,
  IOSListRow,
  IOSKeyboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/ios-frame.jsx", error: String((e && e.message) || e) }); }

// ui_kits/kiosk/components.jsx
try { (() => {
// Kiosk components — fast-casual pasta, 1080x1920 portrait
const {
  useState
} = React;
const PASTA_GLYPHS = {
  signature: '../../assets/illustrations/pasta/spaghetti.svg',
  classics: '../../assets/illustrations/pasta/rigatoni.svg',
  fresh: '../../assets/illustrations/pasta/tagliatelle.svg',
  baked: '../../assets/illustrations/pasta/conchiglie.svg',
  veg: '../../assets/illustrations/pasta/orecchiette.svg',
  drinks: '../../assets/illustrations/pasta/fusilli.svg'
};
const CATEGORIES = [{
  id: 'signature',
  zh: '招牌',
  en: 'Signature'
}, {
  id: 'classics',
  zh: '经典',
  en: 'Classici'
}, {
  id: 'fresh',
  zh: '今日鲜',
  en: 'Today'
}, {
  id: 'baked',
  zh: '焗烤',
  en: 'Al Forno'
}, {
  id: 'veg',
  zh: '素食',
  en: 'Vegetariano'
}, {
  id: 'drinks',
  zh: '饮品',
  en: 'Bevande'
}];
const MENU = [{
  id: 1,
  cat: 'signature',
  zh: '奶酪黑椒意面',
  en: 'Cacio e Pepe',
  price: 38,
  badge: {
    type: 'sig',
    label: '招牌'
  },
  img: '../../assets/imagery/placeholder-pasta.svg',
  desc: '罗马经典：佩科里诺羊乳酪、现磨黑胡椒，配手擀 tonnarelli 粗面。',
  shapes: ['tonnarelli', 'rigatoni', 'fusilli']
}, {
  id: 2,
  cat: 'signature',
  zh: '番茄罗勒手擀',
  en: 'Pomodoro e Basilico',
  price: 36,
  badge: {
    type: 'veg',
    label: '素'
  },
  img: '../../assets/imagery/placeholder-ingredients.svg',
  desc: 'San Marzano 番茄、新鲜罗勒、特级初榨橄榄油。',
  shapes: ['spaghetti', 'fusilli', 'orecchiette']
}, {
  id: 3,
  cat: 'classics',
  zh: '青酱手擀',
  en: 'Trofie al Pesto',
  price: 42,
  img: '../../assets/imagery/placeholder-herbs.svg',
  desc: '热那亚青酱：罗勒、松子、帕马森。配土豆和四季豆。',
  shapes: ['trofie', 'orecchiette']
}, {
  id: 4,
  cat: 'classics',
  zh: '蘑菇奶油宽面',
  en: 'Tagliatelle ai Funghi',
  price: 46,
  img: '../../assets/imagery/placeholder-pasta.svg',
  desc: '混合野菌、淡奶油、白葡萄酒、欧芹。',
  shapes: ['tagliatelle', 'pappardelle']
}, {
  id: 5,
  cat: 'fresh',
  zh: '海鲜意面',
  en: 'Frutti di Mare',
  price: 58,
  badge: {
    type: 'sig',
    label: '新'
  },
  img: '../../assets/imagery/placeholder-hero-dark.svg',
  desc: '蛤蜊、虾、墨鱼、樱桃番茄、白葡萄酒。',
  shapes: ['linguine', 'spaghetti']
}, {
  id: 6,
  cat: 'fresh',
  zh: '辣味烟肉面',
  en: "All'Amatriciana",
  price: 44,
  img: '../../assets/imagery/placeholder-pasta.svg',
  desc: 'Guanciale 烟肉、番茄、辣椒、佩科里诺。',
  shapes: ['bucatini', 'rigatoni']
}];
function KioskHeader() {
  return /*#__PURE__*/React.createElement("div", {
    className: "k-header"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/trenta-wordmark.svg",
    alt: "Trenta"
  }), /*#__PURE__*/React.createElement("div", {
    className: "k-lang"
  }, /*#__PURE__*/React.createElement("span", {
    className: "active"
  }, "\u4E2D\u6587"), /*#__PURE__*/React.createElement("span", null, "English")));
}
function KioskCategories({
  active,
  onSelect
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "k-cats"
  }, CATEGORIES.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    className: 'k-cat' + (active === c.id ? ' active' : ''),
    onClick: () => onSelect(c.id)
  }, /*#__PURE__*/React.createElement("img", {
    src: PASTA_GLYPHS[c.id],
    alt: ""
  }), /*#__PURE__*/React.createElement("div", {
    className: "zh"
  }, c.zh), /*#__PURE__*/React.createElement("div", {
    className: "en"
  }, c.en))));
}
function KioskTile({
  item,
  onOpen
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "k-tile",
    onClick: () => onOpen(item)
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-tile-img"
  }, item.badge && /*#__PURE__*/React.createElement("div", {
    className: 'k-tile-badge' + (item.badge.type === 'veg' ? ' veg' : '')
  }, item.badge.label), /*#__PURE__*/React.createElement("img", {
    src: item.img,
    alt: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "k-tile-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-tile-zh"
  }, item.zh), /*#__PURE__*/React.createElement("div", {
    className: "k-tile-en"
  }, item.en), /*#__PURE__*/React.createElement("div", {
    className: "k-tile-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-tile-price"
  }, "\xA5", item.price), /*#__PURE__*/React.createElement("button", {
    className: "k-tile-add",
    onClick: e => {
      e.stopPropagation();
      onOpen(item);
    }
  }, "+"))));
}
function KioskGrid({
  items,
  onOpen
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "k-grid"
  }, items.map(it => /*#__PURE__*/React.createElement(KioskTile, {
    key: it.id,
    item: it,
    onOpen: onOpen
  })));
}
function KioskCart({
  count,
  total,
  onCheckout
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "k-cart"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-cart-count"
  }, count), /*#__PURE__*/React.createElement("div", {
    className: "k-cart-meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, "\u8BA2\u5355\u603B\u8BA1 \xB7 Order total"), /*#__PURE__*/React.createElement("div", {
    className: "total"
  }, "\xA5", total.toFixed(2))), /*#__PURE__*/React.createElement("button", {
    className: "k-cart-cta",
    onClick: onCheckout
  }, "\u7ED3\u8D26 \xB7 Checkout \u2192"));
}
function KioskDishModal({
  item,
  onClose,
  onAdd
}) {
  const [shape, setShape] = useState(item.shapes[0]);
  const [qty, setQty] = useState(1);
  return /*#__PURE__*/React.createElement("div", {
    className: "k-modal-scrim",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-modal",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    className: "k-close",
    onClick: onClose
  }, "\xD7"), /*#__PURE__*/React.createElement("div", {
    className: "k-modal-img"
  }, /*#__PURE__*/React.createElement("img", {
    src: item.img,
    alt: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "k-modal-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-modal-zh"
  }, item.zh), /*#__PURE__*/React.createElement("div", {
    className: "k-modal-en"
  }, item.en), /*#__PURE__*/React.createElement("div", {
    className: "k-modal-desc"
  }, item.desc), /*#__PURE__*/React.createElement("div", {
    className: "k-options-h"
  }, "\u9009\u9762\u578B \xB7 Pasta shape"), /*#__PURE__*/React.createElement("div", {
    className: "k-opts"
  }, item.shapes.map(s => /*#__PURE__*/React.createElement("div", {
    key: s,
    className: 'k-opt' + (shape === s ? ' active' : ''),
    onClick: () => setShape(s)
  }, /*#__PURE__*/React.createElement("div", {
    className: "name"
  }, s), /*#__PURE__*/React.createElement("div", {
    className: "delta"
  }, "+ \xA50")))), /*#__PURE__*/React.createElement("div", {
    className: "k-options-h"
  }, "\u8FA3\u5EA6 \xB7 Spice"), /*#__PURE__*/React.createElement("div", {
    className: "k-opts"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-opt active"
  }, /*#__PURE__*/React.createElement("div", {
    className: "name"
  }, "\u539F\u5473")), /*#__PURE__*/React.createElement("div", {
    className: "k-opt"
  }, /*#__PURE__*/React.createElement("div", {
    className: "name"
  }, "\u5FAE\u8FA3")), /*#__PURE__*/React.createElement("div", {
    className: "k-opt"
  }, /*#__PURE__*/React.createElement("div", {
    className: "name"
  }, "\u7279\u8FA3")))), /*#__PURE__*/React.createElement("div", {
    className: "k-modal-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-qty"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setQty(Math.max(1, qty - 1))
  }, "\u2212"), /*#__PURE__*/React.createElement("div", {
    className: "n"
  }, qty), /*#__PURE__*/React.createElement("button", {
    onClick: () => setQty(qty + 1)
  }, "+")), /*#__PURE__*/React.createElement("button", {
    className: "k-modal-add",
    onClick: () => onAdd(item, qty)
  }, "\u52A0\u5165\u8BA2\u5355 \xB7 \xA5", (item.price * qty).toFixed(2)))));
}
Object.assign(window, {
  CATEGORIES,
  MENU,
  KioskHeader,
  KioskCategories,
  KioskGrid,
  KioskTile,
  KioskCart,
  KioskDishModal
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/kiosk/components.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/components.jsx
try { (() => {
// Trenta website components
function WebNav() {
  return /*#__PURE__*/React.createElement("nav", {
    className: "web-nav"
  }, /*#__PURE__*/React.createElement("div", {
    className: "web-nav-inner"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/trenta-wordmark.svg",
    alt: "Trenta"
  }), /*#__PURE__*/React.createElement("div", {
    className: "web-nav-links"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "\u83DC\u5355 Menu"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "\u95E8\u5E97 Locations"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "\u5173\u4E8E Story"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "\u62DB\u8058 Careers")), /*#__PURE__*/React.createElement("button", {
    className: "web-nav-cta"
  }, "\u7ACB\u5373\u4E0B\u5355 \u2192")));
}
function WebHero() {
  return /*#__PURE__*/React.createElement("section", {
    className: "web-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "web-hero-img"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/imagery/placeholder-hero-dark.svg",
    alt: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "web-hero-protect"
  }), /*#__PURE__*/React.createElement("div", {
    className: "web-hero-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "web-hero-eyebrow"
  }, "PASTA FRESCA \xB7 \u73B0\u505A\u624B\u64C0"), /*#__PURE__*/React.createElement("h1", {
    className: "web-hero-h"
  }, "\u6BCF\u5929\u4E0A\u5348\u5341\u70B9\uFF0C", /*#__PURE__*/React.createElement("br", null), "\u6211\u4EEC\u5F00\u59CB", /*#__PURE__*/React.createElement("i", null, "\u64C0\u9762"), "\u3002"), /*#__PURE__*/React.createElement("p", {
    className: "web-hero-sub"
  }, "Hand-rolled fresh pasta, served fast. Roman classics done with the patience they deserve, the speed they don't."), /*#__PURE__*/React.createElement("div", {
    className: "web-hero-cta"
  }, /*#__PURE__*/React.createElement("button", {
    className: "web-cta-primary"
  }, "\u67E5\u770B\u83DC\u5355 \u2192"), /*#__PURE__*/React.createElement("button", {
    className: "web-cta-ghost"
  }, "\u6700\u8FD1\u95E8\u5E97"))));
}
const WEB_FEATURED = [{
  zh: '奶酪黑椒意面',
  en: 'Cacio e Pepe',
  desc: '佩科里诺羊乳酪、现磨黑胡椒、手擀 tonnarelli。罗马人的深夜食堂。',
  price: 38,
  img: '../../assets/imagery/placeholder-pasta.svg'
}, {
  zh: '青酱手擀',
  en: 'Trofie al Pesto',
  desc: '热那亚青酱、土豆、四季豆。利古里亚的山与海。',
  price: 42,
  img: '../../assets/imagery/placeholder-herbs.svg'
}, {
  zh: '海鲜意面',
  en: 'Frutti di Mare',
  desc: '蛤蜊、虾、墨鱼、樱桃番茄。一份地中海。',
  price: 58,
  img: '../../assets/imagery/placeholder-hero-dark.svg'
}];
function FeaturedMenu() {
  return /*#__PURE__*/React.createElement("section", {
    className: "web-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-eyebrow"
  }, "SIGNATURE \xB7 \u62DB\u724C"), /*#__PURE__*/React.createElement("h2", {
    className: "section-h"
  }, "Hand-rolled ", /*#__PURE__*/React.createElement("i", null, "daily"), ", served until we run out."), /*#__PURE__*/React.createElement("p", {
    className: "section-sub"
  }, "\u6BCF\u5929\u6E05\u6668\u624B\u64C0\u3002\u552E\u5B8C\u4E3A\u6B62 \u2014 \u8FD9\u4E0D\u662F\u8425\u9500\u8BDD\u672F\uFF0C\u662F\u7269\u7406\u3002"), /*#__PURE__*/React.createElement("div", {
    className: "menu-grid"
  }, WEB_FEATURED.map((it, i) => /*#__PURE__*/React.createElement("article", {
    key: i,
    className: "menu-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "menu-card-img"
  }, /*#__PURE__*/React.createElement("img", {
    src: it.img,
    alt: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "menu-card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "menu-card-zh"
  }, it.zh), /*#__PURE__*/React.createElement("div", {
    className: "menu-card-en"
  }, it.en), /*#__PURE__*/React.createElement("p", {
    className: "menu-card-desc"
  }, it.desc), /*#__PURE__*/React.createElement("div", {
    className: "menu-card-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "menu-card-price"
  }, "\xA5", it.price), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--fg-brand)',
      fontSize: 14,
      fontWeight: 600
    }
  }, "\u67E5\u770B \u2192")))))));
}
function StorySection() {
  return /*#__PURE__*/React.createElement("section", {
    className: "web-section dark"
  }, /*#__PURE__*/React.createElement("div", {
    className: "inner",
    style: {
      display: 'grid',
      gridTemplateColumns: '5fr 6fr',
      gap: 64,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "story-img"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/imagery/placeholder-process.svg",
    alt: ""
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-eyebrow on-dark"
  }, "LA STORIA \xB7 \u6211\u4EEC\u7684\u6545\u4E8B"), /*#__PURE__*/React.createElement("p", {
    className: "story-quote"
  }, "\"Pasta fresca isn't a technique. ", /*#__PURE__*/React.createElement("i", null, "It's a measurement of patience."), "\""), /*#__PURE__*/React.createElement("p", {
    className: "story-attr"
  }, "CHEF MARCO \xB7 FOUNDER"), /*#__PURE__*/React.createElement("p", {
    className: "section-sub on-dark",
    style: {
      marginTop: 28
    }
  }, "Trenta \u8D77\u6E90\u4E8E\u4E00\u4E2A\u6267\u5FF5\uFF1A\u597D\u7684\u610F\u9762\u53EA\u9700\u8981\u65B0\u9C9C\u7684\u9762\u3001\u5408\u9002\u7684\u76D0\u3001\u521A\u597D\u7684\u706B\u5019\u3002\u6211\u4EEC\u628A\u8FD9\u4EF6\u7B80\u5355\u7684\u4E8B\u505A\u4E86\u4E09\u5341\u904D \u2014 \u7136\u540E\u6210\u4E86\u62DB\u724C\u3002"))));
}
function ProcessSection() {
  const steps = [{
    num: '01',
    title: '今晨手擀',
    desc: '00 号面粉 + 鸡蛋 + 一撮盐。我们每天上午十点开始擀面，下午用完为止。'
  }, {
    num: '02',
    title: '现点现煮',
    desc: '九十秒下锅。Al dente 是默认 — 你点单时，水已经在烧。'
  }, {
    num: '03',
    title: '一份意面，一桌人',
    desc: '没有外卖盒的塑料感。陶碗，金属叉，吃饭就该有吃饭的样子。'
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "web-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-eyebrow"
  }, "IL METODO \xB7 \u6211\u4EEC\u7684\u505A\u6CD5"), /*#__PURE__*/React.createElement("h2", {
    className: "section-h"
  }, "\u4E09\u4EF6\u4E8B\uFF0C", /*#__PURE__*/React.createElement("i", null, "\u505A\u5BF9"), "\u3002"), /*#__PURE__*/React.createElement("div", {
    className: "process-strip"
  }, steps.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.num,
    className: "process-step"
  }, /*#__PURE__*/React.createElement("div", {
    className: "num"
  }, s.num), /*#__PURE__*/React.createElement("div", {
    className: "title"
  }, s.title), /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, s.desc)))));
}
function LocationsSection() {
  const locs = [{
    name: '上海 · 静安寺',
    addr: '愚园路 218 号 1F',
    hours: '11:00 – 22:00 · 每天'
  }, {
    name: '上海 · 前滩',
    addr: '东育路 555 号 L2',
    hours: '11:00 – 22:00 · 每天'
  }, {
    name: '北京 · 三里屯',
    addr: '三里屯路 19 号院',
    hours: '11:00 – 22:30 · 每天'
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "web-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-eyebrow"
  }, "DOVE \xB7 \u95E8\u5E97"), /*#__PURE__*/React.createElement("h2", {
    className: "section-h"
  }, "\u4E09\u5BB6\u5E97\uFF0C", /*#__PURE__*/React.createElement("i", null, "\u5C31\u8FD9\u4E9B"), "\u3002"), /*#__PURE__*/React.createElement("div", {
    className: "loc-grid"
  }, locs.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "loc-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "loc-name"
  }, l.name), /*#__PURE__*/React.createElement("div", {
    className: "loc-addr"
  }, l.addr), /*#__PURE__*/React.createElement("div", {
    className: "loc-hours"
  }, l.hours)))));
}
function WebFooter() {
  return /*#__PURE__*/React.createElement("footer", {
    className: "web-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "web-foot-inner"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/trenta-monogram.svg",
    style: {
      width: 48
    },
    alt: ""
  }), /*#__PURE__*/React.createElement("div", {
    className: "web-foot-mark"
  }, "pasta fresca, made today.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "\u83DC\u5355 Menu"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "\u62DB\u724C"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "\u7ECF\u5178"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "\u4ECA\u65E5\u9C9C"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "\u996E\u54C1")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "\u95E8\u5E97 Visit"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "\u6240\u6709\u95E8\u5E97"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "\u5916\u5356"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "\u79C1\u4EBA\u8BA2\u5236")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "\u66F4\u591A More"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "\u5173\u4E8E\u6211\u4EEC"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "\u62DB\u8058"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "\u8054\u7CFB"))), /*#__PURE__*/React.createElement("div", {
    className: "web-foot-bottom"
  }, /*#__PURE__*/React.createElement("div", null, "\xA9 2026 Trenta. All rights reserved."), /*#__PURE__*/React.createElement("div", null, "\u6CAA ICP \u5907 12345678 \u53F7")));
}
Object.assign(window, {
  WebNav,
  WebHero,
  FeaturedMenu,
  StorySection,
  ProcessSection,
  LocationsSection,
  WebFooter
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/components.jsx", error: String((e && e.message) || e) }); }

})();
