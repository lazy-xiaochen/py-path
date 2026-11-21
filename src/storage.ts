import type { RunResult, Snapshot, SourceFile } from './runner';

export type HistoryRecord = { date: number; verdict: 'AC' | 'WA' | 'RE' | 'TLE' | 'OLE'; passed: number; total: number };
export type Workspace = { files: SourceFile[]; active: string; entry: string; input: string };
type Totals = { attempts: number; correct: number };
type QuestionRecord = Totals & { lastChoice: number; solved: boolean };
type SavedRun = { report: RunResult; snapshot?: Snapshot; sample?: boolean; truncated: boolean };
export const storageKey = 'py-path.v1';
const initial: Workspace = {
  files: [{ name: 'main.py', content: '# 在这里写下你的 Python 程序\nprint("你好，Python！")\n' }],
  active: 'main.py', entry: 'main.py', input: '',
};

type Data = {
  drafts: Record<string, string>;
  attempts: Record<string, HistoryRecord[]>;
  solved: Record<string, boolean>;
  mistakes: Record<string, boolean>;
  progress: Record<string, Record<string, boolean>>;
  workspace: Workspace;
  projects: Record<string, Workspace>;
  examples: Record<string, Workspace>;
  exampleSelections: Record<string, string>;
  questions: Record<string, QuestionRecord>;
  submissions: Record<string, Totals>;
  runs: Record<string, SavedRun>;
  problemInputs: Record<string, string>;
  taskWorkspaces: Record<string, Workspace>;
};

let raw: Partial<Data> = {};
export let storageFailed = false;
try { raw = JSON.parse(localStorage.getItem(storageKey) ?? '{}') ?? {}; }
catch { storageFailed = true; }

export const data: Data = {
  drafts: raw.drafts ?? {}, attempts: raw.attempts ?? {}, solved: raw.solved ?? {},
  mistakes: raw.mistakes ?? {}, progress: raw.progress ?? {},
  workspace: raw.workspace?.files?.length ? raw.workspace : initial, projects: raw.projects ?? {},
  examples: raw.examples ?? {}, exampleSelections: raw.exampleSelections ?? {},
  questions: raw.questions ?? {}, submissions: raw.submissions ?? {},
  runs: raw.runs ?? {}, problemInputs: raw.problemInputs ?? {}, taskWorkspaces: raw.taskWorkspaces ?? {},
};

export function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(data)); storageFailed = false; }
  catch { storageFailed = true; }
  const indicator = document.querySelector<HTMLElement>('#local-storage');
  if (indicator) indicator.textContent = storageFailed ? '本地存储不可用或已满' : '仅本地保存';
}

export function record(id: string, attempt: HistoryRecord) {
  const totals = submissionTotals(id);
  data.submissions[id] = { attempts: totals.attempts + 1, correct: totals.correct + Number(attempt.verdict === 'AC') };
  data.attempts[id] = [attempt, ...(data.attempts[id] ?? [])].slice(0, 30);
  if (attempt.verdict === 'AC') {
    data.solved[id] = true;
    delete data.mistakes[id];
  } else {
    data.mistakes[id] = true;
  }
  save();
}

export function submissionTotals(id: string): Totals {
  const prior = data.attempts[id] ?? [];
  return data.submissions[id] ?? { attempts: prior.length, correct: prior.filter(record => record.verdict === 'AC').length };
}

export function recordChoice(id: string, choice: number, correct: boolean) {
  const previous = data.questions[id];
  data.questions[id] = {
    attempts: (previous?.attempts ?? 0) + 1,
    correct: (previous?.correct ?? 0) + Number(correct),
    lastChoice: choice,
    solved: correct || !!previous?.solved,
  };
  save();
}

export function rememberRun(key: string, result: RunResult, snapshot: Snapshot, sample?: boolean) {
  const keep = 4096;
  const { stdout, stderr, diagnostic, detail, artifacts } = result;
  const report = { ...result, stdout: stdout.slice(0, keep), stderr: stderr.slice(0, keep),
    artifacts: artifacts?.map(file => ({ ...file, content: file.content?.slice(0, keep) })),
    diagnostic: diagnostic ? { ...diagnostic, trace: diagnostic.trace.slice(0, keep) } : undefined,
    detail: detail?.slice(0, keep) };
  const sourceSize = snapshot.files.reduce((total, file) => total + file.content.length, 0);
  data.runs[key] = {
    report, sample,
    snapshot: diagnostic && sourceSize <= 8192 ? { ...snapshot, input: '' } : undefined,
    truncated: [stdout, stderr, diagnostic?.trace, detail, ...artifacts?.map(file => file.content) ?? []]
      .some(value => (value?.length ?? 0) > keep),
  };
  save();
}

export function forgetRun(key: string) {
  if (data.runs[key]) {
    delete data.runs[key];
    save();
  }
}

export function progress(id: number, stage: string) {
  (data.progress[id] ??= {})[stage] = true;
  save();
}
