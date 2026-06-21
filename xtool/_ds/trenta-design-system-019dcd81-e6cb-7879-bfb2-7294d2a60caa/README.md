# Trenta — Design System

> 一家快休闲意面餐厅 · A fast-casual fresh-pasta restaurant
> Surfaces: 店内自助点单终端 (in-store kiosk) · 移动 App · 网站

**Trenta** ("thirty" in Italian — a nod to the 30-minute fresh-pasta promise) is the working name for this brand. Mainland China primary market, bilingual with Chinese-led copy and English secondary. Positioning sits between Padella (London craft pasta) and Eataly (warm Italian authenticity), with the operational discipline of Sweetgreen.

---

## Project context

This system was built **without any provided source materials** — no logo, codebase, Figma, menu, or photography were attached. Every asset, color, and copy sample is original and intended as a *starting point* the user can refine. See **CAVEATS** at the bottom.

### Sources / inputs
- _None provided._ If you have a logo, codebase, Figma, menu, or photography you want this re-grounded against, reattach via the Import menu and ping me — I'll re-derive tokens and components from the real source of truth.

### Products represented
1. **Self-service kiosk** (`ui_kits/kiosk/`) — fixed 1080×1920 portrait touchscreen for in-store ordering
2. **Mobile app** (`ui_kits/app/`) — iOS-frame ordering + loyalty, 390×844 viewport
3. **Marketing website** (`ui_kits/website/`) — desktop 1440 brand site with menu, locations, story

---

## Index

```
trenta/
├── README.md                 ← you are here
├── SKILL.md                  ← Claude Code-compatible skill manifest
├── colors_and_type.css       ← all design tokens (CSS vars)
├── fonts/                    ← (empty — using Google Fonts substitutes)
├── assets/
│   ├── logo/                 ← wordmark, monogram, lockups
│   ├── icons/                ← Lucide-derived line icons (CDN-linked)
│   ├── illustrations/        ← pasta-shape glyphs, mascots
│   └── imagery/              ← food photography placeholders
├── preview/                  ← Design System tab cards (1 per concept)
├── ui_kits/
│   ├── kiosk/    {index.html, components/}
│   ├── app/      {index.html, components/}
│   └── website/  {index.html, components/}
└── slides/                   ← (none — no template was provided)
```

---

## CONTENT FUNDAMENTALS

### Voice
**Confident, warm, ingredient-first.** Trenta talks about pasta the way a chef talks to a regular: short sentences, specific nouns, no marketing puff. Bilingual copy is **Chinese-led**; English appears as a secondary line, often in italic Fraunces, never as a literal mirror translation.

### Tone scale
| Surface | Tone |
|---|---|
| Kiosk | Direct, transactional, large type. "选意面 → 选酱汁 → 加配料". |
| App push | Warm, brief. "今天的限定：墨鱼意面 ☐". |
| Website hero | Editorial, slow. "每天上午十点，我们开始擀面。" |
| Receipt / order | Mono, no adjectives. "Trenta · 订单 #4012 · 18:42" |

### Casing & punctuation
- Headings in Chinese: no period at end. "今日特选" not "今日特选。"
- Headings in English: title case for marketing ("Hand-Rolled Daily"), sentence case for UI ("Add to order").
- Use the en-dash (–) between bilingual pairs sparingly — most of the time English sits below Chinese in smaller, italic Fraunces.
- Prices: ¥38 (no decimals unless needed). Mono font. Never "RMB 38" or "38 元" — the ¥ sign is the brand's own.
- Italian dish names stay in Italian, italic: *Cacio e Pepe*, *Cacio e Pepe* 黑松露版.

### Pronouns
- Second person ("你", "you") on the website and app — directly address the diner.
- First-person plural ("我们", "we") when describing process or values — never "I".
- Avoid "您" — too formal for a fast-casual brand. Trenta is friendly, not deferential.

### Emoji & ornaments
- **Almost never** in product UI. The brand voice does the warmth — emoji cheapens it.
- Acceptable: a single ✶ or ◆ as a section ornament in marketing. Never 🍝 🍕 🇮🇹.
- Unicode ornaments OK: en-dash –, em-dash —, the registered ® on the wordmark, ✶ asterism.

### Voice examples — DO

> 今日新鲜手擀。下午三点前售完为止。
> *Hand-rolled today. Until we run out.*

> 一份意面，一份配菜，一杯气泡水。¥58。
> *Pasta + side + sparkling water. ¥58.*

> Cacio e Pepe — 罗马人的深夜食堂。
> *Romans have been eating this since forever.*

