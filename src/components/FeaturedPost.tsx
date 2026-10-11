import { Fragment } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PostMeta } from "@/lib/mdx";
import type { Lang } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import { formatPostDate } from "@/components/PostList";

type Props = {
  post: PostMeta;
  image: string | null; // imagem já existente no artigo; null → composição tipográfica
  lang: Lang;
};

export default function FeaturedPost({ post, image, lang }: Props) {
  const t = getTranslations(lang);
  const href = `/${lang}/blog/${post.slug}`;

  return (
    <section aria-labelledby="featured-post-title">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
        {t.blog.latestPost}
      </p>

      <article className="grid overflow-hidden rounded-[2px] border border-line bg-surface md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <div className="flex flex-col p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-x-2 text-[13.5px] text-muted">
            <time dateTime={new Date(post.date).toISOString()}>{formatPostDate(post.date, lang)}</time>
            <span aria-hidden>·</span>
            <span>{t.blog.readingTime(post.readingTimeMinutes)}</span>
          </div>

          <h2
            id="featured-post-title"
            className="mt-3 font-serif text-[28px] sm:text-[34px] lg:text-[38px] font-semibold leading-[1.12] tracking-[-0.01em] text-ink"
          >
            <Link href={href} className="hover:text-accent transition-colors duration-150">
              {post.title}
            </Link>
          </h2>

          <p className="mt-4 text-[16.5px] leading-relaxed text-muted">{post.description}</p>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13.5px] text-muted">
              {post.tags.map((tag, i) => (
                <Fragment key={tag}>
                  {i > 0 && <span aria-hidden className="text-line-strong">/</span>}
                  <Link
                    href={`/${lang}/blog?tag=${tag}`}
                    className="hover:text-accent transition-colors duration-150"
                  >
                    {tag}
                  </Link>
                </Fragment>
              ))}
            </div>
          )}

          <Link
            href={href}
            className="mt-7 inline-flex items-center gap-1.5 self-start text-[15px] font-semibold text-accent underline decoration-1 underline-offset-[5px] hover:decoration-2 transition-colors duration-150"
          >
            {t.blog.readArticle}
            <ArrowUpRight className="w-4 h-4" aria-hidden />
          </Link>
        </div>

        {/* Visual: imagem do próprio artigo ou composição tipográfica (sem imagens inventadas) */}
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden
          className={`relative order-first block aspect-[16/10] md:order-none md:aspect-auto md:min-h-[340px] ${
            image ? "" : "bg-steel"
          }`}
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt=""
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-contain p-4 sm:p-6"
            />
          ) : (
            <TypographicCover post={post} lang={lang} />
          )}
        </Link>
      </article>
    </section>
  );
}

function TypographicCover({ post, lang }: { post: PostMeta; lang: Lang }) {
  const date = new Date(post.date);
  const locale = lang === "pt" ? "pt-BR" : "en-US";
  const day = date.toLocaleDateString(locale, { day: "2-digit", timeZone: "UTC" });
  const monthYear = date.toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-8 lg:p-10 text-on-steel">
      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-on-steel-muted">
        sedenir.dev / blog
      </span>
      <div>
        <span aria-hidden className="mb-5 block h-px w-12 bg-accent-strong" />
        <p className="font-serif text-7xl font-semibold leading-none">{day}</p>
        <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-on-steel-muted">
          {monthYear}
        </p>
        {post.tags && post.tags.length > 0 && (
          <p className="mt-6 text-[13.5px] text-on-steel-muted">{post.tags.slice(0, 3).join(" / ")}</p>
        )}
      </div>
    </div>
  );
}
