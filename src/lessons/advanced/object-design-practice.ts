import { objectTags } from './authoring.ts';
import { task } from './practice.ts';
import { equipmentOutputBoundary } from './output-boundaries.ts';

const design = objectTags[6];

export const objectDesignProblems = [
  task(89, design, '入门', '馆藏的唯一登记', {
    background: '登记完成的馆藏可能下架，下架编号可以重新使用。', description: '重号登记拒绝且保留旧标题。下架只移除指定编号。下架后查询不到旧记录，重新登记后应显示新标题。',
    input: '首行 q。后 q 行为 ADD 编号 标题、ASK 编号或 REMOVE 编号。', output: 'ADD 输出 OK 或 DUP，ASK 输出标题或 NA，REMOVE 存在时输出 OK，否则输出 NA。',
    limits: '0 ≤ q ≤ 300，编号与标题为 1–10 位英数字。',
  }, ['8\nADD T Map\nADD T Atlas\nREMOVE T\nASK T\nREMOVE T\nADD T Atlas\nASK T\nASK S\n', 'OK\nDUP\nOK\nNA\nNA\nOK\nAtlas\nNA\n', '重号失败后仍可下架原记录。清空索引中的 T 后，T 可以重新登记。'],
  [['0\n', ''], ['2\nADD A A\nASK A\n', 'OK\nA\n'], ['3\nADD 00 X\nASK 0\nASK 00\n', 'OK\nNA\nX\n'],
    ['6\nADD A Map\nADD B Map\nREMOVE A\nASK A\nASK B\nREMOVE B\n', 'OK\nOK\nOK\nNA\nMap\nOK\n']],
  ['把书件记录和馆藏索引分开。', '登记前先检查编号。'], `from dataclasses import dataclass

@dataclass
class Record:
    code: str
    title: str

class Catalog:
    def __init__(self):
        self._items = {}

    def add(self, record):
        if record.code in self._items:
            return "DUP"
        self._items[record.code] = record
        return "OK"

    def title(self, code):
        item = self._items.get(code)
        return "NA" if item is None else item.title

    def remove(self, code):
        return "NA" if self._items.pop(code, None) is None else "OK"

catalog = Catalog()
for _ in range(int(input())):
    action, code, *titles = input().split()
    if action == "ADD":
        print(catalog.add(Record(code, titles[0])))
    elif action == "REMOVE":
        print(catalog.remove(code))
    else:
        print(catalog.title(code))
`, { concepts: ['状态归属', '字典索引', '唯一性'], approach: '记录只保存字段，馆藏决定是否允许新增。',
    steps: ['从输入明确动作。', '新增前先查重，下架只删除指定键。', '用查找结果显示标题，验证下架后的编号可以复用。'],
    time: '平均 O(q)。', space: 'O(q)。', pitfall: '标题相同仍可登记成多个编号。',
    extension: '为下架事件保留单独历史，允许按旧编号检索所有曾登记的标题。' }),

  task(90, design, '入门', '预约队列的撤销与出队', {
    background: '预约名单先到先服务。用户取消后重新预约需要排到末尾。',
    description: 'JOIN 已有用户时输出 DUP，否则加入并输出 OK。CANCEL 仅移除指定用户，存在输出 OK，否则 NA。NEXT 移除并输出队首，空时输出 NONE。',
    input: '首行 q。后 q 行为 JOIN 用户、CANCEL 用户或 NEXT。', output: '每条命令输出一行。',
    limits: '0 ≤ q ≤ 200，用户为 1–8 位英数字。',
  }, ['8\nJOIN A\nJOIN B\nCANCEL A\nJOIN A\nJOIN B\nNEXT\nNEXT\nNEXT\n', 'OK\nOK\nOK\nOK\nDUP\nB\nA\nNONE\n', 'A 取消后重入排到 B 之后。'],
  [['0\n', ''], ['2\nCANCEL Z\nNEXT\n', 'NA\nNONE\n'], ['3\nJOIN X\nNEXT\nJOIN X\n', 'OK\nX\nOK\n']],
  ['列表保留顺序。', '把去重、移除、取队首集中在预约对象内。'], `class Waitlist:
    def __init__(self):
        self._users = []

    def join(self, user):
        if user in self._users:
            return "DUP"
        self._users.append(user)
        return "OK"

    def cancel(self, user):
        if user not in self._users:
            return "NA"
        self._users.remove(user)
        return "OK"

    def next_user(self):
        return self._users.pop(0) if self._users else "NONE"

waitlist = Waitlist()
for _ in range(int(input())):
    action, *user = input().split()
    if action == "JOIN":
        print(waitlist.join(user[0]))
    elif action == "CANCEL":
        print(waitlist.cancel(user[0]))
    else:
        print(waitlist.next_user())
`, { concepts: ['先到先服务', '独立状态', '队列操作'], approach: '队列控制自己的修改，调用者根据返回值展示。',
    steps: ['进入前检查是否已经排队。', '取消时只移除目标。', '取队首时处理空队列。'],
    time: '最坏 O(q²)，成员检查和列表出队会扫描或移动。', space: 'O(q)。',
    pitfall: '使用集合代替队列会丢掉顺序。', extension: '增大队列规模后比较其他数据结构的代价。' }),

  task(91, design, '基础', '双柜台借用和回收', {
    background: '两台设备柜分别有可借容量，归还只流回原柜类别。',
    description: 'TAKE 柜台：有可借则扣一。BACK 柜台：已借出至少一件才可归还一件。ASK 查看两柜可借量。',
    input: '首行 capA capB q。随后 q 行为 TAKE A 或 B、BACK A 或 B、或 ASK。',
    output: '借还成功输出 OK，失败输出 NO。ASK 输出 A、B 当前可用量。',
    limits: '0 ≤ q ≤ 200，容量 0–1000。每柜从全部可用开始。',
  }, ['1 2 6\nTAKE A\nTAKE A\nBACK B\nTAKE B\nBACK A\nASK\n', 'OK\nNO\nNO\nOK\nOK\n1 1\n', '失败的归还不应让 B 超容量。'],
  [['0 0 1\nASK\n', '0 0\n'], ['1 1 0\n', ''], ['1 1 4\nTAKE B\nASK\nBACK B\nASK\n', 'OK\n1 0\nOK\n1 1\n']],
  ['每柜独立保存容量与可借量。', '用同一对象接口判断借出和归还。'], `class Counter:
    def __init__(self, capacity):
        self._capacity = capacity
        self.available = capacity

    def change(self, delta):
        candidate = self.available + delta
        if not 0 <= candidate <= self._capacity:
            return "NO"
        self.available = candidate
        return "OK"

a, b, q = map(int, input().split())
desks = {"A": Counter(a), "B": Counter(b)}
for _ in range(q):
    action, *key = input().split()
    if action == "ASK":
        print(desks["A"].available, desks["B"].available)
    else:
        print(desks[key[0]].change(-1 if action == "TAKE" else 1))
`, { concepts: ['多实例', '分类容量', '失败原值'], approach: '每个容量类别是一份独立对象，边界集中在同一个方法。',
    steps: ['从容量构造各柜。', '按指令改变指定柜。', '在失败与成功后都能查询。'],
    time: 'O(q)。', space: 'O(1)。', pitfall: '归还时只检查当前值非负会放过超容量。',
    extension: '按借用人的身份记录借还关系，拒绝归还他人借件。' },
  { kind: 'adapted', platform: 'LeetCode', title: 'Design Parking System', id: '1603', level: 'Easy',
    url: 'https://leetcode.com/problems/design-parking-system/', concepts: ['分类型容量', '持续变更状态'],
    adaptation: '改成两个设备柜及标准输入，加入逆向归还、失败保持状态和可用量查询。' }),

  task(92, design, '进阶', '单件设备的预约优先', {
    background: '共享器材有当前借用人和待借队列。设备归还后按队首顺序获得优先权。',
    description: 'QUEUE 将用户加入尾部，已借用者或早已在队列里的用户输出 DUP。BORROW 先判设备被借出（BUSY），再判非队首（WAIT），其余成功借出且移除匹配队首。RETURN 仅允许当前借用者归还。SHOW 查询。',
    input: '首行 q，随后 q 行为 QUEUE 用户、BORROW 用户、RETURN 用户或 SHOW。',
    output: '每条输出一行。成功为 OK，归还身份错误为 DENIED，其他失败按描述。SHOW 输出「借用者 排队列表」，空字段用 -，列表用逗号连接。',
    limits: '0 ≤ q ≤ 300，用户为 1–8 位 ASCII 英数字。初始空闲、无人排队，归还不自动借给队首。按命令顺序模拟，每次 SHOW 计 max(1, 当时排队人数)，所有 SHOW 合计不超过 6980。每条命令最多 9 字节固定开销，每个计数单位再预留 9 字节，总输出不超过 65520 字节。',
  }, ['11\nQUEUE A\nQUEUE B\nBORROW B\nBORROW A\nQUEUE A\nRETURN B\nSHOW\nRETURN A\nBORROW C\nBORROW B\nSHOW\n',
    'OK\nOK\nWAIT\nOK\nDUP\nDENIED\nA B\nOK\nWAIT\nOK\nB -\n', 'B 插队失败，A 借到后才从队列删除。'],
  [['0\n', ''], ['4\nSHOW\nRETURN X\nBORROW X\nSHOW\n', '- -\nDENIED\nOK\nX -\n'],
   ['7\nBORROW A\nQUEUE B\nQUEUE B\nBORROW B\nRETURN A\nSHOW\nBORROW B\n', 'OK\nOK\nDUP\nBUSY\nOK\n- B\nOK\n'],
   ['5\nQUEUE A\nQUEUE B\nQUEUE C\nBORROW B\nSHOW\n', 'OK\nOK\nOK\nWAIT\n- A,B,C\n'],
   ['11\nQUEUE A\nQUEUE B\nBORROW B\nSHOW\nSHOW\nBORROW A\nRETURN B\nSHOW\nSHOW\nRETURN A\nSHOW\n',
    'OK\nOK\nWAIT\n- A,B\n- A,B\nOK\nDENIED\nA B\nA B\nOK\n- B\n'],
   [equipmentOutputBoundary.input, equipmentOutputBoundary.output]],
  ['先列出每个动作读写哪些状态。', '借出时等所有检查通过再变更借用者与队列。'], `class Equipment:
    def __init__(self):
        self._borrower = None
        self._queue = []

    def hold(self, user):
        if self._borrower == user or user in self._queue:
            return "DUP"
        self._queue.append(user)
        return "OK"

    def borrow(self, user):
        if self._borrower is not None:
            return "BUSY"
        if self._queue and self._queue[0] != user:
            return "WAIT"
        self._borrower = user
        if self._queue:
            self._queue.pop(0)
        return "OK"

    def give_back(self, user):
        if self._borrower != user:
            return "DENIED"
        self._borrower = None
        return "OK"

    def show(self):
        return (self._borrower or "-") + " " + (",".join(self._queue) or "-")

item = Equipment()
actions = {"QUEUE": item.hold, "BORROW": item.borrow, "RETURN": item.give_back, "SHOW": item.show}
for _ in range(int(input())):
    command, *args = input().split()
    print(actions[command](*args))
`, { concepts: ['状态机', '预约顺序', '职责拆分'], approach: '通过同一对象方法维持借阅者和预约列表之间的一致性。',
    steps: ['对预约和借用分别检查前置条件。', '只在成功借出时消费队首。', '保留查询用于核对失败后的真实状态。'],
    time: '最坏 O(q²)，包含成员检查、移动和打印队列。', space: 'O(q)。',
    pitfall: '归还应只清空借用者。预约队列继续控制下一次借用。',
    extension: '将单件设备组合进带多件索引的管理器，添加不同角色的借用上限。' }),
];
