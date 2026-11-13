import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Task } from '../../../core/models/board.model';

@Component({
  selector: 'app-task-card',
  imports: [RouterLink],
  template: `
    <a class="card" [routerLink]="['tasks', task().id]">
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
      box-shadow: var(--shadow-card);
    }

    .title {
      transition: color var(--transition);
    }

    .card:hover .title {
      color: var(--color-purple);
    }

    .subtasks {
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
