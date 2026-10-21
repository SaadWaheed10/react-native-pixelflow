import { DEFAULT_CONFIG, resetConfig, setConfig } from '../core/config';
import { resetSafeInsets } from '../core/safeInsets';
import { resetFoldState } from '../core/foldState';
import { clearHydrateLock } from '../core/hydrateLock';
import { scalingEngine } from '../core/scalingEngine';

export interface MockDimensionsOptions {
  width?: number;
  height?: number;
  fontScale?: number;
}

/**
 * Set the PixelFlow window snapshot for unit tests (no RN Dimensions mock required).
 *
 * @example
 * import { mockDimensions, resetPixelFlow } from 'react-native-pixelflow/testing';
 * beforeEach(() => {
 *   resetPixelFlow();
 *   mockDimensions({ width: 390, height: 844 });
 * });
 */
export function mockDimensions(options: MockDimensionsOptions = {}): void {
  const {
    width = 375,
    height = 812,
    fontScale = 1,
  } = options;
  scalingEngine.setWindowForTesting(width, height, fontScale);
}

/**
 * Reset config, safe insets, fold state, hydrate lock, and window back to defaults.
 */
export function resetPixelFlow(): void {
  resetConfig();
  resetSafeInsets();
  resetFoldState();
  clearHydrateLock();
  setConfig({ ...DEFAULT_CONFIG });
  scalingEngine.configure({ ...DEFAULT_CONFIG });
  scalingEngine.setWindowForTesting(375, 812, 1);
}

export { scalingEngine };

export {
  LAYOUT_FIXTURES,
  assertLayout,
  captureLayoutSnapshot,
  withFixtures,
} from './layoutAssert';
export type {
  LayoutFixture,
  LayoutSnapshot,
  AssertLayoutOptions,
} from './layoutAssert';
