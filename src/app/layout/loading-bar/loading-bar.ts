import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NavigationStatus } from '../../core/routing/navigation-status';

/**
 * Thin purple bar at the top of the page while a navigation is in progress
 * (e.g. a lazy-loaded page is downloading). It only appears after a short delay,
 * so instant navigations don't flash.
 */
@Component({
  selector: 'app-loading-bar',
  template: `<div class="bar" [class.active]="status.loading()"></div>`,
  host: {
    role: 'progressbar',
    'aria-label': 'Loading page',
    '[attr.aria-hidden]': '!status.loading()',
  },
  styles: `
    :host {
      position: fixed;
      inset: 0 0 auto;
      z-index: 100;
      height: 3px;
      overflow: hidden;
      pointer-events: none;
    }

    .bar {
      width: 40%;
      height: 100%;
      background-color: var(--color-purple);
      opacity: 0;
      transition: opacity 150ms ease;
    }

    .bar.active {
      opacity: 1;
      transition-delay: 150ms;
      animation: slide 1s ease-in-out infinite;
    }

    @keyframes slide {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(250%);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingBar {
  protected readonly status = inject(NavigationStatus);
}
