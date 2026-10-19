import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Track the OS “Reduce Motion” setting for animation defaults.
 *
 * @example
 * const reduceMotion = useReduceMotion();
 * const duration = reduceMotion ? 0 : 250;
 */
export function useReduceMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled?.().then((enabled) => {
      if (mounted) setReduceMotion(Boolean(enabled));
    });
    const sub = AccessibilityInfo.addEventListener?.(
      'reduceMotionChanged',
      setReduceMotion,
    );
    return () => {
      mounted = false;
      // RN returns subscription with remove(), or legacy removeEventListener
      if (sub && typeof (sub as { remove?: () => void }).remove === 'function') {
        (sub as { remove: () => void }).remove();
      }
    };
  }, []);

  return reduceMotion;
}
