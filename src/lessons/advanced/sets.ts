import type { Chapter } from '../../teaching-types';
import { coding, example as ex, question as q, reference } from './authoring.ts';

export const sets: Chapter = {
  introduction: '活动结束后，两份签到表包含重复记录。工作人员需要知道哪些人两场都来、哪些人只来一场、谁还缺一场。集合把这些问题变成对成员关系的直接计算。',
  goals: ['正确创建空集合和非空集合，判断哪些对象能成为成员。', '将业务语句翻译为交、并、差、对称差或集合关系。', '用集合判重，另用列表或排序明确最终的输出顺序。'],
  prerequisites: '列表遍历和字典键的可哈希要求。',
  version: 'Python 3.12。题目指定的输出顺序一律显式实现。',
  topics: [
    {
      title: '唯一成员和维护方式',
      explanation: [
        '集合表示有哪些不同成员，重复加入相等的值只保留一份。集合不提供位置索引，也不保证遍历顺序。用 set() 建空集合，{} 是空字典。用 {"甲", "乙"} 写非空集合，也可把列表或字符串交给 set，从其元素构建集合。',
        'set 本身可以增删；成员要可哈希，普通列表或 set 不能直接成为另一个集合的成员。需要把一组成员整体作键时，可考虑不可变的 frozenset。它忽略内部顺序，若要保留顺序则使用由可哈希成员组成的元组。',
        'add(x) 加一个成员，update(xs) 逐项添加。remove(x) 要求该元素存在，否则抛 KeyError；discard(x) 在元素缺失时什么也不做。pop() 移除并返回任意一个元素，空集合抛 KeyError。pop 适用于可任取一项的场景。',
      ],
      examples: [
        ex('set-updates', '维护当班权限名单', '起步', `active = set()
active.add("A")
active.update(["B", "A", "C"])
active.remove("B")
active.discard("B")
print(sorted(active))
single = {"X"}
print(single.pop(), len(single))
`, "['A', 'C']\nX 0\n", '处理重复授权、明确撤销与允许重复撤销。',
        ['add 写一项，update 批量写。', '重复的 A 合并成一个成员。', 'remove 删除 B，第二次撤销可用 discard；单元素集合只有一个可能的 pop 结果。'], 'set.pop() 不按先入先出，不能用它模拟排队。'),
        ex('ordered-dedup', '保留第一次刷卡顺序', '应用', `cards = ["C", "A", "C", "B", "A"]
seen = set()
first = []
for card in cards:
    if card not in seen:
        seen.add(card)
        first.append(card)
print(first)
print(sorted(seen))
`, "['C', 'A', 'B']\n['A', 'B', 'C']\n", '让一份数据同时支持成员判断与两种报表顺序。',
        ['从左向右读刷卡记录。', '第一次遇到成员时同时记入 seen 和 first。', '后续重复项跳过，first 保留首现顺序；sorted 给出字典序。'], 'list(set(cards)) 不能表达首现顺序。'),
      ],
    },
    {
      title: '集合运算和集合之间的关系',
      explanation: [
        'A | B 是并集，至少属于其中一组；A & B 是交集，同时属于两组；A - B 是差集，在 A 但不在 B，交换顺序一般会改变结果；A ^ B 是对称差集，仅属于其中一组。运算符要求两边都是集合类型，A.intersection(list_data) 这类方法可以接收其他可迭代对象。',
        'A <= B 检验 A 是否为 B 的子集，相等时成立。A < B 要求还存在 B 有而 A 没有的成员，因此是真子集。A >= B 和 A > B 从超集方向判断。issubset、issuperset 是命名方法，isdisjoint 判断是否没有任何共同成员。',
        '把「全部满足」转为 required <= actual，把「没有冲突」转为 isdisjoint。空集合是任意集合的子集。业务要求至少完成一个项目时，需要再检查实际人数或清单是否为空。',
      ],
      examples: [
        ex('set-operations', '对比两场培训签到', '起步', `first = {"C", "A", "B"}
second = {"B", "D"}
print(sorted(first | second))
print(sorted(first & second))
print(sorted(first - second))
print(sorted(second - first))
print(sorted(first ^ second))
`, "['A', 'B', 'C', 'D']\n['B']\n['A', 'C']\n['D']\n['A', 'C', 'D']\n", '把五个名单问题分别写成集合运算。',
        ['并集收录所有来过的人，交集找出 B。', '差集方向决定要保留第一场或第二场独有的记录。', '对称差合并两边独有的人，排除交集。'], '用 | 查「只来一场」会错误地保留 B。'),
        ex('set-relations', '核对上岗培训和限制', '应用', `required = {"消防", "用电"}
received = {"用电", "消防", "急救"}
blocked = {"未复核"}
print(required <= received, required < received)
print(received.issuperset(required), received.isdisjoint(blocked))
print(received < received, set() <= received)
`, 'True True\nTrue True\nFalse True\n', '检查全部必修、额外证书和冲突标记。',
        ['required 每一项均在 received。', '急救为 received 多出的成员，真子集条件也满足。', '没有受限标记，且没有集合是自己的真子集。'], '仅比较长度会错把成员不相同但数量相同的名单视为满足条件。'),
      ],
    },
  ],
  comparisons: { headings: ['结构', '保留什么', '合适的问题'], rows: [
    ['列表', '顺序和重复', '第几次出现，原始记录是什么'], ['集合', '不同成员', '谁出现过，哪些成员重合'],
    ['字典', '键及其对应值', '某个编号对应谁，出现过几次'],
  ] },
  applications: ['审核文件权限时用集合记录允许项，用差集输出缺失权限。', '把重复访问日志变成唯一访客名单，同时保留首次访问顺序供审核。'],
  mistakes: [
    { symptom: '空名单调用 add 提示属性不存在', reason: '{} 构建了字典。', fix: '使用 set() 构建空集合。', check: '打印 type(value).__name__。' },
    { symptom: '重复撤销后程序中止', reason: '第二次调用 remove 时成员已经缺失。', fix: '按需求使用 discard 或在删除前报告缺失。', check: '连续撤销两次，再撤销从未出现过的编号。' },
  ],
  summary: ['集合保存可哈希的唯一成员，输出顺序需要另行表达。', '并集回答至少一次，交集回答都满足，差集和对称差回答不同的排除条件。', '子集检查的是成员包含关系。'],
  next: '下一课把列表、字典和集合放在同一个程序里，并计算多次查找的成本。',
  exercises: [
    q('set-empty', '辨认空集合的创建方法', '哪个表达式会创建一个空集合？', 1, [
      ['{}', '这是空字典。'], ['set()', '无参数的 set 构造出空集合。'], ['[]', '这是空列表。'],
    ]),
    q('set-difference', '区分差集和对称差集', '两次输出依次是什么？', 2, [
      ['[2]、[1, 3]', '第一个表达式不是交集。'], ['[1, 3]、[1]', '有方向的差集在前。'], ['[1]、[1, 3]', '差集只从 A 保留 1，对称差另保留来自 B 的 3。'],
    ], 'a, b = {1, 2}, {2, 3}\nprint(sorted(a - b))\nprint(sorted(a ^ b))', '[1]\n[1, 3]\n'),
    q('set-subset', '辨认相等与真子集', 'required 和 actual 成员完全相同。哪一项成立？', 0, [
      ['required <= actual', '子集关系允许相等。'], ['required < actual', '真子集要求右边有额外成员。'], ['required.isdisjoint(actual)，即使它们非空', '非空且相等，两集合有共同成员。'],
    ]),
    q('set-any', '处理重复撤销并选择顺序容器', '撤销重复编号后，如何输出剩余编号的升序？', 1, [
      ['反复 remove，按集合遍历顺序输出', '可能在已缺失的编号处报错。'], ['用 discard 撤销并用 sorted 输出', 'discard 容许缺失，排序明确输出顺序。'], ['反复 pop，最后反转输出', 'pop 的取出顺序没有可用保证。'],
    ]),
    coding('A013', '基础编程', '输出唯一交集并保持第一份名单的首现顺序。'),
    coding('A014', '独立编程', '用多个集合运算生成场馆对账清单。'),
    coding('A015', '综合应用', '检查必修和限制，处理同时缺项与冲突。'),
    coding('A016', '拓展挑战', '跟踪多期名单并输出只在一期开过的访客。'),
  ],
  references: [
    reference('集合类型', 'library/stdtypes.html#set-types-set-frozenset', '核对运算、关系与修改方法。'),
    reference('教程中的集合', 'tutorial/datastructures.html#sets', '核对创建方式和不同集合操作。'),
  ],
};
