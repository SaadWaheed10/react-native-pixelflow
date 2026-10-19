import type { Density } from '../core/density';

export type DeviceType = 'phone' | 'tablet' | 'foldable';
export type Orientation = 'portrait' | 'landscape';
export type { Density };

export type WindowWidthClass =
  | 'compact'
  | 'medium'
  | 'expanded'
  | 'large'
  | 'extraLarge';

export interface ScalingSnapshot {
  width: number;
  height: number;
  deviceType: DeviceType;
  orientation: Orientation;
  isTablet: boolean;
  isFoldable: boolean;
  isLandscape: boolean;
  fontScale: number;
  pixelDensity: number;
  /**
   * Hybrid spacing-scale factor (same growth curve as `rp` / `rm`).
   * Use for custom math that should track PixelFlow spacing.
   */
  scale: number;
}

export type FontWeightKey =
  | 'thin'
  | 'extraLight'
  | 'light'
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extraBold'
  | 'black';

export type FontFamilyMap = Partial<Record<FontWeightKey, string>>;

export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  text: string;
  textSecondary: string;
  border: string;
  danger: string;
  success: string;
  warning: string;
}

/** Semantic color roles — use as `"bg.subtle"`, `"fg.muted"`, `"border.focus"`. */
export interface ThemeSemanticColors {
  bg: {
    default: string;
    subtle: string;
    muted: string;
    inverse: string;
  };
  fg: {
    default: string;
    muted: string;
    subtle: string;
    inverse: string;
    link: string;
  };
  border: {
    default: string;
    strong: string;
    focus: string;
  };
  accent: {
    primary: string;
    danger: string;
    success: string;
    warning: string;
  };
}

export type SemanticColorPath =
  | `bg.${keyof ThemeSemanticColors['bg']}`
  | `fg.${keyof ThemeSemanticColors['fg']}`
  | `border.${keyof ThemeSemanticColors['border']}`
  | `accent.${keyof ThemeSemanticColors['accent']}`;

/** Unscaled design-token spacing (pass through `rp()` or use `useThemeSpacing()`). */
export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface ThemeRadii {
  none: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface ThemeMotion {
  duration: {
    instant: number;
    fast: number;
    normal: number;
    slow: number;
  };
  easing: {
    standard: string;
    entrance: string;
    exit: string;
  };
}

export interface PixelFlowTheme {
  name: string;
  colors: ThemeColors;
  semantic: ThemeSemanticColors;
  dark: boolean;
  spacing: ThemeSpacing;
  radii: ThemeRadii;
  motion: ThemeMotion;
}

/** Per-device values for `rs()` / `select()`. */
export interface ResponsiveByDevice<T> {
  phone: T;
  tablet?: T;
  foldable?: T;
}

/** Mobile-first window-class map (Material classes). */
export type ResponsiveByWindow<T> = {
  [K in WindowWidthClass]?: T;
};

/**
 * A plain value, device map, window-class map, or tuple
 * `[compact, medium?, expanded?]` shorthand.
 */
export type ResponsiveValue<T> =
  | T
  | ResponsiveByDevice<T>
  | ResponsiveByWindow<T>
  | readonly [T, T?, T?];

export type SpacingToken = keyof ThemeSpacing;
export type ColorToken = keyof ThemeColors | SemanticColorPath;
export type RadiusToken = keyof ThemeRadii;

export type A11yLayoutMode = 'normal' | 'comfortable' | 'stacked';
