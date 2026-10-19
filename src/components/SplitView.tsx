import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import {
  useWindowClass,
  windowClassMeets,
  type WindowWidthClass,
} from '../adaptive/windowClass';
import { rp } from '../responsive/responsive';

export interface SplitViewProps {
  /** Left / list pane. */
  master: React.ReactNode;
  /** Right / detail pane (shown when split). */
  detail: React.ReactNode;
  /**
   * Minimum window class (or absolute width) required to show both panes.
   * Default `'medium'` (600dp).
   */
  breakpoint?: WindowWidthClass | number;
  /**
   * Master pane width when split. Design px (scaled with `rp`) unless
   * `masterWidthMode` is `'absolute'`. Default 320.
   */
  masterWidth?: number;
  masterWidthMode?: 'design' | 'absolute';
  /** Gap between panes (design px). Default 0. */
  gap?: number;
  /**
   * Below breakpoint: show only master (default), only detail, or stack
   * master above detail.
   */
  compactMode?: 'master' | 'detail' | 'stack';
  style?: StyleProp<ViewStyle>;
  masterStyle?: StyleProp<ViewStyle>;
  detailStyle?: StyleProp<ViewStyle>;
}

function shouldSplit(
  width: number,
  widthClass: WindowWidthClass,
  breakpoint: WindowWidthClass | number,
): boolean {
  if (typeof breakpoint === 'number') return width >= breakpoint;
  return windowClassMeets(widthClass, breakpoint);
}

/**
 * Master–detail shell: one pane on phones, side-by-side from `breakpoint` up.
 *
 * @example
 * <SplitView
 *   breakpoint="medium"
 *   master={<ConversationList />}
 *   detail={<ConversationThread />}
 * />
 */
export function SplitView({
  master,
  detail,
  breakpoint = 'medium',
  masterWidth = 320,
  masterWidthMode = 'design',
  gap = 0,
  compactMode = 'master',
  style,
  masterStyle,
  detailStyle,
}: SplitViewProps): React.JSX.Element {
  const { width, widthClass } = useWindowClass();
  const split = shouldSplit(width, widthClass, breakpoint);
  const resolvedMasterWidth =
    masterWidthMode === 'absolute' ? masterWidth : rp(masterWidth);
  const resolvedGap = rp(gap);

  if (!split) {
    if (compactMode === 'detail') {
      return <View style={[{ flex: 1 }, style, detailStyle]}>{detail}</View>;
    }
    if (compactMode === 'stack') {
      return (
        <View style={[{ flex: 1 }, style]}>
          <View style={masterStyle}>{master}</View>
          <View style={[{ flex: 1 }, detailStyle]}>{detail}</View>
        </View>
      );
    }
    return <View style={[{ flex: 1 }, style, masterStyle]}>{master}</View>;
  }

  return (
    <View style={[{ flex: 1, flexDirection: 'row', gap: resolvedGap }, style]}>
      <View style={[{ width: resolvedMasterWidth }, masterStyle]}>{master}</View>
      <View style={[{ flex: 1 }, detailStyle]}>{detail}</View>
    </View>
  );
}
