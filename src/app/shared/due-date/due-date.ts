import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { todayIso } from '../../core/utils/dates';
import { Icon } from '../icon/icon';

/** 'plain' is a future date, or any date of a completed task. */
type DueState = 'overdue' | 'today' | 'plain';

/**
 * A task's due date, e.g. "Due Mar 15", "Due today" or "Overdue · Mar 1".
 * The state is in the words too, not only the color, so it's clear to everyone.
 * A completed task is never overdue: it just shows its date.
 *
 * <app-due-date [date]="task.dueDate" [completed]="allSubtasksDone" />
 */
@Component({
  selector: 'app-due-date',
  imports: [Icon],
  template: `
    <time class="due" [class]="state()" [attr.datetime]="date()">
      <app-icon name="calendar" />
      {{ label() }}
    </time>
  `,
  styles: `
    .due {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.1875rem 0.5rem;
      border-radius: var(--radius-sm);
      background-color: var(--bg-subtask);
      font-size: 0.75rem;
      font-weight: var(--font-bold);
      line-height: 1.125rem;
      color: var(--text-secondary);
      white-space: nowrap;
    }

    app-icon {
      width: 0.75rem;
      height: 0.75rem;
    }

    .today {
      background-color: var(--bg-accent-soft);
      color: var(--text-accent);
    }

    .overdue {
      background-color: rgb(234 85 85 / 12%);
      color: var(--color-red);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DueDate {
  /** ISO date, e.g. "2026-12-31". */
  readonly date = input.required<string>();
  /** True when the task is finished (all its subtasks are done). */
  readonly completed = input(false);

  protected readonly state = computed<DueState>(() => {
    const today = todayIso();
    if (this.completed()) return 'plain';
    if (this.date() < today) return 'overdue';
    return this.date() === today ? 'today' : 'plain';
  });

  protected readonly label = computed(() => {
    switch (this.state()) {
      case 'today':
        return 'Due today';
      case 'overdue':
        return `Overdue · ${formatDate(this.date())}`;
      default:
        return `Due ${formatDate(this.date())}`;
    }
  });
}

/**
 * "2027-03-15" → "Mar 15, 2027" ("Mar 15" in the current year).
 * Built from the parts, not `new Date("2027-03-15")`, which is read as UTC midnight
 * and can show the day before in timezones west of UTC.
 */
function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: year === new Date().getFullYear() ? undefined : 'numeric',
  });
}
