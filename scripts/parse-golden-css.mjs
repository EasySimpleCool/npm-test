import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const GOLDEN_PATH = join(__dirname, '../test/fixtures/theme-golden.css');

const THEME_BLOCK_PATTERN =
  /(?:^|\n)((?:\:root|\[data-[a-z-]+="[^"]+"\](?:,\[data-[a-z-]+="[^"]+"\])*)\{)([^}]*)\}/g;

function parseDeclarations(body) {
  const declarations = new Map();
  const declPattern = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let declMatch;
  while ((declMatch = declPattern.exec(body)) !== null) {
    declarations.set(declMatch[1], declMatch[2].trim());
  }
  return declarations;
}

export function parseGoldenCss(cssText = readFileSync(GOLDEN_PATH, 'utf8')) {
  const blocks = new Map();
  THEME_BLOCK_PATTERN.lastIndex = 0;
  let match;

  while ((match = THEME_BLOCK_PATTERN.exec(cssText)) !== null) {
    const selector = match[1].replace(/\{$/, '').trim().replace(/\s+/g, '');
    const declarations = parseDeclarations(match[2]);
    if (declarations.size > 0) {
      blocks.set(selector, declarations);
    }
  }

  return blocks;
}

export function getGoldenBlockOrder(cssText = readFileSync(GOLDEN_PATH, 'utf8')) {
  const order = [];
  THEME_BLOCK_PATTERN.lastIndex = 0;
  let match;

  while ((match = THEME_BLOCK_PATTERN.exec(cssText)) !== null) {
    const selector = match[1].replace(/\{$/, '').trim().replace(/\s+/g, '');
    if (!order.includes(selector)) order.push(selector);
  }

  return order;
}

export function normalizeCssValue(value) {
  return String(value)
    .replace(/\s+/g, '')
    .replace(/,0\./g, ',.')
    .toLowerCase();
}

export function selectorToThemeContext(selector) {
  if (selector === ':root') {
    return { group: 'brand', name: 'Second Act', selector: ':root', accent: 'green', canvas: 'warm' };
  }

  const brand = selector.match(/\[data-brand="([^"]+)"\]/);
  if (brand) {
    return {
      group: 'brand',
      name: brand[1].charAt(0).toUpperCase() + brand[1].slice(1),
      selector,
      brand: brand[1],
      accent: 'aware',
      canvas: 'aware',
    };
  }

  const accent = selector.match(/\[data-accent="([^"]+)"\]/);
  if (accent) return { group: 'accent', name: accent[1], selector, accent: accent[1] };

  const type = selector.match(/\[data-type="([^"]+)"\]/);
  if (type) return { group: 'type', name: type[1], selector };

  const canvas = selector.match(/\[data-canvas="([^"]+)"\]/);
  if (canvas) return { group: 'canvas', name: canvas[1], selector, canvas: canvas[1] };

  const elevation = selector.match(/\[data-elevation="([^"]+)"\]/);
  if (elevation) return { group: 'elevation', name: elevation[1], selector };

  const radius = selector.match(/\[data-radius="([^"]+)"\]/);
  if (radius) return { group: 'radius', name: radius[1], selector };

  return { selector };
}
