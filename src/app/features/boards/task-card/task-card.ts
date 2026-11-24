import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Task } from '../../../core/models/board.model';
import { DueDate } from '../../../shared/due-date/due-date';

@Component({
  selector: 'app-task-card',
  imports: [RouterLink, DueDate],
  template: `
    <a class="card" [routerLink]="['tasks', task().id]" queryParamsHandling="preserve">
      <h3 class="heading-m title">{{ task().title }}</h3>

      @if (total()) {
        <div class="progress">
          <p class="body-m subtasks">{{ completed() }} of {{ total() }} subtasks</p>
          <!-- Decorative: the text above already says how far along the task is. -->
          <div class="track" aria-hidden="true">
            <span class="fill" [class.done]="isDone()" [style.width.%]="percent()"></span>
          </div>
        </div>
      } @else {
        <p class="body-m subtasks">No subtasks</p>
      }

      @if (task().dueDate; as dueDate) {
        <div class="footer">
          <app-due-date [date]="dueDate" [completed]="isDone()" />
        </div>
      }
    </a>
  `,
  styles: `
    .card {
      display: grid;
      gap: 0.5rem;
      padding: 0.75rem 0.875rem;
      border: 1px solid var(--border-card);
      border-radius: var(--radius-sm);
      background-color: var(--bg-card);
      box-shadow: var(--shadow-card);
      transition:
        border-color var(--transition),
        box-shadow var(--transition);
    }

    .card:hover {
      border-color: rgb(99 95 199 / 40%);
      box-shadow: var(--shadow-card-hover);
    }

    .title {
      font-size: 0.8125rem;
      font-weight: 600;
      line-height: 1.25rem;
    }

    .progress {
      display: grid;
      gap: 0.3125rem;
    }

    .subtasks {
      font-weight: var(--font-medium);
      color: var(--text-secondary);
    }

    .track {
      height: 0.1875rem;
      overflow: hidden;
      border-radius: var(--radius-pill);
      background-color: var(--bg-track);
    }

    .fill {
      display: block;
      height: 100%;
      border-radius: inherit;
      background-color: var(--color-purple);
      transition: width 300ms ease;
    }

    .fill.done {
      background-color: var(--color-green);
    }

    .footer {
      display: flex;
      align-items: center;
      padding-top: 0.5rem;
      border-top: 1px solid var(--border-card);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCard {
  readonly task = input.required<Task>();

  protected readonly total = computed(() => this.task().subtasks.length);
  protected readonly completed = computed(
    () => this.task().subtasks.filter((subtask) => subtask.isCompleted).length,
  );
  protected readonly percent = computed(() =>
    this.total() ? (this.completed() / this.total()) * 100 : 0,
  );
  /** Finished when every subtask is done (a task without subtasks is never "done"). */
  protected readonly isDone = computed(() => this.total() > 0 && this.completed() === this.total());
}
