import type { Problem } from '../content';

const ledgerTools = `def parse_amount(text):
    return int(text)


def parse_record(text):
    category, amount = text.split()
    return category, parse_amount(amount)


def summarize(rows):
    totals = {}
    for category, amount in rows:
        totals[category] = totals.get(category, 0) + int(amount)
    return totals
`;

export const ledgerCapstone: Problem = {
  id: 'ledger', title: '命令行记账本', difficulty: '进阶', tag: '综合应用',
  background: '基础篇结项。先从起始文件补齐解析和汇总，再连接入口、逐项运行自测，最终提交输出和实际账本。',
  description: '读取多条分类流水并验证每条记录。将有效流水按录入顺序写入 ledger.csv，再读回该文件，按类别汇总并报告净额。',
  input: 'main.py 逐行读取「类别 金额」，以单独一行 end 结束，标记两端的空白可忽略。类别不含空白，可含逗号或双引号。缺字段、多字段和金额无法转换均视为无效。提交 ledger_tools.py，其中 parse_amount(text) 接收合法整数文本并返回 int，导入及调用时不读取或打印。',
  output: '每条无效记录立即输出「跳过无效记录」。写出 UTF-8 的 ledger.csv，逐条存类别及转成整数后的金额，无表头，使用最小引用规则和 LF 行尾。即使无有效记录也创建空文件。读回后按类别的 Python 字符串默认顺序输出「类别 小计」，最后输出「净额 总金额」。',
  limits: '0–100 条流水，不含结束标记。类别 1–40 字符，合法金额绝对值不超过 10⁶。样例及自测全部使用单层文件。须能处理负金额、零金额、重复类别及并列小计。',
  contract: { kind: 'module', files: ['main.py', 'ledger_tools.py'], target: { module: 'ledger_tools', name: 'parse_amount' } },
  starterFiles: [
    { name: 'main.py', content: 'import csv\nfrom ledger_tools import parse_record, summarize\n\n\ndef main():\n    # 读取、验证、写入账本，再读回并打印小计\n    pass\n\n\nif __name__ == "__main__":\n    main()\n' },
    { name: 'ledger_tools.py', content: 'def parse_amount(text):\n    # 只转换，失败让 ValueError 传给入口\n    pass\n\n\ndef parse_record(text):\n    # 交回类别和金额\n    pass\n\n\ndef summarize(rows):\n    # 返回每个类别的小计\n    pass\n' },
  ],
  sample: ['交通 -8\n餐饮 -16\n零工 60\n交通 错误\n交通 -2\nend\n',
    '跳过无效记录\n交通 -10\n零工 60\n餐饮 -16\n净额 34\n', '一条转换失败，交通两条合计 -10，CSV 中仍保留两条独立流水。', {
      calls: [{ args: ['0'], expected: 0 }, { args: ['-4'], expected: -4 }],
      artifacts: [{ name: 'ledger.csv', content: '交通,-8\n餐饮,-16\n零工,60\n交通,-2\n' }],
    }],
  cases: [
    ['end\n', '净额 0\n', { calls: [{ args: ['+0001'], expected: 1 }],
      artifacts: [{ name: 'ledger.csv', content: '' }], note: '空数据仍创建文件。' }],
    ['坏记录\n纸 3 extra\n灯 三\n灯 0\nend\n', '跳过无效记录\n跳过无效记录\n跳过无效记录\n灯 0\n净额 0\n', {
      calls: [{ args: ['+0'], expected: 0 }, { args: ['-8'], expected: -8 }],
      artifacts: [{ name: 'ledger.csv', content: '灯,0\n' }], note: '无效行之后能够继续，零金额有效。' }],
    ['B 2\nA 3\nA -1\nB 0\nend\n', 'A 2\nB 2\n净额 4\n', {
      calls: [{ args: ['2'], expected: 2 }, { args: ['0'], expected: 0 }, { args: ['2'], expected: 2 }],
      artifacts: [{ name: 'ledger.csv', content: 'B,2\nA,3\nA,-1\nB,0\n' }], note: '文件保留顺序和重复，汇总并列按类别排序。' }],
    ['纸,"大" +005\n纸,"大" -2\nend\n', '纸,"大" 3\n净额 3\n', {
      calls: [{ args: ['+005'], expected: 5 }, { args: ['-2'], expected: -2 }],
      artifacts: [{ name: 'ledger.csv', content: '"纸,""大""",5\n"纸,""大""",-2\n' }], note: 'CSV 转义并保留单笔金额。' }],
  ],
  hints: ['先完成 parse_amount 和 parse_record，用三条固定字符串自测。把 ValueError 的恢复动作放在入口。', '用 csv.writer 写完并退出 with，再用 csv.reader 读回。输入只有 end 时也要打开并创建文件，按 sorted 排小计。'],
  solution: `import csv
from ledger_tools import parse_record, summarize


def main():
    with open("ledger.csv", "w", encoding="utf-8", newline="") as file:
        writer = csv.writer(file, lineterminator="\\n")
        while True:
            line = input()
            if line.strip() == "end":
                break
            try:
                record = parse_record(line)
            except ValueError:
                print("跳过无效记录")
                continue
            writer.writerow(record)

    with open("ledger.csv", encoding="utf-8", newline="") as file:
        totals = summarize(csv.reader(file))
    for category in sorted(totals):
        print(category, totals[category])
    print("净额", sum(totals.values()))


if __name__ == "__main__":
    main()
`,
  solutionFiles: [{ name: 'ledger_tools.py', content: ledgerTools }],
  guide: {
    concepts: ['函数和模块', 'CSV 文件往返', '具体异常', '重复与自测'],
    approach: '入口组织 I/O，工具函数只转换或汇总。写入阶段保留原始成功记录的顺序，读取阶段按键合计。',
    steps: ['先单独检查 parse_amount 的正数、负数和 0。', '用 end 作为结束标记，逐行解析。发生 ValueError 时提示，下一条仍可处理。', '关闭写入句柄再打开读取，合计并按类别排序。先试空输入，再试两类并列、重复与带引号的类别。'],
    time: 'O(B+k log k)，B 为总输入长度，k 是类别数。', space: 'O(k+L) 运行时内存和 O(B) 文件，L 为最长行。',
    pitfall: '提前合并流水或只打印汇总会让文件不合格。手拼逗号无法正确转义含引号的类别。',
    extension: '增加一个可复用的自测函数，只在工具文件直接运行时调用，保持导入无副作用。',
  },
};
