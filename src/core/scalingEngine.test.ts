import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Dimensions } from 'react-native';
import { configure, scalingEngine } from './scalingEngine';
import { resetConfig } from './config';
import { rf, rp, rr, rs, rw } from '../responsive/responsive';

type DimensionsMock = typeof Dimensions & {
  __setWindow: (w: number, h: number) => void;
  __setFontScale: (scale: number) => void;
  __reset: () => void;
};

const dims = Dimensions as DimensionsMock;

describe('scalingEngine', () => {
  beforeEach(() => {
    dims.__reset();
    resetConfig();
    // Re-apply defaults through engine so caches/version clear.
    configure({
      baseWidth: 375,
      baseHeight: 812,
      minFontScale: 0.85,
      maxFontScale: 1.6,
      applyAccessibilityFontScale: true,
      tabletDamping: 0.55,
      foldableDamping: 0.65,
    });
    dims.__setWindow(375, 812);
    dims.__setFontScale(1);
    // Trigger listener after font scale change (Dimensions mock only notifies on __setWindow).
    dims.__setWindow(375, 812);
  });

  it('returns design-size values near 1:1 on the baseline phone', () => {
    expect(rf(16)).toBe(16);
    expect(rp(16)).toBe(16);
    expect(rr(12)).toBe(12);
    expect(rw(100)).toBe(375);
  });

  it('damps tablet growth vs raw width ratio', () => {
    dims.__setWindow(1024, 1366);
    const tabletFont = rf(16);
    const rawWouldBe = 16 * (1024 / 375);
    expect(tabletFont).toBeLessThan(rawWouldBe);
    expect(tabletFont).toBeGreaterThan(16);
  });

  it('respects configure baseWidth', () => {
    configure({ baseWidth: 390, baseHeight: 844 });
    dims.__setWindow(390, 844);
    expect(rf(16)).toBe(16);
    expect(rp(16)).toBe(16);
  });

  it('applies accessibility font scale when enabled', () => {
    dims.__setFontScale(1.5);
    dims.__setWindow(375, 812);
    expect(rf(16)).toBe(24);
  });

  it('can disable accessibility font scale via configure', () => {
    configure({ applyAccessibilityFontScale: false });
    dims.__setFontScale(1.5);
    dims.__setWindow(375, 812);
    expect(rf(16)).toBe(16);
  });

  it('clamps font scale to maxFontScale', () => {
    configure({ maxFontScale: 1.2 });
    dims.__setFontScale(2);
    dims.__setWindow(375, 812);
    expect(rf(16)).toBe(Math.round(16 * 1.2));
  });

  it('exposes scale that matches spacing hybrid factor', () => {
    dims.__setWindow(375, 812);
    expect(scalingEngine.getSnapshot().scale).toBeCloseTo(1, 5);
    dims.__setWindow(750, 1624);
    // phone, hybrid of width/height scales with factor 0.5
    const snap = scalingEngine.getSnapshot();
    expect(snap.scale).toBeCloseTo(scalingEngine.hybridScale(0.5), 5);
  });

  it('rs picks per-device values with foldable → tablet → phone fallback', () => {
    dims.__setWindow(375, 812);
    expect(rs({ phone: 1, tablet: 2 })).toBe(1);

    dims.__setWindow(1024, 1366);
    expect(rs({ phone: 1, tablet: 2 })).toBe(2);

    dims.__setWindow(674, 841);
    expect(rs({ phone: 1, tablet: 2 })).toBe(2);
    expect(rs({ phone: 1, tablet: 2, foldable: 3 })).toBe(3);
  });

  it('notifies subscribers on dimension change', () => {
    const spy = vi.fn();
    const unsub = scalingEngine.subscribe(spy);
    dims.__setWindow(390, 844);
    expect(spy).toHaveBeenCalled();
    unsub();
  });
});
