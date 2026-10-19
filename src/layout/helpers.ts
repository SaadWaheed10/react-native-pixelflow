import { StyleSheet, type ViewStyle } from 'react-native';

/** Thinnest border width on the current platform. */
export const hairline = StyleSheet.hairlineWidth;

/** Absolute fill — same as `StyleSheet.absoluteFill`. */
export const absoluteFill: ViewStyle = {
  ...(StyleSheet.absoluteFill as ViewStyle),
};

/** Common layout snippets. */
export const layout = {
  hairline,
  absoluteFill,
  fill: { flex: 1 } as ViewStyle,
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  absoluteFillCenter: {
    ...absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
} as const;
