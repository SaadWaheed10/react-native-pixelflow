import { beforeEach, describe, expect, it } from 'vitest';
import { resetPixelFlow, assertLayout, LAYOUT_FIXTURES } from './index';

describe('layoutAssert', () => {
  beforeEach(() => {
    resetPixelFlow();
  });

  it('asserts phone compact metrics near baseline', () => {
    const snap = assertLayout({
      fixture: 'phoneSE',
      expect: {
        widthClass: 'compact',
        width: 375,
        rp16: 16,
      },
      tolerance: 1,
    });
    expect(snap.fixture).toBe('phoneSE');
  });

  it('exposes named fixtures', () => {
    expect(LAYOUT_FIXTURES.tablet.width).toBeGreaterThan(600);
  });
});
