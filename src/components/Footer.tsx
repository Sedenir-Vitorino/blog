import { ArrowUpRight } from "lucide-react";
import type { Lang } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import NewsletterForm from "./NewsletterForm";

export default function Footer({ lang }: { lang: Lang }) {
  const t = getTranslations(lang);

  return (
    <footer className="bg-band text-band-ink">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col gap-8 py-8 border-b border-band-line md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col items-start gap-3">
            <span className="text-[19px] font-semibold tracking-tight">sedenir.dev</span>
            <a
              href="https://sedenir.dev"
              className="inline-flex items-center gap-1.5 text-[14px] font-medium text-band-accent hover:text-band-ink transition-colors duration-150"
            >
              {t.nav.portfolio}
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden />
            </a>
          </div>
          <NewsletterForm lang={lang} variant="footer" />
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 py-5">
          <p className="text-[13px] text-band-muted">
            © {new Date().getFullYear()} Sedenir Vitorino. {t.footer.rights}
          </p>

          <div className="flex items-center gap-4">
            <a
              href="mailto:contato@sedenir.dev"
              className="text-[13px] text-band-muted hover:text-band-ink transition-colors duration-150"
            >
              Email
            </a>
            <span aria-hidden className="h-3.5 w-px bg-band-line" />
            <a
              href="https://instagram.com/sedenir.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-band-muted hover:text-band-ink transition-colors duration-150"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
