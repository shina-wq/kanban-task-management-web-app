import { AsyncValidatorFn, FormArray, ValidatorFn } from '@angular/forms';
import { todayIso } from '../utils/dates';

/** Compare titles the way a person would: ignore case and surrounding spaces. */
const normalize = (value: string): string => value.trim().toLowerCase();

/**
 * Sync. Fails with `{ blank: true }` when the value is only spaces.
 * (An empty value is left to Validators.required.)
 */
export const notBlank: ValidatorFn = (control) => {
  const value = control.value;
  return typeof value === 'string' && value.length > 0 && value.trim() === ''
    ? { blank: true }
    : null;
};

/**
 * Sync. For an ISO date ("2026-12-31"): fails with `{ pastDate: true }` when it's before today.
 * `getAllowed()` is a date that is always accepted — the task's saved date when editing,
 * so an overdue task can still be edited without changing its date.
 */
export function notInPast(getAllowed: () => string = () => ''): ValidatorFn {
  return (control) => {
    const value: string = control.value ?? '';
    if (!value || value === getAllowed()) return null;
    return value < todayIso() ? { pastDate: true } : null;
  };
}

/**
 * Sync. For the FormArray of subtasks: fails with `{ duplicateSubtasks: true }`
 * when two rows have the same title.
 */
export const uniqueSubtasks: ValidatorFn = (control) => {
  if (!(control instanceof FormArray)) return null;
  const titles = control.controls
    .map((row) => normalize(row.value.title ?? ''))
    .filter((title) => title !== '');
  return new Set(titles).size < titles.length ? { duplicateSubtasks: true } : null;
};

/**
 * Async. Fails with `{ duplicate: true }` when another task on the board already has this title.
 * Returns a Promise: in a real app this is where the server would be asked.
 * Async validators only run once the sync validators pass.
 */
export function uniqueTitle(getTaken: () => readonly string[]): AsyncValidatorFn {
  return async (control) => {
    const value = normalize(control.value ?? '');
    const taken = getTaken().some((title) => normalize(title) === value);
    return taken ? { duplicate: true } : null;
  };
}
