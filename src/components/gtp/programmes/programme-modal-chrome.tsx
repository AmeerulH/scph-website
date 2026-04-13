"use client";

import * as React from "react";
import Image from "next/image";
import {
  Copy,
  Check,
  Linkedin,
  Facebook,
  Twitter,
  Mail,
} from "lucide-react";
import { GTP_2026_REGISTRATION_URL } from "@/lib/gtp-registration-url";
import type { GtpSessionModalHostedBy } from "@/sanity/queries";
import { cn } from "@/lib/utils";

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function hostedLogoDisplayDimensions(hostedBy: GtpSessionModalHostedBy): {
  width: number;
  height: number;
} {
  const max = 96;
  const w =
    hostedBy.logoWidth && hostedBy.logoWidth > 0 ? hostedBy.logoWidth : 48;
  const h =
    hostedBy.logoHeight && hostedBy.logoHeight > 0 ? hostedBy.logoHeight : 48;
  const scale = Math.min(1, max / Math.max(w, h));
  return {
    width: Math.max(1, Math.round(w * scale)),
    height: Math.max(1, Math.round(h * scale)),
  };
}

/** “Hosted by” block — shared by main session modal and parallel workshop modal. */
export function ProgrammeModalHostedByBlock({
  hostedBy,
}: {
  hostedBy: GtpSessionModalHostedBy;
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-gray-700">
        {hostedBy.sectionTitle}
      </p>
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
          {hostedBy.logoUrl ? (
            <Image
              src={hostedBy.logoUrl}
              alt={hostedBy.logoAlt}
              {...hostedLogoDisplayDimensions(hostedBy)}
              className="max-h-12 max-w-12 object-contain"
              unoptimized={hostedBy.logoUrl.toLowerCase().includes(".svg")}
            />
          ) : (
            <span className="text-xs font-bold text-gtp-dark-teal">SCPH</span>
          )}
        </div>
        <div className="text-xs leading-relaxed text-gray-500">
          <p className="font-semibold text-gray-700">{hostedBy.name}</p>
          <p>{hostedBy.subtitle}</p>
        </div>
      </div>
    </div>
  );
}

const SHARE_FALLBACK_URL =
  "https://scph.sunway.edu.my/events/gtp-2026/programmes";

/** Share row, copy link, registration note, and CTA — shared across programme modals. */
export function ProgrammeModalShareRegisterColumn({
  shareTitle,
}: {
  shareTitle: string;
}) {
  const [copied, setCopied] = React.useState(false);

  function handleCopyLink() {
    const url =
      typeof window !== "undefined" ? window.location.href : SHARE_FALLBACK_URL;
    void navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const pageUrl =
    typeof window !== "undefined" ? window.location.href : SHARE_FALLBACK_URL;
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(shareTitle);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-3 text-sm font-semibold text-gray-700">Share:</p>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0077B5] text-white transition-opacity hover:opacity-90"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1877F2] text-white transition-opacity hover:opacity-90"
            aria-label="Share on Facebook"
          >
            <Facebook className="h-4 w-4" />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-opacity hover:opacity-90"
            aria-label="Share on X"
          >
            <Twitter className="h-4 w-4" />
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${pageUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white transition-opacity hover:opacity-90"
            aria-label="Share on WhatsApp"
          >
            <WhatsAppIcon className="h-4 w-4" />
          </a>
          <a
            href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-500 text-white transition-opacity hover:opacity-90"
            aria-label="Share via email"
          >
            <Mail className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="min-w-0 flex-1 truncate rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500">
            {pageUrl}
          </div>
          <button
            type="button"
            onClick={handleCopyLink}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
              copied
                ? "bg-gtp-green text-white"
                : "bg-gtp-teal text-white hover:bg-gtp-teal-dark",
            )}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy Link
              </>
            )}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gtp-teal/20 bg-gtp-teal/5 px-4 py-3">
        <p className="text-xs leading-relaxed text-gtp-dark-teal/80">
          <span className="font-semibold">Please note:</span> As space is
          limited, in-person attendance at certain sessions is subject to
          confirmation. We warmly encourage early registration, and we will do
          our best to accommodate everyone.
        </p>
      </div>

      <a
        href={GTP_2026_REGISTRATION_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-full bg-gtp-orange py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-gtp-orange-dark"
      >
        Register to Join
        <span aria-hidden>→</span>
      </a>
    </div>
  );
}
