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
| W·01 | **Pears**（01pear · 路演视频） | 封面图 → 跳转线上站 `pear-work-web.vercel.app`（视频太大，见下） |
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
| **PeersWork 路演视频** | ❌ **459MB，不入库**。目前用「封面图 + 跳转线上站」的方式接入 |
| 作品集 PDF 原版 131MB | ❌ 不入库 |

### 459MB 路演视频以后怎么补？

任选其一，把链接填回 `works-proto/works-expand.jsx` 里 W·01 的 `media`：

1. **上传到 B 站 / YouTube**，把卡片 `media` 改成 `{ kind: "iframe", href: "<嵌入链接>", poster: "../works/pears-roadshow-cover.jpg" }` —— 推荐，省带宽、能流式播放。
2. **压到 100MB 以下**（如 1080p→720p、码率降低）放进 `works/pears-roadshow.mp4`，再改成 `{ kind: "video", src: "../works/pears-roadshow.mp4", poster: "..." }`。
3. 保持现状（封面图跳转 vercel 线上站）。

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
