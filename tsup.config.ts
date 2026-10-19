import { defineConfig } from 'tsup';

const external = [
  'react',
  'react-native',
  'expo-font',
  'react-native-safe-area-context',
];

export default defineConfig([
  {
    entry: ['src/index.ts', 'src/testing/index.ts'],
    format: ['cjs'],
    outDir: 'lib/commonjs',
    dts: false,
    sourcemap: true,
    clean: true,
    external,
  },
  {
    entry: ['src/index.ts', 'src/testing/index.ts'],
    format: ['esm'],
    outDir: 'lib/module',
    dts: false,
    sourcemap: true,
    external,
    outExtension: () => ({ js: '.js' }),
  },
  {
    entry: ['src/index.ts', 'src/testing/index.ts'],
    format: ['cjs'],
    outDir: 'lib/typescript',
    dts: { only: true },
    external,
  },
]);
