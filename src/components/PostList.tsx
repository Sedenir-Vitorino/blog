"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PostMeta } from "@/lib/mdx";
import type { Lang } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";

type Props = {
  posts: PostMeta[];
  lang: Lang;
  activeTag?: string;
};

function formatDate(iso: string, lang: string): string {
  return new Date(iso).toLocaleDateString(lang === "pt" ? "pt-BR" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function PostList({ posts, lang, activeTag }: Props) {
  const listRef = useRef<HTMLUListElement>(null);
  const t = getTranslations(lang);

  useEffect(() => {
    const items = listRef.current?.querySelectorAll<HTMLElement>(".post-card");
    if (!items) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08 },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <ul
      ref={listRef}
      className={`grid gap-5 ${posts.length === 1 ? "" : "md:grid-cols-2"}`}
    >
      {posts.map((post, index) => (
        <li
          key={post.slug}
          className="post-card"
          style={{ transitionDelay: `${index * 80}ms` }}
        >
          {/*
           * Stretched link: conteúdo vem primeiro no DOM (z-index menor),
           * o <Link> vem por último e fica acima deles (z-index maior por
           * ordem de pintura). Tags têm z-10 explícito para ficarem acima
           * do Link e receberem os cliques. Resolve <a> dentro de <a>.
           */}
          <div className="group relative flex flex-col h-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-green-500/40 dark:hover:border-green-500/40 p-6 transition-colors">
            <div className="flex items-center gap-2 text-[12px] mb-4">
              <span className="text-green-500 font-semibold tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-zinc-400 dark:text-zinc-600">|</span>
              <time className="text-zinc-500 dark:text-zinc-500">
                {formatDate(post.date, lang)}
              </time>
            </div>

            <h2 className="text-[15px] font-bold leading-snug text-zinc-900 dark:text-white group-hover:text-green-500 transition-colors mb-2">
              {post.title}
            </h2>

            <p className="text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400 flex-1">
              {post.description}
            </p>

            <footer className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between gap-3">
              <div className="relative z-10 flex flex-wrap gap-1.5">
                {post.tags?.map((tag) => (
                  <Link
                    key={tag}
                    href={`/${lang}/blog?tag=${tag}`}
                    className={`px-2.5 py-1 text-[11.5px] rounded-full border transition-colors ${
                      activeTag === tag
                        ? "border-green-500 text-green-500 bg-green-500/10"
                        : "border-green-500/40 text-green-500 bg-green-500/5 hover:border-green-500 hover:bg-green-500/10"
                    }`}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[12px] text-zinc-400 dark:text-zinc-500">
                  {t.blog.readingTime(post.readingTimeMinutes)}
                </span>
                <ArrowRight className="w-3 h-3 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </footer>

            {/* Link por último no DOM → camada de pintura acima do conteúdo */}
            <Link
              href={`/${lang}/blog/${post.slug}`}
              className="absolute inset-0 rounded-lg"
              aria-label={post.title}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
