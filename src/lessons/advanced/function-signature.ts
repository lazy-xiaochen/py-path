import type { Chapter } from '../../teaching-types';
import { coding, example as ex, question as q, reference } from './authoring.ts';

export const functionSignature: Chapter = {
  introduction: '给报名函数传入三个整数时，调用者很难分清哪一个是名额、哪一个是候补数。签名可以把关键选项写成必须带名字的参数，也能说明哪些字段属于可变长度的批次。',
  prerequisites: '参数绑定与默认值，以及上一模块的 * 和 ** 调用解包。',
  version: 'Python 3.12。定义时显式使用 / 的语法自 Python 3.8 提供。',
  goals: ['用 /、*、*args、**kwargs 写出并解释参数区段。', '预测参数缺失、意外关键字和重复绑定的错误。', '为输入来源可变但业务规则固定的功能设计清晰接口。'],
  topics: [
    {
      title: '位置、名字与分界',
      explanation: [
        '签名描述函数怎样接收调用。def queue(code, /, count=1, *, reserve=0) 中，/ 左边的 code 仅按位置传入，中间 count 可按位置或名字传入，* 右侧的 reserve 只能按名字传入。两个分隔符本身不接收任何实参。',
        '仅限关键字能防止两个相近的量在调用点混淆，且可不带默认值以要求显式填写。仅限位置适合短小含义明显的操作，或让内部形参名不成为调用方依赖。普通参数兼顾两种方式，也是常见默认选择。',
        '可按位置填的形参一旦带默认，后续可按位置填的形参也必须有默认，/ 不重置这条规则。仅限关键字区可同时包含必填与选填。调用者使用关键字时可按任意顺序写，绑定完成前会检查重复和缺失。',
      ],
      examples: [
        ex('signature-boundaries', '登记员的显式候补选项', '起步', `def reserve(code, /, seats=1, *, wait=0):
    return f"{code}:{seats}+{wait}"

print(reserve("A"))
print(reserve("B", seats=3, wait=2))
try:
    reserve("C", 3, 2)
except TypeError:
    print("候补必须写名字")
`, 'A:1+0\nB:3+2\n候补必须写名字\n', '通过一个正确调用和一个失败调用找出 * 的作用。',
        ['第一个位置只能填 code。', 'seats 接受同名实参，wait 也按名字传。', '第三个位置实参没有对应的参数槽，进入函数体前报错。'],
        '把 * 当成接收额外位置参数。仅有星号时它只是分界。'),
        ex('signature-required', '把必填规则写成仅限关键字', '应用', `def fee(units, /, *, rate=2, zone):
    return f"{zone}:{units * rate}"

print(fee(4, zone="北"))
try:
    fee(units=4, zone="北")
except TypeError:
    print("数量按位置传")
try:
    fee(4)
except TypeError:
    print("缺少区名")
`, '北:8\n数量按位置传\n缺少区名\n', '验证仅限位置和必填关键字，并观察关键字区的默认规则。',
        ['units 只能按位置绑定。', 'rate 用默认值，zone 按业务规则必填。', '错误都来自参数绑定，函数体无需为这些错误手写检查。'],
        '仅限关键字并不意味着有默认值。'),
      ],
    },
    {
      title: '变长参数与明确的配置',
      explanation: [
        '*items 在定义中收集剩余位置实参到元组，后续有名字的形参必须按关键字填入。**options 最后收集尚未绑定的关键字为字典。两个容器在没有对应实参时分别为空元组和空字典。',
        '调用的 *source 和 **mapping 会展开数据。多个映射展开时，重复键会在调用时出错。配置覆盖是业务规则时，先合并字典，让每个最终关键字只出现一次。关键字的键应是字符串。',
        '接口允许未知选项时，应明确它们的去处或校验规则。直接接受 **options 并忽略所有未知键，会让拼写错误看起来像配置生效。对业务必需的选项把名字写进签名。',
      ],
      examples: [
        ex('signature-collect-extra', '固定服务名加可变重量', '起步', `def manifest(service, /, *weights, limit, **labels):
    return service, sum(weights), limit, labels

print(manifest("E", *[3, 2], limit=5, shift="晚"))
print(manifest("E", limit=0))
`, "('E', 5, 5, {'shift': '晚'})\n('E', 0, 0, {})\n", '分辨必填位置项、剩余位置、必填关键字和附加标签。',
        ['service 由第一个实参绑定。', '展开的 3、2 收进 weights。', 'limit 有明确形参，shift 留给 labels。'],
        '若省略 limit，即使 labels 不为空也无法满足缺失的必填参数。'),
        ex('signature-config', '先解决配置冲突再调用', '应用', `def ticket(code, /, *, end="!", prefix="票"):
    return f"{prefix}{code}{end}"

defaults = {"prefix": "票", "end": "!"}
updates = {"end": "?"}
print(ticket("X", **(defaults | updates)))
try:
    ticket("X", **defaults, **updates)
except TypeError:
    print("end 重复")
`, '票X?\nend 重复\n', '分别观察字典覆盖和函数的绑定检查。',
        ['合并字典把 end 的最终值确定为问号。', '一次展开，每个名字只有一个值。', '两次展开会同时交出两个 end，触发绑定错误。'],
        '把 Python 的重复关键字报错误当作最后一个值自动覆盖。'),
      ],
    },
  ],
  comparisons: { headings: ['写法', '绑定方式', '常用情境'], rows: [
    ['code, /', '仅位置', '隐藏短参数的内部名字'], ['count=1', '位置或关键字', '可读而通用的参数'],
    ['*, wait=0', '仅关键字', '区分含义相似的配置'], ['*items 与 **options', '收集额外实参', '批次、转发和可扩展配置'],
  ] },
  applications: ['在收费和审核接口中让数量、上限与策略在调用处可辨认。', '将命令行读取与函数调用分开，输入的数据准备完毕后再展开。'],
  mistakes: [
    { symptom: '看似指定了必填参数仍报错', reason: '给 / 左侧的参数传了同名关键字。', fix: '将它放在正确的位置。', check: '直接测试位置形式和关键字形式各一次。' },
    { symptom: '拼错配置名却没有提示', reason: '任意关键字都落入 **options，业务逻辑没有检查。', fix: '固定配置用显式形参，剩余配置依约校验。', check: '测试合法配置和一个拼错的名字。' },
  ],
  summary: ['读签名先看 / 与 * 的位置，再看哪些槽必填。', '*args、**kwargs 收集剩余实参，调用端的星号负责展开。', '配置有优先级时先合并，参数冲突和未知字段应有明确行为。'],
  next: '下一课把函数当作普通对象传入，让同一接口选择不同业务策略。',
  exercises: [
    q('signature-wait', '定位仅限关键字参数', '对 def f(code, /, count=1, *, wait=0) 而言，哪个调用合法？', 2, [
      ['f(code="A")', 'code 只能按位置传。'], ['f("A", 2, 3)', 'wait 无对应位置槽。'], ['f("A", wait=2)', 'code 按位置、wait 按名字，count 采用默认值。'],
    ]),
    q('signature-args', '预测收集参数的具体内容', '代码输出什么？', 0, [
      ["('A', (2, 3), {'zone': 'N'})", 'A 绑定 code，其余位置收进元组，zone 收进字典。'], ["('A', [2, 3], {'zone': 'N'})", '定义中的 *items 收集为元组。'], ['发生 TypeError', '签名允许额外位置参数和关键字。'],
    ], 'def f(code, /, *items, **options):\n    return code, items, options\nprint(f("A", 2, 3, zone="N"))', "('A', (2, 3), {'zone': 'N'})\n"),
    q('signature-duplicate', '区分多个展开与覆盖规则', '已合并为最终配置字典后，怎么传给 f 的关键字参数？', 1, [
      ['f(*config)', '对字典做位置展开会依次传键。'], ['f(**config)', '一次按键名展开最终配置。'], ['f(**config, **config)', '任何重复的键都会导致调用异常。'],
    ]),
    q('signature-spell', '为必填业务选项选择签名', '需要候补人数必填并明确写出 wait=...，选择哪种参数？', 2, [
      ['wait=0', '默认值使该参数可省略。'], ['只接收 **options', '单靠收集字典不能标记这个键必填。'], ['*, wait', '仅限关键字且没有默认值。'],
    ]),
    coding('A041', '基础编程', '给包间计算明确的仅限关键字选项。'),
    coding('A042', '独立编程', '把多件重量展开到变长位置参数。'),
    coding('A043', '综合应用', '合并两级打印配置后一次展开。'),
    coding('A044', '拓展挑战', '检查必填关键字和可选项，防止拼写错误滑过。'),
  ],
  references: [
    reference('特殊参数', 'tutorial/controlflow.html#special-parameters', '核对 /、* 和各个区段。'),
    reference('函数定义的语法', 'reference/compound_stmts.html#function-definitions', '核对形参顺序、默认值和收集参数。'),
    reference('参数列表解包', 'tutorial/controlflow.html#unpacking-argument-lists', '核对展开位置参数和关键字映射。'),
  ],
};
