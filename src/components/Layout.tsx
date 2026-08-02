import React from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';
import { rp } from '../responsive/responsive';
import { flex } from '../flex/flex';

export interface RowProps extends ViewProps {
  gap?: number;
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  wrap?: boolean;
}

/** @example <Row gap={12} justify="space-between"><A /><B /></Row> */
export function Row({
  gap,
  align = 'center',
  justify = 'flex-start',
  wrap = false,
  style,
  children,
  ...rest
}: RowProps): React.JSX.Element {
  const rowStyle: ViewStyle = {
    ...flex.row,
    alignItems: align,
    justifyContent: justify,
    ...(wrap && { flexWrap: 'wrap' }),
    ...(gap !== undefined && { gap: rp(gap) }),
  };
  return (
    <View style={[rowStyle, style]} {...rest}>
      {children}
    </View>
  );
}

export interface ColumnProps extends ViewProps {
  gap?: number;
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
}

/** @example <Column gap={8}><A /><B /></Column> */
export function Column({
  gap,
  align = 'stretch',
  justify = 'flex-start',
  style,
  children,
  ...rest
}: ColumnProps): React.JSX.Element {
  const columnStyle: ViewStyle = {
    ...flex.column,
    alignItems: align,
    justifyContent: justify,
    ...(gap !== undefined && { gap: rp(gap) }),
  };
  return (
    <View style={[columnStyle, style]} {...rest}>
      {children}
    </View>
  );
}

export interface SpacerProps {
  /** Responsive size, used for both width and height unless axis is set. */
  size: number;
  axis?: 'horizontal' | 'vertical' | 'both';
}

/** @example <Spacer size={20} /> or <Spacer size={20} axis="horizontal" /> */
export function Spacer({ size, axis = 'both' }: SpacerProps): React.JSX.Element {
  const scaled = rp(size);
  const style: ViewStyle = {
    ...(axis !== 'horizontal' && { height: scaled }),
    ...(axis !== 'vertical' && { width: scaled }),
  };
  return <View style={style} />;
}
