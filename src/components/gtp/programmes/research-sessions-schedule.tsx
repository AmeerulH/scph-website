import { Clock3, MapPin } from "lucide-react";
import type { ResearchSessionBlock } from "./research-session-listing";
import type { ResearchPresentation } from "./types";
import { ProgrammeSpeakerAvatar } from "./programme-speaker-avatar";

function ResearchPresenters({row}: {row: ResearchPresentation}) {
  const presenters = row.presenters?.length ? row.presenters : [{name: row.presenterName}];
  return <ul className="space-y-2">
    {presenters.map((person, index) => <li key={`${person.name}-${index}`} className="flex items-start gap-2">
      <ProgrammeSpeakerAvatar name={person.name} imageUrl={person.imageUrl} />
      <span className="min-w-0 pt-1.5 font-medium leading-relaxed text-gtp-dark-teal wrap-anywhere">{person.name}</span>
    </li>)}
  </ul>;
}

export function ResearchSessionsSchedule({blocks}: {blocks: ResearchSessionBlock[]}) {
  if (!blocks.length) {
    return <p className="mt-5 rounded-xl border border-gtp-dark-teal/15 bg-white px-5 py-6 text-sm leading-relaxed text-gtp-dark-teal/80">The research schedule will be published once the details are confirmed.</p>;
  }
  return <div className="mt-5 space-y-8">
    {blocks.map((block) => <div key={block.id}>
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-gtp-dark-teal">
        <Clock3 className="size-4 text-gtp-dark-teal" aria-hidden />{block.time}
      </p>
      {!block.halls.length ? <p className="text-sm text-gtp-dark-teal/80">Session and presentation details will be confirmed.</p> : null}
      <div className="grid items-start gap-5 lg:grid-cols-2">
        {block.halls.map((hall) => <section key={hall.id} className={`min-w-0 overflow-hidden rounded-xl border border-gtp-dark-teal/15 bg-white${hall.title === "Session to be confirmed" ? " lg:col-span-2" : ""}`} aria-labelledby={`research-hall-${block.id}-${hall.id}`}>
          <div className="flex flex-wrap items-center justify-between gap-2 bg-gtp-dark-teal/5 px-4 py-3 sm:px-5">
            <h4 id={`research-hall-${block.id}-${hall.id}`} className="font-heading text-base font-semibold text-gtp-dark-teal">{hall.title}</h4>
            <p className="flex max-w-full items-start gap-1.5 text-xs leading-relaxed text-gtp-dark-teal/80"><MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />{hall.venue}</p>
          </div>
          {hall.presentations.length ? <>
            <table className="hidden w-full table-fixed text-left text-sm sm:table">
              <caption className="sr-only">{hall.title} · {block.time} · Presenters and presentation titles</caption>
              <thead className="bg-gtp-paper text-xs text-gtp-dark-teal"><tr><th scope="col" className="w-[38%] px-5 py-3 font-semibold">Presenter</th><th scope="col" className="px-5 py-3 font-semibold">Presentation title</th></tr></thead>
              <tbody>{hall.presentations.map((row) => <tr key={row.id} className="border-t border-gtp-dark-teal/10 align-top"><th scope="row" className="px-5 py-4"><ResearchPresenters row={row} /></th><td className="px-5 py-4 leading-relaxed text-gtp-dark-teal/85 wrap-anywhere">{row.presentationTitle}</td></tr>)}</tbody>
            </table>
            <dl className="sm:hidden">{hall.presentations.map((row) => <div key={row.id} className="border-t border-gtp-dark-teal/10 px-4 py-4 text-sm">
              <dt className="text-xs font-semibold text-gtp-dark-teal/80">Presenter</dt><dd className="mt-2"><ResearchPresenters row={row} /></dd>
              <dt className="mt-3 text-xs font-semibold text-gtp-dark-teal/80">Presentation title</dt><dd className="mt-1 leading-relaxed text-gtp-dark-teal wrap-anywhere">{row.presentationTitle}</dd>
            </div>)}</dl>
          </> : <p className="px-5 py-6 text-sm text-gtp-dark-teal/80">Presentations for this session will be confirmed.</p>}
        </section>)}
      </div>
    </div>)}
  </div>;
}
