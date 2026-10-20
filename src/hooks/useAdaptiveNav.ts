import { useMemo } from 'react';
import {
  useWindowClass,
  type AdaptiveNav,
} from '../adaptive/windowClass';
import { useMultiWindow } from './useMultiWindow';
import { rp } from '../responsive/responsive';

export interface AdaptiveNavOptions {
  /** Drawer / rail width in design px. Default 280 / 72. */
  drawerWidth?: number;
  railWidth?: number;
  /** Force a nav mode (tests / previews). */
  force?: AdaptiveNav;
}

export interface UseAdaptiveNavResult {
  /** Suggested primary navigation pattern. */
  mode: AdaptiveNav;
  /** True when a permanent side nav should be visible. */
  showSideNav: boolean;
  /** True when bottom tabs should be used. */
  showTabs: boolean;
  /** Pixel width for drawer content. */
  drawerWidth: number;
  /** Pixel width for navigation rail. */
  railWidth: number;
  /**
   * Spread-friendly hints for React Navigation (drawer / material).
   * Libraries differ — treat as defaults, not a hard dependency.
   */
  navigation: {
    drawerType: 'front' | 'permanent';
    headerShown: boolean;
    drawerStyle: { width: number };
  };
}

/**
 * Map window class → tabs / rail / drawer with multi-window awareness.
 *
 * @example
 * const nav = useAdaptiveNav();
 * if (nav.showTabs) return <TabNavigator />;
 * return <DrawerNavigator screenOptions={nav.navigation} />;
 */
export function useAdaptiveNav(
  options: AdaptiveNavOptions = {},
): UseAdaptiveNavResult {
  const { nav, widthClass } = useWindowClass();
  const { forceCompact } = useMultiWindow();
  const {
    drawerWidth: drawerDesign = 280,
    railWidth: railDesign = 72,
    force,
  } = options;

  return useMemo(() => {
    const mode: AdaptiveNav = force ?? (forceCompact ? 'tabs' : nav);
    const showTabs = mode === 'tabs';
    const showSideNav = mode === 'rail' || mode === 'drawer';
    const drawerWidth = rp(drawerDesign);
    const railWidth = rp(railDesign);

    return {
      mode,
      showSideNav,
      showTabs,
      drawerWidth,
      railWidth,
      navigation: {
        drawerType: mode === 'drawer' ? 'permanent' : 'front',
        headerShown: showTabs,
        drawerStyle: {
          width: mode === 'rail' ? railWidth : drawerWidth,
        },
      },
    };
  }, [
    nav,
    widthClass,
    forceCompact,
    force,
    drawerDesign,
    railDesign,
  ]);
}
