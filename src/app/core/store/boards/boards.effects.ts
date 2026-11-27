import { inject } from '@angular/core';
import { Actions, ROOT_EFFECTS_INIT, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, tap, withLatestFrom } from 'rxjs';
import { BoardStorage } from '../../services/board-storage.service';
import { BoardsActions } from './boards.actions';
import { selectBoards } from './boards.selectors';

/**
 * Side effects: work outside the store (reading and writing storage).
 * Each effect listens for actions and, when it has a result, dispatches a new action.
 */

/** Loads the boards as soon as the app starts. */
export const init = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => BoardsActions.load()),
    ),
  { functional: true },
);

/** Load → read storage → Load Success (or Load Failure). */
export const load = createEffect(
  (actions$ = inject(Actions), storage = inject(BoardStorage)) =>
    actions$.pipe(
      ofType(BoardsActions.load),
      exhaustMap(() =>
        storage.load().pipe(
          map((boards) => BoardsActions.loadSuccess({ boards })),
          catchError(() => of(BoardsActions.loadFailure({ error: 'Could not load your boards.' }))),
        ),
      ),
    ),
  { functional: true },
);

/** After every change to boards, save the new state. Dispatches nothing. */
export const save = createEffect(
  (actions$ = inject(Actions), store = inject(Store), storage = inject(BoardStorage)) =>
    actions$.pipe(
      ofType(
        BoardsActions.createBoard,
        BoardsActions.updateBoard,
        BoardsActions.deleteBoard,
        BoardsActions.createTask,
        BoardsActions.updateTask,
        BoardsActions.deleteTask,
        BoardsActions.toggleSubtask,
        BoardsActions.moveTask,
      ),
      withLatestFrom(store.select(selectBoards)),
      tap(([, boards]) => storage.save(boards)),
    ),
  { functional: true, dispatch: false },
);

/** Reset → forget saved boards → Load (which now returns the samples). */
export const reset = createEffect(
  (actions$ = inject(Actions), storage = inject(BoardStorage)) =>
    actions$.pipe(
      ofType(BoardsActions.reset),
      tap(() => storage.clear()),
      map(() => BoardsActions.load()),
    ),
  { functional: true },
);
