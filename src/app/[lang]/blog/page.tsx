import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getAllPosts } from "@/lib/mdx";
import { getTranslations } from "@/lib/translations";
import { isValidLang } from "@/lib/i18n";

type Params = Promise<{ lang: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLang(lang)) return {};
  const t = getTranslations(lang);
  return {
    title: t.blog.title,
    description: t.blog.subtitle,
    alternates: {
      canonical: `/${lang}/blog`,
      languages: { pt: "/pt/blog", en: "/en/blog" },
    },
  };
}

export default async function BlogIndexPage({ params }: { params: Params }) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();

  const posts = await getAllPosts(lang);
  const t = getTranslations(lang);

  return (
    <main className="max-w-4xl mx-auto px-6 py-16 lg:py-24">
      <header className="mb-12">
        <p className="text-[11px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
          <span className="text-green-500">&gt;_</span>{" "}
          {t.blog.sectionLabel}
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight text-zinc-900 dark:text-white">
          {t.blog.title}
        </h1>
        <p className="mt-4 text-[14px] text-zinc-600 dark:text-zinc-400 max-w-xl">
          {t.blog.subtitle}
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-[14px] text-zinc-500">{t.blog.noPostsYet}</p>
      ) : (
        <ul className={`grid gap-5 ${posts.length === 1 ? "" : "md:grid-cols-2"}`}>
          {posts.map((post, index) => (
            <li key={post.slug}>
              <Link
                href={`/${lang}/blog/${post.slug}`}
                className="group flex flex-col h-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-green-500/40 dark:hover:border-green-500/40 p-6 transition-colors"
              >
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
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-[11.5px] rounded-full border border-green-500/40 text-green-500 bg-green-500/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[12px] text-zinc-400 dark:text-zinc-500">
                      {t.blog.readingTime(post.readingTimeMinutes)}
                    </span>
                    <ArrowRight className="w-3 h-3 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </footer>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

function formatDate(iso: string, lang: string): string {
  return new Date(iso).toLocaleDateString(lang === "pt" ? "pt-BR" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
