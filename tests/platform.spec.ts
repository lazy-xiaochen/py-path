import { test, expect, type Page } from '@playwright/test';
import { createServer } from 'node:http';
import { normalizeOutput } from '../src/judge';
import { lessons, problems, projects, type Problem } from '../src/content';
import { chapterExamples, chapters } from '../src/chapters';

const code = (page: Page) => page.locator('.cm-content');
const result = (page: Page) => page.locator('.result');
const run = (page: Page) => page.getByRole('button', { name: '运行', exact: true });
const submit = (page: Page) => page.getByRole('button', { name: '提交评测', exact: true });
const stdout = (page: Page) => result(page).getByRole('heading', { name: '标准输出', exact: true }).locator('xpath=following-sibling::pre[1]');
const required = (index: number) => chapters[lessons[index].tag]!.exercises.filter(item => item.kind === 'question' || !item.warmup).length;
const problemById = (id: string) => problems.find(problem => problem.id === id)!;

async function fillSolution(page: Page, problem: Problem) {
  for (const file of problem.solutionFiles ?? []) {
    await page.getByRole('button', { name: file.name, exact: true }).click();
    await code(page).fill(file.content);
  }
  await page.getByRole('button', { name: 'main.py', exact: true }).click();
  await code(page).fill(problem.solution);
}

test('样例、自定义输入、额外提示语、边界 WA、刷新与错题重做', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('./');
  await page.getByRole('link', { name: '浏览题库' }).click();
  await page.getByLabel('搜索题目').fill('P001');
  await page.getByRole('combobox', { name: '知识点' }).selectOption('输入输出');
  await page.getByRole('combobox', { name: '难度' }).selectOption('入门');
  await page.getByRole('combobox', { name: '完成状态' }).selectOption('未开始');
  await expect(page.getByText('共 1 道题')).toBeVisible();
  await page.getByRole('link', { name: '给包裹贴标签' }).click();
  await expect(page.getByRole('heading', { name: '代码编辑器' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '运行与评测' })).toBeVisible();
  await page.getByRole('button', { name: '复制输入' }).click();
  await expect(page.getByRole('button', { name: '已复制' })).toBeVisible();
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard.replace(/\r\n/g, '\n')).toBe('林晓\n');

  await code(page).fill('print("收件人：" + input("请输入姓名："))');
  await page.getByRole('button', { name: '试跑样例' }).click();
  await expect(result(page).getByText('答案错误 · WA')).toBeVisible();
  await expect(result(page).locator('.comparison')).toContainText('请输入姓名：收件人：林晓');
  await expect(result(page).getByRole('heading', { name: '期望输出' })).toBeVisible();

  await code(page).fill('print("收件人：林晓")');
  await page.getByRole('button', { name: '试跑样例' }).click();
  await expect(result(page)).toContainText('样例输出一致');
  await expect(page.locator('#personal')).toHaveText('未开始');
  await submit(page).click();
  await expect(result(page)).toContainText('答案错误 · WA');
  await expect(result(page)).toContainText('非样例用例未通过');
  await expect(result(page)).toContainText('通过 1 / 3 组');
  await expect(result(page).locator('.comparison')).toHaveCount(0);
  await expect(page.locator('#personal')).toHaveText('已尝试');

  await page.reload();
  await expect(code(page)).toHaveText('print("收件人：林晓")');
  await page.getByText('评测记录', { exact: true }).click();
  await expect(page.locator('#attempts')).toContainText('答案错误 · WA');
  await page.getByRole('navigation').getByRole('link', { name: '专项复习' }).click();
  await page.getByRole('link', { name: '重做 P001' }).click();
  await code(page).fill('print("收件人：" + input())');
  await page.getByLabel('标准输入').fill('周 小雨\n');
  await run(page).click();
  await expect(stdout(page)).toContainText('收件人：周 小雨');
  await expect(result(page)).not.toContainText('样例输出一致');
  await submit(page).click();
  await expect(result(page)).toContainText('通过 · AC');
  await page.reload();
  await expect(page.locator('#personal')).toHaveText('已通过');
  await expect(code(page)).toHaveText('print("收件人：" + input())');
  await page.getByRole('navigation').getByRole('link', { name: '专项复习' }).click();
  await expect(page.getByText('0 道待重做')).toBeVisible();
});

