"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/mpn/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: String(formData.get("email")),
      password: String(formData.get("password")),
    });

    if (signInError || !data.user) {
      setError(signInError?.message ?? "Unable to sign in.");
      setIsSubmitting(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    const next = searchParams.get("next");
    const safeNext = next?.startsWith("/community/mpn") ? next : null;

    if (profile?.role === "pending") {
      router.replace("/community/mpn/pending");
    } else if (profile?.role === "rejected") {
      setError("Your membership application was not approved. Please contact SCPH for support.");
      await supabase.auth.signOut();
      setIsSubmitting(false);
    } else {
      router.replace(safeNext ?? "/community/mpn?signedIn=1");
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <label className="block text-sm font-medium text-slate-700">
        Email address
        <input className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5" name="email" type="email" autoComplete="email" required />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Password
        <input className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5" name="password" type="password" autoComplete="current-password" required />
      </label>
      {error ? <p className="text-sm text-red-700" role="alert">{error}</p> : null}
      <Button className="w-full" type="submit" variant="scph" disabled={isSubmitting}>
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
