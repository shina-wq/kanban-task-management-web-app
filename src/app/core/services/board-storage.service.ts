import { Injectable } from '@angular/core';
import { Observable, defer, of } from 'rxjs';
import seedData from '../data/seed-data.json';
import { Board } from '../models/board.model';
import { isoDate } from '../utils/dates';
import { readJson, removeItem, writeJson } from '../utils/storage';

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

/**
 * Where boards are kept: the browser's localStorage, with sample boards on first visit.
 * It works like an API client (it returns Observables), so effects use it the same way
 * they would use HttpClient, and a real backend could replace it later.
 */
@Injectable({ providedIn: 'root' })
export class BoardStorage {
  load(): Observable<Board[]> {
    return defer(() => of(readJson(STORAGE_KEY, sampleBoards())));
  }

  save(boards: Board[]): void {
    writeJson(STORAGE_KEY, boards);
  }

  /** Forgets saved boards, so the next load returns the samples. */
  clear(): void {
    removeItem(STORAGE_KEY);
  }
}
