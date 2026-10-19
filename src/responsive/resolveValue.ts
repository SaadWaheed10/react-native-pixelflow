import {
  getWindowWidthClass,
  WINDOW_CLASS_ORDER,
} from '../adaptive/windowClass';
import { scalingEngine } from '../core/scalingEngine';
import type {
  DeviceType,
  ResponsiveByDevice,
  ResponsiveByWindow,
  ResponsiveValue,
  WindowWidthClass,
} from '../types';

function isDeviceMap<T>(value: unknown): value is ResponsiveByDevice<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'phone' in value
  );
}

function isWindowMap<T>(value: unknown): value is ResponsiveByWindow<T> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  if ('phone' in value) return false;
  return WINDOW_CLASS_ORDER.some((key) => key in value);
}

function resolveWindowMap<T>(
  map: ResponsiveByWindow<T>,
  widthClass: WindowWidthClass,
): T | undefined {
  const idx = WINDOW_CLASS_ORDER.indexOf(widthClass);
  for (let i = idx; i >= 0; i -= 1) {
    const key = WINDOW_CLASS_ORDER[i];
    const val = map[key];
    if (val !== undefined) return val;
  }
  return undefined;
}

function resolveDeviceMap<T>(
  map: ResponsiveByDevice<T>,
  deviceType: DeviceType,
): T {
  if (deviceType === 'tablet') return map.tablet ?? map.phone;
  if (deviceType === 'foldable') return map.foldable ?? map.tablet ?? map.phone;
  return map.phone;
}

function resolveTuple<T>(
  tuple: readonly [T, T?, T?],
  widthClass: WindowWidthClass,
): T {
  const [compact, medium, expanded] = tuple;
  if (widthClass === 'compact') return compact;
  if (widthClass === 'medium') return medium ?? compact;
  return expanded ?? medium ?? compact;
}

/**
 * Resolve a responsive value against the current window class / device type.
 *
 * @example
 * resolveResponsiveValue({ compact: 8, medium: 16 })
 * resolveResponsiveValue({ phone: 1, tablet: 2 })
 * resolveResponsiveValue([8, 16, 24]) // compact, medium, expanded
 */
export function resolveResponsiveValue<T>(
  value: ResponsiveValue<T>,
  options?: {
    width?: number;
    widthClass?: WindowWidthClass;
    deviceType?: DeviceType;
  },
): T {
  if (value === null || typeof value !== 'object') {
    return value as T;
  }

  const snapshot = scalingEngine.getSnapshot();
  const width = options?.width ?? snapshot.width;
  const widthClass = options?.widthClass ?? getWindowWidthClass(width);
  const deviceType = options?.deviceType ?? snapshot.deviceType;

  if (Array.isArray(value)) {
    return resolveTuple(value as readonly [T, T?, T?], widthClass);
  }
  if (isDeviceMap<T>(value)) {
    return resolveDeviceMap(value, deviceType);
  }
  if (isWindowMap<T>(value)) {
    const resolved = resolveWindowMap(value, widthClass);
    if (resolved === undefined) {
      throw new Error(
        `[react-native-pixelflow] Responsive value has no entry for "${widthClass}" or below.`,
      );
    }
    return resolved;
  }

  return value as T;
}
