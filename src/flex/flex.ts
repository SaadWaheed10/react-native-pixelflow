import type { ViewStyle } from 'react-native';

/**
 * Reusable flex helpers, spreadable directly into StyleSheet.create() objects.
 * @example
 * const styles = StyleSheet.create({
 *   wrapper: { ...flex.center, ...flex.row },
 * });
 */
export const flex: Record<string, ViewStyle> = {
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  between: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  around: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  evenly: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  start: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  end: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  wrap: {
    flexWrap: 'wrap',
  },
  fill: {
    flex: 1,
  },
};
