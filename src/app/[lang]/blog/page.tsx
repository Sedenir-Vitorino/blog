import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/mdx";
import { deriveBlogFilters, filterPosts } from "@/lib/blog-filters";
import { getTranslations } from "@/lib/translations";
import { isValidLang } from "@/lib/i18n";
import BlogFilterSidebar from "@/components/BlogFilterSidebar";
import BlogPostsSection from "@/components/BlogPostsSection";

type Params = Promise<{ lang: string }>;
type SearchParams = Promise<{
  year?: string;
  month?: string;
  tags?: string;
  tag?: string; // compat: legacy singular ?tag=
}>;

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
  if (!isValidLang(lang)) notFound();

  const { year: yearStr, month: monthStr, tags: tagsStr, tag: legacyTag } =
    await searchParams;
  const t = getTranslations(lang);

  // Parse filters from URL — guard against non-numeric values
  const yearNum = yearStr ? parseInt(yearStr, 10) : NaN;
  const monthNum = monthStr ? parseInt(monthStr, 10) : NaN;
  const activeYear = Number.isFinite(yearNum) ? yearNum : null;
  const activeMonth = Number.isFinite(monthNum) ? monthNum : null;

  // Normalise: ?tag= (legacy singular) → ?tags= (new). If both present, prefer tags.
  const rawTagsStr = tagsStr ?? legacyTag ?? "";
  const activeTags = rawTagsStr
    ? rawTagsStr.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const allPosts = await getAllPosts(lang);
  const filterData = deriveBlogFilters(allPosts);
  const filtered = filterPosts(allPosts, activeYear, activeMonth, activeTags);

  const activeFilters = { year: activeYear, month: activeMonth, tags: activeTags };

  return (
    <main className="max-w-5xl mx-auto px-6 py-16 lg:py-24">
      <header className="mb-10">
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

      {/* Mobile trigger lives inside BlogFilterSidebar */}
      <div className="flex items-start gap-10">
        <BlogFilterSidebar
          filterData={filterData}
          active={activeFilters}
          lang={lang}
        />

        <section className="flex-1 min-w-0">
          <BlogPostsSection posts={filtered} lang={lang} />
        </section>
      </div>
    </main>
  );
}
