import type { ThemeMotion } from '../types';

export const defaultMotion: ThemeMotion = {
  duration: {
    instant: 0,
    fast: 150,
    normal: 250,
    slow: 400,
  },
  easing: {
    standard: 'ease-in-out',
    entrance: 'ease-out',
    exit: 'ease-in',
  },
};
