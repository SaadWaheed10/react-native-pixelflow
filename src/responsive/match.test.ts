import { beforeEach, describe, expect, it } from 'vitest';
import { Dimensions } from 'react-native';
import { configure, scalingEngine } from '../core/scalingEngine';
import { resetConfig } from '../core/config';
import { match } from './match';
import { rs } from './responsive';

type DimensionsMock = typeof Dimensions & {
  __setWindow: (w: number, h: number) => void;
  __reset: () => void;
};

const dims = Dimensions as DimensionsMock;

describe('match / rs.match', () => {
  beforeEach(() => {
    dims.__reset();
    resetConfig();
    configure({ baseWidth: 375, baseHeight: 812 });
    dims.__setWindow(375, 812);
  });

  it('resolves window maps and tuples', () => {
    expect(match({ compact: 1, medium: 2, expanded: 3 })).toBe(1);
    expect(match([8, 16, 24])).toBe(8);
    scalingEngine.setWindowForTesting(900, 700, 1);
    expect(rs.match({ compact: 1, medium: 2, expanded: 3 })).toBe(3);
    expect(rs.class({ compact: 'sm', medium: 'md' })).toBe('md');
  });

  it('resolves device maps via rs.select', () => {
    expect(rs.select({ phone: 1, tablet: 2 })).toBe(1);
  });
});
