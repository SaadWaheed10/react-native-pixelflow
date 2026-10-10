# react-native-PixelFlow

**One package for responsive React Native UI.**

Responsive dimensions, typography, spacing, flex layouts, border radius, icon
sizing, fonts, and theming — built directly on top of React Native's native
`StyleSheet` API. No styled-components, no NativeWind, no CSS-in-JS.

```ts
import { StyleSheet } from 'react-native';
import { rp, rm, rf, rw, rh, rr, fonts, useScaledStyles } from 'react-native-pixelflow';

// Inside a component — recomputes on rotation / font-scale / configure():
const styles = useScaledStyles(() => ({
  container: {
    padding: rp(16),
    marginTop: rm(20),
  },
  title: {
    fontSize: rf(24),
    fontFamily: fonts.inter.bold,
  },
  card: {
    width: rw(90),
    height: rh(25),
    borderRadius: rr(12),
  },
}));
```

## Install

```bash
npm install react-native-pixelflow react-native-safe-area-context
# or
yarn add react-native-pixelflow react-native-safe-area-context
# Expo:
npx expo install react-native-safe-area-context
```

Peer dependencies: `react >=17`, `react-native >=0.70`,
`react-native-safe-area-context >=4`.  
Optional: `expo-font` (if you load Google Fonts via Expo).

Wrap your app root in `SafeAreaProvider` (required for `Container`):

```tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PixelFlowProvider } from 'react-native-pixelflow';

export default function App() {
  return (
    <SafeAreaProvider>
      <PixelFlowProvider followSystem>
        {/* screens */}
      </PixelFlowProvider>
    </SafeAreaProvider>
  );
}
```

Works with Hermes, Fabric / the New Architecture, and Expo. No native code —
pure JS/TS.

## Configure (recommended)

Match your design frame once at app entry:

```ts
import { configure } from 'react-native-pixelflow';

configure({
  baseWidth: 390,       // default 375
  baseHeight: 844,      // default 812
  minFontScale: 0.85,   // clamp OS accessibility font scale
  maxFontScale: 1.6,
  applyAccessibilityFontScale: true, // rf/rl multiply by OS scale
});
```

When `applyAccessibilityFontScale` is `true` (default), PixelFlow scales fonts
and `FText` sets `allowFontScaling={false}` so React Native does **not** apply
font scale twice. Pass `allowFontScaling` on `FText` to override, or set
`applyAccessibilityFontScale: false` to leave accessibility entirely to RN.

## Why react-native-PixelFlow

Most responsive-scaling libraries do one thing: width-based font/size
scaling. react-native-PixelFlow runs a **hybrid scaling engine** that blends:

- Screen width *and* height (rotation does not distort like width-only scaling)
- Device classification — phone / tablet / foldable — with damping on larger screens
- OS accessibility font scale, clamped to a configurable range
- Pixel density, for crisp, whole-pixel output

### Example values (`rf(16)` / `rp(16)` / `rr(12)`, font scale 1, default config)

| Device (logical) | Class | `rf(16)` | `rp(16)` | `rr(12)` |
|---|---|---|---|---|
| 375 × 812 | phone | ~16 | ~16 | ~12 |
| 390 × 844 | phone | ~16–17 | ~16–17 | ~12 |
| 674 × 841 | foldable | damped | damped | gentle |
| 1024 × 1366 | tablet | damped | damped | gentle |

Exact pixels depend on density rounding; the important part is tablets/foldables
grow slower than raw `width / 375`.

## Live styles (important)

`rp(16)` returns a **number for the current snapshot**. If you call it inside a
module-level `StyleSheet.create(...)`, that number is frozen at import time and
will **not** update on rotation.

Prefer:

| API | When to use |
|---|---|
| `useScaledStyles(() => ({ ... }))` | StyleSheets that must stay live |
| `useTypography()` / `useThemeSpacing()` | Live type + spacing tokens |
| Components (`Box`, `FText`, …) | Already subscribe to the engine |
| Module-level `StyleSheet` + `rp`/`rf` | Static layouts that never rotate / resize |

## Responsive functions

| Function | Purpose | Example |
|---|---|---|
| `rw(percent)` | % of screen width | `rw(90)` |
| `rh(percent)` | % of screen height | `rh(30)` |
| `rf(size)` | Responsive font size | `rf(16)` |
| `rp(value)` | Responsive padding | `rp(16)` |
| `rm(value)` | Responsive margin | `rm(20)` |
| `rr(value)` | Responsive border radius | `rr(12)` |
| `ri(value)` | Responsive icon size | `ri(24)` |
| `rl(value)` | Responsive line height | `rl(24)` |
| `rls(value)` | Responsive letter spacing | `rls(1.2)` |
| `rs({ phone, tablet?, foldable? })` | Per-device value | `rs({ phone: 1, tablet: 2 })` |

All values are memoized and re-computed when the window dimensions, accessibility
font scale, or `configure()` change (one shared `Dimensions` listener).

## Flex utilities

