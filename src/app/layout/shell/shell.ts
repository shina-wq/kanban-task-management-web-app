import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { readJson, writeJson } from '../../core/utils/storage';
import { Icon } from '../../shared/icon/icon';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';

const SIDEBAR_KEY = 'kanban.sidebarHidden';

/**
 * Shared layout for every page: header on top, sidebar on the left,
 * and the current page in the <router-outlet>.
 */
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Header, Sidebar, Icon],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.sidebar-hidden]': 'sidebarHidden()' },
})
export class Shell {
  protected readonly sidebarHidden = signal(readJson(SIDEBAR_KEY, false));

  constructor() {
    effect(() => writeJson(SIDEBAR_KEY, this.sidebarHidden()));
  }
}
