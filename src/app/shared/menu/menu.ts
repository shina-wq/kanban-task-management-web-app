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
      width: 1.5rem;
      height: 2.5rem;
      color: var(--text-secondary);
    }

    .toggle app-icon {
      width: 0.3125rem;
      height: 1.25rem;
    }

    .menu {
      position: absolute;
      top: calc(100% + 1rem);
      right: 0;
      z-index: 20;
      display: grid;
      gap: 1rem;
      width: 12rem;
      padding: 1rem;
      border-radius: var(--radius-md);
      background-color: var(--bg-app);
      box-shadow: 0 10px 20px rgb(54 78 126 / 25%);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Menu {
  readonly label = input.required<string>();

  protected readonly open = signal(false);
}
