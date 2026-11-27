import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { BoardNav } from '../board-nav/board-nav';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

/**
 * Persistent sidebar (tablet and desktop): board links on top;
 * the theme toggle and the signed-in user's name at the bottom.
 */
@Component({
  selector: 'app-sidebar',
  imports: [BoardNav, ThemeToggle],
  template: `
    <nav aria-label="Boards">
      <app-board-nav />
    </nav>

    <div class="footer">
      <app-theme-toggle />

      @if (name(); as name) {
        <p class="user">
          <span class="avatar" aria-hidden="true">{{ name.charAt(0) }}</span>
          <span class="name">{{ name }}</span>
        </p>
      }
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1rem;
      padding: 1rem 0 1.25rem;
      overflow-y: auto;
      background-color: var(--bg-surface);
      border-right: 1px solid var(--border);
    }

    .footer {
      display: grid;
      gap: 0.75rem;
      margin: 0 0.75rem;
    }

    .user {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0 0.25rem;
      font-size: 0.8125rem;
      color: var(--text-secondary);
    }

    .avatar {
      display: grid;
      place-items: center;
      flex-shrink: 0;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      background-color: var(--bg-hover);
      font-size: 0.6875rem;
      font-weight: var(--font-bold);
      text-transform: uppercase;
      color: var(--text-primary);
    }

    .name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    @media (min-width: 1200px) {
      .footer {
        margin: 0 1rem;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  private readonly auth = inject(AuthService);

  protected readonly name = computed(() => this.auth.user()?.name ?? '');
}
