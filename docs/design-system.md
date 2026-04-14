# Design system

Practical reference for **typography**, **brand colour tokens**, **UI primitives**, and **media** in this codebase. Editors still control most marketing copy via Sanity; this document covers **implementation** choices.

## Typography

- **Fonts:** Google fonts loaded in `src/lib/fonts.ts` — **Poppins** (heading variable `--font-poppins`) and **Inter** (body variable `--font-inter`), both `display: "optional"` to reduce layout shift risk.
- **CSS mapping:** `src/app/globals.css` maps them in `@theme inline` as `--font-heading` and `--font-sans`, and applies them in the global layer. **Do not** add redundant webfont stacks for the same roles.

## Colour tokens

Brand palettes are defined as **CSS custom properties** inside `@theme inline` in `src/app/globals.css`:

- **SCPH:** `--color-scph-blue`, `--color-scph-green`, `--color-scph-dark-green`, and light/dark variants.
- **GTP 2026:** `--color-gtp-dark-teal`, `--color-gtp-teal`, `--color-gtp-green`, `--color-gtp-dark-green`, `--color-gtp-orange`, and variants.

**Rule of thumb:** GTP event surfaces use **gtp-** tokens; SCPH marketing pages use **scph-** tokens. shadcn semantic tokens (`--color-primary`, `--color-muted`, etc.) are also defined for shared UI.

## Components (`src/components/ui/`)

Shared primitives follow **shadcn-style** patterns (Radix + Tailwind), including:

- `button`, `card`, `badge`, `separator`, `sheet`, `navigation-menu`, `carousel`

Prefer **composing or extending** these over one-off duplicates. New primitives should match existing variants and class naming (`cn`, CVA patterns as used in the repo).

## Images

- Use **`next/image`** for Sanity CDN and static assets under `public/`.
- **Remote patterns** are configured in `next.config.ts` (`cdn.sanity.io`, `images.unsplash.com`, etc.).
- **Formats:** WebP only at the Next image config level (`formats: ["image/webp"]`) — intentional tradeoff documented in config comments (AVIF disabled for first-byte behaviour).

## Motion and accessibility

- Use **motion** (`motion` package) sparingly and in line with existing components.
- Respect **`prefers-reduced-motion`** where the codebase already does; mirror that pattern for new animations.

## See also

- [performance.md](./performance.md) — Hero images, LCP, and Unlighthouse expectations.
- [AGENTS.md](../AGENTS.md) §7 — Performance practices tied to CWV.
