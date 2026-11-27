import { createFeature, createReducer, on } from '@ngrx/store';
import { Board, Task } from '../../models/board.model';
import { findBoard, findColumn, findTask } from '../../utils/boards';
import { BoardsActions } from './boards.actions';

export interface BoardsState {
  boards: Board[];
  /** False until the first load finishes (successfully or not). */
  loaded: boolean;
  error: string | null;
}

const initialState: BoardsState = {
  boards: [],
  loaded: false,
  error: null,
};

/**
 * Returns a new state with `change` applied to a copy of the boards.
 * The current state is never touched, which keeps the reducer pure.
 */
function changeBoards(state: BoardsState, change: (boards: Board[]) => void): BoardsState {
  const boards = structuredClone(state.boards);
  change(boards);
  return { ...state, boards };
}

/** Removes a task from whichever column holds it and returns it. */
function removeTask(boards: Board[], boardId: string, taskId: string): Task | undefined {
  const found = findTask(boards, boardId, taskId);
  if (!found) return undefined;
  found.column.tasks.splice(found.column.tasks.indexOf(found.task), 1);
  return found.task;
}

/**
 * The boards feature: its reducer, plus `selectBoards`, `selectLoaded` and
 * `selectError` selectors that createFeature generates for each state property.
 */
export const boardsFeature = createFeature({
  name: 'boards',
  reducer: createReducer(
    initialState,

    on(BoardsActions.loadSuccess, (state, { boards }) => ({
      ...state,
      boards,
      loaded: true,
      error: null,
    })),
    on(BoardsActions.loadFailure, (state, { error }) => ({ ...state, loaded: true, error })),

    on(BoardsActions.createBoard, (state, { board }) =>
      changeBoards(state, (boards) => boards.push(board)),
    ),

    // Keeps tasks in columns that still exist; removed columns take their tasks with them.
    on(BoardsActions.updateBoard, (state, { boardId, name, columns }) =>
      changeBoards(state, (boards) => {
        const board = findBoard(boards, boardId);
        if (!board) return;
        board.name = name;
        board.columns = columns.map((c) => ({
          ...c,
          tasks: board.columns.find((existing) => existing.id === c.id)?.tasks ?? [],
        }));
      }),
    ),

    on(BoardsActions.deleteBoard, (state, { boardId }) => ({
      ...state,
      boards: state.boards.filter((board) => board.id !== boardId),
    })),

    on(BoardsActions.createTask, (state, { boardId, columnId, task }) =>
      changeBoards(state, (boards) => findColumn(boards, boardId, columnId)?.tasks.push(task)),
    ),

    on(BoardsActions.updateTask, (state, { boardId, columnId, task }) =>
      changeBoards(state, (boards) => {
        const found = findTask(boards, boardId, task.id);
        const target = findColumn(boards, boardId, columnId);
        if (!found || !target) return;

        if (found.column === target) {
          found.column.tasks[found.column.tasks.indexOf(found.task)] = task;
        } else {
          removeTask(boards, boardId, task.id);
          target.tasks.push(task);
        }
      }),
    ),

    on(BoardsActions.deleteTask, (state, { boardId, taskId }) =>
      changeBoards(state, (boards) => removeTask(boards, boardId, taskId)),
    ),

    on(BoardsActions.toggleSubtask, (state, { boardId, taskId, subtaskIndex }) =>
      changeBoards(state, (boards) => {
        const subtask = findTask(boards, boardId, taskId)?.task.subtasks[subtaskIndex];
        if (subtask) subtask.isCompleted = !subtask.isCompleted;
      }),
    ),

    on(BoardsActions.moveTask, (state, { boardId, taskId, toColumnId, toIndex }) =>
      changeBoards(state, (boards) => {
        const target = findColumn(boards, boardId, toColumnId);
        if (!target) return;
        const task = removeTask(boards, boardId, taskId);
        if (task) target.tasks.splice(toIndex ?? target.tasks.length, 0, task);
      }),
    ),
  ),
});
