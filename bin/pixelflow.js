#!/usr/bin/env node
'use strict';

/**
 * PixelFlow CLI
 *
 *   npx pixelflow migrate [path]
 *
 * Migrates common react-native-size-matters patterns toward PixelFlow.
 */

const fs = require('fs');
const path = require('path');

const EXT = new Set(['.ts', '.tsx', '.js', '.jsx']);

function printHelp() {
  console.log(`
react-native-pixelflow CLI

Usage:
  npx pixelflow migrate [dir]   Migrate size-matters imports/ScaledSheet → PixelFlow
  npx pixelflow help

Examples:
  npx pixelflow migrate .
  npx pixelflow migrate ./src
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
    // reset lastIndex for global regex reuse
    pattern.lastIndex = 0;
  }

  // Convert '16@ms' / "12@s" style annotations to plain numbers (PixelSheet auto-scales).
  const annotated = out.replace(
    /(['"])(\d+(?:\.\d+)?)@(?:ms|mvs|vs|s)\d*(?:r)?\1/g,
    (_, _q, num) => num,
  );
  if (annotated !== out) {
    out = annotated;
    changed = true;
  }

  // Ensure PixelSheet is imported when used after migration.
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

const [cmd, arg] = process.argv.slice(2);
if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h') {
  printHelp();
  process.exit(0);
}
if (cmd === 'migrate') {
  migrate(arg || '.');
  process.exit(0);
}

console.error(`Unknown command: ${cmd}`);
printHelp();
process.exit(1);
