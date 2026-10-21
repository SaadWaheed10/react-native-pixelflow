import { beforeEach, describe, expect, it } from 'vitest';
import { I18nManager } from 'react-native';
import { isRTL, logicalHorizontal, rtlPair } from './rtl';

describe('rtl helpers', () => {
  beforeEach(() => {
    (I18nManager as { isRTL: boolean }).isRTL = false;
  });

  it('maps start/end based on I18nManager.isRTL', () => {
    expect(isRTL()).toBe(false);
    expect(logicalHorizontal(10, 20)).toEqual({ left: 10, right: 20 });
    expect(rtlPair('a', 'b')).toEqual(['a', 'b']);

    (I18nManager as { isRTL: boolean }).isRTL = true;
    expect(isRTL()).toBe(true);
    expect(logicalHorizontal(10, 20)).toEqual({ left: 20, right: 10 });
    expect(rtlPair('a', 'b')).toEqual(['b', 'a']);
  });
});
