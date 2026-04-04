/**
 * Documented ISR interval (seconds) for the GTP programme + about pages.
 * Those routes must export `export const revalidate = 900` as a **numeric literal**
 * in each `page.tsx` — Next.js does not allow importing this value for segment config.
 */
export const GTP_PROGRAMME_REVALIDATE_SECONDS = 900;
