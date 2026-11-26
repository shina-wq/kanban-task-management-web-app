import { ChangeDetectionStrategy, Component, OnInit, inject, input, output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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

const TASK_LIMITS = { title: 100, description: 500, subtask: 100 } as const;

type SubtaskGroup = FormGroup<{
  title: FormControl<string>;
  isCompleted: FormControl<boolean>;
}>;

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, Icon],
  templateUrl: './task-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskForm implements OnInit {
  private readonly fb = inject(FormBuilder).nonNullable;

  readonly initialValue = input.required<TaskDraft>();
  readonly statuses = input.required<Column[]>();
  readonly takenTitles = input<readonly string[]>([]);
  readonly submitLabel = input.required<string>();

  readonly submitted = output<TaskDraft>();

  protected readonly limits = TASK_LIMITS;
  protected readonly today = todayIso();

  protected readonly form = this.fb.group({
    title: [
      '',
      [
        Validators.required,
        notBlank,
        Validators.maxLength(TASK_LIMITS.title),
        uniqueTitle(() => this.takenTitles()),
      ],
    ],
    description: ['', Validators.maxLength(TASK_LIMITS.description)],
    subtasks: this.fb.array<SubtaskGroup>([], uniqueSubtasks),
    columnId: ['', Validators.required],
    dueDate: ['', notInPast(() => this.initialValue().dueDate)],
  });

  protected get subtasks() {
    return this.form.controls.subtasks;
  }

  ngOnInit(): void {
    const { title, description, subtasks, columnId, dueDate } = this.initialValue();
    subtasks.forEach((subtask) => this.subtasks.push(this.subtaskGroup(subtask)));
    this.form.patchValue({ title, description, columnId, dueDate });
  }

  isDirty(): boolean {
    return this.form.dirty;
  }

  markAsSaved(saved: TaskDraft): void {
    this.form.reset(saved);
  }

  protected errorFor(control: AbstractControl): string | null {
    return control.invalid && (control.touched || control.dirty)
      ? errorMessage(control.errors)
      : null;
  }

  protected addSubtask(): void {
    this.subtasks.push(this.subtaskGroup());
    // FormArray changes don't mark the form dirty.
    this.subtasks.markAsDirty();
  }

  protected removeSubtask(index: number): void {
    this.subtasks.removeAt(index);
    this.subtasks.markAsDirty();
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
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
