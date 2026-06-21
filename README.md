# Blog Sedenir

Blog pessoal em `blog.sedenir.dev`. Bilíngue (pt/en), conteúdo em MDX.

## Stack

- Next 16 + App Router + TypeScript 5
- Tailwind 4
- MDX via `next-mdx-remote` + `gray-matter`
- Syntax highlighting via `rehype-pretty-code` + `shiki`
- Deploy: Vercel

## Comandos

```bash
npm install
npm run dev    # localhost:3000
npm run build
npm run start
```

## Estrutura

```
content/
├── pt/<slug>.mdx       posts em português
└── en/<slug>.mdx       posts em inglês

src/
├── app/
│   ├── [lang]/         rotas /pt/* e /en/*
│   │   ├── blog/       listagem e post individual
│   │   └── layout.tsx
│   ├── page.tsx        redireciona / pro idioma do navegador
│   └── layout.tsx      raiz
├── lib/
│   ├── i18n.ts         idiomas suportados
│   ├── translations.ts strings de UI
│   └── mdx.ts          leitura e parse dos posts
└── components/         (copiar do portfólio depois)
```

## Como adicionar um post

1. Criar arquivo em `content/pt/<slug-em-portugues>.mdx` com o frontmatter abaixo
2. (Quando traduzir) criar `content/en/<slug-in-english>.mdx` com o **mesmo `translationKey`**

```yaml
---
title: "Título do post"
description: "Resumo curto pra SEO e listagem."
date: 2026-06-21
lang: pt                                    # ou 'en'
translationKey: "id-unico-do-post-2026-06"  # mesmo em ambos idiomas
tags: [tag1, tag2]
draft: false                                 # opcional, true esconde em produção
---
```

O `translationKey` é o que conecta as versões em idiomas diferentes. Slugs (nomes de arquivo) podem ser diferentes em cada idioma — é assim que o SEO de cada idioma fica saudável.

## Variáveis de ambiente

Nenhuma obrigatória ainda. `VERCEL_ANALYTICS_ID` é setada automaticamente pela Vercel no deploy.

## Pendente

- Copiar Navbar, Footer e ThemeToggle do portfólio
- Implementar dark mode (script inline + classes `dark:`)
- Sitemap bilíngue em `app/sitemap.ts`
- RSS feed em `app/[lang]/rss.xml/route.ts`
- robots.txt
