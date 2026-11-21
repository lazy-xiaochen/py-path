import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { exactOutputDifference, normalizeOutput } from '../src/judge.ts';
import { lessons, problems, projects } from '../src/content.ts';
import { chapterExamples, chapters } from '../src/chapters.ts';
import { exerciseLevels } from '../src/teaching-types.ts';

test('输出匹配只忽略换行符差异、行尾空白和末尾空行', () => {
  assert.equal(normalizeOutput('  a  b \r\n\r\nc\t\r\n \n'), '  a  b\n\nc');
  assert.equal(normalizeOutput('a\rb\r'), 'a\nb');
  assert.notEqual(normalizeOutput('a  b'), normalizeOutput('a b'));
  assert.notEqual(normalizeOutput('\na'), normalizeOutput('a'));
  assert.notEqual(normalizeOutput('请输入：a'), normalizeOutput('a'));
  assert.equal(normalizeOutput('\n   \n'), '');
});

test('精确比较统一换行，允许省略一个结束换行并保留其余空白', () => {
  const exact = (text: string) => normalizeOutput(text, 'exact');
  const original = ' A  B \n\n0\n';
  assert.equal(exact(' A  B \r\n\r0\r'), exact(original));
  assert.equal(exact(' A  B \n\n0'), exact(original));
  for (const changed of ['A  B \n\n0\n', ' A B \n\n0\n', ' A  B\n\n0\n', ' A  B \n0\n', original + '\n']) {
    assert.notEqual(exact(changed), exact(original));
  }
  assert.notEqual(exact('\n1\n'), exact('1\n'));
  assert.equal(exactOutputDifference('A \r\n0\r\n', 'A\n0'), '第 1 行第 2 列期望为空格，实际为行尾。');
  assert.equal(exactOutputDifference('上行\n\n下行\n1\n', '上行\n下行\n1\n'), '第 2 行第 1 列期望为行尾，实际为非空白字符。');
  assert.equal(exactOutputDifference('A\n0\n', 'A\n0\n\n'), '第 3 行是多出的输出。');
  assert.equal(exactOutputDifference('A\n0\n', 'A\r\n0'), undefined);
  assert.deepEqual(problems.filter(problem => problem.outputComparison === 'exact').map(problem => problem.id),
    ['P041', 'P062', 'P071', 'P072', 'P083']);
});

test('每课有两种知识检查、两道对应原创题及多组输入', () => {
  assert.equal(lessons.length, 12);
  assert.ok(problems.length >= 24);
  assert.equal(projects.length, 2);
  assert.equal(new Set(problems.map(problem => problem.id)).size, problems.length);
  lessons.forEach((lesson, index) => {
    assert.equal(problems[index * 2].tag, lesson.tag);
    assert.equal(problems[index * 2 + 1].tag, lesson.tag);
    assert.ok(lesson.check.choices[lesson.check.answer]);
    assert.ok(lesson.predict.choices[lesson.predict.answer]);
    assert.notEqual(lesson.check.question, lesson.predict.question);
  });
  for (const problem of problems) {
    assert.ok(problem.cases.length >= 2);
    const { sample } = problem;
    const cases = [[sample[0], sample[1], sample[3]] as const, ...problem.cases];
    const inputs = cases.map(([input]) => input);
    const keys = cases.map(([input, , checks]) => JSON.stringify([input, checks?.fixtures, checks?.calls?.map(call => call.args)]));
    assert.equal(new Set(keys).size, inputs.length, problem.id);
    assert.ok(inputs.every(input => new TextEncoder().encode(input).length <= 32 * 1024), problem.id);
  }
});

