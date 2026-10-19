import React, { Children } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useGrid, type UseGridOptions } from '../adaptive/grid';

export interface GridProps extends UseGridOptions {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Style applied to each cell wrapper. */
  itemStyle?: StyleProp<ViewStyle>;
}

/**
 * Wrapping flex grid sized from `minItemWidth` + `gap`.
 *
 * @example
 * <Grid minItemWidth={160} gap={12}>
 *   {products.map((p) => <ProductCard key={p.id} {...p} />)}
 * </Grid>
 */
export function Grid({
  children,
  style,
  itemStyle,
  minItemWidth,
  gap = 12,
  maxColumns,
  padding,
  containerWidth,
}: GridProps): React.JSX.Element {
  const { itemWidth, gap: scaledGap } = useGrid({
    minItemWidth,
    gap,
    maxColumns,
    padding,
    containerWidth,
  });

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: scaledGap,
        },
        style,
      ]}
    >
      {Children.map(children, (child, index) => {
        if (child == null || child === false) return null;
        return (
          <View key={index} style={[{ width: itemWidth }, itemStyle]}>
            {child}
          </View>
        );
      })}
    </View>
  );
}
