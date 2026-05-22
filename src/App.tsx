import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  AtSign,
  Brush,
  Clapperboard,
  ExternalLink,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Music2,
  Pause,
  Play,
  Send,
  Smartphone,
  Sparkles,
  Star,
  Youtube,
} from "lucide-react";
import {
  copy,
  siteContent,
  type Locale,
  type MediaItem,
} from "./content/siteContent";

const socialIcons = {
  x: AtSign,
  youtube: Youtube,
  instagram: Instagram,
  tiktok: Music2,
};

const serviceIcons = [Brush, Clapperboard, Smartphone, Star];

type FormState = {
  name: string;
  email: string;
  company: string;
  message: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  company: "",
  message: "",
};

function MediaImage({
  item,
  locale,
  sizes,
}: {
  item: MediaItem;
  locale: Locale;
  sizes?: string;
}) {
  return (
    <img
      src={item.imageUrl}
      alt={item.title[locale]}
      loading="lazy"
      decoding="async"
      sizes={sizes}
      className="media-image"
    />
  );
}

function LanguageToggle({
  locale,
  onChange,
}: {
  locale: Locale;
  onChange: (locale: Locale) => void;
}) {
  return (
    <div className="language-toggle" aria-label="Language" role="group">
      {(["en", "ja"] as Locale[]).map((language) => (
        <button
          type="button"
          key={language}
          className={locale === language ? "is-active" : ""}
          aria-pressed={locale === language}
          onClick={() => onChange(language)}
        >
          {language.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function Header({
  locale,
  onLocaleChange,
}: {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}) {
  const t = copy[locale];
  const nav = [
    { href: "#works", label: t.navWorks },
    { href: "#services", label: t.navRequests },
    { href: "#about", label: t.navProfile },
    { href: "#links", label: t.navLinks },
    { href: "#contact", label: t.navContact },
  ];

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Leer / RIA home">
        <span className="brand-name">Leer / RIA</span>
        <span className="brand-role">AI CREATOR</span>
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {nav.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <LanguageToggle locale={locale} onChange={onLocaleChange} />
        <a className="contact-pill" href="#contact">
          <span>{t.heroSecondary}</span>
        </a>
        <button className="menu-button" type="button" aria-label="Open menu">
          <Menu size={20} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

function TopMarquee({
  locale,
  paused,
  onToggle,
}: {
  locale: Locale;
  paused: boolean;
  onToggle: () => void;
}) {
  const t = copy[locale];
  const items = useMemo(
    () => siteContent.heroGallery.filter((item) => item.visible).sort((a, b) => a.order - b.order),
    [],
  );
  const loop = [...items, ...items, ...items];

  return (
    <div className="top-marquee" aria-label="Generated visual gallery">
      <div className={`marquee-inner ${paused ? "is-paused" : ""}`}>
        {loop.map((item, index) => (
          <article className="thumb-card" key={`${item.id}-${index}`}>
            <MediaImage item={item} locale={locale} sizes="160px" />
            {item.motion ? (
              <span className="play-chip" aria-hidden="true">
                <Play size={12} fill="currentColor" />
              </span>
            ) : null}
          </article>
        ))}
      </div>
      <button
        className="pause-button"
        type="button"
        onClick={onToggle}
        aria-label={paused ? t.play : t.pause}
      >
        {paused ? <Play size={14} fill="currentColor" /> : <Pause size={14} />}
        <span>{paused ? t.play : t.pause}</span>
      </button>
    </div>
  );
}

function Hero({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const profile = siteContent.profile[locale];
  const portrait = siteContent.heroPortrait;

  return (
    <section className="hero-section" id="top">
      <div className="hero-copy">
        <p className="eyebrow">{t.heroKicker}</p>
        <h1>
          <span>AI Creator &amp;</span>
          <span>Visual Storyteller</span>
        </h1>
        <p>{t.heroLead}</p>
        <a className="primary-button" href="#works">
          <span>{t.heroPrimary}</span>
          <ArrowRight size={16} aria-hidden="true" />
        </a>
      </div>
      <div className="hero-art" aria-hidden="false">
        <img
          src={portrait.imageUrl}
          alt={portrait.alt[locale]}
          loading="eager"
          decoding="async"
          className="hero-portrait"
        />
        <span className="hero-portrait-glow" aria-hidden="true" />
      </div>
      <aside className="profile-card" id="about">
        <p className="profile-name">{profile.name}</p>
        <p className="profile-role">{profile.role}</p>
        <p className="profile-bio">{profile.bio}</p>
        <div className="profile-meta">
          <span>
            <MapPin size={13} aria-hidden="true" />
            {profile.location}
          </span>
          <span>
            <Sparkles size={13} aria-hidden="true" />
            {profile.availability}
          </span>
        </div>
      </aside>
    </section>
  );
}

function SocialLinks({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <section className="social-strip" id="links" aria-label={t.socialsTitle}>
      {siteContent.socialLinks.map((social) => {
        const Icon = socialIcons[social.kind];
        return (
          <a
            href={social.url}
            target="_blank"
            rel="noreferrer"
            key={social.kind}
            aria-label={`${social.label}: ${t.openExternal}`}
          >
            <span className={`social-icon social-${social.kind}`}>
              <Icon size={20} aria-hidden="true" />
            </span>
            <span className="social-label">
              <strong>{social.label}</strong>
              <small>{social.note[locale]}</small>
            </span>
            <ExternalLink size={15} aria-hidden="true" />
          </a>
        );
      })}
    </section>
  );
}

function WorkCard({
  item,
  locale,
  position,
}: {
  item: MediaItem;
  locale: Locale;
  position: number;
}) {
  return (
    <article className={`work-card work-card-${position}`}>
      <MediaImage item={item} locale={locale} sizes="320px" />
      {item.motion ? (
        <span className="large-play" aria-label={copy[locale].playVideo}>
          <Play size={18} fill="currentColor" aria-hidden="true" />
        </span>
      ) : null}
      <div className="work-caption">
        <div>
          <h3>{item.title[locale]}</h3>
          {item.description ? <p>{item.description[locale]}</p> : null}
        </div>
        {item.tags?.length ? (
          <div className="tag-row">
            {item.tags.slice(0, 2).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

function FeaturedWorks({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const works = siteContent.featuredWorks
    .filter((work) => work.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <section className="panel-section" id="works">
      <div className="section-heading-row">
        <div>
          <p className="section-label">{t.worksTitle}</p>
        </div>
        <a className="ghost-button" href="#contact">
          <span>{t.viewAll}</span>
          <ArrowRight size={15} aria-hidden="true" />
        </a>
      </div>
      <div className="works-grid">
        {works.map((item, index) => (
          <WorkCard item={item} locale={locale} position={index + 1} key={item.id} />
        ))}
      </div>
    </section>
  );
}

function Services({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const services = siteContent.services[locale];
  const details = siteContent.serviceDetails[locale];

  return (
    <section className="panel-section" id="services">
      <div className="section-heading-row compact">
        <div>
          <p className="section-label">{t.requestsTitle}</p>
          <p className="section-subtitle">{t.requestsLead}</p>
        </div>
      </div>
      <div className="services-grid">
        {services.map((service, index) => {
          const Icon = serviceIcons[index] ?? Sparkles;
          return (
            <article className="service-card" key={service}>
              <span className="service-icon">
                <Icon size={24} aria-hidden="true" />
              </span>
              <div>
                <h3>{service}</h3>
                <p>{details[index]}</p>
                <a href="#contact">
                  {t.learnMore}
                  <ArrowRight size={14} aria-hidden="true" />
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Contact({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const endpoint = useMemo(() => import.meta.env.VITE_FORMSPREE_ENDPOINT as string | undefined, []);
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error" | "missing" | "required"
  >("idle");

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (status !== "idle" && status !== "sending") {
      setStatus("idle");
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus("required");
      return;
    }

    if (!endpoint) {
      setStatus("missing");
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          message: form.message,
          recipient: siteContent.contact.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      setForm(initialForm);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const statusMessage =
    status === "success"
      ? t.success
      : status === "error"
        ? t.error
        : status === "missing"
          ? t.endpointMissing
          : status === "required"
            ? t.required
            : "";

  return (
    <section className="contact-panel" id="contact">
      <div className="contact-info">
        <p className="section-label">{t.contactKicker}</p>
        <h2>{t.contactTitle}</h2>
        <p>{t.contactLead}</p>
        <a className="mail-link" href={`mailto:${siteContent.contact.email}`}>
          <Mail size={16} aria-hidden="true" />
          {siteContent.contact.email}
        </a>
      </div>
      <form onSubmit={onSubmit} noValidate>
        <label className="field-name">
          <input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            autoComplete="name"
            placeholder={t.name}
            required
          />
        </label>
        <label className="field-email">
          <input
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            autoComplete="email"
            placeholder={t.email}
            required
          />
        </label>
        <label className="field-company">
          <input
            value={form.company}
            onChange={(event) => updateField("company", event.target.value)}
            autoComplete="organization"
            placeholder={t.company}
          />
        </label>
        <label className="field-message">
          <textarea
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
            rows={3}
            placeholder={t.message}
            required
          />
        </label>
        <button className="field-submit" type="submit" disabled={status === "sending"}>
          <span>{status === "sending" ? t.sending : t.submit}</span>
          <Send size={15} aria-hidden="true" />
        </button>
        {statusMessage ? (
          <p
            className={`form-status ${status === "success" ? "is-success" : ""}`}
            role="status"
          >
            {statusMessage}
          </p>
        ) : null}
      </form>
    </section>
  );
}

export default function App() {
  const [locale, setLocale] = useState<Locale>("en");
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <div className="page-shell">
      <div className="ambient-glow" aria-hidden="true" />
      <div className="portfolio-frame">
        <Header locale={locale} onLocaleChange={setLocale} />
        <TopMarquee
          locale={locale}
          paused={paused}
          onToggle={() => setPaused((value) => !value)}
        />
        <main>
          <Hero locale={locale} />
          <SocialLinks locale={locale} />
          <FeaturedWorks locale={locale} />
          <Services locale={locale} />
          <Contact locale={locale} />
        </main>
        <footer>
          <a href="#top" aria-label="Back to top" className="footer-brand">
            <span>Leer / RIA</span>
            <small>AI CREATOR</small>
          </a>
          <nav aria-label="Footer navigation">
            <a href="#works">{copy[locale].navWorks}</a>
            <a href="#services">{copy[locale].navRequests}</a>
            <a href="#about">{copy[locale].navProfile}</a>
            <a href="#links">{copy[locale].navLinks}</a>
            <a href="#contact">{copy[locale].navContact}</a>
          </nav>
          <p>© 2026 Leer / RIA. {copy[locale].footer}</p>
        </footer>
      </div>
    </div>
  );
}
