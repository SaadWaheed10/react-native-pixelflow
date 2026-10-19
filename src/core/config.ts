/**
 * Runtime configuration for the scaling engine.
 * Call `configure()` once at app startup before rendering UI that depends on
 * responsive values.
 */

import {
  resolveFigmaFrame,
  type FigmaFrame,
  type FigmaPresetName,
} from './figmaPresets';
import type { Density } from './density';

export interface PixelFlowConfig {
  /**
   * Named Figma frame or custom `{ width, height }`.
   * Sets `baseWidth` / `baseHeight` unless those are also passed explicitly.
   * @example configure({ figma: 'iPhone 14' })
   * @example configure({ figma: { width: 390, height: 844 } })
   */
  figma?: FigmaFrame;
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
  /**
   * Global spacing density. Affects `rp` / `rm` / theme spacing tokens.
   * Default `comfortable`.
   */
  density?: Density;
  /**
   * Default `maxFontSizeMultiplier` for `FText` when RN font scaling is on.
   * Default 1.3.
   */
  maxFontSizeMultiplier?: number;
  /**
   * Font-scale threshold at which `useA11yLayout` suggests `stacked` layout.
   * Default 1.35.
   */
  a11yStackThreshold?: number;
}

export interface ResolvedPixelFlowConfig {
  baseWidth: number;
  baseHeight: number;
  minFontScale: number;
  maxFontScale: number;
  applyAccessibilityFontScale: boolean;
  tabletDamping: number;
  foldableDamping: number;
  density: Density;
  maxFontSizeMultiplier: number;
  a11yStackThreshold: number;
  /** Last resolved Figma preset name, if configure was called with one. */
  figmaPreset?: FigmaPresetName;
}

export const DEFAULT_CONFIG: ResolvedPixelFlowConfig = {
  baseWidth: 375,
  baseHeight: 812,
  minFontScale: 0.85,
  maxFontScale: 1.6,
  applyAccessibilityFontScale: true,
  tabletDamping: 0.55,
  foldableDamping: 0.65,
  density: 'comfortable',
  maxFontSizeMultiplier: 1.3,
  a11yStackThreshold: 1.35,
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
  const { figma, ...rest } = partial;
  const next: ResolvedPixelFlowConfig = { ...current };

  if (figma !== undefined) {
    const frame = resolveFigmaFrame(figma);
    next.baseWidth = frame.width;
    next.baseHeight = frame.height;
    next.figmaPreset = frame.preset;
  }

  const cleaned = stripUndefined(rest);
  current = { ...next, ...cleaned };
  return current;
}

export function resetConfig(): void {
  current = { ...DEFAULT_CONFIG };
}

function stripUndefined(obj: Omit<PixelFlowConfig, 'figma'>): Omit<PixelFlowConfig, 'figma'> {
  const out: Omit<PixelFlowConfig, 'figma'> = {};
  (Object.keys(obj) as (keyof typeof obj)[]).forEach((key) => {
    const value = obj[key];
    if (value !== undefined) {
      (out as Record<string, unknown>)[key] = value;
    }
  });
  return out;
}
