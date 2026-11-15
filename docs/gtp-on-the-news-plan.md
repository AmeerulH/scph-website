# ON THE NEWS — design and implementation plan

Approved Option 1, 13 October 2026. Branch: `feature/gtp-on-the-news`.
The user approved Selectable spotlight and authorized local implementation, including careful mobile UX. Production schema deployment, CMS writes and release remain separate.

## Purpose and proposed direction

Create `/events/gtp-2026/media/on-the-news` as a celebratory showcase of GTP conference coverage and other articles curated by the team. Visitors should recognise the story and its publisher, explore the collection, and open the original article in one click. Impeccable visitor mode: **Experience**, with a readable article catalogue below the showcase.

Keep the established GTP typography, navigation and footer. Expand this particular page's energy through blended teal, turquoise, lime and orange backgrounds, generous article imagery, large headlines and a deliberate featured-story moment. The user's vibrant gradient brief governs this surface; it does not propose a site-wide redesign.

### Layout options for review

| Option | Opening and interaction | Tradeoff |
| --- | --- | --- |
| **Selectable spotlight — recommended** | One generous image-and-headline feature beside a selector of three to five featured stories. Selecting a thumbnail previews the story; clicking the main article area opens its publisher. A searchable collection follows. | Preview controls must be distinct from article links. Works with one story and gains variety as coverage arrives. |
| Magazine front page | One lead story plus two supporting stories in an asymmetric editorial composition. Every story links directly to its publisher; the collection follows. | Strongest with three or more real stories; small collections need a simpler composition. |
| Story reel | Large feature spreads with native swipe, a glimpse of the next story, previous/next buttons and a position indicator. The complete collection follows. | Later features require horizontal exploration; the collection ensures every article is still easy to find. |

The original local picker contains layout schematics. Following the user's mobile review request, three separate **high-fidelity mockup images** were generated and delivered inline in the conversation, with clearly labelled sample articles and synthetic imagery. The approved comp and its prompt are retained in this branch; the other two mockups remain local review artifacts:

- Option 1, Selectable spotlight: `.impeccable/mocks/decision/on-the-news-spotlight.png`
- Option 2, Magazine front page: `.impeccable/mocks/decision/on-the-news-editorial.png`
- Option 3, Story reel: `.impeccable/mocks/decision/on-the-news-reel.png`

The user selected Option 1 in the conversation; local picker access is no longer needed. These are design previews, not a working page. The sample images/headlines will be replaced by team-authored CMS content. Responsive behaviour, link semantics and animation remain implementation responsibilities.

## Recommended visitor experience

1. **Arrive at the stories.** A compact “Media / On the News” breadcrumb and expressive ON THE NEWS heading introduce the actual featured article in the first viewport. Keep the introduction short and editable; avoid a full-screen banner that pushes coverage out of view.
2. **Explore the spotlight.** Show an edge-to-edge article image, its headline, publisher, optional real publication date and a clear “Read article ↗” affordance. Up to five editorially selected stories can occupy the spotlight. The main image-and-headline area is one external anchor; preview selectors are separate buttons.
3. **Browse all articles.** Offer All, GTP conference and Other articles filters, title/publisher search, a result count and newest-first ordering. Keep these controls in a compact toolbar. Use generous image-led entries with varied emphasis, readable titles and consistent link behaviour.
4. **Keep the collection bounded.** Show up to nine articles per page with explicit previous/next controls and a visible range/count. Store filter, query and page in the URL so links and browser Back restore the view. Small collections show everything without pagination. The full collection includes featured articles so discovery never depends on the spotlight.
5. **Open the source.** The complete article unit links directly to the original HTTPS URL. Proposed default: a new tab to preserve the showcase, with a clear accessible “opens in a new tab” indication and `rel="noopener noreferrer"`. No intermediate article modal or copied article body.

### Visual and responsive behaviour

