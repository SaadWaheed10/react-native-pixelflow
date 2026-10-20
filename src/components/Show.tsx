import React from 'react';
import {
  getWindowWidthClass,
  windowClassMeets,
  type WindowWidthClass,
} from '../adaptive/windowClass';
import { useScalingSnapshot } from '../hooks/useScaling';
import type { Orientation } from '../types';

export interface VisibilityProps {
  children: React.ReactNode;
  /** Show when window class is at least this. */
  above?: WindowWidthClass;
  /** Show when window class is strictly below this. */
  below?: WindowWidthClass;
  /** Show when width ≥ this dp. */
  minWidth?: number;
  /** Show when width < this dp. */
  maxWidth?: number;
  orientation?: Orientation;
  /** Invert the match (used by Hide). */
  invert?: boolean;
  /** Optional fallback when hidden. */
  fallback?: React.ReactNode;
}

function useVisibilityMatch(props: VisibilityProps): boolean {
  const snapshot = useScalingSnapshot();
  const widthClass = getWindowWidthClass(snapshot.width);
  let match = true;

  if (props.above && !windowClassMeets(widthClass, props.above)) match = false;
  if (props.below && windowClassMeets(widthClass, props.below)) match = false;
  if (props.minWidth !== undefined && snapshot.width < props.minWidth) {
    match = false;
  }
  if (props.maxWidth !== undefined && snapshot.width >= props.maxWidth) {
    match = false;
  }
  if (props.orientation && snapshot.orientation !== props.orientation) {
    match = false;
  }

  return props.invert ? !match : match;
}

/**
 * Conditionally render children by window class / width / orientation.
 *
 * @example <Show above="medium"><TabletChrome /></Show>
 * @example <Show maxWidth={600} orientation="portrait"><PhoneOnly /></Show>
 */
export function Show(props: VisibilityProps): React.ReactNode {
  const visible = useVisibilityMatch(props);
  if (!visible) return props.fallback ?? null;
  return props.children;
}

/**
 * Inverse of Show — hide when the query matches.
 *
 * @example <Hide below="medium"><DesktopOnlyNav /></Hide>
 */
export function Hide(
  props: Omit<VisibilityProps, 'invert'>,
): React.ReactNode {
  return <Show {...props} invert />;
}
