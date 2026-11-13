import { firstValueFrom, of } from 'rxjs';
import { SelectivePreloadingStrategy } from './selective-preloading.strategy';

describe('SelectivePreloadingStrategy', () => {
  const strategy = new SelectivePreloadingStrategy();

  it('preloads routes marked with data.preload', async () => {
    const load = vi.fn(() => of('loaded'));
    expect(await firstValueFrom(strategy.preload({ data: { preload: true } }, load))).toBe('loaded');
    expect(load).toHaveBeenCalled();
  });

  it('skips every other route', async () => {
    const load = vi.fn(() => of('loaded'));
    expect(await firstValueFrom(strategy.preload({}, load))).toBeNull();
    expect(load).not.toHaveBeenCalled();
  });
});
