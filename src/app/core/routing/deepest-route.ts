import { Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

// Finds the deepest active route and keeps it updated whenever navigation happens.
// Used by the header to display the correct page title and identify the currently selected board, list, or task.
export function injectDeepestRoute(): Signal<ActivatedRouteSnapshot> {
  const router = inject(Router);

  const deepest = (): ActivatedRouteSnapshot => {
    let route = router.routerState.snapshot.root;
    while (route.firstChild) route = route.firstChild;
    return route;
  };

  return toSignal(
    router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(deepest),
    ),
    { initialValue: deepest() },
  );
}
