import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Search, X } from "lucide-react";
import { GTP_NEWS_PATH, NEWS_CATEGORIES, NEWS_PAGE_SIZE, newsDate, newsHref, type NewsPageData } from "@/lib/gtp-news";
import { NewsSpotlight } from "./news-spotlight";
import styles from "./news.module.css";

export function NewsPageView({ data, basePath = GTP_NEWS_PATH, review = false }: {
  data: NewsPageData; basePath?: string; review?: boolean;
}) {
  const { settings, params } = data;
  const [formPath, initialQuery] = basePath.split("?");
  const formExtras = [...new URLSearchParams(initialQuery).entries()];
  const browsing = Boolean(params.q || params.category !== "all");
  const first = (params.page - 1) * NEWS_PAGE_SIZE + 1;
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.masthead}>
          <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
            <Link href="/events/gtp-2026/media">Media</Link><span aria-hidden>/</span><span aria-current="page">On the News</span>
          </nav>
          <h1>{settings.title}</h1>
          <p className={styles.intro}>{settings.intro}</p>
          {review && <p className={styles.reviewNotice}>Design preview · Sample articles with GTP 2025 images · Links open example.com</p>}
          {data.collectionTotal > 0 && <a href="#articles" className={styles.jumpLink}>Explore all {data.collectionTotal} articles <ArrowRight size={16} aria-hidden /></a>}
        </header>
        {data.unavailable ? <section className={styles.empty} role="status">
          <h2>The stories couldn’t load just now.</h2>
          <p>Please try again in a moment.</p>
          <a className={styles.action} href={newsHref(params, basePath)}>Try again <ArrowRight size={18} aria-hidden /></a>
        </section> : data.collectionTotal === 0 ? <section className={styles.empty}>
          <h2>{settings.emptyTitle}</h2><p>{settings.emptyMessage}</p>
          <Link className={styles.action} href="/events/gtp-2026/media">Explore Media <ArrowRight size={18} aria-hidden /></Link>
        </section> : <>
          <NewsSpotlight key={data.featured.map(a => a.id).join(",")} articles={data.featured} />
          <section id="articles" className={styles.catalogue} aria-labelledby="news-archive-heading">
            <div className={styles.toolbar}>
              <h2 id="news-archive-heading">Explore all articles</h2>
              <nav aria-label="Article categories" className={styles.filters}>
                {NEWS_CATEGORIES.map(category => <Link key={category.id}
                  href={newsHref({ ...params, category: category.id, page: 1 }, basePath)}
                  aria-current={params.category === category.id ? "true" : undefined}>{category.label}</Link>)}
              </nav>
              <form action={`${formPath}#articles`} method="get" role="search" className={styles.search}>
                {formExtras.map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />)}
                {params.category !== "all" && <input type="hidden" name="category" value={params.category} />}
                <label htmlFor="news-search" className="sr-only">Search article titles and publishers</label>
                <input key={params.q} id="news-search" name="q" type="search" enterKeyHint="search" maxLength={120} defaultValue={params.q} placeholder="Search articles" />
                {params.q && <Link href={newsHref({ ...params, q: "", page: 1 }, basePath)} aria-label="Clear search"><X size={18} aria-hidden /></Link>}
                <button type="submit" aria-label="Search articles"><Search size={20} aria-hidden /></button>
              </form>
            </div>
            <div className={styles.resultLine}>
              <p role="status">{data.total ? `${first}–${Math.min(first + data.articles.length - 1, data.total)} of ${data.total} ${data.total === 1 ? "article" : "articles"}` : "No matching articles"}{params.q && <> for “{params.q}”</>}</p>
              {browsing && <Link href={newsHref({ category: "all", q: "", page: 1 }, basePath)} className={styles.reset}>Reset filters <X size={16} aria-hidden /></Link>}
            </div>
            {data.articles.length ? <div className={styles.articleGrid}>
              {data.articles.map(article => <article key={article.id} className={styles.article}>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  <div className={styles.articleImage}><Image src={article.image.src} alt={article.image.alt} fill sizes="(min-width: 1280px) 410px, (min-width: 1100px) 31vw, (min-width: 600px) 46vw, 100vw" /></div>
                  <div className={styles.articleText}>
                    <h3>{article.title}</h3>
                    <p className={styles.articleMeta}>{article.publisher}{article.publishedAt && <><span aria-hidden> · </span><time dateTime={article.publishedAt}>{newsDate(article.publishedAt)}</time></>}</p>
                    {article.imageCredit && <p className={styles.credit}>Image: {article.imageCredit}</p>}
                    <span className={styles.readLink}>Read article <ArrowUpRight size={16} aria-hidden /><span className="sr-only"> (opens in a new tab)</span></span>
                  </div>
                </a>
              </article>)}
            </div> : <div className={styles.noResults}>
              <h3>No stories match this search.</h3>
              <p>Try a different headline or publisher, or explore the full collection.</p>
              <Link className={styles.action} href={newsHref({ category: "all", q: "", page: 1 }, basePath)}>Show all articles <ArrowRight size={18} aria-hidden /></Link>
            </div>}
            {data.pages > 1 && <nav className={styles.pagination} aria-label="Article pages">
              {params.page > 1 ? <Link href={newsHref({ ...params, page: params.page - 1 }, basePath)} rel="prev"><ArrowLeft size={18} aria-hidden /> Previous</Link> : <span aria-disabled="true"><ArrowLeft size={18} aria-hidden /> Previous</span>}
              <span className={styles.pageCount}>Page {params.page} of {data.pages}</span>
              {params.page < data.pages ? <Link href={newsHref({ ...params, page: params.page + 1 }, basePath)} rel="next">Next <ArrowRight size={18} aria-hidden /></Link> : <span aria-disabled="true">Next <ArrowRight size={18} aria-hidden /></span>}
            </nav>}
          </section>
        </>}
        <footer className={styles.close}>
          <p>See more of the conference.</p>
          <Link href="/events/gtp-2026/media">Back to Media <ArrowRight size={18} aria-hidden /></Link>
        </footer>
      </div>
    </div>
  );
}
