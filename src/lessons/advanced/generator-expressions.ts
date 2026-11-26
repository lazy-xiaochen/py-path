import type { Chapter } from '../../teaching-types';
import { coding, example as ex, question as q, reference } from './authoring.ts';

export const generatorExpressions: Chapter = {
  introduction: '有一条很长的记录流，只需要知道第一项超标的位置，或合格金额的总和。每项都先算好并存进列表，会带来额外工作。本课把生成结果和使用结果拆开，观察每次读取究竟推进了哪一步。',
  goals: ['用 iter 和 next 跟踪读取位置，准确预测重复读取与耗尽。', '解释生成器表达式的创建时机和逐项求值时机，使用 next、sum、any、all 处理按需结果。', '估算物化结果和逐项处理的内存差异，能为需要二次读取的任务选用合适的结构。'],
  prerequisites: '会用 for 和推导式，知道 input 读一行，能用异常类型区分失败原因。',
  version: 'Python 3.12。以下例子讨论同步迭代。模块里只用生成器表达式。',
  topics: [
    {
      title: '可迭代对象、迭代器与耗尽',
      explanation: [
        '可迭代对象能交给 iter(...) 得到迭代器。迭代器提供下一项并保存进度。两次 iter(列表) 通常得到各自从头开始的列表迭代器，而 iter(已有迭代器) 返回它本身。对同一个迭代器调用 next 多次，就是沿同一遍历继续向前。',
        'next(it) 读完时抛出 StopIteration；next(it, 默认值) 在耗尽时直接返回默认值。for 会先用 iter 得到迭代器，再不断读取，遇到 StopIteration 自动结束。sum、list 和许多其他接收可迭代对象的函数同样会消耗迭代器。',
        '(表达式 for 项 in 来源 if 条件) 会产生一个生成器对象，它本身就是迭代器。创建表达式时最左侧的来源已经求值并获得迭代器。之后每次取下一项才继续运行筛选、后续 for 和结果表达式。一次 next 可以跳过多个未通过的项。',
      ],
      examples: [
        ex('two-cursors', '两位审核员独立翻阅同一名单', '起步', `names = ["东", "西", "南"]
first = iter(names)
second = iter(names)
print(next(first), next(first))
print(next(second))
print(list(first))
print(next(first, "读完"), iter(first) is first)
`, "东 西\n东\n['南']\n读完 True\n", '区分容器内容和迭代器的读取位置。',
        ['两个对列表的 iter 调用得到独立游标。', '第一位读掉两项，第二位仍从东开始。', 'list(first) 收集剩余的南，之后 first 已耗尽。'], '赋值 second = first 只是同一迭代器的另一个名称，两个读者会共享进度。'),
        ex('source-versus-body', '观察建流与实际转换的两个时点', '应用', `def open_batch():
    print("取得批次")
    return [0, 2, 4]

def scale(value):
    print("换算", value)
    return value * 10

stream = (scale(x) for x in open_batch() if x > 0)
print("开始取")
print(next(stream))
print(list(stream), list(stream))
`, '取得批次\n开始取\n换算 2\n20\n换算 4\n[40] []\n', '通过输出追踪左侧来源和前部表达式何时运行。',
        ['创建 stream 时先调用 open_batch。', '第一次 next 跳过零，找到 2 才调用 scale。', '第一次 list 读完 4，第二次 list 已无剩余。'], '把生成器理解成所有代码都延迟。最左侧 in 后的来源已经在创建时计算。'),
      ],
    }, {
      title: '按需消费与空间取舍',
      explanation: [
        '列表推导式先计算全部结果，之后可以索引、取长度或重复遍历。生成器只保存暂停所需的迭代状态和当前相关对象，通常无需为整个结果分配列表空间。若来源已经是一个大列表，生成器仍然引用它。list(stream) 也会把剩余内容全部存入内存。',
        'sum 会读完所有结果；next 只取第一条匹配，any 找到第一个真值即可结束，all 找到第一个假值即可结束。空输入时 sum 为 0、any 为 False、all 为 True。业务规定必须有至少一条记录时，要额外检查为空。',
        '只要结果全部用到，生成器和列表版本通常执行同阶的转换。节省的是结果列表及可能不需要的后缀部分。需要保存全部结果以重复使用时可建列表，需要同时计算几种汇总时，用一次普通循环维护计数与合计通常更直观。',
      ],
      examples: [
        ex('short-circuit-checks', '告警出现就停止继续复核', '起步', `def is_alarm(number):
    print("查", number)
    return number >= 8

print(any(is_alarm(x) for x in [2, 8, 10]))
print(all(x >= 0 for x in []))
print(next((x for x in range(3) if x >= 3), "无"))
`, '查 2\n查 8\nTrue\nTrue\n无\n', '观察任何一个告警与空集规则，并用默认值报告未找到。',
        ['any 请求 2、8 的结果，看到真值就结束，不检查 10。', 'all 在空输入找不到反例，因此为真。', 'range(3) 没有任何值符合条件，next 返回默认标记。'], '把 any([is_alarm(x) for ...]) 传列表会在调用 any 前执行全部检查。'),
        ex('one-pass-totals', '单次遍历同时给出净额和记录数', '应用', `records = [("ok", 4), ("no", 2), ("ok", -1)]
amounts = (row[1] for row in records if row[0] == "ok")
print(sum(amounts), sum(amounts))

amounts = (row[1] for row in records if row[0] == "ok")
count = total = 0
for amount in amounts:
    total += amount
    count += 1
print(total, count)
`, '3 0\n3 2\n', '检查同一结果被消费两次的陷阱，并改成一次遍历。',
        ['第一次 sum 读完两笔净额。', '第二次 sum 收到耗尽的迭代器，结果为 0。', '重建生成器后，在同一轮循环同时维护和与条数。'], '把一次性迭代器传给两个汇总函数会让第二次汇总看到空数据。'),
      ],
    },
  ],
  comparisons: { headings: ['工具', '何时计算', '结果怎样使用'], rows: [
    ['列表推导式', '创建时完成全部结果', '可索引、可反复迭代'],
    ['生成器表达式', '先取最左侧来源，读取时再计算项', '按顺序且通常一次性'],
    ['普通循环', '每轮执行写明的步骤', '便于同时维护多个量与提前退出'],
  ] },
  applications: ['从大量记录中找首个匹配值，用 next 加默认值。', '计算汇总时先看后续是否需要重复读取同一批结果。只有汇总可逐项消费，需要明细和审计时可物化或一次维护所有统计量。'],
  mistakes: [
    { symptom: '第二次汇总突然为零', reason: '首个消费者已经读完迭代器。', fix: '来源可重读时重新建流，或在一次循环维护两种汇总。', check: '用两笔非零数据先运行两次 sum，再比较同一次循环的结果。' },
    { symptom: '查到首项超标仍扫描很久', reason: '判断之前先用列表推导式算完全部结果。', fix: '将生成器表达式直接传给 any 或 next。', check: '在转换函数里打印已访问项，用第一条就超标的输入观察。' },
  ],
  summary: ['可迭代对象可交给 iter，迭代器自己保存下一次读取位置。', '生成器按请求产出一项，耗尽的生成器不会自动重启。', '按需求值可节省结果内存和不必要的后续工作。按多次读取、访问方式及输出需求选择结构。'],
  next: '下一课把迭代产生的元组拆成各字段，用配对和位置生成更清晰的报表。',
  exercises: [
    q('gen-consumed', '追踪 next 之后还剩什么', '下面输出什么？', 2, [
      ['2 [2, 4]', '第一次 next 已经取走 2。'], ['[2, 4] 2', 'print 的实参从左到右求值。'], ['2 [4]', '先消费 2，剩余列表只有 4。'],
    ], 'g = (n * 2 for n in [1, 2])\nprint(next(g), list(g))', '2 [4]\n'),
    q('gen-source', '区分来源和结果表达式的求值时机', '创建 (convert(x) for x in get_rows()) 时，哪个调用已经发生？', 0, [
      ['get_rows()', '最左侧输入来源立即求值。'], ['convert(x)', '结果表达式等读取时才运行。'], ['两个调用都执行', '只有最左侧来源必须立即求值。'],
    ]),
    q('gen-any', '预测 any 的短路行为', '下面一共打印几行？', 1, [
      ['1 行', '转换函数也会为首条以及命中项打印。'], ['3 行', '读取 1 与 3，再打印 True。'], ['4 行', '命中 3 后不再读取 5。'],
    ], 'def ready(x):\n    print(x)\n    return x > 2\nprint(any(ready(x) for x in [1, 3, 5]))', '1\n3\nTrue\n'),
    q('gen-memory', '辨认逐项处理的空间条件', '逐行遍历文件并只汇总，不保存明细。为什么可以节省额外内存？', 2, [
      ['所有输入都自动压缩', '按需生成不压缩文件内容。'], ['sum 只读第一项', 'sum 需要读取每项。'], ['文件提供一行就处理一行，无需存储转换后的整份列表', '工作内存主要随当前行与迭代状态增长。'],
    ]),
    coding('A029', '基础编程', '用按需求和提取有效读数的净变化。'),
    coding('A030', '独立编程', '在很大的候选范围里按需取第一个合格编号。'),
    coding('A031', '综合应用', '一次迭代同时核对记录数、总额和异常数量。'),
    coding('A032', '拓展挑战', '推演迭代器被部分消费后，两个审核阶段的结果。'),
  ],
  references: [
    reference('迭代器', 'howto/functional.html#iterators', '核对 iter、next 与迭代器耗尽。'),
    reference('生成器表达式', 'reference/expressions.html#generator-expressions', '核对最左侧来源求值与其余部分按需执行。'),
    reference('内置函数', 'library/functions.html#any', '核对 any、all、next 和 sum 的消费规则。'),
  ],
};
