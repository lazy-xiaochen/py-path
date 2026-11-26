import { task } from './practice.ts';
import { expressionTags } from './authoring.ts';

export const generatorProblems = [
  task(29, expressionTags[2], '入门', '按批汇总温差', {
    background: '校验员只看合格测量的净温差，不需要保留全部明细。',
    description: '每条记录包含实测温度和参考温度。选出实测温度不低于门槛的记录，并求所有「实测减参考」的总和。',
    input: '第一行 n floor，随后 n 行，每行两个整数 actual target。',
    output: '输出一个整数。没有合格记录时输出 0。',
    limits: '0 ≤ n ≤ 1500，温度和门槛均在 -500–500。合格记录仍可产生负温差。',
  }, ['4 10\n12 16\n9 0\n10 7\n13 12\n', '0\n', '仅保留 -4、3、1，净温差为零。'], [
    ['0 0\n', '0\n'], ['2 -4\n-4 -6\n-5 -7\n', '2\n'], ['2 2\n2 6\n5 10\n', '-9\n'],
  ], ['将每次读入看作按需产出一对测量。', '只在条件满足时求差，并直接交给 sum。'], `n, floor = map(int, input().split())
rows = (tuple(map(int, input().split())) for _ in range(n))
print(sum(row[0] - row[1] for row in rows if row[0] >= floor))
`, { concepts: ['生成器表达式', '按需求和', '筛选'],
    approach: '同时推迟读入和变换，sum 每次请求下一个合格温差。',
    steps: ['定义每次读取一行的生成器。', '直接按实测门槛筛选并转换。', 'sum 读到耗尽后给出净和。'],
    time: 'O(n)。', space: 'O(1) 条记录的额外工作空间。',
    pitfall: '用差值筛选会改变题意，负温差也可能达标。', extension: '再报告合格条数，用单循环避免生成器被两次消费。' }),

  task(30, expressionTags[2], '入门', '预约号扫描', {
    background: '候选编号可能覆盖十亿个位置，系统只需要最早一个满足周期与避让规则的预约号。',
    description: '在闭区间 [left, right] 找最小的编号 k，使 k % cycle == slot，且 k 的十进制编号不含字符 banned。',
    input: '一行 left right cycle slot banned，前四项是整数，banned 是一个 ASCII 数字。',
    output: '输出第一个合格编号。若区间内没有则输出「无」。',
    limits: '1 ≤ left ≤ right ≤ 10^9，1 ≤ cycle ≤ 1000，0 ≤ slot < cycle。若区间超过 100000 项，保证前 5000 项内有解。',
  }, ['15 30 3 0 1\n', '24\n', '15、18、21 含 1，第一个剩余的周期匹配是 24。'], [
    ['1 1000000000 2 0 7\n', '2\n'], ['4 8 10 3 9\n', '无\n'],
    ['7 7 1 0 7\n', '无\n'], ['8 8 1 0 7\n', '8\n'],
  ], ['range 本身不会生成整个编号列表。', '用 next 读取首个通过两个条件的编号，指定缺省值。'], `left, right, cycle, slot, banned = input().split()
left, right, cycle, slot = map(int, (left, right, cycle, slot))
candidates = (code for code in range(left, right + 1)
              if code % cycle == slot and banned not in str(code))
print(next(candidates, "无"))
`, { concepts: ['生成器与 range', 'next 默认值', '短路筛选'],
    approach: '从最早编号开始，只扫描到首次合格或区间结束，避免为余下编号建立大列表。',
    steps: ['用闭区间表达候选范围。', '先检查余数，再判断是否包含禁用字符。', 'next 取第一项或缺省输出。'],
    time: 'O(t) 次检查，t 为首解前的项数或无解时的区间项数，编号位数有界。', space: 'O(1)。',
    pitfall: '先建立列表会迫使程序尝试处理整个大区间。', extension: '计算首个可能满足余数的候选，此后每次只增加 cycle。' }),

  task(31, expressionTags[2], '基础', '增减账目一次核对', {
    background: '值班员需要在一次读取结算流水时给出总额、有效变更数、负变更数和单笔最大扣减。',
    description: '忽略所有 HOLD 以及所有零金额。对其他记录输出净额、条数、负金额条数和负金额绝对值的最大值。没有负金额时，单笔最大扣减输出 0。',
    input: '第一行 n，随后 n 行「状态 金额」，状态为 OK 或 HOLD。',
    output: '一行四个整数，按净额、有效变更数、负金额条数、单笔最大扣减的顺序输出。',
    limits: '0 ≤ n ≤ 1500，每笔金额在 -10^4–10^4。零金额即使状态 OK 也不计数。',
  }, ['6\nOK 10\nHOLD -9\nOK -3\nOK 0\nOK -5\nOK 2\n', '4 4 2 5\n', '只使用 10、-3、-5、2，单笔最大扣减为 5。'], [
    ['0\n', '0 0 0 0\n'], ['3\nHOLD 8\nOK 0\nOK 1\n', '1 1 0 0\n'],
    ['3\nOK -7\nOK -1\nOK -7\n', '-15 3 3 7\n'],
  ], ['生成器可以产出所有有效金额。', '在同一个 for 内同时更新四个数。'], `rows = (input().split() for _ in range(int(input())))
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
`, { concepts: ['一次消费', '生成器过滤', '多状态汇总'],
    approach: '一条记录只处理一次，多个统计量同时更新。单笔最大扣减按负金额绝对值计算。',
    steps: ['逐行生成字段，只转换已结算金额。', '跳过零，维护净和与条数。', '遇到负额同时维护负数条数与最大绝对值。'],
    time: 'O(n)。', space: 'O(1) 条记录的额外工作空间。',
    pitfall: '先 sum(amounts) 再循环读同一个 amounts 会少计全部后续统计。',
    extension: '增加单笔最大扣减首次出现时的原始行号，并处理并列。' }),

  task(32, expressionTags[2], '进阶', '共享游标的巡检交接', {
    background: '两位审核员通过同一份游标顺序交接。第一位抽查若干合格项，第二位从当前位置查找告警，然后汇总告警之后的合格值。',
    description: '只将读数 ≥ floor 的记录视为合格。第一阶段最多领取 k 条合格记录。第二阶段从尚未消费的合格记录查找首条读数 ≥ alarm 的记录；查找经过的记录与告警本身均已消费。第三阶段求尚未消费的合格读数之和。',
    input: '第一行 n k floor alarm，随后 n 行，每行一个整数读数。',
    output: '三行依次为抽查的原始行号（单空格连接，空为「空」）、首条告警的原始行号（没有则 0）、余下读数总和。原始记录行号从 1 开始，头部参数行不计。',
    limits: '0 ≤ n,k ≤ 1500，读数、floor、alarm 均在 -1000–1000。没有告警时第二阶段读到末尾，第三阶段为 0。',
  }, ['6 2 4 8\n2\n5\n7\n4\n8\n6\n', '2 3\n5\n6\n', '抽查消费 2、3，搜索消费 4、5，最终只剩第 6 条。'], [
    ['0 4 0 0\n', '空\n0\n0\n'], ['4 0 0 7\n1\n7\n6\n8\n', '空\n2\n14\n'],
    ['4 1 3 9\n5\n3\n8\n1\n', '1\n0\n0\n'], ['2 9 2 0\n1\n2\n', '2\n0\n0\n'],
    ['5 0 -9 -2\n-1\n-4\n-9\n-10\n2\n', '空\n1\n-11\n'],
  ], ['先在生成器中保留原行号与读数。', '第一阶段用 next 重复取值，第二阶段的生成器直接继续消费同一个游标。'], `n, k, floor, alarm = map(int, input().split())
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
`, { concepts: ['迭代器状态', '部分消费', '嵌套按需筛选', '短路'],
    approach: '写出消费边界。抽查、查找、汇总按顺序共用同一个 valid，后一步直接继承进度。',
    steps: ['为每一条输入保留从 1 开始的位置，再过滤缺测。', '领取阶段结束时不重建 valid。', '只读到命中；最后对同一 valid 求和。'],
    time: 'O(n)。', space: 'O(min(n,k)+1)，含抽查行号。',
    pitfall: '用完整列表独立执行三次搜索，会把已审阅或已匹配的记录重复纳入后续阶段。',
    extension: '增加审查顺序日志，区分因不合格被跳过与因低于告警被消费。' }),
];
