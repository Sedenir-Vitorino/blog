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
    <code className="px-1.5 py-0.5 rounded-[2px] border border-line bg-surface-2 font-mono text-[0.82em] text-ink [overflow-wrap:anywhere]">
      {children}
    </code>
  );
}

function Pre({ children, ...props }: PreProps) {
  return (
    <pre
      className="rounded-[2px] border border-line bg-surface-2 p-4 sm:p-5 overflow-x-auto my-8 font-mono text-[13.5px] leading-relaxed"
      {...props}
    >
      {children}
    </pre>
  );
}

export const mdxComponents: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="font-serif text-[28px] sm:text-[32px] font-semibold leading-tight mt-12 mb-5 text-ink tracking-[-0.01em]">
      {children}
    </h1>
  ),
  h2: ({ children, id }) => (
    <h2
      id={id}
      className="font-serif text-[25px] sm:text-[29px] font-semibold leading-tight mt-16 mb-5 text-ink tracking-[-0.01em] scroll-mt-24"
    >
      {children}
    </h2>
  ),
  h3: ({ children, id }) => (
    <h3
      id={id}
      className="font-serif text-[20px] sm:text-[22px] font-semibold leading-snug mt-10 mb-3 text-ink scroll-mt-24"
    >
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="my-6">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="my-6 list-none pl-0 space-y-2">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 my-6 marker:text-accent marker:font-sans marker:font-semibold space-y-2">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li>{children}</li>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-accent underline decoration-1 underline-offset-[3px] hover:decoration-2 transition-colors duration-150 [overflow-wrap:anywhere]"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-accent-strong pl-5 sm:pl-6 my-8 italic text-muted [&>p]:my-3">
      {children}
    </blockquote>
  ),
  hr: () => (
    <hr className="my-12 border-t border-line" />
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-ink">{children}</strong>
  ),
  img: ({ src, alt, ...rest }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src as string}
      alt={(alt as string) ?? ""}
      {...rest}
      className="max-w-full h-auto rounded-[2px] border border-line my-8"
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
