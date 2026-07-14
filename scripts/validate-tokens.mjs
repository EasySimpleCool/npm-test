import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOKENS_PATH = join(__dirname, '../src/tokens/tokens.json');
const RESERVED_KEYS = new Set(['$themes', '$metadata']);

const tokens = JSON.parse(readFileSync(TOKENS_PATH, 'utf8'));
const actualSets = Object.keys(tokens).filter((key) => !RESERVED_KEYS.has(key));
const declaredOrder = tokens.$metadata?.tokenSetOrder ?? [];

const ghostSets = declaredOrder.filter((setName) => !actualSets.includes(setName));
const undeclaredSets = actualSets.filter((setName) => !declaredOrder.includes(setName));
const duplicateSetKeys = actualSets.filter(
  (setName) =>
    tokens[setName] &&
    typeof tokens[setName] === 'object' &&
    Object.prototype.hasOwnProperty.call(tokens[setName], setName),
);

let failed = false;

if (ghostSets.length > 0) {
  failed = true;
  console.error(
    `FAIL: $metadata.tokenSetOrder references sets not in tokens.json: ${ghostSets.join(', ')}`,
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

console.log('OK: tokens.json metadata matches token sets.');
console.log(`Sets: ${actualSets.join(', ')}`);
console.log(`Order: ${declaredOrder.join(' → ')}`);
