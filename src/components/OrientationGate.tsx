import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useOrientation } from '../hooks/useOrientation';
import { useTheme } from '../theme/ThemeProvider';
import { FText } from './FText';
import { Spacer } from './Layout';
import { rp } from '../responsive/responsive';
import type { Orientation } from '../types';

export interface OrientationGateProps {
  children: React.ReactNode;
  /** Allowed orientation(s). Default `portrait`. */
  allow?: Orientation | Orientation[];
  /**
   * Custom UI when orientation is blocked.
   * Defaults to a simple “please rotate” message.
   */
  fallback?: React.ReactNode;
  /** Message used by the default fallback. */
  message?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Render children only in allowed orientation(s); otherwise show a fallback.
 * Does **not** lock the OS orientation — pair with `expo-screen-orientation`
 * or similar if you need a hard lock.
 *
 * @example
 * <OrientationGate allow="portrait">
 *   <CheckoutForm />
 * </OrientationGate>
 */
export function OrientationGate({
  children,
  allow = 'portrait',
  fallback,
  message = 'Please rotate your device',
  style,
}: OrientationGateProps): React.JSX.Element {
  const { orientation } = useOrientation();
  const theme = useTheme();
  const allowed = Array.isArray(allow) ? allow : [allow];
  const ok = allowed.includes(orientation);

  if (ok) {
    return <>{children}</>;
  }

  if (fallback !== undefined) {
    return <>{fallback}</>;
  }

  return (
    <View
      style={[
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: rp(24),
          backgroundColor: theme.colors.background,
        },
        style,
      ]}
    >
      <FText variant="h3" color="fg.default">
        {message}
      </FText>
      <Spacer size={8} />
      <FText color="fg.muted" size={14}>
        Best viewed in {allowed.join(' or ')}
      </FText>
    </View>
  );
}