test('工作台多文件新建、导入、切换、重命名、删除和刷新', async ({ page }) => {
  await page.goto('./#lab');
  page.once('dialog', dialog => dialog.accept('temporary.py'));
  await page.getByRole('button', { name: '新建' }).click();
  await code(page).fill('message = "临时文件"');
  page.once('dialog', dialog => dialog.accept('rename.py'));
  await page.getByRole('button', { name: '重命名' }).click();
  await expect(page.getByRole('button', { name: 'rename.py', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(code(page)).toHaveText('message = "临时文件"');
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: '删除' }).click();
  await expect(page.getByRole('button', { name: 'rename.py', exact: true })).toHaveCount(0);
  await page.locator('input[type=file]').setInputFiles([
    { name: 'tool.py', mimeType: 'text/x-python', buffer: Buffer.from('def join(name):\n    return "你好，" + name\n') },
    { name: 'name.txt', mimeType: 'text/plain', buffer: Buffer.from('小岚') },
  ]);
  await expect(page.getByRole('button', { name: 'name.txt', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'main.py', exact: true }).click();
  await code(page).fill('from tool import join\nprint(join(open("name.txt", encoding="utf-8").read()))');
  await run(page).click();
  await expect(stdout(page)).toContainText('你好，小岚');
  await page.reload();
  await expect(page.getByRole('button', { name: 'tool.py', exact: true })).toBeVisible();
  await expect(code(page)).toContainText('from tool import join');
});

test('工作台提前准备单次隔离环境，运行结束和离开页面会释放', async ({ page }) => {
  await page.goto('./#lab');
  await code(page).fill('from pathlib import Path\nPath("temporary.txt").write_text("第一轮")\nprint("已执行")');
  await expect(page.locator('.runtime-state')).toHaveText('隔离解释器已就绪');
  await expect(result(page)).toHaveText('运行结果将在这里显示。');
  const first = page.workers()[0];
  expect(first).toBeDefined();
  const closed = first.waitForEvent('close');
  await run(page).click();
  await expect(stdout(page)).toHaveText('已执行');
  await closed;

  await expect(page.locator('.runtime-state')).toHaveText('隔离解释器已就绪');
  expect(page.workers()).toHaveLength(1);
  expect(page.workers()[0]).not.toBe(first);
  await code(page).fill('from pathlib import Path\nprint(Path("temporary.txt").exists())');
  await run(page).click();
  await expect(stdout(page)).toHaveText('False');
  await expect(page.locator('.runtime-state')).toHaveText('隔离解释器已就绪');
  const idle = page.workers()[0].waitForEvent('close');
  await page.getByRole('navigation', { name: '主导航' }).getByRole('link', { name: '专项复习' }).click();
  await idle;
  await expect(page.locator('iframe[title="隔离的 Python 执行环境"]')).toHaveCount(0);
});

test('两个 input 使用两行整数，并解释缺少输入和同一行两个数的异常', async ({ page }) => {
  await page.goto('./#lab');
  const input = page.getByRole('textbox', { name: '标准输入' });
  await expect(input).toHaveAccessibleDescription(/每次 input\(\) 读取一行/);
  await code(page).fill('a = int(input())\nb = int(input())\nprint(a * b)');
  await run(page).click();
  await expect(result(page)).toContainText('EOFError: EOF when reading a line');
  await expect(result(page)).toContainText('两次 input() 需要两行');

  await input.fill('6 7\n');
  await run(page).click();
  await expect(result(page)).toContainText('ValueError: invalid literal for int()');
  await expect(result(page)).toContainText('先用 split() 拆分');

  await input.fill('6\n7\n');
  await run(page).click();
  await expect(stdout(page)).toHaveText('42');
});

test('语法和跨文件异常定位、旧源码标记以及纯文本输出', async ({ page }) => {
  await page.goto('./#lab');
  await code(page).fill('if True\n    print("x")');
  await run(page).click();
  await expect(result(page)).toContainText('SyntaxError');
  await expect(result(page)).toContainText('Python 无法解析');
  await result(page).getByRole('button', { name: 'main.py · 第 1 行' }).click();
  await expect(page.locator('.execution-error-line')).toContainText('if True');
  await code(page).fill('from helper import broken\nbroken()');
  await expect(result(page).getByText('这条结果来自旧版本，重新运行后可定位。')).toBeVisible();
  await expect(page.locator('.execution-error-line')).toHaveCount(0);
  await page.locator('input[type=file]').setInputFiles({
    name: 'helper.py', mimeType: 'text/x-python', buffer: Buffer.from('def broken():\n    return 1 / 0\n'),
  });
  await run(page).click();
  await expect(result(page)).toContainText('ZeroDivisionError');
  await page.getByRole('button', { name: 'main.py', exact: true }).click();
  await result(page).getByRole('button', { name: 'helper.py · 第 2 行' }).click();
  await expect(page.getByRole('button', { name: 'helper.py', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.execution-error-line')).toContainText('return 1 / 0');

  await page.getByRole('button', { name: 'main.py', exact: true }).click();
  await code(page).fill('import sys\nprint("<b>原文</b>")\nprint("标准错误示例", file=sys.stderr)');
  await run(page).click();
  await expect(stdout(page)).toHaveText('<b>原文</b>');
  await expect(result(page).locator('pre b')).toHaveCount(0);
  await expect(result(page).getByRole('heading', { name: '标准错误' }).locator('xpath=following-sibling::pre[1]')).toHaveText('标准错误示例');
  await page.getByRole('button', { name: '清空' }).click();
  await expect(result(page)).toHaveText('控制台已清空。');
});

test('停止死循环并重新运行、超时及限制输出', async ({ page }) => {
  await page.goto('./#lab');
  await code(page).fill('while True:\n    pass');
  await run(page).click();
  await expect(result(page)).toHaveText('程序正在运行…');
  const frame = page.locator('iframe[title="隔离的 Python 执行环境"]');
  await expect(frame).toHaveAttribute('sandbox', 'allow-scripts');
  await expect.poll(() => page.workers().length).toBe(1);
  await page.getByRole('button', { name: '停止' }).click();
  await expect(result(page)).toContainText('已停止');
  await expect(frame).toHaveCount(0);
  await expect.poll(() => page.workers().length).toBe(0);
  await run(page).click();
  await expect(result(page)).toContainText('超时 · TLE');
  await expect.poll(() => page.workers().length).toBe(0);
  await code(page).fill('print("x" * 70000)');
  await run(page).click();
  await expect(result(page)).toContainText('输出超限 · OLE');
  expect((await stdout(page).textContent())?.length).toBe(65536);
  await code(page).fill('print("停止后重新运行成功")');
  await run(page).click();
  await expect(stdout(page)).toHaveText('停止后重新运行成功');
});

test('隔离代码无法读取主站存储或发送任意网络请求', async ({ page }) => {
  let requests = 0;
  const server = createServer((_, response) => {
    requests++;
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.end('可达探针');
  });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('无法启动探针');
    const url = 'http://127.0.0.1:' + address.port + '/visitor-probe';
    await page.goto('./#lab');
    await page.evaluate(() => localStorage.setItem('test-secret', '主站私有数据'));
    expect(await page.evaluate(async target => (await fetch(target)).text(), url)).toBe('可达探针');
    requests = 0;
    await code(page).fill('import js\nprint("来源:", js.origin)\nprint("主站存储可读:", hasattr(js, "localStorage"))\n' +
      'try:\n    js.indexedDB.open("test-secret")\nexcept Exception:\n    print("IndexedDB 已拒绝")\n' +
      'try:\n    xhr = js.XMLHttpRequest.new()\n    xhr.open("GET", ' + JSON.stringify(url) + ', False)\n    xhr.send()\nexcept Exception:\n    print("XHR 已拦截")\n' +
      'try:\n    js.importScripts(' + JSON.stringify(url) + ')\nexcept Exception:\n    print("脚本加载已拦截")');
    await run(page).click();
    await expect(stdout(page)).toContainText('来源: null');
    await expect(stdout(page)).toContainText('主站存储可读: False');
    await expect(stdout(page)).toContainText('IndexedDB 已拒绝');
    await expect(stdout(page)).toContainText('XHR 已拦截');
    await expect(stdout(page)).toContainText('脚本加载已拦截');
    expect(requests).toBe(0);
    expect(await page.evaluate(() => localStorage.getItem('test-secret'))).toBe('主站私有数据');
  } finally {
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
});

test('CSP 验证失败时不执行源码', async ({ page }) => {
  await page.route(/\/assets\/index-.*\.js$/, async route => {
    const response = await route.fetch();
    const source = await response.text();
    const weakened = source.replace("connect-src 'none'", 'connect-src *');
    expect(weakened).not.toBe(source);
    await route.fulfill({ response, body: weakened });
  });
  await page.goto('./#lab');
  await code(page).fill('print("不应执行的程序")');
  await run(page).click();
  await expect(result(page)).toContainText('隔离环境不可用');
  await expect(result(page)).not.toContainText('不应执行的程序');
});

test('窄屏切换题面、代码和评测', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('./#problem/P001');
  await expect(page.getByRole('heading', { name: '题目描述' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '代码编辑器' })).toBeHidden();
  await page.getByRole('button', { name: '代码', exact: true }).click();
  await code(page).fill('print("收件人：" + input())');
  await page.getByRole('button', { name: '评测', exact: true }).click();
  await run(page).click();
  await expect(result(page)).toContainText('样例输出一致');
  await page.getByRole('button', { name: '题面', exact: true }).click();
  await expect(page.getByRole('heading', { name: '题目描述' })).toBeVisible();
});

test('仓库子路径加载页面、编辑器和解释器，编辑器支持自动缩进与撤销', async ({ page }) => {
  const runtimeFiles = new Set<string>();
  page.on('response', response => {
    const pathname = new URL(response.url()).pathname;
    if (response.ok() && pathname.startsWith('/py-path/runtime/')) {
      runtimeFiles.add(pathname.split('/').at(-1)!);
    }
  });
  await page.goto('./#lab');
  await code(page).fill('if True:');
  await code(page).press('End');
  await code(page).press('Enter');
  await code(page).press('p');
  await expect(code(page).locator('.cm-line').last()).toHaveJSProperty('textContent', '    p');
  await code(page).press(process.platform === 'darwin' ? 'Meta+z' : 'Control+z');
  await expect(code(page)).not.toContainText('p');
  await code(page).fill('print("子路径运行成功")');
  await run(page).click();
  await expect(stdout(page)).toHaveText('子路径运行成功');
  expect([...runtimeFiles].sort()).toEqual([
    'pyodide-lock.json', 'pyodide.asm.js', 'pyodide.asm.wasm', 'pyodide.js', 'python_stdlib.zip',
  ]);
});

test('升级课听讲、作答反馈、示例修改及刷新恢复', async ({ page }) => {
  await page.goto('./#learn/1');
  await expect(page.getByRole('heading', { name: '学习目标' })).toBeVisible();
  await expect(page.locator('.study-example')).toHaveCount(chapterExamples(chapters[lessons[0].tag]!).length);
  const example = page.locator('.study-example').filter({ hasText: '读取站名并播报' });
  await example.locator('summary').click();
  await example.getByRole('button', { name: '载入示例编辑器' }).click();
  await expect(page.getByLabel('选择示例')).toHaveValue('next-stop');
  await code(page).fill('city = input()\nprint("行程", city, sep="：")');
  await page.getByLabel('标准输入').fill('青岛\n');
  await run(page).click();
  await expect(stdout(page)).toHaveText('行程：青岛');
  const readLine = page.locator('#io-read-line');
  await readLine.locator('[data-choice="0"]').click();
  await expect(readLine.getByRole('status')).toContainText('先拆分再取首项');
  await readLine.locator('[data-choice="1"]').click();
  await page.locator('#io-print-separator [data-choice="2"]').click();
  await expect(page.locator('[data-lesson-accuracy]')).toHaveText('作答正确率 67% · 已记录 3 次作答');
  await page.reload();
  await expect(page.getByLabel('选择示例')).toHaveValue('next-stop');
  await expect(page.getByLabel('标准输入')).toHaveValue('青岛\n');
  await expect(code(page)).toContainText('print("行程", city, sep="：")');
  await expect(result(page)).toContainText('上次运行结果');
  await expect(stdout(page)).toHaveText('行程：青岛');
  await expect(readLine.getByRole('status')).toContainText('回答正确');
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: '恢复原始示例' }).click();
  await expect(code(page)).toContainText('print("下一站", city)');
  await expect(page.getByLabel('标准输入')).toHaveValue('杭州\n');
  await page.getByRole('link', { name: /P001 给包裹贴标签/ }).click();
  await expect(code(page)).toContainText('city = input()');
  await page.goto('./#learn');
  await expect(page.getByRole('link', { name: /让 Python 开口说话/ })).toContainText('2 / 8');
  await expect(page.locator('#foundation-courses .lesson-card')).toHaveCount(12);
});

test('历史课程与通过记录可继续使用，知识错题可按知识点重做', async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('py-path.v1')) {
      localStorage.setItem('py-path.v1', JSON.stringify({
        progress: {
          0: { explain: true, predict: true, run: true },
          2: { explain: true, predict: true },
          3: { explain: true },
          4: { explain: true, predict: true },
          5: { predict: true },
          6: { explain: true, predict: true },
          7: { explain: true },
          8: { explain: true, predict: true },
          9: { predict: true },
          10: { explain: true, predict: true },
          11: { predict: true },
        },
        solved: { P001: true }, attempts: { P001: [{ date: 1, verdict: 'AC', passed: 3, total: 3 }] },
        drafts: { P001: 'print("旧草稿")' },
      }));
    }
  });
  await page.goto('./#learn/1');
  await expect(page.locator('[data-lesson-completed]')).toHaveText('已完成 2 / 8 练习');
  await page.locator('#io-prompt [data-choice="1"]').click();
  await expect(page.locator('#io-prompt .quiz-feedback')).toContainText('提示语也进入标准输出');
  await page.getByRole('navigation', { name: '主导航' }).getByRole('link', { name: '专项复习' }).click();
  await expect(page.getByText('1 道待重做')).toBeVisible();
  await expect(page.locator('.review-card').filter({ has: page.getByRole('heading', { name: '输入输出', exact: true }) }))
    .toContainText('正确率 0%');
  await page.getByRole('link', { name: '重做知识题' }).click();
  await expect(page.locator('#io-prompt')).toBeFocused();
  await page.locator('#io-prompt [data-choice="0"]').click();
  await expect(page.locator('[data-lesson-completed]')).toHaveText('已完成 3 / 8 练习');
  await page.getByRole('navigation', { name: '主导航' }).getByRole('link', { name: '专项复习' }).click();
  await expect(page.getByText('0 道待重做')).toBeVisible();
  await page.goto('./#problem/P001');
  await expect(code(page)).toHaveText('print("旧草稿")');
  await expect(page.locator('#personal')).toHaveText('已通过');
  for (let index = 2; index < lessons.length; index++) {
    await page.goto('./#learn/' + (index + 1));
    const done = index % 2 === 0 ? 2 : 1;
    await expect(page.locator('[data-lesson-completed]')).toHaveText('已完成 ' + done + ' / ' + required(index) + ' 练习');
  }
});

