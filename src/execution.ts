import { mountEditor } from './editor';
import { preparePython, runPython, type RunResult, type Snapshot } from './runner';
import { codeBlock, diagnosticMarkup, h, must, runMarkup } from './ui';
import { data, forgetRun, rememberRun, type Workspace } from './storage';

export function compare(expected: string, actual: string) {
  return '<div class="comparison"><div><h4>期望输出</h4>' + codeBlock(expected) +
    '</div><div><h4>实际输出</h4>' + codeBlock(actual) + '</div></div>';
}

export function executionUI(root: HTMLElement, workspace: Workspace, change: () => void,
  manage: boolean, readOnly: boolean, submit = false, showEditor: () => void = () => {}, resultKey?: string, fixedEntry = false) {
  const consoleRoot = must(root, '[data-console]');
  consoleRoot.innerHTML = `
    <label class="input-label">标准输入<textarea rows="4" aria-label="标准输入" spellcheck="false"
      ${readOnly ? '' : 'aria-describedby="stdin-hint"'}></textarea></label>
    ${readOnly ? '' : '<p class="console-hint muted" id="stdin-hint">运行前填好输入。每次 input() 读取一行，多行用回车分隔。</p>'}
    <div class="actions">
      <button class="button primary" type="button" data-run>运行</button>
      ${submit ? '<button class="button secondary" type="button" data-submit>提交评测</button>' : ''}
      <button class="button secondary" type="button" data-stop disabled>停止</button>
      <button class="button quiet" type="button" data-clear>清空</button>
    </div>
    <div class="result" aria-live="polite"><p class="muted">运行结果将在这里显示。</p></div>`;
  const input = must<HTMLTextAreaElement>(consoleRoot, 'textarea');
  const result = must(consoleRoot, '.result');
  const run = must<HTMLButtonElement>(consoleRoot, '[data-run]');
  const stop = must<HTMLButtonElement>(consoleRoot, '[data-stop]');
  const submitButton = consoleRoot.querySelector<HTMLButtonElement>('[data-submit]');
  const editor = mountEditor(must(root, '[data-editor]'), workspace, () => {
    change();
    checkStale();
  }, manage, readOnly, fixedEntry);
  let controller: AbortController | undefined;
  let diagnosis: Snapshot | undefined;
  let disposed = false;
  input.value = workspace.input;
  input.readOnly = readOnly;
  input.addEventListener('input', () => { workspace.input = input.value; change(); });
  stop.addEventListener('click', () => controller?.abort());
  must(consoleRoot, '[data-clear]').addEventListener('click', () => {
    diagnosis = undefined;
    editor.clearMarker();
    if (resultKey) forgetRun(resultKey);
    result.innerHTML = '<p class="muted">控制台已清空。</p>';
  });
  function checkStale() {
    if (!diagnosis) return;
    const stale = !editor.unchanged(diagnosis);
    const jump = result.querySelector<HTMLButtonElement>('.jump');
    if (jump) {
      jump.disabled = stale;
      must(result, '.stale').hidden = !stale;
    }
  }
  function setResult(markup: string, report?: RunResult, snapshot?: Snapshot) {
    const diagnostic = report?.diagnostic;
    const file = snapshot?.files.find(item => item.name === diagnostic?.file);
    diagnosis = diagnostic && snapshot;
    result.innerHTML = markup + (diagnostic ? diagnosticMarkup(diagnostic, file) : '');
    result.querySelector('.jump')?.addEventListener('click', () => {
      if (file && snapshot && editor.unchanged(snapshot)) {
        showEditor();
        editor.open(file.name, diagnostic?.line);
      }
    });
    checkStale();
  }
  async function act(job: (signal: AbortSignal) => Promise<void>) {
    if (controller) return;
    controller = new AbortController();
    run.disabled = true;
    if (submitButton) submitButton.disabled = true;
    stop.disabled = false;
    diagnosis = undefined;
    editor.clearMarker();
    try {
      await job(controller.signal);
    } finally {
      controller = undefined;
      run.disabled = false;
      if (submitButton) submitButton.disabled = false;
      stop.disabled = true;
    }
  }
  function pending(message: string) {
    if (!disposed) result.innerHTML = '<p class="live">' + h(message) + '</p>';
  }
  return { input, run, submitButton, editor, act, pending, setResult,
    active: () => !disposed,
    dispose() { disposed = true; controller?.abort(); editor.destroy(); },
  };
}

export function restoredRunHeading(truncated: boolean) {
  return '<p class="muted saved-run">上次运行结果' + (truncated ? ' · 长输出仅保留开头' : '') + '</p>';
}

type WorkspaceConsoleOptions = {
  manage?: boolean;
  readOnly?: boolean;
  notify?: (result: RunResult) => void;
  resultKey?: string;
  prewarm?: boolean;
};

export function workspaceConsole(root: HTMLElement, workspace: Workspace, change: () => void,
  { manage = false, readOnly = false, notify, resultKey, prewarm = false }: WorkspaceConsoleOptions = {}) {
  const ui = executionUI(root, workspace, change, manage, readOnly, false, undefined, resultKey);
  const previous = resultKey ? data.runs[resultKey] : undefined;
  if (previous) ui.setResult(restoredRunHeading(previous.truncated) + runMarkup(previous.report), previous.report, previous.snapshot);
  let prepared: ReturnType<typeof preparePython> | undefined;
  const runtimeState = prewarm ? document.createElement('span') : undefined;
  if (runtimeState) {
    runtimeState.className = 'runtime-state muted';
    runtimeState.setAttribute('role', 'status');
    ui.run.parentElement!.append(runtimeState);
    prepareNext();
  }

  function prepareNext() {
    if (!runtimeState) return;
    runtimeState.textContent = '正在提前准备解释器…';
    const session = preparePython(state => {
      if (prepared !== session) return;
      if (state === 'closed') prepared = undefined;
      runtimeState.textContent = state === 'ready' ? '隔离解释器已就绪' : '';
    });
    prepared = session;
  }

  ui.run.addEventListener('click', () => void ui.act(async signal => {
    const snapshot = ui.editor.snapshot(ui.input.value);
    const session = prepared;
    prepared = undefined;
    if (runtimeState) runtimeState.textContent = '';
    ui.pending('正在加载隔离解释器…');
    const result = await runPython(snapshot, signal, () => ui.pending('程序正在运行…'), session);
    if (!ui.active()) return;
    if (resultKey) rememberRun(resultKey, result, snapshot);
    ui.setResult(runMarkup(result), result, snapshot);
    notify?.(result);
    if (result.status === 'OK' || result.status === 'RE') prepareNext();
  }));
  return () => { ui.dispose(); prepared?.dispose(); };
}

