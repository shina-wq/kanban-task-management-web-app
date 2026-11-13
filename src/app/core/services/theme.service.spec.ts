import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => localStorage.clear());

  it('uses the saved theme and applies it to <html>', () => {
    localStorage.setItem('kanban.theme', '"dark"');
    TestBed.inject(ThemeService);
    TestBed.tick();

    expect(document.documentElement.dataset['theme']).toBe('dark');
  });

  it('toggles and remembers the theme', () => {
    localStorage.setItem('kanban.theme', '"light"');
    const service = TestBed.inject(ThemeService);

    service.toggle();
    TestBed.tick();

    expect(service.theme()).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(localStorage.getItem('kanban.theme')).toBe('"dark"');
  });
});
