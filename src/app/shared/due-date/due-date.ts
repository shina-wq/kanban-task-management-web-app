import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { todayIso } from '../../core/validators/task.validators';

type DueState = 'overdue' | 'today' | 'upcoming';

/**
 * A task's due date, e.g. "Due Mar 15", "Due today" or "Overdue · Mar 1".
 * The state is in the words too, not only the color, so it's clear to everyone.
 *
 * <app-due-date [date]="task.dueDate" />
 */
@Component({
  selector: 'app-due-date',
  template: ` <time class="due" [class]="state()" [attr.datetime]="date()">{{ label() }}</time> `,
  styles: `
    .due {
      display: inline-block;
      padding: 0.125rem 0.5rem;
      border-radius: var(--radius-pill);
      background-color: var(--bg-subtask);
      font-size: 0.75rem;
      font-weight: var(--font-bold);
      color: var(--text-secondary);
      white-space: nowrap;
    }

    .today {
      background-color: var(--bg-secondary-button);
      color: var(--color-purple);
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

  protected readonly state = computed<DueState>(() => {
    const today = todayIso();
    if (this.date() < today) return 'overdue';
    return this.date() === today ? 'today' : 'upcoming';
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
