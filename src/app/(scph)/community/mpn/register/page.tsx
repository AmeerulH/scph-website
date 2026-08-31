import type { Metadata } from "next";
import { RegisterForm } from "@/components/mpn/auth/register-form";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function MpnRegisterPage() {
  return (
    <section className="mx-auto max-w-xl px-5 py-16">
      <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h1 className="font-heading text-3xl font-semibold text-[#0d1f3c]">Join MPN</h1>
        <p className="mt-2 text-slate-600">
          Membership is for SCPH Capacity Development Workshop participants and is reviewed by our team.
        </p>
        <div className="mt-7"><RegisterForm /></div>
      </div>
    </section>
  );
}
