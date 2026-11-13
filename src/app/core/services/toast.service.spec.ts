import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let toast: ToastService;

  beforeEach(() => {
    vi.useFakeTimers();
    toast = TestBed.inject(ToastService);
  });

  afterEach(() => vi.useRealTimers());

  it('shows a success toast that disappears on its own', () => {
    toast.success('Task created');
    expect(toast.current()).toMatchObject({ message: 'Task created', tone: 'success' });

    vi.advanceTimersByTime(4000);
    expect(toast.current()).toBeNull();
  });

  it('keeps error toasts until they are dismissed', () => {
    toast.error('Something went wrong');
    vi.advanceTimersByTime(10_000);
    expect(toast.current()?.tone).toBe('error');

    toast.dismiss();
    expect(toast.current()).toBeNull();
  });

  it('replaces the current toast and restarts the timer', () => {
    toast.success('First');
    vi.advanceTimersByTime(3000);
    toast.success('Second');
    vi.advanceTimersByTime(3000);

    expect(toast.current()?.message).toBe('Second');
  });
});
