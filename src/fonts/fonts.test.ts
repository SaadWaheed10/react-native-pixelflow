import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildFontMap } from './fonts';

describe('buildFontMap', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('maps known weights to family strings', () => {
    const map = buildFontMap('inter', {
      regular: 1 as unknown as number,
      bold: 2 as unknown as number,
    });
    expect(map).toEqual({
      Inter_400Regular: 1,
      Inter_700Bold: 2,
    });
  });

  it('warns on unknown weights', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    buildFontMap('inter', { notAWeight: 1 as unknown as number });
    expect(warn).toHaveBeenCalled();
    expect(String(warn.mock.calls[0]?.[0])).toContain('unknown weight');
  });
});
