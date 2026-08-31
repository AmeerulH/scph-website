import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/mpn/auth/login-form";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function MpnLoginPage() {
  return (
    <section className="mx-auto max-w-md px-5 py-16">
      <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h1 className="font-heading text-3xl font-semibold text-[#0d1f3c]">Welcome back</h1>
        <p className="mt-2 text-slate-600">Sign in to access your MPN membership.</p>
        <div className="mt-7"><LoginForm /></div>
        <p className="mt-5 text-center text-sm text-slate-600">
          New to MPN? <Link className="font-semibold text-scph-blue hover:underline" href="/community/mpn/register">Register for membership</Link>
        </p>
      </div>
    </section>
  );
}
