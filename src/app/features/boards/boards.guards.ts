import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BoardService } from '../../core/services/board.service';

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
