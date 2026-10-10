import type { TextStyle } from 'react-native';
import { rf, rl, rls } from '../responsive/responsive';
import { fonts } from '../fonts/fonts';
import type { FontFamilyName } from '../fonts/fontRegistry';

export interface TypographyScale {
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  subtitle: TextStyle;
  body: TextStyle;
  bodySmall: TextStyle;
  caption: TextStyle;
  button: TextStyle;
}

/**
 * Builds a responsive typography scale for the current engine snapshot.
 * Prefer `useTypography()` inside components so values stay live across
 * rotation / config changes. The default `typography` export recomputes on
 * each property access via a Proxy (still freeze if you spread into a
 * module-level StyleSheet — use `useScaledStyles` or `useTypography` instead).
 */
export function createTypography(
  family: FontFamilyName = 'inter',
): TypographyScale {
  const f = fonts[family];
  const regular = f.regular ?? fonts.inter.regular;
  return {
    h1: {
      fontSize: rf(32),
      lineHeight: rl(40),
      fontFamily: f.bold ?? regular,
      letterSpacing: rls(-0.5),
    },
    h2: {
      fontSize: rf(26),
      lineHeight: rl(34),
      fontFamily: f.bold ?? regular,
      letterSpacing: rls(-0.25),
    },
    h3: {
      fontSize: rf(21),
      lineHeight: rl(28),
      fontFamily: f.semibold ?? f.medium ?? regular,
    },
    subtitle: {
      fontSize: rf(17),
      lineHeight: rl(24),
      fontFamily: f.medium ?? regular,
    },
    body: {
      fontSize: rf(15),
      lineHeight: rl(22),
      fontFamily: regular,
    },
    bodySmall: {
      fontSize: rf(13),
      lineHeight: rl(18),
      fontFamily: regular,
    },
    caption: {
      fontSize: rf(11),
      lineHeight: rl(16),
      fontFamily: regular,
      letterSpacing: rls(0.2),
    },
    button: {
      fontSize: rf(15),
      lineHeight: rl(20),
      fontFamily: f.semibold ?? f.medium ?? f.bold ?? regular,
      letterSpacing: rls(0.15),
    },
  };
}

const typographyKeys: (keyof TypographyScale)[] = [
  'h1',
  'h2',
  'h3',
  'subtitle',
  'body',
  'bodySmall',
  'caption',
  'button',
];

/**
 * Default Inter scale. Each property access rebuilds from the current
 * scaling snapshot so ad-hoc reads during render stay fresh. For StyleSheets
 * that must update on rotation, use `useTypography()` or `useScaledStyles()`.
 */
export const typography: TypographyScale = new Proxy({} as TypographyScale, {
  get(_target, prop: string | symbol) {
    if (typeof prop === 'string' && typographyKeys.includes(prop as keyof TypographyScale)) {
      return createTypography('inter')[prop as keyof TypographyScale];
    }
    return undefined;
  },
});
