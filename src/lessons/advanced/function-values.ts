import type { Chapter } from '../../teaching-types';
import { coding, example as ex, question as q, reference } from './authoring.ts';

export const functionValues: Chapter = {
  introduction: '同一批货件有时按费用排序，有时按重量排序，也可能要先过滤再换算。把变化的规则当成函数对象，可以让一段共同的遍历代码服务多种规则。',
  prerequisites: '函数签名、稳定排序、列表推导式，以及迭代器的消费方式。',
  version: 'Python 3.12。',
  goals: ['区分引用函数与立即调用，读出函数参数的作用。', '用回调统一筛选或换算流程，分别用 def 和 lambda 实现规则。', '比较 map、filter 和推导式的可读性、求值方式与输出形状。'],
  topics: [
    {
      title: '函数可以像数据一样传递',
      explanation: [
        '函数是一等对象，能赋值给其他名称、作为实参传入、放进字典，也能由函数返回。calculate 是函数对象，calculate(...) 立即执行并得到一个结果。将回调传入后，接收者会在它规定的时机，用它掌握的数据调用该函数。',
        '接收函数或返回函数的函数称为高阶函数。调用约定必须说清楚。例如传给 sorted 的 key 接收一条记录并返回排序键，传给筛选流程的 predicate 接收一项并返回可判断真假的值。为同一流程替换另一个规则，只需要遵守相同的调用约定。',
        'lambda 参数: 表达式 创建一个函数，调用时计算并返回表达式的值。一次性短规则适合 lambda。分支较多、需多步处理或复用的规则可用带名字的 def 便于调试与测试。',
      ],
      examples: [
        ex('values-select-rule', '一个分拣流程选择两种计费规则', '起步', `def doubled(x):
    return x * 2

def apply(rule, values):
    return [rule(value) for value in values]

rules = {"双倍": doubled, "少一": lambda x: x - 1}
print(apply(rules["双倍"], [2, 4]))
print(apply(rules["少一"], [2, 4]))
`, '[4, 8]\n[1, 3]\n', '将规则放进字典，再由统一流程调用。',
        ['rules 的值是函数对象。', 'apply 收到规则后在遍历中逐项调用。', '替换字典里的键，就会使用另一个相同签名的规则。'],
        '在映射里提前写 doubled(2) 会存入整数，之后无法将该值当成函数调用。'),
        ex('values-return-function', '挑选用于整批报表的比较键', '应用', `def by_weight(row):
    return row[1]

def choose_key(mode):
    if mode == "weight":
        return by_weight
    return lambda row: row[0]

rows = [("Z", 1), ("A", 3), ("B", 1)]
print(sorted(rows, key=choose_key("weight")))
print(sorted(rows, key=choose_key("code")))
`, "[('Z', 1), ('B', 1), ('A', 3)]\n[('A', 3), ('B', 1), ('Z', 1)]\n", '挑选并返回函数对象，让 sorted 决定何时调用。',
        ['choose_key 依据模式返回一个函数。', 'sorted 将每条记录交给选定的键函数。', '相同重量的记录仍保留原相对顺序。'],
        '把 sorted 结果写成排序键会传错类型，key 需要接收单条记录的可调用对象。'),
      ],
    },
    {
      title: 'map 转换，filter 保留',
      explanation: [
        'map(transform, values) 建立按需迭代器，读取时逐项调用 transform 并产生转换结果。filter(predicate, values) 则按需判断每项，产生通过测试的原项。filter(None, values) 按元素自身的真值筛选，零和空字符串也会被去掉。',
        '两者都保存消费进度。list(...) 会收集剩余结果，sum(...) 可以直接汇总。已有带名字的转换函数时 map 很直接；筛选和表达式都依赖当前字段时，推导式常更清楚。需要提前停止或同时统计多种量时，可用普通循环。',
      ],
      examples: [
        ex('values-map-filter', '解析读数并保留合法零值', '起步', `raw = ["-2", "0", "6"]
values = map(int, raw)
accepted = filter(lambda value: value >= 0, values)
print(list(accepted))
print(list(values))
parsed = (int(text) for text in raw)
print([value for value in parsed if value >= 0])
`, '[0, 6]\n[]\n[0, 6]\n', '区分转换、筛选和消费的先后。',
        ['map 在取值时完成文本转整数。', 'filter 检查值并保留 0、6。', '第一个 list 已通过 filter 耗尽 values。'],
        'filter(None, ...) 会漏掉业务上合法的 0。先解析数值还能正确处理 -0 这样的输入文本。'),
        ex('values-compose', '将检验条件与报告转换分开传入', '应用', `def collect(rows, *, keep, format_row):
    return [format_row(row) for row in rows if keep(row)]

rows = [("A", 0), ("B", 5), ("C", -1)]
result = collect(rows, keep=lambda row: row[1] >= 0,
                 format_row=lambda row: f"{row[0]}:{row[1]}")
print(result)
`, "['A:0', 'B:5']\n", '把筛选与转换当成两个独立策略。',
        ['collect 先把每行交给 keep 判断。', '通过时才把同一条数据交给 format_row。', '两个策略都接收行记录，但各自的返回值用途不同。'],
        '如果先转换成字符串再按 row[1] 取数，拿到的只会是字符串的第二个字符。'),
      ],
    },
  ],
  comparisons: { headings: ['工具', '产生什么', '读取时机'], rows: [
    ['map', '规则返回的值', '迭代时转换'], ['filter', '通过测试的原值', '迭代时筛选'],
    ['列表推导式', '通过筛选后的转换值', '创建时生成整张表'],
  ] },
  applications: ['把稳定排序、校验或导出规则作为可替换参数传入。', '从用户选定的规则名查找预先定义的函数，按顺序执行同一套规则。'],
  mistakes: [
    { symptom: '把规则传给流程时提示整数不可调用', reason: '写了 rule(...)，传入的是本次计算的整数。', fix: '传 rule 本身，让流程在获得待处理数据时调用。', check: '用一笔和两笔记录分别测试。' },
    { symptom: '看得到第一次转换却无法复查', reason: 'map 或 filter 的迭代器已经耗尽。', fix: '要重复读取时存为列表，或从原始可重复来源重新构造。', check: '将同一个 iter 对象交给 list 两次。' },
  ],
  summary: ['函数名指向可调用的对象，带括号才发起调用。', '给共享遍历注入清晰的小规则，分别测试流程与规则。', 'map、filter 按需运行，必要时再物化结果。'],
  next: '当返回的函数要保留创建时的配置或状态，就需要理解闭包和名称查找。',
  exercises: [
    q('values-call', '区分函数对象和调用结果', '要让 sorted 对每条记录执行 weigh，怎样传入？', 1, [
      ['key=weigh(row)', '提前调用一次会交出某个比较值。'], ['key=weigh', 'sorted 将逐条传入记录。'], ['key="weigh"', '字符串不提供对记录的计算。'],
    ]),
    q('values-output', '预测 filter 保留的是哪些对象', '代码输出什么？', 2, [
      ['[True, False, True]', 'filter 产出通过检查的原对象。'], ['[1]', '0 也满足非负条件。'], ['[0, 1]', '0 和 1 通过，-1 被跳过。'],
    ], 'print(list(filter(lambda x: x >= 0, [0, -1, 1])))', '[0, 1]\n'),
    q('values-exhaust', '跟踪转换迭代器的读取位置', '下面输出什么？', 0, [
      ['2 [3]', 'next 取走 2，随后只剩 3。'], ['2 [2, 3]', 'list 从当前进度开始。'], ['发生 TypeError', 'map 返回一个可供 next 读取的迭代器。'],
    ], 'items = map(int, ["2", "3"])\nprint(next(items), list(items))', '2 [3]\n'),
    q('values-contract', '判断回调的参数契约', '流程每次给 predicate 一个记录元组。哪个规则满足签名？', 1, [
      ['lambda: True', '它不接收记录实参。'], ['lambda row: row[1] >= 0', '单个参数与流程相符。'], ['lambda name, value: value >= 0', '流程只传了一个元组，要在规则体内取字段。'],
    ]),
    coding('A045', '基础编程', '按指定规则批量换算读数。'),
    coding('A046', '独立编程', '用可替换的筛选规则输出原始记录。'),
    coding('A047', '综合应用', '选择排序键并保证同键记录稳定。'),
    coding('A048', '拓展挑战', '把若干函数接成可配置的转换管道。'),
  ],
  references: [
    reference('lambda 表达式', 'tutorial/controlflow.html#lambda-expressions', '核对表达式函数的语法。'),
    reference('内置 map', 'library/functions.html#map', '核对逐项调用和迭代器。'),
    reference('内置 filter', 'library/functions.html#filter', '核对过滤与真值。'),
  ],
};
