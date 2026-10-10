import { Platform } from 'react-native';
import { useScalingSnapshot } from './useScaling';

export interface UseDeviceResult {
  deviceType: ReturnType<typeof useScalingSnapshot>['deviceType'];
  orientation: ReturnType<typeof useScalingSnapshot>['orientation'];
  pixelDensity: number;
  os: typeof Platform.OS;
}

/**
 * @example
 * const { deviceType, orientation, pixelDensity } = useDevice();
 */
export function useDevice(): UseDeviceResult {
  const snapshot = useScalingSnapshot();

  return {
    deviceType: snapshot.deviceType,
    orientation: snapshot.orientation,
    pixelDensity: snapshot.pixelDensity,
    os: Platform.OS,
  };
}
