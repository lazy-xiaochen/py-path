import { lessons, type Problem, type ProjectBrief } from './content';
import { chapterExamples, chapters } from './chapters';
import { advancedLessonRoute, advancedLessons } from './advanced';
import { advice, exactOutputDifference, normalizeOutput } from './judge';
import { compare, executionUI, restoredRunHeading } from './execution';
import { runTask } from './assessment';
import type { RunResult, Snapshot } from './runner';
import { data, record, rememberRun, save, type HistoryRecord, type Workspace } from './storage';
import { badge, codeBlock, copy, h, must, runMarkup } from './ui';

export const personal = (problem: Problem) =>
  data.solved[problem.id] ? '已通过' : data.attempts[problem.id]?.length ? '已尝试' : '未开始';
export const difficultyClass = (difficulty: string) => ['easy', 'basic', 'advanced'][['入门', '基础', '进阶'].indexOf(difficulty)];
export const problemLink = (problem: Problem) => '<a class="table-link" href="#problem/' + problem.id + '">' + h(problem.title) + '</a>';
export const originLabel = (problem: Problem) => problem.origin?.kind === 'adapted' ? '经典改编' : '原创';

function originMarkup(problem: Problem) {
  const origin = problem.origin;
  if (origin?.kind !== 'adapted') return '';
  return `<details class="problem-source"><summary>查看原题出处</summary>
    <p>${h(origin.platform)} · ${h(origin.id)} · ${h(origin.level)}</p>
    <p>${h(origin.concepts.join('、'))}</p><p>${h(origin.adaptation)}</p>
    <p>本站题面、用例和参考解独立撰写。原题链接供查阅，原站材料按原站权利与条款使用。</p>
    <a class="inline-link" href="${h(origin.url)}" target="_blank" rel="noopener noreferrer">${h(origin.title)} ↗</a></details>`;
}

function solutionMarkup(problem: Problem) {
  const guide = problem.guide;
  if (!guide) return codeBlock(problem.solution);
  return `
    <div class="solution-guide">
      <h3>解题思路与算法选择</h3><p>${h(guide.approach)}</p>
      <h3>考查知识点</h3><p>${h(guide.concepts.join('、'))}</p>
      <h3>参考代码</h3>${codeBlock(problem.solution)}
      ${(problem.solutionFiles ?? []).map(file => '<h4>' + h(file.name) + '</h4>' + codeBlock(file.content)).join('')}
      <h3>代码逐步解释</h3><ol>${guide.steps.map(step => '<li>' + h(step) + '</li>').join('')}</ol>
      <dl><dt>时间复杂度</dt><dd>${h(guide.time)}</dd><dt>空间复杂度</dt><dd>${h(guide.space)}</dd></dl>
      <h3>容易出现的错误</h3><p>${h(guide.pitfall)}</p>
      <h3>拓展问题</h3><p>${h(guide.extension)}</p>
    </div>`;
}

function projectBriefMarkup(brief: ProjectBrief) {
  const items = (entries: string[]) => '<ul>' + entries.map(entry => '<li>' + h(entry) + '</li>').join('') + '</ul>';
  return `<details open><summary>项目实施路线</summary>
    <h3>技术与功能要求</h3>${items(brief.requirements)}
    <h3>需求分析与设计</h3>${items(brief.design)}
    <h3>分阶段实现</h3>
    <ol>${brief.stages.map(stage => `<li><strong>${h(stage.title)}</strong>
      <p>${h(stage.work)}</p><p>自测 · ${h(stage.check)}</p></li>`).join('')}</ol>
    <h3>验收清单</h3>${items(brief.checklist)}
    <h3>拓展挑战</h3>${items(brief.extensions)}
  </details>`;
}

