import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Task } from '../../../core/models/board.model';

@Component({
  selector: 'app-task-card',
  imports: [RouterLink],
  template: `
    <a class="card" [routerLink]="['tasks', task().id]" queryParamsHandling="preserve">
      <h3 class="heading-m title">{{ task().title }}</h3>

      @if (total()) {
        <div class="subtasks" [class.is-done]="allDone()">
          <svg class="check" viewBox="0 0 16 16" aria-hidden="true">
            <rect x="1.5" y="1.5" width="13" height="13" rx="3.5" />
            <path d="M5 8.25 7 10.25 11 6" />
          </svg>
          <span class="sr-only">{{ completed() }} of {{ total() }} subtasks done</span>
          <span class="body-m count" aria-hidden="true">{{ completed() }}/{{ total() }}</span>
          <span class="bar" aria-hidden="true">
            <span class="fill" [style.width.%]="(completed() / total()) * 100"></span>
          </span>
        </div>
      }
    </a>
  `,
  styles: `
    .card {
      display: grid;
      gap: 0.625rem;
      padding: 0.875rem 1rem;
      border: 1px solid var(--border);
      border-radius: 0.75rem;
      background-color: var(--bg-surface);
      box-shadow: 0 1px 2px rgb(54 78 126 / 6%);
      transition:
        transform var(--transition),
        box-shadow var(--transition),
        border-color var(--transition);
    }

    .card:hover {
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--color-purple) 40%, var(--border));
      box-shadow: 0 8px 20px -6px rgb(54 78 126 / 18%);
    }

    @media (prefers-reduced-motion: reduce) {
      .card,
      .card:hover {
        transform: none;
      }
    }

    .title {
      transition: color var(--transition);
    }

    .card:hover .title {
      color: var(--color-purple);
    }

    .subtasks {
      --progress: var(--color-purple);

      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
    }

    .subtasks.is-done {
      --progress: #3fbf7f;
    }

    .check {
      flex-shrink: 0;
      width: 0.875rem;
      height: 0.875rem;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.5;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .check path {
      display: none;
    }

    .is-done .check {
      color: var(--progress);
    }

    .is-done .check path {
      display: block;
    }

    .count {
      font-variant-numeric: tabular-nums;
      line-height: 1;
    }

    .is-done .count {
      color: var(--progress);
    }

    .bar {
      flex: 1;
      height: 4px;
      overflow: hidden;
      border-radius: var(--radius-pill);
      background-color: var(--border);
    }

    .fill {
      display: block;
      height: 100%;
      border-radius: inherit;
      background-color: var(--progress);
      transition: width var(--transition);
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

  protected readonly allDone = computed(() => this.total() > 0 && this.completed() === this.total());
}
