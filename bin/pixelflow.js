#!/usr/bin/env node
'use strict';

/**
 * PixelFlow CLI
 *
 *   npx pixelflow migrate [path]
 *   npx pixelflow tokens <figma-variables.json> [-o theme.ts]
 */

const fs = require('fs');
const path = require('path');

const EXT = new Set(['.ts', '.tsx', '.js', '.jsx']);

function printHelp() {
  console.log(`
react-native-pixelflow CLI

Usage:
  npx pixelflow migrate [dir]              Migrate size-matters → PixelFlow
  npx pixelflow tokens <file.json> [opts]  Figma Variables → theme TS module
  npx pixelflow help

Tokens options:
  -o, --out <file>     Output path (default: ./pixelflow-theme.ts)
  --base light|dark    Base palette (default: light)
  --name <name>        Theme name (default: figma)

Examples:
  npx pixelflow migrate ./src
  npx pixelflow tokens ./figma-variables.json -o src/theme/figmaTheme.ts
`);
}

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'lib' || entry.name.startsWith('.')) {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (EXT.has(path.extname(entry.name))) files.push(full);
  }
  return files;
}

function migrateSource(source) {
  let out = source;
  let changed = false;

  const replacements = [
    [
      /from\s+['"]react-native-size-matters['"]/g,
      "from 'react-native-pixelflow'",
    ],
    [
      /require\(\s*['"]react-native-size-matters['"]\s*\)/g,
      "require('react-native-pixelflow')",
    ],
    [/ScaledSheet\.create/g, 'PixelSheet.create'],
    [/\bScaledSheet\b/g, 'PixelSheet'],
  ];

  for (const [pattern, replacement] of replacements) {
    if (pattern.test(out)) {
      out = out.replace(pattern, replacement);
      changed = true;
    }
    pattern.lastIndex = 0;
  }

  const annotated = out.replace(
    /(['"])(\d+(?:\.\d+)?)@(?:ms|mvs|vs|s)\d*(?:r)?\1/g,
    (_, _q, num) => num,
  );
  if (annotated !== out) {
    out = annotated;
    changed = true;
  }

  if (
    changed &&
    /\bPixelSheet\b/.test(out) &&
    !/PixelSheet/.test(
      (out.match(/import\s+\{[^}]+\}/g) || []).join(''),
    ) &&
    /from\s+['"]react-native-pixelflow['"]/.test(out)
  ) {
    out = out.replace(
      /import\s+\{([^}]+)\}\s+from\s+['"]react-native-pixelflow['"]/,
      (full, inner) => {
        if (/\bPixelSheet\b/.test(inner)) return full;
        return `import {${inner.trim().length ? ` ${inner.trim()}, PixelSheet ` : ' PixelSheet '}} from 'react-native-pixelflow'`;
      },
    );
  }

  return { out, changed };
}

function migrate(targetDir) {
  const root = path.resolve(process.cwd(), targetDir || '.');
  const files = walk(root);
  let count = 0;
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    if (
      !source.includes('size-matters') &&
      !source.includes('ScaledSheet') &&
      !source.includes('@ms') &&
      !source.includes('@s')
    ) {
      continue;
    }
    const { out, changed } = migrateSource(source);
    if (changed) {
      fs.writeFileSync(file, out, 'utf8');
      count += 1;
      console.log(`migrated ${path.relative(process.cwd(), file)}`);
    }
  }
  console.log(`\nDone. Updated ${count} file(s).`);
  console.log(
    'Review PixelSheet.create sites — annotations like "16@ms" became plain numbers.',
  );
}

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '-o' || a === '--out') {
      flags.out = argv[++i];
    } else if (a === '--base') {
      flags.base = argv[++i];
    } else if (a === '--name') {
      flags.name = argv[++i];
    } else if (a.startsWith('-')) {
      console.error(`Unknown flag: ${a}`);
      process.exit(1);
    } else {
      positional.push(a);
    }
  }
  return { positional, flags };
}

function tokensCommand(argv) {
  const { positional, flags } = parseArgs(argv);
  const inputPath = positional[0];
  if (!inputPath) {
    console.error('Usage: npx pixelflow tokens <figma-variables.json> [-o out.ts]');
    process.exit(1);
  }
  const abs = path.resolve(process.cwd(), inputPath);
  if (!fs.existsSync(abs)) {
    console.error(`File not found: ${abs}`);
    process.exit(1);
  }

  // Prefer compiled lib; fall back to a tiny inline emitter if build missing.
  let emitThemeModule;
  try {
    const mod = require('../lib/commonjs/index.js');
    emitThemeModule = mod.emitThemeModule;
  } catch {
    emitThemeModule = null;
  }

  const json = JSON.parse(fs.readFileSync(abs, 'utf8'));
  let source;
  if (typeof emitThemeModule === 'function') {
    source = emitThemeModule(json, {
      base: flags.base === 'dark' ? 'dark' : 'light',
      name: flags.name || 'figma',
    });
  } else {
    console.error(
      'Build the package first (`npm run build`) so `emitThemeModule` is available.',
    );
    process.exit(1);
  }

  const outPath = path.resolve(
    process.cwd(),
    flags.out || './pixelflow-theme.ts',
  );
  fs.writeFileSync(outPath, source, 'utf8');
  console.log(`Wrote ${path.relative(process.cwd(), outPath)}`);
}

const [cmd, ...rest] = process.argv.slice(2);
if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h') {
  printHelp();
  process.exit(0);
}
if (cmd === 'migrate') {
  migrate(rest[0] || '.');
  process.exit(0);
}
if (cmd === 'tokens') {
  tokensCommand(rest);
  process.exit(0);
}

console.error(`Unknown command: ${cmd}`);
printHelp();
process.exit(1);
