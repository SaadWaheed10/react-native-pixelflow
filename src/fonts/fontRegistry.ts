import type { FontFamilyMap } from '../types';

/**
 * Family name -> weight -> font-family string.
 *
 * The strings follow the naming convention used by the `@expo-google-fonts/*`
 * packages (e.g. "Inter_400Regular"), which is also the convention most bare
 * React Native projects use when manually linking Google Fonts .ttf files
 * into `android/app/src/main/assets/fonts` and the iOS bundle. This means
 * `fonts.inter.bold` resolves to the correct family string regardless of
 * whether you load fonts via Expo or via manually-linked native font files —
 * see fontLoader.ts and the README for both setups.
 */
export const fontFamilies: Record<string, FontFamilyMap> = {
  inter: {
    thin: 'Inter_100Thin',
    extraLight: 'Inter_200ExtraLight',
    light: 'Inter_300Light',
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    extraBold: 'Inter_800ExtraBold',
    black: 'Inter_900Black',
  },
  roboto: {
    thin: 'Roboto_100Thin',
    light: 'Roboto_300Light',
    regular: 'Roboto_400Regular',
    medium: 'Roboto_500Medium',
    bold: 'Roboto_700Bold',
    black: 'Roboto_900Black',
  },
  poppins: {
    thin: 'Poppins_100Thin',
    extraLight: 'Poppins_200ExtraLight',
    light: 'Poppins_300Light',
    regular: 'Poppins_400Regular',
    medium: 'Poppins_500Medium',
    semibold: 'Poppins_600SemiBold',
    bold: 'Poppins_700Bold',
    extraBold: 'Poppins_800ExtraBold',
    black: 'Poppins_900Black',
  },
  montserrat: {
    thin: 'Montserrat_100Thin',
    extraLight: 'Montserrat_200ExtraLight',
    light: 'Montserrat_300Light',
    regular: 'Montserrat_400Regular',
    medium: 'Montserrat_500Medium',
    semibold: 'Montserrat_600SemiBold',
    bold: 'Montserrat_700Bold',
    extraBold: 'Montserrat_800ExtraBold',
    black: 'Montserrat_900Black',
  },
  openSans: {
    light: 'OpenSans_300Light',
    regular: 'OpenSans_400Regular',
    medium: 'OpenSans_500Medium',
    semibold: 'OpenSans_600SemiBold',
    bold: 'OpenSans_700Bold',
    extraBold: 'OpenSans_800ExtraBold',
  },
  lato: {
    thin: 'Lato_100Thin',
    light: 'Lato_300Light',
    regular: 'Lato_400Regular',
    bold: 'Lato_700Bold',
    black: 'Lato_900Black',
  },
  nunito: {
    light: 'Nunito_300Light',
    regular: 'Nunito_400Regular',
    medium: 'Nunito_500Medium',
    semibold: 'Nunito_600SemiBold',
    bold: 'Nunito_700Bold',
    extraBold: 'Nunito_800ExtraBold',
    black: 'Nunito_900Black',
  },
  raleway: {
    thin: 'Raleway_100Thin',
    light: 'Raleway_300Light',
    regular: 'Raleway_400Regular',
    medium: 'Raleway_500Medium',
    semibold: 'Raleway_600SemiBold',
    bold: 'Raleway_700Bold',
    extraBold: 'Raleway_800ExtraBold',
    black: 'Raleway_900Black',
  },
  outfit: {
    thin: 'Outfit_100Thin',
    light: 'Outfit_300Light',
    regular: 'Outfit_400Regular',
    medium: 'Outfit_500Medium',
    semibold: 'Outfit_600SemiBold',
    bold: 'Outfit_700Bold',
    black: 'Outfit_900Black',
  },
  rubik: {
    light: 'Rubik_300Light',
    regular: 'Rubik_400Regular',
    medium: 'Rubik_500Medium',
    semibold: 'Rubik_600SemiBold',
    bold: 'Rubik_700Bold',
    black: 'Rubik_900Black',
  },
  workSans: {
    thin: 'WorkSans_100Thin',
    light: 'WorkSans_300Light',
    regular: 'WorkSans_400Regular',
    medium: 'WorkSans_500Medium',
    semibold: 'WorkSans_600SemiBold',
    bold: 'WorkSans_700Bold',
    black: 'WorkSans_900Black',
  },
  urbanist: {
    light: 'Urbanist_300Light',
    regular: 'Urbanist_400Regular',
    medium: 'Urbanist_500Medium',
    semibold: 'Urbanist_600SemiBold',
    bold: 'Urbanist_700Bold',
    black: 'Urbanist_900Black',
  },
  manrope: {
    light: 'Manrope_300Light',
    regular: 'Manrope_400Regular',
    medium: 'Manrope_500Medium',
    semibold: 'Manrope_600SemiBold',
    bold: 'Manrope_700Bold',
    extraBold: 'Manrope_800ExtraBold',
  },
  dmSans: {
    light: 'DMSans_300Light',
    regular: 'DMSans_400Regular',
    medium: 'DMSans_500Medium',
    bold: 'DMSans_700Bold',
  },
  plusJakartaSans: {
    light: 'PlusJakartaSans_300Light',
    regular: 'PlusJakartaSans_400Regular',
    medium: 'PlusJakartaSans_500Medium',
    semibold: 'PlusJakartaSans_600SemiBold',
    bold: 'PlusJakartaSans_700Bold',
    extraBold: 'PlusJakartaSans_800ExtraBold',
  },
  mulish: {
    light: 'Mulish_300Light',
    regular: 'Mulish_400Regular',
    medium: 'Mulish_500Medium',
    semibold: 'Mulish_600SemiBold',
    bold: 'Mulish_700Bold',
    black: 'Mulish_900Black',
  },
  ubuntu: {
    light: 'Ubuntu_300Light',
    regular: 'Ubuntu_400Regular',
    medium: 'Ubuntu_500Medium',
    bold: 'Ubuntu_700Bold',
  },
  quicksand: {
    light: 'Quicksand_300Light',
    regular: 'Quicksand_400Regular',
    medium: 'Quicksand_500Medium',
    semibold: 'Quicksand_600SemiBold',
    bold: 'Quicksand_700Bold',
  },
  merriweather: {
    light: 'Merriweather_300Light',
    regular: 'Merriweather_400Regular',
    bold: 'Merriweather_700Bold',
    black: 'Merriweather_900Black',
  },
  playfairDisplay: {
    regular: 'PlayfairDisplay_400Regular',
    medium: 'PlayfairDisplay_500Medium',
    semibold: 'PlayfairDisplay_600SemiBold',
    bold: 'PlayfairDisplay_700Bold',
    black: 'PlayfairDisplay_900Black',
  },
  notoSans: {
    light: 'NotoSans_300Light',
    regular: 'NotoSans_400Regular',
    medium: 'NotoSans_500Medium',
    semibold: 'NotoSans_600SemiBold',
    bold: 'NotoSans_700Bold',
  },
};

export type FontFamilyName = keyof typeof fontFamilies;
