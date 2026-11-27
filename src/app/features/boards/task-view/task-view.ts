import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BoardService } from '../../../core/services/board.service';
import { ToastService } from '../../../core/services/toast.service';
import { suggestMove } from '../../../core/utils/auto-move';
import { completedSubtasks, isTaskDone } from '../../../core/utils/tasks';
import { DueDate } from '../../../shared/due-date/due-date';
import { Menu } from '../../../shared/menu/menu';
import { Modal } from '../../../shared/modal/modal';

/** Task details modal: /boards/:boardId/tasks/:taskId */
@Component({
  selector: 'app-task-view',
  imports: [RouterLink, Menu, Modal, DueDate],
  templateUrl: './task-view.html',
  styleUrl: './task-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskView {
  private readonly boardService = inject(BoardService);
  private readonly toast = inject(ToastService);

  // Route params, bound as inputs (`boardId` is inherited from the parent route).
  readonly boardId = input.required<string>();
  readonly taskId = input.required<string>();

  protected readonly board = computed(() => this.boardService.getBoard(this.boardId()));
  protected readonly found = computed(() =>
    this.boardService.findTask(this.boardId(), this.taskId()),
  );

  protected readonly isTaskDone = isTaskDone;
  protected readonly completedCount = computed(() => {
    const found = this.found();
    return found ? completedSubtasks(found.task) : 0;
  });

  protected toggleSubtask(index: number): void {
    this.boardService.toggleSubtask(this.boardId(), this.taskId(), index);
    this.autoMove();
  }

  /**
   * After a subtask changes, move the task to the column that fits its progress
   * (see suggestMove). On a clear Todo/Doing/Done board it just moves, with Undo;
   * on a board we're unsure about, it asks first.
   */
  private autoMove(): void {
    const board = this.board();
    const found = this.found();
    if (!board || !found) return;

    const suggestion = suggestMove(board, found.column, found.task);
    if (!suggestion) return;

    const boardId = this.boardId();
    const taskId = this.taskId();
    const from = found.column;
    const fromIndex = from.tasks.indexOf(found.task);
    const to = suggestion.column;
    const move = () => this.boardService.moveTask(boardId, taskId, to.id);

    if (suggestion.confidence === 'sure') {
      move();
      this.toast.success(`Moved to ${to.name}`, {
        label: 'Undo',
        run: () => this.boardService.moveTask(boardId, taskId, from.id, fromIndex),
      });
    } else {
      this.toast.ask(`Move to ${to.name}?`, { label: 'Move', run: move });
    }
  }

  protected changeStatus(columnId: string): void {
    this.boardService.moveTask(this.boardId(), this.taskId(), columnId);
  }
}
