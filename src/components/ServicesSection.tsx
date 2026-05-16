import { Clapperboard, Image, Layers3, Music, Sparkles } from "lucide-react";
import type { Locale } from "../content/siteContent";
import { copy, siteContent } from "../content/siteContent";

type ServicesSectionProps = {
  locale: Locale;
};

const serviceIcons = [Image, Clapperboard, Sparkles, Layers3, Music];

export function ServicesSection({ locale }: ServicesSectionProps) {
  const t = copy[locale];
  const services = siteContent.services[locale];

  return (
    <div className="section-shell">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="section-kicker">{t.requestsTitle}</p>
          <h2 className="section-heading">{t.requestsLead}</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {services.map((service, index) => {
            const Icon = serviceIcons[index] ?? Sparkles;
            return (
              <div
                className="flex min-h-[116px] items-start gap-4 rounded-[8px] border border-white/[0.12] bg-frost/[0.06] p-5"
                key={service}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cyanGlow/[0.14] text-cyanGlow">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span className="pt-2 text-lg font-semibold leading-7 text-white">{service}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
