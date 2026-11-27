import { FormArray, ValidatorFn } from '@angular/forms';
import { todayIso } from '../utils/dates';

const normalize = (value: string): string => value.trim().toLowerCase();

export const notBlank: ValidatorFn = (control) => {
  const value = control.value;
  return typeof value === 'string' && value.length > 0 && value.trim() === ''
    ? { blank: true }
    : null;
};

// Allows the saved date during edits, even if it is now overdue.
export function notInPast(getAllowed: () => string = () => ''): ValidatorFn {
  return (control) => {
    const value: string = control.value ?? '';
    if (!value || value === getAllowed()) return null;
    return value < todayIso() ? { pastDate: true } : null;
  };
}

export const uniqueSubtasks: ValidatorFn = (control) => {
  if (!(control instanceof FormArray)) return null;
  const titles = control.controls
    .map((row) => normalize(row.value.title ?? ''))
    .filter((title) => title !== '');
  return new Set(titles).size < titles.length ? { duplicateSubtasks: true } : null;
};

export function uniqueTitle(getTaken: () => readonly string[]): ValidatorFn {
  return (control) => {
    const value = normalize(control.value ?? '');
    if (!value) return null;
    return getTaken().some((title) => normalize(title) === value) ? { duplicate: true } : null;
  };
}
