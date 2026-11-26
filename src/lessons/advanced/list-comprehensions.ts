import type { Chapter } from '../../teaching-types';
import { coding, example as ex, question as q, reference } from './authoring.ts';

export const listComprehensions: Chapter = {
  introduction: '一批设备编号含空白、大小写混用和空行。以前可以用 for 逐项处理，再向结果列表 append。本课沿着那段循环推导出更紧凑的写法，明确哪些记录被丢弃，哪些记录只是换了值。',
  goals: ['把只负责收集结果的循环改写为列表推导式，并能逐步还原成 for 与 if。', '区分末尾的筛选条件和前部的条件表达式，预测结果的长度与顺序。', '面对要记录错误、重复计算或修改状态的任务，能判断何时保留普通循环。'],
  prerequisites: '数据结构进阶中的列表和条件筛选，以及基础篇字符串方法。能用 append 收集循环结果。',
  version: 'Python 3.12。列表推导式立即构造新列表，循环目标名称不会改绑同名的外部变量。',
  topics: [
    {
      title: '从 for 和 append 到推导式',
      explanation: [
        '可迭代对象能依次提供其元素，for 可以逐项读取它。列表提供元素，字符串提供字符，range 提供整数，字典默认提供键。能用于 for 的对象通常也能放在推导式的 in 后。',
        '[表达式 for 元素 in 来源] 建立一个新列表。先取得来源，再按遍历顺序绑定元素，逐次计算前面的表达式，并把结果收进列表。普通循环的 append(...) 里算什么，就把什么放到推导式前部。',
        '[表达式 for 元素 in 来源 if 条件] 对每项先检查条件，通过才求表达式。过滤失败的数据不会进入结果，也不会执行表达式。例如先检查 n != 0 再计算 12 / n，可以跳过零而不触发除零。',
      ],
      examples: [
        ex('loop-and-expression', '把有效温度转成温差', '起步', `values = [17, -1, 25, 17]
from_loop = []
for value in values:
    if value >= 0:
        from_loop.append(value - 20)
from_expression = [value - 20 for value in values if value >= 0]
print(from_loop, from_expression)
print(values)
`, '[-3, 5, -3] [-3, 5, -3]\n[17, -1, 25, 17]\n', '把原循环的筛选和 append 分别移到推导式对应位置。',
        ['读到 17，条件成立，把 17 - 20 放进结果。', '读到 -1，条件不成立，不执行减法。', '另两个有效值继续按原顺序收集，重复 17 保留。'], '改成集合推导式会让重复温差合并。'),
        ex('characters-from-string', '提取并归一化货架标记', '应用', `label = " A-2b c? "
letters = [char.upper() for char in label if char.isascii() and char.isalpha()]
print(letters)
print("".join(letters))
`, "['A', 'B', 'C']\nABC\n", '直接遍历字符串，并用两个条件确定哪些字符进入结果。',
        ['for 逐个读出字符，包括空格。', '先检查是否为 ASCII 字符，再检查是否为字母。', '只有通过两道筛选才求大写，最后可合并成一行。'], 'isalpha() 也接受许多非 ASCII 字母，若题目只接受英文字母，要明确字符范围。'),
      ],
    }, {
      title: '筛选控制条数，条件表达式控制产出的值',
      explanation: [
        '末尾的 if 负责是否产生结果。前部 a if 条件 else b 是条件表达式，先判断条件，再求被选中的一个分支。用它给每项贴标签，长度通常和输入一样。两种 if 能一起使用。先看尾部筛选是否通过，再决定产出哪个值。',
        '两个紧跟的筛选 if 都要成立。写成 if low <= x <= high and x != missing 同样可以先验证范围再排除缺测值。条件有便宜的检查与昂贵的转换时，按从左到右的短路顺序安排，避免不必要的工作。',
        '推导式适合表达「产生一个新容器」。如果要更新计数器、单独记录拒绝原因、跳出循环，或者一项要经历多步解析，使用普通 for 把操作步骤写出来。列表推导式会保存所有输出，减少几行代码不会改变算法增长率。',
      ],
      examples: [
        ex('filter-versus-label', '同一批订单生成两份清单', '起步', `orders = [-1, 0, 49, 50]
available = [x for x in orders if x >= 0]
labels = ["免运" if x >= 50 else "普通" for x in orders if x >= 0]
print(available)
print(labels)
`, "[0, 49, 50]\n['普通', '普通', '免运']\n", '区分停用数据被过滤与正常数据获得标签。',
        ['-1 被尾部 if 跳过。', '0 是有效订单，前部表达式选择普通。', '50 正好满足免运门槛，选中另一分支。'], '若只保留前部的条件表达式，停用订单也会被归到普通。'),
        ex('when-loop-is-clearer', '保留拒绝原因与合格数据', '应用', `entries = ["18", "停机", "-2", "21"]
accepted = []
rejected = []
for text in entries:
    try:
        value = int(text)
    except ValueError:
        rejected.append((text, "格式"))
        continue
    if value < 0:
        rejected.append((text, "范围"))
        continue
    accepted.append(value)
print(accepted)
print(rejected)
`, "[18, 21]\n[('停机', '格式'), ('-2', '范围')]\n", '处理有多种错误原因的输入，保留可以单独调试的流程。',
        ['尝试将每条文本转换为整数。', '格式错误和越界都记录，但理由不同。', '只有经过两道检查的值加入合格列表。'], '在推导式中调用两个会修改列表的函数，很难看清每条记录会去哪，且转换可能重复执行。'),
      ],
    },
  ],
  comparisons: { headings: ['写法', '每项的处理', '适用场景'], rows: [
    ['[expr for x in xs if ok]', '先判断，至多产出一项', '剔除无效记录'],
    ['[a if ok else b for x in xs]', '二选一，必产出一项', '完整保留顺序并逐项分级'],
    ['显式 for 循环', '可继续、退出、记录多个结果', '校验与多个副作用'],
  ] },
  applications: ['清洗传感器读数时分别描述有效性和单位变换。', '编制固定版式的名单时，缺失值可用条件表达式换成标记，避免行号错位。'],
  mistakes: [
    { symptom: '原来的列表有十行，标签表却只有六行', reason: '尾部 if 把四项去掉了。', fix: '需要逐行对应时，改用前部的条件表达式写出两种标签。', check: '空数据与全不满足条件时都检查结果长度。' },
    { symptom: '表达式偶尔因零值而停止', reason: '中间计算在确认分母合法之前执行了。', fix: '把判断写在筛选处，或用普通循环先验证。', check: '准备零值、刚达阈值和负数三种输入。' },
  ],
  summary: ['读法按实际执行排列：来源 → 循环目标 → 末尾条件 → 前部表达式。', '列表推导式立即生成可重复读、按序保留重复项的结果。', '先找出数据转换与筛选的边界，再决定是否改写成一行。'],
  next: '下一课把相同的执行思路用于构建字典、集合和多层结果。',
  exercises: [
    q('listcomp-iterable', '辨认可迭代对象产生的元素', '直接遍历 {"东": 3, "西": 2} 会依次取得什么？', 1, [
      ['3、2', '遍历字典的 values() 才取得这些值。'], ['东、西', '直接遍历字典按插入顺序给出键。'], ['两个键值对', '用 items() 才能迭代键值对。'],
    ]),
    q('listcomp-order', '追踪先筛选再计算', '代码输出什么？', 0, [
      ['[6, 3]', '零先被筛掉，只对 2 和 4 整除。'], ['触发 ZeroDivisionError', '计算只发生在通过筛选的项。'], ['[0, 6, 3]', '没有为零保留占位。'],
    ], 'print([12 // x for x in [0, 2, 4] if x != 0])', '[6, 3]\n'),
    q('listcomp-label', '追踪两处 if 的职责', '代码输出什么？', 2, [
      ['["L", "L", "H"]', '尾部条件过滤 -1。'], ['["H"]', '0 有资格进入结果。'], ["['L', 'H']", '过滤后保留 0 与 5，再分别选择标签。'],
    ], 'print(["H" if x >= 5 else "L" for x in [-1, 0, 5] if x >= 0])', "['L', 'H']\n"),
    q('listcomp-loop-choice', '选择适合诊断错误的写法', '解析每条记录，格式不合法时记录原因并继续。优先怎么写？', 1, [
      ['把错误写到末尾 if 的判断里', '条件判断通常不应同时修改错误列表。'], ['用 for，分别处理成功和失败', '每条记录的解析、异常与输出更容易定位。'], ['用前部条件表达式直接调用 int', '转换失败仍需要显式处理。'],
    ]),
    coding('A021', '基础编程', '筛选编号后统一格式，保留原来的出现顺序。'),
    coding('A022', '独立编程', '保留每条读数的位置，并为有效和缺测项选择不同表示。'),
    coding('A023', '综合应用', '将交易校验、符号转换与净额汇总组合起来。'),
    coding('A024', '拓展挑战', '区分校准前的有效范围与校准后的分级。'),
  ],
  references: [
    reference('列表推导式', 'tutorial/datastructures.html#list-comprehensions', '核对循环改写与先筛后算。'),
    reference('条件表达式', 'reference/expressions.html#conditional-expressions', '核对 if-else 只计算被选择的分支。'),
    reference('术语 iterable', 'glossary.html#term-iterable', '核对可迭代对象的含义。'),
  ],
};
