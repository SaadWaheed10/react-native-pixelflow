export type FoldPosture =
  | 'flat'
  | 'halfOpened'
  | 'closed'
  | 'tabletop'
  | 'book'
  | 'unknown';

export interface FoldState {
  /** Whether a foldable hinge / dual-pane posture is active. */
  isFolded: boolean;
  posture: FoldPosture;
  /**
   * Hinge / occlusion bounds in window coordinates when known.
   * Optional — native bridges can fill this in.
   */
  hinge?: { x: number; y: number; width: number; height: number };
  /** True when state came from `setFoldState` (native), not the heuristic. */
  isNative: boolean;
}

const DEFAULT_STATE: FoldState = {
  isFolded: false,
  posture: 'unknown',
  isNative: false,
};

let current: FoldState = { ...DEFAULT_STATE };
const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((l) => l());
}

/**
 * Inject fold / hinge posture from a native module (Jetpack WindowManager, etc.).
 * Call whenever posture changes; do **not** remount the RN root.
 */
export function setFoldState(partial: Partial<FoldState>): FoldState {
  current = {
    ...current,
    ...partial,
    isNative: true,
  };
  emit();
  return current;
}

export function getFoldState(): FoldState {
  return current;
}

export function subscribeFoldState(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function resetFoldState(): void {
  current = { ...DEFAULT_STATE };
  emit();
}
