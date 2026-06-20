import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const GTP_SPEAKERS_PAGE_HREF = "/events/gtp-2026/speakers";

export function GtpViewAllSpeakersCta({
  theme = "gtp",
  label = "View all speakers",
}: {
  theme?: "scph" | "gtp";
  label?: string;
}) {
  return (
    <div className="mt-10 flex justify-center">
      <Button
        variant={theme === "scph" ? "scph" : "gtp"}
        size="lg"
        asChild
      >
        <Link href={GTP_SPEAKERS_PAGE_HREF}>
          {label}
          <ArrowRight className="ml-2 inline h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
