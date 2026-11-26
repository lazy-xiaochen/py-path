import './style.css';
import { mountChapter } from './chapter-page';
import { advancedLessonRoute, advancedLessons, advancedModuleRoute, advancedModules,
  type AdvancedLesson, type AdvancedModule } from './advanced';
import { chapters } from './chapters';
import { allProblems, lessons, practiceTiers, projects } from './content';
import { workspaceConsole } from './execution';
import { accuracy, chapterStats, lessonStats, problemsForLesson } from './learning';
import { problemPage, problemLink, personal, difficultyClass, originLabel } from './problem-page';
import { data, progress, save, storageFailed, type Workspace } from './storage';
import { mountThemeToggle } from './theme';
import { badge, codeBlock, h, must } from './ui';

const app = must(document, '#app');
let dispose = () => {};
const nav = [
  ['learn', '从零开始', '按章节读懂示例，动手改写，再独立解题。', '基础篇与进阶篇', 'green', '▤'],
  ['bank', '题库练习', '查找练习题，运行样例并提交评测。', allProblems.length + ' 道题', 'blue', '⌘'],
  ['review', '专项复习', '速查知识点和典型错误，重做错题。', (lessons.length + advancedLessons.length) + ' 个知识点', 'purple', '↺'],
  ['lab', '在线工作台', '在浏览器编辑并运行多文件 Python。', '多文件编辑', 'orange', '›_'],
];

export function link(href: string, label: string, className = 'button') {
  return '<a class="' + className + '" href="#' + href + '">' + label + '</a>';
}

export function layout(route: string, body: string) {
  const active = route === 'problem' ? 'bank' : route === 'project' || route === 'projects' ? 'learn' : route;
  app.innerHTML = `
    <a href="#main-content" class="skip">跳过导航</a>
    <header class="site-header"><div class="site-width header-inner">
      <a class="brand" href="#home" aria-label="Py径首页"><span class="brand-icon" aria-hidden="true">›_</span><strong>Py径</strong></a>
      <nav aria-label="主导航">${nav.map(([id, label, , , , icon]) =>
        '<a href="#' + id + '"' + (active === id ? ' aria-current="page"' : '') + '><span class="nav-icon" aria-hidden="true">' +
        icon + '</span>' + label + '</a>').join('')}</nav>
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
    <a class="surface project-card" href="#project/${project.id}"><span class="project-art" aria-hidden="true"></span>
      <span class="tag">${h(project.tags)}${project.assessment && data.solved[project.id] ? ' · 已通过' : ''}</span><h3>${h(project.title)}</h3>
      <p>${h(project.description)}</p><span class="card-arrow" aria-hidden="true">↗</span>
    </a>`).join('') + '</div>';
}
const projectSection = () => '<section class="home-section"><div class="section-heading"><h2>综合项目</h2></div>' + projectCards() + '</section>';

function lessonGrid(courses: { route: string; tag: string; title: string; completed: number; total: number }[],
  heading: 'h2' | 'h3' | 'h4') {
  return '<div class="lesson-grid">' + courses.map((course, index) => `
    <a class="surface lesson-card" href="#${course.route}"><span class="lesson-number">${String(index + 1).padStart(2, '0')}</span>
      <div><span class="muted">${h(course.tag)}</span><${heading}>${h(course.title)}</${heading}></div>
      <span class="tag">${course.completed} / ${course.total}</span>
      <span class="lesson-meter" aria-hidden="true"><i style="width: ${course.total ? Math.round(course.completed / course.total * 100) : 0}%"></i></span></a>`).join('') + '</div>';
}

function advancedCourseGrid(courses: AdvancedLesson[], heading: 'h3' | 'h4',
  stats = courses.map(lesson => chapterStats(lesson.chapter))) {
  return lessonGrid(courses.map((lesson, index) => ({
    ...stats[index], tag: lesson.tag, title: lesson.title, route: advancedLessonRoute(lesson),
  })), heading);
}

