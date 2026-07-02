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
assert.match(chapters, /data-prog="aipmPlatform"/, "platform chapter should publish scroll progress");
assert.match(chapters, /APX_INTRO_PAGES\s*=\s*\[/, "platform section should have an intro page before the video reveal");
assert.match(chapters, /不是单个工具，是生产系统/, "intro page should use clear Chinese copy");
assert.match(chapters, /XTOOL\s*<br\s*\/?>\s*Agent Platform/, "platform section should lead with the XTOOL / Agent Platform title");
assert.match(chapters, /apx-visual-system/, "platform definition should have a clear system visual");
assert.match(chapters, /内容生产系统/, "system visual should name what the diagram means");
assert.match(chapters, /xtool\/\?fresh=1/, "platform film should embed the existing xtool interactive movie");
assert.match(chapters, /Object\.assign\(window,\s*\{[^}]*ChAipmPlatform/s, "component should be exported on window");

/* Render order (2026-07-02 rev. 2, user decision): chapters first, works closes
   the page before contact — Whoami → Dev → Reel → AIPM → Platform → Arch → Works. */
const at = (tag) => app.indexOf(tag);
assert.ok(at("<Whoami jump={jump} />") < at("<ChDev jump={jump} />"), "chapters follow Whoami");
assert.ok(at("<ChDev jump={jump} />") < at("<ChReel jump={jump} />"), "Reel follows Developer");
assert.ok(at("<ChReel jump={jump} />") < at("<ChAipm jump={jump} />"), "AIPM follows the reel");
assert.ok(at("<ChAipm jump={jump} />") < at("<ChAipmPlatform jump={jump} />"), "platform showcase follows AIPM");
assert.ok(at("<ChAipmPlatform jump={jump} />") < at("<ChArch jump={jump} />"), "Architect closes the chapters");
assert.ok(at("<ChArch jump={jump} />") < at("<Works jump={jump} />"), "Works closes the page");
assert.ok(at("<Works jump={jump} />") < at("<Contact jump={jump} />"), "Contact is last");
assert.match(app, /const \{[^}]*ChAipmPlatform/s, "App should read ChAipmPlatform from window");

/* the Pears reel is a click-through deck now, not a scroll scrub */
assert.match(chapters, /reel-nav next/, "reel should render a next affordance");
assert.doesNotMatch(chapters, /function useReelStage/, "the scroll-scrub reel driver should be gone");

assert.match(css, /\.apx\s+\.ch-wrap/, "platform chapter layout CSS should exist");
assert.match(css, /\.apx-intro/, "intro page CSS should exist");
assert.match(css, /\.apx-visual/, "intro visual CSS should exist");
assert.match(css, /\.apx-video/, "video reveal CSS should exist");
assert.match(css, /\.apx-stage\[data-step="1"\]\s+\.apx-media/, "video step should expand the media area");
assert.match(css, /\.reel-cell\.on\s*\{\s*opacity:\s*1/, "reel cells should toggle by class");

console.log("aipm platform section static checks passed");
