import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Board } from '../../../core/models/board.model';
import { Icon } from '../../../shared/icon/icon';
import { columnColor } from '../column-color';

/** A board summary on the "All Boards" page. */
@Component({
  selector: 'app-board-card',
  imports: [RouterLink, Icon],
  template: `
    <a class="card" [routerLink]="['/boards', board().id]">
      <div class="title">
        <app-icon name="board" />
        <h2 class="heading-l">{{ board().name }}</h2>
      </div>

      <p class="body-l stats">
        {{ board().columns.length }} columns · {{ taskCount() }} tasks
      </p>

      @if (board().columns.length) {
        <ul class="columns">
          @for (column of board().columns; track column.id; let i = $index) {
            <li class="body-m">
              <span class="dot" [style.background-color]="columnColor(i)"></span>
              {{ column.name }} {{ column.tasks.length }}
            </li>
          }
        </ul>
      }
    </a>
  `,
  styles: `
    .card {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      height: 100%;
      padding: 1.5rem;
      border-radius: var(--radius-md);
      background-color: var(--bg-surface);
      box-shadow: var(--shadow-card);
      transition: box-shadow var(--transition);
    }

    .card:hover {
      box-shadow: 0 0 0 2px var(--color-purple);
    }

    .title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: var(--color-purple);
    }

    .title h2 {
      color: var(--text-primary);
    }

    .stats {
      color: var(--text-secondary);
    }

    .columns {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem 1rem;
      margin-top: auto;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border);
      color: var(--text-secondary);
    }

    .columns li {
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }

    .dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardCard {
  readonly board = input.required<Board>();

  protected readonly columnColor = columnColor;

  protected readonly taskCount = computed(() =>
    this.board().columns.reduce((total, column) => total + column.tasks.length, 0),
  );
}
