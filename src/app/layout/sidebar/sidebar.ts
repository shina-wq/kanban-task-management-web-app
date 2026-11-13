import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BoardNav } from '../board-nav/board-nav';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

/** Persistent sidebar (tablet and desktop): board links, then the theme toggle at the bottom. */
@Component({
  selector: 'app-sidebar',
  imports: [BoardNav, ThemeToggle],
  template: `
    <nav aria-label="Boards">
      <app-board-nav />
    </nav>

    <app-theme-toggle />
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
export class Sidebar {}
