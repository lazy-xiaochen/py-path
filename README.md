# Py径 · Python 学习实验室

Py径是面向中文学习者的 Python 网页平台。基础篇包含 12 节课程、118 个可编辑示例、46 道理解题、80 道章内编程题（含 2 道选做热身）和 6 道章外题。命令行记账本是可提交的结项任务，另有文本词频统计练习。网页使用 Vite、TypeScript、CodeMirror 和浏览器隔离运行的 Python 3.12.7（Pyodide 0.27.7）。

## 在本机启动

需要 Node.js 22.18 或更高版本、npm 和支持运行隔离环境的浏览器。本项目使用 Chrome 完成浏览器验收。Windows PowerShell 如限制执行 npm 脚本，可以把以下命令里的 npm 换成 npm.cmd。

```sh
npm ci
npm run dev
```

打开终端给出的本地地址，默认是 http://127.0.0.1:5173/。依赖安装需要连接 npm；开发或静态预览时，解释器资源与网页一起由本机提供。无需另外安装 Python。

## 使用平台

- **从零开始**（`#learn`）。可以按路线学习，也可以跳课。全篇共 124 项计入进度的章内检查与练习，每章 8–12 项。P001、P025 是选做热身并保有独立通过记录。示例可修改后运行，带预期异常的示例可从错误位置跳转。第 12 课可进入结项任务和章外练习。
- **题库练习**（`#bank`）。可按题号、标题或知识点搜索，组合筛选练习范围、难度、来源、完成状态。`#bank/independent` 只显示章外新题，可按入门迁移、跨知识点、综合进入。题面标出先修和知识点。试跑样例使用题面的输入与样例附件。提交从样例起逐组检查，首次失败后停止，全部通过记录 AC。
- **专项复习**。速查知识点、典型错误、练习完成度和作答正确率。知识题答错或编程评测失败会进入待重做列表，重做成功后移出。正确率以已记录的作答与编程提交为分母。试跑示例和样例均不计入。
- **在线工作台**。可新建、切换、重命名、删除和批量导入 UTF-8 文件，选择一个 .py 文件作为入口。先填写标准输入再运行，每次 input() 对应一行。工作台进入后会提前准备隔离解释器。每份准备好的环境只执行一次，离开工作台或就绪后闲置 60 秒会释放。点击错误位置可跳到对应文件，源码变动之后会标记旧结果。工作台和两个综合项目分别保存文件。

### 题目契约与结项

- **标准输入输出**。统一 CRLF、CR 和 LF。普通题忽略行尾空白及末尾空行，精确文本题保留空白和空行，允许省略最后一行的结束换行。P041、P062 已发布的比较规则沿用。精确比较报告首处差异。
- **函数接口**。P076 和 P085 导入 `main.py` 后按签名传参，在同一隔离实例内多次调用并比较实际返回值与类型。导入和调用期间应保持输入输出安静。
- **多文件**。P077 检查 `main.py` 和 `parcel.py` 是否齐备，安静地导入、调用报价接口，再在独立运行中检查入口输出。提交页可以编辑、新建或导入 Python 文件。
- **文件产物**。P078、P079 为每组测试挂载题面声明的 UTF-8 文件。评测读取同一次运行结束时的声明产物，核对实际内容、行尾与文件布局。试跑时可在结果中展开产物。P080 提供会发生零除的起始代码，保留定位到源文件行的运行诊断。
- **命令行记账本**（`#project/ledger`）。从 `main.py` 和 `ledger_tools.py` 两个起始文件完成任务，先用样例与自拟输入测试，再提交。评测校验金额函数、标准输出和实际 `ledger.csv`。覆盖空账本、格式错误、重复、并列与 CSV 引号。项目通过记录独立于课程进度。

样例失败可检查期望与实际输出，非样例反馈给出失败类别与排查位置。测试数据随静态网页提供，浏览器评测适用于自练。

