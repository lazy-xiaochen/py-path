(() => {
  'use strict';
  let storageBlocked = false;
  try { void localStorage.length; } catch (error) { storageBlocked = error.name === 'SecurityError'; }
  if (self.origin !== 'null' || !storageBlocked) return;

  addEventListener('message', event => {
    if (event.source !== parent || event.data?.type !== 'boot' || !event.ports[0]) return;
    const host = event.ports[0];
    try {
      const { scripts, assets, probe } = event.data;
      const url = URL.createObjectURL(new Blob(scripts, { type: 'text/javascript' }));
      let worker;
      try { worker = new Worker(url, { name: 'isolated-python' }); }
      finally { URL.revokeObjectURL(url); }

      const channel = new MessageChannel();
      const port = channel.port1;
      port.onmessage = message => {
        if (message.data?.type === 'result' || message.data?.type === 'failed') worker.terminate();
        host.postMessage(message.data);
      };
      worker.onerror = event => {
        event.preventDefault();
        worker.terminate();
        host.postMessage({ type: 'failed', reason: event.message || '隔离 Worker 启动失败。' });
      };
      host.onmessage = message => {
        if (message.data?.type === 'stop') worker.terminate();
        if (message.data?.type === 'execute') port.postMessage(message.data);
      };
      worker.postMessage({ assets, probe }, [channel.port2]);
    } catch (error) {
      host.postMessage({ type: 'failed', reason: String(error) });
    }
  }, { once: true });
  parent.postMessage({ type: 'python-isolate-ready' }, '*');
})();
