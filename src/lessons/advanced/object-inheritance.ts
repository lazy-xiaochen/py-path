import type { Chapter } from '../../teaching-types';
import { coding, example as ex, question as q, reference } from './authoring.ts';

export const objectInheritance: Chapter = {
  introduction: '普通票和加急票都要验证编码、显示票号。加急票要再加费用标签。继承可以复用共同约定，也需要知道子类应该继承、追加还是重写哪些行为。',
  prerequisites: '类属性、类工厂、封装与方法调用。',
  version: 'Python 3.12，方法解析使用 C3 线性化。',
  goals: ['定义子类并决定是否继承构造或用 super 补充初始化。', '解释同名方法重写怎样在实际对象上生效。', '读取 __mro__，预测多层继承和一个协作式菱形中的执行顺序。'],
  topics: [
    {
      title: '继承初始化、重写与复用',
      explanation: [
        'class Child(Parent) 建立子类。Child 未定义的普通方法按查找顺序从基类取得。未写 __init__ 时可沿用基类的初始化；写了新的 __init__ 时，Python 会调用选中的初始化方法，基类初始化是否也执行由代码明确决定。',
        '同名方法重写会在针对子类实例的查找中被选中。扩展规则时可用 super().method(...) 取得继承链上后续实现。调用后可以添加自己的结果，或在共同逻辑前验证子类条件。维护公开方法的参数与返回契约，调用者才可把子类用在预期接收基类的地方。',
      ],
      examples: [
        ex('inherit-init', '先建立票号，再初始化加急专用状态', '起步', `class Pass:
    def __init__(self, code):
        self.code = code

    def label(self):
        return self.code

class Express(Pass):
    def __init__(self, code, surcharge):
        super().__init__(code)
        self.surcharge = surcharge

    def label(self):
        return f"{super().label()}+{self.surcharge}"

print(Pass("A").label(), Express("B", 3).label())
`, 'A B+3\n', '用继承保存通用字段，再叠加子类属性和展示规则。',
        ['Express 的初始化先通过 super 建立 code。', '子类再写 surcharge。', 'label 复用基类返回值，并追加子类含有的数据。'],
        '若遗漏 super().__init__(code)，基类的 label 就读不到 code。'),
        ex('inherit-layered', '逐层增加票据前缀', '应用', `class Base:
    def label(self):
        return "票"

class Timed(Base):
    def label(self):
        return super().label() + "-定时"

class Weekend(Timed):
    def label(self):
        return super().label() + "-周末"

print(Weekend().label())
`, '票-定时-周末\n', '手推多层方法的进入和返回。',
        ['Weekend 找到 Timed 的 label。', 'Timed 的 super 继续找 Base。', '各层从 Base 的字符串开始逐层追加。'],
        '在 Weekend 中直接调用 Base.label 会跳过定时层。'),
      ],
    },
    {
      title: '多重继承的查找顺序',
      explanation: [
        '多重继承允许列出多个直接基类。Python 为每个类计算一条方法解析顺序 MRO，满足本地列出的优先关系，并使共同祖先按一致顺序出现。可用 C.__mro__ 查看它；相互冲突的顺序在定义类时会报 TypeError。',
        'super() 从当前方法所在的类之后、沿实际实例的 MRO 继续查找。即使当前方法定义在 Left，实际实例属于 Joined 时，下一站可能是 Right。协作式多重继承要求参与同一操作的实现使用兼容的调用方式，逐层调用 super，并有清晰的终点。',
      ],
      diagram: { caption: '菱形示例的查找路径', text: 'Joined(Left, Right)\nLeft → Base\nRight → Base\nMRO：Joined → Left → Right → Base → object' },
      examples: [
        ex('inherit-diamond', '把两个附加规则接入一次计算', '应用', `class Base:
    def marks(self):
        return ["base"]

class Left(Base):
    def marks(self):
        return ["left", *super().marks()]

class Right(Base):
    def marks(self):
        return ["right", *super().marks()]

class Joined(Left, Right):
    pass

print([parent.__name__ for parent in Joined.__mro__])
print(Joined().marks())
`, "['Joined', 'Left', 'Right', 'Base', 'object']\n['left', 'right', 'base']\n", '检查共同祖先只出现一次，追踪 Left 的实际下一站。',
        ['Joined 沿 MRO 首先命中 Left 的方法。', 'Left 在 Joined 的 MRO 上继续到 Right。', 'Right 调用 Base，得到末尾标记。'],
        'Left 写 Base.marks(self) 会绕过 Right。'),
        ex('inherit-conflict', '验证互相冲突的优先关系', '应用', `class A:
    pass

class B:
    pass

class First(A, B):
    pass

class Second(B, A):
    pass

try:
    class Impossible(First, Second):
        pass
except TypeError:
    print("顺序冲突")
`, '顺序冲突\n', '识别错误触发在定义阶段。',
        ['First 给 A 优先。', 'Second 给 B 优先。', 'Impossible 无法同时满足两条顺序。'],
        '复杂继承难以解释查找顺序时，可把可独立替换的行为拆成组件。'),
      ],
    },
  ],
  comparisons: { headings: ['做法', '会调用哪一层', '使用场景'], rows: [
    ['继承未重写方法', '按 MRO 找现有实现', '共同契约及默认行为'],
    ['重写后 super()', '从当前定义类之后继续', '扩展共同逻辑或协作调用'],
    ['显式写 Base.method', '直接调用指定实现', '确实需要指定该层，须明确跳过其他层的影响'],
  ] },
  applications: ['给继承的初始化写一个构造后立即读取基类字段的测试。', '多层行为叠加时让测试核对顺序和共同祖先的执行次数。'],
  mistakes: [
    { symptom: '子类实例缺基类字段', reason: '新的 __init__ 没有执行基类初始化。', fix: '根据构造契约调用 super().__init__。', check: '调用一个访问该字段的继承方法。' },
    { symptom: '多重继承少运行了一个实现', reason: '某层写死基类或没有继续协作调用。', fix: '检查实际 MRO，并让参与层遵守同一调用协议。', check: '在各层记标记并核对顺序。' },
  ],
  summary: ['继承保留查找链，重写在哪一层被找到由实际对象决定。', 'super 沿实例所属类的 MRO 继续查找。', '出现多重继承时用小例子核对顺序与接口。'],
  next: '下一课观察相同接口如何由不同对象实现，再判断应继承还是组合。',
  exercises: [
    q('inherit-base-init', '判断新的构造方法是否自动运行父初始化', '子类重写 __init__ 并省略 super 调用，父类的 __init__ 会怎样？', 1, [
      ['一定先运行', '重写改变了选中的方法。'], ['通常不会自动运行', '若需要它，由子类明确调用。'], ['会在第一次读取父属性时运行', '属性查找不触发父类初始化。'],
    ]),
    q('inherit-simple', '推理实际对象选择的实现', '下面输出什么？', 2, [
      ['A', 'B 提供了自己的实现。'], ['AB', '重写不会自动拼接两次调用。'], ['B', 'b 实例优先查到 B.label。'],
    ], 'class A:\n    def label(self):\n        return "A"\nclass B(A):\n    def label(self):\n        return "B"\nprint(B().label())', 'B\n'),
    q('inherit-next', '区分 super 下一站与指定父类', '在 Joined 的 MRO 为 Joined、Left、Right、Base、object 时，Left 方法中的 super 从哪开始查？', 0, [
      ['Right', '从当前定义类 Left 之后开始。'], ['Base', '只按 Left 单独的继承链会漏掉 Right。'], ['Joined', '从头查找可能再次命中 Left。'],
    ]),
    q('inherit-duplicate', '判断共同祖先在 MRO 中的次数', '例子中 Joined 的 MRO 包含几个 Base？', 1, [
      ['0', 'Base 仍是共同祖先。'], ['1', '同一类在线性顺序中只出现一次。'], ['2', '共享祖先不会因两条路径而重复列入。'],
    ]),
    coding('A077', '基础编程', '在基类初始化后添加子类记录。'),
    coding('A078', '独立编程', '通过方法重写附加一条费用规则。'),
    coding('A079', '综合应用', '验证多层初始化和结果计算。'),
    coding('A080', '拓展挑战', '预测两个协作层换序后的输出。子类关系与共享方法会在组合课的 A096 直接检查。'),
  ],
  references: [
    reference('继承', 'tutorial/classes.html#inheritance', '核对查找和重写。'),
    reference('super', 'library/functions.html#super', '核对代理查找起点。'),
    reference('MRO 指南', 'howto/mro.html', '核对共同祖先与顺序约束。'),
  ],
};
