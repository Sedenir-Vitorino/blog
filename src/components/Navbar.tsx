import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { otherLang, type Lang } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";

export default function Navbar({ lang }: { lang: Lang }) {
  const t = getTranslations(lang);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-band text-band-ink">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <nav className="h-16 flex items-center justify-between gap-4 border-b border-band-line">
          <Link href={`/${lang}/blog`} className="flex items-center gap-3 min-w-0">
            <span className="text-[19px] font-semibold tracking-tight">sedenir.dev</span>
            <span aria-hidden className="hidden min-[400px]:block h-4 w-px bg-band-line" />
            <span className="hidden min-[400px]:block text-[11px] font-semibold uppercase tracking-[0.2em] text-band-accent">
              {t.blog.title}
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href={`/${otherLang(lang)}/blog`}
              className="px-2 py-1.5 rounded-[2px] text-[13px] font-semibold tracking-wide text-band-muted hover:text-band-ink transition-colors duration-150"
              aria-label="Switch language"
            >
              {lang === "pt" ? "EN" : "PT"}
            </Link>
            <span aria-hidden className="h-4 w-px bg-band-line" />
            <ThemeToggle />
            <a
              href="https://sedenir.dev"
              className="ml-1 sm:ml-2 inline-flex items-center gap-1.5 rounded-[2px] bg-accent-strong px-3 py-1.5 text-[13px] font-semibold text-[#20272d] hover:bg-[#c99569] transition-colors duration-150"
            >
              {t.nav.portfolio}
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden />
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
