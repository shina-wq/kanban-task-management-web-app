import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';

/**
 * Shared layout for every page: header on top, sidebar on the left,
 * and the current page in the <router-outlet>.
 */
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {}
