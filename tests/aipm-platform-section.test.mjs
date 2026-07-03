import { readFileSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (file) => readFileSync(join(root, file), "utf8");

const chapters = read("rational/chapters.jsx");
const css = read("rational/chapters.css");
const app = read("rational/app.jsx");

assert.match(chapters, /function ChAipmPlatform\s*\(/, "ChAipmPlatform component should exist");
/* 2026-07-02: the platform page is NORMAL FLOW — no scroll-scrub, no keynote.
   It must NOT publish progress (the engine would fight the layout) and the
   film must load on arrival via IntersectionObserver / tap, not a praw window. */
assert.doesNotMatch(chapters, /data-prog="aipmPlatform"/, "platform chapter must not be scroll-scrubbed anymore");
assert.doesNotMatch(chapters, /function useApxStage/, "the keynote scrub driver should be gone");
assert.match(chapters, /function useApxFilm/, "the film-loading hook should exist");
assert.match(chapters, /APX_INTRO_PAGES\s*=\s*\[/, "platform section should have an intro page before the video reveal");
assert.match(chapters, /不是单个工具，是生产系统/, "intro page should use clear Chinese copy");
/* 2026-07-03: the platform is publicly named Co-work (was XTOOL) and IS the
   An AIPM chapter itself — the thread transition page is gone. */
assert.match(chapters, /Co-work\s*<br\s*\/?>\s*Agent Platform/, "platform section should lead with the Co-work Agent Platform title");
assert.doesNotMatch(chapters, /XTOOL\s*<br/, "the XTOOL brand should be renamed in the platform title");
assert.match(chapters, /<section className="chapter apx" id="aipm"/, "the platform section carries the aipm id (WHO_INDEX 02 lands here)");
assert.match(chapters, /apx-visual-system/, "platform definition should have a clear system visual");
assert.match(chapters, /内容生产系统/, "system visual should name what the diagram means");
assert.match(chapters, /xtool\/\?fresh=1/, "platform film should embed the existing xtool interactive movie");
assert.match(chapters, /Object\.assign\(window,\s*\{[^}]*ChAipmPlatform/s, "component should be exported on window");

/* Render order (2026-07-03, user decision): the AIPM thread transition page is
   DELETED — Reel goes straight into the platform chapter, no whitespace page.
   Whoami → Dev → Reel → Platform(=An AIPM) → Arch → Works → Contact. */
const at = (tag) => app.indexOf(tag);
assert.ok(at("<Whoami jump={jump} />") < at("<ChDev jump={jump} />"), "chapters follow Whoami");
assert.ok(at("<ChDev jump={jump} />") < at("<ChReel jump={jump} />"), "Reel follows Developer");
assert.ok(at("<ChReel jump={jump} />") < at("<ChAipmPlatform jump={jump} />"), "platform (An AIPM) follows the reel directly");
assert.ok(at("<ChAipmPlatform jump={jump} />") < at("<ChArch jump={jump} />"), "Architect closes the chapters");
assert.ok(at("<ChArch jump={jump} />") < at("<Works jump={jump} />"), "Works closes the page");
assert.ok(at("<Works jump={jump} />") < at("<Contact jump={jump} />"), "Contact is last");
assert.equal(at("<ChAipm jump={jump} />"), -1, "the deleted ChAipm must not render");
assert.match(app, /const \{[^}]*ChAipmPlatform/s, "App should read ChAipmPlatform from window");

/* the Pears reel is a click-through deck now, not a scroll scrub */
assert.match(chapters, /reel-nav next/, "reel should render a next affordance");
assert.doesNotMatch(chapters, /function useReelStage/, "the scroll-scrub reel driver should be gone");

assert.doesNotMatch(css, /\.apx\s+\.ch-wrap/, "the pinned wrap CSS should be gone (normal flow)");
assert.doesNotMatch(css, /data-step/, "keynote step CSS should be gone");
assert.match(css, /\.apx-stage\s*\{[^}]*position:\s*relative/s, "platform stage should sit in normal flow");
assert.match(css, /\.apx-intro/, "intro page CSS should exist");
assert.match(css, /\.apx-visual/, "intro visual CSS should exist");
assert.match(css, /\.apx-video/, "video reveal CSS should exist");
assert.match(css, /\.reel-cell\.on\s*\{\s*opacity:\s*1/, "reel cells should toggle by class");

/* 2026-07-03: the AIPM identity/transition page is DELETED entirely */
assert.doesNotMatch(chapters, /function ChAipm\s*\(/, "the ChAipm transition page must be gone");
assert.doesNotMatch(chapters, /data-prog="aipm"/, "nothing publishes aipm scroll progress anymore");
assert.doesNotMatch(chapters, /CUT_LABELS|CUT_METHOD|useCutStage/, "the thread labels / judgment rows must be gone");
assert.doesNotMatch(css, /\.c2x-|\.ch2x/, "the ch2x/c2x CSS must be gone");

/* 个人网站，不要系统说明文案 (user 2026-07-03): never narrate playback/scroll
   mechanics in visible copy — affordance labels (点击播放 etc.) are fine. */
const sections = read("rational/sections.jsx");
assert.doesNotMatch(chapters, /到达自动播放|默认静音|turns by itself|自动翻页|scrolls into view."/, "no playback-mechanics narration in chapters copy");
assert.doesNotMatch(sections, /SCROLL — THE MARK|滚动，标记展开/, "no scroll-mechanics narration in the works intro");

console.log("aipm platform section static checks passed");
