import { ChangeDetectionStrategy, Component, OnInit, inject, input, output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { filter, take } from 'rxjs';
import { Column, Subtask, TaskDraft } from '../../../core/models/board.model';
import { todayIso } from '../../../core/utils/dates';
import {
  notBlank,
  notInPast,
  uniqueSubtasks,
  uniqueTitle,
} from '../../../core/validators/task.validators';
import { errorMessage } from '../../../core/validators/validation-messages';
import { Icon } from '../../../shared/icon/icon';

/** Maximum lengths for the task's text fields. */
const TASK_LIMITS = { title: 100, description: 500, subtask: 100 } as const;

type SubtaskGroup = FormGroup<{
  title: FormControl<string>;
  isCompleted: FormControl<boolean>;
}>;

/**
 * Shared task form used by AddTask and EditTask (reactive form built with FormBuilder).
 * It only collects and validates input: the parent gives it the starting values,
 * the statuses and the titles already used on the board, and gets the result
 * through (submitted). The parent saves it and, if that worked, calls markAsSaved().
 */
@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, Icon],
  templateUrl: './task-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskForm implements OnInit {
  private readonly fb = inject(FormBuilder).nonNullable;

  /** Values the form starts with (empty task, or the task being edited). */
  readonly initialValue = input.required<TaskDraft>();
  /** The board's columns: a task's status is the column it lives in. */
  readonly statuses = input.required<Column[]>();
  /** Titles of the board's other tasks; a new title can't repeat one. */
  readonly takenTitles = input<readonly string[]>([]);
  readonly submitLabel = input.required<string>();

  /** Emits the form value when a valid form is submitted (it isn't saved yet). */
  readonly submitted = output<TaskDraft>();

  protected readonly limits = TASK_LIMITS;
  protected readonly today = todayIso();

  protected readonly form = this.fb.group({
    title: [
      '',
      {
        validators: [Validators.required, notBlank, Validators.maxLength(TASK_LIMITS.title)],
        asyncValidators: uniqueTitle(() => this.takenTitles()),
      },
    ],
    description: ['', Validators.maxLength(TASK_LIMITS.description)],
    subtasks: this.fb.array<SubtaskGroup>([], uniqueSubtasks),
    columnId: ['', Validators.required],
    // Optional; "" means no due date. The task's saved date is always allowed.
    dueDate: ['', notInPast(() => this.initialValue().dueDate)],
  });

  protected get subtasks() {
    return this.form.controls.subtasks;
  }

  /** Inputs are ready in ngOnInit, so fill the form here. */
  ngOnInit(): void {
    const { title, description, subtasks, columnId, dueDate } = this.initialValue();
    subtasks.forEach((subtask) => this.subtasks.push(this.subtaskGroup(subtask)));
    this.form.patchValue({ title, description, columnId, dueDate });
  }

  /** True when the user changed something that hasn't been submitted yet. */
  isDirty(): boolean {
    return this.form.dirty;
  }

  /** Called by the parent once the task was saved, so the unsaved-changes guard doesn't ask. */
  markAsSaved(saved: TaskDraft): void {
    this.form.reset(saved);
  }

  /** The message for a control, once the user has typed in it or left it. */
  protected errorFor(control: AbstractControl): string | null {
    return control.invalid && (control.touched || control.dirty)
      ? errorMessage(control.errors)
      : null;
  }

  protected addSubtask(): void {
    this.subtasks.push(this.subtaskGroup());
    this.subtasks.markAsDirty(); // Adding/removing rows doesn't mark the form dirty by itself.
  }

  protected removeSubtask(index: number): void {
    this.subtasks.removeAt(index);
    this.subtasks.markAsDirty();
  }

  protected submit(): void {
    // The async title check may still be running: submit again once it has finished.
    if (this.form.pending) {
      this.form.statusChanges
        .pipe(
          filter((status) => status !== 'PENDING'),
          take(1),
        )
        .subscribe(() => this.submit());
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // Show every error message.
      return;
    }
    this.submitted.emit(this.form.getRawValue());
  }

  private subtaskGroup(subtask: Subtask = { title: '', isCompleted: false }): SubtaskGroup {
    return this.fb.group({
      title: [
        subtask.title,
        [Validators.required, notBlank, Validators.maxLength(TASK_LIMITS.subtask)],
      ],
      isCompleted: [subtask.isCompleted],
    });
  }
}
