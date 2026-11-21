import { basicSetup, EditorView } from 'codemirror';
import { EditorState, StateEffect, StateField } from '@codemirror/state';
import { Decoration, keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { HighlightStyle, indentUnit, syntaxHighlighting } from '@codemirror/language';
import { python } from '@codemirror/lang-python';
import { tags } from '@lezer/highlight';
import { fileError, MAX_FILES, MAX_SOURCE, type Snapshot, type SourceFile } from './runner';
import type { Workspace } from './storage';
import { h, must } from './ui';

const errorLine = Decoration.line({ class: 'execution-error-line' });
const markLine = StateEffect.define<number | undefined>();
const errorDecoration = StateField.define({
  create: () => Decoration.none,
  update(mark, transaction) {
    const change = transaction.effects.find(effect => effect.is(markLine));
    if (change?.value) return Decoration.set([errorLine.range(transaction.newDoc.line(change.value).from)]);
    return change || transaction.docChanged ? Decoration.none : mark;
  },
  provide: field => EditorView.decorations.from(field),
});
const theme = EditorView.theme({
  '&': { backgroundColor: 'var(--editor-bg)', color: 'var(--editor-text)' },
  '.cm-content, .cm-gutter': { fontFamily: 'var(--mono)', fontSize: '14px', lineHeight: '1.75' },
  '.cm-content': { padding: '12px 0', caretColor: 'var(--accent)' },
  '.cm-line': { paddingInline: '10px' },
  '.cm-gutters': { backgroundColor: 'var(--editor-edge)', color: 'var(--muted)', borderRight: '1px solid var(--border)' },
  '.cm-activeLineGutter, .cm-activeLine': { backgroundColor: 'var(--editor-line)' },
  '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--accent)' },
  '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': { backgroundColor: 'var(--editor-selection)' },
  '&.cm-focused .cm-matchingBracket, .cm-searchMatch, .cm-selectionMatch': { backgroundColor: 'var(--accent-soft)', color: 'var(--editor-text)' },
  '.cm-searchMatch.cm-searchMatch-selected': { backgroundColor: 'var(--warning-soft)', color: 'var(--warning)' },
  '.cm-panels, .cm-tooltip, .cm-foldPlaceholder': { backgroundColor: 'var(--surface)', color: 'var(--text)', borderColor: 'var(--border)' },
  '.cm-panel .cm-textfield, .cm-panel .cm-button': {
    background: 'var(--field)', color: 'var(--text)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)',
  },
  '.execution-error-line': { backgroundColor: 'var(--editor-error-line)' },
  '.cm-scroller': { maxHeight: '72vh' },
}, { dark: true });
const highlight = syntaxHighlighting(HighlightStyle.define([
  { tag: tags.keyword, color: 'var(--syntax-keyword)' },
  { tag: [tags.comment, tags.lineComment], color: 'var(--syntax-comment)', fontStyle: 'italic' },
  { tag: [tags.string, tags.special(tags.string)], color: 'var(--syntax-string)' },
  { tag: [tags.number, tags.bool, tags.null], color: 'var(--syntax-number)' },
  { tag: [tags.definition(tags.variableName), tags.standard(tags.variableName), tags.function(tags.variableName)], color: 'var(--syntax-function)' },
  { tag: tags.operator, color: 'var(--editor-text)' },
]));

