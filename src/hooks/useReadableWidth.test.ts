import { beforeEach, describe, expect, it } from 'vitest';
import { Dimensions } from 'react-native';
import { configure } from '../core/scalingEngine';
import { resetConfig } from '../core/config';
import { maxCh } from './useReadableWidth';

type DimensionsMock = typeof Dimensions & {
  __setWindow: (w: number, h: number) => void;
  __reset: () => void;
};

const dims = Dimensions as DimensionsMock;

describe('maxCh', () => {
  beforeEach(() => {
    dims.__reset();
    resetConfig();
    configure({ baseWidth: 375, baseHeight: 812 });
    dims.__setWindow(375, 812);
  });

  it('estimates character width from font size', () => {
    expect(maxCh(10, 16, 0.5)).toBe(80);
    expect(maxCh(65, 16, 0.5)).toBe(520);
  });
});
