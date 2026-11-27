import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Icon } from '../icon/icon';

/**
 * A routed modal built on the native <dialog> element (focus trap, Escape key
 * and top layer for free). Each modal is its own child route, so "closing"
 * means navigating to the parent route — the browser Back button works too.
 *
 * <app-modal labelledBy="title-id" [showClose]="true" [returnTo]="['/boards', id]">…</app-modal>
 */
@Component({
  selector: 'app-modal',
  imports: [Icon],
  template: `
    <dialog
      #dialog
      [attr.aria-labelledby]="labelledBy()"
      (cancel)="onCancel($event)"
      (click)="onDialogClick($event)"
    >
      <div class="panel">
        <ng-content />
        <!-- After the content on purpose: the dialog focuses its first field on open,
             not the X. It's positioned in the top-right corner with CSS. -->
        @if (showClose()) {
          <button type="button" class="close" aria-label="Close" (click)="close()">
            <app-icon name="cross" />
          </button>
        }
      </div>
    </dialog>
  `,
  styles: `
    dialog {
      width: min(30rem, calc(100vw - 2rem));
      max-height: calc(100dvh - 2rem);
      margin: auto;
      padding: 0;
      border: 1px solid var(--border-card);
      border-radius: var(--radius-lg);
      background-color: var(--bg-surface);
      color: var(--text-primary);
      box-shadow: var(--shadow-popover);
      animation: pop-in 150ms ease-out;
    }

    dialog::backdrop {
      background-color: rgb(10 10 12 / 45%);
    }

    .panel {
      position: relative;
      display: grid;
      gap: 1.5rem;
      padding: 1.5rem;
    }

    /* Top-right X, level with the heading. */
    .close {
      position: absolute;
      top: 1.25rem;
      right: 1.25rem;
      display: grid;
      place-items: center;
      width: 2rem;
      height: 2rem;
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      transition:
        background-color var(--transition),
        color var(--transition);
    }

    .close:hover,
    .close:focus-visible {
      background-color: var(--bg-hover);
      color: var(--text-primary);
    }

    .close app-icon {
      width: 0.75rem;
      height: 0.75rem;
    }

    @media (min-width: 768px) {
      .panel {
        padding: 2rem;
      }

      .close {
        top: 1.75rem;
        right: 1.75rem;
      }
    }

    @keyframes pop-in {
      from {
        opacity: 0;
        transform: scale(0.97);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Modal {
  private readonly router = inject(Router);
  /** The route of the page that uses this modal. */
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  /** Id of the element that names the dialog (for screen readers). */
  readonly labelledBy = input<string>();
  /** Show an X button in the top-right corner. */
  readonly showClose = input(false);
  /**
   * Where closing goes, as router commands. Default: the page behind the modal.
   * Edit Task uses it to go back to the task it was opened from.
   */
  readonly returnTo = input<readonly unknown[]>();

  constructor() {
    // The <dialog> exists only after the first render, so open it then.
    afterNextRender(() => this.dialog().nativeElement.showModal());
  }

  /**
   * Go to `returnTo` if given, otherwise back to the page behind the modal (e.g. from /boards/x/tasks/y to /boards/x):
   * the nearest parent route that shows a component. Componentless parents
   * (like 'tasks/:taskId', which only groups routes) are skipped.
   * We navigate by route, not "..", because a path like 'tasks/:taskId'
   * spans two URL segments.
   */
  close(): void {
    const returnTo = this.returnTo();
    if (returnTo) {
      this.router.navigate([...returnTo], { queryParamsHandling: 'preserve' });
      return;
    }

    let page = this.route.parent;
    while (page?.parent && !page.component) page = page.parent;

    this.router.navigate(['.'], { relativeTo: page, queryParamsHandling: 'preserve' });
  }

  protected onCancel(event: Event): void {
    event.preventDefault(); // Let the router close the dialog, not the browser.
    this.close();
  }

  /** A click on the <dialog> itself (not its panel) is a click on the backdrop. */
  protected onDialogClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.close();
  }
}
