export interface SafeInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

const ZERO: SafeInsets = { top: 0, bottom: 0, left: 0, right: 0 };

let insets: SafeInsets = { ...ZERO };
const listeners = new Set<() => void>();

/** Used by PixelFlowProvider to keep `rsw` / `rsh` in sync with SafeArea. */
export function setSafeInsets(next: SafeInsets): void {
  if (
    next.top === insets.top &&
    next.bottom === insets.bottom &&
    next.left === insets.left &&
    next.right === insets.right
  ) {
    return;
  }
  insets = { ...next };
  listeners.forEach((l) => l());
}

export function getSafeInsets(): SafeInsets {
  return insets;
}

export function subscribeSafeInsets(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function resetSafeInsets(): void {
  insets = { ...ZERO };
}
