import frameScript from './isolate.js?raw';
import workerScript from './python-worker.js?raw';
import type { CallValue, InspectedFile, RunInspection } from './assessment-types';

export type SourceFile = { name: string; content: string };
export type Snapshot = { files: SourceFile[]; entry: string; input: string; inspection?: RunInspection };
export type Diagnostic = { kind: string; trace: string; file?: string; line?: number };
export type RunResult = {
  status: 'OK' | 'RE' | 'TLE' | 'OLE' | 'STOP' | 'UNAVAILABLE' | 'INVALID';
  stdout: string; stderr: string; diagnostic?: Diagnostic; detail?: string;
  values?: CallValue[];
  inputRead?: boolean;
  artifacts?: InspectedFile[];
  assessmentIssue?: string;
};

export const MAX_FILES = 20;
export const MAX_SOURCE = 128 * 1024;
export const MAX_INPUT = 32 * 1024;
const encoder = new TextEncoder();
const runtime = new URL('runtime/', new URL(import.meta.env.BASE_URL, location.href));

export function validFilename(name: string) {
  return /^[\p{L}\p{N}_][\p{L}\p{N}_.-]{0,79}$/u.test(name);
}

export function fileError(files: SourceFile[]) {
  if (!files.length || files.length > MAX_FILES) return '文件数量须为 1–20 个。';
  if (new Set(files.map(file => file.name)).size !== files.length) return '文件名重复。';
  if (!files.every(file => validFilename(file.name))) return '文件名须由字母、汉字、数字、下划线、点或连字符组成，且不能包含目录。';
  if (files.reduce((size, file) => size + encoder.encode(file.content).length, 0) > MAX_SOURCE) return '文件总大小超过 128 KiB。';
}

let runtimePromise: ReturnType<typeof readRuntime> | undefined;
function readRuntime() {
  const get = async (name: string) => {
    const response = await fetch(new URL(name, runtime), { mode: 'same-origin', redirect: 'error', signal: AbortSignal.timeout(15000) });
    if (!response.ok || response.headers.get('content-type')?.includes('text/html')) {
      throw new Error('解释器资源加载失败：' + name);
    }
    return response;
  };
  return Promise.all([
    get('pyodide.asm.js').then(response => response.text()),
    get('pyodide.js').then(response => response.text()),
    get('pyodide.asm.wasm').then(response => response.blob()),
    get('python_stdlib.zip').then(response => response.blob()),
    get('pyodide-lock.json').then(response => response.blob()),
  ]).then(([asm, loader, wasm, stdlib, lock]) => ({
    scripts: [asm, '\n;\n', loader, '\n;\n', workerScript], assets: { wasm, stdlib, lock },
  }));
}

export function runPython(snapshot: Snapshot, signal?: AbortSignal, onRunning?: () => void,
  prepared?: ReturnType<typeof preparePython>): Promise<RunResult> {
  if (signal?.aborted) {
    prepared?.dispose();
    return Promise.resolve({ status: 'STOP', stdout: '', stderr: '' });
  }
  const error = fileError(snapshot.files)
    ?? (!snapshot.entry.endsWith('.py') || !snapshot.files.some(file => file.name === snapshot.entry) ? '请选择工作区内的 Python 入口文件。' : undefined)
    ?? (encoder.encode(snapshot.input).length > MAX_INPUT ? '标准输入超过 32 KiB。' : undefined)
    ?? (snapshot.inspection?.artifacts?.some(name => !validFilename(name)) ? '产物必须使用工作区内的单层文件名。' : undefined);
  if (error) {
    prepared?.dispose();
    return Promise.resolve({ status: 'INVALID', stdout: '', stderr: '', detail: error });
  }
  return (prepared?.available ? prepared : preparePython()).start(snapshot, signal, onRunning);
}

