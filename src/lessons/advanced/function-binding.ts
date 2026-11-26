import type { Chapter } from '../../teaching-types';
import { coding, example as ex, question as q, reference } from './authoring.ts';

export const functionBinding: Chapter = {
  introduction: '同一个寄件函数会被两个窗口反复调用。参数可以给默认金额，返回值能同时交出应付金额和重量区间。遇到共享箱单时，还要明确「改这份清单」和「做一份新清单」的区别。',
  prerequisites: '基础篇函数和列表，以及进阶课「列表、切片与对象引用」「解包、对齐与组合」。',
  version: 'Python 3.12。',
  goals: ['区分形参、实参和默认值，手推一次函数调用的参数绑定。', '预测原地修改、局部重新绑定和浅拷贝对调用方的影响。', '写出重复调用相互独立的函数，并解包多项返回值。'],
  topics: [
    {
      title: '调用时，实参与形参如何对应',
      explanation: [
        'def 执行时创建函数对象并把它绑定到函数名。定义里的名字叫形参；调用里已经求值的对象是实参。位置实参从左往右填位置；关键字实参按名字填。每个形参最终只能得到一个值，缺少必填项或重复填值会在进入函数体前报 TypeError。',
        '每次调用产生各自的局部绑定。参数名在函数开始时指向调用方交来的对象。参数 = 新值会让局部名改指；参数.append(...) 会通过名字找到并修改原有对象，外部若仍指向它便能看到变化。想交出新清单时先复制需要改动的层级。',
        'return 会立即结束当前调用，并把一个对象交给调用方。return subtotal, fee 构造一个元组，调用方再拆出两项。没有执行带值的 return 时，调用结果为 None。打印只写出文本，可以与返回配合使用。',
      ],
      examples: [
        ex('binding-two-ways', '同一小票的两种参数写法', '起步', `def bill(quantity, price, packing=2):
    subtotal = quantity * price
    return subtotal, subtotal + packing

print(bill(3, 5))
goods, total = bill(price=5, quantity=3, packing=0)
print(goods, total)
`, '(15, 17)\n15 15\n', '用两种方式调用同一函数并解包返回结果。',
        ['第一次按位置填数量与单价，packing 用默认 2。', '第二次按名字填，顺序可以不同。', '两个计算结果一起存在元组中，调用者解包后分开使用。'],
        'bill(3, 5, price=2) 会把 price 填两次，函数体不执行。'),
        ex('binding-shared-list', '为订单添加标签时观察原件', '应用', `def mark_in_place(labels):
    labels.append("已核对")

def marked_copy(labels):
    labels = labels.copy()
    labels.append("已签收")
    return labels

original = ["箱1"]
print(mark_in_place(original), original)
print(marked_copy(original), original)
`, "None ['箱1', '已核对']\n['箱1', '已核对', '已签收'] ['箱1', '已核对']\n", '观察共享修改、局部改指和返回新对象。',
        ['第一函数直接修改调用者的表，执行完返回 None。', '第二函数先把局部名改指向浅拷贝。', '添加字符串只影响浅拷贝，调用者可以继续使用原件。'],
        '浅拷贝共享里面的可变项。改嵌套行时还需要复制对应的内层。'),
      ],
    },
    {
      title: '默认值的求值时机',
      explanation: [
        '默认值表达式在执行 def 时求值，从左到右。每次省略对应实参，函数会使用当时保存的默认对象。默认值引用了当时的外部名称，即使之后外部名称重新绑定，保存的对象也不会随之改变。',
        '列表或字典默认值会被所有省略这个参数的调用复用。如果函数修改它，下次调用可见旧内容。想让每次有独立容器时，用 None 作「未提供」标记，在函数体里用 is None 判断并创建容器。空列表可能是调用者明确提供的合法实参，应该按接口约定对待。',
      ],
      examples: [
        ex('binding-definition-time', '每天的默认费率何时确定', '起步', `rate = 2
def charge(units, fee=rate):
    return units * fee

rate = 5
print(charge(3), charge(3, fee=rate))
`, '6 15\n', '验证默认值和调用点的显式参数可来自不同时间。',
        ['执行 def 时 rate 为 2。', '外部 rate 改指 5，已保存的默认值仍是 2。', '显式 fee=rate 取调用时的外部值 5。'],
        '若希望每次取最新费率，在函数体内完成查找或由调用者明确传参。'),
        ex('binding-default-list', '逐次出单，避免上一单标签串入', '应用', `def bad(label, labels=[]):
    labels.append(label)
    return ",".join(labels)

def safe(label, labels=None):
    if labels is None:
        labels = []
    labels.append(label)
    return ",".join(labels)

print(bad("A"), bad("B"))
print(safe("A"), safe("B"))
provided = []
print(safe("C", provided), provided)
`, "A A,B\nA B\nC ['C']\n", '用重复调用区分共享默认容器和每次创建的容器。',
        ['两个 bad 调用修改同一个默认列表。', 'safe 省略参数时各自创建列表。', '明确传入空列表时，仍然使用调用者给的对象并追加。'],
        '写 if not labels 会把明确传入的空列表也替换掉。'),
      ],
    },
  ],
  comparisons: { headings: ['做法', '何时作用', '调用方能观察到什么'], rows: [
    ['labels = labels.copy()', '调用中改绑参数', '原表的外层未变'],
    ['labels.append(x)', '调用中修改共享对象', '原表多出一项'],
    ['labels=None 后创建 []', '每次省略参数时创建', '新容器互相独立'],
  ] },
  applications: ['把校验和金额计算封装成返回值明确的函数，命令行入口统一打印。', '给同一函数多次调用准备显式测试，特别检查空实参和共享对象。'],
  mistakes: [
    { symptom: '第二张票仍含第一张票的标签', reason: '可变默认列表被两次调用共同修改。', fix: '用 None 标记省略，在函数体内创建列表。', check: '连续调用两次并比较各自结果。' },
    { symptom: '调用方解包时得到 None', reason: '某个分支只打印或漏掉 return。', fix: '为所有业务分支写明返回值。', check: '分别触发空数据和非空数据。' },
  ],
  summary: ['定义执行时创建函数并保存默认对象，调用时才建立参数绑定。', '引用关系决定可变对象的修改能否被外部观察。', '多项返回是一个元组，多种返回路径都应在契约中说明。'],
  next: '接下来用 / 和 * 设计调用接口，限制参数怎样填入。',
  exercises: [
    q('binding-keyword', '识别重复的参数绑定', '哪个调用会在进入函数体之前失败？', 1, [
      ['bill(3, 5)', '两项按位置绑定，包装费用使用默认值。'], ['bill(3, 5, price=1)', 'price 已经被第二项位置实参填上。'], ['bill(price=5, quantity=3)', '两个名字都能对应各自形参。'],
    ]),
    q('binding-rebind', '预测参数名重新绑定后的原表', '代码输出什么？', 0, [
      ['[1]', 'x 改指新表，a 仍指向旧表。'], ['[8]', '只有给原表项目赋值才会改变它。'], ['None', '打印的是 a，本次调用的返回值没有被使用。'],
    ], 'def f(x):\n    x = [8]\na = [1]\nf(a)\nprint(a)', '[1]\n'),
    q('binding-snapshot', '识别默认值取自定义时', '代码输出什么？', 2, [
      ['9', '显式传入 fee 才会使用改绑后的 9。'], ['3 9', '只调用一次 print。'], ['3', 'def 执行时取到 fee 的值 3。'],
    ], 'fee = 3\ndef f(x=fee):\n    return x\nfee = 9\nprint(f())', '3\n'),
    q('binding-return-form', '理解多项返回的形状', '执行 return 4, 9 时，调用者收到什么？', 1, [
      ['两次独立返回', '一次调用只交回一个对象。'], ['一个含两项的元组', '逗号构造元组，调用者可以解包。'], ['一个有两个元素的列表', '这一写法用逗号组成元组。'],
    ]),
    coding('A037', '基础编程', '用默认包装费和显式覆盖计算账单。'),
    coding('A038', '独立编程', '隔离多次调用的默认容器，用返回值给出标签。'),
    coding('A039', '综合应用', '按命令选择原地编辑或生成副本。'),
    coding('A040', '拓展挑战', '拆分总量、净量和无效计数的返回契约。'),
  ],
  references: [
    reference('函数定义与默认值', 'tutorial/controlflow.html#default-argument-values', '核对定义时求值和共享容器。'),
    reference('调用的参数绑定', 'reference/expressions.html#calls', '核对参数填槽、默认值和重复实参。'),
    reference('return 语句', 'reference/simple_stmts.html#the-return-statement', '核对返回元组和无值返回。'),
  ],
};
