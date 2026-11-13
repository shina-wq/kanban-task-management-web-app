import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';

export const routes: Routes = [
  {
    // Shared layout (header + sidebar) for every page inside the app.
    path: '',
    component: Shell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'boards' },
      {
        path: 'boards',
        loadChildren: () => import('./features/boards/boards.routes'),
      },
      {
        path: 'settings',
        title: 'Settings',
        loadComponent: () => import('./features/settings/settings'),
      },
      {
        path: '**',
        title: 'Page Not Found',
        loadComponent: () => import('./features/not-found/not-found'),
      },
    ],
  },
];
