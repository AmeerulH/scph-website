/**
 * Repo defaults → Sanity `gtp2026GetInvolvedPage` singleton
 *
 * Source: src/sanity/gtp-marketing-defaults.ts (same copy as mergeGtpGetInvolvedCopy fallbacks).
 * Idempotent: fixed _id `gtp2026GetInvolvedPage` with createOrReplace.
 *
 * Prerequisites: SANITY_API_TOKEN in .env.local (Editor+).
 * Dataset: SANITY_DATASET from .env.local (default production).
 *
 * Usage:
 *   npx tsx scripts/seed-gtp-get-involved-page.ts
 *   DRY_RUN=1 npx tsx scripts/seed-gtp-get-involved-page.ts
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import * as path from "path";

import { FOOTER_SOCIAL_ICON_PATHS } from "../src/lib/footer-social-icons";
import { DEFAULT_GET_INVOLVED } from "../src/sanity/gtp-marketing-defaults";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const DOC_ID = "gtp2026GetInvolvedPage";

function iconKeyFromSrc(iconSrc: string): string {
  for (const [key, src] of Object.entries(FOOTER_SOCIAL_ICON_PATHS)) {
    if (src === iconSrc) return key;
  }
  return "fb";
}

function buildDocument() {
  const d = DEFAULT_GET_INVOLVED;
  const c = d.contact;
  return {
    _id: DOC_ID,
    _type: "gtp2026GetInvolvedPage" as const,
    internalTitle: "Get involved",
    heroTitle: d.heroTitle,
    heroLede: d.heroLede,
    contactSectionTitle: c.sectionTitle,
    contactSectionSubtitle: c.sectionSubtitle,
    contactIntro: c.intro,
    contactIntroSuffix: c.introSuffix,
    contactFaqLinkLabel: c.faqLinkLabel,
    contactFaqHref: c.faqHref,
    contactOrgName: c.orgName,
    contactOrgAddress: c.orgAddress,
    contactConferenceDates: c.conferenceDates,
    contactInfoAddressLabel: c.addressLabel,
    contactInfoAddress: c.addressBody,
    contactInfoHoursLabel: c.hoursLabel,
    contactInfoHours: c.hoursBody,
    contactInfoPhoneLabel: c.phoneLabel,
    contactInfoPhone: c.phoneDisplay,
    contactInfoPhoneTel: c.phoneTel,
    contactInfoEmailLabel: c.emailLabel,
    contactInfoEmail: c.email,
    contactInfoSocialHeading: c.socialHeading,
    contactInfoSocialLinks: c.socialLinks.map((s, i) => ({
      _type: "footerSocialLink" as const,
      _key: `soc-${i}`,
      label: s.label,
      href: s.href,
      iconKey: iconKeyFromSrc(s.iconSrc),
    })),
    contactMapEmbedUrl: c.mapEmbedUrl ?? undefined,
    contactMapTitle: c.mapIframeTitle,
    partnershipSectionTitle: d.partnership.sectionTitle,
    partnershipSectionSubtitle: d.partnership.sectionSubtitle,
    partnershipLead: d.partnership.lead,
    partnershipHighlight: d.partnership.highlight,
    partnershipBody: d.partnership.body,
    partnershipCtaLabel: d.partnership.ctaLabel,
  };
}

async function main() {
  const doc = buildDocument();

  if (process.env.DRY_RUN) {
    console.log(JSON.stringify(doc, null, 2));
    return;
  }

  const token = process.env.SANITY_API_TOKEN;
  if (!token) {
    console.error(
      "SANITY_API_TOKEN is not set. Add it to .env.local (see import-gtp-programme-to-sanity.ts).",
    );
    process.exit(1);
  }

  const dataset = process.env.SANITY_DATASET ?? "production";

  const client = createClient({
    projectId: "y0tkemxm",
    dataset,
    apiVersion: "2024-01-01",
    token,
    useCdn: false,
  });

  await client.transaction().createOrReplace(doc).commit();
  console.log(
    `Upserted ${DOC_ID} on dataset "${dataset}". Open Studio (same dataset) and Publish if needed.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
