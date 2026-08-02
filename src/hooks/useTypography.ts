import { useMemo } from 'react';
import { createTypography, type TypographyScale } from '../typography/typography';
import type { fonts } from '../fonts/fonts';

/**
 * @example
 * const { h1, body } = useTypography();
 * const { h1 } = useTypography('poppins');
 */
export function useTypography(
  family: keyof typeof fonts = 'inter',
): TypographyScale {
  return useMemo(() => createTypography(family), [family]);
}
