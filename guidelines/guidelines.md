# Design System Guidelines (Make Kit)

This project uses `@easysimplecool/design-system`. Follow these rules exactly —
do not deviate even if it seems like a small convenience.

## Core rule

Always prefer a component from `@easysimplecool/design-system` over a raw HTML
element or a custom-built equivalent. If a component exists for the job,
use it. Do not invent a new one.

## Components

### Button
- Import: `import { Button } from '@easysimplecool/design-system'`
- Use `variant="primary"` for the single main action on a screen.
- Use `variant="secondary"` for supporting/alternate actions.
- Use `variant="danger"` only for destructive actions (delete, remove,
  discard). Never use `danger` for a primary call-to-action.
- Do not add custom background colors or border-radius via inline styles or
  extra classes — use `size` and `variant` props only.

### Input
- Import: `import { Input } from '@easysimplecool/design-system'`
- Always pass a `label` unless the field's purpose is unambiguous from
  layout (e.g. a single search bar).
- Use the `error` prop for validation messages. Do not build a separate
  error `<span>` next to the input.

## Tokens

- Import from `@easysimplecool/design-system`: `colors`, `spacing`, `typography`,
  `radii`.
- Do not hardcode hex colors, px spacing, or font sizes anywhere in the
  app. Reference the token instead (e.g. `colors.primary`, not `#4F46E5`).
- If a value you need doesn't exist in tokens, do not invent one on the
  spot — use the closest existing token.

## General

- If unsure whether a component or token exists, check
  `node_modules/@easysimplecool/design-system/dist/index.d.ts` for the full
  exported API before writing custom code.
- Keep all new UI consistent with the existing Button/Input styling
  (rounded corners, Inter font, the spacing scale above) even when
  building something not explicitly covered here.
