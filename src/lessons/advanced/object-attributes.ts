import type { Chapter } from '../../teaching-types';
import { coding, example as ex, question as q, reference } from './authoring.ts';

export const objectAttributes: Chapter = {
  introduction: '每台仪表有自己的读数，但同一型号可共享报警阈值。阈值何时共享、哪种方法应该接收实例或类，决定了配置更新会影响哪一台。',
  prerequisites: '类、实例、函数签名与装饰器。',
  version: 'Python 3.12。本课的查找示例使用普通类属性；下一课介绍 property 的优先处理。',
  goals: ['手推一个实例赋值与一次类赋值对多个实例的影响。', '选择普通方法、类方法和静态方法并解释隐式参数。', '用类方法从备用格式构造实例，并隔离每台设备的可变数据。'],
  topics: [
    {
      title: '普通类属性、实例遮蔽与共享列表',
      explanation: [
        '类体执行时建立类属性。读取普通的 x.rate，若 x 自己有 rate，先取得实例值；否则按 x 所属类及其基类查找。写 x.rate=3 通常是写实例属性，它遮蔽同名的普通类属性。给 Device.rate 赋新值则修改类，尚未遮蔽的实例能读到新配置。',
        'x.tags.append(...) 会先查找到列表，再改变列表内容。如果读到的是类属性里的列表，多个实例能看到同一变化。每个实例要保有独立记录时，在 __init__ 中给 self.tags 创建新列表。',
      ],
      examples: [
        ex('attributes-shadow', '验证类更新与实例遮蔽', '起步', `class Meter:
    threshold = 10

left = Meter()
right = Meter()
left.threshold = 7
Meter.threshold = 12
print(left.threshold, right.threshold)
del left.threshold
print(left.threshold, Meter.threshold)
`, '7 12\n12 12\n', '观察已有实例怎样读取变化的公共配置。',
        ['两个对象最初都从类取得阈值。', 'left 的实例赋值遮蔽该名称。', '删掉实例项后，读取又落回类。'],
        '更新类属性不会清除某个实例自己保存的同名属性。'),
        ex('attributes-shared-list', '用两台设备复现共享历史', '应用', `class Shared:
    history = []

class Separate:
    def __init__(self):
        self.history = []

a, b = Shared(), Shared()
a.history.append(5)
x, y = Separate(), Separate()
x.history.append(8)
print(a.history, b.history)
print(x.history, y.history)
`, '[5] [5]\n[8] []\n', '对比在类体和初始化中创建可变对象。',
        ['Shared 的两个实例最初都读同一个类列表。', 'append 不会创建实例属性。', 'Separate 分别创建两个列表。'],
        '把类型注解加给可变类属性，不会改变它被共享的事实。'),
      ],
    },
    {
      title: '三种方法接收谁',
      explanation: [
        '实例方法接收实际对象 self，用来读写单个设备的状态。@classmethod 接收调用时的类 cls，即使用实例访问也绑定到其类。用 cls(...) 构造对象可以自然适配以后增加的子类，例如例子中的加急票。子类定义与继承查找会在继承课详细解释。',
        '@staticmethod 不自动接收 self 或 cls。它适合与类职责相关、只依赖显式参数的计算，例如核验编码。若工具与任何类都没有清晰归属，可直接定义模块函数。',
      ],
      examples: [
        ex('attributes-three-methods', '编码自检、工厂构造与单台读数', '应用', `class Meter:
    threshold = 10

    def __init__(self, code, value):
        self.code = code
        self.value = value

    @staticmethod
    def valid(code):
        return code.isascii() and code.isalnum()

    @classmethod
    def from_line(cls, text):
        code, value = text.split(":")
        if not cls.valid(code):
            raise ValueError("编码无效")
        return cls(code, int(value))

    def alarm(self):
        return self.value >= self.threshold

meter = Meter.from_line("N2:10")
print(meter.code, meter.alarm())
print(Meter.valid("N-2"))
`, 'N2 True\nFalse\n', '用明确的职责分配方法类型。',
        ['from_line 接收类并在备用格式中解析字段。', 'valid 只需编码，既不依赖类属性也不依赖实例。', 'alarm 用实际实例的值与阈值计算。'],
        '在类方法里硬编码 Meter(...) 会失去通过 cls 构造调用类的能力。'),
        ex('attributes-factory-class', '调用子类工厂获得子类对象', '应用', `class Pass:
    category = "普通"

    def __init__(self, code):
        self.code = code

    @classmethod
    def from_code(cls, raw):
        return cls(raw.upper())

class ExpressPass(Pass):
    category = "加急"

one = Pass.from_code("a")
two = ExpressPass.from_code("b")
print(one.category, one.code)
print(two.category, two.code, type(two).__name__)
`, '普通 A\n加急 B ExpressPass\n', '检查工厂中 cls 随调用入口的变化。',
        ['两类共享 from_code 的实现。', '第二次解析获得的 cls 是 ExpressPass。', '返回实例随后读取所属类的 category。'],
        '把 cls 当成实例读 code 会失败，因为 code 在 __init__ 中才写入每份对象。'),
      ],
    },
  ],
  comparisons: { headings: ['方法', '隐式参数', '典型职责'], rows: [
    ['实例方法', 'self', '读取或改变单个实例'], ['classmethod', 'cls', '依据调用类解析和构造'], ['staticmethod', '无', '和类相关的独立校验或计算'],
  ] },
  applications: ['把共享阈值与单台校准区分开，覆盖后观察其余对象。', '为 CSV 等输入格式提供类工厂，把验证与构造放在清晰入口。'],
  mistakes: [
    { symptom: '历史列表含其他对象的读数', reason: '可变列表是类属性。', fix: '在 __init__ 给每个实例创建列表。', check: '写入一台并读取其余设备。' },
    { symptom: '从子类工厂构造出基类对象', reason: '方法将类名写死。', fix: '用 cls(...) 调用真正的接收类。', check: '比较 type(result) 和调用方使用的类。' },
  ],
  summary: ['普通类属性提供默认值，实例同名项可以遮蔽。', '分别为三种方法识别所需的隐式上下文。', '工厂保留调用的类，可变记录保留在各实例。'],
  next: '下一课让属性写入经过显式验证，维护实例始终有效的条件。',
  exercises: [
    q('attrs-shadow', '跟踪普通类属性被遮蔽后的读取', '代码输出什么？', 2, [
      ['4 4', '类的更新不会覆盖已有实例项。'], ['2 2', '第二份实例读取的是类的新值。'], ['2 4', 'a 自己有 x，b 从类得到新值。'],
    ], 'class C:\n    x = 1\na, b = C(), C()\na.x = 2\nC.x = 4\nprint(a.x, b.x)', '2 4\n'),
    q('attrs-factory', '辨认备用构造最合适的方法', '同一解析格式调用子类时应构造子类，选什么方法？', 0, [
      ['类方法，使用 cls 构造', 'cls 指向实际调用类。'], ['实例方法，取 self', '构造备用入口时还没有实例。'], ['静态方法，写死基类名', '硬编码会丢失调用类。'],
    ]),
    q('attrs-static', '辨认静态方法的实际参数', '调用工具对象 t.valid("A")，若 valid 是静态方法，首个实参是什么？', 1, [
      ['t', '静态方法不会自动绑定实例。'], ['字符串 "A"', '只接收调用中提供的显式参数。'], ['t 的类', '类方法才会绑定到类。'],
    ]),
    q('attrs-mutation', '区分类列表修改与实例绑定', 'a.tags 来自类列表，使用 a.tags.append(1) 会怎样？', 2, [
      ['创建 a 的实例列表', '没有给 a.tags 赋值。'], ['自动复制列表', 'append 改变取得的列表。'], ['共享同一列表的实例都能看到', '初始读取落到同一个类属性。'],
    ]),
    coding('A069', '基础编程', '验证共享费率更新和实例覆盖。'),
    coding('A070', '独立编程', '用类工厂与静态校验从文本创建记录。'),
    coding('A071', '综合应用', '让同一备用构造适用于两种票。'),
    coding('A072', '拓展挑战', '分别输出全局和实例历史统计。'),
  ],
  references: [
    reference('类和实例变量', 'tutorial/classes.html#class-and-instance-variables', '理解共享与遮蔽。'),
    reference('classmethod', 'library/functions.html#classmethod', '核对 cls 的绑定。'),
    reference('staticmethod', 'library/functions.html#staticmethod', '核对静态方法的参数。'),
  ],
};
