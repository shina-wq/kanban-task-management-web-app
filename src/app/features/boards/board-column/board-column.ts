import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Column } from '../../../core/models/board.model';
import { columnColor } from '../column-color';
import { TaskCard } from '../task-card/task-card';

/** Where a dragged task was dropped. */
export interface TaskDrop {
  taskId: string;
  columnId: string;
  index: number;
}

@Component({
  selector: 'app-board-column',
  imports: [TaskCard, CdkDropList, CdkDrag, CdkDragPlaceholder],
  template: `
    <h2 class="header">
      <span class="dot" [style.background-color]="dotColor()"></span>
      <span class="name">{{ column().name }}</span>
      <span class="count">{{ column().tasks.length }}</span>
    </h2>

    <!--
      Each column is a drop list; cdkDropListGroup on the board connects them.
      Only draggable items go inside the list (the CDK moves its DOM nodes),
      so an empty column is drawn with a CSS class instead of an @empty block.
    -->
    <ul
      class="tasks"
      [class.is-empty]="column().tasks.length === 0"
      [attr.aria-label]="column().name + ' tasks'"
      cdkDropList
      [cdkDropListData]="column().id"
      [cdkDropListDisabled]="dragDisabled()"
      (cdkDropListDropped)="onDrop($event)"
    >
      @for (task of column().tasks; track task.id) {
        <li cdkDrag [cdkDragData]="task.id" [cdkDragStartDelay]="{ touch: 200, mouse: 0 }">
          <app-task-card [task]="task" />
          <div *cdkDragPlaceholder class="placeholder"></div>
        </li>
      }
    </ul>
  `,
  styles: `
    /* Each column is a soft "lane" that holds its cards. */
    :host {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      width: var(--column-width);
      flex-shrink: 0;
      padding: 0.75rem;
      border: 1px solid var(--border-card);
      border-radius: var(--radius-lg);
      background-color: var(--bg-lane);
    }

    .header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0.25rem 0;
      font-size: 0.75rem;
      font-weight: var(--font-bold);
      letter-spacing: 0.08rem;
      text-transform: uppercase;
    }

    .dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .count {
      min-width: 1.375rem;
      padding: 0 0.4375rem;
      border-radius: var(--radius-pill);
      background-color: var(--bg-hover);
      color: var(--text-secondary);
      font-size: 0.6875rem;
      line-height: 1.25rem;
      letter-spacing: 0;
      text-align: center;
    }

    .tasks {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
      flex: 1;
      min-height: 6rem;
    }

    /* Empty column: a dashed outline the size of a card (the whole column still accepts drops). */
    .tasks.is-empty::before {
      content: '';
      height: 6rem;
      border: 1.5px dashed var(--border-card);
      border-radius: var(--radius-md);
    }

    /* While a card hovers over an empty column, the drag placeholder shows instead. */
    .tasks.is-empty.cdk-drop-list-dragging::before {
      display: none;
    }

    .placeholder {
      min-height: 5.5rem;
      border: 1.5px dashed var(--color-purple);
      border-radius: var(--radius-md);
      background-color: var(--bg-secondary-button);
    }

    /* Other cards slide out of the way while dragging. */
    .cdk-drop-list-dragging .cdk-drag:not(.cdk-drag-placeholder) {
      transition: transform 200ms ease;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardColumn {
  readonly column = input.required<Column>();
  /** Position on the board, used to pick the status dot color. */
  readonly index = input(0);
  /** Turned off while searching, because positions in a filtered list aren't real positions. */
  readonly dragDisabled = input(false);

  readonly taskDropped = output<TaskDrop>();

  protected readonly dotColor = computed(() => columnColor(this.index()));

  protected onDrop(event: CdkDragDrop<string, string, string>): void {
    const sameSpot =
      event.previousContainer === event.container && event.previousIndex === event.currentIndex;
    if (sameSpot) return;

    this.taskDropped.emit({
      taskId: event.item.data,
      columnId: event.container.data,
      index: event.currentIndex,
    });
  }
}
