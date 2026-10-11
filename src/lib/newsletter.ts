import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Newsletter via Resend (API de contatos + envio de e-mails), com double opt-in:
 * o contato é criado como `unsubscribed: true` e só passa a receber Broadcasts
 * depois de clicar no link assinado do e-mail de confirmação.
 *
 * Variáveis de ambiente:
 * - RESEND_API_KEY      chave da API do Resend
 * - NEWSLETTER_FROM     remetente de um domínio verificado, ex.: "Sedenir.dev <newsletter@sedenir.dev>"
 * - NEWSLETTER_SECRET   segredo para assinar os links de confirmação (string longa e aleatória)
 * - RESEND_SEGMENT_ID   opcional: segmento onde os novos contatos entram
 * - SITE_URL            opcional: base dos links de confirmação (padrão: https://blog.sedenir.dev)
 */

const RESEND_API = "https://api.resend.com";
const CONFIRM_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

export function newsletterConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NEWSLETTER_FROM;
  const secret = process.env.NEWSLETTER_SECRET;
  if (!apiKey || !from || !secret) return null;
  return {
    apiKey,
    from,
    secret,
    segmentId: process.env.RESEND_SEGMENT_ID,
    // Base fixa: o link do e-mail sempre leva ao site publicado, mesmo se a inscrição
    // vier de um ambiente local ou de preview
    siteUrl: (process.env.SITE_URL ?? "https://blog.sedenir.dev").replace(/\/$/, ""),
  };
}

export type NewsletterConfig = NonNullable<ReturnType<typeof newsletterConfig>>;

export function isValidEmail(email: string): boolean {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function resend(config: NewsletterConfig, path: string, init: RequestInit = {}) {
  return fetch(`${RESEND_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });
}

/** Retorna o contato pelo e-mail, ou null se não existir. */
export async function getContact(config: NewsletterConfig, email: string) {
  const res = await resend(config, `/contacts/${encodeURIComponent(email)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Resend get contact: ${res.status}`);
  return (await res.json()) as { id: string; email: string; unsubscribed: boolean };
}

/** Cria o contato como pendente (unsubscribed) até a confirmação. */
export async function createPendingContact(config: NewsletterConfig, email: string) {
  const res = await resend(config, "/contacts", {
    method: "POST",
    body: JSON.stringify({
      email,
      unsubscribed: true,
      ...(config.segmentId ? { segments: [{ id: config.segmentId }] } : {}),
    }),
  });
  if (!res.ok) throw new Error(`Resend create contact: ${res.status}`);
}

export async function confirmContact(config: NewsletterConfig, email: string) {
  const res = await resend(config, `/contacts/${encodeURIComponent(email)}`, {
    method: "PATCH",
    body: JSON.stringify({ unsubscribed: false }),
  });
  if (!res.ok) throw new Error(`Resend update contact: ${res.status}`);
}

export async function sendEmail(
  config: NewsletterConfig,
  { to, subject, html, text }: { to: string; subject: string; html: string; text: string },
) {
  const res = await resend(config, "/emails", {
    method: "POST",
    body: JSON.stringify({ from: config.from, to: [to], subject, html, text }),
  });
  if (!res.ok) throw new Error(`Resend send email: ${res.status}`);
}

// ── Link de confirmação assinado (sem banco de dados) ─────────────────────

function sign(secret: string, email: string, ts: number): string {
  return createHmac("sha256", secret).update(`${email}:${ts}`).digest("base64url");
}

export function buildConfirmUrl(origin: string, secret: string, email: string, lang: string) {
  const ts = Date.now();
  const params = new URLSearchParams({ email, ts: String(ts), lang, sig: sign(secret, email, ts) });
  return `${origin}/api/newsletter/confirm?${params}`;
}

export type TokenCheck = "valid" | "invalid" | "expired";

export function checkConfirmToken(
  secret: string,
  email: string,
  ts: string,
  sig: string,
): TokenCheck {
  const tsNum = Number(ts);
  if (!email || !Number.isFinite(tsNum) || !sig) return "invalid";
  const expected = Buffer.from(sign(secret, email, tsNum));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return "invalid";
  if (Date.now() - tsNum > CONFIRM_TTL_MS) return "expired";
  return "valid";
}

// ── E-mail de confirmação ────────────────────────────────────────────────

const confirmCopy = {
  pt: {
    subject: "Confirme sua inscrição na newsletter do sedenir.dev",
    heading: "Confirme sua inscrição",
    body: "Você pediu para receber os novos artigos do blog sedenir.dev por e-mail. Clique no botão abaixo para confirmar.",
    button: "Confirmar inscrição",
    ignore: "Se não foi você, ignore este e-mail: nada será enviado. O link vale por 7 dias.",
  },
  en: {
    subject: "Confirm your subscription to the sedenir.dev newsletter",
    heading: "Confirm your subscription",
    body: "You asked to receive new articles from the sedenir.dev blog by email. Click the button below to confirm.",
    button: "Confirm subscription",
    ignore: "If this wasn't you, just ignore this email: nothing will be sent. The link is valid for 7 days.",
  },
} as const;

export function confirmationEmail(lang: "pt" | "en", url: string) {
  const c = confirmCopy[lang];
  const html = `<!doctype html>
<html lang="${lang}"><body style="margin:0;padding:0;background:#f0f2f1;font-family:Georgia,'Times New Roman',serif;color:#20272d">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f1;padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#f7f8f7;border:1px solid #d5dadb">
        <tr><td style="background:#20272d;padding:18px 28px;font-family:Arial,Helvetica,sans-serif;font-size:17px;font-weight:bold;color:#f0f2f1">
          sedenir.dev <span style="color:#c68f63;font-size:11px;letter-spacing:3px;padding-left:10px">BLOG</span>
        </td></tr>
        <tr><td style="padding:32px 28px">
          <h1 style="margin:0 0 16px;font-size:26px;line-height:1.2;font-weight:600">${c.heading}</h1>
          <p style="margin:0 0 28px;font-size:17px;line-height:1.6">${c.body}</p>
          <a href="${url}" style="display:inline-block;background:#b98357;color:#20272d;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;text-decoration:none;padding:12px 22px;border-radius:2px">${c.button}</a>
          <p style="margin:28px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;color:#5a656e">${c.ignore}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
  const text = `${c.heading}\n\n${c.body}\n\n${url}\n\n${c.ignore}`;
  return { subject: c.subject, html, text };
}
