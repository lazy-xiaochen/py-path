import { objectTags } from './authoring.ts';
import { task } from './practice.ts';

const [objects, attributes] = objectTags;

export const objectBasicsProblems = [
  task(65, objects, '入门', '工作台领用余额', {
    background: '一台工作台记录可发剩余件数。', description: '按顺序处理领用申请，申请不超过剩余量才扣减。',
    input: '首行初始余额。第二行是空格分隔的领用件数，可为空。',
    output: '每笔输出 OK 或 NO，再输出操作后的余额。同一行以空格分开。',
    limits: '至多 100 笔，数值 0–1000。零申请合法。',
  }, ['3\n4 3 0\n', 'NO 3\nOK 0\nOK 0\n', '第一次被拒，余额保留给下一笔。'],
  [['0\n1 0\n', 'NO 0\nOK 0\n'], ['7\n\n', ''], ['8\n3 2 4\n', 'OK 5\nOK 3\nNO 3\n']],
  ['把余额存在实例里。', '检查失败后提前返回。'], `class Desk:
    def __init__(self, remaining):
        self.remaining = remaining

    def take(self, amount):
        if amount > self.remaining:
            return False
        self.remaining -= amount
        return True

desk = Desk(int(input()))
for count in map(int, input().split()):
    print("OK" if desk.take(count) else "NO", desk.remaining)
`, { concepts: ['实例状态', '方法返回值', '失败保留状态'], approach: '只由实例扣减，入口根据返回值打印。',
    steps: ['构造时写入余额。', '检查后扣减或返回失败。', '按行查询操作后的值。'],
    time: 'O(n)。', space: 'O(n)，含单行输入拆分。', pitfall: '零余量仍可领用零件数。',
    extension: '加入补货方法，观察余额上限。' }),

  task(66, objects, '入门', '双仪表校准', {
    background: '两台仪表独立保存校准值。', description: '每次给指定仪表加一个增量。若新值不在 0–100 内，拒绝并保留原值。',
    input: '首行 A 初值、B 初值、q。随后 q 行给 A 或 B 和增量。',
    output: '每笔输出 OK 或 NO，后接该仪表最终值。末行输出 A、B 的当前值。',
    limits: '0 ≤ q ≤ 200，初值 0–100，增量 -100–100。',
  }, ['0 90 3\nA -1\nB 10\nA 5\n', 'NO 0\nOK 100\nOK 5\n5 100\n', '两台改动相互独立。'],
  [['2 3 0\n', '2 3\n'], ['99 1 2\nA 2\nB -1\n', 'NO 99\nOK 0\n99 0\n'], ['10 10 2\nA 0\nB -11\n', 'OK 10\nNO 10\n10 10\n']],
  ['分别调用两次构造。', '增量先用于计算候选值，再决定是否写入。'], `class Meter:
    def __init__(self, value):
        self.value = value

    def adjust(self, delta):
        candidate = self.value + delta
        if not 0 <= candidate <= 100:
            return "NO"
        self.value = candidate
        return "OK"

a, b, q = map(int, input().split())
meters = {"A": Meter(a), "B": Meter(b)}
for _ in range(q):
    code, delta = input().split()
    meter = meters[code]
    print(meter.adjust(int(delta)), meter.value)
print(meters["A"].value, meters["B"].value)
`, { concepts: ['两个实例', '状态隔离', '范围判断'], approach: '共用方法代码，各自持有赋值目标。',
    steps: ['分别构造两台。', '按编号定位本次目标。', '先判断候选值，再核对最终两份状态。'],
    time: 'O(q)。', space: 'O(1)。', pitfall: '两个键绑定到同一实例会让状态串到另一台。',
    extension: '加入用别名访问同一仪表的命令，并说明预期。' }),

  task(67, objects, '基础', '工位计时指令', {
    background: '工位可登记、累加时长和查询。', description: 'NEW 建立新工位并给初值，已有则拒绝。ADD 增加时长，GET 读取时长。两种读取命令找不到工位都报错。',
    input: '首行 q。后续每行 NEW 编号 初值、ADD 编号 增量或 GET 编号。',
    output: 'NEW 输出 OK 或 DUP，ADD 与 GET 输出当前值，找不到输出 NA。',
    limits: '0 ≤ q ≤ 400，编号为 1–10 位英数字，初值与增量 0–1000。',
  }, ['6\nGET A\nNEW A 3\nNEW A 8\nADD A 1\nNEW B 5\nGET B\n', 'NA\nOK\nDUP\n4\nOK\n5\n', '重复登记不覆盖原工位。'],
  [['0\n', ''], ['2\nADD B 2\nGET B\n', 'NA\nNA\n'], ['4\nNEW A 0\nADD A 0\nNEW B 0\nGET A\n', 'OK\n0\nOK\n0\n']],
  ['索引用字典，每项存一个计时对象。', '重复和缺失先判断，再调用方法。'], `class Timer:
    def __init__(self, minutes):
        self.minutes = minutes

    def add(self, delta):
        self.minutes += delta
        return self.minutes

timers = {}
for _ in range(int(input())):
    command, code, *extra = input().split()
    if command == "NEW":
        if code in timers:
            print("DUP")
        else:
            timers[code] = Timer(int(extra[0]))
            print("OK")
    elif code not in timers:
        print("NA")
    elif command == "ADD":
        print(timers[code].add(int(extra[0])))
    else:
        print(timers[code].minutes)
`, { concepts: ['字典索引', '实例方法', '对象生命周期'], approach: '明确创建和更新的权限，索引负责对象的区分。',
    steps: ['解析命令和编号。', '仅对新编号创建记录。', '按对象查询或累计。'],
    time: '平均 O(q)。', space: 'O(s)，s 为工位数量。', pitfall: '查询不存在项不应自动分配计时器。',
    extension: '增加停用工位但保留历史的业务规则。' }),

  task(68, objects, '进阶', '展厅导航轨迹', {
    background: '导览终端可以在一条访问轨迹中后退、前进，也能从当前位置开启新的路线。',
    description: 'VISIT 切换到新展厅并丢掉当前位置之后的轨迹。BACK 和 FORWARD 移动光标，到边界时停止。',
    input: '首行初始展厅和 q。后 q 行分别为 VISIT 展厅、BACK 步数或 FORWARD 步数。',
    output: '每条命令后输出当前展厅。',
    limits: '0 ≤ q ≤ 400，名称 1–10 位英数字，步数 0–1000，允许再次访问同名展厅。',
  }, ['H 6\nVISIT A\nVISIT B\nBACK 1\nVISIT C\nFORWARD 5\nBACK 9\n', 'A\nB\nA\nC\nC\nH\n', '访问 C 后，A 之后原有的 B 被删去。'],
  [['A 0\n', ''], ['A 3\nBACK 2\nFORWARD 3\nVISIT A\n', 'A\nA\nA\n'],
   ['X 5\nVISIT Y\nBACK 1\nFORWARD 0\nFORWARD 1\nFORWARD 1\n', 'Y\nX\nX\nY\nY\n']],
  ['保存一份轨迹和一个当前位置。', '新增前删除当前位置之后的数据。'], `class Tour:
    def __init__(self, home):
        self.stops = [home]
        self.index = 0

    def visit(self, room):
        del self.stops[self.index + 1:]
        self.stops.append(room)
        self.index += 1

    def move(self, delta):
        self.index = max(0, min(self.index + delta, len(self.stops) - 1))

home, q = input().split()
tour = Tour(home)
for _ in range(int(q)):
    action, value = input().split()
    if action == "VISIT":
        tour.visit(value)
    else:
        tour.move(int(value) if action == "FORWARD" else -int(value))
    print(tour.stops[tour.index])
`, { concepts: ['对象状态', '光标', '轨迹重写'], approach: '能够共同影响轨迹的两个字段留在同一实例。',
    steps: ['初始化首页光标。', '前后移动时只更新索引。', '访问时截断旧未来再追加。'],
    time: '总计 O(q)，每条已追加位置至多被删除一次。', space: 'O(q)。',
    pitfall: '退回旧位置后新访不会保留之前的未来轨迹。', extension: '创建两条导览路线并交替操作验证状态不串。' },
  { kind: 'adapted', platform: 'LeetCode', title: 'Design Browser History', id: '1472', level: 'Medium',
    url: 'https://leetcode.com/problems/design-browser-history/', concepts: ['对象状态', '光标与前进历史'],
    adaptation: '用展厅和标准输入的命令流表达轨迹，为每条命令输出当前展厅，加入零步数与同名展厅。' }),

  task(69, attributes, '入门', '共享费率与柜台特例', {
    background: '多个柜台共用费率，部分柜台可设本地覆盖。', description: 'CLASS 修改共享费率，LOCAL 为 A 设特例，CLEAR 移除 A 的特例，ASK 查询两台各自读取的值。',
    input: '首行「初始费率 q」，其后 q 行是 CLASS 数值、LOCAL 数值、CLEAR 或 ASK。',
    output: '每次 ASK 输出 A 和 B 当前费率。',
    limits: '0 ≤ q ≤ 200，所有费率为 0–1000。CLEAR 未设特例时无变化。',
  }, ['2 6\nASK\nLOCAL 0\nCLASS 4\nASK\nCLEAR\nASK\n', '2 2\n0 4\n4 4\n', '覆盖值为零仍有效，清除才恢复共享。'],
  [['3 0\n', ''], ['4 2\nCLEAR\nASK\n', '4 4\n'], ['1 4\nLOCAL 5\nCLASS 0\nASK\nASK\n', '5 0\n5 0\n']],
  ['把共享费率放在类上。', '特例独立赋给 A，清除时只删除实例项。'], `class Desk:
    rate = 0

initial, q = map(int, input().split())
Desk.rate = initial
a, b = Desk(), Desk()
for _ in range(q):
    action, *value = input().split()
    if action == "CLASS":
        Desk.rate = int(value[0])
    elif action == "LOCAL":
        a.rate = int(value[0])
    elif action == "CLEAR":
        a.__dict__.pop("rate", None)
    else:
        print(a.rate, b.rate)
`, { concepts: ['类属性', '实例遮蔽', '删除实例项'], approach: '依靠普通属性查找表达本地特例与共享默认。',
    steps: ['给类绑定初值。', '分别在类或 A 上写入。', '清除本地键后查询。'],
    time: 'O(q)。', space: 'O(1)。', pitfall: '给 A 写回当前类值会继续遮蔽将来的配置。',
    extension: '允许 B 也设置和清除覆盖，验证两实例相互独立。' }),

  task(70, attributes, '入门', '从标签构造仪表', {
    background: '批量导入用一行文本描述每台仪表。', description: '有效行形如 编号:读数，按冒号拆为恰好两项，编号为 ASCII 英数字，读数为 ASCII 数字并转为整数。',
    input: '首行 q，后续 q 行是待解析文本。',
    output: '合法时输出「大写编号 整数值」，否则报 INVALID。',
    limits: '0 ≤ q ≤ 200，行不超过 40 字符，合法读数 1–4 位数字；编号长度 1–8，不允许内外空格。',
  }, ['4\nab2:0003\nE:0\nA-B:2\nC:５\n', 'AB2 3\nE 0\nINVALID\nINVALID\n', '读数去掉前导零，全角数字拒绝。'],
  [['0\n', ''], ['2\nA:2:3\n:3\n', 'INVALID\nINVALID\n'], ['3\nA:9999\nB:10000\n C:1\n', 'A 9999\nINVALID\nINVALID\n']],
  ['静态校验只接收显式字段。', '让类工厂用 cls(...) 构造对象。'], `class Meter:
    def __init__(self, code, value):
        self.code = code
        self.value = value

    @staticmethod
    def valid(code, text):
        return (1 <= len(code) <= 8 and code.isascii() and code.isalnum()
                and 1 <= len(text) <= 4 and text.isascii() and text.isdecimal())

    @classmethod
    def parse(cls, line):
        code, text = line.split(":")
        if not cls.valid(code, text):
            raise ValueError("无效字段")
        return cls(code.upper(), int(text))

for _ in range(int(input())):
    try:
        meter = Meter.parse(input())
        print(meter.code, meter.value)
    except ValueError:
        print("INVALID")
`, { concepts: ['类工厂', '静态校验', '异常'], approach: '解析入口决定合法性，构造方法保存已解析数据。',
    steps: ['按冒号拆成两项。', '检查长度、字符和数字。', '用 cls 返回构造结果。'],
    time: 'O(s)，s 为所有行长度。', space: 'O(m)，m 为最长行。',
    pitfall: '单用 isdecimal 会接受部分非 ASCII 数字。', extension: '让某一子类允许新的编码前缀。' }),

  task(71, attributes, '基础', '共用票据工厂', {
    background: '普通票和加急票共享扫码格式。', description: '把扫码结果的字母统一成大写，普通票显示 N-编号，加急票显示 F-编号。',
    input: '首行 q，后 q 行给 NORMAL 或 FAST 及编号。',
    output: '逐行输出票据标签。',
    limits: '0 ≤ q ≤ 200，编号为 1–10 位英数字。前导零保留。',
  }, ['3\nNORMAL a3\nFAST a3\nFAST 07\n', 'N-A3\nF-A3\nF-07\n', '同一编码由实际选中的票类生成。'],
  [['0\n', ''], ['1\nNORMAL Z\n', 'N-Z\n'], ['2\nFAST b\nNORMAL b\n', 'F-B\nN-B\n']],
  ['在基类写一份 from_scan。', '构造用 cls，展示读取实际对象的前缀。'], `class Ticket:
    prefix = "N"

    def __init__(self, code):
        self.code = code

    @classmethod
    def from_scan(cls, code):
        return cls(code.upper())

    def label(self):
        return self.prefix + "-" + self.code

class FastTicket(Ticket):
    prefix = "F"

kinds = {"NORMAL": Ticket, "FAST": FastTicket}
for _ in range(int(input())):
    kind, code = input().split()
    print(kinds[kind].from_scan(code).label())
`, { concepts: ['类工厂', 'cls', '类属性'], approach: '选择类后共用解析过程，各自保存票号与前缀。',
    steps: ['按类型选实际类。', '从扫码文本构造实例。', '以实例和其类型的数据展示。'],
    time: 'O(s)，s 为输入总长度。', space: 'O(1)，每个编号宽度有限。',
    pitfall: '工厂直接调用 Ticket 会丢失加急类型。', extension: '加急票验证编号前缀并报告错误。' }),

  task(72, attributes, '进阶', '柜台历史与总登记数', {
    background: 'A、B 分别保留登记历史，全场还要知道两台登记次数之和。',
    description: 'ADD 记录标签，RESET 仅清掉指定台的本地历史。Q 展示该台的当前历史条数和最近标签，再显示全场累计 ADD 数。',
    input: '首行 q，之后各行为 ADD 台号 标签、RESET 台号或 Q 台号，台号为 A 或 B。',
    output: '仅对 Q 输出「本地条数 最近标签 全场累计」。历史为空时最近标签写 -。',
    limits: '0 ≤ q ≤ 300，标签 1–8 位英数字。重复标签逐条记录。',
  }, ['7\nADD A X\nADD B Y\nADD A X\nQ A\nRESET A\nQ A\nQ B\n', '2 X 3\n0 - 3\n1 Y 3\n', '重置只影响 A 当前历史。'],
  [['0\n', ''], ['2\nQ A\nQ B\n', '0 - 0\n0 - 0\n'], ['3\nADD A Z\nRESET B\nQ A\n', '1 Z 1\n']],
  ['累计用类字段，本地历史在实例初始化。', '清本地历史时保持类计数。'], `class Desk:
    recorded = 0

    def __init__(self):
        self.history = []

    def add(self, label):
        self.history.append(label)
        Desk.recorded += 1

    def summary(self):
        return len(self.history), self.history[-1] if self.history else "-", Desk.recorded

desks = {"A": Desk(), "B": Desk()}
for _ in range(int(input())):
    action, code, *label = input().split()
    desk = desks[code]
    if action == "ADD":
        desk.add(label[0])
    elif action == "RESET":
        desk.history.clear()
    else:
        print(*desk.summary())
`, { concepts: ['类计数', '独立实例列表', '查询契约'], approach: '全场累计和本地历史分别由适当的对象持有。',
    steps: ['构造两个柜台。', '登记时更新两类指标。', '重置与查询只读取所需状态。'],
    time: 'O(q)，含清除条目，单条记录至多清一次。', space: 'O(q)。',
    pitfall: 'self.recorded += 1 会写出一个实例同名值。', extension: '增加全场统计重置，但保留两台现有历史。' }),
];
