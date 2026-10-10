import { vi } from 'vitest';

vi.mock('react-native', () => {
  let width = 375;
  let height = 812;
  let fontScale = 1;
  let density = 2;
  const listeners = new Set<(payload: { window: { width: number; height: number } }) => void>();

  return {
    Dimensions: {
      get: (key: string) => {
        if (key === 'window' || key === 'screen') {
          return { width, height, scale: density, fontScale };
        }
        return { width, height, scale: density, fontScale };
      },
      addEventListener: (
        _type: string,
        handler: (payload: { window: { width: number; height: number } }) => void,
      ) => {
        listeners.add(handler);
        return {
          remove: () => {
            listeners.delete(handler);
          },
        };
      },
      /** Test helper — mutate window and notify listeners. */
      __setWindow: (w: number, h: number) => {
        width = w;
        height = h;
        listeners.forEach((l) => l({ window: { width, height } }));
      },
      __setFontScale: (scale: number) => {
        fontScale = scale;
      },
      __reset: () => {
        width = 375;
        height = 812;
        fontScale = 1;
        density = 2;
        // Keep listeners — ScalingEngine subscribes once at module load.
      },
    },
    PixelRatio: {
      get: () => density,
      getFontScale: () => fontScale,
      roundToNearestPixel: (n: number) => Math.round(n * density) / density,
    },
    Platform: {
      OS: 'ios',
      select: (spec: Record<string, unknown>) => spec.ios ?? spec.default,
    },
    StyleSheet: {
      create: <T,>(styles: T) => styles,
    },
    View: 'View',
    Text: 'Text',
    useColorScheme: () => 'light',
  };
});
