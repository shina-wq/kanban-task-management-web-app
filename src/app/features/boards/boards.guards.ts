import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, filter, map, switchMap, take } from 'rxjs';
import { ToastService } from '../../core/services/toast.service';
import { selectBoard, selectLoaded, selectTask } from '../../core/store/boards/boards.selectors';

/** Waits until the boards are loaded, then reads `selector` once. */
function selectWhenLoaded<T>(selector: (state: object) => T): Observable<T> {
  const store = inject(Store);
  return store.select(selectLoaded).pipe(
    filter(Boolean),
    take(1),
    switchMap(() => store.select(selector)),
    take(1),
  );
}

/** Only open /boards/:boardId when the board exists; otherwise show Not Found. */
export const boardExistsGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const boardId = route.paramMap.get('boardId') ?? '';
  return selectWhenLoaded(selectBoard(boardId)).pipe(
    map((board) => (board ? true : router.parseUrl('/not-found'))),
  );
};

/** Only open …/tasks/:taskId when the task exists on that board. */
export const taskExistsGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const boardId = route.paramMap.get('boardId') ?? '';
  const taskId = route.paramMap.get('taskId') ?? '';
  return selectWhenLoaded(selectTask(boardId, taskId)).pipe(
    map((found) => (found ? true : router.parseUrl('/not-found'))),
  );
};

/**
 * Only open …/tasks/new when the board has a column to put the task in
 * (a task's status is its column). Otherwise go back to the board and say why.
 */
export const boardHasColumnsGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const toast = inject(ToastService);
  const boardId = route.paramMap.get('boardId') ?? '';
  return selectWhenLoaded(selectBoard(boardId)).pipe(
    map((board) => {
      if (board?.columns.length) return true;
      toast.error('Add a column to this board before adding tasks.');
      return router.createUrlTree(['/boards', boardId]);
    }),
  );
};
