// Config
export { configure } from './core/scalingEngine';
export type { PixelFlowConfig, ResolvedPixelFlowConfig } from './core/config';
export { DEFAULT_CONFIG, getConfig, resetConfig } from './core/config';
export {
  FIGMA_PRESETS,
  listFigmaPresets,
  resolveFigmaFrame,
} from './core/figmaPresets';
export type { FigmaPresetName, FigmaFrame } from './core/figmaPresets';
export { DENSITY_MULTIPLIERS, getDensityMultiplier } from './core/density';
export type { Density } from './core/density';
export { setSafeInsets, getSafeInsets } from './core/safeInsets';

// Responsive functions
export { rw, rh, rf, rp, rm, rr, ri, rl, rls, rs } from './responsive/responsive';
export { design } from './responsive/design';
export { rsw, rsh } from './responsive/safeMetrics';
export { resolveResponsiveValue } from './responsive/resolveValue';
export {
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
  s,
  vs,
  ms,
  mvs,
} from './responsive/sizeMatters';

// Layout helpers
export { hairline, absoluteFill, layout } from './layout/helpers';

// PixelSheet
export { PixelSheet, usePixelSheet, scaleStyles, scaleStyleValue } from './stylesheet/pixelSheet';

// Variants
export { createVariants } from './variants/createVariants';
export type { CreateVariantsConfig } from './variants/createVariants';

// Tokens
export {
  resolveSpacing,
  resolveColor,
  resolveRadius,
} from './tokens/resolveTokens';
export type {
  SpacingInput,
  ColorInput,
  RadiusInput,
} from './tokens/resolveTokens';
export { buildSemanticColors, resolveSemanticPath } from './theme/semantic';
export { defaultMotion } from './theme/motion';

// Flex utilities
export { flex } from './flex/flex';
export type { FlexKey } from './flex/flex';

// Typography
export { typography, createTypography } from './typography/typography';
export type { TypographyScale } from './typography/typography';

// Fonts
export { fonts, buildFontMap, availableFontFamilies } from './fonts/fonts';
export type { FontFamilyName } from './fonts/fontRegistry';

// Theme
export {
  lightTheme,
  darkTheme,
  customTheme,
  defaultSpacing,
  defaultRadii,
} from './theme/themes';
export {
  PixelFlowProvider,
  useTheme,
  useThemeSpacing,
  useThemeRadii,
} from './theme/ThemeProvider';
export type { PixelFlowProviderProps } from './theme/ThemeProvider';

// Components
export { Container } from './components/Container';
export type { ContainerProps } from './components/Container';
export { Box } from './components/Box';
export type { BoxProps } from './components/Box';
export { Row, Column, Spacer } from './components/Layout';
export type { RowProps, ColumnProps, SpacerProps } from './components/Layout';
export { FText } from './components/FText';
export type { FTextProps, FTextVariant } from './components/FText';
export { Button } from './components/Button';
export type { ButtonProps, ButtonIntent, ButtonSize } from './components/Button';
export { Grid } from './components/Grid';
export type { GridProps } from './components/Grid';
export { ContentWidth } from './components/ContentWidth';
export type { ContentWidthProps } from './components/ContentWidth';
export { SplitView } from './components/SplitView';
export type { SplitViewProps } from './components/SplitView';
export { PixelFlowDebug } from './components/PixelFlowDebug';
export type { PixelFlowDebugProps } from './components/PixelFlowDebug';

// Adaptive layout
export {
  useWindowClass,
  getWindowWidthClass,
  windowClassMeets,
  WINDOW_CLASS_BREAKPOINTS,
  WINDOW_CLASS_ORDER,
} from './adaptive/windowClass';
export type {
  WindowWidthClass,
  AdaptiveNav,
  UseWindowClassResult,
} from './adaptive/windowClass';
export { useGrid, computeGrid } from './adaptive/grid';
export type { UseGridOptions, UseGridResult } from './adaptive/grid';

// Hooks
export { useResponsive } from './hooks/useResponsive';
export type { UseResponsiveResult } from './hooks/useResponsive';
export { useTypography } from './hooks/useTypography';
export { useDevice } from './hooks/useDevice';
export type { UseDeviceResult } from './hooks/useDevice';
export { useScaledStyles } from './hooks/useScaledStyles';
export { useScalingSnapshot, useScalingVersion } from './hooks/useScaling';
export { useA11yLayout } from './hooks/useA11yLayout';
export type { UseA11yLayoutResult } from './hooks/useA11yLayout';
export { useReduceMotion } from './hooks/useReduceMotion';
export { useKeyboardInset } from './hooks/useKeyboardInset';
export { useMedia, matchMediaQuery } from './hooks/useMedia';
export type { MediaQuery, UseMediaResult } from './hooks/useMedia';
export { useMotion } from './hooks/useMotion';
export type { UseMotionResult } from './hooks/useMotion';

// Core (advanced usage / testing)
export { scalingEngine } from './core/scalingEngine';
export { getDeviceType, getOrientation } from './core/deviceDetection';

// Types
export type {
  DeviceType,
  Orientation,
  ScalingSnapshot,
  FontWeightKey,
  FontFamilyMap,
  ThemeColors,
  ThemeSemanticColors,
  ThemeSpacing,
  ThemeRadii,
  ThemeMotion,
  PixelFlowTheme,
  ResponsiveByDevice,
  ResponsiveByWindow,
  ResponsiveValue,
  SpacingToken,
  ColorToken,
  RadiusToken,
  SemanticColorPath,
  A11yLayoutMode,
} from './types';
