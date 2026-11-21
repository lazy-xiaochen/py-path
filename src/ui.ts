import { advice, explanations, verdicts } from './judge';
import type { Diagnostic, RunResult, SourceFile } from './runner';

export const h = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, char =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);

export function must<T extends HTMLElement>(root: ParentNode, selector: string) {
  return root.querySelector<T>(selector)!;
}

export function badge(status: keyof typeof verdicts) {
  const code = ['AC', 'WA', 'RE', 'TLE', 'OLE'].includes(status) ? ' · ' + status : '';
  return '<span class="status status-' + status + '">' + verdicts[status] + code + '</span>';
}

export function codeBlock(text: string, empty = '（空）') {
  // The HTML parser discards the first newline immediately after <pre>.
  return '<pre>\n' + h(text || empty) + '</pre>';
}

export function diagnosticMarkup(diagnostic: Diagnostic, file?: SourceFile) {
  const integerInput = diagnostic.kind === 'ValueError' && diagnostic.trace.includes('ValueError: invalid literal for int()');
  const message = integerInput
    ? 'int() 需要一个有效的整数。若这一行填了两个数，可以按每次 input() 一行重新填写，或先用 split() 拆分，再分别转换。'
    : explanations[diagnostic.kind] ?? '请查看原始异常的最后一行与调用位置。';
  return '<section class="error-box"><p>' + h(message) +
    '</p>' + (file && diagnostic.line ? '<button class="link-button jump" type="button">' +
      h(file.name) + ' · 第 ' + h(diagnostic.line) + ' 行</button><p class="stale muted" hidden>这条结果来自旧版本，重新运行后可定位。</p>' : '') +
    codeBlock(diagnostic.trace) + '</section>';
}

export function runMarkup(result: RunResult) {
  return '<div class="result-heading">' + badge(result.status) + '</div>' +
    (result.detail ? '<p class="muted">' + h(result.detail) + '</p>' : '') +
    (result.assessmentIssue ? '<p class="muted">' + h(result.assessmentIssue) + '</p>' : '') +
    (advice[result.status] ? '<p class="muted">' + h(advice[result.status]) + '</p>' : '') +
    (['OK', 'RE', 'OLE'].includes(result.status) ?
      '<h4>标准输出</h4>' + codeBlock(result.stdout) + '<h4>标准错误</h4>' + codeBlock(result.stderr) : '') +
    (result.values ? '<h4>返回值</h4>' + codeBlock(result.values.map(value => JSON.stringify(value)).join('\n')) : '') +
    (result.artifacts ?? []).map(file => '<details><summary>本次产物 ' + h(file.name) + '</summary>' +
      (file.content === undefined ? '<p>' + h(file.error) + '</p>' : codeBlock(file.content)) + '</details>').join('');
}

export async function copy(button: HTMLButtonElement, value: string) {
  try {
    await navigator.clipboard.writeText(value);
    button.textContent = '已复制';
  } catch {
    button.textContent = '请手动选择并复制';
  }
}
