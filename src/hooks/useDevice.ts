import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { scalingEngine } from '../core/scalingEngine';
import type { DeviceType, Orientation } from '../types';

export interface UseDeviceResult {
  deviceType: DeviceType;
  orientation: Orientation;
  pixelDensity: number;
  os: typeof Platform.OS;
}

/**
 * @example
 * const { deviceType, orientation, pixelDensity } = useDevice();
 */
export function useDevice(): UseDeviceResult {
  const [snapshot, setSnapshot] = useState(() => scalingEngine.getSnapshot());

  useEffect(() => {
    const unsubscribe = scalingEngine.subscribe(setSnapshot);
    return unsubscribe;
  }, []);

  return {
    deviceType: snapshot.deviceType,
    orientation: snapshot.orientation,
    pixelDensity: snapshot.pixelDensity,
    os: Platform.OS,
  };
}
