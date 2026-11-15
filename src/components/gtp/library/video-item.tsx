import Image from "next/image";
import { Play } from "lucide-react";
import type { LibraryVideo } from "@/lib/gtp-videos";
import { youTubeThumbnailUrl } from "@/lib/youtube";
import { VideoPlayButton } from "./video-player";
import styles from "./library.module.css";

export function VideoItem({ video, pendingLabel = "Coming soon", recording = false }: { video: LibraryVideo; pendingLabel?: string; recording?: boolean }) {
  const meta = <div>
    <span className={styles.videoMeta}>{video.day && <span>Day {video.day}</span>}{video.duration && <span>{video.duration}</span>}{video.topic && <span>{video.topic}</span>}</span>
    <span className={styles.videoTitle}>{video.title}</span>
    {video.speakers.length > 0 && <span className={styles.credit}>{video.speakers.join(", ")}</span>}
    {recording && video.description && <span className={`${styles.description} block`}>{video.description}</span>}
    {video.credit && <span className={`${styles.credit} block`}>{video.credit}</span>}
  </div>;
  return video.youtubeId ? <VideoPlayButton className={styles.videoButton} video={video}>
    <span className={styles.poster}><Image src={video.thumbnail?.src || youTubeThumbnailUrl(video.youtubeId)} alt="" fill
      sizes={recording ? "(min-width: 640px) 220px, 90vw" : "(min-width: 900px) 580px, 90vw"} />
      <span className={styles.play}><Play size={23} fill="currentColor" aria-hidden /></span></span>{meta}
  </VideoPlayButton> : <div><div className={`${styles.poster} ${styles.pendingPoster}`}>
    <span className={styles.pendingDay}>Day {video.day}</span><span>{pendingLabel}</span></div>{meta}</div>;
}
