// Responsive functions
export { rw, rh, rf, rp, rm, rr, ri, rl, rls } from './responsive/responsive';

// Flex utilities
export { flex } from './flex/flex';

// Typography
export { typography, createTypography } from './typography/typography';
export type { TypographyScale } from './typography/typography';

// Fonts
export { fonts, buildFontMap, availableFontFamilies } from './fonts/fonts';
export type { FontFamilyName } from './fonts/fontRegistry';

// Theme
export { lightTheme, darkTheme, customTheme } from './theme/themes';
export { PixelFlowProvider, useTheme } from './theme/ThemeProvider';
export type { PixelFlowProviderProps } from './theme/ThemeProvider';

// Components
export { Container } from './components/Container';
export type { ContainerProps } from './components/Container';
export { Box } from './components/Box';
export type { BoxProps } from './components/Box';
export { Row, Column, Spacer } from './components/Layout';
export type { RowProps, ColumnProps, SpacerProps } from './components/Layout';
export { FText } from './components/FText';
export type { FTextProps } from './components/FText';

// Hooks
export { useResponsive } from './hooks/useResponsive';
export type { UseResponsiveResult } from './hooks/useResponsive';
export { useTypography } from './hooks/useTypography';
export { useDevice } from './hooks/useDevice';
export type { UseDeviceResult } from './hooks/useDevice';

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
  PixelFlowTheme,
} from './types';
