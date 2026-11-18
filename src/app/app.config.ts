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
      withComponentInputBinding(),
      withRouterConfig({
        paramsInheritanceStrategy: 'always',
        canceledNavigationResolution: 'computed',
      }),
    ),
    // Create the theme service at startup so the saved theme applies on every page.
    provideAppInitializer(() => {
      inject(ThemeService);
    }),
  ],
};
