"use client";

import Image from "next/image";
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { newsDate, type NewsArticle } from "@/lib/gtp-news";
import styles from "./news.module.css";

export function NewsSpotlight({ articles }: { articles: NewsArticle[] }) {
  const [selected, setSelected] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const animation = useRef<Animation | null>(null);
  const article = articles[selected] ?? articles[0];

  useEffect(() => () => animation.current?.cancel(), []);
  if (!article) return null;

  function choose(index: number, keyboard = false) {
    if (index === selected) return;
    setSelected(index);
    const button = rail.current?.querySelector<HTMLButtonElement>(`[data-story-index="${index}"]`);
    if (button && rail.current && window.matchMedia("(max-width: 899px)").matches) {
      const left = button.offsetLeft - rail.current.offsetLeft;
      rail.current.scrollTo({ left: left - 4, behavior: "instant" });
    }
    // Cancel and retarget from the current visual state during rapid selection.
    if (stage.current && !keyboard && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const current = animation.current?.playState === "running" ? getComputedStyle(stage.current) : null;
      const opacity = current?.opacity ?? "0.25";
      const transform = current?.transform === "none" ? "translateY(8px)" : current?.transform ?? "translateY(8px)";
      animation.current?.cancel();
      animation.current = stage.current.animate([
        { opacity, transform }, { opacity: 1, transform: "translateY(0)" },
      ], { duration: 220, easing: getComputedStyle(stage.current).getPropertyValue("--ease-out-strong").trim() || "cubic-bezier(0.23, 1, 0.32, 1)" });
    } else { animation.current?.cancel(); }
  }

  return (
    <section className={styles.spotlight} aria-label="Featured articles">
      <div className={styles.stage} ref={stage} id="news-spotlight-stage">
        {articles.map((article, index) => (
        <a className={`${styles.feature} ${selected !== index ? styles.featureHidden : ""}`} key={article.id} aria-hidden={selected !== index} inert={selected !== index} href={article.url} target="_blank" rel="noopener noreferrer">
          <div className={styles.featureImage}>
            <Image src={article.image.src} alt={article.image.alt} fill preload={index === 0} sizes="(min-width: 1280px) 830px, (min-width: 900px) 62vw, 100vw" />
          </div>
          <div className={styles.featureCopy}>
            <div>
              <h2>{article.title}</h2>
              <p className={styles.featureMeta}>{article.publisher}{article.publishedAt && <><span aria-hidden> · </span><time dateTime={article.publishedAt}>{newsDate(article.publishedAt)}</time></>}</p>
              {article.imageCredit && <p className={styles.credit}>Image: {article.imageCredit}</p>}
            </div>
            <span className={styles.readLink}>Read article <ArrowUpRight size={18} aria-hidden /><span className="sr-only"> (opens in a new tab)</span></span>
          </div>
        </a>
        ))}
      </div>
      {articles.length > 1 && <div className={styles.selector}>
        <div className={styles.selectorHeading}>
          <h2>In the spotlight</h2>
          <span className={styles.position} aria-live="polite" aria-atomic="true"><span className="sr-only">Story </span>{String(selected + 1).padStart(2, "0")} / {String(articles.length).padStart(2, "0")}</span>
        </div>
        <div className={styles.selectorRail} ref={rail}>
          {articles.map((story, index) => <button
            key={story.id} type="button" data-story-index={index} className={styles.storyButton}
            aria-controls="news-spotlight-stage" aria-pressed={selected === index}
            onClick={event => choose(index, event.detail === 0)}
            onKeyDown={event => {
              if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
              event.preventDefault();
              const next = event.key === "Home" ? 0 : event.key === "End" ? articles.length - 1 :
                (index + (event.key === "ArrowRight" ? 1 : -1) + articles.length) % articles.length;
              choose(next, true);
              rail.current?.querySelector<HTMLButtonElement>(`[data-story-index="${next}"]`)?.focus({ preventScroll: true });
            }}
          >
            <span className="sr-only">Preview: </span>
            <span className={styles.thumbnail}><Image src={story.image.src} alt="" fill sizes="(min-width: 900px) 120px, 84px" /></span>
            <span className={styles.storyCopy}>
              <span className={styles.selectedLabel}>{selected === index ? "Selected" : `Story ${index + 1}`}</span>
              <span className={styles.storyTitle}>{story.title}</span>
              <span className={styles.storyPublisher}>{story.publisher}</span>
            </span>
          </button>)}
        </div>
        <div className={styles.selectorActions}>
          <div className={styles.arrows}>
            <button type="button" aria-label="Previous featured article" disabled={selected === 0} onClick={event => choose(selected - 1, event.detail === 0)}><ChevronLeft aria-hidden size={20} /></button>
            <button type="button" aria-label="Next featured article" disabled={selected === articles.length - 1} onClick={event => choose(selected + 1, event.detail === 0)}><ChevronRight aria-hidden size={20} /></button>
          </div>
          <a href="#articles" className={styles.browseLink}>All articles <ArrowDown size={16} aria-hidden /></a>
        </div>
      </div>}
    </section>
  );
}
