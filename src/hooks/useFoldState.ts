import { useMemo, useSyncExternalStore } from 'react';
import {
  getFoldState,
  subscribeFoldState,
  type FoldState,
  type FoldPosture,
} from '../core/foldState';
import { useScalingSnapshot } from './useScaling';

export type { FoldState, FoldPosture };

export interface UseFoldStateResult extends FoldState {
  /**
   * Suggested layout for tabletop / half-open: media on top, controls below.
   */
  preferTabletopSplit: boolean;
  /** Heuristic: near-square large window without native fold data. */
  isLikelyFoldable: boolean;
}

/**
 * Fold / hinge posture. Prefer wiring a native bridge via `setFoldState`;
 * without it, falls back to device-type + aspect heuristics.
 *
 * @example
 * const { posture, preferTabletopSplit } = useFoldState();
 * if (preferTabletopSplit) return <TabletopShell />;
 */
export function useFoldState(): UseFoldStateResult {
  const native = useSyncExternalStore(
    subscribeFoldState,
    getFoldState,
    getFoldState,
  );
  const snapshot = useScalingSnapshot();

  return useMemo(() => {
    const isLikelyFoldable = snapshot.isFoldable;
    const aspect =
      Math.max(snapshot.width, snapshot.height) /
      Math.max(1, Math.min(snapshot.width, snapshot.height));

    if (native.isNative) {
      return {
        ...native,
        preferTabletopSplit:
          native.posture === 'tabletop' || native.posture === 'halfOpened',
        isLikelyFoldable: native.isFolded || isLikelyFoldable,
      };
    }

    // Heuristic only — never invent hinge geometry.
    const posture: FoldPosture = isLikelyFoldable
      ? aspect < 1.35 && snapshot.isLandscape
        ? 'book'
        : 'flat'
      : 'unknown';

    return {
      isFolded: false,
      posture,
      hinge: undefined,
      isNative: false,
      preferTabletopSplit: false,
      isLikelyFoldable,
    };
  }, [native, snapshot]);
}
