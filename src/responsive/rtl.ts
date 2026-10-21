import { I18nManager, type ViewStyle } from 'react-native';

/** True when the app is running in right-to-left layout. */
export function isRTL(): boolean {
  return I18nManager.isRTL === true;
}

/**
 * Map logical start/end pixel values to physical left/right.
 * Prefer RN `paddingStart` / `marginEnd` when possible — this helps with
 * absolute positioning and legacy left/right-only APIs.
 */
export function logicalHorizontal(
  start: number,
  end: number,
): Pick<ViewStyle, 'left' | 'right'> {
  return isRTL() ? { left: end, right: start } : { left: start, right: end };
}

/**
 * Swap a pair when RTL so callers can keep “start first” mental model.
 * @example const [padStart, padEnd] = rtlPair(16, 8);
 */
export function rtlPair<T>(start: T, end: T): [T, T] {
  return isRTL() ? [end, start] : [start, end];
}

/**
 * Writing-direction aware style fragment for absolute insets.
 * @example style={[absoluteFill, rtlInsets({ start: 12, end: 12, top: 0 })]}
 */
export function rtlInsets(options: {
  start?: number;
  end?: number;
  top?: number;
  bottom?: number;
}): ViewStyle {
  const style: ViewStyle = {};
  if (options.top !== undefined) style.top = options.top;
  if (options.bottom !== undefined) style.bottom = options.bottom;
  if (options.start !== undefined || options.end !== undefined) {
    Object.assign(
      style,
      logicalHorizontal(options.start ?? 0, options.end ?? 0),
    );
  }
  return style;
}