function advancedCourseSection() {
  return `<section class="home-section" aria-labelledby="advanced-courses-title">
    <div class="section-heading"><h2 id="advanced-courses-title" tabindex="-1">第二阶段 · Python 进阶</h2></div>
    <div class="advanced-stage">${advancedModules.map((module, position) => `<section class="advanced-module" aria-labelledby="module-${module.slug}">
      <div class="section-heading"><div class="module-title">
        <span class="module-mark" data-tone="${position % 3}" aria-hidden="true">${['{ }', '[…]', 'ƒ()'][position % 3]}</span>
        <h3 id="module-${module.slug}">${h(module.title)}</h3><span class="module-count" aria-hidden="true">${module.lessons.length} 节课</span></div>
        ${link(advancedModuleRoute(module), '模块介绍与测评 →', 'inline-link')}</div>
      ${advancedCourseGrid(module.lessons, 'h4')}
    </section>`).join('')}</div>
  </section>`;
}

function home() {
  // Unaltered Python language logo, a PSF trademark: https://www.python.org/community/logos/
  const pythonLogo = new URL('./assets/python-logo-only.png', import.meta.url).href;
  const states = lessons.map((_, index) => lessonStats(index));
  const next = states.findIndex(stats => stats.completed < stats.total);
  const nextHref = 'learn/' + ((next < 0 ? 0 : next) + 1);
  layout('home', `
    <section class="hero">
      <div class="hero-copy">
        <div class="hero-label"><span></span><b class="hero-badge" aria-hidden="true">Python 3.12</b> 中文 Python 学习实验室</div>
        <h1>从第一行代码，<br>到<span>独立解题。</span></h1>
        <p>跟着课程读懂代码、动手运行，再用题目检验掌握程度。已有基础也可以直接刷题，随时回顾错题。</p>
        <div class="hero-actions">${link(nextHref, next > 0 ? '继续学习　→' : '开始第一课　→', 'button primary')}${link(advancedLessonRoute(advancedLessons[0]), '学习进阶篇', 'button secondary')}${link('projects', '综合项目', 'button secondary')}${link('bank', '浏览题库', 'button secondary')}</div>
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
      <div class="hero-stats" aria-hidden="true">
        <div><strong>${lessons.length}</strong><span>节基础课程</span></div>
        <div><strong>${advancedLessons.length}</strong><span>节进阶课程</span></div>
        <div><strong>${allProblems.length}</strong><span>道题</span></div>
        <div><strong>${projects.length}</strong><span>个综合项目</span></div>
      </div>
    </section>
    <section class="home-section">
      <div class="section-heading"><h2>选择你的学习方式</h2></div>
      <div class="entry-grid">${nav.map(([id, label, description, metric, color, icon]) => `
        <a class="surface entry-card ${color}" href="#${id}">
          <span class="entry-glow" aria-hidden="true"></span>
          <span class="entry-icon" aria-hidden="true">${icon}</span><span class="card-arrow" aria-hidden="true">↗</span>
          <h3>${label}</h3><p>${description}</p><span class="entry-metric">${metric}</span>
        </a>`).join('')}</div>
    </section>
    <section class="home-section" aria-hidden="true">
      <div class="feature-strip">
        <div class="surface feature-card">
          <div class="feature-visual"><span class="fv-pill">Python 3.12</span><span class="fv-pill muted">WASM 隔离沙箱</span></div>
          <h3>打开浏览器即写即跑</h3>
          <p>内置独立 Python 运行环境，无需本地安装配置，支持多文件编辑与标准输入。</p>
        </div>
        <div class="surface feature-card">
          <div class="feature-visual"><span class="fv-verdict ac">AC</span><span class="fv-verdict wa">WA</span><span class="fv-verdict re">RE</span><span class="fv-verdict tle">TLE</span><span class="fv-verdict ole">OLE</span></div>
          <h3>即时评测与报错定位</h3>
          <p>支持样例试跑与多组用例评测，运行出错直接给出中文说明并定位到对应代码行。</p>
        </div>
        <div class="surface feature-card">
          <div class="feature-visual"><span class="fv-dot"></span><code>localStorage · 深/浅主题</code></div>
          <h3>纯本地保存 · 随时回顾</h3>
          <p>代码草稿、提交记录与错题自动保存在本地浏览器，不上传任何个人数据。</p>
        </div>
      </div>
    </section>`);
}