const classics = [
  { id: 'PracticeA', original: 'Welcome to AtCoder', href: 'https://atcoder.jp/contests/abs/tasks/practice_1', adapted: '展演时段核算' },
  { id: 'ABC086A', original: 'Product', href: 'https://atcoder.jp/contests/abs/tasks/abc086_a', adapted: '剧场翻牌' },
  { id: 'ABC083B', original: 'Some Sums', href: 'https://atcoder.jp/contests/abs/tasks/abc083_b', adapted: '按数位和筛查编号' },
  { id: '125', original: 'Valid Palindrome', href: 'https://leetcode.com/problems/valid-palindrome/description/', adapted: '回文差异定位' },
  { id: 'ABC088B', original: 'Card Game for Two', href: 'https://atcoder.jp/contests/abs/tasks/abc088_b', adapted: '桌游三队轮选' },
  { id: 'ABC155C', original: 'Poll', href: 'https://atcoder.jp/contests/abc155/tasks/abc155_c?lang=en', adapted: '双箱投票汇总' },
  { id: '326', original: 'Power of Three', href: 'https://leetcode.com/problems/power-of-three/description/', adapted: '反复整除取因子' },
  { id: 'ABC255B', original: 'Light It Up', href: 'https://atcoder.jp/contests/abc255/tasks/abc255_b?lang=en', adapted: '最小整数接收半径', level: '原题 B · 200 分' },
  { id: 'ABC344A', original: 'Spoiler', href: 'https://atcoder.jp/contests/abc344/tasks/abc344_a?lang=en', adapted: '清理公告备注并导出副本', level: '原题 A · 150 分' },
  { id: '8', original: 'String to Integer (atoi)', href: 'https://leetcode.com/problems/string-to-integer-atoi/description/', adapted: '导入旧日志中的整数前缀', level: '原题 Medium', searchTerm: 'String to Integer (atoi)' },
  { id: '88', original: 'Merge Sorted Array', href: 'https://leetcode.com/problems/merge-sorted-array/description/', adapted: '归并两份有序领件清单', level: '原题 Easy', searchTerm: 'Merge Sorted Array' },
];
for (const classic of classics) {
  test('按原题信息检索经典改编并查看完整解析 · ' + classic.id, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('./#bank');
    await page.getByRole('searchbox').fill(classic.searchTerm ?? classic.id);
    const origin = page.getByRole('combobox', { name: '来源' });
    await origin.selectOption('原创');
    await expect(page.getByText('共 0 道题')).toBeVisible();
    await origin.selectOption('经典改编');
    await expect(page.getByText('共 1 道题')).toBeVisible();
    await page.getByRole('link', { name: classic.adapted }).click();
    await page.getByText('查看原题出处', { exact: true }).click();
    await expect(page.locator('.problem-source').getByRole('link', { name: classic.original + ' ↗', exact: true }))
      .toHaveAttribute('href', classic.href);
    if (classic.level) await expect(page.locator('.problem-source')).toContainText(classic.level);
    await page.getByText('查看参考解法', { exact: true }).click();
    await expect(page.getByRole('heading', { name: '代码逐步解释' })).toBeVisible();
    await expect(page.getByText('时间复杂度', { exact: true })).toBeVisible();
    await expect(page.getByText('空间复杂度', { exact: true })).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('跨午夜端点错题从课程提交，修正后更新完成度', async ({ page }) => {
  const problem = problems.find(item => item.id === 'P033')!;
  await page.goto('./#learn/3');
  await page.getByRole('link', { name: /P033 跨午夜站台/ }).click();
  await code(page).fill(problem.solution.replace('now >= start or now < end', 'now >= start or now <= end'));
  await page.getByRole('button', { name: '试跑样例' }).click();
  await expect(result(page)).toContainText('样例输出一致');
  await submit(page).click();
  await expect(result(page)).toContainText('答案错误 · WA', { timeout: 35000 });
  await expect(result(page)).toContainText('通过 1 / ' + (problem.cases.length + 1) + ' 组');
  await expect(result(page)).not.toContainText('期望输出');
  await page.getByRole('navigation', { name: '主导航' }).getByRole('link', { name: '专项复习' }).click();
  await page.getByRole('link', { name: '重做 P033' }).click();
  await expect(code(page)).toContainText('now >= start or now <= end');
  await code(page).fill(problem.solution);
  await submit(page).click();
  await expect(result(page)).toContainText('通过 · AC', { timeout: 90000 });
  await page.getByRole('link', { name: '本题所属课程' }).click();
  await expect(page.locator('[data-lesson-completed]')).toHaveText('已完成 1 / 10 练习');
  await expect(page.locator('[data-lesson-accuracy]')).toHaveText('作答正确率 50% · 已记录 2 次作答');
});

test('从首页题库筛选列表题，独立试算判错后可提交并恢复', async ({ page }) => {
  const problem = problems.find(item => item.id === 'P045')!;
  await page.goto('./');
  await page.getByRole('link', { name: '浏览题库' }).click();
  await page.getByRole('combobox', { name: '知识点' }).selectOption('列表');
  await expect(page.getByText('共 6 道题')).toBeVisible();
  await page.getByRole('link', { name: '库存独立试算' }).click();
  const aliasing = problem.solution.replace('scenario = stock.copy()', 'scenario = stock');
  await code(page).fill(aliasing);
  await submit(page).click();
  await expect(result(page)).toContainText('答案错误 · WA', { timeout: 35000 });
  await expect(result(page)).toContainText('只是建立别名');
  await expect(result(page).locator('.comparison')).toContainText('8 3 7');
  await expect(result(page).locator('.comparison')).toContainText('12 3 7');
  await code(page).fill(problem.solution);
  await submit(page).click();
  await expect(result(page)).toContainText('通过 · AC', { timeout: 35000 });
  await page.reload();
  await expect(page.locator('#personal')).toHaveText('已通过');
  await expect(code(page)).toContainText('stock.copy()');
});

test('从首页题库提交字典题，样例通过后仍能发现零值错误并重做', async ({ page }) => {
  const problem = problems.find(item => item.id === 'P048')!;
  await page.goto('./');
  await page.getByRole('link', { name: '浏览题库' }).click();
  await page.getByRole('combobox', { name: '知识点' }).selectOption('字典');
  await expect(page.getByText('共 ' + problems.filter(task => task.tag === problem.tag).length + ' 道题')).toBeVisible();
  await page.getByRole('link', { name: '工号登记冲突' }).click();
  const zeroIsMissing = problem.solution.replace('if worker not in baseline:', 'if not baseline.get(worker):');
  await code(page).fill(zeroIsMissing);
  await page.getByRole('button', { name: '试跑样例' }).click();
  await expect(result(page)).toContainText('样例输出一致');
  await submit(page).click();
  await expect(result(page)).toContainText('答案错误 · WA', { timeout: 35000 });
  await expect(result(page)).toContainText('通过 5 / 6 组');
  await expect(result(page)).toContainText('基准 0 当作未登记');
  await expect(result(page)).not.toContainText('期望输出');
  await page.getByRole('navigation', { name: '主导航' }).getByRole('link', { name: '专项复习' }).click();
  const review = page.locator('.review-card').filter({ has: page.getByRole('heading', { name: '字典', exact: true }) });
  await expect(review).toContainText('正确率 0%');
  await page.getByRole('link', { name: '重做 P048' }).click();
  await expect(code(page)).toContainText('if not baseline.get(worker):');
  await code(page).fill(problem.solution);
  await submit(page).click();
  await expect(result(page)).toContainText('通过 · AC', { timeout: 35000 });
  await page.reload();
  await expect(page.locator('#personal')).toHaveText('已通过');
  await expect(code(page)).toContainText('if worker not in baseline:');
  await page.getByRole('link', { name: '本题所属课程' }).click();
  await expect(page.locator('[data-lesson-completed]')).toHaveText('已完成 1 / ' + required(6) + ' 练习');
  await expect(page.locator('[data-lesson-accuracy]')).toHaveText('作答正确率 50% · 已记录 2 次作答');
});

test('模块课编辑辅助文件后使用新内容，刷新保留辅助文件与输出', async ({ page }) => {
  await page.goto('./#learn/9');
  const example = page.locator('.study-example').filter({ hasText: '把展签格式放进辅助文件' });
  await example.locator('summary').click();
  await example.getByRole('button', { name: '载入示例编辑器' }).click();
  await expect(page.getByLabel('选择示例')).toHaveValue('module-edit-label');
  await run(page).click();
  await expect(stdout(page)).toHaveText('B-07');

  const helper = page.getByRole('button', { name: 'badge_text.py', exact: true });
  await helper.click();
  await code(page).fill('def make_label(zone, number):\n    return f"{zone}/{number:02d}"\n');
  await run(page).click();
  await expect(stdout(page)).toHaveText('B/07');
  await page.reload();
  await expect(helper).toHaveAttribute('aria-pressed', 'true');
  await expect(code(page)).toContainText('f"{zone}/{number:02d}"');
  await expect(result(page)).toContainText('上次运行结果');
  await expect(stdout(page)).toHaveText('B/07');

  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: '恢复原始示例' }).click();
  await helper.click();
  await expect(code(page)).toContainText('f"{zone}-{number:02d}"');
});

