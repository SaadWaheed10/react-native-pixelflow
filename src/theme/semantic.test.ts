import { describe, expect, it } from 'vitest';
import { lightTheme } from './themes';
import { resolveColor } from '../tokens/resolveTokens';
import { matchMediaQuery } from '../hooks/useMedia';
import { mockDimensions, resetPixelFlow } from '../testing';
import { rp } from '../responsive/responsive';
import { beforeEach } from 'vitest';

describe('semantic colors', () => {
  it('resolves dotted semantic paths', () => {
    expect(resolveColor('bg.subtle', lightTheme)).toBe(lightTheme.semantic.bg.subtle);
    expect(resolveColor('fg.muted', lightTheme)).toBe(lightTheme.semantic.fg.muted);
    expect(resolveColor('border.focus', lightTheme)).toBe(
      lightTheme.semantic.border.focus,
    );
    expect(resolveColor('primary', lightTheme)).toBe(lightTheme.colors.primary);
  });
});

describe('matchMediaQuery + testing utils', () => {
  beforeEach(() => {
    resetPixelFlow();
  });

  it('mockDimensions drives scaling', () => {
    mockDimensions({ width: 375, height: 812 });
    expect(rp(16)).toBe(16);
    mockDimensions({ width: 750, height: 1624 });
    expect(rp(16)).toBeGreaterThan(16);
  });

  it('evaluates media queries', () => {
    expect(
      matchMediaQuery(
        { minWidth: 600, landscape: true },
        800,
        400,
        'medium',
        'landscape',
      ),
    ).toBe(true);
    expect(
      matchMediaQuery({ minClass: 'expanded' }, 700, 900, 'medium', 'portrait'),
    ).toBe(false);
  });
});
