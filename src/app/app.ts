import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastOutlet } from './layout/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastOutlet],
  template: `
    <router-outlet />
    <app-toast />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
