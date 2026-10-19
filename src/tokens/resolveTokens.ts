import { rp, rr } from '../responsive/responsive';
import { resolveResponsiveValue } from '../responsive/resolveValue';
import { resolveSemanticPath } from '../theme/semantic';
import type {
  ColorToken,
  PixelFlowTheme,
  RadiusToken,
  ResponsiveValue,
  SpacingToken,
  ThemeColors,
  ThemeRadii,
  ThemeSpacing,
} from '../types';

export type SpacingInput = ResponsiveValue<number | SpacingToken>;
export type ColorInput = ResponsiveValue<string | ColorToken>;
export type RadiusInput = ResponsiveValue<number | RadiusToken>;

export function isSpacingToken(
  value: unknown,
  spacing: ThemeSpacing,
): value is SpacingToken {
  return typeof value === 'string' && value in spacing;
}

export function isFlatColorToken(
  value: unknown,
  colors: ThemeColors,
): value is keyof ThemeColors {
  return typeof value === 'string' && value in colors;
}

export function isRadiusToken(
  value: unknown,
  radii: ThemeRadii,
): value is RadiusToken {
  return typeof value === 'string' && value in radii;
}

/** Resolve spacing token or number (optionally responsive) → scaled px. */
export function resolveSpacing(
  input: SpacingInput | undefined,
  theme: PixelFlowTheme,
): number | undefined {
  if (input === undefined) return undefined;
  const raw = resolveResponsiveValue(input);
  if (typeof raw === 'number') return rp(raw);
  if (isSpacingToken(raw, theme.spacing)) return rp(theme.spacing[raw]);
  return undefined;
}

/**
 * Resolve color token, semantic path (`bg.subtle`, `fg.muted`), or raw color.
 */
export function resolveColor(
  input: ColorInput | undefined,
  theme: PixelFlowTheme,
): string | undefined {
  if (input === undefined) return undefined;
  const raw = resolveResponsiveValue(input);
  if (typeof raw !== 'string') return undefined;
  if (isFlatColorToken(raw, theme.colors)) return theme.colors[raw];
  if (raw.includes('.')) {
    const semantic = resolveSemanticPath(raw, theme.semantic);
    if (semantic) return semantic;
  }
  return raw;
}

/** Resolve radius token or number → scaled px. */
export function resolveRadius(
  input: RadiusInput | undefined,
  theme: PixelFlowTheme,
): number | undefined {
  if (input === undefined) return undefined;
  const raw = resolveResponsiveValue(input);
  if (typeof raw === 'number') return rr(raw);
  if (isRadiusToken(raw, theme.radii)) return rr(theme.radii[raw]);
  return undefined;
}
