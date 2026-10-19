import { beforeEach, describe, expect, it } from 'vitest';
import { Dimensions } from 'react-native';
import { configure } from '../core/scalingEngine';
import { resetConfig } from '../core/config';
import { resolveResponsiveValue } from './resolveValue';

type DimensionsMock = typeof Dimensions & {
  __setWindow: (w: number, h: number) => void;
  __reset: () => void;
};

const dims = Dimensions as DimensionsMock;

describe('resolveResponsiveValue', () => {
  beforeEach(() => {
    dims.__reset();
    resetConfig();
    configure({ baseWidth: 375, baseHeight: 812 });
    dims.__setWindow(375, 812);
  });

  it('returns plain values', () => {
    expect(resolveResponsiveValue(16)).toBe(16);
    expect(resolveResponsiveValue('md')).toBe('md');
  });

  it('resolves window-class maps mobile-first', () => {
    expect(
      resolveResponsiveValue({ compact: 8, medium: 16, expanded: 24 }),
    ).toBe(8);

    dims.__setWindow(800, 1024);
    expect(
      resolveResponsiveValue({ compact: 8, medium: 16, expanded: 24 }),
    ).toBe(16);

    dims.__setWindow(900, 1200);
    expect(
      resolveResponsiveValue({ compact: 8, medium: 16, expanded: 24 }),
    ).toBe(24);
  });

  it('resolves tuples and device maps', () => {
    expect(resolveResponsiveValue([1, 2, 3])).toBe(1);
    dims.__setWindow(800, 1024);
    expect(resolveResponsiveValue([1, 2, 3])).toBe(2);

    dims.__setWindow(1024, 1366);
    expect(resolveResponsiveValue({ phone: 'a', tablet: 'b' })).toBe('b');
  });
});
