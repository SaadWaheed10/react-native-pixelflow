# Changelog

All notable changes to this project are documented in this file.

## [0.6.0] — 2026-10-21

### Added
- **`styled()`** — token style factory (`styled(View, { p: 'md', bg: 'surface' })`)
- **RTL spacing** — `ps`/`pe`/`ms`/`me` on Box/styled + `isRTL` / `rtlInsets` / `logicalHorizontal`
- **`useA11yPrefs()`** — bold text, reduce motion, high contrast + `a11yTheme`
- **`usePointer()`** — fine/coarse pointer + `canHover` (iPad / RN Web)
- **Figma tokens CLI** — `npx pixelflow tokens ./figma-variables.json` + `themeFromFigma` / `emitThemeModule`
- **`createNavigationTheme()`** — React Navigation theme from PixelFlow colors
- **Worklet-safe scale** — `useScaleContext` + `rfWith` / `rpWith` / `rrWith` for Reanimated
- **SSR hydrate lock** — `setHydrateLock` / `PixelFlowProvider ssrWidth` (Expo Router web)
- **`useEstimatedItemSize()`** — FlashList/FlatList estimates tracking density + a11y
- **`useOverlayInsets()`** — safe area + keyboard + fold hinge for portals/FABs
- **Layout regression harness** — `assertLayout` / `LAYOUT_FIXTURES` in `/testing`
- **`Shell.Phone` / `Shell.Tablet` / `Shell.Tabletop`** — adaptive app shells
- **ESLint `pixelflow/no-frozen-rp`** — ban `rp()` inside `StyleSheet.create`

## [0.5.0] — 2026-10-20

### Added
- **`useContainerSize` / `<ContainerQuery>`** — parent-size “container queries” with local window class
- **`fluid(min, preferred, max)`** — CSS-style fluid type/spacing between viewport widths
- **`useReadableWidth` / `maxCh`** — readable measure (chars-per-line) caps for body text
- **`useOrientation` / `<OrientationGate>`** — orientation helpers + rotate fallback UI
- **`<Show>` / `<Hide>`** — breakpoint / width / orientation visibility
- **`useFoldState` / `setFoldState`** — fold posture (native bridge + heuristic fallback)
- **`useAdaptiveNav`** — tabs / rail / drawer hints for React Navigation
- **`useMultiWindow`** — detect compact windows on tablet/foldable (split-screen)
- **`match()` / `rs.match` / `rs.class` / `rs.select`** — clearer responsive value pickers
- **`useImageSize`** — clamped responsive avatar/thumbnail sizes
- **`PixelFlowDebug`** — shows multi-window, fold posture, content max width, adaptive nav

## [0.4.0] — 2026-10-20

### Added
- **`shadow()`** — cross-platform elevation (`sm` | `md` | `lg` | `xl` | number)
- **`clamp()`** — clamp scaled values between min/max
- **`createPressStyle()`** — Pressable style callback for pressed / hovered / focused / disabled
- **`<Stack>` / `<HStack>` / `<VStack>` / `<AdaptiveStack>`** — tokenized gap stacks; AdaptiveStack flips at a window-class breakpoint
- **`<AspectBox>`** — fixed aspect ratio (`"16:9"`, `1.5`, …)
- **`<Card>`** — surface + tokens + shadow
- **`<KeyboardScreen>`** — SafeArea + KeyboardAvoidingView + optional ScrollView shell
- **`<FormField>`** — label / helper / error wrapper (optional chrome)
- **`useInsetStyle()`** — safe-area padding/margin + tokenized extra
- **`useListLayout()`** — FlatList helpers on top of `useGrid` (`numColumns`, `columnWrapperStyle`, remount `key`)
- **`useRecipes()`** — themed style recipes (`screen`, `listRow`, `fab`, `chip`, …)

## [0.3.0] — 2026-10-19

### Added
- **`PixelSheet` / `usePixelSheet`** — property-aware StyleSheet auto-scaling
- **`useWindowClass()`** — Material 3 window width classes with columns / nav hints
- **`useGrid` / `<Grid>`** — columns from `minItemWidth` + `gap`
- **Figma presets** — `configure({ figma: 'iPhone 14' })`, `design()` helpers
- **`<ContentWidth>`** / **`<SplitView>`** — adaptive shells
- **Design tokens on `Box` / `FText`** — `p="md"`, `bg="surface"`, `radius="lg"`, `variant="h2"`
- **Responsive props** — window maps, device maps, `[compact, medium, expanded]` tuples
- **`createVariants()`** — variants + compound variants
- **Density modes** — `compact` | `comfortable` | `spacious`
- **A11y** — `useA11yLayout()`, `useReduceMotion()`, `maxFontSizeMultiplier`
- **Safe metrics** — `rsw` / `rsh`, `useKeyboardInset()`
- **`<PixelFlowDebug />`** — floating inspector
- **size-matters aliases** — `scale` / `ms` / `s` / `vs` / `mvs`
- **`<Button>`** — themed intents/sizes with a11y min heights
- **`hairline` / `absoluteFill` / `layout`** helpers
- **Testing utils** — `react-native-pixelflow/testing` (`mockDimensions`, `resetPixelFlow`)
- **Expo Snack demo** — `example/SnackApp.tsx` + `example/README.md`
- **Semantic colors** — `bg.subtle`, `fg.muted`, `border.focus`, `accent.primary`, …
- **`useMedia()`** — CSS-like media queries (`minWidth`, `minClass`, orientation, …)
- **Motion tokens** — `theme.motion` + `useMotion()` (zeros durations under Reduce Motion)
- **CLI** — `npx pixelflow migrate` (size-matters → PixelFlow)
- **ESLint plugin** — `react-native-pixelflow/eslint-plugin` rule `pixelflow/no-raw-spacing`

## [0.2.0] — 2026-10-10

### Added
- `configure()`, live styles hooks, `rs` / `select`, system theming, required safe-area `Container`

## [0.1.1] — previous

Initial public API.
