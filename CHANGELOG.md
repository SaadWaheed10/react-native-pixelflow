# Changelog

All notable changes to this project are documented in this file.

## [0.2.0] — 2026-10-10

### Added
- `configure()` for design baseline (`baseWidth` / `baseHeight`), accessibility font-scale clamps, and tablet/foldable damping
- `useScaledStyles()` — StyleSheet factory that recomputes on rotation / config change
- `rs()` and `useResponsive().select()` for phone / tablet / foldable values
- `PixelFlowProvider` `followSystem` (plus `light` / `dark` overrides) via `useColorScheme`
- Theme `spacing` tokens and `useThemeSpacing()`
- Live subscriptions in layout components (`Container`, `Box`, `Row`, `Column`, `Spacer`, `FText`)
- Unit tests for device classification and scaling math

### Changed
- `useResponsive().scale` now matches the hybrid spacing scale (same curve as `rp` / `rm`)
- `FText` defaults `allowFontScaling` to `false` when PixelFlow applies OS font scale (avoids double scaling)
- `Container` uses `SafeAreaView` from required peer `react-native-safe-area-context` (wrap app in `SafeAreaProvider`)
- `flex` and `fonts` preserve autocomplete keys in TypeScript
- `buildFontMap` warns on unknown weights
- Package `exports` include a `default` condition; `sideEffects: false`

### Fixed
- Module-level typography / styles freezing across orientation changes (use hooks for live UI)
- Silent double application of accessibility font scale on themed text

## [0.1.1] — previous

Initial public API: responsive helpers, flex, typography, fonts map, theme, and layout components.
