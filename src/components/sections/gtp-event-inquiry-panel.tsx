import type { ReactNode } from "react";

/** Shared card chrome for GTP “event inquiry” blocks (about + SCPH home). */
export function GtpEventInquiryPanel({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-gray-100 bg-gray-50/80 p-6 shadow-sm md:p-8">
      {children}
    </div>
  );
}
