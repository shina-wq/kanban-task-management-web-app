import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { ThemeService } from './core/services/theme.service';
import { boardsFeature } from './core/store/boards/boards.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      // to pass route parameters and query parameters directly into component inputs
      withComponentInputBinding(),
      withRouterConfig({
        // some nested routes need parameters defined on their parent route, particularly boardId
        paramsInheritanceStrategy: 'always',
        // If a guard cancels a Back/Forward navigation, put browser history back where it was.
        canceledNavigationResolution: 'computed',
      }),
    ),
    // NgRx: the global store, with boards as its first feature.
    provideStore(),
    provideState(boardsFeature),
    // Redux DevTools browser extension: full time-travel in dev, read-only in production.
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    // Create the theme service at startup so the saved theme applies on every page.
    provideAppInitializer(() => {
      inject(ThemeService);
    }),
  ],
};
