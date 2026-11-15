"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {WorkshopModal} from "@/components/gtp/programmes/workshop-modal";
import {ResearchSessionsSchedule} from "@/components/gtp/programmes/research-sessions-schedule";
import type {Speaker} from "@/components/gtp/programmes/types";
import type {GtpSessionModalHostedBy} from "@/sanity/gtp-programme";

export function PeopleReview({people, hostedBy}: {people: Speaker[]; hostedBy: GtpSessionModalHostedBy}) {
  const [preview, setPreview] = useState<"photos" | "cleared" | "empty" | null>(null);
  return <>
    <div className="flex flex-wrap gap-3">
      <Button variant="gtpCta" className="bg-gtp-orange-dark hover:bg-gtp-dark-teal" disabled={people.length === 0} onClick={() => setPreview("photos")}>Preview workshop profile photos</Button>
      <Button variant="outline" disabled={people.length === 0} onClick={() => setPreview("cleared")}>Preview cleared role labels</Button>
      <Button variant="outline" onClick={() => setPreview("empty")}>Preview unconfirmed people</Button>
    </div>
    {people.length ? <div className="mt-6">
      <p className="text-sm text-gtp-dark-teal">Research photo layout fixture. Names and photos are shown only to check rendering.</p>
      <ResearchSessionsSchedule blocks={[{
        id: "research-photo-fixture", dayId: "day2", time: "Local layout fixture",
        halls: [{
          id: "photo-fixture", title: "Illustrative research paper", venue: "Layout fixture",
          presentations: [{
            id: "photo-check", presenterName: people.map(person => person.name).join(", "),
            presentationTitle: "Illustrative research paper",
            presenters: people.map(person => ({name: person.name, imageUrl: person.imageUrl})),
          }],
        }],
      }]} />
    </div> : null}
    <WorkshopModal context={preview ? {
      parent: {type: "concurrent", title: "Local roster layout fixture", time: "Time to be confirmed", venueLine: "Venue to be confirmed"},
      workshop: {
        number: "",
        title: preview === "cleared" ? "Cleared role labels layout check" : preview === "photos" ? "Profile photo layout check" : "Unconfirmed people layout check",
        objective: "Local layout fixture. Profile photos and biographies come from the published conference programme and demonstrate the roster layout only; this is not a confirmed workshop.",
        speakers: preview === "cleared" ? people.map(person => ({...person, roles: [], sessionRole: undefined})) : preview === "photos" ? people : [],
      },
    } : null} calendarTabId="day2" hostedBy={hostedBy} workshopRegistration="inline" registration={{status: "comingSoon", label: "Registration opening soon"}} onClose={() => setPreview(null)} />
  </>;
}
