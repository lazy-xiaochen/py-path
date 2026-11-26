import { objectTags } from './authoring.ts';
import { task } from './practice.ts';

const [, , encapsulation, inheritance] = objectTags;

export const objectRulesProblems = [
  task(73, encapsulation, '入门', '受校验的仓位数量', {
    background: '登记员可更正仓位数量。', description: '数量在 0 到容量之间才可写入。否则保持原值。',
    input: '首行容量和实际初值。第二行是尝试设置的整数序列，可为空。',
    output: '每次输出 OK 或 NO 及实际数量。',
    limits: '容量 0–1000，初值合法；至多 150 次写入，候选范围 -1000–2000。',
  }, ['5 2\n-1 5 6 0\n', 'NO 2\nOK 5\nNO 5\nOK 0\n', '两个端点都允许。'],
  [['0 0\n1 0 -1\n', 'NO 0\nOK 0\nNO 0\n'], ['1 1\n\n', ''], ['4 1\n4 4 2\n', 'OK 4\nOK 4\nOK 2\n']],
  ['构造和设置共享同一个 setter。', '候选合法后再保存到内部属性。'], `class Stock:
    def __init__(self, capacity, count):
        self._capacity = capacity
        self.count = count

    @property
    def count(self):
        return self._count

    @count.setter
    def count(self, count):
        if not 0 <= count <= self._capacity:
            raise ValueError("超出范围")
        self._count = count

stock = Stock(*map(int, input().split()))
for count in map(int, input().split()):
    try:
        stock.count = count
        print("OK", stock.count)
    except ValueError:
        print("NO", stock.count)
`, { concepts: ['property', '统一校验', '失败前验证'],
    approach: '赋值均通过 setter，主循环只处理显示。',
    steps: ['保存容量。', '在 setter 校验候选。', '在主循环输出实际值和结果。'],
    time: 'O(n)。', space: 'O(n)，含行拆分。', pitfall: 'setter 内给公开名赋值会再次触发 setter。',
    extension: '加入可调容量，并拒绝将容量减到当前值以下。' }),

  task(74, encapsulation, '入门', '用只读属性查看空位', {
    background: '仓位剩余由容量减去已使用量得到。', description: 'ADD 占用席位、FREE 释放席位。超容量或试图释放超过已占用量时拒绝。ASK 查询剩余。',
    input: '首行「容量 q」。后 q 行为 ADD 数值、FREE 数值或 ASK。',
    output: '每条命令都输出当前剩余。ADD、FREE 另在同一行前缀输出 OK 或 NO。',
    limits: '0 ≤ q ≤ 100，初始未占用；容量和数量均为 0–1000。',
  }, ['4 5\nADD 3\nFREE 4\nASK\nFREE 2\nADD 4\n', 'OK 1\nNO 1\n1\nOK 3\nNO 3\n', '释放失败不增加可用量。'],
  [['4 0\n', ''], ['0 3\nADD 0\nFREE 1\nASK\n', 'OK 0\nNO 0\n0\n'],
   ['3 2\nADD 3\nFREE 3\n', 'OK 0\nOK 3\n']],
  ['保存容量与使用量。', 'available 每次计算，写操作统一验证新使用量。'], `class Room:
    def __init__(self, capacity):
        self._capacity = capacity
        self._used = 0

    @property
    def available(self):
        return self._capacity - self._used

    def change(self, delta):
        final = self._used + delta
        if not 0 <= final <= self._capacity:
            return "NO"
        self._used = final
        return "OK"

capacity, q = map(int, input().split())
room = Room(capacity)
for _ in range(q):
    action, *count = input().split()
    if action == "ASK":
        print(room.available)
    else:
        delta = int(count[0]) * (1 if action == "ADD" else -1)
        print(room.change(delta), room.available)
`, { concepts: ['派生属性', '范围约束'], approach: '从同一份真实状态计算剩余，避免同步多份数据。',
    steps: ['构造空仓位。', '占用和释放转换为带符号变更。', '报告由属性计算的剩余。'],
    time: 'O(q)。', space: 'O(1)。', pitfall: '重复保存可用量可能在失败后不同步。',
    extension: '另公开占用率，处理容量为零的情况。' }),

  task(75, encapsulation, '基础', '保留历史快照', {
    background: '审核者需要对照提交时的标签清单，即使之后还会调整。', description: 'ADD 追加，CLEAR 清空，SNAP 保存当时清单。最后一次性输出所有快照及当前清单。',
    input: '首行 q，随后为 ADD 标签、CLEAR 或 SNAP。',
    output: '每个快照一行，最后输出当前清单一行。列表用逗号连接，空写 NONE。',
    limits: '0 ≤ q ≤ 100，标签 1–8 位英数字，重复标签保留。',
  }, ['7\nSNAP\nADD A\nSNAP\nADD B\nSNAP\nCLEAR\nADD C\n', 'NONE\nA\nA,B\nC\n', '早期保存的快照不随 CLEAR 变动。'],
  [['0\n', 'NONE\n'], ['3\nADD Z\nSNAP\nCLEAR\n', 'Z\nNONE\n'], ['3\nADD X\nADD X\nSNAP\n', 'X,X\nX,X\n']],
  ['快照需要自己的容器。', '在所有操作结束才打印观察是否被后续修改。'], `class Shelf:
    def __init__(self):
        self._labels = []

    def add(self, label):
        self._labels.append(label)

    def clear(self):
        self._labels.clear()

    @property
    def snapshot(self):
        return tuple(self._labels)

shelf = Shelf()
saved = []
for _ in range(int(input())):
    action, *labels = input().split()
    if action == "ADD":
        shelf.add(labels[0])
    elif action == "CLEAR":
        shelf.clear()
    else:
        saved.append(shelf.snapshot)
saved.append(shelf.snapshot)
for row in saved:
    print(",".join(row) or "NONE")
`, { concepts: ['对外快照', '不可变接口', '状态变更'], approach: '把当前可写容器留在对象内，快照仅记录当时的字符串。',
    steps: ['修改通过公开方法。', '在 SNAP 时复制字段。', '最后按保存次序展示。'],
    time: 'O(q+s)，s 为快照及当前输出的条目总数。', space: 'O(q+s)。',
    pitfall: '保存内部列表引用会让过去的记录被改写。', extension: '若标签换成字典，决定哪些字段也要复制。' }),

  task(76, encapsulation, '进阶', '跨柜台完整转移', {
    background: '领物台之间调货，必须同时满足源台有货、目标台有空位。',
    description: '每次将件数由指定来源转给另一台。两条件均满足才更新。失败时保留两台原值。',
    input: '首行 capA countA capB countB q。每条命令给来源 A 或 B 和件数。',
    output: '每次输出 OK 或 NO，后接两台的当前件数。',
    limits: '0 ≤ q ≤ 300，容量和件数 0–1000，初值不超过各自容量，零件转移允许。',
  }, ['5 4 4 2 4\nA 3\nA 2\nB 4\nB 3\n', 'NO 4 2\nOK 2 4\nNO 2 4\nOK 5 1\n', '第三次失败时，两台仍有 2 和 4。'],
  [['1 1 1 0 0\n', ''], ['0 0 0 0 2\nA 0\nB 1\n', 'OK 0 0\nNO 0 0\n'],
   ['9 0 2 1 2\nB 2\nB 1\n', 'NO 0 1\nOK 1 0\n']],
  ['读取两台的当前状态，先把两条条件都判断完。', '通过后再写两个位置。'], `class Desk:
    def __init__(self, capacity, count):
        self._capacity = capacity
        self._count = count

    @property
    def count(self):
        return self._count

    def transfer(self, target, count):
        if count > self._count or target._count + count > target._capacity:
            return "NO"
        self._count -= count
        target._count += count
        return "OK"

cap_a, a, cap_b, b, q = map(int, input().split())
desks = {"A": Desk(cap_a, a), "B": Desk(cap_b, b)}
for _ in range(q):
    source, count = input().split()
    target = "B" if source == "A" else "A"
    print(desks[source].transfer(desks[target], int(count)), desks["A"].count, desks["B"].count)
`, { concepts: ['对象协作', '状态约束', '全量验证'], approach: '转移职责由来源对象承担，失败分支不会写任一对象。',
    steps: ['找出两个参与对象。', '验证供货及空位。', '在成功分支同时调整两个余额。'],
    time: 'O(q)。', space: 'O(1)。', pitfall: '目标失败前先扣来源会损失数量。',
    extension: '记录每次成功后库存和是否仍等于最初总量。' }),

  task(77, inheritance, '入门', '工牌的基础与附加字段', {
    background: '普通与主管工牌使用相同的编号字段。', description: '普通工牌显示编号，主管工牌还要追加区域。',
    input: '首行 q。后 q 行为 BASE 编号 或 LEAD 编号 区域。',
    output: 'BASE 输出编号，LEAD 输出「编号@区域」。',
    limits: '0 ≤ q ≤ 300，编号、区域为 1–8 位英数字。',
  }, ['2\nBASE X\nLEAD Y N\n', 'X\nY@N\n', '主管工牌通过基类建立共享字段。'],
  [['0\n', ''], ['1\nLEAD 0 E\n', '0@E\n'], ['2\nLEAD X W\nBASE X\n', 'X@W\nX\n']],
  ['把 code 的初始化交给基类。', '子类在 super().__init__ 之后添加 zone。'], `class Card:
    def __init__(self, code):
        self.code = code

    def label(self):
        return self.code

class Lead(Card):
    def __init__(self, code, zone):
        super().__init__(code)
        self.zone = zone

    def label(self):
        return f"{self.code}@{self.zone}"

for _ in range(int(input())):
    kind, *fields = input().split()
    card = Card(*fields) if kind == "BASE" else Lead(*fields)
    print(card.label())
`, { concepts: ['基类初始化', '实例属性', '方法重写'], approach: '共享字段只初始化一次，子类保存附加字段。',
    steps: ['解析类型和字段。', '根据需要构造基类或子类。', '用统一方法输出。'],
    time: 'O(q)。', space: 'O(1)。', pitfall: '子类漏掉初始化基类会缺 code。',
    extension: '验证两个对象相同编号、不同区域时的显示。' }),

  task(78, inheritance, '入门', '加急运费增量', {
    background: '基础运费是重量的两倍，非空加急单另外加 3。',
    description: '处理普通和加急订单。两种订单重量为 0 时都收 0。',
    input: '首行 q，随后各行为 N 或 E 和整数重量。',
    output: '每条输出整数运费。',
    limits: '0 ≤ q ≤ 200，重量 0–1000。',
  }, ['4\nN 2\nE 2\nE 0\nN 0\n', '4\n7\n0\n0\n', '空加急单免附加费。'],
  [['0\n', ''], ['1\nE 1000\n', '2003\n'], ['2\nN 1\nE 1\n', '2\n5\n']],
  ['让基类完成共同计费。', '子类调用 super 得到基础费用后再处理附加项。'], `class Shipment:
    def fee(self, weight):
        return weight * 2

class Express(Shipment):
    def fee(self, weight):
        return super().fee(weight) + (3 if weight else 0)

schemes = {"N": Shipment(), "E": Express()}
for _ in range(int(input())):
    kind, weight = input().split()
    print(schemes[kind].fee(int(weight)))
`, { concepts: ['重写', '复用计算', '零值分支'], approach: '基类承担基础公式，子类只描述差额。',
    steps: ['配置两种对象。', '重写时调用 super。', '验证零重量与正重量。'],
    time: 'O(q)。', space: 'O(1)。', pitfall: '重复实现基础公式容易在价格变动时分叉。',
    extension: '把附加费设为可配置的实例字段。' }),

  task(79, inheritance, '基础', '三级通行证有效期', {
    background: '三种通行证从共同起始日构造。', description: 'B 有效 1 日，W 继承基础并额外加 6 日，P 在 W 之上再加 3 日。到期日为起始日加有效期。',
    input: '首行 q，后 q 行为类型 B、W 或 P、编号和起始日。',
    output: '每条输出「编号 到期日」。',
    limits: '0 ≤ q ≤ 200，编号 1–8 位英数字，起始日在 0–10000。',
  }, ['3\nB A 1\nW A 1\nP A 1\n', 'A 2\nA 8\nA 11\n', 'P 同时含基础与周票层的增量。'],
  [['0\n', ''], ['1\nP X 0\n', 'X 10\n'], ['2\nW 07 0\nB 07 9\n', '07 7\n07 10\n']],
  ['先把编号与日期存在共同基类。', '每个重写的 duration 只加自己的值。'], `class Pass:
    def __init__(self, code, start):
        self.code = code
        self.start = start

    def duration(self):
        return 1

    def expires(self):
        return self.start + self.duration()

class Weekly(Pass):
    def duration(self):
        return super().duration() + 6

class Plus(Weekly):
    def duration(self):
        return super().duration() + 3

kinds = {"B": Pass, "W": Weekly, "P": Plus}
for _ in range(int(input())):
    kind, code, start = input().split()
    ticket = kinds[kind](code, int(start))
    print(ticket.code, ticket.expires())
`, { concepts: ['多层继承', '继承构造', '动态查找'], approach: '保留共同 expires，依据实际对象分派 duration。',
    steps: ['统一构造公共属性。', '各层只追加自己的天数。', '用继承方法计算到期日。'],
    time: 'O(q)。', space: 'O(1)。', pitfall: 'Plus 显式调 Pass.duration 会漏掉中间层。',
    extension: '加入可配置的起始日验证，检查子类仍执行。' }),

  task(80, inheritance, '进阶', '协作层的报价顺序', {
    background: '两个报价层可以按不同顺序组合，基础层只返回输入金额。',
    description: 'A 将下一层返回值乘二，B 将下一层返回值加三。AB 表示 A 先进入、B 后进入；BA 反过来。共同基础层只运行一次。',
    input: '首行 q。随后 q 行各给 AB 或 BA 和整数金额。',
    output: '每条输出最后的整数报价。',
    limits: '0 ≤ q ≤ 200，金额 0–1000。',
  }, ['3\nAB 2\nBA 2\nAB 0\n', '10\n7\n6\n', 'AB 中 B 先得到基础值再加三，外层 A 乘二。'],
  [['0\n', ''], ['1\nBA 0\n', '3\n'], ['2\nAB 1000\nBA 1000\n', '2006\n2003\n']],
  ['写两个分别调用 super().quote 的协作层。', '两个组合类应使用不同的基类次序。'], `class Base:
    def quote(self, amount):
        return amount

class Double(Base):
    def quote(self, amount):
        return 2 * super().quote(amount)

class Add(Base):
    def quote(self, amount):
        return 3 + super().quote(amount)

class AB(Double, Add):
    pass

class BA(Add, Double):
    pass

rules = {"AB": AB(), "BA": BA()}
for _ in range(int(input())):
    mode, amount = input().split()
    print(rules[mode].quote(int(amount)))
`, { concepts: ['MRO', '协作 super', '进入和返回顺序'], approach: '用两种实际类型展示同样规则的不同线性顺序。',
    steps: ['分别实现基础、乘法和加法。', '以类的基类顺序选择进入顺序。', '核对合成在返回时执行。'],
    time: 'O(q)。', space: 'O(1)。', pitfall: '调用 Base.quote 会跳过另一协作层。',
    extension: '打印每种组合的 MRO，验证基础层只出现一次。' }),
];
