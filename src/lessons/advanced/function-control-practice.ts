import { functionTags } from './authoring.ts';
import { task } from './practice.ts';

export const functionControlProblems = [
  task(53, functionTags[4], '入门', '带记录的乘价函数',
    { background: '复核台希望保留费用计算的函数名和调用记录。',
      description: '给 price 函数加一层包装。每次调用先输出 CALL price，再由外层输出数量乘单价。',
      input: '首行 q。随后 q 行，每行给数量和单价。',
      output: '每单两行，先 CALL price，后整数结果。',
      limits: '0 ≤ q ≤ 100，数量和单价在 0–1000。q 为 0 时无输出。' },
    ['2\n3 5\n0 7\n', 'CALL price\n15\nCALL price\n0\n', '零数量仍是一次调用。'],
    [['0\n', ''], ['1\n1000 1000\n', 'CALL price\n1000000\n'],
      ['2\n1 0\n1 0\n', 'CALL price\n0\nCALL price\n0\n']],
    ['包装器读取原函数名，并转发所有实参。', '让包装器返回原函数结果，打印金额交给入口。'], `from functools import wraps

def trace(func):
    @wraps(func)
    def wrapped(*args, **kwargs):
        print("CALL", func.__name__)
        return func(*args, **kwargs)
    return wrapped

@trace
def price(count, *, rate):
    return count * rate

for _ in range(int(input())):
    count, rate = map(int, input().split())
    print(price(count, rate=rate))
`, { concepts: ['装饰器', '转发', 'wraps'], approach: '包装器横跨调用记录，函数本身维持金额计算的单独职责。',
      steps: ['把原函数交给 trace。', '每次打印原名并转发位置和关键字。', '把返回金额传回调用者。'],
      time: 'O(q)。', space: 'O(1)。', pitfall: '包装器漏写 return 时会输出 None。',
      extension: '把 trace 用在两个形参列表不同的计算函数上。' }),

  task(54, functionTags[4], '入门', '按柜台格式生成货签',
    { background: '同一规则可分别给甲乙两柜生成货签，柜台的固定前缀不同。',
      description: 'A 或 B 柜使用各自前缀，基础格式为「货号-件数」。最终返回「前缀:货号-件数」。',
      input: '首行两个前缀，次行 q，后 q 行为 A 或 B、货号和件数。',
      output: '逐条输出完整货签。',
      limits: '0 ≤ q ≤ 300，前缀与货号为 1–10 位英数字，件数为 0–1000。两个前缀可相同。' },
    ['E W\n3\nA K 2\nB K 2\nA Y 0\n', 'E:K-2\nW:K-2\nE:Y-0\n', '同一货号在两柜用不同包装配置。'],
    [['X X\n0\n', ''], ['X X\n1\nB J 0\n', 'X:J-0\n'],
      ['N S\n2\nB Z 3\nA Z 3\n', 'S:Z-3\nN:Z-3\n']],
    ['外层接收前缀，中层接收基础函数，内层接收货签参数。', '用参数化装饰器分别包同一个函数。'], `def with_prefix(prefix):
    def decorate(func):
        def wrapped(*args, **kwargs):
            return prefix + ":" + func(*args, **kwargs)
        return wrapped
    return decorate

def basic(code, *, count):
    return f"{code}-{count}"

left, right = input().split()
labels = {"A": with_prefix(left)(basic), "B": with_prefix(right)(basic)}
for _ in range(int(input())):
    desk, code, count = input().split()
    print(labels[desk](code, count=int(count)))
`, { concepts: ['参数化装饰器', '闭包配置', '复用原函数'], approach: '用两份配置得到两层独立包装，最后统一按键调用。',
      steps: ['读取两个前缀。', '为基础格式函数构造两份带前缀的包装。', '转发货号和关键字件数。'],
      time: 'O(q)。', space: 'O(1)。', pitfall: '不同前缀不能写入同一个共享变量后再由两个包装读取。',
      extension: '同时支持后缀和分隔符，使包装函数的配置可组合。' }),

  task(55, functionTags[4], '基础', '失败也要记录退出',
    { background: '批量分组会遇到分母为零。每次都必须写入开始、退出两个标记。',
      description: '每次请求打印 BEGIN，执行整数整除，退出时打印 END。若人数为零，随后输出 INVALID，否则输出分组结果。',
      input: '首行 q。随后 q 行为总人数与每组人数。',
      output: '每次三行：BEGIN、END、INVALID 或整除得到的整数。',
      limits: '0 ≤ q ≤ 100，两种人数均为 0–1000。错误只能发生在每组人数为 0。' },
    ['2\n9 2\n6 0\n', 'BEGIN\nEND\n4\nBEGIN\nEND\nINVALID\n', '整除舍去余数；失败也执行退出。'],
    [['0\n', ''], ['1\n0 4\n', 'BEGIN\nEND\n0\n'],
      ['2\n0 0\n4 4\n', 'BEGIN\nEND\nINVALID\nBEGIN\nEND\n1\n']],
    ['包装器用 try 返回原计算，finally 负责 END。', '由接收者捕获 ZeroDivisionError。'], `def record(func):
    def wrapped(*args, **kwargs):
        print("BEGIN")
        try:
            return func(*args, **kwargs)
        finally:
            print("END")
    return wrapped

@record
def groups(total, *, size):
    return total // size

for _ in range(int(input())):
    total, size = map(int, input().split())
    try:
        print(groups(total, size=size))
    except ZeroDivisionError:
        print("INVALID")
`, { concepts: ['finally', '异常传播', '包装协议'], approach: '退出记录独立于调用成功，原计算结果或异常都继续交给入口。',
      steps: ['包装层先记录进入。', 'finally 维护离开事件。', '主循环捕获零分母错误并开始处理下一条。'],
      time: 'O(q)。', space: 'O(1)。', pitfall: '将 END 只写在计算之后会漏掉异常。',
      extension: '同时显示成功和失败次数，使用共享但显式控制的审计状态。' }),

  task(56, functionTags[4], '进阶', '两种审计范围',
    { background: '计价入口可记录所有请求，也可只记录通过容量校验的请求。',
      description: '数量大于容量时输出 BLOCK；否则输出数量乘单价。模式 ALL 下每条都先打印 TRY 数量。模式 VALID 下只有通过校验的请求才打印 TRY 数量。',
      input: '第一行「模式 capacity q」，再有 q 行「数量 单价」。',
      output: '每次输出结果，按模式决定是否先输出 TRY 行。',
      limits: '模式为 ALL 或 VALID，0 ≤ q ≤ 200，其余整数为 0–1000。等于容量时通过。' },
    ['ALL 3 3\n4 2\n3 0\n1 5\n', 'TRY 4\nBLOCK\nTRY 3\n0\nTRY 1\n5\n', '拦截项仍记日志，合法的零金额会输出 0。'],
    [['VALID 3 2\n4 2\n3 2\n', 'BLOCK\nTRY 3\n6\n'], ['ALL 5 0\n', ''],
      ['VALID 0 3\n1 7\n0 7\n0 0\n', 'BLOCK\nTRY 0\n0\nTRY 0\n0\n']],
    ['分别定义审计与限制两层包装。', 'ALL 将审计放在最外面，VALID 让校验在前。'], `def audit(func):
    def wrapped(amount, *args, **kwargs):
        print("TRY", amount)
        return func(amount, *args, **kwargs)
    return wrapped

def guard(capacity):
    def decorate(func):
        def wrapped(amount, *args, **kwargs):
            if amount > capacity:
                return "BLOCK"
            return func(amount, *args, **kwargs)
        return wrapped
    return decorate

def price(amount, *, rate):
    return amount * rate

mode, capacity, count = input().split()
limit = guard(int(capacity))
process = audit(limit(price)) if mode == "ALL" else limit(audit(price))
for _ in range(int(count)):
    amount, rate = map(int, input().split())
    print(process(amount, rate=rate))
`, { concepts: ['叠加顺序', '提前返回', '关键字转发'], approach: '清楚区分两层谁先接到调用，依据审计范围选择组合。',
      steps: ['生成携带容量的校验装饰器。', '按模式组合记录与校验层。', '以数量与费率调用，打印返回结果。'],
      time: 'O(q)。', space: 'O(1)。', pitfall: '两种模式只改变审计范围，容量判断规则相同。',
      extension: '加入失败异常路径，比较记录进入与记录退出的顺序。' }),

  task(57, functionTags[5], '入门', '不同展品的排列数',
    { background: '一组各不相同的展品需要计算所有可能的摆放次序。',
      description: '对每个给定的 n，输出 n 件互不相同物品的排列数。空展台有一种摆法。',
      input: '一行若干空格分隔的 n，可为空。',
      output: '每个 n 输出一行十进制排列数。',
      limits: '最多 50 次查询，0 ≤ n ≤ 30。使用精确整数。' },
    ['0 4 1\n', '1\n24\n1\n', '空展台和单展品都只有一份摆法。'],
    [['\n', ''], ['2 3\n', '2\n6\n'], ['20 5 20\n', '2432902008176640000\n120\n2432902008176640000\n']],
    ['先决定第一件摆什么。', '固定第一件后，剩余问题只含 n-1 件。'], `def arrangements(n):
    if n == 0:
        return 1
    return n * arrangements(n - 1)

for n in map(int, input().split()):
    print(arrangements(n))
`, { concepts: ['阶乘', '子问题缩小', '空乘积'], approach: '第一件有 n 种选择，每种选择都对应剩余 n-1 项的排列。',
      steps: ['把空序列的摆法设为 1。', '递归求剩余项目的摆法。', '乘以本层的选择数，返回给上一层。'],
      time: '每次 O(n) 次整数乘法。', space: 'O(n) 栈帧。',
      pitfall: '把 0 的结果设成 0 会让所有乘积归零。', extension: '将递归改成循环并对照多次重复查询。' }),

  task(58, functionTags[5], '入门', '交替权重的数位校验',
    { background: '货号整数需要根据数位生成一位校验码。',
      description: '取整数绝对值，从最低位开始交替使用权重 1、3。求加权和，再输出使其凑到 10 的倍数所需的最小非负补数。',
      input: '一行空格分隔的整数，可为空。',
      output: '每个整数输出一行 0–9 的校验码。',
      limits: '最多 80 项，绝对值小于 10^15，整数 0 的校验码也为 0。' },
    ['205 -120 99\n', '3\n3\n4\n', '205 从低到高的加权和为 5+0+2=7。'],
    [['\n', ''], ['0 1 -1\n', '0\n9\n9\n'], ['7 13 10 1001\n', '3\n4\n7\n6\n']],
    ['每次取末位，子问题去掉末位。', '权重在 1、3 两种状态间互换。'], `def weight_sum(n, weight=1):
    if n < 10:
        return n * weight
    return n % 10 * weight + weight_sum(n // 10, 4 - weight)

for number in map(int, input().split()):
    print(-weight_sum(abs(number)) % 10)
`, { concepts: ['数位递归', '传递权重', '取余'], approach: '让递归状态包含下一位使用的权重。处理完一位就缩掉一个十进制数位。',
      steps: ['先对每项取绝对值。', '将当前位与剩余位贡献相加。', '用模运算求 0–9 中应补的数。'],
      time: 'O(d)，d 为总数位数。', space: 'O(m) 栈帧，m 为单项最大位数。',
      pitfall: '10 - total % 10 在整十时会返回 10。', extension: '让权重按长度为三的周期切换。' }),

  task(59, functionTags[5], '基础', '额度内的连续领用',
    { background: '处理队列时不允许跳过前面的领用单。第一笔超出剩余额度就停止。',
      description: '从第一项起按次序扣减。若下一项大于余额，立即停止，输出实际处理单数和最终余额。',
      input: '第一行非负初始额度，第二行是领用整数序列，可为空。',
      output: '输出两个整数「处理单数 最终余额」。',
      limits: '最多 150 项，额度和每项领用均为 0–1000。当前余额为零时仍可处理零额记录。' },
    ['5\n2 3 0 2 0\n', '3 0\n', '处理前 3 项；第四项阻塞，不能继续跳过。'],
    [['7\n\n', '0 7\n'], ['3\n4 0 1\n', '0 3\n'], ['0\n0 0 1\n', '2 0\n']],
    ['用位置与当前余额表示子问题。', '终止可以来自读完，也可以来自当前项超额。'], `def finish(costs, index, remaining):
    if index == len(costs) or costs[index] > remaining:
        return index, remaining
    return finish(costs, index + 1, remaining - costs[index])

quota = int(input())
costs = list(map(int, input().split()))
print(*finish(costs, 0, quota))
`, { concepts: ['递归状态', '双终止条件', '边界短路'], approach: '索引等于已经处理的单数，余额随子调用传递。',
      steps: ['检查表尾或第一笔无法处理的单。', '合法则扣减，并移动一个位置。', '外层交回最深层得到的结果。'],
      time: '读入 O(n)，递归最多 O(n) 次。', space: 'O(n) 数据与栈。',
      pitfall: '余额为零不等于无法再处理，后面可能有零额单。', extension: '将递归改成循环，验证大批输入与活动状态。' }),

  task(60, functionTags[5], '进阶', '降层补给轨迹',
    { background: '补给员从 n 层出发，每次下移固定步长，折返时合计经过的正层号。',
      description: '每次调用先输出 IN 及当前层。层号 ≤ 0 时直接返回 0。其他层递归到层号减步长后，与子结果相加。每层返回前输出 OUT 层号 本层结果。',
      input: '一行两个整数 n step。',
      output: '按实际调用顺序写出全部 IN 和 OUT 记录，最后输出 TOTAL 和最外层结果。',
      limits: '0 ≤ n ≤ 100，1 ≤ step ≤ 100。若越过 0，仍记录第一次到达的非正层号。' },
    ['5 3\n', 'IN 5\nIN 2\nIN -1\nOUT -1 0\nOUT 2 2\nOUT 5 7\nTOTAL 7\n', '下探到 -1 后从最内层依次输出。'],
    [['0 1\n', 'IN 0\nOUT 0 0\nTOTAL 0\n'],
      ['3 3\n', 'IN 3\nIN 0\nOUT 0 0\nOUT 3 3\nTOTAL 3\n'],
      ['2 1\n', 'IN 2\nIN 1\nIN 0\nOUT 0 0\nOUT 1 1\nOUT 2 3\nTOTAL 3\n']],
    ['进入时记录当前层，先判断是否继续拆分。', '恢复执行时输出当前层的结果。'], `def visit(level, step):
    print("IN", level)
    if level <= 0:
        value = 0
    else:
        value = level + visit(level - step, step)
    print("OUT", level, value)
    return value

n, step = map(int, input().split())
print("TOTAL", visit(n, step))
`, { concepts: ['调用轨迹', '终止阈值', '回退合成'], approach: '把观察点放在递归前后，从输出中看出每个栈帧等待的值。',
      steps: ['每进入一层先记录。', '终止层返回 0，其他层等待子结果。', '在该层真正返回前写出合成值。'],
      time: 'O(1+ceil(n/step))。', space: 'O(1+ceil(n/step)) 栈帧。',
      pitfall: '只允许层号等于 0 才停，步长跨过 0 时会错过终止点。',
      extension: '用显式栈复现一样的进入与离开轨迹。' }),
];
