import type { Chapter } from '../../teaching-types';
import { coding, example as ex, question as q, reference } from './authoring.ts';

export const structureDesign: Chapter = {
  introduction: '迎新服务收到一份报名流水和一长串查询。要能回放事件、找出当前有效报名，又要避免每个查询都重扫名单。本课先用可数的比较次数感受规模，再按程序需要同时使用不同结构。',
  goals: ['从实际访问模式选择列表、字典、集合，说明各自保留的信息。', '从数据量和外层查询次数推导总工作量，区分平均、最坏和摊还。', '维护报名状态与顺序，独立实现并验收含撤销、重报和重复查询的程序。'],
  prerequisites: '本模块前四课。能使用位置、键、集合成员和循环维护状态。',
  version: '以下成本讨论以 CPython 3.12 的常用实现为背景，默认比较、哈希简单标识的成本固定，并忽略输入输出。',
  topics: [
    {
      title: '从一次查找推到整批查询',
      explanation: [
        '设名单长 n。列表按下标访问直接定位槽位，成本 O(1)，意思是主要工作不随 n 一起增长。只知道值时，列表需要依次比较。首项命中只比较一次，末项或缺失最多需要 n 次，最坏 O(n)。',
        '一个未命中查询扫 n 项，q 个这样的查询扫 n×q 项。若 q 与 n 同阶，名单翻倍且查询也翻倍，比较次数变为四倍，这就是平方增长 O(n²) 的直观含义。平均情况需要给出分布假设。例如命中位置均匀分布，成功查找平均扫约一半，仍然与 n 同阶。',
        'CPython 的字典与集合以哈希定位候选槽。哈希分布良好时，成员判断平均 O(1)。碰撞很多时可能检查大量槽，单次最坏 O(n)。建集合平均 O(n)，后续 q 次查询平均 O(q)，总成本平均 O(n+q)，同时为索引付出 O(n) 的额外空间上界。一次查询通常无需先建集合。键是长文本或比较本身昂贵时，还要计算每次哈希及相等比较的真实成本。',
      ],
      examples: [
        ex('count-comparisons', '用计数观察扫描增长', '起步', `def comparisons(n, query_count):
    roster = list(range(n))
    steps = 0
    for _ in range(query_count):
        for code in roster:
            steps += 1
            if code == -1:
                break
    return steps

print(comparisons(10, 10))
print(comparisons(20, 20))
print(comparisons(20, 1))
`, '100\n400\n20\n', '用同一组缺失查询观察增长率，避开计时噪声。',
        ['编号 -1 从未出现，所以每次扫描所有 n 个标识。', '名单和查询同时翻倍，总次数由 100 变成 400。', '只有一次查询时只比较 20 次。'], '把固定的 10 次查询也写成 O(n²)。此时只有 n 增长，复杂度是 O(n)。'),
        ex('membership-index', '一次建索引，多次检查', '应用', `roster = ["A5", "B2", "A5"]
has_access = set(roster)
queries = ["B2", "C1", "A5", "A5"]
matches = 0
for code in queries:
    if code in has_access:
        matches += 1
print(matches, len(has_access))
print(roster)
`, "3 2\n['A5', 'B2', 'A5']\n", '把索引建设成本和每个查询的成本分开。',
        ['建集时读取三条记录，得到两个成员。', '每个查询独立计数，两个 A5 查询都命中。', '保留原始列表，可继续审核出现次数或首现顺序。'], '对 queries 也去重会少计重复请求。索引和查询承担不同职责。'),
      ],
    },
    {
      title: '按访问模式分工，再计算修改成本',
      explanation: [
        '追加列表通常只填一个空位置，偶尔扩容要搬动整个外层的引用。把扩容分摊到一串连续追加上，每次摊还 O(1)，一次扩容仍可能 O(n)。摊还是给一串操作的总成本计账，跟按输入分布取平均不同。从列表中间插入或删除通常要挪动后续位置，最坏 O(n)。',
        '先写需要回答的问题。回放按时间顺序读列表；按编号取当前状态查字典；只问是否出现过，查集合；先判断是否重复再保留首现顺序，用集合配合列表。除非查询有明确收益，避免维护两份用途相同的状态。',
        '状态变更要明确何时成立。覆盖字典值保留注册位置，删除后重新报名会追加到当前顺序。若要同时提供历史和当前快照，可以用列表记事件，用字典记当前有效数据。索引直接引用可变记录时，要分清它指向当前状态还是独立快照。',
      ],
      examples: [
        ex('history-current', '区分报名流水与当前状态', '应用', `operations = [("join", "B"), ("join", "A"), ("drop", "B"), ("join", "B")]
history = []
current = {}
for time, operation in enumerate(operations, start=1):
    action, code = operation
    history.append((action, code))
    if action == "join":
        current[code] = time
    else:
        current.pop(code, None)
print(list(current.items()))
print(history[0], len(history))
`, "[('A', 2), ('B', 4)]\n('join', 'B') 4\n", '维护事件顺序与当前有效顺序两种不同信息。',
        ['列表记录所有事件。', '取消只从当前索引删除，对历史没有影响。', 'B 再报名时进入末尾，当前值是第 4 个事件的序号。'], '只记最后动作会失去重放流水的能力。'),
        ex('unique-notices', '按需去重通知，保留发出顺序', '应用', `names = {"B": "林", "A": "安"}
requests = ["A", "Z", "A", "B"]
sent = set()
report = []
for code in requests:
    if code in names and code not in sent:
        sent.add(code)
        report.append(names[code])
print(report)
`, "['安', '林']\n", '组合映射、成员判断和顺序记录。',
        ['字典校验编号且提供显示名。', '集合只记录成功发过的编号。', '列表保留真实通知顺序。'], '用显示名判重会误把同名的两位用户当作一个。'),
      ],
    },
  ],
  comparisons: { headings: ['需求', '典型成本', '成本条件'], rows: [
    ['列表按下标读取', 'O(1)', '直接定位槽位'],
    ['列表按值找成员', '最坏 O(n)', '未命中会检查全部元素'],
    ['字典键或集合成员查找', '平均 O(1)，最坏 O(n)', '平均依赖哈希分布，假设键操作成本固定'],
    ['连续追加到列表', '摊还 O(1) 每次', '少数扩容操作承担移动成本'],
    ['对 n 项排序', '最坏 O(n log n) 次比较', '键计算及每次比较的成本另计'],
  ] },
  applications: ['在检票前批量建立集合以快速处理大量扫描。若只有一条查询，先估算建索引和直接扫描各需要多少工作。', '为重放、查状态和输出报表分别保留所需信息，并用含重复、失败和重试的事件流做回归。'],
  mistakes: [
    { symptom: '为每条查询重新把同一名单转成集合', reason: '建索引放在循环内部，每次都要扫描名单。', fix: '数据不变时，把索引建设移到查询之前。', check: '记录集合构造次数，静态名单只构造一次。' },
    { symptom: '学员取消后又报名，却排在旧位置', reason: '只覆盖状态，键从未离开字典。', fix: '按业务要求删除旧键，之后再插入。', check: '加入 B、加入 A、取消 B、再加入 B，输出顺序应为 A、B。' },
  ],
  summary: ['先数每次工作，再乘请求次数。区分哈希查找的平均成本与动态数组追加的摊还成本。', '用列表表达顺序，用字典表达关联，用集合表达唯一成员。一个程序可以为不同访问模式选多种结构。'],
  next: '完成阶段测评后，试着写一份自己的数据结构选择理由。推导式与解包模块将把已掌握的循环构造写成更紧凑的表达式。',
  exercises: [
    q('design-single', '手推重复查询的扫描工作量', '下面会输出多少次相等比较？', 2, [
      ['3', '一次缺失查询扫描三项，第二次也要扫描。'], ['9', '仅有两次查询，每次扫描三项。'], ['6', '两个目标都不存在，内层各扫描三项。'],
    ], 'checks = 0\nfor target in [9, 6]:\n    for code in [1, 2, 3]:\n        checks += 1\n        if code == target:\n            break\nprint(checks)', '6\n'),
    q('design-amortized', '理解追加的摊还成本', '连续 append 的每次摊还 O(1) 表示什么？', 0, [
      ['少数操作较贵，按整串追加均摊仍为常数级', '扩容的成本通过一串追加分摊。'], ['每次都严格花同样时间', '扩容和普通追加的代价可能明显不同。'], ['列表越长，所有单次追加都越慢', '有备用槽时只需填一个位置。'],
    ]),
    q('design-count', '判断需要映射还是单纯成员判断', '需要回答「这一行设备编号出现过几次」。最直接的索引是什么？', 1, [
      ['set[编号]', '集合能表示是否出现，不能直接保存次数。'], ['dict[编号] → 次数', '用同一个键定位并累加。'], ['每次从列表数一遍', '可以计算，但多次查询会反复扫描。'],
    ]),
    q('design-hash', '区分哈希平均和最坏时间', '何时不能把字典查找当成必然只做固定次数比较？', 2, [
      ['只有空字典时', '有数据时也可能发生大量碰撞。'], ['只在 Python 2', '这里讨论的是 CPython 3.12 的常见实现。'], ['很多不同键的哈希碰撞时', '查找可能探查多个候选槽；极端时随条目数增长。'],
    ]),
    coding('A017', '基础编程', '批量判断通行请求，正确处理重复查询和原名单空行。'),
    coding('A018', '独立编程', '建立编号索引并保留重复记录的覆盖规则。'),
    coding('A019', '综合应用', '用已经读过的记录解答跨组配对查询。'),
    coding('A020', '拓展挑战', '完成数据结构模块测评，维护按场次分组的报名和顺序。'),
  ],
  references: [
    reference('设计 FAQ', 'faq/design.html#how-are-dictionaries-implemented-in-cpython', '了解字典哈希表的实现背景。'),
    reference('列表与队列', 'tutorial/datastructures.html#using-lists-as-queues', '核对从列表头部操作时的搬移成本。'),
    { title: 'CPython 操作成本', url: 'https://github.com/python/cpython/blob/main/Doc/builtins/time-complexity.rst', note: '核对列表操作的摊还成本与哈希结构平均成本的适用条件。' },
  ],
};
