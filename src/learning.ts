import { chapters } from './chapters';
import { lessons, problems } from './content';
import { data, submissionTotals } from './storage';
import type { Chapter, Question } from './teaching-types';

export const problemsForLesson = (index: number) => problems.filter(problem => problem.tag === lessons[index].tag);

export function questionSolved(index: number | undefined, question: Question) {
  return !!(data.questions[question.id]?.solved ||
    (index !== undefined && question.legacy && data.progress[index]?.[question.legacy]));
}

export function lessonStats(index: number) {
  const chapter = chapters[lessons[index].tag];
  return progressStats(chapter, index);
}

export function chapterStats(chapter: Chapter, legacyIndex?: number) {
  return progressStats(chapter, legacyIndex);
}

function progressStats(chapter: Chapter | undefined, index: number | undefined) {
  const questions = chapter?.exercises.filter(exercise => exercise.kind === 'question') ?? [];
  const ids = chapter ? chapter.exercises.flatMap(exercise => exercise.kind === 'coding' && !exercise.warmup ? [exercise.problem] : []) :
    index === undefined ? [] : problemsForLesson(index).map(problem => problem.id);
  const done = ids.map(id => !!data.solved[id]);
  if (chapter) done.push(...questions.map(question => questionSolved(index, question)));
  else if (index !== undefined) done.push(!!data.progress[index]?.explain, !!data.progress[index]?.run);
  const records = [...ids.map(submissionTotals), ...questions.flatMap(question => data.questions[question.id] ?? [])];
  return {
    completed: done.filter(Boolean).length,
    total: done.length,
    attemptCount: records.reduce((sum, record) => sum + record.attempts, 0),
    correctCount: records.reduce((sum, record) => sum + record.correct, 0),
  };
}

export function accuracy(correct: number, attempts: number) {
  return attempts ? Math.round(correct / attempts * 100) + '%' : '暂无作答';
}