### Voice examples — DON'T

> ~~欢迎光临 Trenta！🍝 我们提供超棒的意面体验！🇮🇹✨~~ (slop)
> ~~品味意大利的浪漫风情~~ (cliché, no specificity)
> ~~Made with love by our amazing team~~ (vapid)

---

## VISUAL FOUNDATIONS

### Color
- **Cream paper backgrounds** (`--bg-page` = `#FAF6EE`) instead of pure white. Pure white is reserved for raised surfaces (cards, kiosk dish tiles).
- **Pomodoro red `#B83A1E`** is the brand. Used for the wordmark, the primary CTA, the active-tab indicator, and price-on-promo. It is **not** used for body text or large backgrounds — it would feel aggressive. Reserved for moments.
- **Terracotta + olive + butter** are supporting accents. Never two saturated colors in the same composition.
- **Charcoal ink `#0E0D0A`** is the type color, never pure black.
- Darker surfaces (kiosk hero, footer) use `--color-carta-900` ink — warm-black, not blue-black.

### Type
- **Fraunces** (serif, optical-size aware) for display + headings. Italics carry a lot of brand personality — used for Italian words, emphasis, and the website hero.
- **Inter** for all UI body, controls, navigation.
- **Noto Serif SC / Noto Sans SC** are the Chinese partners. Match Fraunces with Noto Serif SC for display, Inter with Noto Sans SC for body.
- **JetBrains Mono** for prices and order numbers — tabular numerals are critical for menu alignment.
- Hierarchy is built on **size and weight contrast**, not color. A title and its subtitle are usually both `--fg-1` ink, separated only by 1.6× scale and weight 600 vs 400.

### Imagery
- **Top-down food photography on warm cream/terracotta surfaces.** Hands occasionally enter the frame — placing a plate, twirling pasta, dusting cheese. Never staged-still; always mid-motion.
- Color grading is **warm and natural** — slight gold cast, no teal, mild grain. Never the over-saturated red-and-green Italian-flag look.
- Ingredient photography (raw flour, eggs, herbs) gets used as full-bleed dividers between sections.
- Placeholder pattern: `assets/imagery/placeholder-*.svg` — terracotta-tinted gradients with a pasta-shape glyph centered.

### Backgrounds & textures
- Default: solid `--bg-page` cream.
- Hero / section dividers: warm full-bleed photography, never gradients.
- A subtle **paper grain** texture (optional, 4% opacity noise) on light surfaces in marketing contexts. Off in product UI.
- **No** purple/blue gradients. **No** mesh gradients. **No** glassmorphism.

### Borders, radii, cards
- Card corners: `--radius-lg` (14px) for product UI, `--radius-md` (8px) for dense kiosk tiles, `--radius-2xl` (32px) for hero blocks.
- Borders are 1px `--border-subtle` (warm-tinted, not gray). Used sparingly — most separation comes from background-color shift.
- **Cards have a single soft warm shadow** (`--shadow-2`), never both border + shadow except in dense list layouts.
- The signature Trenta card style: cream surface, no border, `--shadow-2`, image filling top half with `border-radius` matching the card.

### Shadows
- Always **warm-tinted** (rgba 46, 42, 34) — never blue-black.
- Five-stop scale (`--shadow-1` through `--shadow-4` + `--shadow-inset`).
- `--shadow-inset` only on pressed buttons and dropdown trigger fields.

### Motion
- **Easing is firm and slightly anticipatory.** `--ease-standard` for most things. `--ease-out` (custom cubic) for entry. Never bouncy springs — this is a restaurant, not a toy.
- Durations: `--duration-fast` (120ms) for hover; `--duration-normal` (220ms) for state changes; `--duration-slow` (400ms) for view transitions and modals.
- **Fades + small Y translations** are the dominant pattern. No card flips, no parallax, no scroll-jacking.
- Kiosk: animations are slightly faster (~80%) — diners need feedback fast.

### Hover & press
- **Hover (web/desktop)**: subtle background tint via `--state-hover-overlay` (4% ink). Or shift to `--bg-raised`. Brand-color buttons: shift to `--color-pomodoro-600` (one stop darker).
- **Press**: `--state-press-overlay` (8% ink) + scale `0.98` + 80ms ease-in. Buttons add `--shadow-inset`.
- **Focus-visible**: 2px ring of `--state-focus-ring` (pomodoro-400) with 2px offset. Never blue.
- Touch (kiosk + app): no hover; press is the primary state. Tiles **flash** to `--bg-brand-soft` for 120ms on tap.

