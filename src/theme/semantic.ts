import type { ThemeColors, ThemeSemanticColors } from '../types';

/** Build semantic color roles from a flat palette. */
export function buildSemanticColors(colors: ThemeColors): ThemeSemanticColors {
  return {
    bg: {
      default: colors.background,
      subtle: colors.surface,
      muted: colors.border,
      inverse: colors.text,
    },
    fg: {
      default: colors.text,
      muted: colors.textSecondary,
      subtle: colors.secondary,
      inverse: colors.background,
      link: colors.primary,
    },
    border: {
      default: colors.border,
      strong: colors.secondary,
      focus: colors.primary,
    },
    accent: {
      primary: colors.primary,
      danger: colors.danger,
      success: colors.success,
      warning: colors.warning,
    },
  };
}

/** Resolve `bg.subtle`, `fg.muted`, `accent.primary`, etc. */
export function resolveSemanticPath(
  path: string,
  semantic: ThemeSemanticColors,
): string | undefined {
  const [group, key] = path.split('.');
  if (!group || !key) return undefined;
  const bucket = semantic[group as keyof ThemeSemanticColors] as
    | Record<string, string>
    | undefined;
  return bucket?.[key];
}
