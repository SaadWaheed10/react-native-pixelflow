import { useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { useGrid, type UseGridOptions } from '../adaptive/grid';

export interface UseListLayoutOptions extends UseGridOptions {}

export interface UseListLayoutResult {
  columns: number;
  itemWidth: number;
  gap: number;
  width: number;
  /**
   * Spread onto FlatList when columns > 1.
   * Remember `key={String(columns)}` so FlatList remounts on column change.
   */
  columnWrapperStyle: StyleProp<ViewStyle> | undefined;
  /** FlatList-friendly props bundle. */
  flatListProps: {
    numColumns: number;
    columnWrapperStyle?: StyleProp<ViewStyle>;
    key: string;
  };
}

/**
 * FlatList / FlashList helpers built on `useGrid`.
 *
 * @example
 * const list = useListLayout({ minItemWidth: 160, gap: 12 });
 * <FlatList {...list.flatListProps} data={data} renderItem={…} />
 */
export function useListLayout(
  options: UseListLayoutOptions,
): UseListLayoutResult {
  const grid = useGrid(options);

  return useMemo(() => {
    const columnWrapperStyle =
      grid.columns > 1
        ? ({
            gap: grid.gap,
            paddingHorizontal: 0,
          } as ViewStyle)
        : undefined;

    return {
      ...grid,
      columnWrapperStyle,
      flatListProps: {
        numColumns: grid.columns,
        ...(columnWrapperStyle ? { columnWrapperStyle } : null),
        key: `cols-${grid.columns}`,
      },
    };
  }, [grid]);
}
