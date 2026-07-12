# Meco 升级版文案草稿（v4.2 口径 · work-life balance 主线）

> 状态：**草稿，待文苑审定，未接线未提交**。审定后按文末指引改 `config/projects.json` + `config/portfolio.json`。
> 口径：主线 = work-life balance（Meco 帮我把日子过顺）；Schedule 两个身份（管家与老师 / 产品经理）是亮点，不当主线；品牌符号 ✦（蘑菇已退役）。
> 配套新线稿：`assets/project/meco/content/plate-01-balance.svg`（天平构图，同为草稿）。

---

## ① 产品自我介绍 one_liner（产品第一人称，仅此一句）

**方案 B（推荐，带产品经理尾句，句式照 Co-work「；越用越聪明」的先例）**

**zh**
你好，我是 Meco ✦——文苑给自己造的个人管家：一个连着他 Obsidian 知识库的 Mac 应用，每天早上比他先开工，替他打理工作和生活的日常；我还跟他一样兼着产品经理，看他怎么用我，一版一版把自己改得更像他。

**en**
Hi, I'm Meco ✦ — the personal butler Wenyuan built for himself: a Mac app wired to his Obsidian vault, clocking in before him every morning to run the daily grind of work and life; like him, I also work as a product manager — watching how he uses me and rebuilding myself, version by version, to grow more like him.

**方案 A（仅管家，短）**

**zh**
你好，我是 Meco ✦——文苑给自己造的个人管家：一个连着他 Obsidian 知识库的 Mac 应用，每天早上比他先开工，替他打理工作和生活的日常。

**en**
Hi, I'm Meco ✦ — the personal butler Wenyuan built for himself: a Mac app wired to his Obsidian vault that clocks in before he does every morning, and runs the daily grind of work and life for him.

改动说明：去 🍄‍🟫 换 ✦；砍掉「飞书机器人、AI 应用、日程」连接件罗列；装进「每天早上比他先开工」；方案 B 把「跟他一样是个产品经理、一版一版长得更像他」提到开场（07-11 二次指示：自迭代要说清）。

---

## ② 先说结论 · The Short Version（tldr，四行）

**zh**
求职最忙那阵，我的工作和生活散在好几个地方，嘴上说的 work-life balance 根本顾不上。
我要的不是再多下一个 App，而是把手上已有的东西交给 AI 替我打理，别再反过来伺候工具。
于是我一个人做了个 Mac 应用，用 Obsidian 库把生活、工作、求职连成了 Meco；现在它每天早上先我一步开工——排好当天、陪我练面试，还琢磨着自己下一版该改什么。
如今我的一天从它的早报开始，该收工时也有它劝我收工；这个越用越像我的 App，也分享给了几个有同样需要的同学。

**en**
At the busiest stretch of my job hunt, work and life were scattered across half a dozen places — the work-life balance I kept promising myself was nowhere in sight.
I didn't want to install yet another app; I wanted to hand what I already had to an AI and stop waiting on my tools hand and foot.
So I built a Mac app alone and tied life, work and the job hunt into one thing with my Obsidian vault; now Meco clocks in before me every morning — laying out my day, drilling me for interviews, and mulling over what its next version should fix.
These days my day starts with its brief and ends with it telling me to call it a day; the app keeps growing more like me, and I've passed it to a few classmates who needed the same.

> ⚠️ 行3/行4 于 2026-07-11 接线时按 A4 封面页高做过一轮等义精简（原版更长导致作品集 Meco 封面页溢出 297mm 硬裁线），语义全保留。

改动说明：行 1、2 保留原文；行 3 装升级（自迭代明写成「琢磨它自己哪里不顺手、下一版改什么」）；行 4 用「早报开始、劝我收工」收 work-life balance，并落「越用越像我」；「8 个工具」「3 次以上」等数字撤出正文归 metrics。

---

## ③ 为什么做这个 · Why（基本保留）

**zh**
求职那阵，投递记录躺在 Obsidian，提醒散在飞书，复盘全靠手写——三样各在一处，每天光是手动把它们对上，就没了快一个钟头。
想明白之后我发现：缺的不是新工具，工具早就够多了；缺的是一个能自动把我的日常理顺的 AI，和一个愿意自己先动手的管家。

**en**
During the hunt my applications sat in Obsidian, my reminders in Feishu, my reviews in handwriting — three places, and just reconciling them by hand ate close to an hour a day.
Once it clicked, I saw what was missing wasn't another tool; there were plenty. What was missing was an AI that could tidy my day on its own, and a butler who'd start working without being told.

改动说明：只把结尾「愿意替我干活的管家」改成「愿意自己先动手的管家」，为下文埋伏笔。

---

## ④ 核心贡献 · Key Contributions（三条）

**zh**
把飞书机器人、本地接口、日程引擎和桌面窗口装进同一个 Mac 应用——双击就能用，不用部署，也不用伺候一堆服务。
给对话大脑配上能真正动手的工具，也给无人值守的部分立了规矩：检查知识库只报告、不代修，任何写入都要先经我确认，碰上我没收拾完的半成品，它宁可跳过也不动工。
它的每日开工和自迭代，都是 Claude Code 的定时任务在跑；行为准绳则是一份我随时能改的 Markdown 手册——想让管家换个做法，改那页纸就行，改过的每一版都留得住。

