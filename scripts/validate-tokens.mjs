import {
  findDuplicateSetKeys,
  loadTokenSets,
  normalizeTokenSets,
  RESERVED_KEYS,
} from './load-tokens.mjs';

const tokens = normalizeTokenSets(loadTokenSets());
const actualSets = Object.keys(tokens).filter((key) => !RESERVED_KEYS.has(key));
const declaredOrder = tokens.$metadata?.tokenSetOrder ?? [];

const ghostSets = declaredOrder.filter((setName) => !actualSets.includes(setName));
const undeclaredSets = actualSets.filter((setName) => !declaredOrder.includes(setName));
const duplicateSetKeys = findDuplicateSetKeys(tokens);

let failed = false;

if (ghostSets.length > 0) {
  failed = true;
  console.error(
    `FAIL: $metadata.tokenSetOrder references sets not in src/tokens/: ${ghostSets.join(', ')}`,
  );
  console.error('Fix in Tokens Studio: delete the orphan token sets, then push again.');
}

if (undeclaredSets.length > 0) {
  failed = true;
  console.error(
    `FAIL: Token sets missing from $metadata.tokenSetOrder: ${undeclaredSets.join(', ')}`,
  );
  console.error('Fix in Tokens Studio: drag sets to set order, then push again.');
}

if (duplicateSetKeys.length > 0) {
  failed = true;
  console.error(
    `FAIL: Duplicate set-name group inside token set: ${duplicateSetKeys.join(', ')}`,
  );
  console.error(
    'Fix in Tokens Studio: remove the inner group that repeats the set name (e.g. comp/button inside comp/button).',
  );
}

if (failed) {
  process.exit(1);
}

console.log('OK: src/tokens/ metadata matches token sets.');
console.log(`Sets: ${actualSets.join(', ')}`);
console.log(`Order: ${declaredOrder.join(' → ')}`);
