import { useMemo } from 'react';
import { useScalingSnapshot } from './useScaling';
import type { Orientation } from '../types';

export interface UseOrientationResult {
  orientation: Orientation;
  isPortrait: boolean;
  isLandscape: boolean;
  width: number;
  height: number;
}

/**
 * Live orientation from the PixelFlow window snapshot.
 *
 * @example
 * const { isLandscape } = useOrientation();
 */
export function useOrientation(): UseOrientationResult {
  const snapshot = useScalingSnapshot();

  return useMemo(
    () => ({
      orientation: snapshot.orientation,
      isPortrait: snapshot.orientation === 'portrait',
      isLandscape: snapshot.orientation === 'landscape',
      width: snapshot.width,
      height: snapshot.height,
    }),
    [
      snapshot.orientation,
      snapshot.width,
      snapshot.height,
    ],
  );
}
