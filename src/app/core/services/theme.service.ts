import { DOCUMENT, Injectable, effect, inject, signal } from '@angular/core';
import { readJson, writeJson } from '../utils/storage';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'kanban.theme';

/**
 * Light/dark theme. The choice is applied as `data-theme` on <html>
 * (see the CSS variables in styles.css) and remembered in localStorage.
 * First visit follows the operating system preference.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  readonly theme = signal<Theme>(readJson<Theme | null>(STORAGE_KEY, null) ?? this.systemTheme());

  constructor() {
    // Keep the page and storage in sync whenever the theme signal changes.
    effect(() => {
      const theme = this.theme();
      this.document.documentElement.dataset['theme'] = theme;
      writeJson(STORAGE_KEY, theme);
    });
  }

  toggle(): void {
    this.theme.update((theme) => (theme === 'light' ? 'dark' : 'light'));
  }

  /** The operating system's preference; light if the browser can't tell us. */
  private systemTheme(): Theme {
    const prefersDark = this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)');
    return prefersDark?.matches ? 'dark' : 'light';
  }
}
