import type { Problem } from '../../content';
import { functionTags } from './authoring.ts';
import { task } from './practice.ts';
import { labelOutputBoundary } from './output-boundaries.ts';

const receiptTag: Problem = {
  ...task(38, functionTags[0], '入门', '隔离小票标签',
    { background: '小票编辑器在同一进程里连续调用标签函数，后一单不能继承上一单的内容。',
      description: '修复起始代码，使每次调用 receipt_tag(name) 都返回当前箱号前加 BOX: 的结果。',
      input: '评测器直接调用 receipt_tag(name)，同一组可能连续调用多次。无需读取输入。',
      output: '返回字符串 BOX:箱号。函数调用和模块导入均不打印内容。',
      limits: '箱号为 1–12 位英数字，重复箱号也必须独立处理。' },
    ['', '', '该次调用只处理 A2。', { calls: [{ args: ['A2'], expected: 'BOX:A2' }] }],
    [
      ['', '', { calls: [{ args: ['A'], expected: 'BOX:A' }, { args: ['B'], expected: 'BOX:B' }] }],
      ['', '', { calls: [{ args: ['X'], expected: 'BOX:X' }, { args: ['X'], expected: 'BOX:X' }] }],
      ['', '', { calls: [{ args: ['00'], expected: 'BOX:00' }, { args: ['b'], expected: 'BOX:b' }] }],
    ],
    ['尝试在一次导入后调用函数两次。', '只需要一个标签时可以直接构造文本；需要列表时，可在函数体内创建。'],
    `def receipt_tag(name):
    return "BOX:" + name
`,
    { concepts: ['默认对象', '重复调用', 'return'], approach: '本次小票只依赖传入的箱号，移除跨调用存储。',
      steps: ['由形参取得当前箱号。', '拼接指定前缀。', '使用 return 交给调用方。'],
      time: 'O(s)，s 为箱号长度。', space: 'O(s) 返回结果。',
      pitfall: '复用默认列表会让第二个调用带上上一单的箱号。', extension: '增加可选的标签表参数，区分省略与明确提供空列表。' }),
  contract: { kind: 'function', files: ['main.py'], target: { module: 'main', name: 'receipt_tag' } },
  starterFiles: [{ name: 'main.py', content: `def receipt_tag(name, labels=[]):
    labels.append(name)
    return "BOX:" + ",".join(labels)
` }],
};

