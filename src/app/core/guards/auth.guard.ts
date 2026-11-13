import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Protects the app: logged-out users are sent to /login, and the page they
 * wanted is kept in ?returnUrl= so login can bring them back to it.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  if (inject(AuthService).isLoggedIn()) return true;

  return inject(Router).createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

/** The opposite: logged-in users have no reason to see /login, so send them to their boards. */
export const guestGuard: CanActivateFn = () => {
  if (!inject(AuthService).isLoggedIn()) return true;

  return inject(Router).createUrlTree(['/boards']);
};
