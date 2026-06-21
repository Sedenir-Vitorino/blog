import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import { getTranslations } from "@/lib/translations";
import { isValidLang } from "@/lib/i18n";
import PostList from "@/components/PostList";

type Params = Promise<{ lang: string }>;
type SearchParams = Promise<{ tag?: string }>;

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

export default async function BlogIndexPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { lang } = await params;
  const { tag } = await searchParams;
  if (!isValidLang(lang)) notFound();

  const allPosts = await getAllPosts(lang);
  const posts = tag ? allPosts.filter((p) => p.tags?.includes(tag)) : allPosts;
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

        {tag && (
          <div className="mt-6 flex items-center gap-3">
            <span className="px-2.5 py-1 text-[11.5px] rounded-full border border-green-500 text-green-500 bg-green-500/10">
              {t.blog.filteringByTag(tag)}
            </span>
            <Link
              href={`/${lang}/blog`}
              className="text-[12px] text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors underline underline-offset-4"
            >
              {t.blog.clearFilter}
            </Link>
          </div>
        )}
      </header>

      {posts.length === 0 ? (
        <p className="text-[14px] text-zinc-500">
          {tag ? t.blog.noPostsForTag(tag) : t.blog.noPostsYet}
        </p>
      ) : (
        <PostList posts={posts} lang={lang} activeTag={tag} />
      )}
    </main>
  );
}
