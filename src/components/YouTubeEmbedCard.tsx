import { ExternalLink, Play } from "lucide-react";
import { useState } from "react";
import type { Locale, MediaItem } from "../content/siteContent";
import { copy } from "../content/siteContent";
import { getYouTubeVideoId } from "../lib/media";

type YouTubeEmbedCardProps = {
  item: MediaItem;
  locale: Locale;
};

export function YouTubeEmbedCard({ item, locale }: YouTubeEmbedCardProps) {
  const [active, setActive] = useState(false);
  const videoId = getYouTubeVideoId(item.src);
  const t = copy[locale];
  const thumbnail =
    item.thumbnail ?? (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : "");

  if (active && videoId) {
    return (
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
        title={item.title[locale]}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <>
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={item.title[locale]}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-midnight" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        {videoId ? (
          <button
            type="button"
            className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-frost text-ink shadow-glow transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyanGlow"
            onClick={() => setActive(true)}
            aria-label={t.playVideo}
          >
            <Play size={24} fill="currentColor" aria-hidden="true" />
          </button>
        ) : (
          <a
            href={item.src}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-frost px-5 py-3 text-sm font-bold text-ink shadow-glow transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyanGlow"
          >
            <ExternalLink size={16} aria-hidden="true" />
            {t.openChannel}
          </a>
        )}
      </div>
    </>
  );
}