test('升级课程具备完整教学结构、可追溯来源和可评测的分层练习', () => {
  assert.deepEqual(new Set(Object.keys(chapters)), new Set(lessons.map(lesson => lesson.tag)));
  assert.ok(problems.every(problem => problem.guide?.approach && problem.guide.steps.length >= 3 &&
    problem.guide.time && problem.guide.space && problem.guide.pitfall && problem.guide.extension));
  const questionIds = new Set<string>();
  for (const [tag, chapter] of Object.entries(chapters)) {
    assert.ok(chapter);
    assert.ok(chapter.goals.length >= 3 && chapter.prerequisites && chapter.summary.length && chapter.next, tag);
    assert.ok(chapter.topics.every(topic => topic.explanation.length >= 2 && topic.examples.length >= 2), tag);
    assert.ok(chapter.mistakes.every(mistake => mistake.reason && mistake.fix && mistake.check), tag);
    assert.ok(chapter.references.length >= 2 && chapter.references.every(reference => new URL(reference.url).hostname === 'docs.python.org'), tag);
    const examples = chapterExamples(chapter);
    assert.equal(new Set(examples.map(example => example.id)).size, examples.length, tag);
    assert.ok(examples.every(example => example.source && example.purpose && example.steps.length >= 3 && example.pitfall), tag);
    for (const example of examples) {
      if (!example.diagnostic) continue;
      const { kind, file, line } = example.diagnostic;
      const source = file === 'main.py' ? example.source : example.files?.find(item => item.name === file)?.content;
      assert.ok(source && kind && Number.isInteger(line) && line >= 1 && line <= source.split('\n').length, example.id);
    }
    assert.ok(chapter.exercises.length >= 8, tag);
    const coding = chapter.exercises.filter(exercise => exercise.kind === 'coding');
    assert.ok(chapter.exercises.filter(exercise => exercise.kind === 'question' || !exercise.warmup).length >= 8, tag);
    assert.equal(new Set(coding.map(exercise => exercise.problem)).size, coding.length, tag);
    assert.deepEqual(new Set(coding.map(exercise => exercise.level)), new Set(exerciseLevels), tag);
    for (const exercise of chapter.exercises) {
      assert.ok(exercise.goal);
      if (exercise.kind === 'question') {
        assert.ok(!questionIds.has(exercise.id));
        questionIds.add(exercise.id);
        assert.ok(exercise.options[exercise.answer] && exercise.options.every(option => option.label && option.feedback));
      } else {
        const problem = problems.find(item => item.id === exercise.problem);
        assert.equal(problem?.tag, tag);
        assert.ok(problem?.guide?.steps.length && problem.guide.time && problem.guide.space, exercise.problem);
        assert.ok(!exercise.starterExample || examples.some(example => example.id === exercise.starterExample));
      }
    }
  }
  const sourceHosts = {
    P030: 'atcoder.jp', P032: 'atcoder.jp', P038: 'atcoder.jp', P042: 'leetcode.com',
    P046: 'atcoder.jp', P050: 'atcoder.jp', P053: 'leetcode.com',
    P058: 'atcoder.jp', P062: 'atcoder.jp',
    P066: 'leetcode.com', P070: 'leetcode.com',
    P081: 'www.luogu.com.cn', P082: 'codeforces.com', P083: 'atcoder.jp', P084: 'leetcode.com',
  };
  for (const [id, hostname] of Object.entries(sourceHosts)) {
    const source = problems.find(problem => problem.id === id)?.origin;
    assert.ok(source?.kind === 'adapted' && source.id && source.title && source.adaptation, id);
    assert.equal(new URL(source.url).hostname, hostname, id);
  }
});

test('章外梯度独立于课程进度，特殊契约具备完整样例与验证数据', () => {
  const assigned = Object.values(chapters).flatMap(chapter => chapter?.exercises.flatMap(exercise =>
    exercise.kind === 'coding' ? [exercise.problem] : []) ?? []);
  assert.equal(new Set(assigned).size, assigned.length);
  for (const problem of problems) {
    assert.equal(assigned.includes(problem.id), !problem.practice, problem.id);
    if (problem.practice) assert.ok(problem.practice.prerequisites && problem.practice.primary.length && problem.practice.secondary.length);
  }
  const capstone = projects.find(project => project.id === 'ledger')?.assessment;
  assert.ok(capstone);
  for (const task of [...problems, capstone].filter(problem => problem.contract)) {
    const all = [task.sample[3], ...task.cases.map(([, , checks]) => checks)];
    assert.ok(task.contract?.files?.includes('main.py'), task.id);
    for (const checks of all) {
      assert.ok(checks, task.id);
      if (task.contract?.target) assert.ok(checks.calls?.length, task.id);
      if (task.contract?.kind === 'file' || task.id === 'ledger') assert.ok(checks.artifacts?.length, task.id);
    }
  }
});

