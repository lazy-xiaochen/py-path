import type { Problem, Project } from '../../content';
import { expressionTags } from './authoring.ts';

const header = 'course,students,passed,average,leaders\n';
const csv = (rows = '') => ({ artifacts: [{ name: 'summary.csv', content: header + rows }] });

const assessment: Problem = {
  id: 'grade-analysis',
  title: '成绩数据分析',
  tag: expressionTags[3],
  difficulty: '进阶',
  background: '教务组收到混合大小写、重复和坏行的成绩导出。需要在纠错后输出确定的课程报告，同时提供可导入的 CSV。',
  description: '逐行校验并标准化学号、课程号。对同一学号与课程号组合，最后一条合法记录生效。坏行计入拒绝数量，之后继续处理，已有成绩保留。',
  input: '首行「及格线 n」，其后恰好 n 行。每条合法记录有三个以空白分隔的字段「学号 课程号 分数」，允许行首尾空白。两个编号须为 1–12 位 ASCII 英数字，统一为大写。分数为 1–3 位 ASCII 数字且数值在 0–100，前导零允许。',
  output: '前三行依次是 REJECTED 坏行数、RECORDS 最终成绩数、STUDENTS 不同有效学号数。再按课程号字典序输出「课程 学生数 及格数 平均分 最高分学号列表」。及格含等于及格线，平均分向下取整。最高分并列者都输出，学号升序，以 | 连接。还需以 UTF-8 写入 summary.csv，表头 course,students,passed,average,leaders。其余每行与控制台课程行对应，使用逗号分隔，LF 换行。没有有效记录也写表头。',
  limits: '0 ≤ 及格线 ≤ 100，0 ≤ n ≤ 350，每个待校验行至多 80 字符。编号大小写表示同一记录，前导零属于编号本身。所有输出均以指定的 ASCII 分隔符连接。',
  contract: { kind: 'file', files: ['main.py'] },
  starterFiles: [{ name: 'main.py', content: `import csv

def parse_record(line):
    """返回 (student, course, score)，坏行返回 None。"""
    raise NotImplementedError("先完成一行的验证和转换")

def summarize(latest, threshold):
    """返回按课程排序的五字段报表行。"""
    raise NotImplementedError("实现分组、统计和并列规则")

def main():
    # 读取 n 行，统计拒绝数并保留最后一条合法成绩。
    # 调用 summarize，然后输出同一份报表并写入 CSV。
    raise NotImplementedError("连接各阶段")

if __name__ == "__main__":
    main()
` }],
  sample: ['60 7\na math 60\nB MATH 95\nA math 80\nc Art 0\nX art 101\nb math 80\nbroken\n',
    'REJECTED 2\nRECORDS 3\nSTUDENTS 3\nART 1 0 0 C\nMATH 2 2 80 A|B\n',
    'A 和 B 在 MATH 最终都是 80，分别占一个学生名额。ART 的零分也是有效记录。',
    csv('ART,1,0,0,C\nMATH,2,2,80,A|B\n')],
  cases: [
    ['0 0\n', 'REJECTED 0\nRECORDS 0\nSTUDENTS 0\n', csv()],
    ['60 4\n\nX-2 B 5\nY B +7\nA B 101\n', 'REJECTED 4\nRECORDS 0\nSTUDENTS 0\n', csv()],
    ['50 4\ns c 050\ns c 102\nb c 049\nS C 048\n', 'REJECTED 1\nRECORDS 2\nSTUDENTS 2\nC 2 0 48 B\n',
      csv('C,2,0,48,B\n')],
    ['0 4\nX zebra 0\nX alpha 000\nY zebra 1\nX beta 2\n', 'REJECTED 0\nRECORDS 4\nSTUDENTS 2\nALPHA 1 1 0 X\nBETA 1 1 2 X\nZEBRA 2 2 0 Y\n',
      csv('ALPHA,1,1,0,X\nBETA,1,1,2,X\nZEBRA,2,2,0,Y\n')],
    ['100 4\nA Q 100\nA Q 99\nB Q 100\nC Q 100\n', 'REJECTED 0\nRECORDS 3\nSTUDENTS 3\nQ 3 2 99 B|C\n',
      csv('Q,3,2,99,B|C\n')],
    ['6 4\n  07 lab 006  \n7 LAB 005\n07 lab ６\nQ Lab 0000\n', 'REJECTED 2\nRECORDS 2\nSTUDENTS 2\nLAB 2 1 5 07\n',
      csv('LAB,2,1,5,07\n')],
  ],
  hints: ['先让 parse_record 只管一行，试试坏编号、全角数字与合法零分。', '一份字典负责最新成绩，另一份负责按课程分组。只生成一份报表行，让终端和 CSV 共用。'],
  solution: `import csv

def parse_record(line):
    fields = line.split()
    if len(fields) != 3:
        return None
    student, course, score_text = fields
    if any(not (1 <= len(code) <= 12 and code.isascii() and code.isalnum())
           for code in (student, course)):
        return None
    if not (1 <= len(score_text) <= 3 and score_text.isascii() and score_text.isdecimal()):
        return None
    score = int(score_text)
    if score > 100:
        return None
    return student.upper(), course.upper(), score

def summarize(latest, threshold):
    by_course = {}
    for (student, course), score in latest.items():
        by_course.setdefault(course, []).append((student, score))
    report = []
    for course in sorted(by_course):
        members = by_course[course]
        highest = max(score for _, score in members)
        leaders = sorted(student for student, score in members if score == highest)
        passed = sum(score >= threshold for _, score in members)
        average = sum(score for _, score in members) // len(members)
        report.append((course, len(members), passed, average, "|".join(leaders)))
    return report

def main():
    threshold, n = map(int, input().split())
    latest = {}
    rejected = 0
    for _ in range(n):
        record = parse_record(input())
        if record is None:
            rejected += 1
        else:
            student, course, score = record
            latest[(student, course)] = score

    report = summarize(latest, threshold)
    print("REJECTED", rejected)
    print("RECORDS", len(latest))
    print("STUDENTS", len({student for student, _ in latest}))
    for row in report:
        print(*row)
    with open("summary.csv", "w", encoding="utf-8", newline="") as target:
        writer = csv.writer(target, lineterminator="\\n")
        writer.writerow(("course", "students", "passed", "average", "leaders"))
        writer.writerows(report)

if __name__ == "__main__":
    main()
`,
  guide: {
    concepts: ['标准化', '复合键覆盖', '分组与集合去重', '解包与生成器', 'CSV 输出'],
    approach: '先清洗输入，再决定最新版本，最后从最终数据生成唯一的报表行集合。这样坏行和重复不会直接改变统计运算。',
    steps: ['解析一行，明确区分合法零分和坏行。', '用 (学号,课程号) 作字典键，让后来的合法记录覆盖旧值。',
      '给每门课保留学生与分数的二元组，按最终数据计算统计。', '按照统一顺序显示，并用 csv.writer 生成真实文件。'],
    time: '平均 O(s+c log c+Σ k_i log k_i)，s 为输入和扫描字节数，c 为课程数，k_i 为各课程最高分并列者数量。',
    space: 'O(n)，保留最终记录、分组和报表。', pitfall: '逐原始行累计会重复计分。校验失败也不应该删除此前合法成绩。',
    extension: '加入每课可配置及格线、并列前 k 名和逐学生统计，仍用同一清洗层。',
  },
};

