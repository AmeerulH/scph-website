# Documentation (`docs/`)

This folder holds **engineering and design guides** for the SCPH / GTP 2026 Next.js app. It complements root-level docs; it does **not** replace them.

## Root docs (stay at repo root)

| File | Purpose |
|------|---------|
| [AGENTS.md](../AGENTS.md) | Master reference: Sanity, seeds, CMS checklist, performance bar, quick file map. |
| [README.md](../README.md) | Install, dev/build, Studio, env vars, Unlighthouse, webhooks. |
| [CONTENT_REFERENCE.md](../CONTENT_REFERENCE.md) | Legacy SCPH site copy for tone/structure—not a code spec. |
| [Claude.md](../Claude.md) | AI entry point: maps all docs and Cursor skills. |

## Guides in this folder

| File | Read when… |
|------|------------|
| [architecture.md](./architecture.md) | Understanding routes, layouts, Sanity data flow, and where code lives. |
| [coding-guidelines.md](./coding-guidelines.md) | Writing or refactoring React/Next/TS to match repo conventions. |
| [code-quality.md](./code-quality.md) | PR discipline, lint/build, minimal diffs; points to performance for scans. |
| [design-system.md](./design-system.md) | Typography, brand colors, `ui/` primitives, images, motion. |
| [performance.md](./performance.md) | Lighthouse/Unlighthouse workflow, **80+ Performance** bar per scanned URL, triage. |

## Suggested read order

1. **New to the repo:** [README.md](../README.md) → [architecture.md](./architecture.md) → [AGENTS.md](../AGENTS.md) §1–2.
2. **CMS or new sections:** [AGENTS.md](../AGENTS.md) §3–4 first, then [architecture.md](./architecture.md).
3. **UI or styling:** [design-system.md](./design-system.md) → [performance.md](./performance.md) if adding images, fonts, or client JS.
4. **Perf regression:** [performance.md](./performance.md) → [AGENTS.md](../AGENTS.md) §7.

## Cursor project skills

Concise `@`-skills live under `.cursor/skills/*/SKILL.md` and link back into these files. See [Claude.md](../Claude.md).

## Architecture Decision Records (optional)

For significant, reversible **technical decisions** (stack, data flow, infra), add a short ADR under [adr/](./adr/) when the team wants a paper trail—see [adr/README.md](./adr/README.md).
