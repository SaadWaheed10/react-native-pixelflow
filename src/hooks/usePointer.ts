import { useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

export type PointerType = 'fine' | 'coarse' | 'none';

export interface UsePointerResult {
  /** fine = mouse/trackpad, coarse = touch, none = unknown. */
  pointer: PointerType;
  /** True when hover interactions are meaningful (mouse / trackpad). */
  canHover: boolean;
  /** True on RN Web with a fine pointer. */
  isMouse: boolean;
  /** True when primary input is touch. */
  isTouch: boolean;
}

function getWindow():
  | { matchMedia?: (query: string) => { matches: boolean; addEventListener?: (type: string, listener: () => void) => void; removeEventListener?: (type: string, listener: () => void) => void } }
  | undefined {
  const g = globalThis as { window?: unknown };
  return typeof g.window !== 'undefined'
    ? (g.window as {
        matchMedia?: (query: string) => {
          matches: boolean;
          addEventListener?: (type: string, listener: () => void) => void;
          removeEventListener?: (type: string, listener: () => void) => void;
        };
      })
    : undefined;
}

function detectPointer(): PointerType {
  if (Platform.OS === 'web') {
    const win = getWindow();
    try {
      if (win?.matchMedia?.('(hover: hover) and (pointer: fine)').matches) {
        return 'fine';
      }
      if (win?.matchMedia?.('(pointer: coarse)').matches) {
        return 'coarse';
      }
    } catch {
      /* ignore */
    }
  }
  // Native phones/tablets are coarse; iPad+pointer still reports touch primarily.
  if (Platform.OS === 'ios' || Platform.OS === 'android') return 'coarse';
  return 'none';
}

/**
 * Pointer / hover capability — useful for iPad + RN Web desktop UIs.
 *
 * @example
 * const { canHover } = usePointer();
 * style={createPressStyle({ base, hovered: canHover ? hoverStyle : undefined })}
 */
export function usePointer(): UsePointerResult {
  const [pointer, setPointer] = useState<PointerType>(detectPointer);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const win = getWindow();
    const mq = win?.matchMedia?.('(hover: hover) and (pointer: fine)');
    if (!mq) return;
    const onChange = () => setPointer(detectPointer());
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  return useMemo(
    () => ({
      pointer,
      canHover: pointer === 'fine',
      isMouse: pointer === 'fine',
      isTouch: pointer === 'coarse',
    }),
    [pointer],
  );
}
