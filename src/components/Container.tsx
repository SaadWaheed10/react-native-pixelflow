import React from 'react';
import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { rp } from '../responsive/responsive';
import { useTheme } from '../theme/ThemeProvider';

export interface ContainerProps extends ViewProps {
  /** Responsive padding applied to all sides. Default 16. */
  padding?: number;
  /** Skip theme background color (transparent instead). */
  transparent?: boolean;
  /** Render as a plain View instead of SafeAreaView. */
  safeArea?: boolean;
}

/**
 * Root screen wrapper: safe-area aware (via `react-native-safe-area-context`),
 * theme-aware background, responsive default padding.
 * @example <Container><YourScreenContent /></Container>
 */
export function Container({
  padding = 16,
  transparent = false,
  safeArea = true,
  style,
  children,
  ...rest
}: ContainerProps): React.JSX.Element {
  const theme = useTheme();
  const Wrapper = safeArea ? SafeAreaView : View;

  const containerStyle: ViewStyle = {
    flex: 1,
    padding: rp(padding),
    backgroundColor: transparent ? 'transparent' : theme.colors.background,
  };

  return (
    <Wrapper style={[styles.base, containerStyle, style]} {...rest}>
      {children}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
});