test('文件课运行时覆盖不改编辑器，下次运行按新的工作区快照读取', async ({ page }) => {
  await page.goto('./#learn/10');
  await page.getByLabel('选择示例').selectOption('file-request-snapshot');
  await run(page).click();
  await expect(stdout(page)).toHaveText('旧内容 停用 新内容 正常');

  await page.getByRole('button', { name: 'status.txt', exact: true }).click();
  await expect(code(page)).toHaveText('停用');
  await code(page).fill('维护中');
  await run(page).click();
  await expect(stdout(page)).toHaveText('旧内容 维护中 新内容 正常');
  await page.reload();
  await expect(code(page)).toHaveText('维护中');
  await expect(stdout(page)).toHaveText('旧内容 维护中 新内容 正常');
});

test('独立题库的文件题检出误覆盖，专项复习重做后恢复 AC', async ({ page }) => {
  const problem = problems.find(item => item.id === 'P059')!;
  await page.goto('./');
  await page.getByRole('link', { name: '浏览题库' }).click();
  await page.getByRole('combobox', { name: '知识点' }).selectOption('文件读写');
  await expect(page.getByText('共 ' + problems.filter(task => task.tag === problem.tag).length + ' 道题')).toBeVisible();
  await page.getByRole('link', { name: '分两批追加签到' }).click();
  const overwrite = problem.solution.replace('open("arrivals.txt", "a"', 'open("arrivals.txt", "w"');
  await code(page).fill(overwrite);
  await submit(page).click();
  await expect(result(page)).toContainText('答案错误 · WA', { timeout: 35000 });
  await expect(result(page)).toContainText('使用 w 会抹掉第一批');
  await expect(result(page).locator('.comparison')).toContainText('4');
  await expect(result(page).locator('.comparison')).toContainText('2');

  await page.getByRole('navigation', { name: '主导航' }).getByRole('link', { name: '专项复习' }).click();
  await page.getByRole('link', { name: '重做 P059' }).click();
  await expect(code(page)).toContainText('open("arrivals.txt", "w"');
  await code(page).fill(problem.solution);
  await submit(page).click();
  await expect(result(page)).toContainText('通过 · AC', { timeout: 35000 });
  await page.reload();
  await expect(page.locator('#personal')).toHaveText('已通过');
  await expect(code(page)).toContainText('open("arrivals.txt", "a"');
});

