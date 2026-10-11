"use client";
import { Fragment, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PostMeta } from "@/lib/mdx";
import type { Lang } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import { useReveal } from "@/lib/use-reveal";

type Props = {
  posts: PostMeta[];
  lang: Lang;
  activeTag?: string;
};

export function formatPostDate(iso: string, lang: string): string {
  return new Date(iso).toLocaleDateString(lang === "pt" ? "pt-BR" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function PostList({ posts, lang, activeTag }: Props) {
  const listRef = useRef<HTMLUListElement>(null);
  const t = getTranslations(lang);
  useReveal(listRef, [posts]);

  return (
    <ul ref={listRef} className="divide-y divide-line">
      {posts.map((post) => (
        <li key={post.slug} data-reveal className="py-6 first:pt-0 sm:first:pt-1">
          {/*
           * Stretched link: conteúdo vem primeiro no DOM, o <Link> vem por último
           * e cobre o item. As tags ficam acima (z-10) e recebem os cliques.
           * Resolve <a> dentro de <a>.
           */}
          <div className="group relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:gap-8">
            <div>
              <div className="flex flex-wrap items-center gap-x-2 text-[13.5px] text-muted">
                <time>{formatPostDate(post.date, lang)}</time>
                <span aria-hidden>·</span>
                <span>{t.blog.readingTime(post.readingTimeMinutes)}</span>
              </div>

              <h3 className="mt-1.5 font-serif text-[20px] sm:text-[22px] font-semibold leading-snug text-ink group-hover:text-accent transition-colors duration-150">
                {post.title}
              </h3>

              <p className="mt-1.5 text-[15.5px] leading-relaxed text-muted">
                {post.description}
              </p>

              {post.tags && post.tags.length > 0 && (
                <div className="relative z-10 mt-2.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13.5px] text-muted pointer-events-none">
                  {post.tags.map((tag, i) => (
                    <Fragment key={tag}>
                      {i > 0 && <span aria-hidden className="text-line-strong">/</span>}
                      <Link
                        href={`/${lang}/blog?tag=${tag}`}
                        className={`pointer-events-auto transition-colors duration-150 hover:text-accent ${
                          activeTag === tag ? "text-accent font-semibold" : ""
                        }`}
                      >
                        {tag}
                      </Link>
                    </Fragment>
                  ))}
                </div>
              )}
            </div>

            <ArrowRight
              aria-hidden
              className="w-5 h-5 text-accent transition-transform duration-200 group-hover:translate-x-1"
            />

            {/* Link por último no DOM → camada de pintura acima do conteúdo */}
            <Link
              href={`/${lang}/blog/${post.slug}`}
              className="absolute -inset-x-2 -inset-y-2 rounded-[2px]"
              aria-label={post.title}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
