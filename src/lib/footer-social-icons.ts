/** Maps Sanity `footerSocialLink.iconKey` to static PNG paths (v1). */
export const FOOTER_SOCIAL_ICON_PATHS: Record<
  string,
  string | undefined
> = {
  fb: "/images/gtp/social/fb.png",
  ig: "/images/gtp/social/ig.png",
  li: "/images/gtp/social/li.png",
  tt: "/images/gtp/social/tt.png",
  x: "/images/gtp/social/x.png",
  yt: "/images/gtp/social/yt.png",
};

export function footerSocialIconSrc(iconKey: string): string {
  return FOOTER_SOCIAL_ICON_PATHS[iconKey] ?? FOOTER_SOCIAL_ICON_PATHS.fb!;
}
