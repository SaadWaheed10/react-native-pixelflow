import React, { useMemo } from 'react';
import { View, type FlexStyle, type ViewProps, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useScalingVersion } from '../hooks/useScaling';
import {
  resolveColor,
  resolveRadius,
  resolveSpacing,
  type ColorInput,
  type RadiusInput,
  type SpacingInput,
} from '../tokens/resolveTokens';
import { resolveResponsiveValue } from '../responsive/resolveValue';
import type { ResponsiveValue } from '../types';

export interface BoxProps extends ViewProps {
  /** Padding — number, spacing token (`"md"`), or responsive map/tuple. */
  p?: SpacingInput;
  px?: SpacingInput;
  py?: SpacingInput;
  pt?: SpacingInput;
  pb?: SpacingInput;
  pl?: SpacingInput;
  pr?: SpacingInput;
  /** Logical padding start (RTL-aware via `paddingStart`). */
  ps?: SpacingInput;
  /** Logical padding end (RTL-aware via `paddingEnd`). */
  pe?: SpacingInput;
  /** Margin — number, spacing token, or responsive. */
  m?: SpacingInput;
  mx?: SpacingInput;
  my?: SpacingInput;
  mt?: SpacingInput;
  mb?: SpacingInput;
  ml?: SpacingInput;
  mr?: SpacingInput;
  /** Logical margin start / end (RTL-aware). */
  ms?: SpacingInput;
  me?: SpacingInput;
  /** Gap (flex). */
  gap?: SpacingInput;
  /** Border radius — number, radius token (`"lg"`), or responsive. */
  radius?: RadiusInput;
  /** Background — color token (`"surface"`) or raw color, or responsive. */
  bg?: ColorInput;
  /** Border color token / raw. */
  borderColor?: ColorInput;
  borderWidth?: number;
  flex?: number;
  flexDirection?: ResponsiveValue<FlexStyle['flexDirection']>;
  align?: ResponsiveValue<FlexStyle['alignItems']>;
  justify?: ResponsiveValue<FlexStyle['justifyContent']>;
  wrap?: boolean;
}

/**
 * Layout primitive with design tokens + responsive props.
 *
 * @example
 * <Box p="md" px={{ compact: 'sm', medium: 'lg' }} bg="surface" radius="lg" />
 * <Box p={16} bg="#fff" />
 */
export function Box({
  p,
  px,
  py,
  pt,
  pb,
  pl,
  pr,
  ps,
  pe,
  m,
  mx,
  my,
  mt,
  mb,
  ml,
  mr,
  ms,
  me,
  gap,
  radius,
  bg,
  borderColor,
  borderWidth,
  flex,
  flexDirection,
  align,
  justify,
  wrap,
  style,
  children,
  ...rest
}: BoxProps): React.JSX.Element {
  const version = useScalingVersion();
  const theme = useTheme();

  const boxStyle = useMemo((): ViewStyle => {
    const resolved: ViewStyle = {
      ...(p !== undefined && { padding: resolveSpacing(p, theme) }),
      ...(px !== undefined && { paddingHorizontal: resolveSpacing(px, theme) }),
      ...(py !== undefined && { paddingVertical: resolveSpacing(py, theme) }),
      ...(pt !== undefined && { paddingTop: resolveSpacing(pt, theme) }),
      ...(pb !== undefined && { paddingBottom: resolveSpacing(pb, theme) }),
      ...(pl !== undefined && { paddingLeft: resolveSpacing(pl, theme) }),
      ...(pr !== undefined && { paddingRight: resolveSpacing(pr, theme) }),
      ...(ps !== undefined && { paddingStart: resolveSpacing(ps, theme) }),
      ...(pe !== undefined && { paddingEnd: resolveSpacing(pe, theme) }),
      ...(m !== undefined && { margin: resolveSpacing(m, theme) }),
      ...(mx !== undefined && { marginHorizontal: resolveSpacing(mx, theme) }),
      ...(my !== undefined && { marginVertical: resolveSpacing(my, theme) }),
      ...(mt !== undefined && { marginTop: resolveSpacing(mt, theme) }),
      ...(mb !== undefined && { marginBottom: resolveSpacing(mb, theme) }),
      ...(ml !== undefined && { marginLeft: resolveSpacing(ml, theme) }),
      ...(mr !== undefined && { marginRight: resolveSpacing(mr, theme) }),
      ...(ms !== undefined && { marginStart: resolveSpacing(ms, theme) }),
      ...(me !== undefined && { marginEnd: resolveSpacing(me, theme) }),
      ...(gap !== undefined && { gap: resolveSpacing(gap, theme) }),
      ...(radius !== undefined && { borderRadius: resolveRadius(radius, theme) }),
      ...(bg !== undefined && { backgroundColor: resolveColor(bg, theme) }),
      ...(borderColor !== undefined && {
        borderColor: resolveColor(borderColor, theme),
      }),
      ...(borderWidth !== undefined && { borderWidth }),
      ...(flex !== undefined && { flex }),
      ...(flexDirection !== undefined && {
        flexDirection: resolveResponsiveValue(flexDirection),
      }),
      ...(align !== undefined && {
        alignItems: resolveResponsiveValue(align),
      }),
      ...(justify !== undefined && {
        justifyContent: resolveResponsiveValue(justify),
      }),
      ...(wrap && { flexWrap: 'wrap' }),
    };
    return resolved;
    // version + theme drive recomputation of rp/token resolution
  }, [
    version,
    theme,
    p,
    px,
    py,
    pt,
    pb,
    pl,
    pr,
    ps,
    pe,
    m,
    mx,
    my,
    mt,
    mb,
    ml,
    mr,
    ms,
    me,
    gap,
    radius,
    bg,
    borderColor,
    borderWidth,
    flex,
    flexDirection,
    align,
    justify,
    wrap,
  ]);

  return (
    <View style={[boxStyle, style]} {...rest}>
      {children}
    </View>
  );
}
