import { readFileSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (file) => readFileSync(join(root, file), "utf8");

const html = read("ai-portfolio/index.html");
const css = read("ai-portfolio/deck.css");
const js = read("ai-portfolio/deck.js");

/* ── 册子结构 ── */
const pages = html.match(/<section class="page[^"]*"/g) ?? [];
assert.equal(pages.length, 22, "the deck should hold exactly 22 pages (每作品 ≤5 页)");

/* rev.3:白底统一、竖向流式 —— 不再有翻页态/深色页/钴蓝页 */
assert.doesNotMatch(html, /class="page[^"]*\bcurrent\b/, "flow mode has no .current page state");
assert.doesNotMatch(html, /class="page[^"]*\bdark\b/, "全册白底:no dark pages");
assert.doesNotMatch(html, /class="page[^"]*\bcobalt\b/, "全册白底:no cobalt pages");

/* 四章齐全,顺序正确(Pears → XTOOL → 议见 → UABB) */
const at = (id) => html.indexOf(id);
assert.ok(at("pg-pears-cover") > -1, "Pears chapter cover exists");
assert.ok(at("pg-pears-cover") < at("pg-xtool-cover"), "XTOOL follows Pears");
assert.ok(at("pg-xtool-cover") < at("pg-yijian-cover"), "Yijian follows XTOOL");
assert.ok(at("pg-yijian-cover") < at("pg-uabb-cover"), "UABB closes the works");
assert.ok(at("pg-uabb-cover") < at("pg-end"), "contact page is last");

/* ── 相对路径纪律(Netlify 根域 + Pages 子路径双活) ── */
assert.doesNotMatch(html, /(?:href|src)="\//,
  "no root-absolute URLs — the subpage must work under /persona-website/ too");
assert.doesNotMatch(css, /url\(\s*["']?\//,
  "deck.css must not reference root-absolute assets");

/* ── 竖向流式机制 ── */
assert.match(css, /margin-bottom:\s*calc\(\(var\(--s/,
  "negative-margin absorbs the scale gap — scrollbar length must match visuals");
assert.match(css, /transform-origin:\s*top center/, "pages scale about their top edge, staying centered");
assert.match(js, /IntersectionObserver/, "HUD counter is scroll-driven via IO");
assert.match(js, /scrollIntoView/, "keyboard/TOC jump via scrollIntoView");
assert.match(js, /-45%/, "page counter uses a viewport-centerline band");
assert.doesNotMatch(js, /addEventListener\(["']scroll["']/,
  "no scroll listeners — no hash spam (Safari throttles replaceState)");
assert.doesNotMatch(js, /visualViewport/,
  "pinch-zoom must not refit --s — width-driven layout only");
assert.doesNotMatch(js, /style\.transform\s*=/,
  "JS must never write inline transforms — print relies on CSS-only scaling");

/* ── 进场动效:三重兜底 ── */
assert.match(css, /body\.anim \.rv/, "reveal hidden state exists only after body.anim");
assert.match(css, /@media print[\s\S]*\.rv[^}]*opacity:\s*1\s*!important/,
  "reveals forced to final state in print");
assert.match(css, /prefers-reduced-motion/, "motion gated on user preference");

/* ── 打印规则(同源双出的关键机关) ── */
assert.match(css, /@page\s*\{\s*size:\s*1920px 1080px;\s*margin:\s*0/, "@page size 1920×1080, no margin");
assert.match(css, /@media print[\s\S]*break-after:\s*page/, "pages must break-after: page in print");
assert.match(css, /\.page:last-of-type\s*\{\s*break-after:\s*auto/, "last page must not spawn a blank sheet");
assert.match(css, /@media print[\s\S]*\.hud[^{]*\{\s*display:\s*none/, "HUD must vanish in print");
assert.match(css, /print-color-adjust:\s*exact/, "backgrounds must survive printing");
assert.match(css, /@media print[\s\S]*box-shadow:\s*none\s*!important/, "flow shadows stripped in print");
assert.match(css, /--s/, "screen scaling must run through the --s custom property");

/* ── 目录浮层的锚点都指向存在的页码 ── */
for (const m of html.matchAll(/href="#p\/(\d+)"/g)) {
  const n = Number(m[1]);
  assert.ok(n >= 1 && n <= pages.length, `TOC link #p/${n} must point inside the deck`);
}
