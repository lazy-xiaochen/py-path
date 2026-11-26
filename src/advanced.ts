import { expressionTags, functionTags, objectTags, structureTags } from './lessons/advanced/authoring.ts';
import { listReferences } from './lessons/advanced/list-references.ts';
import { listOrder } from './lessons/advanced/list-order.ts';
import { dictIndexes } from './lessons/advanced/dict-indexes.ts';
import { sets } from './lessons/advanced/sets.ts';
import { structureDesign } from './lessons/advanced/structure-design.ts';
import { listProblems } from './lessons/advanced/list-practice.ts';
import { dictionaryProblems } from './lessons/advanced/dict-practice.ts';
import { setProblems } from './lessons/advanced/set-practice.ts';
import { designProblems } from './lessons/advanced/design-practice.ts';
import { listComprehensions } from './lessons/advanced/list-comprehensions.ts';
import { mappingComprehensions } from './lessons/advanced/mapping-comprehensions.ts';
import { generatorExpressions } from './lessons/advanced/generator-expressions.ts';
import { unpacking } from './lessons/advanced/unpacking.ts';
import { comprehensionProblems } from './lessons/advanced/comprehension-practice.ts';
import { mappingExpressionProblems } from './lessons/advanced/mapping-expression-practice.ts';
import { generatorProblems } from './lessons/advanced/generator-practice.ts';
import { unpackingProblems } from './lessons/advanced/unpacking-practice.ts';
import { functionBinding } from './lessons/advanced/function-binding.ts';
import { functionSignature } from './lessons/advanced/function-signature.ts';
import { functionValues } from './lessons/advanced/function-values.ts';
import { functionScope } from './lessons/advanced/function-scope.ts';
import { functionDecorators } from './lessons/advanced/function-decorators.ts';
import { recursionFrames } from './lessons/advanced/recursion-frames.ts';
import { recursiveDesign } from './lessons/advanced/recursive-design.ts';
import { functionParameterProblems } from './lessons/advanced/function-parameter-practice.ts';
import { functionPolicyProblems } from './lessons/advanced/function-policy-practice.ts';
import { functionControlProblems } from './lessons/advanced/function-control-practice.ts';
import { recursiveDesignProblems } from './lessons/advanced/recursive-design-practice.ts';
import { objectBasics } from './lessons/advanced/object-basics.ts';
import { objectAttributes } from './lessons/advanced/object-attributes.ts';
import { objectEncapsulation } from './lessons/advanced/object-encapsulation.ts';
import { objectInheritance } from './lessons/advanced/object-inheritance.ts';
import { objectComposition } from './lessons/advanced/object-composition.ts';
import { objectProtocols } from './lessons/advanced/object-protocols.ts';
import { objectDesign } from './lessons/advanced/object-design.ts';
import { objectBasicsProblems } from './lessons/advanced/object-basics-practice.ts';
import { objectRulesProblems } from './lessons/advanced/object-rules-practice.ts';
import { objectComponentsProblems } from './lessons/advanced/object-components-practice.ts';
import { objectDesignProblems } from './lessons/advanced/object-design-practice.ts';
import { interfaceProblems } from './lessons/advanced/interface-practice.ts';
import { transferProblems } from './lessons/advanced/transfer-practice.ts';
import type { Chapter } from './teaching-types';

export type AdvancedLesson = { slug: string; tag: string; title: string; chapter: Chapter };
type ModuleAssessment = { id: string; label: string; criterion: string };
export type AdvancedModule = {
  slug: string;
  title: string;
  lessons: AdvancedLesson[];
  introduction: string;
  prerequisites: string;
  goals: string[];
  map: string;
  mapCaption: string;
  summary: string[];
  practice: ModuleAssessment[];
  assessment: ModuleAssessment;
  transfer: ModuleAssessment;
};