```ts
import { flex } from 'react-native-pixelflow';

const styles = StyleSheet.create({
  wrapper: { ...flex.center },
  header: { ...flex.between },
});
```

Available: `center`, `row`, `column`, `between`, `around`, `evenly`, `start`,
`end`, `wrap`, `fill` (fully typed for autocomplete).

## Typography

```ts
import { typography, createTypography, useTypography } from 'react-native-pixelflow';

// In components (live):
const type = useTypography();
<Text style={type.h1}>Welcome</Text>

// Or build a scale on a different default family:
const jakarta = createTypography('plusJakartaSans');
```

Scale: `h1`, `h2`, `h3`, `subtitle`, `body`, `bodySmall`, `caption`, `button`.

## Fonts

```ts
import { fonts } from 'react-native-pixelflow';

fontFamily: fonts.inter.regular
fontFamily: fonts.poppins.semibold
fontFamily: fonts.roboto.bold
```

Curated map of 21 Google Font families to font-family **strings** — binaries are
not bundled. See the table in `src/fonts/fontRegistry.ts` for Expo package names.

**Loading fonts (Expo):**

```bash
npx expo install expo-font @expo-google-fonts/inter
```

```tsx
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';

const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold });
```

**Loading fonts (bare React Native):** download the `.ttf` files, add them under
`assets/fonts`, register via `react-native.config.js`, run `npx react-native-asset`.
Filenames must match registry strings, e.g. `Inter_700Bold.ttf`.

`buildFontMap()` wires your own `require()`s into the shape `useFonts` expects
and **warns** on unknown weight keys.

## Components

```tsx
import { Container, Box, Row, Column, Spacer, FText } from 'react-native-pixelflow';

<Container>
  <Row gap={12} justify="space-between">
    <FText size={20} weight="bold">Title</FText>
    <FText size={14} secondary>Subtitle</FText>
  </Row>
  <Spacer size={16} />
  <Box p={16} radius={12} bg="#fff">
    <Column gap={8}>
      <FText>Card content</FText>
    </Column>
  </Box>
</Container>
```

- **`Container`** — `SafeAreaView` from `react-native-safe-area-context`,
  theme background, responsive padding (`safeArea={false}` for a plain `View`)
- **`Box`** — `p`, `px`, `py`, `m`, `mx`, `my`, `radius`, `bg`, `flex`
- **`Row`** / **`Column`** — flex layout with responsive `gap`
- **`Spacer`** — `size` (responsive), optional `axis`
- **`FText`** — `size`, `family`, `weight`, `lineHeight`, `themed`, `secondary`

## Hooks

```ts
const { width, height, scale, isTablet, isFoldable, isLandscape, select } =
  useResponsive();

const columns = select({ phone: 1, tablet: 2, foldable: 2 });
const { h1, body } = useTypography();
const { deviceType, orientation, pixelDensity } = useDevice();
const styles = useScaledStyles(() => ({ title: { fontSize: rf(24) } }));
const spacing = useThemeSpacing(); // theme.spacing passed through rp()
```

`scale` matches the hybrid spacing curve used by `rp` / `rm` (not raw `width / 375`).

## Theming

```tsx
import {
  PixelFlowProvider,
  lightTheme,
  darkTheme,
  customTheme,
  useTheme,
} from 'react-native-pixelflow';

const brandTheme = customTheme({
  base: 'dark',
  colors: { primary: '#FF6B6B' },
  spacing: { md: 20 },
});

// Follow OS light/dark:
<PixelFlowProvider followSystem>
  <App />
</PixelFlowProvider>

// Or pin a theme:
<PixelFlowProvider theme={brandTheme}>
  <App />
</PixelFlowProvider>
```

`useTheme()` returns `colors`, `spacing`, `dark`, `name`.

## TypeScript

Strict-mode TypeScript with a fully typed public API. `flex.*` and `fonts.*`
preserve literal keys for editor autocomplete.

## Compatibility

React Native 0.70 through 0.86+, Hermes, Fabric / New Architecture, and Expo
(managed or bare). No native modules.

## Example

See [`example/ExampleScreen.tsx`](./example/ExampleScreen.tsx) for a screen that
wires `configure`, `useScaledStyles`, `rs` / `select`, and `followSystem` theming.
Drop it into an Expo or RN app to try the API.

## Project layout

```
src/
  core/            scaling engine, config, device detection
  responsive/       rw, rh, rf, rp, rm, rr, ri, rl, rls, rs
  flex/             flex.* helpers
  typography/       typography scale
  fonts/            font family registry + loader helper
  theme/            light/dark/custom themes + PixelFlowProvider
  components/       Container, Box, Row, Column, Spacer, FText
  hooks/            useResponsive, useTypography, useDevice, useScaledStyles
  types/            shared TS types
```

## Building from source

```bash
npm install
npm run typecheck
npm test
npm run build     # emits lib/commonjs, lib/module, lib/typescript via tsup
```

## License

MIT — see [LICENSE](./LICENSE).

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).
