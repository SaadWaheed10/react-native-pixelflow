import { StyleSheet, type ImageStyle, type TextStyle, type ViewStyle } from 'react-native';
import { useMemo } from 'react';
import { rf, rl, rls, rp, rr } from '../responsive/responsive';
import { useScalingVersion } from '../hooks/useScaling';

type RNStyle = ViewStyle | TextStyle | ImageStyle;
type NamedStyles<T> = { [P in keyof T]: RNStyle };

const FONT_SIZE_KEYS = new Set(['fontSize']);
const LINE_HEIGHT_KEYS = new Set(['lineHeight']);
const LETTER_SPACING_KEYS = new Set(['letterSpacing']);

const RADIUS_KEYS = new Set([
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'borderStartStartRadius',
  'borderStartEndRadius',
  'borderEndStartRadius',
  'borderEndEndRadius',
]);

const SPACING_KEYS = new Set([
  'padding',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingHorizontal',
  'paddingVertical',
  'paddingStart',
  'paddingEnd',
  'margin',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginHorizontal',
  'marginVertical',
  'marginStart',
  'marginEnd',
  'gap',
  'rowGap',
  'columnGap',
  'top',
  'left',
  'right',
  'bottom',
  'start',
  'end',
]);

const SIZE_KEYS = new Set([
  'width',
  'height',
  'minWidth',
  'minHeight',
  'maxWidth',
  'maxHeight',
]);

/**
 * Scale a single style value based on its property name.
 * Percentages, strings, and non-layout numbers (flex, opacity, …) are left alone.
 */
export function scaleStyleValue(key: string, value: unknown): unknown {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return value;
  }
  if (FONT_SIZE_KEYS.has(key)) return rf(value);
  if (LINE_HEIGHT_KEYS.has(key)) return rl(value);
  if (LETTER_SPACING_KEYS.has(key)) return rls(value);
  if (RADIUS_KEYS.has(key)) return rr(value);
  if (SPACING_KEYS.has(key) || SIZE_KEYS.has(key)) return rp(value);
  return value;
}

function scaleStyleObject(style: RNStyle): RNStyle {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(style)) {
    out[key] = scaleStyleValue(key, value);
  }
  return out as RNStyle;
}

/**
 * Transform a styles object so numeric layout/type values are PixelFlow-scaled
 * by property (fontSize → rf, padding → rp, borderRadius → rr, …).
 */
export function scaleStyles<T extends NamedStyles<T> | NamedStyles<any>>(
  styles: T | NamedStyles<T>,
): T {
  const out: Record<string, RNStyle> = {};
  for (const [name, style] of Object.entries(styles)) {
    out[name] = scaleStyleObject(style as RNStyle);
  }
  return out as T;
}

/**
 * Drop-in StyleSheet that auto-scales design numbers by property name.
 * Prefer `usePixelSheet` inside components so values stay live on rotation.
 *
 * @example
 * const styles = PixelSheet.create({
 *   card: { padding: 16, borderRadius: 12, width: 200 },
 *   title: { fontSize: 24, lineHeight: 32, marginBottom: 8 },
 * });
 */
export const PixelSheet = {
  create<T extends NamedStyles<T> | NamedStyles<any>>(
    styles: T | NamedStyles<T>,
  ): T {
    return StyleSheet.create(scaleStyles(styles)) as T;
  },
};

/**
 * Live PixelSheet — recomputes when the scaling engine updates.
 *
 * @example
 * const styles = usePixelSheet(() => ({
 *   title: { fontSize: 24, padding: 16 },
 * }));
 */
export function usePixelSheet<T extends NamedStyles<T>>(
  factory: () => T | NamedStyles<T>,
): T {
  const version = useScalingVersion();
  return useMemo(
    () => StyleSheet.create(scaleStyles(factory())) as T,
    [version],
  );
}