const structureLessons: AdvancedLesson[] = [
  { slug: 'list-references', tag: structureTags[0], title: '列表、切片与对象引用', chapter: listReferences },
  { slug: 'list-order', tag: structureTags[1], title: '列表编辑与排序', chapter: listOrder },
  { slug: 'dict-indexes', tag: structureTags[2], title: '字典视图、合并与索引', chapter: dictIndexes },
  { slug: 'sets', tag: structureTags[3], title: '集合操作与关系', chapter: sets },
  { slug: 'structure-design', tag: structureTags[4], title: '数据结构选择与复杂度', chapter: structureDesign },
];
const expressionLessons: AdvancedLesson[] = [
  { slug: 'list-comprehensions', tag: expressionTags[0], title: '可迭代对象与列表推导式', chapter: listComprehensions },
  { slug: 'mapping-comprehensions', tag: expressionTags[1], title: '字典、集合与多层推导式', chapter: mappingComprehensions },
  { slug: 'generator-expressions', tag: expressionTags[2], title: '迭代器与生成器表达式', chapter: generatorExpressions },
  { slug: 'unpacking', tag: expressionTags[3], title: '解包、对齐与组合', chapter: unpacking },
];
const functionLessons: AdvancedLesson[] = [
  { slug: 'function-binding', tag: functionTags[0], title: '参数绑定与默认值', chapter: functionBinding },
  { slug: 'function-signature', tag: functionTags[1], title: '设计函数签名', chapter: functionSignature },
  { slug: 'function-values', tag: functionTags[2], title: '函数对象与回调', chapter: functionValues },
  { slug: 'function-scope', tag: functionTags[3], title: 'LEGB 与闭包', chapter: functionScope },
  { slug: 'function-decorators', tag: functionTags[4], title: '装饰器', chapter: functionDecorators },
  { slug: 'recursion-frames', tag: functionTags[5], title: '调用栈与递归基础', chapter: recursionFrames },
  { slug: 'recursive-design', tag: functionTags[6], title: '分治、树形遍历与记忆化', chapter: recursiveDesign },
];
const objectLessons: AdvancedLesson[] = [
  { slug: 'object-basics', tag: objectTags[0], title: '从记录到类和实例', chapter: objectBasics },
  { slug: 'object-attributes', tag: objectTags[1], title: '属性与三种方法', chapter: objectAttributes },
  { slug: 'object-encapsulation', tag: objectTags[2], title: '封装与属性校验', chapter: objectEncapsulation },
  { slug: 'object-inheritance', tag: objectTags[3], title: '继承、重写与 MRO', chapter: objectInheritance },
  { slug: 'object-composition', tag: objectTags[4], title: '多态与组合', chapter: objectComposition },
  { slug: 'object-protocols', tag: objectTags[5], title: '特殊方法与数据类', chapter: objectProtocols },
  { slug: 'object-design', tag: objectTags[6], title: '管理系统设计与重构', chapter: objectDesign },
];
export const advancedProblems = [...listProblems, ...dictionaryProblems, ...setProblems, ...designProblems,
  ...comprehensionProblems, ...mappingExpressionProblems, ...generatorProblems, ...unpackingProblems,
  ...functionParameterProblems, ...functionPolicyProblems, ...functionControlProblems, ...recursiveDesignProblems,
  ...objectBasicsProblems, ...objectRulesProblems, ...objectComponentsProblems, ...objectDesignProblems,
  ...interfaceProblems, ...transferProblems];
export const advancedRoute = 'learn/advanced';
export const advancedModuleRoute = (module: AdvancedModule) => advancedRoute + '/' + module.slug;
export const advancedLessonRoute = (lesson: AdvancedLesson) => advancedRoute + '/' + lesson.slug;

