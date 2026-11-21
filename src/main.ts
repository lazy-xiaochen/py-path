import './style.css';
import { mountChapter } from './chapter-page';
import { chapters } from './chapters';
import { lessons, practiceTiers, problems, projects } from './content';
import { workspaceConsole } from './execution';
import { accuracy, lessonStats, problemsForLesson } from './learning';
import { problemPage, problemLink, personal, difficultyClass, originLabel } from './problem-page';
import { data, progress, save, storageFailed, type Workspace } from './storage';
import { mountThemeToggle } from './theme';
import { badge, codeBlock, h, must } from './ui';

const app = must(document, '#app');
let dispose = () => {};
const nav = [
  ['learn', '从零开始', '按章节读懂示例，动手改写，再独立解题。', '12 节课程', 'green', '▤'],
  ['bank', '题库练习', '查找练习题，运行样例并提交评测。', problems.length + ' 道题', 'blue', '⌘'],
  ['review', '专项复习', '速查知识点和典型错误，重做错题。', '12 个知识点', 'purple', '↺'],
  ['lab', '在线工作台', '在浏览器编辑并运行多文件 Python。', '多文件编辑', 'orange', '›_'],
];

export function link(href: string, label: string, className = 'button') {
  return '<a class="' + className + '" href="#' + href + '">' + label + '</a>';
}

export function layout(route: string, body: string) {
  const active = route === 'problem' ? 'bank' : route === 'project' ? 'learn' : route;
  app.innerHTML = `
    <a href="#main-content" class="skip">跳过导航</a>
    <header class="site-header"><div class="site-width header-inner">
      <a class="brand" href="#home" aria-label="Py径首页"><span class="brand-icon" aria-hidden="true">›_</span><strong>Py径</strong></a>
      <nav aria-label="主导航">${nav.map(([id, label]) =>
        '<a href="#' + id + '"' + (active === id ? ' aria-current="page"' : '') + '>' + label + '</a>').join('')}</nav>
      <div class="header-tools">
        <span class="local-state" id="local-storage">${storageFailed ? '本地存储不可用或已满' : '仅本地保存'}</span>
        <button type="button" class="theme-toggle" aria-label="浅色主题"><span class="theme-icon" aria-hidden="true"></span><span class="theme-label" aria-hidden="true"></span></button>
      </div>
    </div></header>
    <main id="main-content" class="site-width main-content" data-page="${route}" tabindex="-1">${body}</main>
    <footer class="site-width footer"><a href="#home">Py径</a><span>简体中文 Python 学习平台</span></footer>`;
  must(app, '.skip').addEventListener('click', event => { event.preventDefault(); must(app, 'main').focus(); });
  mountThemeToggle(must<HTMLButtonElement>(app, '.theme-toggle'));
  return must(app, 'main');
}

const title = (heading: string, description: string) =>
  '<div class="page-heading"><h1>' + h(heading) + '</h1><p>' + h(description) + '</p></div>';

function projectCards() {
  return '<div class="project-grid">' + projects.map(project => `
    <a class="surface project-card" href="#project/${project.id}">
      <span class="tag">${h(project.tags)}${project.assessment && data.solved[project.id] ? ' · 已通过' : ''}</span><h3>${h(project.title)}</h3>
      <p>${h(project.description)}</p><span class="card-arrow" aria-hidden="true">↗</span>
    </a>`).join('') + '</div>';
}
const projectSection = () => '<section class="home-section"><div class="section-heading"><h2>综合项目</h2></div>' + projectCards() + '</section>';

