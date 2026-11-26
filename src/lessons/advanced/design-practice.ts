import { task } from './practice.ts';
import { structureTags } from './authoring.ts';

export const designProblems = [
  task(17, structureTags[4], '入门', '批量复核通行请求', {
    background: '服务台预先掌握一份通行名单，接着要连续核查许多次请求。',
    description: '按查询顺序逐条判断编号是否存在，并统计命中次数。对重复请求逐次计数。',
    input: '第一行授权代号，可为空。第二行查询代号，可为空。两行以空格分隔。',
    output: '先逐行输出命中的 YES 或未命中的 NO，最后输出命中次数。',
    limits: '每行 0–1000 项，1–12 位英数字代号，可重复，区分大小写。',
  }, ['Z A Z\nA X Z Z\n', 'YES\nNO\nYES\nYES\n3\n', '对 Z 的两次查询分别计数。'], [
    ['\nA A\n', 'NO\nNO\n0\n'], ['A Z\n\n', '0\n'], ['B A\nB A B A\n', 'YES\nYES\nYES\nYES\n4\n'],
  ], ['通行规则只关心成员是否存在。', '查询顺序有意义，直接按输入列表遍历即可。'], `allowed = set(input().split())
queries = input().split()
hits = 0
for code in queries:
    if code in allowed:
        hits += 1
        print("YES")
    else:
        print("NO")
print(hits)
`, { concepts: ['集合索引', '有序查询', '平均查找成本'], approach: '在查询以前建集合。查询保留原始次序与重复，避免扫描一遍授权表再处理下一个请求。',
    steps: ['读授权表并去重。', '顺序处理每个请求。', '命中时打印 YES 并累计，最后打印总数。'],
    time: '平均 O(n+q)。', space: 'O(n+q)，含本题按整行读取的输入。',
    pitfall: '索引移入查询循环会使每条查询都重新建集。', extension: '读取流式请求时逐条处理，使工作内存不随查询数增长。' }),

  task(18, structureTags[4], '入门', '展柜标签查询', {
    background: '一件展品可能在录入过程中更名，访客按唯一编号查询最终显示名。',
    description: '读取全部初始记录，遇到重复编号采用最后一条显示名。之后逐条查询编号。',
    input: '第一行 n q，接下来 n 行「编号 显示名」，之后 q 行各一个查询编号。',
    output: '每个查询一行，输出最终显示名，未找到写「无」。',
    limits: '0 ≤ n,q ≤ 1000。编号 1–12 位英数字，显示名 1–12 字且无空白、不会等于「无」。',
  }, ['3 4\nZ 松针\nA 海风\nZ 落雪\nZ\nA\nX\nZ\n', '落雪\n海风\n无\n落雪\n', 'Z 的最后一次记录决定前后两次查询。'], [
    ['0 2\nA\nA\n', '无\n无\n'], ['2 0\nA 山雨\nB 微光\n', ''],
    ['4 2\nX 原样\nX 次日\nY 山河\nX 修订\nX\nY\n', '修订\n山河\n'],
  ], ['需要取某编号对应的数据，选择字典。', '对同一个键反复赋值，最后的值自然保留。'], `n, q = map(int, input().split())
names = {}
for _ in range(n):
    code, name = input().split()
    names[code] = name
for _ in range(q):
    print(names.get(input(), "无"))
`, { concepts: ['键到值的映射', '覆盖', '批量查询'], approach: '直接让编号做键。查询数量增加时，仍复用同一索引。',
    steps: ['逐条读展品记录。', '写键对应显示名，覆盖过时记录。', '按查询顺序打印已存名称或缺失标记。'],
    time: '平均 O(n+q)。', space: 'O(u)，u 为不同编号数。',
    pitfall: '用 set 只能确认编号出现过，拿不到对应显示名。', extension: '要求保留每个编号的所有历史名称及首次录入位置。' }),

  task(19, structureTags[4], '基础', '跨组配对检查', {
    background: '报名记录包含队员编号和所属组。合作任务要求选出都已登记且来自不同组的两位成员。',
    description: '给定报名记录，后出现的组号覆盖同编号先前的组号。对每次查询依次判定：至少一位未登记，输出 UNKNOWN；两人最终组号相同，输出 SAME；否则输出 OK。',
    input: '第一行 n q。随后 n 行「编号 组号」，最后 q 行「编号1 编号2」。',
    output: '每次查询输出一行 UNKNOWN、SAME 或 OK。',
    limits: '0 ≤ n,q ≤ 1000。编号和组号为 1–12 位英数字。可查询同一编号，可重复登记，不保证登记和查询使用相同编号。',
  }, ['5 4\nA G1\nB G2\nC G2\nA G2\nD G1\nA B\nB X\nA A\nC D\n', 'SAME\nUNKNOWN\nSAME\nOK\n', 'A 最终是 G2。X 未登记，C 和 D 来自不同组。'], [
    ['0 2\nX Y\nX X\n', 'UNKNOWN\nUNKNOWN\n'],
    ['3 3\nA X\nB Y\nB Z\nB A\nA B\nA A\n', 'OK\nOK\nSAME\n'],
    ['2 1\nA 0\nB 0\nA B\n', 'SAME\n'],
  ], ['准备一个从编号到最终组号的索引。', '先检查两位都存在，再比较两次查出的数据。'], `n, q = map(int, input().split())
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
`, { concepts: ['索引', '多键查找', '业务规则优先级'], approach: '区分「能否读取两条记录」和「如何比较记录」。一个字典即可回答这两类问题。',
    steps: ['按编号维护最新组号。', '查询先判缺失，避免取值触发 KeyError。', '比较的是组号，不能用两个编号是否相同替代。'],
    time: '平均 O(n+q)。', space: 'O(u)，u 为不同编号数。',
    pitfall: '把两次 get 的结果直接相等比较，会把两人都缺失判成同组。', extension: '同时维护组到成员的倒排索引，让改组更新两个方向。' }),

  task(20, structureTags[4], '进阶', '场次报名核验台', {
    background: '数据结构模块测评。活动站点需要实时维护报名顺序，并记录真正发过通知的人。',
    description: '处理 JOIN 场次 编号、DROP 场次 编号、SHOW 场次和 NOTIFY 场次 编号。JOIN 新增报名或保留旧位置；DROP 移除报名，不存在时忽略，重报名排到末尾。SHOW 列当前名单。NOTIFY 只在该人当前有效且从未在该场次成功通知时成功；同一场次的通知历史在撤销与重报后保留。',
    input: '第一行 q，然后 q 行命令，字段用空格分隔。每个场次独立维护状态。',
    output: 'SHOW 输出当前报名顺序的编号，以单空格连接，空名单写「空」。NOTIFY 成功输出 SENT，已成功发送过输出 SKIP，当前无报名输出 UNKNOWN（优先于 SKIP）。最后输出一行「TOTAL 成功数」。',
    limits: '0 ≤ q ≤ 1500，场次与编号为 1–8 位英数字。输出的报名编号总数不超过 1500。一个编号可以属于多个场次，通知按场次分别计数。',
  }, ['12\nJOIN M B\nJOIN M A\nJOIN M B\nSHOW M\nNOTIFY M B\nDROP M B\nNOTIFY M B\nJOIN M B\nSHOW M\nNOTIFY M B\nJOIN N B\nNOTIFY N B\n',
    'B A\nSENT\nUNKNOWN\nA B\nSKIP\nSENT\nTOTAL 2\n', 'B 第一次参加 M 时收到通知。撤销后检查为 UNKNOWN，重报时已发记录仍在。N 可独立通知。'], [
    ['0\n', 'TOTAL 0\n'],
    ['6\nSHOW M\nDROP M B\nNOTIFY M B\nJOIN M A\nDROP M A\nSHOW M\n', '空\nUNKNOWN\n空\nTOTAL 0\n'],
    ['7\nNOTIFY M B\nJOIN M B\nJOIN M A\nNOTIFY M B\nNOTIFY M B\nNOTIFY M A\nSHOW M\n', 'UNKNOWN\nSENT\nSKIP\nSENT\nB A\nTOTAL 2\n'],
    ['6\nJOIN M A\nNOTIFY M A\nDROP M A\nJOIN M A\nNOTIFY M A\nSHOW M\n', 'SENT\nSKIP\nA\nTOTAL 1\n'],
  ], ['先写出两个独立状态：当前报名和历史通知。', '每场的当前报名用保序键，已发送的 (场次, 编号) 用集合。'], `rosters = {}
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
`, { concepts: ['嵌套字典', '插入顺序', '复合键集合', '性能分析'], approach: '定义两个状态不变量。当前名单按场次保存有效报名。通知集合只包含成功送达的场次、编号对。DROP 只影响前一个状态。',
    steps: ['JOIN 与 DROP 维护场次内有序键。', 'SHOW 按当前字典顺序输出。', 'NOTIFY 先检查有效报名，再查历史发送。', '输出唯一成功记录数。'],
    time: '平均 O(q+L)，L 为输出名单中的编号总数，编号长度有固定上界。', space: 'O(q) 个索引条目。',
    pitfall: '撤销时同时清理通知历史会造成重复发送。只检查历史优先又会让已经撤销的人误得 SKIP。',
    extension: '增加 REPORT 命令，按每场首次成功送达的顺序输出通知流水。说明需要额外保存哪一份序列。' }),
];
