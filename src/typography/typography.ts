import type { TextStyle } from 'react-native';
import { rf, rl, rls } from '../responsive/responsive';
import { fonts } from '../fonts/fonts';

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
 * Builds a responsive typography scale. Called once at module load with the
 * default family (`inter`); call `createTypography('poppins')` yourself for
 * a different default face, or override `fontFamily` per-style as needed.
 */
export function createTypography(
  family: keyof typeof fonts = 'inter',
): TypographyScale {
  const f = fonts[family];
  return {
    h1: {
      fontSize: rf(32),
      lineHeight: rl(40),
      fontFamily: f.bold ?? f.regular,
      letterSpacing: rls(-0.5),
    },
    h2: {
      fontSize: rf(26),
      lineHeight: rl(34),
      fontFamily: f.bold ?? f.regular,
      letterSpacing: rls(-0.25),
    },
    h3: {
      fontSize: rf(21),
      lineHeight: rl(28),
      fontFamily: f.semibold ?? f.medium ?? f.regular,
    },
    subtitle: {
      fontSize: rf(17),
      lineHeight: rl(24),
      fontFamily: f.medium ?? f.regular,
    },
    body: {
      fontSize: rf(15),
      lineHeight: rl(22),
      fontFamily: f.regular,
    },
    bodySmall: {
      fontSize: rf(13),
      lineHeight: rl(18),
      fontFamily: f.regular,
    },
    caption: {
      fontSize: rf(11),
      lineHeight: rl(16),
      fontFamily: f.regular,
      letterSpacing: rls(0.2),
    },
    button: {
      fontSize: rf(15),
      lineHeight: rl(20),
      fontFamily: f.semibold ?? f.medium ?? f.bold,
      letterSpacing: rls(0.15),
    },
  };
}

/** Default typography scale using Inter. Import `createTypography` for custom fonts. */
export const typography: TypographyScale = createTypography('inter');
