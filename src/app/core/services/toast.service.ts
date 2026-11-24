import { Injectable, signal } from '@angular/core';

/** A button inside the toast, e.g. "Undo" or "Move". Clicking it also dismisses the toast. */
export interface ToastAction {
  label: string;
  run: () => void;
}

export interface Toast {
  id: number;
  message: string;
  /** 'question' asks the user something; its action is the answer. */
  kind: 'success' | 'error' | 'question';
  action?: ToastAction;
}

const AUTO_DISMISS_MS = 4000;
/** Errors and toasts with a button stay longer: they need reading or a click. */
const LONG_DISMISS_MS = 6000;

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

  success(message: string, action?: ToastAction): void {
    this.show({ message, kind: 'success', action }, action ? LONG_DISMISS_MS : AUTO_DISMISS_MS);
  }

  error(message: string): void {
    this.show({ message, kind: 'error' }, LONG_DISMISS_MS);
  }

  /** A question with one answer button, e.g. "Move to Done?" [Move]. Ignoring it means no. */
  ask(message: string, action: ToastAction): void {
    this.show({ message, kind: 'question', action }, LONG_DISMISS_MS);
  }

  /** Runs the current toast's action, then closes it. */
  runAction(): void {
    const action = this.current()?.action;
    this.dismiss();
    action?.run();
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
