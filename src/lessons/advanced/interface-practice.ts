import type { Problem, TestCase } from '../../content';
import type { SolutionGuide } from '../../teaching-types';
import { functionTags, objectTags } from './authoring.ts';

type Scenario = [note: string, body: string];

export function interfaceTask(id: string, tag: string, title: string, difficulty: Problem['difficulty'],
  prompt: Pick<Problem, 'background' | 'description' | 'input' | 'output' | 'limits'>,
  imports: string, scenarios: [Scenario, ...Scenario[]], starter: string, solution: string,
  hints: Problem['hints'], guide: SolutionGuide): Problem {
  const [sample, ...cases] = scenarios.map(([note, body]): TestCase => ['', '', {
    note, calls: [{ args: [], expected: true }],
    fixtures: [{ name: 'interface_check.py', content: imports + '\n\ndef check():\n    try:\n' +
      body.split('\n').map(line => '        ' + line).join('\n') +
      '\n    except AssertionError:\n        return False\n    return True\n' }],
  }]);
  return {
    id, tag, title, difficulty, ...prompt, sample: ['', '', scenarios[0][0], sample[2]], cases,
    hints, guide, solution, origin: { kind: 'original' },
    contract: { kind: 'function', files: ['main.py'], target: { module: 'interface_check', name: 'check' } },
    starterFiles: [{ name: 'main.py', content: starter }],
  };
}

