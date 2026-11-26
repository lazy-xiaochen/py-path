import type { Chapter } from '../../teaching-types';
import { coding, example as ex, question as q, reference } from './authoring.ts';

export const recursiveDesign: Chapter = {
  introduction: '有序表能排除一半候选；目录由子目录和文件组成；斐波那契的两个分支却可能反复询问同一个数。三者都能用递归表达，工作量却取决于子问题的形状和是否重叠。',
  prerequisites: '调用栈、递归终止、排序和字典，熟悉函数关键字参数与装饰器读法。',
  version: 'Python 3.12。示例中的复杂度按访问次数或整数运算次数计算，长整数运算的代价另计。',
  goals: ['用半开区间实现递归二分，能检查空区间、重复值和边界。', '按结构遍历嵌套目录，返回可合并的汇总值，估算节点数与深度的影响。', '用记忆化消除重复子问题，并比较递归、迭代和缓存所需空间。'],
  topics: [
    {
      title: '分治定位和树结构递归',
      explanation: [
        '分治把问题拆成较小的子问题。递归二分是每次仅处理一个较小区间的查找。对升序表寻找第一个不小于 target 的位置，让候选范围为 [left, right)。mid 不满足时排除它及左侧，下一段是 [mid+1, right)；满足时下一段是 [left, mid)。最终 left == right，该位置可能是表尾。',
        '树可以表达零个或多个子节点组成的层次。文件或其他没有子节点的数据常按叶子处理；目录可能有空的子节点列表。若返回每个子树的大小和文件数，目录层可以把子结果相加。每个节点只访问一次时，时间随节点数增长，递归栈随树的最大深度增长。',
        '进入节点时处理叫先序，完成子节点后处理叫后序。要按进入顺序展示、按离开顺序算总量，可以进入时记录序号或预留行，离开时填入结果。目录很深或输入深度不可信时，可用显式栈控制状态。',
      ],
      examples: [
        ex('design-interval', '递归找第一个大于等于目标的位置', '起步', `def lower_bound(values, target, left, right):
    if left == right:
        return left
    mid = (left + right) // 2
    if values[mid] < target:
        return lower_bound(values, target, mid + 1, right)
    return lower_bound(values, target, left, mid)

numbers = [2, 4, 4, 9]
print(lower_bound(numbers, 4, 0, len(numbers)))
print(lower_bound(numbers, 8, 0, len(numbers)))
print(lower_bound(numbers, 10, 0, len(numbers)))
`, '1\n3\n4\n', '在重复值、组间空隙和表尾手推半开区间变化。',
        ['找 4 时中间遇到相等值，仍向左收缩。', '找 8 时最后收缩到 9 的位置。', '找 10 时返回长度 4，此位置不应继续索引。'],
        '将左区间写成 [left, mid+1) 会在某些单元素区间不再缩小。'),
        ex('design-tree', '汇总小目录的字节数和文件数量', '应用', `def summarize(node):
    if isinstance(node, int):
        return node, 1
    size = count = 0
    for child in node:
        part, files = summarize(child)
        size += part
        count += files
    return size, count

print(summarize([4, [0, 3], []]))
print(summarize([]))
`, '(7, 3)\n(0, 0)\n', '每个分支返回同形状的汇总，空目录也能合并。',
        ['整数是一个文件，零字节仍算一份。', '子目录 [0, 3] 返回 (3, 2)。', '空目录返回 (0, 0)，根只需要相加各子结果。'],
        'if not node 会把零字节文件和空目录一起判为空，应先看节点类型。'),
        ex('design-json-tree', '从一行 JSON 画树，再从叶子汇总', '应用', `import json

text = '["R", [["zero", 0], ["A", [["note", 4]]], ["B", []]]]'
root = json.loads(text)
print(type(text).__name__, type(root).__name__)
print(root[0], type(root[1]).__name__)

def totals(node):
    name, content = node
    if isinstance(content, int):
        return content, 1
    size = count = 0
    for child in content:
        child_size, child_count = totals(child)
        size += child_size
        count += child_count
    print(name, size, count)
    return size, count

print("TOTAL", *totals(root))
`, 'str list\nR list\nA 4 1\nB 0 0\nR 4 2\nTOTAL 4 2\n',
        'JSON 把嵌套数组写成一行文本。json.loads 把字符串转换成 Python 对象。在 stdin 题可把 text 替换为 input()。从文件读时可以先用 file.read()，再把所得文本交给 json.loads。',
        ['先在纸上画 R，其下依次写 zero、A、B。A 下再连 note，B 下无子节点。把整数标在文件旁，目录旁写 [] 或子节点名。',
          '从下往上标返回值。zero 返回 (0, 1)，note 返回 (4, 1)，所以 A 返回 (4, 1)。B 没有子节点，返回 (0, 0)。R 对三个子结果分别相加，得到 (4, 2)。',
          'A063 把目录的第一个字段当作启用标记。用 enabled, children = node 解包，先判断停用，再决定要不要访问孩子。A064 像这里一样解包名称与内容，进入目录时记下行序，返回时回填统计。上面的打印用于观察返回顺序。'],
        '输入中的双引号属于 JSON。直接遍历 input() 读到的是单个字符。解析后，用整数类型区分文件和目录，避免把 0 字节文件误判成空目录。'),
      ],
    },
    {
      title: '重复子问题、记忆化与迭代',
      explanation: [
        'F(n)=F(n-1)+F(n-2) 的朴素递归会在不同分支重复计算同一个 F(k)，调用数随 n 指数增长。把已经算出的参数和结果保存在字典，下次直接查表，这就是记忆化。functools.cache 提供这种模式，参数须可哈希，相同参数应始终产生同样结果。',
        '记忆化把斐波那契的不同子问题降到 n+1 个，仍要保留结果与递归调用栈。若只求从低到高的一个值或末尾值，可用两个滚动变量从 F(0)、F(1) 向上计算。若要反复查询任意已算索引，也可以提前建表。',
        '状态参与结果时，缓存键要覆盖所有相关输入。比如费率每次变动，就把费率作为参数，或在变动时清理缓存。cache 默认不设上限，连续处理大量独立数据时要计划释放或限制缓存。',
      ],
      examples: [
        ex('design-memo-count', '用计数比较两种斐波那契写法', '应用', `from functools import cache

def make_fib(remember):
    calls = 0
    def fib(n):
        nonlocal calls
        calls += 1
        if n < 2:
            return n
        return fib(n - 1) + fib(n - 2)
    if remember:
        fib = cache(fib)
    return fib, lambda: calls

plain, plain_calls = make_fib(False)
saved, saved_calls = make_fib(True)
print(plain(8), plain_calls())
print(saved(8), saved_calls())
print(saved(7), saved_calls())
`, '21 67\n21 9\n13 9\n', '区分函数入口调用与真正进入被缓存函数体的次数。',
        ['朴素计算八号项重复访问较小项，共进入 67 次。', '缓存版每个 n 的函数体最多执行一次，共 9 次。', '之后询问 7 命中缓存，函数体计数不再增加。'],
        'cache 缓存的是参数对应的结果。被缓存函数体中的打印或计数不会因命中而再次执行。'),
        ex('design-explicit-stack', '显式栈保留项目树的先序', '应用', `tree = ("根", [("A", [("X", [])]), ("B", [])])
pending = [tree]
order = []
while pending:
    name, children = pending.pop()
    order.append(name)
    pending.extend(reversed(children))
print(" ".join(order))
`, '根 A X B\n', '把未处理节点移到自己维护的栈。',
        ['弹出根后，孩子反序入栈，A 在栈顶。', '先访问 A 的后代 X，再访问 B。', '树很深时，这个循环不依赖 Python 的递归深度。'],
        '若按原顺序把孩子逐个入栈，最后一个孩子会先被处理。'),
      ],
    },
  ],
  comparisons: { headings: ['形状', '典型操作次数', '额外空间'], rows: [
    ['二分只走一支', 'O(log n) 次比较', 'O(log n) 栈帧'],
    ['树节点各访问一次', 'O(n) 次访问', 'O(h) 栈帧，h 为深度'],
    ['斐波那契带缓存', 'O(n) 次状态计算', 'O(n) 条缓存与 O(n) 栈帧'],
    ['斐波那契滚动计算', 'O(n) 次加法', 'O(1) 个计数变量，同时受整数长度影响'],
  ] },
  applications: ['输入已经有序时定位可插入边界，使重复键得到可预测的定位。', '树形报表把先序展示和后序汇总分开，并分别测试零文件、空目录和最大深度。'],
  mistakes: [
    { symptom: '目标在表尾时发生越界', reason: '二分返回的是插入位置，允许等于长度。', fix: '需要精确匹配时先验索引小于长度，再看该值是否等于目标。', check: '测试空表和大于最大值的目标。' },
    { symptom: '规则变了却重复返回旧值', reason: '配置参与结果，却未纳入缓存键。', fix: '将配置放入参数，或在规则变化时重置缓存。', check: '用相同数据和不同费率各计算一次。' },
  ],
  summary: ['二分每步缩小候选区间；树递归从各个子节点合并答案。', '记忆化适合确定且重叠的子问题；滚动迭代适合只需少量前序结果的序列。', '分析时区分访问次数、栈深、缓存大小和整数长度。'],
  next: '先完成目录配额的阶段测评。下一模块将用类来组织状态和操作规则。',
  exercises: [
    q('design-mid', '核对半开区间被排除后怎样收缩', 'mid 项小于 target，下一段候选是什么？', 1, [
      ['[left, mid)', '这会丢掉更大的右侧。'], ['[mid+1, right)', 'mid 和前面都不可能达到门槛。'], ['[mid, right)', '仍保留已被排除的 mid，可能停止缩小。'],
    ]),
    q('design-empty-directory', '区分零字节文件和空目录', '目录内容为 [0, []]，总字节、文件数是多少？', 2, [
      ['0、0', '整数 0 表示一份文件。'], ['0、2', '空目录没有文件。'], ['0、1', '零字节文件计数，空目录不增加计数。'],
    ]),
    q('design-cache-hit', '辨认缓存命中时是否执行原函数', '代码输出什么？', 0, [
      ['算 3，随后打印 6 6', '同一参数第二次命中缓存。'], ['算 3 出现两次', '第二次返回缓存值。'], ['只输出 6 6', '首次仍需要执行函数体。'],
    ], 'from functools import cache\n@cache\ndef f(n):\n    print("算", n)\n    return n * 2\nprint(f(3), f(3))', '算 3\n6 6\n'),
    q('design-depth', '估算树递归的峰值深度', '两棵树都有 100 个节点。一棵只有根和一层孩子，另一棵是一条长链，哪棵需要更多递归帧？', 1, [
      ['只有一层孩子的树', '子调用逐个完成，兄弟节点不会同时留在栈上。'], ['长链', '每一层等待下一个节点，深度可达 100。'], ['两棵都相同', '总访问数相同，峰值同时活跃的层数不同。'],
    ]),
    coding('A061', '基础编程', '核对最早出现或可插入的位置。自动评测检查定位结果，递归区间的缩小过程请自行画出。'),
    coding('A062', '独立编程', '复用多次斐波那契查询的子结果。'),
    coding('A063', '综合应用', '剪去停用目录分支并合并子树指标。'),
    coding('A064', '拓展挑战', '完成完整目录报表，核验先序顺序与后序累加。'),
  ],
  references: [
    reference('json.loads 与类型转换', 'library/json.html#json.loads', '核对 JSON 数组和数字怎样转换成 Python 列表和整数。'),
    reference('bisect 的左边界', 'library/bisect.html#bisect.bisect_left', '核对插入位置与重复值语义。'),
    reference('functools.cache', 'library/functools.html#functools.cache', '核对按参数复用计算和缓存上限。'),
    reference('调用深度限制', 'library/sys.html#sys.getrecursionlimit', '区分调用深度与数据总量。'),
  ],
};
