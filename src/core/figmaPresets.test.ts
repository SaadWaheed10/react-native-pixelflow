import { beforeEach, describe, expect, it } from 'vitest';
import { configure, scalingEngine } from './scalingEngine';
import { resetConfig, getConfig } from './config';
import { Dimensions } from 'react-native';
import { listFigmaPresets, resolveFigmaFrame } from './figmaPresets';
import { design } from '../responsive/design';
import { rp, rf } from '../responsive/responsive';

type DimensionsMock = typeof Dimensions & {
  __setWindow: (w: number, h: number) => void;
  __reset: () => void;
};

const dims = Dimensions as DimensionsMock;

describe('Figma presets', () => {
  beforeEach(() => {
    dims.__reset();
    resetConfig();
    configure({
      baseWidth: 375,
      baseHeight: 812,
    });
    dims.__setWindow(375, 812);
  });

  it('lists presets and resolves known names', () => {
    expect(listFigmaPresets()).toContain('iPhone 14');
    expect(resolveFigmaFrame('iPhone 14')).toEqual({
      width: 390,
      height: 844,
      preset: 'iPhone 14',
    });
  });

  it('configure({ figma }) sets base frame', () => {
    configure({ figma: 'iPhone 14' });
    const cfg = getConfig();
    expect(cfg.baseWidth).toBe(390);
    expect(cfg.baseHeight).toBe(844);
    expect(cfg.figmaPreset).toBe('iPhone 14');

    dims.__setWindow(390, 844);
    expect(scalingEngine.font(16)).toBe(16);
  });

  it('explicit baseWidth overrides figma width', () => {
    configure({ figma: 'iPhone 14', baseWidth: 400 });
    expect(getConfig().baseWidth).toBe(400);
    expect(getConfig().baseHeight).toBe(844);
  });

  it('design() matches rp / design.font matches rf', () => {
    expect(design(16)).toBe(rp(16));
    expect(design.font(16)).toBe(rf(16));
  });
});
