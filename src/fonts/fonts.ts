import { fontFamilies, type FontFamilyName } from './fontRegistry';

/**
 * `fonts.inter.bold`, `fonts.poppins.semibold`, etc.
 * Every entry resolves to a font-family string. See README for how to make
 * that string actually load a real typeface, in both Expo and bare RN.
 */
export const fonts = fontFamilies;

/**
 * Flattened `{ "Inter_400Regular": require(...) }`-shaped map for
 * `expo-font`'s `useFonts`. Unknown weight keys are skipped with a
 * `console.warn` so misconfigured maps fail loudly in development.
 *
 * @example
 * import { useFonts } from 'expo-font';
 * import { buildFontMap } from 'react-native-pixelflow';
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
    const fontFamilyString =
      familyMap[weight as keyof typeof familyMap] as string | undefined;
    if (fontFamilyString) {
      result[fontFamilyString] = asset;
    } else if (typeof __DEV__ !== 'undefined' ? __DEV__ : true) {
      console.warn(
        `[react-native-pixelflow] buildFontMap("${family}"): unknown weight "${weight}". ` +
          `Available: ${Object.keys(familyMap).join(', ')}`,
      );
    }
  }
  if (Object.keys(result).length === 0) {
    console.warn(
      `[react-native-pixelflow] buildFontMap("${family}"): no weights mapped. ` +
        `Check that weight keys match the registry (e.g. "regular", "bold").`,
    );
  }
  return result;
}

/** List of all curated font family keys, for building font pickers/UI. */
export const availableFontFamilies = Object.keys(
  fontFamilies,
) as FontFamilyName[];

export type { FontFamilyName };
