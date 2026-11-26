import { task } from './practice.ts';
import { expressionTags } from './authoring.ts';

export const unpackingProblems = [
  task(33, expressionTags[3], '入门', '变长货箱交接单', {
    background: '每条货箱记录都有箱号和终点，二者之间可能附带若干标签。',
    description: '拆出每行的箱号、终点和所有中间标签。标签按原次序保留，包括重复标签。',
    input: '首行 n。随后 n 行，每行是箱号、零到多个标签、终点，字段以单个空格分隔。',
    output: '每行「箱号 终点 标签列表」。标签用逗号连接，没有则输出 NONE。',
    limits: '0 ≤ n ≤ 500，每行最多 20 个标签。箱号、标签、终点均为 1–10 位英数字。n 为 0 时无输出。',
  }, ['3\nB7 glass top N2\nA1 S1\nB8 dry dry W1\n', 'B7 N2 glass,top\nA1 S1 NONE\nB8 W1 dry,dry\n',
    'A1 和 S1 已分配到两端，因此没有任何中间标签。'], [
    ['0\n', ''], ['1\nX Y\n', 'X Y NONE\n'], ['1\nX B Z A\n', 'X A B,Z\n'],
  ], ['箱号总在行首、终点总在行尾。', '用星号目标接收不定数量的中间字段。'], `for _ in range(int(input())):
    crate, *tags, destination = input().split()
    print(crate, destination, ",".join(tags) or "NONE")
`, { concepts: ['星号赋值', '固定首尾字段', '空剩余'],
    approach: '保持两个固定字段的名字，给剩余字段一个列表。逐行格式化。',
    steps: ['拆成空格分隔的字段。', '首尾取固定值，中间统收为列表。', '用逗号连接并补空标记。'],
    time: 'O(s)，s 为所有字段的字符数。', space: '额外空间 O(m)，m 为最长记录的长度。',
    pitfall: '用三个固定目标接收变长记录会在无标签或多标签时失败。',
    extension: '打印每个箱号的标签数量和首个特定标签的原位置。' }),

  task(34, expressionTags[3], '入门', '两列积分核验', {
    background: '报名系统分别导出编号列和积分列。只在两列完整对齐后才发布及格记录。',
    description: '将同一位置的编号和积分对齐，保留积分达到门槛的记录，并显示原位置。两列长度不相同则整份报表无效。',
    input: '三行。第一行门槛，第二行编号列表，第三行整数积分列表。后两行可以为空。',
    output: '不等长时只输出「长度不一致」。等长时按顺序每行输出「位置 编号 积分」，位置从 1 开始。没有达标项时输出「空」。',
    limits: '两列各 0–800 项，编号 1–12 位英数字、可以重复，门槛和积分均在 -1000–1000。',
  }, ['10\nE C E\n10 9 12\n', '1 E 10\n3 E 12\n', '编号 E 可以重复，过滤后第二条结果仍保留原位置 3。'], [
    ['5\nA B\n6\n', '长度不一致\n'], ['5\nA\n8 9\n', '长度不一致\n'],
    ['0\n\n\n', '空\n'], ['-2\nZ X\n-3 -2\n', '2 X -2\n'],
  ], ['先确保两列完整对齐。', '对配对结果编号，再用筛选判断积分。'], `limit = int(input())
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
`, { concepts: ['zip', 'enumerate', '嵌套解包', '原序号'],
    approach: '先校验数据形状，再把位置当作每条记录的一个字段。筛选后保持原位置。',
    steps: ['读入两列，用 list 消费全部严格配对，确认长度。', '在配对通过后为每个元组加上行号。', '筛选合格行并输出，或给空标记。'],
    time: 'O(n+m)，n、m 为各列长度。', space: 'O(n+m)。', pitfall: '默认 zip 会悄悄截断，导致把残缺数据当成完整报告。',
    extension: '在不等长时输出第一处没有配对的位置。' }),

  task(35, expressionTags[3], '基础', '取件清单的格式覆盖', {
    background: '领物点把两批标签接到同一张清单上。可自定义清单前缀与分隔字符。',
    description: '先输出前缀，再按两批顺序输出标签，以选定分隔符连接。默认前缀为 PICK，默认分隔符为 |。每条设置覆盖此前同名设置。',
    input: '前两行分别为两批标签，能为空。第三行 q，随后 q 行，每行是 prefix 或 sep 及其设置值。',
    output: '一行格式化清单，无任何标签时只输出前缀。保留标签重复次数，不加末尾分隔符。',
    limits: '每批 0–200 个 1–12 位英数字标签，0 ≤ q ≤ 10。prefix 是 1–12 位英数字，sep 为 |、-、/、: 中的一个。',
  }, ['A A\nB\n3\nsep /\nprefix GO\nsep :\n', 'GO:A:A:B\n', '最后的 sep 覆盖此前的 /，A 保留两次。'], [
    ['\n\n0\n', 'PICK\n'], ['\nB4\n1\nsep -\n', 'PICK-B4\n'],
    ['A B\n\n2\nprefix OLD\nprefix NEW\n', 'NEW|A|B\n'],
  ], ['在字典里合并默认设置和改动。', '将两批标签分别作为位置实参展开，只将最终配置展开一次。'], `def format_sheet(*items, **options):
    return options["sep"].join([options["prefix"], *items])

first = input().split()
second = input().split()
defaults = {"prefix": "PICK", "sep": "|"}
updates = {}
for _ in range(int(input())):
    key, value = input().split()
    updates[key] = value
print(format_sheet(*first, *second, **{**defaults, **updates}))
`, { concepts: ['拆包位置实参', '收集变长实参', '配置合并'],
    approach: '在调用前消解配置冲突，并将两批数据按顺序交给同一格式化函数。',
    steps: ['读取两批数据与更改映射。', '先合并字典形成最终参数名称和值。', '两批标签展开给 items，最终配置展开给 options，统一连接输出。'],
    time: 'O(n+m+q)，标签和设置宽度有上界。', space: 'O(n+m)，含结果字符串和标签列表。',
    pitfall: '以 **defaults, **updates 分别传入会因重复关键字失败。',
    extension: '增加带空标签时的显示规则，为两种格式编写独立自测。' }),

  task(36, expressionTags[3], '进阶', '活动积分对账报表', {
    background: '进阶模块测评。活动组收到编号列、积分列和禁用清单。每个编号的最后一次更新决定该人当前积分。',
    description: '两列必须等长。编号大小写不敏感并统一输出小写，同一编号以最后一条积分为准。筛出最新积分达到门槛且不在禁用清单中的编号，按该编号最后一次记录的原位置升序报告。',
    input: '四行。依次给最低门槛、编号列表、整数积分列表、禁用编号列表。后三行允许为空，列表项用空格分隔。',
    output: '两列不等长时只输出「长度不一致」。否则首行输出「TOTAL 人数 总积分」，其后每人一行「最后位置 编号 最新积分」。位置从 1 开始。无合格人时只输出 TOTAL 0 0。',
    limits: '每份列表 0–800 项，编号 1–12 位 ASCII 英数字。最低门槛 0–100，积分为 -1–100，-1 表示撤销，禁用编号可能不存在或重复。',
  }, ['10\nB a B X A C\n10 13 18 15 -1 10\nx X\n', 'TOTAL 2 28\n3 b 18\n6 c 10\n',
    'A 的最后一条是撤销，X 被禁用，B 用第 3 条，C 恰达门槛。'], [
    ['0\n\n\n\n', 'TOTAL 0 0\n'], ['7\nA B\n9\n\n', '长度不一致\n'],
    ['7\nA\n8 9\nb\n', '长度不一致\n'],
    ['0\nA Z a B\n9 0 0 0\n\n', 'TOTAL 3 0\n2 z 0\n3 a 0\n4 b 0\n'],
    ['9\nE E B z\n-1 9 30 9\nb B\n', 'TOTAL 2 18\n2 e 9\n4 z 9\n'],
    ['99\nE Z\n1 -1\nE\n', 'TOTAL 0 0\n'],
  ], ['先验证两列长度，展开配对和原始位置，再构造最终状态。', '保留最后位置作为字典值的一部分。字典会保留键首次写入顺序，因此报告需要显式排序。'], `limit = int(input())
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
`, { concepts: ['嵌套解包', '对齐与原始位置', '字典覆盖', '集合归一化', '按需求和'],
    approach: '写出五步管道：验证形状、编号配对、覆盖到最终状态、筛选、汇总输出。有效零值仍要保留。',
    steps: ['检查两列等长，禁用列表转为规范化集合。', '按输入原序逐条生成记录，最后写入的值覆盖旧值。', '对最终状态筛选，按记录中的最后位置排序。', '用生成器求总分，再按报告顺序展开输出。'],
    time: '哈希平均 O(n+b+k log k)，n 为记录数，b 为禁用条数，k 为结果数。', space: 'O(n+b)。',
    pitfall: '先过滤再覆盖会保留之后已撤销的记录。直接遍历 latest 会按首次插入顺序输出。',
    extension: '同时输出已撤销、被禁用、未达门槛的最终记录数，以可重现的数据验证所有分类。' }),
];
