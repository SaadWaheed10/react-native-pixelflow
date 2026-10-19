import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useScalingVersion } from '../hooks/useScaling';
import { useA11yLayout } from '../hooks/useA11yLayout';
import { rp, rr } from '../responsive/responsive';
import { FText } from './FText';
import { createVariants } from '../variants/createVariants';

export type ButtonIntent = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  children: React.ReactNode;
  intent?: ButtonIntent;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

/**
 * Themed button built on tokens, variants, and a11y min heights.
 *
 * @example
 * <Button intent="primary" size="lg" onPress={…}>Save</Button>
 */
export function Button({
  children,
  intent = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  style,
  textStyle,
  ...rest
}: ButtonProps): React.JSX.Element {
  useScalingVersion();
  const theme = useTheme();
  const { minControlHeight } = useA11yLayout();

  const styles = useMemo(() => {
    const factory = createVariants({
      base: {
        borderRadius: rr(theme.radii.md),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: rp(8),
      },
      variants: {
        intent: {
          primary: { backgroundColor: theme.colors.primary },
          secondary: {
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
          },
          danger: { backgroundColor: theme.colors.danger },
          ghost: { backgroundColor: 'transparent' },
        },
        size: {
          sm: { paddingVertical: rp(8), paddingHorizontal: rp(12) },
          md: { paddingVertical: rp(12), paddingHorizontal: rp(16) },
          lg: { paddingVertical: rp(14), paddingHorizontal: rp(20) },
        },
      },
      defaultVariants: { intent: 'primary', size: 'md' },
    });
    return factory({ intent, size });
  }, [theme, intent, size]);

  const labelColor =
    intent === 'secondary' || intent === 'ghost'
      ? theme.colors.text
      : '#FFFFFF';

  const fontSize = size === 'sm' ? 13 : size === 'lg' ? 17 : 15;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles,
        {
          minHeight: Math.max(minControlHeight, size === 'sm' ? 40 : 44),
          opacity: disabled || loading ? 0.5 : pressed ? 0.85 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          width: fullWidth ? '100%' : undefined,
        },
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={labelColor} />
      ) : typeof children === 'string' ? (
        <FText
          size={fontSize}
          weight="semibold"
          themed={false}
          style={[{ color: labelColor }, textStyle]}
        >
          {children}
        </FText>
      ) : (
        children
      )}
    </Pressable>
  );
}
