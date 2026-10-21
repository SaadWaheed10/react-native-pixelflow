import type { PixelFlowTheme } from '../types';
import { lightTheme, darkTheme } from '../theme/themes';

/**
 * Subset of React Navigation's Theme shape — no hard dependency on
 * `@react-navigation/native`.
 */
export interface NavigationTheme {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  };
  fonts?: {
    regular: { fontFamily: string; fontWeight: string };
    medium: { fontFamily: string; fontWeight: string };
    bold: { fontFamily: string; fontWeight: string };
    heavy: { fontFamily: string; fontWeight: string };
  };
}

export interface CreateNavigationThemeOptions {
  theme?: PixelFlowTheme;
  /** Font family for navigation titles (optional). */
  fontFamily?: string;
}

/**
 * Build a React Navigation–compatible theme from PixelFlow colors.
 *
 * @example
 * import { NavigationContainer } from '@react-navigation/native';
 * <NavigationContainer theme={createNavigationTheme({ theme })} />
 */
export function createNavigationTheme(
  options: CreateNavigationThemeOptions = {},
): NavigationTheme {
  const theme = options.theme ?? lightTheme;
  const fontFamily = options.fontFamily ?? 'System';

  return {
    dark: theme.dark,
    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.danger,
    },
    fonts: {
      regular: { fontFamily, fontWeight: '400' },
      medium: { fontFamily, fontWeight: '500' },
      bold: { fontFamily, fontWeight: '700' },
      heavy: { fontFamily, fontWeight: '800' },
    },
  };
}

/** Convenience: navigation themes for default light/dark PixelFlow palettes. */
export const navigationThemes = {
  light: createNavigationTheme({ theme: lightTheme }),
  dark: createNavigationTheme({ theme: darkTheme }),
};
