import { ValidationErrors } from '@angular/forms';

/**
 * Turns a control's errors into one short message for the user.
 * Short on purpose: messages sit inside the input, on the right (as in the design).
 */
export function errorMessage(errors: ValidationErrors | null | undefined): string | null {
  if (!errors) return null;
  if (errors['required'] || errors['blank']) return "Can't be empty";
  if (errors['maxlength']) return `Max ${errors['maxlength'].requiredLength} characters`;
  if (errors['duplicate']) return 'Already exists';
  if (errors['incompleteDate']) return 'Enter a full date';
  if (errors['pastDate']) return "Can't be in the past";
  return 'Invalid value';
}
