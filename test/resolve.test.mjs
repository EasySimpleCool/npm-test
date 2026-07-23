import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { loadTokenSets } from '../scripts/load-tokens.mjs';
import { compileTokenValue } from '../scripts/compile-value.mjs';
import {
  getDefaultRootTheme,
  getThemeByGroupAndName,
  mergeThemeSets,
  resolveThemeCssVars,
} from '../scripts/resolve-theme.mjs';

describe('resolve', () => {
  const tokens = loadTokenSets();

  it('resolves default bundle from Core + Button source', () => {
    const theme = getDefaultRootTheme(tokens);
    const merged = mergeThemeSets(tokens, theme);
    assert.ok(merged.sa);
    assert.equal(theme.selectedTokenSets['0. Core/Default'], 'enabled');
  });

  it('applies pink accent override', () => {
    const theme = getThemeByGroupAndName(tokens, 'accent', 'pink');
    const vars = resolveThemeCssVars(tokens, theme);
    assert.ok(vars.get('--sa-accent'));
  });

  it('Aware brand resolves magenta accent', () => {
    const theme = getThemeByGroupAndName(tokens, 'brand', 'Aware');
    const vars = resolveThemeCssVars(tokens, theme);
    const accent = vars.get('--sa-accent');
    const context = { brand: 'aware', accent: 'aware', canvas: 'aware', selector: '[data-brand="aware"]' };
    assert.equal(compileTokenValue(accent, context), '#db0081');
  });
});
