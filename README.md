# Alnt Med — The Art of Rationality · 个人站

李文苑的个人网站（Maker02 (4)）。静态站，部署在 GitHub Pages：
**https://leemenuong-prog.github.io/persona-website/**

## 页面 / Pages

| 路径 | 内容 |
|---|---|
| `/` (`index.html`) | 主站 · 理性的艺术。在浏览器里现编译 `rational/*.jsx`（React + Babel），滚到 **WORK** 即是作品区 |
| `/xtool/` | Pear Agent 动态影片（xtool 平台 · 可交互 React 影片；W·02 点开后在框内播放） |

> 注：作品区是主站的 **WORK** 章节，源码在 `rational/sections.jsx`（不是某个单独页面）。
> 仓库里 `Alnt Med - The Art of Rationality.html` 是 `index.html` 的同源副本（设计工具导出名）。

## 作品接线 / Works wiring（`rational/sections.jsx` 的 `WORKS` 数组）

`WorkMedia` 按字段优先级渲染：`video`+`videoReady` → 内嵌 `<video>`；`embed` → 封面点击后框内 `<iframe>`；`poster`(+`link`) → 封面图跳转；`doc` → 打开作品集 PDF；否则 TBD。每个作品可用 `mediaLabel` 覆盖取景框注释。

| 卡片 | 作品 | 媒体方式 |
|---|---|---|
| W·01 | **Pears** · 路演视频 | 内嵌 `<video>`（`works/pears-roadshow.mp4`，459MB→**69MB**）+「访问项目↗」|
| W·02 | **XTOOL · Pear Agent** 动态影片 | 封面点击 → 框内载入 `/xtool/` 互动影片 |
| W·03 | **Peear** · Career Agent | 封面点击 → 框内载入在线 App `pear-agent.vercel.app`（封面 `works/peear-cover.svg`）|
| W·04 | **UABB · AIGC Pipeline** | 内嵌 `<video>`（`works/aftersilence.mp4`，H.264 720p，16MB）|
| W·05 | **After_Silence**（同一 UABB 项目的设计图纸面）| 作品集 PDF · **第 3 页** |
| W·06 / W·07 / W·08 | 上桥 / 风贯·立方 / 环·世界 | 作品集 PDF · 第 **5 / 9 / 18** 页 |

UABB 是同一作品两面：**W·04 = AIGC 影像内容**，**W·05 = 设计图纸（作品集）**。

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
