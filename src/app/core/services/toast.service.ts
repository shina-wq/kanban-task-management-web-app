import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  kind: 'success' | 'error';
}

const AUTO_DISMISS_MS = 4000;
/** Errors stay a little longer: they usually need reading. */
const ERROR_DISMISS_MS = 6000;

/**
 * Short messages at the bottom of the screen: confirmations ("Task created",
 * "Board deleted"…) and errors ("This task no longer exists.").
 * One toast at a time: a new one replaces the old.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  private timer?: ReturnType<typeof setTimeout>;

  readonly current = signal<Toast | null>(null);

  success(message: string): void {
    this.show({ message, kind: 'success' }, AUTO_DISMISS_MS);
  }

  error(message: string): void {
    this.show({ message, kind: 'error' }, ERROR_DISMISS_MS);
  }

  dismiss(): void {
    clearTimeout(this.timer);
    this.current.set(null);
  }

  private show(toast: Omit<Toast, 'id'>, durationMs: number): void {
    clearTimeout(this.timer);
    this.current.set({ id: this.nextId++, ...toast });
    this.timer = setTimeout(() => this.dismiss(), durationMs);
  }
}