function home() {
  // Unaltered Python language logo, a PSF trademark: https://www.python.org/community/logos/
  const pythonLogo = new URL('./assets/python-logo-only.png', import.meta.url).href;
  const states = lessons.map((_, index) => lessonStats(index));
  const complete = states.filter(stats => stats.completed === stats.total).length;
  const next = states.findIndex(stats => stats.completed < stats.total);
  const nextHref = 'learn/' + ((next < 0 ? 0 : next) + 1);
  layout('home', `
    <section class="hero">
      <div class="hero-copy">
        <div class="hero-label"><span></span> 中文 Python 学习实验室</div>
        <h1>从第一行代码，<br>到<span>独立解题。</span></h1>
        <p>跟着课程读懂代码、动手运行，再用题目检验掌握程度。已有基础也可以直接刷题，随时回顾错题。</p>
        <div class="hero-actions">${link(nextHref, next > 0 ? '继续学习　→' : '开始第一课　→', 'button primary')}${link('bank', '浏览题库', 'button secondary')}</div>
      </div>
      <div class="hero-visual" aria-label="Python 示例，计算代码练习次数">
        <div class="preview-window">
          <div class="preview-bar"><span class="window-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>first_steps.py</span><span class="small-tag">Python</span></div>
          <div class="preview-editor">
            <div><b>1</b><span class="code-comment"># 记录今天的练习</span></div>
            <div><b>2</b>practice = [<em>2</em>, <em>3</em>, <em>4</em>]</div>
            <div><b>3</b>total = <em>0</em></div>
            <div><b>4</b><strong>for</strong> count <strong>in</strong> practice:</div>
            <div><b>5</b>&nbsp;&nbsp;&nbsp;&nbsp;total += count</div>
            <div><b>6</b><samp>print</samp>(<span class="code-string">f"已练习 {total} 道题"</span>)</div>
          </div>
          <div class="preview-output">
            <span><i></i> 标准输出</span><code>›　已练习 9 道题</code>
            <span class="preview-language" aria-hidden="true">
              <img src="${h(pythonLogo)}" width="269" height="326" alt=""><sup>™</sup>
            </span>
          </div>
        </div>
      </div>
    </section>
    <section class="home-section">
      <div class="section-heading"><h2>选择你的学习方式</h2></div>
      <div class="entry-grid">${nav.map(([id, label, description, metric, color, icon]) => `
        <a class="surface entry-card ${color}" href="#${id}">
          <span class="entry-icon" aria-hidden="true">${icon}</span><span class="card-arrow" aria-hidden="true">↗</span>
          <h3>${label}</h3><p>${description}</p><span class="entry-metric">${metric}</span>
        </a>`).join('')}</div>
    </section>
    <section class="home-section">
      <div class="section-heading"><h2>学习路径</h2>${link('learn', '查看完整路线 →', 'inline-link')}</div>
      <div class="surface track-panel">
        <div><strong>课程进度</strong><p class="muted">已完成 ${complete} / ${lessons.length} 节</p></div>
        <progress max="${lessons.length}" value="${complete}" aria-label="课程进度"></progress>
        ${link(nextHref, complete === 12 ? '回顾课程' : '进入下一课', 'button secondary')}
      </div>
    </section>${projectSection()}`);
}

function learn() {
  const states = lessons.map((_, index) => lessonStats(index));
  const finished = states.filter(state => state.completed === state.total).length;
  const done = states.reduce((sum, state) => sum + state.completed, 0);
  const all = states.reduce((sum, state) => sum + state.total, 0);
  layout('learn', title('从零开始', '从标准输入输出到综合解题。按路线前进，或直接进入感兴趣的章节。') +
    '<p class="learning-overview muted">已完成 ' + finished + ' / ' + lessons.length + ' 节课 · 已完成 ' + done + ' / ' + all + ' 个学习检查与练习</p>' +
    '<div class="lesson-grid">' + lessons.map((lesson, index) => `
      <a class="surface lesson-card" href="#learn/${index + 1}"><span class="lesson-number">${String(index + 1).padStart(2, '0')}</span>
        <div><span class="muted">${lesson.tag}</span><h2>${lesson.title}</h2></div>
        <span class="tag">${states[index].completed} / ${states[index].total}</span></a>`).join('') + '</div>' + projectSection());
}

function lessonDirectory(index: number) {
  return `<aside class="surface lesson-aside"><h2>课程目录</h2>${lessons.map((item, position) => `
    <a href="#learn/${position + 1}" ${position === index ? 'aria-current="page"' : ''}>
      <span>${String(position + 1).padStart(2, '0')}</span>${item.title}</a>`).join('')}</aside>`;
}

