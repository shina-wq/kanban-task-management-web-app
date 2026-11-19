import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BoardService } from '../../../core/services/board.service';
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

  // Route params, bound as inputs (`boardId` is inherited from the parent route).
  readonly boardId = input.required<string>();
  readonly taskId = input.required<string>();

  protected readonly board = computed(() => this.boardService.getBoard(this.boardId()));
  protected readonly found = computed(() =>
    this.boardService.findTask(this.boardId(), this.taskId()),
  );

  protected readonly completedCount = computed(
    () => this.found()?.task.subtasks.filter((subtask) => subtask.isCompleted).length ?? 0,
  );

  protected toggleSubtask(index: number): void {
    this.boardService.toggleSubtask(this.boardId(), this.taskId(), index);
  }

  protected changeStatus(columnId: string): void {
    this.boardService.moveTask(this.boardId(), this.taskId(), columnId);
  }
}
