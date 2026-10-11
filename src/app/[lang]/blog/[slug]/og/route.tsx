import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/mdx";
import { isValidLang } from "@/lib/i18n";

/**
 * Cartão de prévia (1200x630) para posts sem imagem própria.
 * Usado como og:image em generateMetadata quando getPostImage retorna null.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lang: string; slug: string }> },
) {
  const { lang, slug } = await params;
  const post = isValidLang(lang) ? await getPostBySlug(lang, slug) : null;
  if (!post) return new Response("Not found", { status: 404 });

  // gray-matter converte a data YAML em Date (meia-noite UTC)
  const date = new Date(post.date).toLocaleDateString(lang === "pt" ? "pt-BR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#09090b",
          color: "#fafafa",
        }}
      >
        <div style={{ display: "flex", fontSize: 36, fontWeight: 700, color: "#22c55e" }}>
          {">_ sedenir.dev"}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: post.title.length > 90 ? 52 : 64,
            fontWeight: 700,
            lineHeight: 1.15,
          }}
        >
          {post.title}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#a1a1aa" }}>
          {`blog.sedenir.dev · ${date}`}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
