import { scalingEngine } from '../core/scalingEngine';

/**
 * size-matters compatible aliases mapped onto PixelFlow's dampened scales.
 * Drop-in migration path from `react-native-size-matters`.
 */

/** Linear-ish width scale (tablet/foldable damping applied). */
export function scale(size: number): number {
  return Math.round(size * scalingEngine.getWidthScale());
}

/** Linear-ish height scale (tablet/foldable damping applied). */
export function verticalScale(size: number): number {
  return Math.round(size * scalingEngine.getHeightScale());
}

/**
 * Moderated width scale. `factor` 0.5 ≈ size-matters default moderateScale.
 */
export function moderateScale(size: number, factor = 0.5): number {
  const full = scale(size);
  return Math.round(size + (full - size) * factor);
}

/** Moderated height scale. */
export function moderateVerticalScale(size: number, factor = 0.5): number {
  const full = verticalScale(size);
  return Math.round(size + (full - size) * factor);
}

export const s = scale;
export const vs = verticalScale;
export const ms = moderateScale;
export const mvs = moderateVerticalScale;
