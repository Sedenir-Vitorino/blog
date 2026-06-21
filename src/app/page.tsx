import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { DEFAULT_LANG, isValidLang } from "@/lib/i18n";

export default async function RootPage() {
  const h = await headers();
  const acceptLanguage = h.get("accept-language") ?? "";
  const preferred = acceptLanguage.split(",")[0]?.split("-")[0]?.toLowerCase() ?? "";

  const lang = isValidLang(preferred) ? preferred : DEFAULT_LANG;
  redirect(`/${lang}/blog`);
}