### Layout & spacing
- 8px grid. `--space-*` scale runs 0–128.
- Marketing site uses a **12-column grid with generous gutters** (24px) and 96px section padding on desktop.
- Kiosk uses a **6-column grid** at 1080px width with 24px gutters; large tap targets ≥ 88px.
- App uses a 4-column grid, 16px gutters, 16px page padding.
- Section padding: `--space-9` (64px) mobile, `--space-10` (96px) desktop.

### Transparency & blur
- **Used sparingly.** The only systemic use: top-of-page nav on the website uses a `backdrop-filter: blur(12px)` over a cream-tinted 80% background when scrolled.
- Image-overlay protection: a `linear-gradient(to top, rgba(14,13,10,0.55), transparent 60%)` "protection gradient" over hero photography to keep type readable. Never a full-image dark scrim — preserve the photograph.
- No frosted glass on cards or modals. Modals use solid `--bg-surface` + `--shadow-4` over a `rgba(14,13,10,0.4)` page scrim.

### Iconography summary
See **ICONOGRAPHY** below.

---

## ICONOGRAPHY

### System
- **Lucide Icons** ([lucide.dev](https://lucide.dev)) is the chosen icon system, loaded via CDN. Lucide's 1.5px-stroke geometric line style matches Trenta's editorial-but-clean character. **Flagged substitution:** without the user's real codebase, I picked the closest-fit open library. If Trenta has its own icon set, swap in `assets/icons/` and update components.
- All icons rendered at **20px (UI), 24px (kiosk), 16px (dense lists)** at 1.5px stroke.
- Stroke color inherits from `currentColor` — usually `--fg-2` for inactive, `--fg-1` or `--fg-brand` for active.
- **No filled icons** in product UI. All linear. The wordmark and a small set of pasta-shape glyphs (in `assets/illustrations/`) are the only filled-vector imagery.

### Pasta-shape glyphs
- Custom SVG illustrations of pasta shapes (rigatoni, fusilli, tagliatelle, orecchiette, conchiglie) live in `assets/illustrations/pasta/`.
- Used as menu category icons, empty-state decoration, and the loading spinner (a slowly rotating fusilli).
- Single color: `--fg-1` ink on light, `--fg-on-brand` on dark.

### Logo & wordmark
- `assets/logo/trenta-wordmark.svg` — Fraunces-set wordmark with a subtle ligature on the "Tr".
- `assets/logo/trenta-monogram.svg` — a "T" monogram with a fork tine integrated, used as app icon, favicon, and kiosk header.
- Available in pomodoro-on-cream (default), cream-on-ink (dark), and single-ink versions.

### Emoji
- Not used. See CONTENT FUNDAMENTALS.

### Unicode
- The ¥ sign is the brand's price marker.
- ✶ (six-pointed asterisk) is used as a section ornament in marketing, never in product UI.
- En-dash – between bilingual pairs.

---

## CAVEATS — please read

This system was generated **without any source materials**. That means:

1. **The brand name "Trenta" is invented.** Swap it for the real name and run a find-replace.
2. **Fonts are Google Fonts substitutes:**
   - **Fraunces** (display) — substitute for whatever real Italian-feeling serif you'd commission
   - **Inter** (sans) — safe workhorse choice
   - **Noto Serif SC / Noto Sans SC** (Chinese) — also Google fallbacks; if you have a licensed Chinese face (e.g. 思源宋体, 方正悠黑) drop the .ttfs into `fonts/` and update `colors_and_type.css`.
3. **Logos and illustrations are placeholder SVGs** I drew. They're stylistically consistent but they are **not** a real designed identity. Replace with the real logo at first opportunity.
4. **Lucide icons** are a CDN substitute. Swap if Trenta has a custom set.
5. **Imagery is gradient placeholders.** No real food photography exists yet — every dish image is a terracotta-tinted card with a pasta glyph.
6. **Menu copy is invented.** Dish names are real Italian dishes; prices are plausible-for-China figures. Replace with the actual menu before any review.

---

## How to use this system

- **Designing a new screen?** Start in `ui_kits/<surface>/index.html`, find the closest existing screen, copy its component composition.
- **Adding a new component?** Add it to the relevant kit's `components/` folder. Follow the existing JSX patterns — small, single-purpose, no business logic.
- **New product surface (e.g. tablet, kitchen display)?** Make a new folder under `ui_kits/`. Re-use tokens from `colors_and_type.css`. Document deviations in the kit's own README.
