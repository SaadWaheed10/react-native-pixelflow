import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';

type Style = ViewStyle | TextStyle | ImageStyle;

type VariantMap = Record<string, Record<string, Style>>;

type VariantSelection<V extends VariantMap> = {
  [K in keyof V]?: keyof V[K];
};

type CompoundVariant = {
  /** Variant keys that must match. */
  [key: string]: string | Style | undefined;
  style: Style;
};

export interface CreateVariantsConfig<V extends VariantMap> {
  base?: Style;
  variants?: V;
  compoundVariants?: Array<VariantSelection<V> & { style: Style }>;
  defaultVariants?: VariantSelection<V>;
}

/**
 * Build a style factory with variants + compound variants (Tamagui/Restyle-style).
 *
 * @example
 * const button = createVariants({
 *   base: { borderRadius: 8, padding: 12 },
 *   variants: {
 *     intent: {
 *       primary: { backgroundColor: '#4F46E5' },
 *       danger: { backgroundColor: '#EF4444' },
 *     },
 *     size: {
 *       sm: { padding: 8 },
 *       lg: { padding: 16 },
 *     },
 *   },
 *   compoundVariants: [
 *     { intent: 'danger', size: 'lg', style: { borderWidth: 2 } },
 *   ],
 *   defaultVariants: { intent: 'primary', size: 'sm' },
 * });
 *
 * <View style={button({ intent: 'danger', size: 'lg' })} />
 */
export function createVariants<V extends VariantMap>(
  config: CreateVariantsConfig<V>,
): (props?: VariantSelection<V>) => Style[] {
  const {
    base = {},
    variants = {} as V,
    compoundVariants = [],
    defaultVariants = {},
  } = config;

  return (props: VariantSelection<V> = {}) => {
    const merged: VariantSelection<V> = { ...defaultVariants, ...props };
    const styles: Style[] = [base];

    (Object.keys(variants) as (keyof V)[]).forEach((variantKey) => {
      const selected = merged[variantKey];
      if (selected === undefined) return;
      const map = variants[variantKey];
      const style = map[selected as string];
      if (style) styles.push(style);
    });

    compoundVariants.forEach((compound) => {
      const { style, ...conditions } = compound as CompoundVariant;
      const matches = Object.entries(conditions).every(([key, expected]) => {
        if (expected === undefined) return true;
        return (merged as Record<string, unknown>)[key] === expected;
      });
      if (matches) styles.push(style);
    });

    return styles;
  };
}
