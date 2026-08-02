import { fontFamilies, type FontFamilyName } from './fontRegistry';

/**
 * `fonts.inter.bold`, `fonts.poppins.semibold`, etc.
 * Every entry resolves to a font-family string. See README for how to make
 * that string actually load a real typeface, in both Expo and bare RN.
 */
export const fonts = fontFamilies as Record<
  FontFamilyName,
  Record<string, string>
>;

/**
 * Flattened `{ "Inter_400Regular": require(...) }`-shaped map is what
 * `expo-font`'s `useFonts` hook expects. We don't ship font binaries
 * (that would bloat every consumer's bundle even if they use 1 of 21
 * families), so this helper just documents/validates the expected shape —
 * consumers pass their own require() map for the families they actually use.
 *
 * @example
 * import { useFonts } from 'expo-font';
 * import { fonts, buildFontMap } from 'react-native-pixelflow';
 *
 * const [loaded] = useFonts(
 *   buildFontMap('inter', {
 *     regular: require('./assets/fonts/Inter-Regular.ttf'),
 *     bold: require('./assets/fonts/Inter-Bold.ttf'),
 *   })
 * );
 */
export function buildFontMap(
  family: FontFamilyName,
  weightsToAssets: Record<string, number | string>,
): Record<string, number | string> {
  const familyMap = fontFamilies[family];
  const result: Record<string, number | string> = {};
  for (const [weight, asset] of Object.entries(weightsToAssets)) {
    const fontFamilyString = familyMap[weight as keyof typeof familyMap];
    if (fontFamilyString) {
      result[fontFamilyString] = asset;
    }
  }
  return result;
}

/** List of all curated font family keys, for building font pickers/UI. */
export const availableFontFamilies = Object.keys(
  fontFamilies,
) as FontFamilyName[];
