import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BoardService } from '../../../core/services/board.service';
import { BoardCard } from '../board-card/board-card';

@Component({
  selector: 'app-boards-overview',
  imports: [RouterLink, RouterOutlet, BoardCard],
  template: `
    <ul class="grid">
      @for (board of boards(); track board.id) {
        <li><app-board-card [board]="board" /></li>
      }
      <li>
        <a class="new-board heading-l" routerLink="new">+ Create New Board</a>
      </li>
    </ul>

    <!-- The "new board" modal renders here. -->
    <router-outlet />
  `,
  styles: `
    :host {
      display: block;
      padding: 1.5rem 1rem;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
      gap: 1.5rem;
    }

    .new-board {
      display: grid;
      place-items: center;
      height: 100%;
      min-height: 10rem;
      border: 1.5px dashed var(--border-card);
      border-radius: var(--radius-md);
      background: var(--bg-new-column);
      color: var(--text-secondary);
      transition:
        color var(--transition),
        border-color var(--transition);
    }

    .new-board:hover {
      border-color: var(--color-purple);
      color: var(--color-purple);
    }

    @media (min-width: 768px) {
      :host {
        padding: 1.5rem;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardsOverview {
  protected readonly boards = inject(BoardService).boards;
}
