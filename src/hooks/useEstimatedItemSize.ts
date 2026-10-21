import { useMemo } from 'react';
import { useScalingSnapshot } from './useScaling';
import { useA11yLayout } from './useA11yLayout';
import { getConfig } from '../core/config';
import { rp, rf } from '../responsive/responsive';
import { getDensityMultiplier } from '../core/density';

export interface UseEstimatedItemSizeOptions {
  /** Base row/card height in design px. Default 72. */
  base?: number;
  /** Extra height when font scale / a11y is elevated. Default 12. */
  a11yExtra?: number;
  /** Include a text line estimate (`rf(fontSize) * lines`). */
  textLines?: number;
  fontSize?: number;
  /** Minimum / maximum clamp after scaling. */
  min?: number;
  max?: number;
}

export interface UseEstimatedItemSizeResult {
  /** Value for FlashList `estimatedItemSize` / FlatList getItemLayout. */
  estimatedItemSize: number;
  /** Alias. */
  size: number;
}

/**
 * Scaled list row estimate that tracks density + accessibility font scale.
 *
 * @example
 * const { estimatedItemSize } = useEstimatedItemSize({ base: 72 });
 * <FlashList estimatedItemSize={estimatedItemSize} … />
 */
export function useEstimatedItemSize(
  options: UseEstimatedItemSizeOptions = {},
): UseEstimatedItemSizeResult {
  const {
    base = 72,
    a11yExtra = 12,
    textLines = 0,
    fontSize = 15,
    min = 44,
    max = 400,
  } = options;
  const snapshot = useScalingSnapshot();
  const a11y = useA11yLayout();
  const config = getConfig();

  return useMemo(() => {
    let size = rp(base);
    if (textLines > 0) {
      size += rf(fontSize) * textLines;
    }
    if (a11y.layout !== 'normal' || snapshot.fontScale > 1.1) {
      size += rp(a11yExtra);
    }
    // Density already in rp; nudge spacious a bit more for list comfort
    if (config.density === 'spacious') {
      size += rp(4);
    }
    size = Math.round(Math.min(max, Math.max(min, size)));
    return { estimatedItemSize: size, size };
  }, [
    base,
    a11yExtra,
    textLines,
    fontSize,
    min,
    max,
    snapshot.fontScale,
    snapshot.scale,
    snapshot.width,
    a11y.layout,
    config.density,
  ]);
}

/** Non-hook helper for tests / getItemLayout factories. */
export function estimateItemSize(
  base: number,
  options: {
    fontScale?: number;
    density?: ReturnType<typeof getConfig>['density'];
    a11yExtra?: number;
  } = {},
): number {
  const density = getDensityMultiplier(options.density ?? getConfig().density);
  const fontBump =
    (options.fontScale ?? 1) > 1.1 ? (options.a11yExtra ?? 12) : 0;
  return Math.round(base * density + fontBump);
}