- Use layered CSS gradients across the page: saturated GTP teal/turquoise, areas of lime, and warm orange light. Keep these static so the background does not compete with headlines.
- Place headlines and metadata against calm, high-contrast areas. Gradients frame the work; do not recolour or overlay publisher images. The user explicitly approved proportional cover crops for these article photos on 13 October 2026: fill every frame without stretching or empty edges. Keep visible publisher attribution and image credit when supplied. Artwork on other pages retains its existing whole-image treatment.
- Preserve Poppins headings and Inter body text. Large headlines, asymmetric image scale and changes in density provide the editorial rhythm.
- Desktop spotlight: dominant feature plus a short headline/thumbnail selector. Mobile: full-width feature with native horizontal scrolling for the thumbnail buttons, visible navigation and at least 44px targets. Main article links remain separate from swipe controls.
- The catalogue becomes two columns where space allows and one on small phones. Long titles wrap fully; publisher labels and dates remain legible. No fixed-height title clipping or hover-only information.

## CMS plan

Use **individual article documents** for independent drafts, publishing and reuse. Keep page settings in the existing Media document, matching the Visual Synthesis subpage pattern.

| Surface | Proposed fields and editor behaviour |
| --- | --- |
| `gtp2026NewsArticle` — new document type | Required title, uploaded article image, image alt text, HTTPS article URL, publisher and category (`gtpConference` / `other`). Optional publication date and image credit. No slug or internal article-body editor is needed. |
| `gtp2026MediaPage` — new **On the News** group | Page title, short introduction, empty-state copy and an ordered list of up to five weak article references, so editors can unpublish stories independently. Reject duplicate references. |
| Studio navigation | Make **On the News: Articles** easy to locate and link its purpose to the Media page settings. Keep the existing Photo Gallery, Podcasts, Videos and Visual Synthesis editing flows intact. |

Editor flow: create an article, upload its image, enter its title/publisher/category/link, preview and publish. It then appears in the collection. To highlight it, add it to the Media document's featured selections and publish that document. Removing it from the spotlight leaves it available in the collection; unpublishing an article removes it from both public areas.

Read published content only. Referenced drafts must not appear publicly. If featured selections are empty, use up to three latest valid published articles; show no fictional content. Sort by the real publication date when present and creation time as an internal fallback, with a stable tie-breaker. Never present that fallback as a publication date.

Default content contains page copy and an empty featured list only. A seed uses `createIfNotExists` and `setIfMissing`, supports `DRY_RUN=1`, and preserves the production guard and explicit approval requirement. It must never seed sample articles or replace existing arrays or editor copy.

### States and content range

- **Zero articles:** an honest, CMS-editable message; hide the empty spotlight and browsing controls. No borrowed coverage or dead article links.
- **One article:** a single feature, no selectors or pagination.
- **Two to five articles:** a populated spotlight with only the controls needed for the chosen layout; a small complete collection.
- **Larger collections:** bounded pagination and URL-backed search/filtering; hydrate only the current page and spotlight from Sanity rather than downloading every image or rendering an unbounded client list. A lightweight server-only metadata index supplies literal search and counts after strict URL validation. This deliberately trades an index read for exact counts of valid records; image detail queries and browser payloads remain bounded. Revisit the index with a dedicated search service if the press archive grows substantially.
- **No matching results:** show the active query/filter and an easy reset.
- **Malformed records:** Studio validation prevents publication without required fields; the runtime also omits invalid links or incomplete articles from displayed items and counts.
- **Fetch failure:** distinguish unavailable content from a genuinely empty collection; provide a retry path rather than claiming there is no coverage.
- **Missing optional metadata:** omit the date or image credit without inventing values.
- **Unavailable source article:** the team can update or unpublish its record; browser reachability cannot guarantee an external article is accessible to every visitor.

## Motion plan — Emil Kowalski guidance

Reuse the existing `--ease-out-strong` curve: `cubic-bezier(0.23, 1, 0.32, 1)`. These are proposed recipes; evaluate their feel in the actual layout after selection. Animation must never delay article activation.

| Priority / location | Current condition | Purpose / frequency | Proposed motion |
| --- | --- | --- | --- |
| 1 — new spotlight selector | New interface; no transition exists yet | State indication and preventing a jarring content change / occasional | Incoming image-and-headline group: opacity 0 → 1 and translateY 8px → 0 over 220ms using `--ease-out-strong`. Exit over 120ms. Keep the selected article's frame stable and rapid selections interruptible. First story is visible server-rendered. |
| 2 — article/control press feedback | New article links and preview buttons | Feedback / repeated during a visit | On press, scale 1 → 0.98 over 120ms using `--ease-out-strong`. Hover on fine pointers only: external-link arrow translates 2px over 160ms; images remain unchanged. Keyboard focus appears immediately. |
| 3 — catalogue changes | New filtering/paging flow | State indication / occasional | After content is ready, opacity 0 → 1 over 160ms using `--ease-out-strong`; retain layout space during loading and announce the new result count. No stagger on each search keystroke. |

