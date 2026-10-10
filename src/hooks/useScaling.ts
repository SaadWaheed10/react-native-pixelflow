import { useSyncExternalStore } from 'react';
import { scalingEngine } from '../core/scalingEngine';
import type { ScalingSnapshot } from '../types';

/**
 * Subscribe to the scaling engine. Re-renders when window size, orientation,
 * device class, font scale, or `configure()` changes.
 */
export function useScalingSnapshot(): ScalingSnapshot {
  return useSyncExternalStore(
    (onStoreChange) => scalingEngine.subscribe(onStoreChange),
    () => scalingEngine.getSnapshot(),
    () => scalingEngine.getSnapshot(),
  );
}

/**
 * Monotonic version that bumps whenever scaled values should recompute.
 * Prefer this as a `useMemo` dependency when calling `rf`/`rp` in factories.
 */
export function useScalingVersion(): number {
  return useSyncExternalStore(
    (onStoreChange) => scalingEngine.subscribe(onStoreChange),
    () => scalingEngine.getVersion(),
    () => scalingEngine.getVersion(),
  );
}
