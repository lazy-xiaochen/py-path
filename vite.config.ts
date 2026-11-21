import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const names = ['pyodide.js', 'pyodide.asm.js', 'pyodide.asm.wasm',
  'python_stdlib.zip', 'pyodide-lock.json', 'README.md'];

export default defineConfig(() => {
  const destination = resolve('public/runtime');
  mkdirSync(destination, { recursive: true });
  for (const name of names) copyFileSync(resolve('node_modules/pyodide', name), resolve(destination, name));
  return {
    base: './',
    build: {
      rollupOptions: {
        output: { manualChunks: id => {
          if (id.includes('/node_modules/')) return 'editor';
          if (id.includes('/src/lessons/')) return 'lessons';
        } },
      },
    },
  };
});
