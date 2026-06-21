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
    <nav aria-label={label} className="text-[12px]">
      <p className="mb-5 uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        {label}
      </p>
      <ul className="space-y-3 border-l border-zinc-200 dark:border-zinc-800">
        {h2Items.map((item, index) => {
          const isActive = activeSlug === item.slug;
          return (
            <li key={item.slug} className="relative">
              {isActive && (
                <div className="absolute -left-px top-0 bottom-0 w-px bg-green-500" />
              )}
              <a
                href={`#${item.slug}`}
                className={`flex items-baseline gap-2 pl-4 transition-colors ${
                  isActive
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                <span
                  className={`shrink-0 tabular-nums ${
                    isActive ? "text-green-500" : "text-zinc-400 dark:text-zinc-600"
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
