import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GTP_2026_REGISTRATION_URL } from "@/lib/gtp-registration-url";
import { cn } from "@/lib/utils";

export type GtpLimitedAvailabilityBannerVariant = "campaign" | "priority";
export type GtpLimitedAvailabilityBannerLayout =
  | "panel"
  | "rail"
  | "inline"
  | "programme";

/**
 * A time-sensitive registration prompt for the GTP conversion pages.
 *
 * Switch `variant` to `priority` to compare the quieter dark-teal treatment
 * with the campaign-orange treatment used on the site.
 */
export function GtpLimitedAvailabilityBanner({
  variant = "campaign",
  layout = "rail",
  className,
}: {
  variant?: GtpLimitedAvailabilityBannerVariant;
  layout?: GtpLimitedAvailabilityBannerLayout;
  className?: string;
}) {
  const isCampaign = variant === "campaign";
  const isRail = layout === "rail";
  const isInline = layout === "inline";
  const isProgramme = layout === "programme";

  return (
    <section
      aria-labelledby="gtp-limited-availability-title"
      className={cn(
        "relative isolate overflow-hidden px-5 py-6 sm:px-7 sm:py-7",
        isInline && "px-5 py-5 sm:px-6 lg:px-4 lg:py-3",
        isCampaign
          ? "bg-gtp-orange text-gtp-dark-teal"
          : "bg-gtp-dark-teal text-white",
        isProgramme &&
          (isCampaign
            ? "border-y border-gtp-orange-dark/40 bg-gtp-orange px-4 py-4 text-gtp-dark-teal sm:px-6"
            : "border-y border-white/10 bg-gtp-dark-teal px-4 py-4 text-white sm:px-6"),
        className,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -right-10 top-1/2 size-36 -translate-y-1/2 rounded-full",
          isCampaign ? "bg-white/10" : "bg-gtp-teal/20",
          isProgramme && "hidden",
        )}
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative flex h-full flex-col justify-between gap-5",
          isRail && "lg:flex-row lg:items-center lg:gap-10",
          isInline && "lg:gap-3",
          isInline && "xl:flex-row xl:items-center xl:justify-between xl:gap-4",
          isProgramme && "mx-auto max-w-7xl gap-4 sm:flex-row sm:items-center sm:justify-between",
        )}
      >
        <div
          className={cn(
            isRail && "lg:flex lg:items-center lg:gap-7",
            isProgramme && "flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-5",
          )}
        >
          <p
            className={cn(
              "flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em]",
              isCampaign ? "text-gtp-dark-teal/80" : "text-white/65",
              isProgramme && (isCampaign ? "shrink-0 text-gtp-dark-teal/75" : "shrink-0 text-gtp-teal"),
            )}
          >
            <span className="relative flex size-2.5 shrink-0" aria-hidden="true">
              <span className="absolute inset-0 rounded-full bg-gtp-green/70 motion-safe:animate-ping motion-reduce:hidden" />
              <span className="relative size-2.5 rounded-full bg-gtp-green ring-2 ring-white/35" />
            </span>
            Registration update
          </p>
          <div>
            <h2
              id="gtp-limited-availability-title"
              className={cn(
                "mt-3 max-w-[18ch] text-balance font-heading text-2xl font-bold leading-[1.05] sm:text-3xl",
                isRail && "lg:mt-0 lg:max-w-none",
                isInline && "mt-1 text-xl sm:text-2xl lg:text-lg",
                isProgramme &&
                  (isCampaign
                    ? "mt-0 max-w-none text-lg text-gtp-dark-teal sm:text-xl"
                    : "mt-0 max-w-none text-lg text-white sm:text-xl"),
              )}
            >
              Limited seats left
            </h2>
            <p
              className={cn(
                "mt-3 max-w-[32ch] text-sm leading-relaxed",
                isCampaign ? "text-gtp-dark-teal/80" : "text-white/75",
                isRail && "lg:mt-1 lg:max-w-[42ch]",
                isInline && "hidden",
                isProgramme && "hidden",
              )}
            >
              Join the global community in Kuala Lumpur this October.
            </p>
          </div>
        </div>
        <Button
          variant={isProgramme ? (isCampaign ? "gtp" : "gtpCta") : isCampaign ? "gtp" : "gtpCta"}
          size="default"
          className={cn(
            "w-full justify-between shadow-none hover:shadow-none",
            !isInline && "sm:w-fit lg:shrink-0",
            isInline && "xl:w-auto xl:min-w-40 xl:shrink-0",
            isProgramme && "sm:w-auto sm:shrink-0",
          )}
          asChild
        >
          <a
            href={GTP_2026_REGISTRATION_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {isInline || isProgramme ? "Register now" : "Secure your place"}{" "}
            <ArrowRight aria-hidden="true" />
          </a>
        </Button>
      </div>
    </section>
  );
}
