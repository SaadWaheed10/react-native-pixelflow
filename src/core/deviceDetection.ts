import { Dimensions, Platform, PixelRatio } from 'react-native';
import type { DeviceType, Orientation } from '../types';

/**
 * Tablets: RN has no official API for this, so we combine the shorter-edge
 * physical size (via PixelRatio) with a minimum-dimension heuristic, which
 * is the same approach used by most production RN apps.
 */
export function getDeviceType(width: number, height: number): DeviceType {
  const shortestEdge = Math.min(width, height);
  const longestEdge = Math.max(width, height);
  const aspectRatio = longestEdge / shortestEdge;

  const pixelDensity = PixelRatio.get();
  const adjustedWidth = shortestEdge * pixelDensity;
  const adjustedHeight = longestEdge * pixelDensity;
  const diagonalPixels = Math.sqrt(adjustedWidth ** 2 + adjustedHeight ** 2);
  const diagonalInches = diagonalPixels / (pixelDensity * 160);

  // Foldables (unfolded): wide, near-square-ish aspect ratio, large shortest edge.
  const isFoldable =
    shortestEdge >= 550 && aspectRatio < 1.6 && diagonalInches < 9;

  if (isFoldable) return 'foldable';

  // Tablets: physically large screen OR a shortest edge that phones don't reach.
  const isTablet = diagonalInches >= 7 || shortestEdge >= 600;

  if (isTablet) return 'tablet';

  return 'phone';
}

export function getOrientation(width: number, height: number): Orientation {
  return width > height ? 'landscape' : 'portrait';
}

export function isIOS(): boolean {
  return Platform.OS === 'ios';
}

export function isAndroid(): boolean {
  return Platform.OS === 'android';
}

/**
 * Best-effort notch / Dynamic Island / status-bar-inset detection.
 * We don't hardcode a device list (it goes stale immediately); instead we
 * use documented heuristics based on OS + status bar behavior, and let
 * consumers override via SafeAreaProvider insets when available.
 */
export function hasIncreasedStatusBar(): boolean {
  if (Platform.OS !== 'ios') return false;
  const { height, width } = Dimensions.get('window');
  const shortestEdge = Math.min(height, width);
  const longestEdge = Math.max(height, width);
  // iPhone X-class and later all have a shortest edge >= 375 and a
  // longest/shortest ratio consistent with edge-to-edge notch/island displays.
  return shortestEdge >= 375 && longestEdge / shortestEdge > 2.1;
}
