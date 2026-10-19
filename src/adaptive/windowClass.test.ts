import { describe, expect, it } from 'vitest';
import {
  getWindowWidthClass,
  windowClassMeets,
} from './windowClass';
import { computeGrid } from './grid';

describe('getWindowWidthClass', () => {
  it('classifies Material breakpoints', () => {
    expect(getWindowWidthClass(375)).toBe('compact');
    expect(getWindowWidthClass(600)).toBe('medium');
    expect(getWindowWidthClass(839)).toBe('medium');
    expect(getWindowWidthClass(840)).toBe('expanded');
    expect(getWindowWidthClass(1200)).toBe('large');
    expect(getWindowWidthClass(1600)).toBe('extraLarge');
  });

  it('windowClassMeets compares ordered classes', () => {
    expect(windowClassMeets('expanded', 'medium')).toBe(true);
    expect(windowClassMeets('compact', 'medium')).toBe(false);
  });
});

describe('computeGrid', () => {
  it('fits columns from min item width', () => {
    // On baseline phone, rp is ~identity: width 375, gap 12, min 160
    // floor((375+12)/(160+12)) = floor(387/172) = 2
    const result = computeGrid(375, { minItemWidth: 160, gap: 12 });
    expect(result.columns).toBe(2);
    expect(result.itemWidth).toBeCloseTo((375 - 12) / 2, 5);
  });

  it('respects maxColumns', () => {
    const result = computeGrid(1000, {
      minItemWidth: 100,
      gap: 8,
      maxColumns: 3,
    });
    expect(result.columns).toBe(3);
  });
});