export function mountEditor(root: HTMLElement, workspace: Workspace, onChange: () => void, manage = false, readonly = false,
  fixedEntry = false) {
  const states = new Map<string, EditorState>();
  let alive = true;
  root.innerHTML = '<div class="filebar"></div><div class="editor-host"></div><p class="file-feedback" role="status" hidden></p>';
  const filebar = must(root, '.filebar');
  const feedback = must(root, '.file-feedback');
  const tell = (message = '') => { feedback.textContent = message; feedback.hidden = !message; };

  function stateFor(file: SourceFile) {
    return EditorState.create({
      doc: file.content,
      extensions: [basicSetup, theme, highlight, file.name.endsWith('.py') ? python() : [], indentUnit.of('    '), keymap.of([indentWithTab]),
        EditorState.readOnly.of(readonly), EditorView.editable.of(!readonly),
        EditorView.contentAttributes.of({ 'aria-label': 'Python 源码编辑器' }),
        errorDecoration,
        EditorView.updateListener.of(update => {
          if (!update.docChanged) return;
          const active = workspace.files.find(item => item.name === workspace.active)!;
          active.content = update.state.doc.toString();
          onChange();
        })],
    });
  }
  const current = () => workspace.files.find(item => item.name === workspace.active)!;
  const view = new EditorView({ state: stateFor(current()), parent: must(root, '.editor-host') });

  function clearMarker() {
    if (view.state.field(errorDecoration).size) view.dispatch({ effects: markLine.of(undefined) });
  }
  function showFiles() {
    filebar.innerHTML = '<div class="file-tabs" aria-label="工作区文件">' + workspace.files.map(file =>
      '<button type="button" data-file="' + h(file.name) + '" aria-pressed="' + (file.name === workspace.active) + '">' +
      h(file.name) + '</button>').join('') + '</div>' +
      (manage ? '<div class="file-actions"><button type="button" data-action="new">新建</button>' +
        '<button type="button" data-action="import">导入</button><button type="button" data-action="rename">重命名</button>' +
        '<button type="button" data-action="delete">删除</button><input type="file" multiple hidden></div>' +
        (fixedEntry ? '<span class="muted">入口 main.py</span>' : '<label class="entry-label">运行入口 <select aria-label="运行入口">' +
        workspace.files.filter(file => file.name.endsWith('.py')).map(file =>
          '<option' + (file.name === workspace.entry ? ' selected' : '') + '>' + h(file.name) + '</option>').join('') +
        '</select></label>') : '');
  }
  function open(name: string, line?: number) {
    if (!workspace.files.some(file => file.name === name)) return;
    if (workspace.active !== name) {
      states.set(workspace.active, view.state);
      workspace.active = name;
      view.setState(states.get(name) ?? stateFor(current()));
      showFiles();
      onChange();
    }
    clearMarker();
    if (!line || line < 1 || line > view.state.doc.lines) return;
    const range = view.state.doc.line(line);
    view.dispatch({ effects: markLine.of(line), selection: { anchor: range.from, head: range.to }, scrollIntoView: true });
    view.focus();
  }
  function replaceFiles(files: SourceFile[], active: string, oldName?: string) {
    const error = fileError(files);
    if (error) { tell(error); return; }
    if (!files.some(file => file.name.endsWith('.py'))) { tell('请至少保留一个 .py 文件。'); return; }
    clearMarker();
    states.set(workspace.active, view.state);
    if (oldName) states.delete(oldName);
    workspace.files = files;
    workspace.active = active;
    if (!files.some(file => file.name === workspace.entry)) workspace.entry = files.find(file => file.name.endsWith('.py'))!.name;
    view.setState(states.get(active) ?? stateFor(current()));
    showFiles();
    tell();
    onChange();
  }
  filebar.addEventListener('click', event => {
    const button = (event.target as HTMLElement).closest('button');
    if (!button) return;
    const { file, action } = button.dataset;
    if (file) { open(file); return; }
    if (action === 'import') { must<HTMLInputElement>(filebar, 'input[type=file]').click(); return; }
    if (action === 'delete' && confirm('删除 ' + workspace.active + '？')) {
      const files = workspace.files.filter(item => item.name !== workspace.active);
      if (!files.length) { tell('请至少保留一个 .py 文件。'); return; }
      replaceFiles(files, files[0].name, workspace.active);
    }
    if (action === 'new' || action === 'rename') {
      const value = prompt(action === 'new' ? '新文件名，例如 helpers.py' : '重命名文件', action === 'new' ? '' : workspace.active);
      if (value === null) return;
      const name = value.trim();
      if (action === 'rename' && name === workspace.active) return;
      if (action === 'new') replaceFiles([...workspace.files, { name, content: '' }], name);
      else {
        const prior = workspace.entry;
        if (workspace.active === prior && name.endsWith('.py')) workspace.entry = name;
        const files = workspace.files.map(item => item === current() ? { ...item, name } : item);
        if (fileError(files) || !files.some(file => file.name.endsWith('.py'))) workspace.entry = prior;
        replaceFiles(files, name, workspace.active);
      }
    }
  });
  filebar.addEventListener('change', async event => {
    const target = event.target;
    if (target instanceof HTMLSelectElement) {
      workspace.entry = target.value;
      onChange();
    }
    if (!(target instanceof HTMLInputElement) || !target.files?.length) return;
    const imports = Array.from(target.files);
    target.value = '';
    if (imports.length + workspace.files.length > MAX_FILES || imports.reduce((sum, file) => sum + file.size, 0) > MAX_SOURCE) {
      tell('导入文件超过运行器的文件数量或大小限制。'); return;
    }
    try {
      const files = await Promise.all(imports.map(async file => ({ name: file.name,
        content: new TextDecoder('utf-8', { fatal: true }).decode(await file.arrayBuffer()) })));
      if (alive) replaceFiles([...workspace.files, ...files], files[0].name);
    } catch { if (alive) tell('只能导入 UTF-8 文本文件。'); }
  });
  showFiles();
  return {
    snapshot: (input: string): Snapshot => ({ entry: workspace.entry, input, files: workspace.files.map(file => ({ ...file })) }),
    unchanged: (snapshot: Snapshot) => workspace.entry === snapshot.entry && workspace.files.length === snapshot.files.length &&
      workspace.files.every(file => snapshot.files.some(previous => previous.name === file.name && previous.content === file.content)),
    open,
    clearMarker,
    destroy() { alive = false; view.destroy(); },
  };
}
