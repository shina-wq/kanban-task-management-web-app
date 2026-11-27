import { Signal, computed, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

// The deepest active route, updated after every navigation.
// Used by the header to show the page title and find the current board, and by the search box.
export function injectDeepestRoute(): Signal<ActivatedRouteSnapshot> {
  const router = inject(Router);

  return computed(() => {
    router.lastSuccessfulNavigation(); // Re-run whenever a navigation finishes.
    let route = router.routerState.snapshot.root;
    while (route.firstChild) route = route.firstChild;
    return route;
  });
}
