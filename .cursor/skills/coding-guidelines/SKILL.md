---
name: scph-coding-guidelines
description: React/Next/TypeScript conventions for scph-website—Server Components, colocation, Sanity types. Use when implementing or refactoring components and pages.
---

# Coding guidelines (project skill)

Read the full guide: [docs/coding-guidelines.md](../../../docs/coding-guidelines.md).

## Quick reference

- **Server Components by default;** add `"use client"` only for hooks, browser APIs, or client-only libraries.
- **Colocate** under `src/components/` (`gtp/`, `scph/`, `sections/`, `ui/`).
- **Types:** be explicit at Sanity/GROQ boundaries (null/undefined).
- **Minimal diffs** and match neighbouring files for imports and patterns.
- **CMS:** search `getGtp*`, `getScph*`, `merge*`, `_type`; read [AGENTS.md](../../../AGENTS.md) §2 when changing published content paths.
