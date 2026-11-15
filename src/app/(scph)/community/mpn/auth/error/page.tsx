import Link from "next/link";

export default async function MpnAuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <section className="mx-auto max-w-xl px-5 py-20">
      <div className="rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
        <h1 className="font-heading text-3xl font-semibold text-[#0d1f3c]">We could not verify your email</h1>
        <p className="mt-4 text-slate-600">
          {message ?? "The link may have expired or already been used. Please request a new verification email."}
        </p>
        <Link className="mt-6 inline-block font-semibold text-scph-blue hover:underline" href="/community/mpn/login">
          Return to sign in
        </Link>
      </div>
    </section>
  );
}
