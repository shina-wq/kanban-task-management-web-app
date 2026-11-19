import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { HasUnsavedChanges } from '../../../core/guards/unsaved-changes.guard';
import { TaskDraft } from '../../../core/models/board.model';
import { BoardService } from '../../../core/services/board.service';
import { ToastService } from '../../../core/services/toast.service';
import { Modal } from '../../../shared/modal/modal';
import { TaskForm } from '../task-form/task-form';

/** Edit Task (/boards/:boardId/tasks/:taskId/edit). taskExistsGuard makes sure the task exists. */
@Component({
  selector: 'app-edit-task',
  imports: [Modal, TaskForm],
  template: `
    <app-modal labelledBy="edit-task-title">
      <h2 id="edit-task-title" class="heading-l">Edit Task</h2>
      @if (initialValue(); as value) {
        <app-task-form
          [initialValue]="value"
          [statuses]="statuses()"
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

  protected readonly statuses = computed(
    () => this.boardService.getBoard(this.boardId())?.columns ?? [],
  );

  /** The task's current values; its status is the column it's in. */
  protected readonly initialValue = computed<TaskDraft | undefined>(() => {
    const found = this.boardService.findTask(this.boardId(), this.taskId());
    if (!found) return undefined;
    const { task, column } = found;
    return {
      title: task.title,
      description: task.description,
      subtasks: task.subtasks,
      columnId: column.id,
    };
  });

  protected update(draft: TaskDraft): void {
    this.boardService.updateTask(this.boardId(), this.taskId(), draft);
    this.toast.success('Task updated');
    this.router.navigate(['/boards', this.boardId()], { queryParamsHandling: 'preserve' });
  }

  /** Used by the unsaved-changes guard. */
  hasUnsavedChanges(): boolean {
    return this.form()?.isDirty() ?? false;
  }
}
