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
      <div class="header">
        <span class="icon-tile"><app-icon name="board" /></span>
        <h2 class="heading-m name">{{ board().name }}</h2>
        <span class="open" aria-hidden="true">Open →</span>
      </div>

      @if (board().columns.length) {
        <div class="bar" aria-hidden="true">
          @if (taskCount()) {
            @for (column of board().columns; track column.id; let i = $index) {
              @if (column.tasks.length) {
                <span
                  [style.flex-grow]="column.tasks.length"
                  [style.background-color]="columnColor(i)"
                ></span>
              }
            }
          }
        </div>

        <ul class="columns">
          @for (column of board().columns; track column.id; let i = $index) {
            <li class="body-m">
              <span class="dot" [style.background-color]="columnColor(i)"></span>
              <span class="column-name">{{ column.name }}</span>
              <span class="count">{{ column.tasks.length }}</span>
            </li>
          }
        </ul>

        <p class="body-m footer">
          {{ taskCount() }} {{ taskCount() === 1 ? 'task' : 'tasks' }}
          @if (taskCount()) {
            · {{ donePercent() }}% done
          }
        </p>
      } @else {
        <p class="body-m empty">No columns yet. Open to add one.</p>
      }
    </a>
  `,
  styles: `
    .card {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      height: 100%;
      padding: 1.25rem;
      border: 1px solid var(--border);
      border-radius: 0.75rem;
      background-color: var(--bg-surface);
      box-shadow: 0 1px 2px rgb(54 78 126 / 6%);
      transition:
        transform var(--transition),
        box-shadow var(--transition),
        border-color var(--transition);
    }

    .card:hover {
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--color-purple) 40%, var(--border));
      box-shadow: 0 8px 20px -6px rgb(54 78 126 / 18%);
    }

    @media (prefers-reduced-motion: reduce) {
      .card,
      .card:hover {
        transform: none;
      }
    }

    .header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      min-width: 0;
    }

    .icon-tile {
      display: grid;
      flex-shrink: 0;
      place-items: center;
      width: 2.25rem;
      height: 2.25rem;
      border-radius: var(--radius-md);
      color: var(--color-purple);
      background-color: color-mix(in srgb, var(--color-purple) 12%, transparent);
    }

    .name {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--text-primary);
    }

    .open {
      flex-shrink: 0;
      font-size: 0.75rem;
      font-weight: var(--font-bold);
      color: var(--color-purple);
      opacity: 0;
      transform: translateX(-4px);
      transition:
        opacity var(--transition),
        transform var(--transition);
    }

    .card:hover .open,
    .card:focus-visible .open {
      opacity: 1;
      transform: none;
    }

    .bar {
      display: flex;
      gap: 2px;
      height: 6px;
      overflow: hidden;
      border-radius: var(--radius-pill);
      background-color: var(--border);
    }

    .bar span {
      flex-basis: 0;
    }

    .columns {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .columns li {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.125rem 0.25rem 0.125rem 0.5rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-pill);
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .dot {
      flex-shrink: 0;
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
    }

    .count {
      min-width: 1.25rem;
      padding: 0 0.375rem;
      border-radius: var(--radius-pill);
      font-weight: var(--font-bold);
      text-align: center;
      color: var(--text-primary);
      background-color: var(--bg-app);
    }

    .footer,
    .empty {
      margin-top: auto;
      color: var(--text-secondary);
    }

    .empty {
      padding: 0.75rem;
      border: 1px dashed var(--border);
      border-radius: var(--radius-md);
      text-align: center;
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

  /** Share of tasks sitting in the last column, treated as "done". */
  protected readonly donePercent = computed(() => {
    const columns = this.board().columns;
    const total = this.taskCount();
    if (!total) return 0;
    return Math.round((columns[columns.length - 1].tasks.length / total) * 100);
  });
}