const structureModule: AdvancedModule = {
  slug: 'structures',
  title: '数据结构进阶',
  lessons: structureLessons,
  introduction: '从可变对象与引用入手，练习编辑和排名、分组和索引、名单核对，再把三种结构组合成可持续更新的程序。',
  prerequisites: '基础篇列表、字典、循环和函数。先复习下标、键值对以及函数返回值，再进入第一课。',
  goals: ['能推演一次修改的影响范围，正确复制并编辑嵌套列表。',
    '能生成稳定的排序报表、建立分组字典与索引，并按业务语句选择集合运算。',
    '能解释一个程序为什么需要列表、字典或集合，分析单次操作与一批查询的主要成本。'],
  map: '对象与引用 → 复制和切片 → 有序编辑与排序\n键和值 → 分组与索引 → 缺失或当前状态\n唯一成员 → 名单运算 → 判重与关系检查\n有序记录 ＋ 当前索引 ＋ 历史成员 → 可复核的事件处理程序',
  mapCaption: '从单个容器到事件处理',
  summary: ['修改嵌套容器前明确引用关系，确定复制范围。排序前决定是否保留原序列。',
    '按位置访问选列表，按键取数据选字典，只跟踪成员选集合。',
    '有序历史、当前状态和判重对应不同查询。按访问次数与数据量计算成本。'],
  practice: [
    { id: 'A012', label: '专项复核 · 跨仓库存索引', criterion: '能正确区分未登记与零值，更新时保留仓内顺序。' },
    { id: 'A016', label: '综合练习 · 只参加过一期的访客', criterion: '同一期先去重，跨期记录重复并保留指定输出顺序。' },
  ],
  assessment: { id: 'A020', label: '阶段测评 · 场次报名核验台', criterion: '独立完成并通过全部用例。能用两份状态解释重报、重复通知与当前缺席。能说明平均查询成本和空间开销。' },
  transfer: { id: 'A098', label: '撤回后的活动编号清单', criterion: '从事件更新集合，用数值顺序生成最终清单。' },
};

const expressionModule: AdvancedModule = {
  slug: 'expressions',
  title: '推导式与解包',
  lessons: expressionLessons,
  introduction: '从筛选循环出发，构造列表、字典与集合。用迭代器逐项读取，在配对和解包中给字段命名，最后完成一份可核验的报表。',
  prerequisites: '先完成数据结构进阶，能用列表保序、用字典覆盖、用集合去重。需要基础篇函数调用与异常处理。',
  goals: ['能将推导式还原为循环，解释筛选时机、嵌套顺序和重复数据的处理。',
    '能追踪生成器读取进度，选择按需处理、一次汇总或建立完整结果列表。',
    '能解包变长记录、对齐多列并保留原始位置，将已有数据和配置展开给函数。'],
  map: '遍历与筛选 → 列表、字典和集合推导式 → 多层结构\n按需读取 → 迭代器与生成器 → 查找或汇总\n配对与编号 → 解包字段 → 过滤、覆盖与完整报表',
  mapCaption: '从原始数据到对齐报表',
  summary: ['把筛选写在取到所需名称之后。先明确输出需要列表、映射还是唯一成员。',
    '生成器按读取推进。需要用到多份统计时，判断能否在一次循环内汇总。',
    '先核对输入形状，再对齐与解包。重复编号要确认先覆盖还是先筛选。'],
  practice: [
    { id: 'A028', label: '专项复核 · 把巡检表转成逐日表', criterion: '按日期构造外层列表，明确填补缺测位置，保留原始设备次序与真实零值。' },
    { id: 'A032', label: '综合练习 · 共享游标的巡检交接', criterion: '手推三次消费边界，并让查找和汇总共享同一游标。' },
  ],
  assessment: { id: 'A036', label: '阶段测评 · 活动积分对账报表',
    criterion: '独立通过全部用例，能解释为什么先验两列长度、先覆盖再筛选，以及如何同时保留最后位置与当前积分。' },
  transfer: { id: 'A099', label: '可改票的推荐榜', criterion: '分离最后选择与统计过程，处理弃权、大小写和并列。' },
};

