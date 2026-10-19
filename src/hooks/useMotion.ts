import { useMemo } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { useReduceMotion } from './useReduceMotion';
import type { ThemeMotion } from '../types';

export interface UseMotionResult extends ThemeMotion {
  /** True when OS Reduce Motion is on. */
  reduceMotion: boolean;
  /** Pick a duration that becomes 0 when reduce-motion is enabled. */
  durationOf: (key: keyof ThemeMotion['duration']) => number;
}

/**
 * Motion tokens that honor the OS Reduce Motion setting.
 *
 * @example
 * const motion = useMotion();
 * Animated.timing(value, { duration: motion.durationOf('normal'), … })
 */
export function useMotion(): UseMotionResult {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();

  return useMemo(() => {
    const duration = reduceMotion
      ? {
          instant: 0,
          fast: 0,
          normal: 0,
          slow: 0,
        }
      : theme.motion.duration;

    return {
      duration,
      easing: theme.motion.easing,
      reduceMotion,
      durationOf: (key) => duration[key],
    };
  }, [theme.motion, reduceMotion]);
}
