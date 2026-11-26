import { task } from './practice.ts';
import { expressionTags } from './authoring.ts';

export const mappingExpressionProblems = [
  task(25, expressionTags[1], '入门', '最新库存报表', {
    background: '离线设备恢复联网后可能补发旧库存，同一版本也可能收到更正。',
    description: '每个编号选版本最大的记录。同一最高版本按到达顺序取最后一条。选完再按门槛筛选，以编号在输入中首次出现的顺序输出。',
    input: '第一行 n limit，随后 n 行「编号 版本 当前数量」。旧格式「编号 当前数量」的版本按 0 处理，两种格式可混用。',
    output: '每个达标展位一行「编号 数量」。无达标项时输出「空」。',
    limits: '0 ≤ n ≤ 800，数量和门槛 0–1000，版本 0–10000，编号 1–12 位英数字。数量等于门槛也达标。',
  }, ['7 2\nZ 2 3\nA 4 5\nZ 2 0\nB 0 2\nA 2 1\nZ 1 9\nA 4 3\n', 'A 3\nB 2\n', 'Z 的最高版本更正为 0，低版本的 9 不生效。A 与 B 达标，按首次出现顺序输出。'], [
    ['0 0\n', '空\n'], ['2 0\nB 3\nB 0\n', 'B 0\n'], ['4 4\nZ 0\nC 9\nZ 4\nC 3\n', 'Z 4\n'],
    ['5 4\nZ 0 0\nA 4\nZ 10000 4\nZ 3\nA 0 3\n', 'Z 4\n'],
  ], ['为每个编号保存版本和数量，并辨别什么时候允许覆盖。', '同版本允许覆盖。完成全部决胜后，用字典推导式筛选。'], `n, limit = map(int, input().split())
latest = {}
for _ in range(n):
    code, *fields = input().split()
    version = int(fields[0]) if len(fields) == 2 else 0
    quantity = int(fields[-1])
    if code not in latest or version >= latest[code][0]:
        latest[code] = (version, quantity)
qualified = {code: quantity for code, (_, quantity) in latest.items() if quantity >= limit}
for code, quantity in qualified.items():
    print(code, quantity)
if not qualified:
    print("空")
`, { concepts: ['字典推导式', '按版本覆盖', '插入顺序'],
    approach: '循环负责逐条决胜，推导式负责最终筛选。已有键的更新保留首次插入的位置。',
    steps: ['识别两种输入格式并统一成版本与数量。', '版本达到现有版本时覆盖。', '从最终状态过滤并按首次出现顺序输出。'],
    time: '哈希平均 O(n)。', space: 'O(n)。', pitfall: '用 > 会漏掉同版本更正。先筛选数量会保留已被更正的正库存。',
    extension: '另外记录各展位最后一次更新的位置，让输出可以选择首现或最近顺序。' }),

  task(26, expressionTags[1], '入门', '可预约的标签集合', {
    background: '多个馆区提交预约标签。只有已开放馆区需要汇总，不同大小写写法表示同一个标签。',
    description: '在开放馆区的所有记录中，收集以大小写不敏感的 P- 开头且有非空后缀的标签。按小写形式去重。',
    input: '第一行开放馆区编号，可为空。第二行 n，之后 n 行每行先给馆区编号，再给零个或多个标签。',
    output: '输出按字典序升序的唯一标签，以一个空格连接。无结果时输出「空」。',
    limits: '0 ≤ n ≤ 200，每行最多 50 个标签。馆区编号 1–10 位英数字并区分大小写。标签为 1–18 位英数字或连字符。',
  }, ['E W\n4\nE P-A p-a q-a\nZ P-B\nW P-C p-\nW p-C P-d\n', 'p-a p-c p-d\n', 'Z 未开放，空后缀不收录，大小写变体合并。'], [
    ['\n1\nE P-A\n', '空\n'], ['A\n1\nA\n', '空\n'], ['A\n2\nA p-A P-Z p-a\nA P- P-0\n', 'p-0 p-a p-z\n'],
  ], ['外层先根据馆区过滤。', '内层展开当行的标签，前部表达式统一成小写后再去重。'], `opened = set(input().split())
rows = [input().split() for _ in range(int(input()))]
labels = {label.lower() for row in rows if row[0] in opened
          for label in row[1:] if len(label) > 2 and label.lower().startswith("p-")}
print(" ".join(sorted(labels)) or "空")
`, { concepts: ['集合推导式', '多层循环', '规范化后去重'],
    approach: '把馆区过滤放到内层循环之前，只遍历需要汇总的标签。集合接收转换后的值。',
    steps: ['建立已开放馆区的集合。', '逐行先选馆区，再筛出合法标签。', '转小写后自动去重，最后排序输出。'],
    time: '设 n 为输入字段数，k 为不同有效标签数，平均 O(n+k log k)。', space: 'O(n)。',
    pitfall: '直接转换成列表会保留同一个标签的多个大小写变体。',
    extension: '改做按馆区分别去重的报表，比较外层采用字典还是列表。' }),

  task(27, expressionTags[1], '基础', '推荐榜并列复核', {
    background: '活动方把不同大小写视为同一候选编号。达到最低有效票数后，公布所有并列最高的编号和票数。',
    description: '将候选编号统一为小写后计票。若全场最高票低于门槛或没有选票，输出「无」。否则按编号字典序输出全部并列最高者及票数。',
    input: '第一行 n minimum，随后 n 行各一个候选编号。',
    output: '无有效候选时只输出「无」。有时每行输出「编号 票数」。',
    limits: '0 ≤ n ≤ 1500，1 ≤ minimum ≤ 1500，编号 1–12 个英文字母。可合并多个大小写变体。',
  }, ['6 2\nZed\nALPHA\nalpha\nzed\nLOW\nLow\n', 'alpha 2\nlow 2\nzed 2\n', '三组编号各两票，统一小写后按编号排。'], [
    ['0 1\n', '无\n'], ['3 3\nA\na\nB\n', '无\n'],
    ['5 3\nx\nX\nB\nx\nb\n', 'x 3\n'],
  ], ['先在字典里单次累加频数。', '从频数映射选出并列最高且达门槛的键。'], `n, minimum = map(int, input().split())
counts = {}
for _ in range(n):
    code = input().lower()
    counts[code] = counts.get(code, 0) + 1
best = max(counts.values(), default=0)
winners = {code: counts[code] for code in counts if counts[code] == best and best >= minimum}
for code in sorted(winners):
    print(code, winners[code])
if not winners:
    print("无")
`, { concepts: ['归一化计数', '字典筛选', '并列排序'],
    approach: '用一次循环统计频数，再用推导式把最终频数转换成赢家报表。',
    steps: ['转换每张票并更新自己的计数。', '获取最高票，空票用默认值 0。', '用门槛和最高票筛出所有赢家后排序。'],
    time: '设 k 为获胜编号数量，平均 O(n+k log k)。', space: 'O(u)，u 为不同候选数。',
    pitfall: '用一次 max(counts, key=...) 只返回一个键，漏掉并列。',
    extension: '输出过门槛的所有候选，并按得票降序、字典序升序排行。' },
  { kind: 'adapted', platform: 'AtCoder', title: 'Poll', id: 'ABC155 C', level: 'ABC C',
    url: 'https://atcoder.jp/contests/abc155/tasks/abc155_c?lang=en',
    concepts: ['投票计数', '并列最大值'],
    adaptation: '保留全部最高频项的思想，添加输入大小写归一、空选票与最低得票门槛，并输出得票数。' }),

  task(28, expressionTags[1], '进阶', '把巡检表转成逐日表', {
    background: '每台设备占一行，记录从第一天起的连续读数。有些设备提前停止了记录。',
    description: '把行转成按日期组织的列。任何设备当天没有记录时写 X，某天所有设备都没有记录仍应输出该列。',
    input: '第一行 r d，后 r 行各有 0–d 个整数，表示从第 1 天开始的连续记录。',
    output: '若 r 或 d 为 0，输出「空」。其余情况输出 d 行，每行按设备输入顺序给出 r 项，字段用空格分隔。',
    limits: '0 ≤ r,d ≤ 35，读数 -100–100。零是有效数据。空设备行仍占一个设备位置。',
  }, ['3 3\n8 0 6\n2\n\n', '8 2 X\n0 X X\n6 X X\n', '设备三整行缺记录，设备二仅在第一天有值。'], [
    ['0 2\n', '空\n'], ['2 0\n\n\n', '空\n'], ['2 3\n\n0 -1\n', 'X 0\nX -1\nX X\n'],
    ['1 1\n-8\n', '-8\n'],
  ], ['先让日期做外层循环。', '取某行的列下标前，检查该行长度。'], `r, d = map(int, input().split())
rows = [[int(value) for value in input().split()] for _ in range(r)]
if r == 0 or d == 0:
    print("空")
else:
    by_day = [[str(row[day]) if day < len(row) else "X" for row in rows] for day in range(d)]
    for day in by_day:
        print(" ".join(day))
`, { concepts: ['嵌套推导式', '转置', '边界填充'],
    approach: '输出的横纵顺序在外层选日期时确定，内层处理该日全部设备。',
    steps: ['读入长度不同的各行。', '用两层循环分别决定日期和设备。', '每个位置在观测值与占位标记间选择。'],
    time: 'O(rd+r)。', space: 'O(rd+r)，含输入行表和逐日报告。',
    pitfall: '用 zip(*rows) 会在最短行结束，空行可能让结果完全消失。',
    extension: '另打印每个日期的缺测设备数，区分真实读数 0。' },
  { kind: 'adapted', platform: 'LeetCode', title: 'Transpose Matrix', id: '867', level: 'Easy',
    url: 'https://leetcode.com/problems/transpose-matrix/',
    concepts: ['转置', '列优先输出'],
    adaptation: '把原题的矩形矩阵改为不等长设备记录，增加缺测填充、显式输出天数与空维度。' }),
];
