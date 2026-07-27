# Contributor docs

Docs for people extending the token pipeline in this repo. Not shipped in the npm package (see `guidelines/` for consumer-facing docs that are).

| File | For |
|---|---|
| `project.md` | What this repo is, how the Figma → Tokens Studio → Style Dictionary → CSS pipeline flows, what each output file is |
| `scripts.md` | What each file in `scripts/` does, when to run it, what depends on what |
| `contributing.md` | Local dev workflow, tests, validation, publishing (mostly done by CI) |

**Read `../CLAUDE.md` first.** It's the agent entry point and links to everything.

**Theory of the theming model** lives in `../guidelines/parametric-theming.md` — it's consumer-facing (shipped in npm) because Figma Make agents and consumer apps also need it. Contributors should read it before touching the build.
