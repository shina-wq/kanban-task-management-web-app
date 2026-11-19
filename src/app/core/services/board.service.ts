import { Injectable, signal } from '@angular/core';
import seedData from '../data/seed-data.json';
import { Board, BoardDraft, Task, TaskDraft, TaskLocation } from '../models/board.model';
import { isoDate } from '../utils/dates';
import { createId, createSlug } from '../utils/id';
import { readJson, removeItem, writeJson } from '../utils/storage';

/** A change that can't be made, e.g. the task was deleted meanwhile. The message is for the user. */
export class BoardError extends Error {
  override readonly name = 'BoardError';
}

/** A message to show the user for an error thrown while saving. */
export function saveErrorMessage(error: unknown): string {
  return error instanceof BoardError ? error.message : 'Something went wrong. Please try again.';
}

const STORAGE_KEY = 'kanban.boards';

/**
 * The sample boards. Due dates are stored as days from today ("dueInDays": -2) and turned
 * into real dates here, so the samples always show a mix of overdue, today and upcoming.
 */
function sampleBoards(): Board[] {
  return seedData.boards.map((board) => ({
    ...board,
    columns: board.columns.map((column) => ({
      ...column,
      tasks: column.tasks.map(({ dueInDays, subtasks, ...task }) => ({
        ...task,
        subtasks: subtasks.map((subtask) => ({ ...subtask })),
        dueDate: isoDate(dueInDays),
      })),
    })),
  }));
}

// Single source of truth for boards, columns and tasks.
@Injectable({ providedIn: 'root' })
export class BoardService {
  private readonly state = signal<Board[]>(readJson(STORAGE_KEY, sampleBoards()));

  readonly boards = this.state.asReadonly();

  // Queries

  getBoard(boardId: string): Board | undefined {
    return this.state().find((board) => board.id === boardId);
  }

  findTask(boardId: string, taskId: string): TaskLocation | undefined {
    return this.locate(this.state(), boardId, taskId);
  }

  /** Titles of every task on a board, except `exceptTaskId` (the task being edited). */
  taskTitles(boardId: string, exceptTaskId?: string): string[] {
    return (this.getBoard(boardId)?.columns ?? [])
      .flatMap((column) => column.tasks)
      .filter((task) => task.id !== exceptTaskId)
      .map((task) => task.title);
  }

  // Boards

  createBoard(draft: BoardDraft): Board {
    const board: Board = {
      id: createSlug(
        draft.name,
        this.state().map((b) => b.id),
      ),
      name: draft.name.trim(),
      columns: draft.columns.map((c) => ({ id: createId(), name: c.name.trim(), tasks: [] })),
    };
    this.update((boards) => boards.push(board));
    return board;
  }

  // Keeps tasks in columns that still exist; removed columns take their tasks with them.
  updateBoard(boardId: string, draft: BoardDraft): void {
    this.update((boards) => {
      const board = boards.find((b) => b.id === boardId);
      if (!board) return;

      board.name = draft.name.trim();
      board.columns = draft.columns.map((c) => ({
        id: c.id ?? createId(),
        name: c.name.trim(),
        tasks: board.columns.find((existing) => existing.id === c.id)?.tasks ?? [],
      }));
    });
  }

  deleteBoard(boardId: string): void {
    this.update((boards) => {
      const index = boards.findIndex((b) => b.id === boardId);
      if (index !== -1) boards.splice(index, 1);
    });
  }

  // Tasks

  /** Adds a task to the chosen column. Throws a BoardError if that column no longer exists. */
  createTask(boardId: string, draft: TaskDraft): Task {
    this.assertColumnExists(boardId, draft.columnId);

    const task: Task = { id: createId(), ...this.cleanTask(draft) };
    this.update((boards) => this.columnIn(boards, boardId, draft.columnId)?.tasks.push(task));
    return task;
  }

  /**
   * Saves the task's fields. If its status (column) changed, moves it to the end of the
   * new column; otherwise it keeps its place. Throws a BoardError if the task or the
   * chosen column no longer exists — checked first, so a failed save changes nothing.
   */
  updateTask(boardId: string, taskId: string, draft: TaskDraft): void {
    if (!this.findTask(boardId, taskId)) {
      throw new BoardError('This task no longer exists.');
    }
    this.assertColumnExists(boardId, draft.columnId);

    this.update((boards) => {
      const found = this.locate(boards, boardId, taskId);
      if (!found) return;
      Object.assign(found.task, this.cleanTask(draft));

      if (found.column.id !== draft.columnId) {
        this.removeTask(boards, boardId, taskId);
        this.columnIn(boards, boardId, draft.columnId)?.tasks.push(found.task);
      }
    });
  }

  deleteTask(boardId: string, taskId: string): void {
    this.update((boards) => this.removeTask(boards, boardId, taskId));
  }

  toggleSubtask(boardId: string, taskId: string, subtaskIndex: number): void {
    this.update((boards) => {
      const subtask = this.locate(boards, boardId, taskId)?.task.subtasks[subtaskIndex];
      if (subtask) subtask.isCompleted = !subtask.isCompleted;
    });
  }

  /** Moves a task to another column (status change) or position (drag and drop). */
  moveTask(boardId: string, taskId: string, toColumnId: string, toIndex?: number): void {
    this.update((boards) => {
      const target = this.columnIn(boards, boardId, toColumnId);
      if (!target) return;
      const task = this.removeTask(boards, boardId, taskId);
      if (!task) return;
      target.tasks.splice(toIndex ?? target.tasks.length, 0, task);
    });
  }

  /** Restores the sample boards. */
  reset(): void {
    removeItem(STORAGE_KEY);
    this.state.set(sampleBoards());
  }

  // Helpers

  private update(change: (boards: Board[]) => void): void {
    const next = structuredClone(this.state());
    change(next);
    this.state.set(next);
    writeJson(STORAGE_KEY, next);
  }

  private assertColumnExists(boardId: string, columnId: string): void {
    if (!this.columnIn(this.state(), boardId, columnId)) {
      throw new BoardError('That status no longer exists. Pick another one.');
    }
  }

  private columnIn(boards: Board[], boardId: string, columnId: string) {
    return boards.find((b) => b.id === boardId)?.columns.find((c) => c.id === columnId);
  }

  private locate(boards: Board[], boardId: string, taskId: string): TaskLocation | undefined {
    for (const column of boards.find((b) => b.id === boardId)?.columns ?? []) {
      const task = column.tasks.find((t) => t.id === taskId);
      if (task) return { task, column };
    }
    return undefined;
  }

  /** Removes a task from whichever column holds it and returns it. */
  private removeTask(boards: Board[], boardId: string, taskId: string): Task | undefined {
    const found = this.locate(boards, boardId, taskId);
    if (!found) return undefined;
    found.column.tasks.splice(found.column.tasks.indexOf(found.task), 1);
    return found.task;
  }

  private cleanTask(draft: TaskDraft): Omit<Task, 'id'> {
    return {
      title: draft.title.trim(),
      description: draft.description.trim(),
      subtasks: draft.subtasks.map((s) => ({ title: s.title.trim(), isCompleted: s.isCompleted })),
      // undefined (not "") so clearing the date on edit removes it from the task.
      dueDate: draft.dueDate || undefined,
    };
  }
}
