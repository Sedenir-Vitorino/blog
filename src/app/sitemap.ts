import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/mdx";
import { LANGUAGES } from "@/lib/i18n";

const BASE_URL = "https://blog.sedenir.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listingUrls: MetadataRoute.Sitemap = LANGUAGES.map((lang) => ({
    url: `${BASE_URL}/${lang}/blog`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
    alternates: {
      languages: Object.fromEntries(LANGUAGES.map((l) => [l, `${BASE_URL}/${l}/blog`])),
    },
  }));

  const postUrls = await Promise.all(
    LANGUAGES.map(async (lang) => {
      const posts = await getAllPosts(lang);
      return posts.map(
        (post): MetadataRoute.Sitemap[number] => ({
          url: `${BASE_URL}/${lang}/blog/${post.slug}`,
          lastModified: new Date(post.date),
          changeFrequency: "monthly",
          priority: 0.6,
        }),
      );
    }),
  );

  return [...listingUrls, ...postUrls.flat()];
}
