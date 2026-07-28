import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, before } from 'node:test';
import { buildAll } from '../scripts/build-all.mjs';
import {
  getGoldenBlockOrder,
  normalizeCssValue,
  parseGoldenCss,
} from '../scripts/parse-golden-css.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const THEME_PATH = join(__dirname, '../dist/theme.css');

describe('build', () => {
  before(async () => {
    await buildAll();
  });

  it('theme.css matches every declaration in the golden fixture', () => {
    const golden = parseGoldenCss();
    const generated = parseGoldenCss(readFileSync(THEME_PATH, 'utf8'));

    for (const selector of getGoldenBlockOrder()) {
      const expected = golden.get(selector);
      const actual = generated.get(selector);
      assert.ok(actual, `missing generated block for ${selector}`);

      for (const [cssVar, expectedValue] of expected.entries()) {
        assert.ok(actual.has(cssVar), `${selector} missing ${cssVar}`);
        assert.equal(
          normalizeCssValue(actual.get(cssVar)),
          normalizeCssValue(expectedValue),
          `${selector} ${cssVar}`,
        );
      }
    }
  });

  it('excludes composition tokens from theme output', () => {
    assert.doesNotMatch(readFileSync(THEME_PATH, 'utf8'), /composition/);
  });
});
