import Link from "next/link";
import { ChevronRight } from "lucide-react";
import styles from "./library.module.css";

export function LibraryHeader({ title, intro, media = false }: { title: string; intro: string; media?: boolean }) {
  return <header className={styles.header}><div className={styles.inner}>
    <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
      <Link href="/events/gtp-2026/about">GTP 2026</Link><ChevronRight size={14} aria-hidden />
      {media && <><Link href="/events/gtp-2026/media">Media</Link><ChevronRight size={14} aria-hidden /></>}
      <span aria-current="page">{title}</span>
    </nav>
    <h1 className={styles.title}>{title}</h1><p className={styles.intro}>{intro}</p>
  </div></header>;
}
