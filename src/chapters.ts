import { inputOutput } from './lessons/input-output.ts';
import { variables } from './lessons/variables.ts';
import { conditions } from './lessons/conditions.ts';
import { loops } from './lessons/loops.ts';
import { strings } from './lessons/strings.ts';
import { lists } from './lessons/lists.ts';
import { dictionaries } from './lessons/dictionaries.ts';
import { functions } from './lessons/functions.ts';
import { modules } from './lessons/modules.ts';
import { files } from './lessons/files.ts';
import { debugging } from './lessons/debugging.ts';
import { problemSolving } from './lessons/problem-solving.ts';
import type { Chapter } from './teaching-types';

export const chapters: Partial<Record<string, Chapter>> = {
  '输入输出': inputOutput,
  '变量与运算': variables,
  '条件判断': conditions,
  '循环': loops,
  '字符串': strings,
  '列表': lists,
  '字典': dictionaries,
  '函数': functions,
  '模块': modules,
  '文件读写': files,
  '异常调试': debugging,
  '综合应用': problemSolving,
};

export const chapterExamples = (chapter: Chapter) => chapter.topics.flatMap(topic => topic.examples);
