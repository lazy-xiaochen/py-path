export type Reference = { title: string; url: string; note: string };

export type Example = {
  id: string;
  title: string;
  level: '起步' | '应用';
  source: string;
  input: string;
  output: string;
  diagnostic?: { kind: string; file: string; line: number };
  purpose: string;
  steps: string[];
  pitfall: string;
  files?: { name: string; content: string }[];
};

export type Question = {
  kind: 'question';
  id: string;
  goal: string;
  prompt: string;
  options: { label: string; feedback: string }[];
  answer: number;
  legacy?: 'explain' | 'predict';
  demonstration?: Pick<Example, 'source' | 'input' | 'output'>;
};

export const exerciseLevels = ['基础编程', '综合应用', '拓展挑战'] as const;
export const advancedExerciseLevels = ['基础编程', '独立编程', '综合应用', '拓展挑战'] as const;
export type CodingExercise = {
  kind: 'coding';
  problem: string;
  level: typeof advancedExerciseLevels[number];
  goal: string;
  starterExample?: string;
  warmup?: boolean;
};

export type Chapter = {
  introduction?: string;
  goals: string[];
  prerequisites: string;
  version: string;
  topics: {
    title: string;
    explanation: string[];
    examples: Example[];
    diagram?: { caption: string; text: string };
  }[];
  comparisons?: { headings: [string, string, string]; rows: [string, string, string][] };
  applications?: string[];
  exercises: (Question | CodingExercise)[];
  mistakes: { symptom: string; reason: string; fix: string; check: string }[];
  summary: string[];
  next: string;
  references: Reference[];
};

export type SolutionGuide = {
  concepts: string[];
  approach: string;
  steps: string[];
  time: string;
  space: string;
  pitfall: string;
  extension: string;
};

export type ProblemOrigin =
  | { kind: 'original' }
  | { kind: 'adapted'; platform: string; title: string; id: string; level: string;
      url: string; concepts: string[]; adaptation: string };
