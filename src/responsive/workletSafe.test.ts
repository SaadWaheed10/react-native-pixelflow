import { beforeEach, describe, expect, it } from 'vitest';
import { configure } from '../core/scalingEngine';
import { resetConfig } from '../core/config';
import { createScaleContext, rfWith, rpWith } from './workletSafe';

describe('workletSafe', () => {
  beforeEach(() => {
    resetConfig();
    configure({ baseWidth: 375, baseHeight: 812, density: 'comfortable' });
  });

  it('scales with a plain context object', () => {
    const ctx = createScaleContext({
      width: 375,
      height: 812,
      deviceType: 'phone',
      fontScale: 1,
    });
    expect(rpWith(ctx, 16)).toBe(16);
    expect(rfWith(ctx, 16)).toBe(16);

    const wide = createScaleContext({
      width: 800,
      height: 600,
      deviceType: 'tablet',
      fontScale: 1,
    });
    expect(rpWith(wide, 16)).toBeGreaterThan(16);
  });
});
