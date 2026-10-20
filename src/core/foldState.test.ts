import { beforeEach, describe, expect, it } from 'vitest';
import {
  getFoldState,
  resetFoldState,
  setFoldState,
} from './foldState';

describe('foldState', () => {
  beforeEach(() => {
    resetFoldState();
  });

  it('starts unknown / not native', () => {
    expect(getFoldState()).toMatchObject({
      isFolded: false,
      posture: 'unknown',
      isNative: false,
    });
  });

  it('accepts native posture updates', () => {
    setFoldState({ isFolded: true, posture: 'tabletop' });
    expect(getFoldState()).toMatchObject({
      isFolded: true,
      posture: 'tabletop',
      isNative: true,
    });
  });
});