export const gradesProject: Project = {
  id: assessment.id, title: assessment.title, tags: '进阶篇结项 · 数据处理与 CSV',
  description: '清洗混合成绩记录，处理重复更新，生成可核验的课程汇总和 CSV 文件。',
  steps: assessment.guide!.steps, input: assessment.sample[0], expected: assessment.sample[1],
  acceptance: assessment.sample[2], files: assessment.starterFiles!, solution: assessment.solution, assessment,
  brief: {
    requirements: ['使用列表保留报表行，用复合键字典索引最新成绩，用集合统计跨课程的不同有效学号。',
      '使用函数拆分清洗、统计和输出。至少在一处合理使用解包与推导式或生成器。',
      '控制台列与 summary.csv 的数据行应从同一份报表生成。'],
    design: ['先画三层数据流：原始文本 → 最新成绩映射 → 课程报表。标出每层的数据形状与排序时点。',
      '用字典键表达「同一学生同一门课」的唯一性。学生编号前导零有意义，成绩的前导零只影响表示。',
      '先完成计算函数再连接文件写入。让解析失败、业务拒绝和空数据仍能完成整份报告。'],
    stages: [
      { title: '清洗单行', work: '实现 parse_record，用大小写混合、坏分和前导零验证输出。', check: '例如「07 lab 006」应得到 (07, LAB, 6) 对应的三项值，带全角分数的行应拒绝。' },
      { title: '维护最终记录', work: '用复合键去重，坏行只计数。先用一科三条录入手推最终字典。', check: '同一个键先有 80 再有 0，最后为 0；若第二条不合法，仍为 80。' },
      { title: '排序、统计与并列', work: '按课程分组，在一科的最终记录上计算各列。', check: '用刚好及格、两人并列最高和平均分有小数的例子对照。' },
      { title: '导出并提交', work: '让两个输出共用 report，写出真实 CSV。', check: '空输入应生成只有表头的文件，多课场景的两份报表行序一致。' },
    ],
    checklist: ['全部自动评测通过，且有效零分、非法更新、空表、并列和前导零记录都有自测。',
      '能说明去重键为何包含两个字段，以及为什么统计发生在覆盖之后。'],
    extensions: ['新增按学生统计或可配置及格线，复用既有清洗与聚合函数。'],
  },
};
