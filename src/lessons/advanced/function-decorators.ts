import type { Chapter } from '../../teaching-types';
import { coding, example as ex, question as q, reference } from './authoring.ts';

export const functionDecorators: Chapter = {
  introduction: '一组业务函数都要记录调用并保持返回结果。如果每个函数都复制相同的记录代码，细节很容易分叉。把这项工作放进可复用的包装函数，调用方式就能保持一致。',
  prerequisites: '变长参数、函数对象、闭包。',
  version: 'Python 3.12。示例使用普通同步函数。',
  goals: ['将 @ 写法还原为函数接收与重新绑定，区分定义时包装与调用时执行。', '写出能转发实参和返回结果的包装函数，并用 wraps 保留名称等元数据。', '解释参数化和叠加装饰器的执行顺序，验证哪些调用会被审计或拦截。'],
  topics: [
    {
      title: '从手动包装到 @',
      explanation: [
        '装饰器接收函数并返回一个替代对象，常见做法是返回新的可调用包装函数。包装函数通过闭包保留原函数，在调用前后加入统一逻辑。def 上方的 @trace 把定义出的函数交给 trace，再用 trace 的返回值绑定原来的名字，作用相当于在定义后应用 f = trace(f)。',
        '应用装饰器发生在定义时。只有随后调用名字，才执行包装函数的函数体。包装函数使用 *args、**kwargs 接收实参并转发给原函数，通常返回原结果。如果要在异常时也执行后置步骤，可把它放进 finally。',
        'functools.wraps 用原函数的名称、文档等更新包装函数，并设置 __wrapped__ 引用。它能保留帮助和调试信息。原函数怎样接收参数、包装器怎样转发和返回，仍要由代码实现。',
      ],
      examples: [
        ex('decorator-manual', '先手动包装，再调用', '起步', `def record(func):
    print("绑定", func.__name__)
    def call(value):
        print("进入", value)
        return func(value)
    return call

def double(value):
    return value * 2

double = record(double)
print("准备完成")
print(double(4))
`, '绑定 double\n准备完成\n进入 4\n8\n', '区分定义阶段打印和每次调用打印。',
        ['record 接收旧 double 时立即输出绑定。', '返回的 call 被绑定到 double，闭包保留旧对象。', '调用新 double 才触发进入消息并返回 8。'],
        'record 应返回 call 这个函数对象，提前写 call(...) 会在定义时就执行。'),
        ex('decorator-wraps-return', '转发参数、返回值和函数名', '应用', `from functools import wraps

def observe(func):
    @wraps(func)
    def call(*args, **kwargs):
        result = func(*args, **kwargs)
        print("完成", func.__name__)
        return result
    return call

@observe
def cost(quantity, *, fee):
    return quantity * fee

print(cost.__name__)
print(cost(3, fee=2))
`, 'cost\n完成 cost\n6\n', '查看装饰后外部仍能使用的名字和调用参数。',
        ['@observe 在 cost 定义时应用。', 'wraps 把 cost 的名称保留在 call 上。', '包装层将位置与关键字实参转发，并交回原结果。'],
        '只打印 result 会令包装后的调用返回 None。'),
      ],
    },
    {
      title: '参数化、叠加与失败路径',
      explanation: [
        '@badge("内") 会先执行 badge("内")，其返回值必须能接收被装饰函数。通常要分三层：外层接收配置，中层接收函数，内层在每次调用时处理实参。设好标签后，同一个构造器可以生成不同装饰器。',
        '叠加时，装饰器表达式按书写顺序求值，函数对象由最靠近 def 的那层先包装。@outer 写在 @inner 之上，结果相当于 outer(inner(f))。调用从外层进入，逐层返回，异常路径是否执行尾部逻辑取决于包装体的写法。',
        '装饰器顺序具有业务意义。让记录层在校验外面，可以记录所有尝试；记录层在里面，只会看到通过校验的调用。先写出调用规则，再考虑代码摆放。',
      ],
      examples: [
        ex('decorator-stack', '标出参数化包装层的进入与返回', '应用', `from functools import wraps

def tag(label):
    print("准备", label)
    def decorate(func):
        @wraps(func)
        def call(*args, **kwargs):
            print("进入", label)
            result = func(*args, **kwargs)
            print("离开", label)
            return result
        return call
    return decorate

@tag("外")
@tag("内")
def compute():
    print("计算")
    return 7

print(compute())
`, '准备 外\n准备 内\n进入 外\n进入 内\n计算\n离开 内\n离开 外\n7\n', '分别标记表达式求值顺序和调用方向。',
        ['创建两个装饰器时先求外层表达式。', '内层先包原函数，外层再包内层。', '调用从外层进入，返回沿反方向回到外面。'],
        '只看到应用顺序从下到上，容易误以为表达式 tag(...) 的求值也从下到上。'),
        ex('decorator-finally', '失败请求也留下退出记录', '应用', `def audit(fn):
    def call(*args, **kwargs):
        print("开始")
        try:
            return fn(*args, **kwargs)
        finally:
            print("结束")
    return call

@audit
def total(amount):
    if amount < 0:
        raise ValueError("无效金额")
    return amount

try:
    total(-1)
except ValueError:
    print("捕获错误")
`, '开始\n结束\n捕获错误\n', '观察 finally 和异常向调用者传播的先后。',
        ['包装层进入后调用原函数。', '原函数抛出异常，包装层执行 finally。', '异常继续传播，由最外层业务代码决定处理方式。'],
        '在 finally 里 return 会覆盖原来的返回或异常。'),
      ],
    },
  ],
  comparisons: { headings: ['形式', '定义阶段得到什么', '调用阶段做什么'], rows: [
    ['@trace', 'trace 接收函数并返回包装器', '包装器处理每次调用'],
    ['@tag("外")', '先取得装饰器，再接收函数', '包装器保留标签和函数'],
    ['@outer / @inner', '内层先应用', '由外向内进入，返回方向相反'],
  ] },
  applications: ['用包装器记录函数执行次数、清理资源或校验输入。', '评审叠加顺序时，独立测试成功、拦截和抛异常三条路径。'],
  mistakes: [
    { symptom: '函数运行正确但调用者收到 None', reason: '包装层调用了原函数却漏掉 return。', fix: '保留原结果并 return，或使用 return fn(...)。', check: '让包装前后的调用者比较所得值。' },
    { symptom: '审计记录少了拒绝项', reason: '校验包装层先退出，内层审计从未执行。', fix: '按业务需要调换两层顺序。', check: '分别提交一个通过项和一个拒绝项。' },
  ],
  summary: ['装饰器改变函数定义完成后的绑定。包装函数执行发生在随后调用时。', '配置、原函数、调用实参分别存放在不同层。', '转发参数和结果，使用 wraps 保留元数据，明确叠加顺序及失败路径。'],
  next: '进入递归前，试着画本节包装调用的进入与返回，调用栈会保存每层的继续位置。',
  exercises: [
    q('decorator-binding', '还原叠加装饰器', '@a 写在 @b 上方，f 定义后的绑定等同于什么？', 2, [
      ['b(a(f))', '最靠近 def 的 b 先包 f。'], ['a(f), b(f)', '外层包住内层结果。'], ['a(b(f))', '先应用 b，再应用 a。'],
    ]),
    q('decorator-when', '判断定义时包装与调用的输出', '下面输出什么？', 1, [
      ['运行 再 定义', '函数实际没有被调用。'], ['定义', 'deco 在定义阶段执行，f 不执行。'], ['没有输出', '执行 def 时会应用装饰器。'],
    ], 'def deco(f):\n    print("定义")\n    return f\n@deco\ndef f():\n    print("运行")', '定义\n'),
    q('decorator-wraps', '辨认 wraps 实际保留的内容', 'wraps 主要解决什么问题？', 0, [
      ['保留被包装函数名称、文档等元数据', '包装器获得元数据并保存原函数引用。'], ['自动替包装器写 return', '返回仍必须显式实现。'], ['让拦截条件自动通过', 'wraps 与业务条件无关。'],
    ]),
    q('decorator-audit', '选择能记录全部尝试的层顺序', 'guard 拒绝时直接返回。要记录所有尝试，应怎样应用？', 2, [
      ['guard(audit(f))', 'guard 拒绝时不会调用内层 audit。'], ['只在 f 中记录', '被拒绝时 f 不执行。'], ['audit(guard(f))', '最外层先记录，之后的校验可以拒绝。'],
    ]),
    coding('A053', '基础编程', '包装业务函数并返回其原结果。'),
    coding('A054', '独立编程', '用带配置的装饰器构造不同标签。'),
    coding('A055', '综合应用', '利用 finally 追踪成功和失败的调用。'),
    coding('A056', '拓展挑战', '比较两种审计顺序的输出。A094 会直接把业务函数交给你的装饰器。'),
    coding('A094', '综合应用', '包装不同签名的业务，核对参数、返回值、日志与异常。'),
  ],
  references: [
    reference('函数定义和装饰器', 'reference/compound_stmts.html#function-definitions', '核对表达式求值、应用和名称绑定。'),
    reference('functools.wraps', 'library/functools.html#functools.wraps', '核对元数据与 __wrapped__。'),
    reference('finally 子句', 'reference/compound_stmts.html#the-try-statement', '核对返回和异常传播。'),
  ],
};
