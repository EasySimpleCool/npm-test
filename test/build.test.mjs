import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, before } from 'node:test';
import { buildAll } from '../scripts/build-all.mjs';
import { getThemes, loadTokenSets } from '../scripts/load-tokens.mjs';
import { normalizeCssValue } from '../scripts/parse-golden-css.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const VARIABLES_PATH = join(__dirname, '../dist/variables.css');
const THEME_PATH = join(__dirname, '../dist/theme.css');
const GUIDELINES_PATH = join(__dirname, '../dist/guidelines.md');

describe('build', () => {
  before(async () => {
    await buildAll();
  });

  it('writes variables.css and theme.css', () => {
    assert.match(readFileSync(VARIABLES_PATH, 'utf8'), /--ds-color-accent-green:/);
    assert.match(readFileSync(THEME_PATH, 'utf8'), /:root\{/);
  });

  it('writes guidelines.md with every theme axis group', () => {
    const guidelines = readFileSync(GUIDELINES_PATH, 'utf8');
    const themes = getThemes(loadTokenSets());
    const groups = [...new Set(themes.map((theme) => theme.group))];

    for (const group of groups) {
      assert.match(guidelines, new RegExp(`data-${group}`));
    }
    assert.match(guidelines, /Second Act Design System Guidelines/);
    assert.match(guidelines, /variables\.css/);
    assert.match(guidelines, /theme\.css/);
    assert.match(guidelines, /No components are exported from the package/);
    assert.doesNotMatch(guidelines, /import \{ Button, Input \}/);
  });

  it('writes extensive guidelines with corrected brand axis and token catalog', () => {
    const guidelines = readFileSync(GUIDELINES_PATH, 'utf8');

    assert.match(guidelines, /data-brand="aware"/);
    assert.match(guidelines, /Do NOT set `data-brand="Second Act"`/);
    assert.match(guidelines, /Troubleshooting — "everything unstyled"/);
    assert.match(guidelines, /Token catalog \(auto-generated\)/);
    assert.match(guidelines, /--ds-color-accent-green/);
    assert.match(guidelines, /--sa-accent/);
    assert.match(guidelines, /Second Act UI patterns/);
    assert.match(guidelines, /Aware Super UI patterns/);
    assert.match(guidelines, /fonts\.googleapis\.com/);
    assert.match(guidelines, /Do NOT set `data-brand="Second Act"` or `data-brand="Aware"`/);
    assert.doesNotMatch(guidelines, /Lotus Design System Guidelines/);
  });

  it('includes green accent in theme :root', () => {
    const css = readFileSync(THEME_PATH, 'utf8');
    assert.match(normalizeCssValue(css), /--sa-accent:var\(--ds-color-accent-green\)/);
  });

  it('compiles shadows and flat elevation', () => {
    const css = readFileSync(THEME_PATH, 'utf8');
    assert.match(css, /--sa-shadow-sm:0 6px 18px rgba/);
    assert.match(css, /\[data-elevation="flat"\][\s\S]*--sa-shadow-sm:none/);
  });

  it('excludes composition from theme output', () => {
    const css = readFileSync(THEME_PATH, 'utf8');
    assert.doesNotMatch(css, /composition/);
  });
});
