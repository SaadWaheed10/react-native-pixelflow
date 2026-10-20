import type {
  PressableStateCallbackType,
  StyleProp,
  ViewStyle,
} from 'react-native';

export interface PressStyleConfig {
  base?: StyleProp<ViewStyle>;
  pressed?: StyleProp<ViewStyle>;
  hovered?: StyleProp<ViewStyle>;
  focused?: StyleProp<ViewStyle>;
  disabled?: StyleProp<ViewStyle>;
}

/**
 * Build a Pressable `style` callback with pressed / hovered / focused / disabled states.
 *
 * @example
 * <Pressable
 *   style={createPressStyle({
 *     base: { padding: 12, borderRadius: 8 },
 *     pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
 *   })}
 * />
 */
/**
 * @param isDisabled — pass `disabled` from the Pressable so the disabled style applies
 *   (RN’s style callback does not include `disabled` in state).
 */
export function createPressStyle(
  config: PressStyleConfig,
  isDisabled = false,
): (state: PressableStateCallbackType) => StyleProp<ViewStyle> {
  const { base, pressed, hovered, focused, disabled } = config;

  return (state) => {
    const layers: StyleProp<ViewStyle>[] = [base];
    // RN web / newer Pressable may expose hovered/focused
    const extended = state as PressableStateCallbackType & {
      hovered?: boolean;
      focused?: boolean;
    };
    if (extended.hovered && hovered) layers.push(hovered);
    if (extended.focused && focused) layers.push(focused);
    if (state.pressed && pressed) layers.push(pressed);
    if (isDisabled && disabled) layers.push(disabled);
    return layers;
  };
}
