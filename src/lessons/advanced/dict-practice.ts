import { task } from './practice.ts';
import { structureTags } from './authoring.ts';

export const dictionaryProblems = [
  task(9, structureTags[2], '入门', '可撤销的物资清单', {
    background: '负责人能调整数量、撤下编号，或撤回最后上架的一项。',
    description: '按顺序处理 SET 编号 数量、DROP 编号和 LAST。SET 更新原位置或在末尾插入，DROP 删键，LAST 取出最后插入的现存项。',
    input: '第一行 q，随后 q 行命令。任何命令都可能发生在空清单上。',
    output: '每次 LAST 输出「编号 数量」，无项时输出「空」。最后输出一行「编号:数量」清单，以一个空格分隔，空时写「空」。',
    limits: '0 ≤ q ≤ 200，数量 0–1000，编号为英数字。DROP 缺失时忽略。零库存仍是一条现存项。',
  }, ['7\nSET B 2\nSET A 0\nSET B 7\nLAST\nDROP B\nSET B 1\nSET C 0\n', 'A 0\nB:1 C:0\n', '更新 B 未改变插入顺序，LAST 先取走 A。'], [
    ['0\n', '空\n'], ['2\nLAST\nDROP A\n', '空\n空\n'], ['5\nSET A 0\nSET B 5\nDROP A\nSET A 0\nLAST\n', 'A 0\nB:5\n'],
  ], ['使用能保留插入顺序的映射。', '先检查非空，再用 popitem 取最后插入的现存项。'], `stock = {}
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
`, { concepts: ['字典插入顺序', 'pop', 'popitem', 'items'], approach: '只维护当前清单，字典的顺序正好符合上架、原位更新与重插规则。',
    steps: ['SET 用赋值更新，DROP 用有默认值的 pop。', 'LAST 查询后移除末尾条目。', '用 items 保序输出。'],
    time: '平均 O(q)，另计输出字符数。', space: 'O(q) 条目和格式化字段。',
    pitfall: '不能先按编号排序再执行 LAST；零值也不能当作缺失。', extension: '增加 CLEAR 命令，把清空和撤销空表都写进边界测试。' }),

  task(10, structureTags[2], '入门', '社区主题热度', {
    background: '整理社区投票记录，赞成票加一，撤回或反对减一。',
    description: '计算每个主题净热度，只在正分主题中选最高分。同分时选择整个流水中首次出现更早的主题。',
    input: '第一行 n，后 n 行为符号 + 或 - 与主题代号。',
    output: '输出一行「主题 净分」。没有正分主题时输出「无」。',
    limits: '0 ≤ n ≤ 500，主题由 1–20 个英文字母组成，大小写敏感。首次出现可以来自减分记录。',
  }, ['6\n- B\n+ A\n+ B\n+ B\n+ Z\n- Z\n', 'B 1\n', 'A 和 B 都是 1 分。B 在第一条减分记录中先出现。'], [
    ['0\n', '无\n'], ['3\n- A\n+ A\n- B\n', '无\n'], ['4\n+ C\n+ X\n+ X\n- A\n', 'X 2\n'],
    ['4\n+ Z\n+ A\n+ A\n+ Z\n', 'Z 2\n'],
  ], ['用 get(..., 0) 读取累计值。', '按插入顺序扫描，仅在严格超出最高分时更新。'], `scores = {}
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
`, { concepts: ['词频与带符号累计', '首现顺序', '并列'], approach: '第一次出现时直接创建键，得到一份保留首现顺序的净分表。',
    steps: ['把每个符号转换为增量。', '读完后按字典顺序只处理严格更优结果。', '最高分初值为 0，从而排除零和负数。'],
    time: '平均 O(n)。', space: 'O(u)，u 是不同主题数。',
    pitfall: '改用 >= 更新会让后到的同分主题获胜。', extension: '输出所有正分主题，按分数降序、首现顺序升序。' },
  { kind: 'adapted', platform: 'AtCoder', id: 'ABC091 B', title: 'Two Colors Card Game', level: 'ABC B',
    url: 'https://atcoder.jp/contests/abc091/tasks/abc091_b?lang=en', concepts: ['频次差', '最高得分'],
    adaptation: '改用交错的加减事件，要求在输出里带主题与分数，并规定非正分及首现平局规则。' }),

  task(11, structureTags[2], '基础', '片区领用小结', {
    background: '活动结束后要按片区整理领用记录，既汇总数量，也保留事件明细。',
    description: '按片区分组，每区统计总量和所有标签。片区按首次出现顺序输出，标签按该片区内的输入顺序保留。',
    input: '第一行 n，随后 n 行为片区、标签、领用量。各字段以空格分隔。',
    output: '每片区一行「片区 总量 标签1,标签2,...」。没有片区时输出「空」。',
    limits: '0 ≤ n ≤ 500，领用量 0–100，片区与标签仅含英数字。重复标签不去重，零量记录保留。',
  }, ['4\nN A 2\nS A 0\nN B 4\nN A 1\n', 'N 7 A,B,A\nS 0 A\n', 'N 的两条 A 都保留，S 即使总量为零也输出。'], [
    ['0\n', '空\n'], ['2\nZ X 0\nA X 0\n', 'Z 0 X\nA 0 X\n'], ['3\nA L 2\nA L 3\nA L 4\n', 'A 9 L,L,L\n'],
  ], ['用字典保存片区，用列表保存每区明细。', '在输出当前片区时同步累计数量与提取标签。'], `groups = {}
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
`, { concepts: ['字典分组', '列表明细', '保序累计'], approach: '片区是索引，列表保留重复和明细。汇总与明细从同一份记录生成。',
    steps: ['按片区获取或新建列表。', '追加标签和数量记录。', '每组一次遍历生成总量和标签序列。'],
    time: '平均 O(n)，另计输出字符数。', space: 'O(n) 条记录。',
    pitfall: '按标签作组内唯一键会覆盖重复标签。', extension: '添加片区内标签聚合版，并按首现顺序输出标签各自的总数量。' }),

  task(12, structureTags[2], '进阶', '跨仓库存索引', {
    background: '不同仓库可能共用物品编号，库存有零值，也可能从来没建立过。',
    description: '实现 PUT 仓号 物号 数量、GET 仓号 物号和 LIST 仓号。PUT 覆盖该仓内对应物品的库存。GET 查询库存。LIST 列出该仓中数量大于零的物品。',
    input: '第一行 q，随后 q 行命令，字段以空格分隔。',
    output: 'GET 输出库存整数，缺失输出「未登记」。LIST 按物号的仓内首次登记顺序输出「物号:数量」，以空格分隔，空清单输出「空」。',
    limits: '0 ≤ q ≤ 500，仓号和物号由 1–12 位英数字组成，数量为 0–1000。所有 LIST 输出合计不超过 1500 个物号。GET 和 LIST 不创建条目。',
  }, ['8\nGET E L\nPUT E L 0\nPUT W L 6\nPUT E X 3\nGET E L\nLIST E\nPUT E L 2\nLIST E\n', '未登记\n0\nX:3\nL:2 X:3\n', '零库存可查询，却不列入清单。恢复后 L 在 X 之前。'], [
    ['3\nLIST Q\nGET Q C\nLIST Q\n', '空\n未登记\n空\n'],
    ['5\nPUT A X 3\nPUT B X 4\nGET A X\nGET B X\nLIST C\n', '3\n4\n空\n'],
    ['5\nPUT A Z 3\nPUT A B 1\nPUT A Z 4\nLIST A\nGET A X\n', 'Z:4 B:1\n未登记\n'],
  ], ['外层按仓查找，内层按物品编号查找。', 'GET 用「是否存在」判缺失，LIST 再按数量阈值过滤。'], `stock = {}
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
`, { concepts: ['两级索引', '顺序', '缺键和零值', '筛选映射'], approach: '仓内物号唯一，按层定位可避免不同仓互相覆盖，LIST 也只扫描目标仓。',
    steps: ['PUT 创建或取得内层。', 'GET 用嵌套查询返回值或明确的缺失标记。', 'LIST 访问该仓并过滤零库存。'],
    time: '平均 O(q + L)，L 为每次 LIST 扫描的仓内条目数之和，另计输出字符数。', space: 'O(q) 条目。',
    pitfall: '读取时用 setdefault 会创建空仓或默认值，因此读取使用 get。', extension: '支持按仓合并两批数据，并保证同号值按后批覆盖。' }),
];
