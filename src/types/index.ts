export type DeviceType = 'phone' | 'tablet' | 'foldable';
export type Orientation = 'portrait' | 'landscape';

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

/** Unscaled design-token spacing (pass through `rp()` or use `useThemeSpacing()`). */
export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface PixelFlowTheme {
  name: string;
  colors: ThemeColors;
  dark: boolean;
  spacing: ThemeSpacing;
}

/** Per-device values for `rs()` / `select()`. */
export interface ResponsiveByDevice<T> {
  phone: T;
  tablet?: T;
  foldable?: T;
}
