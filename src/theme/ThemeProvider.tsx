import React, { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import type { PixelFlowTheme, ThemeSpacing } from '../types';
import { darkTheme, lightTheme } from './themes';
import { rp } from '../responsive/responsive';
import { useScalingVersion } from '../hooks/useScaling';

const ThemeContext = createContext<PixelFlowTheme>(lightTheme);

export interface PixelFlowProviderProps {
  /**
   * Explicit theme. When set, wins over `followSystem` / light / dark props.
   */
  theme?: PixelFlowTheme;
  /**
   * When true (and `theme` is omitted), pick `lightTheme` / `darkTheme`
   * (or the `light` / `dark` overrides) from `useColorScheme()`.
   */
  followSystem?: boolean;
  /** Theme used for light scheme when `followSystem` is true. */
  light?: PixelFlowTheme;
  /** Theme used for dark scheme when `followSystem` is true. */
  dark?: PixelFlowTheme;
  children: ReactNode;
}

/**
 * Wrap your app root to make a theme available to PixelFlow components and
 * `useTheme()`.
 *
 * @example
 * <PixelFlowProvider followSystem>
 *   <App />
 * </PixelFlowProvider>
 *
 * @example
 * <PixelFlowProvider theme={darkTheme}>
 *   <App />
 * </PixelFlowProvider>
 */
export function PixelFlowProvider({
  theme,
  followSystem = false,
  light = lightTheme,
  dark = darkTheme,
  children,
}: PixelFlowProviderProps): React.JSX.Element {
  const scheme = useColorScheme();

  const value = useMemo(() => {
    if (theme) return theme;
    if (followSystem) {
      return scheme === 'dark' ? dark : light;
    }
    return light;
  }, [theme, followSystem, scheme, light, dark]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): PixelFlowTheme {
  return useContext(ThemeContext);
}

/**
 * Theme spacing tokens passed through `rp()` so they stay live with the
 * scaling engine.
 */
export function useThemeSpacing(): ThemeSpacing {
  const theme = useTheme();
  const version = useScalingVersion();
  return useMemo(
    () => ({
      xs: rp(theme.spacing.xs),
      sm: rp(theme.spacing.sm),
      md: rp(theme.spacing.md),
      lg: rp(theme.spacing.lg),
      xl: rp(theme.spacing.xl),
      xxl: rp(theme.spacing.xxl),
    }),
    [theme.spacing, version],
  );
}
