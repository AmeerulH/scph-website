/**
 * Repo defaults → Sanity `scphFooter` + `gtp2026Footer` singletons.
 *
 * Source: [`src/data/scph-footer-defaults.ts`](../src/data/scph-footer-defaults.ts),
 * [`src/data/gtp-footer-defaults.ts`](../src/data/gtp-footer-defaults.ts). Omits optional
 * images (`logo`, `bottomLogo`, `bannerLogosImage`) so the site keeps static fallbacks until
 * editors upload assets in Studio.
 *
 * Idempotent: fixed `_id`s `scphFooter` and `gtp2026Footer` with createOrReplace.
 *
 * Prerequisites: SANITY_API_TOKEN in .env.local (Editor+).
 * Dataset: SANITY_DATASET from .env.local (default production).
 *
 * Usage:
 *   npm run seed-footers
 *   DRY_RUN=1 npm run seed-footers
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import * as path from "path";

import { FOOTER_SOCIAL_ICON_PATHS } from "../src/lib/footer-social-icons";
import { gtpFooterDefaults } from "../src/data/gtp-footer-defaults";
import { scphFooterDefaults } from "../src/data/scph-footer-defaults";
import type { FooterLinkColumnResolved } from "../src/sanity/footer-types";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const SCPH_FOOTER_ID = "scphFooter";
const GTP_FOOTER_ID = "gtp2026Footer";

function iconKeyFromSrc(iconSrc: string): string {
  for (const [key, src] of Object.entries(FOOTER_SOCIAL_ICON_PATHS)) {
    if (src === iconSrc) return key;
  }
  return "fb";
}

function footerNavLinksSanity(
  links: FooterLinkColumnResolved["links"],
  keyPrefix: string,
) {
  return links.map((l, i) => ({
    _type: "footerNavLink" as const,
    _key: `${keyPrefix}-${i}`,
    label: l.label,
    href: l.href,
    openInNewTab: l.openInNewTab,
  }));
}

function footerLinkColumnSanity(col: FooterLinkColumnResolved, keyPrefix: string) {
  return {
    _type: "footerLinkColumn" as const,
    title: col.title,
    links: footerNavLinksSanity(col.links, keyPrefix),
  };
}

function buildScphFooterDoc() {
  const d = scphFooterDefaults;
  return {
    _id: SCPH_FOOTER_ID,
    _type: "scphFooter" as const,
    internalTitle: "SCPH footer",
    tagline: d.tagline,
    socialLinks: d.socialLinks.map((s, i) => ({
      _type: "footerSocialLink" as const,
      _key: `soc-${i}`,
      label: s.label,
      href: s.href,
      iconKey: iconKeyFromSrc(s.iconSrc),
    })),
    columnQuickLinks: footerLinkColumnSanity(d.columnQuick, "quick"),
    columnCommunity: footerLinkColumnSanity(d.columnCommunity, "comm"),
    columnConferences: footerLinkColumnSanity(d.columnConferences, "conf"),
    contactEmail: d.contactEmail,
    address: d.address,
    phoneDisplay: d.phoneDisplay,
    phoneTel: d.phoneTel,
    careerEmail: d.careerEmail,
    copyrightLine: d.copyrightLine,
    partOfLabel: d.partOfLabel,
  };
}

function buildGtp2026FooterDoc() {
  const d = gtpFooterDefaults;
  return {
    _id: GTP_FOOTER_ID,
    _type: "gtp2026Footer" as const,
    internalTitle: "GTP 2026 footer",
    quickLinks: footerNavLinksSanity(d.quickLinks, "ql"),
    importantDates: d.importantDates.map((row, i) => ({
      _type: "gtpFooterImportantDate" as const,
      _key: `id-${i}`,
      label: row.label,
      dateText: row.date,
    })),
    contactRows: d.contactRows.map((row, i) => {
      if (row.rowType === "externalLink") {
        return {
          _type: "gtpFooterContactRow" as const,
          _key: `cr-${i}`,
          rowType: "externalLink" as const,
          text: row.text,
          url: row.url,
        };
      }
      return {
        _type: "gtpFooterContactRow" as const,
        _key: `cr-${i}`,
        rowType: row.rowType,
        text: row.text,
      };
    }),
    socialLinks: d.socialLinks.map((s, i) => ({
      _type: "footerSocialLink" as const,
      _key: `soc-${i}`,
      label: s.label,
      href: s.href,
      iconKey: iconKeyFromSrc(s.iconSrc),
    })),
    copyrightLine: d.copyrightLine,
    hostedByPrefix: d.hostedByPrefix,
    hostedByLabel: d.hostedByLabel,
    hostedByUrl: d.hostedByUrl,
  };
}

async function main() {
  const scphDoc = buildScphFooterDoc();
  const gtpDoc = buildGtp2026FooterDoc();

  if (process.env.DRY_RUN) {
    console.log(JSON.stringify({ scphFooter: scphDoc, gtp2026Footer: gtpDoc }, null, 2));
    return;
  }

  const token = process.env.SANITY_API_TOKEN;
  if (!token) {
    console.error(
      "SANITY_API_TOKEN is not set. Add it to .env.local (see other seed scripts).",
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

  await client.transaction().createOrReplace(scphDoc).createOrReplace(gtpDoc).commit();
  console.log(
    `Upserted ${SCPH_FOOTER_ID} and ${GTP_FOOTER_ID} on dataset "${dataset}". Publish in Studio if needed.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
