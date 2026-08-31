"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/mpn/supabase/client";

type Workshop = {
  id: string;
  number: number;
  title: string;
};

export function RegisterForm() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    void supabase
      .from("workshops")
      .select("id, number, title")
      .order("number")
      .then(({ data }) => setWorkshops(data ?? []));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData(form);
      const email = String(formData.get("email"));
      const response = await fetch("/api/mpn/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.get("fullName"),
          email,
          password: formData.get("password"),
          organisation: formData.get("organisation"),
          country: formData.get("country"),
          workshopId: formData.get("workshopId") || null,
        }),
      });
      const result = (await response.json().catch(() => null)) as {
        error?: { message?: string };
      } | null;

      if (!response.ok) {
        setError(result?.error?.message ?? "Unable to register your account.");
        return;
      }

      form.reset();
      setSuccessMessage(`We sent a verification link to ${email}. Check your inbox to complete registration.`);
    } catch {
      setError("We could not reach the registration service. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="block text-sm font-medium text-slate-700">
        Full name
        <input className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5" name="fullName" autoComplete="name" required />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Email address
        <input className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5" name="email" type="email" autoComplete="email" required />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Password
        <input className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5" name="password" type="password" autoComplete="new-password" minLength={8} required />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Organisation
        <input className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5" name="organisation" autoComplete="organization" />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Country
        <input className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5" name="country" autoComplete="country-name" maxLength={2} placeholder="MY" />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Workshop attended
        <select className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5" name="workshopId" defaultValue="">
          <option value="">Select your workshop</option>
          {workshops.map((workshop) => (
            <option key={workshop.id} value={workshop.id}>
              Workshop {workshop.number}: {workshop.title}
            </option>
          ))}
        </select>
      </label>
      {successMessage ? (
        <div className="rounded-xl border border-scph-green/40 bg-scph-green/10 px-4 py-3 text-sm leading-6 text-slate-700" role="status">
          <p className="font-semibold text-[#0d1f3c]">Check your email</p>
          <p>{successMessage}</p>
        </div>
      ) : null}
      {error ? <p className="text-sm text-red-700" role="alert">{error}</p> : null}
      <Button className="w-full" type="submit" variant="scph" disabled={isSubmitting}>
        {isSubmitting ? <><LoaderCircle className="animate-spin" aria-hidden="true" /> Creating account…</> : "Register"}
      </Button>
      <p className="text-center text-sm text-slate-600">
        Already registered? <Link className="font-semibold text-scph-blue hover:underline" href="/community/mpn/login">Sign in</Link>
      </p>
    </form>
  );
}
