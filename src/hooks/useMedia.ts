import { useMemo } from 'react';
import {
  getWindowWidthClass,
  windowClassMeets,
  type WindowWidthClass,
} from '../adaptive/windowClass';
import { useScalingSnapshot } from './useScaling';
import type { Orientation } from '../types';

export interface MediaQuery {
  /** Minimum width in dp. */
  minWidth?: number;
  /** Maximum width in dp. */
  maxWidth?: number;
  /** Minimum height in dp. */
  minHeight?: number;
  /** Maximum height in dp. */
  maxHeight?: number;
  /** Minimum Material window class. */
  minClass?: WindowWidthClass;
  /** Exact window class. */
  className?: WindowWidthClass;
  orientation?: Orientation;
  /** Platform-agnostic landscape shortcut. */
  landscape?: boolean;
  portrait?: boolean;
}

export interface UseMediaResult {
  width: number;
  height: number;
  widthClass: WindowWidthClass;
  orientation: Orientation;
  /** Evaluate a media query against the live window. */
  matches: (query: MediaQuery) => boolean;
  /** True when width ≥ 600 (medium+). */
  md: boolean;
  /** True when width ≥ 840 (expanded+). */
  lg: boolean;
}

function matchesQuery(
  query: MediaQuery,
  width: number,
  height: number,
  widthClass: WindowWidthClass,
  orientation: Orientation,
): boolean {
  if (query.minWidth !== undefined && width < query.minWidth) return false;
  if (query.maxWidth !== undefined && width > query.maxWidth) return false;
  if (query.minHeight !== undefined && height < query.minHeight) return false;
  if (query.maxHeight !== undefined && height > query.maxHeight) return false;
  if (query.minClass && !windowClassMeets(widthClass, query.minClass)) return false;
  if (query.className && widthClass !== query.className) return false;
  if (query.orientation && orientation !== query.orientation) return false;
  if (query.landscape === true && orientation !== 'landscape') return false;
  if (query.portrait === true && orientation !== 'portrait') return false;
  return true;
}

/**
 * CSS-like media queries against the live PixelFlow window.
 *
 * @example
 * const media = useMedia();
 * if (media.matches({ minWidth: 840, orientation: 'landscape' })) { … }
 * if (media.lg) { … }
 */
export function useMedia(): UseMediaResult {
  const snapshot = useScalingSnapshot();
  const widthClass = getWindowWidthClass(snapshot.width);

  return useMemo(() => {
    const matches = (query: MediaQuery) =>
      matchesQuery(
        query,
        snapshot.width,
        snapshot.height,
        widthClass,
        snapshot.orientation,
      );

    return {
      width: snapshot.width,
      height: snapshot.height,
      widthClass,
      orientation: snapshot.orientation,
      matches,
      md: windowClassMeets(widthClass, 'medium'),
      lg: windowClassMeets(widthClass, 'expanded'),
    };
  }, [
    snapshot.width,
    snapshot.height,
    snapshot.orientation,
    widthClass,
  ]);
}

export { matchesQuery as matchMediaQuery };
