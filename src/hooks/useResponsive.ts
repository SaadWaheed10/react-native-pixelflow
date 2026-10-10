import { useCallback } from 'react';
import { useScalingSnapshot } from './useScaling';
import { selectForDevice } from '../responsive/responsive';
import type { ResponsiveByDevice, ScalingSnapshot } from '../types';

export interface UseResponsiveResult extends ScalingSnapshot {
  /**
   * Pick a value for the current device class.
   * @example const columns = select({ phone: 1, tablet: 2, foldable: 2 });
   */
  select: <T>(values: ResponsiveByDevice<T>) => T;
}

/**
 * Live, re-render-on-change access to screen dimensions and device
 * classification. Backed by the same singleton engine that powers
 * rw/rh/rf/etc., so values are always consistent with your styles.
 * @example
 * const { width, height, isTablet, isLandscape, select, scale } = useResponsive();
 */
export function useResponsive(): UseResponsiveResult {
  const snapshot = useScalingSnapshot();

  const select = useCallback(
    <T,>(values: ResponsiveByDevice<T>): T =>
      selectForDevice(snapshot.deviceType, values),
    [snapshot.deviceType],
  );

  return {
    ...snapshot,
    select,
  };
}
