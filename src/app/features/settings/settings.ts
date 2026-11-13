import { ChangeDetectionStrategy, Component } from '@angular/core';

// Placeholder — the settings form is built in Phase 7.
@Component({
  selector: 'app-settings',
  template: `<p class="body-l placeholder">Settings — coming in Phase 7.</p>`,
  styles: `
    .placeholder {
      padding: 1.5rem;
      color: var(--text-secondary);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Settings {}
