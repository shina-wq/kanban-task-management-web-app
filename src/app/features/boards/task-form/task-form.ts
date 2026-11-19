import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  inject,
  input,
  output,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Column, Subtask, TaskDraft } from '../../../core/models/board.model';
import {
  noDuplicateItems,
  notBlank,
  notInPast,
  todayIso,
  uniqueAmong,
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
 * Shared task form used by AddTask and EditTask (reactive form).
 * It only collects and validates input: the parent gives it the starting
 * values, the statuses and the titles already used on the board, and gets
 * the result through (submitted). The parent saves it and, if that worked,
 * calls markAsSaved(); if it failed, the form keeps the user's input.
 *
 * <app-task-form [initialValue]="draft" [statuses]="columns" [takenTitles]="titles"
 *                submitLabel="Create Task" (submitted)="save($event)" />
 */
@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, Icon],
  templateUrl: './task-form.html',
  // The unsaved-changes guard covers in-app navigation; this covers reload / closing the tab.
  host: { '(window:beforeunload)': 'warnBeforeUnload($event)' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskForm implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

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
      [
        Validators.required,
        notBlank,
        Validators.maxLength(TASK_LIMITS.title),
        uniqueAmong(() => this.takenTitles()),
      ],
    ],
    description: ['', Validators.maxLength(TASK_LIMITS.description)],
    subtasks: this.fb.array<SubtaskGroup>([], noDuplicateItems('title')),
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

  /**
   * The message to show under/inside a control, or null.
   * Shown once the user has typed in it (dirty) or left it (touched), and kept up to date
   * on every keystroke after that.
   */
  protected errorFor(control: AbstractControl): string | null {
    return control.invalid && (control.touched || control.dirty)
      ? errorMessage(control.errors)
      : null;
  }

  /** Subtask rows have their own errors, plus "Already exists" when they repeat an earlier row. */
  protected subtaskError(index: number): string | null {
    const title = this.subtasks.at(index).controls.title;
    const own = this.errorFor(title);
    if (own) return own;

    const repeats: number[] = this.subtasks.errors?.['duplicateItems'] ?? [];
    return repeats.includes(index) && (title.touched || title.dirty)
      ? errorMessage({ duplicate: true })
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

  /** Makes the browser ask "Leave site?" when the page is reloaded or closed with unsaved changes. */
  protected warnBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.form.dirty) event.preventDefault();
  }

  /**
   * Called by the parent once the task was saved: resets the form to the saved
   * values, so it's pristine and untouched again and the unsaved-changes guard
   * doesn't ask on the way out.
   */
  markAsSaved(saved: TaskDraft): void {
    this.form.reset(saved);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // Show every error message…
      this.focusFirstInvalid(); // …and take the user to the first one.
      return;
    }
    this.submitted.emit(this.form.getRawValue());
  }

  /** Field ids in the order they appear in the form. */
  private firstInvalidId(): string | null {
    const { title, description, subtasks, dueDate } = this.form.controls;
    if (title.invalid) return 'task-title';
    if (description.invalid) return 'task-description';

    const repeats: number[] = subtasks.errors?.['duplicateItems'] ?? [];
    const row = subtasks.controls.findIndex((group, i) => group.invalid || repeats.includes(i));
    if (row !== -1) return `subtask-${row}`;

    if (dueDate.invalid) return 'task-due-date';
    return null;
  }

  private focusFirstInvalid(): void {
    const id = this.firstInvalidId();
    if (id) this.host.nativeElement.querySelector<HTMLElement>(`#${id}`)?.focus();
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