export function problemPage(problem: Problem, modify: boolean, main: HTMLElement, projectWorkspace?: Workspace,
  projectBrief?: ProjectBrief) {
  const [sampleInput, sampleOutput, sampleExplanation, sampleChecks] = problem.sample;
  const interfaceSample = problem.contract?.kind === 'function' &&
    sampleChecks?.fixtures?.some(file => file.name === problem.contract?.target?.module + '.py');
  const lessonIndex = lessons.findIndex(lesson => lesson.tag === problem.tag);
  const lesson = lessons[lessonIndex];
  const advancedLesson = advancedLessons.find(item => item.tag === problem.tag);
  const lessonUrl = advancedLesson ? advancedLessonRoute(advancedLesson) : 'learn/' + (lessonIndex + 1);
  const bankUrl = advancedLesson ? 'bank/advanced/' + encodeURIComponent(advancedLesson.tag) :
    problem.practice ? 'bank/independent' : 'bank';
  const resultKey = (projectWorkspace ? 'project:' : 'problem:') + problem.id;
  const returnUrl = projectBrief ? 'projects' : projectWorkspace ? 'learn' : bankUrl;
  const returnLabel = projectBrief ? '综合项目' : projectWorkspace ? '学习路径' : '题库';
  const lessonLabel = projectBrief ? '项目先修课程' : projectWorkspace ? '回顾综合应用' : '本题所属课程';
  main.innerHTML = `
    <div class="problem-crumbs"><a class="inline-link" href="#${returnUrl}">← ${returnLabel}</a><a class="inline-link" href="#${lessonUrl}">${lessonLabel}</a></div>
    <div class="problem-heading"><h1>${projectWorkspace ? '' : '<code>' + h(problem.id) + '</code> '}${h(problem.title)}</h1>
      <span class="difficulty ${difficultyClass(problem.difficulty)}">${problem.difficulty}</span><span class="tag">${problem.tag}</span>
      <span class="tag">${originLabel(problem)}</span><span class="tag" id="personal">${personal(problem)}</span></div>
    <div class="panel-switch" aria-label="做题区域">${['题面', '代码', '评测'].map((name, i) =>
      '<button class="button secondary" type="button" data-pane="' + i + '" aria-pressed="' + (i === 0) + '">' + name + '</button>').join('')}</div>
    <div class="problem-layout" data-active="0">
      <article class="surface problem-panel statement" data-area="0" aria-label="题面">
        ${problem.background ? '<h2>题目背景</h2><p>' + h(problem.background) + '</p>' : ''}
        <h2>题目描述</h2><p>${h(problem.description)}</p>
        ${projectBrief ? projectBriefMarkup(projectBrief) : ''}
        ${problem.practice ? '<h3>章外练习 · ' + h(problem.practice.tier) + '</h3><p>先修 ' +
          h(problem.practice.prerequisites) + '</p><p>主要知识 ' + h(problem.practice.primary.join('、')) +
          '。次要知识 ' + h(problem.practice.secondary.join('、')) + '。</p>' : ''}
        <h2>输入格式</h2><p>${h(problem.input)}</p>
        <h2>输出格式</h2><p>${h(problem.output)}</p>
        ${problem.outputComparison === 'exact' ? '<p>本题精确比较文本。LF、CRLF 和 CR 视为同一种换行，保留行首、行内和行尾空白以及空行。最后一行的结束换行可省略。</p>' : ''}
        <div class="section-heading"><h2>样例</h2><button class="button secondary" type="button" id="sample-run">试跑样例</button></div>
        ${interfaceSample ? '<p>样例直接导入你的代码，检查返回值、对象状态或回调记录。</p>' : `<div class="comparison samples">
          <div><div class="section-heading"><h3>样例输入</h3><button class="link-button" type="button" id="copy-input">复制输入</button></div>${codeBlock(sampleInput)}</div>
          <div><div class="section-heading"><h3>样例输出</h3><button class="link-button" type="button" id="copy-output">复制输出</button></div>${codeBlock(sampleOutput)}</div>
        </div>`}
        <h2>样例解释</h2><p>${h(sampleExplanation)}</p>
        ${sampleChecks?.calls && !interfaceSample ? '<h3>样例调用与返回值</h3>' + codeBlock(sampleChecks.calls.map(call =>
          problem.contract?.target?.name + '(' + call.args.map(arg => JSON.stringify(arg)).join(', ') + ') → ' +
          JSON.stringify(call.expected)).join('\n')) : ''}
        ${(sampleChecks?.fixtures ?? []).map(file => '<h3>' + (interfaceSample ? '样例检查代码' : '样例输入文件 ' + h(file.name)) + '</h3>' +
          codeBlock(file.content)).join('')}
        ${(sampleChecks?.artifacts ?? []).map(file => '<h3>样例产物 ' + h(file.name) + '</h3>' +
          codeBlock(file.content)).join('')}
        <h2>数据范围</h2><p>${h(problem.limits)}</p>
        ${advancedLesson && problem.guide ? '<h2>考查知识点</h2><p>' + h(problem.guide.concepts.join('、')) + '</p>' : ''}
        ${originMarkup(problem)}
        <details><summary>提示 1 · 思路</summary><p>${h(problem.hints[0])}</p></details>
        <details><summary>提示 2 · 实现</summary><p>${h(problem.hints[1])}</p></details>
        <details><summary>查看参考解法</summary>${solutionMarkup(problem)}</details>
      </article>
      <section class="surface problem-panel" data-area="1"><h2>代码编辑器</h2><div data-editor></div></section>
      <section class="surface problem-panel evaluation" data-area="2"><h2>运行与评测</h2>
        <div data-console></div>
        <details class="history"><summary>评测记录</summary><div id="attempts"></div></details>
      </section>
    </div>`;
  const chapter = advancedLesson?.chapter ?? chapters[problem.tag];
  const exercise = chapter?.exercises.find(item => item.kind === 'coding' && item.problem === problem.id);
  const template = chapter && exercise?.kind === 'coding' ?
    chapterExamples(chapter).find(example => example.id === exercise.starterExample)?.source : undefined;
  const blank = '# 在此编写解法\n';
  const starter = modify ? template ?? (lesson?.exampleFiles ?
    'import math\n\n# 按题意调整模块调用和输入输出\n' : lesson?.example ?? blank) : blank;
  const structured = problem.starterFiles ?? (problem.contract ? [{ name: 'main.py', content: starter }] : undefined);
  const workspace = projectWorkspace ?? (structured ? (data.taskWorkspaces[problem.id] ??= {
    files: structured.map(file => ({ ...file })), active: 'main.py', entry: 'main.py', input: sampleInput,
  }) : { files: [{ name: 'main.py', content: data.drafts[problem.id] ?? starter }], active: 'main.py', entry: 'main.py',
    input: data.problemInputs[problem.id] ?? sampleInput });
  const panels = must(main, '.problem-layout');
  function selectPanel(index: number) {
    panels.dataset.active = String(index);
    for (const button of main.querySelectorAll('[data-pane]')) button.setAttribute('aria-pressed', String(button.getAttribute('data-pane') === String(index)));
  }
  for (const button of main.querySelectorAll<HTMLButtonElement>('[data-pane]')) button.addEventListener('click', () => selectPanel(Number(button.dataset.pane)));
  function saveDraft() {
    if (!structured && !projectWorkspace) {
      data.drafts[problem.id] = workspace.files[0].content;
      data.problemInputs[problem.id] = workspace.input;
    }
    save();
  }
  const ui = executionUI(main, workspace, saveDraft, problem.contract?.kind === 'module', false, true, () => selectPanel(1), resultKey, true);
  function showAttempts() {
    const attempts = data.attempts[problem.id] ?? [];
    must(main, '#personal').textContent = personal(problem);
    must(main, '#attempts').innerHTML = attempts.length ? '<ul class="attempt-list">' + attempts.map(attempt => '<li>' +
      badge(attempt.verdict) + '<span>' + attempt.passed + ' / ' + attempt.total + ' 组</span><time>' +
      h(new Date(attempt.date).toLocaleString('zh-CN', { hour12: false })) + '</time></li>').join('') + '</ul>' :
      '<p class="muted">还没有提交记录。</p>';
  }
  showAttempts();
  const matchesOutput = (expected: string, actual: string) =>
    normalizeOutput(expected, problem.outputComparison) === normalizeOutput(actual, problem.outputComparison);
  function outputDifference(expected: string, actual: string) {
    if (problem.outputComparison !== 'exact') return '';
    const detail = exactOutputDifference(expected, actual);
    return detail ? '<p class="muted">' + h(detail) + '</p>' : '';
  }
  function showTrial(result: RunResult, sampleRun: boolean, snapshot?: Snapshot, restored = '') {
    const comparable = ['OK', 'RE', 'TLE', 'OLE'].includes(result.status);
    const outputMatches = matchesOutput(sampleOutput, result.stdout);
    const failure = result.status !== 'OK' || !!result.assessmentIssue || !outputMatches;
    const sampleResult = sampleRun && comparable ? (failure ? badge(result.status === 'OK' ? 'WA' : result.status) +
      (result.status === 'OK' ? outputDifference(sampleOutput, result.stdout) : '') +
      (outputMatches && result.assessmentIssue ? '' : compare(sampleOutput, result.stdout)) :
      '<p class="passed">' + (problem.contract ? '样例契约通过' : '样例输出一致') + '</p>') : '';
    ui.setResult(restored + sampleResult + runMarkup(result), result, snapshot);
  }
  const previous = data.runs[resultKey];
  if (previous) showTrial(previous.report, !!previous.sample && !previous.truncated, previous.snapshot, restoredRunHeading(previous.truncated));
  async function trial() {
    await ui.act(async signal => {
      selectPanel(2);
      const snapshot = ui.editor.snapshot(ui.input.value);
      ui.pending('正在加载隔离解释器…');
      const sampleRun = snapshot.input === sampleInput;
      const result = await runTask(problem, snapshot, sampleChecks, signal, () => ui.pending('程序正在运行…'), sampleRun);
      if (!ui.active()) return;
      rememberRun(resultKey, result, snapshot, sampleRun);
      showTrial(result, sampleRun, snapshot);
    });
  }
  ui.run.addEventListener('click', () => void trial());
  must(main, '#sample-run').addEventListener('click', () => {
    if (ui.run.disabled) return;
    ui.input.value = sampleInput;
    workspace.input = sampleInput;
    saveDraft();
    void trial();
  });
  if (!interfaceSample) {
    must<HTMLButtonElement>(main, '#copy-input').onclick = event => void copy(event.currentTarget as HTMLButtonElement, sampleInput);
    must<HTMLButtonElement>(main, '#copy-output').onclick = event => void copy(event.currentTarget as HTMLButtonElement, sampleOutput);
  }
  ui.submitButton!.addEventListener('click', () => void ui.act(async signal => {
    selectPanel(2);
    saveDraft();
    const cases = [[sampleInput, sampleOutput, sampleChecks] as const, ...problem.cases];
    const snapshot = ui.editor.snapshot('');
    let passed = 0;
    let verdict: HistoryRecord['verdict'] = 'AC';
    let sampleFailure: RunResult | undefined;
    let difference = '';
    let issue = '';
    for (const [input, expected, checks] of cases) {
      ui.pending('正在评测第 ' + (passed + 1) + ' / ' + cases.length + ' 组…');
      const result = await runTask(problem, { ...snapshot, input }, checks, signal);
      if (!ui.active()) return;
      if (result.status === 'STOP' || result.status === 'UNAVAILABLE' || result.status === 'INVALID') {
        ui.setResult(runMarkup(result));
        return;
      }
      if (result.status !== 'OK' || result.assessmentIssue || !matchesOutput(expected, result.stdout)) {
        verdict = result.status === 'OK' ? 'WA' : result.status;
        if (!passed) sampleFailure = result;
        if (result.assessmentIssue) issue = result.assessmentIssue;
        else if (verdict === 'WA') {
          difference = outputDifference(expected, result.stdout);
          if (problem.contract) issue = '标准输出与题面约定不符。';
        } else if (result.diagnostic && (problem.contract || structured)) {
          issue = '运行异常 · ' + result.diagnostic.kind;
        }
        break;
      }
      passed++;
    }
    record(problem.id, { date: Date.now(), verdict, passed, total: cases.length });
    showAttempts();
    ui.setResult('<div class="result-heading">' + badge(verdict) + '<span>通过 ' + passed + ' / ' + cases.length + ' 组</span></div>' +
      (verdict === 'AC' ? '<p class="passed">全部用例通过，已更新完成状态。</p>' :
        '<p class="muted">' + (sampleFailure ? '样例未通过。' : '非样例用例未通过。') + h(advice[verdict]) + '</p>') +
      (issue ? '<p class="muted">' + h(issue) + '</p>' : '') + difference +
      (sampleFailure && !sampleFailure.assessmentIssue ? compare(sampleOutput, sampleFailure.stdout) : '') +
      (verdict === 'WA' && problem.guide ? '<p class="muted">' + h(problem.guide.pitfall) + '</p>' : ''), sampleFailure, snapshot);
  }));
  return ui.dispose;
}

