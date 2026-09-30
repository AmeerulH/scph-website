import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
} as const;

export function SpotifyIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9.25" />
      <path d="M7.2 9.6c3.3-1 7-.7 9.8 1" />
      <path d="M7.7 12.6c2.8-.8 5.6-.5 8 .9" />
      <path d="M8.3 15.5c2.3-.6 4.3-.4 6.3.7" />
    </svg>
  );
}

export function YouTubeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2.75" y="5.5" width="18.5" height="13" rx="4" />
      <path d="M10 9.4v5.2l4.6-2.6L10 9.4Z" fill="currentColor" />
    </svg>
  );
}

export function ApplePodcastsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8.2 14.6a4.6 4.6 0 1 1 7.6 0" />
      <path d="M5.6 17a8.3 8.3 0 1 1 12.8 0" />
      <circle cx="12" cy="10.4" r="1.6" fill="currentColor" />
      <path d="M10.4 14h3.2l-.5 5.2a1.1 1.1 0 0 1-2.2 0L10.4 14Z" fill="currentColor" />
    </svg>
  );
}

export function PlayGlyph(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable={false} {...props}>
      <path d="M8 5.5v13l11-6.5L8 5.5Z" fill="currentColor" />
    </svg>
  );
}
