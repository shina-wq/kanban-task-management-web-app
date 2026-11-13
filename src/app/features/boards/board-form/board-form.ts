import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BoardDraft } from '../../../core/models/board.model';
import { BoardService } from '../../../core/services/board.service';
import { createId } from '../../../core/utils/id';
import { Icon } from '../../../shared/icon/icon';
import { Modal } from '../../../shared/modal/modal';

/** One editable column row. `key` is only for @for tracking; `id` is set for existing columns. */
interface ColumnRow {
  key: string;
  id?: string;
  name: string;
}

/**
 * Add New Board (/boards/new) and Edit Board (/boards/:boardId/edit).
 * Template-driven form: the inputs are bound to plain fields with [(ngModel)].
 */
@Component({
  selector: 'app-board-form',
  imports: [FormsModule, Modal, Icon],
  templateUrl: './board-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardForm implements OnInit {
  private readonly boardService = inject(BoardService);
  private readonly router = inject(Router);
  private readonly form = viewChild.required(NgForm);

  /** Route param; undefined on /boards/new. */
  readonly boardId = input<string>();
  protected readonly isEdit = computed(() => this.boardId() !== undefined);

  // Form model
  protected name = '';
  protected columns: ColumnRow[] = [];

  private rowsChanged = false;
  private saved = false;

  /** Inputs (route params) are ready in ngOnInit, so fill the form here. */
  ngOnInit(): void {
    const board = this.boardService.getBoard(this.boardId() ?? '');
    if (board) {
      this.name = board.name;
      this.columns = board.columns.map((c) => ({ key: c.id, id: c.id, name: c.name }));
    } else {
      this.columns = [newRow('Todo'), newRow('Doing')];
    }
  }

  protected addColumn(): void {
    this.columns.push(newRow());
    this.rowsChanged = true;
  }

  protected removeColumn(index: number): void {
    this.columns.splice(index, 1);
    this.rowsChanged = true;
  }

  protected save(): void {
    const form = this.form();
    if (form.invalid) {
      form.control.markAllAsTouched(); // Show every "Can't be empty" message.
      return;
    }

    const draft: BoardDraft = {
      name: this.name,
      columns: this.columns.map(({ id, name }) => ({ id, name })),
    };
    this.saved = true;

    // Programmatic navigation to the saved board.
    const boardId = this.boardId();
    if (boardId) {
      this.boardService.updateBoard(boardId, draft);
      this.router.navigate(['/boards', boardId]);
    } else {
      const board = this.boardService.createBoard(draft);
      this.router.navigate(['/boards', board.id]);
    }
  }

  /** Used by the unsaved-changes guard. */
  hasUnsavedChanges(): boolean {
    return !this.saved && (this.form().dirty || this.rowsChanged);
  }
}

function newRow(name = ''): ColumnRow {
  return { key: createId(), name };
}
