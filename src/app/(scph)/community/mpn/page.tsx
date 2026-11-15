import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusToast } from "@/components/mpn/ui/status-toast";
import { getAuthenticatedMpnProfile } from "@/lib/mpn/auth";

export default async function MpnPage({
  searchParams,
}: {
  searchParams: Promise<{ signedIn?: string }>;
}) {
  const [profile, { signedIn }] = await Promise.all([
    getAuthenticatedMpnProfile(),
    searchParams,
  ]);

  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
      {signedIn === "1" && profile ? (
        <StatusToast message={`You are signed in as ${profile.full_name}.`} />
      ) : null}
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#50B58B]">
          Sunway Centre for Planetary Health
        </p>
        <h1 className="mt-5 font-heading text-4xl font-bold tracking-tight text-[#0d1f3c] sm:text-6xl">
          Media Professional Network
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          A trusted space for journalists who have participated in SCPH capacity development workshops.
        </p>
        {profile ? (
          <div className="mt-9 rounded-xl border border-scph-green/30 bg-scph-green/10 px-5 py-4">
            <p className="font-semibold text-[#0d1f3c]">
              {profile.role === "pending"
                ? "Your membership is awaiting approval."
                : `You are signed in as ${profile.full_name}.`}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {profile.role === "pending"
                ? "You can download shared resources once they are published. Café participation opens after approval."
                : "Your member workspace is being prepared."}
            </p>
          </div>
        ) : (
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild variant="scph">
              <Link href="/community/mpn/register">Join the network</Link>
            </Button>
            <Button asChild variant="scphOutline">
              <Link href="/community/mpn/login">Sign in</Link>
            </Button>
          </div>
        )}
      </div>
      <div className="mt-16 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="font-heading text-xl font-semibold text-[#0d1f3c]">
          The portal is being prepared
        </h2>
        <p className="mt-2 text-slate-600">
          Registration and member approval are now available. Resources, expert profiles, publications, and the Virtual Café will follow.
        </p>
      </div>
    </section>
  );
}
