import { FormEvent, useMemo, useState } from "react";
import { Mail, Send } from "lucide-react";
import type { Locale } from "../content/siteContent";
import { copy, inquiryOptions, siteContent } from "../content/siteContent";

type ContactFormProps = {
  locale: Locale;
};

type FormState = {
  name: string;
  email: string;
  inquiryType: string;
  message: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  inquiryType: "",
  message: "",
};

export function ContactForm({ locale }: ContactFormProps) {
  const t = copy[locale];
  const options = inquiryOptions[locale];
  const [form, setForm] = useState<FormState>({
    ...initialForm,
    inquiryType: options[0],
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error" | "missing" | "required">(
    "idle",
  );

  const endpoint = useMemo(() => import.meta.env.VITE_FORMSPREE_ENDPOINT as string | undefined, []);
  const isSending = status === "sending";
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
          inquiryType: form.inquiryType,
          message: form.message,
          recipient: siteContent.contact.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Formspree request failed");
      }

      setForm({ ...initialForm, inquiryType: options[0] });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="section-shell">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="section-kicker">{t.contactTitle}</p>
          <h2 className="section-heading">{t.contactLead}</h2>
          <a
            href={`mailto:${siteContent.contact.email}`}
            className="mt-7 inline-flex items-center gap-3 rounded-full border border-white/[0.14] bg-white/[0.08] px-5 py-3 text-sm font-semibold text-frost transition hover:bg-white/[0.12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyanGlow"
          >
            <Mail size={18} aria-hidden="true" />
            {siteContent.contact.email}
          </a>
        </div>
        <form
          className="rounded-[8px] border border-white/[0.12] bg-white/[0.06] p-5 shadow-soft sm:p-7"
          onSubmit={onSubmit}
          noValidate
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="form-field">
              <span>{t.name}</span>
              <input
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                autoComplete="name"
                required
              />
            </label>
            <label className="form-field">
              <span>{t.email}</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                autoComplete="email"
                required
              />
            </label>
          </div>
          <label className="form-field mt-5">
            <span>{t.inquiryType}</span>
            <select
              value={form.inquiryType}
              onChange={(event) => updateField("inquiryType", event.target.value)}
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="form-field mt-5">
            <span>{t.message}</span>
            <textarea
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
              rows={7}
              required
            />
          </label>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p
              className={`min-h-6 text-sm ${
                status === "success" ? "text-aurora" : "text-roseSignal"
              }`}
              role="status"
              aria-live="polite"
            >
              {statusMessage}
            </p>
            <button
              type="submit"
              disabled={isSending}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-frost px-6 text-sm font-bold text-ink shadow-glow transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyanGlow"
            >
              <Send size={17} aria-hidden="true" />
              {isSending ? t.sending : t.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
