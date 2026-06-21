import type { Lang } from "./i18n";

export const translations = {
  pt: {
    blog: {
      title: "Blog",
      subtitle: "Pensamentos sobre desenvolvimento, engenharia e produto.",
      readingTime: (min: number) => `${min} min de leitura`,
      publishedOn: "Publicado em",
      backToList: "voltar para o blog",
      switchToOther: "Read in English",
      noTranslation: "Esta postagem ainda não foi traduzida.",
      noPostsYet: "Nenhuma postagem por aqui ainda.",
      sectionLabel: "Publicações",
      onThisPage: "Nesta página",
      previousArticle: "Artigo anterior",
      nextArticle: "Próximo artigo",
    },
    footer: {
      rights: "Todos os direitos reservados.",
    },
  },
  en: {
    blog: {
      title: "Blog",
      subtitle: "Thoughts on development, engineering, and product.",
      readingTime: (min: number) => `${min} min read`,
      publishedOn: "Published on",
      backToList: "← back to blog",
      switchToOther: "Ler em português",
      noTranslation: "This post hasn't been translated yet.",
      noPostsYet: "No posts here yet.",
      sectionLabel: "Posts",
      onThisPage: "On this page",
      previousArticle: "Previous article",
      nextArticle: "Next article",
    },
    footer: {
      rights: "All rights reserved.",
    },
  },
} as const;

export type Translations = (typeof translations)[Lang];

export function getTranslations(lang: Lang): Translations {
  return translations[lang];
}
