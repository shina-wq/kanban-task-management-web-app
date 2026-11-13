import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { injectDeepestRoute } from '../../core/routing/deepest-route';
import { Icon } from '../../shared/icon/icon';

/**
 * Search field in the header. Always open on tablet and desktop; on mobile it
 * starts as a round button and expands (the `expanded` class) when used.
 * The search term lives in the URL (?search=…); the board page reads it
 * and filters its tasks.
 */
@Component({
  selector: 'app-board-search',
  imports: [Icon],
  templateUrl: './board-search.html',
  styleUrl: './board-search.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.expanded]': 'expanded()' },
})
export class BoardSearch {
  private readonly router = inject(Router);
  private readonly route = injectDeepestRoute();
  private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');

  protected readonly search = computed(() => this.route().queryParamMap.get('search') ?? '');

  private readonly opened = signal(false);
  /** Stays open while there is a search term, so the user can see what's filtered. */
  protected readonly expanded = computed(() => this.opened() || this.search() !== '');

  protected open(): void {
    this.opened.set(true);
    this.input().nativeElement.focus();
  }

  protected close(): void {
    this.opened.set(false);
  }

  protected clear(): void {
    this.setSearch('');
    this.close();
    this.input().nativeElement.blur();
  }

  /** Programmatic navigation: same page, new ?search= value. */
  protected setSearch(value: string): void {
    this.router.navigate([], {
      queryParams: { search: value.trim() ? value : null },
      queryParamsHandling: 'merge',
      replaceUrl: true, // Typing shouldn't fill up the browser history.
    });
  }
}
