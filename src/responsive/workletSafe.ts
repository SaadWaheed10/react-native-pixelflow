import type { DeviceType, ScalingSnapshot } from '../types';
import type { Density } from '../core/density';
import { DENSITY_MULTIPLIERS } from '../core/density';
import { getConfig } from '../core/config';

export interface ScaleContext {
  width: number;
  height: number;
  deviceType: DeviceType;
  fontScale: number;
  baseWidth: number;
  baseHeight: number;
  tabletDamping: number;
  foldableDamping: number;
  minFontScale: number;
  maxFontScale: number;
  applyAccessibilityFontScale: boolean;
  density: Density;
}

/**
 * Build a plain scale context from a snapshot + config.
 * Safe to pass into Reanimated worklets (no class / Dimensions).
 */
export function createScaleContext(
  snapshot: Pick<
    ScalingSnapshot,
    'width' | 'height' | 'deviceType' | 'fontScale'
  >,
): ScaleContext {
  const config = getConfig();
  return {
    width: snapshot.width,
    height: snapshot.height,
    deviceType: snapshot.deviceType,
    fontScale: snapshot.fontScale,
    baseWidth: config.baseWidth,
    baseHeight: config.baseHeight,
    tabletDamping: config.tabletDamping,
    foldableDamping: config.foldableDamping,
    minFontScale: config.minFontScale,
    maxFontScale: config.maxFontScale,
    applyAccessibilityFontScale: config.applyAccessibilityFontScale,
    density: config.density,
  };
}

function dampen(
  raw: number,
  deviceType: DeviceType,
  tabletDamping: number,
  foldableDamping: number,
): number {
  if (deviceType === 'tablet') return 1 + (raw - 1) * tabletDamping;
  if (deviceType === 'foldable') return 1 + (raw - 1) * foldableDamping;
  return raw;
}

function hybrid(ctx: ScaleContext, factor: number): number {
  const w = dampen(
    ctx.width / ctx.baseWidth,
    ctx.deviceType,
    ctx.tabletDamping,
    ctx.foldableDamping,
  );
  const h = dampen(
    ctx.height / ctx.baseHeight,
    ctx.deviceType,
    ctx.tabletDamping,
    ctx.foldableDamping,
  );
  const blended = (w + h) / 2;
  return 1 + (blended - 1) * factor;
}

function clampedFont(ctx: ScaleContext): number {
  if (!ctx.applyAccessibilityFontScale) return 1;
  return Math.min(
    Math.max(ctx.fontScale, ctx.minFontScale),
    ctx.maxFontScale,
  );
}

/** Worklet-safe font scale — pass `ctx` from `useScaleContext()`. */
export function rfWith(ctx: ScaleContext, size: number): number {
  return Math.round(size * hybrid(ctx, 0.3) * clampedFont(ctx));
}

/** Worklet-safe spacing. */
export function rpWith(ctx: ScaleContext, value: number): number {
  const density = DENSITY_MULTIPLIERS[ctx.density] ?? 1;
  return Math.round(value * hybrid(ctx, 0.5) * density);
}

/** Worklet-safe radius. */
export function rrWith(ctx: ScaleContext, value: number): number {
  return Math.round(value * hybrid(ctx, 0.35));
}

/** Worklet-safe icon size. */
export function riWith(ctx: ScaleContext, value: number): number {
  return Math.round(value * hybrid(ctx, 0.35));
}

/** Worklet-safe line height. */
export function rlWith(ctx: ScaleContext, value: number): number {
  return Math.round(value * hybrid(ctx, 0.3) * clampedFont(ctx));
}

/**
 * Bundle of pure scalers for Reanimated / Gesture Handler worklets.
 *
 * @example
 * const ctx = useScaleContext();
 * // inside a worklet:
 * // const pad = rpWith(ctx, 16);
 */
export const workletScale = {
  createScaleContext,
  rfWith,
  rpWith,
  rrWith,
  riWith,
  rlWith,
};
