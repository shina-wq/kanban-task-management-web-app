import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  TitleStrategy,
  provideRouter,
  withComponentInputBinding,
  withNavigationErrorHandler,
  withPreloading,
  withRouterConfig,
} from '@angular/router';
import { routes } from './app.routes';
import { NavigationStatus } from './core/routing/navigation-status';
import { PageTitleStrategy } from './core/routing/page-title.strategy';
import { SelectivePreloadingStrategy } from './core/routing/selective-preloading.strategy';
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
      // Download lazy routes marked `data: { preload: true }` in the background.
      withPreloading(SelectivePreloadingStrategy),
      // A navigation failed (e.g. offline while a lazy page downloads): tell the user.
      withNavigationErrorHandler((error) => inject(NavigationStatus).fail(error.url)),
    ),
    { provide: TitleStrategy, useClass: PageTitleStrategy },
    // Create the theme service at startup so the saved theme applies on every page.
    provideAppInitializer(() => {
      inject(ThemeService);
    }),
  ],
};
