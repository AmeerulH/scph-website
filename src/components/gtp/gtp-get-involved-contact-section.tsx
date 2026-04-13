import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone, Share2 } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { TwoColumnTextImages } from "@/components/sections/two-column-text-images";
import { ContactForm } from "@/app/events/gtp-2026/get-involved/contact-form";
import type { GtpGetInvolvedResolvedCopy } from "@/sanity/gtp-marketing-defaults";
import { cn } from "@/lib/utils";

function FaqOrExternalLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const internal = href.startsWith("/") && !href.startsWith("//");
  if (internal) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}

/** Plain column: icon + label + body (no card chrome). */
function ContactInfoItem({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof MapPin;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-gtp-teal" aria-hidden />
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gtp-dark-teal">
          {title}
        </span>
      </div>
      <div className="text-sm leading-relaxed text-gray-600">{children}</div>
    </div>
  );
}

export function GtpGetInvolvedContactSection({
  contact,
}: {
  contact: GtpGetInvolvedResolvedCopy["contact"];
}) {
  const hasFaq = Boolean(contact.faqLinkLabel && contact.faqHref);
  const linkClass =
    "font-semibold text-gtp-dark-teal underline decoration-gtp-teal/40 underline-offset-2 transition-colors hover:text-gtp-teal hover:decoration-gtp-teal";

  return (
    <SectionWrapper
      title={contact.sectionTitle}
      subtitle={contact.sectionSubtitle}
      theme="gtp"
      background="default"
      id="contact"
    >
      <>
        <TwoColumnTextImages
          align="start"
          gapClassName="gap-10 lg:gap-14"
          text={
            <div className="flex min-w-0 flex-col gap-8">
              <div>
                <p className="text-base leading-relaxed text-gray-600">
                  {contact.intro}
                  {hasFaq ? (
                    <>
                      {" "}
                      <FaqOrExternalLink
                        href={contact.faqHref}
                        className={linkClass}
                      >
                        {contact.faqLinkLabel}
                      </FaqOrExternalLink>
                    </>
                  ) : null}
                  {contact.introSuffix ? <> {contact.introSuffix}</> : null}
                </p>
                {contact.conferenceDates ? (
                  <p className="mt-3 text-sm text-gray-500">
                    {contact.conferenceDates}
                  </p>
                ) : null}
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 shadow-sm">
                <ContactForm />
              </div>
            </div>
          }
          media={
            contact.mapEmbedUrl ? (
              <div
                className={cn(
                  "w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-100 shadow-sm",
                  "aspect-4/3 min-h-50 sm:min-h-60",
                )}
              >
                <iframe
                  src={contact.mapEmbedUrl}
                  title={contact.mapIframeTitle}
                  className="h-full w-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : null
          }
        />

        <div
          className="mt-10 border-t border-gray-100 pt-10"
          aria-label="Contact details"
        >
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            <ContactInfoItem icon={MapPin} title={contact.addressLabel}>
              <p className="whitespace-pre-line">{contact.addressBody}</p>
            </ContactInfoItem>
            <ContactInfoItem icon={Clock} title={contact.hoursLabel}>
              <p className="whitespace-pre-line">{contact.hoursBody}</p>
            </ContactInfoItem>
            <ContactInfoItem icon={Phone} title={contact.phoneLabel}>
              {contact.phoneTel ? (
                <a
                  href={`tel:${contact.phoneTel.replace(/\s+/g, "")}`}
                  className="text-gray-600 transition-colors hover:text-gtp-dark-teal"
                >
                  {contact.phoneDisplay}
                </a>
              ) : (
                <span>{contact.phoneDisplay}</span>
              )}
            </ContactInfoItem>
            <ContactInfoItem icon={Mail} title={contact.emailLabel}>
              <a
                href={`mailto:${contact.email}`}
                className="wrap-break-word text-gray-600 transition-colors hover:text-gtp-dark-teal"
              >
                {contact.email}
              </a>
            </ContactInfoItem>
          </div>

          {contact.socialLinks.length > 0 ? (
            <div className="mt-10 border-t border-gray-100 pt-10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                <div className="flex shrink-0 items-center gap-2">
                  <Share2
                    className="h-4 w-4 shrink-0 text-gtp-teal"
                    aria-hidden
                  />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gtp-dark-teal">
                    {contact.socialHeading}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                  {contact.socialLinks.map(({ label, href, iconSrc }) => (
                    <a
                      key={`${label}-${href}`}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${label} (opens in a new tab)`}
                      className="transition-opacity hover:opacity-70"
                    >
                      <Image
                        src={iconSrc}
                        alt=""
                        width={22}
                        height={22}
                        className="h-5.5 w-5.5 object-contain brightness-0 opacity-80"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </>
    </SectionWrapper>
  );
}
