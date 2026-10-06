import type { GtpSessionModalHostedBy } from "@/sanity/gtp-programme";
import type { ProgrammeHostedByOverride } from "./types";

function applyHostedByOverride(
  base: GtpSessionModalHostedBy,
  override: ProgrammeHostedByOverride | undefined,
): GtpSessionModalHostedBy {
  const name = override?.name?.trim() ?? "";
  const logoUrl = override?.logoUrl?.trim() || null;
  const location = override?.location?.trim() ?? "";
  const replacesHost = Boolean(name || logoUrl);

  if (!replacesHost) {
    if (!location) return base;
    return {
      ...base,
      subtitle: location,
      showSubtitle: override?.showLocation !== false,
    };
  }

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

/** Programme default, then session, then workshop. A name or logo replaces the host. Location alone keeps the host and replaces the location line. */
export function resolveProgrammeHostedBy(
  fallback: GtpSessionModalHostedBy,
  ...overrides: Array<ProgrammeHostedByOverride | undefined>
): GtpSessionModalHostedBy {
  return overrides.reduce(applyHostedByOverride, fallback);
}
