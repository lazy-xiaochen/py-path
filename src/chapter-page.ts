import { chapterExamples } from './chapters';
import { lessons, problems } from './content';
import { workspaceConsole } from './execution';
import { accuracy, lessonStats, questionSolved } from './learning';
import { data, forgetRun, recordChoice, save, type Workspace } from './storage';
import { exerciseLevels, type Chapter, type Example, type Question } from './teaching-types';
import { codeBlock, h, must } from './ui';

const items = (values: string[], tag: 'ul' | 'ol' = 'ul') =>
  '<' + tag + '>' + values.map(value => '<li>' + h(value) + '</li>').join('') + '</' + tag + '>';

function exampleExpected(example: Example) {
  const diagnostic = example.diagnostic;
  return '<div class="comparison"><div><h4>输入</h4>' + codeBlock(example.input, '（无需输入）') +
    '</div><div><h4>预期输出</h4>' + codeBlock(example.output) +
    (diagnostic ? '<p>预期异常 <code>' + h(diagnostic.kind) + '</code> · ' +
      h(diagnostic.file) + ' · 第 ' + h(diagnostic.line) + ' 行</p>' : '') + '</div></div>';
}

function exampleMarkup(example: Example) {
  return `
    <details class="study-example">
      <summary>${h(example.title)} · ${example.level}</summary>
      <p>${h(example.purpose)}</p>
      <h4>完整代码</h4>${codeBlock(example.source)}
      ${(example.files ?? []).map(file => '<h4>' + h(file.name) + '</h4>' + codeBlock(file.content)).join('')}
      ${exampleExpected(example)}
      <h4>执行过程</h4>${items(example.steps, 'ol')}
      <h4>常见误写</h4><p>${h(example.pitfall)}</p>
      <button type="button" class="button secondary" data-open-example="${h(example.id)}">载入示例编辑器</button>
    </details>`;
}

function questionMarkup(index: number, question: Question) {
  const previous = data.questions[question.id];
  const last = previous?.lastChoice;
  const completed = questionSolved(index, question);
  return `
    <fieldset class="quiz chapter-quiz" id="${h(question.id)}" tabindex="-1">
      <legend>${h(question.prompt)}</legend>
      <p class="muted">${h(question.goal)}</p>
      ${question.demonstration ? codeBlock(question.demonstration.source) : ''}
      <div class="quiz-options">${question.options.map((option, i) =>
        '<button type="button" class="button secondary" data-choice="' + i + '" aria-pressed="' +
        (last === i) + '">' + h(option.label) + '</button>').join('')}</div>
      <p class="quiz-feedback" role="status">${last === undefined ? (completed ? '已完成知识检查。' : '') :
        h((last === question.answer ? '回答正确。' : '再想一想。') + question.options[last]?.feedback)}</p>
    </fieldset>`;
}

function workspaceFor(example: Example): Workspace {
  return {
    files: [{ name: 'main.py', content: example.source }, ...(example.files ?? []).map(file => ({ ...file }))],
    active: 'main.py', entry: 'main.py', input: example.input,
  };
}

