"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type PendingMember = {
  id: string;
  full_name: string;
  email: string;
  organisation: string | null;
  country: string | null;
  created_at: string;
  workshops: { number: number; title: string }[];
};

export function PendingMembers({ members }: { members: PendingMember[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function review(userId: string, action: "approve" | "reject") {
    setBusyId(userId);
    setError(null);
    const response = await fetch(`/api/mpn/auth/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const result = (await response.json()) as { error?: { message?: string } };
      setError(result.error?.message ?? "Unable to update this membership.");
      setBusyId(null);
      return;
    }

    router.refresh();
  }

  if (!members.length) {
    return <p className="rounded-xl border border-dashed border-slate-300 p-6 text-slate-600">There are no pending applications.</p>;
  }

  return (
    <div className="space-y-3">
      {error ? <p className="text-sm text-red-700" role="alert">{error}</p> : null}
      {members.map((member) => (
        <article className="rounded-xl border border-slate-200 bg-white p-5" key={member.id}>
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <div>
              <h2 className="font-heading text-lg font-semibold text-[#0d1f3c]">{member.full_name}</h2>
              <p className="text-sm text-slate-600">{member.email}</p>
              <p className="mt-2 text-sm text-slate-600">
                {[member.organisation, member.country].filter(Boolean).join(" · ") || "No organisation or country provided"}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {member.workshops[0]
                  ? `Workshop ${member.workshops[0].number}: ${member.workshops[0].title}`
                  : "No workshop selected"}
              </p>
            </div>
            <div className="flex gap-2 self-start">
              <Button size="sm" variant="scph" disabled={busyId === member.id} onClick={() => review(member.id, "approve")}>
                Approve
              </Button>
              <Button size="sm" variant="outline" disabled={busyId === member.id} onClick={() => review(member.id, "reject")}>
                Reject
              </Button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
