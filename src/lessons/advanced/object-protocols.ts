import type { Chapter } from '../../teaching-types';
import { coding, example as ex, question as q, reference } from './authoring.ts';

export const objectProtocols: Chapter = {
  introduction: '库房里的对象也可以被打印、计数、排序和逐项读取。特殊方法让 Python 的通用操作按我们定义的规则工作。数据类适合把一组字段整理成轻量记录。',
  prerequisites: '普通类、比较、排序、迭代器和装饰器。',
  version: 'Python 3.12。dataclasses 自 3.7 提供。',
  goals: ['为对象选择便于用户阅读与调试的文本表示。', '实现相等、比较、长度和迭代契约，并检查类型不匹配与迭代耗尽。', '用 dataclass 表达值记录、默认字段与每实例独立集合。'],
  topics: [
    {
      title: '从内置操作找到对应方法',
      explanation: [
        '__init__ 负责实例初始化。str(obj) 和 print(obj) 使用 __str__，repr(obj) 使用 __repr__，例如容器显示各元素时会使用它们的 repr。两者应返回字符串。常见做法是让 str 面向使用者，repr 包含类型及有助于调试的字段；没有单独的 __str__ 时可退回 repr。',
        'len(obj) 要求 __len__ 得到非负整数。== 和 < 分别会尝试调用 __eq__ 与 __lt__，用于排序和比较。遇到不支持的类型组合时可 return NotImplemented，让 Python 尝试另一侧的比较；它与抛异常的 NotImplementedError 用途不同。定义值相等时还应留意哈希规则，Python 默认让重写 __eq__ 且未定义 __hash__ 的普通类不可哈希。',
      ],
      examples: [
        ex('protocols-display', '同一张票的显示与调试形式', '起步', `class Ticket:
    def __init__(self, code):
        self.code = code

    def __str__(self):
        return f"票-{self.code}"

    def __repr__(self):
        return f"Ticket({self.code!r})"

ticket = Ticket("A")
print(ticket)
print(repr(ticket))
print([ticket])
`, "票-A\nTicket('A')\n[Ticket('A')]\n", '观察 print 和容器表示选择不同方法。',
        ['__init__ 保存编码。', '直接打印时使用 __str__。', '列表内元素显示调试形式。'],
        '特殊方法的返回类型有约定。__str__ 只打印而未返回字符串会报错。'),
        ex('protocols-order', '给作业定义可解释的比较规则', '应用', `class Job:
    def __init__(self, code, priority):
        self.code = code
        self.priority = priority

    def __eq__(self, other):
        if not isinstance(other, Job):
            return NotImplemented
        return (self.priority, self.code) == (other.priority, other.code)

    def __lt__(self, other):
        if not isinstance(other, Job):
            return NotImplemented
        return self.priority < other.priority

a, b, c = Job("Z", 2), Job("A", 1), Job("B", 2)
print(a == Job("Z", 2), a is Job("Z", 2), a == "Z")
print([job.code for job in sorted([a, b, c])])
`, "True False False\n['A', 'Z', 'B']\n", '区分业务相等、身份与排序中的并列。',
        ['两份同字段数据可以等值而拥有不同身份。', '对字符串返回 NotImplemented，等号最终给出 False。', '排序只看优先级，并列保留输入次序。'],
        '别在不匹配的 other 上直接访问属性。排序键与相等字段可以服务不同业务目的，应写清。'),
      ],
    },
    {
      title: '迭代协议与数据类',
      explanation: [
        '__iter__ 返回迭代器。迭代器的 __next__ 每次给出下一项，结束时抛 StopIteration，迭代器自身的 __iter__ 返回自己。容器可在每次 iter(container) 时给一个新游标；迭代器本身的进度则持续推进。直接调用内置操作通常从对象类型上查找相应特殊方法。',
        '@dataclass 根据带类型注解的字段生成 __init__、__repr__、__eq__ 等方法，默认不生成大小排序。字段注解描述预期类型，普通数据类不会自动校验。可变默认值应通过 field(default_factory=list) 等方式准备，工厂在需要默认值时运行。',
      ],
      examples: [
        ex('protocols-cursors', '两个游标独立读取同一清单', '应用', `class Cursor:
    def __init__(self, items):
        self.items = items
        self.index = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.index == len(self.items):
            raise StopIteration
        value = self.items[self.index]
        self.index += 1
        return value

class Tray:
    def __init__(self, items):
        self.items = tuple(items)

    def __len__(self):
        return len(self.items)

    def __iter__(self):
        return Cursor(self.items)

tray = Tray(["A", "B"])
first = iter(tray)
print(len(tray), next(first), list(first), list(first))
print(list(tray))
`, "2 A ['B'] []\n['A', 'B']\n", '观察新游标和同一游标连续使用的差别。',
        ['__len__ 负责报告容器大小。', '第一次 next 从 first 取走 A，第一次 list 取走余下的 B。', '再次遍历 tray 创建独立游标，并从 A 重读。'],
        '__next__ 在结束时要抛 StopIteration。返回 None 会让迭代仍被视为有数据。'),
        ex('protocols-dataclass', '数据类保存批次的独立标签', '起步', `from dataclasses import dataclass, field

@dataclass
class Batch:
    code: str
    units: int = 0
    tags: list[str] = field(default_factory=list)

first = Batch("A")
second = Batch("A")
print(first == second)
first.tags.append("冷藏")
print(first == second, second.tags)
print(first)
`, "True\nFalse []\nBatch(code='A', units=0, tags=['冷藏'])\n", '检查生成的构造、值比较和独立列表。',
        ['默认 units 是整数，可以直接共享常量。', 'tags 的工厂为每次默认构造返回新列表。', '默认相等比较同类型实例的参与比较字段。'],
        'default_factory=list 传入函数本身。写 list() 会提前调用，得到的列表不可作为工厂。'),
        ex('protocols-default-contrast', '列表写在类、数据类字段和默认工厂时的行为', '起步', `from dataclasses import dataclass, field

class Shared:
    tags = []

first, second = Shared(), Shared()
first.tags.append("fragile")
print(first.tags, second.tags, first.tags is second.tags)

try:
    @dataclass
    class Invalid:
        tags: list[str] = []
except ValueError as exc:
    print(type(exc).__name__, str(exc))

@dataclass
class Separate:
    tags: list[str] = field(default_factory=list)

first, second = Separate(), Separate()
first.tags.append("fragile")
print(first.tags, second.tags, first.tags is second.tags)
`, "['fragile'] ['fragile'] True\nValueError mutable default <class 'list'> for field tags is not allowed: use default_factory\n['fragile'] [] False\n",
        '在 Python 3.12 中对照三种声明方式，并观察错误发生的时机。',
        ['普通类的两个实例都从类上取 tags，两个名字得到同一个列表。append 直接修改该列表。',
          '数据类在装饰器处理字段时拒绝列表默认值，异常发生在构造实例之前。Python 3.12 的检查用不可哈希作为判断可变默认值的近似。',
          'default_factory=list 保存可调用对象。初始化缺省字段时执行 list()，每个默认构造得到一个独立列表。'],
        '若主动传入同一个列表给两个数据类实例，默认工厂不会被调用。需要独立时应分别传入不同列表，或在接口里明确复制。'),
      ],
    },
  ],
  comparisons: { headings: ['协议', '触发方式', '需要交回'], rows: [
    ['__str__ / __repr__', 'str、repr、打印', '字符串'],
    ['__eq__ / __lt__', '比较运算、排序', '比较结果或 NotImplemented'],
    ['__len__', 'len', '非负整数'],
    ['__iter__ / __next__', 'iter、for、next', '迭代器、下一项或 StopIteration'],
  ] },
  applications: ['给域对象写可读显示，对并列排序分别验证顺序与相等。', '用数据类表达订单、书目及独立的集合字段，保留自定义验证方法。'],
  mistakes: [
    { symptom: '第二轮 for 读不到内容', reason: '两次使用了同一个已经耗尽的迭代器。', fix: '把游标与可重复遍历的容器分开，让容器按需创建游标。', check: '交错使用两个 iter 的返回值。' },
    { symptom: '@dataclass 在类定义处报 ValueError', reason: '字段直接使用了 [] 作为默认值。', fix: '字段用 field(default_factory=list)。', check: '创建两个实例，追加其中一个的列表并确认另一个为空。' },
  ],
  summary: ['特殊方法使自定义对象和通用操作遵守同一契约。', '区分容器与读取位置，并以 StopIteration 明确结束。', '数据类减少字段重复定义，验证和业务不变量仍由代码负责。'],
  next: '最后一课会把这些设计决定组装进管理系统的各个阶段。',
  exercises: [
    q('protocol-repr', '选择面向调试的表示方法', '列表内的一张票通常用哪个方法显示？', 1, [
      ['__len__', '这用于长度。'], ['__repr__', '容器使用元素的调试表示。'], ['__iter__', '这用于读取迭代器。'],
    ]),
    q('protocol-stop', '识别迭代结束的信号', '迭代器已耗尽时，__next__ 应做什么？', 2, [
      ['返回 None', 'None 也能是一项合法数据。'], ['返回 self', '这会持续提供对象。'], ['抛出 StopIteration', 'for 或 list 会据此结束读取。'],
    ]),
    q('protocol-factory', '预测数据类列表各自何时产生', '下面输出什么？', 0, [
      ['[1] []', '默认工厂为每个实例创建新列表。'], ['[1] [1]', '这会发生在它们共享列表时。'], ['发生 TypeError', '列表工厂是合法的零实参可调用对象。'],
    ], 'from dataclasses import dataclass, field\n@dataclass\nclass Bag:\n    values: list = field(default_factory=list)\na, b = Bag(), Bag()\na.values.append(1)\nprint(a.values, b.values)', '[1] []\n'),
    q('protocol-eq', '区分不支持的比较和异常', '对象的 __eq__ 收到无关类型，应怎样表示不处理这个组合？', 1, [
      ['raise NotImplementedError', '这会中止比较。'], ['return NotImplemented', 'Python 可继续尝试另一侧。'], ['return 字符串错误', '非空字符串作真值，可能意外表示相等。'],
    ]),
    { ...coding('A085', '基础编程', '练习访客与调试两种文本格式。'), warmup: true },
    coding('A097', '基础编程', '供评测导入并构造对象，直接检查 str、repr 及多实例的标签。'),
    coding('A086', '独立编程', '为队列设计可独立使用的迭代器。'),
    coding('A087', '综合应用', '分开稳定排序、值相等和对象身份。'),
    coding('A088', '拓展挑战', '用独立标签列表维护多个数据类实例。'),
  ],
  references: [
    reference('特殊方法', 'reference/datamodel.html#special-method-names', '核对文本、比较和容器协议。'),
    reference('迭代器类型', 'library/stdtypes.html#iterator-types', '核对 __iter__、__next__ 与耗尽。'),
    reference('数据类', 'library/dataclasses.html', '核对字段、默认工厂及自动方法。'),
  ],
};
