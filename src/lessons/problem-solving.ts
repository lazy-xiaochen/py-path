import type { Chapter } from '../teaching-types';

export const problemSolving: Chapter = {
  goals: [
    '【独立使用】从需求写出输入、输出与产物约定，按数据规模选择逐项扫描、排序或枚举。',
    '【独立使用】让入口负责文件与输出，让辅助模块解析、验证、累计和排序。',
    '【独立使用】写下小样例的期望，用正常、空数据、重复并列与无效行验证输出与文件。',
    '【理解】说明每个状态的含义，能判断规则变化该改哪一层，并用独立慢解核对算法。',
  ],
  prerequisites: '依次完成第 1–8 课的输入输出、数据容器与函数，能按第 9–11 课拆模块、读写文件并处理预期异常。本课会把这些能力用在同一个可运行案例上。',
  version: '示例以平台的 Python 3.12 为准。提交依据标准输出。样例只是第一组检查，还要测试题面允许的边界。',
  topics: [
    {
      title: '把题面写成可以核对的规则',
      explanation: [
        '先回答三件事。每条输入代表什么，程序最后要输出什么，哪些条件与边界会改变结果。把“至少”“严格超过”“第一次”“并列”这些词各写成一句规则，落实到比较符号或顺序。先从小数据手算，不急于写循环。',
        '同样一组数字可能对应不同任务。例如把每批包裹分车后加总，与先合并再分车不是一回事。先弄清可否合并、统计每一条还是统计整体、空输入需要什么输出。这些是算法的前提。',
        '编程题接口也是契约。按照题面读对行数和字段，输出严格要求的值。手算时保留一个单元素或恰好达到阈值的反例，检查程序实现是否保留了题意。',
        '遇到 full + (1 if remaining else 0)，先把它展开为 if remaining != 0: full += 1，最后 return full。P024 中连续段的 length 也可以显式写成达标就加一、否则归零，再决定何时更新历史最佳。先用能逐步手推的写法验证，熟悉后再阅读一行式。',
      ],
      examples: [
        {
          id: 'solve-threshold', title: '把至少达标写成含等号的比较', level: '起步',
          source: 'def total_qualified(values, limit):\n    total = 0\n    for value in values:\n        if value >= limit:\n            total += value\n    return total\n\nlimit = int(input())\nvalues = list(map(int, input().split()))\nprint(total_qualified(values, limit))',
          input: '6\n3 9 6 11\n', output: '26\n',
          purpose: '把“累计至少达到阈值的读数”拆成筛选和求和，用相等项检验规则。',
          steps: ['阈值为 6，四项中 3 排除。', '6 恰好达标，与 9 和 11 一起累计。', '函数返回 26。若规则改为严格大于，去掉等号后会得到 20。'],
          pitfall: '所有读数都比阈值大或小时，两种比较可能输出一样。要专门放入恰好相等的值。',
        },
        {
          id: 'solve-separate-trips', title: '先决定分批规则，再计算车次', level: '应用',
          source: 'def trips_for(amount, capacity):\n    full, remaining = divmod(amount, capacity)\n    return full + (1 if remaining else 0)\n\ncapacity = int(input())\nbatches = list(map(int, input().split()))\ntrips = [trips_for(amount, capacity) for amount in batches]\nprint(*trips)\nprint(sum(trips))',
          input: '4\n0 4 5\n', output: '0 1 2\n3\n',
          purpose: '每辆车只装同一批的箱子。分别报告各批车次和总数，容量为正，箱数非负。',
          steps: ['divmod 返回整车数和余下的箱数。箱数为 0 时不发车。', '4 箱正好用 1 车，5 箱需要 1 整车再加 1 车。', '得到各批 0、1、2 车，总和为 3。可换成两批各 1 箱，观察与合装的区别。'],
          pitfall: '先合并箱子会允许不同批次同车，违反规则。整除后无条件加 1 又会让整车或空批多出一车。',
        },
      ],
    },
    {
      title: '给状态起名字，检查循环每一步保持的事实',
      explanation: [
        '一次扫描常能解决累计、连续段和最值题。给每个变量写一句含义。例如“处理到当前项时，best 保存已见的最大得分”就是一个在每次更新后都应成立的事实。先确定初值，再规定每条新记录怎样影响它，最后根据题意输出。',
        '保存当前位置与保存最佳答案是不同的事。处理连续段时，当前段断开就归零，历史最佳仍保留。排名并列要取最早项时，按输入顺序扫描，只有遇到严格更好的一项才替换。用两个并列项手算可以查出更新条件写错的问题。',
        '键值关系则用字典保存。要找某项的首次位置，看到它时若尚未出现就记录；遇到已有键时，保留第一次的位置。状态含义决定重复数据究竟要累加、忽略还是覆盖。',
        'P070 的合并可以先写基础版：遍历第一份清单累计各时刻的第一列次数，再遍历第二份累计第二列次数，最后按时刻排序输出。读参考解时为两边分别维护 i、j，表示第一项未处理的位置。每轮挑较小的未读时刻、吃完两边的同值项。先检查某一侧未耗尽再取下标，并确认每轮至少推进一个指针。',
      ],
      examples: [
        {
          id: 'solve-earliest-max', title: '一次扫描保留最早的最高分', level: '起步',
          source: 'scores = list(map(int, input().split()))\nbest_index = 0\nfor index in range(1, len(scores)):\n    if scores[index] > scores[best_index]:\n        best_index = index\nprint(best_index + 1, scores[best_index])',
          input: '-4 -2 -2 -9\n', output: '2 -2\n',
          purpose: '输入为非空整数列表。初值使用第一项，避免把不存在的 0 当成最高分。',
          steps: ['目前的最佳位置初始化为第一项。', '第二项 -2 更大，更新最佳位置。第三项同为 -2，保留已有位置。', '输出时将 0 基索引转换为从 1 开始的位置。'],
          pitfall: '将 > 写成 >= 会把并列答案换到更晚的位置。初值来自真实数据，才能正确处理全负输入。',
        },
        {
          id: 'solve-first-repeat', title: '查找最早发生的重复登记', level: '应用',
          source: 'def find_repeat(codes):\n    first_positions = {}\n    for position, code in enumerate(codes, start=1):\n        if code in first_positions:\n            return first_positions[code], position\n        first_positions[code] = position\n    return 0, 0\n\nprint(*find_repeat(input().split()))',
          input: 'A C A C\n', output: '1 3\n',
          purpose: '扫描到首个重复发生处就返回它的首次位置与当前位置。没有重复时输出 0 0。',
          steps: ['A 和 C 分别记录首次出现的位置 1 和 2。', '第 3 项 A 已存在，立刻返回 (1, 3)。', '每个已扫描键记录的是第一次出现位置。后面的 C 重复发生得更晚，无需再检查。'],
          pitfall: '应在写入前判断是否已有键。如果每次先覆盖，读出的“首次”位置就会变为当前位置。',
        },
      ],
    },
    {
      title: '拆分计算，按规模选择扫描、排序或枚举',
      explanation: [
        '先写一个只做核心计算的函数，接收已准备好的数据并返回计算结果。外层负责 input 和 print。这样可以直接给函数固定数据做手算检查，也更容易把它复用在其他项目。',
        '数据范围告诉你能做多少工作。扫描 n 项一次用 O(n) 步；排序一般按 O(n log n) 考虑；两个独立选择若逐一枚举，步骤约是两种选择数量的乘积。某个条件能从第一个选择推导出第二个选择时，可以减少不必要的组合。',
        '挑最佳方案时先判断是否可行，再比较排序键。Python 元组按从左到右依次比较，第一项相同才比第二项。用 (-分数, 名称) 排序可让分数大的排前，分数相同时名称升序。始终把题意与比较键的顺序一项项对照。',
        '展台案例只需计每个展台的合计。可以用字典一遍扫描记录，再只给满足门槛的展台排序。若共有 n 条记录、k 个合格展台，读取和累计约 n 次，排序规模是 k。小数据的独立慢解可先列出每个展台，再针对它逐条回数，用来检查快速累计有没有漏掉重复记录。',
      ],
      examples: [
        {
          id: 'solve-frame-options', title: '从小范围枚举找到合格画框', level: '起步',
          source: 'def choose_frame(required):\n    best = None\n    for width in range(3, 6):\n        for height in range(4, 8):\n            area = width * height\n            if area >= required:\n                option = (area, width, height)\n                if best is None or option < best:\n                    best = option\n    return best\n\nframe = choose_frame(int(input()))\nif frame is None:\n    print("无方案")\nelse:\n    _, width, height = frame\n    print(width, height)',
          input: '20\n', output: '4 5\n',
          purpose: '宽度 3–5、高度 4–7。满足最小面积后，先选面积最小者，再选宽度较小者。',
          steps: ['按小范围枚举宽、高组合。有 3 × 4 种候选。', '过滤面积不足的组合。4 × 5 和 5 × 4 都恰好是 20，宽度 4 更靠前。', '只有更小的可行排序键才替换 best。None 表示遍历完都没有方案。'],
          pitfall: '找到第一个达标组合就结束，未必面积最小。若选项很多，先估算候选的乘积，再决定是否枚举所有组合。',
        },
        {
          id: 'solve-signups-ranking', title: '先定排名规则，再用命名函数排序', level: '应用',
          source: 'def ranking_key(record):\n    name, score = record\n    return -score, name\n\nrecords = []\nfor _ in range(int(input())):\n    name, score = input().split()\n    records.append((name, int(score)))\nfor name, score in sorted(records, key=ranking_key):\n    print(name, score)',
          input: '4\nC 3\nA 2\nB 3\nD 0\n', output: 'B 3\nC 3\nA 2\nD 0\n',
          purpose: '用一个可以单测的函数表示“分数降序、同分按名称升序”。',
          steps: ['读入文本名称和整数分数组成元组。', '排序时用每条记录的 (-score, name) 作为比较键。分数 3 对应 -3，排在 -2 前。', '同为 -3 时比较名称，B 在 C 前。循环输出原来的名称与正向分数。'],
          pitfall: '直接对整个排序键 reverse=True 会让名字也逆序。仅给要降序的数字取负。',
        },
      ],
    },
    {
      title: '用独立自测验证，最后检查提交接口',
      explanation: [
        '先写几组可预期的小数据，再写代码。用普通值看主路径，最小规模看初值，临界相等看比较符号，重复和平局看更新条件。每组写下期望值，运行时直接比对。',
        '若有一个容易理解的慢算法，可以在小数据上作为独立对照。它的工作是帮助检查较快算法，并不一定适合作为正式提交。两套做法不要依赖同一个可疑条件，否则会一起犯错。出问题时保留最小反例，再查哪一步开始错。',
        '最后沿真实入口试一遍。检查每次 input 对应哪一行、是否有额外提示语、输出是否有多余字段。点试跑样例是调试，只有提交评测过完全部用例才记录通过。两个综合项目还需要自测文件读回、重复记录和空结果。',
        '综合跟做任务是生成「展台领取汇总」。标准输入是一行非负整数门槛。随附 claims.txt 每行写展台代号和正整数领取量，以空白分隔。空白行直接跳过，字段数量不对、小数文本或非正整数均计为无效记录。先按代号合计，再保留达到门槛的代号，数量降序，同量按代号升序。标准输出列入选和无效数量，并显示 claim_report.csv 的真实内容。无入选也写表头。',
        '先手推样例。A 的两笔 2 和 1 合计 3，B 的一笔为 3，C x、D -1 各是一条无效，空行不计。门槛 3 使 A、B 都入选，按代号打破平局。记录内容和报表行分开表示，字典保存合计，列表存待排序的 (代号, 合计)。',
      ],
      examples: [
        {
          id: 'solve-boundary-checks', title: '用三组数据自测需要补的座位', level: '起步',
          source: 'def seats_to_add(people, ready):\n    return max(0, people - ready)\n\nchecks = [((0, 5), 0), ((6, 6), 0), ((6, 5), 1)]\nfor arguments, expected in checks:\n    actual = seats_to_add(*arguments)\n    assert actual == expected, (arguments, actual, expected)\nprint(len(checks), "组通过")',
          input: '', output: '3 组通过\n',
          purpose: '从剩余量小于、等于和大于零三个状态检查同一个函数。',
          steps: ['将函数实参与期望值成对保存。*arguments 把两个参数分开传给函数。', 'assert 对照实际结果与期望。改错时，失败会指出是哪组参数。', '三条测试都通过再打印统计。正式做题时可保留核心函数，用题目的输入和输出替代这个自测入口。'],
          pitfall: '只测人数多于座位会漏掉应返回 0 的情况。这个自测的输出不是任何在线评测题要求的结果。',
        },
        {
          id: 'solve-independent-check', title: '用逐对枚举检查一次扫描的计数', level: '应用',
          source: 'def fast_pairs(codes):\n    seen = {}\n    pairs = 0\n    for code in codes:\n        earlier = seen.get(code, 0)\n        pairs += earlier\n        seen[code] = earlier + 1\n    return pairs\n\n\ndef by_pairs(codes):\n    pairs = 0\n    for left in range(len(codes)):\n        for right in range(left + 1, len(codes)):\n            if codes[left] == codes[right]:\n                pairs += 1\n    return pairs\n\ncases = [[], ["A"], ["A", "B", "A"], ["A", "A", "A", "B", "B"]]\nfor codes in cases:\n    assert fast_pairs(codes) == by_pairs(codes), codes\nprint(len(cases), "组一致")',
          input: '', output: '4 组一致\n',
          purpose: '同类的每对下标只计一次。两种计算使用不同思路，方便发现遗漏或重复。',
          steps: ['直接算法枚举 left < right 的每对下标。对最后一组，三个 A 产生三对，两个 B 产生一对。', '扫描算法遇到新项时，只加上已见的同类数。每对恰在后出现的一项到达时被计算。', '用空列表、单元素、隔项重复和多类重复对照，四组一致。'],
          pitfall: '若先把当前计数加一再累加，会把元素和自身算成一对。直接枚举适合小样本验证，大输入优先一次扫描。',
        },
        {
          id: 'solve-claim-report', title: '拆模块完成展台汇总并核对 CSV 文件', level: '应用',
          source: 'import csv\nfrom claim_rules import select_rows, summarize\n\n\ndef main():\n    minimum = int(input())\n    with open("claims.txt", encoding="utf-8") as source:\n        totals, invalid = summarize(source)\n    rows = select_rows(totals, minimum)\n\n    with open("claim_report.csv", "w", encoding="utf-8", newline="") as target:\n        writer = csv.writer(target, lineterminator="\\n")\n        writer.writerow(["展台", "合计"])\n        writer.writerows(rows)\n\n    print("入选", len(rows))\n    print("无效", invalid)\n    with open("claim_report.csv", encoding="utf-8", newline="") as report:\n        print(report.read(), end="")\n\n\nif __name__ == "__main__":\n    main()\n',
          files: [
            { name: 'claim_rules.py', content: 'def parse_claim(text):\n    fields = text.split()\n    if len(fields) != 2:\n        raise ValueError("需要展台和数量两个字段")\n    booth, raw = fields\n    quantity = int(raw)\n    if quantity <= 0:\n        raise ValueError("每笔数量必须为正")\n    return booth, quantity\n\n\ndef summarize(source):\n    totals = {}\n    invalid = 0\n    for line in source:\n        if not line.strip():\n            continue\n        try:\n            booth, quantity = parse_claim(line)\n        except ValueError:\n            invalid += 1\n        else:\n            totals[booth] = totals.get(booth, 0) + quantity\n    return totals, invalid\n\n\ndef rank_key(row):\n    booth, total = row\n    return -total, booth\n\n\ndef select_rows(totals, minimum):\n    rows = []\n    for booth, total in totals.items():\n        if total >= minimum:\n            rows.append((booth, total))\n    return sorted(rows, key=rank_key)\n' },
            { name: 'claims.txt', content: 'A 2\nB 3\nA 1\nC x\nD -1\n\n' },
          ],
          input: '3\n', output: '入选 2\n无效 2\n展台,合计\nA,3\nB,3\n',
          purpose: '从需求和手算出发，在编辑器切换 main.py、claim_rules.py、claims.txt 跟做，最后以读回内容核查真实产物。',
          steps: [
            '先沿 main.py 跟踪标准输入和打开的文件。claim_rules.py 用 parse_claim 校验单条记录，summarize 只捕获能跳过的数据异常，累加发生在成功路径。文件自身无法读取会继续报错。',
            'select_rows 按合计筛选，再用 (-total, booth) 排序。入口用 CSV 写表头和候选列表，关闭写入后重新打开输出产物。样例 A 和 B 合计相同，按代号排序。',
            '预测再改输入。改门槛到 4，预期入选 0、无效 2、只剩表头。清空 claims.txt，预期入选和无效均为 0。',
            '回到原样例，另试 claims.txt 只含 A 2 和 B 1、门槛 1，两笔都入选且按数量排。再将首条改为 A 2 extra，预期它计为无效，B 仍写入。恢复样例，比较修改前后的 CSV 跟手算是否一致。',
            '规则改为严格超过门槛，修改 select_rows 的比较；若同量要较大代号优先，调整排序策略；若数量字段改为允许 0，则改 parse_claim。只改 CSV 表头和输出标签时，处理入口即可。',
          ],
          pitfall: '在解析完成前写 totals 会留下部分记录。把筛选提到累计之前又会漏掉单笔不足门槛、合计后达标的展台。',
        },
      ],
    },
  ],
  exercises: [
    {
      kind: 'question', id: 'solve-equal-boundary', legacy: 'explain', goal: '识别区分两个相近规则的临界值。',
      prompt: '从“大于上限”改成“至少达到上限”，哪个值能区分这两种规则？', answer: 1,
      options: [
        { label: '值小于上限', feedback: '两种规则都拒绝。只用这个值不能区分它们。' },
        { label: '值等于上限', feedback: '严格大于会拒绝，至少达到会接纳。相等值是区分点。' },
        { label: '值大于上限', feedback: '两种规则都接纳。需要选择会触发不同判断的输入。' },
      ],
    },
    {
      kind: 'question', id: 'solve-keep-first-tie', legacy: 'predict', goal: '从更新条件推断并列时保留哪一项。',
      prompt: '并列取较早者，按输入顺序找最大值时应何时替换当前最佳项？', answer: 0,
      options: [
        { label: '只在严格更好时更新', feedback: '遇到同样的值不替换，因此最早的最大项会保留。' },
        { label: '相等也更新', feedback: '同分时不断替换，最终留下最晚的那个。' },
        { label: '只在更差时更新', feedback: '这与找最大值的目的相反。先明确更优如何比较。' },
      ],
    },
    {
      kind: 'question', id: 'solve-current-vs-history', goal: '分开维护当前状态与历史答案。',
      prompt: '下面循环每轮打印当前连续命中长度和历史最长长度，最后一轮输出什么？', answer: 2,
      demonstration: { source: 'current = best = 0\nfor hit in [True, True, False, True]:\n    current = current + 1 if hit else 0\n    best = max(best, current)\n    print(current, best)', input: '', output: '1 1\n2 2\n0 2\n1 2\n' },
      options: [
        { label: '1 1', feedback: '最后一轮当前长度是 1，但历史最长仍是 2。' },
        { label: '3 3', feedback: '共有三次命中，中间一次失败使连续段断开，不能将两段相加。' },
        { label: '1 2', feedback: '失败时当前长度清零。最后重新得到长度 1，历史仍保留前两次的长度 2。' },
      ],
    },
    {
      kind: 'question', id: 'solve-filter-before-choice', goal: '先过滤不合格项，再进行择优比较。',
      prompt: '目标是选出耗时不超过 4 的最低价方案。为什么程序最终会输出 B？', answer: 1,
      demonstration: { source: 'def price(item):\n    return item[1]\n\noptions = [("A", 1, 5), ("B", 3, 4), ("C", 4, 2)]\nvalid = [item for item in options if item[2] <= 4]\nprint(min(valid, key=price)[0])', input: '', output: 'B\n' },
      options: [
        { label: 'A 虽然更便宜，但名称排在 B 后面', feedback: '名称顺序没有参与选择。要先检查耗时。' },
        { label: 'A 超出耗时限制，B 在合格方案中更便宜', feedback: '不超过 4 包含恰好等于 4。B、C 合格，再按价格找最小。' },
        { label: '因为 Python 总取列表第二项', feedback: 'min 用 key 给出的价格比较，不固定取某个位置。改变输入顺序依然会选择 B。' },
      ],
    },
    { kind: 'coding', problem: 'P023', level: '基础编程', goal: '分开累计、阈值筛选和排序，验证恰好等于阈值的记录。' },
    { kind: 'coding', problem: 'P067', level: '基础编程', goal: '找出限制产量的材料，保留用量为零的类别并计算剩余。' },
    { kind: 'coding', problem: 'P024', level: '综合应用', goal: '维护当前长度与历史最佳，用并列和末尾连续段进行复测。' },
    { kind: 'coding', problem: 'P068', level: '综合应用', goal: '给每个编号维护最后一次接受的时刻，确认拒绝请求不改变历史。' },
    { kind: 'coding', problem: 'P069', level: '拓展挑战', goal: '用整除关系推导第二种物料数量，从可行方案中按优先级选最优。' },
    { kind: 'coding', problem: 'P070', level: '拓展挑战', goal: '用双指针归并已排序数据，正确处理连续重复和一边先读完的情况。' },
  ],
  mistakes: [
    { symptom: '常规样例正确，却在相等或空输入时失败。', reason: '实现前没有写出最小值及比较边界。', fix: '先记录题意里的空结果、相等值、并列和下标起点。', check: '对每条规则设计一个能区分两种写法的输入。' },
    { symptom: '当前一段中断后，历史最佳也丢失了。', reason: '同一变量承担了当前进度和答案两种职责。', fix: '拆成分别表示当前状态和历史状态的变量。', check: '手推“较长的一段、断开、较短的一段”并列出每轮值。' },
    { symptom: '找到一种可行方案后结束，结果并非最优。', reason: '只检查限制，没有核对其余候选或比较优先级。', fix: '定义候选有效条件和最优比较规则，之后再做筛选。', check: '安排早出现的候选可行但较差，以及后出现的并列候选。' },
    { symptom: '函数自测成功，在评测中多出一行输出。', reason: '调试或输入提示仍留在正式入口。', fix: '保留计算函数，只让入口按题目格式读写。', check: '用样例试跑比较期望与实际，再提交运行全部用例。' },
  ],
  summary: [
    '能从需求写出每条输入、边界规则、标准输出和产物格式，并先手算一组正常与一组边界数据。',
    '能区分入口与工具职责，用列表和字典记录状态，按数据规模选扫描、排序或枚举，再用小数据慢解独立核对。',
    '能在多文件程序中检查原文件、写出并读回产物，定位异常所在层，确认无效记录未改变成功状态。',
    '进入项目之前，可以口头解释一条记录如何经过读取、校验、累计和输出；再只改一条业务规则，并把旧的正常、空、重复与无效用例重跑。',
  ],
  next: '综合项目「命令行记账本」可以沿用验证金额、失败跳过、分类累计、读回 CSV 的做法。「文本词频统计」可复用文件读取、逐键计数与并列排序。先写下正常、空文本或空账本、重复项和边界的预期，再在对应项目工作区独立实现。',
  references: [
    { title: 'Python 3.12 官方教程 · 定义函数', url: 'https://docs.python.org/3.12/tutorial/controlflow.html#defining-functions', note: '核对把可复用计算独立为函数，以及参数与返回值。' },
    { title: 'Python 3.12 官方指南 · 排序键', url: 'https://docs.python.org/3.12/howto/sorting.html#key-functions', note: '核对为每条记录计算比较键，并按键排序原记录。' },
    { title: 'Python 3.12 内置函数 · divmod', url: 'https://docs.python.org/3.12/library/functions.html#divmod', note: '核对整数情况下商和余数的定义。' },
    { title: 'Python 3.12 语言参考 · assert', url: 'https://docs.python.org/3.12/reference/simple_stmts.html#the-assert-statement', note: '核对开发时断言的条件、失败信息和优化模式差异。' },
    { title: 'Python 3.12 教程 · 模块作为脚本运行', url: 'https://docs.python.org/3.12/tutorial/modules.html#executing-modules-as-scripts', note: '核对入口读取输入与辅助模块复用的分工。' },
    { title: 'Python 3.12 语言参考 · try', url: 'https://docs.python.org/3.12/reference/compound_stmts.html#the-try-statement', note: '核对捕获单条解析失败和仅在成功后累计。' },
    { title: 'Python 3.12 标准库 · csv.writer', url: 'https://docs.python.org/3.12/library/csv.html#csv.writer', note: '核对写入表头和成批写入记录，以及文件的换行设置。' },
  ],
};
