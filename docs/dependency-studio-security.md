# Studio dependency security batch, 15 November 2026

The Studio lockfile is refreshed within existing manifest ranges; Sanity and
Vision remain on major version 5 (5.31.2). No schema, document, seed or deployment
configuration changes are included.

Studio maintenance now requires Node 24 or newer, matching CI's Node 24. Updated
CLI dependencies no longer support the previously declared Node 20 floor.

The React helper peer placement is explicit in the lockfile: Sanity UI resolves
react-is 19.3.1, while prop-types and hoist-non-react-statics retain their required
16.13.1 copies. `npm ls react-is --all --prefix studio` passes without invalid peers.

| Existing PR | Covered versions |
| --- | --- |
| #169 | Vite 7.3.8 |
| #158 | brace-expansion 1.1.22 / 5.0.13 |
| #115 | nanoid 3.3.20 / 5.1.16 |
| #111 | PostCSS 8.5.33; styled-components 6.6.0 |
| #104 | Undici 7.30.2; the old 6.x copy is removed |

Clean install with scripts disabled, Studio TypeScript, peer validation and
production build with auto-updates disabled passed locally. The npm audit
changed from 32 affected packages to 20 (0 critical, 4 high, 16 moderate).
Known adm-zip/CLI findings remain, so #133's wider Studio upgrade is not closed
by this batch. Do not close #65 merely because esbuild is updated: that PR also
proposes a major Sanity upgrade and needs a separate disposition.

Close covered PRs only after the replacement passes GitHub checks and merges.
Merging the files does not deploy the hosted Studio or publish CMS content.
