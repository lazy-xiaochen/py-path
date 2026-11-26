import type { Chapter } from '../../teaching-types';
import { coding, example as ex, question as q, reference } from './authoring.ts';

export const objectBasics: Chapter = {
  introduction: '库房有两个箱子，各自记录容量与已装件数。过程式程序可以把两份字典和函数配合起来；当操作越来越多，用类可以把每个箱子的数据与装箱规则集中在一起。',
  prerequisites: '字典、函数、形参绑定和对象引用。',
  version: 'Python 3.12。',
  goals: ['从需求分清对象的身份、属性和行为。', '写出 class、__init__ 和实例方法，说明 self 在调用时如何获得。', '用两个实例和一个别名测试各自的状态。'],
  topics: [
    {
      title: '从一份记录到带行为的实例',
      explanation: [
        '属性是通过对象名称与点号读写的数据，例如 box.used。行为是对象提供的操作，例如 box.put(2)。类定义共同的行为和每份实例如何初始化；调用类会创建实例，并通常由 __init__ 初始化新实例的属性。__init__ 不能返回一个自定义对象，通常省略 return。',
        '同一类的多个实例通过相同的方法逻辑处理各自的数据。设计类时先问状态属于谁、哪些操作允许改变它，再确定属性和方法。仅有一次处理的简单记录仍可用函数与字典，类适合需要反复维护状态、明确接口的情境。',
      ],
      examples: [
        ex('box-function-to-class', '从库房过程式记录迁移到类', '起步', `def put(record, count):
    if record["used"] + count <= record["capacity"]:
        record["used"] += count

class Box:
    def __init__(self, capacity):
        self.capacity = capacity
        self.used = 0

    def put(self, count):
        if self.used + count <= self.capacity:
            self.used += count

old = {"capacity": 3, "used": 0}
box = Box(3)
put(old, 2)
box.put(2)
box.put(2)
print(old["used"], box.used)
`, '2 2\n', '比较同一条容量规则在两种组织方式中的位置。',
        ['两种程序都把容量与已装件数放在同一份状态里。', '旧函数显式接收字典，实例方法收到 box 后读取其属性。', '第二次调用因超容量保留原值。'],
        '把 used 当作方法局部变量会让下一次调用无法找到先前状态。'),
        ex('box-bound-self', '验证实例方法的 self 来自哪一份箱子', '起步', `class Counter:
    def __init__(self, initial):
        self.value = initial

    def add(self, amount):
        self.value += amount
        return self.value

east = Counter(4)
west = Counter(10)
operation = east.add
print(operation(2))
print(Counter.add(west, 1))
print(east.value, west.value)
`, '6\n11\n6 11\n', '把绑定方法与显式传入实例放在同一例子。',
        ['读取 east.add 得到已绑定 east 的方法。', '从类取得 Counter.add 时可显式提供 west 作为首个实参。', '两个调用分别修改自己的实例属性。'],
        '方法定义遗漏 self 时，自动提供的首个实参通常会让参数个数不匹配。'),
      ],
    },
    {
      title: '对象身份、别名与可以检查的行为',
      explanation: [
        'Counter(4) 执行两次，得到两个对象。b=a 只是多了一个名字，通过任意别名修改对象都会反映到另一名称。is 比较身份，打印同样的属性不能证明是同一个对象。',
        '方法可以返回成功或失败，让命令行入口决定怎样展示。失败路径要先验证再写状态。连续操作后读出状态，比只看成功提示更容易发现错误。',
      ],
      examples: [
        ex('box-shared-alias', '箱子的别名与独立实例', '应用', `class Box:
    def __init__(self):
        self.labels = []

    def add(self, label):
        self.labels.append(label)

first = Box()
alias = first
other = Box()
alias.add("A")
print(first is alias, first is other)
print(first.labels, other.labels)
`, "True False\n['A'] []\n", '用实际变更核对构造和赋值的区别。',
        ['每次 Box() 在初始化时创建一张新列表。', 'alias 绑定到 first 对象。', '修改经由 alias 写入 first，other 的列表为空。'],
        '将 labels=[] 放在类体中会使实例默认共享列表。'),
        ex('box-atomic', '拒绝超额扣减后继续使用余额', '应用', `class Pass:
    def __init__(self, remaining):
        self.remaining = remaining

    def use(self, seats):
        if seats > self.remaining:
            return False
        self.remaining -= seats
        return True

ticket = Pass(3)
print(ticket.use(4), ticket.remaining)
print(ticket.use(3), ticket.remaining)
`, 'False 3\nTrue 0\n', '先检查限额，再更新可观察状态。',
        ['第一次请求失败，提前返回。', '第二次恰好等于余额，可以扣减。', '外部同时检查返回值与余额。'],
        '先减再检查会让失败路径留下负余额。'),
      ],
    },
  ],
  comparisons: { headings: ['表达', '谁持有状态', '含义'], rows: [
    ['put(record, 2)', '传入记录', '公共函数操作显式参数'], ['box.put(2)', 'box 实例', '方法绑定了接收者'],
    ['b = a / b = Box()', '同一对象 / 新对象', '别名与独立初始化分别处理'],
  ] },
  applications: ['为多个并行柜台、循环计数器或订单状态选出适合封装的对象。', '测试一个错误操作后再提交合法操作，核对失败是否改变状态。'],
  mistakes: [
    { symptom: '属性只在初始化里能读到', reason: '写成了局部名 used=0。', fix: '用 self.used=0 将值存入实例。', check: '构造后从外部读它，再运行方法。' },
    { symptom: '两个箱子同时变了', reason: '两个变量引用同一实例或共享的可变数据。', fix: '分别调用类，并在 __init__ 分别创建实例属性。', check: '改变一个实例，核对另一个。' },
  ],
  summary: ['类定义共同的初始化和行为，实例有各自的状态。', '读取实例方法时产生绑定，首参 self 指向实际接收者。', '公开操作应明确失败是否改状态，并用多实例验证。'],
  next: '下一课辨认类属性与实例属性，给同一种记录选择三种方法。',
  exercises: [
    q('object-init', '检查实例状态的归属', '怎样让每个实例拥有自己的空 tags 列表？', 1, [
      ['class 内直接写 tags=[]', '多个实例的读取会落到同一个类列表。'], ['在 __init__ 中写 self.tags=[]', '每次初始化都创建并绑定新列表。'], ['在方法体写 tags=[]', '该局部列表不会自动存进实例。'],
    ]),
    q('object-self', '解释绑定方法接收的首个实参', '已定义 Box.add(self, n)，b.add(2) 的 self 是谁？', 2, [
      ['Box 类', '普通实例方法接收实例。'], ['整数 2', '2 填到第二个形参 n。'], ['实例 b', '读取 b.add 时已把方法与 b 绑定。'],
    ]),
    q('object-alias', '预测别名改变的可见性', '代码输出什么？', 0, [
      ['4 1', 'a 与 b 指向同一对象，c 自己初始化。'], ['1 1', '通过 b 写入和通过 a 读取作用在同一对象。'], ['4 4', '两次构造返回不同实例。'],
    ], 'class Box:\n    def __init__(self):\n        self.used = 1\na = Box()\nb = a\nc = Box()\nb.used = 4\nprint(a.used, c.used)', '4 1\n'),
    q('object-failure', '选出不会污染状态的拒绝路径', '领用数量大于余额时，方法应先做什么？', 1, [
      ['先扣减且直接返回 False', '失败会留下扣减后的余额。'], ['在改动前验证足够，再决定是否扣减', '失败可以保持原余额。'], ['将余额写为零', '这会抹掉尚可使用的原余额。'],
    ]),
    coding('A065', '基础编程', '维护一台设备的独立剩余额度。'),
    coding('A066', '独立编程', '扩展到两个对象并验证零值与失败。'),
    coding('A067', '综合应用', '跨多个对象执行有状态命令。'),
    coding('A068', '拓展挑战', '维护导航光标和删去的未来历史。'),
  ],
  references: [
    reference('类与实例', 'tutorial/classes.html#a-first-look-at-classes', '核对实例化、属性和方法。'),
    reference('实例方法绑定', 'reference/datamodel.html#instance-methods', '核对绑定方法与首参。'),
  ],
};
