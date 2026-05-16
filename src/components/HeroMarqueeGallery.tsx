import { Pause, Play, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Locale } from "../content/siteContent";
import { copy, siteContent } from "../content/siteContent";
import { getVisibleSorted } from "../lib/media";

type HeroMarqueeGalleryProps = {
  locale: Locale;
};

export function HeroMarqueeGallery({ locale }: HeroMarqueeGalleryProps) {
  const t = copy[locale];
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const items = useMemo(() => getVisibleSorted(siteContent.heroGallery), []);
  const galleryItems = [...items, ...items];
  const motionPaused = paused || reduceMotion;

  return (
    <section id="top" className="relative isolate overflow-hidden bg-radial-light pt-24 text-frost">
      <div className="mx-auto grid min-h-[78svh] max-w-7xl content-center gap-10 px-4 pb-14 sm:px-6 lg:px-8">
        <div className="max-w-4xl pt-12">
          <motion.div
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyanGlow/30 bg-cyanGlow/10 px-4 py-2 text-sm font-semibold text-cyanGlow"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles aria-hidden="true" size={16} />
            {t.heroKicker}
          </motion.div>
          <motion.h1
            className="max-w-5xl text-4xl font-semibold leading-tight text-white sm:text-6xl lg:text-7xl"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
          >
            {t.heroTitle}
          </motion.h1>
          <motion.p
            className="mt-6 max-w-2xl text-base leading-8 text-frost/80 sm:text-lg"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16 }}
          >
            {t.heroLead}
          </motion.p>
        </div>

        <div className="relative -mx-4 overflow-hidden sm:-mx-6 lg:-mx-8">
          <div
            className={`marquee-track flex w-max gap-4 px-4 sm:gap-5 sm:px-6 lg:px-8 ${
              motionPaused ? "is-paused" : ""
            }`}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {galleryItems.map((item, index) => (
              <article
                className="hero-card group relative h-[220px] w-[220px] shrink-0 overflow-hidden rounded-[8px] border border-white/[0.12] bg-white/[0.08] shadow-soft"
                key={`${item.id}-${index}`}
              >
                <div className="grid h-full place-items-center bg-navy p-4 text-center text-sm font-semibold text-frost/70">
                  {item.title[locale]}
                </div>
              </article>
            ))}
          </div>
          <button
            type="button"
            className="absolute bottom-4 right-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-ink/75 text-frost backdrop-blur transition hover:bg-white/[0.12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyanGlow"
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? t.play : t.pause}
          >
            {paused ? <Play size={18} aria-hidden="true" /> : <Pause size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </section>
  );
}
