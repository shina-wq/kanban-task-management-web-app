import { CanDeactivateFn } from '@angular/router';

/** A page with a form that can tell whether it has changes that weren't saved. */
export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean;
}

const UNSAVED_CHANGES_MESSAGE = 'You have unsaved changes. Leave without saving?';

/**
 * Asks before leaving a form with unsaved changes — whether the user closes the
 * modal, clicks a link, or presses the browser Back button.
 */
export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (component) =>
  !component.hasUnsavedChanges() || window.confirm(UNSAVED_CHANGES_MESSAGE);
