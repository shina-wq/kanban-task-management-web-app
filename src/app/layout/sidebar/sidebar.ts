import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { Icon } from '../../shared/icon/icon';
import { BoardNav } from '../board-nav/board-nav';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

@Component({
  selector: 'app-sidebar',
  imports: [BoardNav, ThemeToggle, Icon],
  template: `
    <nav aria-label="Boards">
      <app-board-nav />
    </nav>

    <div class="footer">
      <app-theme-toggle />
      <button type="button" class="nav-item" (click)="hide.emit()">
        <app-icon name="eye-slash" />
        Hide Sidebar
      </button>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1rem;
      padding: 1rem 0 2rem;
      overflow-y: auto;
      background-color: var(--bg-surface);
      border-right: 1px solid var(--border);
    }

    .footer {
      display: grid;
      gap: 0.5rem;
    }

    app-theme-toggle {
      margin: 0 0.75rem;
    }

    @media (min-width: 1200px) {
      app-theme-toggle {
        margin: 0 1.5rem;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  readonly hide = output<void>();
}
