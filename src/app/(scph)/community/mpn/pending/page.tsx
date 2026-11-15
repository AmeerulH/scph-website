import type { Metadata } from "next";
import { StatusToast } from "@/components/mpn/ui/status-toast";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function MpnPendingPage({
  searchParams,
}: {
  searchParams: Promise<{ verified?: string }>;
}) {
  const { verified } = await searchParams;

  return (
    <section className="mx-auto max-w-xl px-5 py-20 text-center">
      {verified === "1" ? (
        <StatusToast message="Email verified. You are signed in and your membership is awaiting approval." />
      ) : null}
      <div className="rounded-2xl border border-[#50B58B]/30 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#50B58B]">
          Registration complete
        </p>
        <h1 className="mt-4 font-heading text-3xl font-semibold text-[#0d1f3c]">
          Your membership is awaiting approval
        </h1>
        <p className="mt-4 leading-7 text-slate-600">
          Our team will verify your workshop attendance and contact you once your membership is approved.
        </p>
      </div>
    </section>
  );
}
