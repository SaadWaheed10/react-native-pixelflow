import { beforeEach, describe, expect, it } from 'vitest';
import { Dimensions } from 'react-native';
import { configure } from '../core/scalingEngine';
import { resetConfig } from '../core/config';
import { moderateScale, scale, verticalScale } from './sizeMatters';
import { setSafeInsets } from '../core/safeInsets';
import { rsh, rsw } from './safeMetrics';
import { rp } from './responsive';

type DimensionsMock = typeof Dimensions & {
  __setWindow: (w: number, h: number) => void;
  __reset: () => void;
};

const dims = Dimensions as DimensionsMock;

describe('size-matters aliases + safe metrics', () => {
  beforeEach(() => {
    dims.__reset();
    resetConfig();
    configure({ baseWidth: 375, baseHeight: 812, density: 'comfortable' });
    dims.__setWindow(375, 812);
    setSafeInsets({ top: 0, bottom: 0, left: 0, right: 0 });
  });

  it('scale is ~identity on baseline', () => {
    expect(scale(10)).toBe(10);
    expect(verticalScale(10)).toBe(10);
    expect(moderateScale(10)).toBe(10);
  });

  it('rsw/rsh subtract safe insets', () => {
    setSafeInsets({ top: 50, bottom: 50, left: 0, right: 0 });
    expect(rsw(100)).toBe(375);
    expect(rsh(100)).toBe(812 - 100);
  });

  it('density changes rp via configure', () => {
    configure({ density: 'compact' });
    dims.__setWindow(375, 812);
    expect(rp(16)).toBe(Math.round(16 * 0.85));
    configure({ density: 'spacious' });
    expect(rp(16)).toBe(Math.round(16 * 1.15));
  });
});
