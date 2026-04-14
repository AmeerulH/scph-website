# Code quality

Practices for **maintainable** changes and **safe** delivery. Deep performance targets and Unlighthouse workflow live in [performance.md](./performance.md).

## Change discipline

- **Purposeful edits** — Every line should serve the task; no unrelated cleanup in the same PR.
- **Follow existing patterns** — Naming, imports, component structure, and Tailwind usage should match nearby code.
- **Extend before duplicating** — Prefer `src/components/ui/`, section renderers, and existing merge helpers over parallel abstractions.

## Types and comments

- TypeScript: strict, especially where GROQ/Sanity returns optional data.
- Comments: short, only where behaviour is non-obvious; do not narrate the code line-by-line.

## Verification

Use scripts from root `package.json`:

- **`npm run lint`** — ESLint (`eslint-config-next`).
- **`npm run build`** — Production build; run after substantive UI or dependency changes.

There is no separate unit-test suite mandated in this repo today; rely on lint, build, and manual checks for affected routes.

## Performance and audits

- **Full-site lab audits:** see [performance.md](./performance.md) for Unlighthouse, the **≥ 80 Lighthouse Performance** bar per scanned URL, and when to re-scan.
- **Practices** (server-first rendering, images, fonts, scripts): summarized in [AGENTS.md](../AGENTS.md) §7; keep that section aligned with `performance.md` when the bar changes.

## See also

- [coding-guidelines.md](./coding-guidelines.md) — React/Next/TS conventions.
- [AGENTS.md](../AGENTS.md) §6 — Repo-level quality bullets.
