"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { otherLang, type Lang } from "@/lib/i18n";

export default function Navbar({ lang }: { lang: Lang }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href={`/${lang}/blog`}
          className="font-semibold text-base tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          Sedenir
          <span className="text-zinc-400 dark:text-zinc-500">.dev</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href={`/${otherLang(lang)}/blog`}
            className="px-2 py-1 rounded-md text-xs font-medium tracking-wide text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Switch language"
          >
            {lang === "pt" ? "EN" : "PT"}
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
