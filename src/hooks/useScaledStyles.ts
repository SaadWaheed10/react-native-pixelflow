import { useMemo } from 'react';
import { StyleSheet, type ImageStyle, type TextStyle, type ViewStyle } from 'react-native';
import { useScalingVersion } from './useScaling';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

/**
 * Build a StyleSheet that recomputes when screen size, orientation, font
 * scale, or `configure()` changes. Prefer this over module-level
 * `StyleSheet.create({ padding: rp(16) })`, which freezes numbers at import.
 *
 * The factory is intentionally omitted from the dependency list — treat it
 * like `useState`'s lazy initializer: read only responsive inputs inside it.
 *
 * @example
 * const styles = useScaledStyles(() => ({
 *   title: { fontSize: rf(24), padding: rp(16) },
 *   card: { width: rw(90), borderRadius: rr(12) },
 * }));
 */
export function useScaledStyles<T extends NamedStyles<T>>(
  factory: () => T | NamedStyles<T>,
): T {
  const version = useScalingVersion();
  // version is the intentional dependency; factory is treated as a stable recipe.
  return useMemo(() => StyleSheet.create(factory()) as T, [version]);
}