function lessonPage(index: number, focus?: string) {
  const lesson = lessons[index];
  const chapter = chapters[lesson.tag];
  if (chapter) {
    const main = layout('learn', link('learn', '← 学习路径', 'inline-link') +
      title('第 ' + (index + 1) + ' 课 · ' + lesson.title, lesson.tag) +
      '<div class="lesson-layout">' + lessonDirectory(index) + '<div class="lesson-body" data-chapter></div></div>');
    dispose = mountChapter(must(main, '[data-chapter]'), index, chapter, focus);
    return;
  }
  const [modify, independent] = problemsForLesson(index);
  const quiz = (name: 'check' | 'predict', complete: boolean) => `
    <fieldset class="quiz" data-quiz="${name}"><legend>${h(lesson[name].question)}</legend>
      ${lesson[name].choices.map((choice, i) => '<button type="button" class="button secondary" data-answer="' + i + '">' + h(choice) + '</button>').join('')}
      <p class="quiz-feedback" role="status">${complete ? '已通过知识检查。' : ''}</p></fieldset>`;
  const main = layout('learn', link('learn', '← 学习路径', 'inline-link') +
    title('第 ' + (index + 1) + ' 课 · ' + lesson.title, lesson.tag) + `
    <div class="lesson-layout">
      ${lessonDirectory(index)}
      <div class="lesson-body">
        <section class="surface lesson-stage"><h2><span>1</span>讲解</h2><p>${h(lesson.theory)}</p>
          ${quiz('check', !!data.progress[index]?.explain)}</section>
        <section class="surface lesson-stage"><h2><span>2</span>运行示例</h2>
          <p>先完成下面的新情境预测，再运行示例，观察程序如何处理输入。</p>
          ${quiz('predict', !!data.progress[index]?.predict)}
          <div data-editor></div><div data-console></div></section>
        <section class="surface lesson-stage"><h2><span>3</span>修改示例</h2>
          <p>以本课示例为起点，按新题目调整输入、逻辑和输出。${h(modify.description)}</p>
          ${link('problem/' + modify.id + '/modify', (data.solved[modify.id] ? '已通过 · ' : '') + modify.id + ' ' + modify.title + ' →', 'button secondary')}</section>
        <section class="surface lesson-stage"><h2><span>4</span>独立练习</h2><p>${h(independent.description)}</p>
          ${link('problem/' + independent.id, (data.solved[independent.id] ? '已通过 · ' : '') + independent.id + ' ' + independent.title + ' →', 'button secondary')}</section>
        <div class="lesson-next">${index ? link('learn/' + index, '← 上一课', 'button secondary') : ''}
          ${index < lessons.length - 1 ? link('learn/' + (index + 2), '下一课 →', 'button secondary') : link('learn', '查看综合项目 →', 'button secondary')}</div>
      </div>
    </div>`);
  const example: Workspace = { files: [{ name: 'main.py', content: lesson.example }, ...(lesson.exampleFiles ?? []).map(file => ({ ...file }))],
    active: 'main.py', entry: 'main.py', input: lesson.input };
  const markRun = () => {
    if (data.progress[index]?.example && data.progress[index]?.predict) progress(index, 'run');
  };
  for (const name of ['check', 'predict'] as const) {
    const field = must(main, '[data-quiz="' + name + '"]');
    field.addEventListener('click', event => {
      const answer = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-answer]');
      if (!answer) return;
      const correct = Number(answer.dataset.answer) === lesson[name].answer;
      must(field, '.quiz-feedback').textContent = (correct ? '回答正确。' : '再想一想。') + lesson[name].feedback;
      if (correct) { progress(index, name === 'predict' ? 'predict' : 'explain'); markRun(); }
    });
  }
  dispose = workspaceConsole(main, example, () => {}, {
    readOnly: true,
    notify(result) {
      if (result.status === 'OK') { progress(index, 'example'); markRun(); }
    },
  });
}

