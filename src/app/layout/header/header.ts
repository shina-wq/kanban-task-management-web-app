import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectDeepestRoute } from '../../core/routing/deepest-route';
import { BoardService } from '../../core/services/board.service';
import { ClickOutside } from '../../shared/directives/click-outside.directive';
import { Icon } from '../../shared/icon/icon';
import { Menu } from '../../shared/menu/menu';
import { BoardNav } from '../board-nav/board-nav';
import { BoardSearch } from '../board-search/board-search';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

@Component({
  selector: 'app-header',
  imports: [RouterLink, ClickOutside, Icon, Menu, BoardSearch, BoardNav, ThemeToggle],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private readonly boardService = inject(BoardService);
  private readonly route = injectDeepestRoute();

  /** The board in the URL, if the current page belongs to one. */
  protected readonly board = computed(() => {
    const boardId = this.route().paramMap.get('boardId');
    return boardId ? this.boardService.getBoard(boardId) : undefined;
  });

  protected readonly title = computed(() => this.board()?.name ?? this.route().title ?? '');

  protected readonly mobileNavOpen = signal(false);
}
