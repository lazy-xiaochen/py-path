import type { Problem } from '../content';

const debugStarter = `count = int(input())
total = 0
for _ in range(count):
    people_text, items_text = input().split()
    try:
        people = int(people_text)
        items = int(items_text)
    except ValueError:
        print("格式错误")
        continue
    each = items // people
    print(each)
    total += each
print("合计", total)
`;

const parcelSolution = `def quote(weight, zone):
    price = 6 if zone == "L" else 10
    if weight > 1:
        price += (weight - 1) * 2
    return price
`;

export const chapterTasks: Problem[] = [
  {
    id: 'P071', title: '借阅单字段重排', difficulty: '基础', tag: '输入输出', outputComparison: 'exact',
    description: '馆员按录入顺序提交资料，打印机要求改变字段顺序。原样保留每个字段，包括编号前导零、姓名与备注中的空格。',
    input: '四行依次是编号、读者姓名、备注、柜号。备注可以是空行，也可以只有空格。',
    output: '第一行为柜号、竖线和编号，第二行为方括号内的姓名，第三行为「备注：」紧接备注。保留原有空格。',
    limits: '编号由 1–12 个数字组成。姓名和柜号非空，每个文本字段至多 40 个字符，均不含换行。',
    sample: ['007\n李 小禾\n备用钥匙\nC3\n', 'C3|007\n[李 小禾]\n备注：备用钥匙\n', '第四个字段先输出，编号仍为三位。'],
    cases: [
      ['000\n阿 乔\n\nA\n', 'A|000\n[阿 乔]\n备注：\n', { note: '空备注仍须占据输入和输出约定的位置。' }],
      ['0040\n林  晓\n  \nZ9\n', 'Z9|0040\n[林  晓]\n备注：  \n', { note: '识别把空格当空栏清理或把编号当整数的实现。' }],
      ['8\n  东 区\n借书  \n北\n', '北|8\n[  东 区]\n备注：借书  \n'],
    ],
    hints: ['先把四行各用一个名字接住。', '按题面顺序分别输出。用 sep 或 f-string 控制标点旁的间隔。'],
    solution: `code = input()
name = input()
note = input()
cabinet = input()
print(cabinet, code, sep="|")
print(f"[{name}]")
print(f"备注：{note}")
`,
    guide: {
      concepts: ['字段重排', '前导零', '原文空白'],
      approach: '先建立四个名字与输入行的映射。输出次序与读取次序分别按题面处理。',
      steps: ['逐行读取四个字符串。', '用编号和柜号组合第一行。', '给姓名和备注套固定模板，原值不做清理。'],
      time: 'O(L)，L 为文本总长。', space: 'O(L)，保留四个字段。',
      pitfall: 'int 会丢失前导零，strip 会丢失备注尾部空格。', extension: '把柜号改到末行，哪些读取仍应保留原顺序？',
    },
  },
  {
    id: 'P072', title: '双车标签并排印刷', difficulty: '基础', tag: '输入输出', outputComparison: 'exact',
    description: '两辆接驳车各有一张标签。按字段做两行对照表，中间留一行供工作人员手写。',
    input: '四行依次为甲车编号、甲车站名、乙车编号、乙车站名。任何一个站名可以为空。',
    output: '首行是「[甲编号] / [乙编号]」。第二行为空行。第三行为「甲站名 → 乙站名」。方括号贴合编号，斜杠和箭头两边都保留一个空格。',
    limits: '编号为 1–8 位数字，按文本处理。站名最多 30 个字符，可含内部空格。',
    sample: ['002\n东 广场\n009\n北门\n', '[002] / [009]\n\n东 广场 → 北门\n', '先配对编号，再配对站名，中间有一行空行。'],
    cases: [
      ['001\n\n000\n终点\n', '[001] / [000]\n\n → 终点\n'],
      ['11\n海  湾\n7\n\n', '[11] / [7]\n\n海  湾 → \n', { note: '乙站为空时，箭头后仍有一个空格。' }],
      ['0\n\n0\n\n', '[0] / [0]\n\n → \n'],
    ],
    hints: ['先画输入四行到输出三行的连线。', '可用 end 让编号的两次打印接在一起，再用独立 print() 产生空行。'],
    solution: `first = input()
left = input()
second = input()
right = input()
print(f"[{first}]", end=" / ")
print(f"[{second}]")
print()
print(left, right, sep=" → ")
`,
    guide: {
      concepts: ['输出拼接位置', 'end 与 sep', '中间空行'],
      approach: '同一行由两个编号字段构成，空行由独立调用产生，站名之间固定插入分隔符。',
      steps: ['按车读取编号与站名，不转换编号。', '首个输出不换行，第二个补全编号行。', '打印空行，再用 sep 把两个站名放在一行。'],
      time: 'O(L)。', space: 'O(L)，L 为输入字符数。',
      pitfall: '空站名仍需 input 一次，也不能省去分隔符旁的空格。', extension: '如何让两个站名各占一行，同时保留两辆车的编号对照？',
    },
  },
  {
    id: 'P073', title: '步道铺设面积显示', difficulty: '基础', tag: '变量与运算',
    description: '每块相同垫板覆盖给定面积，求铺设若干块的总面积并显示两位小数。',
    input: '一行两个字段，单块面积 a 和块数 n。a 是十进制小数字符串，n 是整数。',
    output: '一行总面积，固定显示两位小数。四舍六入，恰好居中时取末位偶数，例如 0.125 显示为 0.12，0.375 显示为 0.38。',
    limits: '0 ≤ a ≤ 128，a 为 0.125 的整数倍。0 ≤ n ≤ 100。所用面积和乘积都可由 Python float 精确表示。',
    sample: ['1.125 2\n', '2.25\n', '先求 1.125×2，再按两位小数显示。'],
    cases: [
      ['1.5 2\n', '3.00\n', { note: '直接打印 float 会丢掉一个补零。' }],
      ['5.125 0\n', '0.00\n'], ['0.125 1\n', '0.12\n'], ['0.375 1\n', '0.38\n'],
      ['0.125 3\n', '0.38\n', { note: '先舍入单块再相乘会得到 0.36。' }],
      ['127.875 100\n', '12787.50\n'],
    ],
    hints: ['两字段用途不同，逐项转换。', '先乘，再用 f-string 的 :.2f 格式，不提前改变单块面积。'],
    solution: `area_text, count_text = input().split()
total = float(area_text) * int(count_text)
print(f"{total:.2f}")
`,
    guide: {
      concepts: ['小数文本转换', '混合数值运算', '显示精度'],
      approach: '将显示步骤放在计算之后。本题选用二进制可精确表示的八分之一刻度，居中行为可手算。',
      steps: ['拆出两个文本字段。', 'float 转面积、int 转块数，计算总面积。', '格式化为两位小数，居中时取偶数末位。'],
      time: 'O(1)，固定个数的有界输入。', space: 'O(1)。',
      pitfall: '先格式化单块面积再相乘会改变计算结果。', extension: '如果输入允许任意分币值，比较整数最小单位和 Decimal 的选择。',
    },
  },
  {
    id: 'P074', title: '多仓批次停表', difficulty: '基础', tag: '循环',
    description: '按顺序接收多仓访问量。一批第一次遇到 -1 或加入当前量会超过额度时，当前及余下记录都不计，但仍要读完整批，才到下一批。',
    input: '首行批次数 b。每批先一行长度 n 和额度 cap，再给 n 行访问量 v。-1 是停表标记。',
    output: '每批一行，输出计入的记录数和累计量。累计量恰好等于额度时，当前记录仍可计入。',
    limits: '1 ≤ b ≤ 20，0 ≤ n ≤ 30，0 ≤ cap ≤ 30000，-1 ≤ v ≤ 999。总输入不超过 621 行。',
    sample: ['2\n4 10\n3\n8\n1\n2\n3 4\n4\n0\n-1\n', '1 3\n2 4\n', '第一批加上 8 会超限，后续虽小也不再纳入。第二批恰好达限后还能计入 0。'],
    cases: [
      ['3\n0 9\n3 10\n-1\n3\n4\n1 8\n8\n', '0 0\n0 0\n1 8\n', { note: '零批内长度、首项停表与下一批重置。' }],
      ['2\n2 1\n2\n0\n2 0\n0\n1\n', '0 0\n1 0\n', { note: '超限后的小值也不得计入，零额度允许计入零值。' }],
      ['2\n4 5\n1\n-1\n-1\n20\n1 7\n7\n', '1 1\n1 7\n', { note: '重复停表不能恢复累计，也不能读错下批行数。' }],
    ],
    hints: ['外层遍历批次，内层固定读取 n 行。', '将是否还累计放在布尔状态里，每批重置。'],
    solution: `for _ in range(int(input())):
    remaining, cap = map(int, input().split())
    accepted = 0
    total = 0
    stopped = False
    for i in range(remaining):
        value = int(input())
        if value == -1 or total + value > cap:
            stopped = True
        if not stopped:
            total += value
            accepted += 1
    print(accepted, total)
`,
    guide: {
      concepts: ['嵌套循环', '输入对齐', '停止状态'],
      approach: '输入读指针按协议推进，累计状态只控制是否加上已读数据。',
      steps: ['每批从长度、额度、两个统计量和停表状态开始。', '始终读 n 次，先判断是否遇到标记或超限，成功时一并更新数目和总量。', '批次结束才输出，下一批重新初始化。'],
      time: 'O(b+Σn)。', space: 'O(1)，无需保存记录列表。',
      pitfall: '在内层调用 break 会把余下数据当成下一批长度。', extension: '每批有两种独立指标时，为它们分别维护停表标记。',
    },
  },
  {
    id: 'P075', title: '更新与撤销领用登记', difficulty: '基础', tag: '字典',
    description: '维护按首次登记顺序展示的领用台账。修改已存在编号保留其位置，撤销后重新登记排在末尾。登记为 0 仍算存在。',
    input: '第一行操作数 n。后续每行为 set 编号 数量 或 drop 编号。drop 缺失编号时保持原表。',
    output: '按当前登记顺序输出「编号 数量」，最后一行输出「合计 总数」。空表只输出合计 0。',
    limits: '0 ≤ n ≤ 100，编号为 1–10 个 ASCII 字母或数字，0 ≤ 数量 ≤ 1000。',
    sample: ['6\nset A 4\nset B 0\nset A 5\ndrop A\nset A 2\ndrop X\n', 'B 0\nA 2\n合计 2\n', 'B 的零值保留，A 撤销后排到 B 后面。'],
    cases: [
      ['0\n', '合计 0\n'], ['3\nset Z 0\ndrop Z\ndrop Z\n', '合计 0\n'],
      ['4\nset B 2\nset A 3\nset B 0\nset A 1\n', 'B 0\nA 1\n合计 1\n', { note: '更新不换顺序，旧值不能继续计入。' }],
      ['5\nset B 1\nset A 2\ndrop B\nset C 5\nset B 3\n', 'A 2\nC 5\nB 3\n合计 10\n'],
    ],
    hints: ['把编号作为键，set 使用赋值覆盖。', 'drop 用 in 先查键。最后遍历 items，合计使用当前 values。'],
    solution: `records = {}
for _ in range(int(input())):
    fields = input().split()
    action, code = fields[:2]
    if action == "set":
        records[code] = int(fields[2])
    elif code in records:
        del records[code]
for code, quantity in records.items():
    print(code, quantity)
print("合计", sum(records.values()))
`,
    guide: {
      concepts: ['覆盖与撤销', '插入顺序', '汇总当前状态'],
      approach: '字典同时保存当前值与登记顺序，撤销时删除键本身。',
      steps: ['逐条读操作，set 改写该键。', 'drop 只在存在时删除。', '按 items 的顺序输出并用 values 重新求和。'],
      time: 'O(n)，在正常字典操作成本下。', space: 'O(k)，k 为同时存在的编号数。',
      pitfall: '用 if records.get(code) 会忽略存在但数值为零的编号。', extension: '若报告还要显示已撤销次数，需要在当前表之外保存什么？',
    },
  },
  {
    id: 'P076', title: '实现箱数计算函数', difficulty: '基础', tag: '函数',
    description: '给多个发货流程复用同一个箱数函数。每组会在同一解释器中调用它多次，每次只依赖传入参数。',
    input: '提交 main.py 中的 crate_count(items, capacity)，参数依次为物品数和每箱容量。评测直接传入整数。',
    output: '返回所需最少整箱数（int）。物品数为 0 时返回 0。接口调用期间保持标准输入、输出和错误输出安静。',
    limits: '0 ≤ items ≤ 10000，1 ≤ capacity ≤ 10000。',
    contract: { kind: 'function', files: ['main.py'], target: { module: 'main', name: 'crate_count' } },
    starterFiles: [{ name: 'main.py', content: 'def crate_count(items, capacity):\n    # 返回最少箱数\n    pass\n' }],
    sample: ['', '', '10 件每箱 4 件要 3 箱，8 件恰好 2 箱。', { calls: [{ args: [10,4], expected: 3 }, { args: [8,4], expected: 2 }] }],
    cases: [
      ['', '', { calls: [{ args: [0,9], expected: 0 }, { args: [1,9], expected: 1 }] }],
      ['', '', { calls: [{ args: [5,2], expected: 3 }, { args: [9,3], expected: 3 }, { args: [5,2], expected: 3 }], note: '重复调用检验无残留状态。' }],
      ['', '', { calls: [{ args: [10000,1], expected: 10000 }, { args: [9999,10000], expected: 1 }] }],
    ],
    hints: ['先算装满箱数和余量。', '有余量多一箱，用 return 交给调用者。'],
    solution: `def crate_count(items, capacity):
    full, extra = divmod(items, capacity)
    if extra:
        full += 1
    return full
`,
    guide: {
      concepts: ['函数签名', '返回值', '重复调用'],
      approach: '函数只做计算。先分完整箱子和剩余物品，再决定是否增加箱数。',
      steps: ['调用者直接传两个整数。', '用 divmod 分开商和余数。', '余数非零才加一。每次用 return 返回整数。'],
      time: '每次 O(1)。', space: 'O(1)。',
      pitfall: 'print 只写标准输出，函数仍返回 None。把箱数保存在共享变量也会影响随后调用。', extension: '让调用者一次核对多个订单，总箱数是否一定等于合并物品再算一次？',
    },
  },
  {
    id: 'P077', title: '拆分包裹报价入口', difficulty: '基础', tag: '模块',
    description: '将定价函数放进辅助模块，入口负责读入与打印。L 区首千克 6 元，R 区首千克 10 元，每超出 1 千克加 2 元。',
    input: '提交 main.py 与 parcel.py。main.py 读取一行整数 weight 和区域 zone。parcel.py 提供 quote(weight, zone)。',
    output: '入口输出整数运费。quote 返回同样的整数。导入 parcel 或调用 quote 时不读标准输入、不打印。',
    limits: '1 ≤ weight ≤ 1000，zone 为 L 或 R。',
    contract: { kind: 'module', files: ['main.py', 'parcel.py'], target: { module: 'parcel', name: 'quote' } },
    starterFiles: [
      { name: 'main.py', content: '# 导入报价函数，在 main() 中读取、调用并输出\n' },
      { name: 'parcel.py', content: 'def quote(weight, zone):\n    # 返回整数报价\n    pass\n' },
    ],
    sample: ['3 R\n', '14\n', 'R 区 10 元，加 2 千克的附加费 4 元。', { calls: [{ args: [3,'R'], expected: 14 }, { args: [1,'L'], expected: 6 }] }],
    cases: [
      ['1 R\n', '10\n', { calls: [{ args: [1,'R'], expected: 10 }, { args: [2,'L'], expected: 8 }] }],
      ['2 L\n', '8\n', { calls: [{ args: [2,'L'], expected: 8 }, { args: [2,'R'], expected: 12 }] }],
      ['1000 L\n', '2004\n', { calls: [{ args: [1000,'L'], expected: 2004 }] }],
    ],
    hints: ['parcel.py 只定义接受值和返回结果的函数。', '在 main.py 导入 quote，然后读一行并将重量转为整数。'],
    solution: `from parcel import quote

def main():
    text, zone = input().split()
    print(quote(int(text), zone))

if __name__ == "__main__":
    main()
`,
    solutionFiles: [{ name: 'parcel.py', content: parcelSolution }],
    guide: {
      concepts: ['导入与调用', '入口职责', '导入安静'],
      approach: '让辅助模块保存定价规则，入口完成协议。先直接核对函数，再核对入口。',
      steps: ['在 parcel 计算首价与超重费并返回。', 'main 导入 quote 并读入两个字段。', '调用函数只输出一个报价；独立导入时不读取数据。'],
      time: '每次 O(1)。', space: 'O(1)。',
      pitfall: '把读取或打印写在 parcel 顶层会在导入阶段产生副作用。', extension: '为 parcel 添加只在直接运行时执行的自测。',
    },
  },
  {
    id: 'P078', title: '把新签收行追加到日志', difficulty: '入门', tag: '文件读写',
    description: '两份 UTF-8 文本随每组测试提供。把 incoming.txt 中的每一行原样追加到已有的 journal.txt，报告追加的行数。',
    input: '无需标准输入。评测提供 journal.txt 与 incoming.txt，两份文件可为空。文件非空时每行以 LF 结束。',
    output: '输出追加行数。运行结束时原 journal.txt 的内容仍在，新记录接在后面。含空格的记录与空行原样保留。',
    limits: '每个文件 0–40 行，共不超过 8192 字节。保留 UTF-8 原文及结束换行。',
    contract: { kind: 'file', files: ['main.py'] },
    sample: ['', '2\n', '旧记录不动，追加中文新记录和一个空行。', {
      fixtures: [{ name: 'journal.txt', content: '早班已签\n' }, { name: 'incoming.txt', content: '李 乔\n\n' }],
      artifacts: [{ name: 'journal.txt', content: '早班已签\n李 乔\n\n' }],
    }],
    cases: [
      ['', '0\n', { fixtures: [{ name: 'journal.txt', content: '原文  \n' }, { name: 'incoming.txt', content: '' }],
        artifacts: [{ name: 'journal.txt', content: '原文  \n' }], note: '空输入不能清空旧文件。' }],
      ['', '3\n', { fixtures: [{ name: 'journal.txt', content: '' }, { name: 'incoming.txt', content: '东门\n 西门 \n东门\n' }],
        artifacts: [{ name: 'journal.txt', content: '东门\n 西门 \n东门\n' }] }],
      ['', '1\n', { fixtures: [{ name: 'journal.txt', content: '前值\n' }, { name: 'incoming.txt', content: '  \n' }],
        artifacts: [{ name: 'journal.txt', content: '前值\n  \n' }] }],
    ],
    hints: ['用 a 模式打开已有日志来追加。', 'for line in source 取到的行已经含有换行，可以直接写。'],
    solution: `count = 0
with open("incoming.txt", encoding="utf-8") as source:
    with open("journal.txt", "a", encoding="utf-8", newline="") as target:
        for line in source:
            target.write(line)
            count += 1
print(count)
`,
    guide: {
      concepts: ['UTF-8 文件', '追加与覆盖', '空白原样传递'],
      approach: '保留已存在的前缀，只向文件末尾写入读到的原行。计数器跟踪成功追加的记录数量。',
      steps: ['确认当前目录中的两个文件名。', '逐行读取，将原行写入以 a 模式打开的日志。', '退出 with 后输出计数，并在本次产物中核对原前缀。'],
      time: 'O(B)，B 为新文件字节数。', space: 'O(L)，L 为最长输入行。',
      pitfall: '用 w 会先清空旧日志，打印正确计数也弥补不了文件错误。', extension: '怎样记录一条新日志的序号，同时保留全部已有行？',
    },
  },
  {
    id: 'P079', title: '导出待复核的 CSV 记录', difficulty: '进阶', tag: '文件读写',
    description: '从 stock.csv 读取两列「名称,数量」，将数量为 0 的原记录按原顺序写入 review.csv。保留名称内的逗号、引号和重复记录。',
    input: '无需标准输入。测试提供 UTF-8 的 stock.csv，含固定表头「名称,数量」，字段采用 Python csv 模块的默认引用方式。',
    output: '输出入选记录数。必须创建 UTF-8 review.csv，先写相同表头，再写筛选结果。文件行尾为 LF，末行也有 LF，使用最小引用规则。',
    limits: '0–35 条记录，名称非空且不含换行。数量为 0–999 的整数。输入文件不超过 8192 字节。',
    contract: { kind: 'file', files: ['main.py'] },
    sample: ['', '2\n', '带逗号与双引号的同名记录均入选，非零项目不写。', {
      fixtures: [{ name: 'stock.csv', content: '名称,数量\n"瓶,""大""",0\n绳,1\n"瓶,""大""",0\n' }],
      artifacts: [{ name: 'review.csv', content: '名称,数量\n"瓶,""大""",0\n"瓶,""大""",0\n' }],
    }],
    cases: [
      ['', '0\n', { fixtures: [{ name: 'stock.csv', content: '名称,数量\n' }],
        artifacts: [{ name: 'review.csv', content: '名称,数量\n' }], note: '没有记录也产生含表头的文件。' }],
      ['', '2\n', { fixtures: [{ name: 'stock.csv', content: '名称,数量\n甲,0\n乙,0\n甲,1\n' }],
        artifacts: [{ name: 'review.csv', content: '名称,数量\n甲,0\n乙,0\n' }] }],
      ['', '0\n', { fixtures: [{ name: 'stock.csv', content: '名称,数量\n甲,3\n乙,1\n' }],
        artifacts: [{ name: 'review.csv', content: '名称,数量\n' }] }],
    ],
    hints: ['用 csv.reader 读取字段。打开两个文件时都指定 newline=""。', '先读取与写出表头，再逐行筛选。writer 用 lineterminator="\\n"。'],
    solution: `import csv

count = 0
with open("stock.csv", encoding="utf-8", newline="") as source:
    with open("review.csv", "w", encoding="utf-8", newline="") as target:
        reader = csv.reader(source)
        writer = csv.writer(target, lineterminator="\\n")
        writer.writerow(next(reader))
        for name, quantity in reader:
            if int(quantity) == 0:
                writer.writerow([name, quantity])
                count += 1
print(count)
`,
    guide: {
      concepts: ['CSV 引用', 'UTF-8 产物', '保序筛选'],
      approach: '让 csv 负责字段解析和转义，程序只判断数量是否为零。使用固定表头保证空结果也可打开。',
      steps: ['用 reader 取得表头并写入。', '按顺序遍历每行，对数量做整数比较。', '用 writer 写入合格原字段并计数。'],
      time: 'O(B)，B 为输入字符数。', space: 'O(L)，L 为最长记录。',
      pitfall: '按逗号拆分会切碎引用字段，按名字去重也会遗失记录。', extension: '如果表头顺序可变，如何根据列名定位数量列？',
    },
  },
  {
    id: 'P080', title: '修复值班分箱统计', difficulty: '基础', tag: '异常调试',
    description: '起始程序会在混有零人数的记录中崩溃。保留能处理的记录和原有错误分类，修复后继续处理剩余记录。',
    input: '第一行记录数 q，随后 q 行各含人数与物品数的两个字段。字段可能含无法转换为整数的文本。',
    output: '任一字段转换失败输出「格式错误」，优先于人数判断。两字段都是整数且人数为零时输出「无接收人」。其余输出物品整除人数的值。末行输出「合计 总数」，只合计成功记录。',
    limits: '0 ≤ q ≤ 50。能转换的字段是 0–1000 的整数；每行恰有两个字段。',
    starterFiles: [{ name: 'main.py', content: debugStarter }],
    sample: ['3\n2 6\n0 8\n1 2\n', '3\n无接收人\n2\n合计 5\n', '用起始代码先运行，查看 ZeroDivisionError 和除法行，再检查零值后的最后一条记录。'],
    cases: [
      ['4\n0 坏值\n0 9\n1 9\n2 1\n', '格式错误\n无接收人\n9\n0\n合计 9\n', { note: '格式错误优先，人数 1 与零得数仍属合法，后续继续执行。' }],
      ['3\n1 0\n坏值 5\n3 7\n', '0\n格式错误\n2\n合计 2\n'],
      ['0\n', '合计 0\n'],
    ],
    hints: ['先运行起始程序，沿诊断定位到整数除法。', '在两个字段转换成功之后、除法之前处理零人数，继续下一轮。'],
    solution: debugStarter.replace('    each = items // people', '    if people == 0:\n        print("无接收人")\n        continue\n    each = items // people'),
    guide: {
      concepts: ['复现与定位', '分层校验', '失败后继续'],
      approach: '异常类型 ZeroDivisionError 指向除数问题。故障输入的人数为 0，而不是 int 无法解析。',
      steps: ['跑样例，查看异常末行和跳转位置，确认出错前已打印 3。', '保持 try 的转换保护范围，在转换之后对 0 分支跳过除法与累计。', '复跑原故障，再用 1 和 0 加无效物品文本验证邻值、优先级及后续成功记录。'],
      time: 'O(q)。', space: 'O(1)，只保存当前记录和合计。',
      pitfall: '先判断人数是否为零会遮住另一字段的格式错误。捕获后不继续或仍更新合计也会破坏结果。', extension: '支持负数时，空组、非法业务值和格式错误分别应如何提示？',
    },
  },
];
