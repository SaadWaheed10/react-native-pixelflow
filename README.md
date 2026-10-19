# react-native-PixelFlow

**Responsive React Native UI that stays simple.**

Write normal StyleSheet numbers (or design tokens). PixelFlow scales them for
phones, tablets, and foldables — without NativeWind or CSS-in-JS.

---

## Start in 3 steps

### 1. Install

```bash
npm install react-native-pixelflow react-native-safe-area-context
# Expo:
npx expo install react-native-safe-area-context
```

### 2. Wrap your app (order matters)

```tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PixelFlowProvider, configure } from 'react-native-pixelflow';

// Match your Figma frame once (optional but recommended)
configure({ figma: 'iPhone 14' });

export default function App() {
  return (
    <SafeAreaProvider>
      <PixelFlowProvider followSystem>
        {/* your screens */}
      </PixelFlowProvider>
    </SafeAreaProvider>
  );
}
```

### 3. Build a screen

**Option A — easiest (tokens + components):**

```tsx
import { Container, Box, FText, Button, Spacer } from 'react-native-pixelflow';

export function HomeScreen() {
  return (
    <Container>
      <Box p="md" bg="surface" radius="lg">
        <FText variant="h2">Welcome</FText>
        <FText color="fg.muted">Looks good on every phone size.</FText>
        <Spacer size={16} />
        <Button intent="primary" onPress={() => {}}>
          Get started
        </Button>
      </Box>
    </Container>
  );
}
```

**Option B — paste Figma numbers into a StyleSheet:**

```tsx
import { usePixelSheet, FText } from 'react-native-pixelflow';

export function Card() {
  const styles = usePixelSheet(() => ({
    box: { padding: 16, borderRadius: 12 },
    title: { fontSize: 24, marginBottom: 8 },
  }));

  return (
    <>
      <FText style={styles.title}>Title</FText>
      {/* use styles.box on a View */}
    </>
  );
}
```

That’s enough for most apps. Everything below is optional.

---

## What should I use?

| I want to… | Use this |
|---|---|
| Build a screen quickly | `Container`, `Box`, `FText`, `Button`, `Spacer` |
| Paste Figma px into styles | `usePixelSheet(() => ({ … }))` |
| Match my Figma frame | `configure({ figma: 'iPhone 14' })` |
| Support iPad / large screens | `Grid`, `SplitView`, `ContentWidth`, `useWindowClass` |
| See live scale values in the app | `{__DEV__ && <PixelFlowDebug />}` |
| Coming from size-matters | `npx pixelflow migrate ./src` or `scale` / `ms` aliases |

---

## Everyday building blocks

### Box & text (design tokens)

```tsx
<Box p="md" px={{ compact: 'sm', medium: 'lg' }} bg="bg.subtle" radius="lg">
  <FText variant="h2" color="primary">Title</FText>
  <FText color="fg.muted">Subtitle</FText>
</Box>
```

**Spacing:** `xs` `sm` `md` `lg` `xl` `xxl`  
**Radius:** `none` `sm` `md` `lg` `xl` `full`  
**Colors:** `primary`, `surface`, `text`, … or semantic `bg.subtle`, `fg.muted`, `border.default`

You can still pass raw numbers: `<Box p={16} />`.

### PixelSheet (auto-scale by property)

| Style key | Scales as |
|---|---|
| `fontSize` | font |
| `padding` / `margin` / `gap` | spacing |
| `borderRadius` | radius |
| `%` / `flex` / `opacity` | unchanged |

Prefer **`usePixelSheet`** inside components so styles update on rotation.

Avoid module-level `StyleSheet.create({ padding: rp(16) })` — that freezes the number at import time.

### Button

```tsx
<Button intent="primary" size="lg" fullWidth onPress={onSave}>
  Save
</Button>
```

`intent`: `primary` | `secondary` | `danger` | `ghost`  
`size`: `sm` | `md` | `lg`

---

## Tablets & larger screens (when you need them)

Scaling alone makes iPad UI “bigger phone.” For real tablet UX, **change layout**:

```tsx
import {
  Grid,
  SplitView,
  ContentWidth,
  useWindowClass,
} from 'react-native-pixelflow';

const { widthClass, columns, meets } = useWindowClass();
// widthClass: compact → medium → expanded → large → extraLarge

<ContentWidth>
  <Grid minItemWidth={160} gap={12}>
    {items.map((item) => (
      <Card key={item.id} {...item} />
    ))}
  </Grid>
</ContentWidth>

<SplitView
  breakpoint="medium"
  master={<List />}
  detail={<Detail />}
/>
```