**en**
Folded the Feishu bot, the local endpoints, the scheduler and the desktop window into one Mac app — double-click and it runs, nothing to deploy or babysit.
Gave the conversational brain tools that actually do things, and set house rules for the unattended parts: vault checkups report and never repair, anything that writes waits for my yes, and when it finds my half-finished work sitting around, it skips rather than builds on top.
Both its daily shift and its self-iteration run on Claude Code's scheduled tasks; its conduct lives in one Markdown handbook I can edit any time — want the butler to work differently, change that page, and every past version stays on record.

改动说明：条 1 保留；条 2 在只读边界上追加两条真实纪律（体检只报告不代修、不在半成品上动工）；条 3 点名机制——**每日开工与自迭代 = Claude Code 定时任务**，行为准绳 = 一份随时能改的手册（原看板内容并入⑤，不丢）。

---

## ⑤ 系统如何运作 · How It Works（一天到一周的时间轴，三段）

**zh**
每天九点刚过，飞书里会先后收到它备好的三样：当天的安排和接下来几天的提醒、一轮面试陪练、一份 AI 早报。陪练是先让我开口再讲评，连我答题收尾总往产品上拐的老毛病，它都记着；简历建议每天只给一条，攒着攒着就成了一册。
白天我在飞书或桌面窗口里说一句话，它听懂就去调合适的工具——记笔记、设提醒、查看板；看板上的每个数字，都是从两百多篇笔记里实时读出来的。
晚上的日报末尾，总有一句劝我收工的话。到了周五，它换上产品经理的身份，带着一周的使用痕迹——只记在我这台电脑上——琢磨出至多三条迭代：界面上的小改它自己动手，动筋骨的改动先提案，拍板永远在我。我抱怨过「没办法调节想看的板块」，下一版看板就能自己排了。

**en**
Just past nine every morning, Feishu brings me three things it has ready: the day's plan with reminders for the days ahead, a round of interview practice, and an AI industry brief. The practice makes me speak first and critiques after — it even remembers my old habit of steering answers back to product at the end; résumé advice comes one line a day, and the lines have quietly grown into a booklet.
During the day I say one line in Feishu or the desktop window and it calls the right tool — take a note, set a reminder, pull up the boards; every number on those boards is read live out of two-hundred-odd notes.
At night the daily log always ends with a line telling me to knock off. On Fridays it puts on its product-manager hat and, with a week of usage traces — kept only on this machine — works out at most three iterations: small interface changes it makes itself, anything structural goes in as a proposal, and the final call is always mine. I once complained I couldn't rearrange which boards I see, and the next version let me lay them out myself.

改动说明：整段重写成「早 / 日间 / 晚+周五」三拍——早=管家与老师（不按 9:00/9:02/9:09 列条，写成「到货的三样」），晚=劝收工，周五=**产品经理点名出场**（埋点只存本机、≤3 条迭代、小改自己动手/大改提案/拍板归我，例子用板块那次真实迭代）。

---

## ⑥ 影响与意义 · Impact（三段）

**zh**
每天的手动整理比过去少了九成——时间更多花在琢磨明天，而不是誊抄今天。
前阵子扁桃体发炎，我没硬撑，踏实歇了两天，周报里它替我记下一句：「病了就歇」的判断是对的。在它那儿，求职的目标和健身的计划，从来都是并排放着的。
它不只打理我的日常——它跟我一样是个产品经理，看我怎么用它，就一版一版把自己改得更顺手、长得更像我；这大概是它和货架上任何一个软件最不一样的地方。

**en**
The daily hand-tidying is down by ninety percent — more of my time goes to thinking about tomorrow instead of copying out today.
A while back my tonsils flared up; I didn't push through, I properly rested for two days — and in the weekly review it wrote the call down for me: resting when sick was the right decision. In its books, the job-hunt goal and the workout plan have always sat side by side.
It doesn't just keep my days in order — like me, it's a product manager: it watches how I use it and rewrites itself, version by version, into something more my shape; which is probably what sets it apart from anything off the shelf.

改动说明：行 1 保留；行 2 换成生病歇两天的真事 + 求职目标和健身计划并排（work-life balance 的实证）；行 3 收束句直接落「**它跟我一样是个产品经理**、一版一版长得更像我」（07-11 二次指示），原「工具主动来找我」的意思已在②行 2 里，不重复。

---

## ⑦ 技术栈 · Stack

**zh**：Python · FastAPI · pywebview · 飞书开放平台（长连接）· Obsidian · Tavily · Claude / LLM · Claude Code · Cowork Schedule
**en**：Python · FastAPI · pywebview · Feishu Open Platform · Obsidian · Tavily · Claude / LLM · Claude Code · Cowork Schedule

改动说明：追加 Cowork Schedule，与 Claude Code 相邻。

---

## keywords 建议（三枚，projects.json）

