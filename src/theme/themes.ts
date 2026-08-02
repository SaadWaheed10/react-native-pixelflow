import type { PixelFlowTheme } from '../types';

export const lightTheme: PixelFlowTheme = {
  name: 'light',
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#F5F6F8',
    primary: '#4F46E5',
    secondary: '#6B7280',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    danger: '#EF4444',
    success: '#22C55E',
    warning: '#F59E0B',
  },
};

export const darkTheme: PixelFlowTheme = {
  name: 'dark',
  dark: true,
  colors: {
    background: '#0B0F19',
    surface: '#161B26',
    primary: '#818CF8',
    secondary: '#9CA3AF',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    border: '#262B36',
    danger: '#F87171',
    success: '#4ADE80',
    warning: '#FBBF24',
  },
};

/**
 * Build a custom theme by extending light or dark with color overrides.
 * @example customTheme({ base: 'dark', colors: { primary: '#FF6B6B' } })
 */
export function customTheme(options: {
  base?: 'light' | 'dark';
  name?: string;
  colors: Partial<PixelFlowTheme['colors']>;
}): PixelFlowTheme {
  const base = options.base === 'dark' ? darkTheme : lightTheme;
  return {
    name: options.name ?? `${base.name}-custom`,
    dark: base.dark,
    colors: { ...base.colors, ...options.colors },
  };
}
