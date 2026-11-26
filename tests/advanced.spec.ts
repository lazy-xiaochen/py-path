import { expect, test } from '@playwright/test';
import { advancedModules, advancedProblems } from '../src/advanced';
import { projects } from '../src/content';

test('进阶课程导航、运行示例、书签恢复与基础篇进度隔离', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('region', { name: '第二阶段 · Python 进阶' })).toHaveCount(0);
  await page.getByRole('link', { name: '学习进阶篇', exact: true }).click();
  await expect(page.getByRole('heading', { name: '第 1 课 · 列表、切片与对象引用' })).toBeVisible();
  await expect(page.getByText('第一次赋值与浅拷贝后的对象关系')).toBeVisible();

  const quiz = page.locator('#advanced-list-identity');
  await quiz.getByRole('button', { name: 'True True', exact: true }).click();
  await page.getByRole('link', { name: '专项复习', exact: true }).click();
  await page.getByRole('link', { name: '重做知识题', exact: true }).click();
  await expect(quiz).toBeFocused();
  await quiz.getByRole('button', { name: 'False True', exact: true }).click();
  await expect(page.locator('[data-lesson-completed]')).toHaveText('已完成 1 / 8 练习');

  await page.getByLabel('选择示例').selectOption('nested-copy');
  await page.getByRole('button', { name: '运行', exact: true }).click();
  await expect(page.locator('.result')).toContainText("['早', '独立']");
  await page.reload();
  await expect(page.getByLabel('选择示例')).toHaveValue('nested-copy');
  await expect(page.locator('[data-lesson-completed]')).toHaveText('已完成 1 / 8 练习');
  await expect(page.locator('.result')).toContainText("['早', '独立']");

  await page.getByRole('link', { name: '下一课 →' }).click();
  await expect(page.getByRole('heading', { name: '第 2 课 · 列表编辑与排序' })).toBeVisible();
  await page.getByRole('link', { name: '← 数据结构进阶' }).click();
  await expect(page.getByText('已完成 1 / 40 项')).toBeVisible();
  await page.getByRole('link', { name: '从零开始', exact: true }).click();
  const advanced = page.getByRole('region', { name: '第二阶段 · Python 进阶' });
  const structures = advanced.getByRole('region', { name: '数据结构进阶' });
  const firstLesson = structures.getByRole('link', { name: /列表、切片与对象引用/ });
  await expect(page.getByRole('region', { name: '基础篇课程' }).locator('.lesson-card')).toHaveCount(12);
  await expect(structures.locator('.lesson-card')).toHaveCount(5);
  await expect(firstLesson).toContainText('1 / 8');
  await expect(page.locator('.learning-overview')).toContainText('0 / 124 个学习检查与练习');
  await structures.getByRole('link', { name: '模块介绍与测评 →' }).click();
  await expect(page.getByRole('link', { name: '阶段测评 · 场次报名核验台' })).toBeVisible();
});

test('窄屏首页入口可经侧栏进入另一进阶模块', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await page.getByRole('link', { name: '学习进阶篇', exact: true }).click();
  await page.locator('.lesson-aside').getByRole('link', { name: /迭代器与生成器表达式/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('第 3 课 · 迭代器与生成器表达式');
});

test('桌面从学习进阶篇进入后，目录可独立滚到底并打开面向对象', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('./');
  await page.getByRole('link', { name: '学习进阶篇', exact: true }).click();
  const directory = page.locator('.lesson-aside');
  const lastLesson = directory.getByRole('link', { name: /管理系统设计与重构/ });
  await expect(directory).toBeInViewport();
  await expect(lastLesson).not.toBeInViewport();
  const bounds = (await directory.boundingBox())!;
  await page.mouse.move(bounds.x + 40, bounds.y + 36);
  await page.mouse.wheel(0, 340);
  await expect.poll(() => directory.evaluate(node => node.scrollTop)).toBeGreaterThan(0);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.mouse.wheel(0, 1400);
  await expect(lastLesson).toBeInViewport();
  await page.mouse.wheel(0, 300);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await lastLesson.click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('第 7 课 · 管理系统设计与重构');
  const content = (await page.locator('.lesson-body').boundingBox())!;
  await page.mouse.move(content.x + 40, content.y + 36);
  await page.mouse.wheel(0, 340);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
});