test('异常课从真实调用栈定位辅助文件，修改后重新运行', async ({ page }) => {
  await page.goto('./#learn/11');
  await page.getByLabel('选择示例').selectOption('debug-cross-stack');
  await page.locator('.example-expected summary').click();
  await expect(page.locator('[data-expected]')).toContainText('预期异常 ZeroDivisionError · measure_tile.py · 第 2 行');
  await run(page).click();
  await expect(result(page)).toContainText('运行错误 · RE');
  await expect(stdout(page)).toHaveText('开始核算');
  await result(page).getByRole('button', { name: 'measure_tile.py · 第 2 行' }).click();
  await expect(page.locator('.execution-error-line')).toContainText('return total // pieces');
  await code(page).fill('def unit_price(total, pieces):\n    if pieces == 0:\n        return "无法核算"\n    return total // pieces\n');
  await expect(result(page).getByText('这条结果来自旧版本，重新运行后可定位。')).toBeVisible();
  await run(page).click();
  await expect(result(page)).toContainText('运行结束');
  expect(await stdout(page).textContent()).toBe('开始核算\n无法核算\n');
  await page.getByLabel('标准输入').fill('3\n');
  await run(page).click();
  expect(await stdout(page).textContent()).toBe('开始核算\n4\n');
});

test('综合课样例通过仍能检出零冷却的反例，重做后更新课程进度', async ({ page }) => {
  const problem = problems.find(item => item.id === 'P068')!;
  await page.goto('./#learn/12');
  await page.getByRole('link', { name: /P068 记录接驳请求的冷却时间/ }).click();
  const check = 'time - last_accepted[code] >= cooldown';
  await code(page).fill(problem.solution.replace(check, 'time > last_accepted[code] and ' + check));
  await page.getByRole('button', { name: '试跑样例' }).click();
  await expect(result(page)).toContainText('样例输出一致');
  await submit(page).click();
  await expect(result(page)).toContainText('答案错误 · WA', { timeout: 35000 });
  await expect(result(page)).toContainText('通过 2 / 6 组');
  await expect(result(page)).not.toContainText('期望输出');
  await page.getByRole('navigation', { name: '主导航' }).getByRole('link', { name: '专项复习' }).click();
  await page.getByRole('link', { name: '重做 P068' }).click();
  await expect(code(page)).toContainText('time > last_accepted[code]');
  await code(page).fill(problem.solution);
  await submit(page).click();
  await expect(result(page)).toContainText('通过 · AC', { timeout: 35000 });
  await page.getByRole('link', { name: '本题所属课程' }).click();
  await expect(page.locator('[data-lesson-completed]')).toHaveText('已完成 1 / 10 练习');
  await expect(page.locator('[data-lesson-accuracy]')).toHaveText('作答正确率 50% · 已记录 2 次作答');
  await page.reload();
  await expect(page.locator('[data-lesson-completed]')).toHaveText('已完成 1 / 10 练习');
});

