const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

/** Extract an 11-character video ID from watch, youtu.be, embed, shorts or live URLs. */
export function parseYouTubeId(input?: string | null): string | null {
  const raw = input?.trim();
  if (!raw) return null;
  if (YOUTUBE_ID.test(raw)) return raw;
  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");
    let id: string | null = null;
    if (host === "youtu.be") {
      id = url.pathname.split("/")[1] ?? null;
    } else if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      id = url.searchParams.get("v");
      if (!id) {
        const [, kind, pathId] = url.pathname.split("/");
        if (["embed", "shorts", "live", "v"].includes(kind)) id = pathId ?? null;
      }
    }
    return id && YOUTUBE_ID.test(id) ? id : null;
  } catch {
    return null;
  }
}

export function youTubeThumbnailUrl(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function youTubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
}
