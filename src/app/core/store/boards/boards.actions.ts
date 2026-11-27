import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Board, Task } from '../../models/board.model';

/**
 * Everything that can happen to boards, as events: "[Boards] Create Task" and so on.
 * Actions carry finished data (ids already created), so the reducer stays pure.
 */
export const BoardsActions = createActionGroup({
  source: 'Boards',
  events: {
    // Loading (handled by effects)
    Load: emptyProps(),
    'Load Success': props<{ boards: Board[] }>(),
    'Load Failure': props<{ error: string }>(),
    Reset: emptyProps(),

    // Boards
    'Create Board': props<{ board: Board }>(),
    /** Columns missing from `columns` are removed with their tasks. */
    'Update Board': props<{
      boardId: string;
      name: string;
      columns: { id: string; name: string }[];
    }>(),
    'Delete Board': props<{ boardId: string }>(),

    // Tasks
    'Create Task': props<{ boardId: string; columnId: string; task: Task }>(),
    /** Saves the task's fields; a new `columnId` moves it to the end of that column. */
    'Update Task': props<{ boardId: string; columnId: string; task: Task }>(),
    'Delete Task': props<{ boardId: string; taskId: string }>(),
    'Toggle Subtask': props<{ boardId: string; taskId: string; subtaskIndex: number }>(),
    /** Moves a task to another column or position; no `toIndex` means the end. */
    'Move Task': props<{ boardId: string; taskId: string; toColumnId: string; toIndex?: number }>(),
  },
});
