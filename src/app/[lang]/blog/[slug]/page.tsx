import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import {
  getPostBySlug,
  findTranslation,
  getAllPosts,
  getAdjacentPosts,
  extractToc,
} from "@/lib/mdx";
import { getTranslations } from "@/lib/translations";
import { isValidLang, otherLang, LANGUAGES } from "@/lib/i18n";
import { mdxComponents } from "@/components/mdx-components";
import TableOfContents from "@/components/TableOfContents";

type Params = Promise<{ lang: string; slug: string }>;

export async function generateStaticParams() {
  const all = await Promise.all(
    LANGUAGES.map(async (lang) => {
      const posts = await getAllPosts(lang);
      return posts.map((p) => ({ lang, slug: p.slug }));
    }),
  );
  return all.flat();
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isValidLang(lang)) return {};

  const post = await getPostBySlug(lang, slug);
  if (!post) return {};

  const translated = await findTranslation(lang, otherLang(lang), post.translationKey);

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/${lang}/blog/${slug}`,
      languages: translated
        ? {
            [lang]: `/${lang}/blog/${slug}`,
            [otherLang(lang)]: `/${otherLang(lang)}/blog/${translated.slug}`,
          }
        : { [lang]: `/${lang}/blog/${slug}` },
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      locale: lang === "pt" ? "pt_BR" : "en_US",
    },
  };
}

export default async function PostPage({ params }: { params: Params }) {
  const { lang, slug } = await params;
  if (!isValidLang(lang)) notFound();

  const post = await getPostBySlug(lang, slug);
  if (!post) notFound();

  const t = getTranslations(lang);
  const translated = await findTranslation(lang, otherLang(lang), post.translationKey);
  const { previous, next } = await getAdjacentPosts(lang, slug);
  const toc = extractToc(post.content);

  return (
    <main className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-12 lg:gap-16">
        {/* ── Coluna principal ── */}
        <article className="min-w-0 max-w-2xl">
          {/* Back link */}
          <Link
            href={`/${lang}/blog`}
            className="inline-flex items-center gap-1.5 text-[13px] text-green-500 hover:text-green-400 transition-colors mb-10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t.blog.backToList}
          </Link>

          {/* Header */}
          <header className="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div className="flex items-center gap-2 text-[12px] text-zinc-500 dark:text-zinc-500 mb-4">
              <time>{formatDate(post.date, lang)}</time>
              <span>·</span>
              <span>{t.blog.readingTime(post.readingTimeMinutes)}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-white mb-3">
              {post.title}
            </h1>

            <p className="text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-400 mb-5">
              {post.description}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-[11.5px] rounded-full border border-green-500/40 text-green-500 bg-green-500/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Language toggle */}
            {translated && (
              <Link
                href={`/${otherLang(lang)}/blog/${translated.slug}`}
                className="inline-block text-[12px] text-zinc-400 dark:text-zinc-500 hover:text-green-500 dark:hover:text-green-500 transition-colors underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-700 hover:decoration-green-500/40"
              >
                {t.blog.switchToOther}
              </Link>
            )}
          </header>

          {/* MDX content */}
          <div className="article-content mt-12">
            <MDXRemote
              source={post.content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  rehypePlugins: [
                    rehypeSlug,
                    [
                      rehypePrettyCode,
                      {
                        theme: { light: "github-light", dark: "github-dark" },
                        keepBackground: false,
                      },
                    ],
                  ],
                },
              }}
            />
          </div>

          {/* Prev / Next navigation */}
          {(previous || next) && (
            <nav className="mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  {previous && (
                    <Link href={`/${lang}/blog/${previous.slug}`} className="group block">
                      <p className="text-[11px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1 flex items-center gap-1">
                        <ArrowLeft className="w-3 h-3" />
                        {t.blog.previousArticle}
                      </p>
                      <p className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-green-500 transition-colors line-clamp-2">
                        {previous.title}
                      </p>
                    </Link>
                  )}
                </div>
                <div className="text-right">
                  {next && (
                    <Link href={`/${lang}/blog/${next.slug}`} className="group block">
                      <p className="text-[11px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1 flex items-center justify-end gap-1">
                        {t.blog.nextArticle}
                        <ArrowRight className="w-3 h-3" />
                      </p>
                      <p className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-green-500 transition-colors line-clamp-2">
                        {next.title}
                      </p>
                    </Link>
                  )}
                </div>
              </div>
            </nav>
          )}
        </article>

        {/* ── Sidebar ── */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents items={toc} label={t.blog.onThisPage} />
          </div>
        </aside>
      </div>
    </main>
  );
}

function formatDate(iso: string, lang: string): string {
  return new Date(iso).toLocaleDateString(lang === "pt" ? "pt-BR" : "en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
