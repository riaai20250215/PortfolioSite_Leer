import { AtSign, ExternalLink, Instagram, Music2, Youtube } from "lucide-react";
import type { Locale } from "../content/siteContent";
import { copy, siteContent } from "../content/siteContent";

type SocialLinksProps = {
  locale: Locale;
};

const iconMap = {
  x: AtSign,
  youtube: Youtube,
  instagram: Instagram,
  tiktok: Music2,
};

export function SocialLinks({ locale }: SocialLinksProps) {
  const t = copy[locale];

  return (
    <div className="section-shell">
      <div className="mb-8 max-w-2xl">
        <p className="section-kicker">{t.socialsTitle}</p>
        <h2 className="section-heading">{t.socialsLead}</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {siteContent.socialLinks.map((social) => {
          const Icon = iconMap[social.kind];
          return (
            <a
              className="group flex min-h-[86px] items-center justify-between rounded-[8px] border border-white/[0.12] bg-white/[0.06] p-5 text-frost shadow-soft transition hover:-translate-y-1 hover:border-cyanGlow/40 hover:bg-white/[0.09] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyanGlow"
              href={social.url}
              key={social.kind}
              target="_blank"
              rel="noreferrer"
              aria-label={`${social.label}: ${t.openExternal}`}
            >
              <span className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-frost text-ink">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span className="text-lg font-semibold">{social.label}</span>
              </span>
              <ExternalLink
                size={18}
                className="text-frost/50 transition group-hover:text-cyanGlow"
                aria-hidden="true"
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}
