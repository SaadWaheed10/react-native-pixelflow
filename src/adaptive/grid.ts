import { useMemo } from 'react';
import { useScalingSnapshot } from '../hooks/useScaling';
import { rp } from '../responsive/responsive';

export interface UseGridOptions {
  /** Minimum width for each cell (design px, passed through `rp`). */
  minItemWidth: number;
  /** Gap between cells (design px). Default 12. */
  gap?: number;
  /** Cap column count. */
  maxColumns?: number;
  /** Horizontal container padding to subtract from available width (design px). */
  padding?: number;
  /**
   * Override available width (defaults to window width).
   * Useful inside a constrained parent.
   */
  containerWidth?: number;
}

export interface UseGridResult {
  columns: number;
  /** Computed cell width in px (gap accounted for). */
  itemWidth: number;
  /** Scaled gap. */
  gap: number;
  /** Available width used for the calculation. */
  width: number;
}

/**
 * Compute a responsive column count from “fit as many items as possible
 * above `minItemWidth`” — the usual product-card FlatList pattern.
 *
 * @example
 * const { columns, itemWidth, gap } = useGrid({ minItemWidth: 160, gap: 12 });
 * <FlatList numColumns={columns} key={columns} ... />
 */
export function computeGrid(
  availableWidth: number,
  options: UseGridOptions,
): UseGridResult {
  const gapDesign = options.gap ?? 12;
  const paddingDesign = options.padding ?? 0;
  const gap = rp(gapDesign);
  const padding = rp(paddingDesign) * 2;
  const minItem = rp(options.minItemWidth);
  const width = Math.max(0, availableWidth - padding);

  let columns = Math.max(1, Math.floor((width + gap) / (minItem + gap)));
  if (options.maxColumns !== undefined) {
    columns = Math.min(columns, Math.max(1, options.maxColumns));
  }

  const itemWidth =
    columns <= 1 ? width : (width - gap * (columns - 1)) / columns;

  return {
    columns,
    itemWidth: Math.max(0, itemWidth),
    gap,
    width,
  };
}

export function useGrid(options: UseGridOptions): UseGridResult {
  const snapshot = useScalingSnapshot();
  const available = options.containerWidth ?? snapshot.width;

  return useMemo(
    () => computeGrid(available, options),
    [
      available,
      options.minItemWidth,
      options.gap,
      options.maxColumns,
      options.padding,
      snapshot.width,
      snapshot.height,
      snapshot.fontScale,
      snapshot.scale,
    ],
  );
}
