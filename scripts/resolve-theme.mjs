import {
  BUTTON_SET,
  EXCLUDED_OUTPUT_TYPES,
  getTokenSetOrder,
  getThemes,
} from './load-tokens.mjs';

const DEFAULT_THEMES = {
  brand: 'Second Act',
  accent: 'green',
  type: 'cinematic',
  radius: 'round',
  canvas: 'warm',
  elevation: 'soft',
};

function isTokenLeaf(node) {
  return (
    node &&
    typeof node === 'object' &&
    !Array.isArray(node) &&
    Object.prototype.hasOwnProperty.call(node, 'value') &&
    Object.prototype.hasOwnProperty.call(node, 'type')
  );
}

function deepMerge(target, source) {
  if (!source || typeof source !== 'object' || Array.isArray(source)) return target;
  for (const [key, value] of Object.entries(source)) {
    if (isTokenLeaf(value)) {
      target[key] = structuredClone(value);
      continue;
    }
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (!target[key] || typeof target[key] !== 'object' || isTokenLeaf(target[key])) {
        target[key] = {};
      }
      deepMerge(target[key], value);
    }
  }
  return target;
}

function parseReference(value) {
  if (typeof value !== 'string') return null;
  const match = value.match(/^\{([^}]+)\}$/);
  return match ? match[1].split('.') : null;
}

function getByPath(root, pathParts) {
  let node = root;
  for (const part of pathParts) {
    if (!node || typeof node !== 'object') return undefined;
    node = node[part];
  }
  return node;
}

function resolveTokenValue(node, root, stack = new Set()) {
  if (!isTokenLeaf(node)) return node;

  const ref = parseReference(node.value);
  if (!ref) return node.value;

  const key = ref.join('.');
  if (stack.has(key)) return node.value;
  stack.add(key);

  const target = getByPath(root, ref);
  if (!isTokenLeaf(target)) return node.value;

  const resolved = resolveTokenValue(target, root, stack);
  stack.delete(key);
  return resolved;
}

export function mergeThemeSets(tokens, theme) {
  const order = getTokenSetOrder(tokens);
  const merged = {};
  const participating = Object.entries(theme.selectedTokenSets ?? {});

  for (const setName of order) {
    const mode = theme.selectedTokenSets?.[setName];
    if (!mode || !tokens[setName]) continue;
    if (mode === 'source' || mode === 'enabled') {
      deepMerge(merged, tokens[setName]);
    }
  }

  for (const [setName, mode] of participating) {
    if (!order.includes(setName) && tokens[setName] && (mode === 'source' || mode === 'enabled')) {
      deepMerge(merged, tokens[setName]);
    }
  }

  return merged;
}

function cssVarFromDescription(description) {
  if (!description || typeof description !== 'string') return null;
  const match = description.match(/^(--[\w-]+)/);
  return match ? match[1] : null;
}

function cssVarFromPath(pathParts) {
  return `--${pathParts.join('-')}`;
}

function walkTokens(node, pathParts, callback) {
  if (isTokenLeaf(node)) {
    callback({ pathParts, token: node });
    return;
  }
  if (!node || typeof node !== 'object' || Array.isArray(node)) return;
  for (const [key, value] of Object.entries(node)) {
    walkTokens(value, [...pathParts, key], callback);
  }
}

export function extractCssVars(mergedTree) {
  const vars = new Map();

  walkTokens(mergedTree, [], ({ pathParts, token }) => {
    if (EXCLUDED_OUTPUT_TYPES.has(token.type)) return;
    if (pathParts.join('.').startsWith('comp.')) return;

    const cssVar = cssVarFromDescription(token.description) ?? cssVarFromPath(pathParts);
    if (cssVarFromDescription(token.description) === null && pathParts[0] === 'colour') return;

    vars.set(cssVar, {
      cssVar,
      pathParts,
      token,
      resolvedValue: resolveTokenValue(token, mergedTree),
    });
  });

  return vars;
}

export function getThemeByGroupAndName(tokens, group, name) {
  return getThemes(tokens).find((theme) => theme.group === group && theme.name === name);
}

export function getDefaultRootTheme(tokens) {
  const brand = getThemeByGroupAndName(tokens, 'brand', DEFAULT_THEMES.brand);
  return brand ?? getThemes(tokens)[0];
}

export function resolveThemeCssVars(tokens, theme) {
  const merged = mergeThemeSets(tokens, theme);
  return extractCssVars(merged);
}

export { DEFAULT_THEMES, BUTTON_SET, getThemes };
