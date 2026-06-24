"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";
import type { PostMeta } from "@/lib/mdx";
import type { Lang } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import PostList from "@/components/PostList";

type Props = {
  posts: PostMeta[]; // already filtered by period/tags (server-side)
  lang: Lang;
};

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

export default function BlogPostsSection({ posts, lang }: Props) {
  const t = getTranslations(lang);

  const [inputValue, setInputValue] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // 200ms debounce -- avoids filtering on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(inputValue.trim()), 200);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const results = useMemo(
    () => posts.filter((p) => matchesSearch(p, debouncedQuery)),
    [posts, debouncedQuery],
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Search bar + counter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
          <input
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t.blog.searchPlaceholder}
            className="w-full pl-8 pr-8 py-2 text-[13px] rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-green-500 dark:focus:border-green-500 transition-colors"
          />
          {inputValue && (
            <button
              type="button"
              onClick={() => setInputValue("")}
              aria-label={t.blog.searchClearLabel}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <span className="shrink-0 text-[12px] text-zinc-500 dark:text-zinc-400 tabular-nums">
          {t.blog.postCount(results.length)}
        </span>
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <p className="text-[14px] text-zinc-500 dark:text-zinc-400">
          {t.blog.noPostsFound}
        </p>
      ) : (
        <PostList posts={results} lang={lang} />
      )}
    </div>
  );
}
