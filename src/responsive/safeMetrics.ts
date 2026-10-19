import { scalingEngine } from '../core/scalingEngine';
import { getSafeInsets } from '../core/safeInsets';

/**
 * Percent of **safe** window width (insets subtracted).
 * Requires `PixelFlowProvider` (or manual `setSafeInsets`) so insets are live.
 *
 * @example width: rsw(100)
 */
export function rsw(percent: number): number {
  const { width } = scalingEngine.getSnapshot();
  const insets = getSafeInsets();
  const safeWidth = Math.max(0, width - insets.left - insets.right);
  return (safeWidth * percent) / 100;
}

/**
 * Percent of **safe** window height (insets subtracted).
 *
 * @example height: rsh(50)
 */
export function rsh(percent: number): number {
  const { height } = scalingEngine.getSnapshot();
  const insets = getSafeInsets();
  const safeHeight = Math.max(0, height - insets.top - insets.bottom);
  return (safeHeight * percent) / 100;
}
