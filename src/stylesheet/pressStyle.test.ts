import { describe, expect, it } from 'vitest';
import { createPressStyle } from './pressStyle';

describe('createPressStyle', () => {
  it('applies base and pressed layers', () => {
    const style = createPressStyle({
      base: { opacity: 1 },
      pressed: { opacity: 0.5 },
    });
    expect(style({ pressed: false })).toEqual([{ opacity: 1 }]);
    expect(style({ pressed: true })).toEqual([{ opacity: 1 }, { opacity: 0.5 }]);
  });

  it('applies disabled when isDisabled is true', () => {
    const style = createPressStyle(
      {
        base: { opacity: 1 },
        disabled: { opacity: 0.3 },
      },
      true,
    );
    expect(style({ pressed: false })).toEqual([{ opacity: 1 }, { opacity: 0.3 }]);
  });
});
