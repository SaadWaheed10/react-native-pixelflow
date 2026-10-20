import { beforeEach, describe, expect, it } from 'vitest';
import { Dimensions } from 'react-native';
import { configure, scalingEngine } from '../core/scalingEngine';
import { resetConfig } from '../core/config';
import { fluid } from './fluid';

type DimensionsMock = typeof Dimensions & {
  __setWindow: (w: number, h: number) => void;
  __reset: () => void;
};

const dims = Dimensions as DimensionsMock;

describe('fluid', () => {
  beforeEach(() => {
    dims.__reset();
    resetConfig();
    configure({ baseWidth: 375, baseHeight: 812 });
    dims.__setWindow(375, 812);
  });

  it('returns preferred near the base width', () => {
    expect(fluid(14, 16, 22)).toBeCloseTo(16, 0);
  });

  it('grows toward max on wide windows', () => {
    scalingEngine.setWindowForTesting(1200, 800, 1);
    const wide = fluid(14, 16, 22);
    expect(wide).toBeGreaterThan(16);
    expect(wide).toBeLessThanOrEqual(22);
  });

  it('respects explicit width option', () => {
    const a = fluid(10, 20, 30, { width: 375, minWidth: 375, maxWidth: 775 });
    const b = fluid(10, 20, 30, { width: 775, minWidth: 375, maxWidth: 775 });
    expect(a).toBeCloseTo(20, 0);
    expect(b).toBeCloseTo(30, 0);
  });
});
