import { beforeEach, describe, expect, it } from 'vitest';
import {
  applyHydrateLock,
  clearHydrateLock,
  getHydrateLock,
  setHydrateLock,
} from './hydrateLock';

describe('hydrateLock', () => {
  beforeEach(() => {
    clearHydrateLock();
  });

  it('freezes width/height until cleared', () => {
    setHydrateLock({ width: 390, height: 844 });
    expect(getHydrateLock().locked).toBe(true);
    expect(applyHydrateLock(1200, 800)).toEqual({ width: 390, height: 844 });
    clearHydrateLock();
    expect(applyHydrateLock(1200, 800)).toEqual({ width: 1200, height: 800 });
  });
});
