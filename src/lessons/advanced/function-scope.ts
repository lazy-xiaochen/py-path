import type { Chapter } from '../../teaching-types';
import { coding, example as ex, question as q, reference } from './authoring.ts';

export const functionScope: Chapter = {
  introduction: '两个窗口都显示自己的排队号，且能随业务设置各自的步长。理解函数在哪一层找到名称之后，就能写出拥有独立状态的计数器。',
  prerequisites: '函数对象、返回函数和参数默认值。示例聚焦模块与普通函数。',
  version: 'Python 3.12。',
  goals: ['按 LEGB 解释读取名称时的查找顺序，识别遮蔽与 UnboundLocalError。', '区分 global、nonlocal 与原地修改共享对象。', '为不同调用创建独立闭包，并修复循环变量的晚绑定。'],
  topics: [
    {
      title: '名称读写和 LEGB',
      explanation: [
        '普通函数读取名称时，可以按 LEGB 理解：Local 是当前函数局部；Enclosing 是从近到远的外层函数；Global 是函数定义所在模块；Builtins 是内置名称。先找到的绑定会遮蔽后面的同名绑定。全局层取决于定义的位置，调用者的局部变量不会插到查找链上。',
        '函数体内有赋值时，该名称通常在编译函数体时就被归为局部。若先读取而此调用尚未为它赋值，就会发生 UnboundLocalError，即使外面有同名绑定。+= 会先读取再重新赋值，也受这条规则影响。',
        'global 宣告相应名称指向模块层；nonlocal 宣告名称绑定在最近的、已经绑定该名称的外层函数。nonlocal 不从模块层找，也不会新建外层名称。对外层列表调用 append 本身没有重新绑定变量名，通常不需要声明。',
      ],
      diagram: { caption: '普通内层函数读一个自由名称', text: '本次调用的局部 → 最近的外层函数 → 其余外层函数 → 定义所在模块 → 内置名称' },
      examples: [
        ex('scope-legb', '跟踪四个不同来源的名称', '起步', `room = "大厅"
def outer():
    room = "外层库房"
    def inner(label):
        return label, room, len(label)
    return inner("甲")

print(outer())
print(room)
`, "('甲', '外层库房', 1)\n大厅\n", '区分内层实参、定义外层、模块层与内置功能。',
        ['label 在 inner 的局部，值为甲。', 'room 在 outer 找到，模块层 room 被遮蔽。', 'len 的查找走到内置层。返回后模块层仍为大厅。'],
        '不要用 len、sum 等内置名称给本地数据起名，以免遮蔽后无法调用。'),
        ex('scope-rebind', '拆开读局部、改外层和改模块层', '应用', `hits = 2
def broken():
    hits += 1

try:
    broken()
except UnboundLocalError:
    print("局部值还没有绑定")

def batch():
    hits = 10
    def tick():
        nonlocal hits
        hits += 3
        return hits
    return tick()

def reset():
    global hits
    hits = 0

print(batch(), hits)
reset()
print(hits)
`, '局部值还没有绑定\n13 2\n0\n', '把三个同名变量分开追踪。',
        ['broken 的赋值让 hits 成为局部，+= 读不到初值。', 'tick 修改 batch 的绑定，模块 hits 仍为 2。', 'reset 明确改模块 hits，值变为 0。'],
        '如果只是想计算一个不同的值，可传入原值并返回新值，减少对共享状态的依赖。'),
      ],
    },
    {
      title: '闭包保留哪一份绑定',
      explanation: [
        '内层函数引用某个外层函数的变量，形成闭包。外层调用结束后，返回的内层函数还可访问相关绑定。每次调用外层函数都会建立新的一组局部绑定，因此两次工厂调用可以产生各自独立的状态。',
        '闭包读取变量时取它当时的值。多个函数捕获同一轮循环中的同一个循环变量绑定，延后调用时通常都会读到最后值。让每次循环调用工厂、传入当前值，或使用默认参数 x=x 在定义时保存当前对象，都能把需要的值分开。默认参数保存引用，涉及可变对象时要明确是否复制。',
      ],
      examples: [
        ex('scope-independent', '两个窗口各自维护号码', '起步', `def make_queue(start):
    number = start
    def take(step=1):
        nonlocal number
        number += step
        return number
    return take

east = make_queue(0)
west = make_queue(10)
print(east(), west(2), east())
alias = east
print(alias(), east())
`, '1 12 2\n3 4\n', '区分重新调用工厂和给已有闭包起别名。',
        ['工厂的两次调用分别创建 number。', 'east 调用后不会影响 west。', 'alias 指向同一个闭包，继续使用 east 的状态。'],
        '在工厂外定义共享计数会让两个窗口互相干扰。'),
        ex('scope-late-binding', '批量生成三盏灯的开关回调', '应用', `def callbacks():
    late = []
    frozen = []
    for lamp in ["A", "B", "C"]:
        late.append(lambda: lamp)
        frozen.append(lambda lamp=lamp: lamp)
    return late, frozen

late, frozen = callbacks()
print([fn() for fn in late])
print([fn() for fn in frozen])
`, "['C', 'C', 'C']\n['A', 'B', 'C']\n", '在延后调用时验证循环变量的同一绑定与定义时求值。',
        ['late 中三个函数引用的是同一外层绑定。', '循环结束时，该绑定中是 C。', 'frozen 中每个函数定义时保存各自默认参数。'],
        '若保存的是会继续改变的列表，默认参数仍指向原列表，可复制后再冻结。'),
      ],
    },
  ],
  comparisons: { headings: ['需求', '方式', '影响范围'], rows: [
    ['读取外层值', '直接引用', '按 LEGB 找到归属'],
    ['重绑外层函数变量', 'nonlocal', '最近有同名绑定的外层函数'],
    ['重绑模块变量', 'global', '定义所在模块'],
    ['修改已选中的共享列表', 'append 或下标赋值', '所有仍引用该对象的调用者可见'],
  ] },
  applications: ['在函数工厂里保存多个窗口的独立计数、当前限额或格式配置。', '批量生成规则后再执行时，检查循环变量是共享绑定还是每条规则独有的值。'],
  mistakes: [
    { symptom: '读同名变量时发生 UnboundLocalError', reason: '当前函数体里有针对这个名字的赋值。', fix: '用局部名称接收实参，或明确声明要修改的外层绑定。', check: '从整个函数体找赋值，而不只看当前执行行。' },
    { symptom: '三条规则都引用最后一项', reason: '它们捕获同一个外层循环变量。', fix: '每次单独调用工厂，或使用默认参数固定当前值。', check: '在循环结束后再逐条调用规则。' },
  ],
  summary: ['LEGB 分层查找。赋值会依据编译时确定的归属绑定名称。', '闭包延长可访问的外层绑定的生命周期。独立创建与创建别名的状态关系不同。', '先明确共享状态的归属，再决定使用返回值、nonlocal 或 global。'],
  next: '接下来用闭包包住另一个函数，增加可复用的调用前后逻辑。',
  exercises: [
    q('scope-local', '识别局部名还没有绑定的错误', '如果 x 已在模块层定义，函数中的 x += 1 仍可能抛出什么异常？', 1, [
      ['IndexError', '这里没有位置索引。'], ['UnboundLocalError', '赋值将 x 分类为局部，读它时尚未初始化。'], ['始终成功', '需要显式传入、初始化局部变量或声明归属。'],
    ]),
    q('scope-nearest', '预测 nonlocal 查找的最近绑定', '代码输出什么？', 2, [
      ['2 2', '外层函数中的 x 会被重绑。'], ['4 4', '模块的 x 不参与 nonlocal 查找。'], ['4 1', 'outer 的 x 变为 4，模块的仍为 1。'],
    ], 'x = 1\ndef outer():\n    x = 2\n    def update():\n        nonlocal x\n        x = 4\n    update()\n    return x\nprint(outer(), x)', '4 1\n'),
    q('scope-closures', '区分闭包的别名与独立状态', 'a = factory(); b = a。调用 a 更新计数后，b 读到什么？', 0, [
      ['同一份已经更新的状态', '两个名称引用同一个函数对象及其闭包。'], ['一份工厂初值', '还需要重新调用 factory 才会创建独立状态。'], ['取决于 b 的调用者', '闭包引用的是创建时关联的外层绑定。'],
    ]),
    q('scope-loop-free', '处理延后运行的回调', '循环中生成的三条回调都读到最后一个 i，怎样让它们各自记住当次整数？', 1, [
      ['将 i 声明为 global', '共享模块绑定仍会继续改变。'], ['每轮调用一次 make_rule(i)', '该轮参数进入一次新的工厂调用绑定。'], ['将回调放进元组', '改外层容器不改变函数捕获的绑定。'],
    ]),
    coding('A049', '基础编程', '区分本单覆盖与下一单默认设置。'),
    coding('A050', '独立编程', '核对计数窗口的输入输出。试用闭包，再用 A093 验证可调用的计数接口。'),
    coding('A093', '综合应用', '直接构造两个闭包，交错测试独立状态与别名。'),
    coding('A051', '综合应用', '按编号生成规则，再在延后事件中调用。'),
    coding('A052', '拓展挑战', '为多个站点独立维护可调整的限额状态。'),
  ],
  references: [
    reference('名称绑定与解析', 'reference/executionmodel.html#naming-and-binding', '核对局部分类、自由名称与作用域。'),
    reference('global 和 nonlocal', 'reference/simple_stmts.html#the-global-statement', '核对两个声明的绑定归属。'),
    reference('循环中的 lambda', 'faq/programming.html#why-do-lambdas-defined-in-a-loop-with-different-values-all-return-the-same-result', '核对循环变量晚绑定与默认参数的修正。'),
  ],
};
