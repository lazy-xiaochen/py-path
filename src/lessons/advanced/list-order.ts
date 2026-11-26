import type { Chapter } from '../../teaching-types';
import { coding, example as ex, question as q, reference } from './authoring.ts';

export const listOrder: Chapter = {
  introduction: '一份队列同时记录着到达顺序、重复到访和临时插队。若直接排序，原始顺序会消失。本课先用合适的方法编辑队列，再按规则创建一个保留原数据的排名视图。',
  goals: ['根据是处理单项、展开一批、按位置还是按值来选择列表方法。', '保留原始名单并生成过滤、反转或排名结果。', '编写可解释的排序键，验证混合升降序与完全并列。'],
  prerequisites: '列表索引与切片、循环和函数 return。能区分改变原列表和创建新列表。',
  version: 'Python 3.12。排序稳定性属于 Python 保证。',
  topics: [
    {
      title: '增删、查找与筛选',
      explanation: [
        'append(x) 放入一个对象，x 即使是列表也只占一格。extend(xs) 逐项读取 xs 并追加，传入字符串会逐字符加入。insert(i, x) 把单个对象放在指定位置前面，后面的元素向后移动。',
        'remove(x) 按值删第一次命中，缺失抛 ValueError。pop(i) 按位置移除并返回元素，省略 i 时取末项，空表或越界抛 IndexError。del a[i] 或 del a[i:j] 按位置删除，适合不需要返回被删项的情况。',
        'count(x) 计算所有相等项；index(x, start, stop) 查指定半开区间的首次命中，返回原列表下标，缺失抛 ValueError。筛选时可在循环中把合格项加入新列表。边遍历边删原列表，后续元素左移，循环可能跳过刚移到当前位置的项。',
      ],
      examples: [
        ex('queue-edit', '更新设备领取队列', '起步', `queue = ["工牌", "灯"]
queue.append(["绳", "钩"])
queue.extend(["灯", "卡"])
queue.insert(1, "牌")
print(queue.count("灯"), queue.index("灯", 3))
queue.remove("灯")
picked = queue.pop(1)
del queue[-1:]
print(picked, queue)
`, "2 4\n牌 ['工牌', ['绳', '钩'], '灯']\n", '跟踪批次、重复值和删除后会移动的下标。',
        ['一盒彩绳和挂钩作为一个列表进入队列。', '领取牌插到位置 1，第二盏灯因此位于 4。', '按值只删第一盏，再按位置取牌并删除末尾卡片。'], 'remove 返回 None。需要知道取走的对象且手上有位置时用 pop。'),
        ex('filter-count', '筛出温度告警并统计', '应用', `readings = [15, 28, 28, 35, 18]
alerts = []
for temperature in readings:
    if temperature >= 28:
        alerts.append(temperature)
print(alerts, alerts.count(28))
print(len(alerts), sum(alerts))
`, '[28, 28, 35] 2\n3 91\n', '构造一份保留重复值和原顺序的报告。',
        ['逐条检查阈值。', '把合格读数逐项放进新表。', '区分等于阈值的数量、全部告警数和合计。'], '如果先转成 set，两条 28 会合并，统计的次数就变了。'),
      ],
    },
    {
      title: '反转、稳定排序与键函数',
      explanation: [
        'reverse() 原地交换前后位置，返回 None；reversed(a) 返回反向迭代器。迭代器记录读到哪一项，每次取下一项，读完就耗尽。可以用 list(...) 把剩余元素收集成新列表。反转只颠倒位置，与比较大小无关。',
        'a.sort() 原地重新排列列表，sorted(a) 读入给定数据并返回新列表。两者都接受 key=函数，函数为每条记录算一次比较用的键。key=score_key 传函数本身。lambda row: row[1] 是一个只返回表达式值的小函数，相当于 def score_key(row): return row[1]。',
        '元组按第一个位置、第二个位置依次比较，直到分出大小。因此 (-分数, 用时) 能先按分数降序、再按用时升序。reverse=True 倒转整个比较方向。相同键的记录保留输入先后，这就是稳定排序。若规则较多，也可从次要键到主要键逐次稳定排序。',
      ],
      examples: [
        ex('reverse-sort', '回放顺序与数值排序', '起步', `ids = [8, 3, 7]
backward = reversed(ids)
print(list(backward), list(backward))
print(sorted(ids), ids)
print(ids.reverse(), ids)
ids.sort()
print(ids)
`, '[7, 3, 8] []\n[3, 7, 8] [8, 3, 7]\nNone [7, 3, 8]\n[3, 7, 8]\n', '对照两种反转和两种排序的对象变化与返回值。',
        ['反向迭代器首次被 list 取完，第二次得到空表。', 'sorted 创建新表，原顺序保持。', 'reverse 和 sort 依次改变 ids 本身。'], '不要用 ids = ids.sort() 接收结果，否则名称会换绑到 None。'),
        ex('stable-ranking', '筛选并排序社区讲解员', '应用', `records = [("林", 90, 8), ("安", 90, 5), ("夏", 90, 5), ("陈", 65, 4)]
eligible = []
for record in records:
    if record[1] >= 80:
        eligible.append(record)

ranked = sorted(eligible, key=lambda row: (-row[1], row[2]))
for record in ranked:
    print(record[0])
print(records[0][0])
`, '安\n夏\n林\n林\n', '把混合升降序与稳定并列转成具体比较键。',
        ['筛掉低分者。', '三个合格者的键分别为 (-90, 8)、(-90, 5)、(-90, 5)。', '按用时将安和夏放到林前面，完全并列时保留安在先。'], '把 reverse=True 用在正的 (分数, 用时) 上会同时把用时改为降序。'),
      ],
    },
  ],
  comparisons: { headings: ['操作', '原列表', '返回结果'], rows: [
    ['sort()', '原地排序', 'None'], ['sorted(a)', '保留', '新顶层列表'],
    ['reverse()', '原地反转', 'None'], ['reversed(a)', '保留', '反向迭代器'],
  ] },
  applications: ['在日志或订单列表保留原始录入顺序，用 sorted 生成按严重度或优先级显示的副本。', '用 append 和 pop() 表示撤销栈。若经常从队首移除，可用 collections.deque 提供的双端队列。'],
  mistakes: [
    { symptom: '两个相邻重复值只删掉了第一个', reason: '遍历中删除使第二项左移，迭代位置继续前进。', fix: '遍历原表并建立新结果列表。', check: '用相邻两条无效记录测试。' },
    { symptom: '名次相同却被按姓名重排', reason: '排序键把姓名也作为第三项参与比较。', fix: '题面规定按录入顺序时，将姓名移出排序键。', check: '准备两条同分同用时且姓名逆序的记录。' },
  ],
  summary: ['通过参数和返回值区分增删方法。', '排序和反转处理的是不同规则，各自都有原地和返回结果的写法。', '用元组键写清优先级，用稳定排序处理完全并列。'],
  next: '下一课用字典把记录按编号和分组索引。',
  exercises: [
    q('order-batch', '区分追加单个对象与展开批次', '列表最后有几项？', 2, [
      ['2', 'extend 会把批次的两项各追加一次。'], ['4', 'append 的列表整体占一个位置。'], ['3', '第一项是列表，后两项是字符串。'],
    ], 'a = []\na.append(["A", "B"])\na.extend(["C", "D"])'),
    q('order-pop', '预测两次删除的结果', 'print 打印什么？', 0, [
      ['B [\'A\']', 'remove 删除最左的 A，pop 取出下标 0 的 B。'], ['A [\'B\']', 'remove 删除的是首次命中，先留下 B、A。'], ['None [\'A\']', 'pop 会返回被取出的元素。'],
    ], 'a = ["A", "B", "A"]\na.remove("A")\nprint(a.pop(0), a)', "B ['A']\n"),
    q('order-stable', '追踪稳定排序的并列规则', '哪个姓名先出现？', 1, [
      ['安', '姓名不在键里，不参与比较。'], ['林', '键相同，来自原表的先到记录优先。'], ['无法确定', 'Python 保证排序稳定。'],
    ], 'print(sorted([("林", 4), ("安", 4)], key=lambda row: row[1]))', "[('林', 4), ('安', 4)]\n"),
    q('order-key', '构造混合升降序的两级键', '分数高的在前，同分时用时短的在前。哪个键正确？', 2, [
      ['(score, time)', '分数会从低到高。'], ['(-score, -time)', '同分时较长用时的键更小。'], ['(-score, time)', '分数越大，第一项越小。第二项仍升序。'],
    ]),
    coding('A005', '基础编程', '按值撤销、按位置领取，并保留重复标签。'),
    coding('A006', '独立编程', '筛选排名资格并取稳定排名的第二项。'),
    coding('A007', '综合应用', '把原始记录和筛选排序后的报表分别输出。'),
    coding('A008', '拓展挑战', '按多个字段处理不同排序方向及并列。'),
  ],
  references: [
    reference('列表的更多操作', 'tutorial/datastructures.html#more-on-lists', '核查插入、删除和计数方法。'),
    reference('排序指南', 'howto/sorting.html', '查阅键函数、排序稳定性和多次排序。'),
    reference('reversed', 'library/functions.html#reversed', '核查反向迭代器的行为。'),
  ],
};
