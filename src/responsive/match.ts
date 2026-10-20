import type {
  DeviceType,
  ResponsiveValue,
  WindowWidthClass,
} from '../types';
import { resolveResponsiveValue } from './resolveValue';

/**
 * Pick a value for the current (or given) window class / device.
 * Alias of `resolveResponsiveValue` / `rs.match`.
 *
 * @example match({ compact: 1, medium: 2, expanded: 3 })
 * @example match([8, 16, 24])
 * @example match({ phone: 1, tablet: 2 })
 */
export function match<T>(
  value: ResponsiveValue<T>,
  options?: {
    width?: number;
    widthClass?: WindowWidthClass;
    deviceType?: DeviceType;
  },
): T {
  return resolveResponsiveValue(value, options);
}
