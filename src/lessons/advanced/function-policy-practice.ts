import { functionTags } from './authoring.ts';
import { task } from './practice.ts';

export const functionPolicyProblems = [
  task(45, functionTags[2], '入门', '切换校准模式',
    { background: '同一读数面板需在不同处理规则下预览原始数据。',
      description: 'DOUBLE 将每项乘二，ABS 取绝对值，SIGN 将负数、零、正数分别转换为 -1、0、1。',
      input: '第一行模式，第二行是空格分隔的整数，可为空。',
      output: '以空格连接换算结果，无数据时输出 NONE。',
      limits: '0–1000 个读数，每项 -10000–10000，模式为 DOUBLE、ABS、SIGN。' },
    ['SIGN\n-7 0 8 -1\n', '-1 0 1 -1\n', '每个位置都产生结果。'],
    [['ABS\n-3 0 3\n', '3 0 3\n'], ['DOUBLE\n-4 0 2\n', '-8 0 4\n'], ['SIGN\n\n', 'NONE\n']],
    ['字典值存储函数对象。', '用 map 把所选规则应用到每个读数。'], `rules = {
    "DOUBLE": lambda value: value * 2,
    "ABS": abs,
    "SIGN": lambda value: (value > 0) - (value < 0),
}
rule = rules[input()]
values = map(int, input().split())
print(" ".join(str(value) for value in map(rule, values)) or "NONE")
`, { concepts: ['函数对象', 'lambda', 'map'], approach: '选择规则与逐项处理分开，只保留一条转换流程。',
      steps: ['读出模式并取得函数。', '读出整数并逐项转换。', '格式化或返回空标记。'],
      time: 'O(n)。', space: 'O(n)，含读入和输出。', pitfall: '把规则提前调用会让字典存入其结果。',
      extension: '增加一条只处理低于阈值读数的规则。' }),

  task(46, functionTags[2], '入门', '三种告警筛选规则',
    { background: '审核界面切换筛选模式，每次应报告所通过的原读数。',
      description: 'MIN 保留 ≥ threshold 的值，MAX 保留 ≤ threshold 的值，GAP 保留与 threshold 不等的值。',
      input: '首行「模式 threshold」，次行是空格分隔的整数，可为空。',
      output: '按原顺序输出所有通过值，以一个空格连接；空写 NONE。',
      limits: '0–800 个整数，值和阈值均在 -1000–1000，重复值逐条判定。' },
    ['MIN 0\n-1 0 3 0\n', '0 3 0\n', '等于阈值也可通过 MIN。'],
    [['MAX -2\n-1 -2 -3\n', '-2 -3\n'], ['GAP 0\n0 -1 4 0\n', '-1 4\n'], ['MIN 2\n\n', 'NONE\n']],
    ['每条规则都接收一个整数，返回判断结果。', 'filter 会保留通过筛选的原整数。'], `mode, raw_limit = input().split()
limit = int(raw_limit)
rules = {
    "MIN": lambda value: value >= limit,
    "MAX": lambda value: value <= limit,
    "GAP": lambda value: value != limit,
}
kept = filter(rules[mode], map(int, input().split()))
print(" ".join(map(str, kept)) or "NONE")
`, { concepts: ['回调接口', 'filter', '边界'], approach: '按名字选择同一签名的谓词，共享输出流程。',
      steps: ['先确定模式和门槛。', '保留谓词为真的原值。', '输出原顺序，重复值不合并。'],
      time: 'O(n)。', space: 'O(n)，含输入和输出。', pitfall: '输出布尔判断序列会丢失原始读数。',
      extension: '一次配置两条规则，比较交集与并集的输出。' }),

  task(47, functionTags[2], '基础', '按视角排列工单',
    { background: '同一份工单可按优先分或耗时浏览，完全并列时要保持录入次序。',
      description: 'SCORE 模式按分数降序、耗时升序。TIME 模式只按耗时升序。输出全部工单编号。',
      input: '首行「n 模式」，随后 n 行为编号、非负整数分数、耗时。',
      output: '编号用单空格连接，空表写 NONE。',
      limits: '0 ≤ n ≤ 600，编号唯一，1–10 位英数字，分数和耗时为 0–1000。' },
    ['4 SCORE\nZ 9 3\nA 8 1\nB 9 3\nC 9 2\n', 'C Z B A\n', 'Z 与 B 比较键相同，保留录入顺序。'],
    [['0 SCORE\n', 'NONE\n'], ['3 TIME\nZ 0 1\nA 9 1\nB 1 0\n', 'B Z A\n'],
      ['3 SCORE\nA 0 0\nB 3 3\nC 3 2\n', 'C B A\n']],
    ['用一个函数按模式返回比较键函数。', '同键不添加编号比较，可保留 Python 的稳定排序。'], `def select_key(mode):
    if mode == "SCORE":
        return lambda row: (-row[1], row[2])
    return lambda row: row[2]

length, mode = input().split()
rows = []
for _ in range(int(length)):
    code, score, minutes = input().split()
    rows.append((code, int(score), int(minutes)))
print(" ".join(row[0] for row in sorted(rows, key=select_key(mode))) or "NONE")
`, { concepts: ['返回函数', '稳定排序', '复合排序键'], approach: '主流程只调用一次 sorted，比较含义来自传入的规则。',
      steps: ['将分数与耗时解析为整数。', '按模式构造或选择键函数。', '用稳定排序得到编号顺序。'],
      time: '最坏 O(n log n) 次比较。', space: 'O(n)。', pitfall: '把编号放进键会改变完全并列项的顺序。',
      extension: '增加只按分数排序的视角，单测各键函数。' }),

  task(48, functionTags[2], '进阶', '读数转换管道',
    { background: '编辑器使用若干已知规则组成转换流程。先过滤后换算与先换算后过滤可能得到不同结果。',
      description: '按顺序依次应用规则：ADD3 每项加 3，DOUBLE 每项乘二，ABS 取绝对值，DROPNEG 去掉当前负数。规则可以重复。',
      input: '两行。第一行是规则名序列，可为空。第二行是空格分隔的整数，可为空。',
      output: '第一行为最终序列，用单空格连接，空写 NONE。第二行为最终序列合计。',
      limits: '0–12 条规则，0–300 个整数，原值 -1000–1000，保留重复值。' },
    ['ADD3 DROPNEG DOUBLE\n-4 -3 -1 2\n', '0 4 10\n14\n', '第一步后只有原 -4 仍为负数。'],
    [['\n-2 0 2\n', '-2 0 2\n0\n'], ['DROPNEG ABS\n-5 -1\n', 'NONE\n0\n'],
      ['ABS DROPNEG DOUBLE DOUBLE\n-3 0\n', '12 0\n12\n'], ['ADD3\n\n', 'NONE\n0\n']],
    ['先约定每个规则接收序列，产出下游能继续读取的序列。', '最终列表要打印又要求和，先物化一次。'], `def run_pipeline(values, steps):
    for step in steps:
        values = step(values)
    return list(values)

rules = {
    "ADD3": lambda values: map(lambda x: x + 3, values),
    "DOUBLE": lambda values: map(lambda x: x * 2, values),
    "ABS": lambda values: map(abs, values),
    "DROPNEG": lambda values: filter(lambda x: x >= 0, values),
}
steps = [rules[name] for name in input().split()]
result = run_pipeline(map(int, input().split()), steps)
print(" ".join(map(str, result)) or "NONE")
print(sum(result))
`, { concepts: ['高阶函数', '惰性管道', '组合与消费'], approach: '让各步骤遵守相同可迭代接口，前一步的结果直接交给下一步。',
      steps: ['把规则名翻译成函数序列。', '依次应用转换或筛选。', '收集终值一次，供显示和求和复用。'],
      time: 'O(n(k+1))，n 为输入项数，k 为规则数。', space: 'O(n+k)。',
      pitfall: '规则不可任意交换。若先 sum 消费终值会丢失待展示的明细。', extension: '支持 CHECKPOINT 规则输出中间表，解释缓冲的空间代价。' }),

  task(49, functionTags[3], '入门', '门店默认值与一次覆盖',
    { background: '每单可以临时改费率，管理员也可以更新长期设置。',
      description: '费率从输入初值开始。SET 改长期费率，USE 用当前费率算订单，ONE 仅在此次采用显式费率。',
      input: '首行「初值 q」。随后 q 行为 SET 费率、USE 数量，或 ONE 数量 费率。',
      output: '每个 USE 和 ONE 输出数量乘对应费率。最后输出长期费率。',
      limits: '0 ≤ q ≤ 300，所有数值为 0–1000。' },
    ['2 4\nUSE 3\nONE 3 9\nSET 0\nUSE 3\n', '6\n27\n0\n0\n', 'ONE 的 9 只用于当单。'],
    [['6 0\n', '6\n'], ['3 2\nONE 2 0\nUSE 2\n', '0\n6\n3\n'],
      ['0 3\nSET 3\nSET 7\nUSE 2\n', '14\n7\n']],
    ['持久设置和当单参数可以同名，但归属不同。', '明确声明 SET 修改模块绑定，计算函数可直接接收一次性新值。'], `rate, q = map(int, input().split())

def set_rate(value):
    global rate
    rate = value

def charge(units, override=None):
    return units * (rate if override is None else override)

for _ in range(q):
    action, *raw = input().split()
    values = list(map(int, raw))
    if action == "SET":
        set_rate(*values)
    else:
        print(charge(*values))
print(rate)
`, { concepts: ['全局绑定', '读取自由名称', '一次覆盖'], approach: '只有更新命令重绑持久费率，调用参数只影响当单计算。',
      steps: ['保存初始设置。', '按动作更新或计算。', '最后检查持久绑定。'],
      time: 'O(q)。', space: 'O(1)。', pitfall: '用 override or rate 会忽略明确设置的 0。',
      extension: '改成工厂提供每个门店独立的设置和计费函数。' }),

  task(50, functionTags[3], '入门', '双窗口独立计数',
    { background: '两个窗口维护各自的排队数，增减事件可能交错。',
      description: 'E 和 W 从各自初值开始。每个事件只向指定窗口的计数加上该事件增量并输出新值。',
      input: '首行「E 初值 W 初值 q」，随后 q 行分别为窗口编号 E 或 W 与有符号增量。',
      output: '每次更新输出一个新的窗口计数。',
      limits: '0 ≤ q ≤ 500，初值和增量为 -1000–1000。负计数允许。' },
    ['0 10 4\nE 3\nW -1\nE 0\nW 2\n', '3\n9\n3\n11\n', '两个窗口更新相互独立。'],
    [['4 3 0\n', ''], ['0 0 3\nE 1\nW 1\nE 1\n', '1\n1\n2\n'],
      ['-1 -2 2\nE -3\nW 0\n', '-4\n-2\n']],
    ['每次工厂调用保存一份初始计数。', '内部函数用 nonlocal 更新自己的计数。'], `def make_counter(value):
    def add(delta):
        nonlocal value
        value += delta
        return value
    return add

east, west, q = map(int, input().split())
counters = {"E": make_counter(east), "W": make_counter(west)}
for _ in range(q):
    desk, delta = input().split()
    print(counters[desk](int(delta)))
`, { concepts: ['闭包', 'nonlocal', '独立实例状态'], approach: '工厂的两次执行产生两份绑定，按窗口取相应回调。',
      steps: ['从两个初值分别创建回调。', '按窗口取函数。', '让函数更新并返回自己的计数。'],
      time: 'O(q)。', space: 'O(1)。', pitfall: '将同一个闭包赋给两个窗口会共享计数。',
      extension: '增加 READ 事件，读取但不改变窗口计数。' }),

  task(51, functionTags[3], '基础', '延后调用的转换规则',
    { background: '设备预先登记规则，读取数据时再按设备编号调用，避免循环结束后全部采用最后一份规则。',
      description: 'ADD 对读数加指定常量，SCALE 乘指定常量。每个查询根据编号使用该设备登记的规则。',
      input: '首行 n q。随后 n 行为编号、ADD 或 SCALE、常量，再有 q 行编号和读数。',
      output: '逐查询输出转换后的整数。未登记编号输出 NA。',
      limits: '0 ≤ n,q ≤ 400，登记编号唯一，1–10 位英数字，常量和读数在 -1000–1000。' },
    ['3 4\nZ ADD 2\nA SCALE -1\nM ADD 9\nZ 4\nA 4\nM 4\nX 4\n', '6\n-4\n13\nNA\n', 'Z 的 +2 和 M 的 +9 是独立规则。'],
    [['0 1\nA 1\n', 'NA\n'], ['2 2\nA SCALE 0\nB ADD -2\nA -4\nB -4\n', '0\n-6\n'],
      ['1 3\nX ADD 3\nX 0\nY 0\nX 1\n', '3\nNA\n4\n']],
    ['登记时调用工厂并传入当行的常量。', '用字典保存函数，查询时再执行。'], `def make_rule(kind, offset):
    if kind == "ADD":
        return lambda value: value + offset
    return lambda value: value * offset

n, q = map(int, input().split())
rules = {}
for _ in range(n):
    code, kind, offset = input().split()
    rules[code] = make_rule(kind, int(offset))
for _ in range(q):
    code, raw = input().split()
    rule = rules.get(code)
    print(rule(int(raw)) if rule is not None else "NA")
`, { concepts: ['工厂函数', '延后绑定', '按键调用'], approach: '每条规则关住自己创建时的常量绑定，计算统一延迟到查询。',
      steps: ['逐行读取规则和配置。', '以工厂创建函数，存入字典。', '查到函数后用实际读数调用。'],
      time: '平均 O(n+q)。', space: 'O(n)。', pitfall: '在一层循环内都捕获外部 offset，会在延后运行时读到最后一次绑定。',
      extension: '让同一设备可以重新登记，验证其他设备的回调仍可用。' }),

  task(52, functionTags[3], '进阶', '站点限额独立维护',
    { background: '多个站点各有可用额度，被拒绝的请求应保持原余额。重新开放会重设该站限额。',
      description: 'OPEN 保存新额度，可覆盖同一站。USE 未开放时输出 UNKNOWN，已开放时若额度足够则扣减并输出 OK 与余额，否则输出 NO 与原余额。',
      input: '首行 q，随后 q 行各为 OPEN 或 USE、站点编号、非负整数。',
      output: '只对 USE 输出一行：UNKNOWN、OK 余额或 NO 余额。',
      limits: '0 ≤ q ≤ 600，编号为 1–10 位英数字，数值 0–1000。请求 0 在已开放站点成功。' },
    ['7\nUSE A 1\nOPEN A 4\nOPEN B 2\nUSE A 5\nUSE B 2\nOPEN A 1\nUSE A 1\n', 'UNKNOWN\nNO 4\nOK 0\nOK 0\n', '拒绝请求保留原额度；重设 A 后扣减到零。'],
    [['0\n', ''], ['4\nOPEN A 0\nUSE A 0\nUSE A 1\nUSE B 0\n', 'OK 0\nNO 0\nUNKNOWN\n'],
      ['5\nOPEN X 5\nOPEN Y 5\nUSE X 8\nUSE X 5\nUSE Y 4\n', 'NO 5\nOK 0\nOK 1\n']],
    ['每个站点存一个拥有独立余额的闭包。', '用 OPEN 替换当前闭包，拒绝时不要重绑余额。'], `def make_station(remaining):
    def reserve(amount):
        nonlocal remaining
        if amount > remaining:
            return "NO", remaining
        remaining -= amount
        return "OK", remaining
    return reserve

stations = {}
for _ in range(int(input())):
    action, site, amount = input().split()
    if action == "OPEN":
        stations[site] = make_station(int(amount))
    elif site not in stations:
        print("UNKNOWN")
    else:
        print(*stations[site](int(amount)))
`, { concepts: ['nonlocal', '状态归属', '失败路径'], approach: '把唯一可修改的额度藏在站点函数中，统一判断是否允许扣除。',
      steps: ['每次开放创建新状态。', '查询已开放站点。', '让相应闭包返回结果与余额。'],
      time: '平均 O(q)。', space: 'O(s)，s 为站点数。', pitfall: '先扣减再检查会污染拒绝后的余额。',
      extension: '让每个站点同时提供归还和查看方法，说明哪些回调共享余额。' }),
];
