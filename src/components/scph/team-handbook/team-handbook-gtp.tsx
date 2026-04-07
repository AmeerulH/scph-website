import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { HandbookScreenshotFigure } from "./team-handbook-shared";

/** Matches `src/app/globals.css` @theme GTP tokens (Tailwind: bg-gtp-*). */
const gtpPalette: { name: string; token: string; hex: string }[] = [
  { name: "Dark teal", token: "gtp-dark-teal", hex: "#0D4D5E" },
  { name: "Dark teal (light)", token: "gtp-dark-teal-light", hex: "#116578" },
  { name: "Dark teal (dark)", token: "gtp-dark-teal-dark", hex: "#093a48" },
  { name: "Teal", token: "gtp-teal", hex: "#009CB4" },
  { name: "Teal (light)", token: "gtp-teal-light", hex: "#00b5d1" },
  { name: "Teal (dark)", token: "gtp-teal-dark", hex: "#007d90" },
  { name: "Green", token: "gtp-green", hex: "#86BC25" },
  { name: "Green (light)", token: "gtp-green-light", hex: "#9acb47" },
  { name: "Green (dark)", token: "gtp-green-dark", hex: "#6b971e" },
  { name: "Dark green", token: "gtp-dark-green", hex: "#5C8119" },
  { name: "Dark green (light)", token: "gtp-dark-green-light", hex: "#6f9a1e" },
  { name: "Dark green (dark)", token: "gtp-dark-green-dark", hex: "#496814" },
  { name: "Orange", token: "gtp-orange", hex: "#DB5D00" },
  { name: "Orange (light)", token: "gtp-orange-light", hex: "#f06a00" },
  { name: "Orange (dark)", token: "gtp-orange-dark", hex: "#b34c00" },
];

const gtpCmsPages = [
  {
    route: "/events/gtp-2026/about",
    docTypes: "gtp2026AboutPage",
    title: "About (conference hub)",
    notes:
      "Hero band, optional section blocks under hero, “What are Global Tipping Points”, “Why this matters”, themes, speaker chrome, quotes, priorities, sponsors, etc. Carousel still pulls from `gtp2026Programme`.",
  },
  {
    route: "/events/gtp-2026/about",
    docTypes: "gtp2026HighlightSpeaker",
    title: "Highlight speakers (cards)",
    notes:
      "Multiple documents, ordered for the About page speaker strip. Add/edit photos, names, bios in Studio.",
  },
  {
    route: "/events/gtp-2026/programmes",
    docTypes: "gtp2026Programme",
    title: "Programme",
    notes:
      "Singleton `gtp2026Programme` (fixed id): days, sessions, workshops, speakers. Drives programme page and parts of About.",
  },
  {
    route: "/events/gtp-2026/get-involved",
    docTypes: "gtp2026GetInvolvedPage",
    title: "Get involved",
    notes: "Marketing copy and structure for involvement / contact.",
  },
  {
    route: "/events/gtp-2026/submissions",
    docTypes: "gtp2026SubmissionsPage",
    title: "Submissions",
    notes:
      "Large singleton: abstract + workshop form copy, pillars/themes slots, evaluation criteria, rich sections. Coordinate with devs before restructuring.",
  },
  {
    route: "/events/gtp-2026/media",
    docTypes: "gtp2026MediaPage",
    title: "Media",
    notes: "Marketing-style sections for the GTP media page.",
  },
  {
    route: "/events/gtp-2026/biz-forum",
    docTypes: "gtp2026BizForumPage",
    title: "Business forum",
    notes: "Marketing-style sections for the biz forum page.",
  },
  {
    route: "/events/gtp-2026/faq",
    docTypes: "gtp2026FaqGroup",
    title: "FAQ",
    notes:
      "One document per tab (`gtp2026FaqGroup`). Edit tab order + label, then add/reorder questions in the embedded list (each row is an accordion).",
  },
  {
    route: "/events/gtp-2026/organising-committee",
    docTypes: "gtp2026CommitteeMember",
    title: "Organising committee",
    notes: "Committee members as separate documents with order field.",
  },
] as const;

