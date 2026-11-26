import type { Chapter } from '../../teaching-types';
import { coding, example, question, reference } from './authoring.ts';

export const listReferences: Chapter = {
  introduction: '你要给两组工作人员各发一份可编辑的排班表。复制变量后，第一组修改了自己的表，第二组却也看到了变更。本课从这次事故出发，区分修改对象、换绑名称和复制容器，再用切片编写局部编辑操作。',
  goals: ['画出名称、外层列表与内层列表的指向，预测修改会影响谁。', '算出任意正步长或负步长切片覆盖的位置，并能替换或删除它们。', '根据数据的嵌套层数，选择浅拷贝、逐行复制或深拷贝来隔离修改。'],
  prerequisites: '基础篇列表、循环和函数。二维表只需理解为若干行，每一行本身也是列表。',
  version: 'Python 3.12。图中的箭头表示对象引用，不代表实际内存地址。',
  topics: [
    {
      title: '名称、对象与可变性',
      explanation: [
        '一个对象具有身份、类型和值。名称是代码中用来找到对象的标记。执行 b = a 时，Python 先找到 a 指向的对象，再让 b 指向同一个对象。这两个名称互为别名。a is b 检查身份，a == b 检查值是否相等。',
        '可变指对象的内容可以原地改变。a[0] = 7 会修改原有列表的一个位置；a = [7] 会创建一个新列表并让 a 改指它。列表的每个位置保存对元素对象的引用。元组也保存引用，但创建后不能替换其中的位置。如果位置里装着列表，那个内层列表仍然可以变。',
        '二维列表是外层列表中的每个位置各指向一行。连续访问 grid[r][c]，会先取到第 r 行，再取那一行第 c 项。每行可以有不同长度，所以列索引必须依据当前行。',
      ],
      diagram: { caption: '第一次赋值与浅拷贝后的对象关系', text: `board ───┐
alias ───┴──→ 外层 A [0] ──┐
draft ──────→ 外层 B [0] ──┴──→ 内层 R ["早", "晚"]

alias[0].append("中")   走到 R 改内容，A 与 B 都能看到
draft[0] = ["休"]       只替换 B 的箭头，A 仍指向 R` },
      examples: [
        example('name-binding', '排班名单的别名与换绑', '起步', `board = ["早", "晚"]
alias = board
alias.append("中")
print(board is alias, board)
alias = board + ["休"]
print(board is alias, board == alias)
print(alias)
`, "True ['早', '晚', '中']\nFalse False\n['早', '晚', '中', '休']\n",
        '观察同一个列表被两个名称引用时，原地修改和换绑的不同影响。',
        ['b = a 式赋值建立第二个指向。', 'append 修改原对象，board 读到新增项。', '列表相加创建新列表，此后 alias 指向它。'],
        '把 alias = board 当成备份。需要独立顶层时应明确复制。'),
        example('tuples-hold-references', '固定字段中的可变记录', '应用', `members = ["林"]
shift = ("早班", members)
members.append("安")
print(shift[0], shift[1])
print(shift[1] is members)
`, "早班 ['林', '安']\nTrue\n", '区分元组位置不可改与位置指向的对象可改。',
        ['元组的第 0 项标识班次。', '第 1 项指向 members 所指列表。', '追加成员只改变该列表，元组的两个位置仍指向原对象。'],
        '认为把列表装进元组就能冻结成员。若要固定成员序列，可以显式建立 tuple(members)。'),
      ],
    },
    {
      title: '切片选择、替换和删除',
      explanation: [
        'a[start:stop:step] 从 start 出发，按非零步长 step 取位置，stop 不包含。正步长缺省从头到尾，负步长缺省从尾到头。负索引从末尾换算，例如 -1 指向最后一项。负步长省略 stop 能走过位置 0，显式写 -1 则表示最后一项这个边界。',
        '右侧的列表切片返回新外层列表。左侧 a[i:j] = rows 会替换原对象的一段，步长为 1 时可以变长或变短。若步长不为 1，替换项数必须与被选位置数一致。del a[i:j:k] 可以按同一组选中的位置删除。超出范围的切片边界会裁剪，单独索引越界仍会报错。',
      ],
      examples: [
        example('slice-edit', '按区间修订节目单', '起步', `shows = ["A", "B", "C", "D", "E"]
print(shows[4:0:-2], shows[2::-1])
shows[1:3] = ["X"]
shows[::2] = ["首", "中"]
del shows[-1:]
print(shows)
`, "['E', 'C'] ['C', 'B', 'A']\n['首', 'X', '中']\n", '在同一份节目单上执行三种切片编辑。',
        ['第一种反向选择访问位置 4、2；第二种还访问位置 0。', '用一个元素替换原来的两个，长度变为 4。', '只替换位置 0、2，再删掉末项。'],
        '写 shows[::2] = ["首"] 会报 ValueError，因为选中的位置数是 2。'),
        example('nested-copy', '隔离两个方案里的备注', '应用', `from copy import deepcopy

board = [[["早"]], [["晚"]]]
shallow = board.copy()
rows = []
for row in board:
    rows.append(row.copy())
safe = deepcopy(board)
safe[0][0].append("独立")
rows[0][0].append("共享")
shallow[1] = [["新行"]]
print(board, shallow)
print(rows, safe)
`, "[[['早', '共享']], [['晚']]] [[['早', '共享']], [['新行']]]\n[[['早', '共享']], [['晚']]] [[['早', '独立']], [['晚']]]\n",
        '用三层结构观察逐行复制的边界，选择能够隔离备注的复制方式。',
        ['list.copy() 只新建最外层；切片 [:] 和标准库 copy.copy(board) 也可做浅拷贝。', '逐行复制又新建一层，第三层备注依然共享。', 'deepcopy 递归复制本例的嵌套可变列表，并记住已复制的对象，从而保留副本内部原有的共享关系。'],
        '一律用深拷贝会复制不需要独立的内容。先画出写入位置，再决定需要复制几层。'),
        example('independent-rows', '避免重复引用同一行', '应用', `from copy import deepcopy

shared = [[0, 0]] * 2
independent = []
for _ in range(2):
    independent.append([0, 0])
shared[0][1] = 7
independent[0][1] = 7
print(shared, shared[0] is shared[1])
print(independent, independent[0] is independent[1])
cloned = deepcopy(shared)
print(cloned[0] is cloned[1], cloned[0] is shared[0])
`, '[[0, 7], [0, 7]] True\n[[0, 7], [0, 0]] False\nTrue False\n', '对照重复一个行引用与逐行创建各自的行。',
        ['乘法重复引用，两个位置指向一行。循环每次运行列表字面量，得到不同的行。', '各修改第一行的同一个位置，比较另一行是否也变了。', '深拷贝让副本拥有自己的行对象，但共用一行的两个位置在副本中仍共用那一行。'],
        '用 deepcopy 修复共享行会保留副本内部的共享关系。要让每行独立，必须分别创建或复制每行。'),
      ],
    },
  ],
  comparisons: { headings: ['写法', '建立的对象', '适用场景'], rows: [
    ['b = a', '沿用原列表', '两处需要共同编辑同一份数据'],
    ['b = a.copy() 或 a[:]', '一个新外层，元素仍沿用', '只更改外层顺序或替换槽位'],
    ['deepcopy(a)', '递归复制支持深拷贝的内容', '需要独立修改多层可变数据'],
  ] },
  applications: ['模拟座位方案时为每一行建立独立列表。修改某一格后，核对其他行以及原方案的对应格。', '编辑长列表的一段时，先用切片试读将受影响的项目，再修改原列表。'],
  mistakes: [
    { symptom: '改了第一行，所有行都变了', reason: '[[0] * cols] * rows 重复引用同一个行列表。', fix: '在循环中每次创建一行，例如 grid.append([0] * cols)。', check: '用 grid[0] is grid[1] 核对两行的身份。' },
    { symptom: '流程里清空了副本，却也丢了原数据', reason: '副本名称仍与原数据共享同一个外层列表。', fix: '在只改外层时使用浅拷贝，在修改嵌套对象前检查内层共享。', check: '用两个名称分别打印结果，并沿修改位置逐层做身份比较。' },
  ],
  summary: ['赋值绑定名称。对象内容改变时，所有仍指向该对象的名称都能看到新内容。', '切片按步长挑选位置，边界 stop 永远不包含。', '复制前先画出写入路径，尤其注意乘法生成的重复引用。'],
  next: '下一课把列表用于可撤回的编辑和多条件排序。',
  exercises: [
    question('list-identity', '区分相等和同一对象', '下面两个布尔值依次是什么？', 1, [
      ['True False', '两份独立列表的内容相同。'], ['False True', '切片建立新外层，列表中的整数值相等。'], ['True True', '只有共享的对象才通过 is。'],
    ], 'a = [1, 2]\nb = a[:]\nprint(a is b, a == b)', 'False True\n'),
    question('list-negative', '手推负步长与边界', '反向切片选中了哪些元素？', 2, [
      ['[5, 3]', '下一次下标为 0，仍在省略边界的范围内。'], ['[4, 2, 0]', '从实际末项 5 起步。'], ['[5, 3, 1]', '下标 4、2、0 被依次选中。'],
    ], 'print([1, 2, 3, 4, 5][::-2])', '[5, 3, 1]\n'),
    question('list-tuple', '识别元组中共享的可变对象', '执行后 t[1] 的值是什么？', 0, [
      ['[7, 8]', 'append 改的是列表的内容，元组槽位保持原样。'], ['[7]', '建立元组时没有复制 row。'], ['引发 TypeError', '代码没有给 t[1] 赋值。'],
    ], 'row = [7]\nt = (1, row)\nrow.append(8)'),
    question('list-extend-slice', '判断扩展切片赋值长度', '怎样一次替换下标 0、2 并保留其余位置？', 1, [
      ['a[:2] = [8, 9]', '连续切片修改位置 0、1。'], ['a[::2] = [8, 9]', '步长 2 选两个位置，右侧长度正好匹配。'], ['a[::2] = [8]', '步长不为 1 时两侧长度必须一致。'],
    ], 'a = [1, 2, 3, 4]'),
    coding('A001', '基础编程', '从零基半开区间中提取预览，再用新片段替换。'),
    coding('A002', '独立编程', '按行复制座位图，在副本中独立处理编辑。'),
    coding('A003', '综合应用', '用独立的嵌套副本维护多份现场配置。'),
    coding('A004', '拓展挑战', '将相同结构的三种对象关系变成可对照的回归输出。'),
  ],
  references: [
    reference('对象、值和类型', 'reference/datamodel.html#objects-values-and-types', '核对对象身份和可变性。'),
    reference('可变序列操作', 'library/stdtypes.html#mutable-sequence-types', '核对切片赋值、删除和复制。'),
    reference('copy 模块', 'library/copy.html', '核对浅拷贝与深拷贝对内部对象的处理。'),
  ],
};
