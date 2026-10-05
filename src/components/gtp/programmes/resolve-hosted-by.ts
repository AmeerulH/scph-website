import type { GtpSessionModalHostedBy } from "@/sanity/gtp-programme";
import type { ProgrammeHostedByOverride } from "./types";

function applyHostedByOverride(
  base: GtpSessionModalHostedBy,
  override: ProgrammeHostedByOverride | undefined,
): GtpSessionModalHostedBy {
  const name = override?.name?.trim() ?? "";
  const logoUrl = override?.logoUrl?.trim() || null;
  if (!name && !logoUrl) return base;

  const location = override?.location?.trim() ?? "";
  const organisation = name || base.name;

  return {
    sectionTitle: base.sectionTitle,
    name: organisation,
    subtitle: location,
    showSubtitle: override?.showLocation !== false && Boolean(location),
    logoUrl,
    logoAlt: logoUrl
      ? override?.logoAlt?.trim() || `${organisation} logo`
      : "",
    logoWidth: override?.logoWidth,
    logoHeight: override?.logoHeight,
  };
}

/** Programme default, then session, then workshop. A later override wins when it sets a name or logo. */
export function resolveProgrammeHostedBy(
  fallback: GtpSessionModalHostedBy,
  ...overrides: Array<ProgrammeHostedByOverride | undefined>
): GtpSessionModalHostedBy {
  return overrides.reduce(applyHostedByOverride, fallback);
}