function learn() {
  const states = lessons.map((_, index) => lessonStats(index));
  const finished = states.filter(state => state.completed === state.total).length;
  const done = states.reduce((sum, state) => sum + state.completed, 0);
  const all = states.reduce((sum, state) => sum + state.total, 0);
  layout('learn', title('从零开始', '从标准输入输出到综合解题。按路线前进，或直接进入感兴趣的章节。') +
    '<p class="learning-overview muted">已完成 ' + finished + ' / ' + lessons.length + ' 节课 · 已完成 ' + done + ' / ' + all + ' 个学习检查与练习</p>' +
    '<section id="foundation-courses" aria-label="基础篇课程">' + lessonGrid(lessons.map((lesson, index) => ({
      ...states[index], tag: lesson.tag, title: lesson.title, route: 'learn/' + (index + 1),
    })), 'h2') + '</section>' + advancedCourseSection() + projectSection());
}

function projectsPage() {
  layout('projects', link('home', '← 返回首页', 'inline-link') +
    title('综合项目', '把所学知识串联成完整程序，按验收标准调试并提交。') +
    projectCards());
}

function advancedOverview() {
  layout('learn', link('learn', '← 基础篇', 'inline-link') +
    title('第二阶段 · Python 进阶与编程能力提升', '完成基础篇后，按数据结构、表达方式、函数机制和程序设计的顺序继续学习。') +
    `<section class="home-section">
      <div class="project-grid">
        ${advancedModules.map(module => `<a class="surface project-card" href="#${advancedModuleRoute(module)}">
          <span class="tag">${module.lessons.length} 节课</span><h3>${h(module.title)}</h3>
          <p>${h(module.introduction)}</p><span class="card-arrow" aria-hidden="true">↗</span></a>`).join('')}
      </div>
    </section>`);
}

function advancedModuleOverview(module: AdvancedModule) {
  const stats = module.lessons.map(lesson => chapterStats(lesson.chapter));
  const total = stats.reduce((sum, stat) => sum + stat.total, 0);
  const done = stats.reduce((sum, stat) => sum + stat.completed, 0);
  const next = advancedModules[advancedModules.indexOf(module) + 1];
  const list = (values: string[]) => '<ul>' + values.map(value => '<li>' + h(value) + '</li>').join('') + '</ul>';
  layout('learn', link('learn', '← 学习路径', 'inline-link') +
    title(module.title, module.introduction) +
    `<section class="surface lesson-stage chapter-overview">
      <div class="section-heading"><h2>学习目标</h2><span class="tag">已完成 ${done} / ${total} 项</span></div>
      ${list(module.goals)}
      <h3>前置知识</h3><p>${h(module.prerequisites)}</p>
    </section>
    <section class="home-section"><div class="section-heading"><h2>课程顺序</h2>
      ${link('bank/advanced', '进阶题库 →', 'inline-link')}</div>
      ${advancedCourseGrid(module.lessons, 'h3', stats)}
    </section>
    <section class="surface lesson-stage chapter-overview home-section">
      <h2>知识关联与阶段测评</h2>
      <figure class="chapter-diagram"><figcaption>${h(module.mapCaption)}</figcaption>${codeBlock(module.map)}</figure>
      ${list(module.summary)}
      <ul class="practice-list">${[...module.practice, module.assessment].map(item => `<li>
        <div>${link('problem/' + item.id, item.label, 'inline-link')}<p>${h(item.criterion)}</p></div>
        <span class="tag">${data.solved[item.id] ? '已通过' : data.mistakes[item.id] ? '待重做' : '待练习'}</span>
      </li>`).join('')}</ul>
      <h3>章外迁移测评</h3>
      <ul class="practice-list"><li>
        <div>${link('problem/' + module.transfer.id, module.transfer.label, 'inline-link')}<p>${h(module.transfer.criterion)}</p></div>
        <span class="tag" data-transfer-status>${data.solved[module.transfer.id] ? '已通过' : data.mistakes[module.transfer.id] ? '待重做' : '待练习'}</span>
      </li></ul>
    </section>${next ? `<div class="lesson-next">${link(advancedModuleRoute(next), '下一模块 · ' + h(next.title) + ' →', 'button secondary')}</div>` : ''}`);
}

