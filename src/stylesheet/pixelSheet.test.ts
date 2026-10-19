import { beforeEach, describe, expect, it } from 'vitest';
import { Dimensions } from 'react-native';
import { configure } from '../core/scalingEngine';
import { resetConfig } from '../core/config';
import { PixelSheet, scaleStyleValue } from './pixelSheet';
import { rf, rp, rr, rl } from '../responsive/responsive';

type DimensionsMock = typeof Dimensions & {
  __setWindow: (w: number, h: number) => void;
  __reset: () => void;
};

const dims = Dimensions as DimensionsMock;

describe('PixelSheet', () => {
  beforeEach(() => {
    dims.__reset();
    resetConfig();
    configure({ baseWidth: 375, baseHeight: 812, applyAccessibilityFontScale: true });
    dims.__setWindow(375, 812);
  });

  it('scales values by property name', () => {
    expect(scaleStyleValue('fontSize', 16)).toBe(rf(16));
    expect(scaleStyleValue('lineHeight', 24)).toBe(rl(24));
    expect(scaleStyleValue('padding', 16)).toBe(rp(16));
    expect(scaleStyleValue('borderRadius', 12)).toBe(rr(12));
    expect(scaleStyleValue('width', 200)).toBe(rp(200));
    expect(scaleStyleValue('opacity', 0.5)).toBe(0.5);
    expect(scaleStyleValue('width', '90%')).toBe('90%');
  });

  it('PixelSheet.create scales nested style objects', () => {
    const styles = PixelSheet.create({
      card: { padding: 16, borderRadius: 12, width: 200 },
      title: { fontSize: 24, lineHeight: 32, marginBottom: 8 },
    });
    expect(styles.card.padding).toBe(rp(16));
    expect(styles.card.borderRadius).toBe(rr(12));
    expect(styles.title.fontSize).toBe(rf(24));
    expect(styles.title.marginBottom).toBe(rp(8));
  });
});
