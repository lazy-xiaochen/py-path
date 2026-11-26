import { advancedLessons } from '../src/advanced.ts';
import { chapterExamples, chapters } from '../src/chapters.ts';
import { allProblems, projects, type Problem } from '../src/content.ts';
import type { Example } from '../src/teaching-types.ts';
import { equipmentOutputBoundary, labelOutputBoundary, libraryOutputBoundary } from '../src/lessons/advanced/output-boundaries.ts';

export const auditExamples = [...Object.entries(chapters).flatMap(([tag, chapter]) => chapter ? [{ tag, chapter }] : []),
  ...advancedLessons].flatMap(({ tag, chapter }) => [
  ...chapterExamples(chapter).map(example => ({ id: tag + '/' + example.id, example })),
  ...chapter.exercises.flatMap(exercise => exercise.kind === 'question' && exercise.demonstration ?
    [{ id: exercise.id, example: exercise.demonstration }] : []),
]);

export const auditProblems = [...allProblems, ...projects.flatMap(project => project.assessment ? [project.assessment] : [])];
export const casesOf = (problem: Problem) => [[problem.sample[0], problem.sample[1], problem.sample[3]] as const, ...problem.cases];

const outputLimit = 64 * 1024;
const IDs = (prefix: string, count: number, width: number) =>
  Array.from({ length: count }, (_, index) => prefix + String(index).padStart(width - prefix.length, '0'));
const oldLabels = IDs('L', 200, 10);
export const limits = [
  { id: 'A039', ...labelOutputBoundary, oldBytes: 167750,
    oldInput: oldLabels.slice(0, 100).join(' ') + '\n100\n' + oldLabels.slice(100).map(label => 'COMMIT ' + label + '\n').join('') },
  { id: 'A092', ...equipmentOutputBoundary, oldBytes: 203250,
    oldInput: '300\n' + IDs('Q', 150, 8).map(user => 'QUEUE ' + user + '\n').join('') + 'SHOW\n'.repeat(150) },
  { id: 'library-loans', ...libraryOutputBoundary, oldBytes: 129840,
    oldInput: 'NORMAL 240\nADD BK AT\n' +
      IDs('R', 119, 8).map(user => 'HOLD BK ' + user + '\n').join('') + 'SHOW BK\n'.repeat(120) },
];

export const badInterfaces = [
  ['A093', '把状态放在工厂之外，创建计数器或更新别名会串改其他实例。',
    'total += delta', 'global_total[0] += delta', (source: string) => 'global_total = [0]\n\n' + source.replace('    total = start', '    total = start\n    global_total[0] = start').replace('return total', 'return global_total[0]')],
  ['A094', '业务异常被吞掉，第三组需要捕获原异常对象。',
    '                raise\n', '                return None\n'],
  ['A095', '逐个累加子树高度，三个分支用例会错。',
    'tallest = max(tallest, child_height)', 'tallest += child_height'],
  ['A096', '先减少余额后检查拒绝条件，无法保持原值。',
    '        if price > self.balance or not self._policy(price, self.balance):\n            return False\n        self.balance -= price',
    '        self.balance -= price\n        if not self._policy(price, self.balance + price):\n            return False'],
  ['A097', '把标签放在类上，两个同值实例会共享列表。',
    'from dataclasses import dataclass, field', 'from dataclasses import dataclass\nfrom typing import ClassVar',
    (source: string) => source.replace('tags: list[str] = field(default_factory=list, init=False, repr=False)', 'tags: ClassVar[list[str]] = []')],
  ['A101', '先扣空位再检查重复领取，失败会减少另一类别的空位。',
    '        if user in self._allocated or self._free[size] == 0:\n            return False\n        self._free[size] -= 1',
    '        if self._free[size] == 0:\n            return False\n        self._free[size] -= 1\n        if user in self._allocated:\n            return False'],
] as const;

async function browserAudit() {
  const [{ runPython }, { runTask }, { normalizeOutput }] = await Promise.all([
    import('../src/runner'), import('../src/assessment'), import('../src/judge'),
  ]);
  const problemById = new Map(auditProblems.map(problem => [problem.id, problem]));
  const exampleById = new Map<string, Pick<Example, 'input' | 'output' | 'source' | 'diagnostic' | 'files'>>(
    auditExamples.map(({ id, example }) => [id, example]));
  const filesOf = (problem: Problem, source = problem.solution) => [
    { name: 'main.py', content: source }, ...(problem.solutionFiles ?? []),
  ];
  const inputFiles = (example: { source: string; files?: Example['files'] }) => [
    { name: 'main.py', content: example.source }, ...(example.files ?? []),
  ];
  const verdict = (problem: Problem, expected: string, result: Awaited<ReturnType<typeof runPython>>) => {
    if (result.status !== 'OK') return result.status;
    return result.assessmentIssue || normalizeOutput(result.stdout, problem.outputComparison) !==
      normalizeOutput(expected, problem.outputComparison) ? 'WA' : 'AC';
  };
  const grade = (problem: Problem, index: number, source?: string) => {
    const [input, , checks] = casesOf(problem)[index];
    return runTask(problem, { files: filesOf(problem, source), entry: 'main.py', input }, checks, new AbortController().signal);
  };
  return {
    async example(id: string) {
      const example = exampleById.get(id)!;
      const result = await runPython({ files: inputFiles(example), input: example.input, entry: 'main.py' });
      return { status: result.status, matches: result.stdout === example.output, diagnostic: result.diagnostic ?
        { kind: result.diagnostic.kind, line: result.diagnostic.line, file: result.diagnostic.file } : null };
    },
    async grade(id: string, index: number) {
      const problem = problemById.get(id)!;
      const result = await grade(problem, index);
      return { verdict: verdict(problem, casesOf(problem)[index][1], result), issue: result.assessmentIssue ?? result.detail ??
        result.diagnostic?.trace ?? (result.stdout === casesOf(problem)[index][1] ? '' : result.stdout.slice(0, 100)) };
    },
    async badInterface(id: string) {
      const problem = problemById.get(id)!;
      const [, , before, after, extra] = badInterfaces.find(item => item[0] === id)!;
      if (!problem.solution.includes(before)) throw new Error(id + ' no mutation');
      const changed = problem.solution.replace(before, after);
      const bad = extra ? extra(changed) : changed;
      const results = [];
      for (const [index, [, expected]] of casesOf(problem).entries()) {
        const result = await grade(problem, index, bad);
        results.push({ verdict: verdict(problem, expected, result), diagnostic: result.diagnostic?.kind });
      }
      return results;
    },
    async boundary(id: string) {
      const item = limits.find(item => item.id === id)!;
      const problem = problemById.get(id)!;
      const index = casesOf(problem).findIndex(([input]) => input === item.input);
      const result = await grade(problem, index);
      const before = await runPython({ files: filesOf(problem), entry: 'main.py', input: item.oldInput });
      const bytes = new TextEncoder().encode(result.stdout).length;
      return { status: result.status, exact: result.stdout === item.output, bytes,
        margin: item.limit - bytes, oldStatus: before.status, capped: new TextEncoder().encode(before.stdout).length <= outputLimit };
    },
    async words() {
      const project = projects.find(project => project.id === 'words')!;
      const result = await runPython({ files: inputFiles({ source: project.solution, files: project.files.slice(1) }),
        input: project.input, entry: 'main.py' });
      return { status: result.status, exact: result.stdout === project.expected };
    },
  };
}

declare global {
  interface Window { runtimeAudit: Awaited<ReturnType<typeof browserAudit>> }
}
if (typeof window !== 'undefined') void browserAudit().then(audit => { window.runtimeAudit = audit; });
