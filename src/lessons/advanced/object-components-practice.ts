import { objectTags } from './authoring.ts';
import { task } from './practice.ts';

const [, , , , composition, protocols] = objectTags;

export const objectComponentsProblems = [
  task(81, composition, '入门', '两种计价策略', {
    background: '同一开单程序接收按件或固定价策略。', description: 'UNIT 每件 3 元，FLAT 有货时固定 8 元，空订单都是 0。',
    input: '首行 q，后 q 行为模式、非负件数。', output: '逐单输出整数费用。',
    limits: '0 ≤ q ≤ 200，件数 0–1000。',
  }, ['4\nUNIT 2\nFLAT 2\nFLAT 0\nUNIT 0\n', '6\n8\n0\n0\n', '同一种调用根据规则改变结果。'],
  [['0\n', ''], ['1\nFLAT 1000\n', '8\n'], ['2\nUNIT 7\nFLAT 1\n', '21\n8\n']],
  ['给两种策略共同的 cost(units) 接口。', '入口按模式选择实例，再只调用 cost。'], `class UnitRate:
    def cost(self, units):
        return units * 3

class FlatRate:
    def cost(self, units):
        return 8 if units else 0

rules = {"UNIT": UnitRate(), "FLAT": FlatRate()}
for _ in range(int(input())):
    mode, count = input().split()
    print(rules[mode].cost(int(count)))
`, { concepts: ['多态', '统一方法签名'], approach: '规则对象承担公式，入口统一调用。',
    steps: ['定义两种独立策略。', '按模式选择实际对象。', '调用并打印费用。'],
    time: 'O(q)。', space: 'O(1)。', pitfall: '把规则判断写进统一计算方法会使新增策略同时修改旧逻辑。',
    extension: '添加按区间计价的策略。' }),

  task(82, composition, '入门', '记录库存阈值到达事件', {
    background: '测试人员用记录器代替外部通知。', description: '库存初始为零，逐条增加。仅当某次增加前低于阈值，增加后达到或超过时，通知当前总量。',
    input: '首行正整数阈值，第二行为空或一组非负补货量。',
    output: '先输出通知次数，再输出每条通知的库存值，一行一条。末行输出 TOTAL 及总库存。',
    limits: '阈值为 1–1000，至多 300 项，单项 0–1000。',
  }, ['5\n2 0 4 3\n', '1\n6\nTOTAL 9\n', '达到阈值时实际总量为 6。'],
  [['3\n\n', '0\nTOTAL 0\n'], ['3\n1 2 0 4\n', '1\n3\nTOTAL 7\n'],
   ['3\n0 1 1\n', '0\nTOTAL 2\n']],
  ['把通知数据留在组件的列表中。', '库存服务只在跨越阈值时委托通知。'], `class Recorder:
    def __init__(self):
        self.events = []

    def send(self, total):
        self.events.append(total)

class Warehouse:
    def __init__(self, threshold, notifier):
        self.threshold = threshold
        self.total = 0
        self.notifier = notifier

    def receive(self, amount):
        before = self.total
        self.total += amount
        if before < self.threshold <= self.total:
            self.notifier.send(self.total)

events = Recorder()
stock = Warehouse(int(input()), events)
for amount in map(int, input().split()):
    stock.receive(amount)
print(len(events.events))
for total in events.events:
    print(total)
print("TOTAL", stock.total)
`, { concepts: ['组合', '记录替身', '跨越判断'], approach: '业务对象委托给 send，记录器保存测试证据。',
    steps: ['创建并注入记录器。', '对每步比较改动前后。', '分别展示通知和最终状态。'],
    time: 'O(n)。', space: 'O(n)，含拆分输入。', pitfall: '只检查最终值会在跨过阈值后反复通知。',
    extension: '允许退货，并测试库存再次跨越阈值时的行为。' }),

  task(83, composition, '基础', '按不同视图发布报表', {
    background: '相同展区数据有编码视图与优先视图。', description: 'CODE 按编号升序，输出 ID-编号。SCORE 按分数降序，并列保持输入次序，每行输出 编号:分数。',
    input: '首行 mode n，随后 n 行「编号 分数」。', output: '逐条按视图格式输出，空表无输出。',
    limits: '0 ≤ n ≤ 200，编号为互异的 1–8 位 ASCII 英数字，分数 0–1000。',
  }, ['SCORE 3\nZ 4\nA 4\nM 8\n', 'M:8\nZ:4\nA:4\n', '两项同分保持 Z 在 A 前。'],
  [['CODE 0\n', ''], ['CODE 2\nZ 8\nA 0\n', 'ID-A\nID-Z\n'],
   ['SCORE 2\nB 0\nA 0\n', 'B:0\nA:0\n']],
  ['让两种视图都提供 key 和 render。', '报表生成器接收视图，排序和展示使用它。'], `class CodeView:
    def key(self, row):
        return row[0]

    def render(self, row):
        return "ID-" + row[0]

class ScoreView:
    def key(self, row):
        return -row[1]

    def render(self, row):
        return f"{row[0]}:{row[1]}"

def publish(rows, view):
    for row in sorted(rows, key=view.key):
        print(view.render(row))

mode, n = input().split()
rows = []
for _ in range(int(n)):
    code, score = input().split()
    rows.append((code, int(score)))
publish(rows, CodeView() if mode == "CODE" else ScoreView())
`, { concepts: ['兼容接口', '方法作为回调', '稳定排序'], approach: '把变化的排序和格式集中在同一视图对象。',
    steps: ['保存原输入记录。', '选择视图并取得排序键。', '用相同视图格式化排序结果。'],
    time: '最坏 O(n log n)。', space: 'O(n)。', pitfall: '给 SCORE 的键加编号会破坏同分原序。',
    extension: '设计只保留达标行的第三个视图，明确筛选职责。' }),

  task(84, composition, '进阶', '切换独立投递通道', {
    background: '发报服务可切换到 A 或 B 通道，每个通道维护自己的限额与顺序。',
    description: '初始使用 A。USE 改用指定通道；SEND 如果该通道有空位就记录文本，否则拒绝。切换后仍保留原通道记录。',
    input: '首行 capA capB q，随后是 USE A 或 B，或 SEND 消息。',
    output: '每次 SEND 输出 OK 或 FULL。末两行依次输出 A、B 的消息，逗号连接，空写 NONE。',
    limits: '0 ≤ q ≤ 200，两容量 0–200。消息为 1–10 位英数字。',
  }, ['1 2 6\nSEND X\nSEND Y\nUSE B\nSEND Z\nUSE A\nSEND Q\n', 'OK\nFULL\nOK\nFULL\nX\nZ\n', '切回 A 后原有的 X 仍占槽位。'],
  [['0 0 0\n', 'NONE\nNONE\n'], ['0 1 3\nSEND A\nUSE B\nSEND A\n', 'FULL\nOK\nNONE\nA\n'],
   ['1 1 4\nUSE B\nSEND X\nUSE A\nSEND X\n', 'OK\nOK\nX\nX\n']],
  ['两个通道各自构造，服务保存当前通道的引用。', '切换只替换引用，不重建通道。'], `class Channel:
    def __init__(self, capacity):
        self.capacity = capacity
        self.messages = []

    def send(self, message):
        if len(self.messages) == self.capacity:
            return "FULL"
        self.messages.append(message)
        return "OK"

class Sender:
    def __init__(self, channel):
        self.channel = channel

    def send(self, message):
        return self.channel.send(message)

a, b, q = map(int, input().split())
channels = {"A": Channel(a), "B": Channel(b)}
sender = Sender(channels["A"])
for _ in range(q):
    action, value = input().split()
    if action == "USE":
        sender.channel = channels[value]
    else:
        print(sender.send(value))
for channel in channels.values():
    print(",".join(channel.messages) or "NONE")
`, { concepts: ['组件替换', '状态归属', '失败不改状态'], approach: '把各自限额与历史留给通道，服务只负责委托。',
    steps: ['创建两个通道与一个服务。', '按命令替换组件或发送。', '按原通道顺序核对其实际记录。'],
    time: 'O(q)。', space: 'O(q)。', pitfall: '切换时创建新通道会丢失旧限额使用情况。',
    extension: '添加失败后尝试另一个通道的策略，定义是否改变当前通道。' }),

  task(85, protocols, '入门', '访客视图与调试视图', {
    background: '终端需要同时支持简明票号和包含字段名的调试信息。', description: 'PRINT 显示 T-编号；DEBUG 显示 Ticket(code=单引号编号)。',
    input: '首行 q，后续为 PRINT 或 DEBUG 与编号。', output: '逐行显示要求的字符串。',
    limits: '0 ≤ q ≤ 150，编号为 1–10 位英数字。',
  }, ['2\nPRINT Z3\nDEBUG Z3\n', "T-Z3\nTicket(code='Z3')\n", '同一个实例类型提供两种表现。'],
  [['0\n', ''], ['1\nPRINT 007\n', 'T-007\n'], ['1\nDEBUG A\n', "Ticket(code='A')\n"]],
  ['用 __str__ 与 __repr__ 分别定义格式。', '调试信息可用 !r 表示字符串值。'], `class Ticket:
    def __init__(self, code):
        self.code = code

    def __str__(self):
        return "T-" + self.code

    def __repr__(self):
        return f"Ticket(code={self.code!r})"

for _ in range(int(input())):
    kind, code = input().split()
    ticket = Ticket(code)
    print(ticket if kind == "PRINT" else repr(ticket))
`, { concepts: ['__str__', '__repr__', '输出契约'], approach: '格式分别由两种表示方法返回。',
    steps: ['构造同型票据。', '按场景触发显示或调试形式。', '核对大小写和引号。'],
    time: 'O(q)。', space: 'O(1)。', pitfall: '特殊方法需要返回字符串，不能只打印。',
    extension: '加入数量字段，在两种表示中分别考虑是否展示。' }),

  task(86, protocols, '入门', '两个读取游标', {
    background: '两组人独立阅读同一份展品清单。', description: 'A、B 各有一个从头开始的游标。每个命令读取相应游标下一项；SIZE 查询项目总数。',
    input: '首行展品编号列表，可为空。第二行含零到多个命令 A、B、SIZE。',
    output: '各命令各一行，读完时写 NONE，SIZE 输出初始清单大小。',
    limits: '每行最多 150 项，编号是 1–8 位英数字。重复项保留。',
  }, ['K M\nA A B A SIZE B B\n', 'K\nM\nK\nNONE\n2\nM\nNONE\n', 'A 已读完时，B 的位置仍独立。'],
  [['\nA SIZE B\n', 'NONE\n0\nNONE\n'], ['X\n\n', ''], ['Z Z\nB A B A SIZE\n', 'Z\nZ\nZ\nZ\n2\n']],
  ['清单的 __iter__ 每次创建新游标。', '迭代器结束时抛 StopIteration，由 next 的默认值处理。'], `class Cursor:
    def __init__(self, values):
        self.values = values
        self.index = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.index == len(self.values):
            raise StopIteration
        value = self.values[self.index]
        self.index += 1
        return value

class ListView:
    def __init__(self, values):
        self.values = tuple(values)

    def __iter__(self):
        return Cursor(self.values)

    def __len__(self):
        return len(self.values)

view = ListView(input().split())
readers = {"A": iter(view), "B": iter(view)}
for action in input().split():
    print(len(view) if action == "SIZE" else next(readers[action], "NONE"))
`, { concepts: ['独立游标', '__next__', '__len__'], approach: '数据序列共享，读取位置分别保存。',
    steps: ['把输入制成可重复遍历的容器。', '各自创建读取游标。', '按命令查询大小或消耗一个位置。'],
    time: 'O(n+q)。', space: 'O(n+q)，含两行拆分。',
    pitfall: '让容器本身存唯一读取位置会令两个读者互相影响。',
    extension: '添加 RESET A 命令，只为 A 重新创建迭代器。' }),

  task(87, protocols, '基础', '工单等值与稳定排序', {
    background: '两份工单可能字段相同但属于不同实例。', description: '所有工单按优先级升序，等优先级保持录入次序。查询同时报告两份工单字段是否全相等、是否同一实例。',
    input: '首行 n q，后 n 行「编号 优先级」，再 q 行两个录入下标，从 0 开始。',
    output: '首行空格分隔的排序编号。每个查询一行两个 0 或 1，依次为值相等与身份相同。',
    limits: '1 ≤ n ≤ 200，0 ≤ q ≤ 200。优先级 0–1000，编号 1–8 位英数字，可重复。',
  }, ['3 3\nZ 2\nA 1\nZ 2\n0 2\n0 0\n1 2\n', 'A Z Z\n1 0\n1 1\n0 0\n', '首尾工单等值且身份不同。'],
  [['1 0\nQ 0\n', 'Q\n'], ['2 1\nB 0\nA 0\n0 1\n', 'B A\n0 0\n'],
   ['2 1\nA 2\nA 1\n0 1\n', 'A A\n0 0\n']],
  ['用 priority 实现小于，用两字段实现等值。', '在原输入列表按下标查询。'], `class Job:
    def __init__(self, code, priority):
        self.code = code
        self.priority = priority

    def __lt__(self, other):
        if not isinstance(other, Job):
            return NotImplemented
        return self.priority < other.priority

    def __eq__(self, other):
        if not isinstance(other, Job):
            return NotImplemented
        return (self.code, self.priority) == (other.code, other.priority)

n, q = map(int, input().split())
jobs = []
for _ in range(n):
    code, priority = input().split()
    jobs.append(Job(code, int(priority)))
print(" ".join(job.code for job in sorted(jobs)))
for _ in range(q):
    a, b = map(int, input().split())
    print(int(jobs[a] == jobs[b]), int(jobs[a] is jobs[b]))
`, { concepts: ['值相等', '身份', '稳定排序'], approach: '从排序和等值的业务定义分别建立方法。',
    steps: ['逐行构造独立对象。', '生成排序副本。', '用原下标查询两个独立布尔值。'],
    time: 'O(n log n+q)。', space: 'O(n)。', pitfall: '原地排序会让后续下标指向错误对象。',
    extension: '用同一字段元组定义一致的全序，讨论为何并列会改变。' }),

  task(88, protocols, '进阶', '批次标签的独立副本', {
    background: '批次可由另一份批次的当前标签创建草稿，之后各自编辑。', description: 'NEW 建空批次；TAG 追加标签；CLONE 创建同标签的新批次；ASK 查看当前标签。',
    input: '首行 q，随后为 NEW 编号、TAG 编号 标签、CLONE 新编号 旧编号或 ASK 编号。',
    output: '仅对 ASK 输出标签，逗号分隔，空为 NONE。',
    limits: '0 ≤ q ≤ 100，编号与标签为 1–8 位英数字。输入只访问已创建项，NEW 和 CLONE 的新编号未注册。',
  }, ['8\nNEW A\nNEW B\nTAG A X\nCLONE C A\nTAG C Y\nASK A\nASK B\nASK C\n', 'X\nNONE\nX,Y\n', '默认空列表与复制得到的列表均独立。'],
  [['0\n', ''], ['4\nNEW A\nCLONE B A\nTAG A X\nASK B\n', 'NONE\n'],
   ['5\nNEW X\nTAG X R\nTAG X R\nCLONE Y X\nASK Y\n', 'R,R\n']],
  ['默认可变字段用 default_factory。', '复制已有批次时取它标签的浅副本。'], `from dataclasses import dataclass, field

@dataclass
class Batch:
    code: str
    tags: list[str] = field(default_factory=list)

batches = {}
for _ in range(int(input())):
    action, code, *value = input().split()
    if action == "NEW":
        batches[code] = Batch(code)
    elif action == "TAG":
        batches[code].tags.append(value[0])
    elif action == "CLONE":
        batches[code] = Batch(code, batches[value[0]].tags.copy())
    else:
        print(",".join(batches[code].tags) or "NONE")
`, { concepts: ['数据类', '默认工厂', '复制与引用'], approach: '两条创建路径都分配自己的列表，复制保留顺序和重复。',
    steps: ['用数据类表示字段。', '构造时走工厂或显式复制。', '打印各批次真实状态。'],
    time: 'O(q+s)，s 为复制和输出的条目数。', space: 'O(q+c)，c 为复制保存的总条目。',
    pitfall: 'CLONE 传旧列表本身会共享后续修改。',
    extension: '为包含可变元数据的标签设计清晰的深拷贝规则。' }),
];
