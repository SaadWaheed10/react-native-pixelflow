import { describe, expect, it } from 'vitest';
import { getDeviceType, getOrientation } from './deviceDetection';

describe('getDeviceType', () => {
  it('classifies a typical phone', () => {
    expect(getDeviceType(375, 812)).toBe('phone');
    expect(getDeviceType(390, 844)).toBe('phone');
    expect(getDeviceType(360, 800)).toBe('phone');
  });

  it('classifies tablets by shortest edge / diagonal', () => {
    expect(getDeviceType(768, 1024)).toBe('tablet');
    expect(getDeviceType(820, 1180)).toBe('tablet');
    expect(getDeviceType(1024, 1366)).toBe('tablet');
  });

  it('classifies wide near-square large screens as foldable', () => {
    // shortest >= 550, aspect < 1.6, diagonal < 9"
    expect(getDeviceType(674, 841)).toBe('foldable');
  });
});

describe('getOrientation', () => {
  it('returns portrait and landscape', () => {
    expect(getOrientation(375, 812)).toBe('portrait');
    expect(getOrientation(812, 375)).toBe('landscape');
  });
});