export const interfaceProblems = [
  interfaceTask('A093', functionTags[3], '两个计数器的交错调用', '基础', {
    background: '两个记录器独立累计读数，同一个记录器交给两个调用方时应看到同一份累计值。',
    description: '实现工厂 make_counter(start)，返回内部函数 step(delta)。每次调用先把 delta 加到本计数器，再返回累计值。评测会交错调用多个计数器，并通过变量别名再次调用同一个计数器。',
    input: '评测导入 main.py，调用 make_counter(start)，再调用返回的函数。', output: 'step 返回 int。整个模块不读写标准输入输出。',
    limits: 'start、delta 均为 −10⁶ 至 10⁶ 的整数。返回值必须是具有闭包变量的 Python 函数，可用计数器的 __closure__ 查看。0 是合法增量。',
  }, 'from inspect import isfunction\nfrom main import make_counter', [
    ['起点为 10 和 −4。先读初值，交错增减，并通过别名修改第一个。',
      `first = make_counter(10)
second = make_counter(-4)
alias = first
assert isfunction(first) and first.__closure__
assert isfunction(second) and second.__closure__
assert first(0) == 10 and second(0) == -4
assert first(3) == 13 and second(-2) == -6
assert alias(-6) == 7 and second(0) == -6 and first(0) == 7`],
    ['从同一个初值新建两次，两个闭包分别累积。第三次创建也使用原初值。',
      `a, b = make_counter(0), make_counter(0)
assert a(-1) == -1 and b(2) == 2 and a(0) == -1
c = make_counter(0)
assert c is not a and c(0) == 0 and b(0) == 2`],
    ['覆盖正负边界和多次归零。', `a = make_counter(-1_000_000)
alias = a
assert a(1_000_000) == 0
assert alias(1_000_000) == 1_000_000
assert a(-1_000_000) == 0`],
    ['在第一个计数器使用后再创建第二个，工厂不得重置旧实例。',
      `a = make_counter(5)
assert a(-5) == 0
b = make_counter(5)
assert b(0) == 5 and a(0) == 0
assert a(1) == 1 and b(0) == 5`],
  ], 'def make_counter(start):\n    # 返回可重复调用的函数\n    pass\n', `def make_counter(start):
    total = start

    def step(delta):
        nonlocal total
        total += delta
        return total

    return step
`, ['把 total 定义在工厂的一次调用里。', 'step 用 nonlocal 更新外层的 total。工厂返回 step 本身。'], {
    concepts: ['闭包', 'nonlocal', '别名', '状态隔离'], approach: '每次工厂调用创建自己的绑定。两个变量引用同一个 step 时，它们操作同一个绑定。',
    steps: ['把起点绑定到 total。', '创建内层函数并声明 nonlocal total。', '每次调用先改绑定再返回，创建工厂时只返回函数。'],
    time: '在题目整数范围内，构造和单次更新均 O(1)。', space: '每个计数器 O(1)。',
    pitfall: '把 total 放在模块顶层会让独立构造相互影响。返回 step() 会执行函数，应该返回 step。',
    extension: '同一工厂再返回一个 reset，让两个内部函数共同维护该工厂的状态。',
  }),
  interfaceTask('A094', functionTags[4], '可替换业务的审计装饰器', '进阶', {
    background: '不同业务共用一条审计规则。审计函数由调用方传给装饰器，测试也会传入不同签名的业务函数。',
    description: '实现 audit(record, allowed)，返回装饰器。包装后的函数先 record("start")，再调用 allowed，并原样传入所有参数。若返回假值，记录 "denied" 并返回 None，跳过业务。若放行，调用业务一次，成功则记录 "ok" 并返回业务的原返回值。若业务抛出 Exception，记录 "error" 后重抛同一异常对象。',
    input: '导入 main.audit，评测调用 audit(record, allowed)(func) 或等价的 @ 语法。', output: '通过 record 回调记录。调用发生在包装后的函数被执行时，导入和装饰时不能读写标准输入输出，也不能调用 record、allowed 或业务。',
    limits: 'record 接收一个字符串并正常返回。allowed 接受与业务相同的参数并返回 bool，不抛异常。业务可能返回任意对象或抛出 Exception 子类。',
  }, 'from main import audit', [
    ['验证参数原样转发、返回对象身份、日志和业务调用顺序。',
      `events = []
token = object()
def allowed(value, *, factor):
    events.append(("allowed", value, factor))
    return True
def transform(value, *, factor):
    events.append(("business", value, factor))
    return token
wrapped = audit(events.append, allowed)(transform)
assert events == []
assert wrapped(7, factor=3) is token
assert events == ["start", ("allowed", 7, 3), ("business", 7, 3), "ok"]`],
    ['拒绝路径复用同一个装饰器装饰不同业务，每次只记录开始、检查和拒绝。',
      `events = []
def allowed(*args, **kwargs):
    events.append((args, kwargs))
    return False
def first(*args, **kwargs):
    raise AssertionError("denied call ran")
def second(*args, **kwargs):
    raise AssertionError("another denied call ran")
decorate = audit(events.append, allowed)
assert decorate(first)(-3, name="A") is None
assert decorate(second)(name="B") is None
assert events == ["start", ((-3,), {"name": "A"}), "denied", "start", ((), {"name": "B"}), "denied"]`],
    ['异常路径传播原对象。随后还能正常调用另一业务，保留合法的假值返回。',
      `events = []
error = ValueError("broken")
def failing(*, name):
    events.append(name)
    raise error
decorate = audit(events.append, lambda **kwargs: True)
try:
    decorate(failing)(name="work")
except ValueError as caught:
    assert caught is error
else:
    raise AssertionError("lost exception")
second_error = LookupError("another error")
def failing_again(**kwargs):
    raise second_error
try:
    decorate(failing_again)(name="next")
except LookupError as caught:
    assert caught is second_error
else:
    raise AssertionError("lost lookup error")
assert decorate(lambda **kwargs: 0)(name="other") == 0
assert events == ["start", "work", "error", "start", "error", "start", "ok"]`],
    ['空签名的业务在每次调用时重新检查，业务合法返回 None。',
      `events = []
def allowed():
    events.append("allowed")
    return events.count("allowed") == 1
@audit(events.append, allowed)
def work():
    events.append("work")
assert work() is None and work() is None
assert events == ["start", "allowed", "work", "ok", "start", "allowed", "denied"]`],
  ], 'def audit(record, allowed):\n    # 返回接收业务函数的装饰器\n    pass\n', `from functools import wraps

def audit(record, allowed):
    def decorate(func):
        @wraps(func)
        def wrapped(*args, **kwargs):
            record("start")
            if not allowed(*args, **kwargs):
                record("denied")
                return None
            try:
                result = func(*args, **kwargs)
            except Exception:
                record("error")
                raise
            record("ok")
            return result
        return wrapped
    return decorate
`, ['先画出检查、拒绝、成功和异常的顺序。区分工厂、装饰器、包装函数三个调用时机。', '对检查与业务分别展开 *args、**kwargs。只把业务调用放进 try，用裸 raise 保留原异常。'], {
    concepts: ['装饰器工厂', '参数转发', '异常传播', '可观察顺序'],
    approach: '前两层捕获回调和业务。所有日志出现在最内层，每条路径有自己对应的结束标记。',
    steps: ['定义并返回接收 func 的 decorate。', '执行时记录 start 并检查，拒绝立即返回。', '成功保留返回对象，异常记录后原样抛出。'],
    time: '除回调与业务自身成本外，转发 k 个实参需要 O(k)。', space: '转发参数 O(k)。', pitfall: '异常路径 return 会吞掉异常。if result 会把正常的 0 当成失败。',
    extension: '另加一个接受异常类型清单的包装器，写出两个装饰器交换顺序时的日志差异。',
  }),
  interfaceTask('A095', functionTags[5], '测量分枝路径并记录下降与返回', '基础', {
    background: '每级支架的深度取决于最深的一条分支。校核员还需要知道每个子问题何时进入、何时得到结果。',
    description: '实现 measure(tree, emit)。空节点 None 和空列表的高度为 0。非空列表的高度是 1 加所有孩子高度的最大值。请在函数上方写两行注释，说明哪些节点会直接结束，以及访问孩子如何缩小问题。',
    input: 'tree 由 None 或列表构成，列表的孩子也是这种节点。导入 main.measure 后直接调用。emit 是接受一个元组的回调。',
    output: '返回整数高度。从左到右访问。进入时 emit(("enter", path))，返回前 emit(("exit", path, height))。根路径 ()，孩子路径是在父路径尾部加上从 0 起的下标。空节点也记录进入和返回。',
    limits: '最多 100 个节点，深度不超过 25。自动评测对比回调轨迹与返回值。能生成相同轨迹的栈实现也可能通过。递归实现与终止条件解释由学员自查。',
  }, 'from main import measure', [
    ['左右分支、空列表和 None。右树的返回值决定根的高度。',
      `events = []
assert measure([None, [[]]], events.append) == 2
assert events == [
    ("enter", ()), ("enter", (0,)), ("exit", (0,), 0),
    ("enter", (1,)), ("enter", (1, 0)), ("exit", (1, 0), 0),
    ("exit", (1,), 1), ("exit", (), 2),
]`],
    ['两种空根分别进入一次并返回 0。', `for tree in (None, []):
    events = []
    assert measure(tree, events.append) == 0
    assert events == [("enter", ()), ("exit", (), 0)]`],
    ['8 层单分支，所有进入发生在返回之前。',
      `tree = None
for _ in range(8):
    tree = [tree]
events = []
assert measure(tree, events.append) == 8
assert events == [("enter", (0,) * i) for i in range(9)] + [
    ("exit", (0,) * i, 8 - i) for i in range(8, -1, -1)
]`],
    ['三个同级孩子，最大值在左边，不能返回最后一支的高度或把高度相加。',
      `events = []
assert measure([[None], [None], []], events.append) == 2
assert events == [
    ("enter", ()), ("enter", (0,)), ("enter", (0, 0)), ("exit", (0, 0), 0), ("exit", (0,), 1),
    ("enter", (1,)), ("enter", (1, 0)), ("exit", (1, 0), 0), ("exit", (1,), 1),
    ("enter", (2,)), ("exit", (2,), 0), ("exit", (), 2),
]`],
  ], 'def measure(tree, emit):\n    pass\n', `def measure(tree, emit):
    def visit(node, path):
        emit(("enter", path))
        height = 0
        if node is not None and node:
            tallest = 0
            for index, child in enumerate(node):
                child_height = visit(child, path + (index,))
                tallest = max(tallest, child_height)
            height = 1 + tallest
        emit(("exit", path, height))
        return height

    return visit(tree, ())
`, ['先写 None 和 [] 的返回值，画出 [None] 为什么刚好比它高 1。', '每个孩子只访问一次。访问后更新本层最大值，退出事件使用本层最后的高度。'], {
    concepts: ['终止条件', '子问题', '进入与返回', '树高'], approach: '归纳每个节点的高度。父节点等所有孩子返回后才知道自己的结果。',
    steps: ['建立负责节点和路径的辅助函数。', '进入后处理空节点或逐个调用孩子。', '记录退出值并将同一个值返回给父节点。'],
    time: 'n 个节点、最大深度 h，路径元组复制使时间上界为 O(n(h+1))。', space: '递归活跃路径合计 O((h+1)²)，另计调用方保留的日志。',
    pitfall: '空列表与 None 都有一对事件。若先退出再递归，会破坏返回顺序。',
    extension: '把返回值改成高度与叶子数的二元组，写出每种空节点在新规则下的含义。',
  }),
  interfaceTask('A096', objectTags[4], '共享扣减流程与可替换策略', '进阶', {
    background: '普通配额和计量配额共用扣减流程。某些场地可以动态更换准入策略。',
    description: '实现 Quota(balance, policy) 和它的子类 MeteredQuota。两类都用同一 Quota.spend 方法。Quota.cost(units) 返回 units，MeteredQuota.cost(units) 返回 units 的两倍。用 replace_policy(policy) 替换当前实例的策略。spend(units) 在正整数输入且余额够时，让策略检查 policy(cost, balance)，放行才扣减并返回 True。其它情况返回 False，余额维持原值。',
    input: '评测会从 main.py 导入两类，直接构造不同对象、替换策略并调用 spend，读取公开的 balance。', output: 'cost 返回 int，spend 返回 bool。replace_policy 不需返回结果。导入和方法调用不读写标准输入输出。',
    limits: '初始 balance 为 0–1000。units 为 −1000 至 1000 的整数。无效或余额不足时不调用策略。MeteredQuota 必须继承 Quota.spend 而不重写。',
  }, 'from main import Quota, MeteredQuota', [
    ['验证子类关系、共享方法、倍数价格，以及失败后的余额和策略替换。',
      `assert issubclass(MeteredQuota, Quota) and MeteredQuota.spend is Quota.spend
events = []
def deny(cost, balance):
    events.append((cost, balance))
    return False
a = MeteredQuota(10, deny)
b = Quota(7, lambda cost, balance: True)
assert a.spend(3) is False and a.balance == 10 and events == [(6, 10)]
a.replace_policy(lambda cost, balance: cost == 6)
assert a.spend(3) is True and a.balance == 4
assert b.spend(3) is True and b.balance == 4
assert a.spend(3) is False and a.balance == 4`],
    ['无效请求或余额不足时不执行策略，恰好扣完合法。',
      `def unexpected(*args):
    raise AssertionError("policy called before validation")
a = Quota(4, unexpected)
assert a.spend(0) is False and a.spend(-3) is False and a.spend(5) is False
assert a.balance == 4
a.replace_policy(lambda cost, balance: cost == balance)
assert a.spend(4) is True and a.balance == 0
assert a.spend(1) is False and a.balance == 0`],
    ['两个计量对象独立更换策略，并由父类计算扣减。',
      `a = MeteredQuota(8, lambda cost, balance: True)
b = MeteredQuota(8, lambda cost, balance: True)
assert a.cost(3) == 6
a.replace_policy(lambda cost, balance: False)
assert a.spend(2) is False and a.balance == 8
assert b.spend(2) is True and b.balance == 4`],
    ['评测再定义一个子类，父类扣减应能调用注入的新计价。',
      `class FlatQuota(Quota):
    def cost(self, units):
        return 1
a = FlatQuota(1, lambda cost, balance: cost == 1)
assert a.spend(1000) is True and a.balance == 0
assert a.spend(1) is False`],
  ], 'class Quota:\n    pass\n\nclass MeteredQuota(Quota):\n    pass\n', `class Quota:
    def __init__(self, balance, policy):
        self.balance = balance
        self.replace_policy(policy)

    def replace_policy(self, policy):
        self._policy = policy

    def cost(self, units):
        return units

    def spend(self, units):
        if units <= 0:
            return False
        price = self.cost(units)
        if price > self.balance or not self._policy(price, self.balance):
            return False
        self.balance -= price
        return True

class MeteredQuota(Quota):
    def cost(self, units):
        return 2 * units
`, ['列出所有拒绝情形，扣减只能出现在它们之后。', '在父类调用 self.cost，Python 会按实际实例找方法。把策略存在实例字段。'], {
    concepts: ['子类', '方法重写', '组合', '失败原子性'], approach: '父类控制验证和扣减顺序，子类只改变计价，互相独立的实例各自引用策略。',
    steps: ['在实例保存余额和策略。', '实现父类扣减入口，使用 self.cost。', '在子类重写单项计价并进行交错测试。'],
    time: '单次扣减 O(1)，另计策略函数自身的成本。', space: '每个实例 O(1)。',
    pitfall: '先扣再检查会改变拒绝时的余额。策略若保存在类上，替换就可能影响其他实例。',
    extension: '加一个按最低保留额拒绝的策略，比较两类实例在相同余额时的差异。',
  }),
  interfaceTask('A097', objectTags[5], '工单的显示协议与独立标签', '基础', {
    background: '工单界面需要简短的名称，排查错误则需要显示构造参数。每个工单能独立维护标签。',
    description: '实现 Ticket(code, title)，公开 code、title、tags 和 add_tag(tag)。str(ticket) 为「编号 | 标题」。repr(ticket) 为「Ticket(code=编号的 repr, title=标题的 repr)」。标签只影响本实例，按插入顺序保留，允许重复。',
    input: '评测导入 main.Ticket，构造多个对象。会直接调用 str、repr 和 add_tag，并查看公开的 tags。',
    output: 'str 与 repr 返回字符串，add_tag 更新 tags。导入和调用均不打印。',
    limits: 'code、title 和 tag 是长度 1–40 的字符串，可能含空格、引号或反斜杠。初始化时每张工单的 tags 是独立的空列表。可用普通类或数据类。',
  }, 'from main import Ticket', [
    ['显示含空格和引号的标题，确认调试格式使用 Python 的 repr。',
      `a = Ticket("X01", "Lee's map")
assert (a.code, a.title) == ("X01", "Lee's map")
assert str(a) == "X01 | Lee's map"
assert repr(a) == f"Ticket(code={a.code!r}, title={a.title!r})"`],
    ['同值对象的标签互不影响，保留顺序及重复。',
      `a = Ticket("A", "same")
b = Ticket("A", "same")
assert a.tags == b.tags == [] and a.tags is not b.tags
a.add_tag("x")
a.add_tag("x")
b.add_tag("y")
assert a.tags == ["x", "x"] and b.tags == ["y"]
assert Ticket("A", "same").tags == []
assert str(a) == "A | same" and repr(b) == "Ticket(code='A', title='same')"`],
    ['字符串转义由 repr 处理，测试双引号和反斜杠。',
      `code, title = 'A"B', 'a\\\\b'
a = Ticket(code, title)
assert str(a) == f"{code} | {title}"
assert repr(a) == f"Ticket(code={code!r}, title={title!r})"`],
    ['标签包含空格与反斜杠，追加应保留原值。',
      `a, b = Ticket("1", "draft"), Ticket("2", "draft")
a.add_tag("first item")
b.add_tag(chr(92))
assert a.tags == ["first item"] and b.tags == [chr(92)]
assert str(a) == "1 | draft"`],
  ], 'class Ticket:\n    pass\n', `from dataclasses import dataclass, field

@dataclass
class Ticket:
    code: str
    title: str
    tags: list[str] = field(default_factory=list, init=False, repr=False)

    def add_tag(self, tag):
        self.tags.append(tag)

    def __str__(self):
        return f"{self.code} | {self.title}"
`, ['先对照 str 和 repr 的约定，用带引号的标题检查格式。', '数据类字段用 field(default_factory=list, init=False, repr=False) 可控制创建、构造参数和调试显示。'], {
    concepts: ['__str__', '__repr__', '默认工厂', '实例列表'],
    approach: '数据类按字段自动构造并生成 repr。展示字符串单独实现，标签只用于实例状态。',
    steps: ['定义 code 和 title 字段。', '给 tags 一个可重复调用的默认工厂，并从初始化参数、repr 中省略它。', '实现追加和 __str__。用不同实例验证引用。'],
    time: '文本表示 O(输入字符串长度)，追加均摊 O(1)。', space: '每个实例的保存空间与标签数和字符串长度成正比。',
    pitfall: '把 tags 写成类属性会让实例共享。手写 repr 时直接拼接字段会漏掉引号与转义。',
    extension: '增加移除最后一个标签的方法，并保证空列表时返回明确结果。',
  }),
];
