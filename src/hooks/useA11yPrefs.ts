import { useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { customTheme } from '../theme/themes';
import type { PixelFlowTheme } from '../types';

export interface UseA11yPrefsResult {
  boldText: boolean;
  reduceMotion: boolean;
  /** iOS: Increase Contrast / Android: high contrast when available. */
  highContrast: boolean;
  /** Best-effort grayscale (mostly web / future native). */
  grayscale: boolean;
  /**
   * Theme with stronger borders / text when `highContrast` is on.
   * Pass into a nested `PixelFlowProvider theme={a11yTheme}`.
   */
  a11yTheme: PixelFlowTheme;
}

async function readBool(
  getter: (() => Promise<boolean>) | undefined,
): Promise<boolean> {
  if (!getter) return false;
  try {
    return Boolean(await getter());
  } catch {
    return false;
  }
}

/**
 * System accessibility preferences beyond font scale.
 *
 * @example
 * const { boldText, highContrast, a11yTheme } = useA11yPrefs();
 * <PixelFlowProvider theme={a11yTheme}>…</PixelFlowProvider>
 */
export function useA11yPrefs(): UseA11yPrefsResult {
  const theme = useTheme();
  const [boldText, setBoldText] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [grayscale] = useState(false);

  useEffect(() => {
    let mounted = true;

    const sync = async () => {
      const [bold, motion, contrast] = await Promise.all([
        readBool(AccessibilityInfo.isBoldTextEnabled),
        readBool(AccessibilityInfo.isReduceMotionEnabled),
        readBool(
          // iOS 13+ / some Android builds
          (
            AccessibilityInfo as typeof AccessibilityInfo & {
              isHighTextContrastEnabled?: () => Promise<boolean>;
            }
          ).isHighTextContrastEnabled,
        ),
      ]);
      if (!mounted) return;
      setBoldText(bold);
      setReduceMotion(motion);
      setHighContrast(contrast);
    };

    void sync();

    const subs = [
      AccessibilityInfo.addEventListener?.('boldTextChanged', setBoldText),
      AccessibilityInfo.addEventListener?.('reduceMotionChanged', setReduceMotion),
      AccessibilityInfo.addEventListener?.(
        'highTextContrastChanged' as 'boldTextChanged',
        setHighContrast,
      ),
    ].filter(Boolean);

    return () => {
      mounted = false;
      subs.forEach((s) => s?.remove?.());
    };
  }, []);

  const a11yTheme = useMemo(() => {
    if (!highContrast && !boldText) return theme;
    const strongerBorder = theme.dark ? '#F9FAFB' : '#111827';
    const strongerText = theme.dark ? '#FFFFFF' : '#000000';
    return customTheme({
      base: theme.dark ? 'dark' : 'light',
      name: `${theme.name}-a11y`,
      colors: {
        ...theme.colors,
        text: strongerText,
        border: strongerBorder,
        textSecondary: theme.dark ? '#E5E7EB' : '#374151',
      },
    });
  }, [theme, highContrast, boldText]);

  return {
    boldText,
    reduceMotion,
    highContrast,
    grayscale,
    a11yTheme,
  };
}
