import { motion, useReducedMotion } from "framer-motion";
import type { Locale, MediaItem } from "../content/siteContent";
import { copy, siteContent } from "../content/siteContent";
import { getVisibleSorted } from "../lib/media";
import { YouTubeEmbedCard } from "./YouTubeEmbedCard";

type FeaturedWorksProps = {
  locale: Locale;
};

function MediaSurface({ item, locale }: { item: MediaItem; locale: Locale }) {
  if (item.kind === "youtube") {
    return <YouTubeEmbedCard item={item} locale={locale} />;
  }

  if (item.kind === "localVideo") {
    return (
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={item.src}
        poster={item.thumbnail}
        controls
        preload="metadata"
      />
    );
  }

  return (
    <img
      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
      src={item.src}
      alt={item.title[locale]}
      loading="lazy"
    />
  );
}

export function FeaturedWorks({ locale }: FeaturedWorksProps) {
  const t = copy[locale];
  const works = getVisibleSorted(siteContent.featuredWorks);
  const reduceMotion = useReducedMotion();

  return (
    <div className="section-shell">
      <div className="mb-9 max-w-3xl">
        <p className="section-kicker">{t.worksTitle}</p>
        <h2 className="section-heading">{t.worksLead}</h2>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {works.map((item, index) => (
          <motion.article
            className={`work-card group relative min-h-[460px] overflow-hidden rounded-[8px] border border-white/[0.12] bg-white/[0.06] shadow-soft ${
              index === 0 ? "lg:min-h-[560px]" : ""
            }`}
            key={item.id}
            animate={reduceMotion ? undefined : { y: index % 2 === 0 ? [0, -8, 0] : [0, 8, 0] }}
            transition={{ duration: 7 + index, repeat: Infinity, ease: "easeInOut" }}
          >
            <MediaSurface item={item} locale={locale} />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <div className="mb-4 flex flex-wrap gap-2">
                {item.tags?.map((tag) => (
                  <span
                    className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase text-frost/80"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-3xl font-semibold text-white">{item.title[locale]}</h3>
              {item.description ? (
                <p className="mt-3 max-w-xl text-sm leading-7 text-frost/75 sm:text-base">
                  {item.description[locale]}
                </p>
              ) : null}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
