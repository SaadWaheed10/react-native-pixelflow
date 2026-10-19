import { useMemo } from 'react';
import { getConfig } from '../core/config';
import { useScalingSnapshot } from './useScaling';
import type { A11yLayoutMode } from '../types';

export interface UseA11yLayoutResult {
  fontScale: number;
  isLargeText: boolean;
  isExtraLargeText: boolean;
  /** Suggested structural layout when Dynamic Type is large. */
  layout: A11yLayoutMode;
  /** Prefer column stacks for toolbars / chip rows. */
  preferStack: boolean;
  /** Suggested min touch / row height bump. */
  minControlHeight: number;
}

/**
 * Adapt *layout* (not only font size) when the user prefers larger text.
 *
 * @example
 * const { preferStack, layout } = useA11yLayout();
 * <View style={{ flexDirection: preferStack ? 'column' : 'row' }} />
 */
export function useA11yLayout(): UseA11yLayoutResult {
  const snapshot = useScalingSnapshot();
  const { a11yStackThreshold, maxFontScale } = getConfig();
  const { fontScale } = snapshot;

  return useMemo(() => {
    const isLargeText = fontScale >= 1.2;
    const isExtraLargeText = fontScale >= Math.min(1.6, maxFontScale);
    const preferStack = fontScale >= a11yStackThreshold;
    let layout: A11yLayoutMode = 'normal';
    if (preferStack) layout = 'stacked';
    else if (isLargeText) layout = 'comfortable';

    const minControlHeight =
      layout === 'stacked' ? 52 : layout === 'comfortable' ? 48 : 44;

    return {
      fontScale,
      isLargeText,
      isExtraLargeText,
      layout,
      preferStack,
      minControlHeight,
    };
  }, [fontScale, a11yStackThreshold, maxFontScale]);
}
