import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { MediaSectionNav } from "@/components/gtp/media/media-section-nav";
import { GTP_VIDEOS_PATH } from "@/lib/gtp-library";
import { videoHref, VIDEO_COLLECTIONS, type VideoPageData } from "@/lib/gtp-videos";
import { LibraryHeader } from "./library-header";
import { VideoItem } from "./video-item";
import { VideoPlayer } from "./video-player";
import styles from "./library.module.css";

export function VideosPage({ data, action = GTP_VIDEOS_PATH, retained = {} }: { data: VideoPageData; action?: string; retained?: Record<string, string> }) {
  const s = data.settings;
  const headings = [s.dailyHighlightsTitle, s.sessionRecordingsTitle, s.playlistTitle];
  return <div className={styles.page}><LibraryHeader title={s.title} intro={s.intro} media />
    <MediaSectionNav label="Video collections" sections={VIDEO_COLLECTIONS.map((c, i) => ({ id: c.anchor, label: headings[i] }))} />
    {data.unavailable ? <div className={styles.body}><div className={styles.inner}><div role="status" className={styles.notice}>
      <h2>Videos could not be loaded</h2><p>Please refresh this page to try again.</p></div></div></div> : <VideoPlayer>
      <section id="daily-highlights" className={styles.section} aria-labelledby="highlights-title"><div className={styles.inner}>
        <h2 id="highlights-title" className={styles.heading}>{s.dailyHighlightsTitle}</h2><p className={styles.sectionIntro}>{s.dailyHighlightsIntro}</p>
        <ul className={styles.highlights}>{data.highlights.map(v => <li key={v.id}><VideoItem video={v} pendingLabel={s.pendingLabel} /></li>)}</ul>
      </div></section>
      <section id="session-recordings" className={styles.section} aria-labelledby="recordings-title"><div className={styles.inner}>
        <h2 id="recordings-title" className={styles.heading}>{s.sessionRecordingsTitle}</h2><p className={styles.sectionIntro}>{s.sessionRecordingsIntro}</p>
        <form key={`${data.params.q}:${data.params.day}`} action={`${action}#session-recordings`} method="get" className={styles.filters}>
          {Object.entries(retained).map(([name, value]) => <input type="hidden" key={name} name={name} value={value} />)}
          <label className={styles.search}>Search recordings<input type="search" name="q" defaultValue={data.params.q} maxLength={120} placeholder="Session title, speaker or keyword" /></label>
          <label>Conference day<span className={styles.daySelect}><select name="day" defaultValue={data.params.day}><option value="all">All days</option>{[1, 2, 3, 4].map(d => <option key={d} value={d}>Day {d}</option>)}</select><ChevronDown size={16} aria-hidden /></span></label>
          <button className={styles.button} type="submit">Search</button>
          {(data.params.q || data.params.day !== "all") && <Link href={videoHref({q: "", day: "all", page: 1}, action, retained)}>Clear filters</Link>}
        </form>
        <p role="status">{data.total} {data.total === 1 ? "recording" : "recordings"}{data.params.q || data.params.day !== "all" ? " found" : " available"}</p>
        {data.recordings.length ? <ul className={styles.recordings}>{data.recordings.map(v => <li className={styles.recording} key={v.id}><VideoItem video={v} recording /></li>)}</ul> :
          <div className={styles.notice}><h3 className={styles.videoTitle}>{data.params.q || data.params.day !== "all" ? "No recordings match your search" : s.pendingLabel}</h3>
            <p>{data.params.q || data.params.day !== "all" ? "Try another keyword or choose All days." : s.emptyMessage}</p></div>}
        {data.pages > 1 && <nav aria-label="Recording pages" className={styles.pagination}>
          {data.params.page > 1 ? <Link href={videoHref({...data.params, page: data.params.page - 1}, action, retained)}><ArrowLeft size={18} aria-hidden />Previous</Link> : <span />}
          <span>Page {data.params.page} of {data.pages}</span>
          {data.params.page < data.pages ? <Link href={videoHref({...data.params, page: data.params.page + 1}, action, retained)}>Next<ArrowRight size={18} aria-hidden /></Link> : <span />}
        </nav>}
      </div></section>
      <section id="gtp2026-playlist" className={`${styles.section} ${styles.playlist}`} aria-labelledby="playlist-title"><div className={styles.inner}>
        <h2 id="playlist-title" className={styles.heading}>{s.playlistTitle}</h2><p className={styles.sectionIntro}>{s.playlistIntro}</p>
        {data.playlist.length ? <ul className={styles.playlistGrid}>{data.playlist.map(v => <li key={v.id}><VideoItem video={v} /></li>)}</ul> : <p className={styles.sectionIntro}>{s.emptyMessage}</p>}
        {s.channelUrl && <a className={styles.button} href={s.channelUrl} target="_blank" rel="noopener noreferrer">Visit our YouTube channel<span className="sr-only"> (opens in a new tab)</span></a>}
      </div></section>
    </VideoPlayer>}
  </div>;
}
