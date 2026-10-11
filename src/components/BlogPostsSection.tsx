"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowDown } from "lucide-react";
import type { PostMeta } from "@/lib/mdx";
import type { Lang } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import { useReveal } from "@/lib/use-reveal";
import PostList from "@/components/PostList";
import FeaturedPost from "@/components/FeaturedPost";
import { useBlogSearch } from "@/components/BlogSearch";

type Props = {
  posts: PostMeta[]; // already filtered by period/tags (server-side)
  lang: Lang;
  featured: PostMeta | null; // null quando há filtros ativos
  featuredImage: string | null;
  newsletter: ReactNode; // fica acima do destaque
  sidebar: ReactNode;
};

// Paginação da lista: primeira leva e quantos entram a cada "Carregar mais"
const INITIAL_COUNT = 10;
const LOAD_MORE_COUNT = 15;

/** Remove combining diacritical marks after NFD decomposition. */
function normalize(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function matchesSearch(post: PostMeta, query: string): boolean {
  if (!query) return true;
  const q = normalize(query);
  return (
    normalize(post.title).includes(q) ||
    normalize(post.description).includes(q) ||
    (post.tags ?? []).some((tag) => normalize(tag).includes(q))
  );
}

export default function BlogPostsSection({
  posts,
  lang,
  featured,
  featuredImage,
  newsletter,
  sidebar,
}: Props) {
  const t = getTranslations(lang);
  const { query } = useBlogSearch();
  const sectionRef = useRef<HTMLDivElement>(null);
  useReveal(sectionRef);

  const results = useMemo(
    () => posts.filter((p) => matchesSearch(p, query)),
    [posts, query],
  );

  // O destaque sai da lista para não duplicar; o contador continua com todos os resultados.
  const showFeatured = featured !== null && !query;
  const listPosts = showFeatured ? results.filter((p) => p.slug !== featured.slug) : results;

  // Volta para a primeira leva sempre que filtros ou busca mudam o resultado
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [prevResults, setPrevResults] = useState(results);
  if (results !== prevResults) {
    setPrevResults(results);
    setVisibleCount(INITIAL_COUNT);
  }
  const visiblePosts = listPosts.slice(0, visibleCount);
  const hasMore = listPosts.length > visibleCount;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <div className="mb-12 sm:mb-14">{newsletter}</div>

      {showFeatured && (
        <div className="mb-12 sm:mb-14">
          <FeaturedPost post={featured} image={featuredImage} lang={lang} />
        </div>
      )}

      <div ref={sectionRef}>
        <div
          data-reveal
          className="flex items-baseline justify-between gap-4 border-y border-line py-5"
        >
          <h2 className="font-serif text-[26px] sm:text-[30px] font-semibold tracking-[-0.01em] text-ink">
            {t.blog.allPosts}
          </h2>
          <span className="shrink-0 text-[14px] text-muted tabular-nums" aria-live="polite">
            {t.blog.postCount(results.length)}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:gap-12 pt-6 lg:pt-8">
          {sidebar}

          <section className="flex-1 min-w-0" aria-label={t.blog.allPosts}>
            {results.length === 0 ? (
              <p className="py-6 text-[15px] text-muted">{t.blog.noPostsFound}</p>
            ) : (
              listPosts.length > 0 && <PostList posts={visiblePosts} lang={lang} />
            )}

            {hasMore && (
              <div className="mt-2 border-t border-line pt-6 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((n) => n + LOAD_MORE_COUNT)}
                  className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-accent underline decoration-1 underline-offset-[5px] hover:decoration-2 transition-colors duration-150"
                >
                  {t.blog.loadMore}
                  <ArrowDown className="w-4 h-4" aria-hidden />
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
