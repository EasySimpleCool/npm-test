import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { loadTokenSets, findDuplicateSetKeys, normalizeTokenSets, RESERVED_KEYS } from '../scripts/load-tokens.mjs';

function walkValues(node, fn) {
  if (node === null || node === undefined) return;
  if (typeof node !== 'object' || Array.isArray(node)) {
    fn(node);
    return;
  }
  if (Object.prototype.hasOwnProperty.call(node, 'value') && Object.prototype.hasOwnProperty.call(node, 'type')) {
    fn(node.value);
    return;
  }
  for (const value of Object.values(node)) {
    walkValues(value, fn);
  }
}

describe('schema', () => {
  it('loads nested token JSON', () => {
    const tokens = loadTokenSets();
    assert.ok(tokens.$metadata);
    assert.ok(tokens.$themes);
    assert.ok(tokens['0. Core/Default']);
  });

  it('has no color-mix in token values', () => {
    const tokens = loadTokenSets();
    const actualSets = Object.keys(tokens).filter((key) => !RESERVED_KEYS.has(key));
    for (const setName of actualSets) {
      walkValues(tokens[setName], (value) => {
        if (typeof value === 'string') {
          assert.doesNotMatch(value, /color-mix\(/, `color-mix in ${setName}`);
        }
      });
    }
  });

  it('has no duplicate set-name wrappers', () => {
    const tokens = normalizeTokenSets(loadTokenSets());
    assert.deepEqual(findDuplicateSetKeys(tokens), []);
  });
});