// Preparation initializes trusted interpreter assets only. A session accepts exactly one source snapshot.
export function preparePython(onState?: (state: 'ready' | 'closed') => void) {
  const iframe = document.createElement('iframe');
  iframe.hidden = true;
  iframe.title = '隔离的 Python 执行环境';
  iframe.setAttribute('sandbox', 'allow-scripts');
  const channel = new MessageChannel();
  let booted = false;
  let ready = false;
  let running = false;
  let outcome: RunResult | undefined;
  let request: { snapshot: Snapshot; signal?: AbortSignal; onRunning?: () => void; resolve: (result: RunResult) => void } | undefined;
  let timer = window.setTimeout(() => fail('UNAVAILABLE', '无法在时限内确认隔离环境和解释器可用。'), 25000);

  function finish(result: RunResult) {
    if (outcome) return;
    outcome = result;
    channel.port1.postMessage({ type: 'stop' });
    channel.port1.close();
    iframe.remove();
    window.clearTimeout(timer);
    window.removeEventListener('message', boot);
    request?.signal?.removeEventListener('abort', stop);
    request?.resolve(result);
    request = undefined;
    onState?.('closed');
  }
  function fail(status: RunResult['status'], detail?: string) {
    finish({ status, stdout: '', stderr: '', detail });
  }
  function stop() { fail('STOP'); }
  async function boot(event: MessageEvent) {
    if (booted || event.source !== iframe.contentWindow || event.origin !== 'null' ||
        event.data?.type !== 'python-isolate-ready') return;
    booted = true;
    try {
      runtimePromise ??= readRuntime().catch(error => { runtimePromise = undefined; throw error; });
      const payload = await runtimePromise;
      if (!outcome) iframe.contentWindow!.postMessage({
        type: 'boot', ...payload, probe: new URL('isolation-probe', runtime).href,
      }, '*', [channel.port2]);
    } catch (error) {
      fail('UNAVAILABLE', String(error));
    }
  }
  function startIfReady() {
    if (outcome || running || !ready || !request) return;
    running = true;
    clearTimeout(timer);
    timer = window.setTimeout(() => fail('TLE'), 2000);
    const { snapshot, onRunning } = request;
    onRunning?.();
    if (!outcome) channel.port1.postMessage({ type: 'execute', ...snapshot });
  }
  channel.port1.onmessage = ({ data }) => {
    if (outcome) return;
    if (data?.type === 'failed') fail('UNAVAILABLE', String(data.reason).slice(0, 1000));
    if (data?.type === 'ready' && !ready) {
      ready = true;
      clearTimeout(timer);
      if (request) startIfReady();
      else {
        timer = window.setTimeout(stop, 60000);
        onState?.('ready');
      }
    }
    if (data?.type === 'result' && running && ['OK', 'RE', 'OLE'].includes(data.status) &&
        typeof data.stdout === 'string' && typeof data.stderr === 'string') {
      finish({ status: data.status, stdout: data.stdout, stderr: data.stderr, diagnostic: data.diagnostic,
        values: data.values, inputRead: data.inputRead, artifacts: data.artifacts });
    }
  };
  window.addEventListener('message', boot);
  const nonce = Array.from(crypto.getRandomValues(new Uint32Array(4)), value => value.toString(16)).join('');
  const policy = `default-src 'none'; script-src 'nonce-${nonce}' 'wasm-unsafe-eval'; worker-src blob:; connect-src 'none'; base-uri 'none'; form-action 'none'`;
  iframe.srcdoc = `<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${policy}"><script nonce="${nonce}">${frameScript}</script>`;
  document.body.append(iframe);

  return {
    get available() { return !outcome && !request; },
    start(snapshot: Snapshot, signal?: AbortSignal, onRunning?: () => void): Promise<RunResult> {
      if (outcome) return Promise.resolve(outcome);
      if (request) return Promise.resolve({ status: 'INVALID', stdout: '', stderr: '', detail: '执行环境已被使用。' });
      return new Promise(resolve => {
        request = { snapshot, signal, onRunning, resolve };
        if (signal?.aborted) { stop(); return; }
        signal?.addEventListener('abort', stop, { once: true });
        startIfReady();
      });
    },
    dispose: stop,
  };
}
