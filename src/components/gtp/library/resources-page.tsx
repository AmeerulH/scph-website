import Image from "next/image";
import { Download, FileText } from "lucide-react";
import type { Resource, ResourcePageData } from "@/lib/gtp-resources";
import { LibraryHeader } from "./library-header";
import styles from "./library.module.css";

function Downloads({ resource, pendingLabel }: { resource: Resource; pendingLabel: string }) {
  return <ul className={styles.downloads} aria-label={`${resource.title} downloads`}>
    {resource.downloads.map(file => <li key={file.id}>{file.href ?
      <a className={styles.download} href={file.href} aria-label={`Download ${resource.title}: ${file.label} (PDF${file.size ? `, ${file.size}` : ""})`}>
        <span className={styles.downloadName}><Download size={20} aria-hidden />{file.label}</span>
        <span className={styles.downloadMeta}>PDF{file.size ? ` · ${file.size}` : ""}</span>
      </a> : <div className={`${styles.download} ${styles.pending}`}>
        <span className={styles.downloadName}><FileText size={20} aria-hidden />{file.label}</span>
        <span className={styles.downloadMeta}>{pendingLabel}</span>
      </div>}</li>)}
    {!resource.downloads.length && <li className={styles.pending}>{pendingLabel}</li>}
  </ul>;
}

function Cover({ resource }: { resource: Resource }) {
  return resource.cover ? <figure><Image src={resource.cover.src} alt={resource.cover.alt || `${resource.title} cover`}
    width={resource.cover.width} height={resource.cover.height} sizes="(min-width: 900px) 450px, 90vw" className={styles.cover} />
    {resource.credit && <figcaption className={styles.credit}>{resource.credit}</figcaption>}</figure> : null;
}

export function ResourcesPage({ data }: { data: ResourcePageData }) {
  const [featured, ...remaining] = data.resources;
  return <div className={styles.page}>
    <LibraryHeader title={data.settings.title} intro={data.settings.intro} />
    <div className={styles.body}><div className={styles.inner}>
      {data.unavailable ? <div role="status" className={styles.notice}><h2>Resources could not be loaded</h2><p>Please refresh this page to try again.</p></div> : featured ? <>
        <article className={styles.feature}>
          <div><h2>{featured.title}</h2>{featured.description && <p className={styles.description}>{featured.description}</p>}
            {!featured.cover && featured.credit && <p className={styles.credit}>{featured.credit}</p>}
            {featured.cover && <Downloads resource={featured} pendingLabel={data.settings.pendingLabel} />}</div>
          {featured.cover ? <Cover resource={featured} /> : <Downloads resource={featured} pendingLabel={data.settings.pendingLabel} />}
        </article>
        {remaining.map(resource => <article key={resource.id} className={styles.resource}>
          <div><h2>{resource.title}</h2>{resource.description && <p className={styles.description}>{resource.description}</p>}
            {!resource.cover && resource.credit && <p className={styles.credit}>{resource.credit}</p>}
            {resource.cover && <Downloads resource={resource} pendingLabel={data.settings.pendingLabel} />}</div>
          {resource.cover ? <Cover resource={resource} /> : <Downloads resource={resource} pendingLabel={data.settings.pendingLabel} />}
        </article>)}
      </> : <div className={styles.notice}><h2>{data.settings.emptyTitle}</h2><p>{data.settings.emptyMessage}</p></div>}
    </div></div>
  </div>;
}
