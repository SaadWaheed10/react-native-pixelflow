import { useMemo } from 'react';
import { createTypography, type TypographyScale } from '../typography/typography';
import { useScalingVersion } from './useScaling';
import type { FontFamilyName } from '../fonts/fontRegistry';

/**
 * Live typography scale that recomputes when dimensions / config change.
 * Prefer this over the static `typography` export inside components.
 *
 * @example
 * const { h1, body } = useTypography();
 * const { h1 } = useTypography('poppins');
 */
export function useTypography(
  family: FontFamilyName = 'inter',
): TypographyScale {
  const version = useScalingVersion();
  return useMemo(() => createTypography(family), [family, version]);
}
