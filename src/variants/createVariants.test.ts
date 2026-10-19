import { describe, expect, it } from 'vitest';
import { createVariants } from './createVariants';

describe('createVariants', () => {
  const button = createVariants({
    base: { borderRadius: 8 },
    variants: {
      intent: {
        primary: { backgroundColor: 'blue' },
        danger: { backgroundColor: 'red' },
      },
      size: {
        sm: { padding: 8 },
        lg: { padding: 16 },
      },
    },
    compoundVariants: [
      { intent: 'danger', size: 'lg', style: { borderWidth: 2 } },
    ],
    defaultVariants: { intent: 'primary', size: 'sm' },
  });

  it('applies defaults and variants', () => {
    const styles = button();
    expect(styles).toEqual(
      expect.arrayContaining([
        { borderRadius: 8 },
        { backgroundColor: 'blue' },
        { padding: 8 },
      ]),
    );
  });

  it('applies compound variants', () => {
    const styles = button({ intent: 'danger', size: 'lg' });
    expect(styles).toEqual(
      expect.arrayContaining([
        { backgroundColor: 'red' },
        { padding: 16 },
        { borderWidth: 2 },
      ]),
    );
  });
});
