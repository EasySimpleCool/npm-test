import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, before } from 'node:test';
import { createRequire } from 'node:module';
import { buildAll } from '../scripts/build-all.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const require = createRequire(import.meta.url);

const VARIABLES_PATH = join(ROOT, 'dist/variables.css');
const THEME_PATH = join(ROOT, 'dist/theme.css');
const GUIDELINES_PATH = join(ROOT, 'dist/guidelines.md');

describe('make import smoke test', () => {
  before(async () => {
    await buildAll();
  });

  it('package exports resolve to CSS files on disk', () => {
    const pkg = require(join(ROOT, 'package.json'));

    assert.equal(pkg.exports['./variables.css'], './dist/variables.css');
    assert.equal(pkg.exports['./theme.css'], './dist/theme.css');
    assert.equal(pkg.exports['./guidelines.md'], './dist/guidelines.md');

    const variables = readFileSync(VARIABLES_PATH, 'utf8');
    const theme = readFileSync(THEME_PATH, 'utf8');

    assert.match(variables, /:root\s*\{/);
    assert.match(variables, /--ds-color-accent-green:/);
    assert.match(theme, /:root\s*\{/);
    assert.match(theme, /\[data-accent="green"\]/);
    assert.match(theme, /\[data-canvas="cool"\]/);
    assert.match(theme, /\[data-elevation="flat"\]/);
  });

  it('guidelines document both stylesheets and font loading for Make', () => {
    const guidelines = readFileSync(GUIDELINES_PATH, 'utf8');

    assert.match(guidelines, /variables\.css/);
    assert.match(guidelines, /theme\.css/);
    assert.match(guidelines, /fonts are \*\*not bundled\*\*/i);
    assert.match(guidelines, /fonts\.googleapis\.com/);
  });
});
