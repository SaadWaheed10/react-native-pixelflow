import React, { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { PixelFlowTheme } from '../types';
import { lightTheme } from './themes';

const ThemeContext = createContext<PixelFlowTheme>(lightTheme);

export interface PixelFlowProviderProps {
  theme?: PixelFlowTheme;
  children: ReactNode;
}

/**
 * Wrap your app root to make a theme available to react-native-PixelFlow components and
 * `useTheme()`.
 * @example
 * <PixelFlowProvider theme={darkTheme}>
 *   <App />
 * </PixelFlowProvider>
 */
export function PixelFlowProvider({
  theme = lightTheme,
  children,
}: PixelFlowProviderProps): React.JSX.Element {
  const value = useMemo(() => theme, [theme]);
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): PixelFlowTheme {
  return useContext(ThemeContext);
}
