"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import type { Lang } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";

type Variant = "section" | "footer";
type Status =
  | "idle"
  | "sending"
  | "pending"
  | "already"
  | "invalid"
  | "failed"
  | "unavailable";

/**
 * Inscrição na newsletter (POST /api/newsletter, double opt-in via Resend).
 * - section: bloco claro (página inicial e fim dos artigos)
 * - footer: versão compacta sobre o rodapé grafite
 */
export default function NewsletterForm({
  lang,
  variant,
}: {
  lang: Lang;
  variant: Variant;
}) {
  const t = getTranslations(lang).newsletter;
  const id = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const website = new FormData(e.currentTarget).get("website");
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lang, website }),
      });
      const data: { status?: Status; error?: Status } = await res
        .json()
        .catch(() => ({}));
      const next = data.status ?? data.error ?? "failed";
      setStatus(next);
      if (next === "pending" || next === "already") setEmail("");
    } catch {
      setStatus("failed");
    }
  }

  const done = status === "pending" || status === "already";
  const message = status === "idle" || status === "sending" ? null : t[status];
  const isFooter = variant === "footer";

  const form = (
    <form onSubmit={onSubmit} noValidate className="w-full">
      {/* Honeypot: invisível para pessoas, robôs preenchem */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-px w-px opacity-0"
      />
      <label htmlFor={`${id}-email`} className="sr-only">
        {t.emailLabel}
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={`${id}-email`}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "sending") setStatus("idle");
          }}
          placeholder={t.placeholder}
          aria-describedby={message ? `${id}-msg` : undefined}
          aria-invalid={status === "invalid" || undefined}
          className={`min-w-0 flex-1 rounded-[2px] border px-3.5 py-2.5 text-[15px] focus:outline-none focus-visible:outline-none focus:ring-1 transition-colors duration-150 ${
            isFooter
              ? "border-band-line bg-transparent text-band-ink placeholder:text-band-muted focus:border-band-accent focus:ring-band-accent"
              : "border-line bg-bg text-ink placeholder:text-muted focus:border-accent focus:ring-accent"
          }`}
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-[2px] bg-accent-strong px-4 py-2.5 text-[15px] font-semibold text-[#20272d] hover:bg-[#c99569] disabled:opacity-70 transition-colors duration-150"
        >
          {status === "sending" ? t.sending : t.submit}
          {status !== "sending" && (
            <ArrowRight className="w-4 h-4" aria-hidden />
          )}
        </button>
      </div>
      <p
        id={`${id}-msg`}
        role="status"
        className={`mt-2 min-h-[1.25rem] text-[14px] ${
          done
            ? isFooter
              ? "text-band-ink"
              : "text-ink"
            : isFooter
              ? "text-band-accent"
              : "text-accent"
        }`}
      >
        {message}
      </p>
    </form>
  );

  if (isFooter) {
    return (
      <div className="relative w-full max-w-md">
        <p className="mb-2 text-[14px] font-semibold text-band-ink">
          {t.title}
        </p>
        {form}
      </div>
    );
  }

  // Container query: lado a lado só quando o próprio espaço comporta (no artigo, empilha)
  return (
    <div className="@container">
      <section
        aria-labelledby={`${id}-title`}
        className="relative grid gap-5 rounded-[2px] border border-line border-l-2 border-l-accent-strong bg-surface px-6 py-7 sm:px-8 @3xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] @3xl:items-center @3xl:gap-10"
      >
        <div>
          <h2
            id={`${id}-title`}
            className="font-serif text-[24px] sm:text-[26px] font-semibold leading-tight text-ink"
          >
            {t.title}
          </h2>
          <p className="mt-2 text-[15.5px] leading-relaxed text-muted">
            {t.description}
          </p>
        </div>
        {form}
      </section>
    </div>
  );
}
