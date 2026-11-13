import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HasUnsavedChanges, UNSAVED_CHANGES_MESSAGE, unsavedChangesGuard } from './unsaved-changes.guard';

describe('unsavedChangesGuard', () => {
  const run = (component: HasUnsavedChanges) =>
    TestBed.runInInjectionContext(() =>
      unsavedChangesGuard(
        component,
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot,
        {} as RouterStateSnapshot,
      ),
    );

  const form = (dirty: boolean): HasUnsavedChanges => ({ hasUnsavedChanges: () => dirty });

  afterEach(() => vi.restoreAllMocks());

  it('lets the user leave a form with no changes, without asking', () => {
    const confirm = vi.spyOn(window, 'confirm');
    expect(run(form(false))).toBe(true);
    expect(confirm).not.toHaveBeenCalled();
  });

  it('asks before leaving unsaved changes, and stays if the user cancels', () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    expect(run(form(true))).toBe(false);
    expect(confirm).toHaveBeenCalledWith(UNSAVED_CHANGES_MESSAGE);
  });

  it('leaves when the user confirms', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    expect(run(form(true))).toBe(true);
  });
});
