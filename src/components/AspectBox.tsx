import React, { useMemo } from 'react';
import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

export type AspectRatioInput = number | `${number}:${number}` | '1:1' | '4:3' | '16:9' | '21:9';

export interface AspectBoxProps extends ViewProps {
  /** Aspect ratio as number (`1.777`) or `"16:9"`. Default `1`. */
  ratio?: AspectRatioInput;
  style?: StyleProp<ViewStyle>;
}

/** Parse `"16:9"` or a positive number into a numeric aspect ratio. */
export function parseAspectRatio(ratio: AspectRatioInput): number {
  if (typeof ratio === 'number' && Number.isFinite(ratio) && ratio > 0) {
    return ratio;
  }
  if (typeof ratio === 'string' && ratio.includes(':')) {
    const [w, h] = ratio.split(':').map(Number);
    if (w > 0 && h > 0) return w / h;
  }
  return 1;
}

/**
 * Box that keeps a fixed aspect ratio (great for banners / thumbnails).
 *
 * @example <AspectBox ratio="16:9"><Image style={absoluteFill} /></AspectBox>
 */
export function AspectBox({
  ratio = 1,
  style,
  children,
  ...rest
}: AspectBoxProps): React.JSX.Element {
  const aspectRatio = useMemo(() => parseAspectRatio(ratio), [ratio]);

  return (
    <View style={[{ width: '100%', aspectRatio }, style]} {...rest}>
      {children}
    </View>
  );
}
