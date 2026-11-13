import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingBar } from './layout/loading-bar/loading-bar';
import { ToastOutlet } from './layout/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingBar, ToastOutlet],
  template: `
    <app-loading-bar />
    <router-outlet />
    <app-toast />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
