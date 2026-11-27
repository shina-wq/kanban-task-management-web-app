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
import { HasUnsavedChanges } from '../../../core/guards/unsaved-changes.guard';
import { BoardDraft } from '../../../core/models/board.model';
import { BoardService } from '../../../core/services/board.service';
import { ToastService } from '../../../core/services/toast.service';
import { createId } from '../../../core/utils/id';
import { Icon } from '../../../shared/icon/icon';
import { Modal } from '../../../shared/modal/modal';

interface ColumnRow {
  key: string;
  id?: string;
  name: string;
}

@Component({
  selector: 'app-board-form',
  imports: [FormsModule, Modal, Icon],
  templateUrl: './board-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardForm implements OnInit, HasUnsavedChanges {
  private readonly boardService = inject(BoardService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly form = viewChild.required(NgForm);

  readonly boardId = input<string>();
  protected readonly isEdit = computed(() => this.boardId() !== undefined);

  protected name = '';
  protected columns: ColumnRow[] = [];

  // Tracks column changes that NgForm does not detect.
  private rowsChanged = false;
  private saved = false;

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
      form.control.markAllAsTouched();
      return;
    }

    const draft: BoardDraft = {
      name: this.name,
      columns: this.columns.map(({ id, name }) => ({ id, name })),
    };
    this.saved = true;

    const boardId = this.boardId();
    if (boardId) {
      this.boardService.updateBoard(boardId, draft);
      this.toast.success('Board updated');
      this.router.navigate(['/boards', boardId]);
    } else {
      const board = this.boardService.createBoard(draft);
      this.toast.success(`“${board.name}” board created`);
      this.router.navigate(['/boards', board.id]);
    }
  }

  hasUnsavedChanges(): boolean {
    return !this.saved && (this.form().dirty || this.rowsChanged);
  }
}

function newRow(name = ''): ColumnRow {
  return { key: createId(), name };
}
