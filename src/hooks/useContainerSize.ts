import { useCallback, useMemo, useState } from 'react';
import type { LayoutChangeEvent, LayoutRectangle } from 'react-native';
import {
  getWindowWidthClass,
  windowClassMeets,
  type WindowWidthClass,
} from '../adaptive/windowClass';

export interface UseContainerSizeResult {
  width: number;
  height: number;
  x: number;
  y: number;
  /** Material window class for *this* container’s width. */
  widthClass: WindowWidthClass;
  /** True once the first onLayout has fired. */
  measured: boolean;
  meets: (minimum: WindowWidthClass) => boolean;
  /** Spread onto a View: `<View onLayout={onLayout}>`. */
  onLayout: (event: LayoutChangeEvent) => void;
}

/**
 * Measure a parent View and derive a local window class (container query).
 *
 * @example
 * const box = useContainerSize();
 * <View onLayout={box.onLayout}>
 *   {box.meets('medium') ? <Row /> : <Column />}
 * </View>
 */
export function useContainerSize(
  initial?: Partial<LayoutRectangle>,
): UseContainerSizeResult {
  const [layout, setLayout] = useState({
    width: initial?.width ?? 0,
    height: initial?.height ?? 0,
    x: initial?.x ?? 0,
    y: initial?.y ?? 0,
    measured: initial?.width !== undefined,
  });

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height, x, y } = event.nativeEvent.layout;
    setLayout((prev) => {
      if (
        prev.measured &&
        prev.width === width &&
        prev.height === height &&
        prev.x === x &&
        prev.y === y
      ) {
        return prev;
      }
      return { width, height, x, y, measured: true };
    });
  }, []);

  return useMemo(() => {
    const widthClass = getWindowWidthClass(layout.width);
    return {
      width: layout.width,
      height: layout.height,
      x: layout.x,
      y: layout.y,
      widthClass,
      measured: layout.measured,
      meets: (minimum: WindowWidthClass) =>
        windowClassMeets(widthClass, minimum),
      onLayout,
    };
  }, [layout, onLayout]);
}
