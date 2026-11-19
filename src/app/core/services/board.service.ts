import { Injectable, signal } from '@angular/core';
import seedData from '../data/seed-data.json';
import { Board, BoardDraft, Task, TaskDraft, TaskLocation } from '../models/board.model';
import { createId, createSlug } from '../utils/id';
import { readJson, removeItem, writeJson } from '../utils/storage';

const STORAGE_KEY = 'kanban.boards';
const SEED_BOARDS: Board[] = seedData.boards;

// Single source of truth for boards, columns and tasks.
@Injectable({ providedIn: 'root' })
export class BoardService {
  private readonly state = signal<Board[]>(readJson(STORAGE_KEY, structuredClone(SEED_BOARDS)));

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

  createTask(boardId: string, draft: TaskDraft): Task {
    const task: Task = { id: createId(), ...this.cleanTask(draft) };
    this.update((boards) => {
      const column = this.columnIn(boards, boardId, draft.columnId);
      column?.tasks.push(task);
    });
    return task;
  }

  /** Saves the task's fields and moves it if its status (column) changed. */
  updateTask(boardId: string, taskId: string, draft: TaskDraft): void {
    this.update((boards) => {
      const task = this.removeTask(boards, boardId, taskId);
      if (!task) return;
      Object.assign(task, this.cleanTask(draft));
      this.columnIn(boards, boardId, draft.columnId)?.tasks.push(task);
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
    this.state.set(structuredClone(SEED_BOARDS));
  }

  // Helpers

  private update(change: (boards: Board[]) => void): void {
    const next = structuredClone(this.state());
    change(next);
    this.state.set(next);
    writeJson(STORAGE_KEY, next);
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
