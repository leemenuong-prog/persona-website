# Alnt Med — The Art of Rationality · 个人站

李文苑的个人网站（Maker02 (4)）。静态站，部署在 GitHub Pages：
**https://leemenuong-prog.github.io/persona-website/**

## 页面 / Pages

| 路径 | 内容 |
|---|---|
| `/` (`index.html`) | 主站 · 理性的艺术。在浏览器里现编译 `rational/*.jsx`（React + Babel）。**Whoami 之后即是作品画廊（WORKS）** |
| `/xtool/` | Pear Agent 动态影片（xtool 平台 · 可交互 React 影片；Co-work 介绍页点开后在框内播放） |

> 注：作品区是主站 Whoami 之后的 **WORKS 画廊**，源码在 `rational/sections.jsx`（不是某个单独页面）。
> 仓库里 `Alnt Med - The Art of Rationality.html` 是 `index.html` 的同源副本（设计工具导出名）。

## 章节流 / Chapter flow（2026-07-06 改版：作品为主角、身份合并两组）

```
Hero → Whoami(两身份 01 AIPM / 02 Architect) → WorksGallery(六竖卡网格墙)
→ AIPM 章:ChAipmOpen 开场 + IntroPears / IntroCowork / IntroYijian / IntroMeco
→ Architect 章:ChArch 开场 + IntroUabb(多模态) / IntroArchfolio(建筑作品集翻书 + logo 展开收尾)
→ Contact(底部波点带 .fdots)
```

渲染顺序在 `rational/app.jsx`；身份章 + 介绍章在 `rational/chapters.jsx`；画廊 + 数据在 `rational/sections.jsx`。

## 作品接线 / Works wiring（`rational/sections.jsx` 的 `WORKS` 数组 · 六卡）

画廊卡（`GalleryCard`）= 竖向 3:4 英雄封面（正式封面未上传前用 `CoverArt` 程序化占位）+ 卡面信息；点整卡 `jump(introId)` 平滑滚到对应介绍章。介绍章的媒体复用 `WorkMedia`（`pages`→翻书；`video`+`videoReady`→`<video>`；`embed`→框内 `<iframe>`；`doc`→PDF；否则 TBD）。

| 卡 | key | 作品 | group | 介绍锚点 · 媒体 |
|---|---|---|---|---|
| G·01 | `pears` | **Pears** — Agent Factory | aipm | `#intro-pears`：8 帧 deck 自动翻页 + 路演 `<video>` |
| G·02 | `cowork` | **Co-work** Agent Platform | aipm | `#intro-cowork`：三对页 + `/xtool/` 互动影片 |
| G·03 | `yijian` | **议见 Yijian** — Consensus Engine | aipm | `#intro-yijian`：封面点开 `yijian-demo4` iframe |
| G·04 | `meco` | **Meco**（进行中） | aipm | `#intro-meco`：In Progress 占位板（内容待补）|
| G·05 | `uabb` | **多模态工具**（UABB · AIGC Pipeline） | architect | `#intro-uabb`：`<video>`（`works/aftersilence.mp4`）|
| G·06 | `archfolio` | **建筑作品集**（原 W·01–04 合并） | architect | `#intro-archfolio`：四作合并翻书（12 页）+ 名录 + PDF CTA + logo 展开收尾 |

建筑四作原对象整体保留在 `ARCH_WORKS`（`pages[]`/`doc`/`award` 一字不动），archfolio 卡的翻书 = `ARCH_WORKS.flatMap(w=>w.pages)`。CTA 链接章内按 `w.key` 查询。文案口径见 `CLAUDE.md` 的「语言规范」。

## 关于文件大小 —— 一律用「小文件」

GitHub 单文件硬上限 **100MB**，超过直接拒绝；Pages 也有带宽限制，大文件拖慢加载。所以视频都用 ffmpeg 压成浏览器通用的 H.264 才入库，原片留在本地：

| 文件 | 处理 |
|---|---|
| 路演视频 | 459MB 原片 → **69MB**（`works/pears-roadshow.mp4`，1080p，`+faststart` 边下边播）。原片不入库 |
| Aftersilence | **16MB** H.264 720p，直接入库内嵌 |
| 作品集 PDF | 压缩版 **8.6MB**（`uploads/portfolio.pdf`）。原版 131MB **不入库** |
| xtool Pear Agent | 交互式 React 作品（~28MB 含 GIF），作为 `/xtool/` 子页 |

### 路演视频怎么压的（ffmpeg，`brew install ffmpeg`）

源片 3324×2160 / 60fps / HEVC（浏览器对 HEVC 支持不全）→ 两遍编码转 H.264：

```bash
VF="scale=-2:1080,fps=30"
ffmpeg -y -i 原片.mp4 -c:v libx264 -b:v 3800k -pass 1 -vf "$VF" -pix_fmt yuv420p -preset medium -an -f mp4 /dev/null
ffmpeg -y -i 原片.mp4 -c:v libx264 -b:v 3800k -pass 2 -vf "$VF" -pix_fmt yuv420p -preset medium -profile:v high -c:a aac -b:a 128k -movflags +faststart works/pears-roadshow.mp4
```

## 本地预览 / Run locally

需要本地 HTTP server（`file://` 下 `.jsx`、`<iframe>`、CDN 会被拦）：

```bash
cd persona-website
python3 -m http.server 8080   # 打开 http://localhost:8080/ ，滚到 WORK
```

## 设计语言 / Design language

见 `CLAUDE.md`：跳动的数据条（字⇄条），仅用 cobalt `#0047AB` / ink `#0b0b0e` / paper `#efece6`，点缀色只落在「点」上。新增的 WORKS 媒体（视频 / 嵌入 / 封面）沿用此语言。
