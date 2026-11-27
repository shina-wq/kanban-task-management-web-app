import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { ClickOutside } from '../directives/click-outside.directive';
import { Icon } from '../icon/icon';

/**
 * The "⋮" options button with a small dropdown.
 * Put links or buttons with class="menu-item" inside; any click in the menu closes it.
 *
 * <app-menu label="Board options">
 *   <a class="menu-item" routerLink="edit">Edit Board</a>
 * </app-menu>
 */
@Component({
  selector: 'app-menu',
  imports: [ClickOutside, Icon],
  template: `
    <div class="wrap" (appClickOutside)="open.set(false)">
      <button
        type="button"
        class="toggle"
        aria-haspopup="menu"
        [attr.aria-label]="label()"
        [attr.aria-expanded]="open()"
        (click)="open.update((isOpen) => !isOpen)"
      >
        <app-icon name="ellipsis" />
      </button>

      @if (open()) {
        <div class="menu" role="menu" (click)="open.set(false)">
          <ng-content />
        </div>
      }
    </div>
  `,
  styles: `
    .wrap {
      position: relative;
    }

    .toggle {
      display: grid;
      place-items: center;
      width: 2.25rem;
      height: 2.25rem;
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      transition:
        background-color var(--transition),
        color var(--transition);
    }

    .toggle:hover,
    .toggle[aria-expanded='true'] {
      background-color: var(--bg-hover);
      color: var(--text-primary);
    }

    .toggle app-icon {
      width: 0.25rem;
      height: 1rem;
    }

    .menu {
      position: absolute;
      top: calc(100% + 0.375rem);
      right: 0;
      z-index: 20;
      display: grid;
      gap: 0.125rem;
      width: 12rem;
      padding: 0.375rem;
      border: 1px solid var(--border-card);
      border-radius: var(--radius-md);
      background-color: var(--bg-surface);
      box-shadow: var(--shadow-popover);
      transform-origin: top right;
      animation: menu-in 120ms ease-out;
    }

    @keyframes menu-in {
      from {
        opacity: 0;
        transform: scale(0.96) translateY(-4px);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Menu {
  readonly label = input.required<string>();

  protected readonly open = signal(false);
}
