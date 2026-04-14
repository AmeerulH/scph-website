# Coding guidelines

Conventions for **Next.js App Router**, **React**, and **TypeScript** in this repo. Authoritative CMS and seed rules remain in [AGENTS.md](../AGENTS.md) §5–6; this page focuses on **how we write code**.

## React and Next.js

- **Server Components by default.** Add `"use client"` only when you need hooks, browser APIs, or a client-only dependency.
- **Colocate** feature UI under `src/components/` using existing domains: `gtp/`, `scph/`, `sections/`, `ui/`.
- **Data fetching** for pages: prefer the established path (server-side fetch → merge → pass props). Avoid ad hoc client fetches in leaf components when a server data path already exists.
- **Images:** use `next/image` with appropriate `sizes` and formats; see [design-system.md](./design-system.md) and [AGENTS.md](../AGENTS.md) §7.

## TypeScript

- Keep types **honest at Sanity/GROQ boundaries**—fields may be `null` or missing; avoid unsafe non-null assertions without a guard.
- Match **existing import style** and path aliases (`@/…`) used in neighboring files.

## Style and structure

- **Minimal diffs:** change only what the task requires; avoid drive-by refactors and unrelated formatting.
- **Match the codebase:** naming, file placement, and component patterns should look like the surrounding code.
- **Reuse** before inventing: merge helpers, `render-section-block`, and `src/components/ui/*`.

## Sanity-aware changes

Before changing copy or structure that might be CMS-driven:

- Search for `getGtp*`, `getScph*`, `merge*`, and `_type` in queries.
- If unsure, read **§2** in [AGENTS.md](../AGENTS.md).

## Pre-PR checklist

- [ ] Scope is limited to the requested behaviour.
- [ ] If touching CMS-backed UI, defaults vs Studio merge behaviour is understood.
- [ ] New or heavy UI: consider [performance.md](./performance.md) and a local `npm run build`.

## See also

- [architecture.md](./architecture.md) — Where routes and Sanity flow live.
- [code-quality.md](./code-quality.md) — Lint, build, and review habits.
