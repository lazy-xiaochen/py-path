import { defineConfig, type Plugin } from 'vite';
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const names = ['pyodide.js', 'pyodide.asm.js', 'pyodide.asm.wasm',
  'python_stdlib.zip', 'pyodide-lock.json', 'README.md'];

function thirdPartyNotices(): Plugin {
  return {
    name: 'third-party-notices',
    apply: 'build',
    generateBundle(_options, bundle) {
      const packages = new Set<string>();
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== 'chunk') continue;
        for (const [id, info] of Object.entries(chunk.modules)) {
          if (!info.renderedLength) continue;
          const parts = id.replaceAll('\\', '/').split('/node_modules/');
          if (parts.length < 2) continue;
          const [scope, name] = parts.at(-1)!.split('/');
          packages.add(parts.slice(0, -1).join('/node_modules/') + '/node_modules/' +
            (scope.startsWith('@') ? scope + '/' + name : scope));
        }
      }
      const notices = [...packages].map(directory => {
        const { name, version, license } = JSON.parse(readFileSync(resolve(directory, 'package.json'), 'utf8'));
        const file = ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'COPYING'].find(name => existsSync(resolve(directory, name)));
        if (!file) this.error('找不到打包依赖的许可证 ' + name + '@' + version);
        return { name, text: name + ' ' + version + ' (' + license + ')\n\n' +
          readFileSync(resolve(directory, file), 'utf8').trimEnd() };
      }).sort((a, b) => a.name.localeCompare(b.name));
      this.emitFile({ type: 'asset', fileName: 'third-party/editor.txt',
        source: 'JavaScript dependencies included in this build\n\n' + notices.map(notice => notice.text).join('\n\n---\n\n') + '\n' });
    },
  };
}

export default defineConfig(({ mode }) => {
  const destination = resolve('public/runtime');
  mkdirSync(destination, { recursive: true });
  for (const name of names) copyFileSync(resolve('node_modules/pyodide', name), resolve(destination, name));
  return {
    base: './',
    plugins: [thirdPartyNotices()],
    build: {
      ...(mode === 'runtime-audit' ? { outDir: '.vite/runtime-audit', emptyOutDir: true } : {}),
      rollupOptions: {
        ...(mode === 'runtime-audit' ? { input: resolve('tests/runtime-audit.html') } : {}),
        output: { manualChunks: id => {
          if (id.includes('/node_modules/')) return 'editor';
          if (id.includes('/src/lessons/advanced/')) return 'advanced-lessons';
          if (id.includes('/src/lessons/')) return 'lessons';
        } },
      },
    },
  };
});
