import React, { createContext, useContext, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Density, PixelFlowTheme, ThemeRadii, ThemeSpacing } from '../types';
import { darkTheme, lightTheme } from './themes';
import { rp, rr } from '../responsive/responsive';
import { useScalingVersion } from '../hooks/useScaling';
import { configure } from '../core/scalingEngine';
import { setSafeInsets } from '../core/safeInsets';

const ThemeContext = createContext<PixelFlowTheme>(lightTheme);

function SafeInsetsSync(): null {
  const insets = useSafeAreaInsets();
  useEffect(() => {
    setSafeInsets({
      top: insets.top,
      bottom: insets.bottom,
      left: insets.left,
      right: insets.right,
    });
  }, [insets.top, insets.bottom, insets.left, insets.right]);
  return null;
}

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
  /**
   * Spacing density for the whole tree. Syncs into `configure({ density })`.
   */
  density?: Density;
  children: ReactNode;
}

/**
 * Wrap your app root (inside `SafeAreaProvider`) to provide theme, density,
 * and safe-inset sync for `rsw` / `rsh`.
 *
 * @example
 * <SafeAreaProvider>
 *   <PixelFlowProvider followSystem density="comfortable">
 *     <App />
 *   </PixelFlowProvider>
 * </SafeAreaProvider>
 */
export function PixelFlowProvider({
  theme,
  followSystem = false,
  light = lightTheme,
  dark = darkTheme,
  density,
  children,
}: PixelFlowProviderProps): React.JSX.Element {
  const scheme = useColorScheme();

  useEffect(() => {
    if (density !== undefined) {
      configure({ density });
    }
  }, [density]);

  const value = useMemo(() => {
    if (theme) return theme;
    if (followSystem) {
      return scheme === 'dark' ? dark : light;
    }
    return light;
  }, [theme, followSystem, scheme, light, dark]);

  return (
    <ThemeContext.Provider value={value}>
      <SafeInsetsSync />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): PixelFlowTheme {
  return useContext(ThemeContext);
}

/**
 * Theme spacing tokens passed through `rp()` (includes density).
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

/** Theme radii tokens passed through `rr()`. */
export function useThemeRadii(): ThemeRadii {
  const theme = useTheme();
  const version = useScalingVersion();
  return useMemo(
    () => ({
      none: rr(theme.radii.none),
      sm: rr(theme.radii.sm),
      md: rr(theme.radii.md),
      lg: rr(theme.radii.lg),
      xl: rr(theme.radii.xl),
      full: theme.radii.full,
    }),
    [theme.radii, version],
  );
}
