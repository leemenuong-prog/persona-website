import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

/* portfolio/ 作品集页守卫:
   1. config/portfolio.json 与 config/projects.json 的 join 完整(ref 必须命中);
   2. 同步纪律:portfolio.json 禁写产品文案(title_zh|one_liner_zh|desc_zh|body_zh 等一律 join);
   3. 引用的素材文件真实存在;
   4. 页面接线:portfolio/index.html 三件套齐备。 */

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (file) => readFileSync(join(root, file), "utf8");
const exists = (file) => existsSync(join(root, file));

const pf = JSON.parse(read("config/portfolio.json"));
const { projects } = JSON.parse(read("config/projects.json"));
const byId = new Map(projects.map((p) => [p.id, p]));

/* ── join 完整性 ── */
assert.ok(Array.isArray(pf.products) && pf.products.length === 5, "portfolio lists the five mainline AI works");
for (const prod of pf.products) {
  assert.ok(byId.has(prod.ref), "products[].ref '" + prod.ref + "' must match a projects.json id");
  const joined = byId.get(prod.ref);
  assert.ok(joined.main === true, prod.ref + " must be a mainline work");
  if (!prod.placeholder) {
    /* 做透的作品:七段文案必须在 projects.json 侧齐备(作品集页直接渲染它们) */
    for (const key of ["tldr", "why_built", "key_contributions", "how_it_works", "why_it_matters"]) {
      assert.ok(joined.sections && joined.sections[key] && joined.sections[key].body_zh,
        prod.ref + " needs sections." + key + ".body_zh in projects.json (the portfolio joins it)");
    }
    /* scenes 可暂缺(如 UABB 封面先行、截图后补);写了就不能是空数组 */
    if (prod.scenes) assert.ok(Array.isArray(prod.scenes) && prod.scenes.length > 0, prod.ref + " scenes must not be empty");
    for (const scene of prod.scenes || []) {
      assert.ok(["tldr", "why_built", "key_contributions", "how_it_works", "why_it_matters"].includes(scene.copy_ref),
        prod.ref + " scene '" + scene.id + "' copy_ref must name a projects.json section");
      for (const img of scene.images) {
        assert.ok(["mac", "browser", "none", "phone"].includes(img.frame), scene.id + " image frame must be mac|browser|none|phone");
      }
      /* 横向行模块语法(2026-07-08 用户裁定):rows 引用下标必须命中,且每张图恰好被引用一次;
         {sec:"…"} 独立文字节模块(2026-07-10)必须命中五节之一 */
      if (scene.rows) {
        const used = new Map();
        for (const row of scene.rows) {
          if (row.sec) assert.ok(["tldr", "why_built", "key_contributions", "how_it_works", "why_it_matters"].includes(row.sec),
            scene.id + " rows.sec '" + row.sec + "' must name a projects.json section");
          const refs = row.imgs ? row.imgs : (row.img != null ? [row.img] : []);
          for (const i of refs) {
            assert.ok(Number.isInteger(i) && i >= 0 && i < scene.images.length,
              scene.id + " rows references image index " + i + " out of range");
            used.set(i, (used.get(i) || 0) + 1);
          }
        }
        scene.images.forEach((_, i) => {
          assert.equal(used.get(i) || 0, 1, scene.id + " image " + i + " must be referenced exactly once by rows");
        });
      }
    }
  }
}
for (const id of pf.architecture.items) {
  const p = byId.get(id);
  assert.ok(p && p.main !== true, "architecture item '" + id + "' must be an epilogue work in projects.json");
  assert.ok(p.thumb, id + " needs a thumb in projects.json (the matrix joins it)");
}

/* ── 同步纪律:产品文案禁止漂移进 portfolio.json ── */
const BANNED = /^(title|one_liner|desc|full_description|body|tech_stack|keywords|award)_(zh|en)$/;
const walkBan = (node, path) => {
  if (Array.isArray(node)) return node.forEach((v, i) => walkBan(v, path + "[" + i + "]"));
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      assert.ok(!BANNED.test(k), "product copy field '" + k + "' at products" + path + " belongs in projects.json, not portfolio.json");
      walkBan(v, path + "." + k);
    }
  }
};
pf.products.forEach((p, i) => walkBan(p, "[" + i + "]"));

/* ── 素材落盘 ── */
const files = [pf.profile.portrait, pf.profile.qr.svg, pf.architecture.index_cover];
for (const prod of pf.products) {
  if (prod.placeholder) continue;
  files.push(prod.cover.shot);
  if (prod.video) files.push(prod.video.poster);
  if (prod.lineart) files.push(prod.lineart.src);
  for (const scene of prod.scenes || []) for (const img of scene.images) files.push(img.src);
}
for (const f of files) {
  assert.ok(exists(f), f + " referenced by portfolio.json must exist");
}

/* ── 页面接线 ── */
for (const f of ["portfolio/index.html", "portfolio/portfolio.css", "portfolio/portfolio.js"]) {
  assert.ok(exists(f), f + " should exist");
}
const html = read("portfolio/index.html");
assert.match(html, /language-toggle\.js/, "portfolio page should reuse the shared language toggle");
assert.doesNotMatch(html, /\bautoplay\b/i, "portfolio must not autoplay media");
assert.match(read("portfolio/portfolio.js"), /config\/portfolio\.json/, "portfolio.js should fetch config/portfolio.json");
assert.match(read("portfolio/portfolio.js"), /config\/projects\.json/, "portfolio.js should join config/projects.json");

console.log("portfolio: all assertions passed");
