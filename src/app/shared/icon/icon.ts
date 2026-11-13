import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type IconName =
  | 'board'
  | 'check'
  | 'chevron-down'
  | 'chevron-up'
  | 'cross'
  | 'ellipsis'
  | 'logo-mark'
  | 'moon'
  | 'plus'
  | 'search'
  | 'settings'
  | 'sun';

/**
 * Decorative SVG icon from /public/icons. It is drawn as a CSS mask, so it
 * takes the current text color (see `.icon` in styles.css).
 * Size it with width/height on the host.
 */
@Component({
  selector: 'app-icon',
  template: '',
  host: {
    class: 'icon',
    'aria-hidden': 'true',
    '[style.--icon]': 'url()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
  readonly name = input.required<IconName>();

  protected readonly url = computed(() => `url(/icons/${this.name()}.svg)`);
}
