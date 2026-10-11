import { checkConfirmToken, confirmContact, newsletterConfig } from "@/lib/newsletter";

/**
 * GET /api/newsletter/confirm?email=&ts=&sig=&lang=
 * Link do e-mail de confirmação: valida a assinatura e ativa o contato no Resend.
 */
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const lang = params.get("lang") === "en" ? "en" : "pt";
  const done = (status: string) =>
    Response.redirect(new URL(`/${lang}/newsletter?status=${status}`, req.url), 303);

  const config = newsletterConfig();
  if (!config) return done("error");

  const email = params.get("email") ?? "";
  const check = checkConfirmToken(config.secret, email, params.get("ts") ?? "", params.get("sig") ?? "");
  if (check !== "valid") return done(check);

  try {
    await confirmContact(config, email);
  } catch (err) {
    console.error("[newsletter]", err);
    return done("error");
  }
  return done("confirmed");
}
