import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';
import { Icon } from '../../shared/icon/icon';

/** Shows the current toast from ToastService at the bottom of the screen. */
@Component({
  selector: 'app-toast',
  imports: [Icon],
  template: `
    <!-- @for keyed by id: each new toast gets a fresh element, so it animates in again. -->
    @for (toast of toasts(); track toast.id) {
      <div class="toast" role="status">
        <span class="badge" aria-hidden="true">
          <app-icon name="check" />
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
