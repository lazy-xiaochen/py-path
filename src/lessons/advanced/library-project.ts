import type { Problem, Project } from '../../content';
import { objectTags } from './authoring.ts';
import { libraryOutputBoundary } from './output-boundaries.ts';

const verification = `from library import Book, Library, LoanPolicy, QuickLoanPolicy

class DenyAll:
    def allows(self, active_count):
        return False

def check(mode):
    if mode == "shape":
        book = Book("Q", "Atlas")
        return (book.code == "Q" and book.title == "Atlas"
                and issubclass(QuickLoanPolicy, LoanPolicy)
                and LoanPolicy().allows(1) and not LoanPolicy().allows(2)
                and QuickLoanPolicy().allows(0) and not QuickLoanPolicy().allows(1))
    if mode == "isolation":
        east, west = Library(LoanPolicy()), Library(LoanPolicy())
        return (east.add("A", "Map") == "OK" and west.add("A", "Atlas") == "OK"
                and east.hold("A", "U") == "OK" and east.borrow("A", "U") == "OK"
                and east.show("A") == "A Map U -" and west.show("A") == "A Atlas - -")

    branch = Library(DenyAll() if mode == "injected" else LoanPolicy())
    branch.add("C", "Guide")
    if mode == "injected":
        return (branch.hold("C", "U") == "OK" and branch.borrow("C", "U") == "LIMIT"
                and branch.show("C") == "C Guide - U")
    if mode == "fifo":
        return (branch.hold("C", "U") == "OK" and branch.hold("C", "V") == "OK"
                and branch.borrow("C", "V") == "RESERVED" and branch.borrow("C", "U") == "OK"
                and branch.show("C") == "C Guide U V")
    return (branch.borrow("C", "U") == "OK" and branch.return_book("C", "V") == "DENIED"
            and branch.show("C") == "C Guide U -" and branch.return_book("C", "U") == "OK")
`;

const check = (...names: string[]) => ({
  fixtures: [{ name: 'library_check.py', content: verification }],
  calls: names.map(name => ({ args: [name], expected: true })),
});

const main = `from library import Library, LoanPolicy, QuickLoanPolicy

def main():
    mode, count = input().split()
    policy = LoanPolicy() if mode == "NORMAL" else QuickLoanPolicy()
    library = Library(policy)
    methods = {
        "ADD": library.add, "HOLD": library.hold, "BORROW": library.borrow,
        "RETURN": library.return_book, "SHOW": library.show,
    }
    for _ in range(int(count)):
        command, *args = input().split()
        print(methods[command](*args))

if __name__ == "__main__":
    main()
`;

const solution = `from dataclasses import dataclass, field

@dataclass
class Book:
    code: str
    title: str
    borrower: str | None = None
    queue: list[str] = field(default_factory=list)

class LoanPolicy:
    limit = 2

    def allows(self, active_count):
        return active_count < self.limit

class QuickLoanPolicy(LoanPolicy):
    limit = 1

class Library:
    def __init__(self, policy):
        self._policy = policy
        self._books = {}
        self._active = {}

    def add(self, code, title):
        if code in self._books:
            return "DUP"
        self._books[code] = Book(code, title)
        return "OK"

    def hold(self, code, user):
        book = self._books.get(code)
        if book is None:
            return "UNKNOWN"
        if book.borrower == user or user in book.queue:
            return "DUP"
        book.queue.append(user)
        return "OK"

    def borrow(self, code, user):
        book = self._books.get(code)
        if book is None:
            return "UNKNOWN"
        if book.borrower is not None:
            return "BUSY"
        if book.queue and book.queue[0] != user:
            return "RESERVED"
        active = self._active.get(user, 0)
        if not self._policy.allows(active):
            return "LIMIT"
        if book.queue:
            book.queue.pop(0)
        book.borrower = user
        self._active[user] = active + 1
        return "OK"

    def return_book(self, code, user):
        book = self._books.get(code)
        if book is None:
            return "UNKNOWN"
        if book.borrower != user:
            return "DENIED"
        book.borrower = None
        self._active[user] -= 1
        return "OK"

    def show(self, code):
        book = self._books.get(code)
        if book is None:
            return "UNKNOWN"
        return f"{book.code} {book.title} {book.borrower or '-'} {','.join(book.queue) or '-'}"
`;

