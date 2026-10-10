# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Researchers, policymakers, journalists, university partners, and climate-interested public visiting Sunway Centre for Planetary Health (SCPH) marketing pages or the Global Tipping Points Conference 2026 (GTP) site. They arrive for credibility, programme clarity, and partnership signals, often on mobile, often scanning rather than reading deeply.

During the conference itself (12 to 15 October 2026), delegates and remote followers also return day by day for the programme, photos, and new media.

## Product Purpose

A dual-brand Next.js + Sanity marketing site: SCPH institutional storytelling and GTP 2026 event conversion (about, programme, submissions, get involved, media). Success means published CMS content reads as authoritative, pages feel conference-grade, and partner/sponsor presence builds trust without looking like a logo dump.

## Positioning

GTP 2026 is the Global Tipping Points Conference, 12 to 15 October 2026, Kuala Lumpur, hosted by SCPH at Sunway. The site is the conference's working record: programme, people, partners and media, authored by the events team in Sanity and kept honest about what is still pending.

## Operating Context

- The events team (requests arrive from Laila Iskandar) asks for changes by message and supplies content by email; editors publish in Sanity Studio. The site reads only published documents.
- Content arrives during the event, not before it, so surfaces must hold a clear empty state until the first real item exists.
- External contributors (illustrators, photographers, hosts, partners) supply their own work, headshots, bios, and links.

## Capabilities and Constraints

- Next.js App Router, Sanity CMS, Tailwind; Server Components by default, `next/image` for media, WebP output.
- Code defaults merge with Sanity; editors own whatever they have published.
- Lighthouse Performance of at least 80 on every scanned URL (mobile).
- New CMS-backed surfaces need schema, data layer, seed, and revalidation mapping (see AGENTS.md).
- Confirmed: the Media sub-page is called "Visual Synthesis" (the contributor's request: it is live sense-making of the conference, not "illustrations"). Bigger Picture must be credited as provider and Ole Qvist-Sørensen credited as co-facilitator and visual sense-maker, on the conference web page.
- Undecided: whether syntheses stay up after the conference as well as being posted through the days.

## Brand Commitments

Institutional, urgent, and clear. Science-led confidence with warm hospitality for a Kuala Lumpur-hosted global conference. GTP leans teal/orange climate energy; SCPH leans planetary-health blues/greens. GTP surfaces use the existing `gtp-*` colour tokens and the established heading/body fonts. Institutional quiet luxury: generous space, aligned marks, restrained motion; never noisy.

Standing rule (confirmed, site-wide): third-party artwork (illustrations, posters, partner logos) is always shown whole, never cropped, recoloured, overlaid, or filtered, and its credit stays visible.

Anti-references: generic SaaS purple gradients; cream-and-terracotta AI landing templates; dense newspaper broadsheet layouts; logo walls as tiny greyscale postage stamps; card grids of icon + heading + fluff; glassmorphism for decoration; neon crypto aesthetics.

## Evidence on Hand

- GTP 2026 conference photos, podcast episodes, and videos do not exist yet. The Media page shows labelled GTP 2025 stand-in photos and a placeholder podcast cover until real uploads arrive (`src/data/gtp-media-page-defaults.ts`). Never present stand-ins as 2026 material.
- No visual synthesis exists yet; the first plenary maps arrive from 12 October 2026. Never ship placeholder artwork as if it were a finished plenary map.
- The contributor is Ole Qvist-Sørensen, Bigger Picture (https://biggerpicture.dk, Copenhagen, visual collaboration since 2003). He has supplied page copy, a credit line, two bios (short and medium), and photos by email; the attachments still need saving into the project before use.
- Commercial and contract terms from the correspondence are private and never appear on the site.

## Product Principles

1. **Editors own the words.** Visual polish respects CMS-authored titles, logos, and notices.
2. **One job per section.** Partners prove coalition; an invite is a separate beat.
3. **Pending stays visibly pending.** Missing facts show an honest empty state, never invented or borrowed content.
4. **Contributors' work is shown whole and credited.**
5. **Performance is part of craft.** Prefer Server Components, `next/image`, and light client motion.

## Accessibility & Inclusion

Respect `prefers-reduced-motion`. Maintain readable contrast on teal/dark-teal. Logo links need clear accessible names. Aim for WCAG 2.2 AA on interactive and text elements. Image-based content that carries text (posters, infographics) needs a real text equivalent, not decorative alt text.
