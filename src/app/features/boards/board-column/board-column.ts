import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Column } from '../../../core/models/board.model';
import { columnColor } from '../column-color';
import { TaskCard } from '../task-card/task-card';

@Component({
  selector: 'app-board-column',
  imports: [TaskCard],
  template: `
    <h2 class="heading-s header">
      <span class="dot" [style.background-color]="dotColor()"></span>
      {{ column().name }} ({{ column().tasks.length }})
    </h2>

    <ul class="tasks">
      @for (task of column().tasks; track task.id) {
        <li><app-task-card [task]="task" /></li>
      } @empty {
        <li class="empty"><span class="sr-only">No tasks</span></li>
      }
    </ul>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      width: var(--column-width);
      flex-shrink: 0;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .dot {
      width: 0.9375rem;
      height: 0.9375rem;
      border-radius: 50%;
    }

    .tasks {
      display: grid;
      align-content: start;
      gap: 1.25rem;
      flex: 1;
    }

    .empty {
      min-height: 6rem;
      border: 2px dashed var(--border);
      border-radius: var(--radius-md);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardColumn {
  readonly column = input.required<Column>();
  /** Position on the board, used to pick the status dot color. */
  readonly index = input(0);

  protected readonly dotColor = computed(() => columnColor(this.index()));
}