test('进阶题库、阶段测评、正式评测、错题重做与刷新', async ({ page }) => {
  const task = advancedProblems.find(problem => problem.id === 'A020')!;
  await page.goto('./#bank/advanced');
  await expect(page.locator('#match-count')).toHaveText('共 101 道题');
  await page.getByLabel('学习阶段').selectOption('foundation');
  await expect(page.locator('#match-count')).toHaveText('共 86 道题');
  await page.getByLabel('学习阶段').selectOption('advanced');
  await page.getByLabel('搜索题目').fill('ABC213 B');
  await page.getByRole('link', { name: '后备讲解员' }).click();
  await page.getByText('查看原题出处', { exact: true }).click();
  await expect(page.getByRole('link', { name: 'Booby Prize ↗' })).toHaveAttribute('href', /abc213_b/);
  await page.getByRole('link', { name: '本题所属课程' }).click();
  await expect(page.getByRole('heading', { name: '第 2 课 · 列表编辑与排序' })).toBeVisible();

  await page.getByRole('link', { name: '← 数据结构进阶' }).click();
  await page.getByRole('link', { name: '阶段测评 · 场次报名核验台' }).click();
  const editor = page.locator('.cm-content');
  const result = page.locator('.result');
  await editor.fill('print(' + JSON.stringify(task.sample[1]) + ', end="")');
  await page.getByRole('button', { name: '试跑样例', exact: true }).click();
  await expect(result).toContainText('样例输出一致');
  await page.getByRole('button', { name: '提交评测', exact: true }).click();
  await expect(result).toContainText('WA');
  await expect(result).toContainText('非样例用例未通过');
  await page.getByRole('link', { name: '专项复习', exact: true }).click();
  await page.getByRole('link', { name: '重做 A020' }).click();
  await editor.fill(task.solution);
  await page.getByRole('button', { name: '提交评测', exact: true }).click();
  await expect(result).toContainText('AC');
  await page.reload();
  await expect(page.locator('#personal')).toHaveText('已通过');
  await expect(editor).toContainText('rosters = {}');
  await page.getByRole('link', { name: '专项复习', exact: true }).click();
  await expect(page.getByRole('link', { name: '重做 A020' })).toHaveCount(0);
  await page.goto('./#learn/advanced/structures');
  await expect(page.getByText('已完成 1 / 40 项')).toBeVisible();
  await expect(page.getByRole('link', { name: '阶段测评 · 场次报名核验台' }).locator('../..')).toContainText('已通过');
});

