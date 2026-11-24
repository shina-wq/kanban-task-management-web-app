import { Board, Column, Task } from '../models/board.model';

/**
 * Moving tasks between columns as their subtasks get checked.
 *
 * Columns are user-defined, so we only do it on boards whose column names read like a
 * progress flow (Todo → Doing → Done). "Roadmap" (Now / Next / Later) is left alone.
 *
 *  - 'sure':   first column sounds like "to do" AND last like "done" → move automatically.
 *  - 'unsure': only one of the two matches → ask the user first.
 *  - 'none':   neither matches → never move.
 */
export type FlowConfidence = 'sure' | 'unsure' | 'none';

export interface MoveSuggestion {
  column: Column;
  confidence: Exclude<FlowConfidence, 'none'>;
}

// Compared after lowercasing and dropping spaces/punctuation, so "To-Do" matches "todo".
const START_WORDS = ['todo', 'backlog', 'open', 'new', 'notstarted', 'planned'];
const PROGRESS_WORDS = ['doing', 'inprogress', 'wip', 'active', 'started', 'working'];
const DONE_WORDS = ['done', 'complete', 'completed', 'closed', 'finished', 'shipped', 'released', 'resolved'];

function normalize(name: string): string {
  return name.toLowerCase().replace(/[^a-z]/g, '');
}

function matches(column: Column | undefined, words: string[]): boolean {
  return !!column && words.includes(normalize(column.name));
}

export function flowConfidence(board: Board): FlowConfidence {
  const { columns } = board;
  if (columns.length < 2) return 'none';

  const startMatches = matches(columns[0], START_WORDS);
  const doneMatches = matches(columns.at(-1), DONE_WORDS);
  if (startMatches && doneMatches) return 'sure';
  return startMatches || doneMatches ? 'unsure' : 'none';
}

/**
 * Where a task should go now that its subtasks changed, or null to stay put.
 *  - all subtasks done                  → last column ("Done")
 *  - some done, task in the first column → the "in progress" column
 *  - not all done, task in the last one  → back to the "in progress" column
 *  - none done, task in a middle column  → back to the first column
 * Tasks without subtasks never move on their own.
 */
export function suggestMove(board: Board, column: Column, task: Task): MoveSuggestion | null {
  const confidence = flowConfidence(board);
  if (confidence === 'none') return null;

  const total = task.subtasks.length;
  if (total === 0) return null;
  const done = task.subtasks.filter((subtask) => subtask.isCompleted).length;

  const { columns } = board;
  const first = columns[0];
  const last = columns[columns.length - 1];
  // The "Doing" column: one named like it, otherwise the second column.
  const middle = columns.slice(1, -1);
  const progress = middle.find((c) => matches(c, PROGRESS_WORDS)) ?? middle[0];

  let target: Column | undefined;
  if (done === total) target = last;
  else if (column.id === last.id) target = progress ?? first;
  else if (done > 0 && column.id === first.id) target = progress;
  else if (done === 0 && column.id !== first.id) target = first;

  return target && target.id !== column.id ? { column: target, confidence } : null;
}
