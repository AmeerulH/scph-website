import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ScphPageHero } from "@/components/sections/heroes";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { JournalistWorkshopsDriveTree } from "@/components/scph/journalist-workshops/journalist-workshops-drive-tree";
import { JournalistWorkshopsUnlockForm } from "@/components/scph/journalist-workshops/journalist-workshops-unlock-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SCPH_JOURNALIST_WORKSHOPS_PLACEHOLDER_DESCRIPTION } from "@/data/scph-placeholder-pages-defaults";
import {
  driveWalkFolderTree,
  getDriveReadonlyClient,
  type DriveListedRow,
} from "@/lib/google-drive-client";
import {
  JOURNALIST_WORKSHOP_SESSION_COOKIE,
  verifyJournalistWorkshopSession,
} from "@/lib/journalist-workshop-session";
import { getScphJournalistWorkshopsPage } from "@/sanity/scph-journalist-workshops";

const DRIVE_TREE_MAX_DEPTH = 14;

export const dynamic = "force-dynamic";

function stripForMeta(s: string, max = 158): string {
  const t = s.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getScphJournalistWorkshopsPage().catch(() => null);
  const pageTitle = data?.pageTitle?.trim() || "Journalist workshops";
  const intro = data?.intro?.trim();
  const description = intro
    ? stripForMeta(intro)
    : stripForMeta(SCPH_JOURNALIST_WORKSHOPS_PLACEHOLDER_DESCRIPTION);

  return {
    title: pageTitle,
    description,
    alternates: { canonical: "/network/journalist-workshops" },
    openGraph: {
      title: `${pageTitle} | Sunway Centre for Planetary Health`,
      description,
      url: "/network/journalist-workshops",
    },
  };
}

type PublicWorkshop = { key: string; title: string };

export default async function JournalistWorkshopsPage() {
  const data = await getScphJournalistWorkshopsPage().catch(() => null);
  const pageTitle = data?.pageTitle?.trim() || "Journalist workshops";
  const intro =
    data?.intro?.trim() || SCPH_JOURNALIST_WORKSHOPS_PLACEHOLDER_DESCRIPTION;

  const workshopsPublic: PublicWorkshop[] = (data?.workshops ?? [])
    .filter((w) => w.enabled !== false && w.title?.trim())
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((w, i) => ({
      key: w.slug?.current?.trim() || `workshop-${i}`,
      title: w.title!.trim(),
    }));

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(JOURNALIST_WORKSHOP_SESSION_COOKIE)?.value;
  const secret = process.env.JOURNALIST_WORKSHOP_SESSION_SECRET?.trim();
  const session =
    sessionToken && secret && secret.length >= 16
      ? verifyJournalistWorkshopSession(sessionToken, secret)
      : null;

  const unlockedLabel =
    session &&
    (data?.workshops ?? []).find((w) => w.slug?.current === session.slug)?.title?.trim();

  let driveTree: Awaited<ReturnType<typeof driveWalkFolderTree>> | null = null;
  let driveLoadFailed = false;

  if (session) {
    try {
      const drive = getDriveReadonlyClient();
      const filesFlat: DriveListedRow[] = [];
      driveTree = await driveWalkFolderTree(
        drive,
        session.driveFolderId,
        "Workshop materials",
        "",
        0,
        DRIVE_TREE_MAX_DEPTH,
        filesFlat,
      );
    } catch {
      driveLoadFailed = true;
    }
  }

  return (
    <>
      <ScphPageHero
        eyebrow="Network · Community"
        title={pageTitle}
        lede={intro}
      />

      <SectionWrapper
        theme="scph"
        background="muted"
        title={session ? "Your workshop materials" : "Access"}
        subtitle={
          session
            ? undefined
            : "Enter the access code you received to open your workshop folder in the browser."
        }
        contentClassName={session ? "max-w-6xl" : "max-w-3xl"}
      >
        {session ? (
          <div>
            {driveLoadFailed ? (
              <Card className="border-destructive/30 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-destructive">Could not load files</CardTitle>
                  <CardDescription>
                    Google Drive did not respond or the service account cannot read this folder.
                    Try again in a moment, or contact the SCPH team if this keeps happening.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : driveTree ? (
              <JournalistWorkshopsDriveTree
                root={driveTree}
                workshopTitle={unlockedLabel || "Workshop Materials"}
              />
            ) : null}
          </div>
        ) : (
          <div className="space-y-8">
            {workshopsPublic.length > 0 ? (
              <div>
                <p className="text-sm font-medium text-scph-dark-green">
                  Workshops on this page (each uses its own code):
                </p>
                <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
                  {workshopsPublic.map((w) => (
                    <li key={w.key}>{w.title}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="font-heading text-xl text-scph-blue">
                  Unlock with your code
                </CardTitle>
                <CardDescription>
                  Codes are not your Sunway login — use the workshop code you were given.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <JournalistWorkshopsUnlockForm />
              </CardContent>
            </Card>
          </div>
        )}
      </SectionWrapper>
    </>
  );
}
