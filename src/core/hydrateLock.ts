/**
 * SSR / first-paint hydration lock — freezes the reported window size until
 * the client hydrates so Expo Router web doesn't flash wrong scales.
 */

let locked = false;
let lockedWidth: number | null = null;
let lockedHeight: number | null = null;
const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((l) => l());
}

export function setHydrateLock(options: {
  width: number;
  height: number;
  /** Auto-release after ms. Default 0 = manual unlock only. */
  ttlMs?: number;
}): void {
  locked = true;
  lockedWidth = options.width;
  lockedHeight = options.height;
  emit();
  if (options.ttlMs && options.ttlMs > 0) {
    setTimeout(() => {
      clearHydrateLock();
    }, options.ttlMs);
  }
}

export function clearHydrateLock(): void {
  if (!locked) return;
  locked = false;
  lockedWidth = null;
  lockedHeight = null;
  emit();
}

export function getHydrateLock(): {
  locked: boolean;
  width: number | null;
  height: number | null;
} {
  return { locked, width: lockedWidth, height: lockedHeight };
}

export function subscribeHydrateLock(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Apply lock overrides to a live window size. */
export function applyHydrateLock(
  width: number,
  height: number,
): { width: number; height: number } {
  if (locked && lockedWidth != null && lockedHeight != null) {
    return { width: lockedWidth, height: lockedHeight };
  }
  return { width, height };
}
