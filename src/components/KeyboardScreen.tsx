import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  SafeAreaView,
  type Edge,
} from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import { useKeyboardInset } from '../hooks/useKeyboardInset';
import { useScalingVersion } from '../hooks/useScaling';
import { rp } from '../responsive/responsive';

export interface KeyboardScreenProps {
  children: React.ReactNode;
  /** Safe-area edges. Default `['top', 'bottom', 'left', 'right']`. */
  edges?: Edge[];
  /** Extra bottom padding beyond keyboard / safe area (design px). */
  bottomOffset?: number;
  /** Wrap children in a ScrollView. Default true. */
  scroll?: boolean;
  scrollProps?: Omit<ScrollViewProps, 'children' | 'contentContainerStyle'>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  /** Skip theme background. */
  transparent?: boolean;
}

/**
 * Screen shell: safe area + keyboard avoiding + optional scroll.
 * Replaces the usual Expo KeyboardAvoidingView boilerplate.
 *
 * @example
 * <KeyboardScreen edges={['bottom']}>
 *   <Form />
 * </KeyboardScreen>
 */
export function KeyboardScreen({
  children,
  edges = ['top', 'bottom', 'left', 'right'],
  bottomOffset = 0,
  scroll = true,
  scrollProps,
  contentContainerStyle,
  style,
  transparent = false,
}: KeyboardScreenProps): React.JSX.Element {
  useScalingVersion();
  const theme = useTheme();
  const keyboardHeight = useKeyboardInset();
  const offset = rp(bottomOffset);

  const body = scroll ? (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        { flexGrow: 1, paddingBottom: offset },
        contentContainerStyle,
      ]}
      {...scrollProps}
    >
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        { flex: 1, paddingBottom: offset + keyboardHeight },
        contentContainerStyle,
      ]}
    >
      {children}
    </View>
  );

  return (
    <SafeAreaView
      edges={edges}
      style={[
        {
          flex: 1,
          backgroundColor: transparent ? 'transparent' : theme.colors.background,
        },
        style,
      ]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {body}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
