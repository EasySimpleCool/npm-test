# @npm-test/design-system

A minimal design system package (Button, Input, tokens) set up to build,
publish, and use inside Figma Make via a Make kit.

## 1. Install dependencies

```bash
npm install
```

## 2. Build the package

```bash
npm run build
```

This outputs `dist/index.js`, `dist/index.mjs`, and `dist/index.d.ts` —
the CJS build, ESM build, and type declarations respectively.

## 3. Try it locally before publishing

From this folder:

```bash
npm pack
```

This creates a `.tgz` file you can install into a throwaway test app with
`npm install /path/to/yourscope-design-system-0.1.0.tgz` — a good sanity
check before it ever touches npm or Figma Make.

## 4. Publish

**Public package** (works on any Figma Make plan):

```bash
npm login
npm publish --access public
```

**Private package** (requires a paid Figma plan + org admin to set up a
scope in Figma's private npm registry first):

1. In Figma: Admin → Resources → npm registry → set up your org's scope
   and get the `.npmrc` snippet with an access token.
2. Drop that `.npmrc` into this project.
3. `npm publish`

## 5. Wire it into a Make kit

1. Open Figma Make, create or open a file.
2. Go through **Get started with Make kits** and add this package by name
   (`@npm-test/design-system`).
3. Attach the `guidelines/guidelines.md` file from this repo — Figma Make
   reads it to learn your conventions (when to use which variant, which
   tokens to reference, etc.).
4. Prompt Figma Make to build something ("build a login form") and confirm
   it reaches for `Button` and `Input` from your package instead of
   generating its own from scratch.

## 6. Before you demo, double check

- [ ] `react` / `react-dom` are in `peerDependencies`, not `dependencies`
      (Figma Make provides its own React — bundling yours causes conflicts)
- [ ] No workspace-only or monorepo-internal imports left in `src/`
- [ ] `npm run build` completes with no errors
- [ ] `guidelines/guidelines.md` is attached to the Make kit, not just
      sitting in this repo
- [ ] You've tested one actual prompt in Figma Make and it picked up your
      components, not generic ones

## Folder structure

```
my-design-system/
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── button.css
│   │   ├── Input.tsx
│   │   └── input.css
│   ├── tokens/
│   │   └── colors.ts
│   └── index.ts
├── guidelines/
│   └── guidelines.md
├── package.json
├── tsconfig.json
└── vite.config.ts
```
