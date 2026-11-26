import { expect, test, type Page } from '@playwright/test';
import { auditExamples, auditProblems, badInterfaces, casesOf, limits } from './runtime-audit';

const runsPerBrowser = 20;
function batches<T>(values: T[]): T[][] {
  return Array.from({ length: Math.ceil(values.length / runsPerBrowser) },
    (_, index) => values.slice(index * runsPerBrowser, (index + 1) * runsPerBrowser));
}

async function ready(page: Page) {
  await page.goto('tests/runtime-audit.html');
  await page.waitForFunction(() => !!window.runtimeAudit);
}

for (const [group, examples] of batches(auditExamples).entries()) {
  test('浏览器运行器 · 课程示例与演示 · ' + (group + 1), async ({ page }) => {
    await ready(page);
    const failures = await page.evaluate(async ids => {
      const results = [];
      for (const id of ids) results.push(await window.runtimeAudit.example(id));
      return results;
    }, examples.map(item => item.id));
    for (const [index, { id, example }] of examples.entries()) {
      const diagnostic = 'diagnostic' in example ? example.diagnostic ?? null : null;
      expect.soft(failures[index], id).toEqual({ status: diagnostic ? 'RE' : 'OK', matches: true, diagnostic });
    }
  });
}

const referenceCases = auditProblems.flatMap(problem => casesOf(problem).map((_, index) => ({ id: problem.id, index })));
for (const [group, cases] of batches(referenceCases).entries()) {
  test('浏览器评测 · 全题库和结项参考解 · ' + (group + 1), async ({ page }) => {
    await ready(page);
    const results = await page.evaluate(async items => {
      const results = [];
      for (const item of items) results.push(await window.runtimeAudit.grade(item.id, item.index));
      return results;
    }, cases);
    for (const [index, item] of cases.entries()) {
      expect.soft(results[index].verdict, item.id + ' · 用例 ' + (item.index + 1) + ' · ' + results[index].issue).toBe('AC');
    }
  });
}

for (const [id, explanation] of badInterfaces) {
  test('浏览器评测 · 拒绝接口错误 · ' + id, async ({ page }) => {
    await ready(page);
    const correctCount = casesOf(auditProblems.find(problem => problem.id === id)!).length;
    for (let index = 0; index < correctCount; index++) {
      const result = await page.evaluate(({ id, index }) => window.runtimeAudit.grade(id, index), { id, index });
      expect(result.verdict, id + ' · 参考解用例 ' + (index + 1) + ' · ' + result.issue).toBe('AC');
    }
    const results = await page.evaluate(id => window.runtimeAudit.badInterface(id), id);
    expect(results.some(result => result.verdict === 'WA' && !result.diagnostic), explanation).toBe(true);
    expect(results.every(result => ['AC', 'WA'].includes(result.verdict))).toBe(true);
    await test.info().attach('接口拒绝证据', {
      contentType: 'application/json', body: JSON.stringify({ id, explanation, results }),
    });
  });
}

for (const { id, output, oldBytes } of limits) {
  test('浏览器评测 · 输出预算和旧输入 OLE · ' + id, async ({ page }) => {
    await ready(page);
    const result = await page.evaluate(id => window.runtimeAudit.boundary(id), id);
    expect(result).toMatchObject({ status: 'OK', exact: true, oldStatus: 'OLE', capped: true });
    expect(result.bytes).toBe(new TextEncoder().encode(output).length);
    expect(result.bytes).toBeGreaterThan(64_000);
    expect(result.margin).toBeGreaterThanOrEqual(0);
    await test.info().attach('输出预算证据', {
      contentType: 'application/json', body: JSON.stringify({ id, oldBytes, ...result }),
    });
  });
}

test('浏览器运行器 · 词频项目样例', async ({ page }) => {
  await ready(page);
  expect(await page.evaluate(() => window.runtimeAudit.words())).toEqual({ status: 'OK', exact: true });
});
