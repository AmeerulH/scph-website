import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ExternalLink,
  Image as ImageIcon,
  Layers,
  ListOrdered,
  Palette,
  PenLine,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { TeamHandbookGtpSections } from "./team-handbook-gtp";
import { HandbookScreenshotFigure } from "./team-handbook-shared";

const STUDIO_FOLDER = "studio";
const SANITY_PROJECT_ID = "y0tkemxm";

const cmsPages = [
  {
    route: "/",
    docType: "scphHomePage",
    title: "Home",
    notes:
      "Hero, highlighted events, stats, intro sections (blocks), roadmap + NPHAP (prose+CTA), partners band.",
  },
  {
    route: "/about-us",
    docType: "scphAboutPage",
    title: "About Us",
    notes:
      "Foundation (copy + 2 images), strategy cards, journey placeholder; optional extra section blocks after journey.",
  },
  {
    route: "/research",
    docType: "scphResearchPage",
    title: "Research",
    notes:
      "Stats row, roadmap prose+CTA, seven pillars; optional extra blocks after pillars.",
  },
  {
    route: "/media",
    docType: "scphMediaPage",
    title: "Media",
    notes:
      "Hero copy, article cards (title, tag, link, body), view-all link + note; optional blocks before the grid.",
  },
  {
    route: "/network",
    docType: "scphNetworkPage",
    title: "Network / Community",
    notes:
      "Community two-column copy + benefits list; optional blocks before signup form.",
  },
  {
    route: "/events",
    docType: "scphEventsPage",
    title: "Events",
    notes: "Page title/subtitle + optional intro section blocks.",
  },
  {
    route: "/programmes",
    docType: "scphProgrammesPage",
    title: "Programmes",
    notes: "Placeholder title/description or full section blocks when populated.",
  },
  {
    route: "/projects",
    docType: "scphProjectsPage",
    title: "Projects",
    notes: "Same pattern as Programmes.",
  },
  {
    route: "/about-us#team",
    docType: "scphMeetTheTeamPage",
    title: "Meet the Team (chrome)",
    notes:
      "Section title, subtitle, intro blurb, optional “Get involved” CTA. Team members are separate Team member documents.",
  },
  {
    route: "/",
    docType: "scphFooter",
    title: "SCPH site footer (global)",
    notes:
      "Singleton `scphFooter` (fixed id). Tagline, logo, three link columns, contact + career block, social links (preset icons), copyright, “Part of” + bottom logo. Shown on every SCPH marketing page.",
  },
] as const;

const sectionBlocks = [
  {
    name: "Stats row",
    type: "sectionStatsRow",
    summary:
      "A row of numeric highlights (value + label). Optional variants (e.g. light green on Research).",
  },
  {
    name: "Rich text",
    type: "sectionRichText",
    summary: "Eyebrow, heading, and body text in a simple band.",
  },
  {
    name: "Prose + CTAs",
    type: "sectionProseCta",
    summary:
      "Title, subtitle, multi-paragraph body (blank lines = new paragraph), and buttons. Used for roadmap-style bands on Home and Research.",
  },
] as const;

function JumpNav() {
  const links = [
    { href: "#design-system", label: "SCPH design", icon: Palette },
    { href: "#gtp-design-system", label: "GTP design", icon: Sparkles },
    { href: "#cms-basics", label: "Editing CMS", icon: BookOpen },
    { href: "#page-inventory", label: "SCPH pages", icon: Layers },
    { href: "#section-blocks", label: "Section blocks", icon: ListOrdered },
    { href: "#gtp-pages", label: "GTP pages", icon: CalendarDays },
    { href: "#gtp-editing", label: "Editing GTP", icon: PenLine },
    { href: "#handbook-screenshots", label: "Screenshots", icon: ImageIcon },
  ];
  return (
    <nav
      className="flex flex-wrap gap-2 rounded-2xl border border-scph-blue/15 bg-scph-blue/[0.04] p-4"
      aria-label="On this page"
    >
      {links.map(({ href, label, icon: Icon }) => (
        <Button key={href} variant="scphOutline" size="sm" asChild>
          <a href={href} className="inline-flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {label}
          </a>
        </Button>
      ))}
    </nav>
  );
}

