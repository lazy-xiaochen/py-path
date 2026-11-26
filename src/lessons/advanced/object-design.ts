import type { Chapter } from '../../teaching-types';
import { coding, example as ex, question as q, reference } from './authoring.ts';

export const objectDesign: Chapter = {
  introduction: '借阅系统要回答四个问题：有哪些书、谁借着书、谁在排队、哪种规则允许借阅。本课从可观察需求开始，逐步把状态和判定分配给对象，再用连续操作检验设计。',
  prerequisites: '封装、继承、组合、字典、列表和数据类。',
  version: 'Python 3.12。示例只讨论单进程、顺序命令。',
  goals: ['把需求写成对象、接口、成功条件与失败后状态。', '将借还入口、书目状态和借阅规则分开，使用注入组件测试。', '从能运行的小版本分步重构，并用状态轨迹验证项目。'],
  topics: [
    {
      title: '先定义状态，再确定类和方法',
      explanation: [
        '先从规则挑出需要跨命令保存的状态。一份书目记录持有编号、标题和借阅者；每个馆有一个用编号查书的索引；排队按书保存，每人可对不同书各排一次。',
        '把动作写成明确接口。borrow(code, user) 跨书目和借阅策略读取条件，因此可以由 Library 协调；Book 表示单书状态；策略知道用户当前持有多少本时是否还能借。命令入口负责解析、调用和显示。',
        '初版可先做新增、借、还和查询。用形如「借出 → 其他人还书失败 → 查看 → 正常归还」的场景验证失败不改状态。完成后再添加预约和策略。保留命令层测试，让重构可以与旧版逐步对照。',
      ],
      diagram: { caption: '一本书在借还操作里的状态', text: '空闲 + 有资格的借阅者  → 借出给此人\n借出 + 其他人归还     → 拒绝，仍借给原借阅者\n借出 + 当前借阅者归还 → 空闲\n有预约时，仅队首有优先借阅权' },
      examples: [
        ex('design-object-transition', '实现书的最小借还状态变化', '起步', `class Book:
    def __init__(self, code):
        self.code = code
        self.borrower = None

    def borrow(self, user):
        if self.borrower is not None:
            return False
        self.borrower = user
        return True

    def give_back(self, user):
        if self.borrower != user:
            return False
        self.borrower = None
        return True

book = Book("A")
print(book.borrow("M"))
print(book.give_back("N"), book.borrower)
print(book.give_back("M"), book.borrower)
`, 'True\nFalse M\nTrue None\n', '建立初版单书规则，验证错误不会污染状态。',
        ['None 表示当前空闲。', '非借阅者归还失败，保留原借阅者。', '正常归还后恢复空闲。'],
        '在读取和验证原借阅者之前清空它，会让错误归还生效。'),
        ex('design-object-index', '由馆对象保证编号唯一', '起步', `from dataclasses import dataclass

@dataclass
class Book:
    code: str
    title: str

class Catalog:
    def __init__(self):
        self.books = {}

    def add(self, book):
        if book.code in self.books:
            return False
        self.books[book.code] = book
        return True

catalog = Catalog()
print(catalog.add(Book("T1", "地图")))
print(catalog.add(Book("T1", "手册")))
print(catalog.books["T1"].title)
`, 'True\nFalse\n地图\n', '将跨记录唯一性留给索引负责者。',
        ['数据类只描述一份记录。', 'Catalog 查自己的索引来识别重复。', '拒绝重复后不会覆盖旧记录。'],
        '每本书都不应保存全馆的索引副本。'),
      ],
    },
    {
      title: '拆分可变规则，逐步重构',
      explanation: [
        '借阅限制可能按服务类型调整。将规则放进 can_borrow(active_count) 接口，各类型可共享父类并具有不同实现；馆对象接收并使用策略。这样可以用总额度为零的替身检验失败，不必构造真实借阅历史。',
        '多个状态同时受影响时，先完整验证，再集中提交。比如队首资格、馆藏可用性和限额都通过以后，才更新借阅者和预约队列。若需要维护额外借阅数索引，测试它与实际书件状态是否一致。',
        '状态能按需求查询即可。初版允许逐书扫描获取借阅数，系统扩大后再考虑增量索引。列表弹出队首有移动成本，预约规模大时考虑 deque。持久化、并发借还和日期逾期需要额外模型，可留作拓展。',
      ],
      examples: [
        ex('design-object-policy', '在不改入口的情况下比较两种策略', '应用', `class Policy:
    limit = 2

    def allows(self, active):
        return active < self.limit

class Quick(Policy):
    limit = 1

class Desk:
    def __init__(self, policy):
        self.policy = policy

    def check(self, active):
        return "OK" if self.policy.allows(active) else "LIMIT"

print(Desk(Policy()).check(1))
print(Desk(Quick()).check(1))
`, 'OK\nLIMIT\n', '通过注入方式对同一输入测试不同规则。',
        ['Quick 符合 Policy 的同一接口。', 'Desk 把真实条件委托给策略。', '更换策略时指令格式和调用代码保持一致。'],
        '将具体规则写死在命令解析会造成多个分支分别复制借阅逻辑。'),
        ex('design-object-queue', '先验证预约和限额，再消费队首', '应用', `class ReservedItem:
    def __init__(self):
        self.queue = ["A", "B"]
        self.borrower = None

    def checkout(self, user, allowed):
        if self.borrower is not None or not allowed:
            return False
        if self.queue and self.queue[0] != user:
            return False
        self.borrower = user
        if self.queue:
            self.queue.pop(0)
        return True

item = ReservedItem()
print(item.checkout("A", False), item.queue)
print(item.checkout("B", True), item.queue)
print(item.checkout("A", True), item.queue)
`, "False ['A', 'B']\nFalse ['A', 'B']\nTrue ['B']\n", '跟踪拒绝和成功对两个状态的影响。',
        ['A 的限额未通过，队首仍为 A。', 'B 无法越过 A。', 'A 合法借出后才移除队首。'],
        '通用项目中读取 queue[0] 前还应判断队列是否为空。'),
      ],
    },
  ],
  comparisons: { headings: ['对象或层', '负责什么', '可用什么来测'], rows: [
    ['Book', '记录标题、借阅人、预约等单件状态', '单件借还、错误身份'],
    ['Library', '馆藏索引与跨对象协调', '重复编号、多馆独立、失败整体不变'],
    ['Policy', '判断持有本数是否符合规则', '阈值与可替换的拒绝策略'],
    ['命令入口', '解析与显示', '完整交互输出'],
  ] },
  applications: ['先用短场景验证规则，再拆类或增添索引。', '验收项目时独立检查库存、队列、规则，可用测试替身隔离故障。'],
  mistakes: [
    { symptom: '超额拒绝后预约顺序变化', reason: '验证未完成就弹出了队首。', fix: '先决定是否成功，成功分支再一起提交变更。', check: '把前后查询和失败命令放在同一场景。' },
    { symptom: '添加第二个馆后发现第一馆的书', reason: '把馆藏字典定义为类属性。', fix: '在各馆初始化各自索引。', check: '给两馆录入相同编号而标题不同。' },
  ],
  summary: ['先确定状态归属和公开返回契约，再决定类和方法。', '策略和业务状态可独立测试，失败路径先验证后提交。', '重构与优化前保存能发现边界错误的完整交互。'],
  next: '完成本模块测评后，打开综合项目中的「图书借阅与预约管理」，按阶段计划完成完整程序。',
  exercises: [
    q('object-design-id-owner', '选择跨书目编号唯一检查的职责', '谁最适合判断馆内是否存在重复编号？', 1, [
      ['每本书分别检查', '单本书没有馆内完整索引。'], ['持有编号索引的馆对象', '馆对象能比较现有状态。'], ['借阅策略', '策略负责借阅配额。'],
    ]),
    q('object-design-state', '预测失败后还剩哪些数据', '下面输出什么？', 0, [
      ['A', '拒绝后的借阅者应保持。'], ['空闲', '只有合法归还才清空。'], ['B', '归还操作不会把图书借给 B。'],
    ], 'class Book:\n    def __init__(self):\n        self.borrower = "A"\n    def give_back(self, user):\n        if self.borrower == user:\n            self.borrower = None\n\nbook = Book()\nbook.give_back("B")\nprint(book.borrower or "空闲")', 'A\n'),
    q('object-design-queue', '定位队首何时消费', '预约队首已到，但用户超出配额，应该执行什么？', 2, [
      ['移除队首再拒绝', '这会改变预约资格。'], ['借出再记录超额', '超额时必须拒绝。'], ['拒绝，并保留借阅状态和队首', '只在校验都通过后提交。'],
    ]),
    q('object-design-refactor', '识别能验证重构的一组用例', '把借阅规则拆成策略前，优先补充哪种测试？', 1, [
      ['只验证类名', '类型名无法说明规则是否保留。'], ['用相同交互核对初始、失败、成功和查询', '前后需得到同样的可观察结果。'], ['只跑一次 ADD', '新增通常不会触发借阅规则。'],
    ]),
    coding('A089', '基础编程', '维护登记、下架与编号复用，检查标题相同时其他书目是否受影响。'),
    coding('A090', '独立编程', '维护单件预约顺序与去重。'),
    coding('A091', '综合应用', '让两个柜台独立处理借出与归还。'),
    coding('A092', '拓展挑战', '组合设备状态与预约优先级，完成模块测评。'),
  ],
  references: [
    reference('类、实例与继承', 'tutorial/classes.html', '复核模型使用的对象行为。'),
    reference('数据类', 'library/dataclasses.html', '用记录建模与独立预约列表。'),
  ],
};
