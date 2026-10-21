import { Dimensions, PixelRatio } from 'react-native';
import { getDeviceType, getOrientation } from './deviceDetection';
import {
  getConfig,
  setConfig,
  type PixelFlowConfig,
  type ResolvedPixelFlowConfig,
} from './config';
import { getDensityMultiplier } from './density';
import { applyHydrateLock, subscribeHydrateLock } from './hydrateLock';
import type { DeviceType, Orientation, ScalingSnapshot } from '../types';

type Listener = () => void;

class ScalingEngine {
  private width: number;
  private height: number;
  private deviceType: DeviceType;
  private orientation: Orientation;
  private fontScale: number;
  private listeners: Set<Listener> = new Set();
  private cache: Map<string, number> = new Map();
  /** Cached snapshot — replaced only when inputs change (stable for useSyncExternalStore). */
  private snapshot: ScalingSnapshot;
  private version = 0;

  constructor() {
    const window = Dimensions.get('window');
    const locked = applyHydrateLock(window.width, window.height);
    this.width = locked.width;
    this.height = locked.height;
    this.deviceType = getDeviceType(this.width, this.height);
    this.orientation = getOrientation(this.width, this.height);
    this.fontScale = PixelRatio.getFontScale();
    this.snapshot = this.buildSnapshot();

    Dimensions.addEventListener('change', ({ window: win }) => {
      const locked = applyHydrateLock(win.width, win.height);
      this.width = locked.width;
      this.height = locked.height;
      this.deviceType = getDeviceType(this.width, this.height);
      this.orientation = getOrientation(this.width, this.height);
      this.fontScale = PixelRatio.getFontScale();
      this.invalidate();
    });

    // Recompute when SSR hydrate lock is cleared
    subscribeHydrateLock(() => {
      const win = Dimensions.get('window');
      const locked = applyHydrateLock(win.width, win.height);
      this.width = locked.width;
      this.height = locked.height;
      this.deviceType = getDeviceType(this.width, this.height);
      this.orientation = getOrientation(this.width, this.height);
      this.invalidate();
    });
  }

  /**
   * Apply runtime config (base design size, font-scale clamps, damping).
   * Clears caches and notifies subscribers so UI recomputes.
   */
  configure(partial: PixelFlowConfig): ResolvedPixelFlowConfig {
    const resolved = setConfig(partial);
    this.invalidate();
    return resolved;
  }

  getConfig(): ResolvedPixelFlowConfig {
    return getConfig();
  }

  /**
   * Testing helper — set window size / font scale without a Dimensions event.
   * Prefer `mockDimensions()` from `react-native-pixelflow/testing`.
   */
  setWindowForTesting(
    width: number,
    height: number,
    fontScale: number = this.fontScale,
  ): void {
    this.width = width;
    this.height = height;
    this.deviceType = getDeviceType(this.width, this.height);
    this.orientation = getOrientation(this.width, this.height);
    this.fontScale = fontScale;
    this.invalidate();
  }

  private invalidate(): void {
    this.cache.clear();
    this.version += 1;
    this.snapshot = this.buildSnapshot();
    this.emit();
  }

