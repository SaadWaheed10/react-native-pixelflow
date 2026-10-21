import type {
  PixelFlowTheme,
  ThemeColors,
  ThemeRadii,
  ThemeSpacing,
} from '../types';
import { customTheme, defaultRadii, defaultSpacing } from '../theme/themes';
import { buildSemanticColors } from '../theme/semantic';

/**
 * Loose Figma Variables REST / plugin export shapes we accept.
 * Supports both `{ variables: [...] }` and flat `{ Spacing/md: 16 }` maps.
 */
export type FigmaVariablesInput =
  | Record<string, unknown>
  | {
      variables?: Array<{
        name: string;
        resolvedType?: string;
        valuesByMode?: Record<string, unknown>;
        value?: unknown;
      }>;
      modes?: unknown;
    };

function flattenVariables(input: FigmaVariablesInput): Record<string, unknown> {
  if (
    input &&
    typeof input === 'object' &&
    Array.isArray((input as { variables?: unknown }).variables)
  ) {
    const out: Record<string, unknown> = {};
    for (const v of (input as { variables: Array<Record<string, unknown>> })
      .variables) {
      const name = String(v.name ?? '');
      if (!name) continue;
      let value = v.value;
      if (value === undefined && v.valuesByMode) {
        const modes = Object.values(v.valuesByMode as Record<string, unknown>);
        value = modes[0];
      }
      // Figma color objects { r, g, b, a } in 0–1
      if (
        value &&
        typeof value === 'object' &&
        'r' in (value as object) &&
        'g' in (value as object) &&
        'b' in (value as object)
      ) {
        const c = value as { r: number; g: number; b: number; a?: number };
        const r = Math.round(c.r * 255);
        const g = Math.round(c.g * 255);
        const b = Math.round(c.b * 255);
        const a = c.a ?? 1;
        value =
          a < 1
            ? `rgba(${r},${g},${b},${Math.round(a * 100) / 100})`
            : `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
      }
      out[name] = value;
    }
    return out;
  }
  return input as Record<string, unknown>;
}

function pickNumber(
  flat: Record<string, unknown>,
  keys: string[],
): number | undefined {
  for (const key of keys) {
    const v = flat[key];
    if (typeof v === 'number' && Number.isFinite(v)) return v;
    if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) {
      return Number(v);
    }
  }
  return undefined;
}

function pickColor(
  flat: Record<string, unknown>,
  keys: string[],
): string | undefined {
  for (const key of keys) {
    const v = flat[key];
    if (typeof v === 'string' && v.length > 0) return v;
  }
  return undefined;
}

function normalizeKey(name: string): string {
  return name.replace(/[/\s]+/g, '/').replace(/^\/+|\/+$/g, '');
}

/**
 * Convert a Figma Variables export into PixelFlow spacing / colors / radii.
 */
export function parseFigmaVariables(input: FigmaVariablesInput): {
  spacing: Partial<ThemeSpacing>;
  radii: Partial<ThemeRadii>;
  colors: Partial<ThemeColors>;
  flat: Record<string, unknown>;
} {
  const raw = flattenVariables(input);
  const flat: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(raw)) {
    flat[normalizeKey(k)] = v;
    flat[k.toLowerCase()] = v;
  }

  const spacing: Partial<ThemeSpacing> = {};
  const xs = pickNumber(flat, [
    'spacing/xs',
    'Spacing/xs',
    'space/xs',
    'xs',
  ]);
  const sm = pickNumber(flat, ['spacing/sm', 'Spacing/sm', 'space/sm', 'sm']);
  const md = pickNumber(flat, ['spacing/md', 'Spacing/md', 'space/md', 'md']);
  const lg = pickNumber(flat, ['spacing/lg', 'Spacing/lg', 'space/lg', 'lg']);
  const xl = pickNumber(flat, ['spacing/xl', 'Spacing/xl', 'space/xl', 'xl']);
  const xxl = pickNumber(flat, [
    'spacing/xxl',
    'Spacing/xxl',
    'space/xxl',
    'xxl',
  ]);
  if (xs !== undefined) spacing.xs = xs;
  if (sm !== undefined) spacing.sm = sm;
  if (md !== undefined) spacing.md = md;
  if (lg !== undefined) spacing.lg = lg;
  if (xl !== undefined) spacing.xl = xl;
  if (xxl !== undefined) spacing.xxl = xxl;

  const radii: Partial<ThemeRadii> = {};
  const rSm = pickNumber(flat, ['radius/sm', 'radii/sm', 'Radius/sm']);
  const rMd = pickNumber(flat, ['radius/md', 'radii/md', 'Radius/md']);
  const rLg = pickNumber(flat, ['radius/lg', 'radii/lg', 'Radius/lg']);
  const rXl = pickNumber(flat, ['radius/xl', 'radii/xl', 'Radius/xl']);
  if (rSm !== undefined) radii.sm = rSm;
  if (rMd !== undefined) radii.md = rMd;
  if (rLg !== undefined) radii.lg = rLg;
  if (rXl !== undefined) radii.xl = rXl;

  const colors: Partial<ThemeColors> = {};
  const primary = pickColor(flat, [
    'color/primary',
    'colors/primary',
    'Primary',
    'primary',
  ]);
  const background = pickColor(flat, [
    'color/background',
    'colors/background',
    'Background',
    'background',
  ]);
  const surface = pickColor(flat, [
    'color/surface',
    'colors/surface',
    'Surface',
    'surface',
  ]);
  const text = pickColor(flat, [
    'color/text',
    'colors/text',
    'Text',
    'text',
    'fg/default',
  ]);
  const border = pickColor(flat, [
    'color/border',
    'colors/border',
    'Border',
    'border',
  ]);
  const danger = pickColor(flat, [
    'color/danger',
    'colors/danger',
    'Danger',
    'danger',
    'error',
  ]);
  if (primary) colors.primary = primary;
  if (background) colors.background = background;
  if (surface) colors.surface = surface;
  if (text) colors.text = text;
  if (border) colors.border = border;
  if (danger) colors.danger = danger;

  return { spacing, radii, colors, flat };
}

/**
 * Build a PixelFlow theme from Figma Variables JSON.
 *
 * @example
 * const theme = themeFromFigma(require('./figma-variables.json'));
 */
export function themeFromFigma(
  input: FigmaVariablesInput,
  options: { base?: 'light' | 'dark'; name?: string } = {},
): PixelFlowTheme {
  const parsed = parseFigmaVariables(input);
  return customTheme({
    base: options.base ?? 'light',
    name: options.name ?? 'figma',
    colors: parsed.colors,
    spacing: { ...defaultSpacing, ...parsed.spacing },
    radii: { ...defaultRadii, ...parsed.radii },
  });
}

/** Emit a TS module string for CLI `pixelflow tokens`. */
export function emitThemeModule(
  input: FigmaVariablesInput,
  options: { base?: 'light' | 'dark'; name?: string } = {},
): string {
  const parsed = parseFigmaVariables(input);
  const theme = themeFromFigma(input, options);
  const semantic = buildSemanticColors(theme.colors);
  return `/* Generated by \`npx pixelflow tokens\` — do not edit by hand */
import type { PixelFlowTheme } from 'react-native-pixelflow';

export const figmaTheme = ${JSON.stringify(
    {
      name: theme.name,
      dark: theme.dark,
      colors: theme.colors,
      spacing: theme.spacing,
      radii: theme.radii,
      motion: theme.motion,
      semantic,
    },
    null,
    2,
  )} as PixelFlowTheme;

export const figmaTokens = ${JSON.stringify(
    {
      spacing: parsed.spacing,
      radii: parsed.radii,
      colors: parsed.colors,
    },
    null,
    2,
  )} as const;
`;
}
