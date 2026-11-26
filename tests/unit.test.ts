import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { loadPyodide } from 'pyodide';
import { exactOutputDifference, normalizeOutput } from '../src/judge.ts';
import { lessons, problems, projects } from '../src/content.ts';
import { chapterExamples, chapters } from '../src/chapters.ts';
import { advancedExerciseLevels, exerciseLevels } from '../src/teaching-types.ts';
import { advancedLessons, advancedModules, advancedProblems } from '../src/advanced.ts';
import type { CaseChecks } from '../src/assessment-types.ts';

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
  assert.deepEqual(projects.map(project => project.id), ['ledger', 'words', 'grade-analysis', 'library-loans']);
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

test('进阶课练习接入对应知识点且学习记录标识唯一', () => {
  const foundationIds = Object.values(chapters).flatMap(chapter => chapter?.exercises.flatMap(exercise =>
    exercise.kind === 'question' ? [exercise.id] : [exercise.problem]) ?? []);
  const exercises = advancedLessons.flatMap(lesson => lesson.chapter.exercises);
  const ids = [...foundationIds, ...exercises.map(exercise => exercise.kind === 'question' ? exercise.id : exercise.problem)];
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(new Set(exercises.flatMap(exercise => exercise.kind === 'coding' ? [exercise.problem] : [])),
    new Set(advancedProblems.filter(problem => !problem.practice).map(problem => problem.id)));
  for (const lesson of advancedLessons) {
    assert.ok(lesson.chapter.exercises.filter(exercise => exercise.kind === 'question' || !exercise.warmup).length >= 8, lesson.slug);
    assert.ok(lesson.chapter.exercises.some(exercise => exercise.kind === 'question' && exercise.demonstration), lesson.slug);
    assert.deepEqual(new Set(lesson.chapter.exercises.flatMap(exercise => exercise.kind === 'coding' ? [exercise.level] : [])),
      new Set(advancedExerciseLevels));
    assert.equal(new Set(chapterExamples(lesson.chapter).map(example => example.id)).size, chapterExamples(lesson.chapter).length);
    for (const exercise of lesson.chapter.exercises) {
      if (exercise.kind === 'question') {
        assert.ok(exercise.options[exercise.answer]?.feedback, exercise.id);
      } else {
        const problem = advancedProblems.find(problem => problem.id === exercise.problem);
        assert.equal(problem?.tag, lesson.tag, exercise.problem);
        assert.ok(problem?.guide?.concepts.length && problem.guide.steps.length >= 3);
        assert.ok(problem.cases.length >= 3);
        const distinctCases: [string, CaseChecks?][] = [
          [problem.sample[0], problem.sample[3]],
          ...problem.cases.map(([input, , checks]): [string, CaseChecks?] => [input, checks]),
        ];
        const inputs = distinctCases.map(([input, checks]) => JSON.stringify([input, checks?.calls, checks?.fixtures]));
        assert.equal(inputs.length, new Set(inputs).size, problem.id);
      }
    }
  }
  const slugs = [...advancedModules, ...advancedLessons].map(item => item.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  assert.equal(new Set(advancedLessons.map(lesson => lesson.tag)).size, advancedLessons.length);
  for (const module of advancedModules) {
    const moduleProblemIds = module.lessons.flatMap(lesson => lesson.chapter.exercises.flatMap(exercise =>
      exercise.kind === 'coding' ? [exercise.problem] : []));
    for (const task of [...module.practice, module.assessment]) {
      assert.ok(moduleProblemIds.includes(task.id), module.slug + ' · ' + task.id);
    }
    const transfer = advancedProblems.find(problem => problem.id === module.transfer.id);
    assert.ok(transfer?.practice && transfer.origin?.kind === 'adapted' && transfer.cases.length >= 3, module.slug);
    assert.ok(module.lessons.some(lesson => lesson.tag === transfer.tag));
    assert.ok(!ids.includes(module.transfer.id));
  }
  assert.equal(new Set(advancedModules.map(module => module.transfer.id)).size, 4);
});

test('Pyodide 3.12 实跑全部进阶示例、读代码题、参考答案和两个进阶项目', async () => {
  const python = await loadPyodide();
  assert.equal(python.runPython('import sys; sys.version_info[:2] == (3, 12)'), true);
  python.runPython(`
import io
import json
import os
import sys
from contextlib import redirect_stdout, redirect_stderr
from importlib import import_module
from pathlib import Path
from runpy import run_path
from tempfile import TemporaryDirectory
from unittest.mock import patch

def capture(source, stdin, name, packed_args):
    stdout = io.StringIO()
    stderr = io.StringIO()
    scope = {"__name__": "main" if name else "__main__"}
    with patch("sys.stdin", io.StringIO(stdin)), redirect_stdout(stdout), redirect_stderr(stderr):
        exec(compile(source, "main.py", "exec"), scope)
        values = [scope[name](*args) for args in json.loads(packed_args)] if name else []
    return json.dumps([stdout.getvalue(), stderr.getvalue(), values])

def capture_project(files_json, stdin, target_json, checks_json, run_main):
    stdout, stderr = io.StringIO(), io.StringIO()
    calls_status = []
    checks = json.loads(checks_json)
    target = json.loads(target_json)
    with TemporaryDirectory() as directory:
        previous_cwd = os.getcwd()
        try:
            os.chdir(directory)
            for source in json.loads(files_json) + checks.get("fixtures", []):
                Path(source["name"]).write_text(source["content"], encoding="utf-8")
            with patch.object(sys, "path", [directory, *sys.path]), patch.dict(sys.modules):
                if target:
                    with patch("sys.stdin", io.StringIO("")), redirect_stdout(stdout), redirect_stderr(stderr):
                        fn = getattr(import_module(target["module"]), target["name"])
                        calls_status = [fn(*call["args"]) for call in checks.get("calls", [])]
                    assert not stdout.getvalue() and not stderr.getvalue(), "interface produced output"
                if run_main:
                    with patch("sys.stdin", io.StringIO(stdin)), redirect_stdout(stdout), redirect_stderr(stderr):
                        run_path("main.py", run_name="__main__")
            artifacts = [Path(item["name"]).read_bytes().decode("utf-8") for item in checks.get("artifacts", [])]
            return json.dumps([stdout.getvalue(), stderr.getvalue(), calls_status, artifacts])
        finally:
            os.chdir(previous_cwd)
`);
  const capture = python.globals.get('capture');
  const captureProject = python.globals.get('capture_project');
  const result = (source: string, input: string, name = '', args: (string | number)[][] = []) =>
    JSON.parse(capture(source, input, name, JSON.stringify(args)));
  try {
    for (const lesson of advancedLessons) {
      for (const example of chapterExamples(lesson.chapter)) {
        assert.deepEqual(result(example.source, example.input), [example.output, '', []], lesson.slug + '/' + example.id);
      }
      for (const exercise of lesson.chapter.exercises) {
        if (exercise.kind !== 'question' || !exercise.demonstration) continue;
        const example = exercise.demonstration;
        assert.deepEqual(result(example.source, example.input), [example.output, '', []], exercise.id);
      }
    }
    for (const problem of advancedProblems) {
      const { sample, contract } = problem;
      const cases = [[sample[0], sample[1], sample[3]] as const, ...problem.cases];
      for (const [index, [input, expected, checks]] of cases.entries()) {
        const label = problem.id + ' · 用例 ' + (index + 1);
        if (contract?.kind === 'function') {
          assert.ok(contract.target && checks?.calls?.length, label);
          const files = JSON.stringify([{ name: 'main.py', content: problem.solution }]);
          assert.deepEqual(JSON.parse(captureProject(files, input, JSON.stringify(contract.target), JSON.stringify(checks), false)),
            [expected, '', checks.calls.map(call => call.expected), []], label);
        } else {
          assert.deepEqual(result(problem.solution, input), [expected, '', []], label);
        }
      }
    }
    for (const project of projects.filter(project => project.brief)) {
      assert.ok(project.assessment?.contract, project.id);
      assert.ok(project.brief!.stages.length >= 4 && project.brief!.checklist.length >= 2, project.id);
      const { solution, solutionFiles, sample, cases, contract } = project.assessment;
      const files = JSON.stringify([{ name: 'main.py', content: solution }, ...(solutionFiles ?? [])]);
      const testCases: [input: string, expected: string, checks?: CaseChecks][] =
        [[sample[0], sample[1], sample[3]], ...cases];
      for (const [index, [input, expected, checks]] of testCases.entries()) {
        assert.ok(checks?.artifacts?.length || checks?.calls?.length, project.id);
        assert.deepEqual(JSON.parse(captureProject(files, input, JSON.stringify(contract.target ?? null), JSON.stringify(checks), true)),
          [expected, '', checks.calls?.map(call => call.expected) ?? [], checks.artifacts?.map(file => file.content) ?? []],
          project.id + ' · 用例 ' + (index + 1));
      }
    }
  } finally {
    capture.destroy();
    captureProject.destroy();
  }
});

