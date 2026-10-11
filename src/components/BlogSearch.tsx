"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Search, X } from "lucide-react";
import type { Lang } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";

type SearchState = {
  inputValue: string;
  setInputValue: (value: string) => void;
  query: string; // valor com debounce, usado para filtrar
};

const SearchContext = createContext<SearchState | null>(null);

/**
 * Compartilha a busca entre o campo (na abertura da página) e a lista de posts.
 */
export function BlogSearchProvider({ children }: { children: ReactNode }) {
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");

  // 200ms debounce -- avoids filtering on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setQuery(inputValue.trim()), 200);
    return () => clearTimeout(timer);
  }, [inputValue]);

  return (
    <SearchContext.Provider value={{ inputValue, setInputValue, query }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useBlogSearch(): SearchState {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useBlogSearch precisa estar dentro de BlogSearchProvider");
  return ctx;
}

export function BlogSearchInput({ lang }: { lang: Lang }) {
  const t = getTranslations(lang);
  const { inputValue, setInputValue } = useBlogSearch();

  return (
    <div className="relative w-full">
      <Search
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-band-muted pointer-events-none"
        aria-hidden
      />
      <input
        type="search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={t.blog.searchPlaceholder}
        aria-label={t.blog.searchPlaceholder}
        className="w-full rounded-[2px] border border-band-line bg-transparent py-3 pl-10 pr-10 text-[15px] text-band-ink placeholder:text-band-muted focus:outline-none focus-visible:outline-none focus:border-band-accent focus:ring-1 focus:ring-band-accent transition-colors duration-150 [&::-webkit-search-cancel-button]:hidden"
      />
      {inputValue && (
        <button
          type="button"
          onClick={() => setInputValue("")}
          aria-label={t.blog.searchClearLabel}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-band-muted hover:text-band-ink transition-colors duration-150"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
