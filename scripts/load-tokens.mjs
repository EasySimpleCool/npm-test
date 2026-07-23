import { existsSync, readdirSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const TOKENS_DIR = join(__dirname, '../src/tokens');

const SKIP_FILES = new Set([
  '$metadata.json',
  '$themes.json',
  '.tokens.normalized.json',
  '.tokens.test.json',
]);
export const RESERVED_KEYS = new Set(['$themes', '$metadata']);

/**
 * Load Tokens Studio multifile output from src/tokens/.
 * Each *.json file (except metadata/themes) is a token set named after the file stem.
 */
export function loadTokenSets(tokensDir = TOKENS_DIR) {
  const tokens = {};

  for (const file of readdirSync(tokensDir)) {
    if (!file.endsWith('.json') || file.startsWith('.') || SKIP_FILES.has(file)) continue;
    const setName = file.replace(/\.json$/, '');
    tokens[setName] = JSON.parse(readFileSync(join(tokensDir, file), 'utf8'));
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

function isDuplicateSetWrapper(setContent, setName) {
  if (!Object.prototype.hasOwnProperty.call(setContent, setName)) return false;

  const inner = setContent[setName];
  if (!inner || typeof inner !== 'object' || Array.isArray(inner)) return false;

  // Slash-named sets (e.g. comp/button) may repeat the set name as a wrapper.
  if (setName.includes('/')) return true;

  // Otherwise only hoist when the inner group repeats the set name again.
  return Object.prototype.hasOwnProperty.call(inner, setName);
}

/**
 * Tokens Studio can push a duplicate set-name group inside a token set
 * (e.g. "comp/button": { "comp/button": { "comp": { "button": ... } } }).
 * That produces invalid CSS vars with slashes. Hoist children when detected.
 *
 * Multifile sets like "button": { "button": { "primary": ... } } keep the inner
 * group — it is the component namespace, not a duplicate wrapper.
 */
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
  const declaredOrder = tokens.$metadata?.tokenSetOrder ?? [];

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
    ...(actualSets.includes('global') ? ['global'] : []),
    ...declaredOrder.filter((setName) => setName !== 'global' && actualSets.includes(setName)),
    ...undeclaredSets,
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
