import React from 'react';
import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { useWindowClass } from '../adaptive/windowClass';

export interface ContentWidthProps extends ViewProps {
  /**
   * Max content width in dp. Defaults to the Material-inspired value from
   * `useWindowClass().contentMaxWidth`.
   */
  max?: number;
  /** Horizontal alignment of the constrained box. Default `center`. */
  align?: 'center' | 'stretch' | 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/**
 * Constrain readable content width on tablets / large windows so lines don't
 * stretch edge-to-edge. Uses window-class defaults when `max` is omitted.
 *
 * @example
 * <ContentWidth max={720}>
 *   <ArticleBody />
 * </ContentWidth>
 */
export function ContentWidth({
  max,
  align = 'center',
  style,
  children,
  ...rest
}: ContentWidthProps): React.JSX.Element {
  const { contentMaxWidth, width } = useWindowClass();
  const maxWidth = max ?? contentMaxWidth;

  const alignSelf: ViewStyle['alignSelf'] =
    align === 'center'
      ? 'center'
      : align === 'left'
        ? 'flex-start'
        : align === 'right'
          ? 'flex-end'
          : 'stretch';

  return (
    <View
      style={[
        {
          width: '100%',
          maxWidth: Math.min(maxWidth, width),
          alignSelf,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
