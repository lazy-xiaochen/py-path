import type { Problem } from '../../content';
import { expressionTags, functionTags, objectTags, structureTags } from './authoring.ts';
import { interfaceTask } from './interface-practice.ts';
import { task } from './practice.ts';

const activeIds = task(98, structureTags[4], '基础', '撤回后的活动编号清单', {
  background: '签到系统收到重复的录入、撤回与核验请求。需要维护当前有效的数字编号。',
  description: 'ADD 把编号加入当前清单，重复加入没有额外效果。DROP 从当前清单撤回编号，不存在时忽略。HAS 查询当前是否有效。最后输出升序的唯一有效编号。',
  input: '首行 q。接下来 q 行为 ADD id、DROP id 或 HAS id。',
  output: '对每条 HAS 输出 YES 或 NO。最后输出空格连接的升序编号，空清单输出 EMPTY。',
  limits: '0 ≤ q ≤ 1000，0 ≤ id ≤ 1000000。',
}, ['9\nADD 8\nADD 2\nADD 8\nDROP 2\nHAS 2\nADD 10\nADD 2\nHAS 2\nHAS 1\n',
  'NO\nYES\nNO\n2 8 10\n', '先撤回 2，再重新加入。最后按数值排序。'], [
  ['0\n', 'EMPTY\n'], ['3\nDROP 0\nADD 0\nDROP 0\n', 'EMPTY\n'],
  ['6\nADD 1000000\nHAS 1000000\nDROP 5\nADD 0\nADD 3\nHAS 3\n', 'YES\nYES\n0 3 1000000\n'],
], ['用同一种结构处理成员查询与去重。撤回不存在的成员也应继续运行。', '事件处理结束后才排序。先转成整数，再排序。'], `active = set()
for _ in range(int(input())):
    action, field = input().split()
    code = int(field)
    if action == "ADD":
        active.add(code)
    elif action == "DROP":
        active.discard(code)
    else:
        print("YES" if code in active else "NO")
print(" ".join(map(str, sorted(active))) or "EMPTY")
`, { concepts: ['集合', '成员判断', '去重与排序'], approach: '集合只记录当前有效编号，按命令顺序变化。排序生成最终报告。',
  steps: ['解析编号为整数。', '对集合执行添加、撤回或查询。', '排序当前集合并输出。'],
  time: '平均 O(q+k log k)，k 为最终有效编号数。', space: 'O(q) 最坏。',
  pitfall: '字符串排序会把 10 放在 2 前面。remove 会在撤回不存在的成员时报错。',
  extension: '增加缀有时间戳的撤回记录，比较保存事件列表与仅保存当前集合的差异。',
}, { kind: 'adapted', platform: '洛谷', title: '明明的随机数', id: 'P1059', level: '入门',
  url: 'https://www.luogu.com.cn/problem/P1059', concepts: ['唯一整数', '升序输出'],
  adaptation: '保留去重和整数升序。把一次性输入改成可撤回、可重加、可在线查询的签到记录。' });

const ballot = task(99, expressionTags[3], '进阶', '可改票的推荐榜', {
  background: '评委账号只有最后一条选择生效，最终统计并列第一的展区。',
  description: '按账号只保留最后一条提交。展区名统一转小写。若最新选择为 -，该账号弃权。输出所有最高票展区。',
  input: '首行 n，随后 n 行「账号 展区」或「账号 -」。',
  output: '无有效票输出 NONE。有票时每个并列最高展区各一行「小写展区 得票数」，按展区名升序输出。',
  limits: '0 ≤ n ≤ 1000，账号是 1–10 位 ASCII 英数字，区分大小写。展区为 1–12 位 ASCII 字母。',
}, ['7\nA North\nB SOUTH\nA south\nB -\nC EAST\nD east\nE SOUTH\n', 'east 2\nsouth 2\n',
  'A 改投 south，B 弃权。C 和 D 的选择归一化后同属 east。'], [
  ['0\n', 'NONE\n'], ['3\nA X\nA -\nB -\n', 'NONE\n'],
  ['7\nX A\nx a\nY Z\nY b\nZ B\nZ -\nT z\n', 'a 2\n'],
], ['先用一次解包把每个账号的最后选择装入字典。', '用生成器把最终选择归一化并跳过弃权，再统计频次及筛选最高值。'], `n = int(input())
latest = {account: choice for account, choice in (input().split() for _ in range(n))}
counts = {}
for choice in (choice.lower() for choice in latest.values() if choice != "-"):
    counts[choice] = counts.get(choice, 0) + 1
best = max(counts.values(), default=0)
winners = sorted((choice, count) for choice, count in counts.items() if count == best)
for choice, count in winners:
    print(choice, count)
if not winners:
    print("NONE")
`, { concepts: ['解包', '字典推导式', '生成器表达式', '并列频次'],
  approach: '最新选择与频次分别使用两个映射。归一化在最后选择确定后进行，弃权不会恢复旧票。',
  steps: ['解包每次提交，让后值覆盖账号的旧选择。', '生成有效小写名称并计数。', '找到最高值，筛选、排序后输出。'],
  time: '平均 O(n + k log k)，k 为并列第一数。', space: 'O(n)。',
  pitfall: '先过滤弃权会错误保留该账号的旧票。对账号做小写会合并大小写不同的账号。',
  extension: '加入最低票数门槛，并验证所有选择已撤回时的输出。',
}, { kind: 'adapted', platform: 'AtCoder', title: 'Poll', id: 'ABC155 C', level: 'C',
  url: 'https://atcoder.jp/contests/abc155/tasks/abc155_c?lang=en', concepts: ['频次统计', '并列最高', '字典序'],
  adaptation: '保留所有并列最高者的字典序输出。新增账号改票、弃权、展区大小写归一化和票数列。' });

