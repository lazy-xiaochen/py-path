const o=["列表与引用","列表编辑与排序","字典视图与索引","集合与关系","结构选择与复杂度"],l=["列表推导式","字典与集合推导式","迭代器与生成器","记录与参数解包"],i=["参数绑定与默认值","函数签名","函数对象与回调","作用域与闭包","装饰器","调用栈与递归","分治与记忆化"],b=["类与对象","属性与方法","封装与属性校验","继承与 MRO","多态与组合","特殊方法与数据类","管理系统设计"],r=(a,p,c)=>({title:a,url:"https://docs.python.org/3.12/"+p,note:c});function e(a,p,c,m,d,A,_,O){return{id:a,title:p,level:c,source:m,input:"",output:d,purpose:A,steps:_,pitfall:O}}function s(a,p,c,m,d,A,_=""){return{kind:"question",id:"advanced-"+a,goal:p,prompt:c,answer:m,options:d.map(([O,E])=>({label:O,feedback:E})),...A?{demonstration:{source:A,input:"",output:_}}:{}}}const n=(a,p,c)=>({kind:"coding",problem:a,level:p,goal:c}),ee={introduction:"你要给两组工作人员各发一份可编辑的排班表。复制变量后，第一组修改了自己的表，第二组却也看到了变更。本课从这次事故出发，区分修改对象、换绑名称和复制容器，再用切片编写局部编辑操作。",goals:["画出名称、外层列表与内层列表的指向，预测修改会影响谁。","算出任意正步长或负步长切片覆盖的位置，并能替换或删除它们。","根据数据的嵌套层数，选择浅拷贝、逐行复制或深拷贝来隔离修改。"],prerequisites:"基础篇列表、循环和函数。二维表只需理解为若干行，每一行本身也是列表。",version:"Python 3.12。图中的箭头表示对象引用，不代表实际内存地址。",topics:[{title:"名称、对象与可变性",explanation:["一个对象具有身份、类型和值。名称是代码中用来找到对象的标记。执行 b = a 时，Python 先找到 a 指向的对象，再让 b 指向同一个对象。这两个名称互为别名。a is b 检查身份，a == b 检查值是否相等。","可变指对象的内容可以原地改变。a[0] = 7 会修改原有列表的一个位置；a = [7] 会创建一个新列表并让 a 改指它。列表的每个位置保存对元素对象的引用。元组也保存引用，但创建后不能替换其中的位置。如果位置里装着列表，那个内层列表仍然可以变。","二维列表是外层列表中的每个位置各指向一行。连续访问 grid[r][c]，会先取到第 r 行，再取那一行第 c 项。每行可以有不同长度，所以列索引必须依据当前行。"],diagram:{caption:"第一次赋值与浅拷贝后的对象关系",text:`board ───┐
alias ───┴──→ 外层 A [0] ──┐
draft ──────→ 外层 B [0] ──┴──→ 内层 R ["早", "晚"]

alias[0].append("中")   走到 R 改内容，A 与 B 都能看到
draft[0] = ["休"]       只替换 B 的箭头，A 仍指向 R`},examples:[e("name-binding","排班名单的别名与换绑","起步",`board = ["早", "晚"]
alias = board
alias.append("中")
print(board is alias, board)
alias = board + ["休"]
print(board is alias, board == alias)
print(alias)
`,`True ['早', '晚', '中']
False False
['早', '晚', '中', '休']
`,"观察同一个列表被两个名称引用时，原地修改和换绑的不同影响。",["b = a 式赋值建立第二个指向。","append 修改原对象，board 读到新增项。","列表相加创建新列表，此后 alias 指向它。"],"把 alias = board 当成备份。需要独立顶层时应明确复制。"),e("tuples-hold-references","固定字段中的可变记录","应用",`members = ["林"]
shift = ("早班", members)
members.append("安")
print(shift[0], shift[1])
print(shift[1] is members)
`,`早班 ['林', '安']
True
`,"区分元组位置不可改与位置指向的对象可改。",["元组的第 0 项标识班次。","第 1 项指向 members 所指列表。","追加成员只改变该列表，元组的两个位置仍指向原对象。"],"认为把列表装进元组就能冻结成员。若要固定成员序列，可以显式建立 tuple(members)。")]},{title:"切片选择、替换和删除",explanation:["a[start:stop:step] 从 start 出发，按非零步长 step 取位置，stop 不包含。正步长缺省从头到尾，负步长缺省从尾到头。负索引从末尾换算，例如 -1 指向最后一项。负步长省略 stop 能走过位置 0，显式写 -1 则表示最后一项这个边界。","右侧的列表切片返回新外层列表。左侧 a[i:j] = rows 会替换原对象的一段，步长为 1 时可以变长或变短。若步长不为 1，替换项数必须与被选位置数一致。del a[i:j:k] 可以按同一组选中的位置删除。超出范围的切片边界会裁剪，单独索引越界仍会报错。"],examples:[e("slice-edit","按区间修订节目单","起步",`shows = ["A", "B", "C", "D", "E"]
print(shows[4:0:-2], shows[2::-1])
shows[1:3] = ["X"]
shows[::2] = ["首", "中"]
del shows[-1:]
print(shows)
`,`['E', 'C'] ['C', 'B', 'A']
['首', 'X', '中']
`,"在同一份节目单上执行三种切片编辑。",["第一种反向选择访问位置 4、2；第二种还访问位置 0。","用一个元素替换原来的两个，长度变为 4。","只替换位置 0、2，再删掉末项。"],'写 shows[::2] = ["首"] 会报 ValueError，因为选中的位置数是 2。'),e("nested-copy","隔离两个方案里的备注","应用",`from copy import deepcopy

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
`,`[[['早', '共享']], [['晚']]] [[['早', '共享']], [['新行']]]
[[['早', '共享']], [['晚']]] [[['早', '独立']], [['晚']]]
`,"用三层结构观察逐行复制的边界，选择能够隔离备注的复制方式。",["list.copy() 只新建最外层；切片 [:] 和标准库 copy.copy(board) 也可做浅拷贝。","逐行复制又新建一层，第三层备注依然共享。","deepcopy 递归复制本例的嵌套可变列表，并记住已复制的对象，从而保留副本内部原有的共享关系。"],"一律用深拷贝会复制不需要独立的内容。先画出写入位置，再决定需要复制几层。"),e("independent-rows","避免重复引用同一行","应用",`from copy import deepcopy

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
`,`[[0, 7], [0, 7]] True
[[0, 7], [0, 0]] False
True False
`,"对照重复一个行引用与逐行创建各自的行。",["乘法重复引用，两个位置指向一行。循环每次运行列表字面量，得到不同的行。","各修改第一行的同一个位置，比较另一行是否也变了。","深拷贝让副本拥有自己的行对象，但共用一行的两个位置在副本中仍共用那一行。"],"用 deepcopy 修复共享行会保留副本内部的共享关系。要让每行独立，必须分别创建或复制每行。")]}],comparisons:{headings:["写法","建立的对象","适用场景"],rows:[["b = a","沿用原列表","两处需要共同编辑同一份数据"],["b = a.copy() 或 a[:]","一个新外层，元素仍沿用","只更改外层顺序或替换槽位"],["deepcopy(a)","递归复制支持深拷贝的内容","需要独立修改多层可变数据"]]},applications:["模拟座位方案时为每一行建立独立列表。修改某一格后，核对其他行以及原方案的对应格。","编辑长列表的一段时，先用切片试读将受影响的项目，再修改原列表。"],mistakes:[{symptom:"改了第一行，所有行都变了",reason:"[[0] * cols] * rows 重复引用同一个行列表。",fix:"在循环中每次创建一行，例如 grid.append([0] * cols)。",check:"用 grid[0] is grid[1] 核对两行的身份。"},{symptom:"流程里清空了副本，却也丢了原数据",reason:"副本名称仍与原数据共享同一个外层列表。",fix:"在只改外层时使用浅拷贝，在修改嵌套对象前检查内层共享。",check:"用两个名称分别打印结果，并沿修改位置逐层做身份比较。"}],summary:["赋值绑定名称。对象内容改变时，所有仍指向该对象的名称都能看到新内容。","切片按步长挑选位置，边界 stop 永远不包含。","复制前先画出写入路径，尤其注意乘法生成的重复引用。"],next:"下一课把列表用于可撤回的编辑和多条件排序。",exercises:[s("list-identity","区分相等和同一对象","下面两个布尔值依次是什么？",1,[["True False","两份独立列表的内容相同。"],["False True","切片建立新外层，列表中的整数值相等。"],["True True","只有共享的对象才通过 is。"]],`a = [1, 2]
b = a[:]
print(a is b, a == b)`,`False True
`),s("list-negative","手推负步长与边界","反向切片选中了哪些元素？",2,[["[5, 3]","下一次下标为 0，仍在省略边界的范围内。"],["[4, 2, 0]","从实际末项 5 起步。"],["[5, 3, 1]","下标 4、2、0 被依次选中。"]],"print([1, 2, 3, 4, 5][::-2])",`[5, 3, 1]
`),s("list-tuple","识别元组中共享的可变对象","执行后 t[1] 的值是什么？",0,[["[7, 8]","append 改的是列表的内容，元组槽位保持原样。"],["[7]","建立元组时没有复制 row。"],["引发 TypeError","代码没有给 t[1] 赋值。"]],`row = [7]
t = (1, row)
row.append(8)`),s("list-extend-slice","判断扩展切片赋值长度","怎样一次替换下标 0、2 并保留其余位置？",1,[["a[:2] = [8, 9]","连续切片修改位置 0、1。"],["a[::2] = [8, 9]","步长 2 选两个位置，右侧长度正好匹配。"],["a[::2] = [8]","步长不为 1 时两侧长度必须一致。"]],"a = [1, 2, 3, 4]"),n("A001","基础编程","从零基半开区间中提取预览，再用新片段替换。"),n("A002","独立编程","按行复制座位图，在副本中独立处理编辑。"),n("A003","综合应用","用独立的嵌套副本维护多份现场配置。"),n("A004","拓展挑战","将相同结构的三种对象关系变成可对照的回归输出。")],references:[r("对象、值和类型","reference/datamodel.html#objects-values-and-types","核对对象身份和可变性。"),r("可变序列操作","library/stdtypes.html#mutable-sequence-types","核对切片赋值、删除和复制。"),r("copy 模块","library/copy.html","核对浅拷贝与深拷贝对内部对象的处理。")]},ne={introduction:"一份队列同时记录着到达顺序、重复到访和临时插队。若直接排序，原始顺序会消失。本课先用合适的方法编辑队列，再按规则创建一个保留原数据的排名视图。",goals:["根据是处理单项、展开一批、按位置还是按值来选择列表方法。","保留原始名单并生成过滤、反转或排名结果。","编写可解释的排序键，验证混合升降序与完全并列。"],prerequisites:"列表索引与切片、循环和函数 return。能区分改变原列表和创建新列表。",version:"Python 3.12。排序稳定性属于 Python 保证。",topics:[{title:"增删、查找与筛选",explanation:["append(x) 放入一个对象，x 即使是列表也只占一格。extend(xs) 逐项读取 xs 并追加，传入字符串会逐字符加入。insert(i, x) 把单个对象放在指定位置前面，后面的元素向后移动。","remove(x) 按值删第一次命中，缺失抛 ValueError。pop(i) 按位置移除并返回元素，省略 i 时取末项，空表或越界抛 IndexError。del a[i] 或 del a[i:j] 按位置删除，适合不需要返回被删项的情况。","count(x) 计算所有相等项；index(x, start, stop) 查指定半开区间的首次命中，返回原列表下标，缺失抛 ValueError。筛选时可在循环中把合格项加入新列表。边遍历边删原列表，后续元素左移，循环可能跳过刚移到当前位置的项。"],examples:[e("queue-edit","更新设备领取队列","起步",`queue = ["工牌", "灯"]
queue.append(["绳", "钩"])
queue.extend(["灯", "卡"])
queue.insert(1, "牌")
print(queue.count("灯"), queue.index("灯", 3))
queue.remove("灯")
picked = queue.pop(1)
del queue[-1:]
print(picked, queue)
`,`2 4
牌 ['工牌', ['绳', '钩'], '灯']
`,"跟踪批次、重复值和删除后会移动的下标。",["一盒彩绳和挂钩作为一个列表进入队列。","领取牌插到位置 1，第二盏灯因此位于 4。","按值只删第一盏，再按位置取牌并删除末尾卡片。"],"remove 返回 None。需要知道取走的对象且手上有位置时用 pop。"),e("filter-count","筛出温度告警并统计","应用",`readings = [15, 28, 28, 35, 18]
alerts = []
for temperature in readings:
    if temperature >= 28:
        alerts.append(temperature)
print(alerts, alerts.count(28))
print(len(alerts), sum(alerts))
`,`[28, 28, 35] 2
3 91
`,"构造一份保留重复值和原顺序的报告。",["逐条检查阈值。","把合格读数逐项放进新表。","区分等于阈值的数量、全部告警数和合计。"],"如果先转成 set，两条 28 会合并，统计的次数就变了。")]},{title:"反转、稳定排序与键函数",explanation:["reverse() 原地交换前后位置，返回 None；reversed(a) 返回反向迭代器。迭代器记录读到哪一项，每次取下一项，读完就耗尽。可以用 list(...) 把剩余元素收集成新列表。反转只颠倒位置，与比较大小无关。","a.sort() 原地重新排列列表，sorted(a) 读入给定数据并返回新列表。两者都接受 key=函数，函数为每条记录算一次比较用的键。key=score_key 传函数本身。lambda row: row[1] 是一个只返回表达式值的小函数，相当于 def score_key(row): return row[1]。","元组按第一个位置、第二个位置依次比较，直到分出大小。因此 (-分数, 用时) 能先按分数降序、再按用时升序。reverse=True 倒转整个比较方向。相同键的记录保留输入先后，这就是稳定排序。若规则较多，也可从次要键到主要键逐次稳定排序。"],examples:[e("reverse-sort","回放顺序与数值排序","起步",`ids = [8, 3, 7]
backward = reversed(ids)
print(list(backward), list(backward))
print(sorted(ids), ids)
print(ids.reverse(), ids)
ids.sort()
print(ids)
`,`[7, 3, 8] []
[3, 7, 8] [8, 3, 7]
None [7, 3, 8]
[3, 7, 8]
`,"对照两种反转和两种排序的对象变化与返回值。",["反向迭代器首次被 list 取完，第二次得到空表。","sorted 创建新表，原顺序保持。","reverse 和 sort 依次改变 ids 本身。"],"不要用 ids = ids.sort() 接收结果，否则名称会换绑到 None。"),e("stable-ranking","筛选并排序社区讲解员","应用",`records = [("林", 90, 8), ("安", 90, 5), ("夏", 90, 5), ("陈", 65, 4)]
eligible = []
for record in records:
    if record[1] >= 80:
        eligible.append(record)

ranked = sorted(eligible, key=lambda row: (-row[1], row[2]))
for record in ranked:
    print(record[0])
print(records[0][0])
`,`安
夏
林
林
`,"把混合升降序与稳定并列转成具体比较键。",["筛掉低分者。","三个合格者的键分别为 (-90, 8)、(-90, 5)、(-90, 5)。","按用时将安和夏放到林前面，完全并列时保留安在先。"],"把 reverse=True 用在正的 (分数, 用时) 上会同时把用时改为降序。")]}],comparisons:{headings:["操作","原列表","返回结果"],rows:[["sort()","原地排序","None"],["sorted(a)","保留","新顶层列表"],["reverse()","原地反转","None"],["reversed(a)","保留","反向迭代器"]]},applications:["在日志或订单列表保留原始录入顺序，用 sorted 生成按严重度或优先级显示的副本。","用 append 和 pop() 表示撤销栈。若经常从队首移除，可用 collections.deque 提供的双端队列。"],mistakes:[{symptom:"两个相邻重复值只删掉了第一个",reason:"遍历中删除使第二项左移，迭代位置继续前进。",fix:"遍历原表并建立新结果列表。",check:"用相邻两条无效记录测试。"},{symptom:"名次相同却被按姓名重排",reason:"排序键把姓名也作为第三项参与比较。",fix:"题面规定按录入顺序时，将姓名移出排序键。",check:"准备两条同分同用时且姓名逆序的记录。"}],summary:["通过参数和返回值区分增删方法。","排序和反转处理的是不同规则，各自都有原地和返回结果的写法。","用元组键写清优先级，用稳定排序处理完全并列。"],next:"下一课用字典把记录按编号和分组索引。",exercises:[s("order-batch","区分追加单个对象与展开批次","列表最后有几项？",2,[["2","extend 会把批次的两项各追加一次。"],["4","append 的列表整体占一个位置。"],["3","第一项是列表，后两项是字符串。"]],`a = []
a.append(["A", "B"])
a.extend(["C", "D"])`),s("order-pop","预测两次删除的结果","print 打印什么？",0,[["B ['A']","remove 删除最左的 A，pop 取出下标 0 的 B。"],["A ['B']","remove 删除的是首次命中，先留下 B、A。"],["None ['A']","pop 会返回被取出的元素。"]],`a = ["A", "B", "A"]
a.remove("A")
print(a.pop(0), a)`,`B ['A']
`),s("order-stable","追踪稳定排序的并列规则","哪个姓名先出现？",1,[["安","姓名不在键里，不参与比较。"],["林","键相同，来自原表的先到记录优先。"],["无法确定","Python 保证排序稳定。"]],'print(sorted([("林", 4), ("安", 4)], key=lambda row: row[1]))',`[('林', 4), ('安', 4)]
`),s("order-key","构造混合升降序的两级键","分数高的在前，同分时用时短的在前。哪个键正确？",2,[["(score, time)","分数会从低到高。"],["(-score, -time)","同分时较长用时的键更小。"],["(-score, time)","分数越大，第一项越小。第二项仍升序。"]]),n("A005","基础编程","按值撤销、按位置领取，并保留重复标签。"),n("A006","独立编程","筛选排名资格并取稳定排名的第二项。"),n("A007","综合应用","把原始记录和筛选排序后的报表分别输出。"),n("A008","拓展挑战","按多个字段处理不同排序方向及并列。")],references:[r("列表的更多操作","tutorial/datastructures.html#more-on-lists","核查插入、删除和计数方法。"),r("排序指南","howto/sorting.html","查阅键函数、排序稳定性和多次排序。"),r("reversed","library/functions.html#reversed","核查反向迭代器的行为。")]},te={introduction:"工作人员要按编号找物资、按库房列物资，还要把当天的更新合并到旧清单。这个场景把字典当作随数据更新的索引，能看到顺序、缺键和共享值怎样影响报表。",goals:["判断哪些组合值可以作为键，并说明键相等时为何只保留一个条目。","预测字典视图、加键、更新和重插后的内容及顺序。","用计数、分组和嵌套索引实现多种查询并正确处理缺键。"],prerequisites:"基础篇字典、函数和循环，以及前两课的对象引用与列表操作。",version:"Python 3.12。插入顺序从 Python 3.7 起是语言保证，合并符号 | 和 |= 自 3.9 提供。",topics:[{title:"键、顺序、视图与遍历",explanation:["列表按位置取值，字典按唯一的键取值。可哈希对象具有生命周期内稳定的哈希值，相等对象必须具有相同哈希值。哈希把对象映射到整数，供解释器缩小查找范围；不同对象也可以给出相同的整数，这时还需要比较相等性。相等的键共享一个条目，例如 1 和 True 相等，写入两次只保留最新的值。","整数、字符串以及所有成员均可哈希的元组可以作键。Python 的 list 类型刻意不提供哈希，其按内容比较且内容可以改变。","d.keys()、d.values()、d.items() 返回视图。视图提供访问原字典的方式，源字典更新后，通过现有视图重新访问就能看到变化。list(d.items()) 则立即取得键值对列表，之后添加键不会扩大它，但列表里仍可能引用同一个可变值。","for key in d 默认遍历键，d.values() 给值，d.items() 每次给一个 (键, 值) 元组。已有键换值不移动位置；删除再插入会进入末尾。遍历活动视图时增删条目可能触发 RuntimeError 或漏读。需要删键时可先用 list(d) 固定待扫描的键。"],examples:[e("views-order","追踪校区索引的两种视图","起步",`rooms = {("东", 1): 0, ("西", 1): 5}
live = rooms.keys()
snapshot = list(live)
rooms[("东", 1)] = 7
rooms[("北", 2)] = 4
del rooms[("西", 1)]
rooms[("西", 1)] = 2
print(list(live))
print(snapshot)
print(list(rooms.values()))
`,`[('东', 1), ('北', 2), ('西', 1)]
[('东', 1), ('西', 1)]
[7, 4, 2]
`,"用复合键索引库房，并核对视图和快照。",["复合键的两个成员都是可哈希对象。","东校区换值时位置不动，北校区追加到末尾。","西校区删除后重插，活动视图显示新顺序，快照保留原键序列。"],'试图用 ["东", 1] 作键会报 TypeError。可用 ("东", 1) 表示固定组合。'),e("filter-mapping","从库存中筛出可领取物资","应用",`stock = {"灯": 2, "伞": 0, "水": 4}
available = {}
for key, number in stock.items():
    if number > 0:
        available[key] = number
print(list(available.items()))
print(stock.get("伞", -1), stock.get("绳", -1))
`,`[('灯', 2), ('水', 4)]
0 -1
`,"构建新映射，为后续字典推导式建立普通循环模型。",["遍历时一组条目提供一个键和一个数量。","保留满足数量条件的条目，把决定写入新字典。","伞已存在且为 0，绳缺失才会返回 -1。"],"if stock.get(key) 会同时排除缺键和零值。要区分两者，使用 key in stock 或独立默认值。"),e("dispatch-frequency","统计无线电口令频次","应用",`words = "Go wait go hold go".lower().split()
counts = {}
for word in words:
    counts[word] = counts.get(word, 0) + 1
for word in counts:
    print(word, counts[word])
`,`go 3
wait 1
hold 1
`,"先统一大小写，再维护每个口令的累计次数。",["把 Go、go 归一成同一个字符串。","首次查表返回 0，累加后写入已有次数。","迭代键时按首次出现顺序输出，频数变动不会移动已有键。"],"用 counts[word] = 1 会覆盖以前的计数。用 words.count(word) 对所有不同词逐个查，会重复扫描数据。")]},{title:"读写方法、浅合并与嵌套索引",explanation:["get(k, default) 读取并按需返回默认值。setdefault(k, default) 在缺键时插入默认值，再返回实际值，因此常用于 d.setdefault(group, []).append(item)。写在调用里的 [] 每次先求值，键已存在时新列表会被丢弃。若把同一个外部列表作为默认值传给不同键，各组会共享它。","update(other) 和 |= 修改原字典，右侧同名键覆盖左侧值。left | right 创建新外层字典，也由右侧赢得冲突。合并只处理顶层，两个同名键的嵌套值会整项替换。若要按子键合并，需要按层设计。pop(k, default) 按键移除并返回值；popitem() 取走最近插入的一对，空字典抛 KeyError；clear() 原地清空，别名也会观察到。","分组可用字典套列表，保留组里多条记录。快速精确访问可用字典套字典，例如 by_site[site][code]。列表中存字典适合保留数据行顺序及重复行。可以建索引让字典值直接指向这些数据行，更新同一行时就要考虑共享影响。"],examples:[e("dict-merge","合并两份班次设置","起步",`base = {"班次": {"起": 9, "止": 18}, "状态": "开放"}
local = {"班次": {"起": 10}, "负责人": "林"}
merged = base | local
print(merged["班次"], base["班次"])
base.update({"状态": "关闭"})
print(base.pop("未知", "缺键"), base.popitem())
alias = base
base.clear()
print(alias)
`,`{'起': 10} {'起': 9, '止': 18}
缺键 ('状态', '关闭')
{}
`,"追踪整项覆盖、更新顺序与清空别名。",["合并时右侧的班次值整个取代左侧值。","更新状态没有改变插入位置，popitem 仍取最后插入的状态。","clear 修改原字典，alias 读取到空内容。"],"若需要保留「止」，应先合并内层班次字典，再把合并结果放回外层。"),e("dict-group-index","同一批物资建立分组和编号索引","应用",`rows = [{"区": "东", "号": "A", "量": 3}, {"区": "西", "号": "A", "量": 1},
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
`,`{'东': ['A', 'B'], '西': ['A']} 5
`,"同时按区列编号并用两级索引变更一条记录。",["每区按录入顺序保留编号列表。","为区内编号保存完整行的引用，同号不同区互不覆盖。","通过索引修改行后，原始 rows 看到同一个行的变化。"],"只有组名和编号共同唯一，单用编号作键会让西区 A 覆盖东区 A。")]}],comparisons:{headings:["操作","缺键或冲突时","是否修改原字典"],rows:[["get(k, x)","缺键返回 x","否"],["setdefault(k, x)","缺键插入 x","可能"],["update(patch)","右侧同名键覆盖","是"],["base | patch","右侧同名键覆盖","否，新建外层"]]},applications:["词频计数可写 counts[word] = counts.get(word, 0) + 1。分组清单要保留每条原记录，用列表作组值。","库房系统可选择 (校区, 编号) 复合键，或选择先按校区再按编号的两级字典。需要逐校区遍历时，后者更方便。"],mistakes:[{symptom:"删除低库存项时遍历中断",reason:"循环读的是活动视图，字典大小同时在改变。",fix:"保存 list(stock) 后遍历该列表，或直接构造一个新字典。",check:"准备两条都需删除的记录和一条应保留的记录。"},{symptom:"修改默认配置影响了另一个字典",reason:"浅合并重用了没有被替换的嵌套值。",fix:"需要独立修改时，复制相应嵌套层或使用深拷贝。",check:"合并后修改子字段，再检查源对象。"}],summary:["用键检索且为每个键维护一个值。复合键的每个组成部分都必须可哈希。","视图跟随原字典，快照只冻结当时收集的条目引用。","选择分组列表或嵌套索引时，先写出查询问题，然后决定键和值。"],next:"下一课处理只关心成员是否存在的名单，并比较集合关系。",exercises:[s("dict-key","判断复合键是否可哈希","哪一个对象可作为字典键？",2,[['["东", 1]',"列表没有可用的哈希。"],['("东", [1])',"元组的列表成员不可哈希。"],['("东", 1)',"两个成员均可哈希，因此该元组可哈希。"]]),s("dict-view","手推活动视图和重插顺序","程序会打印什么？",0,[["['B', 'A']","删除后重插 A，活动视图跟随更新。"],["['A', 'B']","只有覆盖已有键才保留原位置。"],["['B']","视图重新读取时也会看到 A 回来。"]],`d = {"A": 0, "B": 1}
v = d.keys()
d.pop("A")
d["A"] = 2
print(list(v))`,`['B', 'A']
`),s("dict-default","区分读取默认值与插入默认值","输出是什么？",1,[["0 0","setdefault 会补上缺失的键。"],["0 1","get 只读，setdefault 把默认值写入。"],["1 1","get 不新增键。"]],`d = {}
d.get("A", [])
print(len(d), end=" ")
d.setdefault("B", [])
print(len(d))`,`0 1
`),s("dict-shallow","预测嵌套值的合并范围","怎样保留原有的「止」值？",2,[["直接 base | extra","同名顶层键的值整项覆盖。"],["直接 base.update(extra)","update 仍然只合并顶层。"],["先合并两个「班次」内层字典","显式合并同一个层级，再写回外层。"]],`base = {"班次": {"起": 9, "止": 18}}
extra = {"班次": {"起": 10}}`),n("A009","基础编程","维护表的插入顺序和撤销记录。"),n("A010","独立编程","积累净词频并按首次出现规则决胜。"),n("A011","综合应用","按多个组处理清单并输出分组统计。"),n("A012","拓展挑战","用两层索引响应更新与读取并区分缺失和零。")],references:[r("字典类型","library/stdtypes.html#mapping-types-dict","核对读写、合并和插入顺序。"),r("字典视图","library/stdtypes.html#dictionary-view-objects","核对视图的动态行为和遍历限制。"),r("可哈希","glossary.html#term-hashable","核对哈希值、相等与作为字典键的条件。")]},se={introduction:"活动结束后，两份签到表包含重复记录。工作人员需要知道哪些人两场都来、哪些人只来一场、谁还缺一场。集合把这些问题变成对成员关系的直接计算。",goals:["正确创建空集合和非空集合，判断哪些对象能成为成员。","将业务语句翻译为交、并、差、对称差或集合关系。","用集合判重，另用列表或排序明确最终的输出顺序。"],prerequisites:"列表遍历和字典键的可哈希要求。",version:"Python 3.12。题目指定的输出顺序一律显式实现。",topics:[{title:"唯一成员和维护方式",explanation:['集合表示有哪些不同成员，重复加入相等的值只保留一份。集合不提供位置索引，也不保证遍历顺序。用 set() 建空集合，{} 是空字典。用 {"甲", "乙"} 写非空集合，也可把列表或字符串交给 set，从其元素构建集合。',"set 本身可以增删；成员要可哈希，普通列表或 set 不能直接成为另一个集合的成员。需要把一组成员整体作键时，可考虑不可变的 frozenset。它忽略内部顺序，若要保留顺序则使用由可哈希成员组成的元组。","add(x) 加一个成员，update(xs) 逐项添加。remove(x) 要求该元素存在，否则抛 KeyError；discard(x) 在元素缺失时什么也不做。pop() 移除并返回任意一个元素，空集合抛 KeyError。pop 适用于可任取一项的场景。"],examples:[e("set-updates","维护当班权限名单","起步",`active = set()
active.add("A")
active.update(["B", "A", "C"])
active.remove("B")
active.discard("B")
print(sorted(active))
single = {"X"}
print(single.pop(), len(single))
`,`['A', 'C']
X 0
`,"处理重复授权、明确撤销与允许重复撤销。",["add 写一项，update 批量写。","重复的 A 合并成一个成员。","remove 删除 B，第二次撤销可用 discard；单元素集合只有一个可能的 pop 结果。"],"set.pop() 不按先入先出，不能用它模拟排队。"),e("ordered-dedup","保留第一次刷卡顺序","应用",`cards = ["C", "A", "C", "B", "A"]
seen = set()
first = []
for card in cards:
    if card not in seen:
        seen.add(card)
        first.append(card)
print(first)
print(sorted(seen))
`,`['C', 'A', 'B']
['A', 'B', 'C']
`,"让一份数据同时支持成员判断与两种报表顺序。",["从左向右读刷卡记录。","第一次遇到成员时同时记入 seen 和 first。","后续重复项跳过，first 保留首现顺序；sorted 给出字典序。"],"list(set(cards)) 不能表达首现顺序。")]},{title:"集合运算和集合之间的关系",explanation:["A | B 是并集，至少属于其中一组；A & B 是交集，同时属于两组；A - B 是差集，在 A 但不在 B，交换顺序一般会改变结果；A ^ B 是对称差集，仅属于其中一组。运算符要求两边都是集合类型，A.intersection(list_data) 这类方法可以接收其他可迭代对象。","A <= B 检验 A 是否为 B 的子集，相等时成立。A < B 要求还存在 B 有而 A 没有的成员，因此是真子集。A >= B 和 A > B 从超集方向判断。issubset、issuperset 是命名方法，isdisjoint 判断是否没有任何共同成员。","把「全部满足」转为 required <= actual，把「没有冲突」转为 isdisjoint。空集合是任意集合的子集。业务要求至少完成一个项目时，需要再检查实际人数或清单是否为空。"],examples:[e("set-operations","对比两场培训签到","起步",`first = {"C", "A", "B"}
second = {"B", "D"}
print(sorted(first | second))
print(sorted(first & second))
print(sorted(first - second))
print(sorted(second - first))
print(sorted(first ^ second))
`,`['A', 'B', 'C', 'D']
['B']
['A', 'C']
['D']
['A', 'C', 'D']
`,"把五个名单问题分别写成集合运算。",["并集收录所有来过的人，交集找出 B。","差集方向决定要保留第一场或第二场独有的记录。","对称差合并两边独有的人，排除交集。"],"用 | 查「只来一场」会错误地保留 B。"),e("set-relations","核对上岗培训和限制","应用",`required = {"消防", "用电"}
received = {"用电", "消防", "急救"}
blocked = {"未复核"}
print(required <= received, required < received)
print(received.issuperset(required), received.isdisjoint(blocked))
print(received < received, set() <= received)
`,`True True
True True
False True
`,"检查全部必修、额外证书和冲突标记。",["required 每一项均在 received。","急救为 received 多出的成员，真子集条件也满足。","没有受限标记，且没有集合是自己的真子集。"],"仅比较长度会错把成员不相同但数量相同的名单视为满足条件。")]}],comparisons:{headings:["结构","保留什么","合适的问题"],rows:[["列表","顺序和重复","第几次出现，原始记录是什么"],["集合","不同成员","谁出现过，哪些成员重合"],["字典","键及其对应值","某个编号对应谁，出现过几次"]]},applications:["审核文件权限时用集合记录允许项，用差集输出缺失权限。","把重复访问日志变成唯一访客名单，同时保留首次访问顺序供审核。"],mistakes:[{symptom:"空名单调用 add 提示属性不存在",reason:"{} 构建了字典。",fix:"使用 set() 构建空集合。",check:"打印 type(value).__name__。"},{symptom:"重复撤销后程序中止",reason:"第二次调用 remove 时成员已经缺失。",fix:"按需求使用 discard 或在删除前报告缺失。",check:"连续撤销两次，再撤销从未出现过的编号。"}],summary:["集合保存可哈希的唯一成员，输出顺序需要另行表达。","并集回答至少一次，交集回答都满足，差集和对称差回答不同的排除条件。","子集检查的是成员包含关系。"],next:"下一课把列表、字典和集合放在同一个程序里，并计算多次查找的成本。",exercises:[s("set-empty","辨认空集合的创建方法","哪个表达式会创建一个空集合？",1,[["{}","这是空字典。"],["set()","无参数的 set 构造出空集合。"],["[]","这是空列表。"]]),s("set-difference","区分差集和对称差集","两次输出依次是什么？",2,[["[2]、[1, 3]","第一个表达式不是交集。"],["[1, 3]、[1]","有方向的差集在前。"],["[1]、[1, 3]","差集只从 A 保留 1，对称差另保留来自 B 的 3。"]],`a, b = {1, 2}, {2, 3}
print(sorted(a - b))
print(sorted(a ^ b))`,`[1]
[1, 3]
`),s("set-subset","辨认相等与真子集","required 和 actual 成员完全相同。哪一项成立？",0,[["required <= actual","子集关系允许相等。"],["required < actual","真子集要求右边有额外成员。"],["required.isdisjoint(actual)，即使它们非空","非空且相等，两集合有共同成员。"]]),s("set-any","处理重复撤销并选择顺序容器","撤销重复编号后，如何输出剩余编号的升序？",1,[["反复 remove，按集合遍历顺序输出","可能在已缺失的编号处报错。"],["用 discard 撤销并用 sorted 输出","discard 容许缺失，排序明确输出顺序。"],["反复 pop，最后反转输出","pop 的取出顺序没有可用保证。"]]),n("A013","基础编程","输出唯一交集并保持第一份名单的首现顺序。"),n("A014","独立编程","用多个集合运算生成场馆对账清单。"),n("A015","综合应用","检查必修和限制，处理同时缺项与冲突。"),n("A016","拓展挑战","跟踪多期名单并输出只在一期开过的访客。")],references:[r("集合类型","library/stdtypes.html#set-types-set-frozenset","核对运算、关系与修改方法。"),r("教程中的集合","tutorial/datastructures.html#sets","核对创建方式和不同集合操作。")]},re={introduction:"迎新服务收到一份报名流水和一长串查询。要能回放事件、找出当前有效报名，又要避免每个查询都重扫名单。本课先用可数的比较次数感受规模，再按程序需要同时使用不同结构。",goals:["从实际访问模式选择列表、字典、集合，说明各自保留的信息。","从数据量和外层查询次数推导总工作量，区分平均、最坏和摊还。","维护报名状态与顺序，独立实现并验收含撤销、重报和重复查询的程序。"],prerequisites:"本模块前四课。能使用位置、键、集合成员和循环维护状态。",version:"以下成本讨论以 CPython 3.12 的常用实现为背景，默认比较、哈希简单标识的成本固定，并忽略输入输出。",topics:[{title:"从一次查找推到整批查询",explanation:["设名单长 n。列表按下标访问直接定位槽位，成本 O(1)，意思是主要工作不随 n 一起增长。只知道值时，列表需要依次比较。首项命中只比较一次，末项或缺失最多需要 n 次，最坏 O(n)。","一个未命中查询扫 n 项，q 个这样的查询扫 n×q 项。若 q 与 n 同阶，名单翻倍且查询也翻倍，比较次数变为四倍，这就是平方增长 O(n²) 的直观含义。平均情况需要给出分布假设。例如命中位置均匀分布，成功查找平均扫约一半，仍然与 n 同阶。","CPython 的字典与集合以哈希定位候选槽。哈希分布良好时，成员判断平均 O(1)。碰撞很多时可能检查大量槽，单次最坏 O(n)。建集合平均 O(n)，后续 q 次查询平均 O(q)，总成本平均 O(n+q)，同时为索引付出 O(n) 的额外空间上界。一次查询通常无需先建集合。键是长文本或比较本身昂贵时，还要计算每次哈希及相等比较的真实成本。"],examples:[e("count-comparisons","用计数观察扫描增长","起步",`def comparisons(n, query_count):
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
`,`100
400
20
`,"用同一组缺失查询观察增长率，避开计时噪声。",["编号 -1 从未出现，所以每次扫描所有 n 个标识。","名单和查询同时翻倍，总次数由 100 变成 400。","只有一次查询时只比较 20 次。"],"把固定的 10 次查询也写成 O(n²)。此时只有 n 增长，复杂度是 O(n)。"),e("membership-index","一次建索引，多次检查","应用",`roster = ["A5", "B2", "A5"]
has_access = set(roster)
queries = ["B2", "C1", "A5", "A5"]
matches = 0
for code in queries:
    if code in has_access:
        matches += 1
print(matches, len(has_access))
print(roster)
`,`3 2
['A5', 'B2', 'A5']
`,"把索引建设成本和每个查询的成本分开。",["建集时读取三条记录，得到两个成员。","每个查询独立计数，两个 A5 查询都命中。","保留原始列表，可继续审核出现次数或首现顺序。"],"对 queries 也去重会少计重复请求。索引和查询承担不同职责。")]},{title:"按访问模式分工，再计算修改成本",explanation:["追加列表通常只填一个空位置，偶尔扩容要搬动整个外层的引用。把扩容分摊到一串连续追加上，每次摊还 O(1)，一次扩容仍可能 O(n)。摊还是给一串操作的总成本计账，跟按输入分布取平均不同。从列表中间插入或删除通常要挪动后续位置，最坏 O(n)。","先写需要回答的问题。回放按时间顺序读列表；按编号取当前状态查字典；只问是否出现过，查集合；先判断是否重复再保留首现顺序，用集合配合列表。除非查询有明确收益，避免维护两份用途相同的状态。","状态变更要明确何时成立。覆盖字典值保留注册位置，删除后重新报名会追加到当前顺序。若要同时提供历史和当前快照，可以用列表记事件，用字典记当前有效数据。索引直接引用可变记录时，要分清它指向当前状态还是独立快照。"],examples:[e("history-current","区分报名流水与当前状态","应用",`operations = [("join", "B"), ("join", "A"), ("drop", "B"), ("join", "B")]
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
`,`[('A', 2), ('B', 4)]
('join', 'B') 4
`,"维护事件顺序与当前有效顺序两种不同信息。",["列表记录所有事件。","取消只从当前索引删除，对历史没有影响。","B 再报名时进入末尾，当前值是第 4 个事件的序号。"],"只记最后动作会失去重放流水的能力。"),e("unique-notices","按需去重通知，保留发出顺序","应用",`names = {"B": "林", "A": "安"}
requests = ["A", "Z", "A", "B"]
sent = set()
report = []
for code in requests:
    if code in names and code not in sent:
        sent.add(code)
        report.append(names[code])
print(report)
`,`['安', '林']
`,"组合映射、成员判断和顺序记录。",["字典校验编号且提供显示名。","集合只记录成功发过的编号。","列表保留真实通知顺序。"],"用显示名判重会误把同名的两位用户当作一个。")]}],comparisons:{headings:["需求","典型成本","成本条件"],rows:[["列表按下标读取","O(1)","直接定位槽位"],["列表按值找成员","最坏 O(n)","未命中会检查全部元素"],["字典键或集合成员查找","平均 O(1)，最坏 O(n)","平均依赖哈希分布，假设键操作成本固定"],["连续追加到列表","摊还 O(1) 每次","少数扩容操作承担移动成本"],["对 n 项排序","最坏 O(n log n) 次比较","键计算及每次比较的成本另计"]]},applications:["在检票前批量建立集合以快速处理大量扫描。若只有一条查询，先估算建索引和直接扫描各需要多少工作。","为重放、查状态和输出报表分别保留所需信息，并用含重复、失败和重试的事件流做回归。"],mistakes:[{symptom:"为每条查询重新把同一名单转成集合",reason:"建索引放在循环内部，每次都要扫描名单。",fix:"数据不变时，把索引建设移到查询之前。",check:"记录集合构造次数，静态名单只构造一次。"},{symptom:"学员取消后又报名，却排在旧位置",reason:"只覆盖状态，键从未离开字典。",fix:"按业务要求删除旧键，之后再插入。",check:"加入 B、加入 A、取消 B、再加入 B，输出顺序应为 A、B。"}],summary:["先数每次工作，再乘请求次数。区分哈希查找的平均成本与动态数组追加的摊还成本。","用列表表达顺序，用字典表达关联，用集合表达唯一成员。一个程序可以为不同访问模式选多种结构。"],next:"完成阶段测评后，试着写一份自己的数据结构选择理由。推导式与解包模块将把已掌握的循环构造写成更紧凑的表达式。",exercises:[s("design-single","手推重复查询的扫描工作量","下面会输出多少次相等比较？",2,[["3","一次缺失查询扫描三项，第二次也要扫描。"],["9","仅有两次查询，每次扫描三项。"],["6","两个目标都不存在，内层各扫描三项。"]],`checks = 0
for target in [9, 6]:
    for code in [1, 2, 3]:
        checks += 1
        if code == target:
            break
print(checks)`,`6
`),s("design-amortized","理解追加的摊还成本","连续 append 的每次摊还 O(1) 表示什么？",0,[["少数操作较贵，按整串追加均摊仍为常数级","扩容的成本通过一串追加分摊。"],["每次都严格花同样时间","扩容和普通追加的代价可能明显不同。"],["列表越长，所有单次追加都越慢","有备用槽时只需填一个位置。"]]),s("design-count","判断需要映射还是单纯成员判断","需要回答「这一行设备编号出现过几次」。最直接的索引是什么？",1,[["set[编号]","集合能表示是否出现，不能直接保存次数。"],["dict[编号] → 次数","用同一个键定位并累加。"],["每次从列表数一遍","可以计算，但多次查询会反复扫描。"]]),s("design-hash","区分哈希平均和最坏时间","何时不能把字典查找当成必然只做固定次数比较？",2,[["只有空字典时","有数据时也可能发生大量碰撞。"],["只在 Python 2","这里讨论的是 CPython 3.12 的常见实现。"],["很多不同键的哈希碰撞时","查找可能探查多个候选槽；极端时随条目数增长。"]]),n("A017","基础编程","批量判断通行请求，正确处理重复查询和原名单空行。"),n("A018","独立编程","建立编号索引并保留重复记录的覆盖规则。"),n("A019","综合应用","用已经读过的记录解答跨组配对查询。"),n("A020","拓展挑战","完成数据结构模块测评，维护按场次分组的报名和顺序。")],references:[r("设计 FAQ","faq/design.html#how-are-dictionaries-implemented-in-cpython","了解字典哈希表的实现背景。"),r("列表与队列","tutorial/datastructures.html#using-lists-as-queues","核对从列表头部操作时的搬移成本。"),{title:"CPython 操作成本",url:"https://github.com/python/cpython/blob/main/Doc/builtins/time-complexity.rst",note:"核对列表操作的摊还成本与哈希结构平均成本的适用条件。"}]};function t(a,p,c,m,d,A,_,O,E,D,q={kind:"original"}){return{id:"A"+String(a).padStart(3,"0"),tag:p,difficulty:c,title:m,...d,limits:d.limits+" 全部标准输入按 UTF-8 编码不超过 32 KiB。",sample:A,cases:_,hints:O,solution:E,guide:D,origin:q}}const ie=[t(1,o[0],"入门","替换节目片段",{background:"电台编辑先核对撤下的节目，再发布新节目单。",description:"保存节目单中下标区间 [left, right) 的内容，将这个区间替换为新片段。",input:"三行。原节目代号以空格分隔，两个整数 left right，新片段代号以空格分隔。两份名单都可以是空行。",output:"第一行输出原区间，第二行输出修订后的节目单。每行用单个空格连接，空名单写「空」。",limits:"每份名单 0–100 项，代号为 1–12 位英数字。0 ≤ left ≤ right ≤ 原名单长度。相等表示在该位置插入。"},[`A B C D
1 3
X
`,`B C
A X D
`,"位置 1、2 被保存并用 X 替换。"],[[`A B
1 1
X Y
`,`空
A X Y B
`],[`A A B
0 3

`,`A A B
空
`],[`
0 0
Z
`,`空
Z
`]],["先读右侧切片，保留旧项目。","用原区间的左侧切片赋值。"],`shows = input().split()
left, right = map(int, input().split())
replacement = input().split()
removed = shows[left:right]
shows[left:right] = replacement
print(" ".join(removed) or "空")
print(" ".join(shows) or "空")
`,{concepts:["半开区间","切片复制与赋值"],approach:"分开预览与更新。修改前读出区间，避免第二次读取时已经变成新片段。",steps:["拆分三行输入。","用右侧切片保存要移除的代号。","用等步长切片赋值更新原表并输出两份名单。"],time:"O(n+m)，n 为原项数，m 为新片段长度。代号长度有固定上界。",space:"O(n+m)，含名单、暂存切片及输出。",pitfall:"right 不包含。left == right 时要插入，也要输出空预览。",extension:"支持连续多次修改，每次都报告被替换的旧片段。"}),t(2,o[0],"入门","独立座位方案",{background:"排练负责人需要在副本里试占座位，同时保留原始座位图。",description:"把原图复制成草案，按输入顺序修改草案中的一个格子或多个格子，最后输出原图和草案。",input:"第一行 r c q。接下来 r 行，每行 c 个以空格分隔的 0 或 1。最后 q 行为行下标、列下标和新值，均为整数。",output:"先输出原图 r 行，再输出一行 ---，最后输出草案 r 行。每行数字以单个空格分隔。",limits:"1 ≤ r,c ≤ 40，0 ≤ q ≤ 100。坐标从 0 开始且有效。同一格可被多次修改，每次覆盖之前的值。"},[`2 2 2
0 1
1 0
0 0 1
1 1 1
`,`0 1
1 0
---
1 1
1 1
`,"两次写入分别落在草案两行，原图依旧。"],[[`1 1 0
0
`,`0
---
0
`],[`2 1 2
0
0
0 0 1
0 0 0
`,`0
0
---
0
0
`],[`2 1 1
0
0
1 0 1
`,`0
0
---
0
1
`]],["每一行是一个列表。","外层复制之外，再为每一行建立一个副本。"],`r, c, q = map(int, input().split())
original = []
for _ in range(r):
    original.append(input().split())
draft = []
for row in original:
    draft.append(row.copy())
for _ in range(q):
    row, col, value = input().split()
    draft[int(row)][int(col)] = value
for row in original:
    print(" ".join(row))
print("---")
for row in draft:
    print(" ".join(row))
`,{concepts:["二维列表","逐行浅拷贝"],approach:"每行的元素是不可变字符串，要隔离格子替换，只需复制行和外层。",steps:["逐行建立原图。","逐行复制并收集到独立外层。","所有写入只走草案坐标路径，再输出两张图。"],time:"O(rc+q)。",space:"O(rc)。",pitfall:"只写 draft = original.copy() 时两图的行仍然共享。",extension:"允许用一条命令替换一整个横向区间。"}),t(3,o[0],"基础","多份活动草案",{background:"同一个活动模板会复制给多个现场，现场各自修改展区里展品的备注清单。",description:"基于三层列表模板生成 k 份相互独立的草案。每条变更在指定草案、展区、展品的备注末尾添加一条。原模板永远保留。",input:"第一行 k r c q。接下来 r 行，每行 c 个原备注代号，每个展品起初只有这一条备注。最后 q 行为草案下标、展区下标、展品下标和备注代号。",output:"按原模板、草案 0 至 k-1 的顺序输出。每份模板或草案的首行分别为 BASE 或草案下标，随后 r 行，每个展品的备注以逗号连接，展品之间用一个空格分隔。",limits:"1 ≤ k,r,c ≤ 8，0 ≤ q ≤ 50。下标从 0 开始且有效，代号由 1–12 位英数字组成。重复备注也保留。"},[`2 1 2 2
x y
0 0 1 z
1 0 0 w
`,`BASE
x y
0
x y,z
1
x,w y
`,"两条变更分别只影响一份草案中的一个展品。"],[[`1 1 1 0
a
`,`BASE
a
0
a
`],[`2 1 1 3
a
0 0 0 b
0 0 0 b
0 0 0 c
`,`BASE
a
0
a,b,b,c
1
a
`],[`2 2 1 2
a
b
1 1 0 a
1 0 0 b
`,`BASE
a
b
0
a
b
1
a,b
b,a
`]],["先画出每次 append 实际修改的是第几层。","每次新建草案都单独对模板执行 deepcopy。"],`from copy import deepcopy

k, r, c, q = map(int, input().split())
base = []
for _ in range(r):
    row = []
    for note in input().split():
        row.append([note])
    base.append(row)
drafts = []
for _ in range(k):
    drafts.append(deepcopy(base))
for _ in range(q):
    draft, zone, item, note = input().split()
    drafts[int(draft)][int(zone)][int(item)].append(note)

def show(label, board):
    print(label)
    for row in board:
        fields = []
        for notes in row:
            fields.append(",".join(notes))
        print(" ".join(fields))

show("BASE", base)
for i, draft in enumerate(drafts):
    show(i, draft)
`,{concepts:["三层列表","深拷贝","共享关系"],approach:"把备注本身与展区列表都当成要保留的可变对象。分别创建草案并只通过指定草案引用写入。",steps:["每个展品新建一个备注列表。","每份草案单独深拷贝，避免用乘法重复指向同一份草案。","按事件追加，再按题面顺序格式化输出。"],time:"O(krc + q + 输出字符数)。",space:"O(krc+q) 个备注或容器引用，另有当前输出行。",pitfall:"drafts = [deepcopy(base)] * k 只调用一次 deepcopy。",extension:"增加从某份现有草案分叉的新命令，保留已有修改。"}),t(4,o[0],"进阶","追踪三种共享关系",{background:"审核员需要用三份视图复现一处误改，确认影响范围。",description:"原始表有两行。建立 alias（同一外层）、shallow（浅拷贝）和 deep（深拷贝）。先向 alias 的第 0 行追加 x，再把 shallow 的第 0 行替换为 [y]，最后向 shallow 的第 1 行追加 z。输出四份表。",input:"第一、二行为原表两行的若干整数，可以为空。第三行为 x y z。",output:"按 BASE、ALIAS、SHALLOW、DEEP 的顺序各输出一行。每行格式为「标签:首行内容|次行内容」，行内整数用逗号连接，空行内容为空文本。",limits:"每个原表行 0–30 项，所有整数在 -1000 至 1000。保留重复项。四组均在操作结束后读取。"},[`1 2
3
4 9 5
`,`BASE:1,2,4|3,5
ALIAS:1,2,4|3,5
SHALLOW:9|3,5
DEEP:1,2|3
`,"改浅拷贝的首行引用与修改仍共享的次行影响不同。"],[[`

0 0 0
`,`BASE:0|0
ALIAS:0|0
SHALLOW:0|0
DEEP:|
`],[`-1
-1
-1 2 0
`,`BASE:-1,-1|-1,0
ALIAS:-1,-1|-1,0
SHALLOW:2|-1,0
DEEP:-1|-1
`],[`7 7

8 11 6
`,`BASE:7,7,8|6
ALIAS:7,7,8|6
SHALLOW:11|6
DEEP:7,7|
`]],["先创建所有关系，再做第一条写入。","用 shallow[0] = [y] 替换引用，用 shallow[1].append(z) 改行对象。"],`from copy import deepcopy

base = [list(map(int, input().split())), list(map(int, input().split()))]
x, y, z = map(int, input().split())
alias = base
shallow = base[:]
deep = deepcopy(base)
alias[0].append(x)
shallow[0] = [y]
shallow[1].append(z)
for label, grid in [("BASE", base), ("ALIAS", alias), ("SHALLOW", shallow), ("DEEP", deep)]:
    print(label + ":" + ",".join(map(str, grid[0])) + "|" + ",".join(map(str, grid[1])))
`,{concepts:["对象身份","浅拷贝与深拷贝","原地更改和位置替换"],approach:"画出四个名称和两层对象的箭头再执行三个动作。统一格式化末态，避免中途输出。",steps:["构造共享外层、共享内层、独立内层三种关系。","区分替换浅副本的位置与修改共享行。","按标签读取末态并格式化。"],time:"O(n)，n 为原始元素数。",space:"O(n)，深拷贝需要复制所有列表层级。",pitfall:"不能先修改再复制，副本应看到创建时的内容。",extension:"加上浅副本首行在替换之前原地修改的操作，先画图再验证。"}),t(5,o[1],"入门","发放桌上的领物队列",{background:"领取处允许批量登记、插入急件和撤销第一张重复标签。",description:"依次处理 APPEND 标签、BATCH 后若干标签、INSERT 位置 标签、CANCEL 标签和 TAKE 位置。",input:"第一行初始标签列表，可能为空。第二行 q。随后 q 行命令，字段以空格分隔；BATCH 可无标签。",output:"每次 TAKE 输出取走的标签。处理完成后输出两行，先输出剩下的标签数，再输出列表，空列表写「空」。",limits:"初始长度 0–100，0 ≤ q ≤ 100，每次 BATCH 最多 20 项。INSERT 为 0 到当前长度，TAKE 位置 0 基且有效。CANCEL 缺失时忽略。标签由 1–12 位英数字组成。"},[`A B A
5
CANCEL A
INSERT 1 X
BATCH Y Z
TAKE 0
APPEND X
`,`B
5
X A Y Z X
`,"撤销只移走第一个 A，领取 B 后，X 可以重复。"],[[`
3
CANCEL X
BATCH
INSERT 0 Z
`,`1
Z
`],[`A A A
2
CANCEL A
TAKE 1
`,`A
1
A
`],[`A
1
TAKE 0
`,`A
0
空
`]],["区分标签对象和位置。","用 extend 处理字段切片，pop 返回取走的标签。"],`queue = input().split()
q = int(input())
for _ in range(q):
    parts = input().split()
    command = parts[0]
    if command == "APPEND":
        queue.append(parts[1])
    elif command == "BATCH":
        queue.extend(parts[1:])
    elif command == "INSERT":
        queue.insert(int(parts[1]), parts[2])
    elif command == "CANCEL":
        if parts[1] in queue:
            queue.remove(parts[1])
    else:
        print(queue.pop(int(parts[1])))
print(len(queue))
print(" ".join(queue) or "空")
`,{concepts:["append","extend","insert","remove","pop"],approach:"队列允许重复且命令基于位置，直接使用列表维护其当前顺序。",steps:["读命令类型与字段。","按值和按位置分别使用相应方法。","先输出各次领取，再输出当前列表。"],time:"O(n + q(m+1) + b)，n 为初始长度，m 为最大队列长度，b 为批量登记总项数。",space:"O(m)，另有单条命令的字段列表。",pitfall:"CANCEL 不要清理所有同名标签。",extension:"添加查询指令，报告标签出现次数和第一次出现位置。"}),t(6,o[1],"入门","后备讲解员",{background:"展馆从合格讲解员中选一人首发，另一人作为后备。",description:"筛掉低于资格线者，按分数从高到低排名，同分按登记先后。输出排在第二的编号。",input:"第一行 n limit，随后 n 行，每行是编号和分数，顺序为登记顺序。",output:"输出第二名编号；合格者不足两人时输出「无」。",limits:"0 ≤ n ≤ 500，分数与资格线在 0–100，编号唯一且只含英数字。等于资格线算合格。"},[`4 60
L 90
M 59
Z 90
A 89
`,`Z
`,"M 淘汰，L 和 Z 同分，Z 按登记次序排第二。"],[[`0 0
`,`无
`],[`3 75
Z 75
A 100
Q 74
`,`Z
`],[`3 100
Z 100
B 99
C 99
`,`无
`],[`3 0
C 80
A 80
B 80
`,`A
`]],["先筛选，再排名。","只用分数作为键，稳定排序会处理同分。"],`n, limit = map(int, input().split())
eligible = []
for _ in range(n):
    code, value = input().split()
    score = int(value)
    if score >= limit:
        eligible.append((code, score))
eligible.sort(key=lambda row: row[1], reverse=True)
print(eligible[1][0] if len(eligible) >= 2 else "无")
`,{concepts:["筛选","排序键","稳定性"],approach:"收集有资格的记录后只按分数排序，这样同分保持登记顺序。",steps:["读出资格边界和记录。","只把达线者加入名单，按分数降序。","检查长度后输出下标 1。"],time:"O(n + k log k)，k 为合格人数。",space:"O(k)。",pitfall:"第二名指第二条合格记录，同分仍各占一位。",extension:"实现只保留当前前两条记录的单次扫描。"},{kind:"adapted",platform:"AtCoder",id:"ABC213 B",title:"Booby Prize",level:"ABC B",url:"https://atcoder.jp/contests/abc213/tasks/abc213_b?lang=en",concepts:["次名","记录排名"],adaptation:"保留取第二名的思想，加入资格筛选、同分稳定排序和人数不足的情况。"}),t(7,o[1],"基础","还原巡检日志",{background:"巡检员按发生顺序记录读数，值班室则要同时看到历史和优先查看的警报。",description:"第一行报告全部记录的编号顺序。第二行报告所有达到阈值的记录，按读数从高到低，同值时最近发生的排前。",input:"第一行 n limit，接下来 n 行是编号和值，输入顺序就是发生顺序。",output:"两行编号，每行以一个空格连接；没有记录的一行写「空」。",limits:"0 ≤ n ≤ 300，阈值和值在 -1000 至 1000，编号由英数字组成，可重复，每条记录单独排名。"},[`4 5
X 7
Y 5
Z 7
Y 4
`,`X Y Z Y
Z X Y
`,"Z 与 X 同值，Z 更晚；最后一个 Y 未达标。"],[[`0 0
`,`空
空
`],[`2 5
A 4
B 0
`,`A B
空
`],[`3 -2
Z -2
A -2
A -2
`,`Z A A
A A Z
`]],["历史和警报各自收集到列表。","先让警报名单按发生顺序反向，再稳定排序。"],`n, limit = map(int, input().split())
history = []
alerts = []
for _ in range(n):
    code, value = input().split()
    history.append(code)
    score = int(value)
    if score >= limit:
        alerts.append((code, score))
ranked = sorted(reversed(alerts), key=lambda row: row[1], reverse=True)
print(" ".join(history) or "空")
priority = []
for record in ranked:
    priority.append(record[0])
print(" ".join(priority) or "空")
`,{concepts:["筛选","reversed","稳定排序"],approach:"把最近者在前的顺序作为排序的输入，同值时由稳定性沿用。",steps:["完整保存原顺序并单独记录警报。","反向读取警报，再按数值排序。","将结果投影为编号顺序。"],time:"O(n + k log k)，k 为警报数。",space:"O(n)。",pitfall:"对正序警报只用 reverse=True，同值仍是先来在前。",extension:"改成仅输出前 k 条，并保留最后一名的所有同值记录。"}),t(8,o[1],"进阶","服务工单分派",{background:"派单员需要一份稳定的工单顺序，避免重复刷新时同优先级工单自行换位。",description:"先按优先级从高到低，再按等待分钟数从多到少，最后按组名升序。三个字段相同的工单保留输入次序。",input:"第一行 n，其后 n 行为编号、优先级、等待分钟、组名。",output:"逐行输出工单编号。输入为空时没有任何输出。",limits:"0 ≤ n ≤ 1000，优先级 0–9，等待 0–10000，编号唯一且为英数字，组名仅含小写字母。"},[`5
Z 2 10 b
X 3 2 a
Y 2 10 a
A 2 10 a
B 2 9 a
`,`X
Y
A
Z
B
`,"同键时 Y 保留在 A 前，组名 a 排在 b 前。"],[[`0
`,""],[`3
H 1 2 a
J 2 0 z
K 1 3 z
`,`J
K
H
`],[`4
Z 0 0 z
Y 0 0 a
X 0 0 a
A 0 0 z
`,`Y
X
Z
A
`]],["把每条记录写成有固定列的元组。","希望数值降序时可以取负，把整个键保持升序。"],`orders = []
for _ in range(int(input())):
    code, level, waited, group = input().split()
    orders.append((code, int(level), int(waited), group))
orders.sort(key=lambda row: (-row[1], -row[2], row[3]))
for order in orders:
    print(order[0])
`,{concepts:["混合升降序","元组排序键","并列稳定性"],approach:"写明主次字段，数字取反表达降序，字符串沿用升序。",steps:["转换数字字段。","依三个规则构建元组键，编号不入键。","稳定排序后逐条打印编号。"],time:"O(n log n) 次比较，组名比较成本随字符数变化。",space:"O(n) 条记录及排序辅助空间。",pitfall:"整条记录自带的编号不参与题目排名。",extension:"用三个稳定排序步骤重写，并用完全并列数据与元组键版对照。"})],ae=[t(9,o[2],"入门","可撤销的物资清单",{background:"负责人能调整数量、撤下编号，或撤回最后上架的一项。",description:"按顺序处理 SET 编号 数量、DROP 编号和 LAST。SET 更新原位置或在末尾插入，DROP 删键，LAST 取出最后插入的现存项。",input:"第一行 q，随后 q 行命令。任何命令都可能发生在空清单上。",output:"每次 LAST 输出「编号 数量」，无项时输出「空」。最后输出一行「编号:数量」清单，以一个空格分隔，空时写「空」。",limits:"0 ≤ q ≤ 200，数量 0–1000，编号为英数字。DROP 缺失时忽略。零库存仍是一条现存项。"},[`7
SET B 2
SET A 0
SET B 7
LAST
DROP B
SET B 1
SET C 0
`,`A 0
B:1 C:0
`,"更新 B 未改变插入顺序，LAST 先取走 A。"],[[`0
`,`空
`],[`2
LAST
DROP A
`,`空
空
`],[`5
SET A 0
SET B 5
DROP A
SET A 0
LAST
`,`A 0
B:5
`]],["使用能保留插入顺序的映射。","先检查非空，再用 popitem 取最后插入的现存项。"],`stock = {}
for _ in range(int(input())):
    parts = input().split()
    command = parts[0]
    if command == "SET":
        stock[parts[1]] = int(parts[2])
    elif command == "DROP":
        stock.pop(parts[1], None)
    elif stock:
        code, number = stock.popitem()
        print(code, number)
    else:
        print("空")
fields = []
for code, number in stock.items():
    fields.append(f"{code}:{number}")
print(" ".join(fields) or "空")
`,{concepts:["字典插入顺序","pop","popitem","items"],approach:"只维护当前清单，字典的顺序正好符合上架、原位更新与重插规则。",steps:["SET 用赋值更新，DROP 用有默认值的 pop。","LAST 查询后移除末尾条目。","用 items 保序输出。"],time:"平均 O(q)，另计输出字符数。",space:"O(q) 条目和格式化字段。",pitfall:"不能先按编号排序再执行 LAST；零值也不能当作缺失。",extension:"增加 CLEAR 命令，把清空和撤销空表都写进边界测试。"}),t(10,o[2],"入门","社区主题热度",{background:"整理社区投票记录，赞成票加一，撤回或反对减一。",description:"计算每个主题净热度，只在正分主题中选最高分。同分时选择整个流水中首次出现更早的主题。",input:"第一行 n，后 n 行为符号 + 或 - 与主题代号。",output:"输出一行「主题 净分」。没有正分主题时输出「无」。",limits:"0 ≤ n ≤ 500，主题由 1–20 个英文字母组成，大小写敏感。首次出现可以来自减分记录。"},[`6
- B
+ A
+ B
+ B
+ Z
- Z
`,`B 1
`,"A 和 B 都是 1 分。B 在第一条减分记录中先出现。"],[[`0
`,`无
`],[`3
- A
+ A
- B
`,`无
`],[`4
+ C
+ X
+ X
- A
`,`X 2
`],[`4
+ Z
+ A
+ A
+ Z
`,`Z 2
`]],["用 get(..., 0) 读取累计值。","按插入顺序扫描，仅在严格超出最高分时更新。"],`scores = {}
for _ in range(int(input())):
    sign, topic = input().split()
    scores[topic] = scores.get(topic, 0) + (1 if sign == "+" else -1)
winner = ""
best = 0
for topic, number in scores.items():
    if number > best:
        winner, best = topic, number
if winner:
    print(winner, best)
else:
    print("无")
`,{concepts:["词频与带符号累计","首现顺序","并列"],approach:"第一次出现时直接创建键，得到一份保留首现顺序的净分表。",steps:["把每个符号转换为增量。","读完后按字典顺序只处理严格更优结果。","最高分初值为 0，从而排除零和负数。"],time:"平均 O(n)。",space:"O(u)，u 是不同主题数。",pitfall:"改用 >= 更新会让后到的同分主题获胜。",extension:"输出所有正分主题，按分数降序、首现顺序升序。"},{kind:"adapted",platform:"AtCoder",id:"ABC091 B",title:"Two Colors Card Game",level:"ABC B",url:"https://atcoder.jp/contests/abc091/tasks/abc091_b?lang=en",concepts:["频次差","最高得分"],adaptation:"改用交错的加减事件，要求在输出里带主题与分数，并规定非正分及首现平局规则。"}),t(11,o[2],"基础","片区领用小结",{background:"活动结束后要按片区整理领用记录，既汇总数量，也保留事件明细。",description:"按片区分组，每区统计总量和所有标签。片区按首次出现顺序输出，标签按该片区内的输入顺序保留。",input:"第一行 n，随后 n 行为片区、标签、领用量。各字段以空格分隔。",output:"每片区一行「片区 总量 标签1,标签2,...」。没有片区时输出「空」。",limits:"0 ≤ n ≤ 500，领用量 0–100，片区与标签仅含英数字。重复标签不去重，零量记录保留。"},[`4
N A 2
S A 0
N B 4
N A 1
`,`N 7 A,B,A
S 0 A
`,"N 的两条 A 都保留，S 即使总量为零也输出。"],[[`0
`,`空
`],[`2
Z X 0
A X 0
`,`Z 0 X
A 0 X
`],[`3
A L 2
A L 3
A L 4
`,`A 9 L,L,L
`]],["用字典保存片区，用列表保存每区明细。","在输出当前片区时同步累计数量与提取标签。"],`groups = {}
for _ in range(int(input())):
    section, label, value = input().split()
    groups.setdefault(section, []).append((label, int(value)))
for section, events in groups.items():
    total = 0
    labels = []
    for label, quantity in events:
        total += quantity
        labels.append(label)
    print(section, total, ",".join(labels))
if not groups:
    print("空")
`,{concepts:["字典分组","列表明细","保序累计"],approach:"片区是索引，列表保留重复和明细。汇总与明细从同一份记录生成。",steps:["按片区获取或新建列表。","追加标签和数量记录。","每组一次遍历生成总量和标签序列。"],time:"平均 O(n)，另计输出字符数。",space:"O(n) 条记录。",pitfall:"按标签作组内唯一键会覆盖重复标签。",extension:"添加片区内标签聚合版，并按首现顺序输出标签各自的总数量。"}),t(12,o[2],"进阶","跨仓库存索引",{background:"不同仓库可能共用物品编号，库存有零值，也可能从来没建立过。",description:"实现 PUT 仓号 物号 数量、GET 仓号 物号和 LIST 仓号。PUT 覆盖该仓内对应物品的库存。GET 查询库存。LIST 列出该仓中数量大于零的物品。",input:"第一行 q，随后 q 行命令，字段以空格分隔。",output:"GET 输出库存整数，缺失输出「未登记」。LIST 按物号的仓内首次登记顺序输出「物号:数量」，以空格分隔，空清单输出「空」。",limits:"0 ≤ q ≤ 500，仓号和物号由 1–12 位英数字组成，数量为 0–1000。所有 LIST 输出合计不超过 1500 个物号。GET 和 LIST 不创建条目。"},[`8
GET E L
PUT E L 0
PUT W L 6
PUT E X 3
GET E L
LIST E
PUT E L 2
LIST E
`,`未登记
0
X:3
L:2 X:3
`,"零库存可查询，却不列入清单。恢复后 L 在 X 之前。"],[[`3
LIST Q
GET Q C
LIST Q
`,`空
未登记
空
`],[`5
PUT A X 3
PUT B X 4
GET A X
GET B X
LIST C
`,`3
4
空
`],[`5
PUT A Z 3
PUT A B 1
PUT A Z 4
LIST A
GET A X
`,`Z:4 B:1
未登记
`]],["外层按仓查找，内层按物品编号查找。","GET 用「是否存在」判缺失，LIST 再按数量阈值过滤。"],`stock = {}
for _ in range(int(input())):
    parts = input().split()
    command, site = parts[:2]
    if command == "PUT":
        stock.setdefault(site, {})[parts[2]] = int(parts[3])
    elif command == "GET":
        inventory = stock.get(site, {})
        print(inventory.get(parts[2], "未登记"))
    else:
        fields = []
        for code, quantity in stock.get(site, {}).items():
            if quantity > 0:
                fields.append(f"{code}:{quantity}")
        print(" ".join(fields) or "空")
`,{concepts:["两级索引","顺序","缺键和零值","筛选映射"],approach:"仓内物号唯一，按层定位可避免不同仓互相覆盖，LIST 也只扫描目标仓。",steps:["PUT 创建或取得内层。","GET 用嵌套查询返回值或明确的缺失标记。","LIST 访问该仓并过滤零库存。"],time:"平均 O(q + L)，L 为每次 LIST 扫描的仓内条目数之和，另计输出字符数。",space:"O(q) 条目。",pitfall:"读取时用 setdefault 会创建空仓或默认值，因此读取使用 get。",extension:"支持按仓合并两批数据，并保证同号值按后批覆盖。"})],oe=[t(13,o[3],"入门","双馆通行名单",{background:"两处场馆都通过登记的人可以领取双馆通行证。",description:"给定两份名单，找出同时出现在两份名单中的不同编号。按它们在第一份名单的首次出现顺序输出。",input:"两行，每行若干用空格分隔的编号，可为空行。",output:"用单空格连接结果，交集为空时输出「空」。",limits:"每行最多 500 个编号。编号为 1–12 位英数字，可重复，区分大小写。"},[`C B C A D
A C C E
`,`C A
`,"C 和 A 两馆都出现，C 在第一馆先登记。"],[[`
A
`,`空
`],[`B A
X Y
`,`空
`],[`C C B C
B B C
`,`C B
`]],["先把第二条名单做成集合。","沿第一条名单前进，用另一个集合记哪些结果已输出。"],`first = input().split()
second = set(input().split())
seen = set()
answer = []
for code in first:
    if code in second and code not in seen:
        seen.add(code)
        answer.append(code)
print(" ".join(answer) or "空")
`,{concepts:["交集","哈希成员判断","保序去重"],approach:"交集关系可以在遍历中逐项检查，按第一份名单推进便能保留它的顺序。",steps:["给第二份名单建集合。","只收录同时满足在第二份出现且此前未入结果的编号。","输出列表保留首现顺序。"],time:"平均 O(n+m)。",space:"O(n+m)，含读入列表及索引。",pitfall:"直接遍历两个集合的交集会丢失顺序。",extension:"额外输出仅在第一份名单中出现的人，同样保留首现顺序。"},{kind:"adapted",platform:"LeetCode",id:"349",title:"Intersection of Two Arrays",level:"Easy",url:"https://leetcode.com/problems/intersection-of-two-arrays/",concepts:["唯一交集","集合成员查询"],adaptation:"使用两行编号的标准输入，增加空名单和按第一份名单首现顺序输出的要求。"}),t(14,o[3],"入门","协作名单四联单",{background:"东馆和西馆交换志愿者名单，需要区分共享人员、各馆独有和全部覆盖。",description:"分别生成至少一馆、两馆共有、仅东馆、仅一馆四份唯一名单。",input:"两行，依次为东馆、西馆的编号，以空格分隔，可为空行。",output:"依次输出四行。各行按编号字典序升序，用一个空格连接，空名单写「空」。",limits:"每馆 0–300 条，编号为 1–12 位英数字，区分大小写，允许重复。"},[`B B A X
C B
`,`A B C X
B
A X
A C X
`,"B 是共有人员，不出现在后两行。"],[[`

`,`空
空
空
空
`],[`
B A X
`,`A B X
空
空
A B X
`],[`X A
X A A
`,`A X
A X
空
空
`]],["四个问题分别对应 |、&、- 和 ^。","每个结果先排序，再统一处理空名单。"],`east = set(input().split())
west = set(input().split())
for group in (east | west, east & west, east - west, east ^ west):
    print(" ".join(sorted(group)) or "空")
`,{concepts:["并集","交集","差集","对称差"],approach:"直接根据语义选择四种运算，统一将无序结果变为规定的序列。",steps:["两份输入各去重一次。","保持 east - west 的方向。","按规定的四份顺序显示计算结果。"],time:"平均 O(n+m+u log u)，u 为并集大小。",space:"O(n+m)。",pitfall:"仅一馆需要对称差，不能漏掉西馆独有成员。",extension:"增加第五行，判断东馆名单是否为西馆的真子集。"}),t(15,o[3],"基础","培训准入复核",{background:"上岗前要核对必修证书，同时报告当前证书清单里的限制标记。",description:"对每人输出缺失的必修项数以及命中的限制项数。只有两者均为 0 时为 PASS，其余为 REVIEW。",input:"前两行依次为必修、限制代号列表，允许空行。第三行 n，随后 n 行为人员编号及其已提交代号，编号之后可没有代号。",output:"每人一行「编号 状态 缺失数 命中数」，保持输入顺序。",limits:"0 ≤ n ≤ 300，每个列表最多 100 项。代号为 1–12 位英数字，可重复。某代号可以同时被列为必修与限制，仍分别计算。"},[`A B
C
3
P A B
Q A C C
R
`,`P PASS 0 0
Q REVIEW 1 1
R REVIEW 2 0
`,"Q 缺 B，重复的 C 只命中一次。"],[[`

2
A
B C
`,`A PASS 0 0
B PASS 0 0
`],[`A
A
2
P A
Q
`,`P REVIEW 0 1
Q REVIEW 1 0
`],[`A A B
X X
1
P A A
`,`P REVIEW 1 0
`]],["分别求 required - actual 与 actual & blocked。","若只判断通过，可同时检查子集关系和无交集。"],`required = set(input().split())
blocked = set(input().split())
for _ in range(int(input())):
    fields = input().split()
    actual = set(fields[1:])
    missing = required - actual
    hits = actual & blocked
    status = "PASS" if not missing and not hits else "REVIEW"
    print(fields[0], status, len(missing), len(hits))
`,{concepts:["差集","交集","子集","无交集"],approach:"分别保留缺失与冲突的具体集合，让通过判断和数字报告取自同一结果。",steps:["建立必修和限制集合。","按人逐个把证书去重，算缺失与冲突。","只在两个集合均为空时通过。"],time:"平均 O(r+b+n(r+1)+t)，r、b 为两份要求的输入项数，n 为人数，t 为全部提交项数。",space:"O(r+b+a)，a 为单人最多提交项数。",pitfall:"两张证书数量正确不代表证书内容正确。检查实际成员。",extension:"输出缺失与冲突的代号，帮助工作人员修订。"}),t(16,o[3],"进阶","只参加过一期的访客",{background:"回访计划面向仅参加过一期活动的人。每期开卡机可能为同一人生成多条记录。",description:"找出只出现在恰好一期的人员，按编号升序输出。某人在同一期重复出现仍算一期。",input:"第一行 w，接下来 w 行，每行一期的访客编号列表，可为空行。",output:"单空格连接结果，没人符合时输出「空」。",limits:"0 ≤ w ≤ 60，每期最多 500 个编号，各编号为 1–12 位英数字。输入总量不超过 2000 条。"},[`3
C C A B
B A
A D
`,`C D
`,"A 出现三期，B 出现两期，只有 C 和 D 各出现一期。"],[[`0
`,`空
`],[`2
X X

`,`X
`],[`3
X
X
X
`,`空
`],[`3
Z Y
Z Y

`,`空
`]],["每一期单独去重。","记录以前出现过的人，以及已被至少两期命中的人。"],`seen = set()
repeated = set()
for _ in range(int(input())):
    current = set(input().split())
    repeated.update(seen & current)
    seen.update(current)
print(" ".join(sorted(seen - repeated)) or "空")
`,{concepts:["分批去重","交集","状态不变量"],approach:"每读完一期，seen 表示至少一期，repeated 表示至少两期。处理下一期时先看它跟之前的重合。",steps:["从当期刷卡记录建立集合。","与先前 seen 求交，将这些编号记作至少两期。","并入当期成员，最后从 seen 排除 repeated。"],time:"平均 O(w+t+k log k)，t 是所有刷卡记录数，k 是结果数。",space:"O(u)，u 是全程不同编号数。",pitfall:"把所有期依次做对称差会得到奇数次，而不是恰好一次。",extension:"按期数分桶，分别输出参加恰好一次、恰好两次和三次以上的访客。"})],le=[t(17,o[4],"入门","批量复核通行请求",{background:"服务台预先掌握一份通行名单，接着要连续核查许多次请求。",description:"按查询顺序逐条判断编号是否存在，并统计命中次数。对重复请求逐次计数。",input:"第一行授权代号，可为空。第二行查询代号，可为空。两行以空格分隔。",output:"先逐行输出命中的 YES 或未命中的 NO，最后输出命中次数。",limits:"每行 0–1000 项，1–12 位英数字代号，可重复，区分大小写。"},[`Z A Z
A X Z Z
`,`YES
NO
YES
YES
3
`,"对 Z 的两次查询分别计数。"],[[`
A A
`,`NO
NO
0
`],[`A Z

`,`0
`],[`B A
B A B A
`,`YES
YES
YES
YES
4
`]],["通行规则只关心成员是否存在。","查询顺序有意义，直接按输入列表遍历即可。"],`allowed = set(input().split())
queries = input().split()
hits = 0
for code in queries:
    if code in allowed:
        hits += 1
        print("YES")
    else:
        print("NO")
print(hits)
`,{concepts:["集合索引","有序查询","平均查找成本"],approach:"在查询以前建集合。查询保留原始次序与重复，避免扫描一遍授权表再处理下一个请求。",steps:["读授权表并去重。","顺序处理每个请求。","命中时打印 YES 并累计，最后打印总数。"],time:"平均 O(n+q)。",space:"O(n+q)，含本题按整行读取的输入。",pitfall:"索引移入查询循环会使每条查询都重新建集。",extension:"读取流式请求时逐条处理，使工作内存不随查询数增长。"}),t(18,o[4],"入门","展柜标签查询",{background:"一件展品可能在录入过程中更名，访客按唯一编号查询最终显示名。",description:"读取全部初始记录，遇到重复编号采用最后一条显示名。之后逐条查询编号。",input:"第一行 n q，接下来 n 行「编号 显示名」，之后 q 行各一个查询编号。",output:"每个查询一行，输出最终显示名，未找到写「无」。",limits:"0 ≤ n,q ≤ 1000。编号 1–12 位英数字，显示名 1–12 字且无空白、不会等于「无」。"},[`3 4
Z 松针
A 海风
Z 落雪
Z
A
X
Z
`,`落雪
海风
无
落雪
`,"Z 的最后一次记录决定前后两次查询。"],[[`0 2
A
A
`,`无
无
`],[`2 0
A 山雨
B 微光
`,""],[`4 2
X 原样
X 次日
Y 山河
X 修订
X
Y
`,`修订
山河
`]],["需要取某编号对应的数据，选择字典。","对同一个键反复赋值，最后的值自然保留。"],`n, q = map(int, input().split())
names = {}
for _ in range(n):
    code, name = input().split()
    names[code] = name
for _ in range(q):
    print(names.get(input(), "无"))
`,{concepts:["键到值的映射","覆盖","批量查询"],approach:"直接让编号做键。查询数量增加时，仍复用同一索引。",steps:["逐条读展品记录。","写键对应显示名，覆盖过时记录。","按查询顺序打印已存名称或缺失标记。"],time:"平均 O(n+q)。",space:"O(u)，u 为不同编号数。",pitfall:"用 set 只能确认编号出现过，拿不到对应显示名。",extension:"要求保留每个编号的所有历史名称及首次录入位置。"}),t(19,o[4],"基础","跨组配对检查",{background:"报名记录包含队员编号和所属组。合作任务要求选出都已登记且来自不同组的两位成员。",description:"给定报名记录，后出现的组号覆盖同编号先前的组号。对每次查询依次判定：至少一位未登记，输出 UNKNOWN；两人最终组号相同，输出 SAME；否则输出 OK。",input:"第一行 n q。随后 n 行「编号 组号」，最后 q 行「编号1 编号2」。",output:"每次查询输出一行 UNKNOWN、SAME 或 OK。",limits:"0 ≤ n,q ≤ 1000。编号和组号为 1–12 位英数字。可查询同一编号，可重复登记，不保证登记和查询使用相同编号。"},[`5 4
A G1
B G2
C G2
A G2
D G1
A B
B X
A A
C D
`,`SAME
UNKNOWN
SAME
OK
`,"A 最终是 G2。X 未登记，C 和 D 来自不同组。"],[[`0 2
X Y
X X
`,`UNKNOWN
UNKNOWN
`],[`3 3
A X
B Y
B Z
B A
A B
A A
`,`OK
OK
SAME
`],[`2 1
A 0
B 0
A B
`,`SAME
`]],["准备一个从编号到最终组号的索引。","先检查两位都存在，再比较两次查出的数据。"],`n, q = map(int, input().split())
teams = {}
for _ in range(n):
    person, team = input().split()
    teams[person] = team
for _ in range(q):
    first, second = input().split()
    if first not in teams or second not in teams:
        print("UNKNOWN")
    elif teams[first] == teams[second]:
        print("SAME")
    else:
        print("OK")
`,{concepts:["索引","多键查找","业务规则优先级"],approach:"区分「能否读取两条记录」和「如何比较记录」。一个字典即可回答这两类问题。",steps:["按编号维护最新组号。","查询先判缺失，避免取值触发 KeyError。","比较的是组号，不能用两个编号是否相同替代。"],time:"平均 O(n+q)。",space:"O(u)，u 为不同编号数。",pitfall:"把两次 get 的结果直接相等比较，会把两人都缺失判成同组。",extension:"同时维护组到成员的倒排索引，让改组更新两个方向。"}),t(20,o[4],"进阶","场次报名核验台",{background:"数据结构模块测评。活动站点需要实时维护报名顺序，并记录真正发过通知的人。",description:"处理 JOIN 场次 编号、DROP 场次 编号、SHOW 场次和 NOTIFY 场次 编号。JOIN 新增报名或保留旧位置；DROP 移除报名，不存在时忽略，重报名排到末尾。SHOW 列当前名单。NOTIFY 只在该人当前有效且从未在该场次成功通知时成功；同一场次的通知历史在撤销与重报后保留。",input:"第一行 q，然后 q 行命令，字段用空格分隔。每个场次独立维护状态。",output:"SHOW 输出当前报名顺序的编号，以单空格连接，空名单写「空」。NOTIFY 成功输出 SENT，已成功发送过输出 SKIP，当前无报名输出 UNKNOWN（优先于 SKIP）。最后输出一行「TOTAL 成功数」。",limits:"0 ≤ q ≤ 1500，场次与编号为 1–8 位英数字。输出的报名编号总数不超过 1500。一个编号可以属于多个场次，通知按场次分别计数。"},[`12
JOIN M B
JOIN M A
JOIN M B
SHOW M
NOTIFY M B
DROP M B
NOTIFY M B
JOIN M B
SHOW M
NOTIFY M B
JOIN N B
NOTIFY N B
`,`B A
SENT
UNKNOWN
A B
SKIP
SENT
TOTAL 2
`,"B 第一次参加 M 时收到通知。撤销后检查为 UNKNOWN，重报时已发记录仍在。N 可独立通知。"],[[`0
`,`TOTAL 0
`],[`6
SHOW M
DROP M B
NOTIFY M B
JOIN M A
DROP M A
SHOW M
`,`空
UNKNOWN
空
TOTAL 0
`],[`7
NOTIFY M B
JOIN M B
JOIN M A
NOTIFY M B
NOTIFY M B
NOTIFY M A
SHOW M
`,`UNKNOWN
SENT
SKIP
SENT
B A
TOTAL 2
`],[`6
JOIN M A
NOTIFY M A
DROP M A
JOIN M A
NOTIFY M A
SHOW M
`,`SENT
SKIP
A
TOTAL 1
`]],["先写出两个独立状态：当前报名和历史通知。","每场的当前报名用保序键，已发送的 (场次, 编号) 用集合。"],`rosters = {}
notified = set()
for _ in range(int(input())):
    parts = input().split()
    command, session = parts[:2]
    if command == "JOIN":
        rosters.setdefault(session, {})[parts[2]] = None
    elif command == "DROP":
        roster = rosters.get(session)
        if roster is not None:
            roster.pop(parts[2], None)
    elif command == "SHOW":
        print(" ".join(rosters.get(session, {})) or "空")
    else:
        code = parts[2]
        key = (session, code)
        if code not in rosters.get(session, {}):
            print("UNKNOWN")
        elif key in notified:
            print("SKIP")
        else:
            notified.add(key)
            print("SENT")
print("TOTAL", len(notified))
`,{concepts:["嵌套字典","插入顺序","复合键集合","性能分析"],approach:"定义两个状态不变量。当前名单按场次保存有效报名。通知集合只包含成功送达的场次、编号对。DROP 只影响前一个状态。",steps:["JOIN 与 DROP 维护场次内有序键。","SHOW 按当前字典顺序输出。","NOTIFY 先检查有效报名，再查历史发送。","输出唯一成功记录数。"],time:"平均 O(q+L)，L 为输出名单中的编号总数，编号长度有固定上界。",space:"O(q) 个索引条目。",pitfall:"撤销时同时清理通知历史会造成重复发送。只检查历史优先又会让已经撤销的人误得 SKIP。",extension:"增加 REPORT 命令，按每场首次成功送达的顺序输出通知流水。说明需要额外保存哪一份序列。"})],pe={introduction:"一批设备编号含空白、大小写混用和空行。以前可以用 for 逐项处理，再向结果列表 append。本课沿着那段循环推导出更紧凑的写法，明确哪些记录被丢弃，哪些记录只是换了值。",goals:["把只负责收集结果的循环改写为列表推导式，并能逐步还原成 for 与 if。","区分末尾的筛选条件和前部的条件表达式，预测结果的长度与顺序。","面对要记录错误、重复计算或修改状态的任务，能判断何时保留普通循环。"],prerequisites:"数据结构进阶中的列表和条件筛选，以及基础篇字符串方法。能用 append 收集循环结果。",version:"Python 3.12。列表推导式立即构造新列表，循环目标名称不会改绑同名的外部变量。",topics:[{title:"从 for 和 append 到推导式",explanation:["可迭代对象能依次提供其元素，for 可以逐项读取它。列表提供元素，字符串提供字符，range 提供整数，字典默认提供键。能用于 for 的对象通常也能放在推导式的 in 后。","[表达式 for 元素 in 来源] 建立一个新列表。先取得来源，再按遍历顺序绑定元素，逐次计算前面的表达式，并把结果收进列表。普通循环的 append(...) 里算什么，就把什么放到推导式前部。","[表达式 for 元素 in 来源 if 条件] 对每项先检查条件，通过才求表达式。过滤失败的数据不会进入结果，也不会执行表达式。例如先检查 n != 0 再计算 12 / n，可以跳过零而不触发除零。"],examples:[e("loop-and-expression","把有效温度转成温差","起步",`values = [17, -1, 25, 17]
from_loop = []
for value in values:
    if value >= 0:
        from_loop.append(value - 20)
from_expression = [value - 20 for value in values if value >= 0]
print(from_loop, from_expression)
print(values)
`,`[-3, 5, -3] [-3, 5, -3]
[17, -1, 25, 17]
`,"把原循环的筛选和 append 分别移到推导式对应位置。",["读到 17，条件成立，把 17 - 20 放进结果。","读到 -1，条件不成立，不执行减法。","另两个有效值继续按原顺序收集，重复 17 保留。"],"改成集合推导式会让重复温差合并。"),e("characters-from-string","提取并归一化货架标记","应用",`label = " A-2b c? "
letters = [char.upper() for char in label if char.isascii() and char.isalpha()]
print(letters)
print("".join(letters))
`,`['A', 'B', 'C']
ABC
`,"直接遍历字符串，并用两个条件确定哪些字符进入结果。",["for 逐个读出字符，包括空格。","先检查是否为 ASCII 字符，再检查是否为字母。","只有通过两道筛选才求大写，最后可合并成一行。"],"isalpha() 也接受许多非 ASCII 字母，若题目只接受英文字母，要明确字符范围。")]},{title:"筛选控制条数，条件表达式控制产出的值",explanation:["末尾的 if 负责是否产生结果。前部 a if 条件 else b 是条件表达式，先判断条件，再求被选中的一个分支。用它给每项贴标签，长度通常和输入一样。两种 if 能一起使用。先看尾部筛选是否通过，再决定产出哪个值。","两个紧跟的筛选 if 都要成立。写成 if low <= x <= high and x != missing 同样可以先验证范围再排除缺测值。条件有便宜的检查与昂贵的转换时，按从左到右的短路顺序安排，避免不必要的工作。","推导式适合表达「产生一个新容器」。如果要更新计数器、单独记录拒绝原因、跳出循环，或者一项要经历多步解析，使用普通 for 把操作步骤写出来。列表推导式会保存所有输出，减少几行代码不会改变算法增长率。"],examples:[e("filter-versus-label","同一批订单生成两份清单","起步",`orders = [-1, 0, 49, 50]
available = [x for x in orders if x >= 0]
labels = ["免运" if x >= 50 else "普通" for x in orders if x >= 0]
print(available)
print(labels)
`,`[0, 49, 50]
['普通', '普通', '免运']
`,"区分停用数据被过滤与正常数据获得标签。",["-1 被尾部 if 跳过。","0 是有效订单，前部表达式选择普通。","50 正好满足免运门槛，选中另一分支。"],"若只保留前部的条件表达式，停用订单也会被归到普通。"),e("when-loop-is-clearer","保留拒绝原因与合格数据","应用",`entries = ["18", "停机", "-2", "21"]
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
`,`[18, 21]
[('停机', '格式'), ('-2', '范围')]
`,"处理有多种错误原因的输入，保留可以单独调试的流程。",["尝试将每条文本转换为整数。","格式错误和越界都记录，但理由不同。","只有经过两道检查的值加入合格列表。"],"在推导式中调用两个会修改列表的函数，很难看清每条记录会去哪，且转换可能重复执行。")]}],comparisons:{headings:["写法","每项的处理","适用场景"],rows:[["[expr for x in xs if ok]","先判断，至多产出一项","剔除无效记录"],["[a if ok else b for x in xs]","二选一，必产出一项","完整保留顺序并逐项分级"],["显式 for 循环","可继续、退出、记录多个结果","校验与多个副作用"]]},applications:["清洗传感器读数时分别描述有效性和单位变换。","编制固定版式的名单时，缺失值可用条件表达式换成标记，避免行号错位。"],mistakes:[{symptom:"原来的列表有十行，标签表却只有六行",reason:"尾部 if 把四项去掉了。",fix:"需要逐行对应时，改用前部的条件表达式写出两种标签。",check:"空数据与全不满足条件时都检查结果长度。"},{symptom:"表达式偶尔因零值而停止",reason:"中间计算在确认分母合法之前执行了。",fix:"把判断写在筛选处，或用普通循环先验证。",check:"准备零值、刚达阈值和负数三种输入。"}],summary:["读法按实际执行排列：来源 → 循环目标 → 末尾条件 → 前部表达式。","列表推导式立即生成可重复读、按序保留重复项的结果。","先找出数据转换与筛选的边界，再决定是否改写成一行。"],next:"下一课把相同的执行思路用于构建字典、集合和多层结果。",exercises:[s("listcomp-iterable","辨认可迭代对象产生的元素",'直接遍历 {"东": 3, "西": 2} 会依次取得什么？',1,[["3、2","遍历字典的 values() 才取得这些值。"],["东、西","直接遍历字典按插入顺序给出键。"],["两个键值对","用 items() 才能迭代键值对。"]]),s("listcomp-order","追踪先筛选再计算","代码输出什么？",0,[["[6, 3]","零先被筛掉，只对 2 和 4 整除。"],["触发 ZeroDivisionError","计算只发生在通过筛选的项。"],["[0, 6, 3]","没有为零保留占位。"]],"print([12 // x for x in [0, 2, 4] if x != 0])",`[6, 3]
`),s("listcomp-label","追踪两处 if 的职责","代码输出什么？",2,[['["L", "L", "H"]',"尾部条件过滤 -1。"],['["H"]',"0 有资格进入结果。"],["['L', 'H']","过滤后保留 0 与 5，再分别选择标签。"]],'print(["H" if x >= 5 else "L" for x in [-1, 0, 5] if x >= 0])',`['L', 'H']
`),s("listcomp-loop-choice","选择适合诊断错误的写法","解析每条记录，格式不合法时记录原因并继续。优先怎么写？",1,[["把错误写到末尾 if 的判断里","条件判断通常不应同时修改错误列表。"],["用 for，分别处理成功和失败","每条记录的解析、异常与输出更容易定位。"],["用前部条件表达式直接调用 int","转换失败仍需要显式处理。"]]),n("A021","基础编程","筛选编号后统一格式，保留原来的出现顺序。"),n("A022","独立编程","保留每条读数的位置，并为有效和缺测项选择不同表示。"),n("A023","综合应用","将交易校验、符号转换与净额汇总组合起来。"),n("A024","拓展挑战","区分校准前的有效范围与校准后的分级。")],references:[r("列表推导式","tutorial/datastructures.html#list-comprehensions","核对循环改写与先筛后算。"),r("条件表达式","reference/expressions.html#conditional-expressions","核对 if-else 只计算被选择的分支。"),r("术语 iterable","glossary.html#term-iterable","核对可迭代对象的含义。")]},ce={introduction:"同一批展区记录可以变成查询表、唯一名单或分组报表。你需要决定每条记录产出键值对、唯一成员还是一个保留位置的元素，再安排多层循环的顺序。",goals:["用字典推导式构建、筛选和转换映射，预测重复键的覆盖时机。","用集合推导式在转换后去重，区别计数和收集唯一成员。","将多层推导式还原成循环，判断保留行边界、展开数据还是采用普通循环。"],prerequisites:"本模块列表推导式和上一模块的字典、集合。方括号访问元组项用法与列表索引相同。",version:"Python 3.12。字典推导式先计算键再计算值，这一求值顺序从 Python 3.8 起有语言保证。",topics:[{title:"从记录生成键值和唯一成员",explanation:["{键表达式: 值表达式 for item in rows if 条件} 先筛选记录，再计算键和值，最后把这对内容写入新字典。一个键多次出现时，最后通过筛选的值获胜，但键位置仍是首次写入的位置。若要按最新状态筛选，应先收齐最新值，再筛选字典。",'{表达式 for item in rows if 条件} 产出集合。转换发生在去重前，所以 "A" 和 "a" 转为小写后可以合并。集合元素和字典键必须可哈希，字典值可以是列表等可变对象。需要确定输出顺序时，用 sorted 或另存顺序。',"把编号映射成数量时可以用推导式转换；如果多个记录属于同一个编号且要累计，用循环更新计数。{word: words.count(word) for word in set(words)} 虽然能数对，但每个不同词要重扫整份列表。更好的做法是一次计数，再用字典推导式生成频次达到门槛的报告。"],examples:[e("last-write-filter","比较先筛事件与先取最新记录","起步",`rows = [("A", 5), ("B", 2), ("A", 0), ("C", 3)]
ever_positive = {row[0]: row[1] for row in rows if row[1] > 0}
latest = {row[0]: row[1] for row in rows}
available = {code: latest[code] for code in latest if latest[code] > 0}
print(list(ever_positive.items()))
print(list(available.items()))
`,`[('A', 5), ('B', 2), ('C', 3)]
[('B', 2), ('C', 3)]
`,"比较有撤回或零库存更新时，两种业务语义的实际区别。",["先筛会略过 A 的零值更新，A 仍出现在旧结果。","先写全量时 0 覆盖 5。","筛选最终映射后 A 消失，B 与 C 的顺序仍可预测。"],"报表描述「当前可用」时，筛选必须发生在覆盖之后。"),e("unique-and-counted","分别列出唯一标签与频次报告","应用",`raw = [" Red ", "blue", "RED", "", " green "]
names = [name.strip().lower() for name in raw if name.strip()]
unique = {name for name in names}
counts = {}
for name in names:
    counts[name] = counts.get(name, 0) + 1
repeated = {name: counts[name] for name in counts if counts[name] > 1}
print(sorted(unique))
print(repeated)
`,`['blue', 'green', 'red']
{'red': 2}
`,"区分规范化、去重与累计三步。",["去空白和转小写后统一标签。","集合只保存不同标签。","对仍保有重复记录的列表计数，再从映射输出重复项。"],"先把输入全部转成集合就无法恢复每项的出现次数。")]},{title:"多层循环与嵌套结果",explanation:["[expr for row in rows for value in row if ok] 对应外层逐行、内层逐项、最里层筛选和产出。每换一行都会重新开始内层。筛选可以放在依赖的名称一旦获得的位置，例如先筛行，再走内层元素。","[[expr for value in row] for row in rows] 的外层每次产出一个列表，行边界仍在。若输出要按原来的列组织，外层可以遍历列号，内层遍历行，再取每行的该列。这就是转置的基本思路。非整齐表必须决定缺项、填充或拒绝策略。","复杂表达式先写普通双循环，手推一行中的两个元素和第二行的首项，再考虑压缩。涉及多次查表、读写状态或三个以上嵌套时，可以先命名中间结果。构成所有组合也可能将时间和输出大小扩大为两份数据量的乘积。"],diagram:{caption:"从左向右确定嵌套顺序",text:`for row in rows          从第一行开始
  if row                 先判断这一行
    for value in row     每行重新遍历
      if value > 0
        收集 value × 2`},examples:[e("flat-and-grouped","展开库存与保留库房行","起步",`rows = [[0, 4], [], [2, 0, 3]]
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
`,`[8, 4, 6]
True
[[8], [], [4, 6]]
`,"对同一份不规则二维数据生成两种结构，并验算双层循环的等价结果。",["第一行只产出 8，第二行没有内层元素。","普通循环和展开推导式都把标量追加到同一份列表。","嵌套版将每行自己的列表作为外层的一项，空行仍在。"],"把内层列表拆掉会让行边界消失。"),e("matrix-by-column","把按设备记录的表转成按日期记录","应用",`devices = [[7, 0, 2], [3, 4, 9]]
columns = [[row[col] for row in devices] for col in range(3)]
print(columns)
print({number: values for number, values in enumerate(columns, 1)})
`,`[[7, 3], [0, 4], [2, 9]]
{1: [7, 3], 2: [0, 4], 3: [2, 9]}
`,"用外层决定报告次序，内层沿原行取值。",["外层先定 col 为 0，然后遍历两个设备行。","第一列收集两次 row[0]，形成 [7, 3]。","每列重复这个过程，再给各日期列表编号。enumerate 会同时提供从 1 开始的序号与对应值，解包写法将在第四课系统讲解。"],"外层如果先遍历设备，就仍按设备组织，只是在复制原表。")]}],comparisons:{headings:["形式","产出单元","适用位置"],rows:[["{key: value for ...}","键值对，后值覆盖","索引、字段变换与报告"],["{expr for ...}","唯一元素","归一化去重"],["[expr for row in rows for ...]","各行的标量进一张表","展开"],["[[expr for ...] for row in rows]","每行先生成自己的列表","保持层次或调整行列"]]},applications:["生成站点编码到最新库存的映射，以及同一批数据的唯一类别清单。","按批次与工位拆分多层结果。先写出期望的外层顺序，再决定推导式中谁先循环。"],mistakes:[{symptom:"报告里保留了已经撤回的条目",reason:"零值在参与重复键覆盖之前被筛掉。",fix:"先构造最新映射，再在结果上做筛选。",check:"用某键先正后零与先零后正作对照。"},{symptom:"遍历顺序与预期相反",reason:"把应作为内层的循环提前。",fix:"先写双层 for，逐层核对目标名称定义和产出顺序。",check:"用带空行且行宽不等的小数据手推。"}],summary:["容器类型决定重复与顺序语义。字典保存键值关系，集合按产出值去重。","推导式中的 for 和尾部 if 从左向右对应嵌套的循环与判断。","累计需要多次读写状态时，先用循环构造频次，再用推导式产生报告。"],next:"下一课保留这种表达式结构，把结果改成按需产生。",exercises:[s("mapcomp-overwrite","检查重复键覆盖","代码输出什么？",1,[["{'A': 2, 'B': 7}","A 的最后一项覆盖第一次写入。"],["{'A': 0, 'B': 7}","A 保持插入位置，值更新为 0。"],["{'B': 7, 'A': 0}","更新已有键不改变它的顺序。"]],`rows = [("A", 2), ("B", 7), ("A", 0)]
print({row[0]: row[1] for row in rows})`,`{'A': 0, 'B': 7}
`),s("mapcomp-set-key","理解转换后集合去重","代码输出什么？",2,[["3","原来有三个不同拼法，转小写后会合并。"],["1","X 仍是另一个成员。"],["2","得到 ab 和 x 两个成员。"]],'print(len({word.lower() for word in ["Ab", "ab", "X"]}))',`2
`),s("mapcomp-inner-order","推演两层循环的输出顺序","先产出哪两对值？",0,[["(1, 8) 和 (1, 9)","外层停在 1 时内层已经取遍 8、9。"],["(1, 8) 和 (2, 8)","这要求先把 y 放在外层。"],["(2, 9) 和 (1, 8)","推导式按给定顺序遍历。"]],"print([(x, y) for x in [1, 2] for y in [8, 9]])",`[(1, 8), (1, 9), (2, 8), (2, 9)]
`),s("mapcomp-choose-count","判断计数时是否应丢弃重复信息","统计出现至少 3 次的标签，应该怎样组织？",2,[["用集合归一化后再数","一旦去重，无法得知原频次。"],["逐种标签执行 input 列表的 count","能做对，但每种标签都重扫。"],["一次遍历累加，再筛选频次字典","保留频次且只需要一次计数扫描。"]]),n("A025","基础编程","按版本与到达顺序解决冲突，再按阈值构造报表。"),n("A026","独立编程","先标准化、再按条件收集唯一预约代号。"),n("A027","综合应用","一次计数，再用映射筛选获最高票的候选。"),n("A028","拓展挑战","按行列重组不规则输入，并为缺失位置填充。")],references:[r("列表、集合和字典的显示式","reference/expressions.html#displays-for-lists-sets-and-dictionaries","核对多层从句、键值求值顺序和覆盖规则。"),r("嵌套列表推导式","tutorial/datastructures.html#nested-list-comprehensions","对照循环与按列构造的新结构。"),r("字典插入顺序","library/stdtypes.html#mapping-types-dict","核对更新值和删除后重插的顺序。")]},de={introduction:"有一条很长的记录流，只需要知道第一项超标的位置，或合格金额的总和。每项都先算好并存进列表，会带来额外工作。本课把生成结果和使用结果拆开，观察每次读取究竟推进了哪一步。",goals:["用 iter 和 next 跟踪读取位置，准确预测重复读取与耗尽。","解释生成器表达式的创建时机和逐项求值时机，使用 next、sum、any、all 处理按需结果。","估算物化结果和逐项处理的内存差异，能为需要二次读取的任务选用合适的结构。"],prerequisites:"会用 for 和推导式，知道 input 读一行，能用异常类型区分失败原因。",version:"Python 3.12。以下例子讨论同步迭代。模块里只用生成器表达式。",topics:[{title:"可迭代对象、迭代器与耗尽",explanation:["可迭代对象能交给 iter(...) 得到迭代器。迭代器提供下一项并保存进度。两次 iter(列表) 通常得到各自从头开始的列表迭代器，而 iter(已有迭代器) 返回它本身。对同一个迭代器调用 next 多次，就是沿同一遍历继续向前。","next(it) 读完时抛出 StopIteration；next(it, 默认值) 在耗尽时直接返回默认值。for 会先用 iter 得到迭代器，再不断读取，遇到 StopIteration 自动结束。sum、list 和许多其他接收可迭代对象的函数同样会消耗迭代器。","(表达式 for 项 in 来源 if 条件) 会产生一个生成器对象，它本身就是迭代器。创建表达式时最左侧的来源已经求值并获得迭代器。之后每次取下一项才继续运行筛选、后续 for 和结果表达式。一次 next 可以跳过多个未通过的项。"],examples:[e("two-cursors","两位审核员独立翻阅同一名单","起步",`names = ["东", "西", "南"]
first = iter(names)
second = iter(names)
print(next(first), next(first))
print(next(second))
print(list(first))
print(next(first, "读完"), iter(first) is first)
`,`东 西
东
['南']
读完 True
`,"区分容器内容和迭代器的读取位置。",["两个对列表的 iter 调用得到独立游标。","第一位读掉两项，第二位仍从东开始。","list(first) 收集剩余的南，之后 first 已耗尽。"],"赋值 second = first 只是同一迭代器的另一个名称，两个读者会共享进度。"),e("source-versus-body","观察建流与实际转换的两个时点","应用",`def open_batch():
    print("取得批次")
    return [0, 2, 4]

def scale(value):
    print("换算", value)
    return value * 10

stream = (scale(x) for x in open_batch() if x > 0)
print("开始取")
print(next(stream))
print(list(stream), list(stream))
`,`取得批次
开始取
换算 2
20
换算 4
[40] []
`,"通过输出追踪左侧来源和前部表达式何时运行。",["创建 stream 时先调用 open_batch。","第一次 next 跳过零，找到 2 才调用 scale。","第一次 list 读完 4，第二次 list 已无剩余。"],"把生成器理解成所有代码都延迟。最左侧 in 后的来源已经在创建时计算。")]},{title:"按需消费与空间取舍",explanation:["列表推导式先计算全部结果，之后可以索引、取长度或重复遍历。生成器只保存暂停所需的迭代状态和当前相关对象，通常无需为整个结果分配列表空间。若来源已经是一个大列表，生成器仍然引用它。list(stream) 也会把剩余内容全部存入内存。","sum 会读完所有结果；next 只取第一条匹配，any 找到第一个真值即可结束，all 找到第一个假值即可结束。空输入时 sum 为 0、any 为 False、all 为 True。业务规定必须有至少一条记录时，要额外检查为空。","只要结果全部用到，生成器和列表版本通常执行同阶的转换。节省的是结果列表及可能不需要的后缀部分。需要保存全部结果以重复使用时可建列表，需要同时计算几种汇总时，用一次普通循环维护计数与合计通常更直观。"],examples:[e("short-circuit-checks","告警出现就停止继续复核","起步",`def is_alarm(number):
    print("查", number)
    return number >= 8

print(any(is_alarm(x) for x in [2, 8, 10]))
print(all(x >= 0 for x in []))
print(next((x for x in range(3) if x >= 3), "无"))
`,`查 2
查 8
True
True
无
`,"观察任何一个告警与空集规则，并用默认值报告未找到。",["any 请求 2、8 的结果，看到真值就结束，不检查 10。","all 在空输入找不到反例，因此为真。","range(3) 没有任何值符合条件，next 返回默认标记。"],"把 any([is_alarm(x) for ...]) 传列表会在调用 any 前执行全部检查。"),e("one-pass-totals","单次遍历同时给出净额和记录数","应用",`records = [("ok", 4), ("no", 2), ("ok", -1)]
amounts = (row[1] for row in records if row[0] == "ok")
print(sum(amounts), sum(amounts))

amounts = (row[1] for row in records if row[0] == "ok")
count = total = 0
for amount in amounts:
    total += amount
    count += 1
print(total, count)
`,`3 0
3 2
`,"检查同一结果被消费两次的陷阱，并改成一次遍历。",["第一次 sum 读完两笔净额。","第二次 sum 收到耗尽的迭代器，结果为 0。","重建生成器后，在同一轮循环同时维护和与条数。"],"把一次性迭代器传给两个汇总函数会让第二次汇总看到空数据。")]}],comparisons:{headings:["工具","何时计算","结果怎样使用"],rows:[["列表推导式","创建时完成全部结果","可索引、可反复迭代"],["生成器表达式","先取最左侧来源，读取时再计算项","按顺序且通常一次性"],["普通循环","每轮执行写明的步骤","便于同时维护多个量与提前退出"]]},applications:["从大量记录中找首个匹配值，用 next 加默认值。","计算汇总时先看后续是否需要重复读取同一批结果。只有汇总可逐项消费，需要明细和审计时可物化或一次维护所有统计量。"],mistakes:[{symptom:"第二次汇总突然为零",reason:"首个消费者已经读完迭代器。",fix:"来源可重读时重新建流，或在一次循环维护两种汇总。",check:"用两笔非零数据先运行两次 sum，再比较同一次循环的结果。"},{symptom:"查到首项超标仍扫描很久",reason:"判断之前先用列表推导式算完全部结果。",fix:"将生成器表达式直接传给 any 或 next。",check:"在转换函数里打印已访问项，用第一条就超标的输入观察。"}],summary:["可迭代对象可交给 iter，迭代器自己保存下一次读取位置。","生成器按请求产出一项，耗尽的生成器不会自动重启。","按需求值可节省结果内存和不必要的后续工作。按多次读取、访问方式及输出需求选择结构。"],next:"下一课把迭代产生的元组拆成各字段，用配对和位置生成更清晰的报表。",exercises:[s("gen-consumed","追踪 next 之后还剩什么","下面输出什么？",2,[["2 [2, 4]","第一次 next 已经取走 2。"],["[2, 4] 2","print 的实参从左到右求值。"],["2 [4]","先消费 2，剩余列表只有 4。"]],`g = (n * 2 for n in [1, 2])
print(next(g), list(g))`,`2 [4]
`),s("gen-source","区分来源和结果表达式的求值时机","创建 (convert(x) for x in get_rows()) 时，哪个调用已经发生？",0,[["get_rows()","最左侧输入来源立即求值。"],["convert(x)","结果表达式等读取时才运行。"],["两个调用都执行","只有最左侧来源必须立即求值。"]]),s("gen-any","预测 any 的短路行为","下面一共打印几行？",1,[["1 行","转换函数也会为首条以及命中项打印。"],["3 行","读取 1 与 3，再打印 True。"],["4 行","命中 3 后不再读取 5。"]],`def ready(x):
    print(x)
    return x > 2
print(any(ready(x) for x in [1, 3, 5]))`,`1
3
True
`),s("gen-memory","辨认逐项处理的空间条件","逐行遍历文件并只汇总，不保存明细。为什么可以节省额外内存？",2,[["所有输入都自动压缩","按需生成不压缩文件内容。"],["sum 只读第一项","sum 需要读取每项。"],["文件提供一行就处理一行，无需存储转换后的整份列表","工作内存主要随当前行与迭代状态增长。"]]),n("A029","基础编程","用按需求和提取有效读数的净变化。"),n("A030","独立编程","在很大的候选范围里按需取第一个合格编号。"),n("A031","综合应用","一次迭代同时核对记录数、总额和异常数量。"),n("A032","拓展挑战","推演迭代器被部分消费后，两个审核阶段的结果。")],references:[r("迭代器","howto/functional.html#iterators","核对 iter、next 与迭代器耗尽。"),r("生成器表达式","reference/expressions.html#generator-expressions","核对最左侧来源求值与其余部分按需执行。"),r("内置函数","library/functions.html#any","核对 any、all、next 和 sum 的消费规则。")]},ue={introduction:"报名编号、分数和附加标签经常打包在同一行。把这些字段拆给有意义的名称，能避免一直写 row[0] 和 row[1]。本课从赋值拆包走到数据配对和函数调用，最后用一份报表串起整个模块。",goals:["在元组、列表与嵌套记录中使用普通和星号赋值，预测不足、过多与空剩余。","用 enumerate、zip 和 items 配对与拆字段，判断该截断还是检查列长。","区分函数定义时的收集与调用时的展开，用 * 和 ** 传递字段并处理重复名称。"],prerequisites:"前面三课，以及基础篇的函数调用、返回值、异常和字典。",version:"Python 3.12。zip 的 strict 参数自 Python 3.10 提供，会在实际迭代时检查长度。",topics:[{title:"分配固定字段和可变长度的中段",explanation:["name, score = record 从 iterable 依次拆出两项赋给两个名称。没有星号时，数量必须恰好相同。等号右边先求值，随后才给左边赋值，因此 a, b = b, a 可以交换。像 who, (score, place) = row 这样的写法会按两层形状核对数量。","start, *middle, end = row 先分配头尾，星号目标得到未被分配的所有项组成的新列表，即使来源是元组且剩余为空。每层最多一个星号目标。固定位置不够时仍会报 ValueError。","构造新容器时方向相反。[*left, *right] 展开两份来源并组成新外层列表，(*left, *right) 生成元组。{**defaults, **overrides} 把映射展开进新字典，右侧同名键覆盖。加星号取出元素，不会深拷贝其中的可变对象。"],examples:[e("nested-swap","交换坐标并拆出分区字段","起步",`records = ("北门", (3, 5))
station, (row, col) = records
row, col = col, row
first, *labels, last = ("A12", "优先", "免检", "B7")
print(station, row, col)
print(first, labels, last)
`,`北门 5 3
A12 ['优先', '免检'] B7
`,"分别检查嵌套结构、交换与星号剩余。",["外层的第二项是一对坐标，所以对应内层括号。","交换时先取得原 col 与 row。","星号把头尾之间的项目收进列表。"],"只写 station, row, col = records 时外层只有两项，会因数量不足失败。"),e("collect-expand","拆分已有标签，再合并到新批次","应用",`first, *optional, last = ["A", "Z"]
extended = [first, *optional, "新增", last]
pair = (*["东"], *["西"])
print(optional, extended, pair)
`,`[] ['A', '新增', 'Z'] ('东', '西')
`,"把同一个星号的收集和展开方向并排对照。",["赋值左边的星号收集零项，生成空列表。","新列表展开空列表，没有额外一项。","元组内的两个星号分别展开各自的来源。"],"用 [first, optional, last] 会把 optional 整个作为一个嵌套元素。")]},{title:"对齐列、编号和遍历映射",explanation:["enumerate(data, start=1) 每次提供 (序号, 元素)，常写 for number, item in ...。zip(a, b) 每次从两份数据的对应位置各取一项，组成一个元组。zip 也是一次性迭代器，默认遇到较短的输入便结束。","数据要求行数相等时，使用 zip(..., strict=True) 或对已有列表先比较长度。strict=True 在实际读取发现长短不一致时抛 ValueError，已经读出的前缀不会撤销。若要求整份报表同时发布，先验证长度或收集全部配对，再输出。","d.items() 提供键值对，适合写 for code, status in d.items()。解包也能作为推导式的循环目标，例如 [code for code, score in pairs if score >= 60]，把有意义的名称直接用于条件与结果。"],examples:[e("pairs-and-ranks","对齐编号和积分并标注原来行号","应用",`codes = ["A", "B", "C"]
scores = [20, 9, 10]
matched = zip(codes, scores, strict=True)
qualified = [(position, code) for position, (code, score) in enumerate(matched, 1) if score >= 10]
print(qualified)
print([code for code, score in {"C": 10, "B": 9}.items() if score >= 10])
`,`[(1, 'A'), (3, 'C')]
['C']
`,"使用嵌套解包获取序号、编号和分数。",["zip 提供编号与积分元组。","enumerate 再包一层序号，循环目标也按两层形状写。","筛选发生在编序号之后，因此 C 仍保留 3。"],"过滤后再 enumerate 会让 C 成为 2，只适合需要重新排名的报告。"),e("zip-strict","检查长度错误发生在哪次取值","起步",`print(list(zip(["A", "B"], [7])))
paired = zip(["A", "B"], [7], strict=True)
print(next(paired))
try:
    print(next(paired))
except ValueError:
    print("列数不一致")
`,`[('A', 7)]
('A', 7)
列数不一致
`,"观察默认截断，以及 strict 的延迟失败。",["默认只保留成对前缀。","strict 版本创建时不替你检查整个输入。","第二次 next 发现 B 没有积分，引发异常。"],"如果不消耗迭代器到对齐结果末端，可能根本观察不到不匹配。")]},{title:"调用时展开，定义时收集",explanation:["调用 print(*values) 时，把可迭代对象拆成若干位置实参。函数调用可以写 f(*left, *right, **options)；双星号展开的是映射，键必须是字符串，会按对应参数名传递。重复提供同一个关键字或重复绑定同一个形参会报 TypeError。","定义 def f(*args, **kwargs) 时方向反过来。args 收集额外位置实参为元组，kwargs 收集额外关键字实参为字典。args、kwargs 是常用名称，星号才决定机制。需要让调用者看懂必填项时，优先写出明确参数名。","字典合并与函数调用的冲突规则不同。{**defaults, **change} 会先形成一个只含最终键的字典，再用 f(**merged) 传入很合适。直接 f(**defaults, **change) 遇到同名键会失败。"],examples:[e("arguments-in-out","用列表字段和设置字典生成小票","应用",`def receipt(*items, **options):
    print(type(items).__name__, options["prefix"])
    print(options["prefix"], *items, sep=options["sep"])

defaults = {"prefix": "清单", "sep": "|"}
selected = {**defaults, **{"prefix": "领用"}}
receipt(*["灯", "伞"], *["绳"], **selected)
try:
    receipt(**defaults, **selected)
except TypeError:
    print("关键字重复")
`,`tuple 领用
领用|灯|伞|绳
关键字重复
`,"跟踪实参展开到参数收集的过程，并验证覆盖规则。",["两个位置列表展开后合成三个实参，被 items 收为元组。","合并字典已消解同名键，双星号传给 options。","直接展开两个含相同键的映射时，在调用前就发现冲突。"],"把列表直接作为一个位置实参，会收到单项元组，不能逐项输出。")]}],comparisons:{headings:["写法","处理方向","常见用途"],rows:[["head, *rest = values","收集剩余项为列表","变长记录拆字段"],["f(*values, **options)","展开位置与关键字","把已有数据交给接口"],["def f(*args, **kwargs)","多余实参收为元组和字典","转发或接收变长参数"],["{**base, **patch}","合并映射，右侧覆盖","形成最终配置后再调用"]]},applications:["为从不同渠道读取的列加原始编号和对齐检查，再按业务规则筛选。","用拆包把一条记录的主要字段、可选标签和结束字段分开，随后按名称计算。"],mistakes:[{symptom:"两列长度不同，程序却没有报错",reason:"默认 zip 只读能配对的前缀。",fix:"确实要求等长时先比较长度，或用 strict=True 并检查完整迭代。",check:"让每一侧分别多一项，并检查没有部分报表。"},{symptom:"合并配置没报错，直接调用却提示重复参数",reason:"字典构造覆盖同名键，函数调用不接受重复关键字。",fix:"先合并成最终映射，再展开一次。",check:"至少准备一个双方共有的键及一个独有键。"}],summary:["普通解包要求字段数精确匹配。星号目标收集剩余项为列表。","enumerate 记录原位置，zip 对齐列，items 提供键值对。","赋值与定义里的星号负责收集，调用和字面量里的星号负责展开。"],next:"完成对齐报表测评后，下一模块将用参数绑定、作用域和递归深入解释函数的执行。",exercises:[s("unpack-rest","判断两端分配与星号剩余的类型","输出是什么？",1,[["1 () 9","星号赋值收集到列表，即使原对象是元组。"],["1 [] 9","两项被两端取走，剩余为空列表。"],["触发 ValueError","输入数量足够填满固定目标。"]],`head, *middle, tail = (1, 9)
print(head, middle, tail)`,`1 [] 9
`),s("unpack-zip-default","手推对齐结束和原编号","代码输出什么？",0,[["[(1, ('A', 7))]","zip 只产生一对，enumerate 从 1 开始。"],["[(0, ('A', 7))]","第二个参数设置了起点 1。"],["[(1, ('A', 7)), (2, ('B', None))]","默认 zip 不会自动填补缺失。"]],'print(list(enumerate(zip(["A", "B"], [7]), 1)))',`[(1, ('A', 7))]
`),s("unpack-conflict","判断函数关键字与字典合并冲突行为","options 和 extra 都有 sep 键。怎样让 extra 的 sep 生效？",2,[['直接 print("A", "B", **options, **extra)',"调用阶段遇到重复关键字会抛 TypeError。"],["用 *options, *extra 展开","展开字典作位置实参得到它的键，不会绑定 sep。"],["先构造 {**options, **extra}，调用时展开这一份映射","后写键覆盖，最终每个关键字只出现一次。"]]),s("unpack-shape","推导读取配对记录时的目标形状",'若循环得到 (2, ("B", 10))，如何同时得到 2、B、10？',1,[["position, code, amount = value","外层只有两个位置。"],["position, (code, amount) = value","左侧保留了序号和记录两层形状。"],["(position, code), amount = value","整数 2 无法被拆成两个字段。"]]),n("A033","基础编程","拆出变长记录的两端与全部中间字段。"),n("A034","独立编程","核对两列等长，从原始行号生成筛选报表。"),n("A035","综合应用","将多来源的参数展开与配置优先级结合起来。"),n("A036","拓展挑战","完成模块测评，从对齐的两列中生成去重后的事件报表。")],references:[r("赋值语句","reference/simple_stmts.html#assignment-statements","核对嵌套目标和星号收集的规则。"),r("内置函数 zip","library/functions.html#zip","核对严格配对时何时检测不等长。"),r("参数列表解包","tutorial/controlflow.html#unpacking-argument-lists","对照位置、关键字展开和变长函数参数。"),r("调用表达式","reference/expressions.html#calls","核对重复关键字和绑定冲突。")]},fe=[t(21,l[0],"入门","校验展位编号",{background:"扫码机把大小写混用的展位编号写在同一行，部分编号来自旧系统。",description:"只保留大小写不敏感的 EX- 前缀且其后全为 ASCII 数字的编号。输出时将前缀统一成大写，保留编号中的零和出现次序。",input:"一行以空格分隔的编号，可以为空。",output:"用一个空格连接有效编号，无结果时输出「空」。重复的有效编号仍逐次输出。",limits:"0–500 个编号，每个 1–20 字符，可含非 ASCII 字符。不接受没有数字后缀的编号。"},[`ex-02 A2 EX- EX-02 EX-２ Ex-7
`,`EX-02 EX-02 EX-7
`,"全角 ２ 不属于 ASCII，保留两次有效的 EX-02。"],[[`
`,`空
`],[`EX-0 ex-00 ex00
`,`EX-0 EX-00
`],[`EX--1 EX-4Z EX-５
`,`空
`]],["先统一前缀大小写，再判断原来是否以 EX- 开始。","后缀要同时满足 isascii() 和 isdecimal()。"],`tokens = input().split()
upper = [token.upper() for token in tokens]
valid = [token for token in upper if token.startswith("EX-")
         and token[3:].isascii() and token[3:].isdecimal()]
print(" ".join(valid) or "空")
`,{concepts:["字符串遍历与归一化","复合筛选","保序与重复"],approach:"字符形式是业务数据，保留字符串后缀以免丢失前导零。先规范前缀，再逐项检查是否符合编号结构。",steps:["拆出所有编号并转为大写。","验证前缀、ASCII 和非空数字后缀。","按原输入次序连接有效编号。"],time:"O(s)，s 为输入字符数。",space:"O(s)。",pitfall:"isdecimal() 本身接受全角数字。转 int 还会丢前导零。",extension:"额外报告无效编号的位置，保留其原样便于回查。"}),t(22,l[0],"入门","保持读数槽位",{background:"温度屏幕每个槽位有固定编号。停机时该位置显示 NA，其他位置显示相对参考温度的偏差。",description:"把缺测标记 -999 换成 NA，其他数值减去参考温度，保留所有输入项的位置。",input:"第一行参考温度，第二行是一行以空格分隔的整数读数，可以为空。",output:"以一个空格连接所有结果。无读数时输出「空」。",limits:"0–600 条读数，参考温度 -100–100。读数是 -999 或 -100–100 的整数。0 与负偏差均应输出。"},[`20
21 -999 20 17 -999
`,`1 NA 0 -3 NA
`,"第二和第五个位置缺测，其他槽位照常显示。"],[[`0

`,`空
`],[`-10
-999 -999
`,`NA NA
`],[`-3
-3 -4 0
`,`0 -1 3
`]],["需要保留槽位，所以每项都必须有产出。","在推导式前部用 NA if ... else ...。"],`reference = int(input())
readings = [int(text) for text in input().split()]
labels = ["NA" if value == -999 else str(value - reference) for value in readings]
print(" ".join(labels) or "空")
`,{concepts:["条件表达式","列表变换","占位语义"],approach:"把每个读数变成一个字符串。条件表达式选择缺测标记或正常偏差。",steps:["解析参考值与全部读数。","逐项在两种表示之间选择。","保持读数顺序输出。"],time:"O(n)。",space:"O(n)。",pitfall:"在末尾用 if 排除 -999 会错位。",extension:"再输出缺测的原始槽位编号，保持主报告格式。"}),t(23,l[0],"基础","大额交易净额",{background:"平台只核对达到指定门槛的已结算交易。退款和收入都可能达到门槛。",description:"选出状态 OK 且金额绝对值不低于门槛的交易，保留金额符号与输入顺序，统计这些交易的净额。",input:"第一行 n limit，随后 n 行为交易状态与整数金额。状态是 OK 或 HOLD。",output:"首行以一个空格连接选中的金额，空写「空」。第二行输出净额。",limits:"0 ≤ n ≤ 1000，0 ≤ limit ≤ 10^4，金额在 -10^4–10^4。limit 为 0 时，已结算的零金额也保留。"},[`5 20
OK 20
HOLD -90
OK -26
OK 19
OK -20
`,`20 -26 -20
-26
`,"门槛用绝对值判断，净额保留退款的负号。"],[[`0 0
`,`空
0
`],[`3 0
HOLD 0
OK 0
OK 1
`,`0 1
1
`],[`4 4
OK -3
HOLD 6
OK 4
OK -4
`,`4 -4
0
`]],["用结构化记录存放已解析状态和金额。","在筛选条件里用 abs，产出表达式使用原金额。"],`n, limit = map(int, input().split())
rows = []
for _ in range(n):
    status, amount = input().split()
    rows.append((status, int(amount)))
kept = [row[1] for row in rows if row[0] == "OK" and abs(row[1]) >= limit]
print(" ".join(map(str, kept)) or "空")
print(sum(kept))
`,{concepts:["多条件筛选","转换与筛选分离","净额"],approach:"先把金额解析为整数，再一次筛选出需要同时显示和加总的资料。",steps:["读入结构化记录。","先确认状态，再比较金额大小。","打印保留列表，以原值求和。"],time:"O(n)。",space:"O(n)。",pitfall:"将 abs(amount) 当产出会把退款变成收入。",extension:"同时报告拒绝条数与分类理由，比较普通循环和列表推导式的表达效果。"}),t(24,l[0],"进阶","校准后的巡检标记",{background:"设备数据须先通过原始范围和状态校验。通过校验的读数加上校准偏移，再按独立阈值对外发布告警。",description:"仅处理状态 OK 且原始读数位于 [low, high] 的记录。校准值等于原读数加 bias。校准值大于或等于 alarm 时为 ALERT，否则为 NORMAL。",input:"首行 n low high bias alarm。随后 n 行为设备编号、原始整数读数、状态（OK 或 BAD）。",output:"首行合格数。然后按输入顺序逐行输出「编号 校准值 标签」。同一编号的多条记录分别保留。",limits:"0 ≤ n ≤ 500，数值均在 -1000–1000，low ≤ high，编号为 1–12 位英数字。没有有效记录时只输出 0。"},[`5 10 20 3 20
Z 17 OK
A 20 BAD
B 20 OK
Z 10 OK
C 9 OK
`,`3
Z 20 ALERT
B 23 ALERT
Z 13 NORMAL
`,"先按原值校验，校准后超出旧范围仍有效，等于阈值发告警。"],[[`0 0 0 0 0
`,`0
`],[`3 0 2 -5 -5
E 0 OK
F 2 OK
G 3 OK
`,`2
E -5 ALERT
F -3 ALERT
`],[`3 -2 -2 1 0
C -2 OK
C -2 OK
C -1 OK
`,`2
C -1 NORMAL
C -1 NORMAL
`]],["先产出通过校验的 (编号, 校准值)。","再对校准值分级，避免重新验证它是否在原始区间。"],`n, low, high, bias, alarm = map(int, input().split())
readings = []
for _ in range(n):
    code, raw, state = input().split()
    readings.append((code, int(raw), state))
valid = [(row[0], row[1] + bias) for row in readings
         if row[2] == "OK" and low <= row[1] <= high]
labels = ["ALERT" if row[1] >= alarm else "NORMAL" for row in valid]
print(len(valid))
for i in range(len(valid)):
    print(valid[i][0], valid[i][1], labels[i])
`,{concepts:["按原值过滤","变换结果","条件表达式"],approach:"分开校验和分级，第一步的数值是原读数，第二步的数值才是偏移后的读数。",steps:["解析记录含状态。","只为合法记录构造新的校准值和编号。","根据校准值选择标签并保序发布。"],time:"O(n)。",space:"O(n)。",pitfall:"用校准值验证原始边界会错收或错拒。",extension:"将报告分成两份列表，分别保留告警和正常数据的编号顺序。"})],me=[t(25,l[1],"入门","最新库存报表",{background:"离线设备恢复联网后可能补发旧库存，同一版本也可能收到更正。",description:"每个编号选版本最大的记录。同一最高版本按到达顺序取最后一条。选完再按门槛筛选，以编号在输入中首次出现的顺序输出。",input:"第一行 n limit，随后 n 行「编号 版本 当前数量」。旧格式「编号 当前数量」的版本按 0 处理，两种格式可混用。",output:"每个达标展位一行「编号 数量」。无达标项时输出「空」。",limits:"0 ≤ n ≤ 800，数量和门槛 0–1000，版本 0–10000，编号 1–12 位英数字。数量等于门槛也达标。"},[`7 2
Z 2 3
A 4 5
Z 2 0
B 0 2
A 2 1
Z 1 9
A 4 3
`,`A 3
B 2
`,"Z 的最高版本更正为 0，低版本的 9 不生效。A 与 B 达标，按首次出现顺序输出。"],[[`0 0
`,`空
`],[`2 0
B 3
B 0
`,`B 0
`],[`4 4
Z 0
C 9
Z 4
C 3
`,`Z 4
`],[`5 4
Z 0 0
A 4
Z 10000 4
Z 3
A 0 3
`,`Z 4
`]],["为每个编号保存版本和数量，并辨别什么时候允许覆盖。","同版本允许覆盖。完成全部决胜后，用字典推导式筛选。"],`n, limit = map(int, input().split())
latest = {}
for _ in range(n):
    code, *fields = input().split()
    version = int(fields[0]) if len(fields) == 2 else 0
    quantity = int(fields[-1])
    if code not in latest or version >= latest[code][0]:
        latest[code] = (version, quantity)
qualified = {code: quantity for code, (_, quantity) in latest.items() if quantity >= limit}
for code, quantity in qualified.items():
    print(code, quantity)
if not qualified:
    print("空")
`,{concepts:["字典推导式","按版本覆盖","插入顺序"],approach:"循环负责逐条决胜，推导式负责最终筛选。已有键的更新保留首次插入的位置。",steps:["识别两种输入格式并统一成版本与数量。","版本达到现有版本时覆盖。","从最终状态过滤并按首次出现顺序输出。"],time:"哈希平均 O(n)。",space:"O(n)。",pitfall:"用 > 会漏掉同版本更正。先筛选数量会保留已被更正的正库存。",extension:"另外记录各展位最后一次更新的位置，让输出可以选择首现或最近顺序。"}),t(26,l[1],"入门","可预约的标签集合",{background:"多个馆区提交预约标签。只有已开放馆区需要汇总，不同大小写写法表示同一个标签。",description:"在开放馆区的所有记录中，收集以大小写不敏感的 P- 开头且有非空后缀的标签。按小写形式去重。",input:"第一行开放馆区编号，可为空。第二行 n，之后 n 行每行先给馆区编号，再给零个或多个标签。",output:"输出按字典序升序的唯一标签，以一个空格连接。无结果时输出「空」。",limits:"0 ≤ n ≤ 200，每行最多 50 个标签。馆区编号 1–10 位英数字并区分大小写。标签为 1–18 位英数字或连字符。"},[`E W
4
E P-A p-a q-a
Z P-B
W P-C p-
W p-C P-d
`,`p-a p-c p-d
`,"Z 未开放，空后缀不收录，大小写变体合并。"],[[`
1
E P-A
`,`空
`],[`A
1
A
`,`空
`],[`A
2
A p-A P-Z p-a
A P- P-0
`,`p-0 p-a p-z
`]],["外层先根据馆区过滤。","内层展开当行的标签，前部表达式统一成小写后再去重。"],`opened = set(input().split())
rows = [input().split() for _ in range(int(input()))]
labels = {label.lower() for row in rows if row[0] in opened
          for label in row[1:] if len(label) > 2 and label.lower().startswith("p-")}
print(" ".join(sorted(labels)) or "空")
`,{concepts:["集合推导式","多层循环","规范化后去重"],approach:"把馆区过滤放到内层循环之前，只遍历需要汇总的标签。集合接收转换后的值。",steps:["建立已开放馆区的集合。","逐行先选馆区，再筛出合法标签。","转小写后自动去重，最后排序输出。"],time:"设 n 为输入字段数，k 为不同有效标签数，平均 O(n+k log k)。",space:"O(n)。",pitfall:"直接转换成列表会保留同一个标签的多个大小写变体。",extension:"改做按馆区分别去重的报表，比较外层采用字典还是列表。"}),t(27,l[1],"基础","推荐榜并列复核",{background:"活动方把不同大小写视为同一候选编号。达到最低有效票数后，公布所有并列最高的编号和票数。",description:"将候选编号统一为小写后计票。若全场最高票低于门槛或没有选票，输出「无」。否则按编号字典序输出全部并列最高者及票数。",input:"第一行 n minimum，随后 n 行各一个候选编号。",output:"无有效候选时只输出「无」。有时每行输出「编号 票数」。",limits:"0 ≤ n ≤ 1500，1 ≤ minimum ≤ 1500，编号 1–12 个英文字母。可合并多个大小写变体。"},[`6 2
Zed
ALPHA
alpha
zed
LOW
Low
`,`alpha 2
low 2
zed 2
`,"三组编号各两票，统一小写后按编号排。"],[[`0 1
`,`无
`],[`3 3
A
a
B
`,`无
`],[`5 3
x
X
B
x
b
`,`x 3
`]],["先在字典里单次累加频数。","从频数映射选出并列最高且达门槛的键。"],`n, minimum = map(int, input().split())
counts = {}
for _ in range(n):
    code = input().lower()
    counts[code] = counts.get(code, 0) + 1
best = max(counts.values(), default=0)
winners = {code: counts[code] for code in counts if counts[code] == best and best >= minimum}
for code in sorted(winners):
    print(code, winners[code])
if not winners:
    print("无")
`,{concepts:["归一化计数","字典筛选","并列排序"],approach:"用一次循环统计频数，再用推导式把最终频数转换成赢家报表。",steps:["转换每张票并更新自己的计数。","获取最高票，空票用默认值 0。","用门槛和最高票筛出所有赢家后排序。"],time:"设 k 为获胜编号数量，平均 O(n+k log k)。",space:"O(u)，u 为不同候选数。",pitfall:"用一次 max(counts, key=...) 只返回一个键，漏掉并列。",extension:"输出过门槛的所有候选，并按得票降序、字典序升序排行。"},{kind:"adapted",platform:"AtCoder",title:"Poll",id:"ABC155 C",level:"ABC C",url:"https://atcoder.jp/contests/abc155/tasks/abc155_c?lang=en",concepts:["投票计数","并列最大值"],adaptation:"保留全部最高频项的思想，添加输入大小写归一、空选票与最低得票门槛，并输出得票数。"}),t(28,l[1],"进阶","把巡检表转成逐日表",{background:"每台设备占一行，记录从第一天起的连续读数。有些设备提前停止了记录。",description:"把行转成按日期组织的列。任何设备当天没有记录时写 X，某天所有设备都没有记录仍应输出该列。",input:"第一行 r d，后 r 行各有 0–d 个整数，表示从第 1 天开始的连续记录。",output:"若 r 或 d 为 0，输出「空」。其余情况输出 d 行，每行按设备输入顺序给出 r 项，字段用空格分隔。",limits:"0 ≤ r,d ≤ 35，读数 -100–100。零是有效数据。空设备行仍占一个设备位置。"},[`3 3
8 0 6
2

`,`8 2 X
0 X X
6 X X
`,"设备三整行缺记录，设备二仅在第一天有值。"],[[`0 2
`,`空
`],[`2 0


`,`空
`],[`2 3

0 -1
`,`X 0
X -1
X X
`],[`1 1
-8
`,`-8
`]],["先让日期做外层循环。","取某行的列下标前，检查该行长度。"],`r, d = map(int, input().split())
rows = [[int(value) for value in input().split()] for _ in range(r)]
if r == 0 or d == 0:
    print("空")
else:
    by_day = [[str(row[day]) if day < len(row) else "X" for row in rows] for day in range(d)]
    for day in by_day:
        print(" ".join(day))
`,{concepts:["嵌套推导式","转置","边界填充"],approach:"输出的横纵顺序在外层选日期时确定，内层处理该日全部设备。",steps:["读入长度不同的各行。","用两层循环分别决定日期和设备。","每个位置在观测值与占位标记间选择。"],time:"O(rd+r)。",space:"O(rd+r)，含输入行表和逐日报告。",pitfall:"用 zip(*rows) 会在最短行结束，空行可能让结果完全消失。",extension:"另打印每个日期的缺测设备数，区分真实读数 0。"},{kind:"adapted",platform:"LeetCode",title:"Transpose Matrix",id:"867",level:"Easy",url:"https://leetcode.com/problems/transpose-matrix/",concepts:["转置","列优先输出"],adaptation:"把原题的矩形矩阵改为不等长设备记录，增加缺测填充、显式输出天数与空维度。"})],Ae=[t(29,l[2],"入门","按批汇总温差",{background:"校验员只看合格测量的净温差，不需要保留全部明细。",description:"每条记录包含实测温度和参考温度。选出实测温度不低于门槛的记录，并求所有「实测减参考」的总和。",input:"第一行 n floor，随后 n 行，每行两个整数 actual target。",output:"输出一个整数。没有合格记录时输出 0。",limits:"0 ≤ n ≤ 1500，温度和门槛均在 -500–500。合格记录仍可产生负温差。"},[`4 10
12 16
9 0
10 7
13 12
`,`0
`,"仅保留 -4、3、1，净温差为零。"],[[`0 0
`,`0
`],[`2 -4
-4 -6
-5 -7
`,`2
`],[`2 2
2 6
5 10
`,`-9
`]],["将每次读入看作按需产出一对测量。","只在条件满足时求差，并直接交给 sum。"],`n, floor = map(int, input().split())
rows = (tuple(map(int, input().split())) for _ in range(n))
print(sum(row[0] - row[1] for row in rows if row[0] >= floor))
`,{concepts:["生成器表达式","按需求和","筛选"],approach:"同时推迟读入和变换，sum 每次请求下一个合格温差。",steps:["定义每次读取一行的生成器。","直接按实测门槛筛选并转换。","sum 读到耗尽后给出净和。"],time:"O(n)。",space:"O(1) 条记录的额外工作空间。",pitfall:"用差值筛选会改变题意，负温差也可能达标。",extension:"再报告合格条数，用单循环避免生成器被两次消费。"}),t(30,l[2],"入门","预约号扫描",{background:"候选编号可能覆盖十亿个位置，系统只需要最早一个满足周期与避让规则的预约号。",description:"在闭区间 [left, right] 找最小的编号 k，使 k % cycle == slot，且 k 的十进制编号不含字符 banned。",input:"一行 left right cycle slot banned，前四项是整数，banned 是一个 ASCII 数字。",output:"输出第一个合格编号。若区间内没有则输出「无」。",limits:"1 ≤ left ≤ right ≤ 10^9，1 ≤ cycle ≤ 1000，0 ≤ slot < cycle。若区间超过 100000 项，保证前 5000 项内有解。"},[`15 30 3 0 1
`,`24
`,"15、18、21 含 1，第一个剩余的周期匹配是 24。"],[[`1 1000000000 2 0 7
`,`2
`],[`4 8 10 3 9
`,`无
`],[`7 7 1 0 7
`,`无
`],[`8 8 1 0 7
`,`8
`]],["range 本身不会生成整个编号列表。","用 next 读取首个通过两个条件的编号，指定缺省值。"],`left, right, cycle, slot, banned = input().split()
left, right, cycle, slot = map(int, (left, right, cycle, slot))
candidates = (code for code in range(left, right + 1)
              if code % cycle == slot and banned not in str(code))
print(next(candidates, "无"))
`,{concepts:["生成器与 range","next 默认值","短路筛选"],approach:"从最早编号开始，只扫描到首次合格或区间结束，避免为余下编号建立大列表。",steps:["用闭区间表达候选范围。","先检查余数，再判断是否包含禁用字符。","next 取第一项或缺省输出。"],time:"O(t) 次检查，t 为首解前的项数或无解时的区间项数，编号位数有界。",space:"O(1)。",pitfall:"先建立列表会迫使程序尝试处理整个大区间。",extension:"计算首个可能满足余数的候选，此后每次只增加 cycle。"}),t(31,l[2],"基础","增减账目一次核对",{background:"值班员需要在一次读取结算流水时给出总额、有效变更数、负变更数和单笔最大扣减。",description:"忽略所有 HOLD 以及所有零金额。对其他记录输出净额、条数、负金额条数和负金额绝对值的最大值。没有负金额时，单笔最大扣减输出 0。",input:"第一行 n，随后 n 行「状态 金额」，状态为 OK 或 HOLD。",output:"一行四个整数，按净额、有效变更数、负金额条数、单笔最大扣减的顺序输出。",limits:"0 ≤ n ≤ 1500，每笔金额在 -10^4–10^4。零金额即使状态 OK 也不计数。"},[`6
OK 10
HOLD -9
OK -3
OK 0
OK -5
OK 2
`,`4 4 2 5
`,"只使用 10、-3、-5、2，单笔最大扣减为 5。"],[[`0
`,`0 0 0 0
`],[`3
HOLD 8
OK 0
OK 1
`,`1 1 0 0
`],[`3
OK -7
OK -1
OK -7
`,`-15 3 3 7
`]],["生成器可以产出所有有效金额。","在同一个 for 内同时更新四个数。"],`rows = (input().split() for _ in range(int(input())))
amounts = (int(row[1]) for row in rows if row[0] == "OK")
total = count = negative = largest_debit = 0
for value in amounts:
    if value == 0:
        continue
    total += value
    count += 1
    if value < 0:
        negative += 1
        largest_debit = max(largest_debit, -value)
print(total, count, negative, largest_debit)
`,{concepts:["一次消费","生成器过滤","多状态汇总"],approach:"一条记录只处理一次，多个统计量同时更新。单笔最大扣减按负金额绝对值计算。",steps:["逐行生成字段，只转换已结算金额。","跳过零，维护净和与条数。","遇到负额同时维护负数条数与最大绝对值。"],time:"O(n)。",space:"O(1) 条记录的额外工作空间。",pitfall:"先 sum(amounts) 再循环读同一个 amounts 会少计全部后续统计。",extension:"增加单笔最大扣减首次出现时的原始行号，并处理并列。"}),t(32,l[2],"进阶","共享游标的巡检交接",{background:"两位审核员通过同一份游标顺序交接。第一位抽查若干合格项，第二位从当前位置查找告警，然后汇总告警之后的合格值。",description:"只将读数 ≥ floor 的记录视为合格。第一阶段最多领取 k 条合格记录。第二阶段从尚未消费的合格记录查找首条读数 ≥ alarm 的记录；查找经过的记录与告警本身均已消费。第三阶段求尚未消费的合格读数之和。",input:"第一行 n k floor alarm，随后 n 行，每行一个整数读数。",output:"三行依次为抽查的原始行号（单空格连接，空为「空」）、首条告警的原始行号（没有则 0）、余下读数总和。原始记录行号从 1 开始，头部参数行不计。",limits:"0 ≤ n,k ≤ 1500，读数、floor、alarm 均在 -1000–1000。没有告警时第二阶段读到末尾，第三阶段为 0。"},[`6 2 4 8
2
5
7
4
8
6
`,`2 3
5
6
`,"抽查消费 2、3，搜索消费 4、5，最终只剩第 6 条。"],[[`0 4 0 0
`,`空
0
0
`],[`4 0 0 7
1
7
6
8
`,`空
2
14
`],[`4 1 3 9
5
3
8
1
`,`1
0
0
`],[`2 9 2 0
1
2
`,`2
0
0
`],[`5 0 -9 -2
-1
-4
-9
-10
2
`,`空
1
-11
`]],["先在生成器中保留原行号与读数。","第一阶段用 next 重复取值，第二阶段的生成器直接继续消费同一个游标。"],`n, k, floor, alarm = map(int, input().split())
rows = ((position, int(input())) for position in range(1, n + 1))
valid = (row for row in rows if row[1] >= floor)
checked = []
for _ in range(k):
    row = next(valid, None)
    if row is None:
        break
    checked.append(str(row[0]))
hit = next((row for row in valid if row[1] >= alarm), None)
print(" ".join(checked) or "空")
print(hit[0] if hit is not None else 0)
print(sum(row[1] for row in valid))
`,{concepts:["迭代器状态","部分消费","嵌套按需筛选","短路"],approach:"写出消费边界。抽查、查找、汇总按顺序共用同一个 valid，后一步直接继承进度。",steps:["为每一条输入保留从 1 开始的位置，再过滤缺测。","领取阶段结束时不重建 valid。","只读到命中；最后对同一 valid 求和。"],time:"O(n)。",space:"O(min(n,k)+1)，含抽查行号。",pitfall:"用完整列表独立执行三次搜索，会把已审阅或已匹配的记录重复纳入后续阶段。",extension:"增加审查顺序日志，区分因不合格被跳过与因低于告警被消费。"})],_e=[t(33,l[3],"入门","变长货箱交接单",{background:"每条货箱记录都有箱号和终点，二者之间可能附带若干标签。",description:"拆出每行的箱号、终点和所有中间标签。标签按原次序保留，包括重复标签。",input:"首行 n。随后 n 行，每行是箱号、零到多个标签、终点，字段以单个空格分隔。",output:"每行「箱号 终点 标签列表」。标签用逗号连接，没有则输出 NONE。",limits:"0 ≤ n ≤ 500，每行最多 20 个标签。箱号、标签、终点均为 1–10 位英数字。n 为 0 时无输出。"},[`3
B7 glass top N2
A1 S1
B8 dry dry W1
`,`B7 N2 glass,top
A1 S1 NONE
B8 W1 dry,dry
`,"A1 和 S1 已分配到两端，因此没有任何中间标签。"],[[`0
`,""],[`1
X Y
`,`X Y NONE
`],[`1
X B Z A
`,`X A B,Z
`]],["箱号总在行首、终点总在行尾。","用星号目标接收不定数量的中间字段。"],`for _ in range(int(input())):
    crate, *tags, destination = input().split()
    print(crate, destination, ",".join(tags) or "NONE")
`,{concepts:["星号赋值","固定首尾字段","空剩余"],approach:"保持两个固定字段的名字，给剩余字段一个列表。逐行格式化。",steps:["拆成空格分隔的字段。","首尾取固定值，中间统收为列表。","用逗号连接并补空标记。"],time:"O(s)，s 为所有字段的字符数。",space:"额外空间 O(m)，m 为最长记录的长度。",pitfall:"用三个固定目标接收变长记录会在无标签或多标签时失败。",extension:"打印每个箱号的标签数量和首个特定标签的原位置。"}),t(34,l[3],"入门","两列积分核验",{background:"报名系统分别导出编号列和积分列。只在两列完整对齐后才发布及格记录。",description:"将同一位置的编号和积分对齐，保留积分达到门槛的记录，并显示原位置。两列长度不相同则整份报表无效。",input:"三行。第一行门槛，第二行编号列表，第三行整数积分列表。后两行可以为空。",output:"不等长时只输出「长度不一致」。等长时按顺序每行输出「位置 编号 积分」，位置从 1 开始。没有达标项时输出「空」。",limits:"两列各 0–800 项，编号 1–12 位英数字、可以重复，门槛和积分均在 -1000–1000。"},[`10
E C E
10 9 12
`,`1 E 10
3 E 12
`,"编号 E 可以重复，过滤后第二条结果仍保留原位置 3。"],[[`5
A B
6
`,`长度不一致
`],[`5
A
8 9
`,`长度不一致
`],[`0


`,`空
`],[`-2
Z X
-3 -2
`,`2 X -2
`]],["先确保两列完整对齐。","对配对结果编号，再用筛选判断积分。"],`limit = int(input())
codes = input().split()
scores = list(map(int, input().split()))
try:
    pairs = list(zip(codes, scores, strict=True))
except ValueError:
    print("长度不一致")
else:
    passed = [(position, code, score) for position, (code, score) in enumerate(pairs, 1)
              if score >= limit]
    for position, code, score in passed:
        print(position, code, score)
    if not passed:
        print("空")
`,{concepts:["zip","enumerate","嵌套解包","原序号"],approach:"先校验数据形状，再把位置当作每条记录的一个字段。筛选后保持原位置。",steps:["读入两列，用 list 消费全部严格配对，确认长度。","在配对通过后为每个元组加上行号。","筛选合格行并输出，或给空标记。"],time:"O(n+m)，n、m 为各列长度。",space:"O(n+m)。",pitfall:"默认 zip 会悄悄截断，导致把残缺数据当成完整报告。",extension:"在不等长时输出第一处没有配对的位置。"}),t(35,l[3],"基础","取件清单的格式覆盖",{background:"领物点把两批标签接到同一张清单上。可自定义清单前缀与分隔字符。",description:"先输出前缀，再按两批顺序输出标签，以选定分隔符连接。默认前缀为 PICK，默认分隔符为 |。每条设置覆盖此前同名设置。",input:"前两行分别为两批标签，能为空。第三行 q，随后 q 行，每行是 prefix 或 sep 及其设置值。",output:"一行格式化清单，无任何标签时只输出前缀。保留标签重复次数，不加末尾分隔符。",limits:"每批 0–200 个 1–12 位英数字标签，0 ≤ q ≤ 10。prefix 是 1–12 位英数字，sep 为 |、-、/、: 中的一个。"},[`A A
B
3
sep /
prefix GO
sep :
`,`GO:A:A:B
`,"最后的 sep 覆盖此前的 /，A 保留两次。"],[[`

0
`,`PICK
`],[`
B4
1
sep -
`,`PICK-B4
`],[`A B

2
prefix OLD
prefix NEW
`,`NEW|A|B
`]],["在字典里合并默认设置和改动。","将两批标签分别作为位置实参展开，只将最终配置展开一次。"],`def format_sheet(*items, **options):
    return options["sep"].join([options["prefix"], *items])

first = input().split()
second = input().split()
defaults = {"prefix": "PICK", "sep": "|"}
updates = {}
for _ in range(int(input())):
    key, value = input().split()
    updates[key] = value
print(format_sheet(*first, *second, **{**defaults, **updates}))
`,{concepts:["拆包位置实参","收集变长实参","配置合并"],approach:"在调用前消解配置冲突，并将两批数据按顺序交给同一格式化函数。",steps:["读取两批数据与更改映射。","先合并字典形成最终参数名称和值。","两批标签展开给 items，最终配置展开给 options，统一连接输出。"],time:"O(n+m+q)，标签和设置宽度有上界。",space:"O(n+m)，含结果字符串和标签列表。",pitfall:"以 **defaults, **updates 分别传入会因重复关键字失败。",extension:"增加带空标签时的显示规则，为两种格式编写独立自测。"}),t(36,l[3],"进阶","活动积分对账报表",{background:"进阶模块测评。活动组收到编号列、积分列和禁用清单。每个编号的最后一次更新决定该人当前积分。",description:"两列必须等长。编号大小写不敏感并统一输出小写，同一编号以最后一条积分为准。筛出最新积分达到门槛且不在禁用清单中的编号，按该编号最后一次记录的原位置升序报告。",input:"四行。依次给最低门槛、编号列表、整数积分列表、禁用编号列表。后三行允许为空，列表项用空格分隔。",output:"两列不等长时只输出「长度不一致」。否则首行输出「TOTAL 人数 总积分」，其后每人一行「最后位置 编号 最新积分」。位置从 1 开始。无合格人时只输出 TOTAL 0 0。",limits:"每份列表 0–800 项，编号 1–12 位 ASCII 英数字。最低门槛 0–100，积分为 -1–100，-1 表示撤销，禁用编号可能不存在或重复。"},[`10
B a B X A C
10 13 18 15 -1 10
x X
`,`TOTAL 2 28
3 b 18
6 c 10
`,"A 的最后一条是撤销，X 被禁用，B 用第 3 条，C 恰达门槛。"],[[`0



`,`TOTAL 0 0
`],[`7
A B
9

`,`长度不一致
`],[`7
A
8 9
b
`,`长度不一致
`],[`0
A Z a B
9 0 0 0

`,`TOTAL 3 0
2 z 0
3 a 0
4 b 0
`],[`9
E E B z
-1 9 30 9
b B
`,`TOTAL 2 18
2 e 9
4 z 9
`],[`99
E Z
1 -1
E
`,`TOTAL 0 0
`]],["先验证两列长度，展开配对和原始位置，再构造最终状态。","保留最后位置作为字典值的一部分。字典会保留键首次写入顺序，因此报告需要显式排序。"],`limit = int(input())
codes = input().split()
scores = list(map(int, input().split()))
blocked = {code.lower() for code in input().split()}
if len(codes) != len(scores):
    print("长度不一致")
else:
    pairs = zip(codes, scores, strict=True)
    latest = {code.lower(): (position, score)
              for position, (code, score) in enumerate(pairs, 1)}
    kept = [(position, code, score) for code, (position, score) in latest.items()
            if code not in blocked and score >= limit]
    kept.sort()
    print("TOTAL", len(kept), sum(score for _, _, score in kept))
    for row in kept:
        print(*row)
`,{concepts:["嵌套解包","对齐与原始位置","字典覆盖","集合归一化","按需求和"],approach:"写出五步管道：验证形状、编号配对、覆盖到最终状态、筛选、汇总输出。有效零值仍要保留。",steps:["检查两列等长，禁用列表转为规范化集合。","按输入原序逐条生成记录，最后写入的值覆盖旧值。","对最终状态筛选，按记录中的最后位置排序。","用生成器求总分，再按报告顺序展开输出。"],time:"哈希平均 O(n+b+k log k)，n 为记录数，b 为禁用条数，k 为结果数。",space:"O(n+b)。",pitfall:"先过滤再覆盖会保留之后已撤销的记录。直接遍历 latest 会按首次插入顺序输出。",extension:"同时输出已撤销、被禁用、未达门槛的最终记录数，以可重现的数据验证所有分类。"})],be={introduction:"同一个寄件函数会被两个窗口反复调用。参数可以给默认金额，返回值能同时交出应付金额和重量区间。遇到共享箱单时，还要明确「改这份清单」和「做一份新清单」的区别。",prerequisites:"基础篇函数和列表，以及进阶课「列表、切片与对象引用」「解包、对齐与组合」。",version:"Python 3.12。",goals:["区分形参、实参和默认值，手推一次函数调用的参数绑定。","预测原地修改、局部重新绑定和浅拷贝对调用方的影响。","写出重复调用相互独立的函数，并解包多项返回值。"],topics:[{title:"调用时，实参与形参如何对应",explanation:["def 执行时创建函数对象并把它绑定到函数名。定义里的名字叫形参；调用里已经求值的对象是实参。位置实参从左往右填位置；关键字实参按名字填。每个形参最终只能得到一个值，缺少必填项或重复填值会在进入函数体前报 TypeError。","每次调用产生各自的局部绑定。参数名在函数开始时指向调用方交来的对象。参数 = 新值会让局部名改指；参数.append(...) 会通过名字找到并修改原有对象，外部若仍指向它便能看到变化。想交出新清单时先复制需要改动的层级。","return 会立即结束当前调用，并把一个对象交给调用方。return subtotal, fee 构造一个元组，调用方再拆出两项。没有执行带值的 return 时，调用结果为 None。打印只写出文本，可以与返回配合使用。"],examples:[e("binding-two-ways","同一小票的两种参数写法","起步",`def bill(quantity, price, packing=2):
    subtotal = quantity * price
    return subtotal, subtotal + packing

print(bill(3, 5))
goods, total = bill(price=5, quantity=3, packing=0)
print(goods, total)
`,`(15, 17)
15 15
`,"用两种方式调用同一函数并解包返回结果。",["第一次按位置填数量与单价，packing 用默认 2。","第二次按名字填，顺序可以不同。","两个计算结果一起存在元组中，调用者解包后分开使用。"],"bill(3, 5, price=2) 会把 price 填两次，函数体不执行。"),e("binding-shared-list","为订单添加标签时观察原件","应用",`def mark_in_place(labels):
    labels.append("已核对")

def marked_copy(labels):
    labels = labels.copy()
    labels.append("已签收")
    return labels

original = ["箱1"]
print(mark_in_place(original), original)
print(marked_copy(original), original)
`,`None ['箱1', '已核对']
['箱1', '已核对', '已签收'] ['箱1', '已核对']
`,"观察共享修改、局部改指和返回新对象。",["第一函数直接修改调用者的表，执行完返回 None。","第二函数先把局部名改指向浅拷贝。","添加字符串只影响浅拷贝，调用者可以继续使用原件。"],"浅拷贝共享里面的可变项。改嵌套行时还需要复制对应的内层。")]},{title:"默认值的求值时机",explanation:["默认值表达式在执行 def 时求值，从左到右。每次省略对应实参，函数会使用当时保存的默认对象。默认值引用了当时的外部名称，即使之后外部名称重新绑定，保存的对象也不会随之改变。","列表或字典默认值会被所有省略这个参数的调用复用。如果函数修改它，下次调用可见旧内容。想让每次有独立容器时，用 None 作「未提供」标记，在函数体里用 is None 判断并创建容器。空列表可能是调用者明确提供的合法实参，应该按接口约定对待。"],examples:[e("binding-definition-time","每天的默认费率何时确定","起步",`rate = 2
def charge(units, fee=rate):
    return units * fee

rate = 5
print(charge(3), charge(3, fee=rate))
`,`6 15
`,"验证默认值和调用点的显式参数可来自不同时间。",["执行 def 时 rate 为 2。","外部 rate 改指 5，已保存的默认值仍是 2。","显式 fee=rate 取调用时的外部值 5。"],"若希望每次取最新费率，在函数体内完成查找或由调用者明确传参。"),e("binding-default-list","逐次出单，避免上一单标签串入","应用",`def bad(label, labels=[]):
    labels.append(label)
    return ",".join(labels)

def safe(label, labels=None):
    if labels is None:
        labels = []
    labels.append(label)
    return ",".join(labels)

print(bad("A"), bad("B"))
print(safe("A"), safe("B"))
provided = []
print(safe("C", provided), provided)
`,`A A,B
A B
C ['C']
`,"用重复调用区分共享默认容器和每次创建的容器。",["两个 bad 调用修改同一个默认列表。","safe 省略参数时各自创建列表。","明确传入空列表时，仍然使用调用者给的对象并追加。"],"写 if not labels 会把明确传入的空列表也替换掉。")]}],comparisons:{headings:["做法","何时作用","调用方能观察到什么"],rows:[["labels = labels.copy()","调用中改绑参数","原表的外层未变"],["labels.append(x)","调用中修改共享对象","原表多出一项"],["labels=None 后创建 []","每次省略参数时创建","新容器互相独立"]]},applications:["把校验和金额计算封装成返回值明确的函数，命令行入口统一打印。","给同一函数多次调用准备显式测试，特别检查空实参和共享对象。"],mistakes:[{symptom:"第二张票仍含第一张票的标签",reason:"可变默认列表被两次调用共同修改。",fix:"用 None 标记省略，在函数体内创建列表。",check:"连续调用两次并比较各自结果。"},{symptom:"调用方解包时得到 None",reason:"某个分支只打印或漏掉 return。",fix:"为所有业务分支写明返回值。",check:"分别触发空数据和非空数据。"}],summary:["定义执行时创建函数并保存默认对象，调用时才建立参数绑定。","引用关系决定可变对象的修改能否被外部观察。","多项返回是一个元组，多种返回路径都应在契约中说明。"],next:"接下来用 / 和 * 设计调用接口，限制参数怎样填入。",exercises:[s("binding-keyword","识别重复的参数绑定","哪个调用会在进入函数体之前失败？",1,[["bill(3, 5)","两项按位置绑定，包装费用使用默认值。"],["bill(3, 5, price=1)","price 已经被第二项位置实参填上。"],["bill(price=5, quantity=3)","两个名字都能对应各自形参。"]]),s("binding-rebind","预测参数名重新绑定后的原表","代码输出什么？",0,[["[1]","x 改指新表，a 仍指向旧表。"],["[8]","只有给原表项目赋值才会改变它。"],["None","打印的是 a，本次调用的返回值没有被使用。"]],`def f(x):
    x = [8]
a = [1]
f(a)
print(a)`,`[1]
`),s("binding-snapshot","识别默认值取自定义时","代码输出什么？",2,[["9","显式传入 fee 才会使用改绑后的 9。"],["3 9","只调用一次 print。"],["3","def 执行时取到 fee 的值 3。"]],`fee = 3
def f(x=fee):
    return x
fee = 9
print(f())`,`3
`),s("binding-return-form","理解多项返回的形状","执行 return 4, 9 时，调用者收到什么？",1,[["两次独立返回","一次调用只交回一个对象。"],["一个含两项的元组","逗号构造元组，调用者可以解包。"],["一个有两个元素的列表","这一写法用逗号组成元组。"]]),n("A037","基础编程","用默认包装费和显式覆盖计算账单。"),n("A038","独立编程","隔离多次调用的默认容器，用返回值给出标签。"),n("A039","综合应用","按命令选择原地编辑或生成副本。"),n("A040","拓展挑战","拆分总量、净量和无效计数的返回契约。")],references:[r("函数定义与默认值","tutorial/controlflow.html#default-argument-values","核对定义时求值和共享容器。"),r("调用的参数绑定","reference/expressions.html#calls","核对参数填槽、默认值和重复实参。"),r("return 语句","reference/simple_stmts.html#the-return-statement","核对返回元组和无值返回。")]},Oe={introduction:"给报名函数传入三个整数时，调用者很难分清哪一个是名额、哪一个是候补数。签名可以把关键选项写成必须带名字的参数，也能说明哪些字段属于可变长度的批次。",prerequisites:"参数绑定与默认值，以及上一模块的 * 和 ** 调用解包。",version:"Python 3.12。定义时显式使用 / 的语法自 Python 3.8 提供。",goals:["用 /、*、*args、**kwargs 写出并解释参数区段。","预测参数缺失、意外关键字和重复绑定的错误。","为输入来源可变但业务规则固定的功能设计清晰接口。"],topics:[{title:"位置、名字与分界",explanation:["签名描述函数怎样接收调用。def queue(code, /, count=1, *, reserve=0) 中，/ 左边的 code 仅按位置传入，中间 count 可按位置或名字传入，* 右侧的 reserve 只能按名字传入。两个分隔符本身不接收任何实参。","仅限关键字能防止两个相近的量在调用点混淆，且可不带默认值以要求显式填写。仅限位置适合短小含义明显的操作，或让内部形参名不成为调用方依赖。普通参数兼顾两种方式，也是常见默认选择。","可按位置填的形参一旦带默认，后续可按位置填的形参也必须有默认，/ 不重置这条规则。仅限关键字区可同时包含必填与选填。调用者使用关键字时可按任意顺序写，绑定完成前会检查重复和缺失。"],examples:[e("signature-boundaries","登记员的显式候补选项","起步",`def reserve(code, /, seats=1, *, wait=0):
    return f"{code}:{seats}+{wait}"

print(reserve("A"))
print(reserve("B", seats=3, wait=2))
try:
    reserve("C", 3, 2)
except TypeError:
    print("候补必须写名字")
`,`A:1+0
B:3+2
候补必须写名字
`,"通过一个正确调用和一个失败调用找出 * 的作用。",["第一个位置只能填 code。","seats 接受同名实参，wait 也按名字传。","第三个位置实参没有对应的参数槽，进入函数体前报错。"],"把 * 当成接收额外位置参数。仅有星号时它只是分界。"),e("signature-required","把必填规则写成仅限关键字","应用",`def fee(units, /, *, rate=2, zone):
    return f"{zone}:{units * rate}"

print(fee(4, zone="北"))
try:
    fee(units=4, zone="北")
except TypeError:
    print("数量按位置传")
try:
    fee(4)
except TypeError:
    print("缺少区名")
`,`北:8
数量按位置传
缺少区名
`,"验证仅限位置和必填关键字，并观察关键字区的默认规则。",["units 只能按位置绑定。","rate 用默认值，zone 按业务规则必填。","错误都来自参数绑定，函数体无需为这些错误手写检查。"],"仅限关键字并不意味着有默认值。")]},{title:"变长参数与明确的配置",explanation:["*items 在定义中收集剩余位置实参到元组，后续有名字的形参必须按关键字填入。**options 最后收集尚未绑定的关键字为字典。两个容器在没有对应实参时分别为空元组和空字典。","调用的 *source 和 **mapping 会展开数据。多个映射展开时，重复键会在调用时出错。配置覆盖是业务规则时，先合并字典，让每个最终关键字只出现一次。关键字的键应是字符串。","接口允许未知选项时，应明确它们的去处或校验规则。直接接受 **options 并忽略所有未知键，会让拼写错误看起来像配置生效。对业务必需的选项把名字写进签名。"],examples:[e("signature-collect-extra","固定服务名加可变重量","起步",`def manifest(service, /, *weights, limit, **labels):
    return service, sum(weights), limit, labels

print(manifest("E", *[3, 2], limit=5, shift="晚"))
print(manifest("E", limit=0))
`,`('E', 5, 5, {'shift': '晚'})
('E', 0, 0, {})
`,"分辨必填位置项、剩余位置、必填关键字和附加标签。",["service 由第一个实参绑定。","展开的 3、2 收进 weights。","limit 有明确形参，shift 留给 labels。"],"若省略 limit，即使 labels 不为空也无法满足缺失的必填参数。"),e("signature-config","先解决配置冲突再调用","应用",`def ticket(code, /, *, end="!", prefix="票"):
    return f"{prefix}{code}{end}"

defaults = {"prefix": "票", "end": "!"}
updates = {"end": "?"}
print(ticket("X", **(defaults | updates)))
try:
    ticket("X", **defaults, **updates)
except TypeError:
    print("end 重复")
`,`票X?
end 重复
`,"分别观察字典覆盖和函数的绑定检查。",["合并字典把 end 的最终值确定为问号。","一次展开，每个名字只有一个值。","两次展开会同时交出两个 end，触发绑定错误。"],"把 Python 的重复关键字报错误当作最后一个值自动覆盖。")]}],comparisons:{headings:["写法","绑定方式","常用情境"],rows:[["code, /","仅位置","隐藏短参数的内部名字"],["count=1","位置或关键字","可读而通用的参数"],["*, wait=0","仅关键字","区分含义相似的配置"],["*items 与 **options","收集额外实参","批次、转发和可扩展配置"]]},applications:["在收费和审核接口中让数量、上限与策略在调用处可辨认。","将命令行读取与函数调用分开，输入的数据准备完毕后再展开。"],mistakes:[{symptom:"看似指定了必填参数仍报错",reason:"给 / 左侧的参数传了同名关键字。",fix:"将它放在正确的位置。",check:"直接测试位置形式和关键字形式各一次。"},{symptom:"拼错配置名却没有提示",reason:"任意关键字都落入 **options，业务逻辑没有检查。",fix:"固定配置用显式形参，剩余配置依约校验。",check:"测试合法配置和一个拼错的名字。"}],summary:["读签名先看 / 与 * 的位置，再看哪些槽必填。","*args、**kwargs 收集剩余实参，调用端的星号负责展开。","配置有优先级时先合并，参数冲突和未知字段应有明确行为。"],next:"下一课把函数当作普通对象传入，让同一接口选择不同业务策略。",exercises:[s("signature-wait","定位仅限关键字参数","对 def f(code, /, count=1, *, wait=0) 而言，哪个调用合法？",2,[['f(code="A")',"code 只能按位置传。"],['f("A", 2, 3)',"wait 无对应位置槽。"],['f("A", wait=2)',"code 按位置、wait 按名字，count 采用默认值。"]]),s("signature-args","预测收集参数的具体内容","代码输出什么？",0,[["('A', (2, 3), {'zone': 'N'})","A 绑定 code，其余位置收进元组，zone 收进字典。"],["('A', [2, 3], {'zone': 'N'})","定义中的 *items 收集为元组。"],["发生 TypeError","签名允许额外位置参数和关键字。"]],`def f(code, /, *items, **options):
    return code, items, options
print(f("A", 2, 3, zone="N"))`,`('A', (2, 3), {'zone': 'N'})
`),s("signature-duplicate","区分多个展开与覆盖规则","已合并为最终配置字典后，怎么传给 f 的关键字参数？",1,[["f(*config)","对字典做位置展开会依次传键。"],["f(**config)","一次按键名展开最终配置。"],["f(**config, **config)","任何重复的键都会导致调用异常。"]]),s("signature-spell","为必填业务选项选择签名","需要候补人数必填并明确写出 wait=...，选择哪种参数？",2,[["wait=0","默认值使该参数可省略。"],["只接收 **options","单靠收集字典不能标记这个键必填。"],["*, wait","仅限关键字且没有默认值。"]]),n("A041","基础编程","给包间计算明确的仅限关键字选项。"),n("A042","独立编程","把多件重量展开到变长位置参数。"),n("A043","综合应用","合并两级打印配置后一次展开。"),n("A044","拓展挑战","检查必填关键字和可选项，防止拼写错误滑过。")],references:[r("特殊参数","tutorial/controlflow.html#special-parameters","核对 /、* 和各个区段。"),r("函数定义的语法","reference/compound_stmts.html#function-definitions","核对形参顺序、默认值和收集参数。"),r("参数列表解包","tutorial/controlflow.html#unpacking-argument-lists","核对展开位置参数和关键字映射。")]},he={introduction:"同一批货件有时按费用排序，有时按重量排序，也可能要先过滤再换算。把变化的规则当成函数对象，可以让一段共同的遍历代码服务多种规则。",prerequisites:"函数签名、稳定排序、列表推导式，以及迭代器的消费方式。",version:"Python 3.12。",goals:["区分引用函数与立即调用，读出函数参数的作用。","用回调统一筛选或换算流程，分别用 def 和 lambda 实现规则。","比较 map、filter 和推导式的可读性、求值方式与输出形状。"],topics:[{title:"函数可以像数据一样传递",explanation:["函数是一等对象，能赋值给其他名称、作为实参传入、放进字典，也能由函数返回。calculate 是函数对象，calculate(...) 立即执行并得到一个结果。将回调传入后，接收者会在它规定的时机，用它掌握的数据调用该函数。","接收函数或返回函数的函数称为高阶函数。调用约定必须说清楚。例如传给 sorted 的 key 接收一条记录并返回排序键，传给筛选流程的 predicate 接收一项并返回可判断真假的值。为同一流程替换另一个规则，只需要遵守相同的调用约定。","lambda 参数: 表达式 创建一个函数，调用时计算并返回表达式的值。一次性短规则适合 lambda。分支较多、需多步处理或复用的规则可用带名字的 def 便于调试与测试。"],examples:[e("values-select-rule","一个分拣流程选择两种计费规则","起步",`def doubled(x):
    return x * 2

def apply(rule, values):
    return [rule(value) for value in values]

rules = {"双倍": doubled, "少一": lambda x: x - 1}
print(apply(rules["双倍"], [2, 4]))
print(apply(rules["少一"], [2, 4]))
`,`[4, 8]
[1, 3]
`,"将规则放进字典，再由统一流程调用。",["rules 的值是函数对象。","apply 收到规则后在遍历中逐项调用。","替换字典里的键，就会使用另一个相同签名的规则。"],"在映射里提前写 doubled(2) 会存入整数，之后无法将该值当成函数调用。"),e("values-return-function","挑选用于整批报表的比较键","应用",`def by_weight(row):
    return row[1]

def choose_key(mode):
    if mode == "weight":
        return by_weight
    return lambda row: row[0]

rows = [("Z", 1), ("A", 3), ("B", 1)]
print(sorted(rows, key=choose_key("weight")))
print(sorted(rows, key=choose_key("code")))
`,`[('Z', 1), ('B', 1), ('A', 3)]
[('A', 3), ('B', 1), ('Z', 1)]
`,"挑选并返回函数对象，让 sorted 决定何时调用。",["choose_key 依据模式返回一个函数。","sorted 将每条记录交给选定的键函数。","相同重量的记录仍保留原相对顺序。"],"把 sorted 结果写成排序键会传错类型，key 需要接收单条记录的可调用对象。")]},{title:"map 转换，filter 保留",explanation:["map(transform, values) 建立按需迭代器，读取时逐项调用 transform 并产生转换结果。filter(predicate, values) 则按需判断每项，产生通过测试的原项。filter(None, values) 按元素自身的真值筛选，零和空字符串也会被去掉。","两者都保存消费进度。list(...) 会收集剩余结果，sum(...) 可以直接汇总。已有带名字的转换函数时 map 很直接；筛选和表达式都依赖当前字段时，推导式常更清楚。需要提前停止或同时统计多种量时，可用普通循环。"],examples:[e("values-map-filter","解析读数并保留合法零值","起步",`raw = ["-2", "0", "6"]
values = map(int, raw)
accepted = filter(lambda value: value >= 0, values)
print(list(accepted))
print(list(values))
parsed = (int(text) for text in raw)
print([value for value in parsed if value >= 0])
`,`[0, 6]
[]
[0, 6]
`,"区分转换、筛选和消费的先后。",["map 在取值时完成文本转整数。","filter 检查值并保留 0、6。","第一个 list 已通过 filter 耗尽 values。"],"filter(None, ...) 会漏掉业务上合法的 0。先解析数值还能正确处理 -0 这样的输入文本。"),e("values-compose","将检验条件与报告转换分开传入","应用",`def collect(rows, *, keep, format_row):
    return [format_row(row) for row in rows if keep(row)]

rows = [("A", 0), ("B", 5), ("C", -1)]
result = collect(rows, keep=lambda row: row[1] >= 0,
                 format_row=lambda row: f"{row[0]}:{row[1]}")
print(result)
`,`['A:0', 'B:5']
`,"把筛选与转换当成两个独立策略。",["collect 先把每行交给 keep 判断。","通过时才把同一条数据交给 format_row。","两个策略都接收行记录，但各自的返回值用途不同。"],"如果先转换成字符串再按 row[1] 取数，拿到的只会是字符串的第二个字符。")]}],comparisons:{headings:["工具","产生什么","读取时机"],rows:[["map","规则返回的值","迭代时转换"],["filter","通过测试的原值","迭代时筛选"],["列表推导式","通过筛选后的转换值","创建时生成整张表"]]},applications:["把稳定排序、校验或导出规则作为可替换参数传入。","从用户选定的规则名查找预先定义的函数，按顺序执行同一套规则。"],mistakes:[{symptom:"把规则传给流程时提示整数不可调用",reason:"写了 rule(...)，传入的是本次计算的整数。",fix:"传 rule 本身，让流程在获得待处理数据时调用。",check:"用一笔和两笔记录分别测试。"},{symptom:"看得到第一次转换却无法复查",reason:"map 或 filter 的迭代器已经耗尽。",fix:"要重复读取时存为列表，或从原始可重复来源重新构造。",check:"将同一个 iter 对象交给 list 两次。"}],summary:["函数名指向可调用的对象，带括号才发起调用。","给共享遍历注入清晰的小规则，分别测试流程与规则。","map、filter 按需运行，必要时再物化结果。"],next:"当返回的函数要保留创建时的配置或状态，就需要理解闭包和名称查找。",exercises:[s("values-call","区分函数对象和调用结果","要让 sorted 对每条记录执行 weigh，怎样传入？",1,[["key=weigh(row)","提前调用一次会交出某个比较值。"],["key=weigh","sorted 将逐条传入记录。"],['key="weigh"',"字符串不提供对记录的计算。"]]),s("values-output","预测 filter 保留的是哪些对象","代码输出什么？",2,[["[True, False, True]","filter 产出通过检查的原对象。"],["[1]","0 也满足非负条件。"],["[0, 1]","0 和 1 通过，-1 被跳过。"]],"print(list(filter(lambda x: x >= 0, [0, -1, 1])))",`[0, 1]
`),s("values-exhaust","跟踪转换迭代器的读取位置","下面输出什么？",0,[["2 [3]","next 取走 2，随后只剩 3。"],["2 [2, 3]","list 从当前进度开始。"],["发生 TypeError","map 返回一个可供 next 读取的迭代器。"]],`items = map(int, ["2", "3"])
print(next(items), list(items))`,`2 [3]
`),s("values-contract","判断回调的参数契约","流程每次给 predicate 一个记录元组。哪个规则满足签名？",1,[["lambda: True","它不接收记录实参。"],["lambda row: row[1] >= 0","单个参数与流程相符。"],["lambda name, value: value >= 0","流程只传了一个元组，要在规则体内取字段。"]]),n("A045","基础编程","按指定规则批量换算读数。"),n("A046","独立编程","用可替换的筛选规则输出原始记录。"),n("A047","综合应用","选择排序键并保证同键记录稳定。"),n("A048","拓展挑战","把若干函数接成可配置的转换管道。")],references:[r("lambda 表达式","tutorial/controlflow.html#lambda-expressions","核对表达式函数的语法。"),r("内置 map","library/functions.html#map","核对逐项调用和迭代器。"),r("内置 filter","library/functions.html#filter","核对过滤与真值。")]},ge={introduction:"两个窗口都显示自己的排队号，且能随业务设置各自的步长。理解函数在哪一层找到名称之后，就能写出拥有独立状态的计数器。",prerequisites:"函数对象、返回函数和参数默认值。示例聚焦模块与普通函数。",version:"Python 3.12。",goals:["按 LEGB 解释读取名称时的查找顺序，识别遮蔽与 UnboundLocalError。","区分 global、nonlocal 与原地修改共享对象。","为不同调用创建独立闭包，并修复循环变量的晚绑定。"],topics:[{title:"名称读写和 LEGB",explanation:["普通函数读取名称时，可以按 LEGB 理解：Local 是当前函数局部；Enclosing 是从近到远的外层函数；Global 是函数定义所在模块；Builtins 是内置名称。先找到的绑定会遮蔽后面的同名绑定。全局层取决于定义的位置，调用者的局部变量不会插到查找链上。","函数体内有赋值时，该名称通常在编译函数体时就被归为局部。若先读取而此调用尚未为它赋值，就会发生 UnboundLocalError，即使外面有同名绑定。+= 会先读取再重新赋值，也受这条规则影响。","global 宣告相应名称指向模块层；nonlocal 宣告名称绑定在最近的、已经绑定该名称的外层函数。nonlocal 不从模块层找，也不会新建外层名称。对外层列表调用 append 本身没有重新绑定变量名，通常不需要声明。"],diagram:{caption:"普通内层函数读一个自由名称",text:"本次调用的局部 → 最近的外层函数 → 其余外层函数 → 定义所在模块 → 内置名称"},examples:[e("scope-legb","跟踪四个不同来源的名称","起步",`room = "大厅"
def outer():
    room = "外层库房"
    def inner(label):
        return label, room, len(label)
    return inner("甲")

print(outer())
print(room)
`,`('甲', '外层库房', 1)
大厅
`,"区分内层实参、定义外层、模块层与内置功能。",["label 在 inner 的局部，值为甲。","room 在 outer 找到，模块层 room 被遮蔽。","len 的查找走到内置层。返回后模块层仍为大厅。"],"不要用 len、sum 等内置名称给本地数据起名，以免遮蔽后无法调用。"),e("scope-rebind","拆开读局部、改外层和改模块层","应用",`hits = 2
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
`,`局部值还没有绑定
13 2
0
`,"把三个同名变量分开追踪。",["broken 的赋值让 hits 成为局部，+= 读不到初值。","tick 修改 batch 的绑定，模块 hits 仍为 2。","reset 明确改模块 hits，值变为 0。"],"如果只是想计算一个不同的值，可传入原值并返回新值，减少对共享状态的依赖。")]},{title:"闭包保留哪一份绑定",explanation:["内层函数引用某个外层函数的变量，形成闭包。外层调用结束后，返回的内层函数还可访问相关绑定。每次调用外层函数都会建立新的一组局部绑定，因此两次工厂调用可以产生各自独立的状态。","闭包读取变量时取它当时的值。多个函数捕获同一轮循环中的同一个循环变量绑定，延后调用时通常都会读到最后值。让每次循环调用工厂、传入当前值，或使用默认参数 x=x 在定义时保存当前对象，都能把需要的值分开。默认参数保存引用，涉及可变对象时要明确是否复制。"],examples:[e("scope-independent","两个窗口各自维护号码","起步",`def make_queue(start):
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
`,`1 12 2
3 4
`,"区分重新调用工厂和给已有闭包起别名。",["工厂的两次调用分别创建 number。","east 调用后不会影响 west。","alias 指向同一个闭包，继续使用 east 的状态。"],"在工厂外定义共享计数会让两个窗口互相干扰。"),e("scope-late-binding","批量生成三盏灯的开关回调","应用",`def callbacks():
    late = []
    frozen = []
    for lamp in ["A", "B", "C"]:
        late.append(lambda: lamp)
        frozen.append(lambda lamp=lamp: lamp)
    return late, frozen

late, frozen = callbacks()
print([fn() for fn in late])
print([fn() for fn in frozen])
`,`['C', 'C', 'C']
['A', 'B', 'C']
`,"在延后调用时验证循环变量的同一绑定与定义时求值。",["late 中三个函数引用的是同一外层绑定。","循环结束时，该绑定中是 C。","frozen 中每个函数定义时保存各自默认参数。"],"若保存的是会继续改变的列表，默认参数仍指向原列表，可复制后再冻结。")]}],comparisons:{headings:["需求","方式","影响范围"],rows:[["读取外层值","直接引用","按 LEGB 找到归属"],["重绑外层函数变量","nonlocal","最近有同名绑定的外层函数"],["重绑模块变量","global","定义所在模块"],["修改已选中的共享列表","append 或下标赋值","所有仍引用该对象的调用者可见"]]},applications:["在函数工厂里保存多个窗口的独立计数、当前限额或格式配置。","批量生成规则后再执行时，检查循环变量是共享绑定还是每条规则独有的值。"],mistakes:[{symptom:"读同名变量时发生 UnboundLocalError",reason:"当前函数体里有针对这个名字的赋值。",fix:"用局部名称接收实参，或明确声明要修改的外层绑定。",check:"从整个函数体找赋值，而不只看当前执行行。"},{symptom:"三条规则都引用最后一项",reason:"它们捕获同一个外层循环变量。",fix:"每次单独调用工厂，或使用默认参数固定当前值。",check:"在循环结束后再逐条调用规则。"}],summary:["LEGB 分层查找。赋值会依据编译时确定的归属绑定名称。","闭包延长可访问的外层绑定的生命周期。独立创建与创建别名的状态关系不同。","先明确共享状态的归属，再决定使用返回值、nonlocal 或 global。"],next:"接下来用闭包包住另一个函数，增加可复用的调用前后逻辑。",exercises:[s("scope-local","识别局部名还没有绑定的错误","如果 x 已在模块层定义，函数中的 x += 1 仍可能抛出什么异常？",1,[["IndexError","这里没有位置索引。"],["UnboundLocalError","赋值将 x 分类为局部，读它时尚未初始化。"],["始终成功","需要显式传入、初始化局部变量或声明归属。"]]),s("scope-nearest","预测 nonlocal 查找的最近绑定","代码输出什么？",2,[["2 2","外层函数中的 x 会被重绑。"],["4 4","模块的 x 不参与 nonlocal 查找。"],["4 1","outer 的 x 变为 4，模块的仍为 1。"]],`x = 1
def outer():
    x = 2
    def update():
        nonlocal x
        x = 4
    update()
    return x
print(outer(), x)`,`4 1
`),s("scope-closures","区分闭包的别名与独立状态","a = factory(); b = a。调用 a 更新计数后，b 读到什么？",0,[["同一份已经更新的状态","两个名称引用同一个函数对象及其闭包。"],["一份工厂初值","还需要重新调用 factory 才会创建独立状态。"],["取决于 b 的调用者","闭包引用的是创建时关联的外层绑定。"]]),s("scope-loop-free","处理延后运行的回调","循环中生成的三条回调都读到最后一个 i，怎样让它们各自记住当次整数？",1,[["将 i 声明为 global","共享模块绑定仍会继续改变。"],["每轮调用一次 make_rule(i)","该轮参数进入一次新的工厂调用绑定。"],["将回调放进元组","改外层容器不改变函数捕获的绑定。"]]),n("A049","基础编程","区分本单覆盖与下一单默认设置。"),n("A050","独立编程","核对计数窗口的输入输出。试用闭包，再用 A093 验证可调用的计数接口。"),n("A093","综合应用","直接构造两个闭包，交错测试独立状态与别名。"),n("A051","综合应用","按编号生成规则，再在延后事件中调用。"),n("A052","拓展挑战","为多个站点独立维护可调整的限额状态。")],references:[r("名称绑定与解析","reference/executionmodel.html#naming-and-binding","核对局部分类、自由名称与作用域。"),r("global 和 nonlocal","reference/simple_stmts.html#the-global-statement","核对两个声明的绑定归属。"),r("循环中的 lambda","faq/programming.html#why-do-lambdas-defined-in-a-loop-with-different-values-all-return-the-same-result","核对循环变量晚绑定与默认参数的修正。")]},ke={introduction:"一组业务函数都要记录调用并保持返回结果。如果每个函数都复制相同的记录代码，细节很容易分叉。把这项工作放进可复用的包装函数，调用方式就能保持一致。",prerequisites:"变长参数、函数对象、闭包。",version:"Python 3.12。示例使用普通同步函数。",goals:["将 @ 写法还原为函数接收与重新绑定，区分定义时包装与调用时执行。","写出能转发实参和返回结果的包装函数，并用 wraps 保留名称等元数据。","解释参数化和叠加装饰器的执行顺序，验证哪些调用会被审计或拦截。"],topics:[{title:"从手动包装到 @",explanation:["装饰器接收函数并返回一个替代对象，常见做法是返回新的可调用包装函数。包装函数通过闭包保留原函数，在调用前后加入统一逻辑。def 上方的 @trace 把定义出的函数交给 trace，再用 trace 的返回值绑定原来的名字，作用相当于在定义后应用 f = trace(f)。","应用装饰器发生在定义时。只有随后调用名字，才执行包装函数的函数体。包装函数使用 *args、**kwargs 接收实参并转发给原函数，通常返回原结果。如果要在异常时也执行后置步骤，可把它放进 finally。","functools.wraps 用原函数的名称、文档等更新包装函数，并设置 __wrapped__ 引用。它能保留帮助和调试信息。原函数怎样接收参数、包装器怎样转发和返回，仍要由代码实现。"],examples:[e("decorator-manual","先手动包装，再调用","起步",`def record(func):
    print("绑定", func.__name__)
    def call(value):
        print("进入", value)
        return func(value)
    return call

def double(value):
    return value * 2

double = record(double)
print("准备完成")
print(double(4))
`,`绑定 double
准备完成
进入 4
8
`,"区分定义阶段打印和每次调用打印。",["record 接收旧 double 时立即输出绑定。","返回的 call 被绑定到 double，闭包保留旧对象。","调用新 double 才触发进入消息并返回 8。"],"record 应返回 call 这个函数对象，提前写 call(...) 会在定义时就执行。"),e("decorator-wraps-return","转发参数、返回值和函数名","应用",`from functools import wraps

def observe(func):
    @wraps(func)
    def call(*args, **kwargs):
        result = func(*args, **kwargs)
        print("完成", func.__name__)
        return result
    return call

@observe
def cost(quantity, *, fee):
    return quantity * fee

print(cost.__name__)
print(cost(3, fee=2))
`,`cost
完成 cost
6
`,"查看装饰后外部仍能使用的名字和调用参数。",["@observe 在 cost 定义时应用。","wraps 把 cost 的名称保留在 call 上。","包装层将位置与关键字实参转发，并交回原结果。"],"只打印 result 会令包装后的调用返回 None。")]},{title:"参数化、叠加与失败路径",explanation:['@badge("内") 会先执行 badge("内")，其返回值必须能接收被装饰函数。通常要分三层：外层接收配置，中层接收函数，内层在每次调用时处理实参。设好标签后，同一个构造器可以生成不同装饰器。',"叠加时，装饰器表达式按书写顺序求值，函数对象由最靠近 def 的那层先包装。@outer 写在 @inner 之上，结果相当于 outer(inner(f))。调用从外层进入，逐层返回，异常路径是否执行尾部逻辑取决于包装体的写法。","装饰器顺序具有业务意义。让记录层在校验外面，可以记录所有尝试；记录层在里面，只会看到通过校验的调用。先写出调用规则，再考虑代码摆放。"],examples:[e("decorator-stack","标出参数化包装层的进入与返回","应用",`from functools import wraps

def tag(label):
    print("准备", label)
    def decorate(func):
        @wraps(func)
        def call(*args, **kwargs):
            print("进入", label)
            result = func(*args, **kwargs)
            print("离开", label)
            return result
        return call
    return decorate

@tag("外")
@tag("内")
def compute():
    print("计算")
    return 7

print(compute())
`,`准备 外
准备 内
进入 外
进入 内
计算
离开 内
离开 外
7
`,"分别标记表达式求值顺序和调用方向。",["创建两个装饰器时先求外层表达式。","内层先包原函数，外层再包内层。","调用从外层进入，返回沿反方向回到外面。"],"只看到应用顺序从下到上，容易误以为表达式 tag(...) 的求值也从下到上。"),e("decorator-finally","失败请求也留下退出记录","应用",`def audit(fn):
    def call(*args, **kwargs):
        print("开始")
        try:
            return fn(*args, **kwargs)
        finally:
            print("结束")
    return call

@audit
def total(amount):
    if amount < 0:
        raise ValueError("无效金额")
    return amount

try:
    total(-1)
except ValueError:
    print("捕获错误")
`,`开始
结束
捕获错误
`,"观察 finally 和异常向调用者传播的先后。",["包装层进入后调用原函数。","原函数抛出异常，包装层执行 finally。","异常继续传播，由最外层业务代码决定处理方式。"],"在 finally 里 return 会覆盖原来的返回或异常。")]}],comparisons:{headings:["形式","定义阶段得到什么","调用阶段做什么"],rows:[["@trace","trace 接收函数并返回包装器","包装器处理每次调用"],['@tag("外")',"先取得装饰器，再接收函数","包装器保留标签和函数"],["@outer / @inner","内层先应用","由外向内进入，返回方向相反"]]},applications:["用包装器记录函数执行次数、清理资源或校验输入。","评审叠加顺序时，独立测试成功、拦截和抛异常三条路径。"],mistakes:[{symptom:"函数运行正确但调用者收到 None",reason:"包装层调用了原函数却漏掉 return。",fix:"保留原结果并 return，或使用 return fn(...)。",check:"让包装前后的调用者比较所得值。"},{symptom:"审计记录少了拒绝项",reason:"校验包装层先退出，内层审计从未执行。",fix:"按业务需要调换两层顺序。",check:"分别提交一个通过项和一个拒绝项。"}],summary:["装饰器改变函数定义完成后的绑定。包装函数执行发生在随后调用时。","配置、原函数、调用实参分别存放在不同层。","转发参数和结果，使用 wraps 保留元数据，明确叠加顺序及失败路径。"],next:"进入递归前，试着画本节包装调用的进入与返回，调用栈会保存每层的继续位置。",exercises:[s("decorator-binding","还原叠加装饰器","@a 写在 @b 上方，f 定义后的绑定等同于什么？",2,[["b(a(f))","最靠近 def 的 b 先包 f。"],["a(f), b(f)","外层包住内层结果。"],["a(b(f))","先应用 b，再应用 a。"]]),s("decorator-when","判断定义时包装与调用的输出","下面输出什么？",1,[["运行 再 定义","函数实际没有被调用。"],["定义","deco 在定义阶段执行，f 不执行。"],["没有输出","执行 def 时会应用装饰器。"]],`def deco(f):
    print("定义")
    return f
@deco
def f():
    print("运行")`,`定义
`),s("decorator-wraps","辨认 wraps 实际保留的内容","wraps 主要解决什么问题？",0,[["保留被包装函数名称、文档等元数据","包装器获得元数据并保存原函数引用。"],["自动替包装器写 return","返回仍必须显式实现。"],["让拦截条件自动通过","wraps 与业务条件无关。"]]),s("decorator-audit","选择能记录全部尝试的层顺序","guard 拒绝时直接返回。要记录所有尝试，应怎样应用？",2,[["guard(audit(f))","guard 拒绝时不会调用内层 audit。"],["只在 f 中记录","被拒绝时 f 不执行。"],["audit(guard(f))","最外层先记录，之后的校验可以拒绝。"]]),n("A053","基础编程","包装业务函数并返回其原结果。"),n("A054","独立编程","用带配置的装饰器构造不同标签。"),n("A055","综合应用","利用 finally 追踪成功和失败的调用。"),n("A056","拓展挑战","比较两种审计顺序的输出。A094 会直接把业务函数交给你的装饰器。"),n("A094","综合应用","包装不同签名的业务，核对参数、返回值、日志与异常。")],references:[r("函数定义和装饰器","reference/compound_stmts.html#function-definitions","核对表达式求值、应用和名称绑定。"),r("functools.wraps","library/functools.html#functools.wraps","核对元数据与 __wrapped__。"),r("finally 子句","reference/compound_stmts.html#the-try-statement","核对返回和异常传播。")]},Ee={introduction:"有时一个问题可以先解决规模更小的同类问题，再补上当前这一项。递归把这个关系写成函数调用。画出每一层正在等待什么，就能检查入口、终止和逐层返回。",prerequisites:"函数参数、返回值、局部变量、整除与取余。",version:"Python 3.12。教学示例使用有限深度；Python 不会把这种递归自动改成循环。",goals:["为递归写出有意义的终止条件和严格缩小的子问题。","画出至少三层调用帧，逐步算出返回顺序。","用索引递归处理数列，用整除与取余缩小数位问题，并判断何时改用循环。"],topics:[{title:"调用帧、终止条件与返回路径",explanation:["调用帧保存一次执行所需的参数、局部名、执行位置和其他信息。函数调用另一个函数时，当前调用暂停，等待子调用产生值。新调用拥有独立的局部绑定，即使它调用的是同一个函数。","写递归先约定参数范围与返回值，再找无需继续拆分的最小情况，称为终止条件。其他情况缩小问题，保证多次缩小后一定触及终止条件。最后明确怎样用子调用结果恢复原问题的答案。","当 return n * factorial(n - 1) 执行时，本层先保存 n 并等待乘法另一项。最深一层返回后，上一层继续乘法，再把结果交回更上一层。栈按后进入先返回的顺序工作。"],diagram:{caption:"计算 3! 的下降与返回",text:`下降：factorial(3) 等 3×? → factorial(2) 等 2×? → factorial(1) 等 1×? → factorial(0)
返回：1 → 1×1 = 1 → 2×1 = 2 → 3×2 = 6`},examples:[e("recursion-factorial","打印阶乘的进入和返回","起步",`def factorial(n):
    print("进", n)
    if n == 0:
        print("出", n, 1)
        return 1
    result = n * factorial(n - 1)
    print("出", n, result)
    return result

print("结果", factorial(3))
`,`进 3
进 2
进 1
进 0
出 0 1
出 1 1
出 2 2
出 3 6
结果 6
`,"同时追踪下降时的调用和回升时的乘法。",["每层 n 减一，最终到 n=0。","最内层直接返回乘法单位元 1。","等待中的三层依次恢复，各自使用本层保存的 n。"],"0! 必须返回 1。若未限制负数输入，n-1 会远离终止条件。"),e("recursion-prefix","按位置求一张列表的合计","应用",`def total_from(values, index):
    if index == len(values):
        return 0
    return values[index] + total_from(values, index + 1)

print(total_from([2, -1, 4], 0))
print(total_from([], 0))
`,`5
0
`,"保留同一个列表，通过索引表达更短的未处理区间。",["每层恰好负责一个下标。","走到列表末尾时返回加法单位元 0。","各层加回自己负责的元素。"],"每层传 values[1:] 会额外复制列表。保留原表和边界可以避免反复拷贝。")]},{title:"数位递归和循环表达",explanation:["非负整数 n // 10 会去掉末位，n % 10 取末位。把末位的工作和剩余数位分开，n 就会缩小。若允许负数，先取绝对值。0 视为一位还是没有剩余位，由题意决定；例如取数位和时空余贡献 0，计数和校验可能要单独处理 0 的表示。","同一递减过程常能改写成循环。循环通常只维护当前 n 和累加量，递归还要为未结束的调用保留帧。即使有正确终止条件，调用过深也可能触发 RecursionError，具体上限由解释器与当前栈深决定。对长线性过程优先评估循环。"],examples:[e("recursion-digit-sum","沿十进制末位缩小问题","起步",`def digit_sum(n):
    if n < 10:
        return n
    return n % 10 + digit_sum(n // 10)

print(digit_sum(205))
print(digit_sum(0))
`,`7
0
`,"验证中间零位仍然参与拆分。",["205 贡献末位 5，递归到 20。","20 贡献 0，递归到 2。","2 直接返回，再一路加回，得到 7。"],"使用 // 进行整数整除，确保下一层仍收到整数。"),e("recursion-to-loop","把待累加的局部值移到显式变量","应用",`def recursive(n):
    if n == 0:
        return 0
    return n + recursive(n - 1)

def iterative(n):
    total = 0
    while n > 0:
        total += n
        n -= 1
    return total

print(recursive(5), iterative(5))
print(iterative(2000))
`,`15 15
2001000
`,"比较相同线性工作量的两种状态表达。",["递归向下保存每个待加值。","循环直接把待加值给 total。","输入很长时，迭代版本不会为每项分配一次调用帧。"],"提高递归上限会改变进程设置，对简单线性累加先使用循环。")]}],comparisons:{headings:["问题","子问题怎样缩小","终止时返回"],rows:[["阶乘","n 每次减一","0! 返回 1"],["列表求和","索引向末尾移动","空后缀返回 0"],["数位和","整除 10 去末位","单个数位本身"]]},applications:["在递归调用前后打印入栈、返回值和参数，找出错误发生的那一层。","处理长线性数据前对比递归栈与循环累加量。"],mistakes:[{symptom:"正数输入依然递归到超限",reason:"递归参数未缩小，或跨过了唯一允许的终止值。",fix:"写清参数域、每步的缩小量和可达的终止条件。",check:"从最小输入及其邻居各手推一次。"},{symptom:"最内层算对了，外层却返回 None",reason:"调用了子函数却没有返回合成结果。",fix:"明确子结果在本层怎样参与计算，并 return。",check:"从栈底向上写出每一层返回值。"}],summary:["每个调用有自己的参数与继续位置。","先确定子问题和终止值，再写返回合成式。","长线性递归的时间与循环可能同阶，栈空间另计。"],next:"下一课把递归用于对半查找、不规则目录和重复子问题。",exercises:[s("recursion-frame","区分进入顺序与返回顺序","f(3) 依次调用 f(2)、f(1)、f(0)，哪层最先返回？",0,[["f(0)","终止条件所在的最内层先返回。"],["f(3)","外层等待子调用完成后才能恢复。"],["由参数大小的比较函数决定","一条调用链沿调用栈回退。"]]),s("recursion-base","选择乘积的终止返回值","若 product(n) 返回 1 到 n 的乘积，product(0) 应为多少？",1,[["0","乘数 0 会让所有较大输入最终得到 0。"],["1","空乘积的值为 1。"],["None","None 无法参与这里的整数乘法。"]]),s("recursion-trace","手推子调用返回值","代码输出什么？",2,[["4","第一次调用会等待后续实际结果。"],["12","每层参数减少 2，只有 4 和 2 作贡献。"],["6","f(0) 返回 0，f(2) 返回 2，f(4) 返回 6。"]],`def f(n):
    if n <= 0:
        return 0
    return n + f(n - 2)
print(f(4))`,`6
`),s("recursion-deep","为长的线性处理选择实现","已知要逐项处理 50000 条记录，只保存一个总量。优先用什么？",2,[["每条数据建一帧","可能超过解释器深度限制。"],["每层递归复制后缀","会引入额外复制与栈。"],["循环维护总量","可以逐项更新且不累积调用帧。"]]),{...n("A057","基础编程","用阶乘计算不同展品的排列数。"),warmup:!0},n("A095","基础编程","算出分枝高度并记录下降与返回。自动评测核对返回值和完整回调顺序，等价实现也可通过。请用注释解释递归的终止条件和子问题。"),n("A058","独立编程","用整除和取余做交替权重的数位校验。"),n("A059","综合应用","递归扫描连续可处理记录并保留剩余额度。"),n("A060","拓展挑战","构造进入和返回的完整层级轨迹。")],references:[r("调用帧","reference/executionmodel.html#structure-of-a-program","核对代码块与本次执行的帧。"),r("return 语句","reference/simple_stmts.html#the-return-statement","核对从当前函数调用返回值的规则。"),r("递归上限","library/sys.html#sys.getrecursionlimit","核对解释器限制与栈空间。")]},ye={introduction:"有序表能排除一半候选；目录由子目录和文件组成；斐波那契的两个分支却可能反复询问同一个数。三者都能用递归表达，工作量却取决于子问题的形状和是否重叠。",prerequisites:"调用栈、递归终止、排序和字典，熟悉函数关键字参数与装饰器读法。",version:"Python 3.12。示例中的复杂度按访问次数或整数运算次数计算，长整数运算的代价另计。",goals:["用半开区间实现递归二分，能检查空区间、重复值和边界。","按结构遍历嵌套目录，返回可合并的汇总值，估算节点数与深度的影响。","用记忆化消除重复子问题，并比较递归、迭代和缓存所需空间。"],topics:[{title:"分治定位和树结构递归",explanation:["分治把问题拆成较小的子问题。递归二分是每次仅处理一个较小区间的查找。对升序表寻找第一个不小于 target 的位置，让候选范围为 [left, right)。mid 不满足时排除它及左侧，下一段是 [mid+1, right)；满足时下一段是 [left, mid)。最终 left == right，该位置可能是表尾。","树可以表达零个或多个子节点组成的层次。文件或其他没有子节点的数据常按叶子处理；目录可能有空的子节点列表。若返回每个子树的大小和文件数，目录层可以把子结果相加。每个节点只访问一次时，时间随节点数增长，递归栈随树的最大深度增长。","进入节点时处理叫先序，完成子节点后处理叫后序。要按进入顺序展示、按离开顺序算总量，可以进入时记录序号或预留行，离开时填入结果。目录很深或输入深度不可信时，可用显式栈控制状态。"],examples:[e("design-interval","递归找第一个大于等于目标的位置","起步",`def lower_bound(values, target, left, right):
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
`,`1
3
4
`,"在重复值、组间空隙和表尾手推半开区间变化。",["找 4 时中间遇到相等值，仍向左收缩。","找 8 时最后收缩到 9 的位置。","找 10 时返回长度 4，此位置不应继续索引。"],"将左区间写成 [left, mid+1) 会在某些单元素区间不再缩小。"),e("design-tree","汇总小目录的字节数和文件数量","应用",`def summarize(node):
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
`,`(7, 3)
(0, 0)
`,"每个分支返回同形状的汇总，空目录也能合并。",["整数是一个文件，零字节仍算一份。","子目录 [0, 3] 返回 (3, 2)。","空目录返回 (0, 0)，根只需要相加各子结果。"],"if not node 会把零字节文件和空目录一起判为空，应先看节点类型。"),e("design-json-tree","从一行 JSON 画树，再从叶子汇总","应用",`import json

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
`,`str list
R list
A 4 1
B 0 0
R 4 2
TOTAL 4 2
`,"JSON 把嵌套数组写成一行文本。json.loads 把字符串转换成 Python 对象。在 stdin 题可把 text 替换为 input()。从文件读时可以先用 file.read()，再把所得文本交给 json.loads。",["先在纸上画 R，其下依次写 zero、A、B。A 下再连 note，B 下无子节点。把整数标在文件旁，目录旁写 [] 或子节点名。","从下往上标返回值。zero 返回 (0, 1)，note 返回 (4, 1)，所以 A 返回 (4, 1)。B 没有子节点，返回 (0, 0)。R 对三个子结果分别相加，得到 (4, 2)。","A063 把目录的第一个字段当作启用标记。用 enabled, children = node 解包，先判断停用，再决定要不要访问孩子。A064 像这里一样解包名称与内容，进入目录时记下行序，返回时回填统计。上面的打印用于观察返回顺序。"],"输入中的双引号属于 JSON。直接遍历 input() 读到的是单个字符。解析后，用整数类型区分文件和目录，避免把 0 字节文件误判成空目录。")]},{title:"重复子问题、记忆化与迭代",explanation:["F(n)=F(n-1)+F(n-2) 的朴素递归会在不同分支重复计算同一个 F(k)，调用数随 n 指数增长。把已经算出的参数和结果保存在字典，下次直接查表，这就是记忆化。functools.cache 提供这种模式，参数须可哈希，相同参数应始终产生同样结果。","记忆化把斐波那契的不同子问题降到 n+1 个，仍要保留结果与递归调用栈。若只求从低到高的一个值或末尾值，可用两个滚动变量从 F(0)、F(1) 向上计算。若要反复查询任意已算索引，也可以提前建表。","状态参与结果时，缓存键要覆盖所有相关输入。比如费率每次变动，就把费率作为参数，或在变动时清理缓存。cache 默认不设上限，连续处理大量独立数据时要计划释放或限制缓存。"],examples:[e("design-memo-count","用计数比较两种斐波那契写法","应用",`from functools import cache

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
`,`21 67
21 9
13 9
`,"区分函数入口调用与真正进入被缓存函数体的次数。",["朴素计算八号项重复访问较小项，共进入 67 次。","缓存版每个 n 的函数体最多执行一次，共 9 次。","之后询问 7 命中缓存，函数体计数不再增加。"],"cache 缓存的是参数对应的结果。被缓存函数体中的打印或计数不会因命中而再次执行。"),e("design-explicit-stack","显式栈保留项目树的先序","应用",`tree = ("根", [("A", [("X", [])]), ("B", [])])
pending = [tree]
order = []
while pending:
    name, children = pending.pop()
    order.append(name)
    pending.extend(reversed(children))
print(" ".join(order))
`,`根 A X B
`,"把未处理节点移到自己维护的栈。",["弹出根后，孩子反序入栈，A 在栈顶。","先访问 A 的后代 X，再访问 B。","树很深时，这个循环不依赖 Python 的递归深度。"],"若按原顺序把孩子逐个入栈，最后一个孩子会先被处理。")]}],comparisons:{headings:["形状","典型操作次数","额外空间"],rows:[["二分只走一支","O(log n) 次比较","O(log n) 栈帧"],["树节点各访问一次","O(n) 次访问","O(h) 栈帧，h 为深度"],["斐波那契带缓存","O(n) 次状态计算","O(n) 条缓存与 O(n) 栈帧"],["斐波那契滚动计算","O(n) 次加法","O(1) 个计数变量，同时受整数长度影响"]]},applications:["输入已经有序时定位可插入边界，使重复键得到可预测的定位。","树形报表把先序展示和后序汇总分开，并分别测试零文件、空目录和最大深度。"],mistakes:[{symptom:"目标在表尾时发生越界",reason:"二分返回的是插入位置，允许等于长度。",fix:"需要精确匹配时先验索引小于长度，再看该值是否等于目标。",check:"测试空表和大于最大值的目标。"},{symptom:"规则变了却重复返回旧值",reason:"配置参与结果，却未纳入缓存键。",fix:"将配置放入参数，或在规则变化时重置缓存。",check:"用相同数据和不同费率各计算一次。"}],summary:["二分每步缩小候选区间；树递归从各个子节点合并答案。","记忆化适合确定且重叠的子问题；滚动迭代适合只需少量前序结果的序列。","分析时区分访问次数、栈深、缓存大小和整数长度。"],next:"先完成目录配额的阶段测评。下一模块将用类来组织状态和操作规则。",exercises:[s("design-mid","核对半开区间被排除后怎样收缩","mid 项小于 target，下一段候选是什么？",1,[["[left, mid)","这会丢掉更大的右侧。"],["[mid+1, right)","mid 和前面都不可能达到门槛。"],["[mid, right)","仍保留已被排除的 mid，可能停止缩小。"]]),s("design-empty-directory","区分零字节文件和空目录","目录内容为 [0, []]，总字节、文件数是多少？",2,[["0、0","整数 0 表示一份文件。"],["0、2","空目录没有文件。"],["0、1","零字节文件计数，空目录不增加计数。"]]),s("design-cache-hit","辨认缓存命中时是否执行原函数","代码输出什么？",0,[["算 3，随后打印 6 6","同一参数第二次命中缓存。"],["算 3 出现两次","第二次返回缓存值。"],["只输出 6 6","首次仍需要执行函数体。"]],`from functools import cache
@cache
def f(n):
    print("算", n)
    return n * 2
print(f(3), f(3))`,`算 3
6 6
`),s("design-depth","估算树递归的峰值深度","两棵树都有 100 个节点。一棵只有根和一层孩子，另一棵是一条长链，哪棵需要更多递归帧？",1,[["只有一层孩子的树","子调用逐个完成，兄弟节点不会同时留在栈上。"],["长链","每一层等待下一个节点，深度可达 100。"],["两棵都相同","总访问数相同，峰值同时活跃的层数不同。"]]),n("A061","基础编程","核对最早出现或可插入的位置。自动评测检查定位结果，递归区间的缩小过程请自行画出。"),n("A062","独立编程","复用多次斐波那契查询的子结果。"),n("A063","综合应用","剪去停用目录分支并合并子树指标。"),n("A064","拓展挑战","完成完整目录报表，核验先序顺序与后序累加。")],references:[r("json.loads 与类型转换","library/json.html#json.loads","核对 JSON 数组和数字怎样转换成 Python 列表和整数。"),r("bisect 的左边界","library/bisect.html#bisect.bisect_left","核对插入位置与重复值语义。"),r("functools.cache","library/functools.html#functools.cache","核对按参数复用计算和缓存上限。"),r("调用深度限制","library/sys.html#sys.getrecursionlimit","区分调用深度与数据总量。")]},L=(a,p,c)=>Array.from({length:p},(m,d)=>a+String(d).padStart(c-a.length,"0")),S=L("T",146,10),C=S.slice(99),R={input:S.slice(0,99).join(" ")+`
47
`+C.map(a=>"COMMIT "+a).join(`
`)+`
`,output:C.map((a,p)=>S.slice(0,100+p).join(",")+`
`).join("")+S.join(",")+`
`},I=L("Q",101,8),K={input:`300
BORROW OWNER001
`+I.map(a=>"QUEUE "+a+`
`).join("")+`SHOW
`.repeat(69)+`RETURN WRONG001
`.repeat(129),output:`OK
`.repeat(102)+("OWNER001 "+I.join(",")+`
`).repeat(69)+`DENIED
`.repeat(129)},P=L("R",120,10),U={input:`NORMAL 240
ADD BOOK000001 TITLE00001
BORROW BOOK000001 OWNER00001
`+P.map(a=>"HOLD BOOK000001 "+a+`
`).join("")+`SHOW BOOK000001
`.repeat(47)+`SHOW MISSING
`.repeat(71),output:`OK
`.repeat(122)+("BOOK000001 TITLE00001 OWNER00001 "+P.join(",")+`
`).repeat(47)+`UNKNOWN
`.repeat(71)},z={...t(38,i[0],"入门","隔离小票标签",{background:"小票编辑器在同一进程里连续调用标签函数，后一单不能继承上一单的内容。",description:"修复起始代码，使每次调用 receipt_tag(name) 都返回当前箱号前加 BOX: 的结果。",input:"评测器直接调用 receipt_tag(name)，同一组可能连续调用多次。无需读取输入。",output:"返回字符串 BOX:箱号。函数调用和模块导入均不打印内容。",limits:"箱号为 1–12 位英数字，重复箱号也必须独立处理。"},["","","该次调用只处理 A2。",{calls:[{args:["A2"],expected:"BOX:A2"}]}],[["","",{calls:[{args:["A"],expected:"BOX:A"},{args:["B"],expected:"BOX:B"}]}],["","",{calls:[{args:["X"],expected:"BOX:X"},{args:["X"],expected:"BOX:X"}]}],["","",{calls:[{args:["00"],expected:"BOX:00"},{args:["b"],expected:"BOX:b"}]}]],["尝试在一次导入后调用函数两次。","只需要一个标签时可以直接构造文本；需要列表时，可在函数体内创建。"],`def receipt_tag(name):
    return "BOX:" + name
`,{concepts:["默认对象","重复调用","return"],approach:"本次小票只依赖传入的箱号，移除跨调用存储。",steps:["由形参取得当前箱号。","拼接指定前缀。","使用 return 交给调用方。"],time:"O(s)，s 为箱号长度。",space:"O(s) 返回结果。",pitfall:"复用默认列表会让第二个调用带上上一单的箱号。",extension:"增加可选的标签表参数，区分省略与明确提供空列表。"}),contract:{kind:"function",files:["main.py"],target:{module:"main",name:"receipt_tag"}},starterFiles:[{name:"main.py",content:`def receipt_tag(name, labels=[]):
    labels.append(name)
    return "BOX:" + ",".join(labels)
`}]},xe=[t(37,i[0],"入门","分开商品款和包装费",{background:"寄件单分别显示商品款与最终应付。包装费可采用默认值或为某单覆写。",description:"每笔商品款等于数量乘单价，应付为商品款加包装费。未填包装费时使用 2。",input:"首行 q。随后 q 行，每行给数量、单价，可附第三项包装费。",output:"每单一行两个整数，依次为商品款与应付。",limits:"0 ≤ q ≤ 200，其余整数均为 0–1000。显式 0 表示免包装费。"},[`3
3 5
3 5 0
0 8 7
`,`15 17
15 15
0 7
`,"第二笔显式免包装费，第三笔只有包装费。"],[[`0
`,""],[`1
1 0
`,`0 2
`],[`2
1 9 2
1 9 3
`,`9 11
9 12
`]],["让包装费形参带默认值。","根据数据列数决定是否提供第三个实参。"],`def bill(quantity, price, packing=2):
    subtotal = quantity * price
    return subtotal, subtotal + packing

for _ in range(int(input())):
    fields = list(map(int, input().split()))
    merchandise, due = bill(*fields)
    print(merchandise, due)
`,{concepts:["默认形参","位置展开","元组返回"],approach:"函数负责计算，入口解析列并解包结果。",steps:["将每单读成整数列表。","位置展开两项或三项。","解包商品款、应付并输出。"],time:"O(q)。",space:"O(1) 每单空间。",pitfall:"显式的 0 要按原值使用。",extension:"增加只能按名字传入的税率。"}),z,t(39,i[0],"基础","预览或提交标签",{background:"库房的标签预览仅生成草稿，提交才改变正式名单。",description:"对 PREVIEW 标签输出追加后的草稿，正式名单保持原样。对 COMMIT 标签追加到正式名单并输出。最后输出正式名单。",input:"首行为现有标签，空格分隔，可为空。第二行 q，后续 q 行是动作与标签。",output:"逐条输出名单，末尾再输出正式名单。名单元素用逗号连接，空名单写 NONE。",limits:"现有标签数、q 均为 0–100。标签为 1–10 位 ASCII 英数字，重复项保留。每条操作输出的名单和最后的正式名单都要计入预算：每行计 max(1, 该行标签数)，合计不得超过 5957。可按输入顺序维护正式名单长度，预览不增加它。每个计数单位最多 11 字节，总输出不超过 65527 字节。"},[`A
3
PREVIEW X
COMMIT B
PREVIEW Y
`,`A,X
A,B
A,B,Y
A,B
`,"X 和 Y 只出现在预览。"],[[`
0
`,`NONE
`],[`
2
PREVIEW A
PREVIEW B
`,`A
B
NONE
`],[`Z
2
COMMIT Z
PREVIEW A
`,`Z,Z
Z,Z,A
Z,Z
`],[`
6
PREVIEW A
COMMIT B
PREVIEW C
COMMIT C
PREVIEW A
COMMIT B
`,`A
B
B,C
B,C
B,C,A
B,C,B
B,C,B
`],[R.input,R.output]],["预览时复制外层列表即可。","在公共函数里先选定要修改的对象，再 append。"],`def updated(tags, label, *, commit):
    target = tags if commit else tags.copy()
    target.append(label)
    return target

current = input().split()
for _ in range(int(input())):
    action, label = input().split()
    print(",".join(updated(current, label, commit=action == "COMMIT")))
print(",".join(current) or "NONE")
`,{concepts:["对象引用","原地修改","浅拷贝"],approach:"提交和预览共用追加逻辑，由选定的目标对象决定副作用。",steps:["读取正式名单。","提交沿用原名单，预览另取一个浅副本。","打印各操作结果，再读原名单核对状态。"],time:"O(q(n+q)+n)，n 为初始标签数。",space:"O(n+q)。",pitfall:"把预览返回值赋给 current 会使正式名单指向草稿。",extension:"增加标签撤回，并分别输出预览和撤回后的结果。"}),t(40,i[0],"进阶","多窗口流水结算",{background:"每个窗口独立结算，撤回单只计无效，退款作为负金额影响净额。",description:"每窗口计算收入、净额和无效单数。状态 OK 且金额绝对值不超过该窗口上限为有效。有效正金额计入收入，全部有效金额计入净额。",input:"首行窗口数 w。每窗口先有一行 n cap，再有 n 行「OK 或 VOID 金额」。",output:"逐窗口输出「收入 净额 无效单数」，最后一行以相同格式输出所有窗口合计。",limits:"0 ≤ w ≤ 30，0 ≤ n ≤ 50，0 ≤ cap ≤ 10000，金额在 -10000–10000。"},[`2
4 8
OK 8
OK -6
OK 9
VOID 0
1 5
OK -5
`,`8 2 2
0 -5 0
8 -3 2
`,"第一窗收入 8，净额只计 8 与 -6。"],[[`0
`,`0 0 0
`],[`1
2 0
OK 0
OK -1
`,`0 0 1
0 0 1
`],[`2
0 2
2 2
OK -2
VOID -2
`,`0 0 0
0 -2 1
0 -2 1
`]],["计算函数返回固定的三个值。","窗口入口解包后，各自更新跨窗口的合计。"],`def summarize(entries, cap):
    income = net = rejected = 0
    for status, amount in entries:
        if status != "OK" or abs(amount) > cap:
            rejected += 1
            continue
        income += max(amount, 0)
        net += amount
    return income, net, rejected

all_income = all_net = all_rejected = 0
for _ in range(int(input())):
    count, cap = map(int, input().split())
    entries = []
    for _ in range(count):
        status, amount = input().split()
        entries.append((status, int(amount)))
    income, net, rejected = summarize(entries, cap)
    print(income, net, rejected)
    all_income += income
    all_net += net
    all_rejected += rejected
print(all_income, all_net, all_rejected)
`,{concepts:["元组契约","参数传递","局部累计"],approach:"每个窗口独立求值，主程序再合并三个结果。",steps:["把窗口输入制成记录表。","使用窗口上限区分有效和无效，再累计原金额。","输出本窗口的值并累计到最终报告。"],time:"O(w+N)，N 为全部记录数。",space:"O(m)，m 为最大窗口记录数。",pitfall:"收入和净额分开更新，退款只改变净额。",extension:"同时返回每组拒绝的原始行号，按窗口生成审核日志。"}),t(41,i[1],"入门","包间与候补配额",{background:"场地方分别接收实际席位请求和原有候补数，超出包间容量的请求进入候补。",description:"确认可坐下的人数及总候补数。总候补包含已有候补，以及新请求中超容量的人。",input:"首行 q。随后 q 行分别为 capacity requested 和可选的 standby，省略 standby 时为 0。",output:"每行两个整数「确认人数 总候补」。",limits:"0 ≤ q ≤ 250，其余整数为 0–1000。建议容量按位置传，requested 与 standby 按关键字传。"},[`3
3 5
4 3 2
0 1 4
`,`3 2
3 2
0 5
`,"第一批有两人超容量。"],[[`0
`,""],[`1
3 3
`,`3 0
`],[`2
0 0 1
5 0
`,`0 1
0 0
`]],["使用 min 得到确认人数。","把 requested 和 standby 写到 * 右边。"],`def allocate(capacity, /, *, requested, standby=0):
    seated = min(capacity, requested)
    return seated, standby + requested - seated

for _ in range(int(input())):
    capacity, requested, *extra = map(int, input().split())
    options = {"standby": extra[0]} if extra else {}
    print(*allocate(capacity, requested=requested, **options))
`,{concepts:["位置专用","关键字专用","默认值"],approach:"把容量和两个业务选项分开绑定，明确总候补的组成。",steps:["读容量与请求数。","存在第三项时准备显式选项。","按签名调用，展开返回元组。"],time:"O(q)。",space:"O(1)。",pitfall:"确认数已包含在请求数中，应以请求数减确认数计算新增候补。",extension:"对无容量和负数请求给出不同验证错误。"}),t(42,i[1],"入门","多箱称重",{background:"称重台给同一批货箱设置重量上限，并记录通过的总重与超重箱数。",description:"重量不超过上限的箱子计入总重，其他箱子仅计其数量。空批次的两项结果都是 0。",input:"首行 q，后 q 行每行是上限，后接 0–40 个箱重。",output:"每批一行「通过总重 超重箱数」。",limits:"0 ≤ q ≤ 200，重量与上限在 0–1000。等于上限时通过。"},[`3
5 1 5 6
0 0 1
4
`,`6 1
0 1
0 0
`,"第二批的零重量合法。"],[[`0
`,""],[`1
7 7 7
`,`14 0
`],[`1
3 4 5 6
`,`0 3
`]],["上限是仅限关键字参数。","用 *weights 接收拆包后任意数量的重量。"],`def weigh(*weights, limit):
    total = sum(weight for weight in weights if weight <= limit)
    rejected = sum(weight > limit for weight in weights)
    return total, rejected

for _ in range(int(input())):
    limit, *weights = map(int, input().split())
    print(*weigh(*weights, limit=limit))
`,{concepts:["变长位置实参","仅限关键字","空元组"],approach:"入口先拆称重行，限额与可变重量分别传给函数。",steps:["读取限额并收集剩余项。","展开重量，明确传 limit。","对已收集的元组求重量和超重数。"],time:"O(q+N)，N 为箱数。",space:"O(m)，m 为单批最大箱数。",pitfall:"把 limit 放在位置实参中会让它被 weights 接收。",extension:"同时输出刚好等于上限的箱数。"}),t(43,i[1],"基础","计费设置逐层覆盖",{background:"同一台打印机有初始费率和加急费，门店设置以及订单设置可逐层覆盖。",description:"默认 rate=2、rush=0。先应用门店设置，再应用该订单设置。订单计费为页数乘最终费率加最终加急费。",input:"首行 s q。随后 s 行给门店设置键和值。之后 q 行各为页数及任意个 key=value，表示当单改动。",output:"每份订单输出应付整数。",limits:"0 ≤ s ≤ 20，0 ≤ q ≤ 200，键只有 rate、rush，值和页数为 0–1000。同层重复键以最后为准。"},[`2 3
rate 3
rush 4
5
5 rush=0 rate=2
0 rush=6
`,`19
10
6
`,"第二单明确取消加急费并覆写费率。"],[[`0 1
2
`,`4
`],[`2 1
rate 3
rate 5
4
`,`20
`],[`0 2
3 rate=1 rate=0
3
`,`0
6
`]],["每层先变成字典，保留最后一次赋值。","合并得到最终映射，再展开一次。"],`def fee(pages, /, *, rate=2, rush=0):
    return pages * rate + rush

s, q = map(int, input().split())
shop = {}
for _ in range(s):
    key, value = input().split()
    shop[key] = int(value)
for _ in range(q):
    pages, *fields = input().split()
    order = {}
    for field in fields:
        key, value = field.split("=")
        order[key] = int(value)
    print(fee(int(pages), **(shop | order)))
`,{concepts:["关键字展开","字典合并","分层默认配置"],approach:"签名保留默认，门店配置保存一次，当单配置每次重新构造。",steps:["读门店配置，冲突由后值取代。","逐笔合并该单设置。","把最终字典交给费率函数。"],time:"O(s+q+v)，v 为所有订单选项数。",space:"O(m)，m 为单行订单选项数，设置字典最多两个键。",pitfall:"对 shop 原地更新会让本单的覆盖错误影响后续订单。",extension:"加入门店费率更新事件，区分当前设置和一次性覆盖。"}),t(44,i[1],"进阶","名额接口参数验收",{background:"第三方登记入口收到选项文本，必须反馈有重复、拼写错误或缺必填项的调用。",description:"zone 必填，hold 可选且默认 0。先判同名选项重复，再判未知键，最后判 zone 缺失。合法时返回区名及数量减去 hold（最小为 0）。",input:"首行 q，随后 q 行。每行为数量与零到多个 key=value。zone 值是英文字母串，hold 若出现则为整数，未知键值为非空白字符串。",output:"依次按规则输出 DUP、UNKNOWN、MISSING，合法时输出「区名 剩余数量」。",limits:"0 ≤ q ≤ 200，数量与 hold 为 0–1000。每行最多 10 个选项，选项名和值长 1–12。"},[`5
6 zone=N hold=2
7 hold=1
3 zone=N hld=1
2 zone=A zone=B
2 zone=S hold=9
`,`N 4
MISSING
UNKNOWN
DUP
S 0
`,"先拒绝坏选项，合法项再调用接口。"],[[`0
`,""],[`2
3 unknown=1 unknown=2
5 extra=1
`,`DUP
UNKNOWN
`],[`3
4 zone=E
0 zone=S hold=0
7
`,`E 4
S 0
MISSING
`]],["解析时比较选项总数和不同键数量。","只对已经通过校验的映射做 ** 展开。"],`def allocate(count, /, *, zone, hold=0):
    return f"{zone} {max(count - hold, 0)}"

def response(line):
    count, *fields = line.split()
    options = dict(field.split("=", 1) for field in fields)
    if len(options) < len(fields):
        return "DUP"
    if options.keys() - {"zone", "hold"}:
        return "UNKNOWN"
    if "zone" not in options:
        return "MISSING"
    if "hold" in options:
        options["hold"] = int(options["hold"])
    return allocate(int(count), **options)

for _ in range(int(input())):
    print(response(input()))
`,{concepts:["输入校验优先级","仅限关键字","映射展开"],approach:"先用业务规则确定错误码，再让显式签名承接合法参数。",steps:["拆分参数并核对重复。","按未知键、缺键的顺序拒绝。","转换 hold 并展开调用。"],time:"O(q+v)，v 为选项数，字段宽度有界。",space:"O(m)，m 为单行选项数。",pitfall:"字典可能覆盖重复字段，要保留原始字段数协助检测。",extension:"增加数值格式错误，明确其在重复与缺失检查中的优先级。"})],Be=[t(45,i[2],"入门","切换校准模式",{background:"同一读数面板需在不同处理规则下预览原始数据。",description:"DOUBLE 将每项乘二，ABS 取绝对值，SIGN 将负数、零、正数分别转换为 -1、0、1。",input:"第一行模式，第二行是空格分隔的整数，可为空。",output:"以空格连接换算结果，无数据时输出 NONE。",limits:"0–1000 个读数，每项 -10000–10000，模式为 DOUBLE、ABS、SIGN。"},[`SIGN
-7 0 8 -1
`,`-1 0 1 -1
`,"每个位置都产生结果。"],[[`ABS
-3 0 3
`,`3 0 3
`],[`DOUBLE
-4 0 2
`,`-8 0 4
`],[`SIGN

`,`NONE
`]],["字典值存储函数对象。","用 map 把所选规则应用到每个读数。"],`rules = {
    "DOUBLE": lambda value: value * 2,
    "ABS": abs,
    "SIGN": lambda value: (value > 0) - (value < 0),
}
rule = rules[input()]
values = map(int, input().split())
print(" ".join(str(value) for value in map(rule, values)) or "NONE")
`,{concepts:["函数对象","lambda","map"],approach:"选择规则与逐项处理分开，只保留一条转换流程。",steps:["读出模式并取得函数。","读出整数并逐项转换。","格式化或返回空标记。"],time:"O(n)。",space:"O(n)，含读入和输出。",pitfall:"把规则提前调用会让字典存入其结果。",extension:"增加一条只处理低于阈值读数的规则。"}),t(46,i[2],"入门","三种告警筛选规则",{background:"审核界面切换筛选模式，每次应报告所通过的原读数。",description:"MIN 保留 ≥ threshold 的值，MAX 保留 ≤ threshold 的值，GAP 保留与 threshold 不等的值。",input:"首行「模式 threshold」，次行是空格分隔的整数，可为空。",output:"按原顺序输出所有通过值，以一个空格连接；空写 NONE。",limits:"0–800 个整数，值和阈值均在 -1000–1000，重复值逐条判定。"},[`MIN 0
-1 0 3 0
`,`0 3 0
`,"等于阈值也可通过 MIN。"],[[`MAX -2
-1 -2 -3
`,`-2 -3
`],[`GAP 0
0 -1 4 0
`,`-1 4
`],[`MIN 2

`,`NONE
`]],["每条规则都接收一个整数，返回判断结果。","filter 会保留通过筛选的原整数。"],`mode, raw_limit = input().split()
limit = int(raw_limit)
rules = {
    "MIN": lambda value: value >= limit,
    "MAX": lambda value: value <= limit,
    "GAP": lambda value: value != limit,
}
kept = filter(rules[mode], map(int, input().split()))
print(" ".join(map(str, kept)) or "NONE")
`,{concepts:["回调接口","filter","边界"],approach:"按名字选择同一签名的谓词，共享输出流程。",steps:["先确定模式和门槛。","保留谓词为真的原值。","输出原顺序，重复值不合并。"],time:"O(n)。",space:"O(n)，含输入和输出。",pitfall:"输出布尔判断序列会丢失原始读数。",extension:"一次配置两条规则，比较交集与并集的输出。"}),t(47,i[2],"基础","按视角排列工单",{background:"同一份工单可按优先分或耗时浏览，完全并列时要保持录入次序。",description:"SCORE 模式按分数降序、耗时升序。TIME 模式只按耗时升序。输出全部工单编号。",input:"首行「n 模式」，随后 n 行为编号、非负整数分数、耗时。",output:"编号用单空格连接，空表写 NONE。",limits:"0 ≤ n ≤ 600，编号唯一，1–10 位英数字，分数和耗时为 0–1000。"},[`4 SCORE
Z 9 3
A 8 1
B 9 3
C 9 2
`,`C Z B A
`,"Z 与 B 比较键相同，保留录入顺序。"],[[`0 SCORE
`,`NONE
`],[`3 TIME
Z 0 1
A 9 1
B 1 0
`,`B Z A
`],[`3 SCORE
A 0 0
B 3 3
C 3 2
`,`C B A
`]],["用一个函数按模式返回比较键函数。","同键不添加编号比较，可保留 Python 的稳定排序。"],`def select_key(mode):
    if mode == "SCORE":
        return lambda row: (-row[1], row[2])
    return lambda row: row[2]

length, mode = input().split()
rows = []
for _ in range(int(length)):
    code, score, minutes = input().split()
    rows.append((code, int(score), int(minutes)))
print(" ".join(row[0] for row in sorted(rows, key=select_key(mode))) or "NONE")
`,{concepts:["返回函数","稳定排序","复合排序键"],approach:"主流程只调用一次 sorted，比较含义来自传入的规则。",steps:["将分数与耗时解析为整数。","按模式构造或选择键函数。","用稳定排序得到编号顺序。"],time:"最坏 O(n log n) 次比较。",space:"O(n)。",pitfall:"把编号放进键会改变完全并列项的顺序。",extension:"增加只按分数排序的视角，单测各键函数。"}),t(48,i[2],"进阶","读数转换管道",{background:"编辑器使用若干已知规则组成转换流程。先过滤后换算与先换算后过滤可能得到不同结果。",description:"按顺序依次应用规则：ADD3 每项加 3，DOUBLE 每项乘二，ABS 取绝对值，DROPNEG 去掉当前负数。规则可以重复。",input:"两行。第一行是规则名序列，可为空。第二行是空格分隔的整数，可为空。",output:"第一行为最终序列，用单空格连接，空写 NONE。第二行为最终序列合计。",limits:"0–12 条规则，0–300 个整数，原值 -1000–1000，保留重复值。"},[`ADD3 DROPNEG DOUBLE
-4 -3 -1 2
`,`0 4 10
14
`,"第一步后只有原 -4 仍为负数。"],[[`
-2 0 2
`,`-2 0 2
0
`],[`DROPNEG ABS
-5 -1
`,`NONE
0
`],[`ABS DROPNEG DOUBLE DOUBLE
-3 0
`,`12 0
12
`],[`ADD3

`,`NONE
0
`]],["先约定每个规则接收序列，产出下游能继续读取的序列。","最终列表要打印又要求和，先物化一次。"],`def run_pipeline(values, steps):
    for step in steps:
        values = step(values)
    return list(values)

rules = {
    "ADD3": lambda values: map(lambda x: x + 3, values),
    "DOUBLE": lambda values: map(lambda x: x * 2, values),
    "ABS": lambda values: map(abs, values),
    "DROPNEG": lambda values: filter(lambda x: x >= 0, values),
}
steps = [rules[name] for name in input().split()]
result = run_pipeline(map(int, input().split()), steps)
print(" ".join(map(str, result)) or "NONE")
print(sum(result))
`,{concepts:["高阶函数","惰性管道","组合与消费"],approach:"让各步骤遵守相同可迭代接口，前一步的结果直接交给下一步。",steps:["把规则名翻译成函数序列。","依次应用转换或筛选。","收集终值一次，供显示和求和复用。"],time:"O(n(k+1))，n 为输入项数，k 为规则数。",space:"O(n+k)。",pitfall:"规则不可任意交换。若先 sum 消费终值会丢失待展示的明细。",extension:"支持 CHECKPOINT 规则输出中间表，解释缓冲的空间代价。"}),t(49,i[3],"入门","门店默认值与一次覆盖",{background:"每单可以临时改费率，管理员也可以更新长期设置。",description:"费率从输入初值开始。SET 改长期费率，USE 用当前费率算订单，ONE 仅在此次采用显式费率。",input:"首行「初值 q」。随后 q 行为 SET 费率、USE 数量，或 ONE 数量 费率。",output:"每个 USE 和 ONE 输出数量乘对应费率。最后输出长期费率。",limits:"0 ≤ q ≤ 300，所有数值为 0–1000。"},[`2 4
USE 3
ONE 3 9
SET 0
USE 3
`,`6
27
0
0
`,"ONE 的 9 只用于当单。"],[[`6 0
`,`6
`],[`3 2
ONE 2 0
USE 2
`,`0
6
3
`],[`0 3
SET 3
SET 7
USE 2
`,`14
7
`]],["持久设置和当单参数可以同名，但归属不同。","明确声明 SET 修改模块绑定，计算函数可直接接收一次性新值。"],`rate, q = map(int, input().split())

def set_rate(value):
    global rate
    rate = value

def charge(units, override=None):
    return units * (rate if override is None else override)

for _ in range(q):
    action, *raw = input().split()
    values = list(map(int, raw))
    if action == "SET":
        set_rate(*values)
    else:
        print(charge(*values))
print(rate)
`,{concepts:["全局绑定","读取自由名称","一次覆盖"],approach:"只有更新命令重绑持久费率，调用参数只影响当单计算。",steps:["保存初始设置。","按动作更新或计算。","最后检查持久绑定。"],time:"O(q)。",space:"O(1)。",pitfall:"用 override or rate 会忽略明确设置的 0。",extension:"改成工厂提供每个门店独立的设置和计费函数。"}),t(50,i[3],"入门","双窗口独立计数",{background:"两个窗口维护各自的排队数，增减事件可能交错。",description:"E 和 W 从各自初值开始。每个事件只向指定窗口的计数加上该事件增量并输出新值。",input:"首行「E 初值 W 初值 q」，随后 q 行分别为窗口编号 E 或 W 与有符号增量。",output:"每次更新输出一个新的窗口计数。",limits:"0 ≤ q ≤ 500，初值和增量为 -1000–1000。负计数允许。"},[`0 10 4
E 3
W -1
E 0
W 2
`,`3
9
3
11
`,"两个窗口更新相互独立。"],[[`4 3 0
`,""],[`0 0 3
E 1
W 1
E 1
`,`1
1
2
`],[`-1 -2 2
E -3
W 0
`,`-4
-2
`]],["每次工厂调用保存一份初始计数。","内部函数用 nonlocal 更新自己的计数。"],`def make_counter(value):
    def add(delta):
        nonlocal value
        value += delta
        return value
    return add

east, west, q = map(int, input().split())
counters = {"E": make_counter(east), "W": make_counter(west)}
for _ in range(q):
    desk, delta = input().split()
    print(counters[desk](int(delta)))
`,{concepts:["闭包","nonlocal","独立实例状态"],approach:"工厂的两次执行产生两份绑定，按窗口取相应回调。",steps:["从两个初值分别创建回调。","按窗口取函数。","让函数更新并返回自己的计数。"],time:"O(q)。",space:"O(1)。",pitfall:"将同一个闭包赋给两个窗口会共享计数。",extension:"增加 READ 事件，读取但不改变窗口计数。"}),t(51,i[3],"基础","延后调用的转换规则",{background:"设备预先登记规则，读取数据时再按设备编号调用，避免循环结束后全部采用最后一份规则。",description:"ADD 对读数加指定常量，SCALE 乘指定常量。每个查询根据编号使用该设备登记的规则。",input:"首行 n q。随后 n 行为编号、ADD 或 SCALE、常量，再有 q 行编号和读数。",output:"逐查询输出转换后的整数。未登记编号输出 NA。",limits:"0 ≤ n,q ≤ 400，登记编号唯一，1–10 位英数字，常量和读数在 -1000–1000。"},[`3 4
Z ADD 2
A SCALE -1
M ADD 9
Z 4
A 4
M 4
X 4
`,`6
-4
13
NA
`,"Z 的 +2 和 M 的 +9 是独立规则。"],[[`0 1
A 1
`,`NA
`],[`2 2
A SCALE 0
B ADD -2
A -4
B -4
`,`0
-6
`],[`1 3
X ADD 3
X 0
Y 0
X 1
`,`3
NA
4
`]],["登记时调用工厂并传入当行的常量。","用字典保存函数，查询时再执行。"],`def make_rule(kind, offset):
    if kind == "ADD":
        return lambda value: value + offset
    return lambda value: value * offset

n, q = map(int, input().split())
rules = {}
for _ in range(n):
    code, kind, offset = input().split()
    rules[code] = make_rule(kind, int(offset))
for _ in range(q):
    code, raw = input().split()
    rule = rules.get(code)
    print(rule(int(raw)) if rule is not None else "NA")
`,{concepts:["工厂函数","延后绑定","按键调用"],approach:"每条规则关住自己创建时的常量绑定，计算统一延迟到查询。",steps:["逐行读取规则和配置。","以工厂创建函数，存入字典。","查到函数后用实际读数调用。"],time:"平均 O(n+q)。",space:"O(n)。",pitfall:"在一层循环内都捕获外部 offset，会在延后运行时读到最后一次绑定。",extension:"让同一设备可以重新登记，验证其他设备的回调仍可用。"}),t(52,i[3],"进阶","站点限额独立维护",{background:"多个站点各有可用额度，被拒绝的请求应保持原余额。重新开放会重设该站限额。",description:"OPEN 保存新额度，可覆盖同一站。USE 未开放时输出 UNKNOWN，已开放时若额度足够则扣减并输出 OK 与余额，否则输出 NO 与原余额。",input:"首行 q，随后 q 行各为 OPEN 或 USE、站点编号、非负整数。",output:"只对 USE 输出一行：UNKNOWN、OK 余额或 NO 余额。",limits:"0 ≤ q ≤ 600，编号为 1–10 位英数字，数值 0–1000。请求 0 在已开放站点成功。"},[`7
USE A 1
OPEN A 4
OPEN B 2
USE A 5
USE B 2
OPEN A 1
USE A 1
`,`UNKNOWN
NO 4
OK 0
OK 0
`,"拒绝请求保留原额度；重设 A 后扣减到零。"],[[`0
`,""],[`4
OPEN A 0
USE A 0
USE A 1
USE B 0
`,`OK 0
NO 0
UNKNOWN
`],[`5
OPEN X 5
OPEN Y 5
USE X 8
USE X 5
USE Y 4
`,`NO 5
OK 0
OK 1
`]],["每个站点存一个拥有独立余额的闭包。","用 OPEN 替换当前闭包，拒绝时不要重绑余额。"],`def make_station(remaining):
    def reserve(amount):
        nonlocal remaining
        if amount > remaining:
            return "NO", remaining
        remaining -= amount
        return "OK", remaining
    return reserve

stations = {}
for _ in range(int(input())):
    action, site, amount = input().split()
    if action == "OPEN":
        stations[site] = make_station(int(amount))
    elif site not in stations:
        print("UNKNOWN")
    else:
        print(*stations[site](int(amount)))
`,{concepts:["nonlocal","状态归属","失败路径"],approach:"把唯一可修改的额度藏在站点函数中，统一判断是否允许扣除。",steps:["每次开放创建新状态。","查询已开放站点。","让相应闭包返回结果与余额。"],time:"平均 O(q)。",space:"O(s)，s 为站点数。",pitfall:"先扣减再检查会污染拒绝后的余额。",extension:"让每个站点同时提供归还和查看方法，说明哪些回调共享余额。"})],Ne=[t(53,i[4],"入门","带记录的乘价函数",{background:"复核台希望保留费用计算的函数名和调用记录。",description:"给 price 函数加一层包装。每次调用先输出 CALL price，再由外层输出数量乘单价。",input:"首行 q。随后 q 行，每行给数量和单价。",output:"每单两行，先 CALL price，后整数结果。",limits:"0 ≤ q ≤ 100，数量和单价在 0–1000。q 为 0 时无输出。"},[`2
3 5
0 7
`,`CALL price
15
CALL price
0
`,"零数量仍是一次调用。"],[[`0
`,""],[`1
1000 1000
`,`CALL price
1000000
`],[`2
1 0
1 0
`,`CALL price
0
CALL price
0
`]],["包装器读取原函数名，并转发所有实参。","让包装器返回原函数结果，打印金额交给入口。"],`from functools import wraps

def trace(func):
    @wraps(func)
    def wrapped(*args, **kwargs):
        print("CALL", func.__name__)
        return func(*args, **kwargs)
    return wrapped

@trace
def price(count, *, rate):
    return count * rate

for _ in range(int(input())):
    count, rate = map(int, input().split())
    print(price(count, rate=rate))
`,{concepts:["装饰器","转发","wraps"],approach:"包装器横跨调用记录，函数本身维持金额计算的单独职责。",steps:["把原函数交给 trace。","每次打印原名并转发位置和关键字。","把返回金额传回调用者。"],time:"O(q)。",space:"O(1)。",pitfall:"包装器漏写 return 时会输出 None。",extension:"把 trace 用在两个形参列表不同的计算函数上。"}),t(54,i[4],"入门","按柜台格式生成货签",{background:"同一规则可分别给甲乙两柜生成货签，柜台的固定前缀不同。",description:"A 或 B 柜使用各自前缀，基础格式为「货号-件数」。最终返回「前缀:货号-件数」。",input:"首行两个前缀，次行 q，后 q 行为 A 或 B、货号和件数。",output:"逐条输出完整货签。",limits:"0 ≤ q ≤ 300，前缀与货号为 1–10 位英数字，件数为 0–1000。两个前缀可相同。"},[`E W
3
A K 2
B K 2
A Y 0
`,`E:K-2
W:K-2
E:Y-0
`,"同一货号在两柜用不同包装配置。"],[[`X X
0
`,""],[`X X
1
B J 0
`,`X:J-0
`],[`N S
2
B Z 3
A Z 3
`,`S:Z-3
N:Z-3
`]],["外层接收前缀，中层接收基础函数，内层接收货签参数。","用参数化装饰器分别包同一个函数。"],`def with_prefix(prefix):
    def decorate(func):
        def wrapped(*args, **kwargs):
            return prefix + ":" + func(*args, **kwargs)
        return wrapped
    return decorate

def basic(code, *, count):
    return f"{code}-{count}"

left, right = input().split()
labels = {"A": with_prefix(left)(basic), "B": with_prefix(right)(basic)}
for _ in range(int(input())):
    desk, code, count = input().split()
    print(labels[desk](code, count=int(count)))
`,{concepts:["参数化装饰器","闭包配置","复用原函数"],approach:"用两份配置得到两层独立包装，最后统一按键调用。",steps:["读取两个前缀。","为基础格式函数构造两份带前缀的包装。","转发货号和关键字件数。"],time:"O(q)。",space:"O(1)。",pitfall:"不同前缀不能写入同一个共享变量后再由两个包装读取。",extension:"同时支持后缀和分隔符，使包装函数的配置可组合。"}),t(55,i[4],"基础","失败也要记录退出",{background:"批量分组会遇到分母为零。每次都必须写入开始、退出两个标记。",description:"每次请求打印 BEGIN，执行整数整除，退出时打印 END。若人数为零，随后输出 INVALID，否则输出分组结果。",input:"首行 q。随后 q 行为总人数与每组人数。",output:"每次三行：BEGIN、END、INVALID 或整除得到的整数。",limits:"0 ≤ q ≤ 100，两种人数均为 0–1000。错误只能发生在每组人数为 0。"},[`2
9 2
6 0
`,`BEGIN
END
4
BEGIN
END
INVALID
`,"整除舍去余数；失败也执行退出。"],[[`0
`,""],[`1
0 4
`,`BEGIN
END
0
`],[`2
0 0
4 4
`,`BEGIN
END
INVALID
BEGIN
END
1
`]],["包装器用 try 返回原计算，finally 负责 END。","由接收者捕获 ZeroDivisionError。"],`def record(func):
    def wrapped(*args, **kwargs):
        print("BEGIN")
        try:
            return func(*args, **kwargs)
        finally:
            print("END")
    return wrapped

@record
def groups(total, *, size):
    return total // size

for _ in range(int(input())):
    total, size = map(int, input().split())
    try:
        print(groups(total, size=size))
    except ZeroDivisionError:
        print("INVALID")
`,{concepts:["finally","异常传播","包装协议"],approach:"退出记录独立于调用成功，原计算结果或异常都继续交给入口。",steps:["包装层先记录进入。","finally 维护离开事件。","主循环捕获零分母错误并开始处理下一条。"],time:"O(q)。",space:"O(1)。",pitfall:"将 END 只写在计算之后会漏掉异常。",extension:"同时显示成功和失败次数，使用共享但显式控制的审计状态。"}),t(56,i[4],"进阶","两种审计范围",{background:"计价入口可记录所有请求，也可只记录通过容量校验的请求。",description:"数量大于容量时输出 BLOCK；否则输出数量乘单价。模式 ALL 下每条都先打印 TRY 数量。模式 VALID 下只有通过校验的请求才打印 TRY 数量。",input:"第一行「模式 capacity q」，再有 q 行「数量 单价」。",output:"每次输出结果，按模式决定是否先输出 TRY 行。",limits:"模式为 ALL 或 VALID，0 ≤ q ≤ 200，其余整数为 0–1000。等于容量时通过。"},[`ALL 3 3
4 2
3 0
1 5
`,`TRY 4
BLOCK
TRY 3
0
TRY 1
5
`,"拦截项仍记日志，合法的零金额会输出 0。"],[[`VALID 3 2
4 2
3 2
`,`BLOCK
TRY 3
6
`],[`ALL 5 0
`,""],[`VALID 0 3
1 7
0 7
0 0
`,`BLOCK
TRY 0
0
TRY 0
0
`]],["分别定义审计与限制两层包装。","ALL 将审计放在最外面，VALID 让校验在前。"],`def audit(func):
    def wrapped(amount, *args, **kwargs):
        print("TRY", amount)
        return func(amount, *args, **kwargs)
    return wrapped

def guard(capacity):
    def decorate(func):
        def wrapped(amount, *args, **kwargs):
            if amount > capacity:
                return "BLOCK"
            return func(amount, *args, **kwargs)
        return wrapped
    return decorate

def price(amount, *, rate):
    return amount * rate

mode, capacity, count = input().split()
limit = guard(int(capacity))
process = audit(limit(price)) if mode == "ALL" else limit(audit(price))
for _ in range(int(count)):
    amount, rate = map(int, input().split())
    print(process(amount, rate=rate))
`,{concepts:["叠加顺序","提前返回","关键字转发"],approach:"清楚区分两层谁先接到调用，依据审计范围选择组合。",steps:["生成携带容量的校验装饰器。","按模式组合记录与校验层。","以数量与费率调用，打印返回结果。"],time:"O(q)。",space:"O(1)。",pitfall:"两种模式只改变审计范围，容量判断规则相同。",extension:"加入失败异常路径，比较记录进入与记录退出的顺序。"}),t(57,i[5],"入门","不同展品的排列数",{background:"一组各不相同的展品需要计算所有可能的摆放次序。",description:"对每个给定的 n，输出 n 件互不相同物品的排列数。空展台有一种摆法。",input:"一行若干空格分隔的 n，可为空。",output:"每个 n 输出一行十进制排列数。",limits:"最多 50 次查询，0 ≤ n ≤ 30。使用精确整数。"},[`0 4 1
`,`1
24
1
`,"空展台和单展品都只有一份摆法。"],[[`
`,""],[`2 3
`,`2
6
`],[`20 5 20
`,`2432902008176640000
120
2432902008176640000
`]],["先决定第一件摆什么。","固定第一件后，剩余问题只含 n-1 件。"],`def arrangements(n):
    if n == 0:
        return 1
    return n * arrangements(n - 1)

for n in map(int, input().split()):
    print(arrangements(n))
`,{concepts:["阶乘","子问题缩小","空乘积"],approach:"第一件有 n 种选择，每种选择都对应剩余 n-1 项的排列。",steps:["把空序列的摆法设为 1。","递归求剩余项目的摆法。","乘以本层的选择数，返回给上一层。"],time:"每次 O(n) 次整数乘法。",space:"O(n) 栈帧。",pitfall:"把 0 的结果设成 0 会让所有乘积归零。",extension:"将递归改成循环并对照多次重复查询。"}),t(58,i[5],"入门","交替权重的数位校验",{background:"货号整数需要根据数位生成一位校验码。",description:"取整数绝对值，从最低位开始交替使用权重 1、3。求加权和，再输出使其凑到 10 的倍数所需的最小非负补数。",input:"一行空格分隔的整数，可为空。",output:"每个整数输出一行 0–9 的校验码。",limits:"最多 80 项，绝对值小于 10^15，整数 0 的校验码也为 0。"},[`205 -120 99
`,`3
3
4
`,"205 从低到高的加权和为 5+0+2=7。"],[[`
`,""],[`0 1 -1
`,`0
9
9
`],[`7 13 10 1001
`,`3
4
7
6
`]],["每次取末位，子问题去掉末位。","权重在 1、3 两种状态间互换。"],`def weight_sum(n, weight=1):
    if n < 10:
        return n * weight
    return n % 10 * weight + weight_sum(n // 10, 4 - weight)

for number in map(int, input().split()):
    print(-weight_sum(abs(number)) % 10)
`,{concepts:["数位递归","传递权重","取余"],approach:"让递归状态包含下一位使用的权重。处理完一位就缩掉一个十进制数位。",steps:["先对每项取绝对值。","将当前位与剩余位贡献相加。","用模运算求 0–9 中应补的数。"],time:"O(d)，d 为总数位数。",space:"O(m) 栈帧，m 为单项最大位数。",pitfall:"10 - total % 10 在整十时会返回 10。",extension:"让权重按长度为三的周期切换。"}),t(59,i[5],"基础","额度内的连续领用",{background:"处理队列时不允许跳过前面的领用单。第一笔超出剩余额度就停止。",description:"从第一项起按次序扣减。若下一项大于余额，立即停止，输出实际处理单数和最终余额。",input:"第一行非负初始额度，第二行是领用整数序列，可为空。",output:"输出两个整数「处理单数 最终余额」。",limits:"最多 150 项，额度和每项领用均为 0–1000。当前余额为零时仍可处理零额记录。"},[`5
2 3 0 2 0
`,`3 0
`,"处理前 3 项；第四项阻塞，不能继续跳过。"],[[`7

`,`0 7
`],[`3
4 0 1
`,`0 3
`],[`0
0 0 1
`,`2 0
`]],["用位置与当前余额表示子问题。","终止可以来自读完，也可以来自当前项超额。"],`def finish(costs, index, remaining):
    if index == len(costs) or costs[index] > remaining:
        return index, remaining
    return finish(costs, index + 1, remaining - costs[index])

quota = int(input())
costs = list(map(int, input().split()))
print(*finish(costs, 0, quota))
`,{concepts:["递归状态","双终止条件","边界短路"],approach:"索引等于已经处理的单数，余额随子调用传递。",steps:["检查表尾或第一笔无法处理的单。","合法则扣减，并移动一个位置。","外层交回最深层得到的结果。"],time:"读入 O(n)，递归最多 O(n) 次。",space:"O(n) 数据与栈。",pitfall:"余额为零不等于无法再处理，后面可能有零额单。",extension:"将递归改成循环，验证大批输入与活动状态。"}),t(60,i[5],"进阶","降层补给轨迹",{background:"补给员从 n 层出发，每次下移固定步长，折返时合计经过的正层号。",description:"每次调用先输出 IN 及当前层。层号 ≤ 0 时直接返回 0。其他层递归到层号减步长后，与子结果相加。每层返回前输出 OUT 层号 本层结果。",input:"一行两个整数 n step。",output:"按实际调用顺序写出全部 IN 和 OUT 记录，最后输出 TOTAL 和最外层结果。",limits:"0 ≤ n ≤ 100，1 ≤ step ≤ 100。若越过 0，仍记录第一次到达的非正层号。"},[`5 3
`,`IN 5
IN 2
IN -1
OUT -1 0
OUT 2 2
OUT 5 7
TOTAL 7
`,"下探到 -1 后从最内层依次输出。"],[[`0 1
`,`IN 0
OUT 0 0
TOTAL 0
`],[`3 3
`,`IN 3
IN 0
OUT 0 0
OUT 3 3
TOTAL 3
`],[`2 1
`,`IN 2
IN 1
IN 0
OUT 0 0
OUT 1 1
OUT 2 3
TOTAL 3
`]],["进入时记录当前层，先判断是否继续拆分。","恢复执行时输出当前层的结果。"],`def visit(level, step):
    print("IN", level)
    if level <= 0:
        value = 0
    else:
        value = level + visit(level - step, step)
    print("OUT", level, value)
    return value

n, step = map(int, input().split())
print("TOTAL", visit(n, step))
`,{concepts:["调用轨迹","终止阈值","回退合成"],approach:"把观察点放在递归前后，从输出中看出每个栈帧等待的值。",steps:["每进入一层先记录。","终止层返回 0，其他层等待子结果。","在该层真正返回前写出合成值。"],time:"O(1+ceil(n/step))。",space:"O(1+ceil(n/step)) 栈帧。",pitfall:"只允许层号等于 0 才停，步长跨过 0 时会错过终止点。",extension:"用显式栈复现一样的进入与离开轨迹。"})],we=[t(61,i[6],"入门","查找最早登记位置",{background:"仓库编号按非降序排列，重复编号表示同号的多个登记项。",description:"对每个编号，找第一个不小于它的位置。若该位置的编号与查询相等，输出 FOUND；否则给出可插入位置。",input:"首行 n q，第二行为 n 个按非降序排列的整数，第三行为 q 个查询整数。两行列表可为空。",output:"逐查询输出 FOUND 下标或 INSERT 下标。下标从 0 开始，允许插在 n。",limits:"0 ≤ n,q ≤ 1000，整数 -10000–10000。排序输入可能有重复。"},[`5 4
1 3 3 4 9
3 0 8 10
`,`FOUND 1
INSERT 0
INSERT 4
INSERT 5
`,"遇到重复的 3，返回第一次出现。"],[[`0 2

0 -2
`,`INSERT 0
INSERT 0
`],[`4 3
-3 -3 -3 0
-3 -2 0
`,`FOUND 0
INSERT 3
FOUND 3
`],[`1 3
7
6 7 8
`,`INSERT 0
FOUND 0
INSERT 1
`],[`1 0
5

`,""]],["递归参数用半开区间。","相等时继续查左侧，得到左边界后再判断是否命中。"],`def first_at_least(values, target, left, right):
    if left == right:
        return left
    mid = (left + right) // 2
    if values[mid] < target:
        return first_at_least(values, target, mid + 1, right)
    return first_at_least(values, target, left, mid)

n, q = map(int, input().split())
values = list(map(int, input().split()))
for target in map(int, input().split()):
    index = first_at_least(values, target, 0, n)
    found = index < n and values[index] == target
    print("FOUND" if found else "INSERT", index)
`,{concepts:["递归二分","重复值左边界","半开区间"],approach:"先求下界，命中与插入共用同一个位置。",steps:["从 [0,n) 开始。","用中点比较排除至少一个候选，直至两端相遇。","核对候选可索引并且等于目标。"],time:"O(n+q log(n+2))，含读入。",space:"O(n+q) 输入及最多 O(log(n+2)) 栈帧。",pitfall:"相等立即返回可能得到后面一个重复项。",extension:"再写第一个大于目标的位置，报告重复编号出现次数。"},{kind:"adapted",platform:"LeetCode",title:"Binary Search",id:"704",level:"Easy",url:"https://leetcode.com/problems/binary-search/",concepts:["区间二分","目标定位"],adaptation:"保留有序查找的对半收缩思想，加入重复编号左边界、空表、批量查询和未命中插入位置。"}),t(62,i[6],"入门","多次查询同一增长序列",{background:"看板反复询问按前两项之和增长的序列，查询顺序可能来回跳转。",description:"定义 F(0)=0，F(1)=1，其余项为前两项之和。按查询顺序返回精确结果。",input:"一行空格分隔的索引，可为空。",output:"每个索引一行十进制整数，重复查询重复输出。",limits:"最多 100 个查询，0 ≤ n ≤ 120。"},[`8 2 8 0
`,`21
1
21
0
`,"两次查询 8 应得到同样结果，中间查询不会改变结果。"],[[`
`,""],[`1 0 1 2
`,`1
0
1
1
`],[`60 75 60 100
`,`1548008755920
2111485077978050
1548008755920
354224848179261915075
`]],["保留两个不同的终止值。","整个程序共用同一个带缓存的函数。"],`from functools import cache

@cache
def value(n):
    if n < 2:
        return n
    return value(n - 1) + value(n - 2)

for index in map(int, input().split()):
    print(value(index))
`,{concepts:["记忆化","重复查询","递归状态"],approach:"跨查询复用按索引缓存的值，最大索引支配首次填表成本。",steps:["为 0 和 1 设置返回。","递归求前两项，缓存以索引为键。","按原查询顺序输出。"],time:"O(m+q) 次查找或加法，m 为最大索引。大整数加法与输出的位数代价另计。",space:"O(m) 条缓存及栈帧和 O(q) 输入，大整数占用另计。",pitfall:"在查询循环内每次重新定义缓存函数，会失去跨次复用。",extension:"写一个先建表的迭代版本，比较首次大索引的栈使用。"},{kind:"adapted",platform:"LeetCode",title:"Fibonacci Number",id:"509",level:"Easy",url:"https://leetcode.com/problems/fibonacci-number/",concepts:["斐波那契","重复子问题"],adaptation:"保留递推式，扩展为任意顺序和重复查询，加入较大索引以验证重复计算不会阻塞处理。"}),t(63,i[6],"基础","跳过停用库区",{background:"库区可以临时停用。体量盘点只汇总仍可使用的文件。",description:"节点是文件字节数，或目录数组 [启用标记, 子节点列表]。遇到停用目录，整棵子树贡献 0。否则累计当前可用文件字节数和份数。",input:"一行 JSON，表示根节点。整数表示文件，目录启用标记为 0 或 1。",output:"输出两个整数「总字节数 文件数」。",limits:"1–300 个节点，深度至多 30，文件字节数 0–10000。启用的空目录没有文件，0 字节文件算一份。"},[`[1,[3,[0,[10,20]],[1,[0,2]],[1,[]]]]
`,`5 3
`,"停用目录的 10、20 跳过，零字节文件仍计数。"],[[`0
`,`0 1
`],[`[0,[9,[1,[0]]]]
`,`0 0
`],[`[1,[[0,[9]],[1,[]]]]
`,`0 0
`],[`[1,[2,[1,[5,[1,[3]]]]]]
`,`10 3
`]],["把节点分为文件、停用目录和启用目录。","每个递归调用返回形状相同的两个数字。"],`import json

def totals(node):
    if isinstance(node, int):
        return node, 1
    enabled, children = node
    size = count = 0
    if enabled:
        for child in children:
            child_size, child_count = totals(child)
            size += child_size
            count += child_count
    return size, count

print(*totals(json.loads(input())))
`,{concepts:["树遍历","剪枝","元组归约"],approach:"根据节点类型选终止返回或合并子树，停用时无需进入后代。",steps:["解析 JSON 并判节点类型。","文件直接贡献字节与一份。","启用目录递归合并，停用目录保持零汇总。"],time:"解析 O(s)，递归 O(v)，s 为输入长度，v 为实际访问节点数。",space:"O(s) 解析数据，递归 O(h) 帧。",pitfall:"用 if not node 处理文件会漏算零字节文件。",extension:"同时输出被剪掉的目录编号和它的上一层编号，核对遍历轨迹。"}),t(64,i[6],"进阶","分层目录配额报告",{background:"档案馆每天对嵌套目录生成容量报告。管理员要先看父目录，再按原录入次序看达到阈值的子目录。",description:"读取目录树，统计根目录下全部文件字节数和份数。对每个累计字节数不低于门槛的目录，报告路径、字节数和文件数。行序为先序，即目录在其子目录之前，兄弟按输入顺序。",input:"第一行非负门槛。第二行一棵 JSON 目录树。每个节点是 [名称, 内容]，文件的内容是非负整数，目录的内容是子节点列表，根保证为目录。",output:"首行 TOTAL 字节数 文件数。每个达标目录另占一行「路径 字节数 文件数」。根路径是根名，其余用斜杠连接祖先与自身名称。文件不另列。",limits:"最多 160 个节点，深度至多 24。名称为 1–8 位英数字，同一目录内唯一。门槛和文件大小为 0–100000。"},[`5
["root",[["A",[["x",2],["y",3]]],["B",[["z",0]]],["notes",4]]]
`,`TOTAL 9 4
root 9 4
root/A 5 2
`,"A 刚达到阈值，B 的零字节文件只参与总份数。"],[[`0
["R",[]]
`,`TOTAL 0 0
R 0 0
`],[`1
["R",[["z",0],["A",[]]]]
`,`TOTAL 0 1
`],[`2
["X",[["A",[["B",[["x",2]]]]],["B",[["x",3]]]]]
`,`TOTAL 5 2
X 5 2
X/A 2 1
X/A/B 2 1
X/B 3 1
`],[`9
["X",[["a",8]]]
`,`TOTAL 8 1
`],[`0
["R",[["A",[["x",0]]],["B",[]]]]
`,`TOTAL 0 1
R 0 1
R/A 0 1
R/B 0 0
`]],["知道总量需要等所有子调用返回，知道行序可以在进入时确定。","进入目录先占一个位置，离开时回填。"],`import json

def scan(node, parent, *, report):
    name, data = node
    if isinstance(data, int):
        return data, 1

    path = f"{parent}/{name}" if parent else name
    index = len(report)
    report.append(None)
    total = count = 0
    for child in data:
        size, files = scan(child, path, report=report)
        total += size
        count += files
    report[index] = path, total, count
    return total, count

limit = int(input())
root = json.loads(input())
rows = []
print("TOTAL", *scan(root, "", report=rows))
for path, size, count in rows:
    if size >= limit:
        print(path, size, count)
`,{concepts:["递归接口","先序与后序","元组返回","阈值过滤"],approach:"递归同时保留两个时点。进入时确定排序位置，返回前取得汇总。所有行都填好后再按门槛发布。",steps:["文件直接返回大小和一份计数。","目录构造路径并为自己预留一行。","依次汇总子树，回填目录行。","输出根汇总并按先序筛选目录行。"],time:"O(s+n+L)，s 为 JSON 长度，n 为节点数，L 为构造及输出所有目录路径的总字符数。",space:"O(s+n+L)，另用 O(h) 帧，h 为树高。",pitfall:"只在递归返回途中追加报表，会把子目录排在父目录前。",extension:"增加模式参数，允许调用者选择先序或后序，并设计一棵能区分两种顺序的测试树。"})],ve={introduction:"库房有两个箱子，各自记录容量与已装件数。过程式程序可以把两份字典和函数配合起来；当操作越来越多，用类可以把每个箱子的数据与装箱规则集中在一起。",prerequisites:"字典、函数、形参绑定和对象引用。",version:"Python 3.12。",goals:["从需求分清对象的身份、属性和行为。","写出 class、__init__ 和实例方法，说明 self 在调用时如何获得。","用两个实例和一个别名测试各自的状态。"],topics:[{title:"从一份记录到带行为的实例",explanation:["属性是通过对象名称与点号读写的数据，例如 box.used。行为是对象提供的操作，例如 box.put(2)。类定义共同的行为和每份实例如何初始化；调用类会创建实例，并通常由 __init__ 初始化新实例的属性。__init__ 不能返回一个自定义对象，通常省略 return。","同一类的多个实例通过相同的方法逻辑处理各自的数据。设计类时先问状态属于谁、哪些操作允许改变它，再确定属性和方法。仅有一次处理的简单记录仍可用函数与字典，类适合需要反复维护状态、明确接口的情境。"],examples:[e("box-function-to-class","从库房过程式记录迁移到类","起步",`def put(record, count):
    if record["used"] + count <= record["capacity"]:
        record["used"] += count

class Box:
    def __init__(self, capacity):
        self.capacity = capacity
        self.used = 0

    def put(self, count):
        if self.used + count <= self.capacity:
            self.used += count

old = {"capacity": 3, "used": 0}
box = Box(3)
put(old, 2)
box.put(2)
box.put(2)
print(old["used"], box.used)
`,`2 2
`,"比较同一条容量规则在两种组织方式中的位置。",["两种程序都把容量与已装件数放在同一份状态里。","旧函数显式接收字典，实例方法收到 box 后读取其属性。","第二次调用因超容量保留原值。"],"把 used 当作方法局部变量会让下一次调用无法找到先前状态。"),e("box-bound-self","验证实例方法的 self 来自哪一份箱子","起步",`class Counter:
    def __init__(self, initial):
        self.value = initial

    def add(self, amount):
        self.value += amount
        return self.value

east = Counter(4)
west = Counter(10)
operation = east.add
print(operation(2))
print(Counter.add(west, 1))
print(east.value, west.value)
`,`6
11
6 11
`,"把绑定方法与显式传入实例放在同一例子。",["读取 east.add 得到已绑定 east 的方法。","从类取得 Counter.add 时可显式提供 west 作为首个实参。","两个调用分别修改自己的实例属性。"],"方法定义遗漏 self 时，自动提供的首个实参通常会让参数个数不匹配。")]},{title:"对象身份、别名与可以检查的行为",explanation:["Counter(4) 执行两次，得到两个对象。b=a 只是多了一个名字，通过任意别名修改对象都会反映到另一名称。is 比较身份，打印同样的属性不能证明是同一个对象。","方法可以返回成功或失败，让命令行入口决定怎样展示。失败路径要先验证再写状态。连续操作后读出状态，比只看成功提示更容易发现错误。"],examples:[e("box-shared-alias","箱子的别名与独立实例","应用",`class Box:
    def __init__(self):
        self.labels = []

    def add(self, label):
        self.labels.append(label)

first = Box()
alias = first
other = Box()
alias.add("A")
print(first is alias, first is other)
print(first.labels, other.labels)
`,`True False
['A'] []
`,"用实际变更核对构造和赋值的区别。",["每次 Box() 在初始化时创建一张新列表。","alias 绑定到 first 对象。","修改经由 alias 写入 first，other 的列表为空。"],"将 labels=[] 放在类体中会使实例默认共享列表。"),e("box-atomic","拒绝超额扣减后继续使用余额","应用",`class Pass:
    def __init__(self, remaining):
        self.remaining = remaining

    def use(self, seats):
        if seats > self.remaining:
            return False
        self.remaining -= seats
        return True

ticket = Pass(3)
print(ticket.use(4), ticket.remaining)
print(ticket.use(3), ticket.remaining)
`,`False 3
True 0
`,"先检查限额，再更新可观察状态。",["第一次请求失败，提前返回。","第二次恰好等于余额，可以扣减。","外部同时检查返回值与余额。"],"先减再检查会让失败路径留下负余额。")]}],comparisons:{headings:["表达","谁持有状态","含义"],rows:[["put(record, 2)","传入记录","公共函数操作显式参数"],["box.put(2)","box 实例","方法绑定了接收者"],["b = a / b = Box()","同一对象 / 新对象","别名与独立初始化分别处理"]]},applications:["为多个并行柜台、循环计数器或订单状态选出适合封装的对象。","测试一个错误操作后再提交合法操作，核对失败是否改变状态。"],mistakes:[{symptom:"属性只在初始化里能读到",reason:"写成了局部名 used=0。",fix:"用 self.used=0 将值存入实例。",check:"构造后从外部读它，再运行方法。"},{symptom:"两个箱子同时变了",reason:"两个变量引用同一实例或共享的可变数据。",fix:"分别调用类，并在 __init__ 分别创建实例属性。",check:"改变一个实例，核对另一个。"}],summary:["类定义共同的初始化和行为，实例有各自的状态。","读取实例方法时产生绑定，首参 self 指向实际接收者。","公开操作应明确失败是否改状态，并用多实例验证。"],next:"下一课辨认类属性与实例属性，给同一种记录选择三种方法。",exercises:[s("object-init","检查实例状态的归属","怎样让每个实例拥有自己的空 tags 列表？",1,[["class 内直接写 tags=[]","多个实例的读取会落到同一个类列表。"],["在 __init__ 中写 self.tags=[]","每次初始化都创建并绑定新列表。"],["在方法体写 tags=[]","该局部列表不会自动存进实例。"]]),s("object-self","解释绑定方法接收的首个实参","已定义 Box.add(self, n)，b.add(2) 的 self 是谁？",2,[["Box 类","普通实例方法接收实例。"],["整数 2","2 填到第二个形参 n。"],["实例 b","读取 b.add 时已把方法与 b 绑定。"]]),s("object-alias","预测别名改变的可见性","代码输出什么？",0,[["4 1","a 与 b 指向同一对象，c 自己初始化。"],["1 1","通过 b 写入和通过 a 读取作用在同一对象。"],["4 4","两次构造返回不同实例。"]],`class Box:
    def __init__(self):
        self.used = 1
a = Box()
b = a
c = Box()
b.used = 4
print(a.used, c.used)`,`4 1
`),s("object-failure","选出不会污染状态的拒绝路径","领用数量大于余额时，方法应先做什么？",1,[["先扣减且直接返回 False","失败会留下扣减后的余额。"],["在改动前验证足够，再决定是否扣减","失败可以保持原余额。"],["将余额写为零","这会抹掉尚可使用的原余额。"]]),n("A065","基础编程","维护一台设备的独立剩余额度。"),n("A066","独立编程","扩展到两个对象并验证零值与失败。"),n("A067","综合应用","跨多个对象执行有状态命令。"),n("A068","拓展挑战","维护导航光标和删去的未来历史。")],references:[r("类与实例","tutorial/classes.html#a-first-look-at-classes","核对实例化、属性和方法。"),r("实例方法绑定","reference/datamodel.html#instance-methods","核对绑定方法与首参。")]},Te={introduction:"每台仪表有自己的读数，但同一型号可共享报警阈值。阈值何时共享、哪种方法应该接收实例或类，决定了配置更新会影响哪一台。",prerequisites:"类、实例、函数签名与装饰器。",version:"Python 3.12。本课的查找示例使用普通类属性；下一课介绍 property 的优先处理。",goals:["手推一个实例赋值与一次类赋值对多个实例的影响。","选择普通方法、类方法和静态方法并解释隐式参数。","用类方法从备用格式构造实例，并隔离每台设备的可变数据。"],topics:[{title:"普通类属性、实例遮蔽与共享列表",explanation:["类体执行时建立类属性。读取普通的 x.rate，若 x 自己有 rate，先取得实例值；否则按 x 所属类及其基类查找。写 x.rate=3 通常是写实例属性，它遮蔽同名的普通类属性。给 Device.rate 赋新值则修改类，尚未遮蔽的实例能读到新配置。","x.tags.append(...) 会先查找到列表，再改变列表内容。如果读到的是类属性里的列表，多个实例能看到同一变化。每个实例要保有独立记录时，在 __init__ 中给 self.tags 创建新列表。"],examples:[e("attributes-shadow","验证类更新与实例遮蔽","起步",`class Meter:
    threshold = 10

left = Meter()
right = Meter()
left.threshold = 7
Meter.threshold = 12
print(left.threshold, right.threshold)
del left.threshold
print(left.threshold, Meter.threshold)
`,`7 12
12 12
`,"观察已有实例怎样读取变化的公共配置。",["两个对象最初都从类取得阈值。","left 的实例赋值遮蔽该名称。","删掉实例项后，读取又落回类。"],"更新类属性不会清除某个实例自己保存的同名属性。"),e("attributes-shared-list","用两台设备复现共享历史","应用",`class Shared:
    history = []

class Separate:
    def __init__(self):
        self.history = []

a, b = Shared(), Shared()
a.history.append(5)
x, y = Separate(), Separate()
x.history.append(8)
print(a.history, b.history)
print(x.history, y.history)
`,`[5] [5]
[8] []
`,"对比在类体和初始化中创建可变对象。",["Shared 的两个实例最初都读同一个类列表。","append 不会创建实例属性。","Separate 分别创建两个列表。"],"把类型注解加给可变类属性，不会改变它被共享的事实。")]},{title:"三种方法接收谁",explanation:["实例方法接收实际对象 self，用来读写单个设备的状态。@classmethod 接收调用时的类 cls，即使用实例访问也绑定到其类。用 cls(...) 构造对象可以自然适配以后增加的子类，例如例子中的加急票。子类定义与继承查找会在继承课详细解释。","@staticmethod 不自动接收 self 或 cls。它适合与类职责相关、只依赖显式参数的计算，例如核验编码。若工具与任何类都没有清晰归属，可直接定义模块函数。"],examples:[e("attributes-three-methods","编码自检、工厂构造与单台读数","应用",`class Meter:
    threshold = 10

    def __init__(self, code, value):
        self.code = code
        self.value = value

    @staticmethod
    def valid(code):
        return code.isascii() and code.isalnum()

    @classmethod
    def from_line(cls, text):
        code, value = text.split(":")
        if not cls.valid(code):
            raise ValueError("编码无效")
        return cls(code, int(value))

    def alarm(self):
        return self.value >= self.threshold

meter = Meter.from_line("N2:10")
print(meter.code, meter.alarm())
print(Meter.valid("N-2"))
`,`N2 True
False
`,"用明确的职责分配方法类型。",["from_line 接收类并在备用格式中解析字段。","valid 只需编码，既不依赖类属性也不依赖实例。","alarm 用实际实例的值与阈值计算。"],"在类方法里硬编码 Meter(...) 会失去通过 cls 构造调用类的能力。"),e("attributes-factory-class","调用子类工厂获得子类对象","应用",`class Pass:
    category = "普通"

    def __init__(self, code):
        self.code = code

    @classmethod
    def from_code(cls, raw):
        return cls(raw.upper())

class ExpressPass(Pass):
    category = "加急"

one = Pass.from_code("a")
two = ExpressPass.from_code("b")
print(one.category, one.code)
print(two.category, two.code, type(two).__name__)
`,`普通 A
加急 B ExpressPass
`,"检查工厂中 cls 随调用入口的变化。",["两类共享 from_code 的实现。","第二次解析获得的 cls 是 ExpressPass。","返回实例随后读取所属类的 category。"],"把 cls 当成实例读 code 会失败，因为 code 在 __init__ 中才写入每份对象。")]}],comparisons:{headings:["方法","隐式参数","典型职责"],rows:[["实例方法","self","读取或改变单个实例"],["classmethod","cls","依据调用类解析和构造"],["staticmethod","无","和类相关的独立校验或计算"]]},applications:["把共享阈值与单台校准区分开，覆盖后观察其余对象。","为 CSV 等输入格式提供类工厂，把验证与构造放在清晰入口。"],mistakes:[{symptom:"历史列表含其他对象的读数",reason:"可变列表是类属性。",fix:"在 __init__ 给每个实例创建列表。",check:"写入一台并读取其余设备。"},{symptom:"从子类工厂构造出基类对象",reason:"方法将类名写死。",fix:"用 cls(...) 调用真正的接收类。",check:"比较 type(result) 和调用方使用的类。"}],summary:["普通类属性提供默认值，实例同名项可以遮蔽。","分别为三种方法识别所需的隐式上下文。","工厂保留调用的类，可变记录保留在各实例。"],next:"下一课让属性写入经过显式验证，维护实例始终有效的条件。",exercises:[s("attrs-shadow","跟踪普通类属性被遮蔽后的读取","代码输出什么？",2,[["4 4","类的更新不会覆盖已有实例项。"],["2 2","第二份实例读取的是类的新值。"],["2 4","a 自己有 x，b 从类得到新值。"]],`class C:
    x = 1
a, b = C(), C()
a.x = 2
C.x = 4
print(a.x, b.x)`,`2 4
`),s("attrs-factory","辨认备用构造最合适的方法","同一解析格式调用子类时应构造子类，选什么方法？",0,[["类方法，使用 cls 构造","cls 指向实际调用类。"],["实例方法，取 self","构造备用入口时还没有实例。"],["静态方法，写死基类名","硬编码会丢失调用类。"]]),s("attrs-static","辨认静态方法的实际参数",'调用工具对象 t.valid("A")，若 valid 是静态方法，首个实参是什么？',1,[["t","静态方法不会自动绑定实例。"],['字符串 "A"',"只接收调用中提供的显式参数。"],["t 的类","类方法才会绑定到类。"]]),s("attrs-mutation","区分类列表修改与实例绑定","a.tags 来自类列表，使用 a.tags.append(1) 会怎样？",2,[["创建 a 的实例列表","没有给 a.tags 赋值。"],["自动复制列表","append 改变取得的列表。"],["共享同一列表的实例都能看到","初始读取落到同一个类属性。"]]),n("A069","基础编程","验证共享费率更新和实例覆盖。"),n("A070","独立编程","用类工厂与静态校验从文本创建记录。"),n("A071","综合应用","让同一备用构造适用于两种票。"),n("A072","拓展挑战","分别输出全局和实例历史统计。")],references:[r("类和实例变量","tutorial/classes.html#class-and-instance-variables","理解共享与遮蔽。"),r("classmethod","library/functions.html#classmethod","核对 cls 的绑定。"),r("staticmethod","library/functions.html#staticmethod","核对静态方法的参数。")]},Se={introduction:"库存数量不得为负，记录列表应该通过指定操作更新。封装让读写集中到可以验证的接口，并提醒调用者哪些字段属于实现细节。",prerequisites:"实例属性、方法、异常和列表复制。",version:"Python 3.12。",goals:["区分下划线访问约定与名称改写，正确解释它们能够保护什么。","用 property 的读取、写入和验证维持状态条件。","通过释放副本与先校验后更新避免外部修改或失败污染。"],topics:[{title:"公开接口与名称约定",explanation:["封装把数据和操作规则组织在一起，调用者依赖公开方法与属性。_amount 表示内部实现的约定，仍可按该名称访问。类中以至少两个下划线开头且结尾没有两个下划线的名字会改写：在 Parent 中 __amount 通常成为 _Parent__amount。这主要防止父类和子类不经意撞名。","名称改写由名字出现的类上下文决定。子类写 __amount 时得到自己的改写名称，父类方法仍操作父类字段。外部知道改写名即可访问，所以不能把它当成访问控制。Python 预定义的 __init__ 等双端下划线属于另一类约定。"],examples:[e("encapsulation-mangling","父子类的同名字段各自保留","应用",`class Parent:
    def __init__(self):
        self.__count = 3

    def original(self):
        return self.__count

class Child(Parent):
    def __init__(self):
        super().__init__()
        self.__count = 8

    def local(self):
        return self.__count

child = Child()
print(child.original(), child.local())
print(sorted(vars(child)))
`,`3 8
['_Child__count', '_Parent__count']
`,"用实际属性表观察改写，继承细节将在下一课拆解。",["Parent 初始化时写入基类自己的改写名。","Child 的同名写入使用子类前缀。","各自定义的方法能读取不同值。"],"直接在类外读 child.__count 不会自动换成父类定义内部的改写名。"),e("encapsulation-snapshot","外部修改清单快照不会篡改库存","起步",`class Shelf:
    def __init__(self):
        self._labels = []

    def add(self, label):
        self._labels.append(label)

    @property
    def labels(self):
        return tuple(self._labels)

shelf = Shelf()
shelf.add("A")
copy = shelf.labels
shelf.add("B")
print(copy, shelf.labels)
`,`('A',) ('A', 'B')
`,"为字符串清单提供只读快照。",["公开写操作统一通过 add。","读取 labels 创建元组副本。","此前拿到的快照内容不随增量改变。"],"getter 若直接返回内部列表，外部可以绕过 add 修改列表。元组中的可变元素也需要单独考虑。")]},{title:"property 把规则放进属性读写",explanation:["property 将方法暴露为属性。读取 stock.quantity 会调用 getter；赋值 stock.quantity = 4 调用用 @quantity.setter 注册的 setter。setter 先验证输入，成功后写到另一个内部属性。只定义 getter 的属性不支持普通赋值。","property 作为数据描述符参与属性查找，普通实例同名项无法像遮蔽常量一样覆盖它。把对象始终必须满足的条件称为状态约束。构造也应通过相同合法性规则。失败要在改值前报告，保证之后操作还能继续。"],examples:[e("encapsulation-checked-write","数量属性拒绝负数且保留原值","起步",`class Stock:
    def __init__(self, quantity):
        self.quantity = quantity

    @property
    def quantity(self):
        return self._quantity

    @quantity.setter
    def quantity(self, value):
        if value < 0:
            raise ValueError("数量不能为负")
        self._quantity = value

stock = Stock(3)
try:
    stock.quantity = -1
except ValueError:
    print("拒绝", stock.quantity)
stock.quantity = 0
print(stock.quantity)
`,`拒绝 3
0
`,"把统一校验用于初始化与后续写入。",["初始化通过公开属性调用 setter。","不合法输入在写入前失败。","零是合法数量并能替换旧值。"],"setter 内再次写 self.quantity 会重复触发同一个 setter。"),e("encapsulation-derived","用只读属性报告可用席位","应用",`class Room:
    def __init__(self, total):
        self._total = total
        self._used = 0

    @property
    def available(self):
        return self._total - self._used

    def reserve(self, amount):
        if not 0 <= amount <= self.available:
            return False
        self._used += amount
        return True

room = Room(4)
print(room.reserve(3), room.available)
print(room.reserve(2), room.available)
`,`True 1
False 1
`,"从源状态计算可用量，避免保存两份可能不同步的数。",["total 和 used 是数据来源。","更新只经过 reserve 的范围验证。","每次从当前两个状态求差。"],"单独保存 available 又忘记在 reserve 后刷新，容易让读到的状态过时。")]}],comparisons:{headings:["写法","作用","边界"],rows:[["_name","内部接口约定","可访问"],["__name","类上下文里的名称改写","避免常见子类撞名"],["@property / setter","控制属性读写","实现验证、计算或只读快照"]]},applications:["库存、名额等对象验证边界后再保存。","让调用者访问只读快照，并通过公开动作修改记录。"],mistakes:[{symptom:"设置一个属性却递归报错",reason:"setter 给同名公开属性再次赋值。",fix:"将验证通过的值写入不同内部字段。",check:"分别用有效值和无效值写入。"},{symptom:"父类读取不到子类写入的 __count",reason:"两个值使用不同改写名。",fix:"通过继承的公开方法修改状态。",check:"对比父子方法读取结果。"}],summary:["内部名称表达接口意图，具体校验依靠代码。","property 能把统一规则放在赋值路径上。","验证多个条件后再改状态，并按需返回副本。"],next:"下一课用继承复用已有规则，并追踪 super 的查找顺序。",exercises:[s("encapsulation-private","说明双下划线实际起的作用","类中 __size 主要用来避免什么？",0,[["无意的父子同名冲突","通常使用定义类名称改写字段名。"],["外部所有读写","知道改写名时仍可访问。"],["对象可变性","它不会冻结属性。"]]),s("encapsulation-assign","推理 property 的读写路径","p.value=9 操作一个有 setter 的 property，通常先做什么？",1,[["写 p 的同名普通属性","property 会截获这次赋值。"],["把 9 交给 setter","写入是否成功由 setter 决定。"],["调用静态方法","setter 绑定实例。"]]),s("encapsulation-readonly","识别只读属性的失败类型","下面赋值后输出什么？",2,[["0","属性没有 setter，不能赋值。"],["7","报错分支会打印标记。"],["拒绝","普通赋值抛出 AttributeError。"]],`class Box:
    @property
    def size(self):
        return 7
x = Box()
try:
    x.size = 0
except AttributeError:
    print("拒绝")`,`拒绝
`),s("encapsulation-atomic","识别转移前应验证的状态","库存从 A 转到 B 时，什么顺序能避免部分修改？",1,[["先扣 A 再检查 B","B 失败时 A 已经改变。"],["先检查 A 与 B，成功后一起更新","失败路径可保留双方原值。"],["只确保 B 够用","A 可能余额不足。"]]),n("A073","基础编程","用可验证的属性写入保持数量范围。"),n("A074","独立编程","用只读属性发布当前可用值。"),n("A075","综合应用","输出能够独立保存的多次状态快照。"),n("A076","拓展挑战","跨库转移前完整验证两边边界。")],references:[r("类教程中的私有名称","tutorial/classes.html#private-variables","核对名称改写的用途。"),r("property","library/functions.html#property","核对读取、设置与只读属性。")]},De={introduction:"普通票和加急票都要验证编码、显示票号。加急票要再加费用标签。继承可以复用共同约定，也需要知道子类应该继承、追加还是重写哪些行为。",prerequisites:"类属性、类工厂、封装与方法调用。",version:"Python 3.12，方法解析使用 C3 线性化。",goals:["定义子类并决定是否继承构造或用 super 补充初始化。","解释同名方法重写怎样在实际对象上生效。","读取 __mro__，预测多层继承和一个协作式菱形中的执行顺序。"],topics:[{title:"继承初始化、重写与复用",explanation:["class Child(Parent) 建立子类。Child 未定义的普通方法按查找顺序从基类取得。未写 __init__ 时可沿用基类的初始化；写了新的 __init__ 时，Python 会调用选中的初始化方法，基类初始化是否也执行由代码明确决定。","同名方法重写会在针对子类实例的查找中被选中。扩展规则时可用 super().method(...) 取得继承链上后续实现。调用后可以添加自己的结果，或在共同逻辑前验证子类条件。维护公开方法的参数与返回契约，调用者才可把子类用在预期接收基类的地方。"],examples:[e("inherit-init","先建立票号，再初始化加急专用状态","起步",`class Pass:
    def __init__(self, code):
        self.code = code

    def label(self):
        return self.code

class Express(Pass):
    def __init__(self, code, surcharge):
        super().__init__(code)
        self.surcharge = surcharge

    def label(self):
        return f"{super().label()}+{self.surcharge}"

print(Pass("A").label(), Express("B", 3).label())
`,`A B+3
`,"用继承保存通用字段，再叠加子类属性和展示规则。",["Express 的初始化先通过 super 建立 code。","子类再写 surcharge。","label 复用基类返回值，并追加子类含有的数据。"],"若遗漏 super().__init__(code)，基类的 label 就读不到 code。"),e("inherit-layered","逐层增加票据前缀","应用",`class Base:
    def label(self):
        return "票"

class Timed(Base):
    def label(self):
        return super().label() + "-定时"

class Weekend(Timed):
    def label(self):
        return super().label() + "-周末"

print(Weekend().label())
`,`票-定时-周末
`,"手推多层方法的进入和返回。",["Weekend 找到 Timed 的 label。","Timed 的 super 继续找 Base。","各层从 Base 的字符串开始逐层追加。"],"在 Weekend 中直接调用 Base.label 会跳过定时层。")]},{title:"多重继承的查找顺序",explanation:["多重继承允许列出多个直接基类。Python 为每个类计算一条方法解析顺序 MRO，满足本地列出的优先关系，并使共同祖先按一致顺序出现。可用 C.__mro__ 查看它；相互冲突的顺序在定义类时会报 TypeError。","super() 从当前方法所在的类之后、沿实际实例的 MRO 继续查找。即使当前方法定义在 Left，实际实例属于 Joined 时，下一站可能是 Right。协作式多重继承要求参与同一操作的实现使用兼容的调用方式，逐层调用 super，并有清晰的终点。"],diagram:{caption:"菱形示例的查找路径",text:`Joined(Left, Right)
Left → Base
Right → Base
MRO：Joined → Left → Right → Base → object`},examples:[e("inherit-diamond","把两个附加规则接入一次计算","应用",`class Base:
    def marks(self):
        return ["base"]

class Left(Base):
    def marks(self):
        return ["left", *super().marks()]

class Right(Base):
    def marks(self):
        return ["right", *super().marks()]

class Joined(Left, Right):
    pass

print([parent.__name__ for parent in Joined.__mro__])
print(Joined().marks())
`,`['Joined', 'Left', 'Right', 'Base', 'object']
['left', 'right', 'base']
`,"检查共同祖先只出现一次，追踪 Left 的实际下一站。",["Joined 沿 MRO 首先命中 Left 的方法。","Left 在 Joined 的 MRO 上继续到 Right。","Right 调用 Base，得到末尾标记。"],"Left 写 Base.marks(self) 会绕过 Right。"),e("inherit-conflict","验证互相冲突的优先关系","应用",`class A:
    pass

class B:
    pass

class First(A, B):
    pass

class Second(B, A):
    pass

try:
    class Impossible(First, Second):
        pass
except TypeError:
    print("顺序冲突")
`,`顺序冲突
`,"识别错误触发在定义阶段。",["First 给 A 优先。","Second 给 B 优先。","Impossible 无法同时满足两条顺序。"],"复杂继承难以解释查找顺序时，可把可独立替换的行为拆成组件。")]}],comparisons:{headings:["做法","会调用哪一层","使用场景"],rows:[["继承未重写方法","按 MRO 找现有实现","共同契约及默认行为"],["重写后 super()","从当前定义类之后继续","扩展共同逻辑或协作调用"],["显式写 Base.method","直接调用指定实现","确实需要指定该层，须明确跳过其他层的影响"]]},applications:["给继承的初始化写一个构造后立即读取基类字段的测试。","多层行为叠加时让测试核对顺序和共同祖先的执行次数。"],mistakes:[{symptom:"子类实例缺基类字段",reason:"新的 __init__ 没有执行基类初始化。",fix:"根据构造契约调用 super().__init__。",check:"调用一个访问该字段的继承方法。"},{symptom:"多重继承少运行了一个实现",reason:"某层写死基类或没有继续协作调用。",fix:"检查实际 MRO，并让参与层遵守同一调用协议。",check:"在各层记标记并核对顺序。"}],summary:["继承保留查找链，重写在哪一层被找到由实际对象决定。","super 沿实例所属类的 MRO 继续查找。","出现多重继承时用小例子核对顺序与接口。"],next:"下一课观察相同接口如何由不同对象实现，再判断应继承还是组合。",exercises:[s("inherit-base-init","判断新的构造方法是否自动运行父初始化","子类重写 __init__ 并省略 super 调用，父类的 __init__ 会怎样？",1,[["一定先运行","重写改变了选中的方法。"],["通常不会自动运行","若需要它，由子类明确调用。"],["会在第一次读取父属性时运行","属性查找不触发父类初始化。"]]),s("inherit-simple","推理实际对象选择的实现","下面输出什么？",2,[["A","B 提供了自己的实现。"],["AB","重写不会自动拼接两次调用。"],["B","b 实例优先查到 B.label。"]],`class A:
    def label(self):
        return "A"
class B(A):
    def label(self):
        return "B"
print(B().label())`,`B
`),s("inherit-next","区分 super 下一站与指定父类","在 Joined 的 MRO 为 Joined、Left、Right、Base、object 时，Left 方法中的 super 从哪开始查？",0,[["Right","从当前定义类 Left 之后开始。"],["Base","只按 Left 单独的继承链会漏掉 Right。"],["Joined","从头查找可能再次命中 Left。"]]),s("inherit-duplicate","判断共同祖先在 MRO 中的次数","例子中 Joined 的 MRO 包含几个 Base？",1,[["0","Base 仍是共同祖先。"],["1","同一类在线性顺序中只出现一次。"],["2","共享祖先不会因两条路径而重复列入。"]]),n("A077","基础编程","在基类初始化后添加子类记录。"),n("A078","独立编程","通过方法重写附加一条费用规则。"),n("A079","综合应用","验证多层初始化和结果计算。"),n("A080","拓展挑战","预测两个协作层换序后的输出。子类关系与共享方法会在组合课的 A096 直接检查。")],references:[r("继承","tutorial/classes.html#inheritance","核对查找和重写。"),r("super","library/functions.html#super","核对代理查找起点。"),r("MRO 指南","howto/mro.html","核对共同祖先与顺序约束。")]},qe={introduction:"库存服务有时把提醒写进日志，有时只累计数量。如果服务调用统一操作，业务流程就能与提醒渠道独立变化。",prerequisites:"实例方法、函数接口、继承与重写。",version:"Python 3.12。",goals:["让不同类实现同一可调用接口并解释动态选择。","通过构造参数注入可替换组件，验证两种实现都遵守约定。","用对象关系和变化方向选择继承或组合。"],topics:[{title:"多态关注可执行的操作",explanation:["多态让多个类型用同一接口完成各自的实现。代码调用 item.cost(units) 时，Python 在运行中依据实际接收的对象查找 cost。重写可以提供多态，不同类只要提供兼容方法也能参加。","按对象实际提供的行为使用它，通常称为鸭子类型。共同约定包括参数、返回值、异常和副作用。方法名字相同不保证可以替换；例如同一个 send 应说明返回成功标记，或失败时抛出约定异常。"],examples:[e("composition-polymorphic-cost","两种计费策略共用账单计算","起步",`class UnitRate:
    def cost(self, units):
        return 2 * units

class FlatRate:
    def cost(self, units):
        return 5 if units else 0

def bill(rule, units):
    return rule.cost(units)

print(bill(UnitRate(), 3), bill(FlatRate(), 3))
print(bill(FlatRate(), 0))
`,`6 5
0
`,"无需共同父类也能按相同契约使用两份规则。",["两种规则都接收一项数量。","bill 不判断实际类型，交给传入对象。","空订单按各自规则返回零。"],"把传入规则类型写成一串 isinstance 分支，会让每次新增实现都要改公共流程。"),e("composition-notification-contract","真实渠道与测试替身遵守同一约定","应用",`class Console:
    def send(self, text):
        print(text)
        return True

class Blocked:
    def send(self, text):
        return False

def announce(channel, text):
    if not channel.send(text):
        print("未送达")

announce(Console(), "到货")
announce(Blocked(), "到货")
`,`到货
未送达
`,"查看相同签名的两种结果及调用者处理失败的方式。",["Console 发送并返回 True。","Blocked 只返回 False。","公用流程依据返回契约报告失败。"],"若成功渠道忘返回 True，调用者会将 None 当成失败。")]},{title:"组合让各对象持有各自职责",explanation:["组合表示对象拥有或使用其他对象。例如订单服务拥有一个计价策略，换策略无需复制订单服务。通过构造参数提供组件称为依赖注入。服务只记录自己需要的接口，组件独立管理它的数据和行为。","判断关系时先问子类型是否可在父类型预期的位置使用。如果新增一种票仍符合票接口，继承可能合适；若服务只是使用一种通知方式，应持有通知组件。围绕会独立变化的部分留出可替换边界，保障业务代码和外部依赖可分别测试。"],examples:[e("composition-service","保持库存逻辑并替换通知组件","应用",`class Recorder:
    def __init__(self):
        self.messages = []

    def send(self, message):
        self.messages.append(message)

class Warehouse:
    def __init__(self, notifier):
        self._notifier = notifier
        self._total = 0

    def receive(self, amount):
        self._total += amount
        self._notifier.send(f"库存 {self._total}")

events = Recorder()
warehouse = Warehouse(events)
warehouse.receive(3)
warehouse.receive(2)
print(events.messages)
`,`['库存 3', '库存 5']
`,"把状态更新与消息记录分给两个对象。",["Warehouse 保留自己的库存和组件引用。","receive 合法更新之后调用 send。","通过测试替身查看通知内容及顺序。"],"将通知列表定义成类属性会造成不同 Recorder 之间的测试串扰。"),e("composition-classify","用同一服务对象切换格式器","应用",`class Compact:
    def render(self, code):
        return code.lower()

class Label:
    def render(self, code):
        return "ID-" + code.upper()

class Exporter:
    def __init__(self, formatter):
        self.formatter = formatter

    def row(self, code):
        return self.formatter.render(code)

export = Exporter(Compact())
print(export.row("Ab"))
export.formatter = Label()
print(export.row("Ab"))
`,`ab
ID-AB
`,"组件可在运行中替换，验证共享入口不变。",["row 依赖 render 契约。","第一次结果来自 Compact。","替换后同一入口使用 Label。"],"若格式器另需前缀配置，可将它存在格式器内，保持 render 参数约定一致。")]}],comparisons:{headings:["关系","表达方式","判断问题"],rows:[["是一种","继承与匹配的公开接口","成员可否替代父类型完成同样的契约？"],["拥有或使用","持有组件并委托","行为是否和主体独立变化？"]]},applications:["用小型记录器替换通知系统，提高测试的可观察性。","将报表格式、计价或配额规则作为可替换组件。"],mistakes:[{symptom:"换了组件就需要改所有调用方",reason:"调用依赖具体实现字段。",fix:"明确最小方法契约，由组件保持内部状态。",check:"用一个轻量替身走同样的业务流程。"},{symptom:"子类有多个父类操作都不能用",reason:"原本是两个对象使用关系，却建立了父子关系。",fix:"将需要的能力做成可委托组件。",check:"列出父类型使用者依赖的行为。"}],summary:["运行时根据接收对象选择方法。","多态需要兼容契约，组合将变化放入可替换组件。","测试应验证组件替换后，主体的其他状态和职责仍正确。"],next:"下一课让自定义对象支持比较、遍历和数据类表达。",exercises:[s("composition-duck","判断鸭子类型最关心的条件","组件没有共同父类，什么时候仍可传给同一调用方？",0,[["都提供兼容的方法和行为","调用方只依赖约定。"],["只要方法名一样","参数、返回和异常也属于契约。"],["只要字段数一样","字段结构无法保证提供所需操作。"]]),s("composition-holds","选择使用通知器的服务关系","一份库存服务需要多种通知渠道，优先怎么组织？",2,[["每个渠道定义一个新的库存子类","渠道和库存会独立变化，不必复制库存类型。"],["把渠道状态写进库存类属性","不同服务可能意外共用状态。"],["服务持有渠道并调用统一方法","渠道可以替换且独立测试。"]]),s("composition-which","预测运行时选择的方法","下面输出什么？",1,[["1 1","第二次传入的对象提供自己的实现。"],["1 2","同一流程分别调用两个对象的方法。"],["发生 TypeError","两对象都满足无额外参数的 get 接口。"]],`class A:
    def get(self):
        return 1
class B:
    def get(self):
        return 2
def read(item):
    return item.get()
print(read(A()), read(B()))`,`1 2
`),s("composition-expectation","区分状态控制和组件实现","测试把短信组件换成只记录文本的替身，适合验证什么？",0,[["业务调用过几次与参数内容","替身可保留记录，业务仍用原接口。"],["真实短信已经送达","替身没有向真实渠道发送。"],["所有组件字段均相同","测试只要求契约一致。"]]),n("A081","基础编程","将计算委托给不同计费策略。"),n("A082","独立编程","使用记录组件验证通知次数和内容。"),n("A083","综合应用","为同一报表注入不同排序与格式策略。"),n("A084","拓展挑战","运行中切换可用渠道并维护各自状态。"),n("A096","综合应用","用评测传入的策略检验组合，同时验证子类复用父类方法。")],references:[r("类与重写","tutorial/classes.html#inheritance","核对实例方法查找。"),r("鸭子类型","glossary.html#term-duck-typing","核对基于接口的对象使用方式。")]},Le={introduction:"库房里的对象也可以被打印、计数、排序和逐项读取。特殊方法让 Python 的通用操作按我们定义的规则工作。数据类适合把一组字段整理成轻量记录。",prerequisites:"普通类、比较、排序、迭代器和装饰器。",version:"Python 3.12。dataclasses 自 3.7 提供。",goals:["为对象选择便于用户阅读与调试的文本表示。","实现相等、比较、长度和迭代契约，并检查类型不匹配与迭代耗尽。","用 dataclass 表达值记录、默认字段与每实例独立集合。"],topics:[{title:"从内置操作找到对应方法",explanation:["__init__ 负责实例初始化。str(obj) 和 print(obj) 使用 __str__，repr(obj) 使用 __repr__，例如容器显示各元素时会使用它们的 repr。两者应返回字符串。常见做法是让 str 面向使用者，repr 包含类型及有助于调试的字段；没有单独的 __str__ 时可退回 repr。","len(obj) 要求 __len__ 得到非负整数。== 和 < 分别会尝试调用 __eq__ 与 __lt__，用于排序和比较。遇到不支持的类型组合时可 return NotImplemented，让 Python 尝试另一侧的比较；它与抛异常的 NotImplementedError 用途不同。定义值相等时还应留意哈希规则，Python 默认让重写 __eq__ 且未定义 __hash__ 的普通类不可哈希。"],examples:[e("protocols-display","同一张票的显示与调试形式","起步",`class Ticket:
    def __init__(self, code):
        self.code = code

    def __str__(self):
        return f"票-{self.code}"

    def __repr__(self):
        return f"Ticket({self.code!r})"

ticket = Ticket("A")
print(ticket)
print(repr(ticket))
print([ticket])
`,`票-A
Ticket('A')
[Ticket('A')]
`,"观察 print 和容器表示选择不同方法。",["__init__ 保存编码。","直接打印时使用 __str__。","列表内元素显示调试形式。"],"特殊方法的返回类型有约定。__str__ 只打印而未返回字符串会报错。"),e("protocols-order","给作业定义可解释的比较规则","应用",`class Job:
    def __init__(self, code, priority):
        self.code = code
        self.priority = priority

    def __eq__(self, other):
        if not isinstance(other, Job):
            return NotImplemented
        return (self.priority, self.code) == (other.priority, other.code)

    def __lt__(self, other):
        if not isinstance(other, Job):
            return NotImplemented
        return self.priority < other.priority

a, b, c = Job("Z", 2), Job("A", 1), Job("B", 2)
print(a == Job("Z", 2), a is Job("Z", 2), a == "Z")
print([job.code for job in sorted([a, b, c])])
`,`True False False
['A', 'Z', 'B']
`,"区分业务相等、身份与排序中的并列。",["两份同字段数据可以等值而拥有不同身份。","对字符串返回 NotImplemented，等号最终给出 False。","排序只看优先级，并列保留输入次序。"],"别在不匹配的 other 上直接访问属性。排序键与相等字段可以服务不同业务目的，应写清。")]},{title:"迭代协议与数据类",explanation:["__iter__ 返回迭代器。迭代器的 __next__ 每次给出下一项，结束时抛 StopIteration，迭代器自身的 __iter__ 返回自己。容器可在每次 iter(container) 时给一个新游标；迭代器本身的进度则持续推进。直接调用内置操作通常从对象类型上查找相应特殊方法。","@dataclass 根据带类型注解的字段生成 __init__、__repr__、__eq__ 等方法，默认不生成大小排序。字段注解描述预期类型，普通数据类不会自动校验。可变默认值应通过 field(default_factory=list) 等方式准备，工厂在需要默认值时运行。"],examples:[e("protocols-cursors","两个游标独立读取同一清单","应用",`class Cursor:
    def __init__(self, items):
        self.items = items
        self.index = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.index == len(self.items):
            raise StopIteration
        value = self.items[self.index]
        self.index += 1
        return value

class Tray:
    def __init__(self, items):
        self.items = tuple(items)

    def __len__(self):
        return len(self.items)

    def __iter__(self):
        return Cursor(self.items)

tray = Tray(["A", "B"])
first = iter(tray)
print(len(tray), next(first), list(first), list(first))
print(list(tray))
`,`2 A ['B'] []
['A', 'B']
`,"观察新游标和同一游标连续使用的差别。",["__len__ 负责报告容器大小。","第一次 next 从 first 取走 A，第一次 list 取走余下的 B。","再次遍历 tray 创建独立游标，并从 A 重读。"],"__next__ 在结束时要抛 StopIteration。返回 None 会让迭代仍被视为有数据。"),e("protocols-dataclass","数据类保存批次的独立标签","起步",`from dataclasses import dataclass, field

@dataclass
class Batch:
    code: str
    units: int = 0
    tags: list[str] = field(default_factory=list)

first = Batch("A")
second = Batch("A")
print(first == second)
first.tags.append("冷藏")
print(first == second, second.tags)
print(first)
`,`True
False []
Batch(code='A', units=0, tags=['冷藏'])
`,"检查生成的构造、值比较和独立列表。",["默认 units 是整数，可以直接共享常量。","tags 的工厂为每次默认构造返回新列表。","默认相等比较同类型实例的参与比较字段。"],"default_factory=list 传入函数本身。写 list() 会提前调用，得到的列表不可作为工厂。"),e("protocols-default-contrast","列表写在类、数据类字段和默认工厂时的行为","起步",`from dataclasses import dataclass, field

class Shared:
    tags = []

first, second = Shared(), Shared()
first.tags.append("fragile")
print(first.tags, second.tags, first.tags is second.tags)

try:
    @dataclass
    class Invalid:
        tags: list[str] = []
except ValueError as exc:
    print(type(exc).__name__, str(exc))

@dataclass
class Separate:
    tags: list[str] = field(default_factory=list)

first, second = Separate(), Separate()
first.tags.append("fragile")
print(first.tags, second.tags, first.tags is second.tags)
`,`['fragile'] ['fragile'] True
ValueError mutable default <class 'list'> for field tags is not allowed: use default_factory
['fragile'] [] False
`,"在 Python 3.12 中对照三种声明方式，并观察错误发生的时机。",["普通类的两个实例都从类上取 tags，两个名字得到同一个列表。append 直接修改该列表。","数据类在装饰器处理字段时拒绝列表默认值，异常发生在构造实例之前。Python 3.12 的检查用不可哈希作为判断可变默认值的近似。","default_factory=list 保存可调用对象。初始化缺省字段时执行 list()，每个默认构造得到一个独立列表。"],"若主动传入同一个列表给两个数据类实例，默认工厂不会被调用。需要独立时应分别传入不同列表，或在接口里明确复制。")]}],comparisons:{headings:["协议","触发方式","需要交回"],rows:[["__str__ / __repr__","str、repr、打印","字符串"],["__eq__ / __lt__","比较运算、排序","比较结果或 NotImplemented"],["__len__","len","非负整数"],["__iter__ / __next__","iter、for、next","迭代器、下一项或 StopIteration"]]},applications:["给域对象写可读显示，对并列排序分别验证顺序与相等。","用数据类表达订单、书目及独立的集合字段，保留自定义验证方法。"],mistakes:[{symptom:"第二轮 for 读不到内容",reason:"两次使用了同一个已经耗尽的迭代器。",fix:"把游标与可重复遍历的容器分开，让容器按需创建游标。",check:"交错使用两个 iter 的返回值。"},{symptom:"@dataclass 在类定义处报 ValueError",reason:"字段直接使用了 [] 作为默认值。",fix:"字段用 field(default_factory=list)。",check:"创建两个实例，追加其中一个的列表并确认另一个为空。"}],summary:["特殊方法使自定义对象和通用操作遵守同一契约。","区分容器与读取位置，并以 StopIteration 明确结束。","数据类减少字段重复定义，验证和业务不变量仍由代码负责。"],next:"最后一课会把这些设计决定组装进管理系统的各个阶段。",exercises:[s("protocol-repr","选择面向调试的表示方法","列表内的一张票通常用哪个方法显示？",1,[["__len__","这用于长度。"],["__repr__","容器使用元素的调试表示。"],["__iter__","这用于读取迭代器。"]]),s("protocol-stop","识别迭代结束的信号","迭代器已耗尽时，__next__ 应做什么？",2,[["返回 None","None 也能是一项合法数据。"],["返回 self","这会持续提供对象。"],["抛出 StopIteration","for 或 list 会据此结束读取。"]]),s("protocol-factory","预测数据类列表各自何时产生","下面输出什么？",0,[["[1] []","默认工厂为每个实例创建新列表。"],["[1] [1]","这会发生在它们共享列表时。"],["发生 TypeError","列表工厂是合法的零实参可调用对象。"]],`from dataclasses import dataclass, field
@dataclass
class Bag:
    values: list = field(default_factory=list)
a, b = Bag(), Bag()
a.values.append(1)
print(a.values, b.values)`,`[1] []
`),s("protocol-eq","区分不支持的比较和异常","对象的 __eq__ 收到无关类型，应怎样表示不处理这个组合？",1,[["raise NotImplementedError","这会中止比较。"],["return NotImplemented","Python 可继续尝试另一侧。"],["return 字符串错误","非空字符串作真值，可能意外表示相等。"]]),{...n("A085","基础编程","练习访客与调试两种文本格式。"),warmup:!0},n("A097","基础编程","供评测导入并构造对象，直接检查 str、repr 及多实例的标签。"),n("A086","独立编程","为队列设计可独立使用的迭代器。"),n("A087","综合应用","分开稳定排序、值相等和对象身份。"),n("A088","拓展挑战","用独立标签列表维护多个数据类实例。")],references:[r("特殊方法","reference/datamodel.html#special-method-names","核对文本、比较和容器协议。"),r("迭代器类型","library/stdtypes.html#iterator-types","核对 __iter__、__next__ 与耗尽。"),r("数据类","library/dataclasses.html","核对字段、默认工厂及自动方法。")]},Ce={introduction:"借阅系统要回答四个问题：有哪些书、谁借着书、谁在排队、哪种规则允许借阅。本课从可观察需求开始，逐步把状态和判定分配给对象，再用连续操作检验设计。",prerequisites:"封装、继承、组合、字典、列表和数据类。",version:"Python 3.12。示例只讨论单进程、顺序命令。",goals:["把需求写成对象、接口、成功条件与失败后状态。","将借还入口、书目状态和借阅规则分开，使用注入组件测试。","从能运行的小版本分步重构，并用状态轨迹验证项目。"],topics:[{title:"先定义状态，再确定类和方法",explanation:["先从规则挑出需要跨命令保存的状态。一份书目记录持有编号、标题和借阅者；每个馆有一个用编号查书的索引；排队按书保存，每人可对不同书各排一次。","把动作写成明确接口。borrow(code, user) 跨书目和借阅策略读取条件，因此可以由 Library 协调；Book 表示单书状态；策略知道用户当前持有多少本时是否还能借。命令入口负责解析、调用和显示。","初版可先做新增、借、还和查询。用形如「借出 → 其他人还书失败 → 查看 → 正常归还」的场景验证失败不改状态。完成后再添加预约和策略。保留命令层测试，让重构可以与旧版逐步对照。"],diagram:{caption:"一本书在借还操作里的状态",text:`空闲 + 有资格的借阅者  → 借出给此人
借出 + 其他人归还     → 拒绝，仍借给原借阅者
借出 + 当前借阅者归还 → 空闲
有预约时，仅队首有优先借阅权`},examples:[e("design-object-transition","实现书的最小借还状态变化","起步",`class Book:
    def __init__(self, code):
        self.code = code
        self.borrower = None

    def borrow(self, user):
        if self.borrower is not None:
            return False
        self.borrower = user
        return True

    def give_back(self, user):
        if self.borrower != user:
            return False
        self.borrower = None
        return True

book = Book("A")
print(book.borrow("M"))
print(book.give_back("N"), book.borrower)
print(book.give_back("M"), book.borrower)
`,`True
False M
True None
`,"建立初版单书规则，验证错误不会污染状态。",["None 表示当前空闲。","非借阅者归还失败，保留原借阅者。","正常归还后恢复空闲。"],"在读取和验证原借阅者之前清空它，会让错误归还生效。"),e("design-object-index","由馆对象保证编号唯一","起步",`from dataclasses import dataclass

@dataclass
class Book:
    code: str
    title: str

class Catalog:
    def __init__(self):
        self.books = {}

    def add(self, book):
        if book.code in self.books:
            return False
        self.books[book.code] = book
        return True

catalog = Catalog()
print(catalog.add(Book("T1", "地图")))
print(catalog.add(Book("T1", "手册")))
print(catalog.books["T1"].title)
`,`True
False
地图
`,"将跨记录唯一性留给索引负责者。",["数据类只描述一份记录。","Catalog 查自己的索引来识别重复。","拒绝重复后不会覆盖旧记录。"],"每本书都不应保存全馆的索引副本。")]},{title:"拆分可变规则，逐步重构",explanation:["借阅限制可能按服务类型调整。将规则放进 can_borrow(active_count) 接口，各类型可共享父类并具有不同实现；馆对象接收并使用策略。这样可以用总额度为零的替身检验失败，不必构造真实借阅历史。","多个状态同时受影响时，先完整验证，再集中提交。比如队首资格、馆藏可用性和限额都通过以后，才更新借阅者和预约队列。若需要维护额外借阅数索引，测试它与实际书件状态是否一致。","状态能按需求查询即可。初版允许逐书扫描获取借阅数，系统扩大后再考虑增量索引。列表弹出队首有移动成本，预约规模大时考虑 deque。持久化、并发借还和日期逾期需要额外模型，可留作拓展。"],examples:[e("design-object-policy","在不改入口的情况下比较两种策略","应用",`class Policy:
    limit = 2

    def allows(self, active):
        return active < self.limit

class Quick(Policy):
    limit = 1

class Desk:
    def __init__(self, policy):
        self.policy = policy

    def check(self, active):
        return "OK" if self.policy.allows(active) else "LIMIT"

print(Desk(Policy()).check(1))
print(Desk(Quick()).check(1))
`,`OK
LIMIT
`,"通过注入方式对同一输入测试不同规则。",["Quick 符合 Policy 的同一接口。","Desk 把真实条件委托给策略。","更换策略时指令格式和调用代码保持一致。"],"将具体规则写死在命令解析会造成多个分支分别复制借阅逻辑。"),e("design-object-queue","先验证预约和限额，再消费队首","应用",`class ReservedItem:
    def __init__(self):
        self.queue = ["A", "B"]
        self.borrower = None

    def checkout(self, user, allowed):
        if self.borrower is not None or not allowed:
            return False
        if self.queue and self.queue[0] != user:
            return False
        self.borrower = user
        if self.queue:
            self.queue.pop(0)
        return True

item = ReservedItem()
print(item.checkout("A", False), item.queue)
print(item.checkout("B", True), item.queue)
print(item.checkout("A", True), item.queue)
`,`False ['A', 'B']
False ['A', 'B']
True ['B']
`,"跟踪拒绝和成功对两个状态的影响。",["A 的限额未通过，队首仍为 A。","B 无法越过 A。","A 合法借出后才移除队首。"],"通用项目中读取 queue[0] 前还应判断队列是否为空。")]}],comparisons:{headings:["对象或层","负责什么","可用什么来测"],rows:[["Book","记录标题、借阅人、预约等单件状态","单件借还、错误身份"],["Library","馆藏索引与跨对象协调","重复编号、多馆独立、失败整体不变"],["Policy","判断持有本数是否符合规则","阈值与可替换的拒绝策略"],["命令入口","解析与显示","完整交互输出"]]},applications:["先用短场景验证规则，再拆类或增添索引。","验收项目时独立检查库存、队列、规则，可用测试替身隔离故障。"],mistakes:[{symptom:"超额拒绝后预约顺序变化",reason:"验证未完成就弹出了队首。",fix:"先决定是否成功，成功分支再一起提交变更。",check:"把前后查询和失败命令放在同一场景。"},{symptom:"添加第二个馆后发现第一馆的书",reason:"把馆藏字典定义为类属性。",fix:"在各馆初始化各自索引。",check:"给两馆录入相同编号而标题不同。"}],summary:["先确定状态归属和公开返回契约，再决定类和方法。","策略和业务状态可独立测试，失败路径先验证后提交。","重构与优化前保存能发现边界错误的完整交互。"],next:"完成本模块测评后，打开综合项目中的「图书借阅与预约管理」，按阶段计划完成完整程序。",exercises:[s("object-design-id-owner","选择跨书目编号唯一检查的职责","谁最适合判断馆内是否存在重复编号？",1,[["每本书分别检查","单本书没有馆内完整索引。"],["持有编号索引的馆对象","馆对象能比较现有状态。"],["借阅策略","策略负责借阅配额。"]]),s("object-design-state","预测失败后还剩哪些数据","下面输出什么？",0,[["A","拒绝后的借阅者应保持。"],["空闲","只有合法归还才清空。"],["B","归还操作不会把图书借给 B。"]],`class Book:
    def __init__(self):
        self.borrower = "A"
    def give_back(self, user):
        if self.borrower == user:
            self.borrower = None

book = Book()
book.give_back("B")
print(book.borrower or "空闲")`,`A
`),s("object-design-queue","定位队首何时消费","预约队首已到，但用户超出配额，应该执行什么？",2,[["移除队首再拒绝","这会改变预约资格。"],["借出再记录超额","超额时必须拒绝。"],["拒绝，并保留借阅状态和队首","只在校验都通过后提交。"]]),s("object-design-refactor","识别能验证重构的一组用例","把借阅规则拆成策略前，优先补充哪种测试？",1,[["只验证类名","类型名无法说明规则是否保留。"],["用相同交互核对初始、失败、成功和查询","前后需得到同样的可观察结果。"],["只跑一次 ADD","新增通常不会触发借阅规则。"]]),n("A089","基础编程","维护登记、下架与编号复用，检查标题相同时其他书目是否受影响。"),n("A090","独立编程","维护单件预约顺序与去重。"),n("A091","综合应用","让两个柜台独立处理借出与归还。"),n("A092","拓展挑战","组合设备状态与预约优先级，完成模块测评。")],references:[r("类、实例与继承","tutorial/classes.html","复核模型使用的对象行为。"),r("数据类","library/dataclasses.html","用记录建模与独立预约列表。")]},[y,x]=b,Re=[t(65,y,"入门","工作台领用余额",{background:"一台工作台记录可发剩余件数。",description:"按顺序处理领用申请，申请不超过剩余量才扣减。",input:"首行初始余额。第二行是空格分隔的领用件数，可为空。",output:"每笔输出 OK 或 NO，再输出操作后的余额。同一行以空格分开。",limits:"至多 100 笔，数值 0–1000。零申请合法。"},[`3
4 3 0
`,`NO 3
OK 0
OK 0
`,"第一次被拒，余额保留给下一笔。"],[[`0
1 0
`,`NO 0
OK 0
`],[`7

`,""],[`8
3 2 4
`,`OK 5
OK 3
NO 3
`]],["把余额存在实例里。","检查失败后提前返回。"],`class Desk:
    def __init__(self, remaining):
        self.remaining = remaining

    def take(self, amount):
        if amount > self.remaining:
            return False
        self.remaining -= amount
        return True

desk = Desk(int(input()))
for count in map(int, input().split()):
    print("OK" if desk.take(count) else "NO", desk.remaining)
`,{concepts:["实例状态","方法返回值","失败保留状态"],approach:"只由实例扣减，入口根据返回值打印。",steps:["构造时写入余额。","检查后扣减或返回失败。","按行查询操作后的值。"],time:"O(n)。",space:"O(n)，含单行输入拆分。",pitfall:"零余量仍可领用零件数。",extension:"加入补货方法，观察余额上限。"}),t(66,y,"入门","双仪表校准",{background:"两台仪表独立保存校准值。",description:"每次给指定仪表加一个增量。若新值不在 0–100 内，拒绝并保留原值。",input:"首行 A 初值、B 初值、q。随后 q 行给 A 或 B 和增量。",output:"每笔输出 OK 或 NO，后接该仪表最终值。末行输出 A、B 的当前值。",limits:"0 ≤ q ≤ 200，初值 0–100，增量 -100–100。"},[`0 90 3
A -1
B 10
A 5
`,`NO 0
OK 100
OK 5
5 100
`,"两台改动相互独立。"],[[`2 3 0
`,`2 3
`],[`99 1 2
A 2
B -1
`,`NO 99
OK 0
99 0
`],[`10 10 2
A 0
B -11
`,`OK 10
NO 10
10 10
`]],["分别调用两次构造。","增量先用于计算候选值，再决定是否写入。"],`class Meter:
    def __init__(self, value):
        self.value = value

    def adjust(self, delta):
        candidate = self.value + delta
        if not 0 <= candidate <= 100:
            return "NO"
        self.value = candidate
        return "OK"

a, b, q = map(int, input().split())
meters = {"A": Meter(a), "B": Meter(b)}
for _ in range(q):
    code, delta = input().split()
    meter = meters[code]
    print(meter.adjust(int(delta)), meter.value)
print(meters["A"].value, meters["B"].value)
`,{concepts:["两个实例","状态隔离","范围判断"],approach:"共用方法代码，各自持有赋值目标。",steps:["分别构造两台。","按编号定位本次目标。","先判断候选值，再核对最终两份状态。"],time:"O(q)。",space:"O(1)。",pitfall:"两个键绑定到同一实例会让状态串到另一台。",extension:"加入用别名访问同一仪表的命令，并说明预期。"}),t(67,y,"基础","工位计时指令",{background:"工位可登记、累加时长和查询。",description:"NEW 建立新工位并给初值，已有则拒绝。ADD 增加时长，GET 读取时长。两种读取命令找不到工位都报错。",input:"首行 q。后续每行 NEW 编号 初值、ADD 编号 增量或 GET 编号。",output:"NEW 输出 OK 或 DUP，ADD 与 GET 输出当前值，找不到输出 NA。",limits:"0 ≤ q ≤ 400，编号为 1–10 位英数字，初值与增量 0–1000。"},[`6
GET A
NEW A 3
NEW A 8
ADD A 1
NEW B 5
GET B
`,`NA
OK
DUP
4
OK
5
`,"重复登记不覆盖原工位。"],[[`0
`,""],[`2
ADD B 2
GET B
`,`NA
NA
`],[`4
NEW A 0
ADD A 0
NEW B 0
GET A
`,`OK
0
OK
0
`]],["索引用字典，每项存一个计时对象。","重复和缺失先判断，再调用方法。"],`class Timer:
    def __init__(self, minutes):
        self.minutes = minutes

    def add(self, delta):
        self.minutes += delta
        return self.minutes

timers = {}
for _ in range(int(input())):
    command, code, *extra = input().split()
    if command == "NEW":
        if code in timers:
            print("DUP")
        else:
            timers[code] = Timer(int(extra[0]))
            print("OK")
    elif code not in timers:
        print("NA")
    elif command == "ADD":
        print(timers[code].add(int(extra[0])))
    else:
        print(timers[code].minutes)
`,{concepts:["字典索引","实例方法","对象生命周期"],approach:"明确创建和更新的权限，索引负责对象的区分。",steps:["解析命令和编号。","仅对新编号创建记录。","按对象查询或累计。"],time:"平均 O(q)。",space:"O(s)，s 为工位数量。",pitfall:"查询不存在项不应自动分配计时器。",extension:"增加停用工位但保留历史的业务规则。"}),t(68,y,"进阶","展厅导航轨迹",{background:"导览终端可以在一条访问轨迹中后退、前进，也能从当前位置开启新的路线。",description:"VISIT 切换到新展厅并丢掉当前位置之后的轨迹。BACK 和 FORWARD 移动光标，到边界时停止。",input:"首行初始展厅和 q。后 q 行分别为 VISIT 展厅、BACK 步数或 FORWARD 步数。",output:"每条命令后输出当前展厅。",limits:"0 ≤ q ≤ 400，名称 1–10 位英数字，步数 0–1000，允许再次访问同名展厅。"},[`H 6
VISIT A
VISIT B
BACK 1
VISIT C
FORWARD 5
BACK 9
`,`A
B
A
C
C
H
`,"访问 C 后，A 之后原有的 B 被删去。"],[[`A 0
`,""],[`A 3
BACK 2
FORWARD 3
VISIT A
`,`A
A
A
`],[`X 5
VISIT Y
BACK 1
FORWARD 0
FORWARD 1
FORWARD 1
`,`Y
X
X
Y
Y
`]],["保存一份轨迹和一个当前位置。","新增前删除当前位置之后的数据。"],`class Tour:
    def __init__(self, home):
        self.stops = [home]
        self.index = 0

    def visit(self, room):
        del self.stops[self.index + 1:]
        self.stops.append(room)
        self.index += 1

    def move(self, delta):
        self.index = max(0, min(self.index + delta, len(self.stops) - 1))

home, q = input().split()
tour = Tour(home)
for _ in range(int(q)):
    action, value = input().split()
    if action == "VISIT":
        tour.visit(value)
    else:
        tour.move(int(value) if action == "FORWARD" else -int(value))
    print(tour.stops[tour.index])
`,{concepts:["对象状态","光标","轨迹重写"],approach:"能够共同影响轨迹的两个字段留在同一实例。",steps:["初始化首页光标。","前后移动时只更新索引。","访问时截断旧未来再追加。"],time:"总计 O(q)，每条已追加位置至多被删除一次。",space:"O(q)。",pitfall:"退回旧位置后新访不会保留之前的未来轨迹。",extension:"创建两条导览路线并交替操作验证状态不串。"},{kind:"adapted",platform:"LeetCode",title:"Design Browser History",id:"1472",level:"Medium",url:"https://leetcode.com/problems/design-browser-history/",concepts:["对象状态","光标与前进历史"],adaptation:"用展厅和标准输入的命令流表达轨迹，为每条命令输出当前展厅，加入零步数与同名展厅。"}),t(69,x,"入门","共享费率与柜台特例",{background:"多个柜台共用费率，部分柜台可设本地覆盖。",description:"CLASS 修改共享费率，LOCAL 为 A 设特例，CLEAR 移除 A 的特例，ASK 查询两台各自读取的值。",input:"首行「初始费率 q」，其后 q 行是 CLASS 数值、LOCAL 数值、CLEAR 或 ASK。",output:"每次 ASK 输出 A 和 B 当前费率。",limits:"0 ≤ q ≤ 200，所有费率为 0–1000。CLEAR 未设特例时无变化。"},[`2 6
ASK
LOCAL 0
CLASS 4
ASK
CLEAR
ASK
`,`2 2
0 4
4 4
`,"覆盖值为零仍有效，清除才恢复共享。"],[[`3 0
`,""],[`4 2
CLEAR
ASK
`,`4 4
`],[`1 4
LOCAL 5
CLASS 0
ASK
ASK
`,`5 0
5 0
`]],["把共享费率放在类上。","特例独立赋给 A，清除时只删除实例项。"],`class Desk:
    rate = 0

initial, q = map(int, input().split())
Desk.rate = initial
a, b = Desk(), Desk()
for _ in range(q):
    action, *value = input().split()
    if action == "CLASS":
        Desk.rate = int(value[0])
    elif action == "LOCAL":
        a.rate = int(value[0])
    elif action == "CLEAR":
        a.__dict__.pop("rate", None)
    else:
        print(a.rate, b.rate)
`,{concepts:["类属性","实例遮蔽","删除实例项"],approach:"依靠普通属性查找表达本地特例与共享默认。",steps:["给类绑定初值。","分别在类或 A 上写入。","清除本地键后查询。"],time:"O(q)。",space:"O(1)。",pitfall:"给 A 写回当前类值会继续遮蔽将来的配置。",extension:"允许 B 也设置和清除覆盖，验证两实例相互独立。"}),t(70,x,"入门","从标签构造仪表",{background:"批量导入用一行文本描述每台仪表。",description:"有效行形如 编号:读数，按冒号拆为恰好两项，编号为 ASCII 英数字，读数为 ASCII 数字并转为整数。",input:"首行 q，后续 q 行是待解析文本。",output:"合法时输出「大写编号 整数值」，否则报 INVALID。",limits:"0 ≤ q ≤ 200，行不超过 40 字符，合法读数 1–4 位数字；编号长度 1–8，不允许内外空格。"},[`4
ab2:0003
E:0
A-B:2
C:５
`,`AB2 3
E 0
INVALID
INVALID
`,"读数去掉前导零，全角数字拒绝。"],[[`0
`,""],[`2
A:2:3
:3
`,`INVALID
INVALID
`],[`3
A:9999
B:10000
 C:1
`,`A 9999
INVALID
INVALID
`]],["静态校验只接收显式字段。","让类工厂用 cls(...) 构造对象。"],`class Meter:
    def __init__(self, code, value):
        self.code = code
        self.value = value

    @staticmethod
    def valid(code, text):
        return (1 <= len(code) <= 8 and code.isascii() and code.isalnum()
                and 1 <= len(text) <= 4 and text.isascii() and text.isdecimal())

    @classmethod
    def parse(cls, line):
        code, text = line.split(":")
        if not cls.valid(code, text):
            raise ValueError("无效字段")
        return cls(code.upper(), int(text))

for _ in range(int(input())):
    try:
        meter = Meter.parse(input())
        print(meter.code, meter.value)
    except ValueError:
        print("INVALID")
`,{concepts:["类工厂","静态校验","异常"],approach:"解析入口决定合法性，构造方法保存已解析数据。",steps:["按冒号拆成两项。","检查长度、字符和数字。","用 cls 返回构造结果。"],time:"O(s)，s 为所有行长度。",space:"O(m)，m 为最长行。",pitfall:"单用 isdecimal 会接受部分非 ASCII 数字。",extension:"让某一子类允许新的编码前缀。"}),t(71,x,"基础","共用票据工厂",{background:"普通票和加急票共享扫码格式。",description:"把扫码结果的字母统一成大写，普通票显示 N-编号，加急票显示 F-编号。",input:"首行 q，后 q 行给 NORMAL 或 FAST 及编号。",output:"逐行输出票据标签。",limits:"0 ≤ q ≤ 200，编号为 1–10 位英数字。前导零保留。"},[`3
NORMAL a3
FAST a3
FAST 07
`,`N-A3
F-A3
F-07
`,"同一编码由实际选中的票类生成。"],[[`0
`,""],[`1
NORMAL Z
`,`N-Z
`],[`2
FAST b
NORMAL b
`,`F-B
N-B
`]],["在基类写一份 from_scan。","构造用 cls，展示读取实际对象的前缀。"],`class Ticket:
    prefix = "N"

    def __init__(self, code):
        self.code = code

    @classmethod
    def from_scan(cls, code):
        return cls(code.upper())

    def label(self):
        return self.prefix + "-" + self.code

class FastTicket(Ticket):
    prefix = "F"

kinds = {"NORMAL": Ticket, "FAST": FastTicket}
for _ in range(int(input())):
    kind, code = input().split()
    print(kinds[kind].from_scan(code).label())
`,{concepts:["类工厂","cls","类属性"],approach:"选择类后共用解析过程，各自保存票号与前缀。",steps:["按类型选实际类。","从扫码文本构造实例。","以实例和其类型的数据展示。"],time:"O(s)，s 为输入总长度。",space:"O(1)，每个编号宽度有限。",pitfall:"工厂直接调用 Ticket 会丢失加急类型。",extension:"加急票验证编号前缀并报告错误。"}),t(72,x,"进阶","柜台历史与总登记数",{background:"A、B 分别保留登记历史，全场还要知道两台登记次数之和。",description:"ADD 记录标签，RESET 仅清掉指定台的本地历史。Q 展示该台的当前历史条数和最近标签，再显示全场累计 ADD 数。",input:"首行 q，之后各行为 ADD 台号 标签、RESET 台号或 Q 台号，台号为 A 或 B。",output:"仅对 Q 输出「本地条数 最近标签 全场累计」。历史为空时最近标签写 -。",limits:"0 ≤ q ≤ 300，标签 1–8 位英数字。重复标签逐条记录。"},[`7
ADD A X
ADD B Y
ADD A X
Q A
RESET A
Q A
Q B
`,`2 X 3
0 - 3
1 Y 3
`,"重置只影响 A 当前历史。"],[[`0
`,""],[`2
Q A
Q B
`,`0 - 0
0 - 0
`],[`3
ADD A Z
RESET B
Q A
`,`1 Z 1
`]],["累计用类字段，本地历史在实例初始化。","清本地历史时保持类计数。"],`class Desk:
    recorded = 0

    def __init__(self):
        self.history = []

    def add(self, label):
        self.history.append(label)
        Desk.recorded += 1

    def summary(self):
        return len(self.history), self.history[-1] if self.history else "-", Desk.recorded

desks = {"A": Desk(), "B": Desk()}
for _ in range(int(input())):
    action, code, *label = input().split()
    desk = desks[code]
    if action == "ADD":
        desk.add(label[0])
    elif action == "RESET":
        desk.history.clear()
    else:
        print(*desk.summary())
`,{concepts:["类计数","独立实例列表","查询契约"],approach:"全场累计和本地历史分别由适当的对象持有。",steps:["构造两个柜台。","登记时更新两类指标。","重置与查询只读取所需状态。"],time:"O(q)，含清除条目，单条记录至多清一次。",space:"O(q)。",pitfall:"self.recorded += 1 会写出一个实例同名值。",extension:"增加全场统计重置，但保留两台现有历史。"})],[,,B,N]=b,Ie=[t(73,B,"入门","受校验的仓位数量",{background:"登记员可更正仓位数量。",description:"数量在 0 到容量之间才可写入。否则保持原值。",input:"首行容量和实际初值。第二行是尝试设置的整数序列，可为空。",output:"每次输出 OK 或 NO 及实际数量。",limits:"容量 0–1000，初值合法；至多 150 次写入，候选范围 -1000–2000。"},[`5 2
-1 5 6 0
`,`NO 2
OK 5
NO 5
OK 0
`,"两个端点都允许。"],[[`0 0
1 0 -1
`,`NO 0
OK 0
NO 0
`],[`1 1

`,""],[`4 1
4 4 2
`,`OK 4
OK 4
OK 2
`]],["构造和设置共享同一个 setter。","候选合法后再保存到内部属性。"],`class Stock:
    def __init__(self, capacity, count):
        self._capacity = capacity
        self.count = count

    @property
    def count(self):
        return self._count

    @count.setter
    def count(self, count):
        if not 0 <= count <= self._capacity:
            raise ValueError("超出范围")
        self._count = count

stock = Stock(*map(int, input().split()))
for count in map(int, input().split()):
    try:
        stock.count = count
        print("OK", stock.count)
    except ValueError:
        print("NO", stock.count)
`,{concepts:["property","统一校验","失败前验证"],approach:"赋值均通过 setter，主循环只处理显示。",steps:["保存容量。","在 setter 校验候选。","在主循环输出实际值和结果。"],time:"O(n)。",space:"O(n)，含行拆分。",pitfall:"setter 内给公开名赋值会再次触发 setter。",extension:"加入可调容量，并拒绝将容量减到当前值以下。"}),t(74,B,"入门","用只读属性查看空位",{background:"仓位剩余由容量减去已使用量得到。",description:"ADD 占用席位、FREE 释放席位。超容量或试图释放超过已占用量时拒绝。ASK 查询剩余。",input:"首行「容量 q」。后 q 行为 ADD 数值、FREE 数值或 ASK。",output:"每条命令都输出当前剩余。ADD、FREE 另在同一行前缀输出 OK 或 NO。",limits:"0 ≤ q ≤ 100，初始未占用；容量和数量均为 0–1000。"},[`4 5
ADD 3
FREE 4
ASK
FREE 2
ADD 4
`,`OK 1
NO 1
1
OK 3
NO 3
`,"释放失败不增加可用量。"],[[`4 0
`,""],[`0 3
ADD 0
FREE 1
ASK
`,`OK 0
NO 0
0
`],[`3 2
ADD 3
FREE 3
`,`OK 0
OK 3
`]],["保存容量与使用量。","available 每次计算，写操作统一验证新使用量。"],`class Room:
    def __init__(self, capacity):
        self._capacity = capacity
        self._used = 0

    @property
    def available(self):
        return self._capacity - self._used

    def change(self, delta):
        final = self._used + delta
        if not 0 <= final <= self._capacity:
            return "NO"
        self._used = final
        return "OK"

capacity, q = map(int, input().split())
room = Room(capacity)
for _ in range(q):
    action, *count = input().split()
    if action == "ASK":
        print(room.available)
    else:
        delta = int(count[0]) * (1 if action == "ADD" else -1)
        print(room.change(delta), room.available)
`,{concepts:["派生属性","范围约束"],approach:"从同一份真实状态计算剩余，避免同步多份数据。",steps:["构造空仓位。","占用和释放转换为带符号变更。","报告由属性计算的剩余。"],time:"O(q)。",space:"O(1)。",pitfall:"重复保存可用量可能在失败后不同步。",extension:"另公开占用率，处理容量为零的情况。"}),t(75,B,"基础","保留历史快照",{background:"审核者需要对照提交时的标签清单，即使之后还会调整。",description:"ADD 追加，CLEAR 清空，SNAP 保存当时清单。最后一次性输出所有快照及当前清单。",input:"首行 q，随后为 ADD 标签、CLEAR 或 SNAP。",output:"每个快照一行，最后输出当前清单一行。列表用逗号连接，空写 NONE。",limits:"0 ≤ q ≤ 100，标签 1–8 位英数字，重复标签保留。"},[`7
SNAP
ADD A
SNAP
ADD B
SNAP
CLEAR
ADD C
`,`NONE
A
A,B
C
`,"早期保存的快照不随 CLEAR 变动。"],[[`0
`,`NONE
`],[`3
ADD Z
SNAP
CLEAR
`,`Z
NONE
`],[`3
ADD X
ADD X
SNAP
`,`X,X
X,X
`]],["快照需要自己的容器。","在所有操作结束才打印观察是否被后续修改。"],`class Shelf:
    def __init__(self):
        self._labels = []

    def add(self, label):
        self._labels.append(label)

    def clear(self):
        self._labels.clear()

    @property
    def snapshot(self):
        return tuple(self._labels)

shelf = Shelf()
saved = []
for _ in range(int(input())):
    action, *labels = input().split()
    if action == "ADD":
        shelf.add(labels[0])
    elif action == "CLEAR":
        shelf.clear()
    else:
        saved.append(shelf.snapshot)
saved.append(shelf.snapshot)
for row in saved:
    print(",".join(row) or "NONE")
`,{concepts:["对外快照","不可变接口","状态变更"],approach:"把当前可写容器留在对象内，快照仅记录当时的字符串。",steps:["修改通过公开方法。","在 SNAP 时复制字段。","最后按保存次序展示。"],time:"O(q+s)，s 为快照及当前输出的条目总数。",space:"O(q+s)。",pitfall:"保存内部列表引用会让过去的记录被改写。",extension:"若标签换成字典，决定哪些字段也要复制。"}),t(76,B,"进阶","跨柜台完整转移",{background:"领物台之间调货，必须同时满足源台有货、目标台有空位。",description:"每次将件数由指定来源转给另一台。两条件均满足才更新。失败时保留两台原值。",input:"首行 capA countA capB countB q。每条命令给来源 A 或 B 和件数。",output:"每次输出 OK 或 NO，后接两台的当前件数。",limits:"0 ≤ q ≤ 300，容量和件数 0–1000，初值不超过各自容量，零件转移允许。"},[`5 4 4 2 4
A 3
A 2
B 4
B 3
`,`NO 4 2
OK 2 4
NO 2 4
OK 5 1
`,"第三次失败时，两台仍有 2 和 4。"],[[`1 1 1 0 0
`,""],[`0 0 0 0 2
A 0
B 1
`,`OK 0 0
NO 0 0
`],[`9 0 2 1 2
B 2
B 1
`,`NO 0 1
OK 1 0
`]],["读取两台的当前状态，先把两条条件都判断完。","通过后再写两个位置。"],`class Desk:
    def __init__(self, capacity, count):
        self._capacity = capacity
        self._count = count

    @property
    def count(self):
        return self._count

    def transfer(self, target, count):
        if count > self._count or target._count + count > target._capacity:
            return "NO"
        self._count -= count
        target._count += count
        return "OK"

cap_a, a, cap_b, b, q = map(int, input().split())
desks = {"A": Desk(cap_a, a), "B": Desk(cap_b, b)}
for _ in range(q):
    source, count = input().split()
    target = "B" if source == "A" else "A"
    print(desks[source].transfer(desks[target], int(count)), desks["A"].count, desks["B"].count)
`,{concepts:["对象协作","状态约束","全量验证"],approach:"转移职责由来源对象承担，失败分支不会写任一对象。",steps:["找出两个参与对象。","验证供货及空位。","在成功分支同时调整两个余额。"],time:"O(q)。",space:"O(1)。",pitfall:"目标失败前先扣来源会损失数量。",extension:"记录每次成功后库存和是否仍等于最初总量。"}),t(77,N,"入门","工牌的基础与附加字段",{background:"普通与主管工牌使用相同的编号字段。",description:"普通工牌显示编号，主管工牌还要追加区域。",input:"首行 q。后 q 行为 BASE 编号 或 LEAD 编号 区域。",output:"BASE 输出编号，LEAD 输出「编号@区域」。",limits:"0 ≤ q ≤ 300，编号、区域为 1–8 位英数字。"},[`2
BASE X
LEAD Y N
`,`X
Y@N
`,"主管工牌通过基类建立共享字段。"],[[`0
`,""],[`1
LEAD 0 E
`,`0@E
`],[`2
LEAD X W
BASE X
`,`X@W
X
`]],["把 code 的初始化交给基类。","子类在 super().__init__ 之后添加 zone。"],`class Card:
    def __init__(self, code):
        self.code = code

    def label(self):
        return self.code

class Lead(Card):
    def __init__(self, code, zone):
        super().__init__(code)
        self.zone = zone

    def label(self):
        return f"{self.code}@{self.zone}"

for _ in range(int(input())):
    kind, *fields = input().split()
    card = Card(*fields) if kind == "BASE" else Lead(*fields)
    print(card.label())
`,{concepts:["基类初始化","实例属性","方法重写"],approach:"共享字段只初始化一次，子类保存附加字段。",steps:["解析类型和字段。","根据需要构造基类或子类。","用统一方法输出。"],time:"O(q)。",space:"O(1)。",pitfall:"子类漏掉初始化基类会缺 code。",extension:"验证两个对象相同编号、不同区域时的显示。"}),t(78,N,"入门","加急运费增量",{background:"基础运费是重量的两倍，非空加急单另外加 3。",description:"处理普通和加急订单。两种订单重量为 0 时都收 0。",input:"首行 q，随后各行为 N 或 E 和整数重量。",output:"每条输出整数运费。",limits:"0 ≤ q ≤ 200，重量 0–1000。"},[`4
N 2
E 2
E 0
N 0
`,`4
7
0
0
`,"空加急单免附加费。"],[[`0
`,""],[`1
E 1000
`,`2003
`],[`2
N 1
E 1
`,`2
5
`]],["让基类完成共同计费。","子类调用 super 得到基础费用后再处理附加项。"],`class Shipment:
    def fee(self, weight):
        return weight * 2

class Express(Shipment):
    def fee(self, weight):
        return super().fee(weight) + (3 if weight else 0)

schemes = {"N": Shipment(), "E": Express()}
for _ in range(int(input())):
    kind, weight = input().split()
    print(schemes[kind].fee(int(weight)))
`,{concepts:["重写","复用计算","零值分支"],approach:"基类承担基础公式，子类只描述差额。",steps:["配置两种对象。","重写时调用 super。","验证零重量与正重量。"],time:"O(q)。",space:"O(1)。",pitfall:"重复实现基础公式容易在价格变动时分叉。",extension:"把附加费设为可配置的实例字段。"}),t(79,N,"基础","三级通行证有效期",{background:"三种通行证从共同起始日构造。",description:"B 有效 1 日，W 继承基础并额外加 6 日，P 在 W 之上再加 3 日。到期日为起始日加有效期。",input:"首行 q，后 q 行为类型 B、W 或 P、编号和起始日。",output:"每条输出「编号 到期日」。",limits:"0 ≤ q ≤ 200，编号 1–8 位英数字，起始日在 0–10000。"},[`3
B A 1
W A 1
P A 1
`,`A 2
A 8
A 11
`,"P 同时含基础与周票层的增量。"],[[`0
`,""],[`1
P X 0
`,`X 10
`],[`2
W 07 0
B 07 9
`,`07 7
07 10
`]],["先把编号与日期存在共同基类。","每个重写的 duration 只加自己的值。"],`class Pass:
    def __init__(self, code, start):
        self.code = code
        self.start = start

    def duration(self):
        return 1

    def expires(self):
        return self.start + self.duration()

class Weekly(Pass):
    def duration(self):
        return super().duration() + 6

class Plus(Weekly):
    def duration(self):
        return super().duration() + 3

kinds = {"B": Pass, "W": Weekly, "P": Plus}
for _ in range(int(input())):
    kind, code, start = input().split()
    ticket = kinds[kind](code, int(start))
    print(ticket.code, ticket.expires())
`,{concepts:["多层继承","继承构造","动态查找"],approach:"保留共同 expires，依据实际对象分派 duration。",steps:["统一构造公共属性。","各层只追加自己的天数。","用继承方法计算到期日。"],time:"O(q)。",space:"O(1)。",pitfall:"Plus 显式调 Pass.duration 会漏掉中间层。",extension:"加入可配置的起始日验证，检查子类仍执行。"}),t(80,N,"进阶","协作层的报价顺序",{background:"两个报价层可以按不同顺序组合，基础层只返回输入金额。",description:"A 将下一层返回值乘二，B 将下一层返回值加三。AB 表示 A 先进入、B 后进入；BA 反过来。共同基础层只运行一次。",input:"首行 q。随后 q 行各给 AB 或 BA 和整数金额。",output:"每条输出最后的整数报价。",limits:"0 ≤ q ≤ 200，金额 0–1000。"},[`3
AB 2
BA 2
AB 0
`,`10
7
6
`,"AB 中 B 先得到基础值再加三，外层 A 乘二。"],[[`0
`,""],[`1
BA 0
`,`3
`],[`2
AB 1000
BA 1000
`,`2006
2003
`]],["写两个分别调用 super().quote 的协作层。","两个组合类应使用不同的基类次序。"],`class Base:
    def quote(self, amount):
        return amount

class Double(Base):
    def quote(self, amount):
        return 2 * super().quote(amount)

class Add(Base):
    def quote(self, amount):
        return 3 + super().quote(amount)

class AB(Double, Add):
    pass

class BA(Add, Double):
    pass

rules = {"AB": AB(), "BA": BA()}
for _ in range(int(input())):
    mode, amount = input().split()
    print(rules[mode].quote(int(amount)))
`,{concepts:["MRO","协作 super","进入和返回顺序"],approach:"用两种实际类型展示同样规则的不同线性顺序。",steps:["分别实现基础、乘法和加法。","以类的基类顺序选择进入顺序。","核对合成在返回时执行。"],time:"O(q)。",space:"O(1)。",pitfall:"调用 Base.quote 会跳过另一协作层。",extension:"打印每种组合的 MRO，验证基础层只出现一次。"})],[,,,,w,v]=b,Ke=[t(81,w,"入门","两种计价策略",{background:"同一开单程序接收按件或固定价策略。",description:"UNIT 每件 3 元，FLAT 有货时固定 8 元，空订单都是 0。",input:"首行 q，后 q 行为模式、非负件数。",output:"逐单输出整数费用。",limits:"0 ≤ q ≤ 200，件数 0–1000。"},[`4
UNIT 2
FLAT 2
FLAT 0
UNIT 0
`,`6
8
0
0
`,"同一种调用根据规则改变结果。"],[[`0
`,""],[`1
FLAT 1000
`,`8
`],[`2
UNIT 7
FLAT 1
`,`21
8
`]],["给两种策略共同的 cost(units) 接口。","入口按模式选择实例，再只调用 cost。"],`class UnitRate:
    def cost(self, units):
        return units * 3

class FlatRate:
    def cost(self, units):
        return 8 if units else 0

rules = {"UNIT": UnitRate(), "FLAT": FlatRate()}
for _ in range(int(input())):
    mode, count = input().split()
    print(rules[mode].cost(int(count)))
`,{concepts:["多态","统一方法签名"],approach:"规则对象承担公式，入口统一调用。",steps:["定义两种独立策略。","按模式选择实际对象。","调用并打印费用。"],time:"O(q)。",space:"O(1)。",pitfall:"把规则判断写进统一计算方法会使新增策略同时修改旧逻辑。",extension:"添加按区间计价的策略。"}),t(82,w,"入门","记录库存阈值到达事件",{background:"测试人员用记录器代替外部通知。",description:"库存初始为零，逐条增加。仅当某次增加前低于阈值，增加后达到或超过时，通知当前总量。",input:"首行正整数阈值，第二行为空或一组非负补货量。",output:"先输出通知次数，再输出每条通知的库存值，一行一条。末行输出 TOTAL 及总库存。",limits:"阈值为 1–1000，至多 300 项，单项 0–1000。"},[`5
2 0 4 3
`,`1
6
TOTAL 9
`,"达到阈值时实际总量为 6。"],[[`3

`,`0
TOTAL 0
`],[`3
1 2 0 4
`,`1
3
TOTAL 7
`],[`3
0 1 1
`,`0
TOTAL 2
`]],["把通知数据留在组件的列表中。","库存服务只在跨越阈值时委托通知。"],`class Recorder:
    def __init__(self):
        self.events = []

    def send(self, total):
        self.events.append(total)

class Warehouse:
    def __init__(self, threshold, notifier):
        self.threshold = threshold
        self.total = 0
        self.notifier = notifier

    def receive(self, amount):
        before = self.total
        self.total += amount
        if before < self.threshold <= self.total:
            self.notifier.send(self.total)

events = Recorder()
stock = Warehouse(int(input()), events)
for amount in map(int, input().split()):
    stock.receive(amount)
print(len(events.events))
for total in events.events:
    print(total)
print("TOTAL", stock.total)
`,{concepts:["组合","记录替身","跨越判断"],approach:"业务对象委托给 send，记录器保存测试证据。",steps:["创建并注入记录器。","对每步比较改动前后。","分别展示通知和最终状态。"],time:"O(n)。",space:"O(n)，含拆分输入。",pitfall:"只检查最终值会在跨过阈值后反复通知。",extension:"允许退货，并测试库存再次跨越阈值时的行为。"}),t(83,w,"基础","按不同视图发布报表",{background:"相同展区数据有编码视图与优先视图。",description:"CODE 按编号升序，输出 ID-编号。SCORE 按分数降序，并列保持输入次序，每行输出 编号:分数。",input:"首行 mode n，随后 n 行「编号 分数」。",output:"逐条按视图格式输出，空表无输出。",limits:"0 ≤ n ≤ 200，编号为互异的 1–8 位 ASCII 英数字，分数 0–1000。"},[`SCORE 3
Z 4
A 4
M 8
`,`M:8
Z:4
A:4
`,"两项同分保持 Z 在 A 前。"],[[`CODE 0
`,""],[`CODE 2
Z 8
A 0
`,`ID-A
ID-Z
`],[`SCORE 2
B 0
A 0
`,`B:0
A:0
`]],["让两种视图都提供 key 和 render。","报表生成器接收视图，排序和展示使用它。"],`class CodeView:
    def key(self, row):
        return row[0]

    def render(self, row):
        return "ID-" + row[0]

class ScoreView:
    def key(self, row):
        return -row[1]

    def render(self, row):
        return f"{row[0]}:{row[1]}"

def publish(rows, view):
    for row in sorted(rows, key=view.key):
        print(view.render(row))

mode, n = input().split()
rows = []
for _ in range(int(n)):
    code, score = input().split()
    rows.append((code, int(score)))
publish(rows, CodeView() if mode == "CODE" else ScoreView())
`,{concepts:["兼容接口","方法作为回调","稳定排序"],approach:"把变化的排序和格式集中在同一视图对象。",steps:["保存原输入记录。","选择视图并取得排序键。","用相同视图格式化排序结果。"],time:"最坏 O(n log n)。",space:"O(n)。",pitfall:"给 SCORE 的键加编号会破坏同分原序。",extension:"设计只保留达标行的第三个视图，明确筛选职责。"}),t(84,w,"进阶","切换独立投递通道",{background:"发报服务可切换到 A 或 B 通道，每个通道维护自己的限额与顺序。",description:"初始使用 A。USE 改用指定通道；SEND 如果该通道有空位就记录文本，否则拒绝。切换后仍保留原通道记录。",input:"首行 capA capB q，随后是 USE A 或 B，或 SEND 消息。",output:"每次 SEND 输出 OK 或 FULL。末两行依次输出 A、B 的消息，逗号连接，空写 NONE。",limits:"0 ≤ q ≤ 200，两容量 0–200。消息为 1–10 位英数字。"},[`1 2 6
SEND X
SEND Y
USE B
SEND Z
USE A
SEND Q
`,`OK
FULL
OK
FULL
X
Z
`,"切回 A 后原有的 X 仍占槽位。"],[[`0 0 0
`,`NONE
NONE
`],[`0 1 3
SEND A
USE B
SEND A
`,`FULL
OK
NONE
A
`],[`1 1 4
USE B
SEND X
USE A
SEND X
`,`OK
OK
X
X
`]],["两个通道各自构造，服务保存当前通道的引用。","切换只替换引用，不重建通道。"],`class Channel:
    def __init__(self, capacity):
        self.capacity = capacity
        self.messages = []

    def send(self, message):
        if len(self.messages) == self.capacity:
            return "FULL"
        self.messages.append(message)
        return "OK"

class Sender:
    def __init__(self, channel):
        self.channel = channel

    def send(self, message):
        return self.channel.send(message)

a, b, q = map(int, input().split())
channels = {"A": Channel(a), "B": Channel(b)}
sender = Sender(channels["A"])
for _ in range(q):
    action, value = input().split()
    if action == "USE":
        sender.channel = channels[value]
    else:
        print(sender.send(value))
for channel in channels.values():
    print(",".join(channel.messages) or "NONE")
`,{concepts:["组件替换","状态归属","失败不改状态"],approach:"把各自限额与历史留给通道，服务只负责委托。",steps:["创建两个通道与一个服务。","按命令替换组件或发送。","按原通道顺序核对其实际记录。"],time:"O(q)。",space:"O(q)。",pitfall:"切换时创建新通道会丢失旧限额使用情况。",extension:"添加失败后尝试另一个通道的策略，定义是否改变当前通道。"}),t(85,v,"入门","访客视图与调试视图",{background:"终端需要同时支持简明票号和包含字段名的调试信息。",description:"PRINT 显示 T-编号；DEBUG 显示 Ticket(code=单引号编号)。",input:"首行 q，后续为 PRINT 或 DEBUG 与编号。",output:"逐行显示要求的字符串。",limits:"0 ≤ q ≤ 150，编号为 1–10 位英数字。"},[`2
PRINT Z3
DEBUG Z3
`,`T-Z3
Ticket(code='Z3')
`,"同一个实例类型提供两种表现。"],[[`0
`,""],[`1
PRINT 007
`,`T-007
`],[`1
DEBUG A
`,`Ticket(code='A')
`]],["用 __str__ 与 __repr__ 分别定义格式。","调试信息可用 !r 表示字符串值。"],`class Ticket:
    def __init__(self, code):
        self.code = code

    def __str__(self):
        return "T-" + self.code

    def __repr__(self):
        return f"Ticket(code={self.code!r})"

for _ in range(int(input())):
    kind, code = input().split()
    ticket = Ticket(code)
    print(ticket if kind == "PRINT" else repr(ticket))
`,{concepts:["__str__","__repr__","输出契约"],approach:"格式分别由两种表示方法返回。",steps:["构造同型票据。","按场景触发显示或调试形式。","核对大小写和引号。"],time:"O(q)。",space:"O(1)。",pitfall:"特殊方法需要返回字符串，不能只打印。",extension:"加入数量字段，在两种表示中分别考虑是否展示。"}),t(86,v,"入门","两个读取游标",{background:"两组人独立阅读同一份展品清单。",description:"A、B 各有一个从头开始的游标。每个命令读取相应游标下一项；SIZE 查询项目总数。",input:"首行展品编号列表，可为空。第二行含零到多个命令 A、B、SIZE。",output:"各命令各一行，读完时写 NONE，SIZE 输出初始清单大小。",limits:"每行最多 150 项，编号是 1–8 位英数字。重复项保留。"},[`K M
A A B A SIZE B B
`,`K
M
K
NONE
2
M
NONE
`,"A 已读完时，B 的位置仍独立。"],[[`
A SIZE B
`,`NONE
0
NONE
`],[`X

`,""],[`Z Z
B A B A SIZE
`,`Z
Z
Z
Z
2
`]],["清单的 __iter__ 每次创建新游标。","迭代器结束时抛 StopIteration，由 next 的默认值处理。"],`class Cursor:
    def __init__(self, values):
        self.values = values
        self.index = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.index == len(self.values):
            raise StopIteration
        value = self.values[self.index]
        self.index += 1
        return value

class ListView:
    def __init__(self, values):
        self.values = tuple(values)

    def __iter__(self):
        return Cursor(self.values)

    def __len__(self):
        return len(self.values)

view = ListView(input().split())
readers = {"A": iter(view), "B": iter(view)}
for action in input().split():
    print(len(view) if action == "SIZE" else next(readers[action], "NONE"))
`,{concepts:["独立游标","__next__","__len__"],approach:"数据序列共享，读取位置分别保存。",steps:["把输入制成可重复遍历的容器。","各自创建读取游标。","按命令查询大小或消耗一个位置。"],time:"O(n+q)。",space:"O(n+q)，含两行拆分。",pitfall:"让容器本身存唯一读取位置会令两个读者互相影响。",extension:"添加 RESET A 命令，只为 A 重新创建迭代器。"}),t(87,v,"基础","工单等值与稳定排序",{background:"两份工单可能字段相同但属于不同实例。",description:"所有工单按优先级升序，等优先级保持录入次序。查询同时报告两份工单字段是否全相等、是否同一实例。",input:"首行 n q，后 n 行「编号 优先级」，再 q 行两个录入下标，从 0 开始。",output:"首行空格分隔的排序编号。每个查询一行两个 0 或 1，依次为值相等与身份相同。",limits:"1 ≤ n ≤ 200，0 ≤ q ≤ 200。优先级 0–1000，编号 1–8 位英数字，可重复。"},[`3 3
Z 2
A 1
Z 2
0 2
0 0
1 2
`,`A Z Z
1 0
1 1
0 0
`,"首尾工单等值且身份不同。"],[[`1 0
Q 0
`,`Q
`],[`2 1
B 0
A 0
0 1
`,`B A
0 0
`],[`2 1
A 2
A 1
0 1
`,`A A
0 0
`]],["用 priority 实现小于，用两字段实现等值。","在原输入列表按下标查询。"],`class Job:
    def __init__(self, code, priority):
        self.code = code
        self.priority = priority

    def __lt__(self, other):
        if not isinstance(other, Job):
            return NotImplemented
        return self.priority < other.priority

    def __eq__(self, other):
        if not isinstance(other, Job):
            return NotImplemented
        return (self.code, self.priority) == (other.code, other.priority)

n, q = map(int, input().split())
jobs = []
for _ in range(n):
    code, priority = input().split()
    jobs.append(Job(code, int(priority)))
print(" ".join(job.code for job in sorted(jobs)))
for _ in range(q):
    a, b = map(int, input().split())
    print(int(jobs[a] == jobs[b]), int(jobs[a] is jobs[b]))
`,{concepts:["值相等","身份","稳定排序"],approach:"从排序和等值的业务定义分别建立方法。",steps:["逐行构造独立对象。","生成排序副本。","用原下标查询两个独立布尔值。"],time:"O(n log n+q)。",space:"O(n)。",pitfall:"原地排序会让后续下标指向错误对象。",extension:"用同一字段元组定义一致的全序，讨论为何并列会改变。"}),t(88,v,"进阶","批次标签的独立副本",{background:"批次可由另一份批次的当前标签创建草稿，之后各自编辑。",description:"NEW 建空批次；TAG 追加标签；CLONE 创建同标签的新批次；ASK 查看当前标签。",input:"首行 q，随后为 NEW 编号、TAG 编号 标签、CLONE 新编号 旧编号或 ASK 编号。",output:"仅对 ASK 输出标签，逗号分隔，空为 NONE。",limits:"0 ≤ q ≤ 100，编号与标签为 1–8 位英数字。输入只访问已创建项，NEW 和 CLONE 的新编号未注册。"},[`8
NEW A
NEW B
TAG A X
CLONE C A
TAG C Y
ASK A
ASK B
ASK C
`,`X
NONE
X,Y
`,"默认空列表与复制得到的列表均独立。"],[[`0
`,""],[`4
NEW A
CLONE B A
TAG A X
ASK B
`,`NONE
`],[`5
NEW X
TAG X R
TAG X R
CLONE Y X
ASK Y
`,`R,R
`]],["默认可变字段用 default_factory。","复制已有批次时取它标签的浅副本。"],`from dataclasses import dataclass, field

@dataclass
class Batch:
    code: str
    tags: list[str] = field(default_factory=list)

batches = {}
for _ in range(int(input())):
    action, code, *value = input().split()
    if action == "NEW":
        batches[code] = Batch(code)
    elif action == "TAG":
        batches[code].tags.append(value[0])
    elif action == "CLONE":
        batches[code] = Batch(code, batches[value[0]].tags.copy())
    else:
        print(",".join(batches[code].tags) or "NONE")
`,{concepts:["数据类","默认工厂","复制与引用"],approach:"两条创建路径都分配自己的列表，复制保留顺序和重复。",steps:["用数据类表示字段。","构造时走工厂或显式复制。","打印各批次真实状态。"],time:"O(q+s)，s 为复制和输出的条目数。",space:"O(q+c)，c 为复制保存的总条目。",pitfall:"CLONE 传旧列表本身会共享后续修改。",extension:"为包含可变元数据的标签设计清晰的深拷贝规则。"})],T=b[6],Pe=[t(89,T,"入门","馆藏的唯一登记",{background:"登记完成的馆藏可能下架，下架编号可以重新使用。",description:"重号登记拒绝且保留旧标题。下架只移除指定编号。下架后查询不到旧记录，重新登记后应显示新标题。",input:"首行 q。后 q 行为 ADD 编号 标题、ASK 编号或 REMOVE 编号。",output:"ADD 输出 OK 或 DUP，ASK 输出标题或 NA，REMOVE 存在时输出 OK，否则输出 NA。",limits:"0 ≤ q ≤ 300，编号与标题为 1–10 位英数字。"},[`8
ADD T Map
ADD T Atlas
REMOVE T
ASK T
REMOVE T
ADD T Atlas
ASK T
ASK S
`,`OK
DUP
OK
NA
NA
OK
Atlas
NA
`,"重号失败后仍可下架原记录。清空索引中的 T 后，T 可以重新登记。"],[[`0
`,""],[`2
ADD A A
ASK A
`,`OK
A
`],[`3
ADD 00 X
ASK 0
ASK 00
`,`OK
NA
X
`],[`6
ADD A Map
ADD B Map
REMOVE A
ASK A
ASK B
REMOVE B
`,`OK
OK
OK
NA
Map
OK
`]],["把书件记录和馆藏索引分开。","登记前先检查编号。"],`from dataclasses import dataclass

@dataclass
class Record:
    code: str
    title: str

class Catalog:
    def __init__(self):
        self._items = {}

    def add(self, record):
        if record.code in self._items:
            return "DUP"
        self._items[record.code] = record
        return "OK"

    def title(self, code):
        item = self._items.get(code)
        return "NA" if item is None else item.title

    def remove(self, code):
        return "NA" if self._items.pop(code, None) is None else "OK"

catalog = Catalog()
for _ in range(int(input())):
    action, code, *titles = input().split()
    if action == "ADD":
        print(catalog.add(Record(code, titles[0])))
    elif action == "REMOVE":
        print(catalog.remove(code))
    else:
        print(catalog.title(code))
`,{concepts:["状态归属","字典索引","唯一性"],approach:"记录只保存字段，馆藏决定是否允许新增。",steps:["从输入明确动作。","新增前先查重，下架只删除指定键。","用查找结果显示标题，验证下架后的编号可以复用。"],time:"平均 O(q)。",space:"O(q)。",pitfall:"标题相同仍可登记成多个编号。",extension:"为下架事件保留单独历史，允许按旧编号检索所有曾登记的标题。"}),t(90,T,"入门","预约队列的撤销与出队",{background:"预约名单先到先服务。用户取消后重新预约需要排到末尾。",description:"JOIN 已有用户时输出 DUP，否则加入并输出 OK。CANCEL 仅移除指定用户，存在输出 OK，否则 NA。NEXT 移除并输出队首，空时输出 NONE。",input:"首行 q。后 q 行为 JOIN 用户、CANCEL 用户或 NEXT。",output:"每条命令输出一行。",limits:"0 ≤ q ≤ 200，用户为 1–8 位英数字。"},[`8
JOIN A
JOIN B
CANCEL A
JOIN A
JOIN B
NEXT
NEXT
NEXT
`,`OK
OK
OK
OK
DUP
B
A
NONE
`,"A 取消后重入排到 B 之后。"],[[`0
`,""],[`2
CANCEL Z
NEXT
`,`NA
NONE
`],[`3
JOIN X
NEXT
JOIN X
`,`OK
X
OK
`]],["列表保留顺序。","把去重、移除、取队首集中在预约对象内。"],`class Waitlist:
    def __init__(self):
        self._users = []

    def join(self, user):
        if user in self._users:
            return "DUP"
        self._users.append(user)
        return "OK"

    def cancel(self, user):
        if user not in self._users:
            return "NA"
        self._users.remove(user)
        return "OK"

    def next_user(self):
        return self._users.pop(0) if self._users else "NONE"

waitlist = Waitlist()
for _ in range(int(input())):
    action, *user = input().split()
    if action == "JOIN":
        print(waitlist.join(user[0]))
    elif action == "CANCEL":
        print(waitlist.cancel(user[0]))
    else:
        print(waitlist.next_user())
`,{concepts:["先到先服务","独立状态","队列操作"],approach:"队列控制自己的修改，调用者根据返回值展示。",steps:["进入前检查是否已经排队。","取消时只移除目标。","取队首时处理空队列。"],time:"最坏 O(q²)，成员检查和列表出队会扫描或移动。",space:"O(q)。",pitfall:"使用集合代替队列会丢掉顺序。",extension:"增大队列规模后比较其他数据结构的代价。"}),t(91,T,"基础","双柜台借用和回收",{background:"两台设备柜分别有可借容量，归还只流回原柜类别。",description:"TAKE 柜台：有可借则扣一。BACK 柜台：已借出至少一件才可归还一件。ASK 查看两柜可借量。",input:"首行 capA capB q。随后 q 行为 TAKE A 或 B、BACK A 或 B、或 ASK。",output:"借还成功输出 OK，失败输出 NO。ASK 输出 A、B 当前可用量。",limits:"0 ≤ q ≤ 200，容量 0–1000。每柜从全部可用开始。"},[`1 2 6
TAKE A
TAKE A
BACK B
TAKE B
BACK A
ASK
`,`OK
NO
NO
OK
OK
1 1
`,"失败的归还不应让 B 超容量。"],[[`0 0 1
ASK
`,`0 0
`],[`1 1 0
`,""],[`1 1 4
TAKE B
ASK
BACK B
ASK
`,`OK
1 0
OK
1 1
`]],["每柜独立保存容量与可借量。","用同一对象接口判断借出和归还。"],`class Counter:
    def __init__(self, capacity):
        self._capacity = capacity
        self.available = capacity

    def change(self, delta):
        candidate = self.available + delta
        if not 0 <= candidate <= self._capacity:
            return "NO"
        self.available = candidate
        return "OK"

a, b, q = map(int, input().split())
desks = {"A": Counter(a), "B": Counter(b)}
for _ in range(q):
    action, *key = input().split()
    if action == "ASK":
        print(desks["A"].available, desks["B"].available)
    else:
        print(desks[key[0]].change(-1 if action == "TAKE" else 1))
`,{concepts:["多实例","分类容量","失败原值"],approach:"每个容量类别是一份独立对象，边界集中在同一个方法。",steps:["从容量构造各柜。","按指令改变指定柜。","在失败与成功后都能查询。"],time:"O(q)。",space:"O(1)。",pitfall:"归还时只检查当前值非负会放过超容量。",extension:"按借用人的身份记录借还关系，拒绝归还他人借件。"},{kind:"adapted",platform:"LeetCode",title:"Design Parking System",id:"1603",level:"Easy",url:"https://leetcode.com/problems/design-parking-system/",concepts:["分类型容量","持续变更状态"],adaptation:"改成两个设备柜及标准输入，加入逆向归还、失败保持状态和可用量查询。"}),t(92,T,"进阶","单件设备的预约优先",{background:"共享器材有当前借用人和待借队列。设备归还后按队首顺序获得优先权。",description:"QUEUE 将用户加入尾部，已借用者或早已在队列里的用户输出 DUP。BORROW 先判设备被借出（BUSY），再判非队首（WAIT），其余成功借出且移除匹配队首。RETURN 仅允许当前借用者归还。SHOW 查询。",input:"首行 q，随后 q 行为 QUEUE 用户、BORROW 用户、RETURN 用户或 SHOW。",output:"每条输出一行。成功为 OK，归还身份错误为 DENIED，其他失败按描述。SHOW 输出「借用者 排队列表」，空字段用 -，列表用逗号连接。",limits:"0 ≤ q ≤ 300，用户为 1–8 位 ASCII 英数字。初始空闲、无人排队，归还不自动借给队首。按命令顺序模拟，每次 SHOW 计 max(1, 当时排队人数)，所有 SHOW 合计不超过 6980。每条命令最多 9 字节固定开销，每个计数单位再预留 9 字节，总输出不超过 65520 字节。"},[`11
QUEUE A
QUEUE B
BORROW B
BORROW A
QUEUE A
RETURN B
SHOW
RETURN A
BORROW C
BORROW B
SHOW
`,`OK
OK
WAIT
OK
DUP
DENIED
A B
OK
WAIT
OK
B -
`,"B 插队失败，A 借到后才从队列删除。"],[[`0
`,""],[`4
SHOW
RETURN X
BORROW X
SHOW
`,`- -
DENIED
OK
X -
`],[`7
BORROW A
QUEUE B
QUEUE B
BORROW B
RETURN A
SHOW
BORROW B
`,`OK
OK
DUP
BUSY
OK
- B
OK
`],[`5
QUEUE A
QUEUE B
QUEUE C
BORROW B
SHOW
`,`OK
OK
OK
WAIT
- A,B,C
`],[`11
QUEUE A
QUEUE B
BORROW B
SHOW
SHOW
BORROW A
RETURN B
SHOW
SHOW
RETURN A
SHOW
`,`OK
OK
WAIT
- A,B
- A,B
OK
DENIED
A B
A B
OK
- B
`],[K.input,K.output]],["先列出每个动作读写哪些状态。","借出时等所有检查通过再变更借用者与队列。"],`class Equipment:
    def __init__(self):
        self._borrower = None
        self._queue = []

    def hold(self, user):
        if self._borrower == user or user in self._queue:
            return "DUP"
        self._queue.append(user)
        return "OK"

    def borrow(self, user):
        if self._borrower is not None:
            return "BUSY"
        if self._queue and self._queue[0] != user:
            return "WAIT"
        self._borrower = user
        if self._queue:
            self._queue.pop(0)
        return "OK"

    def give_back(self, user):
        if self._borrower != user:
            return "DENIED"
        self._borrower = None
        return "OK"

    def show(self):
        return (self._borrower or "-") + " " + (",".join(self._queue) or "-")

item = Equipment()
actions = {"QUEUE": item.hold, "BORROW": item.borrow, "RETURN": item.give_back, "SHOW": item.show}
for _ in range(int(input())):
    command, *args = input().split()
    print(actions[command](*args))
`,{concepts:["状态机","预约顺序","职责拆分"],approach:"通过同一对象方法维持借阅者和预约列表之间的一致性。",steps:["对预约和借用分别检查前置条件。","只在成功借出时消费队首。","保留查询用于核对失败后的真实状态。"],time:"最坏 O(q²)，包含成员检查、移动和打印队列。",space:"O(q)。",pitfall:"归还应只清空借用者。预约队列继续控制下一次借用。",extension:"将单件设备组合进带多件索引的管理器，添加不同角色的借用上限。"})];function k(a,p,c,m,d,A,_,O,E,D,q){const[W,...M]=_.map(([F,j])=>["","",{note:F,calls:[{args:[],expected:!0}],fixtures:[{name:"interface_check.py",content:A+`

def check():
    try:
`+j.split(`
`).map(Z=>"        "+Z).join(`
`)+`
    except AssertionError:
        return False
    return True
`}]}]);return{id:a,tag:p,title:c,difficulty:m,...d,sample:["","",_[0][0],W[2]],cases:M,hints:D,guide:q,solution:E,origin:{kind:"original"},contract:{kind:"function",files:["main.py"],target:{module:"interface_check",name:"check"}},starterFiles:[{name:"main.py",content:O}]}}const Ue=[k("A093",i[3],"两个计数器的交错调用","基础",{background:"两个记录器独立累计读数，同一个记录器交给两个调用方时应看到同一份累计值。",description:"实现工厂 make_counter(start)，返回内部函数 step(delta)。每次调用先把 delta 加到本计数器，再返回累计值。评测会交错调用多个计数器，并通过变量别名再次调用同一个计数器。",input:"评测导入 main.py，调用 make_counter(start)，再调用返回的函数。",output:"step 返回 int。整个模块不读写标准输入输出。",limits:"start、delta 均为 −10⁶ 至 10⁶ 的整数。返回值必须是具有闭包变量的 Python 函数，可用计数器的 __closure__ 查看。0 是合法增量。"},`from inspect import isfunction
from main import make_counter`,[["起点为 10 和 −4。先读初值，交错增减，并通过别名修改第一个。",`first = make_counter(10)
second = make_counter(-4)
alias = first
assert isfunction(first) and first.__closure__
assert isfunction(second) and second.__closure__
assert first(0) == 10 and second(0) == -4
assert first(3) == 13 and second(-2) == -6
assert alias(-6) == 7 and second(0) == -6 and first(0) == 7`],["从同一个初值新建两次，两个闭包分别累积。第三次创建也使用原初值。",`a, b = make_counter(0), make_counter(0)
assert a(-1) == -1 and b(2) == 2 and a(0) == -1
c = make_counter(0)
assert c is not a and c(0) == 0 and b(0) == 2`],["覆盖正负边界和多次归零。",`a = make_counter(-1_000_000)
alias = a
assert a(1_000_000) == 0
assert alias(1_000_000) == 1_000_000
assert a(-1_000_000) == 0`],["在第一个计数器使用后再创建第二个，工厂不得重置旧实例。",`a = make_counter(5)
assert a(-5) == 0
b = make_counter(5)
assert b(0) == 5 and a(0) == 0
assert a(1) == 1 and b(0) == 5`]],`def make_counter(start):
    # 返回可重复调用的函数
    pass
`,`def make_counter(start):
    total = start

    def step(delta):
        nonlocal total
        total += delta
        return total

    return step
`,["把 total 定义在工厂的一次调用里。","step 用 nonlocal 更新外层的 total。工厂返回 step 本身。"],{concepts:["闭包","nonlocal","别名","状态隔离"],approach:"每次工厂调用创建自己的绑定。两个变量引用同一个 step 时，它们操作同一个绑定。",steps:["把起点绑定到 total。","创建内层函数并声明 nonlocal total。","每次调用先改绑定再返回，创建工厂时只返回函数。"],time:"在题目整数范围内，构造和单次更新均 O(1)。",space:"每个计数器 O(1)。",pitfall:"把 total 放在模块顶层会让独立构造相互影响。返回 step() 会执行函数，应该返回 step。",extension:"同一工厂再返回一个 reset，让两个内部函数共同维护该工厂的状态。"}),k("A094",i[4],"可替换业务的审计装饰器","进阶",{background:"不同业务共用一条审计规则。审计函数由调用方传给装饰器，测试也会传入不同签名的业务函数。",description:'实现 audit(record, allowed)，返回装饰器。包装后的函数先 record("start")，再调用 allowed，并原样传入所有参数。若返回假值，记录 "denied" 并返回 None，跳过业务。若放行，调用业务一次，成功则记录 "ok" 并返回业务的原返回值。若业务抛出 Exception，记录 "error" 后重抛同一异常对象。',input:"导入 main.audit，评测调用 audit(record, allowed)(func) 或等价的 @ 语法。",output:"通过 record 回调记录。调用发生在包装后的函数被执行时，导入和装饰时不能读写标准输入输出，也不能调用 record、allowed 或业务。",limits:"record 接收一个字符串并正常返回。allowed 接受与业务相同的参数并返回 bool，不抛异常。业务可能返回任意对象或抛出 Exception 子类。"},"from main import audit",[["验证参数原样转发、返回对象身份、日志和业务调用顺序。",`events = []
token = object()
def allowed(value, *, factor):
    events.append(("allowed", value, factor))
    return True
def transform(value, *, factor):
    events.append(("business", value, factor))
    return token
wrapped = audit(events.append, allowed)(transform)
assert events == []
assert wrapped(7, factor=3) is token
assert events == ["start", ("allowed", 7, 3), ("business", 7, 3), "ok"]`],["拒绝路径复用同一个装饰器装饰不同业务，每次只记录开始、检查和拒绝。",`events = []
def allowed(*args, **kwargs):
    events.append((args, kwargs))
    return False
def first(*args, **kwargs):
    raise AssertionError("denied call ran")
def second(*args, **kwargs):
    raise AssertionError("another denied call ran")
decorate = audit(events.append, allowed)
assert decorate(first)(-3, name="A") is None
assert decorate(second)(name="B") is None
assert events == ["start", ((-3,), {"name": "A"}), "denied", "start", ((), {"name": "B"}), "denied"]`],["异常路径传播原对象。随后还能正常调用另一业务，保留合法的假值返回。",`events = []
error = ValueError("broken")
def failing(*, name):
    events.append(name)
    raise error
decorate = audit(events.append, lambda **kwargs: True)
try:
    decorate(failing)(name="work")
except ValueError as caught:
    assert caught is error
else:
    raise AssertionError("lost exception")
second_error = LookupError("another error")
def failing_again(**kwargs):
    raise second_error
try:
    decorate(failing_again)(name="next")
except LookupError as caught:
    assert caught is second_error
else:
    raise AssertionError("lost lookup error")
assert decorate(lambda **kwargs: 0)(name="other") == 0
assert events == ["start", "work", "error", "start", "error", "start", "ok"]`],["空签名的业务在每次调用时重新检查，业务合法返回 None。",`events = []
def allowed():
    events.append("allowed")
    return events.count("allowed") == 1
@audit(events.append, allowed)
def work():
    events.append("work")
assert work() is None and work() is None
assert events == ["start", "allowed", "work", "ok", "start", "allowed", "denied"]`]],`def audit(record, allowed):
    # 返回接收业务函数的装饰器
    pass
`,`from functools import wraps

def audit(record, allowed):
    def decorate(func):
        @wraps(func)
        def wrapped(*args, **kwargs):
            record("start")
            if not allowed(*args, **kwargs):
                record("denied")
                return None
            try:
                result = func(*args, **kwargs)
            except Exception:
                record("error")
                raise
            record("ok")
            return result
        return wrapped
    return decorate
`,["先画出检查、拒绝、成功和异常的顺序。区分工厂、装饰器、包装函数三个调用时机。","对检查与业务分别展开 *args、**kwargs。只把业务调用放进 try，用裸 raise 保留原异常。"],{concepts:["装饰器工厂","参数转发","异常传播","可观察顺序"],approach:"前两层捕获回调和业务。所有日志出现在最内层，每条路径有自己对应的结束标记。",steps:["定义并返回接收 func 的 decorate。","执行时记录 start 并检查，拒绝立即返回。","成功保留返回对象，异常记录后原样抛出。"],time:"除回调与业务自身成本外，转发 k 个实参需要 O(k)。",space:"转发参数 O(k)。",pitfall:"异常路径 return 会吞掉异常。if result 会把正常的 0 当成失败。",extension:"另加一个接受异常类型清单的包装器，写出两个装饰器交换顺序时的日志差异。"}),k("A095",i[5],"测量分枝路径并记录下降与返回","基础",{background:"每级支架的深度取决于最深的一条分支。校核员还需要知道每个子问题何时进入、何时得到结果。",description:"实现 measure(tree, emit)。空节点 None 和空列表的高度为 0。非空列表的高度是 1 加所有孩子高度的最大值。请在函数上方写两行注释，说明哪些节点会直接结束，以及访问孩子如何缩小问题。",input:"tree 由 None 或列表构成，列表的孩子也是这种节点。导入 main.measure 后直接调用。emit 是接受一个元组的回调。",output:'返回整数高度。从左到右访问。进入时 emit(("enter", path))，返回前 emit(("exit", path, height))。根路径 ()，孩子路径是在父路径尾部加上从 0 起的下标。空节点也记录进入和返回。',limits:"最多 100 个节点，深度不超过 25。自动评测对比回调轨迹与返回值。能生成相同轨迹的栈实现也可能通过。递归实现与终止条件解释由学员自查。"},"from main import measure",[["左右分支、空列表和 None。右树的返回值决定根的高度。",`events = []
assert measure([None, [[]]], events.append) == 2
assert events == [
    ("enter", ()), ("enter", (0,)), ("exit", (0,), 0),
    ("enter", (1,)), ("enter", (1, 0)), ("exit", (1, 0), 0),
    ("exit", (1,), 1), ("exit", (), 2),
]`],["两种空根分别进入一次并返回 0。",`for tree in (None, []):
    events = []
    assert measure(tree, events.append) == 0
    assert events == [("enter", ()), ("exit", (), 0)]`],["8 层单分支，所有进入发生在返回之前。",`tree = None
for _ in range(8):
    tree = [tree]
events = []
assert measure(tree, events.append) == 8
assert events == [("enter", (0,) * i) for i in range(9)] + [
    ("exit", (0,) * i, 8 - i) for i in range(8, -1, -1)
]`],["三个同级孩子，最大值在左边，不能返回最后一支的高度或把高度相加。",`events = []
assert measure([[None], [None], []], events.append) == 2
assert events == [
    ("enter", ()), ("enter", (0,)), ("enter", (0, 0)), ("exit", (0, 0), 0), ("exit", (0,), 1),
    ("enter", (1,)), ("enter", (1, 0)), ("exit", (1, 0), 0), ("exit", (1,), 1),
    ("enter", (2,)), ("exit", (2,), 0), ("exit", (), 2),
]`]],`def measure(tree, emit):
    pass
`,`def measure(tree, emit):
    def visit(node, path):
        emit(("enter", path))
        height = 0
        if node is not None and node:
            tallest = 0
            for index, child in enumerate(node):
                child_height = visit(child, path + (index,))
                tallest = max(tallest, child_height)
            height = 1 + tallest
        emit(("exit", path, height))
        return height

    return visit(tree, ())
`,["先写 None 和 [] 的返回值，画出 [None] 为什么刚好比它高 1。","每个孩子只访问一次。访问后更新本层最大值，退出事件使用本层最后的高度。"],{concepts:["终止条件","子问题","进入与返回","树高"],approach:"归纳每个节点的高度。父节点等所有孩子返回后才知道自己的结果。",steps:["建立负责节点和路径的辅助函数。","进入后处理空节点或逐个调用孩子。","记录退出值并将同一个值返回给父节点。"],time:"n 个节点、最大深度 h，路径元组复制使时间上界为 O(n(h+1))。",space:"递归活跃路径合计 O((h+1)²)，另计调用方保留的日志。",pitfall:"空列表与 None 都有一对事件。若先退出再递归，会破坏返回顺序。",extension:"把返回值改成高度与叶子数的二元组，写出每种空节点在新规则下的含义。"}),k("A096",b[4],"共享扣减流程与可替换策略","进阶",{background:"普通配额和计量配额共用扣减流程。某些场地可以动态更换准入策略。",description:"实现 Quota(balance, policy) 和它的子类 MeteredQuota。两类都用同一 Quota.spend 方法。Quota.cost(units) 返回 units，MeteredQuota.cost(units) 返回 units 的两倍。用 replace_policy(policy) 替换当前实例的策略。spend(units) 在正整数输入且余额够时，让策略检查 policy(cost, balance)，放行才扣减并返回 True。其它情况返回 False，余额维持原值。",input:"评测会从 main.py 导入两类，直接构造不同对象、替换策略并调用 spend，读取公开的 balance。",output:"cost 返回 int，spend 返回 bool。replace_policy 不需返回结果。导入和方法调用不读写标准输入输出。",limits:"初始 balance 为 0–1000。units 为 −1000 至 1000 的整数。无效或余额不足时不调用策略。MeteredQuota 必须继承 Quota.spend 而不重写。"},"from main import Quota, MeteredQuota",[["验证子类关系、共享方法、倍数价格，以及失败后的余额和策略替换。",`assert issubclass(MeteredQuota, Quota) and MeteredQuota.spend is Quota.spend
events = []
def deny(cost, balance):
    events.append((cost, balance))
    return False
a = MeteredQuota(10, deny)
b = Quota(7, lambda cost, balance: True)
assert a.spend(3) is False and a.balance == 10 and events == [(6, 10)]
a.replace_policy(lambda cost, balance: cost == 6)
assert a.spend(3) is True and a.balance == 4
assert b.spend(3) is True and b.balance == 4
assert a.spend(3) is False and a.balance == 4`],["无效请求或余额不足时不执行策略，恰好扣完合法。",`def unexpected(*args):
    raise AssertionError("policy called before validation")
a = Quota(4, unexpected)
assert a.spend(0) is False and a.spend(-3) is False and a.spend(5) is False
assert a.balance == 4
a.replace_policy(lambda cost, balance: cost == balance)
assert a.spend(4) is True and a.balance == 0
assert a.spend(1) is False and a.balance == 0`],["两个计量对象独立更换策略，并由父类计算扣减。",`a = MeteredQuota(8, lambda cost, balance: True)
b = MeteredQuota(8, lambda cost, balance: True)
assert a.cost(3) == 6
a.replace_policy(lambda cost, balance: False)
assert a.spend(2) is False and a.balance == 8
assert b.spend(2) is True and b.balance == 4`],["评测再定义一个子类，父类扣减应能调用注入的新计价。",`class FlatQuota(Quota):
    def cost(self, units):
        return 1
a = FlatQuota(1, lambda cost, balance: cost == 1)
assert a.spend(1000) is True and a.balance == 0
assert a.spend(1) is False`]],`class Quota:
    pass

class MeteredQuota(Quota):
    pass
`,`class Quota:
    def __init__(self, balance, policy):
        self.balance = balance
        self.replace_policy(policy)

    def replace_policy(self, policy):
        self._policy = policy

    def cost(self, units):
        return units

    def spend(self, units):
        if units <= 0:
            return False
        price = self.cost(units)
        if price > self.balance or not self._policy(price, self.balance):
            return False
        self.balance -= price
        return True

class MeteredQuota(Quota):
    def cost(self, units):
        return 2 * units
`,["列出所有拒绝情形，扣减只能出现在它们之后。","在父类调用 self.cost，Python 会按实际实例找方法。把策略存在实例字段。"],{concepts:["子类","方法重写","组合","失败原子性"],approach:"父类控制验证和扣减顺序，子类只改变计价，互相独立的实例各自引用策略。",steps:["在实例保存余额和策略。","实现父类扣减入口，使用 self.cost。","在子类重写单项计价并进行交错测试。"],time:"单次扣减 O(1)，另计策略函数自身的成本。",space:"每个实例 O(1)。",pitfall:"先扣再检查会改变拒绝时的余额。策略若保存在类上，替换就可能影响其他实例。",extension:"加一个按最低保留额拒绝的策略，比较两类实例在相同余额时的差异。"}),k("A097",b[5],"工单的显示协议与独立标签","基础",{background:"工单界面需要简短的名称，排查错误则需要显示构造参数。每个工单能独立维护标签。",description:"实现 Ticket(code, title)，公开 code、title、tags 和 add_tag(tag)。str(ticket) 为「编号 | 标题」。repr(ticket) 为「Ticket(code=编号的 repr, title=标题的 repr)」。标签只影响本实例，按插入顺序保留，允许重复。",input:"评测导入 main.Ticket，构造多个对象。会直接调用 str、repr 和 add_tag，并查看公开的 tags。",output:"str 与 repr 返回字符串，add_tag 更新 tags。导入和调用均不打印。",limits:"code、title 和 tag 是长度 1–40 的字符串，可能含空格、引号或反斜杠。初始化时每张工单的 tags 是独立的空列表。可用普通类或数据类。"},"from main import Ticket",[["显示含空格和引号的标题，确认调试格式使用 Python 的 repr。",`a = Ticket("X01", "Lee's map")
assert (a.code, a.title) == ("X01", "Lee's map")
assert str(a) == "X01 | Lee's map"
assert repr(a) == f"Ticket(code={a.code!r}, title={a.title!r})"`],["同值对象的标签互不影响，保留顺序及重复。",`a = Ticket("A", "same")
b = Ticket("A", "same")
assert a.tags == b.tags == [] and a.tags is not b.tags
a.add_tag("x")
a.add_tag("x")
b.add_tag("y")
assert a.tags == ["x", "x"] and b.tags == ["y"]
assert Ticket("A", "same").tags == []
assert str(a) == "A | same" and repr(b) == "Ticket(code='A', title='same')"`],["字符串转义由 repr 处理，测试双引号和反斜杠。",`code, title = 'A"B', 'a\\\\b'
a = Ticket(code, title)
assert str(a) == f"{code} | {title}"
assert repr(a) == f"Ticket(code={code!r}, title={title!r})"`],["标签包含空格与反斜杠，追加应保留原值。",`a, b = Ticket("1", "draft"), Ticket("2", "draft")
a.add_tag("first item")
b.add_tag(chr(92))
assert a.tags == ["first item"] and b.tags == [chr(92)]
assert str(a) == "1 | draft"`]],`class Ticket:
    pass
`,`from dataclasses import dataclass, field

@dataclass
class Ticket:
    code: str
    title: str
    tags: list[str] = field(default_factory=list, init=False, repr=False)

    def add_tag(self, tag):
        self.tags.append(tag)

    def __str__(self):
        return f"{self.code} | {self.title}"
`,["先对照 str 和 repr 的约定，用带引号的标题检查格式。","数据类字段用 field(default_factory=list, init=False, repr=False) 可控制创建、构造参数和调试显示。"],{concepts:["__str__","__repr__","默认工厂","实例列表"],approach:"数据类按字段自动构造并生成 repr。展示字符串单独实现，标签只用于实例状态。",steps:["定义 code 和 title 字段。","给 tags 一个可重复调用的默认工厂，并从初始化参数、repr 中省略它。","实现追加和 __str__。用不同实例验证引用。"],time:"文本表示 O(输入字符串长度)，追加均摊 O(1)。",space:"每个实例的保存空间与标签数和字符串长度成正比。",pitfall:"把 tags 写成类属性会让实例共享。手写 repr 时直接拼接字段会漏掉引号与转义。",extension:"增加移除最后一个标签的方法，并保证空列表时返回明确结果。"})],H=t(98,o[4],"基础","撤回后的活动编号清单",{background:"签到系统收到重复的录入、撤回与核验请求。需要维护当前有效的数字编号。",description:"ADD 把编号加入当前清单，重复加入没有额外效果。DROP 从当前清单撤回编号，不存在时忽略。HAS 查询当前是否有效。最后输出升序的唯一有效编号。",input:"首行 q。接下来 q 行为 ADD id、DROP id 或 HAS id。",output:"对每条 HAS 输出 YES 或 NO。最后输出空格连接的升序编号，空清单输出 EMPTY。",limits:"0 ≤ q ≤ 1000，0 ≤ id ≤ 1000000。"},[`9
ADD 8
ADD 2
ADD 8
DROP 2
HAS 2
ADD 10
ADD 2
HAS 2
HAS 1
`,`NO
YES
NO
2 8 10
`,"先撤回 2，再重新加入。最后按数值排序。"],[[`0
`,`EMPTY
`],[`3
DROP 0
ADD 0
DROP 0
`,`EMPTY
`],[`6
ADD 1000000
HAS 1000000
DROP 5
ADD 0
ADD 3
HAS 3
`,`YES
YES
0 3 1000000
`]],["用同一种结构处理成员查询与去重。撤回不存在的成员也应继续运行。","事件处理结束后才排序。先转成整数，再排序。"],`active = set()
for _ in range(int(input())):
    action, field = input().split()
    code = int(field)
    if action == "ADD":
        active.add(code)
    elif action == "DROP":
        active.discard(code)
    else:
        print("YES" if code in active else "NO")
print(" ".join(map(str, sorted(active))) or "EMPTY")
`,{concepts:["集合","成员判断","去重与排序"],approach:"集合只记录当前有效编号，按命令顺序变化。排序生成最终报告。",steps:["解析编号为整数。","对集合执行添加、撤回或查询。","排序当前集合并输出。"],time:"平均 O(q+k log k)，k 为最终有效编号数。",space:"O(q) 最坏。",pitfall:"字符串排序会把 10 放在 2 前面。remove 会在撤回不存在的成员时报错。",extension:"增加缀有时间戳的撤回记录，比较保存事件列表与仅保存当前集合的差异。"},{kind:"adapted",platform:"洛谷",title:"明明的随机数",id:"P1059",level:"入门",url:"https://www.luogu.com.cn/problem/P1059",concepts:["唯一整数","升序输出"],adaptation:"保留去重和整数升序。把一次性输入改成可撤回、可重加、可在线查询的签到记录。"}),V=t(99,l[3],"进阶","可改票的推荐榜",{background:"评委账号只有最后一条选择生效，最终统计并列第一的展区。",description:"按账号只保留最后一条提交。展区名统一转小写。若最新选择为 -，该账号弃权。输出所有最高票展区。",input:"首行 n，随后 n 行「账号 展区」或「账号 -」。",output:"无有效票输出 NONE。有票时每个并列最高展区各一行「小写展区 得票数」，按展区名升序输出。",limits:"0 ≤ n ≤ 1000，账号是 1–10 位 ASCII 英数字，区分大小写。展区为 1–12 位 ASCII 字母。"},[`7
A North
B SOUTH
A south
B -
C EAST
D east
E SOUTH
`,`east 2
south 2
`,"A 改投 south，B 弃权。C 和 D 的选择归一化后同属 east。"],[[`0
`,`NONE
`],[`3
A X
A -
B -
`,`NONE
`],[`7
X A
x a
Y Z
Y b
Z B
Z -
T z
`,`a 2
`]],["先用一次解包把每个账号的最后选择装入字典。","用生成器把最终选择归一化并跳过弃权，再统计频次及筛选最高值。"],`n = int(input())
latest = {account: choice for account, choice in (input().split() for _ in range(n))}
counts = {}
for choice in (choice.lower() for choice in latest.values() if choice != "-"):
    counts[choice] = counts.get(choice, 0) + 1
best = max(counts.values(), default=0)
winners = sorted((choice, count) for choice, count in counts.items() if count == best)
for choice, count in winners:
    print(choice, count)
if not winners:
    print("NONE")
`,{concepts:["解包","字典推导式","生成器表达式","并列频次"],approach:"最新选择与频次分别使用两个映射。归一化在最后选择确定后进行，弃权不会恢复旧票。",steps:["解包每次提交，让后值覆盖账号的旧选择。","生成有效小写名称并计数。","找到最高值，筛选、排序后输出。"],time:"平均 O(n + k log k)，k 为并列第一数。",space:"O(n)。",pitfall:"先过滤弃权会错误保留该账号的旧票。对账号做小写会合并大小写不同的账号。",extension:"加入最低票数门槛，并验证所有选择已撤回时的输出。"},{kind:"adapted",platform:"AtCoder",title:"Poll",id:"ABC155 C",level:"C",url:"https://atcoder.jp/contests/abc155/tasks/abc155_c?lang=en",concepts:["频次统计","并列最高","字典序"],adaptation:"保留所有并列最高者的字典序输出。新增账号改票、弃权、展区大小写归一化和票数列。"}),Y=t(100,i[3],"进阶","独立房间的名称分配器",{background:"两个房间分别分配公开名称。用户可以直接申请带数字的名称，自动生成的名称也必须避开这些占用。",description:"房间按命令初始化为空。申请名称未使用时原样分配，否则从 1 起追加最小可用正整数后缀。后缀直接连在完整请求名后，分配后永久占用。",input:"首行 q，接下来 q 行「房间 请求名」。房间为 A 或 B。",output:"每次申请输出一行实际分配名。对已有后缀的请求也按完整字符串寻找新后缀。",limits:"0 ≤ q ≤ 2000，请求名由 1–10 位小写 ASCII 字母或数字组成。试用函数工厂生成两个分配器。自动评测核对分配行为。"},[`8
A pin1
A pin
B pin
A pin
A pin2
B pin
A pin3
A pin
`,`pin1
pin
pin
pin2
pin21
pin1
pin3
pin4
`,"A 的 pin1 已手动占用，下次分配 pin 时跳到 pin2。B 的占用独立。"],[[`0
`,""],[`4
A 0
A 0
A 01
B 01
`,`0
01
011
01
`],[`6
A t3
A t2
A t
A t
A t
A t
`,`t3
t2
t
t1
t4
t5
`]],["为每个房间记录所有已分配名称。用工厂返回带自己状态的函数。","为每种请求名记住下一个可能后缀。占用只增加，跳过的后缀以后依然不可用。"],`def make_allocator():
    used = set()
    next_suffix = {}

    def allocate(name):
        if name not in used:
            used.add(name)
            return name
        suffix = next_suffix.get(name, 1)
        while name + str(suffix) in used:
            suffix += 1
        assigned = name + str(suffix)
        next_suffix[name] = suffix + 1
        used.add(assigned)
        return assigned

    return allocate

rooms = {room: make_allocator() for room in ("A", "B")}
for _ in range(int(input())):
    room, name = input().split()
    print(rooms[room](name))
`,{concepts:["函数工厂","闭包状态","名称冲突"],approach:"两个工厂实例分别捕获集合与下次起点。一次分配的依据始终是已占用的完整名称。",steps:["名称空闲时直接登记。","冲突时从保存的起点向后查找。","保存下次候选位置，回报分配的新名称。"],time:"哈希平均 O(q+s)，s 为探查候选次数。单个占用名只能命中其若干个数字后缀拆分，题目字符上限下摊还 O(q)。",space:"O(q) 个记录，受题目名字长度约束。",pitfall:"只记录请求名自身的次数会撞到手动占用的名字。两个房间共享 used 会错误跳号。",extension:"增加撤回，再说明为什么游标不能直接沿用永久占用时的设计。"},{kind:"adapted",platform:"Codeforces",title:"Registration System",id:"4C",level:"C",url:"https://codeforces.com/problemset/problem/4/C",concepts:["状态","后缀冲突"],adaptation:"保留原名称冲突后追加最小正整数的规则。增加两个独立房间、允许申请带数字的名称，并统一输出实际分配名。"}),Q=k("A101",b[6],"可归还的分区储物位","进阶",{background:"场馆按 S、M、L 三类管理储物位。领取后可归还，归还的类别由系统登记决定。",description:"实现 Lockers(small, medium, large)、take(user, size)、release(user) 和 available(size)。一个用户最多持有一个储物位，只能使用所请求的类别。归还恢复该用户原先领取的类别。",input:'从 main.py 导入 Lockers，构造多个实例。size 为 "S"、"M" 或 "L"。',output:"take 成功返回 True。没有容量或用户已有位置时返回 False。release 成功返回 True，无持有记录时返回 False。available 返回空位整数。导入与调用时无标准输出或输入。",limits:"每类容量 0–50，user 为 1–15 位 ASCII 英数字。失败后的所有状态保持原样，多个实例的容量与持有记录均独立。"},"from main import Lockers",[["容量用完后失败，引入归还再领取。",`a = Lockers(1, 0, 2)
assert a.take("U1", "S") is True
assert a.take("U2", "S") is False and a.available("S") == 0
assert a.take("U1", "L") is False and a.available("L") == 2
assert a.release("U2") is False and a.available("S") == 0
assert a.release("U1") is True and a.available("S") == 1
assert a.take("U2", "S") is True and a.available("S") == 0`],["同名用户在两个实例可分别领取，不串改容量。",`a, b = Lockers(0, 1, 1), Lockers(0, 1, 1)
assert a.take("U", "M") is True and b.available("M") == 1
assert b.take("U", "L") is True and a.available("L") == 1
assert a.release("U") is True and b.available("L") == 0
assert b.release("U") is True and a.available("M") == 1`],["零容量没有兜底换类，连续归还只成功一次。",`a = Lockers(0, 50, 2)
assert a.take("A", "S") is False and a.available("L") == 2
assert a.take("A", "L") is True
assert a.release("A") is True
assert a.release("A") is False and a.available("L") == 2
assert a.available("S") == 0 and a.available("M") == 50`],["反复归还及再领取，相同用户改用其他类别。",`a = Lockers(1, 1, 1)
assert a.take("A", "S") is True and a.release("A") is True
assert a.take("A", "M") is True and a.take("B", "S") is True
assert a.release("A") is True and a.available("M") == 1
assert a.available("S") == 0 and a.available("L") == 1`]],`class Lockers:
    pass
`,`class Lockers:
    def __init__(self, small, medium, large):
        self._free = {"S": small, "M": medium, "L": large}
        self._allocated = {}

    def available(self, size):
        return self._free[size]

    def take(self, user, size):
        if user in self._allocated or self._free[size] == 0:
            return False
        self._free[size] -= 1
        self._allocated[user] = size
        return True

    def release(self, user):
        size = self._allocated.pop(user, None)
        if size is None:
            return False
        self._free[size] += 1
        return True
`,["一种字典保存每类空位，另一种记录用户持有的类型。","领取先做全部检查。归还应只看现有登记，根据记录恢复正确类别。"],{concepts:["公开对象接口","独立实例","状态一致性"],approach:"以两个实例属性表示空位与发放记录。归还以记录为准，释放和库存更新始终配对。",steps:["构造各实例的两个字典。","领取前验证用户及容量，再执行两次更新。","从登记中删除并恢复原类别。"],time:"每次查询、领取或归还平均 O(1)。",space:"O(u)，u 为当前领取用户数。",pitfall:"先扣容量会在重复领取时损失空位。类上的共享字典会串改其他场馆。",extension:"引入可替换的类别分配策略，但要求归还仍恢复实际分配的类别。"}),Xe=[{...H,practice:{tier:"入门迁移",prerequisites:"完成数据结构进阶。",primary:["集合成员状态"],secondary:["整数排序"]}},{...V,practice:{tier:"综合",prerequisites:"完成推导式与解包。",primary:["解包与映射推导"],secondary:["计数与并列"]}},{...Y,practice:{tier:"综合",prerequisites:"完成函数进阶、作用域与递归。",primary:["工厂与状态隔离"],secondary:["冲突状态"]}},{...Q,origin:{kind:"adapted",platform:"LeetCode",title:"Design Parking System",id:"1603",level:"Easy",url:"https://leetcode.com/problems/design-parking-system/",concepts:["类接口","分类型容量"],adaptation:"保留固定类别与容量接口。改成管理多个储物场馆，加入占用人、归还、公开查询与失败后不变量。"},practice:{tier:"综合",prerequisites:"完成面向对象编程。",primary:["公开类接口","状态隔离"],secondary:["字典与失败分支"]}}],G=`course,students,passed,average,leaders
`,h=(a="")=>({artifacts:[{name:"summary.csv",content:G+a}]}),u={id:"grade-analysis",title:"成绩数据分析",tag:l[3],difficulty:"进阶",background:"教务组收到混合大小写、重复和坏行的成绩导出。需要在纠错后输出确定的课程报告，同时提供可导入的 CSV。",description:"逐行校验并标准化学号、课程号。对同一学号与课程号组合，最后一条合法记录生效。坏行计入拒绝数量，之后继续处理，已有成绩保留。",input:"首行「及格线 n」，其后恰好 n 行。每条合法记录有三个以空白分隔的字段「学号 课程号 分数」，允许行首尾空白。两个编号须为 1–12 位 ASCII 英数字，统一为大写。分数为 1–3 位 ASCII 数字且数值在 0–100，前导零允许。",output:"前三行依次是 REJECTED 坏行数、RECORDS 最终成绩数、STUDENTS 不同有效学号数。再按课程号字典序输出「课程 学生数 及格数 平均分 最高分学号列表」。及格含等于及格线，平均分向下取整。最高分并列者都输出，学号升序，以 | 连接。还需以 UTF-8 写入 summary.csv，表头 course,students,passed,average,leaders。其余每行与控制台课程行对应，使用逗号分隔，LF 换行。没有有效记录也写表头。",limits:"0 ≤ 及格线 ≤ 100，0 ≤ n ≤ 350，每个待校验行至多 80 字符。编号大小写表示同一记录，前导零属于编号本身。所有输出均以指定的 ASCII 分隔符连接。",contract:{kind:"file",files:["main.py"]},starterFiles:[{name:"main.py",content:`import csv

def parse_record(line):
    """返回 (student, course, score)，坏行返回 None。"""
    raise NotImplementedError("先完成一行的验证和转换")

def summarize(latest, threshold):
    """返回按课程排序的五字段报表行。"""
    raise NotImplementedError("实现分组、统计和并列规则")

def main():
    # 读取 n 行，统计拒绝数并保留最后一条合法成绩。
    # 调用 summarize，然后输出同一份报表并写入 CSV。
    raise NotImplementedError("连接各阶段")

if __name__ == "__main__":
    main()
`}],sample:[`60 7
a math 60
B MATH 95
A math 80
c Art 0
X art 101
b math 80
broken
`,`REJECTED 2
RECORDS 3
STUDENTS 3
ART 1 0 0 C
MATH 2 2 80 A|B
`,"A 和 B 在 MATH 最终都是 80，分别占一个学生名额。ART 的零分也是有效记录。",h(`ART,1,0,0,C
MATH,2,2,80,A|B
`)],cases:[[`0 0
`,`REJECTED 0
RECORDS 0
STUDENTS 0
`,h()],[`60 4

X-2 B 5
Y B +7
A B 101
`,`REJECTED 4
RECORDS 0
STUDENTS 0
`,h()],[`50 4
s c 050
s c 102
b c 049
S C 048
`,`REJECTED 1
RECORDS 2
STUDENTS 2
C 2 0 48 B
`,h(`C,2,0,48,B
`)],[`0 4
X zebra 0
X alpha 000
Y zebra 1
X beta 2
`,`REJECTED 0
RECORDS 4
STUDENTS 2
ALPHA 1 1 0 X
BETA 1 1 2 X
ZEBRA 2 2 0 Y
`,h(`ALPHA,1,1,0,X
BETA,1,1,2,X
ZEBRA,2,2,0,Y
`)],[`100 4
A Q 100
A Q 99
B Q 100
C Q 100
`,`REJECTED 0
RECORDS 3
STUDENTS 3
Q 3 2 99 B|C
`,h(`Q,3,2,99,B|C
`)],[`6 4
  07 lab 006  
7 LAB 005
07 lab ６
Q Lab 0000
`,`REJECTED 2
RECORDS 2
STUDENTS 2
LAB 2 1 5 07
`,h(`LAB,2,1,5,07
`)]],hints:["先让 parse_record 只管一行，试试坏编号、全角数字与合法零分。","一份字典负责最新成绩，另一份负责按课程分组。只生成一份报表行，让终端和 CSV 共用。"],solution:`import csv

def parse_record(line):
    fields = line.split()
    if len(fields) != 3:
        return None
    student, course, score_text = fields
    if any(not (1 <= len(code) <= 12 and code.isascii() and code.isalnum())
           for code in (student, course)):
        return None
    if not (1 <= len(score_text) <= 3 and score_text.isascii() and score_text.isdecimal()):
        return None
    score = int(score_text)
    if score > 100:
        return None
    return student.upper(), course.upper(), score

def summarize(latest, threshold):
    by_course = {}
    for (student, course), score in latest.items():
        by_course.setdefault(course, []).append((student, score))
    report = []
    for course in sorted(by_course):
        members = by_course[course]
        highest = max(score for _, score in members)
        leaders = sorted(student for student, score in members if score == highest)
        passed = sum(score >= threshold for _, score in members)
        average = sum(score for _, score in members) // len(members)
        report.append((course, len(members), passed, average, "|".join(leaders)))
    return report

def main():
    threshold, n = map(int, input().split())
    latest = {}
    rejected = 0
    for _ in range(n):
        record = parse_record(input())
        if record is None:
            rejected += 1
        else:
            student, course, score = record
            latest[(student, course)] = score

    report = summarize(latest, threshold)
    print("REJECTED", rejected)
    print("RECORDS", len(latest))
    print("STUDENTS", len({student for student, _ in latest}))
    for row in report:
        print(*row)
    with open("summary.csv", "w", encoding="utf-8", newline="") as target:
        writer = csv.writer(target, lineterminator="\\n")
        writer.writerow(("course", "students", "passed", "average", "leaders"))
        writer.writerows(report)

if __name__ == "__main__":
    main()
`,guide:{concepts:["标准化","复合键覆盖","分组与集合去重","解包与生成器","CSV 输出"],approach:"先清洗输入，再决定最新版本，最后从最终数据生成唯一的报表行集合。这样坏行和重复不会直接改变统计运算。",steps:["解析一行，明确区分合法零分和坏行。","用 (学号,课程号) 作字典键，让后来的合法记录覆盖旧值。","给每门课保留学生与分数的二元组，按最终数据计算统计。","按照统一顺序显示，并用 csv.writer 生成真实文件。"],time:"平均 O(s+c log c+Σ k_i log k_i)，s 为输入和扫描字节数，c 为课程数，k_i 为各课程最高分并列者数量。",space:"O(n)，保留最终记录、分组和报表。",pitfall:"逐原始行累计会重复计分。校验失败也不应该删除此前合法成绩。",extension:"加入每课可配置及格线、并列前 k 名和逐学生统计，仍用同一清洗层。"}},We={id:u.id,title:u.title,tags:"进阶篇结项 · 数据处理与 CSV",description:"清洗混合成绩记录，处理重复更新，生成可核验的课程汇总和 CSV 文件。",steps:u.guide.steps,input:u.sample[0],expected:u.sample[1],acceptance:u.sample[2],files:u.starterFiles,solution:u.solution,assessment:u,brief:{requirements:["使用列表保留报表行，用复合键字典索引最新成绩，用集合统计跨课程的不同有效学号。","使用函数拆分清洗、统计和输出。至少在一处合理使用解包与推导式或生成器。","控制台列与 summary.csv 的数据行应从同一份报表生成。"],design:["先画三层数据流：原始文本 → 最新成绩映射 → 课程报表。标出每层的数据形状与排序时点。","用字典键表达「同一学生同一门课」的唯一性。学生编号前导零有意义，成绩的前导零只影响表示。","先完成计算函数再连接文件写入。让解析失败、业务拒绝和空数据仍能完成整份报告。"],stages:[{title:"清洗单行",work:"实现 parse_record，用大小写混合、坏分和前导零验证输出。",check:"例如「07 lab 006」应得到 (07, LAB, 6) 对应的三项值，带全角分数的行应拒绝。"},{title:"维护最终记录",work:"用复合键去重，坏行只计数。先用一科三条录入手推最终字典。",check:"同一个键先有 80 再有 0，最后为 0；若第二条不合法，仍为 80。"},{title:"排序、统计与并列",work:"按课程分组，在一科的最终记录上计算各列。",check:"用刚好及格、两人并列最高和平均分有小数的例子对照。"},{title:"导出并提交",work:"让两个输出共用 report，写出真实 CSV。",check:"空输入应生成只有表头的文件，多课场景的两份报表行序一致。"}],checklist:["全部自动评测通过，且有效零分、非法更新、空表、并列和前导零记录都有自测。","能说明去重键为何包含两个字段，以及为什么统计发生在覆盖之后。"],extensions:["新增按学生统计或可配置及格线，复用既有清洗与聚合函数。"]}},J=`from library import Book, Library, LoanPolicy, QuickLoanPolicy

class DenyAll:
    def allows(self, active_count):
        return False

def check(mode):
    if mode == "shape":
        book = Book("Q", "Atlas")
        return (book.code == "Q" and book.title == "Atlas"
                and issubclass(QuickLoanPolicy, LoanPolicy)
                and LoanPolicy().allows(1) and not LoanPolicy().allows(2)
                and QuickLoanPolicy().allows(0) and not QuickLoanPolicy().allows(1))
    if mode == "isolation":
        east, west = Library(LoanPolicy()), Library(LoanPolicy())
        return (east.add("A", "Map") == "OK" and west.add("A", "Atlas") == "OK"
                and east.hold("A", "U") == "OK" and east.borrow("A", "U") == "OK"
                and east.show("A") == "A Map U -" and west.show("A") == "A Atlas - -")

    branch = Library(DenyAll() if mode == "injected" else LoanPolicy())
    branch.add("C", "Guide")
    if mode == "injected":
        return (branch.hold("C", "U") == "OK" and branch.borrow("C", "U") == "LIMIT"
                and branch.show("C") == "C Guide - U")
    if mode == "fifo":
        return (branch.hold("C", "U") == "OK" and branch.hold("C", "V") == "OK"
                and branch.borrow("C", "V") == "RESERVED" and branch.borrow("C", "U") == "OK"
                and branch.show("C") == "C Guide U V")
    return (branch.borrow("C", "U") == "OK" and branch.return_book("C", "V") == "DENIED"
            and branch.show("C") == "C Guide U -" and branch.return_book("C", "U") == "OK")
`,g=(...a)=>({fixtures:[{name:"library_check.py",content:J}],calls:a.map(p=>({args:[p],expected:!0}))}),X=`from library import Library, LoanPolicy, QuickLoanPolicy

def main():
    mode, count = input().split()
    policy = LoanPolicy() if mode == "NORMAL" else QuickLoanPolicy()
    library = Library(policy)
    methods = {
        "ADD": library.add, "HOLD": library.hold, "BORROW": library.borrow,
        "RETURN": library.return_book, "SHOW": library.show,
    }
    for _ in range(int(count)):
        command, *args = input().split()
        print(methods[command](*args))

if __name__ == "__main__":
    main()
`,$=`from dataclasses import dataclass, field

@dataclass
class Book:
    code: str
    title: str
    borrower: str | None = None
    queue: list[str] = field(default_factory=list)

class LoanPolicy:
    limit = 2

    def allows(self, active_count):
        return active_count < self.limit

class QuickLoanPolicy(LoanPolicy):
    limit = 1

class Library:
    def __init__(self, policy):
        self._policy = policy
        self._books = {}
        self._active = {}

    def add(self, code, title):
        if code in self._books:
            return "DUP"
        self._books[code] = Book(code, title)
        return "OK"

    def hold(self, code, user):
        book = self._books.get(code)
        if book is None:
            return "UNKNOWN"
        if book.borrower == user or user in book.queue:
            return "DUP"
        book.queue.append(user)
        return "OK"

    def borrow(self, code, user):
        book = self._books.get(code)
        if book is None:
            return "UNKNOWN"
        if book.borrower is not None:
            return "BUSY"
        if book.queue and book.queue[0] != user:
            return "RESERVED"
        active = self._active.get(user, 0)
        if not self._policy.allows(active):
            return "LIMIT"
        if book.queue:
            book.queue.pop(0)
        book.borrower = user
        self._active[user] = active + 1
        return "OK"

    def return_book(self, code, user):
        book = self._books.get(code)
        if book is None:
            return "UNKNOWN"
        if book.borrower != user:
            return "DENIED"
        book.borrower = None
        self._active[user] -= 1
        return "OK"

    def show(self, code):
        book = self._books.get(code)
        if book is None:
            return "UNKNOWN"
        return f"{book.code} {book.title} {book.borrower or '-'} {','.join(book.queue) or '-'}"
`,f={id:"library-loans",title:"图书借阅与预约管理",tag:b[6],difficulty:"进阶",background:"社区馆有多个书件、并行借阅者与逐书预约。服务台希望统一命令，同时按模式选择借阅上限。",description:"实现 ADD 登记、HOLD 预约、BORROW 借阅、RETURN 归还、SHOW 查询。借阅依次检查书件存在、是否已借出、是否有其他队首，再检查配额。全部通过后更新借阅者，若有预约则移除匹配队首。合法归还只释放书件和持有名额，不自动借书。",input:"首行「NORMAL 或 QUICK q」。后 q 行分别为 ADD 编号 标题、HOLD 编号 用户、BORROW 编号 用户、RETURN 编号 用户或 SHOW 编号。NORMAL 允许每人同时借两本，QUICK 允许一本。固定接口写在 library.py：Book(code, title) 公开 code 与 title；QuickLoanPolicy 继承 LoanPolicy，两者提供 allows(active_count)；Library(policy) 依赖所传策略，提供 add(code, title)、hold(code, user)、borrow(code, user)、return_book(code, user)、show(code)，方法返回对应的一行字符串。",output:"每条命令输出一行。新增重号输出 DUP 并保留旧书。除 ADD 外找不到编号时为 UNKNOWN。HOLD 遇到借阅者本人或已排队用户为 DUP。BORROW 根据失败顺序输出 BUSY、RESERVED 或 LIMIT。RETURN 用户与当前借阅者不匹配时为 DENIED。其他成功变更为 OK。SHOW 输出「编号 标题 借阅者 预约列表」，空字段写 -，预约项用逗号连接。",limits:"0 ≤ q ≤ 240，编号、标题和用户为 1–10 位 ASCII 英数字，区分大小写。按命令顺序模拟并计算输出预算：查询已登记书件的 SHOW 计 33 + 11 × max(1, 该书当时预约人数)，其他命令（包括查询未登记书件）各计 9。合计不得超过 65536，包含分隔符和换行。失败不改状态；各 Library 实例数据隔离。导入 library.py 和调用其方法都不打印或读取标准输入。",contract:{kind:"module",files:["main.py","library.py"],target:{module:"library_check",name:"check"}},starterFiles:[{name:"main.py",content:X},{name:"library.py",content:`class Book:
    def __init__(self, code, title):
        self.code = code
        self.title = title
        # 记录当前借阅者和独立的预约队列。

class LoanPolicy:
    def allows(self, active_count):
        raise NotImplementedError("先实现普通模式")

class QuickLoanPolicy(LoanPolicy):
    # 复用接口，提供加快周转的配额。
    pass

class Library:
    def __init__(self, policy):
        self._policy = policy
        self._books = {}

    def add(self, code, title):
        raise NotImplementedError("先完成馆藏登记并校验重复编号")

    def hold(self, code, user):
        raise NotImplementedError("维护单书预约先后")

    def borrow(self, code, user):
        raise NotImplementedError("先校验，成功后再修改状态")

    def return_book(self, code, user):
        raise NotImplementedError("验证当前借阅者")

    def show(self, code):
        raise NotImplementedError("按契约返回一行字符串")
`}],sample:[`NORMAL 12
ADD A Map
ADD B Atlas
BORROW A Ann
HOLD A Bea
HOLD A Cam
BORROW B Ann
RETURN A X
RETURN A Ann
BORROW A Cam
BORROW A Bea
SHOW A
SHOW B
`,`OK
OK
OK
OK
OK
OK
DENIED
OK
RESERVED
OK
A Map Bea Cam
B Atlas Ann -
`,"错误归还未改变借阅者，真实归还未消耗预约。Cam 插队失败，Bea 借到后 Cam 成为队首。",g("shape","fifo")],cases:[[`NORMAL 0
`,"",g("isolation")],[`QUICK 9
ADD A Map
ADD B Atlas
BORROW B Ann
HOLD A Ann
BORROW A Ann
SHOW A
RETURN B Ann
BORROW A Ann
SHOW A
`,`OK
OK
OK
OK
LIMIT
A Map - Ann
OK
OK
A Map Ann -
`,g("injected")],[`NORMAL 8
ADD A Map
ADD A Copy
BORROW Z E
HOLD Z E
RETURN A E
BORROW A E
BORROW A E
SHOW A
`,`OK
DUP
UNKNOWN
UNKNOWN
DENIED
OK
BUSY
A Map E -
`,g("owner")],[`NORMAL 11
ADD A Map
ADD B Atlas
ADD C Echo
BORROW A U
BORROW B U
BORROW C U
HOLD C V
BORROW C U
RETURN A U
BORROW C V
SHOW C
`,`OK
OK
OK
OK
OK
LIMIT
OK
RESERVED
OK
OK
C Echo V -
`,g("shape","injected")],[`QUICK 8
ADD A Map
BORROW A U
HOLD A U
HOLD A V
BORROW A V
RETURN A U
HOLD A V
SHOW A
`,`OK
OK
DUP
OK
BUSY
OK
DUP
A Map - V
`,g("fifo","isolation")],[U.input,U.output,g("injected")]],hints:["先让 ADD 和 SHOW 形成最短的一条可运行路线，再加入借还，在没有预约时验证身份与独立馆藏。","借阅失败时不要弹出队首。把允许借阅的判断交给传入的 policy.allows(当前持有量)。"],solution:X,solutionFiles:[{name:"library.py",content:$}],guide:{concepts:["数据类与独立列表","封装","继承与多态","组件注入","有状态交互"],approach:"用书件记录维护局部状态，由持有策略的 Library 协调全馆索引和名额。命令入口只做解析和显示。可先扫描书件计算持有量，再在测试保护下实现增量计数。",steps:["以 Book 保存单书及预约。独立构造每个馆的索引。","定义两个兼容的配额策略，用继承共享校验结构。","借出先校验存在、空闲、队首、配额，成功后同时变更书件、队列与计数。","只允许当前借阅者归还，用两种策略和被拒绝的操作检查状态。"],time:"字典查找平均 O(1)，单次预约去重、队首删除与显示可能 O(k)，k 为该书排队数。",space:"O(b+r+u)，b 为书件数、r 为排队记录数、u 为出现过的借阅者。",pitfall:"策略拒绝时必须保留预约和借阅计数。对错误归还也不能减计数。",extension:"增加取消预约或续借，将逾期计算单独建模并补上失败复测。"}},Me={id:f.id,title:f.title,tags:"进阶篇结项 · 面向对象与多文件",description:"从馆藏索引和借还状态入手，实现逐书预约、公平借阅和可替换的配额策略。",steps:f.guide.steps,input:f.sample[0],expected:f.sample[1],acceptance:f.sample[2],files:f.starterFiles,solution:f.solution,assessment:f,brief:{requirements:["main.py 负责入口。library.py 提供 Book、Library、LoanPolicy、QuickLoanPolicy，并保持所列方法签名。","一馆拥有书目字典，每本书的预约列表独立。持有数可现算或维护索引，失败总应保留状态。","Library 通过 allows(active_count) 使用传入的组件。本项目的独立检查会注入全拒绝策略，验证替换后行为。"],design:["画出 Book 字段与两类借阅策略，箭头从 Library 指向书目集合和策略对象。命令行只调用这些公开接口。","为借出列出顺序：缺书、已借出、预约优先、配额。让所有校验成功后才提交变更。","登记与查询适合先完成，随后以同一输入验证重构后的借还。顺序操作确定后再加入预约与策略。"],stages:[{title:"登记和查询",work:"建 Book 与馆藏索引，实现 add 和 show。",check:"同一馆重复编号保留旧标题；两馆可登记同号不同标题。"},{title:"借出与归还",work:"用明确的空闲标记记录借阅者，实现成功和拒绝。",check:"借给 A 后由 B 归还应拒绝，随后查询仍显示 A。"},{title:"预约与规则替换",work:"按书保存 FIFO 队列，使用继承设置两种借阅策略，组合进 Library。",check:"队首超额要留下预约；归还其他书后，应能按原队首身份再借。"},{title:"交互与验收",work:"连接起始命令入口，运行示例和接口检查。",check:"同一命令序列用两种模式运行一遍，确认只有配额行为随策略变化。"}],checklist:["正式提交应通过命令输出及独立接口检查。额外自测多馆隔离、重复预约、排队时错误归还与配额失败后重借。","能画出类之间的使用关系，并解释拒绝分支要保持哪些状态。"],extensions:["为预约加入撤销或过期。先定义成功与失败时如何更新队列，再扩大命令和测试覆盖。"]}};export{Ce as A,ie as B,ae as C,oe as D,le as E,fe as F,me as G,Ae as H,_e as I,xe as J,Be as K,Ne as L,we as M,Re as N,Ie as O,Ke as P,Pe as Q,Ue as R,Xe as S,We as T,Me as U,ne as a,se as b,re as c,te as d,pe as e,l as f,de as g,be as h,i,Oe as j,he as k,ee as l,ce as m,ge as n,ke as o,ye as p,ve as q,Ee as r,o as s,b as t,ue as u,Te as v,Se as w,De as x,qe as y,Le as z};
