import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationSkipped,
  NavigationStart,
  Router,
} from '@angular/router';
import { filter, map } from 'rxjs';
import { ToastService } from '../services/toast.service';

/** A navigation has finished, one way or another. */
function isNavigationDone(event: Event): boolean {
  return (
    event instanceof NavigationEnd ||
    event instanceof NavigationCancel ||
    event instanceof NavigationError ||
    event instanceof NavigationSkipped
  );
}

/**
 * Turns the router's navigation events into UI feedback:
 *
 *   NavigationStart ──► loading = true (the loading bar shows)
 *   NavigationEnd / Cancel / Skipped / Error ──► loading = false
 *   Navigation error ──► an error toast with a Retry button (see `fail`)
 *
 * `fail()` is called by the router's navigation error handler (see app.config.ts).
 */
@Injectable({ providedIn: 'root' })
export class NavigationStatus {
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly loading = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationStart || isNavigationDone(event)),
      map((event) => event instanceof NavigationStart),
    ),
    { initialValue: false },
  );

  /** A page failed to load (e.g. offline while a lazy page downloads). */
  fail(url: string): void {
    this.toast.error('Couldn’t load that page. Check your connection and try again.', {
      label: 'Retry',
      // Programmatic navigation: try the same page again.
      run: () => this.router.navigateByUrl(url),
    });
  }
}
