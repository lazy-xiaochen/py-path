import { foundationGuides, foundationProblems } from './lessons/foundation-problems.ts';
import { controlFlowGuides, controlFlowProblems } from './lessons/control-flow-problems.ts';
import { sequenceGuides, sequenceProblems } from './lessons/sequence-problems.ts';
import { mappingFunctionGuides, mappingFunctionProblems } from './lessons/mapping-function-problems.ts';
import { moduleFileGuides, moduleFileProblems } from './lessons/module-file-problems.ts';
import { debuggingSolvingGuides, debuggingSolvingProblems } from './lessons/debugging-solving-problems.ts';
import { chapterTasks } from './lessons/chapter-tasks.ts';
import { independentProblems } from './lessons/practice-problems.ts';
import { ledgerCapstone } from './lessons/capstone.ts';
import type { OutputComparison } from './judge';
import type { ProblemOrigin, SolutionGuide } from './teaching-types';
import type { CaseChecks, TaskContract, TaskFile } from './assessment-types';

export type Sample = [input: string, output: string, explanation: string, checks?: CaseChecks];
export type TestCase = [input: string, output: string, checks?: CaseChecks];
export type Difficulty = '入门' | '基础' | '进阶';
export const practiceTiers = ['入门迁移', '跨知识点', '综合'] as const;
export type Problem = {
  id: string; title: string; difficulty: Difficulty; tag: string; description: string;
  input: string; output: string; outputComparison?: OutputComparison; sample: Sample; limits: string; cases: TestCase[];
  hints: [string, string]; solution: string; background?: string;
  guide?: SolutionGuide; origin?: ProblemOrigin;
  contract?: TaskContract;
  starterFiles?: TaskFile[];
  solutionFiles?: TaskFile[];
  practice?: { tier: typeof practiceTiers[number]; prerequisites: string; primary: string[]; secondary: string[] };
};
export type Quiz = { question: string; choices: string[]; answer: number; feedback: string };
export type Lesson = {
  title: string; tag: string; theory: string; example: string; input: string;
  check: Quiz; predict: Quiz; mistake: string; exampleFiles?: { name: string; content: string }[];
};

function task(id: number, title: string, difficulty: Difficulty, tag: string, description: string,
  input: string, output: string, sample: Sample, limits: string, cases: TestCase[],
  hints: Problem['hints'], solution: string, background?: string): Problem {
  return { id: 'P' + String(id).padStart(3, '0'), title, difficulty, tag, description, input, output,
    sample, limits, cases, hints, solution, background };
}

