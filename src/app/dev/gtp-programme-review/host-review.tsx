"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {SessionModal} from "@/components/gtp/programmes/session-modal";
import type {GtpSessionModalHostedBy} from "@/sanity/gtp-programme";

export function HostReview({hostedBy}: {hostedBy: GtpSessionModalHostedBy}) {
  const [open, setOpen] = useState(false);
  return <>
    <Button variant="gtpCta" className="bg-gtp-orange-dark hover:bg-gtp-dark-teal" onClick={() => setOpen(true)}>Preview co-hosts in the roundtable popup</Button>
    <SessionModal session={open ? {
      type: "special", title: "Illustrative roundtable — co-host layout review", time: "Time to be confirmed",
      venueLine: "Venue to be confirmed", objective: "Synthetic layout fixture for team review. Final host organisations and logos are pending confirmation.",
    } : null} calendarTabId="day2" dayLabel="13 October 2026" hostedBy={hostedBy} onClose={() => setOpen(false)} />
  </>;
}
