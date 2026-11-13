import { Routes } from '@angular/router';
import { BoardDetail } from './board-detail/board-detail';
import { BoardsOverview } from './boards-overview/boards-overview';

/** Lazy-loaded routes for the boards feature (loaded from app.routes.ts). */
export default [
  { path: '', title: 'All Boards', component: BoardsOverview },
  { path: ':boardId', component: BoardDetail },
] satisfies Routes;
