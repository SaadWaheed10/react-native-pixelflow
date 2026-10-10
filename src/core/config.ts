/**
 * Runtime configuration for the scaling engine.
 * Call `configure()` once at app startup before rendering UI that depends on
 * responsive values.
 */

export interface PixelFlowConfig {
  /** Design frame width. Default 375 (iPhone 11 / common Figma phone). */
  baseWidth?: number;
  /** Design frame height. Default 812. */
  baseHeight?: number;
  /**
   * Lower clamp for OS accessibility font scale.
   * Default 0.85. Set equal to `maxFontScale` to disable clamping range.
   */
  minFontScale?: number;
  /**
   * Upper clamp for OS accessibility font scale.
   * Default 1.6. Raise if you want to honor larger Dynamic Type sizes.
   */
  maxFontScale?: number;
  /**
   * When true, `rf` / `rl` multiply by the OS font scale (clamped).
   * Pair with `allowFontScaling={false}` on Text (FText does this) so
   * React Native does not apply font scale a second time.
   * Default true.
   */
  applyAccessibilityFontScale?: boolean;
  /** How much tablets dampen linear width/height growth. Default 0.55. */
  tabletDamping?: number;
  /** How much foldables dampen linear growth. Default 0.65. */
  foldableDamping?: number;
}

export interface ResolvedPixelFlowConfig {
  baseWidth: number;
  baseHeight: number;
  minFontScale: number;
  maxFontScale: number;
  applyAccessibilityFontScale: boolean;
  tabletDamping: number;
  foldableDamping: number;
}

export const DEFAULT_CONFIG: ResolvedPixelFlowConfig = {
  baseWidth: 375,
  baseHeight: 812,
  minFontScale: 0.85,
  maxFontScale: 1.6,
  applyAccessibilityFontScale: true,
  tabletDamping: 0.55,
  foldableDamping: 0.65,
};

let current: ResolvedPixelFlowConfig = { ...DEFAULT_CONFIG };

export function getConfig(): ResolvedPixelFlowConfig {
  return current;
}

/**
 * Merge partial config into the active settings and notify the scaling engine
 * to clear caches. Safe to call multiple times (e.g. in tests).
 */
export function setConfig(partial: PixelFlowConfig): ResolvedPixelFlowConfig {
  current = {
    ...current,
    ...stripUndefined(partial),
  };
  return current;
}

export function resetConfig(): void {
  current = { ...DEFAULT_CONFIG };
}

function stripUndefined(obj: PixelFlowConfig): PixelFlowConfig {
  const out: PixelFlowConfig = {};
  (Object.keys(obj) as (keyof PixelFlowConfig)[]).forEach((key) => {
    const value = obj[key];
    if (value !== undefined) {
      (out as Record<string, unknown>)[key] = value;
    }
  });
  return out;
}
