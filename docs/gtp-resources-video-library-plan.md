# Approved implementation brief

Add Resources at `/events/gtp-2026/resources` in the GTP navbar, and Videos at `/events/gtp-2026/media/videos` in Media navigation. Preserve the existing GTP visual world and editor ownership.

Resources leads with one Faith Based Toolkit resource with Summary booklet and Full toolkit PDF downloads. Ordered declaration and Potsdam handover outcome report entries follow. Missing files remain visibly pending; each file becomes available independently. Covers are optional, shown whole and credited. Independent resource documents allow the library to expand without code changes.

Videos has four Daily Highlights slots, Session Recordings with title/speaker/description search, day filters and 12 results per page, and an individually managed GTP2026 Playlist. Query/day/page live in the URL and support refresh/Back. One accessible dialog hosts one click-loaded YouTube privacy-enhanced iframe; closing stops playback and restores focus. Keep a compact Media preview and its existing #videos anchor.

Independent video documents are authoritative only after an explicit migration cutover. Preserve both existing published videos, every original field/image reference, and their order in the playlist. Retain the source array; unpublishing after cutover never resurrects it. Migration needs a backup, reviewed dry-run plan, source/target revision guards, parity checks and an atomic transaction.

New CMS types/settings need Studio navigation, seeds, published data loaders, dynamic routes, metadata, sitemap/revalidation maps, README/AGENTS inventory and handbook coverage. Empty content and fetch errors are distinct. Seeds bootstrap known shells without invented facts/assets or overwriting editor content. No new dependencies, registration flow, YouTube API synchronisation or uploaded MP4 player.

Test downloads/partial availability, pending states, source preservation/cutover/unpublishing, hostile video/file URLs, large archives, keyboard/player behaviour and responsive navigation. Run lint/build, Studio type checks, diff/security reviews and mobile performance checks. Production writes/deployment/publishing are separate steps. The user initially prohibited commit/push, then explicitly authorized commit/push/PR on 19 October 2026. Labelled sample layouts may be shared on Vercel Preview without CMS writes; real production must still return 404 for the review route.