const originalProblems: Problem[] = [
  task(1, '给包裹贴标签', '入门', '输入输出', '读取一行收件人姓名，给它加上固定前缀，生成标签。',
    '一行姓名 s，可包含空格。', '一行，由“收件人：”和原姓名直接拼接。冒号是全角字符。',
    ['林晓\n', '收件人：林晓\n', '原样保留姓名，在前面加上全角冒号结尾的前缀。'],
    '姓名含 1–30 个字符，首尾无空格。', [['阿 乔\n', '收件人：阿 乔\n'], ['Q\n', '收件人：Q\n']],
    ['input() 可以读取包含空格的整行。', '用 + 拼接固定前缀。传给 input 的提示语也会写到标准输出。'],
    'name = input()\nprint("收件人：" + name)',
    '评测会比较程序的完整标准输出。input("请输入姓名：") 多写了提示语，即使标签正确也会得到 WA。'),
  task(2, '装订顺序', '入门', '输入输出', '把分别写在三行上的标题、作者、日期重新排成阅读卡片。',
    '依次输入标题、作者、日期，各占一行。', '依次输出日期、标题、作者，各占一行。',
    ['晚风笔记\n周青\n2026-08\n', '2026-08\n晚风笔记\n周青\n', '日期移到最前面，其余两行保持顺序。'],
    '每行 1–60 个字符，首尾无空格。', [['A B\n甲 乙\n1\n', '1\nA B\n甲 乙\n'], ['一\n一\n一\n', '一\n一\n一\n']],
    ['每次 input 只读一行。', '按读入顺序保留三个名字，再按要求调用 print。'],
    'title = input()\nauthor = input()\ndate = input()\nprint(date)\nprint(title)\nprint(author)'),
  task(3, '兑换整册车票', '入门', '变量与运算', '每册装 k 张票。用手头的 n 张票尽可能装满整册，并记录剩下的散票。',
    '一行两个整数 n 和 k，以空格分隔。', '一行两个整数，依次为整册数和散票数，用一个空格分隔。',
    ['17 5\n', '3 2\n', '3 册用掉 15 张，还剩 2 张。'],
    '0 ≤ n ≤ 10⁹，1 ≤ k ≤ 10⁹。', [['0 8\n', '0 0\n'], ['6 7\n', '0 6\n'], ['1000000000 1000\n', '1000000 0\n']],
    ['先把输入切分并转成整数。', '// 得到整册数，% 得到剩余票数。'],
    'n, k = map(int, input().split())\nprint(n // k, n % k)'),
  task(4, '展架标签预算', '基础', '变量与运算', '展架有 r 排，每排需 c 张标签，总共额外备 s 张。标签每包 p 张，只能整包买。',
    '一行四个整数 r、c、s、p。', '输出最少需要购买的包数。',
    ['3 7 4 6\n', '5\n', '共需 25 张，4 包只有 24 张。'],
    '0 ≤ r,c,s ≤ 10⁶，1 ≤ p ≤ 10⁹。', [['2 6 0 4\n', '3\n'], ['0 9 0 4\n', '0\n'], ['1000000 1000000 1 1000000\n', '1000001\n']],
    ['先求需要的标签总数。', '有余数才多买一包，也可用 (总数 + p - 1) // p。'],
    'r, c, s, p = map(int, input().split())\ntotal = r * c + s\nprint((total + p - 1) // p)'),
  task(5, '清晨骑行建议', '入门', '条件判断', '风速达到 8 时建议停止骑行（取消）。低于 8 且降雨量大于 0 时建议加雨衣（雨衣）。其余情况建议正常出发（出发）。',
    '一行两个整数 w、r，分别为风速和降雨量。', '输出“取消”“雨衣”“出发”中的一个。',
    ['4 2\n', '雨衣\n', '风弱，降雨量为正。'],
    '0 ≤ w,r ≤ 100。', [['8 1\n', '取消\n'], ['7 0\n', '出发\n'], ['9 0\n', '取消\n']],
    ['先处理同时下雨和大风的情况。', '将取消放在第一个 if 中，接着用 elif 检查下雨。'],
    'w, r = map(int, input().split())\nif w >= 8:\n    print("取消")\nelif r > 0:\n    print("雨衣")\nelse:\n    print("出发")'),
  task(6, '错峰取餐', '基础', '条件判断', '在开店后第 t 分钟取餐。外带标记为 1 时从侧门取。堂食在 [30,60) 或 [90,120) 走快线，其余走前台。',
    '一行两个整数 t、m，m 表示是否外带。', '输出“侧门”“快线”或“前台”。',
    ['55 0\n', '快线\n', '55 在第一个快线时段内。'],
    '0 ≤ t ≤ 180，m 为 0 或 1。', [
      ['29 0\n', '前台\n'], ['30 0\n', '快线\n'], ['60 0\n', '前台\n'],
      ['89 0\n', '前台\n'], ['90 0\n', '快线\n'], ['120 0\n', '前台\n'],
      ['30 1\n', '侧门\n'], ['90 1\n', '侧门\n'], ['29 1\n', '侧门\n'],
    ],
    ['外带的规则优先级最高。', '两个区间用 or 连接，右端点用小于。'],
    't, m = map(int, input().split())\nif m == 1:\n    print("侧门")\nelif 30 <= t < 60 or 90 <= t < 120:\n    print("快线")\nelse:\n    print("前台")'),
  task(7, '山路补水点', '入门', '循环', '从第 1 公里走到第 n 公里。编号能被 3 整除但不能被 5 整除的公里点需要补水，求补水点编号之和。',
    '一个整数 n。', '输出编号之和。没有补水点时输出 0。',
    ['10\n', '18\n', '编号 3、6、9，共 18。'],
    '0 ≤ n ≤ 10⁵。', [['0\n', '0\n'], ['15\n', '30\n'], ['3\n', '3\n'], ['2\n', '0\n']],
    ['先枚举 1 到 n。', 'range 的结束值不包含在内。用 and 连接两个条件。'],
    'n = int(input())\ntotal = 0\nfor km in range(1, n + 1):\n    if km % 3 == 0 and km % 5 != 0:\n        total += km\nprint(total)'),
  task(8, '存下第一笔旅费', '基础', '循环', '第 1 天存 a 元，此后每天比前一天多存 d 元。求第几天结束时累计首次达到至少 t 元。',
    '一行三个整数 a、d、t。', '输出最少天数。目标为 0 时输出 0。',
    ['2 3 14\n', '3\n', '前 3 天分别存 2、5、8 元，累计 15 元。'],
    '1 ≤ a ≤ 100，0 ≤ d ≤ 100，0 ≤ t ≤ 10⁵。', [['2 3 7\n', '2\n'], ['5 0 0\n', '0\n'], ['1 0 100000\n', '100000\n']],
    ['累计未达目标时才进入循环。', '在循环内按“存钱、计天数、更新明日金额”的顺序操作。'],
    'a, d, target = map(int, input().split())\nsaved = days = 0\nwhile saved < target:\n    saved += a\n    days += 1\n    a += d\nprint(days)'),
  task(9, '海报字符统计', '基础', '字符串', '一张文字海报里，数出英文字母 a（含大写）和星号 * 各出现几次。',
    '一行可打印 ASCII 字符，可以为空。', '输出 a/A 总次数与 * 次数，用空格分隔。',
    ['A * art**\n', '2 3\n', 'A 与 art 中的 a 各贡献一次，星号共三个。'],
    '行长 0–200。', [['\n', '0 0\n'], ['BAAA\n', '3 0\n'], ['a*a*A\n', '3 2\n']],
    ['可以先把整行转成小写。', '字符串的 count 方法可以统计一个字符。'],
    'line = input().lower()\nprint(line.count("a"), line.count("*"))'),
  task(10, '路标倒影', '基础', '字符串', '将路标文字的每个字符倒序，空格也参与倒序。然后在结果的左右加上方括号。',
    '一行字符，可以为空，可能含首尾空格。', '输出一行，包含倒序后加方括号的内容。',
    ['东门 3\n', '[3 门东]\n', '空格保留，出现在 3 的右边。'],
    '行长 0–100，以 Unicode 码点计。', [['\n', '[]\n'], ['  小路 \n', '[ 路小  ]\n'], ['X\n', '[X]\n']],
    ['不调用 strip，否则首尾空格会消失。', '使用步长为 -1 的切片。'],
    'sign = input()\nprint("[" + sign[::-1] + "]")'),
  task(11, '邻座温差', '基础', '列表', '按座位顺序给出温度。找出相邻座位的最大绝对温差。只有一个座位时温差为 0。',
    '第一行整数 n，第二行 n 个温度整数。', '输出最大绝对温差。',
    ['4\n8 5 11 9\n', '6\n', '5 与 11 相邻，温差为 6。'],
    '1 ≤ n ≤ 1000，−100 ≤ 温度 ≤ 100。', [['1\n-9\n', '0\n'], ['2\n100 -100\n', '200\n'], ['3\n6 6 6\n', '0\n']],
    ['让索引从 1 开始，便于访问前一个元素。', '用 abs 求差的绝对值，并更新已知最大值。'],
    'n = int(input())\nvalues = list(map(int, input().split()))\nanswer = 0\nfor i in range(1, n):\n    answer = max(answer, abs(values[i] - values[i - 1]))\nprint(answer)'),
  task(12, '调换书架标签', '基础', '列表', '书架有 n 个标签。按操作顺序交换标签位置，每次交换两个从 1 开始的位置。',
    '第一行 n 和 q，第二行 n 个标签，随后 q 行每行两个位置 i、j。', '输出最终标签序列，以一个空格分隔。',
    ['4 2\n甲 乙 丙 丁\n1 4\n2 4\n', '丁 甲 丙 乙\n', '先把甲移到末尾，再把甲调到第二位。'],
    '1 ≤ n ≤ 200，0 ≤ q ≤ 200，1 ≤ i,j ≤ n；标签含 1–30 个字符，不含空格。', [
      ['1 2\nA\n1 1\n1 1\n', 'A\n'], ['2 0\n左 右\n', '左 右\n'], ['3 2\nA B C\n1 3\n1 3\n', 'A B C\n'],
      ['5 4\n甲 乙 甲 丁 戊\n1 2\n2 4\n4 5\n1 4\n', '戊 丁 甲 乙 甲\n', { note: '交换共享位置，重排操作或按标签值定位都会出错。' }],
    ],
    ['题目位置从 1 开始，列表索引从 0 开始。', '可以用 a[i], a[j] = a[j], a[i] 一次完成交换。'],
    'n, q = map(int, input().split())\nlabels = input().split()\nfor _ in range(q):\n    i, j = map(int, input().split())\n    i -= 1\n    j -= 1\n    labels[i], labels[j] = labels[j], labels[i]\nprint(*labels)'),
  task(13, '工坊材料余量', '基础', '字典', '每条记录表示某种材料入库或出库。查询一个材料的净变化；该材料可能没有记录。',
    '首行整数 n，随后 n 行每行材料名和带符号整数。最后一行是查询的材料名。', '输出查询材料的净变化。',
    ['3\n纸 8\n线 4\n纸 -3\n纸\n', '5\n', '纸的净变化是 8 − 3。'],
    '0 ≤ n ≤ 500，材料名含 1–12 个字符，不含空格，数量绝对值不超过 10⁵。', [['0\n纸\n', '0\n'], ['2\n木 8\n木 -12\n纸\n', '0\n'], ['2\n木 2\n木 -8\n木\n', '-6\n']],
    ['把材料名称作为字典键。', '用 ledger.get(name, 0) 为新材料提供初始值。'],
    'ledger = {}\nfor _ in range(int(input())):\n    name, change = input().split()\n    ledger[name] = ledger.get(name, 0) + int(change)\nprint(ledger.get(input(), 0))'),
  task(14, '自习室座位牌', '进阶', '字典', '每张牌写着一个座位编号。找出出现次数最多的编号；次数相同时选择数值最小的编号。',
    '第一行 n，第二行 n 个整数编号。', '在一行输出编号和次数，中间用空格分隔。',
    ['5\n8 3 8 3 4\n', '3 2\n', '3 与 8 都出现两次，选择较小的 3。'],
    '1 ≤ n ≤ 2500，0 ≤ 编号 ≤ 10⁹。', [['1\n0\n', '0 1\n'], ['6\n9 10 10 9 10 8\n', '10 3\n'], ['3\n90 12 3\n', '3 1\n'], ['2500\n' + '1000000000 '.repeat(2499) + '7\n', '1000000000 2499\n']],
    ['先统计每种编号出现多少次。', '得到最高次数后，只在具有该次数的候选中比较编号，选择数值最小的一个。'],
    'n = int(input())\ncounts = {}\nfor seat in map(int, input().split()):\n    counts[seat] = counts.get(seat, 0) + 1\nbest_count = max(counts.values())\nwinner = None\nfor seat, count in counts.items():\n    if count == best_count and (winner is None or seat < winner):\n        winner = seat\nprint(winner, best_count)'),
  task(15, '步数换里程', '基础', '函数', '每步长 l 厘米。为多条步数记录换算整数米数，零头舍去。建议编写转换函数。',
    '第一行 q 和 l，接下来 q 行每行一个步数。', '逐行输出各记录的整数米数。',
    ['3 65\n1\n2\n100\n', '0\n1\n65\n', '第 2 条记录是 130 厘米，保留 1 米。'],
    '1 ≤ q ≤ 100，1 ≤ l ≤ 200，0 ≤ 步数 ≤ 10⁶。', [['1 100\n0\n', '0\n'], ['2 50\n2\n3\n', '1\n1\n']],
    ['函数接收步数和步长。', '计算结果通过 return 交给循环，再由循环 print。'],
    'def meters(steps, length):\n    return steps * length // 100\n\nq, length = map(int, input().split())\nfor _ in range(q):\n    print(meters(int(input()), length))'),
  task(16, '为展板统一字号', '基础', '函数', '把每个字号限制在 [lo, hi]。小于下限取下限，大于上限取上限。建议写一个可复用的限制函数。',
    '第一行 n、lo、hi，第二行 n 个待处理字号。', '一行输出全部处理后的字号，以一个空格分隔。',
    ['4 12 30\n8 12 31 24\n', '12 12 30 24\n', '8 提到 12，31 降到 30。'],
    '1 ≤ n ≤ 500，0 ≤ lo ≤ hi ≤ 100，0 ≤ 字号 ≤ 200。', [['3 5 5\n0 5 200\n', '5 5 5\n'], ['2 0 100\n0 100\n', '0 100\n']],
    ['先考虑只限制下限会怎样。', '把 max(size, lo) 的结果再与 hi 取 min。'],
    'def clamp(size, low, high):\n    return min(max(size, low), high)\n\nn, low, high = map(int, input().split())\nprint(*(clamp(size, low, high) for size in map(int, input().split())))'),
  task(17, '拼接灯带的节拍', '基础', '模块', '两条灯带分别每 a 秒和 b 秒闪烁一次，求从开始后到它们首次同时闪烁的秒数。可使用 math 模块。',
    '一行两个正整数 a、b。', '输出首次同时闪烁的秒数。',
    ['6 8\n', '24\n', '24 是 6 和 8 的最小正公倍数。'],
    '1 ≤ a,b ≤ 10⁹。', [['1 1\n', '1\n'], ['10 5\n', '10\n'], ['999999937 1000000000\n', '999999937000000000\n']],
    ['这等价于最小公倍数。', 'math.lcm 可直接计算；也可用 a // math.gcd(a, b) * b。'],
    'import math\na, b = map(int, input().split())\nprint(math.lcm(a, b))'),
  task(18, '两站之间的天数', '进阶', '模块', '两座观测站给出两个日期，求两个日期相隔多少天（无论哪一个更早）。',
    '两行，各是一个 YYYY-MM-DD 格式的合法公历日期。', '输出相隔天数，日期相同输出 0。',
    ['2024-02-28\n2024-03-01\n', '2\n', '2024 年有 2 月 29 日。'],
    '年份在 1900–2099 之间。', [['1900-03-01\n1900-02-28\n', '1\n'], ['2000-02-29\n2000-02-29\n', '0\n'], ['2025-12-31\n2026-01-01\n', '1\n']],
    ['datetime.date.fromisoformat 能把日期字符串转成日期对象。', '两个日期相减得到 timedelta，读取 days 后取绝对值。'],
    'from datetime import date\nfirst = date.fromisoformat(input())\nsecond = date.fromisoformat(input())\nprint(abs((second - first).days))'),
  task(19, '把签到写进日志', '基础', '文件读写', '把收到的签到名字逐行写入 notes.txt，再读取文件并输出非空行的数量。评测依据标准输出。',
    '首行 n，随后 n 行，每行一个名字或空行。', '输出保存在日志中的非空行数。全是空格的行视为空行。',
    ['4\n小禾\n\n小桥\n  \n', '2\n', '空行和只含空格的行都排除。'],
    '0 ≤ n ≤ 200，每行不超过 40 个字符。', [['0\n', '0\n'], ['2\n甲\n甲\n', '2\n'], ['2\n \n\n', '0\n']],
    ['用 with open(..., "w", encoding="utf-8") 写文件。', '打开同一文件用于读取，沿文件迭代，用 line.strip() 判断。'],
    'n = int(input())\nwith open("notes.txt", "w", encoding="utf-8") as log:\n    for _ in range(n):\n        log.write(input() + "\\n")\nwith open("notes.txt", encoding="utf-8") as log:\n    print(sum(1 for line in log if line.strip()))'),
  task(20, '导出清单副本', '进阶', '文件读写', '把输入的库存记录保存到 stock.txt。按原顺序从中挑出库存低于阈值的商品名，写入 refill.txt，再逐行读出并展示。',
    '首行 n 和阈值 k，随后 n 行每行是商品名和库存数量，用一个空格分隔。', '逐行输出符合条件的商品名。没有符合条件的商品时输出“无需补货”。',
    ['3 4\n水杯 4\n木尺 2\n铅笔 0\n', '木尺\n铅笔\n', '水杯库存恰好等于阈值，排除。'],
    '0 ≤ n ≤ 200，0 ≤ k、库存 ≤ 10⁶，名称 1–24 字符。', [['0 8\n', '无需补货\n'], ['1 0\n笔 0\n', '无需补货\n'], ['2 2\n甲 1\n甲 0\n', '甲\n甲\n']],
    ['以写入模式保存原始记录，然后用读取模式打开。', '逐行拆分源文件，符合条件时写入副本。最后可用 read 读取整个副本。'],
    'n, threshold = map(int, input().split())\nwith open("stock.txt", "w", encoding="utf-8") as stock:\n    for _ in range(n):\n        stock.write(input() + "\\n")\nwith open("stock.txt", encoding="utf-8") as stock, open("refill.txt", "w", encoding="utf-8") as refill:\n    for line in stock:\n        name, amount = line.split()\n        if int(amount) < threshold:\n            refill.write(name + "\\n")\nwith open("refill.txt", encoding="utf-8") as refill:\n    result = refill.read()\nprint(result or "无需补货", end="")'),
  task(21, '修复温度记录', '基础', '异常调试', '把 n 行原始记录交给 int 转换。统计成功记录的和及失败记录的数量。空行也尝试转换。',
    '第一行 n，随后 n 行原始记录。', '输出有效整数之和、无效记录数，以空格分隔。',
    ['4\n12\n断线\n-4\n3.5\n', '8 2\n', '只有 12 和 −4 能被 int 直接转换。'],
    '0 ≤ n ≤ 300，单行最多 24 个字符。整数绝对值不超过 10⁹。', [['0\n', '0 0\n'], ['3\n +2 \n\n0\n', '2 1\n'], ['2\n断线\n空\n', '0 2\n']],
    ['int 转换无效字符串会引发 ValueError。', '每一条记录单独使用 try/except，失败后继续下一条。'],
    'total = invalid = 0\nfor _ in range(int(input())):\n    value = input()\n    try:\n        total += int(value)\n    except ValueError:\n        invalid += 1\nprint(total, invalid)'),
  task(22, '维修配件分箱', '进阶', '异常调试', '每行是零件总数和箱子数。将零件平均分配到箱子，输出每箱整件数。遇到非整数则输出“格式错误”，合法整数但箱子为 0 则输出“无法分箱”。',
    '首行 n，随后 n 行，每行两个非空字段，以空格分隔。', '按输入顺序输出每条结果，各占一行。',
    ['4\n10 3\n7 0\n9 x\n0 2\n', '3\n无法分箱\n格式错误\n0\n', '先做整数转换，再做整除。'],
    '1 ≤ n ≤ 100，字段长不超过 20；有效整数在 0–10⁹ 之间。', [['2\na 0\n2 5\n', '格式错误\n0\n'], ['1\n0 0\n', '无法分箱\n'], ['1\n6.0 3\n', '格式错误\n']],
    ['可以用不同的 except 识别不同类型的异常。', '把 int 转换和 // 放进 try，分别捕获 ValueError 和 ZeroDivisionError。'],
    'for _ in range(int(input())):\n    first, second = input().split()\n    try:\n        print(int(first) // int(second))\n    except ValueError:\n        print("格式错误")\n    except ZeroDivisionError:\n        print("无法分箱")'),
  task(23, '夜间归还箱', '基础', '综合应用', 'n 条记录给出书架代号和归还数量。累计每个书架的数量，只输出总量不少于 k 的书架。',
    '第一行 n 和 k，随后 n 行每行一个小写字母代号和一个整数数量。', '按代号字典序逐行输出代号和总量；没有达标书架时输出“空”。',
    ['4 4\nz 1\na 4\nz 3\nb 3\n', 'a 4\nz 4\n', 'a 与 z 达到阈值。'],
    '0 ≤ n ≤ 500，0 ≤ k、数量 ≤ 10⁴。', [['0 0\n', '空\n'], ['2 0\nb 0\na 0\n', 'a 0\nb 0\n'], ['2 10\na 4\na 5\n', '空\n']],
    ['先聚合同一书架的记录。', '用 sorted 遍历书架键，先筛选再输出或判断为空。'],
    'n, minimum = map(int, input().split())\ncounts = {}\nfor _ in range(n):\n    shelf, count = input().split()\n    counts[shelf] = counts.get(shelf, 0) + int(count)\nqualified = [shelf for shelf in sorted(counts) if counts[shelf] >= minimum]\nif not qualified:\n    print("空")\nfor shelf in qualified:\n    print(shelf, counts[shelf])'),
  task(24, '灯塔值班段', '进阶', '综合应用', 'n 个观测值按时间排列。找出连续达到阈值的最长时段，输出该时段的起点和长度。长度并列时选择较早的起点。',
    '第一行 n 和 t，第二行 n 个整数观测值。', '起点按 1 开始编号，与长度用一个空格分隔。没有达标值时输出“0 0”。',
    ['7 5\n2 5 8 1 5 6 7\n', '5 3\n', '第 5 到 7 个值组成长度最大的时段。'],
    '1 ≤ n ≤ 2500，观测值和 t 的绝对值不超过 10⁹。', [['1 1\n0\n', '0 0\n'], ['5 5\n5 7 0 5 6\n', '1 2\n'], ['3 0\n0 0 0\n', '1 3\n'], ['2500 0\n' + '-1000000000 '.repeat(2498) + '0 1000000000\n', '2499 2\n']],
    ['每读到一个达标值，把当前长度加 1，否则清零。', '只在严格变长时更新答案，起点是当前编号减去长度再加 1。'],
    'n, threshold = map(int, input().split())\nstart = best = length = 0\nfor index, value in enumerate(map(int, input().split()), 1):\n    length = length + 1 if value >= threshold else 0\n    if length > best:\n        start, best = index - length + 1, length\nprint(start, best)'),
];

