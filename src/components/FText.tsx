import React from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';
import { rf, rl } from '../responsive/responsive';
import { fonts } from '../fonts/fonts';
import { useTheme } from '../theme/ThemeProvider';
import type { FontWeightKey } from '../types';

export interface FTextProps extends TextProps {
  /** Responsive font size. Default 15. */
  size?: number;
  /** Font family key from `fonts` (e.g. "inter", "poppins"). Default "inter". */
  family?: keyof typeof fonts;
  /** Weight key resolved against the chosen family. Default "regular". */
  weight?: FontWeightKey;
  /** Explicit line height; defaults to size * 1.4, responsively scaled. */
  lineHeight?: number;
  /** Use theme text color unless overridden by `style.color`. Default true. */
  themed?: boolean;
  /** Use theme secondary color instead of primary text color. */
  secondary?: boolean;
}

/**
 * Fully responsive Text — font size, family, and weight resolved
 * automatically.
 * @example <FText size={16} family="inter" weight="semibold">Hello</FText>
 */
export function FText({
  size = 15,
  family = 'inter',
  weight = 'regular',
  lineHeight,
  themed = true,
  secondary = false,
  style,
  children,
  ...rest
}: FTextProps): React.JSX.Element {
  const theme = useTheme();
  const familyMap = fonts[family];
  const fontFamily = familyMap[weight] ?? familyMap.regular;

  const textStyle: TextStyle = {
    fontSize: rf(size),
    lineHeight: rl(lineHeight ?? Math.round(size * 1.4)),
    fontFamily,
    ...(themed && {
      color: secondary ? theme.colors.textSecondary : theme.colors.text,
    }),
  };

  return (
    <Text style={[textStyle, style]} {...rest}>
      {children}
    </Text>
  );
}
