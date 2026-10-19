export type Density = 'compact' | 'comfortable' | 'spacious';

/** Multipliers applied to spacing (`rp` / `rm` / theme spacing tokens). */
export const DENSITY_MULTIPLIERS: Record<Density, number> = {
  compact: 0.85,
  comfortable: 1,
  spacious: 1.15,
};

export function getDensityMultiplier(density: Density): number {
  return DENSITY_MULTIPLIERS[density] ?? 1;
}
