import { Column, Task } from '../models/board.model';

/** Columns with only the tasks whose title contains `search` (case-insensitive). */
export function filterColumns(columns: Column[], search: string): Column[] {
  const term = search.trim().toLowerCase();
  if (!term) return columns;

  return columns.map((column) => ({
    ...column,
    tasks: column.tasks.filter((task) => task.title.toLowerCase().includes(term)),
  }));
}

/** Number of tasks across all the columns. */
export function countTasks(columns: Column[]): number {
  return columns.reduce((total, column) => total + column.tasks.length, 0);
}

/** Number of the task's subtasks that are checked. */
export function completedSubtasks(task: Task): number {
  return task.subtasks.filter((subtask) => subtask.isCompleted).length;
}

/** A task is done when every subtask is checked (a task without subtasks is never done). */
export function isTaskDone(task: Task): boolean {
  return task.subtasks.length > 0 && completedSubtasks(task) === task.subtasks.length;
}
