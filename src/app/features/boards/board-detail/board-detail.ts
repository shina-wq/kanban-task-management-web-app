import { ChangeDetectionStrategy, Component, input } from '@angular/core';

// Placeholder — columns and task cards are built in Phase 3.
@Component({
  selector: 'app-board-detail',
  template: `<p class="body-l placeholder">Board "{{ boardId() }}" — coming in Phase 3.</p>`,
  styles: `
    .placeholder {
      padding: 1.5rem;
      color: var(--text-secondary);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardDetail {
  /** Bound from the `:boardId` route param (withComponentInputBinding). */
  readonly boardId = input.required<string>();
}