For the reel alternative, prefer native scroll-snap with ordinary arrows over custom drag physics. With reduced motion, keep stable images and immediate state changes; the repository's global reduced-motion rule already disables transitions. Any local behaviour must honour it as well.

Rejected candidates: continuous gradient animation fails the reading/function gate; autoplay feature rotation fails user-controlled browsing; scroll hijacking and dramatic parallax interrupt navigation; 3D pointer tilt/zoom distorts third-party images. The signature moment is the selected feature changing smoothly, while the article remains the focus.

## Implementation sequence after design approval

1. Record the chosen Impeccable surface brief and direction contract. Load the craft floor immediately before UI edits. Agree any visual mockup step selected in the layout picker.
2. Add `gtp2026NewsArticle` to Studio schema registration and extend `gtp2026MediaPage` with its On the News group. Add the narrow Studio navigation affordance and the guarded initial-settings seed.
3. Add `src/sanity/gtp-on-the-news.ts` with page settings, published featured references, bounded image-detail queries and a server-only metadata index for validated counts/search, strict HTTPS URL validation and honest resolved types. Keep query → merge → props as the data path.
4. Build `src/app/events/gtp-2026/media/on-the-news/page.tsx` as a dynamic Server Component, with canonical and social metadata. Colocate feature/catalogue components under `src/components/gtp/media/news/`; isolate client code to spotlight interaction and any necessary controls. Use existing Motion/Embla capabilities only if CSS/native behaviour cannot do the job; no dependency is currently proposed.
5. Add **On the News** to the desktop/mobile Media dropdown and a visible Media landing-page entry. Recompose that landing-page index deliberately for five destinations rather than squeezing a fifth item into its existing four-column layout.
6. Add the route to `src/lib/public-indexable-paths.ts` and the Media revalidation mapping; add article-document mapping for the news route. Update the GTP team handbook, README and AGENTS inventory. Prefer extending the existing Media seed's missing-fields payload over creating a parallel script unless necessary.
7. Review the narrow security-sensitive revalidation/seed diff. Run lint, build and Studio schema validation; review desktop and mobile together, check the motion with reduced-motion enabled, and spot-check mobile Lighthouse Performance ≥80 on the news route and affected Media landing page. Test keyboard controls, full-card links, long titles, one/zero/many stories, published-versus-draft references, URL state, pagination and invalid links. Keep synthetic review data isolated from public defaults.
8. Complete the Impeccable finish review and documentation plus an Emil motion review. Deliver the local preview for review. Production schema deployment, seeding, content publication and website release remain distinct subsequent actions.

## Content handoff

- **Settled:** Option 1, Selectable spotlight.
- **Other articles** permits team-curated stories, matching the original request. Editors own their subject matter.
- No real article URLs or images were supplied for this task. Final content will be added by the team in Studio; any later preview fixtures must be clearly labelled and excluded from public data.

## Implementation and release scope

The user authorized implementation, a PR and a shareable preview after choosing Option 1. Unrelated prior AGENTS.md quality-gate additions and two programme-file edits remain outside the feature commit. Production schema deployment, seeding and article publication require a separate release step; this work does not write CMS content.

The final motion uses a stable feature frame, an interruptible 220ms opacity/8px translation, 120ms press feedback and immediate keyboard/reduced-motion selection. Catalogue navigation follows URL state without added entry animations. The user subsequently approved edge-to-edge proportional photo crops, brighter gradients and larger featured headlines.

Validation: news behaviour checks, scoped ESLint, Next.js build, Studio TypeScript and schema validation passed. Full-repository lint reports the existing 23 errors and 11 warnings outside this change. Mobile Lighthouse Performance: populated news preview 80; real empty news route 80; Media landing page 83. Existing shared-footer contrast warnings remain outside this surface. Visuals and controls were checked at 320, 390, 1280 and 1440px; touch hardware remains for the user to test. The Impeccable finish reviewer cleared the scored colour/scale/evidence fixes, and DESIGN.md plus its sidecar document the shipped system locally under the repository’s existing context-file ignore policy.
