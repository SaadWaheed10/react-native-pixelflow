import { scalingEngine } from '../core/scalingEngine';

/**
 * Responsive width — returns `percent`% of the current screen width in px.
 * @example width: rw(90) // 90% of screen width
 */
export function rw(percent: number): number {
  return scalingEngine.width_(percent);
}

/**
 * Responsive height — returns `percent`% of the current screen height in px.
 * @example height: rh(30) // 30% of screen height
 */
export function rh(percent: number): number {
  return scalingEngine.height_(percent);
}

/**
 * Responsive font size. Scales using the hybrid engine (screen size +
 * pixel density + accessibility font scale + tablet/foldable damping).
 * @example fontSize: rf(16)
 */
export function rf(size: number): number {
  return scalingEngine.font(size);
}

/**
 * Responsive padding. Moderate-scales with screen size.
 * @example padding: rp(16)
 */
export function rp(value: number): number {
  return scalingEngine.spacing(value);
}

/**
 * Responsive margin. Moderate-scales with screen size (same algorithm as rp,
 * kept as a separate export for readability/semantics in styles).
 * @example marginTop: rm(20)
 */
export function rm(value: number): number {
  return scalingEngine.spacing(value);
}

/**
 * Responsive border radius. Scales gently — radii shouldn't balloon on tablets.
 * @example borderRadius: rr(12)
 */
export function rr(value: number): number {
  return scalingEngine.radius(value);
}

/**
 * Responsive icon size. Scales close to font size since icons usually sit
 * next to text.
 * @example width: ri(24), height: ri(24)
 */
export function ri(value: number): number {
  return scalingEngine.icon(value);
}

/**
 * Responsive line height. Tracks font scaling to avoid clipped text.
 * @example lineHeight: rl(24)
 */
export function rl(value: number): number {
  return scalingEngine.lineHeight(value);
}

/**
 * Responsive letter spacing. Very small damping — letter spacing should
 * rarely change meaningfully across devices.
 * @example letterSpacing: rls(1.2)
 */
export function rls(value: number): number {
  return scalingEngine.letterSpacing(value);
}
