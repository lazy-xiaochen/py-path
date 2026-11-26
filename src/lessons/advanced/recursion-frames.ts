import type { Chapter } from '../../teaching-types';
import { coding, example as ex, question as q, reference } from './authoring.ts';

export const recursionFrames: Chapter = {
  introduction: '有时一个问题可以先解决规模更小的同类问题，再补上当前这一项。递归把这个关系写成函数调用。画出每一层正在等待什么，就能检查入口、终止和逐层返回。',
  prerequisites: '函数参数、返回值、局部变量、整除与取余。',
  version: 'Python 3.12。教学示例使用有限深度；Python 不会把这种递归自动改成循环。',
  goals: ['为递归写出有意义的终止条件和严格缩小的子问题。', '画出至少三层调用帧，逐步算出返回顺序。', '用索引递归处理数列，用整除与取余缩小数位问题，并判断何时改用循环。'],
  topics: [
    {
      title: '调用帧、终止条件与返回路径',
      explanation: [
        '调用帧保存一次执行所需的参数、局部名、执行位置和其他信息。函数调用另一个函数时，当前调用暂停，等待子调用产生值。新调用拥有独立的局部绑定，即使它调用的是同一个函数。',
        '写递归先约定参数范围与返回值，再找无需继续拆分的最小情况，称为终止条件。其他情况缩小问题，保证多次缩小后一定触及终止条件。最后明确怎样用子调用结果恢复原问题的答案。',
        '当 return n * factorial(n - 1) 执行时，本层先保存 n 并等待乘法另一项。最深一层返回后，上一层继续乘法，再把结果交回更上一层。栈按后进入先返回的顺序工作。',
      ],
      diagram: { caption: '计算 3! 的下降与返回', text: '下降：factorial(3) 等 3×? → factorial(2) 等 2×? → factorial(1) 等 1×? → factorial(0)\n返回：1 → 1×1 = 1 → 2×1 = 2 → 3×2 = 6' },
      examples: [
        ex('recursion-factorial', '打印阶乘的进入和返回', '起步', `def factorial(n):
    print("进", n)
    if n == 0:
        print("出", n, 1)
        return 1
    result = n * factorial(n - 1)
    print("出", n, result)
    return result

print("结果", factorial(3))
`, '进 3\n进 2\n进 1\n进 0\n出 0 1\n出 1 1\n出 2 2\n出 3 6\n结果 6\n', '同时追踪下降时的调用和回升时的乘法。',
        ['每层 n 减一，最终到 n=0。', '最内层直接返回乘法单位元 1。', '等待中的三层依次恢复，各自使用本层保存的 n。'],
        '0! 必须返回 1。若未限制负数输入，n-1 会远离终止条件。'),
        ex('recursion-prefix', '按位置求一张列表的合计', '应用', `def total_from(values, index):
    if index == len(values):
        return 0
    return values[index] + total_from(values, index + 1)

print(total_from([2, -1, 4], 0))
print(total_from([], 0))
`, '5\n0\n', '保留同一个列表，通过索引表达更短的未处理区间。',
        ['每层恰好负责一个下标。', '走到列表末尾时返回加法单位元 0。', '各层加回自己负责的元素。'],
        '每层传 values[1:] 会额外复制列表。保留原表和边界可以避免反复拷贝。'),
      ],
    },
    {
      title: '数位递归和循环表达',
      explanation: [
        '非负整数 n // 10 会去掉末位，n % 10 取末位。把末位的工作和剩余数位分开，n 就会缩小。若允许负数，先取绝对值。0 视为一位还是没有剩余位，由题意决定；例如取数位和时空余贡献 0，计数和校验可能要单独处理 0 的表示。',
        '同一递减过程常能改写成循环。循环通常只维护当前 n 和累加量，递归还要为未结束的调用保留帧。即使有正确终止条件，调用过深也可能触发 RecursionError，具体上限由解释器与当前栈深决定。对长线性过程优先评估循环。',
      ],
      examples: [
        ex('recursion-digit-sum', '沿十进制末位缩小问题', '起步', `def digit_sum(n):
    if n < 10:
        return n
    return n % 10 + digit_sum(n // 10)

print(digit_sum(205))
print(digit_sum(0))
`, '7\n0\n', '验证中间零位仍然参与拆分。',
        ['205 贡献末位 5，递归到 20。', '20 贡献 0，递归到 2。', '2 直接返回，再一路加回，得到 7。'],
        '使用 // 进行整数整除，确保下一层仍收到整数。'),
        ex('recursion-to-loop', '把待累加的局部值移到显式变量', '应用', `def recursive(n):
    if n == 0:
        return 0
    return n + recursive(n - 1)

def iterative(n):
    total = 0
    while n > 0:
        total += n
        n -= 1
    return total

print(recursive(5), iterative(5))
print(iterative(2000))
`, '15 15\n2001000\n', '比较相同线性工作量的两种状态表达。',
        ['递归向下保存每个待加值。', '循环直接把待加值给 total。', '输入很长时，迭代版本不会为每项分配一次调用帧。'],
        '提高递归上限会改变进程设置，对简单线性累加先使用循环。'),
      ],
    },
  ],
  comparisons: { headings: ['问题', '子问题怎样缩小', '终止时返回'], rows: [
    ['阶乘', 'n 每次减一', '0! 返回 1'], ['列表求和', '索引向末尾移动', '空后缀返回 0'],
    ['数位和', '整除 10 去末位', '单个数位本身'],
  ] },
  applications: ['在递归调用前后打印入栈、返回值和参数，找出错误发生的那一层。', '处理长线性数据前对比递归栈与循环累加量。'],
  mistakes: [
    { symptom: '正数输入依然递归到超限', reason: '递归参数未缩小，或跨过了唯一允许的终止值。', fix: '写清参数域、每步的缩小量和可达的终止条件。', check: '从最小输入及其邻居各手推一次。' },
    { symptom: '最内层算对了，外层却返回 None', reason: '调用了子函数却没有返回合成结果。', fix: '明确子结果在本层怎样参与计算，并 return。', check: '从栈底向上写出每一层返回值。' },
  ],
  summary: ['每个调用有自己的参数与继续位置。', '先确定子问题和终止值，再写返回合成式。', '长线性递归的时间与循环可能同阶，栈空间另计。'],
  next: '下一课把递归用于对半查找、不规则目录和重复子问题。',
  exercises: [
    q('recursion-frame', '区分进入顺序与返回顺序', 'f(3) 依次调用 f(2)、f(1)、f(0)，哪层最先返回？', 0, [
      ['f(0)', '终止条件所在的最内层先返回。'], ['f(3)', '外层等待子调用完成后才能恢复。'], ['由参数大小的比较函数决定', '一条调用链沿调用栈回退。'],
    ]),
    q('recursion-base', '选择乘积的终止返回值', '若 product(n) 返回 1 到 n 的乘积，product(0) 应为多少？', 1, [
      ['0', '乘数 0 会让所有较大输入最终得到 0。'], ['1', '空乘积的值为 1。'], ['None', 'None 无法参与这里的整数乘法。'],
    ]),
    q('recursion-trace', '手推子调用返回值', '代码输出什么？', 2, [
      ['4', '第一次调用会等待后续实际结果。'], ['12', '每层参数减少 2，只有 4 和 2 作贡献。'], ['6', 'f(0) 返回 0，f(2) 返回 2，f(4) 返回 6。'],
    ], 'def f(n):\n    if n <= 0:\n        return 0\n    return n + f(n - 2)\nprint(f(4))', '6\n'),
    q('recursion-deep', '为长的线性处理选择实现', '已知要逐项处理 50000 条记录，只保存一个总量。优先用什么？', 2, [
      ['每条数据建一帧', '可能超过解释器深度限制。'], ['每层递归复制后缀', '会引入额外复制与栈。'], ['循环维护总量', '可以逐项更新且不累积调用帧。'],
    ]),
    { ...coding('A057', '基础编程', '用阶乘计算不同展品的排列数。'), warmup: true },
    coding('A095', '基础编程', '算出分枝高度并记录下降与返回。自动评测核对返回值和完整回调顺序，等价实现也可通过。请用注释解释递归的终止条件和子问题。'),
    coding('A058', '独立编程', '用整除和取余做交替权重的数位校验。'),
    coding('A059', '综合应用', '递归扫描连续可处理记录并保留剩余额度。'),
    coding('A060', '拓展挑战', '构造进入和返回的完整层级轨迹。'),
  ],
  references: [
    reference('调用帧', 'reference/executionmodel.html#structure-of-a-program', '核对代码块与本次执行的帧。'),
    reference('return 语句', 'reference/simple_stmts.html#the-return-statement', '核对从当前函数调用返回值的规则。'),
    reference('递归上限', 'library/sys.html#sys.getrecursionlimit', '核对解释器限制与栈空间。'),
  ],
};