const solutionGuides = {
  ...foundationGuides, ...controlFlowGuides, ...sequenceGuides, ...mappingFunctionGuides, ...moduleFileGuides,
  ...debuggingSolvingGuides,
};

export const problems: Problem[] = [
  ...originalProblems.map(problem => ({
    ...problem,
    guide: solutionGuides[problem.id],
  })),
  ...foundationProblems,
  ...controlFlowProblems,
  ...sequenceProblems,
  ...mappingFunctionProblems,
  ...moduleFileProblems,
  ...debuggingSolvingProblems,
  ...chapterTasks,
  ...independentProblems,
];

function quiz(question: string, choices: string[], answer: number, feedback: string): Quiz {
  return { question, choices, answer, feedback };
}

export const lessons: Lesson[] = [
  { title: '让 Python 开口说话', tag: '输入输出',
    theory: '程序按顺序执行。input() 从标准输入读取一行并返回字符串，print() 默认写出内容和一个换行。题目会给定标准输入并直接比较标准输出，因此只有输出格式要求的文字才应被打印。',
    example: 'city = input()\nprint("下一站", city)', input: '杭州\n',
    check: quiz('输入 “海风 浪花” 占一行。调用一次 input() 会得到什么？', ['海风', '海风 浪花', '两行字符串'], 1, 'input() 保留一行里的空格，只去掉行尾换行。'),
    predict: quiz('若把样例中的 print 改成 print(city, "站")，输入昆明时会输出什么？', ['昆明站', '站 昆明', '昆明 站'], 2, 'print 的多个参数默认用一个空格分隔。'),
    mistake: 'input("请输入：") 会把提示语写到标准输出。做题时用无参数的 input()，并逐字核对输出格式。' },
  { title: '用变量保存和计算', tag: '变量与运算',
    theory: '赋值把一个名字绑定到值。整数字面量和字符串是不同类型。int() 将可以解析的文本转成整数。整数的 // 是向下取整的除法，% 得到余数，两者满足 a == (a // b) * b + a % b。',
    example: 'minutes = int(input())\nhours = minutes // 60\nleft = minutes % 60\nprint(hours, left)', input: '125\n',
    check: quiz('把字符串 "7" 与 "2" 用 + 相连，结果是什么？', ['9', '"72"', '5'], 1, '两个字符串用 + 拼接，数值相加前要转换类型。'),
    predict: quiz('每小盒装 12 枚纽扣。对 23 用 // 12 和 % 12，依次得到什么？', ['1 和 11', '2 和 1', '1 和 12'], 0, '一个整盒用去 12 枚，余下 11 枚。'),
    mistake: 'input() 返回的 7 是文本。使用 int(input()) 之后再做算术。' },
  { title: '让程序做出选择', tag: '条件判断',
    theory: 'if 检查条件，elif 在前面的条件都为假时进一步判断，else 处理其余情况。一个分支组只执行第一个成立的分支。用缩进标记分支，用 == 比较两个值。',
    example: 'score = int(input())\nif score >= 90:\n    print("优秀")\nelif score >= 60:\n    print("合格")\nelse:\n    print("继续练习")', input: '60\n',
    check: quiz('当两个检查可能同时为真，但只允许输出一个结果时，可以用什么？', ['两个独立 if', 'if 和 elif', '重复打印'], 1, 'if/elif 只执行第一个为真的分支。'),
    predict: quiz('售票员应让身高恰好 120 的小朋友进入。“至少 120”应怎么写？', ['height > 120', 'height == 121', 'height >= 120'], 2, '>= 将边界 120 包含在内。'),
    mistake: '把 >= 写成 > 会丢掉恰好等于阈值的情况。测试阈值前、阈值处和阈值后。' },
  { title: '用循环处理一组数据', tag: '循环',
    theory: 'for 逐个遍历对象，range(start, stop) 包含起点、不包含终点。while 在每次循环前检查条件，循环体要推进状态。累计值通常在循环外初始化，在循环内更新。',
    example: 'total = 0\nfor number in range(1, 5):\n    total += number\nprint(total)', input: '',
    check: quiz('range(2, 5) 会依次产生哪些整数？', ['2、3、4、5', '1、2、3、4', '2、3、4'], 2, '上界 5 不会产生。'),
    predict: quiz('已有 3 枚纪念章，每次新增 2 枚，while 当前数量 < 8 时继续。需要几次？', ['2', '3', '4'], 1, '数量依次变成 5、7、9，第三次才结束。'),
    mistake: '把 total = 0 写在循环体里会反复清空累计值。while 漏掉更新变量可能导致超时。' },
  { title: '读写和变换字符串', tag: '字符串',
    theory: '字符串是字符序列，索引从 0 开始。切片 s[start:stop:step] 包含起点、不包含终点，且不会修改原字符串。strip() 清理两端空白，lower() 返回小写副本。',
    example: 'title = input()\nprint(title.strip())\nprint(title[:3])', input: '  海岸线  \n',
    check: quiz('对 "松风雨" 取 s[1:3]，得到什么？', ['松风', '风雨', '雨'], 1, '从索引 1 的“风”开始，到索引 3 之前结束。'),
    predict: quiz('字符串 "  BeE  " 先 strip() 再 lower()，会得到什么？', ['"bee"', '"  bee  "', '"BeE"'], 0, '前者去除两端空格，后者负责转小写。'),
    mistake: 's.strip() 返回副本，原字符串不变。题目要求保留空白时直接使用 input() 的结果。' },
  { title: '把相关值存入列表', tag: '列表',
    theory: '列表按顺序保存元素，允许重复和修改。用 len() 获得长度，append() 添加一个元素，用 a[i] 访问或替换元素。split() 按空白切分一行，map(int, ...) 可逐个转换为整数。',
    example: 'heights = list(map(int, input().split()))\nheights.append(42)\nprint(len(heights), heights[-1])', input: '5 7 9\n',
    check: quiz('列表 [4, 9, 4] 中索引 1 的值是什么？', ['4', '9', '列表没有这一项'], 1, '索引 1 表示第二项，重复不影响索引。'),
    predict: quiz('把 ["白", "绿", "蓝"] 的第一项和最后一项互换后，第二项是什么？', ['蓝', '白', '绿'], 2, '交换索引 0 与 2，索引 1 上的“绿”没有移动。'),
    mistake: '访问 a[len(a)] 会触发 IndexError。非空列表最后一个索引是 len(a) - 1。' },
  { title: '按键查询和累计', tag: '字典',
    theory: '字典将键映射到值，键唯一。d[key] 在没有这个键时会报 KeyError，而 d.get(key, default) 可给出默认值。写入同一个键会替换旧值。',
    example: 'book = {"麻绳": 5, "彩纸": 2}\nname = input()\nbook[name] = book.get(name, 0) + 1\nprint(book[name])', input: '胶带\n',
    check: quiz('d = {"云": 2} 时，d.get("雨", 0) 会返回什么？', ['2', '0', 'KeyError'], 1, 'get 返回给定默认值，且不会插入新键。'),
    predict: quiz('先后给键 "石" 赋值 1 和 4，这个字典为 "石" 保留几个值？', ['2 个', '1 个，值为 1', '1 个，值为 4'], 2, '第二次赋值会覆盖第一次。'),
    mistake: '用 d[name] += 1 处理一个未出现的新键会报 KeyError，先读取默认值 0。' },
  { title: '把重复逻辑写成函数', tag: '函数',
    theory: 'def 声明函数，参数是调用时传入的值。return 把结果交给调用者并结束该次调用。没有执行到 return 时，函数返回 None。函数内定义的普通变量通常只在该次调用中可见。',
    example: 'def postage(weight):\n    return 5 + weight * 2\n\ncost = postage(int(input()))\nprint(cost)', input: '3\n',
    check: quiz('需要把计算结果交给其他表达式继续使用，函数里该用什么？', ['print', 'input', 'return'], 2, 'return 传回值，print 写到输出流。'),
    predict: quiz('若 f(x) 返回 x + 3，计算 f(f(2)) 得到什么？', ['5', '8', '10'], 1, '第一次调用返回 5，第二次以 5 为参数返回 8。'),
    mistake: '只 print 结果的函数通常返回 None。需要后续计算时，改用 return。' },
  { title: '用模块组织工具', tag: '模块',
    theory: '模块可以是一个 Python 文件。import math 引入模块，使用 math.gcd 等带模块名的写法。自己的 helpers.py 和主文件放在同一目录时，可以用 import helpers。入口判断 __name__ == "__main__" 可避免导入时执行命令行入口。',
    example: 'import helpers\n\nprint(helpers.triple(int(input())))', input: '7\n',
    exampleFiles: [{ name: 'helpers.py', content: 'def triple(value):\n    return value * 3\n' }],
    check: quiz('有 tools.py 文件，想引入模块时应写什么？', ['import tools.py', 'import tools', 'open(tools)'], 1, '导入时模块名称省略 .py。'),
    predict: quiz('若执行 import math，要调用平方根函数时应该怎么写？', ['sqrt(9)', 'math.sqrt(9)', 'math(9)'], 1, 'import math 将模块绑定到名字 math。'),
    mistake: '文件取名 math.py 可能挡住标准库同名模块。自定义模块应使用不同名字。' },
  { title: '把数据写入文件再读出', tag: '文件读写',
    theory: 'with open(...) 管理文件的关闭。用 "w" 写入会创建或覆盖文件，用 "a" 追加，用默认的 "r" 读取。中文文本显式使用 encoding="utf-8"。浏览器中的运行文件位于临时虚拟目录。',
    example: 'with open("memo.txt", "w", encoding="utf-8") as file:\n    file.write(input())\nwith open("memo.txt", encoding="utf-8") as file:\n    print(file.read())', input: '带上地图\n',
    check: quiz('已有文件时，用 "w" 打开它会怎样？', ['先清空原文件', '总是在末尾追加', '只允许读取'], 0, '"w" 打开时就会截断文件。'),
    predict: quiz('已有文件内容为 "甲"，追加 file.write("乙") 后的完整内容是什么？', ['乙', '甲乙', '甲\\n乙'], 1, 'write() 不会自动写入换行。'),
    mistake: '把浏览器运行时生成的文件当作工作台已保存文件。每次运行从左侧文件快照新建目录。' },
  { title: '读懂异常并缩小问题', tag: '异常调试',
    theory: '错误栈标明文件、行号和出错调用。先看最后一行的异常类型和消息，再找最靠近异常的自己的源码。try 保护可能失败的操作，except 捕获具体的异常类型。',
    example: 'raw = input()\ntry:\n    number = int(raw)\n    print(number + 1)\nexcept ValueError:\n    print("需要整数")', input: '七\n',
    check: quiz('int("3.7") 最可能引发哪一种异常？', ['ValueError', 'IndexError', 'NameError'], 0, '字符串类型能传给 int，但 "3.7" 不是整数文本。'),
    predict: quiz('若把示例的 except 改为 except IndexError，并输入 "三"，会怎样？', ['打印“需要整数”', '未捕获的 ValueError', '输出 0'], 1, 'except IndexError 只捕获这一类异常。'),
    mistake: '用一个空的 except 吞掉全部异常会掩盖真正错误。只在能明确处理时捕获具体类型。' },
  { title: '组合工具独立解题', tag: '综合应用',
    theory: '读题后先用一句话写出输出目标，记录会变化的状态，再用样例手推。编写代码后针对空数据、相等边界和并列规则自测。把可独立复用的逻辑抽成函数。',
    example: 'def total_above(values, limit):\n    return sum(value for value in values if value > limit)\n\nlimit = int(input())\nvalues = list(map(int, input().split()))\nprint(total_above(values, limit))', input: '6\n3 9 6 11\n',
    check: quiz('规则从“大于上限”改为“至少达到上限”。哪个输入最能区分两者？', ['值小于上限', '值等于上限', '值大于上限'], 1, '相等的数据只符合“至少达到”。'),
    predict: quiz('并列要取最早出现者。按输入顺序扫描时该在何时更新最佳值？', ['只在严格更好时', '相等也更新', '只在严格更差时'], 0, '严格更好才替换，首次出现的并列项就会保留。'),
    mistake: '用一个样例判断正确性。额外构造最小规模、刚好相等和多个并列的测试。' },
];