function bank(initialTag = '', initialScope = '') {
  const main = layout('bank', title('题库练习', '运行可自行测试，提交评测后记录学习结果。') + `
    <div class="hero-actions">${link('bank/independent', '章外练习', 'button secondary')}
      ${practiceTiers.map(tier => link('bank/independent/' + encodeURIComponent(tier), tier, 'button secondary')).join('')}</div>
    <section class="surface bank-panel">
      <div class="filters">
        <label>搜索题目<input type="search" id="search" placeholder="题号、标题或知识点"></label>
        <label>练习范围<select id="scope"><option value="">全部练习</option><option value="chapter">章内</option>
          <option value="independent">全部章外</option>${practiceTiers.map(tier => '<option>' + tier + '</option>').join('')}</select></label>
        <label>知识点<select id="tag"><option value="">全部知识点</option>${lessons.map(lesson => '<option>' + lesson.tag + '</option>').join('')}</select></label>
        <label>难度<select id="difficulty"><option value="">全部难度</option><option>入门</option><option>基础</option><option>进阶</option></select></label>
        <label>来源<select id="origin"><option value="">全部来源</option><option>原创</option><option>经典改编</option></select></label>
        <label>完成状态<select id="completion"><option value="">全部状态</option><option>未开始</option><option>已尝试</option><option>已通过</option><option>待重做</option></select></label>
      </div><p id="match-count" class="muted count" role="status"></p><div id="matches"></div>
    </section>`);
  const search = must<HTMLInputElement>(main, '#search');
  const scope = must<HTMLSelectElement>(main, '#scope');
  const tag = must<HTMLSelectElement>(main, '#tag');
  const difficulty = must<HTMLSelectElement>(main, '#difficulty');
  const origin = must<HTMLSelectElement>(main, '#origin');
  const completion = must<HTMLSelectElement>(main, '#completion');
  tag.value = lessons.some(lesson => lesson.tag === initialTag) ? initialTag : '';
  scope.value = initialScope;
  function filter() {
    const keyword = search.value.trim().toLowerCase();
    const items = problems.filter(problem =>
      [problem.id, problem.title, problem.tag, ...(problem.origin?.kind === 'adapted' ?
        [problem.origin.title, problem.origin.platform, problem.origin.id] : [])].join(' ').toLowerCase().includes(keyword) &&
      (!scope.value || (scope.value === 'chapter' ? !problem.practice :
        scope.value === 'independent' ? !!problem.practice : scope.value === problem.practice?.tier)) &&
      (!tag.value || problem.tag === tag.value) && (!difficulty.value || problem.difficulty === difficulty.value) &&
      (!origin.value || originLabel(problem) === origin.value) &&
      (!completion.value || (completion.value === '待重做' ? data.mistakes[problem.id] : personal(problem) === completion.value)));
    must(main, '#match-count').textContent = '共 ' + items.length + ' 道题';
    must(main, '#matches').innerHTML = items.length ? `
      <div class="table-scroll"><table role="table"><thead role="rowgroup"><tr role="row"><th scope="col">题号</th><th scope="col">标题</th><th scope="col">难度</th><th scope="col">知识点</th><th scope="col">来源</th><th scope="col">完成状态</th></tr></thead>
      <tbody role="rowgroup">${items.map(problem => `<tr role="row"><td role="cell"><code>${problem.id}</code></td><td role="cell">${problemLink(problem)}</td>
        <td role="cell"><span class="difficulty ${difficultyClass(problem.difficulty)}">${problem.difficulty}</span></td>
        <td role="cell"><span class="tag">${problem.tag}</span>${problem.practice ? ' <span class="tag">' + h(problem.practice.tier) + '</span>' : ''}</td><td role="cell">${originLabel(problem)}</td>
        <td role="cell" class="${data.solved[problem.id] ? 'passed' : 'muted'}">${personal(problem)}</td></tr>`).join('')}</tbody></table></div>`
      : '<p class="empty">当前没有符合条件的题目。</p>';
  }
  must(main, '.filters').addEventListener('input', filter);
  filter();
}

