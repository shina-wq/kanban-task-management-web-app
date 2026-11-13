import { Routes } from '@angular/router';
import { BoardDetail } from './board-detail/board-detail';
import { BoardForm } from './board-form/board-form';
import { BoardsOverview } from './boards-overview/boards-overview';
import { boardExistsGuard, boardTitle, taskExistsGuard, taskTitle } from './boards.guards';
import { DeleteConfirm } from './delete-confirm/delete-confirm';
import { TaskForm } from './task-form/task-form';
import { TaskView } from './task-view/task-view';

/**
 * Lazy-loaded routes for the boards feature (loaded from app.routes.ts).
 * Every modal is a child route, rendered in its parent page's <router-outlet>.
 */
export default [
  {
    // /boards
    path: '',
    component: BoardsOverview,
    title: 'All Boards',
    children: [{ path: 'new', component: BoardForm, title: 'Add New Board' }],
  },
  {
    // /boards/:boardId?search=…
    path: ':boardId',
    component: BoardDetail,
    title: boardTitle,
    canActivate: [boardExistsGuard],
    children: [
      { path: 'edit', component: BoardForm, title: 'Edit Board' },
      { path: 'delete', component: DeleteConfirm, title: 'Delete Board' },
      { path: 'tasks/new', component: TaskForm, title: 'Add New Task' },
      {
        path: 'tasks/:taskId',
        canActivate: [taskExistsGuard],
        children: [
          { path: '', component: TaskView, title: taskTitle },
          { path: 'edit', component: TaskForm, title: 'Edit Task' },
          { path: 'delete', component: DeleteConfirm, title: 'Delete Task' },
        ],
      },
    ],
  },
] satisfies Routes;
