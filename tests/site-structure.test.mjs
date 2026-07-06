import { readFileSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

/* 2026-07-06 改版结构守卫 —「作品为主角」重构:作品画廊前置、身份合并两组
   (AIPM / Architect)、每作杂志式介绍、品牌带 phase W 退役。 */

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (file) => readFileSync(join(root, file), "utf8");

const chapters = read("rational/chapters.jsx");
const sections = read("rational/sections.jsx");
const app = read("rational/app.jsx");
const secCss = read("rational/sections.css");

/* ── 组件存在:AIPM 开场 + 四段介绍 + Architect + 两段介绍 + 画廊 ── */
for (const fn of ["ChAipmOpen", "IntroPears", "IntroCowork", "IntroYijian", "IntroMeco", "IntroUabb", "IntroArchfolio", "ChArch"]) {
  assert.match(chapters, new RegExp("function " + fn + "\\s*\\("), fn + " component should exist");
}
assert.match(sections, /function WorksGallery\s*\(/, "WorksGallery component should exist");
assert.match(sections, /function CoverArt\s*\(/, "CoverArt (placeholder covers) should exist");

/* ── 旧组件名不再渲染 ── */
for (const dead of ["ChDev", "ChReel", "ChAipmPlatform"]) {
  assert.equal(app.indexOf("<" + dead + " "), -1, dead + " must not render (renamed in the redesign)");
}
assert.equal(sections.indexOf("function Works("), -1, "old scroll-scrub Works must be deleted");

/* ── id 移交:开场章拿 aipm,平台介绍改 intro-cowork ── */
assert.match(chapters, /id="aipm"[^>]*data-prog="aipm"/, "ChAipmOpen carries the aipm id + progress (WHOAMI 01 lands here)");
assert.match(chapters, /id="intro-cowork"/, "Co-work platform page moved to intro-cowork id");
assert.match(chapters, /id="intro-pears"/, "Pears reel moved to intro-pears id");
assert.match(chapters, /function useApxFilm/, "the Co-work film-loading hook must be intact");
assert.match(chapters, /xtool\/\?fresh=1/, "Co-work film should still embed the xtool interactive movie");

/* ── 进度键改名 developer → aipm(三处),不得残留活引用 ── */
assert.doesNotMatch(chapters, /useChProg\("developer"/, "progress key must be renamed to aipm");
assert.doesNotMatch(sections, /__progress\.developer/, "CodePanel must read __progress.aipm");

/* ── 渲染顺序:Hero → Whoami → 画廊 → AIPM 章(开场+4 介绍) → Architect 章(+2) → Contact ── */
const at = (tag) => app.indexOf(tag);
const order = [
  "<Whoami jump={jump} />", "<WorksGallery jump={jump} />", "<ChAipmOpen jump={jump} />",
  "<IntroPears jump={jump} />", "<IntroCowork jump={jump} />", "<IntroYijian jump={jump} />",
  "<IntroMeco jump={jump} />", "<ChArch jump={jump} />", "<IntroUabb jump={jump} />",
  "<IntroArchfolio jump={jump} />", "<Contact jump={jump} />",
];
for (let i = 0; i < order.length; i++) assert.ok(at(order[i]) > -1, order[i] + " should render");
for (let i = 1; i < order.length; i++) assert.ok(at(order[i - 1]) < at(order[i]), order[i] + " should follow " + order[i - 1]);

/* ── WORKS 六卡 + ARCH_WORKS 四作,新字段齐备 ── */
assert.match(sections, /const ARCH_WORKS\s*=\s*\[/, "ARCH_WORKS (four architecture works) should exist");
const keys = [...sections.matchAll(/key:\s*"(pears|cowork|yijian|meco|uabb|archfolio)"/g)].map((m) => m[1]);
assert.deepEqual(keys, ["pears", "cowork", "yijian", "meco", "uabb", "archfolio"], "WORKS should hold the six cards in order");
assert.match(sections, /status:\s*"in-progress"/, "Meco should carry the in-progress status");
assert.match(sections, /introId:\s*"intro-yijian"/, "cards should link to their intro anchors");
/* 章内 lookup 按 key 查询,与数据一致 */
assert.match(chapters, /w\.key === "pears"/, "Pears CTA lookup should key off w.key");
assert.match(chapters, /w\.key === "cowork"/, "Co-work CTA lookup should key off w.key");

/* ── 品牌带 phase W 退役:app 不再引用 __wkOpen / .wk-wrap ── */
assert.doesNotMatch(app, /__wkOpen/, "brandmorph phase W (__wkOpen) must be retired");
assert.doesNotMatch(app, /\.wk-wrap/, "the 640vh works scroll budget must be gone");

/* ── 画廊网格墙 CSS + 底部波点 ── */
assert.match(secCss, /\.gw-grid\s*\{/, "gallery grid CSS should exist");
assert.match(secCss, /\.gw-t-cobalt|\.gw-t-ink|\.gw-t-paper/, "gallery cards carry tone classes");
assert.match(secCss, /\.fdots\s*\{/, "footer halftone dots band should exist");

/* ── 章节大标题静态化:BarWord static + .rv-soft ── */
assert.match(read("rational/barmorph.jsx"), /static:\s*still\s*=\s*false/, "BarWord should accept a static prop");
assert.match(read("rational/base.css"), /\.rv-soft\s*\{/, "the light static-title reveal tier should exist");

/* ── 圆角按钮令牌 ── */
assert.match(read("rational/base.css"), /--r-btn:\s*12px/, "button corner-radius token should exist");

console.log("site-structure: all assertions passed");
