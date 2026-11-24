import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-theme-toggle',
  imports: [Icon],
  template: `
    <app-icon name="sun" />
    <button
      type="button"
      class="switch"
      role="switch"
      aria-label="Dark mode"
      [attr.aria-checked]="isDark()"
      (click)="theme.toggle()"
    >
      <span class="knob"></span>
    </button>
    <app-icon name="moon" />
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      height: 3rem;
      border-radius: var(--radius-sm);
      background-color: var(--bg-app);
      color: var(--text-secondary);
    }

    app-icon {
      width: 1.125rem;
      height: 1.125rem;
    }

    .switch {
      display: flex;
      align-items: center;
      width: 2.5rem;
      height: 1.25rem;
      padding: 0.1875rem;
      border-radius: 0.75rem;
      background-color: var(--color-purple);
      transition: background-color var(--transition);
    }

    .switch:hover {
      background-color: var(--color-purple-hover);
    }

    .knob {
      width: 0.875rem;
      height: 0.875rem;
      border-radius: 50%;
      background-color: var(--color-white);
      transition: transform var(--transition);
    }

    .switch[aria-checked='true'] .knob {
      transform: translateX(1.25rem);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggle {
  protected readonly theme = inject(ThemeService);
  protected readonly isDark = computed(() => this.theme.theme() === 'dark');
}
