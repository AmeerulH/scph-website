"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function JournalistWorkshopsLogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onLogout() {
    setPending(true);
    try {
      await fetch("/api/scph/journalist-workshops/logout", {
        method: "POST",
        credentials: "include",
      });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant="scphOutline"
      size="default"
      disabled={pending}
      onClick={onLogout}
    >
      {pending ? "Signing out…" : "Sign out"}
    </Button>
  );
}
