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
    <h2 class="heading-s header">
      <span class="dot" [style.background-color]="dotColor()"></span>
      {{ column().name }} ({{ column().tasks.length }})
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
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      flex: 1;
      min-height: 6rem;
    }

    /* Empty column: a dashed outline the size of a card (the whole column still accepts drops). */
    .tasks.is-empty::before {
      content: '';
      height: 6rem;
      border: 2px dashed var(--border);
      border-radius: 0.75rem;
    }

    /* While a card hovers over an empty column, the drag placeholder shows instead. */
    .tasks.is-empty.cdk-drop-list-dragging::before {
      display: none;
    }

    .placeholder {
      min-height: 4.5rem;
      border: 2px dashed var(--color-purple);
      border-radius: 0.75rem;
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
