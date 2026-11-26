import { task } from './practice.ts';
import { structureTags } from './authoring.ts';

export const listProblems = [
  task(1, structureTags[0], '入门', '替换节目片段', {
    background: '电台编辑先核对撤下的节目，再发布新节目单。',
    description: '保存节目单中下标区间 [left, right) 的内容，将这个区间替换为新片段。',
    input: '三行。原节目代号以空格分隔，两个整数 left right，新片段代号以空格分隔。两份名单都可以是空行。',
    output: '第一行输出原区间，第二行输出修订后的节目单。每行用单个空格连接，空名单写「空」。',
    limits: '每份名单 0–100 项，代号为 1–12 位英数字。0 ≤ left ≤ right ≤ 原名单长度。相等表示在该位置插入。',
  }, ['A B C D\n1 3\nX\n', 'B C\nA X D\n', '位置 1、2 被保存并用 X 替换。'], [
    ['A B\n1 1\nX Y\n', '空\nA X Y B\n'], ['A A B\n0 3\n\n', 'A A B\n空\n'], ['\n0 0\nZ\n', '空\nZ\n'],
  ], ['先读右侧切片，保留旧项目。', '用原区间的左侧切片赋值。'], `shows = input().split()
left, right = map(int, input().split())
replacement = input().split()
removed = shows[left:right]
shows[left:right] = replacement
print(" ".join(removed) or "空")
print(" ".join(shows) or "空")
`, { concepts: ['半开区间', '切片复制与赋值'], approach: '分开预览与更新。修改前读出区间，避免第二次读取时已经变成新片段。',
    steps: ['拆分三行输入。', '用右侧切片保存要移除的代号。', '用等步长切片赋值更新原表并输出两份名单。'],
    time: 'O(n+m)，n 为原项数，m 为新片段长度。代号长度有固定上界。', space: 'O(n+m)，含名单、暂存切片及输出。',
    pitfall: 'right 不包含。left == right 时要插入，也要输出空预览。', extension: '支持连续多次修改，每次都报告被替换的旧片段。' }),

  task(2, structureTags[0], '入门', '独立座位方案', {
    background: '排练负责人需要在副本里试占座位，同时保留原始座位图。',
    description: '把原图复制成草案，按输入顺序修改草案中的一个格子或多个格子，最后输出原图和草案。',
    input: '第一行 r c q。接下来 r 行，每行 c 个以空格分隔的 0 或 1。最后 q 行为行下标、列下标和新值，均为整数。',
    output: '先输出原图 r 行，再输出一行 ---，最后输出草案 r 行。每行数字以单个空格分隔。',
    limits: '1 ≤ r,c ≤ 40，0 ≤ q ≤ 100。坐标从 0 开始且有效。同一格可被多次修改，每次覆盖之前的值。',
  }, ['2 2 2\n0 1\n1 0\n0 0 1\n1 1 1\n', '0 1\n1 0\n---\n1 1\n1 1\n', '两次写入分别落在草案两行，原图依旧。'], [
    ['1 1 0\n0\n', '0\n---\n0\n'], ['2 1 2\n0\n0\n0 0 1\n0 0 0\n', '0\n0\n---\n0\n0\n'], ['2 1 1\n0\n0\n1 0 1\n', '0\n0\n---\n0\n1\n'],
  ], ['每一行是一个列表。', '外层复制之外，再为每一行建立一个副本。'], `r, c, q = map(int, input().split())
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
`, { concepts: ['二维列表', '逐行浅拷贝'], approach: '每行的元素是不可变字符串，要隔离格子替换，只需复制行和外层。',
    steps: ['逐行建立原图。', '逐行复制并收集到独立外层。', '所有写入只走草案坐标路径，再输出两张图。'],
    time: 'O(rc+q)。', space: 'O(rc)。', pitfall: '只写 draft = original.copy() 时两图的行仍然共享。', extension: '允许用一条命令替换一整个横向区间。' }),

  task(3, structureTags[0], '基础', '多份活动草案', {
    background: '同一个活动模板会复制给多个现场，现场各自修改展区里展品的备注清单。',
    description: '基于三层列表模板生成 k 份相互独立的草案。每条变更在指定草案、展区、展品的备注末尾添加一条。原模板永远保留。',
    input: '第一行 k r c q。接下来 r 行，每行 c 个原备注代号，每个展品起初只有这一条备注。最后 q 行为草案下标、展区下标、展品下标和备注代号。',
    output: '按原模板、草案 0 至 k-1 的顺序输出。每份模板或草案的首行分别为 BASE 或草案下标，随后 r 行，每个展品的备注以逗号连接，展品之间用一个空格分隔。',
    limits: '1 ≤ k,r,c ≤ 8，0 ≤ q ≤ 50。下标从 0 开始且有效，代号由 1–12 位英数字组成。重复备注也保留。',
  }, ['2 1 2 2\nx y\n0 0 1 z\n1 0 0 w\n', 'BASE\nx y\n0\nx y,z\n1\nx,w y\n', '两条变更分别只影响一份草案中的一个展品。'], [
    ['1 1 1 0\na\n', 'BASE\na\n0\na\n'],
    ['2 1 1 3\na\n0 0 0 b\n0 0 0 b\n0 0 0 c\n', 'BASE\na\n0\na,b,b,c\n1\na\n'],
    ['2 2 1 2\na\nb\n1 1 0 a\n1 0 0 b\n', 'BASE\na\nb\n0\na\nb\n1\na,b\nb,a\n'],
  ], ['先画出每次 append 实际修改的是第几层。', '每次新建草案都单独对模板执行 deepcopy。'], `from copy import deepcopy

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
`, { concepts: ['三层列表', '深拷贝', '共享关系'], approach: '把备注本身与展区列表都当成要保留的可变对象。分别创建草案并只通过指定草案引用写入。',
    steps: ['每个展品新建一个备注列表。', '每份草案单独深拷贝，避免用乘法重复指向同一份草案。', '按事件追加，再按题面顺序格式化输出。'],
    time: 'O(krc + q + 输出字符数)。', space: 'O(krc+q) 个备注或容器引用，另有当前输出行。',
    pitfall: 'drafts = [deepcopy(base)] * k 只调用一次 deepcopy。', extension: '增加从某份现有草案分叉的新命令，保留已有修改。' }),

  task(4, structureTags[0], '进阶', '追踪三种共享关系', {
    background: '审核员需要用三份视图复现一处误改，确认影响范围。',
    description: '原始表有两行。建立 alias（同一外层）、shallow（浅拷贝）和 deep（深拷贝）。先向 alias 的第 0 行追加 x，再把 shallow 的第 0 行替换为 [y]，最后向 shallow 的第 1 行追加 z。输出四份表。',
    input: '第一、二行为原表两行的若干整数，可以为空。第三行为 x y z。',
    output: '按 BASE、ALIAS、SHALLOW、DEEP 的顺序各输出一行。每行格式为「标签:首行内容|次行内容」，行内整数用逗号连接，空行内容为空文本。',
    limits: '每个原表行 0–30 项，所有整数在 -1000 至 1000。保留重复项。四组均在操作结束后读取。',
  }, ['1 2\n3\n4 9 5\n', 'BASE:1,2,4|3,5\nALIAS:1,2,4|3,5\nSHALLOW:9|3,5\nDEEP:1,2|3\n', '改浅拷贝的首行引用与修改仍共享的次行影响不同。'], [
    ['\n\n0 0 0\n', 'BASE:0|0\nALIAS:0|0\nSHALLOW:0|0\nDEEP:|\n'],
    ['-1\n-1\n-1 2 0\n', 'BASE:-1,-1|-1,0\nALIAS:-1,-1|-1,0\nSHALLOW:2|-1,0\nDEEP:-1|-1\n'],
    ['7 7\n\n8 11 6\n', 'BASE:7,7,8|6\nALIAS:7,7,8|6\nSHALLOW:11|6\nDEEP:7,7|\n'],
  ], ['先创建所有关系，再做第一条写入。', '用 shallow[0] = [y] 替换引用，用 shallow[1].append(z) 改行对象。'], `from copy import deepcopy

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
`, { concepts: ['对象身份', '浅拷贝与深拷贝', '原地更改和位置替换'], approach: '画出四个名称和两层对象的箭头再执行三个动作。统一格式化末态，避免中途输出。',
    steps: ['构造共享外层、共享内层、独立内层三种关系。', '区分替换浅副本的位置与修改共享行。', '按标签读取末态并格式化。'],
    time: 'O(n)，n 为原始元素数。', space: 'O(n)，深拷贝需要复制所有列表层级。',
    pitfall: '不能先修改再复制，副本应看到创建时的内容。', extension: '加上浅副本首行在替换之前原地修改的操作，先画图再验证。' }),

  task(5, structureTags[1], '入门', '发放桌上的领物队列', {
    background: '领取处允许批量登记、插入急件和撤销第一张重复标签。',
    description: '依次处理 APPEND 标签、BATCH 后若干标签、INSERT 位置 标签、CANCEL 标签和 TAKE 位置。',
    input: '第一行初始标签列表，可能为空。第二行 q。随后 q 行命令，字段以空格分隔；BATCH 可无标签。',
    output: '每次 TAKE 输出取走的标签。处理完成后输出两行，先输出剩下的标签数，再输出列表，空列表写「空」。',
    limits: '初始长度 0–100，0 ≤ q ≤ 100，每次 BATCH 最多 20 项。INSERT 为 0 到当前长度，TAKE 位置 0 基且有效。CANCEL 缺失时忽略。标签由 1–12 位英数字组成。',
  }, ['A B A\n5\nCANCEL A\nINSERT 1 X\nBATCH Y Z\nTAKE 0\nAPPEND X\n', 'B\n5\nX A Y Z X\n', '撤销只移走第一个 A，领取 B 后，X 可以重复。'], [
    ['\n3\nCANCEL X\nBATCH\nINSERT 0 Z\n', '1\nZ\n'], ['A A A\n2\nCANCEL A\nTAKE 1\n', 'A\n1\nA\n'], ['A\n1\nTAKE 0\n', 'A\n0\n空\n'],
  ], ['区分标签对象和位置。', '用 extend 处理字段切片，pop 返回取走的标签。'], `queue = input().split()
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
`, { concepts: ['append', 'extend', 'insert', 'remove', 'pop'], approach: '队列允许重复且命令基于位置，直接使用列表维护其当前顺序。',
    steps: ['读命令类型与字段。', '按值和按位置分别使用相应方法。', '先输出各次领取，再输出当前列表。'],
    time: 'O(n + q(m+1) + b)，n 为初始长度，m 为最大队列长度，b 为批量登记总项数。', space: 'O(m)，另有单条命令的字段列表。',
    pitfall: 'CANCEL 不要清理所有同名标签。', extension: '添加查询指令，报告标签出现次数和第一次出现位置。' }),

  task(6, structureTags[1], '入门', '后备讲解员', {
    background: '展馆从合格讲解员中选一人首发，另一人作为后备。',
    description: '筛掉低于资格线者，按分数从高到低排名，同分按登记先后。输出排在第二的编号。',
    input: '第一行 n limit，随后 n 行，每行是编号和分数，顺序为登记顺序。',
    output: '输出第二名编号；合格者不足两人时输出「无」。',
    limits: '0 ≤ n ≤ 500，分数与资格线在 0–100，编号唯一且只含英数字。等于资格线算合格。',
  }, ['4 60\nL 90\nM 59\nZ 90\nA 89\n', 'Z\n', 'M 淘汰，L 和 Z 同分，Z 按登记次序排第二。'], [
    ['0 0\n', '无\n'], ['3 75\nZ 75\nA 100\nQ 74\n', 'Z\n'], ['3 100\nZ 100\nB 99\nC 99\n', '无\n'],
    ['3 0\nC 80\nA 80\nB 80\n', 'A\n'],
  ], ['先筛选，再排名。', '只用分数作为键，稳定排序会处理同分。'], `n, limit = map(int, input().split())
eligible = []
for _ in range(n):
    code, value = input().split()
    score = int(value)
    if score >= limit:
        eligible.append((code, score))
eligible.sort(key=lambda row: row[1], reverse=True)
print(eligible[1][0] if len(eligible) >= 2 else "无")
`, { concepts: ['筛选', '排序键', '稳定性'], approach: '收集有资格的记录后只按分数排序，这样同分保持登记顺序。',
    steps: ['读出资格边界和记录。', '只把达线者加入名单，按分数降序。', '检查长度后输出下标 1。'],
    time: 'O(n + k log k)，k 为合格人数。', space: 'O(k)。',
    pitfall: '第二名指第二条合格记录，同分仍各占一位。', extension: '实现只保留当前前两条记录的单次扫描。' },
  { kind: 'adapted', platform: 'AtCoder', id: 'ABC213 B', title: 'Booby Prize', level: 'ABC B',
    url: 'https://atcoder.jp/contests/abc213/tasks/abc213_b?lang=en', concepts: ['次名', '记录排名'],
    adaptation: '保留取第二名的思想，加入资格筛选、同分稳定排序和人数不足的情况。' }),

  task(7, structureTags[1], '基础', '还原巡检日志', {
    background: '巡检员按发生顺序记录读数，值班室则要同时看到历史和优先查看的警报。',
    description: '第一行报告全部记录的编号顺序。第二行报告所有达到阈值的记录，按读数从高到低，同值时最近发生的排前。',
    input: '第一行 n limit，接下来 n 行是编号和值，输入顺序就是发生顺序。',
    output: '两行编号，每行以一个空格连接；没有记录的一行写「空」。',
    limits: '0 ≤ n ≤ 300，阈值和值在 -1000 至 1000，编号由英数字组成，可重复，每条记录单独排名。',
  }, ['4 5\nX 7\nY 5\nZ 7\nY 4\n', 'X Y Z Y\nZ X Y\n', 'Z 与 X 同值，Z 更晚；最后一个 Y 未达标。'], [
    ['0 0\n', '空\n空\n'], ['2 5\nA 4\nB 0\n', 'A B\n空\n'], ['3 -2\nZ -2\nA -2\nA -2\n', 'Z A A\nA A Z\n'],
  ], ['历史和警报各自收集到列表。', '先让警报名单按发生顺序反向，再稳定排序。'], `n, limit = map(int, input().split())
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
`, { concepts: ['筛选', 'reversed', '稳定排序'], approach: '把最近者在前的顺序作为排序的输入，同值时由稳定性沿用。',
    steps: ['完整保存原顺序并单独记录警报。', '反向读取警报，再按数值排序。', '将结果投影为编号顺序。'],
    time: 'O(n + k log k)，k 为警报数。', space: 'O(n)。',
    pitfall: '对正序警报只用 reverse=True，同值仍是先来在前。', extension: '改成仅输出前 k 条，并保留最后一名的所有同值记录。' }),

  task(8, structureTags[1], '进阶', '服务工单分派', {
    background: '派单员需要一份稳定的工单顺序，避免重复刷新时同优先级工单自行换位。',
    description: '先按优先级从高到低，再按等待分钟数从多到少，最后按组名升序。三个字段相同的工单保留输入次序。',
    input: '第一行 n，其后 n 行为编号、优先级、等待分钟、组名。',
    output: '逐行输出工单编号。输入为空时没有任何输出。',
    limits: '0 ≤ n ≤ 1000，优先级 0–9，等待 0–10000，编号唯一且为英数字，组名仅含小写字母。',
  }, ['5\nZ 2 10 b\nX 3 2 a\nY 2 10 a\nA 2 10 a\nB 2 9 a\n', 'X\nY\nA\nZ\nB\n', '同键时 Y 保留在 A 前，组名 a 排在 b 前。'], [
    ['0\n', ''], ['3\nH 1 2 a\nJ 2 0 z\nK 1 3 z\n', 'J\nK\nH\n'],
    ['4\nZ 0 0 z\nY 0 0 a\nX 0 0 a\nA 0 0 z\n', 'Y\nX\nZ\nA\n'],
  ], ['把每条记录写成有固定列的元组。', '希望数值降序时可以取负，把整个键保持升序。'], `orders = []
for _ in range(int(input())):
    code, level, waited, group = input().split()
    orders.append((code, int(level), int(waited), group))
orders.sort(key=lambda row: (-row[1], -row[2], row[3]))
for order in orders:
    print(order[0])
`, { concepts: ['混合升降序', '元组排序键', '并列稳定性'], approach: '写明主次字段，数字取反表达降序，字符串沿用升序。',
    steps: ['转换数字字段。', '依三个规则构建元组键，编号不入键。', '稳定排序后逐条打印编号。'],
    time: 'O(n log n) 次比较，组名比较成本随字符数变化。', space: 'O(n) 条记录及排序辅助空间。',
    pitfall: '整条记录自带的编号不参与题目排名。', extension: '用三个稳定排序步骤重写，并用完全并列数据与元组键版对照。' }),
];