const assessment: Problem = {
  id: 'library-loans', title: '图书借阅与预约管理', tag: objectTags[6], difficulty: '进阶',
  background: '社区馆有多个书件、并行借阅者与逐书预约。服务台希望统一命令，同时按模式选择借阅上限。',
  description: '实现 ADD 登记、HOLD 预约、BORROW 借阅、RETURN 归还、SHOW 查询。借阅依次检查书件存在、是否已借出、是否有其他队首，再检查配额。全部通过后更新借阅者，若有预约则移除匹配队首。合法归还只释放书件和持有名额，不自动借书。',
  input: '首行「NORMAL 或 QUICK q」。后 q 行分别为 ADD 编号 标题、HOLD 编号 用户、BORROW 编号 用户、RETURN 编号 用户或 SHOW 编号。NORMAL 允许每人同时借两本，QUICK 允许一本。固定接口写在 library.py：Book(code, title) 公开 code 与 title；QuickLoanPolicy 继承 LoanPolicy，两者提供 allows(active_count)；Library(policy) 依赖所传策略，提供 add(code, title)、hold(code, user)、borrow(code, user)、return_book(code, user)、show(code)，方法返回对应的一行字符串。',
  output: '每条命令输出一行。新增重号输出 DUP 并保留旧书。除 ADD 外找不到编号时为 UNKNOWN。HOLD 遇到借阅者本人或已排队用户为 DUP。BORROW 根据失败顺序输出 BUSY、RESERVED 或 LIMIT。RETURN 用户与当前借阅者不匹配时为 DENIED。其他成功变更为 OK。SHOW 输出「编号 标题 借阅者 预约列表」，空字段写 -，预约项用逗号连接。',
  limits: '0 ≤ q ≤ 240，编号、标题和用户为 1–10 位 ASCII 英数字，区分大小写。按命令顺序模拟并计算输出预算：查询已登记书件的 SHOW 计 33 + 11 × max(1, 该书当时预约人数)，其他命令（包括查询未登记书件）各计 9。合计不得超过 65536，包含分隔符和换行。失败不改状态；各 Library 实例数据隔离。导入 library.py 和调用其方法都不打印或读取标准输入。',
  contract: { kind: 'module', files: ['main.py', 'library.py'], target: { module: 'library_check', name: 'check' } },
  starterFiles: [{ name: 'main.py', content: main }, { name: 'library.py', content: `class Book:
    def __init__(self, code, title):
        self.code = code
        self.title = title
        # 记录当前借阅者和独立的预约队列。

class LoanPolicy:
    def allows(self, active_count):
        raise NotImplementedError("先实现普通模式")

class QuickLoanPolicy(LoanPolicy):
    # 复用接口，提供加快周转的配额。
    pass

class Library:
    def __init__(self, policy):
        self._policy = policy
        self._books = {}

    def add(self, code, title):
        raise NotImplementedError("先完成馆藏登记并校验重复编号")

    def hold(self, code, user):
        raise NotImplementedError("维护单书预约先后")

    def borrow(self, code, user):
        raise NotImplementedError("先校验，成功后再修改状态")

    def return_book(self, code, user):
        raise NotImplementedError("验证当前借阅者")

    def show(self, code):
        raise NotImplementedError("按契约返回一行字符串")
` }],
  sample: ['NORMAL 12\nADD A Map\nADD B Atlas\nBORROW A Ann\nHOLD A Bea\nHOLD A Cam\nBORROW B Ann\nRETURN A X\nRETURN A Ann\nBORROW A Cam\nBORROW A Bea\nSHOW A\nSHOW B\n',
    'OK\nOK\nOK\nOK\nOK\nOK\nDENIED\nOK\nRESERVED\nOK\nA Map Bea Cam\nB Atlas Ann -\n',
    '错误归还未改变借阅者，真实归还未消耗预约。Cam 插队失败，Bea 借到后 Cam 成为队首。', check('shape', 'fifo')],
  cases: [
    ['NORMAL 0\n', '', check('isolation')],
    ['QUICK 9\nADD A Map\nADD B Atlas\nBORROW B Ann\nHOLD A Ann\nBORROW A Ann\nSHOW A\nRETURN B Ann\nBORROW A Ann\nSHOW A\n',
      'OK\nOK\nOK\nOK\nLIMIT\nA Map - Ann\nOK\nOK\nA Map Ann -\n', check('injected')],
    ['NORMAL 8\nADD A Map\nADD A Copy\nBORROW Z E\nHOLD Z E\nRETURN A E\nBORROW A E\nBORROW A E\nSHOW A\n',
      'OK\nDUP\nUNKNOWN\nUNKNOWN\nDENIED\nOK\nBUSY\nA Map E -\n', check('owner')],
    ['NORMAL 11\nADD A Map\nADD B Atlas\nADD C Echo\nBORROW A U\nBORROW B U\nBORROW C U\nHOLD C V\nBORROW C U\nRETURN A U\nBORROW C V\nSHOW C\n',
      'OK\nOK\nOK\nOK\nOK\nLIMIT\nOK\nRESERVED\nOK\nOK\nC Echo V -\n', check('shape', 'injected')],
    ['QUICK 8\nADD A Map\nBORROW A U\nHOLD A U\nHOLD A V\nBORROW A V\nRETURN A U\nHOLD A V\nSHOW A\n',
      'OK\nOK\nDUP\nOK\nBUSY\nOK\nDUP\nA Map - V\n', check('fifo', 'isolation')],
    [libraryOutputBoundary.input, libraryOutputBoundary.output, check('injected')],
  ],
  hints: ['先让 ADD 和 SHOW 形成最短的一条可运行路线，再加入借还，在没有预约时验证身份与独立馆藏。', '借阅失败时不要弹出队首。把允许借阅的判断交给传入的 policy.allows(当前持有量)。'],
  solution: main,
  solutionFiles: [{ name: 'library.py', content: solution }],
  guide: {
    concepts: ['数据类与独立列表', '封装', '继承与多态', '组件注入', '有状态交互'],
    approach: '用书件记录维护局部状态，由持有策略的 Library 协调全馆索引和名额。命令入口只做解析和显示。可先扫描书件计算持有量，再在测试保护下实现增量计数。',
    steps: ['以 Book 保存单书及预约。独立构造每个馆的索引。', '定义两个兼容的配额策略，用继承共享校验结构。',
      '借出先校验存在、空闲、队首、配额，成功后同时变更书件、队列与计数。', '只允许当前借阅者归还，用两种策略和被拒绝的操作检查状态。'],
    time: '字典查找平均 O(1)，单次预约去重、队首删除与显示可能 O(k)，k 为该书排队数。',
    space: 'O(b+r+u)，b 为书件数、r 为排队记录数、u 为出现过的借阅者。',
    pitfall: '策略拒绝时必须保留预约和借阅计数。对错误归还也不能减计数。', extension: '增加取消预约或续借，将逾期计算单独建模并补上失败复测。',
  },
};

