# Changelog

All notable changes to this project are documented in this file.

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
