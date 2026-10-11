import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, getPostImage } from "@/lib/mdx";
import { deriveBlogFilters, filterPosts } from "@/lib/blog-filters";
import { getTranslations } from "@/lib/translations";
import { isValidLang } from "@/lib/i18n";
import BlogFilterSidebar from "@/components/BlogFilterSidebar";
import BlogPostsSection from "@/components/BlogPostsSection";
import NewsletterForm from "@/components/NewsletterForm";
import { BlogSearchProvider, BlogSearchInput } from "@/components/BlogSearch";

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

  // Destaque: não há configuração própria, então usa o post mais recente
  // (allPosts já vem ordenado por data desc). Só aparece sem filtros ativos.
  const hasActiveFilter = activeYear !== null || activeTags.length > 0;
  const featured = hasActiveFilter ? null : (allPosts[0] ?? null);
  const featuredFull = featured ? await getPostBySlug(lang, featured.slug) : null;
  const featuredImage = featuredFull ? getPostImage(featuredFull) : null;

  return (
    <main>
      <BlogSearchProvider>
        <section className="bg-band text-band-ink">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-12 sm:pt-14 sm:pb-16">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] lg:items-end">
              <header>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-band-muted">
                  {t.blog.sectionLabel}
                </p>
                <h1 className="mt-4 font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-[-0.02em]">
                  {t.blog.title}
                </h1>
                <p className="mt-4 max-w-xl text-[17px] sm:text-lg leading-relaxed text-band-muted">
                  {t.blog.subtitle}
                </p>
              </header>
              <BlogSearchInput lang={lang} />
            </div>
          </div>
        </section>

        <BlogPostsSection
          posts={filtered}
          lang={lang}
          featured={featured}
          featuredImage={featuredImage}
          newsletter={<NewsletterForm lang={lang} variant="section" />}
          sidebar={
            <BlogFilterSidebar
              key="filters"
              filterData={filterData}
              active={activeFilters}
              lang={lang}
            />
          }
        />
      </BlogSearchProvider>
    </main>
  );
}