export const libraryProject: Project = {
  id: assessment.id, title: assessment.title, tags: '进阶篇结项 · 面向对象与多文件',
  description: '从馆藏索引和借还状态入手，实现逐书预约、公平借阅和可替换的配额策略。',
  steps: assessment.guide!.steps, input: assessment.sample[0], expected: assessment.sample[1],
  acceptance: assessment.sample[2], files: assessment.starterFiles!, solution: assessment.solution, assessment,
  brief: {
    requirements: ['main.py 负责入口。library.py 提供 Book、Library、LoanPolicy、QuickLoanPolicy，并保持所列方法签名。',
      '一馆拥有书目字典，每本书的预约列表独立。持有数可现算或维护索引，失败总应保留状态。',
      'Library 通过 allows(active_count) 使用传入的组件。本项目的独立检查会注入全拒绝策略，验证替换后行为。'],
    design: ['画出 Book 字段与两类借阅策略，箭头从 Library 指向书目集合和策略对象。命令行只调用这些公开接口。',
      '为借出列出顺序：缺书、已借出、预约优先、配额。让所有校验成功后才提交变更。',
      '登记与查询适合先完成，随后以同一输入验证重构后的借还。顺序操作确定后再加入预约与策略。'],
    stages: [
      { title: '登记和查询', work: '建 Book 与馆藏索引，实现 add 和 show。', check: '同一馆重复编号保留旧标题；两馆可登记同号不同标题。' },
      { title: '借出与归还', work: '用明确的空闲标记记录借阅者，实现成功和拒绝。', check: '借给 A 后由 B 归还应拒绝，随后查询仍显示 A。' },
      { title: '预约与规则替换', work: '按书保存 FIFO 队列，使用继承设置两种借阅策略，组合进 Library。', check: '队首超额要留下预约；归还其他书后，应能按原队首身份再借。' },
      { title: '交互与验收', work: '连接起始命令入口，运行示例和接口检查。', check: '同一命令序列用两种模式运行一遍，确认只有配额行为随策略变化。' },
    ],
    checklist: ['正式提交应通过命令输出及独立接口检查。额外自测多馆隔离、重复预约、排队时错误归还与配额失败后重借。',
      '能画出类之间的使用关系，并解释拒绝分支要保持哪些状态。'],
    extensions: ['为预约加入撤销或过期。先定义成功与失败时如何更新队列，再扩大命令和测试覆盖。'],
  },
};
