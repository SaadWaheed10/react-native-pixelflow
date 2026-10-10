import { defineConfig } from 'tsup';

const external = [
  'react',
  'react-native',
  'expo-font',
  'react-native-safe-area-context',
];

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['cjs'],
    outDir: 'lib/commonjs',
    dts: false,
    sourcemap: true,
    clean: true,
    external,
  },
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    outDir: 'lib/module',
    dts: false,
    sourcemap: true,
    external,
    // RN tooling / package.json "module" expect .js, not .mjs
    outExtension: () => ({ js: '.js' }),
  },
  {
    entry: ['src/index.ts'],
    // cjs + dts-only emits index.d.ts (esm would emit .d.mts)
    format: ['cjs'],
    outDir: 'lib/typescript',
    dts: { only: true },
    external,
  },
]);
