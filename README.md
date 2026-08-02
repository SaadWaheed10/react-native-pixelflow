# react-native-PixelFlow

**One package for responsive React Native UI.**

Responsive dimensions, typography, spacing, flex layouts, border radius, icon
sizing, fonts, and theming — built directly on top of React Native's native
`StyleSheet` API. No styled-components, no NativeWind, no CSS-in-JS. Write
`StyleSheet.create()` exactly like you always have, just wrap numbers in a
PixelFlow function.

```ts
import { StyleSheet } from 'react-native';
import { rp, rm, rf, rw, rh, rr, fonts } from 'react-native-pixelflow';

const styles = StyleSheet.create({
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
});
```

## Install

```bash
npm install react-native-pixelflow
# or
yarn add react-native-pixelflow
```

Peer dependencies: `react >=17`, `react-native >=0.70`. Works with Hermes,
Fabric / the New Architecture, and Expo. No native code, no config plugin —
it's pure JS/TS.

## Why react-native-PixelFlow

Most responsive-scaling libraries do one thing: width-based font/size
scaling. react-native-PixelFlow instead runs a **hybrid scaling engine** that blends:

- Screen width *and* height (so rotation doesn't distort values the way
  width-only scaling does)
- Device classification — phone / tablet / foldable — with damping applied
  on larger screens so tablets don't get comically large text and padding
- OS accessibility font scale (`PixelRatio.getFontScale()`), clamped to a
  sane range so a user's "huge text" setting doesn't break your layout
- Pixel density, for crisp, whole-pixel output

Each responsive function applies a different scaling *factor* tuned to what
it represents — fonts and icons move more than radii, radii move very
little, spacing sits in between — producing results that look visually
consistent across devices rather than growing strictly proportional to
screen size.

## Responsive functions

| Function | Purpose | Example |
|---|---|---|
| `rw(percent)` | % of screen width | `rw(90)` → 90% of width |
| `rh(percent)` | % of screen height | `rh(30)` → 30% of height |
| `rf(size)` | Responsive font size | `rf(16)` |
| `rp(value)` | Responsive padding | `rp(16)` |
| `rm(value)` | Responsive margin | `rm(20)` |
| `rr(value)` | Responsive border radius | `rr(12)` |
| `ri(value)` | Responsive icon size | `ri(24)` |
| `rl(value)` | Responsive line height | `rl(24)` |
| `rls(value)` | Responsive letter spacing | `rls(1.2)` |

All values are memoized and re-computed only when the window dimensions or
accessibility font scale actually change (one shared `Dimensions` listener
for the whole app).

## Flex utilities

```ts
import { flex } from 'react-native-pixelflow';

const styles = StyleSheet.create({
  wrapper: { ...flex.center },
  header: { ...flex.between },
});
```

Available: `center`, `row`, `column`, `between`, `around`, `evenly`, `start`,
`end`, `wrap`, `fill`.

## Typography

```ts
import { typography, createTypography } from 'react-native-pixelflow';

<Text style={typography.h1}>Welcome</Text>

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

react-native-PixelFlow ships a curated map of 21 Google Font families (Inter, Roboto,
Poppins, Montserrat, Open Sans, Lato, Nunito, Raleway, Outfit, Rubik, Work
Sans, Urbanist, Manrope, DM Sans, Plus Jakarta Sans, Mulish, Ubuntu,
Quicksand, Merriweather, Playfair Display, Noto Sans) to font-family
*strings* — it does **not** bundle the actual font binaries, so every
consumer's bundle only grows by the faces they actually load.

**Loading fonts (Expo):**

```bash
npx expo install expo-font @expo-google-fonts/inter
```

```tsx
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';

const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold });
```

**Loading fonts (bare React Native):** download the `.ttf` files for the
weights you need, drop them in `assets/fonts`, add the folder to
`react-native.config.js` under `assets`, and run `npx react-native-asset`
(or link manually on iOS). The filenames must match the family strings in
`fonts.ts`, e.g. `Inter_700Bold.ttf`.

`buildFontMap()` is a small helper for wiring your own `require()`s into the
shape `expo-font`'s `useFonts` expects — see the JSDoc in `src/fonts/fonts.ts`.

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

- **`Container`** — safe-area aware, theme background, responsive padding
- **`Box`** — `p`, `px`, `py`, `m`, `mx`, `my`, `radius`, `bg`, `flex`
- **`Row`** / **`Column`** — flex layout with responsive `gap`
- **`Spacer`** — `size` (responsive), optional `axis`
- **`FText`** — `size`, `family`, `weight`, `lineHeight`, `themed`, `secondary`

## Hooks

```ts
const { width, height, scale, isTablet, isFoldable, isLandscape } = useResponsive();
const { h1, body } = useTypography();
const { deviceType, orientation, pixelDensity } = useDevice();
```

## Theming

```tsx
import { PixelFlowProvider, lightTheme, darkTheme, customTheme, useTheme } from 'react-native-pixelflow';

const brandTheme = customTheme({ base: 'dark', colors: { primary: '#FF6B6B' } });

<PixelFlowProvider theme={darkTheme}>
  <App />
</PixelFlowProvider>
```

`useTheme()` inside any child returns the active `PixelFlowTheme` (`colors`,
`dark`, `name`).

## TypeScript

Written in strict-mode TypeScript with a fully typed public API. `any` is
not used anywhere in the source.

## Compatibility

React Native 0.70 through 0.86+, Hermes, Fabric / New Architecture,
TurboModules, and Expo (managed or bare). No native modules — everything is
pure JavaScript/TypeScript, so there's nothing to autolink.

## Project layout

```
src/
  core/            scaling engine + device detection (the algorithm)
  responsive/       rw, rh, rf, rp, rm, rr, ri, rl, rls
  flex/             flex.* helpers
  typography/       typography scale
  fonts/            font family registry + loader helper
  theme/            light/dark/custom themes + PixelFlowProvider
  components/       Container, Box, Row, Column, Spacer, FText
  hooks/            useResponsive, useTypography, useDevice
  types/            shared TS types
```

## Building from source

```bash
npm install
npm run typecheck
npm run build     # emits lib/commonjs, lib/module, lib/typescript via tsup
```

## License

MIT
