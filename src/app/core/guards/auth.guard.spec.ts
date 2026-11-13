import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authGuard, guestGuard } from './auth.guard';

describe('auth guards', () => {
  let auth: AuthService;
  let router: Router;

  const route = {} as ActivatedRouteSnapshot;
  const state = (url: string) => ({ url }) as RouterStateSnapshot;
  const run = (guard: typeof authGuard, url = '/boards') =>
    TestBed.runInInjectionContext(() => guard(route, state(url)));

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    auth = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  describe('authGuard', () => {
    it('lets logged-in users in', () => {
      auth.login('Ada');
      expect(run(authGuard)).toBe(true);
    });

    it('sends logged-out users to /login and remembers where they were going', () => {
      const result = run(authGuard, '/boards/roadmap?search=launch') as UrlTree;
      expect(router.serializeUrl(result)).toBe(
        '/login?returnUrl=%2Fboards%2Froadmap%3Fsearch%3Dlaunch',
      );
    });
  });

  describe('guestGuard', () => {
    it('shows /login to logged-out users', () => {
      expect(run(guestGuard)).toBe(true);
    });

    it('sends logged-in users to their boards', () => {
      auth.login('Ada');
      expect(router.serializeUrl(run(guestGuard) as UrlTree)).toBe('/boards');
    });
  });
});