const registration = task(100, functionTags[3], '进阶', '独立房间的名称分配器', {
  background: '两个房间分别分配公开名称。用户可以直接申请带数字的名称，自动生成的名称也必须避开这些占用。',
  description: '房间按命令初始化为空。申请名称未使用时原样分配，否则从 1 起追加最小可用正整数后缀。后缀直接连在完整请求名后，分配后永久占用。',
  input: '首行 q，接下来 q 行「房间 请求名」。房间为 A 或 B。',
  output: '每次申请输出一行实际分配名。对已有后缀的请求也按完整字符串寻找新后缀。',
  limits: '0 ≤ q ≤ 2000，请求名由 1–10 位小写 ASCII 字母或数字组成。试用函数工厂生成两个分配器。自动评测核对分配行为。',
}, ['8\nA pin1\nA pin\nB pin\nA pin\nA pin2\nB pin\nA pin3\nA pin\n',
  'pin1\npin\npin\npin2\npin21\npin1\npin3\npin4\n', 'A 的 pin1 已手动占用，下次分配 pin 时跳到 pin2。B 的占用独立。'], [
  ['0\n', ''], ['4\nA 0\nA 0\nA 01\nB 01\n', '0\n01\n011\n01\n'],
  ['6\nA t3\nA t2\nA t\nA t\nA t\nA t\n', 't3\nt2\nt\nt1\nt4\nt5\n'],
], ['为每个房间记录所有已分配名称。用工厂返回带自己状态的函数。', '为每种请求名记住下一个可能后缀。占用只增加，跳过的后缀以后依然不可用。'], `def make_allocator():
    used = set()
    next_suffix = {}

    def allocate(name):
        if name not in used:
            used.add(name)
            return name
        suffix = next_suffix.get(name, 1)
        while name + str(suffix) in used:
            suffix += 1
        assigned = name + str(suffix)
        next_suffix[name] = suffix + 1
        used.add(assigned)
        return assigned

    return allocate

rooms = {room: make_allocator() for room in ("A", "B")}
for _ in range(int(input())):
    room, name = input().split()
    print(rooms[room](name))
`, { concepts: ['函数工厂', '闭包状态', '名称冲突'],
  approach: '两个工厂实例分别捕获集合与下次起点。一次分配的依据始终是已占用的完整名称。',
  steps: ['名称空闲时直接登记。', '冲突时从保存的起点向后查找。', '保存下次候选位置，回报分配的新名称。'],
  time: '哈希平均 O(q+s)，s 为探查候选次数。单个占用名只能命中其若干个数字后缀拆分，题目字符上限下摊还 O(q)。',
  space: 'O(q) 个记录，受题目名字长度约束。',
  pitfall: '只记录请求名自身的次数会撞到手动占用的名字。两个房间共享 used 会错误跳号。',
  extension: '增加撤回，再说明为什么游标不能直接沿用永久占用时的设计。',
}, { kind: 'adapted', platform: 'Codeforces', title: 'Registration System', id: '4C', level: 'C',
  url: 'https://codeforces.com/problemset/problem/4/C', concepts: ['状态', '后缀冲突'],
  adaptation: '保留原名称冲突后追加最小正整数的规则。增加两个独立房间、允许申请带数字的名称，并统一输出实际分配名。' });

