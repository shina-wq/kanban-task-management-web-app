import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Task } from '../../../core/models/board.model';

@Component({
  selector: 'app-task-card',
  imports: [RouterLink],
  template: `
    <a class="card" [routerLink]="['tasks', task().id]" queryParamsHandling="preserve">
      <h3 class="heading-m title">{{ task().title }}</h3>
      <p class="body-m subtasks">{{ completed() }} of {{ task().subtasks.length }} subtasks</p>
    </a>
  `,
  styles: `
    .card {
      display: grid;
      gap: 0.5rem;
      padding: 1.4375rem 1rem;
      border-radius: var(--radius-md);
      background-color: var(--bg-surface);
      box-shadow: 0 1px 3px rgb(54 78 126 / 6%);
    }

    .title {
      font-weight: 600;
      transition: color var(--transition);
    }

    .card:hover .title {
      color: var(--color-purple);
    }

    .subtasks {
      font-weight: var(--font-medium);
      color: var(--text-secondary);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCard {
  readonly task = input.required<Task>();

  protected readonly completed = computed(
    () => this.task().subtasks.filter((subtask) => subtask.isCompleted).length,
  );
}
