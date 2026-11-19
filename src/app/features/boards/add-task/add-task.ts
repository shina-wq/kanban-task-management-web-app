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
import { BoardService, saveErrorMessage } from '../../../core/services/board.service';
import { ToastService } from '../../../core/services/toast.service';
import { Modal } from '../../../shared/modal/modal';
import { TaskForm } from '../task-form/task-form';

/** Add New Task (/boards/:boardId/tasks/new). */
@Component({
  selector: 'app-add-task',
  imports: [Modal, TaskForm],
  template: `
    <app-modal labelledBy="add-task-title" [showClose]="true">
      <h2 id="add-task-title" class="heading-l">Add New Task</h2>
      <app-task-form
        [initialValue]="initialValue()"
        [statuses]="statuses()"
        [takenTitles]="takenTitles()"
        submitLabel="Create Task"
        (submitted)="create($event)"
      />
    </app-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTask implements HasUnsavedChanges {
  private readonly boardService = inject(BoardService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly form = viewChild.required(TaskForm);

  /** Route param. */
  readonly boardId = input.required<string>();

  /** Other tasks' titles on this board, for the "unique title" rule. */
  protected readonly takenTitles = computed(() => this.boardService.taskTitles(this.boardId()));

  protected readonly statuses = computed(
    () => this.boardService.getBoard(this.boardId())?.columns ?? [],
  );

  /** A new task starts with two empty subtasks in the first column. */
  protected readonly initialValue = computed<TaskDraft>(() => ({
    title: '',
    description: '',
    subtasks: [
      { title: '', isCompleted: false },
      { title: '', isCompleted: false },
    ],
    columnId: this.statuses()[0]?.id ?? '',
    dueDate: '',
  }));

  /** Saves the task. On failure, explain why and keep the modal open with the user's input. */
  protected create(draft: TaskDraft): void {
    try {
      this.boardService.createTask(this.boardId(), draft);
    } catch (error) {
      this.toast.error(saveErrorMessage(error));
      return;
    }

    this.form()?.markAsSaved(draft);
    this.toast.success('Task created');
    // replaceUrl: the browser's Back button shouldn't reopen the form that was just saved.
    this.router.navigate(['/boards', this.boardId()], {
      queryParamsHandling: 'preserve',
      replaceUrl: true,
    });
  }

  /** Used by the unsaved-changes guard. */
  hasUnsavedChanges(): boolean {
    return this.form().isDirty();
  }
}
