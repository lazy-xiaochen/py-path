import{p as Ae,d as Ce,f as Pe,m as Ie,a as Te,b as Me,l as qe,s as _e,c as Re,e as Oe,v as Ne,i as Fe,g as ze,h as Be,j as Ue,k as De,n as Ve,o as We,q as He,r as Ke,t as Ge,u as Je,w as Xe,x as Ye,y as Qe,z as Ze,A as H}from"./lessons-vAzaFPfH.js";import{l as tn,s as lt,a as en,d as nn,b as sn,c as an,e as on,f as mt,m as rn,g as cn,u as ln,h as dn,i as Q,j as pn,k as un,n as mn,o as fn,r as hn,p as gn,q as vn,t as Z,v as yn,w as bn,x as kn,y as $n,z as wn,A as xn,B as En,C as Ln,D as Sn,E as jn,F as An,G as Cn,H as Pn,I as In,J as Tn,K as Mn,L as qn,M as _n,N as Rn,O as On,P as Nn,Q as Fn,R as zn,S as Bn,T as Un,U as Dn}from"./advanced-lessons-azmjQyPq.js";import{D as ft,S as Vn,a as Wn,E as ot,s as Hn,H as Kn,t as N,b as zt,c as Gn,p as Jn,i as Xn,k as Yn,d as Qn}from"./editor-BAWtmUHb.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}})();const kt={输入输出:Fe,变量与运算:Ne,条件判断:Oe,循环:Re,字符串:_e,列表:qe,字典:Me,函数:Te,模块:Ie,文件读写:Pe,异常调试:Ce,综合应用:Ae},Jt=t=>t.topics.flatMap(e=>e.examples),Zn=[{slug:"list-references",tag:lt[0],title:"列表、切片与对象引用",chapter:tn},{slug:"list-order",tag:lt[1],title:"列表编辑与排序",chapter:en},{slug:"dict-indexes",tag:lt[2],title:"字典视图、合并与索引",chapter:nn},{slug:"sets",tag:lt[3],title:"集合操作与关系",chapter:sn},{slug:"structure-design",tag:lt[4],title:"数据结构选择与复杂度",chapter:an}],ts=[{slug:"list-comprehensions",tag:mt[0],title:"可迭代对象与列表推导式",chapter:on},{slug:"mapping-comprehensions",tag:mt[1],title:"字典、集合与多层推导式",chapter:rn},{slug:"generator-expressions",tag:mt[2],title:"迭代器与生成器表达式",chapter:cn},{slug:"unpacking",tag:mt[3],title:"解包、对齐与组合",chapter:ln}],es=[{slug:"function-binding",tag:Q[0],title:"参数绑定与默认值",chapter:dn},{slug:"function-signature",tag:Q[1],title:"设计函数签名",chapter:pn},{slug:"function-values",tag:Q[2],title:"函数对象与回调",chapter:un},{slug:"function-scope",tag:Q[3],title:"LEGB 与闭包",chapter:mn},{slug:"function-decorators",tag:Q[4],title:"装饰器",chapter:fn},{slug:"recursion-frames",tag:Q[5],title:"调用栈与递归基础",chapter:hn},{slug:"recursive-design",tag:Q[6],title:"分治、树形遍历与记忆化",chapter:gn}],ns=[{slug:"object-basics",tag:Z[0],title:"从记录到类和实例",chapter:vn},{slug:"object-attributes",tag:Z[1],title:"属性与三种方法",chapter:yn},{slug:"object-encapsulation",tag:Z[2],title:"封装与属性校验",chapter:bn},{slug:"object-inheritance",tag:Z[3],title:"继承、重写与 MRO",chapter:kn},{slug:"object-composition",tag:Z[4],title:"多态与组合",chapter:$n},{slug:"object-protocols",tag:Z[5],title:"特殊方法与数据类",chapter:wn},{slug:"object-design",tag:Z[6],title:"管理系统设计与重构",chapter:xn}],ss=[...En,...Ln,...Sn,...jn,...An,...Cn,...Pn,...In,...Tn,...Mn,...qn,..._n,...Rn,...On,...Nn,...Fn,...zn,...Bn],Xt="learn/advanced",$t=t=>Xt+"/"+t.slug,tt=t=>Xt+"/"+t.slug,as={slug:"structures",title:"数据结构进阶",lessons:Zn,introduction:"从可变对象与引用入手，练习编辑和排名、分组和索引、名单核对，再把三种结构组合成可持续更新的程序。",prerequisites:"基础篇列表、字典、循环和函数。先复习下标、键值对以及函数返回值，再进入第一课。",goals:["能推演一次修改的影响范围，正确复制并编辑嵌套列表。","能生成稳定的排序报表、建立分组字典与索引，并按业务语句选择集合运算。","能解释一个程序为什么需要列表、字典或集合，分析单次操作与一批查询的主要成本。"],map:`对象与引用 → 复制和切片 → 有序编辑与排序
键和值 → 分组与索引 → 缺失或当前状态
唯一成员 → 名单运算 → 判重与关系检查
有序记录 ＋ 当前索引 ＋ 历史成员 → 可复核的事件处理程序`,mapCaption:"从单个容器到事件处理",summary:["修改嵌套容器前明确引用关系，确定复制范围。排序前决定是否保留原序列。","按位置访问选列表，按键取数据选字典，只跟踪成员选集合。","有序历史、当前状态和判重对应不同查询。按访问次数与数据量计算成本。"],practice:[{id:"A012",label:"专项复核 · 跨仓库存索引",criterion:"能正确区分未登记与零值，更新时保留仓内顺序。"},{id:"A016",label:"综合练习 · 只参加过一期的访客",criterion:"同一期先去重，跨期记录重复并保留指定输出顺序。"}],assessment:{id:"A020",label:"阶段测评 · 场次报名核验台",criterion:"独立完成并通过全部用例。能用两份状态解释重报、重复通知与当前缺席。能说明平均查询成本和空间开销。"},transfer:{id:"A098",label:"撤回后的活动编号清单",criterion:"从事件更新集合，用数值顺序生成最终清单。"}},is={slug:"expressions",title:"推导式与解包",lessons:ts,introduction:"从筛选循环出发，构造列表、字典与集合。用迭代器逐项读取，在配对和解包中给字段命名，最后完成一份可核验的报表。",prerequisites:"先完成数据结构进阶，能用列表保序、用字典覆盖、用集合去重。需要基础篇函数调用与异常处理。",goals:["能将推导式还原为循环，解释筛选时机、嵌套顺序和重复数据的处理。","能追踪生成器读取进度，选择按需处理、一次汇总或建立完整结果列表。","能解包变长记录、对齐多列并保留原始位置，将已有数据和配置展开给函数。"],map:`遍历与筛选 → 列表、字典和集合推导式 → 多层结构
按需读取 → 迭代器与生成器 → 查找或汇总
配对与编号 → 解包字段 → 过滤、覆盖与完整报表`,mapCaption:"从原始数据到对齐报表",summary:["把筛选写在取到所需名称之后。先明确输出需要列表、映射还是唯一成员。","生成器按读取推进。需要用到多份统计时，判断能否在一次循环内汇总。","先核对输入形状，再对齐与解包。重复编号要确认先覆盖还是先筛选。"],practice:[{id:"A028",label:"专项复核 · 把巡检表转成逐日表",criterion:"按日期构造外层列表，明确填补缺测位置，保留原始设备次序与真实零值。"},{id:"A032",label:"综合练习 · 共享游标的巡检交接",criterion:"手推三次消费边界，并让查找和汇总共享同一游标。"}],assessment:{id:"A036",label:"阶段测评 · 活动积分对账报表",criterion:"独立通过全部用例，能解释为什么先验两列长度、先覆盖再筛选，以及如何同时保留最后位置与当前积分。"},transfer:{id:"A099",label:"可改票的推荐榜",criterion:"分离最后选择与统计过程，处理弃权、大小写和并列。"}},os={slug:"functions",title:"函数进阶、作用域与递归",lessons:es,introduction:"从调用时如何给形参绑定值开始，用回调、闭包与装饰器拆分规则和状态，再用调用栈解释线性递归、分治和分层数据的汇总。",prerequisites:"完成推导式与解包，能传入位置和关键字实参，熟悉列表、字典、迭代器和基础篇的异常处理。",goals:["能设计调用意图清楚的签名，验证可变默认值及共享引用。","能借助作用域规则预测多个回调和包装器的状态、调用顺序与结果。","能画出递归下降与返回、实现边界稳定的二分和目录汇总，并比较缓存、迭代与递归栈的代价。"],map:`参数绑定 → 函数签名 → 可替换回调
LEGB → 独立闭包 → 可转发的函数包装
调用帧 → 子问题缩小与终止 → 分治、树遍历与记忆化`,mapCaption:"从一次调用到组合规则与分层目录",summary:["先写参数契约，再写函数体。用重复调用测试默认状态和显式覆盖。","记录名称属于哪一层，以及包装器何时运行。分别测试通过、拒绝和异常路径。","从终止条件向上推导合成规则。对重复子问题考虑缓存，对很深的线性处理考虑循环。"],practice:[{id:"A048",label:"综合练习 · 读数转换管道",criterion:"维持步骤顺序，能解释各回调的输入、输出和一次性结果的消费。"},{id:"A056",label:"专项复核 · 两种审计范围",criterion:"能画出两种包装顺序，并用拒绝、边界和零值用例验证。"}],assessment:{id:"A064",label:"阶段测评 · 分层目录配额报告",criterion:"独立通过正式评测，能解释叶子与空目录各返回什么、为何进入时确定顺序以及返回时合并总量。"},transfer:{id:"A100",label:"独立房间的名称分配器",criterion:"维护两个房间的状态与后缀搜索进度，处理用户自己输入的后缀。"}},rs={slug:"objects",title:"面向对象编程",lessons:ns,introduction:"用类组织实例的状态与操作，逐步建立可验证的属性、可替换组件与公共协议，最后完成有状态管理系统。",prerequisites:"学过函数、引用与容器、异常和装饰器。建议先通过函数模块的综合练习。",goals:["能为问题选对象、属性与公开方法，并验证多实例和失败后的状态。","能追踪属性、继承和方法解析，基于对象关系判断继承与组合。","能实现 Python 的常用对象协议，分层完成可测试的借阅系统。"],map:`记录 + 行为 → 类与实例 → 属性校验
继承与 super → 方法查找 → 统一接口与可替换组件
数据类与协议 → 职责划分 → 借还、预约与连续操作验证`,mapCaption:"从保存单条记录到管理多对象状态",summary:["让状态归属、公开操作和失败行为都可从接口读出。","复用继承行为前说明父子契约，组合可让独立变化的策略直接替换。","用多实例、双方边界和失败后的连续查询检查状态一致性。"],practice:[{id:"A076",label:"专项复核 · 跨柜台完整转移",criterion:"失败时同时保留两个柜台的原数量，成功后总量守恒。"},{id:"A084",label:"综合练习 · 切换独立投递通道",criterion:"切换引用后各通道的记录与限额独立。"}],assessment:{id:"A092",label:"阶段测评 · 单件设备的预约优先",criterion:"验证借用权、错误归还和预约先后，能指出每个命令的状态变化。"},transfer:{id:"A101",label:"可归还的分区储物位",criterion:"通过公开接口验证容量、重复领取、归还与多实例隔离。"}},et=[as,is,os,rs],nt=et.flatMap(t=>t.lessons),jt=["入门迁移","跨知识点","综合"];function I(t,e,n,r,o,s,i,p,m,b,d,u,v){return{id:"P"+String(t).padStart(3,"0"),title:e,difficulty:n,tag:r,description:o,input:s,output:i,sample:p,limits:m,cases:b,hints:d,solution:u,background:v}}const cs=[I(1,"给包裹贴标签","入门","输入输出","读取一行收件人姓名，给它加上固定前缀，生成标签。","一行姓名 s，可包含空格。","一行，由“收件人：”和原姓名直接拼接。冒号是全角字符。",[`林晓
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
print(start, best)`)],ls={...Ze,...Qe,...Ye,...Xe,...Je,...Ge},Yt=[...cs.map(t=>({...t,guide:ls[t.id]})),...ze,...Be,...Ue,...De,...Ve,...We,...He,...Ke],rt=[...Yt,...ss];function T(t,e,n,r){return{question:t,choices:e,answer:n,feedback:r}}const R=[{title:"让 Python 开口说话",tag:"输入输出",theory:"程序按顺序执行。input() 从标准输入读取一行并返回字符串，print() 默认写出内容和一个换行。题目会给定标准输入并直接比较标准输出，因此只有输出格式要求的文字才应被打印。",example:`city = input()
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
`,check:T("规则从“大于上限”改为“至少达到上限”。哪个输入最能区分两者？",["值小于上限","值等于上限","值大于上限"],1,"相等的数据只符合“至少达到”。"),predict:T("并列要取最早出现者。按输入顺序扫描时该在何时更新最佳值？",["只在严格更好时","相等也更新","只在严格更差时"],0,"严格更好才替换，首次出现的并列项就会保留。"),mistake:"用一个样例判断正确性。额外构造最小规模、刚好相等和多个并列的测试。"}],wt=[{id:H.id,title:H.title,tags:"基础篇结项 · 多文件与 CSV",description:H.description,steps:H.guide.steps,input:H.sample[0],expected:H.sample[1],acceptance:H.sample[2],files:H.starterFiles,solution:H.solution,assessment:H},{id:"words",title:"文本词频统计",tags:"字符串 · 字典 · 模块",description:"从文件读入英文短文，忽略大小写和标点，按频率列出前 k 个单词。",steps:["标准输入读入正整数 k。读取随项目提供的 article.txt。","用 re.findall 按 [a-z]+ 提取小写英文词，按词累计每次出现。","按次数从大到小排序，同频按单词字母顺序。每行输出单词和次数，最多 k 行。没有单词时输出“空文本”。"],input:`3
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
        print(word, counts[word])`},Un,Dn],ds=`(() => {
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
`,ps=`// Concatenated after the two local Pyodide scripts into a classic blob Worker.
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
`,Qt=20,Zt=128*1024,us=32*1024,te=new TextEncoder,ee=new URL("runtime/",new URL("./",location.href));function ne(t){return/^[\p{L}\p{N}_][\p{L}\p{N}_.-]{0,79}$/u.test(t)}function At(t){if(!t.length||t.length>Qt)return"文件数量须为 1–20 个。";if(new Set(t.map(e=>e.name)).size!==t.length)return"文件名重复。";if(!t.every(e=>ne(e.name)))return"文件名须由字母、汉字、数字、下划线、点或连字符组成，且不能包含目录。";if(t.reduce((e,n)=>e+te.encode(n.content).length,0)>Zt)return"文件总大小超过 128 KiB。"}let Et;function ms(){const t=async e=>{const n=await fetch(new URL(e,ee),{mode:"same-origin",redirect:"error",signal:AbortSignal.timeout(15e3)});if(!n.ok||n.headers.get("content-type")?.includes("text/html"))throw new Error("解释器资源加载失败："+e);return n};return Promise.all([t("pyodide.asm.js").then(e=>e.text()),t("pyodide.js").then(e=>e.text()),t("pyodide.asm.wasm").then(e=>e.blob()),t("python_stdlib.zip").then(e=>e.blob()),t("pyodide-lock.json").then(e=>e.blob())]).then(([e,n,r,o,s])=>({scripts:[e,`
;
`,n,`
;
`,ps],assets:{wasm:r,stdlib:o,lock:s}}))}function ht(t,e,n,r){if(e?.aborted)return r?.dispose(),Promise.resolve({status:"STOP",stdout:"",stderr:""});const o=At(t.files)??(!t.entry.endsWith(".py")||!t.files.some(s=>s.name===t.entry)?"请选择工作区内的 Python 入口文件。":void 0)??(te.encode(t.input).length>us?"标准输入超过 32 KiB。":void 0)??(t.inspection?.artifacts?.some(s=>!ne(s))?"产物必须使用工作区内的单层文件名。":void 0);return o?(r?.dispose(),Promise.resolve({status:"INVALID",stdout:"",stderr:"",detail:o})):(r?.available?r:se()).start(t,e,n)}function se(t){const e=document.createElement("iframe");e.hidden=!0,e.title="隔离的 Python 执行环境",e.setAttribute("sandbox","allow-scripts");const n=new MessageChannel;let r=!1,o=!1,s=!1,i,p,m=window.setTimeout(()=>d("UNAVAILABLE","无法在时限内确认隔离环境和解释器可用。"),25e3);function b(c){i||(i=c,n.port1.postMessage({type:"stop"}),n.port1.close(),e.remove(),window.clearTimeout(m),window.removeEventListener("message",v),p?.signal?.removeEventListener("abort",u),p?.resolve(c),p=void 0,t?.("closed"))}function d(c,L){b({status:c,stdout:"",stderr:"",detail:L})}function u(){d("STOP")}async function v(c){if(!(r||c.source!==e.contentWindow||c.origin!=="null"||c.data?.type!=="python-isolate-ready")){r=!0;try{Et??=ms().catch(h=>{throw Et=void 0,h});const L=await Et;i||e.contentWindow.postMessage({type:"boot",...L,probe:new URL("isolation-probe",ee).href},"*",[n.port2])}catch(L){d("UNAVAILABLE",String(L))}}}function k(){if(i||s||!o||!p)return;s=!0,clearTimeout(m),m=window.setTimeout(()=>d("TLE"),2e3);const{snapshot:c,onRunning:L}=p;L?.(),i||n.port1.postMessage({type:"execute",...c})}n.port1.onmessage=({data:c})=>{i||(c?.type==="failed"&&d("UNAVAILABLE",String(c.reason).slice(0,1e3)),c?.type==="ready"&&!o&&(o=!0,clearTimeout(m),p?k():(m=window.setTimeout(u,6e4),t?.("ready"))),c?.type==="result"&&s&&["OK","RE","OLE"].includes(c.status)&&typeof c.stdout=="string"&&typeof c.stderr=="string"&&b({status:c.status,stdout:c.stdout,stderr:c.stderr,diagnostic:c.diagnostic,values:c.values,inputRead:c.inputRead,artifacts:c.artifacts}))},window.addEventListener("message",v);const y=Array.from(crypto.getRandomValues(new Uint32Array(4)),c=>c.toString(16)).join(""),E=`default-src 'none'; script-src 'nonce-${y}' 'wasm-unsafe-eval'; worker-src blob:; connect-src 'none'; base-uri 'none'; form-action 'none'`;return e.srcdoc=`<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${E}"><script nonce="${y}">${ds}<\/script>`,document.body.append(e),{get available(){return!i&&!p},start(c,L,h){return i?Promise.resolve(i):p?Promise.resolve({status:"INVALID",stdout:"",stderr:"",detail:"执行环境已被使用。"}):new Promise(x=>{if(p={snapshot:c,signal:L,onRunning:h,resolve:x},L?.aborted){u();return}L?.addEventListener("abort",u,{once:!0}),k()})},dispose:u}}function vt(t,e="relaxed"){const n=t.replace(/\r\n?/g,`
`);if(e==="exact")return n.endsWith(`
`)?n.slice(0,-1):n;const r=n.split(`
`).map(o=>o.trimEnd());for(;r.length&&r.at(-1)==="";)r.pop();return r.join(`
`)}function Bt(t){return t===void 0?"行尾":t===" "?"空格":t==="	"?"制表符":/\s/u.test(t)?"其他空白":"非空白字符"}function ae(t,e){const n=vt(t,"exact").split(`
`),r=vt(e,"exact").split(`
`);for(let o=0;o<Math.max(n.length,r.length);o++){const s=n[o],i=r[o];if(s===i)continue;const p="第 "+(o+1)+" 行";if(s===void 0)return p+"是多出的输出。";if(i===void 0)return"缺少"+p+"输出。";const m=Array.from(s),b=Array.from(i);let d=0;for(;m[d]===b[d];)d++;const u=p+"第 "+(d+1)+" 列",v=Bt(m[d]),k=Bt(b[d]);return v===k?u+"的字符不同。":u+"期望为"+v+"，实际为"+k+"。"}}const fs={AC:"通过",WA:"答案错误",RE:"运行错误",TLE:"超时",OLE:"输出超限",OK:"运行结束",STOP:"已停止",UNAVAILABLE:"隔离环境不可用",INVALID:"无法运行"},hs={SyntaxError:"Python 无法解析这段代码。检查冒号、配对的括号和引号。",IndentationError:"缩进与语句块不匹配。检查冒号后是否缩进，同一层是否对齐。",TabError:"缩进混用了制表符和空格。建议统一使用四个空格。",ValueError:"值的格式或范围不符合要求。例如 int 只能转换合法的整数文本。",TypeError:"操作所需的数据类型不匹配。检查参数以及参与运算的值。",NameError:"当前作用域找不到这个名称。检查拼写、定义顺序和变量的作用域。",UnboundLocalError:"函数读取了尚未赋值的局部变量。检查每个分支是否都赋值。",ZeroDivisionError:"除数为 0。检查输入并在计算前处理该边界。",IndexError:"序列索引越界。非空序列的最后一个正向索引是长度减一。",KeyError:"字典中没有这个键。可以先检查键，或使用 get 提供默认值。",EOFError:"已经读到了输入末尾。请在运行前填写「标准输入」。每次 input() 读取一行，例如两次 input() 需要两行。",ModuleNotFoundError:"找不到模块。检查模块名与工作区文件，执行环境仅含已打包的模块。",ImportError:"模块中的对象无法导入。检查名称和是否存在循环导入。",FileNotFoundError:"虚拟工作目录里没有该文件。检查路径、文件名和是否已导入。",AttributeError:"对象没有这个属性或方法。检查拼写和对象类型。",AssertionError:"assert 检查失败。查看检查条件与实际值。",RecursionError:"递归层数超限。检查结束条件和每次递归是否接近它。",SystemExit:"程序以非零状态退出。检查传给 exit 或 sys.exit 的值。"},Ct={WA:"核对输出格式，再测试最小输入、相等端点和重复值。",RE:"用自定义输入复现，检查输入转换、索引、空数据和异常栈。",TLE:"检查循环是否能结束，以及最大规模下是否重复计算。",OLE:"输出超过 64 KiB，已截断并停止。检查循环内的打印。",UNAVAILABLE:"请通过 HTTP 或 HTTPS 打开页面后重试。"},a=t=>String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]);function w(t,e){return t.querySelector(e)}function dt(t){const e=["AC","WA","RE","TLE","OLE"].includes(t)?" · "+t:"";return'<span class="status status-'+t+'">'+fs[t]+e+"</span>"}function P(t,e="（空）"){return`<pre>
`+a(t||e)+"</pre>"}function gs(t,e){const r=t.kind==="ValueError"&&t.trace.includes("ValueError: invalid literal for int()")?"int() 需要一个有效的整数。若这一行填了两个数，可以按每次 input() 一行重新填写，或先用 split() 拆分，再分别转换。":hs[t.kind]??"请查看原始异常的最后一行与调用位置。";return'<section class="error-box"><p>'+a(r)+"</p>"+(e&&t.line?'<button class="link-button jump" type="button">'+a(e.name)+" · 第 "+a(t.line)+' 行</button><p class="stale muted" hidden>这条结果来自旧版本，重新运行后可定位。</p>':"")+P(t.trace)+"</section>"}function yt(t){return'<div class="result-heading">'+dt(t.status)+"</div>"+(t.detail?'<p class="muted">'+a(t.detail)+"</p>":"")+(t.assessmentIssue?'<p class="muted">'+a(t.assessmentIssue)+"</p>":"")+(Ct[t.status]?'<p class="muted">'+a(Ct[t.status])+"</p>":"")+(["OK","RE","OLE"].includes(t.status)?"<h4>标准输出</h4>"+P(t.stdout)+"<h4>标准错误</h4>"+P(t.stderr):"")+(t.values?"<h4>返回值</h4>"+P(t.values.map(e=>JSON.stringify(e)).join(`
`)):"")+(t.artifacts??[]).map(e=>"<details><summary>本次产物 "+a(e.name)+"</summary>"+(e.content===void 0?"<p>"+a(e.error)+"</p>":P(e.content))+"</details>").join("")}async function Ut(t,e){try{await navigator.clipboard.writeText(e),t.textContent="已复制"}catch{t.textContent="请手动选择并复制"}}const vs=ft.line({class:"execution-error-line"}),Pt=Vn.define(),Dt=Wn.define({create:()=>ft.none,update(t,e){const n=e.effects.find(r=>r.is(Pt));return n?.value?ft.set([vs.range(e.newDoc.line(n.value).from)]):n||e.docChanged?ft.none:t},provide:t=>ot.decorations.from(t)}),ys=ot.theme({"&":{backgroundColor:"var(--editor-bg)",color:"var(--editor-text)"},".cm-content, .cm-gutter":{fontFamily:"var(--mono)",fontSize:"14px",lineHeight:"1.75"},".cm-content":{padding:"12px 0",caretColor:"var(--accent)"},".cm-line":{paddingInline:"10px"},".cm-gutters":{backgroundColor:"var(--editor-edge)",color:"var(--muted)",borderRight:"1px solid var(--border)"},".cm-activeLineGutter, .cm-activeLine":{backgroundColor:"var(--editor-line)"},".cm-cursor, .cm-dropCursor":{borderLeftColor:"var(--accent)"},"&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":{backgroundColor:"var(--editor-selection)"},"&.cm-focused .cm-matchingBracket, .cm-searchMatch, .cm-selectionMatch":{backgroundColor:"var(--accent-soft)",color:"var(--editor-text)"},".cm-searchMatch.cm-searchMatch-selected":{backgroundColor:"var(--warning-soft)",color:"var(--warning)"},".cm-panels, .cm-tooltip, .cm-foldPlaceholder":{backgroundColor:"var(--surface)",color:"var(--text)",borderColor:"var(--border)"},".cm-panel .cm-textfield, .cm-panel .cm-button":{background:"var(--field)",color:"var(--text)",border:"1px solid var(--border-strong)",borderRadius:"var(--radius-sm)"},".execution-error-line":{backgroundColor:"var(--editor-error-line)"},".cm-scroller":{maxHeight:"72vh"}},{dark:!0}),bs=Hn(Kn.define([{tag:N.keyword,color:"var(--syntax-keyword)"},{tag:[N.comment,N.lineComment],color:"var(--syntax-comment)",fontStyle:"italic"},{tag:[N.string,N.special(N.string)],color:"var(--syntax-string)"},{tag:[N.number,N.bool,N.null],color:"var(--syntax-number)"},{tag:[N.definition(N.variableName),N.standard(N.variableName),N.function(N.variableName)],color:"var(--syntax-function)"},{tag:N.operator,color:"var(--editor-text)"}]));function ks(t,e,n,r=!1,o=!1,s=!1){const i=new Map;let p=!0;t.innerHTML='<div class="filebar"></div><div class="editor-host"></div><p class="file-feedback" role="status" hidden></p>';const m=w(t,".filebar"),b=w(t,".file-feedback"),d=(h="")=>{b.textContent=h,b.hidden=!h};function u(h){return zt.create({doc:h.content,extensions:[Gn,ys,bs,h.name.endsWith(".py")?Jn():[],Xn.of("    "),Yn.of([Qn]),zt.readOnly.of(o),ot.editable.of(!o),ot.contentAttributes.of({"aria-label":"Python 源码编辑器"}),Dt,ot.updateListener.of(x=>{if(!x.docChanged)return;const l=e.files.find($=>$.name===e.active);l.content=x.state.doc.toString(),n()})]})}const v=()=>e.files.find(h=>h.name===e.active),k=new ot({state:u(v()),parent:w(t,".editor-host")});function y(){k.state.field(Dt).size&&k.dispatch({effects:Pt.of(void 0)})}function E(){m.innerHTML='<div class="file-tabs" aria-label="工作区文件">'+e.files.map(h=>'<button type="button" data-file="'+a(h.name)+'" aria-pressed="'+(h.name===e.active)+'">'+a(h.name)+"</button>").join("")+"</div>"+(r?'<div class="file-actions"><button type="button" data-action="new">新建</button><button type="button" data-action="import">导入</button><button type="button" data-action="rename">重命名</button><button type="button" data-action="delete">删除</button><input type="file" multiple hidden></div>'+(s?'<span class="muted">入口 main.py</span>':'<label class="entry-label">运行入口 <select aria-label="运行入口">'+e.files.filter(h=>h.name.endsWith(".py")).map(h=>"<option"+(h.name===e.entry?" selected":"")+">"+a(h.name)+"</option>").join("")+"</select></label>"):"")}function c(h,x){if(!e.files.some($=>$.name===h)||(e.active!==h&&(i.set(e.active,k.state),e.active=h,k.setState(i.get(h)??u(v())),E(),n()),y(),!x||x<1||x>k.state.doc.lines))return;const l=k.state.doc.line(x);k.dispatch({effects:Pt.of(x),selection:{anchor:l.from,head:l.to},scrollIntoView:!0}),k.focus()}function L(h,x,l){const $=At(h);if($){d($);return}if(!h.some(S=>S.name.endsWith(".py"))){d("请至少保留一个 .py 文件。");return}y(),i.set(e.active,k.state),l&&i.delete(l),e.files=h,e.active=x,h.some(S=>S.name===e.entry)||(e.entry=h.find(S=>S.name.endsWith(".py")).name),k.setState(i.get(x)??u(v())),E(),d(),n()}return m.addEventListener("click",h=>{const x=h.target.closest("button");if(!x)return;const{file:l,action:$}=x.dataset;if(l){c(l);return}if($==="import"){w(m,"input[type=file]").click();return}if($==="delete"&&confirm("删除 "+e.active+"？")){const S=e.files.filter(C=>C.name!==e.active);if(!S.length){d("请至少保留一个 .py 文件。");return}L(S,S[0].name,e.active)}if($==="new"||$==="rename"){const S=prompt($==="new"?"新文件名，例如 helpers.py":"重命名文件",$==="new"?"":e.active);if(S===null)return;const C=S.trim();if($==="rename"&&C===e.active)return;if($==="new")L([...e.files,{name:C,content:""}],C);else{const q=e.entry;e.active===q&&C.endsWith(".py")&&(e.entry=C);const _=e.files.map(O=>O===v()?{...O,name:C}:O);(At(_)||!_.some(O=>O.name.endsWith(".py")))&&(e.entry=q),L(_,C,e.active)}}}),m.addEventListener("change",async h=>{const x=h.target;if(x instanceof HTMLSelectElement&&(e.entry=x.value,n()),!(x instanceof HTMLInputElement)||!x.files?.length)return;const l=Array.from(x.files);if(x.value="",l.length+e.files.length>Qt||l.reduce(($,S)=>$+S.size,0)>Zt){d("导入文件超过运行器的文件数量或大小限制。");return}try{const $=await Promise.all(l.map(async S=>({name:S.name,content:new TextDecoder("utf-8",{fatal:!0}).decode(await S.arrayBuffer())})));p&&L([...e.files,...$],$[0].name)}catch{p&&d("只能导入 UTF-8 文本文件。")}}),E(),{snapshot:h=>({entry:e.entry,input:h,files:e.files.map(x=>({...x}))}),unchanged:h=>e.entry===h.entry&&e.files.length===h.files.length&&e.files.every(x=>h.files.some(l=>l.name===x.name&&l.content===x.content)),open:c,clearMarker:y,destroy(){p=!1,k.destroy()}}}const ie="py-path.v1",$s={files:[{name:"main.py",content:`# 在这里写下你的 Python 程序
print("你好，Python！")
`}],active:"main.py",entry:"main.py",input:""};let F={},pt=!1;try{F=JSON.parse(localStorage.getItem(ie)??"{}")??{}}catch{pt=!0}const f={drafts:F.drafts??{},attempts:F.attempts??{},solved:F.solved??{},mistakes:F.mistakes??{},progress:F.progress??{},workspace:F.workspace?.files?.length?F.workspace:$s,projects:F.projects??{},examples:F.examples??{},exampleSelections:F.exampleSelections??{},questions:F.questions??{},submissions:F.submissions??{},runs:F.runs??{},problemInputs:F.problemInputs??{},taskWorkspaces:F.taskWorkspaces??{}};function G(){try{localStorage.setItem(ie,JSON.stringify(f)),pt=!1}catch{pt=!0}const t=document.querySelector("#local-storage");t&&(t.textContent=pt?"本地存储不可用或已满":"仅本地保存")}function ws(t,e){const n=oe(t);f.submissions[t]={attempts:n.attempts+1,correct:n.correct+ +(e.verdict==="AC")},f.attempts[t]=[e,...f.attempts[t]??[]].slice(0,30),e.verdict==="AC"?(f.solved[t]=!0,delete f.mistakes[t]):f.mistakes[t]=!0,G()}function oe(t){const e=f.attempts[t]??[];return f.submissions[t]??{attempts:e.length,correct:e.filter(n=>n.verdict==="AC").length}}function xs(t,e,n){const r=f.questions[t];f.questions[t]={attempts:(r?.attempts??0)+1,correct:(r?.correct??0)+Number(n),lastChoice:e,solved:n||!!r?.solved},G()}function re(t,e,n,r){const{stdout:s,stderr:i,diagnostic:p,detail:m,artifacts:b}=e,d={...e,stdout:s.slice(0,4096),stderr:i.slice(0,4096),artifacts:b?.map(v=>({...v,content:v.content?.slice(0,4096)})),diagnostic:p?{...p,trace:p.trace.slice(0,4096)}:void 0,detail:m?.slice(0,4096)},u=n.files.reduce((v,k)=>v+k.content.length,0);f.runs[t]={report:d,sample:r,snapshot:p&&u<=8192?{...n,input:""}:void 0,truncated:[s,i,p?.trace,m,...b?.map(v=>v.content)??[]].some(v=>(v?.length??0)>4096)},G()}function ce(t){f.runs[t]&&(delete f.runs[t],G())}function Lt(t,e){(f.progress[t]??={})[e]=!0,G()}function Vt(t,e){return'<div class="comparison"><div><h4>期望输出</h4>'+P(t)+"</div><div><h4>实际输出</h4>"+P(e)+"</div></div>"}function le(t,e,n,r,o,s=!1,i=()=>{},p,m=!1){const b=w(t,"[data-console]");b.innerHTML=`
    <label class="input-label">标准输入<textarea rows="4" aria-label="标准输入" spellcheck="false"
      ${o?"":'aria-describedby="stdin-hint"'}></textarea></label>
    ${o?"":'<p class="console-hint muted" id="stdin-hint">运行前填好输入。每次 input() 读取一行，多行用回车分隔。</p>'}
    <div class="actions">
      <button class="button primary" type="button" data-run>运行</button>
      ${s?'<button class="button secondary" type="button" data-submit>提交评测</button>':""}
      <button class="button secondary" type="button" data-stop disabled>停止</button>
      <button class="button quiet" type="button" data-clear>清空</button>
    </div>
    <div class="result" aria-live="polite"><p class="muted">运行结果将在这里显示。</p></div>`;const d=w(b,"textarea"),u=w(b,".result"),v=w(b,"[data-run]"),k=w(b,"[data-stop]"),y=b.querySelector("[data-submit]"),E=ks(w(t,"[data-editor]"),e,()=>{n(),x()},r,o,m);let c,L,h=!1;d.value=e.input,d.readOnly=o,d.addEventListener("input",()=>{e.input=d.value,n()}),k.addEventListener("click",()=>c?.abort()),w(b,"[data-clear]").addEventListener("click",()=>{L=void 0,E.clearMarker(),p&&ce(p),u.innerHTML='<p class="muted">控制台已清空。</p>'});function x(){if(!L)return;const C=!E.unchanged(L),q=u.querySelector(".jump");q&&(q.disabled=C,w(u,".stale").hidden=!C)}function l(C,q,_){const O=q?.diagnostic,U=_?.files.find(ct=>ct.name===O?.file);L=O&&_,u.innerHTML=C+(O?gs(O,U):""),u.querySelector(".jump")?.addEventListener("click",()=>{U&&_&&E.unchanged(_)&&(i(),E.open(U.name,O?.line))}),x()}async function $(C){if(!c){c=new AbortController,v.disabled=!0,y&&(y.disabled=!0),k.disabled=!1,L=void 0,E.clearMarker();try{await C(c.signal)}finally{c=void 0,v.disabled=!1,y&&(y.disabled=!1),k.disabled=!0}}}function S(C){h||(u.innerHTML='<p class="live">'+a(C)+"</p>")}return{input:d,run:v,submitButton:y,editor:E,act:$,pending:S,setResult:l,active:()=>!h,dispose(){h=!0,c?.abort(),E.destroy()}}}function de(t){return'<p class="muted saved-run">上次运行结果'+(t?" · 长输出仅保留开头":"")+"</p>"}function Tt(t,e,n,{manage:r=!1,readOnly:o=!1,notify:s,resultKey:i,prewarm:p=!1}={}){const m=le(t,e,n,r,o,!1,void 0,i),b=i?f.runs[i]:void 0;b&&m.setResult(de(b.truncated)+yt(b.report),b.report,b.snapshot);let d;const u=p?document.createElement("span"):void 0;u&&(u.className="runtime-state muted",u.setAttribute("role","status"),m.run.parentElement.append(u),v());function v(){if(!u)return;u.textContent="正在提前准备解释器…";const k=se(y=>{d===k&&(y==="closed"&&(d=void 0),u.textContent=y==="ready"?"隔离解释器已就绪":"")});d=k}return m.run.addEventListener("click",()=>{m.act(async k=>{const y=m.editor.snapshot(m.input.value),E=d;d=void 0,u&&(u.textContent=""),m.pending("正在加载隔离解释器…");const c=await ht(y,k,()=>m.pending("程序正在运行…"),E);m.active()&&(i&&re(i,c,y),m.setResult(yt(c),c,y),s?.(c),(c.status==="OK"||c.status==="RE")&&v())})}),()=>{m.dispose(),d?.dispose()}}const pe=t=>Yt.filter(e=>e.tag===R[t].tag);function ue(t,e){return!!(f.questions[e.id]?.solved||t!==void 0&&e.legacy&&f.progress[t]?.[e.legacy])}function Mt(t){const e=kt[R[t].tag];return me(e,t)}function xt(t,e){return me(t,e)}function me(t,e){const n=t?.exercises.filter(i=>i.kind==="question")??[],r=t?t.exercises.flatMap(i=>i.kind==="coding"&&!i.warmup?[i.problem]:[]):e===void 0?[]:pe(e).map(i=>i.id),o=r.map(i=>!!f.solved[i]);t?o.push(...n.map(i=>ue(e,i))):e!==void 0&&o.push(!!f.progress[e]?.explain,!!f.progress[e]?.run);const s=[...r.map(oe),...n.flatMap(i=>f.questions[i.id]??[])];return{completed:o.filter(Boolean).length,total:o.length,attemptCount:s.reduce((i,p)=>i+p.attempts,0),correctCount:s.reduce((i,p)=>i+p.correct,0)}}function fe(t,e){return e?Math.round(t/e*100)+"%":"暂无作答"}const Es=["基础编程","综合应用","拓展挑战"],Ls=["基础编程","独立编程","综合应用","拓展挑战"],gt=(t,e="ul")=>"<"+e+">"+t.map(n=>"<li>"+a(n)+"</li>").join("")+"</"+e+">";function he(t){const e=t.diagnostic;return'<div class="comparison"><div><h4>输入</h4>'+P(t.input,"（无需输入）")+"</div><div><h4>预期输出</h4>"+P(t.output)+(e?"<p>预期异常 <code>"+a(e.kind)+"</code> · "+a(e.file)+" · 第 "+a(e.line)+" 行</p>":"")+"</div></div>"}function Ss(t){return`
    <details class="study-example">
      <summary>${a(t.title)} · ${t.level}</summary>
      <p>${a(t.purpose)}</p>
      <h4>完整代码</h4>${P(t.source)}
      ${(t.files??[]).map(e=>"<h4>"+a(e.name)+"</h4>"+P(e.content)).join("")}
      ${he(t)}
      <h4>执行过程</h4>${gt(t.steps,"ol")}
      <h4>常见误写</h4><p>${a(t.pitfall)}</p>
      <button type="button" class="button secondary" data-open-example="${a(t.id)}">载入示例编辑器</button>
    </details>`}function js(t,e){const r=f.questions[e.id]?.lastChoice,o=ue(t,e);return`
    <fieldset class="quiz chapter-quiz" id="${a(e.id)}" tabindex="-1">
      <legend>${a(e.prompt)}</legend>
      <p class="muted">${a(e.goal)}</p>
      ${e.demonstration?P(e.demonstration.source):""}
      <div class="quiz-options">${e.options.map((s,i)=>'<button type="button" class="button secondary" data-choice="'+i+'" aria-pressed="'+(r===i)+'">'+a(s.label)+"</button>").join("")}</div>
      <p class="quiz-feedback" role="status">${r===void 0?o?"已完成知识检查。":"":a((r===e.answer?"回答正确。":"再想一想。")+e.options[r]?.feedback)}</p>
    </fieldset>`}function Wt(t){return{files:[{name:"main.py",content:t.source},...(t.files??[]).map(e=>({...e}))],active:"main.py",entry:"main.py",input:t.input}}function ge(t,e,n,r,o){const s=typeof e=="number"?e:void 0,i=Jt(n),p=n.exercises.filter(l=>l.kind==="question"),m=n.exercises.filter(l=>l.kind==="coding"),b=m.filter(l=>l.warmup),d=s===void 0?Ls:Es,u=l=>l.map($=>{const S=rt.find(q=>q.id===$.problem),C=$.starterExample?"/modify":"";return`<li><div><a class="inline-link" href="#problem/${S.id}${C}">${S.id} ${a(S.title)} →</a>
      <p>${a($.goal)}</p></div>
      <span class="tag">${f.solved[S.id]?"已通过":f.mistakes[S.id]?"待重做":S.difficulty}</span></li>`}).join(""),v=n.comparisons;t.innerHTML=`
    ${n.introduction?'<section class="surface lesson-stage"><h2>课程导入</h2><p>'+a(n.introduction)+"</p></section>":""}
    <section class="surface lesson-stage chapter-overview"><div class="section-heading">
      <h2>学习目标</h2><span class="tag" data-lesson-completed></span></div>
      ${gt(n.goals)}
      <h3>前置知识</h3><p>${a(n.prerequisites)}</p>
      <p class="muted">${a(n.version)}</p>
      <p class="muted" data-lesson-accuracy></p>
      <div class="chapter-jumps" aria-label="跳至本课内容">
        <button type="button" class="button quiet" data-chapter-jump="chapter-theory">讲解</button>
        <button type="button" class="button quiet" data-chapter-jump="example-workspace-title">示例编辑器</button>
        <button type="button" class="button quiet" data-chapter-jump="chapter-practice">分层练习</button>
        <button type="button" class="button quiet" data-chapter-jump="chapter-mistakes">常见错误与总结</button>
      </div>
    </section>
    <section class="surface lesson-stage chapter-theory"><h2 id="chapter-theory" tabindex="-1"><span>1</span>讲解</h2>
      ${n.topics.map(l=>`<article class="chapter-topic"><h3>${a(l.title)}</h3>
        ${l.explanation.map($=>"<p>"+a($)+"</p>").join("")}
        ${l.diagram?'<figure class="chapter-diagram"><figcaption>'+a(l.diagram.caption)+"</figcaption>"+P(l.diagram.text)+"</figure>":""}
        <div class="study-examples">${l.examples.map(Ss).join("")}</div>
      </article>`).join("")}
      ${v?`<article class="chapter-topic"><h3>对比与辨析</h3><div class="table-scroll">
        <table><thead><tr>${v.headings.map(l=>'<th scope="col">'+a(l)+"</th>").join("")}</tr></thead>
        <tbody>${v.rows.map(l=>"<tr>"+l.map($=>"<td>"+a($)+"</td>").join("")+"</tr>").join("")}</tbody>
        </table></div></article>`:""}
      ${n.applications?'<article class="chapter-topic"><h3>实际应用</h3>'+gt(n.applications)+"</article>":""}
    </section>
    <section class="surface lesson-stage chapter-editor">
      <h2 id="example-workspace-title" tabindex="-1"><span>2</span>运行与修改示例</h2>
      <div class="example-controls">
        <label>选择示例<select aria-label="选择示例">${i.map(l=>'<option value="'+a(l.id)+'">'+a(l.title)+"</option>").join("")}</select></label>
        <button type="button" class="button secondary" data-reset-example>恢复原始示例</button>
      </div>
      <details class="example-expected"><summary>查看原始示例输入与预期结果</summary><div data-expected></div></details>
      <div data-example-workspace><div data-editor></div><div data-console></div></div>
    </section>
    <section class="surface lesson-stage chapter-practice"><h2 id="chapter-practice" tabindex="-1"><span>3</span>分层练习</h2><h3>基础理解</h3>
      ${p.map(l=>js(s,l)).join("")}
      ${b.length?'<div class="practice-level"><h3>热身（选做）</h3><ul class="practice-list">'+u(b)+"</ul></div>":""}
      ${d.map(l=>`<div class="practice-level"><h3>${l}</h3><ul class="practice-list">
        ${u(m.filter($=>$.level===l&&!$.warmup))}</ul></div>`).join("")}
    </section>
    <section class="surface lesson-stage chapter-mistakes"><h2 id="chapter-mistakes" tabindex="-1"><span>4</span>常见错误与总结</h2>
      ${n.mistakes.map(l=>`
        <details><summary>${a(l.symptom)}</summary>
          <dl><dt>原因</dt><dd>${a(l.reason)}</dd><dt>正确做法</dt><dd>${a(l.fix)}</dd>
            <dt>排查方法</dt><dd>${a(l.check)}</dd></dl>
        </details>`).join("")}
      <h3>知识总结</h3>${gt(n.summary)}<p>${a(n.next)}</p>
      <details><summary>参考资料</summary><ul class="reading-list">${n.references.map(l=>`
        <li>${a(l.note)} <a class="inline-link" href="${a(l.url)}" target="_blank" rel="noopener noreferrer">${a(l.title)} ↗</a></li>`).join("")}</ul></details>
    </section>
    <div class="lesson-next">${o??(s===void 0?"":(s?'<a class="button secondary" href="#learn/'+s+'">← 上一课</a>':"")+(s<R.length-1?'<a class="button secondary" href="#learn/'+(s+2)+'">下一课 →</a>':'<a class="button secondary" href="#learn">查看综合项目 →</a><a class="button secondary" href="#bank/independent">章外练习 →</a><a class="button primary" href="#project/ledger">开始结项任务 →</a>'))}
    </div>`;const k=w(t,".example-controls select"),y=w(t,"[data-example-workspace]"),E=w(t,"#example-workspace-title"),c=typeof e=="number"?String(e+1):"advanced:"+e;let L=()=>{};function h(l){L();const $="example:"+c+":"+l.id,S=f.examples[$]??=Wt(l);k.value=l.id,f.exampleSelections[c]!==l.id&&(f.exampleSelections[c]=l.id,G()),w(t,"[data-expected]").innerHTML=he(l);const C=w(t,"[data-reset-example]");C.onclick=()=>{confirm("恢复这份示例的代码和输入，并清除它的运行结果？")&&(f.examples[$]=Wt(l),ce($),G(),h(l))},L=Tt(y,S,G,{resultKey:$})}function x(){const l=xt(n,s);w(t,"[data-lesson-completed]").textContent="已完成 "+l.completed+" / "+l.total+" 练习",w(t,"[data-lesson-accuracy]").textContent="作答正确率 "+fe(l.correctCount,l.attemptCount)+" · 已记录 "+l.attemptCount+" 次作答"}k.addEventListener("change",()=>{const l=i.find($=>$.id===k.value);l&&h(l)});for(const l of t.querySelectorAll("[data-chapter-jump]"))l.addEventListener("click",()=>{const $=w(t,"#"+l.dataset.chapterJump);$.focus(),$.scrollIntoView({block:"start"})});for(const l of t.querySelectorAll("[data-open-example]"))l.addEventListener("click",()=>{const $=i.find(S=>S.id===l.dataset.openExample);$&&(k.value!==$.id&&h($),E.focus(),E.scrollIntoView({block:"start"}))});for(const l of p){const $=w(t,"#"+l.id),S=Array.from($.querySelectorAll("[data-choice]")),C=w($,".quiz-feedback");S.forEach((q,_)=>q.addEventListener("click",()=>{const O=_===l.answer;xs(l.id,_,O),S.forEach(U=>U.setAttribute("aria-pressed",String(U===q))),C.textContent=(O?"回答正确。":"再想一想。")+l.options[_].feedback,x()}))}return h(i.find(l=>l.id===f.exampleSelections[c])??i[0]),x(),p.some(l=>l.id===r)&&requestAnimationFrame(()=>{const l=w(t,"#"+r);l.isConnected&&(l.focus(),l.scrollIntoView({block:"start"}))}),()=>L()}async function Ht(t,e,n,r,o,s=!0){const i=t.contract;if(!i)return ht(e,r,o);const p=i.files?.find(y=>!e.files.some(E=>E.name===y));if(p)return{status:"OK",stdout:"",stderr:"",assessmentIssue:(i.kind==="module"?"模块":"提交文件")+"缺少 "+p+"。"};const m=n?.fixtures??[],b=n?.artifacts??[],d=e.files.filter(y=>![...m,...b].some(E=>E.name===y.name)),u={...e,files:[...d,...m],entry:"main.py"};if(i.target&&n?.calls){const y=i.kind==="module"?"模块接口":"函数接口",E={...i.target,args:n.calls.map(h=>h.args)},c=await ht({...u,input:"",inspection:{call:E}},r,o);if(c.inputRead)return{...c,assessmentIssue:y+"在导入或调用时读取了标准输入。"};if(c.status!=="OK")return c.status==="RE"?{...c,assessmentIssue:y+"导入或调用时发生异常。"}:c;if(c.stdout||c.stderr)return{...c,assessmentIssue:y+"在导入或调用时产生了额外输出。请通过 return 交回结果。"};const L=n.calls.findIndex((h,x)=>c.values?.[x]!==h.expected);if(L>=0){const h=c.values?.[L]===null?"返回了 None。":"返回值与约定不符。";return{...c,assessmentIssue:y+"第 "+(L+1)+" 次调用"+h}}if(i.kind==="function")return c}const v=b.length?{artifacts:b.map(y=>y.name)}:void 0,k=await ht({...u,inspection:v},r,o);if(k.status!=="OK")return k;for(const y of b){const E=k.artifacts?.find(L=>L.name===y.name),c="文件产物 "+y.name+" ";if(E?.content===void 0)return{...k,assessmentIssue:c+(E?.error??"未生成。")};if(s&&E.content!==y.content){const L=ae(y.content,E.content);return{...k,assessmentIssue:c+"内容不一致。"+(L??"请检查文件的结束换行。")}}}return k}const bt=t=>f.solved[t.id]?"已通过":f.attempts[t.id]?.length?"已尝试":"未开始",ve=t=>["easy","basic","advanced"][["入门","基础","进阶"].indexOf(t)],As=t=>'<a class="table-link" href="#problem/'+t.id+'">'+a(t.title)+"</a>",It=t=>t.origin?.kind==="adapted"?"经典改编":"原创";function Cs(t){const e=t.origin;return e?.kind!=="adapted"?"":`<details class="problem-source"><summary>查看原题出处</summary>
    <p>${a(e.platform)} · ${a(e.id)} · ${a(e.level)}</p>
    <p>${a(e.concepts.join("、"))}</p><p>${a(e.adaptation)}</p>
    <p>本站题面、用例和参考解独立撰写。原题链接供查阅，原站材料按原站权利与条款使用。</p>
    <a class="inline-link" href="${a(e.url)}" target="_blank" rel="noopener noreferrer">${a(e.title)} ↗</a></details>`}function Ps(t){const e=t.guide;return e?`
    <div class="solution-guide">
      <h3>解题思路与算法选择</h3><p>${a(e.approach)}</p>
      <h3>考查知识点</h3><p>${a(e.concepts.join("、"))}</p>
      <h3>参考代码</h3>${P(t.solution)}
      ${(t.solutionFiles??[]).map(n=>"<h4>"+a(n.name)+"</h4>"+P(n.content)).join("")}
      <h3>代码逐步解释</h3><ol>${e.steps.map(n=>"<li>"+a(n)+"</li>").join("")}</ol>
      <dl><dt>时间复杂度</dt><dd>${a(e.time)}</dd><dt>空间复杂度</dt><dd>${a(e.space)}</dd></dl>
      <h3>容易出现的错误</h3><p>${a(e.pitfall)}</p>
      <h3>拓展问题</h3><p>${a(e.extension)}</p>
    </div>`:P(t.solution)}function Is(t){const e=n=>"<ul>"+n.map(r=>"<li>"+a(r)+"</li>").join("")+"</ul>";return`<details open><summary>项目实施路线</summary>
    <h3>技术与功能要求</h3>${e(t.requirements)}
    <h3>需求分析与设计</h3>${e(t.design)}
    <h3>分阶段实现</h3>
    <ol>${t.stages.map(n=>`<li><strong>${a(n.title)}</strong>
      <p>${a(n.work)}</p><p>自测 · ${a(n.check)}</p></li>`).join("")}</ol>
    <h3>验收清单</h3>${e(t.checklist)}
    <h3>拓展挑战</h3>${e(t.extensions)}
  </details>`}function ye(t,e,n,r,o){const[s,i,p,m]=t.sample,b=t.contract?.kind==="function"&&m?.fixtures?.some(g=>g.name===t.contract?.target?.module+".py"),d=R.findIndex(g=>g.tag===t.tag),u=R[d],v=nt.find(g=>g.tag===t.tag),k=v?tt(v):"learn/"+(d+1),y=v?"bank/advanced/"+encodeURIComponent(v.tag):t.practice?"bank/independent":"bank",E=(r?"project:":"problem:")+t.id,c=o?"projects":r?"learn":y,L=o?"综合项目":r?"学习路径":"题库",h=o?"项目先修课程":r?"回顾综合应用":"本题所属课程";n.innerHTML=`
    <div class="problem-crumbs"><a class="inline-link" href="#${c}">← ${L}</a><a class="inline-link" href="#${k}">${h}</a></div>
    <div class="problem-heading"><h1>${r?"":"<code>"+a(t.id)+"</code> "}${a(t.title)}</h1>
      <span class="difficulty ${ve(t.difficulty)}">${t.difficulty}</span><span class="tag">${t.tag}</span>
      <span class="tag">${It(t)}</span><span class="tag" id="personal">${bt(t)}</span></div>
    <div class="panel-switch" aria-label="做题区域">${["题面","代码","评测"].map((g,A)=>'<button class="button secondary" type="button" data-pane="'+A+'" aria-pressed="'+(A===0)+'">'+g+"</button>").join("")}</div>
    <div class="problem-layout" data-active="0">
      <article class="surface problem-panel statement" data-area="0" aria-label="题面">
        ${t.background?"<h2>题目背景</h2><p>"+a(t.background)+"</p>":""}
        <h2>题目描述</h2><p>${a(t.description)}</p>
        ${o?Is(o):""}
        ${t.practice?"<h3>章外练习 · "+a(t.practice.tier)+"</h3><p>先修 "+a(t.practice.prerequisites)+"</p><p>主要知识 "+a(t.practice.primary.join("、"))+"。次要知识 "+a(t.practice.secondary.join("、"))+"。</p>":""}
        <h2>输入格式</h2><p>${a(t.input)}</p>
        <h2>输出格式</h2><p>${a(t.output)}</p>
        ${t.outputComparison==="exact"?"<p>本题精确比较文本。LF、CRLF 和 CR 视为同一种换行，保留行首、行内和行尾空白以及空行。最后一行的结束换行可省略。</p>":""}
        <div class="section-heading"><h2>样例</h2><button class="button secondary" type="button" id="sample-run">试跑样例</button></div>
        ${b?"<p>样例直接导入你的代码，检查返回值、对象状态或回调记录。</p>":`<div class="comparison samples">
          <div><div class="section-heading"><h3>样例输入</h3><button class="link-button" type="button" id="copy-input">复制输入</button></div>${P(s)}</div>
          <div><div class="section-heading"><h3>样例输出</h3><button class="link-button" type="button" id="copy-output">复制输出</button></div>${P(i)}</div>
        </div>`}
        <h2>样例解释</h2><p>${a(p)}</p>
        ${m?.calls&&!b?"<h3>样例调用与返回值</h3>"+P(m.calls.map(g=>t.contract?.target?.name+"("+g.args.map(A=>JSON.stringify(A)).join(", ")+") → "+JSON.stringify(g.expected)).join(`
`)):""}
        ${(m?.fixtures??[]).map(g=>"<h3>"+(b?"样例检查代码":"样例输入文件 "+a(g.name))+"</h3>"+P(g.content)).join("")}
        ${(m?.artifacts??[]).map(g=>"<h3>样例产物 "+a(g.name)+"</h3>"+P(g.content)).join("")}
        <h2>数据范围</h2><p>${a(t.limits)}</p>
        ${v&&t.guide?"<h2>考查知识点</h2><p>"+a(t.guide.concepts.join("、"))+"</p>":""}
        ${Cs(t)}
        <details><summary>提示 1 · 思路</summary><p>${a(t.hints[0])}</p></details>
        <details><summary>提示 2 · 实现</summary><p>${a(t.hints[1])}</p></details>
        <details><summary>查看参考解法</summary>${Ps(t)}</details>
      </article>
      <section class="surface problem-panel" data-area="1"><h2>代码编辑器</h2><div data-editor></div></section>
      <section class="surface problem-panel evaluation" data-area="2"><h2>运行与评测</h2>
        <div data-console></div>
        <details class="history"><summary>评测记录</summary><div id="attempts"></div></details>
      </section>
    </div>`;const x=v?.chapter??kt[t.tag],l=x?.exercises.find(g=>g.kind==="coding"&&g.problem===t.id),$=x&&l?.kind==="coding"?Jt(x).find(g=>g.id===l.starterExample)?.source:void 0,S=`# 在此编写解法
`,C=e?$??(u?.exampleFiles?`import math

# 按题意调整模块调用和输入输出
`:u?.example??S):S,q=t.starterFiles??(t.contract?[{name:"main.py",content:C}]:void 0),_=r??(q?f.taskWorkspaces[t.id]??={files:q.map(g=>({...g})),active:"main.py",entry:"main.py",input:s}:{files:[{name:"main.py",content:f.drafts[t.id]??C}],active:"main.py",entry:"main.py",input:f.problemInputs[t.id]??s}),O=w(n,".problem-layout");function U(g){O.dataset.active=String(g);for(const A of n.querySelectorAll("[data-pane]"))A.setAttribute("aria-pressed",String(A.getAttribute("data-pane")===String(g)))}for(const g of n.querySelectorAll("[data-pane]"))g.addEventListener("click",()=>U(Number(g.dataset.pane)));function ct(){!q&&!r&&(f.drafts[t.id]=_.files[0].content,f.problemInputs[t.id]=_.input),G()}const M=le(n,_,ct,t.contract?.kind==="module",!1,!0,()=>U(1),E,!0);function qt(){const g=f.attempts[t.id]??[];w(n,"#personal").textContent=bt(t),w(n,"#attempts").innerHTML=g.length?'<ul class="attempt-list">'+g.map(A=>"<li>"+dt(A.verdict)+"<span>"+A.passed+" / "+A.total+" 组</span><time>"+a(new Date(A.date).toLocaleString("zh-CN",{hour12:!1}))+"</time></li>").join("")+"</ul>":'<p class="muted">还没有提交记录。</p>'}qt();const _t=(g,A)=>vt(g,t.outputComparison)===vt(A,t.outputComparison);function Rt(g,A){if(t.outputComparison!=="exact")return"";const D=ae(g,A);return D?'<p class="muted">'+a(D)+"</p>":""}function Ot(g,A,D,W=""){const J=["OK","RE","TLE","OLE"].includes(g.status),X=_t(i,g.stdout),ut=g.status!=="OK"||!!g.assessmentIssue||!X,Y=A&&J?ut?dt(g.status==="OK"?"WA":g.status)+(g.status==="OK"?Rt(i,g.stdout):"")+(X&&g.assessmentIssue?"":Vt(i,g.stdout)):'<p class="passed">'+(t.contract?"样例契约通过":"样例输出一致")+"</p>":"";M.setResult(W+Y+yt(g),g,D)}const st=f.runs[E];st&&Ot(st.report,!!st.sample&&!st.truncated,st.snapshot,de(st.truncated));async function Nt(){await M.act(async g=>{U(2);const A=M.editor.snapshot(M.input.value);M.pending("正在加载隔离解释器…");const D=A.input===s,W=await Ht(t,A,m,g,()=>M.pending("程序正在运行…"),D);M.active()&&(re(E,W,A,D),Ot(W,D,A))})}return M.run.addEventListener("click",()=>{Nt()}),w(n,"#sample-run").addEventListener("click",()=>{M.run.disabled||(M.input.value=s,_.input=s,ct(),Nt())}),b||(w(n,"#copy-input").onclick=g=>{Ut(g.currentTarget,s)},w(n,"#copy-output").onclick=g=>{Ut(g.currentTarget,i)}),M.submitButton.addEventListener("click",()=>{M.act(async g=>{U(2),ct();const A=[[s,i,m],...t.cases],D=M.editor.snapshot("");let W=0,J="AC",X,ut="",Y="";for(const[Se,Ft,je]of A){M.pending("正在评测第 "+(W+1)+" / "+A.length+" 组…");const z=await Ht(t,{...D,input:Se},je,g);if(!M.active())return;if(z.status==="STOP"||z.status==="UNAVAILABLE"||z.status==="INVALID"){M.setResult(yt(z));return}if(z.status!=="OK"||z.assessmentIssue||!_t(Ft,z.stdout)){J=z.status==="OK"?"WA":z.status,W||(X=z),z.assessmentIssue?Y=z.assessmentIssue:J==="WA"?(ut=Rt(Ft,z.stdout),t.contract&&(Y="标准输出与题面约定不符。")):z.diagnostic&&(t.contract||q)&&(Y="运行异常 · "+z.diagnostic.kind);break}W++}ws(t.id,{date:Date.now(),verdict:J,passed:W,total:A.length}),qt(),M.setResult('<div class="result-heading">'+dt(J)+"<span>通过 "+W+" / "+A.length+" 组</span></div>"+(J==="AC"?'<p class="passed">全部用例通过，已更新完成状态。</p>':'<p class="muted">'+(X?"样例未通过。":"非样例用例未通过。")+a(Ct[J])+"</p>")+(Y?'<p class="muted">'+a(Y)+"</p>":"")+ut+(X&&!X.assessmentIssue?Vt(i,X.stdout):"")+(J==="WA"&&t.guide?'<p class="muted">'+a(t.guide.pitfall)+"</p>":""),X,D)})}),M.dispose}const be="py-path.appearance.v1";function Ts(){try{return localStorage.getItem(be)==="light"?"light":"dark"}catch{return"dark"}}let at=Ts();function ke(){const t=document.documentElement;t.dataset.theme=at;const e=getComputedStyle(t).getPropertyValue("--page").trim();e&&document.querySelector('meta[name="theme-color"]')?.setAttribute("content",e)}ke();function Ms(t){const e=t.querySelector(".theme-label"),n=()=>{t.setAttribute("aria-pressed",String(at==="light")),e.textContent=at==="light"?"浅色":"深色"};n(),t.addEventListener("click",()=>{at=at==="dark"?"light":"dark",ke(),n();try{localStorage.setItem(be,at)}catch{}})}const it=w(document,"#app");let K=()=>{};const $e=[["learn","从零开始","按章节读懂示例，动手改写，再独立解题。","基础篇与进阶篇","green","▤"],["bank","题库练习","查找练习题，运行样例并提交评测。",rt.length+" 道题","blue","⌘"],["review","专项复习","速查知识点和典型错误，重做错题。",R.length+nt.length+" 个知识点","purple","↺"],["lab","在线工作台","在浏览器编辑并运行多文件 Python。","多文件编辑","orange","›_"]];function j(t,e,n="button"){return'<a class="'+n+'" href="#'+t+'">'+e+"</a>"}function B(t,e){const n=t==="problem"?"bank":t==="project"||t==="projects"?"learn":t;return it.innerHTML=`
    <a href="#main-content" class="skip">跳过导航</a>
    <header class="site-header"><div class="site-width header-inner">
      <a class="brand" href="#home" aria-label="Py径首页"><span class="brand-icon" aria-hidden="true">›_</span><strong>Py径</strong></a>
      <nav aria-label="主导航">${$e.map(([r,o,,,,s])=>'<a href="#'+r+'"'+(n===r?' aria-current="page"':"")+'><span class="nav-icon" aria-hidden="true">'+s+"</span>"+o+"</a>").join("")}</nav>
      <div class="header-tools">
        <span class="local-state" id="local-storage">${pt?"本地存储不可用或已满":"仅本地保存"}</span>
        <button type="button" class="theme-toggle" aria-label="浅色主题"><span class="theme-icon" aria-hidden="true"></span><span class="theme-label" aria-hidden="true"></span></button>
      </div>
    </div></header>
    <main id="main-content" class="site-width main-content" data-page="${t}" tabindex="-1">${e}</main>
    <footer class="site-width footer"><a href="#home">Py径</a><span>简体中文 Python 学习平台</span></footer>`,w(it,".skip").addEventListener("click",r=>{r.preventDefault(),w(it,"main").focus()}),Ms(w(it,".theme-toggle")),w(it,"main")}const V=(t,e)=>'<div class="page-heading"><h1>'+a(t)+"</h1><p>"+a(e)+"</p></div>";function we(){return'<div class="project-grid">'+wt.map(t=>`
    <a class="surface project-card" href="#project/${t.id}"><span class="project-art" aria-hidden="true"></span>
      <span class="tag">${a(t.tags)}${t.assessment&&f.solved[t.id]?" · 已通过":""}</span><h3>${a(t.title)}</h3>
      <p>${a(t.description)}</p><span class="card-arrow" aria-hidden="true">↗</span>
    </a>`).join("")+"</div>"}const qs=()=>'<section class="home-section"><div class="section-heading"><h2>综合项目</h2></div>'+we()+"</section>";function xe(t,e){return'<div class="lesson-grid">'+t.map((n,r)=>`
    <a class="surface lesson-card" href="#${n.route}"><span class="lesson-number">${String(r+1).padStart(2,"0")}</span>
      <div><span class="muted">${a(n.tag)}</span><${e}>${a(n.title)}</${e}></div>
      <span class="tag">${n.completed} / ${n.total}</span>
      <span class="lesson-meter" aria-hidden="true"><i style="width: ${n.total?Math.round(n.completed/n.total*100):0}%"></i></span></a>`).join("")+"</div>"}function Ee(t,e,n=t.map(r=>xt(r.chapter))){return xe(t.map((r,o)=>({...n[o],tag:r.tag,title:r.title,route:tt(r)})),e)}function _s(){return`<section class="home-section" aria-labelledby="advanced-courses-title">
    <div class="section-heading"><h2 id="advanced-courses-title" tabindex="-1">第二阶段 · Python 进阶</h2></div>
    <div class="advanced-stage">${et.map((t,e)=>`<section class="advanced-module" aria-labelledby="module-${t.slug}">
      <div class="section-heading"><div class="module-title">
        <span class="module-mark" data-tone="${e%3}" aria-hidden="true">${["{ }","[…]","ƒ()"][e%3]}</span>
        <h3 id="module-${t.slug}">${a(t.title)}</h3><span class="module-count" aria-hidden="true">${t.lessons.length} 节课</span></div>
        ${j($t(t),"模块介绍与测评 →","inline-link")}</div>
      ${Ee(t.lessons,"h4")}
    </section>`).join("")}</div>
  </section>`}function Rs(){const t=new URL(""+new URL("python-logo-only-Bt12VGEE.png",import.meta.url).href,import.meta.url).href,n=R.map((o,s)=>Mt(s)).findIndex(o=>o.completed<o.total),r="learn/"+((n<0?0:n)+1);B("home",`
    <section class="hero">
      <div class="hero-copy">
        <div class="hero-label"><span></span><b class="hero-badge" aria-hidden="true">Python 3.12</b> 中文 Python 学习实验室</div>
        <h1>从第一行代码，<br>到<span>独立解题。</span></h1>
        <p>跟着课程读懂代码、动手运行，再用题目检验掌握程度。已有基础也可以直接刷题，随时回顾错题。</p>
        <div class="hero-actions">${j(r,n>0?"继续学习　→":"开始第一课　→","button primary")}${j(tt(nt[0]),"学习进阶篇","button secondary")}${j("projects","综合项目","button secondary")}${j("bank","浏览题库","button secondary")}</div>
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
              <img src="${a(t)}" width="269" height="326" alt=""><sup>™</sup>
            </span>
          </div>
        </div>
      </div>
      <div class="hero-stats" aria-hidden="true">
        <div><strong>${R.length}</strong><span>节基础课程</span></div>
        <div><strong>${nt.length}</strong><span>节进阶课程</span></div>
        <div><strong>${rt.length}</strong><span>道题</span></div>
        <div><strong>${wt.length}</strong><span>个综合项目</span></div>
      </div>
    </section>
    <section class="home-section">
      <div class="section-heading"><h2>选择你的学习方式</h2></div>
      <div class="entry-grid">${$e.map(([o,s,i,p,m,b])=>`
        <a class="surface entry-card ${m}" href="#${o}">
          <span class="entry-glow" aria-hidden="true"></span>
          <span class="entry-icon" aria-hidden="true">${b}</span><span class="card-arrow" aria-hidden="true">↗</span>
          <h3>${s}</h3><p>${i}</p><span class="entry-metric">${p}</span>
        </a>`).join("")}</div>
    </section>
    <section class="home-section" aria-hidden="true">
      <div class="feature-strip">
        <div class="surface feature-card">
          <div class="feature-visual"><span class="fv-pill">Python 3.12</span><span class="fv-pill muted">WASM 隔离沙箱</span></div>
          <h3>打开浏览器即写即跑</h3>
          <p>内置独立 Python 运行环境，无需本地安装配置，支持多文件编辑与标准输入。</p>
        </div>
        <div class="surface feature-card">
          <div class="feature-visual"><span class="fv-verdict ac">AC</span><span class="fv-verdict wa">WA</span><span class="fv-verdict re">RE</span><span class="fv-verdict tle">TLE</span><span class="fv-verdict ole">OLE</span></div>
          <h3>即时评测与报错定位</h3>
          <p>支持样例试跑与多组用例评测，运行出错直接给出中文说明并定位到对应代码行。</p>
        </div>
        <div class="surface feature-card">
          <div class="feature-visual"><span class="fv-dot"></span><code>localStorage · 深/浅主题</code></div>
          <h3>纯本地保存 · 随时回顾</h3>
          <p>代码草稿、提交记录与错题自动保存在本地浏览器，不上传任何个人数据。</p>
        </div>
      </div>
    </section>`)}function Os(){const t=R.map((o,s)=>Mt(s)),e=t.filter(o=>o.completed===o.total).length,n=t.reduce((o,s)=>o+s.completed,0),r=t.reduce((o,s)=>o+s.total,0);B("learn",V("从零开始","从标准输入输出到综合解题。按路线前进，或直接进入感兴趣的章节。")+'<p class="learning-overview muted">已完成 '+e+" / "+R.length+" 节课 · 已完成 "+n+" / "+r+' 个学习检查与练习</p><section id="foundation-courses" aria-label="基础篇课程">'+xe(R.map((o,s)=>({...t[s],tag:o.tag,title:o.title,route:"learn/"+(s+1)})),"h2")+"</section>"+_s()+qs())}function Ns(){B("projects",j("home","← 返回首页","inline-link")+V("综合项目","把所学知识串联成完整程序，按验收标准调试并提交。")+we())}function Fs(){B("learn",j("learn","← 基础篇","inline-link")+V("第二阶段 · Python 进阶与编程能力提升","完成基础篇后，按数据结构、表达方式、函数机制和程序设计的顺序继续学习。")+`<section class="home-section">
      <div class="project-grid">
        ${et.map(t=>`<a class="surface project-card" href="#${$t(t)}">
          <span class="tag">${t.lessons.length} 节课</span><h3>${a(t.title)}</h3>
          <p>${a(t.introduction)}</p><span class="card-arrow" aria-hidden="true">↗</span></a>`).join("")}
      </div>
    </section>`)}function zs(t){const e=t.lessons.map(i=>xt(i.chapter)),n=e.reduce((i,p)=>i+p.total,0),r=e.reduce((i,p)=>i+p.completed,0),o=et[et.indexOf(t)+1],s=i=>"<ul>"+i.map(p=>"<li>"+a(p)+"</li>").join("")+"</ul>";B("learn",j("learn","← 学习路径","inline-link")+V(t.title,t.introduction)+`<section class="surface lesson-stage chapter-overview">
      <div class="section-heading"><h2>学习目标</h2><span class="tag">已完成 ${r} / ${n} 项</span></div>
      ${s(t.goals)}
      <h3>前置知识</h3><p>${a(t.prerequisites)}</p>
    </section>
    <section class="home-section"><div class="section-heading"><h2>课程顺序</h2>
      ${j("bank/advanced","进阶题库 →","inline-link")}</div>
      ${Ee(t.lessons,"h3",e)}
    </section>
    <section class="surface lesson-stage chapter-overview home-section">
      <h2>知识关联与阶段测评</h2>
      <figure class="chapter-diagram"><figcaption>${a(t.mapCaption)}</figcaption>${P(t.map)}</figure>
      ${s(t.summary)}
      <ul class="practice-list">${[...t.practice,t.assessment].map(i=>`<li>
        <div>${j("problem/"+i.id,i.label,"inline-link")}<p>${a(i.criterion)}</p></div>
        <span class="tag">${f.solved[i.id]?"已通过":f.mistakes[i.id]?"待重做":"待练习"}</span>
      </li>`).join("")}</ul>
      <h3>章外迁移测评</h3>
      <ul class="practice-list"><li>
        <div>${j("problem/"+t.transfer.id,t.transfer.label,"inline-link")}<p>${a(t.transfer.criterion)}</p></div>
        <span class="tag" data-transfer-status>${f.solved[t.transfer.id]?"已通过":f.mistakes[t.transfer.id]?"待重做":"待练习"}</span>
      </li></ul>
    </section>${o?`<div class="lesson-next">${j($t(o),"下一模块 · "+a(o.title)+" →","button secondary")}</div>`:""}`)}function Bs(t,e,n){const r=t.lessons[e],o=t.lessons[e-1],s=t.lessons[e+1],i=$t(t),p=`<aside class="surface lesson-aside"><h2>课程目录</h2>${et.map(d=>`<h3>${a(d.title)}</h3>`+d.lessons.map((u,v)=>`<a href="#${tt(u)}" ${u.slug===r.slug?'aria-current="page"':""}><span>${String(v+1).padStart(2,"0")}</span>${a(u.title)}</a>`).join("")).join("")}</aside>`,m=B("learn",'<div class="lesson-hero">'+j(i,"← "+a(t.title),"inline-link")+V("第 "+(e+1)+" 课 · "+r.title,"第二阶段 · "+t.title)+'</div><div class="lesson-layout">'+p+'<div class="lesson-body" data-chapter></div></div>'),b=(o?j(tt(o),"← 上一课","button secondary"):"")+(s?j(tt(s),"下一课 →","button secondary"):j("problem/"+t.assessment.id,"开始课内阶段测评 →","button primary")+j("problem/"+t.transfer.id,"开始章外迁移测评 →","button secondary")+j(i,"返回模块","button secondary"));K=ge(w(m,"[data-chapter]"),r.slug,r.chapter,n,b)}function Kt(t){return`<aside class="surface lesson-aside"><h2>课程目录</h2>${R.map((e,n)=>`
    <a href="#learn/${n+1}" ${n===t?'aria-current="page"':""}>
      <span>${String(n+1).padStart(2,"0")}</span>${e.title}</a>`).join("")}</aside>`}function Us(t,e){const n=R[t],r=kt[n.tag];if(r){const d=B("learn",'<div class="lesson-hero">'+j("learn","← 学习路径","inline-link")+V("第 "+(t+1)+" 课 · "+n.title,n.tag)+'</div><div class="lesson-layout">'+Kt(t)+'<div class="lesson-body" data-chapter></div></div>');K=ge(w(d,"[data-chapter]"),t,r,e);return}const[o,s]=pe(t),i=(d,u)=>`
    <fieldset class="quiz" data-quiz="${d}"><legend>${a(n[d].question)}</legend>
      ${n[d].choices.map((v,k)=>'<button type="button" class="button secondary" data-answer="'+k+'">'+a(v)+"</button>").join("")}
      <p class="quiz-feedback" role="status">${u?"已通过知识检查。":""}</p></fieldset>`,p=B("learn",'<div class="lesson-hero">'+j("learn","← 学习路径","inline-link")+V("第 "+(t+1)+" 课 · "+n.title,n.tag)+`</div>
    <div class="lesson-layout">
      ${Kt(t)}
      <div class="lesson-body">
        <section class="surface lesson-stage"><h2><span>1</span>讲解</h2><p>${a(n.theory)}</p>
          ${i("check",!!f.progress[t]?.explain)}</section>
        <section class="surface lesson-stage"><h2><span>2</span>运行示例</h2>
          <p>先完成下面的新情境预测，再运行示例，观察程序如何处理输入。</p>
          ${i("predict",!!f.progress[t]?.predict)}
          <div data-editor></div><div data-console></div></section>
        <section class="surface lesson-stage"><h2><span>3</span>修改示例</h2>
          <p>以本课示例为起点，按新题目调整输入、逻辑和输出。${a(o.description)}</p>
          ${j("problem/"+o.id+"/modify",(f.solved[o.id]?"已通过 · ":"")+o.id+" "+o.title+" →","button secondary")}</section>
        <section class="surface lesson-stage"><h2><span>4</span>独立练习</h2><p>${a(s.description)}</p>
          ${j("problem/"+s.id,(f.solved[s.id]?"已通过 · ":"")+s.id+" "+s.title+" →","button secondary")}</section>
        <div class="lesson-next">${t?j("learn/"+t,"← 上一课","button secondary"):""}
          ${t<R.length-1?j("learn/"+(t+2),"下一课 →","button secondary"):j("learn","查看综合项目 →","button secondary")}</div>
      </div>
    </div>`),m={files:[{name:"main.py",content:n.example},...(n.exampleFiles??[]).map(d=>({...d}))],active:"main.py",entry:"main.py",input:n.input},b=()=>{f.progress[t]?.example&&f.progress[t]?.predict&&Lt(t,"run")};for(const d of["check","predict"]){const u=w(p,'[data-quiz="'+d+'"]');u.addEventListener("click",v=>{const k=v.target.closest("[data-answer]");if(!k)return;const y=Number(k.dataset.answer)===n[d].answer;w(u,".quiz-feedback").textContent=(y?"回答正确。":"再想一想。")+n[d].feedback,y&&(Lt(t,d==="predict"?"predict":"explain"),b())})}K=Tt(p,m,()=>{},{readOnly:!0,notify(d){d.status==="OK"&&(Lt(t,"example"),b())}})}function St(t="",e="",n=""){const r=[...R,...nt].map(y=>y.tag),o=new Set(nt.map(y=>y.tag)),s=B("bank",V("题库练习","运行可自行测试，提交评测后记录学习结果。")+`
    <div class="hero-actions">${j("bank/advanced","进阶练习","button secondary")}${j("bank/independent","章外练习","button secondary")}
      ${jt.map(y=>j("bank/independent/"+encodeURIComponent(y),y,"button secondary")).join("")}</div>
    <section class="surface bank-panel">
      <div class="filters">
        <label>搜索题目<input type="search" id="search" placeholder="题号、标题或知识点"></label>
        <label>练习范围<select id="scope"><option value="">全部练习</option><option value="chapter">章内</option>
          <option value="independent">全部章外</option>${jt.map(y=>"<option>"+y+"</option>").join("")}</select></label>
        <label>学习阶段<select id="stage"><option value="">全部阶段</option><option value="foundation">基础篇</option>
          <option value="advanced">进阶篇</option></select></label>
        <label>知识点<select id="tag"><option value="">全部知识点</option>${r.map(y=>"<option>"+a(y)+"</option>").join("")}</select></label>
        <label>难度<select id="difficulty"><option value="">全部难度</option><option>入门</option><option>基础</option><option>进阶</option></select></label>
        <label>来源<select id="origin"><option value="">全部来源</option><option>原创</option><option>经典改编</option></select></label>
        <label>完成状态<select id="completion"><option value="">全部状态</option><option>未开始</option><option>已尝试</option><option>已通过</option><option>待重做</option></select></label>
      </div><p id="match-count" class="muted count" role="status"></p><div id="matches"></div>
    </section>`),i=w(s,"#search"),p=w(s,"#scope"),m=w(s,"#stage"),b=w(s,"#tag"),d=w(s,"#difficulty"),u=w(s,"#origin"),v=w(s,"#completion");b.value=r.includes(t)?t:"",p.value=e,m.value=n;function k(){const y=i.value.trim().toLowerCase(),E=rt.filter(c=>[c.id,c.title,c.tag,...c.guide?.concepts??[],...c.origin?.kind==="adapted"?[c.origin.title,c.origin.platform,c.origin.id]:[]].join(" ").toLowerCase().includes(y)&&(!p.value||(p.value==="chapter"?!c.practice:p.value==="independent"?!!c.practice:p.value===c.practice?.tier))&&(!m.value||m.value==="advanced"===o.has(c.tag))&&(!b.value||c.tag===b.value)&&(!d.value||c.difficulty===d.value)&&(!u.value||It(c)===u.value)&&(!v.value||(v.value==="待重做"?f.mistakes[c.id]:bt(c)===v.value)));w(s,"#match-count").textContent="共 "+E.length+" 道题",w(s,"#matches").innerHTML=E.length?`
      <div class="table-scroll"><table role="table"><thead role="rowgroup"><tr role="row"><th scope="col">题号</th><th scope="col">标题</th><th scope="col">难度</th><th scope="col">知识点</th><th scope="col">来源</th><th scope="col">完成状态</th></tr></thead>
      <tbody role="rowgroup">${E.map(c=>`<tr role="row"><td role="cell"><code>${c.id}</code></td><td role="cell">${As(c)}</td>
        <td role="cell"><span class="difficulty ${ve(c.difficulty)}">${c.difficulty}</span></td>
        <td role="cell"><span class="tag">${c.tag}</span>${c.practice?' <span class="tag">'+a(c.practice.tier)+"</span>":""}</td><td role="cell">${It(c)}</td>
        <td role="cell" class="${f.solved[c.id]?"passed":"muted"}">${bt(c)}</td></tr>`).join("")}</tbody></table></div>`:'<p class="empty">当前没有符合条件的题目。</p>'}w(s,".filters").addEventListener("input",k),k()}function Ds(){const t=wt.flatMap(s=>s.assessment??[]),e=[...rt,...t].filter(s=>f.mistakes[s.id]),n=[...R.map((s,i)=>({...s,chapter:kt[s.tag],route:"learn/"+(i+1),bankRoute:"bank/"+encodeURIComponent(s.tag),stats:Mt(i)})),...nt.map(s=>({...s,route:tt(s),bankRoute:"bank/advanced/"+encodeURIComponent(s.tag),stats:xt(s.chapter),theory:"",mistake:""}))],r=n.flatMap(s=>(s.chapter?.exercises??[]).flatMap(i=>i.kind==="question"&&f.questions[i.id]&&f.questions[i.id].lastChoice!==i.answer?[{exercise:i,route:s.route,tag:s.tag}]:[])),o=e.length+r.length;B("review",V("专项复习","回顾自己卡住的知识点，并用错题验证修正。")+`
    <section class="surface bank-panel"><div class="section-heading"><h2>错题重做</h2><span class="tag">${o} 道待重做</span></div>
      ${o?'<div class="wrong-list">'+e.map(s=>`
        <div><code>${s.id}</code><strong>${s.title}</strong><span class="tag">${s.tag}</span>
          ${dt(f.attempts[s.id][0].verdict)}${t.includes(s)?j("project/"+s.id,"重做结项","button secondary"):j("problem/"+s.id,"重做 "+s.id,"button secondary")}</div>`).join("")+r.map(({exercise:s,route:i,tag:p})=>`<div><span class="tag">${a(p)}</span><strong>${a(s.goal)}</strong>
          ${j(i+"/"+s.id,"重做知识题","button secondary")}</div>`).join("")+"</div>":'<p class="empty">暂无待重做的题目。答错知识题或提交评测遇到错误后，可从这里继续练习。</p>'}</section>
    <section class="home-section"><div class="section-heading"><h2>知识点速查</h2></div>
      <p class="muted learning-overview">正确率根据已记录的知识题答案和编程提交计算。</p>
      <div class="review-grid">${n.map(s=>{const{chapter:i,stats:p}=s;return`<article class="surface review-card">
        <h3>${s.tag}</h3><p class="topic-progress">${p.completed} / ${p.total} 已完成 · 正确率 ${fe(p.correctCount,p.attemptCount)}</p>
        <p>${a(i?.summary[0]??s.theory)}</p><h4>典型错误</h4><p>${a(i?.mistakes[0].fix??s.mistake)}</p>
        <div>${j(s.route,"复习课程","inline-link")}${j(s.bankRoute,"专项练习 →","inline-link")}</div>
      </article>`}).join("")}</div></section>`)}function Gt(t){if(t?.assessment){const r=f.projects[t.id]??={files:t.files.map(o=>({...o})),active:"main.py",entry:"main.py",input:t.input};K=ye(t.assessment,!1,B("project",""),r,t.brief);return}const e=B(t?"project":"lab",(t?j("learn","← 学习路径","inline-link"):"")+V(t?.title??"在线工作台",t?.description??"编辑多个文件，准备标准输入，在浏览器里运行 Python。")+(t?`
      <section class="surface project-brief"><h2>项目任务</h2><ol>${t.steps.map(r=>"<li>"+a(r)+"</li>").join("")}</ol>
        <details open><summary>验收样例与边界</summary>
          <div class="comparison"><div><h4>标准输入</h4>${P(t.input)}</div>
            <div><h4>期望输出</h4>${P(t.expected)}</div></div>
          <p>${a(t.acceptance)}</p></details>
        <details><summary>查看参考实现</summary>${P(t.solution)}</details></section>`:"")+`
    <div class="workbench-layout">
      <section class="surface problem-panel"><h2>工作区文件</h2><div data-editor></div></section>
      <section class="surface problem-panel"><h2>控制台</h2><div data-console></div></section>
    </div>`),n=t?f.projects[t.id]??={files:t.files.map(r=>({...r})),active:"main.py",entry:"main.py",input:t.input}:f.workspace;K=Tt(e,n,G,{manage:!0,resultKey:t?"project:"+t.id:"lab",prewarm:!t})}function Le(){K(),K=()=>{};const[t,e,n,r]=location.hash.slice(1).split("/"),o=rt.find(d=>d.id===e),s=wt.find(d=>d.id===e),i=Number(e)-1,p=t==="learn"&&e==="advanced"&&n?et.find(d=>d.slug===n||d.lessons.some(u=>u.slug===n)):void 0;if(!t||t==="home")Rs();else if(t==="learn"&&!e)Os();else if(t==="projects")Ns();else if(t==="learn"&&e==="advanced"&&!n)Fs();else if(p){const d=p.lessons.findIndex(u=>u.slug===n);d<0?zs(p):Bs(p,d,r)}else if(t==="learn"&&Number.isInteger(i)&&R[i])Us(i,n);else if(t==="bank"){let d="";try{d=decodeURIComponent(e??"")}catch{}if(d==="independent"){const u=jt.find(v=>encodeURIComponent(v)===n||v===n);St("",u??"independent")}else if(d==="advanced"){let u="";try{u=decodeURIComponent(n??"")}catch{}St(u,"","advanced")}else St(d)}else t==="review"?Ds():t==="lab"?Gt():t==="problem"&&o?K=ye(o,n==="modify",B("problem","")):t==="project"&&s?Gt(s):B("",V("页面未找到","请从首页选择学习入口。")+j("home","返回首页"));window.scrollTo(0,0);const m=it.querySelector(".lesson-aside"),b=m?.closest(".lesson-layout");if(m&&b){const d=()=>{const k=Math.ceil(b.getBoundingClientRect().top);m.style.setProperty("--lesson-directory-top",k+"px")};d();const u=new AbortController;addEventListener("scroll",d,{passive:!0,signal:u.signal}),addEventListener("resize",d,{signal:u.signal});const v=K;K=()=>{u.abort(),v()}}}addEventListener("hashchange",Le);Le();
