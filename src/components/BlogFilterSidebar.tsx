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
      aria-expanded={open}
      className="flex w-full items-center justify-between py-2 text-[15px] font-semibold text-ink hover:text-accent transition-colors duration-150"
    >
      {label}
      {open ? (
        <ChevronDown className="w-3.5 h-3.5 text-muted" />
      ) : (
        <ChevronRight className="w-3.5 h-3.5 text-muted" />
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
      <div className="mb-2">
        <span className="text-[18px] font-semibold text-ink">
          {t.blog.filters}
        </span>
      </div>

      {hasActiveFilter && (
        <button
          type="button"
          onClick={clearAll}
          className="mb-2 w-full text-left text-[14px] font-medium text-accent hover:text-ink transition-colors duration-150"
        >
          {t.blog.clearAll} ×
        </button>
      )}

      {/* ARCHIVE */}
      <div className="pt-1">
        <SectionHeader
          label={t.blog.archive}
          open={archiveOpen}
          onToggle={() => setArchiveOpen((v) => !v)}
        />
        {archiveOpen && (
          <ul className="flex flex-col gap-0.5 pb-3">
            <li>
              <button
                type="button"
                onClick={() => navigate(null, null, active.tags)}
                className={`w-full text-left border-l-2 pl-4 py-1.5 text-[15px] transition-colors duration-150 ${
                  active.year === null
                    ? "border-accent-strong text-ink font-semibold"
                    : "border-transparent text-muted hover:text-ink"
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
                    className={`flex-1 text-left border-l-2 pl-4 py-1.5 text-[15px] transition-colors duration-150 ${
                      active.year === entry.year
                        ? "border-accent-strong text-ink font-semibold"
                        : "border-transparent text-muted hover:text-ink"
                    }`}
                  >
                    {entry.year}{" "}
                    <span className="text-muted font-normal">
                      ({entry.count})
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleYear(entry.year)}
                    className="p-1.5 text-muted hover:text-ink transition-colors duration-150"
                    aria-label={
                      expandedYears.has(entry.year) ? "Recolher" : "Expandir"
                    }
                  >
                    {expandedYears.has(entry.year) ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                {/* Month list */}
                {expandedYears.has(entry.year) && (
                  <ul className="ml-4 flex flex-col gap-0.5 border-l border-line pl-1 mt-0.5 mb-1">
                    {entry.months.map((m) => (
                      <li key={m.month}>
                        <button
                          type="button"
                          onClick={() => selectMonth(entry.year, m.month)}
                          className={`w-full text-left border-l-2 pl-3 py-1 text-[14px] transition-colors duration-150 ${
                            active.year === entry.year &&
                            active.month === m.month
                              ? "border-accent-strong text-ink font-semibold"
                              : "border-transparent text-muted hover:text-ink"
                          }`}
                        >
                          {monthNames[m.month]}{" "}
                          <span className="text-muted font-normal">
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
        <div className="border-t border-line mt-2 pt-3">
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
                    <label className="flex items-center gap-2.5 py-1.5 rounded-[2px] cursor-pointer group has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-accent-strong">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleTag(entry.tag)}
                        className="sr-only"
                      />
                      <span
                        className={`flex-shrink-0 w-4 h-4 rounded-[2px] border transition-colors duration-150 ${
                          checked
                            ? "bg-accent border-accent"
                            : "border-line-strong group-hover:border-accent"
                        }`}
                      >
                        {checked && (
                          <svg
                            viewBox="0 0 10 10"
                            className="w-full h-full text-bg"
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
                        className={`text-[15px] transition-colors duration-150 ${
                          checked
                            ? "text-ink font-semibold"
                            : "text-muted group-hover:text-ink"
                        }`}
                      >
                        {entry.tag}{" "}
                        <span className="text-muted font-normal">
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
          className="flex w-full items-center gap-2 px-4 py-3 rounded-[2px] border border-line bg-surface text-[15px] font-medium text-ink hover:border-accent transition-colors duration-150"
        >
          <SlidersHorizontal className="w-4 h-4 text-accent" />
          {t.blog.filters}
          {hasActiveFilter && (
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          )}
        </button>
      </div>

      {/* ── Mobile drawer ──────────────────────────────────── */}
      {drawerOpen && (
        <>
          {/* overlay */}
          <div
            className="fixed inset-0 z-[60] bg-black/50 lg:hidden"
            onClick={() => setDrawerOpen(false)}
          />
          {/* panel */}
          <div className="fixed inset-y-0 left-0 z-[70] w-80 max-w-[85vw] bg-bg border-r border-line overflow-y-auto p-6 lg:hidden">
            <div className="flex items-center justify-end -mb-8">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 text-muted hover:text-ink transition-colors duration-150"
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
      <aside data-reveal className="hidden lg:block w-56 shrink-0 self-start sticky top-24 border-r border-line pr-8 pb-2">
        <SidebarContent {...props} />
      </aside>
    </>
  );
}