function advancedLessonPage(module: AdvancedModule, index: number, questionId?: string) {
  const lesson = module.lessons[index];
  const previous = module.lessons[index - 1];
  const next = module.lessons[index + 1];
  const moduleRoute = advancedModuleRoute(module);
  const directory = `<aside class="surface lesson-aside"><h2>课程目录</h2>${advancedModules.map(group =>
    `<h3>${h(group.title)}</h3>` + group.lessons.map((item, position) =>
      `<a href="#${advancedLessonRoute(item)}" ${item.slug === lesson.slug ? 'aria-current="page"' : ''}><span>${String(position + 1).padStart(2, '0')}</span>${h(item.title)}</a>`).join('')).join('')}</aside>`;
  const main = layout('learn', '<div class="lesson-hero">' + link(moduleRoute, '← ' + h(module.title), 'inline-link') +
    title('第 ' + (index + 1) + ' 课 · ' + lesson.title, '第二阶段 · ' + module.title) + '</div>' +
    '<div class="lesson-layout">' + directory + '<div class="lesson-body" data-chapter></div></div>');
  const navigation = (previous ? link(advancedLessonRoute(previous), '← 上一课', 'button secondary') : '') +
    (next ? link(advancedLessonRoute(next), '下一课 →', 'button secondary') :
      link('problem/' + module.assessment.id, '开始课内阶段测评 →', 'button primary') +
      link('problem/' + module.transfer.id, '开始章外迁移测评 →', 'button secondary') + link(moduleRoute, '返回模块', 'button secondary'));
  dispose = mountChapter(must(main, '[data-chapter]'), lesson.slug, lesson.chapter, questionId, navigation);
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
    const main = layout('learn', '<div class="lesson-hero">' + link('learn', '← 学习路径', 'inline-link') +
      title('第 ' + (index + 1) + ' 课 · ' + lesson.title, lesson.tag) + '</div>' +
      '<div class="lesson-layout">' + lessonDirectory(index) + '<div class="lesson-body" data-chapter></div></div>');
    dispose = mountChapter(must(main, '[data-chapter]'), index, chapter, focus);
    return;
  }
  const [modify, independent] = problemsForLesson(index);
  const quiz = (name: 'check' | 'predict', complete: boolean) => `
    <fieldset class="quiz" data-quiz="${name}"><legend>${h(lesson[name].question)}</legend>
      ${lesson[name].choices.map((choice, i) => '<button type="button" class="button secondary" data-answer="' + i + '">' + h(choice) + '</button>').join('')}
      <p class="quiz-feedback" role="status">${complete ? '已通过知识检查。' : ''}</p></fieldset>`;
  const main = layout('learn', '<div class="lesson-hero">' + link('learn', '← 学习路径', 'inline-link') +
    title('第 ' + (index + 1) + ' 课 · ' + lesson.title, lesson.tag) + '</div>' + `
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

function bank(initialTag = '', initialScope = '', initialStage = '') {
  const tags = [...lessons, ...advancedLessons].map(lesson => lesson.tag);
  const advancedTags = new Set(advancedLessons.map(lesson => lesson.tag));
  const main = layout('bank', title('题库练习', '运行可自行测试，提交评测后记录学习结果。') + `
    <div class="hero-actions">${link('bank/advanced', '进阶练习', 'button secondary')}${link('bank/independent', '章外练习', 'button secondary')}
      ${practiceTiers.map(tier => link('bank/independent/' + encodeURIComponent(tier), tier, 'button secondary')).join('')}</div>
    <section class="surface bank-panel">
      <div class="filters">
        <label>搜索题目<input type="search" id="search" placeholder="题号、标题或知识点"></label>
        <label>练习范围<select id="scope"><option value="">全部练习</option><option value="chapter">章内</option>
          <option value="independent">全部章外</option>${practiceTiers.map(tier => '<option>' + tier + '</option>').join('')}</select></label>
        <label>学习阶段<select id="stage"><option value="">全部阶段</option><option value="foundation">基础篇</option>
          <option value="advanced">进阶篇</option></select></label>
        <label>知识点<select id="tag"><option value="">全部知识点</option>${tags.map(tag => '<option>' + h(tag) + '</option>').join('')}</select></label>
        <label>难度<select id="difficulty"><option value="">全部难度</option><option>入门</option><option>基础</option><option>进阶</option></select></label>
        <label>来源<select id="origin"><option value="">全部来源</option><option>原创</option><option>经典改编</option></select></label>
        <label>完成状态<select id="completion"><option value="">全部状态</option><option>未开始</option><option>已尝试</option><option>已通过</option><option>待重做</option></select></label>
      </div><p id="match-count" class="muted count" role="status"></p><div id="matches"></div>
    </section>`);
  const search = must<HTMLInputElement>(main, '#search');
  const scope = must<HTMLSelectElement>(main, '#scope');
  const stage = must<HTMLSelectElement>(main, '#stage');
  const tag = must<HTMLSelectElement>(main, '#tag');
  const difficulty = must<HTMLSelectElement>(main, '#difficulty');
  const origin = must<HTMLSelectElement>(main, '#origin');
  const completion = must<HTMLSelectElement>(main, '#completion');
  tag.value = tags.includes(initialTag) ? initialTag : '';
  scope.value = initialScope;
  stage.value = initialStage;
  function filter() {
    const keyword = search.value.trim().toLowerCase();
    const items = allProblems.filter(problem =>
      [problem.id, problem.title, problem.tag, ...(problem.guide?.concepts ?? []), ...(problem.origin?.kind === 'adapted' ?
        [problem.origin.title, problem.origin.platform, problem.origin.id] : [])].join(' ').toLowerCase().includes(keyword) &&
      (!scope.value || (scope.value === 'chapter' ? !problem.practice :
        scope.value === 'independent' ? !!problem.practice : scope.value === problem.practice?.tier)) &&
      (!stage.value || (stage.value === 'advanced') === advancedTags.has(problem.tag)) &&
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
  const wrong = [...allProblems, ...projectProblems].filter(problem => data.mistakes[problem.id]);
  const reviewLessons = [
    ...lessons.map((lesson, index) => ({ ...lesson, chapter: chapters[lesson.tag], route: 'learn/' + (index + 1),
      bankRoute: 'bank/' + encodeURIComponent(lesson.tag), stats: lessonStats(index) })),
    ...advancedLessons.map(lesson => ({ ...lesson, route: advancedLessonRoute(lesson),
      bankRoute: 'bank/advanced/' + encodeURIComponent(lesson.tag), stats: chapterStats(lesson.chapter),
      theory: '', mistake: '' })),
  ];
  const questions = reviewLessons.flatMap(lesson => (lesson.chapter?.exercises ?? []).flatMap(exercise =>
    exercise.kind === 'question' && data.questions[exercise.id] && data.questions[exercise.id].lastChoice !== exercise.answer ?
      [{ exercise, route: lesson.route, tag: lesson.tag }] : []));
  const count = wrong.length + questions.length;
  layout('review', title('专项复习', '回顾自己卡住的知识点，并用错题验证修正。') + `
    <section class="surface bank-panel"><div class="section-heading"><h2>错题重做</h2><span class="tag">${count} 道待重做</span></div>
      ${count ? '<div class="wrong-list">' + wrong.map(problem => `
        <div><code>${problem.id}</code><strong>${problem.title}</strong><span class="tag">${problem.tag}</span>
          ${badge(data.attempts[problem.id][0].verdict)}${projectProblems.includes(problem) ?
            link('project/' + problem.id, '重做结项', 'button secondary') :
            link('problem/' + problem.id, '重做 ' + problem.id, 'button secondary')}</div>`).join('') +
        questions.map(({ exercise, route, tag }) => `<div><span class="tag">${h(tag)}</span><strong>${h(exercise.goal)}</strong>
          ${link(route + '/' + exercise.id, '重做知识题', 'button secondary')}</div>`).join('') +
        '</div>' : '<p class="empty">暂无待重做的题目。答错知识题或提交评测遇到错误后，可从这里继续练习。</p>'}</section>
    <section class="home-section"><div class="section-heading"><h2>知识点速查</h2></div>
      <p class="muted learning-overview">正确率根据已记录的知识题答案和编程提交计算。</p>
      <div class="review-grid">${reviewLessons.map(lesson => {
        const { chapter, stats } = lesson;
        return `<article class="surface review-card">
        <h3>${lesson.tag}</h3><p class="topic-progress">${stats.completed} / ${stats.total} 已完成 · 正确率 ${accuracy(stats.correctCount, stats.attemptCount)}</p>
        <p>${h(chapter?.summary[0] ?? lesson.theory)}</p><h4>典型错误</h4><p>${h(chapter?.mistakes[0].fix ?? lesson.mistake)}</p>
        <div>${link(lesson.route, '复习课程', 'inline-link')}${link(lesson.bankRoute, '专项练习 →', 'inline-link')}</div>
      </article>`; }).join('')}</div></section>`);
}

function lab(project?: typeof projects[number]) {
  if (project?.assessment) {
    const workspace = data.projects[project.id] ??= {
      files: project.files.map(file => ({ ...file })), active: 'main.py', entry: 'main.py', input: project.input,
    };
    dispose = problemPage(project.assessment, false, layout('project', ''), workspace, project.brief);
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
  const [route, param, action, focus] = location.hash.slice(1).split('/');
  const problem = allProblems.find(item => item.id === param);
  const project = projects.find(item => item.id === param);
  const lesson = Number(param) - 1;
  const module = route === 'learn' && param === 'advanced' && action ?
    advancedModules.find(item => item.slug === action || item.lessons.some(lesson => lesson.slug === action)) : undefined;
  if (!route || route === 'home') home();
  else if (route === 'learn' && !param) learn();
  else if (route === 'projects') projectsPage();
  else if (route === 'learn' && param === 'advanced' && !action) advancedOverview();
  else if (module) {
    const index = module.lessons.findIndex(lesson => lesson.slug === action);
    if (index < 0) advancedModuleOverview(module);
    else advancedLessonPage(module, index, focus);
  }
  else if (route === 'learn' && Number.isInteger(lesson) && lessons[lesson]) lessonPage(lesson, action);
  else if (route === 'bank') {
    let tag = '';
    try { tag = decodeURIComponent(param ?? ''); } catch { /* malformed fragment */ }
    if (tag === 'independent') {
      const tier = practiceTiers.find(item => encodeURIComponent(item) === action || item === action);
      bank('', tier ?? 'independent');
    } else if (tag === 'advanced') {
      let topic = '';
      try { topic = decodeURIComponent(action ?? ''); } catch { /* malformed fragment */ }
      bank(topic, '', 'advanced');
    } else bank(tag);
  }
  else if (route === 'review') review();
  else if (route === 'lab') lab();
  else if (route === 'problem' && problem) dispose = problemPage(problem, action === 'modify', layout('problem', ''));
  else if (route === 'project' && project) lab(project);
  else layout('', title('页面未找到', '请从首页选择学习入口。') + link('home', '返回首页'));
  window.scrollTo(0, 0);

  const directory = app.querySelector<HTMLElement>('.lesson-aside');
  const lessonLayout = directory?.closest<HTMLElement>('.lesson-layout');
  if (directory && lessonLayout) {
    const updateDirectoryHeight = () => {
      const top = Math.ceil(lessonLayout.getBoundingClientRect().top);
      directory.style.setProperty('--lesson-directory-top', top + 'px');
    };
    updateDirectoryHeight();
    const listeners = new AbortController();
    addEventListener('scroll', updateDirectoryHeight, { passive: true, signal: listeners.signal });
    addEventListener('resize', updateDirectoryHeight, { signal: listeners.signal });
    const disposeLesson = dispose;
    dispose = () => {
      listeners.abort();
      disposeLesson();
    };
  }
}

addEventListener('hashchange', render);
render();

