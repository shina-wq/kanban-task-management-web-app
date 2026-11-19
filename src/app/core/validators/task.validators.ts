import { FormArray, ValidatorFn } from '@angular/forms';

/** Compare names the way a person would: ignore case and surrounding spaces. */
const normalize = (value: string): string => value.trim().toLowerCase();

/**
 * Fails with `{ blank: true }` when the value is only spaces.
 * (An empty value is left to Validators.required.)
 */
export const notBlank: ValidatorFn = (control) => {
  const value = control.value;
  return typeof value === 'string' && value.length > 0 && value.trim() === ''
    ? { blank: true }
    : null;
};

/**
 * Fails with `{ duplicate: true }` when the value matches one of `getTaken()`.
 * `getTaken` is a function so the list is read at validation time, not when the form is built.
 */
export function uniqueAmong(getTaken: () => readonly string[]): ValidatorFn {
  return (control) => {
    const value = normalize(control.value ?? '');
    if (!value) return null;
    return getTaken().some((taken) => normalize(taken) === value) ? { duplicate: true } : null;
  };
}

/**
 * For a FormArray of groups: fails with `{ duplicateItems: [indexes] }` when two rows have
 * the same `field` value. The first occurrence is fine; the indexes are the repeats.
 */
export function noDuplicateItems(field: string): ValidatorFn {
  return (control) => {
    if (!(control instanceof FormArray)) return null;

    const seen = new Set<string>();
    const duplicates: number[] = [];
    control.controls.forEach((row, index) => {
      const value = normalize(row.get(field)?.value ?? '');
      if (!value) return;
      if (seen.has(value)) duplicates.push(index);
      else seen.add(value);
    });
    return duplicates.length ? { duplicateItems: duplicates } : null;
  };
}

/**
 * For an ISO date ("2026-12-31"): fails with `{ pastDate: true }` when it's before today.
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
 * Fails with `{ incompleteDate: true }` while `isIncomplete()` is true.
 * A native date input that is only partly filled (e.g. "20-Dec-yyyy") reports its value
 * as "" — the same as no date — so the form can't tell from the value alone. The component
 * reads the input's `validity.badInput` and passes it in here.
 */
export function completeDate(isIncomplete: () => boolean): ValidatorFn {
  return () => (isIncomplete() ? { incompleteDate: true } : null);
}

/** Today's local date as an ISO string, e.g. "2026-11-19". */
export function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}