type Project = {
  id: string; title: string; tags: string; description: string; steps: string[];
  input: string; expected: string; acceptance: string; files: TaskFile[]; solution: string; assessment?: Problem;
};

export const projects: Project[] = [
  { id: ledgerCapstone.id, title: ledgerCapstone.title, tags: '基础篇结项 · 多文件与 CSV',
    description: ledgerCapstone.description, steps: ledgerCapstone.guide!.steps,
    input: ledgerCapstone.sample[0], expected: ledgerCapstone.sample[1], acceptance: ledgerCapstone.sample[2],
    files: ledgerCapstone.starterFiles!, solution: ledgerCapstone.solution, assessment: ledgerCapstone },
  { id: 'words', title: '文本词频统计', tags: '字符串 · 字典 · 模块', description: '从文件读入英文短文，忽略大小写和标点，按频率列出前 k 个单词。',
    steps: ['标准输入读入正整数 k。读取随项目提供的 article.txt。',
      '用 re.findall 按 [a-z]+ 提取小写英文词，按词累计每次出现。',
      '按次数从大到小排序，同频按单词字母顺序。每行输出单词和次数，最多 k 行。没有单词时输出“空文本”。'],
    input: '3\n', expected: 'wind 3\nbridge 2\nthe 2\n',
    acceptance: '把 k 改为 1，输出应只有 wind 3。把文件改成纯标点，应输出“空文本”。',
    files: [{ name: 'main.py', content: '# 文本词频统计\nimport re\n\n# 读取 article.txt，再统计与排序\n' },
      { name: 'article.txt', content: 'Wind over the bridge. Wind under the bridge? No: wind and rain.\n' }],
    solution: 'import re\n\nlimit = int(input())\nwith open("article.txt", encoding="utf-8") as article:\n    words = re.findall(r"[a-z]+", article.read().lower())\ncounts = {}\nfor word in words:\n    counts[word] = counts.get(word, 0) + 1\nif not counts:\n    print("空文本")\nelse:\n    ranked = sorted(counts, key=lambda word: (-counts[word], word))\n    for word in ranked[:limit]:\n        print(word, counts[word])' },
];
