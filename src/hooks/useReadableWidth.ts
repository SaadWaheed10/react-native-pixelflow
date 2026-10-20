import { useMemo } from 'react';
import { useScalingSnapshot } from './useScaling';
import { useWindowClass } from '../adaptive/windowClass';
import { rf } from '../responsive/responsive';
import { clamp } from '../responsive/clamp';

export interface UseReadableWidthOptions {
  /**
   * Target characters per line (typographic measure).
   * Default 65 (comfortable reading).
   */
  chars?: number;
  /**
   * Assumed average character width as a fraction of font size.
   * Default 0.5 (Latin UI text approximation).
   */
  charWidthRatio?: number;
  /** Font size used for the estimate (design px → `rf`). Default 16. */
  fontSize?: number;
  /**
   * Hard max width in dp. Defaults to window `contentMaxWidth`.
   */
  maxWidth?: number;
  /** Hard min width in dp. Default 280. */
  minWidth?: number;
}

export interface UseReadableWidthResult {
  /** Suggested content width for readable body text. */
  width: number;
  /** Same as width — alias for style props. */
  maxWidth: number;
  chars: number;
}

/**
 * Cap line length for articles / settings so iPad doesn’t stretch body text.
 *
 * @example
 * const { maxWidth } = useReadableWidth({ chars: 65 });
 * <View style={{ maxWidth, alignSelf: 'center', width: '100%' }} />
 */
export function useReadableWidth(
  options: UseReadableWidthOptions = {},
): UseReadableWidthResult {
  const {
    chars = 65,
    charWidthRatio = 0.5,
    fontSize = 16,
    maxWidth: maxWidthOpt,
    minWidth = 280,
  } = options;
  const snapshot = useScalingSnapshot();
  const { contentMaxWidth, width: windowWidth } = useWindowClass();

  return useMemo(() => {
    const glyph = rf(fontSize) * charWidthRatio;
    const ideal = chars * glyph;
    const cap = maxWidthOpt ?? contentMaxWidth;
    const width = clamp(ideal, minWidth, Math.min(cap, windowWidth));
    return { width, maxWidth: width, chars };
  }, [
    chars,
    charWidthRatio,
    fontSize,
    maxWidthOpt,
    minWidth,
    contentMaxWidth,
    windowWidth,
    snapshot.scale,
    snapshot.fontScale,
    snapshot.width,
  ]);
}

/**
 * Approximate `Nch` CSS unit as pixels for the current font scale.
 * @example maxWidth: maxCh(65)
 */
export function maxCh(
  chars: number,
  fontSize = 16,
  charWidthRatio = 0.5,
): number {
  return rf(fontSize) * charWidthRatio * chars;
}
