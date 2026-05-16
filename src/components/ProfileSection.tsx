import { Sparkles } from "lucide-react";
import type { Locale } from "../content/siteContent";
import { copy, siteContent } from "../content/siteContent";

type ProfileSectionProps = {
  locale: Locale;
};

export function ProfileSection({ locale }: ProfileSectionProps) {
  const profile = siteContent.profile[locale];
  const t = copy[locale];

  return (
    <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
      <div>
        <p className="section-kicker">{t.profileCaption}</p>
        <h2 className="section-title">{t.profileTitle}</h2>
      </div>
      <div className="border-l border-cyanGlow/30 pl-6">
        <div className="mb-4 flex items-center gap-3 text-cyanGlow">
          <Sparkles size={20} aria-hidden="true" />
          <span className="text-sm font-semibold uppercase">{profile.role}</span>
        </div>
        <h3 className="text-3xl font-semibold text-white sm:text-4xl">{profile.name}</h3>
        <p className="mt-5 text-base leading-8 text-frost/80">{profile.bio}</p>
        <p className="mt-5 text-base leading-8 text-frost/70">{profile.concept}</p>
      </div>
    </div>
  );
}
