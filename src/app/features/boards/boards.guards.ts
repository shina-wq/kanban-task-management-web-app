import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BoardService } from '../../core/services/board.service';
import { ToastService } from '../../core/services/toast.service';

/** Only open /boards/:boardId when the board exists; otherwise show Not Found. */
export const boardExistsGuard: CanActivateFn = (route) => {
  const boardId = route.paramMap.get('boardId') ?? '';
  return inject(BoardService).getBoard(boardId) ? true : inject(Router).parseUrl('/not-found');
};

/** Only open …/tasks/:taskId when the task exists on that board. */
export const taskExistsGuard: CanActivateFn = (route) => {
  const boardId = route.paramMap.get('boardId') ?? '';
  const taskId = route.paramMap.get('taskId') ?? '';
  return inject(BoardService).findTask(boardId, taskId)
    ? true
    : inject(Router).parseUrl('/not-found');
};

/**
 * Only open …/tasks/new when the board has a column to put the task in
 * (a task's status is its column). Otherwise go back to the board and say why.
 */
export const boardHasColumnsGuard: CanActivateFn = (route) => {
  const boardId = route.paramMap.get('boardId') ?? '';
  if (inject(BoardService).getBoard(boardId)?.columns.length) return true;

  inject(ToastService).error('Add a column to this board before adding tasks.');
  return inject(Router).createUrlTree(['/boards', boardId]);
};