export function TeamHandbookContent() {
  return (
    <>
      <SectionWrapper theme="scph" background="muted" className="pt-28 pb-10">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="scphGreen" className="mb-4">
            Internal · not in site menu
          </Badge>
          <h1 className="font-heading text-3xl font-bold text-scph-blue md:text-4xl">
            Content team handbook
          </h1>
          <p className="mt-2 text-sm font-medium text-gtp-dark-teal">
            SCPH marketing site + GTP 2026 conference
          </p>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            Design system samples and Sanity editing notes for both brands.
            Bookmark this URL—there is no navigation link. This page uses{" "}
            <code className="rounded bg-white/80 px-1.5 py-0.5 text-sm">
              noindex
            </code>{" "}
            for search engines; it is not password-protected, so only share
            with people who should edit content.
          </p>
          <p className="mt-3 text-sm text-gray-500">
            Path:{" "}
            <code className="rounded bg-white/80 px-1.5 py-0.5">
              /scph-team-handbook
            </code>
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-4xl">
          <JumpNav />
        </div>
      </SectionWrapper>

      <SectionWrapper
        id="design-system"
        title="Design system (SCPH)"
        subtitle="UI building blocks"
        theme="scph"
        background="default"
      >
        <p className="mb-8 max-w-3xl text-gray-600">
          These are the same primitives used across marketing pages. Prefer
          existing variants before inventing new styles.
        </p>

        <h3 className="font-heading text-lg font-bold text-scph-blue">
          Buttons
        </h3>
        <Separator className="my-4" />
        <div className="flex flex-wrap gap-3">
          <Button variant="scph">Primary (scph)</Button>
          <Button variant="scphSecondary">Secondary (green)</Button>
          <Button variant="scphOutline">Outline</Button>
          <Button variant="outline">Neutral outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>

        <h3 className="mt-10 font-heading text-lg font-bold text-scph-blue">
          Badges
        </h3>
        <Separator className="my-4" />
        <div className="flex flex-wrap gap-2">
          <Badge variant="scph">SCPH blue</Badge>
          <Badge variant="scphGreen">SCPH green</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>

        <h3 className="mt-10 font-heading text-lg font-bold text-scph-blue">
          Cards
        </h3>
        <Separator className="my-4" />
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Card title</CardTitle>
              <CardDescription>
                Cards use rounded corners, light border, and hover lift—good
                for dense reference content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="scph" size="sm" asChild>
                <Link href="/">
                  Example link <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Brand colours</CardTitle>
              <CardDescription>
                SCPH uses{" "}
                <code className="text-xs">scph-blue</code>,{" "}
                <code className="text-xs">scph-green</code>, and supporting
                neutrals (see Tailwind theme).
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <span className="h-10 flex-1 rounded-lg bg-scph-blue" />
              <span className="h-10 flex-1 rounded-lg bg-scph-green" />
              <span className="h-10 flex-1 rounded-lg bg-scph-dark-green" />
            </CardContent>
          </Card>
        </div>
      </SectionWrapper>

      <SectionWrapper
        id="cms-basics"
        title="Editing Sanity content"
        subtitle="CMS tutorial"
        theme="scph"
        background="muted"
      >
        <div className="max-w-3xl">
          <ol className="list-decimal space-y-4 pl-5 text-gray-700">
            <li>
              <strong>Open Sanity Studio</strong> from the{" "}
              <code>{STUDIO_FOLDER}</code> package (e.g. run the dev script
              documented in the repo README). Sign in with the account your team
              admin invited.
            </li>
            <li>
              <strong>Dataset</strong> — the live site reads from the dataset
              configured for production (often <code>production</code>). Confirm
              with devs before editing a non-production dataset.
            </li>
            <li>
              <strong>Drafts vs published</strong> — changes usually need to be{" "}
              <strong>Published</strong> in Studio before visitors see them. If
              something looks missing on the site, check for unpublished drafts.
            </li>
            <li>
              <strong>Singletons</strong> — many SCPH and GTP pages use one main
              document per type (e.g. <code>scphHomePage</code>,{" "}
              <code>gtp2026AboutPage</code>, <code>gtp2026Programme</code>). Edit
              that document; do not create a second copy unless a developer
              asks. Lists (FAQ, committee, speakers) use many documents instead.
            </li>
            <li>
              <strong>Images</strong> — upload through Studio image fields where
              available (e.g. About foundation diagrams). The site serves them
              from Sanity’s CDN.
            </li>
            <li>
              <strong>Help</strong> — for schema questions (field labels,
              validation), ask the development team or refer to field
              descriptions inside Studio.
            </li>
          </ol>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="scph" asChild>
            <a
              href={`https://www.sanity.io/manage/project/${SANITY_PROJECT_ID}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Sanity project (manage)
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              Open live home <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          Project ID (for support):{" "}
          <code className="rounded bg-white/80 px-1 py-0.5">
            {SANITY_PROJECT_ID}
          </code>
        </p>
      </SectionWrapper>

      <SectionWrapper
        id="page-inventory"
        title="Pages in the CMS"
        subtitle="Route ↔ document type"
        theme="scph"
        background="default"
      >
        <p className="mb-6 max-w-3xl text-gray-600">
          SCPH site routes and their primary Sanity documents. For{" "}
          <strong>GTP 2026</strong> (conference), use the dedicated table in{" "}
          <a href="#gtp-pages" className="font-medium text-scph-blue hover:underline">
            GTP pages in Sanity
          </a>{" "}
          below.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="px-4 py-3 font-semibold text-scph-blue">Route</th>
                <th className="px-4 py-3 font-semibold text-scph-blue">
                  Document <code className="font-mono text-xs">_type</code>
                </th>
                <th className="px-4 py-3 font-semibold text-scph-blue">
                  What editors change
                </th>
              </tr>
            </thead>
            <tbody>
              {cmsPages.map((row) => (
                <tr
                  key={row.docType}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="px-4 py-3 align-top">
                    <Link
                      href={row.route.split("#")[0]}
                      className="font-medium text-scph-blue hover:underline"
                    >
                      {row.route}
                    </Link>
                    <div className="text-xs text-gray-500">{row.title}</div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <code className="rounded bg-scph-blue/5 px-1.5 py-0.5 text-xs">
                      {row.docType}
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
      </SectionWrapper>

      <SectionWrapper
        id="section-blocks"
        title="Optional section blocks"
        subtitle="Reusable bands"
        theme="scph"
        background="muted"
      >
        <p className="mb-6 max-w-3xl text-gray-600">
          Several pages include an <strong>Additional sections</strong> (or
          similar) array in Studio. You can add, remove, or reorder these
          blocks. Not every page exposes the same slots—check the table above.
        </p>
        <div className="grid gap-4 md:grid-cols-1">
          {sectionBlocks.map((b) => (
            <Card key={b.type}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  {b.name}
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {b.type}
                  </Badge>
                </CardTitle>
                <CardDescription>{b.summary}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        <p className="mt-6 text-sm text-gray-600">
          <strong>Tip:</strong> In <strong>Prose + CTAs</strong>, separate
          paragraphs with a blank line in the body field. Use the visibility /
          enabled toggles on blocks when you need to hide something without
          deleting it.
        </p>
      </SectionWrapper>

      <TeamHandbookGtpSections />

      <SectionWrapper
        id="handbook-screenshots"
        title="Screenshot library (optional)"
        subtitle="Help teammates with visuals"
        theme="scph"
        background="muted"
      >
        <p className="mb-6 max-w-3xl text-gray-600">
          Written steps above are enough for many editors; pictures make them
          faster. If you can share a few annotated screenshots, we can embed
          them here (ask a developer). Suggested exports: PNG or WebP, ~1200px
          wide, named like{" "}
          <code className="rounded bg-white px-1 text-xs">
            scph-publish.png
          </code>{" "}
          or{" "}
          <code className="rounded bg-white px-1 text-xs">
            gtp-programme-day.png
          </code>
          .
        </p>
        <div className="grid max-w-4xl gap-8 md:grid-cols-2 md:items-stretch [&>*]:min-h-0">
          <HandbookScreenshotFigure
            src="/images/handbook/scph-home-page-studio.png"
            width={1024}
            height={533}
            alt="Sanity Studio showing SCPH Home page with internal title, hero headline fields, and Publish"
            caption="SCPH Home (`scphHomePage`): open the single Home document, edit fields such as headline lines, then use Publish when ready."
          />
          <HandbookScreenshotFigure
            src="/images/handbook/scph-media-article-studio.png"
            width={1024}
            height={533}
            alt="Sanity Studio showing SCPH Media page with an article item open: title, tag, link URL, body"
            caption="SCPH Media (`scphMediaPage`): each card is one article—title, tag/badge, optional link, and body text shown on the site."
          />
        </div>
        <p className="mt-8 text-sm text-gray-600">
          <strong>GTP 2026</strong> examples (speakers, FAQ, programme) are in the
          sections below with their own screenshots.
        </p>
      </SectionWrapper>

      <SectionWrapper theme="scph" background="default" className="pb-20">
        <p className="text-center text-sm text-gray-500">
          Internal handbook ·{" "}
          <Link href="/" className="text-scph-blue hover:underline">
            Back to home
          </Link>
        </p>
      </SectionWrapper>
    </>
  );
}
