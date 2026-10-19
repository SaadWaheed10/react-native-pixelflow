import React, { useMemo } from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';
import { rf, rl } from '../responsive/responsive';
import { fonts } from '../fonts/fonts';
import { useTheme } from '../theme/ThemeProvider';
import { useScalingVersion } from '../hooks/useScaling';
import { getConfig } from '../core/config';
import { createTypography, type TypographyScale } from '../typography/typography';
import { resolveColor, type ColorInput } from '../tokens/resolveTokens';
import type { FontWeightKey } from '../types';
import type { FontFamilyName } from '../fonts/fontRegistry';

export type FTextVariant = keyof TypographyScale;

export interface FTextProps extends TextProps {
  /** Responsive font size. Ignored when `variant` sets fontSize. Default 15. */
  size?: number;
  /** Typography scale key: h1, body, caption, … */
  variant?: FTextVariant;
  /** Font family key from `fonts`. Default "inter". */
  family?: FontFamilyName;
  /** Weight key. Default "regular" (or variant's family weight). */
  weight?: FontWeightKey;
  /** Explicit line height; defaults to size * 1.4 when not using variant. */
  lineHeight?: number;
  /** Use theme text color unless overridden. Default true. */
  themed?: boolean;
  /** Use theme secondary color. */
  secondary?: boolean;
  /** Color token (`"primary"`) or raw color. */
  color?: ColorInput;
  /**
   * Cap RN font scaling when `allowFontScaling` is true.
   * Defaults to `configure({ maxFontSizeMultiplier })` (1.3).
   */
  maxFontSizeMultiplier?: number;
}

/**
 * Responsive Text with variants, color tokens, and accessibility caps.
 *
 * @example
 * <FText variant="h2" color="primary">Title</FText>
 * <FText size={16} weight="semibold" maxFontSizeMultiplier={1.2}>Hi</FText>
 */
export function FText({
  size = 15,
  variant,
  family = 'inter',
  weight = 'regular',
  lineHeight,
  themed = true,
  secondary = false,
  color,
  allowFontScaling,
  maxFontSizeMultiplier,
  style,
  children,
  ...rest
}: FTextProps): React.JSX.Element {
  const version = useScalingVersion();
  const theme = useTheme();
  const config = getConfig();

  const textStyle = useMemo((): TextStyle => {
    const typeScale = createTypography(family);
    const variantStyle = variant ? typeScale[variant] : undefined;
    const familyMap = fonts[family];
    const fontFamily =
      (variantStyle?.fontFamily as string | undefined) ??
      familyMap[weight] ??
      familyMap.regular ??
      fonts.inter.regular;

    const resolvedColor =
      color !== undefined
        ? resolveColor(color, theme)
        : themed
          ? secondary
            ? theme.colors.textSecondary
            : theme.colors.text
          : undefined;

    return {
      ...variantStyle,
      ...(variant === undefined && {
        fontSize: rf(size),
        lineHeight: rl(lineHeight ?? Math.round(size * 1.4)),
        fontFamily,
      }),
      ...(variant !== undefined && weight !== 'regular'
        ? { fontFamily: familyMap[weight] ?? fontFamily }
        : null),
      ...(variant !== undefined && lineHeight !== undefined
        ? { lineHeight: rl(lineHeight) }
        : null),
      ...(resolvedColor !== undefined && { color: resolvedColor }),
    };
  }, [
    version,
    theme,
    family,
    variant,
    weight,
    size,
    lineHeight,
    themed,
    secondary,
    color,
  ]);

  const applyA11y = config.applyAccessibilityFontScale;
  const resolvedAllowFontScaling =
    allowFontScaling !== undefined ? allowFontScaling : !applyA11y;
  const resolvedMaxMultiplier =
    maxFontSizeMultiplier ?? config.maxFontSizeMultiplier;

  return (
    <Text
      allowFontScaling={resolvedAllowFontScaling}
      maxFontSizeMultiplier={
        resolvedAllowFontScaling ? resolvedMaxMultiplier : undefined
      }
      style={[textStyle, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}
