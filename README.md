# 李文苑 Alnt Med — 个人作品集站

照老师站（wenxin.design）架构复刻的**纯静态多页站**：无框架、无构建，
作品数据集中在一个 `config/projects.json` 里驱动渲染。2026-07-06 大改版上线，
旧 React 单页版完整保留在 git 历史（`ba7ebcd` 之前）。

- **线上（主）**：https://alnt-med.netlify.app/ — push `main` 后由 GitHub Actions 自动部署
- **GitHub Pages 镜像**：https://leemenuong-prog.github.io/persona-website/（根目录 `.nojekyll` 必需）

## 页面结构

| 页面 | 内容 |
|---|---|
| `index.html` | 首页：两行 intro → 3D 立方体 → 中轴滚动线+珠 → **主线 5 大卡**（AI 产品/AIGC）→ **尾声网格 6 建筑作品** |
| `project.html?id={id}` | 作品详情模板：标题(外链↗)/keywords/奖项/Meta/tags → 媒体（本地视频门面 / iframe 门面）→ 正文（四段式，缺段回退 full_description）→ Tech → 内容长图 + 文字球图注 + lightbox |
| `projects.html` | 全部作品索引（主线组 + 尾声组） |
| `about.html` | 关于：BarWord 标题 · 画像 · 履历时间线 · PDF 下载 · 联系 |
| `around.html` | 档案柜：两份 PDF、线上 demo 直达、xtool 交互影片 |
| `xtool/` | Co-work 交互影片子页（Co-work 详情页门面点开后内嵌） |

## 数据：config/projects.json（单一事实源）

11 个作品一站式：`main: true` = 主线（sort_order 1-5），`false` = 尾声（6-11）。
双语字段一律 `*_zh` / `*_en`。加作品 = 加一条 JSON + 放好素材，不改代码：

```
assets/project/{id}/
├── thumbnails/1.jpg    # 720×720 方图（首页卡/网格/索引通用）
├── float/1.jpg         # 揭示层（鼠标 clip-path 圆随行显影；可省略→自动降级单图）
└── content/1.jpg, 2..  # 详情页长图序列（JSON contentImages 显式列出，不做 404 扫描）
```

媒体字段 `media[]`：`video-local`（本地 mp4，封面门面点击才拉流）/ `iframe-lazy`（封面门面点击才注入 iframe，配 cta_url 兜底）。
图注 `annotations`：`{"图序号": {kick_zh/en, body_zh/en}}` → 图右下角 12px 文字球。

## 大文件纪律（不变）

GitHub 单文件硬上限 100MB。视频一律 ffmpeg 压 H.264 + `+faststart` 再入库，原片留 `../源文件/`：

```bash
ffmpeg -y -i 原片.mp4 -c:v libx264 -crf 26 -preset slow -vf "scale=1920:-2" \
       -movflags +faststart -c:a aac -b:a 128k works/xxx.mp4
```

现状：`works/pears-roadshow.mp4` 16MB（73MB 版重压，原片 481MB 在源文件）· `works/aftersilence.mp4` 16MB。

## 本地预览

```bash
cd persona-website && python3 -m http.server 8080
# file:// 下 fetch(projects.json) 会被拦，必须走 HTTP
# Claude Code 内可用预览配置 persona-site（端口 8099）
```

## 设计语言

见 `CLAUDE.md`：目标站灰阶体系（暖白径向渐变 + 11 级灰）+「.IAM. 数据条」品牌带灰阶版。
资产文件名**全小写**（GH Pages 大小写敏感）。
