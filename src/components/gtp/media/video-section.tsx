import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GTP_VIDEOS_PATH } from "@/lib/gtp-library";
import type { LibraryVideo } from "@/lib/gtp-videos";
import { VideoItem } from "../library/video-item";
import { VideoPlayer } from "../library/video-player";
import styles from "../library/library.module.css";

export function VideoSection({ title, intro, preview }: {title: string; intro: string[];
  preview: {items: LibraryVideo[]; total: number; unavailable: boolean}}) {
  return <section id="videos" className={styles.preview} aria-labelledby="videos-heading"><div className={styles.inner}>
    <h2 id="videos-heading" className={styles.heading}>{title}</h2>
    {intro.map(p => <p className={styles.sectionIntro} key={p}>{p}</p>)}
    {preview.unavailable ? <p role="status" className={styles.sectionIntro}>Videos could not be loaded. Please refresh to try again.</p> :
      preview.items.length > 0 ? <VideoPlayer><ul className={styles.playlistGrid}>{preview.items.map(v =>
        <li key={v.id}><VideoItem video={v} /></li>)}</ul></VideoPlayer> : <p className={styles.sectionIntro}>Videos are on their way.</p>}
    <Link href={GTP_VIDEOS_PATH} className={styles.button}>Browse all videos<ArrowRight size={18} aria-hidden /></Link>
  </div></section>;
}
