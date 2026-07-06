import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

/* 2026-07-06 wenxin 式改版结构守卫:纯静态多页站(无框架无构建),
   config/projects.json 单一事实源,素材按 assets/project/{id}/ 约定放置。
   旧 React 站(rational/)已退役,见 git 历史快照 ba7ebcd。 */

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (file) => readFileSync(join(root, file), "utf8");
const exists = (file) => existsSync(join(root, file));

/* ── 五个页面 + 404 存在且是完整 HTML ── */
const PAGES = ["index.html", "projects.html", "project.html", "about.html", "around.html", "404.html"];
for (const page of PAGES) {
  assert.ok(exists(page), page + " should exist");
  assert.match(read(page), /<html/i, page + " should be an HTML document");
}
for (const page of PAGES.slice(0, 5)) {
  assert.match(read(page), /js\/main\.js/, page + " should load the shared js/main.js");
}

/* ── 旧 React 站不得回魂 ── */
assert.ok(!exists("rational"), "the retired rational/ React app must stay deleted");
for (const page of PAGES) {
  assert.doesNotMatch(read(page), /rational\//, page + " must not reference the retired rational/ app");
}

/* ── projects.json 可解析:11 作品,主线 5 作在前、尾声建筑 6 作在后 ── */
const data = JSON.parse(read("config/projects.json"));
assert.ok(Array.isArray(data.projects), "projects.json should carry a projects array");
const projects = data.projects;
assert.equal(projects.length, 11, "the site holds 11 works");

const ids = projects.map((p) => p.id);
assert.deepEqual(
  ids,
  ["pears", "cowork", "yijian", "meco", "uabb",
   "after-silence", "upper-via", "air-cube", "hidden-lingnan-garden", "vista-out", "ring-world"],
  "work order: five mainline AI works, then the six-architecture epilogue",
);

const mainline = projects.filter((p) => p.main === true);
assert.deepEqual(mainline.map((p) => p.id), ids.slice(0, 5), "exactly the first five works are mainline (main: true)");
for (const p of projects.slice(5)) {
  assert.equal(p.category, "Architecture", p.id + " should be an Architecture epilogue work");
}

/* ── 每作字段齐备(加作品零代码的前提是数据完整) ── */
const REQUIRED = ["id", "main", "category", "category_zh", "category_en", "desc_zh", "desc_en",
                  "one_liner_en", "full_description_zh", "full_description_en", "media", "contentImages", "links", "float"];
for (const p of projects) {
  for (const field of REQUIRED) {
    assert.ok(field in p, p.id + " should carry the " + field + " field");
  }
  assert.ok(Array.isArray(p.contentImages) && p.contentImages.length > 0, p.id + " should list its content page images");
}

/* ── 素材落盘:封面缩略图 + json 里引用的每个本地文件都真实存在 ── */
for (const p of projects) {
  const thumbDir = join(root, "assets", "project", p.id, "thumbnails");
  const thumbs = existsSync(thumbDir) ? readdirSync(thumbDir) : [];
  assert.ok(thumbs.some((f) => /^1\.(jpg|jpeg|png|svg|webp)$/i.test(f)),
    p.id + " should have a cover thumbnail assets/project/" + p.id + "/thumbnails/1.*");
}
const referenced = [];
for (const p of projects) {
  referenced.push(...p.contentImages.map((src) => [p.id, src]));
  if (p.float && p.float.reveal) referenced.push([p.id, p.float.reveal]);
  for (const m of p.media || []) {
    for (const src of [m.src, m.poster]) {
      if (src && !/^https?:/.test(src)) referenced.push([p.id, src]);
    }
  }
}
for (const [id, src] of referenced) {
  assert.ok(exists(src), id + " references a missing file: " + src);
}

/* ── 数据接线:main.js 拉取 projects.json,详情页按 ?id= 查询 ── */
assert.match(read("js/main.js"), /fetch\(['"]config\/projects\.json['"]\)/, "js/main.js should fetch config/projects.json");
assert.match(read("js/project-detail.js"), /URLSearchParams\(location\.search\)\.get\(['"]id['"]\)/,
  "project.html should resolve the work from the ?id= query param");
assert.match(read("project.html"), /js\/project-detail\.js/, "project.html should load js/project-detail.js");

/* ── 播放纪律:门面点击加载,顶层页面不写 autoplay ── */
for (const page of PAGES) {
  assert.doesNotMatch(read(page), /\bautoplay\b/i, page + " must not autoplay media (facade click-to-load only)");
}

/* ── 小文件纪律:仓库内(除 .git)不得出现 >95MB 的文件(GitHub 硬上限 100MB) ── */
const LIMIT = 95 * 1024 * 1024;
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile()) {
      const size = statSync(full).size;
      assert.ok(size < LIMIT, full.slice(root.length) + " is " + (size / 1e6).toFixed(0) + "MB — masters belong in 源文件/, not the repo");
    }
  }
};
walk(root);

/* ── GitHub Pages 镜像:.nojekyll 必需(xtool bundle 含下划线目录) ── */
assert.ok(exists(".nojekyll"), ".nojekyll must exist so GitHub Pages serves xtool/_ds/");

console.log("site-structure: all assertions passed");
