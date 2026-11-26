import type { Chapter } from '../../teaching-types';
import { coding, example as ex, question as q, reference } from './authoring.ts';

export const dictIndexes: Chapter = {
  introduction: '工作人员要按编号找物资、按库房列物资，还要把当天的更新合并到旧清单。这个场景把字典当作随数据更新的索引，能看到顺序、缺键和共享值怎样影响报表。',
  goals: ['判断哪些组合值可以作为键，并说明键相等时为何只保留一个条目。', '预测字典视图、加键、更新和重插后的内容及顺序。', '用计数、分组和嵌套索引实现多种查询并正确处理缺键。'],
  prerequisites: '基础篇字典、函数和循环，以及前两课的对象引用与列表操作。',
  version: 'Python 3.12。插入顺序从 Python 3.7 起是语言保证，合并符号 | 和 |= 自 3.9 提供。',
  topics: [
    {
      title: '键、顺序、视图与遍历',
      explanation: [
        '列表按位置取值，字典按唯一的键取值。可哈希对象具有生命周期内稳定的哈希值，相等对象必须具有相同哈希值。哈希把对象映射到整数，供解释器缩小查找范围；不同对象也可以给出相同的整数，这时还需要比较相等性。相等的键共享一个条目，例如 1 和 True 相等，写入两次只保留最新的值。',
        '整数、字符串以及所有成员均可哈希的元组可以作键。Python 的 list 类型刻意不提供哈希，其按内容比较且内容可以改变。',
        'd.keys()、d.values()、d.items() 返回视图。视图提供访问原字典的方式，源字典更新后，通过现有视图重新访问就能看到变化。list(d.items()) 则立即取得键值对列表，之后添加键不会扩大它，但列表里仍可能引用同一个可变值。',
        'for key in d 默认遍历键，d.values() 给值，d.items() 每次给一个 (键, 值) 元组。已有键换值不移动位置；删除再插入会进入末尾。遍历活动视图时增删条目可能触发 RuntimeError 或漏读。需要删键时可先用 list(d) 固定待扫描的键。',
      ],
      examples: [
        ex('views-order', '追踪校区索引的两种视图', '起步', `rooms = {("东", 1): 0, ("西", 1): 5}
live = rooms.keys()
snapshot = list(live)
rooms[("东", 1)] = 7
rooms[("北", 2)] = 4
del rooms[("西", 1)]
rooms[("西", 1)] = 2
print(list(live))
print(snapshot)
print(list(rooms.values()))
`, "[('东', 1), ('北', 2), ('西', 1)]\n[('东', 1), ('西', 1)]\n[7, 4, 2]\n", '用复合键索引库房，并核对视图和快照。',
        ['复合键的两个成员都是可哈希对象。', '东校区换值时位置不动，北校区追加到末尾。', '西校区删除后重插，活动视图显示新顺序，快照保留原键序列。'], '试图用 ["东", 1] 作键会报 TypeError。可用 ("东", 1) 表示固定组合。'),
        ex('filter-mapping', '从库存中筛出可领取物资', '应用', `stock = {"灯": 2, "伞": 0, "水": 4}
available = {}
for key, number in stock.items():
    if number > 0:
        available[key] = number
print(list(available.items()))
print(stock.get("伞", -1), stock.get("绳", -1))
`, "[('灯', 2), ('水', 4)]\n0 -1\n", '构建新映射，为后续字典推导式建立普通循环模型。',
        ['遍历时一组条目提供一个键和一个数量。', '保留满足数量条件的条目，把决定写入新字典。', '伞已存在且为 0，绳缺失才会返回 -1。'], 'if stock.get(key) 会同时排除缺键和零值。要区分两者，使用 key in stock 或独立默认值。'),
        ex('dispatch-frequency', '统计无线电口令频次', '应用', `words = "Go wait go hold go".lower().split()
counts = {}
for word in words:
    counts[word] = counts.get(word, 0) + 1
for word in counts:
    print(word, counts[word])
`, 'go 3\nwait 1\nhold 1\n', '先统一大小写，再维护每个口令的累计次数。',
        ['把 Go、go 归一成同一个字符串。', '首次查表返回 0，累加后写入已有次数。', '迭代键时按首次出现顺序输出，频数变动不会移动已有键。'],
        '用 counts[word] = 1 会覆盖以前的计数。用 words.count(word) 对所有不同词逐个查，会重复扫描数据。'),
      ],
    },
    {
      title: '读写方法、浅合并与嵌套索引',
      explanation: [
        'get(k, default) 读取并按需返回默认值。setdefault(k, default) 在缺键时插入默认值，再返回实际值，因此常用于 d.setdefault(group, []).append(item)。写在调用里的 [] 每次先求值，键已存在时新列表会被丢弃。若把同一个外部列表作为默认值传给不同键，各组会共享它。',
        'update(other) 和 |= 修改原字典，右侧同名键覆盖左侧值。left | right 创建新外层字典，也由右侧赢得冲突。合并只处理顶层，两个同名键的嵌套值会整项替换。若要按子键合并，需要按层设计。pop(k, default) 按键移除并返回值；popitem() 取走最近插入的一对，空字典抛 KeyError；clear() 原地清空，别名也会观察到。',
        '分组可用字典套列表，保留组里多条记录。快速精确访问可用字典套字典，例如 by_site[site][code]。列表中存字典适合保留数据行顺序及重复行。可以建索引让字典值直接指向这些数据行，更新同一行时就要考虑共享影响。',
      ],
      examples: [
        ex('dict-merge', '合并两份班次设置', '起步', `base = {"班次": {"起": 9, "止": 18}, "状态": "开放"}
local = {"班次": {"起": 10}, "负责人": "林"}
merged = base | local
print(merged["班次"], base["班次"])
base.update({"状态": "关闭"})
print(base.pop("未知", "缺键"), base.popitem())
alias = base
base.clear()
print(alias)
`, "{'起': 10} {'起': 9, '止': 18}\n缺键 ('状态', '关闭')\n{}\n", '追踪整项覆盖、更新顺序与清空别名。',
        ['合并时右侧的班次值整个取代左侧值。', '更新状态没有改变插入位置，popitem 仍取最后插入的状态。', 'clear 修改原字典，alias 读取到空内容。'], '若需要保留「止」，应先合并内层班次字典，再把合并结果放回外层。'),
        ex('dict-group-index', '同一批物资建立分组和编号索引', '应用', `rows = [{"区": "东", "号": "A", "量": 3}, {"区": "西", "号": "A", "量": 1},
        {"区": "东", "号": "B", "量": 0}]
groups = {}
lookup = {}
for row in rows:
    site = row["区"]
    code = row["号"]
    groups.setdefault(site, []).append(code)
    lookup.setdefault(site, {})[code] = row
lookup["东"]["A"]["量"] += 2
print(groups, rows[0]["量"])
`, "{'东': ['A', 'B'], '西': ['A']} 5\n", '同时按区列编号并用两级索引变更一条记录。',
        ['每区按录入顺序保留编号列表。', '为区内编号保存完整行的引用，同号不同区互不覆盖。', '通过索引修改行后，原始 rows 看到同一个行的变化。'], '只有组名和编号共同唯一，单用编号作键会让西区 A 覆盖东区 A。'),
      ],
    },
  ],
  comparisons: { headings: ['操作', '缺键或冲突时', '是否修改原字典'], rows: [
    ['get(k, x)', '缺键返回 x', '否'], ['setdefault(k, x)', '缺键插入 x', '可能'],
    ['update(patch)', '右侧同名键覆盖', '是'], ['base | patch', '右侧同名键覆盖', '否，新建外层'],
  ] },
  applications: ['词频计数可写 counts[word] = counts.get(word, 0) + 1。分组清单要保留每条原记录，用列表作组值。', '库房系统可选择 (校区, 编号) 复合键，或选择先按校区再按编号的两级字典。需要逐校区遍历时，后者更方便。'],
  mistakes: [
    { symptom: '删除低库存项时遍历中断', reason: '循环读的是活动视图，字典大小同时在改变。', fix: '保存 list(stock) 后遍历该列表，或直接构造一个新字典。', check: '准备两条都需删除的记录和一条应保留的记录。' },
    { symptom: '修改默认配置影响了另一个字典', reason: '浅合并重用了没有被替换的嵌套值。', fix: '需要独立修改时，复制相应嵌套层或使用深拷贝。', check: '合并后修改子字段，再检查源对象。' },
  ],
  summary: ['用键检索且为每个键维护一个值。复合键的每个组成部分都必须可哈希。', '视图跟随原字典，快照只冻结当时收集的条目引用。', '选择分组列表或嵌套索引时，先写出查询问题，然后决定键和值。'],
  next: '下一课处理只关心成员是否存在的名单，并比较集合关系。',
  exercises: [
    q('dict-key', '判断复合键是否可哈希', '哪一个对象可作为字典键？', 2, [
      ['["东", 1]', '列表没有可用的哈希。'], ['("东", [1])', '元组的列表成员不可哈希。'], ['("东", 1)', '两个成员均可哈希，因此该元组可哈希。'],
    ]),
    q('dict-view', '手推活动视图和重插顺序', '程序会打印什么？', 0, [
      ["['B', 'A']", '删除后重插 A，活动视图跟随更新。'], ["['A', 'B']", '只有覆盖已有键才保留原位置。'], ["['B']", '视图重新读取时也会看到 A 回来。'],
    ], 'd = {"A": 0, "B": 1}\nv = d.keys()\nd.pop("A")\nd["A"] = 2\nprint(list(v))', "['B', 'A']\n"),
    q('dict-default', '区分读取默认值与插入默认值', '输出是什么？', 1, [
      ['0 0', 'setdefault 会补上缺失的键。'], ['0 1', 'get 只读，setdefault 把默认值写入。'], ['1 1', 'get 不新增键。'],
    ], 'd = {}\nd.get("A", [])\nprint(len(d), end=" ")\nd.setdefault("B", [])\nprint(len(d))', '0 1\n'),
    q('dict-shallow', '预测嵌套值的合并范围', '怎样保留原有的「止」值？', 2, [
      ['直接 base | extra', '同名顶层键的值整项覆盖。'], ['直接 base.update(extra)', 'update 仍然只合并顶层。'], ['先合并两个「班次」内层字典', '显式合并同一个层级，再写回外层。'],
    ], 'base = {"班次": {"起": 9, "止": 18}}\nextra = {"班次": {"起": 10}}'),
    coding('A009', '基础编程', '维护表的插入顺序和撤销记录。'),
    coding('A010', '独立编程', '积累净词频并按首次出现规则决胜。'),
    coding('A011', '综合应用', '按多个组处理清单并输出分组统计。'),
    coding('A012', '拓展挑战', '用两层索引响应更新与读取并区分缺失和零。'),
  ],
  references: [
    reference('字典类型', 'library/stdtypes.html#mapping-types-dict', '核对读写、合并和插入顺序。'),
    reference('字典视图', 'library/stdtypes.html#dictionary-view-objects', '核对视图的动态行为和遍历限制。'),
    reference('可哈希', 'glossary.html#term-hashable', '核对哈希值、相等与作为字典键的条件。'),
  ],
};
