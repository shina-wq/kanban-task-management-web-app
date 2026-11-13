import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

/**
 * Preloads only the lazy routes marked with `data: { preload: true }`.
 *
 * - PreloadAllModules downloads every lazy page up front (wasteful).
 * - NoPreloading waits until the user clicks (slower first visit).
 * - This strategy picks: likely pages download in the background right
 *   after the app starts; rarely used pages still load on demand.
 */
@Injectable({ providedIn: 'root' })
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    return route.data?.['preload'] ? load() : of(null);
  }
}
