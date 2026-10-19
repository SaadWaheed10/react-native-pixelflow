import type {
  PixelFlowTheme,
  ThemeMotion,
  ThemeRadii,
  ThemeSemanticColors,
  ThemeSpacing,
} from '../types';
import { defaultMotion } from './motion';
import { buildSemanticColors } from './semantic';

export const defaultSpacing: ThemeSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const defaultRadii: ThemeRadii = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

const lightColors = {
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
} as const;

const darkColors = {
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
} as const;

export const lightTheme: PixelFlowTheme = {
  name: 'light',
  dark: false,
  spacing: { ...defaultSpacing },
  radii: { ...defaultRadii },
  motion: { ...defaultMotion, duration: { ...defaultMotion.duration }, easing: { ...defaultMotion.easing } },
  colors: { ...lightColors },
  semantic: buildSemanticColors(lightColors),
};

export const darkTheme: PixelFlowTheme = {
  name: 'dark',
  dark: true,
  spacing: { ...defaultSpacing },
  radii: { ...defaultRadii },
  motion: { ...defaultMotion, duration: { ...defaultMotion.duration }, easing: { ...defaultMotion.easing } },
  colors: { ...darkColors },
  semantic: buildSemanticColors(darkColors),
};

/**
 * Build a custom theme by extending light or dark with overrides.
 * Semantic roles are rebuilt from the final color palette unless provided.
 */
export function customTheme(options: {
  base?: 'light' | 'dark';
  name?: string;
  colors?: Partial<PixelFlowTheme['colors']>;
  spacing?: Partial<ThemeSpacing>;
  radii?: Partial<ThemeRadii>;
  motion?: Partial<ThemeMotion>;
  semantic?: Partial<ThemeSemanticColors>;
}): PixelFlowTheme {
  const base = options.base === 'dark' ? darkTheme : lightTheme;
  const colors = { ...base.colors, ...options.colors };
  const semanticBase = buildSemanticColors(colors);
  return {
    name: options.name ?? `${base.name}-custom`,
    dark: base.dark,
    colors,
    spacing: { ...base.spacing, ...options.spacing },
    radii: { ...base.radii, ...options.radii },
    motion: {
      duration: { ...base.motion.duration, ...options.motion?.duration },
      easing: { ...base.motion.easing, ...options.motion?.easing },
    },
    semantic: {
      bg: { ...semanticBase.bg, ...options.semantic?.bg },
      fg: { ...semanticBase.fg, ...options.semantic?.fg },
      border: { ...semanticBase.border, ...options.semantic?.border },
      accent: { ...semanticBase.accent, ...options.semantic?.accent },
    },
  };
}
