import type { CodingExercise, Example, Question } from '../../teaching-types';

export const structureTags = ['列表与引用', '列表编辑与排序', '字典视图与索引', '集合与关系', '结构选择与复杂度'] as const;
export const expressionTags = ['列表推导式', '字典与集合推导式', '迭代器与生成器', '记录与参数解包'] as const;
export const functionTags = ['参数绑定与默认值', '函数签名', '函数对象与回调', '作用域与闭包',
  '装饰器', '调用栈与递归', '分治与记忆化'] as const;
export const objectTags = ['类与对象', '属性与方法', '封装与属性校验', '继承与 MRO',
  '多态与组合', '特殊方法与数据类', '管理系统设计'] as const;
export const reference = (title: string, path: string, note: string) =>
  ({ title, url: 'https://docs.python.org/3.12/' + path, note });

export function example(id: string, title: string, level: Example['level'], source: string, output: string,
  purpose: string, steps: string[], pitfall: string): Example {
  return { id, title, level, source, input: '', output, purpose, steps, pitfall };
}

export function question(id: string, goal: string, prompt: string, answer: number,
  options: [label: string, feedback: string][], source?: string, output = ''): Question {
  return {
    kind: 'question', id: 'advanced-' + id, goal, prompt, answer,
    options: options.map(([label, feedback]) => ({ label, feedback })),
    ...(source ? { demonstration: { source, input: '', output } } : {}),
  };
}

export const coding = (problem: string, level: CodingExercise['level'], goal: string): CodingExercise =>
  ({ kind: 'coding', problem, level, goal });
