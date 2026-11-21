const i={goals:["【理解】区分脚本、标准输入和标准输出，读懂引号里的固定文字、变量名和调用参数。","【独立使用】按题面逐行读取文本，保留编号和姓名原样，分清空行和输入结束。","【独立使用】用 print 的默认行为、sep、end 和 f-string 排出一张符合约定的回执。"],prerequisites:"从零开始。打开任一示例，点「载入示例编辑器」，查看 main.py 和标准输入，先猜输出，再点「运行」。源代码放在编辑器，交给程序的资料放在标准输入框，程序打印的文字出现在标准输出。",version:"示例对应平台内置的 Python 3.12，使用脚本运行方式。",topics:[{title:"把结果写出来",explanation:["没有分支和循环时，可以把程序看成按顺序执行的清单。代码中位于引号外的 # 开始一段注释，解释器跳过这部分。成对的英文引号界定一个字符串字面量，它们通常不会出现在打印结果里。调用 print 时，括号里是要处理的参数。","print 先把各个值转换成文本，然后写到标准输出。逗号让值成为不同的参数。sep 默认是一个空格，放在参数之间。end 默认是换行，放在整次调用末尾。print() 即使没有内容参数，仍然会写出默认的换行。","回执可能需要分行，给其他程序的记录可能用竖线分隔。用 sep 控制字段边界，用 end 让两次打印在同一行接续。在交互式 Python 里单写表达式可能看到它的值，课程编辑器以脚本方式运行，单写字符串不会产生标准输出。","先运行「逐行打印馆内公告」，把第二个引号里的文字改成「请归还图书」再运行。预期只变第二行。接着把第二行改成只写文字（仍保留引号），预测少掉哪一行。"],examples:[{id:"two-lines",title:"逐行打印馆内公告",level:"起步",source:`# 馆内公告
print("阅览室开放")
print("请保持安静")
`,input:"",output:`阅览室开放
请保持安静
`,purpose:"观察脚本执行顺序和 print 默认的换行。",steps:["解释器跳过注释，执行第一个 print 并写出换行。","第二个 print 从新的一行开始。","两行内容都进入标准输出。"],pitfall:'单写一行 "阅览室开放" 不会让脚本产生输出。把要显示的值交给 print。'},{id:"ticket-format",title:"在同一行排出票根",level:"应用",source:`print("书展", "B区", sep="/", end=" → ")
print("入场")
`,input:"",output:`书展/B区 → 入场
`,purpose:"分别控制字段之间和每次调用末尾写出的字符。",steps:["第一次调用用 / 隔开书展和 B区。","end 写入空格、箭头和空格，输出仍在同一行。","第二次接着写入“入场”，使用默认换行。"],pitfall:"只修改 sep 会改变字段之间的间隔。要阻止第一次调用结束时的换行，需要指定 end。"}]},{title:"从标准输入逐行取值",explanation:["标准输入是程序接收数据的入口。在终端里它可以来自键盘。本平台把标准输入框的内容提前准备好，由 Python 按行读取。看到一次 input()，就想象读取位置向后前进了一行。","input() 返回 str，也就是字符串。它去掉行末换行，保留一行中的前导、内部和尾随空白。一行里有多个单词时，它们仍属于同一个字符串。空行可以产生空字符串，只有空格的行会返回空格，而读到输入末尾时会引发 EOFError。","用有意义的名字保存读到的值。city = input() 先执行右侧的读取，再让 city 指向得到的字符串。根据题面给每次读取写下对应字段，写输出时再排顺序，可以避免先后混淆。","编号 007 看起来像数字，但它是用来识别记录的文本。输入 007 时，变量保存三个字符，打印时应原样输出。像每行一个姓名和编号这样，先为每一行安排一次读取，再按需要排成一行。"],examples:[{id:"next-stop",title:"读取站名并播报",level:"起步",source:`city = input()
print("下一站", city)
`,input:`杭州
`,output:`下一站 杭州
`,purpose:"把一整行保存在名字里，随后拼入输出。",steps:["input 从标准输入读到“杭州”。","city 指向这个字符串。","print 按顺序输出固定文字和 city，默认插入一个空格。"],pitfall:'写成 print("下一站", "city") 会打印固定文本 city。使用变量名时不加引号。'},{id:"note-line",title:"保留姓名与空备注",level:"应用",source:`name = input()
note = input()
print("[", name, "]", sep="")
print("[", note, "]", sep="")
`,input:`阿 乔

`,output:`[阿 乔]
[]
`,purpose:"用成对括号显示字段边界，观察空输入行。",steps:["第一行得到含空格的完整姓名。","第二行为空，得到空字符串。","用空分隔符贴合括号，第二行可见一对空括号。"],pitfall:"只提供姓名一行会让第二次读取报 EOFError。要尝试空备注，请再提供一个空行。"}]},{title:"按输出约定交付结果",explanation:["input 可以接受一个提示语。它先把提示语写到标准输出，再读数据。交互式工具可以用它向人说明要输入什么。评测系统已经按照题面提供数据，额外提示语会进入被比对的输出。","本平台判题会统一换行，忽略每行末尾空白与输出末尾的空行。行内空格、中间的空行以及全角和半角标点仍有区别。做题时先画出规定的每一行，再决定如何用 print 写出来。","排查空格可以暂时使用 repr 观察字符串表示。它常用引号显示边界，并把制表符等字符写成转义形式。提交前移除这个调试输出，确保结果完全符合约定。",'回执只需要整齐并列的两个字段时，用 print(name, number)。需要每个字段之间都用竖线时，加 sep="|"。有标签、括号或不同标点时，用 f-string 把整行写成一张模板。','f 写在左引号前。花括号里是一个表达式，本课先放变量名。运行到 f"回执：{name}（{number}）" 时，Python 先取 name 和 number 的值，再把它们填进原来的文字；外层引号和花括号不进入输出。把生成的字符串作为一个参数交给 print，打印时只在整行末尾换行。','校对 P001「给包裹贴标签」时，用全角冒号「：」，并让姓名紧接冒号。print("收件人：" + name) 把两段文本拼成一个参数，也可用 print("收件人：", name, sep="") 或 print(f"收件人：{name}")。用「阿 乔」验证姓名内部的空格仍保留。'],examples:[{id:"prompt",title:"观察提示语进入了哪一栏",level:"起步",source:`name = input("姓名：")
print("到场", name)
`,input:`小禾
`,output:`姓名：到场 小禾
`,purpose:"区分预置输入和程序实际写到标准输出的文字。",steps:["input 先写“姓名：”，末尾没有换行。","读取预置的“小禾”，平台不会回显输入。","print 从提示语后面接着写。"],pitfall:"若题目只要“到场 小禾”，程序会答案错误。去掉提示参数并比较两次输出。"},{id:"inspect-space",title:"让空格在调试时可见",level:"应用",source:`label = input()
print(repr(label))
print("[", label, "]", sep="")
`,input:`  A  B 
`,output:`'  A  B '
[  A  B ]
`,purpose:"观察首尾和中间的空格是否都得到保留。",steps:["读入整行，保留原有空格。","repr 的引号让边界可见。","第二条 print 把方括号贴到原值两端。"],pitfall:"strip() 会删除两端空白。需要原样保留时，通过 repr 观察原值，用原来的 label 生成结果。"},{id:"receipt-fields",title:"用姓名与编号生成三种回执",level:"应用",source:`name = input()
number = input()
print(name, number)
print(name, number, sep="|")
print(f"回执：{name}（{number}）")
`,input:`小禾
007
`,output:`小禾 007
小禾|007
回执：小禾（007）
`,purpose:"从两行文本出发，比较默认空格、统一分隔符和带标签的模板。",steps:["第一次读取使 name 指向“小禾”。第二次使 number 指向“007”，三个字符都保留。","前两个 print 都接收两个参数，先用空格分隔，再用竖线分隔。最后先把两个字段填进模板，把整张回执作为一个参数打印。","把输入改成“阿 乔”和“000”，先写出三行结果。再只修改第三行的标签，并预测其他两行是否变化。"],pitfall:"漏写 f 会把花括号和里面的变量名原样打印。默认分隔的空格也会写到输出里。"}]}],exercises:[{kind:"question",id:"io-read-line",legacy:"explain",goal:"区分读取一整行和读取一个词。",prompt:"输入只有一行“海风 浪花”。调用一次 input() 会得到什么字符串？",answer:1,options:[{label:"海风",feedback:"这相当于先拆分再取首项。input() 本身会读取整行。"},{label:"海风 浪花",feedback:"行内的空格会保留，读取结果去掉的是行末换行。"},{label:"两行不同的字符串",feedback:"空格没有创建新行，一次 input() 只返回一个字符串。"}]},{kind:"question",id:"io-print-separator",legacy:"predict",goal:"根据参数顺序和默认分隔符手推输出。",prompt:"输入“昆明”。下面的程序会输出什么？",answer:2,demonstration:{source:`city = input()
print(city, "站")
`,input:`昆明
`,output:`昆明 站
`},options:[{label:"昆明站",feedback:'先拼接或指定 sep="" 才会连在一起。本题会在两项之间加一个空格。'},{label:"站 昆明",feedback:"print 按参数顺序输出，city 是第一项。"},{label:"昆明 站",feedback:"city 在前，默认分隔符会在两项中间加一个空格。"}]},{kind:"question",id:"io-prompt",goal:"识别评测输出里经常被漏算的提示语。",prompt:"输入“小禾”。下面程序的标准输出里会有什么？",answer:0,demonstration:{source:`name = input("你好，")
print(name)
`,input:`小禾
`,output:`你好，小禾
`},options:[{label:"一行“你好，小禾”",feedback:"input 先写提示语且不换行，print 接着显示姓名。"},{label:"一行“小禾”",feedback:"姓名来自 print，input 的提示语也进入标准输出。"},{label:"“你好，”和“小禾”各一行",feedback:"提示语末尾没有自动换行，两段文字出现在同一行。"}]},{kind:"coding",problem:"P001",level:"基础编程",warmup:!0,starterExample:"next-stop",goal:"把播报改成完整标签，核对全角标点和冒号后的空格。"},{kind:"coding",problem:"P025",level:"基础编程",warmup:!0,goal:"按模板隔开字段，控制方括号与竖线两侧的空格。"},{kind:"coding",problem:"P071",level:"基础编程",goal:"为多词姓名、带前导零编号和空备注逐行命名，按新顺序输出。"},{kind:"coding",problem:"P072",level:"综合应用",goal:"交叉配对两份输入，用 sep、end 或模板精确输出空栏和中间空行。"},{kind:"coding",problem:"P002",level:"综合应用",goal:"分别设计输入和输出顺序，原样保留多词字段。"},{kind:"coding",problem:"P026",level:"综合应用",goal:"区分空行和仅有空格的行，核对字段边缘。"},{kind:"coding",problem:"P027",level:"拓展挑战",goal:"从多行模板倒推字段次序、分隔符和中间空行。"}],mistakes:[{symptom:"输入框已有数据，仍报 EOFError。",reason:"input 次数超过实际行数，空备注也需要占一行。",fix:"按输入格式逐行填值，必要时提供完整空行。",check:"把每次 input 和样例的某一行配对。"},{symptom:"标签看似正确，评测却是 WA。",reason:"提示语、空格或全角标点可能不符合输出约定。",fix:"使用无参数的 input，并按题意选择 sep 或字符串拼接。",check:"比较期望和实际输出。可以临时用 repr 看清空格。"},{symptom:"屏幕显示固定的 name 字样。",reason:"引号里的 name 是字面文本。",fix:"用 print(name) 取出当前的值。",check:"输入两个不同的姓名，看看输出是否随之改变。"}],summary:["每次 input 读取一行字符串。原样保存编号、姓名和空白，并给不同字段安排清楚的读取顺序。","用 sep 控制参数之间的文字，用 end 控制调用末尾。带不同标签和标点的整行可用 f-string 表达。","回执先按题面写出预期行，再用不同输入验证，检查全角冒号、额外提示语、空行和字段边界。"],next:"下一课会把同一行的多个字段拆开，并且只把需要参与算术的数字文本转换为数值。",references:[{title:"Python 3.12 内置函数 · input",url:"https://docs.python.org/3.12/library/functions.html#input",note:"对照提示语、换行与 EOFError。"},{title:"Python 3.12 内置函数 · print",url:"https://docs.python.org/3.12/library/functions.html#print",note:"核对 sep、end 和默认输出流。"},{title:"Python 3.12 教程 · 输出格式",url:"https://docs.python.org/3.12/tutorial/inputoutput.html#fancier-output-formatting",note:"对照直接打印文本与用 repr 显示空白边界。"},{title:"Python 3.12 语言参考 · 表达式语句",url:"https://docs.python.org/3.12/reference/simple_stmts.html#expression-statements",note:"区分脚本里的求值和交互模式下的显示。"},{title:"Python 3.12 教程 · f-string",url:"https://docs.python.org/3.12/tutorial/inputoutput.html#formatted-string-literals",note:"核对 f 前缀、花括号内的表达式和求值后插入文本。"}]},o={goals:["【理解】跟踪重新赋值，区分字符串、整数、浮点数和格式化后的文本。","【独立使用】从一行或多行拆分、解包并转换数字，选择逐项转换或 map。","【独立使用】用整数运算处理商余、钟面及最少容器数，核对负数和整除边界。","【独立使用】从小数输入计算面积或数量，用 :.2f 按要求显示结果。"],prerequisites:"先完成第 1 课的逐行读取、print 和 f-string。能说明为何编号 007 保留成字符串，且能在一行回执中插入变量。",version:"示例按 Python 3.12 验证。Python 3 中两个整数做 / 得到浮点数，做 // 得到向下取整的整数。",topics:[{title:"名字、值与类型转换",explanation:["“名字 = 表达式”先计算等号右边，再让左边的名字指向结果。重新赋值可以改变一个名字所指的值。执行 stock = stock - 2 时，先读旧的 stock，再减去 2，最后把结果交给 stock。把每行运行后的值写在纸上，有助于理清顺序。",'类型属于值。引号包着的 "12" 是字符串，12 是整数。加号遇到两个字符串会拼接，遇到两个整数会相加。input 总是先获得文本，只在需要算术时才转换。若“007”是编号，保留字符串可以保住前导零。','int("12") 能解析整数文本。int("3.5") 会报 ValueError，因为文本里有小数点。int(3.5) 处理的则是一个已存在的浮点数，它朝零截断为 3。写程序时先看输入说明，再决定要把它读成哪种类型。','float("3.5") 把小数文本解析成浮点数 3.5。int(-3.5) 的参数已经是数值，截去小数部分得到 -3。int("3.5") 在解析文本时失败，程序会停在这一行，改成 float("3.5") 才能读取这种输入。第 11 课会处理失败的输入。',"对数值计数器，stock += 2 读旧值、加 2、再把新值存回 stock，效果同 stock = stock + 2。把借出示例的 stock = stock - 2 改成 stock -= 2，手推与运行的结果均应保持一致。"],examples:[{id:"text-or-number",title:"比较拼接和数值加法",level:"起步",source:`text = input()
print(text + "5")
number = int(text)
print(number + 5)
`,input:`8
`,output:`85
13
`,purpose:"观察同一份数据在转换前后的不同操作。",steps:['text 得到字符串 "8"。','两个字符串由 + 连接，得到 "85"。',"int 解析原有文本得到 8，再加上整数 5。"],pitfall:"text + 5 混合了字符串和整数，会报 TypeError。先决定要拼接还是求和，再选择类型。"},{id:"track-balance",title:"逐步追踪借出数量",level:"应用",source:`stock = int(input())
opening = stock
stock = stock - 2
print(opening, stock)
`,input:`9
`,output:`9 7
`,purpose:"跟踪中间值，观察重新赋值只改变等号左侧的名字。",steps:["stock 指向整数 9。","opening 取得此时的值 9。","减法产生 7，stock 改指向 7，opening 仍是 9。"],pitfall:"如果扣减后才执行 opening = stock，就会把扣减后的数量错误记录为原始库存。逐行记录各名字的值。"},{id:"decimal-conversion-error",title:"整数转换为何会停在小数文本",level:"应用",source:`print(float("3.5"))
print(int(-3.5))
print(int("3.5"))
`,input:"",output:`3.5
-3
`,diagnostic:{kind:"ValueError",file:"main.py",line:3},purpose:"对照转换的参数类型，以及错误前已经输出的内容。",steps:["第一行解析小数字符串得到 3.5。","第二行收到浮点数 -3.5，截向零得到 -3。第三行试图直接解析含小数点的整数文本，引发 ValueError。","把第三行的 int 改成 float，再运行。前两行保持原样，第三行应输出 3.5。"],pitfall:"把 int(-3.5) 当成向下取整会误算为 -4。需要负数的向下取整时看下一节的 //。"}]},{title:"表达式、整除和余数",explanation:["乘除同组，包括 *、/、//、%，优先于加减。括号可以先组合一部分，例如先算总价再按人数分摊。计算复杂时给中间量起带单位的名字，比如 total_minutes，能看清何时换算、何时相加。","整数做 / 得到浮点数，适合需要小数的场合。两个整数做 // 得到向下取整的商。向下指朝数轴上更小的整数，-7 除以 3 的整除结果是 -3。int(-7 / 3) 会截向零得到 -2，结果不同。","整数和非零除数满足 a = (a // b) * b + (a % b)。b 为正时，余数在 0 到 b−1。divmod(a, b) 同时给出商和余数，可在一行用两个名字接住。这个关系既能把分钟分成整小时和余分钟，也能把时刻绕回当天的钟面。","** 表示乘方。例如 3 ** 2 是 3 × 3。-3 ** 2 会先算乘方再取负。要平方整个负数，写 (-3) ** 2。先手算 (-2) ** 3 和 (-2) ** 2，再在运算顺序示例里分别打印。","divmod 的两个结果按商、余数的顺序交出。在等号左边写 cell, offset 叫解包。右边先得到两个值，再按位置分给两个名字。下一节会把相同办法用在拆出的输入字段上。"],examples:[{id:"precedence",title:"为运算标记先后顺序",level:"起步",source:`print(2 + 3 * 4)
print((2 + 3) * 4)
print(7 / 2, 7 // 2)
`,input:"",output:`14
20
3.5 3
`,purpose:"区分括号带来的分组和两种除法的结果。",steps:["第一行先算 3 乘 4，再加 2。","第二行先算括号里的 2 加 3，再乘 4。","第三行并排显示小数值和向下取整结果。"],pitfall:"一律从左到右手算，会把第一行也算成 20。先标出乘除和括号。"},{id:"negative-remainder",title:"在零点左边找到整格与余量",level:"应用",source:`position = int(input())
cell, offset = divmod(position, 3)
print(cell, offset)
print(cell * 3 + offset)
`,input:`-7
`,output:`-3 2
-7
`,purpose:"验证负数整除和正宽度余数如何重建原值。",steps:["宽度为 3，-7 落在 [-9, -6) 内。","起点 -9 对应格号 -3，从起点前进 2 到达 -7。","用格号乘 3 再加余量，还原原坐标。"],pitfall:"用 int(position / 3) 会截断为 -2，此时格子起点在 -7 的右侧。用 divmod 保持商余一致。"}]},{title:"把输入格式和业务规则翻译成算式",explanation:["两个整数在同一行时，input().split() 按空白分出字段。用两个临时名字接住，再分别 int 转换，也可在题面保证字段数时写 a, b = map(int, input().split())。map 按需对每个字段调用 int，左边两个名字接住结果。活动名若单独占一行，另用一次 input 保留原文。","“能装满多少盒”用向下取整。“至少要多少盒”包括装不满的最后一盒。总数 n 非负、容量 k 为正时，(n + k - 1) // k 可做向上取整。把 n 写成 q * k + r。r 为 0 时，加 k−1 凑不出新盒。r 为正时，加后刚好能再凑出一盒。","总数为 0、刚好装满、比整盒容量多 1 个，是检验公式的三个边界。用整数运算可避开大数先经过浮点数时可能发生的舍入。本课会在题目约束中保证容量或格宽为正。",'逐步读懂 a_text, b_text = input().split()：先用 line = input() 得到 "120   85"，再用 fields = line.split() 得到两个字符串，最后写 a_text, b_text = fields。左边名字与字段数必须相同。按题意分别用 int 或 float。两个字段都要整型时，可把这几步收成 a, b = map(int, line.split())。传给 map 的是转换工具 int，取出结果时才逐项调用。',"把小数结果放进 f-string 时，冒号右边是显示规则。{area:.2f} 生成固定两位小数的文本，必要时舍入或补 0，area 仍保存计算所得的浮点值。用最简单的矩形先手算长、宽、面积，再比对屏幕上显示了什么。","十进制的 0.1 和 0.2 在二进制浮点里通常只能近似保存，直接打印 0.1 + 0.2 可看到 0.30000000000000004。价格必须精确到分时，通常从整数分开始计算，例如 10 + 20 得到 30 分。加法结果的显示格式解决排版，无法把近似存储变成精确金额。拓展阅读可了解误差界以及 Decimal。"],examples:[{id:"read-fields",title:"合并厘米数并换算整米",level:"起步",source:`left_text, right_text = input().split()
left = int(left_text)
right = int(right_text)
meters, centimeters = divmod(left + right, 100)
print(meters, centimeters)
`,input:`120   85
`,output:`2 5
`,purpose:"拆开读取、类型转换和单位换算三个步骤。",steps:['split 得到 "120" 和 "85"。',"分别转换为整数，得到总长度 205 厘米。","用 100 做单位分解，得到 2 米和 5 厘米。"],pitfall:"int(input()) 会尝试把整行当作单个整数。先拆字段再转换。"},{id:"clock-wrap",title:"用余数算跨零点的钟面",level:"应用",source:`hour_text, minute_text = input().split()
hour = int(hour_text)
minute = int(minute_text)
change = int(input())
total = hour * 60 + minute + change
today = total % (24 * 60)
hour, minute = divmod(today, 60)
print(hour, minute)
`,input:`0 5
-10
`,output:`23 55
`,purpose:"把前推或后退的分钟换回 24 小时钟面，回接 P029。",steps:["先拆出小时和分钟文本并分别转换。再读变化量，统一换算成分钟。0 点 5 分往前 10 分钟，total 是 -5。","用正的 1440 取模，得到当天的第 1435 分钟。用 divmod 分解为 23 小时、55 分钟。","改用 23 59 和 1，手算再运行，应输出 0 0。把开头三行换成 hour, minute = map(int, input().split())，核对两种写法。"],pitfall:"直接用 total // 60 会给负值时刻。先换回一个钟面周期，再拆出小时与分钟。"},{id:"round-up",title:"计算满桌数和最少备桌数",level:"应用",source:`guests, seats = map(int, input().split())
full = guests // seats
needed = (guests + seats - 1) // seats
print(full, needed)
`,input:`13 6
`,output:`2 3
`,purpose:"同一份输入中比较下取整和上取整的用途。",steps:["读取 13 位客人和每桌 6 个座位。","13 // 6 得到两张满桌。","加 5 后再整除 6 得到三张需要准备的桌。"],pitfall:"guests // seats + 1 会在恰好坐满或无人到场时多算一张。用 12 6 与 0 6 自测。"},{id:"decimal-area",title:"从小数尺寸算面积和边长平方",level:"应用",source:`line = input()
fields = line.split()
width_text, height_text = fields
width = float(width_text)
height = float(height_text)
area = width * height
width_square = width ** 2
print("面积数值", area)
print(f"面积：{area:.2f} 平方米")
print(f"宽的平方：{width_square:.2f}")
print("浮点近似", 0.1 + 0.2)
print("整数分", 10 + 20)
`,input:`1.25 2.5
`,output:`面积数值 3.125
面积：3.12 平方米
宽的平方：1.56
浮点近似 0.30000000000000004
整数分 30
`,purpose:"跟踪小数从输入文本、算式到展示，观察舍入只影响输出。",steps:["拆分得到两个字符串，解包后各自转成浮点数。","相乘得到 3.125。两位小数的格式化得到 3.12，这个恰好在中间的值按最接近的偶数末位舍入。平方值 1.5625 显示为 1.56。","把尺寸改为 2 和 3，预测面积如何同时显示成 6.0 与 6.00。将 :.2f 改为 :.1f，再比较计算结果是否改变。"],pitfall:'不能把 area = f"{area:.2f}" 当成只改变显示的操作。那样重新绑定后，area 会成为字符串。'}]}],exercises:[{kind:"coding",problem:"P073",level:"综合应用",goal:"先计算小数面积，再用两位显示，独立检查居中和补零。"},{kind:"question",id:"math-text-add",legacy:"explain",goal:"通过值的类型判断 + 的含义。",prompt:'两个值分别是字符串 "7" 和 "2"。用 + 连接后结果是什么？',answer:1,options:[{label:"整数 9",feedback:"先把两项转成整数才会得到 9。这里两个操作数都是字符串。"},{label:'字符串 "72"',feedback:"字符串按从左向右的顺序拼接，结果仍是字符串。"},{label:"整数 72",feedback:"数字字符不会自动转成整数。结果显示 72，类型仍为字符串。"}]},{kind:"question",id:"math-quotient",legacy:"predict",goal:"用单位与商余关系检查计算。",prompt:"每盒装 12 枚纽扣。对 23 计算 // 12 和 % 12，依次得到什么？",answer:0,options:[{label:"1 和 11",feedback:"一盒用掉 12，剩 11。拿 1 × 12 + 11 可以还原 23。"},{label:"2 和 1",feedback:"装满两盒要用 24 枚。差 1 枚是缺少的数量，与余数含义不同。"},{label:"1 和 12",feedback:"如果余量为 12，就还可以再装一盒。余量必须小于盒容量。"}]},{kind:"question",id:"math-negative-floor",goal:"对比负数朝零截断、向下取整和余数。",prompt:"请预测此程序的输出，尤其注意两个取整操作的方向。",answer:2,demonstration:{source:`print(-5 // 2, int(-5 / 2), -5 % 2)
`,input:"",output:`-3 -2 1
`},options:[{label:"-2 -2 1",feedback:"// 会向更小的整数取整，-2.5 向下得到 -3。"},{label:"-3 -3 -1",feedback:"int 对浮点值朝零截断。除数为正时，余数也不能为负。"},{label:"-3 -2 1",feedback:"整除取 -3，截断取 -2，并且 -5 = (-3) × 2 + 1。"}]},{kind:"coding",problem:"P003",level:"基础编程",starterExample:"read-fields",goal:"读两个整数字段，将整册和散票分开报告。"},{kind:"coding",problem:"P028",level:"基础编程",goal:"定位负数所在的格子，用商余关系核对结果。"},{kind:"coding",problem:"P004",level:"综合应用",goal:"分步写出需求量和包数，验证有无零头的边界。"},{kind:"coding",problem:"P029",level:"综合应用",goal:"统一成分钟，再用取模和 divmod 还原钟面。"},{kind:"coding",problem:"P030",level:"拓展挑战",goal:"混合读取单整数、双整数及活动名，计算并排版时长。"}],mistakes:[{symptom:"两个看似数字的输入加出 72。",reason:"两个 input 都返回字符串，+ 做了拼接。",fix:"题目要求算术时，先用 int 转换后再加。",check:"用 type(value).__name__ 查看类型，提交前移除调试打印。"},{symptom:"负数去掉小数后，格子差了一格。",reason:"int 对浮点数截向零，// 向下取整。",fix:"按左端找所属格子时用 // 或 divmod。",check:"用 -5 与 2 验证格号为 -3，格内距离为 1。"},{symptom:"刚好装满还多买了一包。",reason:"无条件在向下取整的结果上加了 1。",fix:"在总数非负、容量为正时使用 (total + size - 1) // size。",check:"分别试 0、恰好等于容量和多出 1 个。"}],summary:["把读入、拆字段、解包、转换分别写出来，确认类型和字段数量后再简写。","用 //、%、divmod 表达商余和钟面。用零值、刚好整除、多一件及负值手算验证。","小数计算保留数值，展示时用格式化。精确单位的计算从整数最小单位开始。"],next:"下一课会使用比较运算来决定哪个规则适用，例如在余数为 0 时走单独的分支。",references:[{title:"Python 3.12 教程 · 数字",url:"https://docs.python.org/3.12/tutorial/introduction.html#numbers",note:"对照运算的先后和两种除法。"},{title:"Python 3.12 语言参考 · 赋值语句",url:"https://docs.python.org/3.12/reference/simple_stmts.html#assignment-statements",note:"核对右侧求值、绑定和目标解包。"},{title:"Python 3.12 语言参考 · 二元算术运算",url:"https://docs.python.org/3.12/reference/expressions.html#binary-arithmetic-operations",note:"核对取模的符号、商余恒等式和 divmod。"},{title:"Python 3.12 内置类型 · 数字类型",url:"https://docs.python.org/3.12/library/stdtypes.html#numeric-types-int-float-complex",note:"交叉核对负数整除和结果类型。"},{title:"Python 3.12 内置函数 · int",url:"https://docs.python.org/3.12/library/functions.html#int",note:"核对整数文本解析和浮点数朝零截断。"},{title:"Python 3.12 标准类型 · str.split",url:"https://docs.python.org/3.12/library/stdtypes.html#str.split",note:"核对省略分隔符时如何合并连续空白并返回字段。"},{title:"Python 3.12 内置函数 · map",url:"https://docs.python.org/3.12/library/functions.html#map",note:"核对逐项应用转换与按需取结果。"},{title:"Python 3.12 内置函数 · float",url:"https://docs.python.org/3.12/library/functions.html#float",note:"核对浮点文本解析与 int 文本解析的差别。"},{title:"Python 3.12 语言参考 · 增强赋值",url:"https://docs.python.org/3.12/reference/simple_stmts.html#augmented-assignment-statements",note:"核对数值更新时先运算再赋值的过程。"},{title:"Python 3.12 语言参考 · 乘方",url:"https://docs.python.org/3.12/reference/expressions.html#the-power-operator",note:"核对乘方与前置负号的结合顺序。"},{title:"Python 3.12 格式规则 · 固定小数",url:"https://docs.python.org/3.12/library/string.html#format-specification-mini-language",note:"核对 f 格式的精度、补零和舍入。"},{title:"Python 3.12 教程 · 浮点表示误差",url:"https://docs.python.org/3.12/tutorial/floatingpoint.html#representation-error",note:"核对十进制小数存为二进制近似值的原因。"}]},s={goals:['【理解】根据比较结果和缩进推演程序运行到哪一行，解释 0、"0" 和空字符串的真假。',"【独立使用】用按优先级排列的分支表达互斥规则，用独立 if 表达可同时执行的操作。","【独立使用】推导普通与跨午夜区间，测试两个端点，并用短路保护除法。"],prerequisites:"会第 1 课的逐行输入输出、第 2 课的整数转换、解包及 %。现在会把输入和边界写成比较式，再用比较结果决定执行哪些语句。",version:"示例使用 Python 3.12，适用于 Python 3 中的常规条件语句。",topics:[{title:"把自然语言规则写成比较",explanation:["比较两个整数通常得到 True 或 False。>= 包含相等，> 排除相等。== 比较两个值是否相等，= 是赋值。先把“满 8 件”“超过 8 件”中的边界写出来，再选符号。“至少 8”要在刚好 8 时也成立。","最简单的结构是 if 条件:，下一行缩进的语句只在条件成立时执行。else: 可处理条件为假的情况。它与 if 对齐，里面的语句另缩进一层。在两个分支后恢复到原缩进，就回到所有路径共有的步骤。","半开区间 [a, b) 包含起点 a、排除终点 b。用 a <= x < b 可以一次表达两道门槛。它要求左右比较都成立，中间的 x 只求值一次。相邻时段如 [8, 10) 和 [10, 12) 能共享端点数字，而且 10 只归第二段。","按整数小时测试 [9, 17)：起点取 8、9、10，预期关、开、开；终点取 16、17、18，预期开、关、关。测试值来自两条比较各自的边界。跨午夜时先拆成 [开始, 24) 与 [0, 结束) 两段。P033 明确相等端点表示空时段，先按题面决定这个分支，别把它当成全天。"],examples:[{id:"at-threshold",title:"库存刚好达到补货线",level:"起步",source:`stock = int(input())
if stock <= 8:
    print("补货")
else:
    print("继续观察")
print("检查结束")
`,input:`8
`,output:`补货
检查结束
`,purpose:"检验相等是否被包含，以及退出分支后哪一行总会运行。",steps:["读取库存 8。","stock <= 8 成立，执行 if 块，跳过 else 块。","最后一行已恢复原缩进，两条路径都会执行。"],pitfall:"写成 stock < 8 会漏掉恰好 8 的情况。把最后一行缩进到 else 里，会让补货时缺少“检查结束”。"},{id:"half-open",title:"判断开放时段的右端点",level:"应用",source:`opens, closes, hour = map(int, input().split())
if opens <= hour < closes:
    print("开放")
else:
    print("关闭")
`,input:`9 17 17
`,output:`关闭
`,purpose:"在同一条比较中处理开始和结束时间。",steps:["读到开门 9 点、关门 17 点和当前 17 点。","9 <= 17 成立，但 17 < 17 不成立，整个判断为假。","进入 else。改用当前 9 点再跑一次，会得到“开放”。"],pitfall:"把右边的 < 写成 <= 会把关门的一刻也算作开放。用 start、stop 和紧邻它们的数各试一次。"},{id:"midnight-window",title:"推演普通、跨午夜和空时段",level:"应用",source:`start, end, hour = map(int, input().split())
if start < end:
    opened = start <= hour < end
elif start > end:
    opened = hour >= start or hour < end
else:
    opened = False
if opened:
    print("开放")
else:
    print("关闭")
`,input:`22 2 0
`,output:`开放
`,purpose:"用三种端点关系决定区间，再用一次输出分支表达结果。",steps:["22 大于 2，进入跨午夜路径，允许 22、23 点，或 0、1 点。","当前为 0，hour >= 22 为假，继续检查 hour < 2，得到 True，因此输出“开放”。","保持 22 和 2，先预测 21、22、23、1、2、3 的结果。再分别测试 9 17 17 与 8 8 8，均应关闭。"],pitfall:"若跨午夜两段之间使用 and，两个条件无法同时满足。相等端点按本题约定走空区间。"}]},{title:"分支互斥与规则优先级",explanation:["if 和后续 elif，从上到下寻找第一个成立的条件。选中后只执行该块，之后的 elif 不再求值。全部条件为假时，如果写了 else 才执行它。要给一次请求分配唯一操作时，这样写能直接表达互斥。","两个并排的 if 是两条语句，分别检查自己的条件。一个订单可能同时需要包装和发票，可以独立检查这两个选项。如果规则是“先停运，其余再按雨量处理”，停运必须优先，而且后续规则只能在前者不成立时应用。","顺序会改变含有重叠范围的结果。例如“满 90 优秀，满 60 合格”中，95 同时满足两个比较，应先检查较严格的一项。还有一类情况需要先做资格检查，再进入具体计算。可以先处理无资格分支，其余情况在 else 内按不同标准计算。缩进要反映这种从属关系。","沿「比较独立操作和单条通道」逐项圈结果。金额 120 且易碎标记为 1 时，小票与护垫都要做，人工通道和批量通道只能选一个。暂时颠倒通道那组比较，前两行动作仍会执行，最后一行却变成批量通道。再用 120 0 和 80 0 分别验证批量、普通。",'有时两条路只为一个名字选值。先用 if score >= 60: 和缩进的 result = "合格"，在 else 中写 result = "继续练习"。以后读到 result = "合格" if score >= 60 else "继续练习"，按同一个分支手推。两条路还要执行其他动作时，保留多行 if。'],examples:[{id:"priority",title:"按优先级给读数分级",level:"起步",source:`value = int(input())
if value >= 90:
    print("高")
elif value >= 60:
    print("中")
else:
    print("低")
`,input:`95
`,output:`高
`,purpose:"追踪优先级规则，并在题面的阈值上自测。",steps:["读数为 95，先测试 value >= 90。","第一项成立，只执行“高”的分支。","改为 60 后，第一项失败，第二项恰好成立。"],pitfall:"把 value >= 60 放在前面会抢先接走 95。按实际优先级排序，或者改写为互不重叠的区间。"},{id:"independent",title:"比较独立操作和单条通道",level:"应用",source:`amount, fragile = map(int, input().split())
if amount >= 100:
    print("附小票")
if fragile == 1:
    print("加护垫")
if fragile == 1:
    print("人工通道")
elif amount >= 100:
    print("批量通道")
else:
    print("普通通道")
`,input:`120 1
`,output:`附小票
加护垫
人工通道
`,purpose:"理解同一个订单可以触发多个包装动作，但只走一条通道。",steps:["金额满足第一个 if，写出“附小票”。","易碎标记满足第二个 if，仍然执行“加护垫”。","通道选择是另一组 if/elif/else，易碎品优先走人工通道。"],pitfall:"把第二个独立 if 改成 elif 会漏掉护垫。判断前先问一笔订单可以同时得到几个结果。"}]},{title:"组合条件与短路求值",explanation:["and 要求两边都成立，or 表示至少一边成立，not 取反。比较比这些布尔操作结合得更紧。布尔操作内部通常先算 not，再算 and，再算 or。把业务中的一组条件用括号包起来，阅读者可以直接看出作用范围。","Python 从左向右处理 and、or。and 的左侧是假值时，右侧无需执行。or 的左侧是真值时，右侧无需执行。这叫短路。除法前的非零检查必须放在左边才起到保护作用。",'在本课多数例子中，两边都是产生 True 或 False 的比较。一般情况下，and、or 选回其中一个操作数，not 才始终返回布尔值。条件会检查值的真假，整数 0 和空字符串都被视为假，非空字符串 "0" 被视为真。对输入里的 0/1 标记，先转整数并写出 flag == 1 能清楚表达业务含义。','可以用 bool(值) 临时检查条件如何判真。空字符串与数值 0 都得到 False，有一个字符的字符串 "0" 得到 True。从 input 得到的 0 属于后一种。需要按数字零判断时，先根据题面确认字段是合法整数，再转换或明确比较文本。',"拓展阅读可了解 match 对结构做模式匹配。当前所有规则都可以先用比较和 if 表达。"],examples:[{id:"guard-division",title:"先检查人数再计算均分",level:"起步",source:`coupons, people = map(int, input().split())
if people > 0 and coupons // people >= 2:
    print("每人至少两张")
else:
    print("无法满足")
`,input:`10 0
`,output:`无法满足
`,purpose:"用短路保护有前置条件的运算。",steps:["先比较 people > 0，结果为假。","and 右侧不求值，因此不会除以零。","改成 10 4 再运行，右侧会计算 2 >= 2 并通过。"],pitfall:"把除法写在 and 左边会先求值。在 0 人的输入上就会抛出 ZeroDivisionError。"},{id:"quiet-hours",title:"用两个时段和一个标记决定放行",level:"应用",source:`hour, locked = map(int, input().split())
quiet = (0 <= hour < 8) or (20 <= hour < 24)
if locked == 0 and not quiet:
    print("可作业")
else:
    print("暂停")
`,input:`8 0
`,output:`可作业
`,purpose:"先命名两个区间的组合，再合并另一项限制。",steps:["8 不属于 [0, 8) 或 [20, 24)，因此 quiet 为 False。","not quiet 为 True，闸门标记 locked == 0 也成立。","改用 20 0 会进入晚间区间，结果变为“暂停”。"],pitfall:"把两个时段用 and 连接会要求同一时刻同时落入两段。分别选一个清晨和晚间的值检验。"},{id:"text-truth",title:"检查文本标记为何走错分支",level:"应用",source:`raw = input()
print(bool(raw), bool(0), bool(""))
if raw == "1":
    print("启用")
else:
    print("停用")
`,input:`0
`,output:`True False False
停用
`,purpose:"区分一项有内容、数值等于零和业务规则要求启用。",steps:['读取的是字符串 "0"，bool(raw) 为 True。有内容并不能决定开关。','本例把只有 "1" 视为启用。两段固定文字比较不成立，进入 else。',"先预测输入 1 和空行各输出什么。再把条件替换为 if raw，观察 0 走到哪条路径。"],pitfall:"空输入需要在标准输入框给一行空行。完全没提供一行会在条件判断前触发 EOFError。"}]}],exercises:[{kind:"question",id:"cond-one-branch",legacy:"explain",goal:"选择用于互斥决策的结构。",prompt:"两个条件可能同时成立，但规则规定只执行优先的一个动作。应选择哪种写法？",answer:1,options:[{label:"两个并排的 if",feedback:"两个 if 各自求值。当条件同时成立，会执行两次动作。"},{label:"一个 if，接一个 elif",feedback:"先写优先规则。第一项成立后，elif 的条件不会被求值。"},{label:"把两次动作都写进同一 if",feedback:"这样一旦条件成立，两次动作仍都会执行。"}]},{kind:"question",id:"cond-inclusive",legacy:"predict",goal:"用等于边界的值检验“至少”。",prompt:"规则是“身高至少 120 厘米可以进入”。哪个判断符合规则？",answer:2,options:[{label:"height > 120",feedback:"这个条件排除了正好 120 的情况。"},{label:"height == 121",feedback:"这个条件只会接受 121，其他高于门槛的身高也应通过。"},{label:"height >= 120",feedback:"同时包含等于和超过 120，符合“至少”的含义。"}]},{kind:"question",id:"cond-shadowed",goal:"发现较宽的分支抢先接走重叠输入。",prompt:"当 score 为 95 时，下面的代码会输出什么？",answer:1,demonstration:{source:`score = 95
if score >= 60:
    print("合格")
elif score >= 90:
    print("优秀")
`,input:"",output:`合格
`},options:[{label:"优秀",feedback:"95 满足第二项，但第一项先被选中，第二项没有机会执行。"},{label:"合格",feedback:"从上到下，先遇到成立的 score >= 60，因此只打印“合格”。"},{label:"先合格再优秀",feedback:"这种结果可能出现在两个独立的 if 中。这里是互斥的 if/elif。"}]},{kind:"question",id:"cond-short-circuit",goal:"逐步判断右操作数是否会执行。",prompt:"下面的表达式会打印什么，还是会产生异常？",answer:0,demonstration:{source:`divisor = 0
print(divisor != 0 and 10 // divisor >= 3)
`,input:"",output:`False
`},options:[{label:"False",feedback:"左侧比较为 False，and 直接返回它，整除没有发生。"},{label:"ZeroDivisionError",feedback:"只有右侧真的求值才会除以零。此时左侧已经是假。"},{label:"True",feedback:"左侧不满足，and 不可能在此处得到 True。"}]},{kind:"coding",problem:"P005",level:"基础编程",starterExample:"priority",goal:"在天气因素可能同时成立时优先选择安全规则。"},{kind:"coding",problem:"P031",level:"基础编程",goal:"用三段区间覆盖全部整数输入，验证上下端点和相同端点。"},{kind:"coding",problem:"P006",level:"综合应用",goal:"组合互斥业务优先级和两段半开区间。"},{kind:"coding",problem:"P032",level:"综合应用",goal:"用奇偶性判断结果，再按初始状态决定最终一面。"},{kind:"coding",problem:"P033",level:"拓展挑战",goal:"把跨午夜的时段拆为两段，处理相等端点。"},{kind:"coding",problem:"P034",level:"拓展挑战",goal:"分步计算基础费和超重费，再按折扣门槛调整结果。"}],mistakes:[{symptom:"端点附近的测试少过一组。",reason:"在 <= 与 < 中选错，或者把共享端点同时放入两段。",fix:"明确每个端点是否包含，并直接用链式比较表达。",check:"手推端点前一个值、端点、端点后一个值。"},{symptom:"一个输入触发了多个互斥结果，或高优先级从未触发。",reason:"把互斥条件写成独立 if，或者在高优先级之前放了覆盖更广的条件。",fix:"使用按优先级排列的 if/elif/else。",check:"选一组能同时满足两个原始条件的值，确认最终只走规定的一条路径。"},{symptom:"明明检查了除数，还是报除零错误。",reason:"检查写在有风险算式之后，或用了会求值右侧的结构。",fix:"先检查非零，再使用 and 或在 if 块内做除法。",check:"用除数 0 验证整除确实没被执行。"}],summary:["先确定区间和边界，再选择 >、>=、< 或 <=。","需要选中一条规则时用按优先级排列的分支，独立动作分别判断。","为组合条件起简洁的名字，并把保护性检查写在短路表达式前面。"],next:"下一课会让判断发生在每轮循环中。用条件筛选要累计的数据，也用条件决定何时结束。",references:[{title:"Python 3.12 教程 · if 语句",url:"https://docs.python.org/3.12/tutorial/controlflow.html#if-statements",note:"对照 if、elif、else 的入门结构。"},{title:"Python 3.12 语言参考 · if 语句",url:"https://docs.python.org/3.12/reference/compound_stmts.html#if",note:"核对条件测试顺序与只执行一段的规则。"},{title:"Python 3.12 语言参考 · 比较",url:"https://docs.python.org/3.12/reference/expressions.html#comparisons",note:"核对链式比较与中间操作数的求值。"},{title:"Python 3.12 标准类型 · 真假值测试",url:"https://docs.python.org/3.12/library/stdtypes.html#truth-value-testing",note:"核对 0、空字符串及非空字符串的真假规则。"},{title:"Python 3.12 语言参考 · 布尔运算",url:"https://docs.python.org/3.12/reference/expressions.html#boolean-operations",note:"交叉核对优先级、返回值和短路。"},{title:"Python 3.12 教程 · 模式匹配",url:"https://docs.python.org/3.12/tutorial/controlflow.html#match-statements",note:"拓展阅读。对照结构匹配和本课连续判断普通条件的用法。"}]},r={goals:["【独立使用】按任务选择 for 或 while，写出正向、倒序和含终点的范围。","【独立使用】按轮追踪累计、计数与最值，处理零轮、全负和跳过更新。","【独立使用】用 break、continue 或状态标记表达停止规则，保证下一批输入对齐。","【理解】按每层循环的规模估算读取、比较和更新的大致次数。"],prerequisites:"会第 2 课的拆字段、数值转换、取模与 +=，会第 3 课的分支和短路。先把循环体里的每次更新当成一段会反复执行的普通脚本。",version:"示例使用 Python 3.12，适用于 Python 3 中的 for、while 和 range。",topics:[{title:"有一批任务时，用 for 逐项处理",explanation:["for 名字 in 对象: 会从对象取得迭代器，依次把取得的每一项绑定到名字，再执行缩进的循环体。取不到下一项时结束。最常见的初学场景是“输入 n 条记录”，循环刚好进行 n 轮。后面学字符串和列表时，同一结构也可逐个遍历字符和元素。","range(n) 从 0 开始产生到 n 之前的整数。range(start, stop, step) 给出起点、停止边界和步长，省略步长就是 1。正步长要求当前值小于 stop，负步长要求大于 stop，所以终点在两种方向上都不包含。步长为 0 会引发 ValueError。","range 保存范围参数，可以按需计算每个值。它不会提前创建一张装满所有编号的列表，但逐项处理仍需执行对应次数的循环。迭代的下一项由迭代器提供，在循环体里给循环变量重新赋值不会改变 range 的序列。","只需要固定轮数时，可像 P035 那样写 for _ in range(...)。下划线仍是普通变量名，这里约定循环体用不到当前编号。P008 的 saved = days = 0 也可展开成两行，分别把两个数值状态设成 0。"],examples:[{id:"range-count",title:"为固定数量的工单编号",level:"起步",source:`count = int(input())
for index in range(count):
    print("工单", index + 1)
`,input:`3
`,output:`工单 1
工单 2
工单 3
`,purpose:"区分循环索引与面向用户的序号。",steps:["读到 3，range(3) 提供 0、1、2。","每轮取当前索引并加 1，打印工单号。","索引用完就结束。输入 0 时循环体一次也不执行。"],pitfall:"改用 range(1, count) 却保留原逻辑，会漏掉一条并从 2 开始编号。应配套调整范围和输出。"},{id:"step-back",title:"倒序巡查偶数楼层",level:"应用",source:`for floor in range(6, 0, -2):
    print(floor)
`,input:"",output:`6
4
2
`,purpose:"理解负步长与排除停止边界。",steps:["从 6 层开始。","每轮减少 2，所以随后到 4 层、2 层。","下一个值等于 stop，0 层不会被巡查。"],pitfall:"用 range(6, 0) 会使用正步长。由于起点已经不小于停止边界，范围里没有值。"}]},{title:"追踪状态，并用 while 检查是否继续",explanation:["累计量、计数器和当前最大值是常见的状态。循环开始前给它们设置初值，每轮用新读到的数据更新它们。和可以从 0 开始，读数的最大值通常不能直接从 0 开始：如果所有读数都为负，0 会成为从未出现的结果。","while 条件: 每轮先检查再执行。若初始条件为假，循环体一次都不运行。它适合“余额足够时继续扣款”“累计未达目标时继续存钱”这类轮数需要由程序算出来的任务。","写 while 时给出两条理由：为什么当前应继续，为什么状态最终会让条件变假。例如每轮余额至少减去 1，便会跌到门槛以下。若只检查余额却漏掉更新，就可能一直运行。小规模输入可用纸笔画出“轮次、当前值、更新后”的表。","给累计量和最值分别设初值。以 −4、−2、−5 为例，三轮结束后的（总和、最高）依次是（−4、−4）、（−6、−2）、（−11、−2）。总和从 0 开始，最高可以先用 None 表示尚无任何读数，见到第一项再建立。零轮时明确报告无读数，不能假设一定有第一条。"],examples:[{id:"keep-total",title:"用一张表追踪当天结余",level:"起步",source:`total = 0
for day in range(1, 4):
    change = int(input())
    total += change
    print(day, total)
`,input:`6
-2
5
`,output:`1 6
2 4
3 9
`,purpose:"观察累计量如何跨轮保留。",steps:["循环外把 total 初始化为 0。","三轮依次读到 6、-2、5，余额依次变成 6、4、9。","print 写在循环体里，所以每天都报告一次当前余额。"],pitfall:"在循环体顶部写 total = 0 会清除之前的记录。如果题意只输出最终余额，把 print 移到循环外面。"},{id:"pay-until-empty",title:"余额足够时继续扣款",level:"应用",source:`balance, fee = map(int, input().split())
paid = 0
if fee > 0:
    while balance >= fee:
        balance -= fee
        paid += 1
print(paid, balance)
`,input:`14 4
`,output:`3 2
`,purpose:"用正费用保证状态推进，检验首次就不执行的情况。",steps:["费用为 4，余额为 14，先确认费用大于 0。","每轮减少余额、增加扣款次数，余额依次成为 10、6、2。","2 不足以再扣一次，退出并报告 3 次和余额 2。"],pitfall:"写成 balance > fee 会在余额恰好够扣时提前结束。若费用 0 进入循环，余额也不会变化。"},{id:"peak-and-total",title:"用同一份读数追踪累计和最高",level:"应用",source:`size = int(input())
total = 0
peak = None
for index in range(size):
    reading = int(input())
    total += reading
    if peak is None or reading > peak:
        peak = reading
if peak is None:
    print("无读数")
else:
    print(total, peak)
`,input:`3
-4
-2
-5
`,output:`-11 -2
`,purpose:"验证两种初值、全负数与零轮。",steps:["None 表示当前没有最高值，使用 is None 检查。第一轮先把 -4 加进总和，再靠短路直接建立最高值，避免比较整数与 None。","第二轮后为 -6、-2，第三轮后为 -11、-2。只有更高的读数会修改峰值。","把输入改为单行 0，预期“无读数”。再改成一项读数 0，预期“0 0”，比较有数据和无数据。"],pitfall:"用 0 初始化 peak 会错误地保留一个从未出现的值。省略 None 分支则无法说明零轮的含义。"}]},{title:"跳过无效项，找到目标后及时结束",explanation:["continue 会跳过当前轮剩余语句。对于 for，它转向下一项。对于 while，它回到条件检查。while 的状态更新如果写在可能执行 continue 的路径后面，就可能重复检查同一个值。","break 会结束最近的一层循环，程序接着执行循环后面的语句。它适合查找第一个符合要求的记录或处理停表信号。循环前应先定义“没有找到”的输出，否则空数据或没有命中时可能读取未赋值的名字。","选择控制语句前先区分“这一条不用处理”和“后面的也不用处理”。在读一组数据的程序中，提前退出会留下未读输入。若题目还有下一批数据，必须明确剩余输入的处理方法。","手推 while 里的 continue 时，单列一格检查“下一轮会读到新的值吗”。若 position 的变化写在 continue 后面，命中该分支时会一直读取同一个位置。可把下标推进放在 continue 前，或改用 for 让下一项由范围推进。第 12 课会用双指针检测两边是否都在推进。","回到「余额足够时继续扣款」。若规则改为扣款后余额刚好为 10 的那次不计入 paid，就在扣款后、计数前添加 if balance == 10:，下一行缩进写 continue。输入 14 4，扣款后余额仍是 10、6、2，只有后两次计数，预期输出 2 2。"],examples:[{id:"skip-job",title:"跳过暂停编号并继续统计",level:"起步",source:`count = 0
for job in range(1, 8):
    if job % 3 == 0:
        continue
    count += 1
    print(job)
print("合计", count)
`,input:"",output:`1
2
4
5
7
合计 5
`,purpose:"观察 continue 只使本轮的计数和输出失效。",steps:["从 1 走到 7。","遇到 3 或 6 时，直接取下一项。","其他五项分别打印，最后报告计数。"],pitfall:"用 break 替换 continue 会在 3 处结束整个巡查，漏掉 4、5、7。"},{id:"first-signal",title:"报告第一条达到阈值的记录",level:"应用",source:`size = int(input())
position = 0
for index in range(1, size + 1):
    signal = int(input())
    if signal >= 5:
        position = index
        break
print(position)
`,input:`4
2
6
8
1
`,output:`2
`,purpose:"留下第一次命中的位置，并用默认值表示没有命中。",steps:["先把 position 设为 0。","第 1 条未达标，第 2 条为 6，记录位置后退出。","余下的值不再读取。本程序只有一批输入，最终打印 2。"],pitfall:"漏写 break 会反复覆盖位置，最终找到的是最后一条达标记录。未命中也要有输出，因此应先设 position。"}]},{title:"把逐组任务拆成外层和内层",explanation:["在循环体里面再写一层循环，就可以逐组处理任务。先看外层的每轮代表什么，再看内层每轮处理哪一小步。每到外层新的一轮，内层从头运行。只统计当前组的值应在进入内层前重置，跨组的总量则放在外层之前。","矩形表格是固定轮数的例子，外层选一行，内层扫该行所有列。若每行有 c 列、共 r 行，打印操作会执行 r×c 次。另一种情况是外层选编号，内层用 while 逐位处理编号。它的轮数随编号的十进制位数变化。","对于非负整数，% 10 得到末位，// 10 去掉末位。处理每个编号时先复制到临时变量，逐步缩短副本。这样可以保留原编号用于输出或汇总。编号 0 不进入 while，预设的数位和 0 就是正确结果。","和第 2 课的 += 一样，remaining //= 10 是更新数值的简写。它先按当前值整除，再把商存回 remaining。","每批长度事先给定时，读入次数由长度决定，能否统计则由另一个状态决定。碰到停表标记后仍读完当前批，从而让外层下一轮读到下一批的长度。若把内层 continue 改为 break，结束的是内层，外层仍会继续，此时输入位置可能错位。","估算时先选你关心的操作。逐批读取总轮数为各批长度之和，即使停止后的统计轮数少了，读入轮数也一样。如果对 n 条记录逐一和其他记录比较，最多约 n×n 次；只逐条读取和更新状态约 n 次。"],examples:[{id:"grid-pairs",title:"给每个货架格子生成坐标",level:"起步",source:`rows, columns = map(int, input().split())
for row in range(1, rows + 1):
    for column in range(1, columns + 1):
        print(row, column, sep="-")
`,input:`2 3
`,output:`1-1
1-2
1-3
2-1
2-2
2-3
`,purpose:"看到进入新行时列编号从头开始。",steps:["外层先取第一行。","执行内层，依次打印第一行的三个格子。","外层取第二行，再执行一份从 1 开始的列遍历。"],pitfall:"把 print 缩进到与内层 for 对齐，就只会在每行结束时打印一次。每个格子都要输出时，应放进内层循环体。"},{id:"digit-totals",title:"逐个编号统计数位和",level:"应用",source:`start, end = map(int, input().split())
for number in range(start, end + 1):
    remaining = number
    digit_total = 0
    while remaining > 0:
        digit_total += remaining % 10
        remaining //= 10
    print(number, digit_total)
`,input:`9 11
`,output:`9 9
10 1
11 2
`,purpose:"区分原编号、逐位更新的副本和每个编号专属的累计值。",steps:["外层依次选择 9、10、11，每选择一个就把 digit_total 清零。","内层先取末位再丢掉一位。例如处理 10 时先加 0，再加 1。","副本变为 0 时退出内层，原编号仍可和数位和一起输出。"],pitfall:"把 digit_total 的初始化挪到外层之前会串入前一个编号的结果。直接修改 number 会丢失当前编号。"},{id:"batch-stop-reading",title:"停下统计后读齐本批",level:"应用",source:`batches = int(input())
for batch in range(1, batches + 1):
    size = int(input())
    total = 0
    stopped = False
    for index in range(size):
        value = int(input())
        if value == -1:
            stopped = True
        if stopped:
            continue
        total += value
    print(batch, total)
`,input:`2
4
3
-1
9
8
2
4
5
`,output:`1 3
2 9
`,purpose:"把停止统计与停止消费标准输入分开。",steps:["第一批读入 3，累计到 3。读到 -1，打开停止标记，当前一轮跳过累计。","接下来的 9、8 仍被读走，状态保持停止。下一批正常读取长度 2，并将标记和累计量重置，再统计 4 和 5。","先预测把首批首个值改成 -1 时的两行结果。再把 continue 临时换成 break，手推下一批会把 9 当成什么。"],pitfall:"单批且尾随数据无需使用时可以在首次命中就 break。连续批次要按输入协议消耗本批数据。"}]}],exercises:[{kind:"coding",problem:"P074",level:"综合应用",goal:"组合额度和停表标记，检测下一批输入是否对齐。"},{kind:"question",id:"loop-range-stop",legacy:"explain",goal:"准确预测 range 的停止边界。",prompt:"range(2, 5) 依次提供哪些整数？",answer:2,options:[{label:"2、3、4、5",feedback:"range 排除 stop，即使 5 恰好踩在步长上也不会出现。"},{label:"1、2、3、4",feedback:"起点明确指定为 2，因此 1 不在范围中。"},{label:"2、3、4",feedback:"从 2 开始以 1 为步长，到 5 之前停止。"}]},{kind:"question",id:"loop-while-count",legacy:"predict",goal:"区分轮前检查、轮内更新和结束时的状态。",prompt:"已有 3 枚纪念章。数量小于 8 时，每轮增加 2 枚。共执行几轮？",answer:1,options:[{label:"2 轮",feedback:"两轮后只有 7，7 仍小于 8，还要执行一轮。"},{label:"3 轮",feedback:"数量依次是 5、7、9。第三轮后再检查，条件变为假。"},{label:"4 轮",feedback:"第三轮后达到 9。下一次只是检查条件，循环体不会再运行。"}]},{kind:"question",id:"loop-reset-total",goal:"找出累计量被覆盖的位置。",prompt:"这段代码原本要累加 1 到 3，实际会打印什么？",answer:0,demonstration:{source:`total = 0
for value in range(1, 4):
    total = 0
    total += value
print(total)
`,input:"",output:`3
`},options:[{label:"3",feedback:"每次先清零再相加，最后一轮只保存了 3。移走循环体中的清零语句才会得到 6。"},{label:"6",feedback:"只有在保留前两轮结果时才会得到 6。注意 total = 0 在循环体内。"},{label:"0",feedback:"清零后仍执行加法，最后一轮把 3 加给了 total。"}]},{kind:"question",id:"loop-control-path",goal:"分清 continue 和 break 作用于哪一段执行。",prompt:"下面的程序会按顺序打印哪些编号？",answer:1,demonstration:{source:`for number in range(1, 7):
    if number == 2:
        continue
    if number == 5:
        break
    print(number)
`,input:"",output:`1
3
4
`},options:[{label:"只有 1",feedback:"2 处用的是 continue，后面的 3 和 4 仍会处理。"},{label:"1、3、4",feedback:"2 被跳过，5 在打印之前就使循环结束，6 不会被遍历。"},{label:"1、3、4、6",feedback:"break 在 5 处结束整个循环，6 不会被处理。"}]},{kind:"coding",problem:"P007",level:"基础编程",starterExample:"keep-total",goal:"选择包含末端的遍历范围，只累计符合规则的编号。"},{kind:"coding",problem:"P036",level:"基础编程",goal:"用不断缩小的整数状态表示分装次数，检验零轮的情形。"},{kind:"coding",problem:"P008",level:"综合应用",goal:"让每日金额、累计和天数在每轮按顺序更新。"},{kind:"coding",problem:"P035",level:"综合应用",goal:"用首项初始化历史峰值，区分记录持平和真正刷新。"},{kind:"coding",problem:"P037",level:"拓展挑战",goal:"分别处理无效值和停表信号，保留停表前的统计。"},{kind:"coding",problem:"P038",level:"拓展挑战",goal:"用嵌套循环检查数位和，独立维护编号数量与编号总和。"}],mistakes:[{symptom:"少跑了最后一轮，末端编号被漏掉。",reason:"range 排除 stop，把题面的闭区间直接写成了 range(start, end)。",fix:"当步长是正 1 且要求包含 end 时，用 range(start, end + 1)。",check:"用 start 和 end 相等的输入验证应恰好执行一轮。"},{symptom:"总和只反映最后一项，或全部负数时却报告 0。",reason:"累计量每轮被清空，或最大值初值选成了数据外的 0。",fix:"在循环外保存累计量。题面保证非空时可用第一个数据初始化最大值。",check:"逐轮写出累计值，并准备一个所有输入都为负的例子。"},{symptom:"while 一直运行，或 continue 后卡住。",reason:"至少有一条继续执行的路径没有推进条件所依赖的状态。",fix:"检查所有能回到条件的路径。每条路径都应确保推进状态或执行 break。",check:"从容易命中 continue 的输入开始，手推两轮看变量是否变化。"}],summary:["用范围决定 for 的迭代来源，用轮前条件决定 while 是否继续。为每条继续路径找到状态进展。","从首个真实值建立最值，用状态表检验零轮、全负和跳过更新。","统计动作和读入动作可以分开。估算每层运行轮数，并用两批带停止标记的输入检查是否对齐。"],next:"下一课把循环的“一个编号”换成“一个字符”，逐步学习扫描和处理字符串。",references:[{title:"Python 3.12 教程 · for 语句",url:"https://docs.python.org/3.12/tutorial/controlflow.html#for-statements",note:"核对 for 逐项取得值并按顺序执行循环体。"},{title:"Python 3.12 语言参考 · while 语句",url:"https://docs.python.org/3.12/reference/compound_stmts.html#while",note:"核对轮前检查、零次执行和 continue 的控制路径。"},{title:"Python 3.12 语言参考 · for 语句",url:"https://docs.python.org/3.12/reference/compound_stmts.html#for",note:"核对迭代器、目标名字绑定和每轮执行顺序。"},{title:"Python 3.12 标准类型 · range",url:"https://docs.python.org/3.12/library/stdtypes.html#ranges",note:"核对正负步长、停止条件和范围对象的存储方式。"},{title:"Python 3.12 语言参考 · continue 语句",url:"https://docs.python.org/3.12/reference/simple_stmts.html#the-continue-statement",note:"交叉检查在嵌套结构中继续的循环层次。"},{title:"Python 3.12 语言参考 · break",url:"https://docs.python.org/3.12/reference/simple_stmts.html#the-break-statement",note:"核对只结束最近的一层循环。"}]},a={goals:["【理解】用码点计数定位首尾，解释索引、切片、不可变性和大小写转换对位置的影响。","【独立使用】按输入约定保留原文或拆出字段，区分空栏和要清理的空白。","【独立使用】先在原文查找，再决定替换范围与次数，并输出文字和原位置。"],prerequisites:"会第 1 课的逐行输入、repr 与 f-string，第 2 课的 split 和解包，以及第 3、4 课的分支和循环。用第 1 课的方括号观察空白。",version:"示例按 Python 3.12 编写。除特别说明外，“位置”和“长度”以 Unicode 码点计。",topics:[{title:"字符串中的位置与字符长度",explanation:["Python 的 str 是由 Unicode 码点组成的序列。len(s) 返回码点数。s[0] 取第一项，s[len(s) - 1] 取最后一项。负索引从末尾数，s[-1] 表示最后一项。题面若以 1 开始编号，先减 1 再索引。","每次索引返回长度为 1 的字符串。空字符串没有首项或末项，越界访问会抛出 IndexError。可能为空时，先用 if s 判断，再访问固定位置。","屏幕上看上去像一个字符的文字可能有多个码点。预组合字母 é 是一个码点，字母 e 加组合重音是两个码点。例如数据校验若要数用户看到的字符，不能直接假设 len 等于视觉字符数。","用「取标签的首尾码点」试一个字和一行空行。再换成两个字，如「青湾」，预测长度和末项。拓展阅读可比较规范化前后的重音写法；如果题目给定按码点计数，继续按原串索引。"],examples:[{id:"tag-edges",title:"取标签的首尾码点",level:"起步",source:`label = input()
if label:
    print(len(label), label[0], label[-1])
else:
    print("空标签")
`,input:`站B🚆
`,output:`3 站 🚆
`,purpose:"理解索引从 0 开始，并为可能为空的文本加检查。",steps:["读到“站”“B”和列车图标三个码点。","字符串非空，读取索引 0 与 -1。","打印长度和两个码点。给一行空输入时进入 else。"],pitfall:"使用 label[len(label)] 会越界。即使字符串非空，最后一个合法正索引也只是长度减 1。"},{id:"combining-mark",title:"比较两种写法的重音字母",level:"应用",source:`single = "é"
combined = "e\\u0301"
print(len(single), len(combined))
print(single == combined)
`,input:"",output:`1 2
False
`,purpose:"区分视觉文字与 Python 对码点序列的比较。",steps:["single 保存一个预组合码点。","combined 保存 e 和组合重音两个码点。","这两个码点序列长度不同，普通 == 返回 False。"],pitfall:"直接比较看起来一样的文本可能得到 False。若业务需要把它们视为同一文本，先确定 Unicode 规范化规则。"}]},{title:"切片、反向遍历与构造新字符串",explanation:["切片 s[start:stop:step] 以整数索引选取一段文字。正步长默认 1，起点包含而终点排除。省略起点或终点时使用该方向的边界。负步长向左移动，s[::-1] 访问所有码点但顺序反过来。","单项索引要落在合法范围内。切片的边界超出范围时会按实际长度调整，所以 s[:100] 在短字符串上也安全。方向与边界不匹配会得到空字符串。比如正步长下 s[3:1] 为空。","str 不支持给某个索引赋值。要改字符，可以把原文拆成保留的片段和替换文字，再拼成新字符串。用另一个变量接住结果便于保留原始输入。","先把输入位置换成索引，再构造新串。P039 的位置从 1 开始。切片 text[:i] 与 text[i + 1:] 夹住原索引 i；前后两段原样拼接，仅中间换成新值。手推第一项和最后一项，观察哪一段为空。"],examples:[{id:"slice-label",title:"提取站牌编号中的字段",level:"起步",source:`label = input()
print(label[:2])
print(label[3:99])
print(label[-2:])
`,input:`海图-305
`,output:`海图
305
05
`,purpose:"对照排除终点、超长切片与从末尾定位。",steps:["[:2] 取索引 0 和 1。","编号从索引 3 开始，切片在实际字符串末尾结束。","[-2:] 只保留最后两项。"],pitfall:"写成 label[99] 会越界。若只想取一个范围，可用切片的起点和终点表达。"},{id:"swap-title-ends",title:"保留中段并交换标题两端",level:"应用",source:`title = input()
updated = title[-1] + title[1:-1] + title[0]
print(updated)
print(title)
`,input:`青桥北
`,output:`北桥青
青桥北
`,purpose:"组合索引与切片，保留原文做核对。此例约定标题至少有两个码点。",steps:["取末项“北”。","从第 2 项取到最后一项之前，得到“桥”。","加上首项“青”生成新串，第二次打印仍是原文。"],pitfall:"不能写 title[0] = title[-1]。字符串不可变，应构造新的字符串，并将结果绑定到名字。"}]},{title:"处理空白与空字段",explanation:["strip() 只清理两端的空白。中间的空白需要按格式另行处理。给 strip 传入字符串时，里面的字符构成一个删除字符集合，它会在两端反复去除集合成员。固定前缀应使用 removeprefix，后者从 Python 3.9 开始提供。",'split() 默认按连续空白拆分，会跳过首尾空白。split("|") 使用指定分隔符，连续分隔符之间、开头或结尾都可以有空字段。若空字段代表某一栏没有内容，应该使用明确的分隔符，才能保住列的位置。','join 由分隔字符串发起，例如 "/".join(fields)。它只在字段之间放分隔符，字段必须都是字符串。对一个日志字段先按规则拆开、处理各部分，再连接，通常比对整行反复做替换更清楚。','需要保留原文时，先用 repr 或一对方括号检查。比如 "  甲|乙|  " 的首末空格可能属于原记载；"甲||乙|" 中两个空槽也有业务含义。只有题目明确允许清理两端时才调用 strip。需要输出一行空行则单独 print()，不能靠 strip 后合并行。','「去掉键值两端空白」只拆第一个冒号，右边可继续含冒号。方括号 [key.strip(), value.strip()] 临时把两个字符串按顺序放在一起，让 join 连接。第 6 课会正式使用这类列表。输入若必须包含冒号，先按题目保证读取；允许缺失时用 ":" in line 检查再拆。'],examples:[{id:"split-whitespace",title:"比较默认空白和指定空格拆分",level:"起步",source:`line = input()
print(len(line.split()))
print(len(line.split(" ")))
`,input:`  红   蓝 
`,output:`2
7
`,purpose:"看清连续分隔符是否保留空字段。",steps:["默认拆分把空白段视作边界，只得到“红”“蓝”。","显式指定普通空格时，每个空格都分隔一次。","输入里有六个普通空格，因此产生七个字段，其中五个为空。"],pitfall:"要读任意空白分开的多个词时，通常使用 split()。固定列的数据里，空字段可能必须保留。"},{id:"clean-pair",title:"去掉键值两端空白并重新连接",level:"应用",source:`line = input()
key, value = line.split(":", 1)
print("=".join([key.strip(), value.strip()]))
`,input:`  标签 :  北 区:2  
`,output:`标签=北 区:2
`,purpose:"仅在第一个冒号处分隔，保留值内部的空格和冒号。方括号把两个字符串交给 join。",steps:["split 的第二个参数 1 限制最多拆分一次。","单独对键和值去除边缘空白，值内部的空格及冒号不变。","join 在两个结果之间加上 =。"],pitfall:"如果不指定最多拆一次，值中的冒号也会拆出一段，两个变量无法接住三项。"}]},{title:"查找、统计与大小写比较",explanation:["只问子串是否出现时，可以使用 keyword in text。还要首次出现的位置时，用 text.find(keyword)。找到会返回从 0 开始的索引，找不到返回 -1。必须显式比较返回值：0 代表找到了第一项，-1 本身在布尔判断中反而是真值。",'count 统计互不重叠的匹配。例如 "aaaa".count("aa") 得 2。若题目允许重叠，要用不同的遍历规则；从每个可能起点检查时，该例还会在索引 1 命中。',"lower 返回小写结果。casefold 面向忽略大小写的比较，转换可能改变码点数。若需要报告原文位置，不能把变换后字符串的索引直接当成原索引。只处理可打印 ASCII 时，ASCII 字母用 lower 转换可保持长度；在这个约定下，isalnum 正好识别英文字母和数字。","text.replace(old, new, 1) 只换首个匹配。省略次数会替换所有不重叠匹配。若还要报告原始位置，应在替换前 find。可以用切片写出同样的第一次替换：text[:index] + new + text[index + len(old):]。必须先排除 -1。","P042 可用两个索引从原文两端向内比较。左端不是字母或数字就左索引加一，右端不合格就右索引减一，继续前先推进。两端合格时仅将单个字符转成小写比较。以「A, b!」为例，跳过末尾 ! 后比较 A 与 b，发现不等，原位置是 1 和 4。","本平台普通评测统一换行，忽略每行行尾空白与输出末尾的空行，保留行首、行内空白和中间空行。调试时用可见边界确认原文，实际提交仍按题面输出。"],examples:[{id:"find-and-count",title:"检查首位命中与未命中",level:"起步",source:`text = "aaaat"
print(text.find("aa"), text.find("z"))
print(text.count("aa"))
print("t" in text)
`,input:"",output:`0 -1
2
True
`,purpose:"区分三种不同目标：存在、位置和数量。",steps:["aa 第一次从索引 0 开始，z 未出现。","统计不重叠的 aa，得到两组。","用 in 检查 t 是否存在，只返回布尔结果。"],pitfall:'if text.find("aa") 会把首位命中误当作假。需要位置时检查是否等于 -1，只查存在时用 in。'},{id:"case-fold",title:"观察忽略大小写时长度的变化",level:"应用",source:`left = "Straße"
right = "STRASSE"
print(left.lower() == right.lower())
print(left.casefold() == right.casefold())
print(len(left), len(left.casefold()))
`,input:"",output:`False
True
6 7
`,purpose:"区分普通转小写与 Unicode 大小写折叠。",steps:["lower 保留左词中的 ß，两个小写串仍不同。","casefold 把 ß 折叠为 ss，因此比较相同。","长度由 6 变为 7，后续索引需使用正确的文本版本。"],pitfall:"先 casefold 再用结果位置切原文，遇到长度变化会错位。保留原始位置或使用题目保证的 ASCII 范围。"},{id:"marked-replacement",title:"保留原文位置并制作修订记录",level:"应用",source:`text = input()
old = input()
new = input()
index = text.find(old)
first = text.replace(old, new, 1)
every = text.replace(old, new)
print(f"原文：[{text}]")
print(f"首个位置：{index}")
print(f"首处替换：[{first}]")
print(f"全部替换：[{every}]")
`,input:`春|春  
春
初春
`,output:`原文：[春|春  ]
首个位置：0
首处替换：[初春|春  ]
全部替换：[初春|初春  ]
`,purpose:"把原文、首次位置和不同替换次数放在同一个修订报告中。约定查找字段非空，位置使用从 0 开始的索引。",steps:["第一个“春”就在索引 0。用 find 记录原位置，两个替换结果各自从原文生成。","目标比原词长，修订后的第二个匹配位置会移动。方括号让两处末尾空格可见，f-string 把位置和文本整理为报告。","把目标改为“冬”，先预测位置 -1 和两条保持原样的文本。再在原文开头加一个空格，核对首个位置变为 1。"],pitfall:"使用 if index 会漏掉索引 0，还会把 -1 当成真。需要区分命中时，明确写 index != -1。"}]}],exercises:[{kind:"question",id:"str-slice-end",legacy:"explain",goal:"区分索引起点与不包含的切片终点。",prompt:'s 为 "松风雨" 时，s[1:3] 的结果是什么？',answer:1,options:[{label:"松风",feedback:"索引 1 是第二项“风”。取前两项应从索引 0 开始。"},{label:"风雨",feedback:"取出索引 1 和 2，索引 3 只用于停止。"},{label:"雨",feedback:"索引 1 上的“风”也包含在切片里。"}]},{kind:"question",id:"str-strip-lower",legacy:"predict",goal:"顺序跟踪两次方法调用的结果。",prompt:'字符串 "  BeE  " 先 strip() 再 lower()，会得到什么？',answer:0,options:[{label:'"bee"',feedback:"strip 去掉两端空格，lower 把剩下的字母转为小写。"},{label:'"  bee  "',feedback:"这是仅做 lower 的结果。题目还调用了 strip。"},{label:'"BeE"',feedback:"这是仅做 strip 的结果。lower 还会转换大写字母。"}]},{kind:"question",id:"str-strip-set",goal:"辨别 strip 参数的含义。",prompt:"下面的代码会打印什么？",answer:2,demonstration:{source:`print("AB样例BA".strip("AB"))
`,input:"",output:`样例
`},options:[{label:"样例BA",feedback:"strip 同时处理两端。尾部的 B 和 A 都在删除集合中。"},{label:"AB样例BA",feedback:"strip 会检查两端是否出现集合中的字符。左端 A 和右端 A 都能被去除。"},{label:"样例",feedback:"两端的 A、B 都被移除，因为参数表示可删字符集合。"}]},{kind:"question",id:"str-find-zero",goal:"避免用真假值误判首位命中。",prompt:"下面代码的输出是什么？",answer:1,demonstration:{source:`text = "桃花"
if text.find("桃"):
    print("进入分支")
else:
    print("跳过分支")
`,input:"",output:`跳过分支
`},options:[{label:"进入分支",feedback:"虽然找到了“桃”，返回值是索引 0，条件会把它当作假。"},{label:"跳过分支",feedback:'首位命中返回 0。这里可以改用 "桃" in text 检查子串是否存在。'},{label:"IndexError",feedback:"没有使用索引访问，只调用了 find，因此不会越界。"}]},{kind:"coding",problem:"P009",level:"基础编程",starterExample:"find-and-count",goal:"修改统计示例，用同一次规范化分别统计两个字符。"},{kind:"coding",problem:"P039",level:"基础编程",goal:"将题面的 1 基位置转换为索引，用切片更正一项并保留剩余文字。"},{kind:"coding",problem:"P010",level:"综合应用",goal:"让空格参与码点倒序，并给结果加上可见边界。"},{kind:"coding",problem:"P040",level:"综合应用",goal:"用明确分隔符拆字段，保留中间和末尾的空字段。"},{kind:"coding",problem:"P041",level:"拓展挑战",goal:"区分未命中和索引为 0，定位并替换一次后保留原文坐标。"},{kind:"coding",problem:"P042",level:"拓展挑战",goal:"用两端索引跳过无关字符，报告首次不匹配的原始位置。"}],mistakes:[{symptom:"空文本时报 IndexError。",reason:"直接使用 s[0] 或 s[-1]，但这个字符串没有任何项。",fix:"先检查长度或真假值，按题意决定空输入的处理方式。",check:"测试空串和只有一个码点的输入。"},{symptom:"明明找到关键词，代码却判为没找到。",reason:"把 find 的结果直接用在 if 中，首位命中返回的 0 会被当作假值。",fix:"只问是否存在时用 in。要使用位置时检查 find 是否等于 -1。",check:"分别测首位命中、末尾命中和未命中。"},{symptom:"记录末尾的空字段不见了。",reason:"使用了默认空白拆分或在拆分前清理了必须保留的内容。",fix:"按题面指定分隔符调用 split，并在需要时对每个字段单独处理。",check:"测试连续分隔符与行尾分隔符。"}],summary:["索引和位置报告以原码点序列为准。切片与替换创建新字符串，可以同时保留原文。","split、strip 和 join 应遵守字段约定。输入有空栏或边缘空白时，先判断这些字符是否属于数据。","先定位再变换。用首位命中、未命中、重复匹配和可见空白核对修订结果。"],next:"下一课会使用列表保存拆分后的字段，还会学习怎样修改、复制与排序这些元素。",references:[{title:"Python 3.12 标准类型 · 字符串方法",url:"https://docs.python.org/3.12/library/stdtypes.html#string-methods",note:"核对 find、count、strip、split、join 与 casefold 的精确语义。"},{title:"Python 3.12 标准类型 · 通用序列操作",url:"https://docs.python.org/3.12/library/stdtypes.html#common-sequence-operations",note:"核对正负索引、切片边界与步长。"},{title:"Python 3.12 Unicode 指南 · 字符串比较",url:"https://docs.python.org/3.12/howto/unicode.html#comparing-strings",note:"核对组合重音的码点数、casefold 及规范化对比较的影响。"},{title:"Python 3.12 教程 · 文本",url:"https://docs.python.org/3.12/tutorial/introduction.html#text",note:"交叉核对字符串不可变性以及索引和切片的越界区别。"},{title:"Python 3.12 标准类型 · str.find",url:"https://docs.python.org/3.12/library/stdtypes.html#str.find",note:"核对首次命中、0 起始索引及 -1 的缺失约定。"},{title:"Python 3.12 标准类型 · str.replace",url:"https://docs.python.org/3.12/library/stdtypes.html#str.replace",note:"核对替换返回新字符串、默认全替换与次数上限。"},{title:"Python 3.12 标准类型 · str.strip",url:"https://docs.python.org/3.12/library/stdtypes.html#str.strip",note:"核对首尾清理与自定义删除字符集合。"},{title:"Python 3.12 内置函数 · repr",url:"https://docs.python.org/3.12/library/functions.html#repr",note:"核对用对象的可打印表示观察文本边界。"}]},l={goals:["【独立使用】创建、遍历和修改列表，区分插入、替换、按值删、按位置删和返回被删项。","【独立使用】用循环构造新列表，按原位置做相邻检查，并能读写等价的单层列表推导式。","【独立使用】根据是否保留原顺序选择查找、排序副本或原地排序。","【理解】识别别名与浅复制，用元组描述固定位置的记录。"],prerequisites:"会第 2 课的 map 与解包、第 4 课的循环和状态更新、第 5 课的索引、切片、split 与字符串方法。",version:"示例按 Python 3.12 编写，使用 Python 3 的列表、enumerate 与排序接口。",topics:[{title:"把一批值放进可修改的有序容器",explanation:["列表使用方括号表示，例如 [3, 8, 3]。它保存元素的顺序，允许重复。索引和切片与字符串相似，但列表支持对位置赋值。a[i] = x 会替换这一项，列表长度保持不变。a[len(a)] 会越界，要在末尾添加元素可使用 append。","input().split() 得到一组字符串字段。list(map(int, ...)) 会逐项转换成整数并保存到列表。输入行为空时，默认 split() 得到空列表。若要取最后一项、求最大值或计算平均值，应先设计空列表的处理分支。","append(x) 把 x 当作一个元素放到末尾。x 本身为列表时，会添加一个内层列表。extend(items) 则逐项加入 items 中的元素。两者都修改原列表并返回 None。把 .append(...) 的返回值赋给原变量，会让变量失去对列表的绑定。","print(*values) 将列表里的各个元素分别作为参数交给 print，适合输出一行空格分隔的数据。此处的 * 表示在调用处展开已有值，与两个数之间的乘号不同。直接 print(values) 会打印带方括号的列表表示。","insert(i, x) 把 x 插入原索引 i 的前面，原来从 i 开始的项右移。remove(x) 删除首个等于 x 的元素，找不到会发生 ValueError。pop(i) 删除并返回索引 i 的项，省略 i 就用末项。del a[i] 也按位置删，不产生可赋值的结果。remove、insert 和 sort 一样返回 None。删除前用 in 或位置范围检查。"],examples:[{id:"edit-lane",title:"更新一项后追加一项",level:"起步",source:`lanes = ["进", "候"]
lanes[1] = "领"
lanes.append("归")
print(*lanes)
print(len(lanes))
`,input:"",output:`进 领 归
3
`,purpose:"区分替换已有位置与追加末尾值。print(*lanes) 将每个元素作为一个打印参数。",steps:["创建包含两个状态的列表。","把索引 1 的状态更新为“领”，列表仍有两项。","追加“归”后长度变为 3，再按原顺序输出。"],pitfall:"想新增元素时不能给 lanes[2] 赋值，因为当时只有索引 0 和 1。"},{id:"append-batch",title:"对比追加整批与逐项追加",level:"应用",source:`batch = list(map(int, input().split()))
packed = [0]
packed.append(batch)
merged = [0]
merged.extend(batch)
print(packed)
print(merged)
`,input:`4 9
`,output:`[0, [4, 9]]
[0, 4, 9]
`,purpose:"查看追加列表时是否产生嵌套结构。",steps:["把一行中的两个整数字段转成列表。","append 将整个 batch 作为 packed 的第二项。","extend 逐项加入 4 与 9，因此 merged 有三项。"],pitfall:"如果期望拿到三个独立数字，不能用 append(batch)。用 print 直接查看列表形状。"},{id:"edit-queue",title:"比较同一队列的插入和四种删除结果",level:"应用",source:`queue = ["甲", "乙", "甲", "丙"]
inserted = queue.copy()
inserted.insert(1, "加急")
by_value = queue.copy()
result = by_value.remove("甲")
by_pop = queue.copy()
popped = by_pop.pop(1)
by_del = queue.copy()
del by_del[1]
filtered = []
for name in queue:
    if name != "甲":
        filtered.append(name)
print("插入", inserted)
print("按值删", by_value, result)
print("取出", popped, by_pop)
print("按位置删", by_del)
print("排除全部甲", filtered)
print("原队列", queue)
`,input:"",output:`插入 ['甲', '加急', '乙', '甲', '丙']
按值删 ['乙', '甲', '丙'] None
取出 乙 ['甲', '甲', '丙']
按位置删 ['甲', '甲', '丙']
排除全部甲 ['乙', '丙']
原队列 ['甲', '乙', '甲', '丙']
`,purpose:"从同一份队列做独立试算，比较修改原样、返回值及重复项。这里的 copy 复制外层，后面会专门比较它与别名。",steps:["每个副本起初和原队列顺序相同，插入让“乙”从索引 1 移到 2。","remove 只删第一个“甲”并返回 None。pop 与 del 都删索引 1 的“乙”，只有 pop 把它交回来。","筛选在原列表上读、往另一个列表写，得到没有任何“甲”的名单。把两个“甲”放到相邻位置，再比较按值删一个、按位置取第二项与排除所有“甲”的结果。"],pitfall:"删除正在遍历的列表会移动后续索引。只需要展示过滤结果时，在新列表里收集保留项。"}]},{title:"选择按值、按位置或同时遍历两者",explanation:["只需要元素值时可写 for value in values。需要用原始位置做报告时，用 for position, value in enumerate(values, start=1)，它每次提供位置计数和元素。start=1 改变的是计数起点，列表第一个元素的索引依然是 0。","有时需要访问同一个列表的两个位置，例如比较当前和前一项。可以用 range(1, len(values)) 得到从第二项开始的索引，再分别访问 i 与 i−1。若不足两项，范围为空，循环自然跳过，初始统计值应覆盖这种情形。","筛选时通常先建立空结果列表，再将符合条件的元素按访问顺序追加。遍历原列表时若删除项，后续元素向左移动，而迭代器的索引仍继续向前，可能漏掉刚移到当前索引的元素。","先读「筛出偶数并保留次序」的普通循环。等价的 kept = [value for value in numbers if value % 2 == 0] 仍是逐项访问，再检查条件，把通过的值放入新列表。最左边写要收集的表达式，后面写遍历和筛选。P050 的并列名单也是同一办法。","P011 用 abs(本项 - 前项) 得到非负距离，再用 max(已知最大值, 新距离) 选择较大值。也能用 if 新距离 > 已知最大值 来更新。P012 的交换先存 old_left = labels[i]，再覆盖左边，最后用 old_left 写右边。简写 labels[i], labels[j] = labels[j], labels[i] 会先把右边两项都取出。"],examples:[{id:"keep-even-list",title:"筛出偶数并保留次序",level:"起步",source:`numbers = list(map(int, input().split()))
kept = []
for value in numbers:
    if value % 2 == 0:
        kept.append(value)
print(kept)
`,input:`8 1 8 -2 3
`,output:`[8, 8, -2]
`,purpose:"遍历每个值并保留符合条件的重复项。",steps:["把输入转为数字列表，准备空结果。","依次检查每一项的余数。","所有偶数按原顺序进入结果，包括重复的 8。"],pitfall:"不要在循环里删去原列表的奇数。删除会移动位置，可能使随后的一项被跳过。"},{id:"neighbor-rise",title:"统计比左邻更高的展位",level:"应用",source:`heights = list(map(int, input().split()))
rises = 0
for index in range(1, len(heights)):
    if heights[index] > heights[index - 1]:
        rises += 1
print(rises)
`,input:`6 4 7 7 10
`,output:`2
`,purpose:"使用索引访问相邻项，区分持平与严格上升。",steps:["先把计数置零，从索引 1 开始检查。","7 > 4 时加一次，后一对 7 和 7 持平。","10 > 7 时再加一次，最终为 2。"],pitfall:"若从索引 0 开始，index - 1 会是 -1，第一项会误与最后一项比较。"},{id:"filter-comprehension",title:"把保序筛选的循环改写成推导式",level:"应用",source:`numbers = list(map(int, input().split()))
kept = []
for value in numbers:
    if value >= 4:
        kept.append(value)
compact = [value for value in numbers if value >= 4]
print(*kept)
print(*compact)
`,input:`5 2 4 5
`,output:`5 4 5
5 4 5
`,purpose:"对照普通循环和推导式，确认两种写法保留相同元素、次序和重复项。",steps:["普通循环依次看到 5、2、4、5，条件过滤掉 2，把后面的两个合法元素继续追加。","推导式先走 for 与 if，再取最左的 value，按同一顺序构造新列表。","把门槛改成 5 或换成一行空输入，先预测两个列表的内容，再同时修改两处条件核对。"],pitfall:"条件应写在 for 之后。需要每轮有多步操作或中途退出时，普通循环更易追踪。"}]},{title:"确认两个名字是否在修改同一份列表",explanation:["赋值 b = a 绑定一个新名字，a 和 b 仍指向同一份列表。给 b[0] 赋值时，从 a 也会看到变动。给 b 整体重新赋值则改变 b 的绑定，不会替换 a 的内容。","a.copy() 或 a[:] 建立新的外层列表。对于只有整数或字符串的列表，可以安全地修改副本某个位置而保留原位置。编写“保留原始读数”和“模拟调整结果”两种状态时，先复制再改。","浅复制仍让原列表和副本引用相同的内层对象。若元素是列表，修改某个内层列表的内容会同时从两边看到。替换外层的某一项，则只改变那个外层位置。需要独立编辑每一层时，应按数据结构分别复制需要修改的层。",'列表适合增删一批记录。每条记录若始终有固定的两个位置，例如（柜号、存放量），可以写 ("B", 7) 组成元组。用 code, quantity = record 按位置解包；要改数量，创建新元组并替换列表里那一项。元组的槽位不可重新赋值，其中如果存有可变对象，对象本身仍可改变。第 7 课会用由字符串组成的元组作为组合键。'],examples:[{id:"separate-stock",title:"区分同一份库存与独立副本",level:"起步",source:`stock = [3, 6]
alias = stock
scenario = stock.copy()
alias[0] = 4
scenario[1] = 9
print(stock)
print(scenario)
`,input:"",output:`[4, 6]
[3, 9]
`,purpose:"追踪赋值、复制和修改三步分别改变了什么。",steps:["alias 与 stock 指向同一列表，scenario 拥有独立外层。","修改 alias[0] 也会改变 stock 看到的第一项。","替换 scenario 的第二项时，stock 的第二项仍是 6。"],pitfall:"若写 scenario = stock，两个场景都会显示最终改过的同一份数据。"},{id:"nested-copy",title:"对照修改内层与替换外层",level:"应用",source:`groups = [[8], [9]]
view = groups.copy()
view[0].append(5)
view[1] = [7]
print(groups)
print(view)
`,input:"",output:`[[8, 5], [9]]
[[8, 5], [7]]
`,purpose:"用可运行例子找出浅复制之后仍共享的内容。",steps:["复制外层后，两份外层的第一项仍指向同一个内层列表。","append 修改该内层，所以两边第一项都变成 [8, 5]。","替换 view 的第二项只改 view 的槽位，groups 第二项保持 [9]。"],pitfall:"浅复制后立即修改内层列表，原数据也可能变化。要独立修改内层，就为相应行建立独立副本。"},{id:"fixed-record",title:"用元组保存一个柜号和数量",level:"应用",source:`records = [("B", 7), ("A", 3)]
code, quantity = records[0]
records[0] = (code, quantity + 1)
for code, quantity in records:
    print(code, quantity)
`,input:"",output:`B 8
A 3
`,purpose:"区分一条固定结构的记录和一张可修改的记录表。",steps:["第一项元组的两个字段按位置交给 code 和 quantity。",'加 1 以后创建 ("B", 8) 替换外层第一个位置。遍历时每轮把一条元组解包为两个字段。',"把第一条记录的数量改成 0，预测更新后的值与两条记录的顺序。"],pitfall:"records[0][1] = 8 试图修改元组槽位，会触发 TypeError。这里应当替换整条记录。"}]},{title:"查找原位置与生成排序结果",explanation:["顺序查找可以逐项扫描并在命中时 break。若要报告原始位置，应遍历原列表，排序会改变位置。list.index(x) 只查第一个与 x 相等的值，找不到会抛出 ValueError。对于“达到阈值”这类条件以及第 k 次命中，直接遍历更清晰。","sorted(values) 返回新的排序列表，原列表继续保留原顺序。values.sort() 对现有列表原地排序，返回 None。两者默认升序，加 reverse=True 就按降序排序。只在确定原顺序不再有用时使用原地排序。","需要反复按某个顺序取值时，先排序一次再遍历通常比每轮重新找最大值更合适。若题目指定轮流分配，排序下标对参与人数取余数，可以确定当前该轮到谁。","数字通常按大小，字符串默认按码点顺序比较。内置依据可直接传给 key，例如 sorted(labels, key=str.lower) 把每个字符串的小写结果用于比较，输出仍是原字符串。参数处写 str.lower，无需立刻调用它。自定义依据留到第 8 课。报第一次出现的位置时保留原列表；若只交付排好的名单且不再需要原顺序，可以直接 sort。"],examples:[{id:"first-limit",title:"在原顺序中定位第一次超限",level:"起步",source:`values = list(map(int, input().split()))
position = 0
for index, value in enumerate(values, start=1):
    if value > 8:
        position = index
        break
print(position)
`,input:`5 8 12 15
`,output:`3
`,purpose:"同时读取编号与元素，并保留第一次命中的位置。",steps:["将没有超限时的结果设为 0。","前两个值不大于 8，第三个值 12 命中。","记录位置 3 后退出，15 无需再比较。"],pitfall:"先排序会失去题目问的原始位置。若用 enumerate 默认从 0 编号，也会少报 1。"},{id:"sorting-result",title:"区分排序副本和原地排序",level:"应用",source:`scores = list(map(int, input().split()))
ascending = sorted(scores)
print(*scores)
print(*ascending)
scores.sort(reverse=True)
print(*scores)
`,input:`7 2 7 -1
`,output:`7 2 7 -1
-1 2 7 7
7 7 2 -1
`,purpose:"保留原顺序后再主动改动原列表，核对重复值不会被合并。",steps:["sorted 创建升序副本，原列表保持输入次序。","第二行打印新副本，两个 7 都保留。","sort(reverse=True) 直接修改 scores，最后打印降序。"],pitfall:"不要写 scores = scores.sort()。如果需要赋值，用 sorted；如果原地排序，单独调用 sort。"},{id:"builtin-sort-key",title:"保留登记顺序，再按小写依据出名单",level:"应用",source:`labels = input().split()
print("登记", *labels)
print("默认", *sorted(labels))
print("按小写", *sorted(labels, key=str.lower))
print("原顺序", *labels)
`,input:`bee Ant APP
`,output:`登记 bee Ant APP
默认 APP Ant bee
按小写 Ant APP bee
原顺序 bee Ant APP
`,purpose:"对比默认比较和按内置依据排序，打印两份用途不同的名单。",steps:["默认排序直接比较原字符串，APP 排在 Ant 前。","str.lower 为每一项产生一个比较用的文本，依据是 bee、ant、app。排序结果仍带原来的大小写。","把输入改成 a B A，手推默认顺序、小写依据顺序和登记顺序。相同依据的两项维持相对顺序。"],pitfall:"先排序再查询原登记位置会丢失位置意义。用 sorted 获得报告顺序，同时保留原名单。"}]}],exercises:[{kind:"question",id:"list-second-item",legacy:"explain",goal:"把从 0 开始的索引与元素位置对应起来。",prompt:"列表 [4, 9, 4] 的索引 1 上是什么？",answer:1,options:[{label:"4",feedback:"索引 0 和 2 的值都是 4。索引 1 对应第二项。"},{label:"9",feedback:"索引从 0 起算，索引 1 正好指向第二项 9。"},{label:"没有该项",feedback:"三个元素的合法正向索引为 0、1、2，索引 1 合法。"}]},{kind:"question",id:"list-swap-ends",legacy:"predict",goal:"跟踪位置交换只影响哪些元素。",prompt:'将 ["白", "绿", "蓝"] 的第一项与最后一项交换，第二项是什么？',answer:2,options:[{label:"蓝",feedback:"蓝从最后一项移动到第一项，没有移动到第二项。"},{label:"白",feedback:"白从第一项移动到最后一项，没有移动到第二项。"},{label:"绿",feedback:"交换索引 0 和 2，只修改这两个位置，索引 1 的“绿”保留。"}]},{kind:"question",id:"list-sort-return",goal:"辨别原地排序和返回值的区别。",prompt:"这两次 print 依次输出什么？",answer:0,demonstration:{source:`values = [5, 1, 5]
answer = values.sort()
print(answer)
print(values)
`,input:"",output:`None
[1, 5, 5]
`},options:[{label:"None，然后 [1, 5, 5]",feedback:"sort 修改列表本身，返回值是 None。"},{label:"[1, 5, 5]，然后 [5, 1, 5]",feedback:"这是用 sorted(values) 创建副本时的结果，不是 sort() 的行为。"},{label:"None，然后 [5, 1, 5]",feedback:"返回值确实是 None，但 values 已经完成原地排序。"}]},{kind:"question",id:"list-remove-while-scanning",goal:"理解删除正在遍历的元素为何会跳项。",prompt:"这段代码想删除全部 0，最终会打印什么？",answer:1,demonstration:{source:`values = [0, 0, 5]
for value in values:
    if value == 0:
        values.remove(value)
print(values)
`,input:"",output:`[0, 5]
`},options:[{label:"[5]",feedback:"删除第一项后，第二个 0 移到了索引 0。迭代器接着读索引 1，跳过了这个 0。"},{label:"[0, 5]",feedback:"剩余的 0 移到已经访问过的位置，所以没有被检查和删除。"},{label:"IndexError",feedback:"这里列表迭代器正常结束。问题在于移动后的 0 没有被访问。"}]},{kind:"coding",problem:"P011",level:"基础编程",starterExample:"neighbor-rise",goal:"把相邻比较改成求最大绝对差，验证只有一项时的结果。"},{kind:"coding",problem:"P043",level:"基础编程",goal:"保序筛选并保留重复值，覆盖空数据和无有效项的情况。"},{kind:"coding",problem:"P012",level:"综合应用",goal:"逐条交换题面给出的位置，核对下标转换与同一位置交换。"},{kind:"coding",problem:"P044",level:"综合应用",goal:"结合原始位置、命中次数和提前结束找到第 k 次命中。"},{kind:"coding",problem:"P045",level:"拓展挑战",goal:"由同一份基准得到两个独立试算结果，排查别名导致的交叉改动。"},{kind:"coding",problem:"P046",level:"拓展挑战",goal:"用排序统一取牌顺序，再用取模跟踪三队轮次。"}],mistakes:[{symptom:"访问末项报错，或相邻比较时多算一对。",reason:"把长度当成最后一个索引，或从索引 0 取前一项。",fix:"末项正索引是长度减 1。检查相邻项时从索引 1 开始。",check:"分别测试空列表、单元素和两个不同值。"},{symptom:"排序后变量显示 None。",reason:"把原地 sort 的返回值赋给了变量。",fix:"分别使用 sorted(values) 获取新列表，或单独调用 values.sort()。",check:"排序前后同时打印原始列表和返回值。"},{symptom:"修改试算结果时，基准数据也变了。",reason:"两个名字引用同一列表，或浅复制仍共享被修改的内层。",fix:"复制将被修改的外层与必要的内层。",check:"用同一个位置做两次不同试算，并核对结果是否各自从原值出发。"}],summary:["按值删除与按位置删除有不同含义。需要返回被删项时用 pop，筛选时构造新列表。","从普通遍历理解推导式和相邻访问。元组固定字段位置，列表管理一批记录。","保留原始位置时用原列表查询，另外生成排序结果。复制或原地修改前确认别名和嵌套对象。"],next:"下一课改用字典按键查询与累计。届时会比较“按位置找”与“按名称找”适合哪些数据。",references:[{title:"Python 3.12 教程 · 列表",url:"https://docs.python.org/3.12/tutorial/datastructures.html#more-on-lists",note:"核对 append、extend、index、sort 和 copy 的用途与返回行为。"},{title:"Python 3.12 标准类型 · 通用序列操作",url:"https://docs.python.org/3.12/library/stdtypes.html#common-sequence-operations",note:"核对下标以及遍历时改动列表引起的跳项。"},{title:"Python 3.12 内置函数 · enumerate",url:"https://docs.python.org/3.12/library/functions.html#enumerate",note:"核对计数值与元素配对，以及 start 参数的含义。"},{title:"Python 3.12 标准库 · 浅复制",url:"https://docs.python.org/3.12/library/copy.html#copy.copy",note:"核对浅复制建立新外层、继续引用内层对象的含义。"},{title:"Python 3.12 排序指南 · 排序基础",url:"https://docs.python.org/3.12/howto/sorting.html#sorting-basics",note:"核对 sorted 创建新列表和 list.sort 原地修改的区别。"},{title:"Python 3.12 教程 · 列表推导式",url:"https://docs.python.org/3.12/tutorial/datastructures.html#list-comprehensions",note:"核对逐项表达式、筛选条件和普通循环的对应关系。"},{title:"Python 3.12 教程 · del 语句",url:"https://docs.python.org/3.12/tutorial/datastructures.html#the-del-statement",note:"核对按索引删除与 pop 返回结果的区别。"},{title:"Python 3.12 教程 · 元组与序列",url:"https://docs.python.org/3.12/tutorial/datastructures.html#tuples-and-sequences",note:"核对打包、解包和元组槽位不能变更。"},{title:"Python 3.12 排序指南 · 排序键",url:"https://docs.python.org/3.12/howto/sorting.html#key-functions",note:"核对把 str.lower 作为比较依据，保留元素原值。"}]},p={goals:["【理解】识别可哈希键、字典的插入顺序与不同方向的元组键。","【独立使用】新增、读取、更新及删除记录，用 in 区分零值和缺失。","【独立使用】选择 keys、values 或 items，安全筛选、计数、按量累加和处理并列。"],prerequisites:"会第 4 课循环与累加、第 5 课拆分文本和第 6 课的解包、定长元组、列表遍历与排序。先把字典理解为按商品名称或编号定位的记录表。",version:"示例使用 Python 3.12。Python 从 3.7 起保证字典保留键的插入顺序。",topics:[{title:"用键来查值",explanation:['列表常按位置查值，字典按键查值。字典用花括号表示，例如 {"纸": 0, "线": 4}。冒号左边是键，右边是值。每个键在同一个字典中只能对应一个值，多个键可以对应相同值。遇到同一个键再次赋值，原来的值会被覆盖。','字典用键的哈希值帮助定位，再根据键是否相等确认匹配。键必须可哈希，即它在存活期间的哈希值保持稳定，相等的键也必须具有相同的哈希值。字符串、整数，以及各项都可哈希的元组都能当键，列表不能。两个字段一起决定记录时，可以使用 ("北", "东") 这样的元组键，两个位置各有自己的含义。',"d[key] 适合题目保证存在的键，缺失时会抛出 KeyError。d.get(key, default) 读取现有值，缺失时返回指定默认值，且不插入键。若业务要区分“没有登记”和“登记为 0”，用 key in d 检查键是否存在。"],examples:[{id:"known-zero",title:"区分零库存和未登记",level:"起步",source:`stock = {"纸": 0, "线": 4}
name = input()
print(stock.get(name, 0))
if name in stock:
    print("已登记")
else:
    print("未登记")
`,input:`纸
`,output:`0
已登记
`,purpose:"同一个读取结果可能来自实际值，也可能来自默认值。",steps:["字典已有“纸”，对应库存 0。","get 读到实际值 0，第一行打印 0。","in 检查键，仍得到已登记。把输入改成“铜”时，仍打印 0，但状态变为未登记。"],pitfall:"if stock.get(name, 0) 会把实际库存为 0 的条目也当作假值。登记状态应直接检查键。"},{id:"route-pair",title:"用起点和终点构成路线键",level:"应用",source:`minutes = {("北", "东"): 12, ("东", "北"): 15}
start, end = input().split()
route = (start, end)
print(minutes.get(route, "无路线"))
`,input:`东 北
`,output:`15
`,purpose:"把两个有顺序的字段作为一个键，用于有方向的查询。",steps:["字典包含北到东和东到北两条记录。","用输入构造只有两项的元组。","按两项及其顺序查到对应时间 15。"],pitfall:"改用 [start, end] 会得到不可哈希的列表。如果把两个字段排序，反方向可能和原方向变成同一个键。"}]},{title:"区分覆盖、计数和按量累加",explanation:["写入 d[key] = value 时，新键会插入，已有键的值会被覆盖。覆盖适合保存最新读数。若需求是保留首次登记，只有 key 不存在时才写入。先读业务规则，再决定重复键应该怎样处理。","计数记录“发生过几次”。每读到一项，执行 counts[key] = counts.get(key, 0) + 1，将这次计入已有次数。若输入还给出带符号的数量，应把该数量加进去；入库加正数，出库加负数。计数和库存累计的写法相近，区别在于每轮加的量。","取值后更新需要把结果写回字典。单独写 d.get(key, 0) + delta 只计算了表达式。可以先把旧值和新值分别存进变量，再写回，便于在调试时检查累计过程。","记录撤销时，可用 del d[key] 删掉对应项，前提是键确实存在。若既要删又要保留旧值，可用 d.pop(key, default)，键缺失时给出默认值。查询、增删、汇总是三个步骤。先按业务写入或撤销，再用需要的遍历方式出报表。"],examples:[{id:"count-colors",title:"按颜色累计标签数量",level:"起步",source:`counts = {}
for color in input().split():
    counts[color] = counts.get(color, 0) + 1
print(counts)
`,input:`蓝 红 蓝 白
`,output:`{'蓝': 2, '红': 1, '白': 1}
`,purpose:"观察新键从 0 开始，以及重复键取回已有次数的过程。",steps:["为第一次出现的蓝取默认值 0，写入 1。","第二个蓝读到旧值 1，更新为 2。","最终字典有三个键，对应四张标签。"],pitfall:"counts[color] += 1 会先尝试读取该键。第一次看到这个颜色时会报 KeyError。"},{id:"signed-ledger",title:"逐条汇总出入库变化",level:"应用",source:`balance = {}
for _ in range(int(input())):
    item, change = input().split()
    previous = balance.get(item, 0)
    balance[item] = previous + int(change)
for item, quantity in balance.items():
    print(item, quantity)
`,input:`4
纸 5
线 3
纸 -2
线 -3
`,output:`纸 3
线 0
`,purpose:"把读到的有符号数量加到对应材料，保留回到零的键。",steps:["纸先加 5，线先加 3。","出库记录分别更新两项的旧值，得到 3 与 0。","items 逐个给出材料和数量，两项都在输出里。"],pitfall:"把旧值覆盖为 change 会丢掉前面的流水。分两步记录 previous 和更新结果，检查第二次出现同一材料的情况。"}]},{title:"遍历键、值与键值对",explanation:["for key in d 默认遍历键，d.values() 提供值，d.items() 给出每个 (键, 值) 对。需要名称和值一起输出时，用 for key, value in d.items() 将两项分别赋给循环变量，避免在循环里再写一次查找。","字典按键首次插入的顺序遍历。给已有键换值不会重新排位置。删除后重新插入，会把该键放到末尾。若题意要按数字或名称从小到大输出，应明确用 sorted(d) 得到排好序的键。sorted(d) 返回排序结果，原字典的顺序仍可用来生成登记报告。","keys、values 和 items 提供能反映原字典变动的视图。遍历时直接增删键可能使迭代失效。筛选出另一份结果时，可以遍历原字典，把需要保留的键写到新字典。必须删除原键时，可以先保存要删除的键，循环完成后再删。","选择视图先问报表需要什么。只列名称用 keys 或直接遍历字典，计算库存总量用 values，既要求数量又要名称用 items。三种视图会反映原字典变化。需要固定一份名单时，可以先用 list(d) 复制键，或像「保留有库存的项目」一样把满足条件的记录放进新字典。"],examples:[{id:"first-seen-order",title:"按登记顺序与按名称排序输出",level:"起步",source:`readings = {}
readings["b"] = 2
readings["a"] = 4
readings["b"] = 5
for name, value in readings.items():
    print(name, value)
print(*sorted(readings))
`,input:"",output:`b 5
a 4
a b
`,purpose:"对比更新值后的插入顺序与显式排序。",steps:["b 比 a 先插入。","把 b 更新为 5，仍然在第一项。","最后一行先排序键，所以得到 a b。"],pitfall:"题目要求按名称排序时，直接遍历字典会输出登记顺序。用两个顺序刻意相反的键验证。"},{id:"keep-available",title:"遍历库存并生成可领取清单",level:"应用",source:`stock = {"纸": 2, "线": 0, "笔": 3}
available = {}
for item, count in stock.items():
    if count > 0:
        available[item] = count
print(*available)
print(*stock)
`,input:"",output:`纸 笔
纸 线 笔
`,purpose:"在遍历原数据的同时构造独立的筛选结果。",steps:["依次取材料名称和库存。","只把正库存项写入新字典。","新清单没有“线”，原清单仍有这项供其他逻辑查询。"],pitfall:"筛选过程中用 del stock[item] 会改变正在遍历的键集合。构造新字典可避免此问题。"},{id:"stock-lifecycle",title:"从登记与撤销生成实际库存报告",level:"应用",source:`stock = {"纸": 0, "胶带": 4}
stock["线"] = 3
stock["胶带"] -= 1
removed = input()
if removed in stock:
    del stock[removed]
print("名称", *stock.keys())
print("合计", sum(stock.values()))
print("纸已登记", "纸" in stock)
active = {}
for name, quantity in stock.items():
    if quantity > 0:
        active[name] = quantity
print("可领取", *active)
`,input:`胶带
`,output:`名称 纸 线
合计 3
纸已登记 True
可领取 线
`,purpose:"把新增、扣减、删除、查询和筛选放进同一份库存记录。",steps:["先新增线，再把胶带变成 3。输入请求删除胶带，in 成立才执行 del。这里 sum 将 values 给出的数量相加。","名称保留登记顺序，纸的值为 0 仍在原字典，筛选得到的新字典只保留线。","把撤销项改成“纸”，先预测名称、合计和成员判断。再输入未登记的“笔”，确认不发生删除。"],pitfall:"if stock.get(name, 0) 会把没有登记的项目与余额为 0 的项目混在一起，撤销时先用 in 判断。"}]},{title:"把统计规则和并列规则分开",explanation:["字典统计题通常先积累每个键的值，再按要求找最高项或汇报符合条件的记录。你可以先手写一份小字典，再决定怎么挑选结果。这样更容易发现错误发生在读取、累计还是排序。","max(d) 比较的是键，max(d.values()) 才比较值。如果需要最高分对应的键，先取最高值，再检查哪些键对应它。并列时要按题意比较键或保留所有并列项。字典的插入顺序与“取最小编号”是两套不同规则。","空字典没有最高值。若输入或筛选条件可能留下空集合，先决定空结果的输出，再求最大值。把资格筛选放在排名之前也很重要，否则一个无资格的高分项会把最高值推高，导致没有合格记录能达到它。",'P014 的参考解本身采用手写三步：逐个编号计数，再用 max(counts.values()) 取得最高次数，最后只看并列项并保留最小编号。例如输入编号 12、2、12、2，最高次数为 2，赢家是 2。编号必须转成整数，按字符串比较时 "12" 会排在 "2" 前。',"还可以给每条 (编号, 次数) 构造一个排序依据 (-次数, 编号)。次数取负后按升序排，次数越多越靠前。第一项相同才比较编号。先手写三步并验证，再读第 8 课命名排序函数的写法。拓展可了解 collections.Counter，它复用相同的逐键计数模型。"],examples:[{id:"highest-ties",title:"找出并列得分最高的展位",level:"起步",source:`scores = {"c": 8, "b": 8, "a": 5}
best = max(scores.values())
for name in sorted(scores):
    if scores[name] == best:
        print(name, best)
`,input:"",output:`b 8
c 8
`,purpose:"按最高值筛选键，并按要求处理并列顺序。",steps:["max 读取所有得分，得到最高分 8。","按名称顺序检查 a、b、c。","跳过 5，输出 b 和 c 的并列记录。"],pitfall:"直接 max(scores) 会得到最大的名称。只在发现一个最高项时就 break 会漏掉并列者。"},{id:"guard-empty-max",title:"在没有记录时跳过求最大值",level:"应用",source:`counts = {}
for tag in input().split():
    counts[tag] = counts.get(tag, 0) + 1
if counts:
    print(max(counts.values()))
else:
    print("无记录")
`,input:`
`,output:`无记录
`,purpose:"为求最大值加上非空前提，覆盖一行没有任何字段的情况。",steps:["默认 split 拆分空行，得到空列表。","字典保持为空，if counts 不成立。","打印约定结果。把输入改成 a b a 时会输出 2。"],pitfall:"无条件调用 max 会在没有记录时抛出 ValueError。小样本测试应包含空数据。"},{id:"winner-by-count",title:"从重复号码挑出最小的并列赢家",level:"应用",source:`counts = {}
for seat in map(int, input().split()):
    counts[seat] = counts.get(seat, 0) + 1
if counts:
    highest = max(counts.values())
    winner = None
    for seat, count in counts.items():
        if count == highest and (winner is None or seat < winner):
            winner = seat
    print(winner, highest)
else:
    print("无投票")
`,input:`12 2 12 2 7
`,output:`2 2
`,purpose:"把计数、最高值和并列规则拆开手推，连接 P014。",steps:["按数字编号累计得到 12→2、2→2、7→1，先求值的最大值 2。","12 第一个符合最高次数，暂为赢家。2 同样两票且编号更小，取代 12。7 不进入比较。","交换两个并列编号的出现顺序，赢家仍为 2。再追加一个 12，先预测赢家及最高次数；给一行空输入验证空字典。"],pitfall:"选 max(counts) 会取最大编号，按插入顺序取第一名也不能保证并列者的编号最小。"}]}],exercises:[{kind:"coding",problem:"P075",level:"综合应用",goal:"处理覆盖、撤销、重新登记和零值并汇总当前表。"},{kind:"question",id:"dict-get-missing",legacy:"explain",goal:"准确理解 get 的默认值行为。",prompt:'d = {"云": 2} 时，d.get("雨", 0) 返回什么？',answer:1,options:[{label:"2",feedback:"2 只与键“云”对应。查的是另一项“雨”。"},{label:"0",feedback:"键“雨”缺失，get 使用给定的默认值 0，并保留原字典内容。"},{label:"KeyError",feedback:'直接访问 d["雨"] 会报这个异常，get 可以提供缺失时的值。'}]},{kind:"question",id:"dict-update-existing",legacy:"predict",goal:"分清重复赋值与累计。",prompt:'先给键 "石" 赋值 1，再给 "石" 赋值 4。该键最后对应什么？',answer:2,options:[{label:"两个值 1 和 4",feedback:"同一个字典键只有一个对应值。要存下多次记录，可将列表作为值。"},{label:"一个值 1",feedback:"只有在第二次写入前检查存在并跳过时，才保留第一次的值。"},{label:"一个值 4",feedback:"第二次赋值覆盖了原值。累计需要取出旧值再做加法。"}]},{kind:"question",id:"dict-zero-membership",goal:"把是否存在与值的大小分开。",prompt:"这个程序会输出什么？",answer:0,demonstration:{source:`counts = {"A": 0}
print("A" in counts, counts.get("B", 0), "B" in counts)
`,input:"",output:`True 0 False
`},options:[{label:"True 0 False",feedback:"A 存在且值为零。get 返回 B 的默认值，字典仍没有 B。"},{label:"False 0 False",feedback:"A 的值为零，但 in 检查的是这个键有没有登记。"},{label:"True 0 True",feedback:"get 只返回默认值，不会登记 B。"}]},{kind:"question",id:"dict-reinsert-order",goal:"跟踪删除、更新和重新插入后的顺序。",prompt:"以下代码在 Python 3.12 中会怎样输出？",answer:1,demonstration:{source:`items = {"c": 1, "b": 2, "a": 3}
items["c"] = 9
del items["b"]
items["b"] = 4
print(*items)
`,input:"",output:`c a b
`},options:[{label:"a b c",feedback:"这个次序需要调用 sorted。遍历字典本身按插入顺序。"},{label:"c a b",feedback:"更新 c 不移位。b 删除后重新插入，因此排在末尾。"},{label:"c b a",feedback:"这仍是初始顺序。b 被删除过，重新插入时从末尾开始。"}]},{kind:"coding",problem:"P013",level:"基础编程",starterExample:"signed-ledger",goal:"累加有正有负的变化，并为未登记的查询提供默认结果。"},{kind:"coding",problem:"P047",level:"基础编程",goal:"按首次登记顺序汇报各项出现次数。"},{kind:"coding",problem:"P014",level:"综合应用",goal:"先统计频次，再用编号的数值大小打破并列。"},{kind:"coding",problem:"P048",level:"综合应用",goal:"保留首次读数，查找后续不一致记录，覆盖初值为 0 的情况。"},{kind:"coding",problem:"P049",level:"拓展挑战",goal:"用有方向的元组键检查互有记录的编号，并避免重复计数。"},{kind:"coding",problem:"P050",level:"拓展挑战",goal:"合并两组计数，先筛资格，再输出全部并列最高项。"}],mistakes:[{symptom:"第一笔计数就出现 KeyError。",reason:"对尚未登记的键直接执行 +=，Python 需要先读取它。",fix:"对计数和求和使用 d.get(key, 0) 取得初值，再写回。",check:"先用只有一条新键的输入测试。"},{symptom:"登记量为 0 时被识别为未登记。",reason:"用值的真假判断键是否存在。",fix:"用 key in d 检查键，按需要再取值。",check:"准备一个存在且值为 0 的键，以及一个完全不存在的键。"},{symptom:"最高项找错或只输出一个并列项。",reason:"比较了键而非值，或命中第一条后过早退出。",fix:"先计算最大值，再按规则筛选键和处理排序。",check:"用空数据、两个并列项及登记顺序与排序顺序相反的例子。"}],summary:["先决定用什么键、重复更新应覆盖还是累加，以及删除后是否要保留旧值。","用 in 表达是否登记，用 get 表达读取默认值。按报表需求选遍历键、值或键值对。","先积累再筛选，最后独立写并列规则。需保留原数据时，往新字典写结果。"],next:"下一课会把反复出现的计算写成函数，例如把一段计数逻辑封装成可多次调用的组件。",references:[{title:"Python 3.12 教程 · 字典",url:"https://docs.python.org/3.12/tutorial/datastructures.html#dictionaries",note:"核对字典键、组合键、查找和遍历的基本用法。"},{title:"Python 3.12 标准类型 · dict",url:"https://docs.python.org/3.12/library/stdtypes.html#mapping-types-dict",note:"核对 get、插入顺序、更新和视图的语义。"},{title:"Python 3.12 术语表 · 可哈希",url:"https://docs.python.org/3.12/glossary.html#term-hashable",note:"核对字典键所需条件以及列表与元组的区别。"},{title:"Python 3.12 内置函数 · max",url:"https://docs.python.org/3.12/library/functions.html#max",note:"核对空可迭代对象与比较最大项的行为。"},{title:"Python 3.12 标准类型 · 字典视图",url:"https://docs.python.org/3.12/library/stdtypes.html#dictionary-view-objects",note:"核对键、值、键值对视图及遍历中增删键的影响。"},{title:"Python 3.12 标准库 · Counter",url:"https://docs.python.org/3.12/library/collections.html#collections.Counter",note:"拓展阅读。核对计数器的键和值与手写计数表的对应关系。"},{title:"Python 3.12 排序指南 · 排序键",url:"https://docs.python.org/3.12/howto/sorting.html#key-functions",note:"核对排序依据的作用，多字段元组优先级可在第 8 课运行观察。"}]},u={goals:["【独立使用】从重复脚本提取计算函数，明确参数、边界责任与返回值，单独检查函数。","【独立使用】用位置、关键字和默认值调用函数，读写元组返回与解包。","【独立使用】用命名函数提供排序依据，比较同分时的第二比较项。","【理解】区分局部绑定、对象修改、输出副作用，以及递归展开与返回。"],prerequisites:"会第 2 课解包和数值运算，第 3、4 课的分支与循环，第 6 课的列表别名、元组和内置排序依据，以及第 7 课的字典并列规则。",version:"以平台的 Python 3.12 为准。Python 解释器设有递归深度限制。可用的调用深度与执行环境及当前调用栈有关，课程中的递归输入已限制在小范围。",topics:[{title:"定义函数，把计算结果交还给调用者",explanation:["执行 def 函数名(参数): 时，Python 创建一个函数对象，并把它绑定到这个名字。缩进的函数体会在调用时执行。定义中的 length 是形参，调用 area(3, 5) 时传入的 3 和 5 是实参。把独立计算封装成函数后，同一段逻辑可以用于多次调用，也能单独用小输入验证。","执行到 return 表达式时，先算出表达式的值，再结束当前这次调用。调用表达式所在的位置得到这个值，所以结果可以赋给变量、参与下一步运算，也可以成为另一次调用的实参。执行到函数结尾或遇到不带表达式的 return 时，返回 None。","用 return first, second 会将两项打包成一个元组返回。调用者可以用 first, second = calculate(...) 按位置解包，两个变量的顺序要与函数约定一致。调拨、拆分等需要同时报告两项结果的任务，都可以用这个写法。","print 把内容写到标准输出。若函数的任务是计算，通常让它 return 结果，由调用者决定是否输出。编程题中可以把 input 和最终的 print 放在外层，函数只接收已转换好的数据并计算，便于复用和判题。","使用契约说明调用者交给函数的条件、它保证返回的值，以及谁负责边界。例如运费函数只收非负克数并返回整数元，零克返回 0。入口负责读取、转换及拒绝负数。把原来重复写的两段计算提取为一个函数，入口对各组数据重用它，测试时也可直接给函数传入小整数。","在未拆分的脚本中，第一件用 first_fee = 5 + (first + 499) // 500，第二件用 second_fee = 5 + (second + 499) // 500，两处都要另写零克分支。提取时把随包裹变化的值命名为 grams，把计费与零克分支移进 fee，再分别用 fee(first) 和 fee(second) 替代原来的计算。按同一组重量核对输出，随后只改 fee 中的档位规则。","P016 可先写普通分支：若字号小于下限就返回下限，若大于上限就返回上限，否则返回字号。外层逐项调用 clamp，把返回值 append 到结果列表，最后 print(*结果)。参考解用 min(max(...)) 表示同一路径，并把普通循环缩为生成器表达式。第 9 课会对照这种写法。"],examples:[{id:"room-area",title:"同一个函数计算两间房的面积",level:"起步",source:`def area(length, width):
    return length * width

first_length, first_width = map(int, input().split())
second_length, second_width = map(int, input().split())
first_area = area(first_length, first_width)
second_area = area(second_length, second_width)
print(first_area + second_area)`,input:`3 5
2 4
`,output:`23
`,purpose:"看到函数定义只写一次，而两次调用各自计算并交回一个结果。",steps:["定义 area 后，读入两行尺寸，每行拆成两个整数。","第一次调用绑定 length=3、width=5，返回 15。第二次使用 2 和 4，返回 8。","外层拿到两个结果，再相加并打印 23。"],pitfall:"把 return 改成 print 后，函数会分别输出两块面积，却返回两个 None。最后用 + 相加会触发 TypeError。"},{id:"print-or-return",title:"显示出来的数字与变量里收到的值",level:"应用",source:`def show(value):
    print(value)


def keep(value):
    return value


saved = show(9)
print(saved)
print(keep(9) * 2)`,input:"",output:`9
None
18
`,purpose:"对照调用副作用与返回值，理解为什么控制台显示的数字可能没有存进变量。",steps:["show(9) 先写出一行 9，执行到函数末尾后返回 None。","saved 接收 None，第二个 print 显示 None。","keep(9) 把整数 9 交回来，外层用它乘 2，再打印 18。"],pitfall:"在 return 下面添加同一分支内的 print，程序执行到 return 就结束这次调用，那条 print 不会执行。"},{id:"return-pair",title:"从一个函数取回整盒数和剩余数",level:"应用",source:`def split_batches(total, batch_size):
    full = total // batch_size
    remaining = total % batch_size
    return full, remaining

boxes, loose = split_batches(23, 5)
print(boxes, loose)`,input:"",output:`4 3
`,purpose:"从一次计算中返回两项相关结果，并在调用处按约定的顺序接收。",steps:["按每盒 5 件处理 23 件，整除得 4，取余得 3。","return full, remaining 把两个整数打包成元组 (4, 3)。","左侧的两个变量按顺序接收，boxes 为 4，loose 为 3。"],pitfall:"若改写为先 return full，下一行再 return remaining，执行第一条 return 时函数就已经结束。"},{id:"shipping-contract",title:"提取运费函数并验证调用边界",level:"应用",source:`def fee(grams):
    if grams == 0:
        return 0
    return 5 + (grams + 499) // 500

first_text, second_text = input().split()
first = int(first_text)
second = int(second_text)
if first < 0 or second < 0:
    print("重量无效")
else:
    print(fee(first), fee(second))
print("零克", fee(0))
print("整档", fee(500))
print("超一克", fee(501))
`,input:`250 1000
`,output:`6 7
零克 0
整档 6
超一克 7
`,purpose:"提取重复的按档计费。契约为接收非负整数克、返回整数元。入口承担非法输入检查。",steps:["原脚本会对 250 和 1000 两次写 5 加档位数。提取后调用同一个函数，250 属一档、1000 属两档，返回 6 与 7。","入口负责打印，函数内部的 return 把整数交回来。零克、500、501 三次直接调用独立验证边界。","把输入改为 -1 500，运行前预测第一行和三条独立验证。然后把每档改成 1000 克，同时修改计费公式及整档、超一克的验证数据。"],pitfall:"若把函数里的 return 改为 print，调用者得到 None，组合两次调用的结果时还会混入额外的行。"}]},{title:"位置参数、关键字参数和默认值",explanation:['位置实参依次交给对应位置的形参，比如 format_tag("湾", "区")。关键字实参按名字绑定，比如 format_tag(prefix="区", name="湾")。在这些普通调用中，两种写法混用时位置实参写在前面。同一个形参重复给值会触发 TypeError。','可以用 def format_tag(name, prefix="区"): 给 prefix 设置默认值。调用不提供 prefix 时才使用默认值。缺少没有默认值的必填参数会报错。参数较多、不同位置参数含义不清楚时，关键字参数能让调用表达出实参的用途。',"默认值表达式在每次执行函数定义时求值。用列表作为默认值，并在函数体里原地追加，会让多次省略参数的调用共享这个列表。常用写法是把默认值设为 None，在函数体内用 is None 判断并创建新列表。调用者显式传入的空列表仍可用于追加。","基础路线用位置、关键字和默认值即可。斜杠限定仅位置参数、星号限定仅关键字参数，以及可变数量的形参，可以在熟悉普通调用后按官方教程拓展。"],examples:[{id:"format-tag",title:"一条标签的默认前缀与指定前缀",level:"起步",source:`def format_tag(name, prefix="区"):
    return prefix + "-" + name

print(format_tag("湾"))
print(format_tag(prefix="库", name="一"))`,input:"",output:`区-湾
库-一
`,purpose:"比较省略可选参数和按名字指定参数两种常见调用。",steps:['第一处按位置绑定 name="湾"，prefix 取默认值 "区"。',"第二处根据实参名字绑定 prefix 和 name，书写顺序和定义不同。","两次都把拼好的字符串交给调用者打印。"],pitfall:'format_tag("湾", name="一") 为 name 提供了两次值。只保留一种传递方式，或把第二个实参改为本来要指定的 prefix。'},{id:"fresh-notes",title:"让省略参数的两次调用各用一张便签",level:"应用",source:`def add_note(note, notes=None):
    if notes is None:
        notes = []
    notes.append(note)
    return notes

print(add_note("甲"))
print(add_note("乙"))
provided = []
add_note("丙", provided)
print(provided)`,input:"",output:`['甲']
['乙']
['丙']
`,purpose:"观察可选列表参数如何同时支持新建列表和追加到调用者提供的列表。",steps:["前两次调用都把 notes 设为 None，分别执行 notes = []，得到各自的新列表。","第三次传入 provided，此时 notes 指向这个空列表，条件 notes is None 为假。","append 就地写入传来的列表，所以外层通过 provided 也能看到丙。"],pitfall:"若写成 notes=[]，省略实参时会共用定义时的列表。若用 if not notes，显式传进来的空列表也会被换掉。"}]},{title:"跟踪局部名字和共享对象",explanation:["每次调用都有自己的执行帧，其中保存本次的形参和局部变量等状态。函数里的普通赋值会绑定局部名字，同名外部变量仍保留自己的绑定。函数也能读取可见的外部名字，但把计算的依赖写成参数通常更容易追踪和测试。","传入列表时，形参和调用者的变量可以指向同一个对象。values.append(...) 改变了对象本身，通过原来的名字也看得到变化。values = [...] 则让当前调用内的 values 指向另一个对象，调用者的变量依然指向原列表。","若函数体内对某个名字做了普通赋值，Python 通常把该名字视作局部变量。若在本次调用给它赋值前就读取，会触发 UnboundLocalError。例如在函数里第一次读 total 就写 total = total + amount，可以改为把旧值作为参数传入，再把新值 return 出去。","第 6 课将 str.lower 交给 key。这里可自己定义排序函数，它只接收一条记录并返回比较依据。给 (-次数, 编号) 时先看第一项，只有相同时再看第二项。传 key=rank_key，把调用时机交给 sorted；写 rank_key(...) 会提前执行一次，拿到的是结果。"],examples:[{id:"local-discount",title:"两处折扣变量的值各自独立",level:"起步",source:`discount = 8


def quote(cost, discount):
    final_cost = cost - discount
    return final_cost

print(quote(30, 3))
print(discount)`,input:"",output:`27
8
`,purpose:"看到形参及函数体内创建的局部名字属于当前调用。",steps:["外层把 discount 绑定到整数 8。","调用 quote 时，当前执行帧中的 cost 为 30、discount 为 3，final_cost 得到 27。","调用结束，外层接到 27。再读取外层的 discount，仍为 8。"],pitfall:"在函数外直接使用 final_cost 会找不到这个局部名字。可在外层用 result = quote(30, 3) 接收返回值。"},{id:"mutate-or-rebind",title:"先追加，再让形参指向新列表",level:"应用",source:`def update_list(values):
    values.append("甲")
    values = ["乙"]
    return values

items = ["起"]
updated = update_list(items)
print(*items)
print(*updated)`,input:"",output:`起 甲
乙
`,purpose:"把同一次调用中的对象修改与名字重新绑定分别画出来。",steps:['调用开始时，items 和 values 指向同一个列表 ["起"]。','append 添加甲，原列表成为 ["起", "甲"]，外层 items 能看到变化。',"给 values 赋新列表后，items 仍指向旧列表。return 交回新列表，让 updated 指向它。print(*列表) 将各元素分开输出。"],pitfall:"若要保留外层列表的原内容，先用 values.copy() 复制，再给副本追加。直接写 copy = values 仍指向原列表。第 6 课讲过，浅复制后内层列表仍可能共享。"},{id:"named-ranking-key",title:"用命名函数实现次数优先和编号并列规则",level:"应用",source:`def rank_key(record):
    seat, count = record
    return -count, seat

records = [(12, 2), (2, 2), (7, 1)]
print("依据", rank_key(records[0]), rank_key(records[1]))
for seat, count in sorted(records, key=rank_key):
    print(seat, count)
`,input:"",output:`依据 (-2, 12) (-2, 2)
2 2
12 2
7 1
`,purpose:"延伸第 7 课的并列情况。先独立检验 key 的返回值，再检查完整顺序。",steps:["rank_key 对 (12, 2) 交回 (-2, 12)，对 (2, 2) 交回 (-2, 2)。两个第一项一样，较小的第二项先排。","次数为 1 的记录的依据是 (-1, 7)，排在两个 -2 之后。排序输出仍是原记录。","把并列要求改为编号大者先排，先手推，再将次要依据改成 -seat 并对比输出。"],pitfall:"用 reverse=True 会同时反转次数和编号两个方向。需要一升一降时，分别表达各项方向。"}]},{title:"递归的停止条件、调用和返回",explanation:["函数体内可以再次调用自己。先明确哪些输入能直接得到答案，再把其他输入变成更小的同类问题。递归调用返回后，由当前调用把小问题的结果组装成当前结果。每一层都有独立的参数，上一层会等下一层返回。","在整数递归里，可用非负整数每次减一或整除到更小值。在树形或嵌套列表问题中，可把任务交给每个子结构。设计停止条件时要检查边界能否真的到达，并覆盖空结构。手算时分别画出参数如何向下变化、结果如何向上合并。","递归太深会触发 RecursionError。对于较大规模、每次只处理一个更小整数的任务，循环通常更节省调用栈空间。嵌套结构中，递归可以让代码直接表现每个子结构的相同处理规则，仍需留意输入深度。","核心函数掌握后，再跟踪递归。用 sum_to(2) 写下调用链 2→1→0。返回从 0 开始，回到 1 得 1，再回到 2 得 3。用输入 0 验证停止分支，可用 while 或 for 维护总和作为独立核对。输入规模和递归深度属于拓展，先练能手推的小数据。"],examples:[{id:"recursive-sum",title:"先把求和缩小到 0，再逐层相加",level:"起步",source:`def sum_to(n):
    if n == 0:
        return 0
    return n + sum_to(n - 1)

print(sum_to(int(input())))`,input:`4
`,output:`10
`,purpose:"在 0 到 30 的非负输入中跟踪线性递归的参数和结果。",steps:["sum_to(4) 需要 sum_to(3) 的结果，依次调用到 sum_to(0)。","参数为 0 的调用直接返回 0，启动返回过程。","返回依次得到 1、3、6、10。最外层只打印一次 10。"],pitfall:"若误用 sum_to(n + 1)，正整数会越来越大，无法到达 0，最终过深。也应核对输入范围是否允许负数。"},{id:"nested-leaves",title:"清点嵌套清单中的整数",level:"应用",source:`def leaf_count(node):
    if isinstance(node, int):
        return 1
    total = 0
    for child in node:
        total += leaf_count(child)
    return total

print(leaf_count([3, [7, [], [4, 1]], 5]))`,input:"",output:`5
`,purpose:"处理只含整数和列表的嵌套数据，体会为什么同一规则能适用于每个子列表。",steps:["isinstance(node, int) 判断当前对象是否为整数。每遇到整数就交回 1。","列表要逐项处理。空列表没有项，total 保持 0。子列表 [4, 1] 返回 2。","中间列表 [7, [], [4, 1]] 返回 1 + 0 + 2，也就是 3。最外层再加两个整数对应的计数，得到 5。"],pitfall:"len(node) 只数当前列表中的元素。最外层长度为 3，其中一个元素还是列表，需要继续向下数。"}]}],exercises:[{kind:"coding",problem:"P076",level:"基础编程",goal:"按签名返回整数，同一解释器多次调用时保持结果独立。"},{kind:"question",id:"function-return-value",legacy:"explain",goal:"识别哪个关键字会把计算结果交还给调用者。",prompt:"函数用什么关键字把计算结果交给调用者？",options:[{label:"print",feedback:"print 负责显示内容。用 result = print(5) 接到的是 None。"},{label:"input",feedback:"input 从输入读取文本，它在被调用时返回读到的字符串。"},{label:"return",feedback:"return 表达式会结束当前调用并把表达式的值交给外层。"}],answer:2},{kind:"question",id:"function-nested-call",legacy:"predict",goal:"从内到外追踪嵌套调用中的返回值。",prompt:"若 f(x) 返回 x + 3，计算 f(f(2)) 得到什么？",options:[{label:"5",feedback:"5 是内层 f(2) 的返回值，还要把它交给外层 f。"},{label:"8",feedback:"内层返回 2 + 3 = 5，外层用 5 作为实参，得到 5 + 3 = 8。"},{label:"10",feedback:"两次调用都只加 3。初始值是 2，依次得到 5 和 8。"}],answer:1},{kind:"question",id:"function-shared-default",goal:"判断省略可变默认参数时能否观察到之前的修改。",prompt:"下列代码两次都没有传 labels。第二次打印的列表中有哪些元素？",demonstration:{source:`def record(value, labels=[]):
    labels.append(value)
    return labels

print(record("a"))
print(record("b"))`,input:"",output:`['a']
['a', 'b']
`},options:[{label:"只有 b",feedback:"此结果需要在第二次调用中创建新列表。这里的 [] 在执行 def 时已创建，两个调用共享它。"},{label:"a 和 b，按这个顺序",feedback:"第一次追加 a，第二次在同一个默认列表末尾追加 b。用默认值 None 并在函数体内创建列表可让两次调用独立。"},{label:"只有 a",feedback:"第二次确实会运行函数体，append 会在原列表后追加 b。"}],answer:1},{kind:"question",id:"function-halving-steps",goal:"区分递归调用经过的状态数与实际执行的变换次数。",prompt:"参数为 9 时，每次将参数整除 2，直到参数小于等于 1。以下函数返回多少？",demonstration:{source:`def shrink(n):
    if n <= 1:
        return 0
    return 1 + shrink(n // 2)

print(shrink(9))`,input:"",output:`3
`},options:[{label:"2",feedback:"9 → 4 → 2 后仍需再整除一次。n = 2 尚未到达停止条件。"},{label:"3",feedback:"参数依次是 9、4、2、1。前三层各贡献一次，参数为 1 的停止层贡献 0。"},{label:"4",feedback:"一共进入了四次函数体，但最后一次直接返回 0，没有继续整除。"}],answer:1},{kind:"coding",problem:"P015",level:"基础编程",goal:"把可复用的单位换算提取成函数，将换算与循环读入分开。"},{kind:"coding",problem:"P051",level:"基础编程",goal:"为两组尺寸复用同一个周长函数，并根据返回值比较结果。",starterExample:"room-area"},{kind:"coding",problem:"P016",level:"综合应用",goal:"定义接收边界的限幅函数，将同一规则应用到整行数据。"},{kind:"coding",problem:"P052",level:"综合应用",goal:"从函数接收两项更新结果，把第一次调拨后的状态用于第二次调拨。"},{kind:"coding",problem:"P053",level:"拓展挑战",goal:"判断何时无法继续整除，递归累计次数并保留最终余下的因子。"},{kind:"coding",problem:"P054",level:"拓展挑战",goal:"将不等长的两半分别处理，同时合并最终袋数和最大拆分深度。"}],mistakes:[{symptom:"计算函数中看到了正确的数字，外层计算却收到 None。",reason:"函数执行了 print，并走到结尾。",fix:"在函数中 return 计算结果，在外层统一输出。",check:"用小数据验证返回值的类型，检查每个分支是否都能执行到需要的 return。"},{symptom:"本来互不相干的两次调用，后一项结果包含前一项数据。",reason:"两次省略实参，共用了同一个可变默认对象。",fix:"将默认值设为 None，再在函数体内初始化新对象。",check:"连续调用两次，再显式传入空列表调用一次，分别核对三个结果。"},{symptom:"函数内读取计数器时出现 UnboundLocalError。",reason:"函数给这个名字赋值，Python 将它作为局部变量，而读取先于局部绑定。",fix:"把原值作为实参，在函数里生成并返回新值。",check:"找出函数体第一次读取和第一次赋值的位置，确认每条执行路径上的先后。"},{symptom:"递归没有得到预期结果，或出现 RecursionError。",reason:"遗漏停止条件，参数没有缩小，或保证会停止但调用过深。",fix:"先单独验证停止条件，再确认每次调用的参数向它推进。规模较大的线性递归可以用循环。",check:"从边界值和紧邻边界的两个小值开始，列出参数变化和返回值。"}],summary:["先说清输入、返回和边界责任，再从重复代码提取函数。用直接调用检查零值、整档或并列情形。","把输入输出放在调用层，计算层返回值。区分修改对象、给局部名重新赋值和创建新对象。","把排序规则写成可单独验证的命名函数。递归先确定停止条件，再检查每层参数变小和返回值如何结合。"],next:"下一课会把能独立使用的函数放入模块，学习如何在不同文件中导入和调用，并区分定义函数与主动执行入口代码。",references:[{title:"Python 3.12 官方教程 · 定义函数",url:"https://docs.python.org/3.12/tutorial/controlflow.html#defining-functions",note:"核对定义、形参与实参、调用时的局部符号表和 None 返回值。"},{title:"Python 3.12 官方教程 · 函数默认值与关键字参数",url:"https://docs.python.org/3.12/tutorial/controlflow.html#default-argument-values",note:"核对默认表达式的求值时机、可变默认值和接下来的关键字实参示例。"},{title:"Python 3.12 官方教程 · 元组与解包",url:"https://docs.python.org/3.12/tutorial/datastructures.html#tuples-and-sequences",note:"核对用逗号打包元组和按序列位置解包的语法。"},{title:"Python 3.12 语言参考 · 名称解析",url:"https://docs.python.org/3.12/reference/executionmodel.html#resolution-of-names",note:"核对函数体内赋值时的本地名字范围和 UnboundLocalError。"},{title:"Python 3.12 标准库 · 解释器递归限制",url:"https://docs.python.org/3.12/library/sys.html#sys.getrecursionlimit",note:"核对解释器栈深度限制与运行环境的关系。"},{title:"Python 3.12 语言参考 · return",url:"https://docs.python.org/3.12/reference/simple_stmts.html#the-return-statement",note:"核对返回语句结束当前调用、返回值与 None。"},{title:"Python 3.12 排序指南 · 排序键",url:"https://docs.python.org/3.12/howto/sorting.html#key-functions",note:"核对按记录生成排序依据，并将函数传给 key。"}]},c={goals:["【独立使用】按输入、返回值和业务边界选择标准库工具，读写 import、from import 和 as。","【独立使用】把单文件计算拆为入口和同目录模块，分别运行入口与工具自测。","【理解】预测顶层代码与入口判断何时执行，利用异常或额外输出定位导入问题。","【理解】用普通循环读懂生成器表达式。"],prerequisites:"会第 2、4 课的数字拆分与循环，第 6 课的列表推导式和元组，第 8 课的函数契约。能先直接调用函数，再通过输入输出核对完整程序。",version:"以平台的 Python 3.12 为准。math.isqrt 从 3.8 提供，math.lcm 从 3.9 提供。本课日期输入统一为 YYYY-MM-DD，示例用随解释器提供的标准库。",topics:[{title:"导入模块并使用其中的名字",explanation:["模块提供一组可以被其他代码使用的名字，例如函数、常量或类型。import math 先让 Python 查找并取得 math 模块，再把这个模块绑定到当前文件中的 math 名称。math.isqrt 中的点表示从这个模块查找 isqrt。模块各有自己的全局名字空间，所以几个模块能各自定义同名函数。","from math import isqrt 把模块中的 isqrt 直接绑定在当前作用域，之后可写 isqrt(n)。这条语句本身不会引入 math 这个名字。import math as geometry 则把模块绑定到 geometry，调用形式是 geometry.isqrt(n)。简短名称便于频繁调用，保留模块前缀通常更方便识别来源。","Python 随安装环境提供标准库。遇到日期运算、整数平方根等通用需求，先查函数签名、返回值和适用范围。平台的课程使用随解释器提供的模块，可在本地离线运行示例。"],examples:[{id:"module-gcd",title:"用数学模块把比例约到最简",level:"起步",source:`import math

left, right = map(int, input().split())
common = math.gcd(left, right)
print(left // common, right // common)`,input:`18 24
`,output:`3 4
`,purpose:"观察模块前缀的作用，并把库函数的返回值用在后续计算中。两个输入均为正整数。",steps:["import math 将 math 绑定为模块名。","math.gcd(18, 24) 返回最大公约数 6。","用同一个 6 分别整除两个输入，得到约分后的 3 和 4。"],pitfall:"只写 import math 时直接调用 gcd(left, right) 会找不到名字 gcd。用 math.gcd 或改成显式的 from 导入。"},{id:"module-alias",title:"给导入函数取一个表明用途的名字",level:"应用",source:`from math import isqrt as floor_root

number = int(input())
root = floor_root(number)
print(root)
print(root * root <= number < (root + 1) ** 2)`,input:`48
`,output:`6
True
`,purpose:"观察 from 与 as 的绑定结果。isqrt 返回不超过精确平方根的最大整数。",steps:["把 math 中的 isqrt 绑定到当前文件的 floor_root。","48 的整数平方根是 6，因为 36 ≤ 48 < 49。","先打印 6，再用链式比较验证这两个边界。"],pitfall:"导入时指定 floor_root 后，此语句不提供原名 isqrt。输入还必须是非负整数。"}]},{title:"根据返回值和业务规则选择标准库工具",explanation:["日期字符串适合读写，日期对象适合运算。date.fromisoformat() 可以把本课的 YYYY-MM-DD 转为日期对象；两个日期相减得到 timedelta，再取 .days。给日期加 timedelta(days=1) 会正确处理月底、闰年和跨年。","weekday() 从周一的 0 数到周日的 6。工作日规则需要程序自己定义，例如把 0–4 当作业务日。工具负责日期换算，程序决定周末是否计入、起始日是否计入。","普通 median 在数据量为偶数时取中间两项的均值，结果可能从未出现。median_low 在偶数个值时取中间偏小的一项，结果始终来自输入。整数边界也一样，若要比较准确的平方关系，优先用 isqrt 和整数乘法，避免浮点数舍入造成误判。","P058 先用普通循环读站点：每轮用 sx, sy = map(int, input().split()) 解包，再将 (sx, sy) 追加到 stations。对一个待覆盖点，遍历 stations，把每个平方距离加进列表，最后取 min 得最近的距离平方。用最远的这一项决定半径。已知至少有一个站时，min 有输入。","读到 min(距离表达式 for sx, sy in stations) 时，对照那个循环。括号中的生成器表达式逐项提供数值给 min，可以省去中间列表。P016 的字号也同理，先写循环、打印结果，再看生成器写法。P019 会用 sum 同样消费逐行产生的 1。"],examples:[{id:"module-next-day",title:"跨过闰日一探日历规则",level:"起步",source:`from datetime import date, timedelta

start = date.fromisoformat(input())
end = start + timedelta(days=2)
print(end.isoformat())
print(end.weekday())`,input:`2024-02-28
`,output:`2024-03-01
4
`,purpose:"把日期文本变成可运算的对象，再转换为输出文本。",steps:["解析 2024-02-28，得到 date 对象。","加两天会经过 2 月 29 日，落在 3 月 1 日。","isoformat 返回日期字符串。3 月 1 日是周五，weekday 返回 4。"],pitfall:"给日期字符串直接加 2 不会做日历运算。需要先构造 date，再加 timedelta。"},{id:"module-median",title:"比较普通中位数与低中位数",level:"应用",source:`import statistics

values = list(map(int, input().split()))
print(statistics.median(values))
print(statistics.median_low(values))`,input:`18 3 12 6
`,output:`9.0
6
`,purpose:"从相似函数中选出满足业务约束的那个，支持任意非空整数行。",steps:["读到四个值，内部排序后是 3、6、12、18。","median 取中间的 6 和 12 的平均，得到 9.0。","median_low 取靠左的 6，适用于结果必须是原始值的情形。"],pitfall:"取输入中间的位置不等于取排序后的中间位置。数据为空时两个函数都报 StatisticsError。"},{id:"module-distance-loop",title:"从距离循环读懂生成器表达式",level:"应用",source:`from math import isqrt

x, y = map(int, input().split())
stations = [(0, 0), (3, 4)]
squares = []
for sx, sy in stations:
    square = (x - sx) ** 2 + (y - sy) ** 2
    squares.append(square)
closest = min(squares)
compact = min((x - sx) ** 2 + (y - sy) ** 2 for sx, sy in stations)
root = isqrt(closest)
if root * root < closest:
    root += 1
print(squares)
print(closest, compact, root)
`,input:`2 3
`,output:`[13, 2]
2 2 2
`,purpose:"从列表和普通循环过渡到逐项产生值的写法，核对 P058 的整数开方。",steps:["离两个站的平方距离分别是 13 和 2。先收列表再求 min 和让 min 逐个取生成器的值，最小值都是 2。","isqrt(2) 是 1，半径 1 不足以覆盖平方距离 2，因此增加到 2。","把待覆盖点改为 3 4，先预测两个平方距离和最小半径。保留普通循环核对简写。"],pitfall:"min 所消费的序列必须含有值。删光站点前应先约定无站点如何处理。"}]},{title:"把同目录的 Python 文件变成自己的模块",explanation:["把一组相关函数放到另一个 .py 文件后，可以用它的模块名导入。本站把入口文件和辅助文件加载到同一个临时工作目录，并把目录加入搜索路径。badge_text.py 对应 badge_text，写 import badge_text 就能在 main.py 使用其中的函数。","首次成功导入普通源码模块时，Python 会执行它的顶层语句，包括函数定义和顶层 print。函数体只有调用时才运行。成功导入后的模块对象以模块名缓存于 sys.modules；在同一次解释器会话里，以相同模块名再次导入通常直接取得已有对象。","本站每次点运行都会用新的解释器执行最新一份文件快照。因此运行内的重复 import 不会重复初始化，修改辅助文件后按运行则会读取新内容。自建文件名宜用易识别的字母与下划线，也应避免与已在使用的标准库模块重名。","ModuleNotFoundError 时先看错误最后一行点名的是哪个模块，核对工作区内 .py 文件的拼写和位置。如果错误来自辅助文件内部的 import，再沿调用栈检查它依赖的文件。本课编辑器用同一层文件名。模块名的大小写要和文件名对应。","将单文件拆分时，先圈出不依赖 input 和 print 的函数，例如 label(zone, number)。把定义移到 label_tool.py，在 main.py 导入，保留原来的读入、转换和最终打印。用同一组输入核对拆分前后的结果。"],examples:[{id:"module-edit-label",title:"把展签格式放进辅助文件",level:"起步",source:`from badge_text import make_label

zone, number = input().split()
print(make_label(zone, int(number)))`,files:[{name:"badge_text.py",content:`def make_label(zone, number):
    return f"{zone}-{number:02d}"
`}],input:`B 7
`,output:`B-07
`,purpose:"让入口读写数据，辅助模块维护格式。展开后可切换 badge_text.py 修改格式并运行。",steps:["main.py 通过模块名 badge_text 查找同目录的辅助文件。","导入时定义 make_label，调用时才格式化。02d 表示整数宽度至少两位，用 0 补齐。","入口从标准输入读到 B 和 7，调用函数得到 B-07。可把辅助文件里的 - 改为 /，再运行看差异。"],pitfall:"写 from badge_text.py import make_label 会把点当成层级语法。文件后缀仍为 .py，导入时写 badge_text 即可。"},{id:"module-import-once",title:"跟踪同一次运行里重复导入的顺序",level:"应用",source:`print("开始")
import demo_counter
import demo_counter as same_module
print(demo_counter is same_module)
print(same_module.double(5))`,files:[{name:"demo_counter.py",content:`print("载入模块")


def double(number):
    return number * 2
`}],input:"",output:`开始
载入模块
True
10
`,purpose:"用一次有意保留的顶层输出观察加载，验证两种绑定是否拿到同一个对象。",steps:["入口先打印“开始”。首次导入时辅助文件打印“载入模块”并定义函数。","第二次导入同一模块名只绑定别名。is 检查两个名字是否指向同一个对象，结果为 True。","调用辅助函数得到 10。在本站再次点运行时，整个过程会从头开始。"],pitfall:"不要依赖多次 import 去反复运行初始化。适合重复执行的动作应放进函数并显式调用。"},{id:"module-missing-name",title:"按异常消息修正辅助模块名",level:"应用",source:`from label_tools import label

zone, raw = input().split()
print(label(zone, int(raw)))
`,files:[{name:"label_tool.py",content:`def label(zone, number):
    return f"{zone}-{number:02d}"


if __name__ == "__main__":
    assert label("B", 7) == "B-07"
    assert label("A", 0) == "A-00"
    print("两组自测通过")
`}],input:`B 7
`,output:"",diagnostic:{kind:"ModuleNotFoundError",file:"main.py",line:1},purpose:"运行一次失败的导入，从消息里的名字找到工作区已有的文件。",steps:["导入请求的是 label_tools，而文件列表里只有 label_tool.py。解释器在第一行抛出 ModuleNotFoundError。","程序还没执行 input，因此没有标准输出。点击错误位置，比较导入名和辅助文件名。","把首行改成 from label_tool import label，保持两份文件均在同一层，再运行，应输出 B-07。也可载入「拆分标签入口与工具自测」对照。"],pitfall:"不要给导入名加 .py。移动到另一个目录时也要确认解释器搜索路径。"}]},{title:"区分入口执行与被导入",explanation:['直接运行入口文件时，Python 将入口的 __name__ 设为 "__main__"。被导入的普通模块用自己的模块名。比较 if __name__ == "__main__": 可以让直接运行专属的代码放在条件内部，同时让外部程序取得模块中定义的工具。',"组织一个小程序时，可以让 main() 处理标准输入和输出，让辅助函数接收数据并返回结果。在顶层定义函数，在入口判断里调用 main()。每个文件只有真正属于入口的动作才放到这个分支里。顶层的其他语句仍然在导入时执行。","调试导入问题时，先检查模块文件是否在工作区，再看导入语句给当前文件绑定了什么名字。出现额外输出或意外等待输入时，沿 import 去看辅助文件的顶层语句。评测程序应只输出题面要求的内容。","直接运行工具文件时，它也可以有一段独立自测。第 11 课会详讲 assert。这里先把 assert 实际值 == 预期值 读作一次核对，条件为假会停在失败的检查。直接执行和被导入时分别跑一次，检查是否发生额外读入或输出。","拓展主题包括包的层次、第三方库和虚拟环境。基础篇先在平台用随解释器提供的标准库与同目录工具文件。"],examples:[{id:"module-main-entry",title:"把读写集中在 main 函数",level:"起步",source:`def total_minutes(hours, minutes):
    return hours * 60 + minutes


def main():
    hours, minutes = map(int, input().split())
    print(total_minutes(hours, minutes))


if __name__ == "__main__":
    main()`,input:`2 15
`,output:`135
`,purpose:"看见入口执行会进入条件分支，同时让换算函数适合在其他程序复用。",steps:["执行两个 def，创建换算函数与 main。",'当前是直接运行的入口，__name__ 为 "__main__"，调用 main。',"main 读到 2 小时 15 分，把 135 写到输出。"],pitfall:"把 main() 写到顶层时，导入该文件也会尝试读取标准输入。入口判断后要正确缩进。"},{id:"module-guard-import",title:"导入工具时跳过模块里的演示",level:"应用",source:`import station_label

name = input()
print(station_label.label(name))
print(station_label.__name__)`,files:[{name:"station_label.py",content:`def label(name):
    return "登记 " + name


if __name__ == "__main__":
    print(label("测试"))
`}],input:`小舟
`,output:`登记 小舟
station_label
`,purpose:"让模块保留独立运行的演示，并让使用者导入时只取得所需函数。",steps:["导入 station_label 时定义 label。模块的 __name__ 是 station_label，入口条件不成立。","main.py 读到小舟并调用 label，输出“登记 小舟”。","读取模块的 __name__ 得到 station_label，验证它这次的角色。"],pitfall:"把最后的 print 移出入口判断会让导入也输出“登记 测试”。额外行会影响标准输出评测。"},{id:"module-single-label",title:"在单个文件生成区域标签",level:"起步",source:`def label(zone, number):
    return f"{zone}-{number:02d}"


def main():
    zone, raw = input().split()
    print(label(zone, int(raw)))


if __name__ == "__main__":
    main()
`,input:`B 7
`,output:`B-07
`,purpose:"在一个 main.py 中完成读入、整数转换和标签输出。区域与编号由空白分隔。02d 让整数至少显示两位，不足时补零。",steps:["运行 main.py 时先定义 label 和 main。入口条件成立，才调用 main 读取一行标准输入。","把输入拆成区域 B 和编号文本 7，用 int 转成整数，再调用 label。它交回 B-07，由 main 打印。","把输入改成 A 0，先预测 A-00 再运行。接着载入下一个示例，分别用这两组输入验证拆分后的结果。"],pitfall:"输入读写放在 main，label 只接收区域和整数并返回标签，这样移动函数后仍可用同样的参数单独检查。"},{id:"module-split-label",title:"拆分标签入口与工具自测",level:"应用",source:`from label_tool import label


def main():
    zone, raw = input().split()
    print(label(zone, int(raw)))


if __name__ == "__main__":
    main()
`,files:[{name:"label_tool.py",content:`def label(zone, number):
    return f"{zone}-{number:02d}"


if __name__ == "__main__":
    assert label("B", 7) == "B-07"
    assert label("A", 0) == "A-00"
    print("两组自测通过")
`}],input:`B 7
`,output:`B-07
`,purpose:"把上一示例的 label 定义从 main.py 移到同目录的 label_tool.py。在 main.py 原定义的位置加导入语句，保留主函数、读入、转换、调用、打印和入口判断。",steps:["导入时执行工具文件中的 def，得到 label；工具文件这时名为 label_tool，它不运行入口判断内的测试。","main.py 直接执行时调用 main，处理与单文件版相同的一行输入。B 7 只输出 B-07，A 0 只输出 A-00。",'将 label_tool.py 的完整代码复制到在线工作台并选它为运行入口。此时 __name__ 为 "__main__"，两条 assert 会检查返回值，全部通过后输出“两组自测通过”。',"把工具中的最后一条 print 取消缩进，再运行原入口。导入时出现“两组自测通过”，但两条 assert 仍在入口判断内，这次并未执行。恢复缩进，确认再次运行只输出 B-07。"],pitfall:"库工具把数据作为参数接收。顶层直接读输入或打印演示，会给导入它的入口添加意外行为。"}]}],exercises:[{kind:"coding",problem:"P077",level:"综合应用",goal:"从两个起始文件完成入口与报价函数，分别通过导入调用和脚本测试。"},{kind:"question",id:"module-local-name",legacy:"explain",goal:"把磁盘文件名与导入语句中的模块名对应起来。",prompt:"同目录有 tools.py，想在入口引入该模块时应该写什么？",answer:1,options:[{label:"import tools.py",feedback:"导入中的点表示模块层级，文件名后缀不用写。"},{label:"import tools",feedback:"Python 按模块名 tools 查找同目录的 tools.py，并在当前作用域绑定 tools。"},{label:"open(tools)",feedback:"open 用于打开文件，不会执行并绑定模块。"}]},{kind:"question",id:"module-qualified-call",legacy:"predict",goal:"根据 import math 知道当前作用域新增的名字。",prompt:"仅执行 import math 后，要怎样调用 math 里求平方根的函数？",answer:1,options:[{label:"sqrt(9)",feedback:"这需要先用 from math import sqrt 等方式绑定 sqrt。"},{label:"math.sqrt(9)",feedback:"import math 绑定模块名 math，点号从这个模块找到 sqrt。"},{label:"math(9)",feedback:"math 是模块，调用位置应该使用某个具体函数。"}]},{kind:"question",id:"module-same-binding",goal:"推断使用别名重复导入时会得到什么对象。",prompt:"下面两次导入后，比较两个模块对象会输出什么？",answer:0,demonstration:{source:`import math
import math as geometry
print(math is geometry)`,input:"",output:`True
`},options:[{label:"True",feedback:"两次使用的模块名都是 math。别名只改变当前文件中的绑定，这两个名字指向同一个模块。"},{label:"False",feedback:"as 没有复制模块。它把当前已有的模块对象绑定到另一个名字。"},{label:"NameError",feedback:"两行导入分别提供 math 和 geometry，两个名字都能使用。"}]},{kind:"question",id:"module-entry-role",goal:"识别入口自己的名字与被导入模块的名字。",prompt:"在本站按运行直接执行下列代码，输出是什么？",answer:2,demonstration:{source:`import statistics
print(__name__, statistics.__name__)`,input:"",output:`__main__ statistics
`},options:[{label:"main statistics",feedback:'入口文件即便叫 main.py，直接运行时的 __name__ 也为 "__main__"。'},{label:"__main__ __main__",feedback:'只有执行入口用 "__main__"。导入的标准库模块仍保留自己的名字。'},{label:"__main__ statistics",feedback:"第一个是当前入口的名字，第二个是被导入模块的名字。它们可以各自用入口判断。"}]},{kind:"coding",problem:"P017",level:"基础编程",goal:"把两个周期首次对齐的时间建模为最小公倍数。"},{kind:"coding",problem:"P055",level:"基础编程",starterExample:"module-alias",goal:"用整数平方根找能铺成的最大正方形，同时输出剩余材料数。"},{kind:"coding",problem:"P018",level:"综合应用",goal:"解析日期并求非负天数，重点检查闰年、世纪年和反向日期。"},{kind:"coding",problem:"P057",level:"综合应用",goal:"选用确保结果是原始读数的统计函数，再统计上、下读数数量。"},{kind:"coding",problem:"P056",level:"拓展挑战",goal:"把日期运算与工作日计数结合，避免把起始日和周末算进去。"},{kind:"coding",problem:"P058",level:"拓展挑战",goal:"先比较平方距离，再用标准库求能覆盖所有观测点的最小整数半径。"}],mistakes:[{symptom:"明明导入了 math，调用 sqrt 却出现 NameError。",reason:"import math 绑定的是模块名。",fix:"用 math.sqrt，或显式 from math import sqrt。",check:"把导入语句写出的当前名字与出错行逐个对应。"},{symptom:"找不到辅助模块，或加载了与意图不同的模块。",reason:"文件没在当前工作区、文件名和导入名不匹配，或自定义文件和标准库重名。",fix:"用可区分的模块名，将辅助文件和入口一起放在工作区。",check:"核对文件列表、模块名和后缀。普通源码模块可查看其 __file__ 辅助判断来源。"},{symptom:"刚 import 就多输出一行，或提前耗掉一行输入。",reason:"辅助模块把 print 或 input 写在顶层。首次导入会执行这些语句。",fix:"把顶层动作移入函数，将直接运行的入口调用放到 __name__ 判断里。",check:"用一个只导入该模块的最小入口验证没有意外读写。"}],summary:["按函数签名、返回结果和数据边界选标准库工具。普通循环与生成器表达式可用同一组数据互相核对。","入口负责读写，辅助模块定义可复用工具。对照文件名、模块名和搜索目录排查导入失败。","分别检查直接运行和作为模块导入。模块内自测放进入口判断，保持导入后的输出符合约定。"],next:"下一课会把程序的结果写进文本、CSV 和 JSON 文件，并用读回结果检验保存和转换的规则。",references:[{title:"Python 3.12 语言参考 · 导入系统",url:"https://docs.python.org/3.12/reference/import.html#the-module-cache",note:"核对按模块名缓存对象以及再次导入的行为。"},{title:"Python 3.12 标准库 · 数论与表示函数",url:"https://docs.python.org/3.12/library/math.html#number-theoretic-and-representation-functions",note:"核对 gcd、lcm、isqrt 的约束、版本和整数结果。"},{title:"Python 3.12 标准库 · 日期与间隔",url:"https://docs.python.org/3.12/library/datetime.html#date-objects",note:"核对日期对象的解析、运算和星期编号。"},{title:"Python 3.12 标准库 · 中位数",url:"https://docs.python.org/3.12/library/statistics.html#statistics.median_low",note:"核对偶数个数据时低中位数和普通中位数的区别。"},{title:"Python 3.12 教程 · 作为脚本运行模块",url:"https://docs.python.org/3.12/tutorial/modules.html#executing-modules-as-scripts",note:"核对入口和被导入时的 __name__，以及仅直接运行时触发的自测。"},{title:"Python 3.12 教程 · 模块搜索路径",url:"https://docs.python.org/3.12/tutorial/modules.html#the-module-search-path",note:"核对脚本目录、搜索顺序以及与标准库同名时的影响。"},{title:"Python 3.12 语言参考 · 生成器表达式",url:"https://docs.python.org/3.12/reference/expressions.html#generator-expressions",note:"核对表达式先提供可迭代结果，值随后由 min 或 sum 逐项取得。"}]},d={goals:["【理解】说明相对路径从哪里解析，区分编辑器附带文件与本次运行的临时产物。","【独立使用】用 with 读取 UTF-8 原文，选择覆盖或追加，写出目标文件并读回验证。","【独立使用】区别读到末尾、空行和纯空白，按约定保留布局或清理字段。","【独立使用】按数据结构选文本、CSV 或 JSON，核对字段引号与布尔值转换。"],prerequisites:"用第 5 课的 split、strip、repr 观察原文，用第 4、6、7 课的循环、列表和字典整理记录，并按第 9 课方式导入标准库。",version:"以平台的 Python 3.12 为准。入口和附带文件位于同一临时工作目录。程序对文件的写入只能在这次运行中读回。编辑器保存的是你编辑的工作区文件。",topics:[{title:"打开、写入并关闭 UTF-8 文本",explanation:['open(路径, 模式, encoding="utf-8") 会返回可以读写的文件对象。文本模式读写的是 Python 字符串，Python 根据 encoding 在字符与文件中的字节之间转换。相对路径从程序当前工作目录解析，因此本站可以用文件名访问同一工作区的附带文件。在本地处理中文时也适合明确写出编码。',"with open(...) as file: 让 file 在缩进块内保持打开。离开块时会关闭文件，即使中途有异常也会执行关闭动作。写入可能先经缓冲，关闭会完成缓冲内容的写出。一个常见顺序是写入并结束 with，再打开另一个读取块验证。",'write() 按给出的文本写入。每条记录需要独占一行时，要显式加上 "\\n"。运行中生成的文件可以立即用另一个 with 读回。本站下一次运行会重新加载编辑器文件快照，运行期间的文件变更不会写回编辑器。',"相对路径以当前工作目录为起点，不一定是脚本自身所在目录。本站每次把编辑器内的主文件与附带文件复制到临时的 /work，随后从那里执行。打开 raw.txt 得到附带的源文件，打开一个新文件名写入则创建运行内产物。读回确认后，这些运行中的写入随执行结束丢弃；若要改变下次的输入，请在编辑器中修改附带文件。","选择格式先看数据。一条记录是一行原文，用纯文本保留布局；同一列结构的表格用 CSV；记录含列表、字典或布尔状态时，用 JSON 表示嵌套关系。"],examples:[{id:"file-utf8-memo",title:"把中文备忘写入后原样读回",level:"起步",source:`message = input()
with open("memo.txt", "w", encoding="utf-8") as memo:
    memo.write(message + "\\n")

with open("memo.txt", "r", encoding="utf-8") as memo:
    print(memo.read(), end="")`,input:`集合后去东门
`,output:`集合后去东门
`,purpose:"在一次运行中看见从输入文本到临时文件，再到标准输出的完整过程。",steps:["input 返回一行文字，不含末尾换行。","写入这个字符串以及一个换行，离开 with 时关闭。",'以同一编码打开并读回。print 使用 end=""，直接保留文件自己的换行。'],pitfall:'第二次打开若误用 "w"，会在尝试读取前清空文件。读回应使用 "r" 或省略模式。'},{id:"file-editor-data",title:"从编辑器附带的文本读取抄表记录",level:"应用",source:`total = 0
with open("meter.txt", encoding="utf-8") as meter:
    for line in meter:
        station, reading = line.split()
        value = int(reading)
        total += value
        print(station, value)
print("合计", total)`,files:[{name:"meter.txt",content:`北站 25
西站 12
`}],input:"",output:`北站 25
西站 12
合计 37
`,purpose:"观察标准输入为空时也能从附带文件读取；可在编辑器切换到 meter.txt 并修改数值。",steps:["运行时将 main.py 与 meter.txt 一起带入临时目录。","按行取得站名和读数，转换为整数后累计。","逐行输出明细，循环结束再打印合计。把西站的 12 改成 15，合计会变为 40。"],pitfall:"附带文件名必须与 open 的路径一致。用 input() 读取会尝试从标准输入取值，无法读到 meter.txt。"}]},{title:"读一行、读到结束与保留空行",explanation:["read() 无参数时从当前位置读到文件末尾，小文件读起来方便。for line in file: 按行处理，适合只保留当前一行的任务。两种方式都会推进当前读取位置。read() 读完后再次 read() 会返回空字符串。对普通文本文件可以重新打开，或用 seek(0) 回到开头。",'readline() 返回一行，通常包含这行末尾的 "\\n"。到达文件末尾时返回 ""，而文件中的空白行仍可能是 "\\n"。最后一行没有换行时，读取到的内容也没有换行。这三种情况用 repr() 看出区别。','strip() 会去掉两端的空白，可用于判断整行是否只有空白。若业务要保留缩进或行尾空格，输出原内容时就不能用 strip 后的版本。只去掉读入的换行时可以用 line.rstrip("\\n")；默认文本读取会把常用的 Windows、Unix 等换行形式转换成 "\\n"。','文本模式读取默认将常见行尾转为一个换行符。line.removesuffix("\\n") 只去掉一个行尾换行，保留其他空白；line.strip() 会再清理两端空格和制表符。若需要判断空白行，可看清理后的副本，但用未清理的版本写回。以 repr() 对照空文件、一个空行和含两个空格的行。'],examples:[{id:"file-eof",title:"把空行、无换行末行和文件结束区分开",level:"起步",source:`with open("message.txt", encoding="utf-8") as message:
    for _ in range(4):
        print(repr(message.readline()))`,files:[{name:"message.txt",content:`甲

乙`}],input:"",output:`'甲\\n'
'\\n'
'乙'
''
`,purpose:"通过 repr 使换行符和代表结束的空字符串可见。",steps:["第一次读到甲和它后面的换行，第二次只读到空行的换行。","第三次读到乙。原文件最后没有换行，所以结果只有乙。","第四次已经没有字符可读，得到空字符串。"],pitfall:'先做 strip() 再检查是不是 ""，会失去区分空行和文件结束的信息。应先检查 readline 的原始返回值。'},{id:"file-cursor",title:"读完后把文件位置移回开头",level:"应用",source:`with open("route.txt", encoding="utf-8") as route:
    text = route.read()
    print(repr(route.read()))
    print(text.count("\\n"))
    route.seek(0)
    print(route.readline(), end="")`,files:[{name:"route.txt",content:`北门
东门
`}],input:"",output:`''
2
北门
`,purpose:"验证同一个文件对象会记住当前的读取位置。",steps:["第一次 read 将内容保存到 text，并把位置推进到末尾。","第二次 read 读不到新内容。已保存的 text 仍包含两个换行。","seek(0) 回到文件开头，接下来 readline 又能读到第一行。"],pitfall:"调用 read 不会自动从第一行重新开始。要按原内容处理两次，可复用已读文本，也可以显式重新打开文件。"},{id:"file-copy-layout",title:"逐行处理原稿并检查副本布局",level:"应用",source:`with open("raw.txt", encoding="utf-8") as source:
    with open("public.txt", "w", encoding="utf-8") as target:
        for line in source:
            text = line.removesuffix("\\n")
            cleaned = text.strip()
            print(repr(text), "→", repr(cleaned))
            if not cleaned.startswith("#"):
                target.write(line)

with open("public.txt", encoding="utf-8") as target:
    print("副本", repr(target.read()))
`,files:[{name:"raw.txt",content:`  甲  

  
  甲  
# 内部
`}],input:"",output:`'  甲  ' → '甲'
'' → ''
'  ' → ''
'  甲  ' → '甲'
'# 内部' → '# 内部'
副本 '  甲  \\n\\n  \\n  甲  \\n'
`,purpose:"以去掉内部备注行的文稿为例，用清理后的文本判断规则，用原行保留展示布局。",steps:["逐行读 raw.txt，将带换行的原行与去掉行末换行后的 text 分开保存。去掉两端空白才得到 cleaned，便于识别被缩进的备注标记。","过滤以 # 开头的记录，其余直接写入 public.txt。重复正文、空行、仅空格行和原有空格照常写入。关闭后读回文件，以 repr 查看真实边界。","把 raw.txt 清空，预期只打印一行“副本”，内容为空字符串。再只写一个空行，预期副本内容有一个换行。把最后一条正文的换行删掉，预测读回是否会补上。"],pitfall:"若直接写入 cleaned，原来的空格和换行都会丢失，相邻记录也会粘在一起。生成保留布局的副本时，应写回原行。"}]},{title:"选择覆盖写入或追加写入",explanation:['"r" 读取已有文件，缺失时引发 FileNotFoundError。模式 "w" 会创建新文件，或在打开现有文件时立即截断。它适合重建报表、保存最新完整快照。即使打开后没有写入，原文件也已经清空。','"a" 会在文件末尾追加，新文件也可创建。它适合写日志和保留时间顺序。追加只负责定位到末尾，即使原文件最后一行没有换行，也不会自动分隔上一条和新记录。若需要一条一行，从第一批开始就给每条记录明确加换行。',"先决定是替换整个文件，还是继续增加记录。覆盖新内容时，生产程序通常还要考虑中途出错后的恢复；这节的练习使用本站运行时的一次性文件，通过读回检查写入行为。","P019 的 sum(1 for line in log if line.strip()) 可以先写 count = 0，逐行检查 if line.strip()，有正文才 count += 1。第 9 课的生成器写法只是每遇一条合格行就给 sum 一个 1。对 P020、P062，建议先嵌套两个 with，明确读源文件、写目标文件各自的范围，再阅读逗号合并两个上下文的写法。"],examples:[{id:"file-record-append",title:"给签到记录增加第二批",level:"起步",source:`with open("signins.txt", "w", encoding="utf-8") as log:
    log.write("陈杉\\n")
with open("signins.txt", "a", encoding="utf-8") as log:
    log.write(input() + "\\n")
with open("signins.txt", encoding="utf-8") as log:
    for number, line in enumerate(log, 1):
        print(number, line.rstrip("\\n"))`,input:`余舟
`,output:`1 陈杉
2 余舟
`,purpose:"用追加保留前批日志，随后按文件实际顺序编号。",steps:["用 w 写入第一条，并预留记录边界的换行。","用 a 打开，在文件尾部写入第二条。","重新打开，enumerate 从 1 编号。每条行末去掉已有换行后交给 print。"],pitfall:"第二段若用 w，读回时只剩第二条。如果第一条忘写换行，两笔文本还会拼成同一行。"},{id:"file-request-snapshot",title:"用本日快照替换昨日公告",level:"应用",source:`with open("status.txt", encoding="utf-8") as status:
    print("旧内容", status.read())
with open("status.txt", "w", encoding="utf-8") as status:
    status.write("正常")
with open("status.txt", encoding="utf-8") as status:
    print("新内容", status.read())`,files:[{name:"status.txt",content:"停用"}],input:"",output:`旧内容 停用
新内容 正常
`,purpose:"按先读、替换、再读的顺序比较两份快照，也能验证虚拟文件和编辑器互相独立。",steps:["打开编辑器附带的文件，读到停用。","用 w 重新打开，原内容被清空，再写入正常。","当前运行内读回得到正常。重新运行会再次起始于编辑器中的停用。"],pitfall:"改用 a 会得到“停用正常”，无法作为一个明确的状态值。运行结束后也不应把虚拟文件里的新状态当作已保存的编辑器内容。"}]},{title:"为表格和嵌套数据选择文件格式",explanation:["CSV 常用于若干行列结构相同的数据。字段内部也可能含逗号或引号，直接按逗号 split 会错误切开带引号的字段。用 csv.reader 读取，每行得到一组字符串，数字列还需转换。用 csv.writer 写入时它按规则给逗号等特殊字段加引号。",'传给 csv 读写的文件建议使用 newline="" 打开，让 csv 模块自己处理记录与字段中的换行。示例写入时显式设置 lineterminator="\\n"，便于观察输出。UTF-8 编码仍要在 open 中单独指定。',"JSON 可保存对象、数组、字符串、数字和布尔值。Python 常用字典与列表表达这些结构。json.dump(对象, 文件) 写一份 JSON 文档，json.load(文件) 将它读回。ensure_ascii=False 让中文可直接阅读。需要修改一项时，可读出整个对象、更新它，再整体写回。同一个文件里连续 dump 两个对象会得到两份拼接文档，普通 load 无法直接当成一份文档读取。","CSV 中字段的引号和分隔逗号有两层含义。字段本身含逗号或引号时，默认 writer 会用一对双引号包住字段，并将字段内部双引号写成两个。reader 会还原它，再按还原后的文本累计同名记录。将 csv.writer 的目标换成 sys.stdout，就用同样的规则排版标准输出（P060）。",'JSON 的 true 和 false 读进 Python 后是 True 和 False，写回又会变成小写；带引号的 "false" 则是字符串。给「用 JSON 保存状态」中的布尔字段改为 False，先预测读回的类型和值。还可以在加载前打印文件原文核对拼写。',"带表头的 CSV 先读一行表头。可以用普通 for 加首行标记，也可以用 next(reader) 取出第一行，之后的 for 从第一条数据开始。本课 P079 的文件至少有表头。"],examples:[{id:"file-csv",title:"保存名称中带逗号的物品",level:"起步",source:`import csv

with open("items.csv", "w", encoding="utf-8", newline="") as items:
    writer = csv.writer(items, lineterminator="\\n")
    writer.writerow(["纸,厚款", 3])
    writer.writerow(["线轴", 2])
with open("items.csv", encoding="utf-8", newline="") as items:
    print(items.readline(), end="")
    items.seek(0)
    reader = csv.reader(items)
    for name, count in reader:
        print(name, int(count) * 2)`,input:"",output:`"纸,厚款",3
纸,厚款 6
线轴 4
`,purpose:"先查看写入的 CSV 文本，再看正确解析后的字段与整数计算。",steps:["writer 为含逗号的名称加引号，所以这个逗号仍属于第一个字段。","readline 显示原始第一行后，用 seek(0) 回到文件开头。","reader 每次返回两项。将数量字符串转成整数并翻倍。"],pitfall:'用 line.split(",") 会把第一行切成三个片段。直接对读出的 count 乘以 2 则会重复字符串。'},{id:"file-json",title:"保存并还原一份展厅计划",level:"应用",source:`import json

plan = {"展厅": "东馆", "场次": [9, 14], "开放": True}
with open("plan.json", "w", encoding="utf-8") as file:
    json.dump(plan, file, ensure_ascii=False)
with open("plan.json", encoding="utf-8") as file:
    loaded = json.load(file)
print(loaded["展厅"])
print(len(loaded["场次"]))
print(loaded["开放"])`,input:"",output:`东馆
2
True
`,purpose:"读回带字符串、列表和布尔值的对象，继续按结构访问数据。",steps:["将整个字典写出。JSON 中的 true 代表 Python 中的 True。","load 读回字典，场次数组恢复为可索引的列表。","分别读取展厅、场次数量和开放状态，验证不同类型的字段。"],pitfall:"print(plan, file=file) 写出 Python 字典的显示形式，不能保证是符合规范的 JSON。用 json.dump 写标准 JSON。"},{id:"file-csv-quoted",title:"往返核对带引号和逗号的 CSV 字段",level:"应用",source:`import csv

with open("goods.csv", "w", encoding="utf-8", newline="") as file:
    writer = csv.writer(file, lineterminator="\\n")
    writer.writerow(['纸,"加厚"', 2])
    writer.writerow(['纸,"加厚"', 1])
    writer.writerow(["笔", 4])

totals = {}
with open("goods.csv", encoding="utf-8", newline="") as file:
    print(file.read(), end="")
    file.seek(0)
    for name, raw in csv.reader(file):
        totals[name] = totals.get(name, 0) + int(raw)
for name, number in totals.items():
    print(f"{name} 合计 {number}")
`,input:"",output:`"纸,""加厚""",2
"纸,""加厚""",1
笔,4
纸,"加厚" 合计 3
笔 合计 4
`,purpose:"同时确认文件里的引用规则和读取后的字段内容。",steps:["前两条是同名记录。文件用外层双引号避免把内部逗号误作分隔符，原名称中的每个双引号写成两个。","打印文件内容后 seek(0) 回到开头。reader 还原原名称，数量以字符串提供，转换后将两笔合计到 3。","把第一条的 2 改成 0，预测文件第一行与合计的变化。再让三次 writerow 都不执行，预期产物为空且没有汇总行。"],pitfall:'把原始 CSV 直接 split(",") 会把名称中的逗号也切开。处理 CSV 一律让 reader 划分字段。'}]}],exercises:[{kind:"coding",problem:"P078",level:"基础编程",goal:"读取随题文本，保留旧日志并逐行追加，检查运行中的实际文件。"},{kind:"coding",problem:"P079",level:"拓展挑战",goal:"用 CSV 读写器保留转义、记录顺序和重复行，创建指定产物。"},{kind:"question",id:"file-mode-truncates",legacy:"explain",goal:"识别已有文件在覆盖模式打开时会发生什么。",prompt:'已有非空文件，用 "w" 打开且没有写入，关闭时其中是什么？',answer:0,options:[{label:"空文件",feedback:"w 模式一打开就把已有内容截断，所以即使没有执行 write，文件也已经空了。"},{label:"仍然保留原有内容",feedback:"应确认模式。r 只读取，a 可以保留原内容在末尾追加，w 会先截断。"},{label:"等到下次打开才会清空",feedback:"截断发生在这次 open 中，和下次打开无关。"}]},{kind:"question",id:"file-write-no-newline",legacy:"predict",goal:"判断追加位置与 write 自带的内容。",prompt:'文件已有字符串 "甲"，其末尾没有换行。用 "a" 追加 write("乙") 后完整内容是什么？',answer:1,options:[{label:"乙",feedback:"a 会保留甲并在末尾写入，w 才会先清空。"},{label:"甲乙",feedback:"write 只追加乙，未收到换行符，所以文字直接相连。"},{label:"甲、乙分两行",feedback:'要分两行必须确保甲和乙之间有换行，例如追加 "\\n乙"。'}]},{kind:"question",id:"file-blank-or-end",goal:"从精确字符串判断空行和结束位置。",prompt:"先写入一个换行，再连读两次。两次读取的长度是什么？",answer:2,demonstration:{source:`with open("lines.txt", "w", encoding="utf-8") as log:
    log.write("\\n")
with open("lines.txt", encoding="utf-8") as log:
    first = log.readline()
    second = log.readline()
print(len(first), len(second))`,input:"",output:`1 0
`},options:[{label:"0 0",feedback:"文件的第一行只有换行。readline 保留换行，所以第一次读到了一个字符。"},{label:"1 1",feedback:"文件内容只有一个换行，第一次已经用完。第二次读到文件结束。"},{label:"1 0",feedback:"第一个值是换行字符串的长度，第二个值是到达文件末尾时空字符串的长度。"}]},{kind:"question",id:"file-csv-fields",goal:"预测引号内的逗号会被 CSV 视作字段内容。",prompt:"next 在这里取出 reader 的第一条记录。它有几个字段，第一个字段是什么？",answer:1,demonstration:{source:`import csv

with open("request.csv", "w", encoding="utf-8", newline="") as file:
    file.write('"旧,重印",2\\n')
with open("request.csv", encoding="utf-8", newline="") as file:
    row = next(csv.reader(file))
    print(len(row), row[0])`,input:"",output:`2 旧,重印
`},options:[{label:"3 个，第一个是“旧”",feedback:"这是逐逗号拆分的思路。CSV 知道双引号中的逗号属于同一个字段。"},{label:"2 个，第一个是“旧,重印”",feedback:"只有结束引号后的逗号才分隔字段。reader 一次返回文本名称和字符串 2。"},{label:"1 个，整行都是第一个字段",feedback:"两个双引号只包住第一个字段。后面的逗号将名称和数量分开。"}]},{kind:"coding",problem:"P019",level:"基础编程",goal:"逐行写入日志，再读回并用 strip 区分有内容的行。"},{kind:"coding",problem:"P059",level:"基础编程",starterExample:"file-record-append",goal:"用 w 创建首批日志，用 a 保存下一批，读回记录数与最后一条。"},{kind:"coding",problem:"P020",level:"综合应用",goal:"从源文件构建副本，确保输出保留顺序并处理没有匹配的情形。"},{kind:"coding",problem:"P060",level:"综合应用",goal:"正确解析带逗号和引号的 CSV 字段，再按首次出现顺序汇总。"},{kind:"coding",problem:"P061",level:"拓展挑战",goal:"从 JSON 读入布尔状态，处理重复操作并读回更新后的快照。"},{kind:"coding",problem:"P062",level:"拓展挑战",goal:"逐行清理备注生成可公开副本，保留真正的空行和原有顺序。"}],mistakes:[{symptom:"用了写入模式，旧记录却全部消失。",reason:"w 在打开时就清空已有文件。",fix:"接续日志用 a，并明确每条记录末尾的换行。",check:"在两批中放不同的文字，写完再读回检查首条仍在。"},{symptom:"文件中间有空行，处理到这里却停了。",reason:"先 strip 再拿空字符串作为结束条件，空白行也被当成结束。",fix:'用 for line in file，或直接检查 readline 的原始值是否为 ""。',check:"用中间空行和末尾不带换行的文本一起测试。"},{symptom:"下次运行看不到上次生成的文件。",reason:"每次运行从编辑器快照建立新的虚拟文件目录。",fix:"在同次运行中写后读，通过输入或工作区附带文件传递初始内容，通过标准输出展示结果。",check:"区分左侧文件列表中的初始状态和程序输出中的临时状态。"},{symptom:"含逗号的名称变成多个字段。",reason:"把 CSV 当作简单的逗号分隔字符串。",fix:"用 csv.reader 和 csv.writer 处理字段引号，并约定文本编码。",check:"输入包含逗号及双引号的名称，读回检查字段数和值。"}],summary:["确认源文件实际放在哪里。用 with、编码和模式确定文件生命周期，并在同一次运行重新打开目标文件检验。","区分空文件、空行和行内空白。为判断规则清理副本，同时保留有语义的原文及换行。","同结构表格用 CSV 读写器处理引用；嵌套状态用一份 JSON 文档读写，并在读回时核对类型。"],next:"下一课将练习从 FileNotFoundError、ValueError 等异常读出出错位置和原因，再用小规模输入定位问题。",references:[{title:"Python 3.12 官方教程 · 读写文件",url:"https://docs.python.org/3.12/tutorial/inputoutput.html#reading-and-writing-files",note:"核对文件模式、with 关闭、逐行读取以及读取位置。"},{title:"Python 3.12 内置函数 · open",url:"https://docs.python.org/3.12/library/functions.html#open",note:"核对文本编码、模式与 newline 的读写行为。"},{title:"Python 3.12 标准库 · JSON 编码与解码",url:"https://docs.python.org/3.12/library/json.html#basic-usage",note:"核对 dump/load、类型转换和拼接多个对象的限制。"},{title:"Python 3.12 标准库 · 当前工作目录",url:"https://docs.python.org/3.12/library/os.html#os.getcwd",note:"核对当前工作目录的概念；本站启动目录及运行产物的生命周期由平台设置。"},{title:"Python 3.12 标准类型 · str.removesuffix",url:"https://docs.python.org/3.12/library/stdtypes.html#str.removesuffix",note:"核对只删除末尾指定后缀，与 strip 清理两端的区别。"},{title:"Python 3.12 标准库 · csv.reader",url:"https://docs.python.org/3.12/library/csv.html#csv.reader",note:'核对 newline=""、按 CSV 引用规则拆行和默认字段类型。'},{title:"Python 3.12 标准库 · csv.writer",url:"https://docs.python.org/3.12/library/csv.html#csv.writer",note:'核对逐行写字段和 newline=""。'},{title:"Python 3.12 标准库 · JSON 解码类型表",url:"https://docs.python.org/3.12/library/json.html#json-to-py-table",note:"核对对象、数组和布尔值反序列化后的 Python 类型。"}]},m={goals:["【独立使用】区分语法、运行和业务结果错误，沿调用栈找到最靠后的一处用户代码与问题值。","【独立使用】用具体异常和最窄的捕获范围实现恢复，验证成功后才更新状态。","【理解】解释 raise、else 和 finally 何时执行，以及哪些错误应继续向外传播。","【独立使用】从失败输入构造最小复现，修复后验证原故障与邻近合法值。"],prerequisites:"会第 3、4 课的边界与条件、第 6 课的索引、第 8 课函数调用，以及第 9、10 课的辅助文件和文件读写。能从运行结果跳到出错行。",version:"以平台的 Python 3.12 为准。带“预期异常”的示例故意保留故障，可以运行后点文件位置观察。异常文本由解释器产生，路径等细节可能随运行环境改变。",topics:[{title:"从异常类型、文件和行号找到故障",explanation:["Python 先解析入口代码，语法不成立就会出现 SyntaxError 等错误。代码即使能解析，执行到不允许的操作仍可能抛出异常，例如整除 0 或取越界的列表项。能运行但输出与题意不同的代码还可能得到 WA，此时通常没有异常栈。","读 Traceback 时先看最后一行，记下异常类型及提示，如 ZeroDivisionError: integer division or modulo by zero。上方的栈帧显示从外层调用到更深的调用。通常先找靠近末尾的自己写的文件和出错行，再往上看参数是怎样传入的。","定位行是调查起点。语法错误有时在下一行才被解释器发现，要检查它前面的冒号、括号或引号。平台能跳到当前运行所用文件的对应行。若源码已改，应重新运行得到新的行号。","语法错误发生在代码解析阶段。运行异常意味着某一步虽然语法合法，执行却失败。还有一类程序能结束并打印，但多空格、少记录或算错业务结果，第一步是写下期望并比对，不必从 except 找起。","先跑「沿调用栈追到辅助文件中的零除」保留输入 0，查看最后一行 ZeroDivisionError 和除零信息。倒着找到最后一处用户代码 measure_tile.py 第 2 行，再回到 main.py 的调用确认 pieces 来自输入。规则若允许用户给零并提示，就在入口修复，保持计算函数接收正数的契约。"],examples:[{id:"debug-missing-colon",title:"从冒号缺失看懂语法错误",level:"起步",source:`print("准备")
if True
    print("开始")`,input:"",output:"",diagnostic:{kind:"SyntaxError",file:"main.py",line:2},purpose:"观察语法错误会阻止入口代码执行。运行后点错误位置，再补上冒号。",steps:["Python 解析入口时发现 if 语句缺少末尾的冒号。","错误指向 main.py 第 2 行。第一行虽写了 print，解析失败时它也不会运行。","把第 2 行改为 if True: 再运行，会依次打印“准备”和“开始”。"],pitfall:"看到报错时先核对语句结构。给本来解析失败的代码加一个 try 无法让它开始执行。"},{id:"debug-cross-stack",title:"沿调用栈追到辅助文件中的零除",level:"应用",source:`from measure_tile import unit_price

pieces = int(input())
print("开始核算")
print(unit_price(12, pieces))`,files:[{name:"measure_tile.py",content:`def unit_price(total, pieces):
    return total // pieces
`}],input:`0
`,output:`开始核算
`,diagnostic:{kind:"ZeroDivisionError",file:"measure_tile.py",line:2},purpose:"区分入口中的调用行与辅助文件中的出错行，观察异常前已经完成的输出。",steps:["入口读到 0，先输出“开始核算”，然后以 12 和 0 调用 unit_price。","辅助文件第 2 行尝试用 0 做除数，抛出 ZeroDivisionError。调用没有返回，外层 print 无法执行。","把输入换成 3 可复现合法路径。要支持零件数为 0，应先约定业务行为，例如在入口判断并提示。"],pitfall:"异常在除法处暴露，零值来自入口的输入。只调整调用所在行的缩进不会解决它。"},{id:"debug-fixed-unit-price",title:"修复零件计价并重跑失败与合法输入",level:"应用",source:`from measure_tile import unit_price

pieces = int(input())
print("开始核算")
if pieces <= 0:
    print("件数必须为正")
else:
    print(unit_price(12, pieces))
`,files:[{name:"measure_tile.py",content:`def unit_price(total, pieces):
    return total // pieces
`}],input:`0
`,output:`开始核算
件数必须为正
`,purpose:"与未修复示例使用同一辅助函数和输入，观察修改入口前后的差别。",steps:["之前输入 0 时，入口已经打印“开始核算”，调用辅助文件后发生除零。现在入口先检查业务范围，只有正数才调用。","输入 0 时预期两行提示且运行成功。改成 3，手推每件 4；再用边界 1，预期每件 12；负数也应被拒绝。","如果输入改成“三”，错误是读取后的整数转换失败。这是另一条故障路径，可用下一节的具体捕获方法实现恢复。"],pitfall:"给除数硬加 1 会改变正常计价。先明确零件为 0 的业务结果，再保留正常正数使用的除法。"}]},{title:"保护可能失败的操作，处理具体异常",explanation:["try 里的语句按顺序运行。一旦抛出异常，会跳过该块后面的语句，按顺序寻找匹配的 except。处理器匹配异常的类型，也能匹配它的父类型。没有匹配时异常会向外传递，最终可能结束运行。","捕获时要想清楚恢复动作。非法记录可以跳过并计数，缺少必需文件则可以给明确提示后终止。把会产生预期异常的那行放在 try 中，把成功才能执行的业务逻辑放进 else。try 正常执行到末尾才进入 else。与转换无关的错误就不会被这个 except 当作输入错误吞掉。","常见类型各有含义。ValueError 表示值不符合该操作的要求，TypeError 常表示参数或操作数类型不合适，EOFError 表示 input 已无数据可读。异常类型要与该操作对上，不能看到文本里有“错误”便随意匹配。","「读取指定文件并验证整数」可以分开试两条失败路径。指定不存在的文件，open 会先失败，int 根本没有机会运行。指定存在但内容非数字的文件，open 成功，随后 int 失败。正常成功才执行 else。只有上层能恢复时才捕获；缺少必需文件且无法替代时，应终止或让错误继续传播，不能假装读取了 0。","P022 同时遇到格式错误和可能的除零时，先转换两个字段再做除法。用左字段为乱码、右字段为 0，手推第一处失败是哪一行。"],examples:[{id:"debug-parse-record",title:"成功后才把读数加到账上",level:"起步",source:`total = 0
for _ in range(3):
    raw = input()
    try:
        value = int(raw)
    except ValueError:
        print("忽略无效读数")
    else:
        total += value
print(total)`,input:`4
断线
-1
`,output:`忽略无效读数
3
`,purpose:"用很小的 try 区分转换和更新，让坏行失败后仍能处理下一条。",steps:["4 可以转换，进入 else，total 变成 4。","断线触发 ValueError，执行 except，不累计。","第三行 -1 转换成功，累加后结果为 3。"],pitfall:"若把 try 写在整个循环外，一条坏记录可能结束整批处理。若缺少输入行，本例的 input 会抛出 EOFError，这与读到了不可转换的文字不同。"},{id:"debug-file-read",title:"分别报告文件缺失和内容错误",level:"应用",source:`name = input()
try:
    with open(name, encoding="utf-8") as file:
        number = int(file.read())
except FileNotFoundError:
    print("找不到记录")
except ValueError:
    print("记录不是整数")
else:
    print("登记", number)`,files:[{name:"record.txt",content:`未登记
`}],input:`record.txt
`,output:`记录不是整数
`,purpose:"相同的任务在不同阶段可能失败，提供能帮助读者排查的反馈。",steps:["读取待打开的文件名。record.txt 存在，于是继续读取它的内容。","int 无法转换文本“未登记”，跳到 ValueError 的处理分支。","把输入改成 missing.txt 会走缺失文件分支。把附带文件改成 9 会走成功分支。"],pitfall:"只用 except Exception 再统一输出“找不到记录”，会把内容格式错误与缺失文件混为一谈。"}]},{title:"用 raise 表达拒绝，用 finally 做清理",explanation:['Python 能解析某个值不代表它符合业务约束。例如 int("0") 本身成功，但发放数量可能规定至少为 1。函数可用 raise ValueError("数量必须为正") 报告调用方提供的值不合法。外层在能恢复的地方捕获并决定下一步。',"把验证和状态更新分开。先把这条记录所有字段读入并检查，得到可以提交的结果，然后在成功路径一次性更新库存或累计值。若前半条数据已经写入才发现后半条错误，很难保证记录被完整撤销。","finally 适合收尾。正常结束、执行 return 或异常向外传播时，都会先执行 finally 内的代码。单写 finally 不会把异常变成成功。对于文件，with 通常比手工写关闭逻辑更清晰。",'P065 先执行 int 再校验数量正值。若成功，用普通 if/else 算拟议库存，然后检查是否在范围内，最后才赋给真实库存。参考解里的 stock - amount if operation == "借" else stock + amount 依然是这个二选一，写成多行分支更容易逐步检查。P066 也可先假定 start = 0，仅在首字符是 + 或 - 时改为 1，再逐位扫描。'],examples:[{id:"debug-raise-range",title:"把非法数量交给调用者处理",level:"起步",source:`def positive_amount(raw):
    amount = int(raw)
    if amount <= 0:
        raise ValueError("数量必须为正")
    return amount

try:
    amount = positive_amount(input())
except ValueError:
    print("拒绝本次登记")
else:
    print("已登记", amount)`,input:`0
`,output:`拒绝本次登记
`,purpose:"比较格式错误与超出业务范围的值，并决定如何向外报告。",steps:['字符串 "0" 可转换成整数。',"函数发现数量不为正，主动抛出 ValueError，调用处的赋值没有完成。","外层捕获后打印拒绝信息。换成 2 时函数返回整数，进入 else。"],pitfall:"若函数遇到坏输入直接返回 0，而调用者没有检查，外层可能把拒绝当作成功。应约定清楚返回值和异常分别表示什么。"},{id:"debug-finally",title:"看见成功和失败路径都会收尾",level:"应用",source:`def take_count(raw):
    try:
        return int(raw)
    finally:
        print("本次读取结束")

for raw in ["5", "掉线"]:
    try:
        count = take_count(raw)
    except ValueError:
        print("读数无效")
    else:
        print("读到", count)`,input:"",output:`本次读取结束
读到 5
本次读取结束
读数无效
`,purpose:"用可见的收尾标记观察 return 和异常传播前的执行顺序。",steps:["第一次 int 成功并准备返回 5，函数先执行 finally 再把 5 交给外层。","第二次 int 抛出 ValueError，离开函数前同样先执行 finally。","异常到了调用处的 except，外层打印“读数无效”，没有进入 else。"],pitfall:"不要在 finally 里用 return 作为兜底，它可能盖过原来的返回结果或异常。这里的输出只用于教学观察。"},{id:"debug-stock-transactions",title:"分开处理转换失败和库存冲突",level:"应用",source:`stock = 3
for index in range(3):
    raw = input()
    try:
        quantity = int(raw)
    except ValueError:
        print("格式错误", stock)
        continue
    if not (1 <= quantity <= stock):
        print("库存冲突", stock)
        continue
    stock -= quantity
    print("已扣减", stock)
`,input:`二
4
2
`,output:`格式错误 3
库存冲突 3
已扣减 1
`,purpose:"用三条请求确认失败不会污染成功请求所用的库存。",steps:["“二”在 int 处失败，捕获后输出并跳过本轮，stock 仍为 3。","4 成功转换但超过库存，属于可预期的业务拒绝；第二轮同样不写状态。","2 通过两道检查后扣减。把第二个输入改成 3，预测库存变为 0 后第三轮应如何处理。"],pitfall:"不要把更新写进 try 以求“一起捕获”。仅在所有检查都成功后更新，其他未预料的异常应保留原信息。"}]},{title:"做最小复现，用边界确认修复",explanation:["最小复现是还能触发同一问题的短代码和小输入。先保存失败输入与当前输出，找出必要的值，删去与问题无关的记录。若问题出在函数，把输入拆分和界面暂时去掉，直接传一组固定参数。","面向评测时，WA 通常需要比较期望和实际，而不是捕获异常。常见的最小反例来自空数据、边界相等、单元素、重复项与第一或最后一条记录。用 repr() 临时检查空格、空行与换行符。","修复时只改导致故障的条件或状态，再跑原失败用例和邻近的成功用例。调试打印用于定位，不应随正式输出提交。可以在独立自测代码中保留断言，在程序入口只打印题目要求的内容。","先用小于、等于、大于三个数据检查“至少”。临时打印当前值、阈值和比较结果，定位哪轮错。修复后保留相等值作为回归用例，并跑两侧确认未破坏原来正常的路径。拓展内容可以进一步学习结构化日志和自定义异常层次。"],examples:[{id:"debug-negative-index",title:"负索引合法，业务编号却可能不合法",level:"起步",source:`labels = ["东", "西"]
for position in [0, 1, 2, 3]:
    if 1 <= position <= len(labels):
        print(labels[position - 1])
    else:
        print("编号越界")`,input:"",output:`编号越界
东
西
编号越界
`,purpose:"用最短列表检验编号转换，区分运行异常和合法但错误的输出。",steps:["外部编号从 1 开始，索引仍从 0 开始，所以访问时减 1。","编号 0 不合法。若直接减 1，Python 会从尾部读取，悄悄输出“西”。","先检查闭区间，留下合法的 1 与 2，并拒绝 0 和 3。"],pitfall:"只写 except IndexError 捕获不了编号 0 对应的负索引。输入规则需要在索引前验证。"},{id:"debug-raised-test",title:"并排核对阈值两侧与相等点",level:"应用",source:`def qualified(value, limit):
    return value >= limit

for value, want in [(4, False), (5, True), (6, True)]:
    actual = qualified(value, 5)
    assert actual == want, f"读数 {value}: 期望 {want}, 实际 {actual}"
print("三组边界通过")`,input:"",output:`三组边界通过
`,purpose:"给修复写一个小而有区分力的自测，再把核心条件用于正式程序。",steps:["固定阈值 5，自测低于、等于和高于阈值三个输入。","assert 在条件为假时发出 AssertionError，并附上期望和实际。当前实现三次都相等。","把 >= 改成 > 后只有相等情况不同，可快速复现问题。"],pitfall:"仅做高于阈值的自测时，两种比较都会通过。assert 适合开发自测，处理外部非法输入用明确的条件或异常。"},{id:"debug-wrong-threshold",title:"把能运行但算错的结果缩到一个输入",level:"应用",source:`def old_count(values, limit):
    count = 0
    for value in values:
        if value > limit:
            count += 1
    return count


def fixed_count(values, limit):
    count = 0
    for value in values:
        if value >= limit:
            count += 1
    return count


for value, expected in [(4, 0), (5, 1), (6, 1)]:
    before = old_count([value], 5)
    after = fixed_count([value], 5)
    print(value, before, after, expected)
    assert after == expected
`,input:"",output:`4 0 0 0
5 0 1 1
6 1 1 1
`,purpose:"按“输入、改前、改后、期望”四列观察业务结果，找到失败的最小用例。",steps:["题面是“至少 5”。先写下 4、5、6 三个应计结果 0、1、1。","原程序三轮都能执行，但输入 5 时用 > 排除了恰好相等的值。改成 >= 后该轮变为 1。","诊断结束后让原函数也使用 >=，预测它与修复版的三组输出一致。再在自测列表加入 0，预期仍不计数。"],pitfall:"看见程序“运行结束”只能说明它完成了执行。用事先手算的期望逐行核对才能确认业务正确。"}]}],exercises:[{kind:"coding",problem:"P080",level:"基础编程",goal:"运行有缺陷的起始程序，定位零除并修复，回归正常、坏值及失败后的记录。"},{kind:"question",id:"debug-conversion-kind",legacy:"explain",goal:"区分字符串转换的值错误与类型错误。",prompt:'int("3.7") 最可能引发哪一种异常？',answer:0,options:[{label:"ValueError",feedback:'int 接受字符串，但 "3.7" 不是整数文本。'},{label:"IndexError",feedback:"这里没有访问序列的位置。IndexError 针对索引超出范围。"},{label:"NameError",feedback:"int 是内置函数并且已找到。失败发生在从字符串转换整数的阶段。"}]},{kind:"question",id:"debug-mismatched-handler",legacy:"predict",goal:"判断异常不会被不匹配的处理器捕获。",prompt:'try 中执行 int("三")，只有 except IndexError 时会怎样？',answer:1,options:[{label:"执行 IndexError 分支",feedback:"字符串内容无法转换时抛的是 ValueError。这个处理分支不会运行。"},{label:"ValueError 向外传播",feedback:"IndexError 与 ValueError 不匹配。如果外层也没有合适的处理器，运行会报错。"},{label:"自动得到 0",feedback:"转换失败后 int 不会自动返回默认值。需要明确写出如何处理。"}]},{kind:"question",id:"debug-else-after-catch",goal:"理解异常后 else 和 finally 是否执行。",prompt:"下面程序会依次显示哪些文字？",answer:2,demonstration:{source:`try:
    int("停机")
except ValueError:
    print("格式失败")
else:
    print("已转换")
finally:
    print("清理完成")`,input:"",output:`格式失败
清理完成
`},options:[{label:"已转换 → 清理完成",feedback:"转换失败，不满足执行 else 的条件。"},{label:"仅格式失败",feedback:"except 处理预期错误后仍然会运行 finally。"},{label:"格式失败 → 清理完成",feedback:"ValueError 已匹配，按顺序运行 except 和 finally。"}]},{kind:"question",id:"debug-smallest-index-case",goal:"找出让错误实现不崩溃却给出错误结果的最小输入。",prompt:"按从 1 开始的编号查标签。程序只捕获 IndexError。用哪个编号能暴露“错误读取尾项”的问题？",answer:1,demonstration:{source:`labels = ["甲", "乙"]
position = int(input())
try:
    print(labels[position - 1])
except IndexError:
    print("编号越界")`,input:`0
`,output:`乙
`},options:[{label:"1",feedback:"1 是合法的第一个编号，输出甲。这个输入区分不出错误。"},{label:"0",feedback:"计算得到索引 -1，Python 可以读取末项，所以没有进入 except。"},{label:"3",feedback:"索引 2 超出这个列表的范围，处理器会输出“编号越界”。"}]},{kind:"coding",problem:"P021",level:"基础编程",starterExample:"debug-parse-record",goal:"将每次转换的异常处理放在循环内，分开记录有效总量与失败次数。"},{kind:"coding",problem:"P063",level:"基础编程",goal:"让一次失败保留准确的行列位置，并区分无错误的输入。"},{kind:"coding",problem:"P022",level:"综合应用",goal:"为整数格式不符和除零设计不同反馈，并核对同时触碰两种边界时的优先级。"},{kind:"coding",problem:"P064",level:"综合应用",goal:"区分无法转换的编号、超出业务范围的整数和成功查询。"},{kind:"coding",problem:"P065",level:"拓展挑战",goal:"遇到错误请求保留原库存，验证整条记录后再更新状态。"},{kind:"coding",problem:"P066",level:"拓展挑战",goal:"区分可提取的整数前缀与缺失字段，在连续处理记录时报告截断。"}],mistakes:[{symptom:"调用行和报错行指向不同文件。",reason:"外层在入口发起调用，异常由辅助文件里的操作触发。",fix:"先看最后一行异常类型，再找最深的自有代码位置。",check:"核对传给辅助函数的参数，并用两个固定参数单测。"},{symptom:"一条错误记录导致整批都不再处理。",reason:"保护范围覆盖了整个循环，失败后会跳出该块。",fix:"若业务允许继续，把 try 和匹配的 except 移到处理单条的位置。",check:"用“有效、无效、有效”三条记录看末条是否仍被处理。"},{symptom:"提示说编号格式错，但编号文本能正常转换。",reason:"使用过宽的 try 或 except，把后续查询失败也当作转换失败。",fix:"try 里只保留转换，另行检查范围或处理查询异常。",check:"分别输入非法文本、合法整数但越界、合法业务编号。"},{symptom:"样例通过，提交却出现 WA。",reason:"样例没覆盖端点或并列，错误行为也可能不会抛出异常。",fix:"构造能区分规则的最小输入，核对期望与实际。",check:"保留失败输入，修复后同时复测相邻值。"}],summary:["识别故障阶段，保存真实输入与期望。异常先读末行和最后一处用户代码，业务错先找实际与期望的最小差异。","捕获可恢复的具体失败，在成功路径更新状态。用 raise 报告不满足契约的值，使用 with 或 finally 收尾。","修复后重跑失败输入、邻近合法输入及重复场景，把关键边界保留作回归测试。"],next:"下一课会把调试并入完整解题流程，从写出规则和最小用例开始，逐步实现、验证并提交。",references:[{title:"Python 3.12 语言参考 · try 语句",url:"https://docs.python.org/3.12/reference/compound_stmts.html#the-try-statement",note:"核对处理器匹配规则、else 的执行条件以及 finally 对 return 的影响。"},{title:"Python 3.12 标准库 · 具体异常类型",url:"https://docs.python.org/3.12/library/exceptions.html#concrete-exceptions",note:"核对 ValueError、EOFError、IndexError 与 ZeroDivisionError 的具体含义。"},{title:"Python 3.12 语言参考 · assert 语句",url:"https://docs.python.org/3.12/reference/simple_stmts.html#the-assert-statement",note:"核对断言失败的异常和断言用于调试的语义。"},{title:"Python 3.12 教程 · 语法错误",url:"https://docs.python.org/3.12/tutorial/errors.html#syntax-errors",note:"核对解析阶段出错和插入符给出的定位线索。"},{title:"Python 3.12 教程 · 运行异常",url:"https://docs.python.org/3.12/tutorial/errors.html#exceptions",note:"核对异常最后一行的类型和消息、前面的调用栈。"},{title:"Python 3.12 教程 · 处理异常",url:"https://docs.python.org/3.12/tutorial/errors.html#handling-exceptions",note:"核对类型匹配，以及异常由内层传到调用方。"},{title:"Python 3.12 教程 · 抛出异常",url:"https://docs.python.org/3.12/tutorial/errors.html#raising-exceptions",note:"核对主动抛出 ValueError 和在无法恢复时向外传播。"},{title:"Python 3.12 教程 · 清理动作",url:"https://docs.python.org/3.12/tutorial/errors.html#defining-clean-up-actions",note:"核对 finally 无论成功或失败都用于收尾。"}]},f={goals:["【独立使用】从需求写出输入、输出与产物约定，按数据规模选择逐项扫描、排序或枚举。","【独立使用】让入口负责文件与输出，让辅助模块解析、验证、累计和排序。","【独立使用】写下小样例的期望，用正常、空数据、重复并列与无效行验证输出与文件。","【理解】说明每个状态的含义，能判断规则变化该改哪一层，并用独立慢解核对算法。"],prerequisites:"依次完成第 1–8 课的输入输出、数据容器与函数，能按第 9–11 课拆模块、读写文件并处理预期异常。本课会把这些能力用在同一个可运行案例上。",version:"示例以平台的 Python 3.12 为准。提交依据标准输出。样例只是第一组检查，还要测试题面允许的边界。",topics:[{title:"把题面写成可以核对的规则",explanation:["先回答三件事。每条输入代表什么，程序最后要输出什么，哪些条件与边界会改变结果。把“至少”“严格超过”“第一次”“并列”这些词各写成一句规则，落实到比较符号或顺序。先从小数据手算，不急于写循环。","同样一组数字可能对应不同任务。例如把每批包裹分车后加总，与先合并再分车不是一回事。先弄清可否合并、统计每一条还是统计整体、空输入需要什么输出。这些是算法的前提。","编程题接口也是契约。按照题面读对行数和字段，输出严格要求的值。手算时保留一个单元素或恰好达到阈值的反例，检查程序实现是否保留了题意。","遇到 full + (1 if remaining else 0)，先把它展开为 if remaining != 0: full += 1，最后 return full。P024 中连续段的 length 也可以显式写成达标就加一、否则归零，再决定何时更新历史最佳。先用能逐步手推的写法验证，熟悉后再阅读一行式。"],examples:[{id:"solve-threshold",title:"把至少达标写成含等号的比较",level:"起步",source:`def total_qualified(values, limit):
    total = 0
    for value in values:
        if value >= limit:
            total += value
    return total

limit = int(input())
values = list(map(int, input().split()))
print(total_qualified(values, limit))`,input:`6
3 9 6 11
`,output:`26
`,purpose:"把“累计至少达到阈值的读数”拆成筛选和求和，用相等项检验规则。",steps:["阈值为 6，四项中 3 排除。","6 恰好达标，与 9 和 11 一起累计。","函数返回 26。若规则改为严格大于，去掉等号后会得到 20。"],pitfall:"所有读数都比阈值大或小时，两种比较可能输出一样。要专门放入恰好相等的值。"},{id:"solve-separate-trips",title:"先决定分批规则，再计算车次",level:"应用",source:`def trips_for(amount, capacity):
    full, remaining = divmod(amount, capacity)
    return full + (1 if remaining else 0)

capacity = int(input())
batches = list(map(int, input().split()))
trips = [trips_for(amount, capacity) for amount in batches]
print(*trips)
print(sum(trips))`,input:`4
0 4 5
`,output:`0 1 2
3
`,purpose:"每辆车只装同一批的箱子。分别报告各批车次和总数，容量为正，箱数非负。",steps:["divmod 返回整车数和余下的箱数。箱数为 0 时不发车。","4 箱正好用 1 车，5 箱需要 1 整车再加 1 车。","得到各批 0、1、2 车，总和为 3。可换成两批各 1 箱，观察与合装的区别。"],pitfall:"先合并箱子会允许不同批次同车，违反规则。整除后无条件加 1 又会让整车或空批多出一车。"}]},{title:"给状态起名字，检查循环每一步保持的事实",explanation:["一次扫描常能解决累计、连续段和最值题。给每个变量写一句含义。例如“处理到当前项时，best 保存已见的最大得分”就是一个在每次更新后都应成立的事实。先确定初值，再规定每条新记录怎样影响它，最后根据题意输出。","保存当前位置与保存最佳答案是不同的事。处理连续段时，当前段断开就归零，历史最佳仍保留。排名并列要取最早项时，按输入顺序扫描，只有遇到严格更好的一项才替换。用两个并列项手算可以查出更新条件写错的问题。","键值关系则用字典保存。要找某项的首次位置，看到它时若尚未出现就记录；遇到已有键时，保留第一次的位置。状态含义决定重复数据究竟要累加、忽略还是覆盖。","P070 的合并可以先写基础版：遍历第一份清单累计各时刻的第一列次数，再遍历第二份累计第二列次数，最后按时刻排序输出。读参考解时为两边分别维护 i、j，表示第一项未处理的位置。每轮挑较小的未读时刻、吃完两边的同值项。先检查某一侧未耗尽再取下标，并确认每轮至少推进一个指针。"],examples:[{id:"solve-earliest-max",title:"一次扫描保留最早的最高分",level:"起步",source:`scores = list(map(int, input().split()))
best_index = 0
for index in range(1, len(scores)):
    if scores[index] > scores[best_index]:
        best_index = index
print(best_index + 1, scores[best_index])`,input:`-4 -2 -2 -9
`,output:`2 -2
`,purpose:"输入为非空整数列表。初值使用第一项，避免把不存在的 0 当成最高分。",steps:["目前的最佳位置初始化为第一项。","第二项 -2 更大，更新最佳位置。第三项同为 -2，保留已有位置。","输出时将 0 基索引转换为从 1 开始的位置。"],pitfall:"将 > 写成 >= 会把并列答案换到更晚的位置。初值来自真实数据，才能正确处理全负输入。"},{id:"solve-first-repeat",title:"查找最早发生的重复登记",level:"应用",source:`def find_repeat(codes):
    first_positions = {}
    for position, code in enumerate(codes, start=1):
        if code in first_positions:
            return first_positions[code], position
        first_positions[code] = position
    return 0, 0

print(*find_repeat(input().split()))`,input:`A C A C
`,output:`1 3
`,purpose:"扫描到首个重复发生处就返回它的首次位置与当前位置。没有重复时输出 0 0。",steps:["A 和 C 分别记录首次出现的位置 1 和 2。","第 3 项 A 已存在，立刻返回 (1, 3)。","每个已扫描键记录的是第一次出现位置。后面的 C 重复发生得更晚，无需再检查。"],pitfall:"应在写入前判断是否已有键。如果每次先覆盖，读出的“首次”位置就会变为当前位置。"}]},{title:"拆分计算，按规模选择扫描、排序或枚举",explanation:["先写一个只做核心计算的函数，接收已准备好的数据并返回计算结果。外层负责 input 和 print。这样可以直接给函数固定数据做手算检查，也更容易把它复用在其他项目。","数据范围告诉你能做多少工作。扫描 n 项一次用 O(n) 步；排序一般按 O(n log n) 考虑；两个独立选择若逐一枚举，步骤约是两种选择数量的乘积。某个条件能从第一个选择推导出第二个选择时，可以减少不必要的组合。","挑最佳方案时先判断是否可行，再比较排序键。Python 元组按从左到右依次比较，第一项相同才比第二项。用 (-分数, 名称) 排序可让分数大的排前，分数相同时名称升序。始终把题意与比较键的顺序一项项对照。","展台案例只需计每个展台的合计。可以用字典一遍扫描记录，再只给满足门槛的展台排序。若共有 n 条记录、k 个合格展台，读取和累计约 n 次，排序规模是 k。小数据的独立慢解可先列出每个展台，再针对它逐条回数，用来检查快速累计有没有漏掉重复记录。"],examples:[{id:"solve-frame-options",title:"从小范围枚举找到合格画框",level:"起步",source:`def choose_frame(required):
    best = None
    for width in range(3, 6):
        for height in range(4, 8):
            area = width * height
            if area >= required:
                option = (area, width, height)
                if best is None or option < best:
                    best = option
    return best

frame = choose_frame(int(input()))
if frame is None:
    print("无方案")
else:
    _, width, height = frame
    print(width, height)`,input:`20
`,output:`4 5
`,purpose:"宽度 3–5、高度 4–7。满足最小面积后，先选面积最小者，再选宽度较小者。",steps:["按小范围枚举宽、高组合。有 3 × 4 种候选。","过滤面积不足的组合。4 × 5 和 5 × 4 都恰好是 20，宽度 4 更靠前。","只有更小的可行排序键才替换 best。None 表示遍历完都没有方案。"],pitfall:"找到第一个达标组合就结束，未必面积最小。若选项很多，先估算候选的乘积，再决定是否枚举所有组合。"},{id:"solve-signups-ranking",title:"先定排名规则，再用命名函数排序",level:"应用",source:`def ranking_key(record):
    name, score = record
    return -score, name

records = []
for _ in range(int(input())):
    name, score = input().split()
    records.append((name, int(score)))
for name, score in sorted(records, key=ranking_key):
    print(name, score)`,input:`4
C 3
A 2
B 3
D 0
`,output:`B 3
C 3
A 2
D 0
`,purpose:"用一个可以单测的函数表示“分数降序、同分按名称升序”。",steps:["读入文本名称和整数分数组成元组。","排序时用每条记录的 (-score, name) 作为比较键。分数 3 对应 -3，排在 -2 前。","同为 -3 时比较名称，B 在 C 前。循环输出原来的名称与正向分数。"],pitfall:"直接对整个排序键 reverse=True 会让名字也逆序。仅给要降序的数字取负。"}]},{title:"用独立自测验证，最后检查提交接口",explanation:["先写几组可预期的小数据，再写代码。用普通值看主路径，最小规模看初值，临界相等看比较符号，重复和平局看更新条件。每组写下期望值，运行时直接比对。","若有一个容易理解的慢算法，可以在小数据上作为独立对照。它的工作是帮助检查较快算法，并不一定适合作为正式提交。两套做法不要依赖同一个可疑条件，否则会一起犯错。出问题时保留最小反例，再查哪一步开始错。","最后沿真实入口试一遍。检查每次 input 对应哪一行、是否有额外提示语、输出是否有多余字段。点试跑样例是调试，只有提交评测过完全部用例才记录通过。两个综合项目还需要自测文件读回、重复记录和空结果。","综合跟做任务是生成「展台领取汇总」。标准输入是一行非负整数门槛。随附 claims.txt 每行写展台代号和正整数领取量，以空白分隔。空白行直接跳过，字段数量不对、小数文本或非正整数均计为无效记录。先按代号合计，再保留达到门槛的代号，数量降序，同量按代号升序。标准输出列入选和无效数量，并显示 claim_report.csv 的真实内容。无入选也写表头。","先手推样例。A 的两笔 2 和 1 合计 3，B 的一笔为 3，C x、D -1 各是一条无效，空行不计。门槛 3 使 A、B 都入选，按代号打破平局。记录内容和报表行分开表示，字典保存合计，列表存待排序的 (代号, 合计)。"],examples:[{id:"solve-boundary-checks",title:"用三组数据自测需要补的座位",level:"起步",source:`def seats_to_add(people, ready):
    return max(0, people - ready)

checks = [((0, 5), 0), ((6, 6), 0), ((6, 5), 1)]
for arguments, expected in checks:
    actual = seats_to_add(*arguments)
    assert actual == expected, (arguments, actual, expected)
print(len(checks), "组通过")`,input:"",output:`3 组通过
`,purpose:"从剩余量小于、等于和大于零三个状态检查同一个函数。",steps:["将函数实参与期望值成对保存。*arguments 把两个参数分开传给函数。","assert 对照实际结果与期望。改错时，失败会指出是哪组参数。","三条测试都通过再打印统计。正式做题时可保留核心函数，用题目的输入和输出替代这个自测入口。"],pitfall:"只测人数多于座位会漏掉应返回 0 的情况。这个自测的输出不是任何在线评测题要求的结果。"},{id:"solve-independent-check",title:"用逐对枚举检查一次扫描的计数",level:"应用",source:`def fast_pairs(codes):
    seen = {}
    pairs = 0
    for code in codes:
        earlier = seen.get(code, 0)
        pairs += earlier
        seen[code] = earlier + 1
    return pairs


def by_pairs(codes):
    pairs = 0
    for left in range(len(codes)):
        for right in range(left + 1, len(codes)):
            if codes[left] == codes[right]:
                pairs += 1
    return pairs

cases = [[], ["A"], ["A", "B", "A"], ["A", "A", "A", "B", "B"]]
for codes in cases:
    assert fast_pairs(codes) == by_pairs(codes), codes
print(len(cases), "组一致")`,input:"",output:`4 组一致
`,purpose:"同类的每对下标只计一次。两种计算使用不同思路，方便发现遗漏或重复。",steps:["直接算法枚举 left < right 的每对下标。对最后一组，三个 A 产生三对，两个 B 产生一对。","扫描算法遇到新项时，只加上已见的同类数。每对恰在后出现的一项到达时被计算。","用空列表、单元素、隔项重复和多类重复对照，四组一致。"],pitfall:"若先把当前计数加一再累加，会把元素和自身算成一对。直接枚举适合小样本验证，大输入优先一次扫描。"},{id:"solve-claim-report",title:"拆模块完成展台汇总并核对 CSV 文件",level:"应用",source:`import csv
from claim_rules import select_rows, summarize


def main():
    minimum = int(input())
    with open("claims.txt", encoding="utf-8") as source:
        totals, invalid = summarize(source)
    rows = select_rows(totals, minimum)

    with open("claim_report.csv", "w", encoding="utf-8", newline="") as target:
        writer = csv.writer(target, lineterminator="\\n")
        writer.writerow(["展台", "合计"])
        writer.writerows(rows)

    print("入选", len(rows))
    print("无效", invalid)
    with open("claim_report.csv", encoding="utf-8", newline="") as report:
        print(report.read(), end="")


if __name__ == "__main__":
    main()
`,files:[{name:"claim_rules.py",content:`def parse_claim(text):
    fields = text.split()
    if len(fields) != 2:
        raise ValueError("需要展台和数量两个字段")
    booth, raw = fields
    quantity = int(raw)
    if quantity <= 0:
        raise ValueError("每笔数量必须为正")
    return booth, quantity


def summarize(source):
    totals = {}
    invalid = 0
    for line in source:
        if not line.strip():
            continue
        try:
            booth, quantity = parse_claim(line)
        except ValueError:
            invalid += 1
        else:
            totals[booth] = totals.get(booth, 0) + quantity
    return totals, invalid


def rank_key(row):
    booth, total = row
    return -total, booth


def select_rows(totals, minimum):
    rows = []
    for booth, total in totals.items():
        if total >= minimum:
            rows.append((booth, total))
    return sorted(rows, key=rank_key)
`},{name:"claims.txt",content:`A 2
B 3
A 1
C x
D -1

`}],input:`3
`,output:`入选 2
无效 2
展台,合计
A,3
B,3
`,purpose:"从需求和手算出发，在编辑器切换 main.py、claim_rules.py、claims.txt 跟做，最后以读回内容核查真实产物。",steps:["先沿 main.py 跟踪标准输入和打开的文件。claim_rules.py 用 parse_claim 校验单条记录，summarize 只捕获能跳过的数据异常，累加发生在成功路径。文件自身无法读取会继续报错。","select_rows 按合计筛选，再用 (-total, booth) 排序。入口用 CSV 写表头和候选列表，关闭写入后重新打开输出产物。样例 A 和 B 合计相同，按代号排序。","预测再改输入。改门槛到 4，预期入选 0、无效 2、只剩表头。清空 claims.txt，预期入选和无效均为 0。","回到原样例，另试 claims.txt 只含 A 2 和 B 1、门槛 1，两笔都入选且按数量排。再将首条改为 A 2 extra，预期它计为无效，B 仍写入。恢复样例，比较修改前后的 CSV 跟手算是否一致。","规则改为严格超过门槛，修改 select_rows 的比较；若同量要较大代号优先，调整排序策略；若数量字段改为允许 0，则改 parse_claim。只改 CSV 表头和输出标签时，处理入口即可。"],pitfall:"在解析完成前写 totals 会留下部分记录。把筛选提到累计之前又会漏掉单笔不足门槛、合计后达标的展台。"}]}],exercises:[{kind:"question",id:"solve-equal-boundary",legacy:"explain",goal:"识别区分两个相近规则的临界值。",prompt:"从“大于上限”改成“至少达到上限”，哪个值能区分这两种规则？",answer:1,options:[{label:"值小于上限",feedback:"两种规则都拒绝。只用这个值不能区分它们。"},{label:"值等于上限",feedback:"严格大于会拒绝，至少达到会接纳。相等值是区分点。"},{label:"值大于上限",feedback:"两种规则都接纳。需要选择会触发不同判断的输入。"}]},{kind:"question",id:"solve-keep-first-tie",legacy:"predict",goal:"从更新条件推断并列时保留哪一项。",prompt:"并列取较早者，按输入顺序找最大值时应何时替换当前最佳项？",answer:0,options:[{label:"只在严格更好时更新",feedback:"遇到同样的值不替换，因此最早的最大项会保留。"},{label:"相等也更新",feedback:"同分时不断替换，最终留下最晚的那个。"},{label:"只在更差时更新",feedback:"这与找最大值的目的相反。先明确更优如何比较。"}]},{kind:"question",id:"solve-current-vs-history",goal:"分开维护当前状态与历史答案。",prompt:"下面循环每轮打印当前连续命中长度和历史最长长度，最后一轮输出什么？",answer:2,demonstration:{source:`current = best = 0
for hit in [True, True, False, True]:
    current = current + 1 if hit else 0
    best = max(best, current)
    print(current, best)`,input:"",output:`1 1
2 2
0 2
1 2
`},options:[{label:"1 1",feedback:"最后一轮当前长度是 1，但历史最长仍是 2。"},{label:"3 3",feedback:"共有三次命中，中间一次失败使连续段断开，不能将两段相加。"},{label:"1 2",feedback:"失败时当前长度清零。最后重新得到长度 1，历史仍保留前两次的长度 2。"}]},{kind:"question",id:"solve-filter-before-choice",goal:"先过滤不合格项，再进行择优比较。",prompt:"目标是选出耗时不超过 4 的最低价方案。为什么程序最终会输出 B？",answer:1,demonstration:{source:`def price(item):
    return item[1]

options = [("A", 1, 5), ("B", 3, 4), ("C", 4, 2)]
valid = [item for item in options if item[2] <= 4]
print(min(valid, key=price)[0])`,input:"",output:`B
`},options:[{label:"A 虽然更便宜，但名称排在 B 后面",feedback:"名称顺序没有参与选择。要先检查耗时。"},{label:"A 超出耗时限制，B 在合格方案中更便宜",feedback:"不超过 4 包含恰好等于 4。B、C 合格，再按价格找最小。"},{label:"因为 Python 总取列表第二项",feedback:"min 用 key 给出的价格比较，不固定取某个位置。改变输入顺序依然会选择 B。"}]},{kind:"coding",problem:"P023",level:"基础编程",goal:"分开累计、阈值筛选和排序，验证恰好等于阈值的记录。"},{kind:"coding",problem:"P067",level:"基础编程",goal:"找出限制产量的材料，保留用量为零的类别并计算剩余。"},{kind:"coding",problem:"P024",level:"综合应用",goal:"维护当前长度与历史最佳，用并列和末尾连续段进行复测。"},{kind:"coding",problem:"P068",level:"综合应用",goal:"给每个编号维护最后一次接受的时刻，确认拒绝请求不改变历史。"},{kind:"coding",problem:"P069",level:"拓展挑战",goal:"用整除关系推导第二种物料数量，从可行方案中按优先级选最优。"},{kind:"coding",problem:"P070",level:"拓展挑战",goal:"用双指针归并已排序数据，正确处理连续重复和一边先读完的情况。"}],mistakes:[{symptom:"常规样例正确，却在相等或空输入时失败。",reason:"实现前没有写出最小值及比较边界。",fix:"先记录题意里的空结果、相等值、并列和下标起点。",check:"对每条规则设计一个能区分两种写法的输入。"},{symptom:"当前一段中断后，历史最佳也丢失了。",reason:"同一变量承担了当前进度和答案两种职责。",fix:"拆成分别表示当前状态和历史状态的变量。",check:"手推“较长的一段、断开、较短的一段”并列出每轮值。"},{symptom:"找到一种可行方案后结束，结果并非最优。",reason:"只检查限制，没有核对其余候选或比较优先级。",fix:"定义候选有效条件和最优比较规则，之后再做筛选。",check:"安排早出现的候选可行但较差，以及后出现的并列候选。"},{symptom:"函数自测成功，在评测中多出一行输出。",reason:"调试或输入提示仍留在正式入口。",fix:"保留计算函数，只让入口按题目格式读写。",check:"用样例试跑比较期望与实际，再提交运行全部用例。"}],summary:["能从需求写出每条输入、边界规则、标准输出和产物格式，并先手算一组正常与一组边界数据。","能区分入口与工具职责，用列表和字典记录状态，按数据规模选扫描、排序或枚举，再用小数据慢解独立核对。","能在多文件程序中检查原文件、写出并读回产物，定位异常所在层，确认无效记录未改变成功状态。","进入项目之前，可以口头解释一条记录如何经过读取、校验、累计和输出；再只改一条业务规则，并把旧的正常、空、重复与无效用例重跑。"],next:"综合项目「命令行记账本」可以沿用验证金额、失败跳过、分类累计、读回 CSV 的做法。「文本词频统计」可复用文件读取、逐键计数与并列排序。先写下正常、空文本或空账本、重复项和边界的预期，再在对应项目工作区独立实现。",references:[{title:"Python 3.12 官方教程 · 定义函数",url:"https://docs.python.org/3.12/tutorial/controlflow.html#defining-functions",note:"核对把可复用计算独立为函数，以及参数与返回值。"},{title:"Python 3.12 官方指南 · 排序键",url:"https://docs.python.org/3.12/howto/sorting.html#key-functions",note:"核对为每条记录计算比较键，并按键排序原记录。"},{title:"Python 3.12 内置函数 · divmod",url:"https://docs.python.org/3.12/library/functions.html#divmod",note:"核对整数情况下商和余数的定义。"},{title:"Python 3.12 语言参考 · assert",url:"https://docs.python.org/3.12/reference/simple_stmts.html#the-assert-statement",note:"核对开发时断言的条件、失败信息和优化模式差异。"},{title:"Python 3.12 教程 · 模块作为脚本运行",url:"https://docs.python.org/3.12/tutorial/modules.html#executing-modules-as-scripts",note:"核对入口读取输入与辅助模块复用的分工。"},{title:"Python 3.12 语言参考 · try",url:"https://docs.python.org/3.12/reference/compound_stmts.html#the-try-statement",note:"核对捕获单条解析失败和仅在成功后累计。"},{title:"Python 3.12 标准库 · csv.writer",url:"https://docs.python.org/3.12/library/csv.html#csv.writer",note:"核对写入表头和成批写入记录，以及文件的换行设置。"}]},g={P001:{concepts:["逐行读取","字符串拼接","全角标点"],approach:"把姓名视为一个不可拆分的字段，与固定前缀直接连接。拼接保证冒号和姓名之间没有额外分隔符。",steps:["name = input() 保留姓名中的空格。","用 + 得到完整标签，前缀中的冒号是全角。","将完整字符串作为单个参数传给 print。"],time:"O(L)，L 为姓名字符数，读取与写出姓名都需要逐字符处理。",space:"O(L)，保存姓名和拼接后的标签。",pitfall:'print("收件人：", name) 会多一个空格。input 带提示语也会产生额外输出。',extension:"若第二行还有部门，新增一行“部门：……”并保持原标签格式。先画出两行的预期结果。"},P002:{concepts:["连续读取","变量命名","调整输出顺序"],approach:"按输入顺序保存字段，再按输出顺序打印。用含义不同的变量名更容易发现错误。",steps:["依次读得 title、author 和 date。","先输出最后读到的日期。","再输出标题和作者。每个 print 自动结束一行。"],time:"O(L)，L 为三行文本的总字符数。",space:"O(L)，暂存三个字段。",pitfall:"用 split() 会把含空格的标题或作者拆开。测试三行互不相同且标题含空格的输入。",extension:"如果输出顺序改为作者、日期、标题，要调整哪一部分？用两份输入验证。"},P003:{concepts:["切分并转换整数","整除","取模"],approach:"每用掉 k 张票就形成一册，所以直接取 n 除以 k 的商和余数。运算步骤数与票数无关。",steps:["拆分第一行并解析 n 和 k。","用 n // k 得到整册数。","用 n % k 得到散票数，在一行输出两项。"],time:"在题目限定的整数规模内为 O(1)，读取固定数量的数字并做两次运算。",space:"在本题范围内为 O(1)，只保留固定数量的值。",pitfall:"用 / 会得到浮点数。用正好装满的票检查余数为 0，再用不够一册的情况检查整册数为 0。",extension:"如果还需计算装下全部票所需的册数，请分别设计有散票和无散票的样例。"},P004:{concepts:["需求量建模","向上取整","零需求与整除边界"],approach:"先确定标签总数，再求最小整数包数。总数非负、包容量为正，使用整数公式可以准确处理有无零头的情况。",steps:["读取排数、每排用量、备用量和每包容量。","用 r * c + s 得到总需求。","将 total + p - 1 整除 p，有零头才增加一包。"],time:"在本题整数范围内为 O(1)，做固定次数的运算。",space:"在本题范围内为 O(1)。",pitfall:"total // p + 1 在总数为 0 或整除时多买一包。备用量属于全场，只加一次。",extension:"如果商家按包卖，也允许按不同单价买散张，设计一个需要比较两种费用的样例。"}},h=[{id:"P025",title:"折页书签",difficulty:"入门",tag:"输入输出",description:"把书展的展柜名和抽屉名排成一条书签。两段文字各由一对方括号包住，中间用竖线隔开。",input:"第一行展柜名，第二行抽屉名。",output:"输出一行，形式为 [展柜名]|[抽屉名]。保留字段中的空格，括号与竖线旁不增加空格。",sample:[`地图柜
北区 二层
`,`[地图柜]|[北区 二层]
`,"“北区 二层”的空格保留，两个括号组之间紧贴竖线。"],limits:"每个字段含 1–40 个字符，首尾无空白，不含方括号或竖线。",cases:[[`A
B
`,`[A]|[B]
`],[`左 一
左 一
`,`[左 一]|[左 一]
`],[`第  3 柜
备用
`,`[第  3 柜]|[备用]
`]],hints:["每个字段占一行，分两次读取。",'将括号、字段和竖线拆成 print 参数，用 sep="" 连接。'],solution:`cabinet = input()
drawer = input()
print("[", cabinet, "]|[", drawer, "]", sep="")`,guide:{concepts:["独立输入行","print 的 sep","保留行内空格"],approach:'按输入边界读取两段字段，再按模板排好固定字符和字段。sep="" 让 print 直接贴合相邻片段。',steps:["第一行保存展柜名，第二行保存抽屉名。","输出左方括号、展柜名和 ]|[。","放入抽屉名和右方括号，再换行。"],time:"O(L)，L 为两个字段的总字符数。",space:"O(L)，保存输入字段。",pitfall:'忘写 sep="" 会在参数间放空格。标题内部连续的两个空格仍应保留。',extension:"把模板改成两行，每行以相同符号结尾，比较使用 sep 和直接拼接的写法。"}},{id:"P026",title:"两栏原文校对",difficulty:"基础",tag:"输入输出",description:"校对表收到左栏和右栏的原文。有时一栏留空，也可能在开头或结尾留了空格。把原文封在竖线内，让这些位置在输出里仍可看到。",input:"恰有两行，依次为左栏和右栏原文。每行都可以为空或只含空格。",output:"输出两行。第一行为 左|原文|，第二行为 右|原文|。原文中的每个字符都保留。",sample:[`
 北门 
`,`左||
右| 北门 |
`,"首行对应左侧空字段。右栏开头和结尾各有一个空格，均在两根竖线之间。"],limits:"每行 0–60 个可见字符或普通空格，不含竖线。输入的两行始终存在。",cases:[[`明天

`,`左|明天|
右||
`],[`   

`,`左|   |
右||
`],[` 甲  乙 
CC
`,`左| 甲  乙 |
右|CC|
`]],hints:["空行与读不到一行不同。这里总要调用两次 input。","加竖线时直接使用读到的字符串，避免 strip()。"],solution:`left = input()
right = input()
print("左|" + left + "|")
print("右|" + right + "|")`,guide:{concepts:["空行","保留首尾空格","两段独立输出"],approach:"将两行各自作为一个原样字段，读入后加左右标记。标记使原文的边缘空格成为输出行的内部字符。",steps:["调用两次 input，即使第一行是空字符串也读第二行。","给左栏原文拼上“左|”和“|”。","按对应格式输出第二栏。"],time:"O(L)，L 为两栏文本总长度。",space:"O(L)，保留原始字段与拼接片段。",pitfall:"空字符串与只含空格的字符串内容不同，strip() 会抹去差异。用两种输入分别试跑。",extension:"把空格换成制表符后用 repr 检查差异。先在编辑器自定义输入里尝试。"}},{id:"P027",title:"活动回执排版",difficulty:"基础",tag:"输入输出",description:"登记系统依次给出时间、活动名、地点。生成一张带表头的文字回执，表头和详情间留一空行。",input:"三行，依次为时间、活动名、地点。每一项可能包含内部空格。",output:"共四行。第一行是“活动|”紧接活动名。第二行为空行。第三行是“时间：”紧接时间，第四行是“地点：”紧接地点。冒号均为全角。",sample:[`19:00
夏夜 读诗
三楼 东厅
`,`活动|夏夜 读诗

时间：19:00
地点：三楼 东厅
`,"活动名输入在第二行，输出在表头。空行位于表头和时间之间。"],limits:"每个字段含 1–50 个字符，首尾无空白。",cases:[[`08:00
早餐
A厅
`,`活动|早餐

时间：08:00
地点：A厅
`],[`周一 07:00
晨读
B2
`,`活动|晨读

时间：周一 07:00
地点：B2
`],[`一
二
三
`,`活动|二

时间：一
地点：三
`]],hints:["按输入次序保存三项，再按模板输出。","表头之后调用一次无参数的 print() 输出空白行。"],solution:`time = input()
event = input()
venue = input()
print("活动", event, sep="|")
print()
print("时间：" + time)
print("地点：" + venue)`,guide:{concepts:["重排输入字段","竖线分隔","输出中间的空行"],approach:"先读字段再排模板，将两个顺序分开。模板有四行，用四条输出语句明确各行职责。",steps:["依照输入读取 time、event、venue。","用竖线隔开“活动”和活动名，再输出空行。","打印时间与地点，核对全角冒号。"],time:"O(L)，L 为三个字段总字符数。",space:"O(L)，保留需要重排的字段。",pitfall:"表头后的空行位于输出中间，省略会导致 WA。不要用末尾的空行补偿。",extension:"为一份只允许两行的机器回执重新设计布局，并写下含内部空格的期望输出。"}},{id:"P028",title:"在零点两侧划格",difficulty:"基础",tag:"变量与运算",description:"一条数轴以 0 为格子边界，每格宽 w。第 k 格覆盖从 k×w 到 (k+1)×w 之前的位置，格号可以为负。给出位置 x，求所在格号和从格子左端走到 x 的距离。",input:"一行两个整数 x 和 w，以空格分隔。",output:"依次输出格号和距离，用一个空格分隔。",sample:[`-8 5
`,`-2 2
`,"-8 位于 [-10, -5) 内，从左端 -10 前进 2。"],limits:"-10⁹ ≤ x ≤ 10⁹，1 ≤ w ≤ 10⁹。",cases:[[`-10 5
`,`-2 0
`],[`0 5
`,`0 0
`],[`12 5
`,`2 2
`],[`-1 1000000000
`,`-1 999999999
`]],hints:["所属格子的左端不能大于当前坐标。","用 divmod(x, w) 得到向下取整的格号和非负距离。"],solution:`position, width = map(int, input().split())
cell, distance = divmod(position, width)
print(cell, distance)`,guide:{concepts:["负数的向下取整","整除与余数","半开区间"],approach:"用 x = k×w + d 表示位置，其中 0 ≤ d < w。宽度为正时，divmod 直接给出唯一符合条件的商和余数。",steps:["读取有符号的位置和正宽度。","取商作为格号，取余数作为距离。","用 cell * width + distance 还原原值。"],time:"在本题数字范围内为 O(1)。",space:"在本题范围内为 O(1)。",pitfall:"int(x / w) 对负数截向零，可能选中右侧格子。位置恰好等于格子左端时距离应为 0。",extension:"把所有格子边界右移 2 个单位。应当先怎样调整坐标，再应用相同算法？"}},{id:"P029",title:"按钟面结转",difficulty:"基础",tag:"变量与运算",description:"一面 24 小时制的钟显示当前时刻。把时刻调整 d 分钟后输出新的钟面时刻。跨日只看新钟面，无需报告日期。",input:"第一行两个整数 h 和 m，表示当前小时和分钟。第二行整数 d，正数表示时间前进，负数表示回拨。",output:"输出调整后的小时和分钟，中间用一个空格。无需补前导零。",sample:[`23 50
25
`,`0 15
`,"经过 10 分钟到 0 点，再经过 15 分钟。"],limits:"0 ≤ h < 24，0 ≤ m < 60，-10⁹ ≤ d ≤ 10⁹。",cases:[[`0 0
-1
`,`23 59
`],[`11 2
1440
`,`11 2
`],[`7 0
-420
`,`0 0
`],[`1 9
-2881
`,`1 8
`]],hints:["先把小时换算成分钟，与原分钟和变动量相加。","用 1440 取模得到一天内的分钟，再用 60 分解。"],solution:`hour, minute = map(int, input().split())
change = int(input())
clock_minutes = (hour * 60 + minute + change) % (24 * 60)
new_hour, new_minute = divmod(clock_minutes, 60)
print(new_hour, new_minute)`,guide:{concepts:["统一单位","正除数取模","跨日回绕"],approach:"钟面每 1440 分钟重复一次。先把总分钟映射到 0 到 1439，再分解成小时和分钟，统一处理正向、反向和多日。",steps:["以 hour * 60 + minute 表示当前时刻。","加上偏移，用 % (24 * 60) 归到一天内。","对 60 取商和余数，输出两个字段。"],time:"在本题数字范围内为 O(1)，无需按分钟模拟。",space:"在本题范围内为 O(1)。",pitfall:"只减一次 1440 应对不了回拨或超过一天的偏移。验证从 0 点回拨 1 分钟的输出。",extension:"试着同时报告相对起始日的天数偏移。总分钟除以 1440 的整数商表示什么？"}},{id:"P030",title:"展演时段核算",difficulty:"进阶",tag:"变量与运算",description:"一场展演预留一次准备时间，之后连续演出 n 轮，每轮用时相同。根据计划写出活动名和总时长。",input:"第一行整数 n，表示轮数。第二行两个整数 per_round 和 setup，分别是单轮时长和总准备时长（分钟）。第三行是可能含空格的活动名。",output:"第一行原样输出活动名。第二行输出总时长中的整小时数和剩余分钟数，以一个空格分隔。",sample:[`3
25 12
周末 小剧场
`,`周末 小剧场
1 27
`,"总时长是 3×25+12，等于 87 分钟。"],limits:"0 ≤ n、per_round、setup ≤ 10⁵。活动名含 1–60 个字符，首尾无空格。即使 n 为 0，也计入准备时间。",cases:[[`0
25 59
预备
`,`预备
0 59
`],[`2
30 0
巡演
`,`巡演
1 0
`],[`2
0 0
A  B
`,`A  B
0 0
`],[`100000
100000 100000
长期排班
`,`长期排班
166668333 20
`]],hints:["三个输入行各用一次 input，只有第二行需要切分。","先求总分钟，再用 divmod(total, 60) 分解。"],solution:`rounds = int(input())
per_round, setup = map(int, input().split())
show = input()
total = rounds * per_round + setup
hours, minutes = divmod(total, 60)
print(show)
print(hours, minutes)`,guide:{concepts:["混合输入格式","按单位命名中间量","时长分解"],approach:"逐行确定字段类型，再用单位一致的算式得到总分钟。准备只发生一次，直接加到乘积上。",steps:["将第一行转为轮数，第二行拆成两项整数。","整行读取活动名。总分钟为轮数乘单轮分钟再加准备时间。","分解时长，在活动名之后另起一行输出时长的两个字段。"],time:"对本题范围内的定长数字为 O(L)，L 为活动名字符数。",space:"O(L)，活动名需保留到输出。",pitfall:"活动名只取第一个词会丢失信息。把准备时间放到乘法括号中会在多轮时重复计算。",extension:"如果每两轮之间另有休息，零轮和一轮各有几次休息？手算边界后再尝试加上条件。"},origin:{kind:"adapted",platform:"AtCoder",title:"Welcome to AtCoder",id:"PracticeA · practice_1",level:"AtCoder Beginners Selection 的入门练习题",url:"https://atcoder.jp/contests/abs/tasks/practice_1",concepts:["分行读取整数","同一行切分多个整数","组合数值与文本输出"],adaptation:"沿用单整数行、双整数行、文本行的读入训练结构。任务情境、计算规则、输出布局、范围和测试数据由本平台新写。"}}],b={P005:{concepts:["分支优先级","包含阈值","互斥输出"],approach:"取消骑行是最高优先级。先处理风速阈值，再判断剩余情况是否下雨。if/elif/else 对应且只输出一条建议。",steps:["读取风速 w 和降雨量 r。","w >= 8 时输出“取消”，跳过后续检查。","只有风速未达阈值时才看 r，大于 0 需要雨衣，否则出发。"],time:"O(1)，执行固定次数的条件检查。",space:"O(1)，只保存两个输入。",pitfall:"风速等于 8 时也取消。雨和大风同时出现时，优先级决定只输出“取消”。",extension:"新增“气温低于 0 建议出发前检查路面”，先写清它与取消、雨衣两条规则的优先顺序。"},P006:{concepts:["外带优先","半开区间","链式比较与 or"],approach:"外带直接走侧门，堂食才检查两段快线时段。用两个半开区间做并集，能准确表达同一种输出的两个时间段。",steps:["读取开店后的分钟数与外带标记。","先判断 m == 1。","堂食到达 [30,60) 或 [90,120) 就走快线，两段都不满足则走前台。"],time:"O(1)，最多检查固定数量的条件。",space:"O(1)，不创建与时段长度相关的数据。",pitfall:"用 <= 包含右端点会误收 60 或 120。只写两个时段的总跨度会误收 60 到 89 分钟。",extension:"把晚间取餐时段改为跨午夜，思考为什么需要将午夜前后的时间分开判断。可练习 P033。"},P007:{concepts:["闭区间遍历","同时满足两个取模条件","循环内累计"],approach:"在题目规模内可以逐个检查编号。计入条件是“3 的倍数并且不属于 5 的倍数”，累计量存于循环外。",steps:["初始化总和为 0，使用 range(1, n + 1) 枚举到 n。","在循环内检查 km % 3 == 0 与 km % 5 != 0。","仅在两个条件都满足时将编号加到总和，全部检查后再输出。"],time:"O(n)，每个编号检查一次。",space:"O(1)，不保存编号序列。",pitfall:"range(1, n) 会漏掉末端，or 会纳入不该计入的编号。单独测试 3 和 15 两种端点。",extension:"若 n 增大到无法逐个枚举，想想如何用等差数列分别计算 3 的倍数总和与 15 的倍数总和。"},P008:{concepts:["轮前检查","累计更新顺序","达到阈值时停止"],approach:"目标可能在某一天才达到，轮数要由累计状态决定。每天至少存 1 元，所以循环体会推进到终止。",steps:["把累计和天数设为 0，把 a 当作“今天要存的金额”。","累计仍小于目标时，把今天金额加入累计，天数加 1。","最后给 a 加 d，准备下一轮。累计达到或超过目标后输出天数。"],time:"O(k)，k 为实际存钱天数。目标为正时 k 不超过目标金额。",space:"O(1)，仅更新当前金额和累计状态。",pitfall:"若先给 a 增加 d，第一天就多存了钱。使用 <= 作为继续条件会使恰好达到目标时再多执行一天。",extension:"若每天还要固定扣掉一笔支出，写出还必须检查哪个条件才能保证循环终止。"}},y=[{id:"P031",title:"冷藏柜温区",difficulty:"入门",tag:"条件判断",description:"冷藏柜要求温度位于上下限之间，两端都允许。读入上下限和当前温度，报告当前温区。",input:"一行三个整数 low、high、value，依次表示下限、上限和当前温度。",output:"低于下限输出“偏低”，高于上限输出“偏高”，其余输出“合格”。",sample:[`-2 4 4
`,`合格
`,"4 恰好等于上限，仍在合格区间内。"],limits:"-100 ≤ low ≤ high ≤ 100，-100 ≤ value ≤ 100。",cases:[[`0 0 -1
`,`偏低
`],[`0 0 0
`,`合格
`],[`0 0 1
`,`偏高
`],[`-5 4 -5
`,`合格
`]],hints:["先判定区间外的情况。","条件使用 value < low 和 value > high，两端相等会留到 else。"],solution:`low, high, value = map(int, input().split())
if value < low:
    print("偏低")
elif value > high:
    print("偏高")
else:
    print("合格")`,guide:{concepts:["闭区间","比较运算","三路互斥分类"],approach:"先用两个严格不等式排除区间外的值，剩下的情形刚好是包含两端的闭区间。",steps:["按输入顺序保存上下限和当前值。","依次检查低于下限、高于上限。","两项均不成立时输出“合格”。"],time:"O(1)，条件数量固定。",space:"O(1)，只保存固定数量的值。",pitfall:"把 < 或 > 误写成 <= 或 >= 会排除题面允许的端点。上下限相同也有一个合格值。",extension:"若柜子要求下限可取、上限不可取，最少需要改哪一个比较？为改动设计测试。"}},{id:"P032",title:"剧场翻牌",difficulty:"基础",tag:"条件判断",description:"一块提示牌有正反两面。安排 a 轮排练，每轮结束前翻牌 b 次，每次必定翻到另一面。已知排练前朝外的一面，报告排练结束后朝外的一面。",input:"第一行两个整数 a、b。第二行是“正面”或“背面”，表示初始状态。",output:"输出最后朝外的一面，只输出“正面”或“背面”。",sample:[`5 7
背面
`,`正面
`,"总计翻 35 次。每两次回到原面，余下一次将背面翻为正面。"],limits:"0 ≤ a,b ≤ 10⁹。",cases:[[`8 9
正面
`,`正面
`],[`7 0
背面
`,`背面
`],[`1000000000 1000000000
背面
`,`背面
`],[`7 9
正面
`,`背面
`]],hints:["翻两次回到开始的一面。只需要知道翻牌总次数的奇偶性。","两个因子都是奇数时，乘积才是奇数。若需要翻一次，再判断当前是哪一面。"],solution:`rounds, flips = map(int, input().split())
side = input()
if rounds % 2 == 1 and flips % 2 == 1:
    if side == "正面":
        side = "背面"
    else:
        side = "正面"
print(side)`,guide:{concepts:["积的奇偶性","组合判断","嵌套分支"],approach:"把实际翻牌按两次一组抵消。积为奇数才存在最后一次翻转，只需判断两个因子并处理剩下的一次。",steps:["读入轮次、每轮翻数与当前一面。","两个余数都等于 1 才进入外层分支。","内层分支将当前面替换为另一面。最终只打印一次。"],time:"本题数值范围内为 O(1)，无需模拟所有翻牌。",space:"O(1)，保存当前朝向及两个整数。",pitfall:"使用 or 会把一奇一偶也当作乘积为奇数。还要检验“需要翻转”时从两种初始面出发的结果。",extension:"为每轮额外加一次翻牌。总次数的计算式如何变化？用零次和两轮的例子验证。"},origin:{kind:"adapted",platform:"AtCoder",title:"Product",id:"ABC086A",level:"原题 A 题 · 100 分",url:"https://atcoder.jp/contests/abs/tasks/abc086_a",concepts:["两个整数乘积的奇偶性"],adaptation:"保留乘积奇偶性的知识点，加入初始朝向和翻转状态；题面、输入输出和测试用例均重新设计。"}},{id:"P033",title:"跨午夜站台",difficulty:"进阶",tag:"条件判断",description:"站台每天固定开放一段时间。开放开始的一刻可以入场，结束的一刻停止入场。开始时刻大于结束时刻表示跨午夜；两者相同表示当天没有开放时段。",input:"一行三个整数 start、end、now，按当天零点起经过的分钟数表示开始、结束和查询时刻。",output:"可入场输出“开放”，否则输出“关闭”。",sample:[`1320 120 0
`,`开放
`,"22:00 开始，次日 02:00 结束。查询零点时仍在同一段开放时段内。"],limits:"0 ≤ start,end,now ≤ 1439。",cases:[[`1320 120 120
`,`关闭
`],[`1320 120 1320
`,`开放
`],[`1320 120 1319
`,`关闭
`],[`1320 0 0
`,`关闭
`],[`480 720 479
`,`关闭
`],[`480 720 480
`,`开放
`],[`480 720 719
`,`开放
`],[`480 720 720
`,`关闭
`],[`480 720 721
`,`关闭
`],[`600 600 600
`,`关闭
`]],hints:["先按开始、结束时刻的大小关系分类。","跨日时段在钟面上是 [start,1440) 与 [0,end) 的并集。"],solution:`start, end, now = map(int, input().split())
if start < end:
    is_open = start <= now < end
elif start > end:
    is_open = now >= start or now < end
else:
    is_open = False

if is_open:
    print("开放")
else:
    print("关闭")`,guide:{concepts:["半开区间","跨日拆段","简单条件与输出分离"],approach:"按两个边界的关系分三种情形。每一种都求出 is_open，最后统一输出，使端点判断与输出文本分别可检查。",steps:["start < end 时只检查一个半开区间。","start > end 时测试午夜前后两段，任一成立即可。","端点相等时明确为 False，再统一输出状态。"],time:"O(1)，固定数量的比较。",space:"O(1)，只保存时刻和一个布尔值。",pitfall:"在跨日分支用 and 会漏掉午夜两侧。把相等端点也用跨日公式处理会错误得到全天开放。",extension:"如果给出三段开放时间，且允许其中某段跨日，怎么复用同一判定？学到函数后再尝试。"}},{id:"P034",title:"分段运费报价",difficulty:"进阶",tag:"条件判断",description:"一件包裹按整千克计费。同城件在 2 千克以内（含 2）收 8 元，超出部分每千克 3 元。外地件在 2 千克以内收 12 元，超出部分每千克 5 元。先算原价，会员的原价达到 20 元时再减 4 元。",input:"一行三个整数 w、region、member。w 为重量，region 为 0 表示同城、为 1 表示外地。member 为 1 表示会员，为 0 表示非会员。",output:"输出实付运费（元）。",sample:[`4 1 1
`,`18
`,"外地原价是 12 + 2×5 = 22 元，会员减 4 元后为 18 元。"],limits:"1 ≤ w ≤ 1000，region、member 均为 0 或 1。",cases:[[`1 0 1
`,`8
`],[`2 1 1
`,`12
`],[`6 0 1
`,`16
`],[`6 0 0
`,`20
`],[`5 0 1
`,`17
`]],hints:["先让不同地区决定基础费和每千克超重费。","计算完原价后才检查折扣。恰好 20 元也符合门槛。"],solution:`weight, region, member = map(int, input().split())
if region == 0:
    price, per_kg = 8, 3
else:
    price, per_kg = 12, 5
if weight > 2:
    price += (weight - 2) * per_kg
if member == 1 and price >= 20:
    price -= 4
print(price)`,guide:{concepts:["分段计费","按顺序组合独立步骤","折扣门槛"],approach:"地区决定参数，重量决定原价，会员条件使用已经算好的原价。这三步是顺序依赖的，不属于同一个互斥分支组。",steps:["在 if/else 中确定基础费和每千克超重费。","只对超过 2 千克的部分加钱。","会员且原价至少 20 时减 4 元，最后输出。"],time:"O(1)，执行固定次数的整数运算和比较。",space:"O(1)，只保存报价参数和当前运费。",pitfall:"折扣写在超重费之前会漏掉靠超重费满足门槛的订单。按所有重量计超重费也会重复收费。",extension:"若增加一项“原价超过 40 元的外地件免基础费”，应先规定它与会员折扣的计算次序。设计一个两项都符合的例子。"}},{id:"P035",title:"观测峰值更新",difficulty:"基础",tag:"循环",description:"观测员按时间记录 n 个读数。第一条建立纪录。后来的读数必须严格大于历史最大值才算刷新纪录，持平时保持原纪录。报告最大读数与建立或刷新纪录的总次数。",input:"第一行整数 n。随后每行一个整数，共 n 行，表示按时间排列的读数。",output:"在同一行输出最大读数和纪录次数，用一个空格分隔。次数包含第一条建立纪录。",sample:[`6
-8
-5
-5
-2
-7
0
`,`0 4
`,"第 1、2、4、6 条建立或刷新纪录。第 3 条只与历史最大值持平。"],limits:"1 ≤ n ≤ 2000，读数绝对值不超过 10⁹。",cases:[[`1
-90
`,`-90 1
`],[`3
-1
-2
-3
`,`-1 1
`],[`4
-5
-5
-2
-2
`,`-2 2
`],[`3
0
1
2
`,`2 3
`]],hints:["输入保证至少有一条，用第一条初始化当前峰值。","每次只和已经处理过的最大值比较，只有严格变大才更新。"],solution:`count = int(input())
peak = int(input())
records = 1
for _ in range(count - 1):
    reading = int(input())
    if reading > peak:
        peak = reading
        records += 1
print(peak, records)`,guide:{concepts:["滚动最大值","首项初始化","计数器"],approach:"逐条读取，只保留历史最大值与累计次数。排序会把原有时间顺序打乱，也需要保存所有数据。",steps:["读到第一条建立纪录，次数为 1。","循环读取剩下 n−1 条。","数值严格大于峰值时同步更新峰值和次数。"],time:"O(n)，对每个读数处理一次。",space:"O(1)，逐条读入，无需保存序列。",pitfall:"峰值初始设为 0 会弄错全负数据。使用 >= 会把持平误计为刷新纪录。",extension:"若还要报告最终峰值首次出现的位置，需要再维护哪个状态？"}},{id:"P036",title:"留在仓里的卷材",difficulty:"入门",tag:"循环",description:"仓库现有长度为 n 的卷材。每次分出一部分领走，仓中保留的长度是当前长度整除 2 的结果。问至少分几次，仓中长度才能不超过目标 t。",input:"一行两个整数 n、t，依次是初始长度与目标上限。",output:"输出分割次数。初始长度已经符合目标时输出 0。",sample:[`25 3
`,`3
`,"剩余长度依次为 12、6、3，到第 3 次才达标。"],limits:"0 ≤ n,t ≤ 10⁹。",cases:[[`0 0
`,`0
`],[`16 8
`,`1
`],[`7 0
`,`3
`],[`1000000000 0
`,`30
`]],hints:["仓中长度仍大于目标时才需要分割。","每轮使用 // 2 更新长度，并将分割次数加一。"],solution:`length, limit = map(int, input().split())
cuts = 0
while length > limit:
    length //= 2
    cuts += 1
print(cuts)`,guide:{concepts:["while 轮前检查","整除减半","终止性"],approach:"逐次模拟题目给出的唯一操作。每次对正长度整除 2 都严格缩小，最终会降到 0，因此目标为 0 时也能结束。",steps:["初始化分割次数为 0。","若当前长度超过上限，减半取整并计数。","第一次满足目标时退出并输出次数。"],time:"O(1 + log(n + 1))，正长度每轮至少减半，n 为初始长度。",space:"O(1)，状态只有当前长度和次数等固定变量。",pitfall:"循环条件若写成 length >= limit，在相等时会多做一次。limit 为 0 时还可能卡在 0。",extension:"把保留规则改为向上取整的一半。目标为 0、长度为 1 时会发生什么？"}},{id:"P037",title:"夜班巡检停表",difficulty:"基础",tag:"循环",description:"夜班日志包含有效巡检成绩、无效占位 0 和停表信号 -1。按时间处理，在第一次遇到 -1 时结算，之后的条目不参与统计。若未遇到停表信号，处理全部条目。",input:"第一行整数 n。随后 n 行，每行一个整数，表示一条日志。正数为有效成绩。",output:"输出有效条目数量和有效成绩总和，中间用一个空格分隔。没有有效条目时输出“0 0”。",sample:[`6
4
0
7
-1
9
3
`,`2 11
`,"0 被跳过，-1 使结算提前。只有 4 和 7 被统计。"],limits:"0 ≤ n ≤ 2000，日志的值在 -1 到 10⁹ 之间。",cases:[[`0
`,`0 0
`],[`3
-1
7
9
`,`0 0
`],[`4
0
6
0
5
`,`2 11
`],[`3
0
0
-1
`,`0 0
`],[`3
1000000000
1000000000
1000000000
`,`3 3000000000
`]],hints:["停表需要退出循环，0 只需要结束本轮。","先识别 -1，再排除 0，最后才更新计数和总和。"],solution:`size = int(input())
count = 0
total = 0
for _ in range(size):
    value = int(input())
    if value == -1:
        break
    if value == 0:
        continue
    count += 1
    total += value
print(count, total)`,guide:{concepts:["break 与 continue","双累计状态","空日志"],approach:"沿时间只读取停表前需要处理的记录。两种特殊值的作用不同，分别在更新统计量之前处理。",steps:["初始化个数和总和。","读到 -1 结束循环，读到 0 进入下一轮。","只在有效条目上更新计数与总和，统一在循环后输出。"],time:"最坏 O(n)，若提前遇到停表信号则少于 n 轮。",space:"O(1)，无需保存日志。",pitfall:"用 continue 处理 -1 会把停表后的成绩也算进去；用 break 处理 0 则可能提前结束。",extension:"如果有多批日志且每批都给出 n，如何在停表后仍读掉本批剩余条目，以便进入下一批？"}},{id:"P038",title:"按数位和筛查编号",difficulty:"进阶",tag:"循环",description:"设备编号是闭区间 [left, right] 内的十进制整数。若某编号各位数字之和在 [low, high] 内，就通过筛查。求通过的编号数量与编号本身的总和。编号 0 的数位和为 0。",input:"一行四个整数 left、right、low、high。",output:"在一行中输出通过的编号数量与编号总和，以一个空格分隔。没有编号通过时输出“0 0”。",sample:[`8 13 2 4
`,`3 36
`,"11、12、13 的数位和分别为 2、3、4，通过筛查。它们的编号相加为 36。"],limits:"0 ≤ left ≤ right ≤ 10000，0 ≤ low ≤ high ≤ 45。",cases:[[`0 0 0 0
`,`1 0
`],[`13 14 0 1
`,`0 0
`],[`9 12 1 2
`,`2 21
`],[`0 10000 0 45
`,`10001 50005000
`]],hints:["用外层循环选编号。对每个编号，复制到副本后反复取末位并去掉末位。","循环内的数位和每个编号重置，编号数量和编号总和则记录在外层之前。"],solution:`left, right, low, high = map(int, input().split())
count = 0
total = 0
for number in range(left, right + 1):
    remaining = number
    digit_total = 0
    while remaining > 0:
        digit_total += remaining % 10
        remaining //= 10
    if low <= digit_total <= high:
        count += 1
        total += number
print(count, total)`,guide:{concepts:["嵌套 for 与 while","取末位与去末位","区间筛选"],approach:"题目规模适合枚举。外层选择编号，内层提取各位数字。通过筛查后应加入原编号，而非逐位处理后的副本或数位和。",steps:["枚举包含 right 的区间，并为当前编号初始化副本与 digit_total。","逐位累加直到副本变为 0。原编号为 0 时直接保留数位和 0。","数位和落在闭区间内就增加 count，并将原编号加到 total。"],time:"O(m×d)，m 为编号数量，d 为最大编号的十进制位数。",space:"在题目给定整数规模内为 O(1)，只保留固定数量的整数。",pitfall:"初始化只做一次会把上一个编号的位数和累到下一个。用 total += digit_total 则算的是另一项指标。",extension:"若调换 low 和 high 的含义，改为只统计区间之外的编号，应怎样改判断并保留边界？"},origin:{kind:"adapted",platform:"AtCoder",title:"Some Sums",id:"ABC083B",level:"原题 B 题 · 200 分",url:"https://atcoder.jp/contests/abs/tasks/abc083_b",concepts:["枚举整数","统计十进制数位和","基于数位和筛选并累计"],adaptation:"改用可从 0 开始的自定义编号区间，同时输出通过个数与编号总和。题面、样例和用例独立编写。"}}],x={P009:{concepts:["转为小写","count 计数","整行输入"],approach:"要求统计的是单字符。先把 ASCII 输入转为小写，a 和 A 就都能用 a 统计，星号不受转换影响。",steps:["用 input 保留整行，包括空格。","调用 lower 得到可以统一计数的副本。","分别统计 a 和 *，在同一行输出。"],time:"O(n)，n 为海报长度，转换和两次计数各扫描一遍。",space:"O(n)，保留原行及小写结果。",pitfall:"单独统计 a 会漏掉大写 A。输入为空时，两个计数都应为 0。",extension:'若要统计连续的两个 a，想一想 "aaa" 在允许重叠与不允许重叠时应分别计几次。'},P010:{concepts:["负步长","保留空白","按码点反向"],approach:"用负步长切片把所有码点倒序。外加方括号能把结果的首尾空格留在可见边界内。",steps:["读到完整一行，保留首尾空格。","用 sign[::-1] 生成反向的新字符串。","拼接左右方括号，即使内容为空也输出一对括号。"],time:"O(n)，n 为字符串的码点数。",space:"O(n)，需要保存反向结果和拼接后的输出。",pitfall:"strip() 会漏掉应倒序的边缘空白。按码点反向不保证多个码点组成的视觉文字保持原样。",extension:"如果要保留单词内部的顺序，只倒排单词，应该先如何拆分输入？"},P011:{concepts:["相邻位置","绝对差","最大值累计"],approach:"只比较紧邻的座位。用从 1 开始的索引访问本项和前一项，每次保留更大的绝对差。",steps:["读入整行温度，初始化结果为 0。","从第二项开始，用 abs 把相邻差转换成绝对值。","更新最大值，全部处理后输出。只有一项时不会进入循环。"],time:"O(n)，计算 n−1 对相邻值。",space:"O(n)，当前解法把温度保存成列表。",pitfall:"从索引 0 开始会把首尾误当作相邻。没用 abs 会漏掉温度下降时的差。",extension:"如果还需报告最早出现的最大温差，要怎样保存这一对位置？"},P012:{concepts:["1 基位置与 0 基索引","原地更新","同时交换"],approach:"列表直接保存当前标签顺序。按输入顺序更新两个指定位置，避免把每次交换独立地应用到初始顺序。",steps:["用 split 读入标签。","每轮把两个输入位置各减 1，再同时赋值。右侧先取到原标签。","处理完所有指令，用空格分隔输出。"],time:"O(n+q)，按题目限制标签长度，读取、交换和输出各做相应次数的操作。",space:"O(n)，保存标签，无需存储所有指令。",pitfall:"顺次执行 labels[i] = labels[j] 和 labels[j] = labels[i] 会覆盖原标签。位置相同时也应保留该标签。",extension:"若要撤销最后一次交换，需要保存哪些信息？为什么再交换一次就能恢复？"}},k=[{id:"P039",title:"站牌单点更正",difficulty:"入门",tag:"字符串",description:"站牌的文字有一处需要更正。给定原文、更正位置和新字符，只改这一处。输出时用一对方括号包住结果，便于看见边缘空格。",input:"第一行站牌原文。第二行整数 p，表示从 1 开始的码点位置。第三行为一个替换用的 Unicode 码点。",output:"在一行输出更正后的文字，左右各加一个方括号。保留其他位置的内容。",sample:[`东站-701
2
门
`,`[东门-701]
`,"第 2 个码点“站”改为“门”，其他内容不动。"],limits:"原文 1–80 个码点，1 ≤ p ≤ 原文长度。原文和替换字符均不含换行，允许普通空格。",cases:[[`🚆临港
1
◎
`,`[◎临港]
`],[`A
1
北
`,`[北]
`],[`北 🚦
3
 
`,`[北  ]
`],[`ABCD
4
D
`,`[ABCD]
`]],hints:["先把从 1 开始的题面位置减 1。","前段截止到目标位置之前，后段从目标位置的下一项开始。"],solution:`text = input()
index = int(input()) - 1
replacement = input()
updated = text[:index] + replacement + text[index + 1:]
print("[" + updated + "]")`,guide:{concepts:["码点索引","切片","字符串不可变"],approach:"把原文分成目标位置之前、目标项和之后三部分，跳过目标项并拼入替换字符。切片能统一处理首项和末项。",steps:["读入原文和替换码点，将 p 转为 0 基索引。","保留目标左侧和右侧的切片，用替换文字连接两者。","加方括号再打印，使边缘空格变成输出行的内部字符。"],time:"O(n)，n 为原文的码点数。",space:"O(n)，为切片和更新后的文字分配空间。",pitfall:"s[index:] 会把被替换的项也保留下来。第三行可能是单一空格，不能 strip。",extension:"如果一次替换的是从 p 开始的连续 3 项，后半个切片应从哪个索引开始？"}},{id:"P040",title:"保留空栏的记录转换",difficulty:"基础",tag:"字符串",description:"一行记录用竖线分隔字段。每一栏都要保留，包括连续分隔符之间、开头或末尾的空栏。将字段逐个加上方括号，再用斜杠连接。",input:"一行待处理记录。该行可以为空。",output:"第一行输出字段数。第二行输出以 / 连接的字段，每个字段写成 [内容]。空栏写成 []。",sample:[`货架|| 北区 |
`,`4
[货架]/[]/[ 北区 ]/[]
`,"第二栏和第四栏为空，第三栏的边缘空格保留。"],limits:"记录含 0–120 个码点。竖线是分隔符，字段不含方括号、斜杠或换行。空记录视为一个空字段。",cases:[[`
`,`1
[]
`],[`|白||
`,`4
[]/[白]/[]/[]
`],[`  |B 
`,`2
[  ]/[B ]
`],[`A B
`,`1
[A B]
`]],hints:['显式使用 split("|")，可以保留空字段。',"在相邻字段之间插入 ]/[，再给整个结果加首尾括号。"],solution:`fields = input().split("|")
print(len(fields))
print("[" + "]/[".join(fields) + "]")`,guide:{concepts:["固定分隔符","空字段","join"],approach:"先拆出逻辑字段，之后按所需边界重新拼接。默认空白拆分不符合此处的固定栏约定。",steps:["用 | 拆分原文，连续或边缘分隔符都产生空字段。","打印字段数。","以 ]/[ 串联所有字段，再补上最外面的一对括号。"],time:"O(n+1)，n 为记录的码点数，拆分与拼接都线性于处理文本长度。",space:"O(n+1)，包括字段和输出字符串。",pitfall:'对字段做 strip 会改变数据。空行调用 split("|") 得到一个空字符串字段，数量为 1。',extension:"将字段规则改为允许用双引号把竖线写进字段。为什么单次 split 不足以解析这种格式？"}},{id:"P041",title:"日志首次替换",difficulty:"进阶",tag:"字符串",description:"在记录里寻找指定片段，区分大小写。只替换最靠左的一次，报告修改前的匹配起点。没有匹配时保留原行。",input:"三行，依次为原记录、要查找的片段、替换文本。替换文本可以为空。",output:"第一行输出替换后的内容，保留未替换部分与替换文本中的所有空格。没有匹配时原样输出记录，包括行尾空格。第二行输出原记录中的起始码点位置，从 1 开始编号。没有匹配时输出 0。",outputComparison:"exact",sample:[`level=warn;warn
warn
info
`,`level=info;warn
7
`,"第一次 warn 从第 7 项开始。第二次出现保留。"],limits:"记录和替换文本含 0–120 个码点，查找片段含 1–40 个码点。三行均不含换行，可含普通空格。",cases:[[`aaaa
aa
x
`,`xaa
1
`],[`桃花&花
花
叶子
`,`桃叶子&花
2
`],[`ABCDE
CDx
x
`,`ABCDE
0
`],[`z!
z!

`,`
1
`],[`日志结束
结束
✓
`,`日志✓
3
`],[`🚉arrive
arrive
停靠
`,`🚉停靠
2
`],[`A 
Z
x
`,`A 
0
`],[`a a
 a
  
`,`a  
2
`,{note:"命中后替换文本的尾空格也必须保留。"}]],hints:["先用 find 得到第一次出现的索引，再区分 -1 与 0。","保留命中之前的切片。后段起点要越过完整的旧片段。"],solution:`text = input()
target = input()
replacement = input()
index = text.find(target)
if index == -1:
    print(text)
    print(0)
else:
    print(text[:index] + replacement + text[index + len(target):])
    print(index + 1)`,guide:{concepts:["首个匹配","原始位置","拼接新串"],approach:"先定位再替换，可以直接使用原始索引报告位置。比起反复替换，这样也能明确保留后续匹配。",steps:["逐行读入三个字段，用 find 查开始索引。","找不到则原样打印并返回位置 0。","若找到，拼接前段、替换文本和后段。最后用索引加 1 得到题面位置。"],time:"切片和构造输出用 O(n+r)。查找由 Python 的 find 实现，以逐位置比较估算的保守上界是 O(nm+n+r)，n、m、r 分别是原文、查找片段、替换的长度。",space:"O(n+m+r)，保存输入和构造的新输出。",pitfall:"写 if index 会把索引 0 判为未命中。直接 replace 不设次数会改动后续匹配。对原文调用 rstrip 会丢掉行尾空格。",extension:"若要替换最后一次匹配，怎样找出最右匹配，并使后段仍从正确位置开始？"}},{id:"P042",title:"回文差异定位",difficulty:"进阶",tag:"字符串",description:"校验一行口令。忽略英文字母大小写，只比较 ASCII 字母和数字。从原文两端开始，跳过其他字符，配对检查。若有不相同的一对，报告最外侧首次不相同的两个原文位置。",input:"一行可打印 ASCII 字符，可以为空。",output:"输出两个整数。若所有配对都相同，输出 0 0。否则输出首对不同字符在原文中的左、右位置，从 1 开始编号。",sample:[`A, b-C-a
`,`4 6
`,"首末 A 和 a 相同。跳过分隔符后，位于第 4 项的 b 与第 6 项的 C 不同。"],limits:"输入长度 0–400。英文字母和数字以外的字符不参与配对，但仍占原文位置。",cases:[[`
`,`0 0
`],[`.!?
`,`0 0
`],[`1 - 2 - 1
`,`0 0
`],[`Race X car?
`,`4 6
`],[`@a-1+
`,`2 4
`]],hints:["让左右两个索引分别向内移动，先跳过不参与配对的字符。","只比较当前两个字母或数字。发现不匹配立即记录原位置并退出。"],solution:`text = input()
left, right = 0, len(text) - 1
first, second = 0, 0
while left < right:
    if not text[left].isalnum():
        left += 1
        continue
    if not text[right].isalnum():
        right -= 1
        continue
    if text[left].lower() != text[right].lower():
        first, second = left + 1, right + 1
        break
    left += 1
    right -= 1
print(first, second)`,guide:{concepts:["双指针","ASCII 字符分类","保留原文位置"],approach:"两端逐个比较可以沿用原文本索引。每次跳过无关字符，或匹配一对后把两端都收进去。第一处失败正是最外侧的不匹配。",steps:["初始化左右端点与默认答案 0 0。","任一端不是字母或数字时，仅移动那一端。","比较两端小写形式。相同就继续向内，否则报告 1 基位置并结束。"],time:"O(n)，n 为原文长度，每一轮使至少一个索引向内移动或结束。",space:"除读入的字符串外，额外空间为 O(1)。",pitfall:"先删除标点再用新索引当原位置会错位。每次跳过字符后要重新检查左右端是否交叉。",extension:"如果需要同时输出用于配对的字母数字序列和失败坐标，可怎样保存每项原始位置？"},origin:{kind:"adapted",platform:"LeetCode",title:"Valid Palindrome",id:"125",level:"原题 Easy",url:"https://leetcode.com/problems/valid-palindrome/description/",concepts:["忽略非字母数字字符","无大小写回文比较"],adaptation:"原题要求返回布尔值。本题输出最外侧首个不匹配对在原文中的两个位置，并单独规定空输入行为。题面、样例和用例重新编写。"}},{id:"P043",title:"筛选有效读数",difficulty:"入门",tag:"列表",description:"设备发送一批整数读数。收集达到阈值的读数，保持输入顺序，重复读数分别计入。",input:"第一行 n 和 limit。第二行为 n 个空格分隔的读数。n 为 0 时第二行为空。",output:"第一行输出有效读数数量。第二行按原顺序输出有效读数，以一个空格分隔。没有有效读数时第二行输出“空”。",sample:[`6 3
2 3 1 5 3 -4
`,`3
3 5 3
`,"两个等于阈值的 3 和一个 5 按原顺序保留。"],limits:"0 ≤ n ≤ 2000，limit 和读数的绝对值均不超过 10⁹。",cases:[[`0 7

`,`0
空
`],[`3 9
1 2 8
`,`0
空
`],[`5 -2
-1 -2 -2 -3 -1
`,`4
-1 -2 -2 -1
`],[`1 0
0
`,`1
0
`],[`6 3
9 3 9 2 3 5
`,`5
9 3 9 3 5
`,{note:"阈值和非连续重复项须原序保留，排序或去重都会失败。"}]],hints:["用一个新的空列表保存通过的读数。","达到阈值包含相等。打印结果时再区分空列表与非空列表。"],solution:`n, limit = map(int, input().split())
values = list(map(int, input().split()))
kept = []
for value in values:
    if value >= limit:
        kept.append(value)
print(len(kept))
if kept:
    print(*kept)
else:
    print("空")`,guide:{concepts:["保序筛选","追加元素","空结果"],approach:"遍历原列表并构造新的结果列表。这样不会因删除元素而改变正在遍历的位置，也能直接得出结果数目。",steps:["读入阈值和整行读数。","遇到大于等于阈值的值就 append 到结果。","先打印数量，再输出结果列表中的各项，空结果用约定的文字。"],time:"O(n)，逐项判断，结果打印最多 n 项。",space:"O(n)，保存输入列表和筛选结果。",pitfall:"用 > 会漏掉等于阈值的项。去重或排序都会改变题目要求的原始序列。",extension:"如果还要报告各读数来源位置，可以在遍历时同时记录哪些信息？"}},{id:"P044",title:"定位第 k 次达标",difficulty:"基础",tag:"列表",description:"读数按采样顺序记录。从第一项开始，读数大于或等于阈值就算一次达标。输出第 k 次达标发生的位置。",input:"第一行三个整数 n、limit 和 k。第二行是 n 个整数读数。n 为 0 时第二行为空。",output:"输出第 k 次达标在原列表中的位置，从 1 开始编号。达标次数不足时输出 0。",sample:[`7 5 3
2 5 7 1 5 9 1
`,`5
`,"第 2、3、5、6 项达标，所以第 3 次发生在位置 5。"],limits:"0 ≤ n ≤ 2000，1 ≤ k ≤ 2000，limit 和读数的绝对值均不超过 10⁹。",cases:[[`0 10 1

`,`0
`],[`3 4 1
4 0 8
`,`1
`],[`4 0 3
-1 0 1 -2
`,`0
`],[`4 -1 4
0 -1 2 -1
`,`4
`]],hints:["用 enumerate 同时得到位置与数值。","只有达标时才增加次数，第 k 次就保存位置并结束。"],solution:`n, limit, k = map(int, input().split())
values = list(map(int, input().split()))
position = 0
hits = 0
for index, value in enumerate(values, start=1):
    if value >= limit:
        hits += 1
        if hits == k:
            position = index
            break
print(position)`,guide:{concepts:["顺序查找","1 基位置","按条件计数"],approach:"题目关心原顺序中的第 k 次命中，因此在原列表上扫描。计数和原始位置属于不同的状态。",steps:["把默认位置设为 0，已命中次数设为 0。","按原顺序逐项判断，达标才增加计数。","次数到 k 时保存当前编号并退出。遍历结束后统一输出。"],time:"最坏 O(n)，需要读完整行输入，查找时可提前结束。",space:"O(n)，当前解法保存整行读数。",pitfall:"循环的第 k 项未必是第 k 次达标。不要用排序后的位置替代原始位置。",extension:"若要同时查询第一次、第二次和第十次达标的位置，能否只扫描一遍？"}},{id:"P045",title:"库存独立试算",difficulty:"进阶",tag:"列表",description:"仓库收到两个试算方案。每个方案只修改一种商品的库存，两个方案都从同一份基准库存开始。分别输出试算结果。",input:"第一行 n，第二行 n 个基准库存量。第三、四行各有 p 和 delta，表示第 p 种商品增减 delta 件，位置从 1 开始。",output:"输出两行，各含 n 个整数，以一个空格分隔。第一行对应方案一，第二行对应方案二，保持商品原顺序。",sample:[`3
10 3 7
1 4
1 -2
`,`14 3 7
8 3 7
`,"两个方案都调整第 1 种商品，但各自从基准量 10 开始。"],limits:"1 ≤ n ≤ 300，0 ≤ 库存 ≤ 10⁹，1 ≤ p ≤ n，-10⁹ ≤ delta ≤ 10⁹。保证独立执行各方案时结果非负。",cases:[[`1
0
1 0
1 5
`,`0
5
`],[`4
5 4 3 2
4 -2
2 9
`,`5 4 3 0
5 13 3 2
`],[`2
0 1000000000
2 1000000000
2 -1000000000
`,`0 2000000000
0 0
`],[`2
1 7
1 2
1 2
`,`3 7
3 7
`]],hints:["两个方案各自复制基准列表，再改副本的一个位置。","不能把第二次修改应用到第一次的输出，需要注意 p 从 1 开始。"],solution:`n = int(input())
stock = list(map(int, input().split()))
for _ in range(2):
    position, delta = map(int, input().split())
    scenario = stock.copy()
    scenario[position - 1] += delta
    print(*scenario)`,guide:{concepts:["浅复制","单点修改","独立场景"],approach:"每轮重新以基准列表为起点。库存列表只有整数，复制外层后为某个位置赋新值就不会改变基准。",steps:["读取基准库存并保存。","对每条方案创建副本，按 0 基位置应用增减。","依次输出两个副本。基准列表在处理两条方案期间一直可用。"],time:"O(n)，复制和输出两次，每次处理 n 项。",space:"O(n)，保存基准与当前方案的副本。",pitfall:"scenario = stock 只是建立别名。如果两次改动同一位置，这种错误会让第二轮继续累加。",extension:"若每个商品包含内层列表，里面分别记仓库和商店的库存，试算要独立改其中一个仓库时应该复制哪一层？"}},{id:"P046",title:"桌游三队轮选",difficulty:"进阶",tag:"列表",description:"三队按甲、乙、丙的顺序不断轮选卡片。轮到一队时必须取走剩余卡中分数最高的一张，直到取完。每队得分是本队取走卡片的分数之和。",input:"第一行整数 n。第二行是 n 个整数分数，n 为 0 时第二行为空。",output:"在一行输出甲、乙、丙三队的得分，依次用空格分隔。没有拿到卡的队伍得 0 分。",sample:[`7
4 9 2 9 -1 6 4
`,`12 13 8
`,"取牌顺序为 9、9、6、4、4、2、-1。甲得到 9、4、-1，乙得到 9、4，丙得到 6、2。"],limits:"0 ≤ n ≤ 2000，卡片分数绝对值不超过 10⁹。分数可重复，重复分数对应不同卡片。",cases:[[`0

`,`0 0 0
`],[`1
-7
`,`-7 0 0
`],[`4
2 2 2 2
`,`4 2 2
`],[`3
-10 -2 -5
`,`-2 -5 -10
`],[`3
1000000000 1000000000 1000000000
`,`1000000000 1000000000 1000000000
`]],hints:["所有队伍取牌规则相同，可先一次性得到从高到低的取牌顺序。","让从 0 开始的轮次对 3 取余，作为三队得分列表的索引。"],solution:`n = int(input())
cards = list(map(int, input().split()))
cards.sort(reverse=True)
scores = [0, 0, 0]
for turn, points in enumerate(cards):
    scores[turn % 3] += points
print(*scores)`,guide:{concepts:["降序排序","取模轮转","列表按索引累加"],approach:"每次都取剩余最大值，整个取牌顺序就是降序。先排一次再分配，避免每轮都重新扫描或删除列表元素。",steps:["读入全部卡片，原地降序排序。","按排序后的顺序遍历，用 turn % 3 找到当前队。","把分数加入对应位置，最后按甲、乙、丙输出。"],time:"最坏 O(n log n)，排序占主导，分配只遍历一遍。",space:"O(n)，用于输入列表及 Python 排序可能使用的临时空间。",pitfall:"不能丢弃重复分数或负分卡。enumerate 从 0 开始才能让余数 0 对应甲队的第一轮。",extension:"如果有 k 支队伍，如何创建得分列表并调整轮次公式？"},origin:{kind:"adapted",platform:"AtCoder",title:"Card Game for Two",id:"ABC088B",level:"原题 B 题 · 200 分",url:"https://atcoder.jp/contests/abs/tasks/abc088_b",concepts:["降序处理得分","轮流取牌"],adaptation:"从两人得分差改为三队各自总分，明确每轮必须取当前最高分，加入空数据、重复值和负分。题面、样例和用例重新编写。"}}],v={P013:{concepts:["字典累积","带符号数量","查询缺失键"],approach:"用材料名称当键，把同一种材料的入库和出库合并为一个有符号净变化。字典让更新和查询都能按名称直接定位。",steps:["逐条拆出材料名和带符号的数量，数量转成整数。","用 ledger.get(name, 0) 取旧总量，加上本次变化后写回。","读入要查询的材料名，使用同样的默认值 0 处理无记录的情况。"],time:"材料名长度有上界，n 条记录的平均时间为 O(n+1)。",space:"O(k+1)，k 为实际记录的材料种类数。",pitfall:"出库量已经带负号，直接加上这个整数即可。用 ledger[name] 查询时，未记录的材料会引发 KeyError。",extension:"如果要区分从未登记与有记录但净变化为零，查询后还需要判断什么？"},P014:{concepts:["频次统计","字典值的最大值","并列时按数值选取"],approach:"先用字典确定各编号的次数，再将“次数最多”和“并列时编号最小”分两步处理，便于分别检查这两个规则。",steps:["将编号转成整数并逐个累计频次。","输入至少包含一个编号，可对非空的 counts.values() 求最大值。","遍历键值对，遇到最高频候选且比当前答案更小的编号就更新，最后打印编号与最高次数。"],time:"平均 O(n+k)，n 为编号总数，k 为不同编号数。",space:"O(n+k)，包括整行 split 得到的字段和保存频次的字典。",pitfall:'直接 max(counts) 取的是最大的键。比较编号前要转成整数，文本 "10" 和 "9" 的排序与数值不同。',extension:"如果要按数值顺序输出所有最高频编号，可以在哪一步收集并列项？"},P015:{concepts:["函数参数","返回值","整数单位转换"],approach:"每条记录都使用同一个换算公式。把步数和步长作为两个参数，可独立验证换算，再把多组读写交给循环。",steps:["定义 meters，将步数乘以步长，得到这一条记录的总厘米数。","用总厘米数整除 100，把整数米数交还调用者。","循环读入每条步数，调用同一个函数，并逐行输出返回值。"],time:"O(q)，每条记录只做固定次数的整数运算。",space:"额外空间 O(1)，逐条读入并输出。",pitfall:"应先乘步数再整除。若先把单步长度整除 100，步长 65 厘米时走多少步都会算成 0 米。",extension:"如果要同时输出整米和剩余厘米，怎样让函数交回两个结果？"},P016:{concepts:["函数复用","闭区间","min 与 max"],approach:"先用 max 保证字号不低于下限，再用 min 保证不超过上限。题目保证下限不大于上限，因此第二步不会破坏第一步的条件。",steps:["定义 clamp，接收字号、下限和上限。","在函数体中先取 max(size, low)，再对结果与 high 取 min，并返回。","按原顺序调用函数处理每个字号，将生成的结果逐项交给 print，以空格分隔。"],time:"O(n)，每个字号只经过两次比较。",space:"O(n)，整行拆分和打印时展开的参数都与字号数量有关。",pitfall:"若把顺序和上下限写混，有些合法字号也会被改动。用下限等于上限、两端恰好相等及内点数据验证。",extension:"把函数用于允许负数的温度区间，还需要改变函数体或只是调整输入范围？"}},w=[{id:"P047",title:"按登记顺序汇总借阅",difficulty:"入门",tag:"字典",description:"阅览室按时间记录借出的图书类别。对每个出现过的类别统计借阅次数，类别按初次登记时间排列。",input:"第一行一个整数 n。接下来 n 行每行一个类别名。",output:"每种类别占一行，输出类别名和次数，用一个空格分隔。各行按类别第一次输入的顺序排列。没有记录时输出“空”。",sample:[`5
历史
科普
历史
图册
科普
`,`历史 2
科普 2
图册 1
`,"历史最早出现，之后是科普、图册。后续借阅只改变次数。"],limits:"0 ≤ n ≤ 500。类别名长度为 1–12 个字符，且不含空白字符。",cases:[[`0
`,`空
`],[`1
数学
`,`数学 1
`],[`4
z
a
z
b
`,`z 2
a 1
b 1
`],[`3
手工
手工
手工
`,`手工 3
`]],hints:["用字典保存次数。新类别的旧计数可视为 0。","更新已有键会保留其原有插入位置，可以直接遍历 items()。"],solution:`n = int(input())
counts = {}
for _ in range(n):
    category = input()
    counts[category] = counts.get(category, 0) + 1
if not counts:
    print("空")
else:
    for category, count in counts.items():
        print(category, count)`,guide:{concepts:["字典计数","键的插入顺序","空输入"],approach:"用一个字典同时保存各类别次数和键的首次插入顺序。每次遇到已有类别时只更新值，无需再维护一张顺序表。",steps:["为每条借阅记录读取类别名。","用 get 提供默认值 0，递增当前类别的次数。","空字典输出“空”。有数据就逐项输出 items() 中的类别和次数。"],time:"名称长度有上界，平均 O(n+1)。",space:"O(k+1)，k 为记录中不同类别的个数。",pitfall:"sorted(counts) 会改成名称顺序。更新时删除键再插入也会把它挪到末尾。",extension:"如果题目改为按类别最近一次被借阅的时间排列，更新操作需要怎样调整？"}},{id:"P048",title:"工号登记冲突",difficulty:"基础",tag:"字典",description:"每个工号第一次提交的值作为基准。后续每条同工号记录若与基准不同，就多记一次冲突。基准一旦确定就保持固定。请统计出现过的不同工号数与冲突记录数。",input:"第一行整数 n。接下来 n 行，每行是工号和一个整数，用一个空格分隔。",output:"一行两个整数，分别为不同工号数和冲突记录数，中间用一个空格分隔。",sample:[`6
A 0
B 5
A 3
A 0
B 5
B 0
`,`2 2
`,"A 的基准为 0，B 的基准为 5。A 的 3 和 B 的 0 各产生一次冲突。"],limits:"0 ≤ n ≤ 500。工号由 1–12 个英文字母或 ASCII 数字组成，区分大小写，值的绝对值不超过 10⁶。",cases:[[`0
`,`0 0
`],[`3
A 0
A 0
A 0
`,`1 0
`],[`4
R -2
R -1
R -1
R -2
`,`1 2
`],[`3
K 2
k 2
00 2
`,`3 0
`],[`5
Q 4
Q 6
D 0
D -5
Q 6
`,`2 3
`]],hints:["用工号是否出现在字典中判断是不是第一次登记，基准可以等于 0。","只有第一次写入基准。以后遇见同一工号，只比较和累计冲突。"],solution:`n = int(input())
baseline = {}
conflicts = 0
for _ in range(n):
    worker, text = input().split()
    value = int(text)
    if worker not in baseline:
        baseline[worker] = value
    elif value != baseline[worker]:
        conflicts += 1
print(len(baseline), conflicts)`,guide:{concepts:["键成员检测","保留首次值","逐条累计冲突"],approach:"把字典用作基准查询表。键是否出现与值是否为零是两个不同问题，因此用 in 判断是否登记过。",steps:["逐行拆分工号和数值。工号用原始字符串保存，数值转成整数。","新工号写入基准。已登记且值有差异时只增加冲突数，不改基准。","用 len(baseline) 得到工号数，与累计的冲突一起输出。"],time:"工号长度有上界，平均 O(n+1)。",space:"O(k+1)，k 为不同工号数。",pitfall:"用 if not baseline.get(worker) 会把基准 0 当作未登记。冲突后覆盖原基准也会让之后的记录和错误的值比较。",extension:"若想列出每个工号发生冲突的次数，怎样把这个次数与该工号的基准同时保存？"}},{id:"P049",title:"互为借阅的记录",difficulty:"进阶",tag:"字典",description:"一次借阅记录包含借阅人和出借人。若同一对不同的人各自至少向对方借过一次，就把这两人计为一组。重复记录和向自己借阅的记录不增加组数。",input:"第一行整数 n。接下来 n 行，每行两个用空格分隔的代号，先是借阅人，再是出借人。",output:"输出两人互为借阅的组数。同一对人只计一次。",sample:[`7
b a
a b
a b
c d
d c
a a
a c
`,`2
`,"a 和 b、c 和 d 都各有两个方向。a 借给自己排除，a 和 c 只有一个方向。"],limits:"0 ≤ n ≤ 500。代号由 1–12 个小写英文字母组成。",cases:[[`0
`,`0
`],[`3
a a
b b
a a
`,`0
`],[`3
a b
b c
c a
`,`0
`],[`4
zu aa
aa zu
zu aa
aa zu
`,`1
`],[`6
a b
b a
c a
a c
b c
c b
`,`3
`]],hints:["用 (借阅人, 出借人) 作为一个整体记录。颠倒两个代号就得到反方向。","遍历记录时，只在第一个代号小于第二个代号的一侧计数，这样两个人只算一组。"],solution:`n = int(input())
seen = {}
for _ in range(n):
    borrower, lender = input().split()
    if borrower != lender:
        seen[(borrower, lender)] = True
pairs = 0
for borrower, lender in seen:
    if borrower < lender and (lender, borrower) in seen:
        pairs += 1
print(pairs)`,guide:{concepts:["元组键","去重","反向查询"],approach:"先收齐两个方向的记录，遍历时就能直接查反方向。用第一个代号较小作为计数规则，同一对人总有且只有一个方向满足这个大小关系。",steps:["过滤自己借自己的记录，把每个有向关系作为字典的元组键。","已有的键再次写入仍然只有一项，自动消除同向重复。","逐个检查第一个代号较小的键，若反方向键存在就增加组数。"],time:"名称长度有上界，平均 O(n+1)。",space:"O(e+1)，e 为不同的有向关系数。",pitfall:"只检查反向键会把互为借阅计算两遍。如果先对元组内的两个代号排序，则会丢掉借阅方向。",extension:"如果要统计一人曾向多少个不同的人借过，这批元组键还能如何重用？"}},{id:"P050",title:"双箱投票汇总",difficulty:"进阶",tag:"字典",description:"展览在两个场地设有投票箱。候选代号必须在两个箱中都至少得到一票，才进入评选。两箱票数相加，列出总票数最高的所有合格候选。",input:"第一行两个整数 n 和 m，分别为两个投票箱的票数。接下来 n 行属于一号箱，再接下来 m 行属于二号箱，每行一个候选代号。",output:"若无合格候选，输出“无”。否则按候选代号的字典序升序逐行输出所有并列最高者，每行是代号和两箱总票数，用一个空格分隔。",sample:[`4 4
oak
elm
oak
fir
elm
oak
elm
maple
`,`elm 3
oak 3
`,"elm 和 oak 在两箱都有票，且都得到三票。fir 和 maple 仅在一箱出现。"],limits:"0 ≤ n,m ≤ 400。每个代号由 1–20 个小写英文字母组成。",cases:[[`0 0
`,`无
`],[`0 2
oak
oak
`,`无
`],[`2 2
red
red
blue
blue
`,`无
`],[`4 1
z
z
z
a
a
`,`a 2
`],[`3 4
z
z
a
a
z
a
a
`,`a 4
`],[`2 2
be
bee
bee
be
`,`be 2
bee 2
`]],hints:["两个箱各用一个字典，保留每个候选在哪个箱拿到多少票。","只对两个箱都有的代号计算总票数。合格候选为空时先处理，再求最大值。"],solution:`n, m = map(int, input().split())
first, second = {}, {}
for count, votes in ((n, first), (m, second)):
    for _ in range(count):
        candidate = input()
        votes[candidate] = votes.get(candidate, 0) + 1
totals = {}
for candidate, count in first.items():
    if candidate in second:
        totals[candidate] = count + second[candidate]
if not totals:
    print("无")
else:
    best = max(totals.values())
    winners = [candidate for candidate in totals if totals[candidate] == best]
    for candidate in sorted(winners):
        print(candidate, best)`,guide:{concepts:["分别统计频次","键的交集","并列最值和字典序"],approach:"两箱分别计票便于判断候选是否符合双箱条件。合并两箱中共有的候选，求最高票数，最后只为并列最高者排序。",steps:["使用外层循环依次处理两个箱。每次用该箱的票数控制循环，并更新对应字典。","扫描一号箱的键，在二号箱也出现时才把合计分数存进 totals。","为空则输出“无”。否则用 max 得到最高票数，选出达到它的代号，按 sorted 的顺序输出。"],time:"代号长度有上界，平均 O(1+n+m+w log(w+1))，w 为获胜代号数。",space:"O(k+1)，k 为两箱全部不同代号数，合计字典和胜出列表均不会超过 k。",pitfall:"只累计一张总票表会丢失代号来自哪个箱。合格候选为空时直接 max 会报 ValueError。",extension:"若改成三个箱，要求每个候选至少在两个箱出现，怎样同时维护总票数和出现过的箱数？"},origin:{kind:"adapted",platform:"AtCoder",title:"Poll",id:"ABC155C",level:"原题 C · 300 分",url:"https://atcoder.jp/contests/abc155/tasks/abc155_c?lang=en",concepts:["字符串频次统计","按字典序输出并列最多项"],adaptation:"原题统计一批选票并输出并列最多的名字。本题设置双箱参选条件、合并票数、无合格候选的分支，并重写题面、样例和测试数据。"}},{id:"P051",title:"比较两箱封边长度",difficulty:"基础",tag:"函数",description:"两只长方形包装箱各需沿一个长方形箱口贴一圈胶带。每条记录给出甲、乙箱口的长和宽，判断哪只需要的胶带更长。建议让同一个函数分别计算两只箱口的一圈长度。",input:"第一行整数 q。接下来 q 行，每行四个整数 a、b、c、d，分别为甲的长和宽、乙的长和宽。",output:"每条记录输出一行。甲箱用料更长输出“甲”，乙箱更长输出“乙”，两者相同输出“相同”。",sample:[`3
3 4 2 6
5 2 2 5
7 1 2 2
`,`乙
相同
甲
`,"第一行甲、乙围长分别为 14 和 16。第二行长宽互换，围长相同。第三行 16 大于 8。"],limits:"1 ≤ q ≤ 200。每个尺寸为 1–10⁶，单位相同。",cases:[[`1
3 3 3 3
`,`相同
`],[`1
1000000 1000000 1000000 999999
`,`甲
`],[`2
4 4 2 6
1 1 1 2
`,`相同
乙
`],[`1
1 6 3 3
`,`甲
`]],hints:["一圈有两条长边和两条宽边，用一个函数返回 (长 + 宽) × 2。","用变量保存两次调用的结果，再用条件判断选择要输出的字样。"],solution:`def perimeter(length, width):
    return (length + width) * 2

q = int(input())
for _ in range(q):
    a, b, c, d = map(int, input().split())
    first = perimeter(a, b)
    second = perimeter(c, d)
    if first > second:
        print("甲")
    elif second > first:
        print("乙")
    else:
        print("相同")`,guide:{concepts:["定义与调用函数","接收返回值","三路比较"],approach:"围长公式在两只箱子上相同，抽取一个计算函数复用。外层负责读入尺寸、比较和输出。",steps:["定义 perimeter，按闭合边界的两长两宽返回围长。","每条记录分别把两对尺寸传给函数，接收两个整数结果。","先判断甲更长，再判断乙更长，其余情况围长相同。"],time:"O(q)，每组固定两次调用、至多两次比较。",space:"O(1)，只保存正在处理的一组。",pitfall:"长乘宽是面积，面积大小可能跟围长的比较结果不一致。如果函数用 print，调用处会拿到 None。",extension:"若每条记录有三只箱子，且并列时也要报告全部最大者，怎样让围长函数保持不变？"}},{id:"P052",title:"两次调拨库存",difficulty:"基础",tag:"函数",description:"同一物品分布在甲、乙、丙三个仓位。先从甲往乙调拨，最多 x 件，再从乙往丙调拨，最多 y 件。每次有库存就尽量满足，剩余库存不足时把来源仓的现有库存全部调走。请输出两次调拨后的库存。",input:"第一行三个整数 a、b、c，表示三个仓位的初始库存。第二行两个整数 x、y，表示两次调拨的数量上限。",output:"一行三个整数，依次为甲、乙、丙剩余库存，以一个空格分隔。",sample:[`5 2 10
8 4
`,`0 3 14
`,"甲最多只能调出 5 件，乙收到后有 7 件。乙再调出 4 件，留下 3 件，丙增加到 14 件。"],limits:"0 ≤ a,b,c,x,y ≤ 10⁹。",cases:[[`0 0 0
100 100
`,`0 0 0
`],[`4 6 1
0 0
`,`4 6 1
`],[`8 1 0
2 7
`,`6 0 3
`],[`4 0 2
4 4
`,`0 0 6
`],[`1000000000 1000000000 1000000000
1000000000 1000000000
`,`0 1000000000 2000000000
`]],hints:["每次实际调拨量等于来源库存与申请上限中较小的一个。","让函数交回更新后的来源与目的库存。第二次调拨应该拿到已经变更的乙仓库存。"],solution:`def transfer(source, target, limit):
    moved = min(source, limit)
    return source - moved, target + moved

a, b, c = map(int, input().split())
x, y = map(int, input().split())
a, b = transfer(a, b, x)
b, c = transfer(b, c, y)
print(a, b, c)`,guide:{concepts:["函数返回一对值","解包赋值","按序更新状态"],approach:"两次调拨使用相同的库存更新规则。函数根据当前库存和上限求实际调拨量，再成对交回两个最新库存。",steps:["取 min(source, limit) 得到本次实际调出量。","来源减它、目的加它。把这两个结果按约定顺序作为一对值返回。","第一次解包更新 a、b 后，用新的 b 和原 c 调用第二次，更新 b、c，再输出。"],time:"O(1)，固定进行两次调拨。",space:"O(1)，只保存固定数量的整数。",pitfall:"使用乙的初始库存做第二次调拨会漏掉甲新送来的物品。打印前可核对三仓库存总和是否仍与初始相同。",extension:"如果有很多仓位和依时间排序的调拨清单，怎样用列表存库存并复用 transfer？"}},{id:"P053",title:"反复整除取因子",difficulty:"进阶",tag:"函数",description:"给定正整数 n 和整数 b。只要当前数能够被 b 整除，就把当前数替换成商，并增加一次计数。报告共整除多少次以及最后剩下的数。可以用递归交回这两个结果。",input:"一行两个空格分隔的整数 n 和 b。",output:"输出两个整数，分别为整除次数与最后剩下的数，中间用一个空格分隔。",sample:[`108 3
`,`3 4
`,"108 → 36 → 12 → 4。前三次整除成功，4 无法再被 3 整除。"],limits:"1 ≤ n ≤ 10⁹，2 ≤ b ≤ 10⁹。b 可以是合数。",cases:[[`1 7
`,`0 1
`],[`14 3
`,`0 14
`],[`72 6
`,`2 2
`],[`536870912 2
`,`29 1
`],[`1000000000 1000000000
`,`1 1
`]],hints:["当前值除以 b 有余数时，直接返回 0 次和当前值。","能整除时，递归处理商，然后把小问题返回的次数加 1，最后剩下的数原样交回。"],solution:`def factor_out(value, base):
    if value % base != 0:
        return 0, value
    count, rest = factor_out(value // base, base)
    return count + 1, rest

number, base = map(int, input().split())
count, rest = factor_out(number, base)
print(count, rest)`,guide:{concepts:["整除判断","递归停止条件","逐层合并返回值"],approach:"如果存在一次整除机会，整个问题就是先做这一次，再解决商的同类问题。正整数每次至少减为原来的一半，递归会停。也可以用循环维护当前商和计数。",steps:["用 value % base 检查是否还有余数。有余数时已无法继续，返回 0 和 value。","能整除时，将 value // base 和同一个 base 传给下一层，取回次数与最后剩下的数。","当前层多做了一次整除，所以只给次数加 1。外层打印最终结果。"],time:"成功整除 k 次时为 O(k+1)，其中 k ≤ log_b(n)。",space:"递归用 O(k+1) 栈空间。写成循环时额外空间为 O(1)。",pitfall:"调用时误用 / 会得到浮点数。只在当前值等于 1 时结束也不够，例如 14 除以 3 一次都不能做。",extension:"如果把 b 去掉，改为输出 n 的所有质因子及次数，需要怎样枚举并更新当前值？"},origin:{kind:"adapted",platform:"LeetCode",title:"Power of Three",id:"326",level:"原题 Easy",url:"https://leetcode.com/problems/power-of-three/description/",concepts:["重复整除","识别整除链结束状态"],adaptation:"原题判断一个整数是否为 3 的幂。本题允许指定除数，限制为正整数输入，并输出最大整除次数和最终值。题面、样例、用例重新编写。"}},{id:"P054",title:"分袋数量与深度",difficulty:"进阶",tag:"函数",description:"一批零件有 n 件，袋子容量为 c。大小在 1 到 c 之间的一组直接装成一袋。大于 c 的一组必须分成两组，前一组取总数除以 2 的整数部分，后一组取剩余的全部。每个子组继续按相同规则处理。统计最终袋数，以及任意一袋从初始一组到装袋最多经历多少次拆分。",input:"一行两个空格分隔的整数 n 和 c。",output:"一行两个整数，分别为最终袋数和最大拆分次数。空批次输出 0 0。如果一开始就能装成一袋，拆分次数为 0。",sample:[`7 3
`,`3 2
`,"先拆成 3 和 4。3 直接装袋，4 拆成 2 和 2 并分别装袋。共 3 袋，后两袋经历了 2 次拆分。"],limits:"0 ≤ n ≤ 5000，1 ≤ c ≤ 5000。",cases:[[`0 2
`,`0 0
`],[`3 3
`,`1 0
`],[`9 3
`,`4 2
`],[`4 3
`,`2 1
`],[`5000 1
`,`5000 13
`]],hints:["一组能直接装袋时，可返回 1 袋和 0 次拆分。先单独考虑总件数为 0。","分别处理两边，袋数相加。深度从较深的一边取值，再加上当前这次拆分。"],solution:`def pack(items, capacity):
    if items == 0:
        return 0, 0
    if items <= capacity:
        return 1, 0
    left = items // 2
    left_bags, left_depth = pack(left, capacity)
    right_bags, right_depth = pack(items - left, capacity)
    return left_bags + right_bags, 1 + max(left_depth, right_depth)

items, capacity = map(int, input().split())
bags, depth = pack(items, capacity)
print(bags, depth)`,guide:{concepts:["分支递归","两个停止条件","分别合并数量和最大深度"],approach:"每次拆分产生两个独立子问题。两个子组的袋子要全部计入，而最深袋子只会来自其中较深的一侧，所以两项结果分别用加法和最大值来合并。",steps:["空组返回 (0, 0)，能装下的非空组直接返回 (1, 0)。","需要拆分时计算 left，其余 items - left 都进入右组。分别递归得到两个子组的袋数和深度。","总袋数取和。任一子组出现的袋子都经历了当前拆分，深度取两边最大值再加 1。"],time:"O(B+1)，B 为袋数。每次拆分恰好产生两组，非空输入时有 B 个装袋节点和 B-1 个拆分节点。",space:"O(h+1) 栈空间，h 为最大拆分次数。每次两组的大小最多为原组的一半向上取整，深度为 O(log(n+1))。",pitfall:"两个子组都用 items // 2 会让总数为奇数时丢掉一件。把两边深度相加得到的也不是最长的一条拆分路径。",extension:"若还要统计尺寸最小的袋有多少个，可以怎样在返回值里同时保留最小尺寸和出现次数？"}}],_={P017:{concepts:["标准库 math","最小公倍数","从零时刻之后开始计时"],approach:"两条灯带的闪烁时刻分别是各自周期的正整数倍。寻找最早共同的闪烁时刻，等价于求两个周期的最小正公倍数。math.lcm 已实现该运算。",steps:["从同一行读入两个正整数周期。","把 a、b 交给 math.lcm 求最小正公倍数。","只输出返回的整数秒数。"],time:"核心是最大公约数相关运算。按欧几里得算法估计为 O(1+log min(a,b)) 次整数运算。",space:"O(1) 个整数，运算中无需保存历次闪烁时刻。",pitfall:"直接乘 a 和 b 只在互质时得到最早同时闪烁的时间。0 虽能被两种周期整除，但题目要求开始之后。",extension:"若灯带增至三条，能否直接把三个周期交给同一个函数？"},P018:{concepts:["标准库 datetime","date 与 timedelta","绝对天数差"],approach:"把两个日期解析成 date 对象后再相减。标准日期运算会按公历处理月长、闰年和跨年，可以用小样本检查业务要求的相同或倒序日期。",steps:["from datetime import date 绑定 date，再分别解析两行。","用 second - first 计算两个日期之间的 timedelta。","取 .days，再用 abs 将负数变为非负距离。"],time:"O(1)，输入日期文本长度固定，只解析两个日期并计算一次差。",space:"O(1)，保存两个日期和一个间隔。",pitfall:"两个日期交换顺序会改变差值符号。1900 年不是闰年，而 2000 年是，不能只判断年份是否能被 4 整除。",extension:"若要找出两个日期之间有多少个工作日，如何在天数计算之外加入星期规则？"},P019:{concepts:["以 UTF-8 打开文本","写后读","空白行识别"],approach:"先保存输入的每一行，再依据读回的日志逐行计数。保留原行可以让同一份日志支持不同的统计规则。",steps:["以 w 模式打开 notes.txt。每条输入加一个换行写入。","写入块结束后，以默认的 r 模式重新打开。","仅在 line.strip() 非空时加 1，最后输出计数。"],time:"O(T+1)，T 为所有记录的字符数（含写入的换行），主要工作是读写和判断空白。",space:"逐行处理需要 O(L+1) 的临时文本，L 为最长行；虚拟文件存储 O(T+1)。",pitfall:"空行通常是带换行的字符串，直接用 if line 会计入它。也要保留重复出现的非空签到记录。",extension:"如果输出还要包含首个非空签到行号，如何用 enumerate 保持原始行号？"},P020:{concepts:["在两个文本文件间转换","保持输入顺序","严格阈值"],approach:"先保存完整库存，再逐行读源文件，把满足条件的名字写入独立副本。原文件和派生数据分开，方便分别复核。",steps:["将 n 行库存写入 stock.txt。","同时打开 stock.txt 供读、refill.txt 供写。拆分名称及整数库存，只将低于阈值的名称写入副本。","关闭写入块后重新打开副本，输出全体结果。若文件为空，输出“无需补货”。"],time:"O(T+1)，T 为全部输入记录的字符数（含换行）。各文件读写总量与它线性相关。",space:"虚拟文件共 O(T+1)，参考代码末尾的 read 还需要足以存下补货列表的临时文本。",pitfall:"库存恰好等于阈值时不应输出。不要用集合去重，同名商品的每条记录仍按输入顺序分别判断。",extension:"如果不希望在程序内一次读取整个副本，可以怎样逐行打印并识别副本为空？"}},P=[{id:"P055",title:"方形展位核算",difficulty:"入门",tag:"模块",description:"手里有 n 块相同的方砖。将其中若干块铺成一个尽可能大的实心正方形，方砖不能裁切。求正方形每边的方砖数，以及剩余多少块。",input:"一行一个整数 n。",output:"一行两个整数，先输出每边块数，再输出剩余块数，用空格分隔。n 为 0 时两项均为 0。",sample:[`31
`,`5 6
`,"用 25 块铺出 5 × 5 的正方形。剩下 6 块，不足以铺出 6 × 6。"],limits:"0 ≤ n ≤ 10¹⁸。",cases:[[`0
`,`0 0
`],[`1
`,`1 0
`],[`16
`,`4 0
`],[`999999999999999999
`,`999999999 1999999998
`],[`1000000000000000000
`,`1000000000 0
`]],hints:["最大边长 s 满足 s² ≤ n < (s+1)²。","math.isqrt 返回精确的整数平方根，然后用 n 减掉实际使用的砖数。"],solution:`from math import isqrt

bricks = int(input())
side = isqrt(bricks)
print(side, bricks - side * side)`,guide:{concepts:["标准库导入","整数平方根","相邻平方边界"],approach:"能铺出的最大边长就是不超过 n 平方根的最大整数。isqrt 直接给出这个精确整数，对接近大平方数的输入也能正确取整。",steps:["将 n 转为整数。","调用 isqrt 得到 side，对应使用 side * side 块。","用总数减去使用量，输出边长和余量。"],time:"题目整数位数固定，调用一次整数平方根后做固定次数的整数运算。",space:"O(1) 个整数。",pitfall:"浮点 math.sqrt 可能把很接近完全平方数的输入舍入到错误边长。isqrt(0) 已正确返回 0。",extension:"给定边长目标与现有砖数，怎样计算还差多少块，充足时输出 0？"}},{id:"P056",title:"计算工作日交货日期",difficulty:"基础",tag:"模块",description:"从约定日期的次日开始计数。每逢周一到周五计为一个工作日，周六和周日跳过。不考虑法定节假日。求第 k 个工作日的日期。k 为 0 时返回约定日期。",input:"一行，YYYY-MM-DD 格式的约定日期和整数 k，用一个空格分隔。",output:"一行 YYYY-MM-DD 格式的目标日期。",sample:[`2024-02-28 3
`,`2024-03-04
`,"2 月 29 日、3 月 1 日是前两个工作日。周末跳过，3 月 4 日为第 3 个。"],limits:"初始日期合法，初始年份为 1900–2099，0 ≤ k ≤ 1000。结果可以落在更晚的年份。",cases:[[`2024-03-03 0
`,`2024-03-03
`],[`2024-03-02 1
`,`2024-03-04
`],[`2025-12-31 2
`,`2026-01-02
`],[`2000-02-28 1
`,`2000-02-29
`],[`2024-03-01 5
`,`2024-03-08
`]],hints:["把字符串转成 date 对象，每次加 timedelta(days=1)。","weekday() 为 0–4 时消耗一个工作日。先前进到下一天，再判断是否计数。"],solution:`from datetime import date, timedelta

text, days = input().split()
current = date.fromisoformat(text)
remaining = int(days)
one_day = timedelta(days=1)
while remaining > 0:
    current += one_day
    if current.weekday() < 5:
        remaining -= 1
print(current.isoformat())`,guide:{concepts:["日期运算","weekday","带条件的循环计数"],approach:"由标准库负责日期进位，剩余工期由业务判断控制。测试工作日、周末、跨月和跨年时可以使用同一段循环。",steps:["解析起始日期和剩余工作日数。","还有工作日需要计数时，先向前走一天。周一至周五才减少剩余数量。","剩余数量为 0 时输出日期。k 为 0 会直接跳过循环。"],time:"O(k+1)。每 7 个连续日历日有 5 个工作日，循环天数与 k 线性相关。",space:"O(1)，逐天更新一个日期和剩余数量。",pitfall:"检查星期之前应该先前进一步，否则把约定日计入了工期。若周末也减少，结果会提前。",extension:"如果还需跳过给出的节假日，怎样保存这些日期并在循环中查询？"}},{id:"P057",title:"选取实际出现的代表读数",difficulty:"基础",tag:"模块",description:"一批整数读数需要选择一个实际出现过的代表值。将全部读数排序，奇数项选中间一项，偶数项选中间两项中较小的一项。再分别统计严格小于和严格大于代表值的读数数量。",input:"第一行一个整数 n。第二行有 n 个整数读数，以空格分隔。",output:"依次输出代表值、小于它的读数数量、大于它的读数数量，用空格分隔。",sample:[`6
18 3 6 8 12 6
`,`6 1 3
`,"排序后为 3、6、6、8、12、18。中间两项是 6 和 8，代表值为 6。等于 6 的两项都不计入两侧。"],limits:"1 ≤ n ≤ 2000，读数的绝对值不超过 10⁹。重复读数分别参与排序。",cases:[[`1
0
`,`0 0 0
`],[`2
100 -4
`,`-4 0 1
`],[`4
7 7 7 7
`,`7 0 0
`],[`5
-4 9 0 3 3
`,`3 2 1
`],[`4
-1000000000 -1 0 1000000000
`,`-1 1 2
`]],hints:["偶数项时不能取两个中间值的平均数。查找 statistics 中的 median_low。","确定代表值后，逐个比较读数，遇到相等值跳过。"],solution:`from statistics import median_low

n = int(input())
readings = list(map(int, input().split()))
chosen = median_low(readings)
smaller = larger = 0
for value in readings:
    if value < chosen:
        smaller += 1
    elif value > chosen:
        larger += 1
print(chosen, smaller, larger)`,guide:{concepts:["低中位数","排序","重复值与严格比较"],approach:"题目定义的代表值与 median_low 一致，能直接使用标准库，也可以排序后取 0 基位置 (n-1)//2。再扫描整批读数处理重复值。",steps:["保存 n 个读数，函数内部可按顺序找到靠左的中间项。","遍历读数，与代表值比较，只更新严格更小或更大的计数。","按题目顺序输出代表值和两个计数。"],time:"O(n log(n+1))，标准库对读数排序，比较计数需要 O(n)。",space:"O(n)，保存输入与排序时的临时空间。",pitfall:"median 在偶数项时可能返回根本未出现的数。也不能仅拿排序位置当严格较小的数量，重复值会占据多个位置。",extension:"如果要求返回较大的中间值，要用什么工具或排序位置？"}},{id:"P058",title:"最小整数接收半径",difficulty:"进阶",tag:"模块",description:"平面上有 n 个观测点和 k 个接收站。每个站使用相同的整数半径。只要某个观测点与至少一个站的欧氏距离不超过半径，就能被接收。求覆盖所有观测点所需的最小非负整数半径。",input:"第一行两个整数 n 和 k。接下来 n 行是观测点的坐标，再接下来 k 行是接收站的坐标，每行两个整数 x、y，以空格分隔。",output:"输出一个整数，表示所需的最小半径。",sample:[`3 2
0 0
7 1
3 3
0 0
7 0
`,`5
`,"三个点到最近站的平方距离分别为 0、1、18。半径 4 的平方为 16，覆盖不了第三点。半径 5 可全部覆盖。"],limits:"1 ≤ n,k ≤ 180，坐标绝对值不超过 10⁹，允许重合。",cases:[[`1 1
0 0
0 0
`,`0
`],[`1 1
3 4
0 0
`,`5
`],[`1 1
1000000000 1
0 0
`,`1000000001
`],[`2 2
0 0
100 0
99 0
2 0
`,`2
`],[`2 1
1 1
-1 1
0 0
`,`2
`],[`1 1
1000000000 1000000000
-1000000000 -1000000000
`,`2828427125
`]],hints:["对每个观测点先找最小平方距离，再找这些最小值中的最大者。","用 math.isqrt 求该最大平方距离的向下取整平方根。如果平方仍小于原值，半径加 1。"],solution:`from math import isqrt

n, k = map(int, input().split())
sensors = [tuple(map(int, input().split())) for _ in range(n)]
stations = [tuple(map(int, input().split())) for _ in range(k)]
required = 0
for x, y in sensors:
    closest = min((x - sx) ** 2 + (y - sy) ** 2 for sx, sy in stations)
    required = max(required, closest)
radius = isqrt(required)
if radius * radius < required:
    radius += 1
print(radius)`,guide:{concepts:["欧氏距离的平方","先求最近再求最远","整数开方向上取整"],approach:"每个点只需由一个站覆盖，所以它的需求由最近的站决定。全部覆盖需要满足其中最大的需求。距离都是非负数，先比较平方不会改变大小关系，也能避开浮点误差。",steps:["将观测点和站点分别读入。对每个点，计算它与每个站之间横纵坐标差的平方和。","记录当前点能得到的最小平方距离，再更新所有点中最大的这个值。","用 isqrt 得到候选半径。若其平方偏小，向上增加 1，最后输出整数。"],time:"O(nk)，对每个点扫描所有站，最后做一次整数平方根。这里坐标位数有上界。",space:"O(n+k)，保存坐标。生成器依次交给 min 距离，不额外存下整张距离表。",pitfall:"不能选每个点的最远站。“一个站即可覆盖”用 min，“所有点均被覆盖”再用 max。浮点开方可能把紧邻完全平方数的距离舍入掉。",extension:"如果各站允许的半径不同，只判断一份给定方案能否覆盖，可以怎样提前结束每个点的检查？"},origin:{kind:"adapted",platform:"AtCoder",title:"Light It Up",id:"ABC255B",level:"原题 B · 200 分",url:"https://atcoder.jp/contests/abc255/tasks/abc255_b?lang=en",concepts:["最近点距离","覆盖半径","比较平方距离"],adaptation:"原题从人群中选出持灯者并可输出实数。本题分别给出观测点与站点、要求精确的最小整数半径，重写情境、样例和数据。"}},{id:"P059",title:"分两批追加签到",difficulty:"入门",tag:"文件读写",description:"签到名单分两批到达。建议先用覆盖模式建立当天日志并写入第一批，再用追加模式写入第二批。读回日志，报告记录总数与最后一条。重复名字仍是不同记录。",input:"第一行两个整数 n、m，分别表示两批记录数。接下来 n 行是第一批名字，再接下来 m 行是第二批名字，每行一个。",output:"第一行输出总记录数。第二行输出最后一条名字，没有记录时输出“空”。",sample:[`2 2
星河
余舟
星河
陈杉
`,`4
陈杉
`,"第二批追加到第一批之后，有四条记录。最后一条是陈杉。"],limits:"0 ≤ n,m ≤ 120，每个名字含 1–16 个字符，不含空白。",cases:[[`0 0
`,`0
空
`],[`0 2
木白
云岚
`,`2
云岚
`],[`2 0
北桥
南桥
`,`2
南桥
`],[`1 1
甲
甲
`,`2
甲
`]],hints:["每条姓名写入后加一个换行。第二批需要保留第一批的内容。","读回时逐行累计次数，用变量记住最后读到的姓名。"],solution:`n, m = map(int, input().split())
with open("arrivals.txt", "w", encoding="utf-8") as log:
    for _ in range(n):
        log.write(input() + "\\n")
with open("arrivals.txt", "a", encoding="utf-8") as log:
    for _ in range(m):
        log.write(input() + "\\n")
count = 0
last = "空"
with open("arrivals.txt", encoding="utf-8") as log:
    for line in log:
        count += 1
        last = line.rstrip("\\n")
print(count)
print(last)`,guide:{concepts:["w 与 a","UTF-8","顺序读回"],approach:"分成两个 with 块可模拟两批独立到达的记录。第二块使用 a 保留先前数据，读回时累计行数并记录最后读到的行。",steps:["用 w 打开文件写入 n 条，每条追加换行，即使 n 为 0 也创建当天日志。","关闭后用 a 打开，追加 m 条。","重新以读模式打开，边数行边更新最后一条。空文件保留预设的“空”。"],time:"O(T+1)，T 为两批记录的字符数（含换行）。",space:"临时文本 O(L+1)，L 为最长名称；虚拟文件存储 O(T+1)。",pitfall:"第二个 with 使用 w 会抹掉第一批。在写每一条时漏写换行也会使多条记录连成一条。",extension:"如果还要统计日志中不同名字的数量，需要额外保存哪些信息？"}},{id:"P060",title:"汇总寄存清单里的 CSV 记录",difficulty:"基础",tag:"文件读写",description:"寄存清单的一条记录有名称和数量两项。名称允许逗号及双引号。建议将收到的 CSV 记录保存到文件，用 CSV 规则读回，按名称累加数量。输出顺序取决于各名称的首次出现位置。",input:"第一行整数 n。接下来 n 行恰好是 n 条无表头 CSV 记录，每行两列：名称和非负整数数量。含有逗号或双引号的字段用双引号包裹，字段内的双引号用两个双引号表示。",output:"每种名称一行，以 CSV 格式输出名称和总数量。仅当名称含逗号或双引号时用双引号包裹，并将字段内的双引号写成两个。按名称首次出现顺序输出；没有记录时输出“空”。",sample:[`4
"纸,厚款",3
绳,1
"纸,厚款",5
"夹子""大""",2
`,`"纸,厚款",8
绳,1
"夹子""大""",2
`,"两条“纸,厚款”合计为 8，名称中的逗号仍属于第一列。夹子名称中的双引号要按 CSV 规则转义。"],limits:"0 ≤ n ≤ 200。解码后的名称含 1–20 个字符，无换行或控制字符，首尾无空白。每条数量在 0–10⁴ 范围内。",cases:[[`0
`,`空
`],[`3
Z,0
A,4
Z,9
`,`Z,9
A,4
`],[`2
"甲",4
甲,3
`,`甲,7
`],[`2
"木夹""大""",0
"木夹""大""",5
`,`"木夹""大""",5
`],[`2
",",1
",",1
`,`",",2
`]],hints:['用 open(..., newline="", encoding="utf-8") 打开 CSV 文件，再用 csv.reader 拆字段。',"字典可记录首次出现顺序。用 csv.writer 写到 sys.stdout，自动按规范处理名称。"],solution:`import csv
import sys

n = int(input())
with open("storage.csv", "w", encoding="utf-8", newline="") as file:
    for _ in range(n):
        file.write(input() + "\\n")

totals = {}
with open("storage.csv", encoding="utf-8", newline="") as file:
    for name, quantity in csv.reader(file):
        totals[name] = totals.get(name, 0) + int(quantity)

if totals:
    output = csv.writer(sys.stdout, lineterminator="\\n")
    output.writerows(totals.items())
else:
    print("空")`,guide:{concepts:["CSV 解析","引号和转义","按首次出现顺序聚合"],approach:"用 reader 获得真正的名称，再用真实名称合并。同一名称的输入可带冗余引号，解析后的字段内容才决定是否同一项。最后让 writer 统一生成字段引用。",steps:["把输入中收到的原始 CSV 记录逐行保存，保留字段引用。","用 csv.reader 逐条读回，数量转整数并按名称累计。","空记录输出“空”。否则把字典键值对按插入顺序传入 csv.writer。"],time:"名称长度受限，平均 O(T+1)，T 为 CSV 数据总字符数。",space:"聚合字典存 O(k) 个条目，k 为不同名称数；原始虚拟文件存 O(T+1) 字符。",pitfall:'split(",") 会切开名称中的逗号。手写 print(name, quantity, sep=",") 则会在输出时漏掉必要的引号。',extension:"如果输入有列标题，怎样让程序按标题获取字段，而不假设名称一定出现在第一列？"}},{id:"P061",title:"更新设备借用状态快照",difficulty:"进阶",tag:"文件读写",description:"借用柜用一份 JSON 对象记录每台设备是否已借出。处理一系列借出和归还操作，只有真的改变状态才计入变更次数。建议从文件读出初始快照，处理完后覆盖写入最终快照，再读回并展示结果。",input:"第一行是一份 JSON 对象，键是设备编号，值为 true（已借出）或 false（可借）。第二行整数 q，随后 q 行，每行是“借出 编号”或“归还 编号”。",output:"第一行输出状态实际变更的总次数。第二行按编号字典序升序输出最终已借出的设备编号，用一个空格分隔；都未借出时输出“空”。",sample:[`{"BX": false, "AA": true, "C": false}
4
借出 BX
借出 BX
归还 AA
归还 C
`,`2
BX
`,"BX 第一次借出改变状态，重复借出不计。归还 AA 改变状态，C 已在柜中。"],limits:"初始快照最多 120 台，键互不相同，每个编号含 1–12 个大写英文字母或 ASCII 数字。0 ≤ q ≤ 300，操作的编号均在初始快照中。JSON 对象一行不超过 4096 个字符。",cases:[[`{}
0
`,`0
空
`],[`{"Z": true, "A": true, "B": false}
0
`,`0
A Z
`],[`{"C": true}
3
借出 C
归还 C
归还 C
`,`1
空
`],[`{"B": false}
4
借出 B
归还 B
借出 B
归还 B
`,`4
空
`],[`{"K2": true, "K1": false}
2
归还 K2
借出 K1
`,`2
K1
`]],hints:["用 json.load 读回字典，值会成为 Python 的 True 或 False。","先比较目标状态和当前状态，再更新和计数。最后用 w 和 json.dump 写回一个 JSON 对象。"],solution:`import json

with open("devices.json", "w", encoding="utf-8") as file:
    file.write(input())
with open("devices.json", encoding="utf-8") as file:
    borrowed = json.load(file)

changes = 0
for _ in range(int(input())):
    action, code = input().split()
    target = action == "借出"
    if borrowed[code] != target:
        borrowed[code] = target
        changes += 1

with open("devices.json", "w", encoding="utf-8") as file:
    json.dump(borrowed, file)
with open("devices.json", encoding="utf-8") as file:
    final = json.load(file)
print(changes)
active = sorted(code for code in final if final[code])
print(" ".join(active) if active else "空")`,guide:{concepts:["JSON 布尔值","重复操作与状态","覆盖写入快照"],approach:"用随时可按设备编号查询的字典保存状态。每条操作先产生目标状态，只有当前值不同才计数。最终以完整对象重建快照，可独立读回核对。",steps:["将初始 JSON 原文写入并解析。布尔字段会成为 Python 的布尔对象。","处理各条操作。目标状态区别于当前状态时才写回字典并增加变更数。","使用 w 保存最终对象。读回后收集合格编号，排序输出，处理空列表。"],time:"平均 O(T+q+k log(k+1)+1)。T 为 JSON 文本长度，q 为操作数，k 为最终借出设备数量。",space:"O(T+d+1)，d 为设备总数。字典、排序列表与虚拟快照按这个规模占用空间。",pitfall:'字符串 "false" 在 Python 中非空，直接取真假将得到 True。用 json.load 保留正确类型。连续把两个对象追加到同一文件也无法用一次 load 读回。',extension:"如何同时保存每一条操作的审计日志，又使最后的状态文件始终可用 json.load 读出？"}},{id:"P062",title:"清理公告备注并导出副本",difficulty:"进阶",tag:"文件读写",description:"公告文件逐行保存文字。部分行用一对竖线 | 标出内部备注。建议先保存公告原稿，再写出副本：有备注的行删除两个竖线及其中的文字，其他字符和行的相对位置保持原样。读回副本，输出各行并报告处理过多少条备注。",input:"第一行整数 n，接下来 n 行是公告文字。每行或没有竖线，或恰好有两个竖线。两根竖线之间允许没有字符。输入中可以有空行。",output:"先逐行输出处理后的 n 行公告。保留备注外的全部空格，包括行尾空格。原有空行和删除备注后产生的空行都要占一行。再单列一行输出含成对竖线的原行数量。",outputComparison:"exact",sample:[`4
  东门|检查纸张| 10点
西门照常
|仅内部|

`,`  东门 10点
西门照常


2
`,"首行去掉备注后保留缩进与 10 点前的空格。第三行删完只剩空行，第四行原本就是空行。"],limits:"0 ≤ n ≤ 80，每行有 0–60 个字符，包含普通可打印字符及空格。使用竖线 | 作为唯一备注标界。",cases:[[`0
`,`0
`],[`1
|全部内容|
`,`
1
`],[`3
标题

尾声
`,`标题

尾声
0
`],[`2
始||终
  保留前导
`,`始终
  保留前导
1
`],[`3
|注| 前缀
尾有标|注|
|注|
`,` 前缀
尾有标

3
`],[`1
A |注|
`,`A 
1
`],[`3
上行
|注|
下行
`,`上行

下行
1
`]],hints:["写入原稿时每行明确带换行。读取时先去掉换行，其他空格不用 strip。","含竖线时将一行拆成备注前、备注、备注后，拼接首尾，并给每条输出加回换行。"],solution:`n = int(input())
with open("draft.txt", "w", encoding="utf-8") as draft:
    for _ in range(n):
        draft.write(input() + "\\n")

removed = 0
with open("draft.txt", encoding="utf-8") as draft, open("notice.txt", "w", encoding="utf-8") as notice:
    for line in draft:
        text = line.rstrip("\\n")
        if "|" in text:
            before, _, after = text.split("|")
            text = before + after
            removed += 1
        notice.write(text + "\\n")

with open("notice.txt", encoding="utf-8") as notice:
    for line in notice:
        print(line, end="")
print(removed)`,guide:{concepts:["成对标界","逐行转换","误删空格和空行"],approach:"把源文件和副本分开，按行处理。题目保证竖线成对且每行至多一对，因此可以用 split 取得三段。没有竖线时保留整行。",steps:["将原始公告存到 draft.txt。每条记录写一个换行，包括空行。","逐行读回时只去掉行末换行。带竖线的行拼接前后两段并计数。无论处理后是否为空，都要写入一行。","读回 notice.txt 时直接输出每条含换行的记录，再单独输出备注数。"],time:"O(T+1)，T 为原公告的字符数（含换行），每行只处理和读写常数次。",space:"临时文本 O(L+1)，L 为最长行。实际保存的源文件与副本占 O(T+1)。",pitfall:'用 strip 会丢掉行首或行尾的空格。将空行跳过会改变公告布局。print(line) 默认再写一个换行，因此这里用 end=""。',extension:"如果每行可含多段成对备注，如何用一个状态变量逐字符区分保留和删除的部分？"},origin:{kind:"adapted",platform:"AtCoder",title:"Spoiler",id:"ABC344A",level:"原题 A · 150 分",url:"https://atcoder.jp/contests/abc344/tasks/abc344_a?lang=en",concepts:["移除成对分隔符圈定的区段","保留前缀与后缀"],adaptation:"原题处理一行恰好有一对竖线的英文字串。本题改为处理多行临时文件，允许无备注或空行，保留布局并统计备注数。题面、样例及用例均重新编写。"}}],q={P021:{concepts:["逐条转换","ValueError","有效总量与失败计数"],approach:"每条原始记录都独立尝试转换。转换成功才累计该值，失败只增加无效数，不影响后面的记录。",steps:["读取原始整行，保留空行以便尝试转换。","让 int 解析字符串。Python 会先计算右侧的 int(value)，因此失败时不会改变 total。","匹配 ValueError 时增加无效数。循环结束后输出两个统计量。"],time:"O(T+1)，T 为输入记录的总字符数（含换行），单行长度有上界。",space:"O(L+1)，L 为最长输入行，程序逐行处理。",pitfall:"把 try 包住整个循环会让一条无效记录结束后续处理。也不能用转换结果的真假判断成功，合法的 0 转换会成功。",extension:"如果还要报告首条无效记录的行号，怎样在保留原统计的同时记录这个位置？"},P022:{concepts:["按顺序验证输入","ValueError 与 ZeroDivisionError","整除"],approach:"先把两个字段转换成整数。只有两项都转换成功，才会进行除法。这让格式错误的报告优先级自然高于零除。",steps:["逐行拆出两个字段。","从左到右计算 int(first) // int(second)。转换失败匹配 ValueError，合法除数为 0 匹配 ZeroDivisionError。","成功才打印整件数，两个异常分别打印题目要求的固定文本。"],time:"每个字段长度有上界，共 O(n) 次记录处理。",space:"额外空间 O(1)，只保存当前行的两个字段及运算结果。",pitfall:"先判断第二项是否为 0 会让输入 a 0 得到错误提示。使用 / 会输出浮点数，题目要求整件数。",extension:"若还要求同时输出剩余配件数，怎样复用两个异常处理分支？"},P023:{concepts:["字典累计","过滤与排序","阈值相等"],approach:"同一个书架的流水可能分散输入，先聚合出最终总量再判断资格。筛选与输出使用统一的阈值并保留指定字典序。",steps:["用书架代号作键，每条记录把数量加到旧值上，首次取 0。","按 sorted(counts) 的顺序查看各键，取总量至少为 minimum 的书架。","没有任何合格键时打印“空”。否则输出每个键及其累计值。"],time:"平均 O(n+k log(k+1)+1)，n 为记录数，k 为不同书架数。",space:"O(k+1)，字典与筛选输出列表按不同书架数存储。",pitfall:"单条归还不达标，累加后仍可能达标。阈值为 0 时只考虑出现过的书架，实际出现且总量为 0 的书架仍应输出。",extension:"如果需要按总量降序并让同量的代号升序，排序键应该怎样写？"},P024:{concepts:["一次扫描","当前连续状态与历史最优","并列取最早"],approach:"每次处理一个读数，维护以它结尾的达标长度与已见的最佳段。仅在变长时更新历史答案，保留并列中最早的一段。",steps:["用 enumerate 生成 1 基位置。达标则将当前长度加一，否则置 0。","当前长度超过 best 时，起点为 index - length + 1，更新起点和长度。","扫描完再输出。如始终未达标，默认仍是 0 0。"],time:"O(n)，每项只比较一次并进行有限状态更新。",space:"计算状态 O(1)，参考代码的 split 另存整行字段 O(n)。",pitfall:"重置当前段时不要归零历史最佳。更新判断写成 >= 会在平局时改变为更晚的段。",extension:"若要输出所有最长达标段的起点，怎样在发现更长时重置答案列表，并避免重复登记？"}},O=[{id:"P063",title:"定位读数表的首个格式错误",difficulty:"入门",tag:"异常调试",description:"读数表从上到下给出，行内从左到右检查。每个单元格本应是可被 Python 的 int 转换的整数文本。报告首个无法转换的单元格位置。",input:"第一行两个整数 r 和 c，表示行数和列数。接下来 r 行，每行 c 个非空字段，以空格分隔。",output:"若存在格式错误，输出该单元格的行号和列号，以空格分隔，均从 1 开始。若无错误，输出“全部有效”。",sample:[`3 3
2 7 -1
0 3.5 9
坏 8 6
`,`2 2
`,"第二行第二列的 3.5 首先无法转换。第三行的错误更晚。"],limits:"0 ≤ r ≤ 40，1 ≤ c ≤ 16。每个字段含 1–12 个非空白字符。应用 Python 3.12 的 int 字符串转换规则。",cases:[[`0 3
`,`全部有效
`],[`1 1
x
`,`1 1
`],[`2 2
-3 +8
000 1_000
`,`全部有效
`],[`1 2
２ ١
`,`全部有效
`],[`2 3
1 2 3
4 5 --6
`,`2 3
`],[`1 3
4e2 -1 x
`,`1 1
`]],hints:["用 enumerate(..., 1) 或从 1 开始的循环保留输入位置。","为当前字段的 int 转换处理 ValueError，找到后可以从搜索函数直接 return。"],solution:`def locate(rows):
    for row in range(1, rows + 1):
        for column, text in enumerate(input().split(), 1):
            try:
                int(text)
            except ValueError:
                return row, column
    return None

rows, columns = map(int, input().split())
found = locate(rows)
if found is None:
    print("全部有效")
else:
    print(*found)`,guide:{concepts:["ValueError","输入顺序与坐标","提前返回"],approach:"按题意的顺序访问字段。第一个失败位置可以立即返回，函数之外只需区分“已找到”和“全部有效”。",steps:["依次读取每行，行号列号都从 1 开始。","逐个尝试 int。转换抛出 ValueError 时交回坐标，后续错误不会覆盖它。","扫描结束没有问题则返回 None。根据结果统一输出。"],time:"最坏 O(T+1)，T 为全部字段和分隔符的字符数。",space:"临时输入占 O(L+1)，L 为最长一行长度，无需保存整张表。",pitfall:"用 isdigit() 会把负号或合法的下划线拒绝。只跳出内层循环仍可能在下一行改掉首个错误位置。",extension:"如果每行只报告本行第一个错误、但还要继续下一行，应该怎样调整退出范围？"}},{id:"P064",title:"检查仓架查询编号",difficulty:"基础",tag:"异常调试",description:"仓架上有一排按 1 到 n 编号的格子。每次收到一行查询，先尝试把整行转换成整数，再验证编号域。只有合法编号才返回格子名称。",input:"第一行 n 和 q。第二行是 n 个格子名称，n 为 0 时该行为空。接下来 q 行，每行是一条原始查询文本，可以为空。",output:"每条查询输出一行。不能被 int 直接转换时输出“编号格式错误”。整数不在 1–n 时输出“编号越界”。否则输出对应名称。",sample:[`3 5
北 东 西
2
0
-1
1.5
+3
`,`东
编号越界
编号越界
编号格式错误
西
`,"0 和 −1 本身是整数，但都超出编号范围。+3 可转换为合法编号。"],limits:"0 ≤ n,q ≤ 200。名称含 1–12 个非空白字符，查询文本长度 0–24。",cases:[[`0 3

1
0
坏
`,`编号越界
编号越界
编号格式错误
`],[`1 4
甲

 1 
2
1 1
`,`编号格式错误
甲
编号越界
编号格式错误
`],[`2 3
甲 乙
01
2
-100
`,`甲
乙
编号越界
`],[`1 0
末
`,""],[`3 2
A B C
-2
000
`,`编号越界
编号越界
`]],hints:["try 中只尝试 int 转换，ValueError 与编号越界分别处理。","只有范围为 1 到 n 才能用 labels[number-1]。Python 负索引能正常读取尾项。"],solution:`n, q = map(int, input().split())
labels = input().split()
for _ in range(q):
    raw = input()
    try:
        number = int(raw)
    except ValueError:
        print("编号格式错误")
    else:
        if 1 <= number <= n:
            print(labels[number - 1])
        else:
            print("编号越界")`,guide:{concepts:["解析与范围分开","1 基编号","负索引误读"],approach:"两种错误属于不同层次。格式能转换后才检查是否是可访问的业务编号，避免依赖列表异常判断范围。",steps:["保存格子名称，按顺序接收 q 条查询。","只在 try 中做整数转换。转换失败给格式提示。","成功后检查 1 ≤ number ≤ n，再转换为 0 基索引。其余整数给范围提示。"],time:"字段长度有上界，O(n+q+1)。",space:"O(n+1)，保存名称数组及正在处理的查询。",pitfall:"只检查 number ≤ n 会把 0 或负数当成合法索引。n 为 0 时仍要读完第二行，避免错把空行当第一条查询。",extension:"如果业务编号不再连续，可以怎样用字典判断编号是否存在？"}},{id:"P065",title:"借用柜库存请求",difficulty:"进阶",tag:"异常调试",description:"借用柜刚开始装满，共有 capacity 件。依次收到借出或归还请求。每条数量须是可转换的正整数。借出后的库存不能低于 0，归还后的库存不能超过容量。一次失败不会改变库存。",input:"第一行整数 capacity 和 q。接下来 q 行，每行是“借 数量”或“还 数量”。数量字段是一个非空文本。",output:"逐条输出结果。数量无法转换成整数或不是正数，输出“数量错误”。若数量合法但库存会超出范围，输出“库存冲突”。成功时输出最新库存。",sample:[`5 7
借 2
借 4
还 两
还 1
还 3
借 0
借 4
`,`3
库存冲突
数量错误
4
库存冲突
数量错误
0
`,"借出 2 后剩 3，拒绝后续两条错误请求。归还 1 后有 4，再借出 4 后为 0。"],limits:"0 ≤ capacity ≤ 10⁶，0 ≤ q ≤ 250。数量字段长度 1–20，用 Python int 转换。",cases:[[`2 0
`,""],[`0 3
借 1
还 1
借 -1
`,`库存冲突
库存冲突
数量错误
`],[`1 4
借 +1
借 1
还 1
还 1
`,`0
库存冲突
1
库存冲突
`],[`3 3
借 2
还 5
借 1
`,`1
库存冲突
0
`],[`3 3
借 1.5
还 -1
借 3
`,`数量错误
数量错误
0
`]],hints:["先走完数量校验。可以写一个函数转换并主动拒绝非正数。","先在单独的变量中计算请求后的库存，验证范围后才赋给当前库存。"],solution:`def quantity(text):
    value = int(text)
    if value <= 0:
        raise ValueError("数量必须为正")
    return value

capacity, q = map(int, input().split())
stock = capacity
for _ in range(q):
    operation, raw = input().split()
    try:
        amount = quantity(raw)
    except ValueError:
        print("数量错误")
        continue
    proposed = stock - amount if operation == "借" else stock + amount
    if not (0 <= proposed <= capacity):
        print("库存冲突")
        continue
    stock = proposed
    print(stock)`,guide:{concepts:["主动拒绝输入","预计算与状态更新","错误后的连续请求"],approach:"验证解析与业务数量后，计算候选库存。通过两道检查才更新真实库存，失败记录不污染下一条请求使用的状态。",steps:["从满柜开始。每次先转换数量并要求为正，捕获 ValueError 后立即处理下一条。","根据借还方向计算 proposed，检查闭区间 0 到 capacity。","通过范围检查后更新 stock，并输出。拒绝时 stock 保持旧值。"],time:"给定数量字段位数上界，共 O(q+1)。",space:"额外空间 O(1)，只保存库存、容量与当前请求。",pitfall:"先修改 stock 再判断范围会污染后续记录。单独写“借”或“还”的上界时也容易漏掉库存正好为 0 或满柜的合法情况。",extension:"若每个用户还有独立借用上限，需要同时验证及更新哪两份状态？"}},{id:"P066",title:"导入旧日志中的整数前缀",difficulty:"进阶",tag:"异常调试",description:"按行导入旧控制台的读数记录。每行跳过开头的 ASCII 空格，可接一个正负号，然后取连续的 ASCII 数字。遇到首个其他字符即结束，忽略后缀。如果一个数字都没读到，标记为缺失。为下游保留范围，将超出 −999 到 999 的值截到最近的端点。",input:"第一行一个整数 n。余下 n 行为原始文本，可以为空。从整行开头开始识别，不在后缀中重新寻找数字。",output:"每行记录对应一行结果。有效记录输出截断后的整数，缺失输出“缺少整数”。最后另起一行输出缺失条数和发生截断的条数，以空格分隔。",sample:[`6
  -1234rpm
+17ms
12 34
--2

00999x
`,`-999
17
12
缺少整数
缺少整数
999
2 1
`,"前缀 -1234 截为 -999。第二个符号或整行为空都使数字缺失。00999 值等于 999，不计为截断。"],limits:"0 ≤ n ≤ 200，每行 0–60 个可打印 ASCII 字符。",cases:[[`0
`,`0 0
`],[`4
   
+ 1
0xA
-0tail
`,`缺少整数
缺少整数
0
0
2 0
`],[`4
+999
+1000
-999
-1000
`,`999
999
-999
-999
0 2
`],[`3
+0003tail
bad-7
0-1
`,`3
缺少整数
0
1 0
`],[`2
-99999999999999999999x
3.14
`,`-999
3
0 1
`]],hints:["用索引跟踪可选符号与连续数字，比较扫描结束位置和数字起点。","缺失由解析函数抛出 ValueError。转换成功再限幅，并比较限幅前后的数值。"],solution:`def integer_prefix(raw):
    text = raw.lstrip(" ")
    start = 1 if text.startswith(("+", "-")) else 0
    end = start
    while end < len(text) and "0" <= text[end] <= "9":
        end += 1
    if end == start:
        raise ValueError("缺少整数前缀")
    return int(text[:end])

missing = adjusted = 0
for _ in range(int(input())):
    raw = input()
    try:
        value = integer_prefix(raw)
    except ValueError:
        missing += 1
        print("缺少整数")
    else:
        clipped = max(-999, min(999, value))
        if clipped != value:
            adjusted += 1
        print(clipped)
print(missing, adjusted)`,guide:{concepts:["前缀语法","精确扫描终点","单行异常与汇总"],approach:"先确定前缀在哪里结束，再把截取的纯整数文本交给 int。缺失是解析失败，截断是成功后的业务规则。分别统计能保持含义清楚。",steps:["跳过行首 ASCII 空格。若有符号则让数字起点向后移一格。","只扫描连续数字。结束点等于起点说明连一位数字都没有，抛出异常。否则前缀连同符号一起转换。","外层计缺失或限幅。仅当值真正改变才计一次截断，最后输出两项统计。"],time:"O(T+1)，T 为全部文本长度（含换行），整数前缀长度不超过 60。",space:"额外空间 O(L+1)，L 为最长的输入行。",pitfall:"不能直接对整行 int，也不能用 value == 0 识别缺失。只允许一个前置符号，出现内部空格就结束数字扫描。",extension:"如果要在后缀中附带一个受限单位，怎样区分缺失整数、缺失单位和未知单位？"},origin:{kind:"adapted",platform:"LeetCode",title:"String to Integer (atoi)",id:"8",level:"原题 Medium",url:"https://leetcode.com/problems/string-to-integer-atoi/description/",concepts:["前缀数字扫描","可选符号","结果限幅"],adaptation:"原题转换一个字符串，缺少数字返回 0，并使用 32 位有符号整数范围。本题批量导入日志，独立报告缺失与截断，使用不同范围并重写题面、样例及用例。"}},{id:"P067",title:"制作展览资料袋",difficulty:"入门",tag:"综合应用",description:"有三种展览材料，每袋需要固定数量。有的材料可选，即每袋用量为 0。求至多能制作多少个完整资料袋，以及制作后各类材料还剩多少。",input:"第一行三个整数 a、b、c，表示三种材料的库存。第二行三个整数 x、y、z，表示每袋所需的对应数量。",output:"第一行输出最大完整袋数，第二行按输入顺序输出三种材料的剩余数量，以空格分隔。",sample:[`12 7 4
3 2 0
`,`3
3 1 4
`,"第一种材料最多够 4 袋，第二种最多够 3 袋。第三种不用，不限制袋数。"],limits:"0 ≤ a,b,c,x,y,z ≤ 10⁹。x、y、z 中至少一个为正。",cases:[[`0 9 5
1 0 2
`,`0
0 9 5
`],[`3 0 100
0 0 2
`,`50
3 0 0
`],[`10 10 10
2 2 2
`,`5
0 0 0
`],[`0 1000000000 1
0 1 0
`,`1000000000
0 0 1
`],[`2 3 4
5 1 1
`,`0
2 3 4
`]],hints:["对每种用量为正的材料，库存整除单袋用量，得到它能支持的袋数。","选出最小的支持数量，再按实际制作袋数计算各类余量。"],solution:`stock = list(map(int, input().split()))
needs = list(map(int, input().split()))
limits = []
for index in range(3):
    if needs[index] > 0:
        limits.append(stock[index] // needs[index])
bags = min(limits)
left = [stock[index] - bags * needs[index] for index in range(3)]
print(bags)
print(*left)`,guide:{concepts:["整除得上限","最紧约束","零用量条件"],approach:"每项必需材料独立给出一个上限。要同时满足所有用量，最多只能达到这些上限中最小的一个。可选材料用量为 0，不提供上限。",steps:["分别读出库存和单袋用量，位置一一对应。","只对用量为正的项做整除并取最小值。题目保证至少有一项可计算。","每项库存减去袋数乘用量。用量为零的材料余量等于本来库存。"],time:"三类材料固定，O(1)。推广到 k 类需要 O(k)。",space:"固定三类时 O(1)，推广后参考写法额外存 O(k) 个数。",pitfall:"取最大上限只满足供应最宽松的材料，可能用超库存。套用整除前跳过用量 0，避免零除。",extension:"如果每袋有两种配方可选，能否直接比较两种配方各自的最大值？能混用时还要考虑哪些组合？"}},{id:"P068",title:"记录接驳请求的冷却时间",difficulty:"基础",tag:"综合应用",description:"接驳系统按时间收到请求。对每个编号独立处理，第一次请求总是接受。此后仅当距离该编号最近一次被接受的请求至少 k 个时间单位时才接受。拒绝的请求不改变冷却起点。同一时刻的多条请求按输入顺序处理。",input:"第一行两个整数 n 和 k。接下来 n 行，每行一个时间和一个编号，以空格分隔。时间非递减。",output:"第一行输出接受数与拒绝数。第二行按输入顺序输出已接受记录的行号（不计首行，从 1 开始），用空格分隔。没有已接受的请求时输出“空”。",sample:[`7 5
0 a
1 a
1 b
4 a
5 a
6 b
6 a
`,`4 3
1 3 5 6
`,"a 的 1 和 4 被拒，不会推迟下一次接受时间。第 5 条距 a 上次接受恰好为 5。b 独立计时。"],limits:"0 ≤ n ≤ 1000，0 ≤ k、时间 ≤ 10⁹。编号为 1–12 个小写英文字母或 ASCII 数字。",cases:[[`0 0
`,`0 0
空
`],[`3 0
8 a
8 a
8 a
`,`3 0
1 2 3
`],[`3 2
0 a
0 b
0 a
`,`2 1
1 2
`],[`4 4
0 a
2 a
4 a
8 a
`,`3 1
1 3 4
`],[`3 1000000000
0 a
999999999 a
1000000000 a
`,`2 1
1 3
`]],hints:["字典按编号保存最近一次被接受的时间。","只有接受时才更新字典，并记下当前记录的行号。0 是合法时间。"],solution:`n, cooldown = map(int, input().split())
last_accepted = {}
accepted = []
for number in range(1, n + 1):
    time_text, code = input().split()
    time = int(time_text)
    if code not in last_accepted or time - last_accepted[code] >= cooldown:
        last_accepted[code] = time
        accepted.append(number)
print(len(accepted), n - len(accepted))
if accepted:
    print(*accepted)
else:
    print("空")`,guide:{concepts:["按编号独立的状态","状态只在有效事件时更新","相等边界"],approach:"用字典维护已扫描记录中每个编号最后一次被接受的时间。当前请求只依赖它自己的历史，拒绝时无需写入。",steps:["按行号逐条读取请求。没有历史时直接接受。","有历史时比较当前时间减历史时间是否至少为 k，满足条件才更新字典。","接受时附加行号，最后用总数减接受数得到拒绝数。"],time:"编号长度有上界，平均 O(n+1)，逐条查找和追加。",space:"O(u+a+1)，u 为已接受的不同编号数，a 为接受记录数。",pitfall:"拒绝后也更新会推迟下一次允许的时刻。使用 if not last_accepted.get(code) 会混淆时间 0 与没见过。",extension:"如果每个编号各有一个冷却时长，除了最后接受时间还需准备怎样的查询表？"}},{id:"P069",title:"精确装车的最低费用方案",difficulty:"进阶",tag:"综合应用",description:"装车需要恰好达到指定重量，可选甲、乙两种整箱货物。每类箱子有单箱重量、费用和可用数量。选择总费用最低的方案。总费用并列时选择甲箱更少的方案。",input:"第一行一个整数 target。接下来两行分别是甲、乙的重量、费用、可用箱数，每行三个整数。",output:"有方案时依次输出甲箱数、乙箱数和总费用，用空格分隔。没有方案时输出“无方案”。",sample:[`12
4 5 3
3 3 4
`,`0 4 12
`,"三箱甲或四箱乙都能达到 12。费用分别为 15 和 12，选择后者。"],limits:"0 ≤ target ≤ 10⁹，单箱重量为 1–10⁶，单箱费用为 0–10⁹，可用箱数为 0–10⁴。",cases:[[`0
4 1 0
3 1 10
`,`0 0 0
`],[`11
4 1 1
5 1 1
`,`无方案
`],[`12
4 4 3
3 3 4
`,`0 4 12
`],[`7
2 7 2
3 3 3
`,`2 1 17
`],[`6
2 0 3
3 0 2
`,`0 2 0
`],[`1000000000
1000000 999999999 1000
1 1 5
`,`1000 0 999999999000
`]],hints:["枚举甲箱数，计算剩余重量。乙箱数只有在剩余重量可整除时才确定。","排除乙库存不足的方案，再用 (总费用, 甲箱数) 作为优先级。"],solution:`target = int(input())
a_weight, a_cost, a_stock = map(int, input().split())
b_weight, b_cost, b_stock = map(int, input().split())
best = None
for a in range(min(a_stock, target // a_weight) + 1):
    remaining = target - a * a_weight
    b, remainder = divmod(remaining, b_weight)
    if remainder or b > b_stock:
        continue
    option = (a * a_cost + b * b_cost, a, b)
    if best is None or option < best:
        best = option
if best is None:
    print("无方案")
else:
    cost, a, b = best
    print(a, b, cost)`,guide:{concepts:["约束化枚举","divmod","多字段最优方案"],approach:"每个可行方案对应一个合法甲箱数。甲箱数固定后，重量等式至多允许一个乙箱数。用除法验证它，就不必枚举所有甲乙组合。",steps:["甲箱数从 0 枚举到库存和目标重量允许的上界。","剩余重量除以乙重量。余数非零或需要乙箱超过库存就丢弃。","按 (费用, 甲箱数, 乙箱数) 保留最小元组。对固定甲箱数乙箱数唯一，所以第三项不影响规则。"],time:"O(A+1)，A 是实际枚举的最大甲箱数。候选计算使用固定次数的整数运算。",space:"额外空间 O(1)，只保存一个最优候选。",pitfall:"只用整除商、不检查余数会得到偏轻的方案。用数值 0 当作“没有方案”会混淆零费用的有效方案。",extension:"若还有第三种箱子，推导最后一种数量依然可行吗？前两种最多要枚举多少组合？"}},{id:"P070",title:"归并两份有序领件清单",difficulty:"进阶",tag:"综合应用",description:"两处领件台各有一份按时间非递减排列的日志。相同时间可能出现多条记录。将两份清单归并成按时间升序的报表，每个出现过的时间只占一行，同时报告两处各自的记录数。",input:"第一行两个整数 n 和 m。第二行 n 个时间，第三行 m 个时间，各自用空格分隔。长度为 0 时对应那一行为空。",output:"每个时间一行，依次输出时间、第一份清单中的次数、第二份清单中的次数，以空格分隔。两份都为空时输出“空”。",sample:[`5 4
0 2 2 7 7
2 3 7 8
`,`0 1 0
2 2 1
3 0 1
7 2 1
8 0 1
`,"时间 2 在第一份出现两次，在第二份出现一次。时间 0 只出现在第一份。"],limits:"0 ≤ n,m ≤ 1000，时间是 0–10⁹ 的整数。两行均按非递减顺序给出。",cases:[[`0 0


`,`空
`],[`0 3

1 1 8
`,`1 0 2
8 0 1
`],[`4 0
0 0 0 1

`,`0 3 0
1 1 0
`],[`3 4
9 9 9
9 9 9 9
`,`9 3 4
`],[`2 3
10 1000000000
0 3 5
`,`0 0 1
3 0 1
5 0 1
10 1 0
1000000000 1 0
`]],hints:["维护两个未处理位置。只要还剩数据，取两侧当前值中较小的一个。","同一个时间可能在两侧都有连续重复项。先把两边这一时间的所有项读完，再输出一行。"],solution:`n, m = map(int, input().split())
first = list(map(int, input().split()))
second = list(map(int, input().split()))
if n == m == 0:
    print("空")
i = j = 0
while i < n or j < m:
    if j == m or (i < n and first[i] <= second[j]):
        time = first[i]
    else:
        time = second[j]
    start_i, start_j = i, j
    while i < n and first[i] == time:
        i += 1
    while j < m and second[j] == time:
        j += 1
    print(time, i - start_i, j - start_j)`,guide:{concepts:["双指针","连续相等组","单边读尽"],approach:"两个列表已经有序，各自的未读头一定不大于后边的项。每轮取最小可用时间，分别消费两侧和它相等的一组。直接归并只需线性扫描。",steps:["读入两行，即使某行没有时间。两个指针分别表示第一项尚未处理的位置。","只在索引存在时比较。某侧已经读完则让另一侧决定下一时间。","分别把指针移过所有相等时间，移动距离就是该侧次数。打印一行后继续。"],time:"O(n+m+1)，两个指针总共各前进 n 和 m 次。",space:"输入数组占 O(n+m+1)，归并过程额外空间 O(1)。",pitfall:"循环用 and 会在一侧用尽时漏报另一侧。每次只移动一个相等项会为同一个时间输出多行。",extension:"若输入是两个文件的有序记录流，如何改写为只保留两侧各一个未处理值？"},origin:{kind:"adapted",platform:"LeetCode",title:"Merge Sorted Array",id:"88",level:"原题 Easy",url:"https://leetcode.com/problems/merge-sorted-array/description/",concepts:["归并已排序数据","双指针","扫描剩余项"],adaptation:"原题把两个数组归并到预留空间的第一个数组。本题通过标准输入读取两个日志，归并时按时间分组并分别计数，重写情境、样例及用例。"}}],n=`count = int(input())
total = 0
for _ in range(count):
    people_text, items_text = input().split()
    try:
        people = int(people_text)
        items = int(items_text)
    except ValueError:
        print("格式错误")
        continue
    each = items // people
    print(each)
    total += each
print("合计", total)
`,t=`def quote(weight, zone):
    price = 6 if zone == "L" else 10
    if weight > 1:
        price += (weight - 1) * 2
    return price
`,A=[{id:"P071",title:"借阅单字段重排",difficulty:"基础",tag:"输入输出",outputComparison:"exact",description:"馆员按录入顺序提交资料，打印机要求改变字段顺序。原样保留每个字段，包括编号前导零、姓名与备注中的空格。",input:"四行依次是编号、读者姓名、备注、柜号。备注可以是空行，也可以只有空格。",output:"第一行为柜号、竖线和编号，第二行为方括号内的姓名，第三行为「备注：」紧接备注。保留原有空格。",limits:"编号由 1–12 个数字组成。姓名和柜号非空，每个文本字段至多 40 个字符，均不含换行。",sample:[`007
李 小禾
备用钥匙
C3
`,`C3|007
[李 小禾]
备注：备用钥匙
`,"第四个字段先输出，编号仍为三位。"],cases:[[`000
阿 乔

A
`,`A|000
[阿 乔]
备注：
`,{note:"空备注仍须占据输入和输出约定的位置。"}],[`0040
林  晓
  
Z9
`,`Z9|0040
[林  晓]
备注：  
`,{note:"识别把空格当空栏清理或把编号当整数的实现。"}],[`8
  东 区
借书  
北
`,`北|8
[  东 区]
备注：借书  
`]],hints:["先把四行各用一个名字接住。","按题面顺序分别输出。用 sep 或 f-string 控制标点旁的间隔。"],solution:`code = input()
name = input()
note = input()
cabinet = input()
print(cabinet, code, sep="|")
print(f"[{name}]")
print(f"备注：{note}")
`,guide:{concepts:["字段重排","前导零","原文空白"],approach:"先建立四个名字与输入行的映射。输出次序与读取次序分别按题面处理。",steps:["逐行读取四个字符串。","用编号和柜号组合第一行。","给姓名和备注套固定模板，原值不做清理。"],time:"O(L)，L 为文本总长。",space:"O(L)，保留四个字段。",pitfall:"int 会丢失前导零，strip 会丢失备注尾部空格。",extension:"把柜号改到末行，哪些读取仍应保留原顺序？"}},{id:"P072",title:"双车标签并排印刷",difficulty:"基础",tag:"输入输出",outputComparison:"exact",description:"两辆接驳车各有一张标签。按字段做两行对照表，中间留一行供工作人员手写。",input:"四行依次为甲车编号、甲车站名、乙车编号、乙车站名。任何一个站名可以为空。",output:"首行是「[甲编号] / [乙编号]」。第二行为空行。第三行为「甲站名 → 乙站名」。方括号贴合编号，斜杠和箭头两边都保留一个空格。",limits:"编号为 1–8 位数字，按文本处理。站名最多 30 个字符，可含内部空格。",sample:[`002
东 广场
009
北门
`,`[002] / [009]

东 广场 → 北门
`,"先配对编号，再配对站名，中间有一行空行。"],cases:[[`001

000
终点
`,`[001] / [000]

 → 终点
`],[`11
海  湾
7

`,`[11] / [7]

海  湾 → 
`,{note:"乙站为空时，箭头后仍有一个空格。"}],[`0

0

`,`[0] / [0]

 → 
`]],hints:["先画输入四行到输出三行的连线。","可用 end 让编号的两次打印接在一起，再用独立 print() 产生空行。"],solution:`first = input()
left = input()
second = input()
right = input()
print(f"[{first}]", end=" / ")
print(f"[{second}]")
print()
print(left, right, sep=" → ")
`,guide:{concepts:["输出拼接位置","end 与 sep","中间空行"],approach:"同一行由两个编号字段构成，空行由独立调用产生，站名之间固定插入分隔符。",steps:["按车读取编号与站名，不转换编号。","首个输出不换行，第二个补全编号行。","打印空行，再用 sep 把两个站名放在一行。"],time:"O(L)。",space:"O(L)，L 为输入字符数。",pitfall:"空站名仍需 input 一次，也不能省去分隔符旁的空格。",extension:"如何让两个站名各占一行，同时保留两辆车的编号对照？"}},{id:"P073",title:"步道铺设面积显示",difficulty:"基础",tag:"变量与运算",description:"每块相同垫板覆盖给定面积，求铺设若干块的总面积并显示两位小数。",input:"一行两个字段，单块面积 a 和块数 n。a 是十进制小数字符串，n 是整数。",output:"一行总面积，固定显示两位小数。四舍六入，恰好居中时取末位偶数，例如 0.125 显示为 0.12，0.375 显示为 0.38。",limits:"0 ≤ a ≤ 128，a 为 0.125 的整数倍。0 ≤ n ≤ 100。所用面积和乘积都可由 Python float 精确表示。",sample:[`1.125 2
`,`2.25
`,"先求 1.125×2，再按两位小数显示。"],cases:[[`1.5 2
`,`3.00
`,{note:"直接打印 float 会丢掉一个补零。"}],[`5.125 0
`,`0.00
`],[`0.125 1
`,`0.12
`],[`0.375 1
`,`0.38
`],[`0.125 3
`,`0.38
`,{note:"先舍入单块再相乘会得到 0.36。"}],[`127.875 100
`,`12787.50
`]],hints:["两字段用途不同，逐项转换。","先乘，再用 f-string 的 :.2f 格式，不提前改变单块面积。"],solution:`area_text, count_text = input().split()
total = float(area_text) * int(count_text)
print(f"{total:.2f}")
`,guide:{concepts:["小数文本转换","混合数值运算","显示精度"],approach:"将显示步骤放在计算之后。本题选用二进制可精确表示的八分之一刻度，居中行为可手算。",steps:["拆出两个文本字段。","float 转面积、int 转块数，计算总面积。","格式化为两位小数，居中时取偶数末位。"],time:"O(1)，固定个数的有界输入。",space:"O(1)。",pitfall:"先格式化单块面积再相乘会改变计算结果。",extension:"如果输入允许任意分币值，比较整数最小单位和 Decimal 的选择。"}},{id:"P074",title:"多仓批次停表",difficulty:"基础",tag:"循环",description:"按顺序接收多仓访问量。一批第一次遇到 -1 或加入当前量会超过额度时，当前及余下记录都不计，但仍要读完整批，才到下一批。",input:"首行批次数 b。每批先一行长度 n 和额度 cap，再给 n 行访问量 v。-1 是停表标记。",output:"每批一行，输出计入的记录数和累计量。累计量恰好等于额度时，当前记录仍可计入。",limits:"1 ≤ b ≤ 20，0 ≤ n ≤ 30，0 ≤ cap ≤ 30000，-1 ≤ v ≤ 999。总输入不超过 621 行。",sample:[`2
4 10
3
8
1
2
3 4
4
0
-1
`,`1 3
2 4
`,"第一批加上 8 会超限，后续虽小也不再纳入。第二批恰好达限后还能计入 0。"],cases:[[`3
0 9
3 10
-1
3
4
1 8
8
`,`0 0
0 0
1 8
`,{note:"零批内长度、首项停表与下一批重置。"}],[`2
2 1
2
0
2 0
0
1
`,`0 0
1 0
`,{note:"超限后的小值也不得计入，零额度允许计入零值。"}],[`2
4 5
1
-1
-1
20
1 7
7
`,`1 1
1 7
`,{note:"重复停表不能恢复累计，也不能读错下批行数。"}]],hints:["外层遍历批次，内层固定读取 n 行。","将是否还累计放在布尔状态里，每批重置。"],solution:`for _ in range(int(input())):
    remaining, cap = map(int, input().split())
    accepted = 0
    total = 0
    stopped = False
    for i in range(remaining):
        value = int(input())
        if value == -1 or total + value > cap:
            stopped = True
        if not stopped:
            total += value
            accepted += 1
    print(accepted, total)
`,guide:{concepts:["嵌套循环","输入对齐","停止状态"],approach:"输入读指针按协议推进，累计状态只控制是否加上已读数据。",steps:["每批从长度、额度、两个统计量和停表状态开始。","始终读 n 次，先判断是否遇到标记或超限，成功时一并更新数目和总量。","批次结束才输出，下一批重新初始化。"],time:"O(b+Σn)。",space:"O(1)，无需保存记录列表。",pitfall:"在内层调用 break 会把余下数据当成下一批长度。",extension:"每批有两种独立指标时，为它们分别维护停表标记。"}},{id:"P075",title:"更新与撤销领用登记",difficulty:"基础",tag:"字典",description:"维护按首次登记顺序展示的领用台账。修改已存在编号保留其位置，撤销后重新登记排在末尾。登记为 0 仍算存在。",input:"第一行操作数 n。后续每行为 set 编号 数量 或 drop 编号。drop 缺失编号时保持原表。",output:"按当前登记顺序输出「编号 数量」，最后一行输出「合计 总数」。空表只输出合计 0。",limits:"0 ≤ n ≤ 100，编号为 1–10 个 ASCII 字母或数字，0 ≤ 数量 ≤ 1000。",sample:[`6
set A 4
set B 0
set A 5
drop A
set A 2
drop X
`,`B 0
A 2
合计 2
`,"B 的零值保留，A 撤销后排到 B 后面。"],cases:[[`0
`,`合计 0
`],[`3
set Z 0
drop Z
drop Z
`,`合计 0
`],[`4
set B 2
set A 3
set B 0
set A 1
`,`B 0
A 1
合计 1
`,{note:"更新不换顺序，旧值不能继续计入。"}],[`5
set B 1
set A 2
drop B
set C 5
set B 3
`,`A 2
C 5
B 3
合计 10
`]],hints:["把编号作为键，set 使用赋值覆盖。","drop 用 in 先查键。最后遍历 items，合计使用当前 values。"],solution:`records = {}
for _ in range(int(input())):
    fields = input().split()
    action, code = fields[:2]
    if action == "set":
        records[code] = int(fields[2])
    elif code in records:
        del records[code]
for code, quantity in records.items():
    print(code, quantity)
print("合计", sum(records.values()))
`,guide:{concepts:["覆盖与撤销","插入顺序","汇总当前状态"],approach:"字典同时保存当前值与登记顺序，撤销时删除键本身。",steps:["逐条读操作，set 改写该键。","drop 只在存在时删除。","按 items 的顺序输出并用 values 重新求和。"],time:"O(n)，在正常字典操作成本下。",space:"O(k)，k 为同时存在的编号数。",pitfall:"用 if records.get(code) 会忽略存在但数值为零的编号。",extension:"若报告还要显示已撤销次数，需要在当前表之外保存什么？"}},{id:"P076",title:"实现箱数计算函数",difficulty:"基础",tag:"函数",description:"给多个发货流程复用同一个箱数函数。每组会在同一解释器中调用它多次，每次只依赖传入参数。",input:"提交 main.py 中的 crate_count(items, capacity)，参数依次为物品数和每箱容量。评测直接传入整数。",output:"返回所需最少整箱数（int）。物品数为 0 时返回 0。接口调用期间保持标准输入、输出和错误输出安静。",limits:"0 ≤ items ≤ 10000，1 ≤ capacity ≤ 10000。",contract:{kind:"function",files:["main.py"],target:{module:"main",name:"crate_count"}},starterFiles:[{name:"main.py",content:`def crate_count(items, capacity):
    # 返回最少箱数
    pass
`}],sample:["","","10 件每箱 4 件要 3 箱，8 件恰好 2 箱。",{calls:[{args:[10,4],expected:3},{args:[8,4],expected:2}]}],cases:[["","",{calls:[{args:[0,9],expected:0},{args:[1,9],expected:1}]}],["","",{calls:[{args:[5,2],expected:3},{args:[9,3],expected:3},{args:[5,2],expected:3}],note:"重复调用检验无残留状态。"}],["","",{calls:[{args:[1e4,1],expected:1e4},{args:[9999,1e4],expected:1}]}]],hints:["先算装满箱数和余量。","有余量多一箱，用 return 交给调用者。"],solution:`def crate_count(items, capacity):
    full, extra = divmod(items, capacity)
    if extra:
        full += 1
    return full
`,guide:{concepts:["函数签名","返回值","重复调用"],approach:"函数只做计算。先分完整箱子和剩余物品，再决定是否增加箱数。",steps:["调用者直接传两个整数。","用 divmod 分开商和余数。","余数非零才加一。每次用 return 返回整数。"],time:"每次 O(1)。",space:"O(1)。",pitfall:"print 只写标准输出，函数仍返回 None。把箱数保存在共享变量也会影响随后调用。",extension:"让调用者一次核对多个订单，总箱数是否一定等于合并物品再算一次？"}},{id:"P077",title:"拆分包裹报价入口",difficulty:"基础",tag:"模块",description:"将定价函数放进辅助模块，入口负责读入与打印。L 区首千克 6 元，R 区首千克 10 元，每超出 1 千克加 2 元。",input:"提交 main.py 与 parcel.py。main.py 读取一行整数 weight 和区域 zone。parcel.py 提供 quote(weight, zone)。",output:"入口输出整数运费。quote 返回同样的整数。导入 parcel 或调用 quote 时不读标准输入、不打印。",limits:"1 ≤ weight ≤ 1000，zone 为 L 或 R。",contract:{kind:"module",files:["main.py","parcel.py"],target:{module:"parcel",name:"quote"}},starterFiles:[{name:"main.py",content:`# 导入报价函数，在 main() 中读取、调用并输出
`},{name:"parcel.py",content:`def quote(weight, zone):
    # 返回整数报价
    pass
`}],sample:[`3 R
`,`14
`,"R 区 10 元，加 2 千克的附加费 4 元。",{calls:[{args:[3,"R"],expected:14},{args:[1,"L"],expected:6}]}],cases:[[`1 R
`,`10
`,{calls:[{args:[1,"R"],expected:10},{args:[2,"L"],expected:8}]}],[`2 L
`,`8
`,{calls:[{args:[2,"L"],expected:8},{args:[2,"R"],expected:12}]}],[`1000 L
`,`2004
`,{calls:[{args:[1e3,"L"],expected:2004}]}]],hints:["parcel.py 只定义接受值和返回结果的函数。","在 main.py 导入 quote，然后读一行并将重量转为整数。"],solution:`from parcel import quote

def main():
    text, zone = input().split()
    print(quote(int(text), zone))

if __name__ == "__main__":
    main()
`,solutionFiles:[{name:"parcel.py",content:t}],guide:{concepts:["导入与调用","入口职责","导入安静"],approach:"让辅助模块保存定价规则，入口完成协议。先直接核对函数，再核对入口。",steps:["在 parcel 计算首价与超重费并返回。","main 导入 quote 并读入两个字段。","调用函数只输出一个报价；独立导入时不读取数据。"],time:"每次 O(1)。",space:"O(1)。",pitfall:"把读取或打印写在 parcel 顶层会在导入阶段产生副作用。",extension:"为 parcel 添加只在直接运行时执行的自测。"}},{id:"P078",title:"把新签收行追加到日志",difficulty:"入门",tag:"文件读写",description:"两份 UTF-8 文本随每组测试提供。把 incoming.txt 中的每一行原样追加到已有的 journal.txt，报告追加的行数。",input:"无需标准输入。评测提供 journal.txt 与 incoming.txt，两份文件可为空。文件非空时每行以 LF 结束。",output:"输出追加行数。运行结束时原 journal.txt 的内容仍在，新记录接在后面。含空格的记录与空行原样保留。",limits:"每个文件 0–40 行，共不超过 8192 字节。保留 UTF-8 原文及结束换行。",contract:{kind:"file",files:["main.py"]},sample:["",`2
`,"旧记录不动，追加中文新记录和一个空行。",{fixtures:[{name:"journal.txt",content:`早班已签
`},{name:"incoming.txt",content:`李 乔

`}],artifacts:[{name:"journal.txt",content:`早班已签
李 乔

`}]}],cases:[["",`0
`,{fixtures:[{name:"journal.txt",content:`原文  
`},{name:"incoming.txt",content:""}],artifacts:[{name:"journal.txt",content:`原文  
`}],note:"空输入不能清空旧文件。"}],["",`3
`,{fixtures:[{name:"journal.txt",content:""},{name:"incoming.txt",content:`东门
 西门 
东门
`}],artifacts:[{name:"journal.txt",content:`东门
 西门 
东门
`}]}],["",`1
`,{fixtures:[{name:"journal.txt",content:`前值
`},{name:"incoming.txt",content:`  
`}],artifacts:[{name:"journal.txt",content:`前值
  
`}]}]],hints:["用 a 模式打开已有日志来追加。","for line in source 取到的行已经含有换行，可以直接写。"],solution:`count = 0
with open("incoming.txt", encoding="utf-8") as source:
    with open("journal.txt", "a", encoding="utf-8", newline="") as target:
        for line in source:
            target.write(line)
            count += 1
print(count)
`,guide:{concepts:["UTF-8 文件","追加与覆盖","空白原样传递"],approach:"保留已存在的前缀，只向文件末尾写入读到的原行。计数器跟踪成功追加的记录数量。",steps:["确认当前目录中的两个文件名。","逐行读取，将原行写入以 a 模式打开的日志。","退出 with 后输出计数，并在本次产物中核对原前缀。"],time:"O(B)，B 为新文件字节数。",space:"O(L)，L 为最长输入行。",pitfall:"用 w 会先清空旧日志，打印正确计数也弥补不了文件错误。",extension:"怎样记录一条新日志的序号，同时保留全部已有行？"}},{id:"P079",title:"导出待复核的 CSV 记录",difficulty:"进阶",tag:"文件读写",description:"从 stock.csv 读取两列「名称,数量」，将数量为 0 的原记录按原顺序写入 review.csv。保留名称内的逗号、引号和重复记录。",input:"无需标准输入。测试提供 UTF-8 的 stock.csv，含固定表头「名称,数量」，字段采用 Python csv 模块的默认引用方式。",output:"输出入选记录数。必须创建 UTF-8 review.csv，先写相同表头，再写筛选结果。文件行尾为 LF，末行也有 LF，使用最小引用规则。",limits:"0–35 条记录，名称非空且不含换行。数量为 0–999 的整数。输入文件不超过 8192 字节。",contract:{kind:"file",files:["main.py"]},sample:["",`2
`,"带逗号与双引号的同名记录均入选，非零项目不写。",{fixtures:[{name:"stock.csv",content:`名称,数量
"瓶,""大""",0
绳,1
"瓶,""大""",0
`}],artifacts:[{name:"review.csv",content:`名称,数量
"瓶,""大""",0
"瓶,""大""",0
`}]}],cases:[["",`0
`,{fixtures:[{name:"stock.csv",content:`名称,数量
`}],artifacts:[{name:"review.csv",content:`名称,数量
`}],note:"没有记录也产生含表头的文件。"}],["",`2
`,{fixtures:[{name:"stock.csv",content:`名称,数量
甲,0
乙,0
甲,1
`}],artifacts:[{name:"review.csv",content:`名称,数量
甲,0
乙,0
`}]}],["",`0
`,{fixtures:[{name:"stock.csv",content:`名称,数量
甲,3
乙,1
`}],artifacts:[{name:"review.csv",content:`名称,数量
`}]}]],hints:['用 csv.reader 读取字段。打开两个文件时都指定 newline=""。','先读取与写出表头，再逐行筛选。writer 用 lineterminator="\\n"。'],solution:`import csv

count = 0
with open("stock.csv", encoding="utf-8", newline="") as source:
    with open("review.csv", "w", encoding="utf-8", newline="") as target:
        reader = csv.reader(source)
        writer = csv.writer(target, lineterminator="\\n")
        writer.writerow(next(reader))
        for name, quantity in reader:
            if int(quantity) == 0:
                writer.writerow([name, quantity])
                count += 1
print(count)
`,guide:{concepts:["CSV 引用","UTF-8 产物","保序筛选"],approach:"让 csv 负责字段解析和转义，程序只判断数量是否为零。使用固定表头保证空结果也可打开。",steps:["用 reader 取得表头并写入。","按顺序遍历每行，对数量做整数比较。","用 writer 写入合格原字段并计数。"],time:"O(B)，B 为输入字符数。",space:"O(L)，L 为最长记录。",pitfall:"按逗号拆分会切碎引用字段，按名字去重也会遗失记录。",extension:"如果表头顺序可变，如何根据列名定位数量列？"}},{id:"P080",title:"修复值班分箱统计",difficulty:"基础",tag:"异常调试",description:"起始程序会在混有零人数的记录中崩溃。保留能处理的记录和原有错误分类，修复后继续处理剩余记录。",input:"第一行记录数 q，随后 q 行各含人数与物品数的两个字段。字段可能含无法转换为整数的文本。",output:"任一字段转换失败输出「格式错误」，优先于人数判断。两字段都是整数且人数为零时输出「无接收人」。其余输出物品整除人数的值。末行输出「合计 总数」，只合计成功记录。",limits:"0 ≤ q ≤ 50。能转换的字段是 0–1000 的整数；每行恰有两个字段。",starterFiles:[{name:"main.py",content:n}],sample:[`3
2 6
0 8
1 2
`,`3
无接收人
2
合计 5
`,"用起始代码先运行，查看 ZeroDivisionError 和除法行，再检查零值后的最后一条记录。"],cases:[[`4
0 坏值
0 9
1 9
2 1
`,`格式错误
无接收人
9
0
合计 9
`,{note:"格式错误优先，人数 1 与零得数仍属合法，后续继续执行。"}],[`3
1 0
坏值 5
3 7
`,`0
格式错误
2
合计 2
`],[`0
`,`合计 0
`]],hints:["先运行起始程序，沿诊断定位到整数除法。","在两个字段转换成功之后、除法之前处理零人数，继续下一轮。"],solution:n.replace("    each = items // people",`    if people == 0:
        print("无接收人")
        continue
    each = items // people`),guide:{concepts:["复现与定位","分层校验","失败后继续"],approach:"异常类型 ZeroDivisionError 指向除数问题。故障输入的人数为 0，而不是 int 无法解析。",steps:["跑样例，查看异常末行和跳转位置，确认出错前已打印 3。","保持 try 的转换保护范围，在转换之后对 0 分支跳过除法与累计。","复跑原故障，再用 1 和 0 加无效物品文本验证邻值、优先级及后续成功记录。"],time:"O(q)。",space:"O(1)，只保存当前记录和合计。",pitfall:"先判断人数是否为零会遮住另一字段的格式错误。捕获后不继续或仍更新合计也会破坏结果。",extension:"支持负数时，空组、非法业务值和格式错误分别应如何提示？"}}],B=[{id:"P081",title:"夜场巡检发车牌",difficulty:"基础",tag:"变量与运算",practice:{tier:"入门迁移",prerequisites:"第 1–3 课，整数商余与 f-string。",primary:["向上取整","钟面取模"],secondary:["字段解包","补零"]},description:"已知巡检组到达的钟面时刻、路程、每分钟速度和出发前准备分钟数。计算在整分钟开始准备的最晚钟面时刻。",input:"一行五个整数 h m distance speed setup，依次是目的时刻的小时、分钟、路程、速度、准备分钟数。",output:"一行 HH:MM。两个字段均补零至两位。可跨午夜。",limits:"0≤h≤23，0≤m≤59，0≤distance≤6000，1≤speed≤200，0≤setup≤60。行程加准备不超过 1440 分钟。",sample:[`0 5 100 30 7
`,`23:54
`,"路程占 4 分钟，算上准备需提前 11 分钟。00:05 向前 11 分钟是前日 23:54。"],cases:[[`8 0 360 60 4
`,`07:50
`,{note:"整除时不能多算一分钟。"}],[`0 0 0 5 0
`,`00:00
`],[`0 5 5 2 2
`,`00:00
`],[`1 9 1440 1 0
`,`01:09
`,{note:"恰好提前一整天时钟面相同。"}]],hints:["先算整分钟路程，加上准备。","将目的时刻写成当天分钟数，减去总用时后对 1440 取余。"],solution:`hour, minute, distance, speed, setup = map(int, input().split())
travel = (distance + speed - 1) // speed
clock = (hour * 60 + minute - travel - setup) % 1440
hour, minute = divmod(clock, 60)
print(f"{hour:02d}:{minute:02d}")
`,guide:{concepts:["整分钟向上取整","负数取模","数字格式"],approach:"把时刻和时长统一为分钟。先从目的时刻减用时，再还原到一日钟面。",steps:["用正速度将路程向上取整。","目的分钟数减行程和准备，对 1440 取余。","用 divmod 拆回时分，按两位输出。"],time:"O(1)。",space:"O(1)。",pitfall:"若先拆小时与分钟再分别相减，很容易漏掉借位和跨日。",extension:"要求同时输出前一日标记时，还需要保留哪个商？"},origin:{kind:"adapted",platform:"洛谷",id:"P5707",title:"〖深基2.例12〗上学迟到",level:"原题入门",url:"https://www.luogu.com.cn/problem/P5707",concepts:["整分钟向上取整","24 小时钟面"],adaptation:"原题固定到校 08:00、额外 10 分钟，正整数路程和速度均至 10⁴，提前不超一天。本站改成夜场巡检，时刻、准备可变，允许零路程，改变数据范围与用例。"}},{id:"P082",title:"展演补位名单",difficulty:"基础",tag:"条件判断",practice:{tier:"跨知识点",prerequisites:"第 3、4、6 课，条件、循环、列表排序。",primary:["阈值","并列"],secondary:["排序副本","原始位置"]},description:"报名得分按登记顺序提供。达到第 k 高分且分数大于 0 的人进入补位名单，同分者一并入选。名单按原登记顺序输出。",input:"第一行 n k。第二行 n 个登记分数，顺序任意。编号从 1 开始。",output:"首行人数，第二行按登记顺序输出编号，用空格分隔。无人入选时第二行写「空」。",limits:"1≤k≤n≤80，0≤分数≤100。",sample:[`6 3
7 0 9 7 3 9
`,`4
1 3 4 6
`,"排序副本的第 3 高为 7，两名 7 分也入选。"],cases:[[`4 3
0 4 0 2
`,`2
2 4
`,{note:"门槛为零时仍排除零分。"}],[`3 1
0 0 0
`,`0
空
`],[`5 1
2 8 8 4 8
`,`3
2 3 5
`],[`4 4
2 4 1 3
`,`4
1 2 3 4
`]],hints:["排序只用于寻找门槛，保留原列表。","用 enumerate 从 1 给原列表编号，检查两个条件。"],solution:`people, rank = map(int, input().split())
scores = list(map(int, input().split()))
cutoff = sorted(scores, reverse=True)[rank - 1]
qualified = []
for number, score in enumerate(scores, start=1):
    if score > 0 and score >= cutoff:
        qualified.append(number)
print(len(qualified))
if qualified:
    print(*qualified)
else:
    print("空")
`,guide:{concepts:["从排名到阈值","过滤与稳定顺序","0 值边界"],approach:"只在副本上排序取阈值，再重新遍历原名单，以原下标汇报。",steps:["第 k 高对应降序列表下标 k−1。","没有正分资格即使排名足够也剔除。","按原编号追加并输出空或完整名单。"],time:"O(n log n)。",space:"O(n)，保留排序副本和名单。",pitfall:"只取恰好 k 人会漏并列。用排序后的下标作编号会破坏原登记顺序。",extension:"分数范围固定时，可怎样用计数表求阈值？"},origin:{kind:"adapted",platform:"Codeforces",id:"158A",title:"Next Round",level:"原题 A",url:"https://codeforces.com/problemset/problem/158/A",concepts:["排名阈值","非零资格"],adaptation:"原题 1≤k≤n≤50，非递增分数 0–100，只输出人数。本站输入未排序、n 至 80，增加按原登记顺序输出并列入选者与空名单规则。"}},{id:"P083",title:"接连翻转两段路标",difficulty:"基础",tag:"字符串",outputComparison:"exact",practice:{tier:"跨知识点",prerequisites:"第 5、6 课，1 基区间、切片和列表。",primary:["切片","顺序应用"],secondary:["空白","位置转换"]},description:"路标上有一行文字。按顺序执行两次局部倒转，第二次在已改的整行上按位置计算。",input:"第一行原文，随后两行各有 l r，均从 1 开始，两端都包含。",output:"输出最终原文，包括仍在边缘或中间的空格。",limits:"1≤原文长度≤80，以码点计。可含空格与中文，1≤l≤r≤长度。",sample:[`ABCDE
1 3
2 4
`,`CDABE
`,"先得到 CBADE，再倒转 BAD 得到 DAB。"],cases:[[`甲乙丙丁
1 4
1 4
`,`甲乙丙丁
`],[` A B
1 4
2 3
`,`BA  
`,{note:"首部空格移动到结尾，且第二次按第一次结果作业。"}],[`本
1 1
1 1
`,`本
`],[`abced
2 2
4 5
`,`abcde
`]],hints:["左端减 1，右端正好是切片不包含的终点。","每次都用当前整行拼接前缀、倒转后的中段与后缀。"],solution:`line = input()
for _ in range(2):
    left, right = map(int, input().split())
    start = left - 1
    middle = line[start:right][::-1]
    line = line[:start] + middle + line[right:]
print(line)
`,guide:{concepts:["切片半开区间","字符串不可变","顺序应用"],approach:"每一步生成一条新字符串，用原位置取这一步的三段。",steps:["将两端包含的范围改成切片下标。","中间片段倒序，首尾直接接回。","重新绑定 line 后再处理第二个区间。"],time:"O(L)，两次操作。",space:"O(L)。",pitfall:"第二次仍切初始原文会漏掉相交部分的变化。strip 会丢失原文空格。",extension:"当操作很多且只需输出少数位置时，怎样反向追踪位置的来源？"},origin:{kind:"adapted",platform:"AtCoder",id:"ABC233 B",title:"A Reverse",level:"原题 B · 200 分",url:"https://atcoder.jp/contests/abc233/tasks/abc233_b?lang=en",concepts:["1 基区间","子串翻转"],adaptation:"原题一次反转、长度至 10⁵、小写英文字母。本站以路标为背景，长度至 80、允许空格和中文，两次操作可重叠，样例及用例独立设计。"}},{id:"P084",title:"签到重复时刻",difficulty:"基础",tag:"字典",practice:{tier:"跨知识点",prerequisites:"第 4、6、7 课，扫描、原位置和字典。",primary:["首位置表","重复发现顺序"],secondary:["计数","索引"]},description:"登记编号顺序给出。找最早发生的重复事件，报告编号、该编号的第一次位置与本次位置，并统计所有重复事件。第三次及以后也各算一次。",input:"第一行 n，第二行 n 个有符号整数，n 为 0 时第二行为空。位置从 1 开始。",output:"首行输出「编号 初次位置 重复位置」，无重复输出「无」。第二行输出重复事件数。",limits:"0≤n≤1000，-100000≤编号≤100000。",sample:[`5
4 0 0 4 0
`,`0 2 3
3
`,"第 3 个编号是首个重复事件，后面的 4 与 0 也各是一个重复。"],cases:[[`0

`,`无
0
`],[`4
-1 1 2 -2
`,`无
0
`],[`5
5 2 2 5 2
`,`2 2 3
3
`,{note:"按重复发生的时刻，而非最早出现的编号决定。"}],[`4
-3 -3 -3 -3
`,`-3 1 2
3
`]],hints:["字典保存每个编号第一次出现的编号位置。","两个状态分别保存第一个重复事件和任意重复的累计数。"],solution:`size = int(input())
entries = list(map(int, input().split()))
first = {}
earliest = None
repeated = 0
for position, code in enumerate(entries, start=1):
    if code in first:
        if earliest is None:
            earliest = (code, first[code], position)
        repeated += 1
    else:
        first[code] = position
if earliest is None:
    print("无")
else:
    print(*earliest)
print(repeated)
`,guide:{concepts:["首次位置","重复次数","扫描"],approach:"已读前缀的字典只记首位置。第一次遇到已存在项填充事件，以后只增计数。",steps:["按原序跟踪位置。","新编号写入 first，已登记编号增加重复数。","只填写一次 earliest，最后根据 None 输出。"],time:"期望 O(n)，按字典平均成本。",space:"O(n)。",pitfall:"将 0 当作没有重复会漏真实的零编号，覆盖首位置也会得到错误坐标。",extension:"如何为每个编号输出首末位置和重复次数？"},origin:{kind:"adapted",platform:"LeetCode",id:"217",title:"Contains Duplicate",level:"原题 Easy",url:"https://leetcode.com/problems/contains-duplicate/description/",concepts:["发现重复","哈希表"],adaptation:"原题参数为长度 1–10⁵、元素 ±10⁹ 的 nums，返回布尔值。本站使用标准输入，允许空清单，缩小数值范围，并报告首个重复事件的位置与总次数。"}},{id:"P085",title:"计算场馆可用分钟",difficulty:"进阶",tag:"函数",practice:{tier:"综合",prerequisites:"第 3、8 课，跨午夜、函数返回。",primary:["函数契约","跨时段时长"],secondary:["输入边界","复用状态"]},description:"场馆给出每日开放起止分钟与每次固定准备时长。实现工具函数计算扣除准备可使用的分钟数。",input:"实现 main.py 中的 usable_minutes(start, stop, setup)，接收三个整数。开始大于结束表示跨午夜。两端相等表示空时段。",output:"返回非负整数分钟。准备超出开放长度时返回 0。接口运行期间保持标准输入、输出与错误输出安静。",limits:"0≤start,stop≤1439，0≤setup≤1440。",contract:{kind:"function",files:["main.py"],target:{module:"main",name:"usable_minutes"}},starterFiles:[{name:"main.py",content:`def usable_minutes(start, stop, setup):
    pass
`}],sample:["","","23:00 到次日 01:00 共 120 分钟，扣 20 得 100。",{calls:[{args:[1380,60,20],expected:100},{args:[480,720,0],expected:240}]}],cases:[["","",{calls:[{args:[0,0,0],expected:0},{args:[1,1,5],expected:0}]}],["","",{calls:[{args:[10,12,3],expected:0},{args:[1439,0,0],expected:1}]}],["","",{calls:[{args:[0,1439,1],expected:1438},{args:[1439,0,1],expected:0},{args:[0,1439,1],expected:1438}]}]],hints:["结束减开始为负时，加一天的分钟数。","先求开放长度，再用 max 将剩余值限制到非负。"],solution:`def usable_minutes(start, stop, setup):
    duration = stop - start
    if duration < 0:
        duration += 1440
    return max(0, duration - setup)
`,guide:{concepts:["时间跨度","接口返回","边界"],approach:"正常差值为非负，跨午夜的负差值加一个周期。扣除准备再判零下限。",steps:["算 stop−start。","差值小于零时补 1440。","扣除 setup，较小结果最少为零；只返回计算值。"],time:"每次 O(1)。",space:"O(1)。",pitfall:"相等时补一天会把关闭状态变成全天可用。",extension:"把多段开放时长分别传给函数，与合并后只扣一次准备有何区别？"}},{id:"P086",title:"按差额排序的日结对账",difficulty:"进阶",tag:"综合应用",practice:{tier:"综合",prerequisites:"第 4、7、8、12 课，按键累计、元组排序键和函数。",primary:["双来源汇总","多关键字比较"],secondary:["阈值","独立慢解"]},description:"分别读入账本和盘点流水，流水可能为负且同类重复。找出差额达到门槛的类别，先按差额绝对值降序，同量按类别升序。",input:"第一行 n m threshold。接下来 n 行账本及 m 行盘点，每行「类别 金额」。",output:"入选类别每行输出「类别 账本小计减盘点小计」。缺少某账本的一侧按 0。无人入选输出「一致」。",limits:"0≤n,m≤100，1≤threshold≤1000，类别为不含空格的 ASCII 字母串，-1000≤金额≤1000。",sample:[`3 2 3
B 2
A 5
B 3
A 2
C 5
`,`B 5
C -5
A 3
`,"B 和 C 的绝对差额并列，按类别排序，输出仍带符号。"],cases:[[`0 0 1
`,`一致
`],[`2 2 2
A 4
A -1
A 3
B 1
`,`一致
`,{note:"应先聚合再计算绝对差，不能按单笔差异入选。"}],[`1 2 2
X -3
Y -5
X -1
`,`Y 5
X -2
`],[`3 0 4
Z 4
B -4
A 3
`,`B -4
Z 4
`]],hints:["同一个表可先累加账本，再减去盘点。","排序函数返回 (-abs(差额), 类别)。比较用绝对值，打印用原符号。"],solution:`def order(record):
    name, delta = record
    return -abs(delta), name

n, m, threshold = map(int, input().split())
differences = {}
for _ in range(n):
    name, text = input().split()
    differences[name] = differences.get(name, 0) + int(text)
for _ in range(m):
    name, text = input().split()
    differences[name] = differences.get(name, 0) - int(text)
report = []
for name, delta in differences.items():
    if abs(delta) >= threshold:
        report.append((name, delta))
if not report:
    print("一致")
for name, delta in sorted(report, key=order):
    print(name, delta)
`,guide:{concepts:["差额状态","绝对值筛选","排序副本"],approach:"把每笔变动按来源加号或减号累计，得到每类带符号差额。最后只为达到条件的类别排序。",steps:["逐笔增加账本额、减少盘点额。","完整汇总之后筛选绝对差额。","自测两个绝对值并列但符号相反的项目，再打印有符号原值。"],time:"O(n+m+k log k)，k 为入选类别数。",space:"O(u)，u 为总类别数。",pitfall:"筛选若早于完整累计会把后续互相抵消的金额误报。直接对带符号的数排序也会错。",extension:"增加两表原小计列，并用针对每个类别逐行枚举的慢解核对。"}}],e=`def parse_amount(text):
    return int(text)


def parse_record(text):
    category, amount = text.split()
    return category, parse_amount(amount)


def summarize(rows):
    totals = {}
    for category, amount in rows:
        totals[category] = totals.get(category, 0) + int(amount)
    return totals
`,E={id:"ledger",title:"命令行记账本",difficulty:"进阶",tag:"综合应用",background:"基础篇结项。先从起始文件补齐解析和汇总，再连接入口、逐项运行自测，最终提交输出和实际账本。",description:"读取多条分类流水并验证每条记录。将有效流水按录入顺序写入 ledger.csv，再读回该文件，按类别汇总并报告净额。",input:"main.py 逐行读取「类别 金额」，以单独一行 end 结束，标记两端的空白可忽略。类别不含空白，可含逗号或双引号。缺字段、多字段和金额无法转换均视为无效。提交 ledger_tools.py，其中 parse_amount(text) 接收合法整数文本并返回 int，导入及调用时不读取或打印。",output:"每条无效记录立即输出「跳过无效记录」。写出 UTF-8 的 ledger.csv，逐条存类别及转成整数后的金额，无表头，使用最小引用规则和 LF 行尾。即使无有效记录也创建空文件。读回后按类别的 Python 字符串默认顺序输出「类别 小计」，最后输出「净额 总金额」。",limits:"0–100 条流水，不含结束标记。类别 1–40 字符，合法金额绝对值不超过 10⁶。样例及自测全部使用单层文件。须能处理负金额、零金额、重复类别及并列小计。",contract:{kind:"module",files:["main.py","ledger_tools.py"],target:{module:"ledger_tools",name:"parse_amount"}},starterFiles:[{name:"main.py",content:`import csv
from ledger_tools import parse_record, summarize


def main():
    # 读取、验证、写入账本，再读回并打印小计
    pass


if __name__ == "__main__":
    main()
`},{name:"ledger_tools.py",content:`def parse_amount(text):
    # 只转换，失败让 ValueError 传给入口
    pass


def parse_record(text):
    # 交回类别和金额
    pass


def summarize(rows):
    # 返回每个类别的小计
    pass
`}],sample:[`交通 -8
餐饮 -16
零工 60
交通 错误
交通 -2
end
`,`跳过无效记录
交通 -10
零工 60
餐饮 -16
净额 34
`,"一条转换失败，交通两条合计 -10，CSV 中仍保留两条独立流水。",{calls:[{args:["0"],expected:0},{args:["-4"],expected:-4}],artifacts:[{name:"ledger.csv",content:`交通,-8
餐饮,-16
零工,60
交通,-2
`}]}],cases:[[`end
`,`净额 0
`,{calls:[{args:["+0001"],expected:1}],artifacts:[{name:"ledger.csv",content:""}],note:"空数据仍创建文件。"}],[`坏记录
纸 3 extra
灯 三
灯 0
end
`,`跳过无效记录
跳过无效记录
跳过无效记录
灯 0
净额 0
`,{calls:[{args:["+0"],expected:0},{args:["-8"],expected:-8}],artifacts:[{name:"ledger.csv",content:`灯,0
`}],note:"无效行之后能够继续，零金额有效。"}],[`B 2
A 3
A -1
B 0
end
`,`A 2
B 2
净额 4
`,{calls:[{args:["2"],expected:2},{args:["0"],expected:0},{args:["2"],expected:2}],artifacts:[{name:"ledger.csv",content:`B,2
A,3
A,-1
B,0
`}],note:"文件保留顺序和重复，汇总并列按类别排序。"}],[`纸,"大" +005
纸,"大" -2
end
`,`纸,"大" 3
净额 3
`,{calls:[{args:["+005"],expected:5},{args:["-2"],expected:-2}],artifacts:[{name:"ledger.csv",content:`"纸,""大""",5
"纸,""大""",-2
`}],note:"CSV 转义并保留单笔金额。"}]],hints:["先完成 parse_amount 和 parse_record，用三条固定字符串自测。把 ValueError 的恢复动作放在入口。","用 csv.writer 写完并退出 with，再用 csv.reader 读回。输入只有 end 时也要打开并创建文件，按 sorted 排小计。"],solution:`import csv
from ledger_tools import parse_record, summarize


def main():
    with open("ledger.csv", "w", encoding="utf-8", newline="") as file:
        writer = csv.writer(file, lineterminator="\\n")
        while True:
            line = input()
            if line.strip() == "end":
                break
            try:
                record = parse_record(line)
            except ValueError:
                print("跳过无效记录")
                continue
            writer.writerow(record)

    with open("ledger.csv", encoding="utf-8", newline="") as file:
        totals = summarize(csv.reader(file))
    for category in sorted(totals):
        print(category, totals[category])
    print("净额", sum(totals.values()))


if __name__ == "__main__":
    main()
`,solutionFiles:[{name:"ledger_tools.py",content:e}],guide:{concepts:["函数和模块","CSV 文件往返","具体异常","重复与自测"],approach:"入口组织 I/O，工具函数只转换或汇总。写入阶段保留原始成功记录的顺序，读取阶段按键合计。",steps:["先单独检查 parse_amount 的正数、负数和 0。","用 end 作为结束标记，逐行解析。发生 ValueError 时提示，下一条仍可处理。","关闭写入句柄再打开读取，合计并按类别排序。先试空输入，再试两类并列、重复与带引号的类别。"],time:"O(B+k log k)，B 为总输入长度，k 是类别数。",space:"O(k+L) 运行时内存和 O(B) 文件，L 为最长行。",pitfall:"提前合并流水或只打印汇总会让文件不合格。手拼逗号无法正确转义含引号的类别。",extension:"增加一个可复用的自测函数，只在工具文件直接运行时调用，保持导入无副作用。"}};export{E as A,u as a,p as b,r as c,m as d,s as e,d as f,h as g,y as h,i,k as j,w as k,l,c as m,P as n,O as o,f as p,A as q,B as r,a as s,q as t,_ as u,o as v,v as w,x,b as y,g as z};
