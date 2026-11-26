import type { Chapter } from '../../teaching-types';
import { coding, example as ex, question as q, reference } from './authoring.ts';

export const objectComposition: Chapter = {
  introduction: '库存服务有时把提醒写进日志，有时只累计数量。如果服务调用统一操作，业务流程就能与提醒渠道独立变化。',
  prerequisites: '实例方法、函数接口、继承与重写。',
  version: 'Python 3.12。',
  goals: ['让不同类实现同一可调用接口并解释动态选择。', '通过构造参数注入可替换组件，验证两种实现都遵守约定。', '用对象关系和变化方向选择继承或组合。'],
  topics: [
    {
      title: '多态关注可执行的操作',
      explanation: [
        '多态让多个类型用同一接口完成各自的实现。代码调用 item.cost(units) 时，Python 在运行中依据实际接收的对象查找 cost。重写可以提供多态，不同类只要提供兼容方法也能参加。',
        '按对象实际提供的行为使用它，通常称为鸭子类型。共同约定包括参数、返回值、异常和副作用。方法名字相同不保证可以替换；例如同一个 send 应说明返回成功标记，或失败时抛出约定异常。',
      ],
      examples: [
        ex('composition-polymorphic-cost', '两种计费策略共用账单计算', '起步', `class UnitRate:
    def cost(self, units):
        return 2 * units

class FlatRate:
    def cost(self, units):
        return 5 if units else 0

def bill(rule, units):
    return rule.cost(units)

print(bill(UnitRate(), 3), bill(FlatRate(), 3))
print(bill(FlatRate(), 0))
`, '6 5\n0\n', '无需共同父类也能按相同契约使用两份规则。',
        ['两种规则都接收一项数量。', 'bill 不判断实际类型，交给传入对象。', '空订单按各自规则返回零。'],
        '把传入规则类型写成一串 isinstance 分支，会让每次新增实现都要改公共流程。'),
        ex('composition-notification-contract', '真实渠道与测试替身遵守同一约定', '应用', `class Console:
    def send(self, text):
        print(text)
        return True

class Blocked:
    def send(self, text):
        return False

def announce(channel, text):
    if not channel.send(text):
        print("未送达")

announce(Console(), "到货")
announce(Blocked(), "到货")
`, '到货\n未送达\n', '查看相同签名的两种结果及调用者处理失败的方式。',
        ['Console 发送并返回 True。', 'Blocked 只返回 False。', '公用流程依据返回契约报告失败。'],
        '若成功渠道忘返回 True，调用者会将 None 当成失败。'),
      ],
    },
    {
      title: '组合让各对象持有各自职责',
      explanation: [
        '组合表示对象拥有或使用其他对象。例如订单服务拥有一个计价策略，换策略无需复制订单服务。通过构造参数提供组件称为依赖注入。服务只记录自己需要的接口，组件独立管理它的数据和行为。',
        '判断关系时先问子类型是否可在父类型预期的位置使用。如果新增一种票仍符合票接口，继承可能合适；若服务只是使用一种通知方式，应持有通知组件。围绕会独立变化的部分留出可替换边界，保障业务代码和外部依赖可分别测试。',
      ],
      examples: [
        ex('composition-service', '保持库存逻辑并替换通知组件', '应用', `class Recorder:
    def __init__(self):
        self.messages = []

    def send(self, message):
        self.messages.append(message)

class Warehouse:
    def __init__(self, notifier):
        self._notifier = notifier
        self._total = 0

    def receive(self, amount):
        self._total += amount
        self._notifier.send(f"库存 {self._total}")

events = Recorder()
warehouse = Warehouse(events)
warehouse.receive(3)
warehouse.receive(2)
print(events.messages)
`, "['库存 3', '库存 5']\n", '把状态更新与消息记录分给两个对象。',
        ['Warehouse 保留自己的库存和组件引用。', 'receive 合法更新之后调用 send。', '通过测试替身查看通知内容及顺序。'],
        '将通知列表定义成类属性会造成不同 Recorder 之间的测试串扰。'),
        ex('composition-classify', '用同一服务对象切换格式器', '应用', `class Compact:
    def render(self, code):
        return code.lower()

class Label:
    def render(self, code):
        return "ID-" + code.upper()

class Exporter:
    def __init__(self, formatter):
        self.formatter = formatter

    def row(self, code):
        return self.formatter.render(code)

export = Exporter(Compact())
print(export.row("Ab"))
export.formatter = Label()
print(export.row("Ab"))
`, 'ab\nID-AB\n', '组件可在运行中替换，验证共享入口不变。',
        ['row 依赖 render 契约。', '第一次结果来自 Compact。', '替换后同一入口使用 Label。'],
        '若格式器另需前缀配置，可将它存在格式器内，保持 render 参数约定一致。'),
      ],
    },
  ],
  comparisons: { headings: ['关系', '表达方式', '判断问题'], rows: [
    ['是一种', '继承与匹配的公开接口', '成员可否替代父类型完成同样的契约？'],
    ['拥有或使用', '持有组件并委托', '行为是否和主体独立变化？'],
  ] },
  applications: ['用小型记录器替换通知系统，提高测试的可观察性。', '将报表格式、计价或配额规则作为可替换组件。'],
  mistakes: [
    { symptom: '换了组件就需要改所有调用方', reason: '调用依赖具体实现字段。', fix: '明确最小方法契约，由组件保持内部状态。', check: '用一个轻量替身走同样的业务流程。' },
    { symptom: '子类有多个父类操作都不能用', reason: '原本是两个对象使用关系，却建立了父子关系。', fix: '将需要的能力做成可委托组件。', check: '列出父类型使用者依赖的行为。' },
  ],
  summary: ['运行时根据接收对象选择方法。', '多态需要兼容契约，组合将变化放入可替换组件。', '测试应验证组件替换后，主体的其他状态和职责仍正确。'],
  next: '下一课让自定义对象支持比较、遍历和数据类表达。',
  exercises: [
    q('composition-duck', '判断鸭子类型最关心的条件', '组件没有共同父类，什么时候仍可传给同一调用方？', 0, [
      ['都提供兼容的方法和行为', '调用方只依赖约定。'], ['只要方法名一样', '参数、返回和异常也属于契约。'], ['只要字段数一样', '字段结构无法保证提供所需操作。'],
    ]),
    q('composition-holds', '选择使用通知器的服务关系', '一份库存服务需要多种通知渠道，优先怎么组织？', 2, [
      ['每个渠道定义一个新的库存子类', '渠道和库存会独立变化，不必复制库存类型。'], ['把渠道状态写进库存类属性', '不同服务可能意外共用状态。'], ['服务持有渠道并调用统一方法', '渠道可以替换且独立测试。'],
    ]),
    q('composition-which', '预测运行时选择的方法', '下面输出什么？', 1, [
      ['1 1', '第二次传入的对象提供自己的实现。'], ['1 2', '同一流程分别调用两个对象的方法。'], ['发生 TypeError', '两对象都满足无额外参数的 get 接口。'],
    ], 'class A:\n    def get(self):\n        return 1\nclass B:\n    def get(self):\n        return 2\ndef read(item):\n    return item.get()\nprint(read(A()), read(B()))', '1 2\n'),
    q('composition-expectation', '区分状态控制和组件实现', '测试把短信组件换成只记录文本的替身，适合验证什么？', 0, [
      ['业务调用过几次与参数内容', '替身可保留记录，业务仍用原接口。'], ['真实短信已经送达', '替身没有向真实渠道发送。'], ['所有组件字段均相同', '测试只要求契约一致。'],
    ]),
    coding('A081', '基础编程', '将计算委托给不同计费策略。'),
    coding('A082', '独立编程', '使用记录组件验证通知次数和内容。'),
    coding('A083', '综合应用', '为同一报表注入不同排序与格式策略。'),
    coding('A084', '拓展挑战', '运行中切换可用渠道并维护各自状态。'),
    coding('A096', '综合应用', '用评测传入的策略检验组合，同时验证子类复用父类方法。'),
  ],
  references: [
    reference('类与重写', 'tutorial/classes.html#inheritance', '核对实例方法查找。'),
    reference('鸭子类型', 'glossary.html#term-duck-typing', '核对基于接口的对象使用方式。'),
  ],
};
