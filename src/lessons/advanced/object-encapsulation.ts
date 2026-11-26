import type { Chapter } from '../../teaching-types';
import { coding, example as ex, question as q, reference } from './authoring.ts';

export const objectEncapsulation: Chapter = {
  introduction: '库存数量不得为负，记录列表应该通过指定操作更新。封装让读写集中到可以验证的接口，并提醒调用者哪些字段属于实现细节。',
  prerequisites: '实例属性、方法、异常和列表复制。',
  version: 'Python 3.12。',
  goals: ['区分下划线访问约定与名称改写，正确解释它们能够保护什么。', '用 property 的读取、写入和验证维持状态条件。', '通过释放副本与先校验后更新避免外部修改或失败污染。'],
  topics: [
    {
      title: '公开接口与名称约定',
      explanation: [
        '封装把数据和操作规则组织在一起，调用者依赖公开方法与属性。_amount 表示内部实现的约定，仍可按该名称访问。类中以至少两个下划线开头且结尾没有两个下划线的名字会改写：在 Parent 中 __amount 通常成为 _Parent__amount。这主要防止父类和子类不经意撞名。',
        '名称改写由名字出现的类上下文决定。子类写 __amount 时得到自己的改写名称，父类方法仍操作父类字段。外部知道改写名即可访问，所以不能把它当成访问控制。Python 预定义的 __init__ 等双端下划线属于另一类约定。',
      ],
      examples: [
        ex('encapsulation-mangling', '父子类的同名字段各自保留', '应用', `class Parent:
    def __init__(self):
        self.__count = 3

    def original(self):
        return self.__count

class Child(Parent):
    def __init__(self):
        super().__init__()
        self.__count = 8

    def local(self):
        return self.__count

child = Child()
print(child.original(), child.local())
print(sorted(vars(child)))
`, "3 8\n['_Child__count', '_Parent__count']\n", '用实际属性表观察改写，继承细节将在下一课拆解。',
        ['Parent 初始化时写入基类自己的改写名。', 'Child 的同名写入使用子类前缀。', '各自定义的方法能读取不同值。'],
        '直接在类外读 child.__count 不会自动换成父类定义内部的改写名。'),
        ex('encapsulation-snapshot', '外部修改清单快照不会篡改库存', '起步', `class Shelf:
    def __init__(self):
        self._labels = []

    def add(self, label):
        self._labels.append(label)

    @property
    def labels(self):
        return tuple(self._labels)

shelf = Shelf()
shelf.add("A")
copy = shelf.labels
shelf.add("B")
print(copy, shelf.labels)
`, "('A',) ('A', 'B')\n", '为字符串清单提供只读快照。',
        ['公开写操作统一通过 add。', '读取 labels 创建元组副本。', '此前拿到的快照内容不随增量改变。'],
        'getter 若直接返回内部列表，外部可以绕过 add 修改列表。元组中的可变元素也需要单独考虑。'),
      ],
    },
    {
      title: 'property 把规则放进属性读写',
      explanation: [
        'property 将方法暴露为属性。读取 stock.quantity 会调用 getter；赋值 stock.quantity = 4 调用用 @quantity.setter 注册的 setter。setter 先验证输入，成功后写到另一个内部属性。只定义 getter 的属性不支持普通赋值。',
        'property 作为数据描述符参与属性查找，普通实例同名项无法像遮蔽常量一样覆盖它。把对象始终必须满足的条件称为状态约束。构造也应通过相同合法性规则。失败要在改值前报告，保证之后操作还能继续。',
      ],
      examples: [
        ex('encapsulation-checked-write', '数量属性拒绝负数且保留原值', '起步', `class Stock:
    def __init__(self, quantity):
        self.quantity = quantity

    @property
    def quantity(self):
        return self._quantity

    @quantity.setter
    def quantity(self, value):
        if value < 0:
            raise ValueError("数量不能为负")
        self._quantity = value

stock = Stock(3)
try:
    stock.quantity = -1
except ValueError:
    print("拒绝", stock.quantity)
stock.quantity = 0
print(stock.quantity)
`, '拒绝 3\n0\n', '把统一校验用于初始化与后续写入。',
        ['初始化通过公开属性调用 setter。', '不合法输入在写入前失败。', '零是合法数量并能替换旧值。'],
        'setter 内再次写 self.quantity 会重复触发同一个 setter。'),
        ex('encapsulation-derived', '用只读属性报告可用席位', '应用', `class Room:
    def __init__(self, total):
        self._total = total
        self._used = 0

    @property
    def available(self):
        return self._total - self._used

    def reserve(self, amount):
        if not 0 <= amount <= self.available:
            return False
        self._used += amount
        return True

room = Room(4)
print(room.reserve(3), room.available)
print(room.reserve(2), room.available)
`, 'True 1\nFalse 1\n', '从源状态计算可用量，避免保存两份可能不同步的数。',
        ['total 和 used 是数据来源。', '更新只经过 reserve 的范围验证。', '每次从当前两个状态求差。'],
        '单独保存 available 又忘记在 reserve 后刷新，容易让读到的状态过时。'),
      ],
    },
  ],
  comparisons: { headings: ['写法', '作用', '边界'], rows: [
    ['_name', '内部接口约定', '可访问'], ['__name', '类上下文里的名称改写', '避免常见子类撞名'],
    ['@property / setter', '控制属性读写', '实现验证、计算或只读快照'],
  ] },
  applications: ['库存、名额等对象验证边界后再保存。', '让调用者访问只读快照，并通过公开动作修改记录。'],
  mistakes: [
    { symptom: '设置一个属性却递归报错', reason: 'setter 给同名公开属性再次赋值。', fix: '将验证通过的值写入不同内部字段。', check: '分别用有效值和无效值写入。' },
    { symptom: '父类读取不到子类写入的 __count', reason: '两个值使用不同改写名。', fix: '通过继承的公开方法修改状态。', check: '对比父子方法读取结果。' },
  ],
  summary: ['内部名称表达接口意图，具体校验依靠代码。', 'property 能把统一规则放在赋值路径上。', '验证多个条件后再改状态，并按需返回副本。'],
  next: '下一课用继承复用已有规则，并追踪 super 的查找顺序。',
  exercises: [
    q('encapsulation-private', '说明双下划线实际起的作用', '类中 __size 主要用来避免什么？', 0, [
      ['无意的父子同名冲突', '通常使用定义类名称改写字段名。'], ['外部所有读写', '知道改写名时仍可访问。'], ['对象可变性', '它不会冻结属性。'],
    ]),
    q('encapsulation-assign', '推理 property 的读写路径', 'p.value=9 操作一个有 setter 的 property，通常先做什么？', 1, [
      ['写 p 的同名普通属性', 'property 会截获这次赋值。'], ['把 9 交给 setter', '写入是否成功由 setter 决定。'], ['调用静态方法', 'setter 绑定实例。'],
    ]),
    q('encapsulation-readonly', '识别只读属性的失败类型', '下面赋值后输出什么？', 2, [
      ['0', '属性没有 setter，不能赋值。'], ['7', '报错分支会打印标记。'], ['拒绝', '普通赋值抛出 AttributeError。'],
    ], 'class Box:\n    @property\n    def size(self):\n        return 7\nx = Box()\ntry:\n    x.size = 0\nexcept AttributeError:\n    print("拒绝")', '拒绝\n'),
    q('encapsulation-atomic', '识别转移前应验证的状态', '库存从 A 转到 B 时，什么顺序能避免部分修改？', 1, [
      ['先扣 A 再检查 B', 'B 失败时 A 已经改变。'], ['先检查 A 与 B，成功后一起更新', '失败路径可保留双方原值。'], ['只确保 B 够用', 'A 可能余额不足。'],
    ]),
    coding('A073', '基础编程', '用可验证的属性写入保持数量范围。'),
    coding('A074', '独立编程', '用只读属性发布当前可用值。'),
    coding('A075', '综合应用', '输出能够独立保存的多次状态快照。'),
    coding('A076', '拓展挑战', '跨库转移前完整验证两边边界。'),
  ],
  references: [
    reference('类教程中的私有名称', 'tutorial/classes.html#private-variables', '核对名称改写的用途。'),
    reference('property', 'library/functions.html#property', '核对读取、设置与只读属性。'),
  ],
};
