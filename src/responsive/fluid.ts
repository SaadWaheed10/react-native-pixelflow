import { clamp } from './clamp';
import { scalingEngine } from '../core/scalingEngine';
import { getConfig } from '../core/config';

export interface FluidOptions {
  /**
   * Viewport width where `min` applies. Default: config `baseWidth`.
   */
  minWidth?: number;
  /**
   * Viewport width where `max` applies. Default: 1200 (large breakpoint).
   */
  maxWidth?: number;
  /**
   * Override current width (useful in tests / container queries).
   */
  width?: number;
}

/**
 * CSS-style fluid value: interpolates between `min` and `max` as width grows,
 * then clamps. Preferred is the design-frame value at `baseWidth`.
 *
 * @example fontSize: fluid(14, 16, 22)
 * @example padding: fluid(12, 16, 28, { maxWidth: 840 })
 */
export function fluid(
  min: number,
  preferred: number,
  max: number,
  options: FluidOptions = {},
): number {
  const config = getConfig();
  const snapshot = scalingEngine.getSnapshot();
  const width = options.width ?? snapshot.width;
  const minW = options.minWidth ?? config.baseWidth;
  const maxW = options.maxWidth ?? 1200;

  if (maxW <= minW) return clamp(preferred, min, max);

  const t = clamp((width - minW) / (maxW - minW), 0, 1);
  // Ease from preferred at base → max at large; below base ease toward min
  let value: number;
  if (width <= minW) {
    const tDown = minW > 0 ? clamp(width / minW, 0, 1) : 1;
    value = min + (preferred - min) * tDown;
  } else {
    value = preferred + (max - preferred) * t;
  }
  return clamp(value, Math.min(min, max), Math.max(min, max));
}
