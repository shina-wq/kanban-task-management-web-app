import { Routes } from '@angular/router';
import { unsavedChangesGuard } from '../../core/guards/unsaved-changes.guard';
import { AddTask } from './add-task/add-task';
import { BoardDetail } from './board-detail/board-detail';
import { BoardForm } from './board-form/board-form';
import { BoardsOverview } from './boards-overview/boards-overview';
import { boardExistsGuard, boardHasColumnsGuard, taskExistsGuard } from './boards.guards';
import { DeleteConfirm } from './delete-confirm/delete-confirm';
import { EditTask } from './edit-task/edit-task';
import { TaskView } from './task-view/task-view';

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
        component: AddTask,
        title: 'Add New Task',
        canActivate: [boardHasColumnsGuard],
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: 'tasks/:taskId',
        canActivate: [taskExistsGuard],
        children: [
          { path: '', component: TaskView, title: 'Task' },
          {
            path: 'edit',
            component: EditTask,
            title: 'Edit Task',
            canDeactivate: [unsavedChangesGuard],
          },
          { path: 'delete', component: DeleteConfirm, title: 'Delete Task' },
        ],
      },
    ],
  },
] satisfies Routes;
