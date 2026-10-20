import { describe, expect, it } from 'vitest';
import { parseAspectRatio } from './AspectBox';

describe('parseAspectRatio', () => {
  it('parses colon ratios and numbers', () => {
    expect(parseAspectRatio('16:9')).toBeCloseTo(16 / 9);
    expect(parseAspectRatio('1:1')).toBe(1);
    expect(parseAspectRatio(1.5)).toBe(1.5);
    expect(parseAspectRatio('bad')).toBe(1);
    expect(parseAspectRatio(0)).toBe(1);
  });
});
