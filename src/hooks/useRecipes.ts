import { useMemo } from 'react';
import type { TextStyle, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useScalingVersion } from './useScaling';
import { useWindowClass } from '../adaptive/windowClass';
import { hairline } from '../layout/helpers';
import { shadow } from '../layout/shadow';
import { rf, rp, rr } from '../responsive/responsive';

export interface Recipes {
  screen: ViewStyle;
  screenPadded: ViewStyle;
  sectionHeader: ViewStyle;
  sectionTitle: TextStyle;
  listRow: ViewStyle;
  listRowPressed: ViewStyle;
  fab: ViewStyle;
  divider: ViewStyle;
  chip: ViewStyle;
  chipText: TextStyle;
  hero: ViewStyle;
}

/**
 * Opinionated, themed style recipes for common screen patterns.
 *
 * @example
 * const r = useRecipes();
 * <View style={r.screenPadded}>
 *   <View style={r.sectionHeader}><Text style={r.sectionTitle}>Today</Text></View>
 *   <Pressable style={({ pressed }) => [r.listRow, pressed && r.listRowPressed]} />
 * </View>
 */
export function useRecipes(): Recipes {
  const theme = useTheme();
  const version = useScalingVersion();
  const { horizontalPadding } = useWindowClass();

  return useMemo((): Recipes => {
    return {
      screen: {
        flex: 1,
        backgroundColor: theme.colors.background,
      },
      screenPadded: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: horizontalPadding,
        paddingVertical: rp(16),
      },
      sectionHeader: {
        paddingVertical: rp(8),
        marginBottom: rp(4),
      },
      sectionTitle: {
        fontSize: rf(13),
        fontWeight: '600',
        color: theme.colors.textSecondary,
        letterSpacing: 0.4,
        textTransform: 'uppercase',
      },
      listRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: rp(14),
        paddingHorizontal: rp(4),
        borderBottomWidth: hairline,
        borderBottomColor: theme.colors.border,
        minHeight: rp(52),
      },
      listRowPressed: {
        opacity: 0.7,
        backgroundColor: theme.colors.surface,
      },
      fab: {
        position: 'absolute',
        right: horizontalPadding,
        bottom: rp(24),
        width: rp(56),
        height: rp(56),
        borderRadius: rr(28),
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadow('lg', { backgroundColor: theme.colors.primary }),
      },
      divider: {
        height: hairline,
        backgroundColor: theme.colors.border,
        width: '100%',
      },
      chip: {
        paddingHorizontal: rp(12),
        paddingVertical: rp(6),
        borderRadius: rr(999),
        backgroundColor: theme.colors.surface,
        borderWidth: hairline,
        borderColor: theme.colors.border,
        alignSelf: 'flex-start',
      },
      chipText: {
        fontSize: rf(13),
        color: theme.colors.text,
        fontWeight: '500',
      },
      hero: {
        width: '100%',
        padding: rp(20),
        borderRadius: rr(16),
        backgroundColor: theme.colors.surface,
        ...shadow('md', { backgroundColor: theme.colors.surface }),
      },
    };
  }, [theme, version, horizontalPadding]);
}
