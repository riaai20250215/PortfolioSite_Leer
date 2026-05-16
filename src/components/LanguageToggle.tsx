import type { Locale } from "../content/siteContent";

type LanguageToggleProps = {
  locale: Locale;
  onChange: (locale: Locale) => void;
};

const languages: Locale[] = ["ja", "en"];

export function LanguageToggle({ locale, onChange }: LanguageToggleProps) {
  return (
    <div
      className="grid grid-cols-2 rounded-full border border-white/15 bg-white/[0.08] p-1 text-xs font-semibold"
      aria-label="Language"
      role="group"
    >
      {languages.map((language) => (
        <button
          key={language}
          type="button"
          className={`rounded-full px-3 py-2 uppercase tracking-normal transition ${
            locale === language
              ? "bg-frost text-ink shadow-sm"
              : "text-frost/70 hover:text-frost"
          }`}
          aria-pressed={locale === language}
          onClick={() => onChange(language)}
        >
          {language}
        </button>
      ))}
    </div>
  );
}
