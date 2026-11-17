import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import { ThemeService } from './core/services/theme.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      // Route params, query params and data are passed to page components as inputs.
      withComponentInputBinding(),
      withRouterConfig({
        // Child routes (e.g. a task) can read their parent's params (e.g. :boardId).
        paramsInheritanceStrategy: 'always',
        // If a guard cancels a Back/Forward navigation, put the browser history back
        // exactly where it was (so the URL keeps matching the page on screen).
        canceledNavigationResolution: 'computed',
      }),
    ),
    // Create the theme service at startup so the saved theme applies on every page.
    provideAppInitializer(() => {
      inject(ThemeService);
    }),
  ],
};
