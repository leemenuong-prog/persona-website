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
assert.match(chapters, /APX_INTRO_PAGES\s*=\s*\[/, "platform section should have intro pages before the video reveal");
assert.match(chapters, /APX_VISUALS\s*=\s*\[/, "intro pages should have matching visual concepts");
assert.match(chapters, /不是单个工具，是生产系统/, "intro pages should use clear Chinese copy");
assert.match(chapters, /一个 Agent 记住你的判断/, "second intro page should explain the private agent in Chinese");
assert.match(chapters, /XTOOL\s*<br\s*\/?>\s*Agent Platform/, "platform section should lead with the XTOOL / Agent Platform title");
assert.match(chapters, /apx-visuals/, "platform section should render intro visuals");
assert.match(chapters, /apx-visual-system/, "platform definition should have a clear system visual");
assert.match(chapters, /apx-visual-memory/, "private agent intro should have a clear memory visual");
assert.match(chapters, /内容生产系统/, "system visual should name what the diagram means");
assert.match(chapters, /记忆|规则|审核|复测/, "memory visual should use readable Chinese labels");
assert.doesNotMatch(chapters, /apx-visual-loop|Research, script|SHIP LOOP/, "there should only be two intro pages before video");
assert.doesNotMatch(chapters, /apx-video-head/, "video should not have an overlay header covering content");
assert.match(chapters, /src="xtool\/"/, "platform film should embed the existing xtool interactive movie");
assert.doesNotMatch(chapters, /apx-product|apx-flow|apx-evidence|apx-shot/, "platform section should not use stacked product cards");
assert.match(chapters, /Object\.assign\(window,\s*\{[^}]*ChAipmPlatform/s, "component should be exported on window");

const renderOrder = app.indexOf("<ChAipm jump={jump} />") < app.indexOf("<ChAipmPlatform jump={jump} />")
  && app.indexOf("<ChAipmPlatform jump={jump} />") < app.indexOf("<ChDev jump={jump} />");
assert.ok(renderOrder, "ChAipmPlatform should render between AIPM and Developer");
assert.match(app, /const \{[^}]*ChAipmPlatform/s, "App should read ChAipmPlatform from window");

assert.match(css, /\.apx\s+\.ch-wrap/, "platform chapter layout CSS should exist");
assert.match(css, /\.apx-intro/, "intro page CSS should exist");
assert.match(css, /\.apx-visual/, "intro visual CSS should exist");
assert.match(css, /\.apx-video/, "video reveal CSS should exist");
assert.match(css, /\.apx-stage\[data-step="2"\]\s+\.apx-media/, "video reveal should expand the media area");
assert.doesNotMatch(css, /\.apx-video-head/, "CSS should not keep video overlay header styles");
assert.doesNotMatch(css, /\.apx-product|\.apx-flow|\.apx-evidence|\.apx-shot/, "CSS should not keep stacked card layout classes");

console.log("aipm platform section static checks passed");
