import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
}

const AUTO_DISMISS_MS = 4000;

/**
 * Short confirmation messages at the bottom of the screen
 * ("Task created", "Board deleted"…). One toast at a time: a new one replaces the old.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  private timer?: ReturnType<typeof setTimeout>;

  readonly current = signal<Toast | null>(null);

  success(message: string): void {
    clearTimeout(this.timer);
    this.current.set({ id: this.nextId++, message });
    this.timer = setTimeout(() => this.dismiss(), AUTO_DISMISS_MS);
  }

  dismiss(): void {
    clearTimeout(this.timer);
    this.current.set(null);
  }
}