export function TeamHandbookGtpSections() {
  return (
    <>
      <SectionWrapper
        id="gtp-design-system"
        title="GTP 2026 design system"
        subtitle="Colours & UI"
        theme="gtp"
        background="default"
      >
        <p className="mb-6 max-w-3xl text-gray-600">
          Global Tipping Points 2026 uses its own teal / green / orange palette
          (see <code className="rounded bg-slate-100 px-1">globals.css</code>).
          In code, reference Tailwind classes such as{" "}
          <code className="rounded bg-slate-100 px-1">bg-gtp-teal</code>,{" "}
          <code className="rounded bg-slate-100 px-1">text-gtp-dark-teal</code>.
        </p>

        <h3 className="font-heading text-lg font-bold text-gtp-dark-teal">
          Full palette (swatches)
        </h3>
        <Separator className="my-4" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {gtpPalette.map((c) => (
            <div
              key={c.token}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              <div
                className="h-16 w-full"
                style={{ backgroundColor: c.hex }}
              />
              <div className="p-2">
                <p className="text-xs font-semibold text-gtp-dark-teal">
                  {c.name}
                </p>
                <p className="font-mono text-[10px] text-gray-500">{c.hex}</p>
                <p className="font-mono text-[10px] text-gray-400">{c.token}</p>
              </div>
            </div>
          ))}
        </div>

        <h3 className="mt-12 font-heading text-lg font-bold text-gtp-dark-teal">
          Buttons (GTP variants)
        </h3>
        <Separator className="my-4" />
        <div className="flex flex-wrap gap-3">
          <Button variant="gtp">Primary (gtp)</Button>
          <Button variant="gtpSecondary">Secondary (teal)</Button>
          <Button variant="gtpCta">CTA (orange)</Button>
          <Button variant="gtpOutline">Outline</Button>
        </div>

        <h3 className="mt-10 font-heading text-lg font-bold text-gtp-dark-teal">
          Badges
        </h3>
        <Separator className="my-4" />
        <div className="flex flex-wrap gap-2">
          <Badge variant="gtp">Dark teal</Badge>
          <Badge variant="gtpTeal">Teal</Badge>
          <Badge variant="gtpOrange">Orange</Badge>
        </div>

        <h3 className="mt-10 font-heading text-lg font-bold text-gtp-dark-teal">
          On dark conference bands
        </h3>
        <Separator className="my-4" />
        <SectionWrapper
          theme="gtp"
          background="dark"
          className="rounded-2xl py-10"
          scrollReveal={false}
        >
          <p className="mb-6 max-w-2xl text-sm text-white/85">
            Many GTP sections use a dark teal background. Buttons below are the
            same variants as above—check contrast when placing new copy here.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="gtpSecondary">Secondary on dark</Button>
            <Button variant="gtpCta">Orange CTA</Button>
            <Button variant="gtpOutline">Outline</Button>
          </div>
        </SectionWrapper>
      </SectionWrapper>

      <SectionWrapper
        id="gtp-pages"
        title="GTP pages in Sanity"
        subtitle="Routes & document types"
        theme="gtp"
        background="muted"
      >
        <p className="mb-6 max-w-3xl text-gray-600">
          The conference lives under{" "}
          <code className="rounded bg-white px-1">/events/gtp-2026/…</code>. The
          root <Link href="/events/gtp-2026">/events/gtp-2026</Link> redirects
          to <strong>About</strong>. In Studio, filter document types by
          “GTP” or the exact <code className="rounded bg-white px-1">_type</code>{" "}
          below.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="px-4 py-3 font-semibold text-gtp-dark-teal">
                  Route
                </th>
                <th className="px-4 py-3 font-semibold text-gtp-dark-teal">
                  Sanity type(s)
                </th>
                <th className="px-4 py-3 font-semibold text-gtp-dark-teal">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {gtpCmsPages.map((row) => (
                <tr
                  key={`${row.route}-${row.docTypes}`}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="px-4 py-3 align-top">
                    <Link
                      href={row.route}
                      className="font-medium text-gtp-teal hover:underline"
                    >
                      {row.route}
                    </Link>
                    <div className="text-xs text-gray-500">{row.title}</div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <code className="rounded bg-gtp-dark-teal/5 px-1.5 py-0.5 text-xs text-gtp-dark-teal">
                      {row.docTypes}
                    </code>
                  </td>
                  <td className="px-4 py-3 align-top text-gray-600">
                    {row.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          SCPH-style blocks (<strong>Stats row</strong>,{" "}
          <strong>Rich text</strong>, <strong>Prose + CTAs</strong>) can appear
          on the GTP About page under <strong>Extra sections</strong>—same
          block types as SCPH marketing pages.
        </p>
      </SectionWrapper>

      <SectionWrapper
        id="gtp-editing"
        title="How to edit GTP content"
        subtitle="Workflow & examples"
        theme="gtp"
        background="default"
      >
        <ol className="list-decimal space-y-4 pl-5 text-gray-700 max-w-3xl">
          <li>
            <strong>Find the right document</strong> — In Sanity, open the
            document type from the table above (e.g.{" "}
            <em>GTP 2026 About page</em> for most marketing on About).
          </li>
          <li>
            <strong>About page bands</strong> — Fields are grouped (Hero, What
            is GTP, Themes, Quotes, …). Expand each collapsible group. Many
            fields have inline descriptions—read them before changing
            structure.
          </li>
          <li>
            <strong>Programme</strong> — Editing days/sessions affects both the
            full programme page and carousel snippets. Publish once you are
            happy; preview on{" "}
            <Link
              href="/events/gtp-2026/programmes"
              className="text-gtp-teal hover:underline"
            >
              /programmes
            </Link>{" "}
            and About.
          </li>
          <li>
            <strong>Lists (FAQ, committee, speakers)</strong> — Each row is
            usually its own document. Use the order / sort fields in Studio
            rather than renaming IDs.
          </li>
          <li>
            <strong>Submissions page</strong> — Form labels, help text, and
            legal copy live in one large document. Avoid duplicate fields;
            contact devs if a new section is needed.
          </li>
        </ol>

        <div className="mt-10 space-y-8">
          <div>
            <h3 className="font-heading text-lg font-bold text-gtp-dark-teal">
              Example A — Update a highlight speaker
            </h3>
            <p className="mt-2 max-w-3xl text-sm text-gray-600">
              Open <strong>GTP 2026 Highlight Speaker</strong>, pick the person,
              edit name / role / bio / image, then <strong>Publish</strong>.
              The About page speaker strip updates after cache refresh (or
              immediately in dev).
            </p>
            <div className="mt-4 grid gap-6 md:grid-cols-2 md:items-stretch [&>*]:min-h-0">
              <HandbookScreenshotFigure
                src="/images/handbook/gtp-speaker-editor-photo.png"
                width={1024}
                height={532}
                alt="GTP highlight speaker document with photo, sessions, and date fields"
                caption="Speaker document: upload photo, set session date text, add extra sessions if needed—then Publish."
              />
              <HandbookScreenshotFigure
                src="/images/handbook/gtp-speaker-list-fields.png"
                width={1024}
                height={666}
                alt="GTP highlight speaker list in Studio and editor with sort order, name, role, organisation"
                caption="Left: all speakers with order and thumbnails. Right: sort order (lower = earlier), name, role, organisation."
              />
            </div>
          </div>

          <div>
            <h3 className="font-heading text-lg font-bold text-gtp-dark-teal">
              Example B — Add an FAQ entry
            </h3>
            <p className="mt-2 max-w-3xl text-sm text-gray-600">
              Open each <strong>GTP 2026 FAQ tab</strong> document: set the tab
              label and tab order, then edit the <strong>Questions (accordions)</strong>{" "}
              list (question, answer, sort order per row). Publish when done.
              For bullet lists in an answer, use new lines starting with{" "}
              <code className="rounded bg-gray-100 px-1">- </code> (dash + space)
              per item after a short intro line.
            </p>
            <div className="mt-4 max-w-4xl">
              <HandbookScreenshotFigure
                src="/images/handbook/gtp-faq-item-studio.png"
                width={1024}
                height={532}
                alt="Sanity Studio FAQ item with sort order, question, and answer fields"
                caption="FAQ content now lives on each tab document: use the embedded list for all Q&amp;As in that tab."
              />
            </div>
          </div>

          <div>
            <h3 className="font-heading text-lg font-bold text-gtp-dark-teal">
              Example C — Programme day with sessions
            </h3>
            <p className="mt-2 max-w-3xl text-sm text-gray-600">
              Open <strong>GTP 2026 Programme</strong> (singleton). Add or
              reorder days, then sessions/workshops inside a day. Complex
              relationships—when in doubt, duplicate an existing session as a
              template.
            </p>
            <div className="mt-4 grid gap-6 md:grid-cols-2 md:items-stretch [&>*]:min-h-0">
              <HandbookScreenshotFigure
                src="/images/handbook/gtp-programme-days-studio.png"
                width={1024}
                height={532}
                alt="GTP 2026 Programme document showing days list with session counts"
                caption="Programme singleton: Days / tabs list—reorder with handles, add days with + Add item."
              />
              <HandbookScreenshotFigure
                src="/images/handbook/gtp-programme-day-sessions-studio.png"
                width={1024}
                height={533}
                alt="GTP programme day editor showing short label and nested sessions list"
                caption="Inside a day: short label (e.g. for carousel) and sessions—each session can be opened for time, title, and type."
              />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button variant="gtp" asChild>
            <Link href="/events/gtp-2026/about">
              Open GTP About <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="gtpOutline" asChild>
            <a
              href="https://www.sanity.io/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sanity docs (general)
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </SectionWrapper>

    </>
  );
}
