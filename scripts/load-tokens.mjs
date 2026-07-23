import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const TOKENS_DIR = join(__dirname, '../src/tokens');

const SKIP_FILES = new Set([
  '$metadata.json',
  '$themes.json',
  '$figma-collections.json',
  '.tokens.normalized.json',
  '.tokens.test.json',
]);

export const RESERVED_KEYS = new Set(['$themes', '$metadata', '$figma-collections']);
export const BUTTON_SET = '7. Components/Button';
export const EXCLUDED_OUTPUT_TYPES = new Set(['composition']);

/** Token sets that ship in @easysimplecool/design-system variables.css */
export const DESIGN_SYSTEM_CSS_SETS = ['0. Core/Default', '7. Components/Button'];

export function getTokenSetOrder(tokens) {
  return (tokens.$metadata?.tokenSetOrder ?? []).filter((setName) => !RESERVED_KEYS.has(setName));
}

export function getThemes(tokens) {
  return tokens.$themes ?? [];
}

function walkJsonFiles(dir, baseDir = dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('.')) continue;
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      walkJsonFiles(fullPath, baseDir, files);
      continue;
    }
    if (!entry.endsWith('.json') || SKIP_FILES.has(entry)) continue;
    const setName = relative(baseDir, fullPath).replace(/\\/g, '/').replace(/\.json$/, '');
    files.push({ setName, fullPath });
  }
  return files;
}

/**
 * Load Tokens Studio multifile output from src/tokens/ (supports nested folders).
 */
export function loadTokenSets(tokensDir = TOKENS_DIR) {
  const tokens = {};

  for (const { setName, fullPath } of walkJsonFiles(tokensDir)) {
    tokens[setName] = JSON.parse(readFileSync(fullPath, 'utf8'));
  }

  const metadataPath = join(tokensDir, '$metadata.json');
  if (existsSync(metadataPath)) {
    tokens.$metadata = JSON.parse(readFileSync(metadataPath, 'utf8'));
  }

  const themesPath = join(tokensDir, '$themes.json');
  if (existsSync(themesPath)) {
    tokens.$themes = JSON.parse(readFileSync(themesPath, 'utf8'));
  }

  return tokens;
}

export function setNameToPath(setName, tokensDir = TOKENS_DIR) {
  return join(tokensDir, `${setName}.json`);
}

/**
 * Keep only sets that belong in the published design-system CSS bundle.
 * Theme axis overrides (Accent/*, Canvas/*, etc.) stay in repo for Figma
 * but are not emitted to variables.css.
 */
export function filterForDesignSystemBuild(tokens) {
  const filtered = {};
  const order = DESIGN_SYSTEM_CSS_SETS.filter((setName) => tokens[setName]);

  for (const setName of order) {
    filtered[setName] = tokens[setName];
  }

  filtered.$metadata = {
    ...tokens.$metadata,
    tokenSetOrder: order,
  };

  return filtered;
}

function isDuplicateSetWrapper(setContent, setName) {
  if (!Object.prototype.hasOwnProperty.call(setContent, setName)) return false;

  const inner = setContent[setName];
  if (!inner || typeof inner !== 'object' || Array.isArray(inner)) return false;

  if (setName.includes('/')) return true;

  return Object.prototype.hasOwnProperty.call(inner, setName);
}

export function unwrapDuplicateSetKeys(setContent, setName) {
  if (!setContent || typeof setContent !== 'object' || Array.isArray(setContent)) {
    return setContent;
  }

  if (isDuplicateSetWrapper(setContent, setName)) {
    return unwrapDuplicateSetKeys(setContent[setName], setName);
  }

  const unwrapped = {};
  for (const [key, value] of Object.entries(setContent)) {
    unwrapped[key] =
      value && typeof value === 'object' && !Array.isArray(value)
        ? unwrapDuplicateSetKeys(value, setName)
        : value;
  }
  return unwrapped;
}

export function findDuplicateSetKeys(tokens) {
  const actualSets = Object.keys(tokens).filter((key) => !RESERVED_KEYS.has(key));
  return actualSets.filter((setName) => isDuplicateSetWrapper(tokens[setName], setName));
}

function syncMetadata(tokens) {
  const actualSets = Object.keys(tokens).filter((key) => !RESERVED_KEYS.has(key));
  const declaredOrder = (tokens.$metadata?.tokenSetOrder ?? []).filter(
    (setName) => !RESERVED_KEYS.has(setName),
  );

  const ghostSets = declaredOrder.filter((setName) => !actualSets.includes(setName));
  const undeclaredSets = actualSets.filter((setName) => !declaredOrder.includes(setName));

  if (ghostSets.length > 0) {
    console.warn(
      `[tokens] $metadata.tokenSetOrder lists sets missing from src/tokens/ — delete these in Tokens Studio: ${ghostSets.join(', ')}`,
    );
  }

  if (undeclaredSets.length > 0) {
    console.warn(
      `[tokens] Token sets exist but are missing from $metadata.tokenSetOrder — drag to reorder in Tokens Studio: ${undeclaredSets.join(', ')}`,
    );
  }

  const reconciledOrder = [
    ...declaredOrder.filter((setName) => actualSets.includes(setName)),
    ...undeclaredSets.filter((setName) => !declaredOrder.includes(setName)),
  ];

  return {
    ...tokens.$metadata,
    tokenSetOrder: reconciledOrder.length > 0 ? reconciledOrder : actualSets,
  };
}

export function normalizeTokenSets(tokens) {
  const normalized = { ...tokens };

  for (const [setName, setContent] of Object.entries(tokens)) {
    if (RESERVED_KEYS.has(setName)) continue;
    normalized[setName] = unwrapDuplicateSetKeys(setContent, setName);
  }

  normalized.$metadata = syncMetadata(normalized);

  return normalized;
}
