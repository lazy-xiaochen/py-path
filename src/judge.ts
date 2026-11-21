export type OutputComparison = 'relaxed' | 'exact';

export function normalizeOutput(text: string, comparison: OutputComparison = 'relaxed') {
  const normalized = text.replace(/\r\n?/g, '\n');
  if (comparison === 'exact') {
    return normalized.endsWith('\n') ? normalized.slice(0, -1) : normalized;
  }
  const lines = normalized.split('\n').map(line => line.trimEnd());
  while (lines.length && lines.at(-1) === '') lines.pop();
  return lines.join('\n');
}

function describeOutputCharacter(character: string | undefined) {
  if (character === undefined) return '行尾';
  if (character === ' ') return '空格';
  if (character === '\t') return '制表符';
  return /\s/u.test(character) ? '其他空白' : '非空白字符';
}

export function exactOutputDifference(expected: string, actual: string) {
  const expectedLines = normalizeOutput(expected, 'exact').split('\n');
  const actualLines = normalizeOutput(actual, 'exact').split('\n');
  for (let row = 0; row < Math.max(expectedLines.length, actualLines.length); row++) {
    const expectedLine = expectedLines[row];
    const actualLine = actualLines[row];
    if (expectedLine === actualLine) continue;
    const line = '第 ' + (row + 1) + ' 行';
    if (expectedLine === undefined) return line + '是多出的输出。';
    if (actualLine === undefined) return '缺少' + line + '输出。';
    const expectedCharacters = Array.from(expectedLine);
    const actualCharacters = Array.from(actualLine);
    let column = 0;
    while (expectedCharacters[column] === actualCharacters[column]) column++;
    const position = line + '第 ' + (column + 1) + ' 列';
    const expectedCharacter = describeOutputCharacter(expectedCharacters[column]);
    const actualCharacter = describeOutputCharacter(actualCharacters[column]);
    return expectedCharacter === actualCharacter ? position + '的字符不同。' :
      position + '期望为' + expectedCharacter + '，实际为' + actualCharacter + '。';
  }
}

export const verdicts = {
  AC: '通过', WA: '答案错误', RE: '运行错误', TLE: '超时', OLE: '输出超限',
  OK: '运行结束', STOP: '已停止', UNAVAILABLE: '隔离环境不可用', INVALID: '无法运行',
} as const;

export const explanations: Record<string, string> = {
  SyntaxError: 'Python 无法解析这段代码。检查冒号、配对的括号和引号。',
  IndentationError: '缩进与语句块不匹配。检查冒号后是否缩进，同一层是否对齐。',
  TabError: '缩进混用了制表符和空格。建议统一使用四个空格。',
  ValueError: '值的格式或范围不符合要求。例如 int 只能转换合法的整数文本。',
  TypeError: '操作所需的数据类型不匹配。检查参数以及参与运算的值。',
  NameError: '当前作用域找不到这个名称。检查拼写、定义顺序和变量的作用域。',
  UnboundLocalError: '函数读取了尚未赋值的局部变量。检查每个分支是否都赋值。',
  ZeroDivisionError: '除数为 0。检查输入并在计算前处理该边界。',
  IndexError: '序列索引越界。非空序列的最后一个正向索引是长度减一。',
  KeyError: '字典中没有这个键。可以先检查键，或使用 get 提供默认值。',
  EOFError: '已经读到了输入末尾。请在运行前填写「标准输入」。每次 input() 读取一行，例如两次 input() 需要两行。',
  ModuleNotFoundError: '找不到模块。检查模块名与工作区文件，执行环境仅含已打包的模块。',
  ImportError: '模块中的对象无法导入。检查名称和是否存在循环导入。',
  FileNotFoundError: '虚拟工作目录里没有该文件。检查路径、文件名和是否已导入。',
  AttributeError: '对象没有这个属性或方法。检查拼写和对象类型。',
  AssertionError: 'assert 检查失败。查看检查条件与实际值。',
  RecursionError: '递归层数超限。检查结束条件和每次递归是否接近它。',
  SystemExit: '程序以非零状态退出。检查传给 exit 或 sys.exit 的值。',
};

export const advice: Record<string, string> = {
  WA: '核对输出格式，再测试最小输入、相等端点和重复值。',
  RE: '用自定义输入复现，检查输入转换、索引、空数据和异常栈。',
  TLE: '检查循环是否能结束，以及最大规模下是否重复计算。',
  OLE: '输出超过 64 KiB，已截断并停止。检查循环内的打印。',
  UNAVAILABLE: '请通过 HTTP 或 HTTPS 打开页面后重试。',
};
