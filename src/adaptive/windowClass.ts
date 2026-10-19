import { useMemo } from 'react';
import { useScalingSnapshot } from '../hooks/useScaling';
import { rp } from '../responsive/responsive';
import type { WindowWidthClass } from '../types';

export type { WindowWidthClass };

/**
 * Material 3–aligned window width classes (dp), not device marketing names.
 * Updates with rotation, fold, and split-screen because it reads the live
 * PixelFlow window snapshot.
 *
 * | Class | Width |
 * |---|---|
 * | compact | < 600 |
 * | medium | 600–839 |
 * | expanded | 840–1199 |
 * | large | 1200–1599 |
 * | extraLarge | ≥ 1600 |
 */

export type AdaptiveNav = 'tabs' | 'rail' | 'drawer';

export const WINDOW_CLASS_ORDER: WindowWidthClass[] = [
  'compact',
  'medium',
  'expanded',
  'large',
  'extraLarge',
];

export const WINDOW_CLASS_BREAKPOINTS: Record<WindowWidthClass, number> = {
  compact: 0,
  medium: 600,
  expanded: 840,
  large: 1200,
  extraLarge: 1600,
};

export function getWindowWidthClass(width: number): WindowWidthClass {
  if (width >= 1600) return 'extraLarge';
  if (width >= 1200) return 'large';
  if (width >= 840) return 'expanded';
  if (width >= 600) return 'medium';
  return 'compact';
}

export function windowClassMeets(
  current: WindowWidthClass,
  minimum: WindowWidthClass,
): boolean {
  return (
    WINDOW_CLASS_ORDER.indexOf(current) >= WINDOW_CLASS_ORDER.indexOf(minimum)
  );
}

export interface UseWindowClassResult {
  width: number;
  height: number;
  widthClass: WindowWidthClass;
  isCompact: boolean;
  isMedium: boolean;
  isExpandedUp: boolean;
  isLandscape: boolean;
  /** Suggested grid columns for card layouts. */
  columns: number;
  /** Readable content max width (absolute dp). */
  contentMaxWidth: number;
  /** Horizontal page padding (PixelFlow-scaled). */
  horizontalPadding: number;
  /** Suggested primary navigation pattern. */
  nav: AdaptiveNav;
  /** True when `widthClass` is at least `minimum`. */
  meets: (minimum: WindowWidthClass) => boolean;
}

function columnsFor(widthClass: WindowWidthClass, isLandscape: boolean): number {
  switch (widthClass) {
    case 'compact':
      return isLandscape ? 2 : 1;
    case 'medium':
      return 2;
    case 'expanded':
      return 3;
    case 'large':
      return 4;
    case 'extraLarge':
      return 4;
  }
}

function contentMaxWidthFor(widthClass: WindowWidthClass, width: number): number {
  switch (widthClass) {
    case 'compact':
      return width;
    case 'medium':
      return 720;
    case 'expanded':
      return 960;
    case 'large':
      return 1120;
    case 'extraLarge':
      return 1280;
  }
}

function horizontalPaddingFor(widthClass: WindowWidthClass): number {
  switch (widthClass) {
    case 'compact':
      return rp(16);
    case 'medium':
      return rp(24);
    default:
      return rp(32);
  }
}

function navFor(widthClass: WindowWidthClass): AdaptiveNav {
  if (widthClass === 'compact') return 'tabs';
  if (widthClass === 'medium') return 'rail';
  return 'drawer';
}

/**
 * Adaptive layout signals from the current window — use to change structure
 * (columns, split panes, nav), not only scale numbers.
 *
 * @example
 * const { widthClass, columns, nav, meets } = useWindowClass();
 * if (meets('medium')) return <SplitView ... />;
 */
export function useWindowClass(): UseWindowClassResult {
  const snapshot = useScalingSnapshot();
  const widthClass = getWindowWidthClass(snapshot.width);

  return useMemo(() => {
    const meets = (minimum: WindowWidthClass) =>
      windowClassMeets(widthClass, minimum);

    return {
      width: snapshot.width,
      height: snapshot.height,
      widthClass,
      isCompact: widthClass === 'compact',
      isMedium: widthClass === 'medium',
      isExpandedUp: windowClassMeets(widthClass, 'expanded'),
      isLandscape: snapshot.isLandscape,
      columns: columnsFor(widthClass, snapshot.isLandscape),
      contentMaxWidth: contentMaxWidthFor(widthClass, snapshot.width),
      horizontalPadding: horizontalPaddingFor(widthClass),
      nav: navFor(widthClass),
      meets,
    };
  }, [
    snapshot.width,
    snapshot.height,
    snapshot.isLandscape,
    widthClass,
  ]);
}
