import { ChangeDetectionStrategy, Component, OnInit, inject, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HasUnsavedChanges } from '../../core/guards/unsaved-changes.guard';
import { AuthService } from '../../core/services/auth.service';
import { BoardService } from '../../core/services/board.service';
import { ToastService } from '../../core/services/toast.service';
import { ThemeToggle } from '../../layout/theme-toggle/theme-toggle';

/** /settings — profile name (guarded against unsaved changes), theme, data and logout. */
@Component({
  selector: 'app-settings',
  imports: [FormsModule, ThemeToggle],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Settings implements OnInit, HasUnsavedChanges {
  private readonly auth = inject(AuthService);
  private readonly boardService = inject(BoardService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly form = viewChild.required(NgForm);

  protected name = '';

  ngOnInit(): void {
    this.name = this.auth.user()?.name ?? '';
  }

  protected saveProfile(): void {
    const form = this.form();
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.auth.updateName(this.name);
    form.control.markAsPristine(); // Saved, so nothing is "unsaved" any more.
    this.toast.success('Profile updated');
  }

  protected resetData(): void {
    if (!window.confirm('Replace all boards with the sample data? This cannot be undone.')) return;
    this.boardService.reset();
    this.toast.success('Sample boards restored');
    this.router.navigate(['/boards']);
  }

  protected logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  hasUnsavedChanges(): boolean {
    return this.form().dirty ?? false;
  }
}
