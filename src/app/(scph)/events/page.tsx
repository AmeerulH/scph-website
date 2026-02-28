import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";
import { PlaceholderPage } from "@/components/shared/placeholder-page";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionWrapper } from "@/components/shared/section-wrapper";

export default function EventsPage() {
  return (
    <>
      {/* Hero spacer for floating navbar */}
      <div className="pt-24" />
      <SectionWrapper title="Events" subtitle="What's On" theme="scph">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="overflow-hidden">
            <CardHeader>
              <Badge variant="gtpOrange" className="w-fit">Upcoming 2026</Badge>
              <CardTitle className="font-heading text-2xl text-gtp-dark-teal">
                Global Tipping Points 2026
              </CardTitle>
              <CardDescription>Kuala Lumpur, Malaysia</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                A landmark international conference on tipping points, bringing
                together science, finance, culture and policy to accelerate
                positive change.
              </p>
              <Button variant="gtpCta" size="sm" className="mt-5" asChild>
                <Link href="/events/gtp-2026">
                  Learn More <ArrowRight />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader>
              <Badge variant="scphGreen" className="w-fit">Past Event</Badge>
              <CardTitle className="font-heading text-2xl text-scph-blue">
                PHAM 2024
              </CardTitle>
              <CardDescription>Planetary Health Annual Meeting</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The Planetary Health Annual Meeting 2024 brought together
                researchers, policymakers and practitioners to advance planetary
                health agendas globally.
              </p>
              <Button variant="scphOutline" size="sm" className="mt-5" asChild>
                <a href="https://www.pham2024.com/" target="_blank" rel="noopener noreferrer">
                  Visit Website <ExternalLink />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </SectionWrapper>
    </>
  );
}
