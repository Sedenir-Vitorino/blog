"use client";

import { useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, X, SlidersHorizontal } from "lucide-react";
import type { BlogFilterData } from "@/lib/blog-filters";
import type { Lang } from "@/lib/i18n";
import { getTranslations, MONTH_NAMES } from "@/lib/translations";

type ActiveFilters = {
  year: number | null;
  month: number | null;
  tags: string[];
};

type Props = {
  filterData: BlogFilterData;
  active: ActiveFilters;
  lang: Lang;
};

function buildUrl(
  pathname: string,
  year: number | null,
  month: number | null,
  tags: string[],
): string {
  const params = new URLSearchParams();
  if (year !== null) params.set("year", String(year));
  if (month !== null) params.set("month", String(month));
  if (tags.length > 0) params.set("tags", tags.join(","));
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

function SectionHeader({
  label,
  open,
  onToggle,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between py-2 text-[11px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
    >
      {label}
      {open ? (
        <ChevronDown className="w-3 h-3" />
      ) : (
        <ChevronRight className="w-3 h-3" />
      )}
    </button>
  );
}

function SidebarContent({
  filterData,
  active,
  lang,
  onNavigate,
}: Props & { onNavigate?: () => void }) {
  const t = getTranslations(lang);
  const monthNames = MONTH_NAMES[lang];
  const router = useRouter();
  const pathname = usePathname();

  const [archiveOpen, setArchiveOpen] = useState(true);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [expandedYears, setExpandedYears] = useState<Set<number>>(
    () => new Set(active.year !== null ? [active.year] : []),
  );

  const hasActiveFilter =
    active.year !== null || active.tags.length > 0;

  const navigate = useCallback(
    (year: number | null, month: number | null, tags: string[]) => {
      router.push(buildUrl(pathname, year, month, tags));
      onNavigate?.();
    },
    [router, pathname, onNavigate],
  );

  function toggleYear(year: number) {
    setExpandedYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) {
        next.delete(year);
      } else {
        next.add(year);
      }
      return next;
    });
  }

  function selectYear(year: number) {
    const sameYear = active.year === year && active.month === null;
    if (sameYear) {
      navigate(null, null, active.tags);
    } else {
      navigate(year, null, active.tags);
      setExpandedYears((prev) => new Set([...prev, year]));
    }
  }

  function selectMonth(year: number, month: number) {
    const same = active.year === year && active.month === month;
    navigate(same ? null : year, same ? null : month, active.tags);
  }

  function toggleTag(tag: string) {
    const next = active.tags.includes(tag)
      ? active.tags.filter((t) => t !== tag)
      : [...active.tags, tag];
    navigate(active.year, active.month, next);
  }

  function clearAll() {
    navigate(null, null, []);
  }

  return (
    <div className="flex flex-col gap-1">
      {/* header row */}
      <div className="mb-3">
        <span className="text-[11px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          {t.blog.filters}
        </span>
      </div>

      {hasActiveFilter && (
        <button
          type="button"
          onClick={clearAll}
          className="mb-3 w-full text-left text-[11.5px] text-green-500 hover:text-green-400 transition-colors"
        >
          {t.blog.clearAll} ×
        </button>
      )}

      {/* ARCHIVE */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-1">
        <SectionHeader
          label={t.blog.archive}
          open={archiveOpen}
          onToggle={() => setArchiveOpen((v) => !v)}
        />
        {archiveOpen && (
          <ul className="flex flex-col gap-0.5 pb-2">
            <li>
              <button
                type="button"
                onClick={() => navigate(null, null, active.tags)}
                className={`w-full text-left px-2 py-1 rounded text-[12.5px] transition-colors ${
                  active.year === null
                    ? "text-green-500 font-semibold"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                {t.blog.allPeriods}
              </button>
            </li>
            {filterData.archive.map((entry) => (
              <li key={entry.year}>
                {/* Year row */}
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => selectYear(entry.year)}
                    className={`flex-1 text-left px-2 py-1 rounded text-[12.5px] transition-colors ${
                      active.year === entry.year
                        ? "text-green-500 font-semibold"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                    }`}
                  >
                    {entry.year}{" "}
                    <span className="text-zinc-400 dark:text-zinc-600 font-normal">
                      ({entry.count})
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleYear(entry.year)}
                    className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    aria-label={
                      expandedYears.has(entry.year) ? "Recolher" : "Expandir"
                    }
                  >
                    {expandedYears.has(entry.year) ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </button>
                </div>
                {/* Month list */}
                {expandedYears.has(entry.year) && (
                  <ul className="ml-3 flex flex-col gap-0.5 border-l border-zinc-200 dark:border-zinc-800 pl-2 mt-0.5 mb-1">
                    {entry.months.map((m) => (
                      <li key={m.month}>
                        <button
                          type="button"
                          onClick={() => selectMonth(entry.year, m.month)}
                          className={`w-full text-left px-2 py-0.5 rounded text-[12px] transition-colors ${
                            active.year === entry.year &&
                            active.month === m.month
                              ? "text-green-500 font-semibold"
                              : "text-zinc-500 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                          }`}
                        >
                          {monthNames[m.month]}{" "}
                          <span className="text-zinc-400 dark:text-zinc-600 font-normal">
                            ({m.count})
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* TAGS */}
      {filterData.tags.length > 0 && (
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-1">
          <SectionHeader
            label={t.blog.tags}
            open={tagsOpen}
            onToggle={() => setTagsOpen((v) => !v)}
          />
          {tagsOpen && (
            <ul className="flex flex-col gap-0.5 pb-2">
              {filterData.tags.map((entry) => {
                const checked = active.tags.includes(entry.tag);
                return (
                  <li key={entry.tag}>
                    <label className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer group hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleTag(entry.tag)}
                        className="sr-only"
                      />
                      <span
                        className={`flex-shrink-0 w-3.5 h-3.5 rounded-sm border transition-colors ${
                          checked
                            ? "bg-green-500 border-green-500"
                            : "border-zinc-300 dark:border-zinc-600 group-hover:border-green-500/60"
                        }`}
                      >
                        {checked && (
                          <svg
                            viewBox="0 0 10 10"
                            className="w-full h-full text-white"
                          >
                            <path
                              d="M2 5l2.5 2.5L8 3"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      <span
                        className={`text-[12.5px] transition-colors ${
                          checked
                            ? "text-green-500 font-medium"
                            : "text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        {entry.tag}{" "}
                        <span className="text-zinc-400 dark:text-zinc-600 font-normal">
                          ({entry.count})
                        </span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default function BlogFilterSidebar(props: Props) {
  const { active, lang } = props;
  const t = getTranslations(lang);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const hasActiveFilter = active.year !== null || active.tags.length > 0;

  return (
    <>
      {/* ── Mobile trigger ─────────────────────────────────── */}
      <div className="lg:hidden mb-6">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-[12.5px] text-zinc-600 dark:text-zinc-400 hover:border-green-500/40 transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          {t.blog.filters}
          {hasActiveFilter && (
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          )}
        </button>
      </div>

      {/* ── Mobile drawer ──────────────────────────────────── */}
      {drawerOpen && (
        <>
          {/* overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setDrawerOpen(false)}
          />
          {/* panel */}
          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto p-5 lg:hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                {t.blog.filters}
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                aria-label="Fechar filtros"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <SidebarContent
              {...props}
              onNavigate={() => setDrawerOpen(false)}
            />
          </div>
        </>
      )}

      {/* ── Desktop sidebar ────────────────────────────────── */}
      <aside className="hidden lg:block w-52 shrink-0 self-start sticky top-24">
        <SidebarContent {...props} />
      </aside>
    </>
  );
}
