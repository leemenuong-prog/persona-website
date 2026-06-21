# Alnt Med — The Art of Rationality · 个人站

李文苑的个人网站（Maker02 (4)）。静态站，部署在 GitHub Pages。

## 页面 / Pages

| 路径 | 内容 |
|---|---|
| `/` (`index.html`) | 主站 · 理性的艺术（自包含单文件，已内联所有资源） |
| `/works-proto/` | **WORKS · 作品**：可翻动的卡片展柜，逐张解码作品（本次接入的核心） |
| `/xtool/` | Pear Agent 动态影片（xtool 平台 · 可交互 React 影片，W·02 点开后在框内播放） |

## 作品接线 / Works wiring（`works-proto/works-expand.jsx`）

| 卡片 | 作品 | 媒体方式 |
|---|---|---|
| W·01 | **Pears**（01pear · 路演视频） | 内嵌 `<video>` 直接播放（459MB 原片压成 1080p/H.264 **~69MB**），并带「访问项目 ↗」「作品集 PDF ↗」副入口 |
| W·02 | **Pear Agent**（xtool 平台 Agent 动态影片） | 封面 → 点击在框内 `<iframe>` 载入 `/xtool/` |
| W·03 | 作品集收录 | 打开作品集 PDF |
| W·04 | **Aftersilence**（UABB 影像） | 内嵌 `<video>` 直接播放（16MB，仓库内） |
| W·05–W·08 | 作品集收录 | 打开作品集 PDF |

每张真实卡片都带「作品集 PDF ↗」副入口，页头也有「完整作品集 PDF ↗」按钮，用户随时能打开作品集。

## 关于文件大小 —— 本仓库一律用「小文件」

GitHub 单文件硬上限 **100MB**，超过直接拒绝；GitHub Pages 也有带宽限制，大文件会拖慢用户加载。所以：

| 文件 | 处理 |
|---|---|
| 作品集 PDF | ✅ 用压缩版 **8.6MB**（`uploads/portfolio.pdf`）。原版 131MB **不入库**（传不上去，用户也打不开） |
| Aftersilence 影像 | ✅ **16MB**，直接入库内嵌播放 |
| xtool Pear Agent 影片 | ✅ 交互式 React 作品（~28MB 含 GIF），作为 `/xtool/` 子页 |
| PeersWork 路演视频 | ✅ 459MB 原片 → **压成 1080p/H.264 ~69MB**（`works/pears-roadshow.mp4`），`-movflags +faststart` 边下边播。原片不入库 |
| 作品集 PDF 原版 131MB | ❌ 不入库 |

### 路演视频是怎么压的？

源片是 3324×2160 / 60fps / HEVC（浏览器对 HEVC 支持不全），用 ffmpeg 两遍编码转成通用的 H.264：

```bash
VF="scale=-2:1080,fps=30"
ffmpeg -y -i 原片.mp4 -c:v libx264 -b:v 3800k -pass 1 -vf "$VF" -pix_fmt yuv420p -preset medium -an -f mp4 /dev/null
ffmpeg -y -i 原片.mp4 -c:v libx264 -b:v 3800k -pass 2 -vf "$VF" -pix_fmt yuv420p -preset medium -profile:v high -c:a aac -b:a 128k -movflags +faststart works/pears-roadshow.mp4
```

想换更清/更大的视频，也可以传 B 站/YouTube，把 W·01 的 `media` 改成 `{ kind: "iframe", href: "<嵌入链接>", poster: "../works/pears-roadshow-cover.jpg" }`。

## 本地预览 / Run locally

需要用本地 HTTP server（`file://` 下 `.jsx`、`<iframe>`、CDN 会被拦）：

```bash
cd persona-website
python3 -m http.server 8080
# 打开 http://localhost:8080/            主站
# 打开 http://localhost:8080/works-proto/  作品
```

## 设计语言 / Design language

见 `CLAUDE.md`：跳动的数据条（字⇄条），仅用 cobalt `#0047AB` / ink `#0b0b0e` / paper `#efece6`，点缀色只落在「点」上。新增的 WORKS 媒体与作品集框沿用此语言。