function review() {
  const projectProblems = projects.flatMap(project => project.assessment ?? []);
  const wrong = [...problems, ...projectProblems].filter(problem => data.mistakes[problem.id]);
  const questions = lessons.flatMap((lesson, index) => (chapters[lesson.tag]?.exercises ?? []).flatMap(exercise =>
    exercise.kind === 'question' && data.questions[exercise.id] && data.questions[exercise.id].lastChoice !== exercise.answer ?
      [{ exercise, index, tag: lesson.tag }] : []));
  const count = wrong.length + questions.length;
  layout('review', title('专项复习', '回顾自己卡住的知识点，并用错题验证修正。') + `
    <section class="surface bank-panel"><div class="section-heading"><h2>错题重做</h2><span class="tag">${count} 道待重做</span></div>
      ${count ? '<div class="wrong-list">' + wrong.map(problem => `
        <div><code>${problem.id}</code><strong>${problem.title}</strong><span class="tag">${problem.tag}</span>
          ${badge(data.attempts[problem.id][0].verdict)}${projectProblems.includes(problem) ?
            link('project/' + problem.id, '重做结项', 'button secondary') :
            link('problem/' + problem.id, '重做 ' + problem.id, 'button secondary')}</div>`).join('') +
        questions.map(({ exercise, index, tag }) => `<div><span class="tag">${h(tag)}</span><strong>${h(exercise.goal)}</strong>
          ${link('learn/' + (index + 1) + '/' + exercise.id, '重做知识题', 'button secondary')}</div>`).join('') +
        '</div>' : '<p class="empty">暂无待重做的题目。答错知识题或提交评测遇到错误后，可从这里继续练习。</p>'}</section>
    <section class="home-section"><div class="section-heading"><h2>知识点速查</h2></div>
      <p class="muted learning-overview">正确率根据已记录的知识题答案和编程提交计算。</p>
      <div class="review-grid">${lessons.map((lesson, index) => {
        const stats = lessonStats(index);
        const chapter = chapters[lesson.tag];
        return `<article class="surface review-card">
        <h3>${lesson.tag}</h3><p class="topic-progress">${stats.completed} / ${stats.total} 已完成 · 正确率 ${accuracy(stats.correctCount, stats.attemptCount)}</p>
        <p>${h(chapter?.summary[0] ?? lesson.theory)}</p><h4>典型错误</h4><p>${h(chapter?.mistakes[0].fix ?? lesson.mistake)}</p>
        <div>${link('learn/' + (index + 1), '复习课程', 'inline-link')}${link('bank/' + encodeURIComponent(lesson.tag), '专项练习 →', 'inline-link')}</div>
      </article>`; }).join('')}</div></section>`);
}

function lab(project?: typeof projects[number]) {
  if (project?.assessment) {
    const workspace = data.projects[project.id] ??= {
      files: project.files.map(file => ({ ...file })), active: 'main.py', entry: 'main.py', input: project.input,
    };
    dispose = problemPage(project.assessment, false, layout('project', ''), workspace);
    return;
  }
  const main = layout(project ? 'project' : 'lab', (project ? link('learn', '← 学习路径', 'inline-link') : '') +
    title(project?.title ?? '在线工作台', project?.description ?? '编辑多个文件，准备标准输入，在浏览器里运行 Python。') +
    (project ? `
      <section class="surface project-brief"><h2>项目任务</h2><ol>${project.steps.map(step => '<li>' + h(step) + '</li>').join('')}</ol>
        <details open><summary>验收样例与边界</summary>
          <div class="comparison"><div><h4>标准输入</h4>${codeBlock(project.input)}</div>
            <div><h4>期望输出</h4>${codeBlock(project.expected)}</div></div>
          <p>${h(project.acceptance)}</p></details>
        <details><summary>查看参考实现</summary>${codeBlock(project.solution)}</details></section>` : '') + `
    <div class="workbench-layout">
      <section class="surface problem-panel"><h2>工作区文件</h2><div data-editor></div></section>
      <section class="surface problem-panel"><h2>控制台</h2><div data-console></div></section>
    </div>`);
  const workspace = project ? (data.projects[project.id] ??= {
    files: project.files.map(file => ({ ...file })), active: 'main.py', entry: 'main.py', input: project.input,
  }) : data.workspace;
  dispose = workspaceConsole(main, workspace, save, {
    manage: true, resultKey: project ? 'project:' + project.id : 'lab', prewarm: !project,
  });
}

function render() {
  dispose();
  dispose = () => {};
  const [route, param, action] = location.hash.slice(1).split('/');
  const problem = problems.find(item => item.id === param);
  const project = projects.find(item => item.id === param);
  const lesson = Number(param) - 1;
  if (!route || route === 'home') home();
  else if (route === 'learn' && !param) learn();
  else if (route === 'learn' && Number.isInteger(lesson) && lessons[lesson]) lessonPage(lesson, action);
  else if (route === 'bank') {
    let tag = '';
    try { tag = decodeURIComponent(param ?? ''); } catch { /* malformed fragment */ }
    if (tag === 'independent') {
      const tier = practiceTiers.find(item => encodeURIComponent(item) === action || item === action);
      bank('', tier ?? 'independent');
    } else bank(tag);
  }
  else if (route === 'review') review();
  else if (route === 'lab') lab();
  else if (route === 'problem' && problem) dispose = problemPage(problem, action === 'modify', layout('problem', ''));
  else if (route === 'project' && project) lab(project);
  else layout('', title('页面未找到', '请从首页选择学习入口。') + link('home', '返回首页'));
  window.scrollTo(0, 0);
}

addEventListener('hashchange', render);
render();

