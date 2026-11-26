import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BoardService } from '../../../core/services/board.service';
import { countTasks, filterColumns } from '../../../core/utils/tasks';
import { BoardColumn, TaskDrop } from '../board-column/board-column';

/**
 * /boards/:boardId?search=…
 * The search box lives in the header; this page reads the term from the URL.
 */
@Component({
  selector: 'app-board-detail',
  imports: [RouterLink, RouterOutlet, BoardColumn, CdkDropListGroup],
  templateUrl: './board-detail.html',
  styleUrl: './board-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // The board scrolls itself, so drag and drop can auto-scroll it near the edges.
  hostDirectives: [CdkScrollable],
})
export class BoardDetail {
  private readonly boardService = inject(BoardService);

  // Route param and query param, bound as inputs (withComponentInputBinding).
  // `search` is undefined when it is not in the URL.
  readonly boardId = input.required<string>();
  readonly search = input<string>();

  protected readonly board = computed(() => this.boardService.getBoard(this.boardId()));
  protected readonly isSearching = computed(() => !!this.search()?.trim());

  protected readonly columns = computed(() =>
    filterColumns(this.board()?.columns ?? [], this.search() ?? ''),
  );

  protected readonly totalTasks = computed(() => countTasks(this.board()?.columns ?? []));
  protected readonly shownTasks = computed(() => countTasks(this.columns()));

  /** Drag and drop: save the task's new column (status) and position. */
  protected moveTask(drop: TaskDrop): void {
    this.boardService.moveTask(this.boardId(), drop.taskId, drop.columnId, drop.index);
  }
}
