import { ChangeDetectionStrategy, Component, computed, inject, input, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BoardService } from '../../../core/services/board.service';
import { ToastService } from '../../../core/services/toast.service';
import { Modal } from '../../../shared/modal/modal';

/**
 * Delete confirmation for a board (/boards/:boardId/delete)
 * or a task (/boards/:boardId/tasks/:taskId/delete).
 */
@Component({
  selector: 'app-delete-confirm',
  imports: [Modal],
  template: `
    <app-modal labelledBy="delete-title">
      <h2 id="delete-title" class="heading-l title">Delete this {{ isTask() ? 'task' : 'board' }}?</h2>

      <p class="body-l message">
        @if (isTask()) {
          Are you sure you want to delete the ‘{{ name() }}’ task and its subtasks? This action
          cannot be reversed.
        } @else {
          Are you sure you want to delete the ‘{{ name() }}’ board? This action will remove all
          columns and tasks and cannot be reversed.
        }
      </p>

      <div class="actions">
        <button type="button" class="btn btn-destructive" (click)="confirm()">Delete</button>
        <button type="button" class="btn btn-secondary" (click)="cancel()">Cancel</button>
      </div>
    </app-modal>
  `,
  styles: `
    .title {
      color: var(--color-red);
    }

    .message {
      color: var(--text-secondary);
    }

    .actions {
      display: grid;
      gap: 1rem;
    }

    @media (min-width: 768px) {
      .actions {
        grid-template-columns: 1fr 1fr;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteConfirm {
  private readonly boardService = inject(BoardService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly modal = viewChild.required(Modal);

  // Route params. `taskId` is only set on the task route.
  readonly boardId = input.required<string>();
  readonly taskId = input<string>();

  protected readonly isTask = computed(() => this.taskId() !== undefined);
  protected readonly name = computed(() =>
    this.isTask()
      ? this.boardService.findTask(this.boardId(), this.taskId()!)?.task.title
      : this.boardService.getBoard(this.boardId())?.name,
  );

  protected confirm(): void {
    const taskId = this.taskId();
    const name = this.name();

    if (taskId) {
      this.boardService.deleteTask(this.boardId(), taskId);
      this.toast.success('Task deleted');
      this.router.navigate(['/boards', this.boardId()], { queryParamsHandling: 'preserve' });
      return;
    }

    // After deleting a board, open the next one (or the overview if none are left).
    this.boardService.deleteBoard(this.boardId());
    this.toast.success(`“${name}” board deleted`);
    const next = this.boardService.boards()[0];
    this.router.navigate(next ? ['/boards', next.id] : ['/boards']);
  }

  protected cancel(): void {
    this.modal().close();
  }
}
