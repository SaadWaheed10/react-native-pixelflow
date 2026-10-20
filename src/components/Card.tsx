import React, { useMemo } from 'react';
import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useScalingVersion } from '../hooks/useScaling';
import { hairline } from '../layout/helpers';
import { shadow, type ShadowLevel } from '../layout/shadow';
import {
  resolveColor,
  resolveRadius,
  resolveSpacing,
  type ColorInput,
  type RadiusInput,
  type SpacingInput,
} from '../tokens/resolveTokens';

export interface CardProps extends ViewProps {
  p?: SpacingInput;
  px?: SpacingInput;
  py?: SpacingInput;
  radius?: RadiusInput;
  bg?: ColorInput;
  borderColor?: ColorInput;
  /** Show hairline border. Default true. */
  bordered?: boolean;
  /** Elevation level. Default `sm`. */
  elevation?: ShadowLevel;
  style?: StyleProp<ViewStyle>;
}

/**
 * Surface card with tokens + cross-platform shadow.
 *
 * @example <Card p="md" elevation="md">…</Card>
 */
export function Card({
  p = 'md',
  px,
  py,
  radius = 'lg',
  bg = 'surface',
  borderColor = 'border.default',
  bordered = true,
  elevation = 'sm',
  style,
  children,
  ...rest
}: CardProps): React.JSX.Element {
  useScalingVersion();
  const theme = useTheme();

  const cardStyle = useMemo((): ViewStyle => {
    const backgroundColor = resolveColor(bg, theme) ?? theme.colors.surface;
    return {
      backgroundColor,
      borderRadius: resolveRadius(radius, theme),
      ...(p !== undefined && { padding: resolveSpacing(p, theme) }),
      ...(px !== undefined && { paddingHorizontal: resolveSpacing(px, theme) }),
      ...(py !== undefined && { paddingVertical: resolveSpacing(py, theme) }),
      ...(bordered && {
        borderWidth: hairline,
        borderColor: resolveColor(borderColor, theme) ?? theme.colors.border,
      }),
      ...shadow(elevation, { backgroundColor }),
    };
  }, [theme, p, px, py, radius, bg, borderColor, bordered, elevation]);

  return (
    <View style={[cardStyle, style]} {...rest}>
      {children}
    </View>
  );
}
