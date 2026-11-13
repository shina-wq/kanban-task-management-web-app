import { Injectable, signal } from '@angular/core';

export interface ToastAction {
  label: string;
  run: () => void;
}

export interface Toast {
  id: number;
  message: string;
  tone: 'success' | 'error';
  action?: ToastAction;
}

const AUTO_DISMISS_MS = 4000;

/**
 * Short confirmation messages at the bottom of the screen
 * ("Task created", "Board deleted"…). One toast at a time: a new one replaces the old.
 * Success toasts disappear by themselves; error toasts stay until dismissed.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  private timer?: ReturnType<typeof setTimeout>;

  readonly current = signal<Toast | null>(null);

  success(message: string): void {
    this.show({ message, tone: 'success' });
    this.timer = setTimeout(() => this.dismiss(), AUTO_DISMISS_MS);
  }

  error(message: string, action?: ToastAction): void {
    this.show({ message, tone: 'error', action });
  }

  dismiss(): void {
    clearTimeout(this.timer);
    this.current.set(null);
  }

  private show(toast: Omit<Toast, 'id'>): void {
    clearTimeout(this.timer);
    this.current.set({ id: this.nextId++, ...toast });
  }
}
