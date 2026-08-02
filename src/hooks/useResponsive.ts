import { useEffect, useState } from 'react';
import { scalingEngine } from '../core/scalingEngine';
import type { ScalingSnapshot } from '../types';

export interface UseResponsiveResult extends ScalingSnapshot {
  scale: number;
}

/**
 * Live, re-render-on-change access to screen dimensions and device
 * classification. Backed by the same singleton engine that powers
 * rw/rh/rf/etc., so values are always consistent with your styles.
 * @example
 * const { width, height, isTablet, isLandscape } = useResponsive();
 */
export function useResponsive(): UseResponsiveResult {
  const [snapshot, setSnapshot] = useState<ScalingSnapshot>(() =>
    scalingEngine.getSnapshot(),
  );

  useEffect(() => {
    const unsubscribe = scalingEngine.subscribe(setSnapshot);
    return unsubscribe;
  }, []);

  return {
    ...snapshot,
    scale: snapshot.width / 375,
  };
}