---

## Try it fast

- **Expo Snack:** copy [`example/SnackApp.tsx`](./example/SnackApp.tsx) — see [`example/README.md`](./example/README.md)
- **In your app:** drop in [`example/ExampleScreen.tsx`](./example/ExampleScreen.tsx)

---

## Coming from `react-native-size-matters`?

```bash
npx pixelflow migrate ./src
```

Or keep familiar names:

```ts
import { scale, moderateScale, s, ms } from 'react-native-pixelflow';
```

---

## Advanced (optional)

Only reach for these when the basics aren’t enough.

<details>
<summary><strong>Configure options</strong></summary>

```ts
configure({
  figma: 'iPhone 14',           // or { width: 390, height: 844 }
  density: 'comfortable',       // compact | comfortable | spacious
  maxFontSizeMultiplier: 1.3,
  applyAccessibilityFontScale: true,
});
```

`listFigmaPresets()` shows all named frames (`iPhone 14`, `Pixel 7`, `iPad Pro 11`, …).

</details>

<details>
<summary><strong>Manual scale helpers</strong></summary>

| Function | Use for |
|---|---|
| `rp` / `rm` | padding / margin |
| `rf` / `rl` / `rls` | font / line height / letter spacing |
| `rr` / `ri` | radius / icon |
| `rw` / `rh` | % of screen width / height |
| `rsw` / `rsh` | % of **safe** width / height |
| `rs({ phone, tablet })` | per-device value |
| `design(16)` | same as `rp(16)` from Figma |

</details>

<details>
<summary><strong>Responsive props</strong></summary>

```tsx
<Box
  p={{ compact: 'sm', medium: 'md', expanded: 'lg' }}
  flexDirection={['column', 'row']}  // compact, medium, expanded
/>
```

</details>

<details>
<summary><strong>Variants, media, motion, a11y</strong></summary>

```ts
import { createVariants, useMedia, useMotion, useA11yLayout } from 'react-native-pixelflow';

const chip = createVariants({
  base: { padding: 8, borderRadius: 8 },
  variants: {
    tone: { neutral: { opacity: 1 }, danger: { opacity: 0.9 } },
  },
});

const media = useMedia();
if (media.lg || media.matches({ minWidth: 840 })) { /* wide layout */ }

const motion = useMotion(); // durations become 0 if Reduce Motion is on
const { preferStack } = useA11yLayout();
```

</details>

<details>
<summary><strong>Theming</strong></summary>

```tsx
import { customTheme, PixelFlowProvider } from 'react-native-pixelflow';

const brand = customTheme({
  base: 'light',
  colors: { primary: '#FF6B6B' },
});

<PixelFlowProvider theme={brand} density="comfortable">
  <App />
</PixelFlowProvider>
```

</details>

<details>
<summary><strong>Fonts</strong></summary>

PixelFlow maps family names → strings (e.g. `fonts.inter.bold`).  
It does **not** bundle font files.

```bash
npx expo install expo-font @expo-google-fonts/inter
```

```tsx
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
const [loaded] = useFonts({ Inter_400Regular, Inter_700Bold });
```

See `src/fonts/fontRegistry.ts` for the full family list.

</details>

<details>
<summary><strong>Testing & ESLint</strong></summary>

```ts
import { mockDimensions, resetPixelFlow } from 'react-native-pixelflow/testing';

beforeEach(() => {
  resetPixelFlow();
  mockDimensions({ width: 390, height: 844 });
});
```

```js
// ESLint — warn on raw padding/fontSize outside PixelSheet
plugins: { pixelflow: require('react-native-pixelflow/eslint-plugin') },
rules: { 'pixelflow/no-raw-spacing': 'warn' }
```

</details>

<details>
<summary><strong>Why PixelFlow? (short)</strong></summary>

Most libs only do `width / 375` scaling. PixelFlow blends width + height, damps tablets/foldables, and can change **layout** (grid / split) — not only enlarge padding.

Works with RN 0.70+, Hermes, Fabric, Expo. Pure JS/TS — no native modules.

</details>

---

## Compatibility

- React Native **0.70+**
- Expo (managed or bare)
- TypeScript (strict, full typings)

## License

MIT — see [LICENSE](./LICENSE)

## Changelog

[CHANGELOG.md](./CHANGELOG.md)
