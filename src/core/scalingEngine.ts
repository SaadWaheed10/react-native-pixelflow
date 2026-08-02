import { Dimensions, PixelRatio } from 'react-native';
import { getDeviceType, getOrientation } from './deviceDetection';
import type { DeviceType, Orientation, ScalingSnapshot } from '../types';

/**
 * Baseline design reference. Chosen to match a common mid-size phone
 * viewport (iPhone 11 / Pixel-class device) that most design tools default
 * to, so `rf(16)` "looks like" 16px on the device the designer had in mind.
 */
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/** Guard rails so accessibility settings or huge tablets can't blow up layouts. */
const MIN_FONT_SCALE_MULTIPLIER = 0.85;
const MAX_FONT_SCALE_MULTIPLIER = 1.6;

/** Tablets should not scale linearly with width, or text/spacing becomes huge. */
const TABLET_DAMPING = 0.55;
const FOLDABLE_DAMPING = 0.65;

type Listener = (snapshot: ScalingSnapshot) => void;

class ScalingEngine {
  private width: number;
  private height: number;
  private deviceType: DeviceType;
  private orientation: Orientation;
  private fontScale: number;
  private listeners: Set<Listener> = new Set();
  private cache: Map<string, number> = new Map();

  constructor() {
    const window = Dimensions.get('window');
    this.width = window.width;
    this.height = window.height;
    this.deviceType = getDeviceType(this.width, this.height);
    this.orientation = getOrientation(this.width, this.height);
    this.fontScale = PixelRatio.getFontScale();

    Dimensions.addEventListener('change', ({ window: win }) => {
      this.width = win.width;
      this.height = win.height;
      this.deviceType = getDeviceType(this.width, this.height);
      this.orientation = getOrientation(this.width, this.height);
      this.fontScale = PixelRatio.getFontScale();
      this.cache.clear();
      this.emit();
    });
  }

  private emit(): void {
    const snapshot = this.getSnapshot();
    this.listeners.forEach((listener) => listener(snapshot));
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getSnapshot(): ScalingSnapshot {
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
    };
  }

  /** Raw width-ratio scale, dampened for larger devices so growth isn't 1:1. */
  private widthScale(): number {
    const rawScale = this.width / BASE_WIDTH;
    if (this.deviceType === 'tablet') {
      return 1 + (rawScale - 1) * TABLET_DAMPING;
    }
    if (this.deviceType === 'foldable') {
      return 1 + (rawScale - 1) * FOLDABLE_DAMPING;
    }
    return rawScale;
  }

  private heightScale(): number {
    const rawScale = this.height / BASE_HEIGHT;
    if (this.deviceType === 'tablet') {
      return 1 + (rawScale - 1) * TABLET_DAMPING;
    }
    if (this.deviceType === 'foldable') {
      return 1 + (rawScale - 1) * FOLDABLE_DAMPING;
    }
    return rawScale;
  }

  /**
   * Hybrid scale: blends width and height scale (so rotation and unusual
   * aspect ratios don't distort values as badly as width-only scaling),
   * then nudges the result toward 1 by `factor` — "moderate scaling" — so
   * values stay visually consistent instead of growing mathematically
   * proportional to screen size.
   */
  private hybridScale(factor: number): number {
    const blended = (this.widthScale() + this.heightScale()) / 2;
    return 1 + (blended - 1) * factor;
  }

  private memo(key: string, compute: () => number): number {
    const cacheKey = `${key}:${this.width}x${this.height}:${this.fontScale}`;
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
   * Font size scaling: blends width/height scale (factor 0.3 — text should
   * move far less than raw layout), then applies the OS accessibility font
   * scale clamped to sane bounds so a user's "huge text" setting doesn't
   * break layouts, while still respecting their preference somewhat.
   */
  font(size: number): number {
    return this.memo(`f:${size}`, () => {
      const deviceAdjusted = size * this.hybridScale(0.3);
      const clampedFontScale = Math.min(
        Math.max(this.fontScale, MIN_FONT_SCALE_MULTIPLIER),
        MAX_FONT_SCALE_MULTIPLIER,
      );
      const result = deviceAdjusted * clampedFontScale;
      return Math.round(PixelRatio.roundToNearestPixel(result));
    });
  }

  /** Spacing (padding/margin): moderate scale, factor 0.5. */
  spacing(value: number): number {
    return this.memo(`s:${value}`, () =>
      Math.round(value * this.hybridScale(0.5)),
    );
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

  /** Line height: should track font scaling closely to avoid clipped text. */
  lineHeight(value: number): number {
    return this.memo(`l:${value}`, () => {
      const deviceAdjusted = value * this.hybridScale(0.3);
      const clampedFontScale = Math.min(
        Math.max(this.fontScale, MIN_FONT_SCALE_MULTIPLIER),
        MAX_FONT_SCALE_MULTIPLIER,
      );
      return Math.round(deviceAdjusted * clampedFontScale);
    });
  }

  /** Letter spacing: tiny values, very small damping so it never looks odd. */
  letterSpacing(value: number): number {
    return this.memo(`ls:${value}`, () => {
      const scaled = value * this.hybridScale(0.15);
      return Math.round(scaled * 100) / 100;
    });
  }
}

/** Singleton — one Dimensions listener for the whole app, memoized results. */
export const scalingEngine = new ScalingEngine();
