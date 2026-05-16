import { Sparkles } from "lucide-react";
import type { Locale } from "../content/siteContent";
import { copy } from "../content/siteContent";
import { LanguageToggle } from "./LanguageToggle";

type NavBarProps = {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
};

export function NavBar({ locale, onLocaleChange }: NavBarProps) {
  const t = copy[locale];
  const navItems = [
    { href: "#profile", label: t.navProfile },
    { href: "#works", label: t.navWorks },
    { href: "#requests", label: t.navRequests },
    { href: "#contact", label: t.navContact },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-ink/75 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2 font-semibold text-frost">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-cyanGlow/40 bg-cyanGlow/10 text-cyanGlow">
            <Sparkles aria-hidden="true" size={18} />
          </span>
          <span className="leading-none">
            <span className="block text-sm">Leer</span>
            <span className="block text-[11px] font-medium text-frost/55">AI Creator</span>
          </span>
        </a>
        <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.06] p-1 text-sm text-frost/75 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-frost"
            >
              {item.label}
            </a>
          ))}
        </div>
        <LanguageToggle locale={locale} onChange={onLocaleChange} />
      </nav>
    </header>
  );
}
