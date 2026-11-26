import { task } from './practice.ts';
import { structureTags } from './authoring.ts';

export const setProblems = [
  task(13, structureTags[3], '入门', '双馆通行名单', {
    background: '两处场馆都通过登记的人可以领取双馆通行证。',
    description: '给定两份名单，找出同时出现在两份名单中的不同编号。按它们在第一份名单的首次出现顺序输出。',
    input: '两行，每行若干用空格分隔的编号，可为空行。',
    output: '用单空格连接结果，交集为空时输出「空」。',
    limits: '每行最多 500 个编号。编号为 1–12 位英数字，可重复，区分大小写。',
  }, ['C B C A D\nA C C E\n', 'C A\n', 'C 和 A 两馆都出现，C 在第一馆先登记。'], [
    ['\nA\n', '空\n'], ['B A\nX Y\n', '空\n'], ['C C B C\nB B C\n', 'C B\n'],
  ], ['先把第二条名单做成集合。', '沿第一条名单前进，用另一个集合记哪些结果已输出。'], `first = input().split()
second = set(input().split())
seen = set()
answer = []
for code in first:
    if code in second and code not in seen:
        seen.add(code)
        answer.append(code)
print(" ".join(answer) or "空")
`, { concepts: ['交集', '哈希成员判断', '保序去重'], approach: '交集关系可以在遍历中逐项检查，按第一份名单推进便能保留它的顺序。',
    steps: ['给第二份名单建集合。', '只收录同时满足在第二份出现且此前未入结果的编号。', '输出列表保留首现顺序。'],
    time: '平均 O(n+m)。', space: 'O(n+m)，含读入列表及索引。',
    pitfall: '直接遍历两个集合的交集会丢失顺序。', extension: '额外输出仅在第一份名单中出现的人，同样保留首现顺序。' },
  { kind: 'adapted', platform: 'LeetCode', id: '349', title: 'Intersection of Two Arrays', level: 'Easy',
    url: 'https://leetcode.com/problems/intersection-of-two-arrays/', concepts: ['唯一交集', '集合成员查询'],
    adaptation: '使用两行编号的标准输入，增加空名单和按第一份名单首现顺序输出的要求。' }),

  task(14, structureTags[3], '入门', '协作名单四联单', {
    background: '东馆和西馆交换志愿者名单，需要区分共享人员、各馆独有和全部覆盖。',
    description: '分别生成至少一馆、两馆共有、仅东馆、仅一馆四份唯一名单。',
    input: '两行，依次为东馆、西馆的编号，以空格分隔，可为空行。',
    output: '依次输出四行。各行按编号字典序升序，用一个空格连接，空名单写「空」。',
    limits: '每馆 0–300 条，编号为 1–12 位英数字，区分大小写，允许重复。',
  }, ['B B A X\nC B\n', 'A B C X\nB\nA X\nA C X\n', 'B 是共有人员，不出现在后两行。'], [
    ['\n\n', '空\n空\n空\n空\n'], ['\nB A X\n', 'A B X\n空\n空\nA B X\n'],
    ['X A\nX A A\n', 'A X\nA X\n空\n空\n'],
  ], ['四个问题分别对应 |、&、- 和 ^。', '每个结果先排序，再统一处理空名单。'], `east = set(input().split())
west = set(input().split())
for group in (east | west, east & west, east - west, east ^ west):
    print(" ".join(sorted(group)) or "空")
`, { concepts: ['并集', '交集', '差集', '对称差'], approach: '直接根据语义选择四种运算，统一将无序结果变为规定的序列。',
    steps: ['两份输入各去重一次。', '保持 east - west 的方向。', '按规定的四份顺序显示计算结果。'],
    time: '平均 O(n+m+u log u)，u 为并集大小。', space: 'O(n+m)。',
    pitfall: '仅一馆需要对称差，不能漏掉西馆独有成员。', extension: '增加第五行，判断东馆名单是否为西馆的真子集。' }),

  task(15, structureTags[3], '基础', '培训准入复核', {
    background: '上岗前要核对必修证书，同时报告当前证书清单里的限制标记。',
    description: '对每人输出缺失的必修项数以及命中的限制项数。只有两者均为 0 时为 PASS，其余为 REVIEW。',
    input: '前两行依次为必修、限制代号列表，允许空行。第三行 n，随后 n 行为人员编号及其已提交代号，编号之后可没有代号。',
    output: '每人一行「编号 状态 缺失数 命中数」，保持输入顺序。',
    limits: '0 ≤ n ≤ 300，每个列表最多 100 项。代号为 1–12 位英数字，可重复。某代号可以同时被列为必修与限制，仍分别计算。',
  }, ['A B\nC\n3\nP A B\nQ A C C\nR\n', 'P PASS 0 0\nQ REVIEW 1 1\nR REVIEW 2 0\n', 'Q 缺 B，重复的 C 只命中一次。'], [
    ['\n\n2\nA\nB C\n', 'A PASS 0 0\nB PASS 0 0\n'], ['A\nA\n2\nP A\nQ\n', 'P REVIEW 0 1\nQ REVIEW 1 0\n'],
    ['A A B\nX X\n1\nP A A\n', 'P REVIEW 1 0\n'],
  ], ['分别求 required - actual 与 actual & blocked。', '若只判断通过，可同时检查子集关系和无交集。'], `required = set(input().split())
blocked = set(input().split())
for _ in range(int(input())):
    fields = input().split()
    actual = set(fields[1:])
    missing = required - actual
    hits = actual & blocked
    status = "PASS" if not missing and not hits else "REVIEW"
    print(fields[0], status, len(missing), len(hits))
`, { concepts: ['差集', '交集', '子集', '无交集'], approach: '分别保留缺失与冲突的具体集合，让通过判断和数字报告取自同一结果。',
    steps: ['建立必修和限制集合。', '按人逐个把证书去重，算缺失与冲突。', '只在两个集合均为空时通过。'],
    time: '平均 O(r+b+n(r+1)+t)，r、b 为两份要求的输入项数，n 为人数，t 为全部提交项数。', space: 'O(r+b+a)，a 为单人最多提交项数。',
    pitfall: '两张证书数量正确不代表证书内容正确。检查实际成员。', extension: '输出缺失与冲突的代号，帮助工作人员修订。' }),

  task(16, structureTags[3], '进阶', '只参加过一期的访客', {
    background: '回访计划面向仅参加过一期活动的人。每期开卡机可能为同一人生成多条记录。',
    description: '找出只出现在恰好一期的人员，按编号升序输出。某人在同一期重复出现仍算一期。',
    input: '第一行 w，接下来 w 行，每行一期的访客编号列表，可为空行。',
    output: '单空格连接结果，没人符合时输出「空」。',
    limits: '0 ≤ w ≤ 60，每期最多 500 个编号，各编号为 1–12 位英数字。输入总量不超过 2000 条。',
  }, ['3\nC C A B\nB A\nA D\n', 'C D\n', 'A 出现三期，B 出现两期，只有 C 和 D 各出现一期。'], [
    ['0\n', '空\n'], ['2\nX X\n\n', 'X\n'], ['3\nX\nX\nX\n', '空\n'],
    ['3\nZ Y\nZ Y\n\n', '空\n'],
  ], ['每一期单独去重。', '记录以前出现过的人，以及已被至少两期命中的人。'], `seen = set()
repeated = set()
for _ in range(int(input())):
    current = set(input().split())
    repeated.update(seen & current)
    seen.update(current)
print(" ".join(sorted(seen - repeated)) or "空")
`, { concepts: ['分批去重', '交集', '状态不变量'], approach: '每读完一期，seen 表示至少一期，repeated 表示至少两期。处理下一期时先看它跟之前的重合。',
    steps: ['从当期刷卡记录建立集合。', '与先前 seen 求交，将这些编号记作至少两期。', '并入当期成员，最后从 seen 排除 repeated。'],
    time: '平均 O(w+t+k log k)，t 是所有刷卡记录数，k 是结果数。', space: 'O(u)，u 是全程不同编号数。',
    pitfall: '把所有期依次做对称差会得到奇数次，而不是恰好一次。', extension: '按期数分桶，分别输出参加恰好一次、恰好两次和三次以上的访客。' }),
];
