/**
 * Clamp a numeric value between `min` and `max`.
 *
 * @example fontSize: clamp(rf(18), 14, 22)
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