test('学习路径直达推导式与解包，运行示例并完成模块报表测评', async ({ page }) => {
  const task = advancedProblems.find(problem => problem.id === 'A036')!;
  await page.goto('./#learn');
  const expressions = page.getByRole('region', { name: '推导式与解包', exact: true });
  await expect(expressions.locator('.lesson-card')).toHaveCount(4);
  await expressions.getByRole('link', { name: /可迭代对象与列表推导式/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('第 1 课 · 可迭代对象与列表推导式');
  await page.getByRole('link', { name: '下一课 →' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('第 2 课 · 字典、集合与多层推导式');
  await page.getByRole('link', { name: '下一课 →' }).click();
  await page.getByLabel('选择示例').selectOption('source-versus-body');
  await page.getByRole('button', { name: '运行', exact: true }).click();
  await expect(page.locator('.result')).toContainText('取得批次');
  await expect(page.locator('.result')).toContainText('[40] []');
  await page.getByRole('link', { name: '下一课 →' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('第 4 课 · 解包、对齐与组合');
  await page.getByRole('link', { name: '开始课内阶段测评 →' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('活动积分对账报表');

  const editor = page.locator('.cm-content');
  const result = page.locator('.result');
  await editor.fill('print(' + JSON.stringify(task.sample[1]) + ', end="")');
  await page.getByRole('button', { name: '提交评测', exact: true }).click();
  await expect(result).toContainText('非样例用例未通过');
  await page.getByRole('link', { name: '专项复习', exact: true }).click();
  await page.getByRole('link', { name: '重做 A036' }).click();
  await editor.fill(task.solution);
  await page.getByRole('button', { name: '提交评测', exact: true }).click();
  await expect(result).toContainText('通过 7 / 7 组');
  await page.getByRole('link', { name: '本题所属课程' }).click();
  await page.getByRole('link', { name: '← 推导式与解包' }).click();
  await page.reload();
  await expect(page.getByText('已完成 1 / 32 项')).toBeVisible();
  await expect(page.getByRole('link', { name: '阶段测评 · 活动积分对账报表' }).locator('../..')).toContainText('已通过');
  await page.goto('./#learn/advanced/structures');
  await expect(page.getByText('已完成 0 / 40 项')).toBeVisible();
});

test('函数模块沿用进阶课程目录，运行递归并通过目录配额测评', async ({ page }) => {
  const task = advancedProblems.find(problem => problem.id === 'A064')!;
  await page.goto('./');
  await page.getByRole('link', { name: '学习进阶篇', exact: true }).click();
  const directory = page.locator('.lesson-aside');
  await expect(directory.getByRole('heading', { name: '函数进阶、作用域与递归' })).toBeVisible();
  await directory.getByRole('link', { name: /调用栈与递归基础/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('第 6 课 · 调用栈与递归基础');
  await page.getByLabel('选择示例').selectOption('recursion-factorial');
  await page.getByRole('button', { name: '运行', exact: true }).click();
  await expect(page.locator('.result')).toContainText('出 3 6');
  await page.getByRole('link', { name: '下一课 →' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('第 7 课 · 分治、树形遍历与记忆化');
  await page.getByRole('link', { name: '开始课内阶段测评 →' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('分层目录配额报告');
  await page.locator('.cm-content').fill(task.solution);
  await page.getByRole('button', { name: '提交评测', exact: true }).click();
  await expect(page.locator('.result')).toContainText('通过 6 / 6 组');
  await page.getByRole('link', { name: '本题所属课程' }).click();
  await page.getByRole('link', { name: '← 函数进阶、作用域与递归' }).click();
  await expect(page.getByText('已完成 1 / 58 项')).toBeVisible();
  await page.getByRole('link', { name: '← 学习路径' }).click();
  const module = page.getByRole('region', { name: '函数进阶、作用域与递归' });
  await expect(module.locator('.lesson-card')).toHaveCount(7);
  await expect(module.getByRole('link', { name: /分治、树形遍历与记忆化/ })).toContainText('1 / 8');
});

test('重复调用检测共享默认值，修复后清除错题并保存进度', async ({ page }) => {
  const task = advancedProblems.find(problem => problem.id === 'A038')!;
  await page.goto('./#problem/A038');
  await expect(page.getByText('样例调用与返回值')).toBeVisible();
  const result = page.locator('.result');
  await page.getByRole('button', { name: '试跑样例', exact: true }).click();
  await expect(result).toContainText('样例契约通过');
  await page.getByRole('button', { name: '提交评测', exact: true }).click();
  await expect(result).toContainText('第 2 次调用返回值与约定不符');
  await page.getByRole('link', { name: '专项复习', exact: true }).click();
  await page.getByRole('link', { name: '重做 A038' }).click();
  await page.locator('.cm-content').fill(task.solution);
  await page.getByRole('button', { name: '提交评测', exact: true }).click();
  await expect(result).toContainText('通过 4 / 4 组');
  await page.reload();
  await expect(page.locator('#personal')).toHaveText('已通过');
  await page.getByRole('link', { name: '专项复习', exact: true }).click();
  await expect(page.getByRole('link', { name: '重做 A038' })).toHaveCount(0);
});

test('面向对象课程卡、数据类示例与预约阶段测评', async ({ page }) => {
  await page.goto('./#learn');
  const objects = page.getByRole('region', { name: '面向对象编程', exact: true });
  await expect(objects.locator('.lesson-card')).toHaveCount(7);
  await objects.getByRole('link', { name: /特殊方法与数据类/ }).click();
  await page.getByLabel('选择示例').selectOption('protocols-dataclass');
  await page.getByRole('button', { name: '运行', exact: true }).click();
  await expect(page.locator('.result')).toContainText('False []');
  await page.getByRole('link', { name: '下一课 →' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('第 7 课 · 管理系统设计与重构');
  await page.getByRole('link', { name: '开始课内阶段测评 →' }).click();
  const problem = advancedProblems.find(item => item.id === 'A092')!;
  await page.locator('.cm-content').fill(problem.solution);
  await page.getByRole('button', { name: '提交评测', exact: true }).click();
  const count = problem.cases.length + 1;
  await expect(page.locator('.result')).toContainText('通过 ' + count + ' / ' + count + ' 组', { timeout: 90000 });
});

test('成绩项目有分阶段自测并核验实际 CSV', async ({ page }) => {
  const project = projects.find(item => item.id === 'grade-analysis')!;
  await page.goto('./#projects');
  await page.getByRole('link', { name: /成绩数据分析/ }).click();
  await expect(page.getByRole('heading', { name: '分阶段实现' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '拓展挑战' })).toBeVisible();
  const editor = page.locator('.cm-content');
  const result = page.locator('.result');
  await editor.fill('print(' + JSON.stringify(project.expected) + ', end="")');
  await page.getByRole('button', { name: '提交评测', exact: true }).click();
  await expect(result).toContainText('文件产物 summary.csv');
  await editor.fill(project.solution);
  await page.getByRole('button', { name: '提交评测', exact: true }).click();
  await expect(result).toContainText('通过 7 / 7 组', { timeout: 90000 });
  await page.getByRole('link', { name: '← 综合项目' }).click();
  await expect(page.getByRole('link', { name: /成绩数据分析/ })).toContainText('已通过');
});

test('借阅项目多文件接口与整套命令共同通过评测', async ({ page }) => {
  test.setTimeout(180000);
  const assessment = projects.find(item => item.id === 'library-loans')!.assessment!;
  await page.goto('./#projects');
  await page.getByRole('link', { name: /图书借阅与预约管理/ }).click();
  await expect(page.getByRole('heading', { name: '需求分析与设计' })).toBeVisible();
  await expect(page.getByRole('link', { name: '项目先修课程' })).toHaveAttribute('href', '#learn/advanced/object-design');
  await page.getByRole('button', { name: 'library.py', exact: true }).click();
  await page.locator('.cm-content').fill(assessment.solutionFiles![0].content);
  const result = page.locator('.result');
  await page.getByRole('button', { name: '提交评测', exact: true }).click();
  await expect(result).toContainText('通过 7 / 7 组', { timeout: 150000 });
  await page.reload();
  await expect(page.locator('#personal')).toHaveText('已通过');
});

test('直接提交闭包接口，并在课程进度中保存通过记录', async ({ page }) => {
  const problem = advancedProblems.find(item => item.id === 'A093')!;
  await page.goto('./#learn/advanced/function-scope');
  await page.getByRole('link', { name: /两个计数器的交错调用/ }).click();
  await expect(page.getByRole('heading', { name: '样例检查代码' })).toBeVisible();
  await page.locator('.cm-content').fill(problem.solution);
  await page.getByRole('button', { name: '试跑样例', exact: true }).click();
  await expect(page.locator('.result')).toContainText('样例契约通过');
  await page.getByRole('button', { name: '提交评测', exact: true }).click();
  await expect(page.locator('.result')).toContainText('通过 4 / 4 组');
  await page.getByRole('link', { name: '本题所属课程' }).click();
  await expect(page.locator('[data-lesson-completed]')).toHaveText('已完成 1 / 9 练习');
  await page.reload();
  await expect(page.locator('[data-lesson-completed]')).toHaveText('已完成 1 / 9 练习');
});

test('四个模块各有独立章外入口，章外题通过后课内数字保持原值', async ({ page }) => {
  for (const module of advancedModules) {
    await page.goto('./#learn/advanced/' + module.slug);
    await expect(page.getByRole('heading', { name: '章外迁移测评' })).toBeVisible();
    await expect(page.getByRole('link', { name: module.transfer.label })).toHaveAttribute('href', '#problem/' + module.transfer.id);
    await expect(page.locator('[data-transfer-status]')).toHaveText('待练习');
  }
  const module = advancedModules[3];
  const problem = advancedProblems.find(problem => problem.id === module.transfer.id)!;
  const before = await page.getByText(/已完成 0 \/ \d+ 项/).textContent();
  await page.getByRole('link', { name: module.transfer.label }).click();
  await page.locator('.cm-content').fill(problem.solution);
  await page.getByRole('button', { name: '提交评测', exact: true }).click();
  await expect(page.locator('.result')).toContainText('通过 4 / 4 组');
  await page.goto('./#learn/advanced/' + module.slug);
  await page.reload();
  await expect(page.locator('[data-transfer-status]')).toHaveText('已通过');
  await expect(page.getByText(before!, { exact: true })).toBeVisible();
});
