import { useMemo } from 'react';
import { useScalingSnapshot } from './useScaling';
import {
  getWindowWidthClass,
  type WindowWidthClass,
} from '../adaptive/windowClass';

export interface UseMultiWindowResult {
  /**
   * True when the physical device is tablet/foldable but the *window* is
   * compact — typical Android multi-window / split-screen / Stage Manager.
   */
  isMultiWindow: boolean;
  /**
   * Prefer phone-style compact layout even on large devices.
   * Same signal as `isMultiWindow` today; named for call-site clarity.
   */
  forceCompact: boolean;
  /** Live window class (already reflects the shrunk window). */
  widthClass: WindowWidthClass;
  deviceType: ReturnType<typeof useScalingSnapshot>['deviceType'];
  width: number;
  height: number;
}

/**
 * Detect narrow windows on large devices (split-screen / multi-window).
 * Use to avoid “scaled-up phone UI” that still assumes full-tablet chrome.
 *
 * @example
 * const { forceCompact } = useMultiWindow();
 * if (forceCompact) return <PhoneShell />;
 */
export function useMultiWindow(): UseMultiWindowResult {
  const snapshot = useScalingSnapshot();

  return useMemo(() => {
    const widthClass = getWindowWidthClass(snapshot.width);
    const largeDevice = snapshot.isTablet || snapshot.isFoldable;
    const isMultiWindow = largeDevice && widthClass === 'compact';

    return {
      isMultiWindow,
      forceCompact: isMultiWindow,
      widthClass,
      deviceType: snapshot.deviceType,
      width: snapshot.width,
      height: snapshot.height,
    };
  }, [
    snapshot.width,
    snapshot.height,
    snapshot.isTablet,
    snapshot.isFoldable,
    snapshot.deviceType,
  ]);
}
