import { describe, expect, it } from 'vitest';
import { parseFigmaVariables, themeFromFigma } from './fromFigma';

describe('fromFigma', () => {
  it('parses flat and variables[] shapes', () => {
    const flat = parseFigmaVariables({
      'spacing/md': 16,
      'color/primary': '#123456',
      'radius/lg': 12,
    });
    expect(flat.spacing.md).toBe(16);
    expect(flat.colors.primary).toBe('#123456');
    expect(flat.radii.lg).toBe(12);

    const listed = parseFigmaVariables({
      variables: [
        { name: 'Spacing/sm', value: 8 },
        {
          name: 'color/background',
          value: { r: 1, g: 1, b: 1, a: 1 },
        },
      ],
    });
    expect(listed.spacing.sm).toBe(8);
    expect(listed.colors.background).toMatch(/^#/i);
  });

  it('builds a theme', () => {
    const theme = themeFromFigma(
      { 'spacing/md': 20, primary: '#00ff00' },
      { name: 'brand' },
    );
    expect(theme.name).toBe('brand');
    expect(theme.spacing.md).toBe(20);
    expect(theme.colors.primary).toBe('#00ff00');
  });
});