const functionModule: AdvancedModule = {
  slug: 'functions',
  title: '函数进阶、作用域与递归',
  lessons: functionLessons,
  introduction: '从调用时如何给形参绑定值开始，用回调、闭包与装饰器拆分规则和状态，再用调用栈解释线性递归、分治和分层数据的汇总。',
  prerequisites: '完成推导式与解包，能传入位置和关键字实参，熟悉列表、字典、迭代器和基础篇的异常处理。',
  goals: ['能设计调用意图清楚的签名，验证可变默认值及共享引用。', '能借助作用域规则预测多个回调和包装器的状态、调用顺序与结果。',
    '能画出递归下降与返回、实现边界稳定的二分和目录汇总，并比较缓存、迭代与递归栈的代价。'],
  map: '参数绑定 → 函数签名 → 可替换回调\nLEGB → 独立闭包 → 可转发的函数包装\n调用帧 → 子问题缩小与终止 → 分治、树遍历与记忆化',
  mapCaption: '从一次调用到组合规则与分层目录',
  summary: ['先写参数契约，再写函数体。用重复调用测试默认状态和显式覆盖。',
    '记录名称属于哪一层，以及包装器何时运行。分别测试通过、拒绝和异常路径。',
    '从终止条件向上推导合成规则。对重复子问题考虑缓存，对很深的线性处理考虑循环。'],
  practice: [
    { id: 'A048', label: '综合练习 · 读数转换管道', criterion: '维持步骤顺序，能解释各回调的输入、输出和一次性结果的消费。' },
    { id: 'A056', label: '专项复核 · 两种审计范围', criterion: '能画出两种包装顺序，并用拒绝、边界和零值用例验证。' },
  ],
  assessment: { id: 'A064', label: '阶段测评 · 分层目录配额报告',
    criterion: '独立通过正式评测，能解释叶子与空目录各返回什么、为何进入时确定顺序以及返回时合并总量。' },
  transfer: { id: 'A100', label: '独立房间的名称分配器', criterion: '维护两个房间的状态与后缀搜索进度，处理用户自己输入的后缀。' },
};

const objectModule: AdvancedModule = {
  slug: 'objects',
  title: '面向对象编程',
  lessons: objectLessons,
  introduction: '用类组织实例的状态与操作，逐步建立可验证的属性、可替换组件与公共协议，最后完成有状态管理系统。',
  prerequisites: '学过函数、引用与容器、异常和装饰器。建议先通过函数模块的综合练习。',
  goals: ['能为问题选对象、属性与公开方法，并验证多实例和失败后的状态。',
    '能追踪属性、继承和方法解析，基于对象关系判断继承与组合。',
    '能实现 Python 的常用对象协议，分层完成可测试的借阅系统。'],
  map: '记录 + 行为 → 类与实例 → 属性校验\n继承与 super → 方法查找 → 统一接口与可替换组件\n数据类与协议 → 职责划分 → 借还、预约与连续操作验证',
  mapCaption: '从保存单条记录到管理多对象状态',
  summary: ['让状态归属、公开操作和失败行为都可从接口读出。',
    '复用继承行为前说明父子契约，组合可让独立变化的策略直接替换。',
    '用多实例、双方边界和失败后的连续查询检查状态一致性。'],
  practice: [
    { id: 'A076', label: '专项复核 · 跨柜台完整转移', criterion: '失败时同时保留两个柜台的原数量，成功后总量守恒。' },
    { id: 'A084', label: '综合练习 · 切换独立投递通道', criterion: '切换引用后各通道的记录与限额独立。' },
  ],
  assessment: { id: 'A092', label: '阶段测评 · 单件设备的预约优先',
    criterion: '验证借用权、错误归还和预约先后，能指出每个命令的状态变化。' },
  transfer: { id: 'A101', label: '可归还的分区储物位', criterion: '通过公开接口验证容量、重复领取、归还与多实例隔离。' },
};

export const advancedModules = [structureModule, expressionModule, functionModule, objectModule];
export const advancedLessons = advancedModules.flatMap(module => module.lessons);
