import { describe, expect, it } from 'vitest';
import { createNavigationTheme, navigationThemes } from './createNavigationTheme';
import { lightTheme } from '../theme/themes';

describe('createNavigationTheme', () => {
  it('maps PixelFlow colors into navigation theme shape', () => {
    const nav = createNavigationTheme({ theme: lightTheme });
    expect(nav.dark).toBe(false);
    expect(nav.colors.primary).toBe(lightTheme.colors.primary);
    expect(nav.colors.background).toBe(lightTheme.colors.background);
    expect(navigationThemes.dark.dark).toBe(true);
  });
});
