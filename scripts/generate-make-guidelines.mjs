import { readFileSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { getThemes, loadTokenSets } from './load-tokens.mjs';
import { DEFAULT_THEMES } from './resolve-theme.mjs';
import { getGoldenBlockOrder, parseGoldenCss } from './parse-golden-css.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_PATH = join(ROOT, 'dist/guidelines.md');
const FRAGMENTS_DIR = join(ROOT, 'guidelines/fragments');
const VARIABLES_PATH = join(ROOT, 'dist/variables.css');
const THEME_PATH = join(ROOT, 'dist/theme.css');

const FRAGMENT_ORDER = [
  '00-bootstrap.md',
  '01-troubleshooting.md',
  '02-layout-spacing.md',
  '03-patterns-second-act.md',
  '04-patterns-aware.md',
  '05-recipes.md',
];

function interpolate(text, vars) {
  return text.replace(/\$\{(\w+)\}/g, (_, key) => vars[key] ?? `\${${key}}`);
}

function loadFragments(vars) {
  return FRAGMENT_ORDER.map((filename) => {
    const path = join(FRAGMENTS_DIR, filename);
    return interpolate(readFileSync(path, 'utf8'), vars);
  }).join('\n\n');
}

function parseCssVariables(cssText) {
  const vars = new Map();
  const pattern = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let match;
  while ((match = pattern.exec(cssText)) !== null) {
    vars.set(match[1], match[2].trim());
  }
  return vars;
}

function groupTokensByPrefix(vars, prefix) {
  return [...vars.entries()]
    .filter(([name]) => name.startsWith(prefix))
    .sort(([a], [b]) => a.localeCompare(b));
}

function formatTokenTable(entries, source) {
  if (entries.length === 0) return `_No ${source} tokens found._\n`;
  const lines = ['| Variable | Value |', '| --- | --- |'];
  for (const [name, value] of entries) {
    const display = value.length > 60 ? `${value.slice(0, 57)}…` : value;
    lines.push(`| \`${name}\` | \`${display}\` |`);
  }
  return `${lines.join('\n')}\n`;
}

function getThemeOverrideVars(themeCss) {
  const golden = parseGoldenCss(themeCss);
  const overridden = new Set();
  for (const [selector, declarations] of golden.entries()) {
    if (selector === ':root') continue;
    for (const cssVar of declarations.keys()) {
      overridden.add(cssVar);
    }
  }
  return overridden;
}

function formatThemeBlocksTable(themeCss) {
  const order = getGoldenBlockOrder(themeCss);
  const lines = ['| CSS selector | Axis |', '| --- | --- |'];
  for (const selector of order) {
    if (selector === ':root') {
      lines.push('| `:root` | Second Act default (all axes at default values) |');
      continue;
    }
    const attr = selector.match(/\[data-([\w-]+)="([^"]+)"\]/);
    if (attr) {
      lines.push(`| \`${selector}\` | \`data-${attr[1]}="${attr[2]}"\` |`);
    } else {
      lines.push(`| \`${selector}\` | — |`);
    }
  }
  return lines.join('\n');
}

function formatSelectorAccurateAxisTable(groups) {
  const lines = [
    '| Axis | Second Act | Aware Super | Exact HTML attribute |',
    '| --- | --- | --- | --- |',
    '| brand | Default — omit `data-brand` (`:root`) | Set `data-brand="aware"` (**lowercase**) | `data-brand="aware"` only |',
  ];

  const axisMeta = {
    accent: {
      secondAct: 'Character colours per film',
      aware: 'Magenta from brand block; axis still composes',
      attr: (names) => names.map((n) => `\`${n}\``).join(', '),
    },
    type: {
      secondAct: 'cinematic (default)',
      aware: 'Poppins forced by brand block',
      attr: (names) => names.map((n) => `\`${n}\``).join(', '),
    },
    canvas: {
      secondAct: 'warm (default), cool, dark',
      aware: 'Brand surfaces override; axis still composes',
      attr: (names) => names.map((n) => `\`${n}\``).join(', '),
    },
    radius: {
      secondAct: 'round (default), soft, square',
      aware: 'Pill radii via brand block',
      attr: (names) => names.map((n) => `\`${n}\``).join(', '),
    },
    elevation: {
      secondAct: 'soft (default), flat, dramatic',
      aware: 'Flat shadows via brand block',
      attr: (names) => names.map((n) => `\`${n}\``).join(', '),
    },
  };

  for (const [group, names] of groups) {
    if (group === 'brand') continue;
    const meta = axisMeta[group] ?? { secondAct: '—', aware: '—', attr: (n) => n.join(', ') };
    lines.push(
      `| \`data-${group}\` | ${meta.secondAct} | ${meta.aware} | ${meta.attr(names)} |`,
    );
  }

  return lines.join('\n');
}

function formatDefaultAttributes(defaults) {
  const entries = Object.entries(defaults).filter(([group]) => group !== 'brand');
  return entries.map(([group, name]) => `- \`data-${group}="${name}"\``).join('\n');
}

function formatDefaultHtmlAttributes(defaults) {
  return Object.entries(defaults)
    .filter(([group]) => group !== 'brand')
    .map(([group, name]) => `  data-${group}="${name}"`)
    .join('\n');
}

function formatAxisExamples() {
  return `**Second Act film page (The Stunt Guy — teal accent):**

\`\`\`html
<html data-accent="teal" data-type="cinematic" data-canvas="warm" data-radius="round" data-elevation="soft">
\`\`\`

**Second Act with pink accent character:**

\`\`\`html
<html data-accent="pink" data-type="cinematic" data-canvas="warm">
\`\`\`

**Aware Super marketing page:**

\`\`\`html
<html data-brand="aware" data-type="product" data-canvas="warm" data-elevation="soft">
\`\`\`

**Second Act dark canvas:**

\`\`\`html
<html data-accent="gold" data-type="cinematic" data-canvas="dark" data-elevation="dramatic">
\`\`\``;
}

function formatTokenAuthority(packageName) {
  return `## Token authority — READ FIRST

This project and \`${packageName}\` share ONE design system. The package is the single source of truth for \`--ds-*\` and \`--sa-*\` variables.

- NEVER redefine, override, or "bridge" any \`--ds-*\` or \`--sa-*\` variable in project CSS (\`globals.css\`, local \`theme.css\`, or anywhere else). The package stylesheets are the only place these variables are defined.
- Project-level aliases (\`--foreground\`, \`--background\`, \`--border\`, \`--font-display\`, \`--space-*\`, etc.) may point AT \`--ds-*\` / \`--sa-*\` tokens or fixed values. Nothing may point INTO package tokens. One direction only: alias ← DS token.
- Never create a circular reference (e.g. \`--foreground: var(--ds-color-text-body)\` together with \`--ds-color-text-body: var(--foreground)\`). CSS invalidates every variable in a cycle and components lose their styling entirely.
- Do not "align" or "restyle" components with token overrides — wire them directly to the package tokens from the start.
- If a token you need does not exist in the package, do NOT invent or override one. Use the closest existing token and add a code comment: \`/* TODO: missing DS token */\`.`;
}

function formatTypographySection() {
  return `## Typography

Map text by content role using font-role tokens from \`theme.css\`. Do not hardcode font families.

| Role | CSS | Use for |
| --- | --- | --- |
| Display | \`font-family: var(--sa-font-display)\`, \`font-weight: var(--sa-font-display-weight)\` | Hero titles, massive headlines (uppercase for Second Act) |
| Body | \`font-family: var(--sa-font-body)\`, \`font-weight: var(--sa-font-body-weight)\`, \`color: var(--ds-color-text-body)\` | Paragraphs, default copy |
| Label | \`font-family: var(--sa-font-label)\`, \`font-weight: var(--sa-font-label-weight)\`, \`text-transform: uppercase\`, \`letter-spacing: 0.08em–0.12em\` | Eyebrows, nav, metadata |
| Button md | \`font: var(--ds-button-primary-label)\`, \`font-weight: var(--sa-button-font-weight)\` | Primary button labels |
| Button sm | \`font: var(--ds-button-primary-label-sm)\` | Small buttons, chips |
| Mono outline | \`font: var(--ds-button-outline-mono-sm-label)\` | Outline / mono buttons |

Font roles change with \`data-type\`:

| \`data-type\` | Display | Label | Body |
| --- | --- | --- | --- |
| \`cinematic\` | Anton | Space Mono | Space Grotesk |
| \`editorial\` | Playfair Display | IBM Plex Mono | Inter |
| \`product\` | Space Grotesk | Space Mono | Inter |
| \`mono\` | Space Mono | Space Mono | Space Grotesk |

When \`data-brand="aware"\`, all roles become Poppins regardless of type axis.

**Fonts are not bundled.** Load the families for your active axes — see the bootstrap section.`;
}

function formatTokenCatalog(variablesCss, themeCss) {
  const dsVars = parseCssVariables(variablesCss);
  const saRootVars = parseCssVariables(themeCss.match(/:root\s*\{([^}]*)\}/)?.[1] ?? '');
  const overridden = getThemeOverrideVars(themeCss);

  const dsGroups = {
    'Colour — accent': groupTokensByPrefix(dsVars, '--ds-color-accent'),
    'Colour — brand': groupTokensByPrefix(dsVars, '--ds-color-brand'),
    'Colour — surface & ink': groupTokensByPrefix(dsVars, '--ds-color-surface').concat(
      groupTokensByPrefix(dsVars, '--ds-color-ink'),
      groupTokensByPrefix(dsVars, '--ds-color-text'),
    ),
    'Colour — border': groupTokensByPrefix(dsVars, '--ds-color-border'),
    'Button': groupTokensByPrefix(dsVars, '--ds-button'),
    'Border radius': groupTokensByPrefix(dsVars, '--ds-borderRadius'),
    'Font families': groupTokensByPrefix(dsVars, '--ds-font'),
  };

  const saGroups = {
    'Semantic — accent & surfaces': groupTokensByPrefix(saRootVars, '--sa-accent').concat(
      groupTokensByPrefix(saRootVars, '--sa-surface'),
    ),
    'Semantic — typography': groupTokensByPrefix(saRootVars, '--sa-font'),
    'Semantic — elevation & radius': groupTokensByPrefix(saRootVars, '--sa-shadow').concat(
      groupTokensByPrefix(saRootVars, '--sa-radius'),
      groupTokensByPrefix(saRootVars, '--sa-hover'),
    ),
  };

  const sections = ['## Token catalog (auto-generated)', ''];
  sections.push(
    'Parsed from built CSS on every `npm run build:tokens`. Use these exact variable names.',
    '',
    'Variables marked **themed** are overridden by `theme.css` axis blocks (`:root`, `[data-accent]`, `[data-canvas]`, etc.).',
    '',
  );

  sections.push('### `--ds-*` primitives (`variables.css`)', '');
  for (const [title, entries] of Object.entries(dsGroups)) {
    if (entries.length === 0) continue;
    sections.push(`#### ${title}`, '');
    sections.push(formatTokenTable(entries, 'variables.css'));
  }

  sections.push('### `--sa-*` semantics (`theme.css` `:root`)', '');
  for (const [title, entries] of Object.entries(saGroups)) {
    if (entries.length === 0) continue;
    sections.push(`#### ${title}`, '');
    const annotated = entries.map(([name, value]) => {
      const tag = overridden.has(name) ? ' **themed**' : '';
      return [name, value + tag];
    });
    sections.push(formatTokenTable(annotated, 'theme.css'));
  }

  sections.push('### Theme axis selectors (`theme.css`)', '');
  sections.push(formatThemeBlocksTable(themeCss));
  sections.push('');
  sections.push(
    'Legacy `data-theme="<accent>"` selectors still work for accent-only switching (paired with each `[data-accent]` block).',
  );
  sections.push('');
  sections.push(
    'Accent colour for CTAs and links follows `--sa-accent` / `--ds-color-text-accent` (driven by `data-accent`).',
  );

  return sections.join('\n');
}

