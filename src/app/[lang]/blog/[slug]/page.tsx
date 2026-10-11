import { Fragment } from "react";
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
  getPostImage,
} from "@/lib/mdx";
import { getTranslations } from "@/lib/translations";
import { isValidLang, otherLang, LANGUAGES } from "@/lib/i18n";
import { mdxComponents } from "@/components/mdx-components";
import TableOfContents from "@/components/TableOfContents";
import NewsletterForm from "@/components/NewsletterForm";

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
  const image = getPostImage(post) ?? `/${lang}/blog/${slug}/og`;

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
      url: `/${lang}/blog/${slug}`,
      siteName: "Sedenir.dev",
      images: [{ url: image, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [image],
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
    <main>
      <article>
        {/* Header */}
        <header className="bg-band text-band-ink">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-12 sm:pt-10 sm:pb-16">
            {/* Back link */}
            <Link
              href={`/${lang}/blog`}
              className="inline-flex items-center gap-1.5 text-[14px] font-medium text-band-accent hover:text-band-ink transition-colors duration-150"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.blog.backToList}
            </Link>

            <div className="mt-8 sm:mt-10 max-w-3xl">
              <div className="flex flex-wrap items-center gap-x-2 text-[14px] text-band-muted mb-4">
                <time>{formatDate(post.date, lang)}</time>
                <span aria-hidden>·</span>
                <span>{t.blog.readingTime(post.readingTimeMinutes)}</span>
              </div>

              <h1 className="font-serif text-[34px] sm:text-5xl font-semibold leading-[1.1] tracking-[-0.015em] mb-5">
                {post.title}
              </h1>

              <p className="text-[17px] sm:text-[19px] leading-relaxed text-band-muted mb-6">
                {post.description}
              </p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[14px] text-band-muted mb-5">
                  {post.tags.map((tag, i) => (
                    <Fragment key={tag}>
                      {i > 0 && <span aria-hidden className="text-band-line">/</span>}
                      <Link
                        href={`/${lang}/blog?tag=${tag}`}
                        className="hover:text-band-accent transition-colors duration-150"
                      >
                        {tag}
                      </Link>
                    </Fragment>
                  ))}
                </div>
              )}

              {/* Language toggle */}
              {translated && (
                <Link
                  href={`/${otherLang(lang)}/blog/${translated.slug}`}
                  className="inline-block text-[14px] font-medium text-band-accent underline underline-offset-4 decoration-1 hover:decoration-2 transition-colors duration-150"
                >
                  {t.blog.switchToOther}
                </Link>
              )}
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_240px] gap-12 lg:gap-16">
          {/* ── Coluna principal ── */}
          <div className="min-w-0">
            {/* MDX content */}
            <div className="article-content">
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

            <div className="mt-16 max-w-[70ch]">
              <NewsletterForm lang={lang} variant="section" />
            </div>

            {/* Prev / Next navigation */}
            {(previous || next) && (
              <nav className="mt-14 pt-8 border-t border-line max-w-[70ch]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    {previous && (
                      <Link href={`/${lang}/blog/${previous.slug}`} className="group block">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted mb-2 flex items-center gap-1.5">
                          <ArrowLeft className="w-3.5 h-3.5 text-accent" />
                          {t.blog.previousArticle}
                        </p>
                        <p className="font-serif text-[18px] font-semibold leading-snug text-ink group-hover:text-accent transition-colors duration-150 line-clamp-2">
                          {previous.title}
                        </p>
                      </Link>
                    )}
                  </div>
                  <div className="sm:text-right">
                    {next && (
                      <Link href={`/${lang}/blog/${next.slug}`} className="group block">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted mb-2 flex items-center sm:justify-end gap-1.5">
                          {t.blog.nextArticle}
                          <ArrowRight className="w-3.5 h-3.5 text-accent" />
                        </p>
                        <p className="font-serif text-[18px] font-semibold leading-snug text-ink group-hover:text-accent transition-colors duration-150 line-clamp-2">
                          {next.title}
                        </p>
                      </Link>
                    )}
                  </div>
                </div>
              </nav>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents items={toc} label={t.blog.onThisPage} />
            </div>
          </aside>
        </div>
      </article>
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
