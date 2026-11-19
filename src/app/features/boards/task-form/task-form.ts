import { ChangeDetectionStrategy, Component, OnInit, inject, input, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Column, Subtask, TaskDraft } from '../../../core/models/board.model';
import { Icon } from '../../../shared/icon/icon';

/** Contains at least one non-space character. */
const NOT_BLANK = /\S/;

type SubtaskGroup = FormGroup<{
  title: FormControl<string>;
  isCompleted: FormControl<boolean>;
}>;

/**
 * Shared task form used by AddTask and EditTask (reactive form).
 * It only collects and validates input: the parent gives it the starting
 * values and the statuses, and gets the result through (submitted).
 *
 * <app-task-form [initialValue]="draft" [statuses]="columns" submitLabel="Create Task"
 *                (submitted)="save($event)" />
 */
@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, Icon],
  templateUrl: './task-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskForm implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);

  /** Values the form starts with (empty task, or the task being edited). */
  readonly initialValue = input.required<TaskDraft>();
  /** The board's columns: a task's status is the column it lives in. */
  readonly statuses = input.required<Column[]>();
  readonly submitLabel = input.required<string>();

  /** Emits the form value when a valid form is submitted. */
  readonly submitted = output<TaskDraft>();

  protected readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.pattern(NOT_BLANK)]],
    description: [''],
    subtasks: this.fb.array<SubtaskGroup>([]),
    columnId: ['', Validators.required],
  });

  protected get subtasks() {
    return this.form.controls.subtasks;
  }

  /** Inputs are ready in ngOnInit, so fill the form here. */
  ngOnInit(): void {
    const { title, description, subtasks, columnId } = this.initialValue();
    subtasks.forEach((subtask) => this.subtasks.push(this.subtaskGroup(subtask)));
    this.form.patchValue({ title, description, columnId });
  }

  /** True when the user changed something that hasn't been submitted yet. */
  isDirty(): boolean {
    return this.form.dirty;
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
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // Show every error message.
      return;
    }
    this.submitted.emit(this.form.getRawValue());
    this.form.markAsPristine(); // Saved: the unsaved-changes guard shouldn't ask anymore.
  }

  private subtaskGroup(subtask: Subtask = { title: '', isCompleted: false }): SubtaskGroup {
    return this.fb.group({
      title: [subtask.title, [Validators.required, Validators.pattern(NOT_BLANK)]],
      isCompleted: [subtask.isCompleted],
    });
  }
}
