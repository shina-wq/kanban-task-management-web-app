import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Board, BoardDraft, Task, TaskDraft, TaskLocation } from '../models/board.model';
import { BoardsActions } from '../store/boards/boards.actions';
import { selectBoards } from '../store/boards/boards.selectors';
import { findBoard, findColumn, findTask } from '../utils/boards';
import { createId, createSlug } from '../utils/id';

/** A change that can't be made, e.g. the task was deleted meanwhile. The message is for the user. */
export class BoardError extends Error {
  override readonly name = 'BoardError';
}

/** A message to show the user for an error thrown while saving. */
export function saveErrorMessage(error: unknown): string {
  return error instanceof BoardError ? error.message : 'Something went wrong. Please try again.';
}

/**
 * Facade over the NgRx boards store. Components read boards from here and call
 * methods; each method checks the request, then dispatches an action.
 * The store (reducer) changes the state; effects save it.
 */
@Injectable({ providedIn: 'root' })
export class BoardService {
  private readonly store = inject(Store);

  readonly boards = this.store.selectSignal(selectBoards);

  // Queries

  getBoard(boardId: string): Board | undefined {
    return findBoard(this.boards(), boardId);
  }

  findTask(boardId: string, taskId: string): TaskLocation | undefined {
    return findTask(this.boards(), boardId, taskId);
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
        this.boards().map((b) => b.id),
      ),
      name: draft.name.trim(),
      columns: draft.columns.map((c) => ({ id: createId(), name: c.name.trim(), tasks: [] })),
    };
    this.store.dispatch(BoardsActions.createBoard({ board }));
    return board;
  }

  updateBoard(boardId: string, draft: BoardDraft): void {
    this.store.dispatch(
      BoardsActions.updateBoard({
        boardId,
        name: draft.name.trim(),
        columns: draft.columns.map((c) => ({ id: c.id ?? createId(), name: c.name.trim() })),
      }),
    );
  }

  deleteBoard(boardId: string): void {
    this.store.dispatch(BoardsActions.deleteBoard({ boardId }));
  }

  // Tasks

  /** Adds a task to the chosen column. Throws a BoardError if that column no longer exists. */
  createTask(boardId: string, draft: TaskDraft): Task {
    this.assertColumnExists(boardId, draft.columnId);

    const task: Task = { id: createId(), ...this.cleanTask(draft) };
    this.store.dispatch(BoardsActions.createTask({ boardId, columnId: draft.columnId, task }));
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

    const task: Task = { id: taskId, ...this.cleanTask(draft) };
    this.store.dispatch(BoardsActions.updateTask({ boardId, columnId: draft.columnId, task }));
  }

  deleteTask(boardId: string, taskId: string): void {
    this.store.dispatch(BoardsActions.deleteTask({ boardId, taskId }));
  }

  toggleSubtask(boardId: string, taskId: string, subtaskIndex: number): void {
    this.store.dispatch(BoardsActions.toggleSubtask({ boardId, taskId, subtaskIndex }));
  }

  /** Moves a task to another column (status change) or position (drag and drop). */
  moveTask(boardId: string, taskId: string, toColumnId: string, toIndex?: number): void {
    this.store.dispatch(BoardsActions.moveTask({ boardId, taskId, toColumnId, toIndex }));
  }

  /** Restores the sample boards. */
  reset(): void {
    this.store.dispatch(BoardsActions.reset());
  }

  // Helpers

  private assertColumnExists(boardId: string, columnId: string): void {
    if (!findColumn(this.boards(), boardId, columnId)) {
      throw new BoardError('That status no longer exists. Pick another one.');
    }
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
