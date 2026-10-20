import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getConfig } from '../core/config';
import { useScalingSnapshot } from '../hooks/useScaling';
import { useWindowClass } from '../adaptive/windowClass';
import { useMultiWindow } from '../hooks/useMultiWindow';
import { useFoldState } from '../hooks/useFoldState';
import { useAdaptiveNav } from '../hooks/useAdaptiveNav';
import { rf, rp } from '../responsive/responsive';
import { getSafeInsets } from '../core/safeInsets';

export interface PixelFlowDebugProps {
  /** Force show even outside __DEV__. Default false. */
  force?: boolean;
  /** Corner placement. Default `top-right`. */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

/**
 * Floating inspector — window class, columns, multi-window, fold, density.
 * Renders only in `__DEV__` unless `force` is set.
 *
 * @example
 * {__DEV__ && <PixelFlowDebug />}
 */
export function PixelFlowDebug({
  force = false,
  position = 'top-right',
}: PixelFlowDebugProps): React.JSX.Element | null {
  const isDev =
    typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';
  const snapshot = useScalingSnapshot();
  const { widthClass, columns, nav, contentMaxWidth, horizontalPadding } =
    useWindowClass();
  const { isMultiWindow, forceCompact } = useMultiWindow();
  const fold = useFoldState();
  const adaptiveNav = useAdaptiveNav();
  const config = getConfig();
  const insets = getSafeInsets();

  const lines = useMemo(
    () => [
      `class ${widthClass} · ${columns}col · content≤${Math.round(contentMaxWidth)}`,
      `nav ${nav}→${adaptiveNav.mode} · pad ${Math.round(horizontalPadding)}`,
      `${snapshot.deviceType} · ${snapshot.orientation}`,
      `${Math.round(snapshot.width)}×${Math.round(snapshot.height)} · dens ${config.density}`,
      `scale ${snapshot.scale.toFixed(2)} · font ${snapshot.fontScale.toFixed(2)}`,
      `rf16=${rf(16)} rp16=${rp(16)}`,
      isMultiWindow
        ? `multi-window · forceCompact=${forceCompact ? 'yes' : 'no'}`
        : 'window full-device',
      fold.isNative
        ? `fold native · ${fold.posture}${fold.preferTabletopSplit ? ' · tabletop' : ''}`
        : fold.isLikelyFoldable
          ? `fold heuristic · ${fold.posture}`
          : 'fold none',
      config.figmaPreset
        ? `figma ${config.figmaPreset}`
        : `base ${config.baseWidth}×${config.baseHeight}`,
      `safe t${Math.round(insets.top)} b${Math.round(insets.bottom)}`,
    ],
    [
      widthClass,
      columns,
      contentMaxWidth,
      horizontalPadding,
      nav,
      adaptiveNav.mode,
      snapshot,
      config,
      insets,
      isMultiWindow,
      forceCompact,
      fold,
    ],
  );

  if (!force && !isDev) return null;

  const anchor =
    position === 'top-left'
      ? styles.topLeft
      : position === 'bottom-left'
        ? styles.bottomLeft
        : position === 'bottom-right'
          ? styles.bottomRight
          : styles.topRight;

  return (
    <View pointerEvents="none" style={[styles.badge, anchor]}>
      <Text style={styles.title}>PixelFlow</Text>
      {lines.map((line) => (
        <Text key={line} style={styles.line}>
          {line}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    zIndex: 9999,
    maxWidth: 260,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
  },
  topRight: { top: 52, right: 10 },
  topLeft: { top: 52, left: 10 },
  bottomRight: { bottom: 24, right: 10 },
  bottomLeft: { bottom: 24, left: 10 },
  title: {
    color: '#A5B4FC',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  line: {
    color: '#E2E8F0',
    fontSize: 10,
    lineHeight: 14,
    fontVariant: ['tabular-nums'],
  },
});
