import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  afterNextRender,
  computed,
  inject,
} from '@angular/core';
import { ToastService } from '../../core/services/toast.service';
import { Icon } from '../../shared/icon/icon';

/**
 * Opens a [popover] element as soon as it's rendered. Popovers go in the browser's
 * top layer, above an open modal <dialog>, so a toast is visible even while a form is open
 * (z-index alone can't put anything above a modal dialog).
 */
@Directive({ selector: '[appShowPopover]', host: { popover: 'manual' } })
export class ShowPopover {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterNextRender(() => this.element.nativeElement.showPopover());
  }
}

/** Shows the current toast from ToastService at the bottom of the screen. */
@Component({
  selector: 'app-toast',
  imports: [Icon, ShowPopover],
  template: `
    <!-- @for keyed by id: each new toast gets a fresh element, so it animates in again. -->
    @for (toast of toasts(); track toast.id) {
      <!-- Errors use role="alert" so screen readers announce them right away. -->
      <div
        appShowPopover
        class="toast"
        [class.toast-error]="toast.kind === 'error'"
        [attr.role]="toast.kind === 'error' ? 'alert' : 'status'"
      >
        <span class="badge" aria-hidden="true">
          <app-icon [name]="toast.kind === 'error' ? 'cross' : 'check'" />
        </span>

        <p class="heading-m message">{{ toast.message }}</p>

        <button type="button" class="close" aria-label="Dismiss" (click)="service.dismiss()">
          <app-icon name="cross" />
        </button>
      </div>
    }
  `,
  styleUrl: './toast.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastOutlet {
  protected readonly service = inject(ToastService);
  protected readonly toasts = computed(() => {
    const toast = this.service.current();
    return toast ? [toast] : [];
  });
}
