/**
 * ISR fallback interval (seconds) for Sanity-backed marketing pages.
 * Publish-time freshness is handled by POST /api/revalidate/sanity; this caps
 * stale cache duration if a webhook is missed and limits Vercel ISR writes.
 *
 * Page files must use this value as a **literal** (`export const revalidate = 3600`)
 * because Next.js segment config is not statically analyzable from imports.
 */
export const CMS_PAGE_REVALIDATE_SECONDS = 3600;
