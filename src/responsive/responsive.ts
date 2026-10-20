import { scalingEngine } from '../core/scalingEngine';
import type {
  DeviceType,
  ResponsiveByDevice,
  ResponsiveByWindow,
  ResponsiveValue,
  WindowWidthClass,
} from '../types';
import { resolveResponsiveValue } from './resolveValue';
import {
  getWindowWidthClass,
  WINDOW_CLASS_ORDER,
} from '../adaptive/windowClass';

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
 * accessibility font scale when enabled + tablet/foldable damping).
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

export interface RsHelpers {
  <T>(values: ResponsiveByDevice<T>): T;
  /** Window / tuple / device map — same as `match()`. */
  match: <T>(
    value: ResponsiveValue<T>,
    options?: {
      width?: number;
      widthClass?: WindowWidthClass;
      deviceType?: DeviceType;
    },
  ) => T;
  /** Device-class map (same as calling `rs`). */
  select: <T>(
    values: ResponsiveByDevice<T>,
    deviceType?: DeviceType,
  ) => T;
  /** Window-class map only. */
  class: <T>(
    map: ResponsiveByWindow<T>,
    widthClass?: WindowWidthClass,
  ) => T;
}

/**
 * Pick a value by device class. Falls back: foldable → tablet → phone.
 *
 * Also exposes:
 * - `rs.match({ compact, medium, … })` / tuples / device maps
 * - `rs.select({ phone, tablet })` (same as calling `rs`)
 * - `rs.class({ compact, medium })` window-class only
 *
 * @example
 * padding: rs({ phone: rp(16), tablet: rp(24), foldable: rp(20) })
 * columns: rs.match({ compact: 1, medium: 2, expanded: 3 })
 */
export const rs: RsHelpers = Object.assign(
  function rsFn<T>(values: ResponsiveByDevice<T>): T {
    return selectForDevice(scalingEngine.getSnapshot().deviceType, values);
  },
  {
    match: <T>(
      value: ResponsiveValue<T>,
      options?: {
        width?: number;
        widthClass?: WindowWidthClass;
        deviceType?: DeviceType;
      },
    ): T => resolveResponsiveValue(value, options),
    select: <T>(
      values: ResponsiveByDevice<T>,
      deviceType?: DeviceType,
    ): T =>
      selectForDevice(
        deviceType ?? scalingEngine.getSnapshot().deviceType,
        values,
      ),
    class: <T>(
      map: ResponsiveByWindow<T>,
      widthClass?: WindowWidthClass,
    ): T => {
      const snapshot = scalingEngine.getSnapshot();
      const cls = widthClass ?? getWindowWidthClass(snapshot.width);
      const idx = WINDOW_CLASS_ORDER.indexOf(cls);
      for (let i = idx; i >= 0; i -= 1) {
        const key = WINDOW_CLASS_ORDER[i];
        const val = map[key];
        if (val !== undefined) return val;
      }
      throw new Error(
        `[react-native-pixelflow] rs.class map has no entry for "${cls}" or below.`,
      );
    },
  },
);

/** Shared resolution used by `rs` and `useResponsive().select`. */
export function selectForDevice<T>(
  deviceType: DeviceType,
  values: ResponsiveByDevice<T>,
): T {
  if (deviceType === 'tablet') {
    return values.tablet ?? values.phone;
  }
  if (deviceType === 'foldable') {
    return values.foldable ?? values.tablet ?? values.phone;
  }
  return values.phone;
}
