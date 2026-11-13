import { Directive, ElementRef, inject, output } from '@angular/core';

/**
 * Emits when the user clicks outside the host element or presses Escape.
 * Used to close dropdowns and menus.
 *
 * <div (appClickOutside)="open.set(false)">…</div>
 */
@Directive({
  selector: '[appClickOutside]',
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'appClickOutside.emit()',
  },
})
export class ClickOutside {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly appClickOutside = output<void>();

  protected onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.appClickOutside.emit();
    }
  }
}
