---
name: scph-design-system
description: Typography, SCPH/GTP colour tokens, shadcn ui primitives, and next/image usage for scph-website. Use when styling components or adding media.
---

# Design system (project skill)

Read the full guide: [docs/design-system.md](../../../docs/design-system.md).

## Quick reference

- **Fonts:** `src/lib/fonts.ts` (Poppins / Inter) → `--font-heading` / `--font-sans` in `src/app/globals.css`.
- **Brand colours:** `--color-scph-*` vs `--color-gtp-*` in `@theme inline` in `globals.css`.
- **UI primitives:** `src/components/ui/` (button, card, sheet, carousel, …)—extend before duplicating.
- **Images:** `next/image` + `next.config.ts` `images.remotePatterns` (e.g. `cdn.sanity.io`).
- **Performance:** hero and LCP work belongs with [docs/performance.md](../../../docs/performance.md).
