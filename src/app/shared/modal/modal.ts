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

/**
 * A routed modal built on the native <dialog> element (focus trap, Escape key
 * and top layer for free). Each modal is its own child route, so "closing"
 * means navigating to the parent route — the browser Back button works too.
 *
 * <app-modal labelledBy="title-id">…</app-modal>
 */
@Component({
  selector: 'app-modal',
  template: `
    <dialog
      #dialog
      [attr.aria-labelledby]="labelledBy()"
      (cancel)="onCancel($event)"
      (click)="onDialogClick($event)"
    >
      <div class="panel">
        <ng-content />
      </div>
    </dialog>
  `,
  styles: `
    dialog {
      width: min(30rem, calc(100vw - 2rem));
      max-height: calc(100dvh - 2rem);
      margin: auto;
      padding: 0;
      border: none;
      border-radius: var(--radius-md);
      background-color: var(--bg-surface);
      color: var(--text-primary);
      animation: pop-in 150ms ease-out;
    }

    dialog::backdrop {
      background-color: rgb(0 0 0 / 50%);
    }

    .panel {
      display: grid;
      gap: 1.5rem;
      padding: 1.5rem;
    }

    @media (min-width: 768px) {
      .panel {
        padding: 2rem;
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

  constructor() {
    // The <dialog> exists only after the first render, so open it then.
    afterNextRender(() => this.dialog().nativeElement.showModal());
  }

  /**
   * Go back to the parent route (e.g. from /boards/x/tasks/y to /boards/x).
   * Relative to the parent *route*, not "..", because a route path like
   * 'tasks/:taskId' spans two URL segments.
   */
  close(): void {
    this.router.navigate(['.'], {
      relativeTo: this.route.parent,
      queryParamsHandling: 'preserve',
    });
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
