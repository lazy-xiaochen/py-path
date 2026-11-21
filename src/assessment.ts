import type { CaseChecks } from './assessment-types';
import type { Problem } from './content';
import { exactOutputDifference } from './judge';
import { runPython, type RunResult, type Snapshot } from './runner';

export async function runTask(problem: Problem, snapshot: Snapshot, checks: CaseChecks | undefined,
  signal: AbortSignal, onRunning?: () => void, verifyArtifacts = true): Promise<RunResult> {
  const contract = problem.contract;
  if (!contract) return runPython(snapshot, signal, onRunning);

  const missing = contract.files?.find(name => !snapshot.files.some(file => file.name === name));
  if (missing) {
    const category = contract.kind === 'module' ? '模块' : '提交文件';
    return { status: 'OK', stdout: '', stderr: '', assessmentIssue: category + '缺少 ' + missing + '。' };
  }

  const fixtures = checks?.fixtures ?? [];
  const artifacts = checks?.artifacts ?? [];
  const files = snapshot.files.filter(file => ![...fixtures, ...artifacts].some(item => item.name === file.name));
  const task = { ...snapshot, files: [...files, ...fixtures], entry: 'main.py' };

  if (contract.target && checks?.calls) {
    const category = contract.kind === 'module' ? '模块接口' : '函数接口';
    const call = { ...contract.target, args: checks.calls.map(item => item.args) };
    const result = await runPython({ ...task, input: '', inspection: { call } }, signal, onRunning);
    if (result.inputRead) return { ...result, assessmentIssue: category + '在导入或调用时读取了标准输入。' };
    if (result.status !== 'OK') {
      return result.status === 'RE' ? { ...result, assessmentIssue: category + '导入或调用时发生异常。' } : result;
    }
    if (result.stdout || result.stderr) {
      return { ...result, assessmentIssue: category + '在导入或调用时产生了额外输出。请通过 return 交回结果。' };
    }
    const failed = checks.calls.findIndex((item, index) => result.values?.[index] !== item.expected);
    if (failed >= 0) {
      const reason = result.values?.[failed] === null ? '返回了 None。' : '返回值与约定不符。';
      return { ...result, assessmentIssue: category + '第 ' + (failed + 1) + ' 次调用' + reason };
    }
    if (contract.kind === 'function') return result;
  }

  const inspection = artifacts.length ? { artifacts: artifacts.map(file => file.name) } : undefined;
  const result = await runPython({ ...task, inspection }, signal, onRunning);
  if (result.status !== 'OK') return result;
  for (const expected of artifacts) {
    const actual = result.artifacts?.find(file => file.name === expected.name);
    const prefix = '文件产物 ' + expected.name + ' ';
    if (actual?.content === undefined) {
      return { ...result, assessmentIssue: prefix + (actual?.error ?? '未生成。') };
    }
    if (verifyArtifacts && actual.content !== expected.content) {
      const difference = exactOutputDifference(expected.content, actual.content);
      return { ...result, assessmentIssue: prefix + '内容不一致。' + (difference ?? '请检查文件的结束换行。') };
    }
  }
  return result;
}
