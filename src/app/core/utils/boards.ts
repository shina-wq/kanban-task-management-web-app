import { Board, Column, TaskLocation } from '../models/board.model';

export function findBoard(boards: Board[], boardId: string): Board | undefined {
  return boards.find((board) => board.id === boardId);
}

export function findColumn(boards: Board[], boardId: string, columnId: string): Column | undefined {
  return findBoard(boards, boardId)?.columns.find((column) => column.id === columnId);
}

/** A task together with the column (status) that holds it. */
export function findTask(
  boards: Board[],
  boardId: string,
  taskId: string,
): TaskLocation | undefined {
  for (const column of findBoard(boards, boardId)?.columns ?? []) {
    const task = column.tasks.find((t) => t.id === taskId);
    if (task) return { task, column };
  }
  return undefined;
}