test('本轮回归 · 第九课拆分前后的标签一致，工具可独立自测', async ({ page }) => {
  const examples = chapterExamples(chapters['模块']!);
  const single = examples.find(example => example.id === 'module-single-label')!;
  const split = examples.find(example => example.id === 'module-split-label')!;
  const tool = split.files!.find(file => file.name === 'label_tool.py')!;
  await page.goto('./#learn');
  await page.getByRole('link', { name: /用模块组织工具/ }).click();
  const selection = page.getByLabel('选择示例');
  const ids = await selection.locator('option').evaluateAll(options => options.map(option => (option as HTMLOptionElement).value));
  expect(ids[ids.indexOf(single.id) + 1]).toBe(split.id);
  const input = page.getByLabel('标准输入');
  for (const example of [single, split]) {
    const loadExample = page.locator('[data-open-example="' + example.id + '"]');
    const card = page.locator('.study-example').filter({ has: loadExample });
    await card.locator('summary').click();
    await loadExample.click();
    await expect(selection).toHaveValue(example.id);
    for (const [stdin, expected] of [['B 7\n', 'B-07\n'], ['A 0\n', 'A-00\n']]) {
      await input.fill(stdin);
      await run(page).click();
      await expect(run(page)).toBeEnabled();
      expect(await stdout(page).textContent()).toBe(expected);
    }
    const original = example === single ? single.source : tool.content;
    if (example === split) await page.getByRole('button', { name: tool.name, exact: true }).click();
    await code(page).fill(original.replace('{zone}-{number:02d}', '{zone}/{number:02d}'));
    await run(page).click();
    await expect(run(page)).toBeEnabled();
    expect(await stdout(page).textContent()).toBe('A/00\n');
    await code(page).fill(original);
  }
  await page.getByRole('link', { name: '在线工作台', exact: true }).click();
  await page.locator('input[type=file]').setInputFiles({
    name: tool.name, mimeType: 'text/x-python', buffer: Buffer.from(tool.content),
  });
  await page.getByLabel('运行入口').selectOption(tool.name);
  await run(page).click();
  await expect(run(page)).toBeEnabled();
  expect(await stdout(page).textContent()).toBe('两组自测通过\n');
});

const rejectedOutputs = [
  { id: 'P006', input: '30 0\n', expected: '快线\n', actual: '前台\n', before: '30 <= t', after: '30 < t' },
  { id: 'P033', input: '480 720 480\n', expected: '开放\n', actual: '关闭\n', before: 'start <= now', after: 'start < now' },
  { id: 'P033', input: '480 720 721\n', expected: '关闭\n', actual: '开放\n', before: 'start <= now < end', after: 'start <= now and now != end' },
  { id: 'P041', input: 'A \nZ\nx\n', expected: 'A \n0\n', actual: 'A\n0\n', before: 'print(text)', after: 'print(text.rstrip())' },
  { id: 'P062', input: '1\nA |注|\n', expected: 'A \n1\n', actual: 'A\n1\n', before: 'print(line, end="")', after: 'print(line.rstrip())' },
];

test('静态子路径 · 恢复旧草稿并提交，基础课程进度持久化', async ({ page }) => {
  const problem = problems.find(item => item.id === 'P002')!;
  await page.addInitScript(({ source }) => {
    if (!localStorage.getItem('py-path.v1')) {
      localStorage.setItem('py-path.v1', JSON.stringify({ drafts: { P002: source } }));
    }
  }, { source: problem.solution });
  await page.goto('./#problem/P002');
  await expect(code(page)).toContainText(problem.solution.split('\n')[0]);
  await submit(page).click();
  await expect(result(page)).toContainText('通过 · AC');
  await page.getByRole('link', { name: '本题所属课程' }).click();
  await expect(page.locator('[data-lesson-completed]')).toHaveText('已完成 1 / 8 练习');
  await page.reload();
  await expect(page.locator('[data-lesson-completed]')).toHaveText('已完成 1 / 8 练习');
});

for (const { id, input, expected, actual, before, after } of rejectedOutputs) {
  test('本轮回归 · 正式提交拒绝已知错误 ' + id + ' · ' + input.trim().replaceAll('\n', '/'), async ({ page }) => {
    const problem = problems.find(item => item.id === id)!;
    const index = problem.cases.findIndex(([stdin]) => stdin === input);
    expect(problem.cases[index]).toEqual([input, expected]);
    expect(problem.solution).toContain(before);
    await page.goto('./#problem/' + id);
    await page.getByLabel('标准输入').fill(input);
    await code(page).fill(problem.solution);
    await run(page).click();
    await expect(run(page)).toBeEnabled();
    const referenceOutput = await stdout(page).textContent();
    expect(referenceOutput).toBe(expected);

    await code(page).fill(problem.solution.replace(before, after));
    await run(page).click();
    await expect(run(page)).toBeEnabled();
    expect(await stdout(page).textContent()).toBe(actual);
    await submit(page).click();
    await expect(result(page)).toContainText('答案错误 · WA', { timeout: 90000 });
    await expect(result(page)).toContainText('通过 ' + (index + 1) + ' / ' + (problem.cases.length + 1) + ' 组');
    await expect(result(page)).toContainText('非样例用例未通过');
    await expect(result(page).locator('.comparison')).toHaveCount(0);
    if (problem.outputComparison === 'exact') {
      await expect(result(page)).toContainText('第 1 行第 2 列期望为空格，实际为行尾。');
    }
    await test.info().attach('回归结果', {
      contentType: 'application/json', body: JSON.stringify({ id, input, expected, referenceOutput, actual, verdict: 'WA' }),
    });
  });
}

test('本轮回归 · 样例和提交共用精确比较及结束换行规则', async ({ page }) => {
  const problem = problems.find(item => item.id === 'P041')!;
  const [input, expected] = problem.sample;
  const [line, position] = expected.split('\n');
  await page.goto('./#problem/P041');
  await expect(page.getByText(/最后一行的结束换行可省略/)).toBeVisible();
  await code(page).fill('print(' + JSON.stringify(line + ' ') + ')\nprint(' + JSON.stringify(position) + ')');
  const trySample = page.getByRole('button', { name: '试跑样例' });
  await trySample.click();
  await expect(page.getByLabel('标准输入')).toHaveValue(input);
  await expect(result(page)).toContainText('答案错误 · WA');
  const difference = '第 1 行第 ' + (Array.from(line).length + 1) + ' 列期望为行尾，实际为空格。';
  await expect(result(page)).toContainText(difference);
  await submit(page).click();
  await expect(result(page)).toContainText('样例未通过。');
  await expect(result(page)).toContainText(difference);

  await code(page).fill(problem.solution.replace('print(0)', 'print(0, end="")').replace('print(index + 1)', 'print(index + 1, end="")'));
  await trySample.click();
  await expect(result(page)).toContainText('样例输出一致');
  expect(await stdout(page).textContent()).toBe(expected.slice(0, -1));
  await submit(page).click();
  await expect(result(page)).toContainText('通过 · AC', { timeout: 90000 });
});