- **方案 A（推荐）**：`个人管家 | Work-life balance | 知识库` / `Personal butler | Work-life balance | Knowledge base`
- 方案 B（不动）：`个人管家 | 自我成长 | 知识库` / `Personal butler | Self-growth | Knowledge base`

## metrics 建议（四条，portfolio.json）

| 现行 | 建议 | 理由 |
|---|---|---|
| `3+ 每天打开次数 / OPENS A DAY` | **保留** | 真实黏性 |
| `-90% 人肉搬运 / MANUAL CARRYING` | **保留** | 核心收益 |
| `4+ 每日自动任务 / DAILY ROUTINES` | **改为 `3 晨间自动任务 / MORNING RUNS`** | 现实是 3 条 Cowork 定时任务（9:00 日报 / 9:02 课堂 / 9:09 早报），别过度声称 |
| `200+ Obsidian 知识条目 / VAULT NOTES` | **改为 `240+ 知识笔记 / VAULT NOTES`** | 07-11 实测 246 篇 |

备选池（想换着用）：`20+ 天连续日报 / DAILY BRIEFS`（陪伴感）· `9 个版本 / RELEASES`（成长感）。

## 线稿铭句候选（portfolio.json lineart.motto 与 SVG 烧录同句）

1. **推荐：`Work one side, life the other.` /「工作一头，生活一头」**——暗续旧铭「三头一线」的「头」字血脉；不点破 balance，图文不互相重复。（新线稿现按此句烧录）
2. `It keeps my days in balance.` /「它替我把日子端平」——中文「端平」有人味，英文稍平。
3. `A day in balance.` /「一天，两头都平」——最短，但离图太近略图解。

选 2 或 3 的话，SVG 底部铭句一行即改，说一声就重新生成。

## 新线稿 plate-01-balance.svg 释义

天平立在知识库上：底座厚板=**the vault**（侧面蚀刻沉积线=笔记地层）；带刻齿的鼓=**the schedule** 作支点（鼓面小表盘指九点整；顶圈刻齿里三道略深=三条晨间任务，不加注记）；✦ 悬在刀口正上方——日程是支点，星在支点上。横梁水平（等轴测下沿右轴），两端吊盘：一盘迷你看板窗=**the work**，一盘球=**the life**（日报总劝我去打球）——不一样的东西，一样的分量；一条 dash 2 6 构造线平行横梁贯穿两盘沿口=制图员的「水平证明」；两盘正下方各一圈虚线投影，落在同一块底座上。底座右前脸开一只半拉的抽屉=**the changes**：抽屉前脸一粒小 ✦ 作把手，缝里立着一角图纸，一条单程虚线从鼓底低低扫进抽屉——产品经理在地基里改图纸，退居次要（无 L0 线宽、占画面 <10%）。注记 5 枚：the work. / the life. / the schedule.（19px）+ the vault. / the changes.（17px）。

规范自检已过：viewBox 0 0 1200 750 · 满幅白底 · 仅四灰 #181818/#6F6F6F/#BEBEBE/#E0E0E0（+注记 #999 白晕）· vector-effect: non-scaling-stroke · 铭句 Garamond 斜体 26px y=706。

## 审定后接线指引（本稿不动任何现行文件）

1. **文案**：①-⑦ 全部只改 `config/projects.json` meco 条目（one_liner / sections.tldr / why_built / key_contributions / how_it_works / why_it_matters / tech_stack 的 zh+en；keywords_zh/en）。
2. **线稿**：`config/portfolio.json` products[meco].lineart.src → `assets/project/meco/content/plate-01-balance.svg`，motto/motto_zh 换选定铭句（作品集页+详情页两处自动同换）；`projects.json` sections.tldr.figure.src 建议同步换掉（经典模式素材，保持一致）。
3. **metrics**：改 `config/portfolio.json` products[meco].metrics 四条。
4. `desc_zh/en`、`full_description_zh/en`（列表页/长摘要）本稿未动，接线时若要同步「先我一步开工」口径再顺手改。
5. 提交前：跑 `node --test tests/portfolio.test.mjs`；开作品集页看 Meco 四页有无溢出红描边（②③⑤各行都比原文长了一点）；确认 `plate-01-loop.svg`（上一版循环构图草稿，未跟踪）是否删除。

## 风格自检（已做）

- 禁词扫描：无「一套系统 / 三件套 / 抓手 / 三段管线」等打包黑话；无蘑菇 emoji；无 STAR 字样；无计数填充语；英文无 seamless / empower / effortless 类营销词。
- 引号引用共 2 处（「没办法调节想看的板块」「病了就歇」），不再多。
- 自迭代线（07-11 二次指示后加重说清）：机制点名 1 处（④条3 = Claude Code 定时任务）；「产品经理」身份点名 3 处（①方案B、⑤周五段、⑥收束）；行为描写 2 处（②行3、⑤行3）。主线仍是 work-life balance：①②⑥的首尾位都落在「打理日常 / 劝收工 / 日子」上。
- 正文数字只留：九成、两百多篇、至多三条；其余全在 metrics。
