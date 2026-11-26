const identifiers = (prefix: string, count: number, width: number) =>
  Array.from({ length: count }, (_, index) => prefix + String(index).padStart(width - prefix.length, '0'));

const labels = identifiers('T', 146, 10);
const commits = labels.slice(99);
export const labelOutputBoundary = {
  limit: 5957 * 11,
  input: labels.slice(0, 99).join(' ') + '\n47\n' + commits.map(label => 'COMMIT ' + label).join('\n') + '\n',
  output: commits.map((_, index) => labels.slice(0, 100 + index).join(',') + '\n').join('') + labels.join(',') + '\n',
};

const borrowers = identifiers('Q', 101, 8);
export const equipmentOutputBoundary = {
  limit: 300 * 9 + 6980 * 9,
  input: '300\nBORROW OWNER001\n' + borrowers.map(user => 'QUEUE ' + user + '\n').join('') +
    'SHOW\n'.repeat(69) + 'RETURN WRONG001\n'.repeat(129),
  output: 'OK\n'.repeat(102) + ('OWNER001 ' + borrowers.join(',') + '\n').repeat(69) + 'DENIED\n'.repeat(129),
};

const readers = identifiers('R', 120, 10);
export const libraryOutputBoundary = {
  limit: 65_536,
  input: 'NORMAL 240\nADD BOOK000001 TITLE00001\nBORROW BOOK000001 OWNER00001\n' +
    readers.map(user => 'HOLD BOOK000001 ' + user + '\n').join('') + 'SHOW BOOK000001\n'.repeat(47) + 'SHOW MISSING\n'.repeat(71),
  output: 'OK\n'.repeat(122) + ('BOOK000001 TITLE00001 OWNER00001 ' + readers.join(',') + '\n').repeat(47) + 'UNKNOWN\n'.repeat(71),
};
