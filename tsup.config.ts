import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['cjs'],
    outDir: 'lib/commonjs',
    dts: false,
    sourcemap: true,
    clean: true,
    external: ['react', 'react-native', 'expo-font'],
  },
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    outDir: 'lib/module',
    dts: false,
    sourcemap: true,
    external: ['react', 'react-native', 'expo-font'],
  },
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    outDir: 'lib/typescript',
    dts: { only: true },
    external: ['react', 'react-native', 'expo-font'],
  },
]);
