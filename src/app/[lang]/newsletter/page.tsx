import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "@/lib/translations";
import { isValidLang } from "@/lib/i18n";

type Status = "confirmed" | "expired" | "invalid" | "error";

// Página de retorno do link de confirmação: não deve ser indexada
export const metadata: Metadata = {
  title: "Newsletter",
  robots: { index: false, follow: false },
};

export default async function NewsletterStatusPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();
  const { status: raw } = await searchParams;
  const status: Status =
    raw === "confirmed" || raw === "expired" || raw === "invalid" ? raw : "error";

  const t = getTranslations(lang);
  const copy = t.newsletter.statusPage[status];

  return (
    <main>
      <section className="bg-band text-band-ink">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-14 sm:pt-14 sm:pb-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-band-muted">
            {t.newsletter.title}
          </p>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl font-semibold leading-[1.08] tracking-[-0.015em]">
            {copy.title}
          </h1>
          <p className="mt-4 max-w-xl text-[17px] sm:text-lg leading-relaxed text-band-muted">
            {copy.body}
          </p>
          <Link
            href={`/${lang}/blog`}
            className="mt-8 inline-flex items-center gap-1.5 text-[15px] font-medium text-band-accent hover:text-band-ink transition-colors duration-150"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.blog.backToList}
          </Link>
        </div>
      </section>
    </main>
  );
}
