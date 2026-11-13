import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <p class="code" aria-hidden="true">404</p>
    <h2 class="heading-xl">This page doesn’t exist</h2>
    <p class="body-l message">
      The board, task or page you’re looking for may have been moved or deleted.
    </p>
    <div class="actions">
      <a class="btn btn-primary btn-lg" routerLink="/boards">Go to all boards</a>
      <button type="button" class="btn btn-secondary btn-lg" (click)="location.back()">
        Go back
      </button>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      min-height: 100%;
      padding: 2rem 1rem;
      text-align: center;
    }

    .code {
      font-size: clamp(5rem, 15vw, 8rem);
      font-weight: var(--font-bold);
      line-height: 1;
      color: var(--color-purple);
      opacity: 0.25;
    }

    .message {
      max-width: 28rem;
      color: var(--text-secondary);
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
      margin-top: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NotFound {
  protected readonly location = inject(Location);
}
