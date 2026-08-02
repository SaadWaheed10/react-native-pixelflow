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

export interface PixelFlowTheme {
  name: string;
  colors: ThemeColors;
  dark: boolean;
}