test('本轮回归 · 删除备注后保留公告的开头与中间空行', async ({ page }) => {
  const problem = problems.find(item => item.id === 'P062')!;
  await page.goto('./#problem/P062');
  await code(page).fill(problem.solution);
  const cases = [['1\n|全部内容|\n', '\n1\n'], ['3\n上行\n|注|\n下行\n', '上行\n\n下行\n1\n']];
  for (const [input, expected] of cases) {
    expect(problem.cases).toContainEqual([input, expected]);
    await page.getByLabel('标准输入').fill(input);
    await run(page).click();
    await expect(run(page)).toBeEnabled();
    expect(await stdout(page).textContent()).toBe(expected);
  }
});

test('基础篇十二节导航、四大学习入口和项目可用', async ({ page }) => {
  await page.goto('./');
  const navigation = page.getByRole('navigation', { name: '主导航' });
  for (const name of ['从零开始', '题库练习', '专项复习', '在线工作台']) {
    await expect(navigation.getByRole('link', { name, exact: true })).toBeVisible();
  }
  await navigation.getByRole('link', { name: '从零开始', exact: true }).click();
  const foundation = page.locator('#foundation-courses .lesson-card');
  await expect(foundation).toHaveCount(12);
  await expect(page.locator('.learning-overview')).toContainText('0 / ' + lessons.reduce((total, _, index) => total + required(index), 0) + ' 个学习检查与练习');
  await foundation.first().click();
  for (const [index, lesson] of lessons.entries()) {
    await expect(page.getByRole('heading', { name: `第 ${index + 1} 课 · ${lesson.title}`, exact: true })).toBeVisible();
    if (index < lessons.length - 1) await page.getByRole('link', { name: '下一课 →' }).click();
  }
  await page.getByRole('link', { name: '查看综合项目 →' }).click();
  for (const project of projects) {
    await expect(page.locator('.project-card').filter({ hasText: project.title })).toBeVisible();
  }
});

for (const [index, lesson] of lessons.entries()) {
  const chapter = chapters[lesson.tag];
  if (chapter) {
    for (const example of chapterExamples(chapter)) {
      test('课程示例 · ' + example.title, async ({ page }) => {
        await page.goto('./#learn/' + (index + 1));
        await page.getByLabel('选择示例').selectOption(example.id);
        await run(page).click();
        if (example.diagnostic) {
          const { kind, file, line } = example.diagnostic;
          await expect(result(page)).toContainText('运行错误 · RE');
          await expect(result(page).locator('.error-box pre')).toContainText(kind);
          await result(page).getByRole('button', { name: `${file} · 第 ${line} 行` }).click();
          await expect(page.locator('.execution-error-line')).toBeVisible();
        } else {
          await expect(result(page)).toContainText('运行结束');
        }
        expect(await stdout(page).textContent()).toBe(example.output || '（空）');
      });
    }
    continue;
  }
  test('浏览器课程示例 ' + lesson.tag, async ({ page }) => {
    await page.goto('./#learn/' + (index + 1));
    await run(page).click();
    await expect(result(page)).toContainText('运行结束');
  });
}

for (const chapter of Object.values(chapters)) {
  for (const exercise of chapter?.exercises ?? []) {
    if (exercise.kind !== 'question' || !exercise.demonstration) continue;
    const demo = exercise.demonstration;
    test('读代码题输出验证 · ' + exercise.id, async ({ page }) => {
      await page.goto('./#lab');
      await code(page).fill(demo.source);
      await page.getByLabel('标准输入').fill(demo.input);
      await run(page).click();
      await expect(result(page)).toContainText('运行结束');
      expect(await stdout(page).textContent()).toBe(demo.output);
    });
  }
}

for (const problem of problems) {
  test('浏览器评测参考解法 ' + problem.id, async ({ page }) => {
    await page.goto('./#problem/' + problem.id);
    await fillSolution(page, problem);
    await submit(page).click();
    await expect(result(page)).toContainText('通过 · AC', { timeout: 90000 });
    await expect(result(page)).toContainText('通过 ' + (problem.cases.length + 1) + ' / ' + (problem.cases.length + 1) + ' 组');
  });
}

for (const project of projects) {
  test('浏览器项目样例 ' + project.title, async ({ page }) => {
    await page.goto('./#project/' + project.id);
    if (project.assessment) await fillSolution(page, project.assessment);
    else await code(page).fill(project.solution);
    await run(page).click();
    await expect(result(page)).toContainText('运行结束');
    expect(normalizeOutput(await stdout(page).textContent() ?? '')).toBe(normalizeOutput(project.expected));
    if (project.id === 'ledger') {
      await page.getByLabel('标准输入').fill('end\n');
      await run(page).click();
      await expect(stdout(page)).toHaveText('净额 0');
      await submit(page).click();
      await expect(result(page)).toContainText('通过 5 / 5 组', { timeout: 60000 });
    } else if (project.id === 'words') {
      await page.getByLabel('标准输入').fill('1\n');
      await run(page).click();
      await expect(stdout(page)).toHaveText('wind 3');
      await page.getByRole('button', { name: 'article.txt', exact: true }).click();
      await code(page).fill('!!!');
      await run(page).click();
      await expect(stdout(page)).toHaveText('空文本');
    }
  });
}

test('最终验收 · 函数检查返回值、只打印、重复调用和等价实现', async ({ page }) => {
  test.setTimeout(120000);
  await page.goto('./#learn/8');
  await page.getByRole('link', { name: /P076 实现箱数计算函数/ }).click();
  for (const [body, message] of [
    ['    return None', '返回了 None'],
    ['    print((items + capacity - 1) // capacity)', '产生了额外输出'],
    ['    key = (items, capacity)\n    if key in seen:\n        return 0\n    seen.append(key)\n    return (items + capacity - 1) // capacity', '第 3 次调用返回值与约定不符'],
  ]) {
    await code(page).fill('seen = []\ndef crate_count(items, capacity):\n' + body);
    await submit(page).click();
    await expect(result(page)).toContainText('答案错误 · WA');
    await expect(result(page)).toContainText(message);
  }
  await code(page).fill('def crate_count(n, size):\n    return (n + size - 1) // size');
  await submit(page).click();
  await expect(result(page)).toContainText('通过 4 / 4 组');
});

