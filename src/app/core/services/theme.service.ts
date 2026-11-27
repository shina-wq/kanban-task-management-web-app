import { DOCUMENT, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';
import { readJson, writeJson } from '../utils/storage';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'kanban.theme';

/**
 * Light/dark theme: service-based global state.
 * A BehaviorSubject holds the current theme and replays it to every new subscriber.
 * Only this service can change it (`toggle()`); everyone else reads `theme$`.
 * The theme is applied as `data-theme` on <html> (see styles.css) and remembered in
 * localStorage. First visit follows the operating system preference.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  private readonly themeSubject = new BehaviorSubject<Theme>(
    readJson<Theme | null>(STORAGE_KEY, null) ?? this.systemTheme(),
  );

  readonly theme$ = this.themeSubject.asObservable();

  constructor() {
    // Keep the page and storage in sync with every theme change.
    this.theme$.pipe(takeUntilDestroyed()).subscribe((theme) => {
      this.document.documentElement.dataset['theme'] = theme;
      writeJson(STORAGE_KEY, theme);
    });
  }

  toggle(): void {
    this.themeSubject.next(this.themeSubject.value === 'light' ? 'dark' : 'light');
  }

  /** The operating system's preference; light if the browser can't tell us. */
  private systemTheme(): Theme {
    const prefersDark = this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)');
    return prefersDark?.matches ? 'dark' : 'light';
  }
}
