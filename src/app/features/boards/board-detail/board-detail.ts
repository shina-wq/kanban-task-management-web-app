import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BoardService } from '../../../core/services/board.service';
import { BoardColumn } from '../board-column/board-column';

@Component({
  selector: 'app-board-detail',
  imports: [RouterLink, RouterOutlet, BoardColumn],
  templateUrl: './board-detail.html',
  styleUrl: './board-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardDetail {
  private readonly boardService = inject(BoardService);

  /** Bound from the `:boardId` route param (withComponentInputBinding). */
  readonly boardId = input.required<string>();

  protected readonly board = computed(() => this.boardService.getBoard(this.boardId()));
}
