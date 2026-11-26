import { functionTags } from './authoring.ts';
import { task } from './practice.ts';

export const recursiveDesignProblems = [
  task(61, functionTags[6], '入门', '查找最早登记位置',
    { background: '仓库编号按非降序排列，重复编号表示同号的多个登记项。',
      description: '对每个编号，找第一个不小于它的位置。若该位置的编号与查询相等，输出 FOUND；否则给出可插入位置。',
      input: '首行 n q，第二行为 n 个按非降序排列的整数，第三行为 q 个查询整数。两行列表可为空。',
      output: '逐查询输出 FOUND 下标或 INSERT 下标。下标从 0 开始，允许插在 n。',
      limits: '0 ≤ n,q ≤ 1000，整数 -10000–10000。排序输入可能有重复。' },
    ['5 4\n1 3 3 4 9\n3 0 8 10\n', 'FOUND 1\nINSERT 0\nINSERT 4\nINSERT 5\n', '遇到重复的 3，返回第一次出现。'],
    [['0 2\n\n0 -2\n', 'INSERT 0\nINSERT 0\n'],
      ['4 3\n-3 -3 -3 0\n-3 -2 0\n', 'FOUND 0\nINSERT 3\nFOUND 3\n'],
      ['1 3\n7\n6 7 8\n', 'INSERT 0\nFOUND 0\nINSERT 1\n'], ['1 0\n5\n\n', '']],
    ['递归参数用半开区间。', '相等时继续查左侧，得到左边界后再判断是否命中。'], `def first_at_least(values, target, left, right):
    if left == right:
        return left
    mid = (left + right) // 2
    if values[mid] < target:
        return first_at_least(values, target, mid + 1, right)
    return first_at_least(values, target, left, mid)

n, q = map(int, input().split())
values = list(map(int, input().split()))
for target in map(int, input().split()):
    index = first_at_least(values, target, 0, n)
    found = index < n and values[index] == target
    print("FOUND" if found else "INSERT", index)
`, { concepts: ['递归二分', '重复值左边界', '半开区间'], approach: '先求下界，命中与插入共用同一个位置。',
      steps: ['从 [0,n) 开始。', '用中点比较排除至少一个候选，直至两端相遇。', '核对候选可索引并且等于目标。'],
      time: 'O(n+q log(n+2))，含读入。', space: 'O(n+q) 输入及最多 O(log(n+2)) 栈帧。',
      pitfall: '相等立即返回可能得到后面一个重复项。', extension: '再写第一个大于目标的位置，报告重复编号出现次数。' },
    { kind: 'adapted', platform: 'LeetCode', title: 'Binary Search', id: '704', level: 'Easy',
      url: 'https://leetcode.com/problems/binary-search/', concepts: ['区间二分', '目标定位'],
      adaptation: '保留有序查找的对半收缩思想，加入重复编号左边界、空表、批量查询和未命中插入位置。' }),

  task(62, functionTags[6], '入门', '多次查询同一增长序列',
    { background: '看板反复询问按前两项之和增长的序列，查询顺序可能来回跳转。',
      description: '定义 F(0)=0，F(1)=1，其余项为前两项之和。按查询顺序返回精确结果。',
      input: '一行空格分隔的索引，可为空。',
      output: '每个索引一行十进制整数，重复查询重复输出。',
      limits: '最多 100 个查询，0 ≤ n ≤ 120。' },
    ['8 2 8 0\n', '21\n1\n21\n0\n', '两次查询 8 应得到同样结果，中间查询不会改变结果。'],
    [['\n', ''], ['1 0 1 2\n', '1\n0\n1\n1\n'],
      ['60 75 60 100\n', '1548008755920\n2111485077978050\n1548008755920\n354224848179261915075\n']],
    ['保留两个不同的终止值。', '整个程序共用同一个带缓存的函数。'], `from functools import cache

@cache
def value(n):
    if n < 2:
        return n
    return value(n - 1) + value(n - 2)

for index in map(int, input().split()):
    print(value(index))
`, { concepts: ['记忆化', '重复查询', '递归状态'], approach: '跨查询复用按索引缓存的值，最大索引支配首次填表成本。',
      steps: ['为 0 和 1 设置返回。', '递归求前两项，缓存以索引为键。', '按原查询顺序输出。'],
      time: 'O(m+q) 次查找或加法，m 为最大索引。大整数加法与输出的位数代价另计。',
      space: 'O(m) 条缓存及栈帧和 O(q) 输入，大整数占用另计。',
      pitfall: '在查询循环内每次重新定义缓存函数，会失去跨次复用。',
      extension: '写一个先建表的迭代版本，比较首次大索引的栈使用。' },
    { kind: 'adapted', platform: 'LeetCode', title: 'Fibonacci Number', id: '509', level: 'Easy',
      url: 'https://leetcode.com/problems/fibonacci-number/', concepts: ['斐波那契', '重复子问题'],
      adaptation: '保留递推式，扩展为任意顺序和重复查询，加入较大索引以验证重复计算不会阻塞处理。' }),

  task(63, functionTags[6], '基础', '跳过停用库区',
    { background: '库区可以临时停用。体量盘点只汇总仍可使用的文件。',
      description: '节点是文件字节数，或目录数组 [启用标记, 子节点列表]。遇到停用目录，整棵子树贡献 0。否则累计当前可用文件字节数和份数。',
      input: '一行 JSON，表示根节点。整数表示文件，目录启用标记为 0 或 1。',
      output: '输出两个整数「总字节数 文件数」。',
      limits: '1–300 个节点，深度至多 30，文件字节数 0–10000。启用的空目录没有文件，0 字节文件算一份。' },
    ['[1,[3,[0,[10,20]],[1,[0,2]],[1,[]]]]\n', '5 3\n', '停用目录的 10、20 跳过，零字节文件仍计数。'],
    [['0\n', '0 1\n'], ['[0,[9,[1,[0]]]]\n', '0 0\n'],
      ['[1,[[0,[9]],[1,[]]]]\n', '0 0\n'], ['[1,[2,[1,[5,[1,[3]]]]]]\n', '10 3\n']],
    ['把节点分为文件、停用目录和启用目录。', '每个递归调用返回形状相同的两个数字。'], `import json

def totals(node):
    if isinstance(node, int):
        return node, 1
    enabled, children = node
    size = count = 0
    if enabled:
        for child in children:
            child_size, child_count = totals(child)
            size += child_size
            count += child_count
    return size, count

print(*totals(json.loads(input())))
`, { concepts: ['树遍历', '剪枝', '元组归约'], approach: '根据节点类型选终止返回或合并子树，停用时无需进入后代。',
      steps: ['解析 JSON 并判节点类型。', '文件直接贡献字节与一份。', '启用目录递归合并，停用目录保持零汇总。'],
      time: '解析 O(s)，递归 O(v)，s 为输入长度，v 为实际访问节点数。',
      space: 'O(s) 解析数据，递归 O(h) 帧。', pitfall: '用 if not node 处理文件会漏算零字节文件。',
      extension: '同时输出被剪掉的目录编号和它的上一层编号，核对遍历轨迹。' }),

  task(64, functionTags[6], '进阶', '分层目录配额报告',
    { background: '档案馆每天对嵌套目录生成容量报告。管理员要先看父目录，再按原录入次序看达到阈值的子目录。',
      description: '读取目录树，统计根目录下全部文件字节数和份数。对每个累计字节数不低于门槛的目录，报告路径、字节数和文件数。行序为先序，即目录在其子目录之前，兄弟按输入顺序。',
      input: '第一行非负门槛。第二行一棵 JSON 目录树。每个节点是 [名称, 内容]，文件的内容是非负整数，目录的内容是子节点列表，根保证为目录。',
      output: '首行 TOTAL 字节数 文件数。每个达标目录另占一行「路径 字节数 文件数」。根路径是根名，其余用斜杠连接祖先与自身名称。文件不另列。',
      limits: '最多 160 个节点，深度至多 24。名称为 1–8 位英数字，同一目录内唯一。门槛和文件大小为 0–100000。' },
    ['5\n["root",[["A",[["x",2],["y",3]]],["B",[["z",0]]],["notes",4]]]\n',
      'TOTAL 9 4\nroot 9 4\nroot/A 5 2\n', 'A 刚达到阈值，B 的零字节文件只参与总份数。'],
    [
      ['0\n["R",[]]\n', 'TOTAL 0 0\nR 0 0\n'],
      ['1\n["R",[["z",0],["A",[]]]]\n', 'TOTAL 0 1\n'],
      ['2\n["X",[["A",[["B",[["x",2]]]]],["B",[["x",3]]]]]\n', 'TOTAL 5 2\nX 5 2\nX/A 2 1\nX/A/B 2 1\nX/B 3 1\n'],
      ['9\n["X",[["a",8]]]\n', 'TOTAL 8 1\n'],
      ['0\n["R",[["A",[["x",0]]],["B",[]]]]\n', 'TOTAL 0 1\nR 0 1\nR/A 0 1\nR/B 0 0\n'],
    ],
    ['知道总量需要等所有子调用返回，知道行序可以在进入时确定。', '进入目录先占一个位置，离开时回填。'],
    `import json

def scan(node, parent, *, report):
    name, data = node
    if isinstance(data, int):
        return data, 1

    path = f"{parent}/{name}" if parent else name
    index = len(report)
    report.append(None)
    total = count = 0
    for child in data:
        size, files = scan(child, path, report=report)
        total += size
        count += files
    report[index] = path, total, count
    return total, count

limit = int(input())
root = json.loads(input())
rows = []
print("TOTAL", *scan(root, "", report=rows))
for path, size, count in rows:
    if size >= limit:
        print(path, size, count)
`, { concepts: ['递归接口', '先序与后序', '元组返回', '阈值过滤'],
      approach: '递归同时保留两个时点。进入时确定排序位置，返回前取得汇总。所有行都填好后再按门槛发布。',
      steps: ['文件直接返回大小和一份计数。', '目录构造路径并为自己预留一行。', '依次汇总子树，回填目录行。', '输出根汇总并按先序筛选目录行。'],
      time: 'O(s+n+L)，s 为 JSON 长度，n 为节点数，L 为构造及输出所有目录路径的总字符数。',
      space: 'O(s+n+L)，另用 O(h) 帧，h 为树高。',
      pitfall: '只在递归返回途中追加报表，会把子目录排在父目录前。',
      extension: '增加模式参数，允许调用者选择先序或后序，并设计一棵能区分两种顺序的测试树。' }),
];
