import {
  buildConfirmUrl,
  confirmationEmail,
  createPendingContact,
  getContact,
  isValidEmail,
  newsletterConfig,
  sendEmail,
} from "@/lib/newsletter";

/**
 * POST /api/newsletter  { email, lang, website }
 * `website` é um honeypot: campo escondido que só robôs preenchem.
 * Respostas: { status: "pending" | "already" } ou { error: "invalid" | "unavailable" | "failed" }
 */
export async function POST(req: Request) {
  const config = newsletterConfig();
  if (!config) return Response.json({ error: "unavailable" }, { status: 503 });

  let body: { email?: unknown; lang?: unknown; website?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  // Robô preencheu o honeypot: responde como sucesso sem fazer nada
  if (typeof body.website === "string" && body.website !== "") {
    return Response.json({ status: "pending" });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const lang = body.lang === "en" ? "en" : "pt";
  if (!isValidEmail(email)) return Response.json({ error: "invalid" }, { status: 400 });

  try {
    const contact = await getContact(config, email);
    if (contact && !contact.unsubscribed) return Response.json({ status: "already" });
    if (!contact) await createPendingContact(config, email);

    const url = buildConfirmUrl(new URL(req.url).origin, config.secret, email, lang);
    await sendEmail(config, { to: email, ...confirmationEmail(lang, url) });
    return Response.json({ status: "pending" });
  } catch (err) {
    console.error("[newsletter]", err);
    return Response.json({ error: "failed" }, { status: 502 });
  }
}