  private emit(): void {
    this.listeners.forEach((listener) => listener());
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getVersion(): number {
    return this.version;
  }

  getSnapshot(): ScalingSnapshot {
    return this.snapshot;
  }

  private buildSnapshot(): ScalingSnapshot {
    return {
      width: this.width,
      height: this.height,
      deviceType: this.deviceType,
      orientation: this.orientation,
      isTablet: this.deviceType === 'tablet',
      isFoldable: this.deviceType === 'foldable',
      isLandscape: this.orientation === 'landscape',
      fontScale: this.fontScale,
      pixelDensity: PixelRatio.get(),
      /** Hybrid scale factor used by spacing (factor 0.5) — matches rp/rm growth. */
      scale: this.hybridScale(0.5),
    };
  }

  /** Raw width-ratio scale, dampened for larger devices so growth isn't 1:1. */
  private widthScale(): number {
    const { baseWidth, tabletDamping, foldableDamping } = getConfig();
    const rawScale = this.width / baseWidth;
    if (this.deviceType === 'tablet') {
      return 1 + (rawScale - 1) * tabletDamping;
    }
    if (this.deviceType === 'foldable') {
      return 1 + (rawScale - 1) * foldableDamping;
    }
    return rawScale;
  }

  private heightScale(): number {
    const { baseHeight, tabletDamping, foldableDamping } = getConfig();
    const rawScale = this.height / baseHeight;
    if (this.deviceType === 'tablet') {
      return 1 + (rawScale - 1) * tabletDamping;
    }
    if (this.deviceType === 'foldable') {
      return 1 + (rawScale - 1) * foldableDamping;
    }
    return rawScale;
  }

  /**
   * Hybrid scale: blends width and height scale, then nudges toward 1 by
   * `factor` so values stay visually consistent.
   */
  hybridScale(factor: number): number {
    const blended = (this.widthScale() + this.heightScale()) / 2;
    return 1 + (blended - 1) * factor;
  }

  private clampedFontScale(): number {
    const { minFontScale, maxFontScale, applyAccessibilityFontScale } =
      getConfig();
    if (!applyAccessibilityFontScale) return 1;
    return Math.min(Math.max(this.fontScale, minFontScale), maxFontScale);
  }

  /** Width scale with tablet/foldable damping — used by size-matters aliases. */
  getWidthScale(): number {
    return this.widthScale();
  }

  /** Height scale with tablet/foldable damping — used by size-matters aliases. */
  getHeightScale(): number {
    return this.heightScale();
  }

  private memo(key: string, compute: () => number): number {
    const config = getConfig();
    const cacheKey = `${key}:${this.width}x${this.height}:${this.fontScale}:${config.baseWidth}x${config.baseHeight}:${config.applyAccessibilityFontScale}:${config.minFontScale}:${config.maxFontScale}:${config.density}`;
    const cached = this.cache.get(cacheKey);
    if (cached !== undefined) return cached;
    const value = compute();
    this.cache.set(cacheKey, value);
    return value;
  }

  width_(percent: number): number {
    return this.memo(`w:${percent}`, () => (this.width * percent) / 100);
  }

  height_(percent: number): number {
    return this.memo(`h:${percent}`, () => (this.height * percent) / 100);
  }

  /**
   * Font size scaling. When `applyAccessibilityFontScale` is true, multiplies
   * by the clamped OS font scale — use with `allowFontScaling={false}` on Text
   * so RN does not apply font scale again.
   */
  font(size: number): number {
    return this.memo(`f:${size}`, () => {
      const deviceAdjusted = size * this.hybridScale(0.3);
      const result = deviceAdjusted * this.clampedFontScale();
      return Math.round(PixelRatio.roundToNearestPixel(result));
    });
  }

  /** Spacing (padding/margin): moderate scale × density. */
  spacing(value: number): number {
    return this.memo(`s:${value}`, () => {
      const density = getDensityMultiplier(getConfig().density);
      return Math.round(value * this.hybridScale(0.5) * density);
    });
  }

  /** Border radius: should barely change across devices — factor 0.35. */
  radius(value: number): number {
    return this.memo(`r:${value}`, () =>
      Math.round(value * this.hybridScale(0.35)),
    );
  }

  /** Icon size: closer to font scaling since icons sit next to text. */
  icon(value: number): number {
    return this.memo(`i:${value}`, () =>
      Math.round(value * this.hybridScale(0.35)),
    );
  }

  /** Line height: tracks font scaling closely to avoid clipped text. */
  lineHeight(value: number): number {
    return this.memo(`l:${value}`, () => {
      const deviceAdjusted = value * this.hybridScale(0.3);
      return Math.round(deviceAdjusted * this.clampedFontScale());
    });
  }

  /** Letter spacing: tiny values, very small damping. */
  letterSpacing(value: number): number {
    return this.memo(`ls:${value}`, () => {
      const scaled = value * this.hybridScale(0.15);
      return Math.round(scaled * 100) / 100;
    });
  }
}

/** Singleton — one Dimensions listener for the whole app, memoized results. */
export const scalingEngine = new ScalingEngine();

/**
 * Configure design baseline, Figma presets, accessibility font-scale, and damping.
 * Call once at app entry before rendering PixelFlow UI.
 *
 * @example
 * configure({ figma: 'iPhone 14' });
 * configure({ baseWidth: 390, baseHeight: 844, maxFontScale: 2 });
 */
export function configure(partial: PixelFlowConfig): ResolvedPixelFlowConfig {
  return scalingEngine.configure(partial);
}