export function generateMakeGuidelines({
  packageName,
  packageVersion,
  themes = getThemes(loadTokenSets()),
  defaults = DEFAULT_THEMES,
  variablesCss = readFileSync(VARIABLES_PATH, 'utf8'),
  themeCss = readFileSync(THEME_PATH, 'utf8'),
} = {}) {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  const name = packageName ?? pkg.name;
  const version = packageVersion ?? pkg.version;
  const groups = groupThemesByAxis(themes);
  const vars = { packageName: name, packageVersion: version };

  const header = `# Second Act Design System Guidelines

AUTO-GENERATED from \`src/tokens/\` — do not hand-edit \`dist/guidelines.md\`.
Regenerate with: \`npm run build:tokens\`

When generating UI, consume the design system from the \`${name}\` npm package (\`${version}\`).
This system supports **Second Act** (default) and **Aware Super** (\`data-brand="aware"\`) brands.
Use only the tokens listed below. Never hardcode colours, typography, or spacing — always reference a token.

This package ships **CSS only** (no React components). Build Button, Input, and all other UI locally, styled with \`--ds-*\` and \`--sa-*\` variables.

---

${formatTokenAuthority(name)}

---

${loadFragments(vars)}

---

## Theme axes

Set axis attributes on \`<html>\`. Each axis switches one token set — axes compose independently; not every permutation is pre-built.

${formatSelectorAccurateAxisTable(groups)}

### Default axis values (Second Act — \`:root\`)

Omit \`data-brand\` for Second Act. Defaults:

${formatDefaultAttributes(defaults)}

\`\`\`html
<html
${formatDefaultHtmlAttributes(defaults)}
>
\`\`\`

### Worked examples

${formatAxisExamples()}

---

${formatTypographySection()}

---

${formatTokenCatalog(variablesCss, themeCss)}

---
`;

  writeFileSync(OUT_PATH, header);
  return { outPath: OUT_PATH, axisGroups: [...groups.keys()] };
}

function groupThemesByAxis(themes) {
  const groups = new Map();
  for (const theme of themes) {
    const group = theme.group;
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(theme.name);
  }
  return groups;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = generateMakeGuidelines();
  console.log(`Built guidelines.md (${result.axisGroups.length} theme axes)`);
}
