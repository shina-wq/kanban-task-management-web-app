import { Routes } from '@angular/router';
import { BoardDetail } from './board-detail/board-detail';
import { BoardsOverview } from './boards-overview/boards-overview';
import { boardExistsGuard, boardTitle, taskExistsGuard, taskTitle } from './boards.guards';
import { TaskView } from './task-view/task-view';

/** Lazy-loaded routes for the boards feature (loaded from app.routes.ts). */
export default [
  { path: '', title: 'All Boards', component: BoardsOverview },
  {
    // /boards/:boardId?search=…
    path: ':boardId',
    component: BoardDetail,
    title: boardTitle,
    canActivate: [boardExistsGuard],
    // Modals render in BoardDetail's <router-outlet>, on top of the board.
    children: [
      {
        path: 'tasks/:taskId',
        component: TaskView,
        title: taskTitle,
        canActivate: [taskExistsGuard],
      },
    ],
  },
] satisfies Routes;
