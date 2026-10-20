import React from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';
import { useScalingVersion } from '../hooks/useScaling';
import { useWindowClass, windowClassMeets } from '../adaptive/windowClass';
import {
  resolveSpacing,
  type SpacingInput,
} from '../tokens/resolveTokens';
import { useTheme } from '../theme/ThemeProvider';
import type { WindowWidthClass } from '../types';

export interface StackProps extends ViewProps {
  /** flexDirection. Default `column`. */
  direction?: 'row' | 'column';
  gap?: SpacingInput;
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  wrap?: boolean;
  flex?: number;
}

/**
 * Flexible stack with tokenized gap.
 * @example <Stack gap="md"><A /><B /></Stack>
 */
export function Stack({
  direction = 'column',
  gap,
  align = direction === 'row' ? 'center' : 'stretch',
  justify = 'flex-start',
  wrap = false,
  flex,
  style,
  children,
  ...rest
}: StackProps): React.JSX.Element {
  useScalingVersion();
  const theme = useTheme();

  const stackStyle: ViewStyle = {
    flexDirection: direction,
    alignItems: align,
    justifyContent: justify,
    ...(wrap && { flexWrap: 'wrap' }),
    ...(flex !== undefined && { flex }),
    ...(gap !== undefined && { gap: resolveSpacing(gap, theme) }),
  };

  return (
    <View style={[stackStyle, style]} {...rest}>
      {children}
    </View>
  );
}

/** Horizontal stack. */
export function HStack(props: Omit<StackProps, 'direction'>): React.JSX.Element {
  return <Stack {...props} direction="row" />;
}

/** Vertical stack. */
export function VStack(props: Omit<StackProps, 'direction'>): React.JSX.Element {
  return <Stack {...props} direction="column" />;
}

export interface AdaptiveStackProps extends Omit<StackProps, 'direction'> {
  /**
   * From this window class up, layout is row; below it, column.
   * Default `medium`.
   */
  breakpoint?: WindowWidthClass | number;
  /** Invert: row below breakpoint, column above. */
  invert?: boolean;
}

/**
 * Column on phones, row from `breakpoint` up (or inverted).
 *
 * @example
 * <AdaptiveStack gap="md" breakpoint="medium">
 *   <Avatar /><Meta />
 * </AdaptiveStack>
 */
export function AdaptiveStack({
  breakpoint = 'medium',
  invert = false,
  ...rest
}: AdaptiveStackProps): React.JSX.Element {
  const { width, widthClass } = useWindowClass();
  const isWide =
    typeof breakpoint === 'number'
      ? width >= breakpoint
      : windowClassMeets(widthClass, breakpoint);
  const direction: 'row' | 'column' = invert
    ? isWide
      ? 'column'
      : 'row'
    : isWide
      ? 'row'
      : 'column';

  return <Stack {...rest} direction={direction} />;
}
