import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";
import Callout, { Note, Warning, Tip, Summary } from "./Callout";

type CodeProps = ComponentPropsWithoutRef<"code"> & {
  "data-language"?: string;
  "data-theme"?: string;
};

type PreProps = ComponentPropsWithoutRef<"pre"> & {
  "data-language"?: string;
  "data-theme"?: string;
};

function Code({ children, "data-language": dataLanguage, ...props }: CodeProps) {
  if (dataLanguage !== undefined) {
    return (
      <code data-language={dataLanguage} {...props}>
        {children}
      </code>
    );
  }
  return (
    <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-[12.5px] font-medium text-green-600 dark:text-green-400">
      {children}
    </code>
  );
}

function Pre({ children, ...props }: PreProps) {
  return (
    <pre
      className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-4 overflow-x-auto my-6 text-[13px] leading-relaxed"
      {...props}
    >
      {children}
    </pre>
  );
}

export const mdxComponents: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold mt-10 mb-5 text-zinc-900 dark:text-white tracking-tight">
      {children}
    </h1>
  ),
  h2: ({ children, id }) => (
    <h2
      id={id}
      className="text-2xl font-bold mt-14 mb-5 text-zinc-900 dark:text-white tracking-tight"
    >
      {children}
    </h2>
  ),
  h3: ({ children, id }) => (
    <h3
      id={id}
      className="text-lg font-semibold mt-10 mb-3 text-zinc-900 dark:text-white"
    >
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-[14px] leading-relaxed my-5 text-zinc-700 dark:text-zinc-300">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="my-5 text-[14px] leading-relaxed text-zinc-700 dark:text-zinc-300 list-none pl-0 space-y-1.5">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 my-5 text-[14px] leading-relaxed text-zinc-700 dark:text-zinc-300 marker:text-green-500 marker:font-semibold space-y-1.5">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-green-500 hover:text-green-400 underline decoration-green-500/30 underline-offset-4 hover:decoration-green-500 transition-colors"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-green-500/60 pl-5 my-6 text-[14px] italic text-zinc-600 dark:text-zinc-400">
      {children}
    </blockquote>
  ),
  hr: () => (
    <hr className="my-10 border-t border-zinc-200 dark:border-zinc-800" />
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-zinc-900 dark:text-white">{children}</strong>
  ),
  img: ({ src, alt, ...rest }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src as string}
      alt={(alt as string) ?? ""}
      {...rest}
      className="max-w-full h-auto rounded-md my-6"
    />
  ),
  code: Code,
  pre: Pre,
  Callout,
  Note,
  Warning,
  Tip,
  Summary,
};