test('最终验收 · 多文件检查缺件、错返回、导入打印与读取', async ({ page }) => {
  test.setTimeout(150000);
  const task = problemById('P077');
  const helper = task.solutionFiles![0];
  await page.goto('./#learn/9');
  await page.getByRole('link', { name: /P077 拆分包裹报价入口/ }).click();
  await fillSolution(page, task);
  await page.getByRole('button', { name: helper.name, exact: true }).click();
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: '删除', exact: true }).click();
  await submit(page).click();
  await expect(result(page)).toContainText('模块缺少 parcel.py');
  await page.reload();
  await expect(page.getByRole('button', { name: helper.name, exact: true })).toHaveCount(0);
  await page.locator('input[type=file]').setInputFiles({ name: helper.name, mimeType: 'text/x-python', buffer: Buffer.from(helper.content) });
  await expect(page.getByRole('button', { name: helper.name, exact: true })).toHaveAttribute('aria-pressed', 'true');
  for (const [source, message] of [
    [helper.content.replace('return price', 'return price + 1'), '返回值与约定不符'],
    ['print("开始")\n' + helper.content, '产生了额外输出'],
    ['try:\n    input()\nexcept EOFError:\n    pass\n' + helper.content, '读取了标准输入'],
  ]) {
    await code(page).fill(source);
    await submit(page).click();
    await expect(result(page)).toContainText('答案错误 · WA');
    await expect(result(page)).toContainText(message);
  }
  await fillSolution(page, task);
  await submit(page).click();
  await expect(result(page)).toContainText('通过 4 / 4 组', { timeout: 60000 });
});

test('最终验收 · 评测检查真实文件及追加语义', async ({ page }) => {
  test.setTimeout(120000);
  const task = problemById('P078');
  await page.goto('./#learn/10');
  await page.getByRole('link', { name: /P078 把新签收行追加到日志/ }).click();
  await expect(page.getByRole('heading', { name: '样例输入文件 incoming.txt' })).toBeVisible();
  for (const [source, message] of [
    ['print(2)', '内容不一致'],
    [task.solution.replace('"a"', '"w"'), '内容不一致'],
    [task.solution.replace('target.write(line)', 'target.write(line.strip() + "\\n")'), '内容不一致'],
  ]) {
    await code(page).fill(source);
    await submit(page).click();
    await expect(result(page)).toContainText('答案错误 · WA');
    await expect(result(page)).toContainText('文件产物 journal.txt ' + message);
  }
  await page.goto('./#problem/P079');
  await code(page).fill('print(2)');
  await submit(page).click();
  await expect(result(page)).toContainText('文件产物 review.csv 未找到产物');
});

test('最终验收 · 从缺陷起始文件定位并修复调试题', async ({ page }) => {
  await page.goto('./#learn/11');
  await page.getByRole('link', { name: /P080 修复值班分箱统计/ }).click();
  await run(page).click();
  await expect(result(page)).toContainText('ZeroDivisionError');
  await result(page).getByRole('button', { name: /main.py · 第 \d+ 行/ }).click();
  await expect(page.locator('.execution-error-line')).toBeVisible();
  await submit(page).click();
  await expect(result(page)).toContainText('运行错误 · RE');
  await code(page).fill(problemById('P080').solution);
  await submit(page).click();
  await expect(result(page)).toContainText('通过 4 / 4 组');
});

test('最终验收 · 学习修改、章内订正、章外迁移和结项提交', async ({ page }) => {
  test.setTimeout(180000);
  await page.goto('./');
  await page.getByRole('link', { name: /开始第一课/ }).click();
  await page.getByLabel('选择示例').selectOption('receipt-fields');
  await code(page).fill('name = input()\nprint(f"领取：{name}")');
  await page.getByLabel('标准输入').fill('林 小明\n');
  await run(page).click();
  await expect(stdout(page)).toHaveText('领取：林 小明');
  await page.getByRole('link', { name: /P071 借阅单字段重排/ }).click();
  const task = problemById('P071');
  await code(page).fill(task.solution.replace('code = input()', 'code = str(int(input()))'));
  await submit(page).click();
  await expect(result(page)).toContainText('答案错误 · WA');
  await page.reload();
  await expect(code(page)).toContainText('str(int(input()))');
  const navigation = page.getByRole('navigation', { name: '主导航' });
  await navigation.getByRole('link', { name: '专项复习' }).click();
  await page.getByRole('link', { name: '重做 P071' }).click();
  await code(page).fill(task.solution);
  await submit(page).click();
  await expect(result(page)).toContainText('通过 4 / 4 组');
  await page.getByRole('link', { name: '本题所属课程' }).click();
  await expect(page.locator('[data-lesson-completed]')).toHaveText('已完成 1 / 8 练习');

  await navigation.getByRole('link', { name: '题库练习' }).click();
  await page.getByRole('link', { name: '章外练习', exact: true }).click();
  await expect(page.getByText('共 10 道题')).toBeVisible();
  await page.getByRole('link', { name: '入门迁移', exact: true }).click();
  await expect(page.getByText('共 2 道题')).toBeVisible();
  await page.getByRole('link', { name: '夜场巡检发车牌' }).click();
  await expect(page.getByText('章外练习 · 入门迁移')).toBeVisible();
  await code(page).fill(problemById('P081').solution);
  await submit(page).click();
  await expect(result(page)).toContainText('通过 5 / 5 组');

  await navigation.getByRole('link', { name: '从零开始' }).click();
  await page.getByRole('link', { name: /组合工具独立解题/ }).click();
  await page.getByRole('link', { name: /开始结项任务/ }).click();
  const project = projects.find(item => item.id === 'ledger')!.assessment!;
  await expect(code(page)).toContainText('pass');
  await fillSolution(page, project);
  await code(page).fill('print(' + JSON.stringify(project.sample[1]) + ', end="")');
  await submit(page).click();
  await expect(result(page)).toContainText('文件产物 ledger.csv 未找到产物');
  await fillSolution(page, project);
  await page.getByRole('button', { name: '试跑样例' }).click();
  await expect(result(page)).toContainText('样例契约通过');
  await result(page).getByText('本次产物 ledger.csv', { exact: true }).click();
  expect(await result(page).locator('details pre').textContent()).toBe(project.sample[3]!.artifacts![0].content);
  await submit(page).click();
  await expect(result(page)).toContainText('通过 5 / 5 组', { timeout: 60000 });
  await expect(result(page)).toContainText('通过 · AC');
  await page.reload();
  await expect(page.locator('#personal')).toHaveText('已通过');
  await page.getByRole('button', { name: 'ledger_tools.py', exact: true }).click();
  await expect(code(page)).toContainText('def parse_amount');
});

