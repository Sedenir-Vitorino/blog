import type { Lang } from "./i18n";

export const MONTH_NAMES: Record<Lang, readonly string[]> = {
  pt: [
    "", // index 0 unused — months are 1-indexed
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ],
  en: [
    "",
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
};

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
      filteringByTag: (tag: string) => `tag: ${tag}`,
      clearFilter: "ver todos",
      noPostsForTag: (tag: string) => `Nenhum post com a tag "${tag}".`,
      // sidebar
      filters: "Filtros",
      archive: "Arquivo",
      tags: "Tags",
      allPeriods: "Todos",
      clearAll: "Limpar",
      postCount: (n: number) => `${n} ${n === 1 ? "artigo" : "artigos"}`,
      noPostsFound: "Nenhum post encontrado para essa combinação de filtros.",
      searchPlaceholder: "Buscar artigos...",
      searchClearLabel: "Limpar busca",
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
      backToList: "back to blog",
      switchToOther: "Ler em português",
      noTranslation: "This post hasn't been translated yet.",
      noPostsYet: "No posts here yet.",
      sectionLabel: "Posts",
      onThisPage: "On this page",
      previousArticle: "Previous article",
      nextArticle: "Next article",
      filteringByTag: (tag: string) => `tag: ${tag}`,
      clearFilter: "see all",
      noPostsForTag: (tag: string) => `No posts tagged "${tag}".`,
      // sidebar
      filters: "Filters",
      archive: "Archive",
      tags: "Tags",
      allPeriods: "All",
      clearAll: "Clear all",
      postCount: (n: number) => `${n} ${n === 1 ? "post" : "posts"}`,
      noPostsFound: "No posts found for this filter combination.",
      searchPlaceholder: "Search posts...",
      searchClearLabel: "Clear search",
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
