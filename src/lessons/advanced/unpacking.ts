import type { Chapter } from '../../teaching-types';
import { coding, example as ex, question as q, reference } from './authoring.ts';

export const unpacking: Chapter = {
  introduction: '报名编号、分数和附加标签经常打包在同一行。把这些字段拆给有意义的名称，能避免一直写 row[0] 和 row[1]。本课从赋值拆包走到数据配对和函数调用，最后用一份报表串起整个模块。',
  goals: ['在元组、列表与嵌套记录中使用普通和星号赋值，预测不足、过多与空剩余。', '用 enumerate、zip 和 items 配对与拆字段，判断该截断还是检查列长。', '区分函数定义时的收集与调用时的展开，用 * 和 ** 传递字段并处理重复名称。'],
  prerequisites: '前面三课，以及基础篇的函数调用、返回值、异常和字典。',
  version: 'Python 3.12。zip 的 strict 参数自 Python 3.10 提供，会在实际迭代时检查长度。',
  topics: [
    {
      title: '分配固定字段和可变长度的中段',
      explanation: [
        'name, score = record 从 iterable 依次拆出两项赋给两个名称。没有星号时，数量必须恰好相同。等号右边先求值，随后才给左边赋值，因此 a, b = b, a 可以交换。像 who, (score, place) = row 这样的写法会按两层形状核对数量。',
        'start, *middle, end = row 先分配头尾，星号目标得到未被分配的所有项组成的新列表，即使来源是元组且剩余为空。每层最多一个星号目标。固定位置不够时仍会报 ValueError。',
        '构造新容器时方向相反。[*left, *right] 展开两份来源并组成新外层列表，(*left, *right) 生成元组。{**defaults, **overrides} 把映射展开进新字典，右侧同名键覆盖。加星号取出元素，不会深拷贝其中的可变对象。',
      ],
      examples: [
        ex('nested-swap', '交换坐标并拆出分区字段', '起步', `records = ("北门", (3, 5))
station, (row, col) = records
row, col = col, row
first, *labels, last = ("A12", "优先", "免检", "B7")
print(station, row, col)
print(first, labels, last)
`, "北门 5 3\nA12 ['优先', '免检'] B7\n", '分别检查嵌套结构、交换与星号剩余。',
        ['外层的第二项是一对坐标，所以对应内层括号。', '交换时先取得原 col 与 row。', '星号把头尾之间的项目收进列表。'], '只写 station, row, col = records 时外层只有两项，会因数量不足失败。'),
        ex('collect-expand', '拆分已有标签，再合并到新批次', '应用', `first, *optional, last = ["A", "Z"]
extended = [first, *optional, "新增", last]
pair = (*["东"], *["西"])
print(optional, extended, pair)
`, "[] ['A', '新增', 'Z'] ('东', '西')\n", '把同一个星号的收集和展开方向并排对照。',
        ['赋值左边的星号收集零项，生成空列表。', '新列表展开空列表，没有额外一项。', '元组内的两个星号分别展开各自的来源。'], '用 [first, optional, last] 会把 optional 整个作为一个嵌套元素。'),
      ],
    }, {
      title: '对齐列、编号和遍历映射',
      explanation: [
        'enumerate(data, start=1) 每次提供 (序号, 元素)，常写 for number, item in ...。zip(a, b) 每次从两份数据的对应位置各取一项，组成一个元组。zip 也是一次性迭代器，默认遇到较短的输入便结束。',
        '数据要求行数相等时，使用 zip(..., strict=True) 或对已有列表先比较长度。strict=True 在实际读取发现长短不一致时抛 ValueError，已经读出的前缀不会撤销。若要求整份报表同时发布，先验证长度或收集全部配对，再输出。',
        'd.items() 提供键值对，适合写 for code, status in d.items()。解包也能作为推导式的循环目标，例如 [code for code, score in pairs if score >= 60]，把有意义的名称直接用于条件与结果。',
      ],
      examples: [
        ex('pairs-and-ranks', '对齐编号和积分并标注原来行号', '应用', `codes = ["A", "B", "C"]
scores = [20, 9, 10]
matched = zip(codes, scores, strict=True)
qualified = [(position, code) for position, (code, score) in enumerate(matched, 1) if score >= 10]
print(qualified)
print([code for code, score in {"C": 10, "B": 9}.items() if score >= 10])
`, "[(1, 'A'), (3, 'C')]\n['C']\n", '使用嵌套解包获取序号、编号和分数。',
        ['zip 提供编号与积分元组。', 'enumerate 再包一层序号，循环目标也按两层形状写。', '筛选发生在编序号之后，因此 C 仍保留 3。'], '过滤后再 enumerate 会让 C 成为 2，只适合需要重新排名的报告。'),
        ex('zip-strict', '检查长度错误发生在哪次取值', '起步', `print(list(zip(["A", "B"], [7])))
paired = zip(["A", "B"], [7], strict=True)
print(next(paired))
try:
    print(next(paired))
except ValueError:
    print("列数不一致")
`, "[('A', 7)]\n('A', 7)\n列数不一致\n", '观察默认截断，以及 strict 的延迟失败。',
        ['默认只保留成对前缀。', 'strict 版本创建时不替你检查整个输入。', '第二次 next 发现 B 没有积分，引发异常。'], '如果不消耗迭代器到对齐结果末端，可能根本观察不到不匹配。'),
      ],
    }, {
      title: '调用时展开，定义时收集',
      explanation: [
        '调用 print(*values) 时，把可迭代对象拆成若干位置实参。函数调用可以写 f(*left, *right, **options)；双星号展开的是映射，键必须是字符串，会按对应参数名传递。重复提供同一个关键字或重复绑定同一个形参会报 TypeError。',
        '定义 def f(*args, **kwargs) 时方向反过来。args 收集额外位置实参为元组，kwargs 收集额外关键字实参为字典。args、kwargs 是常用名称，星号才决定机制。需要让调用者看懂必填项时，优先写出明确参数名。',
        '字典合并与函数调用的冲突规则不同。{**defaults, **change} 会先形成一个只含最终键的字典，再用 f(**merged) 传入很合适。直接 f(**defaults, **change) 遇到同名键会失败。',
      ],
      examples: [
        ex('arguments-in-out', '用列表字段和设置字典生成小票', '应用', `def receipt(*items, **options):
    print(type(items).__name__, options["prefix"])
    print(options["prefix"], *items, sep=options["sep"])

defaults = {"prefix": "清单", "sep": "|"}
selected = {**defaults, **{"prefix": "领用"}}
receipt(*["灯", "伞"], *["绳"], **selected)
try:
    receipt(**defaults, **selected)
except TypeError:
    print("关键字重复")
`, 'tuple 领用\n领用|灯|伞|绳\n关键字重复\n', '跟踪实参展开到参数收集的过程，并验证覆盖规则。',
        ['两个位置列表展开后合成三个实参，被 items 收为元组。', '合并字典已消解同名键，双星号传给 options。', '直接展开两个含相同键的映射时，在调用前就发现冲突。'], '把列表直接作为一个位置实参，会收到单项元组，不能逐项输出。'),
      ],
    },
  ],
  comparisons: { headings: ['写法', '处理方向', '常见用途'], rows: [
    ['head, *rest = values', '收集剩余项为列表', '变长记录拆字段'],
    ['f(*values, **options)', '展开位置与关键字', '把已有数据交给接口'],
    ['def f(*args, **kwargs)', '多余实参收为元组和字典', '转发或接收变长参数'],
    ['{**base, **patch}', '合并映射，右侧覆盖', '形成最终配置后再调用'],
  ] },
  applications: ['为从不同渠道读取的列加原始编号和对齐检查，再按业务规则筛选。', '用拆包把一条记录的主要字段、可选标签和结束字段分开，随后按名称计算。'],
  mistakes: [
    { symptom: '两列长度不同，程序却没有报错', reason: '默认 zip 只读能配对的前缀。', fix: '确实要求等长时先比较长度，或用 strict=True 并检查完整迭代。', check: '让每一侧分别多一项，并检查没有部分报表。' },
    { symptom: '合并配置没报错，直接调用却提示重复参数', reason: '字典构造覆盖同名键，函数调用不接受重复关键字。', fix: '先合并成最终映射，再展开一次。', check: '至少准备一个双方共有的键及一个独有键。' },
  ],
  summary: ['普通解包要求字段数精确匹配。星号目标收集剩余项为列表。', 'enumerate 记录原位置，zip 对齐列，items 提供键值对。', '赋值与定义里的星号负责收集，调用和字面量里的星号负责展开。'],
  next: '完成对齐报表测评后，下一模块将用参数绑定、作用域和递归深入解释函数的执行。',
  exercises: [
    q('unpack-rest', '判断两端分配与星号剩余的类型', '输出是什么？', 1, [
      ['1 () 9', '星号赋值收集到列表，即使原对象是元组。'], ['1 [] 9', '两项被两端取走，剩余为空列表。'], ['触发 ValueError', '输入数量足够填满固定目标。'],
    ], 'head, *middle, tail = (1, 9)\nprint(head, middle, tail)', '1 [] 9\n'),
    q('unpack-zip-default', '手推对齐结束和原编号', '代码输出什么？', 0, [
      ["[(1, ('A', 7))]", 'zip 只产生一对，enumerate 从 1 开始。'], ["[(0, ('A', 7))]", '第二个参数设置了起点 1。'], ["[(1, ('A', 7)), (2, ('B', None))]", '默认 zip 不会自动填补缺失。'],
    ], 'print(list(enumerate(zip(["A", "B"], [7]), 1)))', "[(1, ('A', 7))]\n"),
    q('unpack-conflict', '判断函数关键字与字典合并冲突行为', 'options 和 extra 都有 sep 键。怎样让 extra 的 sep 生效？', 2, [
      ['直接 print("A", "B", **options, **extra)', '调用阶段遇到重复关键字会抛 TypeError。'], ['用 *options, *extra 展开', '展开字典作位置实参得到它的键，不会绑定 sep。'], ['先构造 {**options, **extra}，调用时展开这一份映射', '后写键覆盖，最终每个关键字只出现一次。'],
    ]),
    q('unpack-shape', '推导读取配对记录时的目标形状', '若循环得到 (2, ("B", 10))，如何同时得到 2、B、10？', 1, [
      ['position, code, amount = value', '外层只有两个位置。'], ['position, (code, amount) = value', '左侧保留了序号和记录两层形状。'], ['(position, code), amount = value', '整数 2 无法被拆成两个字段。'],
    ]),
    coding('A033', '基础编程', '拆出变长记录的两端与全部中间字段。'),
    coding('A034', '独立编程', '核对两列等长，从原始行号生成筛选报表。'),
    coding('A035', '综合应用', '将多来源的参数展开与配置优先级结合起来。'),
    coding('A036', '拓展挑战', '完成模块测评，从对齐的两列中生成去重后的事件报表。'),
  ],
  references: [
    reference('赋值语句', 'reference/simple_stmts.html#assignment-statements', '核对嵌套目标和星号收集的规则。'),
    reference('内置函数 zip', 'library/functions.html#zip', '核对严格配对时何时检测不等长。'),
    reference('参数列表解包', 'tutorial/controlflow.html#unpacking-argument-lists', '对照位置、关键字展开和变长函数参数。'),
    reference('调用表达式', 'reference/expressions.html#calls', '核对重复关键字和绑定冲突。'),
  ],
};
