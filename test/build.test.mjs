import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';
import { buildAll } from '../scripts/build-all.mjs';
import { normalizeCssValue } from '../scripts/parse-golden-css.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const VARIABLES_PATH = join(__dirname, '../dist/variables.css');
const THEME_PATH = join(__dirname, '../dist/theme.css');

describe('build', () => {
  it('writes variables.css and theme.css', async () => {
    await buildAll();
    assert.match(readFileSync(VARIABLES_PATH, 'utf8'), /--ds-color-accent-green:/);
    assert.match(readFileSync(THEME_PATH, 'utf8'), /:root\{/);
  });

  it('includes green accent in theme :root', async () => {
    await buildAll();
    const css = readFileSync(THEME_PATH, 'utf8');
    assert.match(normalizeCssValue(css), /--sa-accent:var\(--ds-color-accent-green\)/);
  });

  it('compiles shadows and flat elevation', async () => {
    await buildAll();
    const css = readFileSync(THEME_PATH, 'utf8');
    assert.match(css, /--sa-shadow-sm:0 6px 18px rgba/);
    assert.match(css, /\[data-elevation="flat"\][\s\S]*--sa-shadow-sm:none/);
  });

  it('excludes composition from theme output', async () => {
    await buildAll();
    const css = readFileSync(THEME_PATH, 'utf8');
    assert.doesNotMatch(css, /composition/);
  });
});
