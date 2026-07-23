import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';
import { buildAll } from '../scripts/build-all.mjs';
import {
  getGoldenBlockOrder,
  normalizeCssValue,
  parseGoldenCss,
} from '../scripts/parse-golden-css.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, '../dist/theme.css');

const SKIP_VARS = new Set([
  '--sa-font-display-weight',
  '--sa-font-label-weight',
  '--sa-font-body-weight',
  '--sa-button-font-weight',
]);

describe('golden', () => {
  it('theme.css matches golden fixture blocks', async () => {
    await buildAll();
    const golden = parseGoldenCss();
    const generated = parseGoldenCss(readFileSync(OUT_PATH, 'utf8'));
    const order = getGoldenBlockOrder();

    for (const selector of order) {
      const expected = golden.get(selector);
      const actual = generated.get(selector);
      assert.ok(actual, `missing generated block for ${selector}`);

      for (const [cssVar, expectedValue] of expected.entries()) {
        if (selector === ':root' && SKIP_VARS.has(cssVar)) continue;
        assert.ok(actual.has(cssVar), `${selector} missing ${cssVar}`);
        assert.equal(
          normalizeCssValue(actual.get(cssVar)),
          normalizeCssValue(expectedValue),
          `${selector} ${cssVar}`,
        );
      }
    }
  });
});
