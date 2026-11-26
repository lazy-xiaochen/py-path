import type { Chapter } from '../../teaching-types';
import { coding, example as ex, question as q, reference } from './authoring.ts';

export const mappingComprehensions: Chapter = {
  introduction: '同一批展区记录可以变成查询表、唯一名单或分组报表。你需要决定每条记录产出键值对、唯一成员还是一个保留位置的元素，再安排多层循环的顺序。',
  goals: ['用字典推导式构建、筛选和转换映射，预测重复键的覆盖时机。', '用集合推导式在转换后去重，区别计数和收集唯一成员。', '将多层推导式还原成循环，判断保留行边界、展开数据还是采用普通循环。'],
  prerequisites: '本模块列表推导式和上一模块的字典、集合。方括号访问元组项用法与列表索引相同。',
  version: 'Python 3.12。字典推导式先计算键再计算值，这一求值顺序从 Python 3.8 起有语言保证。',
  topics: [
    {
      title: '从记录生成键值和唯一成员',
      explanation: [
        '{键表达式: 值表达式 for item in rows if 条件} 先筛选记录，再计算键和值，最后把这对内容写入新字典。一个键多次出现时，最后通过筛选的值获胜，但键位置仍是首次写入的位置。若要按最新状态筛选，应先收齐最新值，再筛选字典。',
        '{表达式 for item in rows if 条件} 产出集合。转换发生在去重前，所以 "A" 和 "a" 转为小写后可以合并。集合元素和字典键必须可哈希，字典值可以是列表等可变对象。需要确定输出顺序时，用 sorted 或另存顺序。',
        '把编号映射成数量时可以用推导式转换；如果多个记录属于同一个编号且要累计，用循环更新计数。{word: words.count(word) for word in set(words)} 虽然能数对，但每个不同词要重扫整份列表。更好的做法是一次计数，再用字典推导式生成频次达到门槛的报告。',
      ],
      examples: [
        ex('last-write-filter', '比较先筛事件与先取最新记录', '起步', `rows = [("A", 5), ("B", 2), ("A", 0), ("C", 3)]
ever_positive = {row[0]: row[1] for row in rows if row[1] > 0}
latest = {row[0]: row[1] for row in rows}
available = {code: latest[code] for code in latest if latest[code] > 0}
print(list(ever_positive.items()))
print(list(available.items()))
`, "[('A', 5), ('B', 2), ('C', 3)]\n[('B', 2), ('C', 3)]\n", '比较有撤回或零库存更新时，两种业务语义的实际区别。',
        ['先筛会略过 A 的零值更新，A 仍出现在旧结果。', '先写全量时 0 覆盖 5。', '筛选最终映射后 A 消失，B 与 C 的顺序仍可预测。'], '报表描述「当前可用」时，筛选必须发生在覆盖之后。'),
        ex('unique-and-counted', '分别列出唯一标签与频次报告', '应用', `raw = [" Red ", "blue", "RED", "", " green "]
names = [name.strip().lower() for name in raw if name.strip()]
unique = {name for name in names}
counts = {}
for name in names:
    counts[name] = counts.get(name, 0) + 1
repeated = {name: counts[name] for name in counts if counts[name] > 1}
print(sorted(unique))
print(repeated)
`, "['blue', 'green', 'red']\n{'red': 2}\n", '区分规范化、去重与累计三步。',
        ['去空白和转小写后统一标签。', '集合只保存不同标签。', '对仍保有重复记录的列表计数，再从映射输出重复项。'], '先把输入全部转成集合就无法恢复每项的出现次数。'),
      ],
    }, {
      title: '多层循环与嵌套结果',
      explanation: [
        '[expr for row in rows for value in row if ok] 对应外层逐行、内层逐项、最里层筛选和产出。每换一行都会重新开始内层。筛选可以放在依赖的名称一旦获得的位置，例如先筛行，再走内层元素。',
        '[[expr for value in row] for row in rows] 的外层每次产出一个列表，行边界仍在。若输出要按原来的列组织，外层可以遍历列号，内层遍历行，再取每行的该列。这就是转置的基本思路。非整齐表必须决定缺项、填充或拒绝策略。',
        '复杂表达式先写普通双循环，手推一行中的两个元素和第二行的首项，再考虑压缩。涉及多次查表、读写状态或三个以上嵌套时，可以先命名中间结果。构成所有组合也可能将时间和输出大小扩大为两份数据量的乘积。',
      ],
      diagram: { caption: '从左向右确定嵌套顺序', text: `for row in rows          从第一行开始
  if row                 先判断这一行
    for value in row     每行重新遍历
      if value > 0
        收集 value × 2` },
      examples: [
        ex('flat-and-grouped', '展开库存与保留库房行', '起步', `rows = [[0, 4], [], [2, 0, 3]]
flat = [value * 2 for row in rows for value in row if value > 0]
from_loop = []
for row in rows:
    for value in row:
        if value > 0:
            from_loop.append(value * 2)
grouped = [[value * 2 for value in row if value > 0] for row in rows]
print(flat)
print(flat == from_loop)
print(grouped)
`, '[8, 4, 6]\nTrue\n[[8], [], [4, 6]]\n', '对同一份不规则二维数据生成两种结构，并验算双层循环的等价结果。',
        ['第一行只产出 8，第二行没有内层元素。', '普通循环和展开推导式都把标量追加到同一份列表。', '嵌套版将每行自己的列表作为外层的一项，空行仍在。'], '把内层列表拆掉会让行边界消失。'),
        ex('matrix-by-column', '把按设备记录的表转成按日期记录', '应用', `devices = [[7, 0, 2], [3, 4, 9]]
columns = [[row[col] for row in devices] for col in range(3)]
print(columns)
print({number: values for number, values in enumerate(columns, 1)})
`, '[[7, 3], [0, 4], [2, 9]]\n{1: [7, 3], 2: [0, 4], 3: [2, 9]}\n', '用外层决定报告次序，内层沿原行取值。',
        ['外层先定 col 为 0，然后遍历两个设备行。', '第一列收集两次 row[0]，形成 [7, 3]。', '每列重复这个过程，再给各日期列表编号。enumerate 会同时提供从 1 开始的序号与对应值，解包写法将在第四课系统讲解。'],
        '外层如果先遍历设备，就仍按设备组织，只是在复制原表。'),
      ],
    },
  ],
  comparisons: { headings: ['形式', '产出单元', '适用位置'], rows: [
    ['{key: value for ...}', '键值对，后值覆盖', '索引、字段变换与报告'],
    ['{expr for ...}', '唯一元素', '归一化去重'],
    ['[expr for row in rows for ...]', '各行的标量进一张表', '展开'],
    ['[[expr for ...] for row in rows]', '每行先生成自己的列表', '保持层次或调整行列'],
  ] },
  applications: ['生成站点编码到最新库存的映射，以及同一批数据的唯一类别清单。', '按批次与工位拆分多层结果。先写出期望的外层顺序，再决定推导式中谁先循环。'],
  mistakes: [
    { symptom: '报告里保留了已经撤回的条目', reason: '零值在参与重复键覆盖之前被筛掉。', fix: '先构造最新映射，再在结果上做筛选。', check: '用某键先正后零与先零后正作对照。' },
    { symptom: '遍历顺序与预期相反', reason: '把应作为内层的循环提前。', fix: '先写双层 for，逐层核对目标名称定义和产出顺序。', check: '用带空行且行宽不等的小数据手推。' },
  ],
  summary: ['容器类型决定重复与顺序语义。字典保存键值关系，集合按产出值去重。', '推导式中的 for 和尾部 if 从左向右对应嵌套的循环与判断。', '累计需要多次读写状态时，先用循环构造频次，再用推导式产生报告。'],
  next: '下一课保留这种表达式结构，把结果改成按需产生。',
  exercises: [
    q('mapcomp-overwrite', '检查重复键覆盖', '代码输出什么？', 1, [
      ["{'A': 2, 'B': 7}", 'A 的最后一项覆盖第一次写入。'], ["{'A': 0, 'B': 7}", 'A 保持插入位置，值更新为 0。'], ["{'B': 7, 'A': 0}", '更新已有键不改变它的顺序。'],
    ], 'rows = [("A", 2), ("B", 7), ("A", 0)]\nprint({row[0]: row[1] for row in rows})', "{'A': 0, 'B': 7}\n"),
    q('mapcomp-set-key', '理解转换后集合去重', '代码输出什么？', 2, [
      ['3', '原来有三个不同拼法，转小写后会合并。'], ['1', 'X 仍是另一个成员。'], ['2', '得到 ab 和 x 两个成员。'],
    ], 'print(len({word.lower() for word in ["Ab", "ab", "X"]}))', '2\n'),
    q('mapcomp-inner-order', '推演两层循环的输出顺序', '先产出哪两对值？', 0, [
      ['(1, 8) 和 (1, 9)', '外层停在 1 时内层已经取遍 8、9。'], ['(1, 8) 和 (2, 8)', '这要求先把 y 放在外层。'], ['(2, 9) 和 (1, 8)', '推导式按给定顺序遍历。'],
    ], 'print([(x, y) for x in [1, 2] for y in [8, 9]])', '[(1, 8), (1, 9), (2, 8), (2, 9)]\n'),
    q('mapcomp-choose-count', '判断计数时是否应丢弃重复信息', '统计出现至少 3 次的标签，应该怎样组织？', 2, [
      ['用集合归一化后再数', '一旦去重，无法得知原频次。'], ['逐种标签执行 input 列表的 count', '能做对，但每种标签都重扫。'], ['一次遍历累加，再筛选频次字典', '保留频次且只需要一次计数扫描。'],
    ]),
    coding('A025', '基础编程', '按版本与到达顺序解决冲突，再按阈值构造报表。'),
    coding('A026', '独立编程', '先标准化、再按条件收集唯一预约代号。'),
    coding('A027', '综合应用', '一次计数，再用映射筛选获最高票的候选。'),
    coding('A028', '拓展挑战', '按行列重组不规则输入，并为缺失位置填充。'),
  ],
  references: [
    reference('列表、集合和字典的显示式', 'reference/expressions.html#displays-for-lists-sets-and-dictionaries', '核对多层从句、键值求值顺序和覆盖规则。'),
    reference('嵌套列表推导式', 'tutorial/datastructures.html#nested-list-comprehensions', '对照循环与按列构造的新结构。'),
    reference('字典插入顺序', 'library/stdtypes.html#mapping-types-dict', '核对更新值和删除后重插的顺序。'),
  ],
};
