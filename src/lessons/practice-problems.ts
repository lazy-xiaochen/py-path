import type { Problem } from '../content';

export const independentProblems: Problem[] = [
  {
    id: 'P081', title: '夜场巡检发车牌', difficulty: '基础', tag: '变量与运算',
    practice: { tier: '入门迁移', prerequisites: '第 1–3 课，整数商余与 f-string。', primary: ['向上取整', '钟面取模'], secondary: ['字段解包', '补零'] },
    description: '已知巡检组到达的钟面时刻、路程、每分钟速度和出发前准备分钟数。计算在整分钟开始准备的最晚钟面时刻。',
    input: '一行五个整数 h m distance speed setup，依次是目的时刻的小时、分钟、路程、速度、准备分钟数。',
    output: '一行 HH:MM。两个字段均补零至两位。可跨午夜。',
    limits: '0≤h≤23，0≤m≤59，0≤distance≤6000，1≤speed≤200，0≤setup≤60。行程加准备不超过 1440 分钟。',
    sample: ['0 5 100 30 7\n', '23:54\n', '路程占 4 分钟，算上准备需提前 11 分钟。00:05 向前 11 分钟是前日 23:54。'],
    cases: [
      ['8 0 360 60 4\n', '07:50\n', { note: '整除时不能多算一分钟。' }],
      ['0 0 0 5 0\n', '00:00\n'], ['0 5 5 2 2\n', '00:00\n'],
      ['1 9 1440 1 0\n', '01:09\n', { note: '恰好提前一整天时钟面相同。' }],
    ],
    hints: ['先算整分钟路程，加上准备。', '将目的时刻写成当天分钟数，减去总用时后对 1440 取余。'],
    solution: `hour, minute, distance, speed, setup = map(int, input().split())
travel = (distance + speed - 1) // speed
clock = (hour * 60 + minute - travel - setup) % 1440
hour, minute = divmod(clock, 60)
print(f"{hour:02d}:{minute:02d}")
`,
    guide: {
      concepts: ['整分钟向上取整', '负数取模', '数字格式'],
      approach: '把时刻和时长统一为分钟。先从目的时刻减用时，再还原到一日钟面。',
      steps: ['用正速度将路程向上取整。', '目的分钟数减行程和准备，对 1440 取余。', '用 divmod 拆回时分，按两位输出。'],
      time: 'O(1)。', space: 'O(1)。', pitfall: '若先拆小时与分钟再分别相减，很容易漏掉借位和跨日。', extension: '要求同时输出前一日标记时，还需要保留哪个商？',
    },
    origin: { kind: 'adapted', platform: '洛谷', id: 'P5707', title: '〖深基2.例12〗上学迟到', level: '原题入门',
      url: 'https://www.luogu.com.cn/problem/P5707', concepts: ['整分钟向上取整', '24 小时钟面'],
      adaptation: '原题固定到校 08:00、额外 10 分钟，正整数路程和速度均至 10⁴，提前不超一天。本站改成夜场巡检，时刻、准备可变，允许零路程，改变数据范围与用例。' },
  },
  {
    id: 'P082', title: '展演补位名单', difficulty: '基础', tag: '条件判断',
    practice: { tier: '跨知识点', prerequisites: '第 3、4、6 课，条件、循环、列表排序。', primary: ['阈值', '并列'], secondary: ['排序副本', '原始位置'] },
    description: '报名得分按登记顺序提供。达到第 k 高分且分数大于 0 的人进入补位名单，同分者一并入选。名单按原登记顺序输出。',
    input: '第一行 n k。第二行 n 个登记分数，顺序任意。编号从 1 开始。',
    output: '首行人数，第二行按登记顺序输出编号，用空格分隔。无人入选时第二行写「空」。',
    limits: '1≤k≤n≤80，0≤分数≤100。',
    sample: ['6 3\n7 0 9 7 3 9\n', '4\n1 3 4 6\n', '排序副本的第 3 高为 7，两名 7 分也入选。'],
    cases: [
      ['4 3\n0 4 0 2\n', '2\n2 4\n', { note: '门槛为零时仍排除零分。' }],
      ['3 1\n0 0 0\n', '0\n空\n'],
      ['5 1\n2 8 8 4 8\n', '3\n2 3 5\n'],
      ['4 4\n2 4 1 3\n', '4\n1 2 3 4\n'],
    ],
    hints: ['排序只用于寻找门槛，保留原列表。', '用 enumerate 从 1 给原列表编号，检查两个条件。'],
    solution: `people, rank = map(int, input().split())
scores = list(map(int, input().split()))
cutoff = sorted(scores, reverse=True)[rank - 1]
qualified = []
for number, score in enumerate(scores, start=1):
    if score > 0 and score >= cutoff:
        qualified.append(number)
print(len(qualified))
if qualified:
    print(*qualified)
else:
    print("空")
`,
    guide: {
      concepts: ['从排名到阈值', '过滤与稳定顺序', '0 值边界'],
      approach: '只在副本上排序取阈值，再重新遍历原名单，以原下标汇报。',
      steps: ['第 k 高对应降序列表下标 k−1。', '没有正分资格即使排名足够也剔除。', '按原编号追加并输出空或完整名单。'],
      time: 'O(n log n)。', space: 'O(n)，保留排序副本和名单。',
      pitfall: '只取恰好 k 人会漏并列。用排序后的下标作编号会破坏原登记顺序。', extension: '分数范围固定时，可怎样用计数表求阈值？',
    },
    origin: { kind: 'adapted', platform: 'Codeforces', id: '158A', title: 'Next Round', level: '原题 A',
      url: 'https://codeforces.com/problemset/problem/158/A', concepts: ['排名阈值', '非零资格'],
      adaptation: '原题 1≤k≤n≤50，非递增分数 0–100，只输出人数。本站输入未排序、n 至 80，增加按原登记顺序输出并列入选者与空名单规则。' },
  },
  {
    id: 'P083', title: '接连翻转两段路标', difficulty: '基础', tag: '字符串', outputComparison: 'exact',
    practice: { tier: '跨知识点', prerequisites: '第 5、6 课，1 基区间、切片和列表。', primary: ['切片', '顺序应用'], secondary: ['空白', '位置转换'] },
    description: '路标上有一行文字。按顺序执行两次局部倒转，第二次在已改的整行上按位置计算。',
    input: '第一行原文，随后两行各有 l r，均从 1 开始，两端都包含。',
    output: '输出最终原文，包括仍在边缘或中间的空格。',
    limits: '1≤原文长度≤80，以码点计。可含空格与中文，1≤l≤r≤长度。',
    sample: ['ABCDE\n1 3\n2 4\n', 'CDABE\n', '先得到 CBADE，再倒转 BAD 得到 DAB。'],
    cases: [
      ['甲乙丙丁\n1 4\n1 4\n', '甲乙丙丁\n'],
      [' A B\n1 4\n2 3\n', 'BA  \n', { note: '首部空格移动到结尾，且第二次按第一次结果作业。' }],
      ['本\n1 1\n1 1\n', '本\n'],
      ['abced\n2 2\n4 5\n', 'abcde\n'],
    ],
    hints: ['左端减 1，右端正好是切片不包含的终点。', '每次都用当前整行拼接前缀、倒转后的中段与后缀。'],
    solution: `line = input()
for _ in range(2):
    left, right = map(int, input().split())
    start = left - 1
    middle = line[start:right][::-1]
    line = line[:start] + middle + line[right:]
print(line)
`,
    guide: {
      concepts: ['切片半开区间', '字符串不可变', '顺序应用'],
      approach: '每一步生成一条新字符串，用原位置取这一步的三段。',
      steps: ['将两端包含的范围改成切片下标。', '中间片段倒序，首尾直接接回。', '重新绑定 line 后再处理第二个区间。'],
      time: 'O(L)，两次操作。', space: 'O(L)。',
      pitfall: '第二次仍切初始原文会漏掉相交部分的变化。strip 会丢失原文空格。', extension: '当操作很多且只需输出少数位置时，怎样反向追踪位置的来源？',
    },
    origin: { kind: 'adapted', platform: 'AtCoder', id: 'ABC233 B', title: 'A Reverse', level: '原题 B · 200 分',
      url: 'https://atcoder.jp/contests/abc233/tasks/abc233_b?lang=en', concepts: ['1 基区间', '子串翻转'],
      adaptation: '原题一次反转、长度至 10⁵、小写英文字母。本站以路标为背景，长度至 80、允许空格和中文，两次操作可重叠，样例及用例独立设计。' },
  },
  {
    id: 'P084', title: '签到重复时刻', difficulty: '基础', tag: '字典',
    practice: { tier: '跨知识点', prerequisites: '第 4、6、7 课，扫描、原位置和字典。', primary: ['首位置表', '重复发现顺序'], secondary: ['计数', '索引'] },
    description: '登记编号顺序给出。找最早发生的重复事件，报告编号、该编号的第一次位置与本次位置，并统计所有重复事件。第三次及以后也各算一次。',
    input: '第一行 n，第二行 n 个有符号整数，n 为 0 时第二行为空。位置从 1 开始。',
    output: '首行输出「编号 初次位置 重复位置」，无重复输出「无」。第二行输出重复事件数。',
    limits: '0≤n≤1000，-100000≤编号≤100000。',
    sample: ['5\n4 0 0 4 0\n', '0 2 3\n3\n', '第 3 个编号是首个重复事件，后面的 4 与 0 也各是一个重复。'],
    cases: [
      ['0\n\n', '无\n0\n'], ['4\n-1 1 2 -2\n', '无\n0\n'],
      ['5\n5 2 2 5 2\n', '2 2 3\n3\n', { note: '按重复发生的时刻，而非最早出现的编号决定。' }],
      ['4\n-3 -3 -3 -3\n', '-3 1 2\n3\n'],
    ],
    hints: ['字典保存每个编号第一次出现的编号位置。', '两个状态分别保存第一个重复事件和任意重复的累计数。'],
    solution: `size = int(input())
entries = list(map(int, input().split()))
first = {}
earliest = None
repeated = 0
for position, code in enumerate(entries, start=1):
    if code in first:
        if earliest is None:
            earliest = (code, first[code], position)
        repeated += 1
    else:
        first[code] = position
if earliest is None:
    print("无")
else:
    print(*earliest)
print(repeated)
`,
    guide: {
      concepts: ['首次位置', '重复次数', '扫描'],
      approach: '已读前缀的字典只记首位置。第一次遇到已存在项填充事件，以后只增计数。',
      steps: ['按原序跟踪位置。', '新编号写入 first，已登记编号增加重复数。', '只填写一次 earliest，最后根据 None 输出。'],
      time: '期望 O(n)，按字典平均成本。', space: 'O(n)。',
      pitfall: '将 0 当作没有重复会漏真实的零编号，覆盖首位置也会得到错误坐标。', extension: '如何为每个编号输出首末位置和重复次数？',
    },
    origin: { kind: 'adapted', platform: 'LeetCode', id: '217', title: 'Contains Duplicate', level: '原题 Easy',
      url: 'https://leetcode.com/problems/contains-duplicate/description/', concepts: ['发现重复', '哈希表'],
      adaptation: '原题参数为长度 1–10⁵、元素 ±10⁹ 的 nums，返回布尔值。本站使用标准输入，允许空清单，缩小数值范围，并报告首个重复事件的位置与总次数。' },
  },
  {
    id: 'P085', title: '计算场馆可用分钟', difficulty: '进阶', tag: '函数',
    practice: { tier: '综合', prerequisites: '第 3、8 课，跨午夜、函数返回。', primary: ['函数契约', '跨时段时长'], secondary: ['输入边界', '复用状态'] },
    description: '场馆给出每日开放起止分钟与每次固定准备时长。实现工具函数计算扣除准备可使用的分钟数。',
    input: '实现 main.py 中的 usable_minutes(start, stop, setup)，接收三个整数。开始大于结束表示跨午夜。两端相等表示空时段。',
    output: '返回非负整数分钟。准备超出开放长度时返回 0。接口运行期间保持标准输入、输出与错误输出安静。',
    limits: '0≤start,stop≤1439，0≤setup≤1440。',
    contract: { kind: 'function', files: ['main.py'], target: { module: 'main', name: 'usable_minutes' } },
    starterFiles: [{ name: 'main.py', content: 'def usable_minutes(start, stop, setup):\n    pass\n' }],
    sample: ['', '', '23:00 到次日 01:00 共 120 分钟，扣 20 得 100。', { calls: [{ args:[1380,60,20], expected:100 }, { args:[480,720,0], expected:240 }] }],
    cases: [
      ['', '', { calls: [{ args:[0,0,0], expected:0 }, { args:[1,1,5], expected:0 }] }],
      ['', '', { calls: [{ args:[10,12,3], expected:0 }, { args:[1439,0,0], expected:1 }] }],
      ['', '', { calls: [{ args:[0,1439,1], expected:1438 }, { args:[1439,0,1], expected:0 }, { args:[0,1439,1], expected:1438 }] }],
    ],
    hints: ['结束减开始为负时，加一天的分钟数。', '先求开放长度，再用 max 将剩余值限制到非负。'],
    solution: `def usable_minutes(start, stop, setup):
    duration = stop - start
    if duration < 0:
        duration += 1440
    return max(0, duration - setup)
`,
    guide: {
      concepts: ['时间跨度', '接口返回', '边界'],
      approach: '正常差值为非负，跨午夜的负差值加一个周期。扣除准备再判零下限。',
      steps: ['算 stop−start。', '差值小于零时补 1440。', '扣除 setup，较小结果最少为零；只返回计算值。'],
      time: '每次 O(1)。', space: 'O(1)。',
      pitfall: '相等时补一天会把关闭状态变成全天可用。', extension: '把多段开放时长分别传给函数，与合并后只扣一次准备有何区别？',
    },
  },
  {
    id: 'P086', title: '按差额排序的日结对账', difficulty: '进阶', tag: '综合应用',
    practice: { tier: '综合', prerequisites: '第 4、7、8、12 课，按键累计、元组排序键和函数。', primary: ['双来源汇总', '多关键字比较'], secondary: ['阈值', '独立慢解'] },
    description: '分别读入账本和盘点流水，流水可能为负且同类重复。找出差额达到门槛的类别，先按差额绝对值降序，同量按类别升序。',
    input: '第一行 n m threshold。接下来 n 行账本及 m 行盘点，每行「类别 金额」。',
    output: '入选类别每行输出「类别 账本小计减盘点小计」。缺少某账本的一侧按 0。无人入选输出「一致」。',
    limits: '0≤n,m≤100，1≤threshold≤1000，类别为不含空格的 ASCII 字母串，-1000≤金额≤1000。',
    sample: ['3 2 3\nB 2\nA 5\nB 3\nA 2\nC 5\n', 'B 5\nC -5\nA 3\n', 'B 和 C 的绝对差额并列，按类别排序，输出仍带符号。'],
    cases: [
      ['0 0 1\n', '一致\n'],
      ['2 2 2\nA 4\nA -1\nA 3\nB 1\n', '一致\n', { note: '应先聚合再计算绝对差，不能按单笔差异入选。' }],
      ['1 2 2\nX -3\nY -5\nX -1\n', 'Y 5\nX -2\n'],
      ['3 0 4\nZ 4\nB -4\nA 3\n', 'B -4\nZ 4\n'],
    ],
    hints: ['同一个表可先累加账本，再减去盘点。', '排序函数返回 (-abs(差额), 类别)。比较用绝对值，打印用原符号。'],
    solution: `def order(record):
    name, delta = record
    return -abs(delta), name

n, m, threshold = map(int, input().split())
differences = {}
for _ in range(n):
    name, text = input().split()
    differences[name] = differences.get(name, 0) + int(text)
for _ in range(m):
    name, text = input().split()
    differences[name] = differences.get(name, 0) - int(text)
report = []
for name, delta in differences.items():
    if abs(delta) >= threshold:
        report.append((name, delta))
if not report:
    print("一致")
for name, delta in sorted(report, key=order):
    print(name, delta)
`,
    guide: {
      concepts: ['差额状态', '绝对值筛选', '排序副本'],
      approach: '把每笔变动按来源加号或减号累计，得到每类带符号差额。最后只为达到条件的类别排序。',
      steps: ['逐笔增加账本额、减少盘点额。', '完整汇总之后筛选绝对差额。', '自测两个绝对值并列但符号相反的项目，再打印有符号原值。'],
      time: 'O(n+m+k log k)，k 为入选类别数。', space: 'O(u)，u 为总类别数。',
      pitfall: '筛选若早于完整累计会把后续互相抵消的金额误报。直接对带符号的数排序也会错。', extension: '增加两表原小计列，并用针对每个类别逐行枚举的慢解核对。',
    },
  },
];
