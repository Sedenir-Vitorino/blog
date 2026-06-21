import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Lang } from "./i18n";

export type TocItem = {
  text: string;
  slug: string;
  level: 2 | 3;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function extractToc(content: string): TocItem[] {
  const withoutCode = content.replace(/```[\s\S]*?```/g, "");
  const items: TocItem[] = [];
  for (const line of withoutCode.split("\n")) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line);
    if (!match) continue;
    const level = match[1].length as 2 | 3;
    const text = match[2].trim();
    items.push({ text, slug: slugify(text), level });
  }
  return items;
}

/**
 * Frontmatter obrigatório em todo post.
 * - translationKey é o ID que conecta versões em idiomas diferentes do mesmo post.
 * - slug é derivado do nome do arquivo (não do frontmatter), pra evitar inconsistência.
 */
export type PostFrontmatter = {
  title: string;
  description: string;
  date: string; // ISO 8601 (YYYY-MM-DD)
  lang: Lang;
  translationKey: string;
  tags?: string[];
  draft?: boolean;
};

export type PostMeta = PostFrontmatter & {
  slug: string;
  readingTimeMinutes: number;
};

export type PostWithContent = PostMeta & {
  content: string; // MDX raw — vai ser serializado depois pelo next-mdx-remote
};

const CONTENT_ROOT = path.join(process.cwd(), "content");

/**
 * Lê todos os posts de um idioma.
 * Filtra drafts em produção.
 */
export async function getAllPosts(lang: Lang): Promise<PostMeta[]> {
  const dir = path.join(CONTENT_ROOT, lang);
  let files: string[];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }

  const mdxFiles = files.filter((f) => f.endsWith(".mdx"));

  const posts = await Promise.all(
    mdxFiles.map(async (file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = await fs.readFile(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      const frontmatter = validateFrontmatter(data, file);

      return {
        ...frontmatter,
        slug,
        readingTimeMinutes: Math.ceil(readingTime(content).minutes),
      };
    }),
  );

  const visible = process.env.NODE_ENV === "production"
    ? posts.filter((p) => !p.draft)
    : posts;

  // ordena por data desc
  return visible.sort((a, b) => (a.date > b.date ? -1 : 1));
}

/**
 * Lê um post específico por slug, com conteúdo MDX bruto.
 * Retorna null se não existir.
 */
export async function getPostBySlug(
  lang: Lang,
  slug: string,
): Promise<PostWithContent | null> {
  const file = path.join(CONTENT_ROOT, lang, `${slug}.mdx`);
  let raw: string;
  try {
    raw = await fs.readFile(file, "utf-8");
  } catch {
    return null;
  }
  const { data, content } = matter(raw);
  const frontmatter = validateFrontmatter(data, file);

  return {
    ...frontmatter,
    slug,
    readingTimeMinutes: Math.ceil(readingTime(content).minutes),
    content,
  };
}

export async function getAdjacentPosts(
  lang: Lang,
  currentSlug: string,
): Promise<{ previous: PostMeta | null; next: PostMeta | null }> {
  const posts = await getAllPosts(lang);
  const index = posts.findIndex((p) => p.slug === currentSlug);
  return {
    previous: index > 0 ? posts[index - 1] : null,
    next: index < posts.length - 1 ? posts[index + 1] : null,
  };
}

/**
 * Dado um post em um idioma, encontra a versão traduzida (mesmo translationKey)
 * no outro idioma. Usado pelo botão "Read in English" / "Ler em português".
 */
export async function findTranslation(
  fromLang: Lang,
  toLang: Lang,
  translationKey: string,
): Promise<PostMeta | null> {
  const posts = await getAllPosts(toLang);
  return posts.find((p) => p.translationKey === translationKey) ?? null;
}

/**
 * Validação básica do frontmatter — falha cedo no build se faltar campo obrigatório.
 */
function validateFrontmatter(
  data: Record<string, unknown>,
  filename: string,
): PostFrontmatter {
  const required = ["title", "description", "date", "lang", "translationKey"] as const;
  for (const key of required) {
    if (!data[key]) {
      throw new Error(
        `[mdx] Frontmatter inválido em ${filename}: campo "${key}" obrigatório.`,
      );
    }
  }
  return data as PostFrontmatter;
}
