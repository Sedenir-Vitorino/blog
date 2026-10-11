"use client";
import { useState, useEffect, useRef } from "react";
import type { TocItem } from "@/lib/mdx";

type Props = {
  items: TocItem[];
  label: string;
};

export default function TableOfContents({ items, label }: Props) {
  const h2Items = items.filter((item) => item.level === 2);
  const [activeSlug, setActiveSlug] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (h2Items.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSlug(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );

    const headings = h2Items
      .map((item) => document.getElementById(item.slug))
      .filter((el): el is HTMLElement => el !== null);

    headings.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [h2Items.length]); // eslint-disable-line react-hooks/exhaustive-deps

  if (h2Items.length === 0) return null;

  return (
    <nav aria-label={label} className="text-[14px]">
      <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
        {label}
      </p>
      <ul className="space-y-3 border-l border-line">
        {h2Items.map((item, index) => {
          const isActive = activeSlug === item.slug;
          return (
            <li key={item.slug} className="relative">
              {isActive && (
                <div className="absolute -left-px top-0 bottom-0 w-0.5 bg-accent-strong" />
              )}
              <a
                href={`#${item.slug}`}
                className={`flex items-baseline gap-2.5 pl-4 leading-snug transition-colors duration-150 ${
                  isActive
                    ? "text-ink font-semibold"
                    : "text-muted hover:text-ink"
                }`}
              >
                <span
                  className={`shrink-0 text-[12px] tabular-nums ${
                    isActive ? "text-accent" : "text-muted"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item.text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
