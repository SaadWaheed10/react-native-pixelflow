import { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeyboardInset } from './useKeyboardInset';
import { useFoldState } from './useFoldState';
import { useScalingVersion } from './useScaling';
import { rp } from '../responsive/responsive';
import type { ViewStyle } from 'react-native';

export interface UseOverlayInsetsOptions {
  /** Extra padding beyond safe/keyboard/hinge (design px). */
  extra?: number;
  /** Include keyboard height in bottom inset. Default true. */
  keyboard?: boolean;
  /** Pad around fold hinge when native hinge bounds exist. Default true. */
  hinge?: boolean;
}

export interface UseOverlayInsetsResult {
  top: number;
  bottom: number;
  left: number;
  right: number;
  /** Padding style for absolute overlays (FAB, toast, modal sheet). */
  padding: ViewStyle;
  /** Margin style variant. */
  margin: ViewStyle;
}

/**
 * Combined safe-area + keyboard + fold-hinge insets for portals / overlays.
 *
 * @example
 * const overlay = useOverlayInsets({ extra: 8 });
 * <View style={[StyleSheet.absoluteFill, overlay.padding]} pointerEvents="box-none">
 *   <FAB style={{ alignSelf: 'flex-end' }} />
 * </View>
 */
export function useOverlayInsets(
  options: UseOverlayInsetsOptions = {},
): UseOverlayInsetsResult {
  const { extra = 0, keyboard = true, hinge = true } = options;
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardInset();
  const fold = useFoldState();
  useScalingVersion();

  return useMemo(() => {
    const extraPx = rp(extra);
    let top = insets.top + extraPx;
    let bottom = insets.bottom + extraPx;
    let left = insets.left + extraPx;
    let right = insets.right + extraPx;

    if (keyboard) {
      bottom = Math.max(bottom, insets.bottom + keyboardHeight + extraPx);
    }

    if (hinge && fold.hinge) {
      const { x, y, width, height } = fold.hinge;
      // Expand insets so content clears the hinge band
      if (width >= height) {
        // horizontal hinge (tabletop)
        top = Math.max(top, y + height + extraPx);
      } else {
        // vertical hinge (book)
        left = Math.max(left, x + width + extraPx);
      }
    }

    return {
      top,
      bottom,
      left,
      right,
      padding: {
        paddingTop: top,
        paddingBottom: bottom,
        paddingLeft: left,
        paddingRight: right,
      },
      margin: {
        marginTop: top,
        marginBottom: bottom,
        marginLeft: left,
        marginRight: right,
      },
    };
  }, [
    insets.top,
    insets.bottom,
    insets.left,
    insets.right,
    keyboardHeight,
    fold.hinge,
    extra,
    keyboard,
    hinge,
  ]);
}
