import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BoardService } from '../../core/services/board.service';
import { Icon } from '../../shared/icon/icon';

/** Board links shown in the desktop sidebar and the mobile dropdown. */
@Component({
  selector: 'app-board-nav',
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './board-nav.html',
  styleUrl: './board-nav.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardNav {
  protected readonly boards = inject(BoardService).boards;

  /** Fires when a link is clicked, so the mobile dropdown can close. */
  readonly navigate = output<void>();
}
