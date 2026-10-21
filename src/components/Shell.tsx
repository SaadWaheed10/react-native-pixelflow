import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useWindowClass } from '../adaptive/windowClass';
import { useFoldState } from '../hooks/useFoldState';
import { useMultiWindow } from '../hooks/useMultiWindow';
import { useAdaptiveNav } from '../hooks/useAdaptiveNav';
import { ContentWidth } from './ContentWidth';
import { KeyboardScreen, type KeyboardScreenProps } from './KeyboardScreen';
import { SplitView } from './SplitView';

export interface ShellProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Skip ContentWidth centering. */
  fullBleed?: boolean;
}

export interface TabletShellProps extends ShellProps {
  /** Optional master pane (list). When set, uses SplitView from medium up. */
  master?: React.ReactNode;
  detail?: React.ReactNode;
  breakpoint?: import('../adaptive/windowClass').WindowWidthClass | number;
}

export interface TabletopShellProps extends ShellProps {
  /** Top pane (media / preview). */
  top: React.ReactNode;
  /** Bottom pane (controls). */
  bottom: React.ReactNode;
  /** Top pane flex. Default 1.2 */
  topFlex?: number;
  bottomFlex?: number;
}

function ScreenFrame({
  children,
  style,
  fullBleed,
}: ShellProps): React.JSX.Element {
  const theme = useTheme();
  const body = fullBleed ? (
    children
  ) : (
    <ContentWidth style={{ flex: 1 }}>{children}</ContentWidth>
  );
  return (
    <View
      style={[
        { flex: 1, backgroundColor: theme.colors.background },
        style,
      ]}
    >
      {body}
    </View>
  );
}

/**
 * Phone-oriented shell: ContentWidth + optional keyboard screen chrome.
 *
 * @example
 * <Shell.Phone><Home /></Shell.Phone>
 * <Shell.Phone.Keyboard edges={['bottom']}><Form /></Shell.Phone.Keyboard>
 */
function PhoneShell(props: ShellProps): React.JSX.Element {
  const { forceCompact } = useMultiWindow();
  return (
    <ScreenFrame {...props} fullBleed={props.fullBleed ?? forceCompact} />
  );
}

function PhoneKeyboardShell(
  props: ShellProps & Omit<KeyboardScreenProps, 'children'> & {
    children: React.ReactNode;
  },
): React.JSX.Element {
  const { children, style, fullBleed: _fb, ...keyboardProps } = props;
  return (
    <KeyboardScreen {...keyboardProps} style={style}>
      {children}
    </KeyboardScreen>
  );
}
PhoneShell.Keyboard = PhoneKeyboardShell;

/**
 * Tablet shell: ContentWidth, or SplitView when `master`/`detail` provided.
 * Falls back to phone layout under multi-window compact.
 */
function TabletShell({
  children,
  master,
  detail,
  breakpoint = 'medium',
  style,
  fullBleed,
}: TabletShellProps): React.JSX.Element {
  const { forceCompact } = useMultiWindow();
  const nav = useAdaptiveNav();

  if (forceCompact || nav.showTabs) {
    return (
      <ScreenFrame style={style} fullBleed={fullBleed}>
        {detail ?? children}
      </ScreenFrame>
    );
  }

  if (master && detail) {
    return (
      <View style={[{ flex: 1 }, style]}>
        <SplitView
          breakpoint={breakpoint}
          master={master}
          detail={detail}
        />
      </View>
    );
  }

  return (
    <ScreenFrame style={style} fullBleed={fullBleed}>
      {children}
    </ScreenFrame>
  );
}

/**
 * Fold tabletop shell: media on top, controls below when posture suggests it.
 * Otherwise stacks normally in a phone shell.
 */
function TabletopShell({
  top,
  bottom,
  topFlex = 1.2,
  bottomFlex = 1,
  style,
  children: _children,
  fullBleed: _fullBleed,
}: TabletopShellProps): React.JSX.Element {
  const theme = useTheme();
  const fold = useFoldState();
  const { isLandscape } = useWindowClass();

  const split = fold.preferTabletopSplit || (fold.isLikelyFoldable && isLandscape);

  if (!split) {
    return (
      <View
        style={[
          { flex: 1, backgroundColor: theme.colors.background },
          style,
        ]}
      >
        <View style={{ flex: topFlex }}>{top}</View>
        <View style={{ flex: bottomFlex }}>{bottom}</View>
      </View>
    );
  }

  return (
    <View
      style={[
        {
          flex: 1,
          flexDirection: 'column',
          backgroundColor: theme.colors.background,
        },
        style,
      ]}
    >
      <View style={{ flex: topFlex }}>{top}</View>
      <View style={{ flex: bottomFlex }}>{bottom}</View>
    </View>
  );
}

/**
 * Preset adaptive app shells — composition helpers, not a new widget kit.
 *
 * @example
 * <Shell.Phone>…</Shell.Phone>
 * <Shell.Tablet master={<List />} detail={<Detail />} />
 * <Shell.Tabletop top={<Player />} bottom={<Controls />} />
 */
export const Shell = {
  Phone: PhoneShell,
  Tablet: TabletShell,
  Tabletop: TabletopShell,
};