草稿、每题最近 30 次提交、通过状态、错题、课程进度和多文件工作区存入浏览器的本地存储。章节记住所选示例、自定义输入和最近一次运行结果。题库试跑、工作台和项目也会保留最近一次运行结果。历史输出、异常详情和文件预览分别最多保存前 4096 个字符。旧题号与旧草稿仍可访问。已有记账本旧草稿的用户可以在项目页新建 `ledger_tools.py` 并保留原 `main.py`。切换端口、域名或浏览器后会使用对应的存储，清理站点数据会清除记录。

## 课程内容与题目来源

新课资料位于 src/lessons/，结构由 src/teaching-types.ts 定义。每课包含目标、前置知识、分主题讲解、可运行示例、逐选项反馈、编程练习、常见错误、总结与引用。参考资料随课程提供。

题库可筛选原创和经典改编。以下改编题共享原题的知识点，本平台重写了情境、输入输出和测试用例。

- P030「展演时段核算」练习混合格式读入和数值计算。[AtCoder PracticeA · Welcome to AtCoder](https://atcoder.jp/contests/abs/tasks/practice_1)
- P032「剧场翻牌」练习用乘积奇偶性决定是否改变状态。[AtCoder ABC086A · Product](https://atcoder.jp/contests/abs/tasks/abc086_a)
- P038「按数位和筛查编号」练习逐位处理、筛选和双重累计。[AtCoder ABC083B · Some Sums](https://atcoder.jp/contests/abs/tasks/abc083_b)
- P042「回文差异定位」用双指针比较原文中的字母和数字、保留不匹配的位置。[LeetCode 125 · Valid Palindrome](https://leetcode.com/problems/valid-palindrome/description/)
- P046「桌游三队轮选」用降序排序和取模计算三队得分。[AtCoder ABC088B · Card Game for Two](https://atcoder.jp/contests/abs/tasks/abc088_b)
- P050「双箱投票汇总」练习分组计票、求交集与报告并列最高结果。[AtCoder ABC155C · Poll](https://atcoder.jp/contests/abc155/tasks/abc155_c?lang=en)
- P053「反复整除取因子」通过重复整除练习递归停止条件和双值返回。[LeetCode 326 · Power of Three](https://leetcode.com/problems/power-of-three/description/)
- P058「最小整数接收半径」练习比较平方距离和精确整数开方。[AtCoder ABC255B · Light It Up](https://atcoder.jp/contests/abc255/tasks/abc255_b?lang=en)
- P062「清理公告备注并导出副本」练习逐行文件处理、成对分隔符和布局保留。[AtCoder ABC344A · Spoiler](https://atcoder.jp/contests/abc344/tasks/abc344_a?lang=en)
- P066「导入旧日志中的整数前缀」练习批量解析以及缺失和截断分类。[LeetCode 8 · String to Integer (atoi)](https://leetcode.com/problems/string-to-integer-atoi/description/)
- P070「归并两份有序领件清单」练习双指针归并与分组计数。[LeetCode 88 · Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/description/)
- P081「夜场巡检发车牌」用可变到达时刻和准备时长练习整数取整与跨日。[洛谷 P5707 · 上学迟到](https://www.luogu.com.cn/problem/P5707)
- P082「展演补位名单」从未排序的登记表确定排名门槛，再按登记顺序输出并列人员。[Codeforces 158A · Next Round](https://codeforces.com/problemset/problem/158/A)
- P083「接连翻转两段路标」允许中文和空白，连续执行两个可重叠区间的翻转。[AtCoder ABC233 B · A Reverse](https://atcoder.jp/contests/abc233/tasks/abc233_b?lang=en)
- P084「签到重复时刻」允许空清单，并报告首次重复的位置与全部重复次数。[LeetCode 217 · Contains Duplicate](https://leetcode.com/problems/contains-duplicate/description/)

出处用于查阅公开原题。本站各改编题自写题面、数据、提示和参考实现。本次核验覆盖公开出处与题意，原题正文、样例和评测包的转载许可未作核验。章外 P085、P086 为原创。

## 测试与静态构建

```sh
npm test
npm run build
```

上面两条命令分别运行单元测试，并完成类型检查和静态构建。静态产物在 dist/，包括页面、编辑器和本地解释器资源。

真实浏览器测试会先构建，再在本机的 /py-path/ 子路径启动静态预览。使用 Playwright 自带 Chromium 时，先执行 npx playwright install chromium，再执行 npm run test:e2e。直接用本机安装的 Chrome 时，可在 PowerShell 中运行：

```powershell
$env:PLAYWRIGHT_CHANNEL = 'chrome'
npm.cmd run test:e2e
```

手动模拟仓库子路径：

```sh
npm run preview -- --base /py-path/ --port 4175 --strictPort
```

在 http://127.0.0.1:4175/py-path/ 打开首页，然后进入工作台运行一次。页面、编辑器和解释器资源都应从该子路径加载；专用 Worker 由隔离 iframe 创建。请通过 HTTP 或 HTTPS 访问站点。

基础目录位于 src/content.ts，章内新题、章外题及结项数据位于 src/lessons/。标准输出规则在 src/judge.ts，提交契约在 src/assessment.ts 和 src/assessment-types.ts，执行协议在 src/runner.ts、src/isolate.js 和 src/python-worker.js。浏览器回归覆盖章节示例、全题库参考解、结项和关键错误版本。详见 [教学覆盖清单](教学覆盖清单.md) 与 [基础篇最终验收](基础篇最终验收.md)。

## 隔离与使用限制

- 主页面从自身站点读取固定的 Pyodide 资源。运行器创建仅授予 allow-scripts 的 sandbox iframe，在不透明来源中启动专用 Blob Worker。iframe 检查来源和本地存储权限，Worker 检查来源，并要求收到实际生效的 connect-src 拦截事件。验证完成后才接收本次所需的文件快照、入口和标准输入。隔离验证失败时运行会禁用。
- Worker 的内容安全策略禁止网络连接和外部脚本；解释器从已传入的本地资源启动。访客代码留在浏览器内，不上传、也不会在服务器或 CI 中执行。首版不支持任意联网或在线装包。
- 单次执行最多 20 个文件，源码及数据文件总计 128 KiB，标准输入 32 KiB。解释器就绪后每次隔离运行最多 2 秒，标准输出和标准错误合计最多 64 KiB。声明的 UTF-8 文件产物另限合计 64 KiB。停止、超时或输出超限会结束对应 Worker。
- 浏览器无法保证严格的单次运行内存配额；极端分配可能耗尽标签页内存。每次运行从文件快照建立临时目录，运行中创建的文件随运行结束丢弃。工作区支持单层文件名。
- 目前完成验收的浏览器以测试记录为准。浏览器若阻止 Blob Worker、WebAssembly 或无法确认 CSP 生效，页面会显示隔离环境不可用。

## 自行上传源码到 GitHub

1. 在 GitHub 上创建你自己的空仓库。使用 Git 或 GitHub Desktop 把本地项目提交到默认分支，然后发布到该仓库。首次使用 Git 时，可参考 GitHub 的[上传现有项目指南](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github)。
2. 提交入口 index.html、src/、tests/、vite.config.ts、tsconfig.json、playwright.config.ts、package.json、package-lock.json、README.md 和 .gitignore。dist/ 如需随版交付，可以一并保留。安装依赖后，本地构建会从 Pyodide 依赖复制解释器资源。依赖目录、生成的 public/runtime/ 和本地缓存由 .gitignore 排除。
3. 上传完成后，在仓库文件页核对 README、依赖锁文件和课程源码。

## 可选 · 手动发布到 GitHub Pages

1. 在本机运行 npm ci 和 npm run build，再用上述 /py-path/ 预览命令检查静态产物。
2. 在 GitHub 上从默认分支建一个单独的 pages-release 分支。把 dist/ 的**内容**上传到该分支的 docs/，使入口成为 docs/index.html，同级保留 assets/ 和 runtime/。在 docs/ 放置一个空的 .nojekyll 文件，可跳过 Jekyll 处理。
3. 打开仓库的 Settings → Pages。在「Build and deployment」下选择「Deploy from a branch」，选择 pages-release 和 /docs，然后保存。可参考 GitHub 的[发布源配置指南](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。
4. Pages 显示站点地址后，从地址打开首页和工作台，运行一次 Python。以后手动重建并更新 pages-release 分支的 docs/ 即可发布新版本。日常源码提交留在默认分支。

