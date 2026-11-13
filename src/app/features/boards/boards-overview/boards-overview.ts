import { ChangeDetectionStrategy, Component } from '@angular/core';

// Placeholder — the overview grid is built in Phase 3.
@Component({
  selector: 'app-boards-overview',
  template: `<p class="body-l placeholder">All boards — coming in Phase 3.</p>`,
  styles: `
    .placeholder {
      padding: 1.5rem;
      color: var(--text-secondary);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardsOverview {}
