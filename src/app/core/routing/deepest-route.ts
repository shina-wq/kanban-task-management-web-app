import { Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

/**
 * The deepest active route as a signal, updated after every completed navigation.
 * Layout components (header, sidebar) live outside the page's <router-outlet>, so they
 * use this to read the current page's params and title.
 *
 * Params from parent routes are inherited (see `paramsInheritanceStrategy` in app.config).
 */
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
