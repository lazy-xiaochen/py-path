// Concatenated after the two local Pyodide scripts into a classic blob Worker.
(() => {
  'use strict';
  const runtimeBase = 'https://python-runtime.invalid/';
  const nativeFetch = globalThis.fetch.bind(globalThis);

  async function verifyNetworkPolicy(url) {
    const violation = new Promise(resolve => {
      addEventListener('securitypolicyviolation', event => {
        if (event.disposition === 'enforce' && event.effectiveDirective === 'connect-src') resolve(true);
      });
      setTimeout(() => resolve(false), 1800);
    });
    const blocked = await nativeFetch(url, { mode: 'no-cors', credentials: 'omit', cache: 'no-store' })
      .then(() => false, () => true);
    if (!blocked || !await violation) throw new Error('无法确认 Worker 的 CSP 正在阻止联网。');
  }

  addEventListener('message', async event => {
    const port = event.ports[0];
    const send = port.postMessage.bind(port);
    try {
      if (self.origin !== 'null') throw new Error('Worker 没有独立的不透明来源。');
      const { assets, probe } = event.data;
      await verifyNetworkPolicy(probe);
      const resources = new Map([
        [runtimeBase + 'pyodide.asm.wasm', [assets.wasm, 'application/wasm']],
        [runtimeBase + 'python_stdlib.zip', [assets.stdlib, 'application/zip']],
        [runtimeBase + 'pyodide-lock.json', [assets.lock, 'application/json']],
      ]);
      const originalFetch = globalThis.fetch;
      // Only the trusted initialization code runs while this in-memory adapter is installed.
      globalThis.fetch = async url => {
        const resource = resources.get(String(url));
        if (!resource) throw new Error('无法读取未打包的解释器资源。');
        return new Response(resource[0], { headers: { 'Content-Type': resource[1] } });
      };
      let python;
      try {
        python = await loadPyodide({ indexURL: runtimeBase, stdout() {}, stderr() {} });
      } finally {
        globalThis.fetch = originalFetch;
        resources.clear();
      }
      port.onmessage = ({ data }) => {
        if (data?.type !== 'execute') return;
        port.onmessage = null;
        execute(python, data, send);
      };
      send({ type: 'ready' });
    } catch (error) {
      send({ type: 'failed', reason: String(error) });
    }
  }, { once: true });

  function inspectArtifacts(fs, names) {
    let remaining = 64 * 1024;
    return names.map(name => {
      const path = '/work/' + name;
      try {
        const info = fs.lstat(path);
        if (!fs.isFile(info.mode)) return { name, error: '产物须为普通文件。' };
        if (info.size > remaining) return { name, error: '产物合计超过 64 KiB。' };
        remaining -= info.size;
        return { name, content: new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(fs.readFile(path)) };
      } catch (error) {
        return { name, error: error instanceof TypeError ? '产物不是有效的 UTF-8 文本。' : '未找到产物或无法读取。' };
      }
    });
  }

  function execute(python, { files, entry, input, inspection }, send) {
    const channels = [new TextDecoder(), new TextDecoder()];
    const output = ['', ''];
    let remaining = 64 * 1024;
    let limited = false;
    const payload = () => ({ stdout: output[0], stderr: output[1] });
    const write = channel => bytes => {
      const size = bytes.length;
      if (limited) return size;
      const count = Math.min(size, remaining);
      remaining -= count;
      output[channel] += channels[channel].decode(bytes.subarray(0, count), { stream: true });
      if (count < size) {
        limited = true;
        send({ type: 'result', status: 'OLE', ...payload() });
      }
      return size;
    };
    try {
      python.setStdout({ write: write(0) });
      python.setStderr({ write: write(1) });
      python.FS.mkdir('/work');
      for (const { name, content } of files) python.FS.writeFile('/work/' + name, content);
      const context = python.toPy({ entry, input, call: inspection?.call ?? null });
      let report;
      try { report = JSON.parse(python.runPython(driver, { globals: context })); }
      finally { context.destroy(); }
      if (limited) return;
      for (let channel = 0; channel < 2; channel++) output[channel] += channels[channel].decode();
      const artifacts = !report.diagnostic && inspection?.artifacts ?
        inspectArtifacts(python.FS, inspection.artifacts) : undefined;
      send({ type: 'result', status: report.diagnostic ? 'RE' : 'OK', ...payload(), ...report, artifacts });
    } catch (error) {
      if (!limited) send({ type: 'result', status: 'RE', ...payload(),
        diagnostic: { kind: 'RuntimeError', trace: String(error).slice(0, 8192) } });
    }
  }

  const driver = `
import importlib, io, json, os, sys, traceback, types
class ClosedInput(io.StringIO):
    attempted = False
    def read(self, *args):
        self.attempted = True
        raise EOFError('接口验证期间不可读取标准输入')
    readline = read
    readlines = read
    __next__ = read

os.chdir('/work')
entry = '/work/' + entry
sys.argv = [entry]
sys.path.insert(0, '/work')
sys.stdin = io.TextIOWrapper(io.BytesIO(input.encode('utf-8')), encoding='utf-8', newline=None)
main = types.ModuleType('__main__')
main.__file__ = entry
sys.modules['__main__'] = main
diagnostic = None
values = None
closed_input = ClosedInput()
try:
    if call is None:
        with open(entry, 'rb') as source:
            code = compile(source.read(), entry, 'exec')
        exec(code, main.__dict__)
    else:
        sys.stdin = closed_input
        module = importlib.import_module(call['module'])
        function = getattr(module, call['name'], None)
        if not callable(function):
            raise TypeError('缺少可调用函数 ' + call['name'])
        values = []
        for arguments in call['args']:
            value = function(*arguments)
            if type(value) is int and abs(value) <= 9007199254740991:
                values.append(value)
            elif type(value) is str and len(value) <= 4096:
                values.append(value)
            elif value is None or type(value) is bool:
                values.append(value)
            else:
                raise TypeError('返回值须为约定类型和大小')
except BaseException as exc:
    if not (isinstance(exc, SystemExit) and exc.code in (None, 0)):
        frames = traceback.extract_tb(exc.__traceback__)
        location = next(((frame.filename, frame.lineno) for frame in reversed(frames)
                         if frame.filename.startswith('/work/')), (None, None))
        if isinstance(exc, SyntaxError) and (exc.filename or '').startswith('/work/'):
            location = exc.filename, exc.lineno
        diagnostic = dict(kind=type(exc).__name__, trace=traceback.format_exc(limit=-20)[-8192:],
                          file=location[0].removeprefix('/work/') if location[0] else None,
                          line=location[1])
finally:
    sys.stdout.flush()
    sys.stderr.flush()
json.dumps(dict(diagnostic=diagnostic, values=values, inputRead=closed_input.attempted))
`;
})();
