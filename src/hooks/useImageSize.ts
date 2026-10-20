import { useMemo } from 'react';
import { useScalingSnapshot } from './useScaling';
import { useWindowClass } from '../adaptive/windowClass';
import { ri } from '../responsive/responsive';
import { clamp } from '../responsive/clamp';
import { fluid } from '../responsive/fluid';
import type { WindowWidthClass } from '../types';
import { match } from '../responsive/match';

export interface UseImageSizeOptions {
  /** Design-size base (phone). Default 120. */
  base?: number;
  /** Absolute max edge length in px after scaling. Default 200. */
  max?: number;
  /** Absolute min edge. Default 64. */
  min?: number;
  /**
   * Optional per-window overrides (design px).
   * @example sizes: { compact: 96, medium: 140, expanded: 180 }
   */
  sizes?: Partial<Record<WindowWidthClass, number>>;
  /** Use fluid interpolation instead of icon scale. Default true when no `sizes`. */
  fluid?: boolean;
}

export interface UseImageSizeResult {
  /** Square edge length. */
  size: number;
  width: number;
  height: number;
  /** Spread onto Image / View. */
  style: { width: number; height: number };
}

/**
 * Responsive avatar / thumbnail size that grows with window class but clamps.
 *
 * @example
 * const img = useImageSize({ base: 120, max: 200 });
 * <Image style={img.style} />
 */
export function useImageSize(
  options: UseImageSizeOptions = {},
): UseImageSizeResult {
  const {
    base = 120,
    max = 200,
    min = 64,
    sizes,
    fluid: useFluid = !sizes,
  } = options;
  const snapshot = useScalingSnapshot();
  const { widthClass, width } = useWindowClass();

  return useMemo(() => {
    let raw: number;
    if (sizes) {
      raw = match({ compact: base, ...sizes }, { widthClass });
      raw = ri(raw);
    } else if (useFluid) {
      raw = fluid(min, base, max, { width });
    } else {
      raw = ri(base);
    }
    const size = clamp(Math.round(raw), min, max);
    return {
      size,
      width: size,
      height: size,
      style: { width: size, height: size },
    };
  }, [
    base,
    max,
    min,
    sizes,
    useFluid,
    widthClass,
    width,
    snapshot.scale,
    snapshot.width,
  ]);
}
