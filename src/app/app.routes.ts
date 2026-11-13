import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { unsavedChangesGuard } from './core/guards/unsaved-changes.guard';
import { Shell } from './layout/shell/shell';

export const routes: Routes = [
  {
    // Public page, outside the app layout.
    path: 'login',
    title: 'Log In',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login'),
  },
  {
    // Shared layout (header + sidebar) for every page inside the app.
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'boards' },
      {
        path: 'boards',
        // Most visits end up here, so download it in the background (SelectivePreloadingStrategy).
        data: { preload: true },
        loadChildren: () => import('./features/boards/boards.routes'),
      },
      {
        // Not preloaded: loads only when someone opens Settings.
        path: 'settings',
        title: 'Settings',
        canDeactivate: [unsavedChangesGuard],
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
