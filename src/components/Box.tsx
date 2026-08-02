import React from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';
import { rp, rm, rr } from '../responsive/responsive';

export interface BoxProps extends ViewProps {
  /** Padding, all sides (responsive). */
  p?: number;
  /** Padding horizontal (responsive). */
  px?: number;
  /** Padding vertical (responsive). */
  py?: number;
  /** Margin, all sides (responsive). */
  m?: number;
  /** Margin horizontal (responsive). */
  mx?: number;
  /** Margin vertical (responsive). */
  my?: number;
  /** Border radius (responsive). */
  radius?: number;
  /** Background color. */
  bg?: string;
  /** flex value. */
  flex?: number;
}

/**
 * @example <Box p={16} m={12} radius={10} bg="#fff" />
 */
export function Box({
  p,
  px,
  py,
  m,
  mx,
  my,
  radius,
  bg,
  flex,
  style,
  children,
  ...rest
}: BoxProps): React.JSX.Element {
  const boxStyle: ViewStyle = {
    ...(p !== undefined && { padding: rp(p) }),
    ...(px !== undefined && { paddingHorizontal: rp(px) }),
    ...(py !== undefined && { paddingVertical: rp(py) }),
    ...(m !== undefined && { margin: rm(m) }),
    ...(mx !== undefined && { marginHorizontal: rm(mx) }),
    ...(my !== undefined && { marginVertical: rm(my) }),
    ...(radius !== undefined && { borderRadius: rr(radius) }),
    ...(bg !== undefined && { backgroundColor: bg }),
    ...(flex !== undefined && { flex }),
  };

  return (
    <View style={[boxStyle, style]} {...rest}>
      {children}
    </View>
  );
}
