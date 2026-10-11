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
      latestPost: "Publicação mais recente",
      allPosts: "Todas as publicações",
      readArticle: "Ler artigo",
      loadMore: "Carregar mais publicações",
    },
    nav: {
      portfolio: "Portfólio",
    },
    newsletter: {
      title: "Newsletter",
      description: "Receba os novos artigos por e-mail. Sem spam; cancele quando quiser.",
      emailLabel: "Seu e-mail",
      placeholder: "seu@email.com",
      submit: "Inscrever",
      sending: "Enviando...",
      pending: "Quase lá! Enviamos um link de confirmação para o seu e-mail.",
      already: "Esse e-mail já está inscrito. Obrigado!",
      invalid: "Digite um e-mail válido.",
      failed: "Não foi possível inscrever agora. Tente novamente em instantes.",
      unavailable: "A newsletter está temporariamente indisponível.",
      statusPage: {
        confirmed: { title: "Inscrição confirmada", body: "Pronto! Você vai receber os próximos artigos por e-mail." },
        expired: { title: "Link expirado", body: "Esse link de confirmação venceu. Inscreva-se de novo para receber um link novo." },
        invalid: { title: "Link inválido", body: "Não conseguimos validar esse link. Confira se ele foi copiado inteiro ou inscreva-se de novo." },
        error: { title: "Algo deu errado", body: "Não foi possível confirmar agora. Tente abrir o link de novo em instantes." },
      },
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
      latestPost: "Latest post",
      allPosts: "All posts",
      readArticle: "Read article",
      loadMore: "Load more posts",
    },
    nav: {
      portfolio: "Portfolio",
    },
    newsletter: {
      title: "Newsletter",
      description: "Get new articles by email. No spam; unsubscribe anytime.",
      emailLabel: "Your email",
      placeholder: "you@email.com",
      submit: "Subscribe",
      sending: "Sending...",
      pending: "Almost there! We sent a confirmation link to your email.",
      already: "This email is already subscribed. Thanks!",
      invalid: "Enter a valid email.",
      failed: "Couldn't subscribe right now. Please try again shortly.",
      unavailable: "The newsletter is temporarily unavailable.",
      statusPage: {
        confirmed: { title: "Subscription confirmed", body: "Done! You'll get the next articles by email." },
        expired: { title: "Link expired", body: "This confirmation link has expired. Subscribe again to get a new one." },
        invalid: { title: "Invalid link", body: "We couldn't validate this link. Check that it was copied in full, or subscribe again." },
        error: { title: "Something went wrong", body: "We couldn't confirm right now. Try opening the link again shortly." },
      },
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