export function mountChapter(root: HTMLElement, index: number, chapter: Chapter, questionId?: string) {
  const examples = chapterExamples(chapter);
  const questions = chapter.exercises.filter(exercise => exercise.kind === 'question');
  const coding = chapter.exercises.filter(exercise => exercise.kind === 'coding');
  const warmups = coding.filter(exercise => exercise.warmup);
  const practiceList = (exercises: typeof coding) => exercises.map(exercise => {
    const problem = problems.find(item => item.id === exercise.problem)!;
    const suffix = exercise.starterExample ? '/modify' : '';
    return `<li><div><a class="inline-link" href="#problem/${problem.id}${suffix}">${problem.id} ${h(problem.title)} →</a>
      <p>${h(exercise.goal)}</p></div>
      <span class="tag">${data.solved[problem.id] ? '已通过' : data.mistakes[problem.id] ? '待重做' : problem.difficulty}</span></li>`;
  }).join('');
  root.innerHTML = `
    <section class="surface lesson-stage chapter-overview"><div class="section-heading">
      <h2>学习目标</h2><span class="tag" data-lesson-completed></span></div>
      ${items(chapter.goals)}
      <h3>前置知识</h3><p>${h(chapter.prerequisites)}</p>
      <p class="muted">${h(chapter.version)}</p>
      <p class="muted" data-lesson-accuracy></p>
      <div class="chapter-jumps" aria-label="跳至本课内容">
        <button type="button" class="button quiet" data-chapter-jump="chapter-theory">讲解</button>
        <button type="button" class="button quiet" data-chapter-jump="example-workspace-title">示例编辑器</button>
        <button type="button" class="button quiet" data-chapter-jump="chapter-practice">分层练习</button>
        <button type="button" class="button quiet" data-chapter-jump="chapter-mistakes">常见错误与总结</button>
      </div>
    </section>
    <section class="surface lesson-stage chapter-theory"><h2 id="chapter-theory" tabindex="-1"><span>1</span>讲解</h2>
      ${chapter.topics.map(topic => `<article class="chapter-topic"><h3>${h(topic.title)}</h3>
        ${topic.explanation.map(paragraph => '<p>' + h(paragraph) + '</p>').join('')}
        <div class="study-examples">${topic.examples.map(exampleMarkup).join('')}</div>
      </article>`).join('')}
    </section>
    <section class="surface lesson-stage chapter-editor">
      <h2 id="example-workspace-title" tabindex="-1"><span>2</span>运行与修改示例</h2>
      <div class="example-controls">
        <label>选择示例<select aria-label="选择示例">${examples.map(example =>
          '<option value="' + h(example.id) + '">' + h(example.title) + '</option>').join('')}</select></label>
        <button type="button" class="button secondary" data-reset-example>恢复原始示例</button>
      </div>
      <details class="example-expected"><summary>查看原始示例输入与预期结果</summary><div data-expected></div></details>
      <div data-example-workspace><div data-editor></div><div data-console></div></div>
    </section>
    <section class="surface lesson-stage chapter-practice"><h2 id="chapter-practice" tabindex="-1"><span>3</span>分层练习</h2><h3>基础理解</h3>
      ${questions.map(question => questionMarkup(index, question)).join('')}
      ${warmups.length ? '<div class="practice-level"><h3>热身（选做）</h3><ul class="practice-list">' + practiceList(warmups) + '</ul></div>' : ''}
      ${exerciseLevels.map(level => `<div class="practice-level"><h3>${level}</h3><ul class="practice-list">
        ${practiceList(coding.filter(exercise => exercise.level === level && !exercise.warmup))}</ul></div>`).join('')}
    </section>
    <section class="surface lesson-stage chapter-mistakes"><h2 id="chapter-mistakes" tabindex="-1"><span>4</span>常见错误与总结</h2>
      ${chapter.mistakes.map(mistake => `
        <details><summary>${h(mistake.symptom)}</summary>
          <dl><dt>原因</dt><dd>${h(mistake.reason)}</dd><dt>正确做法</dt><dd>${h(mistake.fix)}</dd>
            <dt>排查方法</dt><dd>${h(mistake.check)}</dd></dl>
        </details>`).join('')}
      <h3>知识总结</h3>${items(chapter.summary)}<p>${h(chapter.next)}</p>
      <details><summary>参考资料</summary><ul class="reading-list">${chapter.references.map(reference => `
        <li>${h(reference.note)} <a class="inline-link" href="${h(reference.url)}" target="_blank" rel="noopener noreferrer">${h(reference.title)} ↗</a></li>`).join('')}</ul></details>
    </section>
    <div class="lesson-next">
      ${index ? '<a class="button secondary" href="#learn/' + index + '">← 上一课</a>' : ''}
      ${index < lessons.length - 1 ? '<a class="button secondary" href="#learn/' + (index + 2) + '">下一课 →</a>' :
        '<a class="button secondary" href="#learn">查看综合项目 →</a>' +
        '<a class="button secondary" href="#bank/independent">章外练习 →</a>' +
        '<a class="button primary" href="#project/ledger">开始结项任务 →</a>'}
    </div>`;
  const select = must<HTMLSelectElement>(root, '.example-controls select');
  const sandbox = must(root, '[data-example-workspace]');
  const heading = must(root, '#example-workspace-title');
  const lessonId = String(index + 1);
  let stopEditor = () => {};

  function mountExample(example: Example) {
    stopEditor();
    const key = 'example:' + lessonId + ':' + example.id;
    const workspace = data.examples[key] ??= workspaceFor(example);
    select.value = example.id;
    if (data.exampleSelections[lessonId] !== example.id) {
      data.exampleSelections[lessonId] = example.id;
      save();
    }
    must(root, '[data-expected]').innerHTML = exampleExpected(example);
    const reset = must<HTMLButtonElement>(root, '[data-reset-example]');
    reset.onclick = () => {
      if (!confirm('恢复这份示例的代码和输入，并清除它的运行结果？')) return;
      data.examples[key] = workspaceFor(example);
      forgetRun(key);
      save();
      mountExample(example);
    };
    stopEditor = workspaceConsole(sandbox, workspace, save, { resultKey: key });
  }

  function updateStats() {
    const stats = lessonStats(index);
    must(root, '[data-lesson-completed]').textContent = '已完成 ' + stats.completed + ' / ' + stats.total + ' 练习';
    must(root, '[data-lesson-accuracy]').textContent = '作答正确率 ' + accuracy(stats.correctCount, stats.attemptCount) +
      ' · 已记录 ' + stats.attemptCount + ' 次作答';
  }
  select.addEventListener('change', () => {
    const example = examples.find(item => item.id === select.value);
    if (example) mountExample(example);
  });
  for (const button of root.querySelectorAll<HTMLButtonElement>('[data-chapter-jump]')) {
    button.addEventListener('click', () => {
      const target = must(root, '#' + button.dataset.chapterJump);
      target.focus();
      target.scrollIntoView({ block: 'start' });
    });
  }
  for (const button of root.querySelectorAll<HTMLButtonElement>('[data-open-example]')) {
    button.addEventListener('click', () => {
      const example = examples.find(item => item.id === button.dataset.openExample);
      if (!example) return;
      if (select.value !== example.id) mountExample(example);
      heading.focus();
      heading.scrollIntoView({ block: 'start' });
    });
  }
  for (const question of questions) {
    const field = must(root, '#' + question.id);
    const buttons = Array.from(field.querySelectorAll<HTMLButtonElement>('[data-choice]'));
    const feedback = must(field, '.quiz-feedback');
    buttons.forEach((button, indexOfChoice) => button.addEventListener('click', () => {
      const correct = indexOfChoice === question.answer;
      recordChoice(question.id, indexOfChoice, correct);
      buttons.forEach(option => option.setAttribute('aria-pressed', String(option === button)));
      feedback.textContent = (correct ? '回答正确。' : '再想一想。') + question.options[indexOfChoice].feedback;
      updateStats();
    }));
  }
  mountExample(examples.find(example => example.id === data.exampleSelections[lessonId]) ?? examples[0]);
  updateStats();
  if (questions.some(question => question.id === questionId)) {
    requestAnimationFrame(() => {
      const field = must(root, '#' + questionId);
      if (field.isConnected) { field.focus(); field.scrollIntoView({ block: 'start' }); }
    });
  }
  return () => stopEditor();
}

