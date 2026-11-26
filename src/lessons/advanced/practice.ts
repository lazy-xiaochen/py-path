import type { Problem } from '../../content';
import type { SolutionGuide } from '../../teaching-types';

export function task(number: number, tag: string, difficulty: Problem['difficulty'], title: string,
  prompt: Pick<Problem, 'background' | 'description' | 'input' | 'output' | 'limits'>,
  sample: Problem['sample'], cases: Problem['cases'], hints: Problem['hints'], solution: string,
  guide: SolutionGuide, origin: Problem['origin'] = { kind: 'original' }): Problem {
  return { id: 'A' + String(number).padStart(3, '0'), tag, difficulty, title,
    ...prompt, limits: prompt.limits + ' 全部标准输入按 UTF-8 编码不超过 32 KiB。',
    sample, cases, hints, solution, guide, origin };
}
