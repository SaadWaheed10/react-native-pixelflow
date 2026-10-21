import { useMemo } from 'react';
import { useScalingSnapshot } from './useScaling';
import {
  createScaleContext,
  type ScaleContext,
} from '../responsive/workletSafe';

/**
 * Stable scale context for Reanimated worklets / shared values.
 * Recomputes when window / config changes — pass into `rfWith` / `rpWith`.
 *
 * @example
 * const ctx = useScaleContext();
 * const style = useAnimatedStyle(() => ({
 *   padding: rpWith(ctx, 16),
 * }));
 */
export function useScaleContext(): ScaleContext {
  const snapshot = useScalingSnapshot();
  return useMemo(
    () => createScaleContext(snapshot),
    [
      snapshot.width,
      snapshot.height,
      snapshot.deviceType,
      snapshot.fontScale,
      snapshot.scale,
    ],
  );
}
