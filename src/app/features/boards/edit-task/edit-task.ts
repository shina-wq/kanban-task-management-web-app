import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  untracked,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { HasUnsavedChanges } from '../../../core/guards/unsaved-changes.guard';
import { TaskDraft } from '../../../core/models/board.model';
import { BoardService, saveErrorMessage } from '../../../core/services/board.service';
import { ToastService } from '../../../core/services/toast.service';
import { Modal } from '../../../shared/modal/modal';
import { TaskForm } from '../task-form/task-form';

/** Edit Task (/boards/:boardId/tasks/:taskId/edit). taskExistsGuard makes sure the task exists. */
@Component({
  selector: 'app-edit-task',
  imports: [Modal, TaskForm],
  template: `
    <!-- Closing without saving goes back to the task it was opened from. -->
    <app-modal
      labelledBy="edit-task-title"
      [showClose]="true"
      [returnTo]="['/boards', boardId(), 'tasks', taskId()]"
    >
      <h2 id="edit-task-title" class="heading-l">Edit Task</h2>
      @if (initialValue(); as value) {
        <app-task-form
          [initialValue]="value"
          [statuses]="statuses()"
          [takenTitles]="takenTitles()"
          submitLabel="Save Changes"
          (submitted)="update($event)"
        />
      }
    </app-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditTask implements HasUnsavedChanges {
  private readonly boardService = inject(BoardService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly form = viewChild(TaskForm);

  // Route params.
  readonly boardId = input.required<string>();
  readonly taskId = input.required<string>();

  /** Other tasks' titles on this board, for the "unique title" rule. */
  protected readonly takenTitles = computed(() =>
    this.boardService.taskTitles(this.boardId(), this.taskId()),
  );

  protected readonly statuses = computed(
    () => this.boardService.getBoard(this.boardId())?.columns ?? [],
  );

  /**
   * The task's values when the form opened; its status is the column it's in.
   * Read untracked: if the task changes or is deleted elsewhere meanwhile, the form keeps
   * the user's input (and saving explains what happened) instead of disappearing.
   */
  protected readonly initialValue = computed<TaskDraft | undefined>(() => {
    const boardId = this.boardId();
    const taskId = this.taskId();
    const found = untracked(() => this.boardService.findTask(boardId, taskId));
    if (!found) return undefined;
    const { task, column } = found;
    return {
      title: task.title,
      description: task.description,
      subtasks: task.subtasks,
      columnId: column.id,
      dueDate: task.dueDate ?? '',
    };
  });

  /** Saves the task. On failure, explain why and keep the modal open with the user's input. */
  protected update(draft: TaskDraft): void {
    try {
      this.boardService.updateTask(this.boardId(), this.taskId(), draft);
    } catch (error) {
      this.toast.error(saveErrorMessage(error));
      return;
    }

    this.form()?.markAsSaved(draft);
    this.toast.success('Task updated');
    // replaceUrl: the browser's Back button shouldn't reopen the form that was just saved.
    this.router.navigate(['/boards', this.boardId()], {
      queryParamsHandling: 'preserve',
      replaceUrl: true,
    });
  }

  /** Used by the unsaved-changes guard. */
  hasUnsavedChanges(): boolean {
    return this.form()?.isDirty() ?? false;
  }
}
