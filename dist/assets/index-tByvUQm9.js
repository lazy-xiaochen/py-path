import{p as ie,d as ae,f as oe,m as re,a as ce,b as le,l as de,s as pe,c as ue,e as me,v as fe,i as he,g as ge,h as ve,j as ye,k as be,n as we,o as ke,q as $e,r as xe,t as Ee,u as Le,w as Se,x as Ae,y as Ce,z as Ie,A as U}from"./lessons-vAzaFPfH.js";import{D as it,S as Te,a as _e,E as Y,s as je,H as Pe,t as q,b as kt,c as qe,p as Me,i as Ne,k as Oe,d as Re}from"./editor-BAWtmUHb.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))c(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&c(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function c(i){if(i.ep)return;i.ep=!0;const r=n(i);fetch(i.href,r)}})();const nt={输入输出:he,变量与运算:fe,条件判断:me,循环:ue,字符串:pe,列表:de,字典:le,函数:ce,模块:re,文件读写:oe,异常调试:ae,综合应用:ie},_t=t=>t.topics.flatMap(e=>e.examples),ut=["入门迁移","跨知识点","综合"];function I(t,e,n,c,i,r,a,u,g,y,l,v,p){return{id:"P"+String(t).padStart(3,"0"),title:e,difficulty:n,tag:c,description:i,input:r,output:a,sample:u,limits:g,cases:y,hints:l,solution:v,background:p}}const Fe=[I(1,"给包裹贴标签","入门","输入输出","读取一行收件人姓名，给它加上固定前缀，生成标签。","一行姓名 s，可包含空格。","一行，由“收件人：”和原姓名直接拼接。冒号是全角字符。",[`林晓
`,`收件人：林晓
`,"原样保留姓名，在前面加上全角冒号结尾的前缀。"],"姓名含 1–30 个字符，首尾无空格。",[[`阿 乔
`,`收件人：阿 乔
`],[`Q
`,`收件人：Q
`]],["input() 可以读取包含空格的整行。","用 + 拼接固定前缀。传给 input 的提示语也会写到标准输出。"],`name = input()
print("收件人：" + name)`,'评测会比较程序的完整标准输出。input("请输入姓名：") 多写了提示语，即使标签正确也会得到 WA。'),I(2,"装订顺序","入门","输入输出","把分别写在三行上的标题、作者、日期重新排成阅读卡片。","依次输入标题、作者、日期，各占一行。","依次输出日期、标题、作者，各占一行。",[`晚风笔记
周青
2026-08
`,`2026-08
晚风笔记
周青
`,"日期移到最前面，其余两行保持顺序。"],"每行 1–60 个字符，首尾无空格。",[[`A B
甲 乙
1
`,`1
A B
甲 乙
`],[`一
一
一
`,`一
一
一
`]],["每次 input 只读一行。","按读入顺序保留三个名字，再按要求调用 print。"],`title = input()
author = input()
date = input()
print(date)
print(title)
print(author)`),I(3,"兑换整册车票","入门","变量与运算","每册装 k 张票。用手头的 n 张票尽可能装满整册，并记录剩下的散票。","一行两个整数 n 和 k，以空格分隔。","一行两个整数，依次为整册数和散票数，用一个空格分隔。",[`17 5
`,`3 2
`,"3 册用掉 15 张，还剩 2 张。"],"0 ≤ n ≤ 10⁹，1 ≤ k ≤ 10⁹。",[[`0 8
`,`0 0
`],[`6 7
`,`0 6
`],[`1000000000 1000
`,`1000000 0
`]],["先把输入切分并转成整数。","// 得到整册数，% 得到剩余票数。"],`n, k = map(int, input().split())
print(n // k, n % k)`),I(4,"展架标签预算","基础","变量与运算","展架有 r 排，每排需 c 张标签，总共额外备 s 张。标签每包 p 张，只能整包买。","一行四个整数 r、c、s、p。","输出最少需要购买的包数。",[`3 7 4 6
`,`5
`,"共需 25 张，4 包只有 24 张。"],"0 ≤ r,c,s ≤ 10⁶，1 ≤ p ≤ 10⁹。",[[`2 6 0 4
`,`3
`],[`0 9 0 4
`,`0
`],[`1000000 1000000 1 1000000
`,`1000001
`]],["先求需要的标签总数。","有余数才多买一包，也可用 (总数 + p - 1) // p。"],`r, c, s, p = map(int, input().split())
total = r * c + s
print((total + p - 1) // p)`),I(5,"清晨骑行建议","入门","条件判断","风速达到 8 时建议停止骑行（取消）。低于 8 且降雨量大于 0 时建议加雨衣（雨衣）。其余情况建议正常出发（出发）。","一行两个整数 w、r，分别为风速和降雨量。","输出“取消”“雨衣”“出发”中的一个。",[`4 2
`,`雨衣
`,"风弱，降雨量为正。"],"0 ≤ w,r ≤ 100。",[[`8 1
`,`取消
`],[`7 0
`,`出发
`],[`9 0
`,`取消
`]],["先处理同时下雨和大风的情况。","将取消放在第一个 if 中，接着用 elif 检查下雨。"],`w, r = map(int, input().split())
if w >= 8:
    print("取消")
elif r > 0:
    print("雨衣")
else:
    print("出发")`),I(6,"错峰取餐","基础","条件判断","在开店后第 t 分钟取餐。外带标记为 1 时从侧门取。堂食在 [30,60) 或 [90,120) 走快线，其余走前台。","一行两个整数 t、m，m 表示是否外带。","输出“侧门”“快线”或“前台”。",[`55 0
`,`快线
`,"55 在第一个快线时段内。"],"0 ≤ t ≤ 180，m 为 0 或 1。",[[`29 0
`,`前台
`],[`30 0
`,`快线
`],[`60 0
`,`前台
`],[`89 0
`,`前台
`],[`90 0
`,`快线
`],[`120 0
`,`前台
`],[`30 1
`,`侧门
`],[`90 1
`,`侧门
`],[`29 1
`,`侧门
`]],["外带的规则优先级最高。","两个区间用 or 连接，右端点用小于。"],`t, m = map(int, input().split())
if m == 1:
    print("侧门")
elif 30 <= t < 60 or 90 <= t < 120:
    print("快线")
else:
    print("前台")`),I(7,"山路补水点","入门","循环","从第 1 公里走到第 n 公里。编号能被 3 整除但不能被 5 整除的公里点需要补水，求补水点编号之和。","一个整数 n。","输出编号之和。没有补水点时输出 0。",[`10
`,`18
`,"编号 3、6、9，共 18。"],"0 ≤ n ≤ 10⁵。",[[`0
`,`0
`],[`15
`,`30
`],[`3
`,`3
`],[`2
`,`0
`]],["先枚举 1 到 n。","range 的结束值不包含在内。用 and 连接两个条件。"],`n = int(input())
total = 0
for km in range(1, n + 1):
    if km % 3 == 0 and km % 5 != 0:
        total += km
print(total)`),I(8,"存下第一笔旅费","基础","循环","第 1 天存 a 元，此后每天比前一天多存 d 元。求第几天结束时累计首次达到至少 t 元。","一行三个整数 a、d、t。","输出最少天数。目标为 0 时输出 0。",[`2 3 14
`,`3
`,"前 3 天分别存 2、5、8 元，累计 15 元。"],"1 ≤ a ≤ 100，0 ≤ d ≤ 100，0 ≤ t ≤ 10⁵。",[[`2 3 7
`,`2
`],[`5 0 0
`,`0
`],[`1 0 100000
`,`100000
`]],["累计未达目标时才进入循环。","在循环内按“存钱、计天数、更新明日金额”的顺序操作。"],`a, d, target = map(int, input().split())
saved = days = 0
while saved < target:
    saved += a
    days += 1
    a += d
print(days)`),I(9,"海报字符统计","基础","字符串","一张文字海报里，数出英文字母 a（含大写）和星号 * 各出现几次。","一行可打印 ASCII 字符，可以为空。","输出 a/A 总次数与 * 次数，用空格分隔。",[`A * art**
`,`2 3
`,"A 与 art 中的 a 各贡献一次，星号共三个。"],"行长 0–200。",[[`
`,`0 0
`],[`BAAA
`,`3 0
`],[`a*a*A
`,`3 2
`]],["可以先把整行转成小写。","字符串的 count 方法可以统计一个字符。"],`line = input().lower()
print(line.count("a"), line.count("*"))`),I(10,"路标倒影","基础","字符串","将路标文字的每个字符倒序，空格也参与倒序。然后在结果的左右加上方括号。","一行字符，可以为空，可能含首尾空格。","输出一行，包含倒序后加方括号的内容。",[`东门 3
`,`[3 门东]
`,"空格保留，出现在 3 的右边。"],"行长 0–100，以 Unicode 码点计。",[[`
`,`[]
`],[`  小路 
`,`[ 路小  ]
`],[`X
`,`[X]
`]],["不调用 strip，否则首尾空格会消失。","使用步长为 -1 的切片。"],`sign = input()
print("[" + sign[::-1] + "]")`),I(11,"邻座温差","基础","列表","按座位顺序给出温度。找出相邻座位的最大绝对温差。只有一个座位时温差为 0。","第一行整数 n，第二行 n 个温度整数。","输出最大绝对温差。",[`4
8 5 11 9
`,`6
`,"5 与 11 相邻，温差为 6。"],"1 ≤ n ≤ 1000，−100 ≤ 温度 ≤ 100。",[[`1
-9
`,`0
`],[`2
100 -100
`,`200
`],[`3
6 6 6
`,`0
`]],["让索引从 1 开始，便于访问前一个元素。","用 abs 求差的绝对值，并更新已知最大值。"],`n = int(input())
values = list(map(int, input().split()))
answer = 0
for i in range(1, n):
    answer = max(answer, abs(values[i] - values[i - 1]))
print(answer)`),I(12,"调换书架标签","基础","列表","书架有 n 个标签。按操作顺序交换标签位置，每次交换两个从 1 开始的位置。","第一行 n 和 q，第二行 n 个标签，随后 q 行每行两个位置 i、j。","输出最终标签序列，以一个空格分隔。",[`4 2
甲 乙 丙 丁
1 4
2 4
`,`丁 甲 丙 乙
`,"先把甲移到末尾，再把甲调到第二位。"],"1 ≤ n ≤ 200，0 ≤ q ≤ 200，1 ≤ i,j ≤ n；标签含 1–30 个字符，不含空格。",[[`1 2
A
1 1
1 1
`,`A
`],[`2 0
左 右
`,`左 右
`],[`3 2
A B C
1 3
1 3
`,`A B C
`],[`5 4
甲 乙 甲 丁 戊
1 2
2 4
4 5
1 4
`,`戊 丁 甲 乙 甲
`,{note:"交换共享位置，重排操作或按标签值定位都会出错。"}]],["题目位置从 1 开始，列表索引从 0 开始。","可以用 a[i], a[j] = a[j], a[i] 一次完成交换。"],`n, q = map(int, input().split())
labels = input().split()
for _ in range(q):
    i, j = map(int, input().split())
    i -= 1
    j -= 1
    labels[i], labels[j] = labels[j], labels[i]
print(*labels)`),I(13,"工坊材料余量","基础","字典","每条记录表示某种材料入库或出库。查询一个材料的净变化；该材料可能没有记录。","首行整数 n，随后 n 行每行材料名和带符号整数。最后一行是查询的材料名。","输出查询材料的净变化。",[`3
纸 8
线 4
纸 -3
纸
`,`5
`,"纸的净变化是 8 − 3。"],"0 ≤ n ≤ 500，材料名含 1–12 个字符，不含空格，数量绝对值不超过 10⁵。",[[`0
纸
`,`0
`],[`2
木 8
木 -12
纸
`,`0
`],[`2
木 2
木 -8
木
`,`-6
`]],["把材料名称作为字典键。","用 ledger.get(name, 0) 为新材料提供初始值。"],`ledger = {}
for _ in range(int(input())):
    name, change = input().split()
    ledger[name] = ledger.get(name, 0) + int(change)
print(ledger.get(input(), 0))`),I(14,"自习室座位牌","进阶","字典","每张牌写着一个座位编号。找出出现次数最多的编号；次数相同时选择数值最小的编号。","第一行 n，第二行 n 个整数编号。","在一行输出编号和次数，中间用空格分隔。",[`5
8 3 8 3 4
`,`3 2
`,"3 与 8 都出现两次，选择较小的 3。"],"1 ≤ n ≤ 2500，0 ≤ 编号 ≤ 10⁹。",[[`1
0
`,`0 1
`],[`6
9 10 10 9 10 8
`,`10 3
`],[`3
90 12 3
`,`3 1
`],[`2500
`+"1000000000 ".repeat(2499)+`7
`,`1000000000 2499
`]],["先统计每种编号出现多少次。","得到最高次数后，只在具有该次数的候选中比较编号，选择数值最小的一个。"],`n = int(input())
counts = {}
for seat in map(int, input().split()):
    counts[seat] = counts.get(seat, 0) + 1
best_count = max(counts.values())
winner = None
for seat, count in counts.items():
    if count == best_count and (winner is None or seat < winner):
        winner = seat
print(winner, best_count)`),I(15,"步数换里程","基础","函数","每步长 l 厘米。为多条步数记录换算整数米数，零头舍去。建议编写转换函数。","第一行 q 和 l，接下来 q 行每行一个步数。","逐行输出各记录的整数米数。",[`3 65
1
2
100
`,`0
1
65
`,"第 2 条记录是 130 厘米，保留 1 米。"],"1 ≤ q ≤ 100，1 ≤ l ≤ 200，0 ≤ 步数 ≤ 10⁶。",[[`1 100
0
`,`0
`],[`2 50
2
3
`,`1
1
`]],["函数接收步数和步长。","计算结果通过 return 交给循环，再由循环 print。"],`def meters(steps, length):
    return steps * length // 100

q, length = map(int, input().split())
for _ in range(q):
    print(meters(int(input()), length))`),I(16,"为展板统一字号","基础","函数","把每个字号限制在 [lo, hi]。小于下限取下限，大于上限取上限。建议写一个可复用的限制函数。","第一行 n、lo、hi，第二行 n 个待处理字号。","一行输出全部处理后的字号，以一个空格分隔。",[`4 12 30
8 12 31 24
`,`12 12 30 24
`,"8 提到 12，31 降到 30。"],"1 ≤ n ≤ 500，0 ≤ lo ≤ hi ≤ 100，0 ≤ 字号 ≤ 200。",[[`3 5 5
0 5 200
`,`5 5 5
`],[`2 0 100
0 100
`,`0 100
`]],["先考虑只限制下限会怎样。","把 max(size, lo) 的结果再与 hi 取 min。"],`def clamp(size, low, high):
    return min(max(size, low), high)

n, low, high = map(int, input().split())
print(*(clamp(size, low, high) for size in map(int, input().split())))`),I(17,"拼接灯带的节拍","基础","模块","两条灯带分别每 a 秒和 b 秒闪烁一次，求从开始后到它们首次同时闪烁的秒数。可使用 math 模块。","一行两个正整数 a、b。","输出首次同时闪烁的秒数。",[`6 8
`,`24
`,"24 是 6 和 8 的最小正公倍数。"],"1 ≤ a,b ≤ 10⁹。",[[`1 1
`,`1
`],[`10 5
`,`10
`],[`999999937 1000000000
`,`999999937000000000
`]],["这等价于最小公倍数。","math.lcm 可直接计算；也可用 a // math.gcd(a, b) * b。"],`import math
a, b = map(int, input().split())
print(math.lcm(a, b))`),I(18,"两站之间的天数","进阶","模块","两座观测站给出两个日期，求两个日期相隔多少天（无论哪一个更早）。","两行，各是一个 YYYY-MM-DD 格式的合法公历日期。","输出相隔天数，日期相同输出 0。",[`2024-02-28
2024-03-01
`,`2
`,"2024 年有 2 月 29 日。"],"年份在 1900–2099 之间。",[[`1900-03-01
1900-02-28
`,`1
`],[`2000-02-29
2000-02-29
`,`0
`],[`2025-12-31
2026-01-01
`,`1
`]],["datetime.date.fromisoformat 能把日期字符串转成日期对象。","两个日期相减得到 timedelta，读取 days 后取绝对值。"],`from datetime import date
first = date.fromisoformat(input())
second = date.fromisoformat(input())
print(abs((second - first).days))`),I(19,"把签到写进日志","基础","文件读写","把收到的签到名字逐行写入 notes.txt，再读取文件并输出非空行的数量。评测依据标准输出。","首行 n，随后 n 行，每行一个名字或空行。","输出保存在日志中的非空行数。全是空格的行视为空行。",[`4
小禾

小桥
  
`,`2
`,"空行和只含空格的行都排除。"],"0 ≤ n ≤ 200，每行不超过 40 个字符。",[[`0
`,`0
`],[`2
甲
甲
`,`2
`],[`2
 

`,`0
`]],['用 with open(..., "w", encoding="utf-8") 写文件。',"打开同一文件用于读取，沿文件迭代，用 line.strip() 判断。"],`n = int(input())
with open("notes.txt", "w", encoding="utf-8") as log:
    for _ in range(n):
        log.write(input() + "\\n")
with open("notes.txt", encoding="utf-8") as log:
    print(sum(1 for line in log if line.strip()))`),I(20,"导出清单副本","进阶","文件读写","把输入的库存记录保存到 stock.txt。按原顺序从中挑出库存低于阈值的商品名，写入 refill.txt，再逐行读出并展示。","首行 n 和阈值 k，随后 n 行每行是商品名和库存数量，用一个空格分隔。","逐行输出符合条件的商品名。没有符合条件的商品时输出“无需补货”。",[`3 4
水杯 4
木尺 2
铅笔 0
`,`木尺
铅笔
`,"水杯库存恰好等于阈值，排除。"],"0 ≤ n ≤ 200，0 ≤ k、库存 ≤ 10⁶，名称 1–24 字符。",[[`0 8
`,`无需补货
`],[`1 0
笔 0
`,`无需补货
`],[`2 2
甲 1
甲 0
`,`甲
甲
`]],["以写入模式保存原始记录，然后用读取模式打开。","逐行拆分源文件，符合条件时写入副本。最后可用 read 读取整个副本。"],`n, threshold = map(int, input().split())
with open("stock.txt", "w", encoding="utf-8") as stock:
    for _ in range(n):
        stock.write(input() + "\\n")
with open("stock.txt", encoding="utf-8") as stock, open("refill.txt", "w", encoding="utf-8") as refill:
    for line in stock:
        name, amount = line.split()
        if int(amount) < threshold:
            refill.write(name + "\\n")
with open("refill.txt", encoding="utf-8") as refill:
    result = refill.read()
print(result or "无需补货", end="")`),I(21,"修复温度记录","基础","异常调试","把 n 行原始记录交给 int 转换。统计成功记录的和及失败记录的数量。空行也尝试转换。","第一行 n，随后 n 行原始记录。","输出有效整数之和、无效记录数，以空格分隔。",[`4
12
断线
-4
3.5
`,`8 2
`,"只有 12 和 −4 能被 int 直接转换。"],"0 ≤ n ≤ 300，单行最多 24 个字符。整数绝对值不超过 10⁹。",[[`0
`,`0 0
`],[`3
 +2 

0
`,`2 1
`],[`2
断线
空
`,`0 2
`]],["int 转换无效字符串会引发 ValueError。","每一条记录单独使用 try/except，失败后继续下一条。"],`total = invalid = 0
for _ in range(int(input())):
    value = input()
    try:
        total += int(value)
    except ValueError:
        invalid += 1
print(total, invalid)`),I(22,"维修配件分箱","进阶","异常调试","每行是零件总数和箱子数。将零件平均分配到箱子，输出每箱整件数。遇到非整数则输出“格式错误”，合法整数但箱子为 0 则输出“无法分箱”。","首行 n，随后 n 行，每行两个非空字段，以空格分隔。","按输入顺序输出每条结果，各占一行。",[`4
10 3
7 0
9 x
0 2
`,`3
无法分箱
格式错误
0
`,"先做整数转换，再做整除。"],"1 ≤ n ≤ 100，字段长不超过 20；有效整数在 0–10⁹ 之间。",[[`2
a 0
2 5
`,`格式错误
0
`],[`1
0 0
`,`无法分箱
`],[`1
6.0 3
`,`格式错误
`]],["可以用不同的 except 识别不同类型的异常。","把 int 转换和 // 放进 try，分别捕获 ValueError 和 ZeroDivisionError。"],`for _ in range(int(input())):
    first, second = input().split()
    try:
        print(int(first) // int(second))
    except ValueError:
        print("格式错误")
    except ZeroDivisionError:
        print("无法分箱")`),I(23,"夜间归还箱","基础","综合应用","n 条记录给出书架代号和归还数量。累计每个书架的数量，只输出总量不少于 k 的书架。","第一行 n 和 k，随后 n 行每行一个小写字母代号和一个整数数量。","按代号字典序逐行输出代号和总量；没有达标书架时输出“空”。",[`4 4
z 1
a 4
z 3
b 3
`,`a 4
z 4
`,"a 与 z 达到阈值。"],"0 ≤ n ≤ 500，0 ≤ k、数量 ≤ 10⁴。",[[`0 0
`,`空
`],[`2 0
b 0
a 0
`,`a 0
b 0
`],[`2 10
a 4
a 5
`,`空
`]],["先聚合同一书架的记录。","用 sorted 遍历书架键，先筛选再输出或判断为空。"],`n, minimum = map(int, input().split())
counts = {}
for _ in range(n):
    shelf, count = input().split()
    counts[shelf] = counts.get(shelf, 0) + int(count)
qualified = [shelf for shelf in sorted(counts) if counts[shelf] >= minimum]
if not qualified:
    print("空")
for shelf in qualified:
    print(shelf, counts[shelf])`),I(24,"灯塔值班段","进阶","综合应用","n 个观测值按时间排列。找出连续达到阈值的最长时段，输出该时段的起点和长度。长度并列时选择较早的起点。","第一行 n 和 t，第二行 n 个整数观测值。","起点按 1 开始编号，与长度用一个空格分隔。没有达标值时输出“0 0”。",[`7 5
2 5 8 1 5 6 7
`,`5 3
`,"第 5 到 7 个值组成长度最大的时段。"],"1 ≤ n ≤ 2500，观测值和 t 的绝对值不超过 10⁹。",[[`1 1
0
`,`0 0
`],[`5 5
5 7 0 5 6
`,`1 2
`],[`3 0
0 0 0
`,`1 3
`],[`2500 0
`+"-1000000000 ".repeat(2498)+`0 1000000000
`,`2499 2
`]],["每读到一个达标值，把当前长度加 1，否则清零。","只在严格变长时更新答案，起点是当前编号减去长度再加 1。"],`n, threshold = map(int, input().split())
start = best = length = 0
for index, value in enumerate(map(int, input().split()), 1):
    length = length + 1 if value >= threshold else 0
    if length > best:
        start, best = index - length + 1, length
print(start, best)`)],ze={...Ie,...Ce,...Ae,...Se,...Le,...Ee},Z=[...Fe.map(t=>({...t,guide:ze[t.id]})),...ge,...ve,...ye,...be,...we,...ke,...$e,...xe];function T(t,e,n,c){return{question:t,choices:e,answer:n,feedback:c}}const P=[{title:"让 Python 开口说话",tag:"输入输出",theory:"程序按顺序执行。input() 从标准输入读取一行并返回字符串，print() 默认写出内容和一个换行。题目会给定标准输入并直接比较标准输出，因此只有输出格式要求的文字才应被打印。",example:`city = input()
print("下一站", city)`,input:`杭州
`,check:T("输入 “海风 浪花” 占一行。调用一次 input() 会得到什么？",["海风","海风 浪花","两行字符串"],1,"input() 保留一行里的空格，只去掉行尾换行。"),predict:T('若把样例中的 print 改成 print(city, "站")，输入昆明时会输出什么？',["昆明站","站 昆明","昆明 站"],2,"print 的多个参数默认用一个空格分隔。"),mistake:'input("请输入：") 会把提示语写到标准输出。做题时用无参数的 input()，并逐字核对输出格式。'},{title:"用变量保存和计算",tag:"变量与运算",theory:"赋值把一个名字绑定到值。整数字面量和字符串是不同类型。int() 将可以解析的文本转成整数。整数的 // 是向下取整的除法，% 得到余数，两者满足 a == (a // b) * b + a % b。",example:`minutes = int(input())
hours = minutes // 60
left = minutes % 60
print(hours, left)`,input:`125
`,check:T('把字符串 "7" 与 "2" 用 + 相连，结果是什么？',["9",'"72"',"5"],1,"两个字符串用 + 拼接，数值相加前要转换类型。"),predict:T("每小盒装 12 枚纽扣。对 23 用 // 12 和 % 12，依次得到什么？",["1 和 11","2 和 1","1 和 12"],0,"一个整盒用去 12 枚，余下 11 枚。"),mistake:"input() 返回的 7 是文本。使用 int(input()) 之后再做算术。"},{title:"让程序做出选择",tag:"条件判断",theory:"if 检查条件，elif 在前面的条件都为假时进一步判断，else 处理其余情况。一个分支组只执行第一个成立的分支。用缩进标记分支，用 == 比较两个值。",example:`score = int(input())
if score >= 90:
    print("优秀")
elif score >= 60:
    print("合格")
else:
    print("继续练习")`,input:`60
`,check:T("当两个检查可能同时为真，但只允许输出一个结果时，可以用什么？",["两个独立 if","if 和 elif","重复打印"],1,"if/elif 只执行第一个为真的分支。"),predict:T("售票员应让身高恰好 120 的小朋友进入。“至少 120”应怎么写？",["height > 120","height == 121","height >= 120"],2,">= 将边界 120 包含在内。"),mistake:"把 >= 写成 > 会丢掉恰好等于阈值的情况。测试阈值前、阈值处和阈值后。"},{title:"用循环处理一组数据",tag:"循环",theory:"for 逐个遍历对象，range(start, stop) 包含起点、不包含终点。while 在每次循环前检查条件，循环体要推进状态。累计值通常在循环外初始化，在循环内更新。",example:`total = 0
for number in range(1, 5):
    total += number
print(total)`,input:"",check:T("range(2, 5) 会依次产生哪些整数？",["2、3、4、5","1、2、3、4","2、3、4"],2,"上界 5 不会产生。"),predict:T("已有 3 枚纪念章，每次新增 2 枚，while 当前数量 < 8 时继续。需要几次？",["2","3","4"],1,"数量依次变成 5、7、9，第三次才结束。"),mistake:"把 total = 0 写在循环体里会反复清空累计值。while 漏掉更新变量可能导致超时。"},{title:"读写和变换字符串",tag:"字符串",theory:"字符串是字符序列，索引从 0 开始。切片 s[start:stop:step] 包含起点、不包含终点，且不会修改原字符串。strip() 清理两端空白，lower() 返回小写副本。",example:`title = input()
print(title.strip())
print(title[:3])`,input:`  海岸线  
`,check:T('对 "松风雨" 取 s[1:3]，得到什么？',["松风","风雨","雨"],1,"从索引 1 的“风”开始，到索引 3 之前结束。"),predict:T('字符串 "  BeE  " 先 strip() 再 lower()，会得到什么？',['"bee"','"  bee  "','"BeE"'],0,"前者去除两端空格，后者负责转小写。"),mistake:"s.strip() 返回副本，原字符串不变。题目要求保留空白时直接使用 input() 的结果。"},{title:"把相关值存入列表",tag:"列表",theory:"列表按顺序保存元素，允许重复和修改。用 len() 获得长度，append() 添加一个元素，用 a[i] 访问或替换元素。split() 按空白切分一行，map(int, ...) 可逐个转换为整数。",example:`heights = list(map(int, input().split()))
heights.append(42)
print(len(heights), heights[-1])`,input:`5 7 9
`,check:T("列表 [4, 9, 4] 中索引 1 的值是什么？",["4","9","列表没有这一项"],1,"索引 1 表示第二项，重复不影响索引。"),predict:T('把 ["白", "绿", "蓝"] 的第一项和最后一项互换后，第二项是什么？',["蓝","白","绿"],2,"交换索引 0 与 2，索引 1 上的“绿”没有移动。"),mistake:"访问 a[len(a)] 会触发 IndexError。非空列表最后一个索引是 len(a) - 1。"},{title:"按键查询和累计",tag:"字典",theory:"字典将键映射到值，键唯一。d[key] 在没有这个键时会报 KeyError，而 d.get(key, default) 可给出默认值。写入同一个键会替换旧值。",example:`book = {"麻绳": 5, "彩纸": 2}
name = input()
book[name] = book.get(name, 0) + 1
print(book[name])`,input:`胶带
`,check:T('d = {"云": 2} 时，d.get("雨", 0) 会返回什么？',["2","0","KeyError"],1,"get 返回给定默认值，且不会插入新键。"),predict:T('先后给键 "石" 赋值 1 和 4，这个字典为 "石" 保留几个值？',["2 个","1 个，值为 1","1 个，值为 4"],2,"第二次赋值会覆盖第一次。"),mistake:"用 d[name] += 1 处理一个未出现的新键会报 KeyError，先读取默认值 0。"},{title:"把重复逻辑写成函数",tag:"函数",theory:"def 声明函数，参数是调用时传入的值。return 把结果交给调用者并结束该次调用。没有执行到 return 时，函数返回 None。函数内定义的普通变量通常只在该次调用中可见。",example:`def postage(weight):
    return 5 + weight * 2

cost = postage(int(input()))
print(cost)`,input:`3
`,check:T("需要把计算结果交给其他表达式继续使用，函数里该用什么？",["print","input","return"],2,"return 传回值，print 写到输出流。"),predict:T("若 f(x) 返回 x + 3，计算 f(f(2)) 得到什么？",["5","8","10"],1,"第一次调用返回 5，第二次以 5 为参数返回 8。"),mistake:"只 print 结果的函数通常返回 None。需要后续计算时，改用 return。"},{title:"用模块组织工具",tag:"模块",theory:'模块可以是一个 Python 文件。import math 引入模块，使用 math.gcd 等带模块名的写法。自己的 helpers.py 和主文件放在同一目录时，可以用 import helpers。入口判断 __name__ == "__main__" 可避免导入时执行命令行入口。',example:`import helpers

print(helpers.triple(int(input())))`,input:`7
`,exampleFiles:[{name:"helpers.py",content:`def triple(value):
    return value * 3
`}],check:T("有 tools.py 文件，想引入模块时应写什么？",["import tools.py","import tools","open(tools)"],1,"导入时模块名称省略 .py。"),predict:T("若执行 import math，要调用平方根函数时应该怎么写？",["sqrt(9)","math.sqrt(9)","math(9)"],1,"import math 将模块绑定到名字 math。"),mistake:"文件取名 math.py 可能挡住标准库同名模块。自定义模块应使用不同名字。"},{title:"把数据写入文件再读出",tag:"文件读写",theory:'with open(...) 管理文件的关闭。用 "w" 写入会创建或覆盖文件，用 "a" 追加，用默认的 "r" 读取。中文文本显式使用 encoding="utf-8"。浏览器中的运行文件位于临时虚拟目录。',example:`with open("memo.txt", "w", encoding="utf-8") as file:
    file.write(input())
with open("memo.txt", encoding="utf-8") as file:
    print(file.read())`,input:`带上地图
`,check:T('已有文件时，用 "w" 打开它会怎样？',["先清空原文件","总是在末尾追加","只允许读取"],0,'"w" 打开时就会截断文件。'),predict:T('已有文件内容为 "甲"，追加 file.write("乙") 后的完整内容是什么？',["乙","甲乙","甲\\n乙"],1,"write() 不会自动写入换行。"),mistake:"把浏览器运行时生成的文件当作工作台已保存文件。每次运行从左侧文件快照新建目录。"},{title:"读懂异常并缩小问题",tag:"异常调试",theory:"错误栈标明文件、行号和出错调用。先看最后一行的异常类型和消息，再找最靠近异常的自己的源码。try 保护可能失败的操作，except 捕获具体的异常类型。",example:`raw = input()
try:
    number = int(raw)
    print(number + 1)
except ValueError:
    print("需要整数")`,input:`七
`,check:T('int("3.7") 最可能引发哪一种异常？',["ValueError","IndexError","NameError"],0,'字符串类型能传给 int，但 "3.7" 不是整数文本。'),predict:T('若把示例的 except 改为 except IndexError，并输入 "三"，会怎样？',["打印“需要整数”","未捕获的 ValueError","输出 0"],1,"except IndexError 只捕获这一类异常。"),mistake:"用一个空的 except 吞掉全部异常会掩盖真正错误。只在能明确处理时捕获具体类型。"},{title:"组合工具独立解题",tag:"综合应用",theory:"读题后先用一句话写出输出目标，记录会变化的状态，再用样例手推。编写代码后针对空数据、相等边界和并列规则自测。把可独立复用的逻辑抽成函数。",example:`def total_above(values, limit):
    return sum(value for value in values if value > limit)

limit = int(input())
values = list(map(int, input().split()))
print(total_above(values, limit))`,input:`6
3 9 6 11
`,check:T("规则从“大于上限”改为“至少达到上限”。哪个输入最能区分两者？",["值小于上限","值等于上限","值大于上限"],1,"相等的数据只符合“至少达到”。"),predict:T("并列要取最早出现者。按输入顺序扫描时该在何时更新最佳值？",["只在严格更好时","相等也更新","只在严格更差时"],0,"严格更好才替换，首次出现的并列项就会保留。"),mistake:"用一个样例判断正确性。额外构造最小规模、刚好相等和多个并列的测试。"}],yt=[{id:U.id,title:U.title,tags:"基础篇结项 · 多文件与 CSV",description:U.description,steps:U.guide.steps,input:U.sample[0],expected:U.sample[1],acceptance:U.sample[2],files:U.starterFiles,solution:U.solution,assessment:U},{id:"words",title:"文本词频统计",tags:"字符串 · 字典 · 模块",description:"从文件读入英文短文，忽略大小写和标点，按频率列出前 k 个单词。",steps:["标准输入读入正整数 k。读取随项目提供的 article.txt。","用 re.findall 按 [a-z]+ 提取小写英文词，按词累计每次出现。","按次数从大到小排序，同频按单词字母顺序。每行输出单词和次数，最多 k 行。没有单词时输出“空文本”。"],input:`3
`,expected:`wind 3
bridge 2
the 2
`,acceptance:"把 k 改为 1，输出应只有 wind 3。把文件改成纯标点，应输出“空文本”。",files:[{name:"main.py",content:`# 文本词频统计
import re

# 读取 article.txt，再统计与排序
`},{name:"article.txt",content:`Wind over the bridge. Wind under the bridge? No: wind and rain.
`}],solution:`import re

limit = int(input())
with open("article.txt", encoding="utf-8") as article:
    words = re.findall(r"[a-z]+", article.read().lower())
counts = {}
for word in words:
    counts[word] = counts.get(word, 0) + 1
if not counts:
    print("空文本")
else:
    ranked = sorted(counts, key=lambda word: (-counts[word], word))
    for word in ranked[:limit]:
        print(word, counts[word])`}],Be=`(() => {
  'use strict';
  let storageBlocked = false;
  try { void localStorage.length; } catch (error) { storageBlocked = error.name === 'SecurityError'; }
  if (self.origin !== 'null' || !storageBlocked) return;

  addEventListener('message', event => {
    if (event.source !== parent || event.data?.type !== 'boot' || !event.ports[0]) return;
    const host = event.ports[0];
    try {
      const { scripts, assets, probe } = event.data;
      const url = URL.createObjectURL(new Blob(scripts, { type: 'text/javascript' }));
      let worker;
      try { worker = new Worker(url, { name: 'isolated-python' }); }
      finally { URL.revokeObjectURL(url); }

      const channel = new MessageChannel();
      const port = channel.port1;
      port.onmessage = message => {
        if (message.data?.type === 'result' || message.data?.type === 'failed') worker.terminate();
        host.postMessage(message.data);
      };
      worker.onerror = event => {
        event.preventDefault();
        worker.terminate();
        host.postMessage({ type: 'failed', reason: event.message || '隔离 Worker 启动失败。' });
      };
      host.onmessage = message => {
        if (message.data?.type === 'stop') worker.terminate();
        if (message.data?.type === 'execute') port.postMessage(message.data);
      };
      worker.postMessage({ assets, probe }, [channel.port2]);
    } catch (error) {
      host.postMessage({ type: 'failed', reason: String(error) });
    }
  }, { once: true });
  parent.postMessage({ type: 'python-isolate-ready' }, '*');
})();
`,Ue=`// Concatenated after the two local Pyodide scripts into a classic blob Worker.
(() => {
  'use strict';
  const runtimeBase = 'https://python-runtime.invalid/';
  const nativeFetch = globalThis.fetch.bind(globalThis);

  async function verifyNetworkPolicy(url) {
    const violation = new Promise(resolve => {
      addEventListener('securitypolicyviolation', event => {
        if (event.disposition === 'enforce' && event.effectiveDirective === 'connect-src') resolve(true);
      });
      setTimeout(() => resolve(false), 1800);
    });
    const blocked = await nativeFetch(url, { mode: 'no-cors', credentials: 'omit', cache: 'no-store' })
      .then(() => false, () => true);
    if (!blocked || !await violation) throw new Error('无法确认 Worker 的 CSP 正在阻止联网。');
  }

  addEventListener('message', async event => {
    const port = event.ports[0];
    const send = port.postMessage.bind(port);
    try {
      if (self.origin !== 'null') throw new Error('Worker 没有独立的不透明来源。');
      const { assets, probe } = event.data;
      await verifyNetworkPolicy(probe);
      const resources = new Map([
        [runtimeBase + 'pyodide.asm.wasm', [assets.wasm, 'application/wasm']],
        [runtimeBase + 'python_stdlib.zip', [assets.stdlib, 'application/zip']],
        [runtimeBase + 'pyodide-lock.json', [assets.lock, 'application/json']],
      ]);
      const originalFetch = globalThis.fetch;
      // Only the trusted initialization code runs while this in-memory adapter is installed.
      globalThis.fetch = async url => {
        const resource = resources.get(String(url));
        if (!resource) throw new Error('无法读取未打包的解释器资源。');
        return new Response(resource[0], { headers: { 'Content-Type': resource[1] } });
      };
      let python;
      try {
        python = await loadPyodide({ indexURL: runtimeBase, stdout() {}, stderr() {} });
      } finally {
        globalThis.fetch = originalFetch;
        resources.clear();
      }
      port.onmessage = ({ data }) => {
        if (data?.type !== 'execute') return;
        port.onmessage = null;
        execute(python, data, send);
      };
      send({ type: 'ready' });
    } catch (error) {
      send({ type: 'failed', reason: String(error) });
    }
  }, { once: true });

  function inspectArtifacts(fs, names) {
    let remaining = 64 * 1024;
    return names.map(name => {
      const path = '/work/' + name;
      try {
        const info = fs.lstat(path);
        if (!fs.isFile(info.mode)) return { name, error: '产物须为普通文件。' };
        if (info.size > remaining) return { name, error: '产物合计超过 64 KiB。' };
        remaining -= info.size;
        return { name, content: new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(fs.readFile(path)) };
      } catch (error) {
        return { name, error: error instanceof TypeError ? '产物不是有效的 UTF-8 文本。' : '未找到产物或无法读取。' };
      }
    });
  }

  function execute(python, { files, entry, input, inspection }, send) {
    const channels = [new TextDecoder(), new TextDecoder()];
    const output = ['', ''];
    let remaining = 64 * 1024;
    let limited = false;
    const payload = () => ({ stdout: output[0], stderr: output[1] });
    const write = channel => bytes => {
      const size = bytes.length;
      if (limited) return size;
      const count = Math.min(size, remaining);
      remaining -= count;
      output[channel] += channels[channel].decode(bytes.subarray(0, count), { stream: true });
      if (count < size) {
        limited = true;
        send({ type: 'result', status: 'OLE', ...payload() });
      }
      return size;
    };
    try {
      python.setStdout({ write: write(0) });
      python.setStderr({ write: write(1) });
      python.FS.mkdir('/work');
      for (const { name, content } of files) python.FS.writeFile('/work/' + name, content);
      const context = python.toPy({ entry, input, call: inspection?.call ?? null });
      let report;
      try { report = JSON.parse(python.runPython(driver, { globals: context })); }
      finally { context.destroy(); }
      if (limited) return;
      for (let channel = 0; channel < 2; channel++) output[channel] += channels[channel].decode();
      const artifacts = !report.diagnostic && inspection?.artifacts ?
        inspectArtifacts(python.FS, inspection.artifacts) : undefined;
      send({ type: 'result', status: report.diagnostic ? 'RE' : 'OK', ...payload(), ...report, artifacts });
    } catch (error) {
      if (!limited) send({ type: 'result', status: 'RE', ...payload(),
        diagnostic: { kind: 'RuntimeError', trace: String(error).slice(0, 8192) } });
    }
  }

  const driver = \`
import importlib, io, json, os, sys, traceback, types
class ClosedInput(io.StringIO):
    attempted = False
    def read(self, *args):
        self.attempted = True
        raise EOFError('接口验证期间不可读取标准输入')
    readline = read
    readlines = read
    __next__ = read

os.chdir('/work')
entry = '/work/' + entry
sys.argv = [entry]
sys.path.insert(0, '/work')
sys.stdin = io.TextIOWrapper(io.BytesIO(input.encode('utf-8')), encoding='utf-8', newline=None)
main = types.ModuleType('__main__')
main.__file__ = entry
sys.modules['__main__'] = main
diagnostic = None
values = None
closed_input = ClosedInput()
try:
    if call is None:
        with open(entry, 'rb') as source:
            code = compile(source.read(), entry, 'exec')
        exec(code, main.__dict__)
    else:
        sys.stdin = closed_input
        module = importlib.import_module(call['module'])
        function = getattr(module, call['name'], None)
        if not callable(function):
            raise TypeError('缺少可调用函数 ' + call['name'])
        values = []
        for arguments in call['args']:
            value = function(*arguments)
            if type(value) is int and abs(value) <= 9007199254740991:
                values.append(value)
            elif type(value) is str and len(value) <= 4096:
                values.append(value)
            elif value is None or type(value) is bool:
                values.append(value)
            else:
                raise TypeError('返回值须为约定类型和大小')
except BaseException as exc:
    if not (isinstance(exc, SystemExit) and exc.code in (None, 0)):
        frames = traceback.extract_tb(exc.__traceback__)
        location = next(((frame.filename, frame.lineno) for frame in reversed(frames)
                         if frame.filename.startswith('/work/')), (None, None))
        if isinstance(exc, SyntaxError) and (exc.filename or '').startswith('/work/'):
            location = exc.filename, exc.lineno
        diagnostic = dict(kind=type(exc).__name__, trace=traceback.format_exc(limit=-20)[-8192:],
                          file=location[0].removeprefix('/work/') if location[0] else None,
                          line=location[1])
finally:
    sys.stdout.flush()
    sys.stderr.flush()
json.dumps(dict(diagnostic=diagnostic, values=values, inputRead=closed_input.attempted))
\`;
})();
`,jt=20,Pt=128*1024,Ve=32*1024,qt=new TextEncoder,Mt=new URL("runtime/",new URL("./",location.href));function Nt(t){return/^[\p{L}\p{N}_][\p{L}\p{N}_.-]{0,79}$/u.test(t)}function mt(t){if(!t.length||t.length>jt)return"文件数量须为 1–20 个。";if(new Set(t.map(e=>e.name)).size!==t.length)return"文件名重复。";if(!t.every(e=>Nt(e.name)))return"文件名须由字母、汉字、数字、下划线、点或连字符组成，且不能包含目录。";if(t.reduce((e,n)=>e+qt.encode(n.content).length,0)>Pt)return"文件总大小超过 128 KiB。"}let dt;function De(){const t=async e=>{const n=await fetch(new URL(e,Mt),{mode:"same-origin",redirect:"error",signal:AbortSignal.timeout(15e3)});if(!n.ok||n.headers.get("content-type")?.includes("text/html"))throw new Error("解释器资源加载失败："+e);return n};return Promise.all([t("pyodide.asm.js").then(e=>e.text()),t("pyodide.js").then(e=>e.text()),t("pyodide.asm.wasm").then(e=>e.blob()),t("python_stdlib.zip").then(e=>e.blob()),t("pyodide-lock.json").then(e=>e.blob())]).then(([e,n,c,i,r])=>({scripts:[e,`
;
`,n,`
;
`,Ue],assets:{wasm:c,stdlib:i,lock:r}}))}function at(t,e,n,c){if(e?.aborted)return c?.dispose(),Promise.resolve({status:"STOP",stdout:"",stderr:""});const i=mt(t.files)??(!t.entry.endsWith(".py")||!t.files.some(r=>r.name===t.entry)?"请选择工作区内的 Python 入口文件。":void 0)??(qt.encode(t.input).length>Ve?"标准输入超过 32 KiB。":void 0)??(t.inspection?.artifacts?.some(r=>!Nt(r))?"产物必须使用工作区内的单层文件名。":void 0);return i?(c?.dispose(),Promise.resolve({status:"INVALID",stdout:"",stderr:"",detail:i})):(c?.available?c:Ot()).start(t,e,n)}function Ot(t){const e=document.createElement("iframe");e.hidden=!0,e.title="隔离的 Python 执行环境",e.setAttribute("sandbox","allow-scripts");const n=new MessageChannel;let c=!1,i=!1,r=!1,a,u,g=window.setTimeout(()=>l("UNAVAILABLE","无法在时限内确认隔离环境和解释器可用。"),25e3);function y(s){a||(a=s,n.port1.postMessage({type:"stop"}),n.port1.close(),e.remove(),window.clearTimeout(g),window.removeEventListener("message",p),u?.signal?.removeEventListener("abort",v),u?.resolve(s),u=void 0,t?.("closed"))}function l(s,m){y({status:s,stdout:"",stderr:"",detail:m})}function v(){l("STOP")}async function p(s){if(!(c||s.source!==e.contentWindow||s.origin!=="null"||s.data?.type!=="python-isolate-ready")){c=!0;try{dt??=De().catch(d=>{throw dt=void 0,d});const m=await dt;a||e.contentWindow.postMessage({type:"boot",...m,probe:new URL("isolation-probe",Mt).href},"*",[n.port2])}catch(m){l("UNAVAILABLE",String(m))}}}function w(){if(a||r||!i||!u)return;r=!0,clearTimeout(g),g=window.setTimeout(()=>l("TLE"),2e3);const{snapshot:s,onRunning:m}=u;m?.(),a||n.port1.postMessage({type:"execute",...s})}n.port1.onmessage=({data:s})=>{a||(s?.type==="failed"&&l("UNAVAILABLE",String(s.reason).slice(0,1e3)),s?.type==="ready"&&!i&&(i=!0,clearTimeout(g),u?w():(g=window.setTimeout(v,6e4),t?.("ready"))),s?.type==="result"&&r&&["OK","RE","OLE"].includes(s.status)&&typeof s.stdout=="string"&&typeof s.stderr=="string"&&y({status:s.status,stdout:s.stdout,stderr:s.stderr,diagnostic:s.diagnostic,values:s.values,inputRead:s.inputRead,artifacts:s.artifacts}))},window.addEventListener("message",p);const b=Array.from(crypto.getRandomValues(new Uint32Array(4)),s=>s.toString(16)).join(""),E=`default-src 'none'; script-src 'nonce-${b}' 'wasm-unsafe-eval'; worker-src blob:; connect-src 'none'; base-uri 'none'; form-action 'none'`;return e.srcdoc=`<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${E}"><script nonce="${b}">${Be}<\/script>`,document.body.append(e),{get available(){return!a&&!u},start(s,m,d){return a?Promise.resolve(a):u?Promise.resolve({status:"INVALID",stdout:"",stderr:"",detail:"执行环境已被使用。"}):new Promise($=>{if(u={snapshot:s,signal:m,onRunning:d,resolve:$},m?.aborted){v();return}m?.addEventListener("abort",v,{once:!0}),w()})},dispose:v}}function ot(t,e="relaxed"){const n=t.replace(/\r\n?/g,`
`);if(e==="exact")return n.endsWith(`
`)?n.slice(0,-1):n;const c=n.split(`
`).map(i=>i.trimEnd());for(;c.length&&c.at(-1)==="";)c.pop();return c.join(`
`)}function $t(t){return t===void 0?"行尾":t===" "?"空格":t==="	"?"制表符":/\s/u.test(t)?"其他空白":"非空白字符"}function Rt(t,e){const n=ot(t,"exact").split(`
`),c=ot(e,"exact").split(`
`);for(let i=0;i<Math.max(n.length,c.length);i++){const r=n[i],a=c[i];if(r===a)continue;const u="第 "+(i+1)+" 行";if(r===void 0)return u+"是多出的输出。";if(a===void 0)return"缺少"+u+"输出。";const g=Array.from(r),y=Array.from(a);let l=0;for(;g[l]===y[l];)l++;const v=u+"第 "+(l+1)+" 列",p=$t(g[l]),w=$t(y[l]);return p===w?v+"的字符不同。":v+"期望为"+p+"，实际为"+w+"。"}}const Ke={AC:"通过",WA:"答案错误",RE:"运行错误",TLE:"超时",OLE:"输出超限",OK:"运行结束",STOP:"已停止",UNAVAILABLE:"隔离环境不可用",INVALID:"无法运行"},We={SyntaxError:"Python 无法解析这段代码。检查冒号、配对的括号和引号。",IndentationError:"缩进与语句块不匹配。检查冒号后是否缩进，同一层是否对齐。",TabError:"缩进混用了制表符和空格。建议统一使用四个空格。",ValueError:"值的格式或范围不符合要求。例如 int 只能转换合法的整数文本。",TypeError:"操作所需的数据类型不匹配。检查参数以及参与运算的值。",NameError:"当前作用域找不到这个名称。检查拼写、定义顺序和变量的作用域。",UnboundLocalError:"函数读取了尚未赋值的局部变量。检查每个分支是否都赋值。",ZeroDivisionError:"除数为 0。检查输入并在计算前处理该边界。",IndexError:"序列索引越界。非空序列的最后一个正向索引是长度减一。",KeyError:"字典中没有这个键。可以先检查键，或使用 get 提供默认值。",EOFError:"已经读到了输入末尾。请在运行前填写「标准输入」。每次 input() 读取一行，例如两次 input() 需要两行。",ModuleNotFoundError:"找不到模块。检查模块名与工作区文件，执行环境仅含已打包的模块。",ImportError:"模块中的对象无法导入。检查名称和是否存在循环导入。",FileNotFoundError:"虚拟工作目录里没有该文件。检查路径、文件名和是否已导入。",AttributeError:"对象没有这个属性或方法。检查拼写和对象类型。",AssertionError:"assert 检查失败。查看检查条件与实际值。",RecursionError:"递归层数超限。检查结束条件和每次递归是否接近它。",SystemExit:"程序以非零状态退出。检查传给 exit 或 sys.exit 的值。"},ft={WA:"核对输出格式，再测试最小输入、相等端点和重复值。",RE:"用自定义输入复现，检查输入转换、索引、空数据和异常栈。",TLE:"检查循环是否能结束，以及最大规模下是否重复计算。",OLE:"输出超过 64 KiB，已截断并停止。检查循环内的打印。",UNAVAILABLE:"请通过 HTTP 或 HTTPS 打开页面后重试。"},o=t=>String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]);function k(t,e){return t.querySelector(e)}function tt(t){const e=["AC","WA","RE","TLE","OLE"].includes(t)?" · "+t:"";return'<span class="status status-'+t+'">'+Ke[t]+e+"</span>"}function _(t,e="（空）"){return`<pre>
`+o(t||e)+"</pre>"}function He(t,e){const c=t.kind==="ValueError"&&t.trace.includes("ValueError: invalid literal for int()")?"int() 需要一个有效的整数。若这一行填了两个数，可以按每次 input() 一行重新填写，或先用 split() 拆分，再分别转换。":We[t.kind]??"请查看原始异常的最后一行与调用位置。";return'<section class="error-box"><p>'+o(c)+"</p>"+(e&&t.line?'<button class="link-button jump" type="button">'+o(e.name)+" · 第 "+o(t.line)+' 行</button><p class="stale muted" hidden>这条结果来自旧版本，重新运行后可定位。</p>':"")+_(t.trace)+"</section>"}function rt(t){return'<div class="result-heading">'+tt(t.status)+"</div>"+(t.detail?'<p class="muted">'+o(t.detail)+"</p>":"")+(t.assessmentIssue?'<p class="muted">'+o(t.assessmentIssue)+"</p>":"")+(ft[t.status]?'<p class="muted">'+o(ft[t.status])+"</p>":"")+(["OK","RE","OLE"].includes(t.status)?"<h4>标准输出</h4>"+_(t.stdout)+"<h4>标准错误</h4>"+_(t.stderr):"")+(t.values?"<h4>返回值</h4>"+_(t.values.map(e=>JSON.stringify(e)).join(`
`)):"")+(t.artifacts??[]).map(e=>"<details><summary>本次产物 "+o(e.name)+"</summary>"+(e.content===void 0?"<p>"+o(e.error)+"</p>":_(e.content))+"</details>").join("")}async function xt(t,e){try{await navigator.clipboard.writeText(e),t.textContent="已复制"}catch{t.textContent="请手动选择并复制"}}const Ge=it.line({class:"execution-error-line"}),ht=Te.define(),Et=_e.define({create:()=>it.none,update(t,e){const n=e.effects.find(c=>c.is(ht));return n?.value?it.set([Ge.range(e.newDoc.line(n.value).from)]):n||e.docChanged?it.none:t},provide:t=>Y.decorations.from(t)}),Je=Y.theme({"&":{backgroundColor:"var(--editor-bg)",color:"var(--editor-text)"},".cm-content, .cm-gutter":{fontFamily:"var(--mono)",fontSize:"14px",lineHeight:"1.75"},".cm-content":{padding:"12px 0",caretColor:"var(--accent)"},".cm-line":{paddingInline:"10px"},".cm-gutters":{backgroundColor:"var(--editor-edge)",color:"var(--muted)",borderRight:"1px solid var(--border)"},".cm-activeLineGutter, .cm-activeLine":{backgroundColor:"var(--editor-line)"},".cm-cursor, .cm-dropCursor":{borderLeftColor:"var(--accent)"},"&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":{backgroundColor:"var(--editor-selection)"},"&.cm-focused .cm-matchingBracket, .cm-searchMatch, .cm-selectionMatch":{backgroundColor:"var(--accent-soft)",color:"var(--editor-text)"},".cm-searchMatch.cm-searchMatch-selected":{backgroundColor:"var(--warning-soft)",color:"var(--warning)"},".cm-panels, .cm-tooltip, .cm-foldPlaceholder":{backgroundColor:"var(--surface)",color:"var(--text)",borderColor:"var(--border)"},".cm-panel .cm-textfield, .cm-panel .cm-button":{background:"var(--field)",color:"var(--text)",border:"1px solid var(--border-strong)",borderRadius:"var(--radius-sm)"},".execution-error-line":{backgroundColor:"var(--editor-error-line)"},".cm-scroller":{maxHeight:"72vh"}},{dark:!0}),Xe=je(Pe.define([{tag:q.keyword,color:"var(--syntax-keyword)"},{tag:[q.comment,q.lineComment],color:"var(--syntax-comment)",fontStyle:"italic"},{tag:[q.string,q.special(q.string)],color:"var(--syntax-string)"},{tag:[q.number,q.bool,q.null],color:"var(--syntax-number)"},{tag:[q.definition(q.variableName),q.standard(q.variableName),q.function(q.variableName)],color:"var(--syntax-function)"},{tag:q.operator,color:"var(--editor-text)"}]));function Ye(t,e,n,c=!1,i=!1,r=!1){const a=new Map;let u=!0;t.innerHTML='<div class="filebar"></div><div class="editor-host"></div><p class="file-feedback" role="status" hidden></p>';const g=k(t,".filebar"),y=k(t,".file-feedback"),l=(d="")=>{y.textContent=d,y.hidden=!d};function v(d){return kt.create({doc:d.content,extensions:[qe,Je,Xe,d.name.endsWith(".py")?Me():[],Ne.of("    "),Oe.of([Re]),kt.readOnly.of(i),Y.editable.of(!i),Y.contentAttributes.of({"aria-label":"Python 源码编辑器"}),Et,Y.updateListener.of($=>{if(!$.docChanged)return;const x=e.files.find(S=>S.name===e.active);x.content=$.state.doc.toString(),n()})]})}const p=()=>e.files.find(d=>d.name===e.active),w=new Y({state:v(p()),parent:k(t,".editor-host")});function b(){w.state.field(Et).size&&w.dispatch({effects:ht.of(void 0)})}function E(){g.innerHTML='<div class="file-tabs" aria-label="工作区文件">'+e.files.map(d=>'<button type="button" data-file="'+o(d.name)+'" aria-pressed="'+(d.name===e.active)+'">'+o(d.name)+"</button>").join("")+"</div>"+(c?'<div class="file-actions"><button type="button" data-action="new">新建</button><button type="button" data-action="import">导入</button><button type="button" data-action="rename">重命名</button><button type="button" data-action="delete">删除</button><input type="file" multiple hidden></div>'+(r?'<span class="muted">入口 main.py</span>':'<label class="entry-label">运行入口 <select aria-label="运行入口">'+e.files.filter(d=>d.name.endsWith(".py")).map(d=>"<option"+(d.name===e.entry?" selected":"")+">"+o(d.name)+"</option>").join("")+"</select></label>"):"")}function s(d,$){if(!e.files.some(S=>S.name===d)||(e.active!==d&&(a.set(e.active,w.state),e.active=d,w.setState(a.get(d)??v(p())),E(),n()),b(),!$||$<1||$>w.state.doc.lines))return;const x=w.state.doc.line($);w.dispatch({effects:ht.of($),selection:{anchor:x.from,head:x.to},scrollIntoView:!0}),w.focus()}function m(d,$,x){const S=mt(d);if(S){l(S);return}if(!d.some(A=>A.name.endsWith(".py"))){l("请至少保留一个 .py 文件。");return}b(),a.set(e.active,w.state),x&&a.delete(x),e.files=d,e.active=$,d.some(A=>A.name===e.entry)||(e.entry=d.find(A=>A.name.endsWith(".py")).name),w.setState(a.get($)??v(p())),E(),l(),n()}return g.addEventListener("click",d=>{const $=d.target.closest("button");if(!$)return;const{file:x,action:S}=$.dataset;if(x){s(x);return}if(S==="import"){k(g,"input[type=file]").click();return}if(S==="delete"&&confirm("删除 "+e.active+"？")){const A=e.files.filter(C=>C.name!==e.active);if(!A.length){l("请至少保留一个 .py 文件。");return}m(A,A[0].name,e.active)}if(S==="new"||S==="rename"){const A=prompt(S==="new"?"新文件名，例如 helpers.py":"重命名文件",S==="new"?"":e.active);if(A===null)return;const C=A.trim();if(S==="rename"&&C===e.active)return;if(S==="new")m([...e.files,{name:C,content:""}],C);else{const z=e.entry;e.active===z&&C.endsWith(".py")&&(e.entry=C);const N=e.files.map(R=>R===p()?{...R,name:C}:R);(mt(N)||!N.some(R=>R.name.endsWith(".py")))&&(e.entry=z),m(N,C,e.active)}}}),g.addEventListener("change",async d=>{const $=d.target;if($ instanceof HTMLSelectElement&&(e.entry=$.value,n()),!($ instanceof HTMLInputElement)||!$.files?.length)return;const x=Array.from($.files);if($.value="",x.length+e.files.length>jt||x.reduce((S,A)=>S+A.size,0)>Pt){l("导入文件超过运行器的文件数量或大小限制。");return}try{const S=await Promise.all(x.map(async A=>({name:A.name,content:new TextDecoder("utf-8",{fatal:!0}).decode(await A.arrayBuffer())})));u&&m([...e.files,...S],S[0].name)}catch{u&&l("只能导入 UTF-8 文本文件。")}}),E(),{snapshot:d=>({entry:e.entry,input:d,files:e.files.map($=>({...$}))}),unchanged:d=>e.entry===d.entry&&e.files.length===d.files.length&&e.files.every($=>d.files.some(x=>x.name===$.name&&x.content===$.content)),open:s,clearMarker:b,destroy(){u=!1,w.destroy()}}}const Ft="py-path.v1",Ze={files:[{name:"main.py",content:`# 在这里写下你的 Python 程序
print("你好，Python！")
`}],active:"main.py",entry:"main.py",input:""};let M={},et=!1;try{M=JSON.parse(localStorage.getItem(Ft)??"{}")??{}}catch{et=!0}const h={drafts:M.drafts??{},attempts:M.attempts??{},solved:M.solved??{},mistakes:M.mistakes??{},progress:M.progress??{},workspace:M.workspace?.files?.length?M.workspace:Ze,projects:M.projects??{},examples:M.examples??{},exampleSelections:M.exampleSelections??{},questions:M.questions??{},submissions:M.submissions??{},runs:M.runs??{},problemInputs:M.problemInputs??{},taskWorkspaces:M.taskWorkspaces??{}};function V(){try{localStorage.setItem(Ft,JSON.stringify(h)),et=!1}catch{et=!0}const t=document.querySelector("#local-storage");t&&(t.textContent=et?"本地存储不可用或已满":"仅本地保存")}function Qe(t,e){const n=zt(t);h.submissions[t]={attempts:n.attempts+1,correct:n.correct+ +(e.verdict==="AC")},h.attempts[t]=[e,...h.attempts[t]??[]].slice(0,30),e.verdict==="AC"?(h.solved[t]=!0,delete h.mistakes[t]):h.mistakes[t]=!0,V()}function zt(t){const e=h.attempts[t]??[];return h.submissions[t]??{attempts:e.length,correct:e.filter(n=>n.verdict==="AC").length}}function tn(t,e,n){const c=h.questions[t];h.questions[t]={attempts:(c?.attempts??0)+1,correct:(c?.correct??0)+Number(n),lastChoice:e,solved:n||!!c?.solved},V()}function Bt(t,e,n,c){const{stdout:r,stderr:a,diagnostic:u,detail:g,artifacts:y}=e,l={...e,stdout:r.slice(0,4096),stderr:a.slice(0,4096),artifacts:y?.map(p=>({...p,content:p.content?.slice(0,4096)})),diagnostic:u?{...u,trace:u.trace.slice(0,4096)}:void 0,detail:g?.slice(0,4096)},v=n.files.reduce((p,w)=>p+w.content.length,0);h.runs[t]={report:l,sample:c,snapshot:u&&v<=8192?{...n,input:""}:void 0,truncated:[r,a,u?.trace,g,...y?.map(p=>p.content)??[]].some(p=>(p?.length??0)>4096)},V()}function Ut(t){h.runs[t]&&(delete h.runs[t],V())}function pt(t,e){(h.progress[t]??={})[e]=!0,V()}function Lt(t,e){return'<div class="comparison"><div><h4>期望输出</h4>'+_(t)+"</div><div><h4>实际输出</h4>"+_(e)+"</div></div>"}function Vt(t,e,n,c,i,r=!1,a=()=>{},u,g=!1){const y=k(t,"[data-console]");y.innerHTML=`
    <label class="input-label">标准输入<textarea rows="4" aria-label="标准输入" spellcheck="false"
      ${i?"":'aria-describedby="stdin-hint"'}></textarea></label>
    ${i?"":'<p class="console-hint muted" id="stdin-hint">运行前填好输入。每次 input() 读取一行，多行用回车分隔。</p>'}
    <div class="actions">
      <button class="button primary" type="button" data-run>运行</button>
      ${r?'<button class="button secondary" type="button" data-submit>提交评测</button>':""}
      <button class="button secondary" type="button" data-stop disabled>停止</button>
      <button class="button quiet" type="button" data-clear>清空</button>
    </div>
    <div class="result" aria-live="polite"><p class="muted">运行结果将在这里显示。</p></div>`;const l=k(y,"textarea"),v=k(y,".result"),p=k(y,"[data-run]"),w=k(y,"[data-stop]"),b=y.querySelector("[data-submit]"),E=Ye(k(t,"[data-editor]"),e,()=>{n(),$()},c,i,g);let s,m,d=!1;l.value=e.input,l.readOnly=i,l.addEventListener("input",()=>{e.input=l.value,n()}),w.addEventListener("click",()=>s?.abort()),k(y,"[data-clear]").addEventListener("click",()=>{m=void 0,E.clearMarker(),u&&Ut(u),v.innerHTML='<p class="muted">控制台已清空。</p>'});function $(){if(!m)return;const C=!E.unchanged(m),z=v.querySelector(".jump");z&&(z.disabled=C,k(v,".stale").hidden=!C)}function x(C,z,N){const R=z?.diagnostic,f=N?.files.find(L=>L.name===R?.file);m=R&&N,v.innerHTML=C+(R?He(R,f):""),v.querySelector(".jump")?.addEventListener("click",()=>{f&&N&&E.unchanged(N)&&(a(),E.open(f.name,R?.line))}),$()}async function S(C){if(!s){s=new AbortController,p.disabled=!0,b&&(b.disabled=!0),w.disabled=!1,m=void 0,E.clearMarker();try{await C(s.signal)}finally{s=void 0,p.disabled=!1,b&&(b.disabled=!1),w.disabled=!0}}}function A(C){d||(v.innerHTML='<p class="live">'+o(C)+"</p>")}return{input:l,run:p,submitButton:b,editor:E,act:S,pending:A,setResult:x,active:()=>!d,dispose(){d=!0,s?.abort(),E.destroy()}}}function Dt(t){return'<p class="muted saved-run">上次运行结果'+(t?" · 长输出仅保留开头":"")+"</p>"}function bt(t,e,n,{manage:c=!1,readOnly:i=!1,notify:r,resultKey:a,prewarm:u=!1}={}){const g=Vt(t,e,n,c,i,!1,void 0,a),y=a?h.runs[a]:void 0;y&&g.setResult(Dt(y.truncated)+rt(y.report),y.report,y.snapshot);let l;const v=u?document.createElement("span"):void 0;v&&(v.className="runtime-state muted",v.setAttribute("role","status"),g.run.parentElement.append(v),p());function p(){if(!v)return;v.textContent="正在提前准备解释器…";const w=Ot(b=>{l===w&&(b==="closed"&&(l=void 0),v.textContent=b==="ready"?"隔离解释器已就绪":"")});l=w}return g.run.addEventListener("click",()=>{g.act(async w=>{const b=g.editor.snapshot(g.input.value),E=l;l=void 0,v&&(v.textContent=""),g.pending("正在加载隔离解释器…");const s=await at(b,w,()=>g.pending("程序正在运行…"),E);g.active()&&(a&&Bt(a,s,b),g.setResult(rt(s),s,b),r?.(s),(s.status==="OK"||s.status==="RE")&&p())})}),()=>{g.dispose(),l?.dispose()}}const Kt=t=>Z.filter(e=>e.tag===P[t].tag);function Wt(t,e){return!!(h.questions[e.id]?.solved||e.legacy&&h.progress[t]?.[e.legacy])}function lt(t){const e=nt[P[t].tag],n=e?.exercises.filter(a=>a.kind==="question")??[],c=e?e.exercises.flatMap(a=>a.kind==="coding"&&!a.warmup?[a.problem]:[]):Kt(t).map(a=>a.id),i=c.map(a=>!!h.solved[a]);e?i.push(...n.map(a=>Wt(t,a))):i.push(!!h.progress[t]?.explain,!!h.progress[t]?.run);const r=[...c.map(zt),...n.flatMap(a=>h.questions[a.id]??[])];return{completed:i.filter(Boolean).length,total:i.length,attemptCount:r.reduce((a,u)=>a+u.attempts,0),correctCount:r.reduce((a,u)=>a+u.correct,0)}}function Ht(t,e){return e?Math.round(t/e*100)+"%":"暂无作答"}const en=["基础编程","综合应用","拓展挑战"],gt=(t,e="ul")=>"<"+e+">"+t.map(n=>"<li>"+o(n)+"</li>").join("")+"</"+e+">";function Gt(t){const e=t.diagnostic;return'<div class="comparison"><div><h4>输入</h4>'+_(t.input,"（无需输入）")+"</div><div><h4>预期输出</h4>"+_(t.output)+(e?"<p>预期异常 <code>"+o(e.kind)+"</code> · "+o(e.file)+" · 第 "+o(e.line)+" 行</p>":"")+"</div></div>"}function nn(t){return`
    <details class="study-example">
      <summary>${o(t.title)} · ${t.level}</summary>
      <p>${o(t.purpose)}</p>
      <h4>完整代码</h4>${_(t.source)}
      ${(t.files??[]).map(e=>"<h4>"+o(e.name)+"</h4>"+_(e.content)).join("")}
      ${Gt(t)}
      <h4>执行过程</h4>${gt(t.steps,"ol")}
      <h4>常见误写</h4><p>${o(t.pitfall)}</p>
      <button type="button" class="button secondary" data-open-example="${o(t.id)}">载入示例编辑器</button>
    </details>`}function sn(t,e){const c=h.questions[e.id]?.lastChoice,i=Wt(t,e);return`
    <fieldset class="quiz chapter-quiz" id="${o(e.id)}" tabindex="-1">
      <legend>${o(e.prompt)}</legend>
      <p class="muted">${o(e.goal)}</p>
      ${e.demonstration?_(e.demonstration.source):""}
      <div class="quiz-options">${e.options.map((r,a)=>'<button type="button" class="button secondary" data-choice="'+a+'" aria-pressed="'+(c===a)+'">'+o(r.label)+"</button>").join("")}</div>
      <p class="quiz-feedback" role="status">${c===void 0?i?"已完成知识检查。":"":o((c===e.answer?"回答正确。":"再想一想。")+e.options[c]?.feedback)}</p>
    </fieldset>`}function St(t){return{files:[{name:"main.py",content:t.source},...(t.files??[]).map(e=>({...e}))],active:"main.py",entry:"main.py",input:t.input}}function an(t,e,n,c){const i=_t(n),r=n.exercises.filter(s=>s.kind==="question"),a=n.exercises.filter(s=>s.kind==="coding"),u=a.filter(s=>s.warmup),g=s=>s.map(m=>{const d=Z.find(x=>x.id===m.problem),$=m.starterExample?"/modify":"";return`<li><div><a class="inline-link" href="#problem/${d.id}${$}">${d.id} ${o(d.title)} →</a>
      <p>${o(m.goal)}</p></div>
      <span class="tag">${h.solved[d.id]?"已通过":h.mistakes[d.id]?"待重做":d.difficulty}</span></li>`}).join("");t.innerHTML=`
    <section class="surface lesson-stage chapter-overview"><div class="section-heading">
      <h2>学习目标</h2><span class="tag" data-lesson-completed></span></div>
      ${gt(n.goals)}
      <h3>前置知识</h3><p>${o(n.prerequisites)}</p>
      <p class="muted">${o(n.version)}</p>
      <p class="muted" data-lesson-accuracy></p>
      <div class="chapter-jumps" aria-label="跳至本课内容">
        <button type="button" class="button quiet" data-chapter-jump="chapter-theory">讲解</button>
        <button type="button" class="button quiet" data-chapter-jump="example-workspace-title">示例编辑器</button>
        <button type="button" class="button quiet" data-chapter-jump="chapter-practice">分层练习</button>
        <button type="button" class="button quiet" data-chapter-jump="chapter-mistakes">常见错误与总结</button>
      </div>
    </section>
    <section class="surface lesson-stage chapter-theory"><h2 id="chapter-theory" tabindex="-1"><span>1</span>讲解</h2>
      ${n.topics.map(s=>`<article class="chapter-topic"><h3>${o(s.title)}</h3>
        ${s.explanation.map(m=>"<p>"+o(m)+"</p>").join("")}
        <div class="study-examples">${s.examples.map(nn).join("")}</div>
      </article>`).join("")}
    </section>
    <section class="surface lesson-stage chapter-editor">
      <h2 id="example-workspace-title" tabindex="-1"><span>2</span>运行与修改示例</h2>
      <div class="example-controls">
        <label>选择示例<select aria-label="选择示例">${i.map(s=>'<option value="'+o(s.id)+'">'+o(s.title)+"</option>").join("")}</select></label>
        <button type="button" class="button secondary" data-reset-example>恢复原始示例</button>
      </div>
      <details class="example-expected"><summary>查看原始示例输入与预期结果</summary><div data-expected></div></details>
      <div data-example-workspace><div data-editor></div><div data-console></div></div>
    </section>
    <section class="surface lesson-stage chapter-practice"><h2 id="chapter-practice" tabindex="-1"><span>3</span>分层练习</h2><h3>基础理解</h3>
      ${r.map(s=>sn(e,s)).join("")}
      ${u.length?'<div class="practice-level"><h3>热身（选做）</h3><ul class="practice-list">'+g(u)+"</ul></div>":""}
      ${en.map(s=>`<div class="practice-level"><h3>${s}</h3><ul class="practice-list">
        ${g(a.filter(m=>m.level===s&&!m.warmup))}</ul></div>`).join("")}
    </section>
    <section class="surface lesson-stage chapter-mistakes"><h2 id="chapter-mistakes" tabindex="-1"><span>4</span>常见错误与总结</h2>
      ${n.mistakes.map(s=>`
        <details><summary>${o(s.symptom)}</summary>
          <dl><dt>原因</dt><dd>${o(s.reason)}</dd><dt>正确做法</dt><dd>${o(s.fix)}</dd>
            <dt>排查方法</dt><dd>${o(s.check)}</dd></dl>
        </details>`).join("")}
      <h3>知识总结</h3>${gt(n.summary)}<p>${o(n.next)}</p>
      <details><summary>参考资料</summary><ul class="reading-list">${n.references.map(s=>`
        <li>${o(s.note)} <a class="inline-link" href="${o(s.url)}" target="_blank" rel="noopener noreferrer">${o(s.title)} ↗</a></li>`).join("")}</ul></details>
    </section>
    <div class="lesson-next">
      ${e?'<a class="button secondary" href="#learn/'+e+'">← 上一课</a>':""}
      ${e<P.length-1?'<a class="button secondary" href="#learn/'+(e+2)+'">下一课 →</a>':'<a class="button secondary" href="#learn">查看综合项目 →</a><a class="button secondary" href="#bank/independent">章外练习 →</a><a class="button primary" href="#project/ledger">开始结项任务 →</a>'}
    </div>`;const y=k(t,".example-controls select"),l=k(t,"[data-example-workspace]"),v=k(t,"#example-workspace-title"),p=String(e+1);let w=()=>{};function b(s){w();const m="example:"+p+":"+s.id,d=h.examples[m]??=St(s);y.value=s.id,h.exampleSelections[p]!==s.id&&(h.exampleSelections[p]=s.id,V()),k(t,"[data-expected]").innerHTML=Gt(s);const $=k(t,"[data-reset-example]");$.onclick=()=>{confirm("恢复这份示例的代码和输入，并清除它的运行结果？")&&(h.examples[m]=St(s),Ut(m),V(),b(s))},w=bt(l,d,V,{resultKey:m})}function E(){const s=lt(e);k(t,"[data-lesson-completed]").textContent="已完成 "+s.completed+" / "+s.total+" 练习",k(t,"[data-lesson-accuracy]").textContent="作答正确率 "+Ht(s.correctCount,s.attemptCount)+" · 已记录 "+s.attemptCount+" 次作答"}y.addEventListener("change",()=>{const s=i.find(m=>m.id===y.value);s&&b(s)});for(const s of t.querySelectorAll("[data-chapter-jump]"))s.addEventListener("click",()=>{const m=k(t,"#"+s.dataset.chapterJump);m.focus(),m.scrollIntoView({block:"start"})});for(const s of t.querySelectorAll("[data-open-example]"))s.addEventListener("click",()=>{const m=i.find(d=>d.id===s.dataset.openExample);m&&(y.value!==m.id&&b(m),v.focus(),v.scrollIntoView({block:"start"}))});for(const s of r){const m=k(t,"#"+s.id),d=Array.from(m.querySelectorAll("[data-choice]")),$=k(m,".quiz-feedback");d.forEach((x,S)=>x.addEventListener("click",()=>{const A=S===s.answer;tn(s.id,S,A),d.forEach(C=>C.setAttribute("aria-pressed",String(C===x))),$.textContent=(A?"回答正确。":"再想一想。")+s.options[S].feedback,E()}))}return b(i.find(s=>s.id===h.exampleSelections[p])??i[0]),E(),r.some(s=>s.id===c)&&requestAnimationFrame(()=>{const s=k(t,"#"+c);s.isConnected&&(s.focus(),s.scrollIntoView({block:"start"}))}),()=>w()}async function At(t,e,n,c,i,r=!0){const a=t.contract;if(!a)return at(e,c,i);const u=a.files?.find(b=>!e.files.some(E=>E.name===b));if(u)return{status:"OK",stdout:"",stderr:"",assessmentIssue:(a.kind==="module"?"模块":"提交文件")+"缺少 "+u+"。"};const g=n?.fixtures??[],y=n?.artifacts??[],l=e.files.filter(b=>![...g,...y].some(E=>E.name===b.name)),v={...e,files:[...l,...g],entry:"main.py"};if(a.target&&n?.calls){const b=a.kind==="module"?"模块接口":"函数接口",E={...a.target,args:n.calls.map(d=>d.args)},s=await at({...v,input:"",inspection:{call:E}},c,i);if(s.inputRead)return{...s,assessmentIssue:b+"在导入或调用时读取了标准输入。"};if(s.status!=="OK")return s.status==="RE"?{...s,assessmentIssue:b+"导入或调用时发生异常。"}:s;if(s.stdout||s.stderr)return{...s,assessmentIssue:b+"在导入或调用时产生了额外输出。请通过 return 交回结果。"};const m=n.calls.findIndex((d,$)=>s.values?.[$]!==d.expected);if(m>=0){const d=s.values?.[m]===null?"返回了 None。":"返回值与约定不符。";return{...s,assessmentIssue:b+"第 "+(m+1)+" 次调用"+d}}if(a.kind==="function")return s}const p=y.length?{artifacts:y.map(b=>b.name)}:void 0,w=await at({...v,inspection:p},c,i);if(w.status!=="OK")return w;for(const b of y){const E=w.artifacts?.find(m=>m.name===b.name),s="文件产物 "+b.name+" ";if(E?.content===void 0)return{...w,assessmentIssue:s+(E?.error??"未生成。")};if(r&&E.content!==b.content){const m=Rt(b.content,E.content);return{...w,assessmentIssue:s+"内容不一致。"+(m??"请检查文件的结束换行。")}}}return w}const ct=t=>h.solved[t.id]?"已通过":h.attempts[t.id]?.length?"已尝试":"未开始",Jt=t=>["easy","basic","advanced"][["入门","基础","进阶"].indexOf(t)],on=t=>'<a class="table-link" href="#problem/'+t.id+'">'+o(t.title)+"</a>",vt=t=>t.origin?.kind==="adapted"?"经典改编":"原创";function rn(t){const e=t.origin;return e?.kind!=="adapted"?"":`<details class="problem-source"><summary>查看原题出处</summary>
    <p>${o(e.platform)} · ${o(e.id)} · ${o(e.level)}</p>
    <p>${o(e.concepts.join("、"))}</p><p>${o(e.adaptation)}</p>
    <p>本站题面、用例和参考解独立撰写。原题链接供查阅，原站材料按原站权利与条款使用。</p>
    <a class="inline-link" href="${o(e.url)}" target="_blank" rel="noopener noreferrer">${o(e.title)} ↗</a></details>`}function cn(t){const e=t.guide;return e?`
    <div class="solution-guide">
      <h3>解题思路与算法选择</h3><p>${o(e.approach)}</p>
      <h3>考查知识点</h3><p>${o(e.concepts.join("、"))}</p>
      <h3>参考代码</h3>${_(t.solution)}
      ${(t.solutionFiles??[]).map(n=>"<h4>"+o(n.name)+"</h4>"+_(n.content)).join("")}
      <h3>代码逐步解释</h3><ol>${e.steps.map(n=>"<li>"+o(n)+"</li>").join("")}</ol>
      <dl><dt>时间复杂度</dt><dd>${o(e.time)}</dd><dt>空间复杂度</dt><dd>${o(e.space)}</dd></dl>
      <h3>容易出现的错误</h3><p>${o(e.pitfall)}</p>
      <h3>拓展问题</h3><p>${o(e.extension)}</p>
    </div>`:_(t.solution)}function Xt(t,e,n,c){const[i,r,a,u]=t.sample,g=P.findIndex(f=>f.tag===t.tag),y=P[g],l=(c?"project:":"problem:")+t.id;n.innerHTML=`
    <div class="problem-crumbs"><a class="inline-link" href="${c?"#learn":t.practice?"#bank/independent":"#bank"}">← ${c?"学习路径":"题库"}</a><a class="inline-link" href="#learn/${g+1}">${c?"回顾综合应用":"本题所属课程"}</a></div>
    <div class="problem-heading"><h1>${c?"":"<code>"+o(t.id)+"</code> "}${o(t.title)}</h1>
      <span class="difficulty ${Jt(t.difficulty)}">${t.difficulty}</span><span class="tag">${t.tag}</span>
      <span class="tag">${vt(t)}</span><span class="tag" id="personal">${ct(t)}</span></div>
    <div class="panel-switch" aria-label="做题区域">${["题面","代码","评测"].map((f,L)=>'<button class="button secondary" type="button" data-pane="'+L+'" aria-pressed="'+(L===0)+'">'+f+"</button>").join("")}</div>
    <div class="problem-layout" data-active="0">
      <article class="surface problem-panel statement" data-area="0" aria-label="题面">
        ${t.background?"<h2>题目背景</h2><p>"+o(t.background)+"</p>":""}
        <h2>题目描述</h2><p>${o(t.description)}</p>
        ${t.practice?"<h3>章外练习 · "+o(t.practice.tier)+"</h3><p>先修 "+o(t.practice.prerequisites)+"</p><p>主要知识 "+o(t.practice.primary.join("、"))+"。次要知识 "+o(t.practice.secondary.join("、"))+"。</p>":""}
        <h2>输入格式</h2><p>${o(t.input)}</p>
        <h2>输出格式</h2><p>${o(t.output)}</p>
        ${t.outputComparison==="exact"?"<p>本题精确比较文本。LF、CRLF 和 CR 视为同一种换行，保留行首、行内和行尾空白以及空行。最后一行的结束换行可省略。</p>":""}
        <div class="section-heading"><h2>样例</h2><button class="button secondary" type="button" id="sample-run">试跑样例</button></div>
        <div class="comparison samples">
          <div><div class="section-heading"><h3>样例输入</h3><button class="link-button" type="button" id="copy-input">复制输入</button></div>${_(i)}</div>
          <div><div class="section-heading"><h3>样例输出</h3><button class="link-button" type="button" id="copy-output">复制输出</button></div>${_(r)}</div>
        </div>
        <h2>样例解释</h2><p>${o(a)}</p>
        ${u?.calls?"<h3>样例调用与返回值</h3>"+_(u.calls.map(f=>t.contract?.target?.name+"("+f.args.map(L=>JSON.stringify(L)).join(", ")+") → "+JSON.stringify(f.expected)).join(`
`)):""}
        ${(u?.fixtures??[]).map(f=>"<h3>样例输入文件 "+o(f.name)+"</h3>"+_(f.content)).join("")}
        ${(u?.artifacts??[]).map(f=>"<h3>样例产物 "+o(f.name)+"</h3>"+_(f.content)).join("")}
        <h2>数据范围</h2><p>${o(t.limits)}</p>
        ${rn(t)}
        <details><summary>提示 1 · 思路</summary><p>${o(t.hints[0])}</p></details>
        <details><summary>提示 2 · 实现</summary><p>${o(t.hints[1])}</p></details>
        <details><summary>查看参考解法</summary>${cn(t)}</details>
      </article>
      <section class="surface problem-panel" data-area="1"><h2>代码编辑器</h2><div data-editor></div></section>
      <section class="surface problem-panel evaluation" data-area="2"><h2>运行与评测</h2>
        <div data-console></div>
        <details class="history"><summary>评测记录</summary><div id="attempts"></div></details>
      </section>
    </div>`;const v=nt[t.tag],p=v?.exercises.find(f=>f.kind==="coding"&&f.problem===t.id),w=v&&p?.kind==="coding"?_t(v).find(f=>f.id===p.starterExample)?.source:void 0,b=e?w??(y.exampleFiles?`import math

# 按题意调整模块调用和输入输出
`:y.example):`# 在此编写解法
`,E=t.starterFiles??(t.contract?[{name:"main.py",content:b}]:void 0),s=c??(E?h.taskWorkspaces[t.id]??={files:E.map(f=>({...f})),active:"main.py",entry:"main.py",input:i}:{files:[{name:"main.py",content:h.drafts[t.id]??b}],active:"main.py",entry:"main.py",input:h.problemInputs[t.id]??i}),m=k(n,".problem-layout");function d(f){m.dataset.active=String(f);for(const L of n.querySelectorAll("[data-pane]"))L.setAttribute("aria-pressed",String(L.getAttribute("data-pane")===String(f)))}for(const f of n.querySelectorAll("[data-pane]"))f.addEventListener("click",()=>d(Number(f.dataset.pane)));function $(){!E&&!c&&(h.drafts[t.id]=s.files[0].content,h.problemInputs[t.id]=s.input),V()}const x=Vt(n,s,$,t.contract?.kind==="module",!1,!0,()=>d(1),l,!0);function S(){const f=h.attempts[t.id]??[];k(n,"#personal").textContent=ct(t),k(n,"#attempts").innerHTML=f.length?'<ul class="attempt-list">'+f.map(L=>"<li>"+tt(L.verdict)+"<span>"+L.passed+" / "+L.total+" 组</span><time>"+o(new Date(L.date).toLocaleString("zh-CN",{hour12:!1}))+"</time></li>").join("")+"</ul>":'<p class="muted">还没有提交记录。</p>'}S();const A=(f,L)=>ot(f,t.outputComparison)===ot(L,t.outputComparison);function C(f,L){if(t.outputComparison!=="exact")return"";const F=Rt(f,L);return F?'<p class="muted">'+o(F)+"</p>":""}function z(f,L,F,B=""){const K=["OK","RE","TLE","OLE"].includes(f.status),W=A(r,f.stdout),st=f.status!=="OK"||!!f.assessmentIssue||!W,H=L&&K?st?tt(f.status==="OK"?"WA":f.status)+(f.status==="OK"?C(r,f.stdout):"")+(W&&f.assessmentIssue?"":Lt(r,f.stdout)):'<p class="passed">'+(t.contract?"样例契约通过":"样例输出一致")+"</p>":"";x.setResult(B+H+rt(f),f,F)}const N=h.runs[l];N&&z(N.report,!!N.sample&&!N.truncated,N.snapshot,Dt(N.truncated));async function R(){await x.act(async f=>{d(2);const L=x.editor.snapshot(x.input.value);x.pending("正在加载隔离解释器…");const F=L.input===i,B=await At(t,L,u,f,()=>x.pending("程序正在运行…"),F);x.active()&&(Bt(l,B,L,F),z(B,F,L))})}return x.run.addEventListener("click",()=>{R()}),k(n,"#sample-run").addEventListener("click",()=>{x.run.disabled||(x.input.value=i,s.input=i,$(),R())}),k(n,"#copy-input").onclick=f=>{xt(f.currentTarget,i)},k(n,"#copy-output").onclick=f=>{xt(f.currentTarget,r)},x.submitButton.addEventListener("click",()=>{x.act(async f=>{d(2),$();const L=[[i,r,u],...t.cases],F=x.editor.snapshot("");let B=0,K="AC",W,st="",H="";for(const[ne,wt,se]of L){x.pending("正在评测第 "+(B+1)+" / "+L.length+" 组…");const O=await At(t,{...F,input:ne},se,f);if(!x.active())return;if(O.status==="STOP"||O.status==="UNAVAILABLE"||O.status==="INVALID"){x.setResult(rt(O));return}if(O.status!=="OK"||O.assessmentIssue||!A(wt,O.stdout)){K=O.status==="OK"?"WA":O.status,B||(W=O),O.assessmentIssue?H=O.assessmentIssue:K==="WA"?(st=C(wt,O.stdout),t.contract&&(H="标准输出与题面约定不符。")):O.diagnostic&&(t.contract||E)&&(H="运行异常 · "+O.diagnostic.kind);break}B++}Qe(t.id,{date:Date.now(),verdict:K,passed:B,total:L.length}),S(),x.setResult('<div class="result-heading">'+tt(K)+"<span>通过 "+B+" / "+L.length+" 组</span></div>"+(K==="AC"?'<p class="passed">全部用例通过，已更新完成状态。</p>':'<p class="muted">'+(W?"样例未通过。":"非样例用例未通过。")+o(ft[K])+"</p>")+(H?'<p class="muted">'+o(H)+"</p>":"")+st+(W&&!W.assessmentIssue?Lt(r,W.stdout):"")+(K==="WA"&&t.guide?'<p class="muted">'+o(t.guide.pitfall)+"</p>":""),W,F)})}),x.dispose}const Yt="py-path.appearance.v1";function ln(){try{return localStorage.getItem(Yt)==="light"?"light":"dark"}catch{return"dark"}}let X=ln();function Zt(){const t=document.documentElement;t.dataset.theme=X;const e=getComputedStyle(t).getPropertyValue("--page").trim();e&&document.querySelector('meta[name="theme-color"]')?.setAttribute("content",e)}Zt();function dn(t){const e=t.querySelector(".theme-label"),n=()=>{t.setAttribute("aria-pressed",String(X==="light")),e.textContent=X==="light"?"浅色":"深色"};n(),t.addEventListener("click",()=>{X=X==="dark"?"light":"dark",Zt(),n();try{localStorage.setItem(Yt,X)}catch{}})}const Q=k(document,"#app");let G=()=>{};const Qt=[["learn","从零开始","按章节读懂示例，动手改写，再独立解题。","12 节课程","green","▤"],["bank","题库练习","查找练习题，运行样例并提交评测。",Z.length+" 道题","blue","⌘"],["review","专项复习","速查知识点和典型错误，重做错题。","12 个知识点","purple","↺"],["lab","在线工作台","在浏览器编辑并运行多文件 Python。","多文件编辑","orange","›_"]];function j(t,e,n="button"){return'<a class="'+n+'" href="#'+t+'">'+e+"</a>"}function D(t,e){const n=t==="problem"?"bank":t==="project"?"learn":t;return Q.innerHTML=`
    <a href="#main-content" class="skip">跳过导航</a>
    <header class="site-header"><div class="site-width header-inner">
      <a class="brand" href="#home" aria-label="Py径首页"><span class="brand-icon" aria-hidden="true">›_</span><strong>Py径</strong></a>
      <nav aria-label="主导航">${Qt.map(([c,i])=>'<a href="#'+c+'"'+(n===c?' aria-current="page"':"")+">"+i+"</a>").join("")}</nav>
      <div class="header-tools">
        <span class="local-state" id="local-storage">${et?"本地存储不可用或已满":"仅本地保存"}</span>
        <button type="button" class="theme-toggle" aria-label="浅色主题"><span class="theme-icon" aria-hidden="true"></span><span class="theme-label" aria-hidden="true"></span></button>
      </div>
    </div></header>
    <main id="main-content" class="site-width main-content" data-page="${t}" tabindex="-1">${e}</main>
    <footer class="site-width footer"><a href="#home">Py径</a><span>简体中文 Python 学习平台</span></footer>`,k(Q,".skip").addEventListener("click",c=>{c.preventDefault(),k(Q,"main").focus()}),dn(k(Q,".theme-toggle")),k(Q,"main")}const J=(t,e)=>'<div class="page-heading"><h1>'+o(t)+"</h1><p>"+o(e)+"</p></div>";function pn(){return'<div class="project-grid">'+yt.map(t=>`
    <a class="surface project-card" href="#project/${t.id}">
      <span class="tag">${o(t.tags)}${t.assessment&&h.solved[t.id]?" · 已通过":""}</span><h3>${o(t.title)}</h3>
      <p>${o(t.description)}</p><span class="card-arrow" aria-hidden="true">↗</span>
    </a>`).join("")+"</div>"}const te=()=>'<section class="home-section"><div class="section-heading"><h2>综合项目</h2></div>'+pn()+"</section>";function un(){const t=new URL(""+new URL("python-logo-only-Bt12VGEE.png",import.meta.url).href,import.meta.url).href,e=P.map((r,a)=>lt(a)),n=e.filter(r=>r.completed===r.total).length,c=e.findIndex(r=>r.completed<r.total),i="learn/"+((c<0?0:c)+1);D("home",`
    <section class="hero">
      <div class="hero-copy">
        <div class="hero-label"><span></span> 中文 Python 学习实验室</div>
        <h1>从第一行代码，<br>到<span>独立解题。</span></h1>
        <p>跟着课程读懂代码、动手运行，再用题目检验掌握程度。已有基础也可以直接刷题，随时回顾错题。</p>
        <div class="hero-actions">${j(i,c>0?"继续学习　→":"开始第一课　→","button primary")}${j("bank","浏览题库","button secondary")}</div>
      </div>
      <div class="hero-visual" aria-label="Python 示例，计算代码练习次数">
        <div class="preview-window">
          <div class="preview-bar"><span class="window-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>first_steps.py</span><span class="small-tag">Python</span></div>
          <div class="preview-editor">
            <div><b>1</b><span class="code-comment"># 记录今天的练习</span></div>
            <div><b>2</b>practice = [<em>2</em>, <em>3</em>, <em>4</em>]</div>
            <div><b>3</b>total = <em>0</em></div>
            <div><b>4</b><strong>for</strong> count <strong>in</strong> practice:</div>
            <div><b>5</b>&nbsp;&nbsp;&nbsp;&nbsp;total += count</div>
            <div><b>6</b><samp>print</samp>(<span class="code-string">f"已练习 {total} 道题"</span>)</div>
          </div>
          <div class="preview-output">
            <span><i></i> 标准输出</span><code>›　已练习 9 道题</code>
            <span class="preview-language" aria-hidden="true">
              <img src="${o(t)}" width="269" height="326" alt=""><sup>™</sup>
            </span>
          </div>
        </div>
      </div>
    </section>
    <section class="home-section">
      <div class="section-heading"><h2>选择你的学习方式</h2></div>
      <div class="entry-grid">${Qt.map(([r,a,u,g,y,l])=>`
        <a class="surface entry-card ${y}" href="#${r}">
          <span class="entry-icon" aria-hidden="true">${l}</span><span class="card-arrow" aria-hidden="true">↗</span>
          <h3>${a}</h3><p>${u}</p><span class="entry-metric">${g}</span>
        </a>`).join("")}</div>
    </section>
    <section class="home-section">
      <div class="section-heading"><h2>学习路径</h2>${j("learn","查看完整路线 →","inline-link")}</div>
      <div class="surface track-panel">
        <div><strong>课程进度</strong><p class="muted">已完成 ${n} / ${P.length} 节</p></div>
        <progress max="${P.length}" value="${n}" aria-label="课程进度"></progress>
        ${j(i,n===12?"回顾课程":"进入下一课","button secondary")}
      </div>
    </section>${te()}`)}function mn(){const t=P.map((i,r)=>lt(r)),e=t.filter(i=>i.completed===i.total).length,n=t.reduce((i,r)=>i+r.completed,0),c=t.reduce((i,r)=>i+r.total,0);D("learn",J("从零开始","从标准输入输出到综合解题。按路线前进，或直接进入感兴趣的章节。")+'<p class="learning-overview muted">已完成 '+e+" / "+P.length+" 节课 · 已完成 "+n+" / "+c+' 个学习检查与练习</p><div class="lesson-grid">'+P.map((i,r)=>`
      <a class="surface lesson-card" href="#learn/${r+1}"><span class="lesson-number">${String(r+1).padStart(2,"0")}</span>
        <div><span class="muted">${i.tag}</span><h2>${i.title}</h2></div>
        <span class="tag">${t[r].completed} / ${t[r].total}</span></a>`).join("")+"</div>"+te())}function Ct(t){return`<aside class="surface lesson-aside"><h2>课程目录</h2>${P.map((e,n)=>`
    <a href="#learn/${n+1}" ${n===t?'aria-current="page"':""}>
      <span>${String(n+1).padStart(2,"0")}</span>${e.title}</a>`).join("")}</aside>`}function fn(t,e){const n=P[t],c=nt[n.tag];if(c){const l=D("learn",j("learn","← 学习路径","inline-link")+J("第 "+(t+1)+" 课 · "+n.title,n.tag)+'<div class="lesson-layout">'+Ct(t)+'<div class="lesson-body" data-chapter></div></div>');G=an(k(l,"[data-chapter]"),t,c,e);return}const[i,r]=Kt(t),a=(l,v)=>`
    <fieldset class="quiz" data-quiz="${l}"><legend>${o(n[l].question)}</legend>
      ${n[l].choices.map((p,w)=>'<button type="button" class="button secondary" data-answer="'+w+'">'+o(p)+"</button>").join("")}
      <p class="quiz-feedback" role="status">${v?"已通过知识检查。":""}</p></fieldset>`,u=D("learn",j("learn","← 学习路径","inline-link")+J("第 "+(t+1)+" 课 · "+n.title,n.tag)+`
    <div class="lesson-layout">
      ${Ct(t)}
      <div class="lesson-body">
        <section class="surface lesson-stage"><h2><span>1</span>讲解</h2><p>${o(n.theory)}</p>
          ${a("check",!!h.progress[t]?.explain)}</section>
        <section class="surface lesson-stage"><h2><span>2</span>运行示例</h2>
          <p>先完成下面的新情境预测，再运行示例，观察程序如何处理输入。</p>
          ${a("predict",!!h.progress[t]?.predict)}
          <div data-editor></div><div data-console></div></section>
        <section class="surface lesson-stage"><h2><span>3</span>修改示例</h2>
          <p>以本课示例为起点，按新题目调整输入、逻辑和输出。${o(i.description)}</p>
          ${j("problem/"+i.id+"/modify",(h.solved[i.id]?"已通过 · ":"")+i.id+" "+i.title+" →","button secondary")}</section>
        <section class="surface lesson-stage"><h2><span>4</span>独立练习</h2><p>${o(r.description)}</p>
          ${j("problem/"+r.id,(h.solved[r.id]?"已通过 · ":"")+r.id+" "+r.title+" →","button secondary")}</section>
        <div class="lesson-next">${t?j("learn/"+t,"← 上一课","button secondary"):""}
          ${t<P.length-1?j("learn/"+(t+2),"下一课 →","button secondary"):j("learn","查看综合项目 →","button secondary")}</div>
      </div>
    </div>`),g={files:[{name:"main.py",content:n.example},...(n.exampleFiles??[]).map(l=>({...l}))],active:"main.py",entry:"main.py",input:n.input},y=()=>{h.progress[t]?.example&&h.progress[t]?.predict&&pt(t,"run")};for(const l of["check","predict"]){const v=k(u,'[data-quiz="'+l+'"]');v.addEventListener("click",p=>{const w=p.target.closest("[data-answer]");if(!w)return;const b=Number(w.dataset.answer)===n[l].answer;k(v,".quiz-feedback").textContent=(b?"回答正确。":"再想一想。")+n[l].feedback,b&&(pt(t,l==="predict"?"predict":"explain"),y())})}G=bt(u,g,()=>{},{readOnly:!0,notify(l){l.status==="OK"&&(pt(t,"example"),y())}})}function It(t="",e=""){const n=D("bank",J("题库练习","运行可自行测试，提交评测后记录学习结果。")+`
    <div class="hero-actions">${j("bank/independent","章外练习","button secondary")}
      ${ut.map(l=>j("bank/independent/"+encodeURIComponent(l),l,"button secondary")).join("")}</div>
    <section class="surface bank-panel">
      <div class="filters">
        <label>搜索题目<input type="search" id="search" placeholder="题号、标题或知识点"></label>
        <label>练习范围<select id="scope"><option value="">全部练习</option><option value="chapter">章内</option>
          <option value="independent">全部章外</option>${ut.map(l=>"<option>"+l+"</option>").join("")}</select></label>
        <label>知识点<select id="tag"><option value="">全部知识点</option>${P.map(l=>"<option>"+l.tag+"</option>").join("")}</select></label>
        <label>难度<select id="difficulty"><option value="">全部难度</option><option>入门</option><option>基础</option><option>进阶</option></select></label>
        <label>来源<select id="origin"><option value="">全部来源</option><option>原创</option><option>经典改编</option></select></label>
        <label>完成状态<select id="completion"><option value="">全部状态</option><option>未开始</option><option>已尝试</option><option>已通过</option><option>待重做</option></select></label>
      </div><p id="match-count" class="muted count" role="status"></p><div id="matches"></div>
    </section>`),c=k(n,"#search"),i=k(n,"#scope"),r=k(n,"#tag"),a=k(n,"#difficulty"),u=k(n,"#origin"),g=k(n,"#completion");r.value=P.some(l=>l.tag===t)?t:"",i.value=e;function y(){const l=c.value.trim().toLowerCase(),v=Z.filter(p=>[p.id,p.title,p.tag,...p.origin?.kind==="adapted"?[p.origin.title,p.origin.platform,p.origin.id]:[]].join(" ").toLowerCase().includes(l)&&(!i.value||(i.value==="chapter"?!p.practice:i.value==="independent"?!!p.practice:i.value===p.practice?.tier))&&(!r.value||p.tag===r.value)&&(!a.value||p.difficulty===a.value)&&(!u.value||vt(p)===u.value)&&(!g.value||(g.value==="待重做"?h.mistakes[p.id]:ct(p)===g.value)));k(n,"#match-count").textContent="共 "+v.length+" 道题",k(n,"#matches").innerHTML=v.length?`
      <div class="table-scroll"><table role="table"><thead role="rowgroup"><tr role="row"><th scope="col">题号</th><th scope="col">标题</th><th scope="col">难度</th><th scope="col">知识点</th><th scope="col">来源</th><th scope="col">完成状态</th></tr></thead>
      <tbody role="rowgroup">${v.map(p=>`<tr role="row"><td role="cell"><code>${p.id}</code></td><td role="cell">${on(p)}</td>
        <td role="cell"><span class="difficulty ${Jt(p.difficulty)}">${p.difficulty}</span></td>
        <td role="cell"><span class="tag">${p.tag}</span>${p.practice?' <span class="tag">'+o(p.practice.tier)+"</span>":""}</td><td role="cell">${vt(p)}</td>
        <td role="cell" class="${h.solved[p.id]?"passed":"muted"}">${ct(p)}</td></tr>`).join("")}</tbody></table></div>`:'<p class="empty">当前没有符合条件的题目。</p>'}k(n,".filters").addEventListener("input",y),y()}function hn(){const t=yt.flatMap(i=>i.assessment??[]),e=[...Z,...t].filter(i=>h.mistakes[i.id]),n=P.flatMap((i,r)=>(nt[i.tag]?.exercises??[]).flatMap(a=>a.kind==="question"&&h.questions[a.id]&&h.questions[a.id].lastChoice!==a.answer?[{exercise:a,index:r,tag:i.tag}]:[])),c=e.length+n.length;D("review",J("专项复习","回顾自己卡住的知识点，并用错题验证修正。")+`
    <section class="surface bank-panel"><div class="section-heading"><h2>错题重做</h2><span class="tag">${c} 道待重做</span></div>
      ${c?'<div class="wrong-list">'+e.map(i=>`
        <div><code>${i.id}</code><strong>${i.title}</strong><span class="tag">${i.tag}</span>
          ${tt(h.attempts[i.id][0].verdict)}${t.includes(i)?j("project/"+i.id,"重做结项","button secondary"):j("problem/"+i.id,"重做 "+i.id,"button secondary")}</div>`).join("")+n.map(({exercise:i,index:r,tag:a})=>`<div><span class="tag">${o(a)}</span><strong>${o(i.goal)}</strong>
          ${j("learn/"+(r+1)+"/"+i.id,"重做知识题","button secondary")}</div>`).join("")+"</div>":'<p class="empty">暂无待重做的题目。答错知识题或提交评测遇到错误后，可从这里继续练习。</p>'}</section>
    <section class="home-section"><div class="section-heading"><h2>知识点速查</h2></div>
      <p class="muted learning-overview">正确率根据已记录的知识题答案和编程提交计算。</p>
      <div class="review-grid">${P.map((i,r)=>{const a=lt(r),u=nt[i.tag];return`<article class="surface review-card">
        <h3>${i.tag}</h3><p class="topic-progress">${a.completed} / ${a.total} 已完成 · 正确率 ${Ht(a.correctCount,a.attemptCount)}</p>
        <p>${o(u?.summary[0]??i.theory)}</p><h4>典型错误</h4><p>${o(u?.mistakes[0].fix??i.mistake)}</p>
        <div>${j("learn/"+(r+1),"复习课程","inline-link")}${j("bank/"+encodeURIComponent(i.tag),"专项练习 →","inline-link")}</div>
      </article>`}).join("")}</div></section>`)}function Tt(t){if(t?.assessment){const c=h.projects[t.id]??={files:t.files.map(i=>({...i})),active:"main.py",entry:"main.py",input:t.input};G=Xt(t.assessment,!1,D("project",""),c);return}const e=D(t?"project":"lab",(t?j("learn","← 学习路径","inline-link"):"")+J(t?.title??"在线工作台",t?.description??"编辑多个文件，准备标准输入，在浏览器里运行 Python。")+(t?`
      <section class="surface project-brief"><h2>项目任务</h2><ol>${t.steps.map(c=>"<li>"+o(c)+"</li>").join("")}</ol>
        <details open><summary>验收样例与边界</summary>
          <div class="comparison"><div><h4>标准输入</h4>${_(t.input)}</div>
            <div><h4>期望输出</h4>${_(t.expected)}</div></div>
          <p>${o(t.acceptance)}</p></details>
        <details><summary>查看参考实现</summary>${_(t.solution)}</details></section>`:"")+`
    <div class="workbench-layout">
      <section class="surface problem-panel"><h2>工作区文件</h2><div data-editor></div></section>
      <section class="surface problem-panel"><h2>控制台</h2><div data-console></div></section>
    </div>`),n=t?h.projects[t.id]??={files:t.files.map(c=>({...c})),active:"main.py",entry:"main.py",input:t.input}:h.workspace;G=bt(e,n,V,{manage:!0,resultKey:t?"project:"+t.id:"lab",prewarm:!t})}function ee(){G(),G=()=>{};const[t,e,n]=location.hash.slice(1).split("/"),c=Z.find(a=>a.id===e),i=yt.find(a=>a.id===e),r=Number(e)-1;if(!t||t==="home")un();else if(t==="learn"&&!e)mn();else if(t==="learn"&&Number.isInteger(r)&&P[r])fn(r,n);else if(t==="bank"){let a="";try{a=decodeURIComponent(e??"")}catch{}if(a==="independent"){const u=ut.find(g=>encodeURIComponent(g)===n||g===n);It("",u??"independent")}else It(a)}else t==="review"?hn():t==="lab"?Tt():t==="problem"&&c?G=Xt(c,n==="modify",D("problem","")):t==="project"&&i?Tt(i):D("",J("页面未找到","请从首页选择学习入口。")+j("home","返回首页"));window.scrollTo(0,0)}addEventListener("hashchange",ee);ee();
