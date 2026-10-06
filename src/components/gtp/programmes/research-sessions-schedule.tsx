import { Clock3, MapPin } from "lucide-react";
import type { ResearchSessionBlock } from "./research-session-listing";

export function ResearchSessionsSchedule({blocks}: {blocks: ResearchSessionBlock[]}) {
  if (!blocks.length) {
    return <p className="mt-5 rounded-xl border border-gtp-dark-teal/15 bg-white px-5 py-6 text-sm leading-relaxed text-gtp-dark-teal/80">The research schedule will be published once the details are confirmed.</p>;
  }
  return <div className="mt-5 space-y-8">
    {blocks.map((block) => <div key={block.id}>
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-gtp-dark-teal">
        <Clock3 className="size-4 text-gtp-dark-teal" aria-hidden />{block.time}
      </p>
      {!block.halls.length ? <p className="text-sm text-gtp-dark-teal/80">Hall and presentation details will be confirmed.</p> : null}
      <div className="grid gap-5 lg:grid-cols-2">
        {block.halls.map((hall) => <section key={hall.id} className="min-w-0 overflow-hidden rounded-xl border border-gtp-dark-teal/15 bg-white" aria-labelledby={`research-hall-${block.id}-${hall.id}`}>
          <div className="flex flex-wrap items-start justify-between gap-2 bg-gtp-dark-teal/5 px-5 py-4">
            <h4 id={`research-hall-${block.id}-${hall.id}`} className="font-heading text-base font-semibold text-gtp-dark-teal">{hall.title}</h4>
            <p className="flex max-w-full items-start gap-1.5 text-xs leading-relaxed text-gtp-dark-teal/80"><MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />{hall.venue}</p>
          </div>
          {hall.presentations.length ? <>
            <table className="hidden w-full table-fixed text-left text-sm sm:table">
              <caption className="sr-only">{hall.title} · {block.time} · Presenters and presentation titles</caption>
              <thead className="bg-gtp-paper text-xs text-gtp-dark-teal"><tr><th scope="col" className="w-[36%] px-5 py-3 font-semibold">Presenter</th><th scope="col" className="px-5 py-3 font-semibold">Presentation title</th></tr></thead>
              <tbody>{hall.presentations.map((row) => <tr key={row.id} className="border-t border-gtp-dark-teal/10 align-top"><th scope="row" className="px-5 py-4 font-medium text-gtp-dark-teal wrap-anywhere">{row.presenterName}</th><td className="px-5 py-4 leading-relaxed text-gtp-dark-teal/85 wrap-anywhere">{row.presentationTitle}</td></tr>)}</tbody>
            </table>
            <dl className="sm:hidden">{hall.presentations.map((row) => <div key={row.id} className="border-t border-gtp-dark-teal/10 px-5 py-4 text-sm">
              <dt className="text-xs font-semibold text-gtp-dark-teal/80">Presenter</dt><dd className="mt-1 font-medium text-gtp-dark-teal wrap-anywhere">{row.presenterName}</dd>
              <dt className="mt-3 text-xs font-semibold text-gtp-dark-teal/80">Presentation title</dt><dd className="mt-1 leading-relaxed text-gtp-dark-teal wrap-anywhere">{row.presentationTitle}</dd>
            </div>)}</dl>
          </> : <p className="px-5 py-6 text-sm text-gtp-dark-teal/80">Presentations for this hall will be confirmed.</p>}
        </section>)}
      </div>
    </div>)}
  </div>;
}
