import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Icon } from '../../shared/icon/icon';


@Component({
  selector: 'app-login',
  imports: [FormsModule, Icon],
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

    this.router.navigateByUrl(this.returnUrl() ?? '/boards');
  }
}
