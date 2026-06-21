# CLAUDE.md — Portfólio Sedenir Vitorino

## Visão geral

Portfólio pessoal de desenvolvedor Full Stack. Site estático/SSR com suporte a dois idiomas (pt/en), dark mode e formulário de contato funcional via e-mail.

## Comandos principais

```bash
npm run dev      # servidor de desenvolvimento (localhost:3000)
npm run build    # build de produção
npm run start    # serve o build de produção
npm run lint     # lint com ESLint
```

## Stack de tecnologias

### Framework e Runtime
- **Next.js 16** — App Router, SSR, API Routes
- **React 19** — componentes e contexto
- **Node.js** — runtime dos API Routes (contact form)

### Linguagem
- **TypeScript 5** — tipagem estrita em todo o projeto

### Estilização
- **Tailwind CSS 4** — utility-first, sem arquivo de config customizado além de content paths
- **PostCSS** — via `@tailwindcss/postcss`
- **Inter** — fonte via `next/font/google`
- **Dark mode** — classe `dark` no `<html>`, persistida em `localStorage`

### Ícones
- **Lucide React** — ícones SVG como componentes React

### E-mail / Contato
- **Resend** — API de envio de e-mail (`/api/contact`)
- Variáveis necessárias: `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`

### Analytics
- **Vercel Analytics** — `<Analytics />` no layout raiz

### Deploy
- **Vercel** — plataforma de deploy (inferido pelo uso de `@vercel/analytics`)

## Estrutura do projeto

```
src/
├── app/
│   ├── api/contact/route.ts   # endpoint POST para formulário de contato
│   ├── globals.css            # estilos globais + variáveis CSS
│   ├── layout.tsx             # layout raiz, metadados SEO, font, Analytics
│   └── page.tsx               # página principal (composição de seções)
├── components/
│   ├── Hero.tsx               # hero com contador de disponibilidade
│   ├── About.tsx
│   ├── Services.tsx
│   ├── TechStack.tsx          # seção de tecnologias do portfólio
│   ├── Work.tsx               # projetos selecionados
│   ├── Process.tsx            # etapas de trabalho
│   ├── Contact.tsx            # formulário de contato
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ThemeToggle.tsx        # toggle dark/light mode
│   └── Projects.tsx
├── context/
│   └── LanguageContext.tsx    # contexto de idioma (pt/en)
└── lib/
    └── translations.ts        # todas as strings pt/en + AVAILABILITY_DATE
```

## Padrões importantes

### Internacionalização
- Todas as strings ficam em `src/lib/translations.ts`
- Tipo `T` é inferido de `translations.pt` — alterar pt atualiza o tipo automaticamente
- Usar `const { t } = useLanguage()` nos componentes para acessar traduções
- Strings que dependem de valores dinâmicos são funções: `(days: number) => string`

### Contador de disponibilidade
- `AVAILABILITY_DATE` em `translations.ts` linha 4 controla a data alvo
- `getDaysUntilAvailable()` em `Hero.tsx` calcula os dias restantes automaticamente
- Quando a data passa, exibe "Disponível agora" / "Available now"

### Dark mode
- Script inline no `<head>` do layout evita flash de tema incorreto (FOUC)
- Usar classes `dark:` do Tailwind nos componentes
- Toggle persistido em `localStorage` com chave `"theme"`

### Formulário de contato
- API Route em `/api/contact` — sanitiza entrada com `escapeHtml` antes de enviar
- Variáveis de ambiente em `.env.local` (nunca commitado)

## Variáveis de ambiente

```env
RESEND_API_KEY=...
CONTACT_FROM_EMAIL=...
CONTACT_TO_EMAIL=...
```
