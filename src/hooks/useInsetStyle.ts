import { useMemo } from 'react';
import type { ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScalingVersion } from './useScaling';
import { rp } from '../responsive/responsive';
import type { SpacingToken } from '../types';
import { useTheme } from '../theme/ThemeProvider';

export interface UseInsetStyleOptions {
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
  /** Extra padding added on top of insets (design px or spacing token). */
  extra?: number | SpacingToken;
  /** Apply as margin instead of padding. */
  asMargin?: boolean;
}

/**
 * Build a style object from safe-area insets (+ optional tokenized extra).
 *
 * @example
 * const pad = useInsetStyle({ top: true, bottom: true, extra: 'md' });
 * <View style={pad} />
 */
export function useInsetStyle(options: UseInsetStyleOptions = {}): ViewStyle {
  const {
    top = false,
    bottom = false,
    left = false,
    right = false,
    extra,
    asMargin = false,
  } = options;
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const version = useScalingVersion();

  return useMemo(() => {
    let extraPx = 0;
    if (typeof extra === 'number') extraPx = rp(extra);
    else if (typeof extra === 'string' && extra in theme.spacing) {
      extraPx = rp(theme.spacing[extra]);
    }

    const pick = (edge: number) => edge + extraPx;
    if (asMargin) {
      return {
        ...(top && { marginTop: pick(insets.top) }),
        ...(bottom && { marginBottom: pick(insets.bottom) }),
        ...(left && { marginLeft: pick(insets.left) }),
        ...(right && { marginRight: pick(insets.right) }),
      };
    }
    return {
      ...(top && { paddingTop: pick(insets.top) }),
      ...(bottom && { paddingBottom: pick(insets.bottom) }),
      ...(left && { paddingLeft: pick(insets.left) }),
      ...(right && { paddingRight: pick(insets.right) }),
    };
  }, [
    top,
    bottom,
    left,
    right,
    extra,
    asMargin,
    insets.top,
    insets.bottom,
    insets.left,
    insets.right,
    theme.spacing,
    version,
  ]);
}
