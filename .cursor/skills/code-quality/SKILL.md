---
name: scph-code-quality
description: PR discipline, lint/build, and reuse for scph-website. Use before merge or when keeping changesets small and safe.
---

# Code quality (project skill)

Read the full guide: [docs/code-quality.md](../../../docs/code-quality.md). For Unlighthouse and the Performance score bar, use [docs/performance.md](../../../docs/performance.md) and the **scph-performance** skill.

## Quick reference

- **Lint:** `npm run lint` (ESLint).
- **Build:** `npm run build` after substantive UI or dependency changes.
- **Reuse** `src/components/ui/*`, section renderers, and merge helpers before new abstractions.
- **Avoid drive-by refactors** unrelated to the task.
