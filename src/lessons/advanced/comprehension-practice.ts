import { task } from './practice.ts';
import { expressionTags } from './authoring.ts';

export const comprehensionProblems = [
  task(21, expressionTags[0], '入门', '校验展位编号', {
    background: '扫码机把大小写混用的展位编号写在同一行，部分编号来自旧系统。',
    description: '只保留大小写不敏感的 EX- 前缀且其后全为 ASCII 数字的编号。输出时将前缀统一成大写，保留编号中的零和出现次序。',
    input: '一行以空格分隔的编号，可以为空。',
    output: '用一个空格连接有效编号，无结果时输出「空」。重复的有效编号仍逐次输出。',
    limits: '0–500 个编号，每个 1–20 字符，可含非 ASCII 字符。不接受没有数字后缀的编号。',
  }, ['ex-02 A2 EX- EX-02 EX-２ Ex-7\n', 'EX-02 EX-02 EX-7\n', '全角 ２ 不属于 ASCII，保留两次有效的 EX-02。'], [
    ['\n', '空\n'], ['EX-0 ex-00 ex00\n', 'EX-0 EX-00\n'], ['EX--1 EX-4Z EX-５\n', '空\n'],
  ], ['先统一前缀大小写，再判断原来是否以 EX- 开始。', '后缀要同时满足 isascii() 和 isdecimal()。'], `tokens = input().split()
upper = [token.upper() for token in tokens]
valid = [token for token in upper if token.startswith("EX-")
         and token[3:].isascii() and token[3:].isdecimal()]
print(" ".join(valid) or "空")
`, { concepts: ['字符串遍历与归一化', '复合筛选', '保序与重复'],
    approach: '字符形式是业务数据，保留字符串后缀以免丢失前导零。先规范前缀，再逐项检查是否符合编号结构。',
    steps: ['拆出所有编号并转为大写。', '验证前缀、ASCII 和非空数字后缀。', '按原输入次序连接有效编号。'],
    time: 'O(s)，s 为输入字符数。', space: 'O(s)。',
    pitfall: 'isdecimal() 本身接受全角数字。转 int 还会丢前导零。', extension: '额外报告无效编号的位置，保留其原样便于回查。' }),

  task(22, expressionTags[0], '入门', '保持读数槽位', {
    background: '温度屏幕每个槽位有固定编号。停机时该位置显示 NA，其他位置显示相对参考温度的偏差。',
    description: '把缺测标记 -999 换成 NA，其他数值减去参考温度，保留所有输入项的位置。',
    input: '第一行参考温度，第二行是一行以空格分隔的整数读数，可以为空。',
    output: '以一个空格连接所有结果。无读数时输出「空」。',
    limits: '0–600 条读数，参考温度 -100–100。读数是 -999 或 -100–100 的整数。0 与负偏差均应输出。',
  }, ['20\n21 -999 20 17 -999\n', '1 NA 0 -3 NA\n', '第二和第五个位置缺测，其他槽位照常显示。'], [
    ['0\n\n', '空\n'], ['-10\n-999 -999\n', 'NA NA\n'], ['-3\n-3 -4 0\n', '0 -1 3\n'],
  ], ['需要保留槽位，所以每项都必须有产出。', '在推导式前部用 NA if ... else ...。'], `reference = int(input())
readings = [int(text) for text in input().split()]
labels = ["NA" if value == -999 else str(value - reference) for value in readings]
print(" ".join(labels) or "空")
`, { concepts: ['条件表达式', '列表变换', '占位语义'],
    approach: '把每个读数变成一个字符串。条件表达式选择缺测标记或正常偏差。',
    steps: ['解析参考值与全部读数。', '逐项在两种表示之间选择。', '保持读数顺序输出。'],
    time: 'O(n)。', space: 'O(n)。', pitfall: '在末尾用 if 排除 -999 会错位。',
    extension: '再输出缺测的原始槽位编号，保持主报告格式。' }),

  task(23, expressionTags[0], '基础', '大额交易净额', {
    background: '平台只核对达到指定门槛的已结算交易。退款和收入都可能达到门槛。',
    description: '选出状态 OK 且金额绝对值不低于门槛的交易，保留金额符号与输入顺序，统计这些交易的净额。',
    input: '第一行 n limit，随后 n 行为交易状态与整数金额。状态是 OK 或 HOLD。',
    output: '首行以一个空格连接选中的金额，空写「空」。第二行输出净额。',
    limits: '0 ≤ n ≤ 1000，0 ≤ limit ≤ 10^4，金额在 -10^4–10^4。limit 为 0 时，已结算的零金额也保留。',
  }, ['5 20\nOK 20\nHOLD -90\nOK -26\nOK 19\nOK -20\n', '20 -26 -20\n-26\n', '门槛用绝对值判断，净额保留退款的负号。'], [
    ['0 0\n', '空\n0\n'], ['3 0\nHOLD 0\nOK 0\nOK 1\n', '0 1\n1\n'],
    ['4 4\nOK -3\nHOLD 6\nOK 4\nOK -4\n', '4 -4\n0\n'],
  ], ['用结构化记录存放已解析状态和金额。', '在筛选条件里用 abs，产出表达式使用原金额。'], `n, limit = map(int, input().split())
rows = []
for _ in range(n):
    status, amount = input().split()
    rows.append((status, int(amount)))
kept = [row[1] for row in rows if row[0] == "OK" and abs(row[1]) >= limit]
print(" ".join(map(str, kept)) or "空")
print(sum(kept))
`, { concepts: ['多条件筛选', '转换与筛选分离', '净额'],
    approach: '先把金额解析为整数，再一次筛选出需要同时显示和加总的资料。',
    steps: ['读入结构化记录。', '先确认状态，再比较金额大小。', '打印保留列表，以原值求和。'],
    time: 'O(n)。', space: 'O(n)。', pitfall: '将 abs(amount) 当产出会把退款变成收入。',
    extension: '同时报告拒绝条数与分类理由，比较普通循环和列表推导式的表达效果。' }),

  task(24, expressionTags[0], '进阶', '校准后的巡检标记', {
    background: '设备数据须先通过原始范围和状态校验。通过校验的读数加上校准偏移，再按独立阈值对外发布告警。',
    description: '仅处理状态 OK 且原始读数位于 [low, high] 的记录。校准值等于原读数加 bias。校准值大于或等于 alarm 时为 ALERT，否则为 NORMAL。',
    input: '首行 n low high bias alarm。随后 n 行为设备编号、原始整数读数、状态（OK 或 BAD）。',
    output: '首行合格数。然后按输入顺序逐行输出「编号 校准值 标签」。同一编号的多条记录分别保留。',
    limits: '0 ≤ n ≤ 500，数值均在 -1000–1000，low ≤ high，编号为 1–12 位英数字。没有有效记录时只输出 0。',
  }, ['5 10 20 3 20\nZ 17 OK\nA 20 BAD\nB 20 OK\nZ 10 OK\nC 9 OK\n',
    '3\nZ 20 ALERT\nB 23 ALERT\nZ 13 NORMAL\n', '先按原值校验，校准后超出旧范围仍有效，等于阈值发告警。'], [
    ['0 0 0 0 0\n', '0\n'],
    ['3 0 2 -5 -5\nE 0 OK\nF 2 OK\nG 3 OK\n', '2\nE -5 ALERT\nF -3 ALERT\n'],
    ['3 -2 -2 1 0\nC -2 OK\nC -2 OK\nC -1 OK\n', '2\nC -1 NORMAL\nC -1 NORMAL\n'],
  ], ['先产出通过校验的 (编号, 校准值)。', '再对校准值分级，避免重新验证它是否在原始区间。'], `n, low, high, bias, alarm = map(int, input().split())
readings = []
for _ in range(n):
    code, raw, state = input().split()
    readings.append((code, int(raw), state))
valid = [(row[0], row[1] + bias) for row in readings
         if row[2] == "OK" and low <= row[1] <= high]
labels = ["ALERT" if row[1] >= alarm else "NORMAL" for row in valid]
print(len(valid))
for i in range(len(valid)):
    print(valid[i][0], valid[i][1], labels[i])
`, { concepts: ['按原值过滤', '变换结果', '条件表达式'],
    approach: '分开校验和分级，第一步的数值是原读数，第二步的数值才是偏移后的读数。',
    steps: ['解析记录含状态。', '只为合法记录构造新的校准值和编号。', '根据校准值选择标签并保序发布。'],
    time: 'O(n)。', space: 'O(n)。', pitfall: '用校准值验证原始边界会错收或错拒。',
    extension: '将报告分成两份列表，分别保留告警和正常数据的编号顺序。' }),
];
