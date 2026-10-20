import { Platform, type ViewStyle } from 'react-native';

export type ShadowLevel = 'none' | 'sm' | 'md' | 'lg' | 'xl' | number;

const LEVELS: Record<'none' | 'sm' | 'md' | 'lg' | 'xl', number> = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 16,
};

function resolveLevel(level: ShadowLevel): number {
  if (typeof level === 'number') return Math.max(0, level);
  return LEVELS[level] ?? 0;
}

/**
 * Cross-platform shadow / elevation helper.
 * iOS gets shadow* props; Android gets `elevation` (+ backgroundColor hint).
 *
 * @example style={[styles.card, shadow('md')]}
 * @example style={shadow(6)}
 */
export function shadow(
  level: ShadowLevel = 'md',
  options?: { color?: string; backgroundColor?: string },
): ViewStyle {
  const elevation = resolveLevel(level);
  const color = options?.color ?? '#000000';

  if (elevation === 0) {
    return Platform.select({
      ios: {
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
      },
      android: { elevation: 0 },
      default: {},
    }) as ViewStyle;
  }

  const opacity = Math.min(0.08 + elevation * 0.015, 0.35);
  const radius = Math.max(2, elevation * 1.2);
  const offsetY = Math.max(1, Math.round(elevation * 0.5));

  return Platform.select({
    ios: {
      shadowColor: color,
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
      ...(options?.backgroundColor
        ? { backgroundColor: options.backgroundColor }
        : null),
    },
    android: {
      elevation,
      ...(options?.backgroundColor
        ? { backgroundColor: options.backgroundColor }
        : null),
    },
    default: {
      shadowColor: color,
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
      elevation,
    },
  }) as ViewStyle;
}
