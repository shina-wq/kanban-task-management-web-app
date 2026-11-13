import { Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, withNavigationErrorHandler } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { NavigationStatus } from './navigation-status';

@Component({ template: '' })
class Page {}

describe('NavigationStatus', () => {
  let router: Router;
  let status: NavigationStatus;
  let toast: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(
          [
            { path: 'ok', component: Page },
            // Simulates a lazy page that can't be downloaded (e.g. offline).
            { path: 'broken', loadComponent: () => Promise.reject(new Error('offline')) },
          ],
          withNavigationErrorHandler((error) => inject(NavigationStatus).fail(error.url)),
        ),
      ],
    });
    router = TestBed.inject(Router);
    status = TestBed.inject(NavigationStatus);
    toast = TestBed.inject(ToastService);
  });

  it('is loading while a navigation runs, and not after it ends', async () => {
    const done = router.navigateByUrl('/ok');
    expect(status.loading()).toBe(true);
    await done;
    expect(status.loading()).toBe(false);
  });

  it('shows an error toast with Retry when a navigation fails, and stops loading', async () => {
    await router.navigateByUrl('/broken').catch(() => undefined);

    expect(status.loading()).toBe(false);
    expect(toast.current()).toMatchObject({ tone: 'error', action: { label: 'Retry' } });
  });

  it('Retry navigates to the page again', async () => {
    status.fail('/ok');
    toast.current()?.action?.run();
    await vi.waitFor(() => expect(router.url).toBe('/ok'));
  });
});
