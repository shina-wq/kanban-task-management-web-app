import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HasUnsavedChanges } from '../../../core/guards/unsaved-changes.guard';
import { TaskDraft } from '../../../core/models/board.model';
import { BoardService } from '../../../core/services/board.service';
import { createId } from '../../../core/utils/id';
import { Icon } from '../../../shared/icon/icon';
import { Modal } from '../../../shared/modal/modal';

/** One editable subtask row. `key` is only for @for tracking. */
interface SubtaskRow {
  key: string;
  title: string;
  isCompleted: boolean;
}

/**
 * Add New Task (/boards/:boardId/tasks/new) and
 * Edit Task (/boards/:boardId/tasks/:taskId/edit).
 */
@Component({
  selector: 'app-task-form',
  imports: [FormsModule, Modal, Icon],
  templateUrl: './task-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskForm implements OnInit, HasUnsavedChanges {
  private readonly boardService = inject(BoardService);
  private readonly router = inject(Router);
  private readonly form = viewChild.required(NgForm);

  // Route params. `taskId` is undefined when adding a new task.
  readonly boardId = input.required<string>();
  readonly taskId = input<string>();

  protected readonly isEdit = computed(() => this.taskId() !== undefined);
  protected readonly statuses = computed(
    () => this.boardService.getBoard(this.boardId())?.columns ?? [],
  );

  // Form model
  protected title = '';
  protected description = '';
  protected subtasks: SubtaskRow[] = [];
  protected columnId = '';

  private rowsChanged = false;
  private saved = false;

  /** Inputs (route params) are ready in ngOnInit, so fill the form here. */
  ngOnInit(): void {
    const found = this.boardService.findTask(this.boardId(), this.taskId() ?? '');
    if (found) {
      this.title = found.task.title;
      this.description = found.task.description;
      this.subtasks = found.task.subtasks.map((s) => ({ key: createId(), ...s }));
      this.columnId = found.column.id;
    } else {
      this.subtasks = [newRow(), newRow()];
      this.columnId = this.statuses()[0]?.id ?? '';
    }
  }

  protected addSubtask(): void {
    this.subtasks.push(newRow());
    this.rowsChanged = true;
  }

  protected removeSubtask(index: number): void {
    this.subtasks.splice(index, 1);
    this.rowsChanged = true;
  }

  protected save(): void {
    const form = this.form();
    if (form.invalid) {
      form.control.markAllAsTouched(); // Show every "Can't be empty" message.
      return;
    }

    const draft: TaskDraft = {
      title: this.title,
      description: this.description,
      subtasks: this.subtasks.map(({ title, isCompleted }) => ({ title, isCompleted })),
      columnId: this.columnId,
    };
    this.saved = true;

    const taskId = this.taskId();
    if (taskId) {
      this.boardService.updateTask(this.boardId(), taskId, draft);
    } else {
      this.boardService.createTask(this.boardId(), draft);
    }

    // Programmatic navigation back to the board, keeping any ?search= term.
    this.router.navigate(['/boards', this.boardId()], { queryParamsHandling: 'preserve' });
  }

  /** Used by the unsaved-changes guard. */
  hasUnsavedChanges(): boolean {
    return !this.saved && (this.form().dirty || this.rowsChanged);
  }
}

function newRow(): SubtaskRow {
  return { key: createId(), title: '', isCompleted: false };
}
