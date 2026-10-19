/**
 * Common Figma / design-tool frames. Pass the preset name to
 * `configure({ figma: 'iPhone 14' })` instead of memorizing width/height.
 */
export const FIGMA_PRESETS = {
  'iPhone SE': { width: 375, height: 667 },
  'iPhone 11': { width: 375, height: 812 },
  'iPhone 12': { width: 390, height: 844 },
  'iPhone 13': { width: 390, height: 844 },
  'iPhone 14': { width: 390, height: 844 },
  'iPhone 14 Pro': { width: 393, height: 852 },
  'iPhone 14 Pro Max': { width: 430, height: 932 },
  'iPhone 15': { width: 393, height: 852 },
  'iPhone 15 Pro Max': { width: 430, height: 932 },
  'iPhone 16': { width: 393, height: 852 },
  'iPhone 16 Pro Max': { width: 440, height: 956 },
  'Pixel 7': { width: 412, height: 915 },
  'Pixel 8': { width: 412, height: 915 },
  'Android Compact': { width: 360, height: 800 },
  'iPad Mini': { width: 768, height: 1024 },
  'iPad Air': { width: 820, height: 1180 },
  'iPad Pro 11': { width: 834, height: 1194 },
  'iPad Pro 12.9': { width: 1024, height: 1366 },
} as const;

export type FigmaPresetName = keyof typeof FIGMA_PRESETS;

export type FigmaFrame =
  | FigmaPresetName
  | { width: number; height: number };

export function resolveFigmaFrame(figma: FigmaFrame): {
  width: number;
  height: number;
  preset?: FigmaPresetName;
} {
  if (typeof figma === 'string') {
    const preset = FIGMA_PRESETS[figma];
    if (!preset) {
      throw new Error(
        `[react-native-pixelflow] Unknown Figma preset "${figma}". ` +
          `Available: ${Object.keys(FIGMA_PRESETS).join(', ')}`,
      );
    }
    return { width: preset.width, height: preset.height, preset: figma };
  }
  if (
    typeof figma.width !== 'number' ||
    typeof figma.height !== 'number' ||
    figma.width <= 0 ||
    figma.height <= 0
  ) {
    throw new Error(
      '[react-native-pixelflow] configure({ figma }) expects { width, height } with positive numbers.',
    );
  }
  return { width: figma.width, height: figma.height };
}

export function listFigmaPresets(): FigmaPresetName[] {
  return Object.keys(FIGMA_PRESETS) as FigmaPresetName[];
}
