import { rf, ri, rl, rm, rp, rr } from './responsive';

function designFn(value: number): number {
  return rp(value);
}

/**
 * Map a Figma / design-tool pixel value through PixelFlow spacing scale.
 * Same as `rp()` — use when reading sizes straight off a design frame.
 *
 * Namespaced helpers: `design.font`, `design.radius`, `design.icon`, etc.
 *
 * @example padding: design(16)
 * @example fontSize: design.font(24)
 */
export const design = Object.assign(designFn, {
  space: rp,
  margin: rm,
  font: rf,
  lineHeight: rl,
  radius: rr,
  icon: ri,
});
