import { inject } from '@angular/core';
import { CanActivateFn, ResolveFn } from '@angular/router';
import { redirectToNotFound } from '../../core/routing/not-found';
import { BoardService } from '../../core/services/board.service';

// ------------------------------------------------------------------ Guards

/** Only open /boards/:boardId when the board exists; otherwise show Not Found. */
export const boardExistsGuard: CanActivateFn = (route) => {
  const boardId = route.paramMap.get('boardId') ?? '';
  return inject(BoardService).getBoard(boardId) ? true : redirectToNotFound();
};

/** Only open …/tasks/:taskId when the task exists on that board. */
export const taskExistsGuard: CanActivateFn = (route) => {
  const boardId = route.paramMap.get('boardId') ?? '';
  const taskId = route.paramMap.get('taskId') ?? '';
  return inject(BoardService).findTask(boardId, taskId) ? true : redirectToNotFound();
};

// --------------------------------------------------------- Title resolvers

/** Browser tab title for a board, e.g. "Roadmap | Kanban". */
export const boardTitle: ResolveFn<string> = (route) =>
  inject(BoardService).getBoard(route.paramMap.get('boardId') ?? '')?.name ?? 'Board';

/** Browser tab title for an open task. */
export const taskTitle: ResolveFn<string> = (route) =>
  inject(BoardService).findTask(
    route.paramMap.get('boardId') ?? '',
    route.paramMap.get('taskId') ?? '',
  )?.task.title ?? 'Task';
