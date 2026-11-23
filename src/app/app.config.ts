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
      // to pass route parameters and query parameters directly into component inputs instead of injecting ActivatedRoute
      withComponentInputBinding(),
      withRouterConfig({
        // some nested routes need parameters defined on their parent route, particularly boardId
        paramsInheritanceStrategy: 'always',
        // If a guard cancels a Back/Forward navigation, put browser history back where it was.
        canceledNavigationResolution: 'computed',
      }),
    ),
    // Create the theme service at startup so the saved theme applies on every page.
    provideAppInitializer(() => {
      inject(ThemeService);
    }),
  ],
};
