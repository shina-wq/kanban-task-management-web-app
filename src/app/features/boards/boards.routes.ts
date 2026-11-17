import { Routes } from '@angular/router';
import { unsavedChangesGuard } from '../../core/guards/unsaved-changes.guard';
import { BoardDetail } from './board-detail/board-detail';
import { BoardForm } from './board-form/board-form';
import { BoardsOverview } from './boards-overview/boards-overview';
import { boardExistsGuard, taskExistsGuard } from './boards.guards';
import { DeleteConfirm } from './delete-confirm/delete-confirm';
import { TaskForm } from './task-form/task-form';
import { TaskView } from './task-view/task-view';

/**
 * Lazy-loaded routes for the boards feature (loaded from app.routes.ts).
 * Every modal is a child route, rendered in its parent page's <router-outlet>.
 * Forms ask before closing with unsaved changes (unsavedChangesGuard).
 */
export default [
  {
    // /boards
    path: '',
    component: BoardsOverview,
    title: 'All Boards',
    children: [
      {
        path: 'new',
        component: BoardForm,
        title: 'Add New Board',
        canDeactivate: [unsavedChangesGuard],
      },
    ],
  },
  {
    // /boards/:boardId?search=…
    path: ':boardId',
    component: BoardDetail,
    title: 'Board',
    canActivate: [boardExistsGuard],
    children: [
      {
        path: 'edit',
        component: BoardForm,
        title: 'Edit Board',
        canDeactivate: [unsavedChangesGuard],
      },
      { path: 'delete', component: DeleteConfirm, title: 'Delete Board' },
      {
        path: 'tasks/new',
        component: TaskForm,
        title: 'Add New Task',
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: 'tasks/:taskId',
        canActivate: [taskExistsGuard],
        children: [
          { path: '', component: TaskView, title: 'Task' },
          {
            path: 'edit',
            component: TaskForm,
            title: 'Edit Task',
            canDeactivate: [unsavedChangesGuard],
          },
          { path: 'delete', component: DeleteConfirm, title: 'Delete Task' },
        ],
      },
    ],
  },
] satisfies Routes;
