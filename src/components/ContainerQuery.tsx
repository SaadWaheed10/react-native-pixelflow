import React from 'react';
import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import {
  useContainerSize,
  type UseContainerSizeResult,
} from '../hooks/useContainerSize';
import type { WindowWidthClass } from '../types';

export interface ContainerQueryProps extends Omit<ViewProps, 'children'> {
  children:
    | React.ReactNode
    | ((size: UseContainerSizeResult) => React.ReactNode);
  style?: StyleProp<ViewStyle>;
  /** Optional initial width hint before first layout. */
  initialWidth?: number;
}

/**
 * View that exposes container-query measurements to children via render prop.
 *
 * @example
 * <ContainerQuery>
 *   {(box) => (
 *     <AdaptiveStack direction={box.meets('medium') ? 'row' : 'column'} />
 *   )}
 * </ContainerQuery>
 */
export function ContainerQuery({
  children,
  style,
  initialWidth,
  ...rest
}: ContainerQueryProps): React.JSX.Element {
  const size = useContainerSize(
    initialWidth !== undefined ? { width: initialWidth } : undefined,
  );

  return (
    <View style={[{ width: '100%' }, style]} onLayout={size.onLayout} {...rest}>
      {typeof children === 'function' ? children(size) : children}
    </View>
  );
}

export type { WindowWidthClass };
