import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeToggle } from '../../layout/theme-toggle/theme-toggle';
import { Icon } from '../../shared/icon/icon';

/** /login?returnUrl=… — fake login: any display name gets you in. */
@Component({
  selector: 'app-login',
  imports: [FormsModule, Icon, ThemeToggle],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** Query param set by authGuard: the page the user was trying to open. */
  readonly returnUrl = input<string>();

  protected name = '';

  protected login(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.auth.login(this.name);
    // Programmatic navigation back to where the user was going.
    this.router.navigateByUrl(safeReturnUrl(this.returnUrl()));
  }
}

/** Only follow in-app paths, never another site (e.g. "//evil.com"). */
function safeReturnUrl(url: string | undefined): string {
  return url?.startsWith('/') && !url.startsWith('//') ? url : '/boards';
}