export const functionParameterProblems = [
  task(37, functionTags[0], '入门', '分开商品款和包装费',
    { background: '寄件单分别显示商品款与最终应付。包装费可采用默认值或为某单覆写。',
      description: '每笔商品款等于数量乘单价，应付为商品款加包装费。未填包装费时使用 2。',
      input: '首行 q。随后 q 行，每行给数量、单价，可附第三项包装费。',
      output: '每单一行两个整数，依次为商品款与应付。',
      limits: '0 ≤ q ≤ 200，其余整数均为 0–1000。显式 0 表示免包装费。' },
    ['3\n3 5\n3 5 0\n0 8 7\n', '15 17\n15 15\n0 7\n', '第二笔显式免包装费，第三笔只有包装费。'],
    [['0\n', ''], ['1\n1 0\n', '0 2\n'], ['2\n1 9 2\n1 9 3\n', '9 11\n9 12\n']],
    ['让包装费形参带默认值。', '根据数据列数决定是否提供第三个实参。'], `def bill(quantity, price, packing=2):
    subtotal = quantity * price
    return subtotal, subtotal + packing

for _ in range(int(input())):
    fields = list(map(int, input().split()))
    merchandise, due = bill(*fields)
    print(merchandise, due)
`, { concepts: ['默认形参', '位置展开', '元组返回'], approach: '函数负责计算，入口解析列并解包结果。',
      steps: ['将每单读成整数列表。', '位置展开两项或三项。', '解包商品款、应付并输出。'],
      time: 'O(q)。', space: 'O(1) 每单空间。', pitfall: '显式的 0 要按原值使用。', extension: '增加只能按名字传入的税率。' }),

  receiptTag,

  task(39, functionTags[0], '基础', '预览或提交标签',
    { background: '库房的标签预览仅生成草稿，提交才改变正式名单。',
      description: '对 PREVIEW 标签输出追加后的草稿，正式名单保持原样。对 COMMIT 标签追加到正式名单并输出。最后输出正式名单。',
      input: '首行为现有标签，空格分隔，可为空。第二行 q，后续 q 行是动作与标签。',
      output: '逐条输出名单，末尾再输出正式名单。名单元素用逗号连接，空名单写 NONE。',
      limits: '现有标签数、q 均为 0–100。标签为 1–10 位 ASCII 英数字，重复项保留。每条操作输出的名单和最后的正式名单都要计入预算：每行计 max(1, 该行标签数)，合计不得超过 5957。可按输入顺序维护正式名单长度，预览不增加它。每个计数单位最多 11 字节，总输出不超过 65527 字节。' },
    ['A\n3\nPREVIEW X\nCOMMIT B\nPREVIEW Y\n', 'A,X\nA,B\nA,B,Y\nA,B\n', 'X 和 Y 只出现在预览。'],
    [['\n0\n', 'NONE\n'], ['\n2\nPREVIEW A\nPREVIEW B\n', 'A\nB\nNONE\n'], ['Z\n2\nCOMMIT Z\nPREVIEW A\n', 'Z,Z\nZ,Z,A\nZ,Z\n'],
      ['\n6\nPREVIEW A\nCOMMIT B\nPREVIEW C\nCOMMIT C\nPREVIEW A\nCOMMIT B\n', 'A\nB\nB,C\nB,C\nB,C,A\nB,C,B\nB,C,B\n'],
      [labelOutputBoundary.input, labelOutputBoundary.output]],
    ['预览时复制外层列表即可。', '在公共函数里先选定要修改的对象，再 append。'], `def updated(tags, label, *, commit):
    target = tags if commit else tags.copy()
    target.append(label)
    return target

current = input().split()
for _ in range(int(input())):
    action, label = input().split()
    print(",".join(updated(current, label, commit=action == "COMMIT")))
print(",".join(current) or "NONE")
`, { concepts: ['对象引用', '原地修改', '浅拷贝'], approach: '提交和预览共用追加逻辑，由选定的目标对象决定副作用。',
      steps: ['读取正式名单。', '提交沿用原名单，预览另取一个浅副本。', '打印各操作结果，再读原名单核对状态。'],
      time: 'O(q(n+q)+n)，n 为初始标签数。', space: 'O(n+q)。',
      pitfall: '把预览返回值赋给 current 会使正式名单指向草稿。', extension: '增加标签撤回，并分别输出预览和撤回后的结果。' }),

  task(40, functionTags[0], '进阶', '多窗口流水结算',
    { background: '每个窗口独立结算，撤回单只计无效，退款作为负金额影响净额。',
      description: '每窗口计算收入、净额和无效单数。状态 OK 且金额绝对值不超过该窗口上限为有效。有效正金额计入收入，全部有效金额计入净额。',
      input: '首行窗口数 w。每窗口先有一行 n cap，再有 n 行「OK 或 VOID 金额」。',
      output: '逐窗口输出「收入 净额 无效单数」，最后一行以相同格式输出所有窗口合计。',
      limits: '0 ≤ w ≤ 30，0 ≤ n ≤ 50，0 ≤ cap ≤ 10000，金额在 -10000–10000。' },
    ['2\n4 8\nOK 8\nOK -6\nOK 9\nVOID 0\n1 5\nOK -5\n', '8 2 2\n0 -5 0\n8 -3 2\n', '第一窗收入 8，净额只计 8 与 -6。'],
    [['0\n', '0 0 0\n'], ['1\n2 0\nOK 0\nOK -1\n', '0 0 1\n0 0 1\n'], ['2\n0 2\n2 2\nOK -2\nVOID -2\n', '0 0 0\n0 -2 1\n0 -2 1\n']],
    ['计算函数返回固定的三个值。', '窗口入口解包后，各自更新跨窗口的合计。'], `def summarize(entries, cap):
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
`, { concepts: ['元组契约', '参数传递', '局部累计'], approach: '每个窗口独立求值，主程序再合并三个结果。',
      steps: ['把窗口输入制成记录表。', '使用窗口上限区分有效和无效，再累计原金额。', '输出本窗口的值并累计到最终报告。'],
      time: 'O(w+N)，N 为全部记录数。', space: 'O(m)，m 为最大窗口记录数。',
      pitfall: '收入和净额分开更新，退款只改变净额。', extension: '同时返回每组拒绝的原始行号，按窗口生成审核日志。' }),

  task(41, functionTags[1], '入门', '包间与候补配额',
    { background: '场地方分别接收实际席位请求和原有候补数，超出包间容量的请求进入候补。',
      description: '确认可坐下的人数及总候补数。总候补包含已有候补，以及新请求中超容量的人。',
      input: '首行 q。随后 q 行分别为 capacity requested 和可选的 standby，省略 standby 时为 0。',
      output: '每行两个整数「确认人数 总候补」。',
      limits: '0 ≤ q ≤ 250，其余整数为 0–1000。建议容量按位置传，requested 与 standby 按关键字传。' },
    ['3\n3 5\n4 3 2\n0 1 4\n', '3 2\n3 2\n0 5\n', '第一批有两人超容量。'],
    [['0\n', ''], ['1\n3 3\n', '3 0\n'], ['2\n0 0 1\n5 0\n', '0 1\n0 0\n']],
    ['使用 min 得到确认人数。', '把 requested 和 standby 写到 * 右边。'], `def allocate(capacity, /, *, requested, standby=0):
    seated = min(capacity, requested)
    return seated, standby + requested - seated

for _ in range(int(input())):
    capacity, requested, *extra = map(int, input().split())
    options = {"standby": extra[0]} if extra else {}
    print(*allocate(capacity, requested=requested, **options))
`, { concepts: ['位置专用', '关键字专用', '默认值'], approach: '把容量和两个业务选项分开绑定，明确总候补的组成。',
      steps: ['读容量与请求数。', '存在第三项时准备显式选项。', '按签名调用，展开返回元组。'],
      time: 'O(q)。', space: 'O(1)。', pitfall: '确认数已包含在请求数中，应以请求数减确认数计算新增候补。',
      extension: '对无容量和负数请求给出不同验证错误。' }),

  task(42, functionTags[1], '入门', '多箱称重',
    { background: '称重台给同一批货箱设置重量上限，并记录通过的总重与超重箱数。',
      description: '重量不超过上限的箱子计入总重，其他箱子仅计其数量。空批次的两项结果都是 0。',
      input: '首行 q，后 q 行每行是上限，后接 0–40 个箱重。',
      output: '每批一行「通过总重 超重箱数」。',
      limits: '0 ≤ q ≤ 200，重量与上限在 0–1000。等于上限时通过。' },
    ['3\n5 1 5 6\n0 0 1\n4\n', '6 1\n0 1\n0 0\n', '第二批的零重量合法。'],
    [['0\n', ''], ['1\n7 7 7\n', '14 0\n'], ['1\n3 4 5 6\n', '0 3\n']],
    ['上限是仅限关键字参数。', '用 *weights 接收拆包后任意数量的重量。'], `def weigh(*weights, limit):
    total = sum(weight for weight in weights if weight <= limit)
    rejected = sum(weight > limit for weight in weights)
    return total, rejected

for _ in range(int(input())):
    limit, *weights = map(int, input().split())
    print(*weigh(*weights, limit=limit))
`, { concepts: ['变长位置实参', '仅限关键字', '空元组'], approach: '入口先拆称重行，限额与可变重量分别传给函数。',
      steps: ['读取限额并收集剩余项。', '展开重量，明确传 limit。', '对已收集的元组求重量和超重数。'],
      time: 'O(q+N)，N 为箱数。', space: 'O(m)，m 为单批最大箱数。',
      pitfall: '把 limit 放在位置实参中会让它被 weights 接收。', extension: '同时输出刚好等于上限的箱数。' }),

  task(43, functionTags[1], '基础', '计费设置逐层覆盖',
    { background: '同一台打印机有初始费率和加急费，门店设置以及订单设置可逐层覆盖。',
      description: '默认 rate=2、rush=0。先应用门店设置，再应用该订单设置。订单计费为页数乘最终费率加最终加急费。',
      input: '首行 s q。随后 s 行给门店设置键和值。之后 q 行各为页数及任意个 key=value，表示当单改动。',
      output: '每份订单输出应付整数。',
      limits: '0 ≤ s ≤ 20，0 ≤ q ≤ 200，键只有 rate、rush，值和页数为 0–1000。同层重复键以最后为准。' },
    ['2 3\nrate 3\nrush 4\n5\n5 rush=0 rate=2\n0 rush=6\n', '19\n10\n6\n', '第二单明确取消加急费并覆写费率。'],
    [['0 1\n2\n', '4\n'], ['2 1\nrate 3\nrate 5\n4\n', '20\n'], ['0 2\n3 rate=1 rate=0\n3\n', '0\n6\n']],
    ['每层先变成字典，保留最后一次赋值。', '合并得到最终映射，再展开一次。'], `def fee(pages, /, *, rate=2, rush=0):
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
`, { concepts: ['关键字展开', '字典合并', '分层默认配置'], approach: '签名保留默认，门店配置保存一次，当单配置每次重新构造。',
      steps: ['读门店配置，冲突由后值取代。', '逐笔合并该单设置。', '把最终字典交给费率函数。'],
      time: 'O(s+q+v)，v 为所有订单选项数。', space: 'O(m)，m 为单行订单选项数，设置字典最多两个键。',
      pitfall: '对 shop 原地更新会让本单的覆盖错误影响后续订单。', extension: '加入门店费率更新事件，区分当前设置和一次性覆盖。' }),

  task(44, functionTags[1], '进阶', '名额接口参数验收',
    { background: '第三方登记入口收到选项文本，必须反馈有重复、拼写错误或缺必填项的调用。',
      description: 'zone 必填，hold 可选且默认 0。先判同名选项重复，再判未知键，最后判 zone 缺失。合法时返回区名及数量减去 hold（最小为 0）。',
      input: '首行 q，随后 q 行。每行为数量与零到多个 key=value。zone 值是英文字母串，hold 若出现则为整数，未知键值为非空白字符串。',
      output: '依次按规则输出 DUP、UNKNOWN、MISSING，合法时输出「区名 剩余数量」。',
      limits: '0 ≤ q ≤ 200，数量与 hold 为 0–1000。每行最多 10 个选项，选项名和值长 1–12。' },
    ['5\n6 zone=N hold=2\n7 hold=1\n3 zone=N hld=1\n2 zone=A zone=B\n2 zone=S hold=9\n', 'N 4\nMISSING\nUNKNOWN\nDUP\nS 0\n', '先拒绝坏选项，合法项再调用接口。'],
    [['0\n', ''], ['2\n3 unknown=1 unknown=2\n5 extra=1\n', 'DUP\nUNKNOWN\n'],
      ['3\n4 zone=E\n0 zone=S hold=0\n7\n', 'E 4\nS 0\nMISSING\n']],
    ['解析时比较选项总数和不同键数量。', '只对已经通过校验的映射做 ** 展开。'], `def allocate(count, /, *, zone, hold=0):
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
`, { concepts: ['输入校验优先级', '仅限关键字', '映射展开'], approach: '先用业务规则确定错误码，再让显式签名承接合法参数。',
      steps: ['拆分参数并核对重复。', '按未知键、缺键的顺序拒绝。', '转换 hold 并展开调用。'],
      time: 'O(q+v)，v 为选项数，字段宽度有界。', space: 'O(m)，m 为单行选项数。',
      pitfall: '字典可能覆盖重复字段，要保留原始字段数协助检测。', extension: '增加数值格式错误，明确其在重复与缺失检查中的优先级。' }),
];
