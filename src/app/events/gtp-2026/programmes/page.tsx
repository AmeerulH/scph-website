import { Suspense } from "react";
import { ProgrammesHero } from "@/components/gtp/programmes/programmes-hero";
import { ProgrammesPageClient } from "./programmes-page-client";

/** Keeps the dark hero band visually continuous if the client shell is still loading. */
function ProgrammeClientFallback() {
  return (
    <div
      className="min-h-[120px] bg-gtp-dark-teal"
      aria-busy
      aria-label="Loading programme"
    />
  );
}

export default function ProgrammesPage() {
  return (
    <>
      <ProgrammesHero />
      <Suspense fallback={<ProgrammeClientFallback />}>
        <ProgrammesPageClient />
      </Suspense>
    </>
  );
}