const lockers = interfaceTask('A101', objectTags[6], '可归还的分区储物位', '进阶', {
  background: '场馆按 S、M、L 三类管理储物位。领取后可归还，归还的类别由系统登记决定。',
  description: '实现 Lockers(small, medium, large)、take(user, size)、release(user) 和 available(size)。一个用户最多持有一个储物位，只能使用所请求的类别。归还恢复该用户原先领取的类别。',
  input: '从 main.py 导入 Lockers，构造多个实例。size 为 "S"、"M" 或 "L"。',
  output: 'take 成功返回 True。没有容量或用户已有位置时返回 False。release 成功返回 True，无持有记录时返回 False。available 返回空位整数。导入与调用时无标准输出或输入。',
  limits: '每类容量 0–50，user 为 1–15 位 ASCII 英数字。失败后的所有状态保持原样，多个实例的容量与持有记录均独立。',
}, 'from main import Lockers', [
  ['容量用完后失败，引入归还再领取。',
    `a = Lockers(1, 0, 2)
assert a.take("U1", "S") is True
assert a.take("U2", "S") is False and a.available("S") == 0
assert a.take("U1", "L") is False and a.available("L") == 2
assert a.release("U2") is False and a.available("S") == 0
assert a.release("U1") is True and a.available("S") == 1
assert a.take("U2", "S") is True and a.available("S") == 0`],
  ['同名用户在两个实例可分别领取，不串改容量。',
    `a, b = Lockers(0, 1, 1), Lockers(0, 1, 1)
assert a.take("U", "M") is True and b.available("M") == 1
assert b.take("U", "L") is True and a.available("L") == 1
assert a.release("U") is True and b.available("L") == 0
assert b.release("U") is True and a.available("M") == 1`],
  ['零容量没有兜底换类，连续归还只成功一次。',
    `a = Lockers(0, 50, 2)
assert a.take("A", "S") is False and a.available("L") == 2
assert a.take("A", "L") is True
assert a.release("A") is True
assert a.release("A") is False and a.available("L") == 2
assert a.available("S") == 0 and a.available("M") == 50`],
  ['反复归还及再领取，相同用户改用其他类别。',
    `a = Lockers(1, 1, 1)
assert a.take("A", "S") is True and a.release("A") is True
assert a.take("A", "M") is True and a.take("B", "S") is True
assert a.release("A") is True and a.available("M") == 1
assert a.available("S") == 0 and a.available("L") == 1`],
], 'class Lockers:\n    pass\n', `class Lockers:
    def __init__(self, small, medium, large):
        self._free = {"S": small, "M": medium, "L": large}
        self._allocated = {}

    def available(self, size):
        return self._free[size]

    def take(self, user, size):
        if user in self._allocated or self._free[size] == 0:
            return False
        self._free[size] -= 1
        self._allocated[user] = size
        return True

    def release(self, user):
        size = self._allocated.pop(user, None)
        if size is None:
            return False
        self._free[size] += 1
        return True
`, ['一种字典保存每类空位，另一种记录用户持有的类型。', '领取先做全部检查。归还应只看现有登记，根据记录恢复正确类别。'], {
  concepts: ['公开对象接口', '独立实例', '状态一致性'], approach: '以两个实例属性表示空位与发放记录。归还以记录为准，释放和库存更新始终配对。',
  steps: ['构造各实例的两个字典。', '领取前验证用户及容量，再执行两次更新。', '从登记中删除并恢复原类别。'],
  time: '每次查询、领取或归还平均 O(1)。', space: 'O(u)，u 为当前领取用户数。',
  pitfall: '先扣容量会在重复领取时损失空位。类上的共享字典会串改其他场馆。',
  extension: '引入可替换的类别分配策略，但要求归还仍恢复实际分配的类别。',
});

export const transferProblems: Problem[] = [
  { ...activeIds, practice: { tier: '入门迁移', prerequisites: '完成数据结构进阶。', primary: ['集合成员状态'], secondary: ['整数排序'] } },
  { ...ballot, practice: { tier: '综合', prerequisites: '完成推导式与解包。', primary: ['解包与映射推导'], secondary: ['计数与并列'] } },
  { ...registration, practice: { tier: '综合', prerequisites: '完成函数进阶、作用域与递归。', primary: ['工厂与状态隔离'], secondary: ['冲突状态'] } },
  { ...lockers,
    origin: { kind: 'adapted', platform: 'LeetCode', title: 'Design Parking System', id: '1603', level: 'Easy',
      url: 'https://leetcode.com/problems/design-parking-system/', concepts: ['类接口', '分类型容量'],
      adaptation: '保留固定类别与容量接口。改成管理多个储物场馆，加入占用人、归还、公开查询与失败后不变量。' },
    practice: { tier: '综合', prerequisites: '完成面向对象编程。', primary: ['公开类接口', '状态隔离'], secondary: ['字典与失败分支'] } },
];
