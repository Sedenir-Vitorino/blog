/**
 * Configuração central de idiomas suportados pelo blog.
 *
 * Para adicionar um novo idioma:
 *  1. Adicionar o código aqui (ex: 'es')
 *  2. Criar pasta /content/es
 *  3. Adicionar strings de UI em translations.ts
 */

export const LANGUAGES = ["pt", "en"] as const;
export type Lang = (typeof LANGUAGES)[number];

export const DEFAULT_LANG: Lang = "pt";

export function isValidLang(value: string): value is Lang {
  return (LANGUAGES as readonly string[]).includes(value);
}

export function otherLang(lang: Lang): Lang {
  return lang === "pt" ? "en" : "pt";
}
