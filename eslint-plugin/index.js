'use strict';

/**
 * ESLint plugin for react-native-pixelflow.
 *
 * Warns on raw numeric padding/margin/fontSize in StyleSheet.create /
 * object literals — nudge toward PixelSheet or design tokens.
 *
 * Usage (eslint.config.js / .eslintrc):
 *   plugins: ['pixelflow']  // resolve: require('react-native-pixelflow/eslint-plugin')
 *   rules: { 'pixelflow/no-raw-spacing': 'warn' }
 */

const SCALED_KEYS = new Set([
  'padding',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingHorizontal',
  'paddingVertical',
  'margin',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginHorizontal',
  'marginVertical',
  'gap',
  'rowGap',
  'columnGap',
  'fontSize',
  'lineHeight',
  'borderRadius',
  'letterSpacing',
]);

const ALLOWED_CALLEES = new Set([
  'rp',
  'rm',
  'rf',
  'rl',
  'rr',
  'ri',
  'rls',
  'design',
  'scale',
  'moderateScale',
  'verticalScale',
  'ms',
  's',
  'vs',
  'mvs',
]);

function isAllowedCall(node) {
  if (!node || node.type !== 'CallExpression') return false;
  const callee = node.callee;
  if (callee.type === 'Identifier') return ALLOWED_CALLEES.has(callee.name);
  if (
    callee.type === 'MemberExpression' &&
    callee.object.type === 'Identifier' &&
    callee.object.name === 'design'
  ) {
    return true;
  }
  return false;
}

function isInsidePixelSheet(ancestors) {
  return ancestors.some((a) => {
    if (a.type !== 'CallExpression') return false;
    const c = a.callee;
    if (c.type === 'MemberExpression') {
      return (
        c.object.type === 'Identifier' &&
        (c.object.name === 'PixelSheet' || c.object.name === 'usePixelSheet') &&
        c.property.type === 'Identifier' &&
        (c.property.name === 'create' || c.object.name === 'usePixelSheet')
      );
    }
    if (c.type === 'Identifier' && c.name === 'usePixelSheet') return true;
    return false;
  });
}

const noRawSpacing = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Prefer PixelSheet / rp|rf|design() over raw numeric spacing and font sizes',
    },
    schema: [],
    messages: {
      raw: 'Raw numeric "{{key}}" — use PixelSheet, a design token, or rp()/rf()/design().',
    },
  },
  create(context) {
    return {
      Property(node) {
        if (node.computed || node.key.type !== 'Identifier') return;
        const key = node.key.name;
        if (!SCALED_KEYS.has(key)) return;
        if (node.value.type !== 'Literal' || typeof node.value.value !== 'number') {
          return;
        }
        if (node.value.value === 0) return;
        const ancestors = context.sourceCode
          ? context.sourceCode.getAncestors(node)
          : context.getAncestors();
        if (isInsidePixelSheet(ancestors)) return;
        // Allow values already wrapped… (Literal means not wrapped)
        if (isAllowedCall(node.value)) return;

        context.report({
          node: node.value,
          messageId: 'raw',
          data: { key },
        });
      },
    };
  },
};

module.exports = {
  rules: {
    'no-raw-spacing': noRawSpacing,
  },
  configs: {
    recommended: {
      plugins: ['pixelflow'],
      rules: {
        'pixelflow/no-raw-spacing': 'warn',
      },
    },
  },
};
