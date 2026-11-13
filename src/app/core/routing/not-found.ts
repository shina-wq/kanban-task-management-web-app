import { inject } from '@angular/core';
import { RedirectCommand, Router } from '@angular/router';

/**
 * Show the Not Found page but keep the bad URL in the address bar,
 * so the user can see what they typed. Call from a guard or resolver.
 */
export function redirectToNotFound(): RedirectCommand {
  const router = inject(Router);
  return new RedirectCommand(router.parseUrl('/not-found'), { skipLocationChange: true });
}
